// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/stockoptions/lib/shr064.js,v 1.8.2.11 2009/03/05 17:15:56 brentd Exp $
// Define global variables.
var BN332;
var BN333;
var BN334;
var Brokers;
var ExerciseHist;
var BrokerWin;

// reface
// indicate whether it is employee application, in which the "removable" code is valid
// in manager application, it is set to false
var isEmployee = true;

var SortByProperty = "";

// Preload any images.
var ModelBtn = new Image();
ModelBtn.src = "/lawson/xhrnet/images/bdiamond2.gif";

function BN332Object()
{
	this.Company = '';
	this.Employee = '';
	this.StockSymbol = '';
	this.NextGrantNbr = '';
	this.NextStockCertificate = '';
	this.LastGrantNbr = '';
	this.LastStockCertificate = '';
	this.Records = new Array();
	this.AvailRecords = new Array();
	this.ToExpireRecords = new Array();	

	this.Rec = function()
	{
		this.Certificate = '';
		this.GrantID = '';
		this.GrantDate = '';
		this.PercentVested = 0;
		this.SharesGranted = 0;
		this.AvailableShares = 0;
		this.GrantPrice = 0;
		this.ExpireDate = '';
		this.VestedShares = 0;
		this.UnvestedShares = 0;
		this.ExercisedShares = 0;
		this.ForfeitedShares = 0;
		this.ExpiredShares = 0;
		this.WebAvailable = 'N';	  // Default web available = 'No' 	
		this.SupervisorWebAvailable = 1;  // Default supervisor web available = 'Not Available'	
	}
}

function BN333Object()
{
	this.Company = '';
	this.Employee = '';
	this.Certificate = '';
	this.GrantID = '';
	this.NextRecordNbr = '';
	this.Records = new Array();

	this.Rec = function()
	{
		this.Date = '';
		this.Percent = 0;
		this.CumulativeShares = 0;
		this.PeriodPercent = 0;
		this.PeriodShares = 0;	
	}
}

function BN334Object()
{
	this.Company = '';
	this.Employee = '';
	this.Certificate = '';
	this.GrantID = '';
	this.GrantPrice = 0;
	this.MarketSharePrice = 0;
	this.NumberShares = 0;
	this.FederalTax = 0;
	this.StateTax = 0;
	this.SocialSecurity = 0;
	this.Medicare = 0;
	this.TransactionValue = 0;	
	this.ExerciseCost = 0;
	this.GainLoss = 0;
	this.TaxableWages = 0;
	this.TaxAmount = 0;
}

function HS10Object()
{
	this.NextFC = ''
	this.NextEmployee = ''
	this.NextSupvCode = ''
	this.NextSupvOpCode = ''
	this.Records = new Array();
	this.SelectedEE = -1;  // for use with a dropdown select box
	this.SelectedIndex = -1; // for use with a dropdown select box
	this.SelectContent = '';  // for use with a dropdown select box
	this.RetrievedEEs = false;
	this.Rec = function()
	{
		this.Employee = '';
		this.FullName = '';
	}
}

function BrokerObject()
{
	this.RetrievedBrokers = false;
	this.Contacts = new Array();
}

function HistoryObject()
{
	this.RetrievedHist = false;
	this.Records = new Array();
}

