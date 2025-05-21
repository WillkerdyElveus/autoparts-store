// modules/reviews.js

// Current page for pagination
let currentPage = 1;
const reviewsPerPage = 5;
let allReviews = [];

export async function fetchReviews() {
    const reviewsContainer = document.getElementById('reviewsContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const apiStatus = document.getElementById('api-status');
    const lastUpdated = document.getElementById('last-updated');
    const reviewStats = document.getElementById('reviewStats');
    
    // API endpoint - Using a mock API for demonstration
    //const API_URL = 'https://api.mocki.io/v2/2a5a6a0a/reviews';

    
    // Show loading spinner
    loadingSpinner.style.display = 'block';
    
    // Fetch data from API
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
            
            allReviews = data;
            calculateReviewStats(allReviews);
            reviewStats.style.display = 'block';
            renderReviews(allReviews, currentPage);
        })
        .catch(error => {
            loadingSpinner.style.display = 'none';
            apiStatus.textContent = 'Offline';
            apiStatus.style.color = 'red';
            showError(`Failed to load reviews: ${error.message}`);
            console.error('Error fetching reviews:', error);
        });
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        reviewsContainer.innerHTML = '';
    }
    
    function calculateReviewStats(reviews) {
        const total = reviews.length;
        document.getElementById('totalReviews').textContent = total;
        
        const ratingCounts = [0, 0, 0, 0, 0];
        let totalStars = 0;
        
        reviews.forEach(review => {
            const rating = Math.floor(review.rating);
            if (rating >= 1 && rating <= 5) {
                ratingCounts[rating - 1]++;
                totalStars += review.rating;
            }
        });
        
        const average = totalStars / total;
        document.getElementById('averageRating').textContent = average.toFixed(1);
        
        const starsContainer = document.getElementById('ratingStars');
        starsContainer.innerHTML = '';
        
        const fullStars = Math.floor(average);
        const hasHalfStar = average % 1 >= 0.5;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsContainer.innerHTML += '<i class="fas fa-star"></i>';
            } else if (i === fullStars && hasHalfStar) {
                starsContainer.innerHTML += '<i class="fas fa-star-half-alt"></i>';
            } else {
                starsContainer.innerHTML += '<i class="far fa-star"></i>';
            }
        }
        
        document.getElementById('fiveStarCount').textContent = ratingCounts[4];
        document.getElementById('fourStarCount').textContent = ratingCounts[3];
        document.getElementById('threeStarCount').textContent = ratingCounts[2];
        document.getElementById('twoStarCount').textContent = ratingCounts[1];
        document.getElementById('oneStarCount').textContent = ratingCounts[0];
        
        document.getElementById('fiveStarBar').style.width = `${(ratingCounts[4] / total) * 100}%`;
        document.getElementById('fourStarBar').style.width = `${(ratingCounts[3] / total) * 100}%`;
        document.getElementById('threeStarBar').style.width = `${(ratingCounts[2] / total) * 100}%`;
        document.getElementById('twoStarBar').style.width = `${(ratingCounts[1] / total) * 100}%`;
        document.getElementById('oneStarBar').style.width = `${(ratingCounts[0] / total) * 100}%`;
    }
    
    function renderReviews(reviews, page) {
        const reviewsContainer = document.getElementById('reviewsContainer');
        reviewsContainer.innerHTML = '';
        
        if (!reviews || reviews.length === 0) {
            reviewsContainer.innerHTML = '<div class="no-reviews"><i class="far fa-comment-dots fa-3x mb-3"></i><p>No reviews found matching your criteria.</p></div>';
            document.getElementById('pagination').innerHTML = '';
            return;
        }
        
        const totalPages = Math.ceil(reviews.length / reviewsPerPage);
        const startIndex = (page - 1) * reviewsPerPage;
        const endIndex = Math.min(startIndex + reviewsPerPage, reviews.length);
        const paginatedReviews = reviews.slice(startIndex, endIndex);
        
        paginatedReviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            
            const reviewDate = new Date(review.date);
            const formattedDate = reviewDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
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
        
        renderPagination(totalPages, page);
    }
    
    function renderPagination(totalPages, currentPage) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';
        
        if (totalPages <= 1) return;
        
        pagination.innerHTML += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
            </li>
        `;
        
        for (let i = 1; i <= totalPages; i++) {
            pagination.innerHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        pagination.innerHTML += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
            </li>
        `;
        
        document.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = parseInt(this.getAttribute('data-page'));
                if (page !== currentPage) {
                    currentPage = page;
                    applyFilters();
                }
            });
        });
    }
}

export function setupReviewFilters() {
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
        
        const searchText = searchInput.value.toLowerCase();
        if (searchText) {
            filteredReviews = filteredReviews.filter(review => 
                (review.comment && review.comment.toLowerCase().includes(searchText)) ||
                (review.userName && review.userName.toLowerCase().includes(searchText)) ||
                (review.productName && review.productName.toLowerCase().includes(searchText))
            );
        }
        
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
        
        setTimeout(() => {
            calculateReviewStats(filteredReviews);
            renderReviews(filteredReviews, 1);
            currentPage = 1;
            loadingSpinner.style.display = 'none';
        }, 300);
    }
    
    ratingFilter.addEventListener('change', applyFilters);
    dateFilter.addEventListener('change', applyFilters);
    searchButton.addEventListener('click', applyFilters);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
}