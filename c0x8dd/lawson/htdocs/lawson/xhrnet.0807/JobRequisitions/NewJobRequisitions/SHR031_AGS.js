// Version: 8-)@(#)@10.00.02.00.29
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/JobRequisitions/NewJobRequisitions/SHR031_AGS.js,v 1.6.2.16 2012/06/29 17:24:25 brentd Exp $
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
function FillDefaults_Done()
{
	var jobForm = self.left.document.newjobreqform;
	var positionObj = jobForm.position;
	var dateObj = jobForm.dateneeded;
	var statusObj = jobForm.status;

	if (self.lawheader.gmsgnbr == "000" || self.lawheader.gmsgnbr == "151")
	{
		//PT 148472
	  if (NonSpace(PA42.Supervisor.Code) > 0 && NonSpace(PA42.Supervisor.Description) == 0)
	  {	 GetDME_HRSUPER_DESC(PA42.Supervisor.Code);
	  }	
	  else
	  {
			FillDefaults_Render();
	  }
		
	}
	else
	{
		MsgBox(self.lawheader.gmsg);
		switch(self.lawheader.gmsgnbr)
		{
			case "145": positionObj.focus(); positionObj.select(); break;
			case "103": dateObj.focus(); dateObj.select(); break;
			case "105": statusObj.focus(); statusObj.select(); break;
		}
	}
}

//PT 148472
function FillDefaults_Render()
{
	DrawRightWindow();
	MsgBox(getSeaPhrase("REQ_DATA_POSTED","ESS"));
}

//PT 138069
/*
function GetReports()
{ 
	self.lawheader.UpdateType = "HS10";
  	var pAGSObj   		= new AGSObject(authUser.prodline, "HS10.1")
   	pAGSObj.event		= "ADD"
   	pAGSObj.rtn	 	= "DATA"
	pAGSObj.longNames	= "ALL"
	pAGSObj.tds		= false
    	pAGSObj.field	 	= "FC=I"
				+ "&HSU-COMPANY=" + escape(parseInt(authUser.company,10)) 				
				+ "&HSU-EMPLOYEE=" + escape(parseInt(authUser.employee,10)) 
				+ "&DIR-RPT=Y"	
	pAGSObj.func		= "parent.DMECall_DONE(\'HS10\')"
	pAGSObj.debug		= false
  	AGS(pAGSObj, "jsreturn")
}
*/
function Call_HS10(company,employee)
{	
	var program = "HS10.1";
	//if (typeof(program) == "undefined" || program == null)
	//	program = "HS10.1";

	var programSafeStr = program.split(".").join("_");

	self.lawheader.count = 0;
	self.lawheader.UpdateType = programSafeStr;

	var pAgsObj   	  = new AGSObject(authUser.prodline, "HS10.1")
	pAgsObj.event     = "ADD"
	pAgsObj.rtn       = "DATA"
	pAgsObj.longNames = true
	pAgsObj.tds       = false
	pAgsObj.field     = "FC=I"
					  + "&HSU-COMPANY=" +escape(parseInt(company, 10),1)
					  + "&HSU-EMPLOYEE=" +escape(parseInt(employee, 10),1)
                      
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

	pAgsObj.out       = "JAVASCRIPT"
	pAgsObj.debug     = false
  	pAgsObj.func = "parent.RecallHS10("+company+","+employee+")"

	AGS(pAgsObj, "jsreturn")
}

function RecallHS10(company, employee)
{
  
	if (PA42.DirectReports.length && PA42.DirectReports.Next)
	{
	
	Call_HS10(company, employee)
	}
	else
	{
		DMECall_DONE("HS10")
	}
}
// PT 138069


