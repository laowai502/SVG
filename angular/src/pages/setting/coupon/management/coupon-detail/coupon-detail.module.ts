import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CouponDetailPage } from './coupon-detail';
import { ComponentsModule } from '../../../../../components/components.module';
import { CouponService } from '../../../../../service/CouponService';

@NgModule({
  declarations: [
    CouponDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CouponDetailPage),
    ComponentsModule
  ],
  providers: [ CouponService ]
})
export class CouponDetailPageModule {}
