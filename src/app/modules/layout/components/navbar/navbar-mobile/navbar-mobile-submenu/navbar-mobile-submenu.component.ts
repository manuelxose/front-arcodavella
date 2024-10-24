import { Component, Input, OnInit } from '@angular/core';
import { MenuService } from 'src/app/modules/layout/services/menu.service';
import { SubMenuItem } from 'src/app/core/models/menu.model';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgClass, NgFor, NgTemplateOutlet } from '@angular/common';
import { SidebarSubmenuComponent } from '../../../sidebar/sidebar-submenu/sidebar-submenu.component';

@Component({
  selector: 'app-navbar-mobile-submenu',
  templateUrl: './navbar-mobile-submenu.component.html',
  styleUrls: ['./navbar-mobile-submenu.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgFor,
    NgTemplateOutlet,
    RouterLinkActive,
    RouterLink,
    AngularSvgIconModule,
    SidebarSubmenuComponent,
  ],
})
export class NavbarMobileSubmenuComponent implements OnInit {
  @Input() public submenu!: SubMenuItem;

  constructor(public menuService: MenuService) {}

  ngOnInit(): void {}

  public toggleMenu(menu: SubMenuItem): void {
    this.menuService.toggleSubMenu(menu);
  }

  private collapse(items: Array<any>) {
    items.forEach((item) => {
      item.expanded = false;
      if (item.children) this.collapse(item.children);
    });
  }

  public closeMobileMenu() {
    this.menuService.showMobileMenu = false;
  }
}
