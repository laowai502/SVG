/* global malarkey:false, moment:false */
(function() {
  'use strict';
    //plugins: [MHeatMap, win312, url1, url2]
    angular
        .module('angularMapbarMap')
        .constant('mapbarMapConfig', {
            plugins: [],
            overview: false,
            standardControl: true,
            scale: true,
            clickToCenter: false,
            //domain: 'http://api.mapbar.com/'
            domain: 'http://10.10.24.200:8800/'
        }).constant('pluginsServer', {
            api: 'api/mapbard31.4.js',
            heatmap: 'api/plugin/MHeatMap.js',
            win313: 'api/plugin/MInfoWindow31.3.js',
            cluster: 'api/plugin/MMarkerCluster.js',
            clusterV2: 'api/plugin/MMarkerClusterV2.js'
    });
})();
