import { Injectable } from '@angular/core';
import { Jsonp } from '@angular/http';
import ServerConfig  from '../../constants/serviceConfig';
import { CommonProvider } from '../common';
import 'rxjs/add/operator/map';
declare let BMap;
declare let BMAP_ANCHOR_BOTTOM_RIGHT;
declare let BMAP_NAVIGATION_CONTROL_ZOOM;
declare let baidumap_location;

@Injectable()
export class BaiduMapProvider {

	constructor(private jsonp: Jsonp, private commonProvider: CommonProvider) {
		console.log('Hello BaiduMapProvider Provider');
	}
	//创建地图
	public creatMap(id): any{
		let map = new BMap.Map(id);
		map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);//初始化地图
		map.enableScrollWheelZoom(true);//启动滚轮缩放，方便web调试 
		var ctrl_nav = new BMap.NavigationControl({//添加缩放控件
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            type: BMAP_NAVIGATION_CONTROL_ZOOM
        });
		map.addControl(ctrl_nav);
		return map;
	}
	//添加遮罩
	public addMark(point,radius,map,zoom): any{
		console.log(zoom)
		map.centerAndZoom(point, zoom);
		 //创建圆
		let circle = new BMap.Circle(point,radius,{ fillColor:'#4287FF', fillOpacity: 0.5, strokeColor:"transparent",strokeWeight:0});
		map.addOverlay(circle);
		return circle;
	}
	//地图打点
	public setMark(point,map,src,width,height): any{
		let marker = new BMap.Marker(point,{
            icon: new BMap.Icon(src, new BMap.Size(width, height), { imageOffset: new BMap.Size(0, 0)})
		});
		marker.setZIndex(900);
		map.addOverlay(marker);
		map.panTo(point);
		map.centerAndZoom(point, 16);
		return marker;
	}
	//坐标点转换（谷歌转百度）
	public googleToBaidu (lng,lat) :any{
		let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
		let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi);
		let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi);
		let bd_lon = z * Math.cos(theta) + 0.0065;
		let bd_lat = z * Math.sin(theta) + 0.006;
		let point =new BMap.Point(bd_lon.toFixed(6),bd_lat.toFixed(6));
		return point;
	}
	//坐标点转换（百度转谷歌）
	public baiduToGoogle (lng,lat) :any{
		let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
		var x = lng - 0.0065, y = lat - 0.006;
		var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
		var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
		var lon02 = Number(Number(z * Math.cos(theta)).toFixed(6));//保留6位小数
		var lat02 = Number(Number(z * Math.sin(theta)).toFixed(6));
		x_pi = null;
		x = null;
		y = null;
		z = null;
		theta = null;
		return { lng: lon02, lat: lat02 };
	}

	/**
	 * 获取当前位置信息
	 * @param success 成功的回调
	 * @param fail 失败的回调
	 */
	public getCurrentLocation(success, fail?) :any{
		if(this.commonProvider.isMobile()){
			baidumap_location.getCurrentPosition(success, ()=>{
				this.commonProvider.httpToast('经纬度获取失败,请重试', 1500);
			});
		}
	}

	public getAddress(lat:string,lng:string,type:string) {
		let params = ServerConfig.baidu_reserve +'&output=json&location=' +lat+','+lng+'&coordtype='+type+'&callback=JSONP_CALLBACK';
		return this.jsonp.request(params);
	}

}
