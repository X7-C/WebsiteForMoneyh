document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const navLinks = document.querySelector('#navLinks');

  navLinks.innerHTML = `
    <li class="nav-item"><a class="nav-link active" href="../../index.html">Home</a></li>
    <li class="nav-item"><a class="nav-link" href="../listings/index.html">Listings</a></li>
  `;

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
});
