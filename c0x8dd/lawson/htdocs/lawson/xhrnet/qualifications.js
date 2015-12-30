// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/qualifications.js,v 1.10.2.16.2.1 2014/03/18 08:38:39 kevinct Exp $
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
var RenewalCodesExist = false;

function QualProfileObject()
{
	this.detailMax = null;
	this.company = null;
	this.employee = null;
	this.requestor = null;
	this.essential = null;
	this.empProfile = null;
	this.expireDays = null;
	this.jobCompFlag = null;
	this.empCompFlag = null;
	this.jobDetailFlag = null;
	this.jobDescFlag = null;
	this.posDetailFlag = null;
	this.position = null;
	this.posDesc = null;
	this.jobCode = null;
	this.jbcDesc = null;
	this.courseGapFlag = null;
	this.courseCount = null;
	this.NextReviewDate = null;
	this.CompetencyDetail = new Array();
	this.CertificationDetail = new Array();
	this.EducationDetail = new Array();
}

function DetailObject()
{
	this.sort = null;
	this.weight = null;
	this.type = null;
	this.code = null;
	this.subject = null;
	this.description = null;
	this.essentialReq = null;
	this.empHasCode = null;
	this.updateFlag = null;
	this.jobProfic = null;
	this.empProfic = null;
	this.empProficDesc = null;
	this.gap = null;
	this.gapLevel = null;
	this.seqNbr = null;
	this.renewDate = null;
}

function CodeDescObject(code, description)
{
	this.code = code;
	this.description = description;
	if (arguments.length==3)
		this.type = arguments[2];
}

var QualificationProfile = new Object();

//
// Retrieve all qualification records for an employee.  
//
function Do_HS50_Call(requestor, essential, profile, jobcode, program, window, employee, sorttype)
{
	if (typeof(program) == "undefined" || program == null)
		program = "HS50.1";
	var programSafeStr = program.split(".").join("_");
	QualificationProfile = new QualProfileObject();
	self.lawheader.DetailLine = 0;
	self.lawheader.UpdateType = programSafeStr;
	var hAgsObj = new AGSObject(authUser.prodline, program);
	hAgsObj.event = "ADD";
	hAgsObj.rtn = "DATA";
	hAgsObj.out	= "JAVASCRIPT";
	hAgsObj.longNames = "ALL";
	hAgsObj.tds	= false;
	hAgsObj.field = "FC=I"
	+ "&COMPANY=" + escapeEx(authUser.company)
	+ "&EMPLOYEE=" + escapeEx(employee);
	if (typeof(requestor) != "undefined" && requestor != null)				
		hAgsObj.field += "&REQUESTOR=" + escapeEx(requestor,1);
	if (typeof(essential) != "undefined" && essential != null)		
		hAgsObj.field += "&ESSENTIAL=" + escapeEx(essential,1);
	if (typeof(profile) != "undefined" && profile != null)		
		hAgsObj.field += "&EMP-PROFILE=" + escapeEx(profile,1);
	if (typeof(jobcode) != "undefined" && jobcode != null)		
		hAgsObj.field += "&JOB-CODE=" + escapeEx(jobcode,1);
	if (sorttype && !isNaN(parseFloat(sorttype)) && (1 <= sorttype && sorttype <= 3))
		hAgsObj.field += "&SORT-TYPE="+parseInt(sorttype,10);
	if (typeof(window) != "undefined" && window != null)	
		hAgsObj.func = "parent.Do_"+programSafeStr+"_Call_"+window+"_Finished()";	
	else
		hAgsObj.func = "parent.Do_"+programSafeStr+"_Call_Finished()";
	hAgsObj.debug = false;
	AGS(hAgsObj,"jsreturn");
}

