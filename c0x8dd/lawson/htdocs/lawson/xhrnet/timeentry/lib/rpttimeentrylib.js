// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/timeentry/lib/Attic/rpttimeentrylib.js,v 1.1.2.92 2014/02/19 23:04:10 brentd Exp $
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
 *		Detail Report Functions
 */
var Index;
var hs36;
var TimeEntryLocal;
var SortByProperty = "";
var LastSortField = null;

function DrawDetailWindow()
{
	Index = 0;
	EmployeeTemp = new EmployeeObject();
	TimeCardTemp = new TimeCardObject();
	self.lawheader.linecount = 0;
	startProcessing(getSeaPhrase("GATHERING_DATA","TE"), function(){CallHS36WithIndex(Index);});
}

function CallHS36WithIndex(Index)
{
	self.lawheader.UpdateType = "HS36.1";
	hs36 = new HS36Object(formjsDate(Details.StartDate), formjsDate(Details.EndDate), Details.EmployeeNumbers[Index], true);
	hs36.report();
}

function PaintDetailScreen()
{
	html = '<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tr>'
	html += '<td style="text-align:center">'
	html += uiButton(getSeaPhrase("BACK","TE"),"parent.BackToStatuses_ForDetail();return false")	
	html += uiButton(getSeaPhrase("PRINT","TE"),"parent.PrintDetailTimeCardReport();return false","margin-left:5px")
	try
	{
		if (opener)
			html += uiButton(getSeaPhrase("QUIT","TE"),"parent.QuitApp();return false","margin-left:5px")
	} catch(e) {}
	html += '</td></tr></table>'
	self.footer.document.getElementById("paneBody1").innerHTML = html;
	self.footer.stylePage();
	setWinTitle(getSeaPhrase("ACTION_BUTTONS","TE"), self.main);
	PaintDetailRecords();
}

function PaintDetailRecords(onsort, sortField, sortDir)
{
	sortDir = sortDir || "ascending";
	var nextSortDir = (sortDir == "ascending") ? "descending" : "ascending";	
	var sb = new StringBuffer();
	html = '<div style="text-align:center;padding-top:5px;padding-bottom:5px">'
	html += '<table id="detailReportTbl" border="1" align="center" cellspacing="0" cellpadding="0" style="width:100%;text-align:center;margin-left:auto;margin-right:auto" styler="list" summary="'+getSeaPhrase("TSUM_1","TE")+'">'
	html += '<caption class="plaintablecellbold" style="text-align:center">'+getSeaPhrase("TE_REPORT_DETAIL","TE")+'</caption>'	
	var toolTip = getSeaPhrase("DATE","TE")+' - '+getSeaPhrase("SORT_BY_X","SEA");
	html += '<tr><th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortByField(\'DATE\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("DATE","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("EMPLOYEE_NAME","TE")+' - '+getSeaPhrase("SORT_BY_X","SEA");
	html += '<th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortByField(\'EMPLOYEE\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("EMPLOYEE_NAME","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("SORT_BY_STATUS","ESS");
	html += '<th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortByField(\'STATUS\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("STATUS_ONLY","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	sb.append(html);
	var formLen = TimeCard.Form.length;
	var formCol;
	var formFld;
	for (var j=1; j<formLen; j++)
	{
		formCol = TimeCard.Form[j];
		formFld = formCol.FormField;
		if (formFld != null && formFld != "")
		{
			toolTip = formCol.FormLabel+' - '+getSeaPhrase("SORT_BY_X","SEA");
			html = '<th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
			html += '<a class="columnsort" href="javascript:;" onclick="parent.SortByField(\''+formFld+'\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+unescape(formCol.FormLabel)+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
			sb.append(html);
		}
	}	
	sb.append('</tr>');
	var recLen = TimeCard.Records.length;
	var showAll = Details.ShowAllRecords;
	var showBlank = Details.ShowBlankRecords;
	var dtlStatus = Details.Statuses;
	var timeRec;
	for (var i=1; i<recLen; i++)
	{
		timeRec = TimeCard.Records[i];
		// PT 116112: skip blank records, or filter out records with statuses that were not selected
		if (!showAll && showBlank)
		{
			// show records for just the statuses that were selected
			if (timeRec.Status != null && !dtlStatus[(parseFloat(timeRec.Status)+1)])
				continue;
		}
		else if (showAll && !showBlank)
		{
			// skip only those records that don't have a status
			if (timeRec.Status == null)
				continue;
		}
		else if (!showAll && !showBlank)
		{
			// skip records without a status; show records for just the statuses that were selected
			if (timeRec.Status == null || !dtlStatus[(parseFloat(timeRec.Status)+1)])
				continue;
		}
		html = '<tr class="plaintablecellnopadding"><td nowrap>'+FormatDte3(timeRec.Date)+'</td>';
		html += '<td style="text-align:center">'+timeRec.EmployeeName+'</td>';
		if (timeRec.Status == null)
			html += '<td style="text-align:center">'+getSeaPhrase("N_A","TE")+'</td>';
		else
			html += '<td style="text-align:center">'+timeRec.Status+'</td>';
		sb.append(html);
		for (var j=1; j<formLen; j++)
		{
			formCol = TimeCard.Form[j];
			formFld = formCol.FormField;
			if (formFld == 'ACTIVITY')
			{
				if (timeRec.Activity != null)
				{
					html = '<td>&nbsp;'+timeRec.Activity;
					if (timeRec.ActivityDesc != null)
						html += '('+timeRec.ActivityDesc+')'
					html += '</td>';
				}
				else
					html = '<td>&nbsp;</td>';
			}
			else
			{
				html = '<td>&nbsp;';
				var value = "";
				switch (formFld)
				{
					case "HOURS":
					{
						value = FormatHours(timeRec.Hours,formCol.Size);
						if (value != "")
							TotalHours += parseFloat(value);
						break;
					}
					case "PAYCODE":	value = timeRec.PayCode; break;
					case "RATE": value = timeRec.Rate; break;
					case "SHIFT": value = timeRec.Shift; break;
					case "JOBCODE":	value = timeRec.JobCode; break;
					case "POSITION": value = timeRec.Position; break;
					case "ACTIVITY": value = timeRec.Activity; break;
					case "ACCTCAT":	value = timeRec.AccountCategory; break;
					case "DEPARTMENT": value = timeRec.Department; break;
					case "PROCLEVEL": value = timeRec.ProcessLevel; break;
					case "ATTENDCD": value = timeRec.AttendanceCode; break;
					case "OCCURRENCE": value = timeRec.Occurrence; break;
					case "SCHEDULE": value = timeRec.Schedule; break;
					case "GRADE": value = timeRec.Grade; break;
					case "STEP": value = timeRec.Step; break;
					case "GLCOMPANY": value = timeRec.GlCompany; break;
					case "ACCTUNIT": value = timeRec.AccountUnit; break;
					case "GLACCOUNT": value = timeRec.GlAccount; break;
					case "SUBACCT":	value = timeRec.SubAccount; break;
					case "COMMENTS": value = timeRec.Comments; break;
					case "USERFIELD1": value = timeRec.UserField1; break;
					case "USERFIELD2": value = timeRec.UserField2; break;
					case "LOCATION": value = timeRec.Location; break;
					case "UNITS": value = FormatHours(timeRec.Units,formCol.Size); break;
				}
				if (value != null)
					html += value;
				html += '</td>';
			}
			sb.append(html);
		}
		sb.append('</tr>');
	}
	html = '</table></div>';
	sb.append(html);
	self.main.document.getElementById("paneBody1").innerHTML = sb.toString();
	self.main.stylePage();
	setWinTitle(getSeaPhrase("TE_REPORT_DETAIL","TE"), self.main);
	if (onsort)
		self.main.styleSortArrow("detailReportTbl", sortField, sortDir);
	stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[getWinTitle(self.main)])+' '+getSeaPhrase("CNT_UPD_FRM","SEA",[self.footer.getWinTitle()]));
	fitToScreen();
}

