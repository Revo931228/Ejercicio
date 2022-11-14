import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';
import { RecibosservicesService} from 'src/app/services/recibosservices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  idUsuario = '';
  password = '';
  @BlockUI() blockUI: NgBlockUI;

  constructor(public Servicios: RecibosservicesService, private router: Router) { }

  ngOnInit(): void {
  }

  BuscarUsuarios(): void {
    if (this.idUsuario === '' || this.idUsuario === null || this.idUsuario === undefined){
      Swal.fire('Información', 'Es necesario capturar el Id Usuario para ingresar', 'info');
      return;
    }

    if (this.password === '' || this.password === null || this.password === undefined){
      Swal.fire('Información', 'Es necesario capturar la contraseña para ingresar', 'info');
      return;
    }

    this.blockUI.start('Validando...');
    this.Servicios.ValidarUsuarios(this.idUsuario, this.password).subscribe((res: any) => {
      this.blockUI.stop();
      if (res.data.length > 0){
        this.router.navigate(['/recibos/administracion', res.data[0].idUsario]);
      } else {
        Swal.fire('Información', 'Contraseña incorrecta o el usuario no esta registrado', 'info');
      }
    }, (error: any) => {
      this.blockUI.stop();
      Swal.fire('Información', 'Ha ocurrido un error: ' + error.error, 'error');
    });
  }

}
