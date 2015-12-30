<html>
<head>
<title>Current Benefits</title>
<meta name="viewport" content="width=device-width" />
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/webappjs/transaction.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"></script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script src="/lawson/webappjs/javascript/objects/ActivityDialog.js"></script>
<script src="/lawson/webappjs/javascript/objects/OpaqueCover.js"></script>
<script src="/lawson/webappjs/javascript/objects/Dialog.js"></script>
<script>
var currentBens = new Array();
var dependentsList = new Array();
var benefitsHtml;
var sortProperty;
var fromDBFile = false;

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

function OpenCurrentBenefits()
{
	authenticate("frameNm='FRAME1'|funcNm='InitBenefits()'|desiredEdit='EM'");
}

function InitBenefits()
{
	stylePage();
	setLayerSizes();
	document.title = getSeaPhrase("CURBEN_22","BEN");
	setTaskHeader("header",getSeaPhrase("CURBEN_22","BEN"),"Benefits");
	currentBens = new Array();
	GetBenefits("I");
}

function GetBenefits(fc)
{
	//first try to get benefits from BS10
	self.lawheader.count = 0; 
	self.lawheader.updatetype = "BS10";
	var agsObj = new AGSObject(authUser.prodline,"BS10.1");
	agsObj.event = "ADD";
	agsObj.debug = false;
	agsObj.rtn = "DATA";
	agsObj.longNames = true;
	agsObj.tds = false;
	agsObj.field = "FC=" + fc
	+ "&BEN-COMPANY=" + escape(parseInt(authUser.company,10))
	+ "&BEN-EMPLOYEE=" + escape(parseInt(authUser.employee,10))
	+ "&BAE-CURRENT-DATE=" + escape(authUser.date)
	+ "&BAE-NEW-DATE="
	+ "&BAE-COST-DIVISOR="
	+ "&BAE-RULE-TYPE=C"
	+ "&BFS-FAMILY-STATUS="
	if (fc == "%2B") 
	{
		var BS10 = self.lawheader.BS10;
		agsObj.field += "&PT-COMPANY=" + escape(BS10.PT_COMPANY)
		+ "&PT-EMPLOYEE=" + escape(BS10.PT_EMPLOYEE)
		+ "&PT-PROCESS-LEVEL=" + escape(BS10.PT_PROCESS_LEVEL,1).toString().replace("+","%2B")
		+ "&PT-FAMILY-STATUS=" + escape(BS10.PT_FAMILY_STATUS)
		+ "&PT-GROUP-NAME=" + escape(BS10.PT_GROUP_NAME,1).toString().replace("+","%2B")
		+ "&PT-PROCESS-ORDER=" + escape(BS10.PT_PROCESS_ORDER)
		+ "&PT-PLN-PLAN-TYPE=" + escape(BS10.PT_PLAN_TYPE,1).toString().replace("+","%2B")
		+ "&PT-PLN-PLAN-CODE=" + escape(BS10.PT_PLAN_CODE,1).toString().replace("+","%2B")
		+ "&PT-BEN-START-DATE=" + escape(BS10.PT_BEN_START_DATE)
		+ "&PT-FIELDS-SET=Y";
	}
	agsObj.func = "parent.CheckBenefits()";
	self.lawheader.initBS10();
	AGS(agsObj,"FRAME1");
}

function CheckBenefits()
{
	var msg = self.lawheader.gmsg;
	var msgNbr = Number(self.lawheader.gmsgnbr);
	//if rule type "C" does not exist, get employee's benefits from BENEFIT file
	if (msgNbr == 126)
	{
		GetBenefitsFromDBFile();
		return;
	}
	else if (msgNbr == 105)
	{
		//no benefits found, continue
		ProcessBenefits();
		return;
	}
	else if (msgNbr != 0)
	{
		seaAlert(msg);	
		return;
	}
	
	//if more records exist perform a page down
	if (msg.toUpperCase().indexOf("PAGEDOWN")!=-1) 
	{
		GetBenefits("%2B");
		return;
	}		
	
	ProcessBenefits();
}

