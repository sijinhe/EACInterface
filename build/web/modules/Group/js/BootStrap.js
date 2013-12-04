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
	$.template("groupPanelTemplate", Template_GroupPanel);
	$.template("groupRowTemplate", Template_GroupRow);
	$.template("subloginRowTemplate", Template_SubloginRow);
	$.template("assignDialogTemplate", Template_AssignDialog);
	$.template("messageBoxTemplate", Template_MessageBox);
	$.template("newSubloginDialogTemplate", Template_NewSubloginDialog);
	$.template("newGroupDialogTemplate", Template_NewGroupDialog);
}

function setup() {
	$("#mainBody").empty();
	
	var panel=$.tmpl("groupPanelTemplate", [{id:"groupPanel"}]).appendTo("#mainBody");
	
	// set up highlight & selection effect for [task]
	$(panel).delegate(".groupRow", "mouseover", function() {
		$(this).addClass("hover");
	}).delegate(".groupRow", "mouseout", function() {
		$(this).removeClass("hover");
	});
	
	loadGroup();
	loadSublogin();
}

function initUi() {
	// jquery ui init
	$("button").button();
	
	$("#banner").html(Locale["group.banner"]);
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
				text: Locale["group.dialog.close"],
				click: function() {
					$(this).dialog("destroy");
				}
			}
		]
	});
}

