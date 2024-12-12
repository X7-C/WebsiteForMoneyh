const API_BASE_URL = 'https://v2.api.noroff.dev/';
const API_KEY = 'b99247dd-8989-4e93-8790-01cbfd47910b';

export async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
  if (!token) {
    token = localStorage.getItem('token');
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-Noroff-API-Key': API_KEY,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error(`API Error (${response.status}):`, responseData);

      if (response.status === 401 && responseData.errors?.[0]?.message.includes('Invalid authorization token')) {
        localStorage.clear();
        alert('Your session has expired. Please log in again.');
        window.location.href = '../../pages/auth/login.html';
      }

      throw new Error(responseData.errors?.[0]?.message || 'An unknown error occurred');
    }

    return responseData;
  } catch (error) {
    console.error('Network/API Request Error:', error.message || error);
    throw error;
  }
}