function PaintStockOptionGrantTable(Tab, IsMgr)
{
	var returnVal = '';
	
	switch (Tab)
	{
		case 0:
		var Grants = BN332.AvailRecords;
		IsMgr = (IsMgr) ? true : false;
	
		if (Grants.length > 0)
		{
			returnVal += '<table class="plaintableborder" id="optionTbl'+Tab+'" border="0" cellpadding="0" cellspacing="0" width="100%" styler="list">';
			returnVal += '<tr><th class="plaintableheaderborder" style="width:80px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'Certificate\',false);return false">'+getSeaPhrase("CERTIFICATE","ESS")+'</a>&nbsp;</th>';
			returnVal += '<th class="plaintableheaderborder" style="width:80px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'GrantDate\',false);return false">'+getSeaPhrase("GRANT_DATE","ESS")+'</a>&nbsp;</th>';
			returnVal += '<th class="plaintableheaderborder" style="width:80px;text-align:right;" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'PercentVested\',true);return false">';
			returnVal += getSeaPhrase("PERCENT_VESTED","ESS")+'</a>&nbsp;</th>';
			returnVal += '<th class="plaintableheaderborder" style="width:80px;text-align:right" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'SharesGranted\',true);return false">';
			returnVal += getSeaPhrase("SHARES_GRANTED","ESS")+'</a>&nbsp;</th>';
			returnVal += '<th class="plaintableheaderborder" style="width:80px;text-align:right" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'AvailableShares\',true);return false">';
			returnVal += getSeaPhrase("SHARES_AVAILABLE","ESS")+'</a>&nbsp;</th>';
			returnVal += '<th class="plaintableheaderborder" style="width:80px;text-align:right" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'GrantPrice\',true);return false">'
			returnVal += getSeaPhrase("GRANT_PRICE","ESS")+'</a></th>';
			if (IsMgr == false)
			{
				returnVal += '<th id="model0" class="plaintableheaderborder" style="width:80px;text-align:center">';
				returnVal += getSeaPhrase("ACTION","ESS")+'</th>';
			}
			returnVal += '</tr>';
		}

		if (Grants.length == 0)
		{
			returnVal += '<table class="plaintableborder" id="optionTbl'+Tab+'" border="0" cellpadding="0" cellspacing="0" width="100%">';
			returnVal += '<tr><td class="fieldlabelbold" style="text-align:left;padding-top:10px;padding-left:10px">';
			if (IsMgr) {
				returnVal += getSeaPhrase("NO_STOCK_INFO_FOR","ESS")+' '; 
				returnVal += HS10.Records[HS10.SelectedIndex-1].FullName+'.';
			} 
			else {
				returnVal += getSeaPhrase("NO_STOCK_INFO","ESS");
			}
			returnVal += '</td></tr>';
		}

		for (var i=0; i<Grants.length; i++)
		{
			returnVal += '<tr><td class="plaintablecellborder" style="width:80px">';
			returnVal += '<a href="" onclick="parent.OptionDetail('+i+','+IsMgr+');return false;">'+Grants[i].Certificate+'</a></td>';
			returnVal += '<td class="plaintablecellborder" style="width:80px;text-align:center">'+FormatDte4(Grants[i].GrantDate)+'</td>';
			returnVal += '<td class="plaintablecellborder" style="width:80px;text-align:right">';
			returnVal += roundValue(Grants[i].PercentVested,2)+'</td>';
			returnVal += '<td class="plaintablecellborder" style="width:80px;text-align:right">';
			returnVal += formatComma(Grants[i].SharesGranted,true)+'</td>';
			returnVal += '<td class="plaintablecellborder" style="width:80px;text-align:right">';
			returnVal += formatComma(Grants[i].AvailableShares,true)+'</td>';
			returnVal += '<td class="plaintablecellborder" style="width:80px;text-align:right">';
			returnVal += formatComma(roundValue(Grants[i].GrantPrice,4))+'</td>';
			if (IsMgr == false)
			{
				returnVal += '<td class="plaintablecellborder" style="width:80px;text-align:center;" nowrap>';
				returnVal += '<a href="" onclick="parent.OptionModel('+i+');return false;">';
				returnVal += getSeaPhrase("MODEL_OPTIONS", "ESS")
				returnVal += '</a></td>';
			}
			returnVal += '</tr>';
		}
		returnVal += '</table>';
		break;

		case 1:
		var Grants = BN332.ToExpireRecords;
		Grants.TotalExpiredShares = 0;
		Grants.TotalGrantPrice = 0;
		
		if (Grants.length > 0)
		{
			returnVal += '<table class="plaintableborder" id="optionTbl'+Tab+'" border="0" cellpadding="0" cellspacing="0" width="100%" styler="list">';
			returnVal += '<tr><th class="plaintableheaderborder" style="width:100px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'Certificate\',false);return false">'+getSeaPhrase("CERTIFICATE","ESS")+'</a></th>';
			returnVal += '<th class="plaintableheaderborder" style="width:100px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'ExpireDate\',false);return false" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += getSeaPhrase("EXPIRATION_DATE","ESS")+'</a></th>';
			returnVal += '<th class="plaintableheaderborder" style="width:100px;text-align:right" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'AvailableShares\',true);return false">';
			returnVal += getSeaPhrase("SHARES_TO_EXPIRE","ESS")+'</a>&nbsp;</th>';
			returnVal += '<th class="plaintableheaderborder" style="width:100px;text-align:right" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'GrantPrice\',true);return false">'+getSeaPhrase("GRANT_VALUE","ESS")+'</a></th>';
			if (IsMgr == false)
			{	
				returnVal += '<th id="model1" class="plaintableheaderborder" style="width:100px;text-align:center">';
				returnVal += getSeaPhrase("ACTION","ESS")+'</th>';
			}
			returnVal += '</tr>'
		}

		if (Grants.length == 0)
		{
			returnVal += '<table class="plaintableborder" id="optionTbl'+Tab+'" border="0" cellpadding="0" cellspacing="0" width="100%">';
			returnVal += '<tr><td class="fieldlabelbold" style="text-align:left;padding-top:10px;padding-left:10px">'
			if (IsMgr)
			{
				returnVal += getSeaPhrase("NO_STOCK_TO_EXPIRE_FOR","ESS")+' '+HS10.Records[HS10.SelectedIndex-1].FullName+'.';
				returnVal += '</td>';
			}
			else
			{
				returnVal += getSeaPhrase("NO_STOCK_TO_EXPIRE","ESS");
				returnVal += '</td>';	
			} 
		}

		for (var i=0; i<Grants.length; i++)
		{
			Grants.TotalExpiredShares += Grants[i].AvailableShares;
			Grants.TotalGrantPrice += Grants[i].GrantPrice;
			returnVal += '<tr><td class="plaintablecellborder" style="width:100px">';
			returnVal += '<a href="" onclick="parent.OptionDetail('+i+','+IsMgr+');return false;">'+Grants[i].Certificate+'</a></td>';
			returnVal += '<td class="plaintablecellborder" style="width:100px;text-align:center">'+FormatDte4(Grants[i].ExpireDate)+'</td>';
			returnVal += '<td class="plaintablecellborder" style="width:100px;text-align:right">';
			returnVal += formatComma(Grants[i].AvailableShares,true)+'</td>';
			returnVal += '<td class="plaintablecellborder" style="width:100px;text-align:right">';
			returnVal += formatComma(roundValue(Grants[i].GrantPrice,4))+'</td>';
			if (IsMgr == false)
			{
				returnVal += '<td class="plaintablecellborder" style="width:100px;text-align:center" nowrap>';
				returnVal += '<a href="" onclick="parent.OptionModel('+i+');return false;">';
				returnVal += getSeaPhrase("MODEL_OPTIONS", "ESS")
				returnVal += '</a></td>';
			}
			returnVal += '</tr>';
		}

		if (Grants.length > 0)
		{
			returnVal += '<tr><td class="plaintableheaderborder" style="width:100px;text-align:center">';
			returnVal += getSeaPhrase("TOTAL","ESS")+'</td><td class="plaintableheaderborder" style="width:100px">&nbsp;</td>'
			returnVal += '<td class="plaintableheaderborder" style="width:100px;text-align:right">'+formatComma(Grants.TotalExpiredShares,true)+'</td>';
			returnVal += '<td class="plaintableheaderborder" style="width:100px;text-align:right">'+formatComma(roundValue(Grants.TotalGrantPrice,4))+'</td>';
			if (IsMgr == false)
			{
				returnVal += '<td id="total1" class="plaintableheaderborder" style="width:100px;text-align:center">&nbsp;</td>';
			}
			returnVal += '</tr>';
		}
		returnVal += '</table>';
		break;	

		case 2:
		var Grants = ExerciseHist.Records;

		if (Grants.length > 0)
		{
			returnVal += '<table class="plaintableborder" id="optionTbl'+Tab+'" border="0" cellpadding="0" cellspacing="0" width="100%" styler="list">';
			returnVal += '<tr><th class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'stock_ctf\',false);return false;">'+getSeaPhrase("CERTIFICATE","ESS")+'</a></th>';
			returnVal += '<th class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'exercise_date\',false);return false;">';
			returnVal += getSeaPhrase("EXERCISE_DATE","ESS")+'</a></th>';  
			returnVal += '<th class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'shares_exe\',true);return false;">';
			returnVal += getSeaPhrase("NUMBER_OF_SHARES","ESS")+'</a></th>';
			returnVal += '<th class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'exercise_cost\',true);return false;">';
			returnVal += getSeaPhrase("EXERCISE_COST","ESS")+'</a></th>';  
			returnVal += '<th class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'fair_mkt_val\',true);return false;">';
			returnVal += getSeaPhrase("MARKET_VALUE","ESS")+'</a></th>';		 
			returnVal += '<th class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'gain_lost_val\',true);return false;">';
			returnVal += getSeaPhrase("GAIN__LOSS","ESS")+'</a></th>';
			returnVal += '<th class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'tax_wage_upd\',true);return false;">';
			returnVal += getSeaPhrase("TAXABLE_WAGES","ESS")+'</a></th>';
			returnVal += '<th class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'emp_tax_amt\',true);return false;">';
			returnVal += getSeaPhrase("TAX_AMOUNT","ESS")+'</a></th>';
			returnVal += '<th id="status2" class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="" onclick="parent.SortGrants(\'pending_xlt\',false);return false;">';
			returnVal += getSeaPhrase("STATUS","ESS")+'</a></th>';
			returnVal += '</tr>';
		}
		else
		{
			returnVal += '<table class="plaintableborder" id="optionTbl'+Tab+'" border="0" cellpadding="0" cellspacing="0" width="100%">';
			returnVal += '<tr><td class="fieldlabelbold" style="text-align:left;padding-top:10px;padding-left:10px">';
			if (IsMgr)
			{
				returnVal += getSeaPhrase("NO_EXERCISE_INFO_FOR","ESS")+' ' +HS10.Records[HS10.SelectedIndex-1].FullName + '.';
				returnVal += '</td></tr>'
			}
			else
			{
				returnVal += getSeaPhrase("NO_EXERCISE_INFO","ESS");
				returnVal += '</td></tr>'
			}
		}

		for (var i=0; i<Grants.length; i++)
		{
			returnVal += '<tr><td class="plaintablecellborder" style="width:70px;text-align:center">';
			returnVal += '<a href="" onclick="parent.HistoryDetail('+i+');return false">';
			returnVal += Grants[i].stock_ctf+'</a></td>';
			returnVal += '<td class="plaintablecellborder" style="width:70px;text-align:center">';
			returnVal += formatDME(Grants[i].exercise_date)+'</td>';
			returnVal += '<td class="plaintablecellborder" style="width:70px;text-align:right">';
			returnVal += formatComma(Grants[i].shares_exe,true)+'</td>';
			returnVal += '<td class="plaintablecellborder" style="width:70px;;text-align:right">';
			returnVal += formatComma(roundValue(Grants[i].exercise_cost,4))+'</td>';
			returnVal += '<td class="plaintablecellborder" style="width:70px;text-align:right">';
			returnVal += formatComma(roundValue(Grants[i].fair_mkt_val,2))+'</td>';
			returnVal += '<td class="plaintablecellborder" style="width:70px;text-align:right">';
			returnVal += formatComma(roundValue(Grants[i].gain_lost_val,2))+'</td>';
			returnVal += '<td class="plaintablecellborder" style="width:70px;text-align:right">';
			returnVal += formatComma(roundValue(Grants[i].tax_wage_upd,2))+'</td>';
			returnVal += '<td class="plaintablecellborder" style="width:70px;text-align:right">';
			returnVal += formatComma(roundValue(Grants[i].emp_tax_amt,2))+'</td>';
			returnVal += '<td class="plaintablecellborder" style="width:70px;text-align:center">'+Grants[i].pending_xlt+'</td></tr>';		
		}	

		returnVal += '</table>';
		break;	
	}

	return returnVal;
}

