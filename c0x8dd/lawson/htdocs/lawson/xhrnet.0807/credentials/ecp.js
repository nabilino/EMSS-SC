// Version: 8-)@(#)@10.00.02.00.29
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/credentials/ecp.js,v 1.13.2.27 2012/06/29 17:24:23 brentd Exp $
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
//*   (c) COPYRIGHT 2012 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************
var ECPV;
var stateProvFilter = "state";
var sortProperty;

function EmployeeCompetencyProfile(Company, Employee, Manager, Refresh, Index)
{			
	if (ECPV && ECPV.EmployeeCode == Employee && !Refresh)
	{
		ECPV.Manager = Manager;
		OpenECPVWindow();
	}
	else
	{
		self.lawheader.UpdateType = "ECPV";

		if (Index<0 || typeof(Index) == "undefined")
		{			
			ECPV = new self.lawheader.ECPVObject();
			self.lawheader.index = (typeof(Index) == "undefined") ? -1 : Index;
		}
		else {
			self.lawheader.index = Index-1;
		}
		
		ECPV.Manager = Manager;
		agsCall = new AGSObject(authUser.prodline,"HS11.1");
			agsCall.event		= "CHANGE";
			agsCall.rtn		= "DATA";
			agsCall.longNames	= true;
			agsCall.tds		= false;

			agsCall.field = "FC=I";
			agsCall.field += "&EPC-COMPANY="+escape(Company);
			agsCall.field += "&EPC-EMPLOYEE="+escape(Employee);
			agsCall.field += "&REQUESTOR="+((Manager)?"3":"2");

			agsCall.func		= "parent.ReturnAgsCall('"+Company+"','"+Employee+"','"+Manager+"',"+Refresh+")";
			agsCall.out		= "JAVASCRIPT";
			agsCall.debug		= false;
			AGS(agsCall,"jsreturn");
	}
}

function ReturnAgsCall(Company, Employee, Manager, Refresh)
{
	if(self.lawheader.gmsgnbr!="000") {
		stopProcessing();	
		seaAlert(self.lawheader.gmsg);
	}	
	else {
		OpenECPVWindow(Refresh);
	}
}

function OpenECPVWindow(Refresh)
{	
	ECPV.ECPVWindow = self;
	PaintECPVContents(Refresh);
}

function PaintECPVContents(Refresh)
{
	var strHtml;	
	
//
// Work Restrictions
//
	if (ECPV.WorkRestrictorIndicator && NonSpace(ECPV.WorkRestrictorIndicator)>0) {

		WorkRestrictionsProfile(ECPV.Company, ECPV.EmployeeCode, ECPV.SystemDate, ECPV.EmployeeName);
	}
	else {
		strHtml = '<div class="fieldlabelboldleft">'
		+ getSeaPhrase("NO_WORK_RESTRICTIONS","CR")
		+ '</div>'

		try {
			self.restrictions.document.getElementById("paneHeader").innerHTML = getSeaPhrase("WORK_RESTRICTIONS","CR");
			self.restrictions.document.getElementById("paneBody").innerHTML = strHtml;
		}
		catch(e) {}

		self.restrictions.stylePage();
		self.restrictions.setLayerSizes();
		document.getElementById("restrictions").style.visibility = "visible";	
	}
//
// Summary 
//
	strHtml = '<table border="0" cellspacing="0" cellpadding="0" style="width:100%">'
	+ '<tr>'
	+ '<td class="plaintablerowheader" style="width:46%">'+getSeaPhrase("DEPARTMENT","CR")+'</td>'
	+ '<td class="plaintablecelldisplay" style="width:27%" nowrap>'+((ECPV.DepartmentName && NonSpace(ECPV.DepartmentName)>0)?ECPV.DepartmentName:'&nbsp;')+'</td>'	
	+ '<td class="plaintablecelldisplay" style="width:27%" nowrap>&nbsp;</td>'
	+ '</tr>'
	+ '<tr>'
	+ '<td class="plaintablerowheader" style="width:46%">'+getSeaPhrase("JOB","CR")+'</td>'
	+ '<td class="plaintablecelldisplay" style="width:27%" nowrap>'+((ECPV.JobCodeDescription && NonSpace(ECPV.JobCodeDescription)>0)?ECPV.JobCodeDescription:'&nbsp;')+'</td>'	
	+ '<td class="plaintablecelldisplay" style="width:27%" nowrap>&nbsp;</td>'
	+ '</tr>'	
	+ '<tr>'
	+ '<td class="plaintablerowheader" style="width:46%">'+getSeaPhrase("JOB_DATE","CR")+'</td>'
	+ '<td class="plaintablecelldisplay" style="width:27%" nowrap>'+((ECPV.BeginningDateJob && NonSpace(ECPV.BeginningDateJob)>0)?FormatDte4(ECPV.BeginningDateJob):'&nbsp;')+'</td>'	
	+ '<td class="plaintablecelldisplay" style="width:27%" nowrap>&nbsp;</td>'
	+ '</tr>'
	+ '<tr>'
	+ '<td class="plaintablerowheader" style="width:46%">'+getSeaPhrase("POSITION_DATE","CR")+'</td>'
	+ '<td class="plaintablecelldisplay" style="width:27%" nowrap>'+((ECPV.BeginningDatePosition && NonSpace(ECPV.BeginningDatePosition)>0)?FormatDte4(ECPV.BeginningDatePosition):'&nbsp;')+'</td>'	
	+ '<td class="plaintablecelldisplay" style="width:27%" nowrap>&nbsp;</td>'
	+ '</tr>'
	+ '<tr>'
	+ '<td class="plaintablerowheader" style="width:46%">'+getSeaPhrase("HIRE_DATE","CR")+'</td>'
	+ '<td class="plaintablecelldisplay" style="width:27%" nowrap>'+((ECPV.DateHired && NonSpace(ECPV.DateHired)>0)?FormatDte4(ECPV.DateHired):'&nbsp;')+'</td>'	
	+ '<td class="plaintablecelldisplay" style="width:27%" nowrap>&nbsp;</td>'
	+ '</tr>'	
	+ '<tr>'
	+ '<td class="plaintablerowheader" style="width:46%">'+getSeaPhrase("LAST_REVIEW","CR")+'</td>'
	+ '<td class="plaintablecelldisplay" style="width:27%" nowrap>'+((ECPV.ActualDate && NonSpace(ECPV.ActualDate)>0)?FormatDte4(ECPV.ActualDate):'&nbsp;')+'</td>'	
	+ '<td class="plaintablecelldisplay" style="width:27%" nowrap>&nbsp;</td>'
	+ '</tr>'
	+ '<tr>'
	+ '<td class="plaintablerowheader" style="width:46%">'+getSeaPhrase("NEXT_REVIEW","CR")+'</td>'
	
	if (ECPV.OverdueReviewIndicator && NonSpace(ECPV.OverdueReviewIndicator)>0) {
		strHtml += '<td class="plaintablecellred" style="width:54%" nowrap>'+((ECPV.NextReview && NonSpace(ECPV.NextReview)>0)?FormatDte4(ECPV.NextReview):'&nbsp;')
		+ uiRequiredIcon(getSeaPhrase("OVERDUE","CR"))
		+ '</td>'	
	}
	else {
		strHtml += '<td class="plaintablecelldisplay" style="width:54%" nowrap>'+((ECPV.NextReview && NonSpace(ECPV.NextReview)>0)?FormatDte4(ECPV.NextReview):'&nbsp;')+'</td>'	
	}
	
	strHtml += '<td class="plaintablecelldisplay" style="width:27%" nowrap>&nbsp;</td>'
	+ '</tr>'
	+ '<tr>'
	+ '<td class="plaintablerowheaderborder" style="width:46%">'+getSeaPhrase("NEXT_PHYSICAL","CR")+'</td>'
	
	if (ECPV.OverduePhysicalIndicator && NonSpace(ECPV.OverduePhysicalIndicator)>0) {
		strHtml += '<td class="plaintablecellred" style="width:27%" nowrap>'+((ECPV.NextPhysical && NonSpace(ECPV.NextPhysical)>0)?FormatDte4(ECPV.NextPhysical):'&nbsp;')
		+ uiRequiredIcon(getSeaPhrase("OVERDUE","CR"))
		+'</td>'	
	}
	else {
		strHtml += '<td class="plaintablecelldisplay" style="width:27%" nowrap>'+((ECPV.NextPhysical && NonSpace(ECPV.NextPhysical)>0)?FormatDte4(ECPV.NextPhysical):'&nbsp;')+'</td>'
	}

	if ((ECPV.OverdueReviewIndicator && NonSpace(ECPV.OverdueReviewIndicator)>0) 
	|| (ECPV.OverduePhysicalIndicator && NonSpace(ECPV.OverduePhysicalIndicator)>0)) {
		strHtml += '<td class="plaintablecellredright" style="width:27%" nowrap><span style="white-space:nowrap">'
		+ getSeaPhrase("OVERDUE","CR")
		+ uiRequiredIcon(getSeaPhrase("OVERDUE","CR"))		
		+ '</span></td>'
	}
	else {
		strHtml += '<td class="plaintablecelldisplay" style="width:27%" nowrap>&nbsp;</td>'
	}
	
	strHtml += '</tr></table>';

	try {
		if (ECPV.Manager) {
			self.summary.document.getElementById("paneHeader").innerHTML = getSeaPhrase("SUMMARY","CR")+' - '+ECPV.EmployeeName;
		}
		else {
			self.summary.document.getElementById("paneHeader").innerHTML = getSeaPhrase("SUMMARY","CR");	
		}
		self.summary.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}

	self.summary.stylePage();
	self.summary.setLayerSizes();
	document.getElementById("summary").style.visibility = "visible";
//
// Required Competencies
//	
	PaintRequiredCompetencies();
	
	if(ECPV.ComTransactionLimit == 'Y')
		seaAlert(getSeaPhrase("CR_67","CR")) ;	

	if (fromTask && ECPV.Manager) {
		
		var tmpStr = '<table border="0" cellspacing="0" cellpadding="0" width="100%" style="background-color:transparent">'
		+ '<tr>'
		
		try {
			// Only display the select box if there is more than one employee available for selection
			if (parent.parent.DRPV.DirectReports.length > 1) {
				
				tmpStr += '<td class="plaintablecellright" style="width:auto;background-color:transparent" nowrap>'
				+ BuildReportSelect(employeeNbr)
				+ '</td>'		
			}
			if (navigator.appName.indexOf("Microsoft") >= 0) {
				tmpStr += '<td class="plaintablecellright" style="padding-right:0px;background-color:transparent" nowrap>'
				+ uiButton(getSeaPhrase("BACK","CR"),"CloseEmployeeProfile();return false","margin-right:0px");
				+ '</td>'
			}
			else {
				tmpStr += '<td class="plaintablecellright" style="background-color:transparent" nowrap>'
				+ uiButton(getSeaPhrase("BACK","CR"),"CloseEmployeeProfile();return false");
				+ '</td>'			
			}
		}
		catch(e) {
			if (navigator.appName.indexOf("Microsoft") >= 0) {			
				tmpStr += '<td class="plaintablecellright" style="width:100%;padding-right:0pxbackground-color:transparent" nowrap>'
				+ uiButton(getSeaPhrase("BACK","CR"),"CloseEmployeeProfile();return false","margin-right:0px");
				+ '</td>'
			}
			else {
				tmpStr += '<td class="plaintablecellright" style="width:100%background-color:transparent" nowrap>'
				+ uiButton(getSeaPhrase("BACK","CR"),"CloseEmployeeProfile();return false");
				+ '</td>'			
			}
		}
		
		tmpStr += '</tr>'
		+ '</table>'
		document.getElementById("navarea").innerHTML = tmpStr;
		stylePage();
		document.getElementById("navarea").style.visibility = "visible";
	}

	// show an alert message following an update
	if (Refresh) {
		seaAlert(getSeaPhrase("UPDATE_COMPLETE","CR"));
	}

	stopProcessing();		
	fitToScreen();	
}

