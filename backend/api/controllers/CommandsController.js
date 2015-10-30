/**
 * CommandsController
 *
 * @description :: Server-side logic for managing Commands
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var CommandsController = {};
var async = require('async');

CommandsController.postCreate = function (req, res, next){
	var params = req.body;
		var user   = req.user;
		if(!user){
			return res.json({
				'error': true,
				'error_message': 'Bạn không có quyền thực hiện hành động này'
			}, 403);
		}
		if(req.method == 'GET'){
			return res.json({
				'error': true,
				'error_message': 'Không hỗ trợ phương thức GET'
			});
		}

		if(!params['customer']){
			return res.json({
				'error': true,
				'error_message': 'Dữ liệu gửi lên không đúng'
			});
		}
		var customer = params['customer'];
		params['user'] =  user.id;
		async.waterfall([
			function (callback){
				delete params['customer'];
				Commands.create(params).exec(function (err, resp){
					if(err){
						return res.json({
							'error' 		: true,
							'message'		: err,
							'error_message' : 'Lỗi truy vấn, vui lòng liên hệ BQT'
						});
					}
					callback(null, resp);
				})


			}, function (command, callback){
				if(command.id){
					customer.command = command.id;
					Customers.create(customer).exec(function (err, resp){
						if(err){
							return res.json({
								'error' 		: true,
								'message'		: err,
								'error_message' : 'Lỗi truy vấn, vui lòng liên hệ BQT'
							});
						}
						callback(null, resp);
					})
				}else {
					callback(true, null);
				}


			}
		],
		function (err, resp){
			return res.json({
				'error' 		: false,
				'message'		: "",
				'error_message' : 'Thêm dự án thành công',
				'data'			: ""
			})
		})


};

CommandsController.show = function (req, res, next){
	var params 				= req.query,
			user   			= req.user,
			id 				= params.id || 0,
			item_page 		= params.item_page  || 20,
			status 			= params.status     || 'ALL',
			type_command 	= params.type_command     || '',
			start_date 		= params.start_date || 0,
			end_date 		= params.end_date   || 0,
			customer_phone 	= params.customer_phone || 0,
			customer_name 	= params.customer_name || 0,
			page 			= params.page || 1;

		if(!user){
			return res.json({
				'error': true,
				'error_message': 'Bạn không có quyền thực hiện hành động này'
			}, 403);
		}
		if(req.method !== 'GET'){
			return res.json({
				'error': true,
				'error_message': 'Không hỗ trợ phương thức'
			});
		}

		var query = {
			where: {
			}
		};

		if(user.privilige === 2){
			query['where']['user'] = user.id;
		}

		if(status !== 'ALL'){
			query['where']['status'] = status;
		}

		if(type_command){
			query['where']['type_command'] = type_command;
		}

		if(start_date){
			query['where']['createdAt'] = {'>=': start_date};
		}
		if(end_date){
			query['where']['createdAt'] = {'<=': end_date};
		}

		Commands.count(query, function (err, total){
			if(!id){
				var chain = Commands.find(query).populate('customer').populate('project').populate('journey', {sort: 'createdAt DESC'}).paginate({'page': page, 'limit': item_page});
			}else {
				query['where']['id'] = id;
				var chain = Commands.findOne(query).populate('customer').populate('project').populate('journey', {sort: 'createdAt DESC'}).paginate({'page': page, 'limit': item_page});
			}


				chain.exec(function (err, commands){
					if(err){
						return res.json({
							'error' 		: true,
							'message'		: err,
							'error_message' : 'Lỗi truy vấn, vui lòng thử lại hoặc liên hệ BQT'
						});
					}else {
						return res.json({
							'error' 		: false,
							'message'		: "",
							'error_message' : 'Thành công',
							'data'			: commands,
							'total'			: total
						})
					}
				});
		});

}

module.exports = CommandsController;

