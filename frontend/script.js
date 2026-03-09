const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

document.getElementById('search-btn').addEventListener('click', async () => {
    const trainNumber = document.getElementById('train-number').value;
    console.log('Button clicked! train:', trainNumber);

    const response = await fetch(`http://localhost:3000/api/route/${trainNumber}`);
    const stations = await response.json();

    console.log('Stations received:', stations);

    stations.forEach(station => {
        L.marker([station.latitude, station.longitude])
         .addTo(map)
         .bindPopup(station.station_name);
    });
    const coordinates = stations.map(station => 
        [station.latitude, station.longitude]
    );

    L.polyline(coordinates, {
        color:'red',
        weight: 3
    }).addTo(map);
});

