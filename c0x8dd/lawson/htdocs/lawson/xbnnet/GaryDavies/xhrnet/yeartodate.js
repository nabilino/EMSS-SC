// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/yeartodate.js,v 1.1.2.9 2011/05/27 16:54:45 brentd Exp $
//////////////////////////////////////////////////////////////////////////////////////////
//
// Year To Date History: Version 801
// Changes incorporate Canadian Payroll.
// Last Updated: 10/2/2000
//
//
// MOD BY BIAL
/* St. Luke's Changelog
  JRZ 9/9/08 Adding checks on hours and wage variables that they are not blank to avoid NaN problem.
*/
// END OF MOD
//////////////////////////////////////////////////////////////////////////////////////////
// External Variables									
//

var PayChecks = new PayChecksObject();
var FunctionCall;
var YTDPaymentsForYear;
var YTDRecordsForYear;
var YTDDedsForYear;
var ytdCheckIdList;
var dmeNbrKeys = 50;

//////////////////////////////////////////////////////////////////////////////////////////
// Class structure for Pay Check object							
//

function PayChecksObject()
{
	this.EmployeeCode = null;
	this.EmployeeName = null;
	this.Year = new Array(0);
	this.StoreYear = StoreYear;
	this.FindYear = FindYear;
	this.GetQuartwage = GetQuartwage;
	this.GetQuartDed = GetQuartDed;
	this.TotalWagesEarned = TotalWagesEarned;
	this.TotalDeductionsEarned = TotalDeductionsEarned;
	this.func = null;
	this.YearDetail = new Array(0);
}

function YearObject(Year)
{
	this.Year = Year;
	this.Country = new Array(0);
	this.StoreCountry = StoreCountry;
	this.FindCountry = FindCountry;
}

function CountryObject(Code, Description)
{
	this.Code = Code;
	this.Description = Description;
	this.Currency = new Array(0);
	this.StoreCurrency = StoreCurrency;
	this.FindCurrency = FindCurrency;
}

function CurrencyObject(Code, Description)
{
	this.Code = Code;
	this.Description = Description;
	this.Wages = null;
	this.Ded = null;
}

function WagesObject(Code, Name)
{
	this.TotalHours = 0;
	this.TotalWages = 0;
	this.PaySumGrp = new Array(0);
	this.StorePaySumGrp = StorePaySumGrp;
}

function PaySumGrpObject(GroupCode, GroupName)
{
	this.Code = GroupCode;
	this.Description = GroupName;
	this.TotalHours = 0;
	this.TotalWages = 0;
	this.Quarter = new Array(0);
	this.StoreQuarter = StoreQuarter;
}

function WagesQuarterObject(Quarter, Hours, WageAmount, ProcessLevel, WorkState)
{
	this.Quarter = Quarter;
	this.Hours = Hours;
	this.WageAmount = WageAmount;
    this.ProcessLevel = ProcessLevel;
    this.WorkState = WorkState;
}

function DedObject()
{
	this.TotalAmount = 0;
	this.TotalWages = 0;
	this.DeductionGroups = new Array(0);
	this.StoreDeductions = StoreDeductions;
}

function DeductionGroupsObject(GroupCode, GroupName)
{
	this.Code = GroupCode;
	this.Description = GroupName;
	this.Section = null;
	this.TotalAmount = 0;
	this.TotalWages = 0;
	this.Quarter = new Array(0);
	this.StoreDeductionsQuarter = StoreDeductionsQuarter;
}

function DeductionsQuarterObject(Quarter, DedAmt, WageAmount, TaxWages, ProcessLevel, WorkState)
{
	this.Quarter = Quarter;
	this.DedAmt = DedAmt;
	this.WageAmount = WageAmount;
	this.TaxWages = TaxWages;
    this.ProcessLevel = ProcessLevel;
    this.WorkState = WorkState;
}	

