import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Todo} from './todo';
import {TodoListService} from './todo-list.service';

describe('Todo list service: ', () => {
    // A small collection of test todos
    const testTodos: Todo[] = [
        {
            _id: 'song_id',
            owner: 'Song',
            status: true,
            category: 'so sleepy and hungry',
            body: 'want to get some food'
        },
        {
            _id: 'yujing_id',
            owner: 'Yujing',
            status: false,
            category: 'work on debugging',
            body: 'hope drink some water'
        },
        {
            _id: 'isaac_id',
            owner: 'Isaac',
            status: true,
            category: 'fun guy',
            body: 'off campus working for whole weekend'
        }
    ];
    const mTodos: Todo[] = testTodos.filter(todo =>
        todo.owner.toLowerCase().indexOf('a') !== -1
    );

    // We will need some url information from the userListService to meaningfully test company filtering;
    // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
    let todoListService: TodoListService;
    let currentlyImpossibleToGenerateSearchUserUrl: string;

    // These are used to mock the HTTP requests so that we (a) don't have to
    // have the server running and (b) we can check exactly which HTTP
    // requests were made to ensure that we're making the correct requests.
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        // Set up the mock handling of the HTTP requests
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        // Construct an instance of the service with the mock
        // HTTP client.
        todoListService = new TodoListService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getTodos() calls api/todos', () => {
        // Assert that the users we get from this call to getTodos()
        // should be our set of test todos. Because we're subscribing
        // to the result of getTodos(), this won't actually get
        // checked until the mocked HTTP request "returns" a response.
        // This happens when we call req.flush(testUsers) a few lines
        // down.
        todoListService.getTodos().subscribe(
            todos => expect(todos).toBe(testTodos)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(todoListService.baseUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testTodos);
    });

    /*
    it('getTodos(todoOwner) adds appropriate param string to called URL', () => {
        todoListService.getTodos('s').subscribe(
            todos => expect(todos).toEqual(mTodos)
        );

        const req = httpTestingController.expectOne(todoListService.baseUrl + '?owner=s');
        expect(req.request.method).toEqual('GET');
        req.flush(mTodos);
    });*/


    it('getTodoById() calls api/todos/id', () => {
        const targetTodo: Todo = testTodos[1];
        const targetId: string = targetTodo._id;
        todoListService.getTodoById(targetId).subscribe(
            todo => expect(todo).toBe(targetTodo)
        );

        const expectedUrl: string = todoListService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetTodo);
    });

    it('adding a todo calls api/todos/new', () => {
        const dumpling_id = { '$oid': 'dumpling_id' };
        const newTodo: Todo = {
            _id: 'dumpling_id',
            owner: 'Dumpling',
            status: true,
            category: 'tasty',
            body: 'working on his lab lonely'
        };

        todoListService.addNewTodo(newTodo).subscribe(
            id => {
                expect(id).toBe(dumpling_id);
            }
        );

        const expectedUrl: string = todoListService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(dumpling_id);
    });
});
