import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/layout/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'errors',
    loadChildren: () => import('./modules/error/error.module').then((m) => m.ErrorModule),
  },
  {
    path: 'cooperativa',
    loadChildren: () => import('./modules/asamblea/asamblea.module').then((m) => m.AsambleaModule),
  },
  {
    path: 'documents',
    loadChildren: () => import('./modules/documentation/documentation.module').then((m) => m.DocumentationModule),
  },
  {
    path: 'uikit',
    loadChildren: () => import('./modules/uikit/uikit.module').then((m) => m.UikitModule),
  },
  {
    path: 'general',
    loadChildren: () => import('./modules/general/general.module').then((m) => m.GeneralModule),
  },
  { path: '**', redirectTo: 'errors/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
