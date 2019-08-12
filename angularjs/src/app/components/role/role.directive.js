(function () {
    'use strict';

    angular.module('WeComponents')
        .directive('weRole', function ($log, $rootScope) {
            return {
                restrict: 'A',
                priority: 1,
                link: function (scope, element, attr) {
                    if ($rootScope.permission != null) {
                        if (!$rootScope.permission) {
                            element.remove();
                            return;
                        }
                        if (!attr.weRole || attr.weRole == '' || attr.weRole == 'undefined') {
                            return;
                        }
                        var hasRole = false;
                        var allRoles = $rootScope.permission.funcs;
                        var roleCodes = attr.weRole;

                        if (allRoles) {
                            if(roleCodes.indexOf(',')!= -1){
                                roleCodes = attr.weRole.split(',');
                                for (var i = 0; i < roleCodes.length; i++) {
                                    if (allRoles.hasOwnProperty(roleCodes[i])) {
                                        hasRole = true;
                                        break;
                                    }
                                }
                            }else{
                                if (allRoles.hasOwnProperty(roleCodes)) {
                                    hasRole = true;
                                }
                            }
                        }

                        if (!hasRole) {
                            var children = element.children();
                            children.remove();
                            element.remove();
                        };
                    }
                }
            }
        });
})();
