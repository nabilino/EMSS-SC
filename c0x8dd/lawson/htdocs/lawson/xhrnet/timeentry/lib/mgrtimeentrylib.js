// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/timeentry/lib/Attic/mgrtimeentrylib.js,v 1.1.2.55 2014/02/24 22:02:31 brentd Exp $
//***************************************************************
//*                                                             *
//*                           NOTICE                            *
//*                                                             *
//*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//*                                                             *
//*   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************
/*
 *		Common Objects
 */
function PlanCodeObject(company, employee)
{
	this.Company = company;
	this.Employee = employee;
	this.NumberOfPlans = null;
	this.Detail = new Array(0);
}

function PlanCodeDetailObject(code, description)
{
	this.PlanCode = code;
	this.Description = description;
}

function ReportsObject(company, employee)
{
	this.Company = company;
	this.Employee = employee;
	this.EmployeeName = null;
	this.PlanCode = null;
	this.PeriodStart = null;
	this.PeriodEnd = null;
	this.View = null;
	this.PlanCodeDescription = null;
	this.Email = null;
	this.EmailPersonal = null;
	this.LastHsuCode = null;
	this.LastLastName = null;
	this.LastFirstName = null;
	this.LastMiddleInit = null;
	this.LastEmployee = null;
	this.LastStartDate = null;
	this.Detail = new Array(0);
}

function ReportsDetailObject(employee)
{
	this.Employee = employee;
	this.TimecardType = null;
	this.TimecardTypeDesc = null;
	this.PlanCode = null;
	this.CommentsExist = null
	this.FullName = null;
	this.TotalHours = null;
	this.Status = null;
	this.Email = null;
	this.EmailPersonal = null;
	this.DatesExist = null;
	this.PeriodStartsAt = null;
	this.PeriodStopsAt = null;
	this.PlanCode = null;
	this.PlanCodeDescription = null;
	this.FullName = null;	
}

/*
 *		Common Functions
 */
var boolSaveChanges = false;	//whether or not changes have been made to the form
var messageDialog;

function GetTimeCardView(iView)
{
	if (IgnorePeriodOutOfRangeAndLockOut)
	{
		LockedOut = false;
		Reports.View = 4;
		return;
	}
	if (iView == 2)
		LockedOut = true;
	else
		LockedOut = false;
}

function PaintHeaders()
{
	try
	{
		self.MAIN.document.getElementById("paneBody1").innerHTML = "";
	}
	catch(e)
	{
		setTimeout(function() { PaintHeaders.apply(this, arguments); }, 5);
		return;
	}
	if ((typeof(Reports.PeriodStart) == "undefined" || Reports.PeriodStart == null || Reports.PeriodStart == "") && (Reports.Detail.length > 0))
		Reports.PeriodStart = Reports.Detail[0].PeriodStartsAt;
	if ((typeof(Reports.PeriodEnd) == "undefined" || Reports.PeriodEnd == null || Reports.PeriodEnd == "") && (Reports.Detail.length > 0))
		Reports.PeriodEnd = Reports.Detail[0].PeriodStopsAt;
	var CalendarStartDate = FormatDte4(Reports.PeriodStart);
	var toolTip;
	var html = '<div style="text-align:center;width:100%">'
	html += '<table border="0" cellpadding="0" cellspacing="0" style="width:100%" role="presentation"><tr><td style="text-align:center;width:100%">'
	html += '<table border="0" cellpadding="0" cellspacing="0" style="width:auto;margin-left:auto;margin-right:auto" role="presentation">'
	html += '<tr><td class="fieldlabelbold">'+getSeaPhrase("PAY_PLAN","TE")+'</td><td class="fieldlabel">'+Reports.PlanCodeDescription+'</td>'
	html += '</tr></table></td>'
	if (arguments.length == 0)
	{
		toolTip = getSeaPhrase("OPEN_LEAVE_BALANCE_WIN","TE")+' - '+getSeaPhrase("OPEN_LINK_TO","SEA");
		html += '<td class="plaintablecellright"><a href="javascript:;" onclick="parent.OpenTimeOff_Period();return false" title="'+toolTip+'">'+getSeaPhrase("OPEN_LEAVE_BALANCE_WIN","TE")+'</a></td>'
	}	
	html += '</tr></table>'
	toolTip = getSeaPhrase("TO_PRE_PERIOD","TE");	
	html += '<table cellspacing="0" cellpadding="0" border="0" style="width:auto;margin-left:auto;margin-right:auto" role="presentation">'
	html += '<tr><td style="vertical-align:middle;width:25px">'
	html += '<a href="javascript:;" onclick="parent.PreviousPeriod_Summary();return false;" onmouseover="parent.MAIN.document.getElementById(\'previous\').src=\''+PreviousIconOver+'\';return true;" onfocus="parent.MAIN.document.getElementById(\'previous\').src=\''+PreviousIconOver+'\';return true;" '
	html += 'onmouseout="parent.MAIN.document.getElementById(\'previous\').src=\''+PreviousIcon+'\';return true;" onblur="parent.MAIN.document.getElementById(\'previous\').src=\''+PreviousIcon+'\';return true;" title="'+toolTip+'" aria-label="'+toolTip+'">'
	html += '<img styler="prevcalendararrow" id="previous" name="previous" src="'+PreviousIcon+'" alt="'+toolTip+'" title="'+toolTip+'" border="0"></a>'
	html += '</td><td style="text-align:center;vertical-align:middle" class="plaintablecellbold" nowrap>'+dteDay(Reports.PeriodStart)+', '+FormatDte3(Reports.PeriodStart)+'</td>'
	html += '<td style="text-align:center;vertical-align:middle" class="plaintablecellbold" nowrap> - </td>'
	html += '<td style="text-align:center;vertical-align:middle" class="plaintablecellbold" nowrap>'+dteDay(Reports.PeriodEnd)+', '+FormatDte3(Reports.PeriodEnd)+'</td>'
	toolTip = getSeaPhrase("TO_NEXT_PERIOD","TE");
	html += '<td style="vertical-align:middle;width:25px"><a href="javascript:;" onclick="parent.NextPeriod_Summary();return false;" onmouseover="parent.MAIN.document.getElementById(\'next\').src=\''+NextIconOver+'\';return true;" onfocus="parent.MAIN.document.getElementById(\'next\').src=\''+NextIconOver+'\';return true;" '
	html += 'onmouseout="parent.MAIN.document.getElementById(\'next\').src=\''+NextIcon+'\';return true;" onblur="parent.MAIN.document.getElementById(\'next\').src=\''+NextIcon+'\';return true;" title="'+toolTip+'" aria-label="'+toolTip+'">'
	html += '<img styler="nextcalendararrow" id="next" name="next" src="'+NextIcon+'" alt="'+toolTip+'" title="'+toolTip+'" border="0"></a>'
	html += '</td><td style="vertical-align:middle" nowrap><label class="offscreen" id="navDateLbl" for="navDate">'+getSeaPhrase("DATE","TE")+'</label>'	
	html += '&nbsp;<input onchange="parent.date_fld_name=\'5\';parent.ReturnDate(this.value)" styler="calendar" class="inputbox" onkeydown="this.value=this.getAttribute(\'start_date\')" onkeyup="this.value=this.getAttribute(\'start_date\')" type="text" id="navDate" name="navDate" size="10" maxlength="10" '
	html += 'start_date="'+CalendarStartDate+'" value="'+CalendarStartDate+'" aria-labelledby="navDateLbl navDateFmt"/>'	
	toolTip = getSeaPhrase("TO_PERIOD_BY_DATE","TE");
	html += '<a styler="hidden" href="javascript:;" onclick="parent.HeaderCalendar_Summary(window,this,event);return false" for="navDate" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'
	html += uiDateFormatSpan("navDateFmt")+'</td></tr></table>'
	html += '<table style="width:auto;margin-left:auto;margin-right:auto" cellspacing="0" cellpadding="0" border="0" role="presentation">'
	html += '<td style="text-align:center" class="plaintablecellbold">'
	switch (parseInt(Reports.View,10))
	{
		case 1: html += getSeaPhrase("INVALID_PERIOD","TE"); break;
		case 2: html += getSeaPhrase("TE_LOCKED","TE"); break;
		case 3: html += getSeaPhrase("OLD_PERIOD","TE"); break;
	}
	html += '</td></tr></table></div>'
	self.MAIN.document.getElementById("paneBody1").innerHTML = html;
}

