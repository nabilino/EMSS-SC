<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width" />
<meta http-equiv="pragma" content="No-Cache" />
<meta http-equiv="expires" content="Mon, 01 Jan 1990 00:00:01 GMT" />
<title>Requisition Summary</title>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<script src="/lawson/webappjs/transaction.js"> </script>
<script src="/lawson/webappjs/data.js"> </script>
<script src="/lawson/webappjs/commonHTTP.js"> </script>
<script src="/lawson/xhrnet/waitalert.js"> </script>
<script src="/lawson/xhrnet/esscommon80.js"> </script>
<script src="/lawson/xhrnet/xml/xmldateroutines.js"> </script>
<script src="/lawson/webappjs/user.js"> </script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"> </script>
<script src="/lawson/xhrnet/JobRequisitions/Lib/PA42.js"> </script>
<script src="/lawson/xhrnet/JobRequisitions/RequisitionSummary/SHR024_DME.js"> </script>
<script src="/lawson/xhrnet/ui/ui.js"> </script>
<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"> </script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"> </script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"> </script>
<script src="/lawson/webappjs/javascript/objects/ActivityDialog.js"> </script>
<script src="/lawson/webappjs/javascript/objects/OpaqueCover.js"> </script>
<script src="/lawson/webappjs/javascript/objects/Dialog.js"> </script>
<script>
///////////////////////////////////////////////////////////////////////////////////////////
//
// Global Variables
//
var HrSuper, Requisitions;
var ReqStorage = new Array();
var PA42;
var sortProperty;
var lastSortField = null;
//GDD  06/23/14  new variables
var CurReqNbr;
var ApproverList = new Array();
var ApproverName = new Array();
var NbrApprs = 0;
//GDD  end of change
///////////////////////////////////////////////////////////////////////////////////////////
//
// Initialize function.
//
function Initialize()
{
	authenticate("frameNm='jsreturn'|funcNm='AuthenticateFinished()'|desiredEdit='EM'");
}

///////////////////////////////////////////////////////////////////////////////////////////
//
// Initialization Complete function.
//
function AuthenticateFinished()
{
	stylePage();
	var title = getSeaPhrase("JOB_REQUISITIONS","ESS");
	setWinTitle(title);
	setTaskHeader("header",title,"Manager");
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), GetDME_HRSUPER);
}

///////////////////////////////////////////////////////////////////////////////////////////
//
// Draw the window.
function Draw()
{
	PaintTopWindow();
	PaintBottomWindow();
}

function sortByAscProperty(obj1, obj2)
{
	var name1 = obj1[sortProperty];
	var name2 = obj2[sortProperty];
	if (sortProperty == "date_needed" || sortProperty == "open_date")
	{
		name1 = formjsDate(formatDME(name1));
		name2 = formjsDate(formatDME(name2));		
	}
	
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
	if (sortProperty == "date_needed" || sortProperty == "open_date")
	{
		name1 = formjsDate(formatDME(name1));
		name2 = formjsDate(formatDME(name2));		
	}
	if (name1 > name2)
		return -1;
	else if (name1 < name2)
		return 1;
	else
		return 0;
}

