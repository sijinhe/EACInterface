// JavaScript Document

$(function(){
	
	if(""==getUsername() || ""==getPassword()) {
		window.top.location.replace("../../");
	}
	
	$("#banner").html(Locale["entry.banner"]);
	$("#entry_title").html(Locale["entry.title"]);
	$("#entry_notice_title").html(Locale["entry.notice.title"]);
	$("#entry_dock_title").html(Locale["entry.dock.title"]);
	
	
	$("#getVM").children("label").html(Locale["entry.getVM"]);
	
	$("#VMMan").children("label").html(Locale["entry.getForm"]);
	
	$("#getForm").children("label").html(Locale["entry.VMMan"]);
	
	$("#formMan").children("label").html(Locale["entry.formMan"]);
	
	$("#VMManEndUser").children("label").html(Locale["entry.VMManEndUser"]);
	
	
	// notice what you want
	$("#entry_notice_content").html("<p>欢迎使用云平台, 请使用左侧导航栏进行相关的操作, 使用过程中若遇到问题请参考使用手册或联系管理员.</p><p>Welcome to the cloud platform, use the left navigation bar to the operation of the process of using encounter problems, <br/>please refer to the manual or contact the administrator.</p>");
	
	/* Senior User */
	$("#getVM").delegate(".icon,.iconName","click",function(){
		window.parent.loadModule("modules/Legacy/host_index.html");
	});
	
	$("#VMMan").delegate(".icon,.iconName","click",function(){
		window.parent.loadModule("modules/Instance/index.html");
	});
	
	$("#getForm").delegate(".icon,.iconName","click",function(){
		window.parent.loadModule("modules/Bedivere/index.html");
	});
	
	$("#formMan").delegate(".icon,.iconName","click",function(){
		window.parent.loadModule("modules/Bedivere/index.html?action=instance");
	});
	
	/* Junior User */
	$("#VMManEndUser").delegate(".icon,.iconName","click",function(){
		window.parent.loadModule("modules/Instance/index.html");
	});
});

function appendParams(module) {
	return module+"?"+["user="+getUsername(), "role=is_user"].join("&");
}

