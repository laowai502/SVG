import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BreakCodePage } from './break-code';
import { CodePage } from './code-info';
import { BreakCodeService } from '../../../service/BreakCodeService';

@NgModule({
	declarations: [
		BreakCodePage,
		CodePage
	],
	imports: [
		IonicPageModule.forChild(BreakCodePage),
	],
	entryComponents: [ CodePage ],
	providers: [ BreakCodeService ],
})
export class BreakCodePageModule {}
