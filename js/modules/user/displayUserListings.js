import { apiRequest } from '../../utils/api.js';

async function fetchUserListings() {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  if (!username || !token) {
    alert('You must be logged in to access this page.');
    window.location.href = '../../pages/auth/login.html';
    return;
  }

  try {
    const response = await apiRequest(`auction/profiles/${username}?_listings=true`, 'GET', null, token);
    const listings = response.data.listings || [];

    const listingsContainer = document.getElementById('userListings');
    listingsContainer.innerHTML = ''; 

    if (listings.length === 0) {
      listingsContainer.innerHTML = '<p class="text-center">No listings found.</p>';
      return;
    }

    listings.forEach((listing) => {
      const listingCard = `
        <div class="col">
          <div class="card shadow-sm h-100">
            <img src="${listing.media[0]?.url || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${listing.title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${listing.title}</h5>
              <p class="card-text text-truncate">${listing.description}</p>
              <p class="text-muted">Ends At: ${new Date(listing.endsAt).toLocaleString()}</p>
              <p class="fw-bold">Bids: ${listing._count?.bids || 0}</p>
              <a href="../listings/details.html?id=${listing.id}" class="btn btn-primary mt-auto">View Details</a>
            </div>
          </div>
        </div>
      `;
      listingsContainer.innerHTML += listingCard;
    });
  } catch (error) {
    console.error('Failed to fetch user listings:', error.message || error);
    alert('Failed to load user listings. Please try again later.');
  }
}

document.addEventListener('DOMContentLoaded', fetchUserListings);