function BackToDetailStatuses()
{
	self.footer.document.getElementById("paneBody1").innerHTML = "";
	DetailStatuses(1);
}

function QuitApp()
{
	self.close();
}

function PrintDetailTimeCardReport()
{
	stopProcessing();
	if (seaConfirm(getSeaPhrase("OK_TO_SUMMARIZE_REPORT","TE"), "", ConfirmPrintDetailReport))
		startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), PrintDetailReport);
}

function ConfirmPrintDetailReport(confirmWin)
{
	if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
		startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), PrintDetailReport);
}

function PrintDetailReport(onsort, sortField, sortDir)
{
	sortDir = sortDir || "ascending";
	var nextSortDir = (sortDir == "ascending") ? "descending" : "ascending";	
	var sb = new StringBuffer();
	var html = '<div style="text-align:center">'
	html += '<table border="1" align="center" cellspacing="0" cellpadding="0" style="width:100%;text-align:center;margin-left:auto;margin-right:auto" styler="list" summary="'+getSeaPhrase("TSUM_1","TE")+'">'
	html += '<caption class="plaintablecellbold" style="text-align:center">'+getSeaPhrase("TE_REPORT_DETAIL","TE")+'</caption>'
	var toolTip = getSeaPhrase("DATE","TE")+' - '+getSeaPhrase("SORT_BY_X","SEA");
	html += '<tr><th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortByField(\'DATE\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("DATE","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("EMPLOYEE_NAME","TE")+' - '+getSeaPhrase("SORT_BY_X","SEA");
	html += '<th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortByField(\'EMPLOYEE\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("EMPLOYEE_NAME","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("SORT_BY_STATUS","ESS");
	html += '<th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortByField(\'STATUS\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("STATUS_ONLY","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	sb.append(html);
	var formLen = TimeCard.Form.length;
	var formCol;
	var formFld;
	for (var j=1; j<formLen; j++)
	{
		formCol = TimeCard.Form[j];
		formFld = formCol.FormField;
		if (formFld != null && formFld != "")
		{
			toolTip = formCol.FormLabel+' - '+getSeaPhrase("SORT_BY_X","SEA");
			html = '<th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
			html += '<a class="columnsort" href="javascript:;" onclick="parent.SortByField(\''+formFld+'\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+unescape(formCol.FormLabel)+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
			sb.append(html);
		}
	}
	sb.append('</tr>');
	var recLen = TimeCard.Records.length;
	var showAll = Details.ShowAllRecords;
	var showBlank = Details.ShowBlankRecords;
	var dtlStatus = Details.Statuses;
	var timeRec;
	for (var i=1; i<recLen; i++)
	{
		timeRec = TimeCard.Records[i];
		// logic to skip blank records, or filter out records with statuses that were not selected
		if (!showAll && showBlank)
		{
			// show records for just the statuses that were selected
			if (timeRec.Status != null && !dtlStatus[(parseFloat(timeRec.Status)+1)])
				continue;
		}
		else if (showAll && !showBlank)
		{
			// skip only those records that don't have a status
			if (timeRec.Status == null)
				continue;
		}
		else if (!showAll && !showBlank)
		{
			// skip records without a status; show records for just the statuses that were selected
			if (timeRec.Status == null || !dtlStatus[(parseFloat(timeRec.Status)+1)])
				continue;
		}
		html = '<tr class="plaintablecellnopadding"><td nowrap>'+FormatDte3(timeRec.Date)+'</td><td style="text-align:center">'+timeRec.EmployeeName+'</td>'
		if (timeRec.Status == null)
			html += '<td style="text-align:center">'+getSeaPhrase("N_A","TE")+'</td>'
		else
			html += '<td style="text-align:center">'+timeRec.Status+'</td>'
		sb.append(html);
		for (var j=1; j<formLen; j++)
		{
			formCol = TimeCard.Form[j];
			formFld = formCol.FormField;
			if (formFld == 'ACTIVITY')
			{
				if (timeRec.Activity != null)
				{
					html = '<td>'
					html += '&nbsp;'+ timeRec.Activity
					if (timeRec.ActivityDesc != null)
						html += '('+timeRec.ActivityDesc + ')'
					html += '</td>'
				}
				else
					html = '<td>&nbsp;</td>'
			}
			else
			{
				html = '<td>&nbsp;'
				var value = ""
				switch (formFld)
				{
					case "HOURS":
					{
						value = FormatHours(timeRec.Hours,formCol.Size);
						if (value != "")
							TotalHours += parseFloat(value);
						break;
					}
					case "PAYCODE":	value = timeRec.PayCode; break;
					case "RATE": value = timeRec.Rate; break;
					case "SHIFT": value = timeRec.Shift; break;
					case "JOBCODE":	value = timeRec.JobCode; break;
					case "POSITION": value = timeRec.Position; break;
					case "ACTIVITY": value = timeRec.Activity; break;
					case "ACCTCAT":	value = timeRec.AccountCategory; break;
					case "DEPARTMENT": value = timeRec.Department; break;
					case "PROCLEVEL": value = timeRec.ProcessLevel; break;
					case "ATTENDCD": value = timeRec.AttendanceCode; break;
					case "OCCURRENCE": value = timeRec.Occurrence; break;
					case "SCHEDULE": value = timeRec.Schedule; break;
					case "GRADE": value = timeRec.Grade; break;
					case "STEP": value = timeRec.Step; break;
					case "GLCOMPANY": value = timeRec.GlCompany; break;
					case "ACCTUNIT": value = timeRec.AccountUnit; break;
					case "GLACCOUNT": value = timeRec.GlAccount; break;
					case "SUBACCT":	value = timeRec.SubAccount; break;
					case "COMMENTS": value = timeRec.Comments; break;
					case "USERFIELD1": value = timeRec.UserField1; break;
					case "USERFIELD2": value = timeRec.UserField2; break;
					case "LOCATION": value = timeRec.Location; break;
					case "UNITS": value = timeRec.Units; break;
				}
				if (value != null)
					html += value
				html += '</td>'
			}
			sb.append(html);
		}
		sb.append('</tr>')
	}
	html = '</table></div>'
	sb.append(html);
	self.printFm.document.title = getSeaPhrase("TE_REPORT_DETAIL","TE");
	self.printFm.document.getElementById("paneBody1").innerHTML = sb.toString();
	self.printFm.stylePage();
	self.printFm.document.body.style.overflow = "visible";
	self.printFm.document.getElementById("paneBody1").style.overflow = "visible";
	stopProcessing();
	self.printFm.focus();
	self.printFm.print();
}

