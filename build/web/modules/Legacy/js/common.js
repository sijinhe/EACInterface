

var dcStr='';
$.post(Server+"/RedDragonEnterprise/InformationRetriverServlet", 
	{
		methodType: 'GETZONEINFOR'
	}, 
	function(data) {
		var obj=$.createXml(data);
		var tmp=$(obj).find('datacentres').find('datacentre').find('mydatacentre');
		
		var tmpStr='<select style="padding:0;margin:0;" id="dataCenter" disabled="true">';
		for(i=0; i<tmp.length; i++) {
			tmpStr+='<option id="dc_'+$(tmp[i]).attr('data')+'" value="'+$(tmp[i]).attr('data')+'" name="'+$(tmp[i]).attr('provider')+'">'+$(tmp[i]).attr('lable')+'</option>';
			
		}
		tmpStr+='</select>';
		
		dcStr+=tmpStr;
	}
);






var v_templateId='';
var v_softwareResourceId='';
var v_softwareId='';
var v_softwareName='';
var v_vmplanId='';
var v_vmplanName='';
var v_cpu='';
var v_maxCpu='';
var v_memory='';
var v_maxMemory='';
var v_needIP='';
var v_ipType='';
var v_needVolume='';
var v_volumeSize='';
var v_zone='';
var v_paymentAmount='';
var v_provider='';	

var v_ipPrice='';
var v_volumePrice='';

var g_ext1='';

var g_isTry=false;

function deleteTemplate(id) {	
	//parent.window.scrollTo(0,0);
	
	var m_array=$('#data_'+id).html().split('||');
	v_templateId=m_array[0];
	/*
	v_templateId=m_array[0];
	$('#delInfo').html('要删除此模板吗?');
	$('#deleteDialog').dialog('open');
	*/
	if(confirm(Locale["inst.dialog.confirm.remove.template"])) {
		$.post(Server+"/RedDragonEnterprise/orderManagement",
			{
				operation: 'deleteTemplate',
				templateId: v_templateId
			},
			function(data) {
				data='<root>'+data+'</root>';
				var tmp=$.createXml(data);
				
				switch($(tmp).find('root').find('result').text().toLowerCase()) {
					case 'true':
						alert(Locale["inst.page.message.delete.true"]);
						location.reload();
						break;
					case 'false':
						alert(Locale["inst.page.message.delete.false"]);
						break;
					default:
						alert(Locale["inst.page.message.undefined"].sprintf($(tmp).find('root').find('result').text()));										
				}
			}
		);
	}
}

function displayInfoInForm(id) {
	//alert($('#data_'+id).html());
	parent.window.scrollTo(0,140);
	
	var m_array=$('#data_'+id).html().split('||');	
	//alert(m_array.length);
	
	v_templateId=m_array[0];
	v_softwareResourceId=m_array[1];
	v_softwareId=m_array[2];
	v_softwareName=m_array[3];
	v_vmplanId=m_array[4];
	v_vmplanName=m_array[5];
	v_cpu=m_array[6];
	v_maxCpu=m_array[7];
	v_memory=m_array[8];
	v_maxMemory=m_array[9];
	v_needIP=m_array[10];
	v_ipType=m_array[11];
	v_needVolume=m_array[12];
	v_volumeSize=m_array[13];
	v_zone=m_array[14];
	v_paymentAmount=m_array[15];
	v_provider=m_array[16];	
	
	//v_ipPrice='30.00';
	//v_volumePrice='0.05';
	
	loadIpPrices(v_zone, v_provider, 'loadVolumePrices("'+v_zone+'","loadVmplan()")');

	//alert(v_vmplanId);
}

