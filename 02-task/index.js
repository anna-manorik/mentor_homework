import { nanoid } from './node_modules/nanoid/nanoid.js';

const addAmountBtn = document.getElementById("addAmountBtn");
const amountInput = document.getElementById("amount");
const amountType = document.getElementById("amountType");
const amountDate = document.getElementById("amountDate");
let amountDateValue = '';

const sortTypeBtn = document.getElementById("sortByType");
const sortDateBtn = document.getElementById("sortByDate");

const fullList = document.getElementById("fullList");

const totalIncomeSpan = document.getElementById("totalIncome");
const totalCostsSpan = document.getElementById("totalCosts");

function getAmountList() {
    return JSON.parse(localStorage.getItem('amountList')) || [];
}

document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem('amountList')) {
        const amountList = getAmountList()

        amountList.forEach(amountRecord => createRecord(amountRecord));
        totalIncomeSpan.innerHTML = localStorage.getItem('totalIncome');
        totalCostsSpan.innerHTML = localStorage.getItem('totalCosts')
    }
});

amountDate.addEventListener("change", () => amountDateValue = amountDate.value);
    
addAmountBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const amountValue = amountInput.value.trim();
    const isValidNumber = /^\d+$/.test(amountValue);

    if (!amountValue) {
        return toastr.error('Please, fill amount!');
    }
    if (!isValidNumber) {
        return toastr.error('Please, enter a valid number!');
    }

    if (!amountDate.value) {
        return toastr.error('Please, choose the date!');
    }
    
    let amountList = JSON.parse(localStorage.getItem('amountList')) || [];
    const newAmount = {
        id: nanoid(),
        amount: amountInput.value,
        amountType: amountType.value,
        amountDate: amountDateValue
    }

    createRecord(newAmount);
    calcTotal(amountInput.value, amountType.value);
    
    localStorage.setItem("amountList", JSON.stringify([newAmount, ...amountList]));
    toastr.success('New record was created successfully!')
    amountInput.value = ''
})

function createRecord ({ id, amount, amountType, amountDate }) {
    const li = document.createElement("li");
    li.innerHTML = `
    <div class="amountRec">
        <div class="amount"><span>${amount}</span></div>
        <div class="amountType"><span>${amountType}</span></div>
        <span>${amountDate}</span>
        <button class="delete-btn" id=${id}>❌</button>
    </div>
    `;

    fullList.appendChild(li);

    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
        deleteAmount(id, amount, amountType);
    });
}

function calcTotal(amount, amountType) {
    const updateTotal = (type, totalSpan) => {
        const currentTotal = Number(localStorage.getItem(type)) || 0;
        const newTotal = currentTotal + Number(amount);
        localStorage.setItem(type, newTotal);
        totalSpan.innerHTML = newTotal;
    };

    amountType === 'incomes' ? updateTotal('totalIncome', totalIncomeSpan) : updateTotal('totalCosts', totalCostsSpan);
}

function deleteAmount(amountId, amount, amountType) {
    const amountList = getAmountList();
    const newAmountList = amountList.filter(amount => amount.id !== amountId);
    localStorage.setItem("amountList", JSON.stringify(newAmountList));
    toastr.success('Amount was deleted successfully!');

    const updateTotal = (type, totalSpan) => {
        const newTotal = (Number(localStorage.getItem(type)) || 0) - Number(amount);
        localStorage.setItem(type, newTotal);
        totalSpan.innerHTML = newTotal;
    };

    amountType === 'incomes' ? updateTotal('totalIncome', totalIncomeSpan) : updateTotal('totalCosts', totalCostsSpan);
}

function sortList(filterKey, filterValue) {
    fullList.innerHTML = '';
    getAmountList()
        .filter(amount => !filterValue || amount[filterKey] === filterValue)
        .forEach(createRecord);
}

sortTypeBtn.addEventListener('change', (e) => sortList("amountType", e.target.value));
sortDateBtn.addEventListener('change', (e) => sortList("amountDate", e.target.value));