/**
 * DistrictsController
 *
 * @description :: Server-side logic for managing districts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	show: function (req, res, next){
		if(req.method !== 'GET'){
			return res.json({error: true, error_message: 'Không hõ trợ phương thức này'});
		}

		var cityId = req.query.city || 0;

		if(!cityId){
			return res.json({error: true, error_message: 'Mã thành phố không hợp lệ'});
		}

		Districts.find({where: {city_code: cityId}, sort: {district_name: 0}}).exec(function (err, resp){
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