function GetBenefitsFromDBFile()
{
	fromDBFile = true;
	currentBens = new Array();

	var dmeObj   	= new DMEObject(authUser.prodline,"BENEFIT");
	dmeObj.out   	= "JAVASCRIPT";
	dmeObj.index 	= "BENSET4";

	dmeObj.field	= "plan-type,xlt;start-date;plan-code;stop-date;plan-option;"
	+ "cov-option;emp-pre-cont;emp-aft-cont;comp-cont;cover-amt;bond-ded-amt;dep-cover-amt;"
	+ "pct-amt-flag;multiple;cmp-flx-cont;bncovopt.cov-desc;plan.cmp-ded-code-p;"
	+ "plan.waive-flag;plan.desc;plan-type;comp-match;employee.pay-frequency;mtch-up-to;dependents.dependent;"
	+ "employee.label-name-1"

   	dmeObj.max 		= "600";
   	dmeObj.otmmax	= "1";
	dmeObj.key   	= parseInt(authUser.company,10) + "=" + parseInt(authUser.employee,10);
  	dmeObj.cond		= "CURRENT";
	dmeObj.func		= "GetMoreBenefitsFromDBFile()";
	DME(dmeObj,"FRAME1");
}

function GetMoreBenefitsFromDBFile()
{
	currentBens = currentBens.concat(self.FRAME1.record);

	if (self.FRAME1.Next)
	{
		self.FRAME1.location.replace(self.FRAME1.Next);
	}
	else
	{
		ProcessBenefits();
	}
}

function ProcessBenefits()
{
	sortProperty = "plan_type_xlt";
	currentBens.sort(sortByProperty);

	var depBensExist = false;
	var i = 0;
	while (!depBensExist && (i < currentBens.length))
	{
		if (GetNbr(currentBens[i].dependents_dependent) > 0)
			depBensExist = true;	
		i++;
	}

	if (depBensExist)
		GetDependents();
	else		
		DspCurrentBenefits();
}

function GetDependents()
{
	dependentsList = new Array();
	var dmeObj = new DMEObject(authUser.prodline, "HRDEPBEN");
	dmeObj.out = "JAVASCRIPT";
	dmeObj.field = "dependent;plan-type;plan-code;emp-start;dependent.label-name-1;start-date;stop-date";
	dmeObj.otmmax = "1";
	dmeObj.max 	= "50";
	dmeObj.key  = parseInt(authUser.company,10) + "=" + parseInt(authUser.employee,10);
	dmeObj.func = "GetDependents_Finished()";
	DME(dmeObj,"FRAME1");
}

function GetDependents_Finished()
{
	dependentsList = dependentsList.concat(self.FRAME1.record);
	if (self.FRAME1.Next)
		self.FRAME1.location.replace(self.FRAME1.Next);
	else
		DspCurrentBenefits();	
}

