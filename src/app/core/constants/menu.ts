// src/app/core/constants/menu.ts

import { Roles } from '../enums/roles.enums';
import { MenuItem, SubMenuItem } from '../models/menu.model';

export class Menu {
  /**
   * Menú completo con todos los elementos divididos por roles y grupos.
   */
  private static allPages: MenuItem[] = [
    // Grupos para Administradores
    {
      group: 'Panel de Control',
      separator: false,
      roles: [Roles.ADMIN],
      children: [
        {
          icon: 'assets/icons/heroicons/outline/view-grid.svg',
          label: 'Resumen',
          route: '/dashboard/overview',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/user-circle.svg',
          label: 'Perfil',
          route: '/dashboard/profile',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Socio',
          route: '/dashboard/member-profile',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/document-magnify.svg',
          label: 'Documentos',
          route: '/dashboard/documentos',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/bell.svg',
          label: 'Notificaciones',
          route: '/dashboard/notificaciones',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/photo.svg',
          label: 'Blog / Noticias',
          route: '/dashboard/blog',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/home-modern.svg',
          label: 'Pau de Navia',
          route: '/dashboard/promotion',
          roles: [Roles.ADMIN],
        },
      ],
    },
    {
      group: 'Cooperativa',
      separator: true,
      roles: [Roles.ADMIN],
      children: [
        {
          icon: 'assets/icons/heroicons/outline/download.svg',
          label: 'Asistencia',
          route: '/cooperativa/asistencia',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/qr-code.svg',
          label: 'Código QR',
          route: '/cooperativa/qr',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/qr-code.svg',
          label: 'Lector QR',
          route: '/cooperativa/qr-scanner',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/user-group.svg',
          label: 'Socios Cooperativa',
          route: '/uikit/lista-socios',
          roles: [Roles.ADMIN],
        },
      ],
    },
    {
      group: 'Gestión',
      separator: true,
      roles: [Roles.ADMIN],
      children: [
        {
          icon: 'assets/icons/heroicons/outline/inbox.svg',
          label: 'Lista de Información',
          route: '/uikit/listings',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/clipboard-document.svg',
          label: 'Gestión de Documentos',
          route: '/dashboard/view-documents',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/cog-6-tooth.svg',
          label: 'Configuración General',
          route: '/admin/configuracion',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/flag.svg',
          label: 'Crear Notificaciones',
          route: '/uikit/enviar-notificaciones',
          roles: [Roles.ADMIN],
        },
        {
          icon: 'assets/icons/heroicons/outline/chat-bubble-bottom.svg',
          label: 'Soporte',
          route: '/general/contact',
          roles: [Roles.ADMIN],
        },
      ],
    },
    {
      group: 'Seguridad',
      separator: true,
      roles: [Roles.ADMIN],
      children: [
        {
          icon: 'assets/icons/heroicons/outline/lock-closed.svg',
          label: 'Autenticación',
          route: '/auth',
          roles: [Roles.ADMIN],
          children: [
            {
              icon: 'assets/icons/heroicons/outline/lock-closed.svg',
              label: 'Registrarse',
              route: '/auth/sign-up',
              roles: [Roles.ADMIN],
            },
            {
              icon: 'assets/icons/heroicons/outline/user-circle.svg',
              label: 'Iniciar Sesión',
              route: '/auth/sign-in',
              roles: [Roles.ADMIN],
            },
            {
              icon: 'assets/icons/heroicons/outline/lock-closed.svg',
              label: 'Olvidé mi Contraseña',
              route: '/auth/forgot-password',
              roles: [Roles.ADMIN],
            },
            {
              icon: 'assets/icons/heroicons/outline/lock-closed.svg',
              label: 'Nueva Contraseña',
              route: '/auth/new-password',
              roles: [Roles.ADMIN],
            },
            {
              icon: 'assets/icons/heroicons/outline/shield-check.svg',
              label: 'Dos Pasos',
              route: '/auth/two-steps',
              roles: [Roles.ADMIN],
            },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/exclamation-triangle.svg',
          label: 'Errores',
          route: '/errors',
          roles: [Roles.ADMIN],
          children: [
            {
              icon: 'assets/icons/heroicons/outline/exclamation-triangle.svg',
              label: '404',
              route: '/errors/404',
              roles: [Roles.ADMIN],
            },
            {
              icon: 'assets/icons/heroicons/outline/exclamation-triangle.svg',
              label: '500',
              route: '/errors/500',
              roles: [Roles.ADMIN],
            },
          ],
        },
      ],
    },
    {
      group: 'General',
      separator: true,
      roles: [Roles.ADMIN],
      children: [
        {
          icon: 'assets/icons/heroicons/outline/logout.svg',
          label: 'Cerrar Sesión',
          route: '/auth/sign-out',
          roles: [Roles.ADMIN],
        },
      ],
    },
    // Grupos para Usuarios
    {
      group: 'Perfil',
      separator: false,
      roles: [Roles.USER],
      children: [
        {
          icon: 'assets/icons/heroicons/outline/view-grid.svg',
          label: 'Resumen',
          route: '/dashboard/overview',
          roles: [Roles.USER],
        },
        {
          icon: 'assets/icons/heroicons/outline/user-circle.svg',
          label: 'Perfil',
          route: '/dashboard/member-profile',
          roles: [Roles.USER],
        },
      ],
    },
    {
      group: 'Soporte',
      separator: true,
      roles: [Roles.USER],
      children: [
        {
          icon: 'assets/icons/heroicons/outline/chat-bubble-bottom.svg',
          label: 'Soporte',
          route: '/general/contact', // **Ruta Corregida**
          roles: [Roles.USER],
        },
      ],
    },
    {
      group: 'Cooperativa',
      separator: true,
      roles: [Roles.USER],
      children: [
        {
          icon: 'assets/icons/heroicons/outline/qr-code.svg',
          label: 'Código QR',
          route: '/cooperativa/qr', // **Ruta Corregida**
          roles: [Roles.USER],
        },
        {
          icon: 'assets/icons/heroicons/outline/clipboard-document.svg',
          label: 'Documentos',
          route: '/dashboard/documentos', // **Ruta Corregida**
          roles: [Roles.USER],
        },
        // {
        //   icon: 'assets/icons/heroicons/outline/bell.svg',
        //   label: 'Notificaciones',
        //   route: '/dashboard/notificaciones',
        //   roles: [Roles.USER],
        // },
      ],
    },
    {
      group: 'Promoción',
      separator: true,
      roles: [Roles.USER],
      children: [
        {
          icon: 'assets/icons/heroicons/outline/gift.svg',
          label: 'Pau de Navia',
          route: '/dashboard/promotion', // **Ruta Corregida**
          roles: [Roles.USER],
        },
      ],
    },
    {
      group: 'Información',
      separator: true,
      roles: [Roles.USER],
      children: [
        // {
        //   icon: 'assets/icons/heroicons/outline/document-magnify.svg',
        //   label: 'Documentos',
        //   route: '/dashboard/documentos',
        //   roles: [Roles.USER],
        // },
        {
          icon: 'assets/icons/heroicons/outline/bell.svg',
          label: 'Notificaciones',
          route: '/dashboard/notificaciones', // **Ruta Corregida**
          roles: [Roles.USER],
        },
        {
          icon: 'assets/icons/heroicons/outline/photo.svg',
          label: 'Blog / Noticias',
          route: '/dashboard/blog', // **Ruta Corregida**
          roles: [Roles.USER],
        },
      ],
    },
    // {
    //   group: 'Asistencia',
    //   separator: true,
    //   roles: [Roles.USER],
    //   children: [
    //     {
    //       icon: 'assets/icons/heroicons/outline/qr-code.svg',
    //       label: 'Mi Código QR',
    //       route: '/cooperativa/qr',
    //       roles: [Roles.USER],
    //     },
    //   ],
    // },
    {
      group: 'General',
      separator: true,
      roles: [Roles.USER],
      children: [
        {
          icon: 'assets/icons/heroicons/outline/logout.svg',
          label: 'Cerrar Sesión',
          route: '/auth/sign-out',
          roles: [Roles.USER],
        },
      ],
    },
  ];

  /**
   * Obtener el menú filtrado basado en el rol del usuario.
   * @param role El rol del usuario (ADMIN o USER).
   * @returns Lista de MenuItem apropiada para el rol.
   */
  public static getMenu(role: Roles): MenuItem[] {
    return this.filterMenuByRole(this.allPages, role);
  }

  /**
   * Filtrar el menú basado en el rol del usuario.
   * @param menuItems Lista de elementos del menú.
   * @param role Rol del usuario.
   * @returns Menú filtrado.
   */
  private static filterMenuByRole(menuItems: MenuItem[], role: Roles): MenuItem[] {
    return menuItems
      .map((item) => {
        // Si el elemento no tiene roles definidos, se asume que es accesible para todos
        if (item.roles && !item.roles.includes(role)) {
          return null;
        }

        let children = item.children;
        if (children) {
          children = this.filterSubMenuByRole(children, role);
          if (!children.length) {
            return null;
          }
        }

        return { ...item, children };
      })
      .filter((item) => item !== null) as MenuItem[];
  }

  /**
   * Filtrar el submenú basado en el rol del usuario.
   * @param subMenuItems Lista de elementos del submenú.
   * @param role Rol del usuario.
   * @returns Submenú filtrado.
   */
  private static filterSubMenuByRole(subMenuItems: SubMenuItem[], role: Roles): SubMenuItem[] {
    return subMenuItems
      .map((item) => {
        if (item.roles && !item.roles.includes(role)) {
          return null;
        }

        let children = item.children;
        if (children) {
          children = this.filterSubMenuByRole(children, role);
          if (!children.length) {
            return null;
          }
        }

        return { ...item, children };
      })
      .filter((item) => item !== null) as SubMenuItem[];
  }
}
