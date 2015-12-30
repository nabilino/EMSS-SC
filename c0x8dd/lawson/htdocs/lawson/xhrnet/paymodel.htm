<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width" />
<title>Payment Modeling</title>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/xhrnet/statesuscan.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/webappjs/transaction.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script>
//NOTE: The ROTH setting has been moved to the xhrnet/xml/config/emss_config.xml file.
var parentTask = "";
var fromTask = (window.location.search)?unescape(window.location.search):"";
var locals = new Array()
var MaritalStatusList = new Array()
var b457bf = false;
var fromW4 = false;

if (fromTask) 
{
	parentTask = getVarFromString("from",fromTask);
	if (parentTask != "main")
	{
		var param = fromTask.substring(1).split("&");
		var fromPair = param[0].split("=");
		if (fromPair[0] == "from" && fromPair[1] == "w4");
		{
			// coming from tax withholding
	        fromW4 = true;
			var pair1 = param[1].split("=");
			fd_exempts = pair1[1];
			var pair2 = param[2].split("=");
			fd_tax_perc = pair2[1];
			var pair3 = param[3].split("=");
			fd_mar_status = pair3[1];
		}		
	}	
}

function GetWebuser()
{
	authenticate("frameNm='jsreturn'|funcNm='InitPayModel()'|desiredEdit='EM'");
}

function InitPayModel()
{
	stylePage();
	setWinTitle(getSeaPhrase("PAYMENT_MODELING","ESS"));
	var nextFunc;
	if (emssObjInstance.emssObj.filterSelect)
		nextFunc = GetMaritalSatusCodes;
	else
		nextFunc = function(){GrabStates("GrabLocals()");};
	startProcessing(getSeaPhrase("RETRIEVE_DEFAULT","ESS"), nextFunc);	
}

function GetMaritalSatusCodes()
{
	InitMaritalStatus();
	GetDefaults(true);
}

function GrabLocals()
{
	InitMaritalStatus();
	var dmeObj = new DMEObject(authUser.prodline, "PRTAXAUTH");
	dmeObj.out = "JAVASCRIPT";
	dmeObj.select = "TAX-AUTH-TYPE=CI|TAX-AUTH-TYPE=CN|TAX-AUTH-TYPE=SD";
	dmeObj.index = "PRXSET3";
	dmeObj.key	= "US";
	dmeObj.field = "tax-id-code;description;tax-auth-type";
	dmeObj.max = "600";
	dmeObj.func = "DspLocals()";
	dmeObj.sortasc = "description";
	dmeObj.debug = false;
	DME(dmeObj,"jsreturn");
}

function DspLocals()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
    {
    	var j = locals.length;
		locals[j] = self.jsreturn.record[i];
    }
	if (self.jsreturn.Next != "")
		self.jsreturn.location.replace(self.jsreturn.Next);
  	else
		GetDefaults(true);
}

function GetDefaults(firstTime)
{
    if (firstTime)
		StoreDateRoutines();
    rtn = new Object();
    rtn.field = new Array();
	var object = new AGSObject(authUser.prodline,"PR89.1");
	object.event = "CHANGE";
	object.rtn = "DATA";
	object.longNames = true;
	object.tds = false;
	object.field = "FC=X"
	+ "&EMP-COMPANY=" + authUser.company
	+ "&CHECK-DATE="+ ymdtoday
	+ "&EMP-EMPLOYEE=" + authUser.employee
	+ "&DED-CYCLE=1";
    object.out = "JS";
    object.func = "parent.agsDone("+firstTime+")";
	AGS(object,"jsreturn");
}

function GetCurrentData()
{
	startProcessing(getSeaPhrase("RETRIEVE_DEFAULT","ESS"), function(){GetDefaults(false);});	
}

function agsDone(firstTime)
{
	if (typeof(rtn.RtnMsgErrNbr) == "undefined")
		rtn = self.jsreturn;
	if (rtn.RtnMsgErrNbr == "189")
    {
		stopProcessing();
		parent.seaAlert(getSeaPhrase("NOT_AVAILABLE_LOCATION","ESS"), null, null, "error");
    	if (firstTime && fromW4)
    		parent.backToMain('PAYMODEL');		
		return
    }
	else if (rtn.RtnMsgErrNbr == "192" || rtn.RtnMsgErrNbr == "193" || rtn.RtnMsgErrNbr == "126" || rtn.RtnMsgErrNbr == "128" || rtn.RtnMsgErrNbr == "103" ||
		(rtn.RtnMsgErrNbr == "000" && rtn.RtnMsg.indexOf("BSI") != -1 && rtn.RtnMsg.indexOf("Error") != -1))
    {
		stopProcessing();
		parent.seaAlert(getSeaPhrase("PM_2","ESS")+' '+rtn.RtnMsg, null, null, "error");
    	if (firstTime && fromW4)
    		parent.backToMain('PAYMODEL');		
		return
    }
    else if (rtn.RtnMsgErrNbr != "000" && rtn.RtnMsgErrNbr != "104" && rtn.RtnMsgErrNbr != "114")
    {
    	stopProcessing();
    	parent.seaAlert(rtn.RtnMsg, null, null, "error");
    	if (firstTime && fromW4)
    		parent.backToMain('PAYMODEL');
        return;
    }
    if (rtn.field["S457B-EE-FLAG"])
    	b457bf = true;
    if (firstTime)
	    BuildForm();
	else
		PopulateForm(firstTime);
}

