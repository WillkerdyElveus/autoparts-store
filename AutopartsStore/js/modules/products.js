import { fetchData } from './fetchWrapper.js';
import { addToCart } from './shoppingCart.js';


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
    const imageContainer = document.querySelector('.product-images');
// verify if there is an image array
    const pics = Array.isArray(product.iamges) ? product.images : [ product.image];
    imageContainer.innerHTML = pics.map((src, i) => `
      <div class="carousel-item ${i === 0 ? 'active' : ''}">
        <img src="${src}" class="d-block w-100" alt="${product.title}">
      </div>
    `).join('');
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

export function getProductById(id) {
  return products.find(product => product.id == id);
}