///////////////////////////////////////////////////////////////////////////////////////////
//
// Content for the bottom left window - Vesting Detail.
//
function PaintBottomLeftWindow()
{
	var VestedDetail = BN333.Records;
	var returnVal = '';

	if (VestedDetail.length > 0)
	{
		returnVal += '<table border="0" cellpadding="0" cellspacing="0" width="100%" styler="list">';
		returnVal += '<tr><th class="plaintableheaderborder" style="width:80px;text-align:center">'+getSeaPhrase("GRANT_DATE","ESS")+'</th>';
		returnVal += '<th class="plaintableheaderborder" style="width:80px;text-align:right">'+getSeaPhrase("PERCENT","ESS")+'</th>';
		returnVal += '<th class="plaintableheaderborder" style="width:80px;text-align:right">'+getSeaPhrase("CUMULATIVE_SHARES","ESS")+'</th>';
		returnVal += '<th class="plaintableheaderborder" style="width:80px;text-align:right">'+getSeaPhrase("PERIOD_PERCENT","ESS")+'</th>';
		returnVal += '<th class="plaintableheaderborder" style="width:80px;text-align:right">'+getSeaPhrase("PERIOD_SHARES","ESS")+'</th>';	
	}	
	
	if (VestedDetail.length == 0)
	{
		returnVal += '<table border="0" cellpadding="0" cellspacing="0" width="100%">';
		returnVal += '<tr><td class="fieldlabelbold" style="text-align:left;padding-top:10px;padding-left:10px">';
		returnVal += getSeaPhrase("NO_VEST_SCHEDULE","ESS")+'</td>';
	}

	for (var i=0; i<VestedDetail.length; i++)
	{
		returnVal += '<tr><td class="plaintablecellborder" style="width:80px;text-align:center">'+FormatDte4(VestedDetail[i].Date)+'</td>';
		returnVal += '<td class="plaintablecellborder" style="width:80px;text-align:right">'+roundValue(VestedDetail[i].Percent,2)+'</td>';
		returnVal += '<td class="plaintablecellborder" style="width:80px;text-align:right">'+formatComma(VestedDetail[i].CumulativeShares,true)+'</td>';
		returnVal += '<td class="plaintablecellborder" style="width:80px;text-align:right">'+roundValue(VestedDetail[i].PeriodPercent,2)+'</td>';
		returnVal += '<td class="plaintablecellborder" style="width:80px;text-align:right">'+formatComma(VestedDetail[i].PeriodShares,true)+'</td>';
	}

	returnVal += '</table>';

   	self.bottomleft.document.getElementById("paneBody").innerHTML = returnVal;
   	self.bottomleft.stylePage();
	document.getElementById("bottomleft").style.visibility = "visible";	
	removeWaitAlert();
}

