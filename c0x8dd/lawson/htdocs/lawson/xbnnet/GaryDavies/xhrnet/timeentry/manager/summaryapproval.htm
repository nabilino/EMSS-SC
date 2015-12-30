<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<html>
<head>
<title>Manager Summary Approval</title>
<meta name="viewport" content="width=device-width" />
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script src="/lawson/webappjs/common.js"></script>
<script SRC="/lawson/webappjs/commonHTTP.js"></script>
<script SRC="/lawson/webappjs/transaction.js"></script>
<script SRC="/lawson/webappjs/data.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script SRC="/lawson/xhrnet/esscommon80.js"></script>
<script SRC="/lawson/xhrnet/email.js"></script>
<script SRC="/lawson/xhrnet/waitalert.js"></script>
<script SRC="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script SRC="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script SRC="/lawson/xhrnet/timeentry/lib/mgrtimeentrylib.js"></script>
<script SRC="/lawson/xhrnet/timeentry/Skins/Ocean/Template.js"></script>
<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"></script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script src="/lawson/webappjs/javascript/objects/ActivityDialog.js"></script>
<script src="/lawson/webappjs/javascript/objects/OpaqueCover.js"></script>
<script src="/lawson/webappjs/javascript/objects/Dialog.js"></script>
<script src="/lawson/webappjs/javascript/objects/Data.js"></script>
<script src="/lawson/webappjs/javascript/objects/ProcessFlow.js"></script>
<script language="JavaScript">
///////////////////////////////////////////////////////////////////////////////////////////
//
// Global Variables.
//

var planCode = "";
var payPlanStart = "";
var commentIndex = -1;

if (window.location.search)
{
	planCode = getVarFromString("plancode", window.location.search);
	payPlanStart = getVarFromString("startdate", window.location.search);
}

var PlanCode
var Reports
var LastReports
var bChangesMade = false;
// PT 116834
var bShowStatusMsg = false;
var bUpdatingSummary = false;

// PT 147795. Global variable to set the number of detail lines on HS04.1.
var hs04DetailLines = 80;
// PT 155353. Get application version for user-id auditing.
var appObj;
var pfServiceObj;

function OpenProgram()
{
	// Exit if lawheader is not defined
	if (typeof(self.lawheader.gmsgnbr) == "undefined")
	{
		return;
	}

	Reports = null;
	LastReports = null;
	authenticate("frameNm='jsreturn'|funcNm='InitManagerApproval()'|sysenv=true|desiredEdit='EM'");
}

function InitManagerApproval()
{
	stylePage();
	if (payPlanStart != "")
	{
		StartManagerApproval(payPlanStart, false);
	}
	else
	{
		StartManagerApproval("", false);
	}
}

function StartManagerApproval(Start, MoreRecords)
{
	showWaitAlert(getSeaPhrase("LOADING_SUMMARY_APPROVAL","TE"));
	document.title = getSeaPhrase("MANAGER_APPROVAL","TE");
	setTaskHeader("header", getSeaPhrase("TIME_ENTRY","TE"), "TimeEntry");
	document.getElementById("paneHelpIcon").alt = getSeaPhrase("HELP","ESS").toString();
	document.getElementById("paneBorder").style.visibility = "visible";

	if (Reports == null)
	{
		Reports = new ReportsObject(authUser.company, authUser.employee)
		self.lawheader.formlinecount = -1;
	}

	// PT114830
	self.lawheader.linecount = 0;
	self.lawheader.UpdateType = "HS22.1";

	var obj = new AGSObject(authUser.prodline, "HS22.1");
		obj.evt			= "ADD";
		obj.rtn			= "DATA";
		obj.longNames	= true;
		obj.lfn			= "ALL";
		obj.tds			= false;

	if (arguments.length > 1 && arguments[1])
	{
		obj.field		= "FC=%2B";
	}
	else
	{
		obj.field		= "FC=I";
	}

	obj.field += "&HSU-COMPANY="+parseInt(authUser.company, 10);
	obj.field += "&HSU-EMPLOYEE="+parseInt(authUser.employee, 10);
	obj.field += "&OT-PLAN-CODE="+planCode;

	if (Start != "")
	{
		obj.field 	+= "&PYT-PAY-PER-START="+Start;
	}

	if (arguments.length > 1 && arguments[1])
	{
		obj.field += "&LAST-EMPLOYEE="+Reports.LastEmployee;
	  	obj.field += "&LAST-HSU-CODE="+Reports.LastHsuCode;
	  	obj.field += "&LAST-LAST-NAME="+escape(Reports.LastLastName);
	  	obj.field += "&LAST-FIRST-NAME="+escape(Reports.LastFirstName);
  		obj.field += "&LAST-MIDDLE-INIT="+escape(Reports.LastMiddleInit);
	}

	// PT114830
	Reports.LastEmployee = "";
	Reports.LastHsuCode = "";
	Reports.LastLastName = "";
	Reports.LastFirstName = "";
	Reports.LastMiddleInit = "";

	obj.func		= "parent.FinishedHS22Call('"+Start+"')";
	obj.debug		= false;
	AGS(obj,"jsreturn");
}

