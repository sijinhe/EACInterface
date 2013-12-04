// JavaScript Document
// Author: Bill, 2011

/**
 * Template - Zone Option Group
 */
var Template_ZoneGroup='\
<select id="${id}">																\
	<optgroup label="'+Locale["bedivere.template.zone.select"]+'">				\
		{{each options}}														\
			<option value="${$value.value}">${$value.lable}</option>			\
		{{/each}}																\
	</optgroup>																	\
</select>																		\
';

var Template_TheAppTempPanel='\
<div id="${id}">\
	<input zmlm:item="appTempId" type="hidden"/>\
	<input zmlm:item="appTempZone" type="hidden"/>\
	<span class="dialogLine"><span class="dialogLineLeft">'+Locale["bedivere.template.column.template.name"]+':</span><span class="dialogLineRight"><input zmlm:item="appTempName" type="text"/></span></span>\
	<span class="dialogLine"><span class="dialogLineLeft">'+Locale["bedivere.template.column.template.desc"]+':</span><span class="dialogLineRight"><input zmlm:item="appTempDesc" type="text"/></span></span>\
	<span class="dialogLine"><span class="dialogLineLeft">'+Locale["bedivere.template.column.template.notes"]+':</span><span class="dialogLineRight"><input zmlm:item="appTempNotes" type="text"/></span></span>\
	<span class="splitter\"></span>\
	<span class="listPanel">\
		<span class="listItem">Sample</span>\
	</span>\
</div>';

/**
 * Template - Software Item
 */
var Template_SoftwareItem='\
<span class="listItem">											\
	<span class="itemMain"><em>${name}</em></span>								\
	<span class="itemExtra">${type}</span>										\
	<span class="itemExtra">${desc}</span>										\
	<span class="itemExtra">${intro}</span>										\
	<span class="itemExtra NOT-IMPLEMENTED"><a target="_blank" href="#" class="detail">'+Locale["bedivere.template.button.detail"]+'</a></span>			\
</span>';


var Template_MessageBox='\
<div title="'+Locale["bedivere.template.title.tips"]+'">\
	<p class="message">{{html message}}</p>\
</div>';

var Template_ApplyTempRow='\
	<span class="appTempRow">\
		<input zmlm:item="apptemplateid" value="${id}" type="hidden"/>\
		<span style="font-size:14px;">${name}</span>\
		<span style="font-size:11px;color:#AAA;">(${description})</span>\
		<span style="font-size:11px;color:#AAA;">(${notes})</span>\
	</span>\
';

var Template_ApplyConfRow='\
	<span class="appConfRow">\
		<input zmlm:item="softwareid" value="${softwareid}" type="hidden"/>\
		<span class="appConfRowTitle">${softwarename}</span>\
		<span class="appConfRowContent" title="'+Locale["bedivere.template.label.choose.config.for"].sprintf("${softwarename}")+'">\
			{{if resources.length}}\
				{{each resources}}\
					<span class="appResRow">\
						<input type="hidden" zmlm:item="sftresourceid" value="${$value.sftresourceid}"/>\
						<span>'+Locale["bedivere.template.label.cpu"].sprintf("${$value.cpu}", "${$value.maxcpu}")+'</span>\
						<span>'+Locale["bedivere.template.label.momery"].sprintf("${formatSize($value.mem*1024)}", "${formatSize($value.maxmem*1024)}")+'</span>\
					</span>\
				{{/each}}\
			{{else}}\
				<em>'+Locale["bedivere.message.no_data"]+'</em>\
			{{/if}}\
		</span>\
	</span>\
';

