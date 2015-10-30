var Services = function (){
	
}

Services.prototype.sendNotiRefer = function (user, refer_user, code, amount, cb) {
	var _template = 'NOTI_REFERRAL';
	var self 	 = this;
	async.waterfall([
		function (callback){
			self.getTemplate(_template, function (error, template){
				callback(error, template);
			})
		}, function getUser(template, callback){
			User.findOneById(user, function (err, user){
				callback(err, user, template);
			})
		}, function getReferUser(user, template, callback){
			User.findOneById(refer_user, function (err, refer_user){
				callback(err, user, refer_user, template);
			})
		}, function (user, refer_user, template, callback){
			var template_str = template.content;
			var data = {
				'refer_name': refer_user.fullname,
				'amount': amount
			}
			Notifications.create({
				user: user.id,
				template: template.id,
				data: JSON.stringify(data),
			}, function (err, doc){
				callback(err, doc)
			})
		}
	], function (err, result){
		cb(err, result)
	})

};
Services.prototype.getTemplate = function (code, callback){
	Templates.findOne({code: code}, function (error, data){
		if(error || !data){
			return callback(error, null);
		}
		return callback(error, data);
	})
}
// template {string} , data {object}
Services.prototype.parseTemplate = function(template, data) {
	var ret = template;
	for(var field in data){
		ret = ret.replace('['+field+']', data[field]);
		
	}

	return ret;
};

module.exports = new Services();