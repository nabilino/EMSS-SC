// Version: 8-)@(#)@10.00.02.00.29
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/credentials/drp.js,v 1.11.2.12 2012/06/29 17:24:23 brentd Exp $
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
var DRPV;

function DirectReportsProfile(Company, Employee, Manager)
{
	if(typeof(DRPV)!="undefined" && DRPV.EmployeeCode == Employee)
	{
		DRPV.Manager = Manager;
		OpenDRPVWindow();
	}
	else
	{
		self.lawheader.UpdateType = "DRPV";
		DRPV=null;
		DRPV=new self.lawheader.DRPVObject();
		DRPV.Manager = Manager;
		// PT 103991 - add pagedown logic
		CallDRPV(Company, Employee, "I");
	}
}

// PT 103991 - add pagedown logic
function CallDRPV(company, employee, fc)
{
	self.lawheader.UpdateType = "DRPV";
	self.lawheader.lineIndex = 0;

	agsCall = new AGSObject(authUser.prodline,"HS15.1");
	agsCall.event		= "ADD";
	agsCall.rtn		= "DATA";
	agsCall.longNames	= true;
	agsCall.tds		= false;

	agsCall.field		= "FC="+fc
				+ "&COMPANY="+escape(company,1)
				+ "&HSU-EMPLOYEE="+escape(employee,1);
	if (fc == "%2B") {
		agsCall.field 	+= "&PT-HSU-CODE="+escape(DRPV.LastSupervisorCode,1)
				+ "&PT-EMPLOYEE="+escape(DRPV.LastReportEmployee,1)
				+ "&PT-LAST-NAME="+escape(DRPV.LastReportLastName,1)
				+ "&PT-FIRST-NAME="+escape(DRPV.LastReportFirstName,1)
				+ "&PT-MIDDLE-INIT="+escape(DRPV.LastReportMiddleInit,1);
	}

	DRPV.LastSupervisorCode 	= ' ';
	DRPV.LastReportEmployee		= ' ';
	DRPV.LastReportLastName		= ' ';
	DRPV.LastReportFirstName	= ' ';
	DRPV.LastReportMiddleInit	= ' ';

	agsCall.func		= "parent.ReturnAgsCallDRPV("+company+","+employee+")";
	agsCall.out		= "JAVASCRIPT";
	agsCall.debug		= false;

	AGS(agsCall,"jsreturn");
}

function ReturnAgsCallDRPV(company, employee)
{
	if(self.lawheader.gmsgnbr!="000")
	{
		seaAlert(self.lawheader.gmsg);
	}
	else
	{
		// PT 103991 - if page down record keys are filled in, perform a pagedown
		if ((NonSpace(DRPV.LastCompany) > 0) || (NonSpace(DRPV.LastSupervisorCode) > 0)
		|| (NonSpace(DRPV.LastReportEmployee) > 0) || (NonSpace(DRPV.LastSupervisor) > 0)
		|| (NonSpace(DRPV.LastReportLastName) > 0) || (NonSpace(DRPV.LastReportFirstName) > 0)
		|| (NonSpace(DRPV.LastReportMiddleInit) > 0))
		{
			CallDRPV(company, employee, "%2B");
		}
		else
		{
			OpenDRPVWindow();
		}
	}
}

function OpenDRPVWindow()
{
	DRPV.DRPVWindow = self;
	PaintDRPVWindow();
}

