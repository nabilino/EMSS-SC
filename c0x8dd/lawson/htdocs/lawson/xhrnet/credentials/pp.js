 // Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/credentials/pp.js,v 1.14.2.33 2014/02/21 22:52:17 brentd Exp $
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
var PPV;
var Photo;

function ProfessionalProfile(Company, Employee, Manager, Type, NoImage)
{
	if (typeof(PPV) != "undefined" && PPV.EmployeeCode == Employee)
	{
		PPV.Manager = Manager;
		OpenPPVWindow();
	}
	else
	{
		self.lawheader.UpdateType = "PPV";
		PPV = new self.lawheader.PPVObject();
		PPV.Manager = Manager;
		if (typeof(NoImage) != "undefined" && NoImage)
			PPV.ImageSrc = uiNoPhotoPath;
		agsCall = new AGSObject(authUser.prodline,"HS14.1");
		agsCall.event = "ADD";
		agsCall.rtn = "DATA";
		agsCall.longNames = true;
		agsCall.tds = false;
		agsCall.field = "FC=I"
		+ "&COMPANY=" + escape(Company)
		+ "&EMP-EMPLOYEE=" + escape(Employee);
		Type = "1";
		if (Type)
			agsCall.field += "&SEARCH-TYPE="+Type;
		agsCall.func = "parent.ReturnAgsCallPPV()";
		agsCall.out = "JAVASCRIPT";
		agsCall.debug = false;
		AGS(agsCall,"jsreturn");
	}
}

function ReturnAgsCallPPV()
{
	if (self.lawheader.gmsgnbr != "000") 
	{
		stopProcessing();
		seaAlert(self.lawheader.gmsg, null, null, "error");
	}
//	else if (PPV.WebSort.length == 0)
//	else if (NonSpace(PPV.SearchType) == 0)
//	{
//		stopProcessing();
//		seaAlert(getSeaPhrase("CR_11","CR"), null, null, "alert");
//	}
	else
		OpenPPVWindow();
}

function OpenPPVWindow()
{
	PPV.PPVWindow = self;
	if (PPV.SearchType == 1) 
	{
		setTaskHeader("header",getSeaPhrase("CR_14","CR"),"Credentials");
		PaintPPPVWindow();
	}
	else if (PPV.SearchType == 2) 
	{
		setTaskHeader("header",getSeaPhrase("CR_13","CR"),"Credentials");
		PaintNPPVWindow();
	}
	else 
	{
		setTaskHeader("header",getSeaPhrase("CR_37","CR"),"Credentials");
		PaintNoInfoWindow();
	}
}

function MaskSocialNbr(socialNbr)
{
	return socialNbr.substring(socialNbr.length-4, socialNbr.length);
}

