/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var async = require('async');
module.exports = {
	index: function (req, res, send){
		return res.json({
			'error': true,
			'error_message': 'Hello world'
		});
	},
	signup: function (req, res, next){
		if(req.body){
			var email    = req.body.username,
				password = req.body.password,
				fullname = req.body.fullname;
				phone    = req.body.phone;
				refer    = req.body.refer;

			var messageErr = "";
			if(!email){messageErr = "Vui lòng nhập email"}
			if(!password){messageErr = "Vui lòng nhập mật khẩu"}
			if(!fullname){messageErr = "Vui lòng nhập họ tên"}
			if(!phone){messageErr = "Vui lòng nhập số điện thoại"}

			if(messageErr && messageErr !== ""){
				return res.json({'error': true, 'error_message': messageErr, 'data': []});
			}

			User.findOne({email: email}, function (err, doc){
				if(err){return res.json({'error': true, 'error_message': "Lỗi máy chủ, vui lòng thử lại", 'data': []})}
				if(doc){return res.json({'error': true, 'error_message': "Email đã có người sử dụng", 'data': []})}

				var data = {
					email		: email,
					password	: password,
					fullname	: fullname,
					phone    	: phone
				};
				async.waterfall([
					function createUser(callback){
						User.create(data).exec(function (err, created){
							callback(err, created);
						});
					}, function createCouponForUser(user, callback){
						var coupon = {
							type: 1, // Loại Coupons : 1: Discount của khách hàng, Discount của hệ thống
							user: user.id, // User
							discount: 200000, // Giảm giá vnđ
							limit_usaged: 0 // Giới hạn số lần sử dụng
						}

						Coupons.create(coupon, function (error, coupon){
							callback(error,  user)
						})
					}, function createRefer(user, callback){
						if(refer.length == 0){
							return callback(null, user, {});
						}

						Coupons.findOne({code: refer}).populate('user').exec(function (err, coupon){
							if(err || !coupon){
								return callback('Mã khuyến mãi không hợp lệ !');
							}
							var referral = {
								user 		: coupon.user.id,
								refer_user  : user.id,
								coupon_code : refer,
								coupon_id 	: coupon.id,
								discount 	: coupon.discount
							}
							Referrals.findOrCreate(referral, function(err, data){
								if(err){
									return callback(err);
								}
								var trans = {
									referral 		 : data.id,
							        user             : coupon.user.id,  // ID
							        type             : 'AFFILIATE_MEMBERS',
							        type_blance      : 'CASH_IN',
							        blance           : coupon.discount, // Tiên nhận được / Bị trừ
							        description      : 'Giới thiệu thành viên ' + user.fullname, // Kiểu giảm giá số tiền cố định hoặc %
							        //status         	 : 'WAIT_TRANSACTION'
								}
								Transactions.create(trans, function (err, resp){
									if(err || !resp){
										return callback('Lỗi xử lý, vui lòng thử lại');
									}

									UserService.updateBlance(coupon.user.id, 'refer_blance', coupon.discount, function (err, object){

										if(err || !object){
											return callback('Lỗi xử lý,1 vui lòng thử lại');
										}
										callback(null, user, data)
									})
								})
							});
						})

					}, function sendNotification (user, referral_model, callback){
						if(!referral_model || Object.keys(referral_model).length == 0){
							return callback(null, user);
						}
						NotificationService.sendNotiRefer(referral_model.user, referral_model.refer_user, referral_model.coupon_code, referral_model.discount, function (err, result){
							callback(err, user);
						});
					}
				], function (err, user){
					if(err) return res.json({'error': true, 'error_message': err});
					return res.json({
						error	: (err) ? true : false,
						error_message	: (err) ? err : "Thành công",
						data 	: user || {}
					})
				})

			})
		}else {
			return res.json({
				error: true,
				error_message: "METHOD.NOT.ALLOW",
				data: []
			});
		}

	},

	signin: function (req, res, next){
		if(req.body){
			var username = req.body.username,
				password = req.body.password;

			UserService.hasUsername(username, function (has, user){
				if(has){
					UserService.comparePassword(password, user.password, function (err, isMatch){
						if(err ||  !isMatch){
							return res.json({'error': true, 'error_message': "Mật khẩu không đúng", 'data': []});
						}

						var token = UserService.generationToken(user);
						return res.json({
							"error"		: false,
							"error_message"	: "SUCCESS",
							"data"		: {
								token: token,
								user: {
									id	: user.id,
									fullname: user.fullname,
									email: user.email,
									privilige: user.privilige || 1 ,
									blance: user.blance || 0 ,
									refer_blance: user.refer_blance || 0 ,
									command_blance: user.command_blance || 0 ,
								}
							}
						})
					})
				}else {
					return res.json({'error': true, 'error_message': "Tài khoản không tồn tại", 'data': []});
				}
			})
		}else {
			return res.json({
				error: true,
				error_message: "METHOD.NOT.ALLOW",
				data: []
			});
		}
	},

	validRefer : function (req, res, next){
		var coupon = req.query.refer;
		Coupons.findOne({code: coupon}, function (err, code){
			if(code){
				return res.json({'error': false, 'error_message': "Người giới thiệu hợp lệ", 'data': {code: code.code}});
			}
			return res.json({'error': true, 'error_message': "Người giới thiệu không hợp lệ", 'data': []});
		});
	},
	show: function (req, res, next){
		var params = req.body;
		var user   = req.user;

		if(!user){
			return res.json({
				'error': true,
				'error_message': 'Bạn không có quyền thực hiện hành động này'
			}, 403);
		}

		User.findOne({id: user.id}).exec(function (err, resp){
			if(!err){
				Coupons.findOne({user: user.id}, function (error, coupon){

					if(error){
						return res.json({
							'error': true,
							'error_message': 'Không thể tải dữ liệu, vui lòng thử lại',
							'message': error
						});
					}
					var respData = resp;
					respData['coupon'] = coupon;
					return res.json({'error': false, 'error_message': "Thành công", data: respData});
				})

			}else {
				return res.json({
					'error': true,
					'error_message': 'Không thể tải dữ liệu, vui lòng thử lại',
					'message': err
				});
			}

		})

	},
	list: function (req, res, next) {
    var params = req.body;
    var user   = req.user;

    if(!user){
      return res.json({
        'error': true,
        'error_message': 'Bạn không có quyền thực hiện hành động này'
      }, 403);
    }

		User.find({}).exec(function (err, data) {

      if(err){
        return res.json({
          'error': true,
          'error_message': 'Không thể tải dữ liệu, vui lòng thử lại',
          'message': error
        });
      }

      return res.json({'error': false, 'error_message': "Thành công", data: data});

    })
	}


};

