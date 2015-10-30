/**
 * TransactionsController
 *
 * @description :: Server-side logic for managing transactions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var TransactionCtrl = {};


TransactionCtrl.show = function (req, res, next){
	var params 			= req.query,
	 	user   			= req.user,
	 	id 				= params.id || 0,
	 	status 			= params.status || 0,
	 	type 			= params.type || 0,
	 	start_date 		= params.start_date || 0,
		end_date 		= params.end_date   || 0,
	 	item_page 		= params.item_page || 20,
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
			'user': user.id
		}
	};

	if(status){
		query['where']['status'] = status;
	}

	if(type){
		query['where']['type'] = type;
	}

	if(start_date){
		query['where']['createdAt'] = {'>=': start_date};
	}
	if(end_date){
		query['where']['createdAt'] = {'<=': end_date};
	}


	Transactions.count(query, function (err, total){
		var chain = Transactions.find(query).sort({id: -1}).populate('referral').populate('user').paginate({'page': page, 'limit': item_page});
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

};


TransactionCtrl.statistic = function (req, res, next){
	var params 			= req.query,
	 	user   			= req.user,
	 	start_date 		= params.start_date || 0,
	 	item_page 		= params.item_page || 20,
	 	page 			= params.page || 1;

	if(!user){
		return res.json({
			'error' 	 	: true,
			'error_message' : 'Bạn không có quyền thực hiện hành động này'
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
			type: 'TRANSFER_SYSTEM',
		}
	};


	/*if(start_date){
		query['where']['createdAt'] = {'>=': start_date};
	}
	if(end_date){
		query['where']['createdAt'] = {'<=': end_date};
	}*/


	Transactions.count({}, function (err, total){
		var chain = Transactions.find(query).sort({id: -1}).populate('user').paginate({'page': page, 'limit': 10});
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

module.exports = TransactionCtrl;