function PaintPersonalInformation()
{
	if (typeof(PPV.ImageSrc)!="undefined")
		Photo = uiNoPhotoPath;
	else
		Photo = "/lawson/xhrnet/images/employees/P" + Pcompany(PPV.Company) + Pemployee(PPV.EmployeeCode) + ".jpg";
	var strHtml = '<table border="0" cellspacing="0" cellpadding="0" style="width:100%" role="presentation">'
	+ '<tr><td class="plaintablecelldisplay" style="text-align:center;vertical-align:middle" nowrap>'
	+ '<img name="photo1" src="'+Photo+'" onerror="this.src=\''+uiNoPhotoPath+'\'" alt="'+getSeaPhrase("PHOTO","CR")+'" title="'+getSeaPhrase("PHOTO","CR")+'"></td>'
	+ '<td class="plaintablecelldisplay"><table border="0" cellspacing="0" cellpadding="0" style="width:100%" summary="'+getSeaPhrase("TSUM_12","SEA")+'">'
	+ '<caption class="offscreen">'+getSeaPhrase("TCAP_9","SEA")+'</caption>'
	+ '<tr class="offscreen"><th scope="col" colspan="4"></th></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader" style="width:18%">'+getSeaPhrase("CR_34","CR")+'</th>'
	+ '<td class="plaintablecellborderdisplay" style="border-bottom:0px;width:26%" nowrap>'+((PPV.EmployeeName && NonSpace(PPV.EmployeeName)>0)?PPV.EmployeeName:'&nbsp;')+'</td>'
	+ '<th scope="row" class="plaintablerowheader" style="width:18%">'+getSeaPhrase("SOCIAL_NUMBER","CR")+'</th>'
	+ '<td class="plaintablecelldisplay" style="width:19%" nowrap>'+((PPV.FicaNbr && NonSpace(PPV.FicaNbr)>0)?MaskSocialNbr(PPV.FicaNbr):'&nbsp;')+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader" style="width:18%">'+getSeaPhrase("ADDRESS","CR")+'</th>'
	+ '<td class="plaintablecellborderdisplay" style="border-bottom:0px;width:26%" nowrap>'+((PPV.Address && NonSpace(PPV.Address)>0)?PPV.Address:'&nbsp;')+'</td>'
	+ '<th scope="row" class="plaintablerowheader" style="width:18%">'+getSeaPhrase("BIRTHDATE","CR")+'</th>'
	+ '<td class="plaintablecelldisplay" style="width:19%" nowrap>'+((PPV.BirthDate && NonSpace(PPV.BirthDate)>0)?FormatDte4(PPV.BirthDate):'&nbsp;')+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader" style="width:18%">'+getSeaPhrase("CITY","CR")+'</th>'
	+ '<td class="plaintablecellborderdisplay" style="border-bottom:0px;width:26%" nowrap>'+((PPV.City && NonSpace(PPV.City)>0)?PPV.City:'&nbsp;')+'</td>'
	+ '<th scope="row" class="plaintablerowheader" style="width:18%">'+getSeaPhrase("BIRTHPLACE","CR")+'</th>'
	+ '<td class="plaintablecelldisplay" style="width:19%" nowrap>';
	if ((PPV.BirthCity && NonSpace(PPV.BirthCity) > 0) || (PPV.BirthState && NonSpace(PPV.BirthState) > 0)) 
	{
		if (PPV.BirthCity && NonSpace(PPV.BirthCity) > 0) 
		{
			strHtml += PPV.BirthCity;
			if (PPV.BirthState && NonSpace(PPV.BirthState) > 0)
				strHtml += ', ';
		}
		if (PPV.BirthState && NonSpace(PPV.BirthState) > 0)
			strHtml += PPV.BirthState;
	}
	else
		strHtml += '&nbsp;';
	strHtml += '</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader" style="width:18%">'+getSeaPhrase("STATE","CR")+'</th>'
	+ '<td class="plaintablecellborderdisplay" style="border-bottom:0px;width:26%" nowrap>'+((PPV.State && NonSpace(PPV.State)>0)?PPV.State:'&nbsp;')+'</td>'
	+ '<th scope="row" class="plaintablerowheader" style="width:18%">&nbsp;</th><td class="plaintablecelldisplay" style="width:18%">&nbsp;</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader" style="width:18%">'+getSeaPhrase("POSTAL_CODE","CR")+'</th>'
	+ '<td class="plaintablecellborderdisplay" style="border-bottom:0px;width:26%" nowrap>'+((PPV.Zip && NonSpace(PPV.Zip)>0)?PPV.Zip:'&nbsp;')+'</td>'
	+ '<th scope="row" class="plaintablerowheader" style="width:18%">&nbsp;</th><td class="plaintablecelldisplay" style="width:18%">&nbsp;</td>'
	+ '</tr></table></td></tr></table>';
	try 
	{
		self.personal.document.getElementById("paneHeader").innerHTML = getSeaPhrase("PERSONAL_INFO","CR");
		self.personal.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}
	self.personal.stylePage();
	self.personal.setLayerSizes();
	document.getElementById("personal").style.visibility = "visible";
	fitToScreen();
}

function PaintNoInfoWindow()
{
	PaintPersonalInformation();
	PaintNoInfoWindowContent();
	PaintManagerReportSelect();
	var msg = (fromTask) ? getSeaPhrase("CNT_UPD_FRM","SEA",[getWinTitle()]) : getSeaPhrase("CNT_UPD_WND","SEA",[getWinTitle()]);
	msg += ' '+getSeaPhrase("CNT_UPD_FRM","SEA",[self.personal.getWinTitle()])+' '+getSeaPhrase("CNT_UPD_FRM","SEA",[self.credentials.getWinTitle()]);
	stopProcessing(msg);
}

function PaintNoInfoWindowContent()
{
	var strHtml = '<div class="plaintablecelldisplay">'+getSeaPhrase("CR_11","CR")+'</div>';
	try 
	{
		self.credentials.document.getElementById("paneHeader").innerHTML = getSeaPhrase("CREDENTIALS","CR");
		self.credentials.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}
	self.credentials.stylePage();
	self.credentials.setLayerSizes();
	document.getElementById("credentials").style.visibility = "visible";
	fitToScreen();
}

function PaintManagerReportSelect()
{
	if (fromTask && PPV.Manager) 
	{
		var tmpStr = '<table border="0" cellspacing="0" cellpadding="0" width="100%" style="background-color:transparent" role="presentation"><tr>';
		try 
		{
			// Only display the select box if there is more than one employee available for selection
			var i = 0;
			var ppCnt = 0;
			var Reports = parent.DRPV.DirectReports;
			var len = Reports.length;
			while (i<len && ppCnt<2) 
			{
				if (Reports[i].WebType && NonSpace(Reports[i].WebType) > 0)
					ppCnt++;
				i++;
			}
			if (ppCnt > 1)
				tmpStr += '<td class="plaintablecellright" style="width:auto" nowrap>'+BuildReportSelect(employeeNbr)+'</td>';
		}
		catch(e) {}
		tmpStr += '<td class="plaintablecellright" style="padding-right:0px;background-color:transparent" nowrap>'
		+ uiButton(getSeaPhrase("BACK","CR"),"CloseProfessionalProfile();return false","margin-right:0px")
		+ '</td></tr></table>';
		document.getElementById("navarea").innerHTML = tmpStr;
		stylePage();
		document.getElementById("navarea").style.visibility = "visible";
	}
}

