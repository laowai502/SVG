(function() {
    'use strict';

    angular.module('WeComponents')

    .directive('weDateRange', function($timeout) {
        return {
            require: '?ngModel',
            scope: {
                pickerOptions: '@',
                start: '=?start',
                end: '=?end',
                ngModel: '=?',
                cancelInit: '@',
                cancelRefuse: '@',
                change: '=?change',
            },
            link: function(scope, elements, attrs, ngModel) {
                var DOM = angular.element(elements),
                    pickerVal = null;
                var opt = angular.fromJson(attrs.pickerOptions || '{}');
                attrs.cancelInit = attrs.cancelInit || false;
                attrs.cancelRefuse = attrs.cancelRefuse || false;
                var options = _.defaults(opt, {
                    timePicker24Hour: true,
                    locale: _.defaults(opt.locale || null, {
                        format: 'YYYY-MM-DD',
                        applyLabel: '确定',
                        cancelLabel: '取消',
                        fromLabel: '起始时间',
                        toLabel: '结束时间',
                        customRangeLabel: '自定义',
                        daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                            '七月', '八月', '九月', '十月', '十一月', '十二月'
                        ],
                        firstDay: 1
                    }),
                });

                scope.$watchGroup(['start', 'end'], function(newVal, oldVal) {
                    if (oldVal[0] !== newVal[0] && oldVal[1] !== newVal[1]) {
                        if (!newVal[0] && !newVal[1]) {
                            DOM.val('');
                        } else {
                            var start = moment(newVal[0]).format(options.locale.format);
                            var end = moment(newVal[1]).format(options.locale.format);
                            pickerVal = start + ' - ' + end;
                            if (ngModel !== null) ngModel.$setViewValue(pickerVal);
                            DOM.val(pickerVal);
                        }
                    }
                });

                // 初始化时显示
                if (scope.start && scope.end) {
                    options.startDate = scope.start,
                        options.endDate = scope.end
                }

                if (opt.autoUpdateInput !== true) {
                    DOM.on('apply.daterangepicker', function(ev, picker) {
                        scope.$applyAsync(function() {
                            scope.change = new Date().getTime();
                            scope.start = picker.startDate.format(options.locale.format);
                            scope.end = picker.endDate.format(options.locale.format);
                            pickerVal = picker.startDate.format(options.locale.format) + ' - ' + picker.endDate.format(options.locale.format);
                            if (ngModel !== null)
                                ngModel.$setViewValue(pickerVal);
                            DOM.val(pickerVal);
                        })
                    });
                    DOM.on('show.daterangepicker', function(ev, picker) {
                        scope.$applyAsync(function() {
                            if (scope.start && scope.end) {
                                picker.setStartDate(picker.startDate.format(scope.start));
                                picker.setEndDate(picker.endDate.format(scope.end));
                                picker.updateView();
                            }
                        })
                    });
                    DOM.on('cancel.daterangepicker', function(ev, picker) {
                        scope.$apply(function() {
                            if (attrs.cancelRefuse) {
                                return
                            }
                            if (attrs.cancelInit) {
                                scope.start = scope.start;
                                scope.end = scope.end;
                            } else {
                                scope.start = '';
                                scope.end = '';
                            }
                            if (ngModel !== null)
                                ngModel.$setViewValue(scope.start + ' - ' + scope.end);
                            DOM.val(scope.start + ' - ' + scope.end);
                        })
                    });

                    if (scope.start && scope.end) {
                        DOM.val(scope.start + ' - ' + scope.end);
                    }
                }
				
                DOM.daterangepicker(options, function(start, end, label) {
                    scope.change = new Date().getTime();
                    scope.start = start.format(options.locale.format);
                    scope.end = end.format(options.locale.format);
                    pickerVal = start.format(options.locale.format) + ' - ' + end.format(options.locale.format);
                    if (ngModel !== null) ngModel.$setViewValue(pickerVal);
                    DOM.val(pickerVal);
                });

                DOM.off('keyup'); //防止乱码

                return scope.$on('$destroy', function() {
                    return angular.element(".daterangepicker").remove();
                });
            }
        }
    });

})();