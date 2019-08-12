(function() {

	'use strict';

	angular.module('WeComponents')
		.directive('imgUpload', UploadDirective)
		.directive('fileUpload', FileUploadDirective);

	function UploadDirective(Message){
		return {
			//通过设置项来定义 
			restrict: 'AE',
			scope: {
				file: '=?',
				imgPath: '=?'
			},
			replace: true,
			require: '^^form',
			template:
			'<div class="single-img-upload">'+
			'   <input id="imgText" name="imgText" readOnly placeholder="建议图片大小250px*200px" ng-model="fileName" class="form-control" type="text" />'+
			'   <button id="imgBtn" name="imgBtn"  class="btn btn-primary" type="button">选择文件</button>'+
			'   <input id="imgFile" name="imgFile" type="file" />'+
			'	<div ng-show="thumb.imgSrc" style="margin-top: 15px">'+
			'		<img ng-src="{{thumb.imgSrc}}"  title="" />'+
			'		<button type="button"  class="btn superscript">'+
			'			<span class="glyphicon glyphicon-trash" style="margin-left:-2px"></span>'+
			'		</button>'+
			'	</div>'+
			'</div>',
			link: function(scope, element, attrs, formCtrl) {

//				var imgFile = $("#imgFile"), removeIcon = $(element).find(".superscript");
				var imgFile = $("form[name="+formCtrl.$name+"] #imgFile"), removeIcon = $(element).find(".superscript");
				
				scope.thumb = {
					imgSrc: ""
				}

				element.bind('click', function() {
					imgFile.val('');
				});

				element.bind('change', function() {
					
					scope.file = imgFile.get(0).files[0];

					scope.fileName = scope.file.name;
					var postfix = scope.fileName.substring(scope.fileName.lastIndexOf(".") + 1).toLowerCase();

					if("/jpg/jpeg/gif/png/bmp/tiff".indexOf(postfix) <= 0) {
						Message.error("图片格式不正确，请重新选择！");
						scope.fileName = "";
						scope.file = null;
						return false;
					}
					if(scope.file.size > 512000) {
						Message.error("图片大小不大于500kb！");
						scope.fileName = "";
						scope.file = null;
						return false;
					}
					
					scope.$apply();

					scope.reader = new FileReader(); //创建一个FileReader接口 
					if(scope.file) {
						//获取图片（预览图片） 
						scope.reader.readAsDataURL(scope.file); //FileReader的方法，把图片转成base64 
						scope.reader.onload = function(ev) {
							scope.$apply(function() {
								scope.thumb = {
									imgSrc: ev.target.result //接收base64，scope.thumb.imgSrc为图片。 
								};
							});
						};
					} else {
						Message.error('上传图片不能为空!');
					}
				});

				removeIcon.bind('click', function(e){
					scope.$apply(function(){
						scope.fileName = "";
						scope.file = null;
						scope.thumb = null;
						scope.imgPath = "";
					});
				});

				scope.$watch('imgPath', function (newVal, oldVal) {
					if(newVal){
						scope.thumb.imgSrc = newVal;
					}
				});

			}
		};
	}

	function FileUploadDirective(Message){
		return {
			//通过设置项来定义 
			restrict: 'AE',
			scope: {
				file: '=?',
				method: '=?'
			},
			replace: true,
			template:
			'<div class="single-img-upload">'+
			'   <input id="mulText" name="mulText" readOnly placeholder="请选择文件" ng-model="fileName" class="form-control" type="text" />'+
			'   <button id="mulBtn" name="mulBtn"  class="btn btn-primary" type="button" style="margin: -3px 0 0 5px">选择文件</button>'+
			'   <button name="mulImp" class="btn btn-primary" type="button" style="margin: -3px 0 0 5px" ng-click="method()">导 入</button>'+
			'   <input id="mulFile" name="mulFile" type="file" />'+
			'</div>',
			link: function(scope, element, attrs) {

				var mulFile = $("#mulFile"), postfix = null;

				element.bind('click', function() {
					mulFile.val('');
				});

				element.bind('change', function() {
					scope.file = mulFile.get(0).files[0];

					scope.fileName = scope.file.name;
					var postfix = scope.fileName.substring(scope.fileName.lastIndexOf(".") + 1).toLowerCase();

					if("/xlsx/xlsm/xlsb/xltx/xltm/xls/xlt/xml/xlam/xla/xlw/xlr/".indexOf(postfix) <= 0) {
						Message.error("文件格式不正确，请重新选择！");
						scope.fileName = "";
						scope.file = null;
						return false;
					}

					scope.$apply();

				});

				scope.$watch('file', function (newVal, oldVal) {
					if (newVal !== oldVal) {
						if(newVal === null) scope.fileName = "";
					}
				});

			}
		};
	}

})();
