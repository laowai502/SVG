import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { DetailPage } from './detail';
import { DealPage } from './deal';
import { RepairHistory } from './repair-history';
import { OrderNoPage } from './order-no';
import { OrderYesPage } from './order-yes';
import { OutConfirmPage } from './out-confirm';
import { OutSecondPage } from './out-second';
import { HelpPlaceComponent } from './help-place';

import { DealService } from '../../../service/DealService';
import { OrderService } from '../../../service/OrderService';

import { ComponentsModule } from '../../../components/components.module';

@NgModule({
	declarations: [
		DetailPage,
		DealPage,
		RepairHistory,
		OrderNoPage,
		OrderYesPage,
		OutConfirmPage,
		OutSecondPage,
		HelpPlaceComponent
	],
	imports: [
		IonicPageModule.forChild(DetailPage),
		ComponentsModule
	],
	entryComponents: [
		DetailPage,
		DealPage,
		RepairHistory,
		OrderNoPage,
		OrderYesPage,
		OutConfirmPage,
		OutSecondPage,
		HelpPlaceComponent
	],
	providers: [
		DealService,
		OrderService
	]
})
export class DetailPageModule {}