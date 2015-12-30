<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width" />
<title>Tax Withholding</title>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/webappjs/common.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/webappjs/transaction.js"></script>
<script src="/lawson/xhrnet/prlockout.js"></script>
<script src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/waitalert.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script src="/lawson/webappjs/javascript/objects/ActivityDialog.js"></script>
<script src="/lawson/webappjs/javascript/objects/OpaqueCover.js"></script>
<script src="/lawson/webappjs/javascript/objects/Dialog.js"></script>
<script src="/lawson/webappjs/javascript/objects/Transaction.js"></script>
<script src="/lawson/webappjs/javascript/objects/ProcessFlow.js"></script>
<script>
var privacyWin;
var DedMastr, thisform, num;
var MaritalStatusList;
var year = thisYear;
var fromTask = (window.location.search)?unescape(window.location.search):"";
var parentTask = "";
var appObj;
var tmpLn;
var tmpObj;
var tmpAppObj;
var sortProperty;
var lastSortField = null;
var seaPageWnd = window;
if (fromTask)
	parentTask = getVarFromString("from",fromTask);
	
function GetWebuser()
{
	authenticate("frameNm='jsreturn'|funcNm='GetSystemDate()'|desiredEdit='EM'")
}

function GetSystemDate()
{
	stylePage();
	if (fromTask && stylerWnd)
		seaPageWnd = stylerWnd;	
	self.PRINTDOC.stylePage();
	setWinTitle(getSeaPhrase("LIFE_EVENTS_2","ESS"));
	StoreDateRoutines();
	InitMaritalSelect();
	startProcessing(getSeaPhrase("WAIT","ESS"), GetAppVersion);
}

function AfterLockout(dlgWnd)
{	
	if (fromTask != "" && parentTask != "" && parentTask != "main")
		CloseW4();
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
	if (emssObjInstance.emssObj.payrollLockout && (appObj && appObj.getLongAppVersion() != null && appObj.getLongAppVersion().toString() >= "09.00.01.09"))		
	{
		if (isPRLockedOut("T", authUser.company, authUser.employee))
		{
			stopProcessing();
			seaAlert(getSeaPhrase("PR_LOCKED_OUT","SEA"),"",null,"error",AfterLockout);
			if (!styler.showLDS && !styler.showInfor && !styler.showInfor3)
				AfterLockout();
			return;
		}	
	}
	GetDeductions();
}

function RefreshDeductions()
{
	startProcessing(getSeaPhrase("REFRESHING_DATA","SEA"), GetDeductions);
}

function GetDeductions()
{
	var pDMEObj = new DMEObject(authUser.prodline, "EMDEDMASTR");
	pDMEObj.out = "JAVASCRIPT";
	pDMEObj.index = "EDMSET3";
	pDMEObj.key = parseInt(authUser.company,10) +"="+ parseInt(authUser.employee,10)+"=0=";
	pDMEObj.cond = "tax-cat-one";
	pDMEObj.max = "600";
	pDMEObj.otmmax = "1";
	pDMEObj.func = "StoreDeductions()";
	pDMEObj.field = "ded-code;effect-date;end-date;res-code;res-code,xlt;marital-status;"
	+ "marital-status,xlt;exemptions;addl-amount;deduction-code.description;"
	+ "deduction-code.tax-auth-type;addl-tax-code;addl-rate;employee.first-mi-exp;employee.last-name-exp;"
	+ "employee.fica-nbr;employee.addr1;employee.addr2;employee.addr3;employee.addr4;employee.city;"
	+ "employee.state;employee.zip;employee.work-country;ded-priority;tax-exempt-flg;addl-exempts";
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.00")
		pDMEObj.field += ";dflt-tca-flag";
	DME(pDMEObj, "jsreturn");
}

function StoreDeductions()
{
	DedMastr = new Array();
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
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
		if (!appObj || appObj.getAppVersion() == null || appObj.getAppVersion().toString() < "09.00.00") 
			pObj.dflt_tca_flag = null; 
		DedMastr[i] = new DedMastrObject(pObj.ded_code, pObj.effect_date, pObj.end_date, pObj.res_code,
			pObj.res_code_xlt, pObj.marital_status, pObj.marital_status_xlt, pObj.exemptions,
			pObj.addl_amount, pObj.deduction_code_description, pObj.deduction_code_tax_auth_type,
			pObj.addl_tax_code, pObj.addl_rate, pObj.employee_first_mi_exp+" "+pObj.employee_last_name_exp, 
			pObj.employee_fica_nbr, pObj.employee_addr1, pObj.employee_city, pObj.employee_state, 
			pObj.employee_zip, pObj.employee_work_country, null, pObj.ded_priority, 
			pObj.tax_exempt_flg, pObj.addl_exempts, pObj.dflt_tca_flag, pObj.employee_first_mi_exp,
			pObj.employee_last_name_exp, pObj.employee_addr2, pObj.employee_addr3, pObj.employee_addr4);
	}
	if (DedMastr.length > 0 && DedMastr[0].EmployeeWorkCountry != "US")
	{
		stopProcessing();
		seaAlert(getSeaPhrase("NOT_AVAILABLE_LOCATION","ESS"), null, null, "error");
		return;
	}
	DisplayDeductions();
}

function AttachToolTip(id, toolTip, markUp)
{
	return '<div'+((id)?' id="'+id+'"':'')+' title="'+toolTip+'" aria-label="'+toolTip+'">'+markUp+'</div>';
}

