import { fetchData } from './fetchWrapper.js';

export async function loadProductDetails() {
  let products = [];  // Initialize products array to store fetched data
  products = await fetchData('data/inventory.json'); // Fetch product data from JSON file 
  console.log("Products loaded:", products); // Log the loaded products for debugging
  
  console.log("Loading product details...");
  
  const productId = sessionStorage.getItem('selectedProduct');
  if (!productId) {
    window.location.href = 'product-listing.html';
    return;
  }
  try {
    if (products.length === 0) {
      products = await fetchData('data/inventory.json');
    }
    const product = products.find(p => p.id == productId);
    if (!product) throw new Error('Product not found');
    
    document.querySelector('.product-title').textContent = product.title;
    document.querySelector('.product-price').textContent = `$${product.price.toFixed(2)}`;
    document.querySelector('.product-description').textContent = product.description;
    
    const imageContainer = document.querySelector('.product-images');
    imageContainer.innerHTML = product.images.map((img, i) => `
      <div class="carousel-item ${i === 0 ? 'active' : ''}">
        <img src="${img}" class="d-block w-100" alt="${product.title}">
      </div>
    `).join('');
    
    document.querySelector('.add-to-cart').dataset.productId = product.id;
  } catch (error) {
    console.error('Error loading product details:', error);
    document.querySelector('.product-container').innerHTML = `
      <div class="alert alert-danger">
        Product not found. <a href="products.html">Back to products</a>
      </div>
    `;
  }
}

export function getProductById(id) {
  return products.find(product => product.id == id);
}