import { apiRequest } from '../../../utils/api.js';

export async function fetchUserCredits(username) {
  const token = localStorage.getItem('token');
  try {
    const userData = await apiRequest(`users/${username}`, 'GET', null, token);
    console.log('User Credits:', userData.credits);
    return userData.credits;
  } catch (error) {
    console.error('Failed to fetch credits:', error);
    throw error;
  }
}