function DisplayDeductions(onsort, property, sortDir)
{
	sortDir = sortDir || "ascending";
	var nextSortDir = (sortDir == "ascending") ? "descending" : "ascending";
	var LocalTaxes = false;
	var html = '<table id="emdedmastrTbl" class="plaintableborder" style="width:100%" cellpadding="0" cellspacing="0"'
	html += ' styler="list" styler_drilldown="true" styler_tooltip="'+getSeaPhrase("CHG_W4_INFO","ESS")+'" summary="'+getSeaPhrase("TSUM_26","SEA")+'">'
	html += '<caption class="offscreen">'+getSeaPhrase("DEDUCTIONS","ESS")+'</caption>'
	var toolTip = getSeaPhrase("JOB_OPENINGS_1","ESS");
	html += '<tr><th scope="col" class="plaintableheaderborder" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortDeductions(\'DeductionCodeDescription\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("SORT_BY_RES_STATUS","ESS");
	html += '<th scope="col" class="plaintableheaderborder" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortDeductions(\'ResCodeDescription\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("RESIDENT_STATUS","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("SORT_BY_MAR_STATUS","ESS");
	html += '<th scope="col" class="plaintableheaderborder" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortDeductions(\'MaritalStatusDescription\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("MARITAL_STATUS","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("SORT_BY_EXEMPTIONS","ESS");
	html += '<th scope="col" class="plaintableheaderborder" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortDeductions(\'Exemptions\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("EXEMPTIONS","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'
	toolTip = getSeaPhrase("SORT_BY_ADDL_EXEMPTS","ESS");
	html += '<th scope="col" class="plaintableheaderborder" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortDeductions(\'AddlExempts\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("ADDL_EXEMPTS","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>'	
	toolTip = getSeaPhrase("SORT_BY_ADDL_AMT","ESS");
	html += '<th scope="col" class="plaintableheaderborder" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	html += '<a class="columnsort" href="javascript:;" onclick="parent.SortDeductions(\'AddlAmount\',\''+nextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("W4_6","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th></tr>'
	for (var i=0; i<DedMastr.length; i++)
	{
		if (IsCurrent(DedMastr[i].EffectDate, DedMastr[i].EndDate) == true) 
		{
			var TaxAuthType = DedMastr[i].DeductionCodeTaxAuthType;
			var ReadOnly = false;
			toolTip = null;
			// PT 121591: only show local taxes as read-only
			if (TaxAuthType == "CI" || TaxAuthType == "CN" || TaxAuthType == "SD" || TaxAuthType == "TD") 
			{
				ReadOnly = true;
				LocalTaxes = true;
				toolTip = getSeaPhrase("LOCAL_TAX_HELP_TEXT","ESS");
			}
			if (!ReadOnly) 
			{
				var toolTip2 = DedMastr[i].DeductionCodeDescription+' - '+getSeaPhrase("EDIT_DTL_FOR","SEA");
				html += '<tr><td class="plaintablecellborder"><a href="javascript:parent.'
				html += (DedMastr[i].DeductionCodeTaxAuthType == "FD") ? 'ViewFedForm(' : 'ViewStateForm('
				html += i+');" title="'+toolTip2+'">'+DedMastr[i].DeductionCodeDescription+'<span class="offscreen"> - '+getSeaPhrase("EDIT_DTL_FOR","SEA")+'</span></a></td>'
				html += '<td class="plaintablecellborder" nowrap>'+DedMastr[i].ResCodeDescription+'</td>'
				html += '<td class="plaintablecellborder" nowrap>'+DedMastr[i].MaritalStatusDescription+'</td>'
				html += '<td class="plaintablecellborder" style="text-align:center">'+DedMastr[i].Exemptions+'</td>'
				html += '<td class="plaintablecellborder" style="text-align:center">'+DedMastr[i].AddlExempts+'</td>'
				html += '<td class="plaintablecellborder" style="text-align:center">'
				if (DedMastr[i].AddlTaxCode.indexOf("2") == 1)
					html += ((DedMastr[i].AddlAmount != 0) ? ('$ '+DedMastr[i].AddlAmount) : '&nbsp;')
				else
					html += '&nbsp;'			
			} 
			else 
			{
				// PT 121591: only show local taxes as read-only with tool tip text
				html += '<tr><td class="plaintablecellborder">'+AttachToolTip("localtax"+i,toolTip,DedMastr[i].DeductionCodeDescription)+'</td>'
				html += '<td class="plaintablecellborder" nowrap>'+AttachToolTip(null,toolTip,DedMastr[i].ResCodeDescription)+'</td>'
				html += '<td class="plaintablecellborder" nowrap>'+AttachToolTip(null,toolTip,DedMastr[i].MaritalStatusDescription)+'</td>'
				html += '<td class="plaintablecellborder" style="text-align:center">'+AttachToolTip(null,toolTip,DedMastr[i].Exemptions)+'</td>'
				html += '<td class="plaintablecellborder" style="text-align:center">'+AttachToolTip(null,toolTip,DedMastr[i].AddlExempts)+'</td>'
				html += '<td class="plaintablecellborder" style="text-align:center">'
				if (DedMastr[i].AddlTaxCode.indexOf("2") == 1)
					html += AttachToolTip(null,toolTip,((DedMastr[i].AddlAmount != 0) ? ('$ ' + DedMastr[i].AddlAmount) : '&nbsp;'))
				else
					html += AttachToolTip(null,toolTip,'&nbsp;')		
			}
			html += '</td></tr>'
		}
	}
	html += '</table>'
	if (fromTask != "" && parentTask != "" && parentTask != "main") 
	{
		html += '<p class="textAlignRight">'
		html += uiButton(getSeaPhrase("BACK","ESS"),"parent.CloseW4();return false","margin-left:5px;margin-right:5px")
		html += '</p>'
	}
	toggleFrame("W4FORM", false);
	toggleFrame("STATE", false);
	toggleFrame("MAIN", true);	
	self.MAIN.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DEDUCTIONS","ESS");
	self.MAIN.document.getElementById("paneBody").innerHTML = html;
	self.MAIN.stylePage();
	if (onsort)
		self.MAIN.styleSortArrow("emdedmastrTbl", property, sortDir);
	else
		self.MAIN.setLayerSizes();
	stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[self.MAIN.getWinTitle()]));
	fitToScreen();	
}

function toggleFrame(frmId, show)
{
	var frm = document.getElementById(frmId);
	if (frm)
	{	
		frm.style.visibility = (show) ? "visible" : "hidden";
		frm.style.display = (show) ? "" : "none";	
	}
}

function CloseW4()
{
	try 
	{
   		parent.toggleFrame("right", false);   		
   		parent.toggleFrame("relatedtask", false);
   		parent.toggleFrame("fullrelatedtask", false);		
   		parent.toggleFrame("left", true);
	}
	catch(e) {}
	// display the checkmark indicating that this task has been accessed.
	try { parent.left.setImageVisibility("w4form_checkmark","visible"); } catch(e) {}
}

function MaskSocialNbr(socialNbr)
{
	return socialNbr.substring(socialNbr.length-4,socialNbr.length);
}

function ViewFedForm(n)
{
	startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), function(){RenderFedForm(n);});
}

