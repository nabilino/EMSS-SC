// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/JobRequisitions/NewJobRequisitions/SHR031_AGS.js,v 1.6.2.23 2014/02/20 20:04:48 brentd Exp $
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
function FillDefaults_Done()
{
	var jobForm = self.left.document.newjobreqform;
	var positionObj = jobForm.position;
	var dateObj = jobForm.dateneeded;
	var statusObj = jobForm.status;
	clearRequiredField(positionObj);
	clearRequiredField(dateObj);
	clearRequiredField(statusObj);
	if (self.lawheader.gmsgnbr == "000" || self.lawheader.gmsgnbr == "151")
	{
		if (NonSpace(PA42.Supervisor.Code) > 0 && NonSpace(PA42.Supervisor.Description) == 0)
			GetDME_HRSUPER_DESC(PA42.Supervisor.Code);
		else
			FillDefaults_Render();
	}
	else
	{
		removeWaitAlert();
		switch (self.lawheader.gmsgnbr)
		{
			case "145": setRequiredField(positionObj, self.lawheader.gmsg); break;
			case "103": setRequiredField(dateObj, self.lawheader.gmsg); break;
			case "105": setRequiredField(statusObj, self.lawheader.gmsg); break;
			default: seaAlert(self.lawheader.gmsg, null, null, "error"); break;
		}
	}
}

function FillDefaults_Render()
{
	removeWaitAlert();
	var refreshData = function()
	{
		showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), DrawRightWindow);
	}
	var alertResponse = seaPageMessage(getSeaPhrase("REQ_DATA_POSTED","ESS"), "", "info", null, refreshData, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
	if (typeof(alertResponse) == "undefined" || alertResponse == null)
	{	
		if (seaPageMessage == window.alert)
			refreshData();
	}	
}

function Call_HS10(company,employee)
{	
	var program = "HS10.1";
	var programSafeStr = program.split(".").join("_");
	self.lawheader.count = 0;
	self.lawheader.UpdateType = programSafeStr;
	var pAgsObj = new AGSObject(authUser.prodline, "HS10.1");
	pAgsObj.event = "ADD";
	pAgsObj.rtn = "DATA";
	pAgsObj.longNames = true;
	pAgsObj.tds = false;
	pAgsObj.field = "FC=I"
	+ "&HSU-COMPANY=" +escape(parseInt(company, 10),1)
	+ "&HSU-EMPLOYEE=" +escape(parseInt(employee, 10),1);
	if (PA42.DirectReports.length && PA42.DirectReports.NextEmployee)
	{
		if (PA42.DirectReports.NextFC)
			pAgsObj.field += "&PT-FC="+PA42.DirectReports.NextFC;
		if (PA42.DirectReports.NextEmployee)
			pAgsObj.field += "&PT-PTF-EMPLOYEE="+PA42.DirectReports.NextEmployee;
		if (PA42.DirectReports.NextSupervisorCode)
			pAgsObj.field += "&PT-HSU-CODE="+PA42.DirectReports.NextSupervisorCode;
		if (PA42.DirectReports.NextSupervisorOpCode)
			pAgsObj.field += "&PT-HSU-OP-CODE="+PA42.DirectReports.NextSupervisorOpCode;
		PA42.DirectReports.Next = false;
		PA42.DirectReports.NextFC = "";
		PA42.DirectReports.NextEmployee = "";
		PA42.DirectReports.NextSupervisorCode = "";
		PA42.DirectReports.NextSupervisorOpCode = "";
	}
	pAgsObj.out = "JAVASCRIPT";
	pAgsObj.debug = false;
  	pAgsObj.func = "parent.RecallHS10("+company+","+employee+")";
	AGS(pAgsObj, "jsreturn");
}

function RecallHS10(company, employee)
{
	if (PA42.DirectReports.length && PA42.DirectReports.Next)
		Call_HS10(company, employee);
	else
		DMECall_DONE("HS10");
}

