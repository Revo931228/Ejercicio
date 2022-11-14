import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecibosRoutingModule } from './recibos-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { AdminRecibosComponent } from './pages/admin-recibos/admin-recibos.component';
import { BlockUIModule } from 'ng-block-ui';
import { SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [LoginComponent, AdminRecibosComponent],
  imports: [
    CommonModule,
    RecibosRoutingModule,
    FormsModule,
    SharedModule,
    BlockUIModule.forRoot(),
  ]
})
export class RecibosModule { }
