import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { AlmacenRoutingModule } from './almacen-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';




@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    AlmacenRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AlmacenModule { }
