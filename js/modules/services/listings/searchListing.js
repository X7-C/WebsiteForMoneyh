export async function searchListings(query) {
  const response = await fetch(`https://v2.api.noroff.dev/listings?search=${query}`);
  const data = await response.json();
  if (response.ok) {
    console.log('Search Results:', data);
  } else {
    console.error('Error Searching Listings:', data);
  }
}
