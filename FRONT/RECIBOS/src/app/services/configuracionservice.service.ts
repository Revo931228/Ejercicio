import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const URL_CONFIGURACION = environment.AMDCCOBAPI001 + 'Configuracion/';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionserviceService {

  constructor(private http: HttpClient) { }

  getConfiguracion() 
  {
    const url = `${URL_CONFIGURACION}getConfiguracion`;
    return this.http.get(url);
  }

  guardarcomision(Datos: any): any {
    const url = URL_CONFIGURACION + 'guardarconfiguracion';
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post(url, Datos, httpOptions);
  }


}
