/**
 * Posts.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    title 	     : {type: 'string', required: true}, // Tiêu đề
    slug 	     : {type: 'string', required: true}, // Tiêu đề
    content      : {type: 'string', required: true}, // Nội dung
    user 	       : {model: 'user', required: true},
    date          : {type: 'date'}, // ngày đăng
    active        : {type: 'boolean', required: true} // trạng thái
  }
};

