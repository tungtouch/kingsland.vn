	/**
* Projects.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	title 	     : {type: 'string', required: true},
    type_project : {type: 'string', required: true}, // Loại cho thuê hay bán
    project_status : {type: 'string', required: true}, // Trạng thái dự án  Đang xây dựng
  	except 	     : {type: 'string'},
  	content      : {type: 'string'},
  	user 	       : {model: 'user', required: true},
  	address      : {type: 'string', required: true},
  	city 	       : {model: 'cities', required: true},
  	district     : {model: 'districts', required: true},
  	contractor 	 : {type: 'string', required: true}, // Chủ đầu tư
  	amount 	     : {type: 'integer', required: true}, // Số tiền dự án
    discount_amount : {type: 'integer', required: true}, // Số tiền giảm giá
  	discount_type   : {type: 'string', required: true}, // 1: Theo %, 2: cố định
    
    tip_contract  : {type: 'integer', required: true}, // Hoa hồng lạo chốt hợp đồng
    tip_invite    : {type: 'integer', required: true}, // Hoa hồng loại giới thiệu
    tip_type      : {type: 'string', required: true}, // Loại hoa hồng
    active        : {type: 'boolean', required: true},

  }
};

