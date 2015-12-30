<html>
<head>
<title>Veteran Status</title>
<meta name="viewport" content="width=device-width" />
<META HTTP-EQUIV="Pragma" CONTENT="No-Cache">
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script src="/lawson/webappjs/common.js"></script>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/webappjs/transaction.js"></script>
<script src="/lawson/xhrnet/waitalert.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
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
var updatetype = "";
var EmpInfo = new Object();
var VeteranStatuses;
var appObj;

function OpenVeteran()
{
	authenticate("frameNm='jsreturn'|funcNm='InitVeteran()'|desiredEdit='EM'");
}

function InitVeteran()
{
	stylePage();
	document.title = getSeaPhrase("VETERAN_STATUS","ESS");
	setTaskHeader("header",getSeaPhrase("VETERAN_STATUS","ESS"),"Personal");
	StoreDateRoutines();
	GetLawsonApplicationVersion();
}

function GetEmployee()
{
	showWaitAlert(getSeaPhrase("WAIT","ESS"));
	
	var dmeObj = new DMEObject(authUser.prodline, "paemployee");
	dmeObj.out = "JAVASCRIPT";
	dmeObj.field = "employee.work-country;veteran;veteran.description";
	dmeObj.key = parseInt(authUser.company,10) + "=" + parseInt(authUser.employee,10);
	dmeObj.func = "GetVeteranStatuses()";
	dmeObj.otmmax = "1";
	dmeObj.max = "1";
  	DME(dmeObj,"jsreturn");
}

function GetLawsonApplicationVersion()
{
	showWaitAlert(getSeaPhrase("WAIT","ESS"));

	if (!appObj)
		appObj = new AppVersionObject(authUser.prodline, "HR");

	// if you call getAppVersion() right away and the IOS object isn't set up yet,
	// then the code will be trying to load the sso.js file, and your call for
	// the appversion will complete before the ios version is set
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
       		setTimeout("GetLawsonApplicationVersion()", 10);
       		return;
	}

	GetEmployee();
}

function GetVeteranStatuses()
{
	EmpInfo = self.jsreturn.record[0];
	VeteranStatuses = new Array();

	// if we are running on 8.1.1 applications or newer, perform a DME to get the veteran status select;
	// otherwise use a hard-coded value list.
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "8.1.1")
	{
		if (!emssObjInstance.emssObj.filterSelect)
		{
			var dmeObj = new DMEObject(authUser.prodline,"HRCTRYCODE");
				dmeObj.out = "JAVASCRIPT";
				dmeObj.index = "ctcset1";
				dmeObj.field = "hrctry-code;description";
				dmeObj.key = "VS";
				if (EmpInfo.employee_work_country)
					dmeObj.key += "=" + EmpInfo.employee_work_country;
				dmeObj.cond = "active";
				dmeObj.max = "600";
				dmeObj.func = "StoreVeteranStatuses()";
			DME(dmeObj,"jsreturn");
		}
		else
			DrawVeteranScreen();
	}
	else
	{
		VeteranStatuses[0] = new Object();
		VeteranStatuses[0].hrctry_code = "N";
		VeteranStatuses[0].description = getSeaPhrase("NO","ESS");
		VeteranStatuses[1] = new Object();
		VeteranStatuses[1].hrctry_code = "Y";
		VeteranStatuses[1].description = getSeaPhrase("YES","ESS");
		VeteranStatuses[2] = new Object();
		VeteranStatuses[2].hrctry_code = "1";
		VeteranStatuses[2].description = getSeaPhrase("VETERAN","ESS");
		VeteranStatuses[3] = new Object();
		VeteranStatuses[3].hrctry_code = "2";
		VeteranStatuses[3].description = getSeaPhrase("DISABLED_VET","ESS");
		VeteranStatuses[4] = new Object();
		VeteranStatuses[4].hrctry_code = "3";
		VeteranStatuses[4].description = getSeaPhrase("VIETNAM_VET","ESS");
		VeteranStatuses[5] = new Object();
		VeteranStatuses[5].hrctry_code = "4";
		VeteranStatuses[5].description = getSeaPhrase("DISABLED_VIETNAM_VET","ESS");
		VeteranStatuses[6] = new Object();
		VeteranStatuses[6].hrctry_code = "5";
		VeteranStatuses[6].description = getSeaPhrase("GULF_WAR_VET","ESS");
		VeteranStatuses[7] = new Object();
		VeteranStatuses[7].hrctry_code = "6";
		VeteranStatuses[7].description = getSeaPhrase("SPECIAL_DISABLED_VET","ESS");
		VeteranStatuses[8] = new Object();
		VeteranStatuses[8].hrctry_code = "7";
		VeteranStatuses[8].description = getSeaPhrase("OTHER_VET","ESS");

		DrawVeteranScreen();
	}
}

