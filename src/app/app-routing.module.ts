import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './index/main/main.component';
import { OrdenComponent } from './orden/orden.component';
import { PlanificacionComponent } from './planificacion/planificacion.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './Auth/auth-guard.guard';

const routes: Routes = [
  {
    path:'',
    canActivate: [AuthGuard],
    loadChildren: ()=> import('./index/index.module').then(m => m.IndexModule),
  },
  {
    path:'orden-produccion/:id',
    canActivate: [AuthGuard],
    component:OrdenComponent
  },
  {
    path: 'orden',
    canActivate: [AuthGuard],
    loadChildren: ()=> import('./nuevo-pedido/nuevo-pedido.module').then(m => m.NuevoPedidoModule)
  },
  {
    path: 'gestiones',
    canActivate: [AuthGuard],
    loadChildren: ()=> import('./producto-ymaquinaria/producto-ymaquinaria.module').then(m=> m.ProductoYMaquinariaModule)
  },
  {
    path: 'almacen',
    canActivate: [AuthGuard],
    loadChildren: ()=> import('./almacen/almacen.module').then(m=>m.AlmacenModule)
  },
  {
    path: 'ordenes',
    canActivate: [AuthGuard],
    loadChildren: ()=> import('./ordenes/ordenes.module').then(m=>m.OrdenesModule)
  },
  {
    path: 'planificacion',
    canActivate: [AuthGuard],
    component:PlanificacionComponent
  },
  {
    path: 'login',
    component:LoginComponent
  }

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot( routes )
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
