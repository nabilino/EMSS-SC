<!DOCTYPE html>
<head>
<title>Home Address</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">
<meta charset="utf-8">
<meta http-equiv="Pragma" content="No-Cache">
<meta http-equiv="Expires" content="Mon, 01 Jan 1990 00:00:01 GMT">
<script src="/lawson/webappjs/common.js"></script>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/webappjs/transaction.js"></script>
<script src="/lawson/xhrnet/email.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/xhrnet/statesuscan.js"></script>
<script src="/lawson/xhrnet/empinfo.js"></script>
<script src="/lawson/xhrnet/prlockout.js"></script>
<script src="/lawson/xhrnet/instctrycdselect.js"></script>
<script src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/Transaction.js"></script>
<script src="/lawson/webappjs/javascript/objects/ProcessFlow.js"></script>
<script>
var fromTask = (unescape(window.location.search))?true:false;
var fromTaskStr	= (fromTask)?getVarFromString("from",unescape(window.location.search)):"";
var addrTabs;
var EmailError = false;
var DoEmail = 0;
var EmailFrom = "";
var EmailTo	= "";
var addrform = new Object();
var saddrform = new Object();
var EmpInfo = new Array();
EmpInfo.work_country = "";
var AddType = "H";
var appObj;
seaAlert = parent.seaAlert;

function OpenMoveEvent()
{
	authUser = null;
	try
	{
		// Check if a parent or opener document has already done an authenticate,
		// otherwise go get the webuser info.
		if (parent && typeof(parent.authUser) != "undefined" && parent.authUser != null)
		{
			authUser = parent.authUser
			if (typeof(parent.EmpInfo) != "undefined" && parent.EmpInfo != null)
				EmpInfo = parent.EmpInfo
		}
		else if (opener && typeof(opener.authUser) != "undefined" && opener.authUser != null)
		{
			authUser = opener.authUser
			if (typeof(opener.EmpInfo) != "undefined" && opener.EmpInfo != null)
				EmpInfo = opener.EmpInfo
		}
	}
	catch(e)
	{
		authUser = null;
		EmpInfo = new Array();
		CalledEmpInfo = false;
	}
	if (!authUser)
	{
		authenticate("frameNm='jsreturn'|funcNm='InitMoveEvent()'|officeObjects=true|sysenv=true|desiredEdit='EM'")
		return
	}
	InitMoveEvent();
}

function AfterLockout(dlgWnd)
{
	if (fromTask && fromTaskStr != "main")
		FinishAddressChange();
}

function InitMoveEvent()
{
	stylePage();
	setWinTitle(getSeaPhrase("HOME_ADDR_0","ESS"));
	startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), LoadMoveEvent);
}

function LoadMoveEvent()
{
	if (!appObj)
		appObj = new AppVersionObject(authUser.prodline, "HR");
	// if you call getAppVersion() right away and the IOS object isn't set up yet,
	// then the code will be trying to load the sso.js file, and your call for
	// the appversion will complete before the ios version is set
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
       	setTimeout("LoadMoveEvent()", 10);
       	return;
	}
	if (emssObjInstance.emssObj.payrollLockout)
	{	
		if (appObj && appObj.getLongAppVersion() != null && appObj.getLongAppVersion().toString() >= "09.00.01.09")		
		{
			if (isPRLockedOut("A", authUser.company, authUser.employee))
			{
				stopProcessing();
				parent.seaAlert(getSeaPhrase("PR_LOCKED_OUT","SEA"),"",null,"error",AfterLockout);
				if (!parent.styler.showLDS && !parent.styler.showInfor)
					AfterLockout();
				return;
			}	
		}		
	}
	GrabStates("GetCountryCodes()");	
}

function GetCountryCodes()
{
	GetInstCtryCdSelect(authUser.prodline,"GetEmailAddress()")
}

function GetEmailAddress()
{
	var syr_company = authUser.company.toString();
	for (var i=syr_company.length; i<4; i++)
		syr_company = "0" + syr_company;
	var object = new DMEObject(authUser.prodline, "SYSRULES");
	object.out = "JAVASCRIPT";
	object.index = "syrset1";
	object.field = "email-address;alphadata2";
    object.key = "EMAILNOTIFICATION=HR="+syr_company+"="+escape(" ",1)+"=1=N=N";
	object.max = "1";
	object.func = "GetEmpAddress()";
	object.debug = false;
	DME(object, "jsreturn");
}

function GetEmpAddress()
{
	if (self.jsreturn.NbrRecs)
	{
		DoEmail = self.jsreturn.record[0].alphadata2;
		EmailTo = self.jsreturn.record[0].email_address;
	}
	var fields = "addr1;addr2;addr3;addr4;city;state;zip;country-code;first-name;last-name;"
	+ "fica-nbr;process-level;department;work-country;county;email-address;tax-filter;"
	+ "paemployee.hm-phone-cntry;paemployee.hm-phone-nbr;process-level.emp-tax-addr;"
	+ "process-level.tax-filter;paemployee.supp-addr1;paemployee.supp-addr2;paemployee.supp-addr3;"
	+ "paemployee.supp-addr4;paemployee.supp-city;paemployee.supp-state;paemployee.supp-zip;"
	+ "paemployee.supp-cntry-cd;paemployee.supp-county;paemployee.supp-phone-cnt;paemployee.supp-phone-nbr";
	GetEmpInfo(authUser.prodline,authUser.company,authUser.employee,"employee",fields,"DrawMoveScreen()");
}

