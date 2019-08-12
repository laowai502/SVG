import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderRepairPage } from './order-repair';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    OrderRepairPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderRepairPage),
    ComponentsModule
  ],
})
export class OrderRepairPageModule {}