function GetButtonFrameInformation(View)
{
	var arg = '<form name="frmButtonFrame" onsubmit="return false;">'
	+ '<table border="0" cellpadding="0" cellspacing="0" style="width:100%" role="presentation"><tr>'
	+ '<td style="vertical-align:middle;text-align:center">';
	if (View == 4 && DropDownAvailable())
		arg += uiButton(getSeaPhrase("UPDATE_CARD","TE"),"parent.fncSaveChanges='';parent.StartSummaryUpdate();return false","margin-left:5px;margin-top:10px");
	if (AreAnySubmitted() && View == 4)
		arg += uiButton(getSeaPhrase("APPROVE_ALL_SUBMITTED","TE"),"parent.ApproveAll();return false","margin-left:5px;margin-top:10px");
	arg += uiButton(getSeaPhrase("CLOSE_TE","TE"),"parent.SummaryApprovalDone('"+View+"');return false","margin-left:5px;margin-top:10px");	
	if (parent.program && parent.program == "summary" && (!parent.PlanCodes || parent.PlanCodes.Detail.length <= 1))
	{
		// do not display the "Return to List" button in Summary Approval if there is not more than one pay plan available
	}
	else
		arg += uiButton(getSeaPhrase("RETURN_LIST","TE"),"parent.BackToPayPlanList('"+View+"');return false","margin-left:5px;margin-top:10px");
	arg += '</td></table></form>';
	return arg;
}

function DropDownAvailable()
{
	for (var i=0; i<Reports.Detail.length; i++)
	{
		if (Reports.Detail[i].Status >= 1)
			return true;
	}
	return false;
}

function AreAnySubmitted()
{
	for (var i=0; i<Reports.Detail.length; i++)
	{
		if (Reports.Detail[i].Status >= 1 && Reports.Detail[i].Status <= 4)
			return true;
	}
	return false;
}

function ApproveAll()
{
	stopProcessing();
	if (seaConfirm(getSeaPhrase("CONTINUE_SUBMITTED_AS_APPROVED","TE"), "", handleApproveAllResponse))
		DoApproveAll();
}

// Firefox will call this function
function handleApproveAllResponse(confirmWin)
{
	if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
		DoApproveAll();
}

function DoApproveAll()
{
	var statusForm = self.MAIN.document.forms["frmStatus"];
	var statusDropDown;
	for (var i=0; i<Reports.Detail.length; i++)
	{
		if (Reports.Detail[i].Status == 1)
		{
			statusDropDown = statusForm.elements["cmbStatus" + i];
			statusDropDown.selectedIndex = 1;
			self.MAIN.styleElement(statusDropDown);
		}
	}
	StartSummaryUpdate();
}

function FormatHours(Qty,size)
{
	var strQty = String(Qty);
	var leadingSign='',trailingSign='',returnVal='';

	if (strQty.charAt(0)=='-' || strQty.charAt(0)=='+')
	{
		leadingSign = strQty.substring(0,1);
		strQty = strQty.substring(1,strQty.length);
		strQty = leadingSign + strQty;
	}
	else if (strQty.charAt(strQty.length-1)=='-' || strQty.charAt(strQty.length-1)=='+')
	{
		trailingSign = strQty.substring(strQty.length-1,strQty.length);
		strQty = strQty.substring(0,strQty.length-1);
		// PT 128693
		strQty = trailingSign + strQty;
	}
	var Newsize = size / 10;
	if (Newsize < 0)
	{
		if (strQty.indexOf(".") == -1)
			returnVal = roundToDecimal((Number(strQty) / 100), size);
		else
			returnVal = roundToDecimal(Number(strQty), size);
	}
	else
	{
		var size = parseInt((Newsize - Math.floor(size/10)) * 10);
		if (strQty.indexOf(".") == -1)
			strQty = (Number(strQty) / 100);
		else
			strQty = Number(strQty);
		returnVal = roundToDecimal(strQty, size);
	}
	if (returnVal == "" && size > 0)
	{
		returnVal = "0."; 
		for (var i=0; i<size; i++)
			returnVal += "0";
	}
	return returnVal;
}

