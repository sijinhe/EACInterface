// JavaScript Document
// Author: Bill, 2011

var Template_VlanPanel='\
<div id="${id}">\
	<span style="display:block;white-space:nowrap;">\
		<span class="vlanName vlanRowHeader">'+Locale["vlan.template.vlan.name"]+'</span>\
		<span class="vlanVms vlanRowHeader">'+Locale["vlan.template.vlan.vms"]+'</span>\
		<span class="vlanOperation vlanRowHeader">'+Locale["vlan.template.vlan.operation"]+'</span>\
	</span>														\
	<span class="splitter"></span>								\
	<span zmlm:item="vlanList" class="vlanList"></span>		\
	<span class="splitter"></span>								\
	<span style="display:block;white-space:nowrap;text-align:right;">\
		<button onclick="showNewVlanDialog()">'+Locale["vlan.template.vlan.create"]+'</button>\
		<button onclick="loadVlan()">'+Locale["vlan.template.vlan.refresh"]+'</button>\
	</span>\
</div>\
';

var Template_VlanRow='\
<span class="vlanRow">\
	<input zmlm:item="vlanid" type="hidden" value="${vlanid}" />\
	<input zmlm:item="vlanname" type="hidden" value="${vlanname}" />\
	<input zmlm:item="vlanzone" type="hidden" value="${zone}" />\
	<span class="vlanRowCell vlanName textCollapse">${vlanname}</span>\
	<span class="vlanRowCell vlanVms textCollapse">\
		<table>\
		{{if vms.length>0}}\
			<tr style="background:none;">\
				<th style="width:100px;">'+Locale["vlan.template.vlan.vms.vmname"]+'</th>\
				<th style="width:100px;">'+Locale["vlan.template.vlan.vms.vmzone"]+'</th>\
				<th style="width:120px;">'+Locale["vlan.template.vlan.vms.vmprivateip"]+'</th>\
				<th style="width:80px;">'+Locale["vlan.template.vlan.vms.vmassign"]+'</th>\
			</tr>\
		{{/if}}\
		<tbody>\
		{{each vms}}\
			<tr style="background:none;">\
				<td style="position:relative;padding-left:8px;">\
					{{if $index==vms.length-1}}\
					<span style="position:absolute;left:0;top:-2px;display:inline-block;width:5px;height:11px;border-width:0 0 1px 1px;-webkit-border-radius:2px;border-style:solid;border-color:silver;vertical-align:baseline;"></span>\
					{{else $index==0}}\
					<span style="position:absolute;left:0;top:12px;display:inline-block;width:5px;height:11px;border-width:1px 0 0 1px;-webkit-border-radius:2px;border-style:solid;border-color:silver;vertical-align:baseline;"></span>\
					{{else}}\
					<span style="position:absolute;left:0;top:-2px;display:inline-block;width:5px;height:25px;border-width:0 0 0 1px;border-style:solid;border-color:silver;vertical-align:baseline;"></span>\
					{{/if}}\
					{{! "we draw a crop above but it doesnt effective to ff, dont mind"}}\
					{{html $value.vmname}}\
				</td>\
				<td>{{html $value.zonename}}</td>\
				<td>{{html $value.privateip}}</td>\
				<td>{{html $value.assignedto}}</td>\
			</tr>\
		{{/each}}\
		</tbody>\
		</table>\
	</span>\
	<span class="vlanRowCell vlanOperation textCollapse">\
		<a href="#" onclick="removeVlan(this);return false;">'+Locale["vlan.template.vlan.remove"]+'</a>\
	</span>\
</span>\
';

var Template_NewVlanDialog='\
<div style="font-size:12px;">\
	<div style="margin:5px;white-space:nowrap;">\
		<span style="float:left;">\
			<span>'+Locale["vlan.template.vlan.zone"]+'</span>\
			<span><select name="vlanzone" style="min-width:120px;"></select></span>\
		</span>\
		<span style="float:right;">\
			<span>'+Locale["vlan.template.vlan.fill.name"]+'</span>\
			<span><input name="vlanname" style="min-width:160px;"/></span>\
		</span>\
	</div>\
	<table style="width:100%;height:320px;">\
		<tbody>\
			<tr>\
				<td style="height:100%;width:45%;"><select name="lList" multiple="multiple" style="height:100%;width:100%;"></select></td>\
				<td style="text-align:center;">\
					<span style="display:block;margin-bottom:10px;"><button name="l2r"> ---> </button></span>\
					<span style="display:block;"><button name="r2l"> <--- </button></span>\
				</td>\
				<td style="height:100%;width:45%;"><select name="rList" multiple="multiple" style="height:100%;width:100%;"></select></td>\
			</tr>\
		</tbody>\
	</table>\
	<div style="margin-top:5px;text-align:center;">\
		<span>'+Locale["vlan.template.vlan.notice"]+'</span>\
	</div>\
</div>\
';

var Template_MessageBox='\
<div title="'+Locale["vlan.dialog.title.tips"]+'">\
	<p class="message">{{html message}}</p>\
</div>';







