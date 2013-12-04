// JavaScript Document
// Author: Bill, 2011~2012

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
    $.template("vmPanelTemplate", Template_VmPanel);
    $.template("vmRowTemplate", Template_VmRow);
    $.template("vmDetailPanelTemplate", Template_VmDetailPanel);
    $.template("chartPanelTemplate", Template_ChartPanel);
    $.template("messageBoxTemplate", Template_MessageBox);
}

// ----------- Context Menu ------------
function showContextMenu(e, ui) {
    e.preventDefault();
    e.stopPropagation();
	
    var menu=$("#contextmenu").length>0?$("#contextmenu"):makeContextMenu();
    //$(menu).css("left", e.pageX).css("top", e.pageY);
    //$(menu).animate({left: e.pageX, top: e.pageY, }, {duration:200, queue:false});
    $(menu).data("target", e.target);
    $(menu).data("_x", e.pageX);
    $(menu).data("_y", e.pageY);
    $(menu).triggerHandler("show");
}

function hideContextMenu(e) {
    if($(e.target).parents("#contextmenu").andSelf().filter("#contextmenu").length==0) {
        $("#contextmenu").triggerHandler("hide");
    }
}

function makeContextMenu() {
    $("head").append("<style>.contextMenu {font-family:Arial,'微软雅黑',Helvetica,sans-serif;font-size:12px;position:absolute;top:0;left:0;padding:0;background:white;display:inline-block;width:132px;border:1px solid silver;z-index:24;-webkit-box-shadow: rgb(120, 120, 120) 2px 2px 4px;-moz-box-shadow: rgb(120, 120, 120) 2px 2px 4px;-ms-box-shadow: rgb(120, 120, 120) 2px 2px 4px;-o-box-shadow: rgb(120, 120, 120) 2px 2px 4px;}</style>");
    $("head").append("<style>.contextMenuItem {-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;display:list-item;line-height:22px;height:22px;padding:2px;cursor:default;font-size:12px;line-height:22px;white-space:nowrap;list-style:none;text-align:-webkit-match-parent;padding:0;margin:0;} .contextMenuItem > label{display:inline-block;line-height:20px;vertical-align:bottom;}</style>");
    $("head").append("<style>.contextMenuItemIcon {vertical-align:middle;display:inline-block;margin-right:10px;margin-left:5px;border:0;width:16px;height:16px;}</style>");
    $("head").append("<style>.contextMenuItemIconDetail {background:url(css/image/context-menu-properties.png);}</style>");
    $("head").append("<style>.contextMenuItemIconCamera {background:url(css/image/context-menu-camera.png);}</style>");
    $("head").append("<style>.contextMenuItemIconFancyVNC {background:url(css/image/context-menu-fancy-vnc.png);}</style>");
    $("head").append("<style>.contextMenuItemHighlight {background:url(css/image/context-menu-highlight.png) 0 bottom repeat-x;} .contextMenuItemHighlight>label{color:#ffffff;}</style>");
    $("head").append("<!--[if IE]><style>.contextMenuItemHighlight {background:#224488;} .contextMenuItemHighlight>label{color:#ffffff;}</style><![endif]-->");
	
    // construct context menu body
    var menu=$("<span id='contextmenu' class='contextMenu'></span>").appendTo("body").hide();
	
    $(menu).bind("show", function(){
        var x=$(menu).data("_x");
        var y=$(menu).data("_y");
		
        if($(menu).is(":visible")) {
            $(menu).slideUp(100, function(){
                $(menu).css("left", x).css("top", y);
                $(menu).slideDown(200);
            });
        }else{
            $(menu).css("left", x).css("top", y);
            $(menu).slideDown(200);
        }
    }).bind("hide", function(){
        $(menu).slideUp(100);
    });
	
    $(menu).delegate(".contextMenuItem","mouseover",function(){
        $(this).addClass("contextMenuItemHighlight");
    }).delegate(".contextMenuItem","mouseout", function(){
        $(this).removeClass("contextMenuItemHighlight");
    });
	
    // construct items
    var itemDetail=$("<span class='contextMenuItem'><span class='contextMenuItemIcon contextMenuItemIconDetail'></span><label>"+Locale["eacm.template.eacm.detail"]+"</label></span>").appendTo(menu);
    $(itemDetail).bind("click", function(){
        $(menu).hide();
        var target=$(menu).data("target");
        detail(target);
    });
	
    var itemVNC=$("<span class='contextMenuItem'><span class='contextMenuItemIcon contextMenuItemIconFancyVNC'></span><label>Fancy-VNC (Lab)</label></span>").appendTo(menu);
    $(itemVNC).bind("click", function(){
        $(menu).hide();
        var target=$(menu).data("target");
		
        var data=$(target).parents(".vmRow").andSelf().data("data");
		
        try{
            var host=decodeURI((RegExp('HOST=' + '(.+?)(&|$)').exec(data.accesspoint.substring(data.accesspoint.indexOf("?")))||[,null])[1]);
            var port=decodeURI((RegExp('PORT=' + '(.+?)(&|$)').exec(data.accesspoint.substring(data.accesspoint.indexOf("?")))||[,null])[1]);
            var timestamp=$.now();
			
            var key="key="+[Base64.encode(host),Base64.encode(port),Base64.encode(""+timestamp)].join("ZZ");
			
            window.open("../WebVNC/vnc.jsp?"+key);
        }catch(e){
        //maybe creating or not exist
        }
		
    });
	
    return $(menu);
}
// ----------- Context Menu ------------

