import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  public NUEVO_CLIENTE:boolean = false;
  public CLIENTES;
  public MATERIALES;
  public MATERIALES_NECESARIOS = [];
  public NUEVO_PRODUCTO:boolean = false;
  public GRUPOS;

  public EJEMPLARES = 1;
  public POST = [];
  public TROQUEL

  public SECCIONES;

  public GRUPOS_MATERIA;

  public PRODUCTOS;
  public SUSTRATO = [];

  public Sus_Done:boolean = false;

  public dimensiones = []

  product_selected;
  _producto_seleccionado:boolean = false;

  public VER_PRODUCTO:boolean = false;
  OneProduct:any = {producto:'',
                          cliente:{
                            nombre:'',
                            codigo:''
                          },
                          grupo:{_id:''},
                          codigo:'',
                          version:'',
                          ejemplares:'',
                          dimensiones:'',
                          fibra:'',
                          post:[],
                          sustrato:[{
                            nombre:'',
                            marca:'',
                            calibre:'',
                            gramaje:''
                          }],
                          materiales:[]};

  ClienteForm:FormGroup = this.fb.group({
    nombre:['',Validators.required],
    codigo:['',Validators.required]
  })

  constructor(private api:RestApiService,
              private fb:FormBuilder) { }

  ngOnInit(): void {
    this. obtenerGrupodeMateriales();
    this.obtenerClientes();
    this.obtenerMateriales();
    this.obtenerGrupos();
    let cliente_id = (<HTMLInputElement>document.getElementById('cliente_Seleccionado')).value;
    this.buscar_producto(cliente_id);
    this.BuscarGruposEnAlmacen();
  }

  producto_seleccionado(e){
    if(e === 0){
      this._producto_seleccionado = false;
    }else{
      this._producto_seleccionado = true;
      if(this.product_selected == 'Sustrato'){
        this._producto_seleccionado = false;
        document.getElementById('cant').hidden = true;
      }else{
        this._producto_seleccionado = true;
        document.getElementById('cant').hidden = false;
      }
    }
  }

  selecciona_producto(e){
    if(e == 0){
      (<HTMLInputElement>document.getElementById('Producto_select')).disabled = true;
    }else{
      (<HTMLInputElement>document.getElementById('Producto_select')).disabled = false;
      this.product_selected = e;
    }
  }

  post_impresion(e){
    console.log(e)
    let Included = this.POST.includes(e.target.value);
    if(!Included){
      this.POST.push(e.target.value);
    }
  }

  troquel(e){
    this.TROQUEL = e.target.value;
  }

  Ejemplar(e){
    this.EJEMPLARES = e.target.value
  }

  public Modal_Cliente(){
    if(this.NUEVO_CLIENTE){
      this.NUEVO_CLIENTE = false;
    }else{
      this.NUEVO_CLIENTE = true;
    }
  }

  public Modal_Producto(){
    if(this.NUEVO_PRODUCTO){
      this.NUEVO_PRODUCTO = false;
    }else{
      this.NUEVO_PRODUCTO = true;
    }
  }

  public ver_Modal_Producto(){
    if(this.VER_PRODUCTO){
      this.VER_PRODUCTO = false;
    }else{
      this.VER_PRODUCTO = true;
    }
  }

  enable(input){
    let campo = (<HTMLInputElement>document.getElementById(input)).disabled;

    if(campo){
      (<HTMLInputElement>document.getElementById(input)).disabled = false;
      (<HTMLInputElement>document.getElementById(input)).focus();
    } else {
      (<HTMLInputElement>document.getElementById(input)).disabled = true;
      let buscarSiExiste = this.MATERIALES_NECESARIOS.find(c => c.material == input);
      if(buscarSiExiste){
        let index = this.MATERIALES_NECESARIOS.indexOf(buscarSiExiste)
        this.MATERIALES_NECESARIOS.splice(index, 1)
      }
  }
}

