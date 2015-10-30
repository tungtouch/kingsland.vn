
var TransactionService = {};

TransactionService.createTransaction = function (user, transaction, callback){
	var userId  = user.id;
	
	if(transaction)

	Transactions.create(transaction).exec(function (err, resp){
		callback(err, resp)
	})
}

module.exports = TransactionService;

