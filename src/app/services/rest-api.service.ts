import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MaquinaInterface } from '../interface/maquinas.interfase';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {


  api_url = environment.api;

  constructor(public http:HttpClient,
              private router:Router) { }

  public usuario!:Usuario;

  get token():string{
    return localStorage.getItem('token') || '';
  }
  get headers(){
    return {
      'Authorization':this.token
    }
   }

  // **************************************************************************
  // **************************** MAQUINAS ************************************
  // ************************************************************************** 

  GetMaquinas(){
    const url = `${this.api_url}/maquinas`
    return this.http.get<MaquinaInterface[]>(url)
  }

  PostMaquinas(data:MaquinaInterface){
    const url = `${this.api_url}/maquinas`
    return this.http.post<MaquinaInterface>(url,data)
  }

  DeleteMaquinas(id){
    const url = `${this.api_url}/maquinas/${id}`
    return this.http.delete(url)
  }


  // **************************************************************************
  // **************************** GRUPOS **************************************
  // **************************************************************************

  getGrupos(){
    const url = `${this.api_url}/grupos`
    return this.http.get(url)
  }

  PostGrupos(data:any){
    const url = `${this.api_url}/grupos`
    return this.http.post(url,data)
  }

  // ****************************************************************************
  // **************************** CLIENTES **************************************
  // ****************************************************************************

  GetClientes(){
    const url = `${this.api_url}/clientes`
    return this.http.get(url)
  }

  PostClientes(data){
    const url = `${this.api_url}/clientes`
    return this.http.post(url,data)
  }

  // ****************************************************************************
  // **************************** Almacen ***************************************
  // ****************************************************************************


  getAlmacen(){
    const url = `${this.api_url}/materiales`
    return this.http.get(url)
  }

  GetGrupoMp(){
    const url = `${this.api_url}/tipo-materia-prima`
    return this.http.get(url)
  }

  PostAlmacen(data){
    const url = `${this.api_url}/nuevo-material`
    return this.http.post(url,data)
  }

  // ****************************************************************************
  // **************************** Productos *************************************
  // ****************************************************************************

  postProducto(data){
    const url = `${this.api_url}/nuevo-producto`
    return this.http.post(url,data)
  }

  getById(id){
    const url = `${this.api_url}/productos/${id}`
    return this.http.get(url)
  }

  getOneById(id){
    const url = `${this.api_url}/producto/${id}`
    return this.http.get(url)
  }


  getFechas(id){
    const url = `${this.api_url}/trabajos/${id}`
    return this.http.get(url);
  }

  postOrden(data){
    const url = `${this.api_url}/orden`
    return this.http.post(url,data)
  }
  postOrden2(data){
    const url = `${this.api_url}/trabajos`
    return this.http.post(url,data)
  }
  getOrdenById(id){
    const url = `${this.api_url}/orden/${id}`
    return this.http.get(url);
  }
  getOrden(){
    const url = `${this.api_url}/orden`
    return this.http.get(url);
  }

  getTrabajos(){
    const url = `${this.api_url}/trabajos`
    return this.http.get(url);
  }

  getEstado(id:any){
    const url = `${this.api_url}/orden/etapa/${id}`
    return this.http.get(url);
  }

  getInfToday(fecha:any){
    const url = `${this.api_url}/gestion`
    return this.http.post(url,fecha)
  }

  postGestion(data){
    const url = `${this.api_url}/gestiones`
    return this.http.post(url,data)
  }

  getGestiones(){
    const url = `${this.api_url}/gestiones`
    return this.http.get(url);
  }

  postRestrasar(data){
    const url = `${this.api_url}/trabajos/retrasar`
    return this.http.post(url,data)
  }
  postAcelerar(data){
    const url = `${this.api_url}/trabajos/acelerar`
    return this.http.post(url,data)
  }

  postNuevaBobina(data){
    const url = `${this.api_url}/bobina`
    return this.http.post(url,data)
  }

  getBobina(){
    const url = `${this.api_url}/bobina`
    return this.http.get(url)
  }

  postNuevoSustrato(data){
    const url = `${this.api_url}/sustrato`
    return this.http.post(url,data)
  }

  getSustratos(){
    const url = `${this.api_url}/sustrato`
    return this.http.get(url)
  }

  Login(data){
    const url = `${this.api_url}/login`
    return this.http.post(url,data)
  }

  validarToken():Observable<boolean>{
    

    return this.http.get(`${this.api_url}/renew`,{
      headers:this.headers
    }).pipe(
      tap( (resp:any) =>{

        const {estado,_id ,Nombre ,Apellido, Correo ,Departamento, Role,AnyDesk, img} = resp.usuario;

        this.usuario = new Usuario(estado, _id, Nombre, Apellido, Correo, Departamento,Role,);
        localStorage.setItem('token', resp.token);
        localStorage.setItem('menu', JSON.stringify( resp.menu) );
      }),
      map(resp => true),
      catchError(error => of(false))
    )

  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    this.router.navigateByUrl('login');
  }

  getMaterialesPorConfirmar(){
    const url = `${this.api_url}/orden_material`
    return this.http.get(url)
  }

  modificarMaterialTal(data){
    const url = `${this.api_url}/material/descuento`
    return this.http.post(url, data)
  }

  eliminarMaterial(id:any, motivo){
    const url = `${this.api_url}/materiales/${id}`
    const data = {
      motivo
    }
    return this.http.post(url, data)
  }

  eliminarSustrato(id:any, motivo){
    const url = `${this.api_url}/sustratos/${id}`
    const data = {
      motivo
    }
    return this.http.post(url, data)
  }

  reporteInventario(data){
    const url = `${this.api_url}/materialess/reporte`
    return this.http.post(url, data);
  }

  realizarDescuentoAlmacen(data){
    const url = `${this.api_url}/material/descuento`
    return this.http.post(url, data);
  }

  postAlmacenado(data){
    const url = `${this.api_url}/almacenado`
    return this.http.post(url, data);
  }

  getAlmacenado(){
    const url = `${this.api_url}/almacenado`
    return this.http.get(url)
  }

  getAlmacenadoID(id){
    const url = `${this.api_url}/almacenado/${id}`
    return this.http.get(url)
  }

  putAlmacenadoID(id,body){
    const url = `${this.api_url}/almacenado/${id}`
    return this.http.put(url,body)
  }

  getMaterialesID(id){
    const url = `${this.api_url}/materiales/${id}`
    return this.http.get(url)
  }
  
  putMaterialID(id, body){
    const url = `${this.api_url}/material/${id}`
    return this.http.put(url,body)
  }

  getMaquinaID(id){
    const url = `${this.api_url}/maquinas/${id}`
    return this.http.get(url)
  }

  putMaquina(id, body){
    const url = `${this.api_url}/maquinas/${id}`
    return this.http.put(url, body)
  }

  deleteGrupo(id){
    const url = `${this.api_url}/grupo/${id}`
    return this.http.delete(url)
  }

}
