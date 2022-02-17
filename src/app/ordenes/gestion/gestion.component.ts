import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { RestApiService } from 'src/app/services/rest-api.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit {
  
  public TRABAJOS = [];
  public MAQUINAS;
  public NUEVA_GESTION:boolean = false;
  public FASE = 'IMPRESION';
  public GESTIONES;
  public LAST_ONE;
  public HOY = moment().format('yyyy-MM-DD');
  public FASES = [];
  public FUNCIONES = [];

  constructor(private api:RestApiService) { }

  ngOnInit(): void {
    this.Tarea();
    this.getMaquinas();
    this.getGestiones();
  }

  modal_nueva_gestion(){
    if(!this.NUEVA_GESTION){
      this.NUEVA_GESTION = true
    }else{
      this.NUEVA_GESTION = false
    }
  }
  fase(e){
    this.FASE = e.target.value;
    this.TRABAJOS = [];
    this.Tarea();
  }

  getMaquinas(){
    this.api.GetMaquinas()
      .subscribe(resp =>{
        this.MAQUINAS = resp
        this.obtenerTipos();
      })
  }

  obtenerTipos(){
    let x = this.MAQUINAS.length;
    for(let i = 0; i< x; i++){
      let inde = this.FUNCIONES.includes(this.MAQUINAS[i].tipo)
      if(!inde){
        this.FUNCIONES.push(this.MAQUINAS[i].tipo)
      }
    }
  }

  calcular_Productos(e){
    let value_hojas = e.target.value;
    let orden =  (<HTMLInputElement>document.getElementById('orden_selected')).value;

    let Ejemplares = this.TRABAJOS.find(x => x._id == orden);


    const productos:any = value_hojas * Ejemplares.orden.producto.ejemplares;

    (<HTMLInputElement>document.getElementById('productos_input')).value = productos;
  }

  calcular_Hojas(e){
    let value_productos = e.target.value;

    let orden =  (<HTMLInputElement>document.getElementById('orden_selected')).value;

    let Ejemplares = this.TRABAJOS.find(x => x._id == orden);

    const productos:any = value_productos / Ejemplares.orden.producto.ejemplares;

    (<HTMLInputElement>document.getElementById('hojas_input')).value = productos;
  }

  retrasar(TrabajoId:any, fecha:any, OrdenId:any, fechaI){

    let data = {
      trabajo:TrabajoId,
      fecha:fecha,
      orden:OrdenId,
      fechaI:fechaI
    }

    this.api.postRestrasar(data)
      .subscribe((resp:any)=>{
        console.log(resp)
        this.TRABAJOS = [];
        this.Tarea();
      })
  }

  acelerar(TrabajoId:any, fecha:any, OrdenId:any){

    let data = {
      trabajo:TrabajoId,
      fecha:fecha,
      orden:OrdenId
    }

    this.api.postAcelerar(data)
      .subscribe((resp:any)=>{
        console.log(resp)
        this.TRABAJOS = [];
        this.Tarea();
      })
  }

  finalizar(){

    let hoy = moment().format('yyyy-MM-DD');
    let orden =  ''
    let productos = ''
    let hojas = ''

    orden =  (<HTMLInputElement>document.getElementById('orden_selected')).value;
    let Ejemplares = this.TRABAJOS.find(x => x._id == orden);

    productos = (<HTMLInputElement>document.getElementById('productos_input')).value
    hojas = (<HTMLInputElement>document.getElementById('hojas_input')).value

    let restante = this.GESTIONES.filter(x=> x.orden == orden)

    let long = restante.length

    let _productos = 0;
    let _hojas = 0;

    if(long <= 0){
      console.log(orden)
      let Actual = this.TRABAJOS.find(x=> x._id == orden)
      console.log(Actual)
      _productos = Actual.orden.cantidad - Number(productos);
      _hojas = Actual.orden.paginas - Number(hojas)
    }else{
      _productos = restante[long - 1].Rproductos-Number(productos)
      _hojas = restante[long - 1].Rhojas - Number(hojas)
    }

    let data = {
      orden : orden,
      fecha : hoy,
      maquina: Ejemplares.maquina._id,
      productos:productos,
      hojas:hojas,
      Rproductos:_productos,
      Rhojas:_hojas
    }

    this.api.postGestion(data)
      .subscribe((resp:any)=>{
        (<HTMLInputElement>document.getElementById('productos_input')).value = '';
        (<HTMLInputElement>document.getElementById('hojas_input')).value = '';
        this.modal_nueva_gestion();
        this.getGestiones();
      })


  }

  getGestiones(){
    this.api.getGestiones()
      .subscribe((resp:any)=>{
        this.GESTIONES = resp
      })
  }


  Tarea(){
    let hoy = moment().format('yyyy-MM-DD');
    
    this.api.getTrabajos()
      .subscribe((resp:any)=>{

        let nuevo = resp.filter(x => x.maquina.tipo === this.FASE);

        if(nuevo){
          let Long = nuevo.length;
          for(let i=0; i<Long; i++){
    
            if(hoy >= nuevo[i].fechaI){
              if(hoy <= nuevo[i].fecha){
                this.TRABAJOS.push(nuevo[i])
              }
            }
    
          }
        }
      })
  }

}

