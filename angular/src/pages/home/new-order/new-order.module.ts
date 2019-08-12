import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewOrderPage } from './new-order';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    NewOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(NewOrderPage),
    ComponentsModule
  ],
})
export class NewOrderPageModule {}
