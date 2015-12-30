<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width" />
<meta http-equiv="pragma" content="No-Cache" />
<meta http-equiv="expires" content="Mon, 01 Jan 1990 00:00:01 GMT" />
<title>New Job Requisition</title>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<script src="/lawson/webappjs/transaction.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/xhrnet/waitalert.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"> </script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"> </script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"> </script>
<script src="/lawson/webappjs/javascript/objects/ActivityDialog.js"> </script>
<script src="/lawson/webappjs/javascript/objects/OpaqueCover.js"> </script>
<script src="/lawson/webappjs/javascript/objects/Dialog.js"> </script>
<!-- New Job Reqs specific files... -->
<script src="/lawson/xhrnet/JobRequisitions/NewJobRequisitions/SHR031_AGS.js"></script>
<script src="/lawson/xhrnet/JobRequisitions/NewJobRequisitions/SHR031_DME.js"></script>
<script src="/lawson/xhrnet/JobRequisitions/NewJobRequisitions/SHR031_CMN.js"></script>
<!-- Load any additional libraries here... -->
<script src="/lawson/xhrnet/JobRequisitions/Lib/PA42.js"></script>
<!-- GDD  08/14/14  Add new object for adding comments-->
<script src="/lawson/xhrnet/JobRequisitions/Lib/PA46.js"></script>
<script language="JavaScript">
///////////////////////////////////////////////////////////////////////////////////////////
//
// Global Variables
//
var mX, mY;
var PA42;
var Selects;
//GDD  03/18/14  Added variables
var isGrant = false;
var PA46;
var vartotexp;
var vartothrs;
var pctothrs;

///////////////////////////////////////////////////////////////////////////////////////////
//
// Initialize function.
//
function Initialize()
{
	clearTimeout(Timer);
	setLayerSizes();
	authenticate("frameNm='jsreturn'|funcNm='AuthenticateFinished()'|desiredEdit='EM'");
}

///////////////////////////////////////////////////////////////////////////////////////////
//
// Initialization Complete function.
//
function AuthenticateFinished()
{
	stylePage();
	var title = getSeaPhrase("NEW_JOB_REQ","ESS");
	setWinTitle(title);
	setTaskHeader("header",title,"Manager");
	Selects = new SelectObject();
	showWaitAlert(getSeaPhrase("WAIT","ESS"), GetDME_HRSUPER);
}

function StartOver()
{
	self.right.document.newjobreqdtlform.reset();
	document.getElementById("right").style.visibility = "hidden";
	self.left.document.newjobreqform.reset();
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.left.getWinTitle()]));
}

function DrawLeftWindow()
{
	PA42 = new PA42Object();
	//GDD  07/08/14  Added new object for comments
	PA46 = new PA46Object();
        //GDD end of change
	var toolTip = dmeFieldToolTip("position");
	var jobRecHtml = '<form name="newjobreqform">'
	+ '<input class="inputbox" type="hidden" name="positioncode" value="">'
	+ '<table border="0" cellspacing="0" cellpadding="0" style="width:100%" role="presentation">'
	+ '<tr><td class="fieldlabelboldleft" colspan="3">'+getSeaPhrase("ENTER_INFO_BELOW","ESS")+'</td></tr>'
	+ '<tr><td class="plaintablerowheader" style="width:40%">'+uiRequiredFooter()+'</td><td>&nbsp;</td></tr>'
	+ '<tr><td class="plaintablerowheader" style="width:40%"><label for="position">'+getSeaPhrase("JOB_PROFILE_8","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="position" name="position" value="" size="30" maxlength="30" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'position\');">'
	+ '<a href="javascript:parent.openDmeFieldFilter(\'position\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
	+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a></td></tr>'
	+ '<tr><td class="plaintablerowheader" style="width:40%"><label for="job">'+getSeaPhrase("JOB_PROFILE_9","ESS")+'</label></td>'
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("job");
		jobRecHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="hidden" name="jobcode" value="">'
		+ '<input class="inputbox" type="text" id="job" name="job" fieldnm="job" value="" size="30" maxlength="30" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'job\');">'
		+ '<a href="javascript:parent.openDmeFieldFilter(\'job\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
		+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a></td></tr>'
	}
	else
		jobRecHtml += '<td class="plaintablecell" nowrap><select class="inputbox" id="job" name="job">'+BuildJobSelect("")+'</select></td></tr>'
	//GDD  03/18/14   Added is grant field
	jobRecHtml += '<tr><th class="plaintablerowheader" style="width:40%">Grant</th><td class="plaintablecell"><input class="checkbox" type="checkbox" name="isgrant" value="N" onclick="parent.checkGrant(this);return true;"</td></tr>'
    //GDD end of change 
	toolTip = uiDateToolTip(getSeaPhrase("DATE_NEEDED","ESS"));
	jobRecHtml += '<tr><td class="plaintablerowheader" style="width:40%;vertical-align:top"><label id="dateneededLbl" for="dateneeded">'+getSeaPhrase("DATE_NEEDED","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="dateneeded" name="dateneeded" value="" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)" aria-labelledby="dateneededLbl dateneededFmt">'
	+ '<a href="javascript:;" onclick="parent.DateSelect(\'dateneeded\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiRequiredIcon()+'<br/>'+uiDateFormatSpan("dateneededFmt")+'</td></tr>'
	+ '<tr><td class="plaintablerowheaderborderbottom" style="width:40%"><label for="reqstatus">'+getSeaPhrase("STATUS","ESS")+'</label></td>'
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("status");
		jobRecHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="hidden" name="statuscode" value="">'
		+ '<input class="inputbox" type="text" id="reqstatus" name="status" fieldnm="status" value="" size="30" maxlength="30" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'status\');">'
		+ '<a href="javascript:parent.openDmeFieldFilter(\'status\')" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
		+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'+uiRequiredIcon()+'</td></tr>'
	}
	else
		jobRecHtml += '<td class="plaintablecell" id="status" nowrap><select class="inputbox" id="reqstatus" name="status">'+BuildStatusSelect("")+'</select>'+uiRequiredIcon()+'</td></tr>'
	//GDD  07/07/14  Add new fields for productivity
        jobRecHtml += '<tr><th class="plaintablerowheaderlite" style="width:45%">Actual Total Expenses</th>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="acttotexp" value="" size="15" maxlength="15" onfocus="this.select()">'+uiRequiredIcon()+'</td></tr>'
        + '<tr><th class="plaintablerowheaderlite" style="width:45%">Budgeted Total Expenses</th>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="budtotexp" value="" size="15" maxlength="15" onfocus="this.select()">'+uiRequiredIcon()+'</td></tr>'
        + '<tr><th class="plaintablerowheaderlite" style="width:45%">Actual Total Worked Hours</th>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="acttothrs" value="" size="4" maxlength="4" onfocus="this.select()">'+uiRequiredIcon()+'</td></tr>'
        + '<tr><th class="plaintablerowheaderlite" style="width:45%">Budgeted Total Worked Hours</th>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="budtothrs" value="" size="4" maxlength="4" onfocus="this.select()">'+uiRequiredIcon()+'</td></tr>'
        + '<tr><th class="plaintablerowheaderlite" style="width:45%">OT Hours YTD</th>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="othrs" value="" size="4" maxlength="4" onfocus="this.select()">'+uiRequiredIcon()+'</td></tr>'
        + '<tr><th class="plaintablerowheaderlite" style="width:45%">Worked Hours YTD</th>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="workedhrs" value="" size="4" maxlength="4" onfocus="this.select()">'+uiRequiredIcon()+'</td></tr>'
        + '<tr><th class="plaintablerowheaderlite" style="width:45%">Action OI Benchmark Percentile</th>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="actoibench" value="" size="6" maxlength="6" onfocus="this.select()">'+uiRequiredIcon()+'</td></tr>'
	//GDD end of change
	jobRecHtml += '<tr><td>&nbsp;</td><td class="plaintablecell">'
	+ uiButton(getSeaPhrase("CONTINUE","ESS"),"parent.Continue();return false","margin-top:10px")	
	//GDD  05/05/14  Add instructions
        jobRecHtml += '</td></tr></table><p><b>Instructions:</b></p>'
	+ '<p>When entering a new Job Requisition, please follow the steps below:<br>'
	+ '<ol><li>Prior to initiating a requisition, please make sure you review your productivity dashboard and are within your accept able range.  Additional instructions for locating this information is located <a href="http://inside.slrmc.org/organizational_development/leadingatlukes.php" target="_blank">here</a> under Leader/Manager Toolkits > Position Requests.</li>'
	+ '<li>If this is a new position please click on the following link <a href="mailto:compensationquestions@slhs.org">compensationquestions@slhs.org</a> to request a job description review prior to proceeding.</li>'
	+ '<li>You must select a position code from the dropdown above. It is optional to select the Job Code. If you do not select one, the correct corresponding Job Code will be selected for you.</li>'
	+ '<li>Make sure to check the checkbox if position is funded by a grant.</li>'
	+ '<li>For Date needed = date need position filled by.</li>'
	+ '</ol></p>'
	+ '<br><br></form>'
        //GDD  end of change
//	+ '</td></tr></table></form>'
	try 
	{
		self.left.document.getElementById("paneHeader").innerHTML = getSeaPhrase("REQUISITION","ESS");
		self.left.document.getElementById("paneBody").innerHTML = jobRecHtml;
		self.left.stylePage();
		self.left.setLayerSizes();
	}
	catch(e) {}
	document.getElementById("left").style.visibility = "visible";
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.left.getWinTitle()]));
	fitToScreen();	
}

