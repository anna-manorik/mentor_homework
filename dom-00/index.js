import { nanoid } from './node_modules/nanoid/nanoid.js';

const urlInput = document.getElementById("urlInput");
const descInput = document.getElementById("descInput");
const addPicBtn = document.getElementById("addPicBtn");
const picsList = document.getElementById("picsList");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeBtn = document.getElementById("closeBtn");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

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
    const li = document.createElement("li");
    li.innerHTML = `
        <img src='${picUrl}' alt='${picDesc}' class='pic-preview' id=${picId} />
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

picsList.addEventListener("click", (e) => {
    if(e.target.className === "pic-preview") {
        lightbox.classList.remove("hidden");
        lightboxImg.src = e.target.src;
        lightboxImg.classList.add('active');

        const picsList = JSON.parse(localStorage.getItem('picsList'))
        picsList.map(picItem => 
            picItem.picId === e.target.id 
            ? picItem.isActive = true : picItem.isActive = false
        )

        localStorage.setItem("picsList", JSON.stringify(picsList));
    }
});

closeBtn.addEventListener("click", () => {
    lightbox.classList.add("hidden");
});




const picObjects = JSON.parse(localStorage.getItem('picsList'));
let currentIndex = 0;

nextBtn.addEventListener('click', (e) => {
    if (currentIndex + 1 < picObjects.length) {
        currentIndex += 1;
        lightboxImg.src = picObjects[currentIndex].picUrl;
    } else {
        currentIndex = 0;
        lightboxImg.src = picObjects[0].picUrl;
    }
})

prevBtn.addEventListener('click', () => {
    if(currentIndex === 0) {
        currentIndex = picObjects.length - 1;
        lightboxImg.src = picObjects[currentIndex].picUrl;
        return
    } 
    
    if (currentIndex <= picObjects.length) {
        currentIndex -= 1;
        lightboxImg.src = picObjects[currentIndex].picUrl;
    }
})