import { nanoid } from './node_modules/nanoid/nanoid.js';

const urlInput = document.getElementById("urlInput");
const descInput = document.getElementById("descInput");
const addPicBtn = document.getElementById("addPicBtn");
const picsList = document.getElementById("picsList");

document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem('picsList')) {
        const picsList = JSON.parse(localStorage.getItem('picsList'));

        picsList.forEach(pic => addNewPic(pic));
    }
});

addPicBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (!urlInput.value.trim() || !descInput.value.trim()) {
        toastr.error('Please, enter URL and description!');
        return;
    }

    let picsList = JSON.parse(localStorage.getItem('picsList')) || [];
    const newPic = {
        picId: nanoid(),
        picUrl: urlInput.value,
        picDesc: descInput.value,
    }

    addNewPic(newPic);
    picsList.unshift(newPic);
    localStorage.setItem("picsList", JSON.stringify(picsList));
    toastr.success('New pic was added successfully!')

    urlInput.value = '';
    descInput.value = ''
})

function addNewPic({ picId, picUrl, picDesc }) {
    // console.log('1111', picUrl, picDesc)
    const li = document.createElement("li");
    li.innerHTML = `
        <img src='${picUrl}' alt='${picDesc}' class='pic-preview' />
        <button class="delete-btn" id=${picId}>❌</button>
    `

    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
        deletePic(picId);
    });

    picsList.appendChild(li)

    return li
}

function deletePic(picId) {
    let picsList = JSON.parse(localStorage.getItem('picsList'));

    picsList = picsList.filter(pic => pic.picId !== picId)
    localStorage.setItem("picsList", JSON.stringify(picsList));
    toastr.success('Pic was deleted successfully!')
}