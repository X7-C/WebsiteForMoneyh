export function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('credits');
  alert('You have been logged out.');
  window.location.href = '../../pages/auth/login.html';
}

document.querySelector('#logoutButton')?.addEventListener('click', logoutUser);
