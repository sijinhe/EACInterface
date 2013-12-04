/*
 * usage: get url paras
 */
function getParas(url) {
  var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
  var paras={};
	for (i=0; j=paraString[i]; i++){  
		paras[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);  
	}
	return paras;
}

function getBrowser() {
  var ua=navigator.userAgent;
  //alert(ua);
  
  if(ua.indexOf('Opera')>-1) {
    return 'OPERA';
  }else if(ua.indexOf('Firefox')>-1) {
    return 'FIREFOX';
  }else if(ua.indexOf('Safari')>-1) {
    return 'SAFARI';
  }else if(ua.indexOf('compatible')>-1 && ua.indexOf('MSIE')>-1) {
    return 'IE';
  }else {
    return 'UNKNOWN';
  }
  
}

function userStatusCheck(xml) {
 if($(xml).find('status').text().toLowerCase()=='login_first') {
  alert('Session expired!');
  top.location.replace('/Enterprise/index.html');  
 }
}

String.prototype.makeDetailStr=function(key, value) {
	var _self=this;
	if(null==this || this=='') {
		
	}else{
		_self+='||';
	}	
	_self+=(escape(key)+'##'+escape(value));
	return _self;
};

function getExplorerDetail() {
    //---
    var browserName = navigator.userAgent.toLowerCase();
    thebrowser = {
    	version: (browserName.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
    	safari: /webkit/i.test(browserName) && !this.chrome,
    	opera: /opera/i.test(browserName),
        firefox:/firefox/i.test(browserName),
    	ie: /msie/i.test(browserName) && !/opera/.test(browserName),
    	mozilla: /mozilla/i.test(browserName) && !/(compatible|webkit)/.test(browserName) && !this.chrome,
        chrome: /chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName)
    };
    
    var retVal='';
    if(thebrowser.chrome) 
    	retVal='Chrome '+(browserName.match(/.+(?:rv|me)[\/: ]([\d.]+)/) || [0, '0'])[1];
    else if(thebrowser.mozilla) 
    	retVal='Mozilla '+thebrowser.version;
    else if(thebrowser.ie) 
    	retVal='MS IE '+thebrowser.version;
    else if(thebrowser.firefox) 
    	retVal='Firefox '+thebrowser.version;
    else if(thebrowser.opera) 
    	retVal='Opera '+thebrowser.version;
    else if(thebrowser.safari) 
    	retVal='Safari '+thebrowser.version;
    
    return retVal;
};

function getOSDetail(){
	var sUserAgent=navigator.userAgent;
	
    // os part
    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");   
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC")    
        || (navigator.platform == "Macintosh");   
    
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;   
    var isWin95 = isWin98 = isWinNT4 = isWin2K = isWinME = isWinXP =isWin2003=isWin7Or2008= false;   
    var isMac68K = isMacPPC = false;   
    var isSunOS = isMinSunOS4 = isMinSunOS5 = isMinSunOS5_5 = false;
    
    if (isWin) {   
        isWin95 = sUserAgent.indexOf("Win95") > -1    
                  || sUserAgent.indexOf("Windows 95") > -1;   
        isWin98 = sUserAgent.indexOf("Win98") > -1    
                  || sUserAgent.indexOf("Windows 98") > -1;   
        isWinME = sUserAgent.indexOf("Win 9x 4.90") > -1    
                  || sUserAgent.indexOf("Windows ME") > -1;   
        isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1    
                  || sUserAgent.indexOf("Windows 2000") > -1;   
        isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1    
                  || sUserAgent.indexOf("Windows XP") > -1;
        isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1    
                  || sUserAgent.indexOf("Windows 2003") > -1;
        isWin7Or2008 = sUserAgent.indexOf("Windows NT 6.1") > -1    
        		  || sUserAgent.indexOf("Windows NT 7.0") > -1   
        		  || sUserAgent.indexOf("Windows 2008") > -1       
                  || sUserAgent.indexOf("Windows 7") > -1;    
        isWinNT4 = sUserAgent.indexOf("WinNT") > -1    
                  || sUserAgent.indexOf("Windows NT") > -1    
                  || sUserAgent.indexOf("WinNT4.0") > -1    
                  || sUserAgent.indexOf("Windows NT 4.0") > -1    
                  && (!isWinME && !isWin2K && !isWinXP);   
    } 
    
    if (isMac) {   
        isMac68K = sUserAgent.indexOf("Mac_68000") > -1    
                   || sUserAgent.indexOf("68K") > -1;   
        isMacPPC = sUserAgent.indexOf("Mac_PowerPC") > -1    
                   || sUserAgent.indexOf("PPC") > -1;     
    } 
    
    if (isUnix) {   
        isSunOS = sUserAgent.indexOf("SunOS") > -1;   
       
        if (isSunOS) {   
            var reSunOS = new RegExp("SunOS (\\d+\\.\\d+(?:\\.\\d+)?)");   
            reSunOS.test(sUserAgent);   
            isMinSunOS4 = compareVersions(RegExp["$1"], "4.0") >= 0;   
            isMinSunOS5 = compareVersions(RegExp["$1"], "5.0") >= 0;   
            isMinSunOS5_5 = compareVersions(RegExp["$1"], "5.5") >= 0;   
        }   
    }
    
    var retStr='';
    if(isWin){
    	if(isWin95)
    		retStr+='Windows 95';
    	else if(isWin98)
    		retStr+='Windows 98';
    	else if(isWinME)
    		retStr+='Windows ME';
    	else if(isWin2K)
    		retStr+='Windows 2000';
    	else if(isWinXP)
    		retStr+='Windows XP';
    	else if(isWin2003)
    		retStr+='Windows 2003';
    	else if(isWin7Or2008)
    		retStr+='Windows 7 / Windows 2008';
    	else if(isWinNT4)
    		retStr+='Windows NT4';
    	else 
    		retStr+='未知版本的Windows';
    }else if(isMac){
    	retStr+='Mac OS';
    }else if(isSunOS){
    	if(isMinSunOS4)
    		retStr+='Sun OS 4';
    	else if(isMinSunOS5) 
    		retStr+='Sun OS 5';
    	else if(isMinSunOS5_5) 
    		retStr+='Sun OS 5.5';
    	else
    		retStr+='未知版本的Sun OS';
    }else if(isUnix){
    	retStr+='Unix';
    }
    
    return retStr;
};

