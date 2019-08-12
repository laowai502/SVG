/*
* 通过参数判断导出请求的url
*
* */
(function () {
  'use strict';

  angular.module('WeViews').factory('myExport', function () {
    //定义factory返回对象
    var myExport = {};

    var _export = function (type,filter) {
      console.log(type,filter);

      var url='';
    };

    myExport.export = _export;


    return myExport;

  });
})();
