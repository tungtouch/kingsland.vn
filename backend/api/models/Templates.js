/**
* Templates.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	title: {required: true, type: 'string'},
  	content: {required: true, type: 'string'},
  	code: {required: true, type: 'string'},
  	description: {required: true, type: 'string'},
  }
};