//
// Perform an Add, Change, or Delete of an education record.  
// Inputs:
// fc 		... function code of the action performed ("A", "C", "D")
// qualform 	... competency form object (see below for properties)
// program	... form id that we are updating against (PA21.1 or PA34.1)
// type		... default is "form"; if = "file", reference EMPCODES fields
function Do_Edu_Call(qualform, program, fc, type, ee, noProcessingMsg)
{	
	program = program.toUpperCase();
	var isFile = (type && type=="file") ? true : false;
	var func = program.split(".").join("_");
	var rowNbr = "";
	var ptFields = "&WEB-UPDATE=Y";
	var pAgsObj = new AGSObject(authUser.prodline, program);
	pAgsObj.event = "CHG";
	pAgsObj.rtn = "DATA";
	pAgsObj.out = "JAVASCRIPT";
	pAgsObj.longNames = "ALL";
	pAgsObj.tds = false;
	pAgsObj.field = "FC=C"
	+ "&EDU-COMPANY="+escape(authUser.company);
	if (ee)
		pAgsObj.field += "&EDU-EMPLOYEE="+escape(ee);
	else if (typeof(qualform.applicant) != "undefined" && qualform.applicant)
	{
		if (isFile)
			pAgsObj.field += "&EDU-EMPLOYEE="+escape(qualform.applicant);
		else
			pAgsObj.field += "&EDU-EMPLOYEE="+escape(qualform.applicant.value);
	}
	else
		pAgsObj.field += "&EDU-EMPLOYEE="+escape(authUser.employee);
	pAgsObj.field += "&LINE-FC"+rowNbr+"1="+fc;		
	if (fc != "A")	
	{
		if (isFile)
		{
			ptFields += "&PT-EDU-SEQ-NBR="+ParseAGSValue(qualform.seq_nbr);
			pAgsObj.field += "&EDU-SEQ-NBR"+rowNbr+"1="+ParseAGSValue(qualform.seq_nbr);
		}
		else
		{
			ptFields += "&PT-EDU-SEQ-NBR="+ParseAGSValue(qualform.seqnbr.value);
			pAgsObj.field += "&EDU-SEQ-NBR"+rowNbr+"1="+ParseAGSValue(qualform.seqnbr.value);
		}
	}
    if (typeof(qualform.degree) != "undefined")
    {	
		if (isFile)
		{
			ptFields += "&PT-EDU-ED-DEGREE="+ParseAGSValue(qualform.code,1)
			+ "&PT-EDU-ED-SUBJECT="+ParseAGSValue(qualform.subject,1);
			pAgsObj.field += "&EDU-ED-DEGREE"+rowNbr+"1="+ParseAGSValue(qualform.code,1)
			+ "&EDU-ED-SUBJECT"+rowNbr+"1="+ParseAGSValue(qualform.subject,1)
			+ "&EDU-ED-INSTIT"+rowNbr+"1="+ParseAGSValue(qualform.instructor,1);
		}	
		else
		{
			if (qualform.degree.type == "text")
			{		
				ptFields += "&PT-EDU-ED-DEGREE="+ParseAGSValue(qualform.degree.value,1)
				+ "&PT-EDU-ED-SUBJECT="+ParseAGSValue(qualform.subject.value,1);
				pAgsObj.field += "&EDU-ED-DEGREE"+rowNbr+"1="+ParseAGSValue(qualform.degree.value,1)
				+ "&EDU-ED-SUBJECT"+rowNbr+"1="+ParseAGSValue(qualform.subject.value,1)
				+ "&EDU-ED-INSTIT"+rowNbr+"1="+ParseAGSValue(qualform.instructor.value,1);
			}
			else
			{
				ptFields += "&PT-EDU-ED-DEGREE="+ParseAGSValue(qualform.degree.options[qualform.degree.selectedIndex].value,1)
				+ "&PT-EDU-ED-SUBJECT="+ParseAGSValue(qualform.subject.options[qualform.subject.selectedIndex].value,1);				
				pAgsObj.field += "&EDU-ED-DEGREE"+rowNbr+"1="+ParseAGSValue(qualform.degree.options[qualform.degree.selectedIndex].value,1)
				+ "&EDU-ED-SUBJECT"+rowNbr+"1="+ParseAGSValue(qualform.subject.options[qualform.subject.selectedIndex].value,1)
				+ "&EDU-ED-INSTIT"+rowNbr+"1="+ParseAGSValue(qualform.instructor.options[qualform.instructor.selectedIndex].value,1);
			}
		}
	}
	else
	{
		if (isFile)
		{
			ptFields += "&PT-EDU-ED-DEGREE="+ParseAGSValue(qualform.code,1)
			+ "&PT-EDU-ED-SUBJECT="+ParseAGSValue(qualform.subject,1);
			pAgsObj.field += "&EDU-ED-DEGREE"+rowNbr+"1="+ParseAGSValue(qualform.code,1)
			+ "&EDU-ED-SUBJECT"+rowNbr+"1="+ParseAGSValue(qualform.subject,1)
			+ "&EDU-ED-INSTIT"+rowNbr+"1="+ParseAGSValue(qualform.instructor,1);
		}	
		else
		{
			ptFields += "&PT-EDU-ED-DEGREE="+ParseAGSValue(qualform.code.value,1);
			pAgsObj.field += "&EDU-ED-DEGREE"+rowNbr+"1="+ParseAGSValue(qualform.code.value,1);			
			if (qualform.subject.type == "text")
			{
				ptFields += "&PT-EDU-ED-SUBJECT="+ParseAGSValue(qualform.subject.value,1);
				pAgsObj.field += "&EDU-ED-SUBJECT"+rowNbr+"1="+ParseAGSValue(qualform.subject.value,1)
				+ "&EDU-ED-INSTIT"+rowNbr+"1="+ParseAGSValue(qualform.instructor.value,1);			
			}
			else
			{
				ptFields += "&PT-EDU-ED-SUBJECT="+ParseAGSValue(qualform.subject.options[qualform.subject.selectedIndex].value,1);
				pAgsObj.field += "&EDU-ED-SUBJECT"+rowNbr+"1="+ParseAGSValue(qualform.subject.options[qualform.subject.selectedIndex].value,1)
				+ "&EDU-ED-INSTIT"+rowNbr+"1="+ParseAGSValue(qualform.instructor.options[qualform.instructor.selectedIndex].value,1);
			}
		}	
	}	
	// Only pass remaining detail records if we are doing an "Add" or "Change".
	if (fc != "D")
	{	
		if (isFile)
		{
			ptFields += "&PT-EDU-COM-DATE="+((NonSpace(qualform.renew_date) == 0) ? "00000000" : ParseAGSValue(formjsDate(formatDME(qualform.renew_date))));
			// PT 149297. Explicitly zero out the date, if blank.
			pAgsObj.field += "&EDU-COM-DATE"+rowNbr+"1="+((NonSpace(qualform.renew_date) == 0) ? "00000000" : ParseAGSValue(formjsDate(formatDME(qualform.renew_date))));
			pAgsObj.field += "&EDU-PER-RATING"+rowNbr+"1="+ParseAGSValue(qualform.per_rating,1)
			+ "&EDU-IN-PRO-FLAG"+rowNbr+"1="+ParseAGSValue(qualform.in_pro_flag);
		}
		else
		{	
			ptFields += "&PT-EDU-COM-DATE="+((NonSpace(qualform.renewaldate.value) == 0) ? "00000000" : ParseAGSValue(formjsDate(formatDME(qualform.renewaldate.value))));
			// PT 149297. Explicitly zero out the date, if blank.
			pAgsObj.field += "&EDU-COM-DATE"+rowNbr+"1="+((NonSpace(qualform.renewaldate.value) == 0) ? "00000000" : ParseAGSValue(formjsDate(formatDME(qualform.renewaldate.value))));
			pAgsObj.field += "&EDU-PER-RATING"+rowNbr+"1="+ParseAGSValue(qualform.perrating.value,1)
			+ "&EDU-IN-PRO-FLAG"+rowNbr+"1="+ParseAGSValue(qualform.inproflag.options[qualform.inproflag.selectedIndex].value);
		}
		if (typeof(qualform.cosponsored) != "undefined" && qualform.cosponsored)
		{	
			if (isFile)
				pAgsObj.field += "&EDU-CO-SPONSORED"+rowNbr+"1="+ParseAGSValue(qualform.co_sponsored);
			else	
				pAgsObj.field += "&EDU-CO-SPONSORED"+rowNbr+"1="+ParseAGSValue(qualform.cosponsored.options[qualform.cosponsored.selectedIndex].value);
		}
	}
	if (fc == "C" || fc == "D")
	{
		if (typeof(qualform.svsubject) != "undefined" && qualform.svsubject)
		{
			if (isFile)
				pAgsObj.field += "&EDU-SV-SUBJECT"+rowNbr+"1="+ParseAGSValue(qualform.svsubject);
			else
				pAgsObj.field += "&EDU-SV-SUBJECT"+rowNbr+"1="+ParseAGSValue(qualform.svsubject.value);
		}
	}
	if (fc!="A" && program=="PA20.1")
		pAgsObj.field += ptFields;
	pAgsObj.func = "parent.Do_"+func+"_Edu_Call_Finished('"+fc+"')";
	pAgsObj.debug = false;
	if (!noProcessingMsg) 
		showWaitAlert(getSeaPhrase("QUAL_35","ESS"),function(){AGS(pAgsObj, "jsreturn");});
	else
		AGS(pAgsObj, "jsreturn");
}

