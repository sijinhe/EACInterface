// JavaScript Document
function fixTop() {
    var top=($(window).height()-$('#container').height())*0.3;
    top=top>0?top:0;
    $('body').css('height', $(window).height());
    $('#container').css('top', top);
}

function enter() {
	$('#logBtn').trigger('click');
	return false;
}

function parseLang(language) {
	switch(language) {
		case "zh_CN": return "cn";
		case "en_GB": return "en";
		default: return "en";
	}
}

function login(usr, pwd, language) {// 用户名, 密码, 登陆的平台
	$("#logingIcon").show();
	$.ajax({
		url: Server+"/RedDragonEnterprise/loginCtrlServlet",//billingCN
		type: "POST",
		data: {
			methodtype: "login",
			loginuser: usr,
			password: pwd,
			language: parseLang(language),
			loginas: "is_user"
		}, 
		success: function(data){
			$("#logingIcon").hide();
			try{
				var obj=$.parseJSON(data);
				if(obj.status=='done') {
					// 登录成功
					var username=obj.session; //当前用户
					
					// 记录cookie
					$.cookie("_ss", Base64.encode([username, pwd].join(":")), {path:"/"});
					
					// 判定用户类型
					var usertype=obj.usertype;
			
					// 重定向
					if(usertype=='normaluser') {
						$.cookie("role","senior",{path:"/"});
						window.location.replace('../../index.html?role=senior');
					}else if(usertype=='subuser') {
						$.cookie("role","junior",{path:"/"});
						window.location.replace('../../index.html?role=junior');
					}else {
						$.cookie("role","",{path:"/"});
						$('#message').html(Locale["login.message.usertype_error"]);
					}
					
				}else {
					// 登录失败
					var reason='';
					switch(obj.status) {
						case 'nosuchuser':reason=Locale["login.message.nosuchuser"];break;
						case 'wrongpass':reason=Locale["login.message.wrongpass"];break;
						case 'notactive':reason=Locale["login.message.notactive"];break;
						case 'suspended':reason=Locale["login.message.suspended"];break;
						case 'notadmin':reason=Locale["login.message.notadmin"];break;
						case 'exception':reason=Locale["login.message.exception"];break;
						default :reason=Locale["login.message.unknown"].sprintf(data);
					}
					$('#message').html(Locale["login.message.failure"].sprintf(reason));
				}
			}catch(e){
				alert(Locale["login.message.maintain"]);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$("#logingIcon").hide();
			alert(Locale["login.message.maintain"]);
		}
	});
	
	return false;
}

$(function(){
	$("#logingIcon").hide();
	
	// 登陆按钮
	$('#logBtn').click(function(){
		var tips="";
		var isok=true;
		if(jQuery.trim($('#username').val())=='') {
			tips=Locale["login.message.username_empty"];
			isok=false;
		}else if(jQuery.trim($('#password').val())=='') {
			tips=Locale["login.message.password_empty"];
			isok=false;
		}
		
		var language=$("select[name='language']").val();
		
		if(!isok) {
			$('#message').html(tips);
		}else {
			login($('#username').val(), $('#password').val(), language);
		}	
	
		return false;
	});
	
	// set up default locale
	var formal=$.cookie("locale");
	if(null!=formal) {
		$("select[name='language']").val(formal);
	}else{ // null locale
		$.cookie("locale", $("select[name='language']").val(), {path:"/"});
	}
	$("select[name='language']").bind("change", function(){
		var present=$(this).val();
		$.cookie("locale", present, {path:"/"});
		window.location.reload();
	});
	
	// register
	$('#regBtn').click(function(){
		var locale=$.cookie("locale");
		if(locale=="en_GB") {
			window.open('../Legacy/register.en_GB.html');	
		}else{
			window.open('../Legacy/register.html');	
		}
	});
	
	$('#rsnBtn').click(function(){
		window.open('../Legacy/findpwd.html');
	});  
	
	$('#username').focus();
	
	$(window).resize(function(){
		fixTop();
	});
	
	fixTop();
  
	$('#username,#password').bind('keydown',function(event){  
		if(event.keyCode==13) {
			enter();
		}
	});
	
	
	// locale
	$("#labelUsername").html(Locale["login.label.username"]);
	$("#labelPassword").html(Locale["login.label.password"]);
	$("#rsnBtn").html(Locale["login.label.forget"]);
	
  
});





