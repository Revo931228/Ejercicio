import { Component, OnInit, ViewChild } from '@angular/core';
import { TiposDocumentos } from 'src/app/models/GeneracionXML/TiposDocumentos';
import { TipoSolicitud } from 'src/app/models/GeneracionXML/TipoSolicitud';
import { Periodos } from 'src/app/models/GeneracionXML/Periodos';
import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ModalModel } from 'src/app/models/common/modalModel';
import { GridModel } from 'src/app/models/common/gridModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GeneracionxmlService } from 'src/app/services/generacionxml.service';

interface FiltrosGeneracion {
  Year: string;
  Mes: string;
  TipoDocumento: string;
  IdTipoSolicitud: string;
  NumeroOrden: string;
  NumeroTramite: string;
  TipoSolicitud: string;
  Opcion: number;
  IdPeriodo: number;
  TipoEnvio: string;
  TipoDoc: string;
}

@Component({
  selector: 'app-generacionxml',
  templateUrl: './generacionxml.component.html',
  styleUrls: ['./generacionxml.component.css']
})

export class GeneracionxmlComponent implements OnInit {

  filtro = '';
  columnGrid: any;
  periodoText = '';
  isEditableNumOrden = false;
  isEditableNumTramite = false;
  isEditableFiltroPilizas = false;

  ltsTiposDocumentos = new Array<TiposDocumentos>();
  ltsTiposSolicitud = new Array<TipoSolicitud>();
  ltsPeriodos = new Array<Periodos>();
  XML: FiltrosGeneracion = {Year: '', Mes: '', TipoDocumento: '', IdTipoSolicitud: '', NumeroOrden: '', NumeroTramite: '', TipoSolicitud: '', Opcion: 0, IdPeriodo: 0, TipoEnvio: '', TipoDoc: ''};

  @ViewChild('mdlPeriodos') modalPeriodos: ModalModel;
  @ViewChild('gridPeriodos') GridPeriodos: GridModel;

  mdlPeriodosRef: NgbModalRef;

  @BlockUI() blockUI: NgBlockUI;