function BuildForm()
{
	var toolTip;
	var lbl457b = (b457bf) ? getSeaPhrase("457B","ESS") : getSeaPhrase("457","ESS");
	if (rtn.field["EMP-SALARY-CLASS"].value == "H")
    	Hourly = true;
    else
    	Hourly = false;
	var hdrLbl = getSeaPhrase("WAGES","ESS");
	var page = '<form style="padding-bottom:30px">'
	<!-- CGL 10/14/2014 - Added explanatory help text for Payment Modeling page per Payroll -->
	+ '<b>Payment Modeling enables employees to hypothetically calculate new net or gross payments based on changes to pay rate, tax exemptions, and other variables.</b><p>'
	<!-- CGL 10/14/2014 - End of Mod -->
	+ '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;height:100%" role="presentation">'
	+ '<tr><th class="plaintablerowheaderbold" style="width:180px">'+hdrLbl+'</th><td></td></tr>'
	+ '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="emp_pay_rate"><span class="offscreen">'+hdrLbl+'&nbsp;</span>'+(Hourly ? getSeaPhrase("PAY_RATE","ESS") : getSeaPhrase("ANNUAL_SALARY","ESS"))+'</label></th>'
	+ '<td class="plaintablecell"><input class="inputbox" type="text" id="emp_pay_rate" name="emp_pay_rate" size="14" maxlength="14" onchange="parent.ValidateNumber(this,14,4)" onfocus="this.select()"></tr>'
	if (Hourly) 
	{
    	page += '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="hours"><span class="offscreen">'+hdrLbl+'&nbsp;</span>'+getSeaPhrase("HOURS","ESS")+'</label></th>'
		+ '<td class="plaintablecell"><input class="inputbox" type="text" id="hours" name="hours" size="6" maxlength="6" onchange="parent.ValidateNumber(this,6,2)" onfocus="this.select()"></td></tr>'
	}
	page += '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="gross_pay"><span class="offscreen">'+hdrLbl+'&nbsp;</span>'+getSeaPhrase("GROSS_AMOUNT","ESS")+'</label></th>'
	+ '<td class="plaintablecell"><input class="inputbox" type="text" id="gross_pay" name="gross_pay" size="10" maxlength="10" onchange="parent.ValidateNumber(this,10,2)" onfocus="this.select()"></td></tr>'
	+ '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="net_pay_amt"><span class="offscreen">'+hdrLbl+'&nbsp;</span>'+getSeaPhrase("NET_AMOUNT","ESS")+'</label></th>'
	+ '<td class="plaintablecell"><input class="inputbox" type="text" id="net_pay_amt" name="net_pay_amt" size="10" maxlength="10" onchange="parent.ValidateNumber(this,10,2)" onfocus="this.select()"></td></tr>'
	+ '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="emp_pay_frequency"><span class="offscreen">'+hdrLbl+'&nbsp;</span>'+getSeaPhrase("FREQUENCY","ESS")+'</label></th>'
	+ '<td id="empPayFreq" class="plaintablecell">'+BuildFrequencySelect()+'</td></tr>'
	+ '<tr><th class="plaintablerowheader" style="height:20px">&nbsp;</th><td>&nbsp;</td></tr>'
	hdrLbl = getSeaPhrase("TAXES","ESS");
	hdrLbl2 = getSeaPhrase("FEDERAL","ESS");
	page += '<tr><th class="plaintablerowheaderbold">'+hdrLbl+'</th><td>&nbsp;</td></tr>'
	+ '<tr><th class="plaintablerowheaderbold">'+hdrLbl2+'</th><td>&nbsp;</td></tr>'
	+ '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="emp_fd_exempts"><span class="offscreen">'+hdrLbl+' '+hdrLbl2+'&nbsp;</span>'+getSeaPhrase("EXEMPTIONS","ESS")+'</label></th>'
	+ '<td class="plaintablecell"><input class="inputbox" type="text" id="emp_fd_exempts" name="emp_fd_exempts" size="3" maxlength="3" onchange="parent.ValidateNumber(this,3,0)" onfocus="this.select()"></td></tr>'
	+ '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="emp_fd_mar_status"><span class="offscreen">'+hdrLbl+' '+hdrLbl2+'&nbsp;</span>'+getSeaPhrase("MARITAL_STATUS","ESS")+'</label></th>'
	+ '<td class="plaintablecell"><select class="inputbox" id="emp_fd_mar_status" name="emp_fd_mar_status">'+BuildMaritalSelect("F")+'</select></td></tr>'
	+ '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="emp_fd_tax_perc"><span class="offscreen">'+hdrLbl+' '+hdrLbl2+'&nbsp;</span>'+getSeaPhrase("EXTRA_WITHHOLDING","ESS")+'</label></th>'
	+ '<td class="plaintablecell"><input class="inputbox" type="text" id="emp_fd_tax_perc" name="emp_fd_tax_perc" size="10" maxlength="10" onchange="parent.ValidateNumber(this,10,3)" onfocus="this.select()">'
	+ '&nbsp;<label class="offscreen" for="emp_fd_exmpt_addl"><span class="offscreen">'+hdrLbl+' '+hdrLbl2+'&nbsp;</span>'+getSeaPhrase("CONT_TYPE","SEA")+'</label><select class="inputbox" id="emp_fd_exmpt_addl" name="emp_fd_exmpt_addl">'
	+ '<option value="2" selected>'+getSeaPhrase("AMOUNT","ESS")+'</option>'
	+ '<option value="4">'+getSeaPhrase("PERCENT","ESS")+'</option></select></td></tr>'
	+ '<tr><th class="plaintablerowheader" style="height:15px">&nbsp;</th><td>&nbsp;</td></tr>'
	hdrLbl2 = getSeaPhrase("STATE_ONLY","ESS");
	page += '<tr><th class="plaintablerowheaderbold">'+hdrLbl2+'</th><td>&nbsp;</td></tr>'
	+ '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="emp_tax_state"><span class="offscreen">'+hdrLbl+' '+hdrLbl2+'&nbsp;</span>'+getSeaPhrase("STATE_ONLY","ESS")+'</label></th>'
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("state");
		page += '<td class="plaintablecell"><input class="inputbox" type="text" id="emp_tax_state" name="emp_tax_state" fieldnm="state" value="" size="2" maxlength="2" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'state\');">'
		+ '<a href="javascript:parent.openDmeFieldFilter(\'state\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
		+ '<img style="vertical-align:top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
		+ '<span id="stateDesc" class="plaintablecelldisplay" style="width:200px"></span></td></tr>'
	}
	else
		page += '<td class="plaintablecell"><select class="inputbox" id="emp_tax_state" name="emp_tax_state">'+BuildStateSelect("","Y")+'</select></td></tr>'
   	page += '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="emp_st_exempts"><span class="offscreen">'+hdrLbl+' '+hdrLbl2+'&nbsp;</span>'+getSeaPhrase("EXEMPTIONS","ESS")+'</label></th>'
	+ '<td class="plaintablecell"><input class="inputbox" type="text" id="emp_st_exempts" name="emp_st_exempts" size="3" maxlength="3" onchange="parent.ValidateNumber(this,3,0)" onfocus="this.select()"></td></tr>'
    + '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="emp_st_mar_status"><span class="offscreen">'+hdrLbl+' '+hdrLbl2+'&nbsp;</span>'+getSeaPhrase("MARITAL_STATUS","ESS")+'</label></th>'
	+ '<td class="plaintablecell"><select class="inputbox" id="emp_st_mar_status" name="emp_st_mar_status">'+BuildMaritalSelect("S")+'</select></td></tr>'
    + '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="emp_st_tax_perc"><span class="offscreen">'+hdrLbl+' '+hdrLbl2+'&nbsp;</span>'+getSeaPhrase("EXTRA_WITHHOLDING","ESS")+'</label></th>'
	+ '<td class="plaintablecell"><input class="inputbox" type="text" id="emp_st_tax_perc" name="emp_st_tax_perc" size="10" maxlength="10" onchange="parent.ValidateNumber(this,10,3)" onfocus="this.select()">'
	+ '&nbsp;<label class="offscreen" for="emp_st_exmpt_addl"><span class="offscreen">'+hdrLbl+' '+hdrLbl2+'&nbsp;</span>'+getSeaPhrase("CONT_TYPE","SEA")+'</label><select class="inputbox" id="emp_st_exmpt_addl" name="emp_st_exmpt_addl">'
	+ '<option value="2" selected>'+getSeaPhrase("AMOUNT","ESS")+'</option>'
	+ '<option value="4">'+getSeaPhrase("PERCENT","ESS")+'</option></select></td></tr>'
	+ '<tr><th class="plaintablerowheader" style="height:15px">&nbsp;</th><td>&nbsp;</td></tr>'
	hdrLbl2 = getSeaPhrase("LOCAL","ESS");
    page += '<tr><th class="plaintablerowheaderbold">'+hdrLbl2+'</th><td>&nbsp;</td></tr>'
    + '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="emp_tax_county"><span class="offscreen">'+hdrLbl+' '+hdrLbl2+'&nbsp;</span>'+getSeaPhrase("COUNTY_ONLY","ESS")+'</label></th>'
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("county");
		page += '<td class="plaintablecell"><input class="inputbox" type="text" id="emp_tax_county" name="emp_tax_county" fieldnm="county" value="" size="10" maxlength="10" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'county\');">'
		+ '<a href="javascript:parent.openDmeFieldFilter(\'county\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
		+ '<img style="vertical-align:top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
		+ '<span id="countyDesc" class="plaintablecelldisplay" style="width:200px"></span></td></tr>'
	}
	else
		page += '<td class="plaintablecell"><select class="inputbox" id="emp_tax_county" name="emp_tax_county">'+BuildLocalSelect("CN")+'</select></td></tr>'
    page += '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="emp_tax_city"><span class="offscreen">'+hdrLbl+' '+hdrLbl2+'&nbsp;</span>'+getSeaPhrase("CITY","ESS")+'</label></th>'
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("city");
		page += '<td class="plaintablecell"><input class="inputbox" type="text" id="emp_tax_city" name="emp_tax_city" fieldnm="city" value="" size="10" maxlength="10" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'city\');">'
		+ '<a href="javascript:parent.openDmeFieldFilter(\'city\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
		+ '<img style="vertical-align:top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
		+ '<span id="cityDesc" class="plaintablecelldisplay" style="width:200px"></span></td></tr>'
	}
	else
		page += '<td class="plaintablecell"><select class="inputbox" id="emp_tax_city" name="emp_tax_city">'+BuildLocalSelect("CI")+'</select></td></tr>'
	page += '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="emp_tax_school"><span class="offscreen">'+hdrLbl+' '+hdrLbl2+'&nbsp;</span>'+getSeaPhrase("SCHOOL","ESS")+'</label></th>'
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("school");
		page += '<td class="plaintablecell"><input class="inputbox" type="text" id="emp_tax_school" name="emp_tax_school" fieldnm="school" value="" size="10" maxlength="10" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'school\');">'
		+ '<a href="javascript:parent.openDmeFieldFilter(\'school\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
		+ '<img style="vertical-align:top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
		+ '<span id="schoolDesc" class="plaintablecelldisplay" style="width:200px"></span></td></tr>'
	}
	else
		page += '<td class="plaintablecell"><select class="inputbox" id="emp_tax_school" name="emp_tax_school">'+BuildLocalSelect("SD")+'</select></td></tr>'
	page += '<tr><th class="plaintablerowheader" style="height:20px">&nbsp;</th><td>&nbsp;</td></tr>'
	hdrLbl = getSeaPhrase("DEDUCTIONS","ESS");
    page += '<tr><th class="plaintablerowheaderbold">'+hdrLbl+'</th><td></td></tr>'
	+ '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="exempt_amt_pct"><span class="offscreen">'+hdrLbl+'&nbsp;</span>'+getSeaPhrase("EXEMPT","ESS")+'</label></th>'
	+ '<td class="plaintablecell"><input class="inputbox" type="text" id="exempt_amt_pct" name="exempt_amt_pct" size="11" maxlength="11" onchange="parent.ValidateNumber(this,11,2)" onfocus="this.select()">&nbsp;'+BuildAmntPrcntSelect("exempt_flag")+'</td></tr>'
	+ '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="s125_amt_pct"><span class="offscreen">'+hdrLbl+'&nbsp;</span>'+getSeaPhrase("SECTION_125","ESS")+'</label></th>'
	+ '<td class="plaintablecell"><input class="inputbox" type="text" id="s125_amt_pct" name="s125_amt_pct" size="11" maxlength="11" onchange="parent.ValidateNumber(this,11,2)" onfocus="this.select()">&nbsp;'+BuildAmntPrcntSelect("s125_flag")+'</td></tr>'
	+ '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="s401k_amt_pct"><span class="offscreen">'+hdrLbl+'&nbsp;</span>'+getSeaPhrase("401K","ESS")+'</label></th>'
	+ '<td class="plaintablecell"><input class="inputbox" type="text" id="s401k_amt_pct" name="s401k_amt_pct" size="11" maxlength="11" onchange="parent.ValidateNumber(this,11,2)" onfocus="this.select()">&nbsp;'+BuildAmntPrcntSelect("s401k_flag")+'</td></tr>'
	+ '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="s403b_amt_pct"><span class="offscreen">'+hdrLbl+'&nbsp;</span>'+getSeaPhrase("403B","ESS")+'</label></th>'
	+ '<td class="plaintablecell"><input class="inputbox" type="text" id="s403b_amt_pct" name="s403b_amt_pct" size="11" maxlength="11" onchange="parent.ValidateNumber(this,11,2)" onfocus="this.select()">&nbsp;'+BuildAmntPrcntSelect("s403b_flag")+'</td></tr>'
	+ '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="s457_amt_pct"><span class="offscreen">'+hdrLbl+'&nbsp;</span>'+lbl457b+'</label></th>'
	+ '<td class="plaintablecell"><input class="inputbox" type="text" id="s457_amt_pct" name="s457_amt_pct" size="11" maxlength="11" onchange="parent.ValidateNumber(this,11,2)" onfocus="this.select()">&nbsp;'+BuildAmntPrcntSelect("s457_flag")+'</td></tr>'
    if (b457bf)
    {
		page += '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="s457b_ee_amt_pct"><span class="offscreen">'+hdrLbl+'&nbsp;</span>'+getSeaPhrase("457B_EE","ESS")+'</label></th>'
		+ '<td class="plaintablecell"><input class="inputbox" type="text" id="s457b_ee_amt_pct" name="s457b_ee_amt_pct" size="11" maxlength="11" onchange="parent.ValidateNumber(this,11,2)" onfocus="this.select()">&nbsp;'+BuildAmntPrcntSelect("s457b_ee_flag")+'</td></tr>'
		+ '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="s457f_amt_pct"><span class="offscreen">'+hdrLbl+'&nbsp;</span>'+getSeaPhrase("457F","ESS")+'</label></th>'
		+ '<td class="plaintablecell"><input class="inputbox" type="text" id="s457f_amt_pct" name="s457f_amt_pct" size="11" maxlength="11" onchange="parent.ValidateNumber(this,11,2)" onfocus="this.select()">&nbsp;'+BuildAmntPrcntSelect("s457f_flag")+'</td></tr>'
	}
	page += '<tr><th class="plaintablerowheaderborderbottom" style="font-weight:normal"><label for="other_amt_pct"><span class="offscreen">'+hdrLbl+'&nbsp;</span>'+getSeaPhrase("AFTER_TAX","ESS")+'</label></th>'
	+ '<td class="plaintablecell"><input class="inputbox" type="text" id="other_amt_pct" name="other_amt_pct" size="11" maxlength="11" onchange="parent.ValidateNumber(this,11,2)" onfocus="this.select()">&nbsp;'+BuildAmntPrcntSelect("other_flag")+'</td></tr>'
	if (emssObjInstance.emssObj.rothPayModel)
	{
		page += '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="roth401k_amt_pct"><span class="offscreen">'+hdrLbl+'&nbsp;</span>'+getSeaPhrase("ROTH_401K","ESS")+'</label></th>'
		+ '<td class="plaintablecell"><input class="inputbox" type="text" id="roth401k_amt_pct" name="roth401k_amt_pct" size="11" maxlength="11" onchange="parent.ValidateNumber(this,11,2)" onfocus="this.select()">&nbsp;'+BuildAmntPrcntSelect("roth401k_flag")+'</td></tr>'
		+ '<tr><th class="plaintablerowheader" style="font-weight:normal"><label for="roth403b_amt_pct"><span class="offscreen">'+hdrLbl+'&nbsp;</span>'+getSeaPhrase("ROTH_403B","ESS")+'</label></th>'
		+ '<td class="plaintablecell"><input class="inputbox" type="text" id="roth403b_amt_pct" name="roth403b_amt_pct" size="11" maxlength="11" onchange="parent.ValidateNumber(this,11,2)" onfocus="this.select()">&nbsp;'+BuildAmntPrcntSelect("roth403b_flag")+'</td></tr>'
   	}
	page += '<tr><td class="plaintablecell" style="width:180px">&nbsp;</td>'
	+ '<td class="plaintablecell" style="white-space:nowrap">'
	+ uiButton(getSeaPhrase("GET_CURRENT_DATA","ESS"), "parent.GetCurrentData();return false;")
	+ uiButton(getSeaPhrase("CALCULATE","ESS"), "parent.ProcessForm();return false;", "margin-left:5px")
	+ uiButton(getSeaPhrase("CLEAR","ESS"), "parent.ClearForm();return false;", "margin-left:5px")
	if (fromW4)
		page += uiButton(getSeaPhrase("BACK","ESS"),"parent.parent.backToMain('PAYMODEL');return false","margin-left:15px")
	page += '</td></tr></table></form>'
	self.CONTROLS.document.getElementById("paneHeader").innerHTML = getSeaPhrase("CALCULATOR","ESS");
	self.CONTROLS.document.getElementById("paneBody").innerHTML = page;
	PopulateForm(true);
}

