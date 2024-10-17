// src/app/domain/dtos/destinatarios.ts

export interface ListaDetalle {
  name: string; // Nombre de la lista
  membersCount: number; // Número de miembros en la lista
}

export interface Destinatarios {
  usuarios: string[]; // Nombres de los usuarios individuales
  listas: ListaDetalle[]; // Listas de destinatarios con nombre y conteo de miembros
  total: number; // Total de destinatarios sumando usuarios y miembros de las listas
  detalle: string; // Descripción detallada para mostrar en el modal de confirmación
}
