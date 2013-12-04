// JavaScript Document
// Author: Bill, 2011

$(function(){
	$(window).bind("resize", fixSize);
	
	getComponentList();
});

function getComponentList() {
	$.ajax({
		url: Server+"/LicenseManager/LicenseManager",
		type: "POST",
		cache: false,
		data: {
			methodtype: "checklicense"
		},
		success: function(data) {
			var menu=$("body").find(".menu");
			
			try {
				data=$.parseJSON(data);
				
				var map={};
				if(null==data.privatekey || ""==data.privatekey 
						|| "invalid_private_key"==data.privatekey 
						|| "private_key_missing"==data.privatekey
						|| "ignore"==data.privatekey) {
							
					alert(Locale["navigation.message.invalid_license"]);
					
					// goto the license page
					window.top.location="/SuperAdmin/debut.html";
					
				}else {
					var components=data.publickey.components;
					for(var i in components) {
						for(var key in components[i]) {
							map[key]=components[i][key];
						}
					}
					
					dumpMenu($(menu).children("ul").first(), map, $(menu).attr("type"));
					
					// -------------- init -------------
					initUI();
  
					$("a[zmlm\\\:module][zmlm\\\:type='flex']").each(function(){
						$(this).attr("zmlm:module", $(this).attr("zmlm:module")+"?"+["user="+getUsername(), "role=is_user", "username="+getUsername(),].join("&"));
					});
				  
					// ok, let's expand it acquiescently
					$("#menu1").trigger("click");
				  
					// and then open default page
					$("#menu0").trigger("click");
					
					$(".menu").delegate(".logout", "click", function(){
						signout();
					});
				}
			}catch(e) {
				alert(Locale["navigation.message.loading_failed"]);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			alert(Locale["navigation.message.loading_failed"]);
		}
	});
}

function dumpMenu(container, map, type) {
	if(type=="junior") {
		$("<li><a id=\"menu0\" class=\"noelements\" name=\"menuItemTitle\" zmlm:module=\"modules/Entry/junior.html\">"+Locale["navigation.menu.junior.index"]+"</a></li>").appendTo(container);
		
		var subMenu=$("<li><a id=\"menu1\" name=\"menuItemTitle\">"+Locale["navigation.menu.junior.myproduct"]+"</a><ul class=\"menuItem\"></ul></li>").appendTo(container).children(".menuItem");
		dumpMenuItem(map["vmmanagement"], subMenu, menuli("modules/Instance/index.html", Locale["navigation.menu.junior.vmman"]));
		dumpMenuItem(map["ipmanagement"], subMenu, menuli("modules/Network/index.html", Locale["navigation.menu.junior.ipman"]));
		dumpMenuItem(map["volumemanagement"], subMenu, menuli("modules/Volume/index.html", Locale["navigation.menu.junior.diskman"]));
		
		$("<li><a id=\"menu3\" class=\"logout\">"+Locale["navigation.menu.junior.signout"]+"</a></li>").appendTo(container);
		
	}else if(type=="senior") {
		$("<li><a id=\"menu0\" class=\"noelements\" name=\"menuItemTitle\" zmlm:module=\"modules/Entry/senior.html\">"+Locale["navigation.menu.junior.index"]+"</a></li>").appendTo(container);
		
		var subMenu=$("<li><a id=\"menu1\" name=\"menuItemTitle\">"+Locale["navigation.menu.senior.buyproduct"]+"</a><ul class=\"menuItem\"></ul></li>").appendTo(container).children(".menuItem");
		dumpMenuItem(map["vmmanagement"], subMenu, menuli("modules/Legacy/host_index.html", Locale["navigation.menu.senior.buyvm"]));
		dumpMenuItem(map["ipmanagement"], subMenu, menuli("modules/Legacy/ipaddr.html", Locale["navigation.menu.senior.buyip"]));
		dumpMenuItem(map["volumemanagement"], subMenu, menuli("modules/Legacy/volume.html", Locale["navigation.menu.senior.buydisk"]));
		dumpMenuItem(map["apptemplatemanagement"], subMenu, menuli("modules/Bedivere/index.html", Locale["navigation.menu.senior.buytemplate"]));
		dumpMenuItem(map["projectmanagement"], subMenu, menuli("modules/Project/index.html", Locale["navigation.menu.senior.buyproject"]));
		dumpMenuItem(true, subMenu, menuli("modules/Legacy/eac.html", Locale["navigation.menu.senior.buyeac"]));
		subMenu=$("<li><a id=\"menu2\" name=\"menuItemTitle\">"+Locale["navigation.menu.senior.myproduct"]+"</a><ul class=\"menuItem\"></ul></li>").appendTo(container).children(".menuItem");
		dumpMenuItem(map["vmmanagement"], subMenu, menuli("modules/Instance/index.html", Locale["navigation.menu.senior.vmman"]));
		dumpMenuItem(map["ipmanagement"], subMenu, menuli("modules/Network/index.html", Locale["navigation.menu.senior.ipman"]));
		dumpMenuItem(map["volumemanagement"], subMenu, menuli("modules/Volume/index.html", Locale["navigation.menu.senior.diskman"]));
		dumpMenuItem(map["vlanmanagement"], subMenu, menuli("modules/VLan/index.html", Locale["navigation.menu.senior.vlanman"]));
		dumpMenuItem(map["groupmanagement"], subMenu, menuli("modules/Group/index.html", Locale["navigation.menu.senior.groupman"]));
		// dumpMenuItem(map["groupmanagement"], subMenu, menuli("/flex_enterprise/MyGroup.html", Locale["navigation.menu.senior.groupman"], "flex"));
		dumpMenuItem(map["backup"], subMenu, menuli("modules/Backup/index.html", Locale["navigation.menu.senior.backup"]));
		dumpMenuItem(map["apptemplatemanagement"], subMenu, menuli("modules/Bedivere/index.html?action=instance", Locale["navigation.menu.senior.templateman"]));
		dumpMenuItem(map["projectmanagement"], subMenu, menuli("modules/Project/index.html?action=manage", Locale["navigation.menu.senior.projectman"]));
                dumpMenuItem(true, subMenu, menuli("modules/EAC/index.html", Locale["navigation.menu.senior.appcontainer"]));
		
		$("<li><a id=\"menu3\" class=\"logout\">"+Locale["navigation.menu.senior.signout"]+"</a></li>").appendTo(container);
	}
}

function menuli(module, label, type) {
	if(null!=type)
		return "<li><a href=\"#\" zmlm:module=\""+module+"\" zmlm:type=\""+type+"\">"+label+"</a></li>";
	else
		return "<li><a href=\"#\" zmlm:module=\""+module+"\">"+label+"</a></li>";
}

function dumpMenuItem(serv, parent, htmlText) {
	if(serv) {
		$(htmlText).appendTo(parent);
	}
}

function initUI() {
	$("a[name='menuItemTitle']").hover(
		function () {
			$(this).animate({paddingLeft:"22px"}, {queue:false});
		},
		function () {
			$(this).animate({paddingLeft:"12px"}, {queue:false});
		}
	);

	$("a[name='menuItemTitle']").each(function(){
		$(this).bind("click", function(){
		if($(this).is(":not(.noelements)")) {    
			$("a[name='menuItemTitle']").not(this).next(".menuItem").slideUp("medium");
			$(this).next(".menuItem").slideToggle('medium');
		}
      
		var module=$(this).attr("zmlm:module");
		if(module) {
			loadModule(module);
		}
    
		return false;
	}).next(".menuItem").find("a").bind("click", function(){    
    
		$(".menuItem").find("a").removeClass("selected");
			$(this).addClass("selected");
      		
			var moduleType=$(this).attr("zmlm:type");
			if("pending"==moduleType) {
				alert(Locale["navigation.message.invalid_module"]);
				return false;
			}
			
			var modulePath=$(this).attr("zmlm:module");
			loadModule(modulePath);
      
			return false;
		});
	});
}

function loadModule(modulePath) {
	var oldModulePath=$("#contentFrame").attr("src");
  
	//if(!modulePath || modulePath==oldModulePath) return;

	var view=$("<iframe id='contentFrame' style='height:100%;width:100%;border:0;overflow:auto;' frameborder=0 src='"+modulePath+"' scrolling='auto' onload='fixSize()'></iframe>").appendTo($(".right").empty());
  
}

function fixSize() {
  
	var height=$(window).height();
	var width=$(window).width()-$(".left").outerWidth();
  
  
	$("#contentFrame").height(height);
	$("#contentFrame").width(width);
  
}

