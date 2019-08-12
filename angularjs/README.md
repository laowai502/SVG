## 商砼共管平台

### 安装本地环境

      $ npm install

      $ npm install -g bower

      $ bower install

      $ npm install -g gulp

      $ npm rebuild node-sass

### 启动服务

	$ gulp serve              根据/assets/config/config.js的配置启动服务

	$ gulp serve --env dev    启动开发服务

	$ gulp serve --env test   启动测试服务

	$ gulp serve --env uat    启动UAT服务

	$ gulp serve --env pro    启动线上服务

### 打包部署

	  $ gulp --env dev     打开发包

	  $ gulp --env test    打测试包

      $ gulp --env uat     打UAT包

      $ gulp --env pro     打线上包

# 规则

### 图标icon
      http://fontawesome.io/icons/

      http://v3.bootcss.com/components/

### 空格
      &nbsp;

### 通用样式前缀规则  app-
> 例子：（app.css）

      .app-list-nav{ } //列表页标题


### 调取接口的service服务规则
> 例子：

>  驼峰命名inforService.js
>  文件对应路由的name
>  inforService.js放在services-main文件夹
>  共同接口调取都写在service/common/common.service.js
>  已写好的。不要再修改，防止发生冲突
>  不调接口的固定数据写在service/common/common.service.js，如下拉：通用车辆状态

      carStatus: function () {
          return [
              {key:1,value:'行驶'},{key:2,value:'静止'},{key:3,value:'离线'}
          ]
      }

# 方法
### 获取当前时间
> api：http://momentjs.cn/

       $scope.nowTime=moment().format('YYYY-MM-DD');

# 通用
### 批量导出
> /common/export

        /**
         * type-------
         *          请求地址对应参数，并修改common.service.js里对应url
         * filter-----
         *          参数 对象类型（{aaa:'xxx',bbb:'xxx'}）
         **/

         $root.app_export(type,filter); // 例子：车辆管理-车辆信息管理-导出：

### 批量导入
> /common/import

		/**
		 * massage[Object]
		 *          - tip：提示语(string 'xxx')
		 *          - label：下拉框标题(string 'xxx')
		 * type-----
		 *          模板下载的类型
		 * th-------
		 *          异常列表的名头(Array ['xxx','xxx','xxx'])
		 * td-------
		 *          异常列表字段(Array ['xxx','xxx','xxx'])
		 * route----
		 *          导入的接口地址(string '/xxx/xxx')
		 * params---
		 *          导入的参数名(string 'xxx,xxx,xxx')
		 * paramsVal
		 *          导入的参数值(string 'xxx,xxx,xxx')
		 * downUrl--
		 *          模板下载地址(string '/xxx/xxx.xlsx')
		 * callBack-
		 *          回调函数
		 **/

		 $rootScope.app_import(herf,th,td,route,massage,params,paramsVal);

### 请求不确定路径的接口:

		/**
		 * route----
		 *          接口路径(string '/xxx/xxx')
		 * params---
		 *          入参(object {key1:value1,key2:value2})
		 * method---
		 *          请求方式(string 'get'/'post')
		 **/
		
         CommonService.getDataCommonService(route,params,method);
