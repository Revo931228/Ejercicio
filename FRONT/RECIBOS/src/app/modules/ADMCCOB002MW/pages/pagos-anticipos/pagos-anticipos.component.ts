import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridModel } from 'src/app/models/common/gridModel';
import { ModalModel } from 'src/app/models/common/modalModel';
import { PagosAnticipos } from 'src/app/models/PagosAnticipos/PagosAnticipos';
import { ListaMovimientosCliente } from 'src/app/models/PagosAnticipos/ListaMovimientosClientes';
import { Depositos } from 'src/app/models/PagosAnticipos/Depositos';
import { CuentasContables } from 'src/app/models/PagosAnticipos/CuentasContables';
import { CuentasExcedentes } from 'src/app/models/PagosAnticipos/CuentasExcedentes';
import { Polizas } from 'src/app/models/PagosAnticipos/Polizas';
import { Pagos } from 'src/app/models/PagosAnticipos/Pagos';
import { CuentasContableRepetitivo } from 'src/app/models/PagosAnticipos/CuentasContableRepetitivo';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ServiciosGeneralesService } from 'src/app/services/servicios-generales.service';
import swal from 'sweetalert2';
import {result, uniqBy } from 'lodash-es';
import { Admccobdat003 } from 'src/app/models/PagosAnticipos/admccobdat003';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ThisReceiver } from '@angular/compiler';
import { textChangeRangeIsUnchanged } from 'typescript';

interface FiltroPag {
  startRow: string;
  endRow: string;
}

interface FiltrosDepositos {
  idCliente: string;
  noCuenta: string;
  claveRubro: string;
  fechaIncio: string;
  fechaFin: string;
  referencia: string;
  todos: boolean;
  todosPendientes: boolean;
  opcion: number;
}

interface MdlCuentasContables {
  numeroCuenta: string;
  nombreCuenta: string;
  cargo: number;
  abono: number;
  concepto: string;
  id: number;
}

interface MdlDatosModificar {
  documento: string;
  tipoCambio: number;
  importe: number;
  importeMN: number;
  idCliente: string;
  nomCliente: string;
  moneda: number;
  cancelado: number;
  nombreMoneda: string;
  idTipoCartera: number;
  nomTipoCartera: string;
  idTipoMovimiento: string;
  fecha: string;
  cuentaBanco: string;
  cheque: string;
  folioMovimiento: string;
  cfdiPagos: number;
  folio: number;
  id: number;
}

interface MdlDatosAplicar{
  fecha: string;
  tipoCambio: number;
  abono: number;
  idCliente: string;
  nombreCliente: string;
  moneda: number;
  nombreMoneda: string;
  cancelado: number;
  documento: string;
  cuentaBanco: string;
  idTipoCartera: number;
  nomTipoCartera: string;
  idTipoMovto: number;
  folioMovto: number;
  nacExpPit: string;
  rfc: string;
  cfdiPagos: number;
  repetitivo: string;
  folioExportado: number;
}

