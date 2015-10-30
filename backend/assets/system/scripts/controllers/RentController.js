angular.module('app')
	.controller('ListRentCtrl', ['$scope', '$state', '$stateParams', '$restful', '$auth', 'App', 'Upload','toaster', 
	  function ($scope, $state, $stateParams, $restful, $auth, App, Upload, toaster){

		$scope.item_page     = 20;
		$scope.total         = 0;
		$scope.currentPage   = 1;
		$scope.loadingData   = true;
		
		$scope.list_projects = [];

		$scope.loadCities = function (){
			App.getCities(function (err, resp){
				if(!err){
					$scope.list_city  = resp.data;
				}
			})
		}

		$scope.loadDistrict = function (id){
			angular.forEach($scope.list_city, function (value){
				if(value.id == id){
					App.getDistricts(value.city_code, function (err , resp){
						if(!err){
							$scope.list_district  = resp.data;
						}
					})
					return;
				}
			})
		}

	  	$scope.load = function (frm){
	  		$scope.loadingData = true;
	  		$scope.filter = {page: $scope.currentPage, item_page: $scope.item_page, project_type: '1'};
	  		angular.extend($scope.filter, frm);

	  		$restful.get('projects/show', $scope.filter,  function (error, resp){
	  			$scope.loadingData = false;
				if(error){
					toaster.pop('warning', 'Lỗi', error);
				}else {
					$scope.total         = resp.total;
					$scope.list_projects = resp.data;
				}
			})
	  	}
	  	$scope.loadCities();
	  	$scope.load();
		
	}])
