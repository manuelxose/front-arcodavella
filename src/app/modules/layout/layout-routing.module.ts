import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { GeneralComponent } from '../general/general.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: LayoutComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'components',
    component: LayoutComponent,
    loadChildren: () => import('../uikit/uikit.module').then((m) => m.UikitModule),
  },
  {
    path: 'cooperativa',
    component: LayoutComponent,
    loadChildren: () => import('../asamblea/asamblea.module').then((m) => m.AsambleaModule),
  },
  {
    path: 'uikit',
    component: LayoutComponent,
    loadChildren: () => import('../uikit/uikit.module').then((m) => m.UikitModule),
  },
  {
    path: 'documents',
    component: LayoutComponent,
    loadChildren: () => import('../documentation/documentation.module').then((m) => m.DocumentationModule),
  },
  {
    path: 'general',
    component: LayoutComponent,
    loadChildren: () => import('../general/general.module').then((m) => m.GeneralModule),
  },

  {
    path: '**',
    redirectTo: 'errors/404',
    pathMatch: 'full',
  },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
