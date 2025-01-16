// Store our API endpoint as queryUrl.
// geojson data for the past month
// let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// geojson data for the past week
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// geojson data for the past day
// let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// Create features for the earthquakes
function createFeatures(earthquakeData) {
    // Define a function that runs for each feature in the features array
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}
          <hr>
          <p>Magnitude: ${feature.properties.mag}
          <p>Depth: ${feature.geometry.coordinates[2]}km
          <p>${new Date(feature.properties.time)}`);
   }

    // var colorScale = L.scale.linear()
    //   .domain([0, 100])
    //   .range(['#66FF66', '#CC0000']);

    // function getColor(value) {
    //   return colorScale(value);
    // }  

    function getColor(depth) {
      return depth > 80 ? '#581845' :
             depth > 60 ? '#900C3F' :
             depth > 40 ? '#C70039' :
             depth > 20 ? '#FF5733' :
                         '#FFC300' ;
    }

    // Create a GeoJSON layer that contains the features array
    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 4, // Adjust the size based on the magnitude
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: '#000',
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

  // Set up the legend.
  let legend = L.control({ position: "bottomright" });

  legend.onAdd = function() {
    // create div
    let div = L.DomUtil.create('div', 'legend');
    // add legend content
    div.innerHTML = "<h2><center>Legend</center></h2>" +
                  "<i style='background: #581845'></i> depth > 80 km<br>" +
                  "<i style='background: #900C3F'></i> 60 - 80 km<br>" +
                  "<i style='background: #C70039'></i> 40 - 60 km<br>" +
                  "<i style='background: #FF5733'></i> 20 - 40 km<br>" +
                  "<i style='background: #FFC300'></i> O - 20 km<br>";
  
  return div;
  };
  
  legend.addTo(myMap);
}
