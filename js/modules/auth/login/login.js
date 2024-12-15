import { TokenManager } from '../../../utils/tokenManager.js';
import { apiRequest } from '../../../utils/api.js';

async function loginUser(email, password) {
  const payload = { email, password };
  const response = await apiRequest('auth/login', 'POST', payload);

  TokenManager.saveToken(response.data.accessToken, response.data.name);

  alert('Login successful!');
  window.location.href = '../../pages/listings/index.html';
}

document.querySelector('#loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.querySelector('#loginEmail').value.trim();
  const password = document.querySelector('#loginPassword').value.trim();

  if (!email || !password) {
    alert('Email and password are required.');
    return;
  }

  try {
    await loginUser(email, password);
  } catch (error) {
    alert('Login failed. Please check your credentials and try again.');
  }
});
