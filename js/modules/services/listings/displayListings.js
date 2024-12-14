import { apiRequest } from '../../../utils/api.js';

let listings = [];
let currentPage = 1;
const itemsPerPage = 21;
let countdownInterval;

export async function fetchListings({
  sortOption = 'newest',
  searchTerm = '',
  isAuctionEndedFiltered = false,
} = {}) {
  try {
    const response = await apiRequest('auction/listings?_bids=true', 'GET');
    listings = response.data;

    if (searchTerm) {
      listings = listings.filter((listing) =>
        listing.title.toLowerCase().includes(searchTerm)
      );
    }

    if (isAuctionEndedFiltered) {
      listings = listings.filter(
        (listing) => calculateTimeRemaining(listing.endsAt) !== 'Auction ended'
      );
    }

    if (sortOption) {
      sortListings(sortOption);
    }

    displayListings(currentPage);
    setupPagination();
    startLiveCountdown();
  } catch (error) {
    console.error('Failed to fetch listings:', error.message || error);
    alert('Failed to load listings. Please try again later.');
  }
}

function displayListings(page) {
  const listingsContainer = document.querySelector('#listings');
  listingsContainer.innerHTML = '';

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedListings = listings.slice(startIndex, startIndex + itemsPerPage);

  if (paginatedListings.length === 0) {
    listingsContainer.innerHTML = '<p class="no-listings">No available listings</p>';
    return;
  }

  paginatedListings.forEach((listing) => {
    const highestBid = listing.bids.length > 0
      ? Math.max(...listing.bids.map((bid) => bid.amount))
      : 'No bids yet';

    const listingCard = `
      <div class="col-md-4">
        <div class="card mb-3 shadow-sm">
          <img src="${listing.media[0]?.url || 'https://via.placeholder.com/150'}" class="card-img-top" alt="Listing Image">
          <div class="card-body">
            <h5 class="card-title">${truncateText(listing.title, 15)}</h5>
            <p><strong>Highest Bid:</strong> ${highestBid} Credits</p>
            <p><strong>Time Remaining:</strong> <span class="time-remaining" data-end="${listing.endsAt}"></span></p>
            <a href="../details/index.html?id=${listing.id}" class="btn btn-info">View Details</a>
            <button class="btn btn-success placeBidBtn" data-id="${listing.id}" data-highest="${highestBid}">
              Place Bid
            </button>
          </div>
        </div>
      </div>
    `;
    listingsContainer.innerHTML += listingCard;
  });

  attachBidListeners();
}

function attachBidListeners() {
  document.querySelectorAll('.placeBidBtn').forEach((button) => {
    button.addEventListener('click', async () => {
      const listingId = button.getAttribute('data-id');
      const currentHighestBid = parseFloat(button.getAttribute('data-highest')) || 0;
      const token = localStorage.getItem('token');

      if (!token) {
        alert('You must be logged in to place a bid.');
        window.location.href = '../../pages/login/index.html';
        return;
      }

      const bidAmount = parseFloat(
        prompt(`Enter your bid amount (must be higher than ${currentHighestBid} Credits):`)
      );

      if (!bidAmount || isNaN(bidAmount) || bidAmount <= currentHighestBid) {
        alert(`Please enter a valid bid amount higher than ${currentHighestBid}.`);
        return;
      }

      await placeBid(listingId, bidAmount, token);
    });
  });
}

async function placeBid(listingId, amount, token) {
  try {
    await apiRequest(`auction/listings/${listingId}/bids`, 'POST', { amount }, token);
    alert('Bid placed successfully!');
    fetchListings();
  } catch (error) {
    console.error('Failed to place bid:', error.message || error);
    alert(`Failed to place bid: ${error.message}`);
  }
}

function setupPagination() {
  const paginationContainer = document.querySelector('#pagination');
  const totalPages = Math.ceil(listings.length / itemsPerPage);

  paginationContainer.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.innerText = i;
    pageButton.classList.add('btn', 'page-button');
    
    if (i === currentPage) {
      pageButton.classList.add('active-page');
    }

    pageButton.addEventListener('click', () => {
      currentPage = i;
      displayListings(currentPage);
      setupPagination();
    });

    paginationContainer.appendChild(pageButton);
  }
}


function sortListings(option) {
  switch (option) {
    case 'newest':
      listings.sort((a, b) => new Date(b.created) - new Date(a.created));
      break;
    case 'oldest':
      listings.sort((a, b) => new Date(a.created) - new Date(b.created));
      break;
    case 'highestBid':
      listings.sort(
        (a, b) =>
          Math.max(...b.bids.map((bid) => bid.amount || 0)) -
          Math.max(...a.bids.map((bid) => bid.amount || 0))
      );
      break;
    case 'lowestBid':
      listings.sort(
        (a, b) =>
          Math.max(...a.bids.map((bid) => bid.amount || 0)) -
          Math.max(...b.bids.map((bid) => bid.amount || 0))
      );
      break;
  }
}

function startLiveCountdown() {
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    const timeDisplays = document.querySelectorAll('.time-remaining');

    timeDisplays.forEach((timeDisplay) => {
      const endTime = timeDisplay.getAttribute('data-end');
      timeDisplay.innerText = calculateTimeRemaining(endTime);
    });
  }, 1000);
}

function calculateTimeRemaining(endTime) {
  const end = new Date(endTime).getTime();
  const now = new Date().getTime();
  const diff = end - now;

  if (diff <= 0) return 'Auction ended';

  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
}

function truncateText(text, maxLength) {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

document.addEventListener('DOMContentLoaded', fetchListings);
