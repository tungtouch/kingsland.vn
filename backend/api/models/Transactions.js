/**
* Transactions.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        transaction_id   : {type:  'integer', required: true, defaultsTo: function (){return 1;}},
        referral         : {model: 'referrals'},
        user             : {model: 'user', required: true},  // ID
        user_accept      : {model: 'user'}, //  Người xác thực giao dịch 
        time_accept      : {type:  'date'}, // Thời gian xác thực
        type             : {type:  'string', required: true, enum: ['TRANSFER_SYSTEM', 'AFFILIATE_MEMBERS', 'AFFILIATE_TRANSACTION', 'TRANSFER_BANK', 'TRANSFER_CASH']}, //  Loại giao dịch
        type_blance      : {type:  'string', required:true , enum: ['CASH_IN', 'CASH_OUT']},
        blance           : {type:  'integer', required: true}, // Tiên nhận được 
        description      : {type:  'string'}, // Kiểu giảm giá số tiền cố định hoặc %
        /*status         : {
            type: 'string',
            required: true, 
            enum: ['WAIT_TRANSACTION', 'VERIFIED_TRANSACTION', 'FAILED_TRANSACTION', 'SUCCESS_TRANSACTION'], 
            defaultsTo: function (){return 'WAIT_TRANSACTION';}
        }*/
    },
    beforeCreate : function (values, cb) {
        Transactions.find({}).sort('transaction_id DESC').paginate({'page': 1, 'limit': 1}).exec(function (err, docs){
            if(err || docs.length == 0) {
                values.transaction_id = 1
                return cb();
            };

            values.transaction_id = docs[0].transaction_id + 1;
            cb();
        })
    }

};