function DrawMoveScreen()
{
	var addrLineSize = (appObj && appObj.getLongAppVersion() != null && appObj.getLongAppVersion().toString() >= "10.00.00.03") ? 57 : 30;
	EmailFrom = EmpInfo.email_address;
	if (typeof(EmailFrom) == "undefined" || EmailFrom == null || NonSpace(EmailFrom) == 0)
		EmailFrom = EmailTo;
	if (typeof(addrTabs) == "undefined")
		addrTabs = new uiTabSet("addrTabs",new Array(getSeaPhrase("HOME","ESS"),getSeaPhrase("SUPPLEMENTAL","ESS")));
	var toolTip = uiDateToolTip(getSeaPhrase("HOME_ADDR_1","ESS"));
	// Home address tab
	// ianm 20141009 - modified input fields to be uppercase using style="text-transform:uppercase" onkeyup="javascript:this.value=this.value.toUpperCase();"
	var tab0Html = uiRequiredFooter()
	+ '<form name="addressform" style="padding-top:10px"><table border="0" cellspacing="0" cellpadding="0" role="presentation">'
	+ '<tr><td class="fieldlabelbold"><label id="dateneededLbl" for="dateneeded">'+getSeaPhrase("HOME_ADDR_1","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="dateneeded" name="dateneeded" value="" size="10" maxlength="10" onfocus="this.select()" aria-labelledby="dateneededLbl dateneededFmt">'
	+ '<a href="javascript:parent.DateSelect(\'dateneeded\');" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiRequiredIcon()+'</td></tr>'
	+ '<tr style="height:30px"><td>&nbsp;</td><td style="padding-left:5px;padding-top:2px;vertical-align:top">'+uiDateFormatSpan("dateneededFmt")+'</td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="addr1">'+getSeaPhrase("ADDR_1","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input style="text-transform:uppercase" onkeyup="javascript:this.value=this.value.toUpperCase();" class="inputbox" type="text" id="addr1" name="addr1" value="'+fixQuote(EmpInfo.addr1)+'" size="'+addrLineSize+'" maxlength="'+addrLineSize+'" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="addr2">'+getSeaPhrase("ADDR_2","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input style="text-transform:uppercase" onkeyup="javascript:this.value=this.value.toUpperCase();" class="inputbox" type="text" id="addr2" name="addr2" value="'+fixQuote(EmpInfo.addr2)+'" size="30" maxlength="30" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="addr3">'+getSeaPhrase("ADDR_3","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input style="text-transform:uppercase" onkeyup="javascript:this.value=this.value.toUpperCase();" class="inputbox" type="text" id="addr3" name="addr3" value="'+fixQuote(EmpInfo.addr3)+'" size="30" maxlength="30" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="addr4">'+getSeaPhrase("ADDR_4","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input style="text-transform:uppercase" onkeyup="javascript:this.value=this.value.toUpperCase();" class="inputbox" type="text" id="addr4" name="addr4" value="'+fixQuote(EmpInfo.addr4)+'" size="30" maxlength="30" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="city">'+getSeaPhrase("CITY_OR_ADDR_5","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input style="text-transform:uppercase" onkeyup="javascript:this.value=this.value.toUpperCase();" class="inputbox" type="text" id="city" name="city" value="'+fixQuote(EmpInfo.city)+'" size="18" maxlength="18" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="state">'+getSeaPhrase("HOME_ADDR_6","ESS")+'</label></th>'
	+ '<td id="stateCell" class="plaintablecell" nowrap><select class="inputbox" id="state" name="state">'+BuildStateSelect(EmpInfo.state)+'</select></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="zip">'+getSeaPhrase("HOME_ADDR_7","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input style="text-transform:uppercase" onkeyup="javascript:this.value=this.value.toUpperCase();" class="inputbox" class="fieldlabelbold" type="text" id="zip" name="zip" value="'+fixQuote(EmpInfo.zip)+'" size="10" maxlength="10" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="county">'+getSeaPhrase("COUNTY_ONLY","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input style="text-transform:uppercase" onkeyup="javascript:this.value=this.value.toUpperCase();" class="inputbox" type="text" id="county" name="county" value="'+fixQuote(EmpInfo.county)+'" size="25" maxlength="25" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="country">'+getSeaPhrase("COUNTRY_ONLY","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><select class="inputbox" id="country" name="country">'+DrawInstCtryCdSelect(EmpInfo.country_code)+'</select></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="hmphonenbr">'+getSeaPhrase("PHONE","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="hmphonenbr" name="hmphonenbr" value="'+fixQuote(EmpInfo.paemployee_hm_phone_nbr)+'" size="15" maxlength="15" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label id="hmctrycd" for="hmphonecntry" title="'+getSeaPhrase("COUNTRY_CODE_HELP_TEXT","ESS")+'">'+getSeaPhrase("PHONE_COUNTRY_CODE","ESS")+'<span class="offscreen">&nbsp;'+getSeaPhrase("COUNTRY_CODE_HELP_TEXT","ESS")+'</span></label></td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="hmphonecntry" name="hmphonecntry" value="'+fixQuote(EmpInfo.paemployee_hm_phone_cntry)+'" size="3" maxlength="3" onfocus="this.select()"></td></tr>'
	+ '<tr><td>&nbsp;</td><td class="plaintablecell">'
	if (fromTask && fromTaskStr != "main")
	{
	 	tab0Html += uiButton(getSeaPhrase("UPDATE","ESS"),"parent.ProcessMoveEvent();return false","margin-top:10px")
		+ uiButton(getSeaPhrase("CANCEL","ESS"),"parent.FinishAddressChange()","margin-left:5px;margin-top:10px")
	}
	else
		tab0Html += uiButton(getSeaPhrase("UPDATE","ESS"),"parent.ProcessMoveEvent();return false","margin-top:10px")
	tab0Html +='</td></tr></table></form>'

	// Supplemental address tab
	// ianm 20141009 - modified input fields to be uppercase using style="text-transform:uppercase" onkeyup="javascript:this.value=this.value.toUpperCase();"
	var tab1Html = '<form name="supplementalform" style="padding-top:10px"><table border="0" cellspacing="0" cellpadding="0" role="presentation">'
	+ '<tr><td class="fieldlabelbold"><label for="saddr1">'+getSeaPhrase("ADDR_1","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input style="text-transform:uppercase" onkeyup="javascript:this.value=this.value.toUpperCase();" class="inputbox" type="text" id="saddr1" name="saddr1" value="'+fixQuote(EmpInfo.paemployee_supp_addr1)+'" size="'+addrLineSize+'" maxlength="'+addrLineSize+'" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="saddr2">'+getSeaPhrase("ADDR_2","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input style="text-transform:uppercase" onkeyup="javascript:this.value=this.value.toUpperCase();" class="inputbox" type="text" id="saddr2" name="saddr2" value="'+fixQuote(EmpInfo.paemployee_supp_addr2)+'" size="30" maxlength="30" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="saddr3">'+getSeaPhrase("ADDR_3","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input style="text-transform:uppercase" onkeyup="javascript:this.value=this.value.toUpperCase();" class="inputbox" type="text" id="saddr3" name="saddr3" value="'+fixQuote(EmpInfo.paemployee_supp_addr3)+'" size="30" maxlength="30" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="saddr4">'+getSeaPhrase("ADDR_4","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input style="text-transform:uppercase" onkeyup="javascript:this.value=this.value.toUpperCase();" class="inputbox" type="text" id="saddr4" name="saddr4" value="'+fixQuote(EmpInfo.paemployee_supp_addr4)+'" size="30" maxlength="30" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="scity">'+getSeaPhrase("CITY_OR_ADDR_5","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input style="text-transform:uppercase" onkeyup="javascript:this.value=this.value.toUpperCase();" class="inputbox" type="text" id="scity" name="scity" value="'+fixQuote(EmpInfo.paemployee_supp_city)+'" size="18" maxlength="18" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="sstate">'+getSeaPhrase("HOME_ADDR_6","ESS")+'</label></td>'
	+ '<td id="stateCell" class="plaintablecell" nowrap><select class="inputbox" id="sstate" name="sstate">'+BuildStateSelect(EmpInfo.paemployee_supp_state)+'</select></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="szip">'+getSeaPhrase("HOME_ADDR_7","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input style="text-transform:uppercase" onkeyup="javascript:this.value=this.value.toUpperCase();" class="inputbox" class="fieldlabelbold" type="text" id="szip" name="szip" value="'+fixQuote(EmpInfo.paemployee_supp_zip)+'" size="10" maxlength="10" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="scounty">'+getSeaPhrase("COUNTY_ONLY","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input style="text-transform:uppercase" onkeyup="javascript:this.value=this.value.toUpperCase();" class="inputbox" type="text" id="scounty" name="scounty" value="'+fixQuote(EmpInfo.paemployee_supp_county)+'" size="25" maxlength="25" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="scountry">'+getSeaPhrase("COUNTRY_ONLY","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><select class="inputbox" id="scountry" name="scountry">'+DrawInstCtryCdSelect(EmpInfo.paemployee_supp_cntry_cd)+'</select></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label for="supphonenbr">'+getSeaPhrase("PHONE","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="supphonenbr" name="supphonenbr" value="'+fixQuote(EmpInfo.paemployee_supp_phone_nbr)+'" size="15" maxlength="15" onfocus="this.select()"></td></tr>'
	+ '<tr><td class="fieldlabelbold"><label id="supctrycd" for="supphonecntry" title="'+getSeaPhrase("COUNTRY_CODE_HELP_TEXT","ESS")+'">'+getSeaPhrase("PHONE_COUNTRY_CODE","ESS")+'<span class="offscreen">&nbsp;'+getSeaPhrase("COUNTRY_CODE_HELP_TEXT","ESS")+'</span></label></td>'
	+ '<td class="plaintablecell" nowrap><input class="inputbox" type="text" id="supphonecntry" name="supphonecntry" value="'+fixQuote(EmpInfo.paemployee_supp_phone_cnt)+'" size="3" maxlength="3" onfocus="this.select()"></td></tr>'
	+ '<tr><td>&nbsp;</td><td class="plaintablecell">'
	if (fromTask && fromTaskStr != "main")
	{
		tab1Html += uiButton(getSeaPhrase("UPDATE","ESS"),"parent.ProcessMoveEvent();return false","margin-top:10px")
		+ uiButton(getSeaPhrase("CANCEL","ESS"),"parent.FinishAddressChange()","margin-left:5px;margin-top:10px")
	}
	else
		tab1Html += uiButton(getSeaPhrase("UPDATE","ESS"),"parent.ProcessMoveEvent();return false","margin-top:10px")
	tab1Html +='</td></tr></table></form>'

	// Draw the tabs with content
	addrTabs.draw = true;
	addrTabs.frame = self.MAIN;
	addrTabs.frame.document.getElementById("paneHeader").innerHTML = getSeaPhrase("HOME_ADDR_2","ESS");
	addrTabs.tabHtml = new Array();
	addrTabs.tabHtml[0] = tab0Html;
	addrTabs.tabHtml[1] = tab1Html;
	addrTabs.create();
	addrTabs.frame.document.onload = function(){CheckTaxState();};
	try 
	{
		self.MAIN.stylePage();
		self.MAIN.setLayerSizes();
	}
	catch(e) {}
	stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[self.MAIN.getWinTitle()]));
	// size the tab contents to fit the screen
	try
	{
		if (typeof(parent.fitToScreen) == "function")
			parent.fitToScreen();
		fitToScreen();
	}
	catch(e) {}	
}

// If the employee's tax state is in the supplemental address and the employee's
// work country is U.S., display military codes in the state/province select.
function CheckTaxState()
{
	if (EmpInfo.work_country == "US" && EmpInfo.process_level_emp_tax_addr == 2)
	{
		try
		{
			var addrForm = self.MAIN.document.addressform;
			var stateOptions = addrForm.state.options;
			stateOptions[stateOptions.length] = new Option("AA");
			stateOptions[stateOptions.length-1].text = getSeaPhrase("MILITARY_CODE_0","ESS");
			stateOptions[stateOptions.length-1].value = "AA";
			stateOptions[stateOptions.length] = new Option("AE");
			stateOptions[stateOptions.length-1].text = getSeaPhrase("MILITARY_CODE_1","ESS");
			stateOptions[stateOptions.length-1].value = "AE";
			stateOptions[stateOptions.length] = new Option("AP");
			stateOptions[stateOptions.length-1].text = getSeaPhrase("MILITARY_CODE_2","ESS");
			stateOptions[stateOptions.length-1].value = "AP";
		}
		catch(e) {}
	}
}

function ProcessMoveEvent()
{	
  	addrform = addrTabs.frame.document.forms["addressform"];
	saddrform = addrTabs.frame.document.forms["supplementalform"];
	clearRequiredField(addrform.dateneeded);
	clearRequiredField(addrform.addr1);
	clearRequiredField(self.MAIN.document.getElementById("stateCell"));
	clearRequiredField(addrform.hmphonenbr);
	clearRequiredField(addrform.hmphonecntry);
	if (NonSpace(addrform.dateneeded.value)==0)
    {
    	addrTabs.frame.tabOnClick(addrTabs.frame.document.getElementById("addrTabs_TabBody_0"));
    	setRequiredField(addrform.dateneeded, getSeaPhrase("HOME_ADDR_8","ESS"));
       	return;
    }
	if (ValidDate(addrform.dateneeded) == false)
    {
    	addrTabs.frame.tabOnClick(addrTabs.frame.document.getElementById("addrTabs_TabBody_0"));
       	return;
    }
	if (formjsDate(formatDME(addrform.dateneeded.value)) > ymdtoday)
	{
		addrTabs.frame.tabOnClick(addrTabs.frame.document.getElementById("addrTabs_TabBody_0"));
		setRequiredField(addrform.dateneeded, getSeaPhrase("HOME_ADDR_9","ESS"));
		return;
	}
	if (NonSpace(addrform.addr1.value) == 0)
	{
		addrTabs.frame.tabOnClick(addrTabs.frame.document.getElementById("addrTabs_TabBody_0"));
		setRequiredField(addrform.addr1, getSeaPhrase("HOME_ADDR_10","ESS"));
		return;
	}
/*
	// PT 113850 use hr01 instead of hr00
	// if (typeof(EmpInfo.work_country) != "undefined" && EmpInfo.work_country == "US"
	// && NonSpace(addrform.state.options[addrform.state.selectedIndex].value) == 0)
	//if( ( ( typeof(EmpInfo.work_country)!="undefined" && (EmpInfo.work_country=="US" || EmpInfo.work_country=="CA") )
	//	|| EmpInfo.process_level_emp_tax_addr!=1 ) && NonSpace(addrform.state.options[addrform.state.selectedIndex].value)==0 )
	var countryCode = addrform.country.options[addrform.country.selectedIndex].value
	if ((countryCode=="US" || countryCode=="CA") &&	NonSpace(addrform.state.options[addrform.state.selectedIndex].value)==0)
	{
		addrTabs.frame.tabOnClick(addrTabs.frame.document.getElementById("addrTabs_TabBody_0"));
		setRequiredField(self.MAIN.document.getElementById("stateCell"), getSeaPhrase("HOME_ADDR_11","ESS"), addrform.state);
		return;
	}
*/
	if (NonSpace(addrform.hmphonenbr.value) > 0 && !ValidPhoneEntry(addrform.hmphonenbr))
	{
		addrTabs.frame.tabOnClick(addrTabs.frame.document.getElementById("addrTabs_TabBody_0"));
		setRequiredField(addrform.hmphonenbr, getSeaPhrase("PHONE_NBR_ERROR","ESS"));
		return;
	}
	if (NonSpace(addrform.hmphonecntry.value) > 0 && !ValidPhoneEntry(addrform.hmphonecntry))
	{
		addrTabs.frame.tabOnClick(addrTabs.frame.document.getElementById("addrTabs_TabBody_0"));
		setRequiredField(addrform.hmphonecntry, getSeaPhrase("PHONE_COUNTRY_CODE_ERROR","ESS"));
		return;
	}
	if (NonSpace(saddrform.supphonenbr.value) > 0 && !ValidPhoneEntry(saddrform.supphonenbr))
	{
		addrTabs.frame.tabOnClick(addrTabs.frame.document.getElementById("addrTabs_TabBody_1"));
		setRequiredField(saddrform.supphonenbr, getSeaPhrase("PHONE_NBR_ERROR","ESS"));
		return;
	}
	if (NonSpace(saddrform.supphonecntry.value) > 0 && !ValidPhoneEntry(saddrform.supphonecntry))
	{
		addrTabs.frame.tabOnClick(addrTabs.frame.document.getElementById("addrTabs_TabBody_1"));
		setRequiredField(saddrform.supphonecntry, getSeaPhrase("PHONE_COUNTRY_CODE_ERROR","ESS"));
		return;
	}
   	if (IsEqual(EmpInfo.addr1,addrform.addr1.value) && IsEqual(EmpInfo.addr2,addrform.addr2.value) &&
		IsEqual(EmpInfo.addr3,addrform.addr3.value) && IsEqual(EmpInfo.addr4,addrform.addr4.value) &&
		IsEqual(EmpInfo.city,addrform.city.value) && IsEqual(EmpInfo.zip,addrform.zip.value) &&
		IsEqual(EmpInfo.county,addrform.county.value) && IsEqual(EmpInfo.paemployee_hm_phone_cntry,addrform.hmphonecntry.value) &&
		IsEqual(EmpInfo.paemployee_hm_phone_nbr,addrform.hmphonenbr.value) && IsEqual(EmpInfo.country_code,addrform.country.options[addrform.country.selectedIndex].value) &&
		IsEqual(EmpInfo.state,addrform.state.options[addrform.state.selectedIndex].value))
	{
			AddType = "S";
	}
	if(AddType=="S"&& IsEqual(EmpInfo.paemployee_supp_addr1,saddrform.saddr1.value) && IsEqual(EmpInfo.paemployee_supp_addr2,saddrform.saddr2.value) &&
		IsEqual(EmpInfo.paemployee_supp_addr3,saddrform.saddr3.value) && IsEqual(EmpInfo.paemployee_supp_addr4,saddrform.saddr4.value) &&
		IsEqual(EmpInfo.paemployee_supp_city,saddrform.scity.value) && IsEqual(EmpInfo.paemployee_supp_zip,saddrform.szip.value) &&
		IsEqual(EmpInfo.paemployee_supp_county,saddrform.scounty.value) &&
		IsEqual(EmpInfo.paemployee_supp_phone_cnt,saddrform.supphonecntry.value) &&
		IsEqual(EmpInfo.paemployee_supp_phone_nbr,saddrform.supphonenbr.value) &&
		IsEqual(EmpInfo.paemployee_supp_cntry_cd,saddrform.scountry.options[saddrform.scountry.selectedIndex].value) &&
		IsEqual(EmpInfo.paemployee_supp_state,saddrform.sstate.options[saddrform.sstate.selectedIndex].value))
   	{
   	  	AddType = "H";
   		addrTabs.frame.tabOnClick(addrTabs.frame.document.getElementById("addrTabs_TabBody_0"));
    	parent.seaAlert(getSeaPhrase("HOME_ADDR_12","ESS"), null, null, "error");
    	return;
   	}
	else // Make sure we pass a space for any blank fields, or they won't be cleared on the HR11 form.
	{
		if (addrform.addr1.value == "") addrform.addr1.value = " ";
		if (addrform.addr2.value == "") addrform.addr2.value = " ";
		if (addrform.addr3.value == "") addrform.addr3.value = " ";
		if (addrform.addr4.value == "") addrform.addr4.value = " ";
		if (addrform.city.value == "") addrform.city.value = " ";
		if (addrform.zip.value == "") addrform.zip.value = " ";
		if (addrform.county.value == "") addrform.county.value = " ";
		if (addrform.hmphonecntry.value == "") addrform.hmphonecntry.value = " ";
		if (addrform.hmphonenbr.value == "") addrform.hmphonenbr.value = " ";
		if (addrform.country.options[addrform.country.selectedIndex].value == "")
			addrform.country.options[addrform.country.selectedIndex].value = " ";
		if (addrform.state.options[addrform.state.selectedIndex].value == "")
			addrform.state.options[addrform.state.selectedIndex].value = " ";
		if (saddrform.saddr1.value == "") saddrform.saddr1.value = " ";
		if (saddrform.saddr2.value == "") saddrform.saddr2.value = " ";
		if (saddrform.saddr3.value == "") saddrform.saddr3.value = " ";
		if (saddrform.saddr4.value == "") saddrform.saddr4.value = " ";
		if (saddrform.scity.value == "") saddrform.scity.value = " ";
		if (saddrform.szip.value == "") saddrform.szip.value = " ";
		if (saddrform.scounty.value == "") saddrform.scounty.value = " ";
		if (saddrform.supphonecntry.value == "") saddrform.supphonecntry.value = " ";
		if (saddrform.supphonenbr.value == "") saddrform.supphonenbr.value = " ";
		if (saddrform.scountry.options[saddrform.scountry.selectedIndex].value == "")
			saddrform.scountry.options[saddrform.scountry.selectedIndex].value = " ";
		if (saddrform.sstate.options[saddrform.sstate.selectedIndex].value == "")
			saddrform.sstate.options[saddrform.sstate.selectedIndex].value = " ";
	}
    EmailError = false;
    startProcessing(getSeaPhrase("HOME_ADDR_42","ESS"), CallHR11);
}

function CallHR11(TaxError)
{
  	if (typeof(parent.EmpInfo) != "undefined" && parent.EmpInfo != null)
 		 parent.EmpInfo = EmpInfo;
	var pObj = new AGSObject(authUser.prodline, "HR11.1");
   	pObj.event = "CHANGE";
   	pObj.rtn = "MESSAGE";
   	pObj.longNames = "ALL";
   	pObj.tds = false;
   	pObj.field = "FC=C"
 	+ "&EFFECT-DATE=" + formjsDate(formatDME(addrform.dateneeded.value))
	+ "&EMP-COMPANY=" + authUser.company
	+ "&EMP-EMPLOYEE=" + authUser.employee
	+ "&EMP-ADDR1=" + escape(addrform.addr1.value,1)
	+ "&EMP-ADDR2=" + escape(addrform.addr2.value,1)
	+ "&EMP-ADDR3=" + escape(addrform.addr3.value,1)
	+ "&EMP-ADDR4=" + escape(addrform.addr4.value,1)
	+ "&EMP-CITY=" + escape(addrform.city.value,1)
	+ "&EMP-STATE=" + escape(addrform.state.options[addrform.state.selectedIndex].value,1)
	+ "&EMP-ZIP=" + escape(addrform.zip.value,1)
	+ "&EMP-COUNTY=" + escape(addrform.county.value,1)
	+ "&EMP-COUNTRY-CODE=" + escape(addrform.country.options[addrform.country.selectedIndex].value,1)
	+ "&PEM-HM-PHONE-CNTRY=" + escape(addrform.hmphonecntry.value,1)
	+ "&PEM-HM-PHONE-NBR=" + escape(addrform.hmphonenbr.value,1)
	+ "&PEM-SUPP-ADDR1=" + escape(saddrform.saddr1.value,1)
	+ "&PEM-SUPP-ADDR2=" + escape(saddrform.saddr2.value,1)
	+ "&PEM-SUPP-ADDR3=" + escape(saddrform.saddr3.value,1)
	+ "&PEM-SUPP-ADDR4=" + escape(saddrform.saddr4.value,1)
	+ "&PEM-SUPP-CITY=" + escape(saddrform.scity.value,1)
	+ "&PEM-SUPP-STATE=" + escape(saddrform.sstate.options[saddrform.sstate.selectedIndex].value,1)
	+ "&PEM-SUPP-ZIP=" + escape(saddrform.szip.value,1)
	+ "&PEM-SUPP-COUNTY=" + escape(saddrform.scounty.value,1)
	+ "&PEM-SUPP-CNTRY-CD=" + escape(saddrform.scountry.options[saddrform.scountry.selectedIndex].value,1)
	+ "&PEM-SUPP-PHONE-CNT=" + escape(saddrform.supphonecntry.value,1)
	+ "&PEM-SUPP-PHONE-NBR=" + escape(saddrform.supphonenbr.value,1)
	+ "&XMIT-REQDED=1"
	+ "&PT-BYPASS-PERS-ACT=1";
	if (TaxError)
		pObj.field += "&XMIT-HREMP-BLOCK=1000000000";
	else 
		pObj.field += "&XMIT-HREMP-BLOCK=0111110000";
	pObj.func = "parent.DisplayMessage()";
	pObj.debug = false;
	AGS(pObj, "jsreturn");
}

function IsEqual(ObjA, ObjB)
{
	if ((ObjA == ObjB) || (NonSpace(ObjA) == 0 && NonSpace(ObjB) == 0))
		return true;
	else 
		return false;
}

function OpenHelpDialog()
{
	if (isEnwisenEnabled())
		openEnwisenWindow("id=MOVE");
	else
		openHelpDialogWindow("/lawson/xhrnet/addrtip.htm");
}

function ReturnDate(date)
{
   	self.MAIN.document.addressform.elements[date_fld_name].value = date;
}

function DisplayMessage()
{
  	var msgnbr = parseInt(self.lawheader.gmsgnbr,10);
	if (msgnbr == 0) // HR11 updated the address successfully
   		AddressChangeSucceeded();
	else // HR11 error
	{
		if (typeof(EmailTo) == "undefined" || EmailTo == null || NonSpace(EmailTo) == 0) // SYSRULES email is blank
		{
			stopProcessing();
			if (msgnbr == 100 || msgnbr == 105) // Tax Locator error message
				parent.seaAlert(getSeaPhrase("HOME_ADDR_13","ESS"), null, null, "error");
			else
				parent.seaAlert(getSeaPhrase("HOME_ADDR_14","ESS")+"\n\n("+self.lawheader.gmsg+")", null, null, "error");
		}
		else if (!EmailError && (msgnbr == 100 || msgnbr == 105)) // Tax Locator error message
		{
			EmailError = true;
			CallHR11(true); // Tell HR11 to ignore Tax Locator errors
		}
		else
		{
			stopProcessing();
			parent.seaAlert(getSeaPhrase("HOME_ADDR_14","ESS")+"\n\n("+self.lawheader.gmsg+")", null, null, "error");
		}
	}
}

function AddressChangeSucceeded()
{
	// Do we create an email?
	if ((parseInt(DoEmail,10) == 1 || (parseInt(DoEmail,10) == 2 && EmailError)) && typeof(EmailTo) != "undefined" && EmailTo != null && NonSpace(EmailTo) != 0)
		SendEmail();
	else
		FinishAddressChange();
	stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[self.MAIN.getWinTitle()]));
	parent.seaPageMessage(getSeaPhrase("UPDATE_COMPLETE","ESS"), null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
}

// Hide the address change frame if this is a Life Event; otherwise, navigate to the related links for an address change.
function FinishAddressChange()
{
	if (fromTask && fromTaskStr != "main")
	{
		try { parent.toggleFrame("right", false); } catch(e) {}
		try { parent.left.MAIN.document.getElementById("closebtn").style.visibility = "visible"; } catch(e) {}
	}
	//GDD  01/03/15  Do not display Additional Changes screen from  Home Address.
	//else
	//{
	//	parent.left.location.replace("/lawson/xhrnet/address.htm?date="+escape(self.MAIN.document.addressform.dateneeded.value,1)+"&addresstype="+escape(AddType,1));
	//	removeHelpIcon();
	//}
	//GDD End of change
	// display the checkmark indicating that this task has been accessed.
	try { parent.left.setImageVisibility("homeaddress_checkmark","visible"); } catch(e) {}
}

function SendEmail()
{
	var SuppFlag = false;
	var TaxFlag = false;
	var OldState = EmpInfo.state
	var NewState = addrform.state.options[addrform.state.selectedIndex].value
	// Check tax filter values to see if local tax authority fields may need to be changed.
	if ((parseInt(EmpInfo.tax_filter,10) == 2 || parseInt(EmpInfo.tax_filter,10) == 3)
	|| ((!EmpInfo.tax_filter || isNaN(parseFloat(EmpInfo.tax_filter))) && (parseInt(EmpInfo.process_level_tax_filter,10) == 2 || parseInt(EmpInfo.process_level_tax_filter,10) == 3)))
	{
		TaxFlag = true;
	}
	// Check to see if any supplemental address fields have changed.
	if (!IsEqual(EmpInfo.paemployee_supp_addr1,saddrform.saddr1.value) || !IsEqual(EmpInfo.paemployee_supp_addr2,saddrform.saddr2.value) ||
		!IsEqual(EmpInfo.paemployee_supp_addr3,saddrform.saddr3.value) || !IsEqual(EmpInfo.paemployee_supp_addr4,saddrform.saddr4.value) ||
		!IsEqual(EmpInfo.paemployee_supp_city,saddrform.scity.value) || !IsEqual(EmpInfo.paemployee_supp_zip,saddrform.szip.value) ||
		!IsEqual(EmpInfo.paemployee_supp_county,saddrform.scounty.value) || !IsEqual(EmpInfo.paemployee_supp_phone_cnt,saddrform.supphonecntry.value) ||
		!IsEqual(EmpInfo.paemployee_supp_phone_nbr,saddrform.supphonenbr.value) || !IsEqual(EmpInfo.paemployee_supp_cntry_cd,saddrform.scountry.options[saddrform.scountry.selectedIndex].value) ||
		!IsEqual(EmpInfo.paemployee_supp_state,saddrform.sstate.options[saddrform.sstate.selectedIndex].value))
	{
		SuppFlag = true;
	}
	if (emssObjInstance.emssObj.processFlowsEnabled)
	{
		var techVersion = (iosHandler && iosHandler.getIOSVersionNumber() >= "09.00.00") ? ProcessFlowObject.TECHNOLOGY_900 : ProcessFlowObject.TECHNOLOGY_803;
		var httpRequest = (typeof(SSORequest) == "function") ? SSORequest : SEARequest;
		var pfObj = new ProcessFlowObject(window, techVersion, httpRequest, "EMSS");
		pfObj.setEncoding(authUser.encoding);
		pfObj.showErrors = false;	
			
		var taxErrorFlag = (EmailError) ? "Y" : "N";
		var taxFilterFlag = (TaxFlag) ? "Y" : "N";
		var flowObj = pfObj.setFlow("EMSSAddrChg", Workflow.SERVICE_EVENT_TYPE, Workflow.ERP_SYSTEM,
						authUser.prodline, authUser.webuser, null, "");
		flowObj.addVariable("empData", String(authUser.company) + "," + String(authUser.employee) + "," + String(taxErrorFlag) + "," + String(taxFilterFlag) + "," + String(emssObjInstance.emssObj.emailFormat));
		flowObj.addVariable("oldAddress1", String(EmpInfo.addr1).substring(0, 45));
		flowObj.addVariable("oldAddress2", String(EmpInfo.addr2).substring(0, 45));
		flowObj.addVariable("oldAddress3", String(EmpInfo.addr3).substring(0, 45));
		flowObj.addVariable("oldAddress4", String(EmpInfo.addr4).substring(0, 45));
		flowObj.addVariable("oldAddress5", normalizeField(OldState, 2) + normalizeField(EmpInfo.zip, 10) + normalizeField(EmpInfo.country_code, 2) + normalizeField(EmpInfo.county, 25) + normalizeField(EmpInfo.paemployee_hm_phone_cntry, 6));
		flowObj.addVariable("oldAddress6", normalizeField(EmpInfo.city, 18) + normalizeField(EmpInfo.paemployee_hm_phone_nbr, 15) + normalizeField(String(EmpInfo.addr1).substring(45, 57), 12));
		flowObj.addVariable("oldAddress7", normalizeField(String(EmpInfo.addr2).substring(45, 57), 12) + normalizeField(String(EmpInfo.addr3).substring(45, 57), 12) + normalizeField(String(EmpInfo.addr4).substring(45, 57), 12));
		if (SuppFlag)
		{
			flowObj.addVariable("oldAddress8", String(EmpInfo.paemployee_supp_addr1).substring(0, 45));
			flowObj.addVariable("oldAddress9", String(EmpInfo.paemployee_supp_addr2).substring(0, 45));
			flowObj.addVariable("oldAddress10", String(EmpInfo.paemployee_supp_addr3).substring(0, 45));
			flowObj.addVariable("oldAddress11", String(EmpInfo.paemployee_supp_addr4).substring(0, 45));
			flowObj.addVariable("oldAddress12", normalizeField(EmpInfo.paemployee_supp_state, 2) + normalizeField(EmpInfo.paemployee_supp_zip, 10) + normalizeField(EmpInfo.paemployee_supp_cntry_cd, 2) + normalizeField(EmpInfo.paemployee_supp_county, 25) + normalizeField(EmpInfo.paemployee_supp_phone_cnt, 6));
			flowObj.addVariable("oldAddress13", normalizeField(EmpInfo.paemployee_supp_city, 18) + normalizeField(EmpInfo.paemployee_supp_phone_nbr, 15) + normalizeField(String(EmpInfo.paemployee_supp_addr1).substring(45, 57), 12));
			flowObj.addVariable("oldAddress14", normalizeField(String(EmpInfo.paemployee_supp_addr2).substring(45, 57), 12) + normalizeField(String(EmpInfo.paemployee_supp_addr3).substring(45, 57), 12) + normalizeField(String(EmpInfo.paemployee_supp_addr4).substring(45, 57), 12));
		}
		pfObj.triggerFlow();
		FinishAddressChange();
		return;
	}
	var pObj = new EMAILObject(EmailTo, EmailFrom)
	pObj.subject = getSeaPhrase("HOME_ADDR_15","ESS");
  	pObj.message = getSeaPhrase("JOB_PROFILE_2","ESS")+": "+authUser.employee
	+ "\n"+getSeaPhrase("EMPLOYEE_NAME","ESS")+": " + EmpInfo.first_name+" "+EmpInfo.last_name
    + "\n"+getSeaPhrase("HOME_ADDR_16","ESS")+": XXX-XX-"+EmpInfo.fica_nbr.toString().substring(EmpInfo.fica_nbr.toString().length-4,EmpInfo.fica_nbr.toString().length)
    + "\n"+getSeaPhrase("HOME_ADDR_17","ESS")+": "+EmpInfo.process_level
    + "\n"+getSeaPhrase("HOME_ADDR_18","ESS")+": "+EmpInfo.department
    + "\n\n"+getSeaPhrase("HOME_ADDR_0","ESS")+":"
    + "\n"+getSeaPhrase("HOME_ADDR_19","ESS")+": "+EmpInfo.addr1
    + "\n"+getSeaPhrase("HOME_ADDR_20","ESS")+": "+EmpInfo.addr2
    + "\n"+getSeaPhrase("HOME_ADDR_21","ESS")+": "+EmpInfo.addr3
    + "\n"+getSeaPhrase("HOME_ADDR_22","ESS")+": "+EmpInfo.addr4
	+ "\n"+getSeaPhrase("HOME_ADDR_23","ESS")+": "+EmpInfo.city
    + "\n"+getSeaPhrase("HOME_ADDR_24","ESS")+": "+OldState
	+ "\n"+getSeaPhrase("HOME_ADDR_25","ESS")+": "+EmpInfo.zip
	+ "\n"+getSeaPhrase("HOME_ADDR_26","ESS")+": "+EmpInfo.county
	+ "\n"+getSeaPhrase("HOME_ADDR_27","ESS")+": "+EmpInfo.country_code
    + "\n"+getSeaPhrase("HOME_ADDR_28","ESS")+": "+EmpInfo.paemployee_hm_phone_cntry
	+ "\n"+getSeaPhrase("HOME_ADDR_29","ESS")+": "+EmpInfo.paemployee_hm_phone_nbr
	+ "\n\n"+getSeaPhrase("HOME_ADDR_30","ESS")+": "+addrform.addr1.value
    + "\n"+getSeaPhrase("HOME_ADDR_31","ESS")+": "+addrform.addr2.value
    + "\n"+getSeaPhrase("HOME_ADDR_32","ESS")+": "+addrform.addr3.value
    + "\n"+getSeaPhrase("HOME_ADDR_33","ESS")+": "+addrform.addr4.value
	+ "\n"+getSeaPhrase("HOME_ADDR_34","ESS")+": "+addrform.city.value
    + "\n"+getSeaPhrase("HOME_ADDR_35","ESS")+": "+NewState
	+ "\n"+getSeaPhrase("HOME_ADDR_36","ESS")+": "+addrform.zip.value
	+ "\n"+getSeaPhrase("HOME_ADDR_37","ESS")+": "+addrform.county.value
	+ "\n"+getSeaPhrase("HOME_ADDR_38","ESS")+": "+addrform.country.options[addrform.country.selectedIndex].value
	+ "\n"+getSeaPhrase("HOME_ADDR_39","ESS")+": "+addrform.hmphonecntry.value
	+ "\n"+getSeaPhrase("HOME_ADDR_40","ESS")+": "+addrform.hmphonenbr.value
	if (SuppFlag)
	{
    	pObj.message += "\n\n"+getSeaPhrase("HOME_ADDR_51","ESS")+":"
    	+ "\n"+getSeaPhrase("HOME_ADDR_19","ESS")+": "+EmpInfo.paemployee_supp_addr1
    	+ "\n"+getSeaPhrase("HOME_ADDR_20","ESS")+": "+EmpInfo.paemployee_supp_addr2
    	+ "\n"+getSeaPhrase("HOME_ADDR_21","ESS")+": "+EmpInfo.paemployee_supp_addr3
    	+ "\n"+getSeaPhrase("HOME_ADDR_22","ESS")+": "+EmpInfo.paemployee_supp_addr4
		+ "\n"+getSeaPhrase("HOME_ADDR_23","ESS")+": "+EmpInfo.paemployee_supp_city
    	+ "\n"+getSeaPhrase("HOME_ADDR_24","ESS")+": "+EmpInfo.paemployee_supp_state
		+ "\n"+getSeaPhrase("HOME_ADDR_25","ESS")+": "+EmpInfo.paemployee_supp_zip
		+ "\n"+getSeaPhrase("HOME_ADDR_26","ESS")+": "+EmpInfo.paemployee_supp_county
		+ "\n"+getSeaPhrase("HOME_ADDR_27","ESS")+": "+EmpInfo.paemployee_supp_cntry_cd
    	+ "\n"+getSeaPhrase("HOME_ADDR_28","ESS")+": "+EmpInfo.paemployee_supp_phone_cnt
		+ "\n"+getSeaPhrase("HOME_ADDR_29","ESS")+": "+EmpInfo.paemployee_supp_phone_nbr
		+ "\n\n"+getSeaPhrase("HOME_ADDR_30","ESS")+": "+saddrform.saddr1.value
    	+ "\n"+getSeaPhrase("HOME_ADDR_31","ESS")+": "+saddrform.saddr2.value
    	+ "\n"+getSeaPhrase("HOME_ADDR_32","ESS")+": "+saddrform.saddr3.value
    	+ "\n"+getSeaPhrase("HOME_ADDR_33","ESS")+": "+saddrform.saddr4.value
		+ "\n"+getSeaPhrase("HOME_ADDR_34","ESS")+": "+saddrform.scity.value
    	+ "\n"+getSeaPhrase("HOME_ADDR_35","ESS")+": "+saddrform.sstate.options[saddrform.sstate.selectedIndex].value
		+ "\n"+getSeaPhrase("HOME_ADDR_36","ESS")+": "+saddrform.szip.value
		+ "\n"+getSeaPhrase("HOME_ADDR_37","ESS")+": "+saddrform.scounty.value
		+ "\n"+getSeaPhrase("HOME_ADDR_38","ESS")+": "+saddrform.scountry.options[saddrform.scountry.selectedIndex].value
		+ "\n"+getSeaPhrase("HOME_ADDR_39","ESS")+": "+saddrform.supphonecntry.value
		+ "\n"+getSeaPhrase("HOME_ADDR_40","ESS")+": "+saddrform.supphonenbr.value
	}
	if (EmailError)
		pObj.message += "\n\n"+getSeaPhrase("HOME_ADDR_41","ESS");
	// Check tax filter values to see if local tax authority fields may need to be changed.
	if (TaxFlag)
		pObj.message += "\n\n"+getSeaPhrase("HOME_ADDR_48","ESS");
	timer = setTimeout("cgiEmailDone()", 3000);
	EMAIL(pObj,"jsreturn");
}

function normalizeField(fldVal, fldLen)
{
	if (typeof(fldVal) != "undefined")
	{
		fldVal = fldVal.toString();
		for (var i=fldVal.length; i<fldLen; i++)
			fldVal += " ";
	}
	return fldVal;
}

function cgiEmailDone()
{
	clearTimeout(timer);
	FinishAddressChange();
}

function fitToScreen()
{
	if (typeof(window["styler"]) == "undefined" || window.styler == null)
		window.stylerWnd = findStyler(true);
	if (!window.stylerWnd)
		return;
	if (typeof(window.stylerWnd["StylerEMSS"]) == "function")
		window.styler = new window.stylerWnd.StylerEMSS();
	else
		window.styler = window.stylerWnd.styler;
	var mainFrame = document.getElementById("MAIN");
	var winObj = getWinSize();
	var winWidth = winObj[0];	
	var winHeight = winObj[1];
	var contentHeight;
	var contentBorderHeight;	
	var contentWidth;
	var contentBorderWidth;
	var tabHeight;
	var tabWidth;
	if (window.styler && window.styler.showInfor)
	{
		contentWidth = winWidth - 10;
		var elmPad = 2;
		if ((navigator.appName.indexOf("Microsoft") >= 0) && (!document.documentMode || document.documentMode < 8))
			elmPad = 7;		
		contentBorderWidth = contentWidth + elmPad;
		contentHeight = winHeight - 65;
		contentBorderHeight = contentHeight + 30;
		tabHeight = contentHeight + 25;
		tabWidth = contentWidth;	
	}
	else if (window.styler && (window.styler.showLDS || window.styler.showInfor3))
	{
		contentWidth = winWidth - 20;
		contentBorderWidth = (window.styler.showInfor3) ? contentWidth + 7 : contentWidth + 17;
		contentHeight = winHeight - 75;
		contentBorderHeight = contentHeight + 30;				
		tabHeight = contentHeight + 25;
		tabWidth = contentWidth;		
	}
	else
	{
		contentWidth = winWidth - 10;
		contentBorderWidth = contentWidth;
		contentHeight = winHeight - 60;
		contentBorderHeight = contentHeight + 24;				
		tabHeight = contentHeight + 30;
		tabWidth = contentWidth;		
	}
	mainFrame.style.width = winWidth + "px";
	mainFrame.style.height = winHeight + "px";
	// disable the onresize window event if it exists - we don't want the elements in the frame to resize themselves
	if (self.MAIN.onresize && self.MAIN.onresize.toString().indexOf("setLayerSizes") >= 0)
		self.MAIN.onresize = null;
	try
	{
		self.MAIN.document.getElementById("paneBorder").style.width = contentBorderWidth + "px";
		self.MAIN.document.getElementById("paneBorder").style.height = contentBorderHeight + "px";
		self.MAIN.document.getElementById("paneBodyBorder").style.height = contentHeight + "px";
		self.MAIN.document.getElementById("paneBodyBorder").style.width = contentWidth + "px";
		self.MAIN.document.getElementById("paneBody").style.width = contentWidth + "px";
		self.MAIN.document.getElementById("paneBody").style.height = contentHeight + "px";
	}
	catch(e) {}
	try
	{
		if (window.styler && window.styler.showInfor && (navigator.appName.indexOf("Microsoft") >= 0) && (!document.documentMode || (document.documentMode < 8)))
			tabWidth += 20;
		if (typeof(addrTabs) != "undefined")
		{	
			// the theme 10.3 HTML5 control may take time to render tab contents, so wait before sizing
			var delayInMS = (window.styler && window.styler.showInfor3) ? 200 : 1;
			setTimeout(function(){setTabContentSizes("addrTabs", addrTabs.frame, tabWidth, tabHeight);}, delayInMS);
		}
	}
	catch(e) {}
}
</script>
</head>
<body style="width:100%;height:100%;overflow:hidden" onload="fitToScreen();OpenMoveEvent()" onresize="fitToScreen()">
	<iframe id="MAIN" name="MAIN" title="Main Content" level="2" tabindex="0" src="/lawson/xhrnet/ui/innertabpanehelp.htm" style="position:absolute;left:0px;width:100%;top:0px;height:555px" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="jsreturn" name="jsreturn" title="Empty" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/dot.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="lawheader" name="lawheader" title="Empty" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/errmsg.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
</body>
<!-- Version: 8-)@(#)@10.00.05.00.12 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/empaddress.htm,v 1.19.2.83 2014/02/24 22:02:29 brentd Exp $ -->
<!--************************************************************
 *                                                             *
 *                           NOTICE                            *
 *                                                             *
 *   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
 *   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
 *   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
 *   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
 *   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
 *   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
 *   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
 *                                                             *
 *   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
 *   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
 *   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
 *   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
 *   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
 *   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
 *                                                             *
 ************************************************************-->