function CommentIconMouseOver(flag, i)
{	
	var frName;
	if (i == '')
		frName = "COMMENTS";
	else
		frName = "MAIN";
	var iconElm = window[frName].document.getElementById("comment"+i);
	if (flag)
	{
		if (iconElm.src.indexOf(ExistingCommentsIcon) >= 0)
			iconElm.src = ExistingCommentsOverIcon;
		else
			iconElm.src = NoCommentsOverIcon;
	}
	else
	{
		if (iconElm.src.indexOf(ExistingCommentsOverIcon) >= 0)
			iconElm.src = ExistingCommentsIcon;
		else
			iconElm.src = NoCommentsIcon;
	}
}

function DoesObjectExist(pObj)
{
	try
	{
		if (typeof(pObj) == "undefined" || typeof(pObj) == "unknown" || pObj == null || typeof(pObj) == "null")
			return false;
		else
			return true;
	}
	catch(e)
	{
		return false;
	}	
}

//****************************************************************************************
//Choose date and recall HS36 with new date. This will start over time entry with a new
//date range.
//****************************************************************************************
function DropDownCalendar(wnd, elm, evt)
{
	wnd = wnd || window;
	evt = evt || wnd.event || null;
	if (!elm)
		return;	
	// NOTE: You must have Calendar.js and Sizer.js loaded from webappjs
	if (typeof(wnd["CalendarObject"]) != "function" && typeof(wnd["CalendarObject"]) != "object")
	{
		alert("Error: Cannot initialize CalendarObject. \n\nStylerEMSS.selectStyleSheet \nStylerEMSS.js");
		return;
	}	            			
	// NOTE: You must have a variable called "calObj" declared as a CalendarObject() from webappjs
	if (typeof(wnd.calObj) == "undefined" || wnd.calObj == null)
	{
		wnd.calObj = new wnd.CalendarObject(wnd,  wnd.CalendarObject.MMDDYY, "/", null);                                            
		wnd.calObj.styler = StylerEMSS._singleton;
		wnd.calObj.openDirection = wnd.CalendarObject.OPEN_LEFT_DOWN;
		if (wnd.userWnd && wnd.userWnd.authUser.calendar_type)
			wnd.calObj.setType(wnd.userWnd.authUser.calendar_type);
	}
	if (elm.nodeName.toLowerCase() != "input")
	{	
		while (elm && elm.parentNode && elm.parentNode != elm && elm.nodeName.toLowerCase() != "a")
			elm = elm.parentNode;
	}							
	var inputFld = (elm && elm.nodeName.toLowerCase() == "a") ? wnd.document.getElementById(elm.getAttribute("for")) : null;
	if (inputFld && typeof(wnd["PositionObject"]) != "undefined")
	{			
		var inputFldPos = wnd.PositionObject.getInstance(inputFld);			
		var rightPos = inputFldPos.left + 200;							
		var windowWidth = 1024;
		var windowHeight = 768;
		if (wnd.innerWidth)
		{ 
			// non-IE browsers
			windowWidth = wnd.innerWidth;
			windowHeight = wnd.innerHeight;
		}
		else if (wnd.document && wnd.document.documentElement && wnd.document.documentElement.clientWidth)
		{
			// IE 6+ in "standards compliant mode"
			windowWidth = wnd.document.documentElement.clientWidth;
			windowHeight = wnd.document.documentElement.clientHeight;
		}
		else if (wnd.document && wnd.document.body && wnd.document.body.clientWidth)
		{
			// IE 6 in "quirks mode"
			windowWidth = wnd.document.body.clientWidth;
			windowHeight = wnd.document.body.clientHeight;
		}
		var topSpace = inputFldPos.thetop;
		var bottomSpace = windowHeight - (topSpace + inputFldPos.height);
		if (rightPos > windowWidth)
			wnd.calObj.openDirection = (bottomSpace >= 160 || bottomSpace > topSpace) ? wnd.CalendarObject.OPEN_RIGHT_DOWN : wnd.CalendarObject.OPEN_RIGHT_UP;
		else
			wnd.calObj.openDirection = (bottomSpace >= 160 || bottomSpace > topSpace) ? wnd.CalendarObject.OPEN_LEFT_DOWN : wnd.CalendarObject.OPEN_LEFT_UP;
	}
	wnd.calObj.openCalendar(elm, evt);
}

/*
 *		Comments Functions
 */
var Comments;
var ToggleSwitch = false;
var DeleteFlag = false;
var CommentsUpdateFlag = false;
var CommentsCloseFlag = false;

/**********************************************************************************************
 Comment object which handles all of the functionality of this window.
**********************************************************************************************/
function CommentsObject()
{
	this.Date = null;
	this.Employee = null;
	this.Text = null;
	this.SequenceNumber = null;
	this.UserId = null;
	this.ProxyId = null;
	this.Event = "ADD";
	this.commentsWindow = null;
}

/**********************************************************************************************
 Locate the center of the parent window.
**********************************************************************************************/
function FindCenterforCommentsWindow()
{
	var retval = new Object();
	retval.X = (screen.width/2) - 275;
	retval.Y = (screen.height/2) - 175;
	return retval;
}

