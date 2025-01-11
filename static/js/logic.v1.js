// Store our API endpoint as queryUrl.
// geojson data for the past month
// let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// geojson data for the past day
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    
    let features = data.features

    

    // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(features);
});

function createFeatures(earthquakeData) {
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3>
            <hr>
            <p><h3>Magnitude: ${feature.properties.mag}</h3>
            <p>${new Date(feature.properties.time)}</p>`);
     }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // let earthquakeMarkers = [];


    console.log('earthquakes::', earthquakes);
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}
// 




function createMap(earthquakes) {
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

// Loop through locations, and create the city and state markers.
features.forEach((item, index) => {
    let location = [item.geometry.coordinates[1], item.geometry.coordinates[0]]
    // console.log('latlng::', latlng);

    // Setting the marker radius for the state by passing population into the markerSize function
    if(location) {
        L.circleMarker(location, {
            stroke: false,
            fillOpacity: 0.75,
            color: 'white',
            fillColor: item.geometry.coordinates[2],
            radius: item.properties.mag*3
        }).addTo(myMap);
    }
});

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}
