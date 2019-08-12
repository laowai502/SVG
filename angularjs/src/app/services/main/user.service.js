(function () {
   angular.module('WeServices').service('UserService',UserService)
    function UserService(RequestService) {
        var serviceUrl = "";

        function makeUrl(path) {
            return serviceUrl + path;
        }

        this.setServiceUrl = function (url) {
            if (url) {
                serviceUrl = url;
            }
        };

        return {
            /* 查询用户列表 */
            getUserList: function (distId, pageIndex, pageSize, keyword, sortType) {
                return RequestService.get(
                    makeUrl('/auth/user/list'),
                    {
                        distId: distId,
                        page_number: pageIndex,
                        page_size: pageSize,
                        keyword: keyword,
                        sortType: sortType
                    }
                );
            },
            /* 角色列表 */
            getRole: function () {
                return RequestService.get(
                    makeUrl('/auth/role/list')
                )
            },
            /* 编辑角色（departId,isLeader是死数据） */
            editUser: function (id, name, telephone,userName, password, description, roleIds,userId,suserName,suserId) {
                return RequestService.post(
                    makeUrl('/auth/user/update'),
                    {
                        id:id,
                        name:name,
                        telephone:telephone,
                        userName:userName,
                        originalPwd:password,
                        departId:'1f4f52a2261042f5947c7782409adb6b',
                        isLeader:'1',
                        description:description,
                        roleId:roleIds,
                        creatorId:userId,
                        suserName:suserName,
                        suserId:suserId,
                    }
                )
            },
            /* 删除用户 */
            deleteUser: function (distId, id) {
                return RequestService.get(
                    makeUrl('/auth/user/delete'),
                    {
                        distId: distId,
                        id: id
                    }
                )
            },
        }
    }
})();