function loadVmplan() {
	$.post(
		Server+"/billingCN/BillingServlet",
		{
			RequestType: 'getVmplan',
			vmplanID: v_vmplanId
		},
		function(data) {
			var dataObj=$.createXml('<root>'+data+'</root>');
			$('#buyDialog').dialog('open');
			//alert(data);
			$('#buyInfos_0').empty();
			$('#buyInfos_1').empty();
			$('#buyInfos_2').empty();
			$('#buyInfos_3').empty();
			$('#buyInfos_4').empty();
			$('#buyInfos_5').empty();
			
			//createInfo('#buyInfos_0', 'TID', v_templateId);
			//createInfo('#buyInfos_0', 'TID', v_softwareResourceId);
			//createInfo('#buyInfos_0', 'TID', v_softwareId);
			
			//$('#buyInfos_0').append('<div style="padding:5px;font-size:14px;font-weight:bold;color:#808080;">镜像产品</div>');
			createTitle('#buyInfos_0', Locale["inst.page.info.software"]);
			createInfo('#buyInfos_0', Locale["inst.page.info.software.name"], v_softwareName);
			createInput('#buyInfos_0', 'instanceName', Locale["inst.page.info.host.name"], '');
			//createInfo('#buyInfos_0', '价格', v_paymentAmount);
			
			//createInfo('#buyInfos', '', v_vmplanId);
			
			//$('#buyInfos_1').append('<div style="padding:5px;font-size:14px;font-weight:bold;color:#808080;">硬件配置</div>');
			createTitle('#buyInfos_1', Locale["inst.page.info.hardware"]);
			createInfo('#buyInfos_1', Locale["inst.page.info.cpu"], v_cpu);
			createInfo('#buyInfos_1', Locale["inst.page.info.cpu.max"], v_maxCpu);
			createInfo('#buyInfos_1', Locale["inst.page.info.mem"], parseInt(v_memory)/1024+' MB');
			createInfo('#buyInfos_1', Locale["inst.page.info.mem.max"], parseInt(v_maxMemory)/1024+' MB');
			
			//$('#buyInfos_2').append('<div style="padding:5px;font-size:14px;font-weight:bold;color:#808080;">IP地址</div>');
			createTitle('#buyInfos_2', Locale["inst.page.info.network"]);
			if(v_needIP=='true') {
				createInfo('#buyInfos_2', Locale["inst.page.info.need.ip.type"], (v_ipType=='web'?Locale["inst.page.info.need.ip.type.web"]:Locale["inst.page.info.need.ip.type.personal"]));
				//createInfo('#buyInfos_2', 'IP价格', v_ipPrice+' 元 每个每月');
			}else {
				createInfo('#buyInfos_2', Locale["inst.page.info.network"], (g_isTry?Locale["inst.page.info.ip.bind.istry"]:Locale["inst.page.info.ip.bind"]));
				v_ipPrice='0';
			}
			
			//alert(v_volumeSize);
			//$('#buyInfos_3').append('<div style="padding:5px;font-size:14px;font-weight:bold;color:#808080;">扩展磁盘</div>');
			createTitle('#buyInfos_3', Locale["inst.page.info.volume"]);
			if(v_volumeSize!='0') {
				createInfo('#buyInfos_3', Locale["inst.page.info.volume.size"], v_volumeSize+' GB');
				createInput('#buyInfos_3', 'volumeName', Locale["inst.page.info.volume.name"], '');
				//createInfo('#buyInfos_3', '扩展磁盘价格', v_volumePrice+' 每GB每天');
			}else {
				createInfo('#buyInfos_3', Locale["inst.page.info.volume"], (g_isTry?Locale["inst.page.info.volume.none.istry"]:Locale["inst.page.info.volume.none"]));
				v_volumePrice='0';
			}
			
			//$('#buyInfos_4').append('<div style="padding:5px;font-size:14px;font-weight:bold;color:#808080;">付费套餐和数据中心</div>');
			createTitle('#buyInfos_4', Locale["inst.page.info.plan_and_datacenter"]);	
			createInfo('#buyInfos_4', Locale["inst.page.info.plan.name"], v_vmplanName);
			
			var ext_str='';
			if(v_vmplanId.indexOf('PFM')>-1) {//包月
				createInfo('#buyInfos_4', Locale["inst.page.info.monthly.fee"], Locale["inst.page.info.monthly.fee.format"].sprintf($(dataObj).find('SubscriptionFee').text()));
				v_paymentAmount=$(dataObj).find('SubscriptionFee').text();
        		//v_paymentAmount=selItem.SubscriptionFee;
			}else if(v_vmplanId.indexOf('TRY')>-1) {
				createInfo('#buyInfos_4', Locale["inst.page.info.monthly.fee"], Locale["inst.page.info.monthly.fee.format"].sprintf($(dataObj).find('SubscriptionFee').text()));
				v_paymentAmount=$(dataObj).find('SubscriptionFee').text();
				v_ipPrice='0'; //测试的设为0
				v_volumePrice='0'; //测试的设为0
			}else { // 即付即用		
				createInfo('#buyInfos_4', Locale["inst.page.info.cpu.price"], Locale["inst.page.info.cpu.price.format"].sprintf($(dataObj).find('CpuPrice').text()));
				createInfo('#buyInfos_4', Locale["inst.page.info.mem.price"], Locale["inst.page.info.mem.price.format"].sprintf($(dataObj).find('MemPrice').text()));
				createInfo('#buyInfos_4', Locale["inst.page.info.net.price"], Locale["inst.page.info.net.price.format"].sprintf($(dataObj).find('DownloadPrice').text()));
				//createInfo('#buyInfos_4', '上传价格每GB', $(dataObj).find('UploadPrice').text());
				//createInfo('#buyInfos_4', 'IO写价格每1000次', $(dataObj).find('ioWritePrice').text());
				//createInfo('#buyInfos_4', 'IO读价格每1000次', $(dataObj).find('ioReadPrice').text());
		        //v_paymentAmount='100';
       			ext_str='';//（首次充值额度：50元）
				v_paymentAmount=LOWEST_PAYMENT;
			}
			createSelect('#buyInfos_4', 'dataCenter', Locale["inst.page.info.datacenter"], v_zone);
			
			
			createTitle('#buyInfos_5', Locale["inst.page.info.summary"]);				
			createInfo('#buyInfos_5', Locale["inst.page.info.summary.vm"], (g_isTry?Locale["inst.page.info.summary.vm.format.istry"].sprintf(parseFloat(v_paymentAmount).toFixed(2)):Locale["inst.page.info.summary.vm.format"].sprintf(parseFloat(v_paymentAmount).toFixed(2))));
			createInfo('#buyInfos_5', Locale["inst.page.info.summary.volume"]+(v_needVolume=='0'?'':'（'+v_volumeSize+' GB）'), 
					v_needVolume=='0'?Locale["inst.page.info.summary.volume.none"]:Locale["inst.page.info.summary.volume.format"].sprintf((parseFloat(v_needVolume!='0'?v_volumePrice:'0')*parseFloat(v_volumeSize)).toFixed(2)));			
			createInfo('#buyInfos_5', Locale["inst.page.info.summary.network"], v_needIP=='false'?Locale["inst.page.info.summary.network.none"]:(g_isTry?Locale["inst.page.info.summary.network.format.istry"].sprintf(parseFloat(v_needIP=='true'?v_ipPrice:'0').toFixed(2)):Locale["inst.page.info.summary.network.format.istry"].sprintf(parseFloat(v_needIP=='true'?v_ipPrice:'0').toFixed(2))));
			createSelectAmount('#buyInfos_5', 'orderamount', Locale["inst.page.info.order.amount"]);
			
			$('#orderamount').bind('change', function() {
        		$('#totalField').html(((parseFloat(v_paymentAmount)
					+parseFloat(v_needVolume!='0'?v_volumePrice:'0')*parseFloat(v_volumeSize)
					+parseFloat(v_needIP=='true'?v_ipPrice:'0'))*parseFloat($('#orderamount').val())).toFixed(2)+' '+Locale["inst.page.info.summary.currency.unit"]+ext_str);
			});
			
			createInfo('#buyInfos_5', '此次金额总计', ((parseFloat(v_paymentAmount)
					+parseFloat(v_needVolume!='0'?v_volumePrice:'0')*parseFloat(v_volumeSize)
					+parseFloat(v_needIP=='true'?v_ipPrice:'0'))*parseFloat($('#orderamount').val())).toFixed(2)+' '+Locale["inst.page.info.summary.currency.unit"]+ext_str, 'totalField');
		
		}
	);
}

