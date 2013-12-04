// JavaScript Document
// Author: Bill, 2011

var _DEBUG_=false;

$(function(){
	registerTemplate();
	
	setup();
	
	initAjax();
	
	initUi();
	
	dispatch();
});

function dispatch() {	
	var action=getURLParameter("action");
	if("instance"==action) {
    	loadInstancePage();
	}else{
    	loadApplyPage();
	}
}

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

function registerTemplate() {
	$.template("theAppTemplate", Template_TheAppTempPanel);
	$.template("softwareItemTemplate", Template_SoftwareItem);
	$.template("messageBoxTemplate", Template_MessageBox);
	$.template("applyTempTabsTemplate", Template_ApplyTempTabs);
	$.template("appReqRowTemplate", Template_AppReqRow);
	$.template("zoneGroupTemplate", Template_ZoneGroup);
	$.template("applyTempRowTemplate", Template_ApplyTempRow);
	$.template("applyConfRowTemplate", Template_ApplyConfRow);
	$.template("appInstRowTemplate", Template_AppInstRow);
	$.template("appInstPageTemplate", Template_AppInstPage);	
}

function setup() {
	$("#appTempBody").empty();
	
	$("#banner").html(Locale["bedivere.banner"]);
	
	$("<div id=\"mainFrame\"></div>").appendTo("#appTempBody");	
	$("#mainFrame").css("top", "0");
	
	// new app template panel
	var newAppTempPanel=$.tmpl("theAppTemplate", [{id:"newAppTempDialog"}]).appendTo("#appTempBody");
	
	$(newAppTempPanel).delegate(".listItem", "click", function(){
		$(this).toggleClass("select");
	}).delegate(".listItem", "hover", function(){
		$(this).toggleClass("hover");
	});
	
	$(newAppTempPanel).dialog({
		title: "<span class=\"ui-icon ui-icon-circle-plus smallIcon\"></span>"+Locale["bedivere.dialog.title.new.template"],
		modal:true,
		autoOpen:false,
		resizable: false,
		show: "slide",
		hide: "slide",
		width: "640px",
		buttons: [
			{
				text: Locale["bedivere.dialog.confirm"],
				click: function() {
					var appTempZone=$("#zone").val();	
					var appTempName=$.trim($(this).find("[zmlm\\\:item='appTempName']").val());
					var appTempDesc=$(this).find("[zmlm\\\:item='appTempDesc']").val();
					var appTempNotes=$(this).find("[zmlm\\\:item='appTempNotes']").val();
					
					if(""==appTempName){
						printMessage(Locale["bedivere.message.name.empty"]);
					}else {				
						var softwares=new Array();
						$(this).find(".listPanel").children(".select").each(function(){
							var id=$($(this).data("data")).children("id").text();
							softwares.push(id);
						});
						
						var appTempSoft=softwares.join(",");
										
						commitAppTemp(appTempName, appTempDesc, appTempNotes, appTempZone, appTempSoft);
						
						$(this).dialog("close");
					}				
				}
			},
			{
				text: Locale["bedivere.dialog.cancel"],
				click: function() {
					$(this).dialog("close");
				}
			}
		]
	});
	
	// update app template panel
	var updateAppTempPanel=$.tmpl("theAppTemplate", [{id:"updateAppTempDialog"}]).appendTo("#appTempBody");
	
	$(updateAppTempPanel).delegate(".listItem", "click", function(){
		$(this).toggleClass("select");
	}).delegate(".listItem", "hover", function(){
		$(this).toggleClass("hover");
	});
	
	$(updateAppTempPanel).dialog({
		title: "<span class=\"ui-icon ui-icon-circle-plus smallIcon\"></span>"+Locale["bedivere.dialog.title.modify.template"],
		modal:true,
		autoOpen:false,
		resizable: false,
		show: "slide",
		hide: "slide",
		width: "640px",
		buttons: [
			{
				text: Locale["bedivere.dialog.confirm"],
				click: function() {
					var appTempId=$.trim($(this).find("[zmlm\\\:item='appTempId']").val());
					var appTempName=$.trim($(this).find("[zmlm\\\:item='appTempName']").val());
					var appTempDesc=$(this).find("[zmlm\\\:item='appTempDesc']").val();
					var appTempNotes=$(this).find("[zmlm\\\:item='appTempNotes']").val();
					var appTempZone=$(this).find("[zmlm\\\:item='appTempZone']").val();
					
					if(""==appTempName){
						printMessage(Locale["bedivere.message.name.empty"]);
					}else {				
						var softwares=new Array();
						$(this).find(".listPanel").children(".select").each(function(){
							var id=$($(this).data("data")).children("id").text();
							softwares.push(id);
						});
						
						var appTempSoft=softwares.join(",");
										
						updateAppTemp(appTempId, appTempName, appTempDesc, appTempNotes, appTempZone, appTempSoft);
						
						$(this).dialog("close");
					}				
				}
			},
			{
				text: Locale["bedivere.dialog.cancel"],
				click: function() {
					$(this).dialog("close");
				}
			}
		]
	});
}

