var bcrypt 	= require('bcrypt'),
	jwt 	= require('jsonwebtoken');
module.exports = {
	comparePassword: function (password, hash, cb){
		bcrypt.compare(password, hash, function(err, isMatch) {
	        if (err) return cb(err);
	        cb(null, isMatch);
    	});
	},
	generationToken: function (userInfo){
		var secret 		= sails.config.globals.tokenSecret;
		return token 	= jwt.sign(userInfo, secret, { expiresInMinutes: 86400});
	},
	decodeToken: function (token, callback){
		var secret 		= sails.config.globals.tokenSecret;
		jwt.verify(token, secret,  function(err, decoded) {
		  callback(err, decoded);
		});
	},
	hasUsername: function (username, callback){
		User.findOne({email: username}, function (err, doc){
			callback((doc) ? true: false, doc);
		});
	},

	updateBlance: function (userId, blance, amount, callback){
		User.findOne({id: userId}, function (err, doc){
			if(err){
				console.log('updateBlance', err, doc);
				callback(true);
			}

			if(!doc.hasOwnProperty(blance)){
				doc[blance] = 0;
			}

			var current   = parseInt(doc[blance]);
			var newBlance = current + parseInt(amount);
			var updateData = {};
			updateData[blance] = newBlance;
			User.update({id: userId}, updateData, function (err, resp){
				callback(err, resp);
			})
		})
	}
};