function PopulateForm(firstTime)
{
	setFormValues();
    DisplayResults(firstTime);
}

function setFormValues()
{
	var doc = self.CONTROLS.document;
	var frm = doc.forms[0];
    frm.emp_pay_rate.value = FormatDecimalField(rtn.field["EMP-PAY-RATE"].value,4)
    oldSalary = frm.emp_pay_rate.value
    frm.gross_pay.value = FormatDecimalField(rtn.field["GROSS-PAY"].value,2)
    oldGross = frm.gross_pay.value
    frm.net_pay_amt.value = FormatDecimalField(rtn.field["NET-PAY-AMT"].value,2)
    oldNet = frm.net_pay_amt.value
    oldHours = ""
    if (Hourly)
    {
	    frm.hours.value = FormatDecimalField(rtn.field["HOURS"].value,2)
	    oldHours = frm.hours.value
    }
  	SetSelectedIndex(frm.emp_pay_frequency,Number(rtn.field["EMP-PAY-FREQUENCY"].value))
    oldFreq = Number(rtn.field["EMP-PAY-FREQUENCY"].value)
    frm.emp_st_exempts.value = Number(rtn.field["EMP-ST-EXEMPTS"].value)
	SetSelectedIndex(frm.emp_st_mar_status,Number(rtn.field["EMP-ST-MAR-STATUS"].value))
	frm.emp_st_tax_perc.value = FormatDecimalField(rtn.field["EMP-ST-TAX-PERC"].value,3)
  	SetSelectedIndex(frm.emp_st_exmpt_addl,Number(rtn.field["EMP-ST-EXMPT-ADDL"].value))
    if (fromW4)
    {
  	    frm.emp_fd_exempts.value = fd_exempts
  		SetSelectedIndex(frm.emp_fd_mar_status,fd_mar_status)
  	    frm.emp_fd_tax_perc.value = fd_tax_perc
  		SetSelectedIndex(frm.emp_fd_exmpt_addl,2)
    }
    else
    {
  	    frm.emp_fd_exempts.value = Number(rtn.field["EMP-FD-EXEMPTS"].value)
  		SetSelectedIndex(frm.emp_fd_mar_status,Number(rtn.field["EMP-FD-MAR-STATUS"].value))
  	    frm.emp_fd_tax_perc.value = FormatDecimalField(rtn.field["EMP-FD-TAX-PERC"].value,3)
  		SetSelectedIndex(frm.emp_fd_exmpt_addl,Number(rtn.field["EMP-FD-EXMPT-ADDL"].value))
  	}
	if (emssObjInstance.emssObj.filterSelect)
	{
		frm.emp_tax_state.value = rtn.field["EMP-TAX-STATE"].value;
		try { doc.getElementById("stateDesc").innerHTML = rtn.field["PSA-DESCRIPTION"].value; } catch(e) {}
		frm.emp_tax_county.value = rtn.field["EMP-TAX-COUNTY"].value;
		try { doc.getElementById("countyDesc").innerHTML = rtn.field["PRX-DESCRIPTION"].value; } catch(e) {}
		frm.emp_tax_city.value = rtn.field["EMP-TAX-CITY"].value;
		try { doc.getElementById("cityDesc").innerHTML = rtn.field["PRX1-DESCRIPTION"].value; } catch(e) {}
		frm.emp_tax_school.value = rtn.field["EMP-TAX-SCHOOL"].value;
		try { doc.getElementById("schoolDesc").innerHTML = rtn.field["PRX2-DESCRIPTION"].value; } catch(e) {}
	}
	else
	{
		SetSelectedIndex(frm.emp_tax_state,rtn.field["EMP-TAX-STATE"].value)
		SetSelectedIndex(frm.emp_tax_county,rtn.field["EMP-TAX-COUNTY"].value)
		SetSelectedIndex(frm.emp_tax_city,rtn.field["EMP-TAX-CITY"].value)
		SetSelectedIndex(frm.emp_tax_school,rtn.field["EMP-TAX-SCHOOL"].value)
	}
  	SetSelectedIndex(frm.exempt_flag,rtn.field["EXEMPT-FLAG"].value)
  	SetSelectedIndex(frm.s125_flag,rtn.field["S125-FLAG"].value)
  	SetSelectedIndex(frm.s401k_flag,rtn.field["S401K-FLAG"].value)
  	SetSelectedIndex(frm.s403b_flag,rtn.field["S403B-FLAG"].value)
  	SetSelectedIndex(frm.s457_flag,rtn.field["S457-FLAG"].value)
  	if (b457bf)
  	{
	  	SetSelectedIndex(frm.s457b_ee_flag,rtn.field["S457B-EE-FLAG"].value)
	  	SetSelectedIndex(frm.s457f_flag,rtn.field["S457F-FLAG"].value)
  	}
  	SetSelectedIndex(frm.other_flag,rtn.field["OTHER-FLAG"].value)
  	if (emssObjInstance.emssObj.rothPayModel)
  	{
  		SetSelectedIndex(frm.roth401k_flag,rtn.field["ROTH401K-FLAG"].value)
  		SetSelectedIndex(frm.roth403b_flag,rtn.field["ROTH403B-FLAG"].value)
  		if (rtn.field["ROTH401K-FLAG"].value == "P")
  	  		frm.roth401k_amt_pct.value = FormatDecimalField(rtn.field["ROTH401K-AMT-PCT"].value,2)
		else
			frm.roth401k_amt_pct.value = FormatDecimalField(rtn.field["ROTH401K-DED-AMT"].value,2)
  		if (rtn.field["ROTH403B-FLAG"].value == "P")
  			frm.roth403b_amt_pct.value = FormatDecimalField(rtn.field["ROTH403B-AMT-PCT"].value,2)
		else
			frm.roth403b_amt_pct.value = FormatDecimalField(rtn.field["ROTH403B-DED-AMT"].value,2)
	}
	if (rtn.field["EXEMPT-FLAG"].value == "P")
		frm.exempt_amt_pct.value = FormatDecimalField(rtn.field["EXEMPT-AMT-PCT"].value,2)
	else
		frm.exempt_amt_pct.value = FormatDecimalField(rtn.field["EXEMPT-DED-AMT"].value,2)
	if (rtn.field["S125-FLAG"].value == "P")
		frm.s125_amt_pct.value = FormatDecimalField(rtn.field["S125-AMT-PCT"].value,2)
	else
		frm.s125_amt_pct.value = FormatDecimalField(rtn.field["S125-DED-AMT"].value,2)
	if (rtn.field["S401K-FLAG"].value == "P")
		frm.s401k_amt_pct.value = FormatDecimalField(rtn.field["S401K-AMT-PCT"].value,2)
	else
		frm.s401k_amt_pct.value = FormatDecimalField(rtn.field["S401K-DED-AMT"].value,2)
	if (rtn.field["S403B-FLAG"].value == "P")
		frm.s403b_amt_pct.value = FormatDecimalField(rtn.field["S403B-AMT-PCT"].value,2)
	else
		frm.s403b_amt_pct.value = FormatDecimalField(rtn.field["S403B-DED-AMT"].value,2)
	if (rtn.field["S457-FLAG"].value == "P")
		frm.s457_amt_pct.value = FormatDecimalField(rtn.field["S457-AMT-PCT"].value,2)
	else
		frm.s457_amt_pct.value = FormatDecimalField(rtn.field["S457-DED-AMT"].value,2)
	if (b457bf)
	{
		if (rtn.field["S457B-EE-FLAG"].value == "P")
			frm.s457b_ee_amt_pct.value = FormatDecimalField(rtn.field["S457B-EE-AMT-PCT"].value,2)
		else
			frm.s457b_ee_amt_pct.value = FormatDecimalField(rtn.field["S457B-EE-DED-AMT"].value,2)
		if (rtn.field["S457F-FLAG"].value == "P")
			frm.s457f_amt_pct.value = FormatDecimalField(rtn.field["S457F-AMT-PCT"].value,2)
		else
			frm.s457f_amt_pct.value = FormatDecimalField(rtn.field["S457F-DED-AMT"].value,2)	
	}	
	if (rtn.field["OTHER-FLAG"].value == "P")
		frm.other_amt_pct.value = FormatDecimalField(rtn.field["OTHER-AMT-PCT"].value,2)
	else
		frm.other_amt_pct.value = FormatDecimalField(rtn.field["OTHER-DED-AMT"].value,2)
	self.CONTROLS.stylePage();
	self.document.getElementById("CONTROLS").style.visibility = "visible";
	fitToScreen();
}

