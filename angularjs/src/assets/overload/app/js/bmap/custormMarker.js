$(function() {
	
	function ComplexCustomOverlay(point) {
    	this._point = point;
    }
	
	// 继承API的BMap.Overlay  
	ComplexCustomOverlay.prototype = new BMap.Overlay();
	//2、初始化自定义覆盖物
	// 实现初始化方法  
	ComplexCustomOverlay.prototype.initialize = function(map) {
		// 保存map对象实例 
		this._map = map;
		
		var el = document.createElement('div');
		el.style.zIndex = 120;
		var p = document.createElement('div');
		p.className = 'ring-point-marker';
		var p1 = document.createElement('div');
		p1.className = 'ring-point-inner1';
		var p2 = document.createElement('div');
		p2.className = 'ring-point-inner2';
		var p3 = document.createElement('div');
		p3.className = 'ring-point-inner3';
		p.appendChild(p1);
		p.appendChild(p2);
		p.appendChild(p3);
		el.appendChild(p);
	
		// 将div添加到覆盖物容器中  
		map.getPanes().labelPane.appendChild(el); //getPanes(),返回值:MapPane,返回地图覆盖物容器列表  labelPane呢???
		// 需要将div元素作为方法的返回值，当调用该覆盖物的show、  
		// hide方法，或者对覆盖物进行移除时，API都将操作此元素。
		return el;
	}
	
	ComplexCustomOverlay.prototype.draw = function() {
		var map = this._map;
		var pixel = map.pointToOverlayPixel(this._point);
		this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
		this._div.style.top = pixel.y - 30 + "px";
	}
	
});