function DspCurrentBenefits(onsort,property)
{
	var printButtonHtml = '';
// MOD BY BILAL  - Prior Customizations
//ISH 2008 Modification
   //CGL 2010 Text Updates
	var customMsg = "<table><tr align=CENTER><td>Here is a list of some of your current benefits.  It shows the benefit and the cost, including St. Luke’s cost.  In addition to the following benefits, St. Luke’s also pays 100% of the following benefits: Paid Time Off, Extended Sick Leave, long term disability, jury duty leave, bereavement leave, professional liability insurance, travel insurance, workers compensation, and unemployment.</td></tr></table>"
   //CGL End
//ISH End	
// END OF MOD

	var costDivisor = self.lawheader.BS10.BAE_COST_DIVISOR;
	if (!costDivisor)
		costDivisor = "P";
	
	var currentDate = self.lawheader.BS10.BAE_CURRENT_DATE;
	if (!currentDate)
		currentDate = authUser.date;	
	
// MOD BY BILAL
//	benefitsHtml = '<table id="currbenTbl" class="plaintableborder" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list">\n'
	benefitsHtml = customMsg + '<table id="currbenTbl" class="plaintableborder" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list">\n'
// END OF MOD
	+ '<tr>\n'
	+ '<th class="plaintableheaderborder" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	+ '<a class="columnsort" href="" onclick="parent.SortBenefits(\'plan_type_xlt\');return false"'
	+ ' onmouseover="window.status=\'\';return true" onmouseout="window.status=\'\';return true">'+getSeaPhrase("CURBEN_23","BEN")+'</a></th>\n'
	+ '<th class="plaintableheaderborder" style="text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
	+ '<a class="columnsort" href="" onclick="parent.SortBenefits(\'plan_desc\');return false"'
	+ ' onmouseover="window.status=\'\';return true" onmouseout="window.status=\' \';return true">'+getSeaPhrase("PLAN","BEN")+'</a></th>\n'
	+ '<th class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("COVERAGE","BEN")+'</th>\n'
	+ '<th class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("CURBEN_24","BEN")+'</th>\n'
	+ '<th class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("CURBEN_25","BEN")+'</th>\n'
	+ '<th class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("CO_COST","BEN")+'</th>\n'
	+ '</tr>\n'

	for (var i=0; i<currentBens.length; i++)
	{
		benefitsHtml += '<tr>\n'

		// Plan Type column data:
		benefitsHtml += '<td class="plaintablecellborder" style="text-align:left" nowrap>'
		+ ((currentBens[i].plan_type_xlt)?currentBens[i].plan_type_xlt:'&nbsp;') + '</td>\n'

		// Plan Description column data:
		benefitsHtml += '<td class="plaintablecellborder" style="text-align:left" nowrap>'
		+ ((currentBens[i].plan_desc)?currentBens[i].plan_desc:'&nbsp;') + '</td>\n'

		// Coverage column data:
		benefitsHtml += '<td class="plaintablecellborder" style="text-align:right" nowrap>'
		benefitsHtml += getCoverage(currentBens[i])
		benefitsHtml += '</td>\n'

		// My Pre-Tax column data:
		benefitsHtml += '<td class="plaintablecellborder" style="text-align:right" nowrap>'
		benefitsHtml += getPreTaxCost(currentBens[i], costDivisor)
		benefitsHtml += '</td>\n'

		// My After-Tax Cost column data:
		benefitsHtml += '<td class="plaintablecellborder" style="text-align:right" nowrap>'
		benefitsHtml += getAfterTaxCost(currentBens[i])
		benefitsHtml += '</td>\n'

		// Company Cost column data:
		benefitsHtml += '<td class="plaintablecellborder" style="text-align:right">'
		benefitsHtml += getCompanyCost(currentBens[i])
	 	benefitsHtml += '</td>\n</tr>\n'
		
		if (GetNbr(currentBens[i].dependents_dependent) > 0)
		{
			var lineBreak = false;
			benefitsHtml += '<tr>\n<td class="plaintablecellborder" colspan="6" nowrap>\n'
			for (var x=0; x<dependentsList.length; x++)
			{
				if (currentBens[i].plan_type == dependentsList[x].plan_type && currentBens[i].plan_code == dependentsList[x].plan_code && dependentsList[x].dependent_label_name_1 
				&& dateInCompareFormat(currentBens[i].start_date) == dateInCompareFormat(dependentsList[x].emp_start) 
				&& dateInCompareFormat(currentDate) >= dateInCompareFormat(dependentsList[x].start_date) 
				&& (dependentsList[x].stop_date == '' || dateInCompareFormat(currentDate) <= dateInCompareFormat(dependentsList[x].stop_date)))
				{
					if(lineBreak)
						benefitsHtml += '<br/>'
					benefitsHtml += ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ dependentsList[x].dependent_label_name_1
					lineBreak = true;
				}
			}
		}
	}

	benefitsHtml += '</table>'

    if (window.print && currentBens.length > 0)
    {
    	// change right position from 5% to 5px
    	printButtonHtml += '<br><div style="position:absolute;right:5px">';
    	printButtonHtml += uiButton(getSeaPhrase("PRINT","BEN"),"parent.printForm();return false",false,"printbtn");
    	printButtonHtml += '</div><br>&nbsp;';
	}

	try
	{
		self.MAIN.document.getElementById("paneHeader").innerHTML = getSeaPhrase("PLANS_AND_COVERAGE","BEN");

		if (currentBens.length == 0)
		{
			self.MAIN.document.getElementById("paneBody").innerHTML = '<div class="fieldlabelbold" style="text-align:left">'+getSeaPhrase("CURBEN_28","BEN")+'</div>';
		}
		else
		{
			self.MAIN.document.getElementById("paneBody").innerHTML = benefitsHtml + printButtonHtml;
		}
	}
	catch(e) {}

	self.MAIN.stylePage();

	if (!onsort)
	{
		self.MAIN.setLayerSizes(true);
		document.getElementById("MAIN").style.visibility = "visible";
	}
	else
	{
		self.MAIN.styleSortArrow("currbenTbl", property);
	}
}