function DisplayResults(firstTime)
{
	var lbl457b = getSeaPhrase("457","ESS");
	var dcAmt = Number(FormatDecimalField(rtn.field["S401K-DED-AMT"].value,0)) +
	Number(FormatDecimalField(rtn.field["S403B-DED-AMT"].value,0)) +
	Number(FormatDecimalField(rtn.field["S457-DED-AMT"].value,0));
	if (b457bf)
	{
		dcAmt += Number(FormatDecimalField(rtn.field["S457B-EE-DED-AMT"].value,0));
		lbl457b = getSeaPhrase("457B","ESS");
	}
	var otherDcAmt = FormatDecimalField(String(Number(FormatDecimalField(rtn.field["DC-DED-AMT"].value,0)) - dcAmt),2);
	var page = '<table border="0" cellpadding="0" cellspacing="0" style="width:100%" summary="'+getSeaPhrase("TSUM_60","SEA")+'">'
	+ '<caption class="offscreen">'+getSeaPhrase("TCAP_38","SEA")+'</caption>'
	+ '<tr><th scope="col" colspan="2"></th></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader" style="width:55%">'+getSeaPhrase("GROSS_AMOUNT","ESS")+'</th>'
	+ '<td class="plaintablecelldisplayright">'+FormatDecimalField(rtn.field["RESULT-GROSS-PAY"].value,2)+'</td>'
	+ '</tr><tr><th scope="row" class="plaintablerowheader">'+getSeaPhrase("NET_AMOUNT","ESS")+'</th>'
	+ '<td class="plaintablecelldisplayright">'+FormatDecimalField(rtn.field["RESULT-NET-PAY"].value,2)+'</td></tr>'
    if (Hourly) 
    {
		page += '<tr><th scope="row" class="plaintablerowheader">'+getSeaPhrase("HOURS","ESS")+'</th>'
		+ '<td class="plaintablecelldisplayright">'+FormatDecimalField(rtn.field["RESULT-HOURS"].value,2)+'</td></tr>'
	}
	page += '<tr><th scope="row" class="plaintablerowheaderborder">'+(Hourly ? getSeaPhrase("PAY_RATE","ESS") : getSeaPhrase("ANNUAL_SALARY","ESS"))+'</th>'
	+ '<td class="plaintablecellborderdisplayright" style="border-right:0px">'+((NonSpace(rtn.field["RESULT-PAY-RATE"].value)>0)?FormatDecimalField(rtn.field["RESULT-PAY-RATE"].value,2):'&nbsp;')+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader">'+getSeaPhrase("FEDERAL","ESS")+'</th>'
	+ '<td class="plaintablecelldisplayright">'+FormatDecimalField(rtn.field["FED-TAX-AMT"].value,2)+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader">'+getSeaPhrase("STATE_ONLY","ESS")+'</th>'
	+ '<td class="plaintablecelldisplayright">'+FormatDecimalField(rtn.field["STA-TAX-AMT"].value,2)+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader">'+getSeaPhrase("SOCIAL_SECURITY","ESS")+'</th>'
	+ '<td class="plaintablecelldisplayright">'+FormatDecimalField(rtn.field["FICA-TAX-AMT"].value,2)+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader">'+getSeaPhrase("MEDICARE","ESS")+'</th>'
	+ '<td class="plaintablecelldisplayright">'+FormatDecimalField(rtn.field["MED-TAX-AMT"].value,2)+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader">'+getSeaPhrase("COUNTY_ONLY","ESS")+'</th>'
	+ '<td class="plaintablecelldisplayright">'+FormatDecimalField(rtn.field["CNTY-TAX-AMT"].value,2)+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader">'+getSeaPhrase("CITY","ESS")+'</th>'
	+ '<td class="plaintablecelldisplayright">'+FormatDecimalField(rtn.field["CITY-TAX-AMT"].value,2)+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheaderborder">'+getSeaPhrase("SCHOOL","ESS")+'</th>'
	+ '<td class="plaintablecellborderdisplayright" style="border-right:0px">'+((NonSpace(rtn.field["SCHL-TAX-AMT"].value)>0)?FormatDecimalField(rtn.field["SCHL-TAX-AMT"].value,2):'&nbsp;')+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheaderborder">'+getSeaPhrase("OTHER","ESS")+'</th>'
	+ '<td class="plaintablecellborderdisplayright" style="border-right:0px">'+((NonSpace(rtn.field["OTHER-TAX-AMT"].value)>0)?FormatDecimalField(rtn.field["OTHER-TAX-AMT"].value,2):'&nbsp;')+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader">'+getSeaPhrase("EXEMPT","ESS")+'</th>'
	+ '<td class="plaintablecelldisplayright">'+FormatDecimalField(rtn.field["EXEMPT-DED-AMT"].value,2)+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader">'+getSeaPhrase("SECTION_125","ESS")+'</th>'
	+ '<td class="plaintablecelldisplayright">'+FormatDecimalField(rtn.field["S125-DED-AMT"].value,2)+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader">'+getSeaPhrase("401K","ESS")+'</th>'
	+ '<td class="plaintablecelldisplayright">'+FormatDecimalField(rtn.field["S401K-DED-AMT"].value,2)+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader">'+getSeaPhrase("403B","ESS")+'</th>'
	+ '<td class="plaintablecelldisplayright">'+FormatDecimalField(rtn.field["S403B-DED-AMT"].value,2)+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheader">'+lbl457b+'</th>'
	+ '<td class="plaintablecelldisplayright">'+FormatDecimalField(rtn.field["S457-DED-AMT"].value,2)+'</td></tr>'
	if (b457bf)
	{
		page += '<tr><th scope="row" class="plaintablerowheader">'+getSeaPhrase("457B_EE","ESS")+'</th>'
		+ '<td class="plaintablecelldisplayright">'+FormatDecimalField(rtn.field["S457B-EE-DED-AMT"].value,2)+'</td></tr>'
		+ '<tr><th scope="row" class="plaintablerowheader">'+getSeaPhrase("457F","ESS")+'</th>'
		+ '<td class="plaintablecelldisplayright">'+FormatDecimalField(rtn.field["S457F-DED-AMT"].value,2)+'</td></tr>'
	}
	page += '<tr><th scope="row" id="otherDc" class="plaintablerowheader" title="'+getSeaPhrase("OTHER_DEFERRED_COMP_HELP","ESS")+'" nowrap>'+getSeaPhrase("OTHER_DEFERRED_COMP","ESS")+'<span class="offscreen">&nbsp;'+getSeaPhrase("OTHER_DEFERRED_COMP_HELP","ESS")+'</span></th>'
	+ '<td class="plaintablecelldisplayright">'+otherDcAmt+'</td></tr>'
	+ '<tr><th scope="row" class="plaintablerowheaderborder">'+getSeaPhrase("AFTER_TAX","ESS")+'</th>'
	+ '<td class="plaintablecellborderdisplayright" style="border-right:0px">'+((NonSpace(rtn.field["OTHER-DED-AMT"].value)>0)?FormatDecimalField(rtn.field["OTHER-DED-AMT"].value,2):'&nbsp;')+'</td></tr>'
	if (emssObjInstance.emssObj.rothPayModel)
	{
		page += '<tr><th scope="row" class="plaintablerowheader">'+getSeaPhrase("ROTH","ESS")+'</th>'
		+ '<td class="plaintablecelldisplayright">'+FormatDecimalField(rtn.field["ROTH-DED-AMT"].value,2)+'</td></tr>'
	}
	page += '</table>'
	self.RESULTS.document.getElementById("paneHeader").innerHTML = getSeaPhrase("RESULTS","ESS");
	self.RESULTS.document.getElementById("paneBody").innerHTML = page;
	self.RESULTS.stylePage();
	var msg = getSeaPhrase("CNT_UPD_FRM","SEA",[self.RESULTS.getWinTitle()]);
	if (firstTime)
	{
		self.RESULTS.setLayerSizes();
		try { parent.fitToScreen(); } catch(e) {}
	}
	else
		msg += ' '+getSeaPhrase("CNT_UPD_FRM","SEA",[self.CONTROLS.getWinTitle()]);
	stopProcessing(msg);
	self.document.getElementById("RESULTS").style.visibility = "visible";
	fitToScreen();
}

