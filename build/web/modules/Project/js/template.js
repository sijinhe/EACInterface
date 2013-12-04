// JavaScript Document
// Author: Bill, 2011

/**
 * Template - Zone Option Group
 */
var Template_ZoneGroup='\
<select id="${id}">																\
	<optgroup label="'+Locale["project.template.zone"]+'">												\
		{{each options}}														\
			<option value="${$value.value}">${$value.lable}</option>			\
		{{/each}}																\
	</optgroup>																	\
</select>																		\
';

/**
 * Template - Software Item
 */
var Template_SoftwareItem='\
<span class="listItem">											\
	<span class="itemMain"><em>${name}</em></span>								\
	<span class="itemExtra">${type}</span>										\
	<span class="itemExtra">${desc}</span>										\
	<span class="itemExtra">${intro}</span>										\
	<span class="itemExtra NOT-IMPLEMENTED"><a target="_blank" href="#" class="detail">'+Locale["project.template.detail"]+'</a></span>\
</span>';


var Template_MessageBox='\
<div title="'+Locale["project.template.tips"]+'">\
	<p class="message">{{html message}}</p>\
</div>';

var Template_ApplyTempRow='\
	<span class="appTempRow">\
		<input zmlm:item="softwareid" value="${id}" type="hidden"/>\
		<span style="font-size:14px;">${name}</span>\
		<span style="font-size:11px;color:#AAA;font-style:italic;">(${type})</span>\
		<span style="font-size:11px;color:#AAA;font-style:italic;">(${desc})</span>\
		<span style="font-size:11px;color:#AAA;font-style:italic;">(${intro})</span>\
	</span>\
';

var Template_ApplyConfRow='\
	<span class="appConfRow">\
		<input zmlm:item="softwareid" value="${softwareid}" type="hidden"/>\
		<span class="appConfRowTitle">${softwarename}</span>\
		<span class="appConfRowContent" title="'+Locale["project.template.chooseconfig"].sprintf("${softwarename}")+'">\
			{{if resources.length}}\
				{{each resources}}\
					<span class="appResRow">\
						<input type="hidden" zmlm:item="sftresourceid" value="${$value.sftresourceid}"/>\
						<span>'+Locale["project.template.cpu"].sprintf("${$value.cpu}","${$value.maxcpu}")+'</span>\
						<span>'+Locale["project.template.mem"].sprintf("${formatSize($value.mem*1024)}","${formatSize($value.maxmem*1024)}")+'</span>\
					</span>\
				{{/each}}\
			{{else}}\
				<em>'+Locale["project.template.nohardwaredata"]+'</em>\
			{{/if}}\
		</span>\
	</span>\
';

var Template_moreVMPane='\
<span box vmconfbox style="display:block;border:1px solid silver;margin:5px;padding:5px;position:relative;">									\
	<span style="display:block;background:#f4f4f4;margin:-5px;padding:5px;margin-bottom:5px;position:relative;">					\
		'+Locale["project.template.vmprefix"].sprintf("")+'\
		<input zmlm:item="vmprefix" type="text"/>\
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
		'+Locale["project.template.sfamount"]+'\
		<input zmlm:item="vmamount" type="text" value="1"/>\
		<span name="lessVMBtn" style="background:url(css/image/delete.gif) no-repeat;display:inline-block;position:absolute;right:8px;top:8px;width:14px;height:14px;padding:0;margin:0;cursor:pointer;" title="'+Locale["project.template.vmremove"]+'"></span>\
	</span>\
	<span class="newAppTempRowHeader">'+Locale["project.template.choosesoftwareconfig"]+'</span>			\
	<span class="newAppTempRowContent" zmlm:item="tempList"><em>'+Locale["project.template.nozone"]+'</em></span>	\
	<span class="splitter"></span>								\
	\
	<span class="newAppTempRowHeader">'+Locale["project.template.choosehardwareconfig"]+'</span>			\
	<span class="newAppTempRowContent" zmlm:item="confList"><em>'+Locale["project.template.nosoftware"]+'</em></span>	\
</span>\
';

