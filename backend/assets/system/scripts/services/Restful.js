angular.module('app')
	.service('$restful', ['$http', '$resource', function ( $http, $resource){
		return {
			get: function (resource, data, callback){
				callback = (data && typeof data == 'function') ? data : callback;
				$http.get(ApiPath + resource, {params: data}).success(function (resp){
					if(resp.error){
						return callback(resp.error_message, null);
					}
					return  callback(null, resp);
				}).error(function (error){
					return callback(error, null);
				})
			},

			post: function (resource, data, callback){
				callback = (data && typeof data == 'function') ? data : callback;
				$http.post(ApiPath + resource, data || {}).success(function (resp){
					if(resp.error){
						return callback(resp.error_message , null);
					}
					return  callback(null, resp);
				}).error(function (error){
					return callback(error.error_message, null);
				})
			}

		};
	}])