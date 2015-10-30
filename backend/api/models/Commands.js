/**
* Commands.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
     command_id   : {type:  'integer', required: true, defaultsTo: function (){return 1;}},
     //type_command  : {type: 'string', required: true}, // Loại lênh cho thuê hay mua
     user         : {model: 'user', required: true},
	   project 	    : {model: 'projects'}, // Dự án
  	 type_invite  : {type: 'string'}, // Loại giới thiệu hay chốt KH
  	 //address 	    : {type: 'string'},
  	 amount_range_min : {type: 'string', required: true}, // Sô tiền mua
  	 amount_range_max : {type: 'string', required: true}, // Sô tiền mua
     //total_amount : {type: 'string', required: false},
  	 area_range_min 	: {type: 'string', required: true}, // Diện tích
  	 area_range_max 	: {type: 'string', required: true}, // Diện tích
     //city         : {model: 'cities', required: true},
     note: {type: 'string'},
     dist_lease: {type: 'object'},
     type_lease: {type: 'object'},
     status       : {type: 'string', defaultsTo: function (){return 'WAITING'}, enum: ['WAITING', 'PROCESSING', 'SUCCESS', 'FAIL', 'CONTRACTED']},
     customer : {
      collection : 'customers',
      via        : 'command',
      dominant   : true
    },
    journey: {
      collection: 'CommandJourneys',
      via: 'command'
    }

  },
  beforeCreate : function (values, cb) {
      Commands.find({}).sort('command_id DESC').paginate({'page': 1, 'limit': 1}).exec(function (err, docs){
          if(err || docs.length == 0) {
              values.command_id = 1
              return cb();
          };

          values.command_id = docs[0].command_id + 1;
          cb();
      })
  }
};