function SortByField(SortParameter, Dir)
{
	var nextFunc = function()
	{
		var SortType = null;
		switch (SortParameter)
		{
			case "HOURS": SortByProperty = "Hours"; SortType = "number"; break;
			case "DATE": SortByProperty = "Date"; SortType = "alpha"; break;
			case "STATUS": SortByProperty = "Status"; SortType = "alpha"; break;
			case "EMPLOYEE": SortByProperty = "EmployeeNbr"; SortType = "number"; break;
			case "PAYCODE": SortByProperty = "PayCode"; SortType = "alpha"; break;
			case "RATE": SortByProperty = "Rate"; SortType = "number"; break;
			case "SHIFT": SortByProperty = "Shift"; SortType = "alpha"; break;
			case "JOBCODE":	SortByProperty = "JobCode"; SortType = "alpha"; break;
			case "POSITION": SortByProperty = "Position"; SortType = "alpha"; break;
			case "ACTIVITY": SortByProperty = "Activity"; SortType = "alpha"; break;
			case "ACCTCAT":	 SortByProperty = "AccountCategory"; SortType = "alpha"; break;
			case "DEPARTMENT": SortByProperty = "Department"; SortType = "alpha"; break;
			case "PROCLEVEL": SortByProperty = "ProcessLevel"; SortType = "alpha"; break;
			case "ATTENDCD": SortByProperty = "AttendanceCode"; SortType = "alpha"; break;
			case "OCCURRENCE": SortByProperty = "Occurrence"; SortType = "alpha"; break;
			case "SCHEDULE": SortByProperty = "Schedule"; SortType = "alpha"; break;
			case "GRADE": SortByProperty = "Grade"; SortType = "alpha"; break;
			case "STEP": SortByProperty = "Step"; SortType = "alpha"; break;
			case "GLCOMPANY": SortByProperty = "GlCompany"; SortType = "alpha"; break;
			case "ACCTUNIT": SortByProperty = "AccountUnit"; SortType = "alpha"; break;
			case "GLACCOUNT": SortByProperty = "GlAccount"; SortType = "alpha"; break;
			case "SUBACCT":	SortByProperty = "SubAccount"; SortType = "alpha"; break;
			case "COMMENTS": SortByProperty = "Comments"; SortType = "alpha"; break;
			case "USERFIELD1": SortByProperty = "UserField1"; SortType = "alpha"; break;
			case "USERFIELD2": SortByProperty = "UserField2"; SortType = "alpha"; break;
			case "LOCATION": SortByProperty = "LOCATION"; SortType = "alpha"; break;
			case "UNITS": SortByProperty = "UNITS"; SortType = "number"; break;
		}
		if (SortByProperty != LastSortField)
			Dir = "ascending";
		LastSortField = SortByProperty;
		if (SortType != null)
		{
			if (Dir == "ascending")
				SortFunc = (SortType == "number") ? sortByAscNumber : sortByAscAlpha;
			else
				SortFunc = (SortType == "number") ? sortByDscNumber : sortByDscAlpha;
			TimeCard.Records.sort(SortFunc);		
		}
		// move the "first" undefined array item back to the front of the array, since the TimeCard.Record array is indexed from 1;
		// after sorting, it should fall to the end of the array
		if (typeof(TimeCard.Records[TimeCard.Records.length - 1]) == "undefined")
		{
		    var tmpArr = new Array(TimeCard.Records[TimeCard.Records.length - 1]);
		    TimeCard.Records = tmpArr.concat(TimeCard.Records.slice(0, TimeCard.Records.length - 1));
		}
		PaintDetailRecords(true, SortParameter, Dir);		
	};
	startProcessing(getSeaPhrase("WAIT_FOR_SORTING","TE"), nextFunc);
}

