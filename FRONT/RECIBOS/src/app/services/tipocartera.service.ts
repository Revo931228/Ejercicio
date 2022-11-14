import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
//import { environment } from 'src/environments/environment';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';
const URL_USUARIOERP = environment.FCAVENTAPI001;
@Injectable({
  providedIn: 'root'
})
export class TipoCarteraService {

  constructor(public http: HttpClient) { }

  listarTipoCartera(par: any,fil: any): any {
    const url = URL_USUARIOERP + 'TipoCartera/GetTipoCartera';
    const params = new HttpParams()
      .append('startRow', par.startRow)
      .append('endRow', par.endRow)
      .append('filtro', fil.filtro)
    return this.http.get(url, { params });
  }

  guardarTipoCartera(objEntity): any {
    const url = URL_USUARIOERP+ 'TipoCartera/GuardarTipoCartera';
    
    return this.http.post(url,objEntity);
  }

  editarTipoCartera(objEntity): any {
    const url = URL_USUARIOERP+ 'TipoCartera/EditarTipoCartera';
    
    return this.http.post(url,objEntity);
  }

  urlReporte(): Observable<Object>{
    const url = URL_USUARIOERP + 'TipoCartera/GetURLReporte';
    
    return this.http.get(url);
  }
}
