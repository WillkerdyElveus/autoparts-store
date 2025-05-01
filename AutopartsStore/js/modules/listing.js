export function listingApp(){
    console.log("Initializing the listings...");

}

/**
 * Fetch products from the API and render them.
 * Uses fetchData wrapper to retrieve JSON, handles errors, and populates `products` & `filtered`.
 */

async function fetchProducts() {
    try {
      //TODO: Update this endpoint to your production API when ready
      products = await fetchData('https://fakestoreapi.com/products');
      filtered = [...products];      // Copy into filtered for sorting without modifying original
      renderProducts(filtered);      // Show initial product list
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  }