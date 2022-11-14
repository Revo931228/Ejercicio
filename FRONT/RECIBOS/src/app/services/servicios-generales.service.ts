import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagosAnticipos } from '../models/PagosAnticipos/PagosAnticipos';

const URL = environment.ADMCTELAPI001 + 'PagosAnticipos/';

@Injectable({
  providedIn: 'root'
})
export class ServiciosGeneralesService {

  constructor(public http: HttpClient) { }

  ListarClientes(par: any, fil: any): any {

    const url = URL + 'getClientes';
    const params = new HttpParams()
      .append('startRow', par.startRow)
      .append('endRow', par.endRow)
      .append('filtro', fil.filtro);
    return this.http.get(url, { params });
  }

  ListarTiposMovimientos(): any {
    const url = URL + 'GetTipoMovimientos';
    return this.http.get(url);
  }

  ListarMonedas(): any {
    const url = URL + 'GetMonedas';
    return this.http.get(url);
  }

  ListarRubros(): any {
    const url = URL + 'GetRubros';
    return this.http.get(url);
  }

  ListaMovimientosClientes(par: any, idCliente: any): any {
    const url = URL + 'GetMovimientosClientes';
    const params = new HttpParams()
      .append('startRow', par.startRow)
      .append('endRow', par.endRow)
      .append('idCliente', idCliente);
    return this.http.get(url, { params });
  }

  ListaMovimientosClientesByFolioPago(par: any, folioPago: any): any {
    const url = URL + 'GetMovimientosClientesByFolioPago';
    const params = new HttpParams()
      .append('startRow', par.startRow)
      .append('endRow', par.endRow)
      .append('folioPago', folioPago);
    return this.http.get(url, { params });
  }

  ListaDepositos(par: any, filtros: any): any {
    const url = URL + 'GetDepositos';
    const params = new HttpParams()
      .append('startRow', par.startRow)
      .append('endRow', par.endRow)
      .append('idCliente', filtros.idCliente)
      .append('noCuenta', filtros.noCuenta)
      .append('claveRubro', filtros.claveRubro)
      .append('fechaInicio', filtros.fechaIncio)
      .append('fechaFin', filtros.fechaFin)
      .append('referencia', filtros.referencia)
      .append('opcion', filtros.opcion);
    return this.http.get(url, { params });
  }

  GetCuentasContables(CuentaContable: string): any {
    const url = URL + 'GetCuentaContable';
    const params = new HttpParams()
      .append('cuenta', CuentaContable);
    return this.http.get(url, { params });
  }

  async GetCuentasContablesDeRepetitivo(Cuenta: string, Concepto: string): Promise<object> {
    const url = URL + 'GetCuentaContableDeRepetitivo';
    const params = new HttpParams()
      .append('cuenta', Cuenta)
      .append('concepto', Concepto);
    const Data = await this.http.get(url, { params }).toPromise();
    return Data;
  }

  async GetConceptosDeCuentas(zona: string, mercado: string, deposito: string, up: string): Promise<object> {
    const url = URL + 'GetConceptosDeCuentas';
    const params = new HttpParams()
      .append('zona', zona)
      .append('mercado', mercado)
      .append('deposito', deposito)
      .append('Up', up);
    const Data = await this.http.get(url, { params }).toPromise();
    return Data;
  }

  async GetCuentasContablesAsync(CuentaContable: string): Promise<object> {
    const url = URL + 'GetCuentaContable';
    const params = new HttpParams()
      .append('cuenta', CuentaContable);
    const Data = await this.http.get(url, { params }).toPromise();
    return Data;
  }

  async GetTipoCambioUltimaFecha(fecha: string): Promise<object> {
    const url = URL + 'GetTipoCambioUltimaFecha';
    const params = new HttpParams()
      .append('fecha', fecha);
    const Data = await this.http.get(url, { params }).toPromise();
    return Data;
  }

  async GetDatosBancoPorClaveTipoCambio(cuentaBanco: string): Promise<object> {
    const url = URL + 'GetDatosBancosXClave';
    const params = new HttpParams()
      .append('cuenta', cuentaBanco);
    const Data = await this.http.get(url, { params }).toPromise();
    return Data;
  }

