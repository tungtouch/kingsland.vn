angular.module('app')
	.controller('CreateProjectCtrl', ['$scope', '$state', '$stateParams', '$restful', '$auth', 'App', 'Upload','toaster', 
	  function ($scope, $state, $stateParams, $restful, $auth, App, Upload, toaster){

		$scope.list_city        = [];
		$scope.list_district    = [];
		$scope.add_list         = [];
		$scope.ApartmentAddItem = {};

		$scope.frm 			 = {
			discount_type 	: "1",
			tip_type: "1"
		};
		$scope.submit_btn    = false;


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

		$scope.$watch('files', function () {
        	$scope.upload($scope.files);

    	});

		$scope.upload = function (files) {
		    if (files && files.length) {
		        for (var i = 0; i < files.length; i++) {
		            var file = files[i];
		            Upload.upload({
		                url: ApiPath+ 'projects/uploadPicture',
		                fields: {},
		                file: file
		            }).progress(function (evt) {
		                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		                console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
		            }).success(function (data, status, headers, config) {
		                console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
		            }).error(function (data, status, headers, config) {
		                console.log('error status: ' + status);
		            })
		        }
		    }
		};

		function get_number(data){
	        if(data != undefined && data != ''){
	            if(typeof data == 'string'){
	                return data.toString().replace(/,/gi,"");
	            }else {
	                return data.toString();
	            }
	        }
	        return 0;
    	}

		$scope.create = function (frm){
			$scope.submit_btn          = true;
			$scope.frm.tip_invite      = get_number($scope.frm.tip_invite) || 0;
			$scope.frm.amount          = get_number($scope.frm.amount) || 0;
			$scope.frm.discount_amount = get_number($scope.frm.discount_amount) || 0;
			$scope.frm.tip_contract    = get_number($scope.frm.tip_contract) || 0;

			
			$restful.post('projects/createProject', frm, function (error, resp){
				$scope.submit_btn = false;
				if(error){
					toaster.pop('warning', 'Lỗi', error);
				}else {
					toaster.pop('success', 'Thông báo', 'Đăng dự án thành công');
					$state.go('app.projects.list');
				}
			})
		}

		$scope.loadCities();
	}])

.controller('ListProjectCtrl', ['$scope', '$state', '$stateParams', '$restful', '$auth', 'App', 'Upload','toaster', 
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
	  		$scope.filter = {page: $scope.currentPage, item_page: $scope.item_page, project_type: '2'};

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
.controller('ViewProjectCtrl', ['$scope', '$state', '$stateParams', '$restful', '$auth', 'App',
		function ($scope, $state, $stateParams, $restful, $auth, App) {

				$restful.get('projects/', {id: $stateParams.id},  function (error, resp){
					$scope.loadingData = false;
					if(error){
						toaster.pop('warning', 'Lỗi', error);
					}else {
						$scope.total         = resp.total;
						$scope.data = resp;
					}
				})

		}])