//////////////////////////////////////////////////////////////////////////////////////////
// Methods for current year when future payments should not display - use detail files
//
function GetYTDPaymentsForYear(year, func)
{
	PayChecks.func = func;
	var fromDate = year + "0101";
	var toDate = year + "1231";
	if (!emssObjInstance.emssObj.futurePayments && Number(toDate) > Number(authUser.date)) {
		toDate = authUser.date;
	}
	YTDPaymentsForYear = new Array();
	var pDMEObj = new DMEObject(authUser.prodline, "paymastr")
	pDMEObj.out = "JAVASCRIPT"
	pDMEObj.index = "pymset4"
	pDMEObj.key = parseInt(authUser.company,10) +"="+ parseInt(authUser.employee,10) +"="+ fromDate +"->"+ toDate;
	pDMEObj.cond = "closed;non-gm-adj";		
	pDMEObj.max = "600"
	pDMEObj.func = "StoreYTDPaymentsForYear('"+year+"')"
    pDMEObj.sortdesc = "check-date";
	pDMEObj.field = "check-id";
	pDMEObj.debug = false;
	DME(pDMEObj, "jsreturn");
}

function StoreYTDCheckIds()
{
	ytdCheckIdList = new Array();
	for (var i=0; i<YTDPaymentsForYear.length; i++) {
		if (i%dmeNbrKeys == 0) {
			ytdCheckIdList[ytdCheckIdList.length] = new Array();
		}
		ytdCheckIdList[ytdCheckIdList.length-1][i%dmeNbrKeys] = parseInt(YTDPaymentsForYear[i].check_id,10);
	}
}

function StoreYTDPaymentsForYear(year)
{
	YTDPaymentsForYear = YTDPaymentsForYear.concat(self.jsreturn.record);
	if (self.jsreturn.Next) {
		self.jsreturn.location.replace(self.jsreturn.Next);
		return;
	}
	StoreYTDCheckIds();
	YTDRecordsForYear = new Array();
	GetYTDRecordsForYear(year, 0);	
}

function GetYTDRecordsForYear(year, ytd_index)
{
	if (parseInt(ytd_index,10) > 0) {
		YTDRecordsForYear = YTDRecordsForYear.concat(self.jsreturn.record);
		if (self.jsreturn.Next) {
			self.jsreturn.location.replace(self.jsreturn.Next);
			return;
		}
	}
	if (parseInt(ytd_index,10) < ytdCheckIdList.length
	|| parseInt(ytd_index,10) == 0 && ytdCheckIdList.length == 0) {
		var pDMEObj = new DMEObject(authUser.prodline, "prtime")
		pDMEObj.out = "JAVASCRIPT"
		pDMEObj.index = "prtset1"
		pDMEObj.key = parseInt(authUser.company,10) +"="+ parseInt(authUser.employee,10) +"=";
		if (ytdCheckIdList.length > 0) {
			pDMEObj.key += ytdCheckIdList[ytd_index].join(";");
      	}		
		pDMEObj.max = "600";
		pDMEObj.func = "GetYTDRecordsForYear("+year+","+(ytd_index+1)+")";
		pDMEObj.field = "employee;employee.label-name-1;payroll-year;quarter;pay-sum-grp;hours;wage-amount;"
		+ "pay-sum-group.description;country-code;currency-code;process-level;work-state;";
		pDMEObj.debug = false;
		DME(pDMEObj, "jsreturn");
	} else {
		YTDRecordsForYear.sort(sortByDescription);
		YTDDedsForYear = new Array();
		GetYTDDedsForYear(year, 0);
	}
}
		
