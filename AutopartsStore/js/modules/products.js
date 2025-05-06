import { addToCart } from './shoppingCart.js';
import { fetchData } from './fetchWrapper.js';

let products = [];

export async function loadProducts(containerSelector, limit = null) {
  try {
    products = await fetchData('data/inventory.json');
    
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    let productsToShow = products;
    if (limit) {
      productsToShow = products.slice(0, limit);
    }
    
    container.innerHTML = productsToShow.map(product => `
      <div class="product-card col-md-4 mb-4">
        <div class="card h-100">
          <img src="${product.image}" class="card-img-top" alt="${product.title}">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description.substring(0, 60)}...</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="price">$${product.price.toFixed(2)}</span>
              <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
    
    // Store products in session for search
    sessionStorage.setItem('products', JSON.stringify(products));
  } catch (error) {
    console.error('Error loading products:', error);
    document.querySelector(containerSelector).innerHTML = `
      <div class="alert alert-danger">
        Failed to load products. Please try again later.
      </div>
    `;
  }
}

export async function loadProductDetails() {
  const productId = sessionStorage.getItem('selectedProduct');
  if (!productId) {
    window.location.href = 'products.html';
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