///////////////////////////////////////////////////////////////////////////////////////////
//
// Content for the top right window - Option Detail.
//
function PaintTopRightWindow(index)
{
	if (optionTabs.activetab == 1) {
		var Grant = BN332.ToExpireRecords[index];
	}
	else {
		var Grant = BN332.AvailRecords[index];
	}
	
	var returnVal = '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" width="100%">';	
	returnVal += '<tr><td class="plaintablerowheaderborder" style="width:50%;text-align:right">'+getSeaPhrase("GRANT_ID","ESS")+'</td>';
	returnVal += '<td class="plaintablecelldisplay" style="width:50%;text-align:right">'+Grant.GrantID+'</td></tr>';
	returnVal += '<tr><td class="plaintablerowheaderborder" style="width:50%;text-align:right">'+getSeaPhrase("STOCK_SYMBOL","ESS")+'</td>';
	returnVal += '<td class="plaintablecelldisplay" style="width:50%;text-align:right">'+Grant.StockSymbol+'</td></tr>';
	returnVal += '<tr><td class="plaintablerowheaderborder" style="width:50%;text-align:right">'+getSeaPhrase("DATE_TO_EXPIRE","ESS")+'</td>';
	returnVal += '<td class="plaintablecelldisplay" style="width:50%;text-align:right">'+FormatDte4(Grant.ExpireDate)+'</td></tr>';
	returnVal += '<tr><td class="plaintablerowheaderborder" style="width:50%;text-align:right">&nbsp;</td>';
	returnVal += '<td class="plaintablecelldisplay" style="width:50%;text-align:right">&nbsp;</td></tr>';
	returnVal += '<tr><td class="plaintablerowheaderborder" style="width:50%;text-align:right">'+getSeaPhrase("SHARES","ESS")+':</td>';
	returnVal += '<td class="plaintablecelldisplay" style="width:50%;text-align:right">&nbsp;</td></tr>';
	returnVal += '<tr><td class="plaintablerowheaderborder" style="width:50%;text-align:right">'+getSeaPhrase("VESTED","ESS")+'</td>';
	returnVal += '<td class="plaintablecelldisplay" style="width:50%;text-align:right">'+formatComma(Grant.VestedShares,true)+'</td></tr>';
	returnVal += '<tr><td class="plaintablerowheaderborder" style="width:50%;text-align:right">'+getSeaPhrase("UNVESTED","ESS")+'</td>';
	returnVal += '<td class="plaintablecelldisplay" style="width:50%;text-align:right">'+formatComma(Grant.UnvestedShares,true)+'</td></tr>';
	returnVal += '<tr><td class="plaintablerowheaderborder" style="width:50%;text-align:right">'+getSeaPhrase("AS_OF_DATE","ESS")+'</td>';
	returnVal += '<td class="plaintablecelldisplay" style="width:50%;text-align:right">'+fmttoday+'</td></tr>';
	returnVal += '<tr><td class="plaintablerowheaderborder" style="width:50%;text-align:right">'+getSeaPhrase("VESTED","ESS")+'</td>';
	returnVal += '<td class="plaintablecelldisplay" style="width:50%;text-align:right">'+formatComma(Grant.VestedShares,true)+'</td></tr>';
	returnVal += '<tr><td class="plaintablerowheaderborder" style="width:50%;text-align:right">'+getSeaPhrase("EXERCISED","ESS")+'</td>';
	returnVal += '<td class="plaintablecelldisplay" style="width:50%;text-align:right">'+formatComma(Grant.ExercisedShares,true)+'</td></tr>';
	returnVal += '<tr><td class="plaintablerowheaderborder" style="width:50%;text-align:right">'+getSeaPhrase("FORFEITED","ESS")+'</td>';
	returnVal += '<td class="plaintablecelldisplay" style="width:50%;text-align:right">'+formatComma(Grant.ForfeitedShares,true)+'</td></tr>';	
	returnVal += '<tr><td class="plaintablerowheaderborder" style="width:50%;text-align:right">'+getSeaPhrase("EXPIRED","ESS")+'</td>';
	returnVal += '<td class="plaintablecelldisplay" style="width:50%;text-align:right;text-decoration:underline">';
	
	for (var j=formatComma(Grant.ExpiredShares,true).toString().length;j<formatComma(Grant.AvailableShares,true).toString().length+2; j++) returnVal += '&nbsp;';
	
	returnVal += formatComma(Grant.ExpiredShares,true)+'</td></tr>';
	returnVal += '<tr><td class="plaintablerowheaderborderbottom" style="width:50%;text-align:right">'+getSeaPhrase("AVAILABLE","ESS")+'</td>';
	returnVal += '<td class="plaintablecelldisplay" style="width:50%;text-align:right">'+formatComma(Grant.AvailableShares,true)+'</td></tr>';
	returnVal += '</table>';
	
   	self.topright.document.getElementById("paneBody").innerHTML = returnVal;
   	self.topright.stylePage();
	document.getElementById("topright").style.visibility = "visible";
	removeWaitAlert();
}

