import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NuevoPedidoComponent } from './nuevo-pedido.component';
import { MainComponent } from './main/main.component';


const routes: Routes =[
  {
    path:'',
    component:NuevoPedidoComponent,
    children:[
      {
        path:'',
        component:MainComponent
      }]
}]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class NuevoPedidoRoutingModule { }