function cancelRequest(requestId) {
	var login=getUsername();
	
	if(confirm(Locale["bedivere.confirm.cancel.request"])) {		
		$.ajax({
			type: "GET",
			url: Server+"/RedDragonEnterprise/AppTemplateManager",
			cache: false,
			data: {
				operation: "deleteapptemplaterequest",
				login: login,
				requestid: requestId
			}, 
			success: function(data) {
				if(data.match("true")) {
					printMessage(Locale["bedivere.message.cancel.request.done"]);
				}else if(data.match("false")){
					printMessage(Locale["bedivere.message.cancel.request.false"]);
				}else{
					printMessage(Locale["bedivere.message.undefined"].sprintf(data));
				}
				
				getAppTempReq($("#applyTempTabs").children("#tab-appreqlist").find("[zmlm\\\:item='appReqList']"), getUsername());
				
			},
			error: function(jqXHR, textStatus, errorThrown) {
				printError(jqXHR, textStatus, errorThrown);
			}
		});
	}
}

function applyRequest(formId) {
	var isSftconfigureOk=true;
	var isApptemplateidOk=true;
	var isDateOk=true;
	var isApplyNameOk=true;
	
	var zone=$(formId).find("#zone").val();
	var login=getUsername();
	
	var apptemplateid=$(formId).find("[zmlm\\\:item='tempList']").children(".select").find("[zmlm\\\:item='apptemplateid']").val();
	
	if(null==apptemplateid || ""==apptemplateid) isApptemplateidOk=false; // validation
	
	var sftconfigure=new Array();
	$(formId).find("[zmlm\\\:item='confList']").children(".appConfRow").each(function(){
		var softwareid=$(this).find("[zmlm\\\:item='softwareid']").val();		
		var sftresourceid=$(this).find(".appConfRowContent").children(".select").find("[zmlm\\\:item='sftresourceid']").val();
		
		if(null==sftresourceid || ""==sftresourceid) isSftconfigureOk=false; // validation
		
		sftconfigure.push([softwareid, sftresourceid].join(":"));
	});
	sftconfigure=sftconfigure.join(",");
	
	
	var applyname=$.trim($(formId).find("[zmlm\\\:item='applyName']").val());
	var applystart=$(formId).find("[zmlm\\\:item='applyStart']").val();
	var applyend=$(formId).find("[zmlm\\\:item='applyEnd']").val();
	
	try{
		applystart=new Date(applystart).getTime();
		applyend=new Date(applyend).getTime();
		
		if(!applystart || !applyend) isDateOk=false;
	}catch(e){
		isDateOk=false;
	}
	
	if(null==applyname || ""==applyname || !applyname.match("^[a-zA-Z_][a-zA-Z0-9_]{3,7}$")) isApplyNameOk=false; // validation
	
	if(!isApplyNameOk) {
		printMessage(Locale["bedivere.message.apply.request.illegal.name"]);
	}else if(!isDateOk) {
		printMessage(Locale["bedivere.message.apply.request.illegal.date"]);		
	}else if(!isSftconfigureOk || !isApptemplateidOk) {
		printMessage(Locale["bedivere.message.apply.request.illegal.conf"]);
	}else if(confirm(Locale["bedivere.confirm.submit.request"])){			
		// commit
		commitApplyRequest(login, apptemplateid, sftconfigure, applyname, applystart, applyend);
	}
	
	//alert("zone="+zone+", login="+login+", apptemplateid="+apptemplateid+", sftconfigure="+sftconfigure);
}

