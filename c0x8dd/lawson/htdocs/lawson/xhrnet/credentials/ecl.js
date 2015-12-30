// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/credentials/ecl.js,v 1.13.2.37 2014/02/25 22:49:17 brentd Exp $
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
var EEC = new Object();
var lastExpCmpSortField = null;

function StartExpiredCompetencyReport(check)
{
	var toolTip;
	var htmlStr = uiRequiredFooter();
	htmlStr += '<form onsubmit="return false;"><table border="0" cellspacing="0" cellpadding="0" role="presentation">';
	htmlStr += '<tr><td class="fieldlabelbold" style="padding-top:5px;width:202px"><label for="rptcriteria">'+getSeaPhrase("SELECT_REPORT_CRITERIA","CR")+'</label></td>';
	htmlStr += '<td class="plaintablecell" style="padding-left:5px;padding-top:5px" nowrap>'+createCriteriaSelect()+'</td>';
	htmlStr += '<td class="fieldlabelbold" style="padding-top:5px;width:175px"><label id="throughdateLbl" for="throughdate">'+getSeaPhrase("SELECT_THROUGH_DATE","CR")+'</label></td>';
	toolTip = getSeaPhrase("SELECT_THROUGH_DATE","CR");
	htmlStr += '<td class="plaintablecell" style="padding-top:5px" nowrap>';
	htmlStr += '<input class="inputbox" id="throughdate" name="throughdate" type="text" size="12" maxlength="10" onchange="parent.validateDate()" value="'+fmttoday+'" aria-labelledby="throughdateLbl throughdateFmt">';
	htmlStr += '<a href="javascript:parent.DateSelect(\'throughdate\')" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><br/>'+uiDateFormatSpan("throughdateFmt")+'</td></tr>';	
	htmlStr += '<tr><td class="fieldlabelbold" style="width:202px"><label for="deftype">'+getSeaPhrase("SELECT_DEFICIENCY_TYPE","CR")+'</label></td>';
	htmlStr += '<td class="plaintablecell" style="padding-left:5px" nowrap>'+createDeficiencySelect()+'</td>';
	htmlStr += '<td class="plaintablecell" colspan="2">';
	htmlStr += uiButton(getSeaPhrase("CALCULATE","CR"),"parent.drawExpiredCompDetail();return false","margin-left:5px");
	htmlStr += '</td></tr></table></form>';
	htmlStr += '<div id="expiredCompDtl" style="width:100%;height;auto;overflow:auto" tabindex="0">&nbsp;</div>';
	try 
	{
		self.main.document.getElementById("paneHeader").innerHTML = getSeaPhrase("REPORT_OPTIONS","CR");
		self.main.document.getElementById("paneBody").style.overflow = "hidden";
		self.main.document.getElementById("paneBody").innerHTML = htmlStr;
	}
	catch(e) {}
	self.main.setLayerSizes();
	self.main.stylePage();
	document.getElementById("main").style.visibility = "visible";
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
	fitToScreen();
}

function createCriteriaSelect() 
{
	var valueList = new Array(getSeaPhrase("REPORT_CRITERIA_0","CR"), getSeaPhrase("REPORT_CRITERIA_1","CR"),getSeaPhrase("REPORT_CRITERIA_2","CR"));
	var tmpStr = '<span id="reportcriteria" style="white-space:nowrap">';
	tmpStr += '<select class="inputbox" id="rptcriteria" name="reportcriteria" onchange="parent.checkSelectionCriteria(this)">';
	tmpStr += '<option value="" selected="selected"></option>';
	for (var i=0; i<valueList.length; i++) 
	{
		tmpStr += '<option value="';
		tmpStr += (i==0)?' ':i;
		tmpStr += '">'+valueList[i]+'</option>';
	}
	tmpStr += '</select>'+uiRequiredIcon()+'</span>';
	return tmpStr;
}

function createDeficiencySelect() 
{
	var valueList = new Array(getSeaPhrase("DEFICIENCY_TYPE_0","CR"),
		getSeaPhrase("DEFICIENCY_TYPE_1","CR"),getSeaPhrase("DEFICIENCY_TYPE_2","CR"));
	var tmpStr = '<span id="deficiencytype" style="white-space:nowrap">';
	tmpStr += '<select class="inputbox" id="deftype" name="deficiencytype" onchange="parent.checkDeficiencyType(this)">';
	tmpStr += '<option value="" selected="selected"></option>';
	for (var i=0; i<valueList.length; i++) 
	{
		tmpStr += '<option value="';
		tmpStr += (i==0)?' ':(i+1);
		tmpStr += '">'+valueList[i]+'</option>';
	}
	tmpStr += '</select>'+uiRequiredIcon()+'</span>';
	return tmpStr;
}