/**********************************************************************************************
 Will open the comments window and assign the handle to the Comments Object.
**********************************************************************************************/
function OpenComments(Date, Employee)
{
	if (styler && (styler.showLDS || styler.showInfor || styler.showInfor3) && typeof(window["DialogObject"]) == "function")
		Comments = new CommentsObject();
	else
	{
		var SSLLoc = "/lawson/xhrnet/ui/windowplain.htm?func=opener.CommentsLoaded()";
		if (typeof(authUser.prodline) == "unknown")
		{
			authenticate("frameNm='jsreturn'|funcNm='OpenComments(\""+Date+"\",\""+Employee+"\")'|sysenv=true|desiredEdit='EM'");
			return;
		}
		WIND = FindCenterforCommentsWindow();
		try
		{
			if (typeof(Comments)=='undefined' || typeof((Comments.commentsWindow)=='undefined' || !Comments.commentsWindow) || Comments.commentsWindow.closed)
			{
				Comments = new CommentsObject();
				Comments.commentsWindow = window.open(SSLLoc,"Comments","left="+WIND.X+",top="+WIND.Y+",toolbar=no,resizable=yes,status=no,height=350,width=550");
			}
			else
				Comments.commentsWindow.focus();
		}
		catch(e)
		{
			Comments = new CommentsObject();
			Comments.commentsWindow = window.open(SSLLoc,"Comments","left="+WIND.X+",top="+WIND.Y+",toolbar=no,resizable=yes,status=no,height=350,width=550");
			try { Comments.commentsWindow.focus(); } catch(e) {}
		}
	}
	Comments.Date = Date;
	Comments.Employee = Employee;
	GetEmpComment();
}

/**********************************************************************************************
 DME call to grab all the comments related to the date in question. This DME will only return
 the comments that are assigned to the date given in Comments.Date.
**********************************************************************************************/
function GetEmpComment()
{
	var object = new DMEObject(authUser.prodline,"EMPCOMMENT");
	object.out = "JAVASCRIPT";
	object.index = "ecmset1";
	object.field = "employee;ln-nbr;seq-nbr;cmt-text;date;user-id;proxy-id";
	object.key = parseFloat(authUser.company)+"="+parseFloat(Comments.Employee)+"=TR="+Comments.Date;
	object.max = "600";
	object.debug = false;
	object.sortasc = "ln-nbr";
	object.func = "DspEmpComments()";
	DME(object,"jsreturn");
}

/**********************************************************************************************
 Parse through any information returned from the DME. Recall the DME function if more than
 300 records are returned. If not paint the window with the information provided in the
 Comments object.
**********************************************************************************************/
function DspEmpComments()
{
	Comments.Text = "";
	var obj;
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		obj = self.jsreturn.record[i];
		Comments.Text += obj.cmt_text;
		Comments.SequenceNumber	= parseFloat(obj.ln_nbr);
		Comments.UserId	= obj.user_id;
		Comments.ProxyId = obj.proxy_id;
	}
	if (self.jsreturn.NbrRecs > 0)
		Comments.Event = "CHANGE";
	if (self.jsreturn.Next != '')
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		WriteComments();
}

/**********************************************************************************************
 Handles the date returned from the calendar, assigns this date to the object and recalls the
 DME function.
**********************************************************************************************/
function ReturnCommentsDate(Date)
{
	if (getDteDifference(Date,Comments.Date) == 0)
	{
		stopProcessing();
		seaAlert(getSeaPhrase("COMMENTS_LOADED_FOR_DAY","TE"), null, null, "alert");
		try { Comments.commentsWindow.focus(); } catch(e) {};
		return;
	}
	Comments.Date = Date;
	startProcessing(getSeaPhrase("MOVING_TO_NEW_DATE","TE"), function(){GetEmpComment(true);});
}

/**********************************************************************************************
 Will open the calendar window for the user to select a new date.
**********************************************************************************************/
function MoveToNewDateForComments()
{
	date_fld_name = "2";
	DropDownCalendar(wnd, elm, evt);
}

