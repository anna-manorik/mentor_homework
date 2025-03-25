const addH1Btn = document.getElementById('add-H1');
const addH2Btn = document.getElementById('add-H2');
const addParagrathBtn = document.getElementById('add-paragrath');
const valueInput = document.getElementById('main-value');
const mainContainer = document.getElementById('main-container');

document.addEventListener('DOMContentLoaded', () => {
    const savedContent = localStorage.getItem("savedContent")
    if(savedContent) {
        mainContainer.innerHTML = savedContent;
    }
})

addH1Btn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const h1 = document.createElement('h1')
    h1.innerHTML = valueInput.value
    mainContainer.appendChild(h1)

    saveHTML(mainContainer.innerHTML)
})

addH2Btn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const h2 = document.createElement('h2')
    h2.innerHTML = valueInput.value
    mainContainer.appendChild(h2)

    saveHTML(mainContainer.innerHTML)
})

addParagrathBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const p = document.createElement('p')
    p.innerHTML = valueInput.value
    mainContainer.appendChild(p)

    saveHTML(mainContainer.innerHTML)
})

const saveHTML = (content) => {
    localStorage.setItem("savedContent", content);
    valueInput.value = ''
}