function compareVersions(sVersion1, sVersion2) {   
    
    var aVersion1 = sVersion1.split(".");   
    var aVersion2 = sVersion2.split(".");   
       
    if (aVersion1.length > aVersion2.length) {   
        for (var i=0; i < aVersion1.length - aVersion2.length; i++) {   
            aVersion2.push("0");   
        }   
    } else if (aVersion1.length < aVersion2.length) {   
        for (var i=0; i < aVersion2.length - aVersion1.length; i++) {   
            aVersion1.push("0");   
        }       
    }   
       
    for (var i=0; i < aVersion1.length; i++) {   
        if (aVersion1[i] < aVersion2[i]) {   
            return -1;   
        } else if (aVersion1[i] > aVersion2[i]) {   
            return 1;   
        }       
    }              
    return 0;          
} 

function makeStatics() {
	
	var tmpStr=''+
		'<script language="javascript" type="text/javascript" src="http://js.users.51.la/4560077.js"></script>'+
		'<noscript><a href="http://www.51.la/?4560077" target="_blank">'+
		'<img alt="&#x6211;&#x8981;&#x5566;&#x514D;&#x8D39;&#x7EDF;&#x8BA1;" '+
		'src="http://img.users.51.la/4560077.asp" style="border:none;" /></a></noscript>';
	
	document.write(tmpStr);
}


function getAssist(){

	var assistTemplate=""+
		"<div id='floatHelper' style='position:absolute;width:200px;height:325px;top:0px;left:760px;text-align:left;'>"+
		"<div id='assist_main' style='text-align:left;width:120px;height:260px;background:url(image/bigimg/assist2.png) no-repeat;cursor:pointer;display:none;margin-left:75px'"+
		" onclick='$(\'#assist_main\').hide();$(\'#assist_tips\').show();'>"+
		"<div style='position:relative;left:8px;top:45px;width:100px;'>"+
		"<div style='border-bottom:1px dotted #404040;'>"+
		"施工中!!!<br/><br/>"+
		"这里可以帮助你<br/>" +
		"这里可以帮助你<br/>" +
		"这里可以帮助你<br/>" +
		"</div>" +
		"<div>" +
		"ViaCloud" +
		"</div>" +
		"</div>" +
		"</div>" +
		"<div id='assist_tips' style='margin-left:140px;width:45px;height:165px;background:url(image/bigimg/assist.png) no-repeat;cursor:pointer;' onclick='$(\'#assist_tips\').hide();$(\'#assist_main\').show();'></div>" +
		"</div>";

}




