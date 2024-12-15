export async function placeBid(listingId, bidAmount) {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('You must be logged in to place a bid.');
    window.location.href = '../../pages/login/index.html';
    return;
  }

  if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
    alert('Please enter a valid bid amount greater than zero.');
    return;
  }

  try {
    const response = await fetch(`https://v2.api.noroff.dev/listings/${listingId}/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: bidAmount }),
    });

    if (!response.ok) {
      throw new Error(`Failed to place bid: ${response.statusText}`);
    }

    alert('Bid placed successfully!');
    return await response.json();
  } catch (error) {
    console.error('Error placing bid:', error);
    alert(`Error placing bid: ${error.message}`);
  }
}
