// modules/reviews.js

// Current page for pagination
let currentPage = 1;
const reviewsPerPage = 5;
let allReviews = [];

// fethced reviews from API
export async function fetchReviews() {
    // Get DOM elements
    const reviewsContainer = document.getElementById('reviewsContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const apiStatus = document.getElementById('api-status');
    const lastUpdated = document.getElementById('last-updated');
    const reviewStats = document.getElementById('reviewStats');
    
    const API_URL = 'https://api.restful-api.dev/objects';

    
    // Show loading spinner
    loadingSpinner.style.display = 'block';
    
    // Fetch data from API with error handling
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            loadingSpinner.style.display = 'none';
            apiStatus.textContent = 'Online';
            apiStatus.style.color = 'green';
            
            const now = new Date();
            lastUpdated.textContent = now.toLocaleString();
            
            if (!data || data.length === 0) {
                showError('No reviews available at this time.');
                return;
            }
            
            // Store and process reviews
            allReviews = data;
            calculateReviewStats(allReviews);
            reviewStats.style.display = 'block';
            renderReviews(allReviews, currentPage);
        })
        .catch(error => {
            // Handle API errors
            loadingSpinner.style.display = 'none';
            apiStatus.textContent = 'Offline';
            apiStatus.style.color = 'red';
            showError(`Failed to load reviews: ${error.message}`);
            console.error('Error fetching reviews:', error);
        });
    
        // Shows error message and clears reviews
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        reviewsContainer.innerHTML = '';
    }
    
    // Calculates review statistics (average, star distribution)
    function calculateReviewStats(reviews) {
        const total = reviews.length;
        document.getElementById('totalReviews').textContent = total;
        
        // Initialize rating counters
        const ratingCounts = [0, 0, 0, 0, 0];
        let totalStars = 0;
        
        // Count each star rating
        reviews.forEach(review => {
            const rating = Math.floor(review.rating);
            if (rating >= 1 && rating <= 5) {
                ratingCounts[rating - 1]++;
                totalStars += review.rating;
            }
        });
        
        // Calculate and display average
        const average = totalStars / total;
        document.getElementById('averageRating').textContent = average.toFixed(1);
        
        // Render star visualization
        const starsContainer = document.getElementById('ratingStars');
        starsContainer.innerHTML = '';
        
        const fullStars = Math.floor(average);
        const hasHalfStar = average % 1 >= 0.5;
        
        // Create star icons
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsContainer.innerHTML += '<i class="fas fa-star"></i>';
            } else if (i === fullStars && hasHalfStar) {
                starsContainer.innerHTML += '<i class="fas fa-star-half-alt"></i>';
            } else {
                starsContainer.innerHTML += '<i class="far fa-star"></i>';
            }
        }
        
        // Update star count displays
        document.getElementById('fiveStarCount').textContent = ratingCounts[4];
        document.getElementById('fourStarCount').textContent = ratingCounts[3];
        document.getElementById('threeStarCount').textContent = ratingCounts[2];
        document.getElementById('twoStarCount').textContent = ratingCounts[1];
        document.getElementById('oneStarCount').textContent = ratingCounts[0];
        
        // Update rating bar widths
        document.getElementById('fiveStarBar').style.width = `${(ratingCounts[4] / total) * 100}%`;
        document.getElementById('fourStarBar').style.width = `${(ratingCounts[3] / total) * 100}%`;
        document.getElementById('threeStarBar').style.width = `${(ratingCounts[2] / total) * 100}%`;
        document.getElementById('twoStarBar').style.width = `${(ratingCounts[1] / total) * 100}%`;
        document.getElementById('oneStarBar').style.width = `${(ratingCounts[0] / total) * 100}%`;
    }
    
    // Renders reviews with pagination
    function renderReviews(reviews, page) {
        const reviewsContainer = document.getElementById('reviewsContainer');
        reviewsContainer.innerHTML = '';
        
        // Handle empty state
        if (!reviews || reviews.length === 0) {
            reviewsContainer.innerHTML = '<div class="no-reviews"><i class="far fa-comment-dots fa-3x mb-3"></i><p>No reviews found matching your criteria.</p></div>';
            document.getElementById('pagination').innerHTML = '';
            return;
        }
        
        // Pagination
        const totalPages = Math.ceil(reviews.length / reviewsPerPage);
        const startIndex = (page - 1) * reviewsPerPage;
        const endIndex = Math.min(startIndex + reviewsPerPage, reviews.length);
        const paginatedReviews = reviews.slice(startIndex, endIndex);
        
        // Create review cards
        paginatedReviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            
            // review date
            const reviewDate = new Date(review.date);
            const formattedDate = reviewDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Create star rating display
            let starsHtml = '';
            const fullStars = Math.floor(review.rating);
            const hasHalfStar = review.rating % 1 >= 0.5;
            
            for (let i = 0; i < 5; i++) {
                if (i < fullStars) {
                    starsHtml += '<i class="fas fa-star"></i>';
                } else if (i === fullStars && hasHalfStar) {
                    starsHtml += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    starsHtml += '<i class="far fa-star"></i>';
                }
            }
            
            // Build review card with HTML
            reviewCard.innerHTML = `
                <div class="review-header">
                    <div class="review-user">
                        <div class="user-avatar">
                            ${review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div class="review-meta">
                            <div class="review-author">${review.userName || 'Anonymous'}</div>
                            <div class="review-date">${formattedDate}</div>
                        </div>
                    </div>
                    <div class="review-rating" title="${review.rating} out of 5 stars">
                        ${starsHtml}
                    </div>
                </div>
                <div class="review-content">
                    <p>${review.comment || 'No comment provided.'}</p>
                </div>
                ${review.productId ? `
                <div class="review-product">
                    Review for: <a href="product.html?id=${review.productId}" class="product-link">
                        ${review.productName || 'Product #' + review.productId}
                    </a>
                </div>
                ` : ''}
            `;
            
            reviewsContainer.appendChild(reviewCard);
        });
        
    }
}