function FinishedHS22Call(Start)
{
	// Exit if the lawheader frame is not loaded.
	if (typeof(self.lawheader.gmsgnbr) == "undefined")
	{
		return;
	}

	if (self.lawheader.gmsgnbr == "000")
	{
		// PT114830
		if (self.lawheader.gmsg == "More records exist, use PageDown" ||
		(Reports.LastEmployee && Reports.LastEmployee != 0) || Reports.LastHsuCode || Reports.LastLastName ||
		Reports.LastFirstName || Reports.LastMiddleInit)
		{
			StartManagerApproval(Start, true);
		}
		else
		{
            //PT116834
            if (bShowStatusMsg)
            {
                seaAlert(getSeaPhrase("STATUS_UPDATED","TE"));
            }
            bShowStatusMsg = false;
            bUpdatingSummary = false;
			PaintSummaryScreen();
		}
	}
	else
	{
		Reports = LastReports;
        //PT116834
        bShowStatusMsg = false;
        bUpdatingSummary = false;
		seaAlert(self.lawheader.gmsg);
		SummaryApprovalDone();
	}
}

function PaintSummaryScreen()
{
	GetTimeCardView(Reports.View);
	PaintHeaders(true);
	PaintMainBodyOfSummaryApproval();

	bChangesMade = false;
	fncSaveChanges = "";
}

