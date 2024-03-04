import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './UserManagement/components/login-form/login-form.component';
import { LandingPageComponent } from './Public/components/landing-page/landing-page.component';
import { ClientFormComponent } from './UserManagement/components/client-form/client-form.component';
import { CompanyFormComponent } from './UserManagement/components/company-form/company-form.component';
import { HistoryCardsComponent } from './BookingHistory/components/history-cards/history-cards.component';
import { CompanyTableComponent } from './CompanySearch/components/company-table/company-table.component';
import { CompanyDetailComponent } from './CompanySearch/components/company-detail/company-detail.component';
import { ClientSettingsComponent } from './UserManagement/components/client-settings/client-settings.component';
import { CompanySettingsComponent } from './UserManagement/components/company-settings/company-settings.component';
import { MembershipComponent } from './Memberships/components/membership/membership.component';
import { PaymentFormComponent } from './Memberships/components/payment-form/payment-form.component';
import { ToolbarClientComponent } from './Public/components/toolbar-client/toolbar-client.component';
import { ToolbarCompanyComponent } from './Public/components/toolbar-company/toolbar-company.component';
import { SignUpFormComponent } from "./UserManagement/components/sign-up-form/sign-up-form.component";
import { PageNotFoundComponent } from "./Public/components/page-not-found/page-not-found.component";

const routes: Routes = [
  {path: 'login', component: LoginFormComponent},
  {path: 'sign-up', component: SignUpFormComponent},
  {path: 'landing-page', component: LandingPageComponent},
  {path: 'client-form', component: ClientFormComponent},
  {path: 'company-form', component: CompanyFormComponent},
  // Rutas para el cliente
  {
    path: 'client/:id', component: ToolbarClientComponent,
    children: [
      {path: 'client-settings', component: ClientSettingsComponent},
      {path: 'company-table', component: CompanyTableComponent},
      {path: 'history-cards', component: HistoryCardsComponent},
    ]
  },

  // Rutas para la empresa
  {
    path: 'company/:id', component: ToolbarCompanyComponent,
    children: [
      {path: 'company-settings', component: CompanySettingsComponent},
      {path: 'membership', component: MembershipComponent},
      {path: 'history-cards', component: HistoryCardsComponent},
      {path: 'payment-form', component: PaymentFormComponent}
    ]
  },
  {path: '', redirectTo: '/login', pathMatch: 'full' },
  {path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
      RouterModule.forRoot(routes, {
        useHash: true,
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