function BuildReportSelect(empNbr)
{
	var strBuffer = new Array();
	strBuffer[0] = '<label class="offscreen" for="reports">'+getSeaPhrase("SELECT_DIRECT_REPORT","ESS")+'</label>';
	strBuffer[0] += '<select class="inputbox" id="reports" name="reports" onchange="RefreshCompProfile(this.options[this.selectedIndex].value)">';	
	try
	{		
		var Reports = parent.parent.DRPV.DirectReports;
		var len = Reports.length;
		for (var i=0; i<len; i++) 
		{
			if (Reports[i].WebType && NonSpace(Reports[i].WebType) > 0)
				strBuffer[i+1] = '<option value="'+i+'"'+((empNbr==Reports[i].Employee)?' selected':'')+'>'+Reports[i].LabelName;
		}
	}
	catch(e) 
	{
		return "";
	}
	strBuffer[strBuffer.length] = '</select>';
	return strBuffer.join("");
}

function RefreshProfProfile(empIndex)
{
	empIndex = Number(empIndex);
	try 
	{
		employeeNbr = parent.DRPV.DirectReports[empIndex].Employee;
		webType = parent.DRPV.DirectReports[empIndex].WebType;
	}
	catch(e) { webType = false; }
	showWaitAlert(getSeaPhrase("WAIT","ESS"), function(){ProfessionalProfile(authUser.company, employeeNbr, true, webType);});
}

function CloseProfessionalProfile()
{
	try 
	{
		document.getElementById("navarea").style.visibility = "hidden";
		parent.document.getElementById("subtask").style.visibility = "hidden";
		parent.document.getElementById("header").style.visibility = "visible";
		parent.document.getElementById("main").style.visibility = "visible";
	}
	catch(e) {}
}

/************************************************************************************
NURSE PROFILE
************************************************************************************/
function PaintNPPVWindow()
{
	PaintPersonalInformation();
	PaintNPPVWindowContent();
	PaintManagerReportSelect();
	var msg = (fromTask) ? getSeaPhrase("CNT_UPD_FRM","SEA",[getWinTitle()]) : getSeaPhrase("CNT_UPD_WND","SEA",[getWinTitle()]);
	msg += ' '+getSeaPhrase("CNT_UPD_FRM","SEA",[self.personal.getWinTitle()])+' '+getSeaPhrase("CNT_UPD_FRM","SEA",[self.credentials.getWinTitle()]);
	stopProcessing(msg);
}

