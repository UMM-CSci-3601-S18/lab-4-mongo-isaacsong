## Questions

1. :question: What do we do in the `Server` and `UserController` constructors
to set up our connection to the development database?
1. :question: How do we retrieve a user by ID in the `UserController.getUser(String)` method?
1. :question: How do we retrieve all the users with a given age 
in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that
method?
1. :question: What are these `Document` objects that we use in the `UserController`? 
Why and how are we using them?
1. :question: What does `UserControllerSpec.clearAndPopulateDb` do?
1. :question: What's being tested in `UserControllerSpec.getUsersWhoAre37()`?
How is that being tested?
1. :question: Follow the process for adding a new user. What role do `UserController` and 
`UserRequestHandler` play in the process?

## Your Team's Answers

1. The server gets the database and sends the database to UserController which can get the collection of the database. UserController filters by some specific inputs or add new users in database.

1. We give the method an string argument called id and it checks line by line using the iterator to see if it exists in theUserCollection.

1. A new document is being created which creates a search parameter for age and matchingUsers will find the target users in the database based on the limits in the filterDoc.

1. The documents holds the search parameters which are then used to structure the new users or find the target users in the database.

1. clearAndPopulateDB in the UserControllerSpec is a test which clears the test database and the adds the users it's told to add. 

1. The test is to get the Users that are 37 years old. It's being tested by being filtered in the Map by the age and then put into docs and then is checked to see if the size is correct. Once checked it is sorted and tested to see if the names are correct.

1. The UserController provides a structure for adding a user and UserRequestHandler adds the userController which then adds it to the database.
