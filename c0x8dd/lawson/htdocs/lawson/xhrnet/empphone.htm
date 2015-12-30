<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width" />
<meta http-equiv="Pragma" content="No-Cache">
<title>Work Contacts</title>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<script src="/lawson/webappjs/common.js"></script>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/webappjs/transaction.js"></script>
<script src="/lawson/xhrnet/waitalert.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/xhrnet/empinfo.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"></script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script src="/lawson/webappjs/javascript/objects/ActivityDialog.js"></script>
<script src="/lawson/webappjs/javascript/objects/OpaqueCover.js"></script>
<script src="/lawson/webappjs/javascript/objects/Dialog.js"></script>
<script>
var updatetype = "";
var EmpInfo = new Object();
var appObj;

function OpenWorkPhone()
{
	clearTimeout(timer);
	authenticate("frameNm='jsreturn'|funcNm='StartApp()'|desiredEdit='EM'");
}

function StartApp()
{
	stylePage();
	var title = getSeaPhrase("WORK_CONTACTS","SEA");
	setWinTitle(title);
	setTaskHeader("header",title,"Employment");
	showWaitAlert(getSeaPhrase("WAIT","ESS"), GetEmployee);
}

function GetEmployee()
{
	if (!appObj)
		appObj = new AppVersionObject(authUser.prodline, "HR");
    // if you call getAppVersion() right away and the IOS object isn't set up yet,
	// then the code will be trying to load the sso.js file, and your call for
	// the appversion will complete before the ios version is set
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
		setTimeout(function(){GetEmployee();}, 10);
		return;
	}
	var fields = "wk-phone-ext;wk-phone-nbr;wk-phone-cntry;employee.email-address";
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "10.00.00")
		fields += ";employee.email-personal";
	StoreDateRoutines();
	GetEmpInfo(authUser.prodline,authUser.company,authUser.employee,"paemployee",fields,"DrawEmpPhoneScreen()");
}

function DrawEmpPhoneScreen()
{
	var EmpPhoneContent = '<form name="workphoneform">'
	+ '<table border="0" cellspacing="0" cellpadding="0" style="width:100%" role="presentation">'
	+ '<tr><td class="plaintablerowheader" style="width:40%"><label for="wkphonenbr">'+getSeaPhrase("JOB_PROFILE_11","ESS")+'</label></td>'
	+ '<td class="plaintablecell" style="width:60%" nowrap><input class="inputbox" type="text" id="wkphonenbr" name="wkphonenbr" value="'
	+ EmpInfo.wk_phone_nbr+'" maxlength="15" size="15" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="plaintablerowheader" style="width:40%"><label for="wkphoneext">'+getSeaPhrase("WORK_PHONE_EXTENSION","ESS")+'</label></td>'
	+ '<td class="plaintablecell" style="width:60%" nowrap><input class="inputbox" type="text" id="wkphoneext" name="wkphoneext" value="'
	+ EmpInfo.wk_phone_ext+'" maxlength="5" size="5" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="plaintablerowheader" style="width:40%"><label id="wkctrycd" for="wkphonecntry" title="'+getSeaPhrase("COUNTRY_CODE_HELP_TEXT","ESS")+'">'+getSeaPhrase("WORK_PHONE_CNTRY_CODE_ONLY","ESS")+'<span class="offscreen">&nbsp;'+getSeaPhrase("COUNTRY_CODE_HELP_TEXT","ESS")+'</span></label></td>'
	+ '<td class="plaintablecell"><input class="inputbox" type="text" id="wkphonecntry" name="wkphonecntry" size="3" maxlength="3" onfocus="this.select()" value="'+EmpInfo.wk_phone_cntry+'"></td></tr>'
	+ '<tr><td class="plaintablerowheaderborderbottom" style="width:40%"><label for="emailaddress">'+getSeaPhrase("JOB_PROFILE_12","ESS")+'</label></td>'
	+ '<td class="plaintablecell" style="width:60%" nowrap><input class="inputbox" type="text" id="emailaddress" name="emailaddress" value="'+EmpInfo.employee_email_address+'" maxlength="60" size="30" onfocus="this.select()"></td></tr>'
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "10.00.00")
	{
		EmpPhoneContent += '<tr><td class="plaintablerowheaderborderbottom" style="width:40%"><label for="emailpersonal">'+getSeaPhrase("PERSONAL_EMAIL","SEA")+'</label></td>'
		+ '<td class="plaintablecell" style="width:60%" nowrap><input class="inputbox" type="text" id="emailpersonal" name="emailpersonal" value="'
		+ EmpInfo.employee_email_personal+'" maxlength="60" size="30" onfocus="this.select()"></td></tr>'
	}
	EmpPhoneContent += '<tr><td>&nbsp;</td><td class="plaintablecell">'
	+ uiButton(getSeaPhrase("UPDATE","ESS"),"parent.ProcessExtension();return false","margin-top:10px")
	+ uiButton(getSeaPhrase("CANCEL","ESS"),"parent.CancelWorkPhone();return false","margin-top:10px;margin-left:5px")
	+ '</td></tr></table></form>'
	try
	{
		self.MAIN.document.getElementById("paneHeader").innerHTML = getSeaPhrase("CONTACT_DETAILS","SEA");
		self.MAIN.document.getElementById("paneBody").innerHTML = EmpPhoneContent;
		self.MAIN.stylePage();
		self.MAIN.setLayerSizes();
		fitToScreen();
		document.getElementById("MAIN").style.visibility = "visible";
	}
	catch(e) {}
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.MAIN.getWinTitle()]));
}