function SortReqs(Value, dir)
{
	var nextFunc = function()
	{
		sortProperty = Value;
		if (sortProperty != lastSortField)
			dir = "ascending";
		lastSortField = sortProperty;
		var sortFunc = (dir == "ascending") ? sortByAscProperty : sortByDscProperty;	
		HrSuper.sort(sortFunc);
		PaintTopWindow(true, Value, dir);
		PaintBottomWindow();
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function PaintTopWindow(onsort, property, sortDir)
{
	sortDir = sortDir || "ascending";
	var nextSortDir = (sortDir == "ascending") ? "descending" : "ascending";	
	var strHtml = '';
	if (HrSuper.length)
	{
		var toolTip = getSeaPhrase("JOB_OPENINGS_1","ESS");
		strHtml += '<table id="jobReqsTbl" class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_16","SEA")+'">';
		strHtml += '<caption class="offscreen">'+getSeaPhrase("JOB_REQUISITIONS","ESS")+'</caption>';
		strHtml += '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center;width:26%" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
		strHtml += '<a class="columnsort" href="javascript:;" onclick="parent.SortReqs(\'description\',\''+nextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
		toolTip = getSeaPhrase("NUMBER","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
		strHtml += '<th scope="col" class="plaintableheaderborder" style="text-align:center;width:11%" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
		strHtml += '<a class="columnsort" href="javascript:;" onclick="parent.SortReqs(\'requisition\',\''+nextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("NUMBER","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
		toolTip = getSeaPhrase("SORT_BY_STATUS","ESS");
		strHtml += '<th scope="col" class="plaintableheaderborder" style="text-align:center;width:10%" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
		strHtml += '<a class="columnsort" href="javascript:;" onclick="parent.SortReqs(\'req_status_description\',\''+nextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("STATUS","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
		toolTip = getSeaPhrase("DATE_NEEDED","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
		strHtml += '<th scope="col" class="plaintableheaderborder" style="text-align:center;width:12%" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
		strHtml += '<a class="columnsort" href="javascript:;" onclick="parent.SortReqs(\'date_needed\',\''+nextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("DATE_NEEDED","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
		toolTip = getSeaPhrase("DATE_OPENED","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
		strHtml += '<th scope="col" class="plaintableheaderborder" style="text-align:center;width:12%" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
		strHtml += '<a class="columnsort" href="javascript:;" onclick="parent.SortReqs(\'open_date\',\''+nextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("DATE_OPENED","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
		toolTip = getSeaPhrase("JOB_OPENINGS_11","ESS");   
		//GDD  06/19/14  Add new column
		//strHtml += '<th scope="col" class="plaintableheaderborder" style="text-align:center;width:29%" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
		//strHtml += '<a class="columnsort" href="javascript:;" onclick="parent.SortReqs(\'contact_last\',\''+nextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("JOB_OPENINGS_12","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th></tr>';
		strHtml += '<th scope="col" class="plaintableheaderborder" style="text-align:center;width:26%" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
		strHtml += '<a class="columnsort" href="javascript:;" onclick="parent.SortReqs(\'contact_last\',\''+nextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("JOB_OPENINGS_12","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
		//GDD  06/19/14  Add new column
		strHtml += '<th class="plaintableheaderborder" style="text-align:center;width:3%"></th></tr>';
		//GDD end of change
		for (var i=0; i<HrSuper.length; i++)
		{
			toolTip = HrSuper[i].description+' - '+getSeaPhrase("VIEW_DTL_FOR_JOB_5","SEA");
			strHtml += '<tr><td class="plaintablecellborder" style="width:26%" nowrap>';
			strHtml += '<a href="javascript:;" onclick="javascript:parent.GetDetail('+i+');return false" title="'+toolTip+'">'+((HrSuper[i].description)?HrSuper[i].description:'&nbsp;')+'<span class="offscreen"> - '+getSeaPhrase("VIEW_DTL_FOR_JOB_5","SEA")+'</span></a></td>'
			strHtml += '<td class="plaintablecellborderright" style="width:11%" nowrap>'+((HrSuper[i].requisition)?HrSuper[i].requisition:'0')+'</td>'
			strHtml += '<td class="plaintablecellborder" style="width:10%" nowrap>'+((HrSuper[i].req_status_description)?HrSuper[i].req_status_description:'&nbsp;')+'</td>'
			strHtml += '<td class="plaintablecellborder" style="text-align:center;width:12%" nowrap>'+((HrSuper[i].date_needed)?HrSuper[i].date_needed:'&nbsp;')+'</td>'
			strHtml += '<td class="plaintablecellborder" style="text-align:center;width:12%" nowrap>'+((HrSuper[i].open_date)?HrSuper[i].open_date:'&nbsp;')+'</td>' 
			//GDD  06/19/14  Added new column
			//strHtml += '<td class="plaintablecellborder" style="width:29%" nowrap>'+((HrSuper[i].label_name)?HrSuper[i].label_name:'&nbsp;')+'</td></tr>';		
			strHtml += '<td class="plaintablecellborder" style="width:26%" nowrap>'+((HrSuper[i].label_name)?HrSuper[i].label_name:'&nbsp;')+'</td>';		
			strHtml += '<td class="plaintablecellborder" style="width:3%" nowrap>'
			if (HrSuper[i].req_status == "PENDING") {
				var btncall = "parent.ViewApprovers("+HrSuper[i].requisition+");return false";
				strHtml += uiButton("Approvals",btncall,"margin-top:10px")
			}
			strHtml += '</td></tr>'
			//GDD end of change
		}
		strHtml += '</table>';
	}
	else
		strHtml += '<div class="fieldlabelboldleft" style="padding-bottom:10px;padding-left:10px;padding-top:5px">'+getSeaPhrase("NO_REQUISTIONS","ESS")+'</div>';
	strHtml += '';
	try
	{
		self.MAIN.document.getElementById("paneHeader").innerHTML = getSeaPhrase("REQS_IN_PROCESS","ESS");
		self.MAIN.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}
	self.MAIN.stylePage();
	self.MAIN.setLayerSizes();
	if (onsort)
		self.MAIN.styleSortArrow("jobReqsTbl", property, sortDir);
	else
		document.getElementById("MAIN").style.visibility = "visible";
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.MAIN.getWinTitle()]));
	fitToScreen();
}

function PaintBottomWindow()
{
	var strHtml = '<table id="jobReqDtlTbl" border="0" cellspacing="0" cellpadding="0" width="100%" summary="'+getSeaPhrase("TSUM_17","SEA",[""])+'">';
	strHtml += '<caption class="offscreen">'+getSeaPhrase("TCAP_12","SEA",[""])+'</caption>';
	strHtml += '<tr><th scope="col" colspan="4"></th></tr>';
	// Postion, Phone Number
	strHtml += '<tr><th scope="row" class="plaintablerowheaderborderlite" style="width:17%">'+getSeaPhrase("JOB_PROFILE_8","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:33%" nowrap><span id="dtlPosition">&nbsp;</span></td>';
	strHtml += '<th scope="row" class="plaintablerowheaderborderlite" style="width:21%">'+getSeaPhrase("PHONE_NUMBER","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:29%" nowrap><span id="dtlPhone">&nbsp;</span></td></tr>';
	// Job, Extension
	strHtml += '<tr><th scope="row" class="plaintablerowheaderborderlite" style="width:17%">'+getSeaPhrase("JOB_PROFILE_9","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:33%" nowrap><span id="dtlJob">&nbsp;</span></td>';
	strHtml += '<th scope="row" class="plaintablerowheaderborderlite" style="width:21%">'+getSeaPhrase("JOB_OPENINGS_14","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:29%" nowrap><span id="dtlExtension">&nbsp;</span></td></tr>';
	// Openings, Phone Country Code
	strHtml += '<tr><th scope="row" class="plaintablerowheaderborderlite" style="width:17%">'+getSeaPhrase("JOB_OPENINGS_4","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:33%" nowrap><span id="dtlOpenings">&nbsp;</span></td>';
	strHtml += '<th scope="row" class="plaintablerowheaderborderlite" style="width:21%">'+getSeaPhrase("PHONE_COUNTRY_CODE","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:29%" nowrap><span id="dtlPhoneCountry">&nbsp;</span></td></tr>';
	// FTE, Employee Status
	strHtml += '<tr><th scope="row" class="plaintablerowheaderborderlite" style="width:17%">'+getSeaPhrase("FULL_TIME_EMPLOYEE","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:33%" nowrap><span id="dtlFTE">&nbsp;</span></td>';
	strHtml += '<th scope="row" class="plaintablerowheaderborderlite" style="width:21%">'+getSeaPhrase("EMPLOYEE_STATUS","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:29%" nowrap><span id="dtlEmpStatus">&nbsp;</span></td></tr>';
	// Process Level, Temporary Dates
	strHtml += '<tr><th scope="row" class="plaintablerowheaderborderlite" style="width:17%">'+getSeaPhrase("JOB_PROFILE_3","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:33%" nowrap><span id="dtlProcessLevel">&nbsp;</span></td>';
	strHtml += '<th scope="row" class="plaintablerowheaderborderlite" style="width:21%">'+getSeaPhrase("TEMP_DATES","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:29%" nowrap><span id="dtlTempDates">&nbsp;</span></td></tr>';
	// Department, User Level
	strHtml += '<tr><th scope="row" class="plaintablerowheaderborderlite" style="width:17%">'+getSeaPhrase("JOB_PROFILE_4","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:33%" nowrap><span id="dtlDepartment">&nbsp;</span></td>';
	strHtml += '<th scope="row" class="plaintablerowheaderborderlite" style="width:21%">'+getSeaPhrase("USER_LEVEL","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:29%" nowrap><span id="dtlUserLevel">&nbsp;</span></td></tr>';
	// Location, Supervisor
	strHtml += '<tr><th scope="row" class="plaintablerowheaderborderlite" style="width:17%">'+getSeaPhrase("JOB_PROFILE_6","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:33%" nowrap><span id="dtlLocation">&nbsp;</span></td>';
	strHtml += '<th scope="row" class="plaintablerowheaderborderlite" style="width:21%">'+getSeaPhrase("JOB_PROFILE_7","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:29%" nowrap><span id="dtlSupervisor">&nbsp;</span></td></tr>';
	// Salary Type, Union
	strHtml += '<tr><th scope="row" class="plaintablerowheaderborderlite" style="width:17%">'+getSeaPhrase("SALARY_TYPE","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:33%" nowrap><span id="dtlSalaryType">&nbsp;</span></td>';
	strHtml += '<th scope="row" class="plaintablerowheaderborderlite" style="width:21%">'+getSeaPhrase("JOB_PROFILE_10","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:29%" nowrap><span id="dtlUnion">&nbsp;</span></td></tr>';
	// Salary, Bargaining Unit
	strHtml += '<tr><th scope="row" class="plaintablerowheaderborderlite" style="width:17%">'+getSeaPhrase("SALARY","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:33%" nowrap><span id="dtlSalary">&nbsp;</span></td>';
	strHtml += '<th scope="row" class="plaintablerowheaderborderlite" style="width:21%">'+getSeaPhrase("BARGAINING_UNIT","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:29%" nowrap><span id="dtlBargainingUnit">&nbsp;</span></td></tr>';
	// Currency, Requested By
	strHtml += '<tr><th scope="row" class="plaintablerowheaderborderlite" style="width:17%">'+getSeaPhrase("QUAL_16","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:33%" nowrap><span id="dtlCurrency">&nbsp;</span></td>';
	strHtml += '<th scope="row" class="plaintablerowheaderborderlite" style="width:21%">'+getSeaPhrase("REQUESTED_BY","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:29%" nowrap><span id="dtlRequestedBy">&nbsp;</span></td></tr>';
	// Overtime, Budgeted
	strHtml += '<tr><th scope="row" class="plaintablerowheaderborderlite" style="width:17%">'+getSeaPhrase("OVERTIME","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:33%" nowrap><span id="dtlOvertime">&nbsp;</span></td>';
	strHtml += '<th scope="row" class="plaintablerowheaderborderlite" style="width:21%">'+getSeaPhrase("BUDGETED","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:29%" nowrap><span id="dtlBudgeted">&nbsp;</span></td></tr>';
	// Pay Schedule, Replacement
	strHtml += '<tr><th scope="row" class="plaintablerowheaderborderlite" style="width:17%">'+getSeaPhrase("PAY_SCHEDULE","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:33%" nowrap><span id="dtlPaySchedule">&nbsp;</span></td>';
	strHtml += '<th scope="row" class="plaintablerowheaderborderlite" style="width:21%">'+getSeaPhrase("REPLACEMENT","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:29%" nowrap><span id="dtlReplacement">&nbsp;</span></td></tr>';
	// Pay Grade, Replacement For
	strHtml += '<tr><th scope="row" class="plaintablerowheaderborderlite" style="width:17%">'+getSeaPhrase("PAY_GRADE","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:33%" nowrap><span id="dtlPayGrade">&nbsp;</span></td>';
	strHtml += '<th scope="row" class="plaintablerowheaderborderlite" style="width:21%">'+getSeaPhrase("REPLACEMENT_FOR","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:29%" nowrap><span id="dtlReplacementFor">&nbsp;</span></td></tr>';
	// Pay Step, Internal Posting Dates
	strHtml += '<tr><th scope="row" class="plaintablerowheaderborderlite" style="width:17%">'+getSeaPhrase("PAY_STEP","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:33%" nowrap><span id="dtlPayStep">&nbsp;</span></td>';
	strHtml += '<th scope="row" class="plaintablerowheaderborderlite" style="width:21%">'+getSeaPhrase("INTERNAL_POSTING_DATES","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:29%" nowrap><span id="dtlIntPostDates">&nbsp;</span></td></tr>';
	// Work Schedule, External Posting Dates
	strHtml += '<tr><th scope="row" class="plaintablerowheaderborderlite" style="width:17%">'+getSeaPhrase("WORK_SCHEDULE","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:33%" nowrap><span id="dtlWorkSchedule">&nbsp;</span></td>';
	strHtml += '<th scope="row" class="plaintablerowheaderborderlite" style="width:21%">'+getSeaPhrase("EXTERNAL_POSTING_DATES","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:29%" nowrap><span id="dtlExtPostDates">&nbsp;</span></td></tr>';
	// Shift, <Empty>
	strHtml += '<tr><th scope="row" class="plaintablerowheaderborderlite" style="width:17%">'+getSeaPhrase("SHIFT","ESS")+'</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:33%" nowrap><span id="dtlShift">&nbsp;</span></td>';
	strHtml += '<th scope="row" class="plaintablerowheaderborderlite" style="width:21%">&nbsp;</th>';
	strHtml += '<td class="plaintablecellborderdisplay" style="width:29%" nowrap>&nbsp;</td>';
	strHtml += '</tr></table>';
	try 
	{
		self.DETAIL.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DETAIL","ESS");
		self.DETAIL.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}
	self.DETAIL.stylePage();
	self.DETAIL.setLayerSizes();
	fitToScreen();
}

function FillBottomWindow(Index)
{
	var RecIndex = (typeof(Index) != "undefined") ? Index : PA42.CurrentIndex;
	var TempDatesExist = (NonSpace(PA42.TemporaryDatesBegin) || NonSpace(PA42.TemporaryDatesEnd))?true:false;
	var OvertimeExists = (PA42.ExemptFromOvertime.Code=="Y" || PA42.ExemptFromOvertime.Code=="N")?true:false;
	var SalaryClassExists = (PA42.SalaryClass.Code=="S" || PA42.SalaryClass.Code=="H")?true:false;
	var IntPostDatesExist = (NonSpace(PA42.InternalPostDateStart) || NonSpace(PA42.InternalPostDateStop))?true:false;
	var ExtPostDatesExist = (NonSpace(PA42.ExternalPostDateStart) || NonSpace(PA42.ExternalPostDateStop))?true:false;
	var SalaryExists = (NonSpace(PA42.SalaryBeginning) || NonSpace(PA42.SalaryEnd))?true:false;
	var Salary;
	if (PA42.SalaryEnd)
		Salary = PA42.SalaryBeginning+' - '+PA42.SalaryEnd;
	else
		Salary = PA42.SalaryBeginning;
	activateTableRow("jobReqsTbl",RecIndex,self.MAIN);
	var reqTbl = self.DETAIL.document.getElementById("jobReqDtlTbl");
	reqTbl.setAttribute("summary", getSeaPhrase("TSUM_17","SEA",[HrSuper[RecIndex].description]));
	reqTbl.caption.innerHTML = getSeaPhrase("TCAP_12","SEA",[HrSuper[RecIndex].description]);
	self.DETAIL.document.getElementById("dtlPosition").innerHTML = (PA42.Position.Description)?PA42.Position.Description:'&nbsp;';
	self.DETAIL.document.getElementById("dtlPhone").innerHTML = (PA42.WorkPhoneNumber)?PA42.WorkPhoneNumber:'&nbsp;';
	self.DETAIL.document.getElementById("dtlJob").innerHTML = (PA42.JobCode.Description)?PA42.JobCode.Description:'&nbsp;';
	self.DETAIL.document.getElementById("dtlExtension").innerHTML = (PA42.WorkPhoneExt)?PA42.WorkPhoneExt:'&nbsp;';
	self.DETAIL.document.getElementById("dtlOpenings").innerHTML = (PA42.RemainingOpen)?Number(MoveTrailingSignToFront(PA42.RemainingOpen)):'&nbsp;';
	self.DETAIL.document.getElementById("dtlPhoneCountry").innerHTML = (PA42.WorkPhoneCountry)?PA42.WorkPhoneCountry:'&nbsp;';
	self.DETAIL.document.getElementById("dtlFTE").innerHTML = (PA42.RemainingFTE)?PA42.RemainingFTE:'&nbsp;';
	self.DETAIL.document.getElementById("dtlEmpStatus").innerHTML = (PA42.EmployeeStatus.Description)?PA42.EmployeeStatus.Description:'&nbsp;';
	self.DETAIL.document.getElementById("dtlProcessLevel").innerHTML = (PA42.ProcessLevel.Description)?PA42.ProcessLevel.Description:'&nbsp;';
	self.DETAIL.document.getElementById("dtlTempDates").innerHTML = (TempDatesExist)?PA42.TemporaryDatesBegin+' - '+PA42.TemporaryDatesEnd:'&nbsp;';
	self.DETAIL.document.getElementById("dtlDepartment").innerHTML = (PA42.Department.Description)?PA42.Department.Description:'&nbsp;';
	self.DETAIL.document.getElementById("dtlUserLevel").innerHTML = (PA42.UserLevel.Description)?PA42.UserLevel.Description:'&nbsp;';
	self.DETAIL.document.getElementById("dtlLocation").innerHTML = (PA42.Location.Description)?PA42.Location.Description:'&nbsp;';
	self.DETAIL.document.getElementById("dtlSupervisor").innerHTML = (PA42.Supervisor.Description)?PA42.Supervisor.Description:'&nbsp;';
	self.DETAIL.document.getElementById("dtlSalaryType").innerHTML = (SalaryClassExists)?((PA42.SalaryClass.Code=="S")?getSeaPhrase("SALARIED","ESS"):getSeaPhrase("HOURLY","ESS")):'&nbsp;';
	self.DETAIL.document.getElementById("dtlUnion").innerHTML = (PA42.Union.Description)?PA42.Union.Description:'&nbsp;';
	self.DETAIL.document.getElementById("dtlSalary").innerHTML = (SalaryExists)?Salary:'&nbsp;';
	self.DETAIL.document.getElementById("dtlBargainingUnit").innerHTML = (PA42.BargainUnit.Description)?PA42.BargainUnit.Description:'&nbsp;';
	self.DETAIL.document.getElementById("dtlCurrency").innerHTML = (PA42.Currency.Description)?PA42.Currency.Description:'&nbsp;';
	self.DETAIL.document.getElementById("dtlRequestedBy").innerHTML = (PA42.RequestedBy.Description)?PA42.RequestedBy.Description:'&nbsp;';
	self.DETAIL.document.getElementById("dtlOvertime").innerHTML = (OvertimeExists)?((PA42.ExemptFromOvertime.Code=="Y")?getSeaPhrase("YES","ESS"):getSeaPhrase("NO","ESS")):getSeaPhrase("NA","ESS");
	self.DETAIL.document.getElementById("dtlBudgeted").innerHTML = (PA42.Budgeted.Code=="Y")?getSeaPhrase("YES","ESS"):getSeaPhrase("NO","ESS");
	self.DETAIL.document.getElementById("dtlPaySchedule").innerHTML = (PA42.Schedule.Description)?PA42.Schedule.Description:'&nbsp;';
	self.DETAIL.document.getElementById("dtlReplacement").innerHTML = (PA42.Replacement.Code=="Y")?getSeaPhrase("YES","ESS"):getSeaPhrase("NO","ESS");
	self.DETAIL.document.getElementById("dtlPayGrade").innerHTML = (PA42.Grade)?PA42.Grade:'&nbsp;';
	self.DETAIL.document.getElementById("dtlReplacementFor").innerHTML = (PA42.ReplacementEmployee.Description)?PA42.ReplacementEmployee.Description:'&nbsp;';
	self.DETAIL.document.getElementById("dtlPayStep").innerHTML = (PA42.Step)?PA42.Step:'&nbsp;';
	self.DETAIL.document.getElementById("dtlIntPostDates").innerHTML = (IntPostDatesExist)?PA42.InternalPostDateStart+' - '+PA42.InternalPostDateStop:'&nbsp;';
	self.DETAIL.document.getElementById("dtlWorkSchedule").innerHTML = (PA42.WorkSchedule.Description)?PA42.WorkSchedule.Description:'&nbsp;';
	self.DETAIL.document.getElementById("dtlExtPostDates").innerHTML = (ExtPostDatesExist)?PA42.ExternalPostDateStart+' - '+PA42.ExternalPostDateStop:'&nbsp;';
	self.DETAIL.document.getElementById("dtlShift").innerHTML = (PA42.Shift.Code)?PA42.Shift.Code:'&nbsp;';
	self.DETAIL.stylePage();
	self.DETAIL.setLayerSizes();
	document.getElementById("DETAIL").style.visibility = "visible";
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.DETAIL.getWinTitle()]));
	fitToScreen();
}

function GetDetail(Index)
{
	var nextFunc = function()
	{
		activateTableRow("jobReqsTbl",Index,self.MAIN);
	//GDD  06/23/14  Because sharing bottom window need this line
        PaintBottomWindow()
    //GDD end of change
		if (ReqStorage[HrSuper[Index].requisition]) 
		{
			PA42 = ReqStorage[HrSuper[Index].requisition];
			FillBottomWindow(Index);
		}
		else 
		{
			PA42 = new PA42Object();
			PA42.CurrentIndex = Index;
			PA42.Inquire(HrSuper[Index].requisition, "StoreReqData");
		}
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);	
}

function StoreReqData()
{
	ReqStorage[HrSuper[PA42.CurrentIndex].requisition] = PA42;
	FillBottomWindow(PA42.CurrentIndex);
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
	var winObj = getWinSize();
	var winWidth = winObj[0];	
	var winHeight = winObj[1];
	var contentWidth;
	var contentBorderWidth;
	var contentTopHeight;
	var contentTopBorderHeight;
	var contentBottomHeight;
	var contentBottomBorderHeight;
	if (window.styler && window.styler.showInfor)
	{
		contentWidth = winWidth - 10;
		contentBorderWidth = (navigator.appName.indexOf("Microsoft") >= 0) ? contentWidth + 5 : contentWidth + 2;
		contentTopHeight = parseInt(winHeight*.50,10) - 60;
		contentTopBorderHeight = (navigator.appName.indexOf("Microsoft") >= 0) ? contentTopHeight + 30 : contentTopHeight + 25;
		contentBottomHeight = parseInt(winHeight*.50,10) - 35;
		contentBottomBorderHeight = (navigator.appName.indexOf("Microsoft") >= 0) ? contentBottomHeight + 30 : contentBottomHeight + 25;		
	}
	else if (window.styler && (window.styler.showLDS || window.styler.showInfor3))
	{
		contentWidth = winWidth - 20;
		contentBorderWidth = (window.styler.showInfor3) ? contentWidth + 7 : contentWidth + 17;
		contentTopHeight = parseInt(winHeight*.50,10) - 75;
		contentTopBorderHeight = (navigator.appName.indexOf("Microsoft") >= 0) ? contentTopHeight + 30 : contentTopHeight + 25;
		contentBottomHeight = parseInt(winHeight*.50,10) - 55;
		contentBottomBorderHeight = (navigator.appName.indexOf("Microsoft") >= 0) ? contentBottomHeight + 30 : contentBottomHeight + 25;
	}
	else
	{
		contentWidth = winWidth - 10;
		contentBorderWidth = contentWidth;
		contentTopHeight = parseInt(winHeight*.50,10) - 60;
		contentTopBorderHeight = contentTopHeight + 24;
		contentBottomHeight = parseInt(winHeight*.50,10) - 40;
		contentBottomBorderHeight = contentBottomHeight + 24;			
	}	
	if (self.MAIN.onresize && self.MAIN.onresize.toString().indexOf("setLayerSizes") >= 0)
		self.MAIN.onresize = null;
	try
	{
		document.getElementById("MAIN").style.width = winWidth + "px";
		document.getElementById("MAIN").style.height = parseInt(winHeight*.50,10) + "px";
		self.MAIN.document.getElementById("paneBorder").style.width = contentBorderWidth + "px";
		self.MAIN.document.getElementById("paneBorder").style.height = contentTopBorderHeight + "px";		
		self.MAIN.document.getElementById("paneBodyBorder").style.width = contentWidth + "px";
		self.MAIN.document.getElementById("paneBodyBorder").style.height = contentTopHeight + "px";
		self.MAIN.document.getElementById("paneBody").style.width = contentWidth + "px";
		self.MAIN.document.getElementById("paneBody").style.height = contentTopHeight + "px";
		self.MAIN.document.getElementById("paneBody").style.overflow = "auto";		
	}
	catch(e) {}
	if (self.DETAIL.onresize && self.DETAIL.onresize.toString().indexOf("setLayerSizes") >= 0)
		self.DETAIL.onresize = null;
	try
	{
		document.getElementById("DETAIL").style.width = winWidth + "px";
		document.getElementById("DETAIL").style.top = parseInt(winHeight*.50,10) + "px";
		document.getElementById("DETAIL").style.height = parseInt(winHeight*.50,10) + "px";
		self.DETAIL.document.getElementById("paneBorder").style.width = contentBorderWidth + "px";
		self.DETAIL.document.getElementById("paneBorder").style.height = contentBottomBorderHeight + "px";		
		self.DETAIL.document.getElementById("paneBodyBorder").style.width = contentWidth + "px";
		self.DETAIL.document.getElementById("paneBodyBorder").style.height = contentBottomHeight + "px";
		self.DETAIL.document.getElementById("paneBody").style.width = contentWidth + "px";
		self.DETAIL.document.getElementById("paneBody").style.height = contentBottomHeight + "px";
		self.DETAIL.document.getElementById("paneBody").style.overflow = "auto";		
	}
	catch(e) {}	
}
//GDD  06/19/14 Added new functions

function ViewApprovers(reqnbr)
{
	for (var i=0;i<10;i++) ApproverName[i] = '';
	CurReqNbr = reqnbr;
	var pDMEObj 	= new DMEObject(authUser.prodline, "PAJOBREQ");
	pDMEObj.out 	= "JAVASCRIPT";
	pDMEObj.index 	= "PJRSET1";
	pDMEObj.field 	= "nbr-approvals;approval-desc;approval-date;approval-emp"
	pDMEObj.key 	= String(authUser.company)+"="+reqnbr;
	pDMEObj.func 	= "GetApproverNames()";
	pDMEObj.exclude = "drills;keys";
	pDMEObj.debug 	= false;
	DME(pDMEObj,"jsreturn");
}

function GetApproverNames()
{
	var idx = 0;
	ApproverList = ApproverList.concat(self.jsreturn.record);
	NbrApprs = parseInt(ApproverList[0].nbr_approvals);
	GetNextAppName(idx);
}

function ShowApproverWindow()
{
	var strHtml = '<table border="0" cellspacing="0" cellpadding="0" width="100%">\n';
	strHtml += '<tr>\n';
	strHtml += '<th class="plaintableheaderborder" style="text-align:center;width:33%">Title</th>\n';
	strHtml += '<th class="plaintableheaderborder" style="text-align:center;width:33%">Employee</th>\n';
	strHtml += '<th class="plaintableheaderborder" style="text-align:center;width:33%">Date</th>\n';
	strHtml += '</tr>\n';
	// First Approver
	strHtml += '<tr>\n';
	strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_desc_1+'</td>\n';
	strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverName[0]+'</td>\n';
	strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_date_1+'</td>\n';
	strHtml += '</tr>\n';

	if (NbrApprs > 0) {
		// Second Approver
		strHtml += '<tr>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_desc_2+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverName[1]+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_date_2+'</td>\n';
		strHtml += '</tr>\n';
	}

	if (NbrApprs > 1) {
		// Third Approver
		strHtml += '<tr>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_desc_3+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverName[2]+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_date_3+'</td>\n';
		strHtml += '</tr>\n';
	}
	if (NbrApprs > 2) {
		// Fourth Approver
		strHtml += '<tr>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_desc_4+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverName[3]+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_date_4+'</td>\n';
		strHtml += '</tr>\n';
	}
	if (NbrApprs > 3) {
		// Fifth Approver
		strHtml += '<tr>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_desc_5+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverName[4]+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_date_5+'</td>\n';
		strHtml += '</tr>\n';
	}
	if (NbrApprs > 4) {
		// Sixth Approver
		strHtml += '<tr>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_desc_6+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverName[5]+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_date_6+'</td>\n';
		strHtml += '</tr>\n';
	} 
	if (NbrApprs > 5) {
		// Seventh Approver
		strHtml += '<tr>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_desc_7+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverName[6]+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_date_7+'</td>\n';
		strHtml += '</tr>\n';
	} 
	if (NbrApprs > 6) {
		// Eighth Approver
		strHtml += '<tr>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_desc_8+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverName[7]+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_date_8+'</td>\n';
		strHtml += '</tr>\n';
	} 
	if (NbrApprs > 7) {
		// Nineth Approver
		strHtml += '<tr>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_desc_9+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverName[8]+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_date_9+'</td>\n';
		strHtml += '</tr>\n';
	} 
	if (NbrApprs > 8) {
		// Tenth Approver
		strHtml += '<tr>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_desc_10+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverName[9]+'</td>\n';
		strHtml += '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'+ApproverList[0].approval_date_10+'</td>\n';
		strHtml += '</tr>\n';
	} 
	strHtml += '</tr>\n';
	strHtml += '</table>\n';

	try {
		self.DETAIL.document.getElementById("paneHeader").innerHTML = "Requisition "+CurReqNbr+" Approvals";
		self.DETAIL.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}

	self.DETAIL.stylePage();
	self.DETAIL.setLayerSizes();
	document.getElementById("DETAIL").style.visibility = "visible";
	fitToScreen();
} 

function GetNextAppName(idx)
{
	var empnbr;
	if (idx < NbrApprs) {
		var setfldname = 'empnbr = ApproverList[0].approval_emp_'+(idx+1);
		eval(setfldname);
		if (empnbr != "") {
			var pDMEObj 	= new DMEObject(authUser.prodline, "EMPLOYEE");
			pDMEObj.out 	= "JAVASCRIPT";
			pDMEObj.index 	= "EMPSET1";
			pDMEObj.field 	= "full-name"
			pDMEObj.key 	= String(authUser.company)+"="+empnbr;
			pDMEObj.func 	= "SaveApproverName("+idx+")";
			pDMEObj.exclude = "drills;keys";
			pDMEObj.debug 	= false;
			DME(pDMEObj,"jsreturn");
		}
		else {
			ApproverName[idx] = '';
			idx++;
			GetNextAppName(idx);
		}
	}
	else {
		ShowApproverWindow()
	}		
}

function SaveApproverName(idx)
{
	ApproverName[idx] = self.jsreturn.record[0].full_name;
	idx++
	GetNextAppName(idx);
}  
//GDD End of Change
</script>
</head>
<body style="width:100%;height:100%;overflow:hidden" onload="Initialize()" onresize="fitToScreen()">
	<iframe id="header" name="header" title="Header" level="1" tabindex="0" style="visibility:hidden;position:absolute;height:32px;width:803px;left:10px;top:0px" src="/lawson/xhrnet/ui/header.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="MAIN" name="MAIN" title="Main Content" level="2" tabindex="0" src="/lawson/xhrnet/ui/headerpane.htm" style="visibility:hidden;position:absolute;left:0px;width:803px;top:32px;height:190px;" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="DETAIL" name="DETAIL" title="Secondary Content" level="3" tabindex="0" style="visibility:hidden;position:absolute;left:0px;width:803px;top:222px;height:334px;"src="/lawson/xhrnet/ui/headerpanelite.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="jsreturn" name="jsreturn" title="Empty" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/dot.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="lawheader" name="lawheader" title="Empty" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/JobRequisitions/Lib/SEA_LAW.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@10.00.05.00.27 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/JobRequisitions/RequisitionSummary/SHR024.htm,v 1.15.2.47.2.1 2014/08/05 04:24:14 kevinct Exp $ -->
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