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
	$.template("backupTabsTemplate", Template_BackupTabs);
	$.template("backupTaskRowTemplate", Template_BackupTaskRow);
	$.template("backupImageRowTemplate", Template_BackupImageRow);
	$.template("newBackupTaskPanelTemplate", Template_NewBackupTaskPanel);
	$.template("messageBoxTemplate", Template_MessageBox);
}

function setup() {
	$("#mainBody").empty();
	
	$("#banner").html(Locale["backup.banner"]);
	
	var tabs=$.tmpl("backupTabsTemplate", [{id:"backupTabs"}]).appendTo("#mainBody");
	tabs.tabs().css("border", "0");
	
	$(tabs).bind("tabsshow", function(event, ui) {
		
		if(null==ui || ui.panel.id=="tab-backuptask") {
			loadBackupTask();
		}else if(ui.panel.id=="tab-backupimage") {
			loadBackupImage();
		}
		
	}).triggerHandler("tabsshow");
	
	// set up object type changing trigger
	$(tabs).delegate("[zmlm\\\:item='objecttype']", "change", function(){
		loadBackupImage();
	});
	
	// set up highlight & selection effect for [task]
	$(tabs).delegate(".backupTaskRow", "mouseover", function() {
		$(this).addClass("hover");
	}).delegate(".backupTaskRow", "mouseout", function() {
		$(this).removeClass("hover");
	});
	
	// set up highlight & selection effect for [image]
	$(tabs).delegate(".backupImageRow", "mouseover", function() {
		$(this).addClass("hover");
	}).delegate(".backupImageRow", "mouseout", function() {
		$(this).removeClass("hover");
	});
	
	// a dialog for set up new backup task
	var newBackupTaskPanel=$.tmpl("newBackupTaskPanelTemplate", [{id:"newBackupTaskPanelTemplate"}]).appendTo("#mainBody");
	
	newBackupTaskPanel=$(newBackupTaskPanel).dialog({
		title: "<span class=\"ui-icon ui-icon-circle-plus smallIcon\"></span>"+Locale["backup.dialog.title.new.task"],
		modal:true,
		autoOpen:false,
		resizable: false,
		show: "slide",
		hide: "slide",
		width: "540px",
		buttons: [
			{
				text: Locale["backup.dialog.confirm"],
				click: function() {
					var jobname=$(this).find("input[zmlm\\\:item='jobname']").val();
					var objecttype=$(this).find("select[zmlm\\\:item='objecttype']").val();
					var objectid=$(this).find("select[zmlm\\\:item='objectid']").val();
					var backupmaxnum=$(this).find("select[zmlm\\\:item='backupmaxnum']").val();
					
					var backupperiod=$(this).find("select[zmlm\\\:item='backupperiod']").val();
					var dayofmonth=$(this).find("select[zmlm\\\:item='dayofmonth']").val();
					var backupday=$(this).find("select[zmlm\\\:item='backupday']").val();
					var backuphour=$(this).find("select[zmlm\\\:item='backuphour']").val();
					var backupminute=$(this).find("select[zmlm\\\:item='backupminute']").val();
					
					if(!jobname.match("^[a-zA-Z_]{1,32}$")) {
						printMessage(Locale["backup.message.illegal.task.name"]);
						return;
					}
					if(null==objectid || ""==objectid || objectid=="n/a") {
						printMessage(Locale["backup.message.choose.object"]);
						return;
					}
					
					createBackupTask(jobname, objecttype, objectid, backupmaxnum, 
						backupperiod, dayofmonth, backupday, backuphour, backupminute);
					$(this).dialog("close");
				}
			},
			{
				text: Locale["backup.dialog.cancel"],
				click: function() {
					$(this).dialog("close");
				}
			}
		]
	});
	
	// bind up selection changing for backup period
	$(newBackupTaskPanel).find("select[zmlm\\\:item='backupperiod']").first().bind("change", function(){
		switch($(this).val()) {
			case "daily":
				$(newBackupTaskPanel).find("select[zmlm\\\:item='dayofmonth']").attr("disabled", "");
				$(newBackupTaskPanel).find("select[zmlm\\\:item='backupday']").attr("disabled", "");
				break;
			case "weekly":
				$(newBackupTaskPanel).find("select[zmlm\\\:item='dayofmonth']").attr("disabled", "");
				$(newBackupTaskPanel).find("select[zmlm\\\:item='backupday']").removeAttr("disabled");
				break;
			case "monthly":
				$(newBackupTaskPanel).find("select[zmlm\\\:item='dayofmonth']").removeAttr("disabled");
				$(newBackupTaskPanel).find("select[zmlm\\\:item='backupday']").attr("disabled", "");
				break;
		}
	}).triggerHandler("change");
	
	// bind up selection changing for backup type
	$(newBackupTaskPanel).find("select[zmlm\\\:item='objecttype']").first().bind("change", function(){
		switch($(this).val()) {
			case "vm":
				loadVms($(newBackupTaskPanel).find("select[zmlm\\\:item='objectid']"));
				break;
			case "volume":
				loadVolumes($(newBackupTaskPanel).find("select[zmlm\\\:item='objectid']"));
				break;
		}
	});
	
	$(newBackupTaskPanel).bind("dialogopen", function(event, ui){
		$(this).find("select[zmlm\\\:item='objecttype']").first().triggerHandler("change");
	});
	
}