function GetStockOptionGrants(fc, ee, IsMgr)
{
	IsMgr = (IsMgr) ? true : false;

	if (fc != escape("+",1))
		BN332 = new BN332Object();

	window.lawheader.nbr = 0;
	window.lawheader.token = "BN33.2";

	ee = (typeof(ee) == "undefined" || ee == null) ? parseInt(authUser.employee,10) : parseInt(ee,10);

	var pAGSObj = new AGSObject(authUser.prodline, "BN33.2");
	pAGSObj.event = "ADD";
	pAGSObj.rtn = "DATA";
	pAGSObj.longNames = "ALL";
	pAGSObj.tds = false;
	pAGSObj.func = "parent.GetStockOptionGrants_Done("+ee+","+IsMgr+")";
	pAGSObj.field = "FC="+fc+"&BEG-COMPANY=" + authUser.company;
	pAGSObj.field += "&BEG-EMPLOYEE=" + ee;
	pAGSObj.field += "&PT-OPT-GRANT-NBR=" + BN332.NextGrantNbr;
	pAGSObj.field += "&PT-STOCK-CTF=" + BN332.NextStockCertificate;
	pAGSObj.out = "JAVASCRIPT";
	pAGSObj.debug = false;

	BN332.LastGrantNbr = BN332.NextGrantNbr;
	BN332.LastStockCertificate = BN332.NextStockCertificate;
	
	AGS(pAGSObj, "jsreturn");	
}

