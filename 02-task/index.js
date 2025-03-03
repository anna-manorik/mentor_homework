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
        totalIncomeSpan.innerHTML = localStorage.getItem('totalIncome')
    }
});

addAmountBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    let amountList = JSON.parse(localStorage.getItem('amountList')) || [];
    const newAmount = {
        id: nanoid(),
        amount: amountInput.value,
        amountType: amountType.value,
        amountDate: amountDate.value
    }
    
    if(amountInput.value === '') {
        toastr.error('Please, fill amount!');
        return
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
    if (amountType === 'incomes') {
        if(!JSON.parse(localStorage.getItem('totalIncome'))) {
            localStorage.setItem("totalIncome", amount);
            totalIncome.innerHTML = amount
        } else {
            const totalIncome = Number(localStorage.getItem('totalIncome')) + Number(amount);
            localStorage.setItem("totalIncome", totalIncome);
            totalIncomeSpan.innerHTML = totalIncome
        }
    } else if (amountType === 'costs') {
        if(!JSON.parse(localStorage.getItem('totalCosts'))) {
            localStorage.setItem("totalCosts", amount);
            totalCostsSpan.innerHTML = amount
        } else {
            const totalCosts = Number(localStorage.getItem('totalCosts')) + Number(amount);
            localStorage.setItem("totalCosts", totalCosts);
            totalCostsSpan.innerHTML = totalCosts
        }
    }
    
}