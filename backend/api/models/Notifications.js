/**
* Notifications.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		user	:  {model: 'user', required: true},
		template:  {model: 'templates', required: true},
		data    :  {type: 'string', required: true},
		seen    :  {type: 'integer', defaultsTo: function (){return 0;}},
		seenAt  :  {type: 'date'},
	}
};