function GetStockOptionGrants_Done(ee, IsMgr)
{
	if (window.lawheader.gmsgnbr == "000")
	{
		var BN332msg = window.lawheader.gmsg.toUpperCase();

		//if (BN332.Records.length > 0
		//&& (BN332msg.indexOf("MORE") != -1 ||  BN332msg.indexOf("PAGEDOWN") != -1)) {

		if (BN332.Records.length > 0 
		&& ((NonSpace(BN332.NextGrantNbr) > 0 && BN332.NextGrantNbr != BN332.LastGrantNbr) 
			|| (NonSpace(BN332.NextStockCertificate) > 0 && BN332.NextStockCertificate != BN332.LastStockCertificate))) 
		{
			GetStockOptionGrants(escape("+",1), ee, IsMgr);		
		}
		else
		{
			// Make sure option grants are sorted from most recent grant date to furthest out				
			if (BN332.Records.length > 0)
			{	
				SortByProperty = "GrantDate";
				BN332.Records.sort(sortByAlphaDescending);		
			}

			// Display only those grants which are web-available
			for (var i=0; i<BN332.Records.length; i++)
			{
				// Only display stock option records that are web available
				if ((IsMgr == false && BN332.Records[i].WebAvailable == "Y")
				|| (IsMgr == true && parseInt(BN332.Records[i].SupervisorWebAvailable,10) == 2))
				{
					// Records for Stock Option Grants tab
					BN332.AvailRecords = BN332.AvailRecords.concat(BN332.Records[i]);

					// Only display 100% vested shares to expire within the next 12 months 
					if (parseInt(BN332.Records[i].PercentVested,10) == 100
					&& isNaN(parseInt(BN332.Records[i].ExpireDate,10)) == false 
					&& parseInt(ymdtoday,10) <= parseInt(BN332.Records[i].ExpireDate,10)
					&&  parseInt(BN332.Records[i].ExpireDate,10) <= parseInt(String(Number(ymdtoday.substring(0,4))+1)+ymdtoday.substring(4,6)+ymdtoday.substring(6,8),10))
					{
						// Records for Shares to Expire tab
						BN332.ToExpireRecords = BN332.ToExpireRecords.concat(BN332.Records[i]);
					}					
				}
			}

			// Make sure shares to expire are sorted from most recent expiration date to furthest out			
			if (BN332.ToExpireRecords.length > 0)
			{
				SortByProperty = "ExpireDate";
				BN332.ToExpireRecords.sort(sortByAlphaDescending);					
			}
			
			PaintTopLeftWindow();
		}
	}
	else
	{
		seaAlert(window.lawheader.gmsg);
		switch(window.lawheader.gmsgnbr)
		{
			default: break;
		}
	}
}

