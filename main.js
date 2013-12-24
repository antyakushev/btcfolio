try{
    var config = require('./config.json');
} catch(err){
    config = config||{"key":"YOUR_KEY","secret":"yoursecret"};
}
var BTCE = require('btc-e'),
    btce = new BTCE(config.key, config.secret);
var counter = 0;
var funds;
var cryptos = {};
function isRealCurrency(c){
	if (c=='usd'||c=='rur'||c=='eur') {
		return true;
	} else {
		return false;
	}
}

btce.getInfo(function(err, info) {
    if (err) {
        throw err;
  	}
  
  	funds = info.funds;
  
  	for (var fund in info.funds) {
  		if (typeof fund!='undefined' && !isRealCurrency(fund) && fund!='btc') {
	  		//console.log(info);
	  		counter++;
	  		(function(){
	  			var amount = info.funds[fund];
	  			var _fund = fund
				btce.ticker(fund+"_btc", function(err, data) {
				    if (err) {
				      console.log(err);
				    }
				    addCrypto(_fund,amount,data.ticker.avg,btcfolio);
				});
	  		})();	
  		}
  	}
});

function addCrypto(fund,amount,price,callback) {
	cryptos[fund] = {'amount':amount,'price':price};
	counter--;
	if (counter==0) {
    	callback(cryptos);
    }
}

function btcfolio(cryptos){
	var btctotal = funds.btc;
	for (c in cryptos) {
		btctotal+=cryptos[c].amount*cryptos[c].price;
	}
	console.log("All your btc-e coins cost "+btctotal+" ฿ in total");
	btce.ticker("btc_usd", function(err, data) {
		if (err) {
	      	console.log(err);
	    }
	    console.log("which is "+data.ticker.avg*btctotal+" $");
	});

}




