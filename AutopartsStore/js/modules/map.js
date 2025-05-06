import { fetchData } from "./fetchWrapper.js";

export async function initLeafletMap() {
  try {
    // Initialize map at a given center and zoom level
    const map = L.map('leafletMap').setView([45.5019, -73.5674], 12);

    // Add tile layer from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Load places data
    const locations = await fetchData('./data/places.json');
    renderLocations(map, locations);
  } catch (error) {
    console.error('Map initialization failed:', error);
    document.getElementById('leafletMap').innerHTML = `
      <div class="alert alert-danger">
        Failed to load map. Please try again later.
      </div>`;
  }
}

// Render all location markers based on categories and places
function renderLocations(map, { categories, places }) {
  // Create a mapping from category ID to Leaflet icon
  const categoryIcons = {};
  categories.forEach(category => {
    categoryIcons[category.id] = L.icon({
      iconUrl: `images/markers/${category.markerIcon}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
  });

  // Add each place as a marker to the map
  places.forEach(place => {
    const icon = categoryIcons[place.categoryId];
    const [lat, lng] = place.point.coordinates;

    L.marker([lat, lng], { icon })
      .addTo(map)
      .bindPopup(`<strong>${place.name}</strong><br>${place.description}`);
  });
}
