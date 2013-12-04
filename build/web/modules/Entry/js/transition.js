// JavaScript Document

$(function(){
	$('#getVM').children(".icon").mouseover(function(){
		$(this).find('img').attr('src', 'css/image/getVM_2.png');
	}).mouseout(function(){
		$(this).find('img').attr('src', 'css/image/getVM.png');
	});
		   
	$('#getForm').children(".icon").mouseover(function(){
		$(this).find('img').attr('src', 'css/image/getForm_2.png');
	}).mouseout(function(){
		$(this).find('img').attr('src', 'css/image/getForm.png');
	});	
	
	$('#VMMan').children(".icon").mouseover(function(){
		$(this).find('img').attr('src', 'css/image/VMMan_2.png');
	}).mouseout(function(){
		$(this).find('img').attr('src', 'css/image/VMMan.png');
	});	
	
	$('#formMan').children(".icon").mouseover(function(){
		$(this).find('img').attr('src', 'css/image/formMan_2.png');
	}).mouseout(function(){
		$(this).find('img').attr('src', 'css/image/formMan.png');
	});	
	
	$('#VMManEndUser').children(".icon").mouseover(function(){
		$(this).find('img').attr('src', 'css/image/VMMan_2.png');
	}).mouseout(function(){
		$(this).find('img').attr('src', 'css/image/VMMan.png');
	});	
	
});