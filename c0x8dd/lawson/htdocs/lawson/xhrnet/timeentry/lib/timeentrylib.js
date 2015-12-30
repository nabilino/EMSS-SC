// Version: 8-)@(#)@10.00.05.00.27
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/timeentry/lib/Attic/timeentrylib.js,v 1.1.2.129.2.4 2014/04/14 20:59:42 brentd Exp $
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
function EmployeeObject()
{
	this.Company = null;
	this.EmployeeNbr = null;
	this.PayPlan = null;
	this.EmployeeName = null;
	this.SupervisorName = null;
	this.DepartmentName = null;
	this.SalaryClass = null;
	this.Email = null;
	this.EmailPersonal = null;
	this.SupervisorEmail = null;
	this.SupervisorEmailPersonal = null;
	this.GroupName = null;
	this.PayCodeGroupName = null;
}

function TimeCardObject()
{
	this.StartDate = null;
	this.DetailCount = null;
	this.NumberUsed = null;
	this.EndDate = null;
	this.ProtectedDate = null;
	this.ProtectedSeq = null;
	this.View = null;
	this.Form = new Array();
	this.Records = new Array();
	this.Status = 0;
	this.RecordUpdate = "";
	this.TimeCardType = null;
	this.ManagerFlag = false;
	this.EmployeeNbr = "";
	this.ExceptionFlag = false;
	this.DailyFlag = false;
	this.PrintFlag = false;
}

function FormObject()
{
	this.FormField = null;
	this.FormLabel = null;
	this.Size = null;
	this.DME = null;
}

function ExceptionObject()
{
	this.ColumnLabel = null;
	this.PayCode = null;
	this.OffsetPayCode = null;
	this.TimeCardType = null;
}

function RecordsObject()
{
	this.TimeSeq = null;
	this.PayCode = null;
	this.Hours = null;
	this.Date = null;
	this.IsSplit = null;
	this.CommentsExist = null;
	this.Rate = null;
	this.JobCode = null;
	this.Position = null;
	this.Shift = null;
	this.Activity = null;
	this.ActivityDesc = "";
	this.AccountCategory = null;
	this.GlCompany = null;
	this.AccountUnit = null;
	this.GlAccount = null;
	this.SubAccount = null;
	this.ProcessLevel = null;
	this.Department = null;
	this.Schedule = null;
	this.Grade = null;
	this.Step = null;
	this.AttendanceCode = null;
	this.Occurrence = null;
	this.Status = null;
	this.UserId = null;
	this.ProxyId = null;
	this.Comment = null;
	this.ManagerId = null;
	this.History = null;
	this.UserField1 = null;
	this.UserField2 = null;
	this.lineFc = null;
	this.EmployeeNbr = null;
	this.Location = null;
	this.Units = null;
} 

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
	this.Company = company
	this.Employee = employee
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
}

/*
 *		Common Functions
 */
var ScreenWidth = screen.width; //Screen Resolution
var UpdatedPeriodStartDate;	//Saved off period start date
var UpdatePeriodEndDate; //Saved off period end date
var bSelectChanged = false;
var __View;
var Over24Flag = false;
var ClickedBackToSummary = false;
var TextOnChange = new Array();
var appObj;
var messageDialog;

/******************************************************************************************
 Will set TimeCard.LockedOut and TimeCard.View to their appropriate settings.
 Mainly tells the program if the time card is be updatable or static.
******************************************************************************************/
function GetTimeCardView(iView)
{
	if (IgnorePeriodOutOfRangeAndLockOut)
	{
		LockedOut = false;
		TimeCard.View = 4;
		return;
	}
	if (iView == 2)
		LockedOut = true;
	else
		LockedOut = false;
}

/******************************************************************************************
 Open Tips Window
******************************************************************************************/
function OpenHelpDialog()
{
	openHelpDialogWindow("/lawson/xhrnet/timeentry/tips/tips.htm");
}

/******************************************************************************************
 Draws the header for all three views; "Period", "Exception, and "Daily". Exception works
 similarly to Period however the function calls will be different.
******************************************************************************************/
function PaintHeaders(View)
{
	if (!self.TABLE || !self.TABLE.document || !self.TABLE.document.getElementById("paneBody1"))
	{
		setTimeout(function() { PaintHeaders.apply(this, arguments); }, 5);
		return;
	}
	__View = View;
	var functionCall = "";
	var rtnFunctionCall = "";
	var toolTip;
	switch (View)
	{
		case "Period": functionCall = "MoveToHeaderCalendar"; rtnFunctionCall = "HeaderCalendar"; date_fld_name = "1"; break;
		case "Daily":  functionCall = "MoveToHeaderCalendar_Daily"; rtnFunctionCall = "HeaderCalendar_Daily"; date_fld_name = "3"; break;
		case "Exception": functionCall = "MoveToHeaderCalendar_Exception"; rtnFunctionCall = "HeaderCalendar_Exception"; date_fld_name = "4"; break;
	}
	var html = '<div style="text-align:center;width:100%;padding-bottom:10px">';
	html += '<table border="0" cellpadding="0" cellspacing="0" style="width:100%" role="presentation"><tr>';
	if (View == "Daily")
	{
		var toolTip = getSeaPhrase("OPEN_COMMENTS","TE",[dteDay(TimeCard.StartDate)+', '+FormatDte3(TimeCard.StartDate)]);
		html += '<td class="plaintablecell" style="vertical-align:middle;width:50px" nowrap>';
		html += '<a href="javascript:;" onclick="parent.CommentsClicked_Daily();return false;" onmouseover="parent.CommentIconMouseOver(1,\'\');return true;" onfocus="parent.CommentIconMouseOver(1,\'\');return true;" ';
		html += 'onmouseout="parent.CommentIconMouseOver(0,\'\');return true;" onblur="parent.CommentIconMouseOver(0,\'\');return true;" title="'+toolTip+'" aria-label="'+toolTip+'" aria-haspopup="true">';
		html += '<img styler="documenticon" src="'+NoCommentsIconImage.src+'" border="0" width="32" height="32" ';
		html += 'default_icon="'+NoCommentsIcon+'" active_icon="'+ExistingCommentsIcon+'" name="comment" id="comment" alt="'+toolTip+'" title="'+toolTip+'"></a></td>';
	}
	html += '<td style="text-align:center;width:100%">';
	if (TimeCard.ManagerFlag)
	{
		html += '<table cellpadding="0" cellspacing="0" border="0" style="width:auto;margin-left:auto;margin-right:auto" summary="'+getSeaPhrase("TSUM_12","SEA")+'"><tr>';
		html += '<caption class="offscreen">'+getSeaPhrase("TCAP_9","SEA")+'</caption>'
		html += '<tr><th scope="col" colspan="3"></th></tr>'
		html += '<th scope="row" class="fieldlabelbold">'+getSeaPhrase("EMPLOYEE","TE")+'&nbsp;</th>';
		html += '<td class="fieldlabel">'+Employee.EmployeeName+'</td>';
		html += '<td class="plaintablecellbold">&nbsp;&nbsp;&nbsp;&nbsp;'
		if (parseInt(TimeCard.TimeCardType,10) == 2)
			html += getSeaPhrase("EXCEPTION","TE");
		else
			html += getSeaPhrase("NORMAL","TE");
		html += '</td></tr></table>';
	}
	html += '</td>';
	if (TimeCard.ManagerFlag)
	{
		html += '<td class="plaintablecellright" style="vertical-align:top" nowrap>';	
		// Try to trigger the ProcessFlow.  If it's not there, use the email CGI program.
		var techVersion = (iosHandler && iosHandler.getIOSVersionNumber() >= "09.00.00") ? ProcessFlowObject.TECHNOLOGY_900 : ProcessFlowObject.TECHNOLOGY_803;
		var httpRequest = (typeof(SSORequest) == "function") ? SSORequest : SEARequest;
		var pfObj = new ProcessFlowObject(window, techVersion, httpRequest, "EMSS");
		pfObj.setEncoding(authUser.encoding);
		pfObj.showErrors = false;
		if (Reports.EmailPersonal == null)
			emssObjInstance.emssObj.emailAddressType = "work";
		if (emssObjInstance.emssObj.emailAddressType.toString().toLowerCase() == "personal")
		{
			if (!appObj)
				appObj = new AppVersionObject(authUser.prodline, "HR");
			// if you call getAppVersion() right away and the IOS object isn't set up yet,
			// then the code will be trying to load the sso.js file, and your call for
			// the appversion will complete before the ios version is set
			if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
			{
		       	setTimeout(function(){PaintHeaders.apply(this, arguments);}, 10);
		       	return;
			}		
			if (!appObj || appObj.getAppVersion() == null || appObj.getAppVersion().toString() < "10.00.00")
				emssObjInstance.emssObj.emailAddressType = "work";
		}
		if (!emssObjInstance.emssObj.processFlowsEnabled)
		{	
			toolTip = Employee.EmployeeName+' - '+getSeaPhrase("SEND_EMAIL_TO_X","SEA");
			html += '<a href="javascript:;" onclick="parent.EmployeeEmailClicked();return false;" title="'+toolTip+'" aria-haspopup="true"><span class="offscreen">'+Employee.EmployeeName+' - </span>'+getSeaPhrase("SEND_EMAIL","ESS")+'</a>&nbsp;&nbsp;'
		}	
		else
		{
			for (var i=0; i<Reports.Detail.length && (parseInt(Reports.Detail[i].Employee, 10) != parseInt(Employee.EmployeeNbr,10)); i++);
			if (i < Reports.Detail.length)		
			{
				var emailTo = Reports.Detail[i].Email;
				if (emssObjInstance.emssObj.emailAddressType.toString().toLowerCase() == "personal")
					emailTo = Reports.Detail[i].EmailPersonal;
				toolTip = Reports.Detail[i].FullName+' - '+getSeaPhrase("SEND_EMAIL_TO_X","SEA");
				html += '<a href="mailto:'+emailTo+'" title="'+toolTip+'"><span class="offscreen">'+Reports.Detail[i].FullName+' - </span>'+getSeaPhrase("SEND_EMAIL","ESS")+'</a>&nbsp;&nbsp;'			
			}
		}
		html += '</td>';
	}
	toolTip = getSeaPhrase("OPEN_LEAVE_BALANCE_WIN","TE")+' - '+getSeaPhrase("OPEN_LINK_TO","SEA");
	html += '<td class="plaintablecellright" style="vertical-align:top" nowrap>';
	html += '<a href="javascript:;" onclick="parent.OpenTimeOff_Period();return false;" title="'+toolTip+'">'+getSeaPhrase("OPEN_LEAVE_BALANCE_WIN","TE")+'</a></td></tr></table>';
	html += '<table cellpadding="0" cellspacing="0" border="0" style="width:auto;margin-left:auto;margin-right:auto" role="presentation">';
	html += '<tr><td class="plaintablecell" style="vertical-align:middle;width:25px">';
	if (View == "Period")
	{
		toolTip = getSeaPhrase("TO_PRE_PERIOD","TE");
		html += '<a href="javascript:;" onclick="parent.PreviousPeriod();return false;" ';
		html += 'onmouseover="parent.TABLE.document.getElementById(\'previous\').src=\''+PreviousIconOver+'\';return true;" onfocus="parent.TABLE.document.getElementById(\'previous\').src=\''+PreviousIconOver+'\';return true;" ';
		html += 'onmouseout="parent.TABLE.document.getElementById(\'previous\').src=\''+PreviousIcon+'\';return true;" onblur="parent.TABLE.document.getElementById(\'previous\').src=\''+PreviousIcon+'\';return true;"';		
		html += ' title="'+toolTip+'" aria-label="'+toolTip+'"><img styler="prevcalendararrow" id="previous" name="previous" src="'+PreviousIcon+'" alt="'+toolTip+'" title="'+toolTip+'" border="0"></a>';
	}
	else if (View == "Exception")
	{
		toolTip = getSeaPhrase("TO_PRE_PERIOD","TE");
		html += '<a href="javascript:;" onclick="parent.PreviousException();return false;" ';
		html += 'onmouseover="parent.TABLE.document.getElementById(\'previous\').src=\''+PreviousIconOver+'\';return true;" onfocus="parent.TABLE.document.getElementById(\'previous\').src=\''+PreviousIconOver+'\';return true;" ';
		html += 'onmouseout="parent.TABLE.document.getElementById(\'previous\').src=\''+PreviousIcon+'\';return true;" onblur="parent.TABLE.document.getElementById(\'previous\').src=\''+PreviousIcon+'\';return true;"';		
		html += ' title="'+toolTip+'" aria-label="'+toolTip+'"><img styler="prevcalendararrow" id="previous" name="previous" src="'+PreviousIcon+'" alt="'+toolTip+'" title="'+toolTip+'" border="0"></a>';
	}
	else
	{
		toolTip = getSeaPhrase("TO_PRE_DAY","TE");
		html += '<a href="javascript:;" onclick="parent.PreviousDay();return false;" '
		html += 'onmouseover="parent.TABLE.document.getElementById(\'previous\').src=\''+PreviousIconOver+'\';return true;" onfocus="parent.TABLE.document.getElementById(\'previous\').src=\''+PreviousIconOver+'\';return true;" '
		html += 'onmouseout="parent.TABLE.document.getElementById(\'previous\').src=\''+PreviousIcon+'\';return true;" onblur="parent.TABLE.document.getElementById(\'previous\').src=\''+PreviousIcon+'\';return true;"'		
		html += ' title="'+toolTip+'" aria-label="'+toolTip+'"><img styler="prevcalendararrow" id="previous" name="previous" src="'+PreviousIcon+'" alt="'+toolTip+'" title="'+toolTip+'" border="0"></a>'
	}
	html += '</td><td class="plaintablecellbold" style="vertical-align:middle;text-align:center" nowrap>';
	html += dteDay(TimeCard.StartDate)+", "+FormatDte3(TimeCard.StartDate)+'</td>';
	if (View == "Period" || View == "Exception")
	{
		html += '<td class="plaintablecellbold" style="vertical-align:middle;text-align:center" nowrap> - </td>';
		html += '<td class="plaintablecellbold" style="vertical-align:middle;text-align:center" nowrap>'+dteDay(TimeCard.EndDate)+', '+FormatDte3(TimeCard.EndDate)+'</td>';
	}
	html += '<td class="plaintablecell" style="vertical-align:middle;width:25px">';
	if (View == "Period")
	{
		toolTip = getSeaPhrase("TO_NEXT_PERIOD","TE");
		html += '<a href="javascript:;" onclick="parent.NextPeriod();return false;" ';
		html += 'onmouseover="parent.TABLE.document.getElementById(\'next\').src=\''+NextIconOver+'\';return true;" onfocus="parent.TABLE.document.getElementById(\'next\').src=\''+NextIconOver+'\';return true;" ';
		html += 'onmouseout="parent.TABLE.document.getElementById(\'next\').src=\''+NextIcon+'\';return true;" onblur="parent.TABLE.document.getElementById(\'next\').src=\''+NextIcon+'\';return true;"';		
		html += ' title="'+toolTip+'" aria-label="'+toolTip+'"><img styler="nextcalendararrow" id="next" name="next" src="'+NextIcon+'" alt="'+toolTip+'" title="'+toolTip+'" border="0"></a>';
	}
	else if (View == "Exception")
	{
		toolTip = getSeaPhrase("TO_NEXT_PERIOD","TE");
		html += '<a href="javascript:;" onclick="parent.NextException();return false;" ';
		html += 'onmouseover="parent.TABLE.document.getElementById(\'next\').src=\''+NextIconOver+'\';return true;" onfocus="parent.TABLE.document.getElementById(\'next\').src=\''+NextIconOver+'\';return true;" ';
		html += 'onmouseout="parent.TABLE.document.getElementById(\'next\').src=\''+NextIcon+'\';return true;" onblur="parent.TABLE.document.getElementById(\'next\').src=\''+NextIcon+'\';return true;"';		
		html += ' title="'+toolTip+'" aria-label="'+toolTip+'"><img styler="nextcalendararrow" id="next" name="next" src="'+NextIcon+'" alt="'+toolTip+'" title="'+toolTip+'" border="0"></a>';
	}
	else
	{
		toolTip = getSeaPhrase("TO_NEXT_DAY","TE");
		html += '<a href="javascript:;" onclick="parent.NextDay();return false;" ';
		html += 'onmouseover="parent.TABLE.document.getElementById(\'next\').src=\''+NextIconOver+'\';return true;" onfocus="parent.TABLE.document.getElementById(\'next\').src=\''+NextIconOver+'\';return true;" ';
		html += 'onmouseout="parent.TABLE.document.getElementById(\'next\').src=\''+NextIcon+'\';return true;" onblur="parent.TABLE.document.getElementById(\'next\').src=\''+NextIcon+'\';return true;"';
		html += ' title="'+toolTip+'" aria-label="'+toolTip+'"><img styler="nextcalendararrow" id="next" name="next" src="'+NextIcon+'" alt="'+toolTip+'" title="'+toolTip+'" border="0"></a>';
	}
	var CalendarStartDate = "";
	if (hs36 && hs36.CalendarDate != null)
		CalendarStartDate = FormatDte4(hs36.CalendarDate);
	else if (getDteDifference(ymdtoday, TimeCard.StartDate) <= 0 && getDteDifference(ymdtoday, TimeCard.EndDate) >= 0)
		CalendarStartDate = fmttoday;
	else
		CalendarStartDate = FormatDte4(TimeCard.StartDate);
	toolTip = getSeaPhrase("OPEN_COMMENTS_FOR_DATE","TE");
	html += '</td><td class="plaintablecell" style="vertical-align:middle" nowrap>&nbsp;';
	html += '<label class="offscreen" id="navDateLbl" for="navDate">'+getSeaPhrase("DATE","TE")+'</label>'
	html += '<input onchange="parent.'+rtnFunctionCall+'(this)" styler="calendar" class="inputbox" onkeydown="this.value=this.getAttribute(\'start_date\')" onkeyup="this.value=this.getAttribute(\'start_date\')" type="text" id="navDate" name="navDate" size="10" maxlength="10" start_date="'+CalendarStartDate+'" value="'+CalendarStartDate+'" aria-labelledby="navDateLbl navDateFmt"/>';
	html += '<a styler="hidden" href="javascript:;" onclick="parent.'+functionCall+'(window,this,event);return false" for="navDate" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>';
	html += uiDateFormatSpan("navDateFmt")+'</td></tr></table>';
	html += '<table cellpadding="0" cellspacing="0" border="0" style="width:auto;margin-left:auto;margin-right:auto" role="presentation">';
	html += '<tr><td id="cardMgs" class="fieldlabelbold" style="vertical-align:middle">';
	switch (TimeCard.View)
	{
		case 1: html += getSeaPhrase("INVALID_PERIOD","TE"); break;
		case 2: html += getSeaPhrase("TE_LOCKED","TE"); break;
		case 3: html += getSeaPhrase("OLD_PERIOD","TE"); break;
		default:
		{
			if (TimeCard.ManagerFlag)
			{
				switch (TimeCard.Status)
				{
					case -1: html += getSeaPhrase("CARD_NOT_ENTERED","TE"); break;
					case 0:  html += getSeaPhrase("CARD_ENTERED_NOT_SUBMITTED","TE"); break;
					case 1:  html += getSeaPhrase("CARD_SUBMITTED","TE"); break;
					case 2:  html += getSeaPhrase("CARD_APPROVED","TE"); break;
					case 3:  html += getSeaPhrase("CARD_ON_HOLD","TE"); break;
					case 4:  html += getSeaPhrase("CARD_REJECTED","TE"); break;
					case 5:
					case 6:
					case 7:
					case 8:
					case 9:  html += getSeaPhrase("OLD_PERIOD","TE"); break;
					default: break;
				}
			}
			else
			{
				switch (parseInt(TimeCard.Status, 10))
				{
					case 1: html += getSeaPhrase("CARD_SUBMITTED","TE"); break;
					case 2: html += getSeaPhrase("CARD_APPROVED_NO_MORE","TE"); break;
					case 3: html += getSeaPhrase("CARD_ON_HOLD_NO_MORE","TE"); break;
					case 4: html += getSeaPhrase("CARD_RETURNED_NEED_CHANGE","TE"); break;
					default:
					{
						if (View == "Period")
							html += getSeaPhrase("ENTER_TIME_CLICK_MULTIENTRIES","TE")+'<img styler="multipleentrydetailicon" width="15" height="15" alt="'+getSeaPhrase("SPLIT_NOTIFY","TE")+'" title="'+getSeaPhrase("SPLIT_NOTIFY","TE")+'" src="'+SplitIcon+'">';
						else if (View == "Exception")
							html += getSeaPhrase("ENTER_EXCEPTION_TIME","TE");
						else
							html += getSeaPhrase("ENTER_TIME","TE");
						break;
					}
				}
			}
			break;
		}
	}
	html += '</td></td></table></div>';
	self.TABLE.document.getElementById("paneBody1").innerHTML = html;
}

/******************************************************************************************
 returns the painting instructions for the Total Hours frame
******************************************************************************************/
function GetTotalHoursFrameInformation(Sum)
{
	var html = '<div style="text-align:center">';
	html += '<table style="margin-left:auto;margin-right:auto;width:auto" border="0" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_9","TE")+'">';
	html += '<caption class="offscreen">'+getSeaPhrase("TCAP_7","TE")+'</caption>'
	html += '<tr><th scope="col" colspan="2"></tr>'
	html += '<tr><th scope="row" class="plaintablecellboldright">'+getSeaPhrase("TOTAL_HOURS","TE")+'</th>';
	html += '<td><span id="TotalHoursSpan" class="plaintablecell">'+Sum+'</span></td>';
	html += '</tr></table></div>';
	return html;
}

/******************************************************************************************
 returns the painting instructions for the button frame.
******************************************************************************************/
function GetButtonFrameInformation(View)
{
	__View = View;
	var Static = true;
	if (TimeCard.View == 4 && TimeCard.Status != 2 && TimeCard.Status != 3)
		Static = false;
	GetTimeCardView(TimeCard.View);
	var arg = '<div style="text-align:center;width:100%"><form name="frmButtonFrame" onsubmit="return false;">';
	arg += '<table border="0" cellpadding="0" cellspacing="0" style="width:auto;margin-left:auto;margin-right:auto" role="presentation"><tr>';
	// Direct Report Select	
	if (TimeCard.ManagerFlag)
	{
		arg += '<td class="plaintablecell" style="vertical-align:top;text-align:center">';
		arg += '<span style="white-space:nowrap"><label for="cmbReports" class="plaintablecellbold" style="vertical-align:top;padding-right:5px;display:inline-block">'+getSeaPhrase("REPORTS","TE")+'</label>';
		arg += '<span style="vertical-align:top;display:inline-block">';
		arg += '<select class="inputbox" id="cmbReports" name="cmbReports" onchange="parent.NewEmployeeSelected();">';
		for (var i=0; i<Reports.Detail.length; i++)
		{
			if (Employee.EmployeeNbr == Reports.Detail[i].Employee)
				arg += '<option value="'+Reports.Detail[i].Employee+'" selected>';
			else
				arg += '<option value="'+Reports.Detail[i].Employee+'">';
			arg += Reports.Detail[i].FullName+'</option>';
		}
		arg += '</select></span></span></td>';
	}
	arg += '<td class="plaintablecell" style="vertical-align:top;text-align:center">';
	
	if (TimeCard.View == 4 && ((TimeCard.Status != 2 && TimeCard.Status != 3) || TimeCard.ManagerFlag))
	{
		// Update Button
		if (View == "Period")
		{
			if (Static)
				arg += uiButton(getSeaPhrase("UPDATE_CARD","TE"),"parent.UpdateClicked_Period();return false","margin-left:5px");
			else
				arg += uiButton(getSeaPhrase("UPDATE_CARD","TE"),"parent.CheckTextChanged_Period();return false","margin-left:5px");
		}
		else if (View == "Exception")
			arg += uiButton(getSeaPhrase("UPDATE_CARD","TE"),"parent.UpdateClicked_Exception();return false","margin-left:5px");
		else
			arg += uiButton(getSeaPhrase("UPDATE_CARD","TE"),"parent.UpdateClicked_Daily();return false","margin-left:5px");
		// Submit Button
		if (!TimeCard.ManagerFlag)
		{
			if (View == "Period")
				arg += uiButton(getSeaPhrase("SUBMIT_CARD_FOR_APPROVE","TE"),"parent.SubmitClicked_Period();return false","margin-left:5px");
			else if (View == "Exception")
				arg += uiButton(getSeaPhrase("SUBMIT_CARD_FOR_APPROVE","TE"),"parent.SubmitClicked_Exception();return false","margin-left:5px");
		}
		// Delete Row Button
		if (TimeCard.Status != 2 && TimeCard.Status != 3)
			arg += uiButton(getSeaPhrase("DEL_DATED_INFO","TE"),"parent.StartDeleteRow('"+View+"');return false","margin-left:5px");
	}
	// Print Button
	if (View == "Period")
		arg += uiButton(getSeaPhrase("PRINT_CURRENT_CARD","TE"),"parent.PrintClicked_Period();return false","margin-left:5px");
	else if (View == "Exception")
		arg += uiButton(getSeaPhrase("PRINT_CURRENT_CARD","TE"),"parent.PrintClicked_Exception();return false","margin-left:5px");
	// Copy Paste Buttons
	if (View != "Period" && View != "Exception")
	{
		if (TimeCard.View == 4 && TimeCard.Status != 2 && TimeCard.Status != 3)
		{
			arg += uiButton(getSeaPhrase("COPY_DAY","TE"),"parent.CopyScreen_Daily();return false","margin-left:5px");
			arg += uiButton(getSeaPhrase("PASTE_DAY","TE"),"parent.PasteScreen_Daily();return false","margin-left:5px");		
		}
	}
	// Done Button
	if ((View != "Daily" && ScreenWidth == 800) || ScreenWidth >= 1024)	
		arg += uiButton(getSeaPhrase("CLOSE_TE","TE"),"parent.DoneClicked('"+View+"');return false","margin-left:5px");
	// Go to Period View Button
	if (View == "Daily")
		arg += uiButton(getSeaPhrase("RETURN_PERIOD_VIEW","TE"),"parent.BackToPeriod();return false","margin-left:5px");
	// Go to Summary View Button
	if (TimeCard.ManagerFlag)
	{
		if (!NoSummaryFlag && (View != "Daily" && View != "Period" && ScreenWidth == 800) || ScreenWidth >= 1024)
			arg += uiButton(getSeaPhrase("GO_TO_SUMMARY_APPROVAL","TE"),"parent.BackToSummary(this,'"+View+"');return false","margin-left:5px");
	}
	arg += '</td>';
	// Status Drop Down
	// Only show the status select if employee is a manager and the user has not navigated from Daily Time Entry.
	if (TimeCard.ManagerFlag && View != "Daily" && prm != "daily")
	{
		arg += '<td class="plaintablecell" style="vertical-align:top;text-align:center">';
		arg += '<span style="white-space:nowrap"><span class="plaintablecellbold" style="vertical-align:top;padding-left:5px;padding-right:5px;display:inline-block">'+getSeaPhrase("STATUS","TE")+'</span>';
		if (TimeCard.View != 4)
		{
			arg += '<span class="plaintablecell" style="vertical-align:top;display:inline-block">';
			switch (TimeCard.Status)
			{
				case 1: arg += getSeaPhrase("SUBMITTED","TE"); break;
				case 2: arg += getSeaPhrase("APPROVED","TE"); break;
				case 3: arg += getSeaPhrase("ON_HOLD","TE"); break;
				case 4: arg += getSeaPhrase("REJECTED","TE"); break;
				case 5: arg += getSeaPhrase("HISTORICAL_1","TE"); break; // Entered (Historical)
				case 6: arg += getSeaPhrase("HISTORICAL_2","TE"); break; // Submitted (Historical)
				case 7: arg += getSeaPhrase("HISTORICAL_3","TE"); break; // Approved (Historical)
				case 8: arg += getSeaPhrase("HISTORICAL_4","TE"); break; // On Hold (Historical)
				case 9: arg += getSeaPhrase("HISTORICAL_5","TE"); break; // Rejected (Historical)
				default: arg += getSeaPhrase("NONE","TE"); break;
			}
			arg += '</span>';
		}
		else
		{
			arg += '<span style="vertical-align:top;display:inline-block"><select class="inputbox" style="width:120px" name="cmbStatus" onchange="parent.SetStatus()">';
			arg += (TimeCard.Status == 1)?'<option value="1" selected></option>':'<option value="1"></option>';
			arg += (TimeCard.Status == 2)?'<option value="2" selected>'+getSeaPhrase("APPROVED","TE")+'</option>':'<option value="2">'+getSeaPhrase("APPROVED","TE")+'</option>';
			arg += (TimeCard.Status == 3)?'<option value="3" selected>'+getSeaPhrase("HOLD","TE")+'</option>':'<option value="3">'+getSeaPhrase("HOLD","TE")+'</option>';
			arg += (TimeCard.Status == 4)?'<option value="4" selected>'+getSeaPhrase("REJECTED","TE")+'</option>':'<option value="4">'+getSeaPhrase("REJECTED","TE")+'</option>';
			arg += '</select></span>';
		}	
		arg += '</span></td>';
	}
	arg += '</tr></table></form></div>';
	return arg;
}

function SetStatus()
{
	bSelectChanged = true;
	var StatusObj = self.TABLE.document.forms["frmButtonFrame"].elements["cmbStatus"];
	TimeCard.Status = StatusObj.options[StatusObj.selectedIndex].value;
}

//****************************************************************************************
//Format hours based on size represented in the TimeCard object. Formats up to two decimals
//****************************************************************************************
function FormatHours(Qty, size)
{
	var strQty = String(Qty);
	var leadingSign = '', trailingSign = '', returnVal = '';
	if (strQty.charAt(0) == '-' || strQty.charAt(0) == '+')
	{
		leadingSign = strQty.substring(0,1);
		strQty = strQty.substring(1,strQty.length);
		strQty = leadingSign + strQty;
	}
	else if (strQty.charAt(strQty.length-1) == '-' || strQty.charAt(strQty.length-1) == '+')
	{
		trailingSign = strQty.substring(strQty.length-1,strQty.length);
		strQty = strQty.substring(0,strQty.length-1);
		strQty = trailingSign + strQty;
	}
	if (strQty.indexOf(".") == -1)
		strQty = (Number(strQty) / 100);
	else
		strQty = Number(strQty);
	var sizeString = String(size);
	if (sizeString.indexOf(".") == -1)
		sizeString = String(Number(size) / 10);
	var numberDecimals = sizeString.split(".");
	if (numberDecimals.length == 2)
		returnVal = roundToDecimal(strQty, Number(numberDecimals[1]));
	else
		returnVal = roundToDecimal(strQty, 0);
	return returnVal;
}

function setFocusOn(i, j)
{
	try
	{
		var timeObject = self.TABLE.document.forms["TimeEntry"];
		var fld = timeObject.elements[TimeCard.Form[j].FormField+'_'+i];
		//temporarily remove onfocus and onblur events so they don't conflict
		fld.onfocus = null;
		fld.onblur = null;
		fld.focus();
		fld.select();	
		var restoreEvents = function() 
		{
			fld.onfocus = function()
			{
				onLastHourCheckFailed(i,j);	
			}
			fld.onblur = function()
			{
				SetCords(i,j);
				TextChanged(this,true)
			}
		}	
		setTimeout(restoreEvents, 500);
	} 
	catch(e) {}
}

function onLastHourCheckFailed(i,j)
{
	if (lastHourCheckFailed && (lastI != i || lastJ != j))
		Check24HourEdit(lastI,lastJ);
}

