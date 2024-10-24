// src/app/core/models/user.model.ts

import { Roles } from '../enums/roles.enums';
import { StatusCodes } from '../enums/status.enum';

export interface User {
  id: string;
  name: string;
  email: string;
  token: string; // Token JWT u otro tipo de token de autenticación
  role: Roles; // Un solo rol por usuario
  status: StatusCodes; // Usar enum para consistencia
  memberNumber?: string;
  photo: string;
  phone?: string; // Opcional si no siempre está presente
  address?: string; // Opcional si no siempre está presente
  accountNumber: string; // Nuevo campo añadido
  dni?: string; // Nuevo campo añadido
  occupation?: string; // Nuevo campo añadido
  dateOfBirth?: string; // Nuevo campo añadido
  updatedAt: string;
  img?: string;
  date: Date;
  username: string;
}
