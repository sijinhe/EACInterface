// JavaScript Document
// Author: Bill, 2011

/**
 * Template - Zone Option Group
 */
var Template_NewBackupTaskPanel='\
<div id="${id}" style="font-size:12px;">\
	<input zmlm:item="backupTaskId" type="hidden"/>\
	\
	<h3>'+Locale["backup.template.step.1"]+'</h3>\
	<span class="dialogLine">\
		<span class="dialogLineLeft">'+Locale["backup.template.label.left.task.name"]+':</span>\
		<span class="dialogLineRight">\
			<input zmlm:item="jobname" type="text"/>\
			<em class="smallFont">'+Locale["backup.template.label.tips.task.name"]+'</em>\
		</span>\
	</span>\
	<span class="dialogLine">\
		<span class="dialogLineLeft">'+Locale["backup.template.label.left.object.type"]+':</span>\
		<span class="dialogLineRight">\
			<select zmlm:item="objecttype">\
				<option value="vm" selected>'+Locale["backup.template.option.vm"]+'</option>\
				<option value="volume">'+Locale["backup.template.option.volume"]+'</option>\
			</select>\
		</span>\
	</span>\
	<span class="dialogLine">\
		<span class="dialogLineLeft">'+Locale["backup.template.label.left.backup.object"]+':</span>\
		<span class="dialogLineRight">\
			<select zmlm:item="objectid">\
				<option value="n/a" selected>N/A</option>\
			</select>\
		</span>\
	</span>\
	<span class="dialogLine">\
		<span class="dialogLineLeft">'+Locale["backup.template.label.left.max.redundancy"]+':</span>\
		<span class="dialogLineRight">\
			<select zmlm:item="backupmaxnum" style="width:60px;">\
				<option value="1" selected>1</option>\
				<option value="2">2</option>\
				<option value="3">3</option>\
				<option value="4">4</option>\
				<option value="5">5</option>\
			</select>\
			 '+Locale["backup.template.unit.backup"]+'\
		</span>\
	</span>\
	\
	<span class="splitter"></span>\
	<h3>'+Locale["backup.template.step.2"]+'</h3>\
	\
	<span class="dialogLine">\
		<span class="dialogLineLeft">'+Locale["backup.template.label.left.period"]+':</span>\
		<span class="dialogLineRight">\
			<select zmlm:item="backupperiod">\
				<option value="daily" selected>'+Locale["backup.template.option.daily"]+'</option>\
				<option value="weekly">'+Locale["backup.template.option.weekly"]+'</option>\
				<option value="monthly">'+Locale["backup.template.option.monthly"]+'</option>\
			</select>\
		</span>\
	</span>\
	<span class="dialogLine">\
		<span class="dialogLineLeft">'+Locale["backup.template.label.left.dayofmonth"]+':</span>\
		<span class="dialogLineRight">\
			<select zmlm:item="dayofmonth">\
				<optgroup label="'+Locale["backup.template.label.choose.date"]+'">\
					{{html dumpDaysOfMonth()}}\
				</optgroup>\
			</select>\
			 '+Locale["backup.date.day"]+'<em class="smallFont">'+Locale["backup.template.label.date.notice"]+'</em>\
		</span>\
	</span>\
	<span class="dialogLine">\
		<span class="dialogLineLeft">'+Locale["backup.template.label.left.dayofweek"]+':</span>\
		<span class="dialogLineRight">\
			<select zmlm:item="backupday">\
				{{html dumpDaysOfWeek()}}\
			</select>\
		</span>\
	</span>\
	<span class="dialogLine">\
		<span class="dialogLineLeft">'+Locale["backup.template.label.left.backuptime"]+':</span>\
		<span class="dialogLineRight">\
			<select zmlm:item="backuphour" style="width:60px;">\
				{{html dumpHours()}}\
			</select>\
			  '+Locale["backup.date.hour"]+'  \
			<select zmlm:item="backupminute" style="width:60px;">\
				{{html dumpMinutes()}}\
			</select>\
			  '+Locale["backup.date.minute"]+'  \
		</span>\
	</span>\
	\
</div>';

