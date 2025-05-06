// Import utility functions for fetching data and managing the cart
import { initLeafletMap } from './modules/map.js';
import { initCart, addToCart } from './modules/shoppingCart.js';
import { fetchProducts, setupSort } from "./modules/listing.js";
import { setupFormValidation } from "./modules/formValidation.js";
import { setupSearch } from "./modules/search.js";
//import { loadProductDetails } from "./modules/productDetails.js";
import { loadProducts } from './modules/products.js';
// Arrays to hold the full list of products and the current filtered/sorted view
let products = [];    // Will store all fetched products
let filtered = [];    // Will store products after sorting/filtering

// When the DOM is fully loaded, set up the cart link, fetch products, and configure sorting
document.addEventListener('DOMContentLoaded', () => {
  console.log("Bruh");
  initApp();
  initCart();// Initialize the "Show Cart" link and renderCart()
  
  const page = document.querySelector("[data-page]")?.dataset.page;
  if (!page) return;

  switch(page) {
    case "map":
      initLeafletMap();
      break;
    case "listing":
      fetchProducts();
      setupSort();
      setupSearch();
      break;
    case "account":
      setupFormValidation();
      break;
    case "product":
      loadProductDetails();
      break;
    case "cart":
      renderCart();
      break;
  }
});

function initApp() {
  console.log("Initializing the app...");
  // Add a click event handler to the fetch shows button
  // 1) We need to select the button 
  // 2) Add the click event handler
  //Figure out what page the user is viewing 
  const page = document.querySelector("[data-page]").dataset.page;
  console.log(page);
  if(page === "listing"){
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

