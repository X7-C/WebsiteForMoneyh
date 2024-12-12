import { apiRequest } from '../../utils/api.js';

async function createListing(event) {
  event.preventDefault();

  const title = document.querySelector('#title').value.trim();
  const description = document.querySelector('#description').value.trim();
  const endsAt = document.querySelector('#endsAt').value;
  const mediaUrl = document.querySelector('#mediaUrl').value.trim();

  if (!title || !description || !endsAt) {
    alert('Please fill in all required fields.');
    return;
  }

  const payload = {
    title,
    description,
    endsAt,
    media: mediaUrl ? [{ url: mediaUrl, alt: title }] : [],
  };

  try {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to create a listing.');
      window.location.href = '../auth/login.html';
      return;
    }

    const response = await apiRequest('auction/listings', 'POST', payload, token);
    alert('Listing created successfully!');
    window.location.href = '../listings/index.html'; 
  } catch (error) {
    console.error('Failed to create listing:', error.message || error);
    alert(`Failed to create listing: ${error.message}`);
  }
}

document.querySelector('#createListingForm')?.addEventListener('submit', createListing);
