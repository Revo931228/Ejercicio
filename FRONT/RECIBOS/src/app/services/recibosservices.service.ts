import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Recibos } from '../models/Recibos/Recibos';

const URL =  environment.APIRECIBOS + 'Recibo/';

@Injectable({
  providedIn: 'root'
})

export class RecibosservicesService {

  constructor(public http: HttpClient) { }

  ValidarUsuarios(usuario: any, password: string): any {
    const url = URL + 'GetUsuarios';
    const params = new HttpParams()
    .append('IdUsuario', usuario)
    .append('Password', password);
    return this.http.get(url, { params });
  }

  ListarProveedores(filtroProveedor: string): any {
    const url = URL + 'GetProveedores';
    const params = new HttpParams()
    .append('BusquedaProveedor', filtroProveedor);
    return this.http.get(url, { params });
  }

  ListarMoneda(): any {
    const url = URL + 'GetMonedas';
    return this.http.get(url);
  }

  ListarRecibos(idRecibo: any, usuario: any): any {
    const url = URL + 'GetRecibos';
    const params = new HttpParams()
    .append('IdRecibo', idRecibo)
    .append('Usuario', usuario);
    return this.http.get(url, { params });
  }

  GuardarRecibo(Dts: Recibos): Observable <any> {
    const url = URL + 'GuardarRecibo';
    return this.http.post(url, Dts);
  }

  ActualizarRecibo(Dts: Recibos): Observable <any> {
    const url = URL + 'ActualizarRecibo';
    return this.http.post(url, Dts);
  }

  EliminarRecibo(Dts: Recibos): Observable <any> {
    const url = URL + 'EliminarRecibo';
    return this.http.post(url, Dts);
  }
}
