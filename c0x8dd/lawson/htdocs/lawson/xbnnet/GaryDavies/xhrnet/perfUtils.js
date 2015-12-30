// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/Attic/perfUtils.js,v 1.1.2.19 2011/07/01 21:27:03 brentd Exp $
var HR90_DTL_FIELD_SIZE = 60;
var HR90_NBR_DETAIL_LINES = 11;
var attachWin;
var relatedLinks;

function initRelatedLinks() {

	relatedLinks = new Array();

   	if ((typeof(authUser) != "undefined") && authUser.OfficeObject) {
   	
		var bkmks = authUser.OfficeObject;
		var foundBkmk = new Array();

		var i = 0;
		var done = false;
		while ((i < authUser.NbrOfOfficeObj) && (!done))
		{
			var bkName = bkmks[i].name.toUpperCase(); // the Lawson-assigned task
			var bkLawName = (bkmks[i].lawnm) ? bkmks[i].lawnm.toUpperCase() : "";	// the Lawson-assigned Lawson name
			var bkUrl = bkmks[i].url;
			
			if ((!foundBkmk[bkName])
			&& ((((bkName == "GOALVIEW") && (bkUrl.indexOf("manager") >= 0)) || (bkLawName == "XMLHRMGRGOALMGMT"))
			|| (((bkName == "CAREER MANAGEMENT") && (bkUrl.indexOf("manager") >= 0)) || (bkLawName == "XMLHRMCAREERMGMT"))
			|| ((bkName.indexOf("TALENTVIEW") >= 0) || (bkLawName == "XMLHRMGRTALENTVIEW")))) {
			
				foundBkmk[bkName] = true;
				// grant access to this bookmark
				relatedLinks[relatedLinks.length] = bkmks[i];
				if ((bkName.indexOf("TALENTVIEW") >= 0) || (bkLawName == "XMLHRMGRTALENTVIEW")) {
					relatedLinks[relatedLinks.length-1].name = getSeaPhrase("TALENTVIEW", "ESS");
				}				
				if (relatedLinks.length == 3) {
					done = true;
				}	
			}
			i++;
		}
	}
	
	if (relatedLinks.length > 0) {
		relatedLinks.sort(sortByBkmkName);	
	}
}

