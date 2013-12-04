// JavaScript Document
// Author: Bill, 2011
var Message=new Object();


Message["column.header.name"]="文件名";
Message["column.header.size"]="大小";
Message["column.header.lastModified"]="修改时间";




Message["table.objects.bucketIsEmpty"]="Bucket '%s' 是空的";
Message["table.objects.folderIsEmpty"]="文件夹 '%s' 是空的";



Message["panel.leftPanelTitle"]="Buckets";
Message["panel.rightPanelTitle"]="对象与文件夹";


Message["dialog.processDialogTips"]="处理中...";

Message["dialog.createBucketTitle"]="创建 Bucket - 选择一个Bucket名";
Message["dialog.createBucketTips"]="一个Bucket是在ViaCloud S3中存储对象的容器。当创建一个Bucket，你可以选择一个区域，对延迟进行优化，最大限度地降低成本，或满足法规要求。对命名的更多信息，请访问ViaCloud S3文档。";

Message["dialog.uploadTitle"]="上传 - 选择文件";
Message["dialog.uploadTips"]="要上传文件到 （单个文件最大 5 TB） ViaCloud S3，请点击 <b>添加文件</b>，然后选择你需要的文件。要移除添加的文件，请点击文件名右侧的 <b>X</b>。当你选择完毕后，请点击 <b>开始上传</b>，你的文件将被添加到上传任务队列等待上传。";
Message["dialog.uploadTo"]="上传到: ";
Message["dialog.uploadClose"]="关闭";
Message["dialog.uploadCancel"]="取消";
Message["dialog.addFiles"]="添加文件";
Message["dialog.startUpload"]="开始上传";



Message["propAddPerm"]="添加更多权限";
Message["propRemovePerm"]="移除选择的权限";
Message["propCtrlPanelButtonSave"]="保存";
Message["propCtrlPanelButtonCancel"]="取消";


Message["loading"]="读取中...";


Message["uploadObjectButton"]="上传";
Message["createFolderButton"]="创建文件夹";
Message["objectActions"]="更多";
Message["refreshObjectButton"]="刷新";
Message["propertiesObjectButton"]="属性";
Message["transfersObjectButton"]="传输";
Message["helpButton"]="帮助";

Message["createBucketButton"]="创建 Bucket";
Message["bucketActions"]="更多";

Message["propBucket"]="Bucket:";
Message["propName"]="名称:";
Message["propSize"]="大小:";
Message["propLastModified"]="修改时间:";
Message["propETag"]="ETag:";


Message["tabDetails"]="细节";
Message["tabPermissions"]="权限";
Message["tabMetadata"]="元数据";


Message["linkLabel"]="链接:";


Message["bottomPanelTitleProperties"]="属性";
Message["bottomPanelTitleTransfers"]="传输";


Message["useRrs"]="使用 Reduced Redundancy Storage";

Message["helpText"]="使用支持HTML5的浏览器能为你带来更流畅的操作感受(如Chrome)";


Message["chooseBucketPutFolder"]="请选择一个 Bucket";
Message["chooseBucketPutObject"]="请选择一个 Bucket";
Message["deleteBucket"]="你确定要删除这个 Bucket 吗?";

Message["deleteItems"]="你确定要永久删除这些 %d 个项目 ?";


Message["bucketItemCreateBucket"]="创建 Bucket...";
Message["bucketItemDelete"]="删除";
Message["bucketItemRefresh"]="刷新";
Message["bucketItemPasteInto"]="粘贴";
Message["bucketItemProperties"]="属性";


Message["objectItemOpen"]="打开";
Message["objectItemCreateFolder"]="创建文件夹...";
Message["objectItemUpload"]="上传";
Message["objectItemDownload"]="下载";
Message["objectItemMakePublic"]="共享";
Message["objectItemRename"]="重命名";
Message["objectItemDelete"]="删除";
Message["objectItemCut"]="剪切";
Message["objectItemCopy"]="复制";
Message["objectItemPaste"]="粘贴";
Message["objectItemProperties"]="属性";


Message["uploadWarningNoFileSelected"]="点击 '添加文件' 按钮以上传更多的文件";
Message["uploadTotalCount"]="共 %d 个文件将上传";


Message["downloadTips"]="请右击下面的 '下载' 并选择 \"另存为...\"";
Message["downloadDialogLink"]="下载";
Message["downloadDialogControlOk"]="关闭";


Message["createBucketDialogClose"]="取消";
Message["createBucketBucketName"]="Bucket 名:";
Message["createBucketCancel"]="取消";
Message["createBucketCreate"]="创建";
Message["createBucketEmptyName"]="填入 Bucket 名";


Message["taskFileName"]="上传: %s";
Message["taskStatusPrepare"]="准备中";
Message["taskStatusDone"]="上传完毕";


Message["createFolderNoSlash"]="不能包含字符 '/' !";

Message["createBucketCreated"]="Bucket '%s' 已创建";
Message["createFolderCreated"]="文件夹 '%s' 已创建";
Message["deleteBucketDeleted"]="Bucket '%s' 已删除";
Message["deleteObjectDeleted"]="对象 '%s' 位于 '%s' 已删除";

Message["error.responseDataBroken"]="服务器响应数据已损坏";

Message["topRight.signOut"]="注销";


// --------------------- Login -----------------------
Message["login.about"]="<b>关于Viacloud S3登录</b><br/><br/>Viacloud Web Services将使用您的Viacloud S3帐户信息以识别您的身份以访问Viacloud Web Services。";
Message["login.affiliate"]="© 2011, Zhumulangma Inc. or its affiliates";
Message["login.learnMore"]="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;了解更多关于Viacloud S3的身份验证和<a target=\"_blank\" href=\"http://wikiws.viacloud.com.cn\">访问控制机制</label></a>以及<a target=\"_blank\" href=\"http://wikiws.viacloud.com.cn\">Viacloud S3的其它授权方式</a>，能为您的Viacloud S3 帐号提供额外的安全性。";Message["login.accountLabel"]="账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;户: ";
Message["login.passwordLabel"]="密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码: ";
Message["login.akLabel"]="Access Key: ";
Message["login.skLabel"]="Secret Key: ";
Message["login.traditionalLabel"]="账户/密码";
Message["login.sophisticatedLabel"]="Access Key/Secret Key";
Message["login.loginType"]="登录类型:";

Message["login.header_1"]="登录Viacloud S3账户";
Message["login.header_2"]="用已有的Viacloud S3账户登录。";
Message["login.brokenLogin"]="<b>很抱歉，您的请求出现了问题。</b><br/>您使用的 帐号/密码 或 AccessKey/SecretKey 组合出现了错误。请重新尝试。";


























