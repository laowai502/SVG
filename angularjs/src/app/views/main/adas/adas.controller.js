(function() {
	'use strict';

	angular.module('WeViews').controller('MainAdasController', function MainAdasController($timeout,CommonSelectService,SwitchService,Message,$scope) {
        var vm = this;

        vm.isInit = false;

        vm.org = {};

        vm.curSetting = {
            orgId:""
        };

        vm.companyCount = 0;
        /*
        * @Description: 查询机构下拉框
        * @author: zhaoming@aerozhonghuan.com
        * @Date: 2019/2/28 14:42
        */
        vm.queryCompanyList = function() {
            CommonSelectService.queryCompanyList(vm.query, vm.page).then(function(data) {
                if (data && data.length > 0) {
                    vm.companyCount = data.length;
                    vm.org = data;
                    //默认查询第一个机构
                    var orgObj = data[0];
                    vm.curSetting.orgId = orgObj.id;
                    vm.onOrgChange();
                }
            }).catch(function(err) {
                Message.error(err.message);
            });
        };


        vm.isShowPanel = true;
        /*
        * @Description: 机构选择事件，动态渲染开关
        * @author: zhaoming@aerozhonghuan.com
        * @Date: 2019/2/28 15:52
        */
        vm.onOrgChange = function(){
            if(vm.curSetting.orgId){
                vm.isInit = false;
                var switchParam = {alarmFlag:"1",companyId:vm.curSetting.orgId};
                SwitchService.queryAlarmSetList(switchParam).then(function(data) {
                    if (data) {
                        if(data.length == 0){
                            vm.isShowPanel = false;
                            Message.error("该组织没有对应的设置关系，请联系管理员");
                        }else{
                            vm.isShowPanel = true;
                            vm.setting = data;
                            vm.init();
                            //默认查询第一个面板信息
                            var firstOpt = data[0];
                            vm.onSwitchPanelClick(0,firstOpt.alarmType,firstOpt.alarmFlag);
                        }
                    }
                }).catch(function(err) {
                    Message.error(err.message);
                });
            }
        };

        vm.setting = [];

        /*
        * @Description: 保存
        * @author: zhaoming@aerozhonghuan.com
        * @Date: 2019/2/28 21:07
        */
        vm.onChange = function(i) {
            if (vm.isInit) { //这块属于angularjs脏检测的bug，无法控制初始化，所以用来判断，实属无奈之举，防止一上来就默认调用
                var switchObj = vm.setting[i];
                var curState = switchObj.setFlag;
                if(curState == "1"){
                    curState = "1";
                }else{
                    curState = "0";
                }
                var switchParam = {alarmFlag:switchObj.alarmFlag,alarmType:switchObj.alarmType,companyId:vm.curSetting.orgId,setFlag:curState};
                SwitchService.setAlarm(switchParam).then(function(data) {
                    if(curState == "1"){
                        Message.info("开启成功");
                    }else{
                        Message.info("关闭成功");
                    }

                }).catch(function(err) {
                    Message.error(err.message);
                });

            }
        };

        /*
        * @Description: 初始化方法，解析接口返回的按钮值
        * @author: zhaoming@aerozhonghuan.com
        * @Date: 2019/2/26 19:14
        */
        vm.init = function(){
            $timeout(function() {
                vm.isInit = true;
            }, 500);
        };

//      vm.init();

        //初始化机构下拉
        vm.queryCompanyList();

        vm.panelInfo = {};
        /*
        * @Description: 点击开关查询右侧面板信息
        * @author: zhaoming@aerozhonghuan.com
        * @Date: 2019/2/28 18:03
        */
        vm.onSwitchPanelClick = function(index,alarmType,alarmFlag){
            $scope.active = index;
            var switchParam = {alarmFlag:alarmFlag,alarmType:alarmType,companyId:vm.curSetting.orgId};
            SwitchService.queryAlarmSetInfo(switchParam).then(function(data) {
                if (data) {
                    vm.panelInfo = data;
                }
            }).catch(function(err) {
                Message.error(err.message);
            });
        };

	});
})();