var Template_ApplyTempTabs='\
<div page id="${id}">													\
	<ul>															\
		<li><a href="#tab-newapptemp"><span class="ui-icon ui-icon-script smallIcon"></span>'+Locale["project.template.newproj"]+'</a></li>\
		<li><a href="#tab-appreqlist"><span class="ui-icon ui-icon-signal-diag smallIcon"></span>'+Locale["project.template.listproj"]+'</a></li>\
	</ul>															\
																	\
	<div id="tab-appreqlist">										\
		<span style="display:block;white-space:nowrap;">\
			<span class="examReqName appReqListHeader">'+Locale["project.template.projname"]+'</span>\
			<span class="examTempName appReqListHeader">'+Locale["project.template.projdesc"]+'</span>\
			<span class="examTempRes appReqListHeader">'+Locale["project.template.projconf"]+'</span>\
			<span class="examDuration appReqListHeader">'+Locale["project.template.projdate"]+'</span>\
			<span class="examStatus appReqListHeader">'+Locale["project.template.projstatus"]+'</span>\
			<span class="examOperation appReqListHeader">'+Locale["project.template.projoperation"]+'</span>\
		</span>														\
		<span class="splitter"></span>								\
		<span zmlm:item="appReqList" class="appReqList"></span>		\
	</div>															\
	<div id="tab-newapptemp">											\
		\
		<h2>Step. 1</h2>\
		\
		<span style="display:block;">\
            <span class="ui-icon ui-icon-folder-open smallIcon"></span><span>'+Locale["project.template.where"]+'</span>										\
            <span>																\
                <select id="zone">												\
                    <optgroup label="'+Locale["project.template.zone"]+'">								\
                    </optgroup>													\
                </select>														\
            </span>																\
			<span><button onclick="listTemp(\'#${id}\')">'+Locale["project.template.listtemp"]+'</button></span>\
		</span>														\
																	\
		<span class="splitter"></span>								\
		\
		<h2>Step. 2</h2>\
		<span class="newAppTempRowHeader">'+Locale["project.template.fillinfo"]+'</span>												\
		<span class="newAppTempRowContent" zmlm:item="applyDetail">										\
			<span><span>'+Locale["project.template.projname"]+'</span><span><input type="text" zmlm:item="applyName" class="singleLineInput"></input></span></span>					\
			<span><span>'+Locale["project.template.projdesc"]+'</span><span><input type="text" zmlm:item="applyDesc" class="singleLineInput"></input></span></span>					\
			<span><span>'+Locale["project.template.startdate"]+'</span><span><input type="text" zmlm:item="applyStart" readonly class="singleLineInput datepicker"></input></span></span>		\
			<span><span>'+Locale["project.template.enddate"]+'</span><span><input type="text" zmlm:item="applyEnd" readonly class="singleLineInput datepicker"></input></span></span>		\
		</span>																							\
		<span class="splitter"></span>								\
		\
		<h2>Step. 3</h2>\
		\
		{{tmpl "moreVMBoxTemplate"}}\
		\
		<span style="display:block;text-align:right;"><button id="moreVMBtn">'+Locale["project.template.morevm"]+'</button></span>\
		<span class="splitter"></span>								\
		\
		<h2>Step. 4</h2>\
		\
		<span box style="display:block;border:1px solid silver;margin:5px;padding:5px;position:relative;">									\
			<span style="display:block;background:#f4f4f4;margin:-5px;padding:5px;margin-bottom:5px;position:relative;">					\
				'+Locale["project.template.needip"]+' &nbsp;\
				<input value="false" name="needIp" type="radio" checked/>'+Locale["project.template.false"]+'\
				<input value="true" name="needIp" type="radio"/>'+Locale["project.template.true"]+'\
			</span>\
			<span class="newAppTempRowHeader">'+Locale["project.template.ipamount"]+'</span>			\
			<span class="newAppTempRowContent">'+Locale["project.template.personal"]+'&nbsp;\
			<input zmlm:item="personalIpAmount" type="text" value="0" disabled />'+Locale["project.template.unit"]+'</span>\
			<span class="newAppTempRowContent">'+Locale["project.template.web"]+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
			<input zmlm:item="webIpAmount" type="text" value="0" disabled />'+Locale["project.template.unit"]+'</span>\
		</span>\
		\
		<span box diskpane style="display:block;border:1px solid silver;margin:5px;padding:5px;position:relative;">								\
			<em>'+Locale["project.template.nodiskinfo"]+'</em>\
		</span>\
		\
		\
		<span class="splitter"></span>								\
		\
		\
		<span style="display:block;text-align:right;">				\
			<span style="font-size:11px;color:red;">'+Locale["project.template.notice"]+'</span>				\
			<button id="submitBtn">'+Locale["project.template.submit"]+'</button>									\
		</span>														\
	</div>															\
