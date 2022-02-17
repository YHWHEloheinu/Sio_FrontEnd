import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/services/rest-api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public ORDENES;
  public ESTADOS;
  public TRABAJOS;

  constructor(private api:RestApiService,
              private router:Router) { }

  ngOnInit(): void {
    this.getOrdenes();
    this.obtenerTrabajos();
  }

  getOrdenes(){
    this.api.getOrden()
      .subscribe((resp:any)=>{
        this.ORDENES = resp;
      })
  }

  alert(id){
    this.router.navigateByUrl(`orden-produccion/${id}`)
  }

  getEstados(id){
    let estado = this.TRABAJOS.find(x => x.orden._id == id && x.maquina.tipo === 'IMPRIMIR')
    let hoy = moment().format('yyyy-MM-DD');

    console.log(estado)
    if(hoy < estado.fechaI){
      return `Impresión Comienza el: ${estado.fechaI}`
    }else{
      let estado2 = this.TRABAJOS.find(x => x.orden._id == id && x.fechaI<= hoy && x.fecha >= hoy)
      return `En proceso de: ${estado2.maquina.tipo}`
    }
  }

  obtenerTrabajos(){
    this.api.getTrabajos()
      .subscribe((resp:any)=>{
        this.TRABAJOS = resp;
      })
  }

}
