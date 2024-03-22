// jwt-helper.ts

interface DecodedToken {
    userId: number;
    email: string;
    exp: number;
    username: string;
    iat: number;
    role: number;
  }
  
  export function decodeToken(token: string): DecodedToken | null {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: decodedToken.userId,
        email: decodedToken.email,
        username:decodedToken.username,
        exp: decodedToken.exp,
        iat: decodedToken.iat,
        role: decodedToken.role
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  