/******************************************************************************************
Template for a single row in an employee's time card
******************************************************************************************/
function GetTimeCardModelRow(View, Split)
{
	var sb = new StringBuffer();
	var row = '';
	var len = TimeCard.Form.length;
	var altStr = getSeaPhrase("OPEN_SELECT_WIN","TE");
	var isReadonly = (View == "Period" && Split) ? true : false;
	var readonlyTooltip = getSeaPhrase("USE_DAILY_TE_CHANGE_MULTIENTRIED","TE");
	for (var j=1; j<len; j++)
	{
		var Newsize = 15; // default size
		try 
		{
			if (iosHandler.getIOSVersionNumber() >= "08.01.00") 
			{
			 	if (View == "Exception")
					Newsize = 10;
			    else
			 		Newsize = parseInt(TimeCard.Form[j].Size, 10);
			} 
			else
			 	Newsize = parseInt(Number(TimeCard.Form[j].Size) / 10, 10);
		} 
		catch(e) 
		{
		 	Newsize = 15;
		}
		row = '<td style="text-align:center"'	
		if (isReadonly)
			row += ' title="'+readonlyTooltip+'"'
		row += ' nowrap><label class="offscreen" for="'+TimeCard.Form[j].FormField+'_<TIMECARD_ROW_NBR>">'+TimeCard.Form[j].FormField+'</label><input class="inputbox" type="text" size="'+Newsize+'" maxlength="'+Newsize+'" id="'+TimeCard.Form[j].FormField+'_<TIMECARD_ROW_NBR>" name="'+TimeCard.Form[j].FormField+'_<TIMECARD_ROW_NBR>"';		
		if (isReadonly)
		{
			//set inputbox to readonly and don't style
			row += ' readonly="readonly" styledAs="-1" style="border:0px;background-color:transparent;opacity:1" onkeydown="return false;" onfocus="this.blur()" title="'+readonlyTooltip+'"'			
		}	
		else
		{	
			row += ' title="'+TimeCard.Form[j].FormLabel+'" onblur=\'parent.SetCords(<TIMECARD_ROW_NBR>,'+j+');parent.TextChanged(this,true);\''
			row += ' onchange=\'parent.SetCords(<TIMECARD_ROW_NBR>,'+j+');parent.TextChanged(this,false);\' onfocus=\'parent.onLastHourCheckFailed(<TIMECARD_ROW_NBR>,'+j+');\''			
		}
		row += '>'
		if (isReadonly)
		{
			//do nothing
		}
		else if (View != "Exception" && TimeCard.Form[j].FormField != "HOURS" && TimeCard.Form[j].FormField != "UNITS" && TimeCard.Form[j].FormField != "RATE" && TimeCard.Form[j].FormField != "USERFIELD1" && TimeCard.Form[j].FormField != "USERFIELD2" && TimeCard.Form[j].FormField != "COMMENTS")
		{	
			row += '<a href=\'\' onclick=\'parent.DropDown(<TIMECARD_ROW_NBR>,'+j+'); return false;\' '
			row += 'onmouseover=\'parent.SelectIconMouseOver(1,<TIMECARD_ROW_NBR>,'+j+');return true;\' onfocus=\'parent.SelectIconMouseOver(1,<TIMECARD_ROW_NBR>,'+j+');return true;\' onmouseout=\'parent.SelectIconMouseOver(0,<TIMECARD_ROW_NBR>,'+j+');return true;\' onblur=\'parent.SelectIconMouseOver(0,<TIMECARD_ROW_NBR>,'+j+');return true;\'>'
			row += '<img src="'+SelectionIconImage.src+'" border="0" name="DropDownSelect<TIMECARD_ROW_NBR>'+''+j+'" id="DropDownSelect<TIMECARD_ROW_NBR>'+''+j+'" alt="'+altStr+'" title="'+altStr+'"></a>'
		}
		else if (View == "Exception")
		{
			row += '<input type="hidden" size="6" name="lineFc<TIMECARD_ROW_NBR>_'+j+'" value="-">'
			row += '<input type="hidden" size="6" name="seqnbr<TIMECARD_ROW_NBR>_'+j+'" value="-">'
			row += '<input type="hidden" size="6" name="date<TIMECARD_ROW_NBR>_'+j+'" value="-">'
		}
		row += '</td>';
		sb.append(row);
	}
	return sb.toString();
}

function PaintTimeCard(View, Static, DOMElement)
{
	__View = View;
	var CommentIcon;
	var SplitsIcon;
	var SumHours = 0.00;
	var x, value;
	var sb = new StringBuffer();
	var toolTip;
	var sumMsg = "";
	var capMsg = "Employee Time Card";
	if (View == "Daily")
	{	
		var msgData = [Employee.EmployeeName,dteDay(TimeCard.StartDate)+', '+FormatDte3(TimeCard.StartDate)];
		sumMsg = getSeaPhrase("TSUM_4","TE",msgData);
		capMsg = getSeaPhrase("TCAP_3","TE",msgData);
	}	
	else if (View == "Period" || View == "Exception")
	{	
		var sumPhraseID = (View == "Exception") ? "TSUM_6" : "TSUM_5";
		var capPhraseID = (View == "Exception") ? "TCAP_5" : "TCAP_4";
		var msgData = [Employee.EmployeeName,dteDay(TimeCard.StartDate)+', '+FormatDte3(TimeCard.StartDate),dteDay(TimeCard.EndDate)+', '+FormatDte3(TimeCard.EndDate)];
		sumMsg = getSeaPhrase(sumPhraseID,"TE",msgData);
		capMsg = getSeaPhrase(capPhraseID,"TE",msgData);
	}
	var arg = '<div style="width:100%;">'
	+ '<form name="TimeEntry" onsubmit="return false;">'
	+ '<table border="0" align="center" cellspacing="0" cellpadding="0" style="width:100%;text-align:center;margin-left:auto;margin-right:auto" styler="list" styler_drilldown="false" styler_edit="true" summary="'+sumMsg+'">'
	+ '<caption class="offscreen">'+capMsg+'</caption>'
	+ '<tr>'
	if (View == "Period" || View == "Exception")
		arg += '<th scope="col" class="dialoglabel">'+getSeaPhrase("DATE","TE")+'</th>';
	else
		arg += '<th scope="col">&nbsp;</th>';
	if (View == "Period")
		arg += '<th scope="col" class="dialoglabel" style="text-align:center;padding-right:5px" styler_edit="true">'+getSeaPhrase("SPLIT","TE")+'</th>';
	sb.append(arg);
	arg = '';
	var len = TimeCard.Form.length;
	var len2 = TimeCard.Records.length;
	for (var i=1; i<len; i++)
		arg += '<th scope="col" id="'+i+'" class="dialoglabel"'+((!Static)?' styler_edit="true">':'>')+TimeCard.Form[i].FormLabel+'</th>';
	if (View == "Period" || View == "Exception")
		arg += '<th scope="col" id="'+len+'" class="dialoglabel" style="text-align:center" styler_edit="true">'+getSeaPhrase("COMMENTS","TE")+'</th>';
	arg += '</tr>';
	sb.append(arg);
	//the rows of data are all the same starting after the date. Therefore we build a single row and store that row for later use.
	if (!Static)
	{	
		var modelRow = GetTimeCardModelRow(View);
		var modelRowSplit = GetTimeCardModelRow(View, true);
		//For a period view take this row and display it for the number of records we plan to display.
		//Plus add a line function code for use when the user makes changes for each line plus the
		//activity description when the user enters an activity.
		if (View == "Period")
		{
			for (var i=1; i<len2; i++)
			{
				toolTip = getSeaPhrase("OPEN_DAILY_WIN","TE",[dteDay(TimeCard.Records[i].Date)+', '+FormatDte3(TimeCard.Records[i].Date)]);
				arg = '<tr><td scope="row" class="plaintablecellbold" nowrap>'+FormatDte5(TimeCard.Records[i].Date)
				+ '<input type="hidden" size="6" name="lineFc'+i+'" value="-">'
				+ '<input type="hidden" size="6" name="actdesc'+i+'" value="">'				
				+ '</td><td style="text-align:center"><a href="javascript:;" onclick="parent.SplitToDaily('+i+');return false;" styler="hyperlink" role="link" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img styler="multipleentrydetailicon" src="'+SplitIconImage.src+'" width="25" height="25" border="0" '
				+ ' default_icon="'+SplitIcon+'" active_icon="'+SplitIcon2+'" name="split'+i+'" id="split'+i+'" alt="'+toolTip+'" title="'+toolTip+'"></a></td>';
				if (TimeCard.Records[i].IsSplit == true)
					arg += modelRowSplit.replace(/\<TIMECARD_ROW_NBR\>/g, i+"");
				else	
					arg += modelRow.replace(/\<TIMECARD_ROW_NBR\>/g, i+"");	
				toolTip = getSeaPhrase("OPEN_COMMENTS","TE",[dteDay(TimeCard.Records[i].Date)+', '+FormatDte3(TimeCard.Records[i].Date)]);
				arg += '<td style="text-align:center"><a href="javascript:;" onclick="parent.Comments_Period('+i+');return false;" '
				+ 'onmouseover="parent.CommentIconMouseOver(1,'+i+');return true;" onfocus="parent.CommentIconMouseOver(1,'+i+');return true;" onmouseout="parent.CommentIconMouseOver(0,'+i+');return true;" onblur="parent.CommentIconMouseOver(0,'+i+');return true;" styler="hyperlink" role="link" title="'+toolTip+'" aria-label="'+toolTip+'" aria-haspopup="true">'
				+ '<img styler="documenticon" src="'+NoCommentsIconImage.src+'" border="0" width="32" height="32" '
				+ 'default_icon="'+NoCommentsIcon+'" active_icon="' + ExistingCommentsIcon + '" name="comment'+i+'" id="comment'+i+'" alt="'+toolTip+'" title="'+toolTip+'"></a>'
				+ '</td></tr>';			
				sb.append(arg);
			}			
		}
		else if (View == "Exception")
		{
			for (var i=1, j=1; j<len2; i++, j++)
			{
				if ((j > 1) && (TimeCard.Records[j].Date == TimeCard.Records[j-1].Date))
				{
					i--;
					continue;
				}
				arg = '<tr><td scope="row" class="plaintablecellbold" nowrap>'+FormatDte5(TimeCard.Records[j].Date)+'</td>'
				+ modelRow.replace(/\<TIMECARD_ROW_NBR\>/g, i+"");	
				toolTip = getSeaPhrase("OPEN_COMMENTS","TE",[dteDay(TimeCard.Records[i].Date)+', '+FormatDte3(TimeCard.Records[i].Date)]);
				arg += '<td width="25" align="center"><a href="javascript:;" onclick="parent.Comments_Exception('+j+');return false;" '
				+ 'onmouseover="parent.CommentIconMouseOver(1,'+i+');return true;" onfocus="parent.CommentIconMouseOver(1,'+i+');return true;" onmouseout="parent.CommentIconMouseOver(0,'+i+');return true;" onblur="parent.CommentIconMouseOver(0,'+i+');return true;" styler="hyperlink" role="link" title="'+toolTip+'" aria-label="'+toolTip+'" aria-haspopup="true">'
				+ '<img styler="documenticon" src="'+NoCommentsIconImage.src+'" border="0" width="32" height="32" '
				+ 'default_icon="'+NoCommentsIcon+'" active_icon="'+ExistingCommentsIcon+'" name="comment'+i+'" id="comment'+i+'" alt="'+toolTip+'" title="'+toolTip+'"></a></td></tr>';
				sb.append(arg);
			}
		}
		else
		{
			for (var i=1; i<=emssObjInstance.emssObj.teDailyLines; i++)
			{
				arg = '<tr><td class="plaintablecellbold" nowrap>'+i
				+ '<input type="hidden" size="6" name="lineFc'+i+'" value="-">'
				+ '<input type="hidden" size="6" name="actdesc'+i+'" value="">'				
				+ '</td>'
				+ modelRow.replace(/\<TIMECARD_ROW_NBR\>/g, i+"")
				+ '</tr>';
				sb.append(arg);
			}
		}
		arg = '</table><input type="hidden" size="6" name="xCord" value="1">'
		+ '<input type="hidden" size="6" name="yCord" value="1">'
		+ '</form></div>';
		sb.append(arg);
	}
	else
	{
		for (var i=1; i<len2; i++)
		{
			arg = '<tr><td scope="row" class="plaintablecellbold" nowrap>'
			if (View == "Period" || View == "Exception")
				arg += FormatDte5(TimeCard.Records[i].Date);
			else
				arg += i+' &nbsp;';
			arg += '</td>';
			if (View == "Period")
			{
				SplitsIcon = (TimeCard.Records[i].IsSplit == true) ? SplitIcon2 : SplitIcon;
				toolTip = getSeaPhrase("OPEN_DAILY_WIN","TE",[dteDay(TimeCard.Records[i].Date)+', '+FormatDte3(TimeCard.Records[i].Date)]);
				arg += '<td style="text-align:center"><a href="javascript:;" onclick="parent.SplitToDaily('+i+');return false;" styler="hyperlink" role="link" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img styler="multipleentrydetailicon" src='+SplitsIcon+' width="25" height="25" border="0" '
				+ ' default_icon="'+SplitIcon+'" active_icon="'+SplitIcon2+'" name="split'+i+'" id="split'+i+'" alt="'+toolTip+'" title="'+toolTip+'"></a></td>';
			}
			sb.append(arg);
			if (View == "Period" || View == "Daily")
			{
				for (var j=1; j<len; j++)
				{
					arg = '<td class="plaintablecell" style="text-align:center">'
					var value = null;	
					switch (TimeCard.Form[j].FormField)
					{
						// PT121599: do not display pay code if pay period is historical and this line is split
						case "PAYCODE":	value = (View == "Period" && TimeCard.Records[i].IsSplit == true)?null:AGSFmtNumericPayCode(TimeCard.Records[i].PayCode); break;
						case "SHIFT": value = TimeCard.Records[i].Shift; break;
						case "JOBCODE":	value = TimeCard.Records[i].JobCode; break;
						case "POSITION": value = TimeCard.Records[i].Position; break;
						case "ACTIVITY": value = TimeCard.Records[i].Activity; break;
						case "ACCTCAT":	value = TimeCard.Records[i].AccountCategory; break;
						case "DEPARTMENT": value = TimeCard.Records[i].Department;	break;
						case "PROCLEVEL": value = TimeCard.Records[i].ProcessLevel; break;
						case "ATTENDCD": value = TimeCard.Records[i].AttendanceCode; break;
						case "OCCURRENCE": value = TimeCard.Records[i].Occurrence; break;
						case "SCHEDULE": value = TimeCard.Records[i].Schedule; break;
						case "GRADE": value = TimeCard.Records[i].Grade; break;
						case "STEP": value = TimeCard.Records[i].Step; break;
						case "GLCOMPANY": value = TimeCard.Records[i].GlCompany; break;
						case "ACCTUNIT": value = TimeCard.Records[i].AccountUnit; break;
						case "GLACCOUNT": value = TimeCard.Records[i].GlAccount; break;
						case "SUBACCT":	value = TimeCard.Records[i].SubAccount; break;
						case "COMMENTS": value = TimeCard.Records[i].Comment; break;
						case "USERFIELD1": value = TimeCard.Records[i].UserField1; break;
						case "USERFIELD2": value = TimeCard.Records[i].UserField2; break;
						case "LOCATION": value = TimeCard.Records[i].Location; break;
						case "UNITS":
							if (Number(TimeCard.Records[i].Units) != 0)
								value = FormatHours(TimeCard.Records[i].Units,TimeCard.Form[j].Size);
							else
								value = null;
							break;
						case "RATE":		
							if (Number(TimeCard.Records[i].Rate) != 0)
								value = FormatHours(TimeCard.Records[i].Rate,TimeCard.Form[j].Size);
							else
								value = null;
							break;
						case "HOURS": 		
							value = FormatHours(TimeCard.Records[i].Hours,TimeCard.Form[j].Size);
							if (value != "")
								SumHours += parseFloat(value);
							break;
						default: value = null; break;
					}
					arg += (value == null) ? "&nbsp;" : value;
					arg += '</td>'
					sb.append(arg);
				}
			}
			else
			{
				for (var j=1; j<len; j++)
				{
					arg = '<td class="plaintablecell" style="text-align:center">'
					for (var k=i; k<len2; k++)
					{
						if (TimeCard.Form[j].FormField == TimeCard.Records[k].PayCode)
						{
							value = FormatHours(TimeCard.Records[k].Hours,2.2);
							if (NonSpace(value) != 0)
								SumHours += parseFloat(value);
							break;
						}
						if (k < len2-1)
						{
							if (TimeCard.Records[k].Date != TimeCard.Records[k+1].Date)
								break;
						}
					}
					arg +=  (value == null) ? " &nbsp " : value;
					arg += '</td>';
					value = null;
					sb.append(arg);
				}		
			}
			if (View == "Period" || View == "Exception")
			{
				CommentIcon = (TimeCard.Records[i].CommentsExist == true) ? ExistingCommentsIcon : NoCommentsIcon;
				var toolTip = getSeaPhrase("OPEN_COMMENTS","TE",[dteDay(TimeCard.Records[i].Date)+', '+FormatDte3(TimeCard.Records[i].Date)]);
				arg = '<td style="text-align:center">'
				if (View == "Period")
				{
					arg += '<a href="javascript:;" onclick="parent.Comments_Period('+i+');return false;" onmouseover="parent.CommentIconMouseOver(1,'+i+');return true;" onfocus="parent.CommentIconMouseOver(1,'+i+');return true;" '
					+ 'onmouseout="parent.CommentIconMouseOver(0,'+i+');return true;" onblur="parent.CommentIconMouseOver(0,'+i+');return true;" styler="hyperlink" role="link" title="'+toolTip+'" aria-label="'+toolTip+'" aria-haspopup="true">'
				}
				else
				{
					arg += '<a href="javascript:;" onclick="parent.Comments_Exception('+i+');return false;" onmouseover="parent.CommentIconMouseOver(1,'+i+');return true;" onfocus="parent.CommentIconMouseOver(1,'+i+');return true;" '
					+ 'onmouseout="parent.CommentIconMouseOver(0,'+i+');return true;" onblur="parent.CommentIconMouseOver(0,'+i+');return true;" styler="hyperlink" role="link" title="'+toolTip+'" aria-label="'+toolTip+'" aria-haspopup="true">'
				}
				arg += '<img styler="documenticon" src="'+CommentIcon+'" border="0" width="32" height="32" '
				+ 'default_icon="' + NoCommentsIcon + '" active_icon="' + ExistingCommentsIcon + '" '
				+ 'name="comment'+i+'" id="comment'+i+'" alt="'+toolTip+'" title="'+toolTip+'"></a></td>'
				sb.append(arg);
			}
			arg = '</tr>';
			sb.append(arg);
			if (View == "Exception")
			{
				for (var k=i; k<len2; k++, i++)
				{
					if (k < len2-1)
					{
						if (TimeCard.Records[k].Date != TimeCard.Records[k+1].Date)
							break;
					}
				}
			}			
		}
		arg = '</table></form></div>';
		sb.append(arg);
		DisplayUpdate();
	}
	SumHours = roundToDecimal(SumHours,2);	
	arg = GetTotalHoursFrameInformation(SumHours);	
	arg += GetButtonFrameInformation(View);	
	sb.append(arg);
	return sb.toString();
}

function SelectIconMouseOver(flag, i,j)
{
	self.TABLE.document.getElementById('DropDownSelect'+i+j).src = (flag) ? SelectionIconOver : SelectionIcon;
}

function CommentIconMouseOver(flag, i)
{
	var CommentsObj = self.TABLE.document.getElementById("comment"+i);
	if (flag)
		CommentsObj.src = (CommentsObj.src.indexOf(ExistingCommentsIcon)>=0) ? ExistingCommentsOverIcon : NoCommentsOverIcon;
	else
		CommentsObj.src = (CommentsObj.src.indexOf(ExistingCommentsOverIcon)>=0) ? ExistingCommentsIcon : NoCommentsIcon;
}

function FillValues(View)
{
	var doc = self.TABLE.document;
	var obj = doc.forms["TimeEntry"];
	var evalObj;
	var NumRec = getDteDifference(TimeCard.StartDate, TimeCard.EndDate)+1;
	var len1 = TimeCard.Records.length;
	var len2 = TimeCard.Form.length;
	if (View == "Daily")
	{
		for (var i=1; i<=emssObjInstance.emssObj.teDailyLines; i++)
		{
			for (var j=1; j<len2; j++)
			{
				evalObj = obj.elements[TimeCard.Form[j].FormField +'_'+ i];
				evalObj.value = "";
			}
			obj.elements['lineFc'+i].value = "-";
		}
	}
	for (var i=1, k=1; i<len1; i++, k++)
	{
		if (View == "Exception" && i>1 && TimeCard.Records[i].Date == TimeCard.Records[i-1].Date)
			k--;
		if (View == "Period" || View == "Exception")
		{
			if (View == "Period")
			{
				obj.elements['lineFc'+k].value = "-";
				if (TimeCard.Records[i].IsSplit == 1)
				{
					var splitImg = doc.getElementById('split'+i);
					splitImg.src = splitImg.getAttribute("active_icon");
					obj.elements['lineFc'+i].value = "Split";
				}
				else
				{
					var splitImg = doc.getElementById('split'+i);
					splitImg.src = splitImg.getAttribute("default_icon");
				}
			}
			if (i <= NumRec) 
			{
				if (TimeCard.Records[i].CommentsExist == 1)
				{
					var cmtImg = doc.getElementById('comment'+i);
					cmtImg.src = cmtImg.getAttribute("active_icon");
				}
				else if (TimeCard.Records[i].CommentsExist != null)
				{
					var cmtImg = doc.getElementById('comment'+i);
					cmtImg.src = cmtImg.getAttribute("default_icon");
				}
			}
		}
		for (var j=1; j<len2; j++)
		{
			if (View == "Period" || View == "Daily")
			{
				if (obj.elements['lineFc'+i].value != "Split" || (obj.elements['lineFc'+i].value == "Split" && TimeCard.Form[j].FormField == "HOURS"))
				{
					evalObj = obj.elements[TimeCard.Form[j].FormField+'_'+i];
					switch (TimeCard.Form[j].FormField)
					{
						case "HOURS": 
							if (TimeCard.Records[i].Hours != null) 
								evalObj.value = FormatHours(TimeCard.Records[i].Hours,TimeCard.Form[j].Size); 
							break;
						case "PAYCODE": 
							if (TimeCard.Records[i].PayCode != null) 
								evalObj.value = AGSFmtNumericPayCode(TimeCard.Records[i].PayCode);
							TimeCard.Form[j].DME = "PRGRPPAY";
							break;
						case "SHIFT": 
							if (TimeCard.Records[i].Shift != null) 
								evalObj.value = TimeCard.Records[i].Shift;
							TimeCard.Form[j].DME = "SHIFT";
							break;
						case "JOBCODE":		
							if (TimeCard.Records[i].JobCode != null) 
								evalObj.value = TimeCard.Records[i].JobCode;
							TimeCard.Form[j].DME = "JOBCODE";
							break;
						case "POSITION":	
							if (TimeCard.Records[i].Position != null) 
								evalObj.value = TimeCard.Records[i].Position;
							TimeCard.Form[j].DME = "PAPOSITION";
							break;
						case "ACTIVITY":	
							if (TimeCard.Records[i].Activity != null) 
								evalObj.value = TimeCard.Records[i].Activity;
							TimeCard.Form[j].DME = "ACACTIVITY";
							break;
						case "ACCTCAT":		
							if (TimeCard.Records[i].AccountCategory != null) 
								evalObj.value = TimeCard.Records[i].AccountCategory;
							TimeCard.Form[j].DME = "ACACCTCAT";
							break;
						case "DEPARTMENT":	
							if (TimeCard.Records[i].Department != null) 
								evalObj.value = TimeCard.Records[i].Department;
							TimeCard.Form[j].DME = "DEPTCODE";
							break;
						case "PROCLEVEL":	
							if (TimeCard.Records[i].ProcessLevel != null) 
								evalObj.value = TimeCard.Records[i].ProcessLevel;
							TimeCard.Form[j].DME = "PRSYSTEM";
							break;
						case "ATTENDCD":	
							if (TimeCard.Records[i].AttendanceCode != null) 
								evalObj.value = TimeCard.Records[i].AttendanceCode;
							TimeCard.Form[j].DME = "ATTENDCD";
							break;
						case "OCCURRENCE":	
							if (TimeCard.Records[i].Occurrence != null) 
								evalObj.value = TimeCard.Records[i].Occurrence;
							TimeCard.Form[j].DME = "OCCURRENCE";
							break;
						case "SCHEDULE":	
							if (TimeCard.Records[i].Schedule != null) 
								evalObj.value = TimeCard.Records[i].Schedule;
							TimeCard.Form[j].DME = "PRSAGHEAD";
							break;
						case "GRADE":
							if (TimeCard.Records[i].Grade != null) 
								evalObj.value = TimeCard.Records[i].Grade;
							TimeCard.Form[j].DME = "GRADE";
							break;
						case "STEP":		
							if (TimeCard.Records[i].Step != null) 
								evalObj.value = TimeCard.Records[i].Step;
							TimeCard.Form[j].DME = "STEP";
							break;
						case "GLCOMPANY":	
							if (TimeCard.Records[i].GlCompany != null) 
								evalObj.value = TimeCard.Records[i].GlCompany;
							TimeCard.Form[j].DME = "GLSYSTEM";
							break;
						case "ACCTUNIT":	
							if (TimeCard.Records[i].AccountUnit != null) 
								evalObj.value = TimeCard.Records[i].AccountUnit;
							TimeCard.Form[j].DME = "GLNAMES";
							break;
						case "GLACCOUNT":	
							if (TimeCard.Records[i].GlAccount != null) 
								evalObj.value = TimeCard.Records[i].GlAccount;
							TimeCard.Form[j].DME = "GLMASTER";
							break;
						case "SUBACCT":		
							if (TimeCard.Records[i].SubAccount != null) 
								evalObj.value = TimeCard.Records[i].SubAccount;
							TimeCard.Form[j].DME = "GLMASTER";
							break;
						case "RATE":		
							if (TimeCard.Records[i].Rate && TimeCard.Records[i].Rate != null) 
								evalObj.value = FormatHours(TimeCard.Records[i].Rate,TimeCard.Form[j].Size);
							break;
						case "LOCATION":	
							if (TimeCard.Records[i].Location != null) 
								evalObj.value = TimeCard.Records[i].Location;	
							TimeCard.Form[j].DME = "LOCATION";
							break;
						case "UNITS":		
							if (TimeCard.Records[i].Units && TimeCard.Records[i].Units != null) 
								evalObj.value = FormatHours(TimeCard.Records[i].Units,TimeCard.Form[j].Size);
							break;
						case "COMMENTS":	
							if (TimeCard.Records[i].Comment != null) 
								evalObj.value = TimeCard.Records[i].Comment; 
							break;
						case "USERFIELD1":	
							if (TimeCard.Records[i].UserField1 != null) 
								evalObj.value = TimeCard.Records[i].UserField1; 
							break;
						case "USERFIELD2":	
							if (TimeCard.Records[i].UserField2 != null) 
								evalObj.value = TimeCard.Records[i].UserField2; 
							break;
					}
					if (evalObj.value == "null")
						evalObj.value = "";
					if (evalObj.value != "" && evalObj.value != 0 && obj.elements['lineFc'+i].value != "Split")
						obj.elements['lineFc'+i].value = "C";
				}
			}
			else
			{
				obj.elements['date'+k+'_'+j].value = TimeCard.Records[i].Date;
				evalObj = obj.elements[TimeCard.Form[j].FormField+'_'+k];
				if (TimeCard.Form[j].FormField == TimeCard.Records[i].PayCode)
				{
					evalObj.value = Number(FormatHours(TimeCard.Records[i].Hours,5.2));
					evalObj.value = roundToDecimal(evalObj.value,2);
					obj.elements['lineFc'+k+'_'+j].value = "C";
					obj.elements['seqnbr'+k+'_'+j].value = TimeCard.Records[i].TimeSeq;
					obj.elements['date'+k+'_'+j].value = TimeCard.Records[i].Date;
				}
				if (evalObj.value == "null")
					evalObj.value = "";
			}
		}
	}
	TotalHours();
	stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[getWinTitle(self.TABLE)]));
	DisplayUpdate(View);
}