var Template_ApplyTempTabs='\
<div id="${id}">													\
	<ul>															\
		<li><a href="#tab-newapptemp"><span class="ui-icon ui-icon-document smallIcon"></span><span class="headTitle">'+Locale["bedivere.template.tabs.apply"]+'</span></a></li>			\
		<li><a href="#tab-appreqlist"><span class="ui-icon ui-icon-search smallIcon"></span><span class="headTitle">'+Locale["bedivere.template.tabs.list"]+'</span></a></li>		\
	</ul>															\
																	\
	<div id="tab-appreqlist">										\
		<span style="display:block;white-space:nowrap;">\
			<span class="examReqName appReqListHeader">'+Locale["bedivere.template.column.request.name"]+'</span>\
			<span class="examTempName appReqListHeader">'+Locale["bedivere.template.column.request.template"]+'</span>\
			<span class="examTempRes appReqListHeader">'+Locale["bedivere.template.column.request.config"]+'</span>\
			<span class="examStatus appReqListHeader">'+Locale["bedivere.template.column.request.status"]+'</span>\
			<span class="examOperation appReqListHeader">'+Locale["bedivere.template.column.request.operation"]+'</span>\
		</span>														\
		<span class="splitter"></span>								\
		<span zmlm:item="appReqList" class="appReqList"></span>		\
	</div>															\
	<div id="tab-newapptemp">											\
		<span style="display:block; padding:10px; color:#666;">\
            <span class="ui-icon ui-icon-folder-open smallIcon"></span><span>'+Locale["bedivere.template.label.zone"]+'</span>													\
            <span>																\
                <select id="zone">												\
                    <optgroup label="'+Locale["bedivere.template.zone.select"]+'">								\
                    </optgroup>													\
                </select>														\
            </span>																\
			<span><button onclick="listTemp(\'#${id}\')">'+Locale["bedivere.template.button.apply.inst"]+'</button></span>\
		</span>														\
																	\
		<span class="splitter"></span>								\
																	\
		<span class="ui-icon ui-icon-document-b smallIcon"></span><span class="newAppTempRowHeader">'+Locale["bedivere.template.label.choose.template"]+'</span>			\
		<span class="newAppTempRowContent" zmlm:item="tempList"></span>	\
		<span class="splitter"></span>								\
																	\
		<span class="ui-icon ui-icon-gear smallIcon"></span><span class="newAppTempRowHeader">'+Locale["bedivere.template.label.choose.config"]+'</span>			\
		<span class="newAppTempRowContent" zmlm:item="confList"></span>	\
		<span class="splitter"></span>								\
																	\
		<span class="ui-icon ui-icon-pencil smallIcon"></span><span class="newAppTempRowHeader">'+Locale["bedivere.template.label.fill.info"]+'</span>												\
		<span class="newAppTempRowContent" zmlm:item="applyDetail">										\
			<span><span>'+Locale["bedivere.template.label.apply.name"]+'</span><span><input type="text" zmlm:item="applyName" class="singleLineInput"></input></span></span>					\
			<span><span>'+Locale["bedivere.template.label.apply.start"]+'</span><span><input type="text" zmlm:item="applyStart" class="singleLineInput datepicker" readonly></input></span></span>		\
			<span><span>'+Locale["bedivere.template.label.apply.stop"]+'</span><span><input type="text" zmlm:item="applyEnd" class="singleLineInput datepicker" readonly></input></span></span>		\
		</span>																							\
		<span class="splitter"></span>								\
																	\
		<span style="display:block;text-align:right;">				\
			<span style="font-size:11px;color:red;">'+Locale["bedivere.template.label.apply.notice"]+'</span>				\
			<button onclick="applyRequest(\'#${id}\')">'+Locale["bedivere.template.button.submit.apply"]+'</button>									\
		</span>														\
	</div>															\
</div>																\
';

