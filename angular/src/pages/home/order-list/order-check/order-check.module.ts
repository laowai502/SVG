import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderCheckPage } from './order-check';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    OrderCheckPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderCheckPage),
    ComponentsModule
  ],
})
export class OrderCheckPageModule {}
