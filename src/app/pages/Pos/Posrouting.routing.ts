import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPosComponent } from './MainPos/MainPos.component';


const routes: Routes = [
  {
    path: '',
    component: MainPosComponent,
    data: {
      breadcrumb: 'Pos',
      icon: 'icofont-table bg-c-blue',
      breadcrumb_caption: 'All Brands Detail',
      status: true
    }
  }

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosRoutingModule { }
