import { loginUser } from './modules/auth/login.js';
import { logoutUser } from './modules/auth/logout.js';
import { registerUser } from './modules/auth/register.js';
import { fetchUserCredits } from './modules/services/credits.js';
import { createListing } from './modules/services/listing.js';
import { searchListings } from './modules/services/searchListing.js';
import { placeBid } from './modules/services/listBidding.js';
import { updateAvatar } from './modules/user/userAvatar.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('App is running!');
});