function PaintMainBodyOfSummaryApproval()
{
	try
	{
		self.MAIN.document.getElementById("paneBody2").innerHTML = "";
	}
	catch(e)
	{
		setTimeout(function() { PaintMainBodyOfSummaryApproval.apply(this, arguments); }, 5);
		return;
	}

	// If the ProcessFlow service was found, trigger the flow.  Otherwise use the email CGI program.
	var techVersion = (iosHandler && iosHandler.getIOSVersionNumber() >= "9.0") ? ProcessFlowObject.TECHNOLOGY_900 : ProcessFlowObject.TECHNOLOGY_803;
	var httpRequest = (typeof(SSORequest) == "function") ? SSORequest : SEARequest;
	var pfObj = new ProcessFlowObject(window, techVersion, httpRequest, "EMSS");
	pfObj.showErrors = false;

	if (typeof(pfServiceObj) == "undefined")
	{
		pfServiceObj = pfObj.lookUpService("EMSSTimeEntChg");
	}

	var html = '<form name="frmStatus">'
	html += '<div style="idth:100%;text-align:center">' //bjd - wheight:400px;overflow:auto;
	html += '<table border="0" cellpadding="4" cellspacing="0" class="tabletimeentry" style="width:100%;text-align:center" styler="list">'
	html += '<tr class="plaintablecellboldnopadding">'
	html += '<th style="width:90px;text-align:center">'+getSeaPhrase("COMMENTS_LOWER","TE")+'</th>'
	html += '<th style="width:auto;text-align:left" nowrap>'+getSeaPhrase("NAME","TE")+'</th>'
	html += '<th style="width:80px;text-align:center">'+getSeaPhrase("TIMECARD_TYPE","TE")+'</th>'
	html += '<th style="width:80px;text-align:center">'+getSeaPhrase("SUBMITTED_HOURS","TE")+'</th>'
	html += '<th style="width:auto;text-align:center" nowrap>'+getSeaPhrase("DETAIL","TE")+'</th>'
	html += '<th style="width:100px;text-align:center">'+getSeaPhrase("STATUS_ONLY","TE")+'</th>'
	html += '</tr>'

	for (var i=0; i<Reports.Detail.length; i++)
	{
		if (Reports.Detail[i].CommentsExist == 1)
		{
			NoCommentsIconImage.src = ExistingCommentsIcon
		}
		else
		{
			NoCommentsIconImage.src = NoCommentsIcon
		}

		html += '<tr class="plaintablecellnopadding">'
		html += '<td style="width:90px;text-align:center">'
		html += '<a href="" onclick="parent.Comments_Period('+i+');return false;" '
		html += 'onmouseover="parent.CommentIconMouseOver(1,\''+i+'\');return true;" '
		html += 'onmouseout="parent.CommentIconMouseOver(0,\''+i+'\');return true;">'
		html += '<img styler="documenticon" src="'+NoCommentsIconImage.src+'" border="0" width="32" height="32" '
		html += 'default_icon="' + NoCommentsIcon + '" active_icon="' + ExistingCommentsIcon + '" '
		html += 'name="comment'+i+'" alt="'+getSeaPhrase("OPEN_COMMENTS","TE")+Reports.Detail[i].FullName+'">'
		html += '</a>'
		html += '</td>'
		html += '<td style="width:auto;text-align:left" nowrap>'

// MOD BY BILAL
//		if (pfServiceObj == null)
//		{
			html += '<a href="" onclick="parent.EmailClicked('+i+');return false;" '
//		}
//		else
//		{
//			html += '<a href="mailto:' + Reports.Detail[i].Email + '" ';
//		}
// END OF MOD

		html += 'id="empName'+i+'" onmouseover="parent.showEmailHelpTextRollover('+i+')" '
		html += 'onmouseout="parent.hideEmailHelpTextRollover()">'
		html += Reports.Detail[i].FullName
		html += '</a>'
		html += '</td>'
		html += '<td style="width:80px;text-align:center">'+Reports.Detail[i].TimecardTypeDesc+'</td>'
		html += '<td style="width:80px;text-align:center">'+Reports.Detail[i].TotalHours+'&nbsp;</td>'
		html += '<td style="width:auto;text-align:center;vertical-align:middle" nowrap>'
		html += '<a href="" onclick="parent.DetailClicked('+i+');return false;">'

		switch (parseFloat(Reports.Detail[i].Status))
		{
			case -1:
				html += '<img style="vertical-align:middle" styler="multipleentrydetailicon" image_color="-1" src="' + DrillAroundIcon1 + '" border=0 alt="' + Reports.Detail[i].FullName + getSeaPhrase("NOT_ENTERED_CARD","TE")+'">';
				break;
			case 0:
				html += '<img style="vertical-align:middle" styler="multipleentrydetailicon" image_color="0" src="' + DrillAroundIcon2 + '" border=0 alt="' + Reports.Detail[i].FullName + getSeaPhrase("NOT_SUBMITTED_CARD","TE")+'">';
				break;
			default:
				html += '<img style="vertical-align:middle" styler="multipleentrydetailicon" image_color="1" src="' + DrillAroundIcon3 + '" border=0 alt="' + Reports.Detail[i].FullName + getSeaPhrase("SUBMITTED_CARD","TE")+'">';
				break;
		}

		html += '</a>'
		html += '</td>'
		html += '<td style="width:100px;text-align:center;vertical-align:middle">'

		if (Reports.Detail[i].Status >= 1 && Reports.Detail[i].Status < 5 && !LockedOut)
		{
			html += StatusDropDown(Reports.Detail[i].Status,i);
		}
		else if (LockedOut && Reports.Detail[i].Status < 5)
		{
			switch (parseInt(Reports.Detail[i].Status,10))
			{
				case 0: 	html += getSeaPhrase("NOT_ENTERED","TE"); break
				case 1: 	html += getSeaPhrase("SUBMITTED","TE"); break;
				case 2: 	html += getSeaPhrase("APPROVED","TE"); break;
				case 3: 	html += getSeaPhrase("HELD","TE"); break;
				case 4: 	html += getSeaPhrase("REJECTED","TE"); break;
			}
		}
		else if (Reports.Detail[i].Status >= 5)
		{
			switch (parseInt(Reports.Detail[i].Status,10))
			{
				case 5:		html += getSeaPhrase("HISTORICAL_1","TE"); break; // Entered (Historical)
				case 6:		html += getSeaPhrase("HISTORICAL_2","TE"); break; // Submitted (Historical)
				case 7:		html += getSeaPhrase("HISTORICAL_3","TE"); break; // Approved (Historical)
				case 8:		html += getSeaPhrase("HISTORICAL_4","TE"); break; // On Hold (Historical)
				case 9:		html += getSeaPhrase("HISTORICAL_5","TE"); break; // Rejected (Historical)
				default:	html += getSeaPhrase("HISTORICAL_ONLY","TE"); break;
			}
		}
		else
		{
			html += '&nbsp;';
		}

		html += '</td>';
		html += '</tr>';
	}

	html += '</table>';
	html += '</div>';
	html += '</form>';
	html += GetButtonFrameInformation(Reports.View);
	html += rolloverHelpText("empEmailHelpText",getSeaPhrase("SEND_EMAIL","ESS"));

	var divObj = self.MAIN.document.getElementById("paneBody2");
	//try
	//{
		divObj.innerHTML = html;
	//}
	//catch(e)
	//{
		//self.MAIN.document.body.innerHTML = html;
	//}
	self.MAIN.stylePage();
	fitToScreen();
	// if the comment icons have been restyled for theme 9, update the global references
	if (Reports.Detail.length > 0 && self.MAIN.document.comment0)
	{
		var cmtImg = self.MAIN.document.comment0;
		var defaultIcon = cmtImg.getAttribute("default_icon");
		var activeIcon = cmtImg.getAttribute("active_icon");
		if (defaultIcon && NoCommentsIcon != defaultIcon)
		{  		
			NoCommentsIcon = defaultIcon;
			NoCommentsOverIcon = defaultIcon;
		}
		if (activeIcon && ExistingCommentsIcon != activeIcon)
		{
			ExistingCommentsIcon = activeIcon;
			ExistingCommentsOverIcon = activeIcon;
		}	
	}	
	document.getElementById("MAIN").style.visibility = "visible";

	removeWaitAlert();

	if (opener)
	{
		opener.close();
	}
}

function showEmailHelpTextRollover(empIndex)
{
	var empName = Reports.Detail[empIndex].FullName;
	setHelpText("self.MAIN", "empEmailHelpText", getSeaPhrase("SEND_EMAIL_TO","TE") + empName);
	displayHelpText("self.MAIN", "empName" + empIndex, "empEmailHelpText", true);
}

