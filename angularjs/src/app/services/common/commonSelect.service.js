/*
* 固定数据
* 不调取接口
* */
(function () {
    'use strict';

    angular
        .module('WeServices')
        .provider('CommonSelectService', function () {

            this.$get = function (RequestService) {
                return {
                    /**
                     * 通用车辆状态
                     */
                    carStatus: function () {
                        return [
                            {key:1,value:'行驶'},{key:2,value:'静止'},{key:3,value:'离线'}
                        ]
                    },
                    /**
                     * 通用‘是or否’
                     */
                    yesOrNo : function () {
                        return [/*1未注册；2已注册*/
                            {key:1,value:'否'},{key:2,value:'是'}
                        ]
                    },
                    /**
                     * 车队层级
                     */
                    teamLevels : function () {
                        return [
                            {key:1,value:'一级'},{key:2,value:'二级'},{key:3,value:'三级'},{key:4,value:'四级'}
                        ]
                    },
                    /**
                     * 车队管理-排序方式
                     */
                    teamSort : function () {
                        return [
                            {sortId:'1',sortName:"车辆数由多到少"},
                            {sortId:'2',sortName:"车辆数由少到多"},
                            {sortId:'3',sortName:"创建/加入时间由新到旧"},
                            {sortId:'4',sortName:"创建/加入时间由旧到新"}
                        ]
                    },
                    /**
                     * 司机管理-排序方式
                     */
                     driverSort : function () {
                        return [
                            {sortId:'1',sortName:"驾驶车辆数由多到少"},
                            {sortId:'2',sortName:"驾驶车辆数由少到多"},
                            {sortId:'3',sortName:"创建时间由新到旧"},
                            {sortId:'4',sortName:"创建时间由旧到新"}
                        ]
                    },
                    /**
                     * 车队管理员-排序方式
                     */
                    adminSort : function () {
                        return [
                            {sortId:'3',sortName:"最后登录时间由新到旧"},
                            {sortId:'4',sortName:"最后登录时间由旧到新"}
                         ]
                    },
                    /**
                     * 线路管理-排序方式
                     */
                     routeSort : function () {
                        return [
                            {sortId:1,sortName:"车辆数由多到少"},
                            {sortId:2,sortName:"车辆数由少到多"},
                            {sortId:3,sortName:"创建时间由新到旧"},
                            {sortId:4,sortName:"创建时间由旧到新"}
                        ]
                    },
                    /**
                     * 车辆管理-排序方式
                     */
                     carSort : function () {
                        return [
                            {sortId:1,sortName:"最后更新时间由新到旧"},
                            {sortId:2,sortName:"最后更新时间由旧到新"}
                        ]
                    },
                    /**
                     * 获取司机详情
                     * @param {Object} query 入参
                     * @param {Object} page 分页
                     */
                    queryCompanyList: function(query, page) {
                        return RequestService.get(
                            '/safeplatform/queryCompanyList',
                            angular.merge({}, page, query)
                        );
                    }
                };
            };
        });
})();

