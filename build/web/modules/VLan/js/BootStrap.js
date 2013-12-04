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
	$.template("vlanPanelTemplate", Template_VlanPanel);
	$.template("vlanRowTemplate", Template_VlanRow);
	$.template("messageBoxTemplate", Template_MessageBox);
	$.template("newVlanDialogTemplate", Template_NewVlanDialog);
}

function setup() {
	$("#mainBody").empty();
	
	var panel=$.tmpl("vlanPanelTemplate", [{id:"vlanPanel"}]).appendTo("#mainBody");
	
	// set up highlight & selection effect for [task]
	$(panel).delegate(".vlanRow", "mouseover", function() {
		$(this).addClass("hover");
	}).delegate(".vlanRow", "mouseout", function() {
		$(this).removeClass("hover");
	});
	
	loadVlan();
}

function initUi() {
	// jquery ui init
	$("button").button();
	
	$("#banner").html(Locale["vlan.banner"]);
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
				text: Locale["vlan.dialog.close"],
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
function loadVlan() {
	var list=$("#vlanPanel").find("span[zmlm\\\:item='vlanList']").empty();
	$("<em>"+Locale["vlan.message.loading"]+"</em>").appendTo(list);
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/VLANManager",
		cache: false,
		data: {
			methodtype: "fetchvlans",
			loginuser: getUsername()
		},
		success: function(data) {
			try{
				data=$.parseJSON(data);
				
				if(data.length>0){
					var datalist=$.tmpl("vlanRowTemplate", data).appendTo($(list).empty());
					
					for(var i=0; i<datalist.length; i++) {
						i%2==0?$(datalist[i]).addClass("rowEven"):$(datalist[i]).addClass("rowOdds");
					}
				}else{
					$("<em>"+Locale["vlan.message.no_data"]+"</em>").appendTo($(list).empty());
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

function removeVlan(which) {
	var vlanid=$(which).parents(".vlanRow").first().find("input[zmlm\\\:item='vlanid']").val();
	var vlanname=$(which).parents(".vlanRow").first().find("input[zmlm\\\:item='vlanname']").val();
	var vlanzone=$(which).parents(".vlanRow").first().find("input[zmlm\\\:item='vlanzone']").val();
	
	if(!confirm(Locale["vlan.confirm.remove"].sprintf(vlanname))) return;
	
	var pd=showProcessingDialog();
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/VLANManager",
		cache: false,
		data: {
			methodtype: "removevlan",
			loginuser: getUsername(),
			vlanname: vlanname,
			zone: vlanzone,
			vlanid: vlanid
		},
		success: function(data) {
			pd.dialog("destroy");
			try{
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["vlan.message.remove.done"];break;
					case "error": ;
					case "failtodelete": ;
					case "exception": msg=Locale["vlan.message.remove.error"];break;
					default: msg=Locale["vlan.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				
				loadVlan();
				
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

function requestNewVlan(vlanzone, vlanname, vms, ui) {
	if(""==$.trim(vlanname) || null==vlanzone || ""==$.trim(vlanzone)) {
		printMessage(Locale["vlan.message.please.fill.vlaninfo"]);
		return;
	}
	
	if(null==vms || vms.length<2) {
		printMessage(Locale["vlan.message.at.least.two.vm"]);
		return;
	}
	
	if(!confirm(Locale["vlan.confirm.create"].sprintf(vlanname))) return;
	
	
	var pd=showProcessingDialog();
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/VLANManager",
		cache: false,
		data: {
			methodtype: "addvlan",
			loginuser: getUsername(),
			vlanname: vlanname,
			zone: vlanzone,
			vmlist: vms.join(",")
		},
		success: function(data) {
			pd.dialog("destroy");
			try{
				data=$.parseJSON(data);
				
				var msg="";
				switch(data.status) {
					case "done": msg=Locale["vlan.message.create.done"];break;
					case "error": ;
					case "exception": msg=Locale["vlan.message.create.error"];break;
					default: msg=Locale["vlan.message.undefined"].sprintf(data.status);
				}
				
				printMessage(msg);
				$(ui).dialog("destroy");
				
				loadVlan();
				
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

function showNewVlanDialog() {
	var dialog=$.tmpl("newVlanDialogTemplate").dialog({
		title: Locale["vlan.dialog.title.create"],
		autoOpen: true,
		width: 520,
		height: 470,
		resizable: false,
		modal: true,
		buttons: [
			{
				text: Locale["vlan.dialog.create"],
				click: function() {
					var vlanname=$(this).find("input[name='vlanname']").val();
					var vlanzone=$(this).find("select[name='vlanzone']").val();
					var vms=$(this).find("select[name='rList']").val();
					
					requestNewVlan(vlanzone, vlanname, vms, this);
				}
			}, 
			{
				text: Locale["vlan.dialog.close"],
				click: function() {
					$(this).dialog("destroy");
				}
			}
		]
	});
	
	$(dialog).find("button[name='l2r']").unbind("click").bind("click", function(){
		var lList=$(dialog).find("select[name='lList']");
		var rList=$(dialog).find("select[name='rList']");
		var selected=$(lList).children(":selected");
		
		$(selected).remove();
		$(rList).append(selected);
	});
	
	$(dialog).find("button[name='r2l']").unbind("click").bind("click", function(){
		var lList=$(dialog).find("select[name='lList']");
		var rList=$(dialog).find("select[name='rList']");
		var selected=$(rList).children(":selected");
		
		$(selected).remove();
		$(lList).append(selected);
		
	});
	
	loadZoneAndVm(dialog);
	
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

function loadZoneAndVm(ui) {
	
	var zonelist=$(ui).find("select[name='vlanzone']");
	zonelist.empty().append("<option>"+Locale["vlan.message.loading"]+"</option>");
	
	$.ajax({
		type: "POST",
		url: Server+"/RedDragonEnterprise/InformationRetriverServlet",
		cache: false,
		data: {
			methodtype: "getzonelist",
		},
		success: function(data) {
			$(zonelist).empty();
			try{
				data=$.parseJSON(data);
				
				for(var i=0; i<data.length; i++) {
					$("<option value='"+data[i].zone+"'>"+data[i].zonename+"</option>").appendTo(zonelist);
				}
	
				$(zonelist).unbind("change").bind("change", function() {
					var lList=$(ui).find("select[name='lList']");
					var rList=$(ui).find("select[name='rList']");
					var zone=$(zonelist).val();
					
					$(lList).empty();
					$(rList).empty();
					
					loadVm(zone, lList);
					
				}).triggerHandler("change");
				
			}catch(e) {
				printMessage("Data Broken: ["+e+"]");
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$(zonelist).empty();
			printError(jqXHR, textStatus, errorThrown);
		}
	});
	
}


