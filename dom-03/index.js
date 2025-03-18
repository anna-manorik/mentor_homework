import { nanoid } from './node_modules/nanoid/nanoid.js';

const nameValue = document.getElementById("nameInput");
const phoneValue = document.getElementById("phoneInput");
const categoryValue = document.getElementById("categoryInput");
const addPhoneBtn = document.getElementById("addPhoneBtn");
const phoneListUl = document.getElementById("phoneList");
const filterBtn = document.getElementById("filter");
const searchValue = document.getElementById("searchInput");

let phoneList = JSON.parse(localStorage.getItem('phoneList')) || [];

document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem('phoneList')) {
        phoneList.forEach(phone => addNewPhone(phone));
    }
});

addPhoneBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const newPhone = {
        id: nanoid(),
        name: nameValue.value,
        phone: phoneValue.value,
        category: categoryValue.value
    }

    if(nameValue.value === '' || phoneValue.value === '') {
        toastr.error('Please, fill name and phone number!');
        return
    }

    addNewPhone(newPhone);

    phoneList.unshift(newPhone);
    localStorage.setItem("phoneList", JSON.stringify(phoneList));
    toastr.success('New task was created successfully!');
    nameValue.value = '';
    phoneValue.value = '';
})

function addNewPhone({ id, name, phone, category }) {
    let li = document.createElement("li");
    li.innerHTML = `
        <span id="${id}" class="name">${name}</span>
        <span id="${id}" class="phone">${phone}</span>
        <select id="category">
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

    li.querySelector('.name').addEventListener('click', (e) => {
        makeEditable(e.target, id, 'name');
    });

    li.querySelector('.phone').addEventListener('click', (e) => {
        makeEditable(e.target, id, 'phone');
    });

    li.querySelector("#category").addEventListener('change', (e) => {
        updateCategory(e.target.value, id);
    });

    phoneListUl.appendChild(li);

    return li;
}

function makeEditable(element, id, fieldType) {
    if (element.parentNode.querySelector('#nameInputChange')) {
        return;
    }
    
    const originalValue = element.innerHTML;
    const originalElement = element;
    
    element.style.display = 'none';
    
    let inputField = document.createElement("input");
    inputField.value = originalValue;
    inputField.id = 'nameInputChange';
    
    element.parentNode.insertBefore(inputField, element.nextSibling);
    
    inputField.focus();
    
    inputField.addEventListener('blur', () => saveEdit(inputField, originalElement, id, fieldType));
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit(inputField, originalElement, id, fieldType);
        }
    });
}

function saveEdit(inputField, originalElement, id, fieldType) {
    const newValue = inputField.value;
    
    originalElement.innerHTML = newValue;
    originalElement.style.display = '';
    
    phoneList = phoneList.map(phone => 
        phone.id === id ? { ...phone, [fieldType]: newValue } : phone
    );
    
    localStorage.setItem("phoneList", JSON.stringify(phoneList));
    
    inputField.remove();
}

function updateCategory(newCategory, phoneId) {
    phoneList = phoneList.map(phone => phone.id === phoneId ? { ...phone, category: newCategory } : phone )
    localStorage.setItem("phoneList", JSON.stringify(phoneList));
}

function deletePhone(phoneItemId) {
    phoneList = phoneList.filter(phone => phone.id !== phoneItemId)
    localStorage.setItem("phoneList", JSON.stringify(phoneList));
    toastr.success('Phone was deleted successfully!')
}

filterBtn.addEventListener('change', (e) => filterPhonesList(e.target.value))

function filterPhonesList(order) {
    let phoneList = JSON.parse(localStorage.getItem('phoneList')) || [];

    if(order === "All") {
        phoneList.forEach(todo => addNewPhone(todo));
    } else {
        phoneList = phoneList.filter(phone => phone.category === order)
    }

    if(phoneList.length === 0) {
        phoneListUl.innerHTML = `Any phones in ${order} category`;
    } else {
        phoneListUl.innerHTML = '';
        phoneList.forEach(phone => addNewPhone(phone));
    }
}

searchValue.addEventListener('input', (e) => {
    if(e.target.value === '') {
        phoneListUl.innerHTML = '';
        phoneList.forEach(phone => addNewPhone(phone));
        return
    }

    phoneListUl.innerHTML = '';
    let searchResult = phoneList.filter(phone => phone.name.includes(e.target.value) || phone.phone.includes(e.target.value));

    if(searchResult.length === 0) {
        phoneListUl.innerHTML = 'Any results';
    } else {
        searchResult.forEach(phone => addNewPhone(phone));
    }
})