var jobCode;
var statusCode;
var jobForm;

function Continue()
{
	jobForm = self.left.document.newjobreqform;
	if (emssObjInstance.emssObj.filterSelect)
		clearRequiredField(jobForm.status);
	else
		clearRequiredField(self.left.document.getElementById("status"));
	clearRequiredField(jobForm.position);
	clearRequiredField(jobForm.dateneeded);
   	if (NonSpace(jobForm.dateneeded.value) == 0)
   	{
   		setRequiredField(jobForm.dateneeded, getSeaPhrase("DATE_REQUIRED","ESS"));
       	return;
   	}
  	if (ValidDate(jobForm.dateneeded) == false)
      	return;
   	if ((!emssObjInstance.emssObj.filterSelect && (jobForm.status.selectedIndex == 0))
   	|| (emssObjInstance.emssObj.filterSelect && (NonSpace(jobForm.statuscode.value) == 0)))
   	{
   		if (emssObjInstance.emssObj.filterSelect)
   			setRequiredField(jobForm.status, getSeaPhrase("STATUS_REQUIRED","ESS"));
   		else
   			setRequiredField(self.left.document.getElementById("status"), getSeaPhrase("STATUS_REQUIRED","ESS"), jobForm.status);
       	return;
   	}
	if (emssObjInstance.emssObj.filterSelect)
	{
		jobCode = jobForm.jobcode.value;
		statusCode = jobForm.statuscode.value;
	}
	else
	{
		jobCode = jobForm.job.options[jobForm.job.selectedIndex].value;
		statusCode = jobForm.status.options[jobForm.status.selectedIndex].value;
	}
//GDD  07/08/14   Add additional edits
	var acttotexpObj = jobForm.acttotexp;
	var budtotexpObj = jobForm.budtotexp;
	var acttothrsObj = jobForm.acttothrs;
	var budtothrsObj = jobForm.budtothrs;
	var othrsObj = jobForm.othrs;
	var workedhrsObj = jobForm.workedhrs;
	var actoibenchObj = jobForm.actoibench;
   	if (NonSpace(jobForm.acttotexp.value) == 0)
   	{
   		setRequiredField(jobForm.acttotexp);
     	seaAlert("Actual Total Expenses is required");
       	jobForm.acttotexp.focus();
       	jobForm.acttotexp.select();
       	return;
   	}
   	if (NonSpace(jobForm.budtotexp.value) == 0)
   	{
   		setRequiredField(jobForm.budtotexp);
     	seaAlert("Budgeted Total Expenses is required");
       	jobForm.budtotexp.focus();
       	jobForm.budtotexp.select();
       	return;
   	}
   	if (NonSpace(jobForm.acttothrs.value) == 0)
   	{
   		setRequiredField(jobForm.acttothrs);
     	seaAlert("Actual Total Hours is required");
       	jobForm.acttothrs.focus();
       	jobForm.acttothrs.select();
       	return;
   	}
   	if (NonSpace(jobForm.budtothrs.value) == 0)
   	{
   		setRequiredField(jobForm.budtothrs);
     	seaAlert("Budgeted Total Hours is required");
       	jobForm.budtothrs.focus();
       	jobForm.budtothrs.select();
       	return;
   	}
   	if (NonSpace(jobForm.othrs.value) == 0)
   	{
   		setRequiredField(jobForm.othrs);
     	seaAlert("OT Hours is required");
       	jobForm.othrs.focus();
       	jobForm.othrs.select();
       	return;
   	}
   	if (NonSpace(jobForm.workedhrs.value) == 0)
   	{
   		setRequiredField(jobForm.workedhrs);
     	seaAlert("Worked Hours is required");
       	jobForm.workedhrs.focus();
       	jobForm.workedhrs.select();
       	return;
   	}
   	if (NonSpace(jobForm.actoibench.value) == 0)
   	{
   		setRequiredField(jobForm.actoibench);
     	seaAlert("Action OI Benchmark Percentile is required");
       	jobForm.actoibench.focus();
       	jobForm.actoibench.select();
       	return;
   	}
	if (!ValidNumber(acttotexpObj,13,2))
	{
		setRequiredField(acttotexpObj);
		seaAlert("Must enter a valid dollar amount");
		acttotexpObj.focus();
		acttotexpObj.select();
		return;
	}
	if (!ValidNumber(budtotexpObj,13,2))
	{
		setRequiredField(budtotexpObj);
		seaAlert("Must enter a valid dollar amount");
		budtotexpObj.focus();
		budtotexpObj.select();
		return;
	}
    vartotexp = parseFloat(jobForm.acttotexp.value) - parseFloat(jobForm.budtotexp.value)
	if (!ValidNumber(acttothrsObj,4,0))
	{
		setRequiredField(acttothrsObj);
		seaAlert("Must enter valid hours");
		acttothrsObj.focus();
		acttothrsObj.select();
		return;
	}
	if (!ValidNumber(budtothrsObj,4,0))
	{
		setRequiredField(budtothrsObj);
		seaAlert("Must enter valid hours");
		budtothrsObj.focus();
		budtothrsObj.select();
		return;
	}
    vartothrs = parseFloat(jobForm.acttothrs.value) - parseFloat(jobForm.budtothrs.value)
	if (!ValidNumber(othrsObj,4,0))
	{
		setRequiredField(othrsObj);
		seaAlert("Must enter valid hours");
		othrsObj.focus();
		othrsObj.select();
		return;
	}
	if (!ValidNumber(workedhrsObj,4,0))
	{
		setRequiredField(workedhrsObj);
		seaAlert("Must enter valid hours");
		workedhrsObj.focus();
		workedhrsObj.select();
		return;
	}
    if (parseFloat(jobForm.othrs.value) > 0 && parseFloat(jobForm.workedhrs.value) > 0)
        pcttothrs = (parseFloat(jobForm.othrs.value) / parseFloat(jobForm.workedhrs.value)) * 100
    else 
        pcttothrs = 0;
	if (!ValidNumber(actoibenchObj,5,2))
	{
		setRequiredField(actoibenchObj);
		seaAlert("Must enter a valid percentage");
		actoibenchObj.focus();
		actoibenchObj.select();
		return;
	}
//GDD end of change
	if (NonSpace(jobForm.positioncode.value)) 
	{
		if (document.getElementById("right").style.visibility == "visible") 
		{
			if (seaConfirm(getSeaPhrase("REQUISITION_KEY_CHANGED","ESS"), "", ConfirmFillDefaults))
				fillDefaults();
		}
		else 
			fillDefaults();
	}
	else 
	{
		if ((!emssObjInstance.emssObj.filterSelect && (jobForm.job.selectedIndex > 0)) || (emssObjInstance.emssObj.filterSelect && NonSpace(jobCode) > 0))
			showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), DrawRightWindow);
		else
			setRequiredField(jobForm.position, getSeaPhrase("JOB_OR_POS_REQUIRED","ESS"));
	}
}

