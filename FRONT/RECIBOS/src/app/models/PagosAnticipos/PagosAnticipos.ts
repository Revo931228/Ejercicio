import { Admccobdat003 } from './admccobdat003';

export class PagosAnticipos {
  id: number; // folio Indentity
  folio: number; // Folio identificador del pago
  documento: number; // Folio identificador del pago
  idTipoMovto: number;
  fecha: string;
  idCliente: string;
  cuentaBanco: string;
  cheque: string;
  importe: number;
  moneda: string; // Es la variable global MonedaPago
  tipoCambio: number; // Tipo de Cambio del Pago
  idTipoCartera: number; // Variable Global IdTipoCartera
  fechaOrigen: string;
  cancelado: number;
  ultimaFecha: string;
  usuario: string;
  estatus: number;
  docRef: string;
  folioMovto: number;
  folioExportado: number;
  importeCFDIPago: number;
  folioCFDIPago: number;
  // Esto no se que show pero se usan
  deposito: string;
  fechaDeposito: Date;
  importePagoDesposito: number;
  monedaDeposito: string;
  tipoCambioDeposito: number;
  importeMNDeposito: number;
  saldoDeposito: number;
  saldoMNDeposito: number;
  monedaPago: number;
  tipoCambioPago: number;
  importePago: number;
  importeMNPago: number;
  repetitivo: string;
  fechaPago: Date;
  fechaIngreso: Date;
  totalCargo: number;
  totalAbono: number;
  tieneRemanente: number;
  totalRemanente: number;
  folioOrigen: number;
  folioAnterior: number;
  codigoCliente: number;
  DatosFactura: Array<Admccobdat003>;
}
