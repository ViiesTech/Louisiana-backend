export interface JwtPayload {
  _id: string;
  email: string,
}

export interface SanitizeOptions {
  keep?: string[];
  remove?: string[];
}