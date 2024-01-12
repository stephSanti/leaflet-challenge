
// Fetch the data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Determine marker color by depth
function chooseColor(depth){
    if (depth < 10) return "#00FF00";
    else if (depth < 30) return "greenyellow";
    else if (depth < 50) return "yellow";
    else if (depth < 70) return "orange";
    else if (depth < 90) return "orangered";
    else return "#FF0000";
}

// Create the map
let myMap = L.map("map", {
    center: [37.8, -96.9],  // Center of the USA
    zoom: 3,
    maxBounds: [
        [5.499550, -167.276413], //Southwest
        [83.162102, -52.233040] //Northeast
    ]
});

// Add the tile layer to the map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(myMap);

// Perform a GET request to the url
d3.json(url).then(function (data) {
    // Console log  
    console.log(data);

    // Marker size
    function markerSize(magnitude) {
        return magnitude * 2000;
    };

    // Add a marker for each earthquake
    data.features.forEach(feature => {
        let coords = feature.geometry.coordinates;
        let latLng = [coords[1], coords[0]];
        let magnitude = feature.properties.mag;
        let depth = coords[2];

        // The marker size and color depend on magnitude and depth
        L.circle(latLng, {
            fillOpacity: 0.75,
            color: "none",
            fillColor: chooseColor(depth),
            radius: markerSize(magnitude)
        }).bindPopup(`<h2>${feature.properties.place}</h2><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth} km</p>`).addTo(myMap);
    });
});

// Add legend
let legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];

    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
      '<i style="background:' + chooseColor(depth[i] + 1) + '; width: 18px; height: 18px; float: left; margin-right: 8px;"></i> ' + depth[i] + (depth[i + 1] ? '–' + depth[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap);