function PaintNPPVWindowContent()
{
	// Education table
	var strHtml = '<div class="fieldlabelboldleft" role="heading" aria-level="3">'+getSeaPhrase("EDUCATION","CR")+'</div>'
	if (typeof(PPV.WebSort[1]) != "undefined") 
	{
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_9","CR")+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("EDUCATION","CR")+'</caption>'
		+ '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("INSTITUTION","CR")+'</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("COMPLETED","CR")+'</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("DEGREE","CR")+'</th></tr>'
		if (PPV.WebSort[1].ProfileRecords.length > 0)
		{	
			for (var i=0; i<PPV.WebSort[1].ProfileRecords.length; i++)
			{
				strHtml += '<tr><td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[1].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[1].ProfileRecords[i].Desc1)>0)?PPV.WebSort[1].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[1].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[1].ProfileRecords[i].Date1)>0)?FormatDte4(PPV.WebSort[1].ProfileRecords[i].Date1):'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[1].ProfileRecords[i].Desc2 && NonSpace(PPV.WebSort[1].ProfileRecords[i].Desc2)>0)?PPV.WebSort[1].ProfileRecords[i].Desc2:'&nbsp;')+'</td></tr>'
			}
		}
		else
			strHtml += '<tr><td class="plaintablecellborder" colspan="3">'+getSeaPhrase("CR_11","CR")+'</td></tr>'
		strHtml += '</table>'	
	}
	else
		strHtml += '<div class="plaintablecelldisplay">'+getSeaPhrase("CR_11","CR")+'</div>'
	// Licenses table
	strHtml += '<div class="fieldlabelboldleft" role="heading" aria-level="3">'+getSeaPhrase("LICENSES","CR")+'</div>'
	if (typeof(PPV.WebSort[2]) != "undefined") 
	{
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_10","CR")+'">' 
		+ '<caption class="offscreen">'+getSeaPhrase("LICENSES","CR")+'</caption>'
		+ '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("STATE","CR")+'</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("LICENSE_NBR","CR")+'</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("ISSUED","CR")+'</th></tr>'
		if (PPV.WebSort[2].ProfileRecords.length > 0)
		{	
			for (var i=0; i<PPV.WebSort[2].ProfileRecords.length; i++)
			{
				strHtml += '<tr><td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[2].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[2].ProfileRecords[i].Desc1)>0)?PPV.WebSort[2].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[2].ProfileRecords[i].Desc2 && NonSpace(PPV.WebSort[2].ProfileRecords[i].Desc2)>0)?PPV.WebSort[2].ProfileRecords[i].Desc2:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[2].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[2].ProfileRecords[i].Date1)>0)?FormatDte4(PPV.WebSort[2].ProfileRecords[i].Date1):'&nbsp;')+'</td></tr>'
			}
		}
		else
			strHtml += '<tr><td class="plaintablecellborder" colspan="3">'+getSeaPhrase("CR_11","CR")+'</td></tr>'
		strHtml += '</table>'	
	}
	else
		strHtml += '<div class="plaintablecelldisplay">'+getSeaPhrase("CR_11","CR")+'</div>'
	// ANCC table
	strHtml += '<div class="fieldlabelboldleft" role="heading" aria-level="3">'+getSeaPhrase("CR_15","CR")+'</div>'
	if (typeof(PPV.WebSort[3]) != "undefined") 
	{
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_11","CR")+'">' 
		+ '<caption class="offscreen">'+getSeaPhrase("CR_15","CR")+'</caption>'
		+ '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("CREDENTIALS","CR")+'</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("EFFECTIVE","CR")+'</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("EXPIRES","CR")+'</th></tr>'
		if (PPV.WebSort[3].ProfileRecords.length > 0)
		{	
			for (var i=0; i<PPV.WebSort[3].ProfileRecords.length; i++)
			{
				strHtml += '<tr><td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[3].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[3].ProfileRecords[i].Desc1)>0)?PPV.WebSort[3].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[3].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[3].ProfileRecords[i].Date1)>0)?FormatDte4(PPV.WebSort[3].ProfileRecords[i].Date1):'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[3].ProfileRecords[i].Date2 && NonSpace(PPV.WebSort[3].ProfileRecords[i].Date2)>0)?FormatDte4(PPV.WebSort[3].ProfileRecords[i].Date2):'&nbsp;')+'</td></tr>'
			}
		}
		else
			strHtml += '<tr><td class="plaintablecellborder" colspan="3">'+getSeaPhrase("CR_11","CR")+'</td></tr>'
		strHtml += '</table>'
	}
	else
		strHtml += '<div class="plaintablecelldisplay">'+getSeaPhrase("CR_11","CR")+'</div>'
	// Practice Areas table
	strHtml += '<div class="fieldlabelboldleft" role="heading" aria-level="3">'+getSeaPhrase("CR_16","CR")+'</div>'
	if (typeof(PPV.WebSort[4]) != "undefined") 
	{
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_12","CR")+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("CR_16","CR")+'</caption>'
		+ '<tr><th scope="col" colspan="3"></th></tr>'
		if (PPV.WebSort[4].ProfileRecords.length > 0)
		{	
			for (var i=0; i<PPV.WebSort[4].ProfileRecords.length; i++)
			{
				strHtml += '<tr><td class="plaintablecellborder" style="border-right:0px;text-align:center" nowrap>'
				+ ((PPV.WebSort[4].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[4].ProfileRecords[i].Desc1)>0)?PPV.WebSort[4].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="border-right:0px;text-align:center" nowrap>&nbsp;</td>'
				+ '<td class="plaintablecellborder" style="text-align:center" nowrap>&nbsp;</td></tr>'
			}
		}
		else
			strHtml += '<tr><td class="plaintablecellborder" colspan="3">'+getSeaPhrase("CR_11","CR")+'</td></tr>'
		strHtml += '</table>'
	}
	else
		strHtml += '<div class="plaintablecelldisplay">'+getSeaPhrase("CR_11","CR")+'</div>'
	try
	{
		self.credentials.document.getElementById("paneHeader").innerHTML = getSeaPhrase("CREDENTIALS","CR");
		self.credentials.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}
	self.credentials.stylePage();
	self.credentials.setLayerSizes();
	document.getElementById("credentials").style.visibility = "visible";
	fitToScreen();
}

/************************************************************************************
PHYSICIAN PROFESSIONAL PROFILE
************************************************************************************/
function PaintPPPVWindow()
{
	PaintPersonalInformation();
	PaintPPPVWindowContent();
	PaintManagerReportSelect();
	var msg = (fromTask) ? getSeaPhrase("CNT_UPD_FRM","SEA",[getWinTitle()]) : getSeaPhrase("CNT_UPD_WND","SEA",[getWinTitle()]);
	msg += ' '+getSeaPhrase("CNT_UPD_FRM","SEA",[self.personal.getWinTitle()])+' '+getSeaPhrase("CNT_UPD_FRM","SEA",[self.credentials.getWinTitle()]);
	stopProcessing(msg);
}

