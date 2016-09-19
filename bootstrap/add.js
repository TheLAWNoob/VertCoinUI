// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var sauce = require('./index')
var ar4
var ar5
var client = new sauce.Client({
	host: 'localhost',
	port: 9332,
	user: '0',
	pass: '1'
});
//no chill

function getacc () {//get accounts
	client.listAccounts(function(err, tmp) {
		if (err) return console.error(err)
		for (x in tmp) ar4.push(x)
		add()
	})
}

function add () {//get addresses
	if (ar4.length > 0) {
		client.getAddressesByAccount(ar4[0], function(err, tmp2) {
			if (err) return console.error(err)
			for (y in tmp2) {
				//console.log(tmp2[y] + ar4[0])
				ar5.push(ar4[0], tmp2[y])
			}
			ar4.shift()
			add()
			alladd = ""
			update()
		})
	}
}

function price () {
	var tick = 0
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() { 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			var myArr = JSON.parse(xmlHttp.responseText)
			//console.log(myArr.BTC_VTC.last)
			tick = myArr.BTC_VTC.last
			document.getElementById("price").innerHTML = "VTC @ " + tick + " BTC"
		}
	}
	xmlHttp.open("GET", "http://poloniex.com/public?command=returnTicker", true); // true for asynchronous 
	xmlHttp.send(null);
}

function update () {
	len = ar5.length
	for (x = 0; x < len; x+=2) {
		alladd += "<tr><td>" + ar5[x] + "</td><td>" + ar5[x+1] + "</td></tr>"
	}
	document.getElementById("alladd").innerHTML = alladd
}

function f5 () {
	ar4 = []
	ar5 = []
	getacc()
	price()
	setTimeout(function() {f5()}, 10000)
}

window.onload = (function(){
	f5()
})