function sortByAscAlpha(obj1, obj2)
{
	var name1 = obj1[SortByProperty];
	var name2 = obj2[SortByProperty];
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function sortByDscAlpha(obj1, obj2)
{
	var name1 = obj1[SortByProperty];
	var name2 = obj2[SortByProperty];
	if (name1 > name2)
		return -1;
	else if (name1 < name2)
		return 1;
	else
		return 0;
}

function sortByAscNumber(obj1, obj2)
{
	return Number(obj1[SortByProperty]) - Number(obj2[SortByProperty]);
}

function sortByDscNumber(obj1, obj2)
{
	return Number(obj2[SortByProperty]) - Number(obj1[SortByProperty]);
}

/*
 *		Missing Time Card Report Functions
 */
var DONEFLAG, __Index;
var SortByProperty = "";

function DrawMissingWindow(fromDate, toDate)
{
	Reports = null;
	startProcessing(getSeaPhrase("GATHERING_DATA","TE"), function(){GetReportingPayPlans(fromDate, toDate);});
}

function GetReportingPayPlans(fromDate, toDate, moreRecords)
{
	if (Reports == null)
	{
		Reports = new ReportsObject(authUser.company, authUser.employee)
		PlanCodes = new PlanCodeObject(authUser.company, authUser.employee)
		self.lawheader.linecount = 0;
	}
	else
	{
		--self.lawheader.linecount;
	}
	self.lawheader.formlinecount = 0;
	self.lawheader.UpdateType = "HS22.3";
	var obj	= new AGSObject(authUser.prodline, "HS22.3");
	obj.event = "ADD";
	obj.rtn = "DATA";
	obj.longNames = true;
	obj.lfn	= "ALL";
	obj.tds = false;
	obj.func = "parent.HS223Done('"+fromDate+"','"+toDate+"')";
	obj.field = "FC=I"
	+ "&HSU-COMPANY="+authUser.company
	+ "&HSU-EMPLOYEE="+authUser.employee
	+ "&FROM-DATE="+formjsDate(formatDME(fromDate))
	+ "&TO-DATE="+formjsDate(formatDME(toDate));
	if (arguments.length > 2 && arguments[2])
	{
		obj.field += "&LAST-EMPLOYEE="+Reports.LastEmployee
	  	obj.field += "&LAST-HSU-CODE="+Reports.LastHsuCode
	  	obj.field += "&LAST-LAST-NAME="+escape(Reports.LastLastName)
	  	obj.field += "&LAST-FIRST-NAME="+escape(Reports.LastFirstName)
  		obj.field += "&LAST-MIDDLE-INIT="+escape(Reports.LastMiddleInit)
  		obj.field += "&PT-PTM-START-DATE="+escape(Reports.LastStartDate);
	}
	obj.out = "JAVASCRIPT";
	obj.debug = false;
	AGS(obj,"jsreturn");
}

function HS223Done(fromDate, toDate)
{
	// Exit if lawheader is not defined
	if (typeof(self.lawheader.gmsgnbr) == "undefined")
	{
		stopProcessing();
		return;
	}	
	if (self.lawheader.gmsgnbr == "000")
	{
		if (self.lawheader.gmsg == "More records exist, use PageDown")
			GetReportingPayPlans(fromDate, toDate, true);
		else
			GetEmployeeEmail();
	}
	else
	{
		stopProcessing();
		var nextFunc = funtion() 
		{
			try
			{
				if (opener)
					QuitApp();
			}
			catch(e) {}			
		}
		var alertResponse = seaAlert(self.lawheader.gmsg, "", null, "error", nextFunc);
		if (typeof(alertResponse) == "undefined" || alertResponse == null)
		{	
			if (seaAlert == window.alert)
				nextFunc();
			return;
		}	
		nextFunc();
	}
}

function GetEmployeeEmail()
{
	if (!appObj)
		appObj = new AppVersionObject(authUser.prodline, "HR");
	// if you call getAppVersion() right away and the IOS object isn't set up yet,
	// then the code will be trying to load the sso.js file, and your call for
	// the appversion will complete before the ios version is set
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
       	setTimeout("GetEmployeeEmail()", 10);
       	return;
	}
	if (Reports.EmailPersonal == null)
		emssObjInstance.emssObj.emailAddressType = "work";
	if (emssObjInstance.emssObj.emailAddressType.toString().toLowerCase() == "personal")
	{		
		if (!appObj || appObj.getAppVersion() == null || appObj.getAppVersion().toString() < "10.00.00")
			emssObjInstance.emssObj.emailAddressType = "work";
	}	
	var gotAddr = ((emssObjInstance.emssObj.emailAddressType.toString().toLowerCase() == "personal" && Reports.EmailPersonal)
	|| (emssObjInstance.emssObj.emailAddressType.toString().toLowerCase() != "personal" && Reports.Email));
	if (!Reports || !gotAddr)
	{	
		var pDMEObj = new DMEObject(authUser.prodline, "EMPLOYEE");
		pDMEObj.out = "JAVASCRIPT";
		pDMEObj.index = "EMPSET1";
		pDMEObj.field = "email-address";
		if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "10.00.00")
			pDMEObj.field += ";email-personal";
		pDMEObj.key = authUser.company+"="+authUser.employee;
		pDMEObj.max = 1;
		pDMEObj.func = "StoreEmployeeEmail()";
		pDMEObj.debug = false;
		DME(pDMEObj,"jsreturn");
	}
	else
		LoadMissingTimeCardReport();
}

function StoreEmployeeEmail()
{
	Reports.Email = self.jsreturn.record[0].email_address;
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "10.00.00")
		Reports.EmailPersonal = self.jsreturn.record[0].email_personal;
	LoadMissingTimeCardReport();
}

function LoadMissingTimeCardReport()
{
	var MissingCardExists = false;
	var len = Reports.Detail.length;
	for (var i=0; i<len; i++)
	{
		if (Reports.Detail[i].Status == null || parseInt(Reports.Detail[i].Status, 10) == -1 || parseInt(Reports.Detail[i].Status, 10) == 0 || parseInt(Reports.Detail[i].Status, 10) == 4)
		{
			MissingCardExists = true;
			break;
		}
	}
	if (!MissingCardExists)
	{
		stopProcessing();
		var alertResponse = seaAlert(getSeaPhrase("NO_EMPLOYEE_HAVING_MISSING_CARD","TE"), "", null, "alert", BackToReporting);
		if (typeof(alertResponse) == "undefined" || alertResponse == null)
		{	
			if (seaAlert == window.alert)
				BackToReporting();
			return;
		}	
		BackToReporting();
		return;
	}
	PaintMissingTimeCardReport();
}

function PaintMissingTimeCardReport()
{
	html = '<table width="100%" border="0" cellspacing="0" cellpadding="2" role="presentation"><tr><td style="text-align:center">'
	html += uiButton(getSeaPhrase("BACK","TE"),"parent.BackToReporting();return false")		
	html += uiButton(getSeaPhrase("SEND_EMAIL","TE"),"parent.SendEmail();return false","margin-left:5px")
	html += uiButton(getSeaPhrase("PRINT","TE"),"parent.PrintMissingTimeCardReport();return false","margin-left:5px")
	try
	{
		if (opener)
			html += uiButton(getSeaPhrase("QUIT","TE"),"parent.QuitApp();return false","margin-left:5px");
	}
	catch(e) {}
	html += '</td></tr></table>';
	self.footer.document.getElementById("paneBody1").innerHTML = html;
	self.footer.stylePage();
	setWinTitle(getSeaPhrase("ACTION_BUTTONS","TE"), self.footer);
	PaintMissingTimeCardRecords();
}

