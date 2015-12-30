// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/credentials/pp.js,v 1.14.2.8 2011/05/06 06:51:46 juanms Exp $
var PPV;
var Photo;

/************************************************************************************
CALL THIS FUNCTION IF YOU WISH TO RERUN THIS PART OF THE PROGRAM. COMPANY AND EMPLOYEE
WILL COME FROM WHATEVER COMPANY AND EMPLOYEE ARE PRESENT WITHING AUTHENTICATE. THE MANAGER
BOOLEAN PARAMETER WILL BE TRUE IF THIS FROM A MANAGER PAGE. TYPE CAN ALSO BE PASSED IF YOU
ALREADY KNOW WHAT TYPE THIS EMPLOYEE IS.
************************************************************************************/
function ProfessionalProfile(Company, Employee, Manager, Type, NoImage)
{
	if (typeof(PPV)!="undefined" && PPV.EmployeeCode == Employee)
	{
		PPV.Manager = Manager;
		OpenPPVWindow();
	}
	else
	{
		self.lawheader.UpdateType = "PPV";
		PPV=null;
		PPV=new self.lawheader.PPVObject();
		PPV.Manager = Manager;

		if (typeof(NoImage)!="undefined")
		{
			if (NoImage) {
				PPV.ImageSrc = uiNoPhotoPath;
			}
		}

		agsCall = new AGSObject(authUser.prodline,"HS14.1");
			agsCall.event		= "ADD";
			agsCall.rtn		= "DATA";
			agsCall.longNames	= true;
			agsCall.tds		= false;
			agsCall.field		= "FC=I"
						+ "&COMPANY="+escape(Company)
						+ "&EMP-EMPLOYEE="+escape(Employee);
			if (Type) {
				agsCall.field	+= "&SEARCH-TYPE="+Type;
			}
			agsCall.func		= "parent.ReturnAgsCallPPV()";
			agsCall.out		= "JAVASCRIPT";
			agsCall.debug		= false;
		AGS(agsCall,"jsreturn");
	}
}

function ReturnAgsCallPPV()
{
	if (self.lawheader.gmsgnbr != "000") {
		removeWaitAlert();
		seaAlert(self.lawheader.gmsg);
	}
//	else if (PPV.WebSort.length == 0)
//	else if (NonSpace(PPV.SearchType) == 0)
//	{
//		removeWaitAlert();
//		seaAlert(getSeaPhrase("CR_11","CR"));
//	}
	else {
		OpenPPVWindow();
	}
}

function OpenPPVWindow()
{
	PPV.PPVWindow = self;

	if (PPV.SearchType == 1) {
		setTaskHeader("header",getSeaPhrase("CR_14","CR"),"Credentials");
		PaintPPPVWindow();
	}
	else if (PPV.SearchType == 2) {
		setTaskHeader("header",getSeaPhrase("CR_13","CR"),"Credentials");
		PaintNPPVWindow();
	}
	else {
		setTaskHeader("header",getSeaPhrase("CR_37","CR"),"Credentials");
		PaintNoInfoWindow();
	}
}

function MaskSocialNbr(socialNbr)
{
	return socialNbr.substring(socialNbr.length-4,socialNbr.length);
}

function PaintPersonalInformation()
{
	if (typeof(PPV.ImageSrc)!="undefined") {
		Photo = uiNoPhotoPath;
	} else {
		// PT 167220
		Photo = "/lawson/xhrnet/images/employees/P" + Pcompany(PPV.Company) + Pemployee(PPV.EmployeeCode) + ".jpg";
	}

	var strHtml = '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;height:100%">'
	+ '<tr>'
	+ '<td class="plaintablerowheader" style="width:18%">'+getSeaPhrase("CR_34","CR")+'</td>'
	+ '<td class="plaintablecellborderdisplay" style="border-bottom:0px;width:45%" nowrap>'+((PPV.EmployeeName && NonSpace(PPV.EmployeeName)>0)?PPV.EmployeeName:'&nbsp;')+'</td>'
	+ '<td class="plaintablerowheader" style="width:18%">'+getSeaPhrase("SOCIAL_NUMBER","CR")+'</td>'
	+ '<td class="plaintablecelldisplay" style="width:19%" nowrap>'+((PPV.FicaNbr && NonSpace(PPV.FicaNbr)>0)?MaskSocialNbr(PPV.FicaNbr):'&nbsp;')+'</td>'
	+ '<td class="plaintablecelldisplay" style="text-align:center;vertical-align:middle;width:19%" rowspan="6" nowrap>'
	+ '<img name="photo1" src="'+Photo+'" onerror="this.src=\''+uiNoPhotoPath+'\'" alt="'+getSeaPhrase("PHOTO","CR")+'">'
	+ '</td>'	
	+ '</tr>'
	+ '<tr>'
	+ '<td class="plaintablerowheader" style="width:18%">'+getSeaPhrase("ADDRESS","CR")+'</td>'
	+ '<td class="plaintablecellborderdisplay" style="border-bottom:0px;width:45%" nowrap>'+((PPV.Address && NonSpace(PPV.Address)>0)?PPV.Address:'&nbsp;')+'</td>'
	+ '<td class="plaintablerowheader" style="width:18%">'+getSeaPhrase("BIRTHDATE","CR")+'</td>'
	+ '<td class="plaintablecelldisplay" style="width:19%" nowrap>'+((PPV.BirthDate && NonSpace(PPV.BirthDate)>0)?FormatDte4(PPV.BirthDate):'&nbsp;')+'</td>'
	+ '</tr>'
	+ '<tr>'
	+ '<td class="plaintablerowheader" style="width:18%">'+getSeaPhrase("CITY","CR")+'</td>'
	+ '<td class="plaintablecellborderdisplay" style="border-bottom:0px;width:45%" nowrap>'+((PPV.City && NonSpace(PPV.City)>0)?PPV.City:'&nbsp;')+'</td>'
	+ '<td class="plaintablerowheader" style="width:18%">'+getSeaPhrase("BIRTHPLACE","CR")+'</td>'
	+ '<td class="plaintablecelldisplay" style="width:19%" nowrap>';

	if ((PPV.BirthCity && NonSpace(PPV.BirthCity)>0) || (PPV.BirthState && NonSpace(PPV.BirthState)>0)) {
		if (PPV.BirthCity && NonSpace(PPV.BirthCity)>0) {
			strHtml += PPV.BirthCity;
			if (PPV.BirthState && NonSpace(PPV.BirthState)>0) {
				strHtml += ', ';
			}
		}
		if (PPV.BirthState && NonSpace(PPV.BirthState)>0) {
			strHtml += PPV.BirthState;
		}
	}
	else {
		strHtml += '&nbsp;';
	}

	strHtml += '</td></tr>'
	+ '<tr>'
	+ '<td class="plaintablerowheader" style="width:18%">'+getSeaPhrase("STATE","CR")+'</td>'
	+ '<td class="plaintablecellborderdisplay" style="border-bottom:0px;width:45%" nowrap>'+((PPV.State && NonSpace(PPV.State)>0)?PPV.State:'&nbsp;')+'</td>'
	+ '<td class="plaintablerowheader" style="width:18%">&nbsp;</td>'
	+ '<td class="plaintablecelldisplay" style="width:18%">&nbsp;</td>'
	+ '</tr>'
	+ '<tr>'
	+ '<td class="plaintablerowheader" style="width:18%">'+getSeaPhrase("POSTAL_CODE","CR")+'</td>'
	+ '<td class="plaintablecellborderdisplay" style="border-bottom:0px;width:45%" nowrap>'+((PPV.Zip && NonSpace(PPV.Zip)>0)?PPV.Zip:'&nbsp;')+'</td>'
	+ '<td class="plaintablerowheader" style="width:18%">&nbsp;</td>'
	+ '<td class="plaintablecelldisplay" style="width:18%">&nbsp;</td>'
	+ '</tr>'
	+ '<tr>'
	+ '<td class="plaintablerowheader" style="width:18%">&nbsp;</td>'
	+ '<td class="plaintablecellborderdisplay" style="border-bottom:0px;width:45%" nowrap>&nbsp;</td>'
	+ '<td class="plaintablerowheader" style="width:18%">&nbsp;</td>'
	+ '<td class="plaintablecelldisplay" style="width:18%">&nbsp;</td>'
	+ '</tr>';
	+ '</table>'

	try {
		self.personal.document.getElementById("paneHeader").innerHTML = getSeaPhrase("PERSONAL_INFO","CR");
		self.personal.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}

	self.personal.stylePage();
	self.personal.setLayerSizes();
	document.getElementById("personal").style.visibility = "visible";
}

