<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width" />
<meta http-equiv="Pragma" content="No-Cache">
<title>Personal Profile</title>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<script src="/lawson/webappjs/common.js"></script>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/xhrnet/empinfo.js"></script>
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
var appObj;

function GetWebuser()
{
	clearTimeout(timer);
	authenticate("frameNm='jsreturn'|funcNm='StartApp()'|desiredEdit='EM'");
}

function StartApp()
{
	stylePage();
	var title = getSeaPhrase("PERSONAL_PROFILE","ESS");
	setWinTitle(title);
	setTaskHeader("header",title,"Personal");
	showWaitAlert(getSeaPhrase("WAIT","ESS"), GetEmpPersonal);
}

function GetEmpPersonal()
{
	if (!appObj)
		appObj = new AppVersionObject(authUser.prodline, "HR");
	// if you call getAppVersion() right away and the IOS object isn't set up yet,
	// then the code will be trying to load the sso.js file, and your call for
	// the appversion will complete before the ios version is set
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
       	setTimeout("GetEmpPersonal()", 10);
       	return;
	}
	var fields = "employee.label-name-1;employee.nick-name;employee.fica-nbr;"
	+ "former-lst-nm;former-fst-nm;former-mi;maiden-lst-nm;maiden-fst-nm;"
	+ "maiden-mi;sex,xlt;birthdate;true-mar-stat,xlt;ethnicity.description;"
	+ "visible-min;aboriginal;disability.description;employee.work-country"
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "08.01.01")
		fields += ";veteran.description";
	else
		fields += ";veteran,xlt";
	GetEmpInfo(authUser.prodline,authUser.company,authUser.employee,"paemployee",fields,"EmployeePersonal()");
}

function maskSocialNbr(socialNbr)
{
	return socialNbr.substring(socialNbr.length-4,socialNbr.length);
}

