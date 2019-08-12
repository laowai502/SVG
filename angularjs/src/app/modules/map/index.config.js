(function() {
  'use strict';

  angular
    .module('angularMapbarMap')
    .config(config);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

  }

})();