//
// Perform an Add, Change, or Delete of a competency record.  
// Inputs:
// fc 		... function code of the action performed ("A", "C", "D")
// qualform ... competency form object (see below for properties)
// program	... form id that we are updating against (PA21.1 or PA34.1)
// type		... default is "form"; if = "file", reference EMPCODES fields
function Do_Cmp_Call(qualform, program, fc, type, ee, noProcessingMsg)
{	
	program = program.toUpperCase();
	var isFile = (type && type=="file")?true:false;
	var func = program.split(".").join("_");
	var rowNbr = "";
	var ptFields = "&WEB-UPDATE=Y";
	var pAgsObj	= new AGSObject(authUser.prodline, program);
	pAgsObj.event = "CHG";
	pAgsObj.rtn = "DATA";
	pAgsObj.out = "JAVASCRIPT";
	pAgsObj.longNames = "ALL";
	pAgsObj.tds = false;
	pAgsObj.field = "FC=C"
	+ "&SKI-COMPANY="+escape(authUser.company);
	if (ee)
		pAgsObj.field += "&SKI-EMPLOYEE="+escape(ee);
	else if (typeof(qualform.applicant) != "undefined" && qualform.applicant)
	{
		if (isFile)
			pAgsObj.field += "&SKI-EMPLOYEE="+escape(qualform.applicant);
		else
			pAgsObj.field += "&SKI-EMPLOYEE="+escape(qualform.applicant.value);
	}
	else
		pAgsObj.field += "&SKI-EMPLOYEE="+escape(authUser.employee);
	pAgsObj.field += "&LINE-FC"+rowNbr+"1="+fc;
    if (typeof(qualform.qualification) != "undefined")
    {	
    	if (isFile)
    	{
			ptFields += "&PT-SKI-CODE="+ParseAGSValue(qualform.code,1);	
    		pAgsObj.field += "&PCO-SK-DESCRIPTION"+rowNbr+"1="+ParseAGSValue(qualform.qualification,1)
	    	+ "&SKI-CODE"+rowNbr+"1="+ParseAGSValue(qualform.code,1);	
    	}
    	else if (!qualform.code.options)
    	{
    		ptFields += "&PT-SKI-CODE="+ParseAGSValue(qualform.code.value,1);   	
    		pAgsObj.field += "&PCO-SK-DESCRIPTION"+rowNbr+"1="+ParseAGSValue(qualform.qualification.value,1)
	    	+ "&SKI-CODE"+rowNbr+"1="+ParseAGSValue(qualform.code.value,1);   			
    	}
    	else
    	{	
    		ptFields += "&PT-SKI-CODE="+ParseAGSValue(qualform.code.options[qualform.code.selectedIndex].value,1);
	   		pAgsObj.field += "&PCO-SK-DESCRIPTION"+rowNbr+"1="+ParseAGSValue(qualform.qualification.value,1)
	   		+ "&SKI-CODE"+rowNbr+"1="+ParseAGSValue(qualform.code.options[qualform.code.selectedIndex].value,1);
	    }
    }
	else
	{
		if (isFile)
		{
	    	ptFields += "&PT-SKI-SEQ-NBR="+ParseAGSValue(qualform.seq_nbr)
	    	+ "&PT-SKI-CODE="+ParseAGSValue(qualform.code.value,1)
	    	+ "&PT-EPC-TYPE="+ParseAGSValue(qualform.type.value);
			pAgsObj.field += "&SKI-SEQ-NBR"+rowNbr+"1="+ParseAGSValue(qualform.seq_nbr)
	     	+ "&SKI-CODE"+rowNbr+"1="+ParseAGSValue(qualform.code,1)
	     	+ "&EPC-TYPE"+rowNbr+"1="+ParseAGSValue(qualform.type);	
		}
		else
		{	
	    	ptFields += "&PT-SKI-SEQ-NBR="+ParseAGSValue(qualform.seqnbr.value)
	    	+ "&PT-SKI-CODE="+ParseAGSValue(qualform.code.value,1)
	    	+ "&PT-EPC-TYPE="+ParseAGSValue(qualform.type.value);
	     	pAgsObj.field += "&SKI-SEQ-NBR"+rowNbr+"1="+ParseAGSValue(qualform.seqnbr.value)
	     	+ "&SKI-CODE"+rowNbr+"1="+ParseAGSValue(qualform.code.value,1)
	     	+ "&EPC-TYPE"+rowNbr+"1="+ParseAGSValue(qualform.type.value);
		}
	}
	// Only pass remaining detail records if we are doing an "Add" or "Change".
	if (fc != "D")
	{
		if (isFile)
		{
			ptFields += "&PT-DATE-ACQUIRED="+ParseAGSValue(formjsDate(formatDME(qualform.date_acquired)));			
			pAgsObj.field += "&SKI-PROFIC-LEVEL"+rowNbr+"1="+ParseAGSValue(qualform.profic_level,1)
			+ "&SKI-SKILL-SOURCE"+rowNbr+"1="+ParseAGSValue(qualform.skill_source,1)
			+ "&EPC-RENEWAL-CODE"+rowNbr+"1="+ParseAGSValue(qualform.renewal_code,1)
			+ "&SKI-PER-RATING"+rowNbr+"1="+((!isNaN(parseFloat(qualform.per_rating))) ? ParseAGSValue(parseFloat(qualform.per_rating)) : "0")
			+ "&SKI-DATE-ACQUIRED"+rowNbr+"1="+ParseAGSValue(formjsDate(formatDME(qualform.date_acquired)))
			+ "&SKI-DATE-LST-USED"+rowNbr+"1="+ParseAGSValue(formjsDate(formatDME(qualform.renew_date)))
			+ "&EPC-DATE-RETURNED"+rowNbr+"1="+ParseAGSValue(formjsDate(formatDME(qualform.date_returned)));
		}
		else
		{
			pAgsObj.field += "&SKI-PROFIC-LEVEL"+rowNbr+"1="+ParseAGSValue(qualform.proficiency.options[qualform.proficiency.selectedIndex].value,1);
			if (qualform.skillsource.type == "text")
				pAgsObj.field += "&SKI-SKILL-SOURCE"+rowNbr+"1="+ParseAGSValue(qualform.skillsource.value,1);
			else
				pAgsObj.field += "&SKI-SKILL-SOURCE"+rowNbr+"1="+ParseAGSValue(qualform.skillsource.options[qualform.skillsource.selectedIndex].value,1);
			ptFields += "&PT-DATE-ACQUIRED="+ParseAGSValue(formjsDate(formatDME(qualform.dateacquired.value)));			
			pAgsObj.field += "&EPC-RENEWAL-CODE"+rowNbr+"1="+ParseAGSValue(qualform.renewalcode.options[qualform.renewalcode.selectedIndex].value,1)
			+ "&SKI-PER-RATING"+rowNbr+"1="+((!isNaN(parseFloat(qualform.perrating.value))) ? ParseAGSValue(parseFloat(qualform.perrating.value)) : "0")
			+ "&SKI-DATE-ACQUIRED"+rowNbr+"1="+ParseAGSValue(formjsDate(formatDME(qualform.dateacquired.value)))
			+ "&SKI-DATE-LST-USED"+rowNbr+"1="+ParseAGSValue(formjsDate(formatDME(qualform.renewdate.value)))
			+ "&EPC-DATE-RETURNED"+rowNbr+"1="+ParseAGSValue(formjsDate(formatDME(qualform.datereturned.value)));
		}
		if (typeof(qualform.instructor) != "undefined" && qualform.instructor)
		{
			if (isFile)
				pAgsObj.field += "&SKI-INSTRUCTOR"+rowNbr+"1="+ParseAGSValue(qualform.instructor,1);
			else	
				pAgsObj.field += "&SKI-INSTRUCTOR"+rowNbr+"1="+ParseAGSValue(qualform.instructor.value,1);
		}
		if (typeof(qualform.cosponsored) != "undefined" && qualform.cosponsored)
		{	
			if (isFile)
				pAgsObj.field += "&SKI-CO-SPONSORED"+rowNbr+"1="+ParseAGSValue(qualform.co_sponsored);
			else
				pAgsObj.field += "&SKI-CO-SPONSORED"+rowNbr+"1="+ParseAGSValue(qualform.cosponsored.options[qualform.cosponsored.selectedIndex].value);
		}
	}
	if (fc!="A" && program=="PA21.1")
	  	pAgsObj.field += ptFields;	
	pAgsObj.func = "parent.Do_"+func+"_Cmp_Call_Finished('"+fc+"')";
	pAgsObj.debug = false;
	if (!noProcessingMsg)
		showWaitAlert(getSeaPhrase("QUAL_35","ESS"),function(){AGS(pAgsObj, "jsreturn");});
	else
		AGS(pAgsObj, "jsreturn");
}

