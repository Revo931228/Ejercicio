import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
//import { environment } from 'src/environments/environment';
import { environment } from '../../../src/environments/environment.prod';
import { Observable } from 'rxjs';
const URL_USUARIOERP = environment.FCAVENTAPI001;
@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(public http: HttpClient) { }

  listarClientes(par: any,fil: any): any {
    const url = URL_USUARIOERP + 'Clientes/getClientes';
    const params = new HttpParams()
      .append('startRow', par.startRow)
      .append('endRow', par.endRow)
      .append('filtro', fil.filtro)
      .append('filtroCliente',fil.filtroCliente)
    return this.http.get(url, { params });
  }

  listarClientesById(id: any): any {
    const url = URL_USUARIOERP + 'Clientes/getClientessById';
    const params = new HttpParams()
      .append('id', id)
    return this.http.get(url, { params });
  }

  guardarClientes(objEntity): any {
    const url = URL_USUARIOERP+ 'Clientes/GuardarClientes';
    
    return this.http.post(url,objEntity);
  }

  editarClientes(objEntity): any {
    const url = URL_USUARIOERP+ 'Clientes/EditarClientes';
    
    return this.http.post(url,objEntity);
  }
  cancelarHabilitados(objEntity): any {
    const url = URL_USUARIOERP+ 'Clientes/CancelarHabilitados';
    
    return this.http.post(url,objEntity);
  }

  urlReporte(): Observable<Object>{
    const url = URL_USUARIOERP + 'Clientes/getURLReporte';
    
    return this.http.get(url);
  }


  tipoCartera(): any{
    const url = URL_USUARIOERP + 'Clientes/GetTipoCartera';
    
    return this.http.get(url);
  }

  listarZonas(): any {
    const url = URL_USUARIOERP + 'Clientes/GetUbicaciones';
    
    return this.http.get(url);
  }

  listarAgente(): any {
    const url = URL_USUARIOERP + 'Clientes/GetAgentes';
    
    return this.http.get(url);
  }

  listarDiasCredito(): any {
    const url = URL_USUARIOERP + 'Clientes/GetDiasCredito';
    
    return this.http.get(url);
  }

  listarHabilitados(par: any): any {
    const url = URL_USUARIOERP + 'Clientes/GetHabilitados';
    const params = new HttpParams()
      .append('startRow', par.startRow)
      .append('endRow', par.endRow)
      .append('idCliente', par.idCliente)
    return this.http.get(url, { params });
  }
}
