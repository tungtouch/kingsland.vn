angular.module('app')
	.controller('ProfileCtrl', ['$scope', '$state', '$stateParams', '$restful', '$auth', 'App', 'Upload','toaster', 
	  function ($scope, $state, $stateParams, $restful, $auth, App, Upload, toaster){

  		$scope.loadUser = function (query){
			$restful.get('user/show', function (error, resp){
				if(error){
					toaster.pop('warning', 'Lỗi', error);
				}else {
					var privilige = {
						1 : 'Quản trị hệ thống',
						2 : 'Kinh doanh Online',
						3 : 'Chuyên viên Bất động sản',
						4 : 'Trưởng phòng Bất động sản',
						5 : 'Nhà đầu tư',
						6 : 'Khách vãng lai'
					};
					$scope.user_info = resp.data;
					console.log(resp.data.privilige);
					$scope.privilige = privilige[resp.data.privilige];
				}
			})
		}
		$scope.loadUser();
	}]);
