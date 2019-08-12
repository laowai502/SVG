(function() {

	'use strict';

	angular.module('WeComponents')
		.directive('weVali', Vali)
		.directive('weValiFocus', ValiFocus);

	/**
	 * @description 基于angular1.6.x版本的form表单校验
	 * @example <we-vali name="mlength" etype="required,minlength,maxlength" etext="该项不能为空,长度最小不能少于4位,长度最长不能多于8位" custom="confirm,两次输入密码不一致,=,numChar"></we-vali>
	 * name: 对应表单项name, etype: 表单项检验类型, etext: 对应校验项错误提示, custom: 自定义校验, 以逗号分隔, 分四项 ①自定义检验名称, ②对应错误提示, ③校验方式(需要根据项目业务自定义维护成一套case), 
	 *       ④可有可无, 有值时为对应其他表单项, 若无则只想到异步校验
	 */
	function Vali(){
		return {
			restrict: 'AE',
			replace: true,
			transclude: true,
			templateUrl: 'app/components/directive/vali.html',
			scope: true,
			require: '^^form',
			link: function(scope, iElement, attrs, formCtrl){
				//form表单
				var formElement = angular.element('form[name="' + formCtrl.$name + '"]');
                //表单标签name
                scope.model = formCtrl[attrs.name];
                //用required判断该标签是否必填
                scope.isRequired = formCtrl[attrs.name].$$attr.required;               
                //检验错误类型
                scope.errType = attrs.etype.split(',');
                //校验提示文字
                scope.errText = attrs.etext.split(',');
                //当提交表单时,显示所有错误
                scope.submitted = false;
                //是否含有特殊检验类型
                if(attrs.custom) {
                	var customArr = attrs.custom.split(',');
                	if(customArr.length === 4) {
                		var contrast = formCtrl[customArr[3]];
                	}
                	scope.model.$setValidity(customArr[0], true);
                	scope.errType.push(customArr[0]);
                	scope.errText.push(customArr[1]);
                	scope.$watch('model.$viewValue', function(newVal) {
                		if(newVal && newVal !== '') {
                			if(customArr[2] === '=') {
                				scope.model.$setValidity(customArr[0], newVal == contrast.$viewValue);
                			}
                		}else{
                			scope.model.$setValidity(customArr[0], true);
                		}
                	});
                }
                //错误提示分类显示
                scope.showErrorText = function(param){
                	var detailType = param.split(':'), isShow = false;
                	
                	angular.forEach(detailType, function(e){
                		if(scope.model.$error[e]){
                			isShow = true;
                		}
                	});
                	
                	return isShow;
                };
                //判断必填项和非必填项
                scope.showIsRequired = function(param){
                	if(scope.isRequired){
                		return param.$dirty || param.$valid || scope.submitted;
                	}else{
                		return param.$invalid;
                	}
                };
                //点击提交
                formElement.on('submit', function(){
                	scope.$apply(function(){
                        scope.submitted = true;
                    });
                });
                //点击重置
                formElement.on('reset', function(){
                	scope.$apply(function(){
                        scope.submitted = false;
                    });
                });
			}
		};
	}
	//表单提交和重置
	function ValiFocus(){
		return {
			restrict: 'A',
			replace: false,
			transclude: false,
			require: 'form',
			link: function(scope, iElement, attrs, formCtrl){
				iElement.on('submit', function(){
					//forEach 无法break
					for(var i=0,j=formCtrl.$$controls.length; i<j; i++){
						if(formCtrl.$$controls[i].$invalid){
							formCtrl.$$controls[i].$$element.trigger("focus");
							//获得要移动的高度,判断浏览器滚动条会增加很多判断和代码量
							angular.element("body,html").scrollTop(formCtrl.$$controls[i].$$element.offset().top - formCtrl.$$element.offset().top - 10); 
                			break;
                		}
					}
                });
                iElement.on('reset', function(){
                	//angularjs表单接口
                	formCtrl.$setPristine();
                });
			}
		}
	}
})();
