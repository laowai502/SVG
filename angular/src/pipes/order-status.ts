import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'orderStatus',
})
export class OrderStatusPipe implements PipeTransform {

	transform(status: string, ctime?: string) {
		let text;
		switch (status){
			case '1': text = '建单时间: '+ ctime;
				break;
			case '2': text = '当前状态: 待出发';
				break;
			case '3': text = '当前状态: 待接车';
				break;
			case '4': text = '当前状态: 检查中';
				break;
			case '5': text = '当前状态: 维修中';
				break;
			default:
				break;
		}
		return text || '';
	}
}