function fillDefaults()
{
	var nextFunc = function() { PA42.FillDefaults(jobForm.positioncode.value,jobCode,formjsDate(formatDME(jobForm.dateneeded.value)),statusCode,"FillDefaults_Done"); };
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function DrawRightWindow()
{
//GDD  11/25/14  Add dropdown select on active status only
	var object 	= new DMEObject(authUser.prodline,"EMSTATUS")
	object.out 	= "JAVASCRIPT"
	object.index	= "emsset1"
	object.field	= "emp-status;description"
	object.key	= String(authUser.company)+"=AA;AF;AK;AP;AV";
	object.cond 	= "active";
	object.func     = "LoadEmpStatus()";
	object.max	= "600"
	object.debug 	= false;
	DME(object,"jsreturn")

}

function LoadEmpStatus()
{
 	
//GDD  end of change
	// Job Code
	// PT 147313. Override position with default value on a "Fill Defaults" action.
	var jobForm = self.left.document.newjobreqform;
	if (NonSpace(jobForm.position.value) > 0 && NonSpace(PA42.JobCode.Code) > 0)
		SetJobCode(PA42.JobCode, jobForm);
	var toolTip;
	// Process Level, Department, Location, Supervisor
	var jobRecHtml = '<form name="newjobreqdtlform">'
	+ '<input class="inputbox" type="hidden" name="payschedulecode" value="'+PA42.Schedule.Code+'">'
	+ '<input class="inputbox" type="hidden" name="paygradecode" value="'+PA42.Grade+'">'
	+ '<input class="inputbox" type="hidden" name="paystepcode" value="'+PA42.Step+'">'
	+ '<table border="0" cellspacing="0" cellpadding="0" style="width:100%" summary="+getSeaPhrase("TSUM_92","SEA")+">'
	+ '<caption class="offscreen">'+getSeaPhrase("TCAP_71","SEA")+'</caption>'
	+ '<tr><th scope="col" colspan="2"></th></tr>'
	+ '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="processlevel">'+getSeaPhrase("JOB_PROFILE_3","ESS")+'</label></th>'
	//GDD   11/24/14  Added red asterik to required fields
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("processlevel");
		jobRecHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="hidden" name="plrecruitflag" value="'+PA42.RecruitingFlag+'">'
		+ '<input class="inputbox" type="hidden" name="processlevelcode" value="'+PA42.ProcessLevel.Code+'">'+uiRequiredIcon()
		+ '<input class="inputbox" type="text" id="processlevel" name="processlevel" fieldnm="processlevel" value="'+PA42.ProcessLevel.Description+'" size="30" maxlength="30" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'processlevel\');">'
		+ '<a href="javascript:parent.openDmeFieldFilter(\'processlevel\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
		+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a></td></tr>'
	}
	else
		jobRecHtml += '<td class="plaintablecell" nowrap><select class="inputbox" id="processlevel" name="processlevel" style="width:205px" onclick="parent.GetProcessLevel()">'+BuildProcessLevelSelect(PA42.ProcessLevel.Code,PA42.ProcessLevel.Description)+'</select>'+uiRequiredIcon()+'</td></tr>'
	jobRecHtml += '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="department">'+getSeaPhrase("JOB_PROFILE_4","ESS")+'</label></th>'
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("department");
		jobRecHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="hidden" name="departmentcode" value="'+PA42.Department.Code+'">'+uiRequiredIcon()
		+ '<input class="inputbox" type="text" id="department" name="department" fieldnm="department" value="'+PA42.Department.Description+'" size="30" maxlength="30" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'department\');">'
		+ '<a href="javascript:parent.openDmeFieldFilter(\'department\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
		+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a></td></tr>'
	}
	else
		jobRecHtml += '<td class="plaintablecell" nowrap><select class="inputbox" id="department" name="department" style="width:205px" onclick="parent.GetDepartment()">'+BuildDepartmentSelect(PA42.Department.Code,PA42.Department.Description)+'</select>'+uiRequiredIcon()+'</td></tr>'
	jobRecHtml += '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="location">'+getSeaPhrase("JOB_PROFILE_6","ESS")+'</label></th>'
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("location");
		jobRecHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="hidden" name="locationcode" value="'+PA42.Location.Code+'">'
		+ '<input class="inputbox" type="text" id="location" name="location" fieldnm="location" value="'+PA42.Location.Description+'" size="30" maxlength="30" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'location\');">'+uiRequiredIcon()
		+ '<a href="javascript:parent.openDmeFieldFilter(\'location\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
		+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a></td></tr>'
	}
	else
		jobRecHtml += '<td class="plaintablecell" nowrap><select class="inputbox" id="location" name="location" style="width:205px">'+BuildLocationSelect(PA42.Location.Code)+'</select>'+uiRequiredIcon()+'</td></tr>'
	jobRecHtml += '<tr style="padding-bottom:20px"><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="supervisor">'+getSeaPhrase("JOB_PROFILE_7","ESS")+'</label></th>'
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("supervisor");
		jobRecHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="hidden" name="supervisorcode" value="'+PA42.Supervisor.Code+'">'+uiRequiredIcon()
		+ '<input class="inputbox" type="text" id="supervisor" name="supervisor" fieldnm="supervisor" value="'+PA42.Supervisor.Description+'" size="30" maxlength="30" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'supervisor\');">'
		+ '<a href="javascript:parent.openDmeFieldFilter(\'supervisor\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
		+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a></td></tr>'
	}
	else
		jobRecHtml += '<td class="plaintablecell" nowrap><select class="inputbox" id="supervisor" name="supervisor" style="width:205px" onclick="parent.GetSupervisor()">'+BuildSupervisorSelect(PA42.Supervisor.Code,PA42.Supervisor.Description)+'</select>'+uiRequiredIcon()+'</td></tr>'
	// Union, Bargaining Unit, User Level
	//GDD  11/24/14  Suppress these fields.
	//jobRecHtml += '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="union">'+getSeaPhrase("JOB_PROFILE_10","ESS")+'</label></th>'
	//if (emssObjInstance.emssObj.filterSelect)
	//{
	//	toolTip = dmeFieldToolTip("union");
	//	jobRecHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="hidden" name="unioncode" value="'+PA42.Union.Code+'">'
	//	+ '<input class="inputbox" type="text" id="union" name="union" fieldnm="union" value="'+PA42.Union.Description+'" size="30" maxlength="30" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'union\');">'
	//	+ '<a href="javascript:parent.openDmeFieldFilter(\'union\')" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
	//	+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a></td></tr>'
	//}
	//else
	//	jobRecHtml += '<td class="plaintablecell" nowrap><select class="inputbox" id="union" name="union" style="width:205px">'+BuildUnionSelect(PA42.Union.Code)+'</select></td></tr>'
	//jobRecHtml += '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="bargainunit">'+getSeaPhrase("BARGAINING_UNIT","ESS")+'</label></th>'
	//if (emssObjInstance.emssObj.filterSelect)
	//{
	//	toolTip = dmeFieldToolTip("bargainunit");
	//	jobRecHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="hidden" name="bargainunitcode" value="'+PA42.BargainUnit.Code+'">'
	//	+ '<input class="inputbox" type="text" id="bargainunit" name="bargainunit" fieldnm="bargainunit" value="'+PA42.BargainUnit.Description+'" size="30" maxlength="30" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'bargainunit\');">'
	//	+ '<a href="javascript:parent.openDmeFieldFilter(\'bargainunit\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
	//	+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a></td></tr>'
	//}
	//else
	//	jobRecHtml += '<td class="plaintablecell" nowrap><select class="inputbox" id="bargainunit" name="bargainunit" style="width:205px">'+BuildBargainUnitSelect(PA42.BargainUnit.Code)+'</select></td></tr>'
	//jobRecHtml += '<tr style="padding-bottom:20px"><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="userlevel">'+getSeaPhrase("USER_LEVEL","ESS")+'</label></th>'
	//if (emssObjInstance.emssObj.filterSelect)
	//{
	//	toolTip = dmeFieldToolTip("userlevel");
	//	jobRecHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="hidden" name="userlevelcode" value="'+PA42.UserLevel.Code+'">'
	//	+ '<input class="inputbox" type="text" id="userlevel" name="userlevel" fieldnm="userlevel" value="'+PA42.UserLevel.Description+'" size="30" maxlength="30" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'userlevel\');">'
	//	+ '<a href="javascript:parent.openDmeFieldFilter(\'userlevel\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
	//	+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a></td></tr>'
	//}
	//else
	//	jobRecHtml += '<td class="plaintablecell" nowrap><select class="inputbox" id="userlevel" name="userlevel" style="width:205px">'+BuildUserLevelSelect(PA42.UserLevel.Code)+'</select></td></tr>'
	jobRecHtml += '<input class="inputbox" type="hidden" name="unioncode" value="'+PA42.Union.Code+'">'
	jobRecHtml += '<input class="inputbox" type="hidden" name="bargainunitcode" value="'+PA42.BargainUnit.Code+'">'
	jobRecHtml += '<input class="inputbox" type="hidden" name="userlevelcode" value="'+PA42.UserLevel.Code+'">'
	//GDD end of change
	// Employee Status, Temporary Dates
	jobRecHtml += '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="employeestatus">'+getSeaPhrase("EMPLOYEE_STATUS","ESS")+'</label></th>'
	//GDD  11/24/14  Change dropdown for Employee Status
	//if (emssObjInstance.emssObj.filterSelect)
	//{
	//	toolTip = dmeFieldToolTip("employeestatus");
	//	jobRecHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="hidden" name="employeestatuscode" value="'+PA42.EmployeeStatus.Code+'">'
	//	+ '<input class="inputbox" type="text" id="employeestatus" name="employeestatus" fieldnm="employeestatus" value="'+PA42.EmployeeStatus.Description+'" size="30" maxlength="30" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'employeestatus\');">'+uiRequiredIcon()
	//	+ '<a href="javascript:parent.openDmeFieldFilter(\'employeestatus\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
	//	+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a></td></tr>'
	//}
	//else
	//	jobRecHtml += '<td class="plaintablecell" nowrap><select class="inputbox" id="employeestatus" name="employeestatus" style="width:205px" onclick="parent.GetEmployeeStatus()">'+BuildEmpStatusSelect(PA42.EmployeeStatus.Code,PA42.EmployeeStatus.Description)+'</select>'+uiRequiredIcon()+'</td></tr>'
	jobRecHtml += '<td class="plaintablecell" nowrap><select name="employeestatuscode">'
	for (var i=0;i<self.jsreturn.NbrRecs;i++) {
		jobRecHtml += '<option value="'+self.jsreturn.record[i].emp_status+'"';
		if (self.jsreturn.record[i].emp_status == PA42.EmployeeStatus.Code) jobRecHtml += " selected";
		jobRecHtml += '>'+self.jsreturn.record[i].description+'</option>';
	}
	jobRecHtml += '</select>'+uiRequiredIcon()+'</td>';
	//GDD End of Change
	var tmpdatesLbl = getSeaPhrase("TEMP_DATES","ESS")+' '+getSeaPhrase("IF_APPLICABLE_PARENS","ESS");
	jobRecHtml += '<tr style="padding-bottom:20px"><th scope="row" class="plaintablerowheaderlite" style="width:45%;vertical-align:top;padding-top:5px">'+tmpdatesLbl+'</th>'
	+ '<td nowrap><table border="0" cellspacing="0" cellpadding="0" role="presentation">'
	toolTip = uiDateToolTip(getSeaPhrase("BEGIN_DATE","ESS"));
	jobRecHtml += '<tr><td class="plaintableheader"><label id="tmpdatebegLbl" for="tmpdatebeg"><span class="offscreen">'+tmpdatesLbl+'&nbsp;</span>'+getSeaPhrase("BEGIN_DATE","ESS")+'</label><br/><input class="inputbox" type="text" id="tmpdatebeg" name="tmpdatebeg" value="'+PA42.TemporaryDatesBegin+'" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)" aria-labelledby="tmpdatebegLbl tmpdatebegFmt">'+uiRequiredIcon()
	+ '<a href="javascript:;" onclick="parent.DateSelect(\'tmpdatebeg\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><br/>'+uiDateFormatSpan("tmpdatebegFmt")
	toolTip = uiDateToolTip(getSeaPhrase("END_DATE","ESS"));
	jobRecHtml += '</td><td class="plaintableheader"><label id="tmpdateendLbl" for="tmpdateend"><span class="offscreen">'+tmpdatesLbl+'&nbsp;</span>'+getSeaPhrase("END_DATE","ESS")+'</label><br/><input class="inputbox" type="text" id="tmpdateend" name="tmpdateend" value="'+PA42.TemporaryDatesEnd+'" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)" aria-labelledby="tmpdateendLbl tmpdateendFmt">'+uiRequiredIcon()
	+ '<a href="javascript:;" onclick="parent.DateSelect(\'tmpdateend\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><br/>'+uiDateFormatSpan("tmpdateendFmt")
	+ '</td></tr></table></td></tr>'
	// Salary Type, Salary, Currency, OT Exempt, Pay Schedule, Pay Step, Pay Grade
	//GDD  11/24/14  Supress Salary, Pay Step
	//var salaryLbl = getSeaPhrase("SALARY","ESS");
	jobRecHtml += '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="salarytype">'+getSeaPhrase("SALARY_TYPE","ESS")+'</label></th>'
	jobRecHtml += '<td class="plaintablecell" nowrap><select class="inputbox" id="salarytype" name="salarytype">'+BuildSalaryTypeSelect(PA42.SalaryClass.Code)+'</select>'+uiRequiredIcon()+'</td></tr>'
	jobRecHtml += '<input class="inputbox" type="hidden" id="salarybeg" name="salarybeg" value="'+PA42.SalaryBeginning+'">'
 	jobRecHtml += '<input class="inputbox" type="hidden" id="salaryend" name="salaryend" value="'+PA42.SalaryEnd+'">'
	//jobRecHtml += '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%;vertical-align:top;padding-top:5px">'+salaryLbl+'</th>'
	//+ '<td nowrap><table border="0" cellspacing="0" cellpadding="0" role="presentation">'
	//+ '<tr><td class="plaintableheader"><label for="salarybeg"><span class="offscreen">'+salaryLbl+'&nbsp;</span>'+getSeaPhrase("BEGIN_SALARY","SEA")+'</label><br/><input class="inputbox" type="text" id="salarybeg" name="salarybeg" value="'+PA42.SalaryBeginning+'" size="13" maxlength="13" onfocus="this.select()">'
	//+ '</td><td class="plaintableheader"><label for="salaryend"><span class="offscreen">'+salaryLbl+'&nbsp;</span>'+getSeaPhrase("END_SALARY","SEA")+'</label><br/><input class="inputbox" type="text" id="salaryend" name="salaryend" value="'+PA42.SalaryEnd+'" size="13" maxlength="13" onfocus="this.select()">'
	//+ '</td></tr></table></td></tr>'
	jobRecHtml += '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="currency">'+getSeaPhrase("QUAL_16","ESS")+'</label></th>'
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("currency");
		jobRecHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="hidden" name="currencycode" value="'+PA42.Currency.Code+'">'
		+ '<input class="inputbox" type="text" id="currency" name="currency" fieldnm="currency" value="'+PA42.Currency.Description+'" size="30" maxlength="30" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'currency\');">'+uiRequiredIcon()
		+ '<a href="javascript:parent.openDmeFieldFilter(\'currency\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
		+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a></td></tr>'
	}
	else
		jobRecHtml += '<td class="plaintablecell" nowrap><select class="inputbox" id="currency" name="currency" style="width:205px" onclick="parent.GetCurrency()">'+BuildCurrencySelect(PA42.Currency.Code,PA42.Currency.Description)+'</select>'+uiRequiredIcon()+'</td></tr>'
	jobRecHtml += '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="otexempt">'+getSeaPhrase("OVERTIME_EXEMPT","ESS")+'</label></th>'
	jobRecHtml += '<td class="plaintablecell" nowrap><select class="inputbox" id="otexempt" name="otexempt">'+BuildYesNoSelect(PA42.ExemptFromOvertime.Code)+'</select>'+uiRequiredIcon()+'</td></tr>'
	jobRecHtml += '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="payschedule">'+getSeaPhrase("PAY_SCHEDULE","ESS")+'</label></th>'
	toolTip = dmeFieldToolTip("payschedule");
	jobRecHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="payschedule" name="payschedule" fieldnm="payschedule" value="'+PA42.Schedule.Description+'" size="30" maxlength="30" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'payschedule\');">'+uiRequiredIcon()
	jobRecHtml += '<a href="javascript:parent.openFieldValueList(\'payschedule\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
	jobRecHtml += '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a></td></tr>'
	//jobRecHtml += '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%">'+getSeaPhrase("PAY_STEP","ESS")+'</th>'
	//jobRecHtml += '<td class="plaintablecell" id="paystep" nowrap>'+((PA42.Step)?PA42.Step:'&nbsp;')+'</td></tr>'
	//GDD end of change
	jobRecHtml += '<tr style="padding-bottom:20px"><th scope="row" class="plaintablerowheaderlite" style="width:45%">'+getSeaPhrase("PAY_GRADE","ESS")+'</th>'
	jobRecHtml += '<td class="plaintablecell" id="paygrade" nowrap>'+((PA42.Grade)?PA42.Grade:'&nbsp;')+uiRequiredIcon()+'</td></tr>'
	// Work Schedule, Shift
	//GDD  11/24/14   Supress these fields.
	jobRecHtml += '<input class="inputbox" type="hidden" name="workschedulecode" value="'+PA42.WorkSchedule.Code+'">'
	jobRecHtml += '<input class="inputbox" type="hidden" name="shift" value="'+PA42.Shift.Code+'">'
	//jobRecHtml += '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="workschedule">'+getSeaPhrase("WORK_SCHEDULE","ESS")+'</label></th>'
	//if (emssObjInstance.emssObj.filterSelect)
	//{
	//	toolTip = dmeFieldToolTip("workschedule");
	//	jobRecHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="hidden" name="workschedulecode" value="'+PA42.WorkSchedule.Code+'">'
	//	+ '<input class="inputbox" type="text" id="workschedule" name="workschedule" fieldnm="workschedule" value="'+PA42.WorkSchedule.Description+'" size="30" maxlength="30" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'workschedule\');">'
	//	+ '<a href="javascript:parent.openDmeFieldFilter(\'workschedule\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
	//	+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a></td></tr>'
	//}
	//else
	//	jobRecHtml += '<td class="plaintablecell" nowrap><select class="inputbox" id="workschedule" name="workschedule" style="width:205px" onclick="parent.GetWorkSchedule()">'+BuildWorkScheduleSelect(PA42.WorkSchedule.Code, PA42.WorkSchedule.Description)+'</select></td></tr>'
	//jobRecHtml += '<tr style="padding-bottom:20px"><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="shift">'+getSeaPhrase("SHIFT","ESS")+'</label></th>'
	//+ '<td class="plaintablecell" nowrap><select class="inputbox" id="shift" name="shift">'+BuildShiftSelect(PA42.Shift.Code)+'</select></td></tr>'
	//GDD end of change
	// Openings, FTE, Replacement
	jobRecHtml += '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="openings">'+getSeaPhrase("JOB_OPENINGS_4","ESS")+'</label></th>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="openings" name="openings" value="'+PA42.Openings+'" size="3" maxlength="3" onfocus="this.select()">'+uiRequiredIcon()+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="fte">'+getSeaPhrase("FULL_TIME_EMPLOYEE","ESS")+'</label></th>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="fte" name="fte" value="'+PA42.OpenFTE+'" size="8" maxlength="8" onfocus="this.select()">'+uiRequiredIcon()+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="replacement">'+getSeaPhrase("REPLACEMENT","ESS") +'</label></th>'
	+ '<td class="plaintablecell" nowrap><select class="inputbox" id="replacement" name="replacement">'+BuildYesNoSelect(PA42.Replacement.Code)+'</select>'+uiRequiredIcon()+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="replacementfor">'+getSeaPhrase("REPLACEMENT_FOR","ESS")+'</label></th>'	
	// Replacement For - always use Filter Select
	toolTip = dmeFieldToolTip("replacementfor");
	jobRecHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="hidden" name="replacementforcode" value="'+PA42.ReplacementEmployee.Code+'">'+uiRequiredIcon()
	+ '<input class="inputbox" type="text" id="replacementfor" name="replacementfor" value="'+PA42.ReplacementEmployee.Description+'" size="30" maxlength="30" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'replacementfor\');">'
	+ '<a href="javascript:parent.getMgrSuperCodes();" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
	+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a></td></tr>'
	// Budgeted
	jobRecHtml += '<tr style="padding-bottom:20px"><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="budgeted">'+getSeaPhrase("BUDGETED","ESS") +'</label></th>'
	+ '<td class="plaintablecell" nowrap><select class="inputbox" id="budgeted" name="budgeted">'+BuildYesNoSelect(PA42.Budgeted.Code)+'</select>'+uiRequiredIcon()+'</td></tr>'
	// Contact First Name, Contact Last Name, Phone Number, Extension, Phone Country Code
	jobRecHtml += '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="contactfirst">'+getSeaPhrase("CONTACT_FIRST_NAME","ESS") +'</label></th>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="contactfirst" name="contactfirst" value="'+PA42.ContactFirst+'" size="15" maxlength="15" onfocus="this.select()">'+uiRequiredIcon()+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="contactlast">'+getSeaPhrase("CONTACT_LAST_NAME","ESS")+'</label></th>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="contactlast" name="contactlast" value="'+PA42.ContactLast+'" size="30" maxlength="30" onfocus="this.select()">'+uiRequiredIcon()+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="wkphonenbr">'+getSeaPhrase("PHONE_NUMBER","ESS")+'</label></th>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="wkphonenbr" name="wkphonenbr" value="'+PA42.WorkPhoneNumber+'" size="15" maxlength="15" onfocus="this.select()">'+uiRequiredIcon()+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label for="wkphoneext">'+getSeaPhrase("JOB_OPENINGS_14","ESS") +'</label></th>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="wkphoneext" name="wkphoneext" value="'+PA42.WorkPhoneExt+'" size="5" maxlength="5" onfocus="this.select()">'+uiRequiredIcon()+'</td></tr>'
	//GDD 11/24/14  Supress Phone Country code
	jobRecHtml += '<input class="inputbox" type="hidden" id="wkphonecntry" name="wkphonecntry" value="'+PA42.WorkPhoneCountry+'">'
	//+ '<tr><th scope="row" class="plaintablerowheaderlite" style="width:45%"><label id="wkctrycd" for="wkphonecntry" title="'+getSeaPhrase("COUNTRY_CODE_HELP_TEXT","ESS")+'">'+getSeaPhrase("PHONE_COUNTRY_CODE","ESS")+'<span class="offscreen">&nbsp;'+getSeaPhrase("COUNTRY_CODE_HELP_TEXT","ESS")+'</span></label></th>'
	//+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="wkphonecntry" name="wkphonecntry" value="'+PA42.WorkPhoneCountry+'" size="3" maxlength="3" onfocus="this.select()"></td></tr>'
	// Internal and External Posting Dates
	var intpostdatesLbl = getSeaPhrase("INTERNAL_POSTING_DATES","ESS");
	jobRecHtml += '<tr style="padding-top:20px"><th scope="row" class="plaintablerowheaderlite" style="width:45%;vertical-align:top;padding-top:5px">'+intpostdatesLbl +'</th>'
	+ '<td nowrap><table border="0" cellspacing="0" cellpadding="0" role="presentation">'	
	toolTip = uiDateToolTip(getSeaPhrase("BEGIN_DATE","ESS"));
	jobRecHtml += '<tr><td class="plaintableheader"><label id="intpostdatebegLbl" for="intpostdatebeg"><span class="offscreen">'+intpostdatesLbl+'&nbsp;</span>'+getSeaPhrase("BEGIN_DATE","ESS")+'</label><br/><input class="inputbox" type="text" id="intpostdatebeg" name="intpostdatebeg" value="'+PA42.InternalPostDateStart+'" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)" aria-labelledby="intpostdatebegLbl intpostdatebegFmt">'+uiRequiredIcon()
	+ '<a href="javascript:;" onclick="parent.DateSelect(\'intpostdatebeg\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><br/>'+uiDateFormatSpan("intpostdatebegFmt")
	toolTip = uiDateToolTip(getSeaPhrase("END_DATE","ESS"));
	jobRecHtml += '</td><td class="plaintableheader"><label id="intpostdateendLbl" for="intpostdateend"><span class="offscreen">'+intpostdatesLbl+'&nbsp;</span>'+getSeaPhrase("END_DATE","ESS")+'</label><br/><input class="inputbox" type="text" id="intpostdateend" name="intpostdateend" value="'+PA42.InternalPostDateStop+'" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)" aria-labelledby="intpostdateendLbl intpostdateendFmt">'+uiRequiredIcon()
	+ '<a href="javascript:;" onclick="parent.DateSelect(\'intpostdateend\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><br/>'+uiDateFormatSpan("intpostdateendFmt")
	+ '</td></tr></table></td></tr>'
	var extpostdatesLbl = getSeaPhrase("EXTERNAL_POSTING_DATES","ESS");
	jobRecHtml += '<tr style="padding-top:20px"><th scope="row" class="plaintablerowheaderlite" style="width:45%;vertical-align:top;padding-top:5px">'+extpostdatesLbl +'</th>'
	+ '<td nowrap>'
	+ '<table border="0" cellspacing="0" cellpadding="0" role="presentation">'	
	toolTip = uiDateToolTip(getSeaPhrase("BEGIN_DATE","ESS"));
	jobRecHtml += '<tr><td class="plaintableheader"><label id="extpostdatebegLbl" for="extpostdatebeg"><span class="offscreen">'+extpostdatesLbl+'&nbsp;</span>'+getSeaPhrase("BEGIN_DATE","ESS")+'</label><br/><input class="inputbox" type="text" id="extpostdatebeg" name="extpostdatebeg" value="'+PA42.ExternalPostDateStart+'" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)" aria-labelledby="extpostdatebegLbl extpostdatebegFmt">'+uiRequiredIcon()
	+ '<a href="javascript:;" onclick="parent.DateSelect(\'extpostdatebeg\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><br/>'+uiDateFormatSpan("extpostdatebegFmt")
	+ '</td><td class="plaintableheader"><label id="extpostdateendLbl" for="extpostdateend"><span class="offscreen">'+extpostdatesLbl+'&nbsp;</span>'+getSeaPhrase("END_DATE","ESS")+'</label><br/><input class="inputbox" type="text" id="extpostdateend" name="extpostdateend" value="'+PA42.ExternalPostDateStop+'" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this)" aria-labelledby="extpostdateendLbl extpostdateendFmt">'+uiRequiredIcon()
	toolTip = uiDateToolTip(getSeaPhrase("END_DATE","ESS"));
	jobRecHtml += '<a href="javascript:;" onclick="parent.DateSelect(\'extpostdateend\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><br/>'+uiDateFormatSpan("extpostdateendFmt")
	+ '</td></tr></table></td></tr>'
	// Form buttons
	jobRecHtml += '<tr><th scope="row">&nbsp;</th><td class="plaintablecell">'
	+ uiButton(getSeaPhrase("ADD_REQUISITION","ESS"),"parent.AddRequisition();return false","margin-top:10px;margin-bottom:10px")
	+ uiButton(getSeaPhrase("CANCEL","ESS"),"parent.CancelAdd();return false","margin-top:10px;margin-bottom:10px;margin-left:5px")
	+ '</td></tr></table></form>'
	try 
	{
		self.right.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DETAIL","ESS");
		self.right.document.getElementById("paneBody").innerHTML = jobRecHtml;
		self.right.setLayerSizes();
		self.right.stylePage();
	}
	catch(e) {}
	document.getElementById("right").style.visibility = "visible";
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.right.getWinTitle()]));
	fitToScreen();	
}