function PaintNoInfoWindow()
{
	PaintPersonalInformation();
	PaintNoInfoWindowContent();
	PaintManagerReportSelect();

	// if this task has been refreshed following an update, remove any processing message
	if (typeof(removeWaitAlert) == "function")
		removeWaitAlert();
	// if this task has been launched as a related link, remove any processing message
	if (fromTask && typeof(parent.removeWaitAlert) == "function")
		parent.removeWaitAlert();
}

function PaintNoInfoWindowContent()
{
	var strHtml = '<div class="plaintablecellborderdisplay" style="text-align:left">'+getSeaPhrase("CR_11","CR")+'</div>';

	try {
		self.credentials.document.getElementById("paneHeader").innerHTML = getSeaPhrase("CREDENTIALS","CR");
		self.credentials.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}

	self.credentials.stylePage();
	self.credentials.setLayerSizes(true);
	
	if (document.getElementById("credentials").style.height.toString().replace("px","") > 351) {
		document.getElementById("credentials").style.height = "351px";
	}
	document.getElementById("credentials").style.visibility = "visible";
}

function PaintManagerReportSelect()
{
	if (fromTask && PPV.Manager) {

		var tmpStr = '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
		+ '<tr>'

		try {
			// Only display the select box if there is more than one employee available for selection
			var i = 0;
			var ppCnt = 0;
			var Reports = parent.DRPV.DirectReports;

			while (i<Reports.length && ppCnt<2) {
				if (Reports[i].WebType && NonSpace(Reports[i].WebType)>0) {
					ppCnt++;
				}
				i++;
			}

			if (ppCnt > 1) {
				tmpStr += '<td class="plaintableheadertallwhite" style="text-align:right" nowrap>'
				+ getSeaPhrase("SELECT_EMPLOYEE","CR")+'</td>'
				+ '<td class="plaintablecell" style="text-align:right;width:10px" nowrap>'
				+ BuildReportSelect(employeeNbr)
				+ '</td>'
			}
			tmpStr += '<td class="plaintablecell" style="text-align:right;width:10px;padding-right:0px" nowrap>'
			+ uiButton(getSeaPhrase("BACK","CR"),"CloseProfessionalProfile();return false","margin-right:0px");
			+ '</td>'
		}
		catch(e) {
			tmpStr += '<td class="plaintablecell" style="text-align:right;width:100%;padding-right:0px" nowrap>'
			+ uiButton(getSeaPhrase("BACK","CR"),"CloseProfessionalProfile();return false","margin-right:0px");
			+ '</td>'
		}

		tmpStr += '</tr>'
		+ '</table>'
		document.getElementById("navarea").innerHTML = tmpStr;
		stylePage();
		document.getElementById("navarea").style.visibility = "visible";
	}
}

function BuildReportSelect(empNbr)
{
	var tmpHtml = "";

	try {
		var Reports = parent.DRPV.DirectReports;

		tmpHtml = '<select class="inputbox" name="reports" id="reports" ';
		tmpHtml += 'onchange="RefreshProfProfile(this.options[this.selectedIndex].value)">';

		for (var i=0; i<Reports.length; i++) {
			if (Reports[i].WebType && NonSpace(Reports[i].WebType)>0) {

				tmpHtml += '<option value="'+i+'"';
				tmpHtml += (empNbr==Reports[i].Employee)?' selected>':'>';
				tmpHtml += Reports[i].LabelName;
			}
		}

		tmpHtml += '</select>'
	}
	catch(e) {}

	return tmpHtml;
}

function RefreshProfProfile(empIndex)
{
	empIndex = Number(empIndex);
	try {
		employeeNbr = parent.DRPV.DirectReports[empIndex].Employee;
		webType = parent.DRPV.DirectReports[empIndex].WebType;
	}
	catch(e) { webType = false; }
	showWaitAlert(getSeaPhrase("WAIT","ESS"));
	ProfessionalProfile(authUser.company, employeeNbr, true, webType);
}

function CloseProfessionalProfile()
{
	try {
		document.getElementById("navarea").style.visibility = "hidden";
		parent.document.getElementById("subtask").style.visibility = "hidden";
		parent.document.getElementById("header").style.visibility = "visible";
		parent.document.getElementById("main").style.visibility = "visible";
		parent.subtask.location.replace("/lawson/xhrnet/dot.htm");
	}
	catch(e) {}
}

/************************************************************************************
PAINTS NURSE PROFILE WINDOW
************************************************************************************/
function PaintNPPVWindow()
{
	PaintPersonalInformation();
	PaintNPPVWindowContent();
	PaintManagerReportSelect();

	// if this task has been refreshed following an update, remove any processing message
	if (typeof(removeWaitAlert) == "function")
		removeWaitAlert();
	// if this task has been launched as a related link, remove any processing message
	if (fromTask && typeof(parent.removeWaitAlert) == "function")
		parent.removeWaitAlert();
}