function ParseAGSValue(value, flag)
{
	// PT 152614.  Since we are only using I, F, and A function codes, do not pass a
	// space character to AGS for a blank field.  This will fail on the Transaction servlet,
	// as it will try to validate the value.
	return (NonSpace(value) == 0) ? "" : escape(value,1);
}
//GDD  07/08/14 Add variable to save PA42 message
var PA42msg;
//GDD 03/18/14  Added parameter saveGrant
function AddRequisition(saveGrant)
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
   		setRequiredField(dateObj);
     		MsgBox(getSeaPhrase("DATE_REQUIRED","ESS"));
       		dateObj.focus();
       		dateObj.select();
       		return;
   	}

  	if (ValidDate(dateObj) == false)
   	{
   		setRequiredField(dateObj);
      		dateObj.focus();
       		dateObj.select();
      		return;
  	}

   	if ((!emssObjInstance.emssObj.filterSelect && (statusObj.selectedIndex == 0))
   	||  (emssObjInstance.emssObj.filterSelect && (NonSpace(keyForm.statuscode.value) == 0)))
   	{
   		if (emssObjInstance.emssObj.filterSelect)
   			setRequiredField(statusObj);
   		else
   			setRequiredField(self.left.document.getElementById("status"));
     		seaAlert(getSeaPhrase("STATUS_REQUIRED","ESS"));
       		statusObj.focus();
       		return;
   	}	

	if (NonSpace(datesBegObj.value) > 0 && !dateIsValid(datesBegObj.value))
	{
		setRequiredField(datesBegObj);
		datesBegObj.focus();
		datesBegObj.select();
		return;
	}
	
	if (NonSpace(datesEndObj.value) > 0 && !dateIsValid(datesEndObj.value))
	{
		setRequiredField(datesEndObj);
		datesEndObj.focus();
		datesEndObj.select();
		return;
	}

	if (!IsValidNumber(salaryFromObj))
	{
		setRequiredField(salaryFromObj);
		salaryFromObj.focus();
		salaryFromObj.select();
		return;
	}
	
	if (!IsValidNumber(salaryToObj))
	{
		setRequiredField(salaryToObj);
		salaryToObj.focus();
		salaryToObj.select();
		return;
	}

	if (!IsValidNumber(openingsObj))
	{
		return;
	}
	
	if (!ValidNumber(openingsObj,3,0))
	{
		setRequiredField(openingsObj);
		seaAlert(getSeaPhrase("INVALID_INTEGER","ESS"));
		openingsObj.focus();
		openingsObj.select();
		return;
	}
	
	if (!IsValidNumber(fteObj))
	{
		return;
	}
	
	if (replacementObj.options[replacementObj.selectedIndex].value == "Y" 
	&& !NonSpace(replacementForObj.value))
	{
		setRequiredField(replacementForObj);
		MsgBox(getSeaPhrase("REPLACEMENT_REQUIRED","ESS"));
		replacementForObj.focus();
		replacementForObj.select();
		return;
	}

	if (NonSpace(phoneNbrObj.value) > 0 && !ValidPhoneEntry(phoneNbrObj))
	{
		setRequiredField(phoneNbrObj);
		MsgBox(getSeaPhrase("PHONE_NBR_ERROR","ESS"));
		phoneNbrObj.focus();
		phoneNbrObj.select();
		return;
	}

	if (NonSpace(phoneCtryObj.value) > 0 && !ValidPhoneEntry(phoneCtryObj))
	{
		setRequiredField(phoneCtryObj);
		seaAlert(getSeaPhrase("PHONE_COUNTRY_CODE_ERROR","ESS"));
		phoneCtryObj.focus();
		phoneCtryObj.select();
		return;
	}

	if (NonSpace(intPostDateBegObj.value) > 0 && !dateIsValid(intPostDateBegObj.value))
	{
		setRequiredField(intPostDateBegObj);
		intPostDateBegObj.focus();
		intPostDateBegObj.select();
		return;
	}

	if (NonSpace(intPostDateEndObj.value) > 0 && !dateIsValid(intPostDateEndObj.value))
	{
		setRequiredField(intPostDateEndObj);
		intPostDateEndObj.focus();
		intPostDateEndObj.select();
		return;
	}
	
	if (NonSpace(extPostDateBegObj.value) > 0 && !dateIsValid(extPostDateBegObj.value))
	{
		setRequiredField(extPostDateBegObj);
		extPostDateBegObj.focus();
		extPostDateBegObj.select();
		return;
	
	}
	if (NonSpace(extPostDateEndObj.value) > 0 && !dateIsValid(extPostDateEndObj.value))
	{
		setRequiredField(extPostDateEndObj);
		extPostDateEndObj.focus();
		extPostDateEndObj.select();
		return;
	}	

	StorePA42FormValues();	 
    //GDD  03/18/14   Added logic to set GrantDesc if checked.
	if (saveGrant) PA42.GrantDesc = "Grant";
	
	// PT 122822 - always set the PJR-OPEN-DATE to the current system date, regardless of 
	// whether the company is using e-Recruiting.
	PA42.OpenDateNeeded = true;
	
	// PT 108846 - if we are performing a double transmit, do not re-display the warning message,
	// and make sure the XMIT value passed is correct.
	if(arguments[0] != "undefined" && typeof(arguments[0]) != "undefined" && arguments[0] != "")
	{
		// PT 122822 - skip the DMEs to retrieve the PRS-RECRUIT-FLAG; always default the 
		// system date into the PJR-OPEN-DATE field.
		// PA42.NeedsOpenDate(arguments[0]);
		PA42.Add("PA42Call_DONE", arguments[0]);
	}	
	else if(seaConfirm(getSeaPhrase("ACTION_WARNING","ESS"), "", FireFoxConfirmAdd))
	{
		// PT 122822 - skip the DMEs to retrieve the PRS-RECRUIT-FLAG; always default the 
		// system date into the PJR-OPEN-DATE field.		
		// PA42.NeedsOpenDate("");
		PA42.Add("PA42Call_DONE");
	}
}

