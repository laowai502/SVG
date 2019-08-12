(function () {
    'use strict'

    angular.module('WeServices').service('SrankService',SrankService);

    function SrankService(RequestService) {
        return{
            gerList: function (query,page) {
                return RequestService.get(
                    '/safeplatform/querySafeRankingList',
                    {
                        date: query.time,
                        dateCondition: query.type,
                        carCph: query.carVin,
                        driver: query.driver,
                        page_number: page.page_number,
                        page_size: page.page_size
                    }
                );
            },
            getDate: function (query) {
                return RequestService.get(
                    '/safeplatform/querySafeRankingDetail',
                    {
                        carId: query.carId,
                        dateCondition: query.dateCondition,
                        date: query.time
                    }
                );
            },
        }
    }
})();
