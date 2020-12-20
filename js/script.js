/* eslint-disable arrow-parens */
'use strict';

class Todo {
    constructor(form, input, todoList, todoCompeleted) {
        this.animInterval  = 0;
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompeleted = document.querySelector(todoCompeleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem(`todoList`)));
    }

    addToStorage() {
        localStorage.setItem(`toDoList`, JSON.stringify([...this.todoData]));
    }

    render() {
        this.todoList.textContent = ``;
        this.todoCompeleted.textContent = ``;
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    animHide(target, key, callback) {

        let value = parseFloat(target.style.opacity);
        this.animInterval = setInterval(() => {

            if (value <= 0) {
                clearInterval(this.animInterval);
                callback.call(this, key);
            }
            value -= 0.1;
            target.style.opacity = value;

        }, 50);
    }

    animShow(target, key, callback) {

        let value = parseFloat(target.style.opacity);
        this.animInterval = setInterval(() => {

            if (value <= 0) {
                clearInterval(this.animInterval);
                callback.call(this, key);
            }
            value -= 0.1;
            target.style.opacity = value;

        }, 50);
    }

    createItem(todo) {
        const li = document.createElement(`li`);
        li.classList.add(`todo-item`);
        li.key = todo.key;
        li.insertAdjacentHTML(`beforeend`, `
            <span class="text-todo">${todo.value}</span>
            <div class="todo-buttons">
                <button class="todo-edit"></button>
                <button class="todo-remove"></button>
                <button class="todo-complete"></button>
            </div>
        `);
        if (todo.completed) {
            this.todoCompeleted.append(li);
        }   else {
            this.todoList.append(li);
        }
    }

    addTodo(e) {
        e.preventDefault();

        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey()
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
        }   else {
            alert(`Поле не может быть пустым!`);
        }
        this.input.value = '';
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    completedItem(target) {

        this.todoData.forEach((elem) => {
            if (elem.key === target) {
                elem.completed = !elem.completed;
            }
        });
        this.render();
    }

    deleteItem(target) {

        let indexToDo;

        this.todoData.forEach((elem, i) => {
            if (elem.key === target) {
                indexToDo = i;
            }
        });
        this.todoData.delete(indexToDo);
        this.render();
    }

    renameItem(target) {
        const newValue = prompt(`Введите новое название дела!`, `Новое название`);
        this.todoData.forEach((elem) => {
            if (elem.value === target.textContent) {
                elem.value = newValue;
            }
        });
        target.textContent = newValue;
        this.addToStorage();
    }

    handler() {

        const todoContainer = document.querySelector(`.todo-container`);

        todoContainer.addEventListener(`click`, (event) => {

            const targetRemove = event.target.closest(`.todo-remove`);
            const targetComplete = event.target.closest(`.todo-complete`);
            const targetRename = event.target.closest('.todo-edit');

            if (targetRemove) {
                const remove = targetRemove.closest(`.todo-item`),
                    valueRemove = remove.querySelector(`.text-todo`);
                let removeKey;

                this.todoData.forEach((elem, i) => {
                    if (elem.value === valueRemove.textContent) {
                        removeKey = i;
                    }
                });
                remove.style.opacity = '1';
                this.animHide(remove, removeKey, this.deleteItem);
            }
            if (targetComplete) {
                const complete  = targetComplete.closest(`.todo-item`),
                    valueComplete = complete.querySelector(`.text-todo`);
                let completeKey;

                this.todoData.forEach((elem, i) => {
                    if (elem.value === valueComplete.textContent) {
                        completeKey = i;
                    }
                });
                complete.style.opacity = '1';
                this.animShow(complete, completeKey, this.completedItem);
            }

            if (targetRename) {
                const rename = targetRename.closest(`.todo-item`),
                    valueRename = rename.querySelector(`.text-todo`);

                this.renameItem(valueRename);
            }

        });

    }

    init() {
        this.form.addEventListener(`submit`, this.addTodo.bind(this));
        this.render();
        this.handler();
    }
}

const todo = new Todo(`.todo-control`, `.header-input`, `.todo-list`, `.todo-completed`);

todo.init();
