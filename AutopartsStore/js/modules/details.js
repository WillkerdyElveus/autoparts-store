import { fetchData } from "./fetchWrapper.js";
import { addToCart } from "./shoppingCart.js";

export async function loadProducts() {
    // Get product id from the storage 
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if(!id) return document.getElementById('productDetail').innerHTML = '<p> No Product was specified</p>';
    
    try {
        // fetch product 
        const product = await fetchData(`https://fakestoreapi.com/products/${id}`);

    const container = document.getElementById('productDetail');
    container.innerHTML = `
      <div class="col-md-6">
        <img src="${product.image}" class="img-fluid" alt="${product.title}">
      </div>
      <div class="col-md-6">
        <h2>${product.title}</h2>
        <p class="lead">$${product.price.toFixed(2)}</p>
        <p>${product.description}</p>
        <button id="btnAddCart" class="btn btn-primary">Add to Cart</button>
      </div>
    `;
    // Add to cart button 
    document.getElementById('btnAddCart')
    .addEventListener('click', () => addToCart(product));
    } catch (error) {
        console.error(error);
        document.getElementById('productDetail').innerHTML = '<p>Error loading product</p>';
    }
}

window.addEventListener('DOMContentLoaded', loadProducts);