function OptionDetail(index, IsMgr)
{
	IsMgr = (IsMgr) ? true : false;

	activateTableRow("optionTbl"+optionTabs.activetab,index,optionTabs.frame);

	if (IsMgr == false) {
		document.getElementById("bottomleft2").style.visibility = "hidden";
		document.getElementById("bottomleft3").style.visibility = "hidden";
		document.getElementById("bottomright").style.visibility = "hidden";
	}
	
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"));
	
	GetOptionDetail(index);
	GetVestingDetail("I", index);
}

function GetOptionDetail(index)
{
	var pDMEObj 	= new DMEObject(authUser.prodline, "BNSTKGNT");
	pDMEObj.out 	= "JAVASCRIPT";
	pDMEObj.index 	= "BSGSET1";
	pDMEObj.field 	= "stock-symbol";
	if (optionTabs.activetab == 1)
		pDMEObj.key 	= authUser.company+"="+BN332.ToExpireRecords[index].GrantID;
	else
		pDMEObj.key 	= authUser.company+"="+BN332.AvailRecords[index].GrantID;
	pDMEObj.max 	= "1";
	pDMEObj.func 	= "GetOptionDetail_Done("+index+")";
	pDMEObj.exclude = "drills;keys";
	pDMEObj.debug 	= false;
	DME(pDMEObj,"jsreturn2");
}

function GetOptionDetail_Done(index)
{
	if (window.jsreturn2.NbrRecs > 0)
	{
		if (optionTabs.activetab == 1)
			BN332.ToExpireRecords[index].StockSymbol = window.jsreturn2.record[0].stock_symbol;	
		else
			BN332.AvailRecords[index].StockSymbol = window.jsreturn2.record[0].stock_symbol;	
	}
	PaintOptionDetailWindow(index);	
}

function GetVestingDetail(fc, index)
{
	if (fc != escape("+",1))
		BN333 = new BN333Object();
	window.lawheader.nbr = 0;
	window.lawheader.token = "BN33.3";

	var pAGSObj = new AGSObject(authUser.prodline, "BN33.3");
	pAGSObj.event = "ADD";
	pAGSObj.rtn = "DATA";
	pAGSObj.longNames = "ALL";
	pAGSObj.tds = false;
	pAGSObj.func = "parent.GetVestingDetail_Done("+index+")";
	pAGSObj.field = "FC="+fc+"&BEG-COMPANY=" + authUser.company;
	pAGSObj.field += "&BEG-EMPLOYEE=" + BN332.Employee;

	if (optionTabs.activetab == 1)
	{
		pAGSObj.field += "&BEG-OPT-GRANT-NBR="+BN332.ToExpireRecords[index].GrantID;
		pAGSObj.field += "&BEG-STOCK-CTF="+BN332.ToExpireRecords[index].Certificate;	
	}
	else
	{
		pAGSObj.field += "&BEG-OPT-GRANT-NBR="+BN332.AvailRecords[index].GrantID;
		pAGSObj.field += "&BEG-STOCK-CTF="+BN332.AvailRecords[index].Certificate;
	}
	pAGSObj.field += "&PT-TABLE-I2="+BN333.NextRecordNbr;
	pAGSObj.out = "JAVASCRIPT";
	pAGSObj.debug = false;
	AGS(pAGSObj, "jsreturn");
}

function GetVestingDetail_Done(index)
{
	if (window.lawheader.gmsgnbr == "000")
	{
		var BN333msg = window.lawheader.gmsg.toUpperCase();

		if (BN333.Records.length > 0
		&& (BN333msg.indexOf("MORE") != -1 ||  BN333msg.indexOf("PAGEDOWN") != -1))
			GetVestingDetail(escape("+",1), index)		
		else
			PaintVestingDetailWindow(index);
	}
	else
	{
		seaAlert(window.lawheader.gmsg);
		switch(window.lawheader.gmsgnbr)
		{
			default: break;
		}
	}
}

function PaintVestingDetailWindow(index)
{	
	// Refresh the window contents 
	if (optionTabs.activetab == 1) {
		self.bottomleft.document.getElementById("paneHeader").innerHTML = getSeaPhrase("VESTING_DETAIL","ESS")+" - "+BN332.ToExpireRecords[index].Certificate;	
	}
	else {
		self.bottomleft.document.getElementById("paneHeader").innerHTML = getSeaPhrase("VESTING_DETAIL","ESS")+" - "+BN332.AvailRecords[index].Certificate;
	}
	PaintBottomLeftWindow();		
}

