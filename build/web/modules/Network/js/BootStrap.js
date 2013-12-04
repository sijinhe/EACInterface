// JavaScript Document
// Author: Bill, 2011

var _DEBUG_=false;

$(function(){
	registerTemplate();
	
	setup();
	
	initAjax();
	
	initUi();
});

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

function registerTemplate() {
	$.template("networkPanelTemplate", Template_NetworkPanel);
	$.template("networkRowTemplate", Template_NetworkRow);
	$.template("messageBoxTemplate", Template_MessageBox);
}

function setup() {
	$("#mainBody").empty();
	
	var panel=$.tmpl("networkPanelTemplate", [{id:"networkPanel"}]).appendTo("#mainBody");
	
	// set up highlight & selection effect for [task]
	$(panel).delegate(".networkRow", "mouseover", function() {
		$(this).addClass("hover");
	}).delegate(".networkRow", "mouseout", function() {
		$(this).removeClass("hover");
	});
	
	loadNetwork();
}

function initUi() {
	// jquery ui init
	$("button").button();
	
	$("#banner").html(Locale["network.banner"]);
}

function initAjax() {
	jQuery.support.cors = true;
	
	$(document).ajaxStart(function(){
		$("#loadingIcon").show();
	}).ajaxStop(function(){
		$("#loadingIcon").hide();
	});
}

function printError(jqXHR, textStatus, errorThrown) {
	printMessage("Connection Broken: "+textStatus+", "+errorThrown);
}

function printMessage(msg) {
	return $.tmpl("messageBoxTemplate", [{message: msg}]).appendTo("#mainBody").dialog({
		resizable: false,
		modal: true,
		buttons: [
			{
				text: Locale["network.dialog.close"],
				click: function() {
					$(this).dialog("destroy");
				}
			}
		]
	});
}

function showProcessingDialog() {
	var view=$("<div style='text-align:center;'><img src='css/image/progress.gif'/>"+Locale["network.dialog.processing"]+"</div>").dialog({
		autoOpen: true,
		width: 240,
		height: 100,
		resizable: false,
		modal: true,
		closeOnEscape: false,
		open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); },
		buttons: {
		}
	});
	return view;
}


/* Module Specified */
function loadNetwork() {
	var list=$("#networkPanel").find("span[zmlm\\\:item='networkList']").empty();
	$("<em>"+Locale["network.message.loading"]+"</em>").appendTo(list);
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/NetWorkServlet",
		cache: false,
		data: {
			methodtype: "fetchips",
			loginuser: getUsername()
		},
		success: function(data) {
			try{
				data=$.parseJSON(data);
				
				if(data.length>0){
					var datalist=$.tmpl("networkRowTemplate", data).appendTo($(list).empty());
					
					for(var i=0; i<datalist.length; i++) {
						i%2==0?$(datalist[i]).addClass("rowEven"):$(datalist[i]).addClass("rowOdds");
					}
				}else{
					$("<em>"+Locale["network.message.no_data"]+"</em>").appendTo($(list).empty());
				}
				
			}catch(e) {
				printMessage("Data Broken: ["+e+"]");
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			printError(jqXHR, textStatus, errorThrown);
		}
	});
}

function formatIpStatus(status) {
	switch(status) {
		case "approved": return "<span style='color:#65c300;'>"+Locale["network.status.approved"]+"</span>";//ui-icon ui-icon-check smallIcon 
		case "unapproved": return Locale["network.status.unapproved"];
		default: return status;
	}
}

function attachIp(zone, ip, vmid) {
	var pd=showProcessingDialog();
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/NetWorkServlet",
		cache: false,
		data: {
			methodtype: "attachip",
			loginuser: getUsername(),
			password: getPassword(),
			zone: zone,
			ipaddress: ip,
			vmid: vmid
		},
		success: function(data) {
			pd.dialog("destroy");
			try{
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["network.message.done"];break;
					case "loginfirst": msg=Locale["network.message.loginfirst"];break;
					case "trialvm": msg=Locale["network.message.trialvm"];break;
					case "suspended": msg=Locale["network.message.suspended"];break;
					case "waitforapprove": msg=Locale["network.message.waitforapprove"];break;
					case "waitforvmpassword": msg=Locale["network.message.waitforvmpassword"];break;
					case "error": ;
					case "exception": msg=Locale["network.message.error"];break;
					default: msg=Locale["network.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadNetwork();
				
			}catch(e) {
				printMessage("Data Broken: ["+e+"]");
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			pd.dialog("destroy");
			printError(jqXHR, textStatus, errorThrown);
		}
	});
	
}