function CancelAdd()
{
	self.right.document.newjobreqdtlform.reset();
	document.getElementById("right").style.visibility = "hidden";
}

function ConfirmFillDefaults(confirmWin)
{
    if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
		fillDefaults();
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
	var contentLeftWidth;
	var contentLeftBorderWidth;
	var contentRightWidth;
	var contentRightBorderWidth;
	var contentHeight;
	var contentBorderHeight;
	if (window.styler && window.styler.showInfor)
	{
		contentLeftWidth = parseInt(winWidth*.40,10) - 10;
		var elmPad = 2;
		if ((navigator.appName.indexOf("Microsoft") >= 0) && (!document.documentMode || document.documentMode < 8))
			elmPad = 7;		
		contentLeftBorderWidth = contentLeftWidth + elmPad;
		contentRightWidth = parseInt(winWidth*.60,10) - 10;
		contentRightBorderWidth = contentRightWidth + elmPad;
		contentHeight = winHeight - 70;
		contentBorderHeight = (navigator.appName.indexOf("Microsoft") >= 0) ? contentHeight + 30 : contentHeight + 25;	
	}
	else if (window.styler && (window.styler.showLDS || window.styler.showInfor3))
	{
		contentLeftWidth = parseInt(winWidth*.40,10) - 20;
		contentLeftBorderWidth = (window.styler.showInfor3) ? contentLeftWidth + 7 : contentLeftWidth + 17;
		contentRightWidth = parseInt(winWidth*.60,10) - 20;
		contentRightBorderWidth = (window.styler.showInfor3) ? contentRightWidth + 7 : contentRightWidth + 17;
		contentHeight = winHeight - 70;
		contentBorderHeight = (navigator.appName.indexOf("Microsoft") >= 0) ? contentHeight + 30 : contentHeight + 25;				
	}
	else
	{
		contentLeftWidth = parseInt(winWidth*.40,10) - 10;
		contentLeftBorderWidth = contentLeftWidth;
		contentRightWidth = parseInt(winWidth*.60,10) - 10;
		contentRightBorderWidth = contentRightWidth;
		contentHeight = winHeight - 72;
		contentBorderHeight = contentHeight + 24;				
	}	
	if (self.left.onresize && self.left.onresize.toString().indexOf("setLayerSizes") >= 0)
		self.left.onresize = null;
	try
	{
		document.getElementById("left").style.height = winHeight + "px";
		self.left.document.getElementById("paneBorder").style.width = contentLeftBorderWidth + "px";
		self.left.document.getElementById("paneBorder").style.height = contentBorderHeight + "px";		
		self.left.document.getElementById("paneBodyBorder").style.width = contentLeftWidth + "px";
		self.left.document.getElementById("paneBodyBorder").style.height = contentHeight + "px";
		self.left.document.getElementById("paneBody").style.width = contentLeftWidth + "px";
		self.left.document.getElementById("paneBody").style.height = contentHeight + "px";
		self.left.document.getElementById("paneBody").style.overflow = "auto";		
	}
	catch(e) {}
	if (self.right.onresize && self.right.onresize.toString().indexOf("setLayerSizes") >= 0)
		self.right.onresize = null;
	try
	{
		document.getElementById("right").style.height = winHeight + "px";
		self.right.document.getElementById("paneBorder").style.width = contentRightBorderWidth + "px";
		self.right.document.getElementById("paneBorder").style.height = contentBorderHeight + "px";		
		self.right.document.getElementById("paneBodyBorder").style.width = contentRightWidth + "px";
		self.right.document.getElementById("paneBodyBorder").style.height = contentHeight + "px";
		self.right.document.getElementById("paneBody").style.width = contentRightWidth + "px";
		self.right.document.getElementById("paneBody").style.height = contentHeight + "px";
		self.right.document.getElementById("paneBody").style.overflow = "auto";		
	}
	catch(e) {}	
	if (window.styler && window.styler.textDir == "rtl")
	{
		document.getElementById("left").style.left = "";
		document.getElementById("left").style.right = "0px";	
		document.getElementById("right").style.left = "0px";
	}
	else
		document.getElementById("right").style.left = parseInt(winWidth*.40,10) + "px";
}
var Timer = setTimeout("Initialize()",3000);//Sets a timer to call the initialize function if the body fails to call it.

