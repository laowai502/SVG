(function () {
    'use strict';

    angular
        .module('WeServices')
        .provider('CommonService', function () {
            var serviceUrl = '',
            	queryRoleDeferred = null;
            	
            function makeUrl(path) {
                return serviceUrl + path;
            }
            this.setServiceUrl = function (url) {
                if (url) {
                    serviceUrl = url;
                }
            };
            this.$get = function (Urls, RequestService, SsoService) {
                return {
                    queryBaseData: function (type) {
                        return RequestService.get(
                            makeUrl('/system/baseData'),
                            {
                                type: type
                            }
                        )
                    },
                    imgUpload: function (file) { //上传图片
                        return RequestService.post(
                            Urls.uploadUrl,
                            {
                                file: file
                            },
                            function (data, resolve, reject) {
                                resolve(data);
                            },
                            true
                        )
                    },
                    fileUpload: function (file) { //上传文件
                        return RequestService.post(
                            Urls.uploadUrl,
                            {
                                file: file
                            },
                            function (data, resolve, reject) {
                                resolve(data);
                            },
                            true
                        )
                    }
                };
            };
        });
})();

