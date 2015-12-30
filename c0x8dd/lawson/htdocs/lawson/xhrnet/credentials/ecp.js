// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/credentials/ecp.js,v 1.13.2.64.2.1 2014/03/03 22:02:30 brentd Exp $
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
var ECPV;
var stateProvFilter = "state";
var sortProperty;
var lastEcpSortField = null;

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
		else
			self.lawheader.index = Index-1;
		ECPV.Manager = Manager;
		agsCall = new AGSObject(authUser.prodline,"HS11.1");
		agsCall.event = "CHANGE";
		agsCall.rtn	= "DATA";
		agsCall.longNames = true;
		agsCall.tds	= false;
		agsCall.field = "FC=I";
		agsCall.field += "&EPC-COMPANY="+escape(Company);
		agsCall.field += "&EPC-EMPLOYEE="+escape(Employee);
		agsCall.field += "&REQUESTOR="+((Manager)?"3":"2");
		agsCall.func = "parent.ReturnAgsCall('"+Company+"','"+Employee+"','"+Manager+"',"+Refresh+")";
		agsCall.out	= "JAVASCRIPT";
		agsCall.debug = false;
		AGS(agsCall,"jsreturn");
	}
}

function ReturnAgsCall(Company, Employee, Manager, Refresh)
{
	if (self.lawheader.gmsgnbr != "000") 
	{
		stopProcessing();	
		seaAlert(self.lawheader.gmsg, null, null, "error");
	}	
	else
		OpenECPVWindow(Refresh);
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
	if (ECPV.WorkRestrictorIndicator && NonSpace(ECPV.WorkRestrictorIndicator) > 0)
		WorkRestrictionsProfile(ECPV.Company, ECPV.EmployeeCode, ECPV.SystemDate, ECPV.EmployeeName);
	else 
	{
		strHtml = '<div class="fieldlabelboldleft">'+getSeaPhrase("NO_WORK_RESTRICTIONS","CR")+'</div>'
		try 
		{
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
	strHtml = '<table border="0" cellspacing="0" cellpadding="0" style="width:100%" summary="'+getSeaPhrase("TSUM_5","CR")+'">'
	strHtml += '<caption class="offscreen">'+getSeaPhrase("TCAP_4","CR")+'</caption>'
	strHtml += '<tr><th scope="col" colspan="2"></th></tr>'
	if ((ECPV.OverdueReviewIndicator && NonSpace(ECPV.OverdueReviewIndicator)>0) || (ECPV.OverduePhysicalIndicator && NonSpace(ECPV.OverduePhysicalIndicator)>0))
	{
		strHtml += '<tr><th scope="row" class="plaintablerowheader" style="width:46%" nowrap><div style="display:block;text-align:left;font-weight:normal">'
		+ getSeaPhrase("OVERDUE","CR")+uiRequiredIcon(getSeaPhrase("OVERDUE","CR"))+'</div></th>'
		+ '<td class="plaintablecelldisplay" style="width:54%" nowrap>&nbsp;</td></tr>'
	}		
	strHtml += '<tr><th scope="row" class="plaintablerowheader" style="width:46%">'+getSeaPhrase("DEPARTMENT","CR")+'</th>'
	+ '<td class="plaintablecelldisplay" style="width:54%" nowrap>'+((ECPV.DepartmentName && NonSpace(ECPV.DepartmentName)>0)?ECPV.DepartmentName:'&nbsp;')+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader" style="width:46%">'+getSeaPhrase("JOB","CR")+'</th>'
	+ '<td class="plaintablecelldisplay" style="width:54%" nowrap>'+((ECPV.JobCodeDescription && NonSpace(ECPV.JobCodeDescription)>0)?ECPV.JobCodeDescription:'&nbsp;')+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader" style="width:46%">'+getSeaPhrase("JOB_DATE","CR")+'</th>'
	+ '<td class="plaintablecelldisplay" style="width:54%" nowrap>'+((ECPV.BeginningDateJob && NonSpace(ECPV.BeginningDateJob)>0)?FormatDte4(ECPV.BeginningDateJob):'&nbsp;')+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader" style="width:46%">'+getSeaPhrase("POSITION_DATE","CR")+'</th>'
	+ '<td class="plaintablecelldisplay" style="width:54%" nowrap>'+((ECPV.BeginningDatePosition && NonSpace(ECPV.BeginningDatePosition)>0)?FormatDte4(ECPV.BeginningDatePosition):'&nbsp;')+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader" style="width:46%">'+getSeaPhrase("HIRE_DATE","CR")+'</th>'
	+ '<td class="plaintablecelldisplay" style="width:54%" nowrap>'+((ECPV.DateHired && NonSpace(ECPV.DateHired)>0)?FormatDte4(ECPV.DateHired):'&nbsp;')+'</td></tr>'	
	+ '<tr><th scope="row" class="plaintablerowheader" style="width:46%">'+getSeaPhrase("LAST_REVIEW","CR")+'</th>'
	+ '<td class="plaintablecelldisplay" style="width:54%" nowrap>'+((ECPV.ActualDate && NonSpace(ECPV.ActualDate)>0)?FormatDte4(ECPV.ActualDate):'&nbsp;')+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader" style="width:46%">'+getSeaPhrase("NEXT_REVIEW","CR")+'</th>'
	if (ECPV.OverdueReviewIndicator && NonSpace(ECPV.OverdueReviewIndicator) > 0)
		strHtml += '<td class="plaintablecellred" style="width:54%" nowrap>'+((ECPV.NextReview && NonSpace(ECPV.NextReview)>0)?FormatDte4(ECPV.NextReview):'&nbsp;')+uiRequiredIcon(getSeaPhrase("OVERDUE","CR"))+'</td></tr>'
	else
		strHtml += '<td class="plaintablecelldisplay" style="width:54%" nowrap>'+((ECPV.NextReview && NonSpace(ECPV.NextReview)>0)?FormatDte4(ECPV.NextReview):'&nbsp;')+'</td></tr>'
	strHtml += '<tr><th scope="row" class="plaintablerowheaderborder" style="width:46%">'+getSeaPhrase("NEXT_PHYSICAL","CR")+'</th>'
	if (ECPV.OverduePhysicalIndicator && NonSpace(ECPV.OverduePhysicalIndicator) > 0)
		strHtml += '<td class="plaintablecellred" style="width:54%" nowrap>'+((ECPV.NextPhysical && NonSpace(ECPV.NextPhysical)>0)?FormatDte4(ECPV.NextPhysical):'&nbsp;')+uiRequiredIcon(getSeaPhrase("OVERDUE","CR"))+'</td></tr>'
	else
		strHtml += '<td class="plaintablecelldisplay" style="width:54%" nowrap>'+((ECPV.NextPhysical && NonSpace(ECPV.NextPhysical)>0)?FormatDte4(ECPV.NextPhysical):'&nbsp;')+'</td></tr>'
	strHtml += '</table>';
	try 
	{
		if (ECPV.Manager)
			self.summary.document.getElementById("paneHeader").innerHTML = getSeaPhrase("SUMMARY","CR")+' - '+ECPV.EmployeeName;
		else
			self.summary.document.getElementById("paneHeader").innerHTML = getSeaPhrase("SUMMARY","CR");
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
	if (ECPV.ComTransactionLimit == "Y")
		seaAlert(getSeaPhrase("CR_69","CR"), null, null, "alert");	
	if (fromTask && ECPV.Manager) 
	{	
		var tmpStr = '<div class="floatRight"><table border="0" cellspacing="0" cellpadding="0" style="background-color:transparent" role="presentation"><tr>';
		try 
		{
			// Only display the select box if there is more than one employee available for selection
			if (parent.parent.DRPV.DirectReports.length > 1)
				tmpStr += '<td class="plaintablecellright" style="width:auto;background-color:transparent" nowrap>'+BuildReportSelect(employeeNbr)+'</td>';
		}
		catch(e) {}
		if (navigator.appName.indexOf("Microsoft") >= 0) 
		{
			tmpStr += '<td class="plaintablecellright" style="padding-right:0px;background-color:transparent" nowrap>'
			+ uiButton(getSeaPhrase("BACK","CR"),"CloseEmployeeProfile();return false","margin-right:0px")+'</td>';
		}
		else 
		{
			tmpStr += '<td class="plaintablecellright" style="background-color:transparent" nowrap>'
			+ uiButton(getSeaPhrase("BACK","CR"),"CloseEmployeeProfile();return false")+'</td>';	
		}
		tmpStr += '</tr></table>';
		document.getElementById("navarea").innerHTML = tmpStr;
		stylePage();
		document.getElementById("navarea").style.visibility = "visible";
	}
	var msg = getSeaPhrase("CNT_UPD_FRM","SEA",[getWinTitle()])+' '+getSeaPhrase("CNT_UPD_FRM","SEA",[self.summary.getWinTitle()])+' '+getSeaPhrase("CNT_UPD_FRM","SEA",[getSeaPhrase("CR_6","CR")])
	+' '+getSeaPhrase("CNT_UPD_FRM","SEA",[getSeaPhrase("WORK_RESTRICTIONS","CR")]);
	stopProcessing(msg);
	if (Refresh)
		seaPageMessage(getSeaPhrase("UPDATE_COMPLETE","CR"), null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);	
	fitToScreen();	
}

function BuildReportSelect(empNbr)
{
	var strBuffer = new Array();
	strBuffer[0] = '<label class="offscreen" for="reports">'+getSeaPhrase("SELECT_DIRECT_REPORT","ESS")+'</label>';
	strBuffer[0] += '<select class="inputbox" id="reports" name="reports" onchange="RefreshCompProfile(this.options[this.selectedIndex].value)">';
	try 
	{		
		var Reports = parent.parent.DRPV.DirectReports;
		var len = Reports.length;
		for (var i=0; i<len; i++)
			strBuffer[i+1] = '<option value="'+Reports[i].Employee+'"'+((empNbr==Reports[i].Employee)?' selected':'')+'>'+Reports[i].LabelName;
	}
	catch(e) 
	{
		return "";
	}
	strBuffer[strBuffer.length] = '</select>';
	return strBuffer.join("");
}

function RefreshCompProfile(empNbr)
{
	// Hide the detail frame, if it is visible.
	ClearDetailScreen();
	employeeNbr = empNbr;
	var nextFunc = function(){EmployeeCompetencyProfile(authUser.company, empNbr, true, false, -1);};
	startProcessing(getSeaPhrase("WAIT","CR"), nextFunc);
}

function CloseEmployeeProfile()
{
	try { document.getElementById("navarea").style.visibility = "hidden"; } catch(e) {}
	// if task is launched from ecpmain.htm as a sub task	
	try { parent.parent.document.getElementById("subtask").style.visibility = "hidden"; } catch(e) {}
	try { parent.parent.document.getElementById("navarea").style.visibility = "visible"; } catch(e) {}	
	try { parent.parent.document.getElementById("header").style.visibility = "visible"; } catch(e) {}
	try { parent.parent.document.getElementById("main").style.visibility = "visible"; } catch(e) {}
	// if task is run standalone
	try { parent.document.getElementById("subtask").style.visibility = "hidden"; } catch(e) {}
	try { parent.document.getElementById("navarea").style.visibility = "visible"; } catch(e) {}	
	try { parent.document.getElementById("header").style.visibility = "visible"; } catch(e) {}
	try { parent.document.getElementById("main").style.visibility = "visible"; } catch(e) {}	
}

function PaintRequiredCompetencies(onsort, sortIndex, sortDir)
{
	sortDir = sortDir || "ascending";
	var nextSortDir = (sortDir == "ascending") ? "descending" : "ascending";	
	var strHtml;
	var overdueRecs = false;
	if (typeof(ECPV.ReqCompetencies) != "undefined" && ECPV.ReqCompetencies.length > 0 && ECPV.JobCompFlag == "Y") 
	{
		var toolTip = getSeaPhrase("SORT_BY_COMPETENCY","CR");
		strHtml = '<table id="reqcompTbl" class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_6","CR")+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("CR_6","CR")+'</caption>'
		+ '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center;width:50%" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
		+ '<a class="columnsort" href="javascript:;" onclick="parent.SortCompetencyArray(1,\''+nextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("COMPETENCY","CR")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
		+ '<th scope="col" class="plaintableheaderborder" style="text-align:center;width:25%" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
		toolTip = getSeaPhrase("SORT_BY_ACQUIRED_DATE","CR");
		strHtml += '<a class="columnsort" href="javascript:;" onclick="parent.SortCompetencyArray(2,\''+nextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("ACQUIRED","CR")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
		toolTip = getSeaPhrase("SORT_BY_RENEW_DATE","CR");
		strHtml += '<th scope="col" class="plaintableheaderborder" style="text-align:center;width:25%" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
		+ '<a class="columnsort" href="javascript:;" onclick="parent.SortCompetencyArray(3,\''+nextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("RENEW_BY","CR")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th></tr>';
		for (var i=0; i<ECPV.ReqCompetencies.length; i++)
		{
			toolTip = ECPV.ReqCompetencies[i].Description+' - '+getSeaPhrase("EDIT_DTL_FOR","SEA");
			strHtml += '<tr><td class="plaintablecelldisplay" style="width:50%" nowrap>'
			+ '<a href="javascript:;" onclick="parent.ChangeClicked('+i+');return false" title="'+toolTip+'">'
			+ ((ECPV.ReqCompetencies[i].Description && NonSpace(ECPV.ReqCompetencies[i].Description)>0)?ECPV.ReqCompetencies[i].Description:'&nbsp;')
			+ '<span class="offscreen"> - '+getSeaPhrase("EDIT_DTL_FOR","SEA")+'</span></a></td><td class="plaintablecelldisplay" style="width:25%;text-align:center" nowrap>'
			+ ((ECPV.ReqCompetencies[i].Acquired && NonSpace(ECPV.ReqCompetencies[i].Acquired) > 0)?FormatDte4(ECPV.ReqCompetencies[i].Acquired):'&nbsp;')+'</td>'
			if (ECPV.ReqCompetencies[i].OverdueInd && NonSpace(ECPV.ReqCompetencies[i].OverdueInd) > 0) 
			{	
				overdueRecs = true;
				strHtml += '<td class="plaintablecellred" style="width:25%;text-align:center" nowrap><span class="plaintablecellred">'
				+ ((ECPV.ReqCompetencies[i].RenewDate && NonSpace(ECPV.ReqCompetencies[i].RenewDate)>0)?FormatDte4(ECPV.ReqCompetencies[i].RenewDate):'&nbsp;')+uiRequiredIcon(getSeaPhrase("OVERDUE","CR"))+'</span></td>';
			}
			else 
			{
				strHtml += '<td class="plaintablecelldisplay" style="width:25%;text-align:center" nowrap>'			
				+ ((ECPV.ReqCompetencies[i].RenewDate && NonSpace(ECPV.ReqCompetencies[i].RenewDate)>0)?FormatDte4(ECPV.ReqCompetencies[i].RenewDate):'&nbsp;')+'</td>';
			}
			strHtml += '</tr>';
		}
		if (overdueRecs) 
		{
			strHtml += '<tr><td class="plaintablecellredright" colspan="3" style="padding-top:5px" nowrap>'
			+ '<span class="plaintablecellred" style="white-space:nowrap">'+getSeaPhrase("OVERDUE","CR")+uiRequiredIcon(getSeaPhrase("OVERDUE","CR"))+'</span></td></tr>'		
		}
		strHtml += '</table>';
	}
	else
		strHtml = '<div class="fieldlabelboldleft">'+getSeaPhrase("NO_REQ_COMPS","CR")+'</div>'
	try 
	{
		self.required.document.getElementById("paneHeader").innerHTML = getSeaPhrase("CR_6","CR");
		self.required.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}
	self.required.stylePage();
	if (!onsort) 
	{
		self.required.setLayerSizes();
		document.getElementById("required").style.visibility = "visible";
	} 
	else
	{	
		self.required.styleSortArrow("reqcompTbl", sortIndex, sortDir);
		stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[self.required.getWinTitle()]));
	}	
}

function WorkRestrictionsDone()
{
	var strHtml = (WRAV && WRAV.WRAVHtml) ? WRAV.WRAVHtml : '';	
	try 
	{
		self.restrictions.document.getElementById("paneHeader").innerHTML = getSeaPhrase("WORK_RESTRICTIONS","CR");
		self.restrictions.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}
	self.restrictions.stylePage();
	self.restrictions.setLayerSizes();
	document.getElementById("restrictions").style.visibility = "visible";
}

function sortByAscProperty(obj1, obj2)
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

function sortByDscProperty(obj1, obj2)
{
	var name1 = obj1[sortProperty];
	var name2 = obj2[sortProperty];
	if (name1 > name2)
		return -1;
	else if (name1 < name2)
		return 1;
	else
		return 0;
}

function SortCompetencyArray(Index, dir)
{
	var nextFunc = function()
	{
		if (Index == 1)
			sortProperty = "Description";
		else if (Index == 2)
			sortProperty = "Acquired";
		else if (Index == 3)
			sortProperty = "RenewDate";
		if (Index == 1 || Index == 2 || Index == 3)
		{	
			if (sortProperty != lastEcpSortField)
				dir = "ascending";
			lastEcpSortField = sortProperty;
			var sortFunc = (dir == "ascending") ? sortByAscProperty : sortByDscProperty;
			ECPV.ReqCompetencies.sort(sortFunc);
		}
		PaintRequiredCompetencies(true, Index, dir);
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function ChangeClicked(Index)
{
	var nextFunc = function()
	{
		activateTableRow("reqcompTbl",Index,self.required,false,false);	
		if (emssObjInstance.emssObj.filterSelect)
		{	
			if (ECPV.ReqCompetencies[Index].Type != "CE" && !CompSelectsLoaded)
				GetPcodesSelect(authUser.prodline,"PF","StoreProficiencies("+Index+")","active");
			else
				GetCompDetail(Index);
		}
		else
		{
			if (ECPV.ReqCompetencies[Index].Type == "CE" && !CertSelectsLoaded) 
			{
				if (ECPV.Manager && (parent.CalledGrabStates || pStateProvince.length>0)) 
				{
					pStateProvince = parent.pStateProvince;
					GetCurrencyCodes(Index);
				}
				else
					GrabStates("GetCurrencyCodes("+Index+")");
			}
			else if (!CompSelectsLoaded && !CertSelectsLoaded)
				GetPcodesSelect(authUser.prodline,"PF;SS","GetMorePcodes("+Index+")","active");
			else
				GetCompDetail(Index);
		}	
	};
	startProcessing(getSeaPhrase("CR_9","CR"), nextFunc);
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
	try 
	{
		if (ECPV.ReqCompetencies[rowNbr-1].OverdueInd && NonSpace(ECPV.ReqCompetencies[rowNbr-1].OverdueInd)>0) 
		{
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
	try 
	{
		if (ECPV.ReqCompetencies[rowNbr-1].OverdueInd && NonSpace(ECPV.ReqCompetencies[rowNbr-1].OverdueInd)>0) 
		{
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
	try 
	{
		var tblObj = self.required.document.getElementById("reqcompTbl");	
		tblRows = tblObj.getElementsByTagName("tr");
		for (var i=1; i<tblRows.length; i++) 
		{
			if (ECPV.ReqCompetencies[i-1].OverdueInd && NonSpace(ECPV.ReqCompetencies[i-1].OverdueInd)>0) 
			{
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
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else 
	{
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
		if (PcodesObj.type == "PF")
			Proficiency[Proficiency.length] = PcodesObj;
		else if (PcodesObj.type == "SS")
			Source[Source.length] = PcodesObj;
	}
	CalledPcodesInfo = false;
	PcodesInfo = new Array();
	GetCompDetail(Index);
}

function GetCompDetail(Index)
{
	if (ECPV.ReqCompetencies[Index].Type == "CE")
		CertSelectsLoaded = true;
	else
		CompSelectsLoaded = true;
	if (NonSpace(ECPV.ReqCompetencies[Index].SeqNbr)==0 || ECPV.ReqCompetencies[Index].SeqNbr <= 0) 
	{
		if (ECPV.ReqCompetencies[Index].Type == "CE") 
		{
			if (ECPV.ReqCompetencies[Index].UpdateFlag == "Y")
				DrawAddDetailContent(Index);
			else 
			{
				var tmpStr = '<div class="fieldlabelboldleft">'+getSeaPhrase("NO_QUAL_RECORD","CR")+'</div>';
				DrawChangeDetailContent(ECPV.ReqCompetencies[Index],tmpStr,Index,false);
			}
		}
		else 
		{
			if (ECPV.ReqCompetencies[Index].UpdateFlag == "Y") 
			{
				// If we don't have any proficiency levels defined in PCODES don't bother with an additional call to PACOMPPROF.
				if (Proficiency.length > 0)
					GetCompProficiencyLevels(ECPV.ReqCompetencies[Index].Type,ECPV.ReqCompetencies[Index].Code,Index,"A");
				else
				{
					FilteredProficiency = Proficiency;
					DrawAddDetailContent(Index);
				}			
			}
			else 
			{
				var tmpStr = '<div class="fieldlabelboldleft">'+getSeaPhrase("NO_QUAL_RECORD","CR")+'</div>';
				DrawChangeDetailContent(ECPV.ReqCompetencies[Index],tmpStr,Index,false);
			}
		}
		return;
	}
	var dmeObj = new DMEObject(authUser.prodline,"EMPCODES");
	dmeObj.out = "JAVASCRIPT";
	dmeObj.index = "epcset1";
	dmeObj.field = "type;code;description;subject;instructor;in-pro-flag;"
	+ "per-rating;co-sponsored;state;lic-number;date-acquired;renew-date;"
	+ "renewal-code;renewal-code,xlt;skill-source;currency-code;cost;profic-level;date-returned;seq-nbr;"
	+ "skill-source.description;currency.description;subject.description;institution.description";
	dmeObj.key = escape(ECPV.Company)+"="+escapeEx(ECPV.ReqCompetencies[Index].Type)+"=0"+"="+escape(ECPV.EmployeeCode)+"="+escapeEx(ECPV.ReqCompetencies[Index].Code);
	if ((ECPV.ReqCompetencies[Index].Subject && NonSpace(ECPV.ReqCompetencies[Index].Subject) > 0) || (ECPV.ReqCompetencies[Index].SeqNbr && NonSpace(ECPV.ReqCompetencies[Index].SeqNbr) > 0))
	{
		if (ECPV.ReqCompetencies[Index].Subject && NonSpace(ECPV.ReqCompetencies[Index].Subject)>0)
			dmeObj.key += "="+escapeEx(ECPV.ReqCompetencies[Index].Subject);
		else
			dmeObj.key += "="+escape(" ");
		if (ECPV.ReqCompetencies[Index].SeqNbr && NonSpace(ECPV.ReqCompetencies[Index].SeqNbr)>0)
			dmeObj.key += "="+escape(ECPV.ReqCompetencies[Index].SeqNbr,1);
	}
	dmeObj.func = "PaintCompDetailScreen("+Index+")";
	dmeObj.max = "1";
	dmeObj.debug = false;
	DME(dmeObj,"jsreturn");
}

function PaintCompDetailScreen(Index)
{
	if (ECPV.ReqCompetencies[Index].Type == "CE")
		FinishCRT_DetailScreen(Index,false);
	else // "SK", "AB", "KN", "OA"
	{
		if (!self.jsreturn.NbrRecs)
		{
			if (ECPV.ReqCompetencies[Index].UpdateFlag == "Y") 
			{
				// If we don't have any proficiency levels defined in PCODES don't bother with an additional call to PACOMPPROF.
				if (Proficiency.length > 0)
					GetCompProficiencyLevels(ECPV.ReqCompetencies[Index].Type,ECPV.ReqCompetencies[Index].Code,Index,"A");
				else 
				{
					FilteredProficiency = Proficiency;
					DrawAddDetailContent(Index);
				}			
			}
			else 
			{
				var tmpStr = '<div class="fieldlabelboldleft">'+getSeaPhrase("NO_QUAL_RECORDS","CR")+'</div>';
				DrawChangeDetailContent(ECPV.ReqCompetencies[Index],tmpStr,Index,false);
			}
		}
		else
		{
			EmpCodes = self.jsreturn.record[0];
			// If we don't have any proficiency levels defined in PCODES don't bother with an additional call to PACOMPPROF.
			if (Proficiency.length>0 && ECPV.ReqCompetencies[Index].UpdateFlag == "Y")
				GetCompProficiencyLevels(EmpCodes.type,EmpCodes.code,Index,"C");
			else 
			{
				FilteredProficiency = Proficiency;
				FinishCMP_DetailScreen(Index,false);
			}
		}
	}	
}

function GetCompProficiencyLevels(Type, Code, Index, FC)
{
	FilteredProficiency = new Array();
	var dmeObj = new DMEObject(authUser.prodline,"PACOMPPROF");
	dmeObj.out = "JAVASCRIPT";
	dmeObj.index = "pcmset1";
	dmeObj.field = "type;code;description;proficiency.type;proficiency.code;proficiency.description"
	dmeObj.cond	= "active";
	dmeObj.max = "600";
	dmeObj.key = escape(authUser.company)+"="+escape(" ")+"="+escape(Type,1)+";DF";
	dmeObj.func = "FilterProficiencyLevels('"+Code+"',"+Index+",'"+FC+"')";
	dmeObj.debug = false;
	DME(dmeObj,"jsreturn");
}

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
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
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
					DefaultProficiency[DefaultProficiency.length] = new CodeDescObject(FilteredProficiency[i].proficiency_code,Desc,FilteredProficiency[i].proficiency_type);
				if (FilteredProficiency[i].code == Code)
					Tmp[Tmp.length] = new CodeDescObject(FilteredProficiency[i].proficiency_code,Desc,FilteredProficiency[i].proficiency_type);
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
		if (FC && FC == "A")
			DrawAddDetailContent(Index);
		else
			FinishCMP_DetailScreen(Index);
	}
}

function FinishCMP_DetailScreen(Index)
{
	var CompObj = ECPV.ReqCompetencies[Index];
	var CompetencyDesc = "";
	var toolTip;
	if (CompObj.UpdateFlag != "Y")
	{
		CompetencyDesc = '<table border="0" cellspacing="0" cellpadding="0" width="100%" summary="'+getSeaPhrase("TSUM_7","CR",[CompObj.Description])+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("TCAP_5","CR",[CompObj.Description])+'</caption>'
		+ '<tr><th scope="col" colspan="2"></th></tr>'
		+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_4","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((CompObj.description)?CompObj.Description:'&nbsp;')+'</td></tr>'
		+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_5","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((MatchForDescription(EmpCodes.profic_level,FilteredProficiency))?MatchForDescription(EmpCodes.profic_level,FilteredProficiency):'&nbsp;')+'</td></tr>'
		+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_6","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.skill_source_description)?EmpCodes.skill_source_description:'&nbsp;')+'</td></tr>'
		+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_7","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.renewal_code_xlt)?EmpCodes.renewal_code_xlt:'&nbsp;')+'</td></tr>'
		+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_8","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.instructor)?EmpCodes.instructor:'&nbsp;')+'</td></tr>'
		+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_9","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.per_rating)?EmpCodes.per_rating:'&nbsp;')+'</td></tr>'
		+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_10","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.date_acquired)?EmpCodes.date_acquired:'&nbsp;')+'</td></tr>'
		+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_11","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.renew_date)?EmpCodes.renew_date:'&nbsp;')+'</td></tr>'
		+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_12","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.date_returned)?EmpCodes.date_returned:'&nbsp;')+'</td></tr>'
		+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_13","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.co_sponsored=="Y")?getSeaPhrase("YES","ESS"):getSeaPhrase("NO","ESS"))+'</td></tr></table>'
	}
	else
	{
		CompetencyDesc = '<form name="qualificationform">'
		+ '<input type="hidden" name="seqnbr" value="'+EmpCodes.seq_nbr+'">'
		+ '<input type="hidden" name="code" value="'+EmpCodes.code+'">'
		+ '<input type="hidden" name="type" value="'+EmpCodes.type+'">'
		+ '<table border="0" cellspacing="0" cellpadding="0" width="100%" summary="'+getSeaPhrase("TSUM_7","CR",[CompObj.Description])+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("TCAP_5","CR",[CompObj.Description])+'</caption>'
		+ '<tr><th scope="col" colspan="2"></th></tr>'		
		+ '<tr><th scope="row" class="fieldlabelboldlite">'+getSeaPhrase("QUAL_4","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+CompObj.Description+'</td></tr>'
		+ '<tr><th scope="row" class="fieldlabelboldlite"><label for="proficiency">'+getSeaPhrase("QUAL_5","ESS")+'</label></th><td id="proficiency" class="plaintablecelldisplay" nowrap><select class="inputbox" id="proficiency" name="proficiency">'+BuildSelect(EmpCodes.profic_level,FilteredProficiency)+'</select></td></tr>'
		+ '<tr><th scope="row" class="fieldlabelboldlite"><label for="ssource">'+getSeaPhrase("QUAL_6","ESS")+'</label></th>'
		if (emssObjInstance.emssObj.filterSelect)
		{
			toolTip = dmeFieldToolTip("skillsource");
			CompetencyDesc += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="ssource" name="skillsource" fieldnm="skillsource" value="'+EmpCodes.skill_source+'" size="10" maxlength="10" onfocus="this.select()">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'skillsource\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="skillsourceDesc" style="width:190px" class="fieldlabelleft">'+EmpCodes.skill_source_description+'</span></td></tr>'
		}
		else		
			CompetencyDesc += '<td id="skillsource" class="plaintablecell" nowrap><select class="inputbox" id="ssource" name="ssource" name="skillsource">'+BuildSelect(EmpCodes.skill_source,Source)+'</select></td></tr>'
		CompetencyDesc += '<tr><th scope="row" class="fieldlabelboldlite"><label for="rencode">'+getSeaPhrase("QUAL_7","ESS")+'</label></th><td id="renewalcode" class="plaintablecell" nowrap><select class="inputbox" id="rencode" name="renewalcode">'+BuildRenewalSelect(EmpCodes.renewal_code)+'</select></td></tr>'
		+ '<tr><th scope="row" class="fieldlabelboldlite"><label for="instructor">'+getSeaPhrase("QUAL_8","ESS")+'</label></th><td class="plaintablecell" nowrap><input class="inputbox" type="text" id="instructor" name="instructor" size="10" maxlength="10" value="'+EmpCodes.instructor+'"></td></tr>'
		+ '<tr><th scope="row" class="fieldlabelboldlite"><label for="perrating">'+getSeaPhrase("QUAL_9","ESS")+'</label></th><td class="plaintablecell" nowrap><input class="inputbox" type="text" id="perrating" name="perrating" size="8" maxlength="8" value="'+EmpCodes.per_rating+'"></td></tr>'
		toolTip = uiDateToolTip(getSeaPhrase("QUAL_10","ESS"));
		CompetencyDesc += '<tr><th scope="row" class="fieldlabelboldlite"><label id="dateacquiredLbl" for="dateacquired">'+getSeaPhrase("QUAL_10","ESS")+'</label></th><td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type="text" id="dateacquired" name="dateacquired" value="'+EmpCodes.date_acquired+'" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)" aria-labelledby="dateacquiredLbl dateacquiredFmt">'
		+ '<a href="javascript:;" onclick="parent.DateSelect(\'dateacquired\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan("dateacquiredFmt")+'</td></tr>'
		toolTip = uiDateToolTip(getSeaPhrase("QUAL_11","ESS"));
		CompetencyDesc += '<tr><th scope="row" class="fieldlabelboldlite"><label id="renewdateLbl" for="renewdate">'+getSeaPhrase("QUAL_11","ESS")+'</label></th><td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type="text" id="renewdate" name="renewdate" value="'+EmpCodes.renew_date+'" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)" aria-labelledby="renewdateLbl renewdateFmt">'
		+ '<a href="javascript:;" onclick="parent.DateSelect(\'renewdate\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan("renewdateFmt")+'</td></tr>'
		toolTip = uiDateToolTip(getSeaPhrase("QUAL_12","ESS"));
		CompetencyDesc += '<tr><th scope="row" class="fieldlabelboldlite"><label id="datereturnedLbl" for="datereturned">'+getSeaPhrase("QUAL_12","ESS")+'</label></th><td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type="text" id="datereturned" name="datereturned" value="'+EmpCodes.date_returned+'" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)" aria-labelledby="datereturnedLbl datereturnedFmt">'
		+ '<a href="javascript:;" onclick="parent.DateSelect(\'datereturned\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan("datereturnedFmt")+'</td></tr>'
		+ '<tr><th scope="row" class="fieldlabelboldliteunderline"><label for="csponsor">'+getSeaPhrase("QUAL_13","ESS")+'</label></th><td id="cosponsored" class="plaintablecell" nowrap><select class="inputbox" id="csponsor" name="cosponsored">'+BuildYesNo(EmpCodes.co_sponsored)+'</select></td></tr>'
		+ '<tr><th scope="row">&nbsp;</th><td class="plaintablecell">'
		+ uiButton(getSeaPhrase("UPDATE","CR"),"parent.UpdateQualification_OnClick("+Index+",\'C\');return false")
		+ uiButton(getSeaPhrase("CANCEL","CR"),"parent.ClearDetailScreen();return false","margin-left:5px")
		+ uiButton(getSeaPhrase("DELETE","CR"),"parent.DeleteQualification_OnClick("+Index+");return false","margin-left:15px")
		+ '</td></tr></table></form>';
	}
	DrawChangeDetailContent(CompObj, CompetencyDesc, Index);
}