//GDD  03/18/14 Added new function
function checkGrant(obj) 
{
	if (obj.checked) isGrant = true
	else isGrant = false;
}
//GDD end of change
</script>
</head>
<body style="width:100%;height:100%;overflow:hidden" onload="Initialize()" onresize="fitToScreen()">
	<iframe id="header" name="header" title="Header" level="1" tabindex="0" style="visibility:hidden;position:absolute;height:32px;width:803px;left:0px;top:0px" src="/lawson/xhrnet/ui/header.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="left" name="left" title="Main Content" level="2" tabindex="0" src="/lawson/xhrnet/ui/headerpane.htm" style="visibility:hidden;position:absolute;left:0px;top:32px;width:40%;height:474px" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="right" name="right" title="Secondary Content" level="3" tabindex="0" src="/lawson/xhrnet/ui/headerpanelite.htm" style="visibility:hidden;position:absolute;left:40%;top:32px;width:60%;height:474px" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="jsreturn" name="jsreturn" title="Empty" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/dot.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="lawheader" name="lawheader" title="Empty" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/JobRequisitions/Lib/SEA_LAW.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@10.00.05.00.12 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/JobRequisitions/NewJobRequisitions/SHR031.htm,v 1.17.2.71 2014/02/25 22:49:16 brentd Exp $ -->
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
