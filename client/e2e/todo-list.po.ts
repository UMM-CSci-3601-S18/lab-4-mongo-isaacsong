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

    typeAOwner(owner: string) {
        const input = element(by.id('todoOwner'));
        input.click();
        input.sendKeys(owner);
    }

    selectUpKey() {
        browser.actions().sendKeys(Key.ARROW_UP).perform();
    }

    backspace() {
        browser.actions().sendKeys(Key.BACK_SPACE).perform();
    }

    getCategory(category: string) {
        const input = element(by.id('todoCategory'));
        input.click();
        input.sendKeys(category);
        const selectButton = element(by.id('submit'));
        selectButton.click();
    }
/*
need to figure out how to test boolean
    getTodoByStatus() {
        const input = element(by.id('todoStatus'));
        input.click();
        input.sendKeys(Key.TAB);
    }
*/
    getUniqueTodo(id: string) {
        const todo = element(by.id(id)).getText();
        this.highlightElement(by.id(id));

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
