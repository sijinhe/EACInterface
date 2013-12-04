<%@page import="java.io.*"%>
<%@page import="sun.misc.BASE64Decoder,java.net.*,java.lang.annotation.*,java.sql.*,java.util.*,org.apache.commons.lang.*,java.lang.reflect.*"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" isErrorPage="false" isThreadSafe="true" %>
    
<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.1//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile11.dtd">

<%
response.setContentType("text/html");
//response.setHeader("Cache-Control", "no-cache,no-store,must-revalidate"); //HTTP 1.1
//response.setHeader("Pragma","no-cache"); //HTTP 1.0
//response.setDateHeader ("Expires", -1); //prevents caching at the proxy server

String host=null;
String port=null;
long timestamp=0;

String key=request.getParameter("key");

if(null==key || key.split("ZZ").length!=3) {
	out.println("Error: 412<br/>Your request is bad!");
	response.setStatus(412); // lack of parameters
	return;
}else{
	String[] parts=key.split("ZZ");
	
	BASE64Decoder decoder = new BASE64Decoder();

	host=new String(decoder.decodeBuffer(parts[0]));
	port=new String(decoder.decodeBuffer(parts[1]));
	timestamp=Long.parseLong(new String(decoder.decodeBuffer(parts[2])));
	
	if(Math.abs(timestamp-System.currentTimeMillis())>60*1000) {
		out.println("Error: 408<br/>Your request maybe expired. If this error is unexpected to you, please adjust your system clock!");
		response.setStatus(408); // lack of parameters
		return;
	}
	
}

int freePort=-1;
String addr="";

try{
	ServerSocket pendingSocket=new ServerSocket();
	pendingSocket.bind(null);
	freePort=pendingSocket.getLocalPort();
	pendingSocket.close();
	
	String websockify=new File(application.getRealPath(""), "modules/WebVNC/utils/websockify").getPath();
	addr=request.getLocalAddr();
	
	//out.println("socket: "+freePort+"<br/>");
	//out.println("websockify: "+websockify+"<br/>");
	//out.println("netaddr: "+addr+"<br/>");
	
	String[] args={websockify,"--run-once","-D","--timeout","30",freePort+"",host+":"+port};
	ProcessBuilder builder=new ProcessBuilder(args);
	Process process=builder.start();
	//Process process=Runtime.getRuntime().exec(websockify,args);
	
	System.out.println("VNC proxy launched: local[port="+freePort+"], target[host="+host+", port="+port+"]");
	
    InputStream is = process.getErrorStream();
    InputStreamReader isr = new InputStreamReader(is);
    BufferedReader br = new BufferedReader(isr);
    String line;
    while ((line = br.readLine()) != null) {
      System.out.println(line);
    }
	
	
}catch(Exception e) {
	e.printStackTrace();
	
	// maybe no more port
	out.println("Error: 503<br/>Our server is busy, retry later please.");
	response.setStatus(503);
	return;
}

%>

<html>
<head>
    <title>Fancy-VNC</title>

    <meta charset="utf-8">

    <!-- Always force latest IE rendering engine (even in intranet) & Chrome Frame
                Remove this if you use the .htaccess -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <!-- Apple iOS Safari settings -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta names="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <!-- App Start Icon  -->
    <link rel="apple-touch-startup-image" href="images/screen_320x460.png" />
    <!-- For iOS devices set the icon to use if user bookmarks app on their homescreen -->
    <link rel="apple-touch-icon" href="images/screen_57x57.png">
    <!--
    <link rel="apple-touch-icon-precomposed" href="images/screen_57x57.png" />
    -->


    <!-- Stylesheets -->
    <link rel="stylesheet" href="include/base.css" />
    <link rel="alternate stylesheet" href="include/black.css" TITLE="Black" />
    <link rel="alternate stylesheet" href="include/blue.css" TITLE="Blue" />

    <!--
    <script type='text/javascript'
        src='http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js'></script>
    -->

    <script src="include/vnc.js"></script>
    <script src="include/ui.js"></script>

</head>

