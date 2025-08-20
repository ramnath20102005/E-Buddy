// Utility functions for authentication

// Check if JWT token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

// Get token expiration time
export const getTokenExpirationTime = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

// Get time until token expires (in milliseconds)
export const getTimeUntilExpiration = (token) => {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return 0;
  
  return Math.max(0, expirationTime - Date.now());
};

// Check if token will expire soon (within 5 minutes)
export const isTokenExpiringSoon = (token, thresholdMinutes = 5) => {
  const timeUntilExpiration = getTimeUntilExpiration(token);
  const thresholdMs = thresholdMinutes * 60 * 1000;
  return timeUntilExpiration > 0 && timeUntilExpiration < thresholdMs;
};

// Clear all authentication data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('userData');
};

// Get user data from token
export const getUserFromToken = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error parsing token payload:', error);
    return null;
  }
};
