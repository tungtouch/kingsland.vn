angular.module('app')
	.controller('LoginCtrl', ['$scope', '$state', '$stateParams', '$restful', '$auth', 'toaster', function ($scope, $state, $stateParams, $restful, $auth, toaster){
		$scope.loginProcessing = false;
		$scope.loginErr = "";
		$scope.login = function (email, password, remember){
			if(!email){
				$scope.loginErr = "Vui lòng nhập email của bạn";
				return ;
			}

			if(!password){
				$scope.loginErr = "Vui lòng nhập mật khẩu của bạn";
				return ;
			}

			$scope.loginProcessing = true;

			$restful.post('user/signin', {username: email, password: password}, function (err, resp){
				$scope.loginProcessing = false;
				if(err){
					$scope.loginErr = "Sai thông tin đăng nhập, vui lòng thử lại";
					return ;
				}
				var data = resp.data;
				data['time_expired'] = (Date.now() / 1000) + 86400 * 1;
				$auth.setUser(data);
				$state.go('checkAuth');
			})
		};

		$scope.frm             = {};
		$scope.registerSuccess = false;
		$scope.getReferLoading = false;
		var timeout            = null;

		if(sessionStorage){
			var _ref = sessionStorage.getItem('refer_code');
			if(_ref){
				$scope.frm.refer = _ref;
			}
		}
		if($stateParams.refer){
			$scope.frm.refer = $stateParams.refer;
		}


		$scope.$watch('frm.refer', function (value){
			if(value != undefined && value.length == 0 ){
				return false;
			}
			$scope.getReferLoading = true;
			if(timeout){
				$scope.getReferLoading = false;
				clearTimeout(timeout);
			}
			timeout = setTimeout(function() {
				if(value){
					$scope.getReferLoading = true;
					$scope.validRefer(value);
				}
				
			}, 100);
		});

		$scope.validRefer = function (email){
			$restful.get('user/validRefer', {refer: email}, function (err, resp){

				$scope.getReferLoading 	  = false;
				if(err){
					$scope.frm.referValid = false;
					return;
				}
				$scope.frm.referId = resp.data.code;
				$scope.frm.referValid = true;
			})
		}


		$scope.register = function (formData){
			$scope.registerSuccess = false;
			$scope.loginErr        = "";
			$scope.loginProcessing = true;
			formData               = angular.copy(formData);
			formData['refer']      = formData.referId ? formData.referId : '';

			$restful.post('user/signup', formData, function (err, resp){
				$scope.loginProcessing = false;
				if(err){
					$scope.loginErr = err;
					return ;
				}
				toaster.pop('success', 'Thông báo', 'Chúc mừng bạn đã đăng ký thành công !');

				setTimeout(function (){
					$state.go('login');
				}, 2000);
				//
				$scope.registerSuccess = true;
			})
		}
	}])