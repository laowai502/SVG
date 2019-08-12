(function () {
    'use strict';

    angular
        .module('WeServices')
        .provider('messageService', function () {
            var serviceUrl = '';

            function makeUrl(path) {
                return serviceUrl + path;
            }

            this.setServiceUrl = function (url) {
                if (url) {
                    serviceUrl = url;
                }
            };

            this.$get = function ($q, $filter, RequestService) {
                return {
                    /**
                     * 获取消息推送列表
                     */
                    pushedMsgs: function (page_number,page_size) {
                        return RequestService.get(
                            makeUrl('pushedMsgs'),
                            {
                                page_number: page_number,
                                page_size: page_size
                            }
                        );
                    },
                    /**
                     * 新建-获取司机下拉列表
                     */
                    driversForPush: function (teamId) {
                        return RequestService.get(
                            makeUrl('driversForPush'),
                            {
                                teamId: teamId
                            }
                        );
                    },
                    /**
                     * 推送消息
                     */
                    msgToDriver: function (query) {
                        return RequestService.get(
                            makeUrl('msgToDriver'),
                            query
                        );
                    }
                };
            };

        });

})();