import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TiposMovimientos } from 'src/app/models/PagosAnticipos/TiposMovimientos';
import { ServiciosGeneralesService } from 'src/app/services/servicios-generales.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-movimientos',
  templateUrl: './tipo-movimientos.component.html',
  styleUrls: ['./tipo-movimientos.component.css']
})
export class TipoMovimientosComponent implements OnInit {
  ListaTiposMovimientos: Array<TiposMovimientos>;

  @Input() IdTipoMovimientoValue: number;
  @Input() Disable: boolean;
  @Output() IdTipoMovimientoValueChange = new EventEmitter<number>();

  constructor(public Servicios: ServiciosGeneralesService) { }

  ngOnInit(): void {
    this.getTipoMovimientos();
  }

  getTipoMovimientos(): void {
    this.Servicios.ListarTiposMovimientos().subscribe((res: any) => {
      this.ListaTiposMovimientos = res.data;
    }, (error: any) => {
      swal.fire(
        'Información',
        'Ha Ocurrio un Error al Momento de Cargar la Informacion de tipos de movimientos,' +
          ' Favor de Comunicarse con el Área de Informatica y Generar un Reporte de Fallas,' +
          ' <strong>Código de Error: ' + error.error + '</strong>',
        'error'
      );
    });
  }

  changeTipoMovimiento(e): void {
    this.IdTipoMovimientoValueChange.emit(e);
  }

}
