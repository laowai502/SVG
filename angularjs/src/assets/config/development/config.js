var CONF = {
	//接口地址
	serviceUrl: "http://sy.aerozhonghuan.com/dev/kaxingzhe/api/ni/tocapp/", //测试地址
//	serviceUrl: "http://www.cnkaxingzhe.com/niapi/ni/tocapp/", //线上环境
	//文件上传地址
	uploadUrl: "http://sy.aerozhonghuan.com/fsm/fsevice/uploadFile?account=www", //测试，开发通用地址
//	uploadUrl: "http://www.cnkaxingzhe.com/fsm/fsevice/uploadFile?account=www", //线上环境
	//用户中心
	usercenter: 'http://sy.aerozhonghuan.com/dev/kaxingzhe/api/ni/usercenter/user/', //测试地址
//	usercenter: 'http://www.cnkaxingzhe.com/niapi/ni/usercenter/user/', //线上环境
	
	rpresetUrl: 'http://10.30.50.177:5556/', //载重模块基于云端接口地址
	
	trafficMapUrl: 'http://carnavi.mapbar.com/ykTMC/02/GetPng?' //实时路况地图数据（暂时没用，不用改）
};
var ENV = 'development';