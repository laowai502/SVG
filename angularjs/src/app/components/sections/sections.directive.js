(function() {
    'use strict';

    angular.module('WeComponents')

        .provider('$sections', function() {

            var defaults = this.defaults = {
                activeClass: 'active',
                routeAttr: 'data-match-route',
                strict: false
            };

            this.$get = function() {
                return {defaults: defaults};
            };

        })

        .directive('wdSections', function($log, $window, $location, $sections) {

            var defaults = $sections.defaults;

            return {
                restrict: 'A',
                controller: function ($element, $scope) {
                    $scope.matchs = [];
                    this.addMatch = function (macth, ctrl) {
                        $scope.matchs.push({
                            regexp: macth,
                            ctrl: ctrl
                        });
                    };
                },
                link : function (scope, element, attr) {

                    // Directive options
                    var options = angular.copy(defaults);
                    angular.forEach(Object.keys(defaults), function(key) {
                        if(angular.isDefined(attr[key])) options[key] = attr[key];
                    });

                    // Watch for the $location
                    scope.$watch(function() {

                        return $location.path();

                    }, function(newValue) {

                        scope.matchs.forEach(function (match) {
                            var pattern = match.regexp.replace('/', '\\/');

                            if(options.strict) {
                                pattern = '^' + pattern + '$';
                            }
                            var regexp = new RegExp(pattern, 'i');

                            if(regexp.test(newValue)) {
                                match.ctrl.macthed();
                            } else {
                                match.ctrl.nomacth();
                            }

                        });
                    });

                }

            };

        })
        .directive('wdSectionMatch', function() {

            return {
                terminal: false,
                require: '^^wdSections',
                scope : {
                },
                link: function (scope, element, attrs, wdSectionsCtrl) {

                    scope.isActive = scope.isActive || false;

                    var matchReg = attrs.wdSectionMatch,
                        active = function () {
                            scope.isActive = true;
                            element.addClass(attrs.activeClass || 'active');
                        },disable = function () {
                            scope.isActive = false;
                            element.removeClass(attrs.activeClass || 'active');
                        };
                    wdSectionsCtrl.addMatch(matchReg, {
                        macthed : active,
                        nomacth : disable
                    });
                    scope.$watchCollection('isActive', function (isActive) {
                        isActive ? active() : disable();
                    });

                }

            };

        });
})();