  async GetTipoCambio(fecha: any): Promise<object> {
    const url = URL + 'GetTipoCambio';
    const params = new HttpParams()
      .append('fecha', fecha);
    const Data = await this.http.get(url, { params }).toPromise();
    return Data;
  }

  async GetPeriodoFiscal(fecha: any, periodo: any): Promise<object> {
    const url = URL + 'GetPeriodoFiscal';
    const params = new HttpParams()
      .append('Fecha', fecha)
      .append('Periodo', periodo);
    const Data = await this.http.get(url, { params }).toPromise();
    return Data;
  }

  async GetFechaValidasPeriodo(): Promise<object> {
    const url = URL + 'GetFechaValidasPeriodo';
    const Data = await this.http.get(url).toPromise();
    return Data;
  }

  async GetCFDIComplementos(factura: any, idCliente: any): Promise<object> {
    const url = URL + 'GetCFDIComplementos';
    const params = new HttpParams()
      .append('factura', factura)
      .append('idCliente', idCliente);
    const Data = await this.http.get(url, { params }).toPromise();
    return Data;
  }

  GetCuentasExcedentes(): any {
    const url = URL + 'GetCuentasExcedentes';
    return this.http.get(url);
  }

  GetPagosAnticiposByDocumento(documento: string): any {
    const url = URL + 'GetDatosPagosModificar';
    const params = new HttpParams()
      .append('documento', documento);
    return this.http.get(url, { params });
  }

  async GetSaldoDocumento(cuentaBanco: any, folioMovimiento: any): Promise<object> {
    const url = URL + 'GetSaldoDocumento';
    const params = new HttpParams()
      .append('cuentaBanco', cuentaBanco)
      .append('folioMovimiento', folioMovimiento);
    const Data = await this.http.get(url, { params }).toPromise();
    return Data;
  }

  async GetValidaMovimientosApliados(cuentaBanco: any): Promise<object> {
    const url = URL + 'GetValidaMovimientosApliados';
    const params = new HttpParams()
      .append('cuentaBanco', cuentaBanco);
    const Data = await this.http.get(url, { params }).toPromise();
    return Data;
  }

  async GetValidaReferenciasApliadas(cuentaBanco: any): Promise<object> {
    const url = URL + 'GetValidaReferenciasApliadas';
    const params = new HttpParams()
      .append('documento', cuentaBanco);
    const Data = await this.http.get(url, { params }).toPromise();
    return Data;
  }

  async GetDatosPagosEliminar(documento: any): Promise<object> {
    const url = URL + 'GetDatosPagosEliminar';
    const params = new HttpParams()
      .append('documento', documento);
    const Data = await this.http.get(url, { params }).toPromise();
    return Data;
  }

  GetDatosPagosAplicar(documento: any): any {
    const url = URL + 'GetDatosPagosAplicar';
    const params = new HttpParams()
      .append('documento', documento);
    return this.http.get(url, { params });
  }

  GetDatosPagosDesAplicar(documento: any): any {
    const url = URL + 'GetDatosPagosDesAplicar';
    const params = new HttpParams()
      .append('documento', documento);
    return this.http.get(url, { params });
  }

  GuardarPagos(dts: PagosAnticipos): Observable <any> {
    const url = URL + 'GuardarPagos';
    return this.http.post(url, dts);
  }

  AplicarPagos(dts: PagosAnticipos): Observable <any> {
    const url = URL + 'AplicarPagos';
    return this.http.post(url, dts);
  }

  DesAplicarPagos(dts: PagosAnticipos): Observable <any> {
    const url = URL + 'DesAplicarPagos';
    return this.http.post(url, dts);
  }

  ModificarMovimientos(dts: PagosAnticipos): Observable <any> {
    const url = URL + 'ModificarPago';
    return this.http.post(url, dts);
  }

  EliminarMovimientos(dts: PagosAnticipos): Observable <any> {
    const url = URL + 'EliminarPago';
    return this.http.post(url, dts);
  }
}
