import { apiRequest } from '../../utils/api.js';

export async function registerUser(name, email, password, bio = "This is my bio.") {
  try {
    const payload = {
      name,
      email,
      password,
      bio,
      avatar: {
        url: "https://picsum.photos/150",
        alt: "Default avatar"
      },
      banner: {
        url: "https://picsum.photos/800/200",
        alt: "Default banner"
      }
    };

    console.log('Registration Payload:', payload);

    const response = await apiRequest('auth/register', 'POST', payload);

    const username = response.data.name;
    const token = response.data.accessToken;

    localStorage.setItem('username', username);
    localStorage.setItem('token', token);

    await apiRequest(`auction/profiles/${username}`, 'PUT', {
      credits: 1000
    }, token);

    alert('Registration successful!');
    window.location.href = '../../pages/listings/index.html';
  } catch (error) {
    console.error('Registration failed:', error.message || error);
    alert(`Registration failed: ${error.message}`);
  }
}

document.querySelector('#registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value.trim();

  if (!name || !email || !password) {
    alert('All fields are required.');
    return;
  }

  await registerUser(name, email, password);
});
