export async function updateAvatar(username, avatarUrl) {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://v2.api.noroff.dev/users/${username}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ avatar: avatarUrl }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Avatar Updated:', data);
    } else {
      console.error('Error Updating Avatar:', data);
    }
  }
  