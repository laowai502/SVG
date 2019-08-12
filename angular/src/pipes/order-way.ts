import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'orderWay',
})
export class OrderWayPipe implements PipeTransform {
	/**
	  * 
	  * @param value 预约方式
	*/
	transform(value: number) {
		if(value == 1) {//客服
			return 'assets/images/customer-service.png';
		}else if(value == 2) {//司机
			return 'assets/images/driver.png';
		}else if(value == 3) {//服务站
			return 'assets/images/service-station.png';
		}else if(value ==4) {//司机
			return 'assets/images/driver.png';
		}else{
			return '';
		}
	}
}
