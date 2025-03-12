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

        dayDiv.addEventListener("click", () => 
            alert(`Ви вибрали: ${day}/${month + 1}/${year}`)
        );

        calendarGrid.appendChild(dayDiv);
    }

    calendarDiv.appendChild(calendarGrid);
}

const today = new Date();
createCalendar(today.getFullYear(), today.getMonth());
