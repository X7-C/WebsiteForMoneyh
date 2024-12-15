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
    const response = await apiRequest(`auction/listings/${listingId}?_bids=true&_seller=true`, 'GET');
    const listing = response.data;

    document.querySelector('#listingTitle').innerText = listing.title;
    document.querySelector('#listingDescription').innerText = listing.description;

    const imageElement = document.querySelector('#listingImage');
    imageElement.src = listing.media[0]?.url || 'https://via.placeholder.com/800x400';
    imageElement.alt = listing.title || 'Listing Image';

    const sellerImage = listing.seller?.avatar?.url || 'https://via.placeholder.com/40';
    const sellerName = listing.seller?.name || 'Unknown Seller';
    displaySellerInfo(sellerImage, sellerName);

    const bids = listing.bids || [];
    currentHighestBid = bids.length > 0
      ? Math.max(...bids.map((bid) => bid.amount || 0))
      : 0;

    document.querySelector('#highestBid').innerText = `${currentHighestBid} Credits`;

    const highestBidsByUser = getHighestBidsByUser(bids);
    displayBidders(highestBidsByUser);

    startLiveCountdown(listing.endsAt);
  } catch (error) {
    console.error('Failed to load listing details:', error.message || error);
    alert('Failed to load listing details. Please try again later.');
  }
}

function displaySellerInfo(profileImage, sellerName) {
  const container = document.querySelector('.details-left');
  const sellerInfo = document.createElement('div');
  sellerInfo.classList.add('d-flex', 'align-items-center', 'mb-4');
  sellerInfo.innerHTML = `
    <img src="${profileImage}" class="rounded-circle me-2" style="width: 40px; height: 40px;" alt="Seller Avatar">
    <span class="fw-bold text-muted">${sellerName}</span>
  `;
  container.prepend(sellerInfo);
}

function getHighestBidsByUser(bids) {
  const highestBids = {};

  bids.forEach((bid) => {
    const userName = bid.bidder?.name || 'Unknown User';
    const bidAmount = bid.amount || 0;

    if (!highestBids[userName] || bidAmount > highestBids[userName]) {
      highestBids[userName] = bidAmount;
      highestBids[`${userName}_avatar`] = bid.bidder?.avatar?.url || 'https://via.placeholder.com/40';
    }
  });

  return highestBids;
}

function displayBidders(bids) {
  const biddersList = document.querySelector('#biddersList');
  biddersList.innerHTML = '';

  if (Object.keys(bids).length === 0) {
    biddersList.innerHTML = '<li>No bids yet</li>';
    return;
  }

  Object.entries(bids).forEach(([key, value]) => {
    if (!key.includes('_avatar')) {
      const avatar = bids[`${key}_avatar`];
      const listItem = `
        <li class="d-flex align-items-center mb-2">
          <img src="${avatar}" class="rounded-circle me-2" style="width: 40px; height: 40px;" alt="Bidder Avatar">
          <span><strong>${key}:</strong> ${value} Credits</span>
        </li>
      `;
      biddersList.innerHTML += listItem;
    }
  });
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

document.addEventListener('DOMContentLoaded', () => {
  fetchDetails();
  document.querySelector('#placeBidButton').addEventListener('click', handleBid);
});
