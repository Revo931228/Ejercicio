import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
//import { environment } from 'src/environments/environment';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';
const URL_USUARIOERP = environment.FCAVENTAPI001;
@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  constructor(public http: HttpClient) { }

  listarUbicaciones(par: any,fil: any): any {
    const url = URL_USUARIOERP + 'Ubicacion/GetUbicacion';
    const params = new HttpParams()
      .append('startRow', par.startRow)
      .append('endRow', par.endRow)
      .append('filtro', fil.filtro)
    return this.http.get(url, { params });
  }

  guardarUbicacion(objEntity): any {
    const url = URL_USUARIOERP+ 'Ubicacion/GuardarUbicacion';
    
    return this.http.post(url,objEntity);
  }

  editarUbicacion(objEntity): any {
    const url = URL_USUARIOERP+ 'Ubicacion/EditarUbicacion';
    
    return this.http.post(url,objEntity);
  }

  urlReporte(): Observable<Object>{
    const url = URL_USUARIOERP + 'Ubicacion/GetURLReporte';
    
    return this.http.get(url);
  }
}