just_a_sec(e){
  let nuevo = this.MATERIALES_NECESARIOS.find(c => c.material == e.target.id);
  let index;
  if(!nuevo){
    let data = {
      material:e.target.id,
      cantidad:e.target.value
    }

    this.MATERIALES_NECESARIOS.push(data)
  }else{
    index = this.MATERIALES_NECESARIOS.indexOf(nuevo)
    this.MATERIALES_NECESARIOS[index].cantidad = e.target.value
  }
}

  obtenerGrupodeMateriales(){
    this.api.GetGrupoMp()
      .subscribe((resp:any)=>{
        this.GRUPOS_MATERIA = resp;
      })
  }
  obtenerClientes(){
    this.api.GetClientes()
      .subscribe((resp:any) =>{
        this.CLIENTES = resp.clientes
      })
  }

  addCliente(){
    if(this.ClienteForm.invalid) {
      return;
    }

    this.api.PostClientes(this.ClienteForm.value)
        .subscribe((resp:any)=>{
          this.obtenerClientes();
          this.ClienteForm.reset();
          this.NUEVO_CLIENTE = false;
        })
  }

  //--------------------- PRODUCTOS----

  obtenerMateriales(){
    this.api.getAlmacen()
      .subscribe((resp:any)=>{
        this.MATERIALES = resp.materiales
        console.log(this.MATERIALES)
      })
  }

  obtenerGrupos(){
    this.api.getGrupos()
      .subscribe((resp:any)=>{
        this.GRUPOS = resp.grupos
      })
  }

  Ordenar_Producto(){
    let valor = (<HTMLInputElement>document.getElementById('material_Necesario')).value
    let inde = this.MATERIALES_NECESARIOS.includes(valor);

    if(!inde){
      this.MATERIALES_NECESARIOS.push(valor)
    }

    
  }

  BuscarGruposEnAlmacen(){
    this.api.GetGrupoMp()
      .subscribe((resp:any)=>{
        this.SECCIONES = resp
      })
  }

  finalizar(){

    // let name = (<HTMLInputElement>document.getElementById('sustrato_name')).value

    // let marca = (<HTMLInputElement>document.getElementById('sustrato_marca')).value
    // let gramaje = (<HTMLInputElement>document.getElementById('sustrato_gramaje')).value
    // let calibre = (<HTMLInputElement>document.getElementById('sustrato_calibre')).value

    // let sustrato = {
    //   nombre:name,
    //   marca,
    //   gramaje,
    //   calibre
    // }


    let data = {
      cliente: (<HTMLInputElement>document.getElementById('cliente_Seleccionado')).value,
      producto:(<HTMLInputElement>document.getElementById('nombre_nuevo_producto')).value,
      grupo:(<HTMLInputElement>document.getElementById('grupo_producto')).value,
      materiales: this.MATERIALES_NECESARIOS,
      post:this.POST,
      ejemplares:this.EJEMPLARES,
      // sustrato: sustrato,
      codigo:(<HTMLInputElement>document.getElementById('cod_producto')).value,
      version:(<HTMLInputElement>document.getElementById('version')).value,
      edicion:(<HTMLInputElement>document.getElementById('edicion')).value
    }

    
    this.api.postProducto(data)
      .subscribe((resp:any)=>{
        this.Modal_Producto();
        let cliente_id = (<HTMLInputElement>document.getElementById('cliente_Seleccionado')).value;
        this.buscar_producto(cliente_id);
      })
  }

  ancho(e){
    let ancho = e.target.value;
    
    this.dimensiones.push(ancho);
    let tamano = this.dimensiones.length

    const largo = (<HTMLInputElement>document.getElementById('largo'))
    const DirFibra = (<HTMLInputElement>document.getElementById('d_fibra'))

    largo.disabled = false;

    if(ancho == ''){
      this.dimensiones = []

      largo.value = ''
      largo.disabled = true;
      DirFibra.disabled = true;
    }

    if(largo.value != ''){
      DirFibra.disabled = false
    }
    
  }

  largo(e){
    let largo = e.target.value;

    let tamano = this.dimensiones.length;
    
    const DirFibra = (<HTMLInputElement>document.getElementById('d_fibra'))
    
    if(largo == ''){
      this.dimensiones.pop();
      DirFibra.disabled = true;
    }
    
    if(largo != ''){
      if(tamano>1){
        this.dimensiones.pop();
      }
      this.dimensiones.push(largo);
      DirFibra.disabled = false;
    }
      // }else{
    //   DirFibra.disabled = false;
    // }


  }

  
  buscar_producto(e){

    this.api.getById(e)
      .subscribe((resp:any)=>{
        this.PRODUCTOS = resp.productos;
        console.log(this.PRODUCTOS)
      });

      if(e == ""){
        (<HTMLInputElement>document.getElementById('NP_button')).disabled = true;
      }else{
        (<HTMLInputElement>document.getElementById('NP_button')).disabled = false;
      }
  }

  // sustratos(e){

  //   this.SUSTRATO = [];

  //   this.SUSTRATO.push(e.target.value);

  //   this.Sus_Done = true;

    
  // }
  NuevoSustrato(){
    this.SUSTRATO = [];
    this.Sus_Done = false;
  }

  add_materia(producto, cantidad){

    let Material = this.MATERIALES.find(x => x._id === producto.value);

    console.log(Material, '--' )

    let size = cantidad.value
    let name = Material.nombre

    if(this.product_selected == "Sustrato"){
      size = '0'
    }

    if(Material.ancho){
      name = `${Material.nombre} (${Material.ancho} x ${Material.largo})`;
    }

    let productos = {
      material:name,
      marca:Material.marca,
      producto:producto.value,
      cantidad: size
    }

    console.log(productos);

    this.MATERIALES_NECESARIOS.push(productos);

    // let field_material = (<HTMLInputElement>document.getElementById('field_material'))
    // let field_marca = (<HTMLInputElement>document.getElementById('field_marca'))
    // let field_cantidad = (<HTMLInputElement>document.getElementById('field_cantidad'))

    // let new_material = {
    //   material:material.value,
    //   marca:marca.value,
    //   cantidad:cantidad.value
    // }

    // this.MATERIALES_NECESARIOS.push(new_material)

    // field_cantidad.value = '';
    // field_marca.value = '';
    // field_material.value = '';
  }

  Delete_Material(material2){

        let deleted = this.MATERIALES_NECESARIOS.findIndex(x => x.material == material2)

        this.MATERIALES_NECESARIOS.splice(deleted, 1);
  }

  borrarPost(post){
    let i = this.POST.indexOf(post)

    this.POST.splice(i, 1)
  }

  borrarPost2(post){
    let i = this.OneProduct.post.indexOf(post)

    console.log(i)

    this.POST.splice(i, 1)
  }

  verProducto(producto){

    this.api.getOneById(producto)
      .subscribe((resp:any)=>{
        this.OneProduct = resp.producto
        console.log('AQUIIIIIIIIIIIIII', this.OneProduct)
        this.ver_Modal_Producto()
      })
  }


}