function ClearAllRequiredFields()
{
	var doc = self.CONTROLS.document;
	var frm = doc.forms[0];	
	clearRequiredField(frm.emp_pay_rate);
	clearRequiredField(frm.gross_pay);
	clearRequiredField(frm.net_pay_amt);
    if (Hourly)
		clearRequiredField(frm.hours);
	clearRequiredField(frm.emp_pay_rate);
	clearRequiredField(doc.getElementById("empPayFreq"));
	clearRequiredField(frm.emp_fd_exempts);
	clearRequiredField(frm.emp_fd_tax_perc);
	clearRequiredField(frm.emp_st_exempts);
	clearRequiredField(frm.emp_st_tax_perc);
	clearRequiredField(frm.exempt_amt_pct);
	clearRequiredField(frm.s125_amt_pct);
	clearRequiredField(frm.s401k_amt_pct);
	clearRequiredField(frm.s403b_amt_pct);
	clearRequiredField(frm.s457_amt_pct);
	if (b457bf)
	{	
		clearRequiredField(frm.s457b_ee_amt_pct);
		clearRequiredField(frm.s457f_amt_pct);
	}
	clearRequiredField(frm.other_amt_pct);
	if (emssObjInstance.emssObj.rothPayModel)
	{	
		clearRequiredField(frm.roth401k_amt_pct);
		clearRequiredField(frm.roth403b_amt_pct);
	}	
}

