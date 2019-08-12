(function() {
    'use strice'
    
    angular.module('WeServices').provider('permissionServices', permissionServices);
    	
    function permissionServices() {
        var serviceUrl = '';

        function makeUrl(path) {
            return serviceUrl + path;
        }

        this.setServiceUrl = function (url) {
            if (url) {
                serviceUrl = url;
            }
        };

        this.$get = function ($q,RequestService) {
            return {
                logged: function() { //判断登入状态以及获取菜单权限
                    return RequestService.get(
                        makeUrl('/auth/validateLogin')
                    );
                },
                queryUserComIdsInfo: function(userId) { //获取用户所属搅拌站id（或者说组织机构id）
                	return RequestService.get(
                		makeUrl('/safeplatform/queryUserComIdsInfo'),
                		{
                			userId: userId
                		}
                	);
                }
            }
        }
    }
})();
