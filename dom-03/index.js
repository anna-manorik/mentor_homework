import { nanoid } from './node_modules/nanoid/nanoid.js';

const nameValue = document.getElementById("name");
const phoneValue = document.getElementById("phone");
const categoryValue = document.getElementById("category");
const addPhoneBtn = document.getElementById("addPhoneBtn");
const phoneListUl = document.getElementById("phoneList");
const filterBtn = document.getElementById("filter");

document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem('phoneList')) {
        const phoneList = JSON.parse(localStorage.getItem('phoneList'));

        phoneList.forEach(phone => addNewPhone(phone));
    }
});

addPhoneBtn.addEventListener('click', (e) => {
    e.preventDefault();

    let phoneList = JSON.parse(localStorage.getItem('phoneList')) || [];
    const newPhone = {
        id: nanoid(),
        name: nameValue.value,
        phone: phoneValue.value,
        category: categoryValue.value
    }

    if(nameValue.value === '' || phoneValue.value === '') {
        toastr.error('Please, fill description!');
        return
    }

    addNewPhone(newPhone);

    phoneList.unshift(newPhone);
    localStorage.setItem("phoneList", JSON.stringify(phoneList));
    toastr.success('New task was created successfully!');
    nameValue.value = '';
    phoneValue.value = '';
})

filterBtn.addEventListener('change', (e) => filterPhonesList(e.target.value))

function filterPhonesList(order) {
    let phoneList = JSON.parse(localStorage.getItem('phoneList')) || [];

    if(order === "All") {
        phoneList.forEach(todo => addNewPhone(todo));
    } else {
        phoneList = phoneList.filter(phone => phone.category === order)
    }
    
    if(phoneList.length === 0) {
        phoneList.innerHTML = `Any tasks in ${order} `;
    } else {
        phoneListUl.innerHTML = '';
        phoneList.forEach(phone => addNewPhone(phone));
    }
}

function addNewPhone({ id, name, phone, category }) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span class="name">${name}</span>
        <span class="phone">${phone}</span>
        <select id="priorityTodo">
            <option>${category}</option>
            <option>Family</option>
            <option>Work</option>
            <option>Friends</option>
            <option>Other</option>
        </select>
        <button class="delete-btn" id=${id}>❌</button>
    `;

    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
        deletePhone(id);
    });

    // li.querySelector("#statusTodo").addEventListener('change', (e) => {
    //     updateStatus(e.target.value, id)
    // })

    phoneListUl.appendChild(li);

    return li
}

// function updateStatus(newStatus, todoId) {
//     let todoList = JSON.parse(localStorage.getItem('todoList'));
//     todoList = todoList.map(todo => todo.id === todoId ? { ...todo, status: newStatus } : todo )
//     localStorage.setItem("todoList", JSON.stringify(todoList));
// }

function deletePhone(phoneItemId) {
    let phoneList = JSON.parse(localStorage.getItem('phoneList'));

    phoneList = phoneList.filter(phone => phone.id !== phoneItemId)
    localStorage.setItem("phoneList", JSON.stringify(phoneList));
    toastr.success('Phone was deleted successfully!')
}