function ParseAGSValue(value, flag)
{
	// PT 152614. Since we are only using I, F, and A function codes, do not pass a space character to AGS for a blank field.
	// This will fail on the Transaction servlet, as it will try to validate the value.
	return (NonSpace(value) == 0) ? "" : escape(value,1);
}
//GDD  07/08/14 Add variable to save PA42 message
var PA42msg;

function AddRequisition()
{
	var keyForm = self.left.document.newjobreqform;
	var dtlForm = self.right.document.newjobreqdtlform;
	var dateObj = keyForm.dateneeded;
	var statusObj = keyForm.status;
	var replacementObj = dtlForm.replacement;
	var replacementForObj = dtlForm.replacementfor;
	var openingsObj = dtlForm.openings;
	var fteObj = dtlForm.fte;
	var datesBegObj = dtlForm.tmpdatebeg;
	var datesEndObj = dtlForm.tmpdateend;
	var salaryFromObj = dtlForm.salarybeg;
	var salaryToObj = dtlForm.salaryend;
	var phoneNbrObj = dtlForm.wkphonenbr;
	var phoneCtryObj = dtlForm.wkphonecntry;
	var intPostDateBegObj = dtlForm.intpostdatebeg;
	var intPostDateEndObj = dtlForm.intpostdateend;
	var extPostDateBegObj = dtlForm.extpostdatebeg;
	var extPostDateEndObj = dtlForm.extpostdateend;
	var XMIT = false;
	clearRequiredField(dateObj);
	if (emssObjInstance.emssObj.filterSelect)
		clearRequiredField(statusObj);
	else
		clearRequiredField(self.left.document.getElementById("status"));
	clearRequiredField(openingsObj);
	clearRequiredField(fteObj);
	clearRequiredField(replacementForObj);
	clearRequiredField(datesBegObj);
	clearRequiredField(datesEndObj);
	clearRequiredField(salaryFromObj);
	clearRequiredField(salaryToObj);
	clearRequiredField(phoneNbrObj);
	clearRequiredField(phoneCtryObj);
	clearRequiredField(intPostDateBegObj);
	clearRequiredField(intPostDateEndObj);
	clearRequiredField(extPostDateBegObj);
	clearRequiredField(extPostDateEndObj);
   	if (NonSpace(dateObj.value) == 0)
   	{
   		setRequiredField(dateObj, getSeaPhrase("DATE_REQUIRED","ESS"));
       	return;
   	}
  	if (ValidDate(dateObj) == false)
      	return;
   	if ((!emssObjInstance.emssObj.filterSelect && (statusObj.selectedIndex == 0))
   	||  (emssObjInstance.emssObj.filterSelect && (NonSpace(keyForm.statuscode.value) == 0)))
   	{
   		if (emssObjInstance.emssObj.filterSelect)
   			setRequiredField(statusObj, getSeaPhrase("STATUS_REQUIRED","ESS"));
   		else
   			setRequiredField(self.left.document.getElementById("status"), getSeaPhrase("STATUS_REQUIRED","ESS"), statusObj);
       	return;
   	}	
	if (NonSpace(datesBegObj.value) > 0)
	{
		var dteParams = dateIsValid(datesBegObj.value);
		var dte = dteParams[0];
		var errMsg = dteParams[1];
		if (!dte)
		{
			setRequiredField(datesBegObj, getSeaPhrase("CAL_1","ESS"));
			return;
		}
	}
	if (NonSpace(datesEndObj.value) > 0)
	{
		var dteParams = dateIsValid(datesEndObj.value);
		var dte = dteParams[0];
		var errMsg = dteParams[1];
		if (!dte)
		{		
			setRequiredField(datesEndObj, getSeaPhrase("CAL_1","ESS"));
			return;
		}	
	}
	if (!IsValidNumber(salaryFromObj))
		return;
	if (!IsValidNumber(salaryToObj))
		return;
	if (!IsValidNumber(openingsObj))
		return;
	if (!ValidNumber(openingsObj,3,0))
	{
		setRequiredField(openingsObj, getSeaPhrase("INVALID_INTEGER","ESS"));
		return;
	}
	if (!IsValidNumber(fteObj))
		return;
	if (replacementObj.options[replacementObj.selectedIndex].value == "Y" && !NonSpace(replacementForObj.value))
	{
		setRequiredField(replacementForObj, getSeaPhrase("REPLACEMENT_REQUIRED","ESS"));
		return;
	}
	if (NonSpace(phoneNbrObj.value) > 0 && !ValidPhoneEntry(phoneNbrObj))
	{	
		setRequiredField(phoneNbrObj, getSeaPhrase("PHONE_NBR_ERROR","ESS"));
		return;
	}
	if (NonSpace(phoneCtryObj.value) > 0 && !ValidPhoneEntry(phoneCtryObj))
	{		
		setRequiredField(phoneCtryObj, getSeaPhrase("PHONE_COUNTRY_CODE_ERROR","ESS"));
		return;
	}
	if (NonSpace(intPostDateBegObj.value) > 0)
	{
		var dteParams = dateIsValid(intPostDateBegObj.value);
		var dte = dteParams[0];
		var errMsg = dteParams[1];
		if (!dte)
		{		
			setRequiredField(intPostDateBegObj, getSeaPhrase("CAL_1","ESS"));
			return;
		}	
	}
	if (NonSpace(intPostDateEndObj.value) > 0)
	{
		var dteParams = dateIsValid(intPostDateEndObj.value);
		var dte = dteParams[0];
		var errMsg = dteParams[1];
		if (!dte)
		{		
			setRequiredField(intPostDateEndObj, getSeaPhrase("CAL_1","ESS"));
			return;
		}	
	}
	if (NonSpace(extPostDateBegObj.value) > 0)
	{
		var dteParams = dateIsValid(extPostDateBegObj.value);
		var dte = dteParams[0];
		var errMsg = dteParams[1];
		if (!dte)
		{		
			setRequiredField(extPostDateBegObj, getSeaPhrase("CAL_1","ESS"));
			return;
		}
	}
	if (NonSpace(extPostDateEndObj.value) > 0)
	{
		var dteParams = dateIsValid(extPostDateEndObj.value);
		var dte = dteParams[0];
		var errMsg = dteParams[1];
		if (!dte)
		{		
			setRequiredField(extPostDateEndObj, getSeaPhrase("CAL_1","ESS"));
			return;
		}	
	}
	StorePA42FormValues();
    //GDD  03/18/14   Added logic to set GrantDesc if checked.
	if (isGrant) PA42.GrantDesc = "Grant";
	
	// PT 122822 - always set the PJR-OPEN-DATE to the current system date, regardless of whether the company is using e-Recruiting.
	PA42.OpenDateNeeded = true;
	// PT 108846 - if we are performing a double transmit, do not re-display the warning message, and make sure the XMIT value passed is correct.
	if (arguments[0] != "undefined" && typeof(arguments[0]) != "undefined" && arguments[0] != "")
	{
		var xmitFlag = arguments[0];
		// PT 122822 - skip the DMEs to retrieve the PRS-RECRUIT-FLAG; always default the system date into the PJR-OPEN-DATE field.
		//showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), function(){PA42.NeedsOpenDate(xmitFlag);});
		showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), function(){PA42.Add("PA42Call_DONE",xmitFlag);});
	}	
	else if (seaConfirm(getSeaPhrase("ACTION_WARNING","ESS"), "", ConfirmAdd))
	{
		// PT 122822 - skip the DMEs to retrieve the PRS-RECRUIT-FLAG; always default the system date into the PJR-OPEN-DATE field.
		//showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), function(){PA42.NeedsOpenDate("");});
		showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), function(){PA42.Add("PA42Call_DONE");});
	}
}

