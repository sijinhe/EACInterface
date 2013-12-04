// JavaScript Document
// Author: Bill, 2011

var Template_NetworkPanel='\
<div id="${id}">\
	<span style="display:block;white-space:nowrap;">\
		<span class="networkIp networkRowHeader">'+Locale["network.template.network.ip"]+'</span>\
		<span class="networkType networkRowHeader">'+Locale["network.template.network.type"]+'</span>\
		<span class="networkZone networkRowHeader">'+Locale["network.template.network.zone"]+'</span>\
		<span class="networkStatus networkRowHeader">'+Locale["network.template.network.status"]+'</span>\
		<span class="networkVm networkRowHeader">'+Locale["network.template.network.vm"]+'</span>\
		{{if getRole()=="senior"}}\
		<span class="networkAssignedTo networkRowHeader">'+Locale["network.template.network.assigned.to"]+'</span>\
		{{/if}}\
		<span class="networkOperation networkRowHeader">'+Locale["network.template.network.operation"]+'</span>\
	</span>														\
	<span class="splitter"></span>								\
	<span zmlm:item="networkList" class="networkList"></span>		\
	<span class="splitter"></span>								\
	<span style="display:block;white-space:nowrap;text-align:right;">\
		<button onclick="loadNetwork()">'+Locale["network.template.network.refresh"]+'</button>\
	</span>\
</div>\
';

var Template_NetworkRow='\
<span class="networkRow">\
	<input zmlm:item="networkIp" type="hidden" value="${ip}" />\
	<input zmlm:item="networkZone" type="hidden" value="${zone}" />\
	<input zmlm:item="networkVm" type="hidden" value="${vmid}" />\
	<input zmlm:item="networkAssignedTo" type="hidden" value="${assignedto}" />\
	<span class="networkRowCell networkIp textCollapse">${ip}</span>	\
	<span class="networkRowCell networkType textCollapse">${usertype}</span>	\
	<span class="networkRowCell networkZone textCollapse">${zonename}</span>\
	<span class="networkRowCell networkStatus textCollapse">{{html formatIpStatus(ipstatus)}}</span>\
	<span class="networkRowCell networkVm textCollapse">${vmname}</span>\
	{{if getRole()=="senior"}}\
	<span class="networkRowCell networkAssignedTo textCollapse">${assignedto}</span>\
	{{/if}}\
	<span class="networkRowCell networkOperation textCollapse">\
		{{if ipstatus=="approved"}}\
			{{if getRole()=="senior"}}\
				<a href="#" onclick="releaseIp(this);return false;">'+Locale["network.template.network.release"]+'</a>\
			{{/if}}\
			{{if vmid && vmid!=""}}\
				<a href="#" onclick="detachIp(this);return false;">'+Locale["network.template.network.detach"]+'</a>\
			{{else}}\
				<a href="#" onclick="showAttachIpDialog(this);return false;">'+Locale["network.template.network.attach"]+'</a>\
			{{/if}}\
			{{if getRole()=="senior"}}\
				{{if assignedto}}\
					<a href="#" onclick="unassign(this);return false;">'+Locale["network.template.network.unassign"]+'</a>\
				{{/if}}\
			{{/if}}\
		{{else}}\
			<span style="color:#AAA;">['+Locale["network.template.network.no_operation"]+']</span>\
		{{/if}}\
	</span>\
</span>\
';

var Template_MessageBox='\
<div title="'+Locale["network.dialog.title.tips"]+'">\
	<p class="message">{{html message}}</p>\
</div>';







