import { apiRequest } from '../../utils/api.js';

let currentHighestBid = 0;
let listingId = '';

async function fetchDetails() {
  const params = new URLSearchParams(window.location.search);
  listingId = params.get('id');
  const token = localStorage.getItem('token');

  if (!listingId || !token) {
    alert('Invalid listing ID or not logged in.');
    window.location.href = '../listings/index.html';
    return;
  }

  try {
    const response = await apiRequest(`auction/listings/${listingId}?_bids=true`, 'GET', null, token);
    const listing = response.data;

    document.querySelector('#listingTitle').innerText = listing.title;
    document.querySelector('#listingDescription').innerText = listing.description;

    const imageElement = document.querySelector('#listingImage');
    imageElement.src = listing.media[0]?.url || 'https://via.placeholder.com/800x400';
    imageElement.alt = listing.title || 'Listing Image';

    currentHighestBid = listing.bids.length > 0
      ? Math.max(...listing.bids.map((bid) => bid.amount))
      : 0;

    const timeRemaining = calculateTimeRemaining(listing.endsAt);

    document.querySelector('#highestBid').innerText = `${currentHighestBid} Credits`;
    document.querySelector('#timeRemaining').innerText = timeRemaining;
  } catch (error) {
    console.error('Failed to load listing details:', error.message || error);
    alert('Failed to load listing details. Please try again later.');
  }
}

async function handleBid() {
  const bidAmount = parseFloat(prompt(`Enter your bid amount (must be higher than ${currentHighestBid} Credits):`));

  if (!bidAmount || isNaN(bidAmount) || bidAmount <= currentHighestBid) {
    alert(`Please enter a valid bid amount higher than ${currentHighestBid}.`);
    return;
  }

  try {
    await apiRequest(`auction/listings/${listingId}/bids`, 'POST', { amount: bidAmount });
    alert('Bid placed successfully!');
    fetchDetails();
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

document.addEventListener('DOMContentLoaded', fetchDetails);
document.querySelector('#placeBidButton').addEventListener('click', handleBid);
