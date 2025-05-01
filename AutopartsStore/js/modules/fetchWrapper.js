//A modul for implementing an HTTP client using ajax and Fetch API
export async function fetchData(resourceUri) {
    try {
        // 1) Intiate the HTTP request message
        const response = await fetch(resourceUri);
        // 2) Validate the response
        if (!response.ok) {
            //request failed
            throw new Error(`The request was no Bueno! ${response.status}`);
        }
        // retrieve the received payload from the response message.
        const data = await response.json();
        console.log(data);
        // 4) Parse and render the HTML table
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * Render a given list of products into the .product-list container.
 * Clears existing content, then creates a card for each product with an "Add To Cart" button.
 */
export function renderProducts(list) {
    const container = document.querySelector('.product-list');
    container.innerHTML = '';       // Remove old cards
  
    list.forEach(p => {
      // Create card element and set its class
      const card = document.createElement('div');
      card.className = 'product-card';
  
      // Populate card inner HTML with product image, title, price, description, and button
      card.innerHTML = `
        <img src="${p.image}" alt="${p.title}">
        <h5>${p.title}</h5>
        <h6>$${p.price.toFixed(2)}</h6>
        <p class="text-muted">${p.description.slice(0, 60)}…</p>
        <button class="btn btn-primary">Add To Cart</button>
      `;
  
      // Add click listener to call addToCart() when the button is clicked
      card.querySelector('button')
          .addEventListener('click', () => addToCart(p));
  
      // Append the new card to the container
      container.appendChild(card);
    });
  }
  