function RenderFedForm(n)
{
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
					if ((bkLawName != "" && bkLawName == "XMLHRPAYMENTMODELING") || bkName == "PAYMENT MODELING")
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
	var addlDots = '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . '
	var buttonRow = '<div class="floatRight"><table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr>'
	if (!IRSLockIn)
	{	
		buttonRow += '<td>'+uiButton(getSeaPhrase("CONTINUE","ESS"),"parent.VerifyUpdate(this.form,"+n+");return false","margin-left:5px",null,'aria-haspopup="true"')+'</td>'
		if (PayModel)
			buttonRow += '<td>'+uiButton(getSeaPhrase("MODEL","ESS"),"parent.DisplayModel(this.form);return false","margin-left:5px")+'</td>'
	}
	buttonRow += '<td>'+uiButton(getSeaPhrase("BACK","ESS"),"parent.RefreshDeductions();return false","margin-left:5px")+'</td>'
	+ '<td>'+uiButton(getSeaPhrase("PRINT","ESS"),"parent.VerifyPrint();return false","margin-left:5px")+'</td>'
	+ '<td class="plaintablecell" style="padding-left:15px">'
	+ '<a href="javascript:;" onclick="window.open(\'http://www.irs.gov/pub/irs-pdf/fw4.pdf\');return false;" title="PDF for Form W-4 on IRS website (opens new window)" aria-haspopup="true">'
	+ getSeaPhrase("W4_INSTRUCTIONS","ESS")+'<span class="offscreen"> - PDF for Form W-4 on IRS website (opens new window)</span></a></td></tr></table></div>'
	var addrAry = new Array();
	for (var i=1; i<5; i++)
	{	
		if (DedMastr[n]["EmployeeAddr"+i])
			addrAry[addrAry.length] = DedMastr[n]["EmployeeAddr"+i];
	}
	var edmform = '<form name="w4form" onsubmit="return false">'
	+ '<table border="0" cellspacing="0" cellpadding="0" width="100%" role="presentation">'
	+ '<tr><td class="plaintablecellborder2" nowrap><span class="fieldlabelgovt1">Form </span><span class="fieldlabelgovt5">W-4</span><br/><span class="fieldlabelgovt1">Department of the Treasury</span><br/>'
	+ '<span class="fieldlabelgovt1">Internal Revenue Service</span></td>'
	+ '<td class="plaintablecellborder2" style="text-align:center;vertical-align:top" nowrap><span class="fieldlabelgovt4">Employee\'s Withholding Allowance Certificate'
	+ '</span><br/></br><span class="fieldlabelgovtbold">Whether you are entitled to claim a certain number of allowances or exemption from withholding is <br/>'
	+ 'subject to review by the IRS. Your employer may be required to send a copy of this form to the IRS.</span></td>'
	+ '<td class="plaintablecellborder2" style="text-align:center;vertical-align:top" nowrap><span class="fieldlabelgovt1">OMB No. 1545-0074</span><br/><span class="fieldlabelgovt6">'
	+ year+'</span></td></tr></table>'
	+ '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" role="presentation">'
	+ '<tr><td class="plaintablecellborder2" style="width:33%" nowrap><span class="fieldlabelgovt1bold">1&nbsp;&nbsp;</span><span class="fieldlabelgovt1">Your first name and middle initial</span>'
	+ '<br/><br/><span class="fieldlabelgovt1bold">'+DedMastr[n].EmployeeFirstName+'</span></td>'
	+ '<td class="plaintablecellborder2" style="width:33%" nowrap><span class="fieldlabelgovt1">Last name</span>'
	+ '<br/><br/><span class="fieldlabelgovt1bold">'+DedMastr[n].EmployeeLastName+'</span></td>'
	+ '<td class="plaintablecellborder2" style="width:33%" nowrap><span class="fieldlabelgovt1bold">2&nbsp;&nbsp;</span><span class="fieldlabelgovt1bold">Your social security number</span>'
	+ '<br/><br/><span class="fieldlabelgovt1bold">'+MaskSocialNbr(DedMastr[n].EmployeeFicaNbr)+'</span>'
	+ '</td></tr></table>'
	+ '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" role="presentation">'
	+ '<tr><td class="plaintablecellborder2" style="width:50%;vertical-align:top" nowrap><span class="fieldlabelgovt1">Home address (number and street or rural route)<br/><br/></span>'
	if (addrAry.length > 0)
		edmform += '<span class="fieldlabelgovt1bold">'+addrAry.join('<br/>')+'</span>'
	edmform += '</td><td class="plaintablecellborder2" style="width:50%;vertical-align:top"><span class="fieldlabelgovt1bold">3&nbsp;&nbsp;</span><span role="radiogroup" class="fieldlabelgovt1" id="marstatus"><input class="inputbox" type="radio" id="marstatus1" name="maritalstatus" value="1" onclick="javascript:parent.setMaritalStatus(this.form,0)"'
	if (parseFloat(DedMastr[n].MaritalStatus) == 1)
		edmform += ' checked'
	if (IRSLockIn)
		edmform += ' disabled'	
	//PT 159284 and PT 164236
	edmform += ' aria-label="Marital Status Single"><label for="marstatus1">Single</label> &nbsp;<input class="inputbox" type="radio" id="marstatus2" name="maritalstatus" value="2" onclick="javascript:parent.setMaritalStatus(this.form,1)"'
	if (parseFloat(DedMastr[n].MaritalStatus) == 2)
		edmform += ' checked'
	if (IRSLockIn)
		edmform += ' disabled'
	edmform += ' aria-label="Marital Status Married"><label for="marstatus2">Married</label> &nbsp;<input class="inputbox" type="radio" id="marstatus3" name="maritalstatus" value="15" onclick="javascript:parent.setMaritalStatus(this.form,2)"'
	if (parseFloat(DedMastr[n].MaritalStatus) == 15)
		edmform += ' checked'
	if (IRSLockIn)
		edmform += ' disabled'
	edmform += ' aria-label="Marital Status Married, but withhold at higher Single rate."><label for="marstatus3">Married, but withhold at higher Single rate.</label></span><div style="padding-top:5px"><span class="fieldlabelgovt1bold">Note.</span><span class="fieldlabelgovt1"> If married, but legally '
	+ 'separated, or spouse is a nonresident alien, check the "Single" box.</span></div></td></tr>'
	+ '<tr><td class="plaintablecellborder2" style="width:50%;vertical-align:top" nowrap><span class="fieldlabelgovt1">City or town, state, and ZIP code</span><br/><br/>'
	+ '<span class="fieldlabelgovt1bold">'+DedMastr[n].EmployeeCity+', '+DedMastr[n].EmployeeState+'  '+DedMastr[n].EmployeeZip+'</span></td>'
	+ '<td class="plaintablecellborder2" style="width:50%;vertical-align:top" nowrap><span class="fieldlabelgovt1bold">4&nbsp;&nbsp;</span><span class="fieldlabelgovt1bold">If your last name differs from that shown on your social security '
	+ 'card,<br/>&nbsp;&nbsp;&nbsp;&nbsp;call 1-800-772-1213 for a replacement card.</span></td></tr>'
	if (IRSLockIn)
		edmform += '<tr><td class="plaintablecellborder2" nowrap colspan="2"><span class="fieldlabelgovtboldred"><br/>You are unable to change your withholdings due to an IRS Letter on file.  Contact your Payroll department.<br/><br/></span></td></tr>'
	edmform += '</table>'
	+ '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" role="presentation">'
	+ '<tr><td class="plaintablecellborder2" style="padding:0px" nowrap>'	
	+ '<table border="0" cellspacing="0" cellpadding="0" width="100%" role="presentation">'	
	+ '<tr><td class="plaintablecell" nowrap><span class="fieldlabelgovt1bold">5&nbsp;&nbsp;</span><span class="fieldlabelgovt1">'
	+ '<label for="exemptions">Total number of allowances you are claiming</label>'
	edmprint = edmform + addlDots
	edmform	+= addlDots
	edmnext = '</span></td>'
	edmnext += '<td class="plaintablecellright" nowrap><span class="fieldlabelgovt1bold">5&nbsp;</span><select id="exemptions" name="exemptions" onchange="javascript:parent.setValue(this.form)"'
	if (IRSLockIn)
		edmnext += ' disabled'	
	edmnext += '><span class="fieldlabelgovt1bold">' + BuildExemptionsSelect(DedMastr[n].Exemptions) + '</select>'
	edmprint += edmnext
	edmform	+= edmnext
	edmnext = '</span></td></tr>'
	+ '<tr><td class="plaintablecell" nowrap><span class="fieldlabelgovt1bold">6&nbsp;&nbsp;</span><span class="fieldlabelgovt1">'
	+ '<label for="addlamount">Additional amount, if any, you want withheld from each paycheck</label>'
	edmform += edmnext + addlDots
	edmprint += edmnext + addlDots
	edmnext	= '</span></td>'
	+ '<td class="plaintablecellright" nowrap><span class="fieldlabelgovt1bold">6&nbsp;</span>'
	+ '<input class="inputbox" type="text" id="addlamount" name="addlamount" size="10" maxlength="10"'
	+ ' value="' + amt + '" onfocus="this.select()" onchange="javascript:parent.ValidateFedNumber(this,9,2)"'
	if (IRSLockIn)
		edmnext += ' disabled'
	edmnext += '></td></tr></table>'
	edmnext += '<table border="0" cellspacing="0" cellpadding="0" width="100%" role="presentation">'
	+ '<tr><td class="plaintablecell" nowrap colspan="2"><span class="fieldlabelgovt1bold">7&nbsp;&nbsp;</span><span class="fieldlabelgovt1">I claim exemption from withholding for '
	+ year + ', and I certify that I meet </span><span class="fieldlabelgovt1bold">both</span><span class="fieldlabelgovt1"> of the following conditions for exemption.</span>'
	+ '<ul style="margin-top:2px;margin-bottom:0px"><li style="padding:2px"><span class="fieldlabelgovt1">Last year I had a right to a refund of </span><span class="fieldlabelgovt1bold">all</span><span class="fieldlabelgovt1"> federal income tax '
	+ 'withheld because I had </span><span class="fieldlabelgovt1bold">no</span><span class="fieldlabelgovt1"> tax liability, </span><span class="fieldlabelgovt1bold">and</span><br/></li>'
	+ '<li style="padding:2px"><span class="fieldlabelgovt1">This year I expect a refund of </span><span class="fieldlabelgovt1bold">all</span><span class="fieldlabelgovt1"> federal income tax withheld because I '
	+ 'expect to have </span><span class="fieldlabelgovt1bold">no</span><span class="fieldlabelgovt1"> tax liability.</span></li></ul>'
	if (emssObjInstance.emssObj.w4Exempt && DedMastr[n].TaxExemptFlag != "B")
	{
		edmnext += '<table border="0" cellspacing="0" cellpadding="0" width="100%" role="presentation">'
		+ '<tr><td class="plaintablecell" nowrap><span class="fieldlabelgovt1"><label for="exempt">'
		+ 'If you meet both conditions, write "EXEMPT" here. </label>'	
		edmnext += addlDots
		+ '</span></td><td class="plaintablecellright" nowrap><span class="fieldlabelgovt1bold">7&nbsp;</span>'
        + '<select id="exempt" name="exempt" onchange="javascript:parent.setValue(this.form)"'
		if (IRSLockIn)
			edmnext += ' disabled'	               
		edmnext += '><option value=" "'
		if (DedMastr[n].TaxExemptFlag != "Y")
			edmnext  += ' selected'            
   	  	edmnext += '><option value="Y"'
      	if (DedMastr[n].TaxExemptFlag == "Y")
        	edmnext  += ' selected'
        edmnext += '>EXEMPT</select></td></tr></table>'	
	}
	else
	{
		edmnext += '<table border="0" cellspacing="0" cellpadding="0" width="100%" role="presentation">'
		+ '<tr><td class="plaintablecell" nowrap><span class="fieldlabelgovt1">'
		+ 'If you meet both conditions, write "EXEMPT" here.</span>'			
		+ '<span class="fieldlabelgovt1reditalic"> (Contact your Payroll department to claim EXEMPT).</span>'
		+ '</td></tr></table>'
	}
	edmnext += '</td></tr></table></td></tr></table>'
	+ '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" role="presentation">'
	+ '<tr><td class="plaintablecellborder2" style="vertical-align:top"><span class="fieldlabelgovt1">Under penalties of perjury, I declare that I have examined this certificate '
	+ 'and, to the best of my knowledge and belief, it is true, correct, and complete.</span><br/><br/><br/>'
	+ '<table border="0" cellspacing="0" cellpadding="0" width="100%" role="presentation"><tr><td style="width:75%;vertical-align:bottom">'
	+ '<span class="fieldlabelgovt1bold">Employee\'s signature</span></td><td style="width:25%;vertical-align:bottom">'
	+ '<span class="fieldlabelgovt1bold">Date</span></td></tr></table>'
	+ '</td></tr></table>'
	+ '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" role="presentation">'
	+ '<tr><td class="plaintablecellborder2" style="vertical-align:top"><span class="fieldlabelgovt1bold">8&nbsp;&nbsp;</span>'
	+ '<span class="fieldlabelgovt1">Employer\'s name and address (Employer: Complete lines 8 and 10 only if sending to the IRS.)</span><br/><br/><br/></td>'
	+ '<td class="plaintablecellborder2" style="vertical-align:top" nowrap><span class="fieldlabelgovt1bold">9&nbsp;&nbsp;</span><span class="fieldlabelgovt1">Office code (optional)</span><br/><br/></td>'
	+ '<td class="plaintablecellborder2" style="vertical-align:top" nowrap><span class="fieldlabelgovt1bold">10&nbsp;&nbsp;</span><span class="fieldlabelgovt1">Employer identification number (EIN)</font>'
	+ '</td></tr></table>'
	+ '<table border="0" cellspacing="0" cellpadding="0" width="100%" role="presentation">'
	+ '<tr><td class="plaintablecell" style="vertical-align:top"><span class="fieldlabelgovtbold">For </span>'
	+ '<a href="javascript:;" onclick="parent.PrivacyLink();return false;" title="Open link to Privacy Act and Paperwork Reduction Act Notice">'
	+ '<span class="fieldlabelgovt">Privacy Act and Paperwork Reduction Act Notice,</span></a><span class="fieldlabelgovtbold"> see page 2 of paper form.</span></td>'
	+ '</tr></table><br/>'
	edmprint += edmnext
	edmform += edmnext + buttonRow
	edmnext	= '<input class="inputbox" type="hidden" name="dedcode" value="' + DedMastr[n].DedCode + '"></form>'				
	edmprint += edmnext
	toggleFrame("STATE", false);
	toggleFrame("MAIN", false);
	toggleFrame("W4FORM", true);	
	self.PRINTDOC.document.body.innerHTML = edmprint;
	self.PRINTDOC.stylePage();
	self.PRINTDOC.document.body.style.overflow = "visible";
	self.W4FORM.document.getElementById("paneHeader").innerHTML = getSeaPhrase("W4_FORM","ESS");
	self.W4FORM.document.getElementById("paneBody").innerHTML = edmform;
	self.W4FORM.stylePage();
	stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[self.W4FORM.getWinTitle()]));
	fitToScreen();	
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
		setRequiredField(AddlAmt, getSeaPhrase("INVALID_NO","ESS"));
		return;
	}
	thisform = obj;
	num = n;	
	if (styler && (styler.showLDS || styler.showInfor || styler.showInfor3) && typeof(window["DialogObject"]) == "function")
	{
		messageDialog = new window.DialogObject("/lawson/webappjs/", null, styler, true);
		messageDialog.pinned = true;
		messageDialog.getPhrase = function(phrase)
		{
			if (!phrase || (phrase.indexOf("<") != -1 && phrase.indexOf(">") != -1))	
				return phrase;	
			if (!userWnd && typeof(window["findAuthWnd"]) == "function")
				userWnd = findAuthWnd(true);	
			if (userWnd && userWnd.getSeaPhrase)
			{
				var retStr = userWnd.getSeaPhrase(phrase.toUpperCase(), "ESS");
				return (retStr != "") ? retStr : phrase;
			}
			else
				return phrase;           
		}
		messageDialog.initDialog = function(wnd)
		{
			wnd = wnd || window;				
			if (this.styler != null && this.styler.showInfor3)
			{
				this.setButtons([
				     {id: "ok", name: "ok", text: this.getPhrase("UPDATE"), click: null},
				     {id: "cancel", name: "cancel", text: this.getPhrase("CANCEL"), click: null}
				]);					
			}
		}		
		messageDialog.styleDialog = function(wnd)
		{		
			wnd = wnd || window;
			if (typeof(wnd["styler"]) == "undefined" || wnd.styler == null)
				wnd.stylerWnd = findStyler(true);
			if (!wnd.stylerWnd)
				return;
			if (this.styler == null)
			{
				this.styler = new wnd.stylerWnd.StylerBase();
				this.styler.showLDS = styler.showLDS;
				this.styler.showInfor = styler.showInfor;
				this.styler.showInfor3 = styler.showInfor3;
				if (this.pinned && typeof(parent.parent["SSORequest"]) != "undefined")
					this.styler.httpRequest = parent.parent.SSORequest;
				else if (typeof(wnd["SSORequest"]) != "undefined")
					this.styler.httpRequest = wnd.SSORequest;	
			}
			wnd.styler = this.styler;
			wnd.StylerBase = wnd.stylerWnd.StylerBase;
			wnd.StylerEMSS = wnd.stylerWnd.StylerEMSS;
			wnd.StylerBase.webappjsURL = "/lawson/webappjs";
			if (wnd.styler.showInfor3)
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor3/css/emss/infor.css");		
			else if (wnd.styler.showInfor)
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/emss/infor.css");
			else
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/lds/css/emss/lds.css");				
			if ((wnd.styler.showInfor || wnd.styler.showInfor3) && wnd.styler.textDir == "rtl") 
			{
				var htmlObjs = wnd.styler.getLikeElements(wnd, "html");
				for (var i=0; i<htmlObjs.length; i++)
				    htmlObjs[i].setAttribute("dir", wnd.styler.textDir);
				var subDir = (wnd.styler.showInfor3) ? "/infor3" : "/infor";
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + subDir + "/css/base/inforRTL.css");
				if (navigator.userAgent.indexOf("MSIE") >= 0)
				{
					var botLeft = wnd.document.getElementById("bottomLeft");
					var botRight = wnd.document.getElementById("bottomRight");
					botLeft.style.marginLeft = "0px";
					botLeft.style.marginRight = "3px";
					botRight.style.marginLeft = "0px";
					botRight.style.marginRight = "-3px";			
				}	
			}			
			wnd.styler.modifyDOM(wnd);	
		}		
		messageDialog.translationAry = new Array();
		messageDialog.translationAry["btnYes"] = "UPDATE";
		messageDialog.translationAry["btnCancel"] = "CANCEL";
		messageDialog.translateButton = function(btn, phrase, wnd)
		{	
			wnd = wnd || window;
			if (typeof(btn) == "string")
			{	
				if (typeof(this.translationAry) != "undefined" && this.translationAry)
					phrase = this.translationAry[btn];
				btn = wnd.document.getElementById(btn);		        
			}
			else if (typeof(btn) == "object")
			{
				if (typeof(this.translationAry) != "undefined" && this.translationAry)
					phrase = this.translationAry[btn.getAttribute("id")];	    	
			}
			if (!btn || !phrase)	
				return;
			btn.value = this.getPhrase(phrase);
			if (btn.innerText != null)	
				btn.innerText = btn.value;
			else if (btn.textContent != null)
				btn.textContent = btn.value;
			else
				btn.innerHTML = btn.value;
		}
		var page = '<div class="plaintablecell" style="width:400px">'
		+ getSeaPhrase("W4_PERJURY_STMT","ESS") + '<br/>'
		+ '<ul>'
		+ '<li>'+getSeaPhrase("AUTHORIZE_CHANGES","ESS")+'</li>'
		+ '<li>'+getSeaPhrase("CANCEL_CHANGES","ESS")+'</li>'
		+ '</ul>'
		+ '</div>';
		var msgReturn = messageDialog.messageBox(page, "okcancel", "none", window, false, "", PerjuryActionTaken);
		if (typeof(msgReturn) == "undefined")
			return;
		PerjuryActionTaken(msgReturn);		
	}
	else
	{
		var nextFunc = function()
		{
			var page = '<div class="plaintablecell">'
			+ getSeaPhrase("W4_PERJURY_STMT","ESS") + '<br/>'
			+ '<ul>'
			+ '<li>'+getSeaPhrase("AUTHORIZE_CHANGES","ESS")+'</li>'
			+ '<li>'+getSeaPhrase("CANCEL_CHANGES","ESS")+'</li>'
			+ '</ul>'
			+ '<div class="floatRight">'
			+ '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr>'
			if (obj.name == "w4form")
				page += '<td>'+uiButton(getSeaPhrase("UPDATE","ESS"), "parent.ProcessFedForm(parent.thisform,parent.num);return false","margin-left:5px")+'</td>'
			else
				page += '<td>'+uiButton(getSeaPhrase("UPDATE","ESS"), "parent.ProcessStateForm(parent.thisform,parent.num);return false","margin-left:5px")+'</td>'
			page += '<td>'+uiButton(getSeaPhrase("CANCEL","ESS"), "parent.clearW4Update(parent.thisform);return false","margin-left:5px")+'</td>'
			+ '</tr></table></div></div>'
			if (obj.name == "w4form")
				toggleFrame("W4FORM", false);
			else if (obj.name == "stform")
				toggleFrame("STATE", false);
			toggleFrame("VERIFY", true);			
			self.VERIFY.document.getElementById("paneHeader").innerHTML = getSeaPhrase("VERIFY_W4_CHANGES","ESS");
			self.VERIFY.document.getElementById("paneBody").innerHTML = page;
			self.VERIFY.stylePage();
			self.VERIFY.setLayerSizes();
			stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[self.VERIFY.getWinTitle()]));
		};
		startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
	}
	fitToScreen();
}

