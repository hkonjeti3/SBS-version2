// jwt-helper.ts

interface DecodedToken {
    userId: number;
    email: string;
    exp: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    iat: number;
    role: number;
  }
  
  export function decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  