/**********************************************************************************************
 Paints the comments window. Quickpaint will only repaint the header as the date is a label
 field and cannot be changed by itself. The form elements will be changed by their object
 values and do not have to be repainted.
**********************************************************************************************/
function WriteComments()
{
	var toolTip;
	var html = '';
	date_fld_name = "2";
	if (styler && (styler.showLDS || styler.showInfor || styler.showInfor3) && typeof(window["DialogObject"]) == "function")
	{		
		messageDialog = new window.DialogObject("/lawson/webappjs/", null, styler, true);
		messageDialog.pinned = true;
		messageDialog.getPhrase = function(phrase)
		{
			if (!phrase || (phrase.indexOf("<") != -1 && phrase.indexOf(">") != -1))
				return phrase;
			if (!userWnd && typeof(window["findAuthWnd"]) == "function")
				userWnd = findAuthWnd(true);
	        if (userWnd && userWnd.getSeaPhrase)
	        {
				var retStr = userWnd.getSeaPhrase(phrase.toUpperCase(), "TE");
				return (retStr != "") ? retStr : phrase;
			}
			else
			    return phrase;         
		}
		messageDialog.doReturn = function(wnd)
		{
			wnd = wnd || window;
			Comments.commentsWindow = wnd;
			if (this.styler == null || !this.styler.showInfor3)
			{			
				Comments.commentsWindow.seaAlert = wnd.parent.seaConfirm;
				Comments.commentsWindow.seaConfirm = wnd.parent.seaConfirm;
			}	
		}
		messageDialog.initDialog = function(wnd)
		{
			wnd = wnd || window;
			var clearFunc = function()
			{
				wnd.document.forms["myComments"].elements["comments"].value = '';
			}			
			if (this.styler != null && this.styler.showInfor3)
			{
				Comments.commentsWindow = wnd;
				this.setButtons([
				     {id: "yes", name: "yes", text: this.getPhrase("UPDATE"), click: null},
				     {id: "no", name: "no", text: this.getPhrase("DELETE"), click: null},
				     {id: "clear", name: "clear", text: this.getPhrase("CLEAR"), click: clearFunc},
				     {id: "cancel", name: "cancel", text: this.getPhrase("DONE"), click: null}				
				]);
			}	
			else
			{	
				var btnClear = this.addButton("btnClear", "clear", "CLEAR", wnd, clearFunc);
				this.translateButton("btnClear", "CLEAR", wnd);
				wnd.accessKeyToBtn = new Array();
			}
		}		
		messageDialog.styleDialog = function(wnd)
		{		
			wnd = wnd || window;
			if (this.styler == null)
			{
				this.styler = new wnd.StylerBase();
				this.styler.showLDS = styler.showLDS;
				this.styler.showInfor = styler.showInfor;
				this.styler.showInfor3 = styler.showInfor3;
				if (this.pinned && typeof(parent["SSORequest"]) != "undefined")
					this.styler.httpRequest = parent.SSORequest;
				else if (typeof(wnd["SSORequest"]) != "undefined")
					this.styler.httpRequest = wnd.SSORequest;	
			}
			wnd.styler = this.styler;
			wnd.StylerBase = wnd.stylerWnd.StylerBase;
			wnd.StylerEMSS = wnd.stylerWnd.StylerEMSS;
			wnd.StylerBase.webappjsURL = "/lawson/webappjs";			
			wnd.styler.loadJsFile(wnd, "Sizer", wnd.StylerBase.webappjsURL + "/javascript/objects/Sizer.js");
			wnd.styler.loadJsFile(wnd, "Calendar", wnd.StylerBase.webappjsURL + "/javascript/objects/Calendar.js");
			if (typeof(wnd.calObj) == "undefined" || wnd.calObj == null)
			{
				wnd.userWnd = wnd.stylerWnd.userWnd;
				wnd.StylerEMSS.initCalendarControl(wnd);
				wnd.calObj.styler = wnd.styler;
				wnd.calObj.openDirection = wnd.CalendarObject.OPEN_LEFT_DOWN;
			}
			// if showInfor3, the dialog is in the main window, which should already have the CSS loaded 
			if (wnd.styler.showInfor)
			{
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/base/inforHidden.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/base/inforTextArea.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/base/inforTextbox.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/base/inforDatePicker.css");			
			}
			else if (wnd.styler.showLDS)
			{
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/lds/css/base/hiddenElement.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/lds/css/base/textAreaElement.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/lds/css/base/textbox.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/lds/css/base/inputCalendarElement.css");
			}
			if ((wnd.styler.showInfor || wnd.styler.showInfor3) && wnd.styler.textDir == "rtl") 
			{
				var htmlObjs = wnd.styler.getLikeElements(wnd, "html");
				for (var i=0; i<htmlObjs.length; i++)
				    htmlObjs[i].setAttribute("dir", wnd.styler.textDir);
				var subDir = (wnd.styler.showInfor3) ? "/infor3" : "/infor";
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + subDir + "/css/base/inforRTL.css");				
			}							
			wnd.styler.modifyDOM(wnd);	
		}		
		messageDialog.translationAry = new Array();
		messageDialog.translationAry["btnYes"] = "UPDATE";
		messageDialog.translationAry["btnNo"] = "DELETE";
		messageDialog.translationAry["btnClear"] = "CLEAR";
		messageDialog.translationAry["btnCancel"] = "DONE";
		messageDialog.translateButton = function(btn, phrase, wnd)
		{	
			wnd = wnd || window;
		    if (typeof(btn) == "string")
		    {	
		    	if (typeof(this.translationAry) != "undefined" && this.translationAry)
		    		phrase = this.translationAry[btn];
		        btn = wnd.document.getElementById(btn);		        
		    }
		    else if (typeof(btn) == "object")
		    {
		    	if (typeof(this.translationAry) != "undefined" && this.translationAry)
		    		phrase = this.translationAry[btn.getAttribute("id")];	    	
		    }
		    if (!btn || !phrase)	
		        return;
		    btn.value = this.getPhrase(phrase);
		    if (btn.innerText != null)	
		        btn.innerText = btn.value;
		    else if (btn.textContent != null)
		        btn.textContent = btn.value;
		    else
		    	btn.innerHTML = btn.value;
		}
	}
	else
	{
		if (!Comments || !Comments.commentsWindow || !Comments.commentsWindow.document || !Comments.commentsWindow.document.body || !Comments.commentsWindow.document.getElementById("paneBody1"))
		{
			setTimeout('WriteComments()',5);
			return;
		}		
	}
	stopProcessing();
	if (ToggleSwitch)
	{
		ToggleSwitch = false;
		if (DeleteFlag)
			ToggleCommentSwitch("Deleting", Comments.Date);
		else
			ToggleCommentSwitch("Adding", Comments.Date);
	}
	if (styler && (styler.showLDS || styler.showInfor || styler.showInfor3) && typeof(window["DialogObject"]) == "function")
	{	
		var dateFunc = (styler.showInfor3) ? "ReturnDate(this.value)" : "parent.ReturnDate(this.value)";
		var selDateFunc = (styler.showInfor3) ? "MoveToNewDateForComments(window,this,event)" : "parent.MoveToNewDateForComments(window,this,event)";
		html = '<div class="panewrapper" style="padding:5px;padding-bottom:15px;text-align:center">'+
		'<form name="myComments" onsubmit="return false;">'+
		'<table border="0" cellspacing="0" cellpadding="0" align="center" style="text-align:center;width:auto" role="presentation">'
		toolTip = getSeaPhrase("OPEN_COMMENTS_FOR_DATE","TE");
		html += '<tr><td class="fieldlabelbold"><label id="navDateLbl" for="navDate">'+getSeaPhrase("DATE","TE")+'</label></td><td class="plaintablecell">'+
		'<input onchange="'+dateFunc+'" styler="calendar" class="inputbox" onkeydown="this.value=this.getAttribute(\'start_date\')" onkeyup="this.value=this.getAttribute(\'start_date\')" type="text" id="navDate" name="navDate" size="10" maxlength="10" start_date="'+FormatDte4(Comments.Date)+'" value="'+FormatDte4(Comments.Date)+'" aria-labelledby="navDateLbl navDateFmt"/>'+
		'<a styler="hidden" href="javascript:;" onclick="'+selDateFunc+';return false;" for="navDate" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan("navDateFmt")+'</td></tr>'+
		'<tr><td class="fieldlabelbold"><label for="comments">'+getSeaPhrase("COMMENTS","TE")+'</label></td><td class="plaintablecell">'+
		'<textarea class="inputbox" style="width:350px;height:150px" cols="60" rows="11" id="comments" name="comments" wrap="virtual" styler="textarea">'+Comments.Text+'</textarea>'+
		'</td></tr></table></form></div>'
		var msgReturn = messageDialog.messageBox(html, "yesnocancel", "none", window, false, "", CommentsActionTaken, null, false);
		if (typeof(msgReturn) == "undefined")
			return;
		CommentsActionTaken(msgReturn);
	}
	else
	{
		Comments.commentsWindow.document.getElementById("paneBody1").style.visibility = "hidden";
		html = '<div style="padding:5px;width:100%;height:100%;text-align:center"><div styler="groupbox">'+
		'<form name="myComments" onsubmit="return false;">'+
		'<table border="0" cellspacing="0" cellpadding="0" align="center" style="text-align:center;width:auto" role="presentation">'
		toolTip = getSeaPhrase("OPEN_COMMENTS_FOR_DATE","TE");
		html += '<tr><td class="fieldlabelbold"><label id="navDateLbl" for="navDate">'+getSeaPhrase("DATE","TE")+'</label></td><td style="text-align:center" class="plaintablecell">'+
		'<input onchange="parent.opener.ReturnDate(this.value)" styler="calendar" class="inputbox" onkeydown="this.value=this.getAttribute(\'start_date\')" onkeyup="this.value=this.getAttribute(\'start_date\')" type="text" id="navDate" name="navDate" size="10" maxlength="10" start_date="'+FormatDte4(Comments.Date)+'" value="'+FormatDte4(Comments.Date)+'" aria-labelledby="navDateLbl navDateFmt"/>'+
		'<a styler="hidden" href="javascript:;" onclick="opener.MoveToNewDateForComments(window,this,event);return false;" for="navDate" title="'+toolTip+'" aria-label="'+toolTip+'">'+
		uiCalendarIcon()+'</a>'+uiDateFormatSpan("navDateFmt")+'</td></tr>'+
		'<tr><td class="fieldlabelbold"><label for="comments">'+getSeaPhrase("COMMENTS","TE")+'</label></td><td class="plaintablecell">'+
		'<textarea class="inputbox" style="width:350px;height:150px" cols="60" rows="11" name="comments" wrap="virtual" styler="textarea">'+Comments.Text+'</textarea>'+
		'</td></tr></table></form>'+
		'<div style="text-align:center"><table border="0" cellspacing="0" cellpadding="0" align="center" style="text-align:center;width:auto" role="presentation"><tr><td style="white-space:nowrap">'+
		uiButton(getSeaPhrase("UPDATE","TE"), "parent.opener.UpdateComments();return false", null, null, 'aria-haspopup="true"');
		if (Comments.Text != "")
			html += uiButton(getSeaPhrase("DELETE","TE"), "parent.opener.DeleteComment();return false","margin-left:5px");
		else
			html += uiButton(getSeaPhrase("CLEAR","TE"), "parent.document.forms['myComments'].elements['comments'].value='';return false","margin-left:5px");
		html += uiButton(getSeaPhrase("DONE","TE"), "parent.opener.CloseCommentsWindow();return false","margin-left:5px")+
		'</td></tr></table></div></div></div>';
		Comments.commentsWindow.document.getElementById("paneBody1").innerHTML = html;	
		Comments.commentsWindow.stylePage(true, getSeaPhrase("COMMENTS","TE"));
		setWinTitle(getSeaPhrase("COMMENTS","TE"), Comments.commentsWindow);
		Comments.commentsWindow.document.getElementById("paneBody1").style.visibility = "visible";
		setTimeout("CommentsLoaded()",1000);
	}
}

