import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TelPage } from './tel';

@NgModule({
  declarations: [
    TelPage,
  ],
  imports: [
    IonicPageModule.forChild(TelPage),
  ],
})
export class TelPageModule {}
