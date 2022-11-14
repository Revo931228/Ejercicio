import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './shared/components/auth/auth.component';
import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
  // {  path: 'auth/:module/:component/:user/:zone', component: AuthComponent },
  // {  path: 'auth/:module/:user/:zone', component: AuthComponent },
  {
    path: 'auth/:module/:component',
    component: AuthComponent
  },
  {
    path: 'auth/:module',
    component: AuthComponent
  },
  {
    path: 'admccob002mw',
    loadChildren: () => import('./modules/ADMCCOB002MW/admccob002-mw.module').then(m => m.ADMCCOB002MWModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admctel001mw',
    loadChildren: () => import('./modules/ADMCTEL001MW/xml.module').then(m => m.XMLModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'recibos',
    loadChildren: () => import('./modules/Recibos/recibos.module').then(m => m.RecibosModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
