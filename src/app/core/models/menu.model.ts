// src/app/core/models/menu.model.ts

import { Roles } from '../enums/roles.enums';

export interface MenuItem {
  group: string;
  separator?: boolean;
  children: SubMenuItem[];
  expanded?: boolean;
  active?: boolean;
  selected?: boolean;
  roles?: Roles[];
}

export interface SubMenuItem {
  icon?: string;
  label: string;
  route?: string;
  roles?: Roles[];
  expanded?: boolean;
  active?: boolean;
  children?: SubMenuItem[]; // Soporte para submenús anidados
  group?: string;
}
