import { fetchData } from './fetchWrapper.js';
import { renderProducts } from './main.js'; // Adjust if renderProducts is moved

// Arrays to hold all products and the current filtered list
export let products = [];
export let filtered = [];

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

// Setup sorting behavior
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
