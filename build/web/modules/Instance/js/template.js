// JavaScript Document
// Author: Bill, 2011

var Template_VmPanel='\
<div id="${id}">\
	<span style="display:block;white-space:nowrap;">\
		<span class="vmName vmRowHeader">'+Locale["vm.template.vm.name"]+'</span>\
		<span class="vmZone vmRowHeader">'+Locale["vm.template.vm.zone"]+'</span>\
		<span class="vmCpus vmRowHeader">'+Locale["vm.template.vm.cpus"]+'</span>\
		<span class="vmMemory vmRowHeader">'+Locale["vm.template.vm.memory"]+'</span>\
		<span class="vmPrivateip vmRowHeader">'+Locale["vm.template.vm.privateip"]+'</span>\
		<span class="vmStatus vmRowHeader">'+Locale["vm.template.vm.status"]+'</span>\
		<span class="vmOstype vmRowHeader">'+Locale["vm.template.vm.ostype"]+'</span>\
		{{if getRole()=="senior"}}\
		<span class="vmAssignedTo vmRowHeader">'+Locale["vm.template.vm.assigned.to"]+'</span>\
		{{/if}}\
		<span class="vmOperation vmRowHeader">'+Locale["vm.template.vm.operation"]+'</span>\
	</span>														\
	<span class="splitter"></span>								\
	<span zmlm:item="vmList" class="vmList"></span>		\
	<span class="splitter"></span>								\
	<span style="display:block;white-space:nowrap;text-align:right;">\
		<button onclick="loadVm()">'+Locale["vm.template.vm.refresh"]+'</button>\
	</span>\
</div>\
';

var Template_VmRow='\
<span class="vmRow">\
	<input zmlm:item="vmId" type="hidden" value="${vmid}" />\
	<input zmlm:item="vmZone" type="hidden" value="${zone}" />\
	<input zmlm:item="vmName" type="hidden" value="${vmname}" />\
	<input zmlm:item="vmAssignedTo" type="hidden" value="${assignedto}" />\
	{{if status=="CREATING"}}\
		<span class="vmRowCell vmName textCollapse">${vmname}</span>\
		<span class="vmRowCell vmZone textCollapse">${zonedisplay}</span>\
		<span class="vmRowCell vmCpus textCollapse"></span>\
		<span class="vmRowCell vmMemory textCollapse"></span>\
		<span class="vmRowCell vmPrivateip textCollapse"></span>\
		<span class="vmRowCell vmStatus textCollapse">{{html formatStatus(status, statusdisplay)}}</span>\
		<span class="vmRowCell vmOstype textCollapse">{{html formatOstype(ostype)}}</span>\
		{{if getRole()=="senior"}}\
		<span class="vmRowCell vmAssignedTo textCollapse"></span>\
		{{/if}}\
		<span class="vmRowCell vmOperation textCollapse"></span>\
	{{else}}\
		<span class="vmRowCell vmName textCollapse">${vmname}</span>\
		<span class="vmRowCell vmZone textCollapse">${zonedisplay}</span>\
		<span class="vmRowCell vmCpus textCollapse">${cpus}</span>\
		<span class="vmRowCell vmMemory textCollapse">{{html formatSize(memory*1024)}}</span>\
		<span class="vmRowCell vmPrivateip textCollapse">${privateip}</span>\
		<span class="vmRowCell vmStatus textCollapse">{{html formatStatus(status, statusdisplay)}}</span>\
		<span class="vmRowCell vmOstype textCollapse">{{html formatOstype(ostype)}}</span>\
		{{if getRole()=="senior"}}\
		<span class="vmRowCell vmAssignedTo textCollapse">${assignedto}</span>\
		{{/if}}\
		<span class="vmRowCell vmOperation textCollapse">\
			{{if status=="SHUTOFF"}}\
			<a href="#" onclick="poweron(this);return false;">'+Locale["vm.template.vm.poweron"]+'</a>\
			{{else}}\
			<a href="#" onclick="poweroff(this);return false;">'+Locale["vm.template.vm.poweroff"]+'</a>\
			{{/if}}\
			<a href="#" onclick="detail(this);return false;">'+Locale["vm.template.vm.detail"]+'</a>\
			{{if getRole()=="senior"}}\
				<a href="#" onclick="remove(this);return false;">'+Locale["vm.template.vm.remove"]+'</a>\
				{{if assignedto}}\
				<a href="#" onclick="unassign(this);return false;">'+Locale["vm.template.vm.unassign"]+'</a>\
				{{/if}}\
			{{/if}}\
		</span>\
	{{/if}}\
</span>\
';

