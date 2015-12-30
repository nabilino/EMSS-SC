// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/dr.js,v 1.3.2.3 2011/01/25 09:44:07 juanms Exp $
var DirectReports = new Array();

function DirectReportsObject()
{
	this.Code = null;
	this.FullName = null;
	this.LastName = null;
	this.BirthDate = null;
	this.DateHired = null;
	this.AdjHireDate = null;
	this.NextReview = null;
	this.WorkDesc = null;
	this.WorkCountry = null;
	this.JobWebType = null;
	this.HsuCode = null;
	this.DirectReports = null;
}

function Call_HS10(company, employee, redirect)
{
	var program
	if (typeof(program) == "undefined" || program == null)
		program = "HS10.1";

	var programSafeStr = program.split(".").join("_");
	self.lawheader.DetailLine = 0;
	self.lawheader.UpdateType = programSafeStr;

	var pAgsObj   	  = new AGSObject(authUser.prodline, "HS10.1")
	pAgsObj.event     = "ADD"
	pAgsObj.rtn       = "DATA"
	pAgsObj.longNames = true
	pAgsObj.tds       = false
	pAgsObj.field     = "FC=I"
					  + "&HSU-COMPANY=" +escape(parseInt(company, 10),1)
					  + "&HSU-EMPLOYEE=" +escape(parseInt(employee, 10),1)

	if (arguments.length>3 && arguments[3])
  	{
  	  	pAgsObj.field += "&PT-FC=" + DirectReports.PtFc;
  	  	pAgsObj.field += "&PT-PTF-EMPLOYEE=" + DirectReports.LastEmployee;

	  	if (NonSpace(DirectReports.LastHsuCode))
			pAgsObj.field += "&PT-HSU-CODE=" + escape(DirectReports.LastHsuCode)
	  	if (NonSpace(DirectReports.LastHsuOpCode))
			pAgsObj.field += "&PT-HSU-OP-CODE=" + escape(DirectReports.LastHsuOpCode)
  	}

	pAgsObj.out       = "JAVASCRIPT"
	pAgsObj.debug     = false

	pAgsObj.func = "parent.RecallHS10('"+programSafeStr+"',"+parseInt(company,10)+","+parseInt(employee,10)+",'"+redirect+"')" 

	AGS(pAgsObj, "jsreturn")
}

function RecallHS10(programSafeStr, company, employee, redirect)
{
	if(self.lawheader.myMsg.toUpperCase().indexOf("MORE RECORDS EXIST") != -1 && self.lawheader.PTFIELDS)
	{
		Call_HS10(company, employee, redirect, true)
	}
	else
	{
		func = "Do_"+programSafeStr+"_Call_"
		func += (typeof(redirect) != "undefined" && redirect != null)?redirect+"_Finished()":"Finished()";
		eval(func)
	}
}