// force the user to enter selection criteria first
function checkDeficiencyType(thisObj)
{
	var rptCriteria = self.main.document.forms[0].elements["reportcriteria"];
	clearRequiredField(self.main.document.getElementById("reportcriteria"));
	if (thisObj.selectedIndex > 0)
		clearRequiredField(self.main.document.getElementById("deficiencytype"));
	if (thisObj.selectedIndex > 0 && rptCriteria.selectedIndex == 0) 
	{
		setRequiredField(self.main.document.getElementById("reportcriteria"), getSeaPhrase("SELECT_RPT_CRITERIA_FIRST","CR"), rptCriteria);
		thisObj.selectedIndex = 0;
		self.main.styleElement(thisObj);
		return;
	}
}

// filter deficiency type values based on selection criteria
function checkSelectionCriteria(thisObj)
{
	var valueList = new Array(getSeaPhrase("DEFICIENCY_TYPE_0","CR"),getSeaPhrase("DEFICIENCY_TYPE_1","CR"),getSeaPhrase("DEFICIENCY_TYPE_2","CR"));
	if (thisObj.selectedIndex > 0)
		clearRequiredField(self.main.document.getElementById("reportcriteria"));
	if (thisObj.selectedIndex > 1)
		valueList = valueList.slice(0,2);
	var selObj = self.main.document.forms[0].elements["deficiencytype"];			
	var selCode = selObj.options[selObj.selectedIndex].value;
	var selIndex = 0;
	selObj.innerHTML = "";		
	var tmpObj = self.main.document.createElement("OPTION");
	tmpObj.value = "";
	tmpObj.text = "";				
	if (navigator.appName.indexOf("Microsoft") >= 0)
		selObj.add(tmpObj);
	else
		selObj.appendChild(tmpObj);
	for (var j=0; j<valueList.length; j++) 
	{
		tmpVal = (j==0)?' ':String(j+1);
		tmpDesc = valueList[j];
		tmpObj = self.main.document.createElement("OPTION");
		tmpObj.value = tmpVal;
		tmpObj.text = tmpDesc;
		if (navigator.appName.indexOf("Microsoft") >= 0)
			selObj.add(tmpObj);
		else
			selObj.appendChild(tmpObj);
		if (selCode == tmpVal)
			selIndex = j+1;
	}
	selObj.selectedIndex = selIndex;
	self.main.styleElement(selObj);
	if (selObj.selectedIndex > 0)
		checkDeficiencyType(selObj);
}

// validate date change
function validateDate()
{
	var inputObj = self.main.document.forms[0].elements["throughdate"];
	clearRequiredField(inputObj);
	if (NonSpace(inputObj.value) == 0) 
	{
		inputObj.value = "";
		return true;
	}
	else if (!ValidateDate(inputObj)) 
	{
		// date is invalid
		return false;
	} 
	else if (isNaN(Number(formjsDate(formatDME(inputObj.value))))) {		
		// date is invalid
		setRequiredField(inputObj, getSeaPhrase("INVALID_DATE","CR"));
		return false;	
	} 
	else 
	{
		// format the date
		var dteParams = dateIsValid(inputObj.value);
		var dte = dteParams[0];
		var errMsg = dteParams[1];
		if (dte)
		{	
			inputObj.value = dte;
			return true;
		}	
		else if (errMsg)
		{	
			setRequiredField(inputObj, errMsg);
			return false;
		}
	}
}