function createBackupTask(jobname, objecttype, objectid, backupmaxnum, 
	backupperiod, dayofmonth, backupday, backuphour, backupminute) {
		
	var pd=showProcessingDialog();
	$.ajax({
		url: Server+"/RedDragonEnterprise/BackupServlet",
		type: "POST",
		data: {
			methodtype: "addnewjob",
			jobname: jobname,
			backupurl: "default",
			objecttype: objecttype,
			objectid: objectid,
			userlogin: getUsername(),
			backupperiod: backupperiod,
			dayofmonth: dayofmonth,
			backupday: backupday,
			backuphour: backuphour,
			backupminute: backupminute,
			backupmaxnum: backupmaxnum
		},
		cache: false,
		success: function(data) {
			$(pd).dialog("close");
			try{
				data=$.parseJSON(data);
				
				switch(data.status) {
					case "jobadded": printMessage(Locale["backup.message.task.new.jobadded"]); loadBackupTask(); break;
					case "error": ;
					case "exception": printMessage(Locale["backup.message.task.new.error"]); break;
					default: printMessage(Locale["backup.message.undefined"].sprintf(data.status)); break;
				}
				
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

function loadVms(container) {
	$("<option value=\"\">"+Locale["backup.message.loading"]+"</option>").appendTo(container.empty());
	
	$.ajax({
		url: Server+"/RedDragonEnterprise/InformationRetriverServlet",
		type: "POST",
		data: {
			methodtype: "getvmlist",
			loginuser: getUsername()
		},
		cache:false,
		success: function(data) {
			container.empty();
			try{
				data=$.parseJSON(data);
				
				for(var i in data) {
					$("<option value='"+data[i].vmuuid+"'>"+data[i].vmname+"</option>").appendTo(container);
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

function loadVolumes(container) {
	$("<option value=\"\">"+Locale["backup.message.loading"]+"</option>").appendTo(container.empty());
	
	$.ajax({
		url: Server+"/RedDragonEnterprise/InformationRetriverServlet",
		type: "POST",
		data: {
			methodtype: "getvolumelist",
			loginuser: getUsername()
		},
		cache: false,
		success: function(data) {
			container.empty();
			try{
				data=$.parseJSON(data);
				
				for(var i in data) {
					$("<option value='"+data[i].volumeid+"'>"+data[i].volumename+"</option>").appendTo(container);
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

function dumpHours() {
	var ret="";
	for(var i=0; i<24; i++) {
		if(i==0) ret+="<option value=\""+i+"\" selected>"+i+"</option>";
		else ret+="<option value=\""+i+"\">"+i+"</option>";
	}
	return ret;
}

function dumpMinutes() {
	var ret="";
	for(var i=0; i<60; i++) {
		if(i==0) ret+="<option value=\""+i+"\" selected>"+i+"</option>";
		else ret+="<option value=\""+i+"\">"+i+"</option>";
	}
	return ret;
}

function dumpDaysOfMonth() {
	var ret="";
	for(var i=1; i<=31; i++) {
		if(i==1) ret+="<option value=\""+i+"\" selected>"+i+"</option>";
		else ret+="<option value=\""+i+"\">"+i+"</option>";
	}
	return ret;
}

var dayOfWeek=[Locale["backup.enum.sun"], Locale["backup.enum.mon"], Locale["backup.enum.tue"], 
	Locale["backup.enum.wed"], Locale["backup.enum.thu"], Locale["backup.enum.fri"], Locale["backup.enum.sat"]];
function dumpDaysOfWeek() {
	var ret="";
	for(var i=0; i<7; i++) {
		if(i==0) ret+="<option value=\""+i+"\" selected>"+dayOfWeek[i]+"</option>";
		else ret+="<option value=\""+i+"\">"+dayOfWeek[i]+"</option>";
	}
	return ret;
}

function showUpdateTaskDialog(which) {
	var row=$(which).parents(".backupTaskRow").first();
	
	var jobid=$(row).find("input[zmlm\\\:item='backupTaskId']").val();
	var jobname=$(row).find("input[zmlm\\\:item='backupTaskName']").val();
	var objecttype=$(row).find("input[zmlm\\\:item='backupTaskType']").val();
	var objectid=$(row).find("input[zmlm\\\:item='backupTaskObjectId']").val();
	var maxnum=$(row).find("input[zmlm\\\:item='backupTaskMaxNum']").val();	
	var objectname=$(row).find("input[zmlm\\\:item='backupTaskObjectName']").val();
	
	var backupperiod=$(row).find("input[zmlm\\\:item='backupTaskPeriod']").val();
	var backupdate=$(row).find("input[zmlm\\\:item='backupTaskDate']").val();
	var backuphour=$(row).find("input[zmlm\\\:item='backupTaskHour']").val();
	var backupminute=$(row).find("input[zmlm\\\:item='backupTaskMinute']").val();
	
	//alert([jobid, jobname, objecttype, maxnum, objectname, backupperiod, backupdate, backuphour, backupminute].join(","));
	
	// a dialog for modify backup task
	var modifyBackupTaskPanel=$.tmpl("newBackupTaskPanelTemplate", [{id:"modifyBackupTaskPanel"}]).appendTo("#mainBody");
	
	modifyBackupTaskPanel=$(modifyBackupTaskPanel).dialog({
		title: "<span class=\"ui-icon ui-icon-circle-plus smallIcon\"></span>"+Locale["backup.dialog.title.modify.task"],
		modal: true,
		autoOpen: false,
		resizable: false,
		show: "slide",
		hide: "slide",
		width: "540px",
		buttons: [
			{
				text: Locale["backup.dialog.confirm"],
				click: function() {
					var jobname=$(this).find("input[zmlm\\\:item='jobname']").val();
					var objecttype=$(this).find("select[zmlm\\\:item='objecttype']").val();
					var objectid=$(this).find("select[zmlm\\\:item='objectid']").val();
					var backupmaxnum=$(this).find("select[zmlm\\\:item='backupmaxnum']").val();
					
					var backupperiod=$(this).find("select[zmlm\\\:item='backupperiod']").val();
					var dayofmonth=$(this).find("select[zmlm\\\:item='dayofmonth']").val();
					var backupday=$(this).find("select[zmlm\\\:item='backupday']").val();
					var backuphour=$(this).find("select[zmlm\\\:item='backuphour']").val();
					var backupminute=$(this).find("select[zmlm\\\:item='backupminute']").val();
					
					if(!jobname.match("^[a-zA-Z_]{1,32}$")) {
						printMessage(Locale["backup.message.illegal.task.name"]);
						return;
					}
					
					
					updateBackupTask(jobid, jobname, objecttype, backupmaxnum, 
						backupperiod, dayofmonth, backupday, backuphour, backupminute);
						
					$(this).dialog("destroy");
								
				}
			},
			{
				text: Locale["backup.dialog.cancel"],
				click: function() {
					$(this).dialog("destroy");
				}
			}
		]
	});
	
	// set up former value
	$(modifyBackupTaskPanel).find("input[zmlm\\\:item='jobname']").val(jobname).attr("disabled", "");
	$(modifyBackupTaskPanel).find("select[zmlm\\\:item='objecttype']").val(objecttype).attr("disabled", "");
	$(modifyBackupTaskPanel).find("select[zmlm\\\:item='objectid']").html("<option>"+objectname+"</option>").attr("disabled", "");
	$(modifyBackupTaskPanel).find("select[zmlm\\\:item='backupmaxnum']").val(maxnum);
	$(modifyBackupTaskPanel).find("select[zmlm\\\:item='backupperiod']").val(backupperiod);
	$(modifyBackupTaskPanel).find("select[zmlm\\\:item='dayofmonth']").val(backupdate);
	$(modifyBackupTaskPanel).find("select[zmlm\\\:item='backupday']").val(backupdate);
	$(modifyBackupTaskPanel).find("select[zmlm\\\:item='backuphour']").val(backuphour);
	$(modifyBackupTaskPanel).find("select[zmlm\\\:item='backupminute']").val(backupminute);
	
	
	// bind up selection changing for backup period
	$(modifyBackupTaskPanel).find("select[zmlm\\\:item='backupperiod']").first().bind("change", function(){
		switch($(this).val()) {
			case "daily":
				$(modifyBackupTaskPanel).find("select[zmlm\\\:item='dayofmonth']").attr("disabled", "");
				$(modifyBackupTaskPanel).find("select[zmlm\\\:item='backupday']").attr("disabled", "");
				break;
			case "weekly":
				$(modifyBackupTaskPanel).find("select[zmlm\\\:item='dayofmonth']").attr("disabled", "");
				$(modifyBackupTaskPanel).find("select[zmlm\\\:item='backupday']").removeAttr("disabled");
				break;
			case "monthly":
				$(modifyBackupTaskPanel).find("select[zmlm\\\:item='dayofmonth']").removeAttr("disabled");
				$(modifyBackupTaskPanel).find("select[zmlm\\\:item='backupday']").attr("disabled", "");
				break;
		}
	}).triggerHandler("change");
	
	$(modifyBackupTaskPanel).bind("dialogopen", function(event, ui){
		$(this).find("select[zmlm\\\:item='objecttype']").first().triggerHandler("change");
	});
	
	$(modifyBackupTaskPanel).dialog("open");
}


function updateBackupTask(jobid, jobname, objecttype, backupmaxnum, 
	backupperiod, dayofmonth, backupday, backuphour, backupminute) {
		
	var pd=showProcessingDialog();
	$.ajax({
		url: Server+"/RedDragonEnterprise/BackupServlet",
		type: "POST",
		data: {
			methodtype: "modifyjob",
			jobid: jobid,
			jobname: jobname,
			backupurl: "default",
			objecttype: objecttype,
			userlogin: getUsername(),
			backupperiod: backupperiod,
			dayofmonth: dayofmonth,
			backupday: backupday,
			backuphour: backuphour,
			backupminute: backupminute,
			backupmaxnum: backupmaxnum
		},
		cache: false,
		success: function(data) {
			$(pd).dialog("close");
			try{
				data=$.parseJSON(data);
				
				switch(data.status) {
					case "succeed": printMessage(Locale["backup.message.modify.succeed"]); loadBackupTask(); break;
					case "failed": ;
					case "exception": printMessage(Locale["backup.message.modify.exception"]); break;
					default: printMessage(Locale["backup.message.undefined"].sprintf(data.status)); break;
				}
				
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

function loadBackupTask() {
	var container=$("#tab-backuptask").find("[zmlm\\\:item='backupTaskList']");
	$("<em>"+Locale["backup.message.loading"]+"</em>").appendTo(container.empty());
	
	$.ajax({
		url: Server+"/RedDragonEnterprise/BackupServlet",
		type: "POST",
		data: {
			methodtype: "getjoblist",
			userlogin: getUsername()
		},
		cache: false,
		success: function(data) {
			try{
				data=$.parseJSON(data);

				container.empty();
				
				if(!data || data.length==0) {
					$("<em>"+Locale["backup.message.no_data"]+"</em>").appendTo(container);
				}else{
					var list=$.tmpl("backupTaskRowTemplate", data).appendTo(container);
					
					for(var i=0; i<list.length; i++) {
						i%2==0?$(list[i]).addClass("rowEven"):$(list[i]).addClass("rowOdds");
					}
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

function loadBackupImage() {
	var container=$("#tab-backupimage").find("[zmlm\\\:item='backupImageList']");
	$("<em>"+Locale["backup.message.loading"]+"</em>").appendTo(container.empty());
	
	var objecttype=$("#tab-backupimage").find("[zmlm\\\:item='objecttype']").val();
	
	$.ajax({
		url: Server+"/RedDragonEnterprise/BackupServlet",
		type: "POST",
		data: {
			methodtype: "getbackups",
			objecttype: objecttype,
			userlogin: getUsername()
		},
		cache: false,
		success: function(data) {
			try{
				data=$.parseJSON(data);

				// ---- mark up which is latest ----
				var latestMap={};
				for(var i in data) {
					if(latestMap[data[i].backupname] && latestMap[data[i].backupname]>data[i].backuptime) {
						continue;
					}else{
						latestMap[data[i].backupname]=data[i].backuptime;
					}
				}
				for(var backupname in latestMap) {
					for(var i in data) {
						if(data[i].backupname==backupname && data[i].backuptime>=latestMap[backupname]) data[i]._latest=true;
						else if(!data[i]._latest) data[i]._latest=false;
					}
				}
				// ---- mark up which is latest ----
				
				container.empty();
				
				if(!data || data.length==0) {
					$("<em>"+Locale["backup.message.no_data"]+"</em>").appendTo(container);
				}else{
					var list=$.tmpl("backupImageRowTemplate", data).appendTo(container);
					
					for(var i=0; i<list.length; i++) {
						i%2==0?$(list[i]).addClass("rowEven"):$(list[i]).addClass("rowOdds");
					}
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

function restoreImage(which) {
	var row=$(which).parents(".backupImageRow").first();
	
	var backupid=row.children("input[zmlm\\\:item='backupImageId']").val();
	var backupurl=row.children("input[zmlm\\\:item='backupImageUrl']").val();
	var objecttype=row.children("input[zmlm\\\:item='backupImageType']").val();
	var userlogin=getUsername();
	
	if(confirm(Locale["backup.dialog.confirm.restore"])) {
		var pd=showProcessingDialog();
		
		$.ajax({
			url: Server+"/RedDragonEnterprise/BackupServlet",
			type: "POST",
			data: {
				methodtype: "restorebackup",
				backupid: backupid,
				userlogin: userlogin,
				objecttype: objecttype
			},
			cache: false,
			success: function(data) {
				$(pd).dialog("close");
				
				try{
					data=$.parseJSON(data);
					
					switch(data.status) {
						case "succeed": printMessage(Locale["backup.message.restore.succeed"]); loadBackupImage(); break;
						case "vmrunning": printMessage(Locale["backup.message.restore.vmrunning"]); break;
						case "volumevmrunning": printMessage(Locale["backup.message.restore.volumevmrunning"]); break;
						case "failed": ;
						case "exception": printMessage(Locale["backup.message.restore.exception"]); break;
						default: printMessage(Locale["backup.message.undefined"].sprintf(data.status)); break;
					}
				}catch(e) {
					printMessage("Data Broken: ["+e+"]");
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$(pd).dialog("close");
				
				printError(jqXHR, textStatus, errorThrown);
			}
		});
	}
}

function removeImage(which) {
	var row=$(which).parents(".backupImageRow").first();
	
	var backupid=row.children("input[zmlm\\\:item='backupImageId']").val();
	var backupurl=row.children("input[zmlm\\\:item='backupImageUrl']").val();
	var objecttype=row.children("input[zmlm\\\:item='backupImageType']").val();
	var userlogin=getUsername();
	
	if(confirm(Locale["backup.dialog.confirm.remove.backup.file"])) {
		var pd=showProcessingDialog();
		
		$.ajax({
			url: Server+"/RedDragonEnterprise/BackupServlet",
			type: "POST",
			data: {
				methodtype: "deletebackup",
				backupid: backupid,
				userlogin: userlogin,
				backupurl: backupurl,
				objecttype: objecttype
			},
			cache: false,
			success: function(data) {
				$(pd).dialog("close");
				
				try{
					data=$.parseJSON(data);
					
					switch(data.status) {
						case "succeed": printMessage(Locale["backup.message.remove.backup.file.succeed"]); loadBackupImage(); break;
						case "failed": ;
						case "exception": printMessage(Locale["backup.message.remove.backup.file.exception"]); break;
						default: printMessage(Locale["backup.message.undefined"].sprintf(data.status)); break;
					}
				}catch(e) {
					printMessage("Data Broken: ["+e+"]");
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$(pd).dialog("close");
				
				printError(jqXHR, textStatus, errorThrown);
			}
		});
	}
	
}

function removeTask(which) {
	var row=$(which).parents(".backupTaskRow").first();
	
	var jobid=row.children("input[zmlm\\\:item='backupTaskId']").val();
	var jobname=row.children("input[zmlm\\\:item='backupTaskName']").val();
	var objecttype=row.children("input[zmlm\\\:item='backupTaskType']").val();
	var userlogin=getUsername();
	
	if(confirm(Locale["backup.dialog.confirm.remove.task"].sprintf(jobname))) {
		var pd=showProcessingDialog();
		
		$.ajax({
			url: Server+"/RedDragonEnterprise/BackupServlet",
			type: "POST",
			data: {
				methodtype: "removejob",
				jobid: jobid,
				jobname: jobname,
				objecttype: objecttype
			},
			cache: false,
			success: function(data) {
				$(pd).dialog("close");
				
				try{
					data=$.parseJSON(data);
					
					switch(data.status) {
						case "succeed": printMessage(Locale["backup.message.remove.task.succeed"]); loadBackupTask(); break;
						case "failed": ;
						case "exception": printMessage(Locale["backup.message.remove.task.exception"]); break;
						default: printMessage(Locale["backup.message.undefined"].sprintf(data.status)); break;
					}
				}catch(e) {
					printMessage("Data Broken: ["+e+"]");
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$(pd).dialog("close");
				
				printError(jqXHR, textStatus, errorThrown);
			}
		});
	}
}

function showNewTaskDialog() {
	$("#newBackupTaskPanelTemplate").dialog("open");
}

function initUi() {
	// jquery ui init
	$("button").button();
}

function initAjax() {
	jQuery.support.cors = true;
	
	$(document).ajaxStart(function(){
		$("#loadingIcon").show();
	}).ajaxStop(function(){
		$("#loadingIcon").hide();
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

function formatPeriod(value) {
	switch(value) {
		case "daily": return Locale["backup.enum.daily"];
		case "weekly": return Locale["backup.enum.weekly"];
		case "monthly": return Locale["backup.enum.monthly"];
		default: return value;
	}
}

function formatLatestMark(latest) {
	return latest?"<span class='ui-icon ui-icon-tag' style='float:left; margin:0 0 0 0;'></span><em style='margin-left:0;'>Latest</em>":"";
}

function formatObjectType(value) {
	switch(value) {
		case "vm": return "<span class='ui-icon ui-icon-home' style='float:left; margin:0 2px 0 0;'></span>"+Locale["backup.object.type.vm"];
		case "volume": return "<span class='ui-icon ui-icon-disk' style='float:left; margin:0 2px 0 0;'></span>"+Locale["backup.object.type.volume"];
		default: return value;
	}
}

function formatTaskTime(taskPeriod, taskBackupDate, taskBackupHour, taskBackupMinute) {
	switch(taskPeriod) {
		case "daily": {
			return taskBackupHour + " "+Locale["backup.date.hour"] + " " + taskBackupMinute + " " + Locale["backup.date.minute"];
		}
		case "weekly": {
			var str="";
			switch(parseInt(taskBackupDate % 7)) {
				case 0: str=Locale["backup.enum.sun"];break;
				case 1: str=Locale["backup.enum.mon"];break;
				case 2: str=Locale["backup.enum.tue"];break;
				case 3: str=Locale["backup.enum.wed"];break;
				case 4: str=Locale["backup.enum.thu"];break;
				case 5: str=Locale["backup.enum.fri"];break;
				case 6: str=Locale["backup.enum.sat"];break;
			}
			return str + ", " + taskBackupHour + " "+Locale["backup.date.hour"]+" " + taskBackupMinute + " "+Locale["backup.date.minute"];
		}
		case "monthly": {
			return taskBackupDate +" " + Locale["backup.date.day"]+", " + taskBackupHour + " "+Locale["backup.date.hour"]+" " + taskBackupMinute + " "+Locale["backup.date.minute"];
		}
		default: return taskPeriod;
	}
}

function printError(jqXHR, textStatus, errorThrown) {
	printMessage("Connection Broken: "+textStatus+", "+errorThrown);
}

function printMessage(msg) {
	return $.tmpl("messageBoxTemplate", [{message: msg}]).appendTo("#mainBody").dialog({
		resizable: false,
		modal: true,
		buttons: [{
			text: Locale["backup.dialog.close"],
			click: function() {
				$(this).dialog("destroy");
			}
		}]
	});
}

function showProcessingDialog() {
	var view=$("<div style='text-align:center;'><img src='css/image/progress.gif'/>"+Locale["backup.dialog.processing"]+"</div>").dialog({
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








