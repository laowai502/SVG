(function(){
    'use strict';

    angular
        .module('WeViews')
        .controller('MainRoleController', MainRoleController);

    function MainRoleController(RoleService,Message,$uibModal,GetTemplateUrl,GetControllerName){
        var vm = this
        vm.list = null                              //表格

        vm.page = {                                 //分页
            page_number : 1,
            page_size : 10,
            total: null
        };
        vm.nowTime=new Date()
        vm.roleDateStart = ''                       //创建开始时间
        vm.roleDateEnd = ''                         //创建结束时间

        /* 高级筛选 */
        vm.moreobject = false
        vm.formoreobj = function () {
            vm.moreobject = !vm.moreobject
        }

        /* 查询列表 */
        vm.getList = function(){
            if (vm.roleDateEnd != '' &&  vm.roleDateStart != '' && vm.roleDateEnd< vm.roleDateStart){
                Message.error('结束时间应该大于开始时间！')
                return
            }
            RoleService.getList(vm.inputText, vm.roleDateStart,vm.roleDateEnd, vm.creator, vm.page.page_number, vm.page.page_size, vm.page.total).then(function (data) {
                if(data){
                    vm.list = data.list
                    vm.page.total = data.total
                }
            }).catch(function(err) {
                Message.error(err.message)
            });
        }
        vm.getList()

        //type = 0页面为新增，type = 1页面为编辑
        vm.add = function (obj,type) {
            var message = '',params = {}
            if(type){
                message = '编辑角色成功'
                params = {
                    edit:function() {
                        return obj
                    }
                }
            }else{
                message = '添加角色成功'
                params = {
                    edit:function() {
                        return ''
                    }
                }
            }
            $uibModal.open({
                templateUrl: GetTemplateUrl('main.role.roleadd'),
                controller: GetControllerName('main.role.roleadd'),
                controllerAs: 'vm',
                windowClass: 'overhidx',
                backdrop:true,
                resolve:params
            }).result.then(function () {
                vm.getList()
                Message.success(message)
            }).catch(function(res) {
                if (!(res === 'cancel' || res === 'backdrop click')) {
                    throw res
                }
            })
        }

        /* 删除 */
        vm.delete = function (id,name) {
            Message.confirm('确定要删除角色 ' + name + ' ？', '删除')
                .then(function () {
                    RoleService.deleteRole(id)
                        .then(function () {
                            Message.success('删除成功')
                            vm.getList()
                        })
                        .catch(function (err) {
                            Message.error(err.message)
                        });
                });
        };

        //获取下拉框列表
        vm.change = function () {
            RoleService.getCreator().then(function (data) {
                vm.CREATOR = data.list
            })
            .catch(function (err) {
                Message.error(err.message)
            })
        }

        vm.flip = function (pageIndex) {
            vm.page.page_number = pageIndex
            vm.getList()
        }
    }
})();
