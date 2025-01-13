// Define some locations with arbitrary values for radius
let data_test = [
    { properties: {
        place: "Central Park", 
        mag: 1.2
    }, 
    coordinates: [-73.9683, 40.7851, 4.13] 
},
    { properties: {
        place: "Times Square",
        mag: 2.7
    },
    coordinates: [-73.9855, 40.7580, 0.85]
},
    { properties: {
        place: "Brooklyn Bridge",
        mag: 5.9
    },
    coordinates: [-73.9969, 40.7061, 2.0]
}
];

// Store our API endpoint as queryUrl.
// geojson data for the past month
// let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// geojson data for the past day
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    console.log(data);
    // Once we get a response, send the data.features object to the createFeatures function.
    // createFeatures(data.features);
  });

// Create the map and set its view to New York City
let myMap = L.map('map').setView([40.7128, -74.0060], 10);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(myMap);

// Add CircleMarkers to the map
data_test.forEach(function(data_test) {
    L.circleMarker(data_test.coordinates, {
        radius: data_test.properties.mag * 5, // Adjust radius for visibility
        color: 'blue',
        fillColor: '#30f',
        fillOpacity: 0.5
    }).bindPopup(data_test.name).addTo(myMap);
});