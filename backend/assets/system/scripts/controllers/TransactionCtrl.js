angular.module('app')
	.controller('CreateTransactionCtrl', ['$scope', '$state', '$stateParams', '$restful', '$auth', 'App', 'Upload','toaster', '$http',
	  function ($scope, $state, $stateParams, $restful, $auth, App, Upload, toaster, $http	){

	}])

.controller('ListTransactionCtrl', ['$scope', '$state', '$stateParams', '$restful', '$auth', 'App', 'Upload','toaster', 
	  function ($scope, $state, $stateParams, $restful, $auth, App, Upload, toaster){

		$scope.item_page        = 20;
		$scope.total            = 0;
		$scope.currentPage      = 1;
		$scope.loadingData      = true;
		
		$scope.list_transaction = [];
		$scope.frm              = {};

	  	$scope.load = function (status, frm){
	  		$scope.loadingData = true;
	  		$scope.filter = {page: $scope.currentPage, item_page: $scope.item_page};

	  		angular.extend($scope.filter, frm);
	  		$restful.get('transactions/show',$scope.filter ,  function (error, resp){
	  			$scope.loadingData = false;
				if(error){
					toaster.pop('warning', 'Lỗi', error);
				}else {
					$scope.total         = resp.total;
					$scope.list_transaction = resp.data;
				}
			})
	  	}

	  	$scope.load();
		
	}])