function PerjuryActionTaken(msgWin)
{
	switch (msgWin.returnValue)
	{
		case "yes": //update
		case "ok":
			if (thisform.name == "w4form")
				ProcessFedForm(thisform, num);
			else
				ProcessStateForm(thisform, num);
			break;
		case "cancel": //cancel
		case "close":
			break;	
	}
}

var Gobj;

function ProcessFedForm(obj, n)
{
	clearRequiredField(obj.addlamount);
	var MarStatus = self.W4FORM.document.getElementById("marstatus");
	clearRequiredField(MarStatus);
	if (obj.maritalstatus[0].checked == false && obj.maritalstatus[1].checked == false && obj.maritalstatus[2].checked == false) 
	{
		clearW4Update(obj);
		setRequiredField(MarStatus, getSeaPhrase("W4_7","ESS"), obj.maritalstatus[0]);
		return
	}
	if (NonSpace(obj.addlamount.value) == 0)
		obj.addlamount.value = "0";
	if (ValidNumber(obj.addlamount,9,2) == false) 
	{
		clearW4Update(obj);
		setRequiredField(obj.addlamount, getSeaPhrase("INVALID_NO","ESS"));
		return;
	}
	if (obj.exemptions.value == "")
		obj.exemptions.value = "0";
	if (obj.addlamount.value == "")
		obj.addlamount.value = "0";
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
  	&& ((parseInt(DedMastr[n].MaritalStatus,10) != MaritalCheck) || (parseInt(DedMastr[n].Exemptions,10) != ExemptsCheck)))
  	{
 		var warning = getSeaPhrase("TAX_EXEMPT_WARNING","ESS")+"\n\n"+getSeaPhrase("OK_TO_CONTINUE","ESS");
		if (!seaConfirm(warning,"",UpdateFedForm))
		{
			clearW4Update(obj);
			return;
		}
 	}
	UpdateFedForm();
}

