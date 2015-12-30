// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/credentials/ecl.js,v 1.13.2.6 2009/03/03 20:49:36 brentd Exp $
var EEC = new Object();

function StartExpiredCompetencyReport(check)
{
	var htmlStr = '<form onsubmit="return false;">';
	htmlStr += '<table border="0" cellspacing="0" cellpadding="0" width="100%">';
	htmlStr += '<tr>';
	htmlStr += '<td class="fieldlabelbold" style="padding-top:5px;width:202px">'+getSeaPhrase("SELECT_REPORT_CRITERIA","CR")+'</td>';
	htmlStr += '<td id="reportcriteria" class="plaintablecell" style="padding-left:5px;padding-top:5px;width:238px" nowrap>'+createCriteriaSelect()+'</td>';
	htmlStr += '<td class="fieldlabelbold" style="padding-top:5px;width:175px">'+getSeaPhrase("SELECT_THROUGH_DATE","CR")+'</td>';
	htmlStr += '<td class="plaintablecell" style="padding-top:5px;width:175px" nowrap>';
	htmlStr += '<input class="inputbox" name="throughdate" type="text" size="12" maxlength="10" ';
	htmlStr += 'onchange="parent.validateDate()" value="'+fmttoday+'">';
	htmlStr += '<a href="javascript:parent.DateSelect(\'throughdate\')"';
	htmlStr += ' onmouseover="window.status=\''+getSeaPhrase("DISPLAY_CAL","CR").replace(/\'/g,"\\'")+'\';return true"';
    	htmlStr += ' onmouseout="window.status=\'\';return true">';
    	htmlStr += uiCalendarIcon()+'</a>'+uiDateFormatSpan2()+'</td>';
	htmlStr += '</tr>';	
	htmlStr += '<tr>';
	htmlStr += '<td class="fieldlabelbold" style="width:202px">'+getSeaPhrase("SELECT_DEFICIENCY_TYPE","CR")+'</td>';
	htmlStr += '<td id="deficiencytype" class="plaintablecell" style="padding-left:5px;width:238px" nowrap>'+createDeficiencySelect()+'</td>';
	htmlStr += '<td class="plaintablecell" style="width:175px;text-align:center">';
	htmlStr += uiButton(getSeaPhrase("CALCULATE","CR"),"parent.drawExpiredCompDetail();return false","margin-right:0px");
	htmlStr += '</td>';
	htmlStr += '<td class="plaintablecell" style="width:175px;text-align:right;vertical-align:bottom">';
	htmlStr += '<span class="panefooter" style="position:relative;padding-right:5px;padding-top:5px">'+uiRequiredIcon()+getSeaPhrase("REQUIRED","CR")+'</span>';
	htmlStr += '</td>';	
	htmlStr += '</tr>';	
	htmlStr += '</table>';
	htmlStr += '</form>';
	htmlStr += '<div id="expiredCompDtl" style="width:100%;overflow:auto">&nbsp;</div>';

	try {
		self.main.document.getElementById("paneHeader").innerHTML = getSeaPhrase("REPORT_OPTIONS","CR");
		self.main.document.getElementById("paneBody").style.overflow = "hidden";
		self.main.document.getElementById("paneBody").innerHTML = htmlStr;
	}
	catch(e) {}

	self.main.setLayerSizes();
	self.main.stylePage();
	document.getElementById("main").style.visibility = "visible";
	removeWaitAlert();
}

function createCriteriaSelect() 
{
	var valueList = new Array(getSeaPhrase("REPORT_CRITERIA_0","CR"),
		getSeaPhrase("REPORT_CRITERIA_1","CR"),getSeaPhrase("REPORT_CRITERIA_2","CR"));
	var tmpStr = '<span style="white-space:nowrap">';
	tmpStr += '<select class="inputbox" name="reportcriteria" onchange="parent.checkSelectionCriteria(this)">';
	
	tmpStr += '<option value="" selected="selected"></option>';
	for (var i=0; i<valueList.length; i++) {
		tmpStr += '<option value="';
		tmpStr += (i==0)?' ':i;
		tmpStr += '">';
		tmpStr += valueList[i] + '</option>';
	}
	tmpStr += '</select>'+uiRequiredIcon()+'</span>';

	return tmpStr;
}

function createDeficiencySelect() 
{
	var valueList = new Array(getSeaPhrase("DEFICIENCY_TYPE_0","CR"),
		getSeaPhrase("DEFICIENCY_TYPE_1","CR"),getSeaPhrase("DEFICIENCY_TYPE_2","CR"));
	var tmpStr = '<span style="white-space:nowrap">';
	tmpStr += '<select class="inputbox" name="deficiencytype" onchange="parent.checkDeficiencyType(this)">';
	
	tmpStr += '<option value="" selected="selected"></option>';
	for (var i=0; i<valueList.length; i++) {
		tmpStr += '<option value="';
		tmpStr += (i==0)?' ':(i+1);
		tmpStr += '">';
		tmpStr += valueList[i] + '</option>';
	}
	tmpStr += '</select>'+uiRequiredIcon()+'</span>';

	return tmpStr;
}

// force the user to enter selection criteria first
function checkDeficiencyType(thisObj)
{
	var rptCriteria = self.main.document.forms[0].elements["reportcriteria"];

	clearRequiredField(self.main.document.getElementById("reportcriteria"));

	if (thisObj.selectedIndex > 0) {
		clearRequiredField(self.main.document.getElementById("deficiencytype"));
	}

	if (thisObj.selectedIndex > 0 && rptCriteria.selectedIndex == 0) {
		thisObj.selectedIndex = 0;
		self.main.styleElement(thisObj);
		setRequiredField(self.main.document.getElementById("reportcriteria"));
		seaAlert(getSeaPhrase("SELECT_RPT_CRITERIA_FIRST","CR"));
		rptCriteria.focus();
		return;
	}
}

// filter deficiency type values based on selection criteria
function checkSelectionCriteria(thisObj)
{
	var valueList = new Array(getSeaPhrase("DEFICIENCY_TYPE_0","CR"),
		getSeaPhrase("DEFICIENCY_TYPE_1","CR"),getSeaPhrase("DEFICIENCY_TYPE_2","CR"));

	if (thisObj.selectedIndex > 0) {
		clearRequiredField(self.main.document.getElementById("reportcriteria"));
	}

	if (thisObj.selectedIndex > 1) {
		valueList = valueList.slice(0,2);
	}
	
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
	for (var j=0; j<valueList.length; j++) {
		tmpVal = (j==0)?' ':String(j+1);
		tmpDesc = valueList[j];
	
		tmpObj = self.main.document.createElement("OPTION");
		tmpObj.value = tmpVal;
		tmpObj.text = tmpDesc;
		if (navigator.appName.indexOf("Microsoft") >= 0)
			selObj.add(tmpObj);
		else
			selObj.appendChild(tmpObj);
		if (selCode == tmpVal) {
			selIndex = j+1;
		}				
	}
	selObj.selectedIndex = selIndex;
	self.main.styleElement(selObj);
	
	if (selObj.selectedIndex > 0) {
		checkDeficiencyType(selObj);
	}
}

// validate date change
function validateDate()
{
	var inputObj = self.main.document.forms[0].elements["throughdate"];
	clearRequiredField(inputObj);

	if (NonSpace(inputObj.value) == 0) {
		inputObj.value = "";
		return true;
	}
	else if (!ValidateDate(inputObj)) {
		// date is invalid
		setRequiredField(inputObj);
		inputObj.focus();
		inputObj.select();
		return false;
	} else if (isNaN(Number(formjsDate(inputObj.value)))) {		
		// date is invalid
		seaAlert(getSeaPhrase("INVALID_DATE","CR"));
		setRequiredField(inputObj);
		inputObj.focus();
		inputObj.select();
		return false;	
	} else {
		// format the date
		inputObj.value = FormatDte4(formjsDate(dateIsValid(inputObj.value)));
		return true;
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

	if (defType.selectedIndex > 0 && rptCriteria.selectedIndex == 0) {
		setRequiredField(self.main.document.getElementById("reportcriteria"));
		seaAlert(getSeaPhrase("SELECT_RPT_CRITERIA_FIRST","CR"));
		rptCriteria.focus();
		return;
	}
	
	if (rptCriteria.selectedIndex == 0) {
		setRequiredField(self.main.document.getElementById("reportcriteria"));
		seaAlert(getSeaPhrase("RPT_CRITERIA_REQUIRED","CR"));
		rptCriteria.focus();
		return;
	}	

	if (defType.selectedIndex == 0) {
		setRequiredField(self.main.document.getElementById("deficiencytype"));
		seaAlert(getSeaPhrase("DEFICIENCY_TYPE_REQUIRED","CR"));
		defType.focus();
		return;
	}
	
	if (NonSpace(throughDate.value)>0) {
		if (validateDate() == false) {
			return;
		}
		else {
			effectDate = throughDate.value;
		}
	}
	else {
		throughDate.value = fmttoday;
	}
	
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","CR"));
	EmployeeExpiredCompetency(effectDate);
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
	agsCall.event		= "ADD";
	agsCall.rtn		= "DATA";
	agsCall.longNames	= true;
	agsCall.tds		= false;
	agsCall.field		= "FC=I"
				+ "&COMPANY="+escape(authUser.company)
				+ "&HSU-EMPLOYEE="+escape(authUser.employee);
	if (effectDate) {
		agsCall.field += "&EXPIRATION-DATE="+escape(formjsDate(effectDate));
	}
	
	if (fromCompliance) {
		agsCall.field += "&EXPIRE-TYPE="+escape(defType.options[defType.selectedIndex].value,1);
		try {
			agsCall.field += "&CODE="+escape(CCR.CompCompliances[CCR.CompCompliances.CurrentIndex].Code,1)
				      + "&COMP-TYPE="+escape(CCR.CompCompliances[CCR.CompCompliances.CurrentIndex].Type,1);
		}
		catch(e) {}
		agsCall.func	= "parent.ReturnAgsCall2('"+effectDate+"',true)";		
	}
	else {
		agsCall.field += "&EXPIRE-TYPE="+escape(defType.options[defType.selectedIndex].value,1);	
		var rptCriteria = self.main.document.forms[0].elements["reportcriteria"];
		agsCall.field += "&COMP-TYPE="+escape(rptCriteria.options[rptCriteria.selectedIndex].value,1);				
		agsCall.func	= "parent.ReturnAgsCall2('"+effectDate+"',false)";		
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
	agsCall.out		= "JAVASCRIPT";
	agsCall.debug		= false;	
	AGS(agsCall,"jsreturn");
}

function ReturnAgsCall2(effectDate,fromCompliance)
{
	if (self.lawheader.gmsgnbr != "000") {
		removeWaitAlert();
		seaAlert(self.lawheader.gmsg);
	}	
	else
	{
//PT 159788 if else loop removed	
		if (fromCompliance) {
				PaintComplianceExpirationDetail();
			}
			else {
				PaintEEC();
			}	
	}	
}

function PaintEEC(onsort, sortField)
{
	var htmlStr = '';
	
	if (EEC.ExpCompetencies.length == 0) {
		// no expired competencies for the selected criteria
		htmlStr += '<div class="fieldlabelbold" style="padding:10px;text-align:left">'+getSeaPhrase("NO_EXPIRED_COMPS","CR")+'</div>';
	} else {
		// got some data
		htmlStr += '<table id="expiredCompTbl" class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">';
		htmlStr += '<tr>';
		htmlStr += '<th class="plaintableheaderborderdarkgreybluetop" style="width:36%;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
		htmlStr += '<a class="columnsort" href="" onclick="parent.SortExpiredComps(\'LabelName\');return false;"';
		htmlStr += ' onmouseover="window.status=\''+getSeaPhrase("SORT_BY_NAME","CR").replace(/\'/g,"\\'")+'\';return true"';
		htmlStr += ' onmouseout="window.status=\'\';return true">'+getSeaPhrase("EMPLOYEE","CR")+'</th>';
		htmlStr += '<th class="plaintableheaderborderdarkgreybluetop" style="width:25%;text-align:center">'+getSeaPhrase("JOB","CR")+'</th>';
		htmlStr += '<th class="plaintableheaderborderdarkgreybluetop" style="width:25%;text-align:center">'+getSeaPhrase("COMPETENCY","CR")+'</th>';
		htmlStr += '<th class="plaintableheaderborderdarkgreybluetop" style="width:14%;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
		htmlStr += '<a class="columnsort" href="" onclick="parent.SortExpiredComps(\'RenewDate\');return false;"';
		htmlStr += ' onmouseover="window.status=\''+getSeaPhrase("SORT_BY_EXPIRATION_DATE","CR").replace(/\'/g,"\\'")+'\';return true"';
		htmlStr += ' onmouseout="window.status=\'\';return true">'+getSeaPhrase("EXPIRES","CR")+'</th>';
		htmlStr += '</tr>';
		
		for (var i=0; i<EEC.ExpCompetencies.length; i++) {
			htmlStr += '<tr>';	
			// Don't repeat employee name and job description if the employee has multiple competencies.
			if (i>0 && EEC.ExpCompetencies[i].Employee == EEC.ExpCompetencies[i-1].Employee) {
				htmlStr += '<td class="plaintablecellborder" style="width:36%" nowrap>&nbsp;</td>';
				htmlStr += '<td class="plaintablecellborder" style="width:25%" nowrap>&nbsp;</td>';
			}
			else {
				htmlStr += '<td class="plaintablecellborder" style="width:36%" nowrap>';
				htmlStr += '<a href="javascript:parent.LinkToCompetencyProfile('+i+')"';
				htmlStr += ' onmouseover="window.status=\''+getSeaPhrase("CR_38","CR").replace(/\'/g,"\\'")+'\';return true"';
				htmlStr += ' onmouseout="window.status=\'\';return true">';
				htmlStr += ((EEC.ExpCompetencies[i].LabelName && NonSpace(EEC.ExpCompetencies[i].LabelName)>0)?EEC.ExpCompetencies[i].LabelName:'&nbsp;')+'</a></td>';
				htmlStr += '<td class="plaintablecellborder" style="width:25%" nowrap>';
				htmlStr += ((EEC.ExpCompetencies[i].Description && NonSpace(EEC.ExpCompetencies[i].Description)>0)?EEC.ExpCompetencies[i].Description:'&nbsp;')+'</td>';
			}
			htmlStr += '<td class="plaintablecellborder" style="width:25%" nowrap>';
			htmlStr += ((EEC.ExpCompetencies[i].PcoDescription && NonSpace(EEC.ExpCompetencies[i].PcoDescription)>0)?EEC.ExpCompetencies[i].PcoDescription:'&nbsp;')+'</td>';
			htmlStr += '<td class="plaintablecellborder" style="text-align:center;width:14%" nowrap>';
			htmlStr += ((EEC.ExpCompetencies[i].RenewDate && NonSpace(EEC.ExpCompetencies[i].RenewDate)>0)?FormatDte4(EEC.ExpCompetencies[i].RenewDate):getSeaPhrase("CR_45","CR"))+'</td>';
			htmlStr += '</tr>';
		}
		htmlStr += '</table>';
	}
	
	try {
		self.main.document.getElementById("paneBody").style.overflow = "auto";
		if (navigator.appName.indexOf("Microsoft") >= 0) 
		{
			self.main.document.getElementById("expiredCompDtl").innerHTML = htmlStr;	
			self.main.setLayerSizes();
			document.getElementById("main").style.height = "407px";	
		}
		else 
		{
			self.main.document.getElementById("expiredCompDtl").style.height = "307px";
			self.main.document.getElementById("expiredCompDtl").innerHTML = htmlStr;
			document.getElementById("main").style.height = "407px";	
			self.main.setLayerSizes();
			document.getElementById("navarea").style.width = "777px";
		}
		
		self.main.stylePage();
		if (onsort)
		{
			self.main.styleSortArrow("expiredCompTbl", sortField);
		}		
		
		document.getElementById("navarea").innerHTML = uiButton(getSeaPhrase("PRINT","CR"),"printExpiredCompDetail();return false","margin-top:0px;margin-right:0px");
		document.getElementById("navarea").style.top = (Number(document.getElementById("main").style.height.toString().replace("px",""))+32+"px");
		stylePage();
		document.getElementById("navarea").style.visibility = "visible";	
		
		if (EEC.TransactionLimit == 'Y')
		{
			seaAlert(getSeaPhrase("CR_67","CR")) ;
		}
	}
	catch(e) {}
	
	removeWaitAlert();
}

function printExpiredCompDetail()
{
	//PT 160966 made changes to accept the date given in page other than system date while doing print
	var Expired = "";
	var selectedDate = self.main.document.forms[0].elements["throughdate"];
	
	if (NonSpace(selectedDate.value) > 0)
	{
		Expired = selectedDate.value;
	}
	else
	{
		Expired = fmttoday;
	}
	
	var strHtml = self.header.document.body.innerHTML
	+ '<p/>'
	+ '<div class="paneheader" style="background-color:#ffffff;color:#000000">'+getSeaPhrase("CR_42","CR")+' '+Expired+'.</div>'
	+ '<br/>'
	+ self.main.document.getElementById("expiredCompDtl").innerHTML

	try {
		self.printframe.document.getElementById("taskName").innerHTML += ' - ' + EEC.EmployeeLabelName;
	}
	catch(e) {}
	self.printframe.document.title = getSeaPhrase("CR_40","CR");
	self.printframe.document.getElementById("paneBody").innerHTML = strHtml;
	self.printframe.document.getElementById("paneBorder").style.height = "auto";
	self.printframe.document.getElementById("paneBodyBorder").style.height = "auto";	
	self.printframe.focus();
	self.printframe.print();	
}

function LinkToCompetencyProfile(Index)
{
   	showWaitAlert(getSeaPhrase("GATHERING_INFO","CR"));
   	if (self.subtask.location.href.indexOf("ecpmain.htm")==-1) {
   		self.subtask.location.replace("/lawson/xhrnet/credentials/ecpmain.htm?employee="+EEC.ExpCompetencies[Index].Employee);
	}
	else {
		self.subtask.employeeNbr = EEC.ExpCompetencies[Index].Employee;
		self.subtask.Drive();
	}
	document.getElementById("navarea").style.visibility = "hidden";
	document.getElementById("header").style.visibility = "hidden";
	document.getElementById("main").style.visibility = "hidden";
	document.getElementById("subtask").style.visibility = "visible";
}

function sortByName(obj1, obj2)
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

function sortByExpireDate(obj1, obj2)
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

function SortExpiredComps(property)
{
	switch(property) {
		case "LabelName": EEC.ExpCompetencies.sort(sortByName); break;
		case "RenewDate": EEC.ExpCompetencies.sort(sortByExpireDate); break;
		default: return;
	}
	PaintEEC(true, property);
}

function OpenHelpDialog()
{
	openHelpDialogWindow("/lawson/xhrnet/credentials/eclhelp.htm");
}