function PaintMissingTimeCardRecords(onsort, sortField, sortDir)
{	
	sortDir = sortDir || "ascending";
	var nextSortDir = (sortDir == "ascending") ? "descending" : "ascending";	
	var sb = new StringBuffer();
 	var html = '<div style="text-align:center;padding-top:5px;padding-bottom:5px">'
 	html += '<p class="plaintablecell">'+getSeaPhrase("PRESS_SEND_TO_NOTIFY_EMPLOYEE_MISSING","TE")+'</p>'
	html += '<table id="missingReportTbl" align="center" border="1" cellspacing="0" cellpadding="0" style="width:100%;text-align:center;margin-left:auto;margin-right:auto" styler="list" summary="'+getSeaPhrase("TSUM_2","TE")+'">'
	html += '<caption class="offscreen">'+getSeaPhrase("TCAP_1","TE")+'</caption>'
	var toolTip = getSeaPhrase("EMPLOYEE_NAME","TE")+' - '+getSeaPhrase("SORT_BY_X","SEA");
	html += '<tr><th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortMissingTimeCards(\'FullName\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("EMPLOYEE_NAME","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("PAY_PERIOD_START_DATE","TE")+' - '+getSeaPhrase("SORT_BY_X","SEA");
	html += '<th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortMissingTimeCards(\'PeriodStartsAt\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("PAY_PERIOD_START_DATE","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("CARD_STATUS","TE")+' - '+getSeaPhrase("SORT_BY_X","SEA");
	html += '<th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortMissingTimeCards(\'Status\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("CARD_STATUS","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("NO_EMAIL_ADDRESS","TE")+' - '+getSeaPhrase("SORT_BY_X","SEA");
	html += '<th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortMissingTimeCards(\'Email\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("NO_EMAIL_ADDRESS","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th></tr>'
	sb.append(html);
	var len = Reports.Detail.length;
	for (var i=0; i<len; i++)
	{
	    if (Reports.Detail[i].Status == null)
			Reports.Detail[i].Status = -1;
		if (parseInt(Reports.Detail[i].Status, 10) == -1 || parseInt(Reports.Detail[i].Status, 10) == 0 || parseInt(Reports.Detail[i].Status, 10) == 4)
		{
			html = '<tr class="plaintablecellnopadding"><td>'+Reports.Detail[i].FullName+'</td><td>'
			if (Reports.Detail[i].PeriodStartsAt == null || Reports.Detail[i].PeriodStartsAt == "")
				html += getSeaPhrase("NOT_DEFINED","TE")
			else
				html += FormatDte4(Reports.Detail[i].PeriodStartsAt)
			html += '</td><td>'
			switch (parseInt(Reports.Detail[i].Status, 10))
			{
				case -1: html += getSeaPhrase("NOT_ENTERED","TE"); break;
				case 0: html += getSeaPhrase("NOT_SUBMITTED","TE"); break;
				case 4: html += getSeaPhrase("RETURNED","TE"); break;
				default: html += "&nbsp;"; break;
			}
			html += '</td><td style="text-align:center">'
			var rptEmail = Reports.Detail[i].Email;
			if (emssObjInstance.emssObj.emailAddressType.toString().toLowerCase() == "personal")
				rptEmail = Reports.Detail[i].EmailPersonal;
			if (rptEmail != null && rptEmail != "")
				html += "&nbsp;"
			else
				html += "**";
			html += '</td></tr>'
			sb.append(html);
		}
	}
	html = '</table></div>';
	sb.append(html);
	self.main.document.getElementById("paneBody1").innerHTML = sb.toString();
	self.main.stylePage();
	setWinTitle(getSeaPhrase("TCAP_1","TE"), self.main);
	if (onsort)
		self.main.styleSortArrow("missingReportTbl", sortField, sortDir);
	stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[getWinTitle(self.main)])+' '+getSeaPhrase("CNT_UPD_FRM","SEA",[self.footer.getWinTitle()]));
	fitToScreen();
}

function SendEmail()
{
	startProcessing(getSeaPhrase("SENDING_EMAIL","TE"), function(){SendEmployeeEmail(0);});
}

function SendEmployeeEmail(Index)
{	
	DONEFLAG = false;
	var pfEmailAry = new Array();
	// Try to trigger the ProcessFlow.  If it's not there, use the email CGI program.
	var techVersion = (iosHandler && iosHandler.getIOSVersionNumber() >= "09.00.00") ? ProcessFlowObject.TECHNOLOGY_900 : ProcessFlowObject.TECHNOLOGY_803;
	var httpRequest = (typeof(SSORequest) == "function") ? SSORequest : SEARequest;
	var pfObj = new ProcessFlowObject(window, techVersion, httpRequest, "EMSS");
	pfObj.setEncoding(authUser.encoding);
	pfObj.showErrors = false;
	var Subject = getSeaPhrase("TIME_ENTRY");
	if (Subject == "")
		Subject = "Time Entry";
	var len = Reports.Detail.length;
	for (var i=Index; i<len; i++)
	{
		var SendingTo = Reports.Detail[i].Email;
		var EmailIsFrom = Reports.Email;
	    var mailText = "";
	    if (emssObjInstance.emssObj.emailAddressType.toString().toLowerCase() == "personal")
	    {
	    	SendingTo = Reports.Detail[i].EmailPersonal;
	    	EmailIsFrom = Reports.EmailPersonal;
	    }
		if (SendingTo != null && SendingTo != "" && (parseInt(Reports.Detail[i].Status, 10) == -1 || parseInt(Reports.Detail[i].Status, 10) == 0 || parseInt(Reports.Detail[i].Status, 10) == 4))
		{
			if (emssObjInstance.emssObj.processFlowsEnabled)
			{
				pfEmailAry[i] = String(parseInt(Reports.Detail[i].Status,10));
				continue;
			}
			switch (parseInt(Reports.Detail[i].Status, 10))
			{
				case -1:
				case 0: mailText = getSeaPhrase("CARD_BEGINING_NOT_SUBMITTED","TE")+FormatDte4(Reports.Detail[i].PeriodStartsAt)+getSeaPhrase("SUBMIT_ASAP","TE");
						break;
				case 4: mailText = getSeaPhrase("CARD_BEGINING_PERIOD","TE")+FormatDte4(Reports.Detail[i].PeriodStartsAt)+getSeaPhrase("RETURNED_FOR_REVIEW_RESUBMIT_ASAP","TE");
						break;
			}
			__Index = i;
			if (typeof(EmailIsFrom) == "undefined" || EmailIsFrom == null || !EmailIsFrom)
				EmailIsFrom = SendingTo;
			if (SendingTo)
			{
				if (i == (len - 1))
					DONEFLAG = true;
				var obj = new EMAILObject(SendingTo, EmailIsFrom);
				obj.subject = Subject;
				obj.message = mailText;
				EMAIL(obj,"jsreturn");
				return;
			}
		}
	}
	if (emssObjInstance.emssObj.processFlowsEnabled)
	{
		// Process Flow can only handle up to 15 variables in a work unit.  Split up the direct reports into multiple
		// sets of data and send a chunk of data to each work unit required.  Send up to 36 direct reports per work unit.
		var rptsAry = new Array();
		for (var rptIndex in pfEmailAry)
		{
			var empNbr = String(Reports.Detail[rptIndex].Employee);
			var status = String(pfEmailAry[rptIndex]);
			var periodStartDate = String(Reports.Detail[rptIndex].PeriodStartsAt);
			var itemStr = empNbr + "=" + status + "=" + periodStartDate;
			var len = rptsAry.length;
			if (len == 0)
			{
				rptsAry[len] = "";
				len = rptsAry.length;
			}
			var newLen = rptsAry[len - 1].length + itemStr.length;
			if (rptsAry[len - 1] != "")
				newLen = newLen + 1; // count semicolon separator
			// WFWK.1 VARIABLE-VALUE field has a limit of 45 characters
			if (newLen <= 45)
			{
				if (rptsAry[len - 1] != "")
					rptsAry[len - 1] += ";";
				rptsAry[len - 1] += itemStr;
			}
			else
				rptsAry[len] = itemStr;
		}
		// We can only send up to 11 variables that contain direct reports, since we are also sending the company, employee, emailFormat, 
		// and role variables.  Trigger as many flows as necessary to process every direct report with a missing time card.
		var nbrFlows = Math.ceil(rptsAry.length / 11);
		var rptsIndex = 0;
		for (var j=0; j<nbrFlows; j++)
		{
			var flowObj = pfObj.setFlow("EMSSTimeEntChg", Workflow.SERVICE_EVENT_TYPE, Workflow.ERP_SYSTEM, authUser.prodline, authUser.webuser, null, "");
			flowObj.addVariable("company", String(authUser.company));
			flowObj.addVariable("employee", String(authUser.employee));
			flowObj.addVariable("role", "missing");
			flowObj.addVariable("emailFormat", String(emssObjInstance.emssObj.emailFormat)+","+String(emssObjInstance.emssObj.emailAddressType));
			var k = rptsIndex;
			var l = 1;
			while (k < rptsIndex + 11)
			{
				if (k < rptsAry.length)
					flowObj.addVariable("reports" + l, rptsAry[k]);
				else
					flowObj.addVariable("reports" + l, "");
				k++;
				l++;
			}
			rptsIndex += 11;
			pfObj.triggerFlow();
		}
	}
	stopProcessing();
	seaPageMessage(getSeaPhrase("EMAIL_SENT","TE"), null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
}

function cgiEmailDone()
{
	if (!DONEFLAG)
		SendEmployeeEmail(__Index+1);
	else
	{
		stopProcessing();
		seaPageMessage(getSeaPhrase("EMAIL_SENT","TE"), null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
	}	
}

function PrintMissingTimeCardReport()
{
	startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), PrintMissingReport);
}

