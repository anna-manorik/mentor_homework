const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const autoBtn = document.getElementById("auto");
const currentImg = document.querySelector('.active')

const listItems = document.querySelectorAll(".slider-img");
const images = Array.from(listItems).map((img, index) => img.id = index + 1);
let currentImgId = Number(currentImg.getAttribute('id'))

function slideNext () {
    const currentImg = document.querySelector('.active')

    if(currentImgId === listItems.length) {
        currentImg.classList.remove('active')
        document.getElementById(1).classList.add('active')
        currentImgId = 1;
        return
    }

    if(currentImgId < listItems.length) {
        currentImg.classList.remove('active')
        document.getElementById(currentImgId + 1).classList.add('active')
        currentImgId += 1;
    }
}

nextBtn.addEventListener('click', () => {
    slideNext()
})

prevBtn.addEventListener('click', () => {
    const currentImg = document.querySelector('.active')

    if(currentImgId === 1) {
        currentImg.classList.remove('active')
        document.getElementById(listItems.length).classList.add('active')
        currentImgId = listItems.length;
        return
    }

    if(currentImgId <= listItems.length) {
        currentImg.classList.remove('active')
        document.getElementById(currentImgId - 1).classList.add('active')
        currentImgId -= 1;
    }
})

autoBtn.addEventListener ('click', () => {
    setInterval(() => {
         slideNext()
    }, 2000);
})