function drawExpiredCompDetail()
{
	var effectDate = fmttoday;
	var rptCriteria = self.main.document.forms[0].elements["reportcriteria"];
	var defType = self.main.document.forms[0].elements["deficiencytype"];
	var throughDate = self.main.document.forms[0].elements["throughdate"];
	clearRequiredField(self.main.document.getElementById("reportcriteria"));
	clearRequiredField(self.main.document.getElementById("deficiencytype"));
	clearRequiredField(throughDate);
	if (defType.selectedIndex > 0 && rptCriteria.selectedIndex == 0) 
	{
		setRequiredField(self.main.document.getElementById("reportcriteria"), getSeaPhrase("SELECT_RPT_CRITERIA_FIRST","CR"), rptCriteria);
		return;
	}
	if (rptCriteria.selectedIndex == 0) 
	{
		setRequiredField(self.main.document.getElementById("reportcriteria"), getSeaPhrase("RPT_CRITERIA_REQUIRED","CR"), rptCriteria);
		return;
	}	
	if (defType.selectedIndex == 0) 
	{
		setRequiredField(self.main.document.getElementById("deficiencytype"), getSeaPhrase("DEFICIENCY_TYPE_REQUIRED","CR"), defType);
		return;
	}
	if (NonSpace(throughDate.value) > 0) 
	{
		if (validateDate() == false)
			return;
		else
			effectDate = throughDate.value;
	}
	else
		throughDate.value = fmttoday;
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","CR"), function(){EmployeeExpiredCompetency(effectDate);});
}

function ReturnDate(dateStr)
{
   	self.main.document.forms[0].elements[date_fld_name].value = dateStr;
}

function EmployeeExpiredCompetency(effectDate,pageDown,fromCompliance)
{
	var defType = self.main.document.forms[0].elements["deficiencytype"];
	self.lawheader.UpdateType = "EEC"
	if (!pageDown)
	{
		EEC = null;
		EEC = new self.lawheader.EECObject();
		EEC.Manager = true
	}
	agsCall = new AGSObject(authUser.prodline,"HS12.1");
	agsCall.event = "ADD";
	agsCall.rtn	= "DATA";
	agsCall.longNames = true;
	agsCall.tds	= false;
	agsCall.field = "FC=I"
	+ "&COMPANY="+escape(authUser.company)
	+ "&HSU-EMPLOYEE="+escape(authUser.employee);
	if (effectDate)
		agsCall.field += "&EXPIRATION-DATE="+escape(formjsDate(formatDME(effectDate)));
	if (fromCompliance) 
	{
		agsCall.field += "&EXPIRE-TYPE="+escape(defType.options[defType.selectedIndex].value,1);
		try 
		{
			agsCall.field += "&CODE="+escape(CCR.CompCompliances[CCR.CompCompliances.CurrentIndex].Code,1)
			+ "&COMP-TYPE="+escape(CCR.CompCompliances[CCR.CompCompliances.CurrentIndex].Type,1);
		}
		catch(e) {}
		agsCall.func = "parent.ReturnAgsCall2('"+effectDate+"',true)";		
	}
	else 
	{
		agsCall.field += "&EXPIRE-TYPE="+escape(defType.options[defType.selectedIndex].value,1);	
		var rptCriteria = self.main.document.forms[0].elements["reportcriteria"];
		agsCall.field += "&COMP-TYPE="+escape(rptCriteria.options[rptCriteria.selectedIndex].value,1);				
		agsCall.func = "parent.ReturnAgsCall2('"+effectDate+"',false)";		
	}
	if (pageDown)
	{
		agsCall.field += "&LAST-HSU-CODE="+escape(EEC.NextSupervisor,1)
		+ "&LAST-LAST-NAME="+escape(EEC.NextLastName,1)
		+ "&LAST-FIRST-NAME="+escape(EEC.NextFirstName,1)
		+ "&LAST-MIDDLE-INIT="+escape(EEC.NextMiddleInit,1)
		+ "&LAST-EMPLOYEE="+escape(EEC.NextEmployee,1);
		EEC.NextSupervisor = ' ';
		EEC.NextLastName = ' ';
		EEC.NextFirstName = ' ';
		EEC.NextMiddleInit = ' ';
		EEC.NextEmployee = ' ';
	}
	agsCall.out	= "JAVASCRIPT";
	agsCall.debug = false;	
	AGS(agsCall,"jsreturn");
}

function ReturnAgsCall2(effectDate, fromCompliance)
{
	if (self.lawheader.gmsgnbr != "000") 
	{
		removeWaitAlert();
		seaAlert(self.lawheader.gmsg, null, null, "error");
	}	
	else
	{	
		if (fromCompliance)
			PaintComplianceExpirationDetail();
		else
			PaintEEC();	
	}
}