var Template_VmDetailPanel='\
<div id="${id}" class="vmDetail">\
	<table style="width:100%;">\
		<tbody>\
		<tr>\
			<td colspan="2">\
				<p class="ui-state-default ui-corner-all" style="padding:4px;margin-top:4px;">\
					<span class="ui-icon ui-icon-power" style="float:left; margin:0 0 0 0;"></span>\
					'+Locale["vm.template.info.base"]+'\
				</p>\
			</td>\
		</tr>\
		<tr><td class="detailLeft">'+Locale["vm.template.info.vmname"]+'</td><td name="vmname"></td></tr>\
		<tr><td class="detailLeft">'+Locale["vm.template.info.vmzone"]+'</td><td name="zonedisplay"></td></tr>\
		<tr><td class="detailLeft">'+Locale["vm.template.info.vmostype"]+'</td><td name="ostype"></td></tr>\
		<tr>\
			<td class="detailLeft">'+Locale["vm.template.info.vmcpu"]+'</td>\
			<td style="text-align:center;">\
				<table style="width:100%;">\
					<tr>\
						<td style="width:100px;text-align:left;">'+Locale["vm.template.info.now"]+': <span name="cpus"></span></td>\
						<td><div class="slider" name="slider_cpu"></div></td>\
						<td style="width:100px;text-align:left;">'+Locale["vm.template.info.max"]+': <span name="maxcpus"></span></td>\
						<td style="width:60px;"><button onclick="applyCpu(this)">'+Locale["vm.template.info.apply"]+'</button></td>\
					</tr>\
				</table>\
			</td>\
		</tr>\
		<tr>\
			<td class="detailLeft">'+Locale["vm.template.info.vmmem"]+'</td>\
			<td style="text-align:center;">\
				<table style="width:100%;">\
					<tr>\
						<td style="width:100px;text-align:left;">'+Locale["vm.template.info.now"]+': <span name="memory"></span></td>\
						<td><div class="slider" name="slider_mem"></div></td>\
						<td style="width:100px;text-align:left;">'+Locale["vm.template.info.max"]+': <span name="maxmemory"></span></td>\
						<td style="width:60px;"><button onclick="applyMem(this)">'+Locale["vm.template.info.apply"]+'</button></td>\
					</tr>\
				</table>\
			</td>\
		</tr>\
		<tr><td class="detailLeft">'+Locale["vm.template.info.created"]+'</td><td name="starttime"></td></tr>\
		<tr><td class="detailLeft">'+Locale["vm.template.info.expired"]+'</td><td name="expiretime"></td></tr>\
		<tr><td class="detailLeft">'+Locale["vm.template.info.disk"]+'</td><td name="disksize"></td></tr>\
		<tr>\
			<td class="detailLeft">'+Locale["vm.template.info.status"]+'</td>\
			<td><span name="statusicon" style="float:left; margin:0 0 0 0;"></span><span name="statusdisplay"></span></td>\
		</tr>\
		<tr>\
			<td colspan="2">\
				<p class="ui-state-default ui-corner-all" style="padding:4px;margin-top:4px;">\
					<span class="ui-icon ui-icon-signal" style="float:left; margin:0 0 0 0;"></span>\
					'+Locale["vm.template.info.network"]+'\
				</p>\
			</td>\
		</tr>\
		<tr><td class="detailLeft">'+Locale["vm.template.info.publicip"]+'</td><td name="publicips"></td></tr>\
		<tr><td class="detailLeft">'+Locale["vm.template.info.privateip"]+'</td><td name="privateip"></td></tr>\
		<tr>\
			<td class="detailLeft">'+Locale["vm.template.info.vnc.label"]+'</td>\
			<td name="accesspoint">\
				<a target="_blank" href="#" style="color:#ff6f10;">\
					<span class="ui-icon ui-icon-extlink" style="float:left; margin:0 0 0 0;"></span>'+Locale["vm.template.info.vnc.access"]+'\
				</a>\
			</td>\
		</tr>\
		<tr>\
			<td class="detailLeft">'+Locale["vm.template.info.label.vmpasswd"]+'</td>\
			<td name="vmpasswd">\
				<a onclick="showVmPasswd(this);return false;" href="#" style="color:#ff6f10;">\
					<span class="ui-icon ui-icon-locked" style="float:left; margin:0 0 0 0;"></span>'+Locale["vm.template.info.link.getvmpasswd"]+'\
				</a>\
			</td>\
		</tr>\
		<tr>\
			<td colspan="2">\
				<p class="ui-state-default ui-corner-all" style="padding:4px;margin-top:4px;">\
					<span class="ui-icon ui-icon-newwin" style="float:left; margin:0 0 0 0;"></span>\
					'+Locale["vm.template.info.graph"]+'\
				</p>\
			</td>\
		</tr>\
		<tr>\
			<td style="text-align:center;" colspan="2">\
				<span class="chartIcon" onclick="showChart(this, \'cpu\');">\
					<span class="chartThumb chartThumbCPU"></span>\
					<span class="chartLabel">'+Locale["vm.chart.icon.cpu"]+'</span>\
				</span>\
				<span class="chartIcon" onclick="showChart(this, \'mem\');">\
					<span class="chartThumb chartThumbMEM"></span>\
					<span class="chartLabel">'+Locale["vm.chart.icon.mem"]+'</span>\
				</span>\
				<span class="chartIcon" onclick="showChart(this, \'net\');">\
					<span class="chartThumb chartThumbNET"></span>\
					<span class="chartLabel">'+Locale["vm.chart.icon.net"]+'</span>\
				</span>\
				<span class="chartIcon" onclick="showChart(this, \'vol\');">\
					<span class="chartThumb chartThumbVOL"></span>\
					<span class="chartLabel">'+Locale["vm.chart.icon.vol"]+'</span>\
				</span>\
			</td>\
		</tr>\
		</tbody>\
	</table>\
</div>\
';

