export function checkAuth() {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = '../../pages/listings/index.html';
  }
}
