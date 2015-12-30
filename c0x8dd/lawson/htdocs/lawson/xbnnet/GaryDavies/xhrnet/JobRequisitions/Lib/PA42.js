// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/JobRequisitions/Lib/PA42.js,v 1.6.2.6 2006/10/10 05:51:23 brentd Exp $
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



	this.FillDefaults = function(Position, JobCode, DateNeeded, StatusCode, CallBack)
	{ //PT 162345
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
		pAGSObj.rtn	 	= "DATA"
		pAGSObj.lfn		= "ALL";
		pAGSObj.longNames	= true
		pAGSObj.tds		= false
		pAGSObj.field	 	= "FC=A"
			+ "&PJR-COMPANY="		+ Number(authUser.company)
			//+ "&PJR-REQUISITION="	+ ParseAGSValue(this.Requistion.Code)
			+ "&PJR-EFFECT-DATE="	+ authUser.date
			+ "&PJR-REQ-STATUS="	+ ParseAGSValue(this.ReqStatus.Code)
			+ "&PJR-REQUEST-DATE="	+ authUser.date
			// PT 112623
			+ "&PJR-REQUEST-BY="	+ authUser.employee

		if(this.OpenDateNeeded)
			pAGSObj.field += "&PJR-OPEN-DATE=" + authUser.date

		pAGSObj.field += "&PJR-DATE-NEEDED="+ formjsDate(this.DateNeeded)
			+ "&PJR-CLOSED-DATE="	+ formjsDate(this.ClosedDate)
			+ "&PJR-OPENINGS="	+ ParseAGSValue(this.Openings)
			+ "&PJR-OFFERS-ACCEPT="	+ ParseAGSValue(this.OffersAccept)
			+ "&PJR-REMAINING-OPEN="+ ParseAGSValue(this.Openings)
			+ "&PJR-OPEN-FTE="	+ ParseAGSValue(this.OpenFTE)
			//PT 108920 - only update open FTE value on an add transaction
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
			// PT 125516
			// + "&PJR-PAY-GRADE="	+ ParseAGSValue(Number(this.Grade))
			+ "&PJR-PAY-GRADE="	+ ParseAGSValue(this.Grade)
			//PT 159948
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

		if(this.RecruitingFlag) {
			pAGSObj.field += "&PRS-RECRUIT-FLAG="	+ ParseAGSValue(this.RecruitingFlag)
		}
		
		pAGSObj.field += "&PJR-POSITION="+ ParseAGSValue(this.Position.Code)
		pAGSObj.field += "&PJR-JOB-CODE="+ ParseAGSValue(this.JobCode.Code)

		if (XMIT) {
			pAGSObj.field += "&PT-XMIT-NBR1="+ XMIT
		}
		
		pAGSObj.func	= "parent."+CallBack+"()";
		pAGSObj.debug	= false
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

// PT 138069
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
// PT 138069	
