import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TimeLineComponent } from './time-line/time-line';
import { CitySearchComponent } from './city-search/city-search';
import { PipesModule } from '../pipes/pipes.module';
import { SelectPhotoComponent } from './select-photo/select-photo';
import { TicketComponent } from './ticket/ticket';
import { DropDownComponent } from './drop-down/drop-down';
import { SelectContentComponent } from './drop-down/select-content/select-content';

@NgModule({
	declarations: [
		TimeLineComponent,
		CitySearchComponent,
		SelectPhotoComponent,
    TicketComponent,
    DropDownComponent,
    SelectContentComponent,
	],
	imports: [
		IonicModule,
		PipesModule
	],
	exports: [
		TimeLineComponent,
		CitySearchComponent,
		SelectPhotoComponent,
    TicketComponent,
    DropDownComponent,
    SelectContentComponent,

	],
	entryComponents: [
		CitySearchComponent,
		SelectContentComponent
	]
})
export class ComponentsModule { }