function FinishCRT_DetailScreen(Index)
{
	var CertObj = ECPV.ReqCompetencies[Index];
	var CertificationDesc = "";
	var toolTip;
	if (!self.jsreturn.NbrRecs)
	{
		if (CertObj.UpdateFlag == "Y") 
		{
			DrawAddDetailContent(Index);
			return;
		}
		else 
			CertificationDesc = '<div class="fieldlabelboldleft">'+getSeaPhrase("NO_QUAL_RECORD","CR")+'</div>';
	}
	else
	{
		EmpCodes = self.jsreturn.record[0];
		if (CertObj.UpdateFlag != "Y")
		{
			CertificationDesc = '<table border="0" cellspacing="0" cellpadding="0" width="100%" summary="'+getSeaPhrase("TSUM_8","CR",[CertObj.Description])+'">'
			+ '<caption class="offscreen">'+getSeaPhrase("TCAP_6","CR",[CertObj.Description])+'</caption>'
			+ '<tr><th scope="col" colspan="2"></th></tr>'
			+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_4","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((CertObj.Description)?CertObj.Description:'&nbsp;')+'</td></tr>'
			+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_14","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((ReturnStateDescription(EmpCodes.state))?ReturnStateDescription(EmpCodes.state):'&nbsp;')+'</td></tr>'
			+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_15","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.lic_number)?EmpCodes.lic_number:'&nbsp;')+'</td></tr>'
			+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_10","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.date_acquired)?EmpCodes.date_acquired:'&nbsp;')+'</td></tr>'
			+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_12","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.renew_date)?EmpCodes.renew_date:'&nbsp;')+'</td></tr>'
			+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_7","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.renewal_code_xlt)?EmpCodes.renewal_code_xlt:'&nbsp;')+'</td></tr>'
			+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_6","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.skill_source_description)?EmpCodes.skill_source_description:'&nbsp;')+'</td></tr>'
			+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_13","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.co_sponsored=="Y")?getSeaPhrase("YES","ESS"):getSeaPhrase("NO","ESS"))+'</td></tr>'
			+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("COST","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.cost)?EmpCodes.cost:'&nbsp;')+'</td></tr>'
			+ '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("QUAL_16","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+((EmpCodes.currency_description)?EmpCodes.currency_description:'&nbsp;')+'</td></tr></table>'
		}
		else
		{
			CertificationDesc = '<form name="qualificationform">'
			+ '<input type="hidden" name="seqnbr" value="'+EmpCodes.seq_nbr+'">'
			+ '<input type="hidden" name="type" value="'+EmpCodes.type+'">'
			+ '<input type="hidden" name="code" value="'+EmpCodes.code+'">'
			+ '<table border="0" cellspacing="0" cellpadding="0" width="100%" summary="'+getSeaPhrase("TSUM_8","CR",[CertObj.Description])+'">'
			+ '<caption class="offscreen">'+getSeaPhrase("TCAP_6","CR",[CertObj.Description])+'</caption>'
			+ '<tr><th scope="col" colspan="2"></th></tr>'		
			+ '<tr><th scope="row" class="fieldlabelboldlite">'+getSeaPhrase("QUAL_4","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+CertObj.Description+'</td></tr>'
			+ '<tr><th scope="row" class="fieldlabelboldlite"><label for="certstate">'+getSeaPhrase("QUAL_14","ESS")+'</label></th>'
			if (emssObjInstance.emssObj.filterSelect)
			{
				toolTip = dmeFieldToolTip("state");
				CertificationDesc += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="certstate" name="state" fieldnm="state" value="'+EmpCodes.state+'" size="2" maxlength="2" onfocus="this.select()">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'state\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
				+ '<span id="stateDesc" style="width:190px" class="fieldlabelleft"></span></td></tr>'
			}
			else		
				CertificationDesc += '<td id="state" class="plaintablecell" nowrap><select class="inputbox" id="certstate" name="state">'+BuildStateSelect(EmpCodes.state)+'</select></td></tr>'
			CertificationDesc += '<tr><th scope="row" class="fieldlabelboldlite"><label for="licnumber">'+getSeaPhrase("QUAL_15","ESS")+'</label></th><td class="plaintablecell" nowrap><input class="inputbox" type="text" id="licnumber" name="licnumber" size="15" maxlength="20" value="'+EmpCodes.lic_number+'"></td></tr>'
			toolTip = uiDateToolTip(getSeaPhrase("QUAL_10","ESS"));
			CertificationDesc += '<tr><th scope="row" class="fieldlabelboldlite"><label id="dateacquiredLbl" for="dateacquired">'+getSeaPhrase("QUAL_10","ESS")+'</label></th><td class="plaintablecell" nowrap>'
			+ '<input class="inputbox" type="text" id="dateacquired" name="dateacquired" value="'+EmpCodes.date_acquired+'" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)" aria-labelledby="dateacquiredLbl dateacquiredFmt">'
			+ '<a href="javascript:;" onclick="parent.DateSelect(\'dateacquired\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan("dateacquiredFmt")+'</td></tr>'
			toolTip = uiDateToolTip(getSeaPhrase("QUAL_12","ESS"));
			CertificationDesc += '<tr><th scope="row" class="fieldlabelboldlite"><label id="renewdateLbl" for="renewdate">'+getSeaPhrase("QUAL_12","ESS")+'</label></th><td class="plaintablecell" nowrap>'
			+ '<input class="inputbox" type="text" id="renewdate" name="renewdate" value="'+EmpCodes.renew_date+'" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)" aria-labelledby="renewdateLbl renewdateFmt">'
			+ '<a href="javascript:;" onclick="parent.DateSelect(\'renewdate\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan("renewdateFmt")+'</td></tr>'
			+ '<tr><th scope="row" class="fieldlabelboldlite"><label for="rencode">'+getSeaPhrase("QUAL_7","ESS")+'</label></th><td id="renewalcode" class="plaintablecell" nowrap><select class="inputbox" id="rencode" name="renewalcode">'+BuildRenewalSelect(EmpCodes.renewal_code)+'</select></td></tr>'
			+ '<tr><th scope="row" class="fieldlabelboldlite"><label for="ssource">'+getSeaPhrase("QUAL_6","ESS")+'</label></th>'
			if (emssObjInstance.emssObj.filterSelect)
			{
				toolTip = dmeFieldToolTip("skillsource");
				CertificationDesc += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="ssource" name="skillsource" fieldnm="skillsource" value="'+EmpCodes.skill_source+'" size="10" maxlength="10" onfocus="this.select()">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'skillsource\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
				+ '<span id="skillsourceDesc" style="width:190px" class="fieldlabelleft">'+EmpCodes.skill_source_description+'</span></td></tr>'
			}
			else				
				CertificationDesc += '<td id="skillsource" class="plaintablecell" nowrap><select class="inputbox" id="ssource" name="skillsource">'+BuildSelect(EmpCodes.skill_source,Source)+'</select></td></tr>'
			CertificationDesc += '<tr><th scope="row" class="fieldlabelboldlite"><label for="csponsor">'+getSeaPhrase("QUAL_13","ESS")+'</label></th><td id="cosponsored" class="plaintablecell" nowrap><select class="inputbox" id="csponsor" name="cosponsored">'+BuildYesNo(EmpCodes.co_sponsored)+'</select></td></tr>'
			+ '<tr><th scope="row" class="fieldlabelboldlite"><label for="cost">'+getSeaPhrase("COST","ESS")+'</label></th><td class="plaintablecell" nowrap><input class="inputbox" type="text" id="cost" name="cost" size="14" maxlength="14" value="'+parseFloat(EmpCodes.cost)+'"></td></tr>'
			+ '<tr><th scope="row" class="fieldlabelboldliteunderline"><label for="curcode">'+getSeaPhrase("QUAL_16","ESS")+'</label></th>'
			if (emssObjInstance.emssObj.filterSelect)
			{
				toolTip = dmeFieldToolTip("currencycode");
				CertificationDesc += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="curcode" name="currencycode" fieldnm="currencycode" value="'+EmpCodes.currency_code+'" size="5" maxlength="5" onfocus="this.select()">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'currencycode\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
				+ '<span id="currencycodeDesc" style="width:190px" class="fieldlabelleft">'+EmpCodes.currency_description+'</span></td></tr>'
			}
			else				
				CertificationDesc += '<td id="currencycode" class="plaintablecell" nowrap><select class="inputbox" id="curcode" name="currencycode">'+BuildSelect(EmpCodes.currency_code,Currency)+'</select></td></tr>'
			CertificationDesc += '<tr><th scope="row">&nbsp;</th><td class="plaintablecell">'
			+ uiButton(getSeaPhrase("UPDATE","CR"),"parent.UpdateQualification_OnClick("+Index+",\'C\');return false")
			+ uiButton(getSeaPhrase("CANCEL","CR"),"parent.ClearDetailScreen();return false","margin-left:5px")
			+ uiButton(getSeaPhrase("DELETE","CR"),"parent.DeleteQualification_OnClick("+Index+");return false","margin-left:15px")
			+ '</td></tr></table></form>';
		}
	}
	DrawChangeDetailContent(CertObj, CertificationDesc, Index);
}

