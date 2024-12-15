const TOKEN_KEY = 'token';
const USERNAME_KEY = 'username';
const CREDITS_KEY = 'credits';

export const TokenManager = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  saveToken(token, username, credits = 0) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, username);
    if (credits) localStorage.setItem(CREDITS_KEY, credits);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(CREDITS_KEY);
  },

  isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getUsername() {
    return localStorage.getItem(USERNAME_KEY);
  },

  getCredits() {
    return parseInt(localStorage.getItem(CREDITS_KEY)) || 0;
  },
};