function PaintNPPVWindowContent()
{
	// Education table
	var strHtml = '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
	+ '<tr>'
	+ '<td class="plaintableheaderbordergrey" style="width:100%" colspan="3">'+getSeaPhrase("EDUCATION","CR")+'</td>'
	+ '</tr>'
	+ '</table>'
	
	if (typeof(PPV.WebSort[1]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">' 
		+ '<tr>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:33%">'+getSeaPhrase("INSTITUTION","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:33%">'+getSeaPhrase("COMPLETED","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:33%">'+getSeaPhrase("DEGREE","CR")+'</th>'
		+ '</tr>'

		for (var i=0; i<PPV.WebSort[1].ProfileRecords.length; i++)
		{
			strHtml += '<tr>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'
			+ ((PPV.WebSort[1].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[1].ProfileRecords[i].Desc1)>0)?PPV.WebSort[1].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'
			+ ((PPV.WebSort[1].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[1].ProfileRecords[i].Date1)>0)?FormatDte4(PPV.WebSort[1].ProfileRecords[i].Date1):'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'
			+ ((PPV.WebSort[1].ProfileRecords[i].Desc2 && NonSpace(PPV.WebSort[1].ProfileRecords[i].Desc2)>0)?PPV.WebSort[1].ProfileRecords[i].Desc2:'&nbsp;')+'</td>'
			+ '</tr>'
		}
	}
	else {
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
		+ '<tr>'
		+ '<td class="plaintablecellborder" style="width:100%" colspan="3">'+getSeaPhrase("CR_11","CR")+'</td>'
		+ '</tr>'
	}

	strHtml += '</table>'

	// Licenses table
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
	+ '<tr>'
	+ '<td class="plaintableheaderbordergrey" style="width:100%" colspan="3">'+getSeaPhrase("LICENSES","CR")+'</td>'
	+ '</tr>'
	+ '</table>'

	if (typeof(PPV.WebSort[2]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">' 
		+ '<tr>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:33%">'+getSeaPhrase("STATE","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:33%">'+getSeaPhrase("LICENSE_NBR","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:33%">'+getSeaPhrase("ISSUED","CR")+'</th>'
		+ '</tr>'

		for (var i=0; i<PPV.WebSort[2].ProfileRecords.length; i++)
		{
			strHtml += '<tr>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'
			+ ((PPV.WebSort[2].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[2].ProfileRecords[i].Desc1)>0)?PPV.WebSort[2].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'
			+ ((PPV.WebSort[2].ProfileRecords[i].Desc2 && NonSpace(PPV.WebSort[2].ProfileRecords[i].Desc2)>0)?PPV.WebSort[2].ProfileRecords[i].Desc2:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'
			+ ((PPV.WebSort[2].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[2].ProfileRecords[i].Date1)>0)?FormatDte4(PPV.WebSort[2].ProfileRecords[i].Date1):'&nbsp;')+'</td>'
			+ '</tr>'
		}
	}
	else {
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
		+ '<tr>'
		+ '<td class="plaintablecellborder" style="width:100%" colspan="3">'+getSeaPhrase("CR_11","CR")+'</td>'
		+ '</tr>'
	}

	strHtml += '</table>'

	// ANCC table
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
	+ '<tr>'
	+ '<td class="plaintableheaderbordergrey" style="width:100%" colspan="3">'+getSeaPhrase("CR_15","CR")+'</td>'
	+ '</tr>'
	+ '</table>'

	if (typeof(PPV.WebSort[3]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">' 
		+ '<tr>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:33%">'+getSeaPhrase("CREDENTIALS","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:33%">'+getSeaPhrase("EFFECTIVE","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:33%">'+getSeaPhrase("EXPIRES","CR")+'</th>'
		+ '</tr>'

		for (var i=0; i<PPV.WebSort[3].ProfileRecords.length; i++)
		{
			strHtml += '<tr>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'
			+ ((PPV.WebSort[3].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[3].ProfileRecords[i].Desc1)>0)?PPV.WebSort[3].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'
			+ ((PPV.WebSort[3].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[3].ProfileRecords[i].Date1)>0)?FormatDte4(PPV.WebSort[3].ProfileRecords[i].Date1):'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>'
			+ ((PPV.WebSort[3].ProfileRecords[i].Date2 && NonSpace(PPV.WebSort[3].ProfileRecords[i].Date2)>0)?FormatDte4(PPV.WebSort[3].ProfileRecords[i].Date2):'&nbsp;')+'</td>'
			+ '</tr>'
		}
	}
	else {
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
		+ '<tr>'
		+ '<td class="plaintablecellborder" style="width:100%" colspan="3">'+getSeaPhrase("CR_11","CR")+'</td>'
		+ '</tr>'
	}

	strHtml += '</table>'

	// Practice Areas table
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
	+ '<tr>'
	+ '<td class="plaintableheaderbordergrey" style="width:100%" colspan="3">'+getSeaPhrase("CR_16","CR")+'</td>'
	+ '</tr>'
	+ '</table>'

	if (typeof(PPV.WebSort[4]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">' 
		+ '<tr>'
		+ '<th colspan="3">&nbsp;</th>'
		+ '</tr>'

		for (var i=0; i<PPV.WebSort[4].ProfileRecords.length; i++)
		{
			strHtml += '<tr>'
			+ '<td class="plaintablecellborder" style="border-right:0px;text-align:center;width:33%" nowrap>'
			+ ((PPV.WebSort[4].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[4].ProfileRecords[i].Desc1)>0)?PPV.WebSort[4].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="border-right:0px;text-align:center;width:33%" nowrap>&nbsp;</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:33%" nowrap>&nbsp;</td>'
			+ '</tr>'
		}
	}
	else {
		strHtml += '<tr>'
		+ '<td class="plaintablecellborder" style="width:100%" colspan="3">'+getSeaPhrase("CR_11","CR")+'</td>'
		+ '</tr>'
	}

	strHtml += '</table>'

	try {
		self.credentials.document.getElementById("paneHeader").innerHTML = getSeaPhrase("CREDENTIALS","CR");
		self.credentials.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}

	self.credentials.stylePage();
	self.credentials.setLayerSizes(true);
	
	if (document.getElementById("credentials").style.height.toString().replace("px","") > 351) {
		document.getElementById("credentials").style.height = "351px";
	}
	document.getElementById("credentials").style.visibility = "visible";
}

/************************************************************************************
PAINTS PHYSICIAN PROFESSIONAL PROFILE
************************************************************************************/
function PaintPPPVWindow()
{
	PaintPersonalInformation();
	PaintPPPVWindowContent();
	PaintManagerReportSelect();

	// if this task has been refreshed following an update, remove any processing message
	if (typeof(removeWaitAlert) == "function")
		removeWaitAlert();
	// if this task has been launched as a related link, remove any processing message
	if (fromTask && typeof(parent.removeWaitAlert) == "function")
		parent.removeWaitAlert();
}

function PaintPPPVWindowContent()
{
	// Education and NBME tables
	var strHtml = '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
	+ '<tr>'
	+ '<th class="plaintableheaderbordergrey" id="edu" style="width:63%;text-align:left;" colspan="3">'+getSeaPhrase("EDUCATION","CR")+'</th>'
	+ '<th class="plaintableheaderbordergrey" id="NBME" style="width:37%;text-align:left;">'+getSeaPhrase("CR_19","CR")+'</th>'
	+ '</tr>'
	+ '</table>'

	if (typeof(PPV.WebSort[1]) != "undefined" && typeof(PPV.WebSort[2]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">' 
		+ '<tr>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:26%">'+getSeaPhrase("INSTITUTION","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:15%">'+getSeaPhrase("COMPLETED","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:22%">&nbsp;</th>'
		+ '<th class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'

		if (PPV.WebSort[2].ProfileRecords.length > 0) {
			strHtml += ((PPV.WebSort[2].ProfileRecords[0].Desc1 && NonSpace(PPV.WebSort[2].ProfileRecords[0].Desc1)>0)?PPV.WebSort[2].ProfileRecords[0].Desc1:'&nbsp;')+'</td>'
		}
		else {
			strHtml += '&nbsp;</th>'
		}

		strHtml += '</tr>'

		if (PPV.WebSort[1].ProfileRecords.length >= PPV.WebSort[2].ProfileRecords.length-1) {
			// Second table is shorter or equal to the first table
			for (var k=0; k<PPV.WebSort[1].ProfileRecords.length; k++) {
				strHtml += '<tr>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
				+ ((PPV.WebSort[1].ProfileRecords[k].Desc1 && NonSpace(PPV.WebSort[1].ProfileRecords[k].Desc1)>0)?PPV.WebSort[1].ProfileRecords[k].Desc1:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
				+ ((PPV.WebSort[1].ProfileRecords[k].Date1 && NonSpace(PPV.WebSort[1].ProfileRecords[k].Date1)>0)?FormatDte4(PPV.WebSort[1].ProfileRecords[k].Date1):'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>&nbsp;</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				if (k+1 < PPV.WebSort[2].ProfileRecords.length) {
					strHtml += ((PPV.WebSort[2].ProfileRecords[k+1].Desc1 && NonSpace(PPV.WebSort[2].ProfileRecords[k].Desc1)>0)?PPV.WebSort[2].ProfileRecords[k+1].Desc1:'&nbsp;')+'</td>'
				}
				else {
					strHtml += '&nbsp;</td>'
				}
				strHtml += '</tr>'
			}
		}
		else {
			// First table is shorter than second table
			for (var k=1; k<PPV.WebSort[2].ProfileRecords.length; k++) {
				strHtml += '<tr>'
				if (k-1 < PPV.WebSort[1].ProfileRecords.length) {
					strHtml += '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
					+ ((PPV.WebSort[1].ProfileRecords[k-1].Desc1 && NonSpace(PPV.WebSort[1].ProfileRecords[k-1].Desc1)>0)?PPV.WebSort[1].ProfileRecords[k-1].Desc1:'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
					+ ((PPV.WebSort[1].ProfileRecords[k-1].Date1 && NonSpace(PPV.WebSort[1].ProfileRecords[k-1].Date1)>0)?FormatDte4(PPV.WebSort[1].ProfileRecords[k-1].Date1):'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>&nbsp;</td>'
				}
				else {
					strHtml += '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>&nbsp;</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>&nbsp;</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>&nbsp;</td>'

				}
				strHtml += '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				+ ((PPV.WebSort[2].ProfileRecords[k].Desc1 && NonSpace(PPV.WebSort[2].ProfileRecords[k].Desc1)>0)?PPV.WebSort[2].ProfileRecords[k].Desc1:'&nbsp;')+'</td>'
				+ '</tr>'
			}
		}
	}
	else if (typeof(PPV.WebSort[1]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">' 
		+ '<tr>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:26%">'+getSeaPhrase("INSTITUTION","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:15%">'+getSeaPhrase("COMPLETED","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:22%">&nbsp;</th>'
		+ '<th class="plaintablecellborder" style="width:37%">'+getSeaPhrase("CR_11","CR")+'</th>'
		+ '</tr>'

		for (var i=0; i<PPV.WebSort[1].ProfileRecords.length; i++)
		{
			strHtml += '<tr>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
			+ ((PPV.WebSort[1].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[1].ProfileRecords[i].Desc1)>0)?PPV.WebSort[1].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
			+ ((PPV.WebSort[1].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[1].ProfileRecords[i].Date1)>0)?FormatDte4(PPV.WebSort[1].ProfileRecords[i].Date1):'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>&nbsp;</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>&nbsp;</td>'
			+ '</tr>'
		}
	}
	else if (typeof(PPV.WebSort[2]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
		+ '<tr>'
		+ '<th class="plaintablecellborder" style="width:63%" colspan="3">'+getSeaPhrase("CR_11","CR")+'</th>'

		if (PPV.WebSort[2].ProfileRecords.length > 0) {

			strHtml += '<th class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
			+ ((PPV.WebSort[2].ProfileRecords[0].Desc1 && NonSpace(PPV.WebSort[2].ProfileRecords[0].Desc1)>0)?PPV.WebSort[2].ProfileRecords[0].Desc1:'&nbsp;')+'</th>'
			+ '</tr>'

			for (var i=1; i<PPV.WebSort[2].ProfileRecords.length; i++)
			{
				strHtml += '<tr>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:63%" colspan="3" nowrap>&nbsp;</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				+ ((PPV.WebSort[2].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[2].ProfileRecords[i].Desc1)>0)?PPV.WebSort[2].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
				+ '</tr>'
			}
		}
	}
	else {
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
		+ '<tr>'
		+ '<td class="plaintablecellborder" headers="edu" style="width:63%" colspan="3">'+getSeaPhrase("CR_11","CR")+'</td>'
		+ '<td class="plaintablecellborder" headers="NBME" style="width:37%">'+getSeaPhrase("CR_11","CR")+'</td>'
		+ '</tr>'
	}

	strHtml += '</table>'

	// ACGME and ECFMG tables	
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
	+ '<tr>'
	+ '<th class="plaintableheaderbordergrey" id="ACGME" style="width:63%;text-align:left;" colspan="3">'+getSeaPhrase("CR_17","CR")+'</th>'
	+ '<th class="plaintableheaderbordergrey" id="ECFMG" style="width:37%;text-align:left;">'+getSeaPhrase("CR_20","CR")+'</th>'
	+ '</tr>'
	+ '</table>'

	if (typeof(PPV.WebSort[3]) != "undefined" && typeof(PPV.WebSort[4]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">' 
		+ '<tr>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:26%">'+getSeaPhrase("ACGME_RESIDENCY","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:15%">'+getSeaPhrase("DATES","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:22%">&nbsp;</th>'
		+ '<th class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'

		if (PPV.WebSort[4].ProfileRecords.length > 0) {
			strHtml += ((PPV.WebSort[4].ProfileRecords[0].Desc1 && NonSpace(PPV.WebSort[4].ProfileRecords[0].Desc1)>0)?PPV.WebSort[4].ProfileRecords[0].Desc1:'&nbsp;')+'</th>'
		}
		else {
			strHtml += '&nbsp;</th>'
		}

		strHtml += '</tr>'

		if (PPV.WebSort[3].ProfileRecords.length >= PPV.WebSort[4].ProfileRecords.length-1) {
			// Second table is shorter or equal to the first table
			for (var k=0; k<PPV.WebSort[3].ProfileRecords.length; k++) {
				strHtml += '<tr>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
				+ ((PPV.WebSort[3].ProfileRecords[k].Desc1 && NonSpace(PPV.WebSort[3].ProfileRecords[k].Desc1)>0)?PPV.WebSort[3].ProfileRecords[k].Desc1:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
				+ ((PPV.WebSort[3].ProfileRecords[k].Desc2 && NonSpace(PPV.WebSort[3].ProfileRecords[k].Desc2)>0)?PPV.WebSort[3].ProfileRecords[k].Desc2:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>&nbsp;</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				if (k+1 < PPV.WebSort[4].ProfileRecords.length) {
					strHtml += ((PPV.WebSort[4].ProfileRecords[k+1].Desc1 && NonSpace(PPV.WebSort[4].ProfileRecords[k].Desc1)>0)?PPV.WebSort[4].ProfileRecords[k+1].Desc1:'&nbsp;')+'</td>'
				}
				else {
					strHtml += '&nbsp;</td>'
				}
				strHtml += '</tr>'
			}
		}
		else {
			// First table is shorter than second table
			for (var k=1; k<PPV.WebSort[4].ProfileRecords.length; k++) {
				strHtml += '<tr>'
				if (k-1 < PPV.WebSort[3].ProfileRecords.length) {
					strHtml += '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
					+ ((PPV.WebSort[3].ProfileRecords[k-1].Desc1 && NonSpace(PPV.WebSort[3].ProfileRecords[k-1].Desc1)>0)?PPV.WebSort[3].ProfileRecords[k-1].Desc1:'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
					+ ((PPV.WebSort[3].ProfileRecords[k-1].Desc2 && NonSpace(PPV.WebSort[3].ProfileRecords[k-1].Desc2)>0)?PPV.WebSort[3].ProfileRecords[k-1].Desc2:'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>&nbsp;</td>'
				}
				else {
					strHtml += '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>&nbsp;</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>&nbsp;</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>&nbsp;</td>'

				}
				strHtml += '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				+ ((PPV.WebSort[4].ProfileRecords[k].Desc1 && NonSpace(PPV.WebSort[4].ProfileRecords[k].Desc1)>0)?PPV.WebSort[4].ProfileRecords[k].Desc1:'&nbsp;')+'</td>'
				+ '</tr>'
			}
		}
	}
	else if (typeof(PPV.WebSort[3]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">' 
		+ '<tr>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:26%">'+getSeaPhrase("ACGME_RESIDENCY","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:15%">'+getSeaPhrase("DATES","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:22%">&nbsp;</th>'
		+ '<th class="plaintablecellborder" style="width:37%">'+getSeaPhrase("CR_11","CR")+'</th>'
		+ '</tr>'

		for (var i=0; i<PPV.WebSort[3].ProfileRecords.length; i++)
		{
			strHtml += '<tr>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
			+ ((PPV.WebSort[3].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[3].ProfileRecords[i].Desc1)>0)?PPV.WebSort[3].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
			+ ((PPV.WebSort[3].ProfileRecords[i].Desc2 && NonSpace(PPV.WebSort[3].ProfileRecords[i].Desc2)>0)?PPV.WebSort[3].ProfileRecords[i].Desc2:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>&nbsp;</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>&nbsp;</td>'
			+ '</tr>'
		}
	}
	else if (typeof(PPV.WebSort[4]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
		+ '<tr>'
		+ '<th class="plaintablecellborder" style="width:63%" colspan="3">'+getSeaPhrase("CR_11","CR")+'</th>'

		if (PPV.WebSort[4].ProfileRecords.length > 0) {

			strHtml += '<th class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
			+ ((PPV.WebSort[4].ProfileRecords[0].Desc1 && NonSpace(PPV.WebSort[4].ProfileRecords[0].Desc1)>0)?PPV.WebSort[4].ProfileRecords[0].Desc1:'&nbsp;')+'</th>'
			+ '</tr>'

			for (var i=1; i<PPV.WebSort[4].ProfileRecords.length; i++)
			{
				strHtml += '<tr>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:63%" colspan="3" nowrap>&nbsp;</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				+ ((PPV.WebSort[4].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[4].ProfileRecords[i].Desc1)>0)?PPV.WebSort[4].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
				+ '</tr>'
			}
		}
	}
	else {
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
		+ '<tr>'
		+ '<td class="plaintablecellborder" headers="ACGME" style="width:63%" colspan="3">'+getSeaPhrase("CR_11","CR")+'</td>'
		+ '<td class="plaintablecellborder" headers="ECFMG" style="width:37%">'+getSeaPhrase("CR_11","CR")+'</td>'
		+ '</tr>'
	}

	strHtml += '</table>'

	// Licenses and AOA tables
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
	+ '<tr>'
	+ '<th class="plaintableheaderbordergrey" id="licenses" style="width:63%;text-align:left;" colspan="3">'+getSeaPhrase("LICENSES","CR")+'</th>'
	+ '<th class="plaintableheaderbordergrey" id="AOA" style="width:37%;text-align:left;">'+getSeaPhrase("CR_21","CR")+'</th>'
	+ '</tr>'
	+ '</table>'

	if (typeof(PPV.WebSort[5]) != "undefined" && typeof(PPV.WebSort[6]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">' 
		+ '<tr>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:26%">'+getSeaPhrase("STATE_NUMBER","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:15%">'+getSeaPhrase("ISSUED","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:22%">'+getSeaPhrase("EXPIRES","CR")+'</th>'
		+ '<th class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'

		if (PPV.WebSort[6].ProfileRecords.length > 0) {
			strHtml += ((PPV.WebSort[6].ProfileRecords[0].Desc1 && NonSpace(PPV.WebSort[6].ProfileRecords[0].Desc1)>0)?PPV.WebSort[6].ProfileRecords[0].Desc1:'&nbsp;')+'</th>'
		}
		else {
			strHtml += '&nbsp;</th>'
		}

		strHtml += '</tr>'

		if (PPV.WebSort[5].ProfileRecords.length >= PPV.WebSort[6].ProfileRecords.length-1) {
			// Second table is shorter or equal to the first table
			for (var k=0; k<PPV.WebSort[5].ProfileRecords.length; k++) {
				strHtml += '<tr>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
				+ ((PPV.WebSort[5].ProfileRecords[k].Desc1 && NonSpace(PPV.WebSort[5].ProfileRecords[k].Desc1)>0)?PPV.WebSort[5].ProfileRecords[k].Desc1:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
				+ ((PPV.WebSort[5].ProfileRecords[k].Date1 && NonSpace(PPV.WebSort[5].ProfileRecords[k].Date1)>0)?FormatDte4(PPV.WebSort[5].ProfileRecords[k].Date1):'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>'
				+ ((PPV.WebSort[5].ProfileRecords[k].Date2 && NonSpace(PPV.WebSort[5].ProfileRecords[k].Date2)>0)?FormatDte4(PPV.WebSort[5].ProfileRecords[k].Date2):'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				if (k+1 < PPV.WebSort[6].ProfileRecords.length) {
					strHtml += ((PPV.WebSort[6].ProfileRecords[k+1].Desc1 && NonSpace(PPV.WebSort[6].ProfileRecords[k].Desc1)>0)?PPV.WebSort[6].ProfileRecords[k+1].Desc1:'&nbsp;')+'</td>'
				}
				else {
					strHtml += '&nbsp;</td>'
				}
				strHtml += '</tr>'
			}
		}
		else {
			// First table is shorter than second table
			for (var k=1; k<PPV.WebSort[6].ProfileRecords.length; k++) {
				strHtml += '<tr>'
				if (k-1 < PPV.WebSort[5].ProfileRecords.length) {
					strHtml += '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
					+ ((PPV.WebSort[5].ProfileRecords[k-1].Desc1 && NonSpace(PPV.WebSort[5].ProfileRecords[k-1].Desc1)>0)?PPV.WebSort[5].ProfileRecords[k-1].Desc1:'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
					+ ((PPV.WebSort[5].ProfileRecords[k-1].Date1 && NonSpace(PPV.WebSort[5].ProfileRecords[k-1].Date1)>0)?FormatDte4(PPV.WebSort[5].ProfileRecords[k-1].Date1):'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>'
					+ ((PPV.WebSort[5].ProfileRecords[k-1].Date2 && NonSpace(PPV.WebSort[5].ProfileRecords[k-1].Date2)>0)?FormatDte4(PPV.WebSort[5].ProfileRecords[k-1].Date2):'&nbsp;')+'</td>'
				}
				else {
					strHtml += '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>&nbsp;</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>&nbsp;</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>&nbsp;</td>'

				}
				strHtml += '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				+ ((PPV.WebSort[6].ProfileRecords[k].Desc1 && NonSpace(PPV.WebSort[6].ProfileRecords[k].Desc1)>0)?PPV.WebSort[6].ProfileRecords[k].Desc1:'&nbsp;')+'</td>'
				+ '</tr>'
			}
		}
	}
	else if (typeof(PPV.WebSort[5]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">' 
		+ '<tr>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:26%">'+getSeaPhrase("STATE_NUMBER","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:15%">'+getSeaPhrase("ISSUED","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:22%">'+getSeaPhrase("EXPIRES","CR")+'</th>'
		+ '<th class="plaintablecellborder" style="width:37%">'+getSeaPhrase("CR_11","CR")+'</th>'
		+ '</tr>'

		for (var i=0; i<PPV.WebSort[5].ProfileRecords.length; i++)
		{
			strHtml += '<tr>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
			+ ((PPV.WebSort[5].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[5].ProfileRecords[i].Desc1)>0)?PPV.WebSort[5].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
			+ ((PPV.WebSort[5].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[5].ProfileRecords[i].Date1)>0)?FormatDte4(PPV.WebSort[5].ProfileRecords[i].Date1):'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>'
			+ ((PPV.WebSort[5].ProfileRecords[i].Date2 && NonSpace(PPV.WebSort[5].ProfileRecords[i].Date2)>0)?FormatDte4(PPV.WebSort[5].ProfileRecords[i].Date2):'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>&nbsp;</td>'
			+ '</tr>'
		}
	}
	else if (typeof(PPV.WebSort[6]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
		+ '<tr>'
		+ '<th class="plaintablecellborder" style="width:63%" colspan="3">'+getSeaPhrase("CR_11","CR")+'</th>'

		if (PPV.WebSort[6].ProfileRecords.length > 0) {

			strHtml += '<th class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
			+ ((PPV.WebSort[6].ProfileRecords[0].Desc1 && NonSpace(PPV.WebSort[6].ProfileRecords[0].Desc1)>0)?PPV.WebSort[6].ProfileRecords[0].Desc1:'&nbsp;')+'</th>'
			+ '</tr>'

			for (var i=1; i<PPV.WebSort[6].ProfileRecords.length; i++)
			{
				strHtml += '<tr>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:63%" colspan="3" nowrap>&nbsp;</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				+ ((PPV.WebSort[6].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[6].ProfileRecords[i].Desc1)>0)?PPV.WebSort[6].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
				+ '</tr>'
			}
		}
	}
	else {
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
		+ '<tr>'
		+ '<td class="plaintablecellborder" headers="licenses" style="width:63%" colspan="3">'+getSeaPhrase("CR_11","CR")+'</td>'
		+ '<td class="plaintablecellborder" headers="AOA" style="width:37%">'+getSeaPhrase("CR_11","CR")+'</td>'
		+ '</tr>'
	}

	// ABMS and DEA tables
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
	+ '<tr>'
	+ '<th class="plaintableheaderbordergrey" id="ABMS" style="width:63%;text-align:left;" colspan="3">'+getSeaPhrase("CR_18","CR")+'</th>'
	+ '<th class="plaintableheaderbordergrey" id="DEA" style="width:37%;text-align:left;">'+getSeaPhrase("CR_23","CR")+'</th>'
	+ '</tr>'
	+ '</table>'

	if (typeof(PPV.WebSort[7]) != "undefined" && typeof(PPV.WebSort[8]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">' 
		+ '<tr>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:26%">'+getSeaPhrase("CERTIFICATION","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:15%">'+getSeaPhrase("SUB_CERT","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:22%">'+getSeaPhrase("EFFECTIVE_EXPIRES","CR")+'</th>'
		+ '<th class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'

		if (PPV.WebSort[8].ProfileRecords.length > 0) {
			strHtml += ((PPV.WebSort[8].ProfileRecords[0].Date1 && NonSpace(PPV.WebSort[8].ProfileRecords[0].Date1)>0)?FormatDte4(PPV.WebSort[8].ProfileRecords[0].Date1):'&nbsp;')+'</th>'
		}
		else {
			strHtml += '&nbsp;</th>'
		}

		strHtml += '</tr>'

		if (PPV.WebSort[7].ProfileRecords.length >= PPV.WebSort[8].ProfileRecords.length-1) {
			// Second table is shorter or equal to the first table
			for (var k=0; k<PPV.WebSort[7].ProfileRecords.length; k++) {
				strHtml += '<tr>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
				+ ((PPV.WebSort[7].ProfileRecords[k].Desc1 && NonSpace(PPV.WebSort[7].ProfileRecords[k].Desc1)>0)?PPV.WebSort[7].ProfileRecords[k].Desc1:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
				+ ((PPV.WebSort[7].ProfileRecords[k].Desc2 && NonSpace(PPV.WebSort[7].ProfileRecords[k].Desc2)>0)?PPV.WebSort[7].ProfileRecords[k].Desc2:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>'

				if ((PPV.WebSort[7].ProfileRecords[k].Date1 && NonSpace(PPV.WebSort[7].ProfileRecords[k].Date1)>0)
				|| (PPV.WebSort[7].ProfileRecords[k].Date2 && NonSpace(PPV.WebSort[7].ProfileRecords[k].Date2)>0)) {

					if (PPV.WebSort[7].ProfileRecords[k].Date1 && NonSpace(PPV.WebSort[7].ProfileRecords[k].Date1)>0) {
						strHtml += FormatDte4(PPV.WebSort[7].ProfileRecords[k].Date1)
						+ ((PPV.WebSort[7].ProfileRecords[k].Date2 && NonSpace(PPV.WebSort[7].ProfileRecords[k].Date2)>0)?' - ':'')
					}
					if (PPV.WebSort[7].ProfileRecords[k].Date2 && NonSpace(PPV.WebSort[7].ProfileRecords[k].Date2)>0) {
						strHtml += FormatDte4(PPV.WebSort[7].ProfileRecords[k].Date2)
					}
				}
				else {
					strHtml += '&nbsp;'
				}
				strHtml += '</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				if (k+1 < PPV.WebSort[8].ProfileRecords.length) {
					strHtml += ((PPV.WebSort[8].ProfileRecords[k+1].Date1 && NonSpace(PPV.WebSort[8].ProfileRecords[k].Date1)>0)?FormatDte4(PPV.WebSort[8].ProfileRecords[k+1].Date1):'&nbsp;')+'</td>'
				}
				else {
					strHtml += '&nbsp;</td>'
				}
				strHtml += '</tr>'
			}
		}
		else {
			// First table is shorter than second table
			for (var k=1; k<PPV.WebSort[8].ProfileRecords.length; k++) {
				strHtml += '<tr>'
				if (k-1 < PPV.WebSort[7].ProfileRecords.length) {
					strHtml += '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
					+ ((PPV.WebSort[7].ProfileRecords[k-1].Desc1 && NonSpace(PPV.WebSort[7].ProfileRecords[k-1].Desc1)>0)?PPV.WebSort[7].ProfileRecords[k-1].Desc1:'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
					+ ((PPV.WebSort[7].ProfileRecords[k-1].Desc2 && NonSpace(PPV.WebSort[7].ProfileRecords[k-1].Desc2)>0)?PPV.WebSort[7].ProfileRecords[k-1].Desc2:'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>'

					if ((PPV.WebSort[7].ProfileRecords[k-1].Date1 && NonSpace(PPV.WebSort[7].ProfileRecords[k-1].Date1)>0)
					|| (PPV.WebSort[7].ProfileRecords[k-1].Date2 && NonSpace(PPV.WebSort[7].ProfileRecords[k-1].Date2)>0)) {

						if (PPV.WebSort[7].ProfileRecords[k-1].Date1 && NonSpace(PPV.WebSort[7].ProfileRecords[k-1].Date1)>0) {
							strHtml += FormatDte4(PPV.WebSort[7].ProfileRecords[k].Date1)
							+ ((PPV.WebSort[7].ProfileRecords[k-1].Date2 && NonSpace(PPV.WebSort[7].ProfileRecords[k-1].Date2)>0)?' - ':'')
						}
						if (PPV.WebSort[7].ProfileRecords[k-1].Date2 && NonSpace(PPV.WebSort[7].ProfileRecords[k-1].Date2)>0) {
							strHtml += FormatDte4(PPV.WebSort[7].ProfileRecords[k-1].Date2)
						}
					}
					else {
						strHtml += '&nbsp;'
					}
					strHtml += '</td>'
				}
				else {
					strHtml += '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>&nbsp;</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>&nbsp;</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>&nbsp;</td>'

				}
				strHtml += '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				+ ((PPV.WebSort[8].ProfileRecords[k].Date1 && NonSpace(PPV.WebSort[8].ProfileRecords[k].Date1)>0)?FormatDte4(PPV.WebSort[8].ProfileRecords[k].Date1):'&nbsp;')+'</td>'
				+ '</tr>'
			}
		}
	}
	else if (typeof(PPV.WebSort[7]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">' 
		+ '<tr>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:26%">'+getSeaPhrase("CERTIFICATION","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:15%">'+getSeaPhrase("SUB_CERT","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:22%">'+getSeaPhrase("EFFECTIVE_EXPIRES","CR")+'</th>'
		+ '<th class="plaintablecellborder" style="width:37%">'+getSeaPhrase("CR_11","CR")+'</th>'
		+ '</tr>'

		for (var i=0; i<PPV.WebSort[7].ProfileRecords.length; i++)
		{
			strHtml += '<tr>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
			+ ((PPV.WebSort[7].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[7].ProfileRecords[i].Desc1)>0)?PPV.WebSort[7].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
			+ ((PPV.WebSort[7].ProfileRecords[i].Desc2 && NonSpace(PPV.WebSort[7].ProfileRecords[i].Desc2)>0)?PPV.WebSort[7].ProfileRecords[i].Desc2:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>'

			if ((PPV.WebSort[7].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[7].ProfileRecords[i].Date1)>0)
			|| (PPV.WebSort[7].ProfileRecords[i].Date2 && NonSpace(PPV.WebSort[7].ProfileRecords[i].Date2)>0)) {

				if (PPV.WebSort[7].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[7].ProfileRecords[i].Date1)>0) {
					strHtml += FormatDte4(PPV.WebSort[7].ProfileRecords[i].Date1)
					+ ((PPV.WebSort[7].ProfileRecords[i].Date2 && NonSpace(PPV.WebSort[7].ProfileRecords[i].Date2)>0)?' - ':'')
				}
				if (PPV.WebSort[7].ProfileRecords[i].Date2 && NonSpace(PPV.WebSort[7].ProfileRecords[i].Date2)>0) {
					strHtml += FormatDte4(PPV.WebSort[7].ProfileRecords[i].Date2)
				}
			}
			else {
				strHtml += '&nbsp;'
			}
			strHtml += '</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>&nbsp;</td>'
			+ '</tr>'
		}
	}
	else if (typeof(PPV.WebSort[8]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
		+ '<tr>'
		+ '<th class="plaintablecellborder" style="width:63%" colspan="3">'+getSeaPhrase("CR_11","CR")+'</th>'

		if (PPV.WebSort[8].ProfileRecords.length > 0) {

			strHtml += '<th class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
			+ ((PPV.WebSort[8].ProfileRecords[0].Date1 && NonSpace(PPV.WebSort[8].ProfileRecords[0].Date1)>0)?FormatDte4(PPV.WebSort[8].ProfileRecords[0].Date1):'&nbsp;')+'</th>'
			+ '</tr>'

			for (var i=1; i<PPV.WebSort[8].ProfileRecords.length; i++)
			{
				strHtml += '<tr>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:63%" colspan="3" nowrap>&nbsp;</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				+ ((PPV.WebSort[8].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[8].ProfileRecords[i].Date1)>0)?FormatDte4(PPV.WebSort[8].ProfileRecords[i].Date1):'&nbsp;')+'</td>'
				+ '</tr>'
			}
		}
	}
	else {
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
		+ '<tr>'
		+ '<td class="plaintablecellborder" headers="ABMS" style="width:63%" colspan="3">'+getSeaPhrase("CR_11","CR")+'</td>'
		+ '<td class="plaintablecellborder" headers="DEA" style="width:37%">'+getSeaPhrase("CR_11","CR")+'</td>'
		+ '</tr>'
	}

	strHtml += '</table>'

	// AMA PRA and Major Professional Activities tables
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
	+ '<tr>'
	+ '<th class="plaintableheaderbordergrey" id="AMA" style="width:63%;text-align:left;" colspan="3">'+getSeaPhrase("CR_24","CR")+'</th>'
	+ '<th class="plaintableheaderbordergrey" id="major" style="width:37%;text-align:left;">'+getSeaPhrase("CR_25","CR")+'</th>'
	+ '</tr>'
	+ '</table>'

	if (typeof(PPV.WebSort[9]) != "undefined" && typeof(PPV.WebSort[10]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">' 
		+ '<tr>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:26%">'+getSeaPhrase("AWARD","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:15%">'+getSeaPhrase("DATE","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:22%">&nbsp;</th>'
		+ '<th class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'

		if (PPV.WebSort[10].ProfileRecords.length > 0) {
			strHtml += ((PPV.WebSort[10].ProfileRecords[0].Desc1 && NonSpace(PPV.WebSort[10].ProfileRecords[0].Desc1)>0)?PPV.WebSort[10].ProfileRecords[0].Desc1:'&nbsp;')+'</th>'
		}
		else {
			strHtml += '&nbsp;</th>'
		}

		strHtml += '</tr>'

		if (PPV.WebSort[9].ProfileRecords.length >= PPV.WebSort[10].ProfileRecords.length-1) {
			// Second table is shorter or equal to the first table
			for (var k=0; k<PPV.WebSort[9].ProfileRecords.length; k++) {
				strHtml += '<tr>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
				+ ((PPV.WebSort[9].ProfileRecords[k].Desc1 && NonSpace(PPV.WebSort[9].ProfileRecords[k].Desc1)>0)?PPV.WebSort[9].ProfileRecords[k].Desc1:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
				+ ((PPV.WebSort[9].ProfileRecords[k].Date1 && NonSpace(PPV.WebSort[9].ProfileRecords[k].Date1)>0)?FormatDte4(PPV.WebSort[9].ProfileRecords[k].Date1):'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>&nbsp;</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				if (k+1 < PPV.WebSort[10].ProfileRecords.length) {
					strHtml += ((PPV.WebSort[10].ProfileRecords[k+1].Desc1 && NonSpace(PPV.WebSort[10].ProfileRecords[k+1].Desc1)>0)?PPV.WebSort[10].ProfileRecords[k+1].Desc1:'&nbsp;')+'</td>'
				}
				else {
					strHtml += '&nbsp;</td>'
				}
				strHtml += '</tr>'
			}
		}
		else {
			// First table is shorter than second table
			for (var k=1; k<PPV.WebSort[10].ProfileRecords.length; k++) {
				strHtml += '<tr>'
				if (k-1 < PPV.WebSort[9].ProfileRecords.length) {
					strHtml += '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
					+ ((PPV.WebSort[9].ProfileRecords[k-1].Desc1 && NonSpace(PPV.WebSort[9].ProfileRecords[k-1].Desc1)>0)?PPV.WebSort[9].ProfileRecords[k-1].Desc1:'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
					+ ((PPV.WebSort[9].ProfileRecords[k-1].Date1 && NonSpace(PPV.WebSort[9].ProfileRecords[k-1].Date1)>0)?FormatDte4(PPV.WebSort[9].ProfileRecords[k-1].Date1):'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>&nbsp;</td>'
				}
				else {
					strHtml += '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>&nbsp;</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>&nbsp;</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>&nbsp;</td>'

				}
				strHtml += '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				+ ((PPV.WebSort[10].ProfileRecords[k].Desc1 && NonSpace(PPV.WebSort[10].ProfileRecords[k].Desc1)>0)?PPV.WebSort[10].ProfileRecords[k].Desc1:'&nbsp;')+'</td>'
				+ '</tr>'
			}
		}
	}
	else if (typeof(PPV.WebSort[9]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">' 
		+ '<tr>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:26%">'+getSeaPhrase("AWARD","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:15%">'+getSeaPhrase("DATE","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:22%">&nbsp;</th>'
		+ '<th class="plaintablecellborder" style="width:37%">'+getSeaPhrase("CR_11","CR")+'</th>'
		+ '</tr>'

		for (var i=0; i<PPV.WebSort[9].ProfileRecords.length; i++)
		{
			strHtml += '<tr>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
			+ ((PPV.WebSort[9].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[9].ProfileRecords[i].Desc1)>0)?PPV.WebSort[9].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
			+ ((PPV.WebSort[9].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[9].ProfileRecords[i].Date1)>0)?FormatDte4(PPV.WebSort[9].ProfileRecords[i].Date1):'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>&nbsp;</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>&nbsp;</td>'
			+ '</tr>'
		}
	}
	else if (typeof(PPV.WebSort[10]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
		+ '<tr>'
		+ '<th class="plaintablecellborder" style="width:63%" colspan="3">'+getSeaPhrase("CR_11","CR")+'</th>'

		if (PPV.WebSort[10].ProfileRecords.length > 0) {

			strHtml += '<th class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
			+ ((PPV.WebSort[10].ProfileRecords[0].Desc1 && NonSpace(PPV.WebSort[10].ProfileRecords[0].Desc1)>0)?PPV.WebSort[10].ProfileRecords[0].Desc1:'&nbsp;')+'</th>'
			+ '</tr>'

			for (var i=1; i<PPV.WebSort[10].ProfileRecords.length; i++)
			{
				strHtml += '<tr>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:63%" colspan="3" nowrap>&nbsp;</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				+ ((PPV.WebSort[10].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[10].ProfileRecords[i].Desc1)>0)?PPV.WebSort[10].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
				+ '</tr>'
			}
		}
	}
	else {
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
		+ '<tr>'
		+ '<td class="plaintablecellborder" headers="AMA" style="width:63%" colspan="3">'+getSeaPhrase("CR_11","CR")+'</td>'
		+ '<td class="plaintablecellborder" headers="major" style="width:37%">'+getSeaPhrase("CR_11","CR")+'</td>'
		+ '</tr>'
	}

	strHtml += '</table>'

	// Sanctions and Self Designated Practice tables
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
	+ '<tr>'
	+ '<th class="plaintableheaderbordergrey" id="sanctions" style="width:63%;text-align:left;" colspan="3">'+getSeaPhrase("SANCTIONS","CR")+'</th>'
	+ '<th class="plaintableheaderbordergrey" id="self" style="width:37%;text-align:left;">'+getSeaPhrase("CR_26","CR")+'</th>'
	+ '</tr>'
	+ '</table>'

	if (typeof(PPV.WebSort[11]) != "undefined" && typeof(PPV.WebSort[12]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">' 
		+ '<tr>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:26%">'+getSeaPhrase("STATE","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:15%">'+getSeaPhrase("ORGANIZATION","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:22%">'+getSeaPhrase("DATE","CR")+'</th>'
		+ '<th class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'

		if (PPV.WebSort[12].ProfileRecords.length > 0) {
			strHtml += ((PPV.WebSort[12].ProfileRecords[0].Desc1 && NonSpace(PPV.WebSort[12].ProfileRecords[0].Desc1)>0)?PPV.WebSort[12].ProfileRecords[0].Desc1:'&nbsp;')+'</th>'
		}
		else {
			strHtml += '&nbsp;</th>'
		}

		strHtml += '</tr>'

		if (PPV.WebSort[11].ProfileRecords.length >= PPV.WebSort[12].ProfileRecords.length-1) {
			// Second table is shorter or equal to the first table
			for (var k=0; k<PPV.WebSort[11].ProfileRecords.length; k++) {
				strHtml += '<tr>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
				+ ((PPV.WebSort[11].ProfileRecords[k].Desc1 && NonSpace(PPV.WebSort[11].ProfileRecords[k].Desc1)>0)?PPV.WebSort[11].ProfileRecords[k].Desc1:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
				+ ((PPV.WebSort[11].ProfileRecords[k].Desc2 && NonSpace(PPV.WebSort[11].ProfileRecords[k].Desc2)>0)?PPV.WebSort[11].ProfileRecords[k].Desc2:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>'
				+ ((PPV.WebSort[11].ProfileRecords[k].Date1 && NonSpace(PPV.WebSort[11].ProfileRecords[k].Date1)>0)?FormatDte4(PPV.WebSort[11].ProfileRecords[k].Date1):'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				if (k+1 < PPV.WebSort[12].ProfileRecords.length) {
					strHtml += ((PPV.WebSort[12].ProfileRecords[k+1].Desc1 && NonSpace(PPV.WebSort[12].ProfileRecords[k+1].Desc1)>0)?PPV.WebSort[12].ProfileRecords[k+1].Desc1:'&nbsp;')+'</td>'
				}
				else {
					strHtml += '&nbsp;</td>'
				}
				strHtml += '</tr>'
			}
		}
		else {
			// First table is shorter than second table
			for (var k=1; k<PPV.WebSort[12].ProfileRecords.length; k++) {
				strHtml += '<tr>'
				if (k-1 < PPV.WebSort[11].ProfileRecords.length) {
					strHtml += '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
					+ ((PPV.WebSort[11].ProfileRecords[k-1].Desc1 && NonSpace(PPV.WebSort[11].ProfileRecords[k-1].Desc1)>0)?PPV.WebSort[11].ProfileRecords[k-1].Desc1:'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
					+ ((PPV.WebSort[11].ProfileRecords[k-1].Desc2 && NonSpace(PPV.WebSort[11].ProfileRecords[k-1].Desc2)>0)?PPV.WebSort[11].ProfileRecords[k-1].Desc2:'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>'
					+ ((PPV.WebSort[11].ProfileRecords[k-1].Date1 && NonSpace(PPV.WebSort[11].ProfileRecords[k-1].Date1)>0)?FormatDte4(PPV.WebSort[11].ProfileRecords[k-1].Date1):'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>&nbsp;</td>'
				}
				else {
					strHtml += '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>&nbsp;</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>&nbsp;</td>'
					+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>&nbsp;</td>'

				}
				strHtml += '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				+ ((PPV.WebSort[12].ProfileRecords[k].Desc1 && NonSpace(PPV.WebSort[12].ProfileRecords[k].Desc1)>0)?PPV.WebSort[12].ProfileRecords[k].Desc1:'&nbsp;')+'</td>'
				+ '</tr>'
			}
		}
	}
	else if (typeof(PPV.WebSort[11]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">' 
		+ '<tr>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:26%">'+getSeaPhrase("STATE","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:15%">'+getSeaPhrase("ORGANIZATION","CR")+'</th>'
		+ '<th class="plaintableheaderbordergreywhite" style="text-align:center;width:22%">'+getSeaPhrase("DATE","CR")+'</th>'
		+ '<th class="plaintablecellborder" style="width:37%">'+getSeaPhrase("CR_11","CR")+'</th>'
		+ '</tr>'

		for (var i=0; i<PPV.WebSort[11].ProfileRecords.length; i++)
		{
			strHtml += '<tr>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:26%" nowrap>'
			+ ((PPV.WebSort[11].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[11].ProfileRecords[i].Desc1)>0)?PPV.WebSort[11].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
			+ ((PPV.WebSort[11].ProfileRecords[i].Desc2 && NonSpace(PPV.WebSort[11].ProfileRecords[i].Desc2)>0)?PPV.WebSort[11].ProfileRecords[i].Desc2:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:22%" nowrap>'
			+ ((PPV.WebSort[11].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[11].ProfileRecords[i].Date1)>0)?FormatDte4(PPV.WebSort[11].ProfileRecords[i].Date1):'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>&nbsp;</td>'
			+ '</tr>'
		}
	}
	else if (typeof(PPV.WebSort[12]) != "undefined") {

		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
		+ '<tr>'
		+ '<th class="plaintablecellborder" style="width:63%" colspan="3">'+getSeaPhrase("CR_11","CR")+'</th>'

		if (PPV.WebSort[12].ProfileRecords.length > 0) {

			strHtml += '<th class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
			+ ((PPV.WebSort[12].ProfileRecords[0].Desc1 && NonSpace(PPV.WebSort[12].ProfileRecords[0].Desc1)>0)?PPV.WebSort[12].ProfileRecords[0].Desc1:'&nbsp;')+'</th>'
			+ '</tr>'

			for (var i=1; i<PPV.WebSort[12].ProfileRecords.length; i++)
			{
				strHtml += '<tr>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:63%" colspan="3" nowrap>&nbsp;</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:37%" nowrap>'
				+ ((PPV.WebSort[12].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[12].ProfileRecords[i].Desc1)>0)?PPV.WebSort[12].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
				+ '</tr>'
			}
		}
	}
	else {
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">' 
		+ '<tr>'
		+ '<td class="plaintablecellborder" headers="sanctions" style="width:63%" colspan="3">'+getSeaPhrase("CR_11","CR")+'</td>'
		+ '<td class="plaintablecellborder" headers="self" style="width:37%">'+getSeaPhrase("CR_11","CR")+'</td>'
		+ '</tr>'
	}

	strHtml += '</table>'

	try {
		self.credentials.document.getElementById("paneHeader").innerHTML = getSeaPhrase("CREDENTIALS","CR");
		self.credentials.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}

	self.credentials.stylePage();
	self.credentials.setLayerSizes(true,true);
	
	if (document.getElementById("credentials").style.height.toString().replace("px","") > 351) {
		document.getElementById("credentials").style.height = "351px";
	}
	document.getElementById("credentials").style.visibility = "visible";
}

function Pcompany(comp)
{
	var Pcomp = parseInt(comp,10).toString();
	for(var i=Pcomp.length; i<4; i++)
	   Pcomp = "0" + Pcomp;
	return Pcomp;
}

function Pemployee(emp)
{
	var Pemp = parseInt(emp,10).toString();
 	for(var i=Pemp.length; i<9; i++)
		Pemp = "0" + Pemp;
	return Pemp;
}
