const locations = [
    { name: "Київ", lat: 50.3961, lon: 30.6364, audio: "./audio/kyiv.mp3" },
    { name: "Львів", lat: 49.8397, lon: 24.0297, audio: "./audio/kyiv.mp3" }
];


document.getElementById("startButton").addEventListener("click", () => {
    initAudioContext();
});

const map = L.map('map').setView([50.3961, 30.6364], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

locations.forEach(loc => {
    L.marker([loc.lat, loc.lon])
        .addTo(map)
        .bindPopup(loc.name);
});

let audioContext, gainNode, currentAudio;
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
    }
}

function playAudio(audioUrl) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    currentAudio = new Audio(audioUrl);
    const track = audioContext.createMediaElementSource(currentAudio);
    track.connect(gainNode);

    currentAudio.play();
}

if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords;
        document.getElementById("status").innerText = `Ваше місцезнаходження: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        checkLocation(latitude, longitude);
    }, error => console.error(error), { enableHighAccuracy: true });
}

function checkLocation(userLat, userLon) {
    locations.forEach(loc => {
        const distance = getDistance(userLat, userLon, loc.lat, loc.lon);

        if (distance < 0.5) { 
            initAudioContext();
            playAudio(loc.audio);
            adjustVolume(distance);
        }
    });
}

function adjustVolume(distance) {
    const maxDistance = 0.5;
    let volume = 1 - (distance / maxDistance);
    gainNode.gain.value = Math.max(volume, 0); 
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const placesList = document.getElementById("places");
locations.forEach(loc => {
    const li = document.createElement("li");
    li.className = "place";
    li.innerHTML = `<strong>${loc.name}</strong>`;
    placesList.appendChild(li);
});