//
// Perform an Add, Change, or Delete of a certification record.  
// Inputs:
// fc 		... function code of the action performed ("A", "C", "D")
// qualform ... certification form object (see below for properties)
// program	... form id that we are updating against (PA21.1 or PA34.1)
// type		... default is "form"; if = "file", reference EMPCODES fields
function Do_Crt_Call(qualform, program, fc, type, ee, noProcessingMsg, isMgr)
{	
	program = program.toUpperCase();
	var isFile = (type && type=="file")?true:false;
	var func = program.split(".").join("_");
	var rowNbr = "";
	var ptFields = "&WEB-UPDATE=Y";
	isMgr = isMgr || false;
	var pAgsObj = new AGSObject(authUser.prodline, program);
	pAgsObj.event = "CHG";
	pAgsObj.rtn = "DATA";
	pAgsObj.out = "JAVASCRIPT";
	pAgsObj.longNames = "ALL";
	pAgsObj.tds = false;
	pAgsObj.field = "FC=C"
	+ "&CER-COMPANY="+escape(authUser.company);
	if (ee)
		pAgsObj.field += "&CER-EMPLOYEE="+escape(ee);
	else if (typeof(qualform.applicant) != "undefined" && qualform.applicant)
	{
		if (isFile)
			pAgsObj.field += "&CER-EMPLOYEE="+escape(qualform.applicant);
		else	
			pAgsObj.field += "&CER-EMPLOYEE="+escape(qualform.applicant.value);
	}
	else
		pAgsObj.field += "&CER-EMPLOYEE="+escape(authUser.employee);
	pAgsObj.field += "&LINE-FC"+rowNbr+"1="+fc;
	if (typeof(qualform.qualification) != "undefined")
	{
		if (isFile)
		{
			ptFields += "&PT-CER-CODE="+ParseAGSValue(qualform.code,1);			
			pAgsObj.field += "&PCO-DESCRIPTION"+rowNbr+"1="+ParseAGSValue(qualform.qualification,1)
			+ "&CER-CODE"+rowNbr+"1="+ParseAGSValue(qualform.code,1);	
		}
		else if (!qualform.code.options)
		{
			ptFields += "&PT-CER-CODE="+ParseAGSValue(qualform.code.value,1);
			pAgsObj.field += "&PCO-DESCRIPTION"+rowNbr+"1="+ParseAGSValue(qualform.qualification.value,1)
			+ "&CER-CODE"+rowNbr+"1="+ParseAGSValue(qualform.code.value,1);		
		}
		else
		{	
			ptFields += "&PT-CER-CODE="+ParseAGSValue(qualform.code.options[qualform.code.selectedIndex].value,1);
			pAgsObj.field += "&PCO-DESCRIPTION"+rowNbr+"1="+ParseAGSValue(qualform.qualification.value,1)
			+ "&CER-CODE"+rowNbr+"1="+ParseAGSValue(qualform.code.options[qualform.code.selectedIndex].value,1);
		}
	}
	else
	{
		if (isFile)
		{
			ptFields += "&PT-CER-CODE="+ParseAGSValue(qualform.code,1);
			+ "&PT-CER-SEQ-NBR="+ParseAGSValue(qualform.seq_nbr);
			pAgsObj.field += "&CER-SEQ-NBR"+rowNbr+"1="+ParseAGSValue(qualform.seq_nbr)
			+ "&CER-CODE"+rowNbr+"1="+ParseAGSValue(qualform.code,1);
		}
		else
		{
			ptFields += "&PT-CER-CODE="+ParseAGSValue(qualform.code.value,1)
			+ "&PT-CER-SEQ-NBR="+ParseAGSValue(qualform.seqnbr.value);
			pAgsObj.field += "&CER-SEQ-NBR"+rowNbr+"1="+ParseAGSValue(qualform.seqnbr.value)
			+ "&CER-CODE"+rowNbr+"1="+ParseAGSValue(qualform.code.value,1);
		}
	}
	// Only pass remaining detail records if we are doing an "Add" or "Change".
	if (fc != "D")
	{
		if (isFile)
		{
			ptFields += "&PT-CER-DATE-ACQUIRED="+ParseAGSValue(formjsDate(formatDME(qualform.date_acquired)));			
			pAgsObj.field += "&EPC-STATE"+rowNbr+"1="+ParseAGSValue(qualform.state,1)
			+ "&CER-LIC-NUMBER"+rowNbr+"1="+ParseAGSValue(qualform.lic_number,1)
			+ "&CER-DATE-ACQUIRED"+rowNbr+"1="+ParseAGSValue(formjsDate(formatDME(qualform.date_acquired)))
			+ "&CER-RENEW-DATE"+rowNbr+"1="+ParseAGSValue(formjsDate(formatDME(qualform.renew_date)))
			+ "&CER-RENEWAL-CODE"+rowNbr+"1="+ParseAGSValue(qualform.renewal_code,1)
			+ "&EPC-SKILL-SOURCE"+rowNbr+"1="+ParseAGSValue(qualform.skill_source,1)
			+ "&CER-COST"+rowNbr+"1="+ParseAGSValue(qualform.cost,1)
			+ "&CER-BASE-AMOUNT"+rowNbr+"1=0"
			+ "&CER-CURRENCY-CODE"+rowNbr+"1="+ParseAGSValue(qualform.currency_code,1);
		}
		else
		{	
			if (qualform.state.type == "text")
				pAgsObj.field += "&EPC-STATE"+rowNbr+"1="+ParseAGSValue(qualform.state.value,1);
			else
				pAgsObj.field += "&EPC-STATE"+rowNbr+"1="+ParseAGSValue(qualform.state.options[qualform.state.selectedIndex].value,1);
			ptFields += "&PT-CER-DATE-ACQUIRED="+ParseAGSValue(formjsDate(formatDME(qualform.dateacquired.value)));
			pAgsObj.field += "&CER-LIC-NUMBER"+rowNbr+"1="+ParseAGSValue(qualform.licnumber.value,1)
			+ "&CER-DATE-ACQUIRED"+rowNbr+"1="+ParseAGSValue(formjsDate(formatDME(qualform.dateacquired.value)))
			+ "&CER-RENEW-DATE"+rowNbr+"1="+ParseAGSValue(formjsDate(formatDME(qualform.renewdate.value)))
			+ "&CER-RENEWAL-CODE"+rowNbr+"1="+ParseAGSValue(qualform.renewalcode.options[qualform.renewalcode.selectedIndex].value,1);
			if (qualform.skillsource.type == "text")
				pAgsObj.field += "&EPC-SKILL-SOURCE"+rowNbr+"1="+ParseAGSValue(qualform.skillsource.value,1);
			else
				pAgsObj.field += "&EPC-SKILL-SOURCE"+rowNbr+"1="+ParseAGSValue(qualform.skillsource.options[qualform.skillsource.selectedIndex].value,1);
			pAgsObj.field += "&CER-COST"+rowNbr+"1="+ParseAGSValue(qualform.cost.value,1)
			+ "&CER-BASE-AMOUNT"+rowNbr+"1=0";
			if (qualform.skillsource.type == "text")
				pAgsObj.field += "&CER-CURRENCY-CODE"+rowNbr+"1="+ParseAGSValue(qualform.currencycode.value,1);
			else
				pAgsObj.field += "&CER-CURRENCY-CODE"+rowNbr+"1="+ParseAGSValue(qualform.currencycode.options[qualform.currencycode.selectedIndex].value,1);
		}		
		if (typeof(qualform.cosponsored) != "undefined" && qualform.cosponsored)
		{
			if (isFile)
				pAgsObj.field += "&CER-CO-SPONSORED"+rowNbr+"1="+ParseAGSValue(qualform.co_sponsored);
			else
				pAgsObj.field += "&CER-CO-SPONSORED"+rowNbr+"1="+ParseAGSValue(qualform.cosponsored.options[qualform.cosponsored.selectedIndex].value);	
		}
		if (!isMgr)
			pAgsObj.field += "&EPC-VERIFIED-FLAG"+rowNbr+"1=N";
	}
	if (fc!="A" && program=="PA22.1")
		pAgsObj.field += ptFields;
	pAgsObj.func = "parent.Do_"+func+"_Crt_Call_Finished('"+fc+"')";
	pAgsObj.debug = false;
	if (!noProcessingMsg)
		showWaitAlert(getSeaPhrase("QUAL_35","ESS"),function(){AGS(pAgsObj, "jsreturn");});
	else
		AGS(pAgsObj, "jsreturn");
}