function hideEmailHelpTextRollover()
{
	displayHelpText("self.MAIN", "empName", "empEmailHelpText", false);
}

function Comments_Period(Index)
{
	if (typeof(authUser.prodline) == "unknown")
	{
		authenticate("frameNm='jsreturn'|funcNm='Comments_Period("+Index+")'|sysenv=true|desiredEdit='EM'")
		return;
	}

	commentIndex = Index;

	if (eval("self.MAIN.document.comment" + Index).src.indexOf(ExistingCommentsOverIcon) >= 0)
	{
		var obj   		= new DMEObject(authUser.prodline,"empcomment");
			obj.out   	= "JAVASCRIPT";
			obj.index 	= "ecmset1";
			obj.field 	= "date";
			obj.max 	= 1;
			obj.key   	= authUser.company+"="+Reports.Detail[Index].Employee+"=TR="+Reports.PeriodStart+"->"+Reports.PeriodEnd;
			obj.func  	= "DMEEmpCommentsFinished("+Index+")";
			obj.debug 	= false;
		DME(obj,"jsreturn");
	}
	else
	{
		OpenComments(Reports.PeriodStart, Reports.Detail[Index].Employee);
	}
}

function DMEEmpCommentsFinished(Index)
{
	OpenComments(formjsDate(formatDME(self.jsreturn.record[0].date)), Reports.Detail[Index].Employee);
}

function CommentsWindow_Closed()
{
	// TODO: add logic to update icons
}

function ToggleCommentSwitch()
{
	if (self.MAIN.document.comment0)
	{
		var cmtImg = self.MAIN.document.comment0;
		NoCommentsIcon = cmtImg.getAttribute("default_icon");
		ExistingCommentsIcon = cmtImg.getAttribute("active_icon");
	}

	var NewDate = Reports.PeriodStart;
	LastReports = Reports;
	Reports = null;
	StartManagerApproval(NewDate);
}

function StatusDropDown(status,Index)
{
	var arg = '<select class="inputbox" name="cmbStatus'+Index+'" onchange="parent.bChangesMade=true;">';
	arg += (status == 1) ? '<option value="1" selected></option>' : '<option value="1"></option>';
	arg += (status == 2) ? '<option value="2" selected>'+getSeaPhrase("APPROVED","TE")+'</option>' : '<option value="2">'+getSeaPhrase("APPROVED","TE")+'</option>';
	arg += (status == 3) ? '<option value="3" selected>'+getSeaPhrase("HOLD","TE")+'</option>' : '<option value="3">'+getSeaPhrase("HOLD","TE")+'</option>';
	arg += (status == 4) ? '<option value="4" selected>'+getSeaPhrase("REJECTED","TE")+'</option>' : '<option value="4">'+getSeaPhrase("REJECTED","TE")+'</option>';
	arg += '</select>';

	return arg;
}

function PreviousPeriod_Summary()
{
	if (bChangesMade)
	{
		SaveChanges("GotoPreviousPeriod_Summary()", "Summary");
	}
	else
	{
		GotoPreviousPeriod_Summary();
	}
}

function GotoPreviousPeriod_Summary()
{
	showWaitAlert(getSeaPhrase("LOADING_PRE_PERIOD","TE"));
	var NewDate = PreviousDate(Reports.PeriodStart);
	LastReports = Reports;
	Reports = null;
	StartManagerApproval(NewDate);
}

function NextPeriod_Summary()
{
	if (bChangesMade)
	{
		SaveChanges("GotoNextPeriod_Summary()", "Summary");
	}
	else
	{
		GotoNextPeriod_Summary();
	}
}

function GotoNextPeriod_Summary()
{
	showWaitAlert(getSeaPhrase("LOADING_NEXT_PERIOD","TE"));
	var NewDate = NextDate(Reports.PeriodEnd);
	LastReports = Reports;
	Reports = null;
	StartManagerApproval(NewDate);
}

function HeaderCalendar_Summary()
{
	if (bChangesMade)
	{
		SaveChanges("GotoHeaderCalendar_Summary()", "Summary");
	}
	else
	{
		GotoHeaderCalendar_Summary();
	}
}

function GotoHeaderCalendar_Summary()
{
	bChangesMade = false;
	DateSelect("5");
}

function ReturnDate(date)
{
	switch (date_fld_name)
	{
		case "2": ReturnCommentsDate(formjsDate(date)); break;
		case "5": ReturnCalendarDate(formjsDate(date)); break;
		default : break;
	}
}

function ReturnCalendarDate(dte)
{
	if (getDteDifference(dte, Reports.PeriodStart) <= 0 && getDteDifference(dte, Reports.PeriodEnd) >= 0)
	{
		seaAlert(getSeaPhrase("PAY_PERIOD_LOADED","TE"));
		return;
	}

	showWaitAlert(getSeaPhrase("LOADING_NEW_PERIOD","TE"));
	LastReports = Reports;
	Reports = null;
	StartManagerApproval(dte);
}

