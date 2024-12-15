import { TokenManager } from '../../../utils/tokenManager.js';

document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.querySelector('#logoutButton');

  if (!logoutButton) return;

  logoutButton.addEventListener('click', (event) => {
    event.preventDefault();
    TokenManager.clearToken();
    alert('You have been logged out.');
    window.location.href = '../../pages/login/index.html';
  });
});
