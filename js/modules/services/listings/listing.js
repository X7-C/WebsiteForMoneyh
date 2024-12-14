export async function createListing(title, deadline, description, media) {
  const token = localStorage.getItem('token');
  const response = await fetch('https://v2.api.noroff.dev/listings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, deadline, description, media }),
  });
  const data = await response.json();
  if (response.ok) {
    console.log('Listing Created:', data);
  } else {
    console.error('Error Creating Listing:', data);
  }
}