var Template_AppReqRow='\
<span class="appReqListRow">\
	<input zmlm:item="examReqId" type="hidden" value="${requestid}" />\
	<span zmlm:item="examReqName" class="appReqListCell examReqName textCollapse" title="${requestedname}">${requestedname}</span>	\
	<span zmlm:item="examTempName" class="appReqListCell examTempName textCollapse" title="${templatename}">${templatename}</span>	\
	<span zmlm:item="examTempRes" class="appReqListCell examTempRes textExpanded">								\
		{{each sftresources}}																\
			<span class="appResBox">\
				<span class="boxLine"><span class="boxLeft">'+Locale["bedivere.template.label.left.os"]+'</span><span class="boxRight" title="${$value.softwarename}">${$value.softwarename}</span></span>	\
				<span class="boxLine"><span class="boxLeft">'+Locale["bedivere.template.label.left.cpu"]+'</span><span class="boxRight">'+Locale["bedivere.template.label.cpu"].sprintf("${$value.cpu}", "${$value.maxcpu}")+'</span></span>	\
				<span class="boxLine"><span class="boxLeft">'+Locale["bedivere.template.label.left.mem"]+'</span><span class="boxRight">'+Locale["bedivere.template.label.momery"].sprintf("${formatSize($value.mem*1024)}", "${formatSize($value.maxmem*1024)}")+'</span></span>\
			</span>\
		{{/each}}																			\
	</span>																															\
	<span zmlm:item="examStatus" class="appReqListCell examStatus textCollapse">{{html formatExamStatus(status)}}</span>\
	<span zmlm:item="examSubTime" class="appReqListCell examOperation textCollapse">\
		{{if status=="unapproved"}}\
			<a href="#" onclick="cancelRequest(\'${requestid}\');return false;">'+Locale["bedivere.template.button.cancel.apply"]+'</a>									\
		{{/if}}\
	</span>\
</span>\
';


var Template_AppInstRow='\
<span class="appInstListRow">\
	<input zmlm:item="appinstanceid" type="hidden" value="${appinstanceid}" />\
	<span zmlm:item="appinstancename" class="appInstListCell instName textCollapse" title="${appinstancename}">${appinstancename}</span>	\
	<span zmlm:item="vms" class="appInstListCell instRes textExpanded">								\
		{{each vms}}															\
			{{if $value.vmuuid=="invalid"}}\
			<span class="appResBox">\
		        <span class="boxLine">\
		          <span class="boxLeft">'+Locale["bedivere.template.label.left.vm"]+'</span>\
		          <span class="boxRight"><em>'+Locale["bedivere.template.label.right.removed"]+'</em></span>\
		        </span>\
			</span>\
			{{else}}\
			<span class="appResBox">\
				<input zmlm:item="vmuuid" type="hidden" value="${$value.vmuuid}" />\
				<span class="boxLine"><span class="boxLeft">'+Locale["bedivere.template.label.left.vm"]+'</span><span class="boxRight" title="${$value.vmname}">${$value.vmname}</span></span>	\
				<span class="boxLine"><span class="boxLeft">'+Locale["bedivere.template.label.left.desc"]+'</span><span class="boxRight" title="${$value.description}">${$value.description}</span></span>\
			</span>\
      {{/if}}\
		{{/each}}																			\
	</span>\
	<span zmlm:item="configures" class="appInstListCell instConf textExpanded">								\
		{{each configures}}																\
			${$value.configure}	\
			<span class="splitter"></span>\
		{{/each}}																			\
	</span>																													\
	<span class="appInstListCell instOperation textCollapse">\
		<span class="_operation">\
			<a href="#" onclick="startInstance(\'${appinstanceid}\', this);return false;">'+Locale["bedivere.template.button.inst.start"]+'</a>\
			<a href="#" onclick="stopInstance(\'${appinstanceid}\', this);return false;">'+Locale["bedivere.template.button.inst.stop"]+'</a>\
			<a href="#" onclick="deleteInstance(\'${appinstanceid}\', this);return false;">'+Locale["bedivere.template.button.inst.remove"]+'</a>\
		</span>\
		<span class="_tips" style="display:none;">\
			<img src="css/image/progress.gif"/>\
			<span><em>'+Locale["bedivere.dialog.processing"]+'</em></span>\
		</span>\
	</span>\
</span>\
';

var Template_AppInstPage='<div id="${id}">\									\
	<span style="display:block;white-space:nowrap;">\
		<span class="instName appInstListHeader">'+Locale["bedivere.template.column.inst.name"]+'</span>\
		<span class="instRes appInstListHeader">'+Locale["bedivere.template.column.inst.conf"]+'</span>\
		<span class="instConf appInstListHeader">'+Locale["bedivere.template.column.inst.info"]+'</span>\
		<span class="instOperation appInstListHeader">'+Locale["bedivere.template.column.inst.oper"]+'</span>\
	</span>														\
	<span class="splitter"></span>								\
	<span zmlm:item="appInstList" class="appInstList"></span>		\
</div>';









