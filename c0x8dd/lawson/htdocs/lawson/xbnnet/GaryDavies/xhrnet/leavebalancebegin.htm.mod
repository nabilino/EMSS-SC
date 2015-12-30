<!--
// CLYNCH 10/04/2011 Redirect standard LP balance page (leavebalances.htm) to custom balance page (entamastrlp.htm)
-->
<head>
<head>
<title>Leave Balances</title>
<meta name="viewport" content="width=device-width" />
<META HTTP-EQUIV="Pragma" CONTENT="No-Cache">
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/xhrnet/waitalert.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"></script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script src="/lawson/webappjs/javascript/objects/ActivityDialog.js"></script>
<script src="/lawson/webappjs/javascript/objects/OpaqueCover.js"></script>
<script src="/lawson/webappjs/javascript/objects/Dialog.js"></script>
<script>
var loadTimer;
var authUser;

function CallBack()
{
	authenticate("frameNm='jsreturn'|funcNm='user=authUser;GetGlcodes()'|desiredEdit='EM'")
}

function GetGlcodes() {
    stylePage();
	showWaitAlert(getSeaPhrase("WAIT","ESS"));
  	//call to GLcodes
  	var obj = new DMEObject(authUser.prodline, "glcodes");
		obj.out 	= "JAVASCRIPT";
		obj.index 	= "gcdset4";
		obj.field 	= "system";
		obj.key 	= authUser.company+"=LP";
		obj.debug 	= false;
		obj.max		= "1";
		obj.func    = "checkForLP()";
  	DME(obj,"jsreturn")
}

function checkForLP() {
	if (self.jsreturn.record.length > 0) {
// CGL - Redirecting delivered LP balance display screen to custom page
//		self.location = "/lawson/xhrnet/leavebalance.htm" + window.location.search;
		self.location = "/lawson/xhrnet/emtamastrlp.htm" + window.location.search;
//~CGL
	}
	else {
		self.location = "/lawson/xhrnet/emtamastr.htm" + window.location.search;
	}
}

loadTimer = setTimeout("CallBack()",3000);
</script>
</head>
<body onload="clearTimeout(loadTimer);CallBack()">
	<iframe id="header" name="header" style="visibility:hidden;position:absolute;height:32px;width:803px;left:10px;top:0px" src="/lawson/xhrnet/ui/header.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="jsreturn" name="jsreturn" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/dot.htm" marginwidth="0" marginheight="0" scrolling="no"></iframe>
</body>
</html>