function ConfirmAdd(confirmWin)
{
    if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
    	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), function(){PA42.Add("PA42Call_DONE");});
}

function StorePA42FormValues()
{
	var keyForm = self.left.document.newjobreqform;
	var dtlForm = self.right.document.newjobreqdtlform;
	PA42.Position.Code = keyForm.positioncode.value;
	PA42.JobCode.Code = (emssObjInstance.emssObj.filterSelect) ? keyForm.jobcode.value : keyForm.job.options[keyForm.job.selectedIndex].value;
	PA42.ReqStatus.Code = (emssObjInstance.emssObj.filterSelect) ? keyForm.statuscode.value : keyForm.status.options[keyForm.status.selectedIndex].value;	
	PA42.DateNeeded = keyForm.dateneeded.value;
	PA42.ProcessLevel.Code = (emssObjInstance.emssObj.filterSelect) ? dtlForm.processlevelcode.value : dtlForm.processlevel.options[dtlForm.processlevel.selectedIndex].value;
	PA42.Department.Code = (emssObjInstance.emssObj.filterSelect) ? dtlForm.departmentcode.value : dtlForm.department.options[dtlForm.department.selectedIndex].value;
	PA42.Location.Code = (emssObjInstance.emssObj.filterSelect) ? dtlForm.locationcode.value : dtlForm.location.options[dtlForm.location.selectedIndex].value;	
	PA42.Supervisor.Code = (emssObjInstance.emssObj.filterSelect) ? dtlForm.supervisorcode.value : dtlForm.supervisor.options[dtlForm.supervisor.selectedIndex].value;	
	PA42.Union.Code = (emssObjInstance.emssObj.filterSelect) ? dtlForm.unioncode.value : dtlForm.union.options[dtlForm.union.selectedIndex].value;
	PA42.BargainUnit.Code = (emssObjInstance.emssObj.filterSelect) ? dtlForm.bargainunitcode.value : dtlForm.bargainunit.options[dtlForm.bargainunit.selectedIndex].value;
	PA42.UserLevel.Code = (emssObjInstance.emssObj.filterSelect) ? dtlForm.userlevelcode.value : dtlForm.userlevel.options[dtlForm.userlevel.selectedIndex].value;	
	PA42.EmployeeStatus.Code = (emssObjInstance.emssObj.filterSelect) ? dtlForm.employeestatuscode.value : dtlForm.employeestatus.options[dtlForm.employeestatus.selectedIndex].value;
	PA42.TemporaryDatesBegin = dtlForm.tmpdatebeg.value;
	PA42.TemporaryDatesEnd = dtlForm.tmpdateend.value;
	PA42.SalaryClass.Code = dtlForm.salarytype.options[dtlForm.salarytype.selectedIndex].value;	
	PA42.SalaryBeginning = dtlForm.salarybeg.value;	
	PA42.SalaryEnd = dtlForm.salaryend.value;
	PA42.Currency.Code = (emssObjInstance.emssObj.filterSelect) ? dtlForm.currencycode.value : dtlForm.currency.options[dtlForm.currency.selectedIndex].value;	
	PA42.ExemptFromOvertime.Code = dtlForm.otexempt.options[dtlForm.otexempt.selectedIndex].value;	
	PA42.Schedule.Code = dtlForm.payschedulecode.value;	
	PA42.Grade = dtlForm.paygradecode.value;
	PA42.Step = dtlForm.paystepcode.value;
	PA42.WorkSchedule.Code = (emssObjInstance.emssObj.filterSelect) ? dtlForm.workschedulecode.value : dtlForm.workschedule.options[dtlForm.workschedule.selectedIndex].value;
//GDD  11/24/14  Supress getting dropdown value.
//	PA42.Shift.Code = dtlForm.shift.options[dtlForm.shift.selectedIndex].value;
	PA42.Openings = dtlForm.openings.value;
	PA42.OpenFTE = dtlForm.fte.value;
	PA42.Replacement.Code = dtlForm.replacement.options[dtlForm.replacement.selectedIndex].value;
	PA42.ReplacementEmployee.Code = dtlForm.replacementforcode.value;
	PA42.Budgeted.Code = dtlForm.budgeted.options[dtlForm.budgeted.selectedIndex].value;
	PA42.ContactFirst = dtlForm.contactfirst.value;
	PA42.ContactLast = dtlForm.contactlast.value;
	PA42.WorkPhoneNumber = dtlForm.wkphonenbr.value;
	PA42.WorkPhoneExt = dtlForm.wkphoneext.value;
	PA42.WorkPhoneCountry = dtlForm.wkphonecntry.value;
	PA42.InternalPostDateStart = dtlForm.intpostdatebeg.value;
	PA42.InternalPostDateStop = dtlForm.intpostdateend.value;
	PA42.ExternalPostDateStart = dtlForm.extpostdatebeg.value;
	PA42.ExternalPostDateStop = dtlForm.extpostdateend.value;
	try { PA42.RecruitingFlag = (emssObjInstance.emssObj.filterSelect) ? dtlForm.plrecruitflag.value : dtlForm.processlevel.options[dtlForm.processlevel.selectedIndex].rflag; } catch(e) {}
}