function SortBenefits(property)
{
	sortProperty = property;
	currentBens.sort(sortByProperty);
	DspCurrentBenefits(true,property);
}

function GetNbr(str)
{
	if (typeof(str) == "number")
	{
		return str;
	}
	else if (str.length == 0)
	{
		return 0;
	}
	len = str.length-1;
	if (str.charAt(len) == "-")
	{
		n = Number(str.substring(0,len));
		n = 0-n;
		return n;
	}
	else
	{
		return Number(str);
	}
}

function payFreq(paycode)
{
	switch (paycode)
	{
		case "1": return 52;
		case "2": return 26;
		case "3": return 24;
		case "4": return 12;
		default:  return 1;
	}
}

function getCoverage(bnPlan)
{
	var covStr = '&nbsp;';
	if ((bnPlan.plan_type == "HL" || bnPlan.plan_type == "DN") 
	&& (bnPlan.plan_waive_flag == "Y"))
	{
		covStr = (getSeaPhrase("CURBEN_26","BEN")) ? getSeaPhrase("CURBEN_26","BEN") : '&nbsp;';
	}
	else
	{
		if (fromDBFile)
		{
			if ((bnPlan.plan_type == "DI" || bnPlan.plan_type == "DL" || bnPlan.plan_type == "EL")
			&& (GetNbr(bnPlan.cover_amt) != 0))
			{
				covStr = (bnPlan.cover_amt) ? formatComma(roundToDecimal(GetNbr(bnPlan.cover_amt),2)) : '&nbsp;';
			}
			else if ((bnPlan.plan_type == "DN" || bnPlan.plan_type == "HL") && (GetNbr(bnPlan.cov_option) != 0))
			{
				covStr = (bnPlan.bncovopt_cov_desc) ? bnPlan.bncovopt_cov_desc : '&nbsp;';
			}
			else if (bnPlan.plan_type == "VA")
			{
				covStr = (bnPlan.multiple) ? formatComma(roundToDecimal(GetNbr(bnPlan.multiple),2)) : '&nbsp;';
			}
		}	
		else
		{
			var recType = Number(bnPlan.record_type);
			switch (recType)
			{
				case 1:
					covStr = bnPlan.bncovopt_cov_desc + '&nbsp;';
					break;
				case 2:
					var covType = bnPlan.life_add_flg;
					if (covType == "E")
					{
						covStr = getSeaPhrase("EMPLOYEE","BEN") + '&nbsp;&nbsp;' + formatComma(roundToDecimal(GetNbr(bnPlan.cover_amt),2));
					}
					else if (covType == "S")
					{
						covStr = getSeaPhrase("SPOUSE","BEN") + '&nbsp;&nbsp;' + formatComma(roundToDecimal(GetNbr(bnPlan.cover_amt),2));
					}
					else if (covType == "D")
					{
						covStr = getSeaPhrase("DEPENDENT","BEN") + '&nbsp;&nbsp;' + formatComma(roundToDecimal(GetNbr(bnPlan.cover_amt),2));
					}
					else if (covType == "B")
					{
						covStr = '<div class="plaintablecell" style="padding-right:0px">' + getSeaPhrase("SPOUSE","BEN") + '&nbsp;&nbsp;' + formatComma(roundToDecimal(GetNbr(bnPlan.cover_amt),2)) + '</div>';
						covStr += '<div class="plaintablecell" style="padding-right:0px">' + getSeaPhrase("DEPENDENT","BEN") + '&nbsp;&nbsp;' + formatComma(roundToDecimal(GetNbr(bnPlan.dep_cover_amt),2)) + '</div>';
					}
					else if (covType == "")
					{
						covStr = '&nbsp;' + formatComma(roundToDecimal(GetNbr(bnPlan.cover_amt),2));
					}
					break;
				case 3:
				case 4:
				case 13:
					covStr = '&nbsp;' + formatComma(roundToDecimal(GetNbr(bnPlan.cover_amt),2));
					break;
				case 5:
					covStr = '&nbsp;' + formatComma(roundToDecimal(bnPlan.salary_pct,2));
					if (GetNbr(bnPlan.salary_pct) != 0)
						covStr += getSeaPhrase("PER","BEN");
					break;
				case 6:
				case 8:
				case 9:			
					if (bnPlan.pct_amt_flag == "P")
					{
						if (GetNbr(bnPlan.annual_amt) != 0)
							covStr += '&nbsp;' + formatComma(roundToDecimal(bnPlan.annual_amt,2)) + ' ' + getSeaPhrase("PERCENT_OF_TOTAL","BEN");
					}
					else
					{
						if (GetNbr(bnPlan.annual_amt) != 0)
							covStr += '&nbsp;' + formatComma(roundToDecimal(bnPlan.annual_amt,2)) + ' ' + getSeaPhrase("PER_YEAR","BEN");					
					}
					break;		
				case 7:
					if (GetNbr(bnPlan.nbr_hours) != 0)
						covStr += formatComma(roundToDecimal(bnPlan.nbr_hours,2)) + ' ' + getSeaPhrase("HOURS","BEN");
					break;
				case 10:
				case 11:
				case 12:
					covStr = '&nbsp;';
					break;
			}			
		}
	}
	return covStr;
}

