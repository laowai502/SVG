(function () {
   'user strict'

   angular.module('WeViews').controller('MainUserUsereditController',MainUserUsereditController)
    function MainUserUsereditController(UserService,$uibModalInstance,params,Message) {
        var vm = this
        vm.itemsArry = params.roleIds

        /* 角色列表 */
        vm.getRoleList = function () {
            UserService.getRole().then(function (data) {
                vm.role=data.list
            }).catch(function (err) {
                Message.error(err.message)
            });
        };
        vm.getRoleList();

        /* 关闭修改 */
        vm.cancel = function () {
            $uibModalInstance.dismiss("cancel")
        }

        /* 提交 */
        vm.submit = function (event) {
            event.preventDefault();
            UserService.editUser(params.id,params.name,params.telephone,params.userName,params.password
                    ,params.description,vm.itemsArry,vm.userId,params.suserName,params.suserId
                ).then(function () {
                    $uibModalInstance.close();
                }).catch(function (err) {
                    Message.error(err.message)
                })
                .then(function () {
                    vm.requesting = false;
                });
            }

    }
})();