function FireFoxConfirmAdd(confirmWin)
{
    if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
    {
		PA42.Add("PA42Call_DONE");
    }
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
	PA42.Shift.Code = dtlForm.shift.options[dtlForm.shift.selectedIndex].value;
	
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
	
	try {
		PA42.RecruitingFlag = (emssObjInstance.emssObj.filterSelect) ? dtlForm.plrecruitflag.value : dtlForm.processlevel.options[dtlForm.processlevel.selectedIndex].rflag;	 
	}
	catch(e) {}
}

function PA42Call_DONE()
{
	var keyForm = self.left.document.newjobreqform;
	
	var positionObj = keyForm.position; 
	var statusObj = keyForm.status;
	var dateObj = keyForm.dateneeded;
	
	if(self.lawheader.gmsgnbr == "000")
	{
		//GDD  07/08/14  Change to add comment
		//MsgBox(self.lawheader.gmsg)
		//StartOver();
		PA42msg = self.lawheader.gmsg;
		AddReqCmt();
	}
	else
	{
		switch(self.lawheader.gmsgnbr)
		{
			case "141": 
				setRequiredField(positionObj);
				MsgBox(getSeaPhrase("POSITION_REQUIRED","ESS"));
				positionObj.focus();
				positionObj.select();
				break;
			case "134": 
				if(seaConfirm(getSeaPhrase("SALARY_WARNING","ESS"), "", FireFoxConfirmAddReq)){
					AddRequisition("1");	
				}	
				break;
			case "127":
			{
				switch(self.lawheader.gfldnbr)
				{
					case "PJR-REQ-STATUS": 	
						if (emssObjInstance.emssObj.filterSelect)
							setRequiredField(statusObj);
						else
							setRequiredField(self.left.document.getElementById("status"));
						statusObj.focus();
						break;
					case "PJR-DATE-NEEDED": 
						setRequiredField(dateObj);
						dateObj.focus();
						dateObj.select();
						break;
				}
				break;
			}
			default: MsgBox(self.lawheader.gmsg); break;
		}
	}
}

function FireFoxConfirmAddReq(confirmWin)
{
    if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
    {
		AddRequisition("1");	
    }
}

//GDD 07/08/14  Added new function to save comments
function AddReqCmt()
{
	PA46.Requisition = PA42.Requistion.Code;
	var keyForm = self.left.document.newjobreqform;
	
	PA46.ActTotExp = keyForm.acttotexp.value;	 
	PA46.BudTotExp = keyForm.budtotexp.value;	
	PA46.VarTotExp = keyForm.vartotexp.value;
	PA46.ActTotHrs = keyForm.acttothrs.value;
	PA46.BudTotHrs = keyForm.budtothrs.value;
	PA46.VarTotHrs = keyForm.vartothrs.value;
	PA46.OTHrs = keyForm.othrs.value;
	PA46.WorkedHrs = keyForm.workedhrs.value;
	PA46.OTHrsPct = keyForm.pctothrs.value;
	PA46.ActionOIPct = keyForm.actoibench.value; 

	PA46.Add("PA46Call_DONE");
}

function PA46Call_DONE()
{
	var keyForm = self.left.document.newjobreqform;
	if(self.lawheader.gmsgnbr == "000")
	{
		MsgBox(PA42msg)
		StartOver();
	}
	else
	{
		MsgBox(self.lawheader.gmsg); 
	}
}