function DrawChangeDetailContent(QualObj, DetailContent, Index)
{
	// Draw the detail body content.  This is the individual qualification info.
	var QualificationContent = DetailContent;
	// Draw the detail header content.  This is the "Qualification Detail" label.
	if (ECPV.ReqCompetencies[Index].UpdateFlag == "Y") 
	{	
		self.detail.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DETAIL","CR");
		self.detail.document.getElementById("paneBody").innerHTML = QualificationContent;
		self.detail.stylePage();
		self.detail.setLayerSizes();
		document.getElementById("readonlydetail").style.visibility = "hidden";
		document.getElementById("detail").style.visibility = "visible";
		stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[self.detail.getWinTitle()]));
	}
	else 
	{
		self.readonlydetail.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DETAIL","CR");
		self.readonlydetail.document.getElementById("paneBody").innerHTML = QualificationContent;
		self.readonlydetail.stylePage();
		self.readonlydetail.setLayerSizes();
		document.getElementById("detail").style.visibility = "hidden";	
		document.getElementById("readonlydetail").style.visibility = "visible";
		stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[self.readonlydetail.getWinTitle()]));
	}	
}		

function DrawAddDetailContent(Index)
{
	var QualObj = ECPV.ReqCompetencies[Index];
	var QualificationContent = "";
	var toolTip;
	if (QualObj.Type == "CE")
	{
		QualificationContent = '<form name="qualificationform">'
		+ '<input type="hidden" size="20" maxlength="30" name="code" value="'+QualObj.Code+'">'
		+ '<input type="hidden" size="10" maxlength="30" name="type" value="'+QualObj.Type+'">'
		+ '<input type="hidden" size="20" maxlength="30" name="qualification" value="'+QualObj.Description+'">'
		+ '<table border="0" cellspacing="0" cellpadding="0" width="100%" summary="'+getSeaPhrase("TSUM_92","SEA")+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("QUAL_2","ESS")+'</caption>'
		+ '<tr><th scope="col" colspan="2"></th></tr>'
		+ '<tr><th scope="row" class="fieldlabelboldlite">'+getSeaPhrase("QUAL_4","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+QualObj.Description+'</td></tr>'
		+ '<tr><th scope="row" class="fieldlabelboldlite"><label for="certstate">'+getSeaPhrase("QUAL_14","ESS")+'</label></th>'
		if (emssObjInstance.emssObj.filterSelect)
		{
			toolTip = dmeFieldToolTip("state");
			QualificationContent += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="certstate" name="state" fieldnm="state" value="" size="2" maxlength="2" onfocus="this.select()">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'state\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="stateDesc" style="width:190px" class="fieldlabelleft"></span></td></tr>'
		}
		else
			QualificationContent += '<td id="state" class="plaintablecell" nowrap><select class="inputbox" id="certstate" name="state">'+BuildStateSelect("")+'</select></td></tr>'
		QualificationContent += '<tr><th scope="row" class="fieldlabelboldlite"><label for="licnumber">'+getSeaPhrase("QUAL_15","ESS")+'</label></th><td class="plaintablecell" nowrap><input class="inputbox" type="text" id="licnumber" name="licnumber" size="15" maxlength="20" value=""></td></tr>'
		toolTip = uiDateToolTip(getSeaPhrase("QUAL_10","ESS"));
		QualificationContent += '<tr><th scope="row" class="fieldlabelboldlite"><label id="dateacquiredLbl" for="dateacquired">'+getSeaPhrase("QUAL_10","ESS")+'</label></th><td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type="text" id="dateacquired" name="dateacquired" value="" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)" aria-labelledby="dateacquiredLbl dateacquiredFmt">'
		+ '<a href="javascript:;" onclick="parent.DateSelect(\'dateacquired\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan("dateacquiredFmt")+'</td></tr>'
		toolTip = uiDateToolTip(getSeaPhrase("QUAL_12","ESS"));
		QualificationContent += '<tr><th scope="row" class="fieldlabelboldlite"><label id="renewdateLbl" for="renewdate">'+getSeaPhrase("QUAL_12","ESS")+'</label></th><td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type="text" id="renewdate" name="renewdate" value="" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)" aria-labelledby="renewdateLbl renewdateFmt">'
		+ '<a href="javascript:;" onclick="parent.DateSelect(\'renewdate\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan("renewdateFmt")+'</td></tr>'
		+ '<tr><th scope="row" class="fieldlabelboldlite"><label for="rencode">'+getSeaPhrase("QUAL_7","ESS")+'</label></th><td id="renewalcode" class="plaintablecell" nowrap><select class="inputbox" id="rencode" name="renewalcode">'+BuildRenewalSelect("")+'</select></td></tr>'
		+ '<tr><th scope="row" class="fieldlabelboldlite"><label for="ssource">'+getSeaPhrase("QUAL_6","ESS")+'</label></th>'
		if (emssObjInstance.emssObj.filterSelect)
		{
			toolTip = dmeFieldToolTip("skillsource");
			QualificationContent += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="ssource" name="skillsource" fieldnm="skillsource" value="" size="10" maxlength="10" onfocus="this.select()">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'skillsource\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="skillsourceDesc" style="width:190px" class="fieldlabelleft"></span></td></tr>'
		}
		else
			QualificationContent += '<td id="skillsource" class="plaintablecell" nowrap><select class="inputbox" id="ssource" name="skillsource">'+BuildSelect("",Source)+'</select></td></tr>'
		QualificationContent += '<tr><th scope="row" class="fieldlabelboldlite"><label for="csponsor">'+getSeaPhrase("QUAL_13","ESS")+'</label></th><td id="cosponsored" class="plaintablecell" nowrap><select class="inputbox" id="csponsor" name="cosponsored">'+BuildYesNo("")+'</select></td></tr>'
		+ '<tr><th scope="row" class="fieldlabelboldlite"><label for="cost">'+getSeaPhrase("COST","ESS")+'</label></th><td class="plaintablecell" nowrap><input class="inputbox" type="text" id="cost" name="cost" size="14" maxlength="14" value=""></td></tr>'
		+ '<tr><th scope="row" class="fieldlabelboldliteunderline"><label for="curcode">'+getSeaPhrase("QUAL_16","ESS")+'</label></th>'
		if (emssObjInstance.emssObj.filterSelect)
		{
			toolTip = dmeFieldToolTip("currencycode");
			QualificationContent += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="curcode" name="currencycode" fieldnm="currencycode" value="" size="5" maxlength="5" onfocus="this.select()">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'currencycode\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="currencycodeDesc" style="width:190px" class="fieldlabelleft"></span></td></tr>'
		}
		else				
			QualificationContent += '<td id="currencycode" class="plaintablecell" nowrap><select class="inputbox" id="curcode" name="currencycode">'+BuildSelect("",Currency)+'</select></td></tr>'
	}
	else
	{
		// Draw the detail body content.  This is the table of employee qualifications.
		QualificationContent = '<form name="qualificationform">'
		+ '<input type="hidden" size="20" maxlength="30" name="code" value="'+QualObj.Code+'">'
		+ '<input type="hidden" size="10" maxlength="30" name="type" value="'+QualObj.Type+'">'
		+ '<input type="hidden" size="20" maxlength="30" name="qualification" value="'+QualObj.Description+'">'
		+ '<table border="0" cellspacing="0" cellpadding="0" width="100%" summary="'+getSeaPhrase("TSUM_92","SEA")+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("QUAL_2","ESS")+'</caption>'
		+ '<tr><th scope="col" colspan="2"></th></tr>'		
		+ '<tr><th scope="row" class="fieldlabelboldlite">'+getSeaPhrase("QUAL_4","ESS")+'</th><td class="plaintablecelldisplay" nowrap>'+QualObj.Description+'</td></tr>'
		+ '<tr><th scope="row" class="fieldlabelboldlite"><label for="prof">'+getSeaPhrase("QUAL_5","ESS")+'</label></th><td id="proficiency" class="plaintablecell" nowrap><select class="inputbox" id="prof" name="proficiency">'+BuildSelect("",Proficiency)+'</select></td></tr>'
		+ '<tr><th scope="row" class="fieldlabelboldlite"><label for="ssource">'+getSeaPhrase("QUAL_6","ESS")+'</label></th>'
		if (emssObjInstance.emssObj.filterSelect)
		{
			toolTip = dmeFieldToolTip("skillsource");
			QualificationContent += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="ssource" name="skillsource" fieldnm="skillsource" value="" size="10" maxlength="10" onfocus="this.select()">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'skillsource\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="skillsourceDesc" style="width:190px" class="fieldlabelleft"></span></td></tr>'
		}
		else
			QualificationContent += '<td id="skillsource" class="plaintablecell" nowrap><select class="inputbox" id="ssource" name="skillsource">'+BuildSelect("",Source)+'</select></td></tr>'
		QualificationContent += '<tr><th scope="row" class="fieldlabelboldlite"><label for="rencode">'+getSeaPhrase("QUAL_7","ESS")+'</label></th><td id="renewalcode" class="plaintablecell" nowrap><select class="inputbox" id="rencode" name="renewalcode">'+BuildRenewalSelect("")+'</select></td></tr>'
		+ '<tr><th scope="row" class="fieldlabelboldlite"><label for="instructor">'+getSeaPhrase("QUAL_8","ESS")+'</label></th><td class="plaintablecell" nowrap><input class="inputbox" type="text" id="instructor" name="instructor" size="10" maxlength="10" value=""></td></tr>'
		+ '<tr><th scope="row" class="fieldlabelboldlite"><label for="perrating">'+getSeaPhrase("QUAL_9","ESS")+'</label></th><td class="plaintablecell" nowrap><input class="inputbox" type="text" id="perrating" name="perrating" size="8" maxlength="8" value=""></td></tr>'
		toolTip = uiDateToolTip(getSeaPhrase("QUAL_10","ESS"));
		QualificationContent += '<tr><th scope="row" class="fieldlabelboldlite"><label id="dateacquiredLbl" for="dateacquired">'+getSeaPhrase("QUAL_10","ESS")+'</label></th><td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type="text" id="dateacquired" name="dateacquired" value="" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)" aria-labelledby="dateacquiredLbl dateacquiredFmt">'
		+ '<a href="javascript:;" onclick="parent.DateSelect(\'dateacquired\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan("dateacquiredFmt")+'</td></tr>'
		toolTip = uiDateToolTip(getSeaPhrase("QUAL_11","ESS"));
		QualificationContent += '<tr><th scope="row" class="fieldlabelboldlite"><label id="renewdateLbl" for="renewdate">'+getSeaPhrase("QUAL_11","ESS")+'</label></th><td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type="text" id="renewdate" name="renewdate" value="" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)" aria-labelledby="renewdateLbl renewdateFmt">'
		+ '<a href="javascript:;" onclick="parent.DateSelect(\'renewdate\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan("renewdateFmt")+'</td></tr>'
		toolTip = uiDateToolTip(getSeaPhrase("QUAL_12","ESS"));
		QualificationContent += '<tr><th scope="row" class="fieldlabelboldlite"><label id="datereturnedLbl" for="datereturned">'+getSeaPhrase("QUAL_12","ESS")+'</label></th><td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type="text" id="datereturned" name="datereturned" value="" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)" aria-labelledby="datereturnedLbl datereturnedFmt">'
		+ '<a href="javascript:;" onclick="parent.DateSelect(\'datereturned\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan("datereturnedFmt")+'</td></tr>'
		+ '<tr><th scope="row" class="fieldlabelboldliteunderline"><label for="csponsor">'+getSeaPhrase("QUAL_13","ESS")+'</th><td id="cosponsored" class="plaintablecell" nowrap><select class="inputbox" id="csponsor" name="cosponsored">'+BuildYesNo("")+'</select></td></tr>'
	}
	if (QualificationContent != "")
	{
		// Draw the list footer content.  This is the Update Qualification button.
		QualificationContent += '<tr><th scope="row">&nbsp;</th><td class="plaintablecell">'
		+ uiButton(getSeaPhrase("UPDATE","CR"),"parent.UpdateQualification_OnClick("+Index+",\'A\');return false")
		+ uiButton(getSeaPhrase("CANCEL","CR"),"parent.ClearDetailScreen();return false","margin-left:5px")
		+ '</td></tr></table></form>';
	}
	// Draw the detail header content.  This is the "Qualification Detail" label.
	self.detail.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DETAIL","CR");
	self.detail.document.getElementById("paneBody").innerHTML = QualificationContent;
	self.detail.stylePage();
	self.detail.setLayerSizes();
	document.getElementById("readonlydetail").style.visibility = "hidden";
	document.getElementById("detail").style.visibility = "visible";
	stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[self.detail.getWinTitle()]));	
}

