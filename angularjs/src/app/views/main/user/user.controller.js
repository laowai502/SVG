(function () {
   'use strict'
    angular.module('WeViews').controller('MainUserController',MainUserController)
    function MainUserController(UserService,Message,$uibModal,GetTemplateUrl,GetControllerName) {
        var vm = this

        vm.list = null
        vm.page = {
            page_number : 1,
            page_size : 10,
            total: null
        };

        vm.inputText = ""
        vm.sortType="desc"

        /* 表格数据 */
        vm.getList = function(){
            UserService.getUserList("1",vm.page.page_number,vm.page.page_size,vm.inputText,vm.sortType)
                .then(function (data) {
                    vm.list = data.list
                    vm.page.total = data.total
                })
                .catch(function (err) {
                    Message.error(err.message)
                })
        }
        vm.getList()

        /* 编辑 */
        vm.edit = function(obj){
            $uibModal.open({
                templateUrl: GetTemplateUrl('main.user.useredit'),
                controller: GetControllerName('main.user.useredit'),
                controllerAs: 'vm',
                windowClass: 'overhidx',
                resolve:{
                    params:function(){return obj}
                },
                backdrop:true
            }).result.then(function () {
                vm.getList();
                Message.success('编辑用户成功');
            }).catch(function(res) {
                if (!(res === 'cancel' || res === 'backdrop click')) {
                    throw res;
                }
            })
        }

        /* 删除 */
        /*vm.delete = function(id,name){
            Message.confirm('确定要删除用户 ' + name + ' ？', '删除').then(function () {
                UserService.deleteUser("1",id)
                    .then(function () {
                        Message.success('删除成功');
                        vm.getList();
                    })
                    .catch(function (err) {
                        Message.error(err.message)
                    });
            });
        }*/

        vm.flip = function (pageIndex) {
            vm.page.page_number = pageIndex
            vm.getList()
        }
    }
})();
