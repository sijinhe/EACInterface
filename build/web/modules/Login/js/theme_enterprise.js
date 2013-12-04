// JavaScript Document

var Template_Autumn='\
    <div id="grids"></div>\
 ';

$(function(){
	$.template("themeAutumn", Template_Autumn);
	$.tmpl("themeAutumn").appendTo("#container");
	
	var locale=$.cookie("locale");
	
	var pic_login_common=Resource["button.login.common"];
	var pic_login_hover=Resource["button.login.hover"];
	var pic_register_common=Resource["button.register.common"];
	var pic_register_hover=Resource["button.register.hover"];
	
	$("#logBtn").children("img").attr("src", pic_login_common);
	$("#regBtn").children("img").attr("src", pic_register_common);
	
	
	$('#logBtn').mouseover(function(){
		$(this).find('img').attr('src', pic_login_hover);
	}).mouseout(function(){
		$(this).find('img').attr('src', pic_login_common);
	});	
	
	$('#regBtn').mouseover(function(){
		$(this).find('img').attr('src', pic_register_hover);
	}).mouseout(function(){
		$(this).find('img').attr('src', pic_register_common);
	});
	
});