function ProcessForm(action)
{
	var doc = self.CONTROLS.document;
	var frm = doc.forms[0];	
	ClearAllRequiredFields();
	if (ValidNumber(frm.emp_pay_rate,11,4) == false)
	{
		setRequiredField(frm.emp_pay_rate, getSeaPhrase("INVALID_NO","ESS"));
		return;
	}
	if (ValidNumber(frm.gross_pay,11,2) == false)
	{
		setRequiredField(frm.gross_pay, getSeaPhrase("INVALID_NO","ESS"));
		return;
	}
	if (ValidNumber(frm.net_pay_amt,11,2) == false)
	{
		setRequiredField(frm.net_pay_amt, getSeaPhrase("INVALID_NO","ESS"));
		return;
	}
    if (Hourly)
    {
        if (ValidNumber(frm.hours,6,2) == false)
        {
            setRequiredField(frm.hours, getSeaPhrase("INVALID_NO","ESS"));
            return;
        }
    }
	if (NonSpace(frm.gross_pay.value) == 0 && NonSpace(frm.emp_pay_rate.value) == 0 && NonSpace(frm.net_pay_amt.value) == 0)
	{
		var errorMsg;
        if (Hourly)
        	errorMsg = getSeaPhrase("RATE_GROSS_NET_REQ","ESS");
        else
        	errorMsg = getSeaPhrase("SAL_GROSS_NET_REQ","ESS");
		setRequiredField(frm.emp_pay_rate, errorMsg);
		return;
	}
	if (frm.emp_pay_frequency.selectedIndex == 0)
	{
		setRequiredField(doc.getElementById("empPayFreq"), getSeaPhrase("SELECT_PAY_FREQUENCY","ESS"), frm.emp_pay_frequency);
		return;
	}
	if (ValidNumber(frm.emp_fd_exempts,4,0) == false)
	{
		setRequiredField(frm.emp_fd_exempts, getSeaPhrase("INVALID_NO","ESS"));
		return;
	}
	if (ValidNumber(frm.emp_fd_tax_perc,11,3) == false)
	{
		setRequiredField(frm.emp_fd_tax_perc, getSeaPhrase("INVALID_NO","ESS"));
		return;
	}
	if (ValidNumber(frm.emp_st_exempts,4,0) == false)
	{
		setRequiredField(frm.emp_st_exempts, getSeaPhrase("INVALID_NO","ESS"));
		return;
	}
	if (ValidNumber(frm.emp_st_tax_perc,11,3) == false)
	{
		setRequiredField(frm.emp_st_tax_perc, getSeaPhrase("INVALID_NO","ESS"));
		return;
	}
	if (ValidNumber(frm.exempt_amt_pct,11,2) == false)
	{
		setRequiredField(frm.exempt_amt_pct, getSeaPhrase("INVALID_NO","ESS"));
		return;
	}
	if (ValidNumber(frm.s125_amt_pct,11,2) == false)
	{
		setRequiredField(frm.s125_amt_pct, getSeaPhrase("INVALID_NO","ESS"));
		return;
	}
	if (ValidNumber(frm.s401k_amt_pct,11,2) == false)
	{
		setRequiredField(frm.s401k_amt_pct, getSeaPhrase("INVALID_NO","ESS"));
		return;
	}
	if (ValidNumber(frm.s403b_amt_pct,11,2) == false)
	{
		setRequiredField(frm.s403b_amt_pct, getSeaPhrase("INVALID_NO","ESS"));
		return;
	}
	if (ValidNumber(frm.s457_amt_pct,11,2) == false)
	{
		setRequiredField(frm.s457_amt_pct, getSeaPhrase("INVALID_NO","ESS"));
		return;
	}
	if (b457bf)
	{
		if (ValidNumber(frm.s457b_ee_amt_pct,11,2) == false)
		{
			setRequiredField(frm.s457b_ee_amt_pct, getSeaPhrase("INVALID_NO","ESS"));
			return;
		}
		if (ValidNumber(frm.s457f_amt_pct,11,2) == false)
		{
			setRequiredField(frm.s457f_amt_pct, getSeaPhrase("INVALID_NO","ESS"));
			return;
		}
	}		
	if (ValidNumber(frm.other_amt_pct,11,2) == false)
	{
		setRequiredField(frm.other_amt_pct, getSeaPhrase("INVALID_NO","ESS"));
		return;
	}
	if (emssObjInstance.emssObj.rothPayModel)
	{
		if (ValidNumber(frm.roth401k_amt_pct,11,2) == false)
		{
			setRequiredField(frm.roth401k_amt_pct, getSeaPhrase("INVALID_NO","ESS"));
			return;
		}
		if (ValidNumber(frm.roth403b_amt_pct,11,2) == false)
		{
			setRequiredField(frm.roth403b_amt_pct, getSeaPhrase("INVALID_NO","ESS"));
			return;
		}
	}
    newFreq = Number(frm.emp_pay_frequency.options[frm.emp_pay_frequency.selectedIndex].value)
    newSalary = frm.emp_pay_rate.value
    newGross = frm.gross_pay.value
    newNet = frm.net_pay_amt.value
    newHours = ""
    if (Hourly)
	    newHours = frm.hours.value
    if (newFreq != oldFreq)
    {
    	if (oldSalary == newSalary &&  oldGross == newGross &&  oldNet == newNet)
        {
        	frm.gross_pay.value = ""
        	frm.net_pay_amt.value = ""
    	}
	}
    if ((Hourly && newHours && newHours != oldHours) ||  (newSalary && newSalary != oldSalary))
    {
        frm.gross_pay.value = ""
        frm.net_pay_amt.value = ""
    }
    else if (newGross && newGross != oldGross)
    {
    	frm.emp_pay_rate.value = ""
    	frm.net_pay_amt.value = ""
	}
    else if (newNet && newNet != oldNet)
    {
    	frm.emp_pay_rate.value = ""
    	frm.gross_pay.value = ""
	}
    rtn = new Object();
    rtn.field = new Array();
	var object = new AGSObject(authUser.prodline,"PR89.1");
	object.event = "CHG";
	object.rtn = "DATA";
	object.longNames = true;
	object.tds = false;
	object.field = "FC=X"
	+ "&EMP-COMPANY=" + authUser.company
	+ "&EMP-EMPLOYEE=" + authUser.employee
	+ "&CHECK-DATE="+ ymdtoday
	+ "&HOURS=" + ((Hourly) ? ((NonSpace(frm.hours.value)>0) ? escape(frm.hours.value) : " ") : " ")
	+ "&GROSS-PAY=" + ((NonSpace(frm.gross_pay.value)>0) ? escape(frm.gross_pay.value) : " ")
	+ "&EMP-PAY-RATE=" + ((NonSpace(frm.emp_pay_rate.value)>0) ? escape(frm.emp_pay_rate.value) : " ")
	+ "&NET-PAY-AMT=" + ((NonSpace(frm.net_pay_amt.value)>0) ? escape(frm.net_pay_amt.value) : " ")
	+ "&EMP-PAY-FREQUENCY=" + ((newFreq) ? newFreq : " ")
	+ "&EMP-SALARY-CLASS=" + ((Hourly) ? "H" : "S")
	+ "&EMP-FD-EXEMPTS=" + ((frm.emp_fd_exempts.value) ? escape(frm.emp_fd_exempts.value) : " ")
	+ "&EMP-FD-MAR-STATUS=" + frm.emp_fd_mar_status.options[frm.emp_fd_mar_status.selectedIndex].value
	+ "&EMP-FD-TAX-PERC=" + ((frm.emp_fd_tax_perc.value) ? escape(frm.emp_fd_tax_perc.value) : " ")
	+ "&EMP-FD-EXMPT-ADDL=" + frm.emp_fd_exmpt_addl.options[frm.emp_fd_exmpt_addl.selectedIndex].value
	+ "&FED-TAX-FLAG=X"
	+ "&FICA-TAX-FLAG=X"
	+ "&MED-TAX-FLAG=X"
	+ "&OTHER-TAX-FLAG=X";
	if (emssObjInstance.emssObj.filterSelect)
	{
    	if (NonSpace(frm.emp_tax_state.value) > 0)
		{
			object.field += "&EMP-TAX-STATE=" + frm.emp_tax_state.value
			+ "&EMP-ST-EXEMPTS=" + ((frm.emp_st_exempts.value) ? escape(frm.emp_st_exempts.value) : " ")
			+ "&EMP-ST-MAR-STATUS=" + frm.emp_st_mar_status.options[frm.emp_st_mar_status.selectedIndex].value
			+ "&EMP-ST-TAX-PERC=" + ((frm.emp_st_tax_perc.value) ? escape(frm.emp_st_tax_perc.value) : " ")
			+ "&EMP-ST-EXMPT-ADDL=" + frm.emp_st_exmpt_addl.options[frm.emp_st_exmpt_addl.selectedIndex].value
			+ "&STA-TAX-FLAG=X";
		}
	}
	else
	{
    	if (frm.emp_tax_state.selectedIndex > 0)
		{
			object.field += "&EMP-TAX-STATE=" + frm.emp_tax_state.options[frm.emp_tax_state.selectedIndex].value
			+ "&EMP-ST-EXEMPTS=" + ((frm.emp_st_exempts.value) ? escape(frm.emp_st_exempts.value) : " ")
			+ "&EMP-ST-MAR-STATUS=" + frm.emp_st_mar_status.options[frm.emp_st_mar_status.selectedIndex].value
			+ "&EMP-ST-TAX-PERC=" + ((frm.emp_st_tax_perc.value) ? escape(frm.emp_st_tax_perc.value) : " ")
			+ "&EMP-ST-EXMPT-ADDL=" + frm.emp_st_exmpt_addl.options[frm.emp_st_exmpt_addl.selectedIndex].value
			+ "&STA-TAX-FLAG=X";
		}
	}
    if (frm.emp_tax_county.value != "")
    {	
        object.field += "&EMP-TAX-COUNTY=" + ((frm.emp_tax_county.value) ? escape(frm.emp_tax_county.value) : " ")
		+ "&CNTY-TAX-FLAG=X";
    }        
    if (frm.emp_tax_city.value != "")
    {	
        object.field += "&EMP-TAX-CITY=" + ((frm.emp_tax_city.value) ? escape(frm.emp_tax_city.value) : " ")
		+ "&CITY-TAX-FLAG=X";
    }        
    if (frm.emp_tax_school.value != "")
    {	
        object.field += "&EMP-TAX-SCHOOL=" + ((frm.emp_tax_school.value) ? escape(frm.emp_tax_school.value) : " ")
		+ "&SCHL-TAX-FLAG=X";
    }        
	if (frm.exempt_amt_pct.value != "")
	{
		object.field += "&EXEMPT-FLAG=" + frm.exempt_flag.options[frm.exempt_flag.selectedIndex].value
		object.field += "&EXEMPT-AMT-PCT=" + ((frm.exempt_amt_pct.value) ? escape(frm.exempt_amt_pct.value) : " ")
	}
	if (frm.s125_amt_pct.value != "")
	{
		object.field += "&S125-FLAG=" + frm.s125_flag.options[frm.s125_flag.selectedIndex].value
		object.field += "&S125-AMT-PCT=" + ((frm.s125_amt_pct.value) ? escape(frm.s125_amt_pct.value) : " ")
	}
	if (frm.s401k_amt_pct.value != "")
	{
		object.field += "&S401K-FLAG=" + frm.s401k_flag.options[frm.s401k_flag.selectedIndex].value
		object.field += "&S401K-AMT-PCT=" + ((frm.s401k_amt_pct.value) ? escape(frm.s401k_amt_pct.value) : " ")
	}
	if (frm.s403b_amt_pct.value != "")
	{
		object.field += "&S403B-FLAG=" + frm.s403b_flag.options[frm.s403b_flag.selectedIndex].value
		object.field += "&S403B-AMT-PCT=" + ((frm.s403b_amt_pct.value) ? escape(frm.s403b_amt_pct.value) : " ")
	}
	if (frm.s457_amt_pct.value != "")
	{
		object.field += "&S457-FLAG=" + frm.s457_flag.options[frm.s457_flag.selectedIndex].value
		object.field += "&S457-AMT-PCT=" + ((frm.s457_amt_pct.value) ? escape(frm.s457_amt_pct.value) : " ")
	}
	if (b457bf)
	{
		if (frm.s457b_ee_amt_pct.value != "")
		{
			object.field += "&S457B-EE-FLAG=" + frm.s457b_ee_flag.options[frm.s457b_ee_flag.selectedIndex].value
			object.field += "&S457B-EE-AMT-PCT=" + ((frm.s457b_ee_amt_pct.value) ? escape(frm.s457b_ee_amt_pct.value) : " ")
		}
		if (frm.s457f_amt_pct.value != "")
		{
			object.field += "&S457F-FLAG=" + frm.s457f_flag.options[frm.s457f_flag.selectedIndex].value
			object.field += "&S457F-AMT-PCT=" + ((frm.s457f_amt_pct.value) ? escape(frm.s457f_amt_pct.value) : " ")
		}		
	}
	if (frm.other_amt_pct.value != "")
	{
		object.field += "&OTHER-FLAG=" + frm.other_flag.options[frm.other_flag.selectedIndex].value
		object.field += "&OTHER-AMT-PCT=" + ((frm.other_amt_pct.value) ? escape(frm.other_amt_pct.value) : " ")
	}
	if (emssObjInstance.emssObj.rothPayModel)
	{
		if (frm.roth401k_amt_pct.value != "")
		{
			object.field += "&ROTH401K-FLAG=" + frm.roth401k_flag.options[frm.roth401k_flag.selectedIndex].value
			object.field += "&ROTH401K-AMT-PCT=" + ((frm.roth401k_amt_pct.value) ? escape(frm.roth401k_amt_pct.value) : " ")
		}
		if (frm.roth403b_amt_pct.value != "")
		{
			object.field += "&ROTH403B-FLAG=" + frm.roth403b_flag.options[frm.roth403b_flag.selectedIndex].value
			object.field += "&ROTH403B-AMT-PCT=" + ((frm.roth403b_amt_pct.value) ? escape(frm.roth403b_amt_pct.value) : " ")
		}
	}
	object.debug = false;
	object.out = "JS";
    object.func = "parent.agsDone(false)";
	var nextFunc = function(){AGS(object,"jsreturn");};
	startProcessing(getSeaPhrase("IN_CALCULATING","ESS"), nextFunc);
}

