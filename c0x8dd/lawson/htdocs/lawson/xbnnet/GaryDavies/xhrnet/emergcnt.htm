<html>
<head>
<title>Emergency Contacts</title>
<meta name="viewport" content="width=device-width" />
<META HTTP-EQUIV="Pragma" CONTENT="No-Cache">
<META HTTP-EQUIV="Expires" CONTENT="Mon, 01 Jan 1990 00:00:01 GMT">
<script src="/lawson/webappjs/common.js"></script>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/webappjs/transaction.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/xhrnet/statesuscan.js"></script>
<script src="/lawson/xhrnet/instctrycdselect.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script>
var parentTask = "";
var fromTask = (window.location.search)?unescape(window.location.search):"";
var EmergencyContacts = new Array();
var EmergencyContent;
var emergcntWind;
var empNbr;
var empName;
var appObj;

if (fromTask) {
	parentTask = getVarFromString("from",fromTask);
	if (parentTask == "directreports") {
		empNbr = getVarFromString("number",fromTask);
		empName = getVarFromString("name",fromTask);
	}
	fromTask = (parentTask != "") ? fromTask : "";
}

function OpenEmergency()
{
	// Netscape 6.2+ does not properly size the iframes by percentages at load time
	if (!document.all) {
		document.getElementById("LEFT").style.width = parseInt(window.innerWidth*.49,10)+"px";
		document.getElementById("RIGHT").style.left = parseInt(window.innerWidth*.49,10)+"px";
		document.getElementById("RIGHT").style.width = parseInt(window.innerWidth*.51,10)+"px";
	}
	authenticate("frameNm='jsreturn'|funcNm='GetCountryCodes()'|desiredEdit='EM'");
}

function GetCountryCodes()
{
	stylePage();

	if (fromTask) {
		parent.document.getElementById(window.name).style.visibility = "visible";
		parent.showWaitAlert(getSeaPhrase("WAIT","ESS"));
	}

	if (!fromTask || parentTask != "directreports")
		empNbr = authUser.employee;

	document.title = getSeaPhrase("EMERGENCY_CONTACTS", "ESS");
	GetInstCtryCdSelect(authUser.prodline,"GetStateCodes()")
}

function GetStateCodes()
{
	GrabStates("GetAppVersion()")
}

function GetAppVersion()
{
	appObj = new AppVersionObject(authUser.prodline, "HR");
	GetPaemergcnt();
}

function GetPaemergcnt()
{
	// if you call getAppVersion() right away and the IOS object isn't set up yet,
	// then the code will be trying to load the sso.js file, and your call for
	// the appversion will complete before the ios version is set
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
       	setTimeout(function(){ GetPaemergcnt(); }, 10);
       	return;
	}

	EmergencyContacts = new Array();

	if (typeof(emergcntWind) != "undefined" && emergcntWind != null && !emergcntWind.closed) {
		emergcntWind.close();
	}

	var dmeObj 		= new DMEObject(authUser.prodline, "paemergcnt")
	dmeObj.out 		= "JAVASCRIPT"
	dmeObj.index 	= "paeset1"
	dmeObj.field  	= "label-name;first-name;last-name;relationship;"
					+ "addr1;addr2;addr3;addr4;city;state;zip;hm-phone-cntry;"
					+ "hm-phone-nbr;wk-phone-cntry;wk-phone-nbr;wk-phone-ext;"
					+ "country.country-desc;country.country-code;seq-nbr"
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "8.1.1")
	{
		dmeObj.field += ";cl-phone-nbr;cl-phone-cntry"
	}
	dmeObj.key 		= parseInt(authUser.company,10) + "=" + parseInt(empNbr,10)
	DME(dmeObj, "jsreturn")
}