// Sets up review filtering functionality
export function setupReviewFilters() {
    // Get filter elements
    const ratingFilter = document.getElementById('rating-filter');
    const dateFilter = document.getElementById('date-filter');
    const searchInput = document.getElementById('search-reviews');
    const searchButton = document.getElementById('search-button');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    function applyFilters() {
        loadingSpinner.style.display = 'block';
        
        let filteredReviews = [...allReviews];
        if (ratingFilter.value !== '0') {
            const minRating = parseInt(ratingFilter.value);
            filteredReviews = filteredReviews.filter(review => 
                Math.floor(review.rating) === minRating
            );
        }
        
        // Search filter
        const searchText = searchInput.value.toLowerCase();
        if (searchText) {
            filteredReviews = filteredReviews.filter(review => 
                (review.comment && review.comment.toLowerCase().includes(searchText)) ||
                (review.userName && review.userName.toLowerCase().includes(searchText)) ||
                (review.productName && review.productName.toLowerCase().includes(searchText))
            );
        }
        
        // Sort filter
        switch(dateFilter.value) {
            case 'newest':
                filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                filteredReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'highest':
                filteredReviews.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                filteredReviews.sort((a, b) => a.rating - b.rating);
                break;
        }
        
        // Apply changes with slight delay for smoothness
        setTimeout(() => {
            calculateReviewStats(filteredReviews);
            renderReviews(filteredReviews, 1);
            currentPage = 1;
            loadingSpinner.style.display = 'none';
        }, 300);
    }
    
    // Event listeners for filters
    ratingFilter.addEventListener('change', applyFilters);
    dateFilter.addEventListener('change', applyFilters);
    searchButton.addEventListener('click', applyFilters);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
}