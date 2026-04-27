export interface User {
  id: string | number;
  email: string;
  username: string;
  userRole: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}