function PrintMissingReport()
{
	var sb = new StringBuffer();
	var html = '<table align="center" border="1" cellpadding="0" cellspacing="0" style="width:650px" styler="list" summary="'+getSeaPhrase("TSUM_2","TE")+'">'
	html += '<caption class="offscreen">'+getSeaPhrase("TCAP_1","TE")+'</caption>'
	html += '<tr class="plaintablecellboldnopadding">'
	html += '<th scope="col" style="text-align:center">'+getSeaPhrase("EMPLOYEE_NAME","TE")+'</th>'
	html += '<th scope="col" style="text-align:center" nowrap>'+getSeaPhrase("PAY_PERIOD_START_DATE","TE")+'</th>'
	html += '<th scope="col" style="text-align:center">'+getSeaPhrase("CARD_STATUS","TE")+'</th>'
	html += '<th scope="col" style="text-align:center" nowrap>'+getSeaPhrase("NO_EMAIL_ADDRESS","TE")+'</th></tr>'
	sb.append(html);
	var len = Reports.Detail.length;
	for (var i=0; i<len; i++)
	{
		if (Reports.Detail[i].Status == null)
	    	Reports.Detail[i].Status = -1;
		if (parseInt(Reports.Detail[i].Status, 10) == -1 || parseInt(Reports.Detail[i].Status, 10) == 0 || parseInt(Reports.Detail[i].Status, 10) == 4)
		{	
			html = '<tr class="plaintablecellnopadding"><td>'+Reports.Detail[i].FullName+'</td><td>'+FormatDte4(Reports.Detail[i].PeriodStartsAt)+'</td><td>'
			switch (parseInt(Reports.Detail[i].Status, 10))
			{
				case -1: html += getSeaPhrase("NOT_ENTERED","TE"); break;
				case 0: html += getSeaPhrase("NOT_SUBMITTED","TE"); break;
				case 4: html += getSeaPhrase("REJECTED","TE"); break;
				default: html += "&nbsp;";
			}
			html += '</td><td style="text-align:center">'
			var rptEmail = Reports.Detail[i].Email;	
			if (emssObjInstance.emssObj.emailAddressType.toString().toLowerCase() == "personal")
				rptEmail = Reports.Detail[i].EmailPersonal;				
			if (rptEmail != null && rptEmail != "")
				html += "&nbsp;"
			else
				html += "**"
			html += '</td></tr>'
			sb.append(html);
		}
	}
	sb.append('</table>');
   	self.printFm.document.title = getSeaPhrase("TE_REPORT_MISSED_CARD","TE");
	self.printFm.document.getElementById("paneBody1").innerHTML = sb.toString();
	self.printFm.stylePage();
	self.printFm.document.body.style.overflow = "visible";
	self.printFm.document.getElementById("paneBody1").style.overflow = "visible";	
	stopProcessing();
	self.printFm.focus();
	self.printFm.print();
}

function SortMissingTimeCards(SortProperty, Dir)
{
	var nextFunc = function()
	{
	    SortByProperty = SortProperty;
		if (property != LastSortField)
			Dir = "ascending";
		LastSortField = SortProperty;
		var SortFunc = (Dir == "ascending") ? sortByAscAlpha : sortByDscAlpha;	    
	    Reports.Detail.sort(SortFunc);
		PaintMissingTimeCardRecords(true, SortProperty, Dir);		
	};
	startProcessing(getSeaPhrase("WAIT_FOR_SORTING","TE"), nextFunc);
}

function BackToReporting()
{
	self.footer.document.getElementById("paneBody1").innerHTML = "";
	LoadReporting();
}

/*
 *		Summary Report Functions
 */ 
var SortByProperty = "";

function DrawSummaryWindow()
{
	Reports = null;
	startProcessing(getSeaPhrase("GATHERING_DATA","TE"), GetSummaryApprovalReports);
}

