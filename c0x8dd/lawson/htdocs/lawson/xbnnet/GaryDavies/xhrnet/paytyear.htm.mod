<!--
// JRZ 3/13/10 Making viewing pay stubs stand out more and moving print buttons
// JRZ 9/30/08 Adding check type not J to query to avoid manual adjustments
// JRZ 9/5/08 Changing wording of Auto Deposit Total to Direct Deposit Total
// JRZ 9/3/08 Don't display SSN
// JRZ 8/26/08 adding print button to bottom of paystub list of payments with blue diamonds for detail
// JRZ 8/26/08 adding Time Accrual to paystub
// JRZ 8/26/08 Adding print button to paystub
// JRZ 8/26/08 Only showing the last 4 digits of the direct deposit account number
// JRZ 8/26/08 adding function to only display last digits of account number for direct deposit
-->
<html>
<head>
<title>Pay Checks</title>
<meta name="viewport" content="width=device-width" />
<meta http-equiv="Pragma" content="No-Cache">
<script src="/lawson/webappjs/common.js"></script>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script>
//NOTE: The FUTUREPAYMTS and STARTDATE settings have been moved to the xhrnet/xml/config/emss_config.xml file.
var logoDir = "/lawson/xhrnet/images/logos/";
//var logoDir = "/lawson/images/logos/";		// MOD BY BILAL 
var CompInfo = new Object();
var Payment = new Array();
var Payroll = new Array();
var Deductions = new Array();
var Earnings = new Array();
var YTDPayment = new Array();
var YTDPayroll = new Array();
var YTDDeduct = new Array();
var YTDDeductions = new Array();
var YTDEarnings = new Array();
var ytdIdList = new Array();
var ACHAccounts = new Array();
var ACHFieldSize = new Array();
var CompLogo = new Image();
var	BankLogo = new Image();
var YYYYMMDD1 = ymdtoday;
var YYYYMMDD2 = ymdtoday;
var EarnedHours = 0;
var EarnedAmount = 0;
var TaxableWages = 0;
var PreTaxDeductions = 0;
var AfterTaxDeductions = 0;
var AddedToNetPay = 0;
var CompanyTaxes = 0;
var CompanyDeductions = 0;
var NonTaxableRemuneration = 0;
var NonTaxableRemunerationHours = 0;
var YTDNonTaxableRemuneration = 0;
var YTDPreTaxDeductions = 0;
var	YTDGross = 0;
var YTDNet = 0;
var YTDNonCash = 0;
var Gross = 0;
var GrossHours = 0;
var NonCash = 0;
var AutoDeposit = 0;
var achCheckYear = "";
var lastPaySumGrp = " ";
var lastDedCode = " ";
var PaymentPeriod = "LASTYEAR";
var employee;
var desiredYear = "";
var parentTask = "";
var fromTask = (window.location.search)?unescape(window.location.search):"";
var updatedACHBanks = new Array();
var dmeNbrKeys = 50;
var clientBrowser = new SEABrowser();
var HourlyRateStates = "CA,NY";
var CalcHourlyRate = "NO";
var appObj;

if (fromTask)
{
	desiredYear = getVarFromString("year",fromTask);
	parentTask = getVarFromString("from",fromTask);
}

function GetWebuser()
{
   authenticate("frameNm='dmedata'|funcNm='GetCompany()'|desiredEdit='EM'");
}

function GetCompany()
{
	stylePage();
	Initialize_DateRoutines();
	YYYYMMDD1 = ymdtoday;
	YYYYMMDD2 = ymdtoday;

	// If running on LSF 9.x, DME can handle up to 99 record keys in a single call; on 8.0.x tech, the limit is 50.
	if (iosHandler && iosHandler.getIOSVersionNumber() >= "8.1")
	{
		dmeNbrKeys = 99;
	}

	if (fromTask) {
		try
		{
			parent.document.getElementById(window.name).style.visibility = "visible";
		}
		catch(e)
		{}
		parent.showWaitAlert(getSeaPhrase("RETRIEVE_PAYMENT_INFO","ESS"));
	}

	var dmeObj 			= new DMEObject(authUser.prodline,"prsystem");
       	dmeObj.out 		= "JAVASCRIPT";
      	dmeObj.index   	= "prsset1";
      	dmeObj.field   	= "name;addr1;addr2;addr3;addr4;city;state;zip;"
      					+ "country-code;bank-code;country.country-desc";
      	dmeObj.key     	= authUser.company+"=";
	  	dmeObj.max     	= "1";
		dmeObj.cond		= "company";
	  	dmeObj.func  	= "GetDateRange()";
		dmeObj.debug	= false;
	DME(dmeObj,"dmedata");
}

function GetDateRange()
{
	CompInfo = self.dmedata.record[0];
	PreCacheLogos();

	var ThisRange = new Object();

	if (desiredYear=="" || parseFloat(desiredYear)==0 || isNaN(parseFloat(desiredYear))
	|| !dateIsValid(FormatDte4(desiredYear+"0101")))
	{
		PaymentPeriod = "LASTYEAR";
   		ThisRange = new DateRange(authUser.date,'back');
		YYYYMMDD1 = ThisRange.lastYr;
		YYYYMMDD2 = ThisRange.thisYr;
	}
	else
	{
		PaymentPeriod = "CALENDARYEAR";
   		YYYYMMDD1 = desiredYear+"0101";
  		YYYYMMDD2 = desiredYear+"1231";
   		if (!emssObjInstance.emssObj.futurePayments && YYYYMMDD2 > ymdtoday)
   		{
   			YYYYMMDD2 = ymdtoday
   		}
		if (desiredYear.length < 4)
		{
			desiredYear = YYYYMMDD1.substring(0,4);
		}
	}
	GetPayment();
}

function DateRange(date,direction)
{
	if (!date) date = ymdtoday;

	var thisYr = date.substring(0,4);
	var lastYr = (parseInt(thisYr,10)-1).toString();
	var thisDy = date.substring(6,8);
	var thisMth = date.substring(4,6);

	if (direction && direction.toUpperCase() == "FORWARD")
	{
		var nextYr = (parseInt(thisYr,10)+1).toString();
		this.lastYr = String(thisYr)+String(thisMth)+String(thisDy);
		if (parseFloat(thisMth) == 2 && parseFloat(thisDy) == 29) {
			this.thisYr = String(nextYr)+String(thisMth)+String(parseInt(thisDy,10)-1);
		}
		else {
			this.thisYr = String(nextYr)+String(thisMth)+String(thisDy);
		}
	}
	else
	{
		if (parseFloat(thisMth) == 2 && parseFloat(thisDy) == 29) {
			// PT 126857
			// this.lastYr = String(lastYr)+String(thisMth)+String(thisDy);
			this.lastYr = String(lastYr)+String(thisMth)+String(28);
		}
		else {
			this.lastYr = String(lastYr)+String(thisMth)+String(thisDy);
		}
		this.thisYr = String(thisYr)+String(thisMth)+String(thisDy);
	}
}

function SetRange(direction,date)
{
	var thisDte;

	var ThisRange = new DateRange(date,direction);
	YYYYMMDD1 = ThisRange.lastYr;
	YYYYMMDD2 = ThisRange.thisYr;

	desiredYear = YYYYMMDD1.substring(0,4);
}

function GetPayment()
{
  	var dmeObj     		= new DMEObject(authUser.prodline,"paymastr");
   		dmeObj.out   	= "JAVASCRIPT";
      	dmeObj.index 	= "pymset4";
      	dmeObj.field 	= "check-nbr;check-type,xlt;check-date;per-end-date;"
	              		+ "gross-pay;check-net;net-pay-amt;check-id;employee.full-name;"
                  		+ "employee.last-name;employee.first-name;employee.middle-init;"
						+ "employee.fica-nbr;employee.process-level;employee.department;"
						+ "employee.addr1;employee.addr2;employee.addr3;employee.addr4;"
						+ "employee.city;employee.state;employee.zip;country-code;"
						+ "employee.label-name-1;currency-code;cucodes.forms-exp";
		if (emssObjInstance.emssObj.periodStartDate) {
			dmeObj.field   += ";employee.ot-plan-code";
		}
		dmeObj.cond		= "closed;non-gm-adj";
	  	dmeObj.key      = authUser.company+"="+authUser.employee+"=";
	  	// If this is the first call and the flag is set, look for future dated payments.
	  	if (emssObjInstance.emssObj.futurePayments) {
	  		dmeObj.select = "check-date>="+YYYYMMDD1;
	  	}
	  	else {
	  		dmeObj.key	+= YYYYMMDD1+"->"+YYYYMMDD2;
		}

	  	dmeObj.max      = "600";
	  	dmeObj.otmmax	= "1";
	  	dmeObj.sortdesc = "check-date";
	  	dmeObj.func  	= "ProcessThisPayment()";
	  	dmeObj.debug	= false;
	DME(dmeObj,"dmedata");
}

