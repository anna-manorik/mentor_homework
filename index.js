import { nanoid } from './node_modules/nanoid/nanoid.js';

const description = document.getElementById("description");
const priorityTodo = document.getElementById("priority");
const statusTodo = document.getElementById("status");
const addTaskBtn = document.getElementById("addTaskBtn");
const todoListUl = document.getElementById("todoList");
const sortBtn = document.getElementById("sort");

document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem('todoList')) {
        const todoList = JSON.parse(localStorage.getItem('todoList'));

        todoList.forEach(todoItem => createTask(todoItem));
    }
});

addTaskBtn.addEventListener('click', (e) => {
    e.preventDefault();

    let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
    const newTodo = {
        id: nanoid(),
        description: description.value,
        priority: priorityTodo.value,
        status: statusTodo.value
    }

    if(description.value === '') {
        toastr.error('Please, fill description!');
        return
    }

    createTask(newTodo);

    localStorage.setItem("todoList", JSON.stringify([newTodo, ...todoList]));
    toastr.success('New task was created successfully!')
    description.value = ''
})

sortBtn.addEventListener('change', (e) => {
    let todoList = JSON.parse(localStorage.getItem('todoList'));

    const priorityLevels = { 
        "ASAP": 0, 
        "Highest": 1, 
        "High": 2,
        "Medium": 3, 
        "Low": 4, 
    };

    if(e.target.value === 'To the highest') {
        todoList = todoList.sort((firstTodo, secondTodo) => {
            return priorityLevels[secondTodo.priority] - priorityLevels[firstTodo.priority]
        })
        todoListUl.innerHTML = '';
        todoList.forEach(todo => createTask(todo));
        localStorage.setItem("todoList", JSON.stringify(todoList));
    } else if (e.target.value === 'To the lowest') {
        todoList = todoList.sort((firstTodo, secondTodo) => {
            return priorityLevels[firstTodo.priority] - priorityLevels[secondTodo.priority]
        })
        todoListUl.innerHTML = '';
        todoList.forEach(todo => createTask(todo));
        localStorage.setItem("todoList", JSON.stringify(todoList));
    } else {
        return
    }
    
})

function createTask({ description, priority, status, id }) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span class="description">${description}</span>
        <select id="priorityTodo">
            <option>${priority}</option>
            <option>ASAP</option>
            <option>Highest</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
        </select>
        <select id="statusTodo">
            <option>${status}</option>
            <option >ToDo</option>
            <option>In Progress</option>
            <option>Done</option>
        </select>
        <button class="delete-btn" id=${id}>❌</button>
    `;

    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
        deleteTask(id);
    });

    li.querySelector("#priorityTodo").addEventListener('change', (e) => {
        updatePriority(e.target.value, id)
    })

    li.querySelector("#statusTodo").addEventListener('change', (e) => {
        updateStatus(e.target.value, id)
    })

    todoListUl.appendChild(li);

    return li
}

function updatePriority(newPriority, todoId) {
    let todoList = JSON.parse(localStorage.getItem('todoList'));
    todoList = todoList.map(todo => todo.id === todoId ? { ...todo, priority: newPriority } : todo )
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

function updateStatus(newStatus, todoId) {
    let todoList = JSON.parse(localStorage.getItem('todoList'));
    todoList = todoList.map(todo => todo.id === todoId ? { ...todo, status: newStatus } : todo )
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

function deleteTask(todoItemId) {
    let todoList = JSON.parse(localStorage.getItem('todoList'));

    todoList = todoList.filter(todo => todo.id !== todoItemId)
    localStorage.setItem("todoList", JSON.stringify(todoList));
    toastr.success('Task was deleted successfully!')
}



