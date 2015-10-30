/**
 * CitiesController
 *
 * @description :: Server-side logic for managing Cities
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	show: function (req, res, next){
		if(req.method !== 'GET'){
			return res.json({error: true, error_message: 'Không hõ trợ phương thức này'});
		}
		Cities.find({where: {}, sort: {city_code: 1}}).exec(function (err, resp){
			if(err){
				return res.json({error: true, error_message: 'Lỗi truy vấn máy chủ, vui lòng thử lại !'});
			}
			return res.json({
				error: false,
				error_message: '',
				data: resp
			})

		})
	}
};