function GetYTDDedsForYear(year, ytd_index)
{
	if (parseInt(ytd_index,10) > 0) {
		YTDDedsForYear = YTDDedsForYear.concat(self.jsreturn.record);
		if (self.jsreturn.Next) {
			self.jsreturn.location.replace(self.jsreturn.Next);
			return;
		}
	}
	if (parseInt(ytd_index,10) < ytdCheckIdList.length
	|| parseInt(ytd_index,10) == 0 && ytdCheckIdList.length == 0) {
		var pDMEObj	= new DMEObject(authUser.prodline,"paydeductn");
      		pDMEObj.out = "JAVASCRIPT";
      		pDMEObj.index = "pydset1"
      		pDMEObj.field = "payroll-year;quarter;ded-code;ded-amt;tax-wages;wage-amount;"
				+ "deduct-code.adjust-pay;deduct-code.calc-type;deduct-code.tax-status;"
				+ "deduct-code.print-flag;deduct-code.description;country-code;currency-code;work-state;process-level";
      		pDMEObj.key = authUser.company+"="+authUser.employee+"=";
			if (ytdCheckIdList.length > 0) {
				pDMEObj.key += ytdCheckIdList[ytd_index].join(";");
      		}
      		pDMEObj.max = "600";
      		pDMEObj.func = "GetYTDDedsForYear("+year+","+(ytd_index+1)+")";
			pDMEObj.debug = false;
   		DME(pDMEObj, "jsreturn");
	}
	else {
		FillYTDObjectsForYear(year);	
	}
}
		
function FillYTDObjectsForYear(year)
{
	var pYearObj, pCountryObj, pCurrencyObj, pPaySumGrpObj, pQuarterObj, pDeductionsObj;
	var i;
	var len = YTDRecordsForYear.length;
	for (i=0; i<len; i++) {
		var pObj = YTDRecordsForYear[i];
		PayChecks.EmployeeCode = pObj.employee;
		PayChecks.EmployeeName = pObj.employee_label_name_1;		
		pYearObj = PayChecks.StoreYear(pObj.payroll_year);
		pCountryObj = pYearObj.StoreCountry(pObj.country_code);
		pCurrencyObj = pCountryObj.StoreCurrency(pObj.currency_code, false);
		pPaySumGrpObj = pCurrencyObj.StorePaySumGrp(pObj.pay_sum_grp,
													pObj.pay_sum_group_description
		);
		pQuarterObj = pPaySumGrpObj.StoreQuarter(pObj.quarter,
												 pObj.hours,
												 pObj.wage_amount,
	                                             pObj.process_level,
	                                             pObj.work_state
		);										
	}
	
	len = YTDDedsForYear.length;
	for (i=0; i<len; i++) {
		var pObj = YTDDedsForYear[i];
		pObj.ded_amt = EvaluateBCD(pObj.ded_amt)
		pObj.wage_amount = EvaluateBCD(pObj.wage_amount)
		pObj.tax_wages = EvaluateBCD(pObj.tax_wages)
		pObj.deduction_code_description = pObj.deduct_code_description;
		pObj.deduction_code_adjust_pay = pObj.deduct_code_adjust_pay;
		pObj.deduction_code_calc_type = pObj.deduct_code_calc_type;
		pObj.deduction_code_tax_status = pObj.deduct_code_tax_status;
		pObj.deduction_code_print_flag = pObj.deduct_code_print_flag;
		pYearObj = PayChecks.FindYear(pObj.payroll_year);
		pCountryObj = pYearObj.FindCountry(pObj.country_code);
		pCurrencyObj = pCountryObj.StoreCurrency(pObj.currency_code, true);
		pDeductionsObj = pCurrencyObj.StoreDeductions(pObj.ded_code,
										pObj.deduct_code_description
		);				      
		//show US deductions for all countries other than Canada
		if (pObj.country_code == "CA")
			FillCADeductions(pDeductionsObj, pObj)
		else
			FillUSDeductions(pDeductionsObj, pObj)
	}
	GetCurrencyCodes(year);	
}

//////////////////////////////////////////////////////////////////////////////////////////
// Methods for past years or for current year when future payments should display - use QUART files
//
function GetQuartwage(func)
{
	PayChecks.func = func;

	var pDMEObj		= new DMEObject(authUser.prodline, "QUARTWAGE")
		pDMEObj.out   	= "JAVASCRIPT"
		pDMEObj.index 	= "QTWSET1"
		pDMEObj.key   	= parseInt(authUser.company,10) +"="+ parseInt(authUser.employee,10)
		pDMEObj.max   	= "600"
		pDMEObj.func  	= "FillWageObject()"
		pDMEObj.sortdesc= "payroll-year;country-code";
		pDMEObj.field 	= "employee;employee.label-name-1;payroll-year;pay-sum-grp;quarter;hours;wage-amount;"
		+ "pay-sum-grp.description;country-code;currency-code;process-level;work-state"
	DME(pDMEObj, "jsreturn")
}

