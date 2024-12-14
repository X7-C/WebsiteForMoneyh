export function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('credits');
  alert('You have been logged out.');
  window.location.href = '../../pages/login/index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#navLinks').addEventListener('click', (event) => {
    if (event.target && event.target.id === 'logoutButton') {
      event.preventDefault();
      logoutUser();
    }
  });
});
