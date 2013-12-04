// JavaScript Document

function getUsername() {
	try{
		var ss=Base64.decode($.cookie("_ss"));
		var username=ss.substring(0, ss.indexOf(":"));
		return username;
	}catch(e) {
		return "";
	}
}

function getPassword() {
	try{
    	var ss=Base64.decode($.cookie("_ss"));
		var password=ss.substring(ss.indexOf(":")+1);
		return password;
	}catch(e) {
		return "";
	}
}

function signout() {
	try{
    	var ss=$.cookie("_ss","",{path:"/"});
		top.location.replace("index.html");
	}catch(e) {}
}

function getRole() {
	try{
    	var role=$.cookie("role");
    	if(null==role || ""==role) {
    		return "senior";
    	}else{
    		return role;
    	}
	}catch(e) {}
}









