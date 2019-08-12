(function () {
    'use strict'

    angular.module('WeServices').service('RoleService',RoleService)

    function RoleService(RequestService) {
        var serviceUrl = "";

        function makeUrl(path) {
            return serviceUrl + path;
        }

        this.setServiceUrl = function (url) {
            if (url) {
                serviceUrl = url;
            }
        };

        return{
            /* 权限列表 */
            qyeryFuncList: function () {
                return RequestService.get(
                    makeUrl('/auth/func/list'),
                    {
                        type: 1
                    }
                );
            },
            /* 角色列表 */
            getList: function (keyword, rolelyDateStart,rolelyDateEnd, creator, pageIndex, pageSize) {
                return RequestService.get(
                    makeUrl('/auth/role/list'),
                    {
                        keyword: keyword,
                        createTimeStart: rolelyDateStart,
                        createTimeEnd: rolelyDateEnd,
                        creatorId: creator,
                        page_number: pageIndex,
                        page_size: pageSize
                    }
                );
            },
            /* 添加角色 */
            addRole: function (name, description, funcIds,userId) {
                return RequestService.get(
                    makeUrl('/auth/role/add'),
                    {
                        name: name,
                        description: description,
                        funcIds: funcIds,
                        creatorId:userId
                    }
                )
            },
            /* 编辑角色 */
            editRole: function (name, description, funcIds, id,userId) {
                return RequestService.get(
                    makeUrl('/auth/role/update'),
                    {
                        id: id,
                        name: name,
                        description: description,
                        funcIds: funcIds,
                        creatorId:userId
                    }
                )
            },
            /* 删除角色 */
            deleteRole: function (id) {
                return RequestService.get(
                    makeUrl('/auth/role/delete'),
                    {
                        id: id
                    }
                )
            },
            /* 创建者 */
            getCreator: function () {
                return RequestService.get(
                    makeUrl('/auth/common/queryCreator4List'),
                    {
                        type: "B"
                    }
                )
            },
        }
    }
})();
