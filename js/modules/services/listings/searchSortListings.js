import { fetchListings } from './displayListings.js';

let isAuctionEndedFiltered = false;

document.querySelector('#sortFilter').addEventListener('change', (event) => {
  const sortOption = event.target.value;
  fetchListings({ sortOption });
});

document.querySelector('#searchBar').addEventListener('input', (event) => {
  const searchTerm = event.target.value.toLowerCase();
  fetchListings({ searchTerm });
});

document.querySelector('#removeEndedButton').addEventListener('click', () => {
  isAuctionEndedFiltered = !isAuctionEndedFiltered;
  fetchListings({ isAuctionEndedFiltered });
});
