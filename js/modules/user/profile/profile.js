import { apiRequest } from '../../../utils/api.js';

async function fetchUserProfile() {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  if (!username || !token) {
    alert('You must be logged in to access this page.');
    window.location.href = '../../pages/auth/login.html';
    return;
  }

  try {
    const response = await apiRequest(`auction/profiles/${username}`, 'GET', null, token);
    const profile = response.data;
    document.getElementById('usernameDisplay').innerText = profile.name;
    document.getElementById('userCreditsDisplay').innerText = `Credits: ${profile.credits}`;
    document.getElementById('avatarImage').src = profile.avatar?.url || 'https://via.placeholder.com/150';
    localStorage.setItem('credits', profile.credits);
  } catch (error) {
    console.error('Failed to fetch profile:', error.message || error);
    alert('Failed to load profile. Please try again later.');
  }
}

async function updateAvatar(event) {
  event.preventDefault();
  const avatarUrl = document.getElementById('avatarUrl').value.trim();
  if (!avatarUrl) {
    alert('Please enter a valid avatar URL.');
    return;
  }

  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  
  try {
    const payload = {
      avatar: { url: avatarUrl, alt: 'User Avatar' }
    };

    await apiRequest(`auction/profiles/${username}`, 'PUT', payload, token);
    alert('Avatar updated successfully!');
    fetchUserProfile(); 
  } catch (error) {
    console.error('Failed to update avatar:', error.message || error);
    alert('Failed to update avatar. Please try again later.');
  }
}

document.addEventListener('DOMContentLoaded', fetchUserProfile);
document.querySelector('#updateAvatarForm')?.addEventListener('submit', updateAvatar);
