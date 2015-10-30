angular.module('app')
	
.controller('AppController', ['$scope', '$state', '$stateParams', '$restful', '$auth', 'App', 'Upload','toaster', '$interval',
	  function ($scope, $state, $stateParams, $restful, $auth, App, Upload, toaster, $interval){
	  	$scope.list_notification = [];
	  	$scope.unread_notification = 0;
		$scope.loadNotification = function (){
			$restful.get('notifications', {limit : 10}, function (error, data){
				$scope.list_notification   = data.data;
				$scope.unread_notification = data.unread;
			})
		};

		$scope.loadStatitics = function(){
			$restful.get('transactions/statistic',{},  function (error, resp){
	  			
				if(error){
					toaster.pop('warning', 'Lỗi', error);
				}else {
					$scope.transactions_statistic_total = resp.total;
					$scope.transactions_statistic = resp.data;
				}
			})
		}

		$scope.read_notice = function (item){
			var params = {};

			if(item && item.id){
				params['id'] = item.id;
			}
			$restful.post('notifications/read_notice', params, function (error, data){
				if(item && item.id){
					item.seen = 1;
				}
			})	
		}


		$scope.loadNotification();
		$scope.loadStatitics();
		
		$interval(function (){
			$scope.loadNotification();
			$scope.loadStatitics();
		}, 10000);
		
	}])