function SummaryUpdate()
{
	var Index = 0;

	if (arguments.length > 0)
	{
		if (typeof(authUser.prodline) == "unknown")
		{
			authenticate("frameNm='jsreturn'|funcNm='SummaryUpdate(\""+arguments[0]+"\")'|sysenv=true|desiredEdit='EM'");
			return;
		}

		// PT 121266
		if (isNaN(parseInt(arguments[0],10)))
		{
			Index = 0;
		}
		else
		{
			Index = parseInt(arguments[0],10)+1;
		}
	}
	else
	{
		if (typeof(authUser.prodline) == "unknown")
		{
			authenticate("frameNm='jsreturn'|funcNm='SummaryUpdate()'|sysenv=true|desiredEdit='EM'")
			return;
		}

		Index = 0;
	}

	var pfEmailAry = new Array();

	// If the ProcessFlow service was found, trigger the flow.  Otherwise use the email CGI program.
	var techVersion = (iosHandler && iosHandler.getIOSVersionNumber() >= "9.0") ? ProcessFlowObject.TECHNOLOGY_900 : ProcessFlowObject.TECHNOLOGY_803;
	var httpRequest = (typeof(SSORequest) == "function") ? SSORequest : SEARequest;
	var pfObj = new ProcessFlowObject(window, techVersion, httpRequest, "EMSS");
	pfObj.showErrors = false;

	if (typeof(pfServiceObj) == "undefined")
	{
		pfServiceObj = pfObj.lookUpService("EMSSTimeEntChg");
	}

	for (var i=Index; i<Reports.Detail.length; i++)
	{
		// PT 121266
		var originalStatus = Reports.Detail[i].Status;

		if (originalStatus >= 1 && originalStatus < 5 && !LockedOut)
		{
			var statusForm = self.MAIN.document.forms["frmStatus"];
			var statusDropDown = statusForm.elements["cmbStatus" + i];
			var selectedIndex = statusDropDown.selectedIndex;
			var Status = statusDropDown.options[selectedIndex].value;

			if (Status >= 1 && Status <= 4 && Status != originalStatus)
			{
				if (Status == 4 && emssObjInstance.emssObj.teManagerRejectEmail)
				{
					if (pfServiceObj == null)
					{
						SendEmail("reject", i);
						return;
					}
					else
					{
						pfEmailAry[i] = "r";
					}
				}

				if (Status == 2 && emssObjInstance.emssObj.teManagerApproveEmail)
				{
					if (pfServiceObj == null)
					{
						SendEmail("approve", i);
						return;
					}
					else
					{
						pfEmailAry[i] = "a";
					}
				}
			}
		}
	}

	if (pfServiceObj != null)
	{
		// Process Flow can only handle up to 15 variables in a work unit.  Split up the direct reports into multiple
		// sets of data and send a chunk of data to each work unit required.  Send up to 60 direct reports per work unit.
		var rptsAry = new Array();

		for (var rptIndex in pfEmailAry)
		{
			var empNbr = String(Reports.Detail[rptIndex].Employee);
			var action = String(pfEmailAry[rptIndex]);
			var itemStr = empNbr + "=" + action;
			var len = rptsAry.length;

			if (len == 0)
			{
				rptsAry[len] = "";
				len = rptsAry.length;
			}

			if ((rptsAry[len - 1].length + itemStr.length) <= 60)
			{
				if (rptsAry[len - 1] != "")
				{
					rptsAry[len - 1] += ";";
				}
				rptsAry[len - 1] += itemStr;
			}
			else
			{
				rptsAry[len] = itemStr;
			}
		}

		// We can only send up to 12 variables that contain direct reports, since we are also sending the company,
		// employee, and role variables.  Trigger as many flows as necessary to process every direct report status change.
		var nbrFlows = Math.ceil(rptsAry.length / 12);
		var rptsIndex = 0;

		if (nbrFlows > 0)
		{
			showWaitAlert(getSeaPhrase("SENDING_EMPLOYEE_EMAIL_NOTICE","TE"));
		}

		for (var j=0; j<nbrFlows; j++)
		{
			var flowObj = pfObj.setFlow("EMSSTimeEntChg", Workflow.SERVICE_EVENT_TYPE, Workflow.ERP_SYSTEM,
						authUser.prodline, authUser.webuser, null, "");
			flowObj.addVariable("company", String(authUser.company));
			flowObj.addVariable("employee", String(authUser.employee));
			flowObj.addVariable("role", "summary");

			var k = rptsIndex;
			var l = 1;
			while (k < rptsIndex + 12)
			{
				if (k < rptsAry.length)
				{
					flowObj.addVariable("reports" + l, rptsAry[k]);
				}
				else
				{
					flowObj.addVariable("reports" + l, "");
				}
				k++;
				l++;
			}
			rptsIndex += 12;
			pfObj.triggerFlow();
		}
	}

	// PT 147795. Pass the index of the first record to update in the Reports.Detail array.
	SummaryUpdate_PartII(0);
}

