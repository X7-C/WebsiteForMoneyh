document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const navLinks = document.querySelector('#navLinks');

  if (navLinks) {
    if (token) {
      navLinks.innerHTML += `
        <li class="nav-item"><a class="nav-link" href="../user/index.html">Profile</a></li>
        <li class="nav-item"><a class="nav-link" href="../createListings/index.html">Create Listing</a></li>
        <li class="nav-item"><a class="nav-link" id="logoutButton" href="#">Logout</a></li>
      `;
    } else {
      navLinks.innerHTML += `
        <li class="nav-item"><a class="nav-link" href="../login/index.html">Login</a></li>
      `;
    }
  }
});
