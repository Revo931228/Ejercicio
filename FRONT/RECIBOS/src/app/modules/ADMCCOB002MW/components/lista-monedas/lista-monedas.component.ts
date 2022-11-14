import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListaMonedas } from 'src/app/models/PagosAnticipos/ListaMonedas';
import { ServiciosGeneralesService } from 'src/app/services/servicios-generales.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-lista-monedas',
  templateUrl: './lista-monedas.component.html',
  styleUrls: ['./lista-monedas.component.css']
})
export class ListaMonedasComponent implements OnInit {
  ListaMonedas: Array<ListaMonedas>;

  @Input() IdMonedaValue: number;
  @Input() IdMonedaDisable: boolean;
  @Output() IdMonedaValueChange = new EventEmitter<number>();

  constructor(public Servicios: ServiciosGeneralesService) { }

  ngOnInit(): void {
    this.getListaMonedas();
  }

  getListaMonedas(): void {
    this.Servicios.ListarMonedas().subscribe((res: any) => {
      this.ListaMonedas = res.data;
    }, (error: any) => {
      swal.fire(
        'Información',
        'Ha Ocurrio un Error al Momento de Cargar la Informacion de las Monedas,' +
          ' Favor de Comunicarse con el Área de Informatica y Generar un Reporte de Fallas,' +
          ' <strong>Código de Error: ' + error.error + '</strong>',
        'error'
      );
    });
  }

  changeMoneda(e): void {
    this.IdMonedaValueChange.emit(e);
  }

}