function CancelWorkPhone()
{
	var nextFunc = function()
	{
		self.MAIN.location = "/lawson/xhrnet/ui/logo.htm";
		removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.MAIN.getWinTitle()]));
	};
	showWaitAlert(getSeaPhrase("WAIT","ESS"), nextFunc);
}

function ProcessExtension()
{
	var formObj = self.MAIN.document.workphoneform;
	for (var i=0; i<formObj.elements.length; i++)
	{
		if (formObj.elements[i].value == "")
			formObj.elements[i].value = " ";
	}
	clearRequiredField(formObj.wkphonenbr);
	clearRequiredField(formObj.wkphonecntry);
	if (NonSpace(formObj.wkphonenbr.value) > 0 && !ValidPhoneEntry(formObj.wkphonenbr))
	{
		setRequiredField(formObj.wkphonenbr, getSeaPhrase("PHONE_NBR_ERROR","ESS"));
		return;
	}
	if (NonSpace(formObj.wkphonecntry.value) > 0 && !ValidPhoneEntry(formObj.wkphonecntry))
	{
		setRequiredField(formObj.wkphonecntry, getSeaPhrase("PHONE_COUNTRY_CODE_ERROR","ESS"));
		return;
	}
	var agsObj = new AGSObject(authUser.prodline, "HR11.1");
	agsObj.event = "CHANGE";
	agsObj.rtn = "MESSAGE";
	agsObj.longNames = "ALL";
	agsObj.tds = false;
	agsObj.field = "FC=C"
	+ "&EFFECT-DATE=" + ymdtoday
	+ "&EMP-COMPANY=" + parseInt(authUser.company,10)
	+ "&EMP-EMPLOYEE=" + parseInt(authUser.employee,10)
	+ "&PEM-WK-PHONE-NBR=" + escape(formObj.wkphonenbr.value,1)
	+ "&PEM-WK-PHONE-EXT=" + escape(formObj.wkphoneext.value,1)
	+ "&PEM-WK-PHONE-CNTRY=" + escape(formObj.wkphonecntry.value,1)
	+ "&EMP-EMAIL-ADDRESS=" + escape(formObj.emailaddress.value,1)
	+ "&XMIT-HREMP-BLOCK=1000000000"
	+ "&XMIT-REQDED=1"
	+ "&PT-BYPASS-PERS-ACT=1"
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "10.00.00")
		agsObj.field += "&EMP-EMAIL-PERSONAL=" + escape(formObj.emailpersonal.value,1)
	agsObj.func = "parent.DisplayMessage()";
	agsObj.debug = false;
	updatetype = "EMPP";
	showWaitAlert(getSeaPhrase("HOME_ADDR_42","ESS"), function(){AGS(agsObj,"jsreturn");});
}

