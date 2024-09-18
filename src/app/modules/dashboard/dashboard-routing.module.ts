import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { NftComponent } from './pages/nft/nft.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MemberProfileComponent } from './pages/member-profile/member-profile.component';
import { DocumentosComponent } from './pages/documentos/documentos.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'nfts', pathMatch: 'full' },
      { path: 'nfts', component: NftComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'member-profile', component: MemberProfileComponent },
      { path: 'documentos', component: DocumentosComponent },
      { path: 'notificaciones', component: NotificacionesComponent },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
