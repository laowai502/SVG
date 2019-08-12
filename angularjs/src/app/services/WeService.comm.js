(function () {
    'use strict';

    angular.module('WeServices')
        .config(function ($httpProvider) {
            $httpProvider.defaults.useXDomain = true;   // 发送CORS请求
            $httpProvider.defaults.withCredentials = false;  // 请求携带Cookies
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        })

        .provider('RequestService', function () {
            var serviceUrl = '';
            var serializeObjectToString = true;

            function resultProcessor(result, success, failed) {
                if (!result) {
                    failed({
                        status: 500,
                        message: '服务端异常'
                    });
                }

                if (result.resultCode && result.resultCode === 200|| result.code && result.code === 200|| result.status && result.status === 200) {
                    success(result.data, result.message);
                } else {
                    failed(result);
                }
            }


            function typeToString(obj) {
                if (obj instanceof Object || obj instanceof Array) {
                    angular.forEach(obj, function (value, k) {
                        obj[k] = (obj[k] !== null && typeof obj[k] === 'object') ? typeToString(obj[k]) : String(obj[k]);
                    });
                }
                return obj;
            }

            return {
                setBaseServiceUrl: function (url) {
                    if (url) {
                        serviceUrl = url;
                    }
                },
                serializeObjectToString: function (assertion) {
                    if (assertion === false) {
                        serializeObjectToString = false;
                    }
                },
                $get: function ($http, $q, $log, $window) {
                    function request(opts, processor, isUpload, isWhiteList) {
                        var d = $q.defer(),
                            url = /^(http|https):\/\//.test(opts.url) ? opts.url : (serviceUrl + opts.url),
                            options = {
                                method: opts.method || 'GET',
                                url: url,
                                ignoreLoadingBar: false,	//长轮询屏蔽loading-bar
                                cache: false,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8'
                                }
                                //timeout: 10000	//请求超时
                            },
                            queryString, formData;

                        //if(isUpload) options.ignoreLoadingBar = true;
						if (!isWhiteList) { //区分哪些接口需要穿token
							options.headers.token = $window.sessionStorage.getItem("token");
						}
						
                        if (opts.withCredentials != undefined) {
                            options.withCredentials = opts.withCredentials;
                        }

                        if (opts.data && angular.isObject(opts.data)) {
                            for (var _d in opts.data) {
                                if ((options.method === 'GET' && opts.data[_d] === '') || angular.isUndefined(opts.data[_d]) || opts.data[_d] === null) {
                                    delete opts.data[_d];
                                } else if (opts.data[_d] == 'null') {
                                    delete opts.data[_d];
                                }
                            }
                        }

                        opts.data = opts.data || {};
                        //opts.data['versionNo'] = '1.1.00';

                        if (options.method === 'POST') {
                            if (angular.isString(opts.data)) {
                                options.data = opts.data;
                            } else {
                                if (opts.data instanceof FormData) {
                                    options.data = opts.data;
                                    options.headers = {
                                        'Content-Type': undefined
                                    };
                                } else if (isUpload) {
                                    formData = new FormData();
                                    if (opts.data) {
                                        angular.forEach(opts.data, function (value, key) {
                                            formData.append(key, value);
                                        });
                                    }
                                    options.data = formData;
                                    options.headers = {
                                        'Content-Type': undefined
                                    };
                                } else {
                                    if (opts.data instanceof Object) {
                                        options.data = opts.data;
                                    } else {
                                        options.data = JSON.stringify(typeToString(opts.data));
                                    }
                                }
                            }
                        }
                        else if (options.method === 'GET') {
                            if (!opts.data) opts.data = {};
                            opts.data['__rid'] = Math.random();

                            queryString = angular.element.param(opts.data);
                            options.url = url + (url.indexOf('?') > -1 ? '&' : '?') + queryString;
                        }

                        processor = processor || resultProcessor;

                        try {
                            $http(options).then(function (res) {
                                processor(res.data, d.resolve, d.reject);
                            }, function (err) {
                                d.reject(err);
                            });
                        } catch (e) {
                            $log.info(e);
                        }
                        return d.promise;
                    }

                    return {
                        get: function (url, data, processor) {
                            if (arguments.length === 2 && angular.isFunction(data)) {
                                processor = data;
                                data = null;
                            }
                            return request({
                                url: url,
                                data: angular.copy(data)
                            }, processor);
                        },
                        post: function (url, data, processor, isUpload) {
                            if (angular.isFunction(data) && arguments.length === 2) {
                                isUpload = processor;
                                processor = data;
                                data = null;
                            }
                            return request({
                                method: 'POST',
                                url: url,
                                data: isUpload ? data : angular.copy(data)
                            }, processor, isUpload);
                        },
                        fetchWhiteList: function(url, data, method) {
                        	return request({
                        		method: 'POST',
                                url: url,
                                data: data
                        	}, null, false, true)
                        },
                        makeUrl: function (url) {
                            return /^(http|https):\/\//.test(url) ? url : (serviceUrl + url);
                        },
                        request: request
                    };
                }
            };
        })
})();
