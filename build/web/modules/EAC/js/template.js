// JavaScript Document
// Author: Bill, 2011

var Template_VmPanel='\
<div id="${id}">\
	<span style="display:block;white-space:nowrap;">\
		<span class="vmName vmRowHeader">'+Locale["eacm.template.eacm.name"]+'</span>\
		<span class="vmStatus vmRowHeader">'+Locale["eacm.template.eacm.appstatus"]+'</span>\
		<span class="vmOperation vmRowHeader">'+Locale["eacm.template.eacm.appoperation"]+'</span>\
		<span class="vmStatus vmRowHeader">'+Locale["eacm.template.eacm.dbstatus"]+'</span>\
                <span class="vmCpus vmRowHeader">'+Locale["eacm.template.eacm.maxcon"]+'</span>\
                <span class="vmStatus vmRowHeader">'+Locale["eacm.template.eacm.dboperation"]+'</span>\
                <span class="vmStatus vmRowHeader">'+Locale["eacm.template.eacm.operation"]+'</span>\
	</span>														\
	<span class="splitter"></span>								\
	<span zmlm:item="vmList" class="vmList"></span>		\
	<span class="splitter"></span>								\
	<span style="display:block;white-space:nowrap;text-align:right;">\
		<button onclick="loadVm()">'+Locale["eacm.template.eacm.refresh"]+'</button>\
	</span>\
</div>\
';