</div>																\
';

var Template_DiskBoxIsNeed='\
<span style="display:block;background:#f4f4f4;margin:-5px;padding:5px;margin-bottom:5px;position:relative;">					\
	'+Locale["project.template.needdisk"]+' &nbsp;\
	<input value="false" name="needDisk" type="radio" checked/>'+Locale["project.template.false"]+'\
	<input value="true" name="needDisk" type="radio"/>'+Locale["project.template.true"]+'\
</span>\
';

var Template_DiskQuota='\
<span diskquotabox class="newAppTempRowContent">\
	<span style="display:inline-block;width:40px;">${name}</span>\
	<input zmlm:item="diskSize" type="hidden" value="${size}"/>\
	<input zmlm:item="diskAmount" type="text" value="0" disabled />个\
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
	'+Locale["project.template.input.diskprefix"]+'&nbsp;\
	<input zmlm:item="diskPrefix" type="text" disabled />\
</span>\
';

var Template_ProjectPreview='\
<div id="${paneid}" title="项目申请总览" class="projectPreview">\
	<div class="ppl"><span class="pplLeft">'+Locale["project.template.projzone"]+'</span><span class="pplRight">${zone}</span></div>\
	<div class="ppl"><span class="pplLeft">'+Locale["project.template.projname"]+'</span><span class="pplRight">${projectname}</span></div>\
	<div class="ppl"><span class="pplLeft">'+Locale["project.template.projdesc"]+'</span><span class="pplRight">${projectdes}</span></div>\
	<div class="ppl"><span class="pplLeft">'+Locale["project.template.projdate"]+'</span><span class="pplRight">${starttime} ~ ${endtime}</span></div>\
	<span class="splitter"></span>\
	<div class="ppl"><span class="pplLeft">'+Locale["project.template.vmamount"]+'</span><span class="pplRight">${sftresources_amount}</span></div>\
	<span class="splitter"></span>\
	<div class="ppl"><span class="pplLeft">'+Locale["project.template.needip"]+'</span><span class="pplRight">${iprequired?"'+Locale["project.template.true"]+'":"'+Locale["project.template.false"]+'"}</span></div>\
	{{if iprequired}}\
		<div class="ppl"><span class="pplLeft">'+Locale["project.template.personalamount"]+'</span><span class="pplRight">${personalIp_amount}</span></div>\
		<div class="ppl"><span class="pplLeft">'+Locale["project.template.webamount"]+'</span><span class="pplRight">${webIp_amount}</span></div>\
	{{/if}}\
	<span class="splitter"></span>\
	<div class="ppl"><span class="pplLeft">'+Locale["project.template.needdisk"]+'</span><span class="pplRight">${volumerequired?"'+Locale["project.template.true"]+'":"'+Locale["project.template.false"]+'"}</span></div>\
	{{if volumerequired}}\
		<div class="ppl"><span class="pplLeft">'+Locale["project.template.diskamount"]+'</span><span class="pplRight">${volrequests_amount}</span></div>\
	{{/if}}\
</div>\
';

