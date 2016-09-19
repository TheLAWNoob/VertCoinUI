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

function runvtc () {
	var dir = __dirname
	require('child_process').exec('../a.bat', function (err, stdout, stderr) {
		if (err) {
			// Ooops.
			console.log(stderr);
			return console.log(err);
		}

		// Done.
		console.log(stdout);
	});
	
	
	/*
	var dir = "run " + __dirname + '\\a.bat'
	const spawn = require('child_process').spawn;
	console.log(dir)
	spawn('cmd.exe', ['/c', dir])*/
}

var funs = [//array of functions
function diff () {//difficulty
	client.getDifficulty(function(err, tmp) {
		if (err) return console.error(err)
		document.getElementById("diff").innerHTML = "Difficulty: " + Math.round(tmp * 100) / 100
	})
},

function bloc () {//block count
	client.getBlockCount(function(err, tmp) {
		if (err) return console.error(err)
		document.getElementById("bloc").innerHTML = "Blocks: " + tmp
	})
},

function hash () {//network hashrate
	client.getNetworkHashPs(function(err, tmp) {
		if (err) return console.error(err)
		document.getElementById("hash").innerHTML = "Net Hash: " + Math.round(tmp / 10000000) / 100 + "Gh/s"
	})
},

function nvtc () {//get spendable balance
	total = 0
	unconf = 0
	client.getBalance(function(err, tmp) {
		if (err) return console.error(err)
		total = tmp
		document.getElementById("nvtc").innerHTML = "Usable: " + Math.round(tmp * 1000) / 1000 + "VTC"
	})
	client.listTransactions("*", 300, 0, function(err, tmp) {
		if (err) return console.error(err)
		for (x in tmp) {
			//if (((tmp[x].category == "generate" || tmp[x].category == "immature") && tmp[x].confirmations < 120)
			//	|| ((tmp[x].category == "recieve" || tmp[x].category == "send") && tmp[x].confirmations < 6))
			if (tmp[x].category == "immature" || tmp[x].category == "unconfirmed")
				unconf += tmp[x].amount
		}
		total += unconf
		document.getElementById("ntmp").innerHTML = "On Hold: " + Math.round(unconf * 1000) / 1000 + "VTC"
		document.getElementById("ntol").innerHTML = "Total: " + Math.round(total * 1000) / 1000 + "VTC"
	})
},

function tran () {//show 6 recent transactions (3 sent, 3 recieved)
	client.listTransactions("*", 500, 0, function(err, tmp) {//pulling newest 500
		if (err) return console.error(err)
		var options = {year: "numeric", month: "short", day: "numeric",
						hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false}
		sent = 0
		reci = 0
		var ar1 = new Array()
		for (x = tmp.length - 1; x >= 0 && (sent < 3 || reci < 3); x--) {
			d = new Date(tmp[x].timereceived * 1000)
			tim = d.toLocaleTimeString("en-ca", options)
			amt = Math.round(tmp[x].amount * 1000) / 1000
			chk = tmp[x].confirmations
			add = tmp[x].address
			if (tmp[x].amount < 0) {
				sent++
				if (sent == 1) {
					document.getElementById("stim1").innerHTML = tim
					document.getElementById("samt1").innerHTML = amt
					document.getElementById("sadd1").innerHTML = add
					document.getElementById("schk1").innerHTML = chk
				} else if (sent == 2) {
					document.getElementById("stim2").innerHTML = tim
					document.getElementById("samt2").innerHTML = amt
					document.getElementById("sadd2").innerHTML = add
					document.getElementById("schk2").innerHTML = chk
				} else if (sent == 3) {
					document.getElementById("stim3").innerHTML = tim
					document.getElementById("samt3").innerHTML = amt
					document.getElementById("sadd3").innerHTML = add
					document.getElementById("schk3").innerHTML = chk
				}
			} else {
				reci++
				amt = "+" + amt
				if (reci == 1) {
					document.getElementById("rtim1").innerHTML = tim
					document.getElementById("ramt1").innerHTML = amt
					document.getElementById("radd1").innerHTML = add
					document.getElementById("rchk1").innerHTML = chk
				} else if (reci == 2) {
					document.getElementById("rtim2").innerHTML = tim
					document.getElementById("ramt2").innerHTML = amt
					document.getElementById("radd2").innerHTML = add
					document.getElementById("rchk2").innerHTML = chk
				} else if (reci == 3) {
					document.getElementById("rtim3").innerHTML = tim
					document.getElementById("ramt3").innerHTML = amt
					document.getElementById("radd3").innerHTML = add
					document.getElementById("rchk3").innerHTML = chk
				}
			}
		}
	})
},

function peer () {
	client.getConnectionCount(function(err, tmp) {
		if (err) return console.error(err)
		document.getElementById("peer").innerHTML = "Peers: " + tmp
	})
}]

function f5 () {
	for (x in funs)	funs[x]()
	setTimeout(function() {f5()}, 10000)
}

window.onload = (function(){
	f5()
})

/*function help () {
	client.help(function(err, tmp) {
		if (err) return console.error(err)
		document.getElementById("console").appendChild(document.createTextNode(tmp))
		document.getElementById("console").scrollTop = document.getElementById("console").scrollHeight
	})
}

function submit () {
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			var myArr = JSON.parse(xmlHttp.responseText)
			console.log(myArr.BTC_VTC.last)
		}
    }
    xmlHttp.open("GET", "http://poloniex.com/public?command=returnTicker", true); // true for asynchronous 
    xmlHttp.send(null);
	

	cmd = document.getElementById("cmd").value
	args = ""
	pos = cmd.indexOf(' ')
	if (pos != -1) {
		args = cmd.substring(pos + 1)
		cmd = cmd.substring(0, pos)
	}
	client.cmd(cmd, args, function(err, tmp) {
		err+="\n"
		tmp+="\n"
		if (err) document.getElementById("console").appendChild(document.createTextNode(err))
		document.getElementById("console").appendChild(document.createTextNode(tmp))
		document.getElementById("console").scrollTop = document.getElementById("console").scrollHeight
	})
}*/