function PA42Call_DONE()
{
	var keyForm = self.left.document.newjobreqform;
	var positionObj = keyForm.position; 
	var statusObj = keyForm.status;
	var dateObj = keyForm.dateneeded;
	removeWaitAlert();
	if (self.lawheader.gmsgnbr == "000")
	{
		//GDD  07/08/14  Change to add comment
		PA42msg = self.lawheader.gmsg;
		AddReqCmt();
		/*var refreshData = function()
		{
			showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), StartOver);
		}
		var alertResponse = seaPageMessage(self.lawheader.gmsg, "", "info", null, refreshData, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
		if (typeof(alertResponse) == "undefined" || alertResponse == null)
		{	
			if (seaPageMessage == window.alert)
				refreshData();
		}	*/
	}
	else
	{
		switch (self.lawheader.gmsgnbr)
		{
			case "141": 
				setRequiredField(positionObj, getSeaPhrase("POSITION_REQUIRED","ESS"));
				break;
			case "134": 
				if (seaConfirm(getSeaPhrase("SALARY_WARNING","ESS"), "", ConfirmAddReq))
					AddRequisition("1");
				break;
			case "127":
			{
				switch (self.lawheader.gfldnbr)
				{
					case "PJR-REQ-STATUS": 	
						if (emssObjInstance.emssObj.filterSelect)
							setRequiredField(statusObj, self.lawheader.gmsg);
						else
							setRequiredField(self.left.document.getElementById("status"), self.lawheader.gmsg, statusObj);
						break;
					case "PJR-DATE-NEEDED": 
						setRequiredField(dateObj, self.lawheader.gmsg);
						break;
				}
				break;
			}
			default: seaAlert(self.lawheader.gmsg, null, null, "error"); break;
		}
	}
}

