var bcrypt 	= require('bcrypt');

module.exports = {
	attributes: {
		email		: {type: 'email', unique: true, required: true},
		password 	: {type: 'string', required: true},
		fullname	: {type: 'string', required: true},
		phone		: {type: 'string', required: true},
		refer		: {model: 'user'},
		last_login 	: {type: 'date'}, // Use timestamp
		privilige 	: {type: 'integer', defaultsTo: function (){return 1}}, 
		blance 		: {type: 'integer', defaultsTo: function (){return 0}},
		refer_blance : {type: 'integer', defaultsTo: function (){return 0}},
		command_blance : {type: 'integer', defaultsTo: function (){return 0}},
		refer_code: {
			collection: 'coupons',
            via: 'user'

		}
	},
	// Hook on user create
	beforeCreate: function (value, next){
		bcrypt.hash(value.password, 11, function(err, hash) {
      		if(err) return next(err);
      		value.password = hash;
      		next();
    	});
	},
	beforeUpdate: function (value, next){
		next();
	},
	comparePassword: function (password, cb){
		bcrypt.compare(password, this.password, function(err, isMatch) {
	        if (err) return cb(err);
	        cb(null, isMatch);
    	});
	}
};

