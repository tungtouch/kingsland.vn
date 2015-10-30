/**
 * Leases.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    owner 	     : {type: 'string', required: true},// Chủ nhà
    phone: {type: 'string', required: true}, // điện thoại chủ nhà
    type_lease : {type: 'object'}, // Loại cho thuê: Chung cư, nhà riêng, nhà mặt phố, cửa hàng, văn phòng, Kho, xưởng
    for_lease: {type: 'object'},
    house_number : {type: 'string', required: true},// số nhà
    address      : {type: 'string', required: true},
    dist : {type: 'string', required: true}, // quận
    area : {type: 'integer', required: true}, //  diện tích mặt bằng
    facades: {type: 'integer'}, // mặt tiền
    number_floor : {type: 'integer'}, // Số tầng
    number_rooms : {type: 'integer'}, // Số phòng
    amount 	     : {type: 'integer', required: true}, // Số tiền cho thuê/ tháng
    except 	     : {type: 'string'},
    content      : {type: 'string'}, // thông tin khác
    user 	       : {model: 'user', required: true},
    number_tip : {type: 'integer', required: true},
    slug : {type: 'string', required: true},
    title : {type: 'string', required: true},
    //tip_type      : {type: 'string'}, // Loại hoa hồng

    //discount_amount : {type: 'integer'}, // Số tiền giảm giá
    //discount_type   : {type: 'string'}, // 1: Theo %, 2: cố định

    //tip_contract  : {type: 'integer'}, // Hoa hồng lạo chốt hợp đồng
    //tip_invite    : {type: 'integer'}, // Hoa hồng loại giới thiệu

    company_hire        : {type: 'boolean'},
    active  : {type: 'boolean'}
  }
};