var Template_AppReqRow='\
<span class="appReqListRow">\
	<input zmlm:item="examReqId" type="hidden" value="${projectid}" />\
	<span zmlm:item="examReqName" class="appReqListCell examReqName textCollapse" title="${projectname}">${projectname}</span>	\
	<span zmlm:item="examTempName" class="appReqListCell examTempName textCollapse" title="${projectdes}">${projectdes}</span>	\
	<span zmlm:item="examTempRes" class="appReqListCell examTempRes textExpanded">								\
		<!--VM configuration list-->\
		{{if sftresources.length==0}}\
			<em>'+Locale["project.template.reqnovmconf"]+'</em>\
		{{else}}\
		{{each sftresources}}\
			<span class="ui-icon ui-icon-home" style="float:left; margin:0 0 0 0;"></span><b>'+Locale["project.template.eachsftres"].sprintf("${$value.vmprefix}","${$value.quantity}")+'</b>\
			<span class="appResBox" title="'+Locale["project.template.vmprefix"].sprintf("${$value.vmprefix}")+'">\
				<span class="boxLine"><span class="boxLeft">'+Locale["project.template.label.sys"]+'</span><span class="boxRight" title="${$value.softwarename}">${$value.softwarename}</span></span>	\
				<span class="boxLine"><span class="boxLeft">'+Locale["project.template.label.cpu"]+'</span><span class="boxRight">${$value.cpu} '+Locale["project.template.label.maxcpu"].sprintf("${$value.maxcpu}")+'</span></span>\
				<span class="boxLine"><span class="boxLeft">'+Locale["project.template.label.mem"]+'</span><span class="boxRight">${formatSize($value.mem*1024)} '+Locale["project.template.label.maxmem"].sprintf("${formatSize($value.maxmem*1024)}")+'</span></span>	\
			</span>\
		{{/each}}\
		{{/if}}\
		<!--IP configuration list-->\
		{{if ipresources.length>0}}\
			<span class="ui-icon ui-icon-transferthick-e-w" style="float:left; margin:0 0 0 0;"></span><b>'+Locale["project.template.ipconf"]+'</b>\
			<span class="appResBox">\
				{{each ipresources}}\
					{{if $value.iptype=="web"}}\
						<span class="boxLine"><span class="boxLeft">'+Locale["project.template.personal"]+'</span><span class="boxRight">${$value.quantity} '+Locale["project.template.unit"]+'</span></span>\
					{{else $value.iptype=="personal"}}\
						<span class="boxLine"><span class="boxLeft">'+Locale["project.template.web"]+'</span><span class="boxRight">${$value.quantity} '+Locale["project.template.unit"]+'</span></span>\
					{{/if}}\
				{{/each}}\
			</span>\
		{{/if}}\
		<!--Volume configuration list-->\
		{{if volumeresources.length>0}}\
			<span class="ui-icon ui-icon-disk" style="float:left; margin:0 0 0 0;"></span><b>'+Locale["project.template.diskconf"]+'</b>\
			<span class="appResBox">\
				{{each volumeresources}}\
					<span class="boxLine" title="'+Locale["project.template.diskprefix"].sprintf("${$value.volumeprefix}")+'"><span class="boxLeft boxLeftWider">{{html formatSize($value.volumesize)}}</span><span class="boxRight">${$value.quantity} ['+Locale["project.template.diskprefix"].sprintf("${$value.volumeprefix}")+']</span></span>\
				{{/each}}\
			</span>\
		{{/if}}\
	</span>\
	<span zmlm:item="examDuration" class="appReqListCell examDuration textExpanded" title="'+Locale["project.template.submitdate"]+' {{html formatDate(submissiontime.time)}}">{{html formatDate(projectstarttime.time)}} ~ {{html formatDate(projectendtime.time)}}</span>\
	<span zmlm:item="examStatus" class="appReqListCell examStatus textCollapse" title="'+Locale["project.template.submitdate"]+' {{html formatDate(submissiontime.time)}}">{{html formatExamStatus(requeststatus)}}</span>\
	<span zmlm:item="examSubTime" class="appReqListCell examOperation textCollapse">\
		{{if requeststatus=="unapproved"}}\
			<a href="#" onclick="cancelRequest(\'${projectid}\');return false;">'+Locale["project.template.cancelreq"]+'</a>									\
		{{/if}}\
	</span>\
</span>\
';