function UpdateFedForm()
{
	Gobj = tmpObj;
	startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), CallPR13Fed);
}

function CallPR13Fed()
{
	var obj = Gobj;
	var object = new AGSObject(authUser.prodline, "PR13.1");
	object.event = "CHANGE"
	object.rtn = "MESSAGE";
	object.longNames = true;
	object.tds = false;
	object.func = "parent.DspMsg(true)";
	object.field = "FC=C"
	+ "&EDM-COMPANY=" + parseInt(authUser.company,10)
	+ "&EDM-EMPLOYEE=" + parseInt(authUser.employee,10)
	+ "&LINE-FC1=C"
//	+ "&EDM-DED-CODE1=" + escape(obj.dedcode.value)
	+ "&EDM-DED-CODE1=" + escape(DedMastr[tmpLn].DedCode)
	+ "&EDM-RES-CODE1=Y"
	+ "&EDM-EXEMPTIONS1=" + escape(obj.exemptions[idx].value)
	+ "&EDM-ADDL-AMOUNT1=" + escape(obj.addlamount.value)
	+ GetCheckedValue("&EDM-MARITAL-STATUS1=",tmpObj.maritalstatus)
	if (obj.exempt)
		object.field += "&EDM-TAX-EXEMPT-FLG1=" + escape(obj.exempt[obj.exempt.selectedIndex].value)
	if (tmpAppObj.getAppVersion().toString() >= "09.00.00")
    	object.field += "&EDM-USER-ID=W"+escape(authUser.employee)
	if (tmpObj.addlamount.value != "0")
		object.field += "&EDM-ADDL-TAX-CODE1=2"
	if (tmpObj.addlamount.value == "0" && eval(DedMastr[tmpLn].AddlAmount) != 0)
		object.field += "&EDM-ADDL-TAX-CODE1=0"
	object.field += "&WEB-UPDATE=Y"
//	+ "&PT-EDM-DED-CODE=" + escape(obj.dedcode.value,1)
	+ "&PT-EDM-DED-CODE=" + escape(DedMastr[tmpLn].DedCode,1)
	+ "&PT-EDM-DED-PRI=" + escape(DedMastr[tmpLn].DeductionPriority,1)
	updatetype = "EDM";
	AGS(object,"jsreturn");
}

