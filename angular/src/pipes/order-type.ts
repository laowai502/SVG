import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'orderType',
})
export class OrderTypePipe implements PipeTransform {
	/**
	   * 
	   * @param woType 工单类型
	   * @param maintainWay 维修、保养 
	   */
	transform(woType: number, maintainWay: string) {
		if (woType == 1) {//站内维修
			if(maintainWay == "1") {
				return 'assets/images/inner-blue.png'//维修
			}else if(maintainWay == "2") {
				return 'assets/images/inner-orange.png'//保养
			}else if(maintainWay == "3") {
				return 'assets/images/inner-green.png'//维修+保养
			}else{
				return '';
			}
		} else if (woType == 2) {//外出
			if (maintainWay == "1") {
				return 'assets/images/out-blue.png'//维修
			}else if(maintainWay == "2") {
				return 'assets/images/out-orange.png'//保养
			}else if(maintainWay == "3") {
				return 'assets/images/out-green.png'//维修+保养
			}else{
				return '';
			}
		} else {
			return 'assets/images/to-receive.png'
		}
	}


}
