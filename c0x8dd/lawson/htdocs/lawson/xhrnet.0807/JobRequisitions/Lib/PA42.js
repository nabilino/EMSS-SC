// Version: 8-)@(#)@10.00.02.00.29
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/JobRequisitions/Lib/PA42.js,v 1.6.2.9 2012/06/29 17:24:29 brentd Exp $
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
function PA42Object()
{
	this.CurrentIndex		= 0;
	this.Company 			= new PA42Field();
	this.Requistion 		= new PA42Field();
	this.EffectiveDate 		= '';
	this.ReqStatus 			= new PA42Field();
	this.RequestDate 		= '';
	this.OpenDate 			= '';
	this.OpenDateNeeded 		= '';
	this.DateNeeded 		= '';
	this.ClosedDate 		= '';
	this.Openings 			= '0';
	this.OffersAccept 		= '';
	this.RemainingOpen 		= '0';
	this.OpenFTE 			= '';
	this.FilledFTE 			= '0';
	this.RemainingFTE 		= '';
	this.Position 			= new PA42Field();
	this.ProcessLevel 		= new PA42Field();
	this.Department 		= new PA42Field();
	this.JobCode 			= new PA42Field();
	this.EmployeeStatus 		= new PA42Field();
	this.TemporaryDatesBegin 	= '';
	this.TemporaryDatesEnd 		= '';
	this.UserLevel 			= new PA42Field();
	this.Supervisor 		= new PA42Field();
	this.Location 			= new PA42Field();
	this.SalaryClass 		= new PA42Field();
	this.SalaryBeginning 		= '';
	this.SalaryEnd 			= '';
	this.Currency	 		= new PA42Field();
	this.CurrencyFlag		= '';
	this.CurrencyLock		= 'N';
	this.ExemptFromOvertime 	= new PA42Field();
	this.Schedule 			= new PA42Field();
	this.Grade 			= '';
	this.Step 			= '';
	this.ScheduleDescription 	= '';
	this.WorkSchedule 		= new PA42Field();
	this.Shift 			= new PA42Field();
	this.Budgeted			= new PA42Field();
	this.Replacement		= new PA42Field();
	this.ReplacementEmployee	= new PA42Field();
	this.DirectReports		= new Array();
	this.RecruitingFlag		= '';
	this.WorkPhoneNumber		= '';
	this.WorkPhoneExt		= '';
	this.WorkPhoneCountry		= '';
	this.Union			= new PA42Field();
	this.BargainUnit		= new PA42Field();	
	this.RequestedBy		= new PA42Field();
	this.InternalPostDateStart	= '';
	this.InternalPostDateStop	= '';
	this.ExternalPostDateStart	= '';
	this.ExternalPostDateStop	= '';
	this.ContactFirst		= '';
	this.ContactLast		= '';	
	//GDD  03/18/14  Added new field
    this.GrantDesc          = '';


	this.FillDefaults = function(Position, JobCode, DateNeeded, StatusCode, CallBack)
	{
		PA42 = new PA42Object();				
		self.lawheader.UpdateType = "PA42";

		var pAGSObj	      = new AGSObject(authUser.prodline, "PA42.1")
		pAGSObj.event     = "ADD";
		pAGSObj.rtn       = "DATA";
		pAGSObj.longNames = true;
		pAGSObj.tds       = false;
		pAGSObj.func      = "parent."+CallBack+"()";
		pAGSObj.field     = "FC=F&PJR-COMPANY=" + authUser.company
			+ "&PJR-POSITION=" + ParseAGSValue(Position,1)
			+ "&PJR-JOB-CODE=" + ParseAGSValue(JobCode,1)
			+ "&PJR-DATE-NEEDED=" + DateNeeded
			+ "&PJR-REQ-STATUS=" + ParseAGSValue(StatusCode,1);
		pAGSObj.out       = "JAVASCRIPT";
		pAGSObj.debug     = false;
		AGS(pAGSObj, "jsreturn")
	}

	this.Add = function(CallBack, XMIT)
	{
		self.lawheader.UpdateType = "PA42";
		var pAGSObj   		= new AGSObject(authUser.prodline, "PA42.1")
		pAGSObj.event		= "ADD"
		pAGSObj.rtn	 		= "DATA"
		pAGSObj.lfn			= "ALL";
		pAGSObj.longNames	= true
		pAGSObj.tds			= false
		pAGSObj.field	 	= "FC=A"
			+ "&PJR-COMPANY="		+ Number(authUser.company)
			//+ "&PJR-REQUISITION="	+ ParseAGSValue(this.Requistion.Code)
			+ "&PJR-EFFECT-DATE="	+ authUser.date
			+ "&PJR-REQ-STATUS="	+ ParseAGSValue(this.ReqStatus.Code)
			+ "&PJR-REQUEST-DATE="	+ authUser.date
			+ "&PJR-REQUEST-BY="	+ authUser.employee

		if(this.OpenDateNeeded)
			pAGSObj.field += "&PJR-OPEN-DATE=" + authUser.date

		pAGSObj.field += "&PJR-DATE-NEEDED="+ formjsDate(this.DateNeeded)
			+ "&PJR-CLOSED-DATE="	+ formjsDate(this.ClosedDate)
			+ "&PJR-OPENINGS="	+ ParseAGSValue(this.Openings)
			+ "&PJR-OFFERS-ACCEPT="	+ ParseAGSValue(this.OffersAccept)
			+ "&PJR-REMAINING-OPEN="+ ParseAGSValue(this.Openings)
			+ "&PJR-OPEN-FTE="	+ ParseAGSValue(this.OpenFTE)
			//+ "&PJR-FILLED-FTE="	+ ParseAGSValue(this.OpenFTE)
			//+ "&PJR-REMAINING-FTE=" + ParseAGSValue(this.OpenFTE)
			+ "&PJR-PROCESS-LEVEL="	+ ParseAGSValue(this.ProcessLevel.Code)
			+ "&PJR-DEPARTMENT="	+ ParseAGSValue(this.Department.Code)
			+ "&PJR-APP-STATUS="	+ ParseAGSValue(this.EmployeeStatus.Code)
			+ "&PJR-TEMP-BEGIN="	+ formjsDate(this.TemporaryDatesBegin)
			+ "&PJR-TEMP-END="	+ formjsDate(this.TemporaryDatesEnd)
			+ "&PJR-USER-LEVEL="	+ ParseAGSValue(this.UserLevel.Code)
			+ "&PJR-SUPERVISOR="	+ ParseAGSValue(this.Supervisor.Code)
			+ "&PJR-LOCAT-CODE="	+ ParseAGSValue(this.Location.Code)
			+ "&PJR-SALARY-CLASS="	+ ParseAGSValue(this.SalaryClass.Code)
			+ "&PJR-BEG-PAY-RATE="	+ ParseAGSValue(this.SalaryBeginning)
			+ "&PJR-END-PAY-RATE="	+ ParseAGSValue(this.SalaryEnd)
			+ "&PJR-CURRENCY-CODE="	+ ParseAGSValue(this.Currency.Code)
			+ "&PJR-EXEMPT-EMP="	+ ParseAGSValue(this.ExemptFromOvertime.Code)
			+ "&PJR-SCHEDULE="	+ ParseAGSValue(this.Schedule.Code)
			// + "&PJR-PAY-GRADE="	+ ParseAGSValue(Number(this.Grade))
			+ "&PJR-PAY-GRADE="	+ ParseAGSValue(this.Grade)
			+ "&PJR-PAY-STEP="	+ ParseAGSValue(this.Step)
			+ "&PJR-WORK-SCHED="	+ ParseAGSValue(this.WorkSchedule.Code)
			+ "&PJR-SHIFT="		+ ParseAGSValue(this.Shift.Code)
			+ "&PJR-BUDGETED-FLAG="	+ ParseAGSValue(this.Budgeted.Code)
			+ "&PJR-REPLACEMENT="	+ ParseAGSValue(this.Replacement.Code)
			+ "&PJR-REP-EMPLOYEE="	+ ParseAGSValue(this.ReplacementEmployee.Code)
			+ "&PJR-UNION-CODE="	+ ParseAGSValue(this.Union.Code)
			+ "&PJR-BARGAIN-UNIT="	+ ParseAGSValue(this.BargainUnit.Code)
			+ "&PJR-CONTACT-FIRST=" + ParseAGSValue(this.ContactFirst)
			+ "&PJR-CONTACT-LAST="  + ParseAGSValue(this.ContactLast)
			+ "&PJR-WK-PHONE-NBR="  + ParseAGSValue(this.WorkPhoneNumber)
			+ "&PJR-WK-PHONE-EXT=" 	+ ParseAGSValue(this.WorkPhoneExt)
			+ "&PJR-WK-PHONE-CNTRY=" + ParseAGSValue(this.WorkPhoneCountry)
			+ "&PJR-INTERNAL-START=" + formjsDate(this.InternalPostDateStart)
			+ "&PJR-INTERNAL-STOP=" + formjsDate(this.InternalPostDateStop)
			+ "&PJR-EXTERNAL-START=" + formjsDate(this.ExternalPostDateStart)
			+ "&PJR-EXTERNAL-STOP=" + formjsDate(this.ExternalPostDateStop)

		//GDD  03/18/14  Add Grant if has a value
		if (this.GrantDesc != "") pAGSObj.field += "&PJR-SPEC-REQ1="+this.GrantDesc;	

		if(this.RecruitingFlag) 
        {
			pAGSObj.field += "&PRS-RECRUIT-FLAG="	+ ParseAGSValue(this.RecruitingFlag)
		}
		
		pAGSObj.field += "&PJR-POSITION="+ ParseAGSValue(this.Position.Code)
		pAGSObj.field += "&PJR-JOB-CODE="+ ParseAGSValue(this.JobCode.Code)

		if (XMIT) 
		{
			pAGSObj.field += "&PT-XMIT-NBR1="+ XMIT
		}
		
		pAGSObj.func	= "parent."+CallBack+"()";
		pAGSObj.debug	= false;
		AGS(pAGSObj, "jsreturn")
	}

	this.Inquire = function(Requisition, CallBack)
	{
		self.lawheader.UpdateType = "PA42";

		var pAGSObj	      = new AGSObject(authUser.prodline, "PA42.1")
		pAGSObj.event     = "ADD";
		pAGSObj.rtn       = "DATA";
		pAGSObj.longNames = true;
		pAGSObj.tds       = false;
		pAGSObj.func      = "parent."+CallBack+"()";
		pAGSObj.field     = "FC=I&PJR-COMPANY=" + authUser.company
			+ "&PJR-REQUISITION=" + ParseAGSValue(Requisition, 1);
		pAGSObj.out       = "JAVASCRIPT";
		pAGSObj.debug     = false;
		AGS(pAGSObj, "jsreturn")
	}

	this.NeedsOpenDate = function(XMIT)
	{
		this.OpenDateNeeded = true;
		var recruitFl = 0;
		var pDMEObj	= new DMEObject(authUser.prodline, "PRSYSTEM")
		pDMEObj.out 	= "JAVASCRIPT"
		pDMEObj.index 	= "PRSSET1";
		pDMEObj.field 	= "recruit-flag";
		pDMEObj.key 	= String(authUser.company);
		pDMEObj.cond 	= "company";
		pDMEObj.max 	= "1";
		pDMEObj.debug 	= false;
		pDMEObj.func 	= "PA42.NeedsOpenDate2("+XMIT+")";
		DME(pDMEObj,"jsreturn")
	}

	this.NeedsOpenDate2 = function(XMIT)
	{
		var recruitFl = 0;
		recruitFl = self.jsreturn.record[0].recruit_flag
		if(parseInt(recruitFl) == 2)
		{
			var pDMEObj	= new DMEObject(authUser.prodline, "PRSYSTEM")
			pDMEObj.out 	= "JAVASCRIPT"
			pDMEObj.index 	= "PRSSET1";
			pDMEObj.field 	= "recruit-flag";
			pDMEObj.key 	= String(authUser.company)+"="+String(this.ProcessLevel.Code);
			pDMEObj.cond 	= "active-pl";
			pDMEObj.max 	= "1";
			pDMEObj.debug 	= false;
			pDMEObj.func 	= "PA42.NeedsOpenDate3("+XMIT+",true)";

			DME(pDMEObj,"jsreturn")
		}
		else if(parseInt(recruitFl) == 1)
		{
			this.OpenDateNeeded = false;
			this.NeedsOpenDate3(XMIT);
		}
		else
		{
			this.NeedsOpenDate3(XMIT);
		}

	}
	
	this.NeedsOpenDate3 = function(XMIT,check)
	{
		if(check)
		{
			this.OpenDateNeeded = (self.jsreturn.record[0].recruit_flag != 'Y')
		}
		PA42.Add("PA42Call_DONE", XMIT)
	}
}

function PA42Field()
{
	this.Code = '';
	this.Description = '';
}

function DirectReportsObject()
{
	this.Code = '';
	this.Description = '';
	this.Next = false;
	this.NextFC = "";
	this.NextEmployee = "";
	this.NextSupervisorCode = "";
	this.NextSupervisorOpCode = "";
}	

function ParseAGSValue(value, flag)
{
	// PT 152614.  Since we are only using I, F, and A function codes, do not pass a
	// space character to AGS for a blank field.  This will fail on the Transaction servlet,
	// as it will try to validate the value.
	return (NonSpace(value) == 0) ? "" : escape(value,1);
}
