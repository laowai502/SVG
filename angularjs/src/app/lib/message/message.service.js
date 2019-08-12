(function () {
    'use strict';

    angular
        .module('WeLibs')
        .provider('Message', function () {
            this.$get = function ($rootScope, $q, $timeout, $compile, $uibModal, $document, $templateRequest, toastr) {

                var okFun, cancelFun, confirmHtml, isRender = false;
                var disable = false;

                $rootScope.messageModel = {
                    in: false,
                    show: false,
                    title: '',
                    message: '',
                    ok: function () {
                        modelHide();
                        okFun && okFun();
                    },
                    cancel: function () {
                        modelHide();
                        cancelFun && cancelFun();
                    }
                };

                function modelHide() {
                    $rootScope.messageModel.in = false;
                    $timeout(function () {
                        $rootScope.messageModel.show = false;
                        $rootScope.messageModel.message = '';
                        $rootScope.messageModel.title = '';
                    }, 150);
                }

                return {
                    disable: function (val) {
                        disable = val;
                    },
                    clear: function () {
                        toastr.clear();
                    },
                    info: function () {
                        if (!disable) {
                            toastr.info.apply(this, arguments);
                        }
                    },
                    error: function () {
                        if (!disable) {
                            toastr.error.apply(this, arguments);
                        }

                    },
                    warning: function () {
                        if (!disable) {
                            toastr.warning.apply(this, arguments);
                        }

                    },
                    success: function () {
                        if (!disable) {
                            toastr.success.apply(this, arguments);
                        }
                    },
                    confirm: function (message, title) {
                        if (!disable) {
                            var cancelHandler;
                            var modalInstance = $uibModal.open({
                                templateUrl: 'app/lib/message/message.html',
                                backdrop: false,
                                controller: function ($scope, $uibModalInstance) {
                                    $scope.title = title;
                                    $scope.message = message;
                                    $scope.ok = function () {
                                        $uibModalInstance.close();

                                        if (cancelHandler) {
                                            cancelHandler();
                                        }
                                    };

                                    $scope.cancel = function () {
                                        $uibModalInstance.dismiss();

                                        if (cancelHandler) {
                                            cancelHandler();
                                        }
                                    }

                                    cancelHandler = $scope.$on('message:kill', function () {
                                        $uibModalInstance.dismiss();
                                    });
                                }
                            });

                            return modalInstance.result;
                        }
                    }
                };
            };
        });
})();
