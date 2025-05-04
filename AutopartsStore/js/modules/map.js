import { fetchData } from "./fetchWrapper.js";

/*export async function initLeafletMap(){
console.log("Initializing the map...");
const map = L.map('leafletMap').setView([45.5019, -73.5674], 10);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

    ///2) Fetch the content of the places.json using the fetch api
    const placesUri = "./data/places.json";
    const locations = await fetchData(placesUri);
    console.log(locations.categories);
    console.log(locations.places);
    // Process the location 
     renderLocations(map, locations);
}*/

export async function initLeafletMap() {
  try {
      const map = L.map('leafletMap').setView([45.5019, -73.5674], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const locations = await fetchData('./data/places.json');
      renderLocations(map, locations);
  } catch (error) {
      console.error('Map initialization failed:', error);
      document.getElementById('leafletMap').innerHTML = `
          <div class="alert alert-danger">
              Failed to load map. Please try again later.
          </div>
      `;
  }
}


    //3) Loop over the locations.places array and for each place create a marker object and add to the map
    //the marker needs to be populated
/*function renderLocations(map, locations) {
L.marker([45.5145, -73.6756]).addTo(map)
    .bindPopup('Vanier College')
    .openPopup();

    L.marker([45.5139, -73.6830]).addTo(map)
    .bindPopup('Metro Cote-Vertu')
    .openPopup();
    
        console.log(locations);
        locations.places.forEach(place => {
         const category = locations.categories.find(category => category.id === place.category.id); 
        });

        place.coordinates.split(",");
        console.log(category.markerIcon); 

          // Add marker to the map
          L.marker([coords[0], coords[1]], { icon: customIcon })
            .addTo(map)
            .bindPopup(`<strong>${place.name}</strong><br>${place.description}`);
      }*/

            function renderLocations(map, { categories, places }) {
              // Create category icons
              const categoryIcons = {};
              categories.forEach(category => {
                  categoryIcons[category.id] = L.icon({
                      iconUrl: `images/markers/${category.markerIcon}`,
                      iconSize: [32, 32],
                      iconAnchor: [16, 32]
                  });
              });
          
              // Add markers to map
              places.forEach(place => {
                  const icon = categoryIcons[place.categoryId];
                  L.marker(place.point.coordinates, { icon })
                      .addTo(map)
                      .bindPopup(`
                          <strong>${place.name}</strong><br>
                          ${place.description}
                      `);
              });
          }



function renderLocations2(map, places) {
   
  
    places.forEach(place => {
      const coords = place.point.coordinates;
      const category = categoryMap[place.categoryId];
  
  
    //   Custom icon
      const customIcon = L.icon({
        iconUrl: iconUrl,
        iconSize: [25, 41],      
        iconAnchor: [12, 41],
        popupAnchor: [0, -41]
      });
  
      // Add marker to the map
      L.marker([coords[0], coords[1]], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<strong>${place.name}</strong><br>${place.description}`);
    });
  }