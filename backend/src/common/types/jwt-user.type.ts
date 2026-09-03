export interface JwtAuthUser {
  sub: string; // User ID (UUID)
  email: string;
  iat?: number;
  exp?: number;
}
