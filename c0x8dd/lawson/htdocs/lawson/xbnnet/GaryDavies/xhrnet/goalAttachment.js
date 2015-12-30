var atts = new Array(); // global array of attachments, one for each unique PAEMPGOAL record

var multipleAtts = new Array();
var fromRefreshForm = false;
var fromFirstRefresh = false;
var calledGetAttachment = false;
var attachFrame;
var func1 = null;
var actionGlobal = null;

function evalOpenView(funcToCall)
{
	if(func1 != null) {
		var tempStore = func1;
		func1 = null;
		eval(tempStore);
		}
}

function refreshForm(prodline,company, employee, seqNbr)
{
	if(actionGlobal == "D") {
		evalOpenView(func1);
		actionGlobal = null;
	}
	fromRefreshForm = true;
	var goalform = right.document.forms["goalform"];
	getAttachment(prodline, company, employee, seqNbr, "jsreturn2");
}

function getAttachment(prodline, company, employee, seqNbr, frameStr)
{
	frameStr = (frameStr) ? frameStr : "jsreturn2";
	var attachObj = new GETATTACHObject(prodline,"PAEMPGOAL");
	attachObj.index = "PGOSET1";
	attachObj.rectype = "C"; // comment attachment
	attachObj.key = "K1=" + escape(company) + "&K2=" + escape(employee) + "&K3=" + escape(seqNbr);
	attachObj.out = "JS";
	attachObj.opm = "T";
	attachObj.data = "TRUE";
	attachObj.stat = "TRUE";
	attachObj.header = "TRUE";
	//attachObj.encode = "TEXT";
	attachObj.debug = false;

	if(fromFirstRefresh){
		attachObj.func = "refreshFirstAttachment";
		fromFirstRefresh = false;
	}
	else {
		attachObj.func = "refreshAttachment";
	}
	GETATTACH(attachObj,frameStr);
}

function writeAttachment(cmtObj, prodline, company, employee, seqNbr, action, frameStr)
{
	frameStr = (frameStr) ? frameStr : "jsreturn";

	var attachObj = new WRITEATTACHObject(prodline,"PAEMPGOAL");
	attachObj.index = "PGOSET1";
	attachObj.rectype = "C"; // comment attachment
	attachObj.key = "K1=" + escape(company) + "&K2=" + escape(employee) + "&K3=" + escape(seqNbr);
	attachObj.out = "JS";
	attachObj.opm = (action == "D") ? "D" : "M";
	attachObj.usertype = cmtObj.getUserType();

	if (action != "A" && cmtObj.getRecKey() != null && cmtObj.getSeqKey() != null)
	{
		// modify this record

		attachObj.reckey = escape(cmtObj.getRecKey(),1);
		attachObj.seqkey = escape(cmtObj.getSeqKey(),1);
	}

	if (action != "D")
	{
		attachObj.title = escape(cmtObj.getTitle(),1);
		attachObj.body = escape(cmtObj.getText(),1);
	}

	attachObj.data	= "TRUE";
	//attachObj.encode = "TEXT";
	attachObj.debug = false;
	actionGlobal = action;

	//Might be uneeded to do a refresh Attachment on a write
	if(attachObj.usertype == "C") {
		attachObj.func = (action == "D") ? "refreshForm" : "refreshAttachment";
	}
	else {
		fromFirstRefresh = true;
		attachObj.func = (action == "D") ? "refreshForm" : "refreshFirstAttachment";
	}

	WRITEATTACH(attachObj,frameStr);
}

function zeroPad(nbr, lgth)
{
	nbr = nbr.toString();
	for (var i=nbr.length; i<Number(lgth); i++)
		nbr = "0" + nbr;
	return nbr;
}

function highlightFieldInError(fldNm) {

	try {
		var formData = self.right.document.forms["goalform"];
		fldNm = fldNm.toString().toUpperCase();

		if (fldNm.indexOf("PGO-OBJECTIVE") >= 0)
		{
			fldObj = formData.elements["objective"];
			setRequiredField(fldObj);
			fldObj.focus();
			fldObj.select();
		} 
		else if (fldNm.indexOf("PGO-PRIORITY") >= 0)
		{
			fldObj = formData.elements["priority"];
			setRequiredField(fldObj);
			fldObj.focus();
			fldObj.select();
		} 
		else if (fldNm.indexOf("PGO-START-DATE") >= 0)
		{
			fldObj = formData.elements["startDate"];
			setRequiredField(fldObj);
			fldObj.focus();
			fldObj.select();
		} 
		else if (fldNm.indexOf("PGO-END-DATE") >= 0)
		{
			fldObj = formData.elements["endDate"];
			setRequiredField(fldObj);
			fldObj.focus();
			fldObj.select();
		}
		else if (fldNm.indexOf("PGO-PCT-COMPLETED") >= 0)
		{
			fldObj = formData.elements["pctComplete"];
			setRequiredField(fldObj);
			fldObj.focus();
			fldObj.select();
		}
		else if (fldNm.indexOf("PGO-COMPLETE-DATE") >= 0)
		{
			fldObj = formData.elements["completeDate"];
			setRequiredField(fldObj);
			fldObj.focus();
			fldObj.select();
		}
	} catch(e) {}
}

