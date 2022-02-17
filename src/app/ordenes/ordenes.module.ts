import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { OrdenesRoutingModule } from './ordenes-routing.module';
import { GestionComponent } from './gestion/gestion.component';



@NgModule({
  declarations: [MainComponent, GestionComponent],
  imports: [
    CommonModule,
    OrdenesRoutingModule
  ]
})
export class OrdenesModule { }