function EmployeePersonal()
{
	if (typeof(EmpInfo.employee_label_name_1) == "undefined")
	{
		removeWaitAlert();
		seaAlert(getSeaPhrase("EMPLOYEE_RECORD_NOT_FOUND","ESS"), null, null, "error");
		fitToScreen();
		return;
	}
	var PersonalContent = '<table class="plaintableborder" cellspacing="0" cellpadding="0" width="100%" summary="'+getSeaPhrase("PERSONAL_PROFILE_SUMMARY","ESS")+'">'
	PersonalContent += '<caption class="offscreen">'+getSeaPhrase("PERSONAL_PROFILE","ESS")+'</caption>'
	PersonalContent += '<tr><th scope="col" colspan="2"></th></tr>'
	PersonalContent += '<tr><th scope="row" class="plaintablerowheaderbordertall" style="width:45%">'+getSeaPhrase("EMPLOYEE_NAME","ESS")
	+ '</th><td class="plaintablecellbordertalldisplay" style="width:50%" nowrap>'
	+ ((NonSpace(EmpInfo.employee_label_name_1)>0)?EmpInfo.employee_label_name_1:'&nbsp;')
	+ '</td></tr>'
	PersonalContent += '<tr><th scope="row" class="plaintablerowheaderbordertall" style="width:45%">'+getSeaPhrase("PREFERRED_NAME","ESS")
	+ '</th><td class="plaintablecellbordertalldisplay" style="width:50%" nowrap>'
	+ ((NonSpace(EmpInfo.employee_nick_name)>0)?EmpInfo.employee_nick_name:'&nbsp;')
	+ '</td></tr>'
	PersonalContent += '<tr><th scope="row" class="plaintablerowheaderbordertall" style="width:45%">'+getSeaPhrase("HOME_ADDR_16","ESS")
	+ '</th><td class="plaintablecellbordertalldisplay" style="width:50%" nowrap>'
	+((NonSpace(EmpInfo.employee_fica_nbr)>0)?maskSocialNbr(EmpInfo.employee_fica_nbr):'&nbsp;')
	+ '</td></tr>'
	PersonalContent += '<tr><th scope="row" class="plaintablerowheaderbordertall" style="width:45%">'+getSeaPhrase("DEP_40","ESS")
	+ '</th><td class="plaintablecellbordertalldisplay" style="width:50%" nowrap>'
	+ ((NonSpace(EmpInfo.birthdate)>0)?EmpInfo.birthdate:'&nbsp;')
	+ '</td></tr>'
	PersonalContent += '<tr><th scope="row" class="plaintablerowheaderbordertall" style="width:45%">'+getSeaPhrase("DEP_27","ESS")
	+ '</th><td class="plaintablecellbordertalldisplay" style="width:50%" nowrap>'
	+ ((NonSpace(EmpInfo.sex_xlt)>0)?EmpInfo.sex_xlt:'&nbsp;')
	+ '</td></tr>'
	PersonalContent += '<tr><th scope="row" class="plaintablerowheaderbordertall" style="width:45%">'+getSeaPhrase("ETHNICITY","ESS")
	+ '</th><td class="plaintablecellbordertalldisplay" style="width:50%" nowrap>'
	+ ((NonSpace(EmpInfo.ethnicity_description)>0)?EmpInfo.ethnicity_description:'&nbsp;')
	+ '</td></tr>'
	if (EmpInfo.employee_work_country == "CA")
	{
		PersonalContent += '<tr><th scope="row" class="plaintablerowheaderbordertall" style="width:45%">'+getSeaPhrase("VISIBLE_MINORITY","ESS")
		+ '</th><td class="plaintablecellbordertalldisplay" style="width:50%" nowrap>'
		if (EmpInfo.visible_min == "Y") PersonalContent += getSeaPhrase("YES","ESS")
		else if (EmpInfo.visible_min == "N") PersonalContent += getSeaPhrase("NO","ESS")
		else PersonalContent += '&nbsp;'
		PersonalContent += '</td></tr>'
		PersonalContent += '<tr><th scope="row" class="plaintablerowheaderbordertall" style="width:45%">'+getSeaPhrase("ABORIGINAL","ESS")
		+ '</th><td class="plaintablecellbordertalldisplay" style="width:50%" nowrap>'
		if (EmpInfo.aboriginal == "Y") PersonalContent += getSeaPhrase("YES","ESS")
		else if (EmpInfo.aboriginal == "N") PersonalContent += getSeaPhrase("NO","ESS")
		else PersonalContent += '&nbsp;'
		PersonalContent += '</td></tr>'
	}
        //GDD  09/11/14   Remove Disability and Marital Status fields 
	/* PersonalContent += '<tr><th scope="row" class="plaintablerowheaderbordertall" style="width:45%">'+getSeaPhrase("DISABILITY","ESS")
	+ '</th><td class="plaintablecellbordertalldisplay" style="width:50%" nowrap>'
	+ ((NonSpace(EmpInfo.disability_description)>0)?EmpInfo.disability_description:'&nbsp;')
	+ '</td></tr>'
	PersonalContent += '<tr><th scope="row" class="plaintablerowheaderbordertall" style="width:45%">'+getSeaPhrase("MARITAL_STATUS","ESS")
	+ '</th><td class="plaintablecellbordertalldisplay" style="width:50%" nowrap>'
	+ ((NonSpace(EmpInfo.true_mar_stat_xlt)>0)?EmpInfo.true_mar_stat_xlt:'&nbsp;')
	+ '</td></tr>' */
	//GDD End of change
	PersonalContent += '<tr><th scope="row" class="plaintablerowheaderbordertall" style="width:45%">'+getSeaPhrase("VETERAN_STATUS","ESS")
	+ '</th><td class="plaintablecellbordertalldisplay" style="width:50%" nowrap>'
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "08.01.01")
		PersonalContent += ((NonSpace(EmpInfo.veteran_description)>0)?EmpInfo.veteran_description:'&nbsp;')
	else
		PersonalContent += ((NonSpace(EmpInfo.veteran_xlt)>0)?EmpInfo.veteran_xlt:'&nbsp;')
	PersonalContent += '</td></tr>'
	PersonalContent += '<tr><th scope="row" class="plaintablerowheaderbordertall" style="width:45%">'+getSeaPhrase("FORMER_NAME","ESS")
	+ '</th><td class="plaintablecellbordertalldisplay" style="width:50%" nowrap>'
	+ ((NonSpace(EmpInfo.former_fst_nm+' '+EmpInfo.former_mi+' '+EmpInfo.former_lst_nm)>0)?EmpInfo.former_fst_nm+' '+EmpInfo.former_mi+' '+EmpInfo.former_lst_nm:'&nbsp;')
	+ '</td></tr>'
	PersonalContent += '<tr><th scope="row" class="plaintablerowheaderbordertall" style="width:45%">'+getSeaPhrase("MAIDEN_NAME","ESS")
	+ '</th><td class="plaintablecellbordertalldisplay" style="width:50%" nowrap>'
	+ ((NonSpace(EmpInfo.maiden_fst_nm+' '+EmpInfo.maiden_mi+' '+EmpInfo.maiden_lst_nm)>0)?EmpInfo.maiden_fst_nm+' '+EmpInfo.maiden_mi+' '+EmpInfo.maiden_lst_nm:'&nbsp;')
	+ '</td></tr></table>'
	try 
	{
		self.MAIN.document.getElementById("paneHeader").innerHTML = getSeaPhrase("PERSONAL_INFO","ESS");
		self.MAIN.document.getElementById("paneBody").innerHTML = PersonalContent;
	}
	catch(e) {}
	self.MAIN.stylePage();
	self.MAIN.setLayerSizes(true);
	document.getElementById("MAIN").style.visibility = "visible";
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.MAIN.getWinTitle()]));
	fitToScreen();
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
var timer = setTimeout("GetWebuser()",3000)
</script>
</head>
<body style="overflow:hidden" onload="GetWebuser()" onresize="fitToScreen()">
	<iframe id="header" name="header" title="Header" level="1" tabindex="0" style="visibility:hidden;position:absolute;height:32px;width:803px;left:0px;top:0px" src="/lawson/xhrnet/ui/header.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="MAIN" name="MAIN" title="Main Content" level="2" tabindex="0" style="visibility:hidden;position:absolute;height:464px;width:455px;left:0px;top:32px" src="/lawson/xhrnet/ui/headerpane.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="jsreturn" name="jsreturn" title="Empty" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/dot.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="lawheader" name="lawheader" title="Empty" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/dot.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@10.00.05.00.12 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/emppersonal.htm,v 1.16.2.41 2014/02/17 16:30:21 brentd Exp $ -->
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
