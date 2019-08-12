import { BaseModel } from './BaseModel'
/**
 * 用户个人信息
 */
export interface UserModel extends BaseModel {
	
	//服务站名称
	serviceStationName: string;
	//服务站编码
	serviceCode: string;
	//用户Id
	accountId: string;
	//用户名
	accountName: string;
	//联系电话
	phone: string;
	//通讯地址
	address: string;
	//权限编码
	roleCode: string;
	//设备ID
	deviceId: string;

}