function showProcessingDialog() {
	var view=$("<div style='text-align:center;'><img src='css/image/progress.gif'/>"+Locale["group.dialog.processing"]+"</div>").dialog({
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
function listGroup(ui_select) {
	$(ui_select).empty().append("<option value=''>"+Locale["group.message.loading"]+"</option>");
	
	$.ajax({
		type: "GET",
		url: Server+"/RedDragonEnterprise/GroupManager",
		cache: false,
		data: {
			methodtype: "displaygroups",
			loginuser: getUsername()
		},
		success: function(data) {
			try{
				data=$.parseJSON(data);
				
				$(ui_select).empty();
					
				for(var i=0; i<data.length; i++) {
					var groupid=data[i].groupid;
					var groupname=data[i].displayname;
					
					$("<option value='"+groupid+"'>"+groupname+"</option>").appendTo(ui_select);
				}
				
				if(data.length==0) {
					$("<option value=''>"+Locale["group.message.no_data"]+"</option>").appendTo(ui_select);
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

function listVm(ui_select) {
	$(ui_select).empty().append("<option value=''>"+Locale["group.message.loading"]+"</option>");
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/InformationRetriverServlet",
		cache: false,
		data: {
			methodtype: "getvmlist",
			loginuser: getUsername()
		},
		success: function(data) {
			try{
				data=$.parseJSON(data);
				
				$(ui_select).empty();
				
				for(var i=0; i<data.length; i++) {
					var vmid=data[i].vmuuid;
					var vmname=data[i].vmname;
					$("<option value='"+vmid+"'>"+vmname+"</option>").appendTo(ui_select);
				}
				
				if(data.length==0) {
					$("<option value=''>"+Locale["group.message.no_data"]+"</option>").appendTo(ui_select);
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

function listVolume(ui_select) {
	$(ui_select).empty().append("<option value=''>"+Locale["group.message.loading"]+"</option>");
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/InformationRetriverServlet",
		cache: false,
		data: {
			methodtype: "getvolumelist",
			loginuser: getUsername()
		},
		success: function(data) {
			try{
				data=$.parseJSON(data);
				
				$(ui_select).empty();
				
				for(var i=0; i<data.length; i++) {
					var volumeid=data[i].volumeid;
					var volumename=data[i].volumename;
					$("<option value='"+volumeid+"'>"+volumename+"</option>").appendTo(ui_select);
				}
				
				if(data.length==0) {
					$("<option value=''>"+Locale["group.message.no_data"]+"</option>").appendTo(ui_select);
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

function listNetwork(ui_select) {
	$(ui_select).empty().append("<option value=''>"+Locale["group.message.loading"]+"</option>");
	
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
				
				$(ui_select).empty();
				
				for(var i=0; i<data.length; i++) {
					var ip=data[i].ip;
					var status=data[i].ipstatus;
					
					if(status!="unapproved") {
						$("<option value='"+ip+"'>"+ip+"</option>").appendTo(ui_select);
					}
				}
				
				if(data.length==0) {
					$("<option value=''>"+Locale["group.message.no_data"]+"</option>").appendTo(ui_select);
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

function loadGroup() {
	var list=$("#groupPanel").find("span[zmlm\\\:item='groupList']").empty();
	$("<em>"+Locale["group.message.loading"]+"</em>").appendTo(list);
	
	$.ajax({
		type: "GET",
		url: Server+"/RedDragonEnterprise/GroupManager",
		cache: false,
		data: {
			methodtype: "displaygroups",
			loginuser: getUsername()
		},
		success: function(data) {
			try{
				data=$.parseJSON(data);
				
				if(data.length>0){
					var datalist=$.tmpl("groupRowTemplate", data).appendTo($(list).empty());
					
					for(var i=0; i<datalist.length; i++) {
						i%2==0?$(datalist[i]).addClass("rowEven"):$(datalist[i]).addClass("rowOdds");
					}
				}else{
					$("<em>"+Locale["group.message.no_data"]+"</em>").appendTo($(list).empty());
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

function loadSublogin(which) {
	var list=$("#groupPanel").find("span[zmlm\\\:item='subloginList']").empty();
	$("<em>"+Locale["group.message.loading"]+"</em>").appendTo(list);

	var params={methodtype: "displaysublogin", loginuser: getUsername()}; // display all
	var tipsstr="[ "+Locale["sublogin.template.tips.all"]+" ]";
	if(which) { // display by group
		var groupid=$(which).parents(".groupRow").first().find("input[zmlm\\\:item='groupid']").val();
		var displayname=$(which).parents(".groupRow").first().find("input[zmlm\\\:item='displayname']").val();
		params={methodtype: "displaysublogin", groupid: groupid};

		tipsstr="[ "+displayname+" ]";
	}
	$("#groupPanel").find("[name='sublogintitle']").html(tipsstr);
		
	$.ajax({
		type: "GET",
		url: Server+"/RedDragonEnterprise/GroupManager",
		cache: false,
		data: params,
		success: function(data) {
			try{
				data=$.parseJSON(data);
				
				if(data.length>0){
					var datalist=$.tmpl("subloginRowTemplate", data).appendTo($(list).empty());
					
					for(var i=0; i<datalist.length; i++) {
						i%2==0?$(datalist[i]).addClass("rowEven"):$(datalist[i]).addClass("rowOdds");
					}
				}else{
					$("<em>"+Locale["sublogin.message.no_data"]+"</em>").appendTo($(list).empty());
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

function removeGroup(which) {
	var groupid=$(which).parents(".groupRow").first().find("input[zmlm\\\:item='groupid']").val();
	var displayname=$(which).parents(".groupRow").first().find("input[zmlm\\\:item='displayname']").val();
	
	if(!confirm(Locale["group.confirm.group.remove"].sprintf(displayname))) return;
	
	var pd=showProcessingDialog();
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/GroupManager",
		cache: false,
		data: {
			methodtype: "deletegroup",
			loginuser: getUsername(),
			groupid: groupid
		},
		success: function(data) {
			pd.dialog("destroy");
			try{
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["group.message.remove.group.done"];break;
					case "error": ;
					case "exception": msg=Locale["group.message.remove.group.error"];break;
					case "notempty": msg=Locale["group.message.remove.group.notempty"];break;
					default: msg=Locale["group.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadGroup();
				loadSublogin();
				
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

function removeSublogin(which) {
	var subloginname=$(which).parents(".subloginRow").first().find("input[zmlm\\\:item='subloginname']").val();
	
	if(!confirm(Locale["group.confirm.sublogin.remove"].sprintf(subloginname))) return;
	
	var pd=showProcessingDialog();
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/GroupManager",
		cache: false,
		data: {
			methodtype: "deletesublogin",
			loginuser: getUsername(),
			sublogin: subloginname
		},
		success: function(data) {
			pd.dialog("destroy");
			try{
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["group.message.remove.sublogin.done"];break;
					case "error": ;
					case "exception": msg=Locale["group.message.remove.sublogin.error"];break;
					default: msg=Locale["group.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadSublogin();
				
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

function detachGroup(which) {
	var subloginname=$(which).parents(".subloginRow").first().find("input[zmlm\\\:item='subloginname']").val();
	var groupname=$(which).parents(".subloginRow").first().find("input[zmlm\\\:item='groupname']").val();
	
	if(!confirm(Locale["group.confirm.sublogin.detach"].sprintf(groupname))) return;
	
	var pd=showProcessingDialog();
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/GroupManager",
		cache: false,
		data: {
			methodtype: "assigngroup",
			loginuser: getUsername(),
			sublogin: subloginname
		},
		success: function(data) {
			pd.dialog("destroy");
			try{
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["group.message.sublogin.detach.done"];break;
					case "error": ;
					case "exception": msg=Locale["group.message.sublogin.detach.error"];break;
					default: msg=Locale["group.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadSublogin();
				
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

function showAssignGroupDialog(which) {
	var sublogin=$(which).parents(".subloginRow").first().find("input[zmlm\\\:item='subloginname']").val();
	
	var detaildialog=$("<div name='content' style='white-space:nowrap;text-align:center;'>"+"</div>").dialog({
		title: Locale["group.dialog.title.assign.group"].sprintf("<span style='display:inline-block;color:blue;padding:5px;max-width:100px;' class='textCollapse'>%s</span>".sprintf(sublogin)),
		autoOpen: true,
		width: 320,
		height: 120,
		resizable: false,
		modal: true,
		buttons: [
			{
				text: Locale["group.dialog.apply"],
				click: function() {
					requestAssignGroup(sublogin, this);
				}
			}, 
			{
				text: Locale["group.dialog.close"],
				click: function() {
					$(this).dialog("destroy");
				}
			}
		]
	});
	
	var assignPanel=$.tmpl("assignDialogTemplate").appendTo(detaildialog);

	listGroup($(detaildialog).find("select[name='list']"));
}

function showAssignInstanceDialog(which) {
	var sublogin=$(which).parents(".subloginRow").first().find("input[zmlm\\\:item='subloginname']").val();
	
	var detaildialog=$("<div name='content' style='white-space:nowrap;text-align:center;'>"+"</div>").dialog({
		title: Locale["group.dialog.title.assign.instance"].sprintf("<span style='display:inline-block;color:blue;padding:5px;max-width:100px;' class='textCollapse'>%s</span>".sprintf(sublogin)),
		autoOpen: true,
		width: 320,
		height: 120,
		resizable: false,
		modal: true,
		buttons: [
			{
				text: Locale["group.dialog.apply"],
				click: function() {
					requestAssignInstance(sublogin, this);
				}
			}, 
			{
				text: Locale["group.dialog.close"],
				click: function() {
					$(this).dialog("destroy");
				}
			}
		]
	});
	
	var assignPanel=$.tmpl("assignDialogTemplate").appendTo(detaildialog);

	listVm($(detaildialog).find("select[name='list']"));
}

function showAssignNetworkDialog(which) {
	var sublogin=$(which).parents(".subloginRow").first().find("input[zmlm\\\:item='subloginname']").val();
	
	var detaildialog=$("<div name='content' style='white-space:nowrap;text-align:center;'>"+"</div>").dialog({
		title: Locale["group.dialog.title.assign.network"].sprintf("<span style='display:inline-block;color:blue;padding:5px;max-width:100px;' class='textCollapse'>%s</span>".sprintf(sublogin)),
		autoOpen: true,
		width: 320,
		height: 120,
		resizable: false,
		modal: true,
		buttons: [
			{
				text: Locale["group.dialog.apply"],
				click: function() {
					requestAssignNetwork(sublogin, this);
				}
			}, 
			{
				text: Locale["group.dialog.close"],
				click: function() {
					$(this).dialog("destroy");
				}
			}
		]
	});
	
	var assignPanel=$.tmpl("assignDialogTemplate").appendTo(detaildialog);

	listNetwork($(detaildialog).find("select[name='list']"));
}


function showAssignVolumeDialog(which) {
	var sublogin=$(which).parents(".subloginRow").first().find("input[zmlm\\\:item='subloginname']").val();
	
	var detaildialog=$("<div name='content' style='white-space:nowrap;text-align:center;'>"+"</div>").dialog({
		title: Locale["group.dialog.title.assign.volume"].sprintf("<span style='display:inline-block;color:blue;padding:5px;max-width:100px;' class='textCollapse'>%s</span>".sprintf(sublogin)),
		autoOpen: true,
		width: 320,
		height: 120,
		resizable: false,
		modal: true,
		buttons: [
			{
				text: Locale["group.dialog.apply"],
				click: function() {
					requestAssignVolume(sublogin, this);
				}
			}, 
			{
				text: Locale["group.dialog.close"],
				click: function() {
					$(this).dialog("destroy");
				}
			}
		]
	});
	
	var assignPanel=$.tmpl("assignDialogTemplate").appendTo(detaildialog);

	listVolume($(detaildialog).find("select[name='list']"));
}



function showNewSubloginDialog() {
	$.tmpl("newSubloginDialogTemplate", {id:"newSubloginDialog"}).dialog({
		title: Locale["group.dialog.title.new.sublogin"],
		autoOpen: true,
		width: 320,
		resizable: false,
		modal: true,
		buttons: [
			{
				text: Locale["group.dialog.create"],
				click: function() {
					var username=$(this).find("input[name='username']").val();
					var password=$(this).find("input[name='password']").val();
					var email=$(this).find("input[name='email']").val();
					
					requestNewSublogin(username, password, email, this);
				}
			}, 
			{
				text: Locale["group.dialog.close"],
				click: function() {
					$(this).dialog("destroy");
				}
			}
		]
	});
}

function showNewGroupDialog() {
	$.tmpl("newGroupDialogTemplate", {id:"newGroupDialog"}).dialog({
		title: Locale["group.dialog.title.new.group"],
		autoOpen: true,
		width: 320,
		resizable: false,
		modal: true,
		buttons: [
			{
				text: Locale["group.dialog.create"],
				click: function() {
					var groupname=$(this).find("input[name='groupname']").val();
					var groupdesc=$(this).find("input[name='groupdesc']").val();
					
					requestNewGroup(groupname, groupdesc, this);
				}
			},
			{
				text: Locale["group.dialog.close"],
				click: function() {
					$(this).dialog("destroy");
				}
			}
		]
	});
}

function requestAssignGroup(sublogin, dialog) {
	var groupid=$(dialog).find("select[name='list']").val();
	
	if(""==groupid) {
		printMessage(Locale["group.message.group.assign.illegal"]);
		return;
	}
	
	if(!confirm(Locale["group.confirm.group.assign"].sprintf(sublogin))) return;
	
	var pd=showProcessingDialog();
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/GroupManager",
		cache: false,
		data: {
			methodtype: "assigngroup",
			loginuser: getUsername(),
			sublogin: sublogin,
			groupid: groupid
		},
		success: function(data) {
			pd.dialog("destroy");
			try{
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["group.message.sublogin.attach.done"];$(dialog).dialog("destroy");break;
					case "error": ;
					case "exception": msg=Locale["group.message.sublogin.attach.error"];break;
					default: msg=Locale["group.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadGroup();
				loadSublogin();
				
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

function requestAssignInstance(sublogin, dialog) {
	var vmid=$(dialog).find("select[name='list']").val();
	
	if(""==vmid) {
		printMessage(Locale["group.message.inst.assign.illegal"]);
		return;
	}
	
	if(!confirm(Locale["group.confirm.inst.assign"])) return;
	
	var pd=showProcessingDialog();
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/GroupManager",
		cache: false,
		data: {
			methodtype: "assignvm",
			loginuser: getUsername(),
			sublogin: sublogin,
			vmid: vmid,
			status: "true"
		},
		success: function(data) {
			pd.dialog("destroy");
			try{
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["group.message.sublogin.instance.done"];$(dialog).dialog("destroy");break;
					case "error": ;
					case "exception": msg=Locale["group.message.sublogin.instance.error"];break;
					default: msg=Locale["group.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadGroup();
				loadSublogin();
				
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

function requestAssignNetwork(sublogin, dialog) {
	var ip=$(dialog).find("select[name='list']").val();
	
	if(""==ip) {
		printMessage(Locale["group.message.network.assign.illegal"]);
		return;
	}
	
	if(!confirm(Locale["group.confirm.network.assign"])) return;
	
	var pd=showProcessingDialog();
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/GroupManager",
		cache: false,
		data: {
			methodtype: "assignip",
			loginuser: getUsername(),
			sublogin: sublogin,
			ip: ip,
			status: "true"
		},
		success: function(data) {
			pd.dialog("destroy");
			try{
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["group.message.sublogin.network.done"];$(dialog).dialog("destroy");break;
					case "error": ;
					case "exception": msg=Locale["group.message.sublogin.network.error"];break;
					default: msg=Locale["group.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadGroup();
				loadSublogin();
				
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

function requestAssignVolume(sublogin, dialog) {
	var volumeid=$(dialog).find("select[name='list']").val();
	
	if(""==volumeid) {
		printMessage(Locale["group.message.volume.assign.illegal"]);
		return;
	}
	
	if(!confirm(Locale["group.confirm.volume.assign"])) return;
	
	var pd=showProcessingDialog();
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/GroupManager",
		cache: false,
		data: {
			methodtype: "assignvolume",
			loginuser: getUsername(),
			sublogin: sublogin,
			volumeid: volumeid,
			status: "true"
		},
		success: function(data) {
			pd.dialog("destroy");
			try{
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["group.message.sublogin.volume.done"];$(dialog).dialog("destroy");break;
					case "error": ;
					case "exception": msg=Locale["group.message.sublogin.volume.error"];break;
					default: msg=Locale["group.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadGroup();
				loadSublogin();
				
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

function requestNewSublogin(username, password, email, ui) {
	if($.trim(username)=="" || $.trim(password)=="") {
		printMessage(Locale["group.message.new.sublogin.empty"]);
		return;
	}
	
	username=$.trim(username);
	
	var pd=showProcessingDialog();
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/GroupManager",
		cache: false,
		data: {
			methodtype: "createsublogin",
			loginuser: getUsername(),
			sublogin: username,
			password: password,
			email: email
		},
		success: function(data) {
			try{
				pd.dialog("destroy");
				
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["group.message.new.sublogin.done"];$(ui).dialog("destroy");break;
					case "error": ;
					case "exception": msg=Locale["group.message.new.sublogin.error"];break;
					default: msg=Locale["group.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadSublogin();
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

function requestNewGroup(groupname, groupdesc, ui) {
	if($.trim(groupname)=="") {
		printMessage(Locale["group.message.new.group.empty"]);
		return;
	}
	
	groupname=$.trim(groupname);
	
	var pd=showProcessingDialog();
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/GroupManager",
		cache: false,
		data: {
			methodtype: "creategroup",
			loginuser: getUsername(),
			displayname: groupname,
			notes: groupdesc,
		},
		success: function(data) {
			try{
				pd.dialog("destroy");
				
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["group.message.new.group.done"];$(ui).dialog("destroy");break;
					case "error": ;
					case "exception": msg=Locale["group.message.new.group.error"];break;
					default: msg=Locale["group.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadGroup();
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

function formatDate(time) {
	return new Date(time).toDateString();
}


