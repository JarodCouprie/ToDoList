//JavaScript for the to do list

import { ToDoList } from "./components/ToDoList.js";
import { fetchJSON } from "./functions/api.js";
import { createElement } from "./functions/dom.js";

// Using our function to contact the jsonplaceholder server
try{
    const todos = await fetchJSON("https://jsonplaceholder.typicode.com/todos?_limit=5");
    const list = new ToDoList(todos);
    list.appendTo(document.querySelector("#todolist"));
}catch (e){
    const alertElement = createElement("div",{
        class: "alert",
        role: alert
    })
    alertElement.innerText = "Can't load elements";
    document.body.prepend(alertElement);
    console.error(e);
}