function DisplayUpdate(View)
{
	if (TimeCard.ManagerFlag && TimeCard.RecordUpdate == "Submitted")
		TimeCard.RecordUpdate = "Updated";
	var msg = null;
	switch (TimeCard.RecordUpdate)
	{
		case "Updated":
			if (View == "Daily")
				msg = getSeaPhrase("CARD_FOR","TE")+FormatDte3(UpdatedPeriodStartDate)+getSeaPhrase("BEEN_UPDATED","TE");
			else
				msg = getSeaPhrase("CARD_FOR","TE")+FormatDte3(UpdatedPeriodStartDate)+getSeaPhrase("TO","TE")+FormatDte3(UpdatedPeriodEndDate)+getSeaPhrase("BEEN_UPDATED","TE");
			break;
		case "Submitted":
			if (View == "Daily")
			{
				if (TimeCard.Status == 1)	
					msg = getSeaPhrase("SUBMITTED_CARD_FOR","TE")+FormatDte3(UpdatedPeriodStartDate)+getSeaPhrase("BEEN_UPDATED","TE");
				else
					msg = getSeaPhrase("CARD_FOR","TE")+FormatDte3(UpdatedPeriodStartDate)+getSeaPhrase("BEEN_UPDATED","TE");
			}
			else
				msg = getSeaPhrase("CARD_FOR","TE")+FormatDte3(UpdatedPeriodStartDate)+getSeaPhrase("TO","TE")+FormatDte3(UpdatedPeriodEndDate)+getSeaPhrase("SUBMITTED_FOR_APPROVAL","TE");
			break;
	}
	if (msg)	
		seaPageMessage(msg, null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
	try
	{
		if (opener && opener.Reports)
		{
			opener.close();
			if (navigator.appName.indexOf("Microsoft") >= 0)
				opener = null;
		}
	}
	catch(e) {}
	TimeCard.RecordUpdate = "";
	ReleaseSemaphore();
}

var lastHourCheckFailed = false;
var lastI = -1;
var lastJ = -1;

//****************************************************************************************
//If the user changes a text field, determine what record needs to get updated and update
//that record on the object. Delete objects do not get deleted from here, the lineFC is
//only marked so that if the user wants to the information back they can undo the delete.
//****************************************************************************************
function TextChanged(textBox, onBlur)
{
	var value = textBox.value;
	var formNameObject = textBox.name;
	var timeObject = self.TABLE.document.forms["TimeEntry"];
	var i = timeObject.elements['yCord'].value;
	var j = timeObject.elements['xCord'].value;
	var NumRecs = 0;
	var lineObject;
	var label;
    try
    {
		if (typeof(TimeCard.Form[j].OffsetPayCode) != "undefined")
			lineObject = timeObject.elements['lineFc'+i+'_'+j];
		else
			lineObject = timeObject.elements['lineFc'+i];
		if (typeof(lineObject.value) == "undefined")
			lineObject.value = "-";
		if (lineObject.value == "Split" && !onBlur)
		{
			timeObject.elements[formNameObject].value = "";
			if (TimeCard.Form[j].FormField == "HOURS")
				timeObject.elements[TimeCard.Form[j].FormField+'_'+i].value = FormatHours(TimeCard.Records[i].Hours,TimeCard.Form[j].Size);
			if (HS36ErrorField)
				clearRequiredField(HS36ErrorField);
			HS36ErrorField = timeObject.elements[TimeCard.Form[j].FormField+'_'+i];
			HS36LastI = i;
			HS36LastJ = j;	
			var focusFnc = function(){setFocusOn(i,j)};
			setRequiredField(timeObject.elements[TimeCard.Form[j].FormField+'_'+i], getSeaPhrase("USE_DAILY_TE_CHANGE_MULTIENTRIED","TE"), focusFnc);
			return true;
		}
		else if (lineObject.value == "Split" && onBlur && timeObject.elements[TimeCard.Form[j].FormField+'_'+i].value != FormatHours(TimeCard.Records[i].Hours,TimeCard.Form[j].Size))
		{
		  ;
  		}
		else
		{
			if (lineObject.value == "-" && typeof(value) != "undefined" && NonSpace(value) > 0)
				lineObject.value = "A";
			else if (lineObject.value == "A" && NonSpace(value) == 0)
			{
				lineObject.value = "-";
				for (var k=1; k<TimeCard.Form.length; k++)
				{
					var tmpVal = timeObject.elements[TimeCard.Form[k].FormField+'_'+i].value;
					if (typeof(tmpVal) != "undefined" && NonSpace(tmpVal) > 0)
					{
						lineObject.value = "A"
						break;
					}
				}
			}
			else if (lineObject.value == "D" && NonSpace(value) > 0 && parseFloat(value) != 0)
				lineObject.value = "C";
			else if (lineObject.value == "C" && NonSpace(value) == 0 && parseFloat(value) != 0)
			{
				lineObject.value = "D";
				if (typeof(TimeCard.Form[j].OffsetPayCode) == "undefined")
				{
					for (var k=1; k<TimeCard.Form.length; k++)
					{
						var tmpVal = timeObject.elements[TimeCard.Form[k].FormField+'_'+i].value;
						if (typeof(tmpVal) != "undefined" && NonSpace(tmpVal) > 0)
						{
							lineObject.value = "C";
							break;
						}
					}
				}
			}
			label = TimeCard.Form[j].FormField;
			var tmpVal2 = timeObject.elements[TimeCard.Form[j].FormField +'_'+ i].value;
			if ((label == "HOURS" || label == "RATE" || label == "SHIFT" || label == "GLACCOUNT" || label == "GLCOMPANY" || label == "ACCOUNT" || label == "SUBACCT" || label == "STEP" || label == "UNITS") && typeof(tmpVal2) != "undefined" && NonSpace(tmpVal2) > 0)
			{				
				if (CheckNumeric(i,j))
					return true;
			}
			else if (typeof(TimeCard.Form[j].OffsetPayCode) != "undefined" && typeof(tmpVal2) != "undefined" && NonSpace(tmpVal2) > 0)
			{	
				if (CheckNumeric(i,j))
					return true;
			}
			if (label == "HOURS" && !emssObjInstance.emssObj.teAllowNegativeHours && typeof(tmpVal2) != "undefined" && NonSpace(tmpVal2) > 0)
			{
				if (CheckPositiveNumber(i,j))
					return true;
			}
			else if (typeof(TimeCard.Form[j].OffsetPayCode) != "undefined" && !emssObjInstance.emssObj.teAllowNegativeHours && typeof(tmpVal2) != "undefined" && NonSpace(tmpVal2) > 0)
			{
				if (CheckPositiveNumber(i,j))
					return true;
			}
			if (typeof(TimeCard.Form[j].OffsetPayCode) != "undefined")
				TotalHours();
			if (label == "HOURS" || label == "RATE" || label == "UNITS")
			{
				if (label == "HOURS")
				{
					//only validate 24 hour edit onblur
					if (onBlur && lastHourCheckFailed == false && Check24HourEdit(i,j))			
						return true;
				}
				var sizeString = String(TimeCard.Form[j].Size);
				if (sizeString.indexOf(".")== -1)
					sizeString = String(Number(TimeCard.Form[j].Size)/10);
				var numberDecimals = sizeString.split(".");
				timeObject = timeObject.elements[TimeCard.Form[j].FormField+'_'+i];
				if (numberDecimals.length == 2)
					timeObject.value = roundToDecimal(timeObject.value, Number(numberDecimals[1]));
				else
					timeObject.value = roundToDecimal(timeObject.value, 0);
				if (parseFloat(timeObject.value) == 0.00)
					timeObject.value = "";
				if (label == "HOURS")
					TotalHours();
			}
			if (label == "PAYCODE")
			{
				timeObject = timeObject.elements[TimeCard.Form[j].FormField+'_'+i];
				if (timeObject.value == "=OFF")
				{
					IgnorePeriodOutOfRangeAndLockOut = true;
					window.status = getSeaPhrase("VIEWS_OFF","TE");
					timeObject.value = "";
				}
				else if (timeObject.value == "=ON")
				{
					IgnorePeriodOutOfRangeAndLockOut = false;
					window.status = getSeaPhrase("VIEWS_ON","TE");
					timeObject.value = "";
				}
			}
		}
		if (!onBlur && lineObject.value != "-")
			boolSaveChanges = true;
    }
    catch(e) {}
	return false;
}

function Check24HourEdit(i,j)
{
	var timeObject = self.TABLE.document.forms["TimeEntry"];
	var timeTextBox = timeObject.elements[TimeCard.Form[j].FormField+'_'+i];
    if (!timeTextBox || typeof(timeTextBox.value) == "undefined")
    	return false;
	if (TimeCard.StartDate == TimeCard.EndDate)
	{
		if (emssObjInstance.emssObj.teDaily24HourEdit && TotalHours(true) > 24)
		{
			//timeObject.elements[TimeCard.Form[j].FormField+'_'+i].value = "";
			if (HS36ErrorField)
				clearRequiredField(HS36ErrorField);		
			HS36LastI = i;
			HS36LastJ = j;		
			HS36ErrorField = timeObject.elements[TimeCard.Form[j].FormField+'_'+i];
			var focusFnc = function(){setFocusOn(i,j)};
			setRequiredField(timeObject.elements[TimeCard.Form[j].FormField+'_'+i], getSeaPhrase("NO_MORE_THAN_24_HOURS","TE"), focusFnc);
			lastHourCheckFailed = true;
			lastI = i;
			lastJ = j;			
			return true; // 24-hour edit occurred
		}
	}
	else
	{
		if (emssObjInstance.emssObj.tePeriod24HourEdit)
		{
			if (parseFloat(timeObject.elements[TimeCard.Form[j].FormField+'_'+i].value) > 24)
			{
				//timeObject.elements[TimeCard.Form[j].FormField+'_'+i].value = FormatHours(TimeCard.Records[i].Hours,TimeCard.Form[j].Size);
				if (HS36ErrorField)
					clearRequiredField(HS36ErrorField);		
				HS36LastI = i;
				HS36LastJ = j;		
				HS36ErrorField = timeObject.elements[TimeCard.Form[j].FormField+'_'+i];
				var focusFnc = function(){setFocusOn(i,j)};
				setRequiredField(timeObject.elements[TimeCard.Form[j].FormField+'_'+i], getSeaPhrase("NO_MORE_THAN_24_HOURS","TE"), focusFnc);
				lastHourCheckFailed = true;
				lastI = i;
				lastJ = j;				
				return true; // 24-hour edit occurred
			}
		}
	}
	lastHourCheckFailed = false;
	return false; // 24-hour edit did not occur
}

function CheckNumeric(i,j)
{
	var timeObject = self.TABLE.document.forms["TimeEntry"];
	var timeTextBox = timeObject.elements[TimeCard.Form[j].FormField+'_'+i];
    if (!timeTextBox || typeof(timeTextBox.value) == "undefined")
    	return false;
	var numVal = Number(timeTextBox.value);
	if (isNaN(numVal))
	{
		//timeObject.elements[TimeCard.Form[j].FormField+'_'+i].value = "";
		if (HS36ErrorField)
			clearRequiredField(HS36ErrorField);			
		HS36LastI = i;
		HS36LastJ = j;			
		HS36ErrorField = timeObject.elements[TimeCard.Form[j].FormField+'_'+i];
		var focusFnc = function(){setFocusOn(i,j)};
		setRequiredField(timeObject.elements[TimeCard.Form[j].FormField+'_'+i], getSeaPhrase("VALUE_BE_NUMERIC","TE"), focusFnc);
		return true;		
	}
	return false;
}

function CheckPositiveNumber(i,j)
{
	var timeObject = self.TABLE.document.forms["TimeEntry"];
	var timeTextBox = timeObject.elements[TimeCard.Form[j].FormField+'_'+i];
    if (!timeTextBox || typeof(timeTextBox.value) == "undefined")
    	return false;
	var numVal = Number(timeTextBox.value);
	if (!isNaN(numVal) && numVal < 0)
	{
		//timeObject.elements[TimeCard.Form[j].FormField+'_'+i].value = "";
		if (HS36ErrorField)
			clearRequiredField(HS36ErrorField);			
		HS36LastI = i;
		HS36LastJ = j;			
		HS36ErrorField = timeObject.elements[TimeCard.Form[j].FormField+'_'+i];
		var focusFnc = function(){setFocusOn(i,j)}; 
		setRequiredField(timeObject.elements[TimeCard.Form[j].FormField+'_'+i], getSeaPhrase("VALUE_BE_POSITIVE","TE"), focusFnc);
		return true;		
	}
	return false;
}

//****************************************************************************************
//Total up hours on the form, NOT the object, (REAL TIME TOTALS) and display the value
//received in the total hours form text box.
//****************************************************************************************
function TotalHours(flag)
{
	var timeObject;
	var Sum = 0.00;
	var Hours = 0;
	Over24Flag = false;
	if (TimeCard.StartDate == TimeCard.EndDate)
		NumRec = emssObjInstance.emssObj.teDailyLines;
	else
		NumRec = getDteDifference(TimeCard.StartDate, TimeCard.EndDate)+1;
	var timeForm = self.TABLE.document.forms["TimeEntry"];
	for (var i=1; i<=NumRec; i++)
	{
		if (typeof(timeForm.elements["HOURS_"+i]) == "undefined")
		{
			Hours = 0;
			for (var j=1; j<TimeCard.Form.length; j++)
			{
				timeObject = timeForm.elements[TimeCard.Form[j].FormField+'_'+i];
				if (timeObject && timeObject.value != "" && typeof(timeObject.value) != "undefined")
				{
					if (__View == "Exception" && !isNaN(timeObject.value))
						Hours += parseFloat(timeObject.value);
					else if (TimeCard.Form[j].FormField == "HOURS" && !isNaN(timeObject.value))
						Hours += parseFloat(timeObject.value);
				}
			}
			Hours = roundToDecimal(Hours,2);
			if (Hours != "")
				Sum += parseFloat(Hours);
		}
		else
		{
			Hours = 0;
			timeObject = timeForm.elements["HOURS_"+i];
			if (timeObject && timeObject.value != "" && !isNaN(parseFloat(timeObject.value)))
			{
				Hours = parseFloat(timeObject.value);
				Hours = roundToDecimal(Hours,2);
				if (Hours != "")
					Sum += parseFloat(Hours);
			}
		}
		if (TimeCard.StartDate != TimeCard.EndDate && emssObjInstance.emssObj.tePeriod24HourEdit && Hours > 24)
			Over24Flag = true;
	}
	Sum = roundToDecimal(Sum,2);
	self.TABLE.document.getElementById("TotalHoursSpan").innerHTML = Sum;
	if (TimeCard.StartDate == TimeCard.EndDate && emssObjInstance.emssObj.teDaily24HourEdit && Sum > 24)
		Over24Flag = true;
	// PTs 102449, 105365: always return the total number of hours so that the 24-hour edit can
	// be enforced.  This number is used by the Check24HourEdit function to produce the alert.
	return Sum;
}

//****************************************************************************************
//Close all windows and itself to quit Time Entry
//****************************************************************************************
function DoneClicked(View)
{
	if (boolSaveChanges || bSelectChanged)
		SaveChanges("CloseTimeEntry()", View);
	else
		CloseTimeEntry();
}

function BackToListClicked(View)
{
	if (boolSaveChanges || bSelectChanged)
		SaveChanges("CloseTimeEntry('BackToList')", View);
	else
		CloseTimeEntry("BackToList");
}

function BackToSummary(thisBtn,View)
{
	if (ClickedBackToSummary)
		return;
	ClickedBackToSummary = true;
	if (boolSaveChanges || bSelectChanged)
	{
		SaveChanges("CloseTimeEntry('BackToSummary')", View);
		ClickedBackToSummary = false;
	}
	else
		CloseTimeEntry("BackToSummary");
}

function CloseTimeEntry()
{
	CloseChildPopupWindows();
	if (DoesObjectExist(TimeCard) && !TimeCard.ManagerFlag)
	{
		try
		{
			if (opener)
			{
				opener.focus();
				self.close();
			}
			else if (self != parent && window.name == "DETAIL" && parent.opener)
			{
				parent.opener.focus();
				parent.close();
			}
			else
				self.location = "/lawson/xhrnet/timeentry/employee/timeentrysplash.htm";
		}	
		catch(e)
		{
			self.location = "/lawson/xhrnet/timeentry/employee/timeentrysplash.htm";
		}
	}
	else
	{
		try
		{
			if (arguments.length > 0 && arguments[0] == "BackToSummary")
			{
				var strUrl = "/lawson/xhrnet/timeentry/manager/summaryapproval.htm?plancode="+escape(Employee.PayPlan,1)+"&startdate="+escape(TimeCard.StartDate,1);
				if (typeof(parent["CloseDetailFrame"]) == "function")
					parent.CloseDetailFrame(strUrl);
				else
					window.location.replace(strUrl);
			}
			else if (arguments.length>0 && arguments[0] == "BackToList")
			{
				if (!NoSummaryFlag)
					prm = "summary";
				var strUrl = "/lawson/xhrnet/timeentry/manager/manager.htm?type="+escape(prm,1);
				if (typeof(parent["CloseDetailFrame"]) == "function")
					parent.CloseDetailFrame();
				else
					window.location.replace(strUrl);
				if (opener)
					self.close();
			}
			else if (opener)
				self.close();
			else if (self != parent && window.name == "DETAIL" && parent.opener)
				parent.close();
			else if (self != parent && window.name == "DETAIL" && parent.parent == top && top.opener)
				parent.parent.close();
			else
				self.location = "/lawson/xhrnet/timeentry/employee/timeentrysplash.htm";
		}
		catch(e)
		{
			self.location = "/lawson/xhrnet/timeentry/employee/timeentrysplash.htm";
		}
	}
}

function CloseChildPopupWindows()
{
	try
	{
		if (typeof(TipsWin) != "undefined" && !TipsWin.closed)
			TipsWin.close();
	}
	catch(e) {}
	try
	{
		if (typeof(TimeOffWindow) != "undefined" && !TimeOffWindow.closed)	
			TimeOffWindow.close();
	}
	catch(e) {}
	try
	{
		if (typeof(SelectWindow) != "undefined" && !SelectWindow.closed)	
			SelectWindow.close();
	}
	catch(e) {}
	try
	{
		if (typeof(ACTSDWIND) != "undefined" && !ACTSDWIND.closed)	
			ACTSDWIND.close();
	}
	catch(e) {}
	try
	{
		if (typeof(Calendar.calendarWindow) != "undefined" && !Calendar.calendarWindow.closed)
			Calendar.calendarWindow.close();
	}
	catch(e) {}
	try
	{
		if (typeof(Comments.commentsWindow) != "undefined" && Comments.commentsWindow && !Comments.commentsWindow.closed)
			Comments.commentsWindow.close();
	} 
	catch(e) {}
	try
	{
		if (typeof(hSaveChanges) != "undefined" && !hSaveChanges.closed)
			hSaveChanges.close()
	}
	catch(e) {}
	stopProcessing();
}

function ErrorFieldFound()
{	
	var timeObject = self.TABLE.document.forms["TimeEntry"];
	var lineObject;
	var textBox;
	try
	{
		// make sure the last field in error has been corrected
		if (HS36ErrorField)
		{
			timeObject.elements['yCord'].value = HS36LastI;
			timeObject.elements['xCord'].value = HS36LastJ;
			textBox = timeObject.elements[TimeCard.Form[HS36LastJ].FormField+'_'+HS36LastI];
			if (typeof(TimeCard.Form[HS36LastJ].OffsetPayCode) != "undefined")
				lineObject = timeObject.elements['lineFc'+HS36LastI+'_'+HS36LastJ];
			else
				lineObject = timeObject.elements['lineFc'+HS36LastI];
			if (typeof(lineObject.value) == "undefined") 
				lineObject.value = "-";	
			// make sure we don't validate a split line
			if (lineObject.value != "Split")
			{	
				if (TextChanged(textBox, true) == true)
					return true;
			}
			clearRequiredField(HS36ErrorField);
			HS36ErrorField = null;			
		}
		// check for a day that has more than 24 hours, if that edit is set to be enforced.
		lastHourCheckFailed = false;		
		// check all fields on the form to catch any fields that may be in error
		var foundError = false;
		var len = TimeCard.Form.length;
		var len2 = TimeCard.Records.length;
		for (var i=1; i<len2; i++)
		{
			for (var j=1; j<len; j++)
			{
				textBox = timeObject.elements[TimeCard.Form[j].FormField+'_'+i];
				timeObject.elements['yCord'].value = i;
				timeObject.elements['xCord'].value = j;
				if (typeof(TimeCard.Form[j].OffsetPayCode) != "undefined")
					lineObject = timeObject.elements['lineFc'+i+'_'+j];
				else
					lineObject = timeObject.elements['lineFc'+i];
				if (typeof(lineObject.value) == "undefined") 
					lineObject.value = "-";
				if (lineObject.value == "Split")
					continue;			
				if (TextChanged(textBox, true) == true)
				{
					foundError = true;
					break;
				}
			}
		}
		return foundError;
	}
	catch(e)
	{
		HS36ErrorField = null;
	}
	return false;	
}

var resubmitFlag = null;
var resubmitForException = -1;
var resubmitArgs = new Array();

function UpdateTimeCard(View)
{
	if (typeof(authUser.prodline) == "unknown" || typeof(authUser.prodline) == "undefined")
	{
		authenticate("frameNm='jsreturn'|funcNm='UpdateTimeCard(\""+View+"\")'|desiredEdit='EM'")
		return;
	}
	if (!appObj)
		appObj = new AppVersionObject(authUser.prodline, "HR");
	// if you call getAppVersion() right away and the IOS object isn't set up yet,
	// then the code will be trying to load the sso.js file, and your call for
	// the appversion will complete before the ios version is set
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
       	setTimeout("UpdateTimeCard('"+View+"')", 10);
       	return;
	}
	__View = View;
	//clientside error validation
	if (ErrorFieldFound())
	{	
		stopProcessing();
		return;		
	}
	var timeObject = self.TABLE.document.forms["TimeEntry"];
	var browser = new SEABrowser();
	var MultiUpdate = (arguments.length == 3 && arguments[2]) ? true : false;
	if (!Semaphore)
	{
		LockOutChanges();
		self.lawheader.fieldcount = 0;
		self.lawheader.formlinecount = 0;
		self.lawheader.linecount 	= 0;
		self.lawheader.count = 1;
		self.lawheader.numberUsed = 0;
		self.lawheader.BreakOut = false;
		if (resubmitFlag == null)
			resubmitForException = -1;
		resubmitArgs = arguments;
		if (!MultiUpdate && resubmitFlag == null)
		{
			if (arguments.length == 1 && (TimeCard.Status == 1 || TimeCard.Status == 4) && !TimeCard.ManagerFlag)
			{
				stopProcessing();
				var confirmResponse = seaConfirm(getSeaPhrase("RESUBMIT_CARD?","TE"), "", ConfirmResubmitCard);
				if (typeof(confirmResponse) == "undefined" || confirmResponse == null)
				{
					resubmitFlag = 1;
					return;
				}
				if (!confirmResponse) 
				{
					resubmitForException = 0;
					TimeCard.Status = (View == "Exception") ? -1 : 0;
				} 
				else 
				{
					resubmitForException = 1;
					TimeCard.Status = 1;
				}
			}
			else if (TimeCard.ManagerFlag && (TimeCard.Status == 0 || TimeCard.Status == -1))
				TimeCard.Status = 1;
			else if (!TimeCard.ManagerFlag && (TimeCard.Status == 0 || TimeCard.Status == -1))
				TimeCard.Status = " ";
		}
		if (resubmitFlag != null && resubmitFlag == 1)	
			resubmitFlag = null;
		var DailyFlag = ((TimeCard.StartDate == TimeCard.EndDate) && (TimeCard.StartDate != "")) ? "Y" : "N"
		if (isNaN(TimeCard.Status))
			TimeCard.Status = " ";
		var obj = new AGSObject(authUser.prodline, "HS36.1");
		obj.event = "CHANGE";
		obj.rtn	= "DATA";
		obj.longNames = true;
		obj.lfn	= "ALL";
		obj.tds	= false;
		if (browser.IsNS && browser.version < 6)
			obj.callmethod = "get";
		obj.field = "FC=U"
		+ "&PPT-COMPANY=" + escape(authUser.company)
		+ "&PPT-EMPLOYEE=" + escape(Employee.EmployeeNbr)
		+ "&FROM-DATE=" + escape(TimeCard.StartDate)
		+ "&TO-DATE=" + escape(TimeCard.EndDate)
		+ "&DAILY=" +DailyFlag
		+ "&PRINT=N";
		obj.field += (View == "Exception") ? "&EMP-EXCEPTION=Y" : "&EMP-EXCEPTION=N";
		obj.field += (TimeCard.ManagerFlag) ? "&MANAGER-FLAG=Y" : "&MANAGER-FLAG=N";
		obj.field += "&PPT-TIMECARD-TYPE=" + TimeCard.TimeCardType;
		if (appObj && (appObj.getAppVersion() != null) && (appObj.getAppVersion().toString() >= "09.00.00"))
			obj.field += "&PPT-USER-ID=W" + authUser.employee;
		var lineObject = (View == "Exception") ? timeObject.elements["lineFc1_1"] : timeObject.elements["lineFc1"];
		UpdatedPeriodStartDate = TimeCard.StartDate;
		UpdatedPeriodEndDate = TimeCard.EndDate;
		if (typeof(lineObject) != "undefined")
		{
			var TimeCardData = (View == "Exception") ? GatherTimeCardData_Exception() : GatherTimeCardData(View);
			if (MultiUpdate && TimeCardData.length == 0 && View == "Exception")
			{
				self.lawheader.LineIndex = 1;
				self.lawheader.ColIndex = 1;
				var nexFunc;
				if (TimeCard.Status == 1)
					nextFunc = (arguments.length == 2 && arguments[1] && arguments[1] != "Submitted") ? "FinishedHS36('Submitted',true)" : "FinishedHS36('Submitted',false)";
				else
					nextFunc = (arguments.length == 2 && arguments[1] && arguments[1] != "Updated") ? "FinishedHS36('Updated',true)" : "FinishedHS36('Updated',false)";
				eval(nextFunc);
				return;
			}
			if ((TimeCardData.length == 0 && View != "Exception" && !TimeCard.ManagerFlag) || (TimeCardData.length == 0 && TimeCard.Status == 0 && View == "Exception"))
			{
				stopProcessing();
				seaAlert(getSeaPhrase("ENTER_TIME_TO_UPDATE","TE"), null, null, "error");
				ReleaseSemaphore();
				return;
			}
			else
			{
				if (View == "Exception")
				{
					if (!TimeCard.ManagerFlag && resubmitFlag == null)
					{
						if (TimeCard.Status >= 1 && ((TimeCardData.length == 0 && (arguments.length == 1)) || arguments.length == 1)) 
						{
							if (resubmitForException != -1) 
							{
								TimeCard.Status = resubmitForException
								resubmitForException = -1
							} 
							else 
							{
								stopProcessing();
								var confirmResponse = seaConfirm(getSeaPhrase("RESUBMIT_CARD?","TE"), "", ConfirmResubmitCard);
								if (typeof(confirmResponse) == "undefined" || confirmResponse == null)
								{
									resubmitFlag = 2;
									return;
								}								
								TimeCard.Status = (!confirmResponse) ? 0 : 1;
							}
						} 
						else if (arguments.length == 2 && arguments[1] && arguments[1] == "Submitted")
							TimeCard.Status = 1;
						else if (TimeCardData.length)
							TimeCard.Status = 0;
					}
				}
				if (resubmitFlag != null && resubmitFlag == 2)	
					resubmitFlag = null;
				if (TimeCard.ManagerFlag && resubmitFlag == null)
				{
					if (TimeCardData.length == 0 && TimeCard.Status >= 0)
					{
						stopProcessing();
						var confirmResponse = seaConfirm(getSeaPhrase("CLEAR_CARD?_OK_FOR_NON_EXCEPTION","TE"), "", ConfirmResubmitCard);
						if (typeof(confirmResponse) == "undefined" || confirmResponse == null)
						{
							resubmitFlag = 3;
							return;
						}
						TimeCard.Status = (!confirmResponse) ? 0 : 1;
					}
				}
				if (resubmitFlag != null && resubmitFlag == 3)	
					resubmitFlag = null;
				obj.field += "&STATUS=" + escape(TimeCard.Status);
				if (TimeCardData != "AllSplits")
					obj.field += TimeCardData;
			}
		}
		else
			obj.field += "&STATUS=" + escape(TimeCard.Status);	
		obj.dtlField = "LINE-FC;PPT-TIME-SEQ;PPT-DATE;PPT-PAY-CODE;PPT-SHIFT;PPT-JOB-CODE;PPT-POSITION;PPT-ACTIVITY;PPT-ACCT-CATEGORY;"
		+"PPT-DEPARTMENT;PPT-PROCESS-LEVEL;PPT-ATTEND-CODE;PPT-OCCURRENCE;PPT-SCHEDULE;PPT-PAY-GRADE;PPT-PAY-STEP;"
		+"PPT-GL-COMPANY;PPT-ACCT-UNIT;PPT-ACCOUNT;PPT-SUB-ACCOUNT;PPT-COMMENT;PPT-USERFIELD1;PPT-USERFIELD2;PPT-RATE;"
		+"PPT-ACTIVITY-DESC;PPT-HOURS;PPT-LOCAT-CODE;PPT-PAY-UNITS";
		if (TimeCard.Status == 1)
			obj.func = (arguments.length == 2 && arguments[1] && arguments[1] != "Submitted") ? "parent.FinishedHS36('Submitted',true)" : "parent.FinishedHS36('Submitted',false)";
		else
			obj.func = (arguments.length == 2 && arguments[1] && arguments[1] != "Updated") ? "parent.FinishedHS36('Updated',true)" : "parent.FinishedHS36('Updated',false)";
		obj.out	= "JAVASCRIPT";
		obj.debug = false;
		EmployeeTemp = new EmployeeObject();
		TimeCardTemp = new TimeCardObject();
		resubmitFlag = null;
		AGS(obj, "jsreturn");
		ClickedBackToSummary = false;
	}
}

function ConfirmResubmitCard(confirmWin)
{
	ReleaseSemaphore();
	var confirmResponse = (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue");
	var msg = getSeaPhrase("PROCESSING_WAIT","ESS");
	switch (resubmitFlag)
	{
		case 1:
			if (!confirmResponse) // untested for PT 178979 due to issues with Firefox/3.0.3 
			{
				resubmitForException = 0;
				TimeCard.Status = (__View == "Exception") ? -1 : 0;
			}
			else
			{
				resubmitForException = 1;
				TimeCard.Status = 1;	
			}
			if (__View == "Exception")
				msg = getSeaPhrase("UPDATING_EXCEPTION_TE","TE");
			else
				msg = getSeaPhrase("UPDATING_PERIOD_TE","TE");
			break;
		case 2:
		case 3:
			TimeCard.Status = (!confirmResponse) ? 0 : 1;
			break;
	}
	startProcessing(msg, function(){UpdateTimeCard.apply(this, resubmitArgs);});
}

function GatherTimeCardData(View)
{
	var obj = self.TABLE.document.forms["TimeEntry"];
	var returnString = "";
	var FormValue = "";
	var AGSValue = "";
	var actDesc = "";
	var NumRecs = 0;
	var _COLUMNSAVED = 1;
	var SplitExists = false;
	var AllSplits = true;
	if (View == "Period" || View == "Exception")
		NumRecs = TimeCard.Records.length - 1;
	else
		NumRecs = emssObjInstance.emssObj.teDailyLines;
	for (var i=1; i<=NumRecs; i++)
	{
		if (obj.elements['lineFc'+i].value == "D" && TimeCard.Records[i] && typeof(TimeCard.Records[i].TimeSeq) != "undefined")
		{
			AllSplits = false;
			returnString += "&LINE-FC"+i+"=D&PPT-TIME-SEQ"+i+"="+TimeCard.Records[i].TimeSeq
			+ "&PPT-DATE"+i+"="+TimeCard.Records[i].Date
		}
		else if (obj.elements['lineFc'+i].value== "C" || obj.elements['lineFc'+i].value == "A")
		{
			AllSplits = false;
			if (obj.elements['lineFc'+i].value == "C")
				returnString += "&LINE-FC"+i+"=C&PPT-TIME-SEQ"+i+"="+TimeCard.Records[i].TimeSeq;
			else
				returnString += "&LINE-FC"+i+"=A";
			if (View == "Period" || View == "Exception")
				returnString += "&PPT-DATE"+i+"="+TimeCard.Records[i].Date;
			else
				returnString += "&PPT-DATE"+i+"="+TimeCard.StartDate;
			for (var j=1; j<TimeCard.Form.length; j++)
			{
				if (View == "Period" || View == "Daily")
				{
					switch (TimeCard.Form[j].FormField)
					{
						case "PAYCODE":	AGSValue = "PPT-PAY-CODE"; break;
						case "SHIFT": AGSValue = "PPT-SHIFT"; break;
						case "JOBCODE":	AGSValue = "PPT-JOB-CODE"; break;
						case "POSITION": AGSValue = "PPT-POSITION"; break;
						case "ACTIVITY": AGSValue = "PPT-ACTIVITY"; break;
						case "ACCTCAT":	AGSValue = "PPT-ACCT-CATEGORY"; break;
						case "DEPARTMENT": AGSValue = "PPT-DEPARTMENT"; break;
						case "PROCLEVEL": AGSValue = "PPT-PROCESS-LEVEL"; break;
						case "ATTENDCD": AGSValue = "PPT-ATTEND-CODE"; break;
						case "OCCURRENCE": AGSValue = "PPT-OCCURRENCE"; break;
						case "SCHEDULE": AGSValue = "PPT-SCHEDULE"; break;
						case "GRADE": AGSValue = "PPT-PAY-GRADE"; break;
						case "STEP": AGSValue = "PPT-PAY-STEP"; break;
						case "GLCOMPANY": AGSValue = "PPT-GL-COMPANY"; break;
						case "ACCTUNIT": AGSValue = "PPT-ACCT-UNIT"; break;
						case "GLACCOUNT": AGSValue = "PPT-ACCOUNT"; break;
						case "SUBACCT":	AGSValue = "PPT-SUB-ACCOUNT"; break;
						case "COMMENTS": AGSValue = "PPT-COMMENT"; break;
						case "USERFIELD1": AGSValue = "PPT-USERFIELD1"; break;
						case "USERFIELD2": AGSValue = "PPT-USERFIELD2"; break;
						case "RATE": AGSValue = "PPT-RATE"; break;
						case "HOURS": AGSValue = "PPT-HOURS"; break;
						case "LOCATION": AGSValue = "PPT-LOCAT-CODE"; break;
						case "UNITS": AGSValue = "PPT-PAY-UNITS"; break;		
					}
				}
				FormValue = escape(obj.elements[TimeCard.Form[j].FormField+'_'+i].value); //Store value from form
				if (FormValue!="")
				{
					actDesc = "";
					FormValue = AGSFmtNumericPayCode(FormValue);
					if (TimeCard.Form[j].FormField == "ACTIVITY")
						actDesc = "&PPT-ACTIVITY-DESC"+i+"="+escape(obj.elements['actdesc'+i].value);
					returnString += "&"+AGSValue+i+"="+FormValue.toUpperCase()+actDesc.toUpperCase();
				}
				else
					returnString += "&"+AGSValue+i+"="+escape(" ");
			}
		}
		else if (obj.elements['lineFc'+i].value == "Split")
			SplitExists = true;
	}
	if (AllSplits && SplitExists)
		return "AllSplits";
	else
		return returnString;
}

function AGSFmtNumericPayCode(paycode)
{
	if (typeof(paycode) == "undefined" || paycode == null || !paycode)
		paycode = "";
	var result = paycode;
	if (paycode.toString().charAt(0) == "_")
	{
		var tmpVal = paycode.substring(1);
		if (!isNaN(parseFloat(tmpVal)))
			result = tmpVal;
	}
	return result;
}

function GatherTimeCardData_Exception()
{
	var obj = self.TABLE.document.forms["TimeEntry"];
	var returnString = "";
	var FormValue = "";
	var RecordCount = 1;
	var LineIndex = self.lawheader.LineIndex;
	var ColIndex = self.lawheader.ColIndex;
	var LineFcIndex = 1;
	if (LineIndex > 1 || ColIndex > 1)
		TimeCard.Form = self.lawheader.TimeForm;
	while (LineIndex <= (getDteDifference(TimeCard.StartDate, TimeCard.EndDate) + 1))
	{
		for (var j=ColIndex; j<TimeCard.Form.length; j++)
		{
			if (obj.elements['lineFc'+LineIndex+'_'+j].value == "D")
			{
				returnString += "&LINE-FC"+LineFcIndex+"=D"
				+ "&PPT-TIME-SEQ"+LineFcIndex+"="+obj.elements['seqnbr'+LineIndex+'_'+j].value
				+ "&PPT-DATE"+LineFcIndex+"="+obj.elements['date'+LineIndex+'_'+j].value;
				LineFcIndex++;
			}
			else if (obj.elements['lineFc'+LineIndex+'_'+j].value== "C" || obj.elements['lineFc'+LineIndex+'_'+j].value == "A")
			{
				if (obj.elements['lineFc'+LineIndex+'_'+j].value == "C")
				{
					returnString += "&LINE-FC"+LineFcIndex+"=C"
					+ "&PPT-TIME-SEQ"+LineFcIndex+"="+obj.elements['seqnbr'+LineIndex+'_'+j].value;
				}
				else
					returnString += "&LINE-FC"+LineFcIndex+"=A";				
				returnString += "&PPT-DATE"+LineFcIndex+"="+obj.elements['date'+LineIndex+'_'+j].value;
				FormValue = escape(obj.elements[TimeCard.Form[j].FormField+'_'+LineIndex].value); //Store value from form
				returnString += "&PPT-PAY-CODE"+LineFcIndex+"="+AGSFmtNumericPayCode(TimeCard.Form[j].FormField);
				if (FormValue != "")
					returnString += "&PPT-HOURS"+LineFcIndex+"="+FormValue;
				else
					returnString += "&PPT-HOURS"+LineFcIndex+"="+escape(" ");
				LineFcIndex++;
			}
			if (LineFcIndex > self.lawheader.maxlines)
			{
				self.lawheader.TimeForm = TimeCard.Form;
				self.lawheader.LineIndex = LineIndex;
				self.lawheader.ColIndex = j + 1;
				return returnString;
			}
		}
		ColIndex = 1;
		LineIndex++;
	}
	self.lawheader.TimeForm = TimeCard.Form;
	self.lawheader.LineIndex = 1;
	self.lawheader.ColIndex = 1;
	return returnString;
}

//******************************************************************************************
//Based on what field is clicked determines what numbers gets stored in these variables.
//******************************************************************************************
function SetCords(i,j)
{
	self.TABLE.document.forms["TimeEntry"].elements['yCord'].value = i;
	self.TABLE.document.forms["TimeEntry"].elements['xCord'].value = j;
}

//******************************************************************************************
//Opens Leave Balances Window
//******************************************************************************************
function OpenTimeOff_Period()
{
	TimeOffWindow = window.open(LeaveBalances,"TimeOff","toolbar=no,status=no,resizable=yes,height=650,width=800");
}

//******************************************************************************************
//Function called when Comments Window is updated. This toggles the image icon in reference
//******************************************************************************************
function ToggleCommentSwitch(value, dte)
{
	var i = getDteDifference(TimeCard.StartDate, dte)+1;
	var commentElm = self.TABLE.document.getElementById("comment"+i);
	if (!commentElm)
	{
		if (Comments.Date == TimeCard.StartDate)
		{
			switch (value)
			{
				case "Deleting":	
					var cmtImg = self.TABLE.document.getElementById("comment");
					cmtImg.src = cmtImg.getAttribute("default_icon");
					//self.HEADER.document.comment.src = NoCommentsIcon;
					break;
				case "Adding": 
					var cmtImg = self.TABLE.document.getElementById("comment");
					cmtImg.src = cmtImg.getAttribute("active_icon");					
					//self.HEADER.document.comment.src = ExistingCommentsIcon;
					break;
			}
		}
	}
	else
	{
		switch (value)
		{
			case "Deleting":	
				commentElm.src = commentElm.getAttribute("default_icon");
				//eval('self.TABLE.document.comment'+i).src = NoCommentsIcon;
				break;
			case "Adding":
				commentElm.src = commentElm.getAttribute("active_icon");
				//eval('self.TABLE.document.comment'+i).src = ExistingCommentsIcon;
				break;
		}
	}
}

//******************************************************************************************
// Highlight the field in error based on the field returned.
//******************************************************************************************
var HS36ErrorField = null;
var HS36LastI = -1;
var HS36LastJ = -1;
function HighlightFieldInError(field, msg)
{
	var FieldName = "";
	var FieldStr = (field) ? "" + field : "";
	var Index = -1;
	var re = /r[\d]+/;
	var reIdx = FieldStr.search(re);
	if (reIdx != -1)
	{
		FieldName = FieldStr.substring(0, reIdx);
		Index = parseInt(FieldStr.substring(reIdx+1, FieldStr.length), 10);
		if (iosHandler.getIOSVersionNumber() >= "08.01.00")
			Index++;
	}
	switch (FieldName)
	{
		case "LINE-FC": { FieldName = "PAYCODE"; break; }
		case "PPT-PAY-CODE": { FieldName = "PAYCODE"; break; }
		case "PPT-HOURS": { FieldName = "HOURS"; break; }
		case "PPT-RATE": { FieldName = "RATE"; break; }
		case "PPT-JOB-CODE": { FieldName = "JOBCODE"; break; }
		case "PPT-POSITION": { FieldName = "POSITION"; break; }
		case "PPT-SHIFT": { FieldName = "SHIFT"; break; }
		case "PPT-ACTIVITY": { FieldName = "ACTIVITY"; break; }
		case "PPT-ACCT-CATEGORY": { FieldName = "ACCTCAT"; break; }
		case "PPT-GL-COMPANY": { FieldName = "GLCOMPANY"; break; }
		case "PPT-ACCT-UNIT": { FieldName = "ACCTUNIT"; break; }
		case "PPT-ACCOUNT":	{ FieldName = "GLACCOUNT"; break; }
		case "PPT-SUB-ACCOUNT":	{ FieldName = "SUBACCT"; break; }
		case "PPT-PROCESS-LEVEL": { FieldName = "PROCLEVEL"; break; }
		case "PPT-DEPARTMENT": { FieldName = "DEPARTMENT"; break; }
		case "PPT-SCHEDULE": { FieldName = "SCHEDULE"; break; }
		case "PPT-PAY-GRADE": { FieldName = "GRADE"; break; }
		case "PPT-PAY-STEP": { FieldName = "STEP"; break; }
		case "PPT-ATTEND-CODE":	{ FieldName = "ATTENDCD"; break; }
		case "PPT-OCCURRENCE": { FieldName = "OCCURRENCE"; break; }
		case "PPT-COMMENT":	{ FieldName = "COMMENT"; break; }
		case "PPT-USERFIELD1": { FieldName = "USERFIELD1"; break; }
		case "PPT-USERFIELD2": { FieldName = "USERFIELD2"; break; }
		case "PPT-LOCAT-CODE": { FieldName = "LOCATION"; break; }
		case "PPT-PAY-UNITS": { FieldName = "UNITS"; break; }
	}	
	if (FieldName != "" && !isNaN(Index) && Index != -1)
	{	
		for (var i=1; i<TimeCard.Form.length; i++)
		{
			if (TimeCard.Form[i].FormField == FieldName)
			{
				if (HS36ErrorField)
					clearRequiredField(HS36ErrorField);				
				HS36ErrorField = self.TABLE.document.forms["TimeEntry"].elements[TimeCard.Form[i].FormField+'_'+Index];
				HS36LastI = Index;
				HS36LastJ = i;
				var focusFnc = function(){setFocusOn(Index,i)};
				setRequiredField(HS36ErrorField, msg, focusFnc);
				return true;
			}
		}
	}
	return false;
}

var userProcessLevel = null;

function DropDown(i,j)
{
	SetCords(i,j);
	var dmeField = TimeCard.Form[j].DME;
	if (dmeField == "ACACTIVITY") 
	{
		if (emssObjInstance.emssObj.filterSelect)
			openDmeFieldFilter("emppicklst");
		else
			openActivitySrch();
	} 
	else 
	{
		var myProcess = '';
		if (dmeField == "GLMASTER") 
		{
		} 
		else if (dmeField == "DEPTCODE") 
		{
			try
			{
				myProcess = self.TABLE.document.forms["TimeEntry"].elements['PROCLEVEL_'+i].value;
				userProcessLevel = myProcess;
			}
			catch(e)
			{
				myProcess = "";
				userProcessLevel = "";
			}
		}
		if (emssObjInstance.emssObj.filterSelect) 
		{
			if ((dmeField == "OCCURRENCE") || (dmeField == "SHIFT"))
			{ 
				StoreValueList(dmeField.toString().toLowerCase());		
				openFieldValueList(dmeField.toString().toLowerCase());
			}
			else if (dmeField == "GLMASTER")
				openDmeFieldFilter(TimeCard.Form[j].FormField.toString().toLowerCase());
			else
				openDmeFieldFilter(dmeField.toString().toLowerCase());
		} 
		else
			SelectDME(dmeField,myProcess,null,TimeCard.Employee,TimeCard.Form[j].FormField);
	}
}

function FinishedSelectBox(msg, val)
{
	var timeForm = self.TABLE.document.forms["TimeEntry"];
	var i =	timeForm.elements['yCord'].value;
	var j = timeForm.elements['xCord'].value;
	if (msg != "Done")
		seaAlert(msg, null, null, "error");
	else
	{		
		var textBox = timeForm.elements[TimeCard.Form[j].FormField+'_'+i];
		textBox.value = val;
		if (TextChanged(textBox, false) != true)
			setFocusOn(i,j);
	}
	boolSaveChanges = true;
	FieldSelectLoaded();	
}

function setActivityField(activity, activityStruct, desc)
{
	var timeForm = self.TABLE.document.forms["TimeEntry"];
	var i =	timeForm.elements['yCord'].value;
	var j = timeForm.elements['xCord'].value;
	var activityFld = timeForm.elements[TimeCard.Form[j].FormField+'_'+i];
	activityFld.value = activity;
	timeForm.elements['actdesc'+i].value = desc || "";
	// PT 178462. Store the activity structure for the user's selected activity so that account categories can be filtered by activity structure.
	if (activityStruct && NonSpace(activityStruct) > 0)
		activityFld.setAttribute("actstruct", String(activityStruct));
	// Remove the activity structure attribute for this activity if the activity structure cannot be found.
	else if (activityFld.getAttribute("actstruct") != null)
		activityFld.removeAttribute("actstruct");
	if (TextChanged(activityFld, false) != true)
		setFocusOn(i,j);
	boolSaveChanges = true;
}

function StartDeleteRow(View)
{
	startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), function(){DeleteRowClicked(View);});
}