var Template_VmRow='\
<span class="vmRow">\
	<input zmlm:item="vmId" type="hidden" value="${containerid}" />\
	<input zmlm:item="name" type="hidden" value="${containername}" />\
        <input zmlm:item="appname" type="hidden" value="${appname}" />\
	<input zmlm:item="appstatus" type="hidden" value="${appstatus}" />\
        <input zmlm:item="clusterip" type="hidden" value="${clusterip}" />\
	<input zmlm:item="dbstatus" type="hidden" value="${dbstatus}" />\
        <span class="vmRowCell vmName textCollapse">${containername}</span>\
        <span class="vmRowCell vmStatus textCollapse">{{html formatStatus(appstatus)}}</span>\
        {{if appstatus=="VACANT"}}\
            <span class="vmRowCell vmOperation textCollapse">\
                <a href="#" onclick="upload(this);return false;">Upload</a>\
                <a href="#" onclick="disableapp(this);return false;">'+Locale["eacm.template.eacm.appdisable"]+'</a>\
            </span>\
        {{/if}}\
        {{if appstatus=="RUNNING"}}\
            <span class="vmRowCell vmOperation textCollapse">\
                <a href="http://${clusterip}/${appname}/" target="_blank">Visit</a>\
                <a href="log.html?containerid=${containerid}&clusterip=${clusterip}" target="_blank">Log</a>\
                <a href="#" onclick="stopapp(this);return false;">'+Locale["eacm.template.eacm.stop"]+'</a>\
                <a href="#" onclick="reloadapp(this);return false;">'+Locale["eacm.template.eacm.reload"]+'</a>\
                <a href="#" onclick="undeployapp(this);return false;">'+Locale["eacm.template.eacm.undeploy"]+'</a>\
            </span>\
        {{/if}}\
        {{if appstatus=="STOPPED"}}\
            <span class="vmRowCell vmOperation textCollapse">\
                <a href="log.html?containerid=${containerid}&clusterip=${clusterip}" target="_blank">Log</a>\
                <a href="#" onclick="startapp(this);return false;">'+Locale["eacm.template.eacm.start"]+'</a>\
                <a href="#" onclick="undeployapp(this);return false;">'+Locale["eacm.template.eacm.undeploy"]+'</a>\
            </span>\
        {{/if}}\
        {{if appstatus=="NOT_IN_USE"}}\
            <span class="vmRowCell vmOperation textCollapse">\
                <a href="#" onclick="enableapp(this);return false;">'+Locale["eacm.template.eacm.appenable"]+'</a>\
            </span>\
        {{/if}}\
        <span class="vmRowCell vmStatus textCollapse">{{html formatStatus(dbstatus)}}</span>\
        {{if dbstatus=="RUNNING"}}\
            <span class="vmRowCell vmCpus textCollapse"> ${maxcon}</span>\
            <span class="vmRowCell vmStatus textCollapse">\
                <a href="#" onclick="disabledb(this);return false;">'+Locale["eacm.template.eacm.dbdisable"]+'</a>\
            </span>\
        {{else}}\
            <span class="vmRowCell vmCpus textCollapse"></span>\
            <span class="vmRowCell vmStatus textCollapse">\
                <a href="#" onclick="enabledb(this);return false;">'+Locale["eacm.template.eacm.dbenable"]+'</a>\
            </span>\
        {{/if}}\
        <span class="vmRowCell vmStatus textCollapse">\
                    <a href="#" onclick="detail(this);return false;">'+Locale["eacm.template.eacm.detail"]+'</a>\
                    <a href="#" onclick="deleteEAC(this);return false;">'+Locale["eacm.template.eacm.delete"]+'</a>\
        </span>\
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
					'+Locale["eac.template.info.app"]+'\
				</p>\
			</td>\
		</tr>\
		<tr><td class="detailLeft">'+Locale["eac.template.info.appname"]+'</td><td name="appname"></td></tr>\
		<tr>\
			<td class="detailLeft">'+Locale["eac.template.info.appstatus"]+'</td>\
			<td><span name="appstatusicon" style="float:left; margin:0 0 0 0;"></span><span name="appstatusdisplay"></span></td>\
		</tr>\
		<tr><td class="detailLeft">'+Locale["eac.template.info.appaccess"]+'</td><td name="appaccess"></td></tr>\
		<tr>\
			<td class="detailLeft">'+Locale["eac.template.info.instance"]+'</td>\
			<td style="text-align:center;">\
				<table style="width:100%;">\
					<tr>\
						<td style="width:100px;text-align:left;">'+Locale["vm.template.info.now"]+': <span name="inst"></span></td>\
						<td><div class="slider" name="slider_inst"></div></td>\
						<td style="width:100px;text-align:left;">'+Locale["vm.template.info.max"]+': <span name="maxinst"></span></td>\
						<td style="width:60px;"><button onclick="applyInst(this)">'+Locale["vm.template.info.apply"]+'</button></td>\
					</tr>\
				</table>\
			</td>\
		</tr>\
		<tr>\
			<td colspan="2">\
				<p class="ui-state-default ui-corner-all" style="padding:4px;margin-top:4px;">\
					<span class="ui-icon ui-icon-power" style="float:left; margin:0 0 0 0;"></span>\
					'+Locale["eac.template.info.db"]+'\
				</p>\
			</td>\
		</tr>\
		<tr><td class="detailLeft">'+Locale["eac.template.info.dbname"]+'</td><td name="dbname"></td></tr>\
		<tr>\
			<td class="detailLeft">'+Locale["eac.template.info.dbstatus"]+'</td>\
			<td><span name="dbstatusicon" style="float:left; margin:0 0 0 0;"></span><span name="dbstatusdisplay"></span></td>\
		</tr>\
                <tr><td class="detailLeft">'+Locale["eac.template.info.dbaccess"]+'</td><td name="dbaccess"></td></tr>\
                <tr><td class="detailLeft">'+Locale["eac.template.info.dbaccessport"]+'</td><td name="dbaccessport"></td></tr>\
                <tr><td class="detailLeft">'+Locale["eac.template.info.privatedbaccess"]+'</td><td name="privatedbaccess"></td></tr>\
                <tr><td class="detailLeft">'+Locale["eac.template.info.privatedbaccessport"]+'</td><td name="privatedbaccessport"></td></tr>\
		<tr>\
			<td class="detailLeft">'+Locale["eac.template.info.label.passwd"]+'</td>\
			<td name="vmpasswd">\
				<a onclick="showPasswd(this);return false;" href="#" style="color:#ff6f10;">\
					<span class="ui-icon ui-icon-locked" style="float:left; margin:0 0 0 0;"></span>'+Locale["eac.template.info.link.geteacpasswd"]+'\
				</a>\
			</td>\
		</tr>\
		<tr>\
			<td class="detailLeft">'+Locale["eac.template.info.maxcon"]+'</td>\
			<td style="text-align:center;">\
				<table style="width:100%;">\
					<tr>\
						<td style="width:100px;text-align:left;">'+Locale["vm.template.info.now"]+': <span name="maxcon"></span></td>\
						<td><div class="slider" name="slider_con"></div></td>\
						<td style="width:100px;text-align:left;">'+Locale["vm.template.info.max"]+': <span name="maxallowcons"></span></td>\
						<td style="width:60px;"><button onclick="applyCon(this)">'+Locale["vm.template.info.apply"]+'</button></td>\
					</tr>\
				</table>\
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
					<span class="chartLabel">'+Locale["eac.chart.icon.response"]+'</span>\
				</span>\
				<span class="chartIcon" onclick="showChart(this, \'mem\');">\
					<span class="chartThumb chartThumbMEM"></span>\
					<span class="chartLabel">'+Locale["eac.chart.icon.sd"]+'</span>\
				</span>\
				<span class="chartIcon" onclick="showChart(this, \'net\');">\
					<span class="chartThumb chartThumbNET"></span>\
					<span class="chartLabel">'+Locale["eac.chart.icon.hits"]+'</span>\
				</span>\
				<span class="chartIcon" onclick="showChart(this, \'vol\');">\
					<span class="chartThumb chartThumbVOL"></span>\
					<span class="chartLabel">'+Locale["eac.chart.icon.filesize"]+'</span>\
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







