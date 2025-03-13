import { nanoid } from './node_modules/nanoid/nanoid.js';

const eventNameInput = document.getElementById("eventName");
const eventDate = document.getElementById("eventDate");
const addEventBtn = document.getElementById("addEventBtn");
const eventListUl = document.getElementById("eventListUl");

let eventsList = JSON.parse(localStorage.getItem('eventsList')) || [];

function createCalendar(year, month) {
    const calendarDiv = document.getElementById("calendar");
    calendarDiv.innerHTML = "";

    const daysInMonth = new Date(year, month + 1, 0).getDate(); 
    const firstDay = new Date(year, month, 0).getDay();

    const calendarGrid = document.createElement("div");
    calendarGrid.classList.add("calendar-grid");

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement("div");
        calendarGrid.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.textContent = day;
        dayDiv.classList.add("day");
        if (month < 10) {
            dayDiv.id = `${year}-0${month + 1}-${day}`
        } else {
            dayDiv.id = `${year}-${month + 1}-${day}`
        }
        

        dayDiv.addEventListener("click", (e) => {
            eventListUl.innerHTML = '';
            const array = eventsList.filter(event => event.eventDate === e.target.id)
            array.forEach(element => {showEvent(element)});
        });

        calendarGrid.appendChild(dayDiv);
    }

    calendarDiv.appendChild(calendarGrid);
}

const today = new Date();
createCalendar(today.getFullYear(), today.getMonth());


addEventBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const eventName = eventNameInput.value.trim();

    if (!eventName) {
        return toastr.error('Please, fill name!');
    }

    if (!eventDate.value) {
        return toastr.error('Please, choose the date!');
    }
    
    let eventsList = JSON.parse(localStorage.getItem('eventsList')) || [];
    const newEvent = {
        id: nanoid(),
        eventName: eventNameInput.value,
        eventDate: eventDate.value
    }
    
    localStorage.setItem("eventsList", JSON.stringify([newEvent, ...eventsList]));
    toastr.success('New record was created successfully!')
    eventNameInput.value = ''
})

function showEvent ({ id, eventName, eventDate }) {
    // eventListUl.innerHTML = '';
    const li = document.createElement("li");
    li.innerHTML = `
    <div class="">
        <div class="event-name"><span>${eventName}</span></div>
        <span class="event-date">${eventDate}</span>
        <button class="delete-btn" id=${id}>❌</button>
    </div>
    `;

    eventListUl.appendChild(li);

    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
        deleteEvent(id);
    });
}

function deleteEvent(eventItemId) {
    let eventsList = JSON.parse(localStorage.getItem('eventsList'));

    eventsList = eventsList.filter(event => event.id !== eventItemId)
    localStorage.setItem("eventsList", JSON.stringify(eventsList));
    toastr.success('Task was deleted successfully!')
}