//****************************************************************************************
//Based on located decided when user clicks form, it will delete the date. It will not
//delete a date that is marked as a split. It will also prompt the user before it marks the
//date to delete. (It doesn't delete the date until you hit update. If you re-enter
//information into a date marked for deleting, it will re-mark the date for a change.
//If you clear all information for a date manually it will mark the date to delete.
//****************************************************************************************
function DeleteRowClicked(View)
{
	if (typeof(authUser.prodline) == "unknown")
	{
		authenticate("frameNm='jsreturn'|funcNm='DeleteRowClicked(\""+View+"\")'|desiredEdit='EM'");
		return;
	}
	__View = View;
	var timeObject = self.TABLE.document.forms["TimeEntry"];
	var yCord = timeObject.elements['yCord'].value;
	var xCord = timeObject.elements['xCord'].value;
	var value = "";
	var lineObject;
	try
	{
		if (typeof(TimeCard.Form[xCord].OffsetPayCode) != "undefined")
			lineObject = timeObject.elements['lineFc'+yCord+'_'+xCord];
		else
			lineObject = timeObject.elements['lineFc'+yCord];
		if (typeof(lineObject.value) == "undefined") 
			lineObject.value = "-";
		if (lineObject.value == "Split")
		{
			stopProcessing();
			seaAlert(getSeaPhrase("USE_DAILY_TE_CHANGE_MULTIENTRIED","TE"), null, null, "error");
			if (TimeCard.Form[xCord].FormField == "HOURS")
				timeObject.elements[TimeCard.Form[xCord].FormField+'_'+yCord].value = FormatHours(TimeCard.Records[yCord].Hours,TimeCard.Form[xCord].Size);
			return;
		}
	}
	catch(e) {}
	stopProcessing();
	if (View == "Period")
	{
		var confirmResponse = seaConfirm(getSeaPhrase("ABOUT_TO_DEL","TE") +  FormatDte3(TimeCard.Records[yCord].Date) + getSeaPhrase("DEL_REC_CORRECT?","TE"), "", ConfirmDeleteRow); 
		if (typeof(confirmResponse) == "undefined" || confirmResponse == null)
			return;
		if (confirmResponse)
			DeleteRow(View);
	}
	else if (View == "Exception")
	{
		var confirmResponse = seaConfirm(getSeaPhrase("ABOUT_TO_DEL","TE") + FormatDte3(timeObject.elements['date'+yCord+'_'+xCord].value) + getSeaPhrase("DEL_REC_CORRECT?","TE"), "", ConfirmDeleteRow);
		if (typeof(confirmResponse) == "undefined" || confirmResponse == null)
			return;
		if (confirmResponse)
			DeleteRow(View);
	}
	else
	{
		var confirmResponse = seaConfirm(getSeaPhrase("ABOUT_TO_DEL_LINE","TE") + yCord + getSeaPhrase("DEL_FROM_SYS_CORRECT","TE"), "", ConfirmDeleteRow);
		if (typeof(confirmResponse) == "undefined" || confirmResponse == null)
			return;
		if (confirmResponse)
			DeleteRow(View);
	}
	TotalHours();
	boolSaveChanges = true;
}

function ConfirmDeleteRow(confirmWin)
{
	ReleaseSemaphore();
	var confirmResponse = (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue");
	if (confirmResponse)
		DeleteRow(__View);
	TotalHours();
	boolSaveChanges = true;	
}

function DeleteRow(View)
{
	var nextFunc = function()
	{
		var timeObject = self.TABLE.document.forms["TimeEntry"];
		var yCord = timeObject.elements['yCord'].value;
		var xCord = timeObject.elements['xCord'].value;
		if (View == "Period")
		{
			timeObject.elements['lineFc'+yCord].value = "D";
			for (var i=1; i<TimeCard.Form.length; i++)
				timeObject.elements[TimeCard.Form[i].FormField+'_'+yCord].value = "";
			if (TimeCard.Records[yCord].IsSplit)
			{
				var splitImg = self.TABLE.document.getElementById('split'+yCord);
				splitImg.src = splitImg.getAttribute("default_icon");
			}	
		}
		else if (View == "Exception")
		{
			for (var i=1; i<TimeCard.Form.length; i++)
			{
				timeObject.elements[TimeCard.Form[i].FormField+'_'+yCord].value = "";
				timeObject.elements['lineFc'+yCord+'_'+i].value = (timeObject.elements['lineFc'+yCord+'_'+i].value == "C") ? "D" : "-";
			}
		}
		else
		{
			timeObject.elements['lineFc'+yCord].value = "D";
			for (var i=1; i<TimeCard.Form.length; i++)
				timeObject.elements[TimeCard.Form[i].FormField+'_'+yCord].value = "";
		}
		stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[getWinTitle(self.TABLE)]));
	};
	startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

//****************************************************************************************
//Print the time card to a printer in exactly the same format you see on the screen. It will
//display all records for a range, including the splits.
//****************************************************************************************
function PrintTimeCard(FrameNm, WindowName)
{
	if (typeof(authUser.prodline) == "unknown")
	{
		authenticate("frameNm='jsreturn'|funcNm='PrintTimeCard(\""+FrameNm+"\",\""+WindowName+"\")'|desiredEdit='EM'");
		return;
	}
	if (typeof(FrameNm) == "undefined" || FrameNm == null || FrameNm == "")
		FrameNm = "jsreturn";
	var printWnd = window[WindowName][FrameNm];
	var printDoc = printWnd.document;
	var TotalHours = 0;
	var sb = new StringBuffer();
	var html = '<div id="printPane" style="padding:5px;text-align:center">';
	if (typeof(printWnd.parent["OnPrintClicked_PrintTime"]) == "function")
		html += '<div class="floatRight">' + uiButton(getSeaPhrase("PRINT","TE"),"parent.OnPrintClicked_PrintTime();return false")+'</div>';
	html += '<table border="0" cellspacing="0" cellpadding="0" style="width:auto;margin-left:auto;margin-right:auto" summary="'+getSeaPhrase("TSUM_12","SEA")+'">';
	html += '<caption class="offscreen">'+getSeaPhrase("TCAP_9","SEA")+'</caption>'
	html += '<tr><th scope="col" colspan="4"></th></tr>'
	html += '<tr><th scope="row" class="plaintablecellbold">'+getSeaPhrase("EMPLOYEE_NO","TE")+'</th>';
	html += '<td class="plaintablecell">'+EmployeeTemp.EmployeeNbr+'</td>';
	html += '<th scope="row" class="plaintablecellbold">'+getSeaPhrase("SUPERVISOR","TE")+'</th>';
	html += '<td class="plaintablecell">';
	if (EmployeeTemp.SupervisorName != null)
		html += '&nbsp;'+EmployeeTemp.SupervisorName;
	else
		html += '&nbsp;';
	html += '</td></tr>';
	sb.append(html);
	html = '<tr><th scope="row" class="plaintablecellbold">'+getSeaPhrase("EMPLOYEE","TE")+'</th>';
	html += '<td class="plaintablecell">'+EmployeeTemp.EmployeeName+'</td>';
	html += '<th scope="row" class="plaintablecellbold">'+getSeaPhrase("DEPARTMENT","TE")+'</th>';
	html += '<td class="plaintablecell">';
	if (EmployeeTemp.DepartmentName != null)
		html += '&nbsp;'+EmployeeTemp.DepartmentName;
	else
		html += '&nbsp;';
	html += '</td></tr></table><br/>';
	sb.append(html);
	html = '<table border="0" cellspacing="0" cellpadding="0" style="width:auto;margin-left:auto;margin-right:auto" role="presentation">';	
	html += '<tr><td class="plaintablecellbold">'+getSeaPhrase("CARD_FOR","TE")+'</td>';
	html += '<td class="plaintablecell">'+dteDay(TimeCardTemp.StartDate)+', '+FormatDte3(TimeCardTemp.StartDate)
	html += '</td><td class="plaintablecell"> - </td><td class="plaintablecell">'+dteDay(TimeCardTemp.EndDate)+', '+FormatDte3(TimeCardTemp.EndDate)+'</td>';
	html += '</tr></table><br/>';
	var msgData = [EmployeeTemp.EmployeeName,dteDay(TimeCardTemp.StartDate)+', '+FormatDte3(TimeCardTemp.StartDate),dteDay(TimeCardTemp.EndDate)+', '+FormatDte3(TimeCardTemp.EndDate)];
	html += '<table border="1" align="center" cellspacing="0" cellpadding="0" style="width:100%;text-align:center;margin-left:auto;margin-right:auto" styler="list" summary="'+getSeaPhrase("TSUM_5","TE",msgData)+'">';
	html += '<caption class="offscreen">'+getSeaPhrase("TCAP_4","TE",msgData)+'</caption>';
    html += '<tr class="plaintableheadernopadding">';
    html += '<th scope="col" class="plaintablecellbold" style="text-align:center" nowrap="nowrap">'+getSeaPhrase("DATE","TE")+'&nbsp;</th>';
   	sb.append(html);
   	var len1 = TimeCardTemp.Form.length;
   	for (var j=1; j<len1; j++)
   	{
		if (TimeCardTemp.Form[j].FormField!= null && TimeCardTemp.Form[j].FormField != "")
			sb.append('<th scope="col" class="plaintablecellbold">'+unescape(TimeCardTemp.Form[j].FormLabel)+'&nbsp;</th>');
   	}
	sb.append('</tr>');
	var len2 = TimeCardTemp.Records.length;
	for (var i=1; i<len2; i++)
	{
		html = '<tr class="plaintablecellnopadding">';
		html += '<td nowrap="">'+dteDay(TimeCardTemp.Records[i].Date)+", "+FormatDte3(TimeCardTemp.Records[i].Date)+'</td>';
		for (var j=1; j<len1; j++)
		{
			if (TimeCardTemp.ExceptionFlag == "N")
			{
				if (TimeCardTemp.Form[j].FormField == 'ACTIVITY')
				{
					if (TimeCardTemp.Records[i].Activity != null)
					{
						html += '<td> &nbsp; '+TimeCardTemp.Records[i].Activity+' (';
						if (TimeCardTemp.Records[i].ActivityDesc != null)
							html += TimeCardTemp.Records[i].ActivityDesc+')';
						html += '</td>';
					}
					else
						html += '<td> &nbsp; </td>';
				}
				else
				{
					html += '<td> &nbsp; ';
					var value = "";
					switch (TimeCardTemp.Form[j].FormField)
					{
						case "HOURS":
						{
							value = FormatHours(TimeCardTemp.Records[i].Hours,TimeCardTemp.Form[j].Size);
							if (value != "")
								TotalHours += parseFloat(value);
							break;
						}
						case "PAYCODE":	value = AGSFmtNumericPayCode(TimeCardTemp.Records[i].PayCode); break;
						case "RATE": value = (Number(TimeCardTemp.Records[i].Rate)==0) ? "" : FormatHours(TimeCardTemp.Records[i].Rate,TimeCardTemp.Form[j].Size); break;
						case "SHIFT": value = TimeCardTemp.Records[i].Shift; break;
						case "JOBCODE":	value = TimeCardTemp.Records[i].JobCode; break;
						case "POSITION": value = TimeCardTemp.Records[i].Position; break;
						case "ACTIVITY": value = TimeCardTemp.Records[i].Activity; break;
						case "ACCTCAT":	value = TimeCardTemp.Records[i].AccountCategory; break;
						case "DEPARTMENT": value = TimeCardTemp.Records[i].Department; break;
						case "PROCLEVEL": value = TimeCardTemp.Records[i].ProcessLevel; break;
						case "ATTENDCD": value = TimeCardTemp.Records[i].AttendanceCode; break;
						case "OCCURRENCE": value = TimeCardTemp.Records[i].Occurrence; break;
						case "SCHEDULE": value = TimeCardTemp.Records[i].Schedule; break;
						case "GRADE": value = TimeCardTemp.Records[i].Grade; break;
						case "STEP": value = TimeCardTemp.Records[i].Step; break;
						case "GLCOMPANY": value = TimeCardTemp.Records[i].GlCompany; break;
						case "ACCTUNIT": value = TimeCardTemp.Records[i].AccountUnit; break;
						case "GLACCOUNT": value = TimeCardTemp.Records[i].GlAccount; break;
						case "SUBACCT":	value = TimeCardTemp.Records[i].SubAccount; break;
						case "COMMENTS": value = TimeCardTemp.Records[i].Comment; break;
						case "USERFIELD1": value = TimeCardTemp.Records[i].UserField1; break;
						case "USERFIELD2": value = TimeCardTemp.Records[i].UserField2; break;
						case "LOCATION": value = TimeCardTemp.Records[i].Location; break;
						case "UNITS": value = TimeCardTemp.Records[i].Units; break;
					}
					if (value != null)
						html += value;
					html += '</td>';
				}
			}
			else
			{
				for (var j=1; j<len1; j++)
				{
					html += '<td align="center" style="text-align:center">';
					for (var k=i; k<len2; k++)
					{
						if (TimeCardTemp.Form[j].FormField == TimeCardTemp.Records[k].PayCode)
						{
							value = FormatHours(TimeCardTemp.Records[k].Hours,2.2);
							break;
						}
						if (k < TimeCardTemp.Records.length-1)
						{
							if (TimeCardTemp.Records[k].Date != TimeCardTemp.Records[k+1].Date)
								break;
						}
					}
					html += ((value == null || NonSpace(value)==0) ? "&nbsp;" : value);
					html += '</td>';
					if (value != null && NonSpace(value) != 0)
						TotalHours += parseFloat(value);
					value = null;
				}
				for (var k=i; k<len2; k++, i++)
				{
					if (k < len2-1)
					{
						if (TimeCardTemp.Records[k].Date != TimeCardTemp.Records[k+1].Date)
							break;
					}
				}
			}
		}
		html += '</tr>';
		sb.append(html);
	}
	html = '</table></div>';
	var html = '<div style="text-align:center">';
	html += '<table align="center" style="margin-left:auto;margin-right:auto;width:auto" border="0" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_9","TE")+'">';
	html += '<caption class="offscreen">'+getSeaPhrase("TCAP_7","TE")+'</caption>'
	html += '<tr><th scope="col" colspan="2"></th></tr>'
	html += '<tr><th scope="row" class="plaintablecellboldright">'+getSeaPhrase("TOTAL_HOURS","TE")+'</th>';
	html += '<td><span class="plaintablecell">'+roundToDecimal((TotalHours+""),2)+'</span></td>';
	html += '</tr></table></div>';
	html += '<br/><br/><br/>';
	sb.append(html);
	var html = '<div style="text-align:center;padding-bottom:15px">';
	html += '<table align="center" style="margin-left:auto;margin-right:auto;width:auto;text-align:center" border="0" cellspacing="2" cellpadding="0" role="presentation">';
	html += '<tr class="plaintableheadernopadding">';
	html += '<td class="plaintablecellbold">';
	html += getSeaPhrase("EMPLOYEE_ONLY","TE")+' ____________________ ';
	html += '</td><td class="plaintablecellbold">'
	html += getSeaPhrase("SUPERVISOR_ONLY","TE")+' ____________________ ';
	html += '</td></tr>';
	html += '<tr><td colspan="2">&nbsp;</td></tr>';
	html += '<tr class="plaintableheadernopadding">';
	html += '<td class="plaintablecellbold">';
	html += getSeaPhrase("SUPERVISOR_NAM_PRINT","TE")+' ____________________ ';
	html += '</td><td class="plaintablecellbold">';
	html += getSeaPhrase("SUPERVISOR_PHONE_NO","TE")+' ___________';
	html += '</td></tr></table></div></div>';
	sb.append(html);
	printDoc.getElementById("paneBody1").innerHTML = sb.toString();
	printWnd.stylePage();
	printDoc.getElementById("paneBody1").style.overflow = "visible";
	printDoc.body.style.overflow = "visible";
	if (TimeCardTemp.ExceptionFlag == "Y")
	{
		setWinTitle(getSeaPhrase("EXCEPTION_TIME_CARD","TE"), printWnd);
		PrintTimeCard_Finished_Exception(FrameNm, WindowName);
	}
	else
	{
		setWinTitle(getSeaPhrase("PP_TIME_CARD","TE"), printWnd);
		PrintTimeCard_Finished(FrameNm, WindowName);
	}	
}

function UpdateTimeCardObject()
{
	for (var i=1; i<emssObjInstance.emssObj.teDailyLines + 1; i++)
	{
		if (typeof(TimeCard.Records[i]) == "undefined") TimeCard.Records[i] = new RecordsObject();
		for (var j=1; j<TimeCard.Form.length; j++)
		{
			value = self.TABLE.document.forms["TimeEntry"].elements[TimeCard.Form[j].FormField +'_'+ i].value;
			switch (TimeCard.Form[j].FormField)
			{
				case "HOURS": TimeCard.Records[i].Hours = value; break;
				case "PAYCODE":	TimeCard.Records[i].PayCode = value; break;
				case "RATE": TimeCard.Records[i].Rate = value; break;
				case "SHIFT": TimeCard.Records[i].Shift = value; break;
				case "JOBCODE":	TimeCard.Records[i].JobCode = value; break;
				case "POSITION": TimeCard.Records[i].Position = value; break;
				case "ACTIVITY": TimeCard.Records[i].Activity = value; break;
				case "ACCTCAT":	TimeCard.Records[i].AccountCategory = value; break;
				case "DEPARTMENT": TimeCard.Records[i].Department = value; break;
				case "PROCLEVEL": TimeCard.Records[i].ProcessLevel = value; break;
				case "ATTENDCD": TimeCard.Records[i].AttendanceCode = value; break;
				case "OCCURRENCE": TimeCard.Records[i].Occurrence = value; break;
				case "SCHEDULE": TimeCard.Records[i].Schedule = value; break;
				case "GRADE": TimeCard.Records[i].Grade = value; break;
				case "STEP": TimeCard.Records[i].Step = value; break;
				case "GLCOMPANY": TimeCard.Records[i].GlCompany = value; break;
				case "ACCTUNIT": TimeCard.Records[i].AccountUnit = value; break;
				case "GLACCOUNT": TimeCard.Records[i].GlAccount = value; break;
				case "SUBACCT":	TimeCard.Records[i].SubAccount = value; break;
				case "COMMENTS": TimeCard.Records[i].Comment = value; break;
				case "USERFIELD1": TimeCard.Records[i].UserField1 = value; break;
				case "USERFIELD2": TimeCard.Records[i].UserField2 = value; break;
				case "LOCATION": TimeCard.Records[i].Location = value; break;
				case "UNITS": TimeCard.Records[i].Units = value; break;
			}
		}
	}
}

function CommentsWindow_Closed()
{
	CommentsCloseFlag = false;
}

function NewEmployeeSelected()
{
	var nextFunc;
	if (boolSaveChanges || bSelectChanged)
		nextFunc = function(){SaveChanges("GoToNewEmployee()", __View);};
	else
		nextFunc = GoToNewEmployee;
	startProcessing(getSeaPhrase("LOADING_TE","TE"), nextFunc);
}

function GoToNewEmployee()
{
	var comboBox = self.TABLE.document.forms["frmButtonFrame"].elements["cmbReports"];
	if (Reports.Detail[comboBox.selectedIndex].DatesExist == 2)
	{
		var cmbValue = comboBox.options[comboBox.selectedIndex].value;
		if (Reports.Detail[comboBox.selectedIndex].PlanCode == Employee.PayPlan)
			hs36 = new HS36Object(TimeCard.StartDate, TimeCard.EndDate, cmbValue, true);
		else
		{
			if (__View != "Period")
				hs36 = new HS36Object(TimeCard.StartDate, TimeCard.StartDate, cmbValue, true);
			else
				hs36 = new HS36Object("", "", cmbValue, true);
		}
		LockedOut = false;
		hs36.normal();
	}
	else
	{
		stopProcessing();
		seaAlert(getSeaPhrase("NO_DATES_FOR_PAY_PLAN_CONTACT_HR","TE"), null, null, "error");
		var len = Reports.Detail.length;
		for (var i=0; i<len; i++)
		{
			if (Employee.EmployeeNbr == comboBox.options[i].value)
				comboBox.options[i].selected = true;
		}
	}
}

function LockOutChanges()
{
	Semaphore = true;
}

function ReleaseSemaphore()
{
	Semaphore = false;
}