function UpdateQualification_OnClick(Index, fc)
{
	var qualDoc = self.detail.document;
	var qualForm = self.detail.document.qualificationform;
	// Edit the form for any required fields before passing it to the server.
	clearRequiredField(qualForm.dateacquired);
	clearRequiredField(qualForm.renewdate);
	if (typeof(qualForm.datereturned) != "undefined")
		clearRequiredField(qualForm.datereturned);
	if (fc != "A") // Edits for "Update" screen
	{
		clearRequiredField(qualForm.code);
		if (NonSpace(qualForm.code.value) == 0)
		{
			setRequiredField(qualForm.code, getSeaPhrase("QUAL_33","ESS"));
			return;
		}
	}
	if (NonSpace(qualForm.dateacquired.value) && !ValidDate(qualForm.dateacquired))
		return;
	if (NonSpace(qualForm.renewdate.value) && !ValidDate(qualForm.renewdate))
		return;
	if (typeof(qualForm.datereturned) != "undefined" && NonSpace(qualForm.datereturned.value) && !ValidDate(qualForm.datereturned))
		return;
	switch (ECPV.ReqCompetencies[Index].Type)
	{
		case "CE": Do_Crt_Call(qualForm, "PA22.1", fc, "form", ECPV.EmployeeCode, false, ECPV.Manager); break; // Update this certification record.
		default: Do_Cmp_Call(qualForm, "PA21.1", fc, "form", ECPV.EmployeeCode, false); break; // Update this competency record.
	}
}