function unassign(which) {
	var networkIp=$(which).parents(".networkRow").first().find("input[zmlm\\\:item='networkIp']").val();
	var networkAssignedTo=$(which).parents(".networkRow").first().find("input[zmlm\\\:item='networkAssignedTo']").val();
	
	if(!confirm(Locale["network.confirm.unassign"])) return;
	
	var pd=showProcessingDialog();
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/GroupManager",
		cache: false,
		data: {
			methodtype: "assignip",
			loginuser: getUsername(),
			sublogin: networkAssignedTo,
			ip: networkIp,
			status: "false"
		},
		success: function(data) {
			pd.dialog("destroy");
			try{
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["network.message.unassign.done"];break;
					case "error": ;
					case "exception": msg=Locale["network.message.unassign.error"];break;
					default: msg=Locale["network.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadNetwork();
			}catch(e) {
				printMessage("Data Broken: ["+e+"]");
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			pd.dialog("destroy");
			printError(jqXHR, textStatus, errorThrown);
		}
	});
}

function detachIp(which) {
	var zone=$(which).parents(".networkRow").first().find("input[zmlm\\\:item='networkZone']").val();
	var ip=$(which).parents(".networkRow").first().find("input[zmlm\\\:item='networkIp']").val();
	var vmid=$(which).parents(".networkRow").first().find("input[zmlm\\\:item='networkVm']").val();
	
	if(!confirm(Locale["network.confirm.detach"].sprintf(ip))) return;
	
	var pd=showProcessingDialog();
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/NetWorkServlet",
		cache: false,
		data: {
			methodtype: "detachip",
			loginuser: getUsername(),
			zone: zone,
			ip: ip,
			vmid: vmid
		},
		success: function(data) {
			pd.dialog("destroy");
			try{
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["network.message.detach.done"];break;
					case "error": ;
					case "exception": msg=Locale["network.message.detach.error"];break;
					default: msg=Locale["network.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadNetwork();
				
			}catch(e) {
				printMessage("Data Broken: ["+e+"]");
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			pd.dialog("destroy");
			printError(jqXHR, textStatus, errorThrown);
		}
	});
	
}

function releaseIp(which) {
	var zone=$(which).parents(".networkRow").first().find("input[zmlm\\\:item='networkZone']").val();
	var ip=$(which).parents(".networkRow").first().find("input[zmlm\\\:item='networkIp']").val();
	
	if(!confirm(Locale["network.confirm.release"].sprintf(ip))) return;
	
	var pd=showProcessingDialog();
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/NetWorkServlet",
		cache: false,
		data: {
			methodtype: "releaseipaddress",
			loginuser: getUsername(),
			zone: zone,
			ip: ip
		},
		success: function(data) {
			pd.dialog("destroy");
			try{
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["network.message.release.done"];break;
					case "error": ;
					case "exception": msg=Locale["network.message.release.error"];break;
					default: msg=Locale["network.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadNetwork();
				
			}catch(e) {
				printMessage("Data Broken: ["+e+"]");
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			pd.dialog("destroy");
			printError(jqXHR, textStatus, errorThrown);
		}
	});
	
}

function showAttachIpDialog(which) {
	var zone=$(which).parents(".networkRow").first().find("input[zmlm\\\:item='networkZone']").val();
	var ip=$(which).parents(".networkRow").first().find("input[zmlm\\\:item='networkIp']").val();
	
	var vmdialog=$("<div style='white-space:nowrap;text-align:center;'>"
			+Locale["network.dialog.label.attach"]
			+"<select style='min-width:120px;'><option value=''>"+Locale["network.message.loading"]+"</option></select></div>").dialog({
		title: Locale["network.dialog.title.attach"].sprintf(ip),
		autoOpen: true,
		width: 320,
		height: 120,
		resizable: false,
		modal: true,
		buttons: [
			{
				text: Locale["network.dialog.attach"],
				click: function() {
					var vmid=$(this).find("select").val();
					
					if(null==vmid || ""==vmid) {
						printMessage(Locale["network.message.no_vm_attach"]);
					}else {
						attachIp(zone, ip, vmid);
					}
				}
			}, 
			{
				text: Locale["network.dialog.close"],
				click: function() {
					$(this).dialog("destroy");
				}
			}
		]
	});
	
	var list=$(vmdialog).find("select");
	
	loadVm(zone, list);
	
}

function loadVm(zone, container) {
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/InformationRetriverServlet",
		cache: false,
		data: {
			methodtype: "getvmlist",
			loginuser: getUsername()
		},
		success: function(data) {
			container.empty();
			try{
				data=$.parseJSON(data);
				
				for(var i=0; i<data.length; i++) {
					if(data[i].zone==zone) {
						$("<option value='"+data[i].vmuuid+"'>"+data[i].vmname+"</option>").appendTo(container);
					}
				}
				
			}catch(e) {
				printMessage("Data Broken: ["+e+"]");
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			container.empty();
			printError(jqXHR, textStatus, errorThrown);
		}
	});
	
	
}