var EmailType = null;
var EmailIndex = 0;
var EmailWindow = null;
function EmployeeEmailClicked(EmailTo)
{
	for (var i=0; i<Reports.Detail.length && (parseInt(Reports.Detail[i].Employee, 10) != parseInt(Employee.EmployeeNbr,10)); i++);

	if (i < Reports.Detail.length)
	{
		EmailIndex = i;
		var emailTo = Reports.Detail[i].Email;
		var emailFrom = Reports.Email;
		if (emssObjInstance.emssObj.emailAddressType.toString().toLowerCase() == "personal")
		{
			emailTo = Reports.Detail[i].EmailPersonal;
			emailFrom = Reports.EmailPersonal;			
		}		
		if (EmailTo)
			emailTo = EmailTo;
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
				EmailWindow = wnd;
				if (this.styler == null || !this.styler.showInfor3)
				{			
					EmailWindow.seaAlert = wnd.parent.seaConfirm;
					EmailWindow.seaConfirm = wnd.parent.seaConfirm;	
				}		
			}
			messageDialog.initDialog = function(wnd)
			{
				wnd = wnd || window;
				var clearFunc = function()
				{
					wnd.document.forms["frmEmail"].elements["txtEmail"].value = '';
				}				
				if (this.styler != null && this.styler.showInfor3)
				{
					EmailWindow = wnd;
					this.setButtons([
					     {id: "yes", name: "yes", text: this.getPhrase("SEND_EMAIL"), click: null},
					     {id: "clear", name: "clear", text: this.getPhrase("CLEAR_FORM"), click: clearFunc},
					     {id: "cancel", name: "cancel", text: this.getPhrase("QUIT"), click: null}				
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
				if (typeof(wnd["styler"]) == "undefined" || wnd.styler == null)
					wnd.stylerWnd = findStyler(true);
				if (!wnd.stylerWnd)
					return;				
				if (this.styler == null)
				{
					this.styler = new wnd.stylerWnd.StylerBase();
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
				// if showInfor3, the dialog is in the main window, which should already have the CSS loaded			
				if (wnd.styler.showInfor)
				{
					wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/emss/infor.css");				
					wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/base/inforHidden.css");
					wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/base/inforTextArea.css");
					wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/base/inforTextbox.css");			
				}
				else if (wnd.styler.showLDS)
				{
					wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/lds/css/emss/lds.css");				
					wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/lds/css/base/hiddenElement.css");
					wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/lds/css/base/textAreaElement.css");
					wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/lds/css/base/textbox.css");
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
			messageDialog.translationAry["btnYes"] = "SEND_EMAIL";
			messageDialog.translationAry["btnClear"] = "CLEAR_FORM";
			messageDialog.translationAry["btnCancel"] = "QUIT";
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
			var html = '<div class="panewrapper" style="width:100%;text-align:center;padding:5px">'
			html += '<form name="frmEmail" onsubmit="return false;">'
			html += '<table align="center" border="0" cellspacing="0" cellpadding="0" style="width:auto;margin-left:auto;margin-right:auto" role="presentation">'
			html += '<tr><td class="fieldlabelbold"><label for="txtTo">'+getSeaPhrase("EMAIL_ADDRESS","TE")+'</label></td><td class="plaintablecell"><input styler="textbox" class="inputbox" type="text" size="75" maxlength="80" id="txtTo" name="txtTo" value="'+emailTo+'"></td></tr>'
			html += '<tr><td class="fieldlabelbold" style="white-space:nowrap">'+getSeaPhrase("SUBJECT","TE")+'</td><td class="plaintablecell">'+getSeaPhrase("TIME_ENTRY","TE")+'</td></tr>'		
			html += '<tr><td class="fieldlabelbold"><label for="txtEmail">'+getSeaPhrase("EMAIL_MESSAGE","TE")+'</label></td><td class="plaintablecell"><textarea styler="textarea" class="inputbox" style="width:auto;height:auto" cols="75" rows="14" id="txtEmail" name="txtEmail" wrap></textarea></td></tr>'
			html += '</table></form></div>'
			var msgReturn = messageDialog.messageBox(html, "okcancel", "none", window, false, "", EmailActionTaken, null, false);
			if (typeof(msgReturn) == "undefined")
				return;
			EmailActionTaken(msgReturn);		
		}
		else
			EmailWindow = window.open("/lawson/xhrnet/timeentry/manager/email.htm?to="+escape(emailTo,1)+"&from="+escape(emailFrom,1), "EMAIL", "width=650,height=350,toolbar=no,status=no,resizable=yes");
	}
	else
	{
		stopProcessing();
		seaAlert(getSeaPhrase("CANNT_COMPLETE_REQUEST","TE"), null, null, "error");
	}
}

function EmailActionTaken(msgWin)
{
	switch (msgWin.returnValue)
	{
		case "yes": //send
		case "ok":
			EmailEmployee();
			break;
		case "cancel": //cancel
		case "close":
			break;	
	}
}

function EmailEmployee(SendingTo)
{
	var mailForm = EmailWindow.document.forms["frmEmail"];
	var mailText = mailForm.elements["txtEmail"].value;
	var SendingTo = mailForm.elements["txtTo"].value;
	var Subject = getSeaPhrase("SUBJECT_TE","TE");
	var EmailIsFrom = Reports.Email;
	clearRequiredField(mailForm.elements["txtTo"]);
	clearRequiredField(mailForm.elements["txtEmail"]);
	if (NonSpace(SendingTo) == 0) 
	{
		if (styler && (styler.showLDS || styler.showInfor || styler.showInfor3) && typeof(window["DialogObject"]) == "function")
			seaAlert(getSeaPhrase("ENTER_EMAIL_ADDR","TE"), "", null, "error", function(){EmployeeEmailClicked();}, false);
		else
			setRequiredField(mailForm.elements["txtTo"], getSeaPhrase("ENTER_EMAIL_ADDR","TE"));
		mailForm.elements["txtTo"].focus();
		return;
	}
	else if (NonSpace(mailText) == 0) 
	{
		if (styler && (styler.showLDS || styler.showInfor || styler.showInfor3) && typeof(window["DialogObject"]) == "function")
			seaAlert(getSeaPhrase("ENTER_EMAIL_MSG","TE"), "", null, "error", function(){EmployeeEmailClicked(SendingTo);}, false);
		else
			setRequiredField(mailForm.elements["txtEmail"], getSeaPhrase("ENTER_EMAIL_MSG","TE"));	
		mailForm.elements["txtEmail"].focus();
		return;
	}
	if (emssObjInstance.emssObj.emailAddressType.toString().toLowerCase() == "personal")	
		EmailIsFrom = Reports.EmailPersonal;
	if (!EmailIsFrom)
		EmailIsFrom = SendingTo;
	EmailType = "Employee";
	EmailTimer = setTimeout("cgiEmailDone()", 3000);
	var obj = new EMAILObject(SendingTo,EmailIsFrom);
	obj.subject = Subject;
	obj.message = mailText;
	EMAIL(obj,"jsreturn");
}

function DoesObjectExist(pObj)
{
	try
	{
		if (typeof(pObj) == "undefined" || typeof(pObj) == "unknown" || typeof(pObj) == "null" || pObj == null)
			return false;
		else
			return true;
	}
	catch(e)
	{
		return false;
	}
}

function CheckTextChanged_Period()
{
 	// check last edited text box entry before proceeding with update
 	var timeForm = self.TABLE.document.forms["TimeEntry"];
 	var i = timeForm.elements['yCord'].value;
	var j = timeForm.elements['xCord'].value;
	var formObj = timeForm.elements[TimeCard.Form[j].FormField+'_' +i];
	if (TextChanged(formObj, true) != true)
  		UpdateClicked_Period();
}

/*
 *		Transaction Functions
 */
var hs36;

function HS36Object(StartDate, EndDate, Employee, ManagerFlag)
{
	this.EmployeeNumber = Employee;
	this.StartDate = StartDate;
	this.EndDate = EndDate;
	this.ManagerFlag = ManagerFlag;
	this.CalendarDate = null;
}

HS36Object.prototype.reset = function()
{
	CallHS36("Reset", this.StartDate, this.EndDate, this.EmployeeNumber, this.ManagerFlag)
}

HS36Object.prototype.print = function()
{
	CallHS36("Print", this.StartDate, this.EndDate, this.EmployeeNumber, this.ManagerFlag)
}

HS36Object.prototype.normal = function()
{
	CallHS36("Normal", this.StartDate, this.EndDate, this.EmployeeNumber, this.ManagerFlag)
}

HS36Object.prototype.report = function()
{
	CallHS36("Report", this.StartDate, this.EndDate, this.EmployeeNumber, this.ManagerFlag)
}

HS36Object.prototype.exception = function()
{
	CallHS36("Exception", this.StartDate, this.EndDate, this.EmployeeNumber, this.ManagerFlag)
}

HS36Object.prototype.printtime = function()
{
	CallHS36("PrintTime", this.StartDate, this.EndDate, this.EmployeeNumber, this.ManagerFlag)
}

HS36Object.prototype.printexception = function()
{
	CallHS36("PrintException", this.StartDate, this.EndDate, this.EmployeeNumber, this.ManagerFlag)
}

function CallHS36(WhatToDo, StartDate, EndDate, EmployeeNm, ManagerFlag)
{	
	if (typeof(authUser.prodline)!="string") 
	{
		authenticate("frameNm='jsreturn'|funcNm='CallHS36(\""+WhatToDo+"\",\""+StartDate+"\",\""+EndDate+"\",\""+EmployeeNm+"\",\""+ManagerFlag+"\")'|sysenv=true|desiredEdit='EM'");
		return;
	}
	if (HS36ErrorField != null)
		clearRequiredField(HS36ErrorField);
	var DailyFlag = false;
	var PrintFlag = false;
	var ResetFlag = false;
	var ReportFlag = false;
	var ExceptionFlag = false;
	var Lawheader = self.lawheader;
	switch (WhatToDo)
	{
		case "Print": PrintFlag = true; break;
		case "Reset": ResetFlag = true; break;
		case "Report": ReportFlag = true; break;
		case "PrintException": PrintFlag = true; ExceptionFlag = true; break;
		case "Exception": ExceptionFlag = true; break;
		case "PrintTime": PrintFlag = true; break;
	}
	if (ManagerFlag)
		ExceptionFlag = false;
	if ((StartDate == EndDate) && (EndDate != ""))
		DailyFlag = true;
	var pAgsObj	= new AGSObject(authUser.prodline, "HS36.1");
	pAgsObj.evt	= "ADD";
	pAgsObj.rtn	= "DATA";
	pAgsObj.longNames = true;
	pAgsObj.lfn	= "ALL";
	pAgsObj.tds	= false;
	var TimeCard = (PrintFlag || ExceptionFlag || ReportFlag) ? TimeCardTemp : TimeCard;	
	if (typeof(TimeCard) != "undefined")
	{
		if (((TimeCard.ProtectedDate == null || TimeCard.ProtectedDate == "" || Number(TimeCard.ProtectedDate) == 0) && !ReportFlag) || (!PrintFlag && !ReportFlag && !ExceptionFlag))
		{	
			EmployeeTemp = new EmployeeObject();
			TimeCardTemp = new TimeCardObject();
			Lawheader.linecount = 0;
		}
		if (TimeCard.RecordUpdate != "")
			TimeCardTemp.RecordUpdate = TimeCard.RecordUpdate		
		if ((ReportFlag || PrintFlag || ExceptionFlag ) && TimeCard.ProtectedDate != null && TimeCard.ProtectedDate != "" && Number(TimeCard.ProtectedDate) != 0)
		{
			pAgsObj.field = "FC=%2B";
			pAgsObj.field += "&PPT-COMPANY=" + escape(authUser.company);
			pAgsObj.field += "&PPT-EMPLOYEE=" + escape(EmployeeNm);
			pAgsObj.field += "&PT-PPT-DATE=" + TimeCard.ProtectedDate;
			if (TimeCard.ProtectedSeq != null && TimeCard.ProtectedSeq != "")
				pAgsObj.field 	+= "&PT-PPT-SEQ=" + TimeCard.ProtectedSeq;
		}
		else
		{
			pAgsObj.field = "FC=I";
			pAgsObj.field += "&PPT-COMPANY=" + escape(authUser.company);
			pAgsObj.field += "&PPT-EMPLOYEE=" + escape(EmployeeNm);
		}
	}
	else
	{
		EmployeeTemp = new EmployeeObject();
		TimeCardTemp = new TimeCardObject();
		Lawheader.linecount = 0;
		pAgsObj.field = "FC=I";
		pAgsObj.field += "&PPT-COMPANY=" + escape(authUser.company);
		pAgsObj.field += "&PPT-EMPLOYEE=" + escape(EmployeeNm);
	}
	Lawheader.fieldcount = 0;
	Lawheader.formlinecount = 0;
	Lawheader.numberUsed = 0;
	Lawheader.BreakOut = false;
	Lawheader.Abort	= false;
	pAgsObj.field += "&FROM-DATE=" + StartDate;
	pAgsObj.field += "&TO-DATE=" + EndDate;
	pAgsObj.field += (DailyFlag) ? "&DAILY=Y" : "&DAILY=N";
	pAgsObj.field += (PrintFlag || ReportFlag) ? "&PRINT=Y" : "&PRINT=N";
	pAgsObj.field += (ExceptionFlag) ? "&EMP-EXCEPTION=Y" : "&EMP-EXCEPTION=N";
	pAgsObj.field += (ManagerFlag) ? "&MANAGER-FLAG=Y" : "&MANAGER-FLAG=N";
	if (PrintFlag)
		pAgsObj.func = "parent.FinishedHS36('"+WhatToDo+"',false)";
	else if (ResetFlag)
		pAgsObj.func = "parent.FinishedHS36('Reset',false)";
	else if (ExceptionFlag)
		pAgsObj.func = "parent.FinishedHS36('Exception',false)";
	else if (ReportFlag)
		pAgsObj.func = "parent.FinishedHS36('Reports',false)";
	else
		pAgsObj.func = "parent.FinishedHS36('Normal',false)";
	pAgsObj.out	= "JAVASCRIPT";
	pAgsObj.debug = false;
	AGS(pAgsObj,"jsreturn");
}

function FinishedHS36(ActionPerformed, SavingChanges)
{
	// Exit if the lawheader frame is not loaded.
	if (typeof(self.lawheader.gmsgnbr) == "undefined")
	{
		stopProcessing();
		return;
	}	
	QuickPaint = false;
	if (HS36ErrorField != null)
		clearRequiredField(HS36ErrorField);
	if (self.lawheader.gmsgnbr != "000")
	{
		stopProcessing();
		var closeFunc = function()
		{
			try
			{
				if (opener)
					self.close();
			} 
			catch(e) {}			
		}		
		if (self.lawheader.gmsg == "Unable to execute transaction" || self.lawheader.gmsgnbr == "117" || self.lawheader.gmsgnbr == "119")
		{
			var alertResponse = seaAlert(getSeaPhrase("TE_ERROR","TE")+' '+self.lawheader.gmsg, "", null, "error", closeFunc);
			if (typeof(alertResponse) == "undefined" || alertResponse == null)
			{
				if (seaAlert == window.alert)
					closeFunc();
				return;
			}	
			closeFunc();
		}
		else
		{
			if (self.lawheader.gmsgnbr == "205" || self.lawheader.gmsgnbr == "206")
			{
				if (self.lawheader.gmsgnbr == "205")
				{
					var alertResponse = seaAlert(getSeaPhrase("USE_EXCEPTION_TE","TE"), "", null, "error", closeFunc);
					if (typeof(alertResponse) == "undefined" || alertResponse == null)
					{
						if (seaAlert == window.alert)
							closeFunc();
						return;
					}	
					closeFunc();
				}
				else
				{
					var alertResponse = seaAlert(getSeaPhrase("USE_REGULAR_TE","TE"), "", null, "error", closeFunc);
					if (typeof(alertResponse) == "undefined" || alertResponse == null)
					{
						if (seaAlert == window.alert)
							closeFunc();
						return;
					}	
					closeFunc();
				}
				return;
			}
			else if (ActionPerformed == "Reports" && self.lawheader.gmsgnbr == "118" && ReportsDetail)
			{
				for (var i=0; i<ReportsDetail.length; i++)
				{
					if (ReportsDetail[i].Employee == Details.EmployeeNumbers[Index])
					{
						var msg = getSeaPhrase("CONTACT_PAYROLL_FOR_HELP","TE")+" "+getSeaPhrase("PAY_PLAN_DATE_NOT_SETUP","TE")+ReportsDetail[i].PlanCode+getSeaPhrase("DOT","TE");
						seaAlert(msg, "", null, "error");
						return;
					}
				}
				seaAlert(getSeaPhrase("EMPLOYEE_DATES_NOT_SETUP","TE"), "", null, "error");
			}
			else
			{
				var fldFound = false;
				if (typeof(TimeCard) == "undefined")
				{}
				else
					fldFound = HighlightFieldInError(self.lawheader.gfldnbr, self.lawheader.gmsg);	
				if (!fldFound)
					seaAlert(getSeaPhrase("ERROR","TE")+": \n\n"+self.lawheader.gmsg, "", null, "error");
			}
		}
		ReleaseSemaphore();
	}
	else
	{	
		var ChangesMade = false;
		if (boolSaveChanges)
			ChangesMade = true;
		if (typeof(TimeCard) != "undefined")
		{	
			if (TimeCard.ManagerFlag)
				TimeCardTemp.ManagerFlag = true;	
			if (TimeCard.RecordUpdate)
				TimeCardTemp.RecordUpdate = TimeCard.RecordUpdate;
		}
		if (ActionPerformed != "Print" && ActionPerformed != "PrintException")
		{
			TimeCard = new TimeCardObject();
			Employee = new EmployeeObject();
			TimeCard = TimeCardTemp;
			Employee = EmployeeTemp;
		}
		var CalendarDate = (hs36) ? hs36.CalendarDate : null;
		if (ActionPerformed == "Exception")
			hs36 = new HS36Object(TimeCard.StartDate, "", Employee.EmployeeNbr, TimeCard.ManagerFlag);
		else
			hs36 = new HS36Object(TimeCard.StartDate, TimeCard.EndDate, Employee.EmployeeNbr, TimeCard.ManagerFlag);
		if (CalendarDate != null)
			hs36.CalendarDate = CalendarDate;
		if (TimeCard.ExceptionFlag == "Y" && ActionPerformed == "Normal")
			ActionPerformed = "Exception";
		switch (ActionPerformed)
		{
			case "PrintTime":
				if (self.lawheader.gmsg == "More Records Exist - Use PageDown")
					hs36.printtime();
				else
					PrintScreen();
				boolSaveChanges = false;
				bSelectChanged = false;
				break;
			case "Print":
				if (self.lawheader.gmsg == "More Records Exist - Use PageDown")
					hs36.print();
				else
					PrintTimeCard("printFm", "self");
				boolSaveChanges = false;
				bSelectChanged = false;
				break;
			case "PrintException":
				if (self.lawheader.gmsg == "More Records Exist - Use PageDown")
					hs36.printexception();
				else
				{
					TimeCard.ProtectedDate = null;
					TimeCard.ProtectedSeq = null;
					PrintTimeCard("printFm", "self");
				}
				boolSaveChanges = false;
				bSelectChanged = false;
				break;
			case "Reset":
				if (typeof(TimeEntryLocal) != "undefined" && TimeEntryLocal)
				{
					TimeCard = TimeEntryLocal;
					TimeEntryLocal = null
					PaintDetailScreen();
				}
				boolSaveChanges = false;
				bSelectChanged = false;
				break;
			case "Submitted":
				if (ExceptionFlag)
				{
					// If there are more records to updated, re-call HS36
					if (self.lawheader.LineIndex != 1 || self.lawheader.ColIndex != 1)
					{
						ReleaseSemaphore();	
						if (TimeCard.Status == 1)
							UpdateTimeCard("Exception","Submitted",true);
						else
							UpdateTimeCard("Exception","Updated",true);
						return;
					}
				}
				TimeCard.RecordUpdate = "Submitted";
				if (TimeCard.ManagerFlag && TimeCard.Status == 4 && emssObjInstance.emssObj.teManagerRejectEmail)
					SendEmail("reject");
				else if (TimeCard.ManagerFlag && TimeCard.Status == 2 && emssObjInstance.emssObj.teManagerApproveEmail)
					SendEmail("approve");
				else if (TimeCard.ManagerFlag && emssObjInstance.emssObj.teManagerChangeEmail && ChangesMade)
					SendEmail("managerchanged");
				else if (!TimeCard.ManagerFlag && emssObjInstance.emssObj.teEmployeeSubmitEmail)
					SendEmail("employeesubmitted");
				else
				{
					TimeCard.ProtectedDate = "";
					TimeCard.ProtectedSeq = "";
					if (SavingChanges)
						SaveChangesDone();
					else
					{
						QuickPaint = true;
						if (ExceptionFlag)
							hs36.exception();
						else
							hs36.normal();
					}
				}
				break;
			case "Updated":
				if (ExceptionFlag)
				{
					// If there are more records to updated, re-call HS36
					if (self.lawheader.LineIndex != 1 || self.lawheader.ColIndex != 1)
					{
						ReleaseSemaphore();	
						if (TimeCard.Status == 1)
							UpdateTimeCard("Exception","Submitted",true);
						else
							UpdateTimeCard("Exception","Updated",true);
						return;
					}
				}
				TimeCard.RecordUpdate = "Updated";
				if (TimeCard.ManagerFlag && TimeCard.Status == 4 && emssObjInstance.emssObj.teManagerRejectEmail)
					SendEmail("reject");
				else if (TimeCard.ManagerFlag && TimeCard.Status == 2 && emssObjInstance.emssObj.teManagerApproveEmail)
					SendEmail("approve");
				else if (TimeCard.ManagerFlag && emssObjInstance.emssObj.teManagerChangeEmail && ChangesMade)
					SendEmail("managerchanged");
				else
				{
					TimeCard.ProtectedDate = "";
					TimeCard.ProtectedSeq = "";
					if (SavingChanges)
						SaveChangesDone();
					else
					{
						QuickPaint = true;
						if (ExceptionFlag)
							hs36.exception();
						else
							hs36.normal();
					}
				}
				break;
			case "Normal":
				var ReportsObj = null;
				try
				{
					if ((opener && opener.Reports) || (parent && parent.Reports))
						ReportsObj = (opener && opener.Reports) ? opener.Reports : parent.Reports;
				}
				catch(e) 
				{
					ReportsObj = null;
				}		
				if (ReportsObj)
				{
					TimeCard.ManagerFlag = true;
					Reports = CopyOffReports(ReportsObj);
					Reports.Detail = new Array();
					for (var i=0; i<ReportsDetail.length; i++)
						Reports.Detail[i] = ReportsDetail[i];
				}
				if (!TimeCard.ManagerFlag)
					TimeCard.TimeCardType = 1;
				if (TimeCard.StartDate == TimeCard.EndDate)
					PaintDailyWindow();
				else
					PaintPeriodWindow();
				boolSaveChanges = false;
				bSelectChanged = false;
				try
				{
					if (opener && opener.Reports)
					{
						opener.close();
						if (navigator.appName.indexOf("Microsoft") >= 0)
							opener = null;
					}
				}
				catch(e) {}
				break;
			case "Exception":
				if (self.lawheader.gmsg == "More Records Exist - Use PageDown")
					hs36.exception();
				else
				{
					var ReportsObj = null;
					try
					{
						if ((opener && opener.Reports) || (parent && parent.Reports))
							ReportsObj = (opener && opener.Reports) ? opener.Reports : parent.Reports;
					}
					catch(e) 
					{
						ReportsObj = null;
					}			
					if (ReportsObj)
					{
						TimeCard.ManagerFlag = true;
						Reports = CopyOffReports(ReportsObj);
						Reports.Detail = new Array();
						for (var i=0; i<ReportsDetail.length; i++)
							Reports.Detail[i] = ReportsDetail[i];
					}
					if (!TimeCard.ManagerFlag)
						TimeCard.TimeCardType = 2;
					PaintExceptionWindow();
				}
				boolSaveChanges = false;
				bSelectChanged = false;
				try
				{
					if (opener && opener.Reports)
					{
						opener.close();
						if (navigator.appName.indexOf("Microsoft") >= 0)
							opener = null;
					}
				}
				catch(e) {}
				break;
			case "Reports":
				if (self.lawheader.gmsg == "More Records Exist - Use PageDown")
					hs36.report();
				else
				{
					TimeCard.ProtectedDate = null;
					TimeCard.ProtectedSeq = null;
					if (self.lawheader.gmsgnbr != "000")
						seaAlert(self.lawheader.gmsg, "", null, "error");
					else
					{
						if (Index+1 < Details.EmployeeNumbers.length)
							CallHS36WithIndex(++Index);
						else
						{
							TimeEntryLocal = TimeCard;
							PaintDetailScreen();
						}
					}
					boolSaveChanges = false;
					bSelectChanged = false;
				}
				break;
			default: stopProcessing(); break;
		}
	}
}

function CopyOffReports(ReportObj)
{
	var ReportsRtn = new ReportsObject(ReportObj.Company, ReportObj.Employee);
	ReportsRtn.EmployeeName = (ReportObj.EmployeeName) ? ReportObj.EmployeeName : null;
	ReportsRtn.PlanCode = (ReportObj.PlanCode) ? ReportObj.PlanCode : null;
	ReportsRtn.PeriodStart = (ReportObj.PeriodStart) ? ReportObj.PeriodStart : null;
	ReportsRtn.PeriodEnd = (ReportObj.PeriodEnd) ? ReportObj.PeriodEnd : null;
	ReportsRtn.View = (ReportObj.View) ? ReportObj.View : null;
	ReportsRtn.PlanCodeDescription = (ReportObj.PlanCodeDescription) ? ReportObj.PlanCodeDescription : null;
	ReportsRtn.Email = (ReportObj.Email) ? ReportObj.Email : null;
	ReportsRtn.EmailPersonal = (ReportObj.EmailPersonal) ? ReportObj.Email : null;
	ReportsRtn.Detail = new Array();
	return ReportsRtn;
}

/*
 *		Data Retrieval Functions
 */
var InformationGlobal;
var SizeX = 300;
var SizeY = 200;
// Define a global variable to set the number of values for a single key field that DME can handle in its KEY parameter.
var MAX_DME_KEY_VALUES = 50;
var SelectWindow, TEDepartments, TEProcessLevels, TEPositions;
var TEJobcodes, TEAccountCategories, TEGlNames, TEGlMaster, TEAttendCode;
var TEGlCompany, TEPrPayCode, TEPayCode, TEOccurrenceCodes, TEShiftCodes;
var TEScheduleCodes, TEActivityGroups, TEPayGradeCodes, TEPayStepCodes, TELocations;

function Obj()
{}

function SelectDME(dmeName, myProcess, groupName, emp, formField)
{
	var nextFunc = function()
	{
		switch (dmeName)
		{
			case "ACACCTCAT": GetAcacctcat(); break;
			case "DEPTCODE": GetDeptcode(myProcess); break;
			case "ATTENDCD": GetAttendcode(); break;
			case "GLMASTER": GetGlmaster(formField); break;
			case "GLNAMES":	GetGlnames(formField); break;
			case "GLSYSTEM": GetGlsystem(); break;
			case "JOBCODE":	GetJobcode(); break;
			case "OCCURRENCE": GetOccurrence(); break;
			case "PRGRPPAY": GetPayCodes(Employee.PayCodeGroupName); break;
			case "PAPOSITION": GetPaposition(); break;
			case "PRSYSTEM": GetPrsystem(); break;
			case "SHIFT": GetShift(); break;
			case "PRSAGHEAD": GetSchedule(); break;
			case "GRADE": GetGrade(); break;
			case "STEP": GetStep(); break;
			case "ACACTGRP": GetActivityGroups(); break;
			case "PRGRPPAY2": GetPayCodes(Employee.PayCodeGroupName); break;
			case "TFPAYCODE": GetPayGroupCode(); break;
			case "LOCATION": GetLocation(); break;
			default: FinishedSelectBox(getSeaPhrase("CANNT_OPEN_SELECT_BOX_NO_DATA","TE")); break;
		}
	};
	startProcessing(getSeaPhrase("WAIT_LOADING_SELECT_WIN","TE"), nextFunc);
}

function GetActivityGroups()
{
	if (typeof(TEActivityGroups) != "undefined")
		Perform(TEActivityGroups);
	else
	{
		TEActivityGroups = new Array();
		var obj = new DMEObject(authUser.prodline,"ACACTGRP");
		obj.out = "JAVASCRIPT";
		obj.index = "agpset1";
		obj.field = "activity-grp;description";
		obj.max = "600";
		obj.debug = false;
		obj.select = "active-status=O";
		DME(obj,"jsreturn");
	}
}

function DspAcactgrp()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		obj = self.jsreturn.record[i];
		index = TEActivityGroups.length;
		TEActivityGroups[index] = new Obj();
		TEActivityGroups[index].code = obj.activity_grp;
		TEActivityGroups[index].name = obj.description;
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		Perform(TEActivityGroups);
}

function GetLocation()
{
	if (typeof(TELocations) != "undefined")
		Perform(TELocations);
	else
	{	
		TELocations	= new Array();
		var obj = new DMEObject(authUser.prodline,"PCODES");
		obj.out = "JAVASCRIPT";
		obj.index = "pcoset1";
		obj.field = "code;description";
		obj.cond = "active";
		obj.max	= "600";
		obj.key = "LO";	
		obj.func = "StoreLocation()";	
		obj.debug = false;
		DME(obj,"jsreturn");
	}
}

function StoreLocation()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var obj = self.jsreturn.record[i];
		var index = TELocations.length;
		TELocations[index] = new Obj();
		TELocations[index].code = obj.code;
		TELocations[index].name = obj.description;
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		Perform(TELocations);
}

function GetDeptcode(myProcess)
{
	TEDepartments = new Array();
	var obj	= new DMEObject(authUser.prodline,"DEPTCODE");
	obj.out	= "JAVASCRIPT";
	obj.index = "dptset1";
	obj.field = "process-level;department;name";
	obj.max = "600";
	obj.debug = false;
	obj.cond = "active";
	obj.key = (myProcess) ? authUser.company+"="+myProcess+"" : authUser.company+"";
	DME(obj,"jsreturn");
}

function DspDeptcode()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var obj = self.jsreturn.record[i];
		var index = TEDepartments.length;
		TEDepartments[index] = new Obj();
		TEDepartments[index].subName = obj.process_level;
		TEDepartments[index].code = obj.department;
		TEDepartments[index].name = obj.name;
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		Perform(TEDepartments);
}

function GetPrsystem()
{
	if (typeof(TEProcessLevels) != "undefined")
		Perform(TEProcessLevels);
	else
	{
		TEProcessLevels = new Array();
		var obj = new DMEObject(authUser.prodline,"PRSYSTEM");
		obj.out = "JAVASCRIPT";
		obj.index = "prsset1";
		obj.field = "process-level;name";
		obj.max = "600";
		obj.debug = false;
		obj.select = "process-level!=";
		obj.cond = "active-pl";
		obj.key = authUser.company+"";
		DME(obj,"jsreturn");
	}
}

function DspPrsystem()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var obj = self.jsreturn.record[i];
		var index = TEProcessLevels.length;
		TEProcessLevels[index] = new Obj();
		TEProcessLevels[index].code = obj.process_level;
		TEProcessLevels[index].name = obj.name;
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		Perform(TEProcessLevels);
}

function GetPaposition()
{
	if (typeof(TEPositions) != "undefined")
		Perform(TEPositions);
	else
	{
		TEPositions = new Array();
		var obj = new DMEObject(authUser.prodline,"PAPOSITION");
		obj.out = "JAVASCRIPT";
		obj.index = "posset1";
		obj.field = "position;description";
		//obj.select = "posit-status=1|posit-status=2&end-date=00000000";
		obj.cond = "active-current";
		obj.sortasc	= "description";
		obj.max	= "600";
		obj.debug = false;
		obj.key = authUser.company+"";
		DME(obj,"jsreturn");
	}
}

function DspPaposition()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var obj = self.jsreturn.record[i];
		var index = TEPositions.length;
		TEPositions[index] = new Obj();
		TEPositions[index].code = obj.position;
		TEPositions[index].name = obj.description;
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		Perform(TEPositions);
}

function GetJobcode()
{
	if (typeof(TEJobcodes) != "undefined")
		Perform(TEJobcodes,"JOBCODE");
	else
	{
		TEJobcodes = new Array();
		var obj = new DMEObject(authUser.prodline,"JOBCODE");
			obj.out = "JAVASCRIPT";
			obj.field = "job-code;description";
			obj.select = "active-flag=A";
			obj.max	= "600";
			obj.key = authUser.company+"";
			obj.debug = false;
		DME(obj,"jsreturn");
	}
}

function DspJobcode()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var obj = self.jsreturn.record[i];
		var index = TEJobcodes.length;
		TEJobcodes[index] = new Obj();
		TEJobcodes[index].code 	= obj.job_code;
		TEJobcodes[index].name 	= obj.description;
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		Perform(TEJobcodes);
}

var userActivity = null;
var userActivityStruct = null;
var lastUserActivity = null;
var userActivityFld = null;
var userActivityFunc = null;

function GetActivityStruct(activity, activityFld, funcAfterCall)
{
	var foundActivity = false;
	userActivityFld = (activityFld) ? activityFld : null;
	userActivityFunc = (funcAfterCall) ? funcAfterCall : null;
	if (typeof(TEActivityCodes) != "undefined" && TEActivityCodes.length > 0)
	{
		for (var i=0; i<TEActivityCodes.length; i++)
		{
			if (TEActivityCodes[i].activity == activity)
			{
				foundActivity = true;
				var activityStruct = TEActivityCodes[i].structure;
				if (activityFld && activityStruct)
					activityFld.setAttribute("actstruct", String(activityStruct));
				break;
			}
		}
	}
	if (!foundActivity)
	{
		var obj = new DMEObject(authUser.prodline, "acactivity");
		obj.out = "JAVASCRIPT";
		obj.index = "acvset1";
		obj.field = "activity;structure";
		obj.exclude = "drill;keys;sorts";
		obj.func = "SaveActivityStruct()";
		obj.max	= "1";
		obj.key = activity+"";
		obj.debug = false;
		DME(obj,"jsreturn");		
	}		
	else if (funcAfterCall)
		funcAfterCall();
}

function SaveActivityStruct(funcAfterCall)
{
	if (self.jsreturn.NbrRecs > 0)
	{
		var activityStruct = self.jsreturn.record[0].structure;
		if (userActivityFld && activityStruct)
			userActivityFld.setAttribute("actstruct", String(activityStruct));
	}
	if (userActivityFunc)
		userActivityFunc();
}

function GetAcacctcat(gotActivityStruct)
{
	// PT 178462. Filter account categories by activity structure, if the user has selected an activity.
	userActivity = null;
	userActivityStruct = null;
	for (var j=1; j<TimeCard.Form.length; j++)
	{
		if (TimeCard.Form[j].FormField == "ACTIVITY")
		{
			var y =	self.TABLE.document.TimeEntry.yCord.value
			var activity = self.TABLE.document.TimeEntry[TimeCard.Form[j].FormField+'_'+y];
			if (typeof(activity) != "undefined" && activity)
			{
				var activityVal = activity.value;
				if (NonSpace(activityVal) > 0)
				{
					userActivity = activityVal;
					if (activity.getAttribute("actstruct") != null)
					{
						userActivityStruct = activity.getAttribute("actstruct");
						activity.removeAttribute("actstruct");
					}
					else if (!gotActivityStruct)
					{
						GetActivityStruct(userActivity, activity, function(){GetAcacctcat(true)});
						return;
					}					
				}
				else if (activity.getAttribute("actstruct") != null)
					activity.removeAttribute("actstruct");
			}	
			break;
		}	
	}
	if (typeof(TEAccountCategories) != "undefined" && lastUserActivity == userActivity)
		Perform(TEAccountCategories)
	else
	{
		TEAccountCategories = new Array();
		lastUserActivity = userActivity;
		if (userActivityStruct != null)
		{
			var obj = new DMEObject(authUser.prodline,"ACCATSUMX");
			obj.out = "JAVASCRIPT";
			obj.index = "srxset1";
			obj.field = "acct-category;acacctcat.description";
			obj.key	= escape(userActivityStruct,1);
			obj.max = "600";
			obj.otmmax = "1";
			obj.debug = false;
			DME(obj,"jsreturn");						
		}
		else
		{
			var obj = new DMEObject(authUser.prodline,"ACACCTCAT");
			obj.out = "JAVASCRIPT";
			obj.index = "aaxset1";
			obj.field = "acct-category;description";
			obj.max = "600";
			//PT135944
			//obj.select = "active-flag=A";
			obj.debug = false;
			DME(obj,"jsreturn");
		}
	}
}

function DspAccatsumx()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var obj = self.jsreturn.record[i];
		var index = TEAccountCategories.length;
		TEAccountCategories[index] = new Obj();
		TEAccountCategories[index].code = obj.acct_category;
		TEAccountCategories[index].name = obj.acacctcat_description;
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		Perform(TEAccountCategories);
}

function DspAcacctcat()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var obj = self.jsreturn.record[i]
		var index = TEAccountCategories.length;
		TEAccountCategories[index] = new Obj();
		TEAccountCategories[index].code = obj.acct_category;
		TEAccountCategories[index].name = obj.description;
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		Perform(TEAccountCategories);
}

function GetGlnames(formField)
{
	// PT141300. If a GL company has been entered by the user, only show accounting units for that company.
	// Otherwise, show all accounting units for the HR company and any inter-related GL companies.
	var foundGlCo = false;
	TEGlNames = new Array();
	for (var j=1; j<TimeCard.Form.length; j++)
	{
		if (TimeCard.Form[j].FormField == "GLCOMPANY")
		{
			var y =	self.TABLE.document.TimeEntry.yCord.value
			var glCo = self.TABLE.document.TimeEntry[TimeCard.Form[j].FormField+'_'+y].value;
			if (NonSpace(glCo) > 0)
			{
				foundGlCo = true;
				ArrayOfCompanies = new Array();
				ArrayOfCompanies[0] = glCo;
				BuildGlNamesFile(0);
			}	
		}	
	}
	if (!foundGlCo)
		BuildGlIntCoFile("GLNAMES",formField);
}