function CommentsActionTaken(msgWin)
{
	switch (msgWin.returnValue)
	{
		case "yes": //update
			UpdateComments();
			break;
		case "no": //delete
			DeleteComment();
			break;
		case "cancel": //cancel
		case "close":
			break;	
	}
}

/**********************************************************************************************
 Event function to be called when the comments content has fulled loaded into the window.
**********************************************************************************************/
function CommentsLoaded()
{
	// if the user clicked the "Done" button prior to the update completing, close the comments window.
	if (CommentsUpdateFlag)
	{
		CommentsUpdateFlag = false; // make sure the update flag is turned off
		if (CommentsCloseFlag)
			CloseCommentsWindow();
	}
}

/**********************************************************************************************
 If the user has clicked the DONE button then this function is called. Close the comments
 window and call the CommentsWindow_Closed() function which is defined elsewhere in the program
 for performing any logical check after this window has closed.
**********************************************************************************************/
function CloseCommentsWindow()
{
	// if the user clicks on the "Done" button while a comments update is still occurring,
	// do not close the window until the update has fully completed.
	if (CommentsUpdateFlag)
		CommentsCloseFlag = true;
	else
	{
		CommentsWindow_Closed();
		try { Comments.commentsWindow.close(); } catch(e) {}
	}
}

/**********************************************************************************************
 Prompt user to make sure they want to delete a comment.
**********************************************************************************************/
function DeleteComment()
{
	stopProcessing();
	if (seaConfirm(getSeaPhrase("DELETE_COMMENTS?","TE"), "", ConfirmDeleteComment))
		startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), function(){Delete_Comments("true");});
}

function ConfirmDeleteComment(confirmWin)
{
	if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
		startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), function(){Delete_Comments("true");});
	try { Comments.commentsWindow.focus(); } catch(e) {}	
}

/**********************************************************************************************
 Clear out the textarea.
**********************************************************************************************/
function ClearComment()
{
	Comments.commentsWindow.document.forms["myComments"].elements["comments"].value = "";
}