function DspMsg(fedUpdate)
{
	var MarStatus;
	var W4Form;
	if (fedUpdate) 
	{
		W4Form = self.W4FORM.document.forms["w4form"];
		MarStatus = self.W4FORM.document.getElementById("marstatus");
	}
	else 
	{
		W4Form = self.STATE.document.forms["stform"];
		MarStatus = W4Form.maritalstatus;
	}
	clearRequiredField(MarStatus);
	stopProcessing();
	if (self.lawheader.gmsgnbr == 000) 
	{
		clearW4Update(W4Form);	
		var alertResponse = seaPageWnd.seaPageMessage(getSeaPhrase("UPDATE_COMPLETE","ESS"), "", "info", null, sendEmail, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
		if (typeof(alertResponse) == "undefined" || alertResponse == null)
		{	
			if (seaPageWnd.seaPageMessage == seaPageWnd.alert)
				sendEmail();
		}		
	}
	else
	{
		if (self.lawheader.gmsgnbr == 153)	
		{
			clearW4Update(W4Form);
			var focusFld = (fedUpdate) ? MarStatus[0] : MarStatus;
			setRequiredField(MarStatus, getSeaPhrase("INVALID_MAR_STATUS","ESS"), focusFld);
    	} 
		else
			seaAlert(self.lawheader.gmsg, null, null, "error");
	}
}

function DisplayModel(obj)
{
	var MarStatus = self.W4FORM.document.getElementById("marstatus");
	clearRequiredField(MarStatus);
	if (obj.maritalstatus[0].checked == false && obj.maritalstatus[1].checked == false && obj.maritalstatus[2].checked == false) 
	{
		setRequiredField(MarStatus, getSeaPhrase("W4_7","ESS"), obj.maritalstatus[0]);
		return
	}
	clearRequiredField(obj.addlamount);
	if (NonSpace(obj.addlamount.value) == 0)
		obj.addlamount.value = "0";
	if (ValidNumber(obj.addlamount,9,2) == false) 
	{
		setRequiredField(obj.addlamount, getSeaPhrase("W4_10","ESS"));
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
	toggleFrame("W4FORM", false);
	toggleFrame("PAYMODEL", true);		
	var param = "from=w4&exemptions="+escape(exemptions,1)+"&addlamount="+escape(addlamount,1)+"&maritalstatus="+escape(maritalstatus,1);	
	self.document.getElementById("PAYMODEL").src = "/lawson/xhrnet/paymodel.htm?" + param;
}

function backToMain(frame)
{
	var nextFunc = function()
	{
		toggleFrame(frame, false);
		toggleFrame("MAIN", true);
		stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[self.MAIN.getWinTitle()]));
	};
	startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function setValue(form)
{
	with (self.PRINTDOC.document.w4form) 
	{
		exemptions.selectedIndex = form.exemptions.selectedIndex;
		exemptions.options[exemptions.selectedIndex].value = form.exemptions.options[form.exemptions.selectedIndex].value;
		addlamount.value = form.addlamount.value;
	}
}

function setMaritalStatus(form, index)
{
	with (self.PRINTDOC.document.w4form)
	{
		maritalstatus[index].checked = true;
	}
}

function VerifyPrint()
{
	var AddlAmt = self.W4FORM.document.w4form.addlamount;
	clearRequiredField(AddlAmt);
	if (NonSpace(AddlAmt.value) && !ValidNumber(AddlAmt,9,2))
	{
		setRequiredField(AddlAmt, getSeaPhrase("INVALID_NO","ESS"));
		return;
	}
	self.PRINTDOC.focus();
	self.PRINTDOC.print();
}

function ViewStateForm(n)
{
	startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), function(){RenderStateForm(n);});	
}

function RenderStateForm(n)
{
	var IRSLockIn = (DedMastr[n].DfltTcaFlag != null && parseInt(DedMastr[n].DfltTcaFlag,10) == 9) ? true : false;
	var amt = ""
	if (DedMastr[n].AddlTaxCode.indexOf("2") == 1)
		amt = roundToDecimal(DedMastr[n].AddlAmount,2)
	if (NonSpace(amt) && String(amt).indexOf(".") == -1)
		amt += ".00"
	edmform = '<form name="stform">'
	+ '<table border="0" cellspacing="0" cellpadding="0" style="width:auto;margin-left:auto;margin-right:auto" role="presentation">'
	+ '<tr><td class="plaintablerowheader">'+uiRequiredFooter()+'</td><td>&nbsp;</td>'		
	+ '<tr><td class="plaintablerowheader"><label for="rescode">'+getSeaPhrase("W4_1","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap><select class="inputbox" id="rescode" name="rescode"'
	if (IRSLockIn)
		edmform += ' disabled'
	edmform += '>'+buildResdnSelect(n)+'</select></td></tr>'
	+ '<tr><td class="plaintablerowheader"><label for="maritalstatus">'+getSeaPhrase("W4_4","ESS")+'</label></td>'
	+ '<td class="plaintablecell" id="maritalstatusCell" nowrap><select class="inputbox" id="maritalstatus" name="maritalstatus"'
	if (IRSLockIn)
		edmform += ' disabled'
	edmform += '>'+BuildMaritalSelect(eval(DedMastr[n].MaritalStatus))+'</select>'+uiRequiredIcon()+'</td></tr>'
	+ '<tr><td class="plaintablerowheader"><label for="exemptions">'+getSeaPhrase("EXEMPTIONS","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap>'
	+ '<input class="inputbox" type="text" id="exemptions" name="exemptions" value="'+eval(DedMastr[n].Exemptions)+'" maxlength="5" size="5" onfocus="this.select()" onchange="parent.ValidateNonFedNumber(this,5,0)"'
	if (IRSLockIn)
		edmform += ' disabled'	
	edmform += '></td></tr>'
	+ '<tr><td class="plaintablerowheaderborderbottom"><label for="addlamount">'+getSeaPhrase("W4_6","ESS")+'</label></td>'
	+ '<td class="plaintablecell" nowrap>'
	+ '<input class="inputbox" type="text" id="addlamount" name="addlamount" value="'+amt+'" maxlength="10" size="10" onfocus="this.select()" onchange="parent.ValidateNonFedNumber(this,9,2)"'
	if (IRSLockIn)
		edmform += ' disabled'	
	edmform += '></td></tr>'
	if (IRSLockIn)
	{
		edmform += '<tr><td class="plaintablecell" colspan="2">'
		+ '<span class="fieldlabelgovtboldred">You are unable to change your withholdings due to a State Letter on file. Contact your Payroll department.</span></td></tr>'
	}		
	edmform += '<tr><td class="plaintablecell">&nbsp;</td><td class="plaintablecell">'
	if (!IRSLockIn)
		edmform += uiButton(getSeaPhrase("CONTINUE","ESS"),"parent.VerifyUpdate(this.form,"+n+");return false","margin-left:5px",null,'aria-haspopup="true"')	
	edmform += uiButton(getSeaPhrase("BACK","ESS"), "parent.RefreshDeductions();return false","margin-left:5px")
	+ '</td></tr></table>'
	+ '<input type="hidden" name="dedcode" value="'+DedMastr[n].DedCode+'">'
	+ '</form>'
	toggleFrame("MAIN", false);
	toggleFrame("W4FORM", false);
	toggleFrame("STATE", true);		
	self.STATE.document.getElementById("paneHeader").innerHTML = DedMastr[n].DeductionCodeDescription;
	self.STATE.document.getElementById("paneBody").innerHTML = edmform;
	self.STATE.stylePage();
	stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[self.STATE.getWinTitle()]));
	fitToScreen();	
}

