/**
* CommandJourneys.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	command: {model: 'commands', required: true},
  	user: {model: 'user', required: true},
  	status: {type: 'string', required: true},
  	note: {type: 'string', required: true},
  }
};

