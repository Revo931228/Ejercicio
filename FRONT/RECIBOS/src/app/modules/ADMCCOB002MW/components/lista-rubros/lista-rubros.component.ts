import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListaRubros } from 'src/app/models/PagosAnticipos/ListaRubros';
import { ServiciosGeneralesService } from 'src/app/services/servicios-generales.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-lista-rubros',
  templateUrl: './lista-rubros.component.html',
  styleUrls: ['./lista-rubros.component.css']
})
export class ListaRubrosComponent implements OnInit {
  ListaRubros = new Array<ListaRubros>();

  @Input() ClaveRubroValue: string;
  @Output() ClaveRubroValueChange = new EventEmitter<string>();

  constructor(public Servicios: ServiciosGeneralesService) { }

  ngOnInit(): void {
    this.getListaRubros();
  }

  getListaRubros(): void {
    this.Servicios.ListarRubros().subscribe((res: any) => {
      this.ListaRubros = res.data;
    }, (error: any) => {
      swal.fire(
        'Información',
        'Ha Ocurrio un Error al Momento de Cargar la Informacion de la lista de rubros,' +
          ' Favor de Comunicarse con el Área de Informatica y Generar un Reporte de Fallas,' +
          ' <strong>Código de Error: ' + error.error + '</strong>',
        'error'
      );
    });
  }

  changeRubro(e): void {
    this.ClaveRubroValueChange.emit(e);
  }

}