var Template_ChartPanel='\
<div title="${vmname}">\
	<div style="font-size:12px;">\
		<span>'+Locale["vm.chart.label.choose.duration"]+'</span>\
		<select name="duration">\
			<option value="7200000" selected>'+Locale["vm.chart.option.last2hours"]+'</option>\
			<option value="86400000">'+Locale["vm.chart.option.last1day"]+'</option>\
			<option value="604800000">'+Locale["vm.chart.option.last1week"]+'</option>\
			<option value="2592000000">'+Locale["vm.chart.option.last1month"]+'</option>\
			<option value="7776000000">'+Locale["vm.chart.option.last3month"]+'</option>\
		</select>\
		<span>'+Locale["vm.chart.label.choose.interval"]+'</span>\
		<select name="interval">\
		</select>\
		<button name="reloadChart">'+Locale["vm.template.vm.refresh"]+'</button>\
	</div>\
	<span class="splitter"></span>\
	<span id="${chartid}" style="width:780px;height:400px;margin:0 auto;"></span>\
	<div style="font-size:11px;color:#ff4444;">'+Locale["vm.chart.label.notice"]+'</div>\
</div>\
';

var Template_MessageBox='\
<div title="'+Locale["vm.dialog.title.tips"]+'">\
	<p class="message">{{html message}}</p>\
</div>';







