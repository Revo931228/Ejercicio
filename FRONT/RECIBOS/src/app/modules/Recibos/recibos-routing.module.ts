import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../helpers/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { AdminRecibosComponent } from './pages/admin-recibos/admin-recibos.component';

const routes: Routes = [
  {  path: 'login', component: LoginComponent},
  {  path: 'administracion/:user', component: AdminRecibosComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecibosRoutingModule { }
