import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const URL_REPRESENTANTES = environment.AMDCCOBAPI001 + 'RepVentasCartera/';

@Injectable({
  providedIn: 'root'
})
export class RepventascarteraserviceService {

  constructor(private http: HttpClient) { }

  getIndustria() 
  {
    const url = `${URL_REPRESENTANTES}getIndustria`;
    return this.http.get(url);
  }

  ListarRepresentantes(par: any, fil: any): any {
    const url = URL_REPRESENTANTES + 'GetRepresentantes';
    const params = new HttpParams()
      .append('startRow', par.startRow)
      .append('endRow', par.endRow)
    return this.http.get(url, {params});
  }

  ListarComisiones(par: any, fil: any): any {
    const url = URL_REPRESENTANTES + 'getComisiones';
    const params = new HttpParams()
      .append('startRow', par.startRow)
      .append('endRow', par.endRow)
      .append('parIdRepresentantes', fil.idRepresentante)
    return this.http.get(url, {params});
  }

  guardarcomision(Datos: any): any {
    const url = URL_REPRESENTANTES + 'guardarcomision';
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post(url, Datos, httpOptions);
  }

  eliminarcomision(Datos: any): any {
    const url = URL_REPRESENTANTES + 'eliminarcomision';
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post(url, Datos, httpOptions);
  }

  Agregar(Datos: any): any {
    const url = URL_REPRESENTANTES + 'Agregar';
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post(url, Datos, httpOptions);
  }

  Modificar(Datos: any): any {
    const url = URL_REPRESENTANTES + 'Modificar';
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post(url, Datos, httpOptions);
  }

  Eliminar(Datos: any): any {
    const url = URL_REPRESENTANTES + 'Eliminar';
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post(url, Datos, httpOptions);
  }




}
