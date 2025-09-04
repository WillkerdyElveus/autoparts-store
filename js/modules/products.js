import { fetchData } from './fetchWrapper.js';
import { addToCart } from './shoppingCart.js';

//Loads and displays detailed information for a specific product
//Retrieves product ID from sessionStorage and fetches matching product data
export async function loadProductDetails() {
  let products = [];  // Initialize products array to store fetched data
  products = await fetchData('data/inventory.json'); // Fetch product data from JSON file 
  console.log("Products loaded:", products); // Log the loaded products for debugging
  
  console.log("Loading product details...");
  
  // Get product ID from session storage
  const productId = sessionStorage.getItem('selectedProduct');
  if (!productId) {
    // Redirect if no product selected
    window.location.href = 'product-listing.html';
    return;
  }
  try {
    // Reload products if initial fetch was empty
    if (products.length === 0) {
      products = await fetchData('data/inventory.json');
    }
     // Find the specific product by ID
    const product = products.find(p => p.id == productId);
    if (!product) throw new Error('Product not found');
    
     // Update DOM with product details
    document.querySelector('.product-title').textContent = product.title;
    document.querySelector('.product-price').textContent = `$${product.price.toFixed(2)}`;
    document.querySelector('.product-description').textContent = product.description;
    
    //Dynamic breadCrumb
    const bc = document.getElementById('breadcrumb');
    bc.innerHTML = `
  <li class="breadcrumb-item">
    <a href="index.html">Home</a>
  </li>
  <li class="breadcrumb-item">
    <a href="product-listing.html">All Products</a>
  </li>
  <li class="breadcrumb-item active" aria-current="page">
    ${product.title}
  </li>
`;
// Handle product images
    const imageContainer = document.querySelector('.product-images');
    const pics = Array.isArray(product.iamges) ? product.images : [ product.image];
    imageContainer.innerHTML = pics.map((src, i) => `
      <div class="carousel-item ${i === 0 ? 'active' : ''}">
        <img src="${src}" class="d-block w-100" alt="${product.title}">
      </div>
    `).join('');
    // Set up add-to-cart button
    const addbtn = document.querySelector('.add-to-cart');
    addbtn.dataset.productId = product.id;

    addbtn.addEventListener('click', () =>{
      addToCart(product)
    });

  } catch (error) {
    console.error('Error loading product details:', error);
    document.querySelector('.product-container').innerHTML = `
      <div class="alert alert-danger">
        Product not found. <a href="Product-Listing.html">Back to products</a>
      </div>
    `;
  }
}
//Helper function to find a product by ID
export function getProductById(id) {
  return products.find(product => product.id == id);
}