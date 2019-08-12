(function () {
    'use strict'

    angular.module('WeComponents').directive('weSlide',weSlide)
    function weSlide($timeout) {
        return{
            restrict: 'AE',
            replace: true,
            scope: {
                datasetData: '=',
            },
            template : "<tr ng-repeat = 'data in datasetData'>" +
                        "<td>{{data.location}}</td>" +
                        "<td>{{data.ADAS}}</td>" +
                        "<td>{{data.DMS}}</td>" +
                        "<td>{{data.behavior}}</td>" +
                        "</tr>",
            link: function (scope,elem) {
                $timeout(function(){
                    var className = $("." + $(elem).parent()[0].className);
                    var i = 0,timer;
                    var trLength = className.children("tr").length;
                    var trHeight = className.children("tr").height() + parseInt(className.children("tr").css('border-bottom-width'));
                    className.html(className.html() + className.html());

                    // 开启定时器
                    timer = setInterval(slide,1000);

                    function slide(){
                        if (parseInt(className.css("margin-top")) > (-trLength * trHeight)) {
                            i++;
                            className.animate({
                                marginTop : -trHeight * i + "px"
                            },"slow");
                        } else {
                            i = 0;
                            className.css("margin-top","0px");
                        }
                    }

                    // 清除定时器
                    className.hover(function(){
                        clearInterval(timer);
                    },function(){
                        clearInterval(timer);
                        timer = setInterval(slide,1000);
                    })

                },0)
            }
        }
    }
})();
