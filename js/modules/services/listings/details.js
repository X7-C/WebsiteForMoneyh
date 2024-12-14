import { apiRequest } from '../../../utils/api.js';

let currentHighestBid = 0;
let listingId = '';
let countdownInterval;

async function fetchDetails() {
  const params = new URLSearchParams(window.location.search);
  listingId = params.get('id');

  if (!listingId) {
    alert('Invalid listing ID.');
    window.location.href = '../listings/index.html';
    return;
  }

  try {
    const response = await apiRequest(`auction/listings/${listingId}?_bids=true`, 'GET');
    const listing = response.data;

    document.querySelector('#listingTitle').innerText = listing.title;
    document.querySelector('#listingDescription').innerText = listing.description;

    const imageElement = document.querySelector('#listingImage');
    imageElement.src = listing.media[0]?.url || 'https://via.placeholder.com/800x400';
    imageElement.alt = listing.title || 'Listing Image';

    currentHighestBid = listing.bids.length > 0 
      ? Math.max(...listing.bids.map((bid) => bid.amount)) 
      : 0;

    document.querySelector('#highestBid').innerText = `${currentHighestBid} Credits`;

    displayBidders(listing.bids);

    startLiveCountdown(listing.endsAt);
  } catch (error) {
    console.error('Failed to load listing details:', error.message || error);
    alert('Failed to load listing details. Please try again later.');
  }
}

function displayBidders(bids) {
  const biddersList = document.querySelector('#biddersList');
  biddersList.innerHTML = bids.length > 0 
    ? bids
        .sort((a, b) => b.amount - a.amount)
        .map((bid) => `<li><strong>${bid.bidder.name}</strong>: ${bid.amount} Credits</li>`)
        .join('') 
    : '<li>No bids yet</li>';
}

function startLiveCountdown(endTime) {
  const timeDisplay = document.querySelector('#timeRemaining');

  function updateCountdown() {
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) {
      clearInterval(countdownInterval);
      timeDisplay.innerText = 'Auction ended';
      return;
    }

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    timeDisplay.innerText = `${hours}h ${minutes}m ${seconds}s`;
  }

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

async function handleBid() {
  const token = localStorage.getItem('token');
  if (!token) {
    showLoginPopup();
    return;
  }

  const bidAmount = parseFloat(
    prompt(`Enter your bid amount (must be higher than ${currentHighestBid} Credits):`)
  );

  if (!bidAmount || isNaN(bidAmount) || bidAmount <= currentHighestBid) {
    alert(`Please enter a valid bid amount higher than ${currentHighestBid}.`);
    return;
  }

  try {
    await apiRequest(`auction/listings/${listingId}/bids`, 'POST', { amount: bidAmount }, token);
    alert('Bid placed successfully!');
    fetchDetails();
  } catch (error) {
    console.error('Failed to place bid:', error.message || error);
    alert(`Failed to place bid: ${error.message}`);
  }
}

function showLoginPopup() {
  if (document.querySelector("#loginPopup")) return;

  const popupContainer = document.createElement("div");
  popupContainer.id = "loginPopup";
  popupContainer.classList.add("popup-overlay");
  popupContainer.innerHTML = `
    <div class="popup-content">
      <h2 class="popup-title">Login Required</h2>
      <p>You must be logged in to place a bid.</p>
      <a href="../../pages/login/index.html" class="btn btn-primary">Go to Login</a>
      <button id="closePopup" class="btn btn-secondary mt-3">Close</button>
    </div>
  `;

  document.body.appendChild(popupContainer);
  document.querySelector("#closePopup").addEventListener("click", () => {
    popupContainer.remove();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchDetails();
  document.querySelector('#placeBidButton').addEventListener('click', handleBid);
});