function DspPaemergcnt()
{
	EmergencyContacts = EmergencyContacts.concat(self.jsreturn.record)

	if (self.jsreturn.Next != "")
	{
		self.jsreturn.location.replace(self.jsreturn.Next)
		return
	}

	document.getElementById("RIGHT").style.visibility = "hidden";
	document.getElementById("LEFT").style.visibility = "visible";

	var bodyHtml = ''

	if (EmergencyContacts.length)
	{
		var detailFunc = "UpdateContact";
		if (fromTask && parentTask == "directreports")
			detailFunc = "ViewContact";
		bodyHtml += '<table id="emergencyTbl" class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%">'

		for (var i=0; i<EmergencyContacts.length; i++)
		{
		   	contact = EmergencyContacts[i];
		   	//if (i%2 == 0)
		   		var tblRow = '<tr>'
		   	//else
		   	//	var tblRow = '<tr class="tablerowhighlight">'
			bodyHtml += tblRow+'<td class="plaintablerowheaderborder" align="right" width="50%" style="border-bottom:0px;padding-top:5px">'+getSeaPhrase("NAME","ESS")+'</td>'
			+ '<td class="plaintablecellborderdisplay" style="border-bottom:0px;padding-top:5px"><a href="" onclick="parent.'+detailFunc+'('+i+','+((i*5)-1)+');return false" nowrap>'+contact.label_name+'</a></td>'
			+ '</tr>'+tblRow+'<td class="plaintablerowheaderborder" align="right" width="50%" style="border-bottom:0px">'+getSeaPhrase("DEP_23","ESS")+'</td>'
			+ '<td class="plaintablecellborderdisplay" style="border-bottom:0px" nowrap>'+((contact.relationship)?contact.relationship:'&nbsp;')+'</td>'
			//PT 161513 align right property removed from column (td)

			if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "8.1.1")
			{
				bodyHtml += '</tr>'+tblRow+'<td class="plaintablerowheaderborder" align="right" width="50%" style="border-bottom:0px">'+getSeaPhrase("CELL_TELEPHONE","ESS")+'</td>'
				+ '<td class="plaintablecellborderdisplay" style="border-bottom:0px" nowrap>'+((contact.cl_phone_cntry)?contact.cl_phone_cntry+'&nbsp;':'')+((contact.cl_phone_nbr)?contact.cl_phone_nbr:'&nbsp;')+'</td>'
			}

			bodyHtml += '</tr>'+tblRow+'<td class="plaintablerowheaderborder" align="right" width="50%" style="border-bottom:0px">'+getSeaPhrase("HOME_TELEPHONE","ESS")+'</td>'
			+ '<td class="plaintablecellborderdisplay"  style="border-bottom:0px" nowrap>'+((contact.hm_phone_cntry)?contact.hm_phone_cntry+'&nbsp;':'')+((contact.hm_phone_nbr)?contact.hm_phone_nbr:'&nbsp;')+'</td>'
			+ '</tr>'+tblRow+'<td class="plaintablerowheaderborder" align="right" width="50%" style="padding-bottom:5px">'+getSeaPhrase("WORK_TELEPHONE","ESS")+'</td>'
			+ '<td class="plaintablecellborderdisplay"  style="padding-bottom:5px" nowrap>'+((contact.wk_phone_cntry)?contact.wk_phone_cntry+'&nbsp;':'')+((contact.wk_phone_nbr)?contact.wk_phone_nbr:'&nbsp;')+'</td>'
			+ '</tr>'
		}
	    bodyHtml += '</table>'
	}

	bodyHtml += '<div style="width:100%;text-align:right;padding-right:5px">'
	if (fromTask && parentTask != "main")
	{
		if (parentTask == "directreports") {
			bodyHtml += uiButton(getSeaPhrase("BACK","ESS"),"parent.parent.backToMain('emergencycontacts');return false")
		} else {
			bodyHtml += uiButton(getSeaPhrase("ADD","ESS"),"parent.NewContact();return false",false,"addbtn");
			bodyHtml += uiButton(getSeaPhrase("CLOSE","ESS"),"parent.CloseEmergency();return false",false,"closebtn");
		}
	}
	else
	{
		bodyHtml += uiButton(getSeaPhrase("ADD","ESS"),"parent.NewContact();return false",false,"addbtn");
	}
	bodyHtml += '</div>'

	if (fromTask && parentTask == "directreports" && empName) {
		self.LEFT.document.getElementById("paneHeader").innerHTML = getSeaPhrase("CONTACTS","ESS")+' - '+empName;
	} else {
		self.LEFT.document.getElementById("paneHeader").innerHTML = getSeaPhrase("CONTACTS","ESS");
	}

	var strHtml = '<div class="fieldlabelbold" style="text-align:left;padding-left:20px;padding-right:20px;padding-top:10px">'
	if (fromTask && parentTask == "directreports") {
		if (EmergencyContacts.length > 0) {
			strHtml += getSeaPhrase("VIEW_EMERGENCY_CONTACT","ESS");
		} else {
			strHtml += getSeaPhrase("NO_EMP_CONTACTS","ESS");
		}
		strHtml += '</div><p/><div style="overflow:hidden">'+bodyHtml+'</div>';
	} else {
		strHtml += getSeaPhrase("ADD_EMERG_CONTACT","ESS")
		+'<p/>'
		+((EmergencyContacts.length)?getSeaPhrase("CHG_EMERG_CONTACT","ESS"):'')
		+'</div><p/><div style="overflow:hidden">'+bodyHtml+'</div>';
	}

	self.LEFT.document.getElementById("paneBody").innerHTML = strHtml;
	self.LEFT.stylePage();
	self.LEFT.setLayerSizes();
	// if this task has been launched as a related link, remove any processing message
	if (fromTask && typeof(parent.removeWaitAlert) == "function")
		parent.removeWaitAlert();
}

function CloseEmergency()
{
	try {
		parent.document.getElementById("fullrelatedtask").style.visibility = "hidden";
		parent.document.getElementById("relatedtask").style.visibility = "hidden";
		parent.document.getElementById("right").style.visibility = "hidden";
		parent.document.getElementById("left").style.visibility = "visible";
	}
	catch(e) {}

	// display the checkmark indicating that this task has been accessed.
	try {
		parent.left.setImageVisibility("emergencycontacts_checkmark","visible");
	}
	catch(e) {}
}

