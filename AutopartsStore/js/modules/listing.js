import { fetchData,renderProducts } from './fetchWrapper.js';

// Arrays to hold all products and the current filtered list
export let products = [];
export let filtered = [];

// TODO: doesnt work fix later so you can add to the main page only the listing app
export async function initListingApp() {
  try {
    console.log("Initializing the Listing Application"); 
    fetchProducts(); // Fetch products and render them
    setupSort(); // Setup sorting functionality
  }catch (error) {
    console.error('Error initializing listing app:', error);
    document.querySelector('.product-list').innerHTML = `
      <div class="alert alert-danger">
        Failed to initialize listing. Please try again later.
      </div>
    `;
  }
}

/**
 * Fetch products from the API and render them.
 * Uses fetchData wrapper to retrieve JSON, handles errors, and populates `products` & `filtered`.
 */
export async function fetchProducts() {
  try {
    // Try remote API first
    products = await fetchData('https://fakestoreapi.com/products');
    
    // Fallback to local data if API fails
    if (!products || products.length === 0) {
      const localData = await fetchData('./data/inventory.json');
      products = localData.Products || [];
    }
    
    filtered = [...products];
    renderProducts(filtered);
  } catch (err) {
    console.error('Error fetching products:', err);
    document.querySelector('.product-list').innerHTML = `
      <div class="alert alert-danger">
        Failed to load products. Please try again later.
      </div>
    `;
  }
}

// Setup sorting
export function setupSort() {
  const sortSelect = document.getElementById('category');

  sortSelect.addEventListener('change', () => {
    const val = sortSelect.value;

    if (val === 'all') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (val === 'exhaust') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (val === 'turbo') {
      filtered.sort((a, b) => b.rating.rate - a.rating.rate);
    }

    renderProducts(filtered);
  });
}

