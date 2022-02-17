import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/rest-api.service';
import { PdfMakeWrapper, Txt, Img, Table, Cell, Columns } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import * as moment from 'moment';

import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { findIndex } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';




@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  fileName= 'ExcelSheet.xlsx';

  public resumido:boolean = false;
  public detallado:boolean = true;

  public NUEVO_PRODUCTO:boolean = false;
  public ALMACEN;
  public SECCIONES

  public PESO= 0
  public GRAMAJE = 300
  public ANCHO= 0
  public LARGO= 0
  public HOJAS = 0

  public PESO_= 0
  public GRAMAJE_ = 300
  public ANCHO_= 0
  public LARGO_= 0
  public HOJAS_ = 0

  empty:boolean = true;

  public OTRO:boolean = true;
  public Gs;

  public CONVERSION:boolean = false;
  public BOBINAS:boolean = false;
  public CONSULTAB:boolean = false;

  public BOBINAS_;
  public product_selected;
  public _producto_seleccionado;

  public boolean_sustrato:boolean = false;
  public Sustratos;

  public New_Sustrato:boolean = false;

  public Mat_Selected;
  public Num_Bobina

  public MAT_NECESARIO;

  public MATERIALES_NECESARIOS:boolean = false;
  public _NUEVO_PRODUCTO:boolean = false;
  public EDICION_ALMACEN:boolean = false;

  public DESCUENTOS = [];

  public name_p_e
  public cantidad_p_e
  public id_p_e
  public eliminacion:boolean = false;
  public eliminar_sustrato:boolean = false;

  public reporte:boolean = false;


  public AlmacenadoId;
  public MaterialID;

  public loading:boolean = true;

  codigoID = '';
  loteID = '';
  cantidadID = '';

  codigo = '';
  lote = '';
  cantidad = '';



  public _Almacenado:boolean = true;
  public Editar_NUEVO_PRODUCTO:boolean = false;

  public TOTALES = [
    {
      material:null,
      marca:null,
      total:null,
      grupo:null,
      presentacion:null,
      neto:null,
      unidad:null,
      ancho:null,
      largo:null
    }
  ];
  
  public LOTES = [];
  public Almacenado = [];


  InventarioForm:FormGroup = this.fb.group({
    ancho:[''],
    largo:[''],
    gramaje:[''],
    calibre:[''],
    producto:['', Validators.required],
    marca:['',Validators.required],
    presentacion:['', Validators.required],
    unidad:['',Validators.required],
    neto:['', Validators.required],
    // codigo:['',Validators.required],
    // cantidad:['', Validators.required],
    // lote:['', Validators.required],
    NewControl:['']
  });

  BobinaForm:FormGroup = this.fb.group({
    Nbobina:['', Validators.required],
    material:['', Validators.required],
    gramaje:['', Validators.required],
    ancho:['', Validators.required],
    peso:['', Validators.required]
  });


  constructor(private fb:FormBuilder,
              private api:RestApiService) { }

  ngOnInit(): void {
    this.BuscarAlmacen();
    this.BuscarGruposEnAlmacen();
    this.getbobinas();
    this.getSustratos();
    this.porConfirmar();
    this.getAalmacenado();
    this.totalizar_materiales()
    this.Gs = (<HTMLInputElement>document.getElementById('selected')).value
  }

  Modal_Almacen_ep(){
    if(this.Editar_NUEVO_PRODUCTO){
      this.Editar_NUEVO_PRODUCTO = false;
    }else{
      this.Editar_NUEVO_PRODUCTO = true;
    }
  }

  existencia_(seccion){

    let existencia = this.Almacenado.find(x => x.material.grupo.nombre === seccion)

    if(existencia){
      return true
    }else{
      return false
    }

  }

  Editar_2(id){
    this.Modal_Almacen_ep()
    this.api.getMaterialesID(id)
      .subscribe((resp:any)=>{
        this.MaterialID = resp;
        console.log(this.MaterialID)
      })
  }

  Editar_Material_F(){
    let grupo = this.MaterialID.grupo._id;

    this.MaterialID.grupo = grupo;

    console.log(this.MaterialID)

    this.api.putMaterialID(this.MaterialID._id, this.MaterialID)
          .subscribe((resp:any)=>{
            this.Modal_Almacen_ep();
            this.getAalmacenado();
                this.BuscarAlmacen();
                this.totalizar_materiales();
                Swal.fire({
                  position:'center',
                  icon:'success',
                  title:'La materia fue editada con exito',
                  showConfirmButton: false,
                  timer:1500
                })

          })
  }

  Editar(id){
    this.edit_almacen()
    this.api.getAlmacenadoID(id)
      .subscribe((resp:any)=>{
        this.AlmacenadoId = resp;
        this.selecciona_producto(this.AlmacenadoId.material.grupo.nombre)
        this.codigoID = this.AlmacenadoId.codigo;
        this.loteID = this.AlmacenadoId.lote;
        this.cantidadID = this.AlmacenadoId.cantidad;

      })
  }

  _Editar(producto){
    let body = {
      material:producto.value,
      codigo:this.codigoID,
      lote:this.loteID,
      cantidad:this.cantidadID

      
    }
    
    this.api.putAlmacenadoID(this.AlmacenadoId._id, body)
    .subscribe((resp:any)=>{
      this.edit_almacen();
      Swal.fire({
        position:'center',
        icon:'success',
        title:'El inventario fue editado con exito',
        showConfirmButton: false,
        timer:1500
      })
      this.getAalmacenado();
      this.BuscarAlmacen();
      this.totalizar_materiales();
      this.codigoID = ''
      this.loteID = ''
      this.cantidadID = ''
      this.AlmacenadoId = ''
    })
    
  }
  
  public edit_almacen(){
    if(this.EDICION_ALMACEN){
      this.EDICION_ALMACEN = false;
    }else{
      this.EDICION_ALMACEN = true;
    }
  }

  Almacenes(e){
    if(e == 'Almacenada'){
      this._Almacenado = true
    }else{
      this._Almacenado = false;
    }
  }

  getAalmacenado(){
    this.api.getAlmacenado()
      .subscribe((resp:any)=>{
        this.Almacenado = resp;
        this.totalizar_materiales();
        console.log('-------------------------------->' ,this.Almacenado)
      })
  }

  Cambio_opciones(e){
    if(e === 'otros'){
      this.OTRO = true
    }else{
      this.OTRO = false;
      this.Gs = e;
    }

    if(e === '61f92a1f2126d717f004cca6'){
      this.New_Sustrato = true;
    }else{
      this.New_Sustrato = false;
    }

  }

  public Modal_Mat_Nec(){
    if(this.MATERIALES_NECESARIOS){
      this.MATERIALES_NECESARIOS = false;
    }else{
      this.MATERIALES_NECESARIOS = true;
    }
  }

  public Nuevo_producto(){
    if(this._NUEVO_PRODUCTO){
      this._NUEVO_PRODUCTO = false;
    }else{
      this._NUEVO_PRODUCTO = true;
    }

  }

  public Modal_Almacen(){
    if(this.NUEVO_PRODUCTO){
      this.NUEVO_PRODUCTO = false;
    }else{
      this.NUEVO_PRODUCTO = true;
    }
  }

  public Modal_bobinas(){
    if(this.BOBINAS){
      this.BOBINAS = false;
    }else{
      this.BOBINAS = true;
    }
  }

  public modal_Conversion(){
    if(this.CONVERSION){
      this.CONVERSION = false;
    }else{
      this.CONVERSION = true;
    }
  }

  public modal_reporte(){
    if(this.reporte){
      this.reporte = false;
    }else{
      this.reporte = true;
    }
  }

  public check_bobinas(){
    if(this.CONSULTAB){
      this.CONSULTAB = false;
    }else{
      this.CONSULTAB = true;
    }
  }

  BuscarGruposEnAlmacen(){
    this.loading = true;
    this.api.GetGrupoMp()
      .subscribe((resp:any)=>{
        this.SECCIONES = resp
        this.loading = false;
      })
  }

  BuscarAlmacen(){
    this.loading = true;
    this.api.getAlmacen()
      .subscribe((resp:any) => {
        this.ALMACEN = resp.materiales;
        this.totalizar_materiales()
        this.loading = false;
      })
  }

  selecciona_producto(e){
    if(e == 0){
      (<HTMLInputElement>document.getElementById('Producto_select')).disabled = true;
    }else{
      (<HTMLInputElement>document.getElementById('Producto_select')).disabled = false;
      this.product_selected = e;
    }
  }

  almacenar(producto){
    let data = {
      material:producto.value,
      codigo:this.codigo,
      lote:this.lote,
      cantidad:this.cantidad
    }

    this.api.postAlmacenado(data)
      .subscribe((resp:any)=>{
        Swal.fire({
          position:'center',
          icon:'success',
          title:'Nueva materia prima agregada',
          showConfirmButton: false,
          timer:1500
        })
        this.Nuevo_producto();
        this.BuscarAlmacen();
        this.getAalmacenado();
        this.codigo = '';
        this.lote = '';
        this.cantidad ='';
        (<HTMLInputElement>document.getElementById('Nuevoproducto')).value = "0";
      })
  }

  producto_seleccionado(e){
    if(e == 0){
      this._producto_seleccionado = false
      this.codigo = '';
      this.lote = '';
      this.cantidad = '';
    }else{
      this._producto_seleccionado = true
    }
  }
  

  Almacenar(){

    let grupo;

    if(this.OTRO){
    grupo = this.InventarioForm.get('NewControl').value
    }
    else{
      grupo = this.Gs;
    }


    const data = {
      producto: this.InventarioForm.get('producto').value,
      marca:this.InventarioForm.get('marca').value,

      ancho:this.InventarioForm.get('ancho').value,
      largo:this.InventarioForm.get('largo').value,
      gramaje:this.InventarioForm.get('gramaje').value,
      calibre:this.InventarioForm.get('calibre').value,


      // cantidad: this.InventarioForm.get('cantidad').value,
      unidad: this.InventarioForm.get('unidad').value,
      presentacion: this.InventarioForm.get('presentacion').value,
      neto: this.InventarioForm.get('neto').value,
      // codigo: this.InventarioForm.get('codigo').value,
      // lote: this.InventarioForm.get('lote').value,
      grupo,
      nuevo:this.OTRO

    }

    if(this.InventarioForm.invalid){
      return
    }


     this.api.PostAlmacen(data)
      .subscribe(resp=>{
         this.InventarioForm.reset();
         this.BuscarAlmacen();
         this.BuscarGruposEnAlmacen();
         this.Modal_Almacen();
         this.getSustratos();
       })

   }

   Peso(e){
    this.PESO = e.target.value
    this.HOJAS = this.PESO*10000000000
    let otro = this.GRAMAJE*this.ANCHO*this.LARGO
    this.HOJAS = this.HOJAS/otro
    this.HOJAS = Math.trunc(this.HOJAS)
    // /( this.GRAMAJE*this.ANCHO*this.LARGO)
   }
   Gramaje(e){
     this.GRAMAJE = e
     this.HOJAS = this.PESO*10000000000
     let otro = this.GRAMAJE*this.ANCHO*this.LARGO
     this.HOJAS = this.HOJAS/otro
     this.HOJAS = Math.trunc(this.HOJAS)
     //  /( this.GRAMAJE*this.ANCHO*this.LARGO)
   }
   Ancho(e){
     this.ANCHO = e
     this.HOJAS = this.PESO*10000000000
     let otro = this.GRAMAJE*this.ANCHO*this.LARGO
     this.HOJAS = this.HOJAS/otro
     this.HOJAS = Math.trunc(this.HOJAS)
     //  /( this.GRAMAJE*this.ANCHO*this.LARGO)
   }
   Largo(e){
     this.LARGO = e.target.value
     this.HOJAS = this.PESO*10000000000
     let otro = this.GRAMAJE*this.ANCHO*this.LARGO
     this.HOJAS = this.HOJAS/otro
     this.HOJAS = Math.trunc(this.HOJAS)
     //  /( this.GRAMAJE*this.ANCHO*this.LARGO)
   }

  //  ***********************************************************
  Hojas_(e){
    this.HOJAS_ = e.target.value
    let all = this.HOJAS_ * this.GRAMAJE_*this.ANCHO_*this.LARGO_
    this.PESO_ = all / 10000000000;
    // /( this.GRAMAJE*this.ANCHO*this.LARGO)
   }
   Gramaje_(e){
     this.GRAMAJE_ = e.target.value
     let all = this.HOJAS_ * this.GRAMAJE_*this.ANCHO_*this.LARGO_
     this.PESO_ = all / 10000000000;
     //  /( this.GRAMAJE*this.ANCHO*this.LARGO)
   }
   Ancho_(e){
     this.ANCHO_ = e.target.value
     let all = this.HOJAS_ * this.GRAMAJE_*this.ANCHO_*this.LARGO_
     this.PESO_ = all / 10000000000;
     //  /( this.GRAMAJE*this.ANCHO*this.LARGO)
   }
   Largo_(e){
     this.LARGO_ = e.target.value
     let all = this.HOJAS_ * this.GRAMAJE_*this.ANCHO_*this.LARGO_
     this.PESO_ = all / 10000000000;
     //  /( this.GRAMAJE*this.ANCHO*this.LARGO)
   }
  //  ***********************************************************


  nuevaBobina(){
    this.api.postNuevaBobina(this.BobinaForm.value)
      .subscribe((resp:any)=>{
        this.BobinaForm.reset();
        this.Modal_bobinas();
        this.getbobinas();
        console.log(resp);
      })
  }

  getbobinas(){
    this.api.getBobina()
      .subscribe((resp:any)=>{
        this.BOBINAS_ = resp;
        console.log(this.BOBINAS_)
      })
  }

  Buscar_Bobina(e){
    let TheBobina = this.BOBINAS_.find(x => x._id == e.target.value)
    console.log(TheBobina.gramaje)

    if(TheBobina){
      (<HTMLInputElement>document.getElementById('_gramaje')).value = TheBobina.gramaje
      this.Gramaje(TheBobina.gramaje)
      if(TheBobina){
      (<HTMLInputElement>document.getElementById('_ancho')).value = TheBobina.ancho
      this.Ancho(TheBobina.ancho)
      }
      if(TheBobina){
        console.log(TheBobina)
        this.Mat_Selected = TheBobina.material;
        this.Num_Bobina = TheBobina.Nbobina;
      }
    }

  }

  Generar_Conversion(){
    let bobina = (<HTMLInputElement>document.getElementById('bobina_selected')).value;
    let peso = (<HTMLInputElement>document.getElementById('_peso')).value;
    let gramaje = (<HTMLInputElement>document.getElementById('_gramaje')).value;
    let ancho = (<HTMLInputElement>document.getElementById('_ancho')).value;
    let largo = (<HTMLInputElement>document.getElementById('_largo')).value;

    let data = {
      material:this.Mat_Selected,
      codigo:this.Num_Bobina,
      peso,
      bobina,
      hojas:this.HOJAS
    }

    let hoy = moment().format('DD/MM/YYYY')

    this.api.postNuevoSustrato(data)
      .subscribe((resp:any)=>{
        this.modal_Conversion();
        this.getbobinas();
        this.BuscarAlmacen();
        this.getSustratos();
        console.log(resp)

        async function recibo() {
          const pdf = new PdfMakeWrapper();
          PdfMakeWrapper.setFonts(pdfFonts);
          pdf.pageOrientation('landscape');

          pdf.header('Solicitud de Conversión');

          pdf.add(

            new Txt('Solicitud de Conversión').alignment('center').bold().fontSize(25).end,
            
          )
          pdf.add(

            pdf.ln(2)
            
          )


          pdf.add(
            new Columns([`Fecha de Solicitud: ${hoy}`, 'Cliente: POLIGRAFICA INDUSTRIAL C.A']).columnGap(10).end
          )

          pdf.add(

            pdf.ln(2)
            
          )
          pdf.add(
            new Table([
              [
                new Cell( new Txt(`Conv #: ${resp}`).end).border([false, false]).colSpan(5).end,
                'Conv',
                'Conv',
                'Conv',
                'Conv',
                new Cell( new Txt('Cantidad a Convertir').end).fontSize(15).colSpan(3).end,
                '',
                '',
                new Cell( new Txt('').end).border([false, false]).end,
              ],
              [
                'Material',
                'Gramaje',
                'Ancho Bobina',
                new Cell( new Txt('Corte').end).colSpan(2).end,
                'Corte',
                '# Bobina',
                'Peso',
                'Hojas',
                'Observación'
              ],
              [
                `${data.material}`,
                `${gramaje}`,
                `${ancho}`,
                `${ancho}`,
                `${largo}`,
                `${data.codigo}`,
                `${peso}`,
                new Cell( new Txt(`${data.hojas}`,).color('red').end).end,
                ''
              ],
              [
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' '
              ],
              [
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' '
              ],
              [
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' ',
                ' '
              ],
              [
                new Cell( new Txt('').end).border([false,false]).colSpan(3).end,
                '',
                '',
                new Cell( new Txt('Total').end).colSpan(3).end,
                '',
                '',
                `${peso}`,
                new Cell( new Txt(`${data.hojas}`,).color('red').end).end,
                ''
              ],
            ]).widths(['10%','10%','10%','10%','10%','10%','10%','10%','20%']).alignment('center').end
          )
          pdf.add(

            pdf.ln(2)
            
          )
          pdf.add(
            new Table([
              [
                'Solicitado por:'
              ],
              [
                'Jaime San Juan'
              ]
            ]).widths(['25%']).end
          )

          pdf.create().download()

        }

        recibo();

      })
  }

  getSustratos(){
    this.api.getSustratos()
      .subscribe((resp:any)=>{
        console.log(resp)
        if(resp.length>0){
          this.boolean_sustrato = true;
          this.Sustratos = resp;
        }
      })
  }

  totalizar(neto,cantidad){
    let total = neto*cantidad;
    return total;
  }

  porConfirmar(){
    this.api.getMaterialesPorConfirmar()
      .subscribe((resp:any)=>{
        this.MAT_NECESARIO = resp;
      })
  }

  BuscarTotal(Material:any, cantidad_Mat:any, cantidad_orden:any){
    let El_Material = this.ALMACEN.find(x=> x.nombre == Material)
    const total_necesario = (cantidad_Mat / 1000) * cantidad_orden
    let Total_en_Presentacion = total_necesario / El_Material.neto

    if( Total_en_Presentacion % 1 == 0 ){

      if(Total_en_Presentacion < 1){
        Total_en_Presentacion = 1;
      }
    
      return {total:Total_en_Presentacion,
        presentacion: El_Material.presentacion}

    }else {
      Total_en_Presentacion = Math.round(Total_en_Presentacion)

      if(Total_en_Presentacion < 1){
        Total_en_Presentacion = 1;
      }
      
      return {total:Total_en_Presentacion,
              presentacion: El_Material.presentacion}
    }

  }

  Restar(orden){


    // let data = {descuento:this.DESCUENTOS, 
    //             orden:orden}

    // this.api.modificarMaterialTal(data)
    //   .subscribe((resp:any) => {
    //     this.Modal_Mat_Nec()
    //     this.BuscarAlmacen();
    //     this.porConfirmar();
    //   })

    let En_Almacen = this.MAT_NECESARIO[0].producto.materiales;
    let Cargados = this.LOTES.length

    
    for(let i = 0; i<En_Almacen.length; i++){
      let existe = this.LOTES.find(x => x.i === i);

      if(!existe){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Debes cubrir toda la materia prima para esta orden',
          showConfirmButton: false,
          timer:1500
        })
        return
      }

      
      
    }

    let data = {
      lotes:this.LOTES,
      orden
    }
    this.api.realizarDescuentoAlmacen(data)
      .subscribe(resp=> {
        Swal.fire({
          icon: 'success',
          title: 'Excelente!',
          text: 'La nueva orden ya esta generada',
          showConfirmButton: false,
          timer:1500
        })

        this.MATERIALES_NECESARIOS = false;
        this.BuscarAlmacen();
        this.porConfirmar();
        this.getAalmacenado();
      })

  }

  RestarMaterial(material, total){
    const data = {
      material:material.material,
      total
    }


    let Descuento = this.DESCUENTOS.find(x => x.material == material.material)

    if(!Descuento){
      this.DESCUENTOS.push(data)
    }

  }

  modal_eliminacion(){
    if(this.eliminacion){
      this.eliminacion = false;
    }else{
      this.eliminacion = true;
    }
  }

  eliminar_p(nombre, cantidad, id, sustrato?){
    this.name_p_e = nombre
    this.cantidad_p_e = cantidad
    this.id_p_e = id

    if(sustrato){
      this.eliminar_sustrato = true;
    }

    this.modal_eliminacion();

  }

  confirmar_eliminacion(motivo){

    motivo = motivo.value;

    if(this.eliminar_sustrato){
      this.api.eliminarSustrato(this.id_p_e, motivo)
      .subscribe((resp:any)=>{
        this.BuscarAlmacen();
        this.porConfirmar();
        this.modal_eliminacion();
        
        this.BuscarAlmacen();
        this.BuscarGruposEnAlmacen();
        this.getbobinas();
        this.getSustratos();
        this.porConfirmar();
        console.log(resp)
      })
    }else{
      this.api.eliminarMaterial(this.id_p_e, motivo)
        .subscribe((resp:any)=>{
          console.log(resp)
          this.BuscarAlmacen();
          this.porConfirmar();
          this.modal_eliminacion();
        })
    }

  }

  GenerarExcel(){

    var userList = [

      {
      
      "id": 1,
      
      "name": "Leanne Graham",
      
      "username": "Bret",
      
      "email": "Sincere@april.biz"
      
      },
      
      {
      
      "id": 2,
      
      "name": "Ervin Howell",
      
      "username": "Antonette",
      
      "email": "Shanna@melissa.tv"
      
      },
      
      {
      
      "id": 3,
      
      "name": "Clementine Bauch",
      
      "username": "Samantha",
      
      "email": "Nathan@yesenia.net"
      
      },
      
      {
      
      "id": 4,
      
      "name": "Patricia Lebsack",
      
      "username": "Karianne",
      
      "email": "Julianne.OConner@kory.org"
      
      },
      
      {
      
      "id": 5,
      
      "name": "Chelsey Dietrich",
      
      "username": "Kamren",
      
      "email": "Lucio_Hettinger@annie.ca"
      
      }
      
    ]

     /* pass here the table id */
     let element = document.getElementById('excel-table');
     const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
  
     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
     /* save to file */  
     XLSX.writeFile(wb, this.fileName)


    
  }

  descargarInventario(desde, hasta){
    const data = {
      desde:desde.value,
      hasta:hasta.value
    }

    this.api.reporteInventario(data)
      .subscribe((resp:any)=>{


        console.log('aqui es la broma:', resp)

        const pdf = new PdfMakeWrapper();
        PdfMakeWrapper.setFonts(pdfFonts);

        async function generarPDF(){

          pdf.add(
            new Table([
              [
                new Cell( new Txt(` Movimientos Realizados en el Almacen`).end).alignment('center').end,
              ],
              [
                new Cell( new Txt(` Desde: ${desde.value} Hasta: ${hasta.value}`).end).alignment('center').end,
              ]
            ]).widths(['100%']).layout('noBorders').end
          )

          pdf.add(

            pdf.ln(2)
            
          )

          pdf.add(
            new Table([
              [
                new Cell( new Txt('PRODUCTOS EN ALMACEN').end).fillColor('#dedede').alignment('center').end,
              ]
            ]).widths(['100%']).layout('noBorders').end
          )

          pdf.add(

            pdf.ln(2)
            
          )
          pdf.add(
            new Table([
              [
                new Cell( new Txt(`NOMBRE`).end).end,
                new Cell( new Txt(`PRESENTACIÓN`).end).end,
                new Cell( new Txt(`CANTIDAD`).end).end,
                new Cell( new Txt(`CÓDIGO`).end).end,
                new Cell( new Txt(`LOTE`).end).end,
                
              ]
            ]).widths(['20%','20%','20%', '20%', '20%']).end
          )
          for(let i = 0; i < resp.almacen.length; i++){
            pdf.add(
              new Table([
                [
                  new Cell( new Txt(`${resp.almacen[i].nombre}`).end).end,
                  new Cell( new Txt(`${resp.almacen[i].presentacion} ${resp.almacen[i].neto} ${resp.almacen[i].unidad}`).end).end,
                  new Cell( new Txt(`${resp.almacen[i].cantidad}`).end).end,
                  new Cell( new Txt(`${resp.almacen[i].codigo}`).end).end,
                  new Cell( new Txt(`${resp.almacen[i].lote}`).end).end,
                  
                ]
              ]).widths(['20%','20%','20%', '20%', '20%']).end
            )
          }

          pdf.add(

            pdf.ln(2)
            
          )

          pdf.add(
            new Table([
              [
                new Cell( new Txt('PRODUCTOS INGRESADOS EN LA FECHA ESTIPULADA').end).fillColor('#dedede').alignment('center').end,
              ]
            ]).widths(['100%']).layout('noBorders').end
          )

          pdf.add(

            pdf.ln(2)
            
          )

          pdf.add(
            new Table([
              [
                new Cell( new Txt(`NOMBRE`).end).end,
                new Cell( new Txt(`PRESENTACIÓN`).end).end,
                new Cell( new Txt(`CANTIDAD`).end).end,
                new Cell( new Txt(`CÓDIGO`).end).end,
                new Cell( new Txt(`LOTE`).end).end,
                
              ]
            ]).widths(['20%','20%','20%', '20%', '20%']).end
          )
          for(let i = 0; i < resp.ingresos.length; i++){
            pdf.add(
              new Table([
                [
                  new Cell( new Txt(`${resp.ingresos[i].material.nombre}`).end).end,
                  new Cell( new Txt(`${resp.ingresos[i].material.presentacion} ${resp.ingresos[i].material.neto} ${resp.ingresos[i].material.unidad}`).end).end,
                  new Cell( new Txt(`${resp.ingresos[i].material.cantidad}`).end).end,
                  new Cell( new Txt(`${resp.ingresos[i].material.codigo}`).end).end,
                  new Cell( new Txt(`${resp.ingresos[i].material.lote}`).end).end,
                  
                ]
              ]).widths(['20%','20%','20%', '20%', '20%']).end
            )
          }

          pdf.add(

            pdf.ln(2)
            
          )

          pdf.add(
            new Table([
              [
                new Cell( new Txt('SALIDAS DEL ALMACEN').end).fillColor('#dedede').alignment('center').end,
              ]
            ]).widths(['100%']).layout('noBorders').end
          )

          pdf.add(

            pdf.ln(2)
            
          )

          pdf.add(
            new Table([
              [
                new Cell( new Txt(`NOMBRE`).end).end,
                new Cell( new Txt(`PRESENTACIÓN`).end).end,
                new Cell( new Txt(`CANTIDAD`).end).end,
                new Cell( new Txt(`RAZON`).end).end,
                new Cell( new Txt(`FECHA`).end).end,
                
              ]
            ]).widths(['20%','20%','20%', '20%', '20%']).end
          )
          for(let i = 0; i < resp.descuentos.length; i++){
            pdf.add(
              new Table([
                [
                  new Cell( new Txt(`${resp.descuentos[i].material.nombre}`).end).end,
                  new Cell( new Txt(`${resp.descuentos[i].material.presentacion} ${resp.descuentos[i].material.neto} ${resp.descuentos[i].material.unidad}`).end).end,
                  new Cell( new Txt(`${resp.descuentos[i].descuento}`).end).end,
                  new Cell( new Txt(`${resp.descuentos[i].razon}`).end).end,
                  new Cell( new Txt(`${resp.descuentos[i].fecha.slice(0, 10)}`).end).end,
                  
                ]
              ]).widths(['20%','20%','20%', '20%', '20%']).end
            )
          }




          
            
          pdf.create().download()
          
        }
        generarPDF();
        this.modal_reporte()
      })

  }

  totalizar_materiales(){

    // material:null,
    // marca:null,
    // // total:null,
    // grupo:null,
    // presentacion:null,
    // neto:null,
    // unidad:null,
    // ancho:null,
    // largo:null

    for(let i=0; i<this.Almacenado.length; i++){
      let existe = this.TOTALES.find(x => x.material == this.Almacenado[i].material.nombre && x.marca == this.Almacenado[i].material.marca);
      if(existe){
          let x = this.TOTALES.findIndex(x => x.material == this.Almacenado[i].material.nombre && x.marca == this.Almacenado[i].material.marca)
          
          this.TOTALES[x].total = Number(this.TOTALES[x].total)
          this.Almacenado[i].cantidad = Number(this.Almacenado[i].cantidad)
          this.Almacenado[i].neto = Number(this.Almacenado[i].material.neto)

          let def = (this.Almacenado[i].neto * this.Almacenado[i].cantidad) / this.TOTALES[x].neto

          this.TOTALES[x].total = this.TOTALES[x].total + def;

        }else{
        this.TOTALES.push({
                       material:this.Almacenado[i].material.nombre,
                       marca:this.Almacenado[i].material.marca,
                       grupo:this.Almacenado[i].material.grupo.nombre,
                       presentacion:this.Almacenado[i].material.presentacion,
                       neto:this.Almacenado[i].material.neto,
                       unidad:this.Almacenado[i].material.unidad,
                      ancho:this.Almacenado[i].material.ancho,
                      largo:this.Almacenado[i].material.largo,
                      total:this.Almacenado[i].cantidad
                    })
                    console.log(this.TOTALES, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
      }
    }

  }

  
  //   for(let i=0; i<this.ALMACEN.length; i++){

  //      let existe = this.TOTALES.find(x => x.material ==  this.ALMACEN[i].nombre && x.marca == this.ALMACEN[i].marca);

  //      if(existe){

  //       if(this.ALMACEN[i].grupo.nombre === 'Sustrato'){
  //         let Existe = this.TOTALES.find(x => x.ancho == this.ALMACEN[i].ancho && x.largo == this.ALMACEN[i].largo)
            
  //         if(Existe){
  //           let findIndex = this.TOTALES.findIndex(x => x.ancho == this.ALMACEN[i].ancho && x.largo == this.ALMACEN[i].largo && x.material ==  this.ALMACEN[i].nombre && x.marca == this.ALMACEN[i].marca)

  //           // let total = this.TOTALES[findIndex].total;
  //           let cantidad = this.ALMACEN[i].cantidad

  //           let Almacen = cantidad * this.ALMACEN[i].neto;


  
  //           this.TOTALES[findIndex].neto = this.TOTALES[findIndex].neto + Almacen
            
  //           // this.TOTALES[findIndex].total = 1;

  //           // console.log('HEREEEE ',this.TOTALES[findIndex], 'Almacen: ',this.ALMACEN[i])

  //         }else{
  //           this.TOTALES.push({
  //             material:this.ALMACEN[i].nombre,
  //             marca:this.ALMACEN[i].marca,
  //             // total:this.ALMACEN[i].cantidad,
  //             grupo:this.ALMACEN[i].grupo.nombre,
  //             presentacion:this.ALMACEN[i].presentacion,
  //             neto:this.ALMACEN[i].neto,
  //             unidad:this.ALMACEN[i].unidad,
  //             // ancho:this.ALMACEN[i].ancho,
  //             // largo:this.ALMACEN[i].largo
  //           })
  //         }
  //         // else{
  //         //   let findIndex = this.TOTALES.findIndex(x => x.material ==  this.ALMACEN[i].nombre && x.marca == this.ALMACEN[i].marca)

  //         // let total = this.TOTALES[findIndex].total;
  //         // let cantidad = this.ALMACEN[i].cantidad

  //         // if(this.ALMACEN[i].neto != this.TOTALES[findIndex].neto){
            
  //         //   let NewNETO = this.ALMACEN[i].neto / this.TOTALES[findIndex].neto
            
  //         //   cantidad = this.ALMACEN[i].cantidad * NewNETO;

  //         // }
          
  //         // this.TOTALES[findIndex].total = total + cantidad;
  //         // }

  //       }else{

  //         let findIndex = this.TOTALES.findIndex(x => x.material ==  this.ALMACEN[i].nombre && x.marca == this.ALMACEN[i].marca)

  //         // let total = this.TOTALES[findIndex].total;
  //         let cantidad = this.ALMACEN[i].cantidad

  //         if(this.ALMACEN[i].neto != this.TOTALES[findIndex].neto){
            
  //           let NewNETO = this.ALMACEN[i].neto / this.TOTALES[findIndex].neto
            
  //           cantidad = this.ALMACEN[i].cantidad * NewNETO;

  //         }
          
  //         this.TOTALES[findIndex].total = total + cantidad;


  //       }

  //      }else{
  //        this.TOTALES.push({
  //          material:this.ALMACEN[i].nombre,
  //          marca:this.ALMACEN[i].marca,
  //         //  total:this.ALMACEN[i].cantidad,
  //          grupo:this.ALMACEN[i].grupo.nombre,
  //          presentacion:this.ALMACEN[i].presentacion,
  //          neto:this.ALMACEN[i].neto,
  //          unidad:this.ALMACEN[i].unidad,
  //          ancho:this.ALMACEN[i].ancho,
  //          largo:this.ALMACEN[i].largo
  //        })
  //      }

  //   }
  // }

  changeView(){

    if(this.resumido){
      this.resumido = false;
      this.detallado = true;
    }else{
      this.resumido = true;
      this.detallado = false;
    }
  }

  seleccion_inventario(material, marca){
    
    let materiales_en_almacen = [];

    for(let i=0; i<this.ALMACEN.length; i++){
      if(this.ALMACEN[i].nombre == material && this.ALMACEN[i].marca == marca){
        materiales_en_almacen.push({
          nombre:this.ALMACEN[i].nombre,
          marca:this.ALMACEN[i].marca,

        });
      }
    }

    return materiales_en_almacen;
  }

  Lote(e, material, cantidad, i){

    let EnAlmacen = this.Almacenado.find(x => x.material.nombre === material && x.lote === e)

    console.log('******/*/*/*/*/*/*/*/*/*/*/', EnAlmacen)

    let unidad_necesaria = cantidad / EnAlmacen.material.neto;


    unidad_necesaria = Math.trunc(unidad_necesaria)
    EnAlmacen.cantidad = Math.trunc(EnAlmacen.cantidad)

    document.getElementById(`Necesario-${i}`).innerHTML = `${unidad_necesaria} ${EnAlmacen.material.presentacion}(s) necesaria(s)`
    document.getElementById(`Almacenados-${i}`).innerHTML = `${EnAlmacen.cantidad} ${EnAlmacen.material.presentacion}(s) En Almacen`
    
    
    let restante =  EnAlmacen.cantidad - unidad_necesaria;
    restante = Math.trunc(restante)

    if(restante < 0){
      restante = Math.abs(restante);
      document.getElementById(`Restante-${i}`).innerHTML = `
      <b>Faltan: </b>${restante} <br>
      `
      document.getElementById(`fijar_lote-${i}`).style.display = "block";

      let check = document.getElementById(`fijar_lote-${i}`);

      check.onclick = () => this.fijalote(e, 0, i, EnAlmacen.cantidad*EnAlmacen.neto)


      // <input type="checkbox" (click)='fijalote(${e},${EnAlmacen.cantidad})'> Fijar lote
    }else{
      document.getElementById(`fijar_lote-${i}`).style.display = "none";
      document.getElementById(`Restante-${i}`).innerHTML = `<b>Restan: </b>${restante} ${EnAlmacen.material.presentacion}(s) En Almacen`
      
      let existe = this.LOTES.find(x => x.lote === e)

      if(!existe){
        this.LOTES.push({lote:e,resta:restante,i,almacenado:EnAlmacen.cantidad})
      }else{
        let index = this.LOTES.findIndex(x => x.lote === e)
        this.LOTES.splice(index , 1);
      }
      
      console.log(this.LOTES)
    }



  }

  fijalote(lote, resto, i, almacenado){

    let existe = this.LOTES.find(x => x.lote === lote)

      if(!existe){
        this.LOTES.push({lote,resta:resto,i,almacenado})
      }else{
        let index = this.LOTES.findIndex(x => x.lote === lote)

      }

      console.log(this.LOTES)
  
  }

  Unidad(material){
    let unidad = this.ALMACEN.find(x => x.nombre === material)

    return unidad.unidad
  }

  cantidad_lotes(x){

    let lotes = this.LOTES.length;
    let total = 0;
    
    for(let i = 0; i<lotes; i++){
      if(this.LOTES[i].i == x){
        total ++
      } 
    }

    return total;

  }

  existencia(x){
    let lotes = this.LOTES.length;
    let existencia = 0;
    for(let i = 0; i<lotes; i++){
      if(this.LOTES[i].i == x){
        existencia = existencia + this.LOTES[i].almacenado;
      } 
    }

    return existencia
  }

  borrarLote(lote){
    let index = this.LOTES.findIndex(x => x.lote === lote)

    this.LOTES.splice(index,1)
  }




}
