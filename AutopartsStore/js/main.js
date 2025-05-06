// Import utility functions for fetching data and managing the cart
import { initLeafletMap } from './modules/map.js';
import { initCart, addToCart } from './modules/shoppingCart.js';
import { fetchProducts, setupSort } from "./modules/listing.js";
import { setupFormValidation } from "./modules/formValidation.js";
import { setupSearch } from "./modules/search.js";
import { loadProducts, loadProductDetails  } from './modules/products.js';
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
      // case "detail":
      //   loadProductDetails();
      //   break;
      case "search":
        setupSearch();
        fetchProducts();
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