var renewalCodes = new Array();
var renewalNames = new Array();

function BuildRenewalSelect(value)
{
	if (!RenewalCodesExist)
	{
		RenewalCodesExist = true;
		renewalCodes = new Array("  ","2Y","3Y", "4Y", "5Y", "6Y", "7Y", "8Y", "9Y", "AN", "QT", "SA");
		renewalNames = new Array(" ", getSeaPhrase("RENEWAL_CODE_0","ESS"), getSeaPhrase("RENEWAL_CODE_1","ESS"), getSeaPhrase("RENEWAL_CODE_2","ESS"), 
			getSeaPhrase("RENEWAL_CODE_3","ESS"), getSeaPhrase("RENEWAL_CODE_4","ESS"), getSeaPhrase("RENEWAL_CODE_5","ESS"), getSeaPhrase("RENEWAL_CODE_6","ESS"), 
			getSeaPhrase("RENEWAL_CODE_7","ESS"), getSeaPhrase("RENEWAL_CODE_8","ESS"), getSeaPhrase("RENEWAL_CODE_9","ESS"), getSeaPhrase("RENEWAL_CODE_10","ESS"));
	}
	var selectrec = new Array();
	for (var i=0; i<renewalCodes.length; i++)
	{
        selectrec[i] = '<option value="'+renewalCodes[i]+'"';
		if (value == renewalCodes[i])
			selectrec[i] += ' selected';
		selectrec[i] += '>'+renewalNames[i];
	}	
	return selectrec.join("");
}

