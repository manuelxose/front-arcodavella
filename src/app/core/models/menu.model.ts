// src/app/core/models/menu.model.ts

import { Roles } from '../enums/roles.enums';

export interface MenuItem {
  group: string;
  separator?: boolean;
  children: SubMenuItem[]; // Changed from 'items' to 'children'
}

export interface SubMenuItem {
  icon?: string;
  label: string;
  route?: string;
  roles?: Roles[];
  expanded?: boolean;
  active?: boolean;
  children?: SubMenuItem[]; // Support for nested submenus
}
