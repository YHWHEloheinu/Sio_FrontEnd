import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenesComponent } from './ordenes.component';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { OrdenComponent } from '../orden/orden.component';
import { GestionComponent } from './gestion/gestion.component';


const routes: Routes =[
  {
    path:'',
    component:OrdenesComponent,
    children:[
      {
        path:'',
        component:MainComponent
      },
      {
        path:'gestion',
        component:GestionComponent
      }
      
      ]
}]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class OrdenesRoutingModule { }
