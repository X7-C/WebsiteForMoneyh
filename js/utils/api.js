import { TokenManager } from './tokenManager.js';

export async function apiRequest(endpoint, method = 'GET', body = null) {
  const token = TokenManager.getToken();

  const headers = {
    'Content-Type': 'application/json',
    'X-Noroff-API-Key': 'b99247dd-8989-4e93-8790-01cbfd47910b',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`https://v2.api.noroff.dev/${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.errors?.[0]?.message || 'Request failed');
    return data;
  } catch (error) {
    console.error('API Request Error:', error.message || error);
    throw error;
  }
}