function setup() {
    $("#mainBody").empty();
	
    var panel=$.tmpl("vmPanelTemplate", [{
        id:"vmPanel"
    }]).appendTo("#mainBody");
	
    var detailPanel=$.tmpl("vmDetailPanelTemplate", [{
        id:"vmDetailPanel"
    }]).appendTo("#mainBody");
	
    // set up highlight & selection effect for [task]
    $(panel).delegate(".vmRow", "mouseover", function() {
        $(this).addClass("hover");
    }).delegate(".vmRow", "mouseout", function() {
        $(this).removeClass("hover");
    });
	
    // set up detail panel dialog
    $(detailPanel).dialog({
        title: Locale["eacm.dialog.title.detail"],
        autoOpen: false,
        width: 600,
        resizable: false,
        modal: true,
        buttons: [
        {
            text: Locale["volume.dialog.close"],
            click: function() {
                $(this).dialog("close");
            }
        }
        ]
    });
	
    // load data to display
    loadVm();
}

function initUi() {
    // jquery ui init
    $("button").button();
	
    $("#banner").html(Locale["eacm.banner"]);
	
    $(document).click(function(e){
        hideContextMenu(e);
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

function printError(jqXHR, textStatus, errorThrown) {
    printMessage("Connection Broken: "+textStatus+", "+errorThrown);
}

function printMessage(msg) {
    return $.tmpl("messageBoxTemplate", [{
        message: msg
    }]).appendTo("#mainBody").dialog({
        resizable: false,
        modal: true,
        buttons: [
        {
            text: Locale["eacm.dialog.close"],
            click: function() {
                $(this).dialog("destroy");
            }
        }
        ]
    });
}

function showProcessingDialog() {
    var view=$("<div style='text-align:center;'><img src='css/image/progress.gif'/>"+Locale["eacm.dialog.processing"]+"</div>").dialog({
        autoOpen: true,
        width: 240,
        height: 100,
        resizable: false,
        modal: true,
        closeOnEscape: false,
        open: function(event, ui) {
            $(".ui-dialog-titlebar-close").hide();
        },
        buttons: {
    }
    });
    return view;
}


/* Module Specified */
function loadVm() {
    var list=$("#vmPanel").find("span[zmlm\\\:item='vmList']").empty();
    $("<em>"+Locale["eacm.message.loading"]+"</em>").appendTo(list);
	
    $.ajax({
        type: "POST",
        url: Server+"/EACCloudControl/ListEAC",
        cache: false,
        data: {
            login: getUsername()
        },
        success: function(data) {
            try{
                data=$.parseJSON(data);
				
                if(data.length>0){
                    $(list).empty();
					
                    // instance it, and bind data by the way
                    for(var i=0; i<data.length; i++) {
                        var row=$.tmpl("vmRowTemplate", data[i]).appendTo(list);
                        row.data("data", data[i]);
						
                        i%2==0?$(row).addClass("rowEven"):$(row).addClass("rowOdds");
                    }
                }else{
                    $("<em>"+Locale["eacm.message.no_data"]+"</em>").appendTo($(list).empty());
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


function startapp(which) {
    var id=$(which).parents(".vmRow").first().find("input[zmlm\\\:item='vmId']").val();


    if(!confirm(Locale["eacm.confirm.eacm.startapp"])) return;

    var pd=showProcessingDialog();

    $.ajax({
        type: "POST",
        url: Server+"/EACCloudControl/StartAPP",
        cache: false,
        data: {
            containerid: id
        },
        success: function(data) {
            pd.dialog("destroy");
            try{
                data=$.parseJSON(data);

                var msg="";

                if(data.result){
                    msg=Locale["eacm.message.operation.done"];
                } else {
                    msg=Locale["eacm.message.operation.failtostop"];
                }

                printMessage(msg);

                loadVm();

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

function stopapp(which) {
    var id=$(which).parents(".vmRow").first().find("input[zmlm\\\:item='vmId']").val();


    if(!confirm(Locale["eacm.confirm.eacm.stopapp"])) return;

    var pd=showProcessingDialog();

    $.ajax({
        type: "POST",
        url: Server+"/EACCloudControl/StopAPP",
        cache: false,
        data: {
            containerid: id
        },
        success: function(data) {
            pd.dialog("destroy");
            try{
                data=$.parseJSON(data);

                var msg="";

                if(data.result){
                    msg=Locale["eacm.message.operation.done"];
                } else {
                    msg=Locale["eacm.message.operation.failtostop"];
                }

                printMessage(msg);

                loadVm();

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

function log(which) {
    var id=$(which).parents(".vmRow").first().find("input[zmlm\\\:item='vmId']").val();
    var clusterip=$(which).parents(".vmRow").first().find("input[zmlm\\\:item='clusterip']").val();
    var currentTime = new Date();
    var year = currentTime.getFullYear();
    var month = currentTime.getMonth() + 1;
    if(month < 10){
        month = "0" + month;
    }
    var day = currentTime.getDate();

    if(day < 10){
        day = "0" + day;
    }

    var date = year + "-" + month + "-" + day;

    var pd=showProcessingDialog();

    $.ajax({
        type: "POST",
        url: Server+"/EACCloudControl/Logging",
        cache: false,
        data: {
            containerid: id,
            clusterip: clusterip,
            date: date
        },
        success: function(data) {
            pd.dialog("destroy");
            try{
                data=$.parseJSON(data);

                var msg="";

                if(data.result){
                    msg=Locale["eacm.message.operation.done"];
                } else {
                    msg=Locale["eacm.message.operation.failtostop"];
                }

                printMessage(msg);

                loadVm();

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

function reloadapp(which) {
    var id=$(which).parents(".vmRow").first().find("input[zmlm\\\:item='vmId']").val();


    if(!confirm(Locale["eacm.confirm.eacm.reloadapp"])) return;

    var pd=showProcessingDialog();

    $.ajax({
        type: "POST",
        url: Server+"/EACCloudControl/ReloadAPP",
        cache: false,
        data: {
            containerid: id
        },
        success: function(data) {
            pd.dialog("destroy");
            try{
                data=$.parseJSON(data);

                var msg="";

                if(data.result){
                    msg=Locale["eacm.message.operation.done"];
                } else {
                    msg=Locale["eacm.message.operation.failtostop"];
                }

                printMessage(msg);

                loadVm();

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

function undeployapp(which) {
    var id=$(which).parents(".vmRow").first().find("input[zmlm\\\:item='vmId']").val();


    if(!confirm(Locale["eacm.confirm.eacm.undeployapp"])) return;

    var pd=showProcessingDialog();

    $.ajax({
        type: "POST",
        url: Server+"/EACCloudControl/UndeployAPP",
        cache: false,
        data: {
            containerid: id
        },
        success: function(data) {
            pd.dialog("destroy");
            try{
                data=$.parseJSON(data);

                var msg="";

                if(data.result){
                    msg=Locale["eacm.message.operation.done"];
                } else {
                    msg=Locale["eacm.message.operation.failtostop"];
                }

                printMessage(msg);

                loadVm();

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

function disableapp(which) {
    var id=$(which).parents(".vmRow").first().find("input[zmlm\\\:item='vmId']").val();
   
    
    if(!confirm(Locale["eacm.confirm.eacm.disableapp"])) return;

    var pd=showProcessingDialog();

    $.ajax({
        type: "POST",
        url: Server+"/EACCloudControl/DisableAPP",
        cache: false,
        data: {
            containerid: id
        },
        success: function(data) {
            pd.dialog("destroy");
            try{
                data=$.parseJSON(data);

                var msg="";

                if(data.result){
                    msg=Locale["eacm.message.disable.done"];
                } else {
                    msg=Locale["eacm.message.disable.failtostop"];
                }

                printMessage(msg);

                loadVm();

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

function disabledb(which) {
    var id=$(which).parents(".vmRow").first().find("input[zmlm\\\:item='vmId']").val();
    
    
    if(!confirm(Locale["eacm.confirm.eacm.disabledb"])) return;

    var pd=showProcessingDialog();

    $.ajax({
        type: "POST",
        url: Server+"/EACCloudControl/DisableDB",
        cache: false,
        data: {
            containerid: id
        },
        success: function(data) {
            pd.dialog("destroy");
            try{
                data=$.parseJSON(data);

                var msg="";

                if(data.result){
                    msg=Locale["eacm.message.disable.done"];
                } else {
                    msg=Locale["eacm.message.disable.failtostop"];
                }

                printMessage(msg);

                loadVm();

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

function enableapp(which) {
    var id=$(which).parents(".vmRow").first().find("input[zmlm\\\:item='vmId']").val();

    
    if(!confirm(Locale["eacm.confirm.eacm.enableapp"])) return;

    var pd=showProcessingDialog();

    $.ajax({
        type: "POST",
        url: Server+"/EACCloudControl/EnableAPP",
        cache: false,
        data: {
            containerid: id
        },
        success: function(data) {
            pd.dialog("destroy");
            try{
                data=$.parseJSON(data);

                var msg="";

                if(data.result){
                    msg=Locale["eacm.message.enable.done"];
                } else {
                    msg=Locale["eacm.message.enable.failtostop"];
                }

                printMessage(msg);

                loadVm();

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

function enabledb(which) {
    var id=$(which).parents(".vmRow").first().find("input[zmlm\\\:item='vmId']").val();


    if(!confirm(Locale["eacm.confirm.eacm.enabledb"])) return;

    var pd=showProcessingDialog();

    $.ajax({
        type: "POST",
        url: Server+"/EACCloudControl/EnableDB",
        cache: false,
        data: {
            containerid: id
        },
        success: function(data) {
            pd.dialog("destroy");
            try{
                data=$.parseJSON(data);

                var msg="";

                if(data.result){
                    msg=Locale["eacm.message.enable.done"];
                } else {
                    msg=Locale["eacm.message.enable.failtostop"];
                }

                printMessage(msg);

                loadVm();

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


function deleteEAC(which) {
    var id=$(which).parents(".vmRow").first().find("input[zmlm\\\:item='vmId']").val();
    var name=$(which).parents(".vmRow").first().find("input[zmlm\\\:item='name']").val();
    var appstatus=$(which).parents(".vmRow").first().find("input[zmlm\\\:item='appstatus']").val();
    var dbstatus=$(which).parents(".vmRow").first().find("input[zmlm\\\:item='dbstatus']").val();

    if(appstatus=="NOT_IN_USE" && dbstatus == "NOT_IN_USE"){
        if(!confirm(Locale["eacm.confirm.eacm.remove"].sprintf(name))) return;

    } else {
        confirm(Locale["eacm.confirm.eacm.illegal"].sprintf(name));
        return;
    }

    var pd=showProcessingDialog();

    $.ajax({
        type: "POST",
        url: Server+"/EACCloudControl/DeleteEAC",
        cache: false,
        data: {          
            containerid: id
        },
        success: function(data) {
            pd.dialog("destroy");
            try{
                data=$.parseJSON(data);

                var msg="";

                if(data.result){
                    msg=Locale["eacm.message.remove.done"];
                } else {
                    msg=Locale["eacm.message.remove.failtostop"];
                }

                printMessage(msg);

                loadVm();

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



function detail(which) {
	
    var panel=$("#vmDetailPanel");
	
    var data=$(which).parents(".vmRow").andSelf().data("data");

    if(null!=data) {
        // bind up data first
        $(panel).data("data", data);
		
        if(data.appname!= undefined){
            $(panel).find("[name='appname']").html(data.appname);
            $(panel).find("[name='appaccess']").html("<a TARGET='_blank' href='http://" + data.clusterip + "/"+ data.appname + "'>" + data.clusterip + "/"+ data.appname + "</a>");
        } else {
            $(panel).find("[name='appname']").html("APP Disabled");
            $(panel).find("[name='appaccess']").html("No Access Point Available");
        }
      
        if(data.appstatus=="RUNNING") {
            $(panel).find("[name='appstatusicon']").attr("class", "ui-icon ui-icon-play");
            $(panel).find("[name='appstatusdisplay']").html("Running");
        }
        if(data.appstatus=="STOPPED"){
            $(panel).find("[name='appstatusicon']").attr("class", "ui-icon ui-icon-power");
            $(panel).find("[name='appstatusdisplay']").html("Stopped");
        }
        if(data.appstatus=="NOT_IN_USE"){
            $(panel).find("[name='appstatusicon']").attr("class", "ui-icon ui-icon-power");
            $(panel).find("[name='appstatusdisplay']").html("Disabled");
        }
        if(data.appstatus=="VACANT"){
            $(panel).find("[name='appstatusicon']").attr("class", "ui-icon ui-icon-refresh");
            $(panel).find("[name='appstatusdisplay']").html("Waiting for Upload");
        }

        if(data.dbaccesspoint!= undefined){
            $(panel).find("[name='dbaccess']").html(data.dbaccesspoint);
        } else {
            $(panel).find("[name='dbaccess']").html("No Public Point Available");
        }

        if(data.dbport!= undefined){
            $(panel).find("[name='dbaccessport']").html(data.dbport);
        } else {
            $(panel).find("[name='dbaccessport']").html("No Public Port Available");
        }

        if(data.privatedbaccesspoint!= undefined){
            $(panel).find("[name='privatedbaccess']").html(data.privatedbaccesspoint);
        } else {
            $(panel).find("[name='privatedbaccess']").html("No Private Point Available");
        }

        if(data.privatedbport!= undefined){
            $(panel).find("[name='privatedbaccessport']").html(data.privatedbport);
        } else {
            $(panel).find("[name='privatedbaccessport']").html("No Private Port Available");
        }

        if(data.dbname!= undefined){
            $(panel).find("[name='dbname']").html(data.dbname);
        } else {
            $(panel).find("[name='dbname']").html("DB Disabled");
        }
        
        
        $(panel).find("[name='maxcon']").html(data.maxcon);
        $(panel).find("[name='inst']").html(data.inst);
       

        if(data.dbstatus=="RUNNING") {
            $(panel).find("[name='dbstatusicon']").attr("class", "ui-icon ui-icon-play");
            $(panel).find("[name='dbstatusdisplay']").html("Running");
        }
        if(data.dbstatus=="STOPPED"){
            $(panel).find("[name='dbstatusicon']").attr("class", "ui-icon ui-icon-power");
            $(panel).find("[name='dbstatusdisplay']").html("Stopped");
        }
        if(data.dbstatus=="NOT_IN_USE"){
            $(panel).find("[name='dbstatusicon']").attr("class", "ui-icon ui-icon-refresh");
            $(panel).find("[name='dbstatusdisplay']").html("Disabled");
        }

        
        //
        //
        //        if(typeof(data.publicips)=="string") {
        //            $(panel).find("[name='publicips']").html(data.publicips);
        //        }else {
        //            var pips=[];
        //            for(var i=0; i<data.publicips.length; i++) {
        //                pips.push(data.publicips[i].publicip);
        //            }
        //            $(panel).find("[name='publicips']").html(pips.join(", "));
        //        }
        //        $(panel).find("[name='accesspoint']").children("a").attr("href", data.accesspoint);
        //        $(panel).find("[name='vmpasswd']").children("a").data("privateip", data.privateip);
        //        $(panel).find("[name='vmpasswd']").children("a").data("ostype", data.ostype);
        //
        //        // set up CPU slider
        $(panel).find("[name='maxallowcons']").html(data.maxallowcons);

        $(panel).find("[name='slider_con']").slider("destroy").slider({
            value: data.maxcon,
            min: 5,
            max: data.maxallowcons,
            step: 5,
            animate: true,
            range: "min",
            slide: function(event, ui) {
                $(panel).find("[name='maxcon']").html(ui.value);
            }
        });

        $(panel).find("[name='maxinst']").html(data.maxinst);

        $(panel).find("[name='slider_inst']").slider("destroy").slider({
            value: data.inst,
            min: 1,
            max: data.maxinst,
            step: 1,
            animate: true,
            range: "min",
            slide: function(event, ui) {
                $(panel).find("[name='maxinst']").html(ui.value);
            }
        });
		
        // set up memory slider
        //        $(panel).find("[name='slider_mem']").slider("destroy").slider({
        //            value: data.memory, // KB unit
        //            min: 1024*1024, // =1GB
        //            max: data.maxmemory,
        //            step: 1024*256, // 256 MB per step
        //            animate: true,
        //            range: "min",
        //            slide: function(event, ui) {
        //                $(panel).find("[name='memory']").html(formatSize(ui.value*1024, 2));
        //            }
        //        });
	
        $(panel).dialog("open");
    }
}

function upload(which) {

    var vmId=$(which).parents(".vmRow").andSelf().first().find("input[zmlm\\\:item='vmId']").val();
    var clusterip=$(which).parents(".vmRow").andSelf().first().find("input[zmlm\\\:item='clusterip']").val();
    var appname=$(which).parents(".vmRow").andSelf().first().find("input[zmlm\\\:item='appname']").val();

    var url = "http://"+ clusterip +"/upload/index.html?id=" + vmId + "&appname=" + appname;
    
    newwindow=window.open(url,'name','height=190,width=520,top=200,left=300,resizable');

    if (window.focus) {
        newwindow.focus()
    }
    
}




function visitApp(which) {

    // var vmId=$(which).parents(".vmRow").andSelf().first().find("input[zmlm\\\:item='vmId']").val();
    var clusterip=$(which).parents(".vmRow").andSelf().first().find("input[zmlm\\\:item='clusterip']").val();
    var appname=$(which).parents(".vmRow").andSelf().first().find("input[zmlm\\\:item='appname']").val();

    var url = "http://"+ clusterip +"/" + appname;

    newwindow=window.open(url, appname,'height=190,width=520,top=200,left=300,resizable');

    if (window.focus) {
        newwindow.focus()
    }

}

/**
 * Illustrate chart data of VM.
 */
function showChart(ui, type) {
    var data=$(ui).parents(".vmDetail").first().data("data");
    var vmid=data.containerid;
    var vmname=data.appname;
	
    // set up chart panel
    var chartPanel=$.tmpl("chartPanelTemplate", [{
        vmname: vmname,
        chartid: "chartView"
    }]).appendTo("#mainBody").dialog({
        autoOpen: false,
        resizable: false,
        modal: true,
        width: 800,
        height: 550,
        close: function(event, ui) {
            $(this).dialog("destroy");
            $(this).remove();
        },
        open: function(event, ui){
            $(chartPanel).find("select[name='duration']").bind("change", function(){
                if(parseInt($(this).val())>=2592000000) {
                    var opt=$(chartPanel).find("select[name='interval']").empty();
                    $(opt).append("<option value='86400000'>"+Locale["vm.chart.option.1day"]+"</option>");
                }else{
                    var opt=$(chartPanel).find("select[name='interval']").empty();
                    $(opt).append("<option value='300000'>"+Locale["vm.chart.option.5min"]+"</option>");
                    $(opt).append("<option value='600000'>"+Locale["vm.chart.option.10min"]+"</option>");
                    $(opt).append("<option value='900000'>"+Locale["vm.chart.option.15min"]+"</option>");
                    $(opt).append("<option value='1800000'>"+Locale["vm.chart.option.30min"]+"</option>");
                    $(opt).append("<option value='3600000'>"+Locale["vm.chart.option.60min"]+"</option>");
                }
            }).triggerHandler("change");
			
            $(this).find("button").button();
            $(this).find("button[name='reloadChart']").bind("click", function(){
                // disable the button to avoid duplicated calling
                $(this).button("disable");
	
                // set up parameters
                var startDate=new Date().getTime()-parseInt($(chartPanel).find("select[name='duration']").val());
                var interval=parseInt($(chartPanel).find("select[name='interval']").val());
                var endDate=new Date().getTime();
                var yAxisTitle="N/A";
                var chartTitle=Locale["eac.chart.chartTitle"];
                var yUnit="";
                switch(type) {
                    case "cpu":
                        yAxisTitle=Locale["eac.chart.yAxiesTitle.cpu"];
                        yUnit=Locale["eac.chart.yAxiesTitle.cpu.unit"];
                        chartTitle=chartTitle.sprintf(Locale["eac.chart.icon.cpu"], vmname);
                        break;
                    case "mem":
                        yAxisTitle=Locale["eac.chart.yAxiesTitle.mem"];
                        yUnit=Locale["eac.chart.yAxiesTitle.mem.unit"];
                        chartTitle=chartTitle.sprintf(Locale["eac.chart.icon.mem"], vmname);
                        break;
                    case "vol":
                        yAxisTitle=Locale["eac.chart.yAxiesTitle.vol"];
                        yUnit=Locale["eac.chart.yAxiesTitle.vol.unit"];
                        chartTitle=chartTitle.sprintf(Locale["eac.chart.icon.vol"], vmname);
                        break;
                    case "net":
                        yAxisTitle=Locale["eac.chart.yAxiesTitle.net"];
                        yUnit=Locale["eac.chart.yAxiesTitle.net.unit"];
                        chartTitle=chartTitle.sprintf(Locale["eac.chart.icon.net"], vmname);
                        break;
                }
                var chartSubtitle=Locale["eac.chart.chartSubtitle"].sprintf(new Date(startDate).toLocaleString(), new Date(endDate).toLocaleString());
			
                // draw it
                drawChart("chartView", type, vmid, vmname, startDate, endDate, interval, yAxisTitle, chartTitle, yUnit, chartSubtitle,
                    function(){
                        $("button[name='reloadChart']").button("enable");
                    });
				
            }).triggerHandler("click");
        },
        buttons: [
        {
            text: Locale["vm.dialog.close"],
            click: function() {
                $(this).dialog("close");
            }
        }
        ]
    });
	
    $(chartPanel).dialog("open");

}

function drawChart(container, type, vmid, vmname, startDate, endDate, interval, yAxisTitle, chartTitle, yUnit, chartSubtitle, callback) {
    $("#"+container).empty().append("<img style='display:inline-block;position:absolute;top:50%;left:50%;' src='css/image/progress_large.gif'/>");

    $.ajax({
        url: Server+"/EACCloudControl/APPHistory",
        type: "POST",
        data: {
            containerid: vmid,
            startdate: startDate,
            enddate: endDate,
            timeinterval: parseInt(interval)
        },
        success: function(data) {
            callback();
			
            if($("#"+container).length==0) return; // if the view not existed further more, do nothing
			
            try{
                data=$.parseJSON(data);
            //    alert(vmid + "&" + startDate + "&" + endDate + "&" + interval);

                
                if(!data.result) printMessage(Locale["vm.chart.label.message.no_vm_data"]);
				
                // convert the raw data
                var hitrate=new Array();
                var responsetime=new Array();
                var sdreponsetime=new Array();
                var cpuresponsetime=new Array();
                var errorrate=new Array();
                var datasize=new Array();
                var usedmemory=new Array();
                
                for(var i=0; data.result && i<data.usages.length; i++) {
                    hitrate.push(parseFloat(data.usages[i].hitrate) || 0);
                    responsetime.push(parseFloat(data.usages[i].responsetime) || 0);
                    sdreponsetime.push(parseFloat(data.usages[i].sdreponsetime) || 0);
                    cpuresponsetime.push(parseFloat(data.usages[i].cpuresponsetime) || 0);
                    errorrate.push(parseFloat(data.usages[i].errorrate) || 0);
                    datasize.push(parseFloat(data.usages[i].datasize) || 0);
                    usedmemory.push(parseFloat(data.usages[i].usedmemory) || 0);
                }
			
                var chartUsage = new Highcharts.Chart({
                    chart: {
                        renderTo: container,
                        type: "bar"
                    },
                    title: {
                        text: chartTitle
                    },
                    subtitle: {
                        text: chartSubtitle
                    },
                    xAxis: {
                        type: "datetime",
                        maxZoom: 3600*1000,
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        title:{
                            text: yAxisTitle
                        },
                        min:0,
                        startOnTick:false,
                        showFirstLabel:true,
                        labels: {
                            formatter: function(){
                                return this.value+yUnit;
                            }
                        }
                    },
                    tooltip: {
                        shared: true
                    },
                    legend: {
                        enabled: true
                    },
                    credits: {
                        enabled: false
                    },
                    showLastLabel: true,
                    lang: {
                        "downloadPNG": Locale["vm.chart.component.downloadPNG"],
                        "downloadJPEG": Locale["vm.chart.component.downloadJPEG"],
                        "downloadPDF": Locale["vm.chart.component.downloadPDF"],
                        "downloadSVG": Locale["vm.chart.component.downloadSVG"],
                        "printButtonTitle": Locale["vm.chart.component.printButtonTitle"],
                        "exportButtonTitle": Locale["vm.chart.component.exportButtonTitle"],
                        "months": [Locale["vm.chart.component.Jan"], Locale["vm.chart.component.Feb"], Locale["vm.chart.component.Mar"],
                        Locale["vm.chart.component.Apr"], Locale["vm.chart.component.May"], Locale["vm.chart.component.Jun"],
                        Locale["vm.chart.component.Jul"], Locale["vm.chart.component.Aug"], Locale["vm.chart.component.Sep"],
                        Locale["vm.chart.component.Oct"], Locale["vm.chart.component.Nov"], Locale["vm.chart.component.Dec"]],
                        "shortMonths": [Locale["vm.chart.component.Jan.short"], Locale["vm.chart.component.Feb.short"], Locale["vm.chart.component.Mar.short"],
                        Locale["vm.chart.component.Apr.short"], Locale["vm.chart.component.May.short"], Locale["vm.chart.component.Jun.short"],
                        Locale["vm.chart.component.Jul.short"], Locale["vm.chart.component.Aug.short"], Locale["vm.chart.component.Sep.short"],
                        Locale["vm.chart.component.Oct.short"], Locale["vm.chart.component.Nov.short"], Locale["vm.chart.component.Dec.short"]],
                        "weekdays": [Locale["vm.chart.component.Sunday"], Locale["vm.chart.component.Monday"], Locale["vm.chart.component.Tuesday"],
                        Locale["vm.chart.component.Wednesday"], Locale["vm.chart.component.Thursday"], Locale["vm.chart.component.Friday"],
                        Locale["vm.chart.component.Saturday"]]
                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: [0, 0, 0, 300],
                                stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, "rgba(2,0,0,0)"]
                                ]
                            },
                            lineWidth: 1,
                            marker: {
                                enabled: false,
                                states: {
                                    hover: {
                                        enabled: true,
                                        radius: 5
                                    }
                                }
                            },
                            shadow: false,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            }
                        }
                    }
                });
				
                if(type=="net") {
                    chartUsage.addSeries({
                        type: 'area',
                        name: Locale["eac.chart.series.hits"],
                        pointInterval: interval,
                        pointStart: startDate-(new Date().getTimezoneOffset()*60*1000),
                        data: hitrate
                    });
                }else if(type=="mem") {
                    chartUsage.addSeries({
                        type: 'area',
                        name: Locale["eac.chart.series.mem"],
                        pointInterval: interval,
                        pointStart: startDate-(new Date().getTimezoneOffset()*60*1000),
                        data: usedmemory
                    });
                }else if(type=="cpu") {
                    chartUsage.addSeries({
                        type: 'area',
                        name: Locale["eac.chart.series.response"],
                        pointInterval: interval,
                        pointStart: startDate-(new Date().getTimezoneOffset()*60*1000),
                        data: responsetime
                    });
                    chartUsage.addSeries({
                        type: 'area',
                        name: Locale["eac.chart.series.cpuresponse"],
                        pointInterval: interval,
                        pointStart: startDate-(new Date().getTimezoneOffset()*60*1000),
                        data: cpuresponsetime
                    });
                }else if(type=="vol") {
                    chartUsage.addSeries({
                        type: 'area',
                        name: Locale["eac.chart.series.datasize"],
                        pointInterval: interval,
                        pointStart: startDate-(new Date().getTimezoneOffset()*60*1000),
                        data: datasize
                    });
                }
				
            }catch(e){
                printMessage("Data Broken: ["+e+"]");
            };
        },
        error: function(jqXHR, textStatus, errorThrown) {
            callback();
            printError(jqXHR, textStatus, errorThrown);
        }
    });
}

function showPasswd(ui) {

    var data=$(ui).parents(".vmDetail").first().data("data");
    var status = data.dbstatus;
    var username = data.dbusername;
    var password = data.dbpassword;
	
    // var pd=showProcessingDialog();
    // pd.dialog("destroy");

    var msg="";
    switch(status) {
        case "RUNNING":
            msg="<span class='ui-icon ui-icon-locked' style='float:left;'></span>"+Locale["eac.template.info.dbpasswd"].sprintf(password);
            break;
        case "NOT_IN_USE":
            msg=Locale["eac.template.info.dbpasswd.error"];
            break;
        default:
            msg=Locale["vm.message.undefined"].sprintf(data.status);
    }
				
    var theSpan="";
				
    if(status=="RUNNING") {

        msg="<span class='ui-icon ui-icon-person' style='float:left;'></span>"+Locale["eac.template.info.dbusername"].sprintf(username)+"<br/><br/>"+msg;
        
					
        theSpan="<div class='ui-widget ui-state-highlight ui-corner-all' style='margin-top: 20px; padding: 1em .7em;'><table style='border:0;'><tr><td>"+msg+"</td></tr></table></div>";
    }else{
        theSpan="<div class='ui-widget ui-state-highlight ui-corner-all' style='margin-top: 20px; padding: 1em .7em;'><table style='border:0;'><tr><td><span class='ui-icon ui-icon-info' style='display:inline-block;margin-right:4px;float:left;'></span></td><td>"+msg+"</td></tr></table></div>";
    }
				
    printMessage(theSpan);
				

 
	
}

function applyInst(which) {
    var data=$(which).parents(".vmDetail").first().data("data");
    var id=data.containerid;
    var name = data.containername;
    var inst=$(which).parents(".vmDetail").first().find("[name='slider_inst']").slider("value");

    if(!confirm(Locale["eac.confirm.change.inst"].sprintf(name, inst))) return;

    var pd=showProcessingDialog();

    $.ajax({
        type: "POST",
        url: Server+"/EACCloudControl/ChangeInstanceNo",
        cache: false,
        data: {
            instance: inst,
            containerid: id
        },
        success: function(data) {
            pd.dialog("destroy");
            try{
                data=$.parseJSON(data);

                var msg="";

                if(data.result){
                    msg=Locale["vm.message.done"];
                } else {
                    msg=Locale["vm.message.error"];
                }


                printMessage(msg);

                loadVm();

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


function applyCon(which) {
    var data=$(which).parents(".vmDetail").first().data("data");
    var id=data.containerid;
    var name = data.containername;
    var con=$(which).parents(".vmDetail").first().find("[name='slider_con']").slider("value");

    if(!confirm(Locale["eac.confirm.change.con"].sprintf(name, con))) return;

    var pd=showProcessingDialog();

    $.ajax({
        type: "POST",
        url: Server+"/EACCloudControl/ChangeMaxCONN",
        cache: false,
        data: {
            maxcon: con,
            containerid: id
        },
        success: function(data) {
            pd.dialog("destroy");
            try{
                data=$.parseJSON(data);

                var msg="";

                if(data.result){
                    msg=Locale["vm.message.done"];
                } else {
                    msg=Locale["vm.message.error"];
                }


                printMessage(msg);

                loadVm();

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



function formatSize(bytes, digit) {
    if(null==bytes || 0==bytes) return "--";
	
    var i=0;
    while(1023 < bytes){
        bytes /= 1024;
        ++i;
    };
    return i?bytes.toFixed(digit || 0) + ["", " KB", " MB", " GB", " TB"][i] : bytes + " bytes";
}

function formatStatus(status) {
    switch(status) {
        case "RUNNING":
            statusdisplay="<span class='ui-icon ui-icon-play' style='float:left; margin:0 0 0 0;'></span><span style='color:#25a300;font-weight:bold;'>Running</span>";
            break;
        case "NOT_IN_USE":
            statusdisplay="<span class='ui-icon ui-icon-power' style='float:left; margin:0 0 0 0;'></span><span style='color:#777;'>Disabled</span>";
            break;
        case "VACANT":
            statusdisplay="<span class='ui-icon ui-icon-refresh' style='float:left; margin:0 0 0 0;'></span><span style='color:orange;'>No WAR</span>";
            break;
        case "STOPPED":
            statusdisplay="<span class='ui-icon ui-icon-power' style='float:left; margin:0 0 0 0;'></span><span style='color:red;'>Stopped</span>";
            break;
    }
    return statusdisplay;
}