var Template_AppInstRow='\
<span class="appInstListRow">\
	<input zmlm:item="appinstanceid" type="hidden" value="${projectid}" />\
	<span zmlm:item="appinstancename" class="appInstListCell instName textCollapse" title="${projectname}">${projectname}</span>\
	<span zmlm:item="appinstancedesc" class="appInstListCell instDesc textCollapse" title="${projectdes}">${projectdes}</span>\
	<span zmlm:item="vms" class="appInstListCell instRes textExpanded">\
		{{if vms.length>0}}\
			{{each vms}}\
				{{if !$value.software[0] || $value.software[0].vmuuid=="invalid"}}\
				<span class="appResBox">\
					<span class="ui-icon ui-icon-home" style="float:left; margin:0 0 0 0;"></span><b>'+Locale["project.template.vmconf"]+'</b>\
			        <span class="boxLine">\
			        	<span class="boxLeft">'+Locale["project.template.vm"]+'</span>\
			        	<span class="boxRight"><em>'+Locale["project.template.removed"]+'</em></span>\
			        </span>\
				</span>\
				{{else}}\
				<span class="appResBox">\
					<span class="ui-icon ui-icon-home" style="float:left; margin:0 0 0 0;"></span><b>'+Locale["project.template.vmconf"]+'</b>\
					<input zmlm:item="vmuuid" type="hidden" value="${$value.software[0].vmuuid}" />\
					<span class="boxLine"><span class="boxLeft">'+Locale["project.template.vm"]+'</span><span class="boxRight">${$value.software[0].vmname}</span></span>	\
					<span class="boxLine"><span class="boxLeft">'+Locale["project.template.desc"]+'</span><span class="boxRight">${$value.software[0].description}</span></span>\
				</span>\
	      		{{/if}}\
			{{/each}}\
		{{else}}\
			<em>'+Locale["project.template.novmconf"]+'</em>\
		{{/if}}\
		{{if ips.length>0}}\
			<span class="appResBox">\
				<span class="ui-icon ui-icon-transferthick-e-w" style="float:left; margin:0 0 0 0;"></span><b>'+Locale["project.template.ipconf"]+'</b>\
				{{each ips}}\
					{{if $value.ip[0].iptype=="personal"}}\
						<span class="boxLine"><span class="boxLeft">'+Locale["project.template.netip"]+'</span><span class="boxRight">${$value.ip[0].ipvalue}</span></span>\
					{{/if}}\
				{{/each}}\
			</span>\
		{{/if}}\
		{{each volumes}}\
			<span class="appResBox">\
				<span class="ui-icon ui-icon-disk" style="float:left; margin:0 0 0 0;"></span><b>'+Locale["project.template.disk"]+'</b>\
				<span class="boxLine"><span class="boxLeft">'+Locale["project.template.image"]+'</span><span class="boxRight">${$value.volumename=="invalid"?"'+Locale["project.template.invalid"]+'":$value.volumename}</span></span>\
				<span class="boxLine"><span class="boxLeft">'+Locale["project.template.size"]+'</span><span class="boxRight">${$value.volumesize=="invalid"?"'+Locale["project.template.invalid"]+'":formatSize($value.volumesize)}</span></span>\
			</span>\
		{{/each}}\
	</span>\
	<span zmlm:item="configures" class="appInstListCell instConf textExpanded">\
		{{html formatDate(starttime.time)}} ~ {{html formatDate(endtime.time)}}\
	</span>\
	<span class="appInstListCell instOperation textCollapse">\
		<label style="font-size:10px; color:#7f7f7f;">[<i>'+Locale["project.template.nooperation"]+'</i>]</label>\
		<span class="_operation hidden">\
			<a href="#" onclick="startInstance(\'${appinstanceid}\', this);return false;">'+Locale["project.template.start"]+'</a>\
			<a href="#" onclick="stopInstance(\'${appinstanceid}\', this);return false;">'+Locale["project.template.stop"]+'</a>\
			<a href="#" onclick="deleteInstance(\'${appinstanceid}\', this);return false;">'+Locale["project.template.remove"]+'</a>\
		</span>\
		<span class="_tips" style="display:none;">\
			<img src="css/image/progress.gif"/>\
			<span><em>'+Locale["project.template.processing"]+'</em></span>\
		</span>\
	</span>\
</span>\
';

var Template_AppInstPage='<div id="${id}">\
	<span style="display:block;white-space:nowrap;">\
		<span class="instName appInstListHeader">'+Locale["project.template.projname"]+'</span>\
		<span class="instDesc appInstListHeader">'+Locale["project.template.projdesc"]+'</span>\
		<span class="instRes appInstListHeader">'+Locale["project.template.projconf"]+'</span>\
		<span class="instConf appInstListHeader">'+Locale["project.template.projdate"]+'</span>\
		<span class="instOperation appInstListHeader">'+Locale["project.template.projoperation"]+'</span>\
	</span>\
	<span class="splitter"></span>\
	<span zmlm:item="appInstList" class="appInstList"></span>\
</div>';









