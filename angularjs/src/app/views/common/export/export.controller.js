(function(){
	'use strict';

	angular.module('WeViews').controller('CommonExportController', function ($scope,$uibModalInstance) {
		$scope.toCancel = function() {
			$uibModalInstance.dismiss();
		};
			$scope.submit=function () {
			$scope.requesting=true;
			$uibModalInstance.close($scope.email);
		}
	}

	);
})();