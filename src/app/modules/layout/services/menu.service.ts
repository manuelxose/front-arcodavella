// src/app/core/services/menu.service.ts

import { Injectable, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { Menu } from 'src/app/core/constants/menu';
import { Roles } from 'src/app/core/enums/roles.enum';
import { MenuItem, SubMenuItem } from 'src/app/core/models/menu.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService implements OnDestroy {
  // Estados reactivos para gestionar la visibilidad de la barra lateral y el menú móvil
  private _showSidebar = signal(true);
  private _showMobileMenu = signal(false);

  // Estado reactivo para almacenar los elementos del menú
  private _pagesMenu = signal<MenuItem[]>([]);

  // Suscripciones para manejar eventos de navegación y cambios en el usuario
  private _subscription = new Subscription();

  constructor(private router: Router, private authService: AuthService) {
    // Inicializar el menú basado en el rol actual del usuario
    this.initializeMenu();

    // Suscribirse a los cambios en el usuario para actualizar el menú dinámicamente
    const userSub = this.authService.user.subscribe((user) => {
      const userRole: Roles = this.determineUserRole(user?.role);
      this._pagesMenu.set(this.filterMenuByRole(Menu.getMenu(userRole), userRole));

      this.updateMenuState();
    });
    this._subscription.add(userSub);

    // Suscribirse a los eventos de navegación para actualizar el estado del menú
    const navSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateMenuState();
      });
    this._subscription.add(navSub);
  }

  /**
   * Determinar el rol del usuario basado en el rol único.
   * @param role Rol del usuario.
   * @returns Rol determinado (ADMIN o USER).
   */
  private determineUserRole(role?: Roles): Roles {
    console.log('User Roles:', role);

    if (role === Roles.ADMIN) {
      return Roles.ADMIN;
    }
    return Roles.USER;
  }

  /**
   * Inicializar el menú basado en el rol actual del usuario.
   */
  private initializeMenu(): void {
    const currentUser = this.authService.userValue;
    const userRole: Roles = this.determineUserRole(currentUser?.role);

    console.log('User Role:', userRole);
    this._pagesMenu.set(Menu.getMenu(userRole));
  }

  /**
   * Actualizar el estado del menú (expansión y activación de elementos) basado en la ruta activa.
   */
  private updateMenuState(): void {
    this._pagesMenu().forEach((menu: MenuItem) => {
      let activeGroup = false;
      menu.children.forEach((subMenu) => {
        const active = this.isActive(subMenu.route);
        subMenu.expanded = active;
        subMenu.active = active;
        if (active) activeGroup = true;
        if (subMenu.children) {
          this.expand(subMenu.children);
        }
      });
      menu.active = activeGroup;
    });
  }

  /**
   * Obtener el estado de la barra lateral.
   */
  get showSideBar() {
    return this._showSidebar();
  }

  /**
   * Obtener el estado del menú móvil.
   */
  get showMobileMenu() {
    return this._showMobileMenu();
  }

  /**
   * Obtener el menú de páginas.
   */
  get pagesMenu() {
    return this._pagesMenu();
  }

  /**
   * Establecer el estado de la barra lateral.
   */
  set showSideBar(value: boolean) {
    this._showSidebar.set(value);
  }

  /**
   * Establecer el estado del menú móvil.
   */
  set showMobileMenu(value: boolean) {
    this._showMobileMenu.set(value);
  }

  /**
   * Alternar la visibilidad de la barra lateral.
   */
  public toggleSidebar(): void {
    this._showSidebar.set(!this._showSidebar());
  }

  /**
   * Alternar la expansión de un menú principal.
   * @param menu El menú principal a togglear.
   */
  public toggleMenu(menu: MenuItem): void {
    this.showSideBar = true;
    menu.expanded = !menu.expanded;
  }

  /**
   * Alternar la expansión de un submenú.
   * @param submenu El submenú a togglear.
   */
  public toggleSubMenu(submenu: SubMenuItem): void {
    submenu.expanded = !submenu.expanded;
  }

  /**
   * Expandir los elementos del menú basado en la ruta activa.
   * @param items Lista de elementos del menú a expandir.
   */
  private expand(items: Array<SubMenuItem>): void {
    items.forEach((item) => {
      item.expanded = this.isActive(item.route);
      if (item.children) this.expand(item.children);
    });
  }

  /**
   * Verificar si una ruta está activa.
   * @param instruction Ruta a verificar.
   * @returns Verdadero si la ruta está activa, falso en caso contrario.
   */
  private isActive(instruction: string | undefined): boolean {
    if (!instruction) return false;
    return this.router.isActive(this.router.createUrlTree([instruction]), {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  /**
   * Filtrar los elementos del menú según el rol del usuario.
   * @param menuItems Lista completa de elementos del menú.
   * @param userRole Rol del usuario actual.
   * @returns Lista filtrada de elementos del menú.
   */
  private filterMenuByRole(menuItems: MenuItem[], userRole: Roles): MenuItem[] {
    return (
      menuItems
        .map((group) => {
          // Filtrar los children del grupo
          const filteredChildren = group.children.filter((item) => {
            // Si no hay roles definidos, mostrar el item
            if (!item.roles || item.roles.length === 0) {
              return true;
            }
            // Si el rol del usuario está incluido en los roles del item, mostrarlo
            return item.roles.includes(userRole);
          });

          // Retornar el grupo con los children filtrados
          return {
            ...group,
            children: filteredChildren.map((child) => ({
              ...child,
              // Si hay submenús, filtrar recursivamente
              children: child.children ? this.filterSubMenuByRole(child.children, userRole) : undefined,
            })),
          };
        })
        // Eliminar grupos que no tienen children después del filtrado
        .filter((group) => group.children.length > 0)
    );
  }

  /**
   * Filtrar los submenús según el rol del usuario.
   * @param subMenuItems Lista completa de submenús.
   * @param userRole Rol del usuario actual.
   * @returns Lista filtrada de submenús.
   */
  private filterSubMenuByRole(subMenuItems: SubMenuItem[], userRole: Roles): SubMenuItem[] {
    return subMenuItems
      .filter((item) => {
        if (!item.roles || item.roles.length === 0) {
          return true;
        }
        return item.roles.includes(userRole);
      })
      .map((item) => ({
        ...item,
        children: item.children ? this.filterSubMenuByRole(item.children, userRole) : undefined,
      }));
  }

  /**
   * Limpiar todas las suscripciones al destruir el servicio.
   */
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
