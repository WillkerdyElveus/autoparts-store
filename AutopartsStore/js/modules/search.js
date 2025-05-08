import {filtered} from './listing.js';
import {renderProducts} from './fetchWrapper.js';

export function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    if (!searchInput) return;

    // Function to perform the search
    const performSearch = () => {
        const term = searchInput.value.trim().toLowerCase();
        
        if (term === '') {
            // If search is empty, show all products
            renderProducts(filtered);
            return;
        }

        // Filter products based on search term
        const results = filtered.filter(product => {
            // Check title, description, and category (if available)
            return (
                product.title.toLowerCase().includes(term) ||
                product.description.toLowerCase().includes(term) ||
                (product.category && product.category.toLowerCase().includes(term))
            );
        });

        renderProducts(results);
    };

    // Event listener for input field (live search as you type)
    searchInput.addEventListener('input', performSearch);

    // Event listener for search button
    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission if inside a form
            performSearch();
            
            
            searchInput.focus();
        });
    }
  }