function getPreTaxCost(bnPlan, costDivisor)
{
	var pfreq = (fromDBFile) ? payFreq(bnPlan.employee_pay_frequency) : 1;
	var pretotal = roundToDecimal(GetNbr(bnPlan.cmp_flx_cont) + GetNbr(bnPlan.emp_pre_cont),2);
	var ptStr = '&nbsp;';
	if (GetNbr(bnPlan.cmp_flx_cont) < 0)
	{
		if (bnPlan.pct_amt_flag == "P")
		{
			ptStr = formatComma(roundToDecimal(GetNbr(bnPlan.cmp_flx_cont),2));
			if (GetNbr(bnPlan.cmp_flx_cont) != 0)
				ptStr += getSeaPhrase("PER","BEN");
		}
		else
		{
			ptStr = formatComma(roundToDecimal(GetNbr(bnPlan.cmp_flx_cont)/pfreq,2));
		}
	}
	else if (GetNbr(pretotal) != 0)
	{
		if (bnPlan.pct_amt_flag == "P")
		{
			ptStr = pretotal + getSeaPhrase("PER","BEN");
		}
		else
		{
			if (bnPlan.plan_type == "RS" || bnPlan.plan_type == "SP")
			{
				if (fromDBFile)
				{
				 	ptStr = formatComma(roundToDecimal(GetNbr(bnPlan.bond_ded_amt),2));			
				}
				else
				{
					if (costDivisor == "P" && GetNbr(bnPlan.bond_ded_amt) != 0)
					{
						ptStr = formatComma(roundToDecimal(GetNbr(bnPlan.bond_ded_amt),2));	
					} 
					else if ((costDivisor == "S" || costDivisor == "M") && GetNbr(bnPlan.bond_ded_amt) != 0 
					&& GetNbr(bnPlan.annual_amt) != 0 && (typeof(bnPlan.remain_cycles) != "undefined" && GetNbr(bnPlan.remain_cycles) != 0))
					{
					 	ptStr = formatComma(roundToDecimal(GetNbr(bnPlan.annual_amt)/GetNbr(bnPlan.remain_cycles),2));
					}	
					else
					{
						ptStr = formatComma(roundToDecimal(pretotal/pfreq,2));
					}
				}
			}	
			else
			{
				ptStr = formatComma(roundToDecimal(pretotal/pfreq,2));	
			}	
		}
	}
	return ptStr;
}

function getAfterTaxCost(bnPlan)
{
	var pfreq = (fromDBFile) ? payFreq(bnPlan.employee_pay_frequency) : 1;
	var atStr = '&nbsp;';
	if (GetNbr(bnPlan.emp_aft_cont) != 0)
	{
		if (bnPlan.pct_amt_flag == "P")
		{
			atStr = formatComma(roundToDecimal(bnPlan.emp_aft_cont,2));
			if (GetNbr(bnPlan.emp_aft_cont) != 0)
				atStr += getSeaPhrase("PER","BEN");
		}
		else
		{
		 	atStr = formatComma(roundToDecimal(bnPlan.emp_aft_cont/pfreq,2));
		}
	}
	return atStr;
}