function PaintOptionDetailWindow(index)
{
	// Refresh the window contents	
	if (optionTabs.activetab == 1) {
		self.topright.document.getElementById("paneHeader").innerHTML = getSeaPhrase("OPTION_DETAIL","ESS")+" - "+BN332.ToExpireRecords[index].Certificate;
	}
	else {
		self.topright.document.getElementById("paneHeader").innerHTML = getSeaPhrase("OPTION_DETAIL","ESS")+" - "+BN332.AvailRecords[index].Certificate;
	}
	PaintTopRightWindow(index);
}

function ValidFormValue(type,obj,size,decimal,winname,signed)
{
	var isValid = true;

	if (NonSpace(obj.value) == 0)
		return true;

	switch(type.toString().toUpperCase())
	{
		case "NUMBER":		
			isValid = ValidNumber(obj,size,decimal,signed); break;
		case "PERCENT":
			isValid = ValidPercent(obj,size,decimal,signed); break;
	}	

	// Edit this form object for validity	
	if (!isValid)
	{
		if(typeof(winname) != "undefined" && winname)
		{
			var winObj = eval(winname);
			winObj.seaAlert(getSeaPhrase("INVALID_NO","ESS"));
		}
		else
			seaAlert(getSeaPhrase("INVALID_NO","ESS"));

		obj.focus();
		obj.select();	
	}

	return isValid;
}

// Round a numeric value and ensure a zero value is maintained.  Function roundToDecimal returns an empty space 
// if the value parameter is zero.
function roundValue(value,places)
{
	var val = roundToDecimal(value,places);

	if (NonSpace(val) == 0 || isNaN(parseFloat(val)))
	{
		val = "0";
		if (places > 0) val += ".";
		for (var i=0; i<places; i++)
			val += "0";		
	}
	
	return val;
}

function SortGrants(Property,SortByNbr)
{
	SortByNbr = (SortByNbr)?true:false;
	SortByProperty = Property;

	if (optionTabs.activetab == 1) {
		if (SortByNbr)
			BN332.ToExpireRecords.sort(sortByNumber);
		else
			BN332.ToExpireRecords.sort(sortByAlpha);
	}
	else if (optionTabs.activetab == 2) {
		if (SortByNbr)
			ExerciseHist.Records.sort(sortByNumber);
		else
			ExerciseHist.Records.sort(sortByAlpha);	
	}
	else {
		if (SortByNbr)
			BN332.AvailRecords.sort(sortByNumber);
		else
			BN332.AvailRecords.sort(sortByAlpha);
	}
	
	// Only re-paint the main window contents with the sorted records	
	PaintTopLeftWindow(true, Property);
}

function sortByAlpha(obj1, obj2)
{
	var name1 = obj1[SortByProperty];
	var name2 = obj2[SortByProperty];
	
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function sortByAlphaDescending(obj1, obj2)
{
	var name1 = obj1[SortByProperty];
	var name2 = obj2[SortByProperty];
	
	if (name1 > name2)
		return -1;
	else if (name1 < name2)
		return 1;
	else
		return 0;
}

function sortByNumber(obj1, obj2)
{
	return obj1[SortByProperty] - obj2[SortByProperty];
}

function ParseAGSValue(value, flag)
{
	return (value == "")? escape(" ") : escape(value,1);
}

// last column header is losing its class attributes when the tab is switched;
// work-around that by resetting its classname.
function optionTabs_OnActivate(tab)
{
	var tabProps = tab.id.split("_");
	var tabId = tabProps[0];
	var tabType = tabProps[1];
	var tabNbr = tabProps[2];

	try {
		switch(tabNbr) {
			case "0":
				optionTabs.frame.document.getElementById("model"+tabNbr).className = "plaintableheaderborder";
				break;
			case "1":	
				optionTabs.frame.document.getElementById("model"+tabNbr).className = "plaintableheaderborder";
				optionTabs.frame.document.getElementById("total"+tabNbr).className = "plaintableheaderborder";
				break;	
			case "2":	
				optionTabs.frame.document.getElementById("status"+tabNbr).className = "plaintableheaderborder";
				break;				
			default:
				break;
		}
	}
	catch(e) {}
}

// tab is not scrolling; need to activate it twice.  still looking into this.
function showTabByNbr(tabNbr)
{
	tabOnClick(optionTabs.frame.document.getElementById("optionTabs_TabBody_"+tabNbr));
}

function hideDetailFrames()
{
	try {
		document.getElementById("topright").style.visibility = "hidden";
		document.getElementById("bottomleft").style.visibility = "hidden";
		document.getElementById("bottomleft2").style.visibility = "hidden";
		document.getElementById("bottomleft3").style.visibility = "hidden";
		document.getElementById("bottomright").style.visibility = "hidden";
		document.getElementById("historydetail").style.visibility = "hidden";
	}
	catch(e) {}
}

