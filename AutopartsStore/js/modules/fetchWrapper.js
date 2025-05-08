import { addToCart } from "./shoppingCart.js";

export async function fetchData(resourceUri) {
  try {
    const response = await fetch(resourceUri);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    // Fallback to local data if available
    if (resourceUri.includes("places.json")) {
      return await import("../data/places.json");
    }
    throw error; // Re-throw to let calling code handle it
  }
}

/**
 * Render a given list of products into the .product-list container.
 * Clears existing content, then creates a card for each product with an "Add To Cart" button.
 */
export function renderProducts(list) {
  const container = document.querySelector(".product-list");
  container.innerHTML = ""; // Remove old cards

  list.forEach((p) => {
    // Create card element and set its class
    const card = document.createElement("div");
    card.className = "product-card";

    // Populate card inner HTML with product image, title, price, description, and button
    card.innerHTML = `
      <a href="detail.html" class="product-link"><img src="${p.image}" alt="${
      p.title
    }"></a>
        <h5>${p.title}</h5>
        <h6>$${p.price.toFixed(2)}</h6>
        <p class="text-muted">${p.description.slice(0, 60)}…</p>
        <button class="btn btn-primary">Add To Cart</button>
      `;

    // Add click listener to call addToCart() when the button is clicked
    card.querySelector("button").addEventListener("click", () => addToCart(p));

    //Save the product ID to session storage when the card is clicked
    const link = card.querySelector(".product-link");
    link.addEventListener("click", (e) => {
      sessionStorage.setItem("selectedProduct", p.id);
    });

    // Append the new card to the container
    container.appendChild(card);
  });

  //JSon array so that it can save it ot a local storage so that when we can parse it into the shopping cart
}