function updateDetailedDesc(prodline, company, employee, seqNbr, funcIncoming, userType)
{
	if (self.lawheader.abort == true) {
		highlightFieldInError(self.lawheader.gfldnbr);
		isUpdating = false;
		//stay on current edit screen
		return;
	}

	(seqNbr == 0) ? seqNbr = self.lawheader.currentSeqNbr: '';

	(funcIncoming) ? func1 = funcIncoming : '';

	var goalform = right.document.forms["goalform"];
	var co = zeroPad(company,4);
	var ee = zeroPad(employee,9);
	var seq = zeroPad(seqNbr,4);
	var parentKey = "K1=" + co + "&K2=" + ee + "&K3=" + seq;
	var attachText;
	var oCmt = new cmtAttach();

	if(userType == "P") {
		attachText = goalform.detailedDesc.value;
		oCmt.setTitle("GoalView Detailed Description"); // <-- use the short 30 character detailedDesc here
		oCmt.setUserType("P");
	}
	else {
		attachText = goalform.compComments.value;
		oCmt.setTitle("GoalView Completion Comments"); // <-- use the short 30 character detailedDesc here
		oCmt.setUserType("C");
	}

	if (attachText.indexOf("%0D%0A") == -1 && attachText.indexOf("%0A") != -1) {
		attachText = attachText.replace(/%0A/g,"%0D%0A");
	}

	// is this an add or a modification?
	// already exists, and attempting change
	if (atts[0] && (userType == "C"))
	{
		// change
		atts[0].setText(unescape(attachText));
		viewFlag = true;
		if(unescape(attachText) == ''){
			writeAttachment(atts[0], prodline, co, ee, seq, "D", "jsreturn");
			atts[0] = null;
		}
		else {
			writeAttachment(atts[0], prodline, co, ee, seq, "M", "jsreturn");
		}
	}
	else if (atts[1] && (userType == "P")) {
		// change
		atts[1].setText(unescape(attachText));
		viewFlag = true;
		if(unescape(attachText) == ''){
			writeAttachment(atts[1], prodline, co, ee, seq, "D", "jsreturn");
			atts[1] = null;
		}
		else {
			writeAttachment(atts[1], prodline, co, ee, seq, "M", "jsreturn");
		}
	}
	else
	{
		// add
		oCmt.setText(unescape(attachText));
		viewflag = true;
		writeAttachment(oCmt, prodline, co, ee, seq, "A", "jsreturn");
	}
}

function refreshFirstAttachment()
{
	fromFirstRefresh = false;
	attachFrame = self.jsreturn2;

	var goalform = right.document.forms["goalform"];
	var attachTextP = goalform.detailedDesc.value;

	if (attachFrame.CmtRec && attachFrame.CmtRec.length)
	{

		var lookingForP = "P";

		for(t=0;t<attachFrame.CmtRec.length;t++) {

			if(attachFrame.CmtRec[t].UserType == "P" && lookingForP == "P") {
				//attachTextP = doTextAttach(attachFrame.CommentData[t].join(""));
				addToArr(1,t,attachTextP, attachFrame);
				lookingForP = "";
			}
		}


	}

	// set the attachment text in the textarea
	goalform.detailedDesc.value = unescape(unescape(attachTextP));

	if(fromRefreshForm == true) {
		setTimeout(function(){document.getElementById("right").style.visibility = "visible";}, 100);
		//removeWaitAlert();
		fromRefreshForm = false;
	}

	evalOpenView(func1);

}