function ConfirmAddReq(confirmWin)
{
    if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
		AddRequisition("1");
}
//GDD 07/08/14  Added new function to save comments
function AddReqCmt()
{
	PA46.Requisition = PA42.Requistion.Code;
	var keyForm = self.left.document.newjobreqform;
	
	PA46.ActTotExp = keyForm.acttotexp.value;	 
	PA46.BudTotExp = keyForm.budtotexp.value;	
	PA46.VarTotExp = vartotexp.toFixed(2);
	PA46.ActTotHrs = keyForm.acttothrs.value;
	PA46.BudTotHrs = keyForm.budtothrs.value;
	PA46.VarTotHrs = vartothrs.toFixed(2);
	PA46.OTHrs = keyForm.othrs.value;
	PA46.WorkedHrs = keyForm.workedhrs.value;
	PA46.OTHrsPct = pcttothrs.toFixed(2);
	PA46.ActionOIPct = keyForm.actoibench.value; 
        PA46.Add("PA46Call_DONE");
}

function PA46Call_DONE()
{
	if(self.lawheader.gmsgnbr == "000")
	{
                var refreshData = function()
		{
			showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), StartOver);
		}
		var alertResponse = seaPageMessage(PA42msg, "", "info", null, refreshData, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
		if (typeof(alertResponse) == "undefined" || alertResponse == null)
		{	
			if (seaPageMessage == window.alert)
				refreshData();
		}
	}
	else
	{
		seaAlert(self.lawheader.gmsg, null, null, "error");
        }
}
