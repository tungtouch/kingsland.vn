/**
* Customers.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	fullname : {type: 'string', required: true},
  	phone 	 : {type: 'string', required: true},
  	email 	 : {type: 'email'},
  	address  : {type: 'string'},
  	work  	 : {type: 'string'},
  	command  : {model: 'commands', required: true},
  }
};