// load ip价格
function loadIpPrices(where, prov, chain) {	
	$.post(Server+"/billingCN/BillingServlet", 
		{
			RequestType: 'getResourcePricesByZone',
			resourceType: 'IP',
			zone:where
		}, 
		function(data) {
			var obj=$.createXml('<data>'+data+"</data>");
			var tmp=$(obj).find('resource');
			
			v_ipPrice=$(tmp).attr('price');
			if(prov.toLowerCase()=='both') {
        v_ipPrice=parseFloat(v_ipPrice)*2;
			}
			v_ipPrice=parseFloat(v_ipPrice).toFixed(2);
			
			eval(chain);
		}
	);
}

// load 磁盘价格
function loadVolumePrices(where, chain) {
	$.post(Server+"/billingCN/BillingServlet", 
		{
			RequestType: 'getResourcePricesByZone',
			resourceType: 'volume',
			zone:where
		}, 
		function(data) {
			var obj=$.createXml('<data>'+data+"</data>");
			var tmp=$(obj).find('resource');
			
			v_volumePrice=$(tmp).attr('price');
			
			eval(chain);
		}
	);
}



function createTitle(where, name) {
	$(where).append('<div style="border:1px solid silver;background:url(image/images/menu_downarrow.png) 10px center no-repeat #f0f0f0;padding:5px 5px 5px 25px;font-size:12px;font-weight:bold;color:#808080;">'+name+'</div>');
}
function createInfo(where, name, val, id) {
	$(where).append('<div style="height:28px;font-size:12px;border-bottom:1px silver dotted;white-space:nowrap;background:none;"><span style="display:inline-block;width:160px;text-align:right;margin-top:10px;">'+name+'&nbsp;:&nbsp;&nbsp;</span><span style="color:#4a4aa0;text-align:left;display:inline-block;" '+(id!=null?'id="'+id+'"':"")+' >'+val+'</span></div>');
}
function createInput(where, id, name, defval) {
	$(where).append('<div style="height:28px;font-size:12px;border-bottom:1px silver dotted;white-space:nowrap;background:none;"><span style="display:inline-block;width:160px;text-align:right;margin-top:10px;">'+name+'&nbsp;:&nbsp;&nbsp;</span><span style="color:#4a4aa0;text-align:left;display:inline-block;"><input type="text" id="'+id+'" style="width:200px;" value="'+defval+'"></input></span></div>');
}
function createSelect(where, id, name, defval) {
	$(where).append('<div style="height:28px;font-size:12px;border-bottom:1px silver dotted;white-space:nowrap;background:none;"><span style="display:inline-block;width:160px;text-align:right;padding-bottom:2px;">'+name+'&nbsp;:&nbsp;&nbsp;</span><span style="color:#4a4aa0;text-align:left;display:inline-block;padding-top:2px;">'+dcStr+'</span></div>');
	$('#dc_'+defval).attr('selected', true);
}
function createSelectAmount(where, id, name) {
	$(where).append('<div style="height:28px;line-height:28px;font-size:12px;border-bottom:1px silver dotted;white-space:nowrap;background:none;"><span style="display:table-cell;width:160px;text-align:right;">'+name+'&nbsp;:&nbsp;&nbsp;</span><span style="color:#4a4aa0;text-align:left;display:table-cell;">'+
	'<select style="padding:0;margin:0;" id="'+id+'"><option value="1" selected>1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option>'+
	'</select></span></div>');
}