function BuildReportSelect(empNbr)
{
	var tmpHtml = "";
	
	try {
		var Reports = parent.parent.DRPV.DirectReports;
		
		tmpHtml = '<select class="inputbox" name="reports" id="reports" ';
		tmpHtml += 'onchange="RefreshCompProfile(this.options[this.selectedIndex].value)">';
		
		for (var i=0; i<Reports.length; i++) {
			tmpHtml += '<option value="'+Reports[i].Employee+'"';
			tmpHtml += (empNbr==Reports[i].Employee)?' selected>':'>';
			tmpHtml += Reports[i].LabelName;
		}
	
		tmpHtml += '</select>'
	}
	catch(e) {}
	
	return tmpHtml;
}

function RefreshCompProfile(empNbr)
{
	// Hide the detail frame, if it is visible.
	ClearDetailScreen();

	employeeNbr = empNbr;
	startProcessing(getSeaPhrase("WAIT","CR"));
	EmployeeCompetencyProfile(authUser.company, empNbr, true, false, -1);	
}

function CloseEmployeeProfile()
{
	try {
		document.getElementById("navarea").style.visibility = "hidden";
	} catch(e) {}	
		
	// if task is launched from ecpmain.htm as a sub task	
	try {
		parent.parent.document.getElementById("subtask").style.visibility = "hidden";
	} catch(e) {}
	try {
		parent.parent.document.getElementById("navarea").style.visibility = "visible";
	} catch(e) {}	
	try {
		parent.parent.document.getElementById("header").style.visibility = "visible";
	} catch(e) {}
	try {
		parent.parent.document.getElementById("main").style.visibility = "visible";
	} catch(e) {}
	try {
		parent.parent.subtask.location.replace("/lawson/xhrnet/dot.htm");
	} catch(e) {}	

	// if task is run stand-alone
	try {
		parent.document.getElementById("subtask").style.visibility = "hidden";
	} catch(e) {}
	try {
		parent.document.getElementById("navarea").style.visibility = "visible";
	} catch(e) {}	
	try {
		parent.document.getElementById("header").style.visibility = "visible";
	} catch(e) {}
	try {
		parent.document.getElementById("main").style.visibility = "visible";
	} catch(e) {}
	try {
		parent.subtask.location.replace("/lawson/xhrnet/dot.htm");
	} catch(e) {}	
}

