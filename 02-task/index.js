import { nanoid } from './node_modules/nanoid/nanoid.js';

const addAmountBtn = document.getElementById("addAmountBtn");
const amountInput = document.getElementById("amount");
const amountType = document.getElementById("amountType");
const amountDate = document.getElementById("amountDate");

const incomesUl = document.getElementById("incomesList");
const costsUl = document.getElementById("costsList");

const totalIncomeSpan = document.getElementById("totalIncome");
const totalCostsSpan = document.getElementById("totalCosts");

document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem('amountList')) {
        const amountList = JSON.parse(localStorage.getItem('amountList'));

        amountList.forEach(amountRecord => createRecord(amountRecord));
        totalIncomeSpan.innerHTML = localStorage.getItem('totalIncome');
        totalCostsSpan.innerHTML = localStorage.getItem('totalCosts')
    }
});

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
    
    let amountList = JSON.parse(localStorage.getItem('amountList')) || [];
    const newAmount = {
        id: nanoid(),
        amount: amountInput.value,
        amountType: amountType.value,
        amountDate: amountDate.value
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
        <span class="amount">${amount}</span>
        <span>${amountType}</span>
        <button class="delete-btn" id=${id}>❌</button>
    `;

    if(amountType === 'incomes') {
        incomesUl.appendChild(li);
    } else if (amountType === 'costs') {
        costsUl.appendChild(li);
    }

}

function calcTotal(amount, amountType) {
    const updateTotal = (type, totalSpan) => {
        const currentTotal = Number(localStorage.getItem(type)) || 0;
        const newTotal = currentTotal + Number(amount);
        localStorage.setItem(type, newTotal);
        totalSpan.innerHTML = newTotal;
    };

    if (amountType === 'incomes') {
        updateTotal('totalIncome', totalIncomeSpan);
    } else {
        updateTotal('totalCosts', totalCostsSpan);
    }
}