function DspGlnames(Location)
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var obj = self.jsreturn.record[i];
		var index = TEGlNames.length;
		TEGlNames[index] = new Obj();
		TEGlNames[index].code = obj.acct_unit;
		TEGlNames[index].name = obj.description;
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else if (Location < ArrayOfCompanies.length) 
	{
		// Make another DME call to GLNAMES for the next set of MAX_DME_KEY_VALUES companies found in the ArrayOfCompanies array.
		BuildGlNamesFile(Location);
	} 
	else
		Perform(TEGlNames);
}

function GetGlmaster(formField)
{
	// If we have already retrieved the GLMASTER DME for the GL ACCOUNT and SUB ACCT select boxes, reformat the array to display the appropriate code in the chosen text box.
	if (typeof(TEGlMaster)!="undefined")
	{
		// Reformat the array only if the user is switching from GL ACCOUNT to SUB ACCT, or vice versa.
		if (TEGlMaster.length && formField!=TEGlMaster[0].formField)
		{
			for (var i=0; i<TEGlMaster.length; i++)
			{
				TEGlMaster[i].formField = formField;
				if (formField=="SUBACCT")
					TEGlMaster[i].code = TEGlMaster[i].subAcct;
				else
					TEGlMaster[i].code = TEGlMaster[i].acct;
			}
		}
		Perform(TEGlMaster);
	}
	else
	{	
		TEGlMaster = new Array();
		BuildGlIntCoFile("GLMASTER",formField);
	}
}

var userGLAccount = null;
var ArrayOfCompanies = new Array();

function BuildGlIntCoFile(dbFile, formField)
{
	ArrayOfCompanies = new Array();
	// Add the HR company to the array of total companies; without this, we only get the list of GL companies that are inter-related to the HR company.
	ArrayOfCompanies[0] = authUser.company;
	var obj = new DMEObject(authUser.prodline,"GLINTCO");
	obj.out = "JAVASCRIPT";
	obj.index = "gicset1";
	obj.field = "company-b";
	obj.max = "600";
	obj.debug = false;
	obj.select = "company-a="+authUser.company;
	obj.func = "DspGlIntCo('"+dbFile+"','"+formField+"');";
	DME(obj,"jsreturn");
}

function DspGlIntCo(dbFile, formField)
{
	for (var i=0;i<self.jsreturn.NbrRecs;i++)
		ArrayOfCompanies[ArrayOfCompanies.length] = self.jsreturn.record[i].company_b;
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
	{	
		if (dbFile == "GLNAMES")
			BuildGlNamesFile(0);
		else
			BuildGlMasterFile(0,formField);
	}
}
function BuildGlNamesFile(Location)
{
	var ArrayOfCompaniesCondensed = new Array();
	// Construct a DME call to GLNAMES using MAX_DME_KEY_VALUES companies from the ArrayOfCompanies array,
	// which has the total list of companies to retrieve records for.  Use the Location variable
	// to remember where in the list we are.  This needs to be done because DME currently has a 
	// limit of 50 values per key field.  Before this change, records for only up to 50 GL companies 
	// that were inter-related to the HR company were returned.
    var i = 0;
    var startAt = Location;
    var endAt = Location + MAX_DME_KEY_VALUES;
    if (endAt > ArrayOfCompanies.length)
    	endAt = ArrayOfCompanies.length;
    while (startAt < endAt) 
    {
    	ArrayOfCompaniesCondensed[i] = ArrayOfCompanies[startAt];
    	startAt++;
    	i++;
	}
    var obj = new DMEObject(authUser.prodline,"GLNAMES");
    obj.out = "JAVASCRIPT";
    obj.index = "glnset1";
    obj.field = "acct-unit;description";
    obj.key = ArrayOfCompaniesCondensed.join(";");
    obj.max = "600";
    obj.debug = false;
    obj.select = "active-status=A&posting-flag=P";
    obj.func = "DspGlnames("+endAt+")";
    DME(obj,"jsreturn");
}
function BuildGlMasterFile(Location,formField)
{
	var ArrayOfCompaniesCondensed = new Array();
	// Retrieve inter-company records for GL Account (GLMASTER) in the same way as 
	// accounting unit (GLNAMES).  Construct a DME call to GLMASTER using MAX_DME_KEY_VALUES 
	// companies from the ArrayOfCompanies array, which has the total list of companies to 
	// retrieve records for.  Use the Location variable to remember where in the list we are.
	// This needs to be done because DME currently has a limit of 50 values per key field.  
	// Before this change, only up to 39 key values were used for each DME call.
    var i = 0;
    var startAt = Location;
    var endAt = Location + MAX_DME_KEY_VALUES;
    if (endAt > ArrayOfCompanies.length)
    	endAt = ArrayOfCompanies.length;	
    while (startAt < endAt) 
    {
    	ArrayOfCompaniesCondensed[i] = ArrayOfCompanies[startAt];
    	startAt++;
    	i++;
	}
	var obj = new DMEObject(authUser.prodline,"GLMASTER");
	obj.out = "JAVASCRIPT";
	obj.index = "glmset2";
	obj.field = "account;acct-desc;sub-account";
	obj.key = authUser.company+";"+ArrayOfCompaniesCondensed.join(';');
	obj.max = "600";
	obj.debug = false;
	obj.select = "active-status!=I";
	obj.func = "DspGlmaster("+endAt+",'"+formField+"')";
	DME(obj,"jsreturn");
}

function DspGlmaster(Location, formField)
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		obj = self.jsreturn.record[i];
		index = TEGlMaster.length;
		TEGlMaster[index] = new Obj();
		TEGlMaster[index].name = obj.sub_account;
		TEGlMaster[index].subName = obj.acct_desc;
		TEGlMaster[index].acct = obj.account;
		TEGlMaster[index].subAcct = obj.sub_account;
		TEGlMaster[index].formField	= formField;		
		if (formField=="SUBACCT")
			TEGlMaster[index].code = obj.sub_account;
		else
			TEGlMaster[index].code = obj.account;
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else if (Location < ArrayOfCompanies.length) 
	{
		// Make another DME call to GLMASTER for the next set of MAX_DME_KEY_VALUES companies found in the ArrayOfCompanies array.
		BuildGlMasterFile(Location,formField);
	} 
	else		
		Perform(TEGlMaster);
}

function GetAttendcode()
{
	if (typeof(TEAttendCode) != "undefined")
		Perform(TEAttendCode);
	else
	{
		TEAttendCode = new Array();
		var obj = new DMEObject(authUser.prodline,"ATTENDCODE");
		obj.out = "JAVASCRIPT";
		obj.field = "attend-code;description";
		obj.key = authUser.company+"";
		obj.max = "600";
		obj.debug = false;
		DME(obj,"jsreturn");
	}
}

function DspAttendcode()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		obj = self.jsreturn.record[i];
		index = TEAttendCode.length;
		TEAttendCode[index] = new Obj();
		TEAttendCode[index].code = obj.attend_code;
		TEAttendCode[index].name = obj.description;
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		Perform(TEAttendCode);
}

function GetGlsystem()
{
	if (typeof(TEGlCompany) != "undefined")
		Perform(TEGlCompany);
	else
	{
		TEGlCompany = new Array();
		var obj = new DMEObject(authUser.prodline,"GLSYSTEM");
		obj.out = "JAVASCRIPT";
		obj.field = "company;name";
		obj.index = "glsset1";
		obj.max = "600";
		obj.debug = false;
		DME(obj,"jsreturn");
	}
}

function DspGlsystem()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var obj = self.jsreturn.record[i];
		var index = TEGlCompany.length;
		TEGlCompany[index] = new Obj();
		TEGlCompany[index].code = obj.company;
		TEGlCompany[index].name = obj.name
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		Perform(TEGlCompany);
}

function GetPayCodes(GroupName)
{
	if (typeof(TEPayCode) != "undefined" && TEPayCode.Length)
		Perform(TEPayCode);
	else
	{
		TEPayCode = new Array();
		var obj = new DMEObject(authUser.prodline,"PRGRPPAY");
		obj.out = "JAVASCRIPT";
		obj.field = "pay-code;description;group-name";
		if (GroupName != null && typeof(GroupName) != "undefined" && GroupName != "undefined" && GroupName != "")
			obj.key = parseInt(authUser.company,10)+"="+escape(GroupName);
		else
			obj.key = parseInt(authUser.company,10)+"="+escape(' ');
		obj.max = "600";
		obj.debug = false;
		obj.sortasc	= "description";
		obj.func = "GetGroupsForPayCodes('"+GroupName+"')";
		DME(obj,"jsreturn");
	}
}

function GetGroupsForPayCodes(GroupName)
{
	if (self.jsreturn.NbrRecs == 0 && GroupName != '')
		GetPayCodes('');
	else
	{
		for (var i=0; i<self.jsreturn.NbrRecs; i++)
		{
			var obj = self.jsreturn.record[i]
			var index = TEPayCode.length;
			TEPayCode[index] = new Obj();
			TEPayCode[index].code = obj.pay_code;
			TEPayCode[index].name = obj.description
		}
		if (self.jsreturn.Next)
			self.jsreturn.location.replace(self.jsreturn.Next);
		else
			Perform(TEPayCode);
	}
}

function DropDownItem(code, description)
{
	this.code = (typeof(code) != "undefined") ? code : null;
	this.description = (typeof(description) != "undefined") ? description : null;
}

function StoreValueList(fieldNm)
{
	if ((fieldNm == "shift") && ((typeof(TEShiftCodes) == "undefined") || (TEShiftCodes.length == 0)))
	{
		TEShiftCodes = new Array(new DropDownItem("1",getSeaPhrase("FIRST_SHIFT","ESS")),
			new DropDownItem("2",getSeaPhrase("SECOND_SHIFT","ESS")),
			new DropDownItem("3",getSeaPhrase("THIRD_SHIFT","ESS")),
			new DropDownItem("4",getSeaPhrase("FOURTH_SHIFT","ESS")),
			new DropDownItem("5",getSeaPhrase("FIFTH_SHIFT","ESS")),
			new DropDownItem("6",getSeaPhrase("SIXTH_SHIFT","ESS")),
			new DropDownItem("7",getSeaPhrase("SEVENTH_SHIFT","ESS")),
			new DropDownItem("8",getSeaPhrase("EIGHTH_SHIFT","ESS")),
			new DropDownItem("9",getSeaPhrase("NINTH_SHIFT","ESS")));	
	}
	else if ((fieldNm == "occurrence") && ((typeof(TEOccurrenceCodes) == "undefined") || (TEOccurrenceCodes.length == 0)))
	{
		TEOccurrenceCodes = new Array(new DropDownItem("Y",getSeaPhrase("YES","ESS")),
			new DropDownItem("N",getSeaPhrase("NO","ESS")));	
	}
}

function GetShift()
{
	if (typeof(TEShiftCodes) != "undefined")
		Perform(TEShiftCodes);
	else
	{
		TEShiftCodes = new Array(new Obj());
		TEShiftCodes[0].code = TEShiftCodes[0].name = '';
		for (var i=1; i<=9; i++)
		{
			TEShiftCodes[i] = new Obj();
			TEShiftCodes[i].code = i+'';
			TEShiftCodes[i].name = "Shift "+i;
		}
		Perform(TEShiftCodes);
	}
}

function GetOccurrence()
{
	if (typeof(TEOccurrenceCodes) != "undefined")
		Perform(TEOccurrenceCodes);
	else
	{
		TEOccurrenceCodes = new Array(new Obj());
		TEOccurrenceCodes[0].code = TEOccurrenceCodes[0].name = '';
		TEOccurrenceCodes[1] = new Obj();
		TEOccurrenceCodes[1].code =	'Y';
		TEOccurrenceCodes[1].name = 'Yes';
		TEOccurrenceCodes[2] = new Obj();
		TEOccurrenceCodes[2].code = 'N';
		TEOccurrenceCodes[2].name = 'No';
		Perform(TEOccurrenceCodes);
	}
}

function GetSchedule()
{
	TEScheduleCodes = new Array();
	var obj = new DMEObject(authUser.prodline,"PRSAGHEAD");
	obj.out = "JAVASCRIPT";
	obj.index = "sghset1";
	obj.field = "description;schedule;effect-date";
	obj.max = "600";
	obj.key = parseFloat(authUser.company)+"=S";
	if (Employee.SalaryClass != null)
		obj.select = "salary-class=" + Employee.SalaryClass;
	obj.debug = false;
	DME(obj,"jsreturn")
}

function DspPrsaghead()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var obj = self.jsreturn.record[i];
		var index = TEScheduleCodes.length;
		TEScheduleCodes[index] = new Obj();
		TEScheduleCodes[index].code = obj.schedule;
		TEScheduleCodes[index].name = obj.description +"\t"+ obj.effect_date;
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		Perform(TEScheduleCodes);
}

function GetStep()
{
	TEPayStepCodes = new Array();
	var obj	= new DMEObject(authUser.prodline, "PRSAGDTL");
	obj.out = "JAVASCRIPT";
	obj.index = "sgdset1";
	obj.field = "schedule;pay-step;pay-rate;effect-date";
	obj.max = "600";
	obj.key = parseFloat(authUser.company)+"";
	obj.debug = false;
	obj.func = "DspStep()";
	DME(obj,"jsreturn");
}

function DspStep()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var obj = self.jsreturn.record[i];
		var index = TEPayStepCodes.length;
		TEPayStepCodes[index] = new Obj();
		TEPayStepCodes[index].subName = obj.schedule +" - "+obj.effect_date;
		TEPayStepCodes[index].code = obj.pay_step;
		TEPayStepCodes[index].name = obj.pay_step +" - "+ obj.pay_rate;
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		Perform(TEPayStepCodes);
}

function GetGrade()
{
	TEPayGradeCodes = new Array();
	var obj	= new DMEObject(authUser.prodline, "PRSAGDTL");
	obj.out = "JAVASCRIPT";
	obj.index = "sgdset1";
	obj.field = "schedule;pay-grade;pay-step;pay-rate;effect-date";
	obj.max = "600";
	obj.key = parseFloat(authUser.company)+"=";
	obj.debug = false;
	obj.func = "DspGrade()";
	DME(obj,"jsreturn");
}

function DspGrade()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var obj = self.jsreturn.record[i];
		var index = TEPayGradeCodes.length;
		TEPayGradeCodes[index] = new Obj();
		TEPayGradeCodes[index].subName = obj.pay_grade+" - "+obj.schedule+" - "+obj.effect_date;
		TEPayGradeCodes[index].code = obj.pay_grade;
		TEPayGradeCodes[index].name = obj.pay_step+" - "+obj.pay_rate;
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		Perform(TEPayGradeCodes);
}


function GetPayGroupCode()
{
	if (typeof(TEPrPayCode) != "undefined")
		Perform(TEPrPayCode);
	else
	{
		TEPrPayCode = new Array();
		var obj = new DMEObject(authUser.prodline,"PRPAYCODE");
		obj.out = "JAVASCRIPT";
		obj.field = "pay-code;description";
		obj.key = authUser.company+"";
		obj.max = "600";
		obj.debug = false;
		obj.func = "DspPayGroupCode()";
		DME(obj,"jsreturn");
	}
}

function DspPayGroupCode()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var obj = self.jsreturn.record[i];
		var index = TEPrPayCode.length;
		TEPrPayCode[index] = new Obj();
		TEPrPayCode[index].code = obj.pay_code;
		TEPrPayCode[index].name = obj.description;
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		Perform(TEPrPayCode);
}

function Perform(myFoo)
{
	if (myFoo.length == 0)
		FinishedSelectBox(getSeaPhrase("CANNT_OPEN_SELECT_BOX_NO_DATA","TE"));
	else
		OpenSelectBox(myFoo);
}

function FieldSelectLoaded()
{	
	stopProcessing();
	if (typeof(window["styler"]) == "undefined" || window.styler == null)
		window.stylerWnd = findStyler(true);
	if (window.stylerWnd && typeof(window.stylerWnd["StylerEMSS"]) == "function")
		window.styler = new window.stylerWnd.StylerEMSS();
	else
		window.styler = window.stylerWnd.styler;
	if (typeof(window.stylerWnd.StylerEMSS["selectControlOnLoad"]) == "function")
	{
		var timeForm = self.TABLE.document.forms["TimeEntry"];
		var i =	timeForm.elements['yCord'].value;
		var j = timeForm.elements['xCord'].value;		
		window.stylerWnd.StylerEMSS.selectControlOnLoad(self.TABLE, timeForm.elements[TimeCard.Form[j].FormField+'_'+i]);
	}	
}

function OpenSelectBox(Information)
{
	Information	= (Information)	? Information : 'null';
	InformationGlobal = Information;
	SelectWindow = window.open("/lawson/xhrnet/ui/windowplain.htm?func=opener.PaintWindowForSelectBoxPre()","SELECT","toolbar=no,status=no,resizable=yes,scrollbars=yes,width="+SizeX+",height="+SizeY);
	try
	{
		if (typeof(SelectWindow) == 'undefined' || SelectWindow.closed)
			FinishedSelectBox(getSeaPhrase("CANNT_OPEN_SELECT_BOX_RESET_BROWSER","TE"));
	} 
	catch(e) {}	
}

function PaintWindowForSelectBoxPre()
{
	var browser = new SEABrowser();
	if (browser.isNS)
	{
		SizeX = SelectWindow.outerWidth;
		SizeY = SelectWindow.outerHeight;
		PaintWindowForSelectBox(InformationGlobal);
	}
	else
		PaintWindowForSelectBox(InformationGlobal);
}

function PaintWindowForSelectBox(Information)
{
	var timeForm = self.TABLE.document.forms["TimeEntry"];
	var j = timeForm.elements['xCord'].value;
	var oldCode, oldName, arg;
	var html = new Array();
	html[0] = '<div style="padding:10px">';
	html[0] += '<table border="0" cellpadding="0" cellspacing="0" style="width:100%;text-align:center;margin-left:auto;margin-right:auto" styler="list" styler_drilldown="false" summary="'+getSeaPhrase("TSUM_11","SEA",[TimeCard.Form[j].FormLabel])+'">';
	html[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[TimeCard.Form[j].FormLabel])+'</caption>';
	html[0] += '<tr><th scope="col" colspan="4"></th></tr>';
	var tip, tipRec;
	for (var i=0; i<Information.length; i++)
	{
		tipRec = '';
		cd = Information[i].code;
		nm = Information[i].name;
		snm  = Information[i].subName;
		if (i > 0)
			snm2 = Information[i-1].subName;
		if (typeof(Information[i] == 'object'))
		{
			if (typeof(cd)!='undefined' && typeof(nm)!='undefined')
				if (oldCode == cd && oldName == nm)
					continue;
			arg = '<tr>';
			if (typeof(snm) != "undefined")
			{
				var snmFlag = false;
				if ((i > 0 && snm != snm2) || i == 0)
				{
					tipRec += snm+' ';
					snmFlag = true;
				}
				tipRec += cd+' '+nm;
				tip = tipRec+' - '+getSeaPhrase("SELECT","SEA");
				if (snmFlag)
					arg += "<td><a href='javascript:;' onclick='opener.SendtoBox(\""+cd+"\");return false;' title='"+tip+"'>"+snm+"<span class='offscreen'> - "+tip+"</span></a></td>";
				arg += "<td><a href='javascript:;' onclick='opener.SendtoBox(\""+cd+"\");return false;' title='"+tip+"'>"+cd+"<span class='offscreen'> - "+tip+"</span></a></td>";
				arg += "<td><a href='javascript:;' onclick='opener.SendtoBox(\""+cd+"\");return false;' title='"+tip+"'>"+nm+"<span class='offscreen'> - "+tip+"</span></a></td>";
				if (!snmFlag)
					arg += "<td></td>";
				oldCode = nm;
			}
			else if (typeof(nm) != 'undefined')
			{
				tipRec += cd+' '+nm;
				tip = tipRec+' - '+getSeaPhrase("SELECT","SEA");				
				arg += "<td><a href='javascript:;' onclick='opener.SendtoBox(\""+cd+"\");return false;' title='"+tip+"'>"+cd+"<span class='offscreen'> - "+tip+"</span></a></td>";
				arg += "<td><a href='javascript:;' onclick='opener.SendtoBox(\""+cd+"\");return false;' title='"+tip+"'>"+nm+"<span class='offscreen'> - "+tip+"</span></a></td><td></td>";
				oldCode = nm;
			}
			else if (typeof(cd) != 'undefined')
			{
				tipRec += cd;
				tip = tipRec+' - '+getSeaPhrase("SELECT","SEA");				
				arg += "<td><a href='javascript:;' onclick='opener.SendtoBox(\""+cd+"\");return false;' title='"+tip+"'>"+cd+"<span class='offscreen'> - "+tip+"</span></a></td><td></td><td></td>";
				oldName = cd;
			}
			else
			{
				tipRec += Information[i];
				tip = tipRec+' - '+getSeaPhrase("SELECT","SEA");				
				arg += "<td><a href='javascript:;' onclick='opener.SendtoBox(\""+cd+"\");return false;' title='"+tip+"'>"+Information[i]+"<span class='offscreen'> - "+tip+"</span></a></td><td></td><td></td>";
			}
			arg += '</tr>';		
			html[html.length] = arg;
		}
	}
	html[html.length] = '</table></div>';
	var paneBody = SelectWindow.document.getElementById("paneBody1");
	paneBody.style.visibility = "hidden";
	paneBody.innerHTML = html.join("");
	SelectWindow.stylePage();
	paneBody.style.visibility = "visible";
	FieldSelectLoaded();
	try { SelectWindow.focus(); } catch(e) {}
}

function RidLeadingSpaces(str)
{
	if (str.charAt(0) != ' ')
		return str;
	else
	{
		for (var i=0; i<str.length; i++)
		{	
			if (str.charAt(i) != " ")
				break;
		}	
		return str.substring(i,str.length);
	}
}

function SendtoBox(val)
{
	FinishedSelectBox("Done", RidLeadingSpaces(val));
}

function CloseWindow_SelectionWindow()
{
	try
	{
		if (typeof(SelectWindow) != "undefined" && !SelectWindow.closed)
			SelectWindow.close();
	}
	catch(e) {}
}

var ACTSDWIND;
var notOnPicks = false;
var TEActivityCodes;

function openActivitySrch()
{
	TEActivityCodes = new Array(0);
	// PT 149021. Selecting activity returns directory listing.
	ACTSDWIND = window.open("/lawson/xhrnet/ui/windowplain.htm?func=opener.GetemployeePicks()","ACTSDWIND","resizable=yes,scrollbars=yes,width=300,height=400");
	if (ACTSDWIND == null)
		FinishedSelectBox(getSeaPhrase("CANNT_OPEN_WIN_RESTART_BROWSER","TE"));
}

function GetemployeePicks()
{
	TEActivityCodes = new Array(0);
	var obj 	= new DMEObject(authUser.prodline,"emppicklst");
	obj.out 	= "JAVASCRIPT";
	obj.field 	= "select-value;desc";
	obj.exclude = "drill;keys;sorts";
	obj.key 	= authUser.company +"="+ parseFloat(Employee.EmployeeNbr) +"=AC";
	obj.func 	= "DspPicksDME()";
	obj.max		= "600";
	DME(obj,"jsreturn");
}

function DspPicksDME()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
		TEActivityCodes[TEActivityCodes.length] = self.jsreturn.record[i];
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next)
	else
		DspPicks();
}

function DspPicks()
{
	var notOnPicks = false;
	var html = new Array();
	if (self.jsreturn.record.length)
	{
		var timeForm = self.TABLE.document.forms["TimeEntry"];
		var j = timeForm.elements['xCord'].value;		
		html[0] = '<div style="padding:10px">';
		html[0] += '<table border="0" cellpadding="0" cellspacing="0" style="width:100%;text-align:center;margin-left:auto;margin-right:auto" styler="list" styler_drilldown="false" summary="'+getSeaPhrase("TSUM_11","SEA",[TimeCard.Form[j].FormLabel])+'">';
		html[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[TimeCard.Form[j].FormLabel])+'</caption>';
		html[0] += '<tr><th scope="col">&nbsp;</th><th scope="col">&nbsp;</th><th scope="col">&nbsp;</th></tr>';
		for (var i=0; i<TEActivityCodes.length; i++)
		{
			var tip1 = getSeaPhrase("DEL_ACTIVITY","TE",[TEActivityCodes[i].select_value+' - '+TEActivityCodes[i].desc]);
			var tip2 = getSeaPhrase("SEL_ACTIVITY","TE",[TEActivityCodes[i].select_value+' - '+TEActivityCodes[i].desc]);
			html[html.length] = '<tr><td><a style="border:none" href="javascript:;" onclick="opener.deletePick('+i+');return false;" title="'+tip1+'" aria-label="'+tip1+'">'
			+ '<img src='+ActivityDeleteIcon+' alt="'+tip1+'" title="'+tip1+'" border="0" onmouseover="this.src=\''+ActivityDeleteIconOver+'\'" onfocus="this.src=\''+ActivityDeleteIconOver+'\'" onmousedown="this.src=\''+ActivityDeleteIconActive+'\'" onkeydown="this.src=\''+ActivityDeleteIconActive+'\'" onmouseout="this.src=\''+ActivityDeleteIcon+'\'" onblur="this.src=\''+ActivityDeleteIcon+'\'"></a>'
			+ '</td><td><a href="javascript:;" onclick="opener.posting('+i+','+notOnPicks+');return false;" title="'+tip2+'">'+TEActivityCodes[i].select_value+'<span class="offscreen"> - '+tip2+'</span></a></td>'
			+ '<td><a href="javascript:;" onclick="opener.posting('+i+','+notOnPicks+');return false;" title="'+tip2+'">'+TEActivityCodes[i].desc+'<span class="offscreen"> - '+tip2+'</span></a></td></tr>';
		}
		html[html.length] = '</table></div>'		
		+ '<p class="textAlignRight">'+uiButton(getSeaPhrase("MORE","TE"),"opener.srchThis("+notOnPicks+");return false")+'</p>';
		var paneBody = ACTSDWIND.document.getElementById("paneBody1");
		paneBody.style.visibility = "hidden";
		paneBody.innerHTML = html.join("");
		ACTSDWIND.stylePage();
		paneBody.style.visibility = "visible";
		FieldSelectLoaded();
		try { ACTSDWIND.focus(); } catch(e) {}
	}
	else
		srchThis();
}

function srchThis(notOnPicks)
{
	TEActivityCodes = new Array();
	var obj 	= new DMEObject(authUser.prodline,"acactivity");
	obj.out 	= "JAVASCRIPT";
	obj.index	= "acvset1";
	obj.field 	= "activity;posting-flag;var-levels;description;activity-grp;structure";
	obj.exclude = "drill;keys;sorts";
	obj.func 	= "DspActsDME()";
	if (emssObjInstance.emssObj.tePostOrGlActivites)
	{	
		obj.cond = "post-or-glonly";
		//code added to compare the dates
		//PT 154201 added the condition in select; also check IOS version
		if (iosHandler.getIOSVersionNumber() >= "08.01.00")					
			obj.select = "acactgrp.active-status!=C&(end-date>="+ymdtoday+"|end-date=00000000)";		
		else				
			obj.select = "end-date>="+ymdtoday+"|end-date=00000000&acactgrp.active-status!=C";
	}
	else
	{
		if (iosHandler.getIOSVersionNumber() >= "08.01.00")				
			obj.select = "acactgrp.active-status!=C&posting-flag=P&(end-date>="+ymdtoday+"|end-date=00000000)";	
		else				
			obj.select = "end-date>="+ymdtoday+"|end-date=00000000&posting-flag=P&acactgrp.active-status!=C";				
	}
	obj.debug 	= false;
	obj.max		= "600";
	DME(obj,"jsreturn");
}

function DspActsDME()
{
	TEActivityCodes = TEActivityCodes.concat(self.jsreturn.record);
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		DspActs();
}

function DspActs()
{
	notOnPicks = true;
	var timeForm = self.TABLE.document.forms["TimeEntry"];
	var j = timeForm.elements['xCord'].value;	
	var toolTip;
	var html = new Array();
	html[0] = '<div style="padding:10px">'
	html[0] += '<table border="0" cellpadding="0" cellspacing="0" style="width:100%;text-align:center;margin-left:auto;margin-right:auto" styler="list" styler_drilldown="false" summary="'+getSeaPhrase("TSUM_11","SEA",[TimeCard.Form[j].FormLabel])+'">';
	html[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[TimeCard.Form[j].FormLabel])+'</caption>';
	html[0] += '<tr><th scope="col">&nbsp;</th><th scope="col">&nbsp;</th><th scope="col">&nbsp;</th></tr>'
	for (var i=0; i<TEActivityCodes.length; i++)
	{
		toolTip = getSeaPhrase("SEL_ACTIVITY","TE",[TEActivityCodes[i].activity+' - '+TEActivityCodes[i].description]);
		html[html.length] = '<tr><td><a href="javascript:;" onclick="opener.posting('+i+','+notOnPicks+');return false;" title="'+toolTip+'">'+TEActivityCodes[i].activity+'<span class="offscreen"> - '+toolTip+'</span></a></td>'
		+ '<td><a href="javascript:;" onclick="opener.posting('+i+','+notOnPicks+');return false;" title="'+toolTip+'">'+TEActivityCodes[i].description+'<span class="offscreen"> - '+toolTip+'</span></a></td></tr>'
	}
	if (TEActivityCodes.length == 0) 
		html[html.length] = '<tr><td class="plaintablecell" colspan="2">'+getSeaPhrase("NO_POSTING_LEVEL_ACTIVITIES","TE")+'</td></tr>'
	html[html.length] = '</table></div>'
	var paneBody = ACTSDWIND.document.getElementById("paneBody1");
	paneBody.style.visibility = "hidden";
	paneBody.innerHTML = html.join("");
	ACTSDWIND.stylePage();
	paneBody.style.visibility = "visible";
	FieldSelectLoaded();
	try { ACTSDWIND.focus(); } catch(e) {}
}

function deletePick(index)
{
	var employee;
	if (typeof(HS221)!="undefined")
		employee = HS221[HS221Index].Employee;
	else
		employee = authUser.employee;
	var obj = new AGSObject(authUser.prodline,"ES02.1");
	obj.event = "CHANGE";
	obj.rtn	= "MESSAGE";
	obj.longNames = true;
	obj.lfn	= "ALL";
	obj.func = "parent.StopAGS()";
	obj.field = "FC=C"
	+"&EPL-COMPANY="+authUser.company
	+"&EPL-EMPLOYEE="+parseFloat(employee)
	+"&LINE-FC1=D"
	+"&EPL-TYPE1=AC"
	+"&EPL-SELECT-VALUE1="+escape(TEActivityCodes[index].select_value)
	+"&EPL-DESC1="+escape(TEActivityCodes[index].desc);
	AGS(obj,"jsreturn");
}

function StopAGS()
{
	if (self.lawheader.gmsgnbr == "000")
		GetemployeePicks();
	else
	{
		stopProcessing();
		seaAlert(self.lawheader.gmsg, "", null, "error");
	}	
}

function posting(index, notOnPicks)
{
	updateFlag = true;
	var activity = "";
	var desc = "";
	var activityStruct = "";
	if (notOnPicks)
	{
		desc = TEActivityCodes[index].description;
		activity = TEActivityCodes[index].activity;
		activityStruct = TEActivityCodes[index].structure;
	}
	else
	{
		desc = TEActivityCodes[index].desc;
		activity = TEActivityCodes[index].select_value;
	}
	setActivityField(activity, activityStruct, desc);
	if (notOnPicks)
	{
		var obj = new AGSObject(authUser.prodline,"ES02.1");
		obj.event = "ADD";
		obj.rtn = "MESSAGE";
		obj.longNames = true;
		obj.lfn = "ALL";
		obj.tds = false;
		obj.field="FC=A"
		+"&EPL-COMPANY="+authUser.company
		+"&EPL-EMPLOYEE="+parseFloat(Employee.EmployeeNbr)
		+"&LINE-FC1=A"
		+"&EPL-TYPE1=AC"
		+"&EPL-SELECT-VALUE1="+escape(activity)
		+"&EPL-DESC1="+escape(desc);
		AGS(obj,"jsreturn");
		CloseActivityWindow();
	}
}

function removeSpace(parm)
{
	parm += '';
	var newParm = '';
	for (var i=0; i<parm.length; i++)
	{
		if (parm.charAt(i) != " ")
			newParm += parm.charAt(i);
	}
	return newParm;
}

function CloseActivityWindow()
{
	try
	{
		if (typeof(ACTSDWIND) != "undefined" && !ACTSDWIND.closed)
			ACTSDWIND.close();
	}
	catch(e) {}
}