  constructor(private modalService: NgbModal, public servicios: GeneracionxmlService) {
    this.columnGrid = [
      {
        headerName: 'Descripción',
        field: 'descripcion',
        flex: 4,
        minWidth: 100,
        headerClass: 'header-center header-grid-left',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Seleccionar',
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          onClick: this.SeleccionarPeriodo.bind(this),
          label: '<i class="fa fa-share"></i>',
          class: 'btn btn-primary btn-sm'
        },
        headerClass: 'header-center header-grid-right',
        cellClass: 'grid-cell-btn-center',
        flex: 1,
        minWidth: 20,
        suppressSizeToFit: true
      },
    ];
  }

  ngOnInit(): void {
    this.BuscaTiposDocumentos();
    this.BuscaTiposSolicitud();
    this.XML.TipoSolicitud = '0';
    this.XML.TipoDocumento = '0';
  }

  async GeneraXML(): Promise<void> {

    if (this.XML.IdTipoSolicitud === ''){
      Swal.fire('Información', 'Para continuar debe de seleccionar un tipo de documento', 'info');
      return;
    }

    switch (this.XML.TipoDocumento) {
      case '1': // Catalogo de Cuentas
        this.XML.Opcion = 1;
        this.XML.TipoDoc = 'CT';
        break;
      case '2': // Pólizas
          this.XML.Opcion = 3;
          this.XML.TipoDoc = 'PL';
          break;
      case '3': // Auxiliar de Polizas
          this.XML.Opcion = 4;
          this.XML.TipoDoc = 'XF';
          break;
      case '4': // Auxiliar de Cuentas
          this.XML.Opcion = 2;
          this.XML.TipoDoc = 'XC';
          break;
      case '5': // Balanza Normal
          this.XML.Opcion = 5;
          this.XML.TipoEnvio = 'N';
          this.XML.TipoDoc = 'BN';
          break;
      case '6': // Balanza Comparativa
          this.XML.Opcion = 6;
          this.XML.TipoEnvio = 'C';
          this.XML.TipoDoc = 'BC';
          break;
    }

    if (this.XML.IdPeriodo === 0){
      Swal.fire('Información', 'Para continuar debe de seleccionar un periodo', 'info');
      return;
    }

    this.blockUI.start('Generando XML...');
    this.servicios.GeneraXML(this.XML).subscribe((res: any) => {
        this.blockUI.stop();
        if (res.correcto === true){
          Swal.fire('Información', 'Se ha generado con éxito el archivo XML', 'success');
          this.LimpiarFiltros();
          this.periodoText = '';
        }
      }, (error: any) => {
        this.blockUI.stop();
        Swal.fire('Información', 'Ha ocurrido un error favor de generar un reporte de fallas: Error' + error.error, 'error');
      });

    /*const dts: any = await this.servicios.GetCuentasSinCodigoAgrupador(this.XML);
    if (dts.data.length > 0){
      Swal.fire('Información', 'No se permitirá generar el XML si existen cuentas de último nivel SIN código agrupador', 'info');
    } else {
      this.blockUI.start('Generando XML...');
      this.servicios.GeneraXML(this.XML).subscribe((res: any) => {
        this.blockUI.stop();
        if (res.data.length > 0){
          Swal.fire('Información', 'Se ha generado con éxito el archivo XML', 'success');
        }
      }, (error: any) => {
        this.blockUI.stop();
        Swal.fire('Información', 'Ha ocurrido un error favor de generar un reporte de fallas: Error' + error.error, 'error');
      });
    }*/
  }

  SeleccionarPeriodo(e: any): void {
    this.XML.Year = e.data.ejercicio;
    this.XML.Mes = e.data.nMes;
    this.XML.IdPeriodo = e.data.idPeriodo;
    this.periodoText = e.data.descripcion;
    this.closeModal();
  }

  BuscaTiposDocumentos(): void {
    this.servicios.GetTiposDocumentos().subscribe((res: any) => {
      if (res.data.length > 0){
        this.ltsTiposDocumentos = res.data;
      }
    }, (error: any) => {
      Swal.fire('Información', 'Ha ocurrido un error favor de generar un reporte de fallas: Error' + error.error, 'error');
    });
  }

  BuscaTiposSolicitud(): void {
    this.servicios.GetTiposSolicitud().subscribe((res: any) => {
      if (res.data.length > 0){
        this.ltsTiposSolicitud = res.data;
      }
    }, (error: any) => {
      Swal.fire('Información', 'Ha ocurrido un error favor de generar un reporte de fallas: Error' + error.error, 'error');
    });
  }

  BuscaPeriodos(): void {
    this.blockUI.start('Buscando Periodos / Ejercicios...');
    this.servicios.GetPeriodosEjercicios(this.filtro).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.data.length > 0){
        this.ltsPeriodos = res.data;
      } else {
        Swal.fire('Información', 'No se ha encontrado información con los filtros seleccionados', 'info');
        this.ltsPeriodos = [];
      }
    }, (error: any) => {
      this.blockUI.stop();
      Swal.fire('Información', 'Ha ocurrido un error favor de generar un reporte de fallas: Error' + error.error, 'error');
    });
  }

  ActivarFiltrosSolicitud(e: any): void {

    for (const iterator of this.ltsTiposSolicitud) {
      if (iterator.idTipoSolicitud === e){
        this.XML.IdTipoSolicitud = iterator.idTipoSolicitud.trim();
        this.XML.TipoSolicitud = iterator.clave.trim();
      }
    }

    if (e === '1' || e === '2'){
      this.isEditableNumOrden = true;
      this.isEditableNumTramite = false;
      this.XML.NumeroTramite = '';
    } else if (e === '3' || e === '4'){
      this.isEditableNumTramite = true;
      this.isEditableNumOrden = false;
      this.XML.NumeroOrden = '';
    } else {
      this.isEditableNumTramite = false;
      this.isEditableNumOrden = false;
      this.XML.NumeroOrden = '';
      this.XML.NumeroTramite = '';
    }
  }

  ActivarFiltrosPoliza(e: any): void {
    if (e === '1' || e === '5' || e === '6'){ // Si no es Poliza entra aquí.
      this.isEditableFiltroPilizas = false;
      this.XML.TipoSolicitud = '0';
      this.XML.NumeroOrden = '';
      this.XML.NumeroTramite = '';
      this.XML.IdTipoSolicitud = '0';
    } else {
      this.isEditableFiltroPilizas = true;
    }
  }

  openModal(): void {
    this.mdlPeriodosRef = this.modalService.open(this.modalPeriodos, {size: 'lg', backdrop: 'static'});
    this.mdlPeriodosRef.result.then((result) => {}, (reason) => {});
  }
  closeModal(): void {
    this.mdlPeriodosRef.close();
    this.filtro = '';

    this.ltsPeriodos = new Array<Periodos>();
  }

  LimpiarFiltros(): void {
    this.XML = {Year: '', Mes: '', TipoDocumento: '', IdTipoSolicitud: '', NumeroOrden: '', NumeroTramite: '', TipoSolicitud: '', Opcion: 0, IdPeriodo: 0, TipoEnvio: '', TipoDoc: ''} ;
    this.XML.TipoSolicitud = '0';
    this.XML.TipoDocumento = '0';
    this.periodoText = '';
  }

  KeyPressBuscarPeriodo(e): void {
    if (e.keyCode === 13) {
      this.BuscaPeriodos();
    }
  }
}


