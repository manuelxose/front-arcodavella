export interface User {
  id: string;
  username: string;
  email: string;
  token: string; // Token JWT u otro tipo de token de autenticación
  roles?: string[]; // Opcional: Array de roles si tu aplicación tiene control de roles
}