function StoreVeteranStatuses()
{
	VeteranStatuses = VeteranStatuses.concat(self.jsreturn.record);

	if (self.jsreturn.Next)
	{
		self.jsreturn.location.replace(self.jsreturn.Next);
		return;
	}

	VeteranStatuses = VeteranStatuses.sort(sortByDescription);
	DrawVeteranScreen();
}

function DrawVeteranSelect(selectedvalue)
{
	var codeselect = new Array();
	codeselect[0] = "<option value=' '>";

	for (var i=0; i<VeteranStatuses.length; i++)
	{
		codeselect[i+1] = "";
		codeselect[i+1] += "<option value='" + VeteranStatuses[i].hrctry_code + "'";
		if (VeteranStatuses[i].hrctry_code == selectedvalue)
		    codeselect[i+1] += " selected";
		codeselect[i+1] += ">" + VeteranStatuses[i].description;
	}

	return codeselect.join("");
}

function DrawVeteranScreen()
{
	var veteranStatus = EmpInfo.veteran;

	var sb = new Array();

	sb[sb.length] = '<form name="veteranform">'
	+ '<table border="0" cellspacing="0" cellpadding="0" style="width:100%">'
	+ '<tr><td class="plaintablerowheaderborderbottom" style="padding-top:5px">'+getSeaPhrase("VETERAN_STATUS","ESS")+'</td>'
	+ '<td class="plaintablecell" style="text-align:left:padding-top:5px" nowrap>';

	if (emssObjInstance.emssObj.filterSelect && appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "8.1.1")
	{
		sb[sb.length] = '<input type="text" name="veteran" id="veteran" class="inputbox" size="4" maxlength="4" '
		+ 'value="' + veteranStatus + '" onkeyup="parent.MAIN.document.getElementById(\'xlt_veteran\').innerHTML=\'\';"/>'
		+ '<a href="" onclick="parent.openDmeFieldFilter(\'veteran\');return false">'
		+ '<img src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" style="margin-bottom:-3px" alt="'+getSeaPhrase("SELECT_VALUE","ESS")+'">'
		+ '</a>'
		+ '<span style="text-align:left;width:200px" class="fieldlabel" id="xlt_veteran">' + EmpInfo.veteran_description + '</span>';
	}
	else
	{
		sb[sb.length] = '<select name="veteran">'
		+ DrawVeteranSelect(veteranStatus)
		+ '</select>';
	}

	sb[sb.length] = '</td></tr>'
	+ '<tr><td>&nbsp;</td><td class="plaintablecell">'
	+ uiButton(getSeaPhrase("UPDATE","ESS"),"parent.ProcessVeteran();return false","margin-top:10px")
	+ uiButton(getSeaPhrase("CANCEL","ESS"),"parent.CancelVeteran();return false","margin-top:10px")
	+ '</td></tr>'
	+ '</table>'
	+ '</form>';

	try
	{
		self.MAIN.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DETAILS","ESS");
		self.MAIN.document.getElementById("paneBody").innerHTML = sb.join("");
		self.MAIN.stylePage();
		self.MAIN.setLayerSizes();
		document.getElementById("MAIN").style.visibility = "visible";
		self.MAIN.document.forms["veteranform"].veteran.focus();
	}
	catch(e) {}
	removeWaitAlert();
}

function CancelVeteran()
{
	self.location = "/lawson/xhrnet/ui/logo.htm";
}

function ProcessVeteran()
{
	var formObj = self.MAIN.document.forms["veteranform"];

	for (var i=0; i<formObj.elements.length; i++)
	{
		if (NonSpace(formObj.elements[i].value) == 0)
		{
			formObj.elements[i].value = " ";
		}	
	}

	var agsObj 			= new AGSObject(authUser.prodline, "HR11.1");
	agsObj.event		= "CHANGE";
	agsObj.rtn 			= "MESSAGE";
	agsObj.longNames	= "ALL";
	agsObj.tds 			= false;
	agsObj.field 		= "FC=C"
		  				+ "&EFFECT-DATE=" + formjsDate(fmttoday)
	      				+ "&EMP-COMPANY=" + parseInt(authUser.company,10)
		  				+ "&EMP-EMPLOYEE=" + parseInt(authUser.employee,10)
		  				+ "&PEM-VETERAN=" + escape(formObj.elements["veteran"].value,1)
		  				+ "&XMIT-HREMP-BLOCK=1000000000"
		  				+ "&XMIT-REQDED=1"
	agsObj.func = "parent.DisplayMessage()";
	agsObj.debug = false;
	updatetype = "VET";

	showWaitAlert(getSeaPhrase("HOME_ADDR_42","ESS"));

	for (var i=0; i<formObj.elements.length; i++)
	{
		if (NonSpace(formObj.elements[i].value) == 0)
		{
			formObj.elements[i].value = "";
		}	
	}

	AGS(agsObj,"jsreturn");
}

