<!-- St Luke's changes
// JRZ 9/22/08 Changing background color on W4 withholding list screen to white
// JRZ 9/22/08 Removing Continue and Model from W4 to make inquire only
// JRZ 9/22/08 Added read-only note to W4
// JRZ 9/22/08 Removing SSN from W4
// JRZ 9/22/08 Changed background color of W4 state withholding screen to white
// JRZ 9/22/08 Added read-only note at top of W-4 state withholding page
// JRZ 9/22/08 Removed Update button from W4 State Withholding screen
// CGL 2/25/10 Added Tax Exempt Flag and Replacement Withholding Amount to display
// EEP 12/29/11 Changing W4 form link to not be year specific
-->
<html>
<head>
<title>Tax Withholding</title>
<meta name="viewport" content="width=device-width" />
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/webappjs/common.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/webappjs/transaction.js"></script>
<script src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/waitalert.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script src="/lawson/webappjs/javascript/objects/ActivityDialog.js"></script>
<script src="/lawson/webappjs/javascript/objects/OpaqueCover.js"></script>
<script src="/lawson/webappjs/javascript/objects/Dialog.js"></script>
<script>
var privacyWin;
var DedMastr, thisform, num
var MaritalStatusList
var year = thisYear
var fromTask = (window.location.search)?unescape(window.location.search):"";
var parentTask = "";
var appObj;
var tmpLn;
var tmpObj;
var tmpAppObj;
var sortProperty;

if (fromTask)
{
	parentTask = getVarFromString("from",fromTask);
}

function GetWebuser()
{
	authenticate("frameNm='jsreturn'|funcNm='GetSystemDate()'|desiredEdit='EM'")
}

function GetSystemDate()
{
	stylePage();
	if (parentTask != "adoption" && parentTask != "birth") {
		if (fromTask) {
			parent.showWaitAlert(getSeaPhrase("WAIT","ESS"));
		}
	}
	document.title = getSeaPhrase("LIFE_EVENTS_2","ESS");
	StoreDateRoutines()
	InitMaritalSelect()
	GetAppVersion()
}

function GetAppVersion()
{
	if (!appObj)
		appObj = new AppVersionObject(authUser.prodline, "HR");

	// if you call getAppVersion() right away and the IOS object isn't set up yet,
	// then the code will be trying to load the sso.js file, and your call for
	// the appversion will complete before the ios version is set
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
       		setTimeout("GetAppVersion()", 10);
       		return;
	}
	
	GetEmdedmastr()
}

function GetEmdedmastr()
{
	var pDMEObj 	= new DMEObject(authUser.prodline, "EMDEDMASTR");
	pDMEObj.out 	= "JAVASCRIPT";
	pDMEObj.index 	= "EDMSET3";
	pDMEObj.key 	= parseInt(authUser.company,10) +"="+ parseInt(authUser.employee,10)+"=0=";
	pDMEObj.cond 	= "tax-cat-one";
	pDMEObj.max 	= "600";
	pDMEObj.func 	= "FinishEMDEDMASTR()";

	pDMEObj.field = "ded-code;effect-date;end-date;res-code;res-code,xlt;marital-status;"
		+ "marital-status,xlt;exemptions;addl-amount;deduction-code.description;"
		+ "deduction-code.tax-auth-type;addl-tax-code;addl-rate;employee.label_name_1;"
		+ "employee.fica-nbr;employee.addr1;employee.city;employee.state;employee.zip;"
		+ "employee.work-country;employee.work-state;ded-priority;tax-exempt-flg;addl-exempts"
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "9.0.0")
	{
		pDMEObj.field += ";dflt-tca-flag"
	}
	DME(pDMEObj, "jsreturn");
}

function FinishEMDEDMASTR()
{
	DedMastr = new Array(0);
	for(var i=0;i<self.jsreturn.NbrRecs;i++)
	{
		var pObj = self.jsreturn.record[i];

		if (pObj.res_code_xlt == "")
		{
			if (pObj.res_code == "4")
				pObj.res_code_xlt = getSeaPhrase("RESIDENTIAL_CODE_DESCRIPTION_4", "ESS")
			else if (pObj.res_code == "5")
				pObj.res_code_xlt = getSeaPhrase("RESIDENTIAL_CODE_DESCRIPTION_5", "ESS")
			else if (pObj.res_code == "6")
				pObj.res_code_xlt = getSeaPhrase("RESIDENTIAL_CODE_DESCRIPTION_6", "ESS")
		}
		
		if (!appObj || appObj.getAppVersion() == null || appObj.getAppVersion().toString() < "9.0.0") 
			pObj.dflt_tca_flag = null; 

		DedMastr[i] = new DedMastrObject(pObj.ded_code, pObj.effect_date,pObj.end_date, pObj.res_code,
			pObj.res_code_xlt, pObj.marital_status, pObj.marital_status_xlt, pObj.exemptions,
			pObj.addl_amount, pObj.deduction_code_description, pObj.deduction_code_tax_auth_type,
			pObj.addl_tax_code, pObj.addl_rate, pObj.employee_label_name_1, pObj.employee_fica_nbr,
			pObj.employee_addr1, pObj.employee_city, pObj.employee_state, pObj.employee_zip,
			pObj.employee_work_country, pObj.employee_work_state, pObj.ded_priority, pObj.tax_exempt_flg,
			pObj.addl_exempts, pObj.dflt_tca_flag);
	}

	if(DedMastr.length > 0 && DedMastr[0].EmployeeWorkCountry != "US")
	{
		MsgBox(getSeaPhrase("NOT_AVAILABLE_LOCATION","ESS"));
		return;
	}

	DspEmdedmastr();
}

