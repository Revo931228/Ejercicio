export class Recibos {
  idRecibo: number;
  idProveedor: number;
  nombreProveedor: string;
  idMoneda: number;
  nombreMoneda: string;
  monto: number;
  fecha: string;
  strFecha: string;
  comentario: string;
  idUsuario: number;
  nombreUsuario: string;
  lstRecibos = Array<LtsRecibos>();
}

export interface LtsRecibos {
  idRecibo?: number;
  idProveedor?: number;
  nombreProveedor?: string;
  idMoneda?: number;
  nombreMoneda?: string;
  monto?: number;
  fecha?: string;
  comentario?: string;
  idUsuario?: string;
}
