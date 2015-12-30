// Version: 8-)@(#)@10.00.02.00.29
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/Attic/goalUtils.js,v 1.1.2.30 2012/06/29 17:24:21 brentd Exp $
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
var relatedLinks;
var isUpdating = false;

function initEmployeeRelatedLinks() {

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
			&& (((bkName == "CAREER MANAGEMENT") && (bkUrl.indexOf("employee") >= 0)) || (bkLawName == "XMLHRCAREERMGMT")
			|| (bkName == "REVIEW HISTORY") ||(bkLawName == "XMLHRREVIEWHISTORY"))) {

				foundBkmk[bkName] = true;
				// grant access to this bookmark
				relatedLinks[relatedLinks.length] = bkmks[i];
				if (relatedLinks.length == 2)
					done = true;
			}
			i++;
		}
	}

	if (relatedLinks.length > 0) {
		relatedLinks.sort(sortByBkmkName);
	}
}

function initManagerRelatedLinks() {

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
			&& (((bkName == "PERFORMANCE MANAGEMENT") || (bkLawName == "XMLHRMGRPERFMGMT"))
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
				tUrl += "&from=goalmgmt";
			} else {
				tUrl += "?from=goalmgmt";
			}
		}
		var tmpWidth = 850;
		var tmpHeight = 650;
		if (document.body.clientHeight)
		{
			tmpHeight = document.body.clientHeight;
			tmpWidth = document.body.clientWidth;
		}
		else if (window.innerHeight)
		{
			tmpHeight = window.innerHeight;
			tmpWidth = window.innerWidth;
		}	
		if (tmpHeight < 650)
			tmpHeight = 650;
		if (tmpWidth < 850)
			tmpWidth = 850;		
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

function displayRelatedLinks() {

	var strBuffer = new Array();
	var overdueReviewExists = false;
	var reviewIndexHighlighted = -1;

	strBuffer[0] = '<div style="padding-top:5px">'
	+ '<table border="0" cellspacing="0" cellpadding="0">'

	if (relatedLinks.length > 0) {
		for (var i=0; i<relatedLinks.length; i++) {

			strBuffer[i+1] = '<tr><td class="plaintablecell">'
			+ '<a href="javascript:void(0);" onclick="parent.launchRelatedLink('+i+');">'
			+ relatedLinks[i].name
			+ '</a>'
			+ '</td></tr>';
		}
	} else {
		strBuffer[1] = '<tr><td class="plaintablecell">'
		+ getSeaPhrase("NO_RELATED_LINK_ACCESS", "ESS")
		+ '</td></tr>';
	}

	strBuffer[strBuffer.length] = '</table></div>';

	self.relatedlinks.document.getElementById("paneHeader").innerHTML = getSeaPhrase("RELATED_LINKS", "ESS");
	self.relatedlinks.document.getElementById("paneBody").innerHTML = strBuffer.join("");
	self.relatedlinks.stylePage();
	self.relatedlinks.setLayerSizes();
	document.getElementById("relatedlinks").style.visibility = "visible";
}

