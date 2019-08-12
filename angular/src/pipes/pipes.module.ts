import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { AddressPipe } from './address/address';
import { OrderWayPipe } from './order-way';
import { OrderTypePipe } from './order-type';
import { OrderStatusPipe } from './order-status';
import { CutPipe } from './cut/cut';

@NgModule({
	declarations: [AddressPipe,
    OrderWayPipe,
    OrderTypePipe,
    CutPipe,
    OrderStatusPipe],
	imports: [
		HttpModule,
        JsonpModule
	],
	exports: [AddressPipe,
    OrderWayPipe,
    OrderTypePipe,
    CutPipe,
    OrderStatusPipe]
})
export class PipesModule {
	static forRoot() {
		return {
			ngModule: PipesModule,
			providers: [],
		};
	 }
}
