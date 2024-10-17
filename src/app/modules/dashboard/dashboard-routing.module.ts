import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { OverViewComponent } from './pages/overview/overwiew.component';
import { AdminProfileComponent } from './pages/admin-profile/admin-profile.component';
import { MemberProfileComponent } from './pages/member-profile/member-profile.component';
import { DocumentosComponent } from './pages/documentos/documentos.component';
import { WpPostComponent } from './pages/wp-post/wp-post.component';
import { PromotionComponent } from './pages/promotion/promotion.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { DocumentViewerComponent } from './pages/document-viewer/document-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverViewComponent },
      { path: 'profile', component: AdminProfileComponent },
      { path: 'member-profile', component: MemberProfileComponent },
      { path: 'documentos', component: DocumentosComponent },
      { path: 'notificaciones', component: NotificacionesComponent },
      { path: 'promotion', component: PromotionComponent },
      { path: 'blog', component: WpPostComponent },
      { path: 'view-documents', component: DocumentViewerComponent },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
