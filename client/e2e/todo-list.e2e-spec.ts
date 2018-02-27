import {TodoPage} from './todo-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
// browser.driver.controlFlow().execute = function () {
//     let args = arguments;
//
//     // queue 100ms wait between test
//     // This delay is only put here so that you can watch the browser do its thing.
//     // If you're tired of it taking long you can remove this call
//     origFn.call(browser.driver.controlFlow(), function () {
//         return protractor.promise.delayed(100);
//     });
//
//     return origFn.apply(browser.driver.controlFlow(), args);
// };

describe('Todo list', () => {
    let page: TodoPage;

    beforeEach(() => {
        page = new TodoPage();
    });

    it('should get and highlight Todos title attribute ', () => {
        page.navigateTo();
        expect(page.getTodoTitle()).toEqual('Todos');
    });

    //test filter by owner
    it('should type something in filter owner box and check that it returned correct element', () => {

        page.navigateTo();
        page.clickInput();
        page.typeAOwner("d");
        expect(page.getUniqueTodo("58af3a600343927e48e8721f")).toEqual("Dawn");
        page.backspace();

    });

    //test filter by category
    it('should type something in filter category box and check that it returned correct element', () => {
        page.navigateTo();
        page.clickInput();
        page.typeACategory('homework');
        browser.actions().sendKeys(Key.ENTER).perform();
        expect(page.getUniqueTodo('58af3a600343927e48e87217')).toEqual('Fry');
    });

    //test filter by body
    it('Nostrud ullamco labore exercitation magna', () => {
        page.navigateTo();
        page.clickInput();
        page.typeABody('labore');
        browser.actions().sendKeys(Key.ENTER).perform();
        expect(page.getUniqueTodo('58af3a600343927e48e87216')).toEqual('Blanche');
    });


    //test filter by status
    it('should select filter by status: \'true\' radio button and check that complete status is returned', () => {
        page.navigateTo();
        page.clickInput();
        page.chooseTureStatus();
        expect(page.getUniqueTodo('58af3a600343927e48e87216')).toEqual('Blanche');
    })

    it('should select filter by status: \'false\' radio button and check that incomplete status is returned', () => {
        page.navigateTo();
        page.clickInput();
        page.chooseFalseStatus();
        expect(page.getUniqueTodo('58af3a600343927e48e87217')).toEqual('Fry');
    })



    //test for combination
    it('should type something in filter by owner box, filter by status box, filter by body box, and filter by category and check that it returned correct element', () => {

        page.navigateTo();
        page.clickInput();
        page.typeAOwner("Fry");
        page.chooseFalseStatus();
        page.typeABody("v");
        page.typeACategory("v");
        expect(page.getUniqueTodo("58af3a600343927e48e87223")).toEqual("Fry");

    });


    //test for add a new to-do
    it('Should have an add todo button', () => {
        page.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    //checks if a dialog box is opened or not
    it('Should open a dialog box when add todo button is clicked', () => {
        page.navigateTo();
        expect(element(by.css('add-todo')).isPresent()).toBeFalsy('There should not be a modal window yet');
        element(by.id('addNewTodo')).click();
        expect(element(by.css('add-todo')).isPresent()).toBeTruthy('There should be a modal window now');
    });
    // checks if we actually add things to the database or not
    it('Should actually add the Todo with the information we put in the fields', () => {
        page.navigateTo();
        page.clickAddTodoButton();
        element(by.id('ownerField')).sendKeys('Yujing Song');
        element(by.id('categoryField')).sendKeys('UMM');
        element(by.id('bodyField')).sendKeys('is a hardworking girl');
        element(by.id('statusField')).sendKeys('true');
        element(by.id('confirmAddTodoButton')).click();
        setTimeout(() => {
            expect(page.getUniqueTodoByCategory('UMM')).toMatch('Yujing Song');
        }, 10000);
    });
});





