function GetSummaryApprovalReports(MoreRecords)
{
	if (Reports == null)
	{
		Reports = new ReportsObject(authUser.company, authUser.employee)
		PlanCodes = new PlanCodeObject(authUser.company, authUser.employee)
		self.lawheader.linecount = 0;
	}
	self.lawheader.formlinecount = 0;
	self.lawheader.UpdateType = "HS22.3"
	var pAgsObj = new AGSObject(authUser.prodline, "HS22.3");
	pAgsObj.evt = "ADD";
	pAgsObj.rtn	= "DATA";
	pAgsObj.longNames = true;
	pAgsObj.lfn	= "ALL";
	pAgsObj.tds	= false;
	pAgsObj.field = "FC=I"
	+ "&HSU-COMPANY="+authUser.company
	+ "&HSU-EMPLOYEE="+authUser.employee
	+ "&FROM-DATE="+formjsDate(Details.StartDate)
	+ "&TO-DATE="+formjsDate(Details.EndDate);
	if (arguments.length > 0 && arguments[0])
	{
		pAgsObj.field += "&LAST-EMPLOYEE="+Reports.LastEmployee
	  	pAgsObj.field += "&LAST-HSU-CODE="+Reports.LastHsuCode
	  	pAgsObj.field += "&LAST-LAST-NAME="+escape(Reports.LastLastName)
	  	pAgsObj.field += "&LAST-FIRST-NAME="+escape(Reports.LastFirstName)
  		pAgsObj.field += "&LAST-MIDDLE-INIT="+escape(Reports.LastMiddleInit)
  		pAgsObj.field += "&PT-PTM-START-DATE="+escape(Reports.LastStartDate);
	}
	pAgsObj.func = "parent.FinishedHS22Call()";
	pAgsObj.debug = false;
	AGS(pAgsObj,"jsreturn");
}

function FinishedHS22Call()
{
	if (self.lawheader.gmsgnbr == "000")
	{
		if (self.lawheader.gmsg == "More records exist, use PageDown")
			GetSummaryApprovalReports(true);
		else
			PaintSummaryReport();
	}
	else
	{
		stopProcessing();
		seaAlert(self.lawheader.gmsg, null, null, "error");
		BackToStatuses();
	}
}

function PaintSummaryReport(onsort, sortField, sortDir)
{
	html = '<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="text-align:center">'
	html += uiButton(getSeaPhrase("BACK","TE"),"parent.BackToStatuses();return false")		
	html += uiButton(getSeaPhrase("PRINT","TE"),"parent.PrintSummaryTimeCardReport();return false","margin-left:5px")
	try
	{
		if (opener)
			html += uiButton(getSeaPhrase("QUIT","TE"),"parent.QuitApp();return false","margin-left:5px")
	}
	catch(e) {}
	html += '</td></tr></table>'
	self.footer.document.getElementById("paneBody1").innerHTML = html;
	self.footer.stylePage();
	setWinTitle(getSeaPhrase("ACTION_BUTTONS","TE"), self.footer);
	PaintSummaryReportRecords(onsort, sortField, sortDir);
}

function PaintSummaryReportRecords(onsort, sortField, sortDir)
{
	sortDir = sortDir || "ascending";
	var nextSortDir = (sortDir == "ascending") ? "descending" : "ascending";	
	var sb = new StringBuffer();
	var html = '<div style="text-align:center;padding-top:5px;padding-bottom:5px">'
	html += '<table id="summaryReportTbl" border="1" align="center" cellspacing="0" cellpadding="0" style="width:100%;text-align:center;margin-left:auto;margin-right:auto" styler="list" summary="'+getSeaPhrase("TSUM_3","TE")+'">'
	html += '<caption class="plaintablecellbold" style="text-align:center">'+getSeaPhrase("TE_REPORT_SUMMARY","TE")+'</caption>'
	var toolTip = getSeaPhrase("EMPLOYEE_NAME","TE")+' - '+getSeaPhrase("SORT_BY_X","SEA");
	html += '<tr><th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortSummaryDetail(\'EMPLOYEE\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("EMPLOYEE_NAME","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("PAY_PERIOD","TE")+' - '+getSeaPhrase("SORT_BY_X","SEA");
	html += '<th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortSummaryDetail(\'PAYPERIOD\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("PAY_PERIOD","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("HOURS","TE")+' - '+getSeaPhrase("SORT_BY_X","SEA");
	html += '<th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortSummaryDetail(\'HOURS\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("HOURS","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("TIMECARD_TYPE","TE")+' - '+getSeaPhrase("SORT_BY_X","SEA");
	html += '<th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortSummaryDetail(\'TIMECARDTYPE\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("TIMECARD_TYPE","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("SORT_BY_STATUS","ESS");
	html += '<th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortSummaryDetail(\'STATUS\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("STATUS_ONLY","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a>'
    html += '</th></tr>'
	sb.append(html);
	var len = Reports.Detail.length;
	if (len == 0)
	{
		html = '<tr class="plaintablecellnopadding"><td colspan="5">'+getSeaPhrase("NO_PAY_PERIODS_FOUND","TE")+'&nbsp;</td></tr>'
		sb.append(html);
	}
	else
	{
		for (var i=0; i<len; i++)
		{
			// PT 116112: skip blank records, or filter out records with statuses that were not selected
			if (!Details.ShowAllRecords && Details.ShowBlankRecords)
			{
				// show records for just the statuses that were selected
				if (Reports.Detail[i].Status != null && !Details.Statuses[(parseFloat(Reports.Detail[i].Status)+1)])
					continue;
			}
			else if (Details.ShowAllRecords && !Details.ShowBlankRecords)
			{
				// skip only those records that don't have a status
				if (Reports.Detail[i].Status == null)
					continue;
			}
			else if (!Details.ShowAllRecords && !Details.ShowBlankRecords)
			{
				// skip records without a status; show records for just the statuses that were selected
				if (Reports.Detail[i].Status == null || !Details.Statuses[(parseFloat(Reports.Detail[i].Status)+1)])
					continue;
			}
			for (var j=0; j<Details.EmployeeNumbers.length; j++)
			{
				if (Reports.Detail[i].Employee == Details.EmployeeNumbers[j])
				{
					html = '<tr class="plaintablecellnopadding">'
					html += '<td>'+Reports.Detail[i].FullName+'&nbsp;</td>'
					html += '<td>'+FormatDte3(Reports.Detail[i].PeriodStartsAt)+' - '+FormatDte3(Reports.Detail[i].PeriodStopsAt)+'&nbsp;</td>'
					html += '<td>'+Reports.Detail[i].TotalHours+'&nbsp;</td>'
					html += '<td>'+((Reports.Detail[i].TimecardTypeDesc == null) ? "" : Reports.Detail[i].TimecardTypeDesc) +'&nbsp;</td>'
					html += '<td>'+Reports.Detail[i].StatusDescription+'&nbsp;</td></tr>'
					sb.append(html);
				}
			}
		}
	}
	html = '</table></div>';
	sb.append(html);
	self.main.document.getElementById("paneBody1").innerHTML = sb.toString();
	self.main.stylePage();
	setWinTitle(getSeaPhrase("TE_REPORT_SUMMARY","TE"), self.main);
	if (onsort)
		self.main.styleSortArrow("summaryReportTbl", sortField, sortDir);
	stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[getWinTitle(self.main)])+' '+getSeaPhrase("CNT_UPD_FRM","SEA",[self.footer.getWinTitle()]));	
	fitToScreen();
}

