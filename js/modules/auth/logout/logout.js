export function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('credits');
  alert('You have been logged out.');
  window.location.href = '../../pages/login/index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelector('#navLinks');

  if (!navLinks) {
    const logoutButton = document.querySelector('#logoutButton');
    if (logoutButton) {
      logoutButton.addEventListener('click', (event) => {
        event.preventDefault();
        logoutUser();
      });
    }
    return;
  }

  navLinks.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'logoutButton') {
      event.preventDefault();
      logoutUser();
    }
  });
});
