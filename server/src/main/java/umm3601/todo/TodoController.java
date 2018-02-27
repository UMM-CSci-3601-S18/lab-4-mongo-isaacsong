package umm3601.todo;

import com.google.gson.Gson;
import com.mongodb.Block;
import com.mongodb.MongoClient;
import com.mongodb.MongoException;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Filters;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.*;

import static com.mongodb.client.model.Filters.eq;

public class TodoController {
    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> todoCollection;

    /**
     * Construct a controller for todos.
     *
     * @param database the database containing todo data
     */
    public TodoController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        todoCollection = database.getCollection("todos");
    }

    /**
     * Helper method that gets a single todo specified by the `id`
     * parameter in the request.
     *
     * @param id the Mongo ID of the desired todo
     * @return the desired todo as a JSON object if the todo with that ID is found,
     * and `null` if no todo with that ID is found
     */
    public String getTodo(String id) {
        FindIterable<Document> jsonTodos
            = todoCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonTodos.iterator();
        if (iterator.hasNext()) {
            Document todo = iterator.next();
            return todo.toJson();
        } else {
            // We didn't find the desired todo
            return null;
        }
    }


    /** Helper method which iterates through the collection, receiving all
     * documents if no query parameter is specified. If the age query parameter
     * is specified, then the collection is filtered so only documents of that
     * specified age are found.
     *
     * @param queryParams
     * @return an array of Todos in a JSON formatted string
     */
    public String getTodos(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        if (queryParams.containsKey("owner")) {
            String targetContent = queryParams.get("owner")[0];
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("owner", contentRegQuery);

        }

        if (queryParams.containsKey("category")) {
            String targetContent = (queryParams.get("category")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("category", contentRegQuery);
        }

        if (queryParams.containsKey("status")) {
            boolean targetStatus = Boolean.parseBoolean(queryParams.get("status")[0]);
            filterDoc = filterDoc.append("status", targetStatus);
        }

        if (queryParams.containsKey("body")) {
            String targetContent = (queryParams.get("body")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("body", contentRegQuery);
        }

        //FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingTodos = todoCollection.find(filterDoc);

        return JSON.serialize(matchingTodos);
    }


    /**
     * Helper method which appends received todo information to the to-be added document
     *
     * @param owner
     * @param status
     * @param category
     * @param body
     * @return boolean after successfully or unsuccessfully adding a todo
     */
    public String addNewTodo(String owner, String status, String body, String category) {

        Document newTodo = new Document();
        newTodo.append("owner", owner);
        newTodo.append("status", status);
        newTodo.append("body", body);
        newTodo.append("category", category);

        try {
            todoCollection.insertOne(newTodo);
            ObjectId id = newTodo.getObjectId("_id");
            System.err.println("Successfully added new todo [_id=" + id + ", owner=" + owner + ", status=" + status + " body=" + body + " category=" + category + ']');
            // return JSON.serialize(newTodo);
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }


    //Add to-do summary
    public String getTodoSummary() {

        float count = todoCollection.count();
        float percent = 100/count;

        AggregateIterable<Document> totOwner = todoCollection.aggregate(
            Arrays.asList(
                Aggregates.group("$owner", Accumulators.sum("count", 1))
            )
        );
        AggregateIterable<Document> finOwner = todoCollection.aggregate(

            Arrays.asList(
                Aggregates.match(Filters.eq("status", true)),
                Aggregates.group("$owner", Accumulators.sum("count", 1),
                    Accumulators.sum("percent", percent))

            )
        );


        AggregateIterable<Document> catOwner = todoCollection.aggregate(
            Arrays.asList(
                Aggregates.match(Filters.eq("category", "homework")),
                Aggregates.group("$owner", Accumulators.sum("count", 1),
                    Accumulators.sum("percent", percent))
            )
        );


        AggregateIterable<Document> bodyOwner = todoCollection.aggregate(
            Arrays.asList(
                Aggregates.match(Filters.eq("body", "sunt")),
                Aggregates.group("$owner", Accumulators.sum("count", 1),
                    Accumulators.sum("percent", percent))
            )
        );

        List pipe = Arrays.asList(totOwner,finOwner,catOwner,bodyOwner);

        return JSON.serialize(pipe);
    }

    public static void main(String[] args) {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase todoDatabase = mongoClient.getDatabase("dev");
        TodoController todoController = new TodoController(todoDatabase);

        todoController.getTodoSummary();
    }
}