function PrintSummaryTimeCardReport()
{
	startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), PrintSummaryReport);
}

function PrintSummaryReport(onsort, sortField, sortDir)
{
	sortDir = sortDir || "ascending";
	var nextSortDir = (sortDir == "ascending") ? "descending" : "ascending";	
	var sb = new StringBuffer();
	var html = '<div style="text-align:center">'
	html += '<table border="1" width="100%" style="text-align:center" cellspacing="0" cellpadding="2" summary="'+getSeaPhrase("TSUM_3","TE")+'">'
	html += '<caption class="plaintablecellbold" style="text-align:center">'+getSeaPhrase("TE_REPORT_SUMMARY","TE")+'</caption>'
	var toolTip = getSeaPhrase("EMPLOYEE_NAME","TE")+' - '+getSeaPhrase("SORT_BY_X","SEA");
	html += '<tr><th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortSummaryDetail(\'EMPLOYEE\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("EMPLOYEE_NAME","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("PAY_PERIOD","TE")+' - '+getSeaPhrase("SORT_BY_X","SEA");
	html += '<th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortSummaryDetail(\'PAYPERIOD\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("PAY_PERIOD","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("HOURS","TE")+' - '+getSeaPhrase("SORT_BY_X","SEA");
	html += '<th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortSummaryDetail(\'HOURS\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("HOURS","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("TIMECARD_TYPE","TE")+' - '+getSeaPhrase("SORT_BY_X","SEA");
	html += '<th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortSummaryDetail(\'TIMECARDTYPE\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("TIMECARD_TYPE","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("SORT_BY_STATUS","ESS");
	html += '<th scope="col" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortSummaryDetail(\'STATUS\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("STATUS_ONLY","TE")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a>'
    html += '</th></tr>'
    sb.append(html);
	var len = Reports.Detail.length;
	if (len == 0)
	{
		html = '<tr class="plaintablecellnopadding"><td colspan="5">'+getSeaPhrase("NO_PAY_PERIODS_FOUND","TE")+'&nbsp;</td></tr>'
		sb.append(html);
	}
	else
	{
		for (var i=0; i<len; i++)
		{
			// PT 116112: skip blank records, or filter out records with statuses that were not selected
			if (!Details.ShowAllRecords && Details.ShowBlankRecords)
			{
				// show records for just the statuses that were selected
				if (Reports.Detail[i].Status != null && !Details.Statuses[(parseFloat(Reports.Detail[i].Status)+1)])
					continue;
			}
			else if (Details.ShowAllRecords && !Details.ShowBlankRecords)
			{
				// skip only those records that don't have a status
				if (Reports.Detail[i].Status == null)
					continue;
			}
			else if (!Details.ShowAllRecords && !Details.ShowBlankRecords)
			{
				// skip records without a status; show records for just the statuses that were selected
				if (Reports.Detail[i].Status == null || !Details.Statuses[(parseFloat(Reports.Detail[i].Status)+1)])
					continue;	
			}
			for (var j=0; j<Details.EmployeeNumbers.length; j++)
			{
				if (Reports.Detail[i].Employee == Details.EmployeeNumbers[j])
				{
					html = '<tr class="plaintablecellnopadding">'
					html += '<td>'+Reports.Detail[i].FullName+'&nbsp;</td>'
					html += '<td>'+FormatDte3(Reports.Detail[i].PeriodStartsAt)+' - '+FormatDte3(Reports.Detail[i].PeriodStopsAt)+'&nbsp;</td>'
					html += '<td>'+Reports.Detail[i].TotalHours+'&nbsp;</td>'
					html += '<td>'+((Reports.Detail[i].TimecardTypeDesc == null) ? "" : Reports.Detail[i].TimecardTypeDesc)+'&nbsp;</td>'
					html += '<td>'+Reports.Detail[i].StatusDescription+'&nbsp;</td></tr>'
					sb.append(html);
				}
			}
		}
	}
	html = '</table></div>';
	sb.append(html);
	self.printFm.document.title = getSeaPhrase("TE_REPORT_SUMMARY","TE");
	self.printFm.document.getElementById("paneBody1").innerHTML = sb.toString();
	self.printFm.stylePage();
	self.printFm.document.body.style.overflow = "visible";
	self.printFm.document.getElementById("paneBody1").style.overflow = "visible";
	stopProcessing();
	self.printFm.focus();
	self.printFm.print();
}

function SortSummaryDetail(SortParameter, Dir)
{
	var nextFunc = function()
	{		
		var SortType = null;
		switch (SortParameter)
		{
			case "EMPLOYEE": SortByProperty = "FullName"; SortType = "alpha"; break;
			case "PAYPERIOD": SortByProperty = "PeriodStartsAt"; SortType = "alpha"; break;
			case "HOURS": SortByProperty = "TotalHours"; SortType = "number"; break;
			case "TIMECARDTYPE": SortByProperty = "TimecardTypeDesc"; SortType = "alpha"; break;
			case "STATUS": SortByProperty = "Status"; SortType = "alpha"; break;
		}
		if (SortByProperty != LastSortField)
			Dir = "ascending";
		LastSortField = SortByProperty;		
		if (SortType != null)
		{
			var SortFunc;
			if (Dir == "ascending")
				SortFunc = (SortType == "number") ? sortByAscNumber : sortByAscAlpha;
			else
				SortFunc = (SortType == "number") ? sortByDscNumber : sortByDscAlpha;
			Reports.Detail.sort(SortFunc);		
		}
		PaintSummaryReportRecords(true, SortParameter, Dir);		
	};
	startProcessing(getSeaPhrase("WAIT_FOR_SORTING","TE"), nextFunc);	
}

function BackToStatuses()
{
	self.footer.document.getElementById("paneBody1").innerHTML = "";
	DetailStatuses(2);
}
 
