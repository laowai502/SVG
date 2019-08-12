(function() {
  'use strict';

  angular
    .module('angularMapbarMap')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, mapbarMapConfig, pluginsServer, $rootScope, $window) {
    $window.mapbar = $window.mapbar || {};
    $window.mapbar.plugins = $window.mapbar.plugins || {};
    var mplugins = $window.mapbar.plugins;

    var server = pluginsServer,
        api = server.api,
        domain = mapbarMapConfig.domain,
        plugins = mapbarMapConfig.plugins;
    $rootScope.loaded = false;
    function broadcast() {
      $rootScope['mapbar-plugins-load'] = true;
      $rootScope['$broadcast']('mapbar-plugins-load')
    }
    var i = 0;
    function count() {
      i ++;
      i == plugins.length && broadcast();
    }
    $.getScript(domain + api, function (res, status) {
      if(status === 'success') {
        !plugins.length && broadcast();
        angular.forEach(plugins, function (v, k) {
          if(v) {
            v = server[v] || v;
            Maplet.plugin(domain + v, function (plugin) {
              plugin && (mplugins[plugin.pluginName] = plugin);
              count();
            });
          } else count();
        });
      }
    });
    $log.debug('runBlock end');
  }

})();
