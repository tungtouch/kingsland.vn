/**
 * CommandJourneysController
 *
 * @description :: Server-side logic for managing Commandjourneys
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var CommandjourneysCtrl  = {},
	async 				 = require('async');


CommandjourneysCtrl.create = function (req, res, next){
	var params = req.body;
	var user   = req.user;

	if(!user || user.privilige !== 2){
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

	if(!params['old_status']){
		return res.json({
			'error': true,
			'error_message': 'Dữ liệu gửi lên không đúng, vui lòng thử lại'
		});	
	}

	if(params['old_status'] == 'SUCCESS'){
		return res.json({
			'error': true,
			'error_message': 'Bạn không thể cập nhật trạng thái khi đã thành công !'
		});	
	}


	delete params['old_status'];
	async.waterfall([

		function getCommand(callback){
			Commands.findOne({id: params.command}).exec(function (err, doc){
				if(err){
					return callback('Lỗi cập nhật, lệnh không tồn tại');
				}
				callback(null, doc);
			})
		},

		function addProject(commands, callback){
			var updateData = {
				status 		 : params['status'],
			}

			if(params['status'] == 'SUCCESS'){
				if(params.project && params.total_amount){
					updateData['project']      = params.project;
					updateData['total_amount'] = params.total_amount;
				}
			}

			Commands.update({id: params.command}, updateData).exec(function (err, docs){
				if(err){
					return callback('Lỗi không thể cập nhật được trạng thái, vui lòng thử lại')
				}else {
					callback(null, docs[0])
				}
			})
		},
		function createJourney(command,  callback){
			var saveData = {
				command: params['command'],
			  	user: user.id,
			  	status: params['status'],
			  	note: params['note'],
			}
			CommandJourneys.create(saveData, function (error, doc){
				if(error){
					
					return callback('Lỗi khi cập nhật trạng thái, vui lòng liên hệ BQT');
				}
				callback(null, doc, command);
			})
		}, 
		function (journey, command, callback){
			console.log(journey, command);
			if(params['status'] == 'SUCCESS'){
				Commands.findOne({id: command.id}).populate('project').exec(function (err, doc){
					if(err){
						return callback('Lỗi cập nhật, lệnh không tồn tại');
					}
					
					var blance       = 0;
					var total_amount = doc.total_amount || 0;
					if(total_amount == 0){
						return callback(null, "");
					}
					

					if(doc['project']['discount_type'] == 1){
						if(doc.type_invite == 2){
							blance = (parseInt(doc['project']['tip_invite']) / parseInt(doc['project']['discount_amount']) ) *  100;
						}
						if(doc.type_invite == 1){
							blance = (parseInt(doc['project']['tip_contract']) / parseInt(doc['project']['discount_amount']) ) *  100;
						}
					}else if(doc['project']['discount_type'] == 2) {
						if(doc.type_invite == 2){
							blance = parseInt(doc['project']['tip_invite']);
						}
						if(doc.type_invite == 1){
							blance = parseInt(doc['project']['tip_contract']);
						}
					}

					var trans = {
						referral 		 : journey.id,
				        user             : doc.user,  // .userID
				        type             : 'TRANSFER_SYSTEM',
				        type_blance      : 'CASH_IN',
				        blance           : blance, // Tiên nhận được / Bị trừ
				        description      : 'Yêu cầu '+ doc.command_id + ' xử lý thành công', // Kiểu giảm giá số tiền cố định hoặc %
					}

					Transactions.create(trans, function (err, resp){
						if(err || !resp){
							return callback('Lỗi xử lý, vui lòng thử lại');
						}

						UserService.updateBlance(doc.user, 'command_blance', blance, function (err, object){
							if(err || !object){
								return callback('Lỗi xử lý,1 vui lòng thử lại');
							}
							callback(null, "")
						})
					})


				})
			}else {
				callback(null, "");
			}
		}
	], function (err, response){
		res.json({
			'error' 		: err ? true : false,
			'error_message' : err,
			'data' 			: ""
		})
	});
	


}

module.exports = CommandjourneysCtrl;