function PaintEEC(onsort, sortField, sortDir)
{
	sortDir = sortDir || "ascending";
	var nextSortDir = (sortDir == "ascending") ? "descending" : "ascending";	
	var htmlStr = '';
	if (EEC.ExpCompetencies.length == 0) 
	{
		// no expired competencies for the selected criteria
		htmlStr += '<div class="fieldlabelboldleft" style="padding:10px">'+getSeaPhrase("NO_EXPIRED_COMPS","CR")+'</div>';
	} 
	else 
	{
		// data found
		var toolTip = getSeaPhrase("SORT_BY_NAME","CR");
		htmlStr += '<table id="expiredCompTbl" class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_4","CR")+'">';
		htmlStr += '<caption class="offscreen">'+getSeaPhrase("CR_40","CR")+'</caption>';
		htmlStr += '<tr><th scope="col" class="plaintableheaderborderdarkgreybluetop" style="width:36%;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
		htmlStr += '<a class="columnsort" href="javascript:;" onclick="parent.SortExpiredComps(\'LabelName\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("EMPLOYEE","CR")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></th>';
		htmlStr += '<th scope="col" class="plaintableheaderborderdarkgreybluetop" style="width:25%;text-align:center">'+getSeaPhrase("JOB","CR")+'</th>';
		htmlStr += '<th scope="col" class="plaintableheaderborderdarkgreybluetop" style="width:25%;text-align:center">'+getSeaPhrase("COMPETENCY","CR")+'</th>';
		toolTip = getSeaPhrase("SORT_BY_EXPIRATION_DATE","CR");
		htmlStr += '<th scope="col" class="plaintableheaderborderdarkgreybluetop" style="width:14%;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
		htmlStr += '<a class="columnsort" href="javascript:;" onclick="parent.SortExpiredComps(\'RenewDate\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("EXPIRES","CR")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></th></tr>';
		for (var i=0; i<EEC.ExpCompetencies.length; i++) 
		{
			htmlStr += '<tr>';	
			// Don't repeat employee name and job description if the employee has multiple competencies.
			if (i>0 && EEC.ExpCompetencies[i].Employee == EEC.ExpCompetencies[i-1].Employee) 
			{
				htmlStr += '<td class="plaintablecellborder" style="width:36%" nowrap>&nbsp;</td>';
				htmlStr += '<td class="plaintablecellborder" style="width:25%" nowrap>&nbsp;</td>';
			}
			else 
			{
				toolTip = EEC.ExpCompetencies[i].LabelName+' - '+getSeaPhrase("CR_67","CR");
				htmlStr += '<td class="plaintablecellborder" style="width:36%" nowrap><a href="javascript:parent.LinkToCompetencyProfile('+i+');" title="'+toolTip+'">';
				htmlStr += ((EEC.ExpCompetencies[i].LabelName && NonSpace(EEC.ExpCompetencies[i].LabelName)>0)?EEC.ExpCompetencies[i].LabelName:'&nbsp;')+'<span class="offscreen"> - '+getSeaPhrase("CR_67","CR")+'</span></a></td>';
				htmlStr += '<td class="plaintablecellborder" style="width:25%" nowrap>';
				htmlStr += ((EEC.ExpCompetencies[i].Description && NonSpace(EEC.ExpCompetencies[i].Description)>0)?EEC.ExpCompetencies[i].Description:'&nbsp;')+'</td>';
			}
			htmlStr += '<td class="plaintablecellborder" style="width:25%" nowrap>';
			htmlStr += ((EEC.ExpCompetencies[i].PcoDescription && NonSpace(EEC.ExpCompetencies[i].PcoDescription)>0)?EEC.ExpCompetencies[i].PcoDescription:'&nbsp;')+'</td>';
			htmlStr += '<td class="plaintablecellborder" style="text-align:center;width:14%" nowrap>';
			htmlStr += ((EEC.ExpCompetencies[i].RenewDate && NonSpace(EEC.ExpCompetencies[i].RenewDate)>0)?FormatDte4(EEC.ExpCompetencies[i].RenewDate):getSeaPhrase("CR_45","CR"))+'</td></tr>';
		}
		htmlStr += '</table>';
	}
	try 
	{
		self.main.document.getElementById("paneBody").style.overflow = "auto";
		if (navigator.appName.indexOf("Microsoft") >= 0) 
		{
			self.main.document.getElementById("expiredCompDtl").innerHTML = htmlStr;	
			self.main.setLayerSizes();
		}
		else 
		{
			self.main.document.getElementById("expiredCompDtl").innerHTML = htmlStr;
			self.main.setLayerSizes();
		}
		self.main.stylePage();
		if (onsort)
			self.main.styleSortArrow("expiredCompTbl", sortField, sortDir);
		document.getElementById("navarea").innerHTML = uiButton(getSeaPhrase("PRINT","CR"),"printExpiredCompDetail();return false","margin-top:0px;margin-right:0px");
		stylePage();
		document.getElementById("navarea").style.visibility = "visible";	
		if (EEC.TransactionLimit == "Y")
			seaAlert(getSeaPhrase("CR_69","CR"), null, null, "alert");
	}
	catch(e) {}
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
	fitToScreen();
}