function UpdateContact(i,rowNbr)
{
	activateTableRow("emergencyTbl",rowNbr,self.LEFT);

	obj = EmergencyContacts[i];

// MOD BY BILAL
//ISH 2007 Change to Upper case when save as obj.value.toUpperCase()
	EmergencyContent = '<form name="contactform"><table border="0" cellspacing="0" cellpadding="0" style="width:100%;height:100%">'
	+ '<tr style="padding-top:5px"><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("DEP_34","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="firstname" value="' + obj.first_name
	+ '" size=14 maxlength=14 onfocus=this.select() onblur="this.value=this.value.toUpperCase()">'+uiRequiredIcon()
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("DEP_38","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="lastname" value="' + obj.last_name
	+ '" size=30 maxlength=30 onfocus=this.select() onblur="this.value=this.value.toUpperCase()">'+uiRequiredIcon()
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("DEP_23","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="relationship" value="' + obj.relationship
	+ '" size=30 maxlength=30 onfocus=this.select() onblur="this.value=this.value.toUpperCase()">'
// END OF MOD

	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "8.1.1")
	{
		EmergencyContent += '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("CELL_PHONE","ESS")
		+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="clphonenbr" value="' + obj.cl_phone_nbr
		+ '" size=15 maxlength=15 onfocus=this.select()>'
// MOD BY BILAL
// JRZ removing Cell phone country - hiding the row.
		+ '<tr id="clctrycd" style="display:none" onmouseover="parent.displayHelpText(\'self.RIGHT\',\'clctrycd\',\'cntryCdHelpText\',true)" '
		+ 'onmouseout="parent.displayHelpText(\'self.RIGHT\',\'clctrycd\',\'cntryCdHelpText\',false)">'
		+ '<th class="fieldlabelboldlite" align="left">'+getSeaPhrase("CELL_PHONE_CNTRY_CODE","ESS")
		+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="clphonecntry" value="' + obj.cl_phone_cntry
		+ '" size=3 maxlength=3 onfocus=this.select()>'
// END OF MOD
	}

	EmergencyContent += '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("HOME_PHONE_ONLY","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="hmphonenbr" value="' + obj.hm_phone_nbr
	+ '" size=15 maxlength=15 onfocus=this.select()>'
// MOD BY BILAL
// JRZ removing home phone country - hiding the row.
	+ '<tr id="hmctrycd" style="display:none" onmouseover="parent.displayHelpText(\'self.RIGHT\',\'hmctrycd\',\'cntryCdHelpText\',true)" '
	+ 'onmouseout="parent.displayHelpText(\'self.RIGHT\',\'hmctrycd\',\'cntryCdHelpText\',false)">'
	+ '<th class="fieldlabelboldlite" align="left">'+getSeaPhrase("HOME_PHONE_CNTRY_CODE_ONLY","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="hmphonecntry" value="' + obj.hm_phone_cntry
	+ '" size=3 maxlength=3 onfocus=this.select()>'
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("WORK_PHONE_ONLY","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="wkphonenbr" value="' + obj.wk_phone_nbr
	+ '" size=15 maxlength=15 onfocus=this.select()>'
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("JOB_OPENINGS_14","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="wkphoneext" value="' + obj.wk_phone_ext
	+ '" size=5 maxlength=5 onfocus=this.select()>'
// JRZ removing work phone country  - hiding the row 
	+ '<tr id="wkctrycd" style="display:none" onmouseover="parent.displayHelpText(\'self.RIGHT\',\'wkctrycd\',\'cntryCdHelpText\',true)" '
	+ 'onmouseout="parent.displayHelpText(\'self.RIGHT\',\'wkctrycd\',\'cntryCdHelpText\',false)">'
	+ '<th class="fieldlabelboldlite" align="left">'+getSeaPhrase("WORK_PHONE_CNTRY_CODE_ONLY","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="wkphonecntry" value="' + obj.wk_phone_cntry
	+ '" size=3 maxlength=3 onfocus=this.select()>'
// END OF MOD
// MOD BY BILAL
//ISH 2007 Change to Upper case when save as obj.value.toUpperCase()
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("ADDR_1","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="addr1" value="' + obj.addr1
	+ '" size=30 maxlength=30 onfocus=this.select() onblur="this.value=this.value.toUpperCase()">'
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("ADDR_2","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="addr2" value="' + obj.addr2
	+ '" size=30 maxlength=30 onfocus=this.select()  onblur="this.value=this.value.toUpperCase()">'
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("ADDR_3","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="addr3" value="' + obj.addr3
	+ '" size=30 maxlength=30 onfocus=this.select() onblur="this.value=this.value.toUpperCase()">'
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("ADDR_4","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="addr4" value="' + obj.addr4
	+ '" size=30 maxlength=30 onfocus=this.select() onblur="this.value=this.value.toUpperCase()">'
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("CITY_OR_ADDR_5","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="city" value="' + obj.city
	+ '" size=18 maxlength=18 onfocus=this.select() onblur="this.value=this.value.toUpperCase()">'
// END OF MOD
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("HOME_ADDR_6","ESS")
	+ '<td class="plaintablecell" nowrap><select class="inputbox" name="state">' + BuildStateSelect(obj.state) + '</select>'
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("HOME_ADDR_7","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="zip" value="' + obj.zip
	+ '" size=10 maxlength=10 onfocus=this.select()>'
	+ '<tr><th class="fieldlabelboldliteunderline" align="left">'+getSeaPhrase("COUNTRY_ONLY","ESS")
	+ '<td class="plaintablecell" nowrap><span id="countryCell"><select class="inputbox" name="country">' + DrawInstCtryCdSelect(obj.country_country_code) + '</select></span>'
	+ '<tr><td>&nbsp;</td><td class="plaintablecell" align="left">'
	+ uiButton(getSeaPhrase("UPDATE","ESS"),"parent.ProcessContact();return false","margin-top:10px")
	+ uiButton(getSeaPhrase("CANCEL","ESS"),"parent.CloseEmergencyDetail();return false","margin-top:10px;margin-right:15px")
	+ uiButton(getSeaPhrase("DELETE","ESS"),"parent.DeleteContact("+i+");return false","margin-top:10px")
	+ '</table>'
	+ '<input class="inputbox" type=hidden name="seqnbr" value="' + obj.seq_nbr + '">'
	+ '<input class="inputbox" type=hidden name="fc" value="C">'
	+ '</form>'
	+ rolloverHelpText("cntryCdHelpText",getSeaPhrase("COUNTRY_CODE_HELP_TEXT","ESS"))
	+ uiRequiredFooter()

	try {
		self.RIGHT.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DETAIL","ESS");
		self.RIGHT.document.getElementById("paneBody").innerHTML = EmergencyContent;
		self.RIGHT.stylePage();
    	self.RIGHT.setLayerSizes();
    	self.RIGHT.document.contactform.firstname.focus();
	}
	catch(e) {}
	SetBtnVisibility("hidden");
	document.getElementById("RIGHT").style.visibility = "visible";
}

function ViewContact(i,rowNbr)
{
	activateTableRow("emergencyTbl",rowNbr,self.LEFT);

	obj = EmergencyContacts[i];

	EmergencyContent = '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" style="width:100%;height:100%">'
	+ '<tr style="padding-top:5px"><th class="plaintablerowheaderlite" style="text-align:right;width:50%">'+getSeaPhrase("DEP_34","ESS") + '</th>'
	+ '<td class="plaintablecelldisplay" nowrap>' + obj.first_name + '</td></tr>'
	+ '<tr><th class="plaintablerowheaderlite" style="text-align:right;width:50%">'+getSeaPhrase("DEP_38","ESS") + '</th>'
	+ '<td class="plaintablecelldisplay" nowrap>' + obj.last_name + '</td></tr>'
	+ '<tr><th class="plaintablerowheaderborderlite" style="text-align:right;width:50%">'+getSeaPhrase("DEP_23","ESS") + '</th>'
	+ '<td class="plaintablecellborderdisplay" nowrap>' + ((obj.relationship)?obj.relationship:'&nbsp;') + '</td></tr>'

	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "8.1.1")
	{
		EmergencyContent += '<tr><th class="plaintablerowheaderlite" style="text-align:right;width:50%">'+getSeaPhrase("CELL_PHONE","ESS") + '</th>'
		+ '<td class="plaintablecelldisplay" nowrap>' + obj.cl_phone_nbr + '</td></tr>'
		+ '<tr><th class="plaintablerowheaderlite" style="text-align:right;width:50%">'+getSeaPhrase("CELL_PHONE_CNTRY_CODE","ESS") + '</th>'
		+ '<td class="plaintablecelldisplay" nowrap>' + obj.cl_phone_cntry + '</td></tr>'
	}

	EmergencyContent += '<tr><th class="plaintablerowheaderlite" style="text-align:right;width:50%">'+getSeaPhrase("HOME_PHONE_ONLY","ESS") + '</th>'
	+ '<td class="plaintablecelldisplay" nowrap>' + obj.hm_phone_nbr + '</td></tr>'
	+ '<tr><th class="plaintablerowheaderlite" style="text-align:right;width:50%">'+getSeaPhrase("HOME_PHONE_CNTRY_CODE_ONLY","ESS") + '</th>'
	+ '<td class="plaintablecelldisplay" nowrap>' + obj.hm_phone_cntry + '</td></tr>'
	+ '<tr><th class="plaintablerowheaderlite" style="text-align:right;width:50%">'+getSeaPhrase("WORK_PHONE_ONLY","ESS") + '</th>'
	+ '<td class="plaintablecelldisplay" nowrap>' + obj.wk_phone_nbr + '</td></tr>'
	+ '<tr><th class="plaintablerowheaderlite" style="text-align:right;width:50%">'+getSeaPhrase("JOB_OPENINGS_14","ESS") + '</th>'
	+ '<td class="plaintablecelldisplay" nowrap>' + obj.wk_phone_ext + '</td></tr>'
	+ '<tr><th class="plaintablerowheaderborderlite" style="text-align:right;width:50%">'+getSeaPhrase("WORK_PHONE_CNTRY_CODE_ONLY","ESS") + '</th>'
	+ '<td class="plaintablecellborderdisplay" nowrap>' + ((obj.wk_phone_cntry)?obj.wk_phone_cntry:'&nbsp;') + '</td></tr>'
	+ '<tr><th class="plaintablerowheaderlite" style="text-align:right;width:50%">'+getSeaPhrase("ADDR_1","ESS") + '</th>'
	+ '<td class="plaintablecelldisplay" nowrap>' + obj.addr1 + '</td></tr>'
	+ '<tr><th class="plaintablerowheaderlite" style="text-align:right;width:50%">'+getSeaPhrase("ADDR_2","ESS") + '</th>'
	+ '<td class="plaintablecelldisplay" nowrap>' + obj.addr2 + '</td></tr>'
	+ '<tr><th class="plaintablerowheaderlite" style="text-align:right;width:50%">'+getSeaPhrase("ADDR_3","ESS") + '</th>'
	+ '<td class="plaintablecelldisplay" nowrap>' + obj.addr3 + '</td></tr>'
	+ '<tr><th class="plaintablerowheaderlite" style="text-align:right;width:50%">'+getSeaPhrase("ADDR_4","ESS") + '</th>'
	+ '<td class="plaintablecelldisplay" nowrap>' + obj.addr4 + '</td></tr>'
	+ '<tr><th class="plaintablerowheaderlite" style="text-align:right;width:50%">'+getSeaPhrase("CITY_OR_ADDR_5","ESS") + '</th>'
	+ '<td class="plaintablecelldisplay" nowrap>' + obj.city + '</td></tr>'
	+ '<tr><th class="plaintablerowheaderlite" style="text-align:right;width:50%">'+getSeaPhrase("HOME_ADDR_6","ESS") + '</th>'
	+ '<td class="plaintablecelldisplay" nowrap>' + ReturnStateDescription(obj.state) + '</td></tr>'
	+ '<tr><th class="plaintablerowheaderlite" style="text-align:right;width:50%">'+getSeaPhrase("HOME_ADDR_7","ESS") + '</th>'
	+ '<td class="plaintablecelldisplay" nowrap>' + obj.zip + '</td></tr>'
	+ '<tr><th class="plaintablerowheaderlite" style="text-align:right;width:50%">'+getSeaPhrase("COUNTRY_ONLY","ESS") + '</th>'
	+ '<td class="plaintablecelldisplay" nowrap>' + ReturnCountryDescription(obj.country_country_code) + '</td></tr>'
	+ '</table>'

	try {
		self.RIGHT.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DETAIL","ESS");
		self.RIGHT.document.getElementById("paneBody").innerHTML = EmergencyContent;
		self.RIGHT.stylePage();
    	self.RIGHT.setLayerSizes();
    	self.RIGHT.document.contactform.firstname.focus();
	}
	catch(e) {}
	SetBtnVisibility("hidden");
	document.getElementById("RIGHT").style.visibility = "visible";
}

function DeleteContact(i)
{
	obj = EmergencyContacts[i];

	var agsObj = new AGSObject(authUser.prodline, "PA12.1")
	agsObj.event = "CHANGE"
	agsObj.rtn = "MESSAGE"
	agsObj.longNames="ALL"
	agsObj.tds = false
	agsObj.field = "FC=D"
		         + "&PAE-COMPANY="  + escape(parseInt(authUser.company,10),1)
		         + "&PAE-EMPLOYEE=" + escape(parseInt(empNbr,10),1)
		         + "&PAE-SEQ-NBR="  + escape(parseInt(obj.seq_nbr,10),1)
		         + "&USER-ID=W" + escape(parseInt(empNbr,10),1)
	updatetype = "PAE";
	try {
		if (fromTask) {
			parent.showWaitAlert(getSeaPhrase("HOME_ADDR_42","ESS"));
		}
	}
	catch(e) {}
	AGS(agsObj,"jsreturn");
}

function NewContact()
{
// MOD BY BILAL
// Change to Upper case when save as obj.value.toUpperCase()
	EmergencyContent = '<center><form name="contactform"><table border="0" cellspacing="0" cellpadding="0" style="width:100%;height:100%">'
	+ '<tr style="padding-top:5px"><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("DEP_34","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="firstname" size=15 maxlength=14 onfocus=this.select() onblur="this.value=this.value.toUpperCase()">'+uiRequiredIcon()
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("DEP_38","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="lastname" size=30 maxlength=30 onfocus=this.select() onblur="this.value=this.value.toUpperCase()">'+uiRequiredIcon()
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("DEP_23","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="relationship" size=30 maxlength=30 onfocus=this.select() onblur="this.value=this.value.toUpperCase()">'

	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "8.1.1")
	{
		EmergencyContent += '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("CELL_PHONE","ESS")
		+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="clphonenbr" size=15 maxlength=15 onfocus=this.select()>'
// MOD BY BILAL
// JRZ removing Cell phone country - hiding the row.
		+ '<tr id="clctrycd" style="display:none" onmouseover="parent.displayHelpText(\'self.RIGHT\',\'clctrycd\',\'cntryCdHelpText\',true)" '
		+ 'onmouseout="parent.displayHelpText(\'self.RIGHT\',\'clctrycd\',\'cntryCdHelpText\',false)">'
		+ '<th class="fieldlabelboldlite" align="left">'+getSeaPhrase("CELL_PHONE_CNTRY_CODE","ESS")
		+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="clphonecntry" size=3 maxlength=3 onfocus=this.select()>'
// END OF MOD
	}

	EmergencyContent += '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("HOME_PHONE_ONLY","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="hmphonenbr" size=15 maxlength=15 onfocus=this.select()>'
// MOD BY BILAL
// JRZ removing home phone country - hiding the row.
	+ '<tr id="hmctrycd" style="display:none" onmouseover="parent.displayHelpText(\'self.RIGHT\',\'hmctrycd\',\'cntryCdHelpText\',true)" '
	+ 'onmouseout="parent.displayHelpText(\'self.RIGHT\',\'hmctrycd\',\'cntryCdHelpText\',false)">'
	+ '<th class="fieldlabelboldlite" align="left">'+getSeaPhrase("HOME_PHONE_CNTRY_CODE_ONLY","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="hmphonecntry" size=3 maxlength=3 onfocus=this.select()>'
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("WORK_PHONE_ONLY","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="wkphonenbr" size=15 maxlength=15 onfocus=this.select()>'
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("JOB_OPENINGS_14","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="wkphoneext" size=5 maxlength=5 onfocus=this.select()>'
// MOD BY BILAL
// JRZ removing work phone country - hiding the row.
	+ '<tr id="wkctrycd" style="display:none" onmouseover="parent.displayHelpText(\'self.RIGHT\',\'wkctrycd\',\'cntryCdHelpText\',true)" '
	+ 'onmouseout="parent.displayHelpText(\'self.RIGHT\',\'wkctrycd\',\'cntryCdHelpText\',false)">'
	+ '<th class="fieldlabelboldlite" align="left">'+getSeaPhrase("WORK_PHONE_CNTRY_CODE_ONLY","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="wkphonecntry" size=3 maxlength=3 onfocus=this.select()>'
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("ADDR_1","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="addr1" size=30 maxlength=30 onfocus=this.select() onblur="this.value=this.value.toUpperCase()">'
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("ADDR_2","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="addr2" size=30 maxlength=30 onfocus=this.select() onblur="this.value=this.value.toUpperCase()">'
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("ADDR_3","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="addr3" size=30 maxlength=30 onfocus=this.select() onblur="this.value=this.value.toUpperCase()">'
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("ADDR_4","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="addr4" size=30 maxlength=30 onfocus=this.select() onblur="this.value=this.value.toUpperCase()">'
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("CITY_OR_ADDR_5","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="city" size=18 maxlength=18 onfocus=this.select() onblur="this.value=this.value.toUpperCase()">'
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("HOME_ADDR_6","ESS")
// END OF MOD
// MOD BY BILAL  - Added Required icon in front of state.
	+ '<td class="plaintablecell" nowrap><select class="inputbox" name="state">' + BuildStateSelect("") + '</select>'+uiRequiredIcon()
// END OF MOD
	+ '<tr><th class="fieldlabelboldlite" align="left">'+getSeaPhrase("HOME_ADDR_7","ESS")
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type=text name="zip" size=10 maxlength=10 onfocus=this.select()>'
	+ '<tr><th class="fieldlabelboldliteunderline" align="left">'+getSeaPhrase("COUNTRY_ONLY","ESS")
	+ '<td class="plaintablecell" nowrap><span id="countryCell"><select class="inputbox" name="country">' + DrawInstCtryCdSelect("") + '</select></span>'
	+ '<tr><td>&nbsp;</td><td class="plaintablecell" align="left">'
	+ uiButton(getSeaPhrase("UPDATE","ESS"),"parent.ProcessContact();return false","margin-top:10px")
	+ uiButton(getSeaPhrase("CANCEL","ESS"),"parent.CloseEmergencyDetail();return false","margin-top:10px")
	+ '</table>'
	+ '<input class="inputbox" type=hidden name="seqnbr" value="0">'
	+ '<input class="inputbox" type=hidden name="fc" value="A">'
	+ '</form></center>'
	+ rolloverHelpText("cntryCdHelpText",getSeaPhrase("COUNTRY_CODE_HELP_TEXT","ESS"))
	+ uiRequiredFooter()

	try {
		self.RIGHT.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DETAIL","ESS");
		self.RIGHT.document.getElementById("paneBody").innerHTML = EmergencyContent;
		self.RIGHT.stylePage();
    	self.RIGHT.setLayerSizes();
    	self.RIGHT.document.contactform.firstname.focus();
	}
	catch(e) {}

	SetBtnVisibility("hidden");
	document.getElementById("RIGHT").style.visibility = "visible";
}

function SetBtnVisibility(val)
{
	try {
		self.LEFT.document.getElementById("addbtn").style.visibility = val;
		self.LEFT.document.getElementById("closebtn").style.visibility = val;
	}
	catch(e) {}
}

function CloseEmergencyDetail()
{
	deactivateTableRows("emergencyTbl",self.LEFT);
	SetBtnVisibility("visible");
	document.getElementById("RIGHT").style.visibility = "hidden";
	document.getElementById("LEFT").style.visibility = "visible";
}

function ProcessContact()
{
	var obj = self.RIGHT.document.contactform;

	for (var i=0;i<obj.elements.length;i++)
	{
		if (obj.elements[i].value == "")
			obj.elements[i].value = " ";
	}

	clearRequiredField(obj.firstname);
	clearRequiredField(obj.lastname);
	clearRequiredField(obj.hmphonenbr);
	clearRequiredField(obj.hmphonecntry);
	clearRequiredField(obj.wkphonenbr);
	clearRequiredField(obj.wkphonecntry);
	if (obj.clphonenbr)
		clearRequiredField(obj.clphonenbr);
	if (obj.clphonecntry)
		clearRequiredField(obj.clphonecntry);
	clearRequiredField(self.RIGHT.document.getElementById("countryCell"));

	if (NonSpace(obj.firstname.value) == 0)
	{
		setRequiredField(obj.firstname);
		parent.seaAlert(getSeaPhrase("FIRST_NAME","ESS"));
		obj.firstname.focus();
		obj.firstname.select();
		return;
	}

	if (NonSpace(obj.lastname.value) == 0)
	{
		setRequiredField(obj.lastname);
		parent.seaAlert(getSeaPhrase("LAST_NAME","ESS"));
		obj.lastname.focus();
		obj.lastname.select();
		return;
	}

	if (obj.clphonenbr)
	{
		if (NonSpace(obj.clphonenbr.value) == 0 && NonSpace(obj.hmphonenbr.value) == 0 && NonSpace(obj.wkphonenbr.value) == 0)
		{
			setRequiredField(obj.hmphonenbr);
			setRequiredField(obj.wkphonenbr);
		 	setRequiredField(obj.clphonenbr);
			parent.seaAlert(getSeaPhrase("HOME_CELL_WORK_NBR_REQUIRED","ESS"));
			obj.clphonenbr.focus();
			obj.clphonenbr.select();
			return;
		}
	}
	else
	{
		if (NonSpace(obj.hmphonenbr.value) == 0 && NonSpace(obj.wkphonenbr.value) == 0)
		{
			setRequiredField(obj.hmphonenbr);
			setRequiredField(obj.wkphonenbr);
			parent.seaAlert(getSeaPhrase("PHONE_NBR_REQUIRED","ESS"));
			obj.hmphonenbr.focus();
			obj.hmphonenbr.select();
			return;
		}
	}

	if (NonSpace(obj.hmphonenbr.value) > 0 && !ValidPhoneEntry(obj.hmphonenbr))
	{
		setRequiredField(obj.hmphonenbr);
		parent.seaAlert(getSeaPhrase("PHONE_NBR_ERROR","ESS"));
		obj.hmphonenbr.focus();
		obj.hmphonenbr.select();
		return;
	}

	if (NonSpace(obj.wkphonenbr.value) > 0 && !ValidPhoneEntry(obj.wkphonenbr))
	{
		setRequiredField(obj.wkphonenbr);
		parent.seaAlert(getSeaPhrase("PHONE_NBR_ERROR","ESS"));
		obj.wkphonenbr.focus();
		obj.wkphonenbr.select();
		return;
	}

    if (obj.clphonenbr && NonSpace(obj.clphonenbr.value) > 0 && !ValidPhoneEntry(obj.clphonenbr))
	{
		setRequiredField(obj.clphonenbr);
		parent.seaAlert(getSeaPhrase("PHONE_NBR_ERROR","ESS"));
		obj.clphonenbr.focus();
		obj.clphonenbr.select();
		return;
	}

	if (NonSpace(obj.hmphonecntry.value) > 0 && !ValidPhoneEntry(obj.hmphonecntry))
	{
		setRequiredField(obj.hmphonecntry);
		parent.seaAlert(getSeaPhrase("PHONE_COUNTRY_CODE_ERROR","ESS"));
		obj.hmphonecntry.focus();
		obj.hmphonecntry.select();
		return;
	}

	if (NonSpace(obj.wkphonecntry.value) > 0 && !ValidPhoneEntry(obj.wkphonecntry))
	{
		setRequiredField(obj.wkphonecntry);
		parent.seaAlert(getSeaPhrase("PHONE_COUNTRY_CODE_ERROR","ESS"));
		obj.wkphonecntry.focus();
		obj.wkphonecntry.select();
		return;
	}

	if (obj.clphonecntry && NonSpace(obj.clphonecntry.value) > 0 && !ValidPhoneEntry(obj.clphonecntry))
	{
		setRequiredField(obj.clphonecntry);
		parent.seaAlert(getSeaPhrase("PHONE_COUNTRY_CODE_ERROR","ESS"));
		obj.clphonecntry.focus();
		obj.clphonecntry.select();
		return;
	}

// MOD BY BILAL - uncommenting the code
//	/* Do not require state or province, as it is not required on PA12.
	if ((obj.state.selectedIndex>=0 &&
	NonSpace(obj.state.options[obj.state.selectedIndex].value) == 0) &&
	(obj.country.selectedIndex >=0 &&
	NonSpace(obj.country.options[obj.country.selectedIndex].value) == 0))
	{
		parent.seaAlert(getSeaPhrase("STATE_PROVINCE","ESS"));
		obj.state.focus();
		return;
	}
//	*/
// END OF MOD

	var object       = new AGSObject(authUser.prodline, "PA12.1")
	object.rtn       = "MESSAGE"
	object.longNames = "ALL"
	object.tds       = false

	if (obj.fc.value == "C")
	{
		object.event     = "CHANGE"
		object.field     = "FC=C"
	}
 	else
	{
		object.event     = "ADD"
		object.field     = "FC=A"
	}

// MOD BY BILAL
//ISH 2007 Change to Upper case when save as obj.value.toUpperCase()
    object.field += "&PAE-COMPANY=" + escape(parseInt(authUser.company,10),1)
		  + "&PAE-EMPLOYEE="        + escape(parseInt(empNbr,10),1)
	      + "&PAE-SEQ-NBR="         + escape(parseInt(obj.seqnbr.value,10),1)
	      + "&PAE-FIRST-NAME="      + escape(obj.firstname.value.toUpperCase(),1)
	      + "&PAE-LAST-NAME="       + escape(obj.lastname.value.toUpperCase(),1)
	      + "&PAE-RELATIONSHIP="    + escape(obj.relationship.value.toUpperCase(),1)
	      + "&PAE-ADDR1="           + escape(obj.addr1.value.toUpperCase(),1)
	      + "&PAE-ADDR2="           + escape(obj.addr2.value.toUpperCase(),1)
	      + "&PAE-ADDR3="           + escape(obj.addr3.value.toUpperCase(),1)
	      + "&PAE-ADDR4="           + escape(obj.addr4.value.toUpperCase(),1)
	      + "&PAE-CITY="            + escape(obj.city.value.toUpperCase(),1)

	      if(obj.state.selectedIndex>=0)
	      	object.field += "&PAE-STATE="           + escape(obj.state.options[obj.state.selectedIndex].value,1)
	      else
	      	object.field += "&PAE-STATE="           + escape("")


	      object.field += "&PAE-ZIP="             + escape(obj.zip.value,1)

	      if(obj.country.selectedIndex>=0)
	      	object.field += "&PAE-COUNTRY-CODE="    + escape(obj.country.options[obj.country.selectedIndex].value,1)
		else
			object.field += "&PAE-COUNTRY-CODE="    + escape("")

		if (obj.clphonecntry && obj.clphonenbr)
		{
			object.field += "&PAE-CL-PHONE-CNTRY="  + escape(obj.clphonecntry.value,1)
	    	object.field += "&PAE-CL-PHONE-NBR="    + escape(obj.clphonenbr.value,1)
		}

		object.field += "&PAE-HM-PHONE-CNTRY="  + escape(obj.hmphonecntry.value,1)
	    object.field += "&PAE-HM-PHONE-NBR="    + escape(obj.hmphonenbr.value,1)
	    object.field += "&PAE-WK-PHONE-NBR="    + escape(obj.wkphonenbr.value,1)
		object.field += "&PAE-WK-PHONE-CNTRY="  + escape(obj.wkphonecntry.value,1)
	    object.field += "&PAE-WK-PHONE-EXT="    + escape(obj.wkphoneext.value,1)
	    object.field += "&USER-ID=W" + escape(parseInt(empNbr,10),1)

	object.func = "parent.handlePA12Response()";

	updatetype = "PAE"
	try {
		if (fromTask) {
			parent.showWaitAlert(getSeaPhrase("HOME_ADDR_42","ESS"));
		}
	}
	catch(e) {}
	AGS(object, "jsreturn");
}

function handlePA12Response()
{
	if (self.lawheader.gmsgnbr != "000")
	{
		try
		{
	 		if (fromTask)
			{
				parent.removeWaitAlert();
			}
		}
		catch(e) {}
	 	parent.seaAlert(self.lawheader.gmsg);
		if (self.lawheader.gmsgnbr == "107")
		{
			var formObj = self.RIGHT.document.contactform;
			setRequiredField(self.RIGHT.document.getElementById("countryCell"));
			formObj.country.focus();
		}
	}
}
</script>
<!-- MOD BY BILAL - Prior customizations  -->
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
<body onload="OpenEmergency()">
	<iframe id="LEFT" name="LEFT" style="position:absolute;top:0px;left:0px;width:49%;height:464px" src="/lawson/xhrnet/ui/headerpane.htm" marginwidth="0" marginheight="0" frameborder="no" scrolling="no"></iframe>
	<iframe id="RIGHT" name="RIGHT" style="position:absolute;top:0px;left:49%;width:51%;height:464px;visibility:hidden" src="/lawson/xhrnet/ui/headerpanelite.htm" marginwidth="0" marginheight="0" frameborder="no" scrolling="no"></iframe>
	<iframe id="jsreturn" name="jsreturn" style="position:absolute;top:0px;left:0px;visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/dot.htm" marginwidth="0" marginheight="0" scrolling="no" frameborder="no"></iframe>
	<iframe id="lawheader" name="lawheader" style="position:absolute;top:0px;left:0px;visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/esslawheader.htm" marginwidth="0" marginheight="0" scrolling="no" frameborder="no"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@(201111) 09.00.01.06.00 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/emergcnt.htm,v 1.22.2.27 2011/08/09 14:07:22 brentd Exp $ -->