var Template_BackupTabs='\
<div page id="${id}">													\
	<ul>															\
		<li><a href="#tab-backuptask"><span class="ui-icon ui-icon-script smallIcon"></span>'+Locale["backup.template.tabs.task"]+'</a></li>\
		<li><a href="#tab-backupimage"><span class="ui-icon ui-icon-signal-diag smallIcon"></span>'+Locale["backup.template.tabs.file"]+'</a></li>\
	</ul>															\
																	\
	<div id="tab-backuptask">\
		<span style="display:block;white-space:nowrap;">\
			<span class="backupTaskName backupTaskListHeader">'+Locale["backup.template.column.task.name"]+'</span>\
			<span class="backupTaskType backupTaskListHeader">'+Locale["backup.template.column.task.type"]+'</span>\
			<span class="backupTaskObject backupTaskListHeader">'+Locale["backup.template.column.task.object"]+'</span>\
			<span class="backupTaskRedundancy backupTaskListHeader">'+Locale["backup.template.column.task.redundancy"]+'</span>\
			<span class="backupTaskAmount backupTaskListHeader">'+Locale["backup.template.column.task.amount"]+'</span>\
			<span class="backupTaskPeriod backupTaskListHeader">'+Locale["backup.template.column.task.period"]+'</span>\
			<span class="backupTaskTime backupTaskListHeader">'+Locale["backup.template.column.task.time"]+'</span>\
			<span class="backupOperation backupTaskListHeader">'+Locale["backup.template.column.task.operation"]+'</span>\
		</span>														\
		<span class="splitter"></span>								\
		<span zmlm:item="backupTaskList" class="backupTaskList"></span>		\
		<span class="splitter"></span>								\
		<span style="display:block;white-space:nowrap;text-align:right;">\
			<button onclick="loadBackupTask()">'+Locale["backup.template.button.refresh"]+'</button>\
			<button onclick="showNewTaskDialog()">'+Locale["backup.template.button.new.task"]+'</button>\
		</span>\
	</div>\
	<div id="tab-backupimage">\
		<span style="display:block;white-space:nowrap;">\
			<span class="backupImageObject backupImageListHeader">\
				'+Locale["backup.template.column.task.object"]+'\
				<span style="display:inline-block;white-space:nowrap;">\
					<select zmlm:item="objecttype">\
						<option value="vm" selected>'+Locale["backup.template.option.vm"]+'</option>\
						<option value="volume">'+Locale["backup.template.option.volume"]+'</option>\
					</select>\
				</span>\
			</span>\
			<span class="backupImageTime backupImageListHeader">'+Locale["backup.template.column.task.time"]+'</span>\
			<span class="backupImageLatest backupImageListHeader"></span>\
			<span class="backupOperation backupTaskListHeader">'+Locale["backup.template.column.task.operation"]+'</span>\
		</span>\
		<span class="splitter"></span>\
		<span zmlm:item="backupImageList" class="backupImageList"></span>\
		<span class="splitter"></span>								\
		<span style="display:block;white-space:nowrap;text-align:right;">\
			<button onclick="loadBackupImage()">'+Locale["backup.template.button.refresh"]+'</button>\
		</span>\
	</div>\
</div>\
';

var Template_BackupTaskRow='\
<span class="backupTaskRow">\
	<input zmlm:item="backupTaskId" type="hidden" value="${jobid}" />\
	<input zmlm:item="backupTaskName" type="hidden" value="${jobname}" />\
	<input zmlm:item="backupTaskType" type="hidden" value="${objecttype}" />\
	<input zmlm:item="backupTaskObjectId" type="hidden" value="${objectid}" />\
	<input zmlm:item="backupTaskMaxNum" type="hidden" value="${maxnum}" />\
	<input zmlm:item="backupTaskObjectName" type="hidden" value="${objectname}" />\
	<input zmlm:item="backupTaskPeriod" type="hidden" value="${backupperiod}" />\
	<input zmlm:item="backupTaskDate" type="hidden" value="${backupdate}" />\
	<input zmlm:item="backupTaskHour" type="hidden" value="${backuphour}" />\
	<input zmlm:item="backupTaskMinute" type="hidden" value="${backupminute}" />\
	<span class="backupTaskCell backupTaskName textCollapse">${jobname}</span>	\
	<span class="backupTaskCell backupTaskType textCollapse">{{html formatObjectType(objecttype)}}</span>\
	<span class="backupTaskCell backupTaskObject textCollapse">${objectname}</span>\
	<span class="backupTaskCell backupTaskRedundancy textCollapse">${maxnum}</span>	\
	<span class="backupTaskCell backupTaskAmount textCollapse">${currentbackupcopies}</span>\
	<span class="backupTaskCell backupTaskPeriod textCollapse">${formatPeriod(backupperiod)}</span>\
	<span class="backupTaskCell backupTaskTime textCollapse">${formatTaskTime(backupperiod, backupdate, backuphour, backupminute)}</span>\
	<span class="backupTaskCell backupOperation textCollapse">\
		<a href="#" onclick="showUpdateTaskDialog(this);return false;">'+Locale["backup.template.button.modify"]+'</a>\
		<a href="#" onclick="removeTask(this);return false;">'+Locale["backup.template.button.remove"]+'</a>\
	</span>\
</span>\
';

var Template_BackupImageRow='\
<span class="backupImageRow">\
	<input zmlm:item="backupImageId" type="hidden" value="${backupid}" />\
	<input zmlm:item="backupImageUrl" type="hidden" value="${backupurl}" />\
	<input zmlm:item="backupImageType" type="hidden" value="${objecttype}" />\
	<span class="backupTaskCell backupImageObject textCollapse">${backupname}</span>\
	<span class="backupTaskCell backupImageTime textCollapse">${formatDate(backuptime)}</span>\
	<span class="backupTaskCell backupImageLatest textCollapse">{{html formatLatestMark(_latest)}}</span>\
	<span class="backupTaskCell backupOperation textCollapse">\
		<a href="#" onclick="restoreImage(this);return false;">'+Locale["backup.template.button.restore"]+'</a>\
		<a href="#" onclick="removeImage(this);return false;">'+Locale["backup.template.button.remove"]+'</a>\
	</span>\
</span>\
';

var Template_MessageBox='\
<div title="'+Locale["backup.dialog.tips"]+'">\
	<p class="message">{{html message}}</p>\
</div>';