function GetQuartDed(year, func)
{
	PayChecks.func = func;

	var pDMEObj   = new DMEObject(authUser.prodline, "QUARTDED")
	pDMEObj.out   = "JAVASCRIPT"
	pDMEObj.index = "qtdset1"
	pDMEObj.key   = parseInt(authUser.company,10) +"="+ parseInt(authUser.employee,10) +"="+ year
	pDMEObj.max   = "600"
	pDMEObj.func  = "FillDeductionObject('"+year+"')"
	pDMEObj.field = "company;employee;payroll-year;quarter;ded-code;work-state;ded-amt;tax-wages;"
		+ "wage-amount;country-code;currency-code;deduction-code.adjust-pay;"
		+ "deduction-code.calc-type;deduction-code.tax-status;process-level;"
		+ "deduction-code.description;deduction-code.print-flag;"
	pDMEObj.debug = false;
	DME(pDMEObj, "jsreturn")
}

function FillWageObject()
{
	var pYearObj, pCountryObj, pCurrencyObj, pPaySumGrpObj, pQuarterObj;
	var thisYear = authUser.date.substring(0,4);

	for(var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var pObj = self.jsreturn.record[i];
		PayChecks.EmployeeCode = pObj.employee;
		PayChecks.EmployeeName = pObj.employee_label_name_1;

		pYearObj = PayChecks.StoreYear(pObj.payroll_year);
		//only store the wage records from QUARTWAGE if future payments can be displayed or the records are not from the current year
		if (emssObjInstance.emssObj.futurePayments || Number(pObj.payroll_year) < Number(thisYear))
		{
			pCountryObj = pYearObj.StoreCountry(pObj.country_code);
			pCurrencyObj = pCountryObj.StoreCurrency(pObj.currency_code, false);
			pPaySumGrpObj = pCurrencyObj.StorePaySumGrp(pObj.pay_sum_grp,
															  pObj.pay_sum_grp_description
															 );
			pQuarterObj = pPaySumGrpObj.StoreQuarter(pObj.quarter,
													 pObj.hours,
													 pObj.wage_amount,
	                                                 pObj.process_level,
	                                                 pObj.work_state
													);
		}										
	}

	if(self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		eval(PayChecks.func);
}

function TotalWagesEarned(Year)
{
	var pYearObj = this.FindYear(Year);

	for(var i=0; i<pYearObj.Country.length; i++)
	{
		var pCountryObj = pYearObj.Country[i];
		for(var j=0; j<pCountryObj.Currency.length; j++)
		{
			var pCurrencyObj = pCountryObj.Currency[j];
			pCurrencyObj.Wages.TotalHours = 0;
			pCurrencyObj.Wages.TotalWages = 0;

			for(var k=0; k<pCurrencyObj.Wages.PaySumGrp.length; k++)
			{
				var pPaySumGrp = pCurrencyObj.Wages.PaySumGrp[k];
				pPaySumGrp.TotalHours = 0;
				pPaySumGrp.TotalWages = 0;				

				for(var l=0; l<pPaySumGrp.Quarter.length; l++)
				{
          // JRZ 9/9/08 Adding checks on hours and wage variables that they are not blank to avoid NaN problem.
          if(pPaySumGrp.Quarter[l].Hours != '') {
					pPaySumGrp.TotalHours += Number(setValue(pPaySumGrp.Quarter[l].Hours));
          }
          if(pPaySumGrp.Quarter[l].WageAmount != '') {
					pPaySumGrp.TotalWages += Number(setValue(pPaySumGrp.Quarter[l].WageAmount));
          }
          if(pPaySumGrp.Quarter[l].WageAmount != '' && pPaySumGrp.Quarter[l].NonCashAmt != '') {
					pPaySumGrp.TotalNet   += (Number(setValue(pPaySumGrp.Quarter[l].WageAmount)) - 
											  Number(setValue(pPaySumGrp.Quarter[l].NonCashAmt)));
          }
          //~JRZ
        }							
				//NOTE: totals include non-earnings, unlike pay stub
				pCurrencyObj.Wages.TotalHours += pCurrencyObj.Wages.PaySumGrp[k].TotalHours;
				pCurrencyObj.Wages.TotalWages += pCurrencyObj.Wages.PaySumGrp[k].TotalWages;
			}
		}
	}
}

function TotalDeductionsEarned(Year)
{
	var pYearObj = this.FindYear(Year);

	for(var i=0; i<pYearObj.Country.length; i++)
	{
		var pCountryObj = pYearObj.Country[i];
		for(var j=0; j<pCountryObj.Currency.length; j++)
		{
			var pCurrencyObj = pCountryObj.Currency[j];
			pCurrencyObj.Ded.TotalAmount = 0;
			pCurrencyObj.Ded.TotalWages = 0;

			for(var k=0; k<pCurrencyObj.Ded.DeductionGroups.length; k++)
			{
				var pDedGrpObj = pCurrencyObj.Ded.DeductionGroups[k];
				pDedGrpObj.TotalAmount = 0;
				pDedGrpObj.TotalWages = 0;

				for(var l=0; l<pDedGrpObj.Quarter.length; l++)
				{
					pDedGrpObj.TotalAmount += Number(setValue(pDedGrpObj.Quarter[l].DedAmt));
					pDedGrpObj.TotalWages += Number((pDedGrpObj.Quarter[l].TaxWages=="")?"0":setValue(pDedGrpObj.Quarter[l].TaxWages));
				}
				
				//NOTE: totals include non-earnings, unlike pay stub
				pCurrencyObj.Ded.TotalAmount += pDedGrpObj.TotalAmount;
				pCurrencyObj.Ded.TotalWages += pDedGrpObj.TotalWages;
			}
		}
	}
}

function FillDeductionObject(year)
{
	var pYearObj, pCountryObj, pCurrencyObj, pDeductionsObj, pQuarterObj;

	for(var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var pObj = self.jsreturn.record[i];
		pObj.ded_amt = EvaluateBCD(pObj.ded_amt)
		pObj.wage_amount = EvaluateBCD(pObj.wage_amount)
		pObj.tax_wages = EvaluateBCD(pObj.tax_wages)

		pYearObj = PayChecks.FindYear(year);
		pCountryObj = pYearObj.FindCountry(pObj.country_code);
		pCurrencyObj = pCountryObj.StoreCurrency(pObj.currency_code, true);

		pDeductionsObj = pCurrencyObj.StoreDeductions(pObj.ded_code,
							      pObj.deduction_code_description
							      );

		if(pObj.country_code == "CA")
			FillCADeductions(pDeductionsObj, pObj)
		else
			FillUSDeductions(pDeductionsObj, pObj)
	}
	
	if(self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		GetCurrencyCodes(year);
}

function FillUSDeductions(pDeductionsObj, pObj)
{
	if(pObj.deduction_code_calc_type == "T"
	&& pObj.deduction_code_adjust_pay == "S"
	&& pObj.deduction_code_tax_status == "")
	{
		pDeductionsObj.StoreDeductionsQuarter(pObj.quarter, pObj.ded_amt, pObj.wage_amount, pObj.tax_wages, pObj.process_level, pObj.work_state);
		pDeductionsObj.Section = 1;	//Taxes
	}
	else if(pObj.deduction_code_adjust_pay == "S"
	&& pObj.deduction_code_tax_status != ""
	&& pObj.deduction_code_tax_status != 16
	&& pObj.deduction_code_tax_status != 17)
	{
		pDeductionsObj.StoreDeductionsQuarter(pObj.quarter, pObj.ded_amt, pObj.wage_amount, pObj.tax_wages, pObj.process_level, pObj.work_state)
		pDeductionsObj.Section = 2; //Pre Tax Deductions
	}
	else if(pObj.deduction_code_calc_type != "T"
	&& pObj.deduction_code_adjust_pay == "S"
	&& (pObj.deduction_code_tax_status == "" || pObj.deduction_code_tax_status == 16 || pObj.deduction_code_tax_status == 17))
	{
		pDeductionsObj.StoreDeductionsQuarter(pObj.quarter, pObj.ded_amt, pObj.wage_amount, pObj.tax_wages, pObj.process_level, pObj.work_state)
		pDeductionsObj.Section = 3; // After Tax Deductions
	}
	else if(pObj.deduction_code_adjust_pay == "A")
	{
		pDeductionsObj.StoreDeductionsQuarter(pObj.quarter, pObj.ded_amt, pObj.wage_amount, pObj.tax_wages, pObj.process_level, pObj.work_state)
		pDeductionsObj.Section = 4; //Add To Net
	}
	else if(pObj.deduction_code_print_flag == "Y"
	&& pObj.deduction_code_calc_type == "T"
	&& pObj.deduction_code_adjust_pay == "C"
	&& pObj.deduction_code_tax_status == "")
	{
		pDeductionsObj.StoreDeductionsQuarter(pObj.quarter, pObj.ded_amt, pObj.wage_amount, pObj.tax_wages, pObj.process_level, pObj.work_state)
		pDeductionsObj.Section = 5; //Taxable Company Deductions
	}
	else if(pObj.deduction_code_print_flag == "Y"
	&& pObj.deduction_code_calc_type != "T"
	&& pObj.deduction_code_adjust_pay == "C")
	{
		pDeductionsObj.StoreDeductionsQuarter(pObj.quarter, pObj.ded_amt, pObj.wage_amount, pObj.tax_wages, pObj.process_level, pObj.work_state)
		pDeductionsObj.Section = 6; //Other Company Deductions
	}
}

function FillCADeductions(pDeductionsObj, pObj)
{
	var TaxCalcType 			= pObj.deduction_code_calc_type == "T"
	var AdjustPayIsEmployee 		= pObj.deduction_code_adjust_pay == "S"
	var BlankTaxStatus 			= pObj.deduction_code_tax_status == ""
	var AdjustPayIsCompany 			= pObj.deduction_code_adjust_pay == "C"
	var TaxStatusIsC1 			= pObj.deduction_code_tax_status == "C1"
	var TaxStatusIsC5 			= pObj.deduction_code_tax_status == "C5"
	var TaxStatusIsC3 			= pObj.deduction_code_tax_status == "C3"
	var TaxStatusIsC4 			= pObj.deduction_code_tax_status == "C4"
	var TaxStatusIsC9 			= pObj.deduction_code_tax_status == "C9"
	var WorkStateIsAB 			= pObj.work_state == "AB"
	var WorkStateIsBritishColumbia 	= pObj.work_state == "BC"
	var WorkStateIsQuebec 			= pObj.work_state == "QC"
	var AdjustPayIsAddedToNet 		= pObj.deduction_code_adjust_pay == "A"
	var PrintFlag 				= pObj.deduction_code_printflag=="Y"

	if(AdjustPayIsEmployee)
	{
		pDeductionsObj.StoreDeductionsQuarter(pObj.quarter, pObj.ded_amt, pObj.wage_amount, pObj.tax_wages, pObj.process_level, pObj.work_state)
		pDeductionsObj.Section = 1; //Deductions
	}

	if(AdjustPayIsCompany && (TaxStatusIsC1 || TaxStatusIsC5 || (TaxStatusIsC3 && (WorkStateIsAB || WorkStateIsBritishColumbia)) || (TaxStatusIsC4 && WorkStateIsQuebec) || (TaxStatusIsC9 && WorkStateIsQuebec)))
	{
		pDeductionsObj.StoreDeductionsQuarter(pObj.quarter, pObj.ded_amt, pObj.wage_amount, pObj.tax_wages, pObj.process_level, pObj.work_state)
		pDeductionsObj.Section = 2; //Taxable Benefits
	}

	if(TaxCalcType && AdjustPayIsAddedToNet)
	{
		pDeductionsObj.StoreDeductionsQuarter(pObj.quarter, pObj.ded_amt, pObj.wage_amount, pObj.tax_wages, pObj.process_level, pObj.work_state)
		pDeductionsObj.Section = 3; //Add To Net
	}

	if(AdjustPayIsCompany && TaxCalcType && BlankTaxStatus && PrintFlag)
	{
		pDeductionsObj.StoreDeductionsQuarter(pObj.quarter, pObj.ded_amt, pObj.wage_amount, pObj.tax_wages, pObj.process_level, pObj.work_state)
		pDeductionsObj.Section = 4; //Company Taxes
	}

//	if(!TaxCalcType && AdjustPayIsCompany && (!TaxStatusIsC1 && !TaxStatusIsC5 && (!TaxStatusIsC3 || (TaxStatusIsC3 && !WorkStateIsAB && !WorkStateIsBritishColumbia)) && (!TaxStatusIsC4 || (TaxStatusIsC4 && !WorkStateIsQuebec)) && (!TaxStatusIsC9 || (TaxStatusIsC9 && !WorkStateIsQuebec))))
//	{
//		pDeductionsObj.StoreDeductionsQuarter(pObj.quarter, pObj.ded_amt, pObj.wage_amount, pObj.tax_wages, pObj.process_level, pObj.work_state)
//		pDeductionsObj.Section = 5; //Company Deductions
//	}
}

function StoreYear(Year)
{
	var pYearObj = this.Year;

	for(var i=0; i<pYearObj.length; i++)
	{
		if(pYearObj[i].Year == Number(Year))
			return pYearObj[i];
	}
	pYearObj[pYearObj.length] = new YearObject(Year);
	return pYearObj[pYearObj.length-1];
}

function FindYear(Year)
{
	var pYearObj = this.Year;

	for(var i=0; i<pYearObj.length; i++)
	{
		if(pYearObj[i].Year == Number(Year))
			return pYearObj[i];
	}
	return null;
}

function StoreCountry(Country)
{
	var pCountryObj = this.Country;

	for(var i=0; i<pCountryObj.length; i++)
	{
		if(pCountryObj[i].Code == Country)
			return pCountryObj[i];
	}
	pCountryObj[pCountryObj.length] = new CountryObject(Country, "");
	return pCountryObj[pCountryObj.length-1];
}

function FindCountry(Country)
{
	var pCountryObj = this.Country;

	for(var i=0; i<pCountryObj.length; i++)
	{
		if(pCountryObj[i].Code == Country)
			return pCountryObj[i];
	}
	return null;
}

function StoreCurrency(Currency, Deductions)
{
	var pCurrencyObj = this.Currency;

	for(var i=0; i<pCurrencyObj.length; i++)
	{
		if(pCurrencyObj[i].Code == Currency)
		{
			if(Deductions)
				return pCurrencyObj[i].Ded;
			else
				return pCurrencyObj[i].Wages;
		}
	}

	pCurrencyObj[pCurrencyObj.length] = new CurrencyObject(Currency, "");
	pCurrencyObj[pCurrencyObj.length-1].Ded = new DedObject();
	pCurrencyObj[pCurrencyObj.length-1].Wages = new WagesObject();

	if(Deductions)
		return pCurrencyObj[pCurrencyObj.length-1].Ded
	else
		return pCurrencyObj[pCurrencyObj.length-1].Wages
}

function FindCurrency(Currency)
{
	var pCurrencyObj = this.Currency;

	for(var i=0; i<pCurrencyObj.length; i++)
	{
		if(pCurrencyObj[i].Code == Currency)
			return pCurrencyObj[i];
	}
	return null;
}

function StorePaySumGrp(PaySumGrpCode, PaySumGrpDescription)
{
	var pPaySumGrpObj = this.PaySumGrp;

	for(var i=0; i<pPaySumGrpObj.length; i++)
	{
		if(pPaySumGrpObj[i].Code == PaySumGrpCode)
			return pPaySumGrpObj[i];
	}
	pPaySumGrpObj[pPaySumGrpObj.length] = new PaySumGrpObject(PaySumGrpCode, PaySumGrpDescription);
	return pPaySumGrpObj[pPaySumGrpObj.length-1];
}

function StoreDeductions(Code, Description)
{
	var pDeductionsObj = this.DeductionGroups;

	for(var i=0; i<pDeductionsObj.length; i++)
	{
		if(pDeductionsObj[i].Code == Code)
			return pDeductionsObj[i];
	}
	pDeductionsObj[pDeductionsObj.length] = new DeductionGroupsObject(Code, Description);
	return pDeductionsObj[pDeductionsObj.length-1];
}

function StoreQuarter(Quarter, Hours, WageAmount, ProcessLevel, WorkState)
{
	for(var i=0; i<this.Quarter.length; i++)
	{
		if(this.Quarter[i].Quarter == Number(Quarter)
		&& this.Quarter[i].ProcessLevel == ProcessLevel
		&& this.Quarter[i].WorkState == WorkState)
		{
			this.Quarter[i].Hours = ParseNbr(this.Quarter[i].Hours) + ParseNbr(Hours);
			this.Quarter[i].WageAmount = ParseNbr(this.Quarter[i].WageAmount) + ParseNbr(WageAmount);
			return this.Quarter[i];
		}
	}

	this.Quarter[this.Quarter.length] = new WagesQuarterObject(Quarter, Hours, WageAmount, ProcessLevel, WorkState);
	return this.Quarter[this.Quarter.length-1];
}

function StoreDeductionsQuarter(Quarter, DedAmt, WageAmount, TaxWages, ProcessLevel, WorkState)
{
	for(var i=0; i<this.Quarter.length; i++)
	{
		if(this.Quarter[i].Quarter == Number(Quarter)
		&& this.Quarter[i].ProcessLevel == ProcessLevel
		&& this.Quarter[i].WorkState == WorkState)
		{
			this.Quarter[i].DedAmt = ParseNbr(this.Quarter[i].DedAmt) + ParseNbr(DedAmt);
			this.Quarter[i].WageAmount = ParseNbr(this.Quarter[i].WageAmount) + ParseNbr(WageAmount);
			this.Quarter[i].TaxWages = ParseNbr(this.Quarter[i].TaxWages) + ParseNbr(TaxWages);        	       	
			return this.Quarter[i];
		}
	}

	this.Quarter[this.Quarter.length] = new DeductionsQuarterObject(Quarter, DedAmt, WageAmount, TaxWages, ProcessLevel, WorkState);
	return this.Quarter[this.Quarter.length-1];
}

function DoesSectionContainValues(Section, pGroupsObj)
{
	for(var i=0; i<pGroupsObj.length; i++)
	{
		if(pGroupsObj[i].Section == Section)
		{
			if(pGroupsObj[i].TotalAmount>0)
				return true;
		}
	}
	return false;
}

function GetCurrencyCodes(year)
{
	var pDMEObj = new DMEObject(authUser.prodline, "CUCODES")
	pDMEObj.out = "JAVASCRIPT"
	pDMEObj.max = "600";
	pDMEObj.debug = false;
	pDMEObj.func = "CUCODES_Finished("+year+")";
	pDMEObj.field = "currency-code;description";
	DME(pDMEObj,"jsreturn");
}

function CUCODES_Finished(year)
{
	var pYearObj = PayChecks.FindYear(year);
	var Found = false;

	for(var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		for(var j=0;j<pYearObj.Country.length; j++)
		{
			for(var k=0; k<pYearObj.Country[j].Currency.length; k++)
			{
				if(pYearObj.Country[j].Currency[k].Code == self.jsreturn.record[i].currency_code)
				{
					pYearObj.Country[j].Currency[k].Description = self.jsreturn.record[i].description;
					Found = true;
					break;
				}
			}
			if(Found) break;
		}
		Found = false;
	}

	if(self.jsreturn.Next) {
		self.jsreturn.location.replace(self.jsreturn.Next);
	}
	else {
		PayChecks.YearDetail[Number(year)] = true;
		eval(PayChecks.func);
	}
}

// handle negative earnings adjustments
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
