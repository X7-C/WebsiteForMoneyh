import { apiRequest } from '../../utils/api.js';

let listings = [];

async function fetchListings() {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('You must be logged in to view this page.');
    window.location.href = '../../pages/auth/login.html';
    return;
  }

  try {
    const response = await apiRequest('auction/listings?_bids=true', 'GET', null, token);
    listings = response.data;
    displayListings(listings);
  } catch (error) {
    console.error('Failed to fetch listings:', error.message || error);
    alert('Failed to load listings. Please try again later.');
  }
}

function displayListings(data) {
  const listingsContainer = document.querySelector('#listings');
  listingsContainer.innerHTML = '';

  data.forEach((listing) => {
    const highestBid = listing.bids.length > 0
      ? Math.max(...listing.bids.map((bid) => bid.amount))
      : 'No bids yet';

    const userBid = listing.bids.find((bid) => bid.bidder?.name === localStorage.getItem('username'));
    const userBidAmount = userBid ? `${userBid.amount} Credits` : 'No bids placed';

    const timeRemaining = calculateTimeRemaining(listing.endsAt);

    const listingCard = `
      <div class="col-md-4">
        <div class="card mb-3">
          <img src="${listing.media[0]?.url || 'https://via.placeholder.com/150'}" class="card-img-top" alt="Listing Image">
          <div class="card-body">
            <h5 class="card-title">${listing.title}</h5>
            <p class="card-text">${listing.description}</p>
            <p><strong>Current Highest Bid:</strong> ${highestBid} Credits</p>
            <p><strong>Your Bid:</strong> ${userBidAmount}</p>
            <p><strong>Time Remaining:</strong> ${timeRemaining}</p>
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

      const bidAmount = parseFloat(prompt(`Enter your bid amount (must be higher than ${currentHighestBid} Credits):`));

      if (!bidAmount || isNaN(bidAmount) || bidAmount <= currentHighestBid) {
        alert(`Please enter a valid bid amount higher than ${currentHighestBid}.`);
        return;
      }

      await placeBid(listingId, bidAmount);
    });
  });
}

async function placeBid(listingId, amount) {
  const token = localStorage.getItem('token');

  try {
    await apiRequest(`auction/listings/${listingId}/bids`, 'POST', { amount }, token);
    alert('Bid placed successfully!');
    fetchListings();
  } catch (error) {
    console.error('Failed to place bid:', error.message || error);
    alert(`Failed to place bid: ${error.message}`);
  }
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

function handleSortChange(event) {
  const sortOption = event.target.value;

  let sortedListings = [...listings];

  switch (sortOption) {
    case 'newest':
      sortedListings.sort((a, b) => new Date(b.created) - new Date(a.created));
      break;
    case 'oldest':
      sortedListings.sort((a, b) => new Date(a.created) - new Date(b.created));
      break;
    case 'highestBid':
      sortedListings.sort((a, b) =>
        Math.max(...b.bids.map((bid) => bid.amount || 0)) -
        Math.max(...a.bids.map((bid) => bid.amount || 0))
      );
      break;
    case 'lowestBid':
      sortedListings.sort((a, b) =>
        Math.max(...a.bids.map((bid) => bid.amount || 0)) -
        Math.max(...b.bids.map((bid) => bid.amount || 0))
      );
      break;
  }

  displayListings(sortedListings);
}

document.addEventListener('DOMContentLoaded', fetchListings);
document.querySelector('#sortFilter').addEventListener('change', handleSortChange);
