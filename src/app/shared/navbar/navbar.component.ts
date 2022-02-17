import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private usuarioService:RestApiService) { 
    this.usuario = usuarioService.usuario;
  }

  public usuario: Usuario

  ngOnInit(): void {
  }

  logout(){
    this.usuarioService.logout();
  }

}