function DeleteQualification_OnClick(Index)
{
	var qualForm = self.detail.document.qualificationform;
	var nextFunc = function()
	{
		switch (ECPV.ReqCompetencies[Index].Type)
		{
			case "CE": Do_Crt_Call(qualForm, "PA22.1", "D", "form", ECPV.EmployeeCode, false, ECPV.Manager); break; // Delete this certification record.
			default: Do_Cmp_Call(qualForm, "PA21.1", "D", "form", ECPV.EmployeeCode, false); break; // Delete this competency record.
		}
	};
	startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
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
	if (self.lawheader.gmsgnbr == "000")
	{
		document.getElementById("detail").style.visibility = "hidden";
		if (fromTask && fromTask.indexOf("employee") != -1)
			employeeNbr = getVarFromString("employee",fromTask);
		else
			employeeNbr = authUser.employee;
		EmployeeCompetencyProfile(authUser.company, employeeNbr, ECPV.Manager, true, -1);	
	}
	else
	{
		stopProcessing();
		seaAlert(self.lawheader.gmsg, null, null, "error");
	}	
}

function ReturnDate(dte)
{
	try { self.detail.document.forms["qualificationform"].elements[date_fld_name].value = dte; } catch(e) {}
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
			if ((filterField == "state") || (filterField == "province")) 
			{
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
		if (stateProvFilter == "state") 
		{
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
		} 
		else 
		{
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
	var formElm;
	switch (fieldNm.toLowerCase())
	{
		case "skillsource":
			formElm = qualForm.skillsource;
			qualForm.skillsource.value = selRec.code;
			qualDoc.getElementById("skillsourceDesc").innerHTML = selRec.description;
			break;
		case "state":
			formElm = qualForm.state;
			if (stateProvFilter == "state")
				qualForm.state.value = selRec.state;
			else
				qualForm.state.value = selRec.province;
			qualDoc.getElementById("stateDesc").innerHTML = selRec.description;
			break;
		case "currencycode":
			formElm = qualForm.currencycode;
			qualForm.currencycode.value = selRec.currency_code;
			qualDoc.getElementById("currencycodeDesc").innerHTML = selRec.description;
			break;
		default:
			break;
	}
	try { filterWin.close(); } catch(e) {}
	try { formElm.focus(); } catch(e) {}
}

function getDmeFieldElement(fieldNm)
{
	var qualDoc = self.detail.document;
	var qualForm = qualDoc.qualificationform;
	var fld = [null, null, null];
	try
	{
		switch (fieldNm.toLowerCase())
		{
			case "skillsource":
				fld = [self.detail, qualForm.skillsource, getSeaPhrase("QUAL_6","ESS")];
				break;
			case "state":
				fld = [self.detail, qualForm.state, getSeaPhrase("STATE_ONLY","ESS")];
				break;
			case "currencycode":
				fld = [self.detail, qualForm.currencycode, getSeaPhrase("QUAL_16","ESS")];
				break;
			default:
				break;
		}
	}
	catch(e) {}
	return fld;
}

function drawDmeFieldFilterContent(dmeFilter)
{
	var selectHtml = new Array();
	var dmeRecs = self.jsreturn.record;
	var nbrDmeRecs = dmeRecs.length;
	var fieldNm = dmeFilter.getFieldNm().toLowerCase();
	var fldObj = getDmeFieldElement(fieldNm);
	var fldDesc = fldObj[2];
	switch (fieldNm)
	{
		case "skillsource":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("QUAL_6","ESS")+'</th>'
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
		case "state":
			if (stateProvFilter == "state") 
			{
				var tmpObj;
				selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
				selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
				selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("STATE_ONLY","ESS")+'</th>'
				selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
				for (var i=0; i<nbrDmeRecs; i++)
				{
					tmpObj = dmeRecs[i];
					selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
					selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.state) ? tmpObj.state : '&nbsp;'
					selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
					selectHtml[i+1] += '</a></td></tr>'
				}
			} 
			else 
			{
				var tmpObj;
				selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
				selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
				selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("PROVINCE","ESS")+'</th>'
				selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
				for (var i=0; i<nbrDmeRecs; i++)
				{
					tmpObj = dmeRecs[i];
					selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
					selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.province) ? tmpObj.province : '&nbsp;'
					selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
					selectHtml[i+1] += '</a></td></tr>'
				}
			}
			if (nbrDmeRecs == 0)
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "currencycode":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("QUAL_16","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++)
			{
				tmpObj = dmeRecs[i];
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.currency_code) ? tmpObj.currency_code : '&nbsp;'
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
/* Filter Select logic - end */
