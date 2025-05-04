// search.js
export function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    if (!searchInput) return;
  
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const productCards = document.querySelectorAll('.product-card');
      
      productCards.forEach(card => {
        const title = card.querySelector('h5').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        card.style.display = (title.includes(term) || description.includes(term)) 
          ? 'block' 
          : 'none';
      });
    });
  }