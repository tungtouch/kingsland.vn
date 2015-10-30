/**
* Coupons.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var hashids = require('hashids');

module.exports = {
  	attributes: {
		code: {defaultsTo: function (){

		}}, // Mã Coupons
		type: {required: true, type: 'integer'}, // Loại Coupons : 1: Discount của khách hàng, Discount của hệ thống
		user: {model: 'user'}, // User 
		discount: {required: true, type:'integer'}, // Giảm giá vnđ
		limit_usaged: {required: true, type:'integer'}, // Giới hạn số lần sử dụng
		status: {required: true, type:'integer', defaultsTo: function (){return 1;}}, // Trạng thái 1: Active, 2: Deactive
		expiredAt: {type: 'date'}
  	},
  	beforeCreate: function (values, cb) {
		_hashids = new hashids("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
		id       = _hashids.encode(345, 10 , Math.floor(Date.now() -  Math.floor((Math.random() * 100) + 1)));
		values.code = id;
		return cb();
	}
	

};

