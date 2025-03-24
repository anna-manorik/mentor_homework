const addH1Btn = document.getElementById('add-H1');
const addH2Btn = document.getElementById('add-H2');
const addParagrathBtn = document.getElementById('add-paragrath');
const valueInput = document.getElementById('main-value');
const mainContainer = document.getElementById('main-container');

addH1Btn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const h1 = document.createElement('h1')
    h1.innerHTML = `<h1>${valueInput.value}</h1>`
    mainContainer.appendChild(h1)

    valueInput.value = ''
})

addH2Btn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const h2 = document.createElement('h2')
    h2.innerHTML = `<h2>${valueInput.value}</h2>`
    mainContainer.appendChild(h2)

    valueInput.value = ''
})

addParagrathBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const p = document.createElement('p')
    p.innerHTML = `<p>${valueInput.value}</p>`
    mainContainer.appendChild(p)

    valueInput.value = ''
})