function BuildSelect(value, SelectType)
{
	var selectrec = new Array();
	selectrec[0] = '<option value=" ">';	
	for (var i=0; i<SelectType.length; i++)
	{
        selectrec[i+1] = '<option value="'+SelectType[i].code+'"';
		selectrec[i+1] += (value == SelectType[i].code)?' selected>':'>';
		selectrec[i+1] += SelectType[i].description;
	}
	return selectrec.join("");
}

function BuildYesNo(value)
{
	var select = '<option value="N" ';
	select += (value == "N")? 'selected>':'>';
	select += getSeaPhrase("NO","ESS");
	select += '<option value="Y" ';
	select += (value == "Y")? 'selected>':'>';	
	select += getSeaPhrase("YES","ESS");
	return select;
}

function MatchForDescription(value, SelectType)
{
	for (var i=0; i<SelectType.length; i++)
	{
		if (value == SelectType[i].code)
			return SelectType[i].description;
	}
	return "&nbsp;";
}

// Supplemental function for use with statesuscan.js library.
function ReturnStateDescription(code)
{
	for (var i=0; i<pStateProvince.length; i++)
	{
		if (pStateProvince[i].code == code)
			return pStateProvince[i].description;
	}
	return code;
}

// Supplemental function for use with statesuscan.js library.
function ReturnStateCode(description)
{
	for (var i=0; i<pStateProvince.length; i++)
	{
		if (pStateProvince[i].description == description)
			return pStateProvince[i].code;
	}	
	return description;
}

function escapeEx(arg)
{
	arg = escape(arg,1);
	return arg.replace(/\+/g, "%2B");
}

function ParseAGSValue(value, flag)
{
	return  (value == "") ? escape(" ") : ((flag) ? escapeEx(value) : escape(value));
}
