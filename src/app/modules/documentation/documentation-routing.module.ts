import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TermsConditionsComponent } from './pages/terms-conditions/terms-conditions.component';
import { DocumentationComponent } from './documentation.component';
import { CookiesComponent } from './pages/cookies/cookies.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentationComponent,
    children: [
      {
        path: '',
        redirectTo: 'terms-conditions',
        pathMatch: 'full',
      },
      {
        path: 'terms-conditions',
        component: TermsConditionsComponent,
      },
      {
        path: 'politica-cookies',
        component: CookiesComponent,
      },
      {
        path: 'politica-privacidad',
        component: PrivacyComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentationRoutingModule {}
