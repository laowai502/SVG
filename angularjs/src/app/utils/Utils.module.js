(function () {
    'use strict';
    angular.module('WeUtils', []);
  /**
   * 列表省略号方法  使用方法：{{some_text | cut:true:100:' ...'}}
   * @Author zhaoming@mapbar.com
   * @Date 2016/11/10 9:52
   */
  angular.module('WeViews').filter('cut', function () {
    return function (value, wordwise, max, tail) {
      if (!value) return '';

      max = parseInt(max, 10);
      if (!max) return value;
      if (value.length <= max) return value;

      value = value.substr(0, max);
      if (wordwise) {
        var lastspace = value.lastIndexOf(' ');
        if (lastspace != -1) {
          value = value.substr(0, lastspace);
        }
      }
      return value + (tail || ' …');
    };
  });
  angular.module('WeViews').filter('paged', function() {
  return function(pages, nowpage) {
     var newpage = [];
    if ((pages instanceof Array) && (typeof nowpage === 'number')) {
      if (pages.length <= 10) {
        return pages;
      }
      if (pages.length == 1) {
        return [];
      }
      left = nowpage;
      right = pages.length - nowpage;
      var i = 0;
      if (left > 5) {
        i = nowpage - 5;
      }
      if (right < 5) {
        i = pages.length - 10;
      }
      for (; newpage.length < 10; i++) {
        newpage.push(pages[i]);
      }
      return newpage;
    }
    return pages;
  };
}).filter('removeOdd', function(){			//返回数组中奇数索引，并生成字符串
	
	return function(arr) {
		if(!arr) return;
		var newarr = [];
		for(var i=0,j=arr.length; i<j; i++){
			if(i%2 != 0){
				newarr.push(arr[i]);
			}
		}
		return newarr.join();
	}
	
}).filter('simplePostData', function(){		//post请求时简化深层次json数据
	
	return function(data){	
		var obj = angular.copy(data);
    	for(var i in obj){
    		if(angular.isObject(obj[i])){
    			obj[i] = JSON.stringify(obj[i]);
    		}
    	}
    	return obj;
	}
	
}).filter('minToHour', function(){		//分钟转换成小时，并保留小数点后两位

	return function(min){
        if(min){
            var minutus=(parseInt(min)/60).toFixed(1);
            return minutus;
        }
	}

});

})();