/* Filter Select logic - start */
function performDmeFieldFilterOnLoad(dmeFilter, dmeFlag)
{
	switch (dmeFilter.getFieldNm().toLowerCase())
	{
		case "location":
			dmeFilter.addFilterField("code", 10, getSeaPhrase("JOB_PROFILE_6","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"LO", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);	
		break;	
		case "acacctcat": // account category
			// PT 178462. Filter account categories by activity structure, if the user has selected an activity.
			userActivity = null;
			userActivityStruct = null;
			for (var j=1; j<TimeCard.Form.length; j++)
			{
				if (TimeCard.Form[j].FormField == "ACTIVITY")
				{
					var y =	self.TABLE.document.TimeEntry.yCord.value
					var activity = self.TABLE.document.TimeEntry[TimeCard.Form[j].FormField+'_'+y];
					if (typeof(activity) != "undefined" && activity)
					{
						var activityVal = activity.value;
						if (NonSpace(activityVal) > 0)
						{
							userActivity = activityVal;
							if (activity.getAttribute("actstruct") != null)
							{
								userActivityStruct = activity.getAttribute("actstruct");
								activity.removeAttribute("actstruct");
							}
							else if (!dmeFlag)
							{
								GetActivityStruct(userActivity, activity, function(){performDmeFieldFilterOnLoad(dmeFilter, true)});														
								return;
							}
						}
						else if (activity.getAttribute("actstruct") != null)
							activity.removeAttribute("actstruct");
					}	
					break;
				}	
			}
			if (userActivityStruct != null)
			{
				dmeFilter.addFilterField("acct-category", 5, getSeaPhrase("ACCOUNT_CATEGORY","ESS"), true);
				dmeFilter.addFilterField("acacctcat.description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);	
				filterDmeCall(dmeFilter,
					"jsreturn",
					"accatsumx", 
					"srxset1", 
					"acct-category;acacctcat.description", 
					escape(userActivityStruct,1), 
					null, 
					"", 
					dmeFilter.getNbrRecords(), 
					null);
			}
			else
			{
				dmeFilter.addFilterField("acct-category", 5, getSeaPhrase("ACCOUNT_CATEGORY","ESS"), true);
				dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);	
				filterDmeCall(dmeFilter,
					"jsreturn",
					"acacctcat", 
					"aaxset1", 
					"acct-category;description", 
					"", 
					null, 
					"", 
					dmeFilter.getNbrRecords(), 
					null);
			}	
		break;	
		case "deptcode": // department			
			dmeFilter.addFilterField("department", 5, getSeaPhrase("DEPARTMENT_CODE","ESS"), true);
			var keyValue = String(authUser.company);
			if (userProcessLevel)
				keyValue += "=" + userProcessLevel;
			else
				dmeFilter.addFilterField("process-level", 5, getSeaPhrase("PROCESS_LEVEL_CODE","ESS"), true);
			dmeFilter.addFilterField("name", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"deptcode",
				"dptset1",
				"department;process-level;name",
				keyValue,
				"active",
				null,
				dmeFilter.getNbrRecords(),
				null);		
		break;		
		case "prsystem": // process level
			dmeFilter.addFilterField("process-level", 5, getSeaPhrase("PROCESS_LEVEL_CODE","ESS"), true);
			dmeFilter.addFilterField("name", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);		
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prsystem",
				"prsset1",
				"process-level;name",
				String(authUser.company),
				"active-pl",
				null,
				dmeFilter.getNbrRecords(),
				null);		
		break;
		case "glaccount": // expense account
			if ((typeof(ArrayOfCompanies) == "undefined") || (ArrayOfCompanies.length == 0)) 
			{
				getInterCompanyRelationships(dmeFilter.getFieldNm());
				return false;
			}
			var selectValue = "active-status!=I";			
			var keyValue = ArrayOfCompanies.join(";");
			dmeFilter.addFilterField("acct-unit", 15, getSeaPhrase("JOB_PROFILE_5","ESS"), true);
			dmeFilter.addFilterField("account", 6, getSeaPhrase("ACCOUNT","ESS"), true, true);
			dmeFilter.addFilterField("acct-desc", 60, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"glmaster", 
				"glmset2", 
				"acct-unit;account;acct-desc", 
				keyValue, 
				null, 
				selectValue, 
				dmeFilter.getNbrRecords(), 
				null);	
		break;		
		case "subacct": // expense subaccount
			if ((typeof(ArrayOfCompanies) == "undefined") || (ArrayOfCompanies.length == 0)) 
			{
				getInterCompanyRelationships(dmeFilter.getFieldNm());
				return false;
			}
			var selectValue = "active-status!=I";			
			var keyValue = ArrayOfCompanies.join(";");		
			dmeFilter.addFilterField("acct-unit", 15, getSeaPhrase("JOB_PROFILE_5","ESS"), true);
			dmeFilter.addFilterField("account", 6, getSeaPhrase("ACCOUNT","ESS"), true, true);
			dmeFilter.addFilterField("sub-account", 4, getSeaPhrase("SUBACCOUNT","ESS"), false, true);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"glmaster", 
				"glmset2", 
				"acct-unit;account;sub-account", 
				keyValue, 
				null, 
				selectValue, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;		
		case "glnames": // accounting unit
			userGLAccount = null;
			for (var j=1; j<TimeCard.Form.length; j++)
			{
				if (TimeCard.Form[j].FormField == "GLCOMPANY")
				{
					var y =	self.TABLE.document.TimeEntry.yCord.value
					var glCo = self.TABLE.document.TimeEntry[TimeCard.Form[j].FormField+'_'+y];
					if (typeof(glCo) != "undefined" && glCo)
					{
						var glCoVal = glCo.value;
						if (NonSpace(glCoVal) > 0)
						{
							userGLAccount = glCoVal;
							break;
						}
					}	
				}	
			}		
			if ((userGLAccount == null) && ((typeof(ArrayOfCompanies) == "undefined") || (ArrayOfCompanies.length == 0))) 
			{
				getInterCompanyRelationships(dmeFilter.getFieldNm());
				return false;
			}
			var keyValue = (userGLAccount != null) ? userGLAccount : ArrayOfCompanies.join(";");
			dmeFilter.addFilterField("acct-unit", 15, getSeaPhrase("JOB_PROFILE_5","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"glnames", 
				"glnset1", 
				"acct-unit;description", 
				keyValue, 
				"postable", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;		
		case "glsystem": // gl company
			dmeFilter.addFilterField("company", 4, getSeaPhrase("CO","ESS"), true, true);
			dmeFilter.addFilterField("name", 30, getSeaPhrase("NAME","ESS"), false);
			dmeFilter.selectFilterOption("company");			
			filterDmeCall(dmeFilter,
				"jsreturn",
				"glsystem",
				"glsset1",
				"company;name",
				"",
				null,
				null,
				dmeFilter.getNbrRecords(),
				null);		
		break;
		case "jobcode": // job code
			dmeFilter.addFilterField("job-code", 9, getSeaPhrase("JOB_OPENINGS_6","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"jobcode", 
				"jbcset1", 
				"job-code;description;", 
				String(authUser.company), 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);				
		break;
		case "paposition": // position
			dmeFilter.addFilterField("process-level", 5, getSeaPhrase("PROCESS_LEVEL_CODE","ESS"), true);
			dmeFilter.addFilterField("department", 5, getSeaPhrase("DEPARTMENT_CODE","ESS"), true);
			dmeFilter.addFilterField("position", 12, getSeaPhrase("JOB_PROFILE_8","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);	
			filterDmeCall(dmeFilter,
				"jsreturn",
				"paposition", 
				"posset3", 
				"process-level;department;position;description;", 
				String(authUser.company), 
				"active-current", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);
		break;	
		case "attendcd": // attendance code
			dmeFilter.addFilterField("attend-code", 2, getSeaPhrase("ATTENDANCE_CODE","TE"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"attendcode", 
				"atcset1", 
				"attend-code;description;", 
				String(authUser.company), 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);				
		break;
		case "prsaghead": // schedule
			var selectValue =  null;
			if (Employee.SalaryClass != null)
				selectValue = "salary-class=" + Employee.SalaryClass;
			dmeFilter.addFilterField("schedule", 9, getSeaPhrase("PAY_SCHEDULE","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);	
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prsaghead", 
				"sghset2", 
				"schedule;description;effect-date", 
				String(authUser.company) + "=S", 
				null, 
				selectValue, 
				dmeFilter.getNbrRecords(), 
				null);				
		break;
		case "grade": // grade
			dmeFilter.addFilterField("pay-grade", 3, getSeaPhrase("PAY_GRADE","ESS"), false);
			dmeFilter.addFilterField("schedule", 9, getSeaPhrase("PAY_SCHEDULE","ESS"), true);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prsagdtl", 
				"sgdset1", 
				"schedule;pay-grade;effect-date;pay-step;pay-rate", 
				String(authUser.company), 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);				
		break;
		case "step": // step
			dmeFilter.addFilterField("pay-step", 3, getSeaPhrase("PAY_STEP","ESS"), true, true);
			dmeFilter.addFilterField("schedule", 9, getSeaPhrase("PAY_SCHEDULE","ESS"), true);		
			dmeFilter.selectFilterOption("pay-step");	
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prsagdtl", 
				"sgdset1", 
				"schedule;effect-date;pay-step;pay-rate", 
				String(authUser.company), 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);				
		break;
		case "prgrppay": // pay code
		case "prgrppay2":
			var keyValue = String(authUser.company);
			if ((typeof(Employee.PayCodeGroupName) != "undefined") && (Employee.PayCodeGroupName != null) && (NonSpace(Employee.PayCodeGroupName) > 0))
				keyValue += "=" + escape(Employee.PayCodeGroupName, 1);
			else
				keyValue += "=" + escape(' ');
			dmeFilter.addFilterField("pay-code", 4, getSeaPhrase("PAY_CODE","TE"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);	
			//PT 161545
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prgrppay", 
				"ppyset1", 
				"pay-code;description", 
				keyValue, 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "tfpaycode": // pay group code
			dmeFilter.addFilterField("pay-code", 4, getSeaPhrase("PAY_CODE","TE"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);	
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prpaycode", 
				"pcdset1", 
				"pay-code;description", 
				String(authUser.company), 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);				
		break;
		case "acactgrp": // activity group
			dmeFilter.addFilterField("activity-grp", 15, getSeaPhrase("ACTIVITY_GROUP","TE"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);	
			filterDmeCall(dmeFilter,
				"jsreturn",
				"acactgrp", 
				"agpset1", 
				"activity-grp;description", 
				"", 
				"open-act-grp", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "emppicklst": // employee cached activity
			dmeFilter.addFilterField("select-value", 30, getSeaPhrase("ACTIVITY","TE"), true);
			dmeFilter.addFilterField("desc", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);	
			filterDmeCall(dmeFilter,
				"jsreturn",
				"emppicklst", 
				"eplset1", 
				"select-value;desc", 
				String(authUser.company) + "=" + Number(Employee.EmployeeNbr) + "=AC", 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);			
		break;
		case "acactivity": // activity
			var condValue = null;
			var selectValue = null;
			if (emssObjInstance.emssObj.tePostOrGlActivites)
			{
				condValue = "post-or-glonly";
				if (iosHandler.getIOSVersionNumber() >= "08.01.00")
					selectValue = "acactgrp.active-status!=C&(end-date>=" + ymdtoday + "|end-date=00000000)";
				else
					selectValue = "end-date>=" + ymdtoday + "|end-date=00000000&acactgrp.active-status!=C";
			}
			else
			{
				if (iosHandler.getIOSVersionNumber() >= "08.01.00")
					selectValue = "acactgrp.active-status!=C&posting-flag=P&(end-date>=" + ymdtoday + "|end-date=00000000)";
				else
					selectValue = "end-date>=" + ymdtoday + "|end-date=00000000&posting-flag=P&acactgrp.active-status!=C";
			}			
			dmeFilter.addFilterField("activity", 15, getSeaPhrase("ACTIVITY","TE"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"acactivity", 
				"acvset1", 
				"activity;structure;description", 
				"", 
				condValue, 
				selectValue, 
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
		case "location":
		filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"LO", 
				"active", 
				dmeFilter.getSelectStr(), 
				dmeFilter.getNbrRecords(), 
				null);			
		break;
		case "acacctcat": // account category
		// PT 178462. Filter account categories by activity group, if the user has selected an activity.
		if (userActivityStruct != null)
		{
			filterDmeCall(dmeFilter,
				"jsreturn",
				"accatsumx", 
				"srxset1", 
				"acct-category;acacctcat.description", 
				escape(userActivityStruct,1), 
				null, 
				dmeFilter.getSelectStr(), 
				dmeFilter.getNbrRecords(), 
				null);
		}
		else
		{
			filterDmeCall(dmeFilter,
				"jsreturn",
				"acacctcat", 
				"aaxset1", 
				"acct-category;description", 
				"", 
				null, 
				dmeFilter.getSelectStr(), 
				dmeFilter.getNbrRecords(), 
				null);		
		}
		break;
		case "deptcode": // department			
		var keyValue = String(authUser.company);
		if (userProcessLevel)
			keyValue += "=" + userProcessLevel;
		filterDmeCall(dmeFilter,
			"jsreturn",
			"deptcode",
			"dptset1",
			"department;process-level;name",
			keyValue,
			"active",
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);		
		break;	
		case "prsystem": // process level
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prsystem",
			"prsset1",
			"process-level;name",
			String(authUser.company),
			"active-pl",
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);		
		break;	
		case "glaccount": // expense account
		var selectValue = "active-status!=I";
		if (dmeFilter.getSelectStr() != null)
			selectValue += "&" + dmeFilter.getSelectStr();	
		var keyValue = ArrayOfCompanies.join(";");
		filterDmeCall(dmeFilter,
			"jsreturn",
			"glmaster", 
			"glmset2", 
			"acct-unit;account;acct-desc", 
			keyValue, 
			null, 
			selectValue, 
			dmeFilter.getNbrRecords(), 
			null);		
		break;	
		case "subacct": // expense subaccount
		var selectValue = "active-status!=I";
		if (dmeFilter.getSelectStr() != null)
			selectValue += "&" + dmeFilter.getSelectStr();
		var keyValue = ArrayOfCompanies.join(";");		
		filterDmeCall(dmeFilter,
			"jsreturn",
			"glmaster", 
			"glmset2", 
			"acct-unit;account;sub-account", 
			keyValue, 
			null, 
			selectValue, 
			dmeFilter.getNbrRecords(), 
			null);		
		break;	
		case "glnames": // accounting unit
		userGLAccount = null;
		for (var j=1; j<TimeCard.Form.length; j++)
		{
			if (TimeCard.Form[j].FormField == "GLCOMPANY")
			{
				var y =	self.TABLE.document.TimeEntry.yCord.value
				var glCo = self.TABLE.document.TimeEntry[TimeCard.Form[j].FormField+'_'+y];
				if (typeof(glCo) != "undefined" && glCo)
				{
					var glCoVal = glCo.value;
					if (NonSpace(glCoVal) > 0)
					{
						userGLAccount = glCoVal;
						break;
					}
				}	
			}	
		}		
		var keyValue = (userGLAccount != null) ? userGLAccount : ArrayOfCompanies.join(";");
		filterDmeCall(dmeFilter,
			"jsreturn",
			"glnames", 
			"glnset1", 
			"acct-unit;description", 
			keyValue, 
			"postable", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;	
		case "glsystem": // gl company
		filterDmeCall(dmeFilter,
			"jsreturn",
			"glsystem",
			"glsset1",
			"company;name",
			"",
			null,
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);		
		break;	
		case "jobcode": // job code
		filterDmeCall(dmeFilter,
			"jsreturn",
			"jobcode", 
			"jbcset1", 
			"job-code;description;", 
			String(authUser.company), 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);				
		break;	
		case "paposition": // position
		filterDmeCall(dmeFilter,
			"jsreturn",
			"paposition", 
			"posset3", 
			"process-level;department;position;description;", 
			String(authUser.company), 
			"active-current", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);
		break;	
		case "attendcd": // attendance code
		filterDmeCall(dmeFilter,
			"jsreturn",
			"attendcode", 
			"atcset1", 
			"attend-code;description;", 
			String(authUser.company), 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);				
		break;	
		case "prsaghead": // schedule
		var selectValue = null;
		if (Employee.SalaryClass != null)
			selectValue = "salary-class=" + Employee.SalaryClass;
		if (dmeFilter.getSelectStr() != null)
			selectValue += "&" + dmeFilter.getSelectStr();
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prsaghead", 
			"sghset2", 
			"schedule;description;effect-date", 
			String(authUser.company) + "=S", 
			null, 
			selectValue, 
			dmeFilter.getNbrRecords(), 
			null);				
		break;
		case "grade": // grade
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prsagdtl", 
			"sgdset1", 
			"schedule;pay-grade;effect-date;pay-step;pay-rate", 
			String(authUser.company), 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);				
		break;	
		case "step": // step
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prsagdtl", 
			"sgdset1", 
			"schedule;effect-date;pay-step;pay-rate", 
			String(authUser.company), 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);				
		break;	
		case "prgrppay": // pay code
		case "prgrppay2":
		var keyValue = String(authUser.company);
		if ((typeof(Employee.PayCodeGroupName) != "undefined") && (Employee.PayCodeGroupName != null) && (NonSpace(Employee.PayCodeGroupName) > 0))
			keyValue += "=" + escape(Employee.PayCodeGroupName, 1);
		else
			keyValue += "=" + escape(' ');
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prgrppay", 
			"ppyset1", 
			"pay-code;description", 
			keyValue, 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;
		case "tfpaycode": // pay group code
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prpaycode", 
			"pcdset1", 
			"pay-code;description", 
			String(authUser.company), 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);				
		break;
		case "acactgrp": // activity group
		filterDmeCall(dmeFilter,
			"jsreturn",
			"acactgrp", 
			"agpset1", 
			"activity-grp;description", 
			"", 
			"open-act-grp", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;
		case "emppicklst": // employee cached activity
		filterDmeCall(dmeFilter,
			"jsreturn",
			"emppicklst", 
			"eplset1", 
			"select-value;desc", 
			String(authUser.company) + "=" + Number(Employee.EmployeeNbr) + "=AC", 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);			
		break;	
		case "acactivity": // activity
			var condValue = null;
			var selectValue = null;
			if (emssObjInstance.emssObj.tePostOrGlActivites)
			{
				condValue = "post-or-glonly";
				if (iosHandler.getIOSVersionNumber() >= "08.01.00")
					selectValue = "acactgrp.active-status!=C&(end-date>=" + ymdtoday + "|end-date=00000000)";
				else
					selectValue = "end-date>=" + ymdtoday + "|end-date=00000000&acactgrp.active-status!=C";
			}
			else
			{
				if (iosHandler.getIOSVersionNumber() >= "08.01.00")
       		 		selectValue = "acactgrp.active-status!=C&posting-flag=P&(end-date>=" + ymdtoday + "|end-date=00000000)";
				else
					selectValue = "end-date>=" + ymdtoday + "|end-date=00000000&posting-flag=P&acactgrp.active-status!=C";
			}
			if (dmeFilter.getSelectStr() != null) 
			{		
				if (selectValue != null)
					selectValue += "&" + dmeFilter.getSelectStr();
				else
					selectValue = dmeFilter.getSelectStr();
			}	
			filterDmeCall(dmeFilter,
				"jsreturn",
				"acactivity", 
				"acvset1", 
				"activity;structure;description", 
				"", 
				condValue, 
				selectValue, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;		
		default: break;
	}
}

function validateDmeFieldFilter(dmeFilter, filterForm)
{
	var selObj = filterForm.elements["filterField"];
	var filterField = selObj.options[selObj.selectedIndex];
	var keywords = filterForm.elements["keywords"].value;
	if (filterField.getAttribute("isNumeric") == "true") 
	{
		dmeFilter.getWindow().clearRequiredField(filterForm.elements["keywords"]);
		if (ValidNumber(filterForm.elements["keywords"], filterField.getAttribute("fieldSize"), 0) == false) 
		{
			dmeFilter.getWindow().setRequiredField(filterForm.elements["keywords"], getSeaPhrase("INVALID_NO","ESS"));
			return false;	
		}
	}
	return true;
}

function dmeFieldRecordSelected(recIndex, fieldNm)
{
	var selRec = self.jsreturn.record[recIndex];
	switch (fieldNm.toLowerCase())
	{
		case "location": // location
			SendtoBox(selRec.code);
			break;
		case "acacctcat": // account category	
			SendtoBox(selRec.acct_category);
			break;
		case "deptcode": // department	
			SendtoBox(selRec.department);
			break;
		case "prsystem": // process level	
			SendtoBox(selRec.process_level);
			break;	
		case "glaccount": // expense account	
			SendtoBox(selRec.account);
			break;	
		case "subacct": // expense subaccount	
			SendtoBox(selRec.sub_account);
			break;	
		case "glnames": // accounting unit
			SendtoBox(selRec.acct_unit);
			break;
		case "glsystem": // gl company
			SendtoBox(selRec.company);
			break;
		case "jobcode": // job code
			SendtoBox(selRec.job_code);
			break;
		case "paposition": // position
			SendtoBox(selRec.position);
			break;
		case "attendcd": // attendance code
			SendtoBox(selRec.attend_code);
			break;
		case "prsaghead": // schedule
			SendtoBox(selRec.schedule);				
			break;
		case "grade": // grade
			SendtoBox(selRec.pay_grade);
			break;
		case "step": // step
			SendtoBox(selRec.pay_step);
			break;
		break;
		case "prgrppay": // pay code
		case "prgrppay2":
			SendtoBox(selRec.pay_code);
			break;
		case "tfpaycode": // pay group code
			SendtoBox(selRec.pay_code);
			break;
		break;
		case "acactgrp": // activity group
			SendtoBox(selRec.activity_grp);
			break;
		break;
		case "emppicklst": // employee cached activity		
			setActivityField(selRec.select_value, "", selRec.desc);
			break;
		case "acactivity": // activity
			setActivityField(selRec.activity, selRec.structure, selRec.description);
			cacheActivity(selRec.activity, selRec.description);
			break;					
		break;			
		default: break;
	}
	try { filterWin.close(); } catch(e) {}	
}

function getDmeFieldElement(fieldNm)
{
	var fld = [null, null, null];
	try
	{
		var i =	self.TABLE.document.TimeEntry.yCord.value;
		var j = self.TABLE.document.TimeEntry.xCord.value;
		var textBox = self.TABLE.document.TimeEntry[TimeCard.Form[j].FormField+'_'+i];	
		fld = [self.TABLE, textBox, TimeCard.Form[j].FormLabel];
	}
	catch(e) {}
	return fld;
}

function getValueListFieldElement(fieldNm)
{
	var i =	self.TABLE.document.TimeEntry.yCord.value;
	var j = self.TABLE.document.TimeEntry.xCord.value;
	var textBox = self.TABLE.document.TimeEntry[TimeCard.Form[j].FormField+'_'+i];
	var fld = [self.TABLE, textBox, TimeCard.Form[j].FormLabel];
	return fld;
}

function valueListFieldRecordSelected(recIndex, fieldNm)
{
	var selRec;
	switch (fieldNm.toLowerCase())
	{
		case "shift": // shift
			selRec = TEShiftCodes[recIndex];
			SendtoBox(selRec.code);
			break;	
		case "occurrence": // occurrence
			selRec = TEOccurrenceCodes[recIndex];
			SendtoBox(selRec.code);
			break;			
		default: break;
	}
	try { filterWin.close(); } catch(e) {}
}

function drawDmeFieldFilterContent(dmeFilter)
{
	var selectHtml = new Array();
	var dmeRecs = self.jsreturn.record;
	var nbrDmeRecs = dmeRecs.length;
	var fieldNm = dmeFilter.getFieldNm().toLowerCase();
	var fldObj = getDmeFieldElement(fieldNm);
	var fldDesc = fldObj[2];	
	var filterNode = emssObjInstance.emssObj.getConfigSettingNode("filter_select");
	var pinned = (filterNode.getAttribute("pinned") == null || filterNode.getAttribute("pinned").toLowerCase() != "false") ? true : false;
	var fromWndStr = (pinned) ? "parent" : "opener";
	switch (fieldNm)
	{
		case "location":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("JOB_PROFILE_6","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.code) ? tmpObj.code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;	
		case "acacctcat": // account category
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("ACCOUNT_CATEGORY","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.acct_category) ? tmpObj.acct_category : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : ((tmpObj.acacctcat_description) ? tmpObj.acacctcat_description : '&nbsp;')			
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "deptcode": // department
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("DEPARTMENT_CODE","ESS")+'</th>'	
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("PROCESS_LEVEL_CODE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.department) ? tmpObj.department : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.process_level) ? tmpObj.process_level : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.name) ? tmpObj.name : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;		
		case "prsystem": // process level
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("PROCESS_LEVEL_CODE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.process_level) ? tmpObj.process_level : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.name) ? tmpObj.name : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "glaccount": // expense account
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("JOB_PROFILE_5","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("ACCOUNT","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.acct_unit) ? tmpObj.acct_unit : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.account) ? tmpObj.account : '&nbsp;'				
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'				
				selectHtml[i+1] += (tmpObj.acct_desc) ? tmpObj.acct_desc : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'		
		break;
		case "subacct": // expense subaccount
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("JOB_PROFILE_5","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("ACCOUNT","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("SUBACCOUNT","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.acct_unit) ? tmpObj.acct_unit : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.account) ? tmpObj.account : '&nbsp;'				
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'				
				selectHtml[i+1] += (tmpObj.sub_account) ? tmpObj.sub_account : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'		
		break;	
		case "glnames": // accounting unit
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("JOB_PROFILE_5","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.acct_unit) ? tmpObj.acct_unit : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'		
		break;	
		case "glsystem": // gl company
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("CO","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("NAME","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.company) ? tmpObj.company : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.name) ? tmpObj.name : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'		
		break;
		case "jobcode": // job code
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_6","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.job_code) ? tmpObj.job_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;	
		case "paposition": // position
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:25%">'+getSeaPhrase("PROCESS_LEVEL_CODE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:25%">'+getSeaPhrase("DEPARTMENT_CODE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:25%">'+getSeaPhrase("JOB_PROFILE_8","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:25%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.process_level) ? tmpObj.process_level : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.department) ? tmpObj.department : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.position) ? tmpObj.position : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="4" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "attendcd": // attendance code
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("ATTENDANCE_CODE","TE")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.attend_code) ? tmpObj.attend_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "prsaghead": // schedule
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("PAY_SCHEDULE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("HOME_ADDR_1","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.schedule) ? tmpObj.schedule : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.effect_date) ? tmpObj.effect_date : '&nbsp;'				
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;	
		case "grade": // grade
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:20%">'+getSeaPhrase("PAY_SCHEDULE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:20%">'+getSeaPhrase("HOME_ADDR_1","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:20%">'+getSeaPhrase("PAY_GRADE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:20%">'+getSeaPhrase("PAY_STEP","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:20%">'+getSeaPhrase("PAY_RATE","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'			
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'				
				selectHtml[i+1] += (tmpObj.schedule) ? tmpObj.schedule : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.effect_date) ? tmpObj.effect_date : '&nbsp;'				
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.pay_grade) ? tmpObj.pay_grade : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'				
				selectHtml[i+1] += (tmpObj.pay_step) ? tmpObj.pay_step : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.pay_rate) ? tmpObj.pay_rate : '&nbsp;'				
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="5" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "step": // step
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:25%">'+getSeaPhrase("PAY_SCHEDULE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:25%">'+getSeaPhrase("HOME_ADDR_1","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:25%">'+getSeaPhrase("PAY_STEP","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:25%">'+getSeaPhrase("PAY_RATE","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'			
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'				
				selectHtml[i+1] += (tmpObj.schedule) ? tmpObj.schedule : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.effect_date) ? tmpObj.effect_date : '&nbsp;'				
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.pay_step) ? tmpObj.pay_step : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.pay_rate) ? tmpObj.pay_rate : '&nbsp;'				
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="4" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "prgrppay": // pay code
		case "prgrppay2":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("PAY_CODE","TE")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.pay_code) ? tmpObj.pay_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'			
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;	
		case "tfpaycode": // pay group code
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("PAY_CODE","TE")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.pay_code) ? tmpObj.pay_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'			
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "acactgrp": // activity group
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("ACTIVITY_GROUP","TE")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.activity_grp) ? tmpObj.activity_grp : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'			
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;	
		case "emppicklst": // employee cached activity
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:47%">'+getSeaPhrase("ACTIVITY","TE")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:47%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" class="textAlignRight" style="width:6%;padding-right:5px">&nbsp;</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				var toolTip = getSeaPhrase("DEL_ACTIVITY","TE")+': '+tmpObj.select_value+', '+tmpObj.desc;
				selectHtml[i+1] = '<tr class="filterTableRow">'							
				selectHtml[i+1] += '<td onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.select_value) ? tmpObj.select_value : '&nbsp;'
				selectHtml[i+1] += '</a></td><td onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.desc) ? tmpObj.desc : '&nbsp;'				
				selectHtml[i+1] += '</a></td><td style="padding-left:5px"><a style="border:none" href="javascript:;" onclick="'+fromWndStr+'.deleteCachedActivity('+i+',\''+fieldNm+'\');return false;" title="'+toolTip+'" aria-label="'+toolTip+'">'
				selectHtml[i+1] += '<img src="'+ActivityDeleteIcon+'" alt="'+toolTip+'" title="'+toolTip+'" border="0" '				
				selectHtml[i+1] += 'onmouseover="this.src=\''+ActivityDeleteIconOver+'\'" onfocus="this.src=\''+ActivityDeleteIconOver+'\'" onmousedown="this.src=\''+ActivityDeleteIconActive+'\'" onkeydown="this.src=\''+ActivityDeleteIconActive+'\'" onmouseout="this.src=\''+ActivityDeleteIcon+'\'" onblur="this.src=\''+ActivityDeleteIcon+'\'"></a>'
				selectHtml[i+1] += '</td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
			var toolTip = getSeaPhrase("MORE_ACTIVITIES","TE");
			selectHtml[selectHtml.length] = '<button class="filterSearchButton" style="margin-top:5px" type="button" role="button" title="'+toolTip+'" aria-label="'+toolTip+'" name="moreBtn" id="moreBtn" onclick="'+fromWndStr+'.openDmeFieldFilter(\'acactivity\');return false;">'+getSeaPhrase("MORE","TE")+'</button>'
		break;
		case "acactivity": // activity
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("ACTIVITY","TE")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.activity) ? tmpObj.activity : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'			
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;		
		default: break;
	}
	dmeFilter.getRecordElement().innerHTML = selectHtml.join("");	
}

function drawValueListContent(dmeFilter)
{
	var selectHtml = new Array();
	var fieldNm = dmeFilter.getFieldNm().toLowerCase();
	var fldObj = getDmeFieldElement(fieldNm);
	var fldDesc = fldObj[2];	
	var nbrRecs = 0;
	switch (fieldNm)
	{
		case "shift": // shift		
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("SHIFT","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			nbrRecs = (TEShiftCodes) ? TEShiftCodes.length : 0;
			for (var i=0; i<nbrRecs; i++)
			{
				tmpObj = TEShiftCodes[i];
				selectHtml[i+1] = '<tr onclick="valueListFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="valueListFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.code) ? tmpObj.code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="valueListFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrRecs == 0)
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'			
			break;
		case "occurrence": // occurrence		
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("OCCURRENCE","TE")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			nbrRecs = (TEOccurrenceCodes) ? TEOccurrenceCodes.length : 0;
			for (var i=0; i<nbrRecs; i++)
			{
				tmpObj = TEOccurrenceCodes[i];
				selectHtml[i+1] = '<tr onclick="valueListFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="valueListFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.code) ? tmpObj.code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="valueListFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrRecs == 0)
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'			
			break;			
		default: break;
	}
	dmeFilter.getRecordElement().innerHTML = selectHtml.join("");
}

function cacheActivity(activity, description)
{
	var obj = new AGSObject(authUser.prodline, "ES02.1");
	obj.event = "ADD";
	obj.rtn = "MESSAGE";
	obj.func = "parent.cachedActivity()";
	obj.longNames = true;
	obj.lfn = "ALL";
	obj.tds = false;
	obj.field= "FC=A"
	+ "&EPL-COMPANY=" + authUser.company
	+ "&EPL-EMPLOYEE=" + parseFloat(Employee.EmployeeNbr)
	+ "&LINE-FC1=A"
	+ "&EPL-TYPE1=AC"
	+ "&EPL-SELECT-VALUE1=" + escape(activity)
	+ "&EPL-DESC1=" + escape(description, 1)
	AGS(obj, "jsreturn");
}

function cachedActivity()
{
}

function deleteCachedActivity(recIndex, fieldNm)
{
	var selRec = self.jsreturn.record[recIndex];
	var employee;
	if (typeof(HS221) != "undefined")
		employee = HS221[HS221Index].Employee;
	else
		employee = authUser.employee;
	var obj = new AGSObject(authUser.prodline, "ES02.1");
	obj.event = "CHG";
	obj.rtn	= "MESSAGE";
	obj.longNames = true;
	obj.lfn = "ALL";
	obj.func = "parent.deletedCachedActivity('"+fieldNm+"')";
	obj.field = "FC=C"
	+ "&EPL-COMPANY=" + authUser.company
	+ "&EPL-EMPLOYEE=" + parseInt(employee, 10)
	+ "&LINE-FC1=D"
	+ "&EPL-TYPE1=AC"
	+ "&EPL-SELECT-VALUE1=" + escape(selRec.select_value, 1)
	+ "&EPL-DESC1=" + escape(selRec.desc, 1);
	AGS(obj,"jsreturn");	
}

function deletedCachedActivity(fieldNm)
{
	if (Number(self.lawheader.gmsgnbr) == 0)
	{
		var dmeFilter = dmeFilterFieldHash.get(fieldNm);
		var filterForm = dmeFilter.getFilterForm();
		filterForm.elements["filterBtn"].onclick();
	}
	else
	{
		stopProcessing();
		seaAlert(self.lawheader.gmsg, "", null, "error");
	}	
}

function getInterCompanyRelationships(fieldNm)
{
	ArrayOfCompanies = new Array();
	// Add the HR company to the array of total companies; without this, we only get
	// the list of GL companies that are inter-related to the HR company.
	ArrayOfCompanies[0] = authUser.company;
	var obj = new DMEObject(authUser.prodline, "glintco");
	obj.out = "JAVASCRIPT";
	obj.index = "gicset1";
	obj.field = "company-b";
	obj.max = String(MAX_DME_KEY_VALUES);
	obj.debug = false;
	obj.select = "company-a=" + authUser.company;
	obj.func = "storeInterCompanyRelationships('"+fieldNm+"');"
	DME(obj, "jsreturn");
}

function storeInterCompanyRelationships(fieldNm)
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
		ArrayOfCompanies[ArrayOfCompanies.length] = self.jsreturn.record[i].company_b;
	var dmeFilter = dmeFilterFieldHash.get(fieldNm);
	performDmeFieldFilterOnLoad(dmeFilter);
	dmeFilter.enable();
}
/* Filter Select logic - end */

/*
 *		Period Time Entry Functions
 */
function PaintPeriodWindow()
{
	GetTimeCardView(TimeCard.View);
	PaintHeaders("Period");
	if (QuickPaint)
		FillValues("Period");
	else
		PaintPeriodTime();
}

//****************************************************************************************
//This function will paint the main table. Based on a static view or an updatable view
//it will either paint the form then fill the values for the form or paint the values in a
//tabular format.
//****************************************************************************************
function PaintPeriodTime()
{	
	var Static = true;
	if (TimeCard.View == 4 && TimeCard.Status != 2 && TimeCard.Status != 3)
		Static = false;
	setWinTitle(getSeaPhrase("PP_TIME_CARD","TE"), self.TABLE);
	var divObj = self.TABLE.document.getElementById("paneBody2");	
	divObj.innerHTML = PaintTimeCard("Period", Static);
	self.TABLE.stylePage();
	if (!Static)
		FillValues("Period");
	else
		stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[getWinTitle(self.TABLE)]));
	fitToScreen();
}

