const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const currentImg = document.querySelector('.active')

const listItems = document.querySelectorAll(".slider-img");
const images = Array.from(listItems).map((img, index) => img.id = index + 1);
let currentImgId = Number(currentImg.getAttribute('id'))

nextBtn.addEventListener('click', () => {
    const currentImg = document.querySelector('.active')

    if(currentImgId < listItems.length) {
        currentImg.classList.remove('active')
        document.getElementById(currentImgId + 1).classList.add('active')
        currentImgId += 1;
        console.log("!!!", currentImgId)
    }
    

})