function ClearForm()
{
	var frm = self.CONTROLS.document.forms[0];
    frm.reset();
	if (emssObjInstance.emssObj.filterSelect)
	{
		self.CONTROLS.document.getElementById("stateDesc").innerHTML = "";
		self.CONTROLS.document.getElementById("countyDesc").innerHTML = "";
		self.CONTROLS.document.getElementById("cityDesc").innerHTML = "";
		self.CONTROLS.document.getElementById("schoolDesc").innerHTML = "";
	}
    ClearAllRequiredFields();
}

function FormatDecimalField(fldval,decimals)
{
	if (fldval.charAt(fldval.length - 1) == "+" || fldval.charAt(fldval.length - 1) == "-")
		fldval = fldval.substring(0,fldval.length - 1);
	var fmtval = "";
	var nonzero = false;
	for (var i=0; i<fldval.length; i++)
	{
		if (fldval.charAt(i) >= 0 && fldval.charAt(i) <= 9)
		{
			if (nonzero)
				fmtval += fldval.charAt(i);
			else if (fldval.charAt(i) != "0")
			{
				nonzero = true
				fmtval += fldval.charAt(i);
			}
		}
	}
	if (fmtval.length > 0)
	{
		if (decimals == 4)
		{
			if (fmtval.length == 1)
				fmtval = "000" + fmtval;
			if (fmtval.length == 2)
				fmtval = "00" + fmtval;
			if (fmtval.length == 3)
				fmtval = "0" + fmtval;
		}
		if (decimals == 3)
		{
			if (fmtval.length == 1)
				fmtval = "000" + fmtval;
			if (fmtval.length == 2)
				fmtval = "00" + fmtval;
		}
		if (decimals == 2)
		{
			if (fmtval.length == 1)
				fmtval = "000" + fmtval;
		}
	}
	if (fmtval.length > 0)
	{
		var x = fmtval.length - decimals;
		fmtval = fmtval.substring(0,x) + "." + fmtval.substring(x,fmtval.length);
	}
	return fmtval;
}

function SetSelectedIndex(obj,fldval)
{
    if (!fldval)
    {
    	obj.selectedIndex = 0;
        return;
    }
	for (var i=0; i<obj.options.length; i++)
	{
		if (obj.options[i].value == fldval)
			obj.selectedIndex = i;
	}
}

function InitMaritalStatus()
{
	MaritalStatusList = new Array("",
		getSeaPhrase("SINGLE","ESS"),
		getSeaPhrase("MARRIED","ESS"),
		getSeaPhrase("MARRIED_FILE_SEPARATE","ESS"),
		getSeaPhrase("MARRIED_BOTH_WORKING","ESS"),
		getSeaPhrase("MARRIED_ONE_WORKING","ESS"),
		getSeaPhrase("HOUSEHOLD_HEAD","ESS"),
		getSeaPhrase("MARRIED_EMPLOYERS","ESS"),
		getSeaPhrase("WINDOW_ER","ESS"),
		getSeaPhrase("MARRIED_NOT_WITH_SPOUSE","ESS"),
		getSeaPhrase("MARRIED_JOINT_ALL","ESS"),
		getSeaPhrase("MARRIED_JOINT_HALF","ESS"),
		getSeaPhrase("MARRIED_SEPARATE_ALL","ESS"),
		getSeaPhrase("MARRIED_JOINT_NONE","ESS"),
		getSeaPhrase("MARRIED_WITH_SPOUSE","ESS"),
		getSeaPhrase("MARRIED_SINGLE","ESS"),
		getSeaPhrase("CIVIL_UNION","ESS"),
		getSeaPhrase("CIVIL_UNION_SINGLE","ESS")
	);
}

function BuildMaritalSelect(type)
{
	var strBuffer = new Array();
	var len = MaritalStatusList.length;
	for (var i=0; i<len; i++)
		strBuffer[i] = '<option value="'+i+'">'+MaritalStatusList[i]+'</option>';
	return strBuffer.join("");
}

function BuildLocalSelect(type)
{
	var strBuffer = new Array();
	var len = locals.length;
	strBuffer[0] = '<option value="">';
	for (var i=0; i<len; i++)
	{
    	if (locals[i].tax_auth_type == type)
        	strBuffer[strBuffer.length] = '<option value="'+locals[i].tax_id_code+'">'+locals[i].description+'</option>';
	}
    return strBuffer.join("");
}

function BuildFrequencySelect()
{
	var strHtml = '<select class="inputbox" id="emp_pay_frequency" name="emp_pay_frequency">'
	+ '<option value="" selected></option>'
	+ '<option value="1">'+getSeaPhrase("WEEKLY","ESS")+'</option>'
	+ '<option value="2">'+getSeaPhrase("EVERY_2_WEEKS","ESS")+'</option>'
	+ '<option value="3">'+getSeaPhrase("TWICE_MONTH","ESS")+'</option>'
	+ '<option value="4">'+getSeaPhrase("MONTHLY","ESS")+'</option>'
	+ '<option value="5">'+getSeaPhrase("FOUR_WEEKLY","ESS")+'</option></select>';
	return strHtml;
}

function BuildAmntPrcntSelect(selectName)
{
	var strHtml = '<label class="offscreen" for="'+selectName+'">'+getSeaPhrase("CONT_TYPE","SEA")+'</label><select class="inputbox" id="'+selectName+'" name="'+selectName+'">'
	+ '<option value="A" selected>'+getSeaPhrase("AMOUNT","ESS")+'</option>'
	+ '<option value="P">'+getSeaPhrase("PERCENT","ESS")+'</option></select>';
	return strHtml;
}

