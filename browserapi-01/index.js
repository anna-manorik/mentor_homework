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
    } else {
        return
    }

    document.querySelectorAll('.h1').forEach((button) => {
        button.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === "span") {
                makeEditable(e.target)
            }
        });
    });

    document.querySelectorAll('.h2').forEach((button) => {
        button.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === "span") {
                makeEditable(e.target)
            }
        });
    });

    document.querySelectorAll('.p').forEach((button) => {
        button.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === "span") {
                makeEditable(e.target)
            }
        });
    });

    document.querySelectorAll('.bold-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
            let parent = e.target.parentNode;
            parent.style.fontWeight = parent.style.fontWeight === "bold" ? "normal" : "bold";
            
            elementArray = elementArray.map(element => {
                let range = document.createRange();
                let fragment = range.createContextualFragment(element);
                let firstElement = fragment.firstElementChild; 

                if (parent.id === firstElement.id) {
                    return parent.outerHTML
                }

                return element; 
            })
            
            localStorage.setItem("elementArray", JSON.stringify(elementArray));
        });
    });

    document.querySelectorAll('.italic-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
            let parent = e.target.parentNode;
            let currentStyle = window.getComputedStyle(parent).fontStyle;
    
            parent.style.fontStyle = currentStyle === "italic" ? "normal" : "italic";

            elementArray = elementArray.map(element => {
                let range = document.createRange();
                let fragment = range.createContextualFragment(element);
                let firstElement = fragment.firstElementChild;

                if (parent.id === firstElement.id) {
                    return parent.outerHTML
                }

                return element; 
            })
            
            localStorage.setItem("elementArray", JSON.stringify(elementArray));
        });
    });
})

addH1Btn.addEventListener('click', (e) => {
    e.preventDefault();

    if(!valueInput.value.trim()) {
        return
    }
    
    const h1 = document.createElement('h1')
    h1.id = nanoid()
    h1.classList.add('h1')
    h1.innerHTML = `<span class="text">${valueInput.value}</span>`
    
    h1.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === "span") {
            makeEditable(e.target)
        }
    })

    saveHTML(h1)
})

addH2Btn.addEventListener('click', (e) => {
    e.preventDefault();

    if(!valueInput.value.trim()) {
        return
    }
    
    const h2 = document.createElement('h2')
    h2.id = nanoid()
    h2.classList.add('h2')
    h2.innerHTML = `<span class="text">${valueInput.value}</span>`
    
    h2.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === "span") {
            makeEditable(e.target)
        }
    })

    saveHTML(h2)
})

addParagrathBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if(!valueInput.value.trim()) {
        return
    }
    
    const p = document.createElement('p')
    p.id = nanoid()
    p.classList.add('parag')
    p.innerHTML = `<span class="text">${valueInput.value}</span>`
    
    p.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === "span") {
            makeEditable(e.target)
        }
    })

    saveHTML(p)
})

const addStyle = (element) => {
    button1.textContent = "Bold";
    button1.classList.add('bold-btn')

    button2.textContent = "Italic";
    button2.classList.add('italic-btn');

    button1.addEventListener('click', () => {
        element.style.fontWeight = element.style.fontWeight === "bold" ? "normal" : "bold";
    })

    button2.addEventListener('click', () => {
        element.style.fontStyle = element.style.fontStyle === "italic" ? "normal" : "italic";
    })

    element.appendChild(button1);
    element.appendChild(button2);
}

const saveHTML = (element) => {
    mainContainer.appendChild(element)
    addStyle(element)

    elementArray.unshift(element.outerHTML)
    localStorage.setItem("elementArray", JSON.stringify(elementArray));
    
    valueInput.value = ''
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