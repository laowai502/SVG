(function(){
	'use strict';

	angular.module('WeViews').controller('CommonImportController',
	function ($uibModalInstance,$rootScope,$scope,$window,RequestService,$timeout,massage,th,td,Message,route,params,paramsVal,downUrl,callBack,CommonService,$q) {

		/*
		 * massage--
		 *          tip：提示语(string 'xxx')
		 *          label：下拉框标题(string 'xxx')
		 * th-------
		 *          异常列表的名头(arr ['xxx','xxx','xxx'])
		 * td-------
		 *          异常列表字段(arr ['xxx','xxx','xxx'])
		 * route----
		 *          导入的接口地址(string '/xxx/xxx')
		 * params---
		 *		    导入的参数名(string 'xxx,xxx,xxx')
		 * paramsVal
		 *          导入的参数值(string 'xxx,xxx,xxx')
		 * downUrl--
		 *          模板下载地址(string '/xxx/xxx.xls')
		 * callBack-
		 *          回调函数
		 */

		var vm=this;
		vm.resultShow=false;
		vm.res={};
		vm.th=th;
		vm.td=td;
		vm.massage=massage;
		$scope.teamName='';
		var _params,_paramsVal;
		if(params!=''){
			_params=params.split(',');
		}
		if(paramsVal!=''){
			_paramsVal=paramsVal.split(',');
		}

		vm.href=downUrl;

		// $rootScope.team_defer= $q.defer();
		// $rootScope.team_defer.promise.then(function (data) {
		// 	$scope.teamId=data;
		// });
		vm.requesting=false;

		vm.toCancel = function() {
			$uibModalInstance.dismiss();
		};

		// console.log("回调长什么样样？？？？");console.log(callBack);

		/*上传*/
		vm.submit = function (evt) {
			evt.preventDefault();
			if(vm.file.name.match(/\.(\w+)$/)[1]!="xlsx"&&vm.file.name.match(/\.(\w+)$/)[1]!="xls"){
				Message.warning("上传文件格式不正确，请下载模板");
			}else{
				vm.requesting=true;
				CommonService.imgUpload(vm.file).then(function (data) {
					// console.log("文件服务器返回结果:----");console.log(data);
					var query={
						path:data.data.fullPath,
						fileType:data.data.ext_name,
						teamId:$scope.teamId
					};
					for(var key in _params){
						query[_params[key]]=_paramsVal[key]=='undefined'?'':_paramsVal[key];
					}
                    CommonService.getDataCommonService(route,query,'post').then(function (res) {
						Message.success('操作完成');
						
						vm.res.total=res.sum;
						vm.res.success=res.trueNum;
						vm.res.error=res.errNum;
						vm.res.errList=res.errorList;
 						vm.resultShow=true;
						callBack();
					}).catch(function (err) {
	                    vm.requesting=false;
						$rootScope.catchError(err);
					});

				}).catch(function () {
					$rootScope.catchError('获取文件失败，请重新上传');
				});

			}
		};
		/*车队树*/
		vm.test2=function () {
			// console.log('$scope.teamId----');console.log($scope.teamId);
		};
		var destroy=$scope.$watch('teamId', function (value) {
			// console.log('value----');console.log(value);

		});
		$scope.$on('$destroy',function () {
			destroy();
		});
	});
})();