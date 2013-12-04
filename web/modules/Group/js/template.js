// JavaScript Document
// Author: Bill, 2011

var Template_GroupPanel='\
<div id="${id}">\
	<span style="display:block;font-size:12px;margin-bottom:10px;">\
		<span class="ui-icon ui-icon-notice" style="float:left; margin:0 0 0 0;"></span>\
		'+Locale["group.template.list.sublogin.tips"]+'\
	</span>\
	<span style="display:block;font-size:12px;">\
		<p class="ui-state-default ui-corner-all" style="padding:4px;margin-top:2px;">\
			<span class="ui-icon ui-icon-flag" style="float:left; margin:0 0 0 0;"></span>\
			'+Locale["group.template.accordion.group"]+'\
		</p>\
	</span>\
	<span style="display:block;white-space:nowrap;">\
		<span class="groupName groupRowHeader">'+Locale["group.template.group.name"]+'</span>\
		<span class="groupCreation groupRowHeader">'+Locale["group.template.group.creation"]+'</span>\
		<span class="groupNotes groupRowHeader">'+Locale["group.template.group.notes"]+'</span>\
		<span class="groupOperation groupRowHeader">'+Locale["group.template.group.operation"]+'</span>\
	</span>														\
	<span class="splitter"></span>								\
	<span zmlm:item="groupList" class="groupList"></span>		\
	<span class="splitter"></span>								\
	<span style="display:block;white-space:nowrap;text-align:right;">\
		<button onclick="loadSublogin()">'+Locale["group.template.sublogin.all"]+'</button>\
		<button onclick="showNewSubloginDialog()">'+Locale["group.template.sublogin.new"]+'</button>\
		<button onclick="showNewGroupDialog()">'+Locale["group.template.group.new"]+'</button>\
		<button onclick="loadGroup();loadSublogin();">'+Locale["group.template.group.refresh"]+'</button>\
	</span>\
	<span style="display:block;font-size:12px;">\
		<p class="ui-state-default ui-corner-all" style="padding:4px;margin-top:20px;">\
			<span class="ui-icon ui-icon-person" style="float:left; margin:0 0 0 0;"></span>\
			'+Locale["group.template.accordion.sublogin"]+'<span name="sublogintitle" style="padding:20px;color:green;"></span>\
		</p>\
	</span>\
	<span style="display:block;white-space:nowrap;">\
		<span class="subloginName subloginRowHeader">'+Locale["sublogin.template.sublogin.name"]+'</span>\
		<span class="subloginEmail subloginRowHeader">'+Locale["sublogin.template.sublogin.email"]+'</span>\
		<span class="subloginPasswd subloginRowHeader">'+Locale["sublogin.template.sublogin.passwd"]+'</span>\
		<span class="subloginGroup subloginRowHeader">'+Locale["sublogin.template.sublogin.group"]+'</span>\
		<span class="subloginOperation subloginRowHeader">'+Locale["sublogin.template.sublogin.operation"]+'</span>\
	</span>														\
	<span class="splitter"></span>								\
	<span zmlm:item="subloginList" class="subloginList"></span>	\
	<span class="splitter"></span>								\
</div>\
';

var Template_AssignDialog='\
<div style="height:100%;font-size:12px;">\
<span style="display:block;">\
	<select name="list" style="width:80%;">\
	</select>\
</span>\
</div>\
';

var Template_GroupRow='\
<span class="groupRow">\
	<input zmlm:item="groupid" type="hidden" value="${groupid}" />\
	<input zmlm:item="displayname" type="hidden" value="${displayname}" />\
	<span class="groupRowCell groupName textCollapse">${displayname}</span>	\
	<span class="groupRowCell groupCreation textCollapse">{{html formatDate(creationtime.time)}}</span>	\
	<span class="groupRowCell groupNotes textCollapse">${notes}</span>\
	<span class="groupRowCell groupOperation textCollapse">\
		<a href="#" onclick="loadSublogin(this);return false;">'+Locale["group.template.group.listsublogin"]+'</a>\
		<a href="#" onclick="removeGroup(this);return false;">'+Locale["group.template.group.remove"]+'</a>\
	</span>\
</span>\
';

var Template_NewSubloginDialog='\
<div id="${id}">\
	<table style="width:100%;font-size:12px;">\
	<tr><th style="width:80px;"></th><th></th></tr>\
	<tbody>\
	<tr><td>'+Locale["sublogin.template.new.sublogin.username"]+'</td><td><input name="username" style="width:100%;" /></td></tr>\
	<tr><td>'+Locale["sublogin.template.new.sublogin.password"]+'</td><td><input name="password" style="width:100%;" /></td></tr>\
	<tr><td>'+Locale["sublogin.template.new.sublogin.email"]+'</td><td><input name="email" style="width:100%;" /></td></tr>\
	</tbody>\
	</table>\
</div>\
';

var Template_NewGroupDialog='\
<div id="${id}">\
	<table style="width:100%;font-size:12px;">\
	<tr><th style="width:80px;"></th><th></th></tr>\
	<tbody>\
	<tr><td>'+Locale["group.template.new.group.name"]+'</td><td><input name="groupname" style="width:100%;" /></td></tr>\
	<tr><td>'+Locale["group.template.new.group.desc"]+'</td><td><input name="groupdesc" style="width:100%;" /></td></tr>\
	</tbody>\
	</table>\
</div>\
';

var Template_SubloginRow='\
<span class="subloginRow">\
	<input zmlm:item="subloginname" type="hidden" value="${subloginname}" />\
	<input zmlm:item="groupname" type="hidden" value="${groupname}" />\
	<input zmlm:item="groupid" type="hidden" value="${groupid}" />\
	<span class="subloginRowCell subloginName textCollapse" title="${subloginname}">${subloginname}</span>\
	<span class="subloginRowCell subloginEmail textCollapse">${email}</span>\
	<span class="subloginRowCell subloginPasswd textCollapse" title="${passwd}">${passwd}</span>\
	<span class="subloginRowCell subloginGroup textCollapse">${groupname}</span>\
	<span class="subloginRowCell subloginOperation textCollapse">\
		<a href="#" onclick="showAssignGroupDialog(this);return false;">'+Locale["sublogin.template.sublogin.assign.group"]+'</a>\
		{{if ""==groupid}}\
		<span style="color:#AAA;display:inline-block;">'+Locale["sublogin.template.sublogin.label.nogroup"]+'</span>\
		{{else}}\
		<span style="display:inline-block;"><a href="#" onclick="detachGroup(this);return false;">'+Locale["sublogin.template.sublogin.unassign.group"]+'</a></span>\
		{{/if}}\
		<a href="#" onclick="showAssignInstanceDialog(this);return false;">'+Locale["sublogin.template.sublogin.assign.vm"]+'</a>\
		<a href="#" onclick="showAssignNetworkDialog(this);return false;">'+Locale["sublogin.template.sublogin.assign.ip"]+'</a>\
		<a href="#" onclick="showAssignVolumeDialog(this);return false;">'+Locale["sublogin.template.sublogin.assign.volume"]+'</a>\
		<a href="#" onclick="removeSublogin(this);return false;">'+Locale["sublogin.template.sublogin.remove"]+'</a>\
	</span>\
</span>\
';

var Template_MessageBox='\
<div title="'+Locale["group.dialog.title.tips"]+'">\
	<p class="message">{{html message}}</p>\
</div>';