function sortByBkmkName(obj1, obj2) {

	var name1 = obj1.name;
	var name2 = obj2.name;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function launchRelatedLink(i) {

	if ((typeof(relatedLinks) != "undefined") && (i < relatedLinks.length)) {	
		
		var tUrl = relatedLinks[i].url;
		var tName = relatedLinks[i].name.toUpperCase();
		var tLawnm = (relatedLinks[i].lawnm) ? relatedLinks[i].lawnm.toUpperCase() : "";
		
		if ((tName.indexOf("TALENTVIEW") == -1) && (tLawnm != "XMLHRMGRTALENTVIEW")) {
			if (tUrl.indexOf("?") >= 0) {
				tUrl += "&from=perfmgmt";
			} else {
				tUrl += "?from=perfmgmt";
			}
		}
		var tmpWidth = (screen.width < 850) ? 850 : screen.width;
		var tmpHeight = (screen.height < 600) ? 650 : screen.height;
		var tmpParams = "width=" + tmpWidth + ",height=" + tmpHeight + ",resizable=yes";
		if (tmpWidth == screen.width) {
			tmpParams += ",left=0";
		}
		if (tmpHeight == screen.height) {
			tmpParams += ",top=0";	
		}	
		window.open(tUrl, tLawnm, tmpParams);		
	}
}

function initSortFields() {

	dmeSortFields.add('sched_date');
	dmeSortFields.setSortAscFunction('sched_date', sortByAscSchedDate);
	dmeSortFields.setSortDescFunction('sched_date', sortByDescSchedDate);
	dmeSortFields.add('actual_date');
	dmeSortFields.setSortAscFunction('actual_date', sortByAscCompleteDate);
	dmeSortFields.setSortDescFunction('actual_date', sortByDescCompleteDate);
}

//-----------------------------------------------------------------------------
//-- start SortFields object code
function sortField(fld, dir) {
	this.field = fld;
	this.direction = (dir) ? dir : "ascending";
	this.sortAscFunc = null;
	this.sortDescFunc = null;
	this.recs = null;
}

function SortFields() {
	this.fields = new Array();
}

//-----------------------------------------------------------------------------
SortFields.prototype.get = function(fld)
{
	if (this.fields[fld])
		return this.fields[fld];
	else
		return nulll;
}

//-----------------------------------------------------------------------------
SortFields.prototype.add = function(fld, dir)
{
	this.fields[fld] = new sortField(fld, dir);
}

//-----------------------------------------------------------------------------
SortFields.prototype.setDirection = function(fld, dir)
{
	this.fields[fld].direction = dir;
}

//-----------------------------------------------------------------------------
SortFields.prototype.getDirection = function(fld)
{
	return this.fields[fld].direction;
}

//-----------------------------------------------------------------------------
SortFields.prototype.setSortAscFunction = function(fld, func)
{
	this.fields[fld].sortAscFunc = func;
}

//-----------------------------------------------------------------------------
SortFields.prototype.getSortAscFunction = function(fld)
{
	return this.fields[fld].sortAscFunc;
}

//-----------------------------------------------------------------------------
SortFields.prototype.setSortDescFunction = function(fld, func)
{
	this.fields[fld].sortDescFunc = func;
}

//-----------------------------------------------------------------------------
SortFields.prototype.getSortDescFunction = function(fld)
{
	return this.fields[fld].sortDescFunc;
}

//-----------------------------------------------------------------------------
SortFields.prototype.setRecords = function(fld, recs)
{
	this.fields[fld].recs = recs;
}

//-----------------------------------------------------------------------------
SortFields.prototype.getRecords = function(fld)
{
	return this.fields[fld].recs;
}

//-----------------------------------------------------------------------------
SortFields.prototype.sort = function(fld)
{
	try {
		if (!this.fields[fld]) {
			this.add(fld);
		}

		var sortFld = this.fields[fld];

		if (sortFld.direction == "ascending") {
			sortFld.recs.sort(sortFld.sortDescFunc);
			sortFld.direction = "descending";
		} else {
			sortFld.recs.sort(sortFld.sortAscFunc);
			sortFld.direction = "ascending";
		}

		return sortFld.recs;

	} catch(e) {
		return null;
	}
}

function OpenHelpDialog(windowName) {

	try {
		if (windowName == "left") {
			openHelpDialogWindow("/lawson/xhrnet/perfViewHelp.html");
		} else {
			openHelpDialogWindow("/lawson/xhrnet/perfEditHelp.html");
		}
	} catch(e) {
		seaAlert("ERROR:OpenHelpDialog: "+e);
	}

}

function drawReportsSelect(selectArray, selectedReport) {

	var strBuffer = new Array();
	var len = selectArray.length;

	strBuffer[0] = '<option> ';

	for (var i=0; i<len; i++) {

		strBuffer[i+1] = '<option value="' + selectArray[i].employee + '"';
		if ((typeof(selectedReport) != "undefined") && (Number(selectArray[i].employee) == Number(selectedReport))) {
			strBuffer[i+1] += ' selected';
		}
		strBuffer[i+1] += '>' + selectArray[i].full_name;
	}

	return strBuffer.join("");
}

function dropdownObject(value, description) {
	this.value = value;
	this.description = description;
}

function drawReviewTypeSelect(revTypes, selectedReviewType) {
	
	var reviewTypes;
	
	if (typeof(revTypes) != "undefined") {
		reviewTypes = revTypes;
	} else {
		reviewTypes = new Array(
			new dropdownObject("current", getSeaPhrase("CURRENT", "ESS")),
			new dropdownObject("overdue", getSeaPhrase("OVERDUE_STATUS", "ESS")),
			new dropdownObject("completed", getSeaPhrase("COMPLETED", "ESS")),
			new dropdownObject("all", getSeaPhrase("ALL", "ESS"))
		);
	}	
	var strBuffer = new Array();

	strBuffer[0] = '<option> ';

	for (var i=0; i<reviewTypes.length; i++) {

		var rt = reviewTypes[i];
		strBuffer[i+1] = '<option value="' + rt.value + '"';
		if ((typeof(selectedReviewType) != "undefined") && (reviewTypes[i].value == selectedReviewType)) {
			strBuffer[i+1] += ' selected';
		}
		strBuffer[i+1] += '>' + rt.description;
	}

	return strBuffer.join("");
}

function drawScheduleSelect(value) {

	var schedules = new Array(
		new dropdownObject("AN", getSeaPhrase("RENEWAL_CODE_8", "ESS")),
		new dropdownObject("9M", getSeaPhrase("RENEWAL_CODE_11", "ESS")),
		new dropdownObject("SA", getSeaPhrase("RENEWAL_CODE_10", "ESS")),
		new dropdownObject("QT", getSeaPhrase("RENEWAL_CODE_9", "ESS")),
		new dropdownObject("MO", getSeaPhrase("MONTHLY", "ESS"))
	);
	var strBuffer = new Array();

	strBuffer[0] = '<option> ';

	for (var i=0; i<schedules.length; i++) {

		var sc = schedules[i];
		strBuffer[i+1] = '<option value="' + sc.value + '"'
		if (value == sc.value) {
			strBuffer[i+1] += ' selected';
		}
		strBuffer[i+1] += '>' + sc.description;
	}

	return strBuffer.join("");
} 

function drawScheduleNextReviewSelect(value) {

	var schedules = new Array(
		new dropdownObject("N", getSeaPhrase("NEXT_REVIEW_NO", "ESS")),
		new dropdownObject("Y", getSeaPhrase("NEXT_REVIEW_YES", "ESS"))
	);
	var strBuffer = new Array();

	strBuffer[0] = '<option> ';

	for (var i=0; i<schedules.length; i++) {

		var sc = schedules[i];
		strBuffer[i+1] = '<option value="' + sc.value + '"'
		if (value == sc.value) {
			strBuffer[i+1] += ' selected';
		}
		strBuffer[i+1] += '>' + sc.description;
	}

	return strBuffer.join("");
}

function sortByAscSchedDate(obj1, obj2)
{
	var name1 = obj1.sched_date;
	var name2 = obj2.sched_date;
	var endDateCorrectFormat1
	var endDateCorrectFormat2

	if (name1 != "") {
		endDateCorrectFormat1 = fromDMEtoStandard(obj1.sched_date);
		endDateCorrectFormat1 = fromStandardtoAGS(endDateCorrectFormat1);
		name1 = endDateCorrectFormat1;
	} else {
		name1 = "00000000";
	}

	if (name2 != "") {
		endDateCorrectFormat2 = fromDMEtoStandard(obj2.sched_date);
		endDateCorrectFormat2 = fromStandardtoAGS(endDateCorrectFormat2);
		name2 = endDateCorrectFormat2;
	} else {
		name2 = "00000000";
	}

	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function sortByDescSchedDate(obj1, obj2)
{
	var name1 = obj1.sched_date;
	var name2 = obj2.sched_date;
	var endDateCorrectFormat1
	var endDateCorrectFormat2

	if (name1 != "") {
		endDateCorrectFormat1 = fromDMEtoStandard(obj1.sched_date);
		endDateCorrectFormat1 = fromStandardtoAGS(endDateCorrectFormat1);
		name1 = endDateCorrectFormat1;
	} else {
		name1 = "00000000";
	}

	if (name2 != "") {
		endDateCorrectFormat2 = fromDMEtoStandard(obj2.sched_date);
		endDateCorrectFormat2 = fromStandardtoAGS(endDateCorrectFormat2);
		name2 = endDateCorrectFormat2;
	} else {
		name2 = "00000000";
	}

	if (name1 > name2)
		return -1;
	else if (name1 < name2)
		return 1;
	else
		return 0;
}

function sortByAscCompleteDate(obj1, obj2)
{
	var name1 = obj1.actual_date;
	var name2 = obj2.actual_date;
	var endDateCorrectFormat1
	var endDateCorrectFormat2

	if (name1 != "") {
		endDateCorrectFormat1 = fromDMEtoStandard(obj1.actual_date);
		endDateCorrectFormat1 = fromStandardtoAGS(endDateCorrectFormat1);
		name1 = endDateCorrectFormat1;
	} else {
		name1 = "00000000";
	}

	if (name2 != "") {
		endDateCorrectFormat2 = fromDMEtoStandard(obj2.actual_date);
		endDateCorrectFormat2 = fromStandardtoAGS(endDateCorrectFormat2);
		name2 = endDateCorrectFormat2;
	} else {
		name2 = "00000000";
	}

	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function sortByDescCompleteDate(obj1, obj2)
{
	var name1 = obj1.actual_date;
	var name2 = obj2.actual_date;
	var endDateCorrectFormat1
	var endDateCorrectFormat2

	if (name1 != "") {
		endDateCorrectFormat1 = fromDMEtoStandard(obj1.actual_date);
		endDateCorrectFormat1 = fromStandardtoAGS(endDateCorrectFormat1);
		name1 = endDateCorrectFormat1;
	} else {
		name1 = "00000000";
	}

	if (name2 != "") {
		endDateCorrectFormat2 = fromDMEtoStandard(obj2.actual_date);
		endDateCorrectFormat2 = fromStandardtoAGS(endDateCorrectFormat2);
		name2 = endDateCorrectFormat2;
	} else {
		name2 = "00000000";
	}

	if (name1 > name2)
		return -1;
	else if (name1 < name2)
		return 1;
	else
		return 0;
}

var dmeSortFields = new SortFields();

function validateNumeric(textBox, size, decimals) {

	var formattedValue = formatNumeric(textBox.value, decimals);
	if (!isNaN(formattedValue)) {
		textBox.value = formattedValue;
	}
	
	if ((NonSpace(textBox.value) > 0) && (ValidNumber(textBox, size, decimals) == false)) {
		if ((Number(decimals) == 0) && (size == 3)) {
			seaAlert(getSeaPhrase("INVALID_INTEGER", "ESS"));
		} else {
			seaAlert(getSeaPhrase("INVALID_NO", "ESS"));
		}
		setRequiredField(textBox);
		textBox.focus();
		textBox.select();
		return false;
	} else {
		clearRequiredField(textBox);
	}
	return true;
}

/* Filter Select logic - start */
function performDmeFieldFilterOnLoad(dmeFilter)
{
	switch (dmeFilter.getFieldNm().toLowerCase())
	{
		case "reviewtype":
		case "nextreviewtype":
			dmeFilter.addFilterField("code", 10, getSeaPhrase("STATUS", "ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2", "ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes",
				"pcoset1",
				"code;description",
				"RT",
				"active",
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;
		case "reviewer":
			dmeFilter.addFilterField("process-level", 5, getSeaPhrase("PROCESS_LEVEL_CODE","ESS"), true);
			dmeFilter.addFilterField("department", 5, getSeaPhrase("DEPARTMENT_CODE","ESS"), true);
			dmeFilter.addFilterField("employee", 10, getSeaPhrase("EMPLOYEE_NUMBER", "ESS"), true, true);
			dmeFilter.addFilterField("label-name-1", 54, getSeaPhrase("EMPLOYEE_NAME", "ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"employee",
				"empset2",
				"process-level;department;employee;label-name-1;first-name;last-name",
				String(authUser.company),
				null,
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;
		case "rating":
			dmeFilter.addFilterField("code", 10, getSeaPhrase("OVERALL_RATING", "ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2", "ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes",
				"pcoset1",
				"code;description",
				"PR",
				"active",
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;
		default: break;
	}
}

function performDmeFieldFilter(dmeFilter)
{
	switch (dmeFilter.getFieldNm().toLowerCase())
	{
		case "reviewtype":
		case "nextreviewtype":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes",
			"pcoset1",
			"code;description",
			"RT",
			"active",
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;
		case "reviewer":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"employee",
			"empset2",
			"process-level;department;employee;label-name-1;first-name;last-name",
			String(authUser.company),
			null,
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;
		case "rating":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes",
			"pcoset1",
			"code;description",
			"PR",
			"active",
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;
		default: break;
	}
}

function validateDmeFieldFilter(dmeFilter, filterForm)
{
	var selObj = filterForm.elements["filterField"];
	var filterField = selObj.options[selObj.selectedIndex];
	
	var keywords = filterForm.elements["keywords"].value;
	
	if (filterField.getAttribute("isNumeric") == "true") {
	
		if (ValidNumber(filterForm.elements["keywords"], filterField.getAttribute("fieldSize"), 0) == false) 
		{
			dmeFilter.getWindow().seaAlert(getSeaPhrase("INVALID_NO", "ESS"));
			filterForm.elements["keywords"].select();
			filterForm.elements["keywords"].focus();
			return false;	
		}
	}

	return true;
}

function dmeFieldRecordSelected(recIndex, fieldNm)
{
	var selRec = self.jsreturn.record[recIndex];

	switch(fieldNm.toLowerCase())
	{
		case "reviewtype":
			self.right.document.forms["detailform"].elements["reviewType"].value = selRec.code;
			try {
				self.right.document.getElementById("reviewTypeDesc").innerHTML = selRec.description;
			} catch(e) {}
			break;
		case "reviewer":
			self.right.document.forms["detailform"].elements["reviewer"].value = Number(selRec.employee);
			try {
				self.right.document.getElementById("reviewerDesc").innerHTML = selRec.first_name + " " + selRec.last_name;
			} catch(e) {}
		break;
		case "rating":
			self.right.document.forms["detailform"].elements["rating"].value = selRec.code;
			try {
				self.right.document.getElementById("ratingDesc").innerHTML = selRec.description;
			} catch(e) {}
		break;
		case "nextreviewtype":
			self.right.document.forms["detailform"].elements["nextReviewType"].value = selRec.code;
			try {
				self.right.document.getElementById("nextReviewTypeDesc").innerHTML = selRec.description;
			} catch(e) {}
			break;
		default:
		break;
	}
	try
	{
		filterWin.close();
	} catch(e) {}
}

function getDmeFieldElement(fieldNm)
{
	var fld = [null, null];
	switch(fieldNm.toLowerCase())
	{
		case "reviewtype":
			fld = [self.right, self.right.document.forms["detailform"].elements["reviewType"]];
		break;
		case "reviewer":
			fld = [self.right, self.right.document.forms["detailform"].elements["reviewer"]];
		break;
		case "rating":
			fld = [self.right, self.right.document.forms["detailform"].elements["rating"]];
		break;
		case "nextreviewtype":
			fld = [self.right, self.right.document.forms["detailform"].elements["nextReviewType"]];
		break;
		default:
		break;
	}
	return fld;
}

function drawDmeFieldFilterContent(dmeFilter)
{
	var selectHtml = new Array();
	var dmeRecs = self.jsreturn.record;
	var nbrDmeRecs = dmeRecs.length;
	var fieldNm = dmeFilter.getFieldNm().toLowerCase();

	switch(fieldNm)
	{
		case "reviewtype":
		case "nextreviewtype":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
			selectHtml[0] += '<tr><th style="width:50%">'+getSeaPhrase("STATUS","ESS")+'</th>'
			selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

			for (var i=0; i<nbrDmeRecs; i++)
			{
				tmpObj = dmeRecs[i];
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.code) ? tmpObj.code : '&nbsp;'
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</td></tr>'
			}

			if (nbrDmeRecs == 0)
			{
				selectHtml[1] = '<tr class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'
				selectHtml[1] += getSeaPhrase("NORECS","ESS");
				selectHtml[1] += '</td></tr>'
			}

			selectHtml[selectHtml.length] = '</table>'
		break;
		case "reviewer":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
			selectHtml[0] += '<tr><th style="width:25%">'+getSeaPhrase("PROCESS_LEVEL_CODE", "ESS")+'</th>'
			selectHtml[0] += '<th style="width:25%">'+getSeaPhrase("DEPARTMENT_CODE", "ESS")+'</th>'
			selectHtml[0] += '<th style="width:25%">'+getSeaPhrase("EMPLOYEE_NUMBER", "ESS")+'</th>'
			selectHtml[0] += '<th style="width:25%">'+getSeaPhrase("EMPLOYEE_NAME", "ESS")+'</th></tr>'

			for (var i=0; i<nbrDmeRecs; i++)
			{
				tmpObj = dmeRecs[i];
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.process_level) ? tmpObj.process_level : '&nbsp;'
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.department) ? tmpObj.department : '&nbsp;'
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.employee) ? tmpObj.employee : '&nbsp;'
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.label_name_1) ? tmpObj.label_name_1 : '&nbsp;'
				selectHtml[i+1] += '</td></tr>'
			}

			if (nbrDmeRecs == 0)
			{
				selectHtml[1] = '<tr class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="4" nowrap>'
				selectHtml[1] += getSeaPhrase("NORECS","ESS");
				selectHtml[1] += '</td></tr>'
			}

			selectHtml[selectHtml.length] = '</table>'
		break;
		case "rating":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
			selectHtml[0] += '<tr><th style="width:50%">'+getSeaPhrase("OVERALL_RATING","ESS")+'</th>'
			selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

			for (var i=0; i<nbrDmeRecs; i++)
			{
				tmpObj = dmeRecs[i];
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.code) ? tmpObj.code : '&nbsp;'
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</td></tr>'
			}

			if (nbrDmeRecs == 0)
			{
				selectHtml[1] = '<tr class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'
				selectHtml[1] += getSeaPhrase("NORECS","ESS");
				selectHtml[1] += '</td></tr>'
			}

			selectHtml[selectHtml.length] = '</table>'
		break;
	}
	dmeFilter.getRecordElement().innerHTML = selectHtml.join("");
	try
	{
		if (typeof(parent.removeWaitAlert) != "undefined")
			parent.removeWaitAlert();
		removeWaitAlert();
	} catch(e) {}
}
/* Filter Select logic - end */

function blankOutDescription(descId) {

	try {
		self.right.document.getElementById(descId).innerHTML = "";
	} catch(e) {}
}

function launchReviewDocument(i) {
		
	var reportSelect = self.top1.document.forms["topForm"].elements["directReport"];
	var reviewRecord = reviewRecords[i];

	var pAttachObj 		= new GETATTACHObject(authUser.prodline, "REVIEW");
	pAttachObj.index 	= "REVSET5";
	pAttachObj.rectype  = "U";
	pAttachObj.usertype = "D";
	pAttachObj.key 		= "K1=" + Number(authUser.company) + "&K2=" + Number(reportSelect.options[reportSelect.selectedIndex].value)
						+ "&K3=" + formjsDate(reviewRecords[i].sched_date) + "&K4=" + escape(reviewRecords[i].code, 1)
						+ "&K5=" + Number(reviewRecords[i].seq_nbr)
	pAttachObj.out 		= "JS";
	pAttachObj.opm 		= "T";
	pAttachObj.data 	= "TRUE";
	pAttachObj.stat 	= "TRUE";
	pAttachObj.header 	= "TRUE";
	pAttachObj.encode 	= "FALSE";
	pAttachObj.debug 	= false;
	pAttachObj.func 	= "reviewDocumentRetrieved";
	
	setTimeout(function() { GETATTACH(pAttachObj, "jsreturn"); }, 10);
}

function reviewDocumentRetrieved() {

	var urlStr = "";
	var origUrlStr = "";
	
	if (self.jsreturn.UrlData.length > 0) {
//PT165302
		urlStr = self.jsreturn.UrlData[0].join("");
		origUrlStr = urlStr;
		// strip the leading forward slash if it exists
		if (origUrlStr.indexOf("/") == 0)
			origUrlStr = origUrlStr.substring(1);
	}

	// if this is a relative URL, try loading under the Portal directory and xhrnet directories
	if (urlStr && urlStr.indexOf(location.protocol) != 0 && isUrlRelative(urlStr)) {
	
		urlStr = origUrlStr;
		
		// try loading the file under the Portal drill directory
		var portalPath = "/lawson/portal";
		try {
			var tmpPath = profileHandler.portalWnd.lawsonPortal.path;
			if (tmpPath) {
				portalPath = tmpPath;
			}
		} catch(e) {}
		
		urlStr = location.protocol + "//" + location.host + portalPath + "/drill/" + urlStr;			
		
		if (!urlFileExists(urlStr)) {
			urlStr = origUrlStr; // reset the URL string
			
			// strip the leading slash if it exists
			if (urlStr.indexOf("/") == 0) {
				urlStr = urlStr.substring(1);			
			}
			
			// try loading the file under the careermanagement directory
			urlStr = location.protocol + "//" + location.host + "/lawson/xhrnet/" + urlStr;
			
			// if all else fails, try loading the file from the WEBDIR
			if (!urlFileExists(urlStr)) {
				urlStr = origUrlStr; // reset the URL string
			
				// strip the leading slash if it exists
				if (urlStr.indexOf("/") == 0) {
					urlStr = urlStr.substring(1);				
				}	
				urlStr = location.protocol + "//" + location.host + "/" + urlStr;
			}
		}
	}	

	if (typeof(parent.removeWaitAlert) != "undefined") {
		parent.removeWaitAlert();
	}	
	removeWaitAlert();
	
	if (urlStr) {
		
		var leftPos = parseInt((screen.width / 2) - 400, 10);
		var topPos = parseInt((screen.height / 2) - 350, 10);
		
		try {
			attachWin.focus();
			attachWin.close();
		} catch(e) {}	
		attachWin = window.open(urlStr, "attachWin",
			"resizable=yes,scrollbars=yes,toolbar=yes,location=yes,menubar=yes,status=yes,width=800,height=600" +
			",left=" + leftPos + ",top=" + topPos + ",screenX=" + leftPos + ",screenY=" + topPos);
        	try {
        		attachWin.focus();	
		} catch(e) {}
	} else {
		seaAlert(getSeaPhrase("NO_DOCUMENTATION_FOUND", "ESS"));	
	}
}

function isUrlRelative(urlStr) {
    var v = new RegExp();
    v.compile("^[A-Za-z]+:\/\/");
    if (v.test(urlStr)) {
        return false;
    }
    return true;
} 

function urlFileExists(urlStr, fileType, outType)
{        
	try {	
		// what version of IOS do I call?
		if (iosHandler.getIOSVersion() != null) {				
			// check for SSO
			if (iosHandler.isSSOFileLoaded()) {			
				var urlRes = SSORequest(urlStr, null, null, "text/plain");
				// do this for Netscape
				if (urlRes == null) {
					return false;
				}
				
				if ((urlRes.status == 404) || (urlRes.status == 500)) {
					return false;
				} else {
					return true;
				}
			} else {
				var urlRes = SEARequest(urlStr, null, null, "text/plain");
				if (urlRes.status == 404 || urlRes.status == 500) {
					return false;
				} else {
					return true;
				}
			}
		}
	} catch(e) {}
	
	return false;
}

function highlightFieldInError(fldNm) {

	try {
		fldNm = fldNm.toString().toUpperCase();
		
		switch(fldNm) {
			case "REV-CODE":
				fldObj = self.right.document.forms["detailform"].elements["reviewType"];
				setRequiredField(fldObj);
				fldObj.focus();
				fldObj.select();				
				break;
			case "REV-DESCRIPTION":
				fldObj = self.right.document.forms["detailform"].elements["description"];
				setRequiredField(fldObj);
				fldObj.focus();
				fldObj.select();				
				break;				
			case "REV-SCHED-DATE":
				fldObj = self.right.document.forms["detailform"].elements["scheduleDate"];
				setRequiredField(fldObj);
				fldObj.focus();
				fldObj.select();				
				break;
			case "REV-ACTUAL-DATE":
				fldObj = self.right.document.forms["detailform"].elements["reviewDate"];
				setRequiredField(fldObj);
				fldObj.focus();
				fldObj.select();				
				break;	
			case "REV-BY-EMPLOYEE":
				fldObj = self.right.document.forms["detailform"].elements["reviewer"];
				setRequiredField(fldObj);
				fldObj.focus();
				fldObj.select();				
				break;
			case "REV-MODEL-NAME":
				fldObj = self.right.document.forms["detailform"].elements["modelName"];
				setRequiredField(fldObj);
				fldObj.focus();
				fldObj.select();				
				break;				
			case "REV-PERCENTILE":
				fldObj = self.right.document.forms["detailform"].elements["perfRanking"];
				setRequiredField(fldObj);
				fldObj.focus();
				fldObj.select();
				break;
			case "REV-PERF-SCORE":
				fldObj = self.right.document.forms["detailform"].elements["perfScore"];
				setRequiredField(fldObj);
				fldObj.focus();
				fldObj.select();
				break;
			case "REV-PERF-WEIGHTING":
				fldObj = self.right.document.forms["detailform"].elements["perfWeighting"];
				setRequiredField(fldObj);
				fldObj.focus();
				fldObj.select();
				break;
			case "REV-GOAL-SCORE":
				fldObj = self.right.document.forms["detailform"].elements["goalScore"];
				setRequiredField(fldObj);
				fldObj.focus();
				fldObj.select();
				break;
			case "REV-GOAL-WEIGHTING":
				fldObj = self.right.document.forms["detailform"].elements["goalWeighting"];
				setRequiredField(fldObj);
				fldObj.focus();
				fldObj.select();
				break;	
			case "REV-TOTAL-SCORE":
				fldObj = self.right.document.forms["detailform"].elements["overallPerfScore"];
				setRequiredField(fldObj);
				fldObj.focus();
				fldObj.select();
				break;	
			case "REV-RATING":
				fldObj = self.right.document.forms["detailform"].elements["rating"];
				setRequiredField(fldObj);
				fldObj.focus();
				fldObj.select();
				break;	
			case "REV-REV-SCHEDULE":
				setRequiredField(self.right.document.getElementById("scheduleCell"));
				self.right.document.forms["detailform"].elements["schedule"].focus();
				break;
			case "REV-NEXT-REVIEW":
				fldObj = self.right.document.forms["detailform"].elements["nextReviewDate"];
				setRequiredField(fldObj);
				fldObj.focus();
				fldObj.select();
				break;
			case "REV-NEXT-REV-CODE":
				fldObj = self.right.document.forms["detailform"].elements["nextReviewType"];
				setRequiredField(fldObj);
				fldObj.focus();
				fldObj.select();
				break;
			case "SCHED-NEXT-REV":
				setRequiredField(self.right.document.getElementById("scheduleNextReviewCell"));
				self.right.document.forms["detailform"].elements["scheduleNextReview"].focus();
				break;				
			default: break;
		}
	} catch(e) {}
}
	
// Return a date string in YYYYMMDD format that is nbrDays prior or following parameter dateStr in YYYYMMDD format.	
function getDateDaysFrom(dateStr, nbrDays) {

	dateStr = dateStr.toString();
	nbrDays = parseInt(nbrDays, 10);
	
	if (isNaN(nbrDays)) {
		nbrDays = 0;
	}
	
	try {
		var year = dateStr.substring(0, 4);
		var month = dateStr.substring(4, 6);
		var day = parseFloat(dateStr.substring(6, 8));
		var dateObj = new Date(year, month - 1, day);
	
		dateObj.setDate(dateObj.getDate() + nbrDays);
		year = dateObj.getFullYear().toString();
		month = (dateObj.getMonth() + 1).toString();
		day = dateObj.getDate().toString();
		
		if (month.toString().length == 1) {
			month = "0" + month;
		}
		
		if (day.toString().length == 1) {
			day = "0" + day;
		}
		
		return (year + month + day);
	
	} catch(e) {
		return dateStr;
	}
}
	