@Component({
  selector: 'app-pagos-anticipos',
  templateUrl: './pagos-anticipos.component.html',
  styleUrls: ['./pagos-anticipos.component.css'],
  providers: [DatePipe]
})
export class PagosAnticiposComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  Fecha: Date = new Date();
  FechaInicio: Date = new Date(this.Fecha.getFullYear(), this.Fecha.getMonth(), 1);
  FechaFin: Date = new Date();

  FechaDeposito: Date = new Date();
  FechaPago: Date = new Date();
  FechaIngreso: Date = new Date();

  filtrosPag: FiltroPag = {startRow: '0', endRow: '9999999'};
  filtrosDep: FiltrosDepositos = {idCliente: null, noCuenta: null, claveRubro: null, fechaIncio: this.datePipe.transform(this.FechaInicio, 'yyyy-MM-dd'), fechaFin: this.datePipe.transform(this.FechaFin, 'yyyy-MM-dd'), referencia: null, todos: false, todosPendientes: false, opcion: 6};
  datosCuenta: MdlCuentasContables = {numeroCuenta: '', nombreCuenta: '', cargo: 0, abono: 0, concepto: '', id: 0};
  datosModificar: MdlDatosModificar = {id: 0, folio: 0, documento: '', tipoCambio: 1, importe: 0, importeMN: 0, idCliente: '', nomCliente: '', moneda: 100, cancelado: 0, nombreMoneda: '', idTipoCartera: 0, nomTipoCartera: '', idTipoMovimiento: '', fecha: '', cuentaBanco: '', cheque: '', folioMovimiento: '', cfdiPagos: 0};
  datosAplicar: MdlDatosAplicar = {fecha: '', tipoCambio: 1, abono: 0, idCliente: '', nombreCliente: '', moneda: 1000, nombreMoneda: '', cancelado: 0, documento: '', cuentaBanco: '', idTipoCartera: 0, nomTipoCartera: '', idTipoMovto: 0, folioMovto: 0, nacExpPit: '', rfc: '', cfdiPagos: 0, repetitivo: '', folioExportado: 0};

  @ViewChild('gridFacturas') GridFacturas: GridModel;
  @ViewChild('gridFacturasAplicar') GridFacturasAplicar: GridModel;
  @ViewChild('gridPoliza') GridPoliza: GridModel;
  @ViewChild('gridDepositos') GridDepositosBancarios: GridModel;

  @ViewChild('modalClientes') modalClientes: ModalModel;
  @ViewChild('modalDepositosBancarios') modalDepositos: ModalModel;
  @ViewChild('modalModImporteFactura') modalModImporteFactura: ModalModel;
  @ViewChild('modalAgregarPoliza') modalAgregarPoliza: ModalModel;
  @ViewChild('modalSigma') modalSigma: ModalModel;
  @ViewChild('modalCuentasExcedentes') modalCuentasExcedentes: ModalModel;
  @ViewChild('modalModificacionMovimientos') modalModificacionMovimientos: ModalModel;
  @ViewChild('modalEliminarPagos') modalEliminarPagos: ModalModel;
  @ViewChild('modalAplicar') modalAplicar: ModalModel;
  @ViewChild('modalDesAplicar') modalDesAplicar: ModalModel;


  @ViewChild('contModalClientes') contModalClientes: any;

  DatosPagosAnticipos = new PagosAnticipos();
  DatosFacturas = new Admccobdat003();
  CuentasContables = new CuentasContables();
  DatosAplicar = new Pagos();
  ListaMovimientosCliente = new Array<ListaMovimientosCliente>();
  ListaDepositos =  new Array<Depositos>();
  ListaPoliza =  new Polizas();
  ListaCuentaContableRepetitivo = new Array<CuentasContableRepetitivo>();
  ltsCuentasExcendentes = new Array<CuentasExcedentes>();
  columnGridFacturas: any;
  columnGridFacturasAplicar: any;
  columnGridPoliza: any;
  columnGridDepositosBancarios: any;

  mdlFolioFactura = '';
  mdlFacturaImporteMN = 0;
  mdlFacturaDolares = 0;
  mdlFacturaTipoCambio = 0;
  mdlFacturaImporteMNIsDisable = false;
  mdlFacturaDolaresIsDisable = false;
  mdlFacturaTipoCambioIsDisable = false;

  tabSelected: any;

  idCuentaExcedente = '';
  idTipoMovimiento = 0;
  idTipoMoneda = 0;
  claveRubro = '';

  IdTipoCartera: number;
  IvaContable = 0;
  IvaFiscal = 0;
  IvaFluctuacion = 0;
  cuentaDocxCobrar = '';
  defDocxCobrar = '';
  IrAPoliza: boolean;
  Papel = '';
  CtaContable = '';
  NombreCuenta = '';
  chkFluctuacion = true;
  txtRepFluct = '';
  ctaExcedente = '';
  NomCtaExcedente = '';
  Excedente = false;
  cantExcedente = 0;
  intCFDIC = 0;
  intFolExp = 0;

  clienteText = '';
  Accion = 'AGREGAR';
  IsDisable = true;
  DisableCargo = true;
  DisableAbono = true;
  DesabilitarFiltrosDepositos = true;
  DisableTipoMovimiento = false;
  relacionar = false;

  MonedaPago = 100; // Quiere decir que una no se ha asignado un valor a la moneda del pago.
  NombreMoneda = '';
  NombreBanco = '';
  CuentaBanco = '';
  MonedaDeposito = '';

  LabCargo = 0;
  LabAbono = 0;
  LabDif = 0;
  LabMN0 = 0;
  LabMN1 = 0;
  LabMN2 = 0;


  listaClientes = [];
  listaDolares = [];
  listaPesos = [];
  listaCuentaBanco = [];
  listaReferencias = [];

  constructor(private datePipe: DatePipe, public Servicios: ServiciosGeneralesService) {
    this.FechaInicio =  new Date(this.Fecha.getFullYear(), this.Fecha.getMonth(), 1);
    this.FechaFin =  new Date();

    this.columnGridFacturas = [
      {
        headerName: '',
        field: 'isSeleccionado',
        flex: 1,
        minWidth: 50,
        headerClass: 'header-center header-grid-left',
        cellClass: 'grid-cell-center',
        cellRenderer: 'chkCellRenderer',
        cellRendererParams: {
          change: this.gridSeleccionarFacturas.bind(this)
        },
        editable: false
      },
      {
        headerName: 'Factura',
        field: 'documento',
        flex: 4,
        minWidth: 90,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Dolares',
        field: 'dolares',
        flex: 4,
        minWidth: 80,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'M.N.',
        field: 'monedaNacional',
        flex: 4,
        minWidth: 120,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center',
        cellRendererParams: {
          type: 'num'
        }
      },
      {
        headerName: 'Tipo Cambio',
        field: 'tipoCambio',
        flex: 4,
        minWidth: 120,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        flex: 4,
        minWidth: 110,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'NEP',
        field: 'nacExpPit',
        flex: 2,
        minWidth: 60,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Importe IVA',
        field: 'importeIVA',
        flex: 4,
        minWidth: 120,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Importe Retención',
        field: 'importeRetencion',
        flex: 4,
        minWidth: 170,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Importe Total',
        field: 'importeTotal',
        flex: 4,
        minWidth: 120,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Tasa IVA',
        field: 'iva',
        flex: 4,
        minWidth: 80,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Editar',
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          onClick: this.gridModificarImporte.bind(this),
          label: '<i class="fa fa-edit"></i>',
          class: 'btn btn-edit btn-sm'
        },
        headerClass: 'header-center header-grid-right',
        cellClass: 'grid-cell-btn-center',
        flex: 1,
        minWidth: 70,
        maxWidth: 70,
        suppressSizeToFit: true
      }
    ];

    this.columnGridFacturasAplicar = [
      {
        headerName: '',
        field: 'isSeleccionado',
        flex: 1,
        minWidth: 50,
        headerClass: 'header-center header-grid-left',
        cellClass: 'grid-cell-center',
        cellRenderer: 'chkCellRenderer',
        cellRendererParams: {
          change: this.gridSeleccionarFacturas.bind(this)
        },
        editable: false
      },
      {
        headerName: 'Factura',
        field: 'documento',
        flex: 4,
        minWidth: 90,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Dolares',
        field: 'dolares',
        flex: 4,
        minWidth: 80,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'M.N.',
        field: 'monedaNacional',
        flex: 4,
        minWidth: 120,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center',
        cellRendererParams: {
          type: 'num'
        }
      },
      {
        headerName: 'Tipo Cambio',
        field: 'tipoCambio',
        flex: 4,
        minWidth: 120,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        flex: 4,
        minWidth: 110,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'NEP',
        field: 'nacExpPit',
        flex: 2,
        minWidth: 60,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Importe IVA',
        field: 'importeIVA',
        flex: 4,
        minWidth: 120,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Importe Retención',
        field: 'importeRetencion',
        flex: 4,
        minWidth: 170,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Importe Total',
        field: 'importeTotal',
        flex: 4,
        minWidth: 120,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Tasa IVA',
        field: 'iva',
        flex: 4,
        minWidth: 80,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Editar',
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          onClick: this.gridModificarImporte.bind(this),
          label: '<i class="fa fa-edit"></i>',
          class: 'btn btn-edit btn-sm'
        },
        headerClass: 'header-center header-grid-right',
        cellClass: 'grid-cell-btn-center',
        flex: 1,
        minWidth: 70,
        maxWidth: 70,
        suppressSizeToFit: true
      }
    ];

    this.columnGridPoliza = [
      {
        headerName: 'Cuenta',
        field: 'numeroCuenta',
        flex: 2,
        minWidth: 80,
        headerClass: 'header-center header-grid-left',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Nombre',
        field: 'nombreCuenta',
        flex: 4,
        minWidth: 80,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Cargo',
        field: 'cargo',
        flex: 2,
        minWidth: 50,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Abono',
        field: 'abono',
        flex: 2,
        minWidth: 50,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Concepto',
        field: 'concepto',
        flex: 4,
        minWidth: 80,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Editar',
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          onClick: this.gridEditarPoliza.bind(this),
          label: '<i class="far fa-edit"></i>',
          class: 'btn btn-warning btn-sm'
        },
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-btn-center',
        flex: 1,
        minWidth: 60,
        suppressSizeToFit: true
      },
      {
        headerName: 'Eliminar',
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          onClick: this.gridEliminarPoliza.bind(this),
          label: '<i class="fa fa-times"></i>',
          class: 'btn btn-danger btn-sm'
        },
        headerClass: 'header-center header-grid-right',
        cellClass: 'grid-cell-btn-center',
        flex: 1,
        minWidth: 60,
        suppressSizeToFit: true
      }
    ];

    this.columnGridDepositosBancarios = [
      {
        headerName: 'Seleccionar',
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          onClick: this.gridSeleccionarDeposito.bind(this),
          label: '<i class="far fa-hand-pointer"></i>',
          class: 'btn btn-success btn-sm'
        },
        headerClass: 'header-center header-grid-left',
        cellClass: 'grid-cell-btn-center',
        flex: 5,
        minWidth: 120,
        maxWidth: 120,
        suppressSizeToFit: true
      },
      {
        headerName: 'Fecha Deposito',
        field: 'fecha',
        flex: 4,
        minWidth: 150,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Folio',
        field: 'folio',
        flex: 4,
        minWidth: 80,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'No. Operación',
        field: 'noOperacion',
        flex: 4,
        minWidth: 130,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Forma de Pago',
        field: 'formaPago',
        flex: 4,
        minWidth: 140,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Concepto/Referencia',
        field: 'concepto',
        flex: 4,
        minWidth: 180,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Cliente',
        field: 'nombre',
        flex: 4,
        minWidth: 250,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Dolares',
        field: 'dolares',
        flex: 4,
        minWidth: 100,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Pesos',
        field: 'pesos',
        flex: 4,
        minWidth: 100,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Total',
        field: 'total',
        flex: 4,
        minWidth: 120,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Cuenta Banco',
        field: 'numeroCuenta',
        flex: 4,
        minWidth: 140,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Nombre Banco',
        field: 'nombreBanco',
        flex: 4,
        minWidth: 160,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Referencia',
        field: 'referencia',
        flex: 4,
        minWidth: 110,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Suc.',
        field: 'sucursal',
        flex: 4,
        minWidth: 80,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'T.C.',
        field: 'tipoCambioDeposito',
        flex: 4,
        minWidth: 100,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Importe',
        field: 'importe',
        flex: 4,
        minWidth: 120,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Moneda',
        field: 'nombreMoneda',
        flex: 4,
        minWidth: 100,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Nombre Banco Ordenante',
        field: 'nombreBancoOrdenante',
        flex: 4,
        minWidth: 200,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'RFC Banco Ordenante',
        field: 'rfcBancoOrdenante',
        flex: 4,
        minWidth: 200,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'No. Cuenta Banco Ordenante',
        field: 'noCuentaBancoOrdenante',
        flex: 4,
        minWidth: 200,
        headerClass: 'header-center header-grid-right',
        cellClass: 'grid-cell-center'
      }
    ];


   }
   gridSeleccionarDeposito(data: any): void {
    // Información del Depósito
    this.DatosPagosAnticipos.deposito = data.data.folio;
    this.DatosPagosAnticipos.importePagoDesposito = data.data.importe;
    this.DatosPagosAnticipos.monedaDeposito = data.data.monedaDeposito + ' ' + data.data.nombreMoneda;
    this.DatosPagosAnticipos.tipoCambioDeposito = data.data.tipoCambioDeposito;
    this.DatosPagosAnticipos.importeMNDeposito = data.data.total;
    this.DatosPagosAnticipos.saldoDeposito = data.data.saldo;
    this.DatosPagosAnticipos.saldoMNDeposito = data.data.total;
    this.DatosPagosAnticipos.fechaDeposito =  data.data.fechaCapturaDeposito;
    this.FechaDeposito = new Date(this.DatosPagosAnticipos.fechaDeposito);

    // Información del Pago
    this.DatosPagosAnticipos.cuentaBanco = data.data.numeroCuenta;
    this.DatosPagosAnticipos.monedaPago = data.data.monedaDeposito;
    this.idTipoMoneda = this.DatosPagosAnticipos.monedaPago;
    this.DatosPagosAnticipos.tipoCambioPago = data.data.tipoCambioDeposito;
    this.DatosPagosAnticipos.importePago = data.data.importe;
    this.DatosPagosAnticipos.importeMNPago = data.data.total;
    this.DatosPagosAnticipos.fechaPago = data.data.fechaCapturaDeposito;
    this.FechaPago = new Date(this.DatosPagosAnticipos.fechaPago);
    this.DatosPagosAnticipos.fechaIngreso = data.data.fechaCapturaDeposito;
    this.FechaIngreso = new Date(this.DatosPagosAnticipos.fechaIngreso);

    this.DatosAplicar.idPago = 0;


    this.closeModalDepositos();
    this.changeCuentaBanco(this.DatosPagosAnticipos.cuentaBanco);
   }
   gridSeleccionarFacturas(data: any): void{
   }
   gridModificarImporte(data: any): void{
     this.mdlFacturaDolares = data.data.dolares;
     this.mdlFacturaImporteMN = data.data.monedaNacional;
     this.mdlFacturaTipoCambio = data.data.tipoCambio;
     this.mdlFolioFactura  = data.data.documento;

     if (data.data.tipoCambio === 1){
      this.mdlFacturaImporteMNIsDisable = false;
      this.mdlFacturaDolaresIsDisable = true;
      this.mdlFacturaTipoCambioIsDisable = true;
     } else {
      this.mdlFacturaImporteMNIsDisable = true;
      this.mdlFacturaDolaresIsDisable = false;
      this.mdlFacturaTipoCambioIsDisable = true;
     }

     this.modalModImporteFactura.openModal();
   }
   gridEditarPoliza(data: any): void {
    this.Accion = 'MODIFICACION';
    this.datosCuenta = data.data;
    this.openModalAgregarPoliza();
   }
   gridEliminarPoliza(data: any): void {
    swal.fire({
      title: '¿Estas de acuerdo en eliminar la póliza seleccionada?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: '<i class="fa fa-undo"></i> Regresar',
      confirmButtonText: '<i class="fa fa-times"></i> Eliminar',
    }).then((result) => {
      if (result.value) {
        for (let index = 0; index < this.ListaPoliza.ListaPolizas.length; index++) {
          if (this.ListaPoliza.ListaPolizas[index].id === data.data.id){
            this.ListaPoliza.ListaPolizas.splice(index, 1);
            this.GridPoliza.refreshData();
            this.TotalesCargoAbono();
          }
        }
      }
    });
   }

  ngOnInit(): void {
    this.ListaPoliza.ListaPolizas = [];
    this.DatosPagosAnticipos.idTipoMovto = 0;
    this.DatosPagosAnticipos.importePagoDesposito = 0.00;
    this.DatosPagosAnticipos.tipoCambioDeposito = 1;
    this.DatosPagosAnticipos.importeMNDeposito = 0.00;
    this.DatosPagosAnticipos.saldoDeposito = 0.00;
    this.DatosPagosAnticipos.saldoMNDeposito = 0.00;
    this.DatosPagosAnticipos.tipoCambioPago = 1.0000;
    this.DatosPagosAnticipos.importePago = 0.00;
    this.DatosPagosAnticipos.importeMNPago = 0.00;
    this.DatosPagosAnticipos.totalAbono = 0;
    this.DatosPagosAnticipos.totalCargo = 0;
    this.DatosPagosAnticipos.cuentaBanco = '';
    this.DatosPagosAnticipos.DatosFactura = [];

    this.DatosAplicar = new Pagos();
    this.DatosAplicar.idPago = 0;
    this.DatosAplicar.folioPago = 0;
    this.GetCuentasExedentes();
  }

  async changeTab(e: any): Promise<void>{
    if (e === 1){
      this.CargaPolizas();
    } else {
      this.ListaPoliza.ListaPolizas = [];
      this.GridPoliza.refreshData();
    }
  }

  async CargaPolizas(): Promise<void> {
    let tieneFac = false;
    let saldoCargos = 0;
    let impASumar = 0;
    let SubTotal = 0;
    let PoD = 2;
    let IVA = 0;

    // Navojoa
    let CantN01 = 0;
    let CantP01 = 0;
    let CantE01 = 0;
    let CantNPap01 = 0;

    // Tijuana
    let CantN02 = 0;
    let CantP02 = 0;
    let CantE02 = 0;

    // Hermosillo
    let CantN05 = 0;
    let CantP05 = 0;
    let CantE05 = 0;

    let sumAbonos = 0;

    if (this.DatosPagosAnticipos.repetitivo === ''){
      swal.fire('Información', 'Debe de captura el campo repetitivo para continuar', 'info');
      return;
    }
    if (this.DatosPagosAnticipos.cuentaBanco === ''){
      swal.fire('Información', 'Debe de captura el numero de cuenta para continuar', 'info');
      return;
    }

    // Obtiene SERIE PAPEL

    const val: any = await this.Servicios.GetCuentasContablesAsync(this.CuentaBanco.trim());
    if (val.data.length <= 0 || val.data === null) {
      swal.fire('Información', 'No se encontró el número de cuenta', 'info');
      return;
    }

    this.LimpiarDatosCuenta();
    this.NombreCuenta = val.data[0].nombreCuenta;
    this.datosCuenta.numeroCuenta = this.CuentaBanco;
    this.datosCuenta.nombreCuenta = this.NombreCuenta.trim();
    this.datosCuenta.cargo = this.DatosPagosAnticipos.importeMNPago;
    this.datosCuenta.abono = 0;
    this.datosCuenta.concepto = this.clienteText;
    this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
    this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
    this.GridPoliza.refreshData();

    saldoCargos = Number(this.DatosPagosAnticipos.importeMNPago);

    const datos: any = await this.Servicios.GetCuentasContablesDeRepetitivo(this.DatosPagosAnticipos.repetitivo.trim(), 'Total');
    if (datos.data.length > 0){
      this.ListaCuentaContableRepetitivo = [];
      datos.data.forEach(element => {
        this.ListaCuentaContableRepetitivo.push({
          repetitivo: element.repetitivo,
          tipo: element.tipo,
          concepto: element.concepto,
          ctaN1: element.ctaN1,
          ctaN2: element.ctaN2,
          ctaN3: element.ctaN3,
          ctaN4: element.ctaN4,
          ctaN5: element.ctaN5,
          cargo: element.cargo,
          abono: element.abono,
          nombreConcepto: element.nombreConcepto,
          num: element.num,
          indMaq: element.indMaq,
          descripcion: element.descripcion,
          zona: element.zona,
          claveIva: element.claveIva,
          numeroCuenta: element.numeroCuenta
        });
      });
    } else {
      swal.fire('información', 'No se ha encontrado la cuenta para el cliente seleccionado', 'info');
      this.IrAPoliza = true;
      return;
    }

    this.CtaContable = this.ListaCuentaContableRepetitivo[0].numeroCuenta.trim();

    const val2: any = await this.Servicios.GetCuentasContablesAsync(this.ListaCuentaContableRepetitivo[0].numeroCuenta.trim());
    if (val2.data.length <= 0 || val2.data === null) {
      swal.fire('Información', 'No se encontro el numero de cuenta', 'info');
    }
    this.NombreCuenta = val2.data[0].nombreCuenta;

    switch (this.DatosPagosAnticipos.monedaPago)
    {
      case 0: {
        PoD = 2;
        break;
      }
      case 1: {
        PoD = 1;
        break;
      }
    }

    for (const iterator of this.ListaMovimientosCliente) {
      if (iterator.isSeleccionado === true){
        if (!tieneFac) {
          tieneFac = true;
        }

        if (saldoCargos <= 0){break; }

        if (saldoCargos >= (iterator.dolares * this.DatosPagosAnticipos.tipoCambioPago)) {
          impASumar = iterator.dolares * this.DatosPagosAnticipos.tipoCambioPago;
        }else {
          impASumar = saldoCargos;
        }

        SubTotal = iterator.dolares / (iterator.iva + 1);

        IVA = SubTotal * iterator.iva;

        this.IvaContable = this.IvaContable + IVA;
        this.IvaFiscal = this.IvaFiscal + IVA;
        this.IvaFluctuacion = (this.IvaContable - this.IvaFiscal);

        if (iterator.documento.indexOf('P') > 0 || iterator.documento.indexOf('P') > 0 ||  iterator.documento.indexOf('PG') > 0) {
          CantNPap01 = CantNPap01 + impASumar;
          saldoCargos = saldoCargos - impASumar;
          this.Papel = 'Si';
        } else {
          switch (iterator.nacExpPit.trim() + iterator.zona.trim()){
            case 'N01': {
              CantN01 = CantN01 + impASumar;
              saldoCargos = saldoCargos - impASumar;
              break;
            }
            case 'P01': {
              CantP01 = CantP01 + impASumar;
              saldoCargos = saldoCargos - impASumar;
              break;
            }
            case 'E01': {
              CantE01 = CantE01 + impASumar;
              saldoCargos = saldoCargos - impASumar;
              break;
            }
            case 'N02': {
              CantN02 = CantN02 + impASumar;
              saldoCargos = saldoCargos - impASumar;
              break;
            }
            case 'P02': {
              CantP02 = CantP02 + impASumar;
              saldoCargos = saldoCargos - impASumar;
              break;
            }
            case 'E02': {
              CantE02 = CantE02 + impASumar;
              saldoCargos = saldoCargos - impASumar;
              break;
            }
            case 'N05': {
              CantN05 = CantN05 + impASumar;
              saldoCargos = saldoCargos - impASumar;
              break;
            }
            case 'P05': {
              CantP05 = CantP05 + impASumar;
              saldoCargos = saldoCargos - impASumar;
              break;
            }
            case 'E05': {
              CantE05 = CantE05 + impASumar;
              saldoCargos = saldoCargos - impASumar;
              break;
            }
          }
        }

        sumAbonos = CantN01 + CantP01 + CantE01 + CantN02 + CantP02 + CantE02 + CantNPap01 + CantN05 + CantP05 + CantE05;

        // AQUI AGREGA LOS DATOS A LA LISTA DE LAS POLIZA
        let Accion = false;
        this.datosCuenta = {numeroCuenta: '', nombreCuenta: '', cargo: 0, abono: 0, concepto: '', id: 0};

        if (!tieneFac){
          if (this.cuentaDocxCobrar !== ''){
            this.datosCuenta.numeroCuenta = this.cuentaDocxCobrar.trim();
            this.datosCuenta.nombreCuenta = this.defDocxCobrar.trim();
          }else {
            this.datosCuenta.numeroCuenta = this.CtaContable;
            this.datosCuenta.nombreCuenta = this.NombreCuenta;
          }
          this.datosCuenta.cargo = 0;
          this.datosCuenta.abono = this.DatosPagosAnticipos.importeMNPago;
          this.datosCuenta.concepto =  this.clienteText;
          this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
          this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
          this.IrAPoliza = false;
        } else {
          if (CantNPap01 > 0){
            this.LimpiarDatosCuenta();
            if (this.cuentaDocxCobrar.trim() !== '' && Accion === false){
              this.datosCuenta.numeroCuenta = this.cuentaDocxCobrar.trim();
              this.datosCuenta.nombreCuenta = this.defDocxCobrar.trim();
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = this.DatosPagosAnticipos.importeMNPago;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
              Accion = true;
            } else {
              this.datosCuenta.numeroCuenta = this.CtaContable;
              this.datosCuenta.nombreCuenta = this.NombreCuenta;
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = CantNPap01;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
            }
          }
          if (CantN01 > 0){
            this.LimpiarDatosCuenta();
            if (this.cuentaDocxCobrar.trim() !== '' && Accion === false){
              this.datosCuenta.numeroCuenta = this.cuentaDocxCobrar.trim();
              this.datosCuenta.nombreCuenta = this.defDocxCobrar.trim();
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = this.DatosPagosAnticipos.importeMNPago;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
              Accion = true;
            } else {
              this.datosCuenta.numeroCuenta = this.DatosPagosAnticipos.cuentaBanco;
              this.datosCuenta.nombreCuenta = this.DatosPagosAnticipos.cuentaBanco;
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = CantN01;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
            }
          }
          if (CantP01 > 0){
            this.LimpiarDatosCuenta();
            if (this.cuentaDocxCobrar.trim() !== '' && Accion === false){
              this.datosCuenta.numeroCuenta = this.cuentaDocxCobrar.trim();
              this.datosCuenta.nombreCuenta = this.defDocxCobrar.trim();
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = this.DatosPagosAnticipos.importeMNPago;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
              Accion = true;
            } else {
              this.datosCuenta.numeroCuenta = this.DatosPagosAnticipos.cuentaBanco;
              this.datosCuenta.nombreCuenta = this.DatosPagosAnticipos.cuentaBanco;
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = CantP01;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
            }
          }
          if (CantE01 > 0){
            this.LimpiarDatosCuenta();
            if (this.cuentaDocxCobrar.trim() !== '' && Accion === false){
              this.datosCuenta.numeroCuenta = this.cuentaDocxCobrar.trim();
              this.datosCuenta.nombreCuenta = this.defDocxCobrar.trim();
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = this.DatosPagosAnticipos.importeMNPago;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
              Accion = true;
            } else {
              this.datosCuenta.numeroCuenta = this.DatosPagosAnticipos.cuentaBanco;
              this.datosCuenta.nombreCuenta = this.DatosPagosAnticipos.cuentaBanco;
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = CantE01;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
            }
          }
          if (CantN02 > 0){
            this.LimpiarDatosCuenta();
            if (this.cuentaDocxCobrar.trim() !== '' && Accion === false){
              this.datosCuenta.numeroCuenta = this.cuentaDocxCobrar.trim();
              this.datosCuenta.nombreCuenta = this.defDocxCobrar.trim();
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = this.DatosPagosAnticipos.importeMNPago;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
              Accion = true;
            } else {
              this.datosCuenta.numeroCuenta = this.DatosPagosAnticipos.cuentaBanco;
              this.datosCuenta.nombreCuenta = this.DatosPagosAnticipos.cuentaBanco;
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = CantN02;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
            }
          }
          if (CantP02 > 0){
            this.LimpiarDatosCuenta();
            if (this.cuentaDocxCobrar.trim() !== '' && Accion === false){
              this.datosCuenta.numeroCuenta = this.cuentaDocxCobrar.trim();
              this.datosCuenta.nombreCuenta = this.defDocxCobrar.trim();
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = this.DatosPagosAnticipos.importeMNPago;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
              Accion = true;
            } else {
              this.datosCuenta.numeroCuenta = this.CtaContable;
              this.datosCuenta.nombreCuenta = this.NombreCuenta;
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = CantP02;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
            }
          }
          if (CantE02 > 0){
            this.LimpiarDatosCuenta();
            if (this.cuentaDocxCobrar.trim() !== '' && Accion === false){
              this.datosCuenta.numeroCuenta = this.cuentaDocxCobrar.trim();
              this.datosCuenta.nombreCuenta = this.defDocxCobrar.trim();
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = this.DatosPagosAnticipos.importeMNPago;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
              Accion = true;
            } else {
              this.datosCuenta.numeroCuenta = this.CtaContable;
              this.datosCuenta.nombreCuenta = this.NombreCuenta;
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = CantE02;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
            }
          }
          if (CantE05 > 0){
            this.LimpiarDatosCuenta();
            if (this.cuentaDocxCobrar.trim() !== '' && Accion === false){
              this.datosCuenta.numeroCuenta = this.cuentaDocxCobrar.trim();
              this.datosCuenta.nombreCuenta = this.defDocxCobrar.trim();
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = this.DatosPagosAnticipos.importeMNPago;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
              Accion = true;
            } else {
              this.datosCuenta.numeroCuenta = this.CtaContable;
              this.datosCuenta.nombreCuenta = this.NombreCuenta;
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = CantE05;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
            }
          }
          if (CantP05 > 0){
            this.LimpiarDatosCuenta();
            if (this.cuentaDocxCobrar.trim() !== '' && Accion === false){
              this.datosCuenta.numeroCuenta = this.cuentaDocxCobrar.trim();
              this.datosCuenta.nombreCuenta = this.defDocxCobrar.trim();
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = this.DatosPagosAnticipos.importeMNPago;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
              Accion = true;
            } else {
              this.datosCuenta.numeroCuenta = this.CtaContable;
              this.datosCuenta.nombreCuenta = this.NombreCuenta;
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = CantP05;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
            }
          }
          if (CantN05 > 0){
            this.LimpiarDatosCuenta();
            if (this.cuentaDocxCobrar.trim() !== '' && Accion === false){
              this.datosCuenta.numeroCuenta = this.cuentaDocxCobrar.trim();
              this.datosCuenta.nombreCuenta = this.defDocxCobrar.trim();
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = this.DatosPagosAnticipos.importeMNPago;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
              Accion = true;
            } else {
              this.datosCuenta.numeroCuenta = this.CtaContable;
              this.datosCuenta.nombreCuenta = this.NombreCuenta;
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = CantN05;
              this.datosCuenta.concepto =  this.clienteText;
              this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
            }
          }

          if ( sumAbonos < this.DatosPagosAnticipos.importeMNPago){
            if (this.CPos(this.DatosPagosAnticipos.importeMNPago) - sumAbonos > 1) {
              if (this.cuentaDocxCobrar.trim() !== '' && Accion === false){
                this.LimpiarDatosCuenta();
                this.datosCuenta.numeroCuenta = this.cuentaDocxCobrar.trim();
                this.datosCuenta.nombreCuenta = this.defDocxCobrar.trim();
                this.datosCuenta.cargo = 0;
                this.datosCuenta.abono = this.DatosPagosAnticipos.importeMNPago;
                this.datosCuenta.concepto =  this.clienteText;
                this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
                this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
                Accion = true;
              } else {
                this.LimpiarDatosCuenta();
                this.datosCuenta.numeroCuenta = this.CtaContable.trim();
                this.datosCuenta.nombreCuenta = this.NombreCuenta.trim();
                this.datosCuenta.cargo = 0;
                this.datosCuenta.abono = (this.DatosPagosAnticipos.importeMNPago - sumAbonos);
                this.datosCuenta.concepto =  this.clienteText;
                this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
                this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
              }
            } else { // Ajusta la diferencia de centavos en la lista
              this.datosCuenta.abono = this.datosCuenta.abono + (this.DatosPagosAnticipos.importeMNPago - sumAbonos);
            }
          }
          this.IrAPoliza = false;
        }

        // Se agrega IVA Fiscal
        if (this.DatosPagosAnticipos.idTipoMovto === 7 ||  this.DatosPagosAnticipos.idTipoMovto === 9 ||
            this.DatosPagosAnticipos.idTipoMovto === 18 || this.DatosPagosAnticipos.idTipoMovto === 15){
          /*await this.PolizaFluctuacion();*/
        }

        // Se recorren los repetitivos por el concepto de IVA
        let IvaFiscal = '';
        let Cargo = 0;
        let Abono = 0;

        const dts: any = await this.Servicios.GetCuentasContablesDeRepetitivo(this.DatosPagosAnticipos.repetitivo.trim(), 'Iva');
        if (dts.data.length > 0){
          for (const i of dts.data) {
            if (this.IvaFiscal > 0){
              IvaFiscal = i.numeroCuenta;
              Cargo = 0;
              Abono = 0;
              if (i.cargo >= 1){
                Cargo = this.IvaContable;
                Abono = 0;
              } else {
                Abono = this.IvaFiscal;
                Cargo = 0;
              }
              this.datosCuenta.numeroCuenta = IvaFiscal;
              this.datosCuenta.nombreCuenta = this.DatosPagosAnticipos.cuentaBanco;
              this.datosCuenta.cargo = Cargo;
              this.datosCuenta.abono = Abono;
              this.datosCuenta.concepto =  this.clienteText;
              this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
            }
          }

          // IVA FLUCTUACION
          let UtilPedida = '';
          let CargoAbono = '';
          let valorUP = true;

          if (this.IvaFluctuacion > 0){
            UtilPedida = 'U';
            CargoAbono = 'A';
            valorUP = true;
          } else {
            UtilPedida = 'C';
            CargoAbono = 'P';
            valorUP = false;
          }
          if (this.IvaFluctuacion < 0){ this.IvaFluctuacion = this.IvaFluctuacion * -1; }
          if (this.IvaFluctuacion !== 0) {
            await this.PutDeposito(this.IvaFluctuacion, 'N', localStorage.getItem('Zona'), UtilPedida, CargoAbono, valorUP);
          }

        } else {
          swal.fire('información', 'No se ha encontrado la cuenta para el cliente seleccionado', 'info');
          return;
        }
      }
    }

    const ListaPolizaOriginal = this.ListaPoliza.ListaPolizas;
    const ListaPolizaDuplicados = uniqBy(this.ListaPoliza.ListaPolizas, 'numeroCuenta');
    this.ListaPoliza.ListaPolizas = [];

    for (const iterator of ListaPolizaDuplicados) {
      for (const iterator2 of ListaPolizaOriginal) {
        if (iterator2.numeroCuenta.trim().substring(0, 3) === '115'){
          if (iterator2.numeroCuenta.trim() === iterator.numeroCuenta.trim() && iterator2.nombreCuenta.trim() === iterator.nombreCuenta.trim() && iterator.id !== iterator2.id){
            iterator.cargo = 0;
            iterator.abono = (iterator.abono + iterator2.abono) - (iterator2.cargo);
          }
        } else if (iterator.numeroCuenta.trim().substring(0, 3) === '127'){
          iterator.cargo = 0;
          iterator.abono = (iterator.abono + iterator2.abono) - (iterator2.cargo);
        }
      }
      this.ListaPoliza.ListaPolizas.push(iterator);
    }
    this.TotalesCargoAbono();
  }

  /*async PolizaFluctuacion(): Promise<void> {
    try {
      let a = 0; let Entradas = 0; let Ultimo = 0; let SumaTotal = 0; let SumaAbono = 0; let Fluctuacion = 0; let SaldoUltimo = 0;
      let ldFluctuacion_N_N = 0;
      let ldFluctuacion_N_E = 0;
      let ldFluctuacion_N_P = 0;
      let SumaTotal_N_N = 0;
      let SumaTotal_N_E = 0;
      let SumaTotal_N_P = 0;
      let SumaAbono_N_N = 0;
      let SumaAbono_N_E = 0;
      let SumaAbono_N_P = 0;
      let ldFluctuacion_T_N = 0;
      let ldFluctuacion_T_E = 0;
      let ldFluctuacion_T_P = 0;
      let SumaTotal_T_N = 0;
      let SumaTotal_T_E = 0;
      let SumaTotal_T_P = 0;
      let SumaAbono_T_N = 0;
      let SumaAbono_T_E = 0;
      let SumaAbono_T_P = 0;

      let ldFluctuacion_H_N = 0;
      let ldFluctuacion_H_E = 0;
      let ldFluctuacion_H_P = 0;
      let SumaTotal_H_N = 0;
      let SumaTotal_H_E = 0;
      let SumaTotal_H_P = 0;
      let SumaAbono_H_N = 0;
      let SumaAbono_H_E = 0;
      let SumaAbono_H_P = 0;
      let Ganancia = false;

      let FactMesActual = false;
      let TCMesAnt = 0;
      let TCFactura = 0;

      const datosTipoCambio: any = await this.Servicios.GetTipoCambioUltimaFecha(this.datePipe.transform( this.DatosPagosAnticipos.fechaDeposito, 'yyyyMMdd'));
      if (datosTipoCambio.data.length <= 0){
        swal.fire('Información', 'No se encontro el Tipo de Cambio de la fecha seleccionada', 'info');
        return;
      }

      TCMesAnt = datosTipoCambio.data[0].tipoCambio;
      const FechaPrincipal: Date = new Date(this.DatosPagosAnticipos.fechaDeposito);
      const FechaMA: Date = new Date(FechaPrincipal.getFullYear(), FechaPrincipal.getMonth(), 0);

      if (Number(this.DatosPagosAnticipos.monedaDeposito) === 1){
        this.IvaContable = 0;
        this.IvaFiscal = 0;
        this.IvaFluctuacion = 0;

        // Se Suman las facturas seleccionadas
        for (a = 0; a < this.ListaMovimientosCliente.length; a++) {
          if (this.ListaMovimientosCliente[a].isSeleccionado === true){
            // Se revisa que la factura sea del meses anterior
            const fecha: Date = new Date(this.ListaMovimientosCliente[a].fecha);
            if (fecha <= FechaMA){ // PORQUE ESTA MAL REVISAR ESTA SITUACION
              FactMesActual = false;
              TCFactura = TCMesAnt;
            } else {
              FactMesActual = true;
              TCFactura = this.ListaMovimientosCliente[a].tipoCambio;
            }

            const SubTotal = this.ListaMovimientosCliente[a].dolares / (this.ListaMovimientosCliente[a].importeIVA + 1);
            const Iva = SubTotal * this.ListaMovimientosCliente[a].importeIVA;
            this.IvaContable = this.IvaContable + (Iva * this.ListaMovimientosCliente[a].tipoCambio);
            this.IvaFiscal = this.IvaFiscal + (Iva * this.DatosPagosAnticipos.tipoCambioPago);
            this.IvaFluctuacion =  (this.IvaContable - this.IvaFiscal);

            SumaTotal = SumaTotal + (this.ListaMovimientosCliente[a].dolares * TCFactura);
            SumaAbono = SumaAbono + this.ListaMovimientosCliente[a].dolares;

            if (this.ListaMovimientosCliente[a].zona === '02'){
              if (this.ListaMovimientosCliente[a].nacExpPit.trim() === 'N'){
                SumaTotal_T_N = SumaTotal_T_N + (this.ListaMovimientosCliente[a].dolares * TCFactura);
                SumaAbono_T_N = SumaAbono_T_N + this.ListaMovimientosCliente[a].dolares;
              }
              if (this.ListaMovimientosCliente[a].nacExpPit.trim() === 'E'){
                SumaTotal_T_E = SumaTotal_T_E + (this.ListaMovimientosCliente[a].dolares * TCFactura);
                SumaAbono_T_E = SumaAbono_T_E + this.ListaMovimientosCliente[a].dolares;
              }
              if (this.ListaMovimientosCliente[a].nacExpPit.trim() === 'P'){
                SumaTotal_T_P = SumaTotal_T_P + (this.ListaMovimientosCliente[a].dolares * TCFactura);
                SumaAbono_T_P = SumaAbono_T_P + this.ListaMovimientosCliente[a].dolares;
              }
            }

            if (this.ListaMovimientosCliente[a].zona === '01'){
              if (this.ListaMovimientosCliente[a].nacExpPit.trim() === 'N'){
                SumaTotal_N_N = SumaTotal_N_N + (this.ListaMovimientosCliente[a].dolares * TCFactura);
                SumaAbono_N_N = SumaAbono_N_N + this.ListaMovimientosCliente[a].dolares;
              }
              if (this.ListaMovimientosCliente[a].nacExpPit.trim() === 'E'){
                SumaTotal_N_E = SumaTotal_N_E + (this.ListaMovimientosCliente[a].dolares * TCFactura);
                SumaAbono_N_E = SumaAbono_N_E + this.ListaMovimientosCliente[a].dolares;
              }
              if (this.ListaMovimientosCliente[a].nacExpPit.trim() === 'P'){
                SumaTotal_N_P = SumaTotal_N_P + (this.ListaMovimientosCliente[a].dolares * TCFactura);
                SumaAbono_N_P = SumaAbono_N_P + this.ListaMovimientosCliente[a].dolares;
              }
            }

            if (this.ListaMovimientosCliente[a].zona === '05'){
              if (this.ListaMovimientosCliente[a].nacExpPit.trim() === 'N'){
                SumaTotal_H_N = SumaTotal_H_N + (this.ListaMovimientosCliente[a].dolares * TCFactura);
                SumaAbono_H_N = SumaAbono_H_N + this.ListaMovimientosCliente[a].dolares;
              }
              if (this.ListaMovimientosCliente[a].nacExpPit.trim() === 'E'){
                SumaTotal_H_E = SumaTotal_H_E + (this.ListaMovimientosCliente[a].dolares * TCFactura);
                SumaAbono_H_E = SumaAbono_H_E + this.ListaMovimientosCliente[a].dolares;
              }
              if (this.ListaMovimientosCliente[a].nacExpPit.trim() === 'P'){
                SumaTotal_H_P = SumaTotal_H_P + (this.ListaMovimientosCliente[a].dolares * TCFactura);
                SumaAbono_H_P = SumaAbono_H_P + this.ListaMovimientosCliente[a].dolares;
              }
            }
            Entradas += 1;
            Ultimo = a;
          }
        }

        if (SumaTotal === 0){
          // txtRepFluct VER para que sirve
          return;
        }

        if (this.DatosPagosAnticipos.importePago > (SumaAbono - this.ListaMovimientosCliente[Ultimo].dolares) && this.DatosPagosAnticipos.importePago < SumaAbono){
          SaldoUltimo = this.DatosPagosAnticipos.importePago - (SumaAbono - this.ListaMovimientosCliente[Ultimo].dolares);
          SumaTotal = SumaTotal - (this.ListaMovimientosCliente[Ultimo].dolares * TCFactura);
          SumaTotal = SumaTotal + (SaldoUltimo * TCFactura);
          SumaAbono = SumaAbono * TCFactura;
          SumaAbono = SumaAbono + SaldoUltimo;

          // Tijuana
          if (SumaTotal_T_N !== 0){
            SumaTotal_T_N = SumaTotal_T_N - (this.ListaMovimientosCliente[Ultimo].dolares * TCFactura);
            SumaTotal_T_N = SumaTotal_T_N + (SaldoUltimo * TCFactura);
          }
          if (SumaTotal_T_E !== 0){
            SumaTotal_T_E = SumaTotal_T_E - (this.ListaMovimientosCliente[Ultimo].dolares * TCFactura);
            SumaTotal_T_E = SumaTotal_T_E + (SaldoUltimo * TCFactura);
          }
          if (SumaTotal_T_P !== 0){
            SumaTotal_T_P = SumaTotal_T_P - (this.ListaMovimientosCliente[Ultimo].dolares * TCFactura);
            SumaTotal_T_P = SumaTotal_T_P + (SaldoUltimo * TCFactura);
          }

          // Navojoa
          if (SumaTotal_N_N !== 0){
            SumaTotal_N_N = SumaTotal_N_N - (this.ListaMovimientosCliente[Ultimo].dolares * TCFactura);
            SumaTotal_N_N = SumaTotal_N_N + (SaldoUltimo * TCFactura);
          }
          if (SumaTotal_N_E !== 0){
            SumaTotal_N_E = SumaTotal_N_E - (this.ListaMovimientosCliente[Ultimo].dolares * TCFactura);
            SumaTotal_N_E = SumaTotal_N_E + (SaldoUltimo * TCFactura);
          }
          if (SumaTotal_N_P !== 0){
            SumaTotal_N_P = SumaTotal_N_P - (this.ListaMovimientosCliente[Ultimo].dolares * TCFactura);
            SumaTotal_N_P = SumaTotal_N_P + (SaldoUltimo * TCFactura);
          }

          // Hermosillo
          if (SumaTotal_H_N !== 0){
            SumaTotal_H_N = SumaTotal_H_N - (this.ListaMovimientosCliente[Ultimo].dolares * TCFactura);
            SumaTotal_H_N = SumaTotal_H_N + (SaldoUltimo * TCFactura);
          }
          if (SumaTotal_H_E !== 0){
            SumaTotal_H_E = SumaTotal_H_E - (this.ListaMovimientosCliente[Ultimo].dolares * TCFactura);
            SumaTotal_H_E = SumaTotal_H_E + (SaldoUltimo * TCFactura);
          }
          if (SumaTotal_H_P !== 0){
            SumaTotal_H_P = SumaTotal_H_P - (this.ListaMovimientosCliente[Ultimo].dolares * TCFactura);
            SumaTotal_H_P = SumaTotal_H_P + (SaldoUltimo * TCFactura);
          }

          // Tijuana
          if (SumaAbono_T_N !== 0){
            SumaAbono_T_N = SumaAbono_T_N - this.ListaMovimientosCliente[Ultimo].dolares;
            SumaAbono_T_N = SumaAbono_T_N + SaldoUltimo;
          }
          if (SumaAbono_T_E !== 0){
            SumaAbono_T_E = SumaAbono_T_E - this.ListaMovimientosCliente[Ultimo].dolares;
            SumaAbono_T_E = SumaAbono_T_E + SaldoUltimo;
          }
          if (SumaAbono_T_P !== 0){
            SumaAbono_T_P = SumaAbono_T_P - this.ListaMovimientosCliente[Ultimo].dolares;
            SumaAbono_T_P = SumaAbono_T_P + SaldoUltimo;
          }
          // Navojoa
          if (SumaAbono_N_N !== 0){
            SumaAbono_N_N = SumaAbono_N_N - this.ListaMovimientosCliente[Ultimo].dolares;
            SumaAbono_N_N = SumaAbono_N_N + SaldoUltimo;
          }
          if (SumaAbono_N_E !== 0){
            SumaAbono_N_E = SumaAbono_N_E - this.ListaMovimientosCliente[Ultimo].dolares;
            SumaAbono_N_E = SumaAbono_N_E + SaldoUltimo;
          }
          if (SumaAbono_N_P !== 0){
            SumaAbono_N_P = SumaAbono_N_P - this.ListaMovimientosCliente[Ultimo].dolares;
            SumaAbono_N_P = SumaAbono_N_P + SaldoUltimo;
          }
          // Hermosillo
          if (SumaAbono_H_N !== 0){
            SumaAbono_H_N = SumaAbono_H_N - this.ListaMovimientosCliente[Ultimo].dolares;
            SumaAbono_H_N = SumaAbono_H_N + SaldoUltimo;
          }
          if (SumaAbono_H_E !== 0){
            SumaAbono_H_E = SumaAbono_H_E - this.ListaMovimientosCliente[Ultimo].dolares;
            SumaAbono_H_E = SumaAbono_H_E + SaldoUltimo;
          }
          if (SumaAbono_H_P !== 0){
            SumaAbono_H_P = SumaAbono_H_P - this.ListaMovimientosCliente[Ultimo].dolares;
            SumaAbono_H_P = SumaAbono_H_P + SaldoUltimo;
          }
        }

        // SE CALCULA LA FLUCTUACION CAMBIARIA
        if (Entradas === 1 && this.DatosPagosAnticipos.importePago < SumaAbono){
          SumaTotal = 0;
          SumaAbono = 0;
          for (const iterator of this.ListaMovimientosCliente) {
            if (iterator.isSeleccionado === true){
              SumaTotal = this.DatosPagosAnticipos.importePago * iterator.tipoCambio;
            }
          }
          SumaAbono = this.DatosPagosAnticipos.importePago * this.DatosPagosAnticipos.tipoCambioPago;
        } else {
          SumaAbono = SumaAbono * this.DatosPagosAnticipos.tipoCambioPago;
          SumaAbono_T_N = SumaAbono_T_N * this.DatosPagosAnticipos.tipoCambioPago;
          SumaAbono_T_E = SumaAbono_T_E * this.DatosPagosAnticipos.tipoCambioPago;
          SumaAbono_T_P = SumaAbono_T_P * this.DatosPagosAnticipos.tipoCambioPago;
          SumaAbono_N_N = SumaAbono_N_N * this.DatosPagosAnticipos.tipoCambioPago;
          SumaAbono_N_E = SumaAbono_N_E * this.DatosPagosAnticipos.tipoCambioPago;
          SumaAbono_N_P = SumaAbono_N_P * this.DatosPagosAnticipos.tipoCambioPago;
          SumaAbono_H_N = SumaAbono_H_N * this.DatosPagosAnticipos.tipoCambioPago;
          SumaAbono_H_E = SumaAbono_H_E * this.DatosPagosAnticipos.tipoCambioPago;
          SumaAbono_H_P = SumaAbono_H_P * this.DatosPagosAnticipos.tipoCambioPago;
        }

        Fluctuacion = SumaAbono - SumaTotal;
        ldFluctuacion_T_N = SumaAbono_T_N - SumaTotal_T_N;
        ldFluctuacion_T_E = SumaAbono_T_E - SumaTotal_T_E;
        ldFluctuacion_T_P = SumaAbono_T_P - SumaTotal_T_P;
        ldFluctuacion_N_N = SumaAbono_N_N - SumaTotal_N_N;
        ldFluctuacion_N_E = SumaAbono_N_E - SumaTotal_N_E;
        ldFluctuacion_N_P = SumaAbono_N_P - SumaTotal_N_P;
        ldFluctuacion_H_N = SumaAbono_H_N - SumaTotal_H_N;
        ldFluctuacion_H_E = SumaAbono_H_E - SumaTotal_H_E;
        ldFluctuacion_H_P = SumaAbono_H_P - SumaTotal_H_P;

        if (Fluctuacion === 0){
          swal.fire('Información', 'No Hubo Fluctuación cambiaria', 'info');
          return;
        }
        // Se determina si la fluctuacion es positiva o negativa.

        if (this.chkFluctuacion === true){ // AQUI ME QUEDE ESTA MAL EL DATO
          if (Fluctuacion > 0){ Ganancia = true; } else { Ganancia = false; }
        } else {
          if (Fluctuacion > 0){
            Ganancia = true;
            switch (this.DatosPagosAnticipos.repetitivo.trim()){
              case 'CAJAS': { this.txtRepFluct = 'CAJASF+'; break; }
              case 'C.PAPELN': { this.txtRepFluct = 'C.PAPELNF+'; break; }
              case 'CLIE.EXP': { this.txtRepFluct = 'CLIE.EXPF+'; break; }
              case 'PITEX': { this.txtRepFluct = 'PITEXF+'; break; }
              case 'T.CAJAS': { this.txtRepFluct = 'T.CAJASF+'; break; }
              case 'T.C.EXP': { this.txtRepFluct = 'T.C.EXPF+'; break; }
              case 'T.PITEX': { this.txtRepFluct = 'T.PITEXF+'; break; }
            }
          } else {
            Ganancia = false;
            switch (this.DatosPagosAnticipos.repetitivo.trim()){
              case 'CAJAS': { this.txtRepFluct = 'CAJASF-'; break; }
              case 'C.PAPELN': { this.txtRepFluct = 'C.PAPELNF-'; break; }
              case 'CLIE.EXP': { this.txtRepFluct = 'CLIE.EXPF-'; break; }
              case 'PITEX': { this.txtRepFluct = 'PITEXF-'; break; }
              case 'T.CAJAS': { this.txtRepFluct = 'T.CAJASF-'; break; }
              case 'T.C.EXP': { this.txtRepFluct = 'T.C.EXPF-'; break; }
              case 'T.PITEX': { this.txtRepFluct = 'T.PITEXF-'; break; }
            }
          }
        }

        // Define si es paridad o utilidad y valida si es perdida o ganancia
        let UP_T_N = ''; let UP_T_E = ''; let UP_T_P = ''; let UP_N_N = ''; let UP_N_E = '';
        let UP_N_P = ''; let UP_H_N = ''; let UP_H_E = ''; let UP_H_P = '';

        // Tijuana
        if (ldFluctuacion_T_N !== 0){
          if (ldFluctuacion_T_N > 0){ UP_T_N = 'U'; } else { UP_T_N = 'P'; }
        }
        if (ldFluctuacion_T_E !== 0){
          if (ldFluctuacion_T_E > 0){ UP_T_E = 'U'; } else { UP_T_E = 'P'; }
        }
        if (ldFluctuacion_T_P !== 0){
          if (ldFluctuacion_T_P > 0){ UP_T_P = 'U'; } else { UP_T_P = 'P'; }
        }
        // Navojoa
        if (ldFluctuacion_N_N !== 0){
          if (ldFluctuacion_N_N > 0){ UP_N_N = 'U'; } else { UP_N_N = 'P'; }
        }
        if (ldFluctuacion_N_E !== 0){
          if (ldFluctuacion_N_E > 0){ UP_N_E = 'U'; } else { UP_N_E = 'P'; }
        }
        if (ldFluctuacion_N_P !== 0){
          if (ldFluctuacion_N_P > 0){ UP_N_P = 'U'; } else { UP_N_P = 'P'; }
        }
        // Hermosillo
        if (ldFluctuacion_H_N !== 0){
          if (ldFluctuacion_H_N > 0){ UP_H_N = 'U'; } else { UP_H_N = 'P'; }
        }
        if (ldFluctuacion_H_E !== 0){
          if (ldFluctuacion_H_E > 0){ UP_H_E = 'U'; } else { UP_H_E = 'P'; }
        }
        if (ldFluctuacion_H_P !== 0){
          if (ldFluctuacion_H_P > 0){ UP_H_P = 'U'; } else { UP_H_P = 'P'; }
        }

        // Agregar Póliza a la lista
        let Cuenta = ''; let Nombre = ''; let Concepto = ''; let lsUP = '';
        let valorUP =  false;

        if (this.chkFluctuacion === true){
          if (Ganancia === true) { lsUP = 'U'; } else { lsUP = 'P'; }
          // Cargos Tijuana
          if (UP_T_N === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_T_N !== 0){
            await this.PutDeposito(ldFluctuacion_T_N, 'N', '02', UP_T_N, 'C', valorUP);
          }
          if (UP_T_E === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_T_E !== 0){
            await this.PutDeposito(ldFluctuacion_T_E, 'E', '02', UP_T_E, 'C', valorUP);
          }
          if (UP_T_P === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_T_P !== 0){
            await this.PutDeposito(ldFluctuacion_T_P, 'P', '02', UP_T_P, 'C', valorUP);
          }
          // Navojoa
          if (UP_N_N === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_N_N !== 0){
            await this.PutDeposito(ldFluctuacion_N_N, 'N', '01', UP_N_N, 'C', valorUP);
          }
          if (UP_N_E === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_N_E !== 0){
            await this.PutDeposito(ldFluctuacion_N_E, 'E', '01', UP_N_E, 'C', valorUP);
          }
          if (UP_N_P === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_N_P !== 0){
            await this.PutDeposito(ldFluctuacion_N_P, 'P', '01', UP_N_P, 'C', valorUP);
          }
          // Hermosillo
          if (UP_H_N === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_H_N !== 0){
            await this.PutDeposito(ldFluctuacion_H_N, 'N', '05', UP_H_N, 'C', valorUP);
          }
          if (UP_H_E === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_H_E !== 0){
            await this.PutDeposito(ldFluctuacion_H_E, 'E', '05', UP_H_E, 'C', valorUP);
          }
          if (UP_H_P === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_H_P !== 0){
            await this.PutDeposito(ldFluctuacion_H_P, 'P', '05', UP_H_P, 'C', valorUP);
          }

          // Abono Tijuana
          if (UP_T_N === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_T_N !== 0){
            await this.PutDeposito(ldFluctuacion_T_N, 'N', '02', UP_T_N, 'A', valorUP);
          }
          if (UP_T_E === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_T_E !== 0){
            await this.PutDeposito(ldFluctuacion_T_E, 'E', '02', UP_T_E, 'A', valorUP);
          }
          if (UP_T_P === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_T_P !== 0){
            await this.PutDeposito(ldFluctuacion_T_P, 'P', '02', UP_T_P, 'A', valorUP);
          }
          // Navojoa
          if (UP_N_N === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_N_N !== 0){
            await this.PutDeposito(ldFluctuacion_N_N, 'N', '01', UP_N_N, 'A', valorUP);
          }
          if (UP_N_E === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_N_E !== 0){
            await this.PutDeposito(ldFluctuacion_N_E, 'E', '01', UP_N_E, 'A', valorUP);
          }
          if (UP_N_P === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_N_P !== 0){
            await this.PutDeposito(ldFluctuacion_N_P, 'P', '01', UP_N_P, 'A', valorUP);
          }
          // Hermosillo
          if (UP_H_N === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_H_N !== 0){
            await this.PutDeposito(ldFluctuacion_H_N, 'N', '05', UP_H_N, 'A', valorUP);
          }
          if (UP_H_E === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_H_E !== 0){
            await this.PutDeposito(ldFluctuacion_H_E, 'E', '05', UP_H_E, 'A', valorUP);
          }
          if (UP_H_P === 'U') { valorUP = true; } else { valorUP = false; }
          if (ldFluctuacion_H_P !== 0){
            await this.PutDeposito(ldFluctuacion_H_P, 'P', '05', UP_H_P, 'A', valorUP);
          }
        } else {
          // obtiene el numero de ciuenta segun sea el repetitivo

          const datosRepetitivo: any = await this.Servicios.GetCuentasContablesDeRepetitivo(this.txtRepFluct.trim(), 'Sub Total');
          if (datosRepetitivo.data.length <= 0){
            swal.fire('Información', 'No éxiste repetitivo para calcular póliza de fluctuación', 'info');
            return;
          }
          Concepto = datosRepetitivo.data.concepto.trim();
          Cuenta = datosRepetitivo.data.numeroCuenta.trim();

          const dtsCuenta: any = await this.Servicios.GetCuentasContablesAsync(this.txtRepFluct.trim());
          if (dtsCuenta.data.length <= 0){
            swal.fire('Información', 'No se encontrá la cuenta', 'info');
            return;
          }
          Nombre = dtsCuenta.data.nombreCuenta;

          // Se registra la póliza
          if (Fluctuacion > 5){
            this.LimpiarDatosCuenta();
            this.datosCuenta.numeroCuenta = Cuenta;
            this.datosCuenta.numeroCuenta = Nombre;
            if (Ganancia === true){
              this.datosCuenta.cargo = Fluctuacion;
              this.datosCuenta.abono = 0;
            } else {
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = Fluctuacion;
            }
            this.datosCuenta.concepto = Concepto;
            this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
          }

          const datosRepetitivo2: any = await this.Servicios.GetCuentasContablesDeRepetitivo(this.txtRepFluct.trim(), 'Total');
          if (datosRepetitivo2.data.length <= 0){
            swal.fire('Información', 'No éxiste repetitivo para calcular póliza de fluctuación', 'info');
            return;
          }
          Concepto = datosRepetitivo2.data.concepto.trim();
          Cuenta = datosRepetitivo2.data.numeroCuenta.trim();

          const dtsCuenta2: any = await this.Servicios.GetCuentasContablesAsync(this.txtRepFluct.trim());
          if (dtsCuenta2.data.length <= 0){
            swal.fire('Información', 'No se encontrá la cuenta', 'info');
            return;
          }
          Nombre = dtsCuenta2.data.nombreCuenta;

          // Se registra la póliza
          if (Fluctuacion > 5){
            this.LimpiarDatosCuenta();
            this.datosCuenta.numeroCuenta = Cuenta;
            this.datosCuenta.numeroCuenta = Nombre;
            if (Ganancia === true){
              this.datosCuenta.cargo = Fluctuacion;
              this.datosCuenta.abono = 0;
            } else {
              this.datosCuenta.cargo = 0;
              this.datosCuenta.abono = Fluctuacion;
            }
            this.datosCuenta.concepto = Concepto;
            this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
          }
        } // Terimna if chkFluctuacion
      } // Termina if Moneda
    } catch (error: any) {
       swal.fire('Información', error.error, 'error');
    }
  }*/

  LimpiarDatosCuenta(): void{
    this.datosCuenta = {numeroCuenta: '', nombreCuenta: '', cargo: 0, abono: 0, concepto: '', id: 0};
  }

  async PutDeposito(pdFluctuacion: number, psMercado: string, psZona: string, psUP: string,  psDeposito: string,  pbGanancia: boolean ): Promise<void>{
    let lsCuenta = '';
    let lsNombre = '';
    let lsConcepto = '';

    const datosConceptoCuentas: any = await this.Servicios.GetConceptosDeCuentas(psZona, psMercado, psDeposito, psUP);
    if (datosConceptoCuentas.data.length <= 0 || datosConceptoCuentas.data === null){
      swal.fire('Información', 'No existe cuenta para calcular Poliza de Fluctuacion', 'info');
      return;
    }

    lsCuenta = datosConceptoCuentas.data[0].cuenta;
    lsConcepto = datosConceptoCuentas.data[0].concepto;

    const datosCuentasAsync: any =  await this.Servicios.GetCuentasContablesAsync(lsCuenta);
    if (datosCuentasAsync === null || datosCuentasAsync <= 0){
      swal.fire('Información', 'No existe cuenta para calcular Poliza de Fluctuacion', 'info');
      return;
    }
    this.CuentasContables =  datosCuentasAsync.data[0];
    if (this.CuentasContables.ctaN1.trim() + this.CuentasContables.ctaN2.trim() === '115005' ||
        this.CuentasContables.ctaN1.trim() + this.CuentasContables.ctaN2.trim() === '115003' ||
        this.CuentasContables.ctaN1.trim() + this.CuentasContables.ctaN2.trim() === '115001'){
      if (this.Papel.trim() !== ''){
        if (this.cuentaDocxCobrar.trim() !== ''){
          lsCuenta = this.cuentaDocxCobrar;
          lsNombre = this.defDocxCobrar;
        } else {
          lsCuenta = this.CtaContable;
          lsNombre = this.NombreCuenta;
        }
      } else {
        if (this.cuentaDocxCobrar.trim() !== ''){
          lsCuenta = this.cuentaDocxCobrar;
          lsNombre = this.defDocxCobrar;
        } else {
          lsCuenta = this.CtaContable;
          lsNombre = this.NombreCuenta;
        }
      }
    } else {
      if (this.CuentasContables.ctaN1.trim() + this.CuentasContables.ctaN1.trim() === '015005' ||
        this.CuentasContables.ctaN1.trim() + this.CuentasContables.ctaN1.trim() === '015001' ||
        this.CuentasContables.ctaN1.trim() + this.CuentasContables.ctaN1.trim() === '015003'){
          lsCuenta = this.CtaContable;
          lsNombre = this.NombreCuenta;
        } else {
          lsNombre = this.CuentasContables.nombreCuenta.trim();
        }
    }
    this.LimpiarDatosCuenta();
    if (pdFluctuacion > 0.01){
      this.datosCuenta.numeroCuenta = lsCuenta;
      this.datosCuenta.nombreCuenta = lsNombre;
      if (psDeposito === 'C'){
        this.datosCuenta.cargo = pdFluctuacion;
        this.datosCuenta.abono = 0;
      }
      if (psDeposito === 'A'){
        this.datosCuenta.cargo = 0;
        this.datosCuenta.abono = pdFluctuacion;
      }
      this.datosCuenta.concepto = lsConcepto;
      this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
    }

    this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
    this.GridPoliza.refreshData();
  }

  CPos(importe: number): number {
    if (importe < 0) {
      importe = importe * -1;
    }
    return importe;
  }

  SeleccionarCliente(datacliente: any): void {
    this.clienteText = datacliente.idCliente + ' - ' + datacliente.cliente;
    this.DatosPagosAnticipos.idCliente = datacliente.idCliente;
    this.DatosPagosAnticipos.codigoCliente = datacliente.codigoCliente;
    this.IdTipoCartera = datacliente.idTipoCartera;

    if (datacliente.idTipoCartera === 18){
      this.cuentaDocxCobrar = datacliente.cuenta.trim();
      this.defDocxCobrar = datacliente.definicion.trim();
    }else {
      this.cuentaDocxCobrar = '';
      this.defDocxCobrar = '';
    }

    if (this.clienteText !== ''){
      this.ChangeTipoMovimiento(7);
      this.DisableTipoMovimiento = true;
    }

    this.buscarMovimientosCliente(datacliente.codigoCliente);
    this.closeModalClientes();
  }

  buscarMovimientosCliente(idCliente: string): void {
    this.blockUI.start('Buscando Movimientos del Cliente...');
    this.Servicios.ListaMovimientosClientes(this.filtrosPag, idCliente).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.data.length > 0){
        this.ListaMovimientosCliente = res.data;
        this.DatosPagosAnticipos.repetitivo = this.ListaMovimientosCliente[0].repetitivo;
      }else {
        swal.fire('Información', 'No se han encontrado datos de los movimientos del cliente seleccionado', 'info');
      }
    }, (error: any) => {
      this.blockUI.stop();
      swal.fire(
        'Información',
        'Ha Ocurrio un Error al Momento de Cargar la Informacion los movimientos del cliente,' +
          ' Favor de Comunicarse con el Área de Informatica y Generar un Reporte de Fallas,' +
          ' <strong>Código de Error: ' + error.error + '</strong>',
        'error'
      );
    });
  }

  ListarDepositos(): void {
    this.filtrosDep.idCliente = this.DatosPagosAnticipos.idCliente;
    this.filtrosDep.claveRubro = this.claveRubro;
    this.filtrosDep.opcion = this.filtrosDep.todos === false ? 6 : 7;
    this.filtrosDep.fechaIncio = this.datePipe.transform(this.FechaInicio, 'yyyy-MM-dd');
    this.filtrosDep.fechaFin =  this.datePipe.transform(this.FechaFin, 'yyyy-MM-dd');

    this.blockUI.start('Cargando Depositos...');
    this.Servicios.ListaDepositos(this.filtrosPag, this.filtrosDep).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.data.length > 0) {

        if (this.filtrosDep.todos === true) {
          this.columnGridDepositosBancarios = [
            {
              headerName: 'Fecha Deposito',
              field: 'fecha',
              flex: 4,
              minWidth: 150,
              headerClass: 'header-center header-grid-left',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Folio',
              field: 'folio',
              flex: 4,
              minWidth: 80,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'No. Operación',
              field: 'noOperacion',
              flex: 4,
              minWidth: 130,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Forma de Pago',
              field: 'formaPago',
              flex: 4,
              minWidth: 140,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Concepto/Referencia',
              field: 'concepto',
              flex: 4,
              minWidth: 180,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Cliente',
              field: 'nombre',
              flex: 4,
              minWidth: 250,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Dolares',
              field: 'dolares',
              flex: 4,
              minWidth: 100,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Pesos',
              field: 'pesos',
              flex: 4,
              minWidth: 100,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Total',
              field: 'total',
              flex: 4,
              minWidth: 120,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Cuenta Banco',
              field: 'numeroCuenta',
              flex: 4,
              minWidth: 140,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Nombre Banco',
              field: 'nombreBanco',
              flex: 4,
              minWidth: 160,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Referencia',
              field: 'referencia',
              flex: 4,
              minWidth: 110,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Suc.',
              field: 'sucursal',
              flex: 4,
              minWidth: 80,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'T.C.',
              field: 'tipoCambioDeposito',
              flex: 4,
              minWidth: 100,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Importe',
              field: 'importe',
              flex: 4,
              minWidth: 120,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Moneda',
              field: 'nombreMoneda',
              flex: 4,
              minWidth: 100,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Nombre Banco Ordenante',
              field: 'nombreBancoOrdenante',
              flex: 4,
              minWidth: 200,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'RFC Banco Ordenante',
              field: 'rfcBancoOrdenante',
              flex: 4,
              minWidth: 200,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'No. Cuenta Banco Ordenante',
              field: 'noCuentaBancoOrdenante',
              flex: 4,
              minWidth: 200,
              headerClass: 'header-center header-grid-right',
              cellClass: 'grid-cell-center'
            }
          ];
        } else {
          this.columnGridDepositosBancarios = [
            {
              headerName: 'Seleccionar',
              cellRenderer: 'btnCellRenderer',
              cellRendererParams: {
                onClick: this.gridSeleccionarDeposito.bind(this),
                label: '<i class="far fa-hand-pointer"></i>',
                class: 'btn btn-success btn-sm'
              },
              headerClass: 'header-center header-grid-left',
              cellClass: 'grid-cell-btn-center',
              flex: 5,
              minWidth: 120,
              maxWidth: 120,
              suppressSizeToFit: true
            },
            {
              headerName: 'Fecha Deposito',
              field: 'fecha',
              flex: 4,
              minWidth: 150,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Folio',
              field: 'folio',
              flex: 4,
              minWidth: 80,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'No. Operación',
              field: 'noOperacion',
              flex: 4,
              minWidth: 130,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Forma de Pago',
              field: 'formaPago',
              flex: 4,
              minWidth: 140,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Concepto/Referencia',
              field: 'concepto',
              flex: 4,
              minWidth: 180,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Cliente',
              field: 'nombre',
              flex: 4,
              minWidth: 250,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Dolares',
              field: 'dolares',
              flex: 4,
              minWidth: 100,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Pesos',
              field: 'pesos',
              flex: 4,
              minWidth: 100,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Total',
              field: 'total',
              flex: 4,
              minWidth: 120,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Cuenta Banco',
              field: 'numeroCuenta',
              flex: 4,
              minWidth: 140,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Nombre Banco',
              field: 'nombreBanco',
              flex: 4,
              minWidth: 160,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Referencia',
              field: 'referencia',
              flex: 4,
              minWidth: 110,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Suc.',
              field: 'sucursal',
              flex: 4,
              minWidth: 80,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'T.C.',
              field: 'tipoCambioDeposito',
              flex: 4,
              minWidth: 100,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Importe',
              field: 'importe',
              flex: 4,
              minWidth: 120,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Moneda',
              field: 'nombreMoneda',
              flex: 4,
              minWidth: 100,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'Nombre Banco Ordenante',
              field: 'nombreBancoOrdenante',
              flex: 4,
              minWidth: 200,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'RFC Banco Ordenante',
              field: 'rfcBancoOrdenante',
              flex: 4,
              minWidth: 200,
              headerClass: 'header-center header-grid',
              cellClass: 'grid-cell-center'
            },
            {
              headerName: 'No. Cuenta Banco Ordenante',
              field: 'noCuentaBancoOrdenante',
              flex: 4,
              minWidth: 200,
              headerClass: 'header-center header-grid-right',
              cellClass: 'grid-cell-center'
            }
          ];
        }

        this.ListaDepositos = res.data;

      } else{
        swal.fire('Información', 'No se encontraron registros con los datos solicitados.', 'info');
      }
    }, (error: any) => {
      this.blockUI.stop();
      swal.fire(
        'Información',
        'Ha Ocurrio un Error al Momento de Cargar la Informacion los depositos,' +
          ' Favor de Comunicarse con el Área de Informatica y Generar un Reporte de Fallas,' +
          ' <strong>Código de Error: ' + error.error + '</strong>',
        'error'
      );
    });
  }

  GetCuentaContable(): void {
    this.blockUI.start('Buscando Cuenta Contable...');
    this.Servicios.GetCuentasContables(this.datosCuenta.numeroCuenta.trim()).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.data.length > 0){
        this.datosCuenta.nombreCuenta = res.data[0].nombreCuenta.trim();
      } else {
        this.datosCuenta.nombreCuenta = '';
        swal.fire('Información', 'No se encontraron registros con los datos solicitados.', 'info');
      }
    }, (error: any) => {
      this.blockUI.stop();
      swal.fire(
        'Información',
        'Ha Ocurrio un Error al Momento de Cargar la Informacion las cuentas contables,' +
          ' Favor de Comunicarse con el Área de Informatica y Generar un Reporte de Fallas,' +
          ' <strong>Código de Error: ' + error.error + '</strong>',
        'error'
      );
    });
  }

  AgregarPoliza(): void {
    if (this.Accion === 'MODIFICACION' ){
      for (const iterator of this.ListaPoliza.ListaPolizas) {
        if (this.datosCuenta.id === iterator.id){
          iterator.numeroCuenta = this.datosCuenta.numeroCuenta;
          iterator.nombreCuenta = this.datosCuenta.nombreCuenta;
          iterator.cargo = this.datosCuenta.cargo;
          iterator.abono = this.datosCuenta.abono;
          iterator.concepto = this.datosCuenta.concepto;
        }
      }
    } else {
      if (this.ListaPoliza.ListaPolizas.length === 0){ this.ListaPoliza.ListaPolizas = []; }
      this.datosCuenta.id = this.ListaPoliza.ListaPolizas.length + 1;
      this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
    }
    this.GridPoliza.refreshData();
    this.closeModalAgregarPoliza();
    this.TotalesCargoAbono();
    this.Accion = 'AGREGAR';
  }

  TotalesCargoAbono(): void {
    let totalCargo = 0;
    let totalAbono = 0;

    for (const iterator of this.ListaPoliza.ListaPolizas) {
      totalAbono += Number(iterator.abono);
      totalCargo += Number(iterator.cargo);
    }
    this.DatosPagosAnticipos.totalAbono = totalAbono;
    this.DatosPagosAnticipos.totalCargo = totalCargo;
  }

  async changeCuentaBanco(CuentaBancoDeposito: string): Promise<void> {
    if (CuentaBancoDeposito === '' || CuentaBancoDeposito === null){ return; }

    const datosBanco: any = await this.Servicios.GetDatosBancoPorClaveTipoCambio(CuentaBancoDeposito.trim());
    if (datosBanco.data.length <= 0) {
      swal.fire('Información', 'No se encontraron datos de la cuenta de banco', 'info');
      return;
    }

    this.DatosPagosAnticipos.monedaDeposito = datosBanco.data[0].moneda;
    this.idTipoMoneda = Number(this.DatosPagosAnticipos.monedaDeposito);
    this.MonedaPago = this.idTipoMoneda;
    this.NombreMoneda = datosBanco.data[0].nombreMoneda;
    this.NombreBanco = datosBanco.data[0].nombreBanco;
    this.CuentaBanco = datosBanco.data[0].numeroCuenta;

    if (datosBanco.data[0].monedaDeposito !== 0){
      const dtsTipoCambio: any = await this.Servicios.GetTipoCambio(this.DatosPagosAnticipos.fechaDeposito);
      if (dtsTipoCambio.data.length <= 0){
        swal.fire('Información', 'No se puede especificar el tipo de Moneda, por que no tiene especificado el tipo de cambio por bancos del día', 'info');
        return;
      }
      this.DatosPagosAnticipos.tipoCambioPago = dtsTipoCambio.data[0].tipoCambio;
    }
    this.changeTipoCambio();
  }

  async changeTipoCambio(): Promise<void> {
    let TipoCambioDia = 0;
    let TipoCambioPago = 0;

    if (this.DatosPagosAnticipos.tipoCambioDeposito !== this.DatosPagosAnticipos.tipoCambioPago){
      const dtsTipoCambio: any = await this.Servicios.GetTipoCambio(this.DatosPagosAnticipos.fechaDeposito);
      if (dtsTipoCambio.data.length <= 0){
        swal.fire('Información', 'No se ha encontrado el tipo de cambio del Día.', 'info');
        return;
      }
      TipoCambioDia = dtsTipoCambio.data.tipoCambio;
      TipoCambioPago = this.DatosPagosAnticipos.tipoCambioPago;

      if (this.DatosPagosAnticipos.monedaPago === 1) { // Si son dolares entra a validar que el tipo de cambio que se capturo no sea menor al del día
        if (TipoCambioPago < TipoCambioDia) {
          swal.fire('Información', 'El tipo de Cambio del Pago no puede ser Menor al tipo de Cambio del día', 'info');
          if (this.DatosPagosAnticipos.monedaDeposito.substring(0, 1) === '0' && this.DatosPagosAnticipos.monedaPago === 1){
            this.changeTipoMonedaProceso();
            this.changeImportePago();
          } else {
            this.DatosPagosAnticipos.tipoCambioPago = this.DatosPagosAnticipos.tipoCambioDeposito;
            this.changeImportePago();
          }
        }
      }
    }

    if (this.DatosPagosAnticipos.importePago !== 0){
      return;
    }

    if (!this.ValidaPago(this.DatosPagosAnticipos.saldoDeposito, this.DatosPagosAnticipos.importePago, this.DatosPagosAnticipos.saldoMNDeposito, this.DatosPagosAnticipos.importeMNPago)){
      return;
    }
    this.DatosPagosAnticipos.importeMNPago = this.DatosPagosAnticipos.importePago * this.DatosPagosAnticipos.tipoCambioPago;

    if (this.DatosPagosAnticipos.repetitivo !== '' || this.DatosPagosAnticipos.repetitivo.trim().length > 0){
      this.CargaPolizas();
    }
  }
           //    impD                   impP                  ImpDMN                   ImpPMN
  ValidaPago(saldoDeposito: number, importePago: number, saldoMNDeposito: number, importeMNPago: number): boolean {
    let PagoValido = false;

    if (this.DatosPagosAnticipos.monedaDeposito.trim().substring(1, 0) === '1' && this.DatosPagosAnticipos.monedaPago === 0) {
      if (saldoMNDeposito < importePago) {
        swal.fire('Información', 'El importe del pago es mayor que el saldo', 'info');
        PagoValido = false;
        return PagoValido;
      }else {
        PagoValido = true;
        return PagoValido;
      }
    }else {
      if (this.DatosPagosAnticipos.monedaDeposito.trim().substring(1, 0) === '1' && this.DatosPagosAnticipos.monedaPago === 1) {
        if (saldoDeposito < importePago) {
          swal.fire('Información', 'El importe del pago es mayor que el saldo', 'info');
          PagoValido = false;
          return PagoValido;
        } else {
          PagoValido = true;
          return PagoValido;
        }
      } else {
        if (this.DatosPagosAnticipos.monedaDeposito.trim().substring(1, 0) === '0' && this.DatosPagosAnticipos.monedaPago === 0) {
          if (saldoMNDeposito < importePago) {
            swal.fire('Información', 'El importe del pago es mayor que el saldo', 'info');
            PagoValido = false;
            return PagoValido;
          }else {
            PagoValido = true;
            return PagoValido;
          }
        } else {
          if (this.DatosPagosAnticipos.monedaDeposito.trim().substring(1, 0) === '0' && this.DatosPagosAnticipos.monedaPago === 0) {
            if (saldoDeposito < importePago) {
              swal.fire('Información', 'El importe del pago es mayor que el saldo', 'info');
              PagoValido = false;
              return PagoValido;
            } else {
              PagoValido = true;
              return PagoValido;
            }
          }
        }
      }
    }
  }

  async changeTipoMonedaProceso(): Promise<void> {
    this.MonedaPago =  this.DatosPagosAnticipos.monedaPago;
    let CambioADolar = false;
    let ImporteADollars = 0;
    let dblTipoCambio = 0;

    if (this.DatosPagosAnticipos.monedaDeposito.substring(0, 1) === '0' && this.MonedaPago === 1){
      const dtsTipoCambio: any = await this.Servicios.GetTipoCambio(this.DatosPagosAnticipos.fechaDeposito);
      if (dtsTipoCambio.data.length <= 0){
        swal.fire('Información', 'No se puede especificar el tipo de Moneda, por que no tiene especificado el tipo de cambio por bancos del día', 'info');
        return;
      }
      dblTipoCambio = dtsTipoCambio.data.tipoCambio;
      ImporteADollars = this.DatosPagosAnticipos.saldoMNDeposito * dblTipoCambio;
      this.DatosPagosAnticipos.importePago = ImporteADollars;
      CambioADolar = true;
      this.DatosPagosAnticipos.tipoCambioPago = dblTipoCambio;
    }

    if (CambioADolar === false && this.DatosPagosAnticipos.monedaDeposito.substring(0, 1) === '0'){
      this.DatosPagosAnticipos.importePago = this.DatosPagosAnticipos.saldoMNDeposito;
      this.DatosPagosAnticipos.importeMNPago = this.DatosPagosAnticipos.saldoMNDeposito;
      this.DatosPagosAnticipos.tipoCambioPago = 1;
      CambioADolar = false;
    }
  }

  changeImportePago(): void {
    if (this.DatosPagosAnticipos.importeMNPago !== null || this.DatosPagosAnticipos.importeMNPago !== 0 && this.DatosPagosAnticipos.tipoCambioPago !== null || this.DatosPagosAnticipos.tipoCambioPago) {
      this.DatosPagosAnticipos.importeMNPago = this.DatosPagosAnticipos.importePago * this.DatosPagosAnticipos.tipoCambioPago;
    } else {
      this.DatosPagosAnticipos.importeMNPago = 0;
    }
  }

  async GuardarPoliza(): Promise<void> {
    if (this.DatosPagosAnticipos.idCliente === ''){
      swal.fire('Inforamción', 'Se debe de capturar el cliente para poder guardar una póliza', 'info');
      return;
    }

    if (this.DatosPagosAnticipos.cuentaBanco === ''){
      swal.fire('Inforamción', 'Se debe de capturar la cuenta para poder guardar una póliza', 'info');
      return;
    }

    if (this.DatosPagosAnticipos.deposito === ''){
      swal.fire('Inforamción', 'Se debe de capturar el deposito para poder guardar una póliza', 'info');
      return;
    }

    /*if (this.ListaPoliza.ListaPolizas.length < 1){
      swal.fire('Inforamción', 'Se debe de capturar al menos una póliza', 'info');
      return;
    }*/

    const DespFolio = '';
    let tot = 0; let xAbono = 0; let xCargos = 0;
    const x = 0; const i = 0;

    // REGRESA PERIODO FISCAL
    let ind = 0;
    const dtsPeriodoFiscal: any = await this.Servicios.GetPeriodoFiscal(this.datePipe.transform(this.DatosPagosAnticipos.fechaDeposito, 'yyyy-MM-dd'), 2);
    if (dtsPeriodoFiscal.data.length === 1) {
      ind = 0;
    } else {
      ind = 1;
    }
    if (dtsPeriodoFiscal.data[0].estatus === '0'){
      swal.fire('Información', dtsPeriodoFiscal.data[0].mensaje, 'info');
      return;
    }

    // Valida que se encuentre dentro del periodo
    const dtsValidaFechas: any = await this.Servicios.GetFechaValidasPeriodo();
    const FechaInicio = new Date(dtsValidaFechas.data[0].fechaInicio);
    const FechaFin = new Date(dtsValidaFechas.data[0].fechaFinal);
    const FechaIngreso = new Date(this.DatosPagosAnticipos.fechaIngreso);

    if (FechaIngreso < FechaInicio || FechaIngreso > FechaFin){
      swal.fire('Información', 'Fecha fuera del periodo, solo tiene acceso al rango del ' + this.datePipe.transform(FechaInicio, 'yyyy/MM/dd')  + ' al ' + this.datePipe.transform(FechaFin, 'yyyy/MM/dd'), 'info');
      return;
    }

    const arrFacturasSeleccionadas: any = [];
    const arrAbonoFactura: any = [];
    const arrZonaFactura: any = [];
    const arrCFDIComplemento: any = [];

    const arrCFDISaldoAnterior: any = [];
    const intNumParcialidad: any = [];

    let dblImpPago = 0; const dblNumParcialidad = 0; let dblImpFactura = 0; let dblImpDif = 0; let dblDiferencia = 0;
    let bolVerificaImp = false;

    for (const iterator of this.ListaMovimientosCliente) {
      if (iterator.isSeleccionado === true){
        bolVerificaImp =  true;
        arrFacturasSeleccionadas.factura = iterator.documento;
        arrAbonoFactura.abono = iterator.monedaNacional;
        arrZonaFactura.zona = iterator.zona;

        if (this.MonedaPago === 0){
          tot = tot + iterator.monedaNacional;
        } else {
          tot = tot + iterator.dolares;
        }

        // Valida que la moneda de pago sea la misma que la de la factura
        if (this.MonedaPago !== iterator.moneda) {
          swal.fire('Información', 'El sistema no permite aplicar cargos con diferentes tipo de moneda', 'info');
          return;
        }

        if (arrFacturasSeleccionadas.factura !== null && this.DatosPagosAnticipos.idTipoMovto === 7){
          const dtsCFDIComplementos: any = await this.Servicios.GetCFDIComplementos(arrFacturasSeleccionadas.factura, this.DatosPagosAnticipos.idCliente);
          if (dtsCFDIComplementos.data.length > 0){
            const strImpFactura = dtsCFDIComplementos.data[0].precio;
            const strAbono = dtsCFDIComplementos.data[0].abono;

            dblImpFactura = strImpFactura;
            dblDiferencia = dblImpFactura - strAbono;
            arrCFDISaldoAnterior.saldo = dblDiferencia;
            intNumParcialidad.NumberParcialidades = dtsCFDIComplementos.data[0].numParcialidad;

            const FechaFactura = new Date(iterator.fecha);
            const FechaIngreso1 = new Date(this.DatosPagosAnticipos.fechaIngreso);

            if (this.DatosPagosAnticipos.monedaDeposito.toString() === '1'){
              if (iterator.monedaNacional === 0) {
                dblImpDif = (dblImpFactura - arrAbonoFactura.abono);
                if (FechaIngreso1 > FechaFactura || intNumParcialidad.NumberParcialidades !== 0 || dblImpDif !== 0) {
                  arrCFDIComplemento.complemento = 1;
                  dblImpPago = dblImpPago + (arrAbonoFactura.abono / this.DatosPagosAnticipos.tipoCambioPago);
                }
              } else {
                dblImpDif = (dblImpFactura) - iterator.dolares;
                if (FechaIngreso1 > FechaFactura || intNumParcialidad.NumberParcialidades !== 0 || dblImpDif !== 0) {
                  arrCFDIComplemento.complemento = 1;
                  dblImpPago = dblImpPago + iterator.dolares;
                }
              }
            } else {
              if (iterator.monedaNacional === 0) {
                dblImpDif = (dblImpFactura - arrAbonoFactura.abono);
                if (FechaIngreso1 > FechaFactura || intNumParcialidad.NumberParcialidades !== 0 || dblImpDif !== 0) {
                  arrCFDIComplemento.complemento = 1;
                  dblImpPago = dblImpPago + (arrAbonoFactura.abono);
                }
              } else {
                dblImpDif = (dblImpFactura) - iterator.dolares;
                if (FechaIngreso1 > FechaFactura || intNumParcialidad.NumberParcialidades !== 0 || dblImpDif !== 0) {
                  arrCFDIComplemento.complemento = 1;
                  dblImpPago = dblImpPago + (iterator.dolares * iterator.tipoCambio);
                }
              }
            }
          }
        }
      } // Termina IF Seleccionado
    }// Termina el For

    if (bolVerificaImp === false) {
      dblImpPago = this.DatosPagosAnticipos.importePago;
    }

    let sinRefer = false;
    if (tot === 0){
      sinRefer = true;
    }

    let miImporte = 0;
    if (sinRefer === true && tot !== 0){
      miImporte = tot;
    } else {
      miImporte = this.DatosPagosAnticipos.importePago;
    }

    for (const iterator of this.ListaPoliza.ListaPolizas) {
      xCargos = xCargos + iterator.cargo;
      xAbono = xAbono + iterator.abono;
    }

    if (xCargos !== xAbono){
      swal.fire('Información', 'La póliza no cuadra favor de corregir los datos', 'info');
      return;
    }

    let BanderaExcedente = 0;
    let totImpFact = 0;

    for (const iterator of this.ListaMovimientosCliente) {
      if (iterator.isSeleccionado === true) {
        if (this.DatosPagosAnticipos.monedaPago === 0 && iterator.moneda === 0) {
          totImpFact = totImpFact + iterator.monedaNacional;
          BanderaExcedente = 1;
        } else {
          if (this.DatosPagosAnticipos.monedaPago === 0 && iterator.moneda === 1) {
            totImpFact = totImpFact + iterator.dolares;
            BanderaExcedente = 2;
          } else {
            if (this.DatosPagosAnticipos.monedaPago === 1 && iterator.moneda === 1) {
              totImpFact = totImpFact + iterator.dolares;
              BanderaExcedente = 3;
            } else {
              if (this.DatosPagosAnticipos.monedaPago === 1 && iterator.moneda === 0) {
                totImpFact = totImpFact + iterator.monedaNacional;
                BanderaExcedente = 4;
              }
            }
          }
        }
      }
    }

    let diferenciaPago = 0;
    switch (BanderaExcedente){
      case 0: {
        diferenciaPago = this.DatosPagosAnticipos.importePago;
        break;
      }
      case 1: {
        break;
      }
      case 2: {
        break;
      }
      case 3: {
        diferenciaPago = this.DatosPagosAnticipos.importePago - totImpFact;
        break;
      }
      case 4: {
        diferenciaPago = (this.DatosPagosAnticipos.importePago  * this.DatosPagosAnticipos.tipoCambioPago) - totImpFact;
        break;
      }
    }

    /*let conceptoPol = '';*/

    if (diferenciaPago > 0){
      /*swal.fire({
        title: 'El Abono se sobrepaso con la cantidad de $ ' + diferenciaPago + ' Se generará un excedente ¿Desea continuar?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: '<i class="fa fa-undo"></i> No',
        confirmButtonText: '<i class="fa fa-times"></i> Si',
      }).then((result) => {
        if (result.value) {
          swal.fire({
            title: '',
            html: '<div class="row mt-2">' +
                    '<div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">' +
                      '<label class="estilo"> Seleccione la cuenta deseada:</label>' +
                      '<select class="form form-control form-control-sm">' +
                        '<option ngValue="0">Seleccionar...</option>' +
                        '<option *ngFor="let obj of this.ltsCuentasExcendentes" [ngValue]="obj.clave">{{obj.definicion}}</option>' +
                      '</select>' +
                    '</div>' +
                  '</div>',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: '<i class="fa fa-undo"></i> No',
            confirmButtonText: '<i class="fa fa-times"></i> Si',
          }).then((result) => {
            if (result.value) {
              for (const iterator of this.ltsCuentasExcendentes) {
                if (this.idCuentaExcedente === iterator.numeroCuenta){
                  this.ctaExcedente = iterator.numeroCuenta;
                  this.NomCtaExcedente = iterator.nombreCuenta;
                  this.Excedente = true;
                }
              }
            } else {
              return;
            }
          });

          sinRefer = true;
          this.cantExcedente = diferenciaPago;
          for (const iterator of this.ListaPoliza.ListaPolizas) {
            if (iterator.numeroCuenta.substring(0, 3) === '115' || iterator.numeroCuenta.substring(0, 3) === '127'){
              conceptoPol = iterator.concepto;
              iterator.abono = iterator.abono - (diferenciaPago * this.DatosPagosAnticipos.tipoCambioPago);
              break;
            }
          }
          const difPagoEnPesos = diferenciaPago * this.DatosPagosAnticipos.tipoCambioPago;
          this.LimpiarDatosCuenta();
          this.datosCuenta.numeroCuenta = this.ctaExcedente;
          this.datosCuenta.nombreCuenta = this.NomCtaExcedente;
          this.datosCuenta.cargo = 0;
          this.datosCuenta.abono = difPagoEnPesos;
          this.datosCuenta.concepto = conceptoPol;
          this.ListaPoliza.ListaPolizas.push(this.datosCuenta);
        }
      });*/
    }

    xCargos = 0;
    xAbono = 0;

    for (const iterator of this.ListaPoliza.ListaPolizas) {
      xCargos = xCargos + iterator.cargo;
      xAbono = xAbono + iterator.abono;
    }

    if (xCargos !== xAbono){
      swal.fire('Información', 'La póliza no cuadra favor de corregir los datos', 'info');
      return;
    }


    // VERIFICA SI EXISTE REMANETE
    let TotalPago = 0;
    for (const iterator of this.ListaMovimientosCliente) {
        if (iterator.isSeleccionado === true){
          TotalPago = TotalPago + iterator.dolares;
        }
    }

    if (TotalPago > this.DatosPagosAnticipos.importePago){
      swal.fire('Información', 'El importe de las facturas seleccionadas sobrepasa el pago favor de modificar el importe de las facturas seleccionadas', 'error');
      return;
    }

    /*if (TotalPago < this.DatosPagosAnticipos.importePago){
      this.DatosPagosAnticipos.tieneRemanente = 1;
      this.DatosPagosAnticipos.totalRemanente = this.DatosPagosAnticipos.importePago - TotalPago;
    } else {
      this.DatosPagosAnticipos.tieneRemanente = 0;
    }*/

    this.DatosPagosAnticipos.id = 0;
    this.DatosPagosAnticipos.folio = 0;
    this.DatosPagosAnticipos.documento = 0;
    this.DatosPagosAnticipos.idTipoMovto = this.idTipoMovimiento;
    this.DatosPagosAnticipos.fecha = this.datePipe.transform(this.FechaIngreso, 'yyyyMMdd');
    this.DatosPagosAnticipos.importe = this.DatosPagosAnticipos.importePago;
    this.DatosPagosAnticipos.moneda = this.MonedaPago.toString();
    this.DatosPagosAnticipos.tipoCambio = this.DatosPagosAnticipos.tipoCambioPago;
    this.DatosPagosAnticipos.idTipoCartera = this.IdTipoCartera;
    this.DatosPagosAnticipos.folioMovto = Number(this.DatosPagosAnticipos.cuentaBanco);
    this.DatosPagosAnticipos.importeCFDIPago = this.DatosPagosAnticipos.importePago;

    for (const iterator of this.ListaMovimientosCliente) {
      if (iterator.isSeleccionado === true){
        this.DatosFacturas = new Admccobdat003();
        this.DatosFacturas.ADMCCOBDAT004_Id = iterator.idFactura;
        this.DatosFacturas.ADMCCOBDAT003_Activo = 1;
        this.DatosFacturas.ADMCCOBDAT002_Id = 0;
        this.DatosFacturas.ADMCCOBDAT002_Importe = Number(iterator.dolares);
        this.DatosPagosAnticipos.DatosFactura.push(this.DatosFacturas);
      }
    }

    if (TotalPago < this.DatosPagosAnticipos.importePago){
      this.DatosFacturas = new Admccobdat003();
      this.DatosFacturas.ADMCCOBDAT004_Id = 0;
      this.DatosFacturas.ADMCCOBDAT003_Activo = 1;
      this.DatosFacturas.ADMCCOBDAT002_Id = 0;
      this.DatosFacturas.ADMCCOBDAT002_Importe = Number(this.DatosPagosAnticipos.importePago - TotalPago);
      this.DatosPagosAnticipos.DatosFactura.push(this.DatosFacturas);
    }

    this.blockUI.start('Guardando Pagos...');
    this.Servicios.GuardarPagos(this.DatosPagosAnticipos).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.data.rsultado > 0){
        swal.fire('Éxito', 'Se ha guardado el Pago correctamente con el folio: ' + res.data.rsultado, 'success');
        this.DatosPagosAnticipos = new PagosAnticipos();
        this.DatosPagosAnticipos.DatosFactura = [];
        this.ListaMovimientosCliente = [];
        this.clienteText = '';
        this.idTipoMoneda = 0;
        this.ngOnInit();
      }
    }, (error: any) => {
      this.blockUI.stop();
      swal.fire(
        'Información',
        'Ha Ocurrio un Error al Momento de Cargar la Informacion las cuentas contables,' +
          ' Favor de Comunicarse con el Área de Informatica y Generar un Reporte de Fallas,' +
          ' <strong>Código de Error: ' + error.error.error + '</strong>',
        'error'
      );
    });
  }

  AplicarModificacionFactura(): void{
    for (const iterator of this.ListaMovimientosCliente) {
      if (iterator.documento === this.mdlFolioFactura){
        if (iterator.monedaNacional !== this.mdlFacturaImporteMN || iterator.dolares !== this.mdlFacturaDolares){
          swal.fire({
            title: '',
            text: 'No se esta cumpliendo con el requisito de Pago en una Sola Exhibición...Favor de avisar al Cliente ¿Desea aplicar la Factura?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: '<i class="fa fa-undo"></i> No',
            confirmButtonText: '<i class="fa fa-times"></i> Si',
          }).then((result) => {
            if (result.value) {
              if (iterator.tipoCambio === 1){ // Moneda Nacional
                if (this.mdlFacturaImporteMN <= iterator.monedaNacional && this.mdlFacturaImporteMN > 0){
                  iterator.monedaNacional = this.mdlFacturaImporteMN;
                  iterator.dolares = this.mdlFacturaImporteMN;
                }
              } else {
                if (this.mdlFacturaDolares <= iterator.dolares && this.mdlFacturaDolares > 0){
                  iterator.monedaNacional = this.mdlFacturaDolares * this.mdlFacturaTipoCambio;
                  iterator.dolares = this.mdlFacturaDolares;
                  iterator.tipoCambio = this.mdlFacturaTipoCambio;
                }
              }
              this.GridFacturas.refreshData();
              this.GridFacturasAplicar.refreshData();
              this.mdlFolioFactura = '';
              this.mdlFacturaImporteMN = 0;
              this.mdlFacturaDolares = 0;
              this.mdlFacturaTipoCambio = 0;
              this.modalModImporteFactura.closeModal();
            } else {
              iterator.isSeleccionado = false;
              if (iterator.tipoCambio === 1){ // Moneda Nacional
                if (this.mdlFacturaImporteMN <= iterator.monedaNacional && this.mdlFacturaImporteMN > 0){
                  iterator.monedaNacional = this.mdlFacturaImporteMN;
                  iterator.dolares = this.mdlFacturaImporteMN;
                }
              } else {
                if (this.mdlFacturaDolares <= iterator.dolares && this.mdlFacturaDolares > 0){
                  iterator.monedaNacional = this.mdlFacturaDolares * this.mdlFacturaTipoCambio;
                  iterator.dolares = this.mdlFacturaDolares;
                  iterator.tipoCambio = this.mdlFacturaTipoCambio;
                }
              }
              this.GridFacturas.refreshData();
              this.mdlFolioFactura = '';
              this.mdlFacturaImporteMN = 0;
              this.mdlFacturaDolares = 0;
              this.mdlFacturaTipoCambio = 0;
              this.modalModImporteFactura.closeModal();
            }
          });
        }
      }
    }
  }

  GetCuentasExedentes(): void {
    this.Servicios.GetCuentasExcedentes().subscribe((res: any) => {
      if (res.data.length > 0){
        this.ltsCuentasExcendentes = res.data;
      }
    }, (error: any) => {
      swal.fire(
        'Información',
        'Ha Ocurrio un Error al Momento de Cargar la Informacion las cuentas contables,' +
          ' Favor de Comunicarse con el Área de Informatica y Generar un Reporte de Fallas,' +
          ' <strong>Código de Error: ' + error.error + '</strong>',
        'error'
      );
    });
  }

  BuscarDocumentos(): void {
    this.blockUI.start('Buscando Documentos...');
    this.Servicios.GetPagosAnticiposByDocumento(this.datosModificar.documento).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.data.length > 0){
        this.datosModificar = {id: 0, folio: 0, documento: '', tipoCambio: 1, importe: 0, importeMN: 0,  idCliente: '', nomCliente: '', moneda: 100, cancelado: 0, nombreMoneda: '', idTipoCartera: 0, nomTipoCartera: '', idTipoMovimiento: '', fecha: '', cuentaBanco: '', cheque: '', folioMovimiento: '', cfdiPagos: 0};
        this.datosModificar.documento = res.data[0].documento;
        this.datosModificar.tipoCambio = res.data[0].tipoCambio;
        this.datosModificar.importe = res.data[0].importe;
        this.datosModificar.importeMN = (res.data[0].importe * res.data[0].tipoCambio);
        this.datosModificar.nomTipoCartera = res.data[0].idTipoCartera + ' ' + res.data[0].nombreTipoCartera;
        this.datosModificar.fecha = res.data[0].fecha;
        this.datosModificar.cuentaBanco = res.data[0].cuentaBanco;
        this.datosModificar.moneda = res.data[0].moneda;
        this.datosModificar.nombreMoneda = res.data[0].moneda + ' ' + res.data[0].nombreMoneda;
        this.datosModificar.cheque = res.data[0].cheque;
        this.datosModificar.nomCliente = res.data[0].idCliente + ' - ' + res.data[0].nombreCliente;
        this.datosModificar.cfdiPagos = res.data[0].cfdiPagos;
        this.datosModificar.id = res.data[0].id;
        this.datosModificar.folio = res.data[0].folio;

        this.relacionar = true;
      } else {
        swal.fire('Información', 'No se encontro información del documento seleccionado o este ya cuenta con facturas aplicadas', 'info');
      }
    }, (error: any) => {
      this.blockUI.stop();
      swal.fire('Información', 'Error al ejecutar el proceso de busqueda de documentos' + error.error, 'error');
    });
  }

  Importes(e: any): void {
    this.datosModificar.importeMN = this.datosModificar.importe * this.datosModificar.tipoCambio;
  }

  async ModificarMovimientos(): Promise<void> {
    /*let saldoDeposito = 0;
    let tcDeposito = 0;
    let monedaDeposito = '0';
    let fechaDeposito = '';*/

    if (this.datosModificar.cfdiPagos === 1){
      swal.fire('Advertencia', 'El documento esta relacionado a un CFDI con complemento de pago', 'info');
      return;
    }

    /*const dtsSaldos: any = await this.Servicios.GetSaldoDocumento(this.datosModificar.cuentaBanco, this.datosModificar.documento);
    if (dtsSaldos.data.length > 0){
      saldoDeposito = dtsSaldos.data[0].saldo;
      monedaDeposito = dtsSaldos.data[0].monedaDeposito;
      tcDeposito = dtsSaldos.data[0].tipoCambio;
      fechaDeposito = dtsSaldos.data[0].fecha;

      const FechaPago = new Date(this.datosModificar.fecha);
      const FechaDeposito = new Date(fechaDeposito);

      if (FechaDeposito < FechaDeposito){
        swal.fire('Información', 'La fecha del Documento no puede ser menor a la Fecha del Depósito referenciado, Favor de Verificar:', 'info');
        return;
      }

      const dtsValidaFechas: any = await this.Servicios.GetFechaValidasPeriodo();
      const FechaInicio = new Date(dtsValidaFechas.data[0].fechaInicio);
      const FechaFin = new Date(dtsValidaFechas.data[0].fechaFinal);
      const FechaIngreso = new Date(this.datosModificar.fecha);

      if (FechaIngreso < FechaInicio || FechaIngreso > FechaFin){
        swal.fire('Información', 'Fecha fuera del periodo, solo tiene acceso al rango del ' + this.datePipe.transform(FechaInicio, 'yyyy/MM/dd')  + ' al ' + this.datePipe.transform(FechaFin, 'yyyy/MM/dd'), 'info');
        return;
      }
    }*/

    this.DatosPagosAnticipos.id = this.datosModificar.id;
    this.DatosPagosAnticipos.folio = Number(this.datosModificar.documento);
    this.DatosPagosAnticipos.cuentaBanco = this.datosModificar.cuentaBanco;
    this.DatosPagosAnticipos.cheque = this.datosModificar.cheque;
    this.DatosPagosAnticipos.importe = Number(this.datosModificar.importe);
    this.DatosPagosAnticipos.moneda = this.datosModificar.moneda.toString();
    this.DatosPagosAnticipos.importeCFDIPago = Number(this.datosModificar.importe);
    this.DatosPagosAnticipos.tipoCambio = Number(this.datosModificar.tipoCambio);


    this.blockUI.start('Modificando Pago...');
    this.Servicios.ModificarMovimientos(this.DatosPagosAnticipos).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.data.rsultado > 0){
        swal.fire('Información', 'El pago ha sido modificado el folio con éxito', 'success');
        this.datosModificar = {id: 0, folio: 0, documento: '', tipoCambio: 1, importe: 0, importeMN: 0,  idCliente: '', nomCliente: '', moneda: 100, cancelado: 0, nombreMoneda: '', idTipoCartera: 0, nomTipoCartera: '', idTipoMovimiento: '', fecha: '', cuentaBanco: '', cheque: '', folioMovimiento: '', cfdiPagos: 0};
      }
    }, (error: any) => {
      this.blockUI.stop();
      swal.fire(
        'Información',
        'Ha Ocurrio un Error al Momento de Cargar la Informacion las cuentas contables,' +
          ' Favor de Comunicarse con el Área de Informatica y Generar un Reporte de Fallas,' +
          ' <strong>Código de Error: ' + error.error + '</strong>',
        'error'
      );
    });
  }

  async BuscarDocumentoEliminar(): Promise<void> {
    if (this.datosModificar.documento === null || this.datosModificar.documento === ''){return; }

    /*const validaReferencias: any = await this.Servicios.GetValidaReferenciasApliadas(this.datosModificar.documento);
    if (validaReferencias.data.length > 0){
      if (validaReferencias.data[0].cancelado === 1){
        this.datosModificar = {id: 0, folio: 0, documento: '', tipoCambio: 1, importe: 0, importeMN: 0, idCliente: '', nomCliente: '', moneda: 100, cancelado: 0, nombreMoneda: '', idTipoCartera: 0, nomTipoCartera: '', idTipoMovimiento: '', fecha: '', cuentaBanco: '', cheque: '', folioMovimiento: '', cfdiPagos: 0};
        swal.fire('Información', 'No se puede continuar con la cancelación del pago porque tiene documentos aplicados, para continuar con la cancelacion debe de primero desaplicar los movimientos', 'info');
        return;
      }
    }*/

    this.blockUI.start('Buscando Datos...');
    const datos: any = await this.Servicios.GetDatosPagosEliminar(this.datosModificar.documento);
    this.blockUI.stop();
    if (datos.data.length > 0){
      this.datosModificar.documento = datos.data[0].documento;
      this.datosModificar.moneda = datos.data[0].moneda;
      this.datosModificar.nombreMoneda = datos.data[0].moneda + ' - ' + datos.data[0].nombreMoneda;
      this.datosModificar.idCliente = datos.data[0].idCliente;
      this.datosModificar.nomCliente = datos.data[0].idCliente + ' - ' + datos.data[0].nombreCliente;
      this.datosModificar.idTipoCartera = datos.data[0].idTipoCartera;
      this.datosModificar.nomTipoCartera = datos.data[0].idTipoCartera + ' - ' + datos.data[0].nombreTipoCartera;
      this.datosModificar.folioMovimiento = datos.data[0].folioMovimiento;
      this.datosModificar.fecha = datos.data[0].fecha;
      this.datosModificar.importe = datos.data[0].importe;
      this.datosModificar.cfdiPagos = datos.data[0].importeAbono;
      this.intCFDIC = datos.data[0].cfdiPagos;
      this.intFolExp = datos.data[0].folioexpor;
    } else {
      swal.fire('Información', 'No se ha encontrado información del pago', 'info');
      this.datosModificar = {id: 0, folio: 0, documento: '', tipoCambio: 1, importe: 0, importeMN: 0, idCliente: '', nomCliente: '', moneda: 100, cancelado: 0, nombreMoneda: '', idTipoCartera: 0, nomTipoCartera: '', idTipoMovimiento: '', fecha: '', cuentaBanco: '', cheque: '', folioMovimiento: '', cfdiPagos: 0};
    }
  }

  EliminarPagos(): void {

    this.DatosPagosAnticipos.folio = Number(this.datosModificar.documento);

    this.blockUI.start('Eliminando Pagos...');
    this.Servicios.EliminarMovimientos(this.DatosPagosAnticipos).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.data.rsultado > 0){
        swal.fire('Información', 'El Pago fue eliminado con éxito', 'success');
        this.datosModificar = {id: 0, folio: 0, documento: '', tipoCambio: 1, importe: 0, importeMN: 0, idCliente: '', nomCliente: '', moneda: 100, cancelado: 0, nombreMoneda: '', idTipoCartera: 0, nomTipoCartera: '', idTipoMovimiento: '', fecha: '', cuentaBanco: '', cheque: '', folioMovimiento: '', cfdiPagos: 0};
      } else {
        swal.fire(
          'Información',
          'Ha Ocurrio un Error al Momento de Cargar la Informacion los movimientos del cliente,' +
            ' Favor de Comunicarse con el Área de Informatica y Generar un Reporte de Fallas,',
          'error'
        );
      }
    }, (error: any) => {
      this.blockUI.stop();
      swal.fire(
        'Información',
        'Ha Ocurrio un Error al Momento de Cargar la Informacion los movimientos del cliente,' +
          ' Favor de Comunicarse con el Área de Informatica y Generar un Reporte de Fallas,' +
          ' <strong>Código de Error: ' + error.error + '</strong>',
        'error'
      );
    });
  }

  async ModChangeCuentaBanco(): Promise<void> {
    if (this.datosModificar.cuentaBanco === '' || this.datosModificar.cuentaBanco === null){ return; }

    const datosBanco: any = await this.Servicios.GetDatosBancoPorClaveTipoCambio(this.datosModificar.cuentaBanco.trim());
    if (datosBanco.data.length <= 0) {
      swal.fire('Información', 'No se encontraron datos de la cuenta de banco', 'info');
      return;
    }

    this.datosModificar.moneda = datosBanco.data[0].moneda;
    this.idTipoMoneda = Number(this.datosModificar.moneda);
    this.datosModificar.tipoCambio = 1;
    this.datosModificar.nombreMoneda = datosBanco.data[0].nombreMoneda;
    this.datosModificar.cuentaBanco = datosBanco.data[0].numeroCuenta;

    if (datosBanco.data[0].monedaDeposito !== 0){
      const dtsTipoCambio: any = await this.Servicios.GetTipoCambio(this.datosModificar.fecha);
      if (dtsTipoCambio.data.length <= 0){
        swal.fire('Información', 'No se puede especificar el tipo de Moneda, por que no tiene especificado el tipo de cambio por bancos del día', 'info');
        return;
      }
      this.datosModificar.tipoCambio = dtsTipoCambio.data[0].tipoCambio;
    }
    this.ModChangeTipoCambio();
  }

  ModChangeTipoCambio(): void {
    this.datosModificar.importeMN = this.datosModificar.importe * this.datosModificar.tipoCambio;
  }

  GetDocumentosAplicar(aplicar: boolean): void {
    if (this.DatosAplicar.folioPago === 0 || this.DatosAplicar.folioPago === null) {
      swal.fire('Información', 'Favor de capturar el folio del pago...', 'info');
      return;
    }

    this.blockUI.start('Buscando Datos Folios....');
    this.Servicios.GetDatosPagosAplicar(this.DatosAplicar.folioPago).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.data.length > 0){
        this.DatosAplicar = res.data[0];
        this.DatosAplicar.nombreCliente =  res.data[0].idCliente + ' - ' + res.data[0].nombreCliente;
        this.DatosAplicar.nombreTipoCartera =  res.data[0].idTipoCartera + ' - ' + res.data[0].nombreTipoCartera;
        this.DatosAplicar.nombreMoneda = res.data[0].idMoneda.toString() + ' - ' + res.data[0].nombreMoneda;
        if (aplicar === true){
          this.buscarMovimientosCliente(this.DatosAplicar.codigoCliente.toString());
        }else{
          this.getFacturasByPago(res.data[0].idPago);
        }
      } else {
        swal.fire('Información', 'No se encontraron movimientos relacionados al pago', 'info');
        this.DatosAplicar = new Pagos();
        this.ListaMovimientosCliente = [];
      }
    }, (error: any) => {
      this.blockUI.stop();
      swal.fire('Error', 'Error al obtener datos de documentos', 'error');
    });
  }

  GetDocumentosDesAplicar(): void {

    if (this.DatosAplicar.folioPago === 0 || this.DatosAplicar.folioPago === null) {
      swal.fire('Información', 'Favor de capturar el folio del pago...', 'info');
      return;
    }

    this.blockUI.start('Buscando Datos Folios....');
    this.Servicios.GetDatosPagosDesAplicar(this.DatosAplicar.folioPago).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.data.length > 0){
        this.DatosAplicar = res.data[0];
        this.DatosAplicar.nombreCliente =  res.data[0].idCliente + ' - ' + res.data[0].nombreCliente;
        this.DatosAplicar.nombreTipoCartera =  res.data[0].idTipoCartera + ' - ' + res.data[0].nombreTipoCartera;
        this.DatosAplicar.nombreMoneda = res.data[0].idMoneda.toString() + ' - ' + res.data[0].nombreMoneda;

        this.getFacturasByPago(res.data[0].idPago);
      } else {
        swal.fire('Información', 'No se encontraron movimientos relacionados al pago o es el pago origen', 'info');
        this.DatosAplicar = new Pagos();
        this.ListaMovimientosCliente = [];
      }
    }, (error: any) => {
      this.blockUI.stop();
      swal.fire('Error', 'Error al obtener datos de documentos', 'error');
    });
  }

  getFacturasByPago(folioPago: any): void {
    this.blockUI.start('Buscando Movimientos del Cliente...');
    this.Servicios.ListaMovimientosClientesByFolioPago(this.filtrosPag, folioPago).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.data.length > 0){
        this.ListaMovimientosCliente = res.data;
      }else {
        swal.fire('Información', 'No se han encontrado datos de los movimientos del cliente seleccionado', 'info');
        this.ListaMovimientosCliente = [];
        this.DatosAplicar = new Pagos();
      }
    }, (error: any) => {
      this.blockUI.stop();
      swal.fire(
        'Información',
        'Ha Ocurrio un Error al Momento de Cargar la Informacion los movimientos del cliente,' +
          ' Favor de Comunicarse con el Área de Informatica y Generar un Reporte de Fallas,' +
          ' <strong>Código de Error: ' + error.error + '</strong>',
        'error'
      );
    });
  }

  AplicarPagos(): void {

    this.DatosPagosAnticipos.importePago = this.DatosAplicar.importeAbono;
    this.DatosPagosAnticipos.id = this.DatosAplicar.idPago;
    this.DatosPagosAnticipos.folio = this.DatosAplicar.folioPago;
    this.DatosPagosAnticipos.documento = this.DatosAplicar.folioPago;
    this.DatosPagosAnticipos.idTipoMovto = this.DatosAplicar.idTipoMovimiento;
    this.DatosPagosAnticipos.fecha = this.datePipe.transform(this.DatosAplicar.fecha, 'yyyyMMdd');
    this.DatosPagosAnticipos.importe = Number(this.DatosAplicar.importeAbono);
    this.DatosPagosAnticipos.moneda = this.DatosAplicar.idMoneda.toString();
    this.DatosPagosAnticipos.tipoCambio = this.DatosAplicar.tipoCambio;
    this.DatosPagosAnticipos.idTipoCartera = this.DatosAplicar.idTipoCartera;
    this.DatosPagosAnticipos.folioMovto = Number(this.DatosAplicar.cuentaBanco);
    this.DatosPagosAnticipos.importeCFDIPago = Number(this.DatosAplicar.importeAbono);
    this.DatosPagosAnticipos.folioAnterior = this.DatosAplicar.folioAnterior;
    this.DatosPagosAnticipos.folioOrigen = this.DatosAplicar.folioOrigen;
    this.DatosPagosAnticipos.idCliente = this.DatosAplicar.codigoCliente.toString();
    this.DatosPagosAnticipos.cuentaBanco = this.DatosAplicar.cuentaBanco;

    let TotalPago = 0;
    for (const iterator of this.ListaMovimientosCliente) {
        if (iterator.isSeleccionado === true){
          TotalPago = TotalPago + iterator.dolares;
        }
    }

    if (TotalPago > this.DatosPagosAnticipos.importePago){
      swal.fire('Información', 'El importe de las facturas seleccionadas sobrepasa el pago favor de modificar el importe de las facturas seleccionadas', 'error');
      return;
    }

    /*if (TotalPago < this.DatosPagosAnticipos.importePago){
      this.DatosPagosAnticipos.tieneRemanente = 1;
      this.DatosPagosAnticipos.totalRemanente = this.DatosPagosAnticipos.importePago - TotalPago;
    } else {
      this.DatosPagosAnticipos.tieneRemanente = 0;
    }*/


    for (const iterator of this.ListaMovimientosCliente) {
      if (iterator.isSeleccionado === true){
        this.DatosFacturas = new Admccobdat003();
        this.DatosFacturas.ADMCCOBDAT004_Id = iterator.idFactura;
        this.DatosFacturas.ADMCCOBDAT003_Activo = 1;
        this.DatosFacturas.ADMCCOBDAT002_Id = this.DatosAplicar.idPago;
        this.DatosFacturas.ADMCCOBDAT002_Importe = Number(iterator.dolares);
        this.DatosPagosAnticipos.DatosFactura.push(this.DatosFacturas);
      }
    }

    if (TotalPago < this.DatosPagosAnticipos.importePago){
      this.DatosFacturas = new Admccobdat003();
      this.DatosFacturas.ADMCCOBDAT004_Id = 0;
      this.DatosFacturas.ADMCCOBDAT003_Activo = 1;
      this.DatosFacturas.ADMCCOBDAT002_Id = 0;
      this.DatosFacturas.ADMCCOBDAT002_Importe = Number(this.DatosPagosAnticipos.importePago - TotalPago);
      this.DatosPagosAnticipos.DatosFactura.push(this.DatosFacturas);
    }

    this.blockUI.start('Aplicando Pagos...');
    this.Servicios.AplicarPagos(this.DatosPagosAnticipos).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.data.rsultado > 0){
        swal.fire('Éxito', 'Se ha guardado el Pago correctamente con el folio: ' + res.data.rsultado, 'success');
        this.DatosPagosAnticipos = new PagosAnticipos();
        this.DatosPagosAnticipos.DatosFactura = [];
        this.DatosAplicar = new Pagos();
        this.ListaMovimientosCliente = [];
        this.modalAplicar.closeModal();
      }
    }, (error: any) => {
      this.blockUI.stop();
      swal.fire(
        'Información',
        'Ha Ocurrio un Error al Momento de Cargar la Informacion las cuentas contables,' +
          ' Favor de Comunicarse con el Área de Informatica y Generar un Reporte de Fallas,' +
          ' <strong>Código de Error: ' + error.error.error + '</strong>',
        'error'
      );
    });
  }

  DesaplicarMovimientos(): void {
    this.DatosPagosAnticipos.folio = this.DatosAplicar.folioPago;
    swal.fire({
      title: '¿Estas de acuerdo en eliminar las facturas aplicadas a este pago?',
      text: 'Si se elimina el pago de origen se eliminaran todos los pagos refrenciados al folio de origen',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: '<i class="fa fa-undo"></i> Regresar',
      confirmButtonText: '<i class="fa fa-times"></i> Eliminar',
    }).then((result) => {
      if (result.value) {
        this.Servicios.DesAplicarPagos(this.DatosPagosAnticipos).subscribe((res: any) => {
          swal.fire('Información', 'Se eliminaron los datos con exito', 'success');
          this.DatosAplicar = new Pagos();
          this.ListaMovimientosCliente = [];
        }, (error: any) => {
          swal.fire(
            'Información',
            'Ha Ocurrio un Error al Momento de Cargar la Informacion las cuentas contables,' +
              ' Favor de Comunicarse con el Área de Informatica y Generar un Reporte de Fallas,' +
              ' <strong>Código de Error: ' + error.error.error + '</strong>',
            'error'
          );
        });
      }
    });
  }

  llenarListasParaFiltrarDepositos(e: any): void {

    if (e.checked === false ){
      /*this.ListaDepositos.map((data, i) => {
        i === 0 ? data : this.listaClientes.filter(sinRep => {
          return sinRep.idCliente === data.idCliente;
        }).length === 0 ? this.listaClientes.push ({
            idCliente: data.idCliente,
            NombreCliente: data.nombre
        }) : data; });

      this.ListaDepositos.map((data, i) => {
        i === 0 ? data : this.listaDolares.filter(sinRep => {
          return sinRep.dolares === data.dolares;
        }).length === 0 ? this.listaDolares.push ({
          dolares: data.dolares,
        }) : data; });

      this.ListaDepositos.map((data, i) => {
        i === 0 ? data : this.listaPesos.filter(sinRep => {
          return sinRep.dolares === data.dolares;
        }).length === 0 ? this.listaPesos.push ({
          pesos: data.pesos,
        }) : data; });

      this.ListaDepositos.map((data, i) => {
        i === 0 ? data : this.listaCuentaBanco.filter(sinRep => {
          return sinRep.numeroCuenta === data.numeroCuenta;
        }).length === 0 ? this.listaCuentaBanco.push ({
          numeroCuenta: data.numeroCuenta,
        }) : data; });

      this.ListaDepositos.map((data, i) => {
        i === 0 ? data : this.listaReferencias.filter(sinRep => {
          return sinRep.referencia === data.referencia;
        }).length === 0 ? this.listaReferencias.push ({
          referencia: data.referencia,
        }) : data; });*/
    }else {
      this.listaClientes = [];
      this.listaDolares = [];
      this.listaPesos = [];
      this.listaCuentaBanco = [];
      this.listaReferencias = [];
    }
  }

  limpiarFiltrosDepositos(): void {
    this.filtrosDep = {idCliente: null, noCuenta: null, claveRubro: null, fechaIncio: this.datePipe.transform(this.FechaInicio, 'yyyy-MM-dd'), fechaFin: this.datePipe.transform(this.FechaFin, 'yyyy-MM-dd'), referencia: null, todos: false, todosPendientes: false, opcion: 6};
    this.ListaDepositos = [];
    this.listaClientes = [];
    this.listaDolares = [];
    this.listaPesos = [];
    this.listaCuentaBanco = [];
    this.listaReferencias = [];
    this.FechaInicio =  new Date(this.Fecha.getFullYear(), this.Fecha.getMonth(), 1);
    this.FechaFin =  new Date();
  }

  isNumberType(event): boolean{
    return event.charCode >= 48 && event.charCode <= 57  || event.charCode === 46 ? true : false;
  }

  DeshabilitarCargo(): void {
    if (Number(this.datosCuenta.cargo) !== 0){
      this.DisableAbono = false;
      this.datosCuenta.abono = 0;
    }else {
      this.DisableAbono = true;
      this.datosCuenta.abono = 0;
    }
  }

  DeshabilitarAbono(): void {
    if (Number(this.datosCuenta.abono) !== 0){
      this.DisableCargo = false;
      this.datosCuenta.cargo = 0;
    }else {
      this.DisableCargo = true;
      this.datosCuenta.cargo = 0;
    }
  }

  ActualizarPoliza(): void {

    const FechaIngreso: Date = new Date(this.DatosPagosAnticipos.fechaIngreso);
    const FechaPrincipal: Date = new Date(this.DatosPagosAnticipos.fechaDeposito);

    const FechaMA: Date = new Date(FechaPrincipal.getFullYear(), FechaPrincipal.getMonth(), 0);
    console.log(FechaMA);
  }

  changeTodosDepositos(): void{
  }

  ChangeTipoMovimiento(e): void {
    this.idTipoMovimiento = e;
    this.DatosPagosAnticipos.idTipoMovto = this.idTipoMovimiento;
  }

  changeTipoMoneda(e): void {
    this.idTipoMoneda = e;
  }

  ChangeClaveRubro(e): void {
    this.claveRubro = e;
    this.filtrosDep.claveRubro = this.claveRubro;
  }

  openModalDepositos(): void {
    this.filtrosDep.claveRubro = '0044';
    this.claveRubro = '0044';
    this.filtrosDep.todos = false;
    this.filtrosDep.todosPendientes = true;

    this.modalDepositos.openModal();
  }

  closeModalDepositos(): void {
    this.modalDepositos.closeModal();
    this.limpiarFiltrosDepositos();
  }

  openModalClientes(): void {
    this.contModalClientes.cargar();
    this.modalClientes.openModal();
  }

  closeModalClientes(): void {
    this.modalClientes.closeModal();
    this.contModalClientes.limpiar();
  }

  openModalAgregarPoliza(): void {
    this.modalAgregarPoliza.openModal();
  }

  closeModalAgregarPoliza(): void {
    this.modalAgregarPoliza.closeModal();
    this.datosCuenta = {numeroCuenta: '', nombreCuenta: '', cargo: 0, abono: 0, concepto: '', id: 0};
    this.DisableCargo = true;
    this.DisableAbono = true;
  }

  openModalSigma(): void {
    let TotCargo = 0;
    let TotMN = 0;

    for (const iterator of this.ListaMovimientosCliente) {
      if (iterator.isSeleccionado === true){
        if (this.MonedaPago === 0){
          TotCargo = TotCargo + iterator.monedaNacional;
          TotMN = TotCargo;
        } else {
          TotCargo = TotCargo + iterator.dolares;
          TotMN = TotMN + (iterator.dolares * iterator.tipoCambio);
        }
      }
    }

    if (this.MonedaPago === 0){
      this.LabCargo = 0;
      this.LabAbono = 0;
      this.LabDif = 0;
      this.LabMN0 = this.DatosPagosAnticipos.importeMNPago;
      this.LabMN1 = TotCargo;
      this.LabMN2 = this.LabMN0 - TotCargo;
    } else {
      this.LabCargo = TotCargo;
      this.LabAbono = this.DatosPagosAnticipos.importePago;
      this.LabDif = this.LabAbono - this.LabCargo;
      this.LabMN0 = this.DatosPagosAnticipos.importeMNPago;
      this.LabMN1 = TotMN;
      this.LabMN2 = this.LabMN0 - TotMN;
    }

    this.modalSigma.openModal();
  }

  closeModalSigma(): void {
    this.modalSigma.closeModal();
  }

  openModalEditarMovimientos(): void {
    this.modalModificacionMovimientos.openModal();
  }

  closeModalEditarMovimientos(): void {
    this.modalModificacionMovimientos.closeModal();
    this.datosModificar = {id: 0, folio: 0, documento: '', tipoCambio: 1, importe: 0, importeMN: 0,  idCliente: '', nomCliente: '', moneda: 100, cancelado: 0, nombreMoneda: '', idTipoCartera: 0, nomTipoCartera: '', idTipoMovimiento: '', fecha: '', cuentaBanco: '', cheque: '', folioMovimiento: '', cfdiPagos: 0};
  }

  openModalEliminarPagos(): void {
    this.modalEliminarPagos.openModal();
  }

  closeModalEliminarPagos(): void {
    this.modalEliminarPagos.closeModal();
  }

  openModalAplicar(): void {
    this.modalAplicar.openModal();
  }

  closeModalAplicar(): void {
    this.modalAplicar.closeModal();
    this.datosAplicar = {fecha: '', tipoCambio: 1, abono: 0, idCliente: '', nombreCliente: '', moneda: 1000, nombreMoneda: '', cancelado: 0, documento: '', cuentaBanco: '', idTipoCartera: 0, nomTipoCartera: '', idTipoMovto: 0, folioMovto: 0, nacExpPit: '', rfc: '', cfdiPagos: 0, repetitivo: '', folioExportado: 0};
    this.DatosAplicar = new Pagos();
    this.DatosAplicar.idPago = 0;
    this.DatosAplicar.folioPago = 0;
    this.ListaMovimientosCliente = [];
  }

  openModalDesAplicar(): void {
    this.columnGridFacturas = [
      {
        headerName: 'Factura',
        field: 'documento',
        flex: 4,
        minWidth: 90,
        headerClass: 'header-center header-grid-left',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Dolares',
        field: 'dolares',
        flex: 4,
        minWidth: 80,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'M.N.',
        field: 'monedaNacional',
        flex: 4,
        minWidth: 120,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center',
        cellRendererParams: {
          type: 'num'
        }
      },
      {
        headerName: 'Tipo Cambio',
        field: 'tipoCambio',
        flex: 4,
        minWidth: 120,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        flex: 4,
        minWidth: 110,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'NEP',
        field: 'nacExpPit',
        flex: 2,
        minWidth: 60,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Importe IVA',
        field: 'importeIVA',
        flex: 4,
        minWidth: 120,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Importe Retención',
        field: 'importeRetencion',
        flex: 4,
        minWidth: 170,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Importe Total',
        field: 'importeTotal',
        flex: 4,
        minWidth: 120,
        headerClass: 'header-center header-grid',
        cellClass: 'grid-cell-center'
      },
      {
        headerName: 'Tasa IVA',
        field: 'iva',
        flex: 4,
        minWidth: 80,
        headerClass: 'header-center header-grid-right',
        cellClass: 'grid-cell-center'
      }
    ];
    this.modalDesAplicar.openModal();
  }

  closeModalDesAplicar(): void {
    this.modalDesAplicar.closeModal();
    this.datosAplicar = {fecha: '', tipoCambio: 1, abono: 0, idCliente: '', nombreCliente: '', moneda: 1000, nombreMoneda: '', cancelado: 0, documento: '', cuentaBanco: '', idTipoCartera: 0, nomTipoCartera: '', idTipoMovto: 0, folioMovto: 0, nacExpPit: '', rfc: '', cfdiPagos: 0, repetitivo: '', folioExportado: 0};
    this.DatosAplicar = new Pagos();
    this.DatosAplicar.idPago = 0;
    this.DatosAplicar.folioPago = 0;
    this.ListaMovimientosCliente = [];
  }
}
