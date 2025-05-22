// Import utility functions for fetching data and managing the cart
import { initLeafletMap } from './modules/map.js';
import { initCart, renderCart } from './modules/shoppingCart.js';
import { initListingApp, fetchProducts, setupSort } from "./modules/listing.js";
import { setupFormValidation } from "./modules/formValidation.js";
import { setupSearch } from "./modules/search.js";
import { loadProductDetails  } from './modules/products.js';
import {initCarousel} from './modules/home.js';
import { fetchReviews, setupReviewFilters } from './modules/reviews.js';

// Arrays to hold the full list of products and the current filtered/sorted view
let products = [];    // Will store all fetched products
let filtered = [];    // Will store products after sorting/filtering

document.addEventListener('DOMContentLoaded', () => {
  console.log("Main.js");
  initApp();
  initCart();// Initialize the "Show Cart" link and renderCart()
  
   const toggle = document.getElementById('theme-toggle');

  // On change, add/remove the 'dark-mode' class on <html>
  toggle.addEventListener('change', () => {
    document.documentElement.classList.toggle('dark-mode', toggle.checked);
  });

});

//Initializes the application based on the current page
function initApp() {
  console.log("Initializing the Application"); // Log initialization
  
  // Get current page from data attribute
  const page = document.querySelector("[data-page]")?.dataset.page;
  if (!page) return;

  // Initialize page-specific functionality
  switch(page) {
    case "map":
      initLeafletMap();
      break;
    case "listing":
      initListingApp();
      setupSearch(); // Enable search functionality
      break;
      case "home":
        initCarousel();
        fetchProducts();
        setupSearch(); // Enable search functionality
      break;
    case "account":
      setupFormValidation();
      break;
    case "cart":
      renderCart(); // Display shopping cart contents
      break;
       case "detail":
         loadProductDetails();
         break;
      case "search":
        setupSearch(); // Set up search page functionality
        break;
      case "reviews":
        fetchReviews();
        setupReviewFilters();  // Enable review filtering
        break;
  }     
}


