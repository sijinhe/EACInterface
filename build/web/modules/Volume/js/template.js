// JavaScript Document
// Author: Bill, 2011

var Template_VolumePanel='\
<div id="${id}">\
	<span style="display:block;white-space:nowrap;">\
		<span class="volumeName volumeRowHeader">'+Locale["volume.template.volume.name"]+'</span>\
		<span class="volumeZone volumeRowHeader">'+Locale["volume.template.volume.zone"]+'</span>\
		<span class="volumeSize volumeRowHeader">'+Locale["volume.template.volume.size"]+'</span>\
		<span class="volumeVm volumeRowHeader">'+Locale["volume.template.volume.vm"]+'</span>\
		<span class="volumeType volumeRowHeader">'+Locale["volume.template.volume.type"]+'</span>\
		<span class="volumeTarget volumeRowHeader">'+Locale["volume.template.volume.target"]+'</span>\
		{{if getRole()=="senior"}}\
		<span class="volumeAssignedTo volumeRowHeader">'+Locale["volume.template.volume.assigned.to"]+'</span>\
		{{/if}}\
		<span class="volumeOperation volumeRowHeader">'+Locale["volume.template.volume.operation"]+'</span>\
	</span>														\
	<span class="splitter"></span>								\
	<span zmlm:item="volumeList" class="volumeList"></span>		\
	<span class="splitter"></span>								\
	<span style="display:block;white-space:nowrap;text-align:right;">\
		<button onclick="loadVolume()">'+Locale["volume.template.volume.refresh"]+'</button>\
	</span>\
</div>\
';

var Template_VolumekRow='\
<span class="volumeRow">\
	<input zmlm:item="volumeId" type="hidden" value="${volumeid}" />\
	<input zmlm:item="volumeVm" type="hidden" value="${vmid}" />\
	<input zmlm:item="volumeZone" type="hidden" value="${zone}" />\
	<input zmlm:item="volumeName" type="hidden" value="${displayname}" />\
	<input zmlm:item="volumeDrive" type="hidden" value="${targetdrive}" />\
	<input zmlm:item="volumeAssignedTo" type="hidden" value="${assignedto}" />\
	<span class="volumeRowCell volumeName textCollapse">${displayname}</span>\
	<span class="volumeRowCell volumeZone textCollapse">${zonename}</span>\
	<span class="volumeRowCell volumeSize textCollapse">${volumesize} GB</span>\
	<span class="volumeRowCell volumeVm textCollapse">${vmname}</span>\
	<span class="volumeRowCell volumeType textCollapse">{{html formatVolumetype(volumetype)}}</span>\
	<span class="volumeRowCell volumeTarget textCollapse">${targetdrive}</span>\
	{{if getRole()=="senior"}}\
	<span class="volumeRowCell volumeAssignedTo textCollapse">${assignedto}</span>\
	{{/if}}\
	<span class="volumeRowCell volumeOperation textCollapse">\
		{{if vmid && vmid!=""}}\
		<a href="#" onclick="detachVolume(this);return false;">'+Locale["volume.template.volume.detach"]+'</a>\
		{{else}}\
		<a href="#" onclick="showAttachVolumeDialog(this);return false;">'+Locale["volume.template.volume.attach"]+'</a>\
		{{/if}}\
		{{if getRole()=="senior"}}\
			<a href="#" onclick="removeVolume(this);return false;">'+Locale["volume.template.volume.remove"]+'</a>\
			{{if assignedto}}\
			<a href="#" onclick="unassign(this);return false;">'+Locale["volume.template.volume.unassign"]+'</a>\
			{{/if}}\
		{{/if}}\
	</span>\
</span>\
';

var Template_MessageBox='\
<div title="'+Locale["volume.dialog.title.tips"]+'">\
	<p class="message">{{html message}}</p>\
</div>';







