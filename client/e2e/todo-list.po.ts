import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class TodoPage {
    navigateTo(): promise.Promise<any> {
        return browser.get('/todos');
    }

    // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return 'highlighted';
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getTodoTitle() {
        const title = element(by.id('todo-list-title')).getText();
        this.highlightElement(by.id('todo-list-title'));

        return title;
    }

    clickInput() {
        element(by.id('Panel-Header')).click();
    }

    typeAOwner(owner: string) {
        const input = element(by.id('todoOwner'));
        input.click();
        input.sendKeys(owner);
    }

    typeACategory(category:string){
        const input = element(by.id('todoCategory'));
        input.click();
        input.sendKeys(category);
    }

    typeABody(body:string){
        const input = element(by.id('todoBody'));
        input.click();
        input.sendKeys(body);
    }

    chooseTureStatus() {
        const input = element(by.id('true'));
        input.click();
    }

    chooseFalseStatus() {
        const input = element(by.id('false'));
        input.click();
    }

    selectUpKey() {
        browser.actions().sendKeys(Key.ARROW_UP).perform();
    }

    backspace() {
        browser.actions().sendKeys(Key.BACK_SPACE).perform();
    }


    getUniqueTodo(id:string) {
        let todo = element(by.id(id)).getText();
        this.highlightElement(by.id(id));
        return todo;
    }

    getUniqueTodoByCategory(category:string){
        let todo = element(by.id(category)).getText();
        this.highlightElement(by.id(category));

        return todo;
    }


    getTodos() {
        return element.all(by.className('todos'));
    }

    clickClearCategorySearch() {
        const input = element(by.id('categoryClearSearch'));
        input.click();
    }

    buttonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewTodo'));
        return element(by.id('addNewTodo')).isPresent();
    }

    clickAddTodoButton(): promise.Promise<void> {
        this.highlightElement(by.id('addNewTodo'));
        return element(by.id('addNewTodo')).click();
    }

}
