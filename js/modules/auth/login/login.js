import { apiRequest } from '../../../utils/api.js';
import { checkAuth } from '../../../utils/checkAuth.js';

checkAuth(); 

async function loginUser(email, password) {
  const payload = { email, password };
  const response = await apiRequest('auth/login', 'POST', payload);

  localStorage.setItem('token', response.data.accessToken);
  localStorage.setItem('username', response.data.name);

  return response;
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
    alert('Login successful!');
    window.location.href = '../../pages/listings/index.html'; 
  } catch (error) {
    console.error('Login failed:', error.message || error);
    alert('Login failed. Please check your credentials and try again.');
  }
});