function PaintPPPVWindowContent()
{
	// Education and NBME tables
	var strHtml = '<div class="fieldlabelboldleft" role="heading" aria-level="3">'+getSeaPhrase("EDUCATION","CR")+'</div>'
	if (typeof(PPV.WebSort[1]) != "undefined") 
	{
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_9","CR")+'">' 
		+ '<caption class="offscreen">'+getSeaPhrase("EDUCATION","CR")+'</caption>'
		+ '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("INSTITUTION","CR")+'</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("COMPLETED","CR")+'</th></tr>'
		if (PPV.WebSort[1].ProfileRecords.length > 0)
		{	
			for (var i=0; i<PPV.WebSort[1].ProfileRecords.length; i++)
			{
				strHtml += '<tr><td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[1].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[1].ProfileRecords[i].Desc1)>0)?PPV.WebSort[1].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[1].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[1].ProfileRecords[i].Date1)>0)?FormatDte4(PPV.WebSort[1].ProfileRecords[i].Date1):'&nbsp;')+'</td>'
				+ '</tr>'
			}
		}
		else
			strHtml += '<tr><td class="plaintablecellborder" colspan="2">'+getSeaPhrase("CR_11","CR")+'</td></tr>'
		strHtml += '</table>'
	}	
	else
		strHtml += '<div class="plaintablecelldisplay">'+getSeaPhrase("CR_11","CR")+'</div>'	
	strHtml += '<div class="fieldlabelboldleft" role="heading" aria-level="3">'+getSeaPhrase("CR_19","CR")+'</div>'
	if (typeof(PPV.WebSort[2]) != "undefined") 
	{
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_13","CR")+'">' 
		+ '<caption class="offscreen">'+getSeaPhrase("CR_19","CR")+'</caption>'
		if (PPV.WebSort[2].ProfileRecords.length > 0) 
		{
			strHtml += '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>'
			+ ((PPV.WebSort[2].ProfileRecords[0].Desc1 && NonSpace(PPV.WebSort[2].ProfileRecords[0].Desc1)>0)?PPV.WebSort[2].ProfileRecords[0].Desc1:'&nbsp;')+'</th></tr>'
			for (var i=1; i<PPV.WebSort[2].ProfileRecords.length; i++)
			{
				strHtml += '<tr><td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[2].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[2].ProfileRecords[i].Desc1)>0)?PPV.WebSort[2].ProfileRecords[i].Desc1:'&nbsp;')+'</td></tr>'
			}
		}
		else
		{	
			strHtml += '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>&nbsp;</th></tr>'
			strHtml += '<tr><td class="plaintablecellborder">'+getSeaPhrase("CR_11","CR")+'</td></tr>'	
		}	
		strHtml += '</table>'
	}
	else
		strHtml += '<div class="plaintablecelldisplay">'+getSeaPhrase("CR_11","CR")+'</div>'	
	// ACGME and ECFMG tables
	strHtml += '<div class="fieldlabelboldleft" role="heading" aria-level="3">'+getSeaPhrase("CR_17","CR")+'</div>'
	if (typeof(PPV.WebSort[3]) != "undefined") 
	{
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_14","CR")+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("CR_17","CR")+'</caption>'
		+ '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("ACGME_RESIDENCY","CR")+'</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("DATES","CR")+'</th></tr>'
		if (PPV.WebSort[3].ProfileRecords.length > 0)
		{
			for (var i=0; i<PPV.WebSort[3].ProfileRecords.length; i++)
			{
				strHtml += '<tr><td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[3].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[3].ProfileRecords[i].Desc1)>0)?PPV.WebSort[3].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[3].ProfileRecords[i].Desc2 && NonSpace(PPV.WebSort[3].ProfileRecords[i].Desc2)>0)?PPV.WebSort[3].ProfileRecords[i].Desc2:'&nbsp;')+'</td>'
				+ '</tr>'
			}
		}
		else
			strHtml += '<tr><td class="plaintablecellborder" colspan="2">'+getSeaPhrase("CR_11","CR")+'</td></tr>'
		strHtml += '</table>'
	}
	else
		strHtml += '<div class="plaintablecelldisplay">'+getSeaPhrase("CR_11","CR")+'</div>'	
	strHtml += '<div class="fieldlabelboldleft" role="heading" aria-level="3">'+getSeaPhrase("CR_20","CR")+'</div>'
	if (typeof(PPV.WebSort[4]) != "undefined") 
	{
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" summary="'+getSeaPhrase("TSUM_15","CR")+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("CR_20","CR")+'</caption>'
		if (PPV.WebSort[4].ProfileRecords.length > 0) 
		{
			strHtml += '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>'
			+ ((PPV.WebSort[4].ProfileRecords[0].Desc1 && NonSpace(PPV.WebSort[4].ProfileRecords[0].Desc1)>0)?PPV.WebSort[4].ProfileRecords[0].Desc1:'&nbsp;')+'</th></tr>'
			for (var i=1; i<PPV.WebSort[4].ProfileRecords.length; i++)
			{
				strHtml += '<tr><td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[4].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[4].ProfileRecords[i].Desc1)>0)?PPV.WebSort[4].ProfileRecords[i].Desc1:'&nbsp;')+'</td></tr>'
			}
		}
		else
		{
			strHtml += '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>&nbsp;</th></tr>'
			strHtml += '<tr><td class="plaintablecellborder">'+getSeaPhrase("CR_11","CR")+'</td></tr>'
		}	
		strHtml += '</table>'
	}
	else
		strHtml += '<div class="plaintablecelldisplay">'+getSeaPhrase("CR_11","CR")+'</div>'	
	// Licenses and AOA tables
	strHtml += '<div class="fieldlabelboldleft" role="heading" aria-level="3">'+getSeaPhrase("LICENSES","CR")+'</div>'	
	if (typeof(PPV.WebSort[5]) != "undefined") 
	{
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_10","CR")+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("LICENSES","CR")+'</caption>'
		+ '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("STATE_NUMBER","CR")+'</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("ISSUED","CR")+'</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("EXPIRES","CR")+'</th></tr>'
		for (var i=0; i<PPV.WebSort[5].ProfileRecords.length; i++)
		{
			strHtml += '<tr><td class="plaintablecellborder" style="text-align:center" nowrap>'
			+ ((PPV.WebSort[5].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[5].ProfileRecords[i].Desc1)>0)?PPV.WebSort[5].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center" nowrap>'
			+ ((PPV.WebSort[5].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[5].ProfileRecords[i].Date1)>0)?FormatDte4(PPV.WebSort[5].ProfileRecords[i].Date1):'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center" nowrap>'
			+ ((PPV.WebSort[5].ProfileRecords[i].Date2 && NonSpace(PPV.WebSort[5].ProfileRecords[i].Date2)>0)?FormatDte4(PPV.WebSort[5].ProfileRecords[i].Date2):'&nbsp;')+'</td>'
			+ '</tr>'
		}
		strHtml += '</table>'
	}
	else
		strHtml += '<div class="plaintablecelldisplay">'+getSeaPhrase("CR_11","CR")+'</div>'	
	strHtml += '<div class="fieldlabelboldleft" role="heading" aria-level="3">'+getSeaPhrase("CR_21","CR")+'</div>'
	if (typeof(PPV.WebSort[6]) != "undefined") 
	{
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" summary="'+getSeaPhrase("TSUM_16","CR")+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("CR_21","CR")+'</caption>'
		if (PPV.WebSort[6].ProfileRecords.length > 0)
		{
			strHtml += '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>'
			+ ((PPV.WebSort[6].ProfileRecords[0].Desc1 && NonSpace(PPV.WebSort[6].ProfileRecords[0].Desc1)>0)?PPV.WebSort[6].ProfileRecords[0].Desc1:'&nbsp;')+'</th></tr>'
			for (var i=1; i<PPV.WebSort[6].ProfileRecords.length; i++)
			{
				strHtml += '<tr><td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[6].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[6].ProfileRecords[i].Desc1)>0)?PPV.WebSort[6].ProfileRecords[i].Desc1:'&nbsp;')+'</td></tr>'
			}
		}
		else
		{
			strHtml += '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>&nbsp;</th></tr>'
			strHtml += '<tr><td class="plaintablecellborder">'+getSeaPhrase("CR_11","CR")+'</td></tr>'
		}	
		strHtml += '</table>'
	}
	else
		strHtml += '<div class="plaintablecelldisplay">'+getSeaPhrase("CR_11","CR")+'</div>'	
	// ABMS and DEA tables
	strHtml += '<div class="fieldlabelboldleft" role="heading" aria-level="3">'+getSeaPhrase("CR_18","CR")+'</div>'
	if (typeof(PPV.WebSort[7]) != "undefined") 
	{
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_17","CR")+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("CR_18","CR")+'</caption>'
		+ '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("CERTIFICATION","CR")+'</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("SUB_CERT","CR")+'</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("EFFECTIVE_EXPIRES","CR")+'</th></tr>'
		if (PPV.WebSort[7].ProfileRecords.length > 0)
		{	
			for (var i=0; i<PPV.WebSort[7].ProfileRecords.length; i++)
			{
				strHtml += '<tr><td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[7].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[7].ProfileRecords[i].Desc1)>0)?PPV.WebSort[7].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[7].ProfileRecords[i].Desc2 && NonSpace(PPV.WebSort[7].ProfileRecords[i].Desc2)>0)?PPV.WebSort[7].ProfileRecords[i].Desc2:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center" nowrap>'
				if ((PPV.WebSort[7].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[7].ProfileRecords[i].Date1) > 0)
				|| (PPV.WebSort[7].ProfileRecords[i].Date2 && NonSpace(PPV.WebSort[7].ProfileRecords[i].Date2) > 0)) 
				{
					if (PPV.WebSort[7].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[7].ProfileRecords[i].Date1) > 0)
						strHtml += FormatDte4(PPV.WebSort[7].ProfileRecords[i].Date1)+((PPV.WebSort[7].ProfileRecords[i].Date2 && NonSpace(PPV.WebSort[7].ProfileRecords[i].Date2) > 0)?' - ':'');
					if (PPV.WebSort[7].ProfileRecords[i].Date2 && NonSpace(PPV.WebSort[7].ProfileRecords[i].Date2) > 0)
						strHtml += FormatDte4(PPV.WebSort[7].ProfileRecords[i].Date2);
				}
				else
					strHtml += '&nbsp;'
				strHtml += '</td></tr>'
			}
		}
		else
			strHtml += '<tr><td class="plaintablecellborder" colspan="3">'+getSeaPhrase("CR_11","CR")+'</td></tr>'
		strHtml += '</table>'
	}
	else
		strHtml += '<div class="plaintablecelldisplay">'+getSeaPhrase("CR_11","CR")+'</div>'	
	strHtml += '<div class="fieldlabelboldleft" role="heading" aria-level="3">'+getSeaPhrase("CR_23","CR")+'</div>'
	if (typeof(PPV.WebSort[8]) != "undefined") 
	{
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" summary="'+getSeaPhrase("TSUM_18","CR")+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("CR_23","CR")+'</caption>'
		if (PPV.WebSort[8].ProfileRecords.length > 0) 
		{
			strHtml += '<th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>'+((PPV.WebSort[8].ProfileRecords[0].Date1 && NonSpace(PPV.WebSort[8].ProfileRecords[0].Date1)>0)?FormatDte4(PPV.WebSort[8].ProfileRecords[0].Date1):'&nbsp;')+'</th></tr>'
			for (var i=1; i<PPV.WebSort[8].ProfileRecords.length; i++)
			{
				strHtml += '<tr><td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[8].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[8].ProfileRecords[i].Date1)>0)?FormatDte4(PPV.WebSort[8].ProfileRecords[i].Date1):'&nbsp;')+'</td></tr>'
			}
		}
		else
		{
			strHtml += '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>&nbsp;</th></tr>'
			strHtml += '<tr><td class="plaintablecellborder">'+getSeaPhrase("CR_11","CR")+'</td></tr>'
		}		
		strHtml += '</table>'
	}
	else
		strHtml += '<div class="plaintablecelldisplay">'+getSeaPhrase("CR_11","CR")+'</div>'	
	// AMA PRA and Major Professional Activities tables
	strHtml += '<div class="fieldlabelboldleft" role="heading" aria-level="3">'+getSeaPhrase("CR_24","CR")+'</div>'
	if (typeof(PPV.WebSort[9]) != "undefined") 
	{
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_19","CR")+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("CR_24","CR")+'</caption>'
		+ '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("AWARD","CR")+'</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("DATE","CR")+'</th></tr>'
		if (PPV.WebSort[9].ProfileRecords.length > 0)
		{	
			for (var i=0; i<PPV.WebSort[9].ProfileRecords.length; i++)
			{
				strHtml += '<tr><td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[9].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[9].ProfileRecords[i].Desc1)>0)?PPV.WebSort[9].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[9].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[9].ProfileRecords[i].Date1)>0)?FormatDte4(PPV.WebSort[9].ProfileRecords[i].Date1):'&nbsp;')+'</td>'
				+ '</tr>'
			}
		}
		else
			strHtml += '<tr><td class="plaintablecellborder" colspan="2">'+getSeaPhrase("CR_11","CR")+'</td></tr>'	
		strHtml += '</table>'		
	}
	else
		strHtml += '<div class="plaintablecelldisplay">'+getSeaPhrase("CR_11","CR")+'</div>'	
	strHtml += '<div class="fieldlabelboldleft" role="heading" aria-level="3">'+getSeaPhrase("CR_25","CR")+'</div>'
	if (typeof(PPV.WebSort[10]) != "undefined") 
	{
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" summary="'+getSeaPhrase("TSUM_20","CR")+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("CR_25","CR")+'</caption>'
		if (PPV.WebSort[10].ProfileRecords.length > 0) 
		{
			strHtml += '<th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>'
			+ ((PPV.WebSort[10].ProfileRecords[0].Desc1 && NonSpace(PPV.WebSort[10].ProfileRecords[0].Desc1)>0)?PPV.WebSort[10].ProfileRecords[0].Desc1:'&nbsp;')+'</th></tr>'
			for (var i=1; i<PPV.WebSort[10].ProfileRecords.length; i++)
			{
				strHtml += '<tr><td class="plaintablecellborder" style="text-align:center" colspan="3" nowrap>&nbsp;</td>'
				+ '<td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[10].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[10].ProfileRecords[i].Desc1)>0)?PPV.WebSort[10].ProfileRecords[i].Desc1:'&nbsp;')+'</td></tr>'
			}
		}
		else
		{
			strHtml += '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>&nbsp;</th></tr>'
			strHtml += '<tr><td class="plaintablecellborder">'+getSeaPhrase("CR_11","CR")+'</td></tr>'
		}		
		strHtml += '</table>'
	}
	else
		strHtml += '<div class="plaintablecelldisplay">'+getSeaPhrase("CR_11","CR")+'</div>'	
	// Sanctions and Self Designated Practice tables
	strHtml += '<div class="fieldlabelboldleft" role="heading" aria-level="3">'+getSeaPhrase("SANCTIONS","CR")+'</div>'
	if (typeof(PPV.WebSort[11]) != "undefined") 
	{
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_21","CR")+'">' 
		+ '<caption class="offscreen">'+getSeaPhrase("SANCTIONS","CR")+'</caption>'
		+ '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("STATE","CR")+'</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("ORGANIZATION","CR")+'</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("DATE","CR")+'</th></tr>'
		for (var i=0; i<PPV.WebSort[11].ProfileRecords.length; i++)
		{
			strHtml += '<tr><td class="plaintablecellborder" style="text-align:center" nowrap>'
			+ ((PPV.WebSort[11].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[11].ProfileRecords[i].Desc1)>0)?PPV.WebSort[11].ProfileRecords[i].Desc1:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center" nowrap>'
			+ ((PPV.WebSort[11].ProfileRecords[i].Desc2 && NonSpace(PPV.WebSort[11].ProfileRecords[i].Desc2)>0)?PPV.WebSort[11].ProfileRecords[i].Desc2:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:center" nowrap>'
			+ ((PPV.WebSort[11].ProfileRecords[i].Date1 && NonSpace(PPV.WebSort[11].ProfileRecords[i].Date1)>0)?FormatDte4(PPV.WebSort[11].ProfileRecords[i].Date1):'&nbsp;')+'</td>'
			+ '</tr>'
		}
	}
	else
		strHtml += '<div class="plaintablecelldisplay">'+getSeaPhrase("CR_11","CR")+'</div>'	
	strHtml += '<div class="fieldlabelboldleft" role="heading" aria-level="3">'+getSeaPhrase("CR_26","CR")+'</div>'
	if (typeof(PPV.WebSort[12]) != "undefined") 
	{
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%" summary="'+getSeaPhrase("TSUM_22","CR")+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("CR_26","CR")+'</caption>'
		if (PPV.WebSort[12].ProfileRecords.length > 0) 
		{
			strHtml += '<th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>'
			+ ((PPV.WebSort[12].ProfileRecords[0].Desc1 && NonSpace(PPV.WebSort[12].ProfileRecords[0].Desc1)>0)?PPV.WebSort[12].ProfileRecords[0].Desc1:'&nbsp;')+'</th></tr>'
			for (var i=1; i<PPV.WebSort[12].ProfileRecords.length; i++)
			{
				strHtml += '<tr><td class="plaintablecellborder" style="text-align:center" nowrap>'
				+ ((PPV.WebSort[12].ProfileRecords[i].Desc1 && NonSpace(PPV.WebSort[12].ProfileRecords[i].Desc1)>0)?PPV.WebSort[12].ProfileRecords[i].Desc1:'&nbsp;')+'</td></tr>'
			}
		}
		else
		{
			strHtml += '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>&nbsp;</th></tr>'
			strHtml += '<tr><td class="plaintablecellborder">'+getSeaPhrase("CR_11","CR")+'</td></tr>'			
		}	
		strHtml += '</table>'
	}
	else
		strHtml += '<div class="plaintablecelldisplay">'+getSeaPhrase("CR_11","CR")+'</div>'
	try 
	{
		self.credentials.document.getElementById("paneHeader").innerHTML = getSeaPhrase("CREDENTIALS","CR");
		self.credentials.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}
	self.credentials.stylePage();
	self.credentials.setLayerSizes();
	document.getElementById("credentials").style.visibility = "visible";
	fitToScreen();
}

function Pcompany(comp)
{
	var Pcomp = parseInt(comp,10).toString();
	for (var i=Pcomp.length; i<4; i++)
	   Pcomp = "0" + Pcomp;
	return Pcomp;
}

function Pemployee(emp)
{
	var Pemp = parseInt(emp,10).toString();
 	for (var i=Pemp.length; i<9; i++)
		Pemp = "0" + Pemp;
	return Pemp;
}
