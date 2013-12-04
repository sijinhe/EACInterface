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
	if("manage"==action) {
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
	$.template("moreVMBoxTemplate", Template_moreVMPane);
	$.template("diskBoxIsNeedTemplate", Template_DiskBoxIsNeed);
	$.template("diskQuotaTemplate", Template_DiskQuota);
	$.template("projectPreviewTemplate", Template_ProjectPreview);
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
	$("#mainBody").empty();
	
	$("<div id=\"mainFrame\"></div>").appendTo("#mainBody");	
	$("#mainFrame").css("top", "0");
	
	$("#banner").html(Locale["project.banner"]);
}

function cancelRequest(projectid) {
	var login=getUsername();
	
	if(confirm(Locale["project.confirm.cancelrequest"])) {		
		$.ajax({
			type: "GET",
			url: Server+"/RedDragonEnterprise/ProjectManager",
			cache: false,
			data: {
				operation: "deleteprojectrequest",
				login: login,
				projectid: projectid
			}, 
			success: function(data) {
				if(data.match("true")) {
					printMessage(Locale["project.message.cancelsuccess"]);
				}else if(data.match("false")){
					printMessage(Locale["project.message.cancelfailure"]);
				}else{
					printMessage(Locale["project.message.unknownreturn"].sprintf(data));
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
	
	if(null==applyname || ""==applyname || !applyname.match("[a-zA-Z0-9_]+") || applyname.match("[a-zA-Z0-9_]+").toString().length!=applyname.length || applyname.length>8 ||applyname.length<4) isApplyNameOk=false; // validation
	
	if(!isApplyNameOk) {
		printMessage(Locale["project.message.applyname"]);
	}else if(!isDateOk) {
		printMessage(Locale["project.message.schedule"]);		
	}else if(!isSftconfigureOk || !isApptemplateidOk) {
		printMessage(Locale["project.message.configure"]);
	}else if(confirm(Locale["project.confirm.commitapply"])){			
		// commit
		commitApplyRequest(login, apptemplateid, sftconfigure, applyname, applystart, applyend);
	}
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
				printMessage(Locale["project.message.applytrue"]);
			}else if(data.match("false")){
				printMessage(Locale["project.message.applyfalse"]);				
			}else if(data.match("name exists")) {
				printMessage(Locale["project.message.applyexists"]);
			}else{
				printMessage(Locale["project.message.unknownreturn"].sprintf(data));
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			printError(jqXHR, textStatus, errorThrown);
		}
	});
}

function listTemp(container) {
	var zone=$(container).find("#zone").val();
	
	$(container).find("[zmlm\\\:item='tempList']").empty().append("<em>"+Locale["project.message.loading"]+"</em>");
	$(container).find("[zmlm\\\:item='confList']").empty().append("<em>"+Locale["project.message.selectsoftware"]+"</em>");	
	
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
			try {
				data="<data>"+data+"</data>";
				data=$.parseXML(data);
				
				$(document).data("softwares", data);
				
				// clear
				var view=$(container).find("[zmlm\\\:item='tempList']").empty();
				
				// parsing and wrap into UI
				parseSoftwares(data, view);
				
			}catch(e) {
				printMessage("Data Broken: ["+e+"]");
			}
		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			printError(jqXHR, textStatus, errorThrown);
		}
	});
	
	// download the disk data on zone
	loadDiskData($(container).find("span[diskpane='']").first(), zone);
	
}

function parseSoftwares(data, view) {
	if(data && $(data).find("Software").length>0) {
		$(data).find("Software").each(function(index, element) {
			var id=$(this).children("id").text();
			var softwareName=$(this).children("SoftwareName").text();
			var modelType=$(this).children("ModelType").text();
			var description=$(this).children("Description").text();
			var introduction=$(this).children("Introduction").text();
			
			var data_json=[{
				id: id,
				name: softwareName,
				type: modelType,
				desc: description,
				intro: introduction
			}];
			
			$.tmpl("applyTempRowTemplate", data_json)
				.data("data", data_json[0])				
				.bind("click", function(){
					$(this).parents("span[box='']").first().find("[zmlm\\\:item='tempList']").children().each(function(){
						$(this).removeClass("select");
					});
					
					$(this).addClass("select");
					
					// list conf
					listConf($(this).parents("span[box='']").first().find("[zmlm\\\:item='confList']"), $(this).data("data").id);
					
					
				}).appendTo(view);
				
		});
	}else if(!data){
		view.append("<em>"+Locale["project.message.selectzone"]+"</em>");
	}else{
		view.append("<em>"+Locale["project.message.nosoftwaredata"]+"</em>");
	}
	
}

