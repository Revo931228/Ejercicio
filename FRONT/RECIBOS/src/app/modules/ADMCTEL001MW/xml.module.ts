import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { XMLRoutingModule } from './xml-routing.module';
import { GeneracionxmlComponent } from './pages/generacionxml/generacionxml.component';
import { BlockUIModule } from 'ng-block-ui';
import { SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [GeneracionxmlComponent],
  imports: [
    CommonModule,
    FormsModule,
    XMLRoutingModule,
    SharedModule,
    BlockUIModule.forRoot(),
  ]
})
export class XMLModule { }