function DisplayMessage()
{
	removeWaitAlert();
	var msg = self.lawheader.gmsg;
	var msgnbr = parseInt(self.lawheader.gmsgnbr,10);

	if (msgnbr != 0)
	{
		if (msgnbr == 50 || msgnbr == 141)
		{
			msg = getSeaPhrase("REQUIRE_ADDITIONAL_INFO_CONTACT_HR","ESS");
		}
		seaAlert(msg);
	}
	else
	{
		msg = getSeaPhrase("CHANGE_COMPLETE_NO_CONTINUE","ESS");
		seaAlert(msg);
		GetEmployee();
	}
}

function OpenHelpDialog()
{
	openHelpDialogWindow("/lawson/xhrnet/veterantips.htm");
}

function sortByDescription(obj1, obj2)
{
	if (obj1.description < obj2.description)
		return -1;
	else if (obj1.description > obj2.description)
		return 1;
	else
		return 0;
}

/* Filter Select logic - start */
function performDmeFieldFilterOnLoad(dmeFilter)
{
	switch (dmeFilter.getFieldNm().toLowerCase())
	{
		case "veteran": // veteran status
			var keyStr = "VS";
			if (EmpInfo && EmpInfo.employee_work_country)
				keyStr += "=" + EmpInfo.employee_work_country;
			dmeFilter.addFilterField("hrctry-code", 4, getSeaPhrase("VETERAN_STATUS","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"hrctrycode",
				"ctcset1",
				"hrctry-code;description",
				keyStr,
				"active",
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;
		default: break;
	}
}

function performDmeFieldFilter(dmeFilter)
{
	switch (dmeFilter.getFieldNm().toLowerCase())
	{
		case "veteran": // veteran status
		var keyStr = "VS";
		if (EmpInfo && EmpInfo.employee_work_country)
			keyStr += "=" + EmpInfo.employee_work_country;
		filterDmeCall(dmeFilter,
			"jsreturn",
			"hrctrycode",
			"ctcset1",
			"hrctry-code;description",
			keyStr,
			"active",
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;
		default: break;
	}
}

function dmeFieldRecordSelected(recIndex, fieldNm)
{
	var selRec = self.jsreturn.record[recIndex];
	var formElm = self.MAIN.document.getElementById(fieldNm.toLowerCase());
	var formDescElm;

	switch(fieldNm.toLowerCase())
	{
		case "veteran": // veteran status
			formElm.value = selRec.hrctry_code;
			try { self.MAIN.document.getElementById("xlt_"+fieldNm.toLowerCase()).innerHTML = selRec.description; } catch(e) {}
			break;
		default:
			break;
	}
	try
	{
		filterWin.close();
	}
	catch(e)
	{}
	formElm.focus();
}

function getDmeFieldElement(fieldNm)
{
	var formElm = self.MAIN.document.getElementById(fieldNm.toLowerCase());
	var fld = [self.MAIN, formElm];
	return fld;
}

function drawDmeFieldFilterContent(dmeFilter)
{
	var selectHtml = new Array();
	var dmeRecs = self.jsreturn.record;
	var nbrDmeRecs = dmeRecs.length;
	var fieldNm = dmeFilter.getFieldNm().toLowerCase();

	switch(fieldNm)
	{
		case "veteran": // veteran status
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px"  styler="list">'
			selectHtml[0] += '<tr><th style="width:50%">'+getSeaPhrase("VETERAN_STATUS","ESS")+'</th>'
			selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

			for (var i=0; i<nbrDmeRecs; i++)
			{
				tmpObj = dmeRecs[i];
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.hrctry_code) ? tmpObj.hrctry_code : '&nbsp;'
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</td></tr>'
			}

			if (nbrDmeRecs == 0)
			{
				selectHtml[1] = '<tr class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'
				selectHtml[1] += getSeaPhrase("NORECS","ESS");
				selectHtml[1] += '</td></tr>'
			}

			selectHtml[selectHtml.length] = '</table>'
			break;
		default: break;
	}
	dmeFilter.getRecordElement().innerHTML = selectHtml.join("");
	try
	{
		if (typeof(parent.removeWaitAlert) != "undefined")
			parent.removeWaitAlert();
		removeWaitAlert();
	} catch(e) {}
}
/* Filter Select logic - end */
</script>
</head>
<body onload="OpenVeteran()">
	<iframe id="header" name="header" style="visibility:hidden;position:absolute;height:32px;width:803px;left:0px;top:0px" src="/lawson/xhrnet/ui/header.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="MAIN" name="MAIN" style="visibility:hidden;position:absolute;left:0%;height:300px;width:500px;top:32px" src="/lawson/xhrnet/ui/headerpanehelp.htm" marginwidth="0" marginheight="0" frameborder="no" scrolling="auto"></iframe>
	<iframe id="jsreturn" name="jsreturn" src="/lawson/xhrnet/dot.htm" style="visibility:hidden;height:0px;width:0px;" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="lawheader" name="lawheader" src="/lawson/xhrnet/errmsg.htm" style="visibility:hidden;height:0px;width:0px;" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@(201111) 09.00.01.06.00 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/Attic/veteran.htm,v 1.1.2.11 2011/07/01 21:27:03 brentd Exp $ -->
