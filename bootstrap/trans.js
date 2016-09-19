// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var sauce = require('./index')
var chart1
var client = new sauce.Client({
	host: 'localhost',
	port: 9332,
	user: '0',
	pass: '1'
});
//no chill

function tran () {//show 6 recent transactions (3 sent, 3 recieved)
	client.listTransactions("*", 1000, 0, function(err, tmp) {//pulling newest 500
		if (err) return console.error(err)
		var options = {year: "numeric", month: "short", day: "numeric",
						hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false}
		sent = 0
		reci = 0
		var alltrans = ""
		
		for (x = tmp.length - 1; x >= 0; x--) {
			d = new Date(tmp[x].timereceived * 1000)
			tim = d.toLocaleTimeString("en-ca", options)
			amt = Math.round(tmp[x].amount * 1000) / 1000
			chk = tmp[x].confirmations
			add = tmp[x].address
			alltrans += "<tr><td>" + tim + "</td>" + "<td>" + tmp[x].category + "</td>" + "<td>" + amt + "</td>"
						+ "<td>" + add + "</td>" + "<td>" + chk + "</td>" + "<td>" + tmp[x].txid + "</td></tr>"
		}
		document.getElementById("alltrans").innerHTML = alltrans
	})
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

function f5 () {
	tran()
	price()
	setTimeout(function() {f5()}, 10000)
}

window.onload = (function(){
	f5()
})
