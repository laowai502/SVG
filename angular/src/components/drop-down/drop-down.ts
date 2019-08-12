import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PopoverController, Events  } from 'ionic-angular';
import { SelectContentComponent } from './select-content/select-content';
/**
 * 非公共组件，后期优化
 */
@Component({
	selector: 'drop-down',
	template: `
		<div class="select-title" (tap)="presentRadioPopover($event)">
			<span [class]="text==placeholder?'select-placeholder':'select-text'">{{text}}</span>
			<div class="select-icon">
				<div class="select-icon-inner"></div>
			</div>
		</div>
	`
})
export class DropDownComponent {

	text: string = '';
	dataDate: string = '';
	@Input() activityDateList: any = [];
	@Input() placeholder: string = '';
	@Output() changeActivityDate = new EventEmitter<string>();

	constructor(private popoverCtrl: PopoverController, public events: Events) {
		this.events.subscribe('getData', (data) => {
			if(data.name){
				this.text = data.name;
				this.changeActivityDate.emit(data.id);
			}else{
				this.text = data;
				this.changeActivityDate.emit(data);
			}
		});
	}
	ngOnInit() {
		if(this.placeholder&&this.placeholder!=''){
			this.text = this.placeholder;
		}
	}
	presentRadioPopover(ev) {
		let popover = this.popoverCtrl.create(SelectContentComponent,{baseData: this.activityDateList,text: this.text});
		// Object.defineProperty(ev, 'target', { value: ev.currentTarget});
		popover.present({
			ev: ev
		});
	}

}
