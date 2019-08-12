import { Component, Input } from '@angular/core';
import moment from 'moment';

@Component({
	selector: 'ticket',
	templateUrl: 'ticket.html'
})
export class TicketComponent {
	query: any;
	flag: boolean = false;
	@Input()
	public coupons: any;
	@Input()
	public beforePage: any;
	constructor() {
		
	}
	ionViewDidLoad() {
		
	}
	ngOnInit(): void {
		this.query = this.coupons; 
		if(this.beforePage){
			if(this.beforePage == 'detail'){
				this.flag = true;
			}
		}
		if(this.coupons.endDate == '9999-01-01') {
			this.query.outDate = false;
		}else{
			let start = moment().dayOfYear();
			let end = moment(this.coupons.outDate).dayOfYear();
			if((end-start) <= 7){
				this.query.outDate = true
			}else{
				this.query.outDate = false;
			}
		}
	}

}
