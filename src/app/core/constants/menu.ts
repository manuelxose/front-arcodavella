import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Base',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Dashboard',
          route: '/dashboard',
          children: [
            { label: 'Nfts', route: '/dashboard/nfts' },
            { label: 'Profile', route: '/dashboard/profile' },
            { label: 'Socio', route: '/dashboard/member-profile' },
            { label: 'Documentos', route: '/dashboard/documentos' },
            { label: 'Notificaciones', route: '/dashboard/notificaciones' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/lock-closed.svg',
          label: 'Auth',
          route: '/auth',
          children: [
            { label: 'Sign up', route: '/auth/sign-up' },
            { label: 'Sign in', route: '/auth/sign-in' },
            { label: 'Forgot Password', route: '/auth/forgot-password' },
            { label: 'New Password', route: '/auth/new-password' },
            { label: 'Two Steps', route: '/auth/two-steps' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/exclamation-triangle.svg',
          label: 'Erros',
          route: '/errors',
          children: [
            { label: '404', route: '/errors/404' },
            { label: '500', route: '/errors/500' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Components',
          route: '/components',
          children: [
            { label: 'Table', route: '/components/table' },
            { label: 'Crear Notificacion', route: '/components/send-notification' },
          ],
        },
      ],
    },
    {
      group: 'Cooperativa',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Cooperativa',
          route: '/cooperativa',
          children: [
            {
              icon: 'assets/icons/heroicons/outline/download.svg',
              label: 'Asistencia',
              route: '/cooperativa/asistencia',
            },
            {
              icon: 'assets/icons/heroicons/outline/gift.svg',
              label: 'Código QR',
              route: '/cooperativa/qr',
            },
            {
              icon: 'assets/icons/heroicons/outline/gift.svg',
              label: 'Lector QR',
              route: '/cooperativa/qr-scanner',
            },
          ],
        },
      ],
    },
    {
      group: 'Config',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/cog.svg',
          label: 'Settings',
          route: '/settings',
        },
        {
          icon: 'assets/icons/heroicons/outline/bell.svg',
          label: 'Notifications',
          route: '/gift',
        },
        {
          icon: 'assets/icons/heroicons/outline/folder.svg',
          label: 'Folders',
          route: '/folders',
          children: [
            { label: 'Current Files', route: '/folders/current-files' },
            { label: 'Downloads', route: '/folders/download' },
            { label: 'Trash', route: '/folders/trash' },
          ],
        },
      ],
    },
  ];
}
