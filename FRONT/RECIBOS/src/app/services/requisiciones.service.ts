import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Requisicion } from 'src/app/models/requisicion/Requisicion';

const URL = environment.ADMCCOBAPI002 + 'Requisiciones/';

@Injectable({
  providedIn: 'root'
})
export class RequisicionesService {

  constructor(public http: HttpClient) { }

  listarArticulos(fil: any): any {
    const url = URL + 'GetArticulos';
    const params = new HttpParams()
      .append('filtro', fil);
    return this.http.get(url, { params });
  }
  GetArticulosNuevos(fil: any): any {
    const url = URL + 'GetArticulosNuevos';
    const params = new HttpParams()
      .append('filtro', fil);
    return this.http.get(url, { params });
  }
  GetArticulosConflicto(fil: any): any {
    const url = URL + 'GetArticulosConflicto';
    const params = new HttpParams()
      .append('filtro', fil);
    return this.http.get(url, { params });
  }

  Guardar(dts: Requisicion): Observable <any> {
    const url = URL + 'Guardar';
    return this.http.post(url, dts);
  }
}
