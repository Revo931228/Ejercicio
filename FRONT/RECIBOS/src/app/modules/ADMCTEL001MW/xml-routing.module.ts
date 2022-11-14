import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneracionxmlComponent } from './pages/generacionxml/generacionxml.component';
import {AuthGuard} from '../../helpers/auth.guard';

const routes: Routes = [
  {  path: 'generacionxml', component: GeneracionxmlComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XMLRoutingModule { }