function getCompanyCost(bnPlan)
{
	var pfreq = (fromDBFile) ? payFreq(bnPlan.employee_pay_frequency) : 1;
	var cStr = '&nbsp;';
	if ((GetNbr(bnPlan.comp_cont) != 0) && (GetNbr(bnPlan.comp_match) != 0))
	{
		cStr = formatComma(roundToDecimal(bnPlan.comp_match,2)) + getSeaPhrase("PER","BEN");		
		if (GetNbr(bnPlan.mtch_up_to) != 0)
		{
			cStr += ' ' + getSeaPhrase("CURBEN_33","BEN") + ' ' 
			+ formatComma(roundToDecimal(bnPlan.mtch_up_to,2)) 
			+ getSeaPhrase("CURBEN_34","BEN");
		}
		cStr += '<br/>'+ getSeaPhrase("CURBEN_27","BEN")
		+ ' ' + formatComma(roundToDecimal(bnPlan.comp_cont,2)) + ' ' + getSeaPhrase("PER_YEAR","BEN");
	}
	else if (GetNbr(bnPlan.comp_match) != 0)
	{
		cStr = formatComma(roundToDecimal(bnPlan.comp_match,2)) + getSeaPhrase("PER","BEN");
	}
	else if (GetNbr(bnPlan.comp_cont) != 0)
	{
		if (bnPlan.pct_amt_flag == "P" || bnPlan.plan_cmp_ded_code_p != "")
		{
			cStr = formatComma(roundToDecimal(bnPlan.comp_cont,2)) + getSeaPhrase("PER","BEN");
		}
		else
		{
			cStr = formatComma(roundToDecimal(bnPlan.comp_cont/pfreq,2));
		}
	}
	return cStr;
}

function printForm()
{
	var empName = (currentBens.length) ? currentBens[0].employee_label_name_1 : authUser.name;
	var headerHtml = '<table>'	
		+ '<tr>'
		+ '<td class="plaintablecell"><span class="dialoglabel" style="padding:0px;margin:0px">' + getSeaPhrase("EMPLOYEE_NAME","ESS") + ':</span></td>'
		+ '<td class="plaintablecell">' + empName + '</td>'
		+ '</tr>'	
		+ '<tr>'
		+ '<td class="plaintablecell"><span class="dialoglabel" style="padding:0px;margin:0px">' + getSeaPhrase("EMPLOYEE_NUMBER","ESS") + ':</span></td>'
		+ '<td class="plaintablecell">' + authUser.employee + '</td>'
		+ '</tr>'					
		+ '</table><div style="height:20px">&nbsp;</div>';
	
    self.printframe.document.title = getSeaPhrase("PLANS_AND_COVERAGE","BEN");
	self.printframe.document.body.innerHTML = headerHtml + benefitsHtml;
	self.printframe.stylePage();

	try
	{
		self.printframe.document.getElementById("currbenTbl").style.width = "650px";
	}
	catch(e)
	{}
	self.printframe.focus();
	self.printframe.print();
}

function dateInCompareFormat(fldval)
{
	if (fldval == "" || typeof(fldval) == "number" || fldval.indexOf(authUser.date_separator) == -1)
	{
		return fldval;
	}	
	try 
	{
		return formjsDate(fldval);
	}
	catch(e) 
	{
		return fldval;
	}
}
</script>
<!-- MOD BY BILAL  - Prior Customizations  -->
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-395426-5");
pageTracker._trackPageview();
} catch(err) {}</script>
<!-- END OF MOD -->
</head>
<body onload="OpenCurrentBenefits()">
	<iframe id="header" name="header" style="visibility:hidden;position:absolute;height:32px;width:803px;left:0px;top:0px" src="/lawson/xhrnet/ui/header.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="MAIN" name="MAIN" style="visibility:hidden;position:absolute;left:0%;height:464px;width:768px;top:32px" src="/lawson/xhrnet/ui/headerpane.htm" marginwidth="0" marginheight="0" frameborder="no" scrolling="auto"></iframe>
	<iframe id="FRAME1" name="FRAME1" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/dot.htm" marginwidth="0" marginheight="0" frameborder="no" scrolling="no"></iframe>
	<iframe id="printframe" name="printframe" src="/lawson/xhrnet/ui/pane.htm" style="visibility:visible;height:1px;width:800px" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="lawheader" name="lawheader" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/benefitslawheader.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@(201111) 09.00.01.06.09 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/currentbenefits.htm,v 1.9.2.32.4.1 2011/11/16 06:18:50 juanms Exp $ -->
