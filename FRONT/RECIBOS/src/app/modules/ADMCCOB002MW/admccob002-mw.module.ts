import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ADMCCOB002MWRoutingModule } from './admccob002-mw-routing.module';
import { SharedModule} from '../../shared/shared.module';
import { PagosAnticiposComponent } from './pages/pagos-anticipos/pagos-anticipos.component';
import { FormsModule } from '@angular/forms';
import { ListaMonedasComponent } from './components/lista-monedas/lista-monedas.component';
import { ListaRubrosComponent } from './components/lista-rubros/lista-rubros.component';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
  declarations: [PagosAnticiposComponent, ListaMonedasComponent, ListaRubrosComponent],
  imports: [
    CommonModule,
    FormsModule,
    ADMCCOB002MWRoutingModule,
    SharedModule,
    BlockUIModule.forRoot(),
  ]
})
export class ADMCCOB002MWModule { }