function PaintRequiredCompetencies(onsort, sortIndex)
{
	var strHtml;
	var overdueRecs = false;
	
	if (typeof(ECPV.ReqCompetencies) != "undefined" && ECPV.ReqCompetencies.length>0
	&& ECPV.JobCompFlag == "Y") {

		strHtml = '<table id="reqcompTbl" class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">'
		+ '<tr>'
		+ '<th class="plaintableheaderborder" style="text-align:center;width:50%" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
		+ '<a class="columnsort" href="javascript:void(0);" onclick="parent.SortCompetencyArray(1);return false"'
		+ ' onmouseover="window.status=\''+getSeaPhrase("SORT_BY_COMPETENCY","CR").replace(/\'/g,"\\'")+'\';return true"'
		+ ' onmouseout="window.status=\' \';return true">'+getSeaPhrase("COMPETENCY","CR")+'</a></th>'
		+ '<th class="plaintableheaderborder" style="text-align:center;width:25%" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
		+ '<a class="columnsort" href="javascript:void(0);" onclick="parent.SortCompetencyArray(2);return false"'
		+ ' onmouseover="window.status=\''+getSeaPhrase("SORT_BY_ACQUIRED_DATE","CR").replace(/\'/g,"\\'")+'\';return true"'
		+ ' onmouseout="window.status=\' \';return true">'+getSeaPhrase("ACQUIRED","CR")+'</a></th>'
		+ '<th class="plaintableheaderborder" style="text-align:center;width:25%" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
		+ '<a class="columnsort" href="javascript:void(0)" onclick="parent.SortCompetencyArray(3);return false"'
		+ ' onmouseover="window.status=\''+getSeaPhrase("SORT_BY_RENEW_DATE","CR").replace(/\'/g,"\\'")+'\';return true"'
		+ ' onmouseout="window.status=\' \';return true">'+getSeaPhrase("RENEW_BY","CR")+'</a></th>'
		+ '</tr>';

		for (var i=0; i<ECPV.ReqCompetencies.length; i++)
		{
			strHtml += '<tr>'
			+ '<td class="plaintablecelldisplay" style="width:50%" nowrap>'
			
			//if (ECPV.Manager) {
				strHtml += '<a href="javascript:void(0)" onclick="parent.ChangeClicked('+i+');return false">'
				+ ((ECPV.ReqCompetencies[i].Description && NonSpace(ECPV.ReqCompetencies[i].Description)>0)?ECPV.ReqCompetencies[i].Description:'&nbsp;')
				+ '</a>';
			//}
			//else {
			//	strHtml += (ECPV.ReqCompetencies[i].Description)?ECPV.ReqCompetencies[i].Description:'&nbsp;';
			//}	
				
			strHtml += '</td>'
			+ '<td class="plaintablecelldisplay" style="width:25%;text-align:center" nowrap>'
			+ ((ECPV.ReqCompetencies[i].Acquired && NonSpace(ECPV.ReqCompetencies[i].Acquired)>0)?FormatDte4(ECPV.ReqCompetencies[i].Acquired):'&nbsp;')+'</td>'

			if (ECPV.ReqCompetencies[i].OverdueInd && NonSpace(ECPV.ReqCompetencies[i].OverdueInd)>0) {
				
				overdueRecs = true;
				strHtml += '<td class="plaintablecellred" style="width:25%;text-align:center" nowrap>'	
				+ '<span class="plaintablecellred">'
				+ ((ECPV.ReqCompetencies[i].RenewDate && NonSpace(ECPV.ReqCompetencies[i].RenewDate)>0)?FormatDte4(ECPV.ReqCompetencies[i].RenewDate):'&nbsp;')
				+ uiRequiredIcon(getSeaPhrase("OVERDUE","CR"))
				+ '</span>'
				+'</td>';
			}
			else {
				strHtml += '<td class="plaintablecelldisplay" style="width:25%;text-align:center" nowrap>'			
				+ ((ECPV.ReqCompetencies[i].RenewDate && NonSpace(ECPV.ReqCompetencies[i].RenewDate)>0)?FormatDte4(ECPV.ReqCompetencies[i].RenewDate):'&nbsp;')+'</td>';
			}
			
			strHtml += '</tr>';
		}

		if (overdueRecs) {
			strHtml += '<tr>'
			+ '<td class="plaintablecellredright" colspan="3" style="padding-top:5px" nowrap>'
			+ '<span class="plaintablecellred" style="white-space:nowrap">' + getSeaPhrase("OVERDUE","CR")
			+ uiRequiredIcon(getSeaPhrase("OVERDUE","CR"))
			+ '</span></td>'
			+ '</tr>'		
		}
	
		strHtml += '</table>';
	}
	else {
		strHtml = '<div class="fieldlabelboldleft">'
		+ getSeaPhrase("NO_REQ_COMPS","CR")
		+ '</div>'	
	}
				
	try {
		self.required.document.getElementById("paneHeader").innerHTML = getSeaPhrase("CR_6","CR");
		self.required.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}

	self.required.stylePage();

	if (!onsort) {
		self.required.setLayerSizes();
		document.getElementById("required").style.visibility = "visible";
	} else {
		self.required.styleSortArrow("reqcompTbl", sortIndex);
	}
				
	stopProcessing();	
}

function WorkRestrictionsDone()
{
	var strHtml = (WRAV && WRAV.WRAVHtml) ? WRAV.WRAVHtml : '';
		
	try {
		self.restrictions.document.getElementById("paneHeader").innerHTML = getSeaPhrase("WORK_RESTRICTIONS","CR");
		self.restrictions.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}

	self.restrictions.stylePage();
	self.restrictions.setLayerSizes();
	document.getElementById("restrictions").style.visibility = "visible";
}

function sortByProperty(obj1, obj2)
{
	var name1 = obj1[sortProperty];
	var name2 = obj2[sortProperty];
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function SortCompetencyArray(Index)
{
	if(Index == 1) {
		sortProperty = "Description";
		ECPV.ReqCompetencies.sort(sortByProperty);
	}
	else if(Index == 2) {
		sortProperty = "Acquired";
		ECPV.ReqCompetencies.sort(sortByProperty);
	}
	else if(Index == 3) {
		sortProperty = "RenewDate";
		ECPV.ReqCompetencies.sort(sortByProperty);
	}
	
	PaintRequiredCompetencies(true, Index);
}

function ChangeClicked(Index)
{
	startProcessing(getSeaPhrase("CR_9","CR"));
	activateTableRow("reqcompTbl",Index,self.required,false,false);

	if (emssObjInstance.emssObj.filterSelect)
	{	
		if (ECPV.ReqCompetencies[Index].Type != "CE" && !CompSelectsLoaded) {
			GetPcodesSelect(authUser.prodline,"PF","StoreProficiencies("+Index+")","active");
		} else {
			GetCompDetail(Index);
		}
	}
	else
	{
		if (ECPV.ReqCompetencies[Index].Type == "CE" && !CertSelectsLoaded) {
			if (ECPV.Manager && (parent.CalledGrabStates || pStateProvince.length>0)) {
				pStateProvince = parent.pStateProvince;
				GetCurrencyCodes(Index);
			}
			else {
				GrabStates("GetCurrencyCodes("+Index+")");
			}
		}
		else if (!CompSelectsLoaded && !CertSelectsLoaded) {
			GetPcodesSelect(authUser.prodline,"PF;SS","GetMorePcodes("+Index+")","active");
		}
		else {
			GetCompDetail(Index);
		}
	}	
}

function StoreProficiencies(Index)
{
	var PcodesObj = new Object();
	Proficiency = PcodesInfo;
	CalledPcodesInfo = false;
	PcodesInfo = new Array();
	GetCompDetail(Index);
}

function reqcompTbl_OnRowActivate(rowNbr)
{	
	try {
		if (ECPV.ReqCompetencies[rowNbr-1].OverdueInd && NonSpace(ECPV.ReqCompetencies[rowNbr-1].OverdueInd)>0) {
	
			var tblObj = self.required.document.getElementById("reqcompTbl");	
			var tblRows = tblObj.getElementsByTagName("tr");
			var tblRow = tblRows[rowNbr];
			var tblCells = tblRow.getElementsByTagName("td");

			tblCells[tblCells.length-1].className = "plaintablecellredactive";
		}
	}
	catch(e) {}
	
	return true;
}

function reqcompTbl_OnRowDeactivate(rowNbr)
{
	try {
		if (ECPV.ReqCompetencies[rowNbr-1].OverdueInd && NonSpace(ECPV.ReqCompetencies[rowNbr-1].OverdueInd)>0) {

			var tblObj = self.required.document.getElementById("reqcompTbl");		
			var tblRows = tblObj.getElementsByTagName("tr");
			var tblRow = tblRows[rowNbr];
			var tblCells = tblRow.getElementsByTagName("td");
		
			tblCells[tblCells.length-1].className = "plaintablecellred";
		}
	}	
	catch(e) {}	

	return true;
}

function reqcompTbl_OnRowsDeactivate()
{
	try {
		var tblObj = self.required.document.getElementById("reqcompTbl");
		
		tblRows = tblObj.getElementsByTagName("tr");
	
		for (var i=1; i<tblRows.length; i++) {
	
			if (ECPV.ReqCompetencies[i-1].OverdueInd && NonSpace(ECPV.ReqCompetencies[i-1].OverdueInd)>0) {
		
				var tblRow = tblRows[i];
				var tblCells = tblRow.getElementsByTagName("td");	
				tblCells[tblCells.length-1].className = "plaintablecellred";	
			}
		}
	}
	catch(e) {}

	return true;
}

function GetCurrencyCodes(Index)
{
	var dmeObj = new DMEObject(authUser.prodline, "CUCODES");
	dmeObj.out = "JAVASCRIPT";
	dmeObj.field = "currency-code;description";
	dmeObj.max = "600";
	dmeObj.debug = false;
	dmeObj.func = "GetCurrencyCodes_Finished("+Index+")";
	DME(dmeObj,"jsreturn");
}

function GetCurrencyCodes_Finished(Index)
{
	var dmeObj;
	
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		dmeObj = self.jsreturn.record[i];
		Currency[Currency.length] = new CodeDescObject(dmeObj.currency_code,dmeObj.description);
	}

	if (self.jsreturn.Next) {
		self.jsreturn.location.replace(self.jsreturn.Next);
	}	
	else {
		Currency.sort(sortByName);
		GetCertPcodes(Index);
	}
}

function sortByName(obj1, obj2)
{
	var name1 = obj1.description;
	var name2 = obj2.description;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function GetCertPcodes(Index)
{
	GetPcodesSelect(authUser.prodline,"PF;SS","GetMorePcodes("+Index+")","active");
}

function GetMorePcodes(Index)
{
	var PcodesObj = new Object();
	var FieldStr = "CE;AB;KN;OA;SK";

	for (var i=0; i<PcodesInfo.length; i++)
	{
		PcodesObj = PcodesInfo[i];
		if (PcodesObj.type == "PF") {
			Proficiency[Proficiency.length] = PcodesObj;
		}	
		else if (PcodesObj.type == "SS") {
			Source[Source.length] = PcodesObj;
		}
	}

	CalledPcodesInfo = false;
	PcodesInfo = new Array();

	GetCompDetail(Index);
}

function GetCompDetail(Index)
{
	if (ECPV.ReqCompetencies[Index].Type == "CE") {
		CertSelectsLoaded = true;
	}
	else {
		CompSelectsLoaded = true;
	}

	if (NonSpace(ECPV.ReqCompetencies[Index].SeqNbr)==0 || ECPV.ReqCompetencies[Index].SeqNbr <= 0) {

		if (ECPV.ReqCompetencies[Index].Type == "CE") {
		
			if (ECPV.ReqCompetencies[Index].UpdateFlag == "Y") {
				DrawAddDetailContent(Index);
			}
			else {
				var tmpStr = '<div class="fieldlabelboldleft">'
				+ getSeaPhrase("NO_QUAL_RECORD","CR")
				+ '</div>'
				DrawChangeDetailContent(ECPV.ReqCompetencies[Index],tmpStr,Index,false);
			}
		}
		else {
			if (ECPV.ReqCompetencies[Index].UpdateFlag == "Y") {
				// If we don't have any proficiency levels defined via PCODES 
				// don't bother with an additional call to the PACOMPPROF file.
				if (Proficiency.length>0) {
					GetCompProficiencyLevels(ECPV.ReqCompetencies[Index].Type,ECPV.ReqCompetencies[Index].Code,Index,"A");
				}
				else {
					FilteredProficiency = Proficiency;
					DrawAddDetailContent(Index);
				}			
			}
			else {
				var tmpStr = '<div class="fieldlabelboldleft">'
				+ getSeaPhrase("NO_QUAL_RECORD","CR")
				+ '</div>'
				DrawChangeDetailContent(ECPV.ReqCompetencies[Index],tmpStr,Index,false);
			}
		}
		return;
	}
	
	var dmeObj		= new DMEObject(authUser.prodline,"EMPCODES");
	dmeObj.out  		= "JAVASCRIPT";
	dmeObj.index 		= "epcset1";
	dmeObj.field 		= "type;code;description;subject;instructor;in-pro-flag;"
	+ "per-rating;co-sponsored;state;lic-number;date-acquired;renew-date;"
	+ "renewal-code;renewal-code,xlt;skill-source;currency-code;cost;profic-level;date-returned;seq-nbr;"
	+ "skill-source.description;currency.description;subject.description;institution.description";

	dmeObj.key = escape(ECPV.Company)+"="+escapeEx(ECPV.ReqCompetencies[Index].Type)
	+"=0"+"="+escape(ECPV.EmployeeCode)
	+"="+escapeEx(ECPV.ReqCompetencies[Index].Code);

	if ((ECPV.ReqCompetencies[Index].Subject && NonSpace(ECPV.ReqCompetencies[Index].Subject)>0)
	|| (ECPV.ReqCompetencies[Index].SeqNbr && NonSpace(ECPV.ReqCompetencies[Index].SeqNbr)>0))
	{
		if (ECPV.ReqCompetencies[Index].Subject && NonSpace(ECPV.ReqCompetencies[Index].Subject)>0) {
			dmeObj.key += "="+escapeEx(ECPV.ReqCompetencies[Index].Subject);
		}
		else {
			dmeObj.key += "="+escape(" ");
		}
		
		if (ECPV.ReqCompetencies[Index].SeqNbr && NonSpace(ECPV.ReqCompetencies[Index].SeqNbr)>0) {
			dmeObj.key += "="+escape(ECPV.ReqCompetencies[Index].SeqNbr,1);
		}
	}
	
	dmeObj.func = "PaintCompDetailScreen("+Index+")";
	dmeObj.max = "1";
	dmeObj.debug = false;
	DME(dmeObj,"jsreturn");
}

function PaintCompDetailScreen(Index)
{
	if (ECPV.ReqCompetencies[Index].Type == "CE")
	{
		FinishCRT_DetailScreen(Index,false);
	}
	else // "SK", "AB", "KN", "OA"
	{
		if (!self.jsreturn.NbrRecs)
		{
			if (ECPV.ReqCompetencies[Index].UpdateFlag == "Y") {
				// If we don't have any proficiency levels defined via PCODES 
				// don't bother with an additional call to the PACOMPPROF file.
				if (Proficiency.length>0) {
					GetCompProficiencyLevels(ECPV.ReqCompetencies[Index].Type,ECPV.ReqCompetencies[Index].Code,Index,"A");
				}
				else {
					FilteredProficiency = Proficiency;
					DrawAddDetailContent(Index);
				}			
			}
			else {
				var tmpStr = '<div class="fieldlabelboldleft">'
				+ getSeaPhrase("NO_QUAL_RECORDS","CR")
				+ '</div>'
				DrawChangeDetailContent(ECPV.ReqCompetencies[Index],tmpStr,Index,false);
			}
		}
		else
		{
			EmpCodes = self.jsreturn.record[0];
			// If we don't have any proficiency levels defined via PCODES or the display will
			// be read-only, don't bother with an additional call to the PACOMPPROF file.
			if (Proficiency.length>0 && ECPV.ReqCompetencies[Index].UpdateFlag == "Y") {
				GetCompProficiencyLevels(EmpCodes.type,EmpCodes.code,Index,"C");
			}
			else {
				FilteredProficiency = Proficiency;
				FinishCMP_DetailScreen(Index,false);
			}
		}
	}	
}

function GetCompProficiencyLevels(Type, Code, Index, FC)
{
	FilteredProficiency = new Array();

	var dmeObj		= new DMEObject(authUser.prodline,"PACOMPPROF");
		dmeObj.out  	= "JAVASCRIPT";
		dmeObj.index 	= "pcmset1";
		dmeObj.field 	= "type;code;description;proficiency.type;proficiency.code;proficiency.description"
		dmeObj.cond	= "active";
		dmeObj.max	= "600";
		dmeObj.key 	= escape(authUser.company)+"="+escape(" ")+"="+escape(Type,1)+";DF";
		dmeObj.func  	= "FilterProficiencyLevels('"+Code+"',"+Index+",'"+FC+"')";
		// PT 150856.
		//dmeObj.sortasc 	= "proficiency.description";
		dmeObj.debug	= false;
	DME(dmeObj,"jsreturn");
}

// PT 150856.
function sortByProfDescription(obj1,obj2)
{
	var name1 = obj1.proficiency_description;
	var name2 = obj2.proficiency_description;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function FilterProficiencyLevels(Code, Index, FC)
{
	FilteredProficiency = FilteredProficiency.concat(self.jsreturn.record);

	if (self.jsreturn.Next) {
		self.jsreturn.location.replace(self.jsreturn.Next);
	}
	else
	{
		if (FilteredProficiency.length) // Proficiencies are based on competency type and (possibly) code.
		{
			// PT 150856.
			FilteredProficiency.sort(sortByProfDescription);
			
			var DefaultProficiency = new Array();
			var Tmp = new Array();

			for (var i=0; i<FilteredProficiency.length; i++)
			{
				var Desc = FilteredProficiency[i].description || FilteredProficiency[i].proficiency_description;
				if (FilteredProficiency[i].type == "DF")
				{
					DefaultProficiency[DefaultProficiency.length] = new CodeDescObject(FilteredProficiency[i].proficiency_code,
						Desc,FilteredProficiency[i].proficiency_type);
				}

				if (FilteredProficiency[i].code == Code)
				{
					Tmp[Tmp.length] = new CodeDescObject(FilteredProficiency[i].proficiency_code,
						Desc,FilteredProficiency[i].proficiency_type);
				}
			}

			FilteredProficiency = new Array()
			if (Tmp.length) // Proficiencies are based on both competency type and code.
				FilteredProficiency = Tmp
			else if (DefaultProficiency.length) // Proficiencies are based on competency type.
				FilteredProficiency = DefaultProficiency
			else // Proficiencies are not based on competency.
				FilteredProficiency = Proficiency
		}
		else // Proficiencies are not based on competency.
			FilteredProficiency = Proficiency

		if (FC && FC == "A") {
			DrawAddDetailContent(Index);
		}
		else {
			FinishCMP_DetailScreen(Index);
		}
	}
}

function FinishCMP_DetailScreen(Index)
{
	var CompObj = ECPV.ReqCompetencies[Index];
	var CompetencyDesc = "";

	if (CompObj.UpdateFlag != "Y")
	{
		CompetencyDesc = '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
		+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_4","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((CompObj.description)?CompObj.Description:'&nbsp;')+'</td></tr>'
		+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_5","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((MatchForDescription(EmpCodes.profic_level,FilteredProficiency))?MatchForDescription(EmpCodes.profic_level,FilteredProficiency):'&nbsp;')+'</td></tr>'
		+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_6","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.skill_source_description)?EmpCodes.skill_source_description:'&nbsp;')+'</td></tr>'
		+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_7","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.renewal_code_xlt)?EmpCodes.renewal_code_xlt:'&nbsp;')+'</td></tr>'
		+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_8","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.instructor)?EmpCodes.instructor:'&nbsp;')+'</td></tr>'
		+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_9","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.per_rating)?EmpCodes.per_rating:'&nbsp;')+'</td></tr>'
		+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_10","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((formatDME(EmpCodes.date_acquired))?formatDME(EmpCodes.date_acquired):'&nbsp;')+'</td></tr>'
		+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_11","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((formatDME(EmpCodes.renew_date))?formatDME(EmpCodes.renew_date):'&nbsp;')+'</td></tr>'
		+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_12","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((formatDME(EmpCodes.date_returned))?formatDME(EmpCodes.date_returned):'&nbsp;')+'</td></tr>'
		+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_13","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.co_sponsored=="Y")?getSeaPhrase("YES","ESS"):getSeaPhrase("NO","ESS"))+'</td></tr>'
		+ '</table>'
	}
	else
	{
		CompetencyDesc = '<form name="qualificationform">'
		+ '<input type="hidden" name="seqnbr" value="'+EmpCodes.seq_nbr+'">'
		+ '<input type="hidden" name="code" value="'+EmpCodes.code+'">'
		+ '<input type="hidden" name="type" value="'+EmpCodes.type+'">'
		+ '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_4","ESS")+'</td><td class="fieldlabelleft" nowrap>'+CompObj.Description+'</td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_5","ESS")+'</td><td id="proficiency" class="plaintablecelldisplay" nowrap><select class="inputbox" name="proficiency">'+BuildSelect(EmpCodes.profic_level,FilteredProficiency)+'</select></td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_6","ESS")+'</td>'
		
		if (emssObjInstance.emssObj.filterSelect)
		{
			CompetencyDesc += '<td class="plaintablecell" nowrap>'
			+ '<input class="inputbox" type="text" name="skillsource" value="'+EmpCodes.skill_source+'" size="10" maxlength="10" onfocus="this.select()">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'skillsource\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="skillsourceDesc" style="width:190px" class="fieldlabelleft">'+EmpCodes.skill_source_description+'</span>'
			+ '</td></tr>'
		}
		else
		{				
			CompetencyDesc += '<td id="skillsource" class="plaintablecell" nowrap><select class="inputbox" name=skillsource>'+BuildSelect(EmpCodes.skill_source,Source)+'</select></td></tr>'
		}
		
		CompetencyDesc += '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_7","ESS")+'</td><td id="renewalcode" class="plaintablecell" nowrap><select class="inputbox" name="renewalcode">'+BuildRenewalSelect(EmpCodes.renewal_code)+'</select></td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_8","ESS")+'</td><td class="plaintablecell" nowrap><input class="inputbox" type="text" size="10" maxlength="10" name="instructor" value="'+EmpCodes.instructor+'"></td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_9","ESS")+'</td><td class="plaintablecell" nowrap><input class="inputbox" type="text" size="8" maxlength="8" name="perrating" value="'+EmpCodes.per_rating+'"></td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_10","ESS")+'</td><td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type="text" name="dateacquired" value="'+formatDME(EmpCodes.date_acquired)+'" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)">'
		+ '<a href="" onclick="parent.DateSelect(\'dateacquired\');return false" onmouseover="window.status=\''+getSeaPhrase("DISPLAY_CAL","CR").replace(/\'/g,"\\'")+'\';return true"'
		+ ' onmouseout="window.status=\'\';return true">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan()+'</td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_11","ESS")+'</td><td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type="text" name="renewdate" value="'+formatDME(EmpCodes.renew_date)+'" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)">'
		+ '<a href="" onclick="parent.DateSelect(\'renewdate\');return false" onmouseover="window.status=\''+getSeaPhrase("DISPLAY_CAL","CR").replace(/\'/g,"\\'")+'\';return true"'
		+ ' onmouseout="window.status=\'\';return true">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan()+'</td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_12","ESS")+'</td><td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type="text" name="datereturned" value="'+formatDME(EmpCodes.date_returned)+'" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)">'
		+ '<a href="" onclick="parent.DateSelect(\'datereturned\');return false" onmouseover="window.status=\''+getSeaPhrase("DISPLAY_CAL","CR").replace(/\'/g,"\\'")+'\';return true"'
		+ ' onmouseout="window.status=\'\';return true">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan()+'</td></tr>'
		+ '<tr><td class="fieldlabelboldliteunderline">'+getSeaPhrase("QUAL_13","ESS")+'</td><td id="cosponsored" class="plaintablecell" nowrap><select class="inputbox" name="cosponsored">'+BuildYesNo(EmpCodes.co_sponsored)+'</select></td></tr>'
		+ '<tr><td>&nbsp;</td><td class="plaintablecell">'
		+ uiButton(getSeaPhrase("UPDATE","CR"),"parent.UpdateQualification_OnClick("+Index+",\'C\');return false")
		+ uiButton(getSeaPhrase("CANCEL","CR"),"parent.ClearDetailScreen();return false;margin-left:5px")
		+ uiButton(getSeaPhrase("DELETE","CR"),"parent.DeleteQualification_OnClick("+Index+");return false","margin-left:15px")
		+ '</td></tr>'
		+ '</table>'
		+ '</form>'
	}

	DrawChangeDetailContent(CompObj, CompetencyDesc, Index);
}

function FinishCRT_DetailScreen(Index)
{
	var CertObj = ECPV.ReqCompetencies[Index];
	var CertificationDesc = "";

	if (!self.jsreturn.NbrRecs)
	{
		if (CertObj.UpdateFlag == "Y") {
			DrawAddDetailContent(Index);
			return;
		}
		else {
			var CertificationDesc = '<div class="fieldlabelboldleft">'
			+ getSeaPhrase("NO_QUAL_RECORDS","CR")
			+ '</div>'
		}
	}
	else
	{
		EmpCodes = self.jsreturn.record[0];

		if (CertObj.UpdateFlag != "Y")
		{
			CertificationDesc = '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
			+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_4","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((CertObj.Description)?CertObj.Description:'&nbsp;')+'</td></tr>'
			+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_14","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((ReturnStateDescription(EmpCodes.state))?ReturnStateDescription(EmpCodes.state):'&nbsp;')+'</td></tr>'
			+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_15","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.lic_number)?EmpCodes.lic_number:'&nbsp;')+'</td></tr>'
			+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_10","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((formatDME(EmpCodes.date_acquired))?formatDME(EmpCodes.date_acquired):'&nbsp;')+'</td></tr>'
			+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_12","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((formatDME(EmpCodes.renew_date))?formatDME(EmpCodes.renew_date):'&nbsp;')+'</td></tr>'
			+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_7","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.renewal_code_xlt)?EmpCodes.renewal_code_xlt:'&nbsp;')+'</td></tr>'
			+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_6","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.skill_source_description)?EmpCodes.skill_source_description:'&nbsp;')+'</td></tr>'
			+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_13","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.co_sponsored=="Y")?getSeaPhrase("YES","ESS"):getSeaPhrase("NO","ESS"))+'</td></tr>'
			+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("COST","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.cost)?EmpCodes.cost:'&nbsp;')+'</td></tr>'
			+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_16","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.currency_description)?EmpCodes.currency_description:'&nbsp;')+'</td></tr>'
			+ '</table>'
		}
		else
		{
			CertificationDesc = '<form name="qualificationform">'
			+ '<input type="hidden" name="seqnbr" value="'+EmpCodes.seq_nbr+'">'
			+ '<input type="hidden" name="type" value="'+EmpCodes.type+'">'
			+ '<input type="hidden" name="code" value="'+EmpCodes.code+'">'
			+ '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
			+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_4","ESS")+'</td><td class="fieldlabelleft" nowrap>'+CertObj.Description+'</td></tr>'
			+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_14","ESS")+'</td>'
			
			if (emssObjInstance.emssObj.filterSelect)
			{
				CertificationDesc += '<td class="plaintablecell" nowrap>'
				+ '<input class="inputbox" type="text" name="state" value="'+EmpCodes.state+'" size="2" maxlength="2" onfocus="this.select()">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'state\')" style="margin-left:5px">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
				+ '<span id="stateDesc" style="width:190px" class="fieldlabelleft"></span>'
				+ '</td></tr>'
			}
			else
			{			
				CertificationDesc += '<td id="state" class="plaintablecell" nowrap><select class="inputbox" name="state">'+BuildStateSelect(EmpCodes.state)+'</select></td></tr>'
			}
			
			CertificationDesc += '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_15","ESS")+'</td><td class="plaintablecell" nowrap><input class="inputbox" type="text" name="licnumber" size="15" maxlength="20" value="'+EmpCodes.lic_number+'"></td></tr>'
			+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_10","ESS")+'</td><td class="plaintablecell" nowrap>'
			+ '<input class="inputbox" type="text" name="dateacquired" value="'+formatDME(EmpCodes.date_acquired)+'" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)">'
			+ '<a href="" onclick="parent.DateSelect(\'dateacquired\');return false" onmouseover="window.status=\''+getSeaPhrase("DISPLAY_CAL","CR").replace(/\'/g,"\\'")+'\';return true"'
			+ ' onmouseout="window.status=\'\';return true">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan()+'</td></tr>'
			+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_12","ESS")+'</td><td class="plaintablecell" nowrap>'
			+ '<input class="inputbox" type="text" name="renewdate" value="'+formatDME(EmpCodes.renew_date)+'" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)">'
			+ '<a href="" onclick="parent.DateSelect(\'renewdate\');return false" onmouseover="window.status=\''+getSeaPhrase("DISPLAY_CAL","CR").replace(/\'/g,"\\'")+'\';return true"'
			+ ' onmouseout="window.status=\'\';return true">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan()+'</td></tr>'
			+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_7","ESS")+'</td><td id="renewalcode" class="plaintablecell" nowrap><select class="inputbox" name="renewalcode">'+BuildRenewalSelect(EmpCodes.renewal_code)+'</select></td></tr>'
			+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_6","ESS")+'</td>'
			
			if (emssObjInstance.emssObj.filterSelect)
			{
				CertificationDesc += '<td class="plaintablecell" nowrap>'
				+ '<input class="inputbox" type="text" name="skillsource" value="'+EmpCodes.skill_source+'" size="10" maxlength="10" onfocus="this.select()">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'skillsource\')" style="margin-left:5px">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
				+ '<span id="skillsourceDesc" style="width:190px" class="fieldlabelleft">'+EmpCodes.skill_source_description+'</span>'
				+ '</td></tr>'
			}
			else
			{					
				CertificationDesc += '<td id="skillsource" class="plaintablecell" nowrap><select class="inputbox" name="skillsource">'+BuildSelect(EmpCodes.skill_source,Source)+'</select></td></tr>'
			}	
			
			CertificationDesc += '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_13","ESS")+'</td><td id="cosponsored" class="plaintablecell" nowrap><select class="inputbox" name="cosponsored">'+BuildYesNo(EmpCodes.co_sponsored)+'</select></td></tr>'
			+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("COST","ESS")+'</td><td class="plaintablecell" nowrap><input class="inputbox" type="text" size="14" maxlength="14" name="cost" value="'+parseFloat(EmpCodes.cost)+'"></td></tr>'
			+ '<tr><td class="fieldlabelboldliteunderline">'+getSeaPhrase("QUAL_16","ESS")+'</td>'
			
			if (emssObjInstance.emssObj.filterSelect)
			{
				CertificationDesc += '<td class="plaintablecell" nowrap>'
				+ '<input class="inputbox" type="text" name="currencycode" value="'+EmpCodes.currency_code+'" size="5" maxlength="5" onfocus="this.select()">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'currencycode\')" style="margin-left:5px">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
				+ '<span id="currencycodeDesc" style="width:190px" class="fieldlabelleft">'+EmpCodes.currency_description+'</span>'
				+ '</td></tr>'
			}
			else
			{						
				CertificationDesc += '<td id="currencycode" class="plaintablecell" nowrap><select class="inputbox" name="currencycode">'+BuildSelect(EmpCodes.currency_code,Currency)+'</select></td></tr>'
			}
			
			CertificationDesc += '<tr><td>&nbsp;</td><td class="plaintablecell">'
			+ uiButton(getSeaPhrase("UPDATE","CR"),"parent.UpdateQualification_OnClick("+Index+",\'C\');return false")
			+ uiButton(getSeaPhrase("CANCEL","CR"),"parent.ClearDetailScreen();return false","margin-left:5px")
			+ uiButton(getSeaPhrase("DELETE","CR"),"parent.DeleteQualification_OnClick("+Index+");return false","margin-left:15px")
			+ '</td></tr>'
			+ '</table>'
			+ '</form>'
		}
	}

	DrawChangeDetailContent(CertObj, CertificationDesc, Index);
}

