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
        // const phoneList = JSON.parse(localStorage.getItem('phoneList'));

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
        li.querySelector('.name').remove()
        li.insertAdjacentHTML("afterbegin", `<input value="${e.target.innerHTML}" id='nameInputChange'>`);
    
        li.querySelector("#nameInputChange").addEventListener('change', () => {
            li.insertAdjacentHTML("afterbegin", `<span class="name">${li.querySelector("#nameInputChange").value}</span>`);
            phoneList = phoneList.map(phone => phone.id === e.target.id ? { ...phone, name: li.querySelector("#nameInputChange").value } : phone )
            localStorage.setItem("phoneList", JSON.stringify(phoneList));
            li.querySelector('#nameInputChange').remove()
        })
    })

    li.querySelector('.phone').addEventListener('click', (e) => {
        li.querySelector('.phone').remove();

        let newInput = document.createElement("input"); 
        newInput.value = e.target.innerHTML; 
        newInput.id = 'nameInputChange';
        let secondChild = li.children[1];
        if (secondChild) {
            li.insertBefore(newInput, secondChild);
        }

        li.querySelector("#nameInputChange").addEventListener('change', () => {
            let newSpan = document.createElement("span"); 
            newSpan.innerHTML = li.querySelector("#nameInputChange").value; 
            newSpan.classList.add('name');
            if (secondChild) {
                li.insertBefore(newSpan, secondChild);
            }

            phoneList = phoneList.map(phone => phone.id === e.target.id ? { ...phone, phone: li.querySelector("#nameInputChange").value } : phone )
            localStorage.setItem("phoneList", JSON.stringify(phoneList));
            li.querySelector('#nameInputChange').remove()
        })
    })

    li.querySelector("#category").addEventListener('change', (e) => {
        updateCategory(e.target.value, id)
    })

    phoneListUl.appendChild(li);

    return li
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