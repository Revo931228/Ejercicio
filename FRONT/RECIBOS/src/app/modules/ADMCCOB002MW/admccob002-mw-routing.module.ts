import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagosAnticiposComponent} from './pages/pagos-anticipos/pagos-anticipos.component';
import {AuthGuard} from '../../helpers/auth.guard';

const routes: Routes = [
  {  path: 'pagosanticipos', component: PagosAnticiposComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ADMCCOB002MWRoutingModule { }
