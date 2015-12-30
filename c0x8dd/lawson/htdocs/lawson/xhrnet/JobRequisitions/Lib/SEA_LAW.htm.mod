<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">
<meta charset="utf-8">
<title>Transaction Library</title>
<script>
var gmsgnbr = '';
var gmsg = '';
var gfldnbr = '';
var UpdateType = '';
var count = 1;
var Index = 0;

function V(fldnbr, val)
{
	switch (UpdateType)
	{
		case "PA42": 
			PA42V(fldnbr, val);
			break;
		//GDD  07/08/14  Added new call
		case "PA46":
			PA46V(fldnbr, val);
			break;
		case "HS10_1":
		//case "HS10":
			HS10V(fldnbr, val);
			break;
	}
}

function HS10V(fldnbr, val)
{
	if (fldnbr.indexOf("PTF-EMPLOYEE") >= 0 && fldnbr.indexOf("PT-") == -1)
	{
		count++;
		Index = parent.PA42.DirectReports.length;
		parent.PA42.DirectReports[Index] = new parent.DirectReportsObject();
	}
  	if (fldnbr == "PTF-EMPLOYEE" + count)
		parent.PA42.DirectReports[Index].Code = parseInt(Number(val),10);
	else if (fldnbr == "PTF-FULL-NAME" + count)
		parent.PA42.DirectReports[Index].Description = val;
	else if (fldnbr == "PT-FC" && val != "")
	{
		parent.PA42.DirectReports.Next = true;
		parent.PA42.DirectReports.NextFC = val;
	}
	else if (fldnbr == "PT-PTF-EMPLOYEE" && val != 0)
	{
		parent.PA42.DirectReports.Next = true;
		parent.PA42.DirectReports.NextEmployee = val;
	}
	else if (fldnbr == "PT-HSU-CODE" && val != "")
	{
		parent.PA42.DirectReports.Next = true;
		parent.PA42.DirectReports.NextSupervisorCode = val;
	}
	else if (fldnbr == "PT-HSU-OP-CODE" && val != "")
	{
		parent.PA42.DirectReports.Next = true;
		parent.PA42.DirectReports.NextSupervisorOpCode = val;
	}
}

