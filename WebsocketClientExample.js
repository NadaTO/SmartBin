
var messageType = "LNS-UplinkData";
function callWebSocket() {

		var protocol = "ws://";
		var host = "193.253.237.167:38080/";
		var webAppName = "loraclient";
		var uri = "/websocket";
		var user = "supervision_Supcom@sagemcom.com";
		var password = "supervision_Supcom";
		var authentication = "Basic " + window.btoa(user + ":" + password);
		var token = "&Authorization=" + authentication;
	    var ConsumptionMode = "?ConsumptionMode=fromToken";
	    var blabla = "?blabla=test";
		var url = protocol + host + webAppName + uri +  ConsumptionMode  + token ;
		alert(url);
		var socket = new WebSocket(url);

		socket.onopen = function() {

			alert("Connected to the LoRa web application server");
			return true;
		};

		socket.onmessage = function(e) {
			var data = e.data;
			var message = JSON.parse(data);
			//console.log(message);


			if (message.hasOwnProperty('LNS-UplinkData')) {

				var dev = message["LNS-UplinkData"]["LNS-DevEUI"];
				var deui = binToHexString(b64ToBin(dev));


				if(deui=="0906050400030201") {
					console.log(".......DATA START....");
					console.log(message);
					addRow("keywords", message);
					console.log(".......DATA END....");
				}

			}
			else {
				if (message.hasOwnProperty('LNS-UplinkLog')) {

					var dev = message["LNS-UplinkLog"]["LNS-DevEUI"];
					var deui="";
					if(dev != null) {
						deui = binToHexString(b64ToBin(dev));
						if(deui=="0906050400030201") {
							console.log(".......LOG START....");
							console.log(message);
							addRow2("keywords", message);
							console.log(".......LOG END....");

						}

								}


				}
			}


			return true;
		};
		
		socket.onerror = function(e) {
			alert("An error occured during connection : " + e.data);
		};
		
		socket.onclose = function() {
			alert("The connection with server has been closed");
		};
	}
 	
	function addRow(in_tbl_name, message) {
		var tbody = document.getElementById(in_tbl_name).getElementsByTagName("TBODY")[0];
		
		var row = document.createElement("TR");
		console.log(message["LNS-UplinkData"]);
 
		var time = message["LNS-UplinkData"]["GTW-Timestamp"];
		var gtwtime = new Date(time);
		var td1 = document.createElement("TD")
		td1.innerHTML = gtwtime;
		
		var app = message["LNS-UplinkData"]["LNS-AppEUI"];
		var appe = binToHexString(b64ToBin(app));
		var td2 = document.createElement("TD")
		td2.innerHTML = appe;

		var dev = message["LNS-UplinkData"]["LNS-DevEUI"];
		var deui = binToHexString(b64ToBin(dev));
		var td3 = document.createElement("TD")
		td3.innerHTML = deui;

		var addr = message["LNS-UplinkData"]["LORA-DevAddr"];
		var deva = binToHexString(b64ToBin(addr));
		var td4 = document.createElement("TD")
		td4.innerHTML = deva;

		var cnt = message["LNS-UplinkData"]["LORA-FCntUp"];
		var td5 = document.createElement("TD")
		td5.innerHTML = cnt;

		var port = message["LNS-UplinkData"]["LORA-FPort"];
		var td6 = document.createElement("TD")
		td6.innerHTML = port;

		var pay = message["LNS-UplinkData"]["LORA-FRMPayload"];
		var dec = binToHexString(b64ToBin(pay));
		console.log("payload= "+dec);
		var td7 = document.createElement("TD")
		td7.innerHTML = dec;
		
		row.appendChild(td1);
		row.appendChild(td2);
		row.appendChild(td3);
		row.appendChild(td4);
		row.appendChild(td5);
		row.appendChild(td6);
		row.appendChild(td7);

		// append row to table
		tbody.appendChild(row);
  }

