import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NearbyCarPage } from './nearby-car';

@NgModule({
  declarations: [
    NearbyCarPage,
  ],
  imports: [
    IonicPageModule.forChild(NearbyCarPage),
  ],
})
export class NearbyCarPageModule {}
