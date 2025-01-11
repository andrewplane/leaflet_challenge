// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// Create features for the earthquakes
function createFeatures(earthquakeData) {
    // Define a function that runs for each feature in the features array
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3>
          <hr>
          <p><h3>Magnitude: ${feature.properties.mag}</h3>
          <p>${new Date(feature.properties.time)}</p>`);
   }

   

    // Create a GeoJSON layer that contains the features array
    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
          console.log(feature.geometry.coordinates[2]);
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 4, // Adjust the size based on the magnitude
                fillColor: `${feature.geometry.coordinates[2]*10}`,
                color: `${feature.geometry.coordinates[2]}`,
                weight: 0.5,
                opacity: 0.01,
                fillOpacity: 0.8
            });
        },
        onEachFeature: onEachFeature
    });

    // Create the map
    createMap(earthquakes);
}

// Function to determine color based on magnitude
function getColor(magnitude) {
    return magnitude > 5 ? 'red' :
           magnitude > 4 ? 'orange' :
           magnitude > 3 ? 'yellow' :
           magnitude > 2 ? 'green' :
           'blue';
}

// Create the map
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

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}