import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EulerComponent } from './euler/euler.component';
import { MenuComponent } from './menu/menu.component';
import { NewtonComponent } from './newton/newton.component';
import { RungeComponent } from './runge/runge.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
  {
    path: "home", 
    component: MenuComponent
  },
  {
    path: "euler", 
    component: EulerComponent
  },
  {
    path: "runge-kutta", 
    component: RungeComponent
  },
  {
    path: "newton-raphson", 
    component: NewtonComponent
  },
  {
    path: "**", 
    component: MenuComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
