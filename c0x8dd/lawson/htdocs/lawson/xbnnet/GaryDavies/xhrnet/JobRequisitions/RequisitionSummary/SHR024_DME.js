// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/JobRequisitions/RequisitionSummary/SHR024_DME.js,v 1.4.2.3 2009/03/24 15:29:22 brentd Exp $
var HrSuperCodes;

function sortByDateNeeded(obj1, obj2)
{
	var name1 = Number(obj1["date_needed"]);
	var name2 = Number(obj2["date_needed"]);
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function GetDME_HRSUPER()
{
	HrSuper 		= new Array();
	HrSuperCodes		= new Array();
	var pDMEObj 		= new DMEObject(authUser.prodline, "HRSUPER");
		pDMEObj.out 	= "JAVASCRIPT";
		pDMEObj.index 	= "HSUSET3";
		pDMEObj.field 	= "code";		
		pDMEObj.key 	= String(authUser.company)+"="+String(authUser.employee);
		pDMEObj.cond 	= "active-code";
		pDMEObj.max 	= "600";
		pDMEObj.func 	= "DME_HRSUPER_Done()";
		pDMEObj.exclude = "drills;keys";
		pDMEObj.debug 	= false;
	DME(pDMEObj,"jsreturn")
}

function DME_HRSUPER_Done()
{
	HrSuper = HrSuper.concat(self.jsreturn.record);

	for (var i=0; i<self.jsreturn.record.length; i++) 
	{
		HrSuperCodes[HrSuperCodes.length] = self.jsreturn.record[i].code;
	}
	
	if (self.jsreturn.Next != "") 
	{
		self.jsreturn.location.replace(self.jsreturn.Next);
	}	
	else if(HrSuper.length == 0)
	{
		MsgBox(getSeaPhrase("NOT_SUPERVISOR","ESS"), "self")
	}
	else 
	{
		GetDME_PAJOBREQ();
	}
}

function GetDME_PAJOBREQ()
{
	Requisitions 		= new Array();
	var pDMEObj 		= new DMEObject(authUser.prodline, "PAJOBREQ");
		pDMEObj.out 	= "JAVASCRIPT";
		pDMEObj.index 	= "PJRSET1";
		pDMEObj.field 	= "requisition;description;req-status;req-status.description;"
				+ "date-needed;open-date;closed-date;contact-first;contact-last;"
				+ "label-name";
		pDMEObj.key 	= String(authUser.company)+"=";
		pDMEObj.select  = "request-by="+parseInt(authUser.employee,10)+"|supervisor="
		if (HrSuperCodes.length > 0)
		{
			pDMEObj.select += HrSuperCodes.join("|supervisor=")
	  	}
	  	pDMEObj.cond	= "not-closed2";
		pDMEObj.max 	= "600";
		pDMEObj.func 	= "DME_PAJOBREQ_Done()";
		pDMEObj.exclude = "drills;keys";
		pDMEObj.debug 	= false;
	DME(pDMEObj,"jsreturn");
}

function DME_PAJOBREQ_Done()
{
	Requisitions = Requisitions.concat(self.jsreturn.record);
	
	if (self.jsreturn.Next != "") {
		self.jsreturn.location.replace(self.jsreturn.Next);
	}	
	else 
	{
		for (var i=0; i<Requisitions.length; i++) 
		{
			Requisitions[i].date_needed = formjsDate(formatDME(Requisitions[i].date_needed));
			Requisitions[i].open_date = formjsDate(formatDME(Requisitions[i].open_date));			
		}
		Requisitions.sort(sortByDateNeeded);
		HrSuper = Requisitions;
		Draw();		
	}
}