function refreshAttachment()
{
	// initial loading of attachments
	attachFrame = self.jsreturn2;

	var goalform = right.document.forms["goalform"];
	var attachTextP = goalform.detailedDesc.value;
	var attachTextC = goalform.compComments.value;

	// Initially set to null to prevent carryover from diff records
	atts[0] = null;
	atts[1] = null;

	if (attachFrame.CmtRec && attachFrame.CmtRec.length)
	{
		var lookingForC = "C";
		var lookingForP = "P";

		for(t=0;t<attachFrame.CmtRec.length;t++) {

			if(attachFrame.CmtRec[t].UserType == "C" && lookingForC == "C") {
				attachTextC = doTextAttach(attachFrame.CommentData[t].join(""));
				addToArr(0,t,attachTextC, attachFrame);
				lookingForC = "";

			}

			if(attachFrame.CmtRec[t].UserType == "P" && lookingForP == "P") {
				attachTextP = doTextAttach(attachFrame.CommentData[t].join(""));
				addToArr(1,t,attachTextP, attachFrame);
				lookingForP = "";
			}
		}
	}

	// set the attachment text in the textarea
	goalform.detailedDesc.value = unescape(unescape(attachTextP));
	goalform.compComments.value = unescape(unescape(attachTextC));

	if(fromRefreshForm == true) {
		setTimeout(function(){document.getElementById("right").style.visibility = "visible";}, 100);
		//removeWaitAlert();
		fromRefreshForm = false;
	}

	evalOpenView(func1);
}

function cmtAttach()
{
	this.title = null;
	this.text = null;
	this.modifiedDate = null;
	this.modifiedTime = null;
	this.userType = null;
	this.recKey = null;
	this.seqKey = null;
	this.parentKey = null;
}

cmtAttach.prototype.getTitle = function()
{
	return this.title;
}

cmtAttach.prototype.setTitle = function(t)
{
	this.title = t;
}

cmtAttach.prototype.getText = function()
{
	return this.text;
}

cmtAttach.prototype.setText = function(t)
{
	this.text = t;
}

cmtAttach.prototype.getModifiedDate = function()
{
	return this.modifiedDate;
}

cmtAttach.prototype.setModifiedDate = function(d)
{
	this.modifiedDate = d;
}

cmtAttach.prototype.getModifiedTime = function()
{
	return this.modifiedTime;
}

cmtAttach.prototype.setModifiedTime = function(t)
{
	this.modifiedTime = t;
}

cmtAttach.prototype.getUserType = function()
{
	return this.userType;
}

cmtAttach.prototype.setUserType = function(u)
{
	this.userType = u;
}

cmtAttach.prototype.getRecKey = function()
{
	return this.recKey;
}

cmtAttach.prototype.setRecKey = function(r)
{
	this.recKey = r;
}

cmtAttach.prototype.getSeqKey = function()
{
	return this.seqKey;
}

cmtAttach.prototype.setSeqKey = function(s)
{
	this.seqKey = s;
}

cmtAttach.prototype.getParentKey = function()
{
	return this.parentKey;
}

cmtAttach.prototype.setParentKey = function(p)
{
	this.parentKey = p;
}

// Extract a parameter value from a string.
function getVarFromString(varName, str, delim)
{
	var url = str;
	var ptr = url.indexOf(varName + "=");
	var ptr2;
	var val1 = "";
	var delim = (delim) ? delim : "&";

	if (ptr != -1)
	{
		var val1 = url.substring(ptr + varName.length + 1,url.length);
		var ptr2;

		if ((ptr2 = val1.indexOf(delim)) != -1)
		{
			if (ptr2 == -1)
				ptr2 = val1.length;
			val1 = val1.substring(0,ptr2);
		}
	}
	return val1;
}

function doTextAttach(textObj) {
	var attachText
				attachText = textObj;

				if (attachText.indexOf("%0D%0A") == -1 && attachText.indexOf("%0A") != -1) {
					attachText = attachText.replace(/%0A/g,"%0D%0A");
				}

	return attachText;

}

function addToArr(arrIndex, attachIndex, text, attachFrame) {

			var oCmt = new cmtAttach();
			oCmt.setTitle(attachFrame.CmtRec[attachIndex].Title);
			oCmt.setText(text);
			oCmt.setModifiedDate(attachFrame.CmtAttrib[attachIndex].ModifyDate);
			oCmt.setModifiedTime(attachFrame.CmtAttrib[attachIndex].ModifyTime);
			oCmt.setUserType(attachFrame.CmtRec[attachIndex].UserType);
			oCmt.setRecKey(attachFrame.CmtRec[attachIndex].RecKey);
			oCmt.setSeqKey(attachFrame.CmtRec[attachIndex].SeqKey);
			oCmt.setParentKey(attachFrame.CmtParentKey[attachIndex]);
			atts[arrIndex] = oCmt;

}
