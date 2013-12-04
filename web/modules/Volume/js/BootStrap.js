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
	$.template("volumePanelTemplate", Template_VolumePanel);
	$.template("volumeRowTemplate", Template_VolumekRow);
	$.template("messageBoxTemplate", Template_MessageBox);
}

function setup() {
	$("#mainBody").empty();
	
	var panel=$.tmpl("volumePanelTemplate", [{id:"volumePanel"}]).appendTo("#mainBody");
	
	// set up highlight & selection effect for [task]
	$(panel).delegate(".volumeRow", "mouseover", function() {
		$(this).addClass("hover");
	}).delegate(".volumeRow", "mouseout", function() {
		$(this).removeClass("hover");
	});
	
	loadVolume();
}

function initUi() {
	// jquery ui init
	$("button").button();
	
	$("#banner").html(Locale["volume.banner"]);
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
				text: Locale["volume.dialog.close"],
				click: function() {
					$(this).dialog("destroy");
				}
			}
		]
	});
}

function showProcessingDialog() {
	var view=$("<div style='text-align:center;'><img src='css/image/progress.gif'/>"+Locale["volume.dialog.processing"]+"</div>").dialog({
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
function loadVolume() {
	var list=$("#volumePanel").find("span[zmlm\\\:item='volumeList']").empty();
	$("<em>"+Locale["volume.message.loading"]+"</em>").appendTo(list);
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/StorageCtrlSevlet",
		cache: false,
		data: {
			methodtype: "fetchvolumes",
			loginuser: getUsername(),
			password: getPassword()
		},
		success: function(data) {
			try{
				data=$.parseJSON(data);
				
				if(data.length>0){
					var datalist=$.tmpl("volumeRowTemplate", data).appendTo($(list).empty());
					
					for(var i=0; i<datalist.length; i++) {
						i%2==0?$(datalist[i]).addClass("rowEven"):$(datalist[i]).addClass("rowOdds");
					}
				}else{
					$("<em>"+Locale["volume.message.no_data"]+"</em>").appendTo($(list).empty());
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

function unassign(which) {
	var volumeId=$(which).parents(".volumeRow").first().find("input[zmlm\\\:item='volumeId']").val();
	var volumeAssignedTo=$(which).parents(".volumeRow").first().find("input[zmlm\\\:item='volumeAssignedTo']").val();
	
	if(!confirm(Locale["volume.confirm.unassign"])) return;
	
	var pd=showProcessingDialog();
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/GroupManager",
		cache: false,
		data: {
			methodtype: "assignvolume",
			loginuser: getUsername(),
			sublogin: volumeAssignedTo,
			volumeid: volumeId,
			status: "false"
		},
		success: function(data) {
			pd.dialog("destroy");
			try{
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["volume.message.unassign.done"];break;
					case "error": ;
					case "exception": msg=Locale["volume.message.unassign.error"];break;
					default: msg=Locale["volume.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadVolume();
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

function attachVolume(zone, volumeid, vmid) {
	var pd=showProcessingDialog();
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/StorageCtrlSevlet",
		cache: false,
		data: {
			methodtype: "attachvolume",
			loginuser: getUsername(),
			password: getPassword(),
			zone: zone,
			volumeid: volumeid,
			vmid: vmid
		},
		success: function(data) {
			pd.dialog("destroy");
			try{
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["volume.message.done"];break;
					case "loginfirst": msg=Locale["volume.message.loginfirst"];break;
					case "trialvm": msg=Locale["volume.message.trialvm"];break;
					case "shutdownvm": msg=Locale["volume.message.shutdownvm"];break;
					case "error": ;
					case "exception": msg=Locale["volume.message.attach.error"];break;
					default: msg=Locale["volume.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadVolume();
				
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

function detachVolume(which) {
	var zone=$(which).parents(".volumeRow").first().find("input[zmlm\\\:item='volumeZone']").val();
	var volumeid=$(which).parents(".volumeRow").first().find("input[zmlm\\\:item='volumeId']").val();
	var vmid=$(which).parents(".volumeRow").first().find("input[zmlm\\\:item='volumeVm']").val();
	var targetdrive=$(which).parents(".volumeRow").first().find("input[zmlm\\\:item='volumeDrive']").val();
	var volumename=$(which).parents(".volumeRow").first().find("input[zmlm\\\:item='volumeName']").val();
	
	if(!confirm(Locale["volume.confirm.detach"].sprintf(volumename))) return;
	
	var pd=showProcessingDialog();
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/StorageCtrlSevlet",
		cache: false,
		data: {
			methodtype: "detachvolume",
			loginuser: getUsername(),
			password: getPassword(),
			zone: zone,
			volumeid: volumeid,
			targetdrive: targetdrive,
			vmid: vmid
		},
		success: function(data) {
			pd.dialog("destroy");
			try{
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["volume.message.detach.done"];break;
					case "loginfirst": msg=Locale["volume.message.loginfirst"];break;
					case "shutdownvm": msg=Locale["volume.message.shutdownvm"];break;
					case "detacherror": ;
					case "error": ;
					case "deleteerror": ;
					case "reordererror": ;
					case "exception": msg=Locale["volume.message.detach.error"];break;
					default: msg=Locale["volume.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadVolume();
				
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

function removeVolume(which) {
	var zone=$(which).parents(".volumeRow").first().find("input[zmlm\\\:item='volumeZone']").val();
	var volumeid=$(which).parents(".volumeRow").first().find("input[zmlm\\\:item='volumeId']").val();
	var vmid=$(which).parents(".volumeRow").first().find("input[zmlm\\\:item='volumeVm']").val();
	var targetdrive=$(which).parents(".volumeRow").first().find("input[zmlm\\\:item='volumeDrive']").val();
	var volumename=$(which).parents(".volumeRow").first().find("input[zmlm\\\:item='volumeName']").val();
	
	if(!confirm(Locale["volume.confirm.remove"].sprintf(volumename))) return;
	
	var pd=showProcessingDialog();
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/StorageCtrlSevlet",
		cache: false,
		data: {
			methodtype: "removevolume",
			loginuser: getUsername(),
			password: getPassword(),
			zone: zone,
			volumeid: volumeid,
			vmid: vmid,
			targetdrive: targetdrive
		},
		success: function(data) {
			pd.dialog("destroy");
			try{
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["volume.message.remove.done"];break;
					case "loginfirst": msg=Locale["volume.message.loginfirst"];break;
					case "shutdownvm": msg=Locale["volume.message.shutdownvm"];break;
					case "backupjobexists ": msg=Locale["volume.message.backupjobexists"];break;
					case "detacherror": ;
					case "error": ;
					case "deleteerror": ;
					case "reordererror": ;
					case "exception": msg=Locale["volume.message.remove.error"];break;
					default: msg=Locale["volume.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadVolume();
				
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

function showAttachVolumeDialog(which) {
	var zone=$(which).parents(".volumeRow").first().find("input[zmlm\\\:item='volumeZone']").val();
	var volumeid=$(which).parents(".volumeRow").first().find("input[zmlm\\\:item='volumeId']").val();
	var vmid=$(which).parents(".volumeRow").first().find("input[zmlm\\\:item='volumeVm']").val();
	var volumename=$(which).parents(".volumeRow").first().find("input[zmlm\\\:item='volumeName']").val();
	
	var vmdialog=$("<div style='white-space:nowrap;text-align:center;'>"
			+Locale["volume.dialog.label.attach"]
			+"<select style='min-width:120px;'><option value=''>"+Locale["volume.message.loading"]+"</option></select></div>").dialog({
		title: Locale["volume.dialog.title.attach"].sprintf(volumename),
		autoOpen: true,
		width: 320,
		height: 120,
		resizable: false,
		modal: true,
		buttons: [
			{
				text: Locale["volume.dialog.attach"],
				click: function() {
					var vmid=$(this).find("select").val();
					
					if(null==vmid || ""==vmid) {
						printMessage(Locale["volume.message.no_vm_attach"]);
					}else {
						attachVolume(zone, volumeid, vmid);
					}
				}
			}, 
			{
				text: Locale["volume.dialog.close"],
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

function formatVolumetype(volumetype) {
	if(volumetype.toLowerCase().match("win")) {
		return "<img style='width:16px;margin-right:4px;' src='css/image/windows.png'/>"+volumetype;
	}else if(volumetype.toLowerCase().match("linux|centos|ubunto|debian")){
		return "<img style='width:16px;margin-right:4px;' src='css/image/linux.png'/>"+volumetype;
	}else {
		return "<span class='ui-icon ui-icon-help' style='float:left; margin:0 4px 0 0;'></span>"+volumetype;
	}
}