function SummaryUpdate_PartII(i)
{
	// PT 155353. Get application version for user-id auditing.
	if (!appObj)
	{
		appObj = new AppVersionObject(authUser.prodline, "HR");
	}

    //PT116834
    bUpdatingSummary = true;
	showWaitAlert(getSeaPhrase("UPDATING_SUMMARY","TE"));

	// PT 147795. Make sure the index is initialized.  If it is undefined or null,
	// start updating from index 0 in the Reports.Detail array.
	if (!i)
	{
		i = 0;
	}

	var index, Status;
	var obj 		= new AGSObject(authUser.prodline,"HS04.1");
		obj.event 	= "CHANGE";
		obj.rtn 	= "DATA";
		obj.longNames = true;
		obj.lfn		= "ALL";
		obj.debug 	= false;
		obj.field 	= "FC=C&COMPANY="+escape(parseFloat(authUser.company))
				+ "&FROM-DATE="+escape(Reports.PeriodStart)
				+ "&TO-DATE="+escape(Reports.PeriodEnd)

		// PT 155353. Update PPT-USER-ID field if running on 9.0.0 applications or newer.
		if (appObj && (appObj.getAppVersion() != null) && (appObj.getAppVersion().toString() >= "9.0"))
		{
			obj.field += "&PPT-USER-ID=W" + authUser.employee;
		}

		var j = 1; // detail row counter; count from 1..hs04DetailLines

		while ((i < Reports.Detail.length) && (j <= hs04DetailLines))
		{
			if (Reports.Detail[i].Status >= 1 && Reports.Detail[i].Status <= 4 && !LockedOut)
			{
				var statusForm = self.MAIN.document.forms["frmStatus"];
				var statusDropDown = statusForm.elements["cmbStatus" + i];

				index = statusDropDown.selectedIndex;
				Status = statusDropDown.options[index].value;

				obj.field += "&EMPLOYEE"+j+"="+escape(Reports.Detail[i].Employee)
						  + "&STATUS"+j+"="+escape(Status);
				j++;
			}
			i++;
		}

		obj.dtlField = "EMPLOYEE;STATUS";

		// PT 147795. Pass a pointer to the direct report record where we left off if
		// there are more records to update, as another AGS call is needed.
		// Otherwise, call the next function to refresh the display.
		if (i < Reports.Detail.length)
		{
			obj.func = "parent.SummaryUpdate_PartII("+i+")";
		}
		else
		{
			obj.func = "parent.SummaryUpdateFinished()";
		}

		// PT 147795. Do not submit this AGS call if we did not find any records with
		// the correct range of status values.
		if (j > 1)
		{
			AGS(obj,"jsreturn");
		}
		else
		{
			SummaryUpdateFinished();
		}
}

function SummaryUpdateFinished()
{
	var PeriodStart = Reports.PeriodStart;
	var AskToSaveChanges = (bChangesMade && fncSaveChanges)?true:false;

	bChangesMade = false;
    bShowStatusMsg = true;

	if (AskToSaveChanges)
	{
		SaveChangesDone();
		removeWaitAlert();
	}
	else
	{
		Reports = null;
		LastReports = null;
		StartManagerApproval(PeriodStart);
	}
}

var EmailWindow = null;
function EmailClicked(Index)
{
	EmailWindow = window.open("/lawson/xhrnet/timeentry/manager/email.htm?to="+Reports.Detail[Index].Email+"&from="+Reports.Email, "EMAIL", "width=650,height=350,toolbar=no,status=no,resizable=yes")
}

function SummaryApprovalDone()
{
	if (bChangesMade)
	{
		SaveChanges("FinishSummaryApproval()", "Summary");
	}
	else
	{
		FinishSummaryApproval();
	}
}

function FinishSummaryApproval()
{
	removeWaitAlert();
	if (opener)
	{
		window.close();
	}
	else if (window.name == "DETAIL")
	{
		if (parent != self && parent.opener)
		{
			parent.close();
		}
		else
		{
			self.location = "/lawson/xhrnet/timeentry/employee/timeentrysplash.htm";
		}
	}
	else
	{
		self.location = "/lawson/xhrnet/timeentry/employee/timeentrysplash.htm";
	}
}

function BackToPayPlanList()
{
	if (bChangesMade)
	{
		SaveChanges("BackToList()", View);
	}
	else
	{
		BackToList();
	}
}

function BackToList()
{
	if (typeof(parent["CloseDetailFrame"]) == "function")
	{
		parent.CloseDetailFrame();
	}
	else
	{
		var strUrl = "/lawson/xhrnet/timeentry/manager/manager.htm?type=summary";
		window.open(strUrl, "MANAGER", "status,resizable=yes,status,resizable=yes,height=650,width=800");
	}

	if (opener)
	{
		self.close();
	}
}

function DetailClicked(Index)
{
    if (bUpdatingSummary)
    {
    	return;
	}

	if (bChangesMade)
	{
		SaveChanges("GotoDetailClicked("+Index+")", "Summary");
	}
	else
	{
		GotoDetailClicked(Index);
	}
}

function GotoDetailClicked(Index)
{
	var dtlUrl;

	if (Reports.Detail[Index].TimecardTypeDesc == "Exception")
	{
		dtlUrl = "/lawson/xhrnet/timeentry/exception/exception.htm?type=period&index="+Index+"&summary=yes";
	}
	else
	{
		dtlUrl = "/lawson/xhrnet/timeentry/employee/timeentry.htm?type=period&index="+Index+"&summary=yes";
	}

	document.getElementById("header").style.visibility = "hidden";
	self.DETAIL.location.replace(dtlUrl);
	document.getElementById("DETAIL").style.visibility = "visible";
}

