/**
 * NotificationsController
 *
 * @description :: Server-side logic for managing Notifications
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require('async');

var Controllers = function (){
}

Controllers.prototype.index = function (req, res, next) {
	var params 		  = req.query,
		user          = req.user,
		id            = params.id || 0,
		item_page     = params.item_page || 5,
		page          = params.page || 1;

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
				user: user.id
			}
		};

		Notifications.count(query, function (err, total){
			if(!id){
				var chain = Notifications.find(query).populate('template').populate('user').sort({id: -1}).paginate({'page': page, 'limit': item_page});
			}else {
				query['where']['id'] = id;
				var chain = Notifications.findOne(query).populate('template').populate('user').sort({id: -1}).paginate({'page': page, 'limit': item_page});
			}
			
			chain.exec(function (err, notification){
				if(err){
					return res.json({
						'error' 		: true,
						'message'		: err,
						'error_message' : 'Lỗi truy vấn, vui lòng thử lại hoặc liên hệ BQT'
					});
				}else {
					notification.forEach(function (value, key){
						notification[key]['content_full'] = NotificationService.parseTemplate(value.template.content, JSON.parse(value.data));
					})
					query['where']['seen'] = 0;
					Notifications.count(query, function (err, unread){
						return res.json({
							'error' 		: false,
							'message'		: "",
							'error_message' : 'Thành công',
							'data'			: notification,
							'total'			: total,
							'unread'		: unread
						})
					})
					
				}
			});
		});
};


Controllers.prototype.read_notice = function (req, res, next) {
	var params 		  = req.body,
		user          = req.user,
		id            = params.id || 0;
		
		if(!user){
			return res.json({
				'error': true,
				'error_message': 'Bạn không có quyền thực hiện hành động này'
			}, 403);
		}
		if(req.method !== 'POST'){
			return res.json({
				'error': true,
				'error_message': 'Không hỗ trợ phương thức'
			});
		}
		
		var query = {
			where: {
				user: user.id
			}
		};

		if(id){
			query['where']['id'] = id;
		}

		Notifications.update(query, {seen: 1, seenAt: new Date()}).exec(function (err, resp){
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
				})
			}
		})
		
	}


module.exports = new Controllers();