function printExpiredCompDetail()
{
	var Expired = "";
	var selectedDate = self.main.document.forms[0].elements["throughdate"];
	if (NonSpace(selectedDate.value) > 0)
		Expired = selectedDate.value;
	else
		Expired = fmttoday;
	var strHtml = self.header.document.body.innerHTML
	+ '<p/><div class="paneheader" style="background-color:#ffffff;color:#000000">'+getSeaPhrase("CR_42","CR")+' '+Expired+'.</div><br/>'
	+ self.main.document.getElementById("expiredCompDtl").innerHTML;
	try 
	{
		self.printframe.document.getElementById("taskName").innerHTML += ' - '+EEC.EmployeeLabelName;
	}
	catch(e) {}
	self.printframe.document.title = getSeaPhrase("CR_40","CR");
	self.printframe.document.getElementById("paneBody").innerHTML = strHtml;
	self.printframe.document.body.style.overflow = "visible";
	self.printframe.document.getElementById("paneBody").style.overflow = "visible";	
	self.printframe.document.getElementById("paneBorder").style.height = "auto";
	self.printframe.document.getElementById("paneBodyBorder").style.height = "auto";	
	self.printframe.focus();
	self.printframe.print();	
}

function LinkToCompetencyProfile(Index)
{
	document.getElementById("navarea").style.visibility = "hidden";
	document.getElementById("header").style.visibility = "hidden";
	document.getElementById("main").style.visibility = "hidden";
	document.getElementById("subtask").style.visibility = "visible";
	fitToScreen();	
	var nextFunc = function()
	{
	   	if (self.subtask.location.href.indexOf("ecpmain.htm") == -1)
	   		self.subtask.location.replace("/lawson/xhrnet/credentials/ecpmain.htm?employee="+EEC.ExpCompetencies[Index].Employee);
		else
		{
			self.subtask.main.employeeNbr = EEC.ExpCompetencies[Index].Employee;
			self.subtask.main.Drive();
		}
	};
   	showWaitAlert(getSeaPhrase("GATHERING_INFO","CR"), nextFunc);
}

function sortByAscName(obj1, obj2)
{
	var name1 = obj1.LabelName;
	var name2 = obj2.LabelName;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function sortByDscName(obj1, obj2)
{
	var name1 = obj1.LabelName;
	var name2 = obj2.LabelName;
	if (name1 > name2)
		return -1;
	else if (name1 < name2)
		return 1;
	else
		return 0;
}

function sortByAscExpireDate(obj1, obj2)
{
	var name1 = obj1.RenewDate;
	var name2 = obj2.RenewDate;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function sortByDscExpireDate(obj1, obj2)
{
	var name1 = obj1.RenewDate;
	var name2 = obj2.RenewDate;
	if (name1 > name2)
		return -1;
	else if (name1 < name2)
		return 1;
	else
		return 0;
}

function SortExpiredComps(property, dir)
{
	var nextFunc = function()
	{
		if (property != lastExpCmpSortField)
			dir = "ascending";
		lastExpCmpSortField = property;	
		switch (property) 
		{
			case "LabelName": 
				var sortFunc = (dir == "ascending") ? sortByAscName : sortByDscName;
				EEC.ExpCompetencies.sort(sortFunc); 
				break;
			case "RenewDate":
				var sortFunc = (dir == "ascending") ? sortByAscExpireDate : sortByDscExpireDate;
				EEC.ExpCompetencies.sort(sortFunc); 
				break;
		}
		PaintEEC(true, property, dir);
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function OpenHelpDialog()
{
	openHelpDialogWindow("/lawson/xhrnet/credentials/eclhelp.htm");
}
