import { nanoid } from './node_modules/nanoid/nanoid.js';

const addH1Btn = document.getElementById('add-H1');
const addH2Btn = document.getElementById('add-H2');
const addParagrathBtn = document.getElementById('add-paragrath');
const valueInput = document.getElementById('main-value');
const mainContainer = document.getElementById('main-container');

const button1 = document.createElement("button");
const button2 = document.createElement("button");

let elementArray = JSON.parse(localStorage.getItem('elementArray')) || [];

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('elementArray')) {
        elementArray.forEach(element => mainContainer.insertAdjacentHTML("beforeend", element))
    }

    attachEventListeners();
})


function attachEventListeners() {
    const removeEventListeners = (selector, eventType) => {
        document.querySelectorAll(selector).forEach(element => {
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
        });
    };

    removeEventListeners('.h1 .text, .h2 .text, .parag .text', 'click');
    removeEventListeners('.bold-btn', 'click');
    removeEventListeners('.italic-btn', 'click');

    document.querySelectorAll('.h1 .text, .h2 .text, .parag .text').forEach((element) => {
        element.addEventListener('click', () => {
            makeEditable(element);
        });
    });

    document.querySelectorAll('.bold-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
            let parent = e.target.parentNode;
            parent.style.fontWeight = parent.style.fontWeight === "bold" ? "normal" : "bold";
            
            updateElementInArray(parent);
        });
    });

    document.querySelectorAll('.italic-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
            let parent = e.target.parentNode;
            let currentStyle = window.getComputedStyle(parent).fontStyle;
    
            parent.style.fontStyle = currentStyle === "italic" ? "normal" : "italic";

            updateElementInArray(parent);
        });
    });
}

function updateElementInArray(element) {
    elementArray = elementArray.map(htmlString => {
        let range = document.createRange();
        let fragment = range.createContextualFragment(htmlString);
        let firstElement = fragment.firstElementChild;

        if (element.id === firstElement.id) {
            return element.outerHTML;
        }

        return htmlString; 
    });
    
    localStorage.setItem("elementArray", JSON.stringify(elementArray));
}


addH1Btn.addEventListener('click', (e) => {
    e.preventDefault();
    if(!valueInput.value.trim()) return;
    createAndSaveElement('h1', 'h1');
});

addH2Btn.addEventListener('click', (e) => {
    e.preventDefault();
    if(!valueInput.value.trim()) return;
    createAndSaveElement('h2', 'h2');
});

addParagrathBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if(!valueInput.value.trim()) return;
    createAndSaveElement('p', 'parag');
});

function createAndSaveElement(tagName, className) {
    const element = document.createElement(tagName);
    element.id = nanoid();
    element.classList.add(className);
    element.innerHTML = `<span class="text">${valueInput.value}</span>`;
    
    const boldBtn = document.createElement("button");
    boldBtn.textContent = "Bold";
    boldBtn.classList.add('bold-btn');
    boldBtn.addEventListener('click', (e) => {
        let parent = e.target.parentNode;
        parent.style.fontWeight = parent.style.fontWeight === "bold" ? "normal" : "bold";
        updateElementInArray(parent);
    });
    
    const italicBtn = document.createElement("button");
    italicBtn.textContent = "Italic";
    italicBtn.classList.add('italic-btn');
    italicBtn.addEventListener('click', (e) => {
        let parent = e.target.parentNode;
        parent.style.fontStyle = parent.style.fontStyle === "italic" ? "normal" : "italic";
        updateElementInArray(parent);
    });
    
    element.appendChild(boldBtn);
    element.appendChild(italicBtn);
    
    element.querySelector('.text').addEventListener('click', (e) => {
        makeEditable(e.target);
    });
    
    mainContainer.appendChild(element);
    
    elementArray.unshift(element.outerHTML);
    localStorage.setItem("elementArray", JSON.stringify(elementArray));
    
    valueInput.value = '';
}

const makeEditable = (element) => {
    if (element.parentNode.querySelector('#nameInputChange')) {
        return;
    }
    
    const originalValue = element.textContent;
    const originalElement = element;
    
    element.style.display = 'none';
    
    let inputField = document.createElement("input");
    inputField.value = originalValue;
    inputField.id = 'nameInputChange';

    element.parentNode.insertBefore(inputField, element.nextSibling);
    
    inputField.focus();
    
    inputField.addEventListener('blur', () => saveEdit(inputField, originalElement));
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit(inputField, originalElement);
        }
    });
}

function saveEdit(inputField, originalElement) {
    const newValue = inputField.value;
    
    originalElement.innerHTML = newValue;
    originalElement.style.display = '';
    
    elementArray = elementArray.map(element => {
        let range = document.createRange();
        let fragment = range.createContextualFragment(element);
        let firstElement = fragment.firstElementChild;

        if (originalElement.parentNode.id === firstElement.id) {
            inputField.remove();
            return originalElement.parentNode.outerHTML
        }

        return element; 
    })
    
    localStorage.setItem("elementArray", JSON.stringify(elementArray));
}