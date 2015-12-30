<html>
<head>
<meta name="viewport" content="width=device-width" />
<META HTTP-EQUIV="Pragma" CONTENT="No-Cache">
<META HTTP-EQUIV="Expires" CONTENT="Mon, 01 Jan 1990 00:00:01 GMT">
<title>Dependents</title>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/webappjs/transaction.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/xhrnet/statesuscan.js"></script>
<script src="/lawson/xhrnet/empinfo.js"></script>
<script src="/lawson/xhrnet/depinfo.js"></script>
<script src="/lawson/xhrnet/fica.js"></script>
<script src="/lawson/xhrnet/instctrycdselect.js"></script>
<script src="/lawson/xhrnet/hrctrycodeselect.js"></script>
<script src="/lawson/xhrnet/pcodesselect.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/xhrnet/waitalert.js"></script>
<script>
var fromTask = (window.location.search)?unescape(window.location.search):"";
var emdseqnbr = 0;
var CurrentDep = new Object();
var prm = 3;
var taskNm = " ";
var geffectd = "";
var userAction = "";
var freeES10DepNbr = 1;
var currentDepIndex = -1;
var depTabs;
var familyStatusExists = false;
var onLoad = true;
var relationData = new Array();
var physicianData = new Array();
var _action;
var isStudent = false;
seaAlert = parent.seaAlert;

if (fromTask)
{
	geffectd = getVarFromString("date",fromTask);
	switch(getVarFromString("from",fromTask))
	{
		case "adoption":	prm = 1; taskNm = "ADOPTION"; break;
		case "birth":		prm = 2; taskNm = "BIRTH"; break;
		case "divorce":		prm = 3; taskNm = "DIVORCE"; break;
		case "legalsep":	prm = 3; taskNm = "LEGAL SEP"; break;
		case "marriage":	prm = 3; taskNm = "MARRIAGE"; break;
	}
	fromTask = (taskNm != "") ? fromTask : "";
}

function LoadDependents()
{
	// Check if a parent or opener document has already done an authenticate,
	// otherwise go get the webuser info.
	if (parent && typeof(parent.authUser) != "undefined" && parent.authUser != null)
	{
		authUser = parent.authUser;
		if (typeof(parent.EmpInfo) != "undefined" && parent.EmpInfo != null)
		{
			EmpInfo = parent.EmpInfo;
			CalledEmpInfo = parent.CalledEmpInfo;
		}
		if (typeof(parent.DepInfo) != "undefined" && parent.DepInfo != null)
		{
			DepInfo = parent.DepInfo;
			CalledDepInfo = parent.CalledDepInfo;
		}
		try {
			profileHandler.setLoganenvVars();
		}
		catch(e) {}
	}
	else if (opener && typeof(opener.authUser) != "undefined" && opener.authUser != null)
	{
		authUser = opener.authUser;
		if (typeof(opener.EmpInfo) != "undefined" && opener.EmpInfo != null)
		{
			EmpInfo = opener.EmpInfo;
			CalledEmpInfo = opener.CalledEmpInfo;
		}
		if (typeof(opener.DepInfo) != "undefined" && opener.DepInfo != null)
		{
			DepInfo = opener.DepInfo;
			CalledDepInfo = opener.CalledDepInfo;
		}
		try {
			profileHandler.setLoganenvVars();
		}
		catch(e) {}
	}
	else if (typeof(authUser) == "undefined" || authUser == null)
	{
		authenticate("frameNm='jsreturn'|funcNm='GetEmdepend()'|desiredEdit='EM'");
		return;
	}

	GetEmdepend();
}

function GetEmdepend()
{
	try {
		if (fromTask) {
			parent.document.getElementById(window.name).style.visibility = "visible";
			parent.showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"));
		}
	}
	catch(e) {}

	document.title = getSeaPhrase("LIFE_EVENTS_4","ESS");

	// Netscape 6.2+ does not properly size the iframes by percentages at load time
	setLayerSizes();
	if (!document.all) {
		document.getElementById("left").style.width = parseInt(window.innerWidth*.49,10)+"px";
		document.getElementById("right").style.left = parseInt(window.innerWidth*.49,10)+"px";
		document.getElementById("right").style.width = parseInt(window.innerWidth*.51,10)+"px";
		document.getElementById("leftform").style.width = parseInt(window.innerWidth*.51,10)+"px";
	}

	GetDepInfo(authUser.prodline,authUser.company,authUser.employee,"","CheckForEmpInfo()","");
}

function CheckForEmpInfo()
{
	if (DepInfo.length > 0)
	{
		EmpInfo.employee_work_country = DepInfo[0].employee_work_country;
	}
	else if (typeof(EmpInfo.employee_work_country) == "undefined" || !CalledEmpInfo)
	{
		GetEmpInfo(authUser.prodline,authUser.company,authUser.employee,"paemployee",
				"employee.work-country;","GetCountryCodeInfo()");
		return;
	}

	GetCountryCodeInfo();
}

function GetCountryCodeInfo()
{
	GetInstCtryCdSelect(authUser.prodline,"GetStateProvinceInfo()");
}

function GetStateProvinceInfo()
{
	if (onLoad && (prm == 1 || prm == 2))
	{
		for (var i=0; i<DepInfo.length; i++)
		{
			if (parseInt(DepInfo[i].seq_nbr,10) > emdseqnbr)
			{
				emdseqnbr = parseInt(DepInfo[i].seq_nbr,10);
			}
		}
		GrabStates("AddDependent()");
	}
	else
	{
		GrabStates("DrawDepListScreen()");
	}
}

