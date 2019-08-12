/**
 * Created by yangjie on 2017/10/16.
 */
(function () {
    'use strict';

    angular
        .module('WeServices')
        .provider('systemService', function () {
            var serviceUrl = '';

            function makeUrl(path) {
                return serviceUrl + path;
            }

            this.setServiceUrl = function (url) {
                if (url) {
                    serviceUrl = url;
                }
            };

            this.$get = function ($q, $filter,$rootScope, RequestService,Urls) {
                return {
                    /**
                     * 系统管理-账号设置-上传头像
                     */
                    uploadPic: function (file) {
                        return RequestService.post(
                            Urls.usercenter+'uploadPic',
                            {
                                file: file
                            },
                            function (data, resolve, reject) {
                                resolve(data);
                            },
                            true
                        )
                    },

                    /**
                     * 系统管理-账号设置-查询头像
                     */
                    queryPic: function (file, token) {
                        return RequestService.get(
                            Urls.usercenter+'queryPic',
                            {
                                file: file,
                                token: token,
                            },
                            function (data, resolve, reject) {
                                resolve(data);
                            },
                            true
                        )
                    },

                    /**
                     * 系统管理-账号设置-更改密码
                     */
                    updatePassword: function (oldPassword,newPassword) {
                        return RequestService.get(
                            makeUrl(Urls.usercenter+'updatePassword'),
                            {
                           
                                product:$rootScope.product,
                                oldPassword:oldPassword,
                                newPassword:newPassword,
                                deviceType:$rootScope.appType,
                            }
                         )
                    },
                    /**
                     * 系统管理-账号设置-更改手机号发送短信验证码
                     */
                    applyBindMobile: function (type,mobile) {
                        return RequestService.post(
                            makeUrl(Urls.usercenter+'applyBindMobile'),
                            {

                                product:$rootScope.product,
                                type:type,
                                mobile:mobile,
                                deviceType:$rootScope.appType,
                            }
                        )
                    },

                    /**
                     * 系统管理-账号设置-更改手机
                     */
                    bindMobile: function (mobile,oldSmsCode,oldMobile,smsCode) {
                        return RequestService.post(
                            makeUrl('bindMobile'),
                            {
                                product:$rootScope.product,
                                type:"changeBind",
                                deviceType:$rootScope.appType,
                                mobile:mobile,
                                oldSmsCode:oldSmsCode,
                                oldMobile:oldMobile,
                                smsCode:smsCode
 
                            }
                        )
                    },
                    /**
                     * 系统管理-管理员管理-列表
                     */
                    queryManagerList: function (page_number,page_size,filter) {
                        return RequestService.get(
                            makeUrl('queryManagerList'),
                            angular.merge({
                                page_number:page_number,
                                page_size:page_size
                            },filter)
                        )
                    },

                    /**
                     * 系统管理-管理员管理-删除
                     */
                    delManager: function (phoneList,teamIdList) {
                        return RequestService.get(
                            makeUrl('delManager'),
                            {
                                phoneList:phoneList,
                                teamIdList:teamIdList
                            }
                        )
                    },

                    /**
                     * 系统管理-管理员管理-编辑
                     */
                    editManager: function (query) {
                        return RequestService.get(
                            makeUrl('editManager'),
                            query
                        )
                    },

                    /**
                     * 系统管理-管理员管理-新建
                     */
                    addManager: function (query) {
                        return RequestService.get(
                            makeUrl('addManager'),
                            query
                        )
                    },

                };
            };

        });

})();