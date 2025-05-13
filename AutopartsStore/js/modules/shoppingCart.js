
// Cart state in localStorage
const STORAGE_KEY = 'myStoreCart';
// Initialize cart from localStorage (if it exists) or start with an empty array
let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

//Helpers to save / load
// Serialize the cart array back into localStorage under the same key
function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

// If other modules need direct access to the raw cart array
export function getCartItems() {
  return cart;
}

//Add to Cart
export function addToCart(product) {
  // Spread the product properties into a new object and add a default quantity of 1
  cart.push({ ...product, quantity: 1 });
  // Persist the updated cart
  saveCart();
  // Log the updated cart for debugging
  console.log('Current Cart:', cart);
  // Give feedback
  const msgEl = document.getElementById('cartFeedbackMessage');
  msgEl.textContent = `Added "${product.title}" to cart!`;
  // Show feedback modal
  const cartModal = new bootstrap.Modal(document.getElementById('cartFeedbackModal'));
  cartModal.show();
}

//Render the cart UI
// Finds a container with class cart-items and fills it with the current cart contents
export function renderCart() {
  const container = document.querySelector('.cart-items');
  if (!container) {
    console.warn('No Cart items container found on this page.');
    return;
  }

  // Clear out any previous content
  container.innerHTML = '';

  // If there are no items, show a message
  if (cart.length === 0) {
    container.innerHTML = `<p>Your cart is empty.</p>`;
    return;
  }

  // For each item in the cart, build a small UI block
  cart.forEach((item, idx) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';

    // Use a template literal to insert item data into the DOM
    itemDiv.innerHTML = `
      <div class="item-image">
        <img src="${item.image}" alt="${item.title}" width="80">
      </div>
      <div class="item-details">
        <h4>${item.title}</h4>
        <p>$${item.price.toFixed(2)}</p>
      </div>
      <div class="item-actions">
        <input
          type="number"
          class="item-qty"
          data-index="${idx}"
          value="${item.quantity}"
          min="1"
        >
        <button class="remove-btn" data-index="${idx}">Remove</button>
      </div>
    `;
    container.appendChild(itemDiv);
  });

  // Attach event listeners to creat "Remove" buttons when necessary
  container.querySelectorAll('.remove-btn').forEach(btn =>
    btn.addEventListener('click', e => {
      const i = +e.currentTarget.dataset.index;
      // Remove the clicked item from the cart array
      cart.splice(i, 1);
      saveCart();
      renderCart(); // re-render to reflect the change
    })
  );

  // Attach event listeners to quantity inputs
  container.querySelectorAll('.item-qty').forEach(input =>
    input.addEventListener('change', e => {
      const i = +e.currentTarget.dataset.index;
      // Update the quantity in the cart array
      cart[i].quantity = +e.currentTarget.value;
      saveCart();
      renderCart(); // re-render to update totals
    })
  );
}

//Integrate “Show Cart” link
export function initCart() {
  // Wait until the DOM has loaded
  document.addEventListener('DOMContentLoaded', () => {
    const link = document.getElementById('link-show-cart');
    if (!link) return;
    link.addEventListener('click', e => {
      e.preventDefault();      // stop the default link navigation
      renderCart();            // add items into the .cart-items container
      // Smooth scroll to the cart section if it exists
      document.querySelector('.cart-items')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}