function PaintDRPVWindow(onsort, sortField)
{
	var strHtml = '<table id="reportsTbl" class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">'
	+ '<tr>'
	+ '<th class="plaintableheaderborder" style="text-align:center;width:10%">&nbsp;</th>'
	+ '<th class="plaintableheaderborder" style="text-align:center;width:27%" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	+ '<a class="columnsort" href="" onclick="parent.SortProfileReports(\'LabelName\');return false;"'
	+ ' onmouseover="window.status=\''+getSeaPhrase("SORT_BY_NAME","CR").replace(/\'/g,"\\'")+'\';return true"'
	+ ' onmouseout="window.status=\' \';return true">'+getSeaPhrase("CR_34","CR")+'</a></th>'
	+ '<th class="plaintableheaderborder" style="text-align:center;width:27%" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	+ '<a class="columnsort" href="" onclick="parent.SortProfileReports(\'JobDescription\');return false;"'
	+ ' onmouseover="window.status=\''+getSeaPhrase("SORT_BY_JOB","CR").replace(/\'/g,"\\'")+'\';return true"'
	+ ' onmouseout="window.status=\' \';return true">'+getSeaPhrase("JOB","CR")+'</a></th>'
	+ '<th class="plaintableheaderborder" style="text-align:center;width:18%">'+getSeaPhrase("CR_36","CR")+'</th>'
	+ '<th class="plaintableheaderborder" style="text-align:center;width:18%">'+getSeaPhrase("CR_37","CR")+'</th>'
	+ '</tr>'

	var pcompany = Pcompany(DRPV.Company);
	for (var i=0; i<DRPV.DirectReports.length; i++)
	{
		Photo = "/lawson/xhrnet/images/employees/P"+pcompany+Pemployee(DRPV.DirectReports[i].Employee)+".jpg";

		strHtml += '<tr>'
		+ '<td class="plaintablecellborder" style="text-align:center;width:10%" nowrap>'
		+ '<img name="photo'+i+'" src="'+Photo+'" onerror="this.src=\''+uiNoPhotoPath+'\'" alt="'+getSeaPhrase("PHOTO","CR")+'"></td>'
		+ '<td class="plaintablecellborderleft" style="width:27%" nowrap>'
		+ ((DRPV.DirectReports[i].LabelName && NonSpace(DRPV.DirectReports[i].LabelName)>0)?DRPV.DirectReports[i].LabelName:'&nbsp;')+'</td>'
		+ '<td class="plaintablecellborderleft" style="width:27%" nowrap>'
		+ ((DRPV.DirectReports[i].JobDescription && NonSpace(DRPV.DirectReports[i].JobDescription)>0)?DRPV.DirectReports[i].JobDescription:'&nbsp;')+'</td>'
		+ '<td class="plaintablecellborder" style="text-align:center;width:18%" nowrap>'
		+ '<a href="javascript:parent.LinkToCompetencyProfile('+i+')"'
		+ ' onmouseover="window.status=\''+getSeaPhrase("CR_38","CR").replace(/\'/g,"\\'")+'\';return true"'
		+ ' onmouseout="window.status=\'\';return true">'
		+ getSeaPhrase("VIEW","CR")+'</a></td>'
		+ '<td class="plaintablecellborder" style="text-align:center;width:18%" nowrap>';

		if (DRPV.DirectReports[i].WebType && NonSpace(DRPV.DirectReports[i].WebType)>0) {
			strHtml += '<a href="javascript:parent.LinkToProfessionalProfile('+i+')"'
			+ ' onmouseover="window.status=\''+getSeaPhrase("CR_39","CR").replace(/\'/g,"\\'")+'\';return true"'
			+ ' onmouseout="window.status=\'\';return true">'
			+ getSeaPhrase("VIEW","CR")+'</a>';
		}
		else {
			strHtml += '&nbsp;';
		}

		strHtml += '</td></tr>';
	}

	strHtml += '</table>';

	try {
		self.main.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DIRECT_REPORTS","CR");
		self.main.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}

	self.main.stylePage();

	if (!onsort) 
	{
		self.main.setLayerSizes();
		document.getElementById("main").style.visibility = "visible";
	} 
	else
	{
		self.main.styleSortArrow("reportsTbl", sortField);
	}

	// if this task has been refreshed following an update, remove any processing message
	if (typeof(removeWaitAlert) == "function")
		removeWaitAlert();
	fitToScreen();	
}

function sortByProperty(obj1, obj2)
{
	var name1 = obj1[sortProperty];
	var name2 = obj2[sortProperty];
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function SortProfileReports(property)
{
	sortProperty = property;
	DRPV.DirectReports.sort(sortByProperty);
	PaintDRPVWindow(true, property);
}

function LinkToCompetencyProfile(Index)
{
   	showWaitAlert(getSeaPhrase("GATHERING_INFO","CR"));
   	if (self.subtask.location.href.indexOf("ecpmain.htm")==-1) {
   		self.subtask.location.replace("/lawson/xhrnet/credentials/ecpmain.htm?employee="+DRPV.DirectReports[Index].Employee);
	}
	else {
		self.subtask.employeeNbr = DRPV.DirectReports[Index].Employee;
		self.subtask.Drive();
	}
	document.getElementById("header").style.visibility = "hidden";
	document.getElementById("main").style.visibility = "hidden";
	document.getElementById("subtask").style.visibility = "visible";
	fitToScreen();
}

function LinkToProfessionalProfile(Index)
{
   	showWaitAlert(getSeaPhrase("GATHERING_INFO","CR"));
   	if (self.subtask.location.href.indexOf("pp.htm")==-1) {
   		self.subtask.location.replace("/lawson/xhrnet/credentials/pp.htm?employee="+escape(DRPV.DirectReports[Index].Employee,1)+"&type="+escape(DRPV.DirectReports[Index].WebType,1));
	}
	else {
		self.subtask.employeeNbr = DRPV.DirectReports[Index].Employee;
		self.subtask.webType = DRPV.DirectReports[Index].WebType;
		self.subtask.Drive();
	}
	document.getElementById("header").style.visibility = "hidden";
	document.getElementById("main").style.visibility = "hidden";
	document.getElementById("subtask").style.visibility = "visible";
}

// PT 125247
function Pcompany(comp)
{
	var Pcomp = parseInt(comp,10).toString();
	for(var i=Pcomp.length; i<4; i++)
	   Pcomp = "0" + Pcomp;
	return Pcomp;
}

// PT 125247
function Pemployee(emp)
{
	var Pemp = parseInt(emp,10).toString();
 	for(var i=Pemp.length; i<9; i++)
		Pemp = "0" + Pemp;
	return Pemp;
}


