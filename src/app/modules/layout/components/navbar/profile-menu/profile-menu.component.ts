// src/app/shared/components/profile-menu/profile-menu.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthService } from '../../../../../core/services/auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Roles } from '../../../../../core/enums/roles.enums';

interface ProfileMenuItem {
  label: string;
  icon: string;
  route?: string;
}

interface ProfileMenuGroup {
  title?: string;
  items: ProfileMenuItem[];
}

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  standalone: true,
  imports: [ClickOutsideDirective, AngularSvgIconModule, CommonModule],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          transform: 'translateY(0)',
          visibility: 'visible',
        }),
      ),
      state(
        'closed',
        style({
          opacity: 0,
          transform: 'translateY(-10px)',
          visibility: 'hidden',
        }),
      ),
      transition('open => closed', [animate('0.2s ease-out')]),
      transition('closed => open', [animate('0.2s ease-in')]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit {
  public isOpen = false;
  public user: any;
  public profileMenu: ProfileMenuGroup[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.userValue;
    this.setProfileMenu();
  }

  /**
   * Define el menú de perfil basado en el rol del usuario.
   */
  private setProfileMenu(): void {
    const role: Roles = this.user?.role || Roles.USER;

    // Menú básico para todos los usuarios
    const basicMenu: ProfileMenuGroup = {
      items: [
        {
          label: 'Mi Perfil',
          icon: 'assets/icons/heroicons/outline/user-circle.svg',
          route: role === Roles.ADMIN ? '/dashboard/profile' : '/dashboard/member-profile',
        },
        {
          label: 'Pau de Navia',
          icon: 'assets/icons/heroicons/outline/cog-6-tooth.svg',
          route: '/dashboard/notificaciones',
        },
      ],
    };

    // Menú adicional para administradores
    const adminMenu: ProfileMenuGroup = {
      title: 'Administración',
      items: [
        {
          label: 'Panel de Administración',
          icon: 'assets/icons/heroicons/outline/shield-check.svg',
          route: '/admin/dashboard',
        },
        {
          label: 'Gestión de Usuarios',
          icon: 'assets/icons/heroicons/outline/users.svg',
          route: '/uikit/lista-socios',
        },
      ],
    };

    // Menú adicional para usuarios
    const userMenu: ProfileMenuGroup = {
      title: 'Usuario',
      items: [
        {
          label: 'Mis Notificaciones',
          icon: 'assets/icons/heroicons/outline/bell.svg',
          route: '/dashboard/notificaciones',
        },
        {
          label: 'Soporte',
          icon: 'assets/icons/heroicons/outline/information-circle.svg',
          route: '/general/contact',
        },
      ],
    };

    // Menú de cierre de sesión
    const logoutMenu: ProfileMenuGroup = {
      items: [
        {
          label: 'Cerrar Sesión',
          icon: 'assets/icons/heroicons/outline/logout.svg',
        },
      ],
    };

    // Construir el menú basado en el rol
    this.profileMenu = [
      basicMenu,
      ...(role === Roles.ADMIN ? [adminMenu] : []),
      ...(role === Roles.USER ? [userMenu] : []),
      logoutMenu,
    ];
  }

  /**
   * Alterna la visibilidad del menú.
   */
  public toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  /**
   * Verifica si el grupo actual es el último en la lista.
   * @param group El grupo actual.
   * @returns True si es el último grupo, False en caso contrario.
   */
  public lastGroup(group: ProfileMenuGroup): boolean {
    return this.profileMenu.indexOf(group) === this.profileMenu.length - 1;
  }

  /**
   * Maneja el clic en los elementos del menú.
   * @param item El elemento del menú clicado.
   */
  public onMenuItemClick(item: ProfileMenuItem): void {
    if (item.label === 'Cerrar Sesión') {
      this.authService.logout();
      this.router.navigate(['/auth/sign-in']);
    } else if (item.route) {
      this.router.navigate([item.route]);
    }
    this.isOpen = false; // Cierra el menú después de una acción
  }
}
