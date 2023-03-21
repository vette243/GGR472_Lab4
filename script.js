/*--------------------------------------------------------------------
GGR472 LAB 4: Incorporating GIS Analysis into web maps using Turf.js 
--------------------------------------------------------------------*/


/*--------------------------------------------------------------------
Step 1: INITIALIZE MAP
--------------------------------------------------------------------*/
//Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoidmV0dGUyNDMiLCJhIjoiY2xlNHJqbHNrMDVzNzNucDJrYm90djFrcyJ9.j2TYaVOLnNy8bDEv82GwLQ'; //****ADD YOUR PUBLIC ACCESS TOKEN*****

//Initialize map and edit to your preference
const map = new mapboxgl.Map({
    container: 'map', //container id in HTML
    style: 'mapbox://styles/vette243/cle4pjfh6002401pal69tqaif',  
    //****ADD MAP STYLE HERE *****
    center: [-79.39, 43.65],  // starting point, longitude/latitude
    zoom: 12 // starting zoom level
});



/*--------------------------------------------------------------------
Step 2: VIEW GEOJSON POINT DATA ON MAP
--------------------------------------------------------------------*/
//HINT: Create an empty variable
//      Use the fetch method to access the GeoJSON from your online repository
//      Convert the response to JSON format and then store the response in your new variable
let Pedgeojson

fetch('https://github.com/vette243/GGR472_Lab4/blob/6ee44410f22684927871406c39135e658ae47dd5/pedcyc_collision_06-21.geojson')
    .then(response => response.json())
    .then(response => {
        console.log(response); //Check response in console
        Pedgeojson = response; // Store geojson as variable using URL from fetch response
    });



/*--------------------------------------------------------------------
    Step 3: CREATE BOUNDING BOX AND HEXGRID
--------------------------------------------------------------------*/
//HINT: All code to create and view the hexgrid will go inside a map load event handler
//      First create a bounding box around the collision point data then store as a feature collection variable
//      Access and store the bounding box coordinates as an array variable
//      Use bounding box coordinates as argument in the turf hexgrid function
map.on('load', () => {
    //Add datasource using GeoJSON variable
    map.addSource('Pedgeojson', {
        type: 'geojson',
        data: 'https://vette243.github.io/GGR472_Lab4/pedcyc_collision_06-21.geojson'
    });

    //Set style for when new points are added to the data source
    map.addLayer({
        'id': 'Collision',
        'type': 'point',
        'source': 'Pedgeojson',
        'paint': {
            'circle-radius': 5,
            'circle-color': 'blue'
        }
    });
});


/*--------------------------------------------------------------------
Step 4: AGGREGATE COLLISIONS BY HEXGRID
--------------------------------------------------------------------*/
//HINT: Use Turf collect function to collect all '_id' properties from the collision points data for each heaxagon
//      View the collect output in the console. Where there are no intersecting points in polygons, arrays will be empty
const collectedIds = [];
Pedgeojson.features.forEach(() => {
    // get the intersection points between the hexagon and the collision points
    const intersectingPoints = turf.collect(Pedgeojson, '_id');
collectedIds.push(intersectingPoints.features.map((f) => f.properties._id));
});
// view the collected IDs in the console
console.log(collectedIds);
// /*--------------------------------------------------------------------
// Step 5: FINALIZE YOUR WEB MAP
// --------------------------------------------------------------------*/
//HINT: Think about the display of your data and usability of your web map.
//      Update the addlayer paint properties for your hexgrid using:
//        - an expression
//        - The COUNT attribute
//        - The maximum number of collisions found in a hexagon
//      Add a legend and additional functionality including pop-up windows

map.on('click',(e) =>{
    const clickedpoint = {
        'type': 'Feature',
        'geometry':{
            'type':'Point',
            'coordinates':[e.lngLat.lng,e.lngLat.lat]
        }
    };
    //Add clicked point to previously empty geojson eature Collection
    geojson.features.push(clickedpoint);
})