function DisplayMessage()
{
	removeWaitAlert();
	var msg = self.lawheader.gmsg;
	var msgnbr = parseInt(self.lawheader.gmsgnbr,10);
	var formObj = self.MAIN.document.workphoneform;
	clearRequiredField(formObj.wkphonenbr);
	if (msgnbr != 0)
	{
		if (msgnbr == 50 || msgnbr == 141)
			msg = getSeaPhrase("REQUIRE_ADDITIONAL_INFO_CONTACT_HR","ESS");
		setRequiredField(formObj.wkphonenbr, msg);
	}
	else
		seaPageMessage(getSeaPhrase("CHANGE_COMPLETE_NO_CONTINUE","ESS"), null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
}

function fitToScreen()
{
	if (typeof(window["styler"]) == "undefined" || window.styler == null)
		window.stylerWnd = findStyler(true);
	if (!window.stylerWnd)
		return;
	if (typeof(window.stylerWnd["StylerEMSS"]) == "function")
		window.styler = new window.stylerWnd.StylerEMSS();
	else
		window.styler = window.stylerWnd.styler;
	var mainFrame = document.getElementById("MAIN");
	var winObj = getWinSize();
	var winWidth = winObj[0];	
	var winHeight = winObj[1];
	var contentHeightBorder;
	var contentHeight;	
	var contentWidthBorder;
	var contentWidth;
	if (window.styler && window.styler.showInfor)
	{	
		contentWidth = winWidth - 10;
		contentWidthBorder = (navigator.appName.indexOf("Microsoft") >= 0) ? contentWidth + 5 : contentWidth + 2;				
		contentHeight = winHeight - 65;
		contentHeightBorder = contentHeight + 30;	
	}
	else if (window.styler && (window.styler.showLDS || window.styler.showInfor3))
	{
		contentWidth = winWidth - 20;
		contentWidthBorder = (window.styler.showInfor3) ? contentWidth + 7 : contentWidth + 17;		
		contentHeight = winHeight - 75;	
		contentHeightBorder = contentHeight + 30;		
	}
	else
	{
		contentWidth = winWidth - 10;
		contentWidthBorder = contentWidth;		
		contentHeight = winHeight - 60;
		contentHeightBorder = contentHeight + 24;		
	}
	mainFrame.style.width = winWidth + "px";
	mainFrame.style.height = winHeight + "px";
	try
	{
		if (self.MAIN.onresize && self.MAIN.onresize.toString().indexOf("setLayerSizes") >= 0)
			self.MAIN.onresize = null;		
	}
	catch(e) {}
	try
	{
		self.MAIN.document.getElementById("paneBorder").style.width = contentWidthBorder + "px";
		self.MAIN.document.getElementById("paneBodyBorder").style.width = contentWidth + "px";
		self.MAIN.document.getElementById("paneBorder").style.height = contentHeightBorder + "px";
		self.MAIN.document.getElementById("paneBodyBorder").style.height = contentHeight + "px";
		self.MAIN.document.getElementById("paneBody").style.width = contentWidth + "px";
		self.MAIN.document.getElementById("paneBody").style.height = contentHeight + "px";
	}
	catch(e) {}	
}
var timer = setTimeout("OpenWorkPhone()",3000);
</script>
</head>
<body style="overflow:hidden" onload="OpenWorkPhone()" onresize="fitToScreen()">
	<iframe id="header" name="header" title="Header" level="1" tabindex="0" style="visibility:hidden;position:absolute;height:32px;width:803px;left:0px;top:0px" src="/lawson/xhrnet/ui/header.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="MAIN" name="MAIN" title="Main Content" level="2" tabindex="0" src="/lawson/xhrnet/ui/headerpane.htm" style="visibility:hidden;position:absolute;height:464px;left:0px;top:32px;width:400px" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="jsreturn" name="jsreturn" title="Empty" src="/lawson/xhrnet/dot.htm" style="visibility:hidden;height:0px;width:0px;" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="lawheader" name="lawheader" title="Empty" src="/lawson/xhrnet/errmsg.htm" style="visibility:hidden;height:0px;width:0px;" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@10.00.05.00.12 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/empphone.htm,v 1.14.2.49 2014/02/17 16:30:21 brentd Exp $ -->
<!--************************************************************
 *                                                             *
 *                           NOTICE                            *
 *                                                             *
 *   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
 *   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
 *   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
 *   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
 *   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
 *   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
 *   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
 *                                                             *
 *   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
 *   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
 *   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
 *   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
 *   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
 *   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
 *                                                             *
 ************************************************************-->