function CloseDetailFrame(dtlUrl)
{
	if (dtlUrl)
	{
		var queryStr = dtlUrl.substring(dtlUrl.indexOf("?"), dtlUrl.length);

		planCode = getVarFromString("plancode", queryStr);
		payPlanStart = getVarFromString("startdate", queryStr);

		document.getElementById("MAIN").style.visibility = "hidden";
		try
		{
			self.MAIN.document.getElementById("paneBody1").innerHTML = "";
			self.MAIN.document.getElementById("paneBody2").innerHTML = "";
		}
		catch(e)
		{}
		Reports = null;
		LastReports = null;

		if (payPlanStart != "")
		{
			StartManagerApproval(payPlanStart, false);
		}
		else
		{
			StartManagerApproval("", false);
		}
	}

	document.getElementById("DETAIL").style.visibility = "hidden";
	self.DETAIL.location.replace("/lawson/xhrnet/dot.htm");
	document.getElementById("header").style.visibility = "visible";
}

function ResizeWindow()
{
	if (typeof(Reports) != "undefined")
	{
		var PeriodStart = Reports.PeriodStart;
		Reports = null;
		LastReports = null;

		if (typeof(PeriodStart) != "undefined")
		{
			StartManagerApproval(PeriodStart);
		}
		else
		{
			StartManagerApproval("");
		}
	}
	else
	{
		Reports = null;
		LastReports = null;
		StartManagerApproval("");
	}
}

var EmailTimer;
var __DetailIndex;

function SendEmail(type, Index)
{
	var mailText = "";

	switch (type)
	{
		case "reject":	mailText = Reports.EmployeeName+getSeaPhrase("CARD_RETURNED_FOR_REVIEW","TE"); break;
		case "approve": mailText = Reports.EmployeeName+getSeaPhrase("CARD_JUST_APPROVED","TE"); break;
	}

	var Sender 		= Reports.Email
	var SendingTo 	= Reports.Detail[Index].Email
	var Subject 	= "Time Entry"

	__DetailIndex = Index

	if (typeof(Sender) == "undefined" || Sender == null || !Sender)
	{
		Sender = SendingTo
	}

	if (SendingTo)
	{
		showWaitAlert(getSeaPhrase("SENDING_EMPLOYEE_EMAIL_NOTICE","TE"));
		EmailTimer = setTimeout("cgiEmailDone()", 3000);
		var obj 		= new EMAILObject(SendingTo,Sender);
			obj.subject = Subject;
			obj.message = mailText;
		EMAIL(obj,"jsreturn");
	}
	else
	{
		seaAlert(getSeaPhrase("EMPLOYEE_EMAIL_NOT_AVAILABLE","TE"));
		SummaryUpdate(__DetailIndex);
	}
}

function Unload()
{
	if (typeof(Calendar) != "undefined")
	{
		if (typeof(Calendar.calendarWindow) != "undefined" && !Calendar.calendarWindow.closed)
		{
			Calendar.calendarWindow.close();
		}
	}

	if (typeof(Comments) != "undefined")
	{
		if (typeof(Comments.commentsWindow) != "undefined" && !Comments.commentsWindow.closed)
		{
			Comments.commentsWindow.close();
		}
	}

	if (typeof(TipsWin) != "undefined" && !TipsWin.closed)
	{
		TipsWin.close();
	}
}


///////////////////////////////////////////////////////////////////////////////////////////
//
// Function that is called when the email has successfully been delivered.
//

function cgiEmailDone()
{
	clearTimeout(EmailTimer);
	window.status = getSeaPhrase("EMAIL_SENT","TE");
	SummaryUpdate(__DetailIndex);
}

function OpenHelpDialog()
{
	openHelpDialogWindow("/lawson/xhrnet/timeentry/tips/tips.htm");
}

function checkResolution()
{
	if (screen.width <= "800" && screen.height <= "600")
	{
		if (document.body.clientHeight)
		{
			document.getElementById("paneBorder").style.height = (document.body.clientHeight - 55) + "px";
		}
		window.moveTo(0,0);
		window.resizeTo(screen.width,screen.height);
	}
}