<body>
    <div id="noVNC-control-bar">
        <!--noVNC Mobile Device only Buttons-->
        <div class="noVNC-buttons-left">
            <input type="image" src="images/drag.png"
                id="noVNC_view_drag_button" class="noVNC_status_button"
                title="Move/Drag Viewport"
                onclick="UI.setViewDrag();">
            <div id="noVNC_mobile_buttons">
                <input type="image" src="images/mouse_none.png"
                    id="noVNC_mouse_button0" class="noVNC_status_button"
                    onclick="UI.setMouseButton(1);">
                <input type="image" src="images/mouse_left.png"
                    id="noVNC_mouse_button1" class="noVNC_status_button"
                    onclick="UI.setMouseButton(2);">
                <input type="image" src="images/mouse_middle.png"
                    id="noVNC_mouse_button2" class="noVNC_status_button"
                    onclick="UI.setMouseButton(4);">
                <input type="image" src="images/mouse_right.png"
                    id="noVNC_mouse_button4" class="noVNC_status_button"
                    onclick="UI.setMouseButton(0);">
                <input type="image" src="images/keyboard.png"
                    id="showKeyboard" class="noVNC_status_button"
                    value="Keyboard" title="Show Keyboard"
                    onclick="UI.showKeyboard()"/>
                <input type="email"
                    autocapitalize="off" autocorrect="off"
                    id="keyboardinput" class="noVNC_status_button"
                    onKeyDown="onKeyDown(event);" onblur="UI.keyInputBlur();"/>
            </div>
        </div>

        <!--noVNC Buttons-->
        <div class="noVNC-buttons-right">
            <input type="image" src="images/ctrlaltdel.png"
                 id="sendCtrlAltDelButton" class="noVNC_status_button"
                title="Send Ctrl-Alt-Del"
                onclick="UI.sendCtrlAltDel();" />
            <input type="image" src="images/clipboard.png"
                id="clipboardButton" class="noVNC_status_button"
                title="Clipboard"
                onclick="UI.toggleClipboardPanel();" />
            <input type="image" src="images/settings.png"
                id="settingsButton" class="noVNC_status_button"
                title="Settings"
                onclick="UI.toggleSettingsPanel();" />
            <input type="image" src="images/connect.png"
                id="connectButton" class="noVNC_status_button"
                title="Connect"
                onclick="UI.toggleConnectPanel()" />
            <input type="image" src="images/disconnect.png"
                id="disconnectButton" class="noVNC_status_button"
                title="Disconnect"
                onclick="UI.disconnect()" />
        </div>

        <!-- Description Panel -->
        <!-- Shown by default when hosted at for kanaka.github.com -->
        <div id="noVNC_description" style="display:none;" class="">
            noVNC is a browser based VNC client implemented using HTML5 Canvas
            and WebSockets. You will either need a VNC server with WebSockets
            support (such as <a href="http://libvncserver.sourceforge.net/">libvncserver</a>)
            or you will need to use
            <a href="https://github.com/kanaka/websockify">websockify</a>
            to bridge between your browser and VNC server. See the noVNC
            <a href="https://github.com/kanaka/noVNC">README</a>
            and <a href="http://kanaka.github.com/noVNC">website</a>
            for more information.
            <br />
            <input type="button" value="Close"
                onclick="UI.toggleConnectPanel();">
        </div>

        <!-- Clipboard Panel -->
        <div id="noVNC_clipboard" class="triangle-right top">
            <textarea id="noVNC_clipboard_text" rows=5
                onfocus="UI.displayBlur();" onblur="UI.displayFocus();"
                onchange="UI.clipSend();">
            </textarea>
            <br />
            <input id="noVNC_clipboard_clear_button" type="button"
                value="Clear" onclick="UI.clipClear();">
        </div>

        <!-- Settings Panel -->
        <div id="noVNC_settings" class="triangle-right top">
            <span id="noVNC_settings_menu" onmouseover="UI.displayBlur();"
                                           onmouseout="UI.displayFocus();">
                <ul>
                    <li><input id="noVNC_encrypt" type="checkbox"> Encrypt</li>
                    <li><input id="noVNC_true_color" type="checkbox" checked> True Color</li>
                    <li><input id="noVNC_cursor" type="checkbox"> Local Cursor</li>
                    <li><input id="noVNC_clip" type="checkbox"> Clip to Window</li>
                    <li><input id="noVNC_shared" type="checkbox"> Shared Mode</li>
                    <li><input id="noVNC_view_only" type="checkbox"> View Only</li>
                    <li><input id="noVNC_connectTimeout" type="input"> Connect Timeout (s)</li>
                    <li><input id="noVNC_path" type="input" value="websockify"> Path</li>
                    <hr>
                    <!-- Stylesheet selection dropdown -->
                    <li><label><strong>Style: </strong>
                        <select id="noVNC_stylesheet" name="vncStyle">
                            <option value="default">default</option>
                        </select></label>
                    </li>

                    <!-- Logging selection dropdown -->
                    <li><label><strong>Logging: </strong>
                        <select id="noVNC_logging" name="vncLogging">
                        </select></label>
                    </li>
                    <hr>
                    <li><input type="button" id="noVNC_apply" value="Apply"
                         onclick="UI.settingsApply()"></li>
                </ul>
            </span>
        </div>

        <!-- Connection Panel -->
        <div id="noVNC_controls" class="triangle-right top">
            <ul>
                <li><label><strong>Host: </strong><input id="noVNC_host" value="<%=addr%>" readonly="readonly" /></label></li>
                <li><label><strong>Port: </strong><input id="noVNC_port" value="<%=freePort%>" readonly="readonly" /></label></li>
                <li style="display:none;" ><label><strong>Password: </strong><input id="noVNC_password"type="password" /></label></li>
                <li><input id="noVNC_connect_button" type="button" value="Connect" onclick="UI.connect();"></li>
            </ul>
        </div>

    </div> <!-- End of noVNC-control-bar -->


    <div id="noVNC_screen">
        <div id="noVNC_screen_pad"></div>

        <div id="noVNC_status_bar" class="noVNC_status_bar">
                <div id="noVNC_status">Loading</div>
        </div>

        <h1 id="noVNC_logo">
        	<span>Fancy</span>
        	<br />
        	VNC<img src="images/logo.png"/>
        </h1>

        <!-- HTML5 Canvas -->
        <div id="noVNC_container">
            <canvas id="noVNC_canvas" width="640px" height="20px">
                        Canvas not supported.
            </canvas>
        </div>
        <div style="color:#444;text-align:center;">
        	<span style="border:2px solid black;background:#FFF;display:inline-block;padding:10px;-webkit-border-radius:5px;-moz-border-radius:5px;-ms-border-radius:5px;-o-border-radius:5px;">
        	<b>Notice</b>: Please "<u style='color:red;font-weight:bold;'>logout</u>"(windows) or type "<u style='color:red;font-weight:bold;'>exit</u>"(linux) when you are finishing your job on your VM. It's very important!
        	<br/>
        	<font style="font-size:12px;color:#777;">If your are failed to open this page, please change a HTML5 supported explorer. (eg. Chrome, Firefox)</font>
        	<br/>
        	<b style="font-size:12px;color:#777;">(Fancy-VNC Administrator: gorebill@163.com)</b>
			</span>
        </div>

    </div>

    <script>
        window.onload = UI.load;
    </script>
 </body>
</html>