function ProcessThisPayment()
{
	Payment = Payment.concat(self.dmedata.record);

	if (self.dmedata.Next != "")
	{
		self.dmedata.location.replace(self.dmedata.Next);
		return;
	}

	var strHtml = "";
    var periodYr;
    var thisPeriod = new Object();
	var classStr = (PaymentPeriod=="LASTYEAR")?"plaintableheaderborder":"plaintableheaderborderlite";

    strHtml = '<table id="checklistTbl" class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" ';
    strHtml += 'summary="'+getSeaPhrase("PAYCHECKS_SUMMARY","ESS")+'" styler="list">'
	strHtml += '<tr>';
	strHtml += '<th class="'+classStr+'" style="text-align:center;width:29%">'+getSeaPhrase("DATE","ESS")+'</th>';
	strHtml += '<th class="'+classStr+'" style="text-align:center;width:36%">'+getSeaPhrase("GROSS","ESS")+'</th>';
	strHtml += '<th class="'+classStr+'" style="text-align:center;width:35%">'+getSeaPhrase("NET","ESS")+'</th>';
	strHtml += '</tr>';

	var rowCnt = -1;

	for (var i=0;i<Payment.length;i++)
    {
	   	thisPeriod = Payment[i];
        periodYr = ParseYear(thisPeriod.check_date);

        if (PaymentPeriod=="LASTYEAR" || periodYr==parseInt(desiredYear,10))
		{
			rowCnt++;
			strHtml += '<tr><td class="plaintablecellborder" style="text-align:center;width:29%" nowrap>';
			strHtml += '<a href="javascript:parent.GetDetail('+i+','+rowCnt+')"';
			strHtml += ' onmouseover="window.status=\''+getSeaPhrase("VIEW_PAYMENT_DETAIL","ESS").replace(/\'/g,"\\'")+'\';return true"';
			strHtml += ' onmouseout="window.status=\'\';return true">';
			strHtml += (thisPeriod.check_date)?thisPeriod.check_date:'&nbsp;';
			strHtml += '</a></td>';
			strHtml += '<td class="plaintablecellborder" style="text-align:center;width:36%" nowrap>';
			strHtml += (NonSpace(roundToDecimal(ParseNbr(thisPeriod.gross_pay),2))>0)?roundToDecimal(ParseNbr(thisPeriod.gross_pay),2):'&nbsp;';
			strHtml += '</td>';
			strHtml += '<td class="plaintablecellborder" style="text-align:center;width:35%" nowrap>';
			strHtml += (NonSpace(roundToDecimal(ParseNbr(thisPeriod.net_pay_amt),2))>0)?roundToDecimal(ParseNbr(thisPeriod.net_pay_amt),2):'&nbsp;';
			strHtml += '</td>';
			strHtml += '</tr>';
		}
	}

	strHtml += '</table>';

	if (Payment.length == 0) {
		strHtml = '<div class="fieldlabelbold" style="text-align:left;padding-top:5px;padding-left:5px">'
		+ getSeaPhrase("NO_PAYMENT_INFO","ESS")+' '
		+ FormatDte3(YYYYMMDD1)+' '
		+ getSeaPhrase("THROUGH","ESS")+' '
   		+ FormatDte3(YYYYMMDD2)+'.</div>'
	}

	if (PaymentPeriod=="LASTYEAR")
	{
		try {
			self.checklist.document.getElementById("paneHeader").innerHTML = getSeaPhrase("PAYMENTS","ESS");
			self.checklist.document.getElementById("paneBody").innerHTML = strHtml;
		}
		catch(e) {}

		self.checklist.setLayerSizes();
		self.checklist.stylePage();
		document.getElementById("checklistdtl").style.visibility = "hidden";
		document.getElementById("checklist").style.visibility = "visible";
	}
	else
	{
		try {
			self.checklistdtl.document.getElementById("paneHeader").innerHTML = getSeaPhrase("PAYMENTS","ESS");
			self.checklistdtl.document.getElementById("paneBody").innerHTML = strHtml;
		}
		catch(e) {}

		self.checklistdtl.setLayerSizes();
		self.checklistdtl.stylePage();
		document.getElementById("checklist").style.visibility = "hidden";
		document.getElementById("checklistdtl").style.visibility = "visible";
	}

    if (fromTask) {
		parent.removeWaitAlert();
    }
}

function GetDetail(index,rowNbr)
{
	Payroll = new Array();
	Deductions = new Array();
	Earnings = new Array();
	EarnedHours = 0;
	EarnedAmount = 0;
	TaxableWages = 0;
	PreTaxDeductions = 0;
	AfterTaxDeductions = 0;
	AddedToNetPay = 0;
	CompanyTaxes = 0;
	CompanyDeductions = 0;
	lastPaySumGrp = " ";
	lastDedCode = " ";

	if (PaymentPeriod=="LASTYEAR")
	{
		activateTableRow("checklistTbl",rowNbr,self.checklist);
	}
	else
	{
		activateTableRow("checklistTbl",rowNbr,self.checklistdtl);
		// hide the Year to Date detail frame if the check list is accessed
		// via Year to Date
		try {
			parent.HideYTDDetail();
		}
		catch(e) {}
	}

	if (fromTask) {
		parent.showWaitAlert(getSeaPhrase("RETRIEVE_PAYMENT_DETAIL","ESS"));
	}

	GetPayroll(index);
}

function GetPayroll(index)
{
	var checkId = ParseNbr(Payment[index].check_id);

    var dmeObj     		= new DMEObject(authUser.prodline,"prtime");
     	dmeObj.out   	= "JAVASCRIPT";
      	dmeObj.field 	= "pay-sum-grp;hours;rate;wage-amount;pay-sum-group.description;work-state;shft-diff-rate;ot-rate";
      	dmeObj.key   	= authUser.company+"="+authUser.employee+"="+checkId;
      	dmeObj.max   	= "600";
      	dmeObj.func  	= "GetPaydeduction("+index+")";
	  	dmeObj.debug	= false;
  	DME(dmeObj,"dmedata");
}

function GetPaydeduction(index)
{
	Payroll = Payroll.concat(self.dmedata.record);

	if (self.dmedata.Next != "")
	{
		self.dmedata.location.replace(self.dmedata.Next);
		return;
	}

	Payroll.sort(sortByDescription);

	var checkId = ParseNbr(Payment[index].check_id);

	var dmeObj     		= new DMEObject(authUser.prodline,"paydeductn");
    	dmeObj.out		= "JAVASCRIPT";
      	dmeObj.field 	= "ded-code;ded-amt;tax-wages;deduct-code.adjust-pay;"
                 		+ "deduct-code.calc-type;deduct-code.tax-status;payroll-year;"
				 		+ "deduct-code.print-flag;deduct-code.description;work-state";
      	dmeObj.key   	= authUser.company+"="+authUser.employee+"="+checkId;
      	dmeObj.max   	= "600";
      	dmeObj.func  	= "CheckACH("+index+")";
	  	dmeObj.debug 	= false;
   	DME(dmeObj,"dmedata");
}

function CheckACH(index)
{
	Deductions = Deductions.concat(self.dmedata.record);

	if (self.dmedata.Next != "")
	{
		self.dmedata.location.replace(self.dmedata.Next);
		return;
	}

	AutoDeposit = ParseNbr(Payment[index].net_pay_amt)-ParseNbr(Payment[index].check_net);

    // Get ACH account information
    if (AutoDeposit) {    
   		ACHAccounts = new Array();
		CallACHAccounts(index,0);
    }
	else {
		DisplayData(index);
	}
}

function CallACHAccounts(index,nbr_calls)
{
	if (nbr_calls == 0)
	{
		var checkId = ParseNbr(Payment[index].check_id);

		var dmeObj     		= new DMEObject(authUser.prodline,"empachdist");
   			dmeObj.out   	= "JAVASCRIPT";
   			dmeObj.index 	= "acdset1";
   			dmeObj.field 	= "dist-amount;ebank-id;ebnk-acct-nbr;emp-ach-depst.ebank-id;emp-ach-depst.ebnk-acct-nbr;"
	          	     	 +"emp-ach-depst.description;ca-inst-nbr;ca-transit-nbr"
   			dmeObj.key   	= authUser.company+"="+authUser.employee+"="+checkId;
   			dmeObj.func  	= "CallACHAccounts("+index+","+(nbr_calls+1)+")";
   		DME(dmeObj, "dmedata");
	}
	else
	{
		ACHAccounts = ACHAccounts.concat(self.dmedata.record);

		if (self.dmedata.Next!="") {
			self.dmedata.location.replace(self.dmedata.Next);
		}
		else {		
			if (self.dmedata.rechdr && self.dmedata.fldsize)
			{
				ACHFieldSize = new Array();
				var len = self.dmedata.rechdr.length;
				for (var i=0; i<len; i++)
					ACHFieldSize[self.dmedata.rechdr[i].replace(/\.|,/g,"_")] = Number(self.dmedata.fldsize[i]);				
			}
			CheckACHBankDescriptions(index);
		}
	}
}

function CheckACHBankDescriptions(index)
{
	updatedACHBanks = new Array();
	for (var i=0; i<ACHAccounts.length; i++)
	{
		var achAcct = ACHAccounts[i];
		if (Number(achAcct.ebank_id) != Number(achAcct.emp_ach_depst_ebank_id))
		{
			// bank has been updated on PR12; we need to retrieve the old description.
			updatedACHBanks[updatedACHBanks.length] = achAcct.ebank_id;
		}
	}

	if (updatedACHBanks.length > 0)
	{
		CallACHAccountDescriptions(index);
	}
	else
	{
	 	DisplayData(index);
	}
}

function CallACHAccountDescriptions(index)
{
//PT 160070
	var dmeObj     		= new DMEObject(authUser.prodline,"prempbank")
   		dmeObj.out   	= "JAVASCRIPT"
   		dmeObj.index 	= "pebset1"
   		dmeObj.field 	= "ebank-id;bank-name;"
   		dmeObj.key     	= updatedACHBanks.join(";");
   		dmeObj.max     	= "600"
   		dmeObj.func  	= "StoreACHAccountDescriptions("+index+")";
   		DME(dmeObj, "dmedata")
}

function StoreACHAccountDescriptions(index)
{
	var bankRecs = self.dmedata.record;
	var nbrBankRecs = bankRecs.length;
	for (var i=0; i<ACHAccounts.length; i++)
	{
		for (var j=0; j<nbrBankRecs; j++)
		{
			if (Number(ACHAccounts[i].ebank_id) == Number(bankRecs[j].ebank_id))
			{
				// The bank has changed on PR12 since this payment was made.
				// Display the bank info from EMPACHDIST and description from PREMPBANK.
				ACHAccounts[i].emp_ach_depst_ebank_id = ACHAccounts[i].ebank_id;
				ACHAccounts[i].emp_ach_depst_ebnk_acct_nbr = ACHAccounts[i].ebnk_acct_nbr;
				ACHAccounts[i].emp_ach_depst_description = bankRecs[j].bank_name;
				break;
			}
		}
	}
	DisplayData(index);
}
// PT 159476

function isCATaxable(taxStatus,workState)
{
	var TaxStatusIsC1 				= taxStatus == "C1"
	var TaxStatusIsC5 				= taxStatus == "C5"
	var TaxStatusIsC3 				= taxStatus == "C3"
	var TaxStatusIsC4 				= taxStatus == "C4"
	var TaxStatusIsC9 				= taxStatus == "C9"
	var BlankTaxStatus 				= taxStatus == "" || taxStatus == 0;
	var WorkStateIsAB 				= workState == "AB";
	var WorkStateIsBritishColumbia 	= workState == "BC";
	var WorkStateIsQuebec 			= workState == "QC";

	return (TaxStatusIsC1 || TaxStatusIsC5 || (TaxStatusIsC3 && (WorkStateIsAB || WorkStateIsBritishColumbia))
	|| (TaxStatusIsC4 && WorkStateIsQuebec) || (TaxStatusIsC9 && WorkStateIsQuebec));
}

function DisplayData(index)
{
	var thisPayRec = new Object();
	var thisDedRec = new Object();
	var thisPayment = Payment[index];
	var page 		= "";
	var color 		= 0;
	var checkId 	= ParseNbr(thisPayment.check_id);
	var checkYr 	= ParseYear(thisPayment.check_date);
	var Canada 		= thisPayment.country_code == "CA";

	if (!Earnings.length && !EarnedHours && !EarnedAmount)
	{
		for (var i=0;i<Payroll.length;i++)
	    {
	   	   thisPayRec = Payroll[i];
		   BuildEarnings(thisPayRec.pay_sum_grp,ParseNbr(thisPayRec.wage_amount),
		   				ParseNbr(thisPayRec.rate),ParseNbr(thisPayRec.hours),thisPayRec.pay_sum_group_description);
		   EarnedHours += ParseNbr(thisPayRec.hours);
		   EarnedAmount += ParseNbr(thisPayRec.wage_amount);
	    }
	}

	if(!TaxableWages && !PreTaxDeductions && !AfterTaxDeductions && !AddedToNetPay && !CompanyTaxes && !CompanyDeductions)
	{
		for (var i=0;i<Deductions.length;i++)
		{
			thisDedRec = Deductions[i];
		  	BuildDeductions(thisDedRec.ded_code,ParseNbr(thisDedRec.ded_amt),
						ParseNbr(thisDedRec.tax_wages),thisDedRec.deduct_code_calc_type,
						thisDedRec.deduct_code_tax_status,thisDedRec.deduct_code_adjust_pay,
						thisDedRec.deduct_code_print_flag,thisDedRec.deduct_code_description,thisDedRec.work_state);

			if (Canada) {

				if (thisDedRec.deduct_code_adjust_pay=="C" && isCATaxable(thisDedRec.deduct_code_tax_status,thisDedRec.work_state)) {
		    	  	TaxableWages += ParseNbr(thisDedRec.ded_amt);
		   		}

				if (thisDedRec.deduct_code_adjust_pay=="S") {
					PreTaxDeductions += ParseNbr(thisDedRec.ded_amt);
				}

				if (thisDedRec.deduct_code_adjust_pay=="A") {
					AddedToNetPay += ParseNbr(thisDedRec.ded_amt);
		    	}

		  		if (thisDedRec.deduct_code_adjust_pay=="C" && thisDedRec.deduct_code_print_flag=="Y")
				{
					if (thisDedRec.deduct_code_calc_type=="T") {
						if (thisDedRec.deduct_code_tax_status==0 || thisDedRec.deduct_code_tax_status=="") {
		    	 			CompanyTaxes += ParseNbr(thisDedRec.ded_amt);
						}
					}
					if (!isCATaxable(thisDedRec.deduct_code_tax_status,thisDedRec.work_state)) {
						CompanyDeductions += ParseNbr(thisDedRec.ded_amt);
					}
				}
			}
			else {

		  		if (thisDedRec.deduct_code_calc_type=="T" && thisDedRec.deduct_code_adjust_pay=="S"
		  		&& (thisDedRec.deduct_code_tax_status==0 || thisDedRec.deduct_code_tax_status=="")) {
		    	  	TaxableWages += ParseNbr(thisDedRec.ded_amt);
		   		}

    	  		//if (thisDedRec.deduct_code_calc_type!="T" && thisDedRec.deduct_code_adjust_pay=="S")
				if (thisDedRec.deduct_code_adjust_pay=="S")
				{
					if (thisDedRec.deduct_code_tax_status!=16 && thisDedRec.deduct_code_tax_status!=17 && (thisDedRec.deduct_code_tax_status!=0 || thisDedRec.deduct_code_tax_status!="")) {
    	    	  		PreTaxDeductions += ParseNbr(thisDedRec.ded_amt);
    	    	  	}
					if (thisDedRec.deduct_code_calc_type!="T" && (thisDedRec.deduct_code_tax_status==16 || thisDedRec.deduct_code_tax_status==17 || thisDedRec.deduct_code_tax_status==0 || thisDedRec.deduct_code_tax_status=="")) {
						AfterTaxDeductions += ParseNbr(thisDedRec.ded_amt);
					}
				}

		  		//if (thisDedRec.deduct_code_calc_type!="T" && thisDedRec.deduct_code_adjust_pay=="A") {
		    	if (thisDedRec.deduct_code_adjust_pay=="A") {
		    		AddedToNetPay += ParseNbr(thisDedRec.ded_amt);
		    	}

		  		if (thisDedRec.deduct_code_adjust_pay=="C" && thisDedRec.deduct_code_print_flag=="Y")
				{
					if (thisDedRec.deduct_code_calc_type=="T") {
						if (thisDedRec.deduct_code_tax_status==0 || thisDedRec.deduct_code_tax_status=="") {
		    	 			CompanyTaxes += ParseNbr(thisDedRec.ded_amt);
						}
					}
					else {
    	    	    	CompanyDeductions += ParseNbr(thisDedRec.ded_amt);
		  			}
		  		}
			}
		}
	}

//////////////
//	SUMMARY	//
//////////////

	var detailHtml = '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" '
	+ 'summary="'+getSeaPhrase("CHECK_SUMMARY_SUMMARY","ESS")+'">'
	+ '<tr style="text-align:center">'
	+ '<th class="plaintableheaderborderlitewhite" style="border-right:0px;padding-bottom:5px">'
	+ '<a href="javascript:parent.GetYTDPayment('+index+')"'
	+ ' onmouseover="window.status=\''+getSeaPhrase("PRINTABLE_PAY_STUB","ESS").replace(/\'/g,"\\'")+'\';return true"'
	+ ' onmouseout="window.status=\'\';return true">'
	+ getSeaPhrase("PRINTABLE_PAY_STUB","ESS")
	+ '</a></th>'
	+ '</tr>'
	+ '</table>'
	+ '<table class="plaintableborder" style="border-top:0px" border="0" cellspacing="0" cellpadding="0" width="100%">'
	+ '<tr>'
	+ '<th class="plaintablerowheaderlite" style="text-align:right;width:60%">'+((thisPayment.country_code=="CA")?getSeaPhrase("CHEQUE_NUMBER","ESS"):getSeaPhrase("CHECK_NUMBER","ESS"))+'</th>'
	+ '<td class="plaintablecelldisplay" style="text-align:right;width:40%" nowrap><span id="dtlCheckNbr">'+((thisPayment.check_nbr)?ParseNbr(thisPayment.check_nbr):'&nbsp;')+'</span></td>'
	+ '</tr>'
	+ '<tr>'
	+ '<th class="plaintablerowheaderlite" style="text-align:right;width:60%">'+getSeaPhrase("PAYMENT_DATE","ESS")+'</th>'
	+ '<td class="plaintablecelldisplay" style="text-align:right;width:40%" nowrap><span id="dtlPaymentDate">'+((thisPayment.check_date)?thisPayment.check_date:'&nbsp;')+'</span></td>'
	+ '</tr>'
	+ '<tr>'
	+ '<th class="plaintablerowheaderlite" style="text-align:right;width:60%">'+getSeaPhrase("PERIOD_END_DATE","ESS")+'</th>'
	+ '<td class="plaintablecelldisplay" style="text-align:right;width:40%" nowrap><span id="dtlPeriodEndDate">'+((thisPayment.per_end_date)?thisPayment.per_end_date:'&nbsp;')+'</span></td>'
	+ '</tr>'
	+ '<tr>'
	+ '<th class="plaintablerowheaderlite" style="text-align:right;width:60%">'+getSeaPhrase("GROSS_WAGES","ESS")+'</th>'
	+ '<td class="plaintablecelldisplay" style="text-align:right;width:40%" nowrap><span id="dtlGrossWages">'+((thisPayment.gross_pay)?roundToDecimal(ParseNbr(thisPayment.gross_pay),2):'&nbsp;')+'</span></td>'
	+ '</tr>'
	+ '<tr>'
	+ '<th class="plaintablerowheaderlite" style="text-align:right;width:60%">'+getSeaPhrase("NET_PAY","ESS")+'</th>'
	+ '<td class="plaintablecelldisplay" style="text-align:right;width:40%" nowrap><span id="dtlNetPay">'+((thisPayment.net_pay_amt)?roundToDecimal(ParseNbr(thisPayment.net_pay_amt),2):'&nbsp;')+'</span></td>'
	+ '</tr>'
	+ '<tr>'
	+ '<th class="plaintablerowheaderlite" style="text-align:right;width:60%">'+((thisPayment.country_code=="CA")?getSeaPhrase("CHEQUE_AMOUNT","ESS"):getSeaPhrase("CHECK_AMOUNT","ESS"))+'</th>'
	+ '<td class="plaintablecelldisplay" style="text-align:right;width:40%" nowrap><span id="dtlCheckAmount">'+((thisPayment.check_net)?roundToDecimal(ParseNbr(thisPayment.check_net),2):'&nbsp;')+'</span></td>'
	+ '</tr>';

	if (AutoDeposit)
	{
		detailHtml += '<tr>'
		+ '<th class="plaintablerowheaderborderlite" style="text-align:right;width:60%">'+getSeaPhrase("QUAL_16","ESS")+'</th>'
		+ '<td class="plaintablecellborderdisplay" style="text-align:right;width:40%" nowrap><span id="dtlCurrency">'+((thisPayment.cucodes_forms_exp)?thisPayment.cucodes_forms_exp:'&nbsp;')+'</span></td>'
		+ '</tr>';

		for (var i=0; i<ACHAccounts.length; i++)
		{
			var thisAch = ACHAccounts[i];

			if (thisPayment.country_code == "CA") {
				if (emssObjInstance.emssObj.maskBankInfo)
				{
					thisAch.ca_transit_nbr = maskDigits(thisAch.ca_transit_nbr, "x", 4, ACHFieldSize["ca_transit_nbr"]);
					thisAch.emp_ach_depst_ebnk_acct_nbr = maskDigits(thisAch.emp_ach_depst_ebnk_acct_nbr, "x", 4, ACHFieldSize["emp_ach_depst_ebnk_acct_nbr"]);
					thisAch.ca_inst_nbr = maskDigits(thisAch.ca_inst_nbr, "x", 4, ACHFieldSize["ca_inst_nbr"]);
				}			
				detailHtml += '<tr>'
				+ '<th class="plaintablerowheaderlite" style="text-align:right;width:60%">'+getSeaPhrase("TRANSIT_NBR","ESS")+'</th>'
				+ '<td class="plaintablecelldisplay" style="text-align:right;width:40%" nowrap><span id="dtlTransitNbr">'+((thisAch.ca_transit_nbr)?thisAch.ca_transit_nbr:'&nbsp;')+'</span></td>'
				+ '</tr>'
				+ '<tr>'
				+ '<th class="plaintablerowheaderlite" style="text-align:right;width:60%">'+getSeaPhrase("ACCOUNT_NBR","ESS")+'</th>'
				+ '<td class="plaintablecelldisplay" style="text-align:right;width:40%" nowrap><span id="dtlAccountNbr">'+((thisAch.emp_ach_depst_ebnk_acct_nbr)?thisAch.emp_ach_depst_ebnk_acct_nbr:'&nbsp;')+'</span></td>'
				+ '</tr>'
				+ '<tr>'
				+ '<th class="plaintablerowheaderlite" style="text-align:right;width:60%">'+getSeaPhrase("INSTITUTION_NBR","ESS")+'</th>'
				+ '<td class="plaintablecelldisplay" style="text-align:right;width:40%" nowrap><span id="dtlInstitutionNbr">'+((thisAch.ca_inst_nbr)?thisAch.ca_inst_nbr:'&nbsp;')+'</span></td>'
				+ '</tr>'
				+ '<tr>'
				+ '<th class="plaintablerowheaderlite" style="text-align:right;width:60%">'+getSeaPhrase("CA_BANK_INSTITUTION","ESS")+'</th>'
				+ '<td class="plaintablecelldisplay" style="text-align:right;width:40%" nowrap><span id="dtlInstitution">'+((thisAch.emp_ach_depst_description)?thisAch.emp_ach_depst_description:'&nbsp;')+'</span></td>'
				+ '</tr>';
			}
			else {			
				if (emssObjInstance.emssObj.maskBankInfo)
				{
// MOD BY BILAL  - Not masking the routing number
//					thisAch.emp_ach_depst_ebank_id = maskDigits(thisAch.emp_ach_depst_ebank_id, "x", 4, ACHFieldSize["emp_ach_depst_ebank_id"]);
// END OF MOD
					thisAch.emp_ach_depst_ebnk_acct_nbr = maskDigits(thisAch.emp_ach_depst_ebnk_acct_nbr, "x", 4, ACHFieldSize["emp_ach_depst_ebnk_acct_nbr"]);
				}			
				detailHtml += '<tr>'
				+ '<th class="plaintablerowheaderlite" style="text-align:right;width:60%">'+getSeaPhrase("ROUTING_NBR","ESS")+'</th>'
				+ '<td class="plaintablecelldisplay" style="text-align:right;width:40%" nowrap><span id="dtlRoutingNbr">'+((thisAch.emp_ach_depst_ebank_id)?thisAch.emp_ach_depst_ebank_id:'&nbsp;')+'</span></td>'
				+ '</tr>'
				+ '<tr>'
				+ '<th class="plaintablerowheaderlite" style="text-align:right;width:60%">'+getSeaPhrase("BANK_ACCOUNT","ESS")+'</th>'
				+ '<td class="plaintablecelldisplay" style="text-align:right;width:40%" nowrap><span id="dtlBankAccount">'+((thisAch.emp_ach_depst_ebnk_acct_nbr)?thisAch.emp_ach_depst_ebnk_acct_nbr:'&nbsp;')+'</span></td>'
				+ '</tr>'
				+ '<tr>'
				+ '<th class="plaintablerowheaderlite" style="text-align:right;width:60%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th>'
				+ '<td class="plaintablecelldisplay" style="text-align:right;width:40%" nowrap><span id="dtlDescription">'+((thisAch.emp_ach_depst_description)?thisAch.emp_ach_depst_description:'&nbsp;')+'</span></td>'
				+ '</tr>';
			}

			detailHtml += '<tr>'
			+ '<th class="plaintablerowheaderborderlite" style="text-align:right;width:60%">'+getSeaPhrase("DEPOSIT_AMOUNT","ESS")+'</th>'
			+ '<td class="plaintablecelldisplay" style="text-align:right;width:40%" nowrap><span id="dtlGrossWages">'+((thisAch.dist_amount)?thisAch.dist_amount:'&nbsp;')+'</span></td>'
			+ '</tr>';
		}
	}
	else {
		detailHtml += '<tr>'
		+ '<th class="plaintablerowheaderborderlite" style="text-align:right;width:60%">'+getSeaPhrase("QUAL_16","ESS")+'</th>'
		+ '<td class="plaintablecelldisplay" style="text-align:right;width:40%" nowrap><span id="dtlCurrency">'+((thisPayment.cucodes_forms_exp)?thisPayment.cucodes_forms_exp:'&nbsp;')+'</span></td>'
		+ '</tr>';
	}

	try {
		self.summary.document.getElementById("paneHeader").innerHTML = getSeaPhrase("SUMMARY","ESS");
		self.summary.document.getElementById("paneBody").innerHTML = detailHtml;
		self.summary.stylePage();
	}
	catch(e) {}

	if (PaymentPeriod!="LASTYEAR")
	{
	    document.getElementById("checklistdtl").style.height = "224px";
	    self.checklistdtl.document.getElementById("paneBodyBorder").style.height = "190px";
		document.getElementById("summary").style.top = "344px";
		document.getElementById("summary").style.height = "120px";
		self.summary.document.getElementById("paneBodyBorder").style.height = "86px";
	    document.getElementById("detail").style.top = "16px";
	    document.getElementById("detail").style.height = "448px";
	}

	//self.summary.setLayerSizes(true);
	document.getElementById("summary").style.visibility = "visible";

//////////////
//	WAGES	//
//////////////

	var dspSummary = false;
	var tblHtml = "";
	detailHtml = "";

	if (EarnedAmount)
   	{
		tblHtml = '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" '
		+ 'summary="'+getSeaPhrase("CHECK_DETAIL_SUMMARY","ESS")+'" styler="list">'
		+ '<tr>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:47%">'
		+ getSeaPhrase("PAY","ESS")+'</th>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:26%">'
		+ getSeaPhrase("HOURS","ESS")+'</th>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:27%">'
		+ getSeaPhrase("WAGES","ESS")+'</th>'
		+ '</tr>'

   	   	for (var i=0; i<Earnings.length; i++)
	   	{
	  		if (Earnings[i].hours || Earnings[i].amount)
		  	{
				tblHtml += '<tr>'
				+ '<td class="plaintablecellborder" style="text-align:right;width:47%" nowrap>'
				+ ((Earnings[i].description)?Earnings[i].description:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:right;width:26%" nowrap>'
				+ ((Earnings[i].hours)?roundToDecimal(ParseNbr(Earnings[i].hours),2):'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:right;width:27%" nowrap>'
				+ ((Earnings[i].amount)?roundToDecimal(ParseNbr(Earnings[i].amount),2):'&nbsp;')+'</td>'
		  		+ '</tr>'
			}
	 	}

		tblHtml += '<tr>'
		+ '<td class="plaintablecellboldborder" style="text-align:right;width:47%" nowrap>'
		+ getSeaPhrase("TOTAL","ESS")+'</td>'
		+ '<td class="plaintablecellborder" style="text-align:right;width:26%" nowrap>'
		+ ((EarnedHours)?roundToDecimal(ParseNbr(EarnedHours),2):'&nbsp;')+'</td>'
		+ '<td class="plaintablecellborder" style="text-align:right;width:27%" nowrap>'
		+ ((EarnedAmount)?roundToDecimal(ParseNbr(EarnedAmount),2):'&nbsp;')+'</td>'
		+ '</tr>'
		+ '</table>'

   		detailHtml += uiDetailTable(getSeaPhrase("WAGES","ESS"),tblHtml);
   		dspSummary = true;
   	}

//////////////////
//	TAXES		//
//////////////////

	if ((TaxableWages && !Canada) || (PreTaxDeductions && Canada))
   	{
		var tblCol = (Canada) ? getSeaPhrase("WAGES","ESS") : getSeaPhrase("TAXABLE_WAGES","ESS");

		tblHtml = '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%"'
		+ ((dspSummary==false)?' summary="'+getSeaPhrase("CHECK_DETAIL_SUMMARY","ESS")+'"':'')+' styler="list">'
		+ '<tr>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:47%">'
		+ getSeaPhrase("DEDUCTION","ESS")+'</th>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:26%">'
		+ getSeaPhrase("AMOUNT","ESS")+'</th>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:27%">'
		+ tblCol+'</th>'
		+ '</tr>'

		for (var i=0; i<Deductions.length; i++)
		{
			var Amount 				= Deductions[i].amount || Deductions[i].taxwage;
			var TaxCalcType 		= Deductions[i].calctype  == "T";
			var AdjustPayIsEmployee = Deductions[i].adjustpay == "S";
			var BlankTaxStatus 		= Deductions[i].taxstatus == "";

			if ((!Canada && Amount && TaxCalcType && AdjustPayIsEmployee &&	BlankTaxStatus)
			|| (Canada && Amount && AdjustPayIsEmployee))
			{
				tblHtml += '<tr>'
				+ '<td class="plaintablecellborder" style="text-align:right;width:47%" nowrap>'
				+ ((Deductions[i].description)?Deductions[i].description:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:right;width:26%" nowrap>'
				+ ((Deductions[i].amount)?roundToDecimal(ParseNbr(Deductions[i].amount),2):'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:right;width:27%" nowrap>'
				+ ((Deductions[i].taxwage)?roundToDecimal(ParseNbr(Deductions[i].taxwage),2):'&nbsp;')+'</td>'
				+ '</tr>'
			}
		}

		tblHtml += '<tr>'
		+ '<td class="plaintablecellboldborder" style="text-align:right;width:47%" nowrap>'
		+ getSeaPhrase("TOTAL","ESS")+'</td>'
		+ '<td class="plaintablecellborder" style="text-align:right;width:26%" nowrap>'
		+ ((Canada)?roundToDecimal(ParseNbr(PreTaxDeductions),2):roundToDecimal(ParseNbr(TaxableWages),2))+'</td>'
		+ '<td class="plaintablecellborder" style="text-align:right;width:27%" nowrap>&nbsp;</td>'
		+ '</tr>'
		+ '</table>'

      	detailHtml += uiDetailTable(getSeaPhrase("TAXES","ESS"),tblHtml);
      	dspSummary = true;
	}

///////////////////////
//	PRETAXDEDUCTIONS //
///////////////////////

	if ((PreTaxDeductions && !Canada) || (TaxableWages && Canada))
  	{
		tblHtml = '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%"'
		+ ((dspSummary==false)?' summary="'+getSeaPhrase("CHECK_DETAIL_SUMMARY","ESS")+'"':'')+' styler="list">'
		+ '<tr>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:47%">'
		+ getSeaPhrase("DEDUCTION","ESS")+'</th>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:26%">'
		+ getSeaPhrase("AMOUNT","ESS")+'</th>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:27%">&nbsp;</th>'
		+ '</tr>'

      	for (var i=0; i<Deductions.length; i++)
      	{
			var AdjustPayIsCompany 			= Deductions[i].adjustpay == "C";
			var AdjustPayIsEmployee 		= Deductions[i].adjustpay == "S";
			var BlankTaxStatus 				= Deductions[i].taxstatus == "" || Deductions[i].taxstatus == 0;
			var RothDed						= Deductions[i].taxstatus == 16 || Deductions[i].taxstatus == 17;

			if ((Canada && AdjustPayIsCompany && isCATaxable(Deductions[i].taxstatus,Deductions[i].workstate))
			|| (!Canada && AdjustPayIsEmployee && !BlankTaxStatus && !RothDed))
			{
				tblHtml += '<tr>'
				+ '<td class="plaintablecellborder" style="text-align:right;width:47%" nowrap>'
				+ ((Deductions[i].description)?Deductions[i].description:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:right;width:26%" nowrap>'
				+ ((Deductions[i].amount)?roundToDecimal(ParseNbr(Deductions[i].amount),2):'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:right;width:27%" nowrap>&nbsp;</td>'
				+ '</tr>'
         	}
      	}

		tblHtml += '<tr>'
		+ '<td class="plaintablecellboldborder" style="text-align:right;width:47%" nowrap>'
		+ getSeaPhrase("TOTAL","ESS")+'</td>'
		+ '<td class="plaintablecellborder" style="text-align:right;width:26%" nowrap>'
		+ ((Canada)?roundToDecimal(ParseNbr(TaxableWages),2):roundToDecimal(ParseNbr(PreTaxDeductions),2))+'</td>'
		+ '<td class="plaintablecellborder" style="text-align:right;width:27%" nowrap>&nbsp;</td>'
		+ '</tr>'
		+ '</table>'

		var hdrString = (Canada)?getSeaPhrase("TAXABLE_BENEFITS","ESS"):getSeaPhrase("PRE_TAX_DEDUCTIONS","ESS");

      	detailHtml += uiDetailTable(hdrString,tblHtml);
      	dspSummary = true;
   	}

//////////////////////////
//	AFTERTAXDEDUCTIONS  //
//////////////////////////

	if (AfterTaxDeductions && !Canada)
   	{
		tblHtml = '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%"'
		+ ((dspSummary==false)?' summary="'+getSeaPhrase("CHECK_DETAIL_SUMMARY","ESS")+'"':'')+' styler="list">'
		+ '<tr>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:47%">'
		+ getSeaPhrase("DEDUCTION","ESS")+'</th>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:26%">'
		+ getSeaPhrase("AMOUNT","ESS")+'</th>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:27%">&nbsp;</th>'
		+ '</tr>'

      	for (var i=0; i<Deductions.length; i++)
      	{
				var Amount 				= Deductions[i].amount;
				var TaxCalcType 		= Deductions[i].calctype	== "T";
				var AdjustPayIsEmployee = Deductions[i].adjustpay 	== "S";
				var BlankTaxStatus 		= Deductions[i].taxstatus == "" || Deductions[i].taxstatus == 0;
				var RothDed				= Deductions[i].taxstatus == 16 || Deductions[i].taxstatus == 17;

         		if (Amount && !TaxCalcType && AdjustPayIsEmployee && (BlankTaxStatus || RothDed))
	     		{
					tblHtml += '<tr>'
					+ '<td class="plaintablecellborder" style="text-align:right;width:47%" nowrap>'
					+ ((Deductions[i].description)?Deductions[i].description:'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:right;width:26%" nowrap>'
					+ ((Deductions[i].amount)?roundToDecimal(ParseNbr(Deductions[i].amount),2):'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:right;width:27%" nowrap>&nbsp;</td>'
					+ '</tr>'
         		}
      	}

		tblHtml += '<tr>'
		+ '<td class="plaintablecellboldborder" style="text-align:right;width:47%" nowrap>'
		+ getSeaPhrase("TOTAL","ESS")+'</td>'
		+ '<td class="plaintablecellborder" style="text-align:right;width:26%" nowrap>'
		+ ((AfterTaxDeductions)?roundToDecimal(ParseNbr(AfterTaxDeductions),2):'&nbsp;')+'</td>'
		+ '<td class="plaintablecellborder" style="text-align:right;width:27%" nowrap>&nbsp;</td>'
		+ '</tr>'
		+ '</table>'

		detailHtml += uiDetailTable(getSeaPhrase("AFTER_TAX_DEDUCTIONS","ESS"),tblHtml);
		dspSummary = true;
   	}

/////////////////////
//	ADDEDTONETPAY  //
/////////////////////

	if (AddedToNetPay)
   	{
		tblHtml = '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%"'
		+ ((dspSummary==false)?' summary="'+getSeaPhrase("CHECK_DETAIL_SUMMARY","ESS")+'"':'')+' styler="list">'
		+ '<tr>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:47%">'
		+ getSeaPhrase("DEDUCTION","ESS")+'</th>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:26%">'
		+ getSeaPhrase("AMOUNT","ESS")+'</th>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:27%">&nbsp;</th>'
		+ '</tr>'

		for (var i=0; i<Deductions.length; i++)
		{
			var Amount 					= Deductions[i].amount;
			var TaxCalcType 			= Deductions[i].calctype == "T";
			var AdjustPayIsAddedToNet 	= Deductions[i].adjustpay == "A";

			if (Amount && AdjustPayIsAddedToNet)
			{
					tblHtml += '<tr>'
					+ '<td class="plaintablecellborder" style="text-align:right;width:47%" nowrap>'
					+ ((Deductions[i].description)?Deductions[i].description:'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:right;width:26%" nowrap>'
					+ ((Deductions[i].amount)?roundToDecimal(ParseNbr(Deductions[i].amount),2):'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:right;width:27%" nowrap>&nbsp;</td>'
					+ '</tr>'
			}
		}

		tblHtml += '<tr>'
		+ '<td class="plaintablecellboldborder" style="text-align:right;width:47%" nowrap>'
		+ getSeaPhrase("TOTAL","ESS")+'</td>'
		+ '<td class="plaintablecellborder" style="text-align:right;width:26%" nowrap>'
		+ ((AddedToNetPay)?roundToDecimal(ParseNbr(AddedToNetPay),2):'&nbsp;')+'</td>'
		+ '<td class="plaintablecellborder" style="text-align:right;width:27%" nowrap>&nbsp;</td>'
		+ '</tr>'
		+ '</table>'

		detailHtml += uiDetailTable(getSeaPhrase("ADD_TO_NET_PAY","ESS"),tblHtml);
		dspSummary = true;
   	}

/////////////////////
//	COMPANY TAXES  //
/////////////////////

	if (CompanyTaxes)
	{
		tblHtml = '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%"'
		+ ((dspSummary==false)?' summary="'+getSeaPhrase("CHECK_DETAIL_SUMMARY","ESS")+'"':'')+' styler="list">'
		+ '<tr>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:47%">'
		+ getSeaPhrase("DEDUCTION","ESS")+'</th>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:26%">'
		+ getSeaPhrase("AMOUNT","ESS")+'</th>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:27%">'
		+ getSeaPhrase("TAXABLE_WAGES","ESS")+'</th>'
		+ '</tr>'

		for (var i=0; i<Deductions.length; i++)
		{
			var Amount 				= Deductions[i].amount || Deductions[i].taxwage;
			var AdjustPayIsCompany 	= Deductions[i].adjustpay=="C";
			var TaxCalcType 		= Deductions[i].calctype=="T";
			var BlankTaxStatus 		= Deductions[i].taxstatus == "" || Deductions[i].taxstatus == 0;
			var PrintFlag 			= Deductions[i].printflag == "Y"

			if (Amount && AdjustPayIsCompany && TaxCalcType && BlankTaxStatus && PrintFlag)
			{
				tblHtml += '<tr>'
				+ '<td class="plaintablecellborder" style="text-align:right;width:47%" nowrap>'
				+ ((Deductions[i].description)?Deductions[i].description:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:right;width:26%" nowrap>'
				+ ((Deductions[i].amount)?roundToDecimal(ParseNbr(Deductions[i].amount),2):'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:right;width:27%" nowrap>'
				+ ((Deductions[i].taxwage)?roundToDecimal(ParseNbr(Deductions[i].taxwage),2):'&nbsp;')+'</td>'
				+ '</tr>'
			}
		}

		tblHtml += '<tr>'
		+ '<td class="plaintablecellboldborder" style="text-align:right;width:47%" nowrap>'
		+ getSeaPhrase("TOTAL","ESS")+'</td>'
		+ '<td class="plaintablecellborder" style="text-align:right;width:26%" nowrap>'
		+ ((CompanyTaxes)?roundToDecimal(ParseNbr(CompanyTaxes),2):'&nbsp;')+'</td>'
		+ '<td class="plaintablecellborder" style="text-align:right;width:27%" nowrap>&nbsp;</td>'
		+ '</tr>'
		+ '</table>'

		detailHtml += uiDetailTable(getSeaPhrase("COMPANY_TAXES","ESS"),tblHtml);
		dspSummary = true;
	}

//////////////////////////
//	COMPANY DEDUCTIONS  //
//////////////////////////

	if (CompanyDeductions && !Canada)
	{
		tblHtml = '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%"'
		+ ((dspSummary==false)?' summary="'+getSeaPhrase("CHECK_DETAIL_SUMMARY","ESS")+'"':'')+' styler="list">'
		+ '<tr>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:47%">'
		+ getSeaPhrase("DEDUCTION","ESS")+'</th>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:26%">'
		+ getSeaPhrase("AMOUNT","ESS")+'</th>'
		+ '<th class="plaintableheaderborderlite" style="text-align:center;width:27%">&nbsp;</th>'
		+ '</tr>'

		for (var i=0; i<Deductions.length; i++)
		{
			var Amount 						= Deductions[i].amount;
			var AdjustPayIsCompany 			= Deductions[i].adjustpay=="C";
			var TaxCalcType 				= Deductions[i].calctype=="T";
			var PrintFlag 					= Deductions[i].printflag == "Y"

			if ((!Canada && Amount && !TaxCalcType && AdjustPayIsCompany && PrintFlag)
			|| (Canada && Amount && AdjustPayIsCompany && !isCATaxable(Deductions[i].taxstatus,Deductions[i].workstate) && PrintFlag))
			{
					tblHtml += '<tr>'
					+ '<td class="plaintablecellborder" style="text-align:right;width:47%" nowrap>'
					+ ((Deductions[i].description)?Deductions[i].description:'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:right;width:26%" nowrap>'
					+ ((Deductions[i].amount)?roundToDecimal(ParseNbr(Deductions[i].amount),2):'&nbsp;')+'</td>'
					+ '<td class="plaintablecellborder" style="text-align:right;width:27%" nowrap>&nbsp;</td>'
					+ '</tr>'
			}
		}

		tblHtml += '<tr>'
		+ '<td class="plaintablecellboldborder" style="text-align:right;width:47%" nowrap>'
		+ getSeaPhrase("TOTAL","ESS")+'</td>'
		+ '<td class="plaintablecellborder" style="text-align:right;width:26%" nowrap>'
		+ ((CompanyDeductions)?roundToDecimal(ParseNbr(CompanyDeductions),2):'&nbsp;')+'</td>'
		+ '<td class="plaintablecellborder" style="text-align:right;width:27%" nowrap>&nbsp;</td>'
		+ '</tr>'
		+ '</table>'

		detailHtml += uiDetailTable(getSeaPhrase("COMPANY_DEDUCTIONS","ESS"),tblHtml);
		dspSummary = true;
	}

	if (detailHtml == "") {

		tblHtml = '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" '
		+ 'summary="'+getSeaPhrase("CHECK_DETAIL_SUMMARY","ESS")+'">'
		+ '<tr>'
		+ '<td class="plaintablecellborder">'+getSeaPhrase("NO_PAYMENT_DETAILS","ESS")+'</td>'
		+ '</tr>'
		+ '</table>'

   		detailHtml += uiDetailTable(getSeaPhrase("PAYMENT_DETAILS","ESS"),tblHtml);
	}

	// write table HTML to the detail frame
	if (detailHtml != "") {
		try {
			self.detail.document.getElementById("paneBody").innerHTML = detailHtml;
		}
		catch(e) {}

		self.detail.stylePage();
		self.detail.setLayerSizes(true);

		document.getElementById("detail").style.visibility = "visible";
	}

    if (fromTask) {
		parent.removeWaitAlert();
    }

	// show the back link if the check detail is accessed via Year to Date
	try {
		parent.ShowPaymentLink();
	}
	catch(e) {}
}

function BuildEarnings(paysumgrp,amount,rate,hours,description)
{
	if (paysumgrp != lastPaySumGrp)
		Earnings[Earnings.length] = new Earning(paysumgrp,amount,rate,hours,description)

   	for (var i=0;i<Earnings.length;i++)
   	{
      	if (Earnings[i].paysumgrp == paysumgrp)
      	{
         	Earnings[i].hours += ParseNbr(hours)
		 	Earnings[i].amount += ParseNbr(amount)
		 	break
      	}
   	}
}

function Earning(paysumgrp,amount,rate,hours,description)
{
	this.paysumgrp   = paysumgrp
	this.description = description
	this.hours       = 0
	this.rate		 = rate
	this.amount      = 0
	lastPaySumGrp 	 = paysumgrp
}

function BuildDeductions(dedcode,amount,taxwage,calctype,taxstatus,adjustpay,printflag,description,workstate)
{
	if (printflag=="Y")
   	{
      	if (dedcode!=lastDedCode)
		{
         	Deductions[Deductions.length] =
				new Deduction(dedcode,amount,taxwage,calctype,taxstatus,adjustpay,description,workstate,printflag)
      	}

	  	Deductions[Deductions.length-1].amount     += ParseNbr(amount)
      	Deductions[Deductions.length-1].taxwage    += ParseNbr(taxwage)
      	Deductions[Deductions.length-1].calctype    = calctype
      	Deductions[Deductions.length-1].taxstatus   = taxstatus
      	Deductions[Deductions.length-1].adjustpay   = adjustpay
      	Deductions[Deductions.length-1].description = description
      	Deductions[Deductions.length-1].workstate	= workstate
      	Deductions[Deductions.length-1].printflag   = printflag
	}
}

function Deduction(dedcode,amount,taxwage,calctype,taxstatus,adjustpay,description,workstate,printflag)
{
   	this.dedcode     = dedcode
   	this.description = description
   	this.adjustpay   = adjustpay
   	this.taxstatus   = taxstatus
   	this.calctype    = calctype
   	this.taxwage     = 0
  	this.amount      = 0
  	this.workstate	 = workstate
  	this.printflag	 = printflag
   	lastDedCode      = dedcode
}

function YTDDeduction(dedcode,amount,description)
{
 	this.dedcode 	 = dedcode
  	this.description = description
  	this.amount 	 = amount
  	this.curamount 	 = ""
}

function BuildYTDEarnings(paysumgrp,amount,rate,description,hours,workstate,shft_diff_rate,ot_rate)
{
	var newEarn = true

	// Calculate an hourly rate for salaried non-exempt (or, if configured, hourly) employee payment records
	if ((!rate || ParseNbr(rate) == 0 || isNaN(ParseNbr(rate))) && (CalcHourlyRate == "ALL" || (CalcHourlyRate == HourlyRateStates && CalcHourlyRate.indexOf(workstate) >= 0)))
	{
		if (ParseNbr(hours) != 0)
			rate = roundToDecimal(ParseNbr(amount)/ParseNbr(hours),2);
	}
	else if(CalcHourlyRate == "ALWAYS")
	{
		if (ParseNbr(hours) != 0)
		{
			rate = ParseNbr(rate) + ParseNbr(shft_diff_rate) + ParseNbr(ot_rate);
		}
		else
		{
			rate = "";
		}
	}

   	for (var i=0;i<YTDEarnings.length;i++)
   	{
      	if (YTDEarnings[i].paysumgrp==paysumgrp)
		{
			YTDEarnings[i].ytdamount += ParseNbr(amount)
		 	break
      	}
   	}

   	for (var i=0;i<YTDEarnings.length;i++)
   	{
      	if (YTDEarnings[i].paysumgrp==paysumgrp && Number(YTDEarnings[i].rate)==Number(rate))
		{
			newEarn = false
			YTDEarnings[i].amount += ParseNbr(amount)
		 	break
      	}
   	}

	if (newEarn)
      	YTDEarnings[YTDEarnings.length] = new YTDEarning(paysumgrp,amount,rate,description)
}

function BuildYTDDeductions(dedcode,amount,printflag,description,calctype,taxstat,adjustpay)
{
	if (calctype!="T" && (taxstat!=0 || taxstat!="") && adjustpay=="S")
	{
     	YTDPreTaxDeductions += ParseNbr(amount)
    }

	if (printflag=="Y")
   	{
		var newDed = true

		for (var i=0;i<YTDDeductions.length;i++)
		{
			if (YTDDeductions[i].dedcode==dedcode)
			{
				newDed = false
				YTDDeductions[i].amount += ParseNbr(amount)
				break
			}
		}

		if (newDed)
		{
			YTDDeductions[YTDDeductions.length] =
				new YTDDeduction(dedcode,amount,description)
		}
	}
}

function YTDEarning(paysumgrp,amount,rate,description)
{
   	this.paysumgrp   = paysumgrp
   	this.description = description
   	this.amount      = amount
   	this.rate		 = rate
   	this.curamount   = ""
  	this.curhours    = ""
	this.ytdamount	 = amount
}

function AddCurrentWage(paysumgrp,curamount,curhours,currate,workstate,shft_diff_rate,ot_rate)
{
	// Calculate an hourly rate for salaried non-exempt (or, if configured, hourly) employee payment records
	if ((!currate || ParseNbr(currate) == 0 || isNaN(ParseNbr(currate))) && (CalcHourlyRate == "ALL" || (CalcHourlyRate == HourlyRateStates && CalcHourlyRate.indexOf(workstate) >= 0)))
	{
		if (ParseNbr(curhours) != 0)
			currate = roundToDecimal(ParseNbr(curamount)/ParseNbr(curhours),2);
	}
	else if(CalcHourlyRate == "ALWAYS")
	{
		if (ParseNbr(curhours) != 0)
		{
			currate = ParseNbr(currate) + ParseNbr(shft_diff_rate) + ParseNbr(ot_rate);		
		}
		else
		{
			currate = "";	
		}
	}

	for (var i=0;i<YTDEarnings.length;i++)
   	{
   		if (paysumgrp==YTDEarnings[i].paysumgrp && Number(currate)==Number(YTDEarnings[i].rate))
     	{
       		YTDEarnings[i].curamount = ParseNbr(YTDEarnings[i].curamount) + ParseNbr(curamount)
       		YTDEarnings[i].curhours = ParseNbr(YTDEarnings[i].curhours) + ParseNbr(curhours)
       		YTDEarnings[i].amount = ""
       		break
     	}
   	}
}

// PT 143602.  Display Year to Date earnings itemized by pay sum group.  Current earnings will also
// be itemized by pay rate within each pay sum group.  Old earnings will display as one summary line
// per pay sum group.  The YTD amount for each pay sum group will display on the first earnings record
// in the group.
function MergeYTDEarnings()
{
	// Array to temporarily store earnings records by pay sum group
	var EarningsHash = new Array();

	// Store the YTD earnings by pay sum group into a hash array, so they are easy to retrieve.
	for (var i=0; i<YTDEarnings.length; i++)
	{
		var paySumGrp = YTDEarnings[i].paysumgrp;
		if (EarningsHash[paySumGrp])
		{
			EarningsHash[paySumGrp][EarningsHash[paySumGrp].length] = YTDEarnings[i];
		}
		else
		{
			EarningsHash[paySumGrp] = new Array();
			EarningsHash[paySumGrp][0] = YTDEarnings[i];
		}
	}

	// Re-initialize the global YTDEarnings array.  We will re-populate it below.
	YTDEarnings = new Array();

	// Work with YTD earnings by pay sum group.
	for (var grp in EarningsHash)
	{
		// The YTD amount for the pay sum group can be found in the first record for the group.
		// Store off the YTD amount for this pay sum group.  After merging old earnings records,
		// we will move this to the first record for the group in the merged array.
		var ytdAmt = "";
		if (EarningsHash[grp].length > 0)
			ytdAmt = EarningsHash[grp][0].ytdamount;

		// Sort the earnings records in this group by current amount.  Old records will float to
		// the top of the array, since they have no current amounts.
		EarningsHash[grp].sort(sortByCurrentAmt);

		// Push negative current earnings records below the old earnings records.
		// We want old earnings followed by current earnings, sorted by amount.
		var x = 0;
		var begOldIndex = -1;
		var endOldIndex = -1;
		while (x < EarningsHash[grp].length)
		{
			if ((ParseNbr(EarningsHash[grp][x].curamount) == 0) && (begOldIndex == -1))
				begOldIndex = x;
			else if ((ParseNbr(EarningsHash[grp][x].curamount) > 0) && (endOldIndex == -1))
				endOldIndex = x;
			x++;
		}
		if (endOldIndex == -1)
			endOldIndex = EarningsHash[grp].length;

		// Did we find some negative current earnings records in this group?
		if (begOldIndex > 0)
		{
        	// Push the negative current earnings records below the old earnings records.
        	var CurrentNegativeEarnings = EarningsHash[grp].slice(0, begOldIndex);
			var OldEarnings = EarningsHash[grp].slice(begOldIndex, endOldIndex);
			var CurrentPositiveEarnings = EarningsHash[grp].slice(endOldIndex);
			EarningsHash[grp] = OldEarnings.concat(CurrentNegativeEarnings);
			EarningsHash[grp] = EarningsHash[grp].concat(CurrentPositiveEarnings);
		}

		// Count the number of old earnings records we have at the top of the pay sum group array.
		var j = 0;
		var k = 0;
		while (k < EarningsHash[grp].length)
		{
			if (ParseNbr(EarningsHash[grp][k].curamount) == 0)
				j++;
			k++;
		}

		// Did we find some old earnings records in this group?
		if (j > 0)
		{
			// Merge all the old payments into the first record
			if (j == EarningsHash[grp].length)
			{
				// All earnings records are old for this group.  Retain one of them, and discard the rest.
				EarningsHash[grp] = EarningsHash[grp].slice(j-1);
				// Do not display a pay rate for old earnings that have been merged into one summary line.
				EarningsHash[grp][0].rate = "";
			}
			else
			{
				// Some earnings records are current.  Discard the old ones.
				EarningsHash[grp] = EarningsHash[grp].slice(j);
			}
		}

		// Make sure the YTD total for the group displays on the first record.
		if (EarningsHash[grp].length > 0)
			EarningsHash[grp][0].amount = ytdAmt;

		// Add the merged group array back to the global YTDEarnings array.
		YTDEarnings = YTDEarnings.concat(EarningsHash[grp]);
	}
}

function AddCurrentDed(dedcode,amount)
{
  	for (var i=0;i<YTDDeductions.length;i++)
  	{
    	if (dedcode==YTDDeductions[i].dedcode)
    	{
      		YTDDeductions[i].curamount = ParseNbr(amount)
      		break
    	}
  	}
}

function GetYTDPayment(index)
{
	if (!appObj)
		appObj = new AppVersionObject(authUser.prodline, "HR");

	// if you call getAppVersion() right away and the IOS object isn't set up yet,
	// then the code will be trying to load the sso.js file, and your call for
	// the appversion will complete before the ios version is set
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
       		setTimeout(function(){ GetYTDPayment(index); }, 10);
       		return;
	}

	var thisPayment = Payment[index];

	YTDPayment = new Array();
	YTDPayroll = new Array();
	YTDDeduct = new Array();
	var checkYr = ParseYear(Payment[index].check_date);
	var YTDBegDate = checkYr+"0101";
	var YTDEndDate = formjsDate(Payment[index].check_date);

	if (fromTask) {
		parent.showWaitAlert(getSeaPhrase("ASSEMBLING_PAY_STUB_INFO","ESS"));
	}

   	var dmeObj         	= new DMEObject(authUser.prodline,"paymastr");
      dmeObj.out      	= "JAVASCRIPT";
      dmeObj.index    	= "pymset4";
      dmeObj.field    	= "check-nbr;check-type,xlt;check-date;per-end-date;"
                     	+ "gross-pay;check-net;net-pay-amt;check-id;employee.salary-class";
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "9.0.1")
	{
		dmeObj.field += ";employee.exempt-emp;employee.work-state;employee.tax-state";
	}
      dmeObj.key      	= authUser.company+"="+authUser.employee+"="+YTDBegDate+"->"+YTDEndDate;
      dmeObj.cond		= "closed;non-gm-adj";
// MOD BY BILAL 
   // JRZ 9/30/08 Adding check type not J to query to avoid manual adjustments
      dmeObj.select = "check-type!=J"
      //~JRZ   
// END OF MOD
      dmeObj.max      	= "600";
      dmeObj.func     	= "GetYTDPayroll("+index+")";
      dmeObj.sortdesc 	= "check-date";
	  dmeObj.debug		= false;
    DME(dmeObj,"dmedata");
}

function StoreCheckIds()
{
	if (YTDPayment.length > 0)
	{
		var firstCheck = YTDPayment[0];

		// If the employee is salaried non-exempt, determine whether all time records should have an hourly
		// rate computed, or just time records with work-state = "CA". If configured, always calculate the rate for hourly employees.
		if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "9.0.1"
		&& firstCheck.employee_salary_class == "S" && firstCheck.employee_exempt_emp != "Y")
		{
			CalcHourlyRate = (HourlyRateStates.indexOf(firstCheck.employee_work_state) >= 0 || HourlyRateStates.indexOf(firstCheck.employee_tax_state) >= 0)
				? "ALL" : HourlyRateStates;
		}
		else if (firstCheck.employee_salary_class == "H" && emssObjInstance.emssObj.calcHourlyRate)
			CalcHourlyRate = "ALWAYS";
	}

	ytdIdList = new Array();
	for (var i=0;i<YTDPayment.length;i++)
	{
		if (i%dmeNbrKeys==0) {
			ytdIdList[ytdIdList.length] = new Array()
		}
		ytdIdList[ytdIdList.length-1][i%dmeNbrKeys] = parseInt(YTDPayment[i].check_id,10);
	}
}

function GetYTDPayroll(index)
{
	YTDPayment = YTDPayment.concat(self.dmedata.record);

	if (self.dmedata.Next!="")
	{
		self.dmedata.location.replace(self.dmedata.Next);
		return
	}

	StoreCheckIds();
	YTDPayroll = new Array();
	CallYTDPayroll(index,0);
}

function CallYTDPayroll(index,ytd_index)
{
	if (parseInt(ytd_index,10)>0)
	{
		YTDPayroll = YTDPayroll.concat(self.dmedata.record);

		if (self.dmedata.Next!="")
		{
			self.dmedata.location.replace(self.dmedata.Next);
			return;
		}
	}

	if (parseInt(ytd_index,10)<ytdIdList.length
	|| parseInt(ytd_index,10)==0 && ytdIdList.length==0)
	{
		var dmeObj			= new DMEObject(authUser.prodline,"prtime");
      		dmeObj.out		= "JAVASCRIPT";
      		dmeObj.field 	= "pay-sum-grp;hours;rate;wage-amount;pay-sum-group.description;check-id;pay-code.calc-type;pay-code.non-earnings;work-state;shft-diff-rate;ot-rate";
      		dmeObj.key   	= authUser.company+"="+authUser.employee+"=";
			if (ytdIdList.length > 0) {
				dmeObj.key += ytdIdList[ytd_index].join(";");
      		}
      		dmeObj.max   	= "600";
      		dmeObj.func  	= "CallYTDPayroll("+index+","+(ytd_index+1)+")";
   			dmeObj.debug	= false;
		DME(dmeObj,"dmedata");
	}
	else
	{
		YTDPayroll.sort(sortByDescription);
		YTDDeduct = new Array();
		CallYTDPaydeductions(index,0);
	}
}

function CallYTDPaydeductions(index,ytd_index)
{
	if (parseInt(ytd_index,10)>0)
	{
		YTDDeduct = YTDDeduct.concat(self.dmedata.record);

		if (self.dmedata.Next!="")
		{
			self.dmedata.location.replace(self.dmedata.Next);
			return;
		}
	}

	if (parseInt(ytd_index,10)<ytdIdList.length
	|| parseInt(ytd_index,10)==0 && ytdIdList.length == 0)
	{
		var dmeObj	  		= new DMEObject(authUser.prodline,"paydeductn");
      		dmeObj.out 		= "JAVASCRIPT";
      		dmeObj.field 	= "ded-code;ded-amt;tax-wages;deduct-code.adjust-pay;"
                   	   	 	+ "deduct-code.calc-type;deduct-code.tax-status;"
                   	     	+ "deduct-code.print-flag;deduct-code.description";
      		dmeObj.key   	= authUser.company+"="+authUser.employee+"=";
			if (ytdIdList.length > 0) {
				dmeObj.key += ytdIdList[ytd_index].join(";");
      		}
      		dmeObj.max   	= "600";
      		dmeObj.func  	= "CallYTDPaydeductions("+index+","+(ytd_index+1)+")";
			dmeObj.debug	= false;
   		DME(dmeObj,"dmedata");
	}
	else {
		var thisCheck = Payment[index];

		if (emssObjInstance.emssObj.periodStartDate && thisCheck.employee_ot_plan_code) {
			GetYTDPeriodStart(index);
		} else {
			DisplayStub(index);
		}
	}
}

function GetYTDPeriodStart(index)
{
	var thisCheck = Payment[index];

	var dmeObj	  		= new DMEObject(authUser.prodline,"protpayprd");
      	dmeObj.out 		= "JAVASCRIPT";
      	dmeObj.field 	= "pay-start-date;pay-end-date";
      	dmeObj.index	= "pryset3";
      	dmeObj.key   	= authUser.company + "=" + escape(thisCheck.employee_ot_plan_code,1);
      	dmeObj.select	= "pay-end-date=" + formjsDate(thisCheck.per_end_date);
      	dmeObj.max   	= "1";
      	dmeObj.func  	= "StoreYTDPeriodStart("+index+")";
		dmeObj.debug	= false;
   	DME(dmeObj,"dmedata");
}

function StoreYTDPeriodStart(index)
{
	if (self.dmedata.record.length > 0 && self.dmedata.record[0].pay_start_date) {
		Payment[index].per_start_date = self.dmedata.record[0].pay_start_date;
	} else {
		Payment[index].per_start_date = "";
	}

	DisplayStub(index);
}

// PT 152784 function to display the last four digit of socialNbr
function getSocialNbr(socialNbr)
{
	return socialNbr.substring((socialNbr.length - 4),socialNbr.length) ;
}
// PT 152784

var StubWind = null;

function DisplayStub(index)
{
	StubWind = window.open("/lawson/xhrnet/ui/windowplain.htm?func=opener.StubContent(" + index + ")","PAYSTUB",
		"resizable=yes,status=no,scrollbars=yes,menubar=yes,toolbar=no,height=575,left=150,width=705");
}

function StubContent(index)
{
    if (!StubWind)
    {
    	return;
    }

    StubWind.document.title = getSeaPhrase("PAY_STUB", "ESS");

	YTDNet = 0;
	YTDEarnings = new Array();
	YTDDeductions = new Array();
	YTDPreTaxDeductions = 0;
	YTDGross = 0;
	YTDNonCash = 0;
	YTDNonTaxableRemuneration = 0;
	NonCash = 0;
	NonTaxableRemuneration = 0;
	NonTaxableRemunerationHours = 0;
	Gross = 0;
	GrossHours = 0;

	var thisCheck = Payment[index];

	for (var i=0; i<YTDPayment.length; i++) {
	   YTDNet += ParseNbr(YTDPayment[i].net_pay_amt);
	}

     //  Put YTD totals into a separate array group for each unique paysumgrp
    for (var i=0;i<YTDPayroll.length;i++)
    {
       var thisPayRec = YTDPayroll[i];
       BuildYTDEarnings(thisPayRec.pay_sum_grp,ParseNbr(thisPayRec.wage_amount),
	   		ParseNbr(thisPayRec.rate),thisPayRec.pay_sum_group_description,
	   		ParseNbr(thisPayRec.hours),thisPayRec.work_state,ParseNbr(thisPayRec.shft_diff_rate),ParseNbr(thisPayRec.ot_rate));

       YTDGross += ParseNbr(thisPayRec.wage_amount);

       // Sum up non-cash wage amounts so they can be pulled out of the deduction totals
       if (thisPayRec.pay_code_calc_type == "F") {
       		if (ParseNbr(thisPayRec.check_id) == ParseNbr(thisCheck.check_id)) {
       			NonCash += ParseNbr(thisPayRec.wage_amount);
       		}
       		YTDNonCash += ParseNbr(thisPayRec.wage_amount);
       }

       // Sum up non-taxable remuneration amounts so they can be added to the deduction totals
       if (ParseNbr(thisPayRec.pay_code_non_earnings) == 1)
       {
       		if (ParseNbr(thisPayRec.check_id) == ParseNbr(thisCheck.check_id)) {
       			NonTaxableRemuneration += ParseNbr(thisPayRec.wage_amount);
       			NonTaxableRemunerationHours += ParseNbr(thisPayRec.hours);
       		}
       		YTDNonTaxableRemuneration += ParseNbr(thisPayRec.wage_amount);
       }
	}

    for (var i=0;i<YTDDeduct.length;i++)
    {
       var thisDedRec = YTDDeduct[i];
       BuildYTDDeductions(thisDedRec.ded_code,ParseNbr(thisDedRec.ded_amt),
	   		thisDedRec.deduct_code_print_flag,thisDedRec.deduct_code_description,
			thisDedRec.deduct_code_calc_type,thisDedRec.deduct_code_tax_status,
			thisDedRec.deduct_code_adjust_pay);
	}

	YTDEarnings.sort(sortByDescription);

	for (var i=0;i<Payroll.length;i++) {
		AddCurrentWage(Payroll[i].pay_sum_grp,ParseNbr(Payroll[i].wage_amount),ParseNbr(Payroll[i].hours),ParseNbr(Payroll[i].rate),Payroll[i].work_state,ParseNbr(Payroll[i].shft_diff_rate),ParseNbr(Payroll[i].ot_rate));
	}

	// Display old earnings as one line per pay sum group.  Current earnings will display as one line per pay rate for each
	// pay sum group.  Without this step, old earnings would be itemized as well--we wish to summarize those.
	MergeYTDEarnings();

    for (var i=0;i<Deductions.length;i++) {
    	AddCurrentDed(Deductions[i].dedcode,ParseNbr(Deductions[i].amount));
	}

	Gross = EarnedAmount - NonTaxableRemuneration;
	YTDGross -= YTDNonTaxableRemuneration;
	GrossHours = EarnedHours - NonTaxableRemunerationHours;
    var TotalDeductions = thisCheck.gross_pay - thisCheck.net_pay_amt - NonCash + NonTaxableRemuneration;
	var YTDTotalDeductions = YTDGross - YTDNet - YTDNonCash + YTDNonTaxableRemuneration;

	var tmpStr = "";
	var tblHtml = "";
	var strHtml = "";

	var ShowStartDate = (emssObjInstance.emssObj.periodStartDate && thisCheck.per_start_date) ? true : false;

// MOD BY BILAL
      // JRZ 3/16/2010 want to show the print button on every browser
    // Firefox 3.0.x on Mac OS X does not display the menu bar for printing.
//    if (clientBrowser.isFirefox && clientBrowser.isMAC)
//	{
//		strHtml += '<div style="width:100%;text-align:right">';
		strHtml += '<br><div style="width:100%;text-align:center">';
		strHtml += uiButton(getSeaPhrase("PRINT","ESS"), "window.focus();window.print()", "", "printBtn");
		strHtml += '</div>';
//	}
// END OF MOD

	strHtml += '<div style="position:absolute;padding:10px;width:670px">'
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">';
	strHtml += '<tr>';
	strHtml += '<td style="text-align:left;width:233px">';

	// Company logo
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">';
	strHtml += '<tr>';
	strHtml += '<td class="plaintableheadertallwhite" nowrap>';

	if (CompLogo) {
		strHtml += '<img alt="'+getSeaPhrase("TEXT_COMPANY_LOGO","ESS").replace(/\'/g,"\\'")+'" src="'+CompLogo.src+'">';
	}
	else {
		strHtml += CompInfo.name.toUpperCase();
	}

	strHtml += '</td></tr>';

	for (var i=1; i<=4; i++)
	{
		var addrLine = eval("CompInfo.addr"+i);
		if (addrLine && NonSpace(addrLine)) {
			strHtml += '<tr><td class="plaintablecellsmall" nowrap>'+addrLine+'</td></tr>';
		}
	}

 	strHtml += '<tr><td class="plaintablecellsmall" nowrap>'+CompInfo.city;

	if (CompInfo.state && NonSpace(CompInfo.state)) {
		strHtml += ', '+CompInfo.state;
	}

	strHtml += (CompInfo.zip)?' '+CompInfo.zip:'';
	strHtml += (CompInfo.country_country_desc)?' '+CompInfo.country_country_desc:'';
	strHtml += '</td></tr>';
	strHtml += '</table>';

	strHtml += '</td>';
	strHtml += '<td style="text-align:left;width:233px">';

	// Bank logo
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">';
	strHtml += '<tr>';
	strHtml += '<td class="plaintableheadertallwhite" nowrap>';

	if (BankLogo) {
		strHtml += '<img alt="'+getSeaPhrase("TEXT_BANK_LOGO","ESS").replace(/\'/g,"\\'")+'" src="'+BankLogo.src+'">';
	}

	strHtml += '</td></tr>';
	strHtml += '</table>';

	strHtml += '</td>';
	strHtml += '<td style="text-align:right;width:233px">';

	// Check number, check date
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">';
	strHtml += '<tr>';
	strHtml += '<td class="fieldlabelbold">'+getSeaPhrase("NUMBER","ESS")+'</td>';
	strHtml += '<td class="plaintablecell" style="text-align:right" nowrap>';
	strHtml += thisCheck.check_nbr+'</td>';
	strHtml += '</tr>';
	strHtml += '<tr>';
	strHtml += '<td class="fieldlabelbold">'
	strHtml += (thisCheck.country_code=="CA")?getSeaPhrase("CHEQUE_DATE","ESS"):getSeaPhrase("CHECK_DATE","ESS");
	strHtml += '</td>';
	strHtml += '<td class="plaintablecell" style="text-align:right" nowrap>';
	strHtml += thisCheck.check_date+'</td>';
	strHtml += '</tr>';
	strHtml += '</table>';

	strHtml += '</td></tr>';
	strHtml += '</table>';

	// Spacer
	strHtml += '<div style="height:40px">&nbsp;</div>';

	// Void line
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">';
	strHtml += '<tr>';
	strHtml += '<td class="plaintablecell" style="text-align:left;padding-bottom:20px;font-style:italic">';
	strHtml += getSeaPhrase("VOIDS","ESS")
	strHtml += '</td>';
	strHtml += '</tr>';
	strHtml += '<tr>';
	strHtml += '<td style="text-align:right;width:50%">';

	// Pay to the order of
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">';
	strHtml += '<tr>';
	strHtml += '<th class="plaintableheadertallwhite" style="text-align:left">'+getSeaPhrase("PAY_FOR","ESS")+'</th>';
	strHtml += '</tr>';
	strHtml += '<tr>';
	strHtml += '<td class="plaintablecell" nowrap>'+thisCheck.employee_label_name_1+'</td>';
	strHtml += '</tr>';
	if (thisCheck.employee_addr1) {
		strHtml += '<tr>';
		strHtml += '<td class="plaintablecell" nowrap>'+thisCheck.employee_addr1+'</td>';
		strHtml += '</tr>';
	}
	if (thisCheck.employee_addr2) {
		strHtml += '<tr>';
		strHtml += '<td class="plaintablecell" nowrap>'+thisCheck.employee_addr2+'</td>';
		strHtml += '</tr>';
	}
	if (thisCheck.employee_addr3) {
		strHtml += '<tr>';
		strHtml += '<td class="plaintablecell" nowrap>'+thisCheck.employee_addr3+'</td>';
		strHtml += '</tr>';
	}
	if (thisCheck.employee_addr4) {
		strHtml += '<tr>';
		strHtml += '<td class="plaintablecell" nowrap>'+thisCheck.employee_addr4+'</td>';
		strHtml += '</tr>';
	}
	strHtml += '<tr>';
	strHtml += '<td class="plaintablecell" nowrap>'+thisCheck.employee_city;
	strHtml += (thisCheck.employee_state)?', '+thisCheck.employee_state:'';
	strHtml += (thisCheck.employee_zip)?' '+thisCheck.employee_zip:'';
	strHtml += '</td>';
	strHtml += '</tr>';
	if (thisCheck.country_code) {
		strHtml += '<tr>';
		strHtml += '<td class="plaintablecell" nowrap>'+thisCheck.country_code+'</td>';
		strHtml += '</tr>';
	}
	strHtml += '</table>';

	strHtml += '</td>';
	strHtml += '<td style="text-align:right;width:50%">';

	// Check amount, Non-negotiable
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">';
	strHtml += '<tr>';
	strHtml += '<td class="plaintablecell" style="text-align:right">';
	strHtml += '<span class="dialoglabel" style="padding:0px;margin:0px">' + getSeaPhrase("NET_PAY","ESS") + '&nbsp;&nbsp;</span>';
	strHtml += roundToDecimal(ParseNbr(thisCheck.net_pay_amt),2);
	strHtml += '</td>';
	strHtml += '</tr>';
	strHtml += '<tr>';
	strHtml += '<td class="plaintablecell" style="text-align:right">&nbsp;';
	strHtml += '</td>';
	strHtml += '</tr>';
	strHtml += '<tr>';
	strHtml += '<th class="plaintableheadertallwhite" style="text-align:right">';
	strHtml += getSeaPhrase("NON_NEGOTIABLE","ESS");
	strHtml += '</th>';
	strHtml += '</tr>';
	strHtml += '</table>';

	strHtml += '</td>';
	strHtml += '</tr>';
	strHtml += '</table>';

	// Spacer
	strHtml += '<div style="height:20px">&nbsp;</div>';

    var tblCellWidths;
    if (ShowStartDate)
    	tblCellWidths = new Array("35%", "15%", "10%", "10%", "10%", "10%", "10%");
    else
    	tblCellWidths = new Array("35%", "17%", "12%", "12%", "12%", "", "12%");

	strHtml += '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">';
	strHtml += '<tr>';
	strHtml += '<th class="plaintableheaderborder" style="text-align:center;width:' + tblCellWidths[0] + '">';
	strHtml += getSeaPhrase("NAME","ESS");
	strHtml += '</th>';
	strHtml += '<th class="plaintableheaderborder" style="text-align:center;width:' + tblCellWidths[1] + '">';
	strHtml += getSeaPhrase("HOME_ADDR_16","ESS");
	strHtml += '</th>';
	strHtml += '<th class="plaintableheaderborder" style="text-align:center;width:' + tblCellWidths[2] + '">';
	strHtml += getSeaPhrase("EMPLOYEE_NUMBER","ESS");
	strHtml += '</th>';
	strHtml += '<th class="plaintableheaderborder" style="text-align:center;width:' + tblCellWidths[3] + '">';
	strHtml += getSeaPhrase("JOB_PROFILE_3","ESS");
	strHtml += '</th>';
	strHtml += '<th class="plaintableheaderborder" style="text-align:center;width:' + tblCellWidths[4] + '">';
	strHtml += getSeaPhrase("JOB_PROFILE_4","ESS");
	strHtml += '</th>';

	if (ShowStartDate) {
		strHtml += '<th class="plaintableheaderborder" style="text-align:center;width:' + tblCellWidths[5] + '">';
		strHtml += getSeaPhrase("PERIOD_START","ESS");
		strHtml += '</th>';
	}

	strHtml += '<th class="plaintableheaderborder" style="text-align:center;width:' + tblCellWidths[6] + '">';
	strHtml += getSeaPhrase("PERIOD_END","ESS");
	strHtml += '</th>';
	strHtml += '</tr>';
	strHtml += '<tr>';
	strHtml += '<td class="plaintablecellborder" style="text-align:center">';
	strHtml += (thisCheck.employee_label_name_1)?thisCheck.employee_label_name_1:'&nbsp;';
	strHtml += '</td>';
	strHtml += '<td class="plaintablecellborder" style="text-align:center" nowrap>';
	strHtml += (thisCheck.employee_fica_nbr)?getSocialNbr(thisCheck.employee_fica_nbr):'&nbsp;';
	strHtml += '</td>';
	strHtml += '<td class="plaintablecellborder" style="text-align:center" nowrap>';
	strHtml += (authUser.employee)?authUser.employee:'&nbsp;';
	strHtml += '</td>';
	strHtml += '<td class="plaintablecellborder" style="text-align:center" nowrap>';
	strHtml += (thisCheck.employee_process_level)?thisCheck.employee_process_level:'&nbsp;';
	strHtml += '</td>';
	strHtml += '<td class="plaintablecellborder" style="text-align:center" nowrap>';
	strHtml += (thisCheck.employee_department)?thisCheck.employee_department:'&nbsp;';
	strHtml += '</td>';

	if (ShowStartDate) {
		strHtml += '<td class="plaintablecellborder" style="text-align:center" nowrap>';
		strHtml += (thisCheck.per_start_date)?thisCheck.per_start_date:'&nbsp;';
		strHtml += '</td>';
	}

	strHtml += '<td class="plaintablecellborder" style="text-align:center" nowrap>';
	strHtml += (thisCheck.per_end_date)?thisCheck.per_end_date:'&nbsp;';
	strHtml += '</td>';
	strHtml += '</tr>';
	strHtml += '</table>';

	// Spacer
	strHtml += '<div style="height:20px">&nbsp;</div>';

	//
	// Summary table
	//

	tmpStr = '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">'
	+ '<tr>'
	+ '<th class="plaintableheaderborder" style="text-align:center;width:42%">'
	+ getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th>'
	+ '<th class="plaintableheaderborder" style="text-align:center;width:14%">'
	+ getSeaPhrase("HOURS","ESS")+'</th>'
	+ '<th class="plaintableheaderborder" style="text-align:center;width:22%">'
	+ getSeaPhrase("CURRENT","ESS")+'</th>'
	+ '<th class="plaintableheaderborder" style="text-align:center;width:22%">'
	+ getSeaPhrase("YEAR_TO_DATE","ESS")+'</th>'
	+ '</tr>'

	// Total Gross
	tmpStr += '<tr>'
	+ '<td class="plaintablerowheaderborderwhite" style="text-align:right;width:42%">'
	+ getSeaPhrase("TOTAL_GROSS","ESS")+'</th>'
	+ '<td class="plaintablecellborder" style="text-align:right;width:14%" nowrap>'
	+ ((ParseNbr(GrossHours))?roundToDecimal(ParseNbr(GrossHours),2):'&nbsp;')+'</td>'
	+ '<td class="plaintablecellborder" style="text-align:right;width:22%" nowrap>'
	+ ((ParseNbr(Gross))?roundToDecimal(ParseNbr(Gross),2):'&nbsp;')+'</td>'
	+ '<td class="plaintablecellborder" style="text-align:right;width:22%" nowrap>'
	+ ((ParseNbr(YTDGross))?roundToDecimal(ParseNbr(YTDGross),2):'&nbsp;')+'</td>'
	+ '</tr>'

	// Total Deductions
	tmpStr += '<tr>'
	+ '<td class="plaintablerowheaderborderwhite" style="text-align:right;width:42%">'
	+ getSeaPhrase("TOTAL_DEDUCTIONS","ESS")+'</th>'
	+ '<td class="plaintablecellborder" style="text-align:right;width:14%" nowrap>&nbsp;</td>'
	+ '<td class="plaintablecellborder" style="text-align:right;width:22%" nowrap>'
	+ ((ParseNbr(TotalDeductions))?roundToDecimal(ParseNbr(TotalDeductions),2):'&nbsp;')+'</td>'
	+ '<td class="plaintablecellborder" style="text-align:right;width:22%" nowrap>'
	+ ((ParseNbr(YTDTotalDeductions))?roundToDecimal(ParseNbr(YTDTotalDeductions),2):'&nbsp;')+'</td>'
	+ '</tr>'

	// Total Net
	tmpStr += '<tr>'
	+ '<td class="plaintablerowheaderborderwhite" style="text-align:right;width:42%">'
	+ getSeaPhrase("TOTAL_NET","ESS")+'</th>'
	+ '<td class="plaintablecellborder" style="text-align:right;width:14%" nowrap>&nbsp;</td>'
	+ '<td class="plaintablecellborder" style="text-align:right;width:22%" nowrap>'
	+ ((ParseNbr(thisCheck.net_pay_amt))?roundToDecimal(ParseNbr(thisCheck.net_pay_amt),2):'&nbsp;')+'</td>'
	+ '<td class="plaintablecellborder" style="text-align:right;width:22%" nowrap>'
	+ ((ParseNbr(YTDNet))?roundToDecimal(ParseNbr(YTDNet),2):'&nbsp;')+'</td>'
	+ '</tr>'

	tmpStr += '</table>';

	tblHtml += uiTable(getSeaPhrase("SUMMARY","ESS"),tmpStr);

	//
	// Earnings table
	//

	tmpStr = '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">'
	+ '<tr>'
	+ '<th class="plaintableheaderborder" style="text-align:center;width:40%">'
	+ getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th>'
	+ '<th class="plaintableheaderborder" style="text-align:center;width:12%">'
	+ getSeaPhrase("HOURS","ESS")+'</th>'
	+ '<th class="plaintableheaderborder" style="text-align:center;width:12%">'
	+ getSeaPhrase("PAY_RATE_2","ESS")+'</th>'
	+ '<th class="plaintableheaderborder" style="text-align:center;width:18%">'
	+ getSeaPhrase("CURRENT","ESS")+'</th>'
	+ '<th class="plaintableheaderborder" style="text-align:center;width:18%">'
	+ getSeaPhrase("YEAR_TO_DATE","ESS")+'</th>'
	+ '</tr>'

	var earningsExist = false;
	var lastEarningDesc = "";
	var rateDecimalCount = (CalcHourlyRate == "ALWAYS") ? 4 : 2;

   	for (var i=0; i<YTDEarnings.length; i++)
	{
		if (Number(YTDEarnings[i].hours) != 0 || Number(YTDEarnings[i].curhours) != 0 || Number(YTDEarnings[i].curamount) != 0 || Number(YTDEarnings[i].amount) != 0)
		{
			earningsExist = true;
			tmpStr += '<tr>'
			+ '<td class="plaintablecellborder" style="text-align:right;width:40%" nowrap>'
			+ ((YTDEarnings[i].description && YTDEarnings[i].description != lastEarningDesc)?YTDEarnings[i].description:'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:right;width:12%" nowrap>'
			+ ((YTDEarnings[i].curhours)?roundToDecimal(ParseNbr(YTDEarnings[i].curhours),2):'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:right;width:12%" nowrap>'
			+ ((YTDEarnings[i].rate)?roundToDecimal(ParseNbr(YTDEarnings[i].rate),rateDecimalCount):'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:right;width:18%" nowrap>'
			+ ((YTDEarnings[i].curamount)?roundToDecimal(ParseNbr(YTDEarnings[i].curamount),2):'&nbsp;')+'</td>'
			+ '<td class="plaintablecellborder" style="text-align:right;width:18%" nowrap>'
			+ ((YTDEarnings[i].amount)?roundToDecimal(ParseNbr(YTDEarnings[i].amount),2):'&nbsp;')+'</td>'
			+ '</tr>'
			lastEarningDesc = YTDEarnings[i].description;
		}
	}

	tmpStr += '</table>';

	if (earningsExist) {
		tblHtml += uiTable(getSeaPhrase("EARNINGS","ESS"),tmpStr);
	}

	//
	// Deductions table
	//

	tmpStr = '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">'
	+ '<tr>'
	+ '<th class="plaintableheaderborder" style="text-align:center;width:56%;border-right:0px">'
	+ getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th>'
	+ '<th class="plaintableheaderborder" style="text-align:center;width:22%">'
	+ getSeaPhrase("CURRENT","ESS")+'</th>'
	+ '<th class="plaintableheaderborder" style="text-align:center;width:22%">'
	+ getSeaPhrase("YEAR_TO_DATE","ESS")+'</th>'
	+ '</tr>'

   	for (var i=0; i<YTDDeductions.length; i++)
   	{
   		// PT 139776
		//if (YTDDeductions[i].curamount != "") {

		tmpStr += '<tr>'
		+ '<td class="plaintablecellborder" style="text-align:right;width:56%" nowrap>'
		+ ((YTDDeductions[i].description)?YTDDeductions[i].description:'&nbsp;')+'</td>'
		+ '<td class="plaintablecellborder" style="text-align:right;width:22%" nowrap>'
		+ ((YTDDeductions[i].curamount)?roundToDecimal(ParseNbr(YTDDeductions[i].curamount),2):'&nbsp;')+'</td>'
		+ '<td class="plaintablecellborder" style="text-align:right;width:22%" nowrap>'
		+ ((YTDDeductions[i].amount)?roundToDecimal(ParseNbr(YTDDeductions[i].amount),2):'&nbsp;')+'</td>'
		+ '</tr>'

		//}
   	}

	tmpStr += '</table>';

	if (YTDDeductions.length > 0) {
		tblHtml += uiTable(getSeaPhrase("DEDUCTIONS","ESS"),tmpStr);
	}

	//
	// Auto Deposit table
	//

	if (AutoDeposit)
	{
		var thisPayment = Payment[index];

		tmpStr = '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">';
		+ '<tr>'

		if (thisPayment.country_code == "CA") {
				tmpStr += '<th class="plaintableheaderborder" style="text-align:center;width:17%">'
				+ getSeaPhrase("CA_BANK_INSTITUTION","ESS")+'</th>'
				+ '<th class="plaintableheaderborder" style="text-align:center;width:15%">'
				+ getSeaPhrase("TRANSIT","ESS")+'</th>'
				+ '<th class="plaintableheaderborder" style="text-align:center;width:24%">'
				+ getSeaPhrase("ACCOUNT","ESS")+'</th>'
				+ '<th class="plaintableheaderborder" style="text-align:center;width:20%">'
				+ getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th>'
				+ '<th class="plaintableheaderborder" style="text-align:center;width:24%">'
				+ getSeaPhrase("AMOUNT","ESS")+'</th>';
		}
		else {
				tmpStr += '<th class="plaintableheaderborder" style="text-align:center;width:23%">'
				+ getSeaPhrase("ROUTING","ESS")+'</th>'
				+ '<th class="plaintableheaderborder" style="text-align:center;width:35%">'
				+ getSeaPhrase("ACCOUNT","ESS")+'</th>'
				+ '<th class="plaintableheaderborder" style="text-align:center;width:21%">'
				+ getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th>'
				+ '<th class="plaintableheaderborder" style="text-align:center;width:21%">'
				+ getSeaPhrase("AMOUNT","ESS")+'</th>';
		}

		tmpStr += '</tr>';

		for (var i=0; i<ACHAccounts.length; i++)
		{
			var thisAch = ACHAccounts[i];

			tmpStr += '<tr>';

			if (thisPayment.country_code == "CA") {
				if (emssObjInstance.emssObj.maskBankInfo)
				{
					thisAch.ca_transit_nbr = maskDigits(thisAch.ca_transit_nbr, "x", 4, ACHFieldSize["ca_transit_nbr"]);
					thisAch.emp_ach_depst_ebnk_acct_nbr = maskDigits(thisAch.emp_ach_depst_ebnk_acct_nbr, "x", 4, ACHFieldSize["emp_ach_depst_ebnk_acct_nbr"]);
					thisAch.ca_inst_nbr = maskDigits(thisAch.ca_inst_nbr, "x", 4, ACHFieldSize["ca_inst_nbr"]);
				}			
				tmpStr += '<td class="plaintablecellborder" style="text-align:center;width:17%" nowrap>'
				+ ((thisAch.ca_inst_nbr)?thisAch.ca_inst_nbr:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:15%" nowrap>'
				+ ((thisAch.ca_transit_nbr)?thisAch.ca_transit_nbr:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:24%" nowrap>'
				+ ((thisAch.emp_ach_depst_ebnk_acct_nbr)?thisAch.emp_ach_depst_ebnk_acct_nbr:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:20%" nowrap>'
				+ ((thisAch.emp_ach_depst_description)?thisAch.emp_ach_depst_description:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:right;width:24%" nowrap>'
				+ ((thisAch.dist_amount)?thisAch.dist_amount:'&nbsp;')+'</td>';
			}
			else {
				if (emssObjInstance.emssObj.maskBankInfo)
				{
//	MOD BY BILAL - unmasking the Routing number
//					thisAch.emp_ach_depst_ebank_id = maskDigits(thisAch.emp_ach_depst_ebank_id, "x", 4, ACHFieldSize["emp_ach_depst_ebank_id"]);
// END OF MOD
					thisAch.emp_ach_depst_ebnk_acct_nbr = maskDigits(thisAch.emp_ach_depst_ebnk_acct_nbr, "x", 4, ACHFieldSize["emp_ach_depst_ebnk_acct_nbr"]);
				}			
				tmpStr += '<td class="plaintablecellborder" style="text-align:center;width:23%" nowrap>'
				+ ((thisAch.emp_ach_depst_ebank_id)?thisAch.emp_ach_depst_ebank_id:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:35%" nowrap>'
				+ ((thisAch.emp_ach_depst_ebnk_acct_nbr)?thisAch.emp_ach_depst_ebnk_acct_nbr:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:center;width:21%" nowrap>'
				+ ((thisAch.emp_ach_depst_description)?thisAch.emp_ach_depst_description:'&nbsp;')+'</td>'
				+ '<td class="plaintablecellborder" style="text-align:right;width:21%" nowrap>'
				+ ((thisAch.dist_amount)?thisAch.dist_amount:'&nbsp;')+'</td>';
			}

			tmpStr += '</tr>';
		}

		tmpStr += '</table>';

		tblHtml += uiTable(getSeaPhrase("AUTO_DEPOSIT_DISTRIBUTIONS","ESS"),tmpStr);
	}

	// Display the summary tables
	strHtml += '<div style="width:650px">';
	strHtml += tblHtml;
	strHtml += '</div>';
	strHtml += '</div>';


    StubWind.document.getElementById("paneBody1").innerHTML = strHtml;
    StubWind.stylePage();
	StubWind.focus();

    if (fromTask) {
		parent.removeWaitAlert();
    }
}

function ParseYear(date)
{
	if (!date) return "";

	var strDate = date.toString().substring(6,10);
	return parseInt(strDate,10);
}

function ParseNbr(value)
{
   	if (!value || !value.toString().length) return 0;

   	var strValue = value.toString();
   	var fmtValue = value;

   	if (strValue.charAt(strValue.length-1) == "-") {
   	  	fmtValue = "-" + parseFloat(strValue.substring(0,strValue.length-1));
	}

   	return parseFloat(fmtValue);
}

function sortByDescription(obj1, obj2)
{
	var name1 = obj1.description;
	var name2 = obj2.description;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function sortByCurrentAmt(obj1, obj2)
{
//PT 154348
 		var name1 = parseFloat(obj1.curamount);
    var name2 = parseFloat(obj2.curamount);
    if ((isNaN(name1) && !isNaN(name2)) || (name1 < name2))
        return -1;
    else if ((!isNaN(name1) && isNaN(name2)) || (name1 > name2))
        return 1;
//PT 154348
    else
        return 0;
}

function PreCacheLogos()
{
	CompLogo = new Image();
	BankLogo = new Image();

	var bankcode = repStrs(CompInfo.bank_code.toUpperCase()," ","_");
	var compid = authUser.company.toString();

	for (var i=compid.length;i<4;i++) {
		compid = "0" + compid;
	}

	var j = bankcode.length-1;
	while (bankcode.charAt(j) == "_")
	{
		bankcode = bankcode.substring(0,j);
		j--;
	}

	CompLogo.src = logoDir+"cmp"+compid+".gif";
	BankLogo.src = logoDir+"bnk"+bankcode+".gif";

	with (self.imgcache.document)
	{
		open();
		var pagetext = "<body>"
			+ "<img src='"+CompLogo.src+"' alt='' onError='javascript:parent.CompLogo=null'>"
			+ "<img src='"+BankLogo.src+"' alt='' onError='javascript:parent.BankLogo=null'>"
			+ "</body>";
		write(pagetext);
		close();
	}
}
</script>
<!-- MOD BY BILAL - prior Customization -->
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
<body onload="GetWebuser()">
	<iframe id="checklist" name="checklist" src="/lawson/xhrnet/ui/headerpane.htm" style="visibility:hidden;position:absolute;left:0px;width:336px;top:0px;height:274px" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="checklistdtl" name="checklistdtl" src="/lawson/xhrnet/ui/headerpanelite.htm" style="visibility:hidden;position:absolute;left:0px;width:336px;top:120px;height:274px" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="summary" name="summary" src="/lawson/xhrnet/ui/headerpanelite.htm" style="visibility:hidden;position:absolute;left:0px;width:336px;top:274px;height:190px" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="detail" name="detail" src="/lawson/xhrnet/ui/pane.htm" style="visibility:hidden;position:absolute;left:336px;width:418px;top:0px;height:464px" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="dmedata" name="dmedata" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/dot.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="imgcache" name="imgcache" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/dot.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
</body>
<!-- Version: 8-)@(#)@(201111) 09.00.01.06.00 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/paytyear.htm,v 1.15.2.55 2011/05/04 21:10:10 brentd Exp $ -->
