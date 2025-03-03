import { nanoid } from './node_modules/nanoid/nanoid.js';

const addAmountBtn = document.getElementById("addAmountBtn");
const amount = document.getElementById("amount");
const amountType = document.getElementById("amountType");
const amountDate = document.getElementById("amountDate");

const incomesUl = document.getElementById("incomesList");
const costsUl = document.getElementById("costsList");

document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem('amountList')) {
        const amountList = JSON.parse(localStorage.getItem('amountList'));

        amountList.forEach(amountRecord => createRecord(amountRecord));
    }
});

addAmountBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    let amountList = JSON.parse(localStorage.getItem('amountList')) || [];
    const newAmount = {
        id: nanoid(),
        amount: amount.value,
        amountType: amountType.value,
        amountDate: amountDate.value
    }
    
    if(amount.value === '') {
        
        toastr.error('Please, fill amount!');
        return
    }

    createRecord(newAmount);

    localStorage.setItem("amountList", JSON.stringify([newAmount, ...amountList]));
    toastr.success('New record was created successfully!')
    amount.value = ''
})

function createRecord ({ id, amount, amountType, amountDate }) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span class="description">${amount}</span>
        <span>${amountType}</span>
        <button class="delete-btn" id=${id}>❌</button>
    `;

    if(amountType === 'incomes') {
        incomesUl.appendChild(li)
    } else if (amountType === 'costs') {
        costsUl.appendChild(li)
    }

}