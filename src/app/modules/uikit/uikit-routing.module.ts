import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UikitComponent } from './uikit.component';
import { TableComponent } from './pages/table/table.component';
import { CreateNotificationComponent } from './pages/create-notification/create-notification.component';
import { ListingsComponent } from './pages/listings/listings.component';

const routes: Routes = [
  {
    path: '',
    component: UikitComponent,
    children: [
      { path: '', redirectTo: 'components', pathMatch: 'full' },
      { path: 'lista-socios', component: TableComponent },
      { path: 'listings', component: ListingsComponent },
      { path: 'enviar-notificaciones', component: CreateNotificationComponent },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UikitRoutingModule {}
