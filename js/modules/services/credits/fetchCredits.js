import { apiRequest } from '../../../utils/api.js';

export async function fetchUserCredits() {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  if (!username || !token) {
    alert('You must be logged in to view this page.');
    window.location.href = '../../pages/auth/login.html';
    return;
  }

  try {
    const response = await apiRequest(`auction/profiles/${username}`, 'GET', null, token);
    const credits = response.data?.credits || 0;

    const creditsDisplay = document.getElementById('userCredits');
    if (creditsDisplay) {
      creditsDisplay.innerText = `Credits: ${credits}`;
    }

    localStorage.setItem('credits', credits);
  } catch (error) {
    console.error('Failed to fetch user credits:', error.message || error);
    alert('Failed to fetch user credits. Please try again later.');
  }
}
