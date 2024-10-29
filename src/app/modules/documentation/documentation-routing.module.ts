import { NgModule } from '@angular/core';
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
        path: 'terminos',
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentationRoutingModule {}
