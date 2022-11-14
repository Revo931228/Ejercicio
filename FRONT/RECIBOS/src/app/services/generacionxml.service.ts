import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { environment } from 'src/environments/environment';

const URL =  environment.ADMCTELAPI001 + 'GeneracionXML/';

@Injectable({
  providedIn: 'root'
})
export class GeneracionxmlService {

  constructor(public http: HttpClient) { }

  GetTiposDocumentos(): any{
    const url = URL + 'GetTiposDocumentos';
    return this.http.get(url);
  }

  GetPeriodosEjercicios(filtro: string): any{
    const url = URL + 'GetPeriodosEjercicios';
    const params = new HttpParams()
    .append('filtro', filtro);
    return this.http.get(url, { params });
  }

  GetTiposSolicitud(): any{
    const url = URL + 'GetTiposSolicitud';
    return this.http.get(url);
  }

  async GetCuentasSinCodigoAgrupador(filtro: any): Promise<object> {
    const url = URL + 'GetCuentasSinCodigoAgrupador';
    const params = new HttpParams()
    .append('filtro', filtro);
    const dts = await this.http.get(url, { params }).toPromise();
    return dts;
  }

  GeneraXML(filtro: any): any{
    const url = URL + 'GeneraXML';
    const params = new HttpParams()
    .append('year', filtro.Year)
    .append('mes', filtro.Mes)
    .append('IdTipoDocumento', filtro.TipoDocumento)
    .append('tipoDocumento', filtro.TipoDoc)
    .append('idTipoSolicitud', filtro.IdTipoSolicitud)
    .append('numeroOrden', filtro.NumeroOrden)
    .append('numeroTramite', filtro.NumeroTramite)
    .append('tipoSolicitud', filtro.TipoSolicitud)
    .append('idPeriodo', filtro.IdPeriodo)
    .append('Opcion', filtro.Opcion)
    .append('tipoEnvio', filtro.TipoEnvio);
    return this.http.get(url, { params });
  }

}
