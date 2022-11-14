import { Component, OnInit, ViewChild } from '@angular/core';
import { GridModel } from 'src/app/models/common/gridModel';
import { Monedas } from 'src/app/models/Recibos/Monedas';
import { Recibos } from 'src/app/models/Recibos/Recibos';
import { Proveedores } from 'src/app/models/Recibos/Proveedores';
import { RecibosservicesService} from 'src/app/services/recibosservices.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-recibos',
  templateUrl: './admin-recibos.component.html',
  styleUrls: ['./admin-recibos.component.css'],
  providers: [DatePipe]
})
export class AdminRecibosComponent implements OnInit {

  FiltroRecibo = 0;
  FiltroProveedores = '';
  accion = 1; // Guardar
  proveedorText = '';
  Fecha: Date;

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('grid') Grid: GridModel;
  @ViewChild('gridProveedores') GridProveedores: GridModel;
  @ViewChild('mdlRecibos') private mdlRecibos: any;
  @ViewChild('mdlProveedores') private mdlProveedores: any;

  columnGrid: any;
  columnGridProveedor: any;
  mdlReciboRef: NgbModalRef;
  mdlProveedoresRef: NgbModalRef;

  objRecibos = new Recibos();
  ltsMonedas =  new Array<Monedas>();
  ltsProveedores =  new Array<Proveedores>();

