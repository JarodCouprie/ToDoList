import { createElement } from "../functions/dom.js";

/**
 * @typedef {object} Todo
 * @property {number} id
 * @property {string} title
 * @property {boolean} completed
 */
export class ToDoList{

    /** @type  {Todo[]}*/
    #todos = [];

    /** @type  {HTMLUListElement}*/
    #listElement = [];

    /**
     * 
     * @param {Todo[]} todos 
     */
    constructor (todos) {
        this.#todos = todos;
    };

    /**
     * 
     * @param {HTMLElement} element 
     */
    appendTo(element) {
        element.innerHTML = `<form class="todolistForm">

        <input type="text" id="form-field" placeholder="New task..." name="title" data-com.bitwarden.browser.user-edited="yes" required>
        <button id="add-button">+</button>

    </form>

    <section>

        <div id="task-button-container" role="group">

            <button type="button" class="task-button active" id="task-button-1" data-filter="all">All</button>
            <button type="button" class="task-button" id="task-button-2" data-filter="todo">To do</button>
            <button type="button" class="task-button" id="task-button-3" data-filter="done">Done</button>

        </div>

        <ul class="list-group">
        </ul>

    </section>`;
    this.#listElement = element.querySelector(".list-group");
    for (let todo of this.#todos){
        const t = new TodoListItem(todo);
        this.#listElement.append(t.element);
    };
    element.querySelector("form").addEventListener("submit", e => this.#onSubmit(e));
    element.querySelectorAll("#task-button-container button").forEach(button =>{
        button.addEventListener("click", e => this.#toggleFilter(e))
    });
    };

    /**
     * @param {SubmitEvent} e 
     */
    #onSubmit (e){
        e.preventDefault(); //disable form's sendind
        const form = e.currentTarget;
        const title = new FormData(e.currentTarget).get("title").toString().trim(); // trim delete spaces before and after a string
        if (title === ""){
            return;
        };
        const todo = {
            id: Date.now(),
            title,
            completed: false
        };
        const item = new TodoListItem(todo);
        this.#listElement.prepend(item.element);
        form.reset();
    };

    /**
     * @param {PointerEvent} e 
     */
    #toggleFilter(e){
        e.preventDefault();
        const filter = e.currentTarget.getAttribute("data-filter");
        e.currentTarget.parentElement.querySelector(".active").classList.remove("active");
        e.currentTarget.classList.add("active");
        if (filter === "todo"){
            this.#listElement.classList.add("hide-completed");
            this.#listElement.classList.remove("hide-todo");
        }else if(filter === "done"){
            this.#listElement.classList.add("hide-todo");
            this.#listElement.classList.remove("hide-completed");
        }else{
            this.#listElement.classList.remove("hide-completed");
            this.#listElement.classList.remove("hide-todo");
        }
    };
};

class TodoListItem{

    #element;

    /** @type {Todo} */
    constructor(todo){
        const id = `todo-${todo.id}`;
        const li = createElement("li",{
            class: "todo list-group-item"
        });
        this.#element = li;
        const divContainer = createElement("div",{
            class: "label-container"
        })
        const checkbox = createElement("input",{
            type: "checkbox",
            class: "form-check-input",
            id,
            checked: todo.completed ? "" : null
        });
        const label = createElement("label",{
            class: "form-check-label",
            for: id
        });
        label.innerText = todo.title;
        const button = createElement("button",{
            class: "bi-trash"
        });
        button.innerText = "-";
        divContainer.append(checkbox);
        divContainer.append(label);
        li.append(divContainer);
        li.append(button);
        this.toggle(checkbox);

        button.addEventListener("click", e => this.remove(e));
        checkbox.addEventListener("change", e => this.toggle(e.currentTarget));

    };

    /**
     * 
     * @return {HTMLElement}
     */
    get element(){
        return this.#element;
    }

    /**
     * 
     * @param {PointEvent} e 
     */
    remove(e){
        e.preventDefault();
        this.#element.remove();
    };

    /**
     * Change the state (to do / done) for a task
     * @param {HTMLInputElement} checkbox 
     */
    toggle(checkbox){
        if (checkbox.checked){
            this.#element.classList.add("is-completed");
        }else{
            this.#element.classList.remove("is-completed");
        }
    }

};