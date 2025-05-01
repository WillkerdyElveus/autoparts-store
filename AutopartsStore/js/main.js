// Import utility functions for fetching data and managing the cart
import { initCart, addToCart } from './modules/shoppingCart.js';
import { initLeafletMap } from './modules/map.js';
import { fetchProducts, setupSort } from "./modules/listing.js";
// Arrays to hold the full list of products and the current filtered/sorted view
let products = [];    // Will store all fetched products
let filtered = [];    // Will store products after sorting/filtering

// When the DOM is fully loaded, set up the cart link, fetch products, and configure sorting
document.addEventListener('DOMContentLoaded', () => {
  console.log("Bruh");
  initApp();
  initCart();       // Initialize the "Show Cart" link and renderCart()
});

function initApp() {
  console.log("Initializing the app...");
  // Add a click event handler to the fetch shows button
  // 1) We need to select the button 
  // 2) Add the click event handler
  //Figure out what page the user is viewing 
  const page = document.querySelector("[data-page]").dataset.page;
  console.log(page);
  if(page === "map"){
      initLeafletMap();
  }else if(page === "listing"){
    fetchProducts();
    setupSort();
  }
}

/**
 * Render a given list of products into the .product-list container.
 * Clears existing content, then creates a card for each product with an "Add To Cart" button.
 */
export function renderProducts(list) {
  const container = document.querySelector('.product-list');
  container.innerHTML = '';       // Remove old cards

  list.forEach(p => {
    // Create card element and set its class
    const card = document.createElement('div');
    card.className = 'product-card';

    // Populate card inner HTML with product image, title, price, description, and button
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h5>${p.title}</h5>
      <h6>$${p.price.toFixed(2)}</h6>
      <p class="text-muted">${p.description.slice(0, 60)}…</p>
      <button class="btn btn-primary">Add To Cart</button>
    `;

    // Add click listener to call addToCart() when the button is clicked
    card.querySelector('button')
        .addEventListener('click', () => addToCart(p));

    // Append the new card to the container
    container.appendChild(card);
  });
}

/**
 * "Sort By" dropdown (id="category").
 * When changed, sort `filtered` by price or rating, then re-render.
 */
function setupSort() {
  const sortSelect = document.getElementById('category');

  sortSelect.addEventListener('change', () => {
    const val = sortSelect.value;

    if (val === 'all') {                    // Sort by lowest price
      filtered.sort((a, b) => a.price - b.price);
    } else if (val === 'exhaust') {         // Sort by highest price
      filtered.sort((a, b) => b.price - a.price);
    } else if (val === 'turbo') {           // Sort by best rating
      filtered.sort((a, b) => b.rating.rate - a.rating.rate);
    }

    renderProducts(filtered);  // Re-render products after sorting
  });
}