function commitApplyRequest(login, apptemplateid, sftconfigure, name, starttime, endtime) {
	$.ajax({
		type: "GET",
		url: Server+"/RedDragonEnterprise/AppTemplateManager",
		cache: false,
		data: {
			operation: "requesttemplateinstance",
			login: login,
			apptemplateid: apptemplateid,
			sftconfigure: sftconfigure,
			name: name,
			starttime: starttime,
			endtime: endtime
		}, 
		success: function(data) {
			if(data.match("true")) {
				printMessage(Locale["bedivere.message.submit.true"]);
			}else if(data.match("false")){
				printMessage(Locale["bedivere.message.submit.false"]);				
			}else if(data.match("name exists")) {
				printMessage(Locale["bedivere.message.submit.exists"]);
			}else{
				printMessage(Locale["bedivere.message.undefined"].sprintf(data));
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			printError(jqXHR, textStatus, errorThrown);
		}
	});
}

function listTemp(container) {
	var zone=$(container).find("#zone").val();
			
	$(container).find("[zmlm\\\:item='tempList']").empty().append("<em>"+Locale["bedivere.message.loading"]+"</em>");
	$(container).find("[zmlm\\\:item='confList']").empty().append("<em>"+Locale["bedivere.message.template.empty"]+"</em>");	
	
	$.ajax({
		type: "GET",
		url: Server+"/RedDragonEnterprise/AppTemplateManager",
		cache: false,
		data: {
			operation: "getapptemplates",
			zone: zone
		}, 
		success: function(data) {
			try{
				data=$.parseJSON(data);
				
				if(data.length>0) {
					// clear
					var view=$(container).find("[zmlm\\\:item='tempList']").empty();
					
					$.tmpl("applyTempRowTemplate", data).each(function(index, element){
						// bind data
						$(this).data("data", data[index]);
						
						$(this).bind("click", function(){
							$(container).find("[zmlm\\\:item='tempList']").children().each(function(){
								$(this).removeClass("select");
							});
							
							$(this).addClass("select");
							
							// list conf
							listConf($(container).find("[zmlm\\\:item='confList']"), $(this).data("data").softwares);
							
						});
					}).appendTo(view);
					
				}else{
					$(container).find("[zmlm\\\:item='tempList']").empty().append("<em>"+Locale["bedivere.message.no_data"]+"</em>");
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

function listConf(container, data) {
	if(data.length>0) {	
		var views=$.tmpl("applyConfRowTemplate", data).appendTo(container.empty());	
		
		views.find(".appResRow").each(function(index, element){
			$(this).bind("click", function(){
				$(this).parent().find(".appResRow").removeClass("select");
				$(this).addClass("select");
			});
		});		
			
	}else{
		$("<em>"+Locale["bedivere.message.no_data"]+"</em>").appendTo(container.empty());
	}
}

function loadInstancePage() {
	$("#mainFrame").empty();
	
	var view=$.tmpl("appInstPageTemplate", [{id:"appInstPage"}]).appendTo("#mainFrame");	
	
	// -----------------------
	$(view).delegate(".appInstListRow", "mouseover", function() {
		$(this).addClass("hover");
		
	}).delegate(".appInstListRow", "mouseout", function() {
		$(this).removeClass("hover");
		
	}).delegate(".appInstListRow", "click", function() {
		$(view).find(".appInstListRow").removeClass("select");
		
		$(this).addClass("select");
	});
	
	// let's load content now
	getInstances($("#appInstPage").find("[zmlm\\\:item='appInstList']"));
}

function getInstances(container) {
	container.empty().append("<em>"+Locale["bedivere.message.loading"]+"</em>");
	
	$.ajax({		
		type: "GET",
		url: Server+"/RedDragonEnterprise/AppTemplateManager",
		cache: false,
		data: {
			operation: "gettemplateinstances",
			login: getUsername()
		}, 
		success: function(data) {
			container.empty();
			
			try{				
				data=$.parseJSON(data);
				
				if(data.length>0) {
					var datalist=$.tmpl("appInstRowTemplate", data).appendTo(container);
					
					for(var i=0; i<datalist.length; i++) {
						i%2==0?$(datalist[i]).addClass("rowEven"):$(datalist[i]).addClass("rowOdds");
					}
				}else{
					container.append("<em>"+Locale["bedivere.message.no_data"]+"</em>");
				}				
			
			}catch(e){
				printMessage("Broken Data: ["+e+"]");
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			printError(jqXHR, textStatus, errorThrown);
		}
	});	
}

/**
 * operation: deletetemplateinstance
 */
function deleteInstance(appinstanceid, container) {
	if(confirm(Locale["bedivere.confirm.remove.appinst"])) {
		$(container).parents(".instOperation").children("._operation").hide();
		$(container).parents(".instOperation").children("._tips").show();
		
		$.ajax({		
			type: "GET",
			url: Server+"/RedDragonEnterprise/AppTemplateManager",
			cache: false,
			data: {
				operation: "deletetemplateinstance",
				appinstanceid: appinstanceid
			}, 
			success: function(data) {
				if(data.match("true")) {
					printMessage(Locale["bedivere.message.remove.appinst.true"]);				
					$(container).parents(".appInstListRow").remove();
					
				}else if(data.match("false")) {
					printMessage(Locale["bedivere.message.remove.appinst.false"]);
				}else if(data.match("exception")) {
					printMessage(Locale["bedivere.message.remove.appinst.error"]);
				}else {
					printMessage(Locale["bedivere.message.undefined"].sprintf(data));
				}				
			},
			error: function(jqXHR, textStatus, errorThrown) {
				printError(jqXHR, textStatus, errorThrown);
			}
		});
	}	
}

/**
 * operation: starttemplateinstance
 */
function startInstance(appinstanceid, container) {	
	if(confirm(Locale["bedivere.confirm.bootup.appinst"])) {
		$(container).parents(".instOperation").children("._operation").hide();
		$(container).parents(".instOperation").children("._tips").show();		
		
		$.ajax({		
			type: "GET",
			url: Server+"/RedDragonEnterprise/AppTemplateManager",
			cache: false,
			data: {
				operation: "starttemplateinstance",
				appinstanceid: appinstanceid
			}, 
			success: function(data) {
				$(container).parents(".instOperation").children("._operation").show();
				$(container).parents(".instOperation").children("._tips").hide();
				
				if(data.match("true")) {
					printMessage(Locale["bedivere.message.bootup.appinst.true"]);
				}else if(data.match("false")) {
					printMessage(Locale["bedivere.message.bootup.appinst.false"]);
				}else if(data.match("exception")) {
					printMessage(Locale["bedivere.message.bootup.appinst.error"]);
				}else {
					printMessage(Locale["bedivere.message.undefined"].sprintf(data));
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				printError(jqXHR, textStatus, errorThrown);
				
				$(container).parents(".instOperation").children("._operation").show();
				$(container).parents(".instOperation").children("._tips").hide();				
			}
		});		
	}	
}

/**
 * operation: stoptemplateinstance
 */
function stopInstance(appinstanceid, container) {	
	if(confirm(Locale["bedivere.confirm.stop.appinst"])) {
		$(container).parents(".instOperation").children("._operation").hide();
		$(container).parents(".instOperation").children("._tips").show();		
		
		$.ajax({		
			type: "GET",
			url: Server+"/RedDragonEnterprise/AppTemplateManager",
			cache: false,
			data: {
				operation: "stoptemplateinstance",
				appinstanceid: appinstanceid
			}, 
			success: function(data) {
				$(container).parents(".instOperation").children("._operation").show();
				$(container).parents(".instOperation").children("._tips").hide();
				
				if(data.match("true")) {
					printMessage(Loale["bedivere.message.stop.appinst.true"]);
				}else if(data.match("false")) {
					printMessage(Locale["bedivere.message.stop.appinst.false"]);
				}else if(data.match("exception")) {
					printMessage(Locale["bedivere.message.stop.appinst.error"]);
				}else {
					printMessage(Locale["bedivere.message.undefined"].sprintf(data));
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				printError(jqXHR, textStatus, errorThrown);
				
				$(container).parents(".instOperation").children("._operation").show();
				$(container).parents(".instOperation").children("._tips").hide();				
			}
		});		
	}	
}

function loadApplyPage() {
	$("#mainFrame").empty();
	
	var tabs=$.tmpl("applyTempTabsTemplate", [{id:"applyTempTabs"}]).appendTo("#mainFrame");
	tabs.tabs().css("border", "0");
	
	$(tabs).find("button").button();
	
	
	// -----------------------
	$(tabs).delegate(".appReqListRow", "mouseover", function() {
		$(this).addClass("hover");
		
	}).delegate(".appReqListRow", "mouseout", function() {
		$(this).removeClass("hover");
		
	}).delegate(".appReqListRow", "click", function() {
		$(tabs).find(".appReqListRow").removeClass("select");
		
		$(this).toggleClass("select");
	});
	
	
	// ------------------------
	$(tabs).delegate(".appTempRow,.appResRow", "mouseover", function() {
		$(this).addClass("hover");
	}).delegate(".appTempRow,.appResRow", "mouseout", function() {
		$(this).removeClass("hover");		
	});	
	
	// -------------------------
	$(tabs).find(".datepicker").datepicker({
		showOn: "button",
		buttonImage: "css/image/calendar.gif",
		dateFormat: "yy-mm-dd",
		buttonImageOnly: true
	});
	
	
	$(tabs).bind("tabsshow", function(event, ui){
		
		if(null==ui || ui.panel.id=="tab-newapptemp") {
			getZoneInfo($("#applyTempTabs").find("#zone"));
			
			$(this).find("[zmlm\\\:item='tempList']").empty().append("<em>"+Locale["bedivere.message.zone.empty"]+"</em>");
			$(this).find("[zmlm\\\:item='confList']").empty().append("<em>"+Locale["bedivere.message.template.empty"]+"</em>");
			
		}else if(ui.panel.id=="tab-appreqlist"){
			getAppTempReq($(tabs).children("#tab-appreqlist").find("[zmlm\\\:item='appReqList']"), getUsername());
		}
		
	}).triggerHandler("tabsshow");
		
}

function initAjax() {
	jQuery.support.cors = true;
	
	$(document).ajaxStart(function(){
		$("#loadingIcon").show();
	}).ajaxStop(function(){
		$("#loadingIcon").hide();
	});
}

function initUi() {
	$("#newTemplateBtn").button({
		icons: {
			primary: "ui-icon-circle-plus"
		}
	});
	
	$("#refreshBtn").button({
		icons: {
			primary: "ui-icon-arrowrefresh-1-n"
		}
	});
	
	$("#manageBtn").button({
		icons: {
			primary: "ui-icon-calculator"
		}
	});
	
	$("#examineBtn").button({
		icons: {
			primary: "ui-icon-clipboard"
		}
	});
	
	$("button[name='deleteTemplate']").button({
		icons: {
			primary: "ui-icon-minus"
		}
	});
	
	$("button[name='updateTemplate']").button({
		icons: {
			primary: "ui-icon-document"
		}
	});
}

function formatSize(bytes) {
	if(null==bytes || 0==bytes) return "--";
	
	var i=0;
	while(1023 < bytes){
		bytes /= 1024;
		++i;
	};
	return i?bytes.toFixed(2) + ["", " KB", " MB", " GB", " TB"][i] : bytes + " bytes";
}

function formatDate(longtime) {
	return new Date(longtime).toUTCString();
}

function formatExamStatus(status) {
	switch(status) {
		case "unapproved":return "<span class=\"ui-icon ui-icon-help smallIcon\"></span><span style=\"color:#AAA;\">"+Locale["bedivere.message.apply.status.pending"]+"</span>";
		case "proved":return "<span class=\"ui-icon ui-icon-check smallIcon\"></span><span style=\"color:#65c300;\">"+Locale["bedivere.message.apply.status.approved"]+"</span>";
		case "rejected":return "<span class=\"ui-icon ui-icon-close smallIcon\"></span><span style=\"color:red;\">"+Locale["bedivere.message.apply.status.rejected"]+"</span>";
		default : return "[Undefined Status]";
	}
}

function getZoneInfo(container) {
	$.ajax({
		type: "GET",
		url: Server+"/RedDragonEnterprise/InformationRetriverServlet",
		cache: false,
		data: {
			methodType: "GETZONEINFOR"
		}, 
		dataType: "xml",
		success: function(data) {
			try{
				var dataCenters=$(data).find('mydatacentre');
				
				var optionArray=new Array();
						
				dataCenters.each(function(index, element) {
					optionArray.push({lable:$(this).attr("lable"), value:$(this).attr("data")});
				});
				
				var view=$.tmpl("zoneGroupTemplate", [{
					id:"zone", 
					options:optionArray
				}]);
				view.data("data", data);
				
				$(container).replaceWith(view);
				
			}catch(e) {
				printMessage("Data Broken: ["+e+"]");
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			printError(jqXHR, textStatus, errorThrown);
		}
	});
}

function getAppTempReq(container, username) {
	$(container).empty().append("<em>"+Locale["bedivere.message.loading"]+"</em>");
	
	$.ajax({
		type:"GET",
		url: Server+"/RedDragonEnterprise/AppTemplateManager",
		cache: false,
		data: {
			operation: "fetchapptemplaterequests",
			login: username
		},
		success: function(data) {		
			$(container).empty();	
			try{			
				data=$.parseJSON(data);
				
				$(container).data("data", data);
				
				if(data.length>0) {
					var datalist=$.tmpl("appReqRowTemplate", data).appendTo($(container));
					
					for(var i=0; i<datalist.length; i++) {
						i%2==0?$(datalist[i]).addClass("rowEven"):$(datalist[i]).addClass("rowOdds");
					}
				}else {
					$("<span class=\"empty\">"+Locale["bedivere.message.no_data"]+"</span>").appendTo($(container));
				}
			}catch(e){
				printMessage("Data Broken: ["+e+"]");
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			printError(jqXHR, textStatus, errorThrown);
		}
	});
	
}

// load softwares
function getSoftware(parent, defaultSoftwares) {			
	var container=$(parent).find(".listPanel").empty();
	
	$.ajax({
		type: "GET", 
		url: Server+"/billingCN/BillingServlet",
		cache: false,
		data: {
			RequestType: 'getSoftware',
			type: 'All',
			SearchName: ''
		},
		success: function(data) {
			try{
				data="<data>"+data+"</data>";
				data=$.parseXML(data);
				
				if($(data).find("Software").length>0) {
					$(data).find("Software").each(function(index, element) {
						var id=$(this).children("id").text();
						var softwareName=$(this).children("SoftwareName").text();
						var modelType=$(this).children("ModelType").text();
						var description=$(this).children("Description").text();
						var introduction=$(this).children("Introduction").text();
						
						var view=$.tmpl("softwareItemTemplate", 
							[{
								id: id,
								name: softwareName,
								type: modelType,
								desc: description,
								intro: introduction
							}]
						);
						
						if(null!=defaultSoftwares && ""!=defaultSoftwares) {
							softwares=defaultSoftwares.split(",");
							
							for(var i=0; i<softwares.length; i++) {
								if(id==softwares[i]) {
									view.addClass("select");
									break;
								}
							}							
						}
						
						// binding data
						view.data("data", this);
						
						// display it
						view.appendTo(container);
					});
				}else{
					container.append("<span class=\"empty\"><em>"+Locale["bedivere.message.no_data"]+"</em></span>");
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

function printError(jqXHR, textStatus, errorThrown) {
	printMessage("Connection Broken: "+textStatus+", "+errorThrown);
}

function printMessage(msg) {
	return $.tmpl("messageBoxTemplate", [{message: msg}]).appendTo("#appTempBody").dialog({
		resizable: false,
		modal: true,
		buttons: [
			{
				text: Locale["bedivere.dialog.close"],
				click: function() {
					$(this).dialog("destroy");
				}
			}
		]
	});
}

function showNewTemplateDialog() {
	$("#newAppTempDialog").dialog("open");
	
	getSoftware($("#newAppTempDialog"));
}

function showUpdateAppTempDialog(id, name, desc, notes, zone, softwares) {
	$("#updateAppTempDialog").dialog("open");
	
	$("#updateAppTempDialog").find("[zmlm\\\:item='appTempId']").val(id);
	$("#updateAppTempDialog").find("[zmlm\\\:item='appTempName']").val(name);
	$("#updateAppTempDialog").find("[zmlm\\\:item='appTempDesc']").val(desc);
	$("#updateAppTempDialog").find("[zmlm\\\:item='appTempNotes']").val(notes);
	$("#updateAppTempDialog").find("[zmlm\\\:item='appTempZone']").val(zone);
	
	getSoftware($("#updateAppTempDialog"), softwares);		
	
}



