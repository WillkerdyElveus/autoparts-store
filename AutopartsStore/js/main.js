// Import utility functions for fetching data and managing the cart
import { initLeafletMap } from './modules/map.js';
import { initCart, renderCart } from './modules/shoppingCart.js';
import { fetchProducts, setupSort } from "./modules/listing.js";
import { setupFormValidation } from "./modules/formValidation.js";
import { setupSearch } from "./modules/search.js";
import { loadProductDetails  } from './modules/products.js';
// Arrays to hold the full list of products and the current filtered/sorted view
let products = [];    // Will store all fetched products
let filtered = [];    // Will store products after sorting/filtering

document.addEventListener('DOMContentLoaded', () => {
  console.log("Main.js");
  initApp();
  initCart();// Initialize the "Show Cart" link and renderCart()
  
});

function initApp() {
  console.log("Initializing the Application"); 
  
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
      case "home":
        fetchProducts();
        setupSearch();
      break;
    case "account":
      setupFormValidation();
      break;
    case "cart":
      renderCart();
      break;
       case "detail":
         loadProductDetails();
         break;
      case "search":
        setupSearch();
        break;
  }
}