function addRow2(in_tbl_name, message) {

	var error = message["LNS-UplinkLog"]["LNS-FrameErrorCode"];
	if (error != "NoError") {
		return;
	}

	var tbody = document.getElementById(in_tbl_name).getElementsByTagName("TBODY")[0];

	var row = document.createElement("TR");
	console.log(message["LNS-UplinkLog"]);

	var time = message["LNS-UplinkLog"]["GTW-Timestamp"];
	var gtwtime = new Date(time);
	var td1 = document.createElement("TD")
	td1.innerHTML = gtwtime;

	var app = message["LNS-UplinkLog"]["LNS-AppEUI"];
	var appe="";
	if (app != null){
	appe = binToHexString(b64ToBin(app));}
	var td2 = document.createElement("TD")
	td2.innerHTML = appe;

	var dev = message["LNS-UplinkLog"]["LNS-DevEUI"];
	var deui="";
	if(dev != null) {
	deui = binToHexString(b64ToBin(dev));}
	var td3 = document.createElement("TD")
	td3.innerHTML = deui;

	var addr = message["LNS-UplinkLog"]["LORA-DevAddr"];
	var deva="";
	if(addr != null) {
	deva = binToHexString(b64ToBin(addr));}
	var td4 = document.createElement("TD")
	td4.innerHTML = deva;

	var cnt = message["LNS-UplinkLog"]["LORA-FCntUp"];
	var td5 = document.createElement("TD")
	td5.innerHTML = cnt;

	var port = message["LNS-UplinkLog"]["LORA-FPort"];
	var td6 = document.createElement("TD")
	td6.innerHTML = port;

	var pay = message["LNS-UplinkLog"]["LORA-FRMPayloadSize"];
	var td7 = document.createElement("TD")
	td7.innerHTML = pay;

	row.appendChild(td1);
	row.appendChild(td2);
	row.appendChild(td3);
	row.appendChild(td4);
	row.appendChild(td5);
	row.appendChild(td6);
	row.appendChild(td7);

	// append row to table
	tbody.appendChild(row);
}

function b64ToBin(b64Data)
{
	var byteCharacters = atob(b64Data);
	var byteNumbers = new Array(byteCharacters.length);
	for (var i = 0; i < byteCharacters.length; i++) {
	    byteNumbers[i] = byteCharacters.charCodeAt(i);
	}
	return byteNumbers;
}

function binToHexString(bin)
{
	var s="";
	for (var i = 0; i < bin.length; i++) {
		var temp = bin[i].toString(16);
		if(temp.length < 2) {
			temp = '0' + temp;
		}
	    s=s+temp;
    }
	return s.toUpperCase();
}

function binToString(b64Data)
{
	var byteCharacters = atob(b64Data);
	var byteNumbers = "";
	for (var i = 0; i < byteCharacters.length; i++) {
	    byteNumbers += '' + byteCharacters.charCodeAt(i) + '';
	}
	return byteCharacters;
}

function loadGatewayTable() {
	console.log("....Gateways");
	var user = "supervision_Supcom@sagemcom.com";
	var password = "supervision_Supcom";
	var authentication = "Basic " + window.btoa(user + ":" + password);
	var token = "?Authorization=" + authentication;

	$.ajax({
		url:"http://193.253.237.167:38080/loraclient/gateway" + token,
		type:"GET",
		data:"",
		contentType:"application/json; charset=utf-8",
		dataType:"json"
	})
		.done(function(data, textStatus, jqXHR){
			var jsondata = JSON.stringify(data);
			var endpoints = JSON.parse(jsondata); // now you can parse it, `students` is object again
			console.log(endpoints);


			for ( var i in endpoints) {
				var gid = endpoints[i].GatewayId;
				var cfg = endpoints[i].CurConfig;
				var fw = endpoints[i].CurFw;
				var last = endpoints[i].LastConnection;
				var status = endpoints[i].Status;


			}

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
		})

}