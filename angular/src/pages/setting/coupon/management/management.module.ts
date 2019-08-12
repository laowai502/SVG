import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagementPage } from './management';
import { ComponentsModule } from '../../../../components/components.module';
import { CouponService } from '../../../../service/CouponService';
import { LoginService } from '../../../../service/LoginService';

@NgModule({
  declarations: [
    ManagementPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagementPage),
    ComponentsModule
  ],
  providers: [ CouponService, LoginService ]
})
export class ManagementPageModule {}
