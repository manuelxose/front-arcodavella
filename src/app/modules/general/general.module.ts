import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GeneralRoutingModule } from './general-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterOutlet, GeneralRoutingModule],
})
export class GeneralModule {}