/**********************************************************************************************
 Update the comments by deleting the comments first then readding the new comments stored in the textarea.
**********************************************************************************************/
function UpdateComments()
{
	if (NonSpace(Comments.commentsWindow.document.forms["myComments"].elements["comments"].value) == 0)
	{
		stopProcessing();
		if (styler && (styler.showLDS || styler.showInfor || styler.showInfor3) && typeof(window["DialogObject"]) == "function")
		{
			var alertResponse = seaAlert(getSeaPhrase("UPDATE_COMMENTS","TE"), "", null, "error", WriteComments);
			if (typeof(alertResponse) == "undefined" || alertResponse == null)
			{	
				if (seaAlert == window.alert)
					WriteComments();
				return;
			}
			WriteComments();			
		}
		else
		{
			Comments.commentsWindow.seaAlert(getSeaPhrase("UPDATE_COMMENTS","TE"), "", null, "error");			
			Comments.commentsWindow.document.forms["myComments"].elements["comments"].focus();
		}
		return;
  	}
	CommentsUpdateFlag = true;
	var nextFunc = function()
	{
		if (Comments.Text != "")
		{
			if (Comments.commentsWindow.document.forms["myComments"].elements["comments"].value == "")
				Delete_Comments("true");
			else
				Delete_Comments("false");
		}
		else
			Add_Comments();
	};
	startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

/**********************************************************************************************
 AGS call to delete the comments. ES01 works where all the information it needs are the key
 fields plus the date to delete. It will delete all records related to this date.
**********************************************************************************************/
function Delete_Comments(flag)
{
	var object = new AGSObject(authUser.prodline,"ES01.1");
	object.event = "CHANGE";
	object.rtn = "MESSAGE";
	object.longNames = true;
	object.lfn = "ALL";
	object.tds = false;
	object.field = "FC=D"
	+ "&ECM-COMPANY="+parseFloat(authUser.company)
	+ "&ECM-EMPLOYEE="+parseFloat(Comments.Employee)
	+ "&ECM-CMT-TYPE=TR"
	+ "&ECM-DATE="+Comments.Date;
	object.func = "parent.RecordsDeleted_Comments('"+flag+"')";
	object.debug = false;
	AGS(object,"jsreturn");
}

/**********************************************************************************************
 Check for any error messages from AGS. If we are adding comments then call the add comments
 function. If not, toggle the comments icon pointing to this date to clear and recall the
 DME function to reset the window.
**********************************************************************************************/
function RecordsDeleted_Comments(flag)
{
	DeleteFlag = false;
	if (self.lawheader.gmsgnbr == "000")
	{
		if (eval(flag))
		{
			ToggleSwitch = true;
			DeleteFlag = true;		
			if (styler && (styler.showLDS || styler.showInfor || styler.showInfor3) && typeof(window["DialogObject"]) == "function")
			{
				stopProcessing();
				var refreshData = function()
				{
					startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), function(){GetEmpComment(true);});
				}
				var alertResponse = seaPageMessage(self.lawheader.gmsg, "", "info", null, refreshData, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
				if (typeof(alertResponse) == "undefined" || alertResponse == null)
				{	
					if (seaPageMessage == window.alert)
						refreshData();
					return;
				}			
				refreshData();
			}
			else
			{		
				Comments.commentsWindow.seaAlert(self.lawheader.gmsg, "", null, "error");
				GetEmpComment(true);
			}
		}
		else
			Add_Comments();
	}
	else
	{
		stopProcessing();
		if (styler && (styler.showLDS || styler.showInfor || styler.showInfor3) && typeof(window["DialogObject"]) == "function")
		{
			var alertResponse = seaAlert(self.lawheader.gmsg, "", null, "error", WriteComments);
			if (typeof(alertResponse) == "undefined" || alertResponse == null)
			{	
				if (seaAlert == window.alert)
					WriteComments();
				return;
			}	
			WriteComments();
		}
		else
			Comments.commentsWindow.seaAlert(self.lawheader.gmsg, "", null, "error");
	}	
}

/**********************************************************************************************
 Separate the textarea into 60 character lines. Call AGS with the key elements and then loop through 
 the array of lines, adding them to the call with a SEQ number that relates to the line.
**********************************************************************************************/
function Add_Comments()
{
	DeleteFlag = false;
	var lines = SeparateTextArea(Comments.commentsWindow.document.forms["myComments"].elements["comments"].value,60);
	var object = new AGSObject(authUser.prodline,"ES01.1");
	object.event = "ADD";
	object.rtn = "MESSAGE";
	object.longNames = true;
	object.lfn = "ALL";
	object.tds = false;
	object.field = "FC=A"
	+ "&ECM-COMPANY="+parseFloat(authUser.company)
	+ "&ECM-EMPLOYEE="+parseFloat(Comments.Employee)
	+ "&ECM-CMT-TYPE=TR"
	+ "&ECM-DATE="+Comments.Date;
	for (var i=0,j=1; i<lines.length; i++,j++)
	{
		if (i<lines.length)
			lines[i] = unescape(DeleteIllegalCharacters(escape(lines[i])));
		object.field += "&LINE-FC"+j+"=A"
		// PT 127924
		// + "&ECM-SEQ-NBR"+j+"="+j
		+ "&ECM-CMT-TEXT"+j+"="+escape(lines[i])
	}
	object.dtlField = "LINE-FC;ECM-CMT-TEXT";
	object.debug = false;
	object.func = "parent.RecordsAdded_Comments()";
	AGS(object,"jsreturn");
}

/**********************************************************************************************
 Check for any error messages. If there are none then recall DME so the window gets reset and
 toggle the comments icon on the parent window.
**********************************************************************************************/
function RecordsAdded_Comments()
{
	if (self.lawheader.gmsgnbr == "000")
	{
		stopProcessing();
		var refreshData = function()
		{
			startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), RefreshComment);
		}
		var alertResponse = seaPageMessage(self.lawheader.gmsg, "", "info", null, refreshData, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
		if (typeof(alertResponse) == "undefined" || alertResponse == null)
		{	
			if (seaPageMessage == window.alert)
				refreshData();
			return;
		}			
		refreshData();		
	}
	else
	{
		stopProcessing();
		if (styler && (styler.showLDS || styler.showInfor || styler.showInfor3) && typeof(window["DialogObject"]) == "function")
			seaAlert(self.lawheader.gmsg, "", null, "error");
		else
			Comments.commentsWindow.seaAlert(self.lawheader.gmsg, "", null, "error");	
	}
}