//****************************************************************************************
//Forward the user to the Daily view.
//****************************************************************************************
var __DailyDate = 0;

function SplitToDaily(Row)
{
	if (typeof(self.TABLE.document.TimeEntry.yCord) != "undefined")
		self.TABLE.document.TimeEntry.yCord.value = Row;
	else
		StaticRow = Row;
	__DailyDate = TimeCard.Records[Row].Date;
	if (boolSaveChanges || bSelectChanged)
		SaveChanges("MoveToSplitToDaily()", "Period");
	else
		MoveToSplitToDaily();
}

function MoveToSplitToDaily()
{
	var nextFunc = function()
	{
		var Row;
		if (typeof(self.TABLE.document.TimeEntry.yCord) != "undefined")
			Row = self.TABLE.document.TimeEntry.yCord.value;
		else
			Row = StaticRow
		if (__DailyDate != 0)
			StartDailyTimeEntry(__DailyDate);
		__DailyDate = 0;
	};
	startProcessing(getSeaPhrase("LOADING_DAILY_TE","TE"), nextFunc);
}

//****************************************************************************************
//Decrement date and recall HS36 with new date. This will start over time entry with a new
//date range.
//****************************************************************************************
function PreviousPeriod()
{
	if (boolSaveChanges || bSelectChanged)
		SaveChanges("MoveToPreviousPeriod()", "Period")
	else
		MoveToPreviousPeriod()
}

function MoveToPreviousPeriod()
{
	var StartDate = PreviousDate(TimeCard.StartDate);
	hs36 = new HS36Object(StartDate, "", Employee.EmployeeNbr, TimeCard.ManagerFlag);
	startProcessing(getSeaPhrase("LOADING_PRE_PERIOD","TE"), function(){hs36.normal();});
}

//****************************************************************************************
//Increment date and recall HS36 with new date. This will start over time entry with a new
//date range.
//****************************************************************************************
function NextPeriod()
{
	if (boolSaveChanges || bSelectChanged)
		SaveChanges("MoveToNextPeriod()", "Period")
	else
		MoveToNextPeriod()
}

function MoveToNextPeriod()
{
	var StartDate = NextDate(TimeCard.EndDate);
	hs36 = new HS36Object(StartDate, "", Employee.EmployeeNbr, TimeCard.ManagerFlag)
	startProcessing(getSeaPhrase("LOADING_NEXT_PERIOD","TE"),function(){hs36.normal();});
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
		alert("Error: Cannot initialize CalendarObject. \n\n StylerEMSS.selectStyleSheet \n StylerEMSS.js");
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

function HeaderCalendar(elm)
{
	var dte = elm.value;
	var compareDte = formjsDate(formatDME(dte));
	if (getDteDifference(compareDte, TimeCard.StartDate)<=0 && getDteDifference(compareDte, TimeCard.EndDate)>=0)
		return;
	var nextFunc = function()
	{
		date_fld_name = "1";
		ReturnDate(dte);
	}
	if (boolSaveChanges || bSelectChanged)
		SaveChanges(nextFunc, "Period")
	else
		nextFunc();
}

function MoveToHeaderCalendar(wnd, elm, evt)
{
	date_fld_name = "1";
	DropDownCalendar(wnd, elm, evt);
}

function ReturnDate(date)
{
	switch (date_fld_name) 
	{
		case "1": ReturnCalendarDate(formjsDate(formatDME(date))); break;
		case "2": ReturnCommentsDate(formjsDate(formatDME(date))); break;
		case "3": ReturnCalendarDate_ForDaily(formjsDate(formatDME(date))); break;
		case "4": ReturnCalendarDate_Exception(formjsDate(formatDME(date))); break;
	}
}

function ReturnCalendarDate(dte)
{
	if (getDteDifference(dte, TimeCard.StartDate) <= 0 && getDteDifference(dte, TimeCard.EndDate) >= 0)
	{
		//seaAlert(getSeaPhrase("PAY_PERIOD_LOADED","TE"), "", null, "alert");
		return;
	}
	hs36 = new HS36Object(dte, "", Employee.EmployeeNbr, TimeCard.ManagerFlag);
	hs36.CalendarDate = dte;
	startProcessing(getSeaPhrase("LOADING_TE","TE"), function(){hs36.normal();});
}

//****************************************************************************************
//Set status to 1 and calls update
//****************************************************************************************
function SubmitClicked_Period()
{
	TimeCard.Status = 1;
	UpdateClicked_Period("Submitted");
}

//****************************************************************************************
//Update time card. All defaults and required fields are doneon the server. Server will
//return any wrong information and provide a return value for highlighting the field in
//error. The whole screen is passed to HS36.
//****************************************************************************************
function UpdateClicked_Period()
{
	var nextFunc;
	if (arguments.length>0 && arguments[0]=="Submitted")
		nextFunc = function(){UpdateTimeCard("Period", "Submitted");};
	else
		nextFunc = function(){UpdateTimeCard("Period");};
	startProcessing(getSeaPhrase("UPDATING_PERIOD_TE","TE"), nextFunc);
}

//****************************************************************************************
// Open the comments window if this has been selected
//****************************************************************************************
function Comments_Period(yCord)
{
	OpenComments(TimeCard.Records[yCord].Date, Employee.EmployeeNbr);
}

//****************************************************************************************
// The print function is a common function but needs the TimeCard record object to be updated.
//This function will update the record object before calling the main print function.
//****************************************************************************************
function PrintClicked_Period()
{
	hs36 = new HS36Object(TimeCard.StartDate, TimeCard.EndDate, Employee.EmployeeNbr, TimeCard.ManagerFlag); 
	startProcessing(getSeaPhrase("PREPARE_PRINT_SCREEN","TE"), function(){hs36.print();}); 
}

function PrintTimeCard_Finished(FrameNm, WindowName)
{
	stopProcessing();
	var frameWnd = window[WindowName][FrameNm];
	frameWnd.focus();
	frameWnd.print();
}

/*
 *		Daily Time Entry Functions
 */
var RepaintScreen = false;

function StartDailyTimeEntry(Date)
{
	if (typeof(authUser.prodline) == "unknown")
	{
		authenticate("frameNm='jsreturn'|funcNm='StartDailyTimeEntry(\""+Date+"\")'|desiredEdit='EM'");
		return;
	}
	RepaintScreen = true;
	hs36 = new HS36Object(Date, Date, Employee.EmployeeNbr, TimeCard.ManagerFlag);
	hs36.normal();
}

//****************************************************************************************
//Determine if the screen is read only or updatable then proceed to paint the screen
//Also if it is not necessary, do not repaint the screen, just fill in the known values.
//This can be done for almost any transacation since we are working with line numbers not
//dates.
//****************************************************************************************
function PaintDailyWindow()
{
	GetTimeCardView(TimeCard.View);
	PaintHeaders("Daily");
	if (TimeCard.Records[1].CommentsExist == 1)
		self.TABLE.document.getElementById("comment").src = ExistingCommentsIcon;
	else
		self.TABLE.document.getElementById("comment").src = NoCommentsIcon;
	PaintDailyTime();
}

//****************************************************************************************
//Print the daily time card screen.
//****************************************************************************************
function PaintDailyTime()
{
	var Static = true;
	if (TimeCard.View == 4 && TimeCard.Status != 2 && TimeCard.Status != 3)
		Static = false;
	setWinTitle(getSeaPhrase("DAILY_TIME_CARD","TE"), self.TABLE);
	if (!RepaintScreen && !Static && typeof(self.TABLE.document.TimeEntry) != "undefined" && typeof(self.TABLE.document.TimeEntry.lineFc1) != "undefined")
	{
		self.TABLE.stylePage();
		FillValues("Daily");
	}
	else
	{
		var divObj = self.TABLE.document.getElementById("paneBody2");
		divObj.innerHTML = PaintTimeCard("Daily", Static);
		self.TABLE.stylePage();
		if (!Static)
			FillValues("Daily");
		else
			stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[getWinTitle(self.TABLE)]));
	}
	fitToScreen();
	RepaintScreen = false;
}

//****************************************************************************************
//Decrement date and recall HS36 with new date. This will start over time entry with a new
//date range.
//****************************************************************************************
function PreviousDay()
{
	if (boolSaveChanges || bSelectChanged)
		SaveChanges("MoveToPreviousDay()", "Daily");
	else
		MoveToPreviousDay();
}

function MoveToPreviousDay()
{
	var StartDate = PreviousDate(TimeCard.StartDate);
	self.TABLE.document.TimeEntry.reset();
	hs36 = new HS36Object(StartDate, StartDate, Employee.EmployeeNbr, TimeCard.ManagerFlag);
	startProcessing(getSeaPhrase("LOADING_PRE_DAY","TE"), function(){hs36.normal();});
}

//****************************************************************************************
//Increment date and recall HS36 with new date. This will start over time entry with a new
//date range.
//****************************************************************************************
function NextDay()
{
	if (boolSaveChanges || bSelectChanged)
		SaveChanges("MoveToNextDay()", "Daily");
	else
		MoveToNextDay();
}

function MoveToNextDay()
{
	var StartDate = NextDate(TimeCard.EndDate);
	self.TABLE.document.TimeEntry.reset();
	hs36 = new HS36Object(StartDate, StartDate, Employee.EmployeeNbr, TimeCard.ManagerFlag);
	startProcessing(getSeaPhrase("LOADING_NEXT_DAY","TE"), function(){hs36.normal();});
}

//****************************************************************************************
//Choose date and recall HS36 with new date. This will start over time entry with a new
//date range.
//****************************************************************************************
function HeaderCalendar_Daily(elm)
{
	var dte = elm.value;
	var compareDte = formjsDate(formatDME(dte));
	if (getDteDifference(compareDte, TimeCard.StartDate) == 0)
		return;
	var nextFunc = function()
	{
		date_fld_name = "3";
		ReturnDate(dte);
	}	
	if (boolSaveChanges || bSelectChanged)
		SaveChanges(nextFunc, "Daily");
	else
		nextFunc();
}

function MoveToHeaderCalendar_Daily(wnd, elm, evt)
{
	date_fld_name = "3";
	DropDownCalendar(wnd, elm, evt);
}

function ReturnCalendarDate_ForDaily(dte)
{
	if (getDteDifference(dte, TimeCard.StartDate) == 0)
	{
		//seaAlert(getSeaPhrase("Date already loaded.","TE"), "", null, "alert");
		return;
	}
	self.TABLE.document.TimeEntry.reset();
	hs36 = new HS36Object(dte, dte, Employee.EmployeeNbr, TimeCard.ManagerFlag);
	startProcessing(getSeaPhrase("LOADING_TE","TE"), function(){hs36.normal();});
}

//****************************************************************************************
//Takes the user back to the period view screen. The user will be brought back to the period
//representing where they currently are on the daily screen.
//****************************************************************************************
function BackToPeriod()
{
	if (boolSaveChanges || bSelectChanged)
		SaveChanges("MoveToBackToPeriod()", "Daily");
	else
		MoveToBackToPeriod();
}

function MoveToBackToPeriod()
{
	hs36 = new HS36Object(TimeCard.StartDate, "", Employee.EmployeeNbr, TimeCard.ManagerFlag);
	startProcessing(getSeaPhrase("LOADING_PRE_VIEW","TE"), function(){hs36.normal();});
}

//****************************************************************************************
//Update time card. All defaults and required fields are doneon the server. Server will
//return any wrong information and provide a return value for highlighting the field in
//error. The whole screen is passed to HS36.
//****************************************************************************************
function UpdateClicked_Daily()
{
	fncSaveChanges = "";
	startProcessing(getSeaPhrase("UPDATING_DAILY_TE","TE"), function(){UpdateTimeCard("Daily");});
}

function CommentsClicked_Daily()
{
	OpenComments(TimeCard.StartDate, Employee.EmployeeNbr);
}

function CopyScreen_Daily()
{
	UpdateTimeCardObject();
	TimeCardCopy = new TimeCardObject();
	TimeCardCopy = TimeCard;
}

function PasteScreen_Daily()
{
	var timeForm = self.TABLE.document.forms["TimeEntry"];
	for (var i=1; i<emssObjInstance.emssObj.teDailyLines; i++)
	{
		for (var j=1; j<TimeCard.Form.length; j++)
		{
			evalObj = timeForm.elements[TimeCard.Form[j].FormField+'_'+i];
			evalObj.value = "";
		}
		if (timeForm.elements['lineFc'+i].value == "A")
			timeForm.elements['lineFc'+i].value = "-";
		else if (timeForm.elements['lineFc'+i].value == "C")
			timeForm.elements['lineFc'+i].value = "D";
	}
	if (typeof(TimeCardCopy)!="undefined")
	{
		for (var i=1; i<TimeCardCopy.Records.length; i++)
		{
			for (var j=1; j<TimeCardCopy.Form.length; j++)
			{
				switch (TimeCardCopy.Form[j].FormField)
				{
					case "HOURS": value = TimeCardCopy.Records[i].Hours; break;
					case "PAYCODE":	value = TimeCardCopy.Records[i].PayCode; break;
					case "RATE": value = TimeCardCopy.Records[i].Rate; break;
					case "SHIFT": value = TimeCardCopy.Records[i].Shift; break;
					case "JOBCODE":	value = TimeCardCopy.Records[i].JobCode; break;
					case "POSITION": value = TimeCardCopy.Records[i].Position; break;
					case "ACTIVITY": value = TimeCardCopy.Records[i].Activity; break;
					case "ACCTCAT":	value = TimeCardCopy.Records[i].AccountCategory; break;
					case "DEPARTMENT": value = TimeCardCopy.Records[i].Department; break;
					case "PROCLEVEL": value = TimeCardCopy.Records[i].ProcessLevel; break;
					case "ATTENDCD": value = TimeCardCopy.Records[i].AttendanceCode; break;
					case "OCCURRENCE": value = TimeCardCopy.Records[i].Occurrence; break;
					case "SCHEDULE": value = TimeCardCopy.Records[i].Schedule; break;
					case "GRADE": value = TimeCardCopy.Records[i].Grade; break;
					case "STEP": value = TimeCardCopy.Records[i].Step; break;
					case "GLCOMPANY": value = TimeCardCopy.Records[i].GlCompany; break;
					case "ACCTUNIT": value = TimeCardCopy.Records[i].AccountUnit; break;
					case "GLACCOUNT": value = TimeCardCopy.Records[i].GlAccount; break;
					case "SUBACCT":	value = TimeCardCopy.Records[i].SubAccount; break;
					//PT 143572
					//case "COMMENTS": value = TimeCardCopy.Records[i].Comments; break;
					case "COMMENTS": value = TimeCardCopy.Records[i].Comment; break;
					case "USERFIELD1": value = TimeCardCopy.Records[i].UserField1; break;
					case "USERFIELD2": value = TimeCardCopy.Records[i].UserField2; break;
					case "LOCATION": value = TimeCardCopy.Records[i].Location; break;
					case "UNITS": value = TimeCardCopy.Records[i].Units; break;
				}
				if (value != null)
					timeForm.elements[TimeCardCopy.Form[j].FormField+'_'+i].value = value;
				timeForm.elements['yCord'].value = i;
				timeForm.elements['xCord'].value = j;
				TextChanged(timeForm.elements[TimeCardCopy.Form[j].FormField+'_'+i]);
			}
		}
		var TimeSeq = new Array(0);
		TimeSeq[0] = "";
		for (var i=1; i<TimeCard.Records.length; i++)
			TimeSeq[TimeSeq.length] = TimeCard.Records[i].TimeSeq;
		for (var i=1; i<TimeCardCopy.Records.length; i++)
		{
			var TimeSeqValue = TimeSeq[i];
			TimeCard.Records[i] = TimeCardCopy.Records[i];
			TimeCard.Records[i].TimeSeq = TimeSeqValue;
		}
		boolSaveChanges = true;
	}
	else
		seaAlert(getSeaPhrase("COPY_FORM_TO_PASTE","TE"), "", null, "error");
	// Make sure active text box is reset following a paste so that a subsequent "delete row" action will default to the first row.
	timeForm.elements['yCord'].value = 1;
	timeForm.elements['xCord'].value = 1;
}

/*
 *		Exception Time Entry Functions
 */
function PaintExceptionWindow()
{
	GetTimeCardView(TimeCard.View);
	PaintHeaders("Exception");
	if (QuickPaint)
		FillValues("Period");
	else
		PaintPeriodTime_Exception();
}

//****************************************************************************************
//This function will paint the main table. Based on a static view or an updatable view
//it will either paint the form then fill the values for the form or paint the values in a
//tabular format.
//****************************************************************************************
function PaintPeriodTime_Exception()
{
	var Static = true;
	if (TimeCard.View == 4 && TimeCard.Status != 2 && TimeCard.Status != 3)
		Static = false;
	setWinTitle(getSeaPhrase("EXCEPTION_TIME_CARD","TE"), self.TABLE);
	self.TABLE.document.getElementById("paneBody2").innerHTML = PaintTimeCard("Exception", Static);	
	self.TABLE.stylePage();
	if (!Static)
		FillValues("Exception");
	else
		stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[getWinTitle(self.TABLE)]));
	fitToScreen();
}

//****************************************************************************************
//Decrement date and recall HS36 with new date. This will start over time entry with a new
//date range.
//****************************************************************************************
function PreviousException()
{
	if (boolSaveChanges || bSelectChanged)
		SaveChanges("MoveToPreviousException()", "Exception");
	else
		MoveToPreviousException();
}

function MoveToPreviousException()
{
	var StartDate = PreviousDate(TimeCard.StartDate);
	hs36 = new HS36Object(StartDate, "", Employee.EmployeeNbr, false);
	TimeCard.ProtectedDate = null;
	TimeCard.ProtectedSeq = null;
	startProcessing(getSeaPhrase("LOADING_PRE_PERIOD","TE"), function(){hs36.exception();});
}

//****************************************************************************************
//Increment date and recall HS36 with new date. This will start over time entry with a new
//date range.
//****************************************************************************************
function NextException()
{
	if (boolSaveChanges || bSelectChanged)
		SaveChanges("MoveToNextException()", "Exception");
	else
		MoveToNextException();
}

function MoveToNextException()
{
	var StartDate = NextDate(TimeCard.EndDate);
	hs36 = new HS36Object(StartDate, "", Employee.EmployeeNbr, false);
	TimeCard.ProtectedDate = null;
	TimeCard.ProtectedSeq = null;
	startProcessing(getSeaPhrase("LOADING_NEXT_PERIOD","TE"), function(){hs36.exception();});
}

//****************************************************************************************
//Choose date and recall HS36 with new date. This will start over time entry with a new
//date range.
//****************************************************************************************
function HeaderCalendar_Exception(elm)
{
	var dte = elm.value;
	var compareDte = formjsDate(formatDME(dte));
	if (getDteDifference(compareDte, TimeCard.StartDate) <= 0 && getDteDifference(compareDte, TimeCard.EndDate) >= 0)
		return;
	var nextFunc = function()
	{
		date_fld_name = "4";
		ReturnDate(dte);
	}	
	if (boolSaveChanges || bSelectChanged)
		SaveChanges(nextFunc, "Exception");
	else
		nextFunc();
}

function MoveToHeaderCalendar_Exception(wnd, elm, evt)
{
	date_fld_name = "4";
	DropDownCalendar(wnd, elm, evt);
}

function ReturnCalendarDate_Exception(dte)
{
	if (getDteDifference(dte, TimeCard.StartDate) <= 0 && getDteDifference(dte, TimeCard.EndDate) >= 0)
	{
		//seaAlert(getSeaPhrase("PAY_PERIOD_LOADED","TE"), "", null, "alert");
		return;
	}
	hs36 = new HS36Object(dte, "", Employee.EmployeeNbr, false);
	TimeCard.ProtectedDate = null;
	TimeCard.ProtectedSeq = null;
	startProcessing(getSeaPhrase("LOADING_TE","TE"), function(){hs36.exception();});
}

//****************************************************************************************
//Set status to 1 and calls update
//****************************************************************************************
function SubmitClicked_Exception()
{
	TimeCard.Status = 1;
	UpdateClicked_Exception("Submitted");
}

//****************************************************************************************
//Update time card. All defaults and required fields are doneon the server. Server will
//return any wrong information and provide a return value for highlighting the field in
//error. The whole screen is passed to HS36.
//****************************************************************************************
function UpdateClicked_Exception()
{
	var nextFunc;
	if (arguments.length > 0 && arguments[0] == "Submitted")
		nextFunc = function(){UpdateTimeCard("Exception", "Submitted");};
	else
		nextFunc = function(){UpdateTimeCard("Exception");};
	startProcessing(getSeaPhrase("UPDATING_EXCEPTION_TE","TE"), nextFunc);
}

//****************************************************************************************
// Open the comments window if this has been selected
//****************************************************************************************
function Comments_Exception(yCord)
{
	OpenComments(TimeCard.Records[yCord].Date, authUser.employee);
}

//****************************************************************************************
// The print function is a common function but needs the TimeCard record object to be updated.
//This function will update the record object before calling the main print function.
//****************************************************************************************
function PrintClicked_Exception()
{
	hs36 = new HS36Object(TimeCard.StartDate, TimeCard.EndDate, Employee.EmployeeNbr, false);
	TimeCard.ProtectedDate = null;
	TimeCard.ProtectedSeq = null;
	startProcessing(getSeaPhrase("PREPARE_PRINT_SCREEN","TE"), function(){hs36.printexception();});
}

function PrintTimeCard_Finished_Exception(FrameNm, WindowName)
{
	stopProcessing();
	var frameWnd = window[WindowName][FrameNm];
	frameWnd.focus();
	frameWnd.print();
}

/*
 *		Save Changes Logic
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
	ReleaseSemaphore();
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
	{	
		var msg = (lpcsView == "Exception") ? getSeaPhrase("UPDATING_EXCEPTION_TE","TE") : getSeaPhrase("UPDATING_PERIOD_TE","TE");
		startProcessing(msg, function(){UpdateTimeCard(lpcsView,"SavingChanges");})
	}	
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
	catch(e){}
}

/*
 *		Time Entry Comments Functions
 */
var Comments		//Instance of the Comments object.
var ToggleSwitch = false
var DeleteFlag = false;
var CommentsUpdateFlag = false;
var CommentsCloseFlag = false;

/**********************************************************************************************
 Comment object which handles all of the functionality of this window.
**********************************************************************************************/
function CommentsObject()
{
	this.Date = null
	this.Employee = null
	this.Text = null
	this.SequenceNumber = null
	this.UserId = null
	this.ProxyId = null
	this.Event = "ADD"
	this.commentsWindow = null;
}

/**********************************************************************************************
 Locate the center of the parent window.
**********************************************************************************************/
function FindCenterforCommentsWindow()
{
	var retval = new Object()
	retval.X = (screen.width/2) - 275;
	retval.Y = (screen.height/2) - 175;
	return retval
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
	var object = new DMEObject(authUser.prodline,"EMPCOMMENT")
	object.out = "JAVASCRIPT"
	object.index = "ecmset1"
	object.field = "employee;ln-nbr;seq-nbr;cmt-text;date;user-id;proxy-id"
	object.key = parseFloat(authUser.company)+"="+parseFloat(Comments.Employee)+"=TR="+Comments.Date
	object.max = "600";
	object.debug = false;
	object.sortasc = "ln-nbr"
	object.func = "DspEmpComments()";
	DME(object,"jsreturn")
}

/**********************************************************************************************
 Parse through any information returned from the DME. Recall the DME function if more than
 300 records are returned. If not paint the window with the information provided in the
 Comments object.
**********************************************************************************************/
function DspEmpComments()
{
	Comments.Text = ""
	var obj;
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		obj = self.jsreturn.record[i];
		// PT 127924 extra space added in comments maked comments hard to read
		// Comments.Text += obj.cmt_text + " ";
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
		//seaAlert(getSeaPhrase("COMMENTS_LOADED_FOR_DAY","TE"), "", null, "alert");
		try { Comments.commentsWindow.focus(); } catch(e) {};
		return;
	}
	Comments.Date = Date;
	startProcessing(getSeaPhrase("MOVING_TO_NEW_DATE","TE"), function(){GetEmpComment(true);});
}

/**********************************************************************************************
 Will open the calendar window for the user to select a new date.
**********************************************************************************************/
function MoveToNewDateForComments(wnd, elm, evt)
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
			if (typeof(wnd["styler"]) == "undefined" || wnd.styler == null)
				wnd.stylerWnd = findStyler(true);
			if (!wnd.stylerWnd)
				return;			
			if (this.styler == null)
			{
				this.styler = new wnd.stylerWnd.StylerBase();
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
	if (ToggleSwitch)
	{
		ToggleSwitch = false;
		if (DeleteFlag)
			ToggleCommentSwitch("Deleting", Comments.Date);
		else
			ToggleCommentSwitch("Adding", Comments.Date);
	}
	stopProcessing();
	if (styler && (styler.showLDS || styler.showInfor || styler.showInfor3) && typeof(window["DialogObject"]) == "function")
	{
		var dateFunc = (styler.showInfor3) ? "ReturnDate(this.value)" : "parent.ReturnDate(this.value)";
		var selDateFunc = (styler.showInfor3) ? "MoveToNewDateForComments(window,this,event)" : "parent.MoveToNewDateForComments(window,this,event)";
		html = '<div class="panewrapper" style="padding:5px;padding-bottom:15px;text-align:center">'+
		'<form name="myComments" onsubmit="return false;">'+
		'<table border="0" cellspacing="0" cellpadding="0" align="center" style="text-align:center;width:auto" role="presentation">'
		toolTip = getSeaPhrase("OPEN_COMMENTS_FOR_DATE","TE");
		html += '<tr><td class="fieldlabelbold"><label id="navDateLbl" for="navDate">'+getSeaPhrase("DATE","TE")+'</label></td><td class="plaintablecell">'+
		'<input onchange="'+dateFunc+'" styler="calendar" class="inputbox" onkeydown="return false;" onkeyup="return false;" type="text" id="navDate" name="navDate" size="10" maxlength="10" start_date="'+FormatDte4(Comments.Date)+'" value="'+FormatDte4(Comments.Date)+'" aria-labelledby="navDateLbl navDateFmt"/>'+
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
		html = '<div style="padding:5px;text-align:center"><div styler="groupbox">'+
		'<form name="myComments" onsubmit="return false;">'+
		'<table border="0" cellspacing="0" cellpadding="0" align="center" style="text-align:center;width:auto" role="presentation">'
		toolTip = getSeaPhrase("OPEN_COMMENTS_FOR_DATE","TE");
		html += '<tr><td class="fieldlabelbold"><label id="navDateLbl" for="navDate">'+getSeaPhrase("DATE","TE")+'</label></td><td class="plaintablecell">'+
		'<input onchange="parent.opener.ReturnDate(this.value)" styler="calendar" class="inputbox" onkeydown="this.value=this.getAttribute(\'start_date\')" onkeyup="this.value=this.getAttribute(\'start_date\')" type="text" id="navDate" name="navDate" size="10" maxlength="10" start_date="'+FormatDte4(Comments.Date)+'" value="'+FormatDte4(Comments.Date)+'" aria-labelledby="navDateLbl navDateFmt"/>'+
		'<a styler="hidden" href="javascript:;" onclick="opener.MoveToNewDateForComments(window,this,event);return false;" for="navDate" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan("navDateFmt")+'</td></tr>'+
		'<tr><td class="fieldlabelbold"><label for="comments">'+getSeaPhrase("COMMENTS","TE")+'</label></td><td class="plaintablecell">'+
		'<textarea class="inputbox" style="width:350px;height:150px" cols="60" rows="11" id="comments" name="comments" wrap="virtual" styler="textarea">'+Comments.Text+'</textarea>'+
		'</td></tr></table></form>'+
		'<div style="text-align:center"><table border="0" cellspacing="0" cellpadding="0" align="center" style="text-align:center;width:auto" role="presentation"><tr><td style="white-space:nowrap">'+
		uiButton(getSeaPhrase("UPDATE","TE"), "parent.opener.UpdateComments();return false");
		if (Comments.Text != "")
			html += uiButton(getSeaPhrase("DELETE","TE"), "parent.opener.DeleteComment();return false","margin-left:5px");
		else
			html += uiButton(getSeaPhrase("CLEAR","TE"), "parent.document.forms['myComments'].elements['comments'].value='';return false","margin-left:5px");
		html += uiButton(getSeaPhrase("DONE","TE"), "parent.opener.CloseCommentsWindow();return false","margin-left:5px")+
		'</td></tr></table></div></div></div>';
		Comments.commentsWindow.document.getElementById("paneBody1").innerHTML = html;	
		Comments.commentsWindow.stylePage(true, getSeaPhrase("COMMENTS","TE"));
		setWinTitle(getSeaPhrase("COMMENTS","TE"), Comments.commentsWindow);
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
	if (msgWin.returnValue == "yes" || msgWin.returnValue == "no")
		return false;	
}

/**********************************************************************************************
 Event function to be called when the comments content has fulled loaded into the window.
**********************************************************************************************/
function CommentsLoaded()
{
	// if the user clicked the "Done" button prior to the update completing, close the 
	// comments window.
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
 Prompt user to make sure they want to delete this comment.
**********************************************************************************************/
function DeleteComment()
{
	stopProcessing();
	var confirmResponse	= seaConfirm(getSeaPhrase("DELETE_COMMENTS?","TE"), "", ConfirmDeleteComment)
	if (typeof(confirmResponse) == "undefined" || confirmResponse == null)
		return;
	else if (confirmResponse)
		startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), function(){Delete_Comments("true");});
}

function ConfirmDeleteComment(confirmWin)
{
	ReleaseSemaphore();
	if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
		startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), function(){Delete_Comments("true");});
	else if (styler && (styler.showLDS || styler.showInfor || styler.showInfor3) && typeof(window["DialogObject"]) == "function")
		WriteComments();
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
			seaAlert(getSeaPhrase("UPDATE_COMMENTS","TE"), "", null, "error", WriteComments);
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
			Add_Comments();
	}
	else
	{
		if (styler && (styler.showLDS || styler.showInfor || styler.showInfor3) && typeof(window["DialogObject"]) == "function")
			seaAlert(self.lawheader.gmsg, "", null, "error", WriteComments);
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
		+ "&ECM-CMT-TEXT"+j+"="+escape(lines[i]);
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
			seaAlert(self.lawheader.gmsg, "", null, "error", RefreshComment);
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
	for (var k=0;k<myAry.length;k++)
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
	for (var i=0; text.length>0; i++)
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