function MaskSocialNbr(socialNbr)
{
	return socialNbr.substring(socialNbr.length-4,socialNbr.length);
}
// MOD BY BILAL - Prior customizations.
//ISH 2008 Add Important Window
function OpenWinDesc()
{
	window.open("/lawson/xhrnet/importantdependent.htm","IMPORTANT","width=500,height=500,resizable=yes,toolbar=no,scrollbars=yes");
}
// END OF MOD
function DrawDepListScreen()
{
	var rowNbr = -1;
	var rowClass = "";
	var thisDep = new Object();
   	emdseqnbr = 0;
   	onLoad = false;

// MOD BY BILAL - Prior Customizations
	//ISH 2008 Disclaimer
    var customMsg =  '<TABLE width="100%"><TR><td align="middle"><a href="javascript:parent.OpenWinDesc()"><font color=red><h3>Important!<br>Click and read</h3></font></a></TD></TR></TABLE>'
// END OF MOD
// MOD BY BILAL
//   	var DepListContent = '<table id="depTbl" class="plaintableborder" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list">\n'
   	var DepListContent = customMsg + '<table id="depTbl" class="plaintableborder" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list">\n'
// END OF MOD
	+ '<tr><th scope="col" class="plaintableheaderborder" style="width:58%;text-align:center">'+getSeaPhrase("NAME","ESS")+'</th>'
	+ '<th scope="col" class="plaintableheaderborder" style="width:42%;text-align:center">'+getSeaPhrase("HOME_ADDR_16","ESS")+'</th></tr>\n'

  	for (var i=0; i<DepInfo.length; i++)
   	{
      	thisDep = DepInfo[i];

	  	if (parseInt(thisDep.seq_nbr,10) > emdseqnbr)
	  	{
	     	emdseqnbr = parseInt(thisDep.seq_nbr,10);
		}

		if (thisDep.active_flag != "A") continue;

		rowNbr++;
		//if (rowClass != "")
		//{
		//	rowClass = "";
			DepListContent += '<tr>'
		//}
		//else
		//{
		//	rowClass = "tablerowhighlight";
		//  	DepListContent += '<tr class="tablerowhighlight">'
		//}

      	DepListContent += '<td class="plaintablecellborder" style="width:58%;text-align:left">'
      	+ '<a href=javascript:parent.ChangeDependent('+i+','+rowNbr+')'
		+ ' onmouseover="window.status=\''+getSeaPhrase("DEP_32","ESS").replace(/\'/g,"\\'")+'\';return true"'
		+ ' onmouseout="window.status=\' \';return true" nowrap>'
		+ thisDep.label_name_1 +'</a></td>'
		+ '<td class="plaintablecellborder" style="width:42%;text-align:right" nowrap>'
		+ ((thisDep.fica_nbr)?MaskSocialNbr(thisDep.fica_nbr):'&nbsp;')
		+ '</td></tr>\n'
	}

	DepListContent += '</table>\n'

	AddBtnContent = '<table cellspacing="0" cellpadding="0" width="100%">\n'
	+ '<tr><td style="text-align:right;padding-top:5px;padding-right:5px" nowrap="">'
	// PT 125466
	// if (fromTask)
	if (fromTask && getVarFromString("from",fromTask).toLowerCase()!="main")
	{
		AddBtnContent += uiButton(getSeaPhrase("ADD","ESS"),"parent.AddDependent();return false","margin-left:5px","addbtn");
		AddBtnContent += uiButton(getSeaPhrase("CLOSE","ESS"),"parent.CloseDependents();return false",false,"closebtn");
	}
	else
	{
		AddBtnContent += uiButton(getSeaPhrase("ADD","ESS"),"parent.AddDependent();return false","margin-left:5px","addbtn");
	}

	AddBtnContent += '</td></tr>\n'
	+ '</table>\n'

	DepListContent += AddBtnContent;

	self.left.document.getElementById("paneHeader").innerHTML = getSeaPhrase("CURRENT_DEPENDENTS","ESS");

	if (DepInfo.length == 0)
	{
		self.left.document.getElementById("paneBody").innerHTML = '<div id="instructionsDiv" class="fieldlabelbold" style="text-align:left;padding-left:5px;padding-top:5px">'
		+ getSeaPhrase("DEP_LIST_ADD_INSTRUCTIONS","ESS")
		// MOD BY CLYNCH - Add text
		+ '<p><font color="red"><u>Please be aware:</u></font> Adding or changing dependents on this screen does NOT affect your elected benefit plans.  If you would like to add/drop dependents to your plan, you must complete a midyear change packet (click <a href="../../xbnnet/plandescriptions/MidYearChangePacket.pdf" target="_new">here</a> for packet) and deliver to Benefits Services.<p>'
		// END OF MOD
		+ '</div>'
		+ '<div style="overflow:hidden">'
		+ AddBtnContent
		+ '</div>'
	}
	else
	{
		if (document.all) {
			self.left.document.getElementById("paneBody").innerHTML = '<div id="instructionsDiv" class="fieldlabelbold" style="text-align:left;padding-left:5px;padding-top:5px">'
			+ getSeaPhrase("DEP_LIST_ADD_INSTRUCTIONS","ESS")
			+ '<p/>'
			// MOD BY CLYNCH - Add text
			+ '<p><font color="red"><u>Please be aware:</u></font> Adding or changing dependents on this screen does NOT affect your elected benefit plans.  If you would like to add/drop dependents to your plan, you must complete a midyear change packet (click <a href="../../xbnnet/plandescriptions/MidYearChangePacket.pdf" target="_new">here</a> for packet) and deliver to Benefits Services.<p>'
			// END OF MOD
			+ getSeaPhrase("DEP_LIST_CHG_INSTRUCTIONS","ESS")
			+ '</div>'
			+ '<p/>'
			+ '<div id="dataDiv">'
			+ DepListContent
			+ '</div>'
		}
		else {
			self.left.document.getElementById("paneBody").innerHTML = '<div id="instructionsDiv" class="fieldlabelbold" style="text-align:left;padding-left:5px;padding-top:5px;padding-bottom:20px">'
			+ getSeaPhrase("DEP_LIST_ADD_INSTRUCTIONS","ESS")
			+ '<p/>'
			// MOD BY CLYNCH - Add text
			+ '<p><font color="red"><u>Please be aware:</u></font> Adding or changing dependents on this screen does NOT affect your elected benefit plans.  If you would like to add/drop dependents to your plan, you must complete a midyear change packet (click <a href="../../xbnnet/plandescriptions/MidYearChangePacket.pdf" target="_new">here</a> for packet) and deliver to Benefits Services.<p>'
			// END OF MOD			
			+ getSeaPhrase("DEP_LIST_CHG_INSTRUCTIONS","ESS")
			+ '</div>'
			+ '<p/>'
			+ '<div id="dataDiv">'
			+ DepListContent
			+ '</div>'
		}
	}

	self.left.stylePage();
	self.left.setLayerSizes();
	document.getElementById("left").style.visibility = "visible";
	// if this task has been launched as a related link, remove any processing message
	if (fromTask && typeof(parent.removeWaitAlert) == "function")
		parent.removeWaitAlert();

	fitToScreen();
}

function ReturnDate(date)
{
	try {
   		depTabs.frame.document.maindepform.elements[date_fld_name].value = date;
		if (depTabs.getActiveTab() != 0) {
			depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_0"));
		}
	}
	catch(e)
	{
		try {
			depTabs.frame.document.addrdepform.elements[date_fld_name].value = date;
			if (depTabs.getActiveTab() != 1) {
				depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_1"));
			}
		}
		catch(e) {}
	}
}

function CloseDependents()
{
	if (prm == 1 || prm == 2)
	{
		switch (prm)
		{
			case 1: self.left.location.replace("/lawson/xhrnet/adopt1.htm?date="+geffectd);
					document.getElementById("left").style.visibility = "visible";
					break;
			case 2: self.left.location.replace("/lawson/xhrnet/birth1.htm?date="+geffectd);
					document.getElementById("left").style.visibility = "visible";
					break;
			default: break;
		}
	}
	else
	{
		// refresh the dependent array in the parent
		try {
			parent.DepInfo = DepInfo;
		}
		catch(e) {}

		try {
			parent.document.getElementById("fullrelatedtask").style.visibility = "hidden";
			parent.document.getElementById("relatedtask").style.visibility = "hidden";
			parent.document.getElementById("right").style.visibility = "hidden";
			parent.document.getElementById("left").style.visibility = "visible";
		}
		catch(e) {}

		// display the checkmark indicating that this task has been accessed.
		try {
			parent.left.setImageVisibility("dependentaddress_checkmark","visible");
		}
		catch(e) {}
	}
}

function HideListButtons()
{
	try {
		self.left.document.getElementById("addbtn").style.visibility = "hidden";
		if (fromTask) {
			self.left.document.getElementById("closebtn").style.visibility = "hidden";
		}
	}
	catch(e) {}
}

function ShowListButtons()
{
	try {
		self.left.document.getElementById("addbtn").style.visibility = "visible";
		if (fromTask) {
			self.left.document.getElementById("closebtn").style.visibility = "visible";
		}
	}
	catch(e) {}
}

function ChangeDependent(i,rowNbr)
{
	activateTableRow("depTbl",rowNbr,self.left);

	try {
		if (fromTask) {
			parent.showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"));
		}
	}
	catch(e) {}
	userAction = "Change";
	currentDepIndex = i;

	HideListButtons();

	if (CalledPcodesInfo == false || CalledHrCtryCodeInfo == false)
	{
		GetPcodesSelect(authUser.prodline,"DP;PC","SortPcodes()","Active");
	}
	else
	{
		CurrentDep = DepInfo[i];
		document.getElementById("right").style.visibility = "hidden";
		DrawDependentTabs("Change",i,"self.right");
	}
}

function AddDependent()
{
	try {
		if (fromTask) {
			parent.showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"));
		}
	}
	catch(e) {}
	userAction = "Add";
	currentDepIndex = -1;

	HideListButtons();

	if (CalledPcodesInfo == false || CalledHrCtryCodeInfo == false)
	{
		GetPcodesSelect(authUser.prodline,"DP;PC","SortPcodes()","Active");
	}
	else
	{
   		CurrentDep = new Object();
   		if (onLoad && (prm == 1 || prm == 2))
   		{
   			DrawDependentTabs("Add",-1,"self.leftform");
   		}
   		else
   		{
   			DrawDependentTabs("Add",-1,"self.right");
		}
	}
}

function SortPcodes()
{
	for (var i=0; i<PcodesInfo.length; i++)
	{
		if (PcodesInfo[i].type == "DP")
			relationData[relationData.length] = PcodesInfo[i];
		else if (PcodesInfo[i].type == "PC")
			physicianData[physicianData.length] = PcodesInfo[i];
	}

	GetNameSuffixInfo();
}

function GetNameSuffixInfo()
{
	if (userAction == "Change")
	{
		GetHrCtryCodeSelect(authUser.prodline,"SU","ChangeDependent("+currentDepIndex+")");
	}
	else
	{
		GetHrCtryCodeSelect(authUser.prodline,"SU","AddDependent()");
	}
}

function DrawDependentTabs(action,depIndex,frameStr)
{
// MOD BY BILAL - Hiding Address Tab
	if (typeof(depTabs) == "undefined") {
//		depTabs = new uiTabSet("depTabs",new Array(getSeaPhrase("MAIN","ESS"),getSeaPhrase("HOME_ADDR_2","ESS")));
		depTabs = new uiTabSet("depTabs",new Array(getSeaPhrase("MAIN","ESS")));
	}
//END OF MOD

	var classStr = (onLoad && (prm == 1 || prm == 2))?"fieldlabelbold":"fieldlabelboldlite";
	var tab0Html = "";
	var tab1Html = "";

	// Main tab form
	var tab0Html = '<body>\n'
	+ '<form name="maindepform">\n'

	if (action == "Add")
	{
		tab0Html += '<input class="inputbox" type="hidden" name="seqnbr" value="'+(parseInt(emdseqnbr,10)+1)+'">'
	}
	else
	{
		tab0Html += '<input class="inputbox" type="hidden" name="seqnbr" value="'+DepInfo[depIndex].seq_nbr+'">'
	}

	tab0Html += '<table border="0" cellspacing="0" cellpadding="0" width="100%">\n'
	+ '<tr style="padding-top:5px"><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("DEP_34","ESS")+'</td>'
// MOD BY BILAL - Changing to UPPER CASE
	//PT 143160
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="firstname" size="15" maxlength="15" onfocus="this.select()" onblur="this.value=this.value.toUpperCase()" '
// END OF MOD

	if (action == "Change") {
		tab0Html += ' value="'+DepInfo[depIndex].first_name+'"'
	}

	tab0Html += '>'+uiRequiredIcon()+'</td></tr>\n'
	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("DEP_35","ESS")+'</td>'
// MOD BY BILAL - Changing to UPPER CASE 
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="middleinit" size="1" maxlength="1" onfocus="this.select()" onblur="this.value=this.value.toUpperCase()" '
// END OF MOD
	if (action == "Change") {
		tab0Html += ' value="'+DepInfo[depIndex].middle_init+'"'
	}

	tab0Html += '></td></tr>\n'

	if (EmpInfo.employee_work_country == "DE" || EmpInfo.employee_work_country == "NL")
	{
// MOD BY BILAL - Chaging to UPPER CASE
		tab0Html += '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("DEP_37","ESS")+'</td>'
		+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="lastnameprefix" size="30" maxlength="30" onfocus="this.select()" onblur="this.value=this.value.toUpperCase()" '
// END OF MOD

		if (action == "Change") {
			tab0Html += ' value="'+DepInfo[depIndex].last_name_pre+'"'
		}

		tab0Html += '></td></tr>\n'
	}

//MOD BY BILAL - Changing to UPPERCASE
	tab0Html += '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("DEP_38","ESS")+'</td>'
	//PT 143160
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="lastname" size="30" maxlength="30" onfocus="this.select()" onblur="this.value=this.value.toUpperCase()" '
// END OF MOD

	if (action == "Change") {
		tab0Html += ' value="'+DepInfo[depIndex].last_name+'"'
	}

	tab0Html += '>'+uiRequiredIcon()+'</td></tr>\n'
	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("DEP_39","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><select class="inputbox" name="namesuffix">'

	if (action == "Change") {
		tab0Html += DrawHrCtryCodeSelect("SU",DepInfo[depIndex].name_suffix)
	}
	else {
		tab0Html += DrawHrCtryCodeSelect("SU","")
	}

	tab0Html += '</select></td></tr>\n'
	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("DEP_40","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="birthdate" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this);"'

	if (action == "Change") {
		tab0Html += ' value="'+DepInfo[depIndex].birthdate+'"'
	}

	tab0Html += '><a href=javascript:parent.DateSelect("birthdate")'
	+ ' onmouseover="window.status=\''+getSeaPhrase("DISPLAY_CAL","ESS").replace(/\'/g,"\\'")+'\';return true"'
    + ' onmouseout="window.status=\'\';return true">'
    + uiCalendarIcon() + '</a>'+uiDateFormatSpan()+uiRequiredIcon()+'</td></tr>\n'
    + '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("DEP_41","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="adoptdate" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this);"'

	if (action == "Change") {
		tab0Html += ' value="'+DepInfo[depIndex].adoption_date+'"'
	}

	// PT 124444
	var htmlCode = (prm == 1)?uiRequiredIcon():''

	tab0Html += '><a href=javascript:parent.DateSelect("adoptdate")'
	+ ' onmouseover="window.status=\''+getSeaPhrase("DISPLAY_CAL","ESS").replace(/\'/g,"\\'")+'\';return true"'
	+ ' onmouseout="window.status=\'\';return true">'
	// PT 124444 160175 removed the required icon
	// + uiCalendarIcon() + '</a>' + uiDateFormatSpan() + '</td></tr>\n'
	+ uiCalendarIcon() + '</a>' + uiDateFormatSpan() + '</td></tr>\n'
	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("DEP_22","ESS")+'</td>'
    + '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="placedate" size="10" maxlength="10" onfocus="this.select()" onchange="parent.ValidateDate(this);"'

	if (action == "Change") {
		tab0Html += ' value="'+DepInfo[depIndex].placement_date+'"'
	}

	tab0Html += '><a href=javascript:parent.DateSelect("placedate")'
	+ ' onmouseover="window.status=\''+getSeaPhrase("DISPLAY_CAL","ESS").replace(/\'/g,"\\'")+'\';return true"'
    + ' onmouseout="window.status=\'\';return true">'
    // PT 124444
    // + uiCalendarIcon() + '</a>' + uiDateFormatSpan() + '</td></tr>\n'
    + uiCalendarIcon() + '</a>' + uiDateFormatSpan() + htmlCode + '</td></tr>\n'
   	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("HOME_ADDR_16","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><span id="ficaspan"><input class="inputbox" type="text" name="ficanbr" size="11" maxlength="11" onfocus="this.select()"'

	if (action == "Change") {
		tab0Html += ' value="'+DepInfo[depIndex].fica_nbr+'"'
	}

	tab0Html += '></span>'
	if (parent.emssObjInstance.emssObj.requireDepSSN)
	{
		tab0Html += '<span id="ficarequiredicon" style="padding-right:15px">'+uiRequiredIcon()+'</span>'
		if (prm == 1 || prm == 2)	
			tab0Html += '<input class="inputbox" type="checkbox" name="ficaissued" onclick="parent.RefreshSSN(this)"><span class="fieldlabelbold">'+getSeaPhrase("NOT_ISSUED","ESS")+'</span>'
	}
	tab0Html += '</td></tr>\n'
	
	tab0Html += '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("TYPE","ESS")+'</td>'
    + '<td class="plaintablecell" id="deptype" nowrap><select class="inputbox" name="deptype">'
    + '<option value="">'

	if (action == "Change") {
 		tab0Html += '<option value="S"'
 		if (DepInfo[depIndex].dep_type == "S") {
 			tab0Html += ' selected'
 		}
 		tab0Html += '>'+getSeaPhrase("DEP_43","ESS")
 		+ '<option value="D"'
 		if (DepInfo[depIndex].dep_type == "D") {
 			tab0Html += ' selected'
 		}
 		tab0Html += '>'+getSeaPhrase("DEP_33","ESS")
	}
  	else {
 		tab0Html += '<option value="S">'+getSeaPhrase("DEP_43","ESS")
 		+ '<option value="D">'+getSeaPhrase("DEP_33","ESS")
	}

	tab0Html += '</select>'+uiRequiredIcon()+'</td></tr>\n'
	if (action == "Change")
	{
// MOD BY BILAL  - hiding the field  "display:none"
//		tab0Html += '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("STATUS","ESS")+'</td>'
		tab0Html += '<tr style="display:none"><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("STATUS","ESS")+'</td>'
// END OF MOD
	    + '<td class="plaintablecell" id="status" nowrap><select class="inputbox" name="status">'
 		+ '<option value="A"'
 		if (DepInfo[depIndex].active_flag == "A") {
 			tab0Html += ' selected'
 		}
 		tab0Html += '>'+getSeaPhrase("ACTIVE","ESS")
 		+ '<option value="I"'
 		if (DepInfo[depIndex].active_flag == "I") {
 			tab0Html += ' selected'
 		}
 		tab0Html += '>'+getSeaPhrase("INACTIVE","ESS")
		tab0Html += '</select></td></tr>\n'
	}
	tab0Html += '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("DEP_23","ESS")+'</td>'
	+ '<td class="plaintablecell" id="relcode" nowrap><select class="inputbox" name="relcode">'

	if (action == "Change") {
		tab0Html += DrawPcodesSelect("DP",DepInfo[depIndex].rel_code,relationData)
	}
	else {
		tab0Html += DrawPcodesSelect("DP","",relationData)
	}

	tab0Html += '</select>'+uiRequiredIcon()+'</td></tr>\n'
	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("HOME_ADDR_2","ESS")+'</td>'
    + '<td class="plaintablecell" id="empaddress" nowrap><select class="inputbox" name="empaddress">'
// MOD BY BILAL - Removing the Blank option
//    + '<option value="">'
// END OF MOD
    if (action == "Change") {
 		tab0Html += '<option value="H"'
 		if (DepInfo[depIndex].emp_address == "H") {
 			tab0Html += ' selected'
 		}
 		tab0Html += '>'+getSeaPhrase("HOME","ESS")
// MOD BY BILAL - Removing option
//		+ '<option value="N"'
//		if (DepInfo[depIndex].emp_address == "N") {
//			tab0Html += ' selected'
//		}
//		tab0Html += '>'+getSeaPhrase("DEP_30","ESS")
// END OF MOD
    }
    else {
// MOD BY BILAL  -  Forcing the HOME to be the only selected option
		tab0Html += '<option value="H" selected>'+getSeaPhrase("HOME","ESS")
// MOD BY BILAL - Removing option
//		+ '<option value="N">'+getSeaPhrase("DEP_30","ESS")
// END OF MOD
	}

	tab0Html += '</select>'+uiRequiredIcon()+'</td></tr>\n'
// MOD BY BILAL - No need for this field
//	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("PRIMARY_CARE_PHYSICIAN","ESS")+'</td>'
//	+ '<td class="plaintablecell" id="pcpcode" nowrap><select class="inputbox" name="pcpcode">'
//
//	if (action == "Change") {
//		tab0Html += DrawPcodesSelect("PC",DepInfo[depIndex].primary_care,physicianData)
//	}
//	else {
//		tab0Html += DrawPcodesSelect("PC","",physicianData)
//	}
//
//	tab0Html += '</select></td></tr>\n'
// END OF MOD
    + '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("DEP_27","ESS")+'</td>'
    + '<td class="plaintablecell" id="gender" nowrap><select class="inputbox" name="gender">'
	+ '<option value="">'

	if (action == "Change") {
    	tab0Html += '<option value="M"'
    	if (DepInfo[depIndex].sex == "M") {
    		tab0Html += ' selected'
    	}
    	tab0Html += '>'+getSeaPhrase("DEP_25","ESS")
    	+ '<option value="F"'
    	if (DepInfo[depIndex].sex == "F") {
    		tab0Html += 'selected'
    	}
    	tab0Html += '>'+getSeaPhrase("DEP_26","ESS")
	}
	else {
    	tab0Html += '<option value="M">'+getSeaPhrase("DEP_25","ESS")
    	+ '<option value="F">'+getSeaPhrase("DEP_26","ESS")
    }

    tab0Html += '</select>'+uiRequiredIcon()+'</td></tr>\n'
	+ '<tr'

	// PT 139145. Add rollover help text for student status dropdown if HRDEPBEN benefit exists
	if (action == "Change" && DepInfo[depIndex].benefits_plan_type != "") {
		tab0Html += ' id="studentstatus" onmouseover="parent.displayHelpText(\''+frameStr+'\',\'studentstatus\',\'studentStatusHelpText\',true)" '
		+ 'onmouseout="parent.displayHelpText(\''+frameStr+'\',\'studentstatus\',\'studentStatusHelpText\',false)"'
	}

	tab0Html += '><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("DEP_24","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><select class="inputbox" name="student"'

	isStudent = false;

	if (action == "Change") {
		// PT 139145. Disable student status dropdown if HRDEPBEN benefit exists
		if (DepInfo[depIndex].benefits_plan_type != "") {
			tab0Html += ' disabled="true"'
		}
		tab0Html += '><option value="N"'
		if (DepInfo[depIndex].student == "N") {
			tab0Html += ' selected'
		}
		tab0Html += '>'+getSeaPhrase("NO","ESS")
		+ '<option value="Y"'
		if (DepInfo[depIndex].student == "Y" || DepInfo[depIndex].student == "F" || DepInfo[depIndex].student == "P") {
			tab0Html += ' selected'
			isStudent = true;
		}
		tab0Html += '>'+getSeaPhrase("YES","ESS")
	}
	else {
		tab0Html += '><option value="N" selected>'+getSeaPhrase("NO","ESS")
		+ '<option value="Y">'+getSeaPhrase("YES","ESS")
	}

	tab0Html += '</select></td></tr>\n'
	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("DEP_28","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><select class="inputbox" name="disabled">'

	if (action == "Change") {
		tab0Html += '<option value="N"'
		if (DepInfo[depIndex].disabled == "N") {
			tab0Html += ' selected'
		}
		tab0Html += '>'+getSeaPhrase("NO","ESS")
		+ '<option value="Y"'
		if (DepInfo[depIndex].disabled == "Y") {
			tab0Html += ' selected'
		}
		tab0Html += '>'+getSeaPhrase("YES","ESS")
	}
	else {
		tab0Html += '<option value="N" selected>'+getSeaPhrase("NO","ESS")
		+ '<option value="Y">'+getSeaPhrase("YES","ESS")
	}

	tab0Html += '</select></td></tr>\n'

// MOD BY BILAL 	- Removing the Field from screen
//	if (classStr == "fieldlabelboldlite") {
//		tab0Html += '<tr><td class="'+classStr+'underline" style="width:35%">'+getSeaPhrase("SMOKER","ESS")+'</td>'
//	}
//	else {
//		tab0Html += '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("SMOKER","ESS")+'</td>'
//	}
//
//	tab0Html += '<td class="plaintablecell" nowrap><select class="inputbox" name="smoker">'
//
//	if (action == "Change") {
//		tab0Html += '<option value="N"'
//		if (DepInfo[depIndex].smoker == "N") {
//			tab0Html += ' selected'
//		}
//		tab0Html += '>'+getSeaPhrase("NO","ESS")
//		+ '<option value="Y"'
//		if (DepInfo[depIndex].smoker == "Y") {
//			tab0Html += ' selected'
//		}
//		tab0Html += '>'+getSeaPhrase("YES","ESS")
//	}
//	else {
//		tab0Html += '<option value="N" selected>'+getSeaPhrase("NO","ESS")
//		+ '<option value="Y">'+getSeaPhrase("YES","ESS")
//	}
//
//	tab0Html += '</select></td></tr>\n'
// END OF MOD 
	+ '<tr><td class="plaintablecell" style="width:35%">&nbsp;</td><td nowrap="">'
	+ uiButton(getSeaPhrase("UPDATE","ESS"),"parent.UpdateDependent('"+action+"');return false","margin-left:5px;margin-top:10px")

	if (!onLoad || (prm != 1 && prm != 2))
	{
		tab0Html += uiButton(getSeaPhrase("CANCEL","ESS"),"parent.CancelDependentAction()","margin-top:10px")
	}

	tab0Html += '</td></tr>\n'
	+ '</table>\n'
	+ '</form>\n'
	+ rolloverHelpText("studentStatusHelpText",getSeaPhrase("STUDENT_STATUS_HELP_TEXT","ESS"),'width:35%;')
	+ uiRequiredFooter()
	+ '</body>'

	// Other Address form
	tab1Html = '<body>\n'
	+ '<form name="addrdepform">\n'
	+ '<table border="0" cellspacing="0" cellpadding="0" width="100%">\n'
	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("ADDR_1","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="addr1" size="30" maxlength="30" onfocus="this.select()"'

	if (action == "Change") {
		tab1Html += ' value="'+DepInfo[depIndex].addr1+'"'
	}

	tab1Html += '></td></tr>\n'
	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("ADDR_2","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="addr2" size="30" maxlength="30" onfocus="this.select()"'

	if (action == "Change") {
		tab1Html += ' value="'+DepInfo[depIndex].addr2+'"'
	}

	tab1Html += '></td></tr>\n'
	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("ADDR_3","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="addr3" size="30" maxlength="30" onfocus="this.select()"'

	if (action == "Change") {
		tab1Html += ' value="'+DepInfo[depIndex].addr3+'"'
	}

	tab1Html += '></td></tr>\n'
	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("ADDR_4","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="addr4" size="30" maxlength="30" onfocus="this.select()"'

	if (action == "Change") {
		tab1Html += ' value="'+DepInfo[depIndex].addr4+'"'
	}

	tab1Html += '></td></tr>\n'
	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("CITY_OR_ADDR_5","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="city" size="18" maxlength="18" onfocus="this.select()"'

	if (action == "Change") {
		tab1Html += ' value="'+DepInfo[depIndex].city+'"'
	}

	tab1Html += '></td></tr>\n'
	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("HOME_ADDR_6","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><select class="inputbox" name="state">'

	if (action == "Change") {
		tab1Html += BuildStateSelect(DepInfo[depIndex].state)
	}
	else {
		tab1Html += BuildStateSelect("")
	}

	tab1Html += '</select></td></tr>\n'
	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("HOME_ADDR_7","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="zip" size="10" maxlength="10" onfocus="this.select()"'

	if (action == "Change") {
		tab1Html += ' value="'+DepInfo[depIndex].zip+'"'
	}

	tab1Html += '><tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("COUNTRY_ONLY","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><select class="inputbox" name="country">'

	if (action == "Change") {
		tab1Html += DrawInstCtryCdSelect(DepInfo[depIndex].country_code)
	}
	else {
		tab1Html += DrawInstCtryCdSelect("")
	}

	tab1Html += '</select></td></tr>\n'
	+ '<tr style="height:30px"><td class="'+classStr+'" style="width:35%">&nbsp;</td><td>&nbsp;</td></tr>\n'
	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("JOB_PROFILE_13","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="hmphonenbr" size="15" maxlength="15" onfocus="this.select()"'

	if (action == "Change") {
		if( DepInfo[depIndex].emp_address =="H" && DepInfo[depIndex].hm_phone_nbr == "")
			tab1Html += ' value="'+DepInfo[depIndex].pa_employee_hm_phone_nbr+'"';
		else
			tab1Html += ' value="'+DepInfo[depIndex].hm_phone_nbr+'"'
	}

	tab1Html += '></td></tr>\n'
	+ '<tr id="hmctrycd" onmouseover="parent.displayHelpText(\''+frameStr+'\',\'hmctrycd\',\'cntryCdHelpText\',true)" '
	+ 'onmouseout="parent.displayHelpText(\''+frameStr+'\',\'hmctrycd\',\'cntryCdHelpText\',false)">'
	+ '<td class="'+classStr+'" style="width:35%">'+getSeaPhrase("HOME_PHONE_CNTRY_CODE_ONLY","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="hmphonecntry" size="3" maxlength="3" onfocus="this.select()"'

	if (action == "Change") {
		if( DepInfo[depIndex].emp_address =="H" && DepInfo[depIndex].hm_phone_nbr == "")
			tab1Html += ' value="'+DepInfo[depIndex].pa_employee_hm_phone_cntry+'"'
		else
			tab1Html += ' value="'+DepInfo[depIndex].hm_phone_cntry+'"'
	}

	tab1Html += '></td></tr>\n'
	+ '<tr style="height:30px"><td class="'+classStr+'" style="width:35%">&nbsp;</td><td>&nbsp;</td></tr>\n'
	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("JOB_PROFILE_11","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="wkphonenbr" size="15" maxlength="15" onfocus="this.select()"'

	if (action == "Change") {
		tab1Html += ' value="'+DepInfo[depIndex].wk_phone_nbr+'"'
	}

	tab1Html += '></td></tr>\n'
	+ '<tr><td class="'+classStr+'" style="width:35%">'+getSeaPhrase("JOB_OPENINGS_14","ESS")+'</td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="wkphoneext" size="5" maxlength="5" onfocus="this.select()"'

	if (action == "Change") {
		tab1Html += ' value="'+DepInfo[depIndex].wk_phone_ext+'"'
	}

	tab1Html += '></td></tr>\n'
	+ '<tr id="wkctrycd" onmouseover="parent.displayHelpText(\''+frameStr+'\',\'wkctrycd\',\'cntryCdHelpText\',true)" '
	+ 'onmouseout="parent.displayHelpText(\''+frameStr+'\',\'wkctrycd\',\'cntryCdHelpText\',false)">'

	if (classStr == "fieldlabelboldlite") {
		tab1Html += '<td class="'+classStr+'underline" style="width:35%">'+getSeaPhrase("WORK_PHONE_CNTRY_CODE_ONLY","ESS")+'</td>'
	}
	else {
		tab1Html += '<td class="'+classStr+'" style="width:35%">'+getSeaPhrase("WORK_PHONE_CNTRY_CODE_ONLY","ESS")+'</td>'
	}

	tab1Html += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="wkphonecntry" size="3" maxlength="3" onfocus="this.select()"'

	if (action == "Change") {
		tab1Html += ' value="'+DepInfo[depIndex].wk_phone_cntry+'"'
	}

	tab1Html += '></td></tr>\n'
	+ '<tr><td class="plaintablecell" style="width:35%">&nbsp;</td><td nowrap="">'
	+ uiButton(getSeaPhrase("UPDATE","ESS"),"parent.UpdateDependent('"+action+"');return false","margin-left:5px;margin-top:10px")

	if (!onLoad || (prm != 1 && prm != 2))
	{
		tab1Html += uiButton(getSeaPhrase("CANCEL","ESS"),"parent.CancelDependentAction()","margin-top:10px")
	}

	tab1Html += '</td></tr>\n'
	+ '</table>\n'
	+ '</form>\n'
	+ rolloverHelpText("cntryCdHelpText",getSeaPhrase("COUNTRY_CODE_HELP_TEXT","ESS"))
	+ '</body>'

	depTabs.draw = true;
	depTabs.frame = eval(frameStr);
	depTabs.tabHtml = new Array();
	depTabs.tabHtml[0] = tab0Html;
// MOD BY BILAL 	-	Removing Address Tab
//	depTabs.tabHtml[1] = tab1Html;
// END OF MOD
	if (onLoad && (prm == 1 || prm == 2)) {
		depTabs.isDetail = false;
	}
	else {
		depTabs.isDetail = true;
	}
	depTabs.create();

	var tmpObj = String(frameStr).split(".");
	var tmpId = tmpObj[tmpObj.length-1];

	if (onLoad && (prm == 1 || prm == 2)) {
   		depTabs.frame.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DEP_33","ESS");
	}
	else {
   		depTabs.frame.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DETAIL","ESS");
	}

	document.getElementById(tmpId).style.visibility = "visible";
	onLoad = false;

	// if this task has been launched as a related link, remove any processing message
	if (fromTask && typeof(parent.removeWaitAlert) == "function")
		parent.removeWaitAlert();

	fitToScreen();
}

function RefreshSSN(cBox)
{
	var ssnElm = depTabs.frame.document.maindepform.ficanbr;
	if (cBox.checked)
	{
		clearRequiredField(ssnElm);
		ssnElm.value = "";
		depTabs.frame.document.getElementById("ficaspan").style.display = "none";
		depTabs.frame.document.getElementById("ficarequiredicon").style.display = "none";
	}	
	else
	{
		depTabs.frame.document.getElementById("ficaspan").style.display = "";
		depTabs.frame.document.getElementById("ficarequiredicon").style.display = "";	
	}	
}

// PT 125466
var eventDate = "";

function UpdateDependent(action)
{
	var mainform = depTabs.frame.document.maindepform;
// MOD BY BILAL 	- Address Tab is deleted
//	var addrform = depTabs.frame.document.addrdepform;
// END OF MOD

	clearRequiredField(mainform.firstname);
	clearRequiredField(mainform.lastname);
	clearRequiredField(mainform.birthdate);
	clearRequiredField(mainform.adoptdate);
	clearRequiredField(mainform.placedate);
	clearRequiredField(mainform.ficanbr);
	clearRequiredField(depTabs.frame.document.getElementById("deptype"));
	clearRequiredField(depTabs.frame.document.getElementById("relcode"));
	clearRequiredField(depTabs.frame.document.getElementById("empaddress"));
	clearRequiredField(depTabs.frame.document.getElementById("gender"));
//	clearRequiredField(addrform.addr1);
//	clearRequiredField(addrform.hmphonenbr);
//	clearRequiredField(addrform.hmphonecntry);
//	clearRequiredField(addrform.wkphonenbr);
//	clearRequiredField(addrform.wkphonecntry);

//	if ((action == "Add" || DepInfo[currentDepIndex].emp_address =="H" ) && mainform.empaddress.selectedIndex == 1 && (NonSpace(addrform.addr1.value) != 0 || NonSpace(addrform.addr2.value) != 0 || NonSpace(addrform.addr3.value) != 0 || NonSpace(addrform.addr4.value) != 0 || NonSpace(addrform.city.value) != 0 || addrform.state.selectedIndex != 0 || NonSpace(addrform.zip.value) != 0 || addrform.country.selectedIndex != 0 ))
//	{
//		depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_0"));
//		setRequiredField(depTabs.frame.document.getElementById("empaddress"));
//		parent.seaAlert(getSeaPhrase("WRONG_ADDRESS_FIELD","ESS"));
//		mainform.empaddress.focus();
//	  return;
//	}

	if (NonSpace(mainform.firstname.value) == 0)
	{
		depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_0"));
		setRequiredField(mainform.firstname);
	   	parent.seaAlert(getSeaPhrase("FIRST_NAME","ESS"));
	   	mainform.firstname.focus();
	   	mainform.firstname.select();
	   	return;
	}

	if (NonSpace(mainform.lastname.value) == 0)
	{
		depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_0"));
		setRequiredField(mainform.lastname);
	   	parent.seaAlert(getSeaPhrase("LAST_NAME","ESS"));
	    mainform.lastname.focus();
	   	mainform.lastname.select();
	   	return;
	}

	if (NonSpace(mainform.birthdate.value) == 0)
	{
		depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_0"));
		setRequiredField(mainform.birthdate);
	   	parent.seaAlert(getSeaPhrase("BIRTHDATE","ESS"));
	   	mainform.birthdate.focus();
	   	mainform.birthdate.select();
	   	return;
	}

 	if (ValidDate(mainform.birthdate) == false)
	{
		depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_0"));
		setRequiredField(mainform.birthdate);
	   	return;
	}

	// PT 142629 160175
 if (NonSpace(mainform.adoptdate.value) && ValidDate(mainform.adoptdate) == false)
	{
		depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_0"));
		mainform.adoptdate.focus();
		mainform.adoptdate.select();
		return;
	}

	// PT 142629
	if (prm == 1 && action == "Add") // adoption life event
	{
		if (NonSpace(mainform.placedate.value) == 0)
	   	{
	   		depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_0"));
	   		setRequiredField(mainform.placedate);
	      	parent.seaAlert(getSeaPhrase("PLACEMENT_DATE","ESS"));
	      	mainform.placedate.focus();
	      	mainform.placedate.select();
	      	return;
	   	}
		if (ValidDate(mainform.placedate) == false)
	   	{
	   		depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_0"));
	   		setRequiredField(mainform.placedate);
	      	mainform.placedate.focus();
	      	mainform.placedate.select();
	      	return;
	   	}
	}
	else if (NonSpace(mainform.placedate.value) && ValidDate(mainform.placedate) == false)
	{
		depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_0"));
		setRequiredField(mainform.placedate);
		return;
	}

	if (parent.emssObjInstance.emssObj.requireDepSSN)
	{
		var ssnNotIssued = ((prm == 1 || prm == 2) && mainform.ficaissued && mainform.ficaissued.checked);
		if (!ssnNotIssued && NonSpace(mainform.ficanbr.value) == 0)
		{
			depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_0"));
			setRequiredField(mainform.ficanbr);
			parent.seaAlert(getSeaPhrase("SSN_REQUIRED","ESS"));
			mainform.ficanbr.focus();
			mainform.ficanbr.select();
			return;	
		}
	}

	if (mainform.deptype.selectedIndex == 0)
	{
		depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_0"));
		setRequiredField(depTabs.frame.document.getElementById("deptype"));
		parent.seaAlert(getSeaPhrase("DEP_45","ESS"));
	   	mainform.deptype.focus();
	   	return;
   	}

    if (mainform.relcode.selectedIndex == 0)
	{
		depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_0"));
		setRequiredField(depTabs.frame.document.getElementById("relcode"));
		parent.seaAlert(getSeaPhrase("RELATIONSHIP","ESS"));
	   	mainform.relcode.focus();
	   	return;
	}

// MOD BY BILAL	-Commenting out the logic
//    if (mainform.empaddress.selectedIndex == 0)
//	{
//		depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_0"));
//		setRequiredField(depTabs.frame.document.getElementById("empaddress"));
//		parent.seaAlert(getSeaPhrase("HOME_OR_DIFFERENT_ADDRESS","ESS"));
//	   	mainform.empaddress.focus();
//	   	return;
//	}
// END OF MOD

	if (mainform.gender.selectedIndex == 0)
	{
		depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_0"));
		setRequiredField(depTabs.frame.document.getElementById("gender"));
		parent.seaAlert(getSeaPhrase("DEP_46","ESS"));
	   	mainform.gender.focus();
	   	return;
	}

	// set focus on address tab if address field is set to "other"
	if (mainform.empaddress.selectedIndex == 2)
	{
//		if (NonSpace(addrform.addr1.value) == 0)
//		{
//			depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_1"));
//			setRequiredField(addrform.addr1);
//			parent.seaAlert(getSeaPhrase("HOME_ADDR_10","ESS"));
//			addrform.addr1.focus();
//			addrform.addr1.select();
//			return;
//		}

//		if (NonSpace(addrform.hmphonenbr.value) > 0 && !ValidPhoneEntry(addrform.hmphonenbr))
//		{
//			depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_1"));
//			setRequiredField(addrform.hmphonenbr);
//			parent.seaAlert(getSeaPhrase("PHONE_NBR_ERROR","ESS"));
//			addrform.hmphonenbr.focus();
//			addrform.hmphonenbr.select();
//			return;
//		}

//		if (NonSpace(addrform.hmphonecntry.value) > 0 && !ValidPhoneEntry(addrform.hmphonecntry))
//		{
//			depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_1"));
//			setRequiredField(addrform.hmphonecntry);
//			parent.seaAlert(getSeaPhrase("PHONE_COUNTRY_CODE_ERROR","ESS"));
//			addrform.hmphonecntry.focus();
//			addrform.hmphonecntry.select();
//			return;
//		}

//		if (NonSpace(addrform.wkphonenbr.value) > 0 && !ValidPhoneEntry(addrform.wkphonenbr))
//		{
//			depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_1"));
//			setRequiredField(addrform.wkphonenbr);
//			parent.seaAlert(getSeaPhrase("PHONE_NBR_ERROR","ESS"));
//			addrform.wkphonenbr.focus();
//			addrform.wkphonenbr.select();
//			return;
//		}

//		if (NonSpace(addrform.wkphonecntry.value) > 0 && !ValidPhoneEntry(addrform.wkphonecntry))
//		{
//			depTabs.frame.tabOnClick(depTabs.frame.document.getElementById("depTabs_TabBody_1"));
//			setRequiredField(addrform.wkphonecntry);
//			parent.seaAlert(getSeaPhrase("PHONE_COUNTRY_CODE_ERROR","ESS"));
//			addrform.wkphonecntry.focus();
//			addrform.wkphonecntry.select();
//			return;
//		}
// END OF MOD
	}

	if (prm == 1)
	{
					if(!geffectd || !NonSpace(geffectd))
					{
						//PT 153286
		 	    	geffectd = formjsDate(mainform.placedate.value);
					}
	}

	if (prm == 2)
	{
	    if(!geffectd || !NonSpace(geffectd))
	        geffectd = formjsDate(mainform.birthdate.value);
	}

	// PT 125466
	eventDate = formjsDate(mainform.birthdate.value);

// MOD BY BILAL 	- Address Form removed by Bilal
	// Make sure we pass a space for any blank address fields, or they won't be cleared on the HR13 form.
//	if (addrform.addr1.value == "") addrform.addr1.value = " ";
//	if (addrform.addr2.value == "") addrform.addr2.value = " ";
//	if (addrform.addr3.value == "") addrform.addr3.value = " ";
//	if (addrform.addr4.value == "") addrform.addr4.value = " ";
//	if (addrform.city.value == "") addrform.city.value = " ";
//	if (addrform.state.options[addrform.state.selectedIndex].value == "")
//		addrform.state.options[addrform.state.selectedIndex].value = " ";
//	if (addrform.zip.value == "") addrform.zip.value = " ";
//	if (addrform.country.options[addrform.country.selectedIndex].value == "")
//		addrform.country.options[addrform.country.selectedIndex].value = " ";
//	if (addrform.hmphonenbr.value == "") addrform.hmphonenbr.value = " ";
//	if (addrform.hmphonecntry.value == "") addrform.hmphonecntry.value = " ";
//	if (addrform.wkphonenbr.value == "") addrform.wkphonenbr.value = " ";
//	if (addrform.wkphoneext.value == "") addrform.wkphoneext.value = " ";
//	if (addrform.wkphonecntry.value == "") addrform.wkphonecntry.value = " ";
// END OF MOD

   	if (prm > 0 && action == "Add" && geffectd)
   	{
   		var object = new DMEObject(authUser.prodline, "FAMSTSHIST");
      	object.out   = "JAVASCRIPT";
	   	object.index = "FSHSET1";
	   	object.field = "dep-1;dep-2;dep-3;dep-4;dep-5;dep-6;dep-7;dep-8;dep-9"
	   	object.key   = parseInt(authUser.company,10) +"="+ parseInt(authUser.employee,10)
					 + "=" + escape(taskNm,1) + "=" + escape(geffectd,1)
	   	object.func  = "CheckFamstshist('"+action+"')";
   		DME(object, "jsreturn");
  	}
   	else
   	{

// MOD BY BILAL	- Removing Status related Condidtion
//		if (action == "Change" && mainform.status.value == "I")
//		{
			_action = action;
//			if (!parent.seaConfirm(getSeaPhrase("UPDATE_WARNING_1","ESS")+" "+getSeaPhrase("INACTIVATE_DEP_WARNING","ESS"), "", confirmInactivate))
//		   		return;
//		}   	
// END OF MOD

   		ProcessHR13(action);
	}
}

// Firefox will call this function
function confirmInactivate(confirmWin)
{
    if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
    {
        ProcessHR13(_action);
    }
}

function CheckFamstshist(action)
{
	// We found a family status history record for this life event.
	if (self.jsreturn.NbrRecs != 0)
   	{
     	familyStatusExists = true;
	  	var deps = new Array();
	   	deps[1] = self.jsreturn.record[0].dep_1;
	   	deps[2] = self.jsreturn.record[0].dep_2;
	  	deps[3] = self.jsreturn.record[0].dep_3;
		deps[4] = self.jsreturn.record[0].dep_4;
		deps[5] = self.jsreturn.record[0].dep_5;
		deps[6] = self.jsreturn.record[0].dep_6;
		deps[7] = self.jsreturn.record[0].dep_7;
		deps[8] = self.jsreturn.record[0].dep_8;
		deps[9] = self.jsreturn.record[0].dep_9;
		deps[10] = 0;

		freeES10DepNbr = 0;
      	for(var i=1; i<11; i++)
      	{
		    if (deps[i] == 0 && freeES10DepNbr != 10)
		   	{
		      	freeES10DepNbr = i;
		      	break;
		   	}
		}

		if(freeES10DepNbr == 10)
		{
			parent.seaAlert(getSeaPhrase("DEP_47","ESS"));
			return;
		}
   	}
   	else
   	{
   		freeES10DepNbr = 1;
	}
   	ProcessHR13(action);
}

function ProcessHR13(action,nowarning)
{
	var mainform = depTabs.frame.document.maindepform;
// MOD BY BILAL 	- 	Address form is removed
//	var addrform = depTabs.frame.document.addrdepform;
// END OF MOD
	var pObj = new AGSObject(authUser.prodline, "HR13.1");
	pObj.rtn = "MESSAGE";
	pObj.longNames = "ALL";
	pObj.tds = false;
	pObj.debug = false;

   	if (action == "Add")
   	{
	  	pObj.event = "ADD";
	  	pObj.field = "FC=A";
   	}
   	else
   	{
	  	pObj.event = "CHANGE";
	  	pObj.field = "FC=C";
   	}

   	pObj.field += "&EMD-COMPANY=" + escape(parseInt(authUser.company,10),1)
	+ "&EMD-EMPLOYEE=" + escape(parseInt(authUser.employee,10),1)
	+ "&EMD-SEQ-NBR=" + escape(parseInt(mainform.seqnbr.value,10),1)
	+ "&EMD-FIRST-NAME=" + escape(mainform.firstname.value,1)
	+ "&EMD-MIDDLE-INIT=" + escape(mainform.middleinit.value,1)

	if (typeof(mainform.lastnameprefix) != "undefined")
	{
		pObj.field += "&EMD-LAST-NAME-PRE=" + escape(mainform.lastnameprefix.value,1)
	}

	pObj.field += "&EMD-LAST-NAME=" + escape(mainform.lastname.value,1)

	if (typeof(mainform.namesuffix) != "undefined")
	{
		pObj.field += "&EMD-NAME-SUFFIX="
		+ escape(mainform.namesuffix.options[mainform.namesuffix.selectedIndex].value,1)
	}

	var depAddr = mainform.empaddress.options[mainform.empaddress.selectedIndex].value;

	// PT 149243. Force a 00000000 date value into blank date fields.
	pObj.field += "&EMD-BIRTHDATE=" + ((NonSpace(mainform.birthdate.value) == 0) ? "00000000" : escape(formjsDate(mainform.birthdate.value),1))
	pObj.field += "&EMD-PLACEMENT-DATE=" + ((NonSpace(mainform.placedate.value) == 0) ? "00000000" : escape(formjsDate(mainform.placedate.value),1))
	pObj.field += "&EMD-ADOPTION-DATE=" + ((NonSpace(mainform.adoptdate.value) == 0) ? "00000000" : escape(formjsDate(mainform.adoptdate.value),1))

	pObj.field += "&EMD-FICA-NBR=" + escape(mainform.ficanbr.value,1)
	+ "&EMD-DEP-TYPE=" + escape(mainform.deptype.options[mainform.deptype.selectedIndex].value,1)
	+ "&EMD-REL-CODE=" + escape(mainform.relcode.options[mainform.relcode.selectedIndex].value,1)
	+ "&EMD-EMP-ADDRESS=" + escape(depAddr,1)
	+ "&EMD-SEX=" + escape(mainform.gender.options[mainform.gender.selectedIndex].value,1)
	+ "&EMD-DISABLED=" + escape(mainform.disabled.options[mainform.disabled.selectedIndex].value,1)
// MOD BY BILAL
//	+ "&EMD-SMOKER=" + escape(mainform.smoker.options[mainform.smoker.selectedIndex].value,1)
//	+ "&EMD-PRIMARY-CARE=" + escape(mainform.pcpcode.options[mainform.pcpcode.selectedIndex].value,1)
// END OF MOD
	if (!isStudent || escape(mainform.student.options[mainform.student.selectedIndex].value,1) == "N")
	{	
		pObj.field += "&EMD-STUDENT=" + escape(mainform.student.options[mainform.student.selectedIndex].value,1)
	}
	
	if (depAddr == "H")
	{
		pObj.field += "&EMD-ADDR1=" + escape(" ",1)  // the dependent address fields are
		+ "&EMD-ADDR2=" + escape(" ",1)  // blank because the address is the
		+ "&EMD-ADDR3=" + escape(" ",1)  // employee's home address
		+ "&EMD-ADDR4=" + escape(" ",1)
		+ "&EMD-CITY=" + escape(" ",1)
		+ "&EMD-STATE=" + escape(" ",1)
		+ "&EMD-ZIP=" + escape(" ",1)
		+ "&EMD-COUNTRY-CODE=" + escape(" ",1)
// MOD BY BILAL  - Adress tab is removed
//		+ "&EMD-WK-PHONE-NBR=" + escape(addrform.wkphonenbr.value,1)
//		+ "&EMD-WK-PHONE-EXT=" + escape(addrform.wkphoneext.value,1)
//		+ "&EMD-WK-PHONE-CNTRY=" + escape(addrform.wkphonecntry.value,1)
//		if(addrform.hmphonenbr.value =="")
//		{
//		 pObj.field += "&EMD-HM-PHONE-CNTRY=" + escape(DepInfo[depIndex].pa_employee_hm_phone_cntry,1)
//		 + "&EMD-HM-PHONE-NBR=" + escape(DepInfo[depIndex].pa_employee_hm_phone_nbr,1)
//		}
//		else
//		{
//		 pObj.field +=  "&EMD-HM-PHONE-CNTRY=" + escape(addrform.hmphonecntry.value,1)
//		+ "&EMD-HM-PHONE-NBR=" + escape(addrform.hmphonenbr.value,1)

//		}
	}
	else
	{
//		pObj.field += "&EMD-ADDR1=" + escape(addrform.addr1.value,1)
//		+ "&EMD-ADDR2=" + escape(addrform.addr2.value,1)
//		+ "&EMD-ADDR3=" + escape(addrform.addr3.value,1)
//		+ "&EMD-ADDR4=" + escape(addrform.addr4.value,1)
//		+ "&EMD-CITY=" + escape(addrform.city.value,1)
//		+ "&EMD-STATE=" + escape(addrform.state.value,1)
//		+ "&EMD-ZIP=" + escape(addrform.zip.value,1)
//		+ "&EMD-COUNTRY-CODE=" + escape(addrform.country.options[addrform.country.selectedIndex].value,1)
//		+ "&EMD-HM-PHONE-CNTRY=" + escape(addrform.hmphonecntry.value,1)
//		+ "&EMD-HM-PHONE-NBR=" + escape(addrform.hmphonenbr.value,1)
//		+ "&EMD-WK-PHONE-NBR=" + escape(addrform.wkphonenbr.value,1)
//		+ "&EMD-WK-PHONE-EXT=" + escape(addrform.wkphoneext.value,1)
//		+ "&EMD-WK-PHONE-CNTRY=" + escape(addrform.wkphonecntry.value,1)
	}

	if (action == "Change" && mainform.status.value == "I")
		pObj.field += "&EMD-ACTIVE-FLAG=I"
	else
		pObj.field += "&EMD-ACTIVE-FLAG=A"

	if (nowarning) pObj.field += "&PT-XMIT-NBR1=1"

   	pObj.func = "parent.DisplayHR13Message('"+action+"')";
	try {
		if (fromTask) {
			parent.showWaitAlert(getSeaPhrase("HOME_ADDR_42","ESS"));
		}
	}
	catch(e) {}
	self.lawheader.formCheck = "HR13";
   	AGS(pObj,"jsreturn");
}

function DisplayHR13Message(action)
{
	var msgnbr = parseInt(self.lawheader.gmsgnbr,10);

   	if (msgnbr == 0)
   	{
      	if (prm > 0 && action == "Add" && geffectd)
      	{
         	ProcessES10();
	  	}
	  	else
	  	{
	  		if (fromTask && typeof(parent.removeWaitAlert) == "function")
				parent.removeWaitAlert();
			DependentUpdateComplete();
   		}
   	}
   	else if (msgnbr == 130)
   	{
   		if (fromTask && typeof(parent.removeWaitAlert) == "function")
			parent.removeWaitAlert();
		self.lawheader.msgnbr = "000";
		self.lawheader.gmsg = " ";
	   	parent.seaAlert(getSeaPhrase("DEP_48","ESS"));
	   	DependentUpdateComplete();
	}
	else if (msgnbr == 134)
	{
		if (fromTask && typeof(parent.removeWaitAlert) == "function")
			parent.removeWaitAlert();
		var errmsg = "";
		if (typeof(EmpInfo) != "undefined" && typeof(EmpInfo.employee_work_country) != "undefined")
		{
			errmsg += GetFicaErrMsg(EmpInfo.employee_work_country);
		}
  		else if (typeof(CurrentDep) != "undefined" && typeof(CurrentDep.employee_work_country) != "undefined")
		{
     	 	errmsg += GetFicaErrMsg(CurrentDep.employee_work_country);
		}
		else
		{
			errmsg += getSeaPhrase("DEP_19","ESS");
		}
		_action = action;
		if (parent.seaConfirm(errmsg, "", handleConfirmResponse))
		{
			ProcessHR13(action,true);
		}
	}
	else
	{
		if (fromTask && typeof(parent.removeWaitAlert) == "function")
			parent.removeWaitAlert();
		parent.seaAlert(self.lawheader.gmsg);
	}
}

// Firefox will call this function
function handleConfirmResponse(confirmWin)
{
	if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
	{
		ProcessHR13(_action,true);
	}
}

function ProcessES10()
{
	var mainform = depTabs.frame.document.maindepform;

	var pObj = new AGSObject(authUser.prodline, "ES10.1");
    pObj.rtn = "MESSAGE";
   	pObj.longNames = "ALL";
   	pObj.tds = false;
	pObj.debug = false;

   	if (familyStatusExists)
   	{
      	pObj.event = "CHANGE";
   	  	pObj.field = "FC=C";
   	}
   	else
   	{
      	pObj.event = "ADD";
   	  	pObj.field = "FC=A";
   	}

	pObj.field += "&FSH-COMPANY=" + escape(parseInt(authUser.company,10),1)
    + "&FSH-EMPLOYEE=" + escape(parseInt(authUser.employee,10),1)
   	+ "&FSH-FAMILY-STATUS=" + escape(taskNm,1)
   	+ "&FSH-EFFECT-DATE=" + escape(geffectd,1)
	+ "&FSH-DEP-" + freeES10DepNbr + "=" + escape(parseInt(mainform.seqnbr.value,10),1)

   	pObj.func = "parent.DisplayES10Message()";
	try {
		if (fromTask) {
			parent.showWaitAlert(getSeaPhrase("HOME_ADDR_42","ESS"));
		}
	}
	catch(e) {}
	self.lawheader.formCheck = "ES10";
	AGS(pObj,"jsreturn");
}

function DisplayES10Message()
{
	if (fromTask && typeof(parent.removeWaitAlert) == "function")
		parent.removeWaitAlert();
   	if (parseInt(self.lawheader.gmsgnbr,10) == 0)
   	{
   		DependentUpdateComplete();
   	}
   	else
   	{
   		parent.seaAlert(self.lawheader.gmsg);
	}
}

function DependentUpdateComplete()
{
	ShowListButtons();
	parent.seaAlert(getSeaPhrase("DEP_0","ESS"));
	document.getElementById("right").style.visibility = "hidden";
	document.getElementById("leftform").style.visibility = "hidden";
	depTabs.frame.document.maindepform.reset();
// MOD BY BILAL	-	ADDRESS form is removed
//	depTabs.frame.document.addrdepform.reset();
// END OF MOD

	switch (prm)
	{
		case 1:
				document.getElementById("leftform").style.visibility = "hidden";
				break;
		case 2:
				document.getElementById("leftform").style.visibility = "hidden";
				break;
		default: break;
	}

	GetEmdepend();
}

function CancelDependentAction()
{
	deactivateTableRows("depTbl",self.left);

	try {
		self.document.getElementById("right").style.visibility = "hidden";
		ShowListButtons();
	}
	catch(e) {}
}

function OpenHelpDialog()
{
	if (isEnwisenEnabled() && (taskNm == "ADOPTION" || taskNm == "BIRTH"))
		openEnwisenWindow("id=" + taskNm);
	else
		openHelpDialogWindow("/lawson/xhrnet/dependenthelp.htm");
}

function fitToScreen()
{
	if (typeof(window["styler"]) == "undefined" || window.styler == null)
	{
		window.stylerWnd = findStyler(true);
	}

	if (!window.stylerWnd)
	{
		return;
	}

	if (typeof(window.stylerWnd["StylerEMSS"]) == "function")
	{
		window.styler = new window.stylerWnd.StylerEMSS();
	}
	else
	{
		window.styler = window.stylerWnd.styler;
	}

	var leftFrame = document.getElementById("left");
	var rightFrame = document.getElementById("right");
	var leftFormFrame = document.getElementById("leftform");
	var fullRelatedTaskFrame = document.getElementById("fullrelatedtask");
	var winHeight = 464;
	var winWidth = 400;

	// resize the table frame to the screen dimensions
	if (document.body.clientHeight)
	{
		winHeight = document.body.clientHeight;
		winWidth = document.body.clientWidth;
	}
	else if (window.innerHeight)
	{
		winHeight = window.innerHeight;
		winWidth = window.innerWidth;
	}

	var contentLeftWidth = (window.styler && window.styler.showLDS) ? (parseInt(winWidth*.49,10) - 17) : ((navigator.appName.indexOf("Microsoft") >= 0) ? (parseInt(winWidth*.49,10) - 12) : (parseInt(winWidth*.49,10) - 7));
	var contentRightWidth = (window.styler && window.styler.showLDS) ? (parseInt(winWidth*.51,10) - 17) : ((navigator.appName.indexOf("Microsoft") >= 0) ? (parseInt(winWidth*.51,10) - 12) : (parseInt(winWidth*.51,10) - 7));
	var fullContentWidth = (window.styler && window.styler.showLDS) ? (winWidth - 17) : ((navigator.appName.indexOf("Microsoft") >= 0) ? (winWidth - 12) : (winWidth - 7));

	leftFrame.style.width = parseInt(winWidth*.49,10) + "px";
	leftFrame.style.height = (winHeight - 30) + "px";
	try
	{
		self.left.document.getElementById("paneBodyBorder").style.width = contentLeftWidth + "px";
		self.left.document.getElementById("paneBodyBorder").style.height = (winHeight - 35) + "px";
		self.left.document.getElementById("paneBody").style.width = contentLeftWidth + "px";
		self.left.document.getElementById("paneBody").style.height = (winHeight - 65) + "px";
		self.left.document.getElementById("depTbl").style.width = "100%";
	}
	catch(e)
	{}
	rightFrame.style.left = parseInt(winWidth*.49,10) + "px";
	rightFrame.style.width = parseInt(winWidth*.51 - 22,10) + "px";
	rightFrame.style.height = (winHeight - 30) + "px";
	// disable the onresize window event if it exists - we don't want the elements in the frame to resize themselves
	if (self.right.onresize && self.right.onresize.toString().indexOf("setLayerSizes") >= 0)
	{
		self.right.onresize = null;
	}
	try
	{
		self.right.document.getElementById("paneBodyBorder").style.width = contentRightWidth + "px";
		self.right.document.getElementById("paneBodyBorder").style.height = (winHeight - 35) + "px";
		self.right.document.getElementById("paneBody").style.width = "100%";
	}
	catch(e)
	{}
	leftFormFrame.style.width = parseInt(winWidth*.49,10) + "px";
	leftFormFrame.style.height = (winHeight - 30) + "px";
	// disable the onresize window event if it exists - we don't want the elements in the frame to resize themselves
	if (self.leftform.onresize && self.leftform.onresize.toString().indexOf("setLayerSizes") >= 0)
	{
		self.leftform.onresize = null;
	}
	try
	{
		self.leftform.document.getElementById("paneBodyBorder").style.width = contentLeftWidth + "px";
		self.leftform.document.getElementById("paneBodyBorder").style.height = (winHeight - 35) + "px";
		self.leftform.document.getElementById("paneBody").style.width = "100%";
	}
	catch(e)
	{}
	fullRelatedTaskFrame.style.width = winWidth + "px";
	fullRelatedTaskFrame.style.height = (winHeight - 30) + "px";
	try
	{
		self.fullrelatedtask.document.getElementById("paneBodyBorder").style.width = fullContentWidth + "px";
		self.fullrelatedtask.document.getElementById("paneBodyBorder").style.height = (winHeight - 35) + "px";
		self.fullrelatedtask.document.getElementById("paneBody").style.width = "100%";
	}
	catch(e)
	{}
	try
	{
		var tabWidth = (depTabs.frame.id == "right") ? contentRightWidth : contentLeftWidth;
		setTabContentSizes("depTabs", depTabs.frame, tabWidth, winHeight - 35);
	}
	catch(e)
	{}
}
</script>
<!-- MOD BY BILAL - Prior Customizations-->
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-395426-5");
pageTracker._trackPageview();
} catch(err) {}</script>
<!-- END OF MOD  -->
</head>
<body style="overflow:hidden" onload="fitToScreen();LoadDependents()" onresize="fitToScreen()">
	<iframe id="left" name="left" src="/lawson/xhrnet/ui/headerpane.htm" style="visibility:hidden;position:absolute;left:0px;width:49%;top:0px;height:555px" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="right" name="right" src="/lawson/xhrnet/ui/innertabpanehelplite.htm" style="visibility:hidden;position:absolute;left:49%;width:51%;top:0px;height:555px" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="leftform" name="leftform" src="/lawson/xhrnet/ui/innertabpanehelp.htm" style="visibility:hidden;position:absolute;left:0px;width:51%;top:0px;height:555px" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="fullrelatedtask" name="fullrelatedtask" style="left:0px;top:0px;position:absolute;width:803px;height:464px;visibility:hidden" src="/lawson/xhrnet/dot.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="jsreturn" name="jsreturn" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/dot.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="lawheader" name="lawheader" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/nerrmsg.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@(201111) 09.00.01.06.09 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/dependents.htm,v 1.16.2.49.4.1 2011/11/16 07:36:36 juanms Exp $ -->
