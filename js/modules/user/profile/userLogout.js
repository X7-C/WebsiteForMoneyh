document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelector('#navLinks');
  
    if (!navLinks) return;
  
    navLinks.addEventListener('click', (event) => {
      if (event.target && event.target.id === 'logoutButton') {
        event.preventDefault();
        logoutUser();
      }
    });
  });
  
  export function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('credits');
    alert('You have been logged out.');
    window.location.href = '../../pages/login/index.html';
  }