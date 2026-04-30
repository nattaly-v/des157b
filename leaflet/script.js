(function () {
    'use strict';

    var map = L.map('map').setView([38.251492, -122.049850], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 1. Polygon — Solano Community College
    L.polygon([
        [38.24086, -122.12347],
        [38.23275, -122.12699],
        [38.23139, -122.12163],
        [38.23387, -122.11864],
        [38.23878, -122.11662]
    ]).addTo(map)
        .bindPopup('<img src="scc.jpeg" width="200"><br><b>Solano Community College</b><br>The community college I attended.');

    // 2. Circle — Home
    L.circle([38.258108, -122.042556], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 550
    }).addTo(map)
        .bindPopup('<img src="home.jpeg" width="200"><br><b>Home</b><br>This is around the area that I live.');

    // 3. Marker — Barnes and Noble
    L.marker([38.260739, -122.058811]).addTo(map)
        .bindPopup('<img src="barnes.jpeg" width="200"><br><b>Barnes and Noble</b><br>Where I spend my time doing school work.');

}());