  constructor(private modalService: NgbModal, private datePipe: DatePipe, public Servicios: RecibosservicesService, private activatedRoute: ActivatedRoute, private router: Router) {

    this.columnGrid = [
      {
        headerName: 'No. Recibo',
        field: 'idRecibo',
        flex: 2,
        minWidth: 80,
        headerClass: 'header-center header-grid-left',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Fecha',
        field: 'strFecha',
        flex: 3,
        minWidth: 80,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Monto',
        field: 'monto',
        flex: 3,
        minWidth: 80,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Moneda',
        field: 'nombreMoneda',
        flex: 2,
        minWidth: 80,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Proveedor',
        field: 'nombreProveedor',
        flex: 3,
        minWidth: 80,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Usuario',
        field: 'nombreUsuario',
        flex: 3,
        minWidth: 80,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Editar',
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          onClick: this.EditarRecibo.bind(this),
          label: '<i class="fa fa-edit"></i>',
          class: 'btn btn-warning btn-sm'
        },
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-btn-center',
        flex: 3,
        minWidth: 80,
        maxWidth: 120,
        suppressSizeToFit: true
      },
      {
        headerName: 'Eliminar',
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          onClick: this.EliminarRecibo.bind(this),
          label: '<i class="fa fa-times"></i>',
          class: 'btn btn-danger btn-sm'
        },
        headerClass: 'header-center header-grid-right',
        cellClass: 'grid-cell-btn-center',
        flex: 3,
        minWidth: 80,
        maxWidth: 120,
        suppressSizeToFit: true
      }
    ];

    this.columnGridProveedor = [
      {
        headerName: 'Seleccionar',
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          onClick: this.SeleccionarProveedor.bind(this),
          label: '<i class="fa fa-check"></i>',
          class: 'btn btn-success btn-sm'
        },
        headerClass: 'header-center header-grid-left',
        cellClass: 'grid-cell-btn-center',
        flex: 2,
        minWidth: 80,
        maxWidth: 120,
        suppressSizeToFit: true
      },
      {
        headerName: 'Id Proveedor',
        field: 'idProveedor',
        flex: 2,
        minWidth: 80,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Nombre Proveedor',
        field: 'nombreProveedor',
        flex: 3,
        minWidth: 80,
        headerClass: 'header-center header-grid-right',
        cellClass: 'grid-cell-center'
      }
    ];
   }

  EditarRecibo(data: any): void {
    this.objRecibos.idRecibo = data.data.idRecibo;
    this.objRecibos.idMoneda = data.data.idMoneda;
    this.objRecibos.idProveedor = data.data.idProveedor;
    this.objRecibos.monto = Number(data.data.monto);
    const date = new Date(data.data.strFecha);
    this.objRecibos.fecha =  date.toISOString().substr(0, 10);
    this.objRecibos.comentario = data.data.comentario;
    this.proveedorText = data.data.idProveedor + ' ' + data.data.nombreProveedor;
    this.accion = 2; // Editar
    this.openModalRecibos();
  }

  EliminarRecibo(data: any): void{
    this.objRecibos.idRecibo = data.data.idRecibo;
    this.objRecibos.idMoneda = data.data.idMoneda;
    this.objRecibos.idProveedor = data.data.idProveedor;
    this.objRecibos.monto = Number(data.data.monto);
    Swal.fire({
      title: '¿Estas de acuerdo en eliminar el recibo seleccionado?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: '<i class="fa fa-undo"></i> Regresar',
      confirmButtonText: '<i class="fa fa-times"></i> Eliminar',
    }).then((result) => {
      if (result.value) {
        this.blockUI.start('Eliminando Recibo...');
        this.Servicios.EliminarRecibo(this.objRecibos).subscribe((res: any) => {
        this.blockUI.stop();
        if (res.resultados !== 0){
          Swal.fire('Información', 'Recibo eliminado con éxito', 'success');
          this.BuscarRecibos();
          this.CloseModalRecibos();
        }
      }, (error: any) => {
        this.blockUI.stop();
        Swal.fire('Información', 'Ha ocurrido un error: ' + error.error, 'error');
      });
      }
    });
  }

  SeleccionarProveedor(data: any): void{
    this.proveedorText = data.data.idProveedor + ' - ' + data.data.nombreProveedor;
    this.objRecibos.idProveedor = data.data.idProveedor;
    this.CloseModalProveedores();
  }

  ngOnInit(): void {
    const date = new Date();
    this.objRecibos.fecha =  date.toISOString().substr(0, 10);
    this.objRecibos.comentario = '';
    this.objRecibos.monto = null;
    this.objRecibos.idMoneda = 0;
    this.objRecibos.idProveedor = 0;

    this.activatedRoute.paramMap.subscribe(params => {
      this.objRecibos.idUsuario = Number(params.get('user'));
    });

    this.BuscaMonedas();
    this.BuscarRecibos();
  }

  AccionesRecibos(): void {

    if (this.objRecibos.idMoneda === 0){
      Swal.fire('Información', 'Es necesario capturar la moneda del recibo', 'info');
      return;
    }

    if (this.objRecibos.idProveedor === 0){
      Swal.fire('Información', 'Es necesario capturar la moneda del recibo', 'info');
      return;
    }

    if (Number(this.objRecibos.monto) === 0 || this.objRecibos.monto === null){
      Swal.fire('Información', 'Es necesario capturar el monto del recibo', 'info');
      return;
    }

    if (this.accion === 1){
      this.objRecibos.monto = Number(this.objRecibos.monto);
      this.blockUI.start('Guardando Recibos...');
      this.Servicios.GuardarRecibo(this.objRecibos).subscribe((res: any) => {
        this.blockUI.stop();
        if (res.resultados !== 0){
          Swal.fire('Información', 'Recibo guardado con éxito', 'success');
          this.BuscarRecibos();
          this.CloseModalRecibos();
        }
      }, (error: any) => {
        this.blockUI.stop();
        Swal.fire('Información', 'Ha ocurrido un error: ' + error.error, 'error');
      });
    }else {
      this.objRecibos.monto = Number(this.objRecibos.monto);
      this.blockUI.start('Actualizando Recibos...');
      this.Servicios.ActualizarRecibo(this.objRecibos).subscribe((res: any) => {
        this.blockUI.stop();
        if (res.resultados !== 0){
          Swal.fire('Información', 'Recibo actualizado con éxito', 'success');
          this.BuscarRecibos();
          this.CloseModalRecibos();
        }
      }, (error: any) => {
        this.blockUI.stop();
        Swal.fire('Información', 'Ha ocurrido un error: ' + error.error, 'error');
      });
    }
  }

  BuscarRecibos(): void {
    this.blockUI.start('Buscando Recibos...');
    this.Servicios.ListarRecibos(this.FiltroRecibo, this.objRecibos.idUsuario).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.data.length > 0){
        this.objRecibos.lstRecibos = res.data;
      } else {
        Swal.fire('Información', 'No se han encontrado resultados de recibos registrados.', 'info');
        this.objRecibos.lstRecibos = [];
      }
    }, (error: any) => {
      this.blockUI.stop();
      Swal.fire('Información', 'Ha ocurrido un error: ' + error.error, 'error');
    });
  }

  BuscarProveedores(): void {
    this.blockUI.start('Buscando Proveedores...');
    this.Servicios.ListarProveedores(this.FiltroProveedores).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.data.length > 0){
        this.ltsProveedores = res.data;
      } else {
        Swal.fire('Información', 'No se han encontrado resultados de proveedores.', 'info');
      }
    }, (error: any) => {
      this.blockUI.stop();
      Swal.fire('Información', 'Ha ocurrido un error: ' + error.error, 'error');
    });
  }

  BuscaMonedas(): void {
    this.blockUI.start('Buscando Monedas...');
    this.Servicios.ListarMoneda().subscribe((res: any) => {
      this.blockUI.stop();
      if (res.data.length > 0){
        this.ltsMonedas = res.data;
      } else {
        Swal.fire('Información', 'No se han encontrado resultados de monedas.', 'info');
      }
    }, (error: any) => {
      this.blockUI.stop();
      Swal.fire('Información', 'Ha ocurrido un error: ' + error.error, 'error');
    });
  }

  CambiarFecha(fecha: any): void {
    this.objRecibos.fecha = fecha;
  }

  openModalRecibos(): void {
    this.mdlReciboRef = this.modalService.open(this.mdlRecibos, {size: 'lg', backdrop: 'static'});
  }

  CloseModalRecibos(): void {
    this.objRecibos =  new Recibos();
    this.proveedorText = '';
    this.activatedRoute.paramMap.subscribe(params => {
      this.objRecibos.idUsuario = Number(params.get('user'));
    });
    this.mdlReciboRef.close();
  }

  openModalProveedores(): void {
    this.mdlProveedoresRef = this.modalService.open(this.mdlProveedores, {size: 'lg', backdrop: 'static'});
  }

  CloseModalProveedores(): void {
    this.mdlProveedoresRef.close();
    this.FiltroProveedores = '';
    this.ltsProveedores = [];
  }

  Valida(evt): boolean {
    const code = evt.which ? evt.which : evt.keyCode;
    if (code === 8) {
      return true;
    } else if ((code >= 48 && code <= 57) || code === 46) {
      return true;
    } else {
      return false;
    }
  }

  cerrarSesion(): void {
    this.router.navigate(['/recibos/login']);
  }

}
