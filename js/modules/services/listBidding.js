export async function placeBid(listingId, amount) {
  const token = localStorage.getItem('token');
  const response = await fetch(`https://v2.api.noroff.dev/listings/${listingId}/bids`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  });
  const data = await response.json();
  if (response.ok) {
    console.log('Bid Placed:', data);
  } else {
    console.error('Error Placing Bid:', data);
  }
}