function sortByAPriority(obj1, obj2)
{
	var name1 = obj1.priority;
	var name2 = obj2.priority;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function sortByDPriority(obj1, obj2)
{
	var name1 = obj1.priority;
	var name2 = obj2.priority;
	if (name1 > name2)
		return -1;
	else if (name1 < name2)
		return 1;
	else
		return 0;
}

function sortByAPctComplete(obj1, obj2)
{
	var name1 = obj1.pct_completed;
	var name2 = obj2.pct_completed;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function sortByDPctComplete(obj1, obj2)
{
	var name1 = obj1.pct_completed;
	var name2 = obj2.pct_completed;
	if (name1 > name2)
		return -1;
	else if (name1 < name2)
		return 1;
	else
		return 0;
}

function sortByAEndDate(obj1, obj2)
{
	endDateCorrectFormat1 = fromDMEtoStandard(obj1.end_date);
	endDateCorrectFormat1 = fromStandardtoAGS(endDateCorrectFormat1);
	endDateCorrectFormat2 = fromDMEtoStandard(obj2.end_date);
	endDateCorrectFormat2 = fromStandardtoAGS(endDateCorrectFormat2);

	var name1 = endDateCorrectFormat1;
	var name2 = endDateCorrectFormat2;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function sortByDEndDate(obj1, obj2)
{
	endDateCorrectFormat1 = fromDMEtoStandard(obj1.end_date);
	endDateCorrectFormat1 = fromStandardtoAGS(endDateCorrectFormat1);
	endDateCorrectFormat2 = fromDMEtoStandard(obj2.end_date);
	endDateCorrectFormat2 = fromStandardtoAGS(endDateCorrectFormat2);

	var name1 = endDateCorrectFormat1;
	var name2 = endDateCorrectFormat2;

	if (name1 > name2)
		return -1;
	else if (name1 < name2)
		return 1;
	else
		return 0;
}

function drawDependentsSelect(selectArray, selectedEmployee) {

	if (typeof(selectedEmployee) == "undefined")
	{
		selectedEmployee = -1;
	}

	var constructCodes = '<option>'+' ';

	for (var i=0; i<selectArray.length; i++) {

		constructCodes +=  '<option value="';

		constructCodes += selectArray[i].employee+'"';

		if (Number(selectedEmployee) == Number(selectArray[i].employee)) {
			constructCodes += ' selected';
		}

		constructCodes += '>'

		constructCodes += selectArray[i].full_name;
	}

	return constructCodes;
}

function drawEmployeeReviews(selectArray) {

	var constructCodes = '<option>'+' ';
	var selectedValue = -1;

	for(i=0;i<selectArray.length;i++) {

		constructCodes +=  '<option value="';

		constructCodes += selectArray[i].seq_nbr+'"';

		((selectedValue==selectArray[i].seq_nbr) ? constructCodes += ' selected>' : constructCodes += '>');

		constructCodes += selectArray[i].sched_date + " " + selectArray[i].code;
	}

	return constructCodes;
}

function dropdownObject(value, description) {
	this.value = value;
	this.description = description;
}

function drawObjectiveTypeSelect(selectedObjectiveType) {

	var objectiveTypes = new Array(
		new dropdownObject(CURRENT, getSeaPhrase("CURRENT_OBJECTIVES", "ESS")),
		new dropdownObject(HISTORICAL, getSeaPhrase("COMPLETED_OBJECTIVES", "ESS")),
		new dropdownObject(ONHOLD, getSeaPhrase("ONHOLD_OBJECTIVES", "ESS")),
		new dropdownObject(INACTIVE, getSeaPhrase("INACTIVE_OBJECTIVES", "ESS"))
	);
	
	var constructCodes = '<option>'+' ';

	for(i=0;i<objectiveTypes.length;i++) {

		var ot = objectiveTypes[i];
		constructCodes +=  '<option value="';

		constructCodes += ot.value + '"';

		if ((typeof(selectedObjectiveType) != "undefined") && (ot.value == selectedObjectiveType)) {
			constructCodes += ' selected';
		}

		constructCodes += '>'

		constructCodes += ot.description;
	}

	return constructCodes;
}

function drawSelect(selectedValue, selectArray) {

	var constructCodes = '<option>'+' ';
	var g;
	for(i=0;i<selectArray.length;i++) {
		//Adjust for skewed hold and inactive database storing 3, and 4 mapped to 6 and 8
		g = i;
		if(i == 3 || i == 4) {
			g = 2*i;
		}

		constructCodes +=  '<option value="';
		constructCodes += i+'"';
		((selectedValue==g) ? constructCodes += ' selected>' : constructCodes += '>');
		constructCodes += selectArray[i];
	}

		return constructCodes;
}

function drawSelectNoBlankStart(selectedValue, selectArray) {

	var constructCodes = ' ';

	for(i=0;i<selectArray.length;i++) {
		constructCodes +=  '<option value="';
		constructCodes += i+'"';
		((selectedValue==i) ? constructCodes += ' selected>' : constructCodes += '>');
		constructCodes += selectArray[i];
	}

	return constructCodes;
}

function drawPcodesSelect(selectedValue, selectArray) {

	var constructCodes = '<option>'+' ';
	
	for(i=0;i<selectArray.length;i++) {

		constructCodes +=  '<option value="';
		constructCodes += selectArray[i].code+'"';
		((selectedValue==selectArray[i].code) ? constructCodes += ' selected>' : constructCodes += '>');
		constructCodes += selectArray[i].code;
	}

	return constructCodes;
}

function OpenHelpDialog(windowName)
{
	try {
		if(windowName == "left") {
			openHelpDialogWindow("/lawson/xhrnet/goalViewHelp.html");
		}
		else {
			openHelpDialogWindow("/lawson/xhrnet/goalEditHelp.html");
		}
	}
	catch(e) {
		seaAlert("ERROR:OpenHelpDialog: "+e);
	}

}

function closeView(whichPane) {
	document.getElementById(whichPane).style.visibility = "hidden";
	undoRowFormatting();
	if (whichPane == "right")
	{
		self.left.addHelpIcon();
	}
}

function myStringBuffer() {
  	this.buffer = [];
}

/* adds the string to the buffer array */
myStringBuffer.prototype.append = function append(string) {
   	this.buffer.push(string);
   	return this;
}

/* Overrides toString method, runs toString String method on all elements and concats with seperator */
myStringBuffer.prototype.toString = function toString() {
	return this.buffer.join("");
}

function overDueNotice(endDate) {

	endDateCorrectFormat = fromDMEtoStandard(endDate);
	endDateCorrectFormat = fromStandardtoAGS(endDateCorrectFormat);

	var overDue = false;

	if(endDateCorrectFormat < authUser.date) {
		overDue = true;
	}

	return overDue;
}

function openView(whichView) {

	atts[0] = null;
	atts[1] = null;

	document.getElementById("right").style.visibility = "hidden";
	isUpdating = false;

	var viewToShow = whichView;

	getPaempgoal(viewToShow);
	if (parentTask == "") {
		displayRelatedLinks();
	}
}

function doRowFormating(i) {

	activateTableRow("objTbl", i, self.left, false, true);
}

function undoRowFormatting() {

	deactivateTableRows("objTbl", self.left, false, true);
}

function showEditView() {

	self.right.stylePage();
	document.getElementById("right").style.visibility = "visible";
}