function makeInfoIcon(container, id, orient, data, btnText, showPayment, btnText2, isTry) {
	g_isTry=isTry;
	
	var imgPath='';
	
	var v_templateId=$(data).find('templateId').text();
	var v_softwareResourceId=$(data).find('softwareResourceId').text();
	var v_softwareId=$(data).find('softwareId').text();
	var v_softwareName=$(data).find('softwareName').text();
	var v_vmplanId=$(data).find('vmplanId').text();
	var v_vmplanName=$(data).find('vmplanName').text();
	var v_cpu=$(data).find('cpu').text();
	var v_maxCpu=$(data).find('maxCpu').text();
	var v_memory=$(data).find('memory').text();
	var v_maxMemory=$(data).find('maxMemory').text();
	var v_needIP=$(data).find('needIP').text();
	var v_ipType=$(data).find('ipType').text();
	var v_needVolume=$(data).find('needVolume').text();  
	var v_volumeSize=$(data).find('volumeSize').text();
	var v_zone=$(data).find('zone').text();
	var v_paymentAmount=$(data).find('paymentAmount').text();
	var v_provider=$(data).find('provider').text();

	if(v_softwareName.toLowerCase().indexOf('windows')>-1){
		imgPath='image/images/computer/Windows.png';
	}else if(v_softwareName.toLowerCase().indexOf('centos')>-1){
		imgPath='image/images/computer/CentOS.png';
	}else if(v_softwareName.toLowerCase().indexOf('ubuntu')>-1
			|| v_softwareName.toLowerCase().indexOf('unbutu')>-1 /*这个是一个小错误*/){
		imgPath='image/images/computer/ubuntu.png';
	}else if(v_softwareName.toLowerCase().indexOf('debian')>-1){
		imgPath='image/images/computer/Debian.png';
	}else{
		imgPath='image/images/computer/025.png';		
	}
	
	var exstr=showPayment?'<br/>价格：'+v_paymentAmount+'元':'';
	
	var common_str='<span style="cursor:default;width:300px;height:180px;vertical-align:top;display:inline-block;margin:00px 10px 10px 0; border: 1px #c6c6c6 solid;">'+
	'<div style=" float:left; display:inline; padding:10px;">'+
	'<div title="" id="@id" class="ic_container" style="margin:15px 0 0 0;"><img src="@imgPath" width="96" height="96" alt=""/>'+
	'<div class="overlay" style="display:none;"></div><div class="ic_caption" style="display:none;">'+
	'<h3></h3><p class="ic_category"></p><p class="ic_text"></p></div>'+
	<!--'<div name="briefInfo" style="margin:5px 0px 5px 0px;border:1px silver dotted;overflow:hidden;text-overflow:ellipsis;"></div>'+-->
	'<div style="margin-top:10px; text-align:center;" ><a href="" onclick="displayInfoInForm(\'@id\');return false; " class="btnBuy">@btn1</a>&nbsp;'+
	'<a href="" onclick="deleteTemplate(\'@id\');return false;" class="btnDel">@btn2</a></div>'+
	'</div></div>'+
	'<div style=" float:left; display:inline; line-height:20px; font-size:12px;color:#666;margin:10px;width:160px;overflow:hidden;">'+
	'<span style="font-weight:bold; margin-bottom:10px;color:black;font-size:14px;font-family:Arial, Helvetica, sans-serif;white-space:nowrap;" title="'+v_softwareName+'">'+v_softwareName+'</span>'+
	'<br/>'+Locale["inst.page.thumbnail.plan"]+v_vmplanName+
	(g_isTry?'<br/><span style="color:red">'+Locale["inst.page.thumbnail.istry"]+'</span>':'')+
	exstr+
	'<br/>'+Locale["inst.page.thumbnail.cpu"]+v_cpu+
	'<br/>'+Locale["inst.page.thumbnail.maxcpu"]+v_maxCpu+
	'<br/>'+Locale["inst.page.thumbnail.mem"]+(parseInt(v_memory)/1024)+' MB'+
	'<br/>'+Locale["inst.page.thumbnail.maxmem"]+(parseInt(v_maxMemory)/1024)+' MB'+
	(v_needIP=='true'?'<br/>'+Locale["inst.page.thumbnail.iptype"]+(v_ipType=='personal'?Locale["inst.page.thumbnail.iptype.personal"]:Locale["inst.page.thumbnail.iptype.web"]):'<br/>'+Locale["inst.page.thumbnail.iptype.none"])+
	(v_volumeSize=='0'?'<br/>'+Locale["inst.page.thumbnail.volume.none"]:'<br/>'+Locale["inst.page.thumbnail.volume.size"].sprintf(v_volumeSize))+
	'</div>'+
	'</span>';
	
	$(container).append(common_str
			.replace(/@imgPath/g, imgPath).replace(/@id/g, id)
			.replace(/@btn1/g, btnText).replace(/@btn2/g, btnText2));//+v_paymentAmount
	/*
	$('#'+id+' [name=briefTitle]').html(v_softwareName+'');
	
	$('#'+id+' [name=briefInfo]').html((parseInt(v_memory)/1024)+' MB内存，'+(v_volumeSize!='0'?v_volumeSize+' G扩展磁盘，':'')+v_cpu+' CPU');
	*/
	$('#'+id+' [name=briefInfo]').html(v_softwareName+'');

	

	var tipstr='<div id="data_'+id+'" style="display:none;">'+v_templateId+'||'+v_softwareResourceId+'||'+
		v_softwareId+'||'+v_softwareName+'||'+v_vmplanId+'||'+v_vmplanName+'||'+v_cpu+'||'+v_maxCpu+'||'+
		v_memory+'||'+v_maxMemory+'||'+v_needIP+'||'+v_ipType+'||'+v_needVolume+'||'+v_volumeSize+'||'+
		v_zone+'||'+v_paymentAmount+'||'+v_provider+'</div>';
	/*	
	$("#"+id).capslide({
		caption_color	: 'white',
		caption_bgcolor	: 'black',
		overlay_bgcolor : 'none',
		border			: '1px solid #000000',
		showcaption	    : true
	});
	*/
	$('#'+id).attr('title', tipstr);
	
	$('#'+id).poshytip({
		showOn: 'hover',
			allowTipHover: false,
			
			alignTo: 'target', 
			alignX: orient, 
			alignY: 'center', 
			showTimeout: 0,
			fade: false,
			slide: false, //true
			slideOffset: 5,
			offsetX: 10
	});
	
}

