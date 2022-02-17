import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from '../services/rest-api.service';

import { PdfMakeWrapper, Txt, Img, Table, Cell, Columns, Stack } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import * as moment from 'moment';

@Component({
  selector: 'app-orden',
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.css']
})
export class OrdenComponent implements OnInit {

  public id!:any;
  public PRODUCTO

  constructor(private route:ActivatedRoute,
              private api:RestApiService) { 
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.api.getOrdenById(this.id)
      .subscribe((resp:any)=>{
        this.PRODUCTO = resp;
        console.log(this.PRODUCTO)
      })
  }

  descargarPDF(){

    let PRODUCTO = this.PRODUCTO
    let materiales = [];
    let long = PRODUCTO.producto.materiales;

    for(let i=0; i<long.length; i++){
      materiales.push(long[i].material)
    }

    let fecha1 = moment(this.PRODUCTO.fecha).format('DD-MM-yyyy');

    const pdf = new PdfMakeWrapper();
    PdfMakeWrapper.setFonts(pdfFonts);

    async function generarPDF(){
      pdf.add(
        new Table([
          [
            new Cell( await new Img('../../assets/Poligrafica_black_P.png').build()).end,
            new Cell( new Table([[new Cell(new Txt('ORDEN DE PRODUCCIÓN').end).fillColor('#dedede').fontSize(10).end],
                                  [new Cell(new Txt(`${PRODUCTO.sort}`).end).fontSize(30).end],
                                  [new Cell(new Txt(`FECHA DE EMISION: ${fecha1}`).end).fontSize(8).end]
                                ]).end).alignment('center').end
          ]
        ]).widths(['70%','30%']).layout('noBorders').end
      )
      pdf.add(

        pdf.ln(2)
        
      )
      pdf.add(
        new Table([
          [
            new Cell( new Txt(`CLIENTE: ${PRODUCTO.cliente.nombre}`).end).end,
            new Cell( new Txt(`O.C.: ${PRODUCTO.orden}`).end).end,
          ],
          [
            new Cell( new Txt(`PRODUCTO: ${PRODUCTO.cliente.codigo} - ${PRODUCTO.producto.codigo} ${PRODUCTO.producto.producto}`).end).colSpan(2).end,
            ''
          ]
        ]).widths(['60%','40%']).end
      )
      pdf.add(
        new Table([
          [
            new Cell( new Txt('ENTREGAS').end).fillColor('#dedede').end
          ]
        ]).widths(['100%']).alignment('center').layout('noBorders').end
      )
      pdf.add(
        new Table([
          [
            'N° ENTREGA','CANTIDAD','FECHA','OBSERVACIÓN'
          ],
          [
            '1',
            new Cell( new Txt(`${PRODUCTO.cantidad}`).end).end,
            new Cell( new Txt(`${PRODUCTO.fecha_s}`).end).end,
            ''
          ],
          [
            'TOTAL',
            new Cell( new Txt(`${PRODUCTO.cantidad}`).end).end,
            new Cell( new Txt('').end).border([false, false]).end,
            new Cell( new Txt('').end).border([false, false]).end
          ]
        ]).widths(['24%','24%','24%','28%']).end
      )
      pdf.add(
        new Table([
          [
            new Cell( new Txt('MONTAJE Y DESARROLLO').end).fillColor('#dedede').end
          ]
        ]).widths(['100%']).alignment('center').layout('noBorders').end
      )
      pdf.add(
        new Table([
          [
            'VERSIÓN','IMPRESIÓN','POST-IMPRESION'
          ],
          [
            new Cell( new Txt(`${PRODUCTO.producto.version}`).end).end,
            new Cell( new Stack(materiales).end).end,
            new Cell( new Stack(PRODUCTO.producto.post).end).end
          ],
        ]).widths(['30%','40%','30%']).end
      )
      pdf.add(
        new Table([
          [
            new Cell( new Txt('SUSTRATO').end).fillColor('#dedede').end
          ]
        ]).widths(['100%']).alignment('center').layout('noBorders').end
      )
      pdf.add(
        new Table([
          [
            new Cell( new Txt(`TIPO DE SUSTRATO: ${PRODUCTO.producto.sustrato}`).end).colSpan(2).end,
            ''
          ],
          [
            new Cell( new Txt(`TAMAÑO ORIGINAL: ${PRODUCTO.producto.dimensiones}`).end).end,
            new Cell( new Txt(`DIRECCIÓN DE FIBRA: ${PRODUCTO.producto.fibra}`).end).end,
          ],
          [
            new Cell( new Txt(`DEMASIA: ${PRODUCTO.demasia}`).end).end,
            new Cell( new Txt(`TAMAÑO A IMPRIMIR: ${PRODUCTO.paginas}`).end).end,
          ]
        ]).widths(['50%','50%']).end
      )
  
      pdf.create().download()
    }

    generarPDF();

  }

}