function PA42V(fldnbr, val)
{
	switch (fldnbr)
	{
		case "PJR-COMPANY": parent.PA42.Company.Code = val;	break;
		case "PRS-NAME": parent.PA42.Company.Description = val;	break;
		case "PJR-REQUISITION": parent.PA42.Requistion.Code = val; break
		case "PJR-DESCRIPTION": parent.PA42.Requistion.Description = val; break;
		case "PJR-EFFECT-DATE": parent.PA42.EffectiveDate = parent.FormatDte4(val);	break;
		case "PJR-REQ-STATUS": parent.PA42.ReqStatus.Code = val; break;
		case "PCO-1-DESCRIPTION": parent.PA42.ReqStatus.Description = val; break;
		case "PJR-REQUEST-DATE": parent.PA42.RequestDate = parent.FormatDte4(val); break;
		case "PJR-OPEN-DATE": parent.PA42.OpenDate = parent.FormatDte4(val); break;
		case "PJR-DATE-NEEDED":	parent.PA42.DateNeeded = parent.FormatDte4(val); break;
		case "PJR-CLOSED-DATE":	parent.PA42.ClosedDate = parent.FormatDte4(val); break;
		case "PJR-OPENINGS": parent.PA42.Openings = val; break;
		case "PJR-OFFERS-ACCEPT": parent.PA42.OffersAccept = val; break;
		case "PJR-REMAINING-OPEN": parent.PA42.RemainingOpen = val; break;
		case "PJR-OPEN-FTE": parent.PA42.OpenFTE = (val.indexOf(".") == -1) ? parent.roundToDecimal(val/1000000,2) : parent.roundToDecimal(val,2); break;
		case "PJR-FILLED-FTE": parent.PA42.FilledFTE = (val.indexOf(".") == -1) ? parent.roundToDecimal(val/1000000,2) : parent.roundToDecimal(val,2); break;
		case "PJR-REMAINING-FTE": parent.PA42.RemainingFTE = (val.indexOf(".") == -1) ? parent.roundToDecimal(parent.MoveTrailingSignToFront(val)/1000000,2) : parent.roundToDecimal(parent.MoveTrailingSignToFront(val),2); break;
		case "PJR-POSITION": parent.PA42.Position.Code = val; break;
		case "POS-DESCRIPTION":	parent.PA42.Position.Description = val; break;
		case "PJR-PROCESS-LEVEL": parent.PA42.ProcessLevel.Code = val; break;
		case "PRS-PL-NAME":	parent.PA42.ProcessLevel.Description = val; break;
		case "PJR-DEPARTMENT": parent.PA42.Department.Code = val; break;
		case "DPT-NAME": parent.PA42.Department.Description = val; break;
		case "PJR-JOB-CODE": parent.PA42.JobCode.Code = val; break;
		case "JBC-DESCRIPTION":	parent.PA42.JobCode.Description = val; break;
		case "PJR-APP-STATUS": parent.PA42.EmployeeStatus.Code = val; break;
		case "EMS-DESCRIPTION":	parent.PA42.EmployeeStatus.Description = val; break;
		case "PJR-TEMP-BEGIN": parent.PA42.TemporaryDatesBegin = parent.FormatDte4(val); break;
		case "PJR-TEMP-END": parent.PA42.TemporaryDatesEnd = parent.FormatDte4(val); break;
		case "PJR-USER-LEVEL": parent.PA42.UserLevel.Code = val; break;
		case "USER-LEVEL-DESC":	parent.PA42.UserLevel.Description = val; break;
		case "PJR-SUPERVISOR": parent.PA42.Supervisor.Code = val; break;
		case "PJR-SUP-NAME": parent.PA42.Supervisor.Description = val; break;
		case "PJR-LOCAT-CODE": parent.PA42.Location.Code = val; break;
		case "PCO-3-DESCRIPTION": parent.PA42.Location.Description = val; break;
		case "PJR-SALARY-CLASS": parent.PA42.SalaryClass.Code = val; break;
		case "PJR-SALARY-CLASS": parent.PA42.SalaryClass.Description = val; break;
		case "PJR-BEG-PAY-RATE": parent.PA42.SalaryBeginning = (val.indexOf(".") == -1) ? parent.roundToDecimal(val/10000,2) : parent.roundToDecimal(val,2); break;
		case "PJR-END-PAY-RATE": parent.PA42.SalaryEnd = (val.indexOf(".") == -1) ? parent.roundToDecimal(val/10000,2) : parent.roundToDecimal(val,2); break;
		case "PJR-CURRENCY-CODE": parent.PA42.Currency.Code = val; break;
		case "CURR-FORMS-EXP": parent.PA42.Currency.Description = val; break;
		case "PJR-EXEMPT-EMP": parent.PA42.ExemptFromOvertime.Code = val; break;
		case "PJR-EXEMPT-EMP": parent.PA42.ExemptFromOvertime.Description = val; break;
		case "PJR-SCHEDULE": parent.PA42.Schedule.Code = val; break;
		case "PJR-PAY-GRADE": parent.PA42.Grade = val; break;
		case "PJR-PAY-STEP": parent.PA42.Step = val; break;
		case "SGH-DESCRIPTION":	parent.PA42.Schedule.Description = val; break;
		case "PJR-WORK-SCHED": parent.PA42.WorkSchedule.Code = val; break;
		case "PCO-2-DESCRIPTION": parent.PA42.WorkSchedule.Description = val; break;
		case "PJR-SHIFT": parent.PA42.Shift.Code = val; break;
		case "PJR-SHIFT": parent.PA42.Shift.Description = val; break;
		case "PJR-BUDGETED-FLAG": parent.PA42.Budgeted.Code = val; break;
		case "PJR-BUDGETED-FLAG": parent.PA42.Budgeted.Description = val; break;
		case "PJR-REPLACEMENT": parent.PA42.Replacement.Code = val; break;
		case "PJR-REPLACEMENT":	parent.PA42.Replacement.Description = val; break;
		case "PJR-REP-EMPLOYEE": parent.PA42.ReplacementEmployee.Code = val; break;
		case "EMP-1-FULL-NAME":	parent.PA42.ReplacementEmployee.Description = val; break;
		case "PJR-WK-PHONE-NBR": parent.PA42.WorkPhoneNumber = val; break;
		case "PJR-WK-PHONE-EXT": parent.PA42.WorkPhoneExt = val; break;
		case "PJR-WK-PHONE-CNTRY": parent.PA42.WorkPhoneCountry = val; break;
		case "PJR-UNION-CODE": parent.PA42.Union.Code = val; break;
		case "UNION-CODE-DESC":	parent.PA42.Union.Description = val; break;
		case "PJR-BARGAIN-UNIT": parent.PA42.BargainUnit.Code = val; break;
		case "BARGAIN-UNIT-DESC": parent.PA42.BargainUnit.Description = val; break;
		case "PJR-REQUEST-BY": parent.PA42.RequestedBy.Code = val; break;
		case "EMP-2-FULL-NAME":	parent.PA42.RequestedBy.Description = val; break;
		case "PJR-INTERNAL-START": parent.PA42.InternalPostDateStart = parent.FormatDte4(val); break;
		case "PJR-INTERNAL-STOP": parent.PA42.InternalPostDateStop = parent.FormatDte4(val); break;
		case "PJR-EXTERNAL-START": parent.PA42.ExternalPostDateStart = parent.FormatDte4(val); break;
		case "PJR-EXTERNAL-STOP": parent.PA42.ExternalPostDateStop = parent.FormatDte4(val); break;
		case "PJR-CONTACT-FIRST": parent.PA42.ContactFirst = val; break;
		case "PJR-CONTACT-LAST": parent.PA42.ContactLast = val; break;
	}
}
//GDD  07/08/14  Added new function
function PA46V(fldnbr, val)
{
	switch(fldnbr)
	{
		case "PJR-REQUISITION": 	parent.PA46.Requistion = val;					break
	}
}
//GDD end of change

function DataReturned(fldnbr, msgnbr, msg)
{
	gmsgnbr	= msgnbr;
	gmsg = msg;
	gfldnbr = fldnbr;
}
</script>
</head>
<body></body>
</html>
<!-- Version: 8-)@(#)@10.00.05.00.12 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/JobRequisitions/Lib/SEA_LAW.htm,v 1.6.2.11 2014/02/20 20:04:49 brentd Exp $ -->
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