function ProcessStateForm(obj, n)
{
	var MarStatus = self.STATE.document.getElementById("maritalstatusCell");
	clearRequiredField(MarStatus);
	clearRequiredField(obj.exemptions);
	clearRequiredField(obj.addlamount);
	if (obj.maritalstatus.selectedIndex == 0) 
	{
		clearW4Update(obj);
		setRequiredField(MarStatus, getSeaPhrase("W4_7","ESS"), obj.maritalstatus);
		return;
	}
	if (NonSpace(obj.exemptions.value) == 0)
		obj.exemptions.value = "0";
	if (ValidNumber(obj.exemptions,5,0) == false) 
	{
		clearW4Update(obj);
		setRequiredField(obj.exemptions, getSeaPhrase("INVALID_NO","ESS"));
		return;
	}
	if (NonSpace(obj.addlamount.value) == 0)
		obj.addlamount.value = "0";
	if (ValidNumber(obj.addlamount,9,2) == false) 
	{
		clearW4Update(obj);
		setRequiredField(obj.addlamount, getSeaPhrase("INVALID_NO","ESS"));
		return;
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
  	&& ((parseInt(DedMastr[n].MaritalStatus,10) != MaritalCheck) || (parseInt(DedMastr[n].Exemptions,10) != ExemptsCheck)))
  	{
 		var warning = getSeaPhrase("TAX_EXEMPT_WARNING","ESS")+"\n\n"+getSeaPhrase("OK_TO_CONTINUE","ESS");
		if (!seaConfirm(warning,"",UpdateStateForm))
			return;
	}
  	startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), UpdateStateForm);
}

function UpdateStateForm()
{
	startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), CallPR13State);
}

function CallPR13State()
{
	var object = new AGSObject(authUser.prodline, "PR13.1");
	object.event = "CHANGE";
	object.rtn = "MESSAGE";
	object.longNames = true;
	object.tds = false;
	object.debug = false;
	object.func = "parent.DspMsg(false)";
	object.field = "FC=C"
	+ "&EDM-COMPANY=" + parseInt(authUser.company,10)
	+ "&EDM-EMPLOYEE=" + parseInt(authUser.employee,10)
	+ "&LINE-FC1=C"
	+ "&EDM-DED-CODE1=" + escape(DedMastr[tmpLn].DedCode)
	//+ "&EDM-DED-CODE1=" + escape(obj.dedcode.value,1)
	+ "&EDM-EXEMPTIONS1=" + escape(tmpObj.exemptions.value,1)
	+ "&EDM-MARITAL-STATUS1=" + escape(tmpObj.maritalstatus[idx].value,1)
	+ "&EDM-RES-CODE1=" + tmpObj.rescode[idxRes].value
	if (tmpAppObj.getAppVersion().toString() >= "09.00.00")
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
	updatetype = "EDM";
	AGS(object,"jsreturn");
}

function sendEmail()
{
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.02.00")
	{
		if (emssObjInstance.emssObj.processFlowsEnabled)	
		{
			// Try to trigger the ProcessFlow.
			var techVersion = (iosHandler && iosHandler.getIOSVersionNumber() >= "09.00.00") ? ProcessFlowObject.TECHNOLOGY_900 : ProcessFlowObject.TECHNOLOGY_803;
			var httpRequest = (typeof(SSORequest) == "function") ? SSORequest : SEARequest;
			var pfObj = new ProcessFlowObject(window, techVersion, httpRequest, "EMSS");
			pfObj.setEncoding(authUser.encoding);
			pfObj.showErrors = false;
			var flowObj = pfObj.setFlow("EMSSTaxChg", Workflow.SERVICE_EVENT_TYPE, Workflow.ERP_SYSTEM, authUser.prodline, authUser.webuser, null, "");
			flowObj.addVariable("company", String(authUser.company));
			flowObj.addVariable("employee", String(authUser.employee));
			flowObj.addVariable("deduction", String(DedMastr[tmpLn].DedCode));
			flowObj.addVariable("oldResidentStatus", String(DedMastr[tmpLn].ResCodeDescription));
			flowObj.addVariable("oldMaritalStatus", String(DedMastr[tmpLn].MaritalStatusDescription));
			flowObj.addVariable("oldExemptions", String(DedMastr[tmpLn].Exemptions));
			flowObj.addVariable("oldAdditionalExempts", String(DedMastr[tmpLn].AddlExempts));
			flowObj.addVariable("oldAdditionalAmt", String(DedMastr[tmpLn].AddlAmount));
			flowObj.addVariable("emailFormat", String(emssObjInstance.emssObj.emailFormat));
			pfObj.triggerFlow();
		}
	}
	// Refresh the screen after the email is triggered so we still have the old values
	RefreshDeductions();
}

function clearW4Update(w4Form)
{
	toggleFrame("VERIFY", false);
	if (w4Form.name == "w4form")
		toggleFrame("W4FORM", true);
	else if (w4Form.name == "stform")
		toggleFrame("STATE", true);
}

function sortByAscProperty(obj1, obj2)
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

function sortByDscProperty(obj1, obj2)
{
	var name1 = obj1[sortProperty];
	var name2 = obj2[sortProperty];
	if (name1 > name2)
		return -1;
	else if (name1 < name2)
		return 1;
	else
		return 0;
}

function SortDeductions(property, dir)
{
	var nextFunc = function()
	{
		sortProperty = property;
		if (property != lastSortField)
			dir = "ascending";
		lastSortField = property;
		var sortFunc = (dir == "ascending") ? sortByAscProperty : sortByDscProperty;		
		DedMastr.sort(sortFunc);
		DisplayDeductions(true, property, dir);
	};
	startProcessing(getSeaPhrase("WAIT","ESS"), nextFunc);
}

function ValidateFedNumber(formObj,size,decimals)
{
	if (NonSpace(formObj.value) == 0)
		formObj.value = "0";
	if (!isNaN(formObj.value))
		formObj.value = parseFloat(formObj.value);
	clearRequiredField(self.W4FORM.document.forms["w4form"].addlamount);
	clearRequiredField(formObj);
	if (ValidNumber(formObj,size,decimals) == false)
		setRequiredField(formObj, getSeaPhrase("INVALID_NO","ESS"));
	setValue(formObj.form);
}

