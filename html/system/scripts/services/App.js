angular.module('app')
	.service('App', [ '$http', '$resource', '$restful', function ( $http, $resource, $restful){
		
		var App = {
			getCities: function (callback){
				$restful.get('cities/show', function (error, resp){
					callback(error, resp)
				});
			},

			getDistricts: function (city_code, callback){
				$restful.get('districts/show',{city: city_code},  function (error, resp){
					callback(error, resp)
				});
			},


		};
		return App;
	}])