function RefreshComment()
{
	if (self.lawheader.gmsgnbr == "000")
	{
		ToggleSwitch = true;
		GetEmpComment(true);
	}
}

/**********************************************************************************************
 Delete any illegal characters that will not make it through AGS.
**********************************************************************************************/
function DeleteIllegalCharacters(myAry)
{
	var retval = '';
	for (var k=0; k<myAry.length; k++)
	{
		if (myAry.charAt(k)=="%" && myAry.charAt(k+1)=="0" && (myAry.charAt(k+2)=="A" || myAry.charAt(k+2)=="D"))
		{
			k = k+2;
			retval += ' ';
		}
		else
			retval += myAry.charAt(k);
	}
	return retval;
}

/**********************************************************************************************
 Split the textarea value into 60 character lines and store them into an array.
**********************************************************************************************/
function SeparateTextArea(text,val)
{
	var ary = new Array(0);
	for(var i=0; text.length>0; i++)
	{
		if (text.length<val)
		{
			ary[i] = text.substring(0,text.length)
			break;
		}
		ary[i] = text.substring(0,val);
		text = text.substring(val,text.length)
	}
	return ary;
}

/*
 *		Save Changes Functionality
 */
var fncSaveChanges = "";
var hSaveChanges;
var lpcsView;

function SaveChanges(CallBack, View)
{
	fncSaveChanges = CallBack
	lpcsView = View;
	if (styler && (styler.showLDS || styler.showInfor || styler.showInfor3) && typeof(window["DialogObject"]) == "function")
	{
	    window.DialogObject.prototype.getPhrase = function(phrase)
		{
			if (!userWnd && typeof(window["findAuthWnd"]) == "function")
			    userWnd = findAuthWnd(true);
			if (userWnd && userWnd.getSeaPhrase)
			{
				var retStr = userWnd.getSeaPhrase(phrase.toUpperCase(), "ESS");
				return (retStr != "") ? retStr : phrase;
			}
			else
			    return phrase; 
		}
	    messageDialog = new window.DialogObject("/lawson/webappjs/", null, styler, true);
		messageDialog.pinned = true;
		messageDialog.getPhrase = function(phrase)
		{
			if (!userWnd && typeof(window["findAuthWnd"]) == "function")
			    userWnd = findAuthWnd(true);
			if (userWnd && userWnd.getSeaPhrase)
			{
			    var retStr = userWnd.getSeaPhrase(phrase.toUpperCase(), "TE");
			    return (retStr != "") ? retStr : phrase;
			}
			else
			    return phrase;         
		}
		var msgReturn = messageDialog.messageBox(getSeaPhrase("SAVE_CHANGES","TE"), "yesnocancel", "question", window, false, "", ConfirmSaveChangesDone);
		if (typeof(msgReturn) == "undefined")
			return;
		SaveChangesUserAction(msgReturn);
	}
	else
	{	
		hSaveChanges = window.open("/lawson/xhrnet/ui/windowplain.htm?func=opener.writeSaveChangesWindow('"+View+"')", "SAVECHANGES", "resizable=no,toolbar=no,status=no,height=140,width=350");
		try { hSaveChanges.focus(); } catch(e) {}
	}	
}

function ConfirmSaveChangesDone(msgWin)
{
    SaveChangesUserAction(msgWin.returnValue);
}

function SaveChangesUserAction(action)
{
    if (action == "yes")
    {
        if (lpcsView == "Summary")
            SaveChanges_Clicked(lpcsView);
        else
            SaveChanges_Clicked();
    }
    else if (action == "no")
        DoNotSaveChanges_Clicked();
}
	
function writeSaveChangesWindow(View)
{
	var html = '<div style="padding:10px;padding-top:25px">'
	html += '<table border="0" cellpadding="0" cellspacing="0" style="width:100%" role="presentation">'
	html += '<tr><td class="plaintablecell">'+getSeaPhrase("SAVE_CHANGES","TE")+'</td></tr>'
	html += '<tr><td class="plaintablecell">'
	if (View == "Summary")
		html += uiButton(getSeaPhrase("SAVE","TE"),"opener.SaveChanges_Clicked('Summary');return false;")
	else
		html += uiButton(getSeaPhrase("SAVE","TE"),"opener.SaveChanges_Clicked();return false;")
	html += uiButton(getSeaPhrase("NO","TE"),"opener.DoNotSaveChanges_Clicked();return false;","margin-left:5px")
	html += uiButton(getSeaPhrase("CANCEL","TE"),"opener.hSaveChanges.close();return false;","margin-left:5px")
	html += '</td></tr></table></div>'
	hSaveChanges.document.getElementById("paneBody1").innerHTML = html;
	hSaveChanges.stylePage();
	setWinTitle(getSeaPhrase("SAVE_CHANGES","TE"), hSaveChanges);
	try { hSaveChanges.focus(); } catch(e) {}
}

function SaveChangesDone()
{
	if (DoesObjectExist(fncSaveChanges) && fncSaveChanges != "")
	{
		if (typeof(fncSaveChanges) == "function" || typeof(fncSaveChanges) == "object")
			fncSaveChanges();
		else	
			eval(fncSaveChanges);
		return true;
	}
	else
		return false;
}

function SaveChanges_Clicked()
{
	if (arguments.length > 0)
		StartSummaryUpdate();
	else
		startProcessing(getSeaPhrase("UPDATING_EXCEPTION_TE","TE"), function(){UpdateTimeCard(lpcsView, "SavingChanges");});
	try
	{
		if (typeof(hSaveChanges) != "undefined" && !hSaveChanges.closed)
			hSaveChanges.close()
	}
	catch(e) {}
}

function DoNotSaveChanges_Clicked()
{
	if (typeof(fncSaveChanges) == "function" || typeof(fncSaveChanges) == "object")
		fncSaveChanges();
	else	
		eval(fncSaveChanges);
	try
	{
		if (typeof(hSaveChanges) != "undefined" && !hSaveChanges.closed)
			hSaveChanges.close()
	}
	catch(e) {}
}
 
