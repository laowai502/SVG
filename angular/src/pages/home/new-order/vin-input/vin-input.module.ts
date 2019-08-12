import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VinInputPage } from './vin-input';

@NgModule({
  declarations: [
    VinInputPage,
  ],
  imports: [
    IonicPageModule.forChild(VinInputPage),
  ],
})
export class VinInputPageModule {}