function ValidateNonFedNumber(formObj,size,decimals)
{
	if (NonSpace(formObj.value) == 0)
		formObj.value = "0";
	if (!isNaN(formObj.value))
		formObj.value = parseFloat(formObj.value);
	clearRequiredField(self.STATE.document.forms["stform"].maritalstatus);
	clearRequiredField(self.STATE.document.forms["stform"].exemptions);
	clearRequiredField(self.STATE.document.forms["stform"].addlamount);
	clearRequiredField(formObj);
	if (ValidNumber(formObj,size,decimals) == false)
		setRequiredField(formObj, getSeaPhrase("INVALID_NO","ESS"));
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
	);
}

function BuildMaritalSelect(status)
{
	var maritalselect = "";
	var status = parseInt(status,10);
	for (var i=0; i<MaritalStatusList.length; i++)
	{
        maritalselect += '<option value="'+i+'"';
		if (status == i)
			maritalselect += ' selected>';
		else
			maritalselect += '>';
		maritalselect += MaritalStatusList[i];
	}
	return maritalselect;
}

function DedMastrObject()
{
	this.DedCode = arguments[0];
	this.EffectDate = arguments[1];
	this.EndDate = arguments[2];
	this.ResCode = arguments[3];
	this.ResCodeDescription = arguments[4];
	this.MaritalStatus = arguments[5];
	this.MaritalStatusDescription = arguments[6];
	this.Exemptions = arguments[7];
	this.AddlAmount = arguments[8];
	this.DeductionCodeDescription = arguments[9];
	this.DeductionCodeTaxAuthType = arguments[10];
	this.AddlTaxCode = arguments[11];
	this.AddlRate = arguments[12];
	this.EmployeeLabelName1 = arguments[13];
	this.EmployeeFicaNbr = arguments[14];
	this.EmployeeAddr1 = arguments[15];
	this.EmployeeCity = arguments[16];
	this.EmployeeState = arguments[17];
	this.EmployeeZip = arguments[18];
	this.EmployeeWorkCountry = arguments[19];
	this.EmployeeWorkState = arguments[20];
	this.DeductionPriority = arguments[21];
	this.TaxExemptFlag = arguments[22];
	this.AddlExempts = arguments[23];
	this.DfltTcaFlag = (typeof(arguments[24]) != undefined) ? arguments[24] : null;
	this.EmployeeFirstName = arguments[25];
	this.EmployeeLastName = arguments[26];
	this.EmployeeAddr2 = arguments[27];
	this.EmployeeAddr3 = arguments[28];
	this.EmployeeAddr4 = arguments[29];
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
	var frameAry = new Array("MAIN", "W4FORM", "STATE", "PAYMODEL");
	var winObj = getWinSize();
	var winWidth = winObj[0];	
	var winHeight = winObj[1];
	document.getElementById("MAIN").style.width = winWidth + "px";
	document.getElementById("W4FORM").style.width = winWidth + "px";
	var contentWidth;
	var contentWidthBorder;
	var contentHeightBorder;
	var contentHeight;
	if (window.styler && window.styler.showInfor)
	{			
		contentWidth = winWidth - 10;
		contentWidthBorder = (navigator.appName.indexOf("Microsoft") >= 0) ? contentWidth + 5 : contentWidth + 2;
		contentHeight = winHeight - 65;
		contentHeightBorder = contentHeight + 30;		
	}
	else if (window.styler && (window.styler.showLDS || window.styler.showInfor3))
	{	
		contentWidth = winWidth - 20;
		contentWidthBorder = (window.styler.showInfor3) ? contentWidth + 7 : contentWidth + 17;	
		contentHeight = winHeight - 75;	
		contentHeightBorder = contentHeight + 30;	
	}
	else
	{
		contentWidth = winWidth - 10;
		contentWidthBorder = contentWidth;
		contentHeight = winHeight - 60;
		contentHeightBorder = contentHeight + 24;			
	}
	for (var i=0; i<frameAry.length; i++)
	{
		var frmNm = frameAry[i];
		var frmElm = document.getElementById(frmNm);
		frmElm.style.width = winWidth + "px";
		frmElm.style.height = winHeight + "px";
		try
		{
			if (window[frmNm].onresize && window[frmNm].onresize.toString().indexOf("setLayerSizes") >= 0)
				window[frmNm].onresize = null;		
		}
		catch(e) {}		
		try
		{
			window[frmNm].document.getElementById("paneBorder").style.width = contentWidthBorder + "px";
			window[frmNm].document.getElementById("paneBodyBorder").style.width = contentWidth + "px";
			window[frmNm].document.getElementById("paneBorder").style.height = contentHeightBorder + "px";
			window[frmNm].document.getElementById("paneBodyBorder").style.height = contentHeight + "px";
			window[frmNm].document.getElementById("paneBody").style.width = contentWidth + "px";
			window[frmNm].document.getElementById("paneBody").style.height = contentHeight + "px";
		}
		catch(e) {}
	}
	try
	{
		self.MAIN.document.getElementById("emdedmastrTbl").style.width = "100%";
	}
	catch(e) {}
}
</script>
</head>
<body style="width:100%;height:100%;overflow:hidden" onload="fitToScreen();GetWebuser()" onresize="fitToScreen()">
	<iframe id="MAIN" name="MAIN" title="Main Content" level="2" tabindex="0" style="visibility:hidden;position:absolute;top:0px;left:0px;width:100%;height:464px" marginwidth="0" marginheight="0" frameborder="no" scrolling="no" src="/lawson/xhrnet/ui/headerpane.htm"></iframe>
	<iframe id="W4FORM" name="W4FORM" title="Content" level="3" tabindex="0" style="visibility:hidden;position:absolute;top:0px;left:0px;width:100%;height:100%" marginwidth="0" marginheight="0" frameborder="no" scrolling="no" src="/lawson/xhrnet/ui/headerpanehelp.htm"></iframe>
	<iframe id="VERIFY" name="VERIFY" title="Content" level="3" tabindex="0" style="visibility:hidden;position:absolute;top:0px;left:0px;width:430px;height:264px" marginwidth="0" marginheight="0" frameborder="no" scrolling="no" src="/lawson/xhrnet/ui/headerpane.htm"></iframe>
	<iframe id="STATE" name="STATE" title="Content" level="3" tabindex="0" style="visibility:hidden;position:absolute;top:0px;left:0px;width:100%;height:100%" marginwidth="0" marginheight="0" frameborder="no" scrolling="no" src="/lawson/xhrnet/ui/headerpane.htm"></iframe>
	<iframe id="PAYMODEL" name="PAYMODEL" title="Secondary Content" level="2" tabindex="0" style="visibility:hidden;position:absolute;top:0px;left:0px;width:100%;height:464px" src="/lawson/xhrnet/dot.htm" marginwidth="0" marginheight="0" frameborder="no" scrolling="no"></iframe>
	<iframe id="PRINTDOC" name="PRINTDOC" title="Empty" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/ui/plain.htm" marginwidth="0" marginheight="0" frameborder="no"></iframe>	
	<iframe id="HIDDEN" name="HIDDEN" title="Empty" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/dot.htm"></iframe>
	<iframe name="jsreturn" title="Empty" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/dot.htm"></iframe>
	<iframe name="lawheader" title="Empty" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/esslawheader.htm"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@10.00.05.00.27 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/w4/w4.htm,v 1.17.2.111.2.1 2014/08/05 05:04:19 kevinct Exp $ -->
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