// src/app/core/constants/menu.ts

import { MenuItem } from '../models/menu.model';
import { Roles } from '../enums/roles.enums';

export class Menu {
  /**
   * Menú común para todos los usuarios.
   */
  public static commonPages: MenuItem[] = [
    {
      group: 'Inicio', // Renombrado de 'Base' a 'Inicio'
      separator: false,
      children: [
        // Cambiado de 'items' a 'children'
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Panel de Control',
          route: '/dashboard',
          children: [
            // Cambiado de 'items' a 'children'
            { label: 'NFTs', route: '/dashboard/nfts' },
            { label: 'Perfil', route: '/dashboard/profile' },
            { label: 'Socio', route: '/dashboard/member-profile' },
            { label: 'Documentos', route: '/dashboard/documentos' },
            { label: 'Notificaciones', route: '/dashboard/notificaciones' },
            { label: 'Blog / Noticias', route: '/dashboard/blog' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/lock-closed.svg',
          label: 'Autenticación',
          route: '/auth',
          children: [
            // Cambiado de 'items' a 'children'
            { label: 'Registrarse', route: '/auth/sign-up' },
            { label: 'Iniciar Sesión', route: '/auth/sign-in' },
            { label: 'Olvidé mi Contraseña', route: '/auth/forgot-password' },
            { label: 'Nueva Contraseña', route: '/auth/new-password' },
            { label: 'Dos Pasos', route: '/auth/two-steps' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/exclamation-triangle.svg',
          label: 'Errores',
          route: '/errors',
          children: [
            // Cambiado de 'items' a 'children'
            { label: '404', route: '/errors/404' },
            { label: '500', route: '/errors/500' },
          ],
        },
      ],
    },
    {
      group: 'Cooperativa',
      separator: true,
      children: [
        // Cambiado de 'items' a 'children'
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Cooperativa',
          route: '/cooperativa',
          children: [
            // Cambiado de 'items' a 'children'
            {
              icon: 'assets/icons/heroicons/outline/download.svg',
              label: 'Asistencia',
              route: '/cooperativa/asistencia',
              roles: [Roles.ADMIN], // Solo visible para administradores
            },
            {
              icon: 'assets/icons/heroicons/outline/gift.svg',
              label: 'Código QR',
              route: '/cooperativa/qr',
              roles: [Roles.USER, Roles.ADMIN], // Visible para usuarios y administradores
            },
            {
              icon: 'assets/icons/heroicons/outline/gift.svg',
              label: 'Lector QR',
              route: '/cooperativa/qr-scanner',
              roles: [Roles.ADMIN], // Solo visible para administradores
            },
            {
              icon: 'assets/icons/heroicons/outline/calendar.svg',
              label: 'Gestión de Reuniones',
              route: '/cooperativa/reuniones',
              roles: [Roles.ADMIN], // Solo visible para administradores
            },
          ],
        },
      ],
    },
  ];

  /**
   * Menú exclusivo para administradores.
   */
  public static adminPages: MenuItem[] = [
    {
      group: 'Administración',
      separator: false,
      children: [
        // Cambiado de 'items' a 'children'
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Lista Socios',
          route: '/admin/lista-socios',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/document-text.svg',
          label: 'Gestión de Documentos',
          route: '/admin/gestion-documentos',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/settings.svg',
          label: 'Configuración General',
          route: '/admin/configuracion',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/clipboard.svg',
          label: 'Reportes',
          route: '/admin/reportes',
          roles: [Roles.ADMIN],
        },
        // Puedes agregar más ítems exclusivos para administradores aquí
      ],
    },
    {
      group: 'Notificaciones',
      separator: false,
      children: [
        // Cambiado de 'items' a 'children'
        {
          icon: 'assets/icons/heroicons/outline/bell.svg',
          label: 'Enviar Notificaciones',
          route: '/admin/enviar-notificaciones',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/inbox.svg',
          label: 'Historial de Notificaciones',
          route: '/admin/historial-notificaciones',
          roles: [Roles.ADMIN],
        },
      ],
    },
    {
      group: 'Asistencia',
      separator: false,
      children: [
        // Cambiado de 'items' a 'children'
        {
          icon: 'assets/icons/heroicons/outline/check-circle.svg',
          label: 'Control de Asistencia',
          route: '/admin/control-asistencia',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/calendar.svg',
          label: 'Historial de Reuniones',
          route: '/admin/historial-reuniones',
          roles: [Roles.ADMIN],
        },
      ],
    },
  ];

  /**
   * Menú exclusivo para usuarios normales.
   */
  public static userPages: MenuItem[] = [
    {
      group: 'Perfil',
      separator: false,
      children: [
        // Cambiado de 'items' a 'children'
        {
          icon: 'assets/icons/heroicons/outline/user-circle.svg',
          label: 'Mi Perfil',
          route: '/user/profile',
          roles: [Roles.USER, Roles.ADMIN], // Visible para ambos roles
        },
        {
          icon: 'assets/icons/heroicons/outline/chat.svg',
          label: 'Soporte',
          route: '/user/soporte',
          roles: [Roles.USER, Roles.ADMIN],
        },
      ],
    },
    {
      group: 'Asistencia',
      separator: false,
      children: [
        // Cambiado de 'items' a 'children'
        {
          icon: 'assets/icons/heroicons/outline/qrcode.svg',
          label: 'Mi Código QR',
          route: '/user/qr-asistencia',
          roles: [Roles.USER, Roles.ADMIN],
        },
      ],
    },
    {
      group: 'Información',
      separator: false,
      children: [
        // Cambiado de 'items' a 'children'
        {
          icon: 'assets/icons/heroicons/outline/document.svg',
          label: 'Documentos',
          route: '/user/documentos',
          roles: [Roles.USER, Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/bell.svg',
          label: 'Notificaciones',
          route: '/user/notificaciones',
          roles: [Roles.USER, Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/news.svg',
          label: 'Blog / Noticias',
          route: '/user/blog',
          roles: [Roles.USER, Roles.ADMIN],
        },
      ],
    },
  ];

  /**
   * Obtener el menú completo basado en el rol del usuario.
   * @param role El rol del usuario (ADMIN o USER).
   * @returns Lista de MenuItem apropiada para el rol.
   */
  public static getMenu(role: Roles): MenuItem[] {
    let menu = [...this.commonPages];

    if (role === Roles.ADMIN) {
      menu = [...menu, ...this.adminPages];
    } else if (role === Roles.USER) {
      menu = [...menu, ...this.userPages];
    }

    return menu;
  }
}