function fitToScreen()
{
	setLayerSizes();
	setDetailFrameSize();

	var winHeight = 520;
	var winWidth = 800;
	var headerHeight = 40;
	var outerPane = self.MAIN.document.getElementById("outerPane");
	var paneBody1 = self.MAIN.document.getElementById("paneBody1");
	var paneBody2 = self.MAIN.document.getElementById("paneBody2");

	// resize the table frame to the screen dimensions
	if (document.body.clientHeight)
	{
		winHeight = document.body.clientHeight;
		winWidth = document.body.clientWidth;
	}
	else if (window.innerHeight)
	{
		winHeight = window.innerHeight;
		winWidth = window.innerWidth;
	}

	var tblFrame = document.getElementById("MAIN");
	tblFrame.style.height = (winHeight - headerHeight) + "px";
	tblFrame.style.width = (winWidth - 20) + "px";

	var paneBorder = document.getElementById("paneBorder");
	paneBorder.style.height = (winHeight - headerHeight) + "px";

	if (outerPane)
	{
		outerPane.setAttribute("styler", "groupbox");
		outerPane.style.width = "100%";
	}

	if (paneBody1 && paneBody2)
	{
		paneBody2.style.overflow = "auto";
		paneBody2.style.width = "100%";

		if (winHeight > (paneBody1.offsetHeight + headerHeight + 32))
		{
			paneBody2.style.height = (winHeight - paneBody1.offsetHeight - headerHeight - 32) + "px";
		}
	}
}

function setDetailFrameSize()
{
	if (navigator.appName.indexOf("Microsoft") >= 0)
	{
		return;
	}

	var frameObj = document.getElementById("DETAIL");
    var frameWidth = 803;
    var frameHeight = 600;

    if (window.innerWidth)
    {
        // non-IE browsers
        frameWidth = window.innerWidth;
        frameHeight = window.innerHeight;
    }
    else if (document && document.documentElement && document.documentElement.clientWidth)
    {
        // IE 6+ in "standards compliant mode"
        frameWidth = document.documentElement.clientWidth;
        frameHeight = document.documentElement.clientHeight;
    }
    else if (document && document.body && document.body.clientWidth)
    {
        // IE 6 in "quirks mode"
		frameWidth = document.body.clientWidth;
		frameHeight = document.body.clientHeight;
    }

    frameObj.style.width = frameWidth;
    frameObj.style.height = frameHeight;
}
</script>
</head>
<body onload="checkResolution();fitToScreen();OpenProgram()" style="background-color:transparent;overflow:hidden" onresize="fitToScreen()" onunload="Unload();">

<iframe id="header" name="header" src="/lawson/xhrnet/ui/header.htm" style="visibility:visible;position:absolute;height:34px;width:803px;left:0px;top:0px" marginwidth="0" marginheight="0" frameborder="no" scrolling="no"></iframe>
<iframe id="DETAIL" name="DETAIL" style="visibility:hidden;position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:999" marginwidth="0" marginheight="0" scrolling="no" frameborder="no" src="/lawson/xhrnet/dot.htm"></iframe>

<div id="paneBorder" class="panebordertimeentry" style="position:absolute;top:34px;left:0px;visibility:hidden;height:560px;overflow:hidden">
	<table id="paneTable" border="0" width="100%" cellpadding="0" cellspacing="0">
	<tr style="height:16px" styler="hidden">
	<td>
		<table border="0" height="100%" width="100%" cellpadding="0" cellspacing="0">
		<tr>
		<td>
			<img id="paneHelpIcon" border="0" class="helpicon" onclick="OpenHelpDialog()" src="/lawson/xhrnet/ui/images/ico_help_6699cc.gif" onmouseover=this.src="/lawson/xhrnet/ui/images/ico_help_6699cc-over.gif" onmousedown=this.src="/lawson/xhrnet/ui/images/ico_help_6699cc-down.gif" onmouseout=this.src="/lawson/xhrnet/ui/images/ico_help_6699cc.gif">
			<div id="paneHeader" class="paneheadertimeentry" width="100%" height="100%">&nbsp;</div>
		</td>
		</tr>
		</table>
	</td>
	</tr>
	<tr><td style="padding-left:5px">
		<table border="0" width="100%" cellpadding="0" cellspacing="0">
		<tr><td>
			<iframe name="MAIN" id="MAIN" src="/lawson/xhrnet/ui/plain.htm" style="visibility:hidden;width:100%;height:500px" allowtransparency="yes" marginwidth="0" marginheight="0" frameborder="0" scrolling="no"></iframe>
		</td></tr>
		</table>
	</td></tr>
	<tr><td>
		<iframe name="jsreturn" src="/lawson/xhrnet/dot.htm" style="visibility:hidden;width:0px;height:0px" marginwidth="0" marginheight="0" frameborder="no" scrolling="no"></iframe>
		<iframe name="lawheader" src="/lawson/xhrnet/timeentry/manager/managerlaw.htm" style="visibility:hidden;width:0px;height:0px" marginwidth="0" marginheight="0" frameborder="no" scrolling="no"></iframe>
		<iframe name="printFm" src="/lawson/xhrnet/ui/plain.htm" style="visibility:visible;position:relative;top:0px;left:0px;width:1px;height:1px" marginwidth="0" marginheight="0" frameborder="no" scrolling="no"></iframe>
		<iframe name="PGCONTROL" src="/lawson/xhrnet/dot.htm" style="visibility:hidden;width:0px;height:0px" marginwidth="0" marginheight="0" frameborder="no" scrolling="no"></iframe>
	</td></tr>
	</table>
</div>
</body>
</html>
<!-- Version: 8-)@(#)@(201111) 09.00.01.06.09 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/timeentry/manager/summaryapproval.htm,v 1.16.2.47.4.1 2012/02/28 10:43:20 juanms Exp $ -->