function DspEmdedmastr(onsort, property)
{
	var LocalTaxes = false;

// MOD OF MOD
    // JRZ 9/22/08 Changing background color on W4 withholding list screen to white
//	var html = '<table style="width:100%"><tr><th><b><font color="red">NO CHANGES CAN BE MADE TO W4.  VIEWING IS READ-ONLY.</font></b></th></tr></table>'
// MOD BY BILAL 
	var html = '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
		+ '<tr><td style="text-align:center"><font color="red"><b>W4 is READ ONLY. NO CHANGES can be made here.<br> Please fill out any changes '
		+ ' using paper W4 form and send to payroll</b>'
        + ' <br><a target="blank" href="/lawson/xhrnet/payroll-Forms/W-4.pdf">Click here for W4 FORM</a></font><hr></td></tr>'
		+ '</table>'
// END OF MOD 

    //~JRZ
//	var html = '<table id="emdedmastrTbl" class="plaintableborder" style="width:100%" cellpadding="0" cellspacing="0" styler="list">'
	html += '<table id="emdedmastrTbl" class="plaintableborder" style="width:100%" cellpadding="0" cellspacing="0" styler="list">'
// END OF MOD
	html += '<tr style="text-align:center">'
	html += '<th class="plaintableheaderborder" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" target=HIDDEN href="" onclick="parent.SortEmdedmastr(\'DeductionCodeDescription\');return false;"'
	html += ' onmouseover="window.status=\''+getSeaPhrase("JOB_OPENINGS_1","ESS").replace(/\'/g,"\\'")+'\';return true"'
	html += ' onmouseout="window.status=\' \';return true"'
	html += '>'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</a>'
	html += '</th>'
	html += '<th class="plaintableheaderborder" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" target=HIDDEN href="" onclick="parent.SortEmdedmastr(\'ResCodeDescription\');return false;"'
	html += ' onmouseover="window.status=\''+getSeaPhrase("SORT_BY_RES_STATUS","ESS").replace(/\'/g,"\\'")+'\';return true"'
	html += ' onmouseout="window.status=\' \';return true"'
	html += '>'+getSeaPhrase("RESIDENT_STATUS","ESS")+'</a>'
	html += '</th>'
	html += '<th class="plaintableheaderborder" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" target=HIDDEN href="" onclick="parent.SortEmdedmastr(\'MaritalStatusDescription\');return false;"'
	html += ' onmouseover="window.status=\''+getSeaPhrase("SORT_BY_MAR_STATUS","ESS").replace(/\'/g,"\\'")+'\';return true"'
	html += ' onmouseout="window.status=\' \';return true"'
	html += '>'+getSeaPhrase("MARITAL_STATUS","ESS")+'</a>'
	html += '</th>'
	html += '<th class="plaintableheaderborder" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" target=HIDDEN href="" onclick="parent.SortEmdedmastr(\'Exemptions\');return false;"'
	html += ' onmouseover="window.status=\''+getSeaPhrase("SORT_BY_EXEMPTIONS","ESS").replace(/\'/g,"\\'")+'\';return true"'
	html += ' onmouseout="window.status=\' \';return true"'
	html += '>'+getSeaPhrase("EXEMPTIONS","ESS")+'</a>'
	html += '</th>'
	html += '<th class="plaintableheaderborder" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" target=HIDDEN href="" onclick="parent.SortEmdedmastr(\'AddlExempts\');return false;"'
	html += ' onmouseover="window.status=\''+getSeaPhrase("SORT_BY_ADDL_EXEMPTS","ESS").replace(/\'/g,"\\'")+'\';return true"'
	html += ' onmouseout="window.status=\' \';return true"'
	html += '>'+getSeaPhrase("ADDL_EXEMPTS","ESS")+'</a>'
	html += '</th>'	
	html += '<th class="plaintableheaderborder" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" target=HIDDEN href="" onclick="parent.SortEmdedmastr(\'AddlAmount\');return false;"'
	html += ' onmouseover="window.status=\''+getSeaPhrase("SORT_BY_ADDL_AMT","ESS").replace(/\'/g,"\\'")+'\';return true"'
	html += ' onmouseout="window.status=\' \';return true"'
	html += '>'+getSeaPhrase("W4_6","ESS")+'</a>'
	html += '</th>'
	// CGL 2/25/10 Add Tax Exempt Flag to display
// MOD BY BILAL
	html += '<th class="plaintableheaderborder" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" target=HIDDEN href="" onclick="parent.SortEmdedmastr(\'AddlAmount\');return false;"'
	html += ' onmouseover="window.status=\''+'Replacement Amount'+'\';return true"'
	html += ' onmouseout="window.status=\' \';return true"'
	html += '>'+'Replacement Amount'+'</a>'
// END OF MOD
	html += '</th>'
	html += '<th class="plaintableheaderborder" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" target=HIDDEN href="" onclick="parent.SortEmdedmastr(\'TaxExemptFlag\');return false;"'
	html += ' onmouseover="window.status=\''+'Sort by Tax Exempt Flag'+'\';return true"'
	html += ' onmouseout="window.status=\' \';return true"'
	html += '>Tax Exempt</a>'
	html += '</th>'
	html += '</tr>'

	for (var i=0; i<DedMastr.length; i++) {
		if (IsCurrent(DedMastr[i].EffectDate, DedMastr[i].EndDate) == true) {
			var TaxAuthType = DedMastr[i].DeductionCodeTaxAuthType;
			var ReadOnly = false;
			// PT 121591: only show local taxes as read-only
// MOD BY BILAL - Prior customization
			//if (TaxAuthType == "FD" || TaxAuthType == "ST")
			//	var ReadOnly = false;
			if (TaxAuthType == "FD" || TaxAuthType == "ST")
				var ReadOnly = true;
// END OF MOD
			if(TaxAuthType == "CI" || TaxAuthType == "CN" || TaxAuthType == "SD" || TaxAuthType == "TD") {
				ReadOnly = true;
				LocalTaxes = true;
			}

			if (!ReadOnly) {
				html += '<tr>'
				html += '<td class="plaintablecellborder"><a href=javascript:parent.'
				html += (DedMastr[i].DeductionCodeTaxAuthType == "FD") ? 'UpdateFedEmdedmastr(' : 'UpdateEmdedmastr('
				html += i + ')'
				html += ' onmouseover="window.status=\''+getSeaPhrase("CHG_W4_INFO","ESS").replace(/\'/g,"\\'")+'\';return true"'
				html += ' onmouseout="window.status=\' \';return true">'
				html += DedMastr[i].DeductionCodeDescription + '</a></td>'
			} else {
				// PT 121591: only show local taxes as read-only with mouseover text
				html += '<tr id="localtax'+i+'" title="'+ getSeaPhrase("LOCAL_TAX_HELP_TEXT","ESS") +'"/>'
				html += '<td class="plaintablecellborder">' + DedMastr[i].DeductionCodeDescription + '</td>'
			}
			html += '<td class="plaintablecellborder" nowrap>' + DedMastr[i].ResCodeDescription + '</td>'
			html += '<td class="plaintablecellborder" nowrap>' + DedMastr[i].MaritalStatusDescription + '</td>'
			html += '<td class="plaintablecellborder" align=center>' + DedMastr[i].Exemptions + '</td>'
			html += '<td class="plaintablecellborder" align=center>' + DedMastr[i].AddlExempts + '</td>'
			html += '<td class="plaintablecellborder" align=center>'
			if (DedMastr[i].AddlTaxCode.indexOf("2") == 1) {
				html += ((DedMastr[i].AddlAmount != 0) ? ('$ ' + DedMastr[i].AddlAmount) : '&nbsp;')
			}
			else {
				html += '&nbsp;'
			}
			html += '</td>'
			// MOD BY BILAL  - Adding Replacement amount and Tax Exemption Flag
			html += '<td class="plaintablecellborder" align=center>'
			if (DedMastr[i].AddlTaxCode.indexOf("1") == 1) {
				html += ((DedMastr[i].AddlAmount != 0) ? ('$ ' + DedMastr[i].AddlAmount) : '&nbsp;')
			}
			else {
				html += '&nbsp;'
			}
			html += '</td>'
			html += '<td class="plaintablecellborder" align=center>' + DedMastr[i].TaxExemptFlag + '&nbsp' + '</td>'
			// END OF MOD
			html += '</tr>'
		}
	}
	html += '</table>'

	if (fromTask != "" && parentTask != "" && parentTask != "main") {
		html += '<p align="center">'
		html += uiButton(getSeaPhrase("BACK","ESS"),"parent.CloseW4();return false")
		html += '</p>'
	}

	self.MAIN.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DEDUCTIONS","ESS");
	self.MAIN.document.getElementById("paneBody").innerHTML = html;

	self.MAIN.stylePage();
	if (onsort) {
		self.MAIN.styleSortArrow("emdedmastrTbl", property);
	}
	else
	{
		self.MAIN.setLayerSizes(true);
	}

	self.document.getElementById("MAIN").style.visibility = "visible";
	self.document.getElementById("W4FORM").style.visibility = "hidden";
	self.document.getElementById("STATE").style.visibility = "hidden";
	// if this task has been launched as a related link, remove any processing message
	if (fromTask && typeof(parent.parent.removeWaitAlert) == "function")
		parent.parent.removeWaitAlert();
	if (fromTask && typeof(parent.removeWaitAlert) == "function")
		parent.removeWaitAlert();
	fitToScreen();	
}

function CloseW4()
{
	try {
		parent.document.getElementById("fullrelatedtask").style.visibility = "hidden";
	}
	catch(e) {}
	try {
		parent.document.getElementById("relatedtask").style.visibility = "hidden";
	}
	catch(e) {}
	try {
		parent.document.getElementById("right").style.visibility = "hidden";
	}
	catch(e) {}
	try {
		parent.document.getElementById("left").style.visibility = "visible";
	}
	catch(e) {}

	// display the checkmark indicating that this task has been accessed.
	try {
		parent.left.setImageVisibility("w4form_checkmark","visible");
	}
	catch(e) {}
}

function MaskSocialNbr(socialNbr)
{
	return socialNbr.substring(socialNbr.length-4,socialNbr.length);
}

function UpdateFedEmdedmastr(n)
{
	if (fromTask)
	{
		parent.showWaitAlert("PROCESSING_WAIT", "ESS");
	}

	var IRSLockIn = (DedMastr[n].DfltTcaFlag != null && parseInt(DedMastr[n].DfltTcaFlag,10) == 9) ? true : false;
	// hide "Model" button if user is denied access to Payment Modeling bookmark
	var PayModel = true;
	
	// check Payment Modeling bookmark access
	if (PayModel)
	{
		try
		{
			if ((authUser && !authUser.OfficeObject) && profileHandler)
			{
				profileHandler.createOfficeObjects();
				authUser.OfficeObject = profileHandler.authUser.OfficeObject;
			}
			
			// deny access unless the bookmark is found		
			if (authUser && authUser.OfficeObject)
			{
				PayModel = false;
				var Bookmarks = authUser.OfficeObject;
			
				for (var i=0; i<authUser.NbrOfOfficeObj; i++)
				{
					var bkName = Bookmarks[i].name.toUpperCase(); // the Lawson-assigned task name
					var bkLawName = (Bookmarks[i].lawnm) ? Bookmarks[i].lawnm.toUpperCase() : "";	// the Lawson-assigned Lawson name
			
					if ((bkLawName != "" && bkLawName == "XMLHRPAYMENTMODELING")
					|| bkName == "PAYMENT MODELING")
					{
						PayModel = true;
						break;
					}
				}
			}
		} catch(e) {}
	}

	var amt = ""
	if (DedMastr[n].AddlTaxCode.indexOf("2") == 1)
		amt = roundToDecimal(DedMastr[n].AddlAmount,2);
	if (NonSpace(amt) && String(amt).indexOf(".") == -1)
		amt += ".00";

	allowDots = '. . . . . . . . . . . . . . . . .  . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . '
    addlDots = '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . '
	pallowDots = allowDots + '. . . . . . . . . . '
	paddlDots = addlDots + '. . . . . . . . . . '
	buttonRow = '<table border="0" cellpadding="0" cellspacing="0"><tr><td class="plaintablecell">'
// MOD BY BILAL  - Hiding buttons to make the form Read only
//	if (!IRSLockIn)
//	{	
//		buttonRow += uiButton(getSeaPhrase("CONTINUE","ESS"),"parent.VerifyUpdate(this.form," + n + ");return false")
//		if (PayModel)
//			buttonRow += uiButton(getSeaPhrase("MODEL","ESS"),"parent.DisplayModel(this.form);return false")
//	}
// END OF MOD
	buttonRow += uiButton(getSeaPhrase("BACK","ESS"),"parent.GetEmdedmastr();return false")
		+ uiButton(getSeaPhrase("PRINT","ESS"),"parent.VerifyPrint();return false")
		+ '</td><td style="padding-left:15px">'
		+ '<a href="" onClick="window.open(\'http://www.irs.gov/pub/irs-pdf/fw4.pdf\');return false;">'
		+ getSeaPhrase("W4_INSTRUCTIONS","ESS")
		+ '</a></td></tr>'
		+ '</table>'

	var edmform = '<form name="w4form" onSubmit="return false">'
// MOD BY BILAL 
		+ '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
		+ '<div>'
		+ '<tr><td style="text-align:center"><font color="red"><b>W4 is READ ONLY. NO CHANGES can be made here.<br> Please fill out any changes '
		+ ' using paper W4 form and send to payroll</b>'
        + ' <br><a target="blank" href="/lawson/xhrnet/payroll-Forms/W-4.2011.pdf">Click here for W4 FORM</a></font><hr></td></tr>'
		+ '</table>'
// END OF MOD 
		+ '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
		+ '<div><tr><td class="plaintablecellborder2" nowrap><span class="fieldlabelgovt1">'
		+ 'Form </span><span class="fieldlabelgovt5">W-4</span><br><span class="fieldlabelgovt1">Department of the Treasury</span><br>'
		+ '<span class="fieldlabelgovt1">Internal Revenue Service</span></td>'
		+ '<td  class="plaintablecellborder2" align="center" valign="top" nowrap><span class="fieldlabelgovt4">Employee\'s Withholding Allowance Certificate'
		+ '</span><br></br><span class="fieldlabelgovtbold">For </span>'
		+ '<a href="" onclick="parent.PrivacyLink();return false;"><span class=""fieldlabelgovt">'
		+ 'Privacy Act and Paperwork Reduction Act Notice,</span></a><span class="fieldlabelgovtbold"> see page 2 of paper form.</span></td>'
		+ '<td  class="plaintablecellborder2" align="center" valign="top" nowrap><span class="fieldlabelgovt1">OMB No. 1545-0010</span><br><span class="fieldlabelgovt6">'
		+ year + '</span></td></tr></div></table>'

		+ '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%">'
		+ '<div><tr><td class="plaintablecellborder2" nowrap><span class="fieldlabelgovt1bold">1</span><span class="fieldlabelgovt1"> Type or print your first name, middle initial and last name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
		+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'
		+ '<br><br><span class="fieldlabelgovt1bold">' + DedMastr[n].EmployeeLabelName1 + '</span>'
// JRZ 9/22/08 Removing SSN from W4
//		+ '<td class="plaintablecellborder2" nowrap><span class="fieldlabelgovt1bold">2</span><span class="fieldlabelgovt1"> Your social security number<br><br></span><span class="fieldlabelgovt1bold">' + MaskSocialNbr(DedMastr[n].EmployeeFicaNbr) + '</span>'
		+ '<td class="plaintablecellborder2" nowrap><span class="fieldlabelgovt1bold">2</span><span class="fieldlabelgovt1"> Your social security number<br><br></span><span class="fieldlabelgovt1bold">xxx-xx-xxxx</span>'
	// END OF MOD
		+ '</td></tr></div></table>'

		+ '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%">'
		+ '<div><tr><td class="plaintablecellborder2" align=left nowrap><span class="fieldlabelgovt1">Home address (number and street or rural route)<br><br></span>'
		+ '<span class="fieldlabelgovt1bold">'
		+ DedMastr[n].EmployeeAddr1 + '</span></td>'
		+ '<td class="plaintablecellborder2"><span class="fieldlabelgovt1bold">3 </span><span class="fieldlabelgovt1" id="marstatus"><input class="inputbox" type=radio name=maritalstatus value="1" onClick="javascript:parent.setMaritalStatus(this.form,0)"'
	if (parseFloat(DedMastr[n].MaritalStatus) == 1)
		edmform += ' checked'
	if (IRSLockIn)
		edmform += ' disabled'	
	//PT 159284 and PT 164236
	edmform += '>Single &nbsp;<input class="inputbox" type=radio name=maritalstatus value="2" onClick="javascript:parent.setMaritalStatus(this.form,1)"'
	if (parseFloat(DedMastr[n].MaritalStatus) == 2)
		edmform += ' checked'
	if (IRSLockIn)
		edmform += ' disabled'
	edmform += '>Married &nbsp;<input class="inputbox" type=radio name=maritalstatus value="15" onClick="javascript:parent.setMaritalStatus(this.form,2)"'
	if (parseFloat(DedMastr[n].MaritalStatus) == 15)
		edmform += ' checked'
	if (IRSLockIn)
		edmform += ' disabled'
	edmform += '>Married, but withhold at higher Single rate <br></span><span class="fieldlabelgovt1bold">Note:</span><span class="fieldlabelgovt1italic"> If married, but legally '
		+ 'separated, or spouse is a nonresident alien, check the Single box.</span></td></tr>'
		+ '<tr><td class="plaintablecellborder2" nowrap><span class="fieldlabelgovt1">City or town, state, and ZIP code</span><br><br>'
		+ '<span class="fieldlabelgovt1bold">' + DedMastr[n].EmployeeCity + ', ' + DedMastr[n].EmployeeState + '  ' + DedMastr[n].EmployeeZip + '</span></td>'
		+ '<td class="plaintablecellborder2" nowrap><span class="fieldlabelgovt1bold">4</span><span class="fieldlabelgovt1"> If your last name differs from that on your social security '
		+ 'card,<br>&nbsp;&nbsp;&nbsp;call 1-800-772-1213 for a new card.</span></td></tr>'
	if (IRSLockIn)
		edmform += '<tr><td class="plaintablecellborder2" nowrap colspan=2><span class="fieldlabelgovtboldred"><br>You are unable to change your withholdings due to an IRS Letter on file.  Contact your Payroll department.<br><br></span></td></tr>'
	edmform += '<tr><td class="plaintablecellborder2" nowrap colspan=2><span class="fieldlabelgovt1bold">5</span><span class="fieldlabelgovt1"> '
		+ 'Total number of allowances you are claiming'
	edmprint = edmform + pallowDots
	edmform	+= allowDots

	edmnext = '</span><span class="fieldlabelgovt1bold">5</span>&nbsp;<select name=exemptions onchange="javascript:parent.setValue(this.form)"'
	if (IRSLockIn)
		edmnext += ' disabled'	
	edmnext += '><span class="fieldlabelgovt1bold">' + BuildExemptionsSelect(DedMastr[n].Exemptions) + '</select>'
	edmprint += edmnext
	edmform	+= edmnext

	edmnext = '</span></td></tr><tr><td class="plaintablecellborder2" nowrap colspan=2><span class="fieldlabelgovt1bold">6</span><span class="fieldlabelgovt1"> '
		+ '<label for="addlamount"> Additional amount, if any, you want withheld from each paycheck </label>'
	edmform += edmnext + addlDots
	edmprint += edmnext + paddlDots

	edmnext	= '</span><span class="fieldlabelgovt1bold">6</span>&nbsp;'
		+ '<input class="inputbox" id=addlamount type=text name=addlamount size=10 maxlength=10'
		+ ' value="' + amt + '" onfocus="this.select()" onchange="javascript:parent.ValidateFedNumber(this,9,2)"'
	if (IRSLockIn)
		edmnext += ' disabled'		
	edmnext += '></span></td></tr>'
		+ '<tr><td class="plaintablecellborder2" nowrap colspan=2><span class="fieldlabelgovt1bold">7</span><span class="fieldlabelgovt1"> I claim exemption from withholding for '
		+ year + ', and I certify that I meet </span><span class="fieldlabelgovt1bold">BOTH</span><span class="fieldlabelgovt1"> of the following conditions for exemption:'
		+ '<ul><li>Last year I had a right to a refund of <span class="fieldlabelgovt1bold">ALL</span><span class="fieldlabelgovt1"> Federal income tax '
		+ 'withheld because I had </span><span class="fieldlabelgovt1bold">NO</span><span class="fieldlabelgovt1"> tax liability </span><span class="fieldlabelgovt1bold">AND</span><li><span class="fieldlabelgovt1">'
		+ 'This year I expect a refund of </span><span class="fieldlabelgovt1bold">ALL</span><span class="fieldlabelgovt1"> Federal income tax withheld because I '
		+ 'expect to have </span><span class="fieldlabelgovt1bold">NO</span><span class="fieldlabelgovt1"> tax liability.<br>'
		+ 'If you meet both conditions, enter "EXEMPT" here.</span>'
	if (emssObjInstance.emssObj.w4Exempt && DedMastr[n].TaxExemptFlag != "B")
	{
		edmnext += ' '+paddlDots
        	+  '<select name="exempt" onchange="javascript:parent.setValue(this.form)"'
		if (IRSLockIn)
			edmnext += ' disabled'	               
		edmnext += '><option value=" "'
		if (DedMastr[n].TaxExemptFlag != "Y")
			edmnext  += ' selected'            
   	  	edmnext += '><option value="Y"'
      	if (DedMastr[n].TaxExemptFlag == "Y")
        	edmnext  += ' selected'
        edmnext += '>EXEMPT</select>'	
	}
	else		
		edmnext += '<span class="fieldlabelgovt1reditalic">(Contact your Payroll department to claim EXEMPT).</span>'
	edmnext += '</td></tr>'
		+ '<tr><td class="plaintablecellborder2" valign="top" colspan=2><span class="fieldlabelgovt1">Under penalties of perjury, I declare that I have examined this certificate '
		+ 'and to the best of my knowledge and belief, it is true, correct, and complete. <br><br><br></span>'
		+ '<span class="fieldlabelgovt1bold">Employee\'s signature</span>'
		+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
		+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
		+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
		+ '<span class="fieldlabelgovt1bold">Date</span></td></tr></table>'
		+ '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%">'
		+ '<tr><td class="plaintablecellborder2" valign="top"><span class="fieldlabelgovt1bold">8'
		+ '</span><span class="fieldlabelgovt1"> Employer\'s name and address <br> (Employer: Complete 8 and 10 only if sending to the IRS)</span><br><br></td>'
		+ '<td class="plaintablecellborder2" valign="top" nowrap><span class="fieldlabelgovt1bold">9</span><span class="fieldlabelgovt1"> Office code<br><center>(optional)</center></span><br><br></td>'
		+ '<td class="plaintablecellborder2" valign="top" nowrap><span class="fieldlabelgovt1bold">10</span><span class="fieldlabelgovt1"> Employer identification number</font>'
		+ '</td></tr></table>'
	edmprint += edmnext
	edmform += edmnext + buttonRow
	edmnext	= '<input class="inputbox" type=hidden name=dedcode value="' + DedMastr[n].DedCode + '"></form>'
	if (!IRSLockIn)
	{
		edmnext += '<script>'
			+ 'document.forms[0].elements[0].focus()'
			+ '</scr'
			+ 'ipt>'
	}				
	edmprint += edmnext

	self.PRINTDOC.document.body.innerHTML = edmprint;
	self.W4FORM.document.getElementById("paneHeader").innerHTML = getSeaPhrase("W4_FORM","ESS");
	self.W4FORM.document.getElementById("paneBody").innerHTML = edmform;
	self.W4FORM.stylePage();
	self.document.getElementById("MAIN").style.visibility = "hidden";
	self.document.getElementById("W4FORM").style.visibility = "visible";
	// if this task has been launched as a related link, remove any processing message
	if (fromTask && typeof(parent.parent.removeWaitAlert) == "function")
		parent.parent.removeWaitAlert();
	if (fromTask && typeof(parent.removeWaitAlert) == "function")
		parent.removeWaitAlert();
}

function OpenHelpDialog()
{
	openHelpDialogWindow("/lawson/xhrnet/w4/w4tip.htm");
}

function PrivacyLink()
{
	openHelpDialogWindow("/lawson/xhrnet/w4/privacy.htm");
}

function VerifyUpdate(obj,n)
{
	var AddlAmt = null;
	
	if (obj.name == "w4form")
	{
		AddlAmt = self.W4FORM.document.w4form.addlamount;
		clearRequiredField(AddlAmt);
	}
	else if (obj.name == "stform")
	{
		AddlAmt = self.STATE.document.stform.addlamount;
		clearRequiredField(AddlAmt);
	}
	if (AddlAmt != null && NonSpace(AddlAmt.value) && !ValidNumber(AddlAmt,9,2)) 
	{
		setRequiredField(AddlAmt);
		seaAlert(getSeaPhrase("INVALID_NO","ESS"));
		AddlAmt.focus();
		AddlAmt.select();
		return;
	}

	thisform = obj;
	num = n;
	page = '<div class="plaintablecell">'
		+ getSeaPhrase("W4_PERJURY_STMT","ESS") + '<br/>'
		+ '<ul>'
		+ '<li>' + getSeaPhrase("AUTHORIZE_CHANGES","ESS") + '</li>'
		+ '<li>' + getSeaPhrase("CANCEL_CHANGES","ESS") + '</li>'
		+ '</ul>'
		+ '<p align="center">'
		if (obj.name == "w4form")
			page += uiButton(getSeaPhrase("UPDATE","ESS"), "parent.ProcessFedEmdedmastr(parent.thisform,parent.num);return false")
		else
// MOD BY BILAL 
      // JRZ 9/22/08 Removed Update button from W4 State Withholding screen
	//		page += uiButton(getSeaPhrase("UPDATE","ESS"), "parent.ProcessEmdedmastr(parent.thisform,parent.num);return false")
// END OF MOD
		page += uiButton(getSeaPhrase("CANCEL","ESS"), "parent.clearW4Update(parent.thisform);return false")
		+ '</p>'
		+ '</div>'

	self.VERIFY.document.getElementById("paneHeader").innerHTML = getSeaPhrase("VERIFY_W4_CHANGES","ESS");
	self.VERIFY.document.getElementById("paneBody").innerHTML = page;
	self.VERIFY.stylePage();
	self.VERIFY.setLayerSizes(true);

	if (obj.name == "w4form")
		self.document.getElementById("W4FORM").style.visibility = "hidden";
	else if (obj.name == "stform")
		self.document.getElementById("STATE").style.visibility = "hidden";
	self.document.getElementById("VERIFY").style.visibility = "visible";
}

var Gobj;

function ProcessFedEmdedmastr(obj,n)
{
	clearRequiredField(obj.addlamount);
	var MarStatus = self.W4FORM.document.getElementById("marstatus");
	clearRequiredField(MarStatus);

	if (obj.maritalstatus[0].checked == false && obj.maritalstatus[1].checked == false && obj.maritalstatus[2].checked == false) {
		clearW4Update(obj);
		setRequiredField(MarStatus);
		seaAlert(getSeaPhrase("W4_7","ESS"));
		obj.maritalstatus[0].focus();
		return
	}

	if (NonSpace(obj.addlamount.value) == 0) {
		obj.addlamount.value = "0";
	}

	if (ValidNumber(obj.addlamount,9,2) == false) {
		clearW4Update(obj);
		setRequiredField(obj.addlamount);
		seaAlert(getSeaPhrase("INVALID_NO","ESS"));
		obj.addlamount.focus();
		obj.addlamount.select();
		return;
	}

	if (obj.exemptions.value == "") {
		obj.exemptions.value = "0";
	}
	if (obj.addlamount.value == "") {
		obj.addlamount.value = "0";
	}

	idx = obj.exemptions.selectedIndex;

	var MaritalCheck = 0;
	if (obj.maritalstatus[0].checked == true)
		MaritalCheck = parseInt(obj.maritalstatus[0].value,10);
	else if (obj.maritalstatus[1].checked == true)
		MaritalCheck = parseInt(obj.maritalstatus[1].value,10);

	var ExemptsCheck = parseInt(obj.exemptions[idx].value,10);
	ExemptsCheck = (isNaN(ExemptsCheck))? 0 : ExemptsCheck;

	tmpLn = n;
	tmpObj = obj;
	tmpAppObj = appObj;

  	if (!obj.exempt && (DedMastr[n].TaxExemptFlag == "Y" || DedMastr[n].TaxExemptFlag == "B")
  	&& ((parseInt(DedMastr[n].MaritalStatus,10) != MaritalCheck)
  		|| (parseInt(DedMastr[n].Exemptions,10) != ExemptsCheck)))
  	{
 		var warning = getSeaPhrase("TAX_EXEMPT_WARNING","ESS")+"\n\n"
			+ getSeaPhrase("OK_TO_CONTINUE","ESS");
		if (!seaConfirm(warning,"",fedOnlyFF))
		{
			clearW4Update(obj);
			return;
		}
 	}

	fedOnlyFF();
}

function fedOnlyFF()
{
	Gobj=tmpObj;
	fedOnly();
}

function fedOnly()
{
	var obj=Gobj;
	var object = new AGSObject(authUser.prodline, "PR13.1");
	object.event = "CHANGE"
	object.rtn = "MESSAGE";
	object.longNames = true;
	object.tds = false;
	object.func = "parent.DspMsg(true)"
	object.field = "FC=C"
		+ "&EDM-COMPANY=" + parseInt(authUser.company,10)
		+ "&EDM-EMPLOYEE=" + parseInt(authUser.employee,10)
		+ "&LINE-FC1=C"
//		+ "&EDM-DED-CODE1=" + escape(obj.dedcode.value)
		+ "&EDM-DED-CODE1=" + escape(DedMastr[tmpLn].DedCode)
		+ "&EDM-RES-CODE1=Y"
		+ "&EDM-EXEMPTIONS1=" + escape(obj.exemptions[idx].value)
		+ "&EDM-ADDL-AMOUNT1=" + escape(obj.addlamount.value)
		+ GetCheckedValue("&EDM-MARITAL-STATUS1=",tmpObj.maritalstatus)
	if (obj.exempt)
		object.field += "&EDM-TAX-EXEMPT-FLG1=" + escape(obj.exempt[obj.exempt.selectedIndex].value)	

	if (tmpAppObj.getAppVersion().toString() >= "9.0")
    	object.field += "&EDM-USER-ID=W"+escape(authUser.employee)

	if (tmpObj.addlamount.value != "0")
		object.field += "&EDM-ADDL-TAX-CODE1=2"
	if (tmpObj.addlamount.value == "0" && eval(DedMastr[tmpLn].AddlAmount) != 0)
		object.field += "&EDM-ADDL-TAX-CODE1=0"

	object.field += "&WEB-UPDATE=Y"
//		+ "&PT-EDM-DED-CODE=" + escape(obj.dedcode.value,1)
		+ "&PT-EDM-DED-CODE=" + escape(DedMastr[tmpLn].DedCode,1)
		+ "&PT-EDM-DED-PRI=" + escape(DedMastr[tmpLn].DeductionPriority,1)

	updatetype = "EDM"

	if (fromTask)
	{
		parent.showWaitAlert("PROCESSING_WAIT", "ESS");
	}

	AGS(object,"jsreturn");
}

function DspMsg(fedUpdate)
{
	var MarStatus;
	var W4Form;

	if (fedUpdate) {
		W4Form = self.W4FORM.document.forms["w4form"];
		MarStatus = self.W4FORM.document.getElementById("marstatus");
	}
	else {
		W4Form = self.STATE.document.forms["stform"];
		MarStatus = W4Form.maritalstatus;
	}
	clearRequiredField(MarStatus);

	if (self.lawheader.gmsgnbr == 000) {
		clearW4Update(W4Form);
		GetEmdedmastr();
	}
	else
	{
		if (self.lawheader.gmsgnbr == 153)	{
			clearW4Update(W4Form);
			setRequiredField(MarStatus);
			seaAlert(getSeaPhrase("INVALID_MAR_STATUS","ESS"));
			if (fedUpdate)
			{
				MarStatus[0].focus();
			}
			else
			{
				MarStatus.focus();
				MarStatus.select();
			}
    	} else {
			seaAlert(self.lawheader.gmsg);
		}

		// if this task has been launched as a related link, remove any processing message
		if (fromTask && typeof(parent.parent.removeWaitAlert) == "function")
			parent.parent.removeWaitAlert();
		if (fromTask && typeof(parent.removeWaitAlert) == "function")
			parent.removeWaitAlert();
	}
}

function DisplayModel(obj)
{
	var MarStatus = self.W4FORM.document.getElementById("marstatus");
	clearRequiredField(MarStatus);

	if (obj.maritalstatus[0].checked == false && obj.maritalstatus[1].checked == false && obj.maritalstatus[2].checked == false)	{
		seaAlert(getSeaPhrase("W4_7","ESS"));
		setRequiredField(MarStatus);
		obj.maritalstatus[0].focus();
		return
	}

	clearRequiredField(obj.addlamount);

	if (NonSpace(obj.addlamount.value) == 0)
		obj.addlamount.value = "0";

	if (ValidNumber(obj.addlamount,9,2) == false) {
		setRequiredField(obj.addlamount);
		seaAlert(getSeaPhrase("W4_10","ESS"));
		obj.addlamount.select();
		obj.addlamount.focus();
		return;
	}

	idx = obj.exemptions.selectedIndex

	if (obj.addlamount.value == "")
		obj.addlamount.value = "0"

	exemptions = obj.exemptions[idx].value
	addlamount = obj.addlamount.value
	maritalstatus = 0

	if (obj.maritalstatus[0].checked == true)
		maritalstatus = obj.maritalstatus[0].value
	if (obj.maritalstatus[1].checked == true)
		maritalstatus = obj.maritalstatus[1].value
	if (obj.maritalstatus[2].checked == true)
		maritalstatus = obj.maritalstatus[2].value

	if (fromTask)
	{
		parent.showWaitAlert("PROCESSING_WAIT", "ESS");
	}

	var param = "from=w4&exemptions="+exemptions+"&addlamount="+addlamount
		+ "&maritalstatus="+maritalstatus
	self.document.getElementById("PAYMODEL").src = "/lawson/xhrnet/paymodel.htm?" + param;
	self.document.getElementById("W4FORM").style.visibility = "hidden";
	self.document.getElementById("PAYMODEL").style.visibility = "visible";
}

function backToMain(frame)
{
	self.document.getElementById(frame).style.visibility = "hidden";
	self.document.getElementById("MAIN").style.visibility = "visible";

	// if this task has been launched as a related link, remove any processing message
	if (fromTask && typeof(parent.parent.removeWaitAlert) == "function")
		parent.parent.removeWaitAlert();
	if (fromTask && typeof(parent.removeWaitAlert) == "function")
		parent.removeWaitAlert();
}

function setValue(form)
{
	with(self.PRINTDOC.document.w4form) {
		exemptions.selectedIndex = form.exemptions.selectedIndex
		exemptions.options[exemptions.selectedIndex].value = form.exemptions.options[form.exemptions.selectedIndex].value
		addlamount.value = form.addlamount.value
	}
}

function setMaritalStatus(form,index)
{
		with(self.PRINTDOC.document.w4form)
		{
			maritalstatus[index].checked = true ;
		}
}

function VerifyPrint()
{
	var AddlAmt = self.W4FORM.document.w4form.addlamount;

	clearRequiredField(AddlAmt);

	if (NonSpace(AddlAmt.value) && !ValidNumber(AddlAmt,9,2))
	{
		setRequiredField(AddlAmt);
		seaAlert(getSeaPhrase("INVALID_NO","ESS"));
		AddlAmt.focus();
		AddlAmt.select();
		return
	}

	self.PRINTDOC.focus();
	self.PRINTDOC.print();
}

function UpdateEmdedmastr(n)
{
	if (fromTask)
	{
		parent.showWaitAlert("PROCESSING_WAIT", "ESS");
	}

	var IRSLockIn = (DedMastr[n].DfltTcaFlag != null && parseInt(DedMastr[n].DfltTcaFlag,10) == 9) ? true : false;
	var amt = ""
	if (DedMastr[n].AddlTaxCode.indexOf("2") == 1)
		amt = roundToDecimal(DedMastr[n].AddlAmount,2)
	if (NonSpace(amt) && String(amt).indexOf(".") == -1)
		amt += ".00"

	edmform = '<form name="stform">'
// MOD BY BILAL 
		+ '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
		+ '<div>'
		+ '<tr><td style="text-align:center"><font color="red"><b>W4 is READ ONLY. NO CHANGES can be made here.<br> Please fill out any changes '
		+ ' using paper W4 form and send to payroll</b>'
        + ' <br><a target="blank" href="/lawson/xhrnet/payroll-Forms/W-4.2011.pdf">Click here for W4 FORM</a></font><hr></td></tr>'
		+ '</table>'
// END OF MOD 

		+ '<table border="0" cellspacing="0" cellpadding="0" style="width:100%">'
		+ '<tr>'
		+ '<td class="plaintablerowheader"> '+getSeaPhrase("W4_1","ESS")+'</td>'
		+ '<td class="plaintablecell"  nowrap><select class="inputbox" name="rescode"'
	if (IRSLockIn)
		edmform += ' disabled'
	edmform += '>'+buildResdnSelect(n)+'</select></td>'
		+ '</tr>'
		+ '<tr>'
		+ '<th class="plaintablerowheader">'+getSeaPhrase("W4_4","ESS")+'</th>'
		+ '<td class="plaintablecell"  nowrap><select class="inputbox" name=maritalstatus'
	if (IRSLockIn)
		edmform += ' disabled'
	edmform += '>'+BuildMaritalSelect(eval(DedMastr[n].MaritalStatus))
		+ '</select>'+uiRequiredIcon()
		+ '</td>'
		+ '</tr>'
		+ '<tr>'
		+ '<th class="plaintablerowheader">'+getSeaPhrase("EXEMPTIONS","ESS")+'</th>'
		+ '<td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type=text name=exemptions value="'+eval(DedMastr[n].Exemptions)+'" maxlength=5 size=5 onfocus="this.select()"'
		+ ' onchange=parent.ValidateNonFedNumber(this,5,0)'
	if (IRSLockIn)
		edmform += ' disabled'	
	edmform += '>'
		+ '</td>'
		+ '</tr>'
		+ '<tr>'
		+ '<th class="plaintablerowheaderborderbottom">'+getSeaPhrase("W4_6","ESS")+'</th>'
		+ '<td class="plaintablecell" nowrap>'
		+ '<input class="inputbox" type=text name=addlamount value="'+amt+'" maxlength=10 size=10 onfocus=this.select()'
		+ ' onchange=parent.ValidateNonFedNumber(this,9,2)'
	if (IRSLockIn)
		edmform += ' disabled'	
	edmform += '>'
		+ '</td>'
		+ '</tr>'
	if (IRSLockIn)
	{
		edmform += '<tr><td class="plaintablecell" colspan="2">'
		+ '<span class="fieldlabelgovtboldred">You are unable to change your withholdings due to a State Letter on file. Contact your Payroll department.</span>'
		+ '</td></tr>'
	}		
	edmform += '<tr>'
		+ '<td class="plaintablecell">&nbsp;</td>'
		+ '<td class="plaintablecell">'
// MOD BY BILAL  - Hiding the continue button
//	if (!IRSLockIn)
//		edmform += uiButton(getSeaPhrase("CONTINUE","ESS"),"parent.VerifyUpdate(this.form," + n + ");return false")	
// END OF MOD
	edmform += uiButton(getSeaPhrase("BACK","ESS"), "parent.GetEmdedmastr();return false")
		+ '</td>'
		+ '</tr>'
		+ '</table>'
		+ '<input type=hidden name=dedcode value="' + DedMastr[n].DedCode + '">'
		+ '</form>'
		+ uiRequiredFooter()

	self.STATE.document.getElementById("paneHeader").innerHTML = DedMastr[n].DeductionCodeDescription;
	self.STATE.document.getElementById("paneBody").innerHTML = edmform;
	self.STATE.stylePage();
	self.document.getElementById("MAIN").style.visibility = "hidden";
	self.document.getElementById("STATE").style.visibility = "visible";
	// if this task has been launched as a related link, remove any processing message
	if (fromTask && typeof(parent.parent.removeWaitAlert) == "function")
		parent.parent.removeWaitAlert();
	if (fromTask && typeof(parent.removeWaitAlert) == "function")
		parent.removeWaitAlert();
}

function ProcessEmdedmastr(obj,n)
{
	var MarStatus = obj.maritalstatus;

	clearRequiredField(MarStatus);
	clearRequiredField(obj.exemptions);
	clearRequiredField(obj.addlamount);

	if (obj.maritalstatus.selectedIndex == 0) {
		setRequiredField(MarStatus);
		MarStatus.style.paddingLeft = "5px";
		seaAlert(getSeaPhrase("W4_7","ESS"));
		obj.maritalstatus.focus();
		return;
	}

	if (NonSpace(obj.exemptions.value) == 0) {
		obj.exemptions.value = "0";
	}

	if (ValidNumber(obj.exemptions,5,0) == false) {
		setRequiredField(obj.exemptions);
		seaAlert(getSeaPhrase("INVALID_NO","ESS"));
		obj.exemptions.focus();
		obj.exemptions.select();
		return
	}

	if (NonSpace(obj.addlamount.value) == 0) {
		obj.addlamount.value = "0";
	}

	if (ValidNumber(obj.addlamount,9,2) == false) {
		setRequiredField(obj.addlamount);
		seaAlert(getSeaPhrase("INVALID_NO","ESS"));
		obj.addlamount.focus();
		obj.addlamount.select();
		return
	}

	idxRes = obj.rescode.selectedIndex;
	idx = obj.maritalstatus.selectedIndex;

	var MaritalCheck = parseInt(obj.maritalstatus[idx].value,10);
	MaritalCheck = (isNaN(MaritalCheck))? 0 : MaritalCheck;

	var ExemptsCheck = parseInt(obj.exemptions.value,10);
	ExemptsCheck = (isNaN(ExemptsCheck))? 0 : ExemptsCheck;

	tmpObj = obj;
	tmpLn = n;
	tmpAppObj = appObj;

  	if ((DedMastr[n].TaxExemptFlag == "Y" || DedMastr[n].TaxExemptFlag == "B")
  	&& ((parseInt(DedMastr[n].MaritalStatus,10) != MaritalCheck)
  		|| (parseInt(DedMastr[n].Exemptions,10) != ExemptsCheck)))
  	{
 		var warning = getSeaPhrase("TAX_EXEMPT_WARNING","ESS")+"\n\n"
			+ getSeaPhrase("OK_TO_CONTINUE","ESS");
		if (!seaConfirm(warning,"",contFF))
		{
			return
		}
	}
	contFF();
}

function contFF()
{
	if (fromTask)
	{
		parent.showWaitAlert("PROCESSING_WAIT", "ESS");
	}

	var object = new AGSObject(authUser.prodline, "PR13.1");
	object.event = "CHANGE"
	object.rtn = "MESSAGE";
	object.longNames = true;
	object.tds = false;
	object.debug = false;
	object.func = "parent.DspMsg(false)"
	object.field = "FC=C"
		+ "&EDM-COMPANY=" + parseInt(authUser.company,10)
		+ "&EDM-EMPLOYEE=" + parseInt(authUser.employee,10)
		+ "&LINE-FC1=C"
		+ "&EDM-DED-CODE1=" + escape(DedMastr[tmpLn].DedCode)
//		+ "&EDM-DED-CODE1=" + escape(obj.dedcode.value,1)
		+ "&EDM-EXEMPTIONS1=" + escape(tmpObj.exemptions.value,1)
		+ "&EDM-MARITAL-STATUS1=" + escape(tmpObj.maritalstatus[idx].value,1)
		+ "&EDM-RES-CODE1=" + tmpObj.rescode[idxRes].value

	if (tmpAppObj.getAppVersion().toString() >= "9.0")
		object.field += "&EDM-USER-ID=W"+escape(authUser.employee)
	if (tmpObj.addlamount.value != "0")
		object.field += "&EDM-ADDL-TAX-CODE1=2"
	if (tmpObj.addlamount.value == "0" && eval(DedMastr[tmpLn].AddlAmount) != 0)
		object.field += "&EDM-ADDL-TAX-CODE1=0"
	if (tmpObj.addlamount.value == "0" && eval(DedMastr[tmpLn].AddlAmount) == 0)
		object.field += "&EDM-ADDL-TAX-CODE1=" + eval(DedMastr[tmpLn].AddlTaxCode)
	object.field += "&EDM-ADDL-AMOUNT1=" + escape(tmpObj.addlamount.value,1)
		+ "&WEB-UPDATE=Y"
		+ "&PT-EDM-DED-CODE=" + escape(DedMastr[tmpLn].DedCode,1)
		+ "&PT-EDM-DED-PRI=" + escape(DedMastr[tmpLn].DeductionPriority,1)
	object.rtnScript = true;
	updatetype = "EDM"
	AGS(object,"jsreturn")
}

function clearW4Update(w4Form)
{
	self.document.getElementById("VERIFY").style.visibility = "hidden";
	if (w4Form.name == "w4form")
		self.document.getElementById("W4FORM").style.visibility = "visible";
	else if (w4Form.name == "stform")
		self.document.getElementById("STATE").style.visibility = "visible";	
}

function sortByProperty(obj1, obj2)
{
	var name1 = obj1[sortProperty];
	var name2 = obj2[sortProperty];
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function SortEmdedmastr(property)
{
	if (DedMastr.length > 0)
	{
		sortProperty = property;
		DedMastr.sort(sortByProperty);
		DspEmdedmastr(true,property);
	}
}

function ValidateFedNumber(formObj,size,decimals)
{
	if (NonSpace(formObj.value) == 0) {
		formObj.value = "0";
	}
	
	if(!isNaN(formObj.value)) {
		formObj.value = parseFloat(formObj.value);
	}

	clearRequiredField(self.W4FORM.document.forms["w4form"].addlamount);
	clearRequiredField(formObj);

	if (ValidNumber(formObj,size,decimals) == false) {
		setRequiredField(formObj);
		seaAlert(getSeaPhrase("INVALID_NO","ESS"));
		formObj.focus();
		formObj.select();
	}
	setValue(formObj.form);
}

function ValidateNonFedNumber(formObj,size,decimals)
{
	if (NonSpace(formObj.value) == 0) {
		formObj.value = "0";
	}
	
	if(!isNaN(formObj.value)) {
		formObj.value = parseFloat(formObj.value);
	}

	clearRequiredField(self.STATE.document.forms["stform"].maritalstatus);
	clearRequiredField(self.STATE.document.forms["stform"].exemptions);
	clearRequiredField(self.STATE.document.forms["stform"].addlamount);
	clearRequiredField(formObj);

	if (ValidNumber(formObj,size,decimals) == false) {
		setRequiredField(formObj);
		seaAlert(getSeaPhrase("INVALID_NO","ESS"));
		formObj.focus();
		formObj.select();
	}
}

function buildResdnSelect(n)
{
	var html = '<option value="Y"'
	if (DedMastr[n].ResCode == "Y")
		html += ' selected'
	html += '>'+getSeaPhrase("W4_2","ESS")+'</option>'
	html += '<option value="N"'
	if (DedMastr[n].ResCode == "N")
		html += ' selected'
	html += '>'+getSeaPhrase("W4_3","ESS")+'</option>'
	return html;
}

function BuildExemptionsSelect(code)
{
	var esccodeselect = '<option value=" ">'
	for (var i=0; i<100; i++)
	{
		esccodeselect += '<option value="' + i + '"'
		if (code == i)
			esccodeselect += ' selected>'
		else
			esccodeselect += '>'
		esccodeselect += i
	}
	return esccodeselect
}

function InitMaritalSelect()
{
	MaritalStatusList = new Array(" ",
		getSeaPhrase("SINGLE","ESS"),getSeaPhrase("MARRIED","ESS"),getSeaPhrase("MARRIED_FILE_SEPARATE","ESS"),
		getSeaPhrase("MARRIED_BOTH_WORKING","ESS"),getSeaPhrase("MARRIED_ONE_WORKING","ESS"),getSeaPhrase("HOUSEHOLD_HEAD","ESS"),
		getSeaPhrase("MARRIED_EMPLOYERS","ESS"),getSeaPhrase("WINDOW_ER","ESS"),getSeaPhrase("MARRIED_NOT_WITH_SPOUSE","ESS"),
		getSeaPhrase("MARRIED_JOINT_ALL","ESS"),getSeaPhrase("MARRIED_JOINT_HALF","ESS"),getSeaPhrase("MARRIED_SEPARATE_ALL","ESS"),
		getSeaPhrase("MARRIED_JOINT_NONE","ESS"),getSeaPhrase("MARRIED_WITH_SPOUSE","ESS"),getSeaPhrase("MARRIED_SINGLE","ESS"),
		getSeaPhrase("CIVIL_UNION","ESS"),getSeaPhrase("CIVIL_UNION_SINGLE","ESS")
	)
}

function BuildMaritalSelect(status)
{
	var maritalselect = ""
	var status = parseInt(status,10)

	for (var i=0; i<MaritalStatusList.length; i++)
	{
        maritalselect += '<option value="'+i+'"'
		if (status == i)
			maritalselect += ' selected>'
		else
			maritalselect += '>'
		maritalselect += MaritalStatusList[i]
	}
	return maritalselect
}

function DedMastrObject()
{
	this.DedCode 					= arguments[0];
	this.EffectDate 				= arguments[1];
	this.EndDate 					= arguments[2];
	this.ResCode 					= arguments[3];
	this.ResCodeDescription 		= arguments[4];
	this.MaritalStatus 				= arguments[5];
	this.MaritalStatusDescription 	= arguments[6];
	this.Exemptions 				= arguments[7];
	this.AddlAmount 				= arguments[8];
	this.DeductionCodeDescription 	= arguments[9];
	this.DeductionCodeTaxAuthType 	= arguments[10];
	this.AddlTaxCode 				= arguments[11];
	this.AddlRate 					= arguments[12];
	this.EmployeeLabelName1 		= arguments[13];
	this.EmployeeFicaNbr 			= arguments[14];
	this.EmployeeAddr1 				= arguments[15];
	this.EmployeeCity 				= arguments[16];
	this.EmployeeState 				= arguments[17];
	this.EmployeeZip 				= arguments[18];
	this.EmployeeWorkCountry 		= arguments[19];
	this.EmployeeWorkState 			= arguments[20];
	this.DeductionPriority			= arguments[21];
	this.TaxExemptFlag          	= arguments[22];
	this.AddlExempts				= arguments[23];
	this.DfltTcaFlag				= (typeof(arguments[24]) != undefined) ? arguments[24] : null;
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

	var frameAry = new Array("MAIN", "W4FORM", "STATE", "PAYMODEL");
	var winHeight = 464;
	var winWidth = 803;

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

	var fullContentWidth = (window.styler && window.styler.showLDS) ? (winWidth - 17) : ((navigator.appName.indexOf("Microsoft") >= 0) ? (winWidth - 12) : (winWidth - 7));
	var fullBorderContentWidth = (window.styler && window.styler.showLDS) ? fullContentWidth + 15 : fullContentWidth + 2;
	var fullBorderContentHeight = (window.styler && window.styler.showLDS) ? winHeight - 15 : ((navigator.appName.indexOf("Microsoft") >= 0) ? (winHeight - 9) : (winHeight - 11));

	for (var i=0; i<frameAry.length; i++)
	{
		var frmNm = frameAry[i];
		var frmElm = document.getElementById(frmNm);
		frmElm.style.width = winWidth + "px";
		frmElm.style.height = winHeight + "px";
		try
		{
			window[frmNm].document.body.style.overflow = "hidden";
			window[frmNm].document.getElementById("paneBodyBorder").style.width = fullContentWidth + "px";
			window[frmNm].document.getElementById("paneBodyBorder").style.height = (winHeight - 35) + "px";
			window[frmNm].document.getElementById("paneBorder").style.width = fullBorderContentWidth + "px";
			window[frmNm].document.getElementById("paneBorder").style.height = fullBorderContentHeight + "px";			
			window[frmNm].document.getElementById("paneBody").style.width = "100%";
			window[frmNm].document.getElementById("paneBody").style.height = "100%";
		}
		catch(e)
		{}
	}
}
</script>
</head>
<body style="overflow:hidden" onload="fitToScreen();GetWebuser()" onresize="fitToScreen()">
	<iframe id="MAIN" name="MAIN" style="visibility:hidden;position:absolute;top:0px;left:0px;width:100%;height:464px" marginwidth="0" marginheight="0" frameborder="no" scrolling="auto" src="/lawson/xhrnet/ui/headerpane.htm"></iframe>
	<iframe id="W4FORM" name="W4FORM" style="visibility:hidden;position:absolute;top:0px;left:0px;width:100%;height:100%" marginwidth="0" marginheight="0" frameborder="no" scrolling="auto" src="/lawson/xhrnet/ui/headerpanehelp.htm"></iframe>
	<iframe id="VERIFY" name="VERIFY" style="visibility:hidden;position:absolute;top:0px;left:0px;width:430px;height:464px" marginwidth="0" marginheight="0" frameborder="no" scrolling="no" src="/lawson/xhrnet/ui/headerpane.htm"></iframe>
	<iframe id="PRINTDOC" name="PRINTDOC" style="height:0px;width:0px" src="/lawson/xhrnet/ui/plain.htm" marginwidth="0" marginheight="0" frameborder="no"></iframe>
	<iframe id="STATE" name="STATE" style="visibility:hidden;position:absolute;top:0px;left:0px;width:100%;height:100%" marginwidth="0" marginheight="0" frameborder="no" scrolling="no" src="/lawson/xhrnet/ui/headerpane.htm"></iframe>
	<iframe id="PAYMODEL" name="PAYMODEL" style="visibility:hidden;position:absolute;top:0px;left:0px;width:100%;height:464px" src="/lawson/xhrnet/dot.htm" marginwidth="0" marginheight="0" frameborder="no"  scrolling="no"></iframe>
	<iframe id="HIDDEN" name="HIDDEN" style="visibility:hidden" src="/lawson/xhrnet/dot.htm"></iframe>
	<iframe name="jsreturn" style="visibility:hidden" src="/lawson/xhrnet/dot.htm"></iframe>
	<iframe name="lawheader" style="visibility:hidden" src="/lawson/xhrnet/esslawheader.htm"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@(201111) 09.00.01.06.00 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/w4/w4.htm,v 1.17.2.41 2011/06/10 08:11:24 juanms Exp $ -->