function DrawChangeDetailContent(QualObj, DetailContent, Index)
{
	// Draw the detail body content.  This is the individual qualification info.
	var QualificationContent = DetailContent;

	// Draw the detail header content.  This is the "Qualification Detail" label.
	if (ECPV.ReqCompetencies[Index].UpdateFlag == "Y") {	
		self.detail.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DETAIL","CR");
		self.detail.document.getElementById("paneBody").innerHTML = QualificationContent;
		self.detail.stylePage();
		self.detail.setLayerSizes();
		document.getElementById("readonlydetail").style.visibility = "hidden";
		document.getElementById("detail").style.visibility = "visible";		
	}
	else {
		self.readonlydetail.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DETAIL","CR");
		self.readonlydetail.document.getElementById("paneBody").innerHTML = QualificationContent;
		self.readonlydetail.stylePage();
		self.readonlydetail.setLayerSizes(true);
		document.getElementById("detail").style.visibility = "hidden";	
		document.getElementById("readonlydetail").style.visibility = "visible";
	}
	stopProcessing();	
}		

function DrawAddDetailContent(Index)
{
	var QualObj = ECPV.ReqCompetencies[Index];
	var QualificationContent = "";

	if (QualObj.Type == "CE")
	{
		QualificationContent = '<form name="qualificationform">'
		+ '<input type="hidden" size="20" maxlength="30" name="code" value="'+QualObj.Code+'">'
		+ '<input type="hidden" size="10" maxlength="30" name="type" value="'+QualObj.Type+'">'
		+ '<input type="hidden" size="20" maxlength="30" name="qualification" value="'+QualObj.Description+'">'
		+ '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_4","ESS")+'</td><td class="fieldlabelleft" nowrap>'+QualObj.Description+'</td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_14","ESS")+'</td>'
		
		if (emssObjInstance.emssObj.filterSelect)
		{
			QualificationContent += '<td class="plaintablecell" nowrap>'
			+ '<input class="inputbox" type="text" name="state" value="" size="2" maxlength="2" onfocus="this.select()">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'state\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="stateDesc" style="width:190px" class="fieldlabelleft"></span>'
			+ '</td></tr>'
		}
		else
		{		
			QualificationContent += '<td id="state" class="plaintablecell" nowrap><select class="inputbox" name="state">'+BuildStateSelect("")+'</select></td></tr>'
		}
		
		QualificationContent += '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_15","ESS")+'</td><td class="plaintablecell" nowrap><input class="inputbox" type=text name="licnumber" size="15" maxlength="20" value=""></td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_10","ESS")+'</td><td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type="text" name="dateacquired" value="" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)">'
		+ '<a href="" onclick="parent.DateSelect(\'dateacquired\');return false" onmouseover="window.status=\''+getSeaPhrase("DISPLAY_CAL","CR").replace(/\'/g,"\\'")+'\';return true"'
		+ ' onmouseout="window.status=\'\';return true">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan()+'</td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_12","ESS")+'</td><td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type="text" name="renewdate" value="" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)">'
		+ '<a href="" onclick="parent.DateSelect(\'renewdate\');return false" onmouseover="window.status=\''+getSeaPhrase("DISPLAY_CAL","CR").replace(/\'/g,"\\'")+'\';return true"'
		+ ' onmouseout="window.status=\'\';return true">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan()+'</td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_7","ESS")+'</td><td id="renewalcode" class="plaintablecell" nowrap><select class="inputbox" name="renewalcode">'+BuildRenewalSelect("")+'</select></td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_6","ESS")+'</td>'

		if (emssObjInstance.emssObj.filterSelect)
		{
			QualificationContent += '<td class="plaintablecell" nowrap>'
			+ '<input class="inputbox" type="text" name="skillsource" value="" size="10" maxlength="10" onfocus="this.select()">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'skillsource\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="skillsourceDesc" style="width:190px" class="fieldlabelleft"></span>'
			+ '</td></tr>'
		}
		else
		{		
			QualificationContent += '<td id="skillsource" class="plaintablecell" nowrap><select class="inputbox" name="skillsource">'+BuildSelect("",Source)+'</select></td></tr>'
		}
		
		QualificationContent += '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_13","ESS")+'</td><td id="cosponsored" class="plaintablecell" nowrap><select class="inputbox" name="cosponsored">'+BuildYesNo("")+'</select></td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("COST","ESS")+'</td><td class="plaintablecell" nowrap><input class="inputbox" type="text" size="14" maxlength="14" name="cost" value=""></td></tr>'
		+ '<tr><td class="fieldlabelboldliteunderline">'+getSeaPhrase("QUAL_16","ESS")+'</td>'
		
		if (emssObjInstance.emssObj.filterSelect)
		{
			QualificationContent += '<td class="plaintablecell" nowrap>'
			+ '<input class="inputbox" type="text" name="currencycode" value="" size="5" maxlength="5" onfocus="this.select()">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'currencycode\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="currencycodeDesc" style="width:190px" class="fieldlabelleft"></span>'
			+ '</td></tr>'
		}
		else
		{				
			QualificationContent += '<td id="currencycode" class="plaintablecell" nowrap><select class="inputbox" name="currencycode">'+BuildSelect("",Currency)+'</select></td></tr>'
		}
	}
	else
	{
		// Draw the detail body content.  This is the table of employee qualifications.
		QualificationContent = '<form name="qualificationform">'
		+ '<input type="hidden" size="20" maxlength="30" name="code" value="'+QualObj.Code+'">'
		+ '<input type="hidden" size="10" maxlength="30" name="type" value="'+QualObj.Type+'">'
		+ '<input type="hidden" size="20" maxlength="30" name="qualification" value="'+QualObj.Description+'">'
		+ '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_4","ESS")+'</td><td class="plaintablecelldisplay" nowrap>'+QualObj.Description+'</td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_5","ESS")+'</td><td id="proficiency" class="plaintablecell" nowrap><select class="inputbox" name="proficiency">'+BuildSelect("",Proficiency)+'</select></td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_6","ESS")+'</td>'
		
		if (emssObjInstance.emssObj.filterSelect)
		{
			QualificationContent += '<td class="plaintablecell" nowrap>'
			+ '<input class="inputbox" type="text" name="skillsource" value="" size="10" maxlength="10" onfocus="this.select()">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'skillsource\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="skillsourceDesc" style="width:190px" class="fieldlabelleft"></span>'
			+ '</td></tr>'
		}
		else
		{		
			QualificationContent += '<td id="skillsource" class="plaintablecell" nowrap><select class="inputbox" name="skillsource">'+BuildSelect("",Source)+'</select></td></tr>'
		}
		
		QualificationContent += '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_7","ESS")+'</td><td id="renewalcode" class="plaintablecell" nowrap><select class="inputbox" name="renewalcode">'+BuildRenewalSelect("")+'</select></td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_8","ESS")+'</td><td class="plaintablecell" nowrap><input class="inputbox" type="text" size="10" maxlength="10" name="instructor" value=""></td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_9","ESS")+'</td><td class="plaintablecell" nowrap><input class="inputbox" type="text" size="8" maxlength="8" name="perrating" value=""></td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_10","ESS")+'</td><td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type="text" name="dateacquired" value="" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)">'
		+ '<a href="" onclick="parent.DateSelect(\'dateacquired\');return false" onmouseover="window.status=\''+getSeaPhrase("DISPLAY_CAL","CR").replace(/\'/g,"\\'")+'\';return true"'
		+ ' onmouseout="window.status=\'\';return true">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan()+'</td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_11","ESS")+'</td><td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type="text" name="renewdate" value="" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)">'
		+ '<a href="" onclick="parent.DateSelect(\'renewdate\');return false" onmouseover="window.status=\''+getSeaPhrase("DISPLAY_CAL","CR").replace(/\'/g,"\\'")+'\';return true"'
		+ ' onmouseout="window.status=\'\';return true">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan()+'</td></tr>'
		+ '<tr><td class="fieldlabelboldlite">'+getSeaPhrase("QUAL_12","ESS")+'</td><td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type="text" name="datereturned" value="" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)">'
		+ '<a href="" onclick="parent.DateSelect(\'datereturned\');return false" onmouseover="window.status=\''+getSeaPhrase("DISPLAY_CAL","CR").replace(/\'/g,"\\'")+'\';return true"'
		+ ' onmouseout="window.status=\'\';return true">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan()+'</td></tr>'
		+ '<tr><td class="fieldlabelboldliteunderline">'+getSeaPhrase("QUAL_13","ESS")+'</td><td id="cosponsored" class="plaintablecell" nowrap><select class="inputbox" name="cosponsored">'+BuildYesNo("")+'</select></td></tr>'
	}

	if (QualificationContent != "")
	{
		// Draw the list footer content.  This is the Update Qualification button.
		QualificationContent += '<tr><td>&nbsp;</td><td class="plaintablecell">'
		+ uiButton(getSeaPhrase("UPDATE","CR"),"parent.UpdateQualification_OnClick("+Index+",\'A\');return false")
		+ uiButton(getSeaPhrase("CANCEL","CR"),"parent.ClearDetailScreen();return false","margin-left:5px")
		+ '</td></tr></table></form>'
	}

	// Draw the detail header content.  This is the "Qualification Detail" label.
	self.detail.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DETAIL","CR");
	self.detail.document.getElementById("paneBody").innerHTML = QualificationContent;
	self.detail.stylePage();
	self.detail.setLayerSizes();

	document.getElementById("readonlydetail").style.visibility = "hidden";
	document.getElementById("detail").style.visibility = "visible";
	stopProcessing();	
}

function UpdateQualification_OnClick(Index, fc)
{
	var qualDoc = self.detail.document;
	var qualForm = self.detail.document.qualificationform;

	// Edit the form for any required fields before passing it to the server.
	clearRequiredField(qualForm.dateacquired);
	clearRequiredField(qualForm.renewdate);
	if(typeof(qualForm.datereturned) != "undefined")
		clearRequiredField(qualForm.datereturned);

	if (fc != "A") // Edits for "Update" screen
	{
		clearRequiredField(qualForm.code);
			
		if (NonSpace(qualForm.code.value) == 0)
		{
			setRequiredField(qualForm.code);
			seaAlert(getSeaPhrase("QUAL_33","ESS"));
			qualForm.code.focus();
			return;
		}
	}

	if (NonSpace(qualForm.dateacquired.value) && !ValidDate(qualForm.dateacquired))
	{
		setRequiredField(qualForm.dateacquired);
		return;
	}

	if (NonSpace(qualForm.renewdate.value) && !ValidDate(qualForm.renewdate))
	{
		setRequiredField(qualForm.renewdate);
		return;
	}

	if (typeof(qualForm.datereturned) != "undefined" && NonSpace(qualForm.datereturned.value)
	&& !ValidDate(qualForm.datereturned))
	{
		setRequiredField(qualForm.datereturned);
		return;
	}

	switch (ECPV.ReqCompetencies[Index].Type)
	{
		case "CE": Do_Crt_Call(qualForm, "PA22.1", fc, "form", ECPV.EmployeeCode, false, ECPV.Manager); break; // Update this certification record.
		default: Do_Cmp_Call(qualForm, "PA21.1", fc, "form", ECPV.EmployeeCode); break; // Update this competency record.
	}
}

function DeleteQualification_OnClick(Index)
{
	var qualForm = self.detail.document.qualificationform;

	switch (ECPV.ReqCompetencies[Index].Type)
	{
		case "CE": Do_Crt_Call(qualForm, "PA22.1", "D", "form", ECPV.EmployeeCode, false, ECPV.Manager); break; // Delete this certification record.
		default: Do_Cmp_Call(qualForm, "PA21.1", "D", "form", ECPV.EmployeeCode); break; // Delete this competency record.
	}
}

function ClearDetailScreen()
{
	document.getElementById("detail").style.visibility = "hidden";
	deactivateTableRows("reqcompTbl",self.required,false,false);
}

function Do_PA22_1_Crt_Call_Finished(fc)
{
	ReturnToListScreen(fc);
}

function Do_PA21_1_Cmp_Call_Finished(fc)
{
	ReturnToListScreen(fc);
}

function ReturnToListScreen(fc)
{
	stopProcessing();
	if (self.lawheader.gmsgnbr == "000")
	{
		document.getElementById("detail").style.visibility = "hidden";
		if (fromTask && fromTask.indexOf("employee") != -1)
		{
			employeeNbr = getVarFromString("employee",fromTask);
		}
		else
		{
			employeeNbr = authUser.employee;
		}
		EmployeeCompetencyProfile(authUser.company, employeeNbr, ECPV.Manager, true, -1);	
	}
	else
	{
		seaAlert(self.lawheader.gmsg);
	}
}

function ReturnDate(dte)
{
	try {
		self.detail.document.forms["qualificationform"].elements[date_fld_name].value = dte;
	}
	catch(e) {}
}

/* Filter Select logic - start */
function performDmeFieldFilterOnChange(dmeFilter)
{
	switch (dmeFilter.getFieldNm().toLowerCase())
	{
		case "state": // state/province
		case "province":
			var filterForm = dmeFilter.getFilterForm();
			var selObj = filterForm.elements["filterField"];
			var filterField = selObj.options[selObj.selectedIndex].value;
			if ((filterField == "state") || (filterField == "province")) {

				stateProvFilter = filterField;
				filterForm.elements["filterBtn"].onclick();
			}
		break;
	}
}

function performDmeFieldFilterOnLoad(dmeFilter)
{
	switch (dmeFilter.getFieldNm().toLowerCase())
	{
		case "skillsource":
			dmeFilter.addFilterField("code", 10, getSeaPhrase("QUAL_6","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes",
				"pcoset1",
				"code;description",
				"SS",
				"active",
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;
		case "state":
			dmeFilter.addFilterField("state", 2, getSeaPhrase("STATE_ONLY","ESS"), true);
			dmeFilter.addFilterField("province", 2, getSeaPhrase("PROVINCE","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prstate",
				"psaset1",
				"state;description",
				"",
				null,
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;
		case "currencycode":
			dmeFilter.addFilterField("currency-code", 5, getSeaPhrase("QUAL_16","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"cucodes",
				"cucset1",
				"currency-code;description",
				"",
				null,
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
		case "skillsource":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes",
			"pcoset1",
			"code;description",
			"SS",
			"active",
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;
		case "state":
		if (stateProvFilter == "state") {
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prstate",
				"psaset1",
				"state;description",
				"",
				null,
				dmeFilter.getSelectStr(),
				dmeFilter.getNbrRecords(),
				null);
		} else {
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prprovince",
				"ppvset1",
				"province;description",
				"",
				null,
				dmeFilter.getSelectStr(),
				dmeFilter.getNbrRecords(),
				null);
		}
		break;
		case "currencycode":
			dmeFilter.addFilterField("currency-code", 5, getSeaPhrase("QUAL_16","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"cucodes",
				"cucset1",
				"currency-code;description",
				"",
				null,
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
	var qualDoc = self.detail.document;
	var qualForm = qualDoc.qualificationform;

	switch(fieldNm.toLowerCase())
	{
		case "skillsource":
			qualForm.skillsource.value = selRec.code;
			qualDoc.getElementById("skillsourceDesc").innerHTML = selRec.description;
			break;
		case "state":
			if (stateProvFilter == "state") {
				qualForm.state.value = selRec.state;
			} else {
				qualForm.state.value = selRec.province;
			}
			qualDoc.getElementById("stateDesc").innerHTML = selRec.description;
			break;
		case "currencycode":
			qualForm.currencycode.value = selRec.currency_code;
			qualDoc.getElementById("currencycodeDesc").innerHTML = selRec.description;
			break;
		default:
			break;
	}
	try
	{
		filterWin.close();
	} catch(e) {}
}

function getDmeFieldElement(fieldNm)
{
	var qualDoc = self.detail.document;
	var qualForm = qualDoc.qualificationform;
	var fld = [null, null];
	switch(fieldNm.toLowerCase())
	{
		case "skillsource":
			fld = [self.detail, qualForm.skillsource];
			break;
		case "state":
			fld = [self.detail, qualForm.state];
			break;
		case "currencycode":
			fld = [self.detail, qualForm.currencycode];
			break;
		default:
			break;
	}
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
		case "skillsource":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
			selectHtml[0] += '<tr><th style="width:50%">'+getSeaPhrase("QUAL_6","ESS")+'</th>'
			selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

			for (var i=0; i<nbrDmeRecs; i++)
			{
				tmpObj = dmeRecs[i];
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.code) ? tmpObj.code : '&nbsp;'
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
		case "state":
			if (stateProvFilter == "state") {
				var tmpObj;
				selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
				selectHtml[0] += '<tr><th style="width:50%">'+getSeaPhrase("STATE_ONLY","ESS")+'</th>'
				selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

				for (var i=0; i<nbrDmeRecs; i++)
				{
					tmpObj = dmeRecs[i];
					selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
					selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
					selectHtml[i+1] += (tmpObj.state) ? tmpObj.state : '&nbsp;'
					selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
					selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
					selectHtml[i+1] += '</td></tr>'
				}
			} else {
				var tmpObj;
				selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px">'
				selectHtml[0] += '<tr><th style="width:50%">'+getSeaPhrase("PROVINCE","ESS")+'</th>'
				selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

				for (var i=0; i<nbrDmeRecs; i++)
				{
					tmpObj = dmeRecs[i];
					selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
					selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
					selectHtml[i+1] += (tmpObj.province) ? tmpObj.province : '&nbsp;'
					selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
					selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
					selectHtml[i+1] += '</td></tr>'
				}
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
		case "currencycode":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
			selectHtml[0] += '<tr><th style="width:50%">'+getSeaPhrase("QUAL_16","ESS")+'</th>'
			selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

			for (var i=0; i<nbrDmeRecs; i++)
			{
				tmpObj = dmeRecs[i];
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.currency_code) ? tmpObj.currency_code : '&nbsp;'
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
	stopProcessing();
}

/* Filter Select logic - end */

function startProcessing(msg)
{
	try
	{
		// if this task has been launched as a related link, show processing message in parent
		if (typeof(parent.showWaitAlert) == "function")
			parent.showWaitAlert(msg);
		else if (typeof(parent.parent.showWaitAlert) == "function")
			parent.parent.showWaitAlert(msg);
	}	
	catch(e) {}
}

function stopProcessing()
{
	try
	{
		if (typeof(removeWaitAlert) == "function")
			removeWaitAlert();
		// if this task has been launched as a related link, remove any processing message
		if (typeof(parent.removeWaitAlert) == "function")
			parent.removeWaitAlert();
		if (typeof(parent.parent.removeWaitAlert) == "function")
			parent.parent.removeWaitAlert();
	}
	catch(e) {}		
}
