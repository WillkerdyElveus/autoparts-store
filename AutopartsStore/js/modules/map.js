import { fetchData } from "./fetchWrapper.js";

export async function initLeafletMap() {
  try {
    // Initialize map at center of Montreal
    const map = L.map('leafletMap').setView([45.5019, -73.5674], 12);

    // Add tile layer from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Load places data
    const locations = await fetchData('./data/places.json');
    renderLocations(map, locations);

    //build an array of markers
    const { categories, places } = locations;
    const markers = createMarkersArray(map, places, categories);

    //render the sidebar list
    renderList(markers);

    //Filter
    attachFilterListener(map, markers);

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

// Build an array of {place,marker} for the filter
 function createMarkersArray(map, places, categories) {
  // Rebuild the same categoryIcons map
  const categoryIcons = {};
  categories.forEach(cat => {
    categoryIcons[cat.id] = L.icon({
      iconUrl: `images/markers/${cat.markerIcon}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
  });

  //Return marker objects
  return places.map(place => {
    const [lat, lng] = place.point.coordinates;
    const marker = L.marker([lat, lng], {
      icon: categoryIcons[place.categoryId]
    })
      .addTo(map)
      .bindPopup(`<strong>${place.name}</strong><br>${place.description}`);
    return { place, marker };
  });
}

// Render the sidebar list + move the map and open the name
 function renderList(items) {
  const listEl = document.getElementById('placeList');
  listEl.innerHTML = '';
  items.forEach(({ place, marker }) => {
    const li = document.createElement('li');
    li.className = 'list-group-item list-item';
    li.textContent = place.name;
    li.addEventListener('click', () => {
      const [lat, lng] = place.point.coordinates;
      marker._map.setView([lat, lng], 15);
      marker.openPopup();
    });
    listEl.appendChild(li);
  });
}

// Filter both list items and map markers on search input
 function attachFilterListener(map, markers) {
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();
    const filtered = markers.filter(({ place }) =>
      place.name.toLowerCase().includes(term)
    );

    // show/hide markers
    markers.forEach(({ place, marker }) => {
      if (place.name.toLowerCase().includes(term)) {
        if (!map.hasLayer(marker)) marker.addTo(map);
      } else {
        if (map.hasLayer(marker)) map.removeLayer(marker);
      }
    });
    // re-render the sidebar
    renderList(filtered);
  });
}