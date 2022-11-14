export class Polizas {
  numeroCuenta: string;
  nombreCuenta: string;
  cargo: number;
  abono: number;
  concepto: string;
  ListaPolizas: LtsPolizas [] = [];
}

export interface LtsPolizas {
  numeroCuenta?: string;
  nombreCuenta?: string;
  cargo?: number;
  abono?: number;
  concepto?: string;
  id?: number;
}