/* Filter Select logic - start */
function performDmeFieldFilterOnLoad(dmeFilter)
{
	switch (dmeFilter.getFieldNm().toLowerCase())
	{
		case "state":
			dmeFilter.addFilterField("state", 2, getSeaPhrase("STATE_ONLY","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prstate",
				"psaset1",
				"state;description",
				"",
				null,
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;
		case "county":
			dmeFilter.addFilterField("tax-id-code", 10, getSeaPhrase("COUNTY_ONLY","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prtaxauth",
				"prxset2",
				"tax-id-code;description",
				"CN",
				null,
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;
		case "city":
			dmeFilter.addFilterField("tax-id-code", 10, getSeaPhrase("CITY","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prtaxauth",
				"prxset2",
				"tax-id-code;description",
				"CI",
				null,
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;
		case "school":
			dmeFilter.addFilterField("tax-id-code", 10, getSeaPhrase("HOME_ADDR_44","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prtaxauth",
				"prxset2",
				"tax-id-code;description",
				"SD",
				null,
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
		case "state":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prstate",
			"psaset1",
			"state;description",
			"",
			null,
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;
		case "county":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prtaxauth",
			"prxset2",
			"tax-id-code;description",
			"CN",
			null,
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;
		case "city":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prtaxauth",
			"prxset2",
			"tax-id-code;description",
			"CI",
			null,
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;
		case "school":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prtaxauth",
			"prxset2",
			"tax-id-code;description",
			"SD",
			null,
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;
		default: break;
	}
}

function dmeFieldRecordSelected(recIndex, fieldNm)
{
	var selRec = self.jsreturn.record[recIndex];
	var appForm = frm = self.CONTROLS.document.forms[0];
	var formElm;
	switch (fieldNm.toLowerCase())
	{
		case "state":
			formElm = appForm.emp_tax_state;
			formElm.value = selRec.state;
			try { self.CONTROLS.document.getElementById("stateDesc").innerHTML = selRec.description; } catch(e) {}
			break;
		case "county":
			formElm = appForm.emp_tax_county;
			formElm.value = selRec.tax_id_code;
			try { self.CONTROLS.document.getElementById("countyDesc").innerHTML = selRec.description; } catch(e) {}
			break;
		case "city":
			formElm = appForm.emp_tax_city;
			formElm.value = selRec.tax_id_code;
			try { self.CONTROLS.document.getElementById("cityDesc").innerHTML = selRec.description; } catch(e) {}
			break;
		case "school":
			formElm = appForm.emp_tax_school;
			formElm.value = selRec.tax_id_code;
			try { self.CONTROLS.document.getElementById("schoolDesc").innerHTML = selRec.description; } catch(e) {}
			break;
		default: break;
	}
	try { filterWin.close(); } catch(e) {}
	try { formElm.focus(); } catch(e) {}
}

function getDmeFieldElement(fieldNm)
{
	var fld = [null, null, null];
	try
	{
		var appForm = frm = self.CONTROLS.document.forms[0];
		switch (fieldNm.toLowerCase())
		{
			case "state":
				fld = [self.CONTROLS, appForm.emp_tax_state, getSeaPhrase("STATE_ONLY","ESS")];
				break;
			case "county":
				fld = [self.CONTROLS, appForm.emp_tax_county, getSeaPhrase("COUNTY_ONLY","ESS")];
				break;
			case "city":
				fld = [self.CONTROLS, appForm.emp_tax_city, getSeaPhrase("CITY","ESS")];
				break;
			case "school":
				fld = [self.CONTROLS, appForm.emp_tax_school, getSeaPhrase("HOME_ADDR_44","ESS")];
				break;
			default: break;
		}
	}
	catch(e) {}
	return fld;
}

function dmeFieldKeyUpHandler(fieldNm)
{
	var appForm = frm = self.CONTROLS.document.forms[0];
	var formElm;	
	switch (fieldNm.toLowerCase())
	{
		case "state":
			try { self.CONTROLS.document.getElementById("stateDesc").innerHTML = ""; } catch(e) {}
			break;
		case "county":
			try { self.CONTROLS.document.getElementById("countyDesc").innerHTML = ""; } catch(e) {}
			break;
		case "city":
			try { self.CONTROLS.document.getElementById("cityDesc").innerHTML = ""; } catch(e) {}
			break;
		case "school":
			try { self.CONTROLS.document.getElementById("schoolDesc").innerHTML = ""; } catch(e) {}
			break;
		default: break;
	}	
}

function drawDmeFieldFilterContent(dmeFilter)
{
	var selectHtml = new Array();
	var dmeRecs = self.jsreturn.record;
	var nbrDmeRecs = dmeRecs.length;
	var fieldNm = dmeFilter.getFieldNm().toLowerCase();
	var fldObj = getDmeFieldElement(fieldNm);
	var fldDesc = fldObj[2];	
	switch (fieldNm)
	{
		case "state":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("STATE_ONLY","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++)
			{
				tmpObj = dmeRecs[i];
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.state) ? tmpObj.state : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0)
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "county":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("COUNTY_ONLY","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++)
			{
				tmpObj = dmeRecs[i];
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.tax_id_code) ? tmpObj.tax_id_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0)
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "city":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("CITY","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++)
			{
				tmpObj = dmeRecs[i];
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.tax_id_code) ? tmpObj.tax_id_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0)
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "school":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("HOME_ADDR_44","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++)
			{
				tmpObj = dmeRecs[i];
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.tax_id_code) ? tmpObj.tax_id_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0)
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		default: break;
	}
	dmeFilter.getRecordElement().innerHTML = selectHtml.join("");
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
	var controlsFrame = document.getElementById("CONTROLS");
	var resultsFrame = document.getElementById("RESULTS");
	var winObj = getWinSize();
	var winWidth = winObj[0];	
	var winHeight = winObj[1];
	var contentLeftWidth;
	var contentLeftWidthBorder;
	var contentRightWidth;
	var contentRightWidthBorder;
	var contentHeightBorder;
	var contentHeight;
	if (window.styler && window.styler.showInfor)
	{			
		contentLeftWidth = parseInt(winWidth*.60,10) - 10;
		contentLeftWidthBorder = (navigator.appName.indexOf("Microsoft") >= 0) ? contentLeftWidth + 5 : contentLeftWidth + 2;
		contentRightWidth = parseInt(winWidth*.40,10) - 10;
		contentRightWidthBorder = (navigator.appName.indexOf("Microsoft") >= 0) ? contentRightWidth + 5 : contentRightWidth + 2;			
		contentHeight = winHeight - 65;
		contentHeightBorder = contentHeight + 30;		
	}
	else if (window.styler && (window.styler.showLDS || window.styler.showInfor3))
	{	
		contentLeftWidth = parseInt(winWidth*.60,10) - 20;
		contentLeftWidthBorder = (window.styler.showInfor3) ? contentLeftWidth + 7 : contentLeftWidth + 17;
		contentRightWidth = parseInt(winWidth*.40,10) - 20;
		contentRightWidthBorder = (window.styler.showInfor3) ? contentRightWidth + 7 : contentRightWidth + 17;		
		contentHeight = winHeight - 75;	
		contentHeightBorder = contentHeight + 30;	
	}
	else
	{
		contentLeftWidth = parseInt(winWidth*.60,10) - 10;
		contentLeftWidthBorder = contentLeftWidth;
		contentRightWidth = parseInt(winWidth*.40,10) - 10;
		contentRightWidthBorder = contentRightWidth;		
		contentHeight = winHeight - 60;
		contentHeightBorder = contentHeight + 24;			
	}
	controlsFrame.style.width = parseInt(winWidth*.60,10) + "px";
	controlsFrame.style.height = winHeight + "px";
	try
	{
		if (self.CONTROLS.onresize && self.CONTROLS.onresize.toString().indexOf("setLayerSizes") >= 0)
			self.CONTROLS.onresize = null;		
	}
	catch(e) {}
	try
	{
		self.CONTROLS.document.getElementById("paneBorder").style.width = contentLeftWidthBorder + "px";
		self.CONTROLS.document.getElementById("paneBodyBorder").style.width = contentLeftWidth + "px";
		self.CONTROLS.document.getElementById("paneBorder").style.height = contentHeightBorder + "px";
		self.CONTROLS.document.getElementById("paneBodyBorder").style.height = contentHeight + "px";
		self.CONTROLS.document.getElementById("paneBody").style.width = contentLeftWidth + "px";
		self.CONTROLS.document.getElementById("paneBody").style.height = contentHeight + "px";
	}
	catch(e) {}	
	resultsFrame.style.width = parseInt(winWidth*.40,10) + "px";
	resultsFrame.style.height = winHeight + "px";	
	try
	{
		if (self.RESULTS.onresize && self.RESULTS.onresize.toString().indexOf("setLayerSizes") >= 0)
			self.RESULTS.onresize = null;		
	}
	catch(e) {}
	try
	{
		self.RESULTS.document.getElementById("paneBorder").style.width = contentRightWidthBorder + "px";
		self.RESULTS.document.getElementById("paneBodyBorder").style.width = contentRightWidth + "px";
		self.RESULTS.document.getElementById("paneBorder").style.height = contentHeightBorder + "px";
		self.RESULTS.document.getElementById("paneBodyBorder").style.height = contentHeight + "px";
		self.RESULTS.document.getElementById("paneBody").style.width = contentRightWidth + "px";
		self.RESULTS.document.getElementById("paneBody").style.height = contentHeight + "px";
	}
	catch(e) {}
	if (window.styler && window.styler.textDir == "rtl")
	{
		controlsFrame.style.left = "";
		controlsFrame.style.right = "0px";	
		resultsFrame.style.left = "0px";
	}
	else
		resultsFrame.style.left = parseInt(winWidth*.60,10) + "px";
}
/* Filter Select logic - end */
</script>
</head>
<body style="overflow:hidden" onload="GetWebuser()" onresize="fitToScreen()">
	<iframe id="CONTROLS" name="CONTROLS" title="Main Content" level="2" tabindex="0" style="visibility:hidden;position:absolute;top:0px;left:0px;width:513px;height:464px" marginwidth="0" marginheight="0" frameborder="no" scrolling="no" src="/lawson/xhrnet/ui/headerpane.htm"></iframe>
	<iframe id="RESULTS" name="RESULTS" title="Secondary Content" level="3" tabindex="0" style="visibility:hidden;position:absolute;top:0px;left:513px;width:290px;height:464px" marginwidth="0" marginheight="0" frameborder="no" scrolling="no" src="/lawson/xhrnet/ui/headerpane.htm"></iframe>
	<iframe name="jsreturn" title="Empty" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/dot.htm"></iframe>
	<iframe name="lawheader" title="Empty" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/pmlawheader.htm"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@10.00.05.00.12 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/paymodel.htm,v 1.17.2.74 2014/02/25 22:49:12 brentd Exp $ -->
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