function listConf(container, softwareid) {
	$("<em>"+Locale["project.message.loadinghardware"]+"</em>").appendTo(container.empty());
	
	var zone=$(container).parents("div[page='']").first().find("#zone").val();
	$.ajax({		
		type: "GET",
		url: Server+"/RedDragonEnterprise/ProjectManager",
		cache: false,
		data: {
			operation: "getsftresources",
			zone: zone,
			softwareid: softwareid
		}, 
		success: function(data) {
			container.empty();
			
			try{				
				data=$.parseJSON(data);
				data=[data];
				
				if(data.length>0) {
					var views=$.tmpl("applyConfRowTemplate", data).appendTo(container);	
					
					views.find(".appResRow").each(function(index, element){
						$(this).bind("click", function(){
							$(this).parent().find(".appResRow").removeClass("select");
							$(this).addClass("select");
						});
					});
					
				}else{
					container.append("<em>"+Locale["project.message.modulenodata"]+"</em>");
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
	container.empty().append("<em>"+Locale["project.message.loading"]+"</em>");
	
	$.ajax({		
		type: "GET",
		url: Server+"/RedDragonEnterprise/ProjectManager",
		cache: false,
		data: {
			operation: "getprojectinstance",
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
					container.append("<em>"+Locale["project.message.modulenodata"]+"</em>");
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
	if(confirm(Locale["project.confirm.removeapply"])) {
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
					printMessage(Locale["project.message.removetrue"]);				
					$(container).parents(".appInstListRow").remove();
					
				}else if(data.match("false")) {
					printMessage(Locale["project.message.removefalse"]);
				}else if(data.match("exception")) {
					printMessage(Locale["project.message.removeexception"]);
				}else {
					printMessage(Locale["project.message.unknownreturn"].sprintf(data));
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
	if(confirm(Locale["project.confirm.startapply"])) {
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
					printMessage(Locale["project.message.starttrue"]);
				}else if(data.match("false")) {
					printMessage(Locale["project.message.startfalse"]);
				}else if(data.match("exception")) {
					printMessage(Locale["project.message.startexception"]);
				}else {
					printMessage(Locale["project.message.unknownreturn"].sprintf(data));
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
	if(confirm(Locale["project.confirm.stopapply"])) {
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
					printMessage(Locale["project.message.stoptrue"]);
				}else if(data.match("false")) {
					printMessage(Locale["project.message.stopfalse"]);
				}else if(data.match("exception")) {
					printMessage(Locale["project.message.stopexception"]);
				}else {
					printMessage(Locale["project.message.unknownreturn"].sprintf(data));
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
	tabs.delegate("#zone", "change", function(){listTemp("#applyTempTabs");});
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
			
		}else if(ui.panel.id=="tab-appreqlist"){
			getAppTempReq($(tabs).children("#tab-appreqlist").find("[zmlm\\\:item='appReqList']"), getUsername());
		}
		
	}).triggerHandler("tabsshow");
	
	$(tabs).delegate("#submitBtn", "click", function(){
		summary($("#applyTempTabs"));
	});
}

function summary(container) {
	var zone=container.find("#zone").val();
	var applyName=$(container).find("[zmlm\\\:item='applyName']").val().trim();
	var applyDesc=$(container).find("[zmlm\\\:item='applyDesc']").val().trim();
	var applyStart=$(container).find("[zmlm\\\:item='applyStart']").val().trim();
	var applyEnd=$(container).find("[zmlm\\\:item='applyEnd']").val().trim();
	
	var needIp=false;
	var needDisk=false;
	
	var personalIpAmount;
	var webIpAmount;
	
	var _applyStart_in_format=applyStart;
	var _applyEnd_in_format=applyEnd;
	var vmcount=0, diskcount=0;
	
	var vmPrefixArray=new Array();
	
	if(applyName=="") {printMessage(Locale["project.message.projectname"]);return;}
	//if(applyDesc=="") {printMessage("请输入项目描述");return;}
	try {applyStart=new Date(applyStart).getTime(); if(isNaN(applyStart)) throw "Bad Date";}catch(e) {printMessage(Locale["project.message.startdate"]);return;}
	try {applyEnd=new Date(applyEnd).getTime(); if(isNaN(applyEnd)) throw "Bad Date";}catch(e) {printMessage(Locale["project.message.enddate"]);return;}
	
	// check vm
	var prefixOk=true, sftresIdOk=true, quantityOk=true;
	var sftresources=new Array();
	$(container).find("span[vmconfbox='']").each(function(index, element) {
		var vmNamePrefix=$(this).find("[zmlm\\\:item='vmprefix']").val();
		var vmQuantity=$(this).find("[zmlm\\\:item='vmamount']").val();
		var sftResourceId=$(this).find("[zmlm\\\:item='confList']").find(".select").find("[zmlm\\\:item='sftresourceid']").val();
		
		sftresources.push([vmNamePrefix, sftResourceId, vmQuantity].join(":"));
		vmPrefixArray.push(vmNamePrefix);
		
		if(!vmNamePrefix.match("^[a-zA-Z_][a-zA-Z0-9_]{3,7}$")) {
			prefixOk=false;
		}
		try {vmQuantity=parseInt(vmQuantity); if(isNaN(vmQuantity) || vmQuantity<1) throw "Bad Number"; } catch(e) {quantityOk=false;}
		if(!sftResourceId) {sftresIdOk=false;}
		
		vmcount+=vmQuantity;
	});
	sftresources=sftresources.join(",");
	
	if(!prefixOk) {printMessage(Locale["project.message.vmprefix"]);return;}
	if(!quantityOk) {printMessage(Locale["project.message.vmamount"]);return;}
	if(!sftresIdOk) {printMessage(Locale["project.message.vmconfig"]);return;}
	
	// check if dulpicated prefix of vm existed, [dont't exchange the position of the follow judgement cause!!]
	if(vmPrefixArray.length!=$.unique(vmPrefixArray).length){printMessage(Locale["project.message.vmrepeat"]);return;}
	
	// check if prefix implied one/more substirng
	for(i=0; i<vmPrefixArray.length; i++) {
		for (j=i; j<vmPrefixArray.length; j++) {
			if(i!=j && (-1!=vmPrefixArray[i].indexOf(vmPrefixArray[j]) || -1!=vmPrefixArray[j].indexOf(vmPrefixArray[i]))) {
				printMessage(Locale["project.message.vm_substring"]);
				return;
			}
		}
	}
	
	// check ip
	var iprequests=new Array();
	if($(container).find("input[name='needIp']:checked").val()=="true") {
		needIp=true;
		personalIpAmount=$(container).find("input[zmlm\\\:item='personalIpAmount']").val();
		webIpAmount=$(container).find("input[zmlm\\\:item='webIpAmount']").val();
		
		personalIpAmount=parseInt(personalIpAmount);
		webIpAmount=parseInt(webIpAmount);
		
		if(isNaN(personalIpAmount) || isNaN(webIpAmount) || personalIpAmount<0 || webIpAmount<0) {
			printMessage(Locale["project.message.ip_amount"]);
			return;
		}
		
		iprequests.push("personal:"+personalIpAmount);
		iprequests.push("web:"+webIpAmount);
		
	}
	iprequests=iprequests.join(",");
	
	// check disk
	var diskAmountOk=true, diskPrefixOk=true;
	var disks=new Array();
	if($(container).find("input[name='needDisk']:checked").val()=="true") {
		needDisk=true;
		
		$(container).find("span[diskpane='']").find("span[diskquotabox='']").each(function(index, element){
			var diskSize=$(this).find("input[zmlm\\\:item='diskSize']").val();
			var diskAmount=$(this).find("input[zmlm\\\:item='diskAmount']").val();
			var diskPrefix=$(this).find("input[zmlm\\\:item='diskPrefix']").val().trim();
			
			diskAmount=parseInt(diskAmount);
			if(isNaN(diskAmount)) diskAmountOk=false;
			
			if(diskAmount>0){
				if(!diskPrefix.match("^[a-zA-Z_][a-zA-Z0-9_]{0,9}$")) {
					diskPrefixOk=false;
				}
			}
			
			if(diskAmount>0) { 
				disks.push([diskPrefix, diskSize, diskAmount].join(":"));
			}
			
			diskcount+=diskAmount;
		});
	}
	disks=disks.join(",");
	
	if(!diskAmountOk) {printMessage(Locale["project.message.disk_amount"]);return;}
	if(!diskPrefixOk) {printMessage(Locale["project.message.disk_prefix"]);return;}
	
	//$(container).find("#previewPane").remove();
	
	var view=$.tmpl("projectPreviewTemplate", [{
		paneid: "previewPane",
		zone: zone,
		
		projectname: applyName,
		projectdes: applyDesc,
		starttime: _applyStart_in_format,
		endtime: _applyEnd_in_format,
		
		sftresources_amount: vmcount,
		
		iprequired: needIp,
		personalIp_amount: personalIpAmount,
		webIp_amount: webIpAmount,
		
		volumerequired: needDisk,
		volrequests_amount: diskcount
		
	}]).appendTo($(container));
	
	
	
	$(view).dialog({
		autoOpen: true,
		width: 600,
		resizable: false,
		modal: true,
		buttons: [
			{
				text: Locale["project.dialog.commit"],
				click: function() {
					// submit...
					requestProject(
						zone,
						getUsername(),
						applyName,
						applyDesc,
						applyStart,
						applyEnd,
						sftresources,
						needIp,
						iprequests,
						needDisk,
						disks
					);
				}
			},
			{
				text: Locale["project.dialog.close"],
				click: function() {
					$(this).dialog("destroy");
				}
			}
		]
	});
}

function requestProject(zone, login, projectname, projectdes, starttime, 
	endtime, sftresources, iprequired, iprequests, volumerequired, volrequests) {
	
	var view=$("<div style='text-align:center;'>"+Locale["project.dialog.processing"]+"</div>").dialog({
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
	
	$.ajax({
		url: Server+"/RedDragonEnterprise/ProjectManager",
		type: "GET",
		cache: false,
		data: {
			operation: "requestproject",
			zone: zone,
			login: login,
			projectname: projectname,
			projectdes: projectdes,
			starttime: starttime,
			endtime: endtime,
			sftresources: sftresources,
			iprequired: iprequired,
			iprequests: iprequests,
			volumerequired: volumerequired,
			volrequests: volrequests
		},
		success: function(data) {
			$(view).dialog("close");
			
			try{
				if(data) {
					if(data.match("^true")) {
						printMessage(Locale["project.message.success"]);
					}else if(data.match("^failed")) {
						printMessage(Locale["project.message.failure"].sprintf(data));
					}else if(data.match("^missing input")) {
						printMessage(Locale["project.message.failure"].sprintf(data));
					}else if(data.match("^exception")) {
						printMessage(Locale["project.message.failure"].sprintf(data));
					}else {
						printMessage(Locale["project.message.existed"].sprintf(data));
					}
				}
			}catch(e) {
				printMessage("Data Broken: ["+e+"]");
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$(view).dialog("close");
			printError(jqXHR, textStatus, errorThrown);
		}
	});
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
	
	$("body").delegate("input[name='needIp']", "click", function(){
		if($("input[name='needIp']:checked").val()=="false") {
			$("input[name='needIp']").parents("span[box='']").first().find("input[type='text']").attr("disabled", "");	
		}else{
			$("input[name='needIp']").parents("span[box='']").first().find("input[type='text']").removeAttr("disabled");	
		}
	});
	
	$("body").delegate("input[name='needDisk']", "click", function(){
		if($("input[name='needDisk']:checked").val()=="false") {
			$("input[name='needDisk']").parents("span[box='']").first().find("input[type='text']").attr("disabled", "");	
		}else{
			$("input[name='needDisk']").parents("span[box='']").first().find("input[type='text']").removeAttr("disabled");	
		}
	});
	
	$("body").delegate("#moreVMBtn", "click", function(){
		var container=$.tmpl("moreVMBoxTemplate").insertAfter($("span[name='lessVMBtn']").last().parents("span[box='']").first());
		container.find("button").button();
		
		var data=$(document).data("softwares");
		
		// clear
		var view=$(container).find("[zmlm\\\:item='tempList']").empty();
		
		// parsing and wrap into UI
		parseSoftwares(data, view);
		
	});
	
	$("body").delegate("span[name='lessVMBtn']", "click", function(){
		if($("span[name='lessVMBtn']").length>1){
			if(confirm(Locale["project.confirm.removevm"])) {
				$(this).parents("span[box='']").first().remove();
			}
		}else{
			printMessage(Locale["project.message.atleastone"]);
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
	var date=new Date(longtime);
	var ret=date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
	return ret;
	//return new Date(longtime).toUTCString();
}

function formatExamStatus(status) {
	switch(status) {
		case "unapproved":return "<span class=\"ui-icon ui-icon-help smallIcon\"></span><span style=\"color:#AAA;\">"+Locale["project.status.unapproved"]+"</span>";
		case "approved":return "<span class=\"ui-icon ui-icon-check smallIcon\"></span><span style=\"color:#65c300;\">"+Locale["project.status.approved"]+"</span>";
		case "rejected":return "<span class=\"ui-icon ui-icon-close smallIcon\"></span><span style=\"color:red;\">"+Locale["project.status.rejected"]+"</span>";
		default : return "[N/A]";
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

function loadDiskData(container, zone) {
	$(container).empty();
	
	$.ajax({
		type: "GET",
		url: Server+"/RedDragonEnterprise/ConventoryManagerServlet",
		cache: false,
		dataType: "text",
		data: {
			operation: "getdiskquota",
			zone: zone
		},
		success: function(data) {
			try{
				$(container).empty(); // empty it again due to more than 2 response will come back if sth. delayed 
				
				data=$.parseJSON(data);
				
				// append the header
				$.tmpl("diskBoxIsNeedTemplate").appendTo($(container));
				
				if(!data || data.length==0) {
					$("<em>"+Locale["project.message.disknotavailable"]+"</em>").appendTo($(container));
				}else{
					$("<span class=\"newAppTempRowHeader\">"+Locale["project.message.disksetamount"]+"</span>").appendTo($(container));
					$.tmpl("diskQuotaTemplate", data).appendTo($(container));
				}
				
			}catch(e) {
				printError("Data Broken: ["+e+"]");
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			printError(jqXHR, textStatus, errorThrown);
		}
	});
}

function getAppTempReq(container, username) {
	$(container).empty().append("<em>"+Locale["project.message.loading"]+"</em>");
	
	$.ajax({
		type:"GET",
		url: Server+"/RedDragonEnterprise/ProjectManager",
		cache: false,
		data: {
			operation: "fetchprojectrequests",
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
				} else {
					$("<span class=\"empty\">"+Locale["project.message.nodata"]+"</span>").appendTo($(container));
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
					container.append("<span class=\"empty\"><em>"+Locale["project.message.nosoftwaredata"]+"</em></span>");
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
	return $.tmpl("messageBoxTemplate", [{message: msg}]).appendTo("#mainBody").dialog({
		resizable: false,
		modal: true,
		buttons: [{
			text: Locale["project.dialog.close"],
			click: function() {
				$(this).dialog("destroy");
			}
		}]
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



