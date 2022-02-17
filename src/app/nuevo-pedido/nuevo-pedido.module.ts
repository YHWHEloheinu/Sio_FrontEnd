import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { NuevoPedidoRoutingModule } from './nuevo-pedido-routing.module';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    NuevoPedidoRoutingModule,
    FormsModule
  ],
  exports: [MainComponent]
})
export class NuevoPedidoModule { }
