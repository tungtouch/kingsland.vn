/**
* Referrals.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
	user 		 : {model: 'user', required: true}, // Người giới thiệu
	refer_user 	 : {model: 'user' , required: true}, // Người được giới thiệu
	coupon_code  : {type: 'string', required: true},
	coupon_id 	 : {model: 'coupons', required: true},
	discount 	 : {type: 'integer', required: true}
  }
};

