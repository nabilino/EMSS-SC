// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/stockoptions/lib/shr064.js,v 1.8.2.32 2014/02/19 23:04:13 brentd Exp $
//***************************************************************
//*                                                             *
//*                           NOTICE                            *
//*                                                             *
//*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//*                                                             *
//*   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************
// Define global variables.
var BN332;
var BN333;
var BN334;
var Brokers;
var ExerciseHist;
var BrokerWin;
var isEmployee = true;
var SortByProperty = "";
var LastGrantSortField = null;
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
		this.WebAvailable = 'N'; // Default web available = 'No' 	
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

function PaintStockOptionGrantTable(Tab, IsMgr, SortDir)
{
	SortDir = SortDir || "ascending";
	var NextSortDir = (SortDir == "ascending") ? "descending" : "ascending";	
	var toolTip;
	var returnVal = '';
	switch (Tab)
	{
		case 0:
		var Grants = BN332.AvailRecords;
		IsMgr = (IsMgr) ? true : false;
		if (Grants.length > 0)
		{
			returnVal += '<table class="plaintableborder" id="optionTbl'+Tab+'" border="0" cellpadding="0" cellspacing="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_19","SEA")+'">';
			returnVal += '<caption class="offscreen">'+getSeaPhrase("STOCK_OPTION_GRANTS","ESS")+'</caption>';
			returnVal += '<tr><th scope="col" class="plaintableheaderborder" style="width:80px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			toolTip = getSeaPhrase("CERTIFICATE","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'Certificate\',false,\''+NextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("CERTIFICATE","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
			returnVal += '<th scope="col" class="plaintableheaderborder" style="width:80px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			toolTip = getSeaPhrase("GRANT_DATE","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'GrantDate\',false,\''+NextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("GRANT_DATE","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
			toolTip = getSeaPhrase("PERCENT_VESTED","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<th scope="col" class="plaintableheaderborderright" style="width:80px;" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'PercentVested\',true,\''+NextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("PERCENT_VESTED","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
			toolTip = getSeaPhrase("SHARES_GRANTED","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<th scope="col" class="plaintableheaderborderright" style="width:80px;" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'SharesGranted\',true,\''+NextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("SHARES_GRANTED","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
			toolTip = getSeaPhrase("SHARES_AVAILABLE","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<th scope="col" class="plaintableheaderborderright" style="width:80px;" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'AvailableShares\',true,\''+NextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("SHARES_AVAILABLE","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
			toolTip = getSeaPhrase("GRANT_PRICE","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<th scope="col" class="plaintableheaderborderright" style="width:80px;" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'GrantPrice\',true,\''+NextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("GRANT_PRICE","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
			if (IsMgr == false)
				returnVal += '<th scope="col" id="model0" class="plaintableheaderborder" style="width:80px;text-align:center">'+getSeaPhrase("ACTION","ESS")+'</th>';
			returnVal += '</tr>';
		}
		if (Grants.length == 0)
		{
			returnVal += '<table class="plaintableborder" id="optionTbl'+Tab+'" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">';
			returnVal += '<tr><td class="fieldlabelboldleft" style="padding-top:10px;padding-left:10px">';
			if (IsMgr)
				returnVal += getSeaPhrase("NO_STOCK_INFO_FOR","ESS")+' '+HS10.Records[HS10.SelectedIndex-1].FullName+'.';
			else
				returnVal += getSeaPhrase("NO_STOCK_INFO","ESS");
			returnVal += '</td></tr>';
		}
		for (var i=0; i<Grants.length; i++)
		{
			returnVal += '<tr><td class="plaintablecellborder" style="width:80px">';
			toolTip = getSeaPhrase("GRANT_DESC","SEA",[Grants[i].Certificate,FormatDte4(Grants[i].GrantDate)])+' - '+getSeaPhrase("GRANT_DTL","SEA");
			returnVal += '<a href="javascript:;" onclick="parent.OptionDetail('+i+','+IsMgr+');return false;" title="'+toolTip+'">'+Grants[i].Certificate+'<span class="offscreen"> - '+getSeaPhrase("GRANT_DTL","SEA")+'</span></a></td>';
			returnVal += '<td class="plaintablecellborder" style="width:80px;text-align:center">'+FormatDte4(Grants[i].GrantDate)+'</td>';
			returnVal += '<td class="plaintablecellborderright" style="width:80px;">'+roundValue(Grants[i].PercentVested,2)+'</td>';
			returnVal += '<td class="plaintablecellborderright" style="width:80px;">'+formatComma(Grants[i].SharesGranted,true)+'</td>';
			returnVal += '<td class="plaintablecellborderright" style="width:80px;">'+formatComma(Grants[i].AvailableShares,true)+'</td>';
			returnVal += '<td class="plaintablecellborderright" style="width:80px;">'+formatComma(roundValue(Grants[i].GrantPrice,4))+'</td>';
			if (IsMgr == false)
			{
				toolTip = getSeaPhrase("GRANT_DESC","SEA",[Grants[i].Certificate,FormatDte4(Grants[i].GrantDate)])+' - '+getSeaPhrase("MODEL_GRANT_DTL","SEA");
				returnVal += '<td class="plaintablecellborder" style="width:80px;text-align:center;" nowrap>';
				returnVal += '<a href="javascript:;" onclick="parent.OptionModel('+i+');return false;" title="'+toolTip+'"><span class="offscreen">'+getSeaPhrase("GRANT_DESC","SEA",[Grants[i].Certificate,FormatDte4(Grants[i].GrantDate)])+' - </span>'+getSeaPhrase("MODEL_OPTIONS","ESS")+'</a></td>';
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
			returnVal += '<table class="plaintableborder" id="optionTbl'+Tab+'" border="0" cellpadding="0" cellspacing="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_22","SEA")+'">';
			returnVal += '<caption class="offscreen">'+getSeaPhrase("SHARES_TO_EXPIRE","ESS")+'</caption>';
			toolTip = getSeaPhrase("CERTIFICATE","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<tr><th scope="col" class="plaintableheaderborder" style="width:100px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'Certificate\',false,\''+NextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("CERTIFICATE","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
			toolTip = getSeaPhrase("EXPIRATION_DATE","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<th scope="col" class="plaintableheaderborder" style="width:100px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'ExpireDate\',false,\''+NextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("EXPIRATION_DATE","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
			toolTip = getSeaPhrase("SHARES_TO_EXPIRE","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<th scope="col" class="plaintableheaderborderright" style="width:100px;" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'AvailableShares\',true,\''+NextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("SHARES_TO_EXPIRE","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
			toolTip = getSeaPhrase("GRANT_VALUE","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<th scope="col" class="plaintableheaderborderright" style="width:100px;" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'GrantPrice\',true,\''+NextSortDir+'\');return false" title="'+toolTip+'">'+getSeaPhrase("GRANT_VALUE","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
			if (IsMgr == false)
				returnVal += '<th scope="col" id="model1" class="plaintableheaderborder" style="width:100px;text-align:center">'+getSeaPhrase("ACTION","ESS")+'</th>';
			returnVal += '</tr>'
		}
		if (Grants.length == 0)
		{
			returnVal += '<table class="plaintableborder" id="optionTbl'+Tab+'" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">';
			returnVal += '<tr><td class="fieldlabelboldleft" style="padding-top:10px;padding-left:10px">'
			if (IsMgr)
				returnVal += getSeaPhrase("NO_STOCK_TO_EXPIRE_FOR","ESS")+' '+HS10.Records[HS10.SelectedIndex-1].FullName+'.</td>';
			else
				returnVal += getSeaPhrase("NO_STOCK_TO_EXPIRE","ESS")+'</td></tr>';
		}
		for (var i=0; i<Grants.length; i++)
		{
			Grants.TotalExpiredShares += Grants[i].AvailableShares;
			Grants.TotalGrantPrice += Grants[i].GrantPrice;
			toolTip = getSeaPhrase("EXP_GRANT_DESC","SEA",[Grants[i].Certificate,FormatDte4(Grants[i].ExpireDate)])+' - '+getSeaPhrase("GRANT_DTL","SEA");
			returnVal += '<tr><td class="plaintablecellborder" style="width:100px">';
			returnVal += '<a href="javascript:;" onclick="parent.OptionDetail('+i+','+IsMgr+');return false;" title="'+toolTip+'">'+Grants[i].Certificate+'<span class="offscreen"> - '+getSeaPhrase("GRANT_DTL","SEA")+'</span></a></td>';
			returnVal += '<td class="plaintablecellborder" style="width:100px;text-align:center">'+FormatDte4(Grants[i].ExpireDate)+'</td>';
			returnVal += '<td class="plaintablecellborderright" style="width:100px;">';
			returnVal += formatComma(Grants[i].AvailableShares,true)+'</td>';
			returnVal += '<td class="plaintablecellborderright" style="width:100px;">';
			returnVal += formatComma(roundValue(Grants[i].GrantPrice,4))+'</td>';
			if (IsMgr == false)
			{
				toolTip = getSeaPhrase("EXP_GRANT_DESC","SEA",[Grants[i].Certificate,FormatDte4(Grants[i].ExpireDate)])+' - '+getSeaPhrase("MODEL_GRANT_DTL","SEA");
				returnVal += '<td class="plaintablecellborder" style="width:100px;text-align:center" nowrap>';
				returnVal += '<a href="javascript:;" onclick="parent.OptionModel('+i+');return false;" title="'+toolTip+'"><span class="offscreen">'+getSeaPhrase("EXP_GRANT_DESC","SEA",[Grants[i].Certificate,FormatDte4(Grants[i].ExpireDate)])+' - </span>'+getSeaPhrase("MODEL_OPTIONS", "ESS")+'</a></td>';
			}
			returnVal += '</tr>';
		}
		if (Grants.length > 0)
		{
			returnVal += '<tr><td class="plaintableheaderborder" style="width:100px;text-align:center">'+getSeaPhrase("TOTAL","ESS")+'</td><td class="plaintableheaderborder" style="width:100px">&nbsp;</td>'
			returnVal += '<td class="plaintableheaderborderright" style="width:100px;">'+formatComma(Grants.TotalExpiredShares,true)+'</td>';
			returnVal += '<td class="plaintableheaderborderright" style="width:100px;">'+formatComma(roundValue(Grants.TotalGrantPrice,4))+'</td>';
			if (IsMgr == false)
				returnVal += '<td id="total1" class="plaintableheaderborder" style="width:100px;text-align:center">&nbsp;</td>';
			returnVal += '</tr>';
		}
		returnVal += '</table>';
		break;
		case 2:
		var Grants = ExerciseHist.Records;
		if (Grants.length > 0)
		{
			returnVal += '<table class="plaintableborder" id="optionTbl'+Tab+'" border="0" cellpadding="0" cellspacing="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_23","SEA")+'">';
			returnVal += '<caption class="offscreen">'+getSeaPhrase("EXERCISE_HISTORY","ESS")+'</caption>';
			toolTip = getSeaPhrase("CERTIFICATE","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<tr><th scope="col" class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'stock_ctf\',false,\''+NextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("CERTIFICATE","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
			toolTip = getSeaPhrase("EXERCISE_DATE","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<th scope="col" class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'exercise_date\',false,\''+NextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("EXERCISE_DATE","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';  
			toolTip = getSeaPhrase("NUMBER_OF_SHARES","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<th scope="col" class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'shares_exe\',true,\''+NextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("NUMBER_OF_SHARES","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
			toolTip = getSeaPhrase("EXERCISE_COST","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<th scope="col" class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'exercise_cost\',true,\''+NextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("EXERCISE_COST","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';  
			toolTip = getSeaPhrase("MARKET_VALUE","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<th scope="col" class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'fair_mkt_val\',true,\''+NextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("MARKET_VALUE","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';		 
			toolTip = getSeaPhrase("GAIN__LOSS","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<th scope="col" class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'gain_lost_val\',true,\''+NextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("GAIN__LOSS","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
			toolTip = getSeaPhrase("TAXABLE_WAGES","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<th scope="col" class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'tax_wage_upd\',true,\''+NextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("TAXABLE_WAGES","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
			toolTip = getSeaPhrase("TAX_AMOUNT","ESS")+' - '+getSeaPhrase("SORT_BY_X","SEA");
			returnVal += '<th scope="col" class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'emp_tax_amt\',true,\''+NextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("TAX_AMOUNT","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th>';
			toolTip = getSeaPhrase("SORT_BY_STATUS","ESS");
			returnVal += '<th scope="col" id="status2" class="plaintableheaderborder" style="width:70px;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">';
			returnVal += '<a class="columnsort" href="javascript:;" onclick="parent.SortGrants(\'pending_xlt\',false,\''+NextSortDir+'\');return false;" title="'+toolTip+'">'+getSeaPhrase("STATUS","ESS")+'<span class="offscreen"> - '+getSeaPhrase("SORT_BY_X","SEA")+'</span></a></th></tr>';
		}
		else
		{
			returnVal += '<table class="plaintableborder" id="optionTbl'+Tab+'" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">';
			returnVal += '<tr><td class="fieldlabelboldleft" style="padding-top:10px;padding-left:10px">';
			if (IsMgr)
				returnVal += getSeaPhrase("NO_EXERCISE_INFO_FOR","ESS")+' ' +HS10.Records[HS10.SelectedIndex-1].FullName+'.</td></tr>';
			else
				returnVal += getSeaPhrase("NO_EXERCISE_INFO","ESS")+'</td></tr>';
		}
		for (var i=0; i<Grants.length; i++)
		{
			toolTip = getSeaPhrase("EXC_GRANT_DESC","SEA",[Grants[i].stock_ctf,Grants[i].exercise_date])+' - '+getSeaPhrase("GRANT_DTL","SEA");
			returnVal += '<tr><td class="plaintablecellborder" style="width:70px;text-align:center">';
			returnVal += '<a href="javascript:;" onclick="parent.HistoryDetail('+i+');return false" title="'+toolTip+'">'+Grants[i].stock_ctf+'<span class="offscreen"> - '+getSeaPhrase("GRANT_DTL","SEA")+'</span></a></td>';
			returnVal += '<td class="plaintablecellborder" style="width:70px;text-align:center">'+Grants[i].exercise_date+'</td>';
			returnVal += '<td class="plaintablecellborderright" style="width:70px;">'+formatComma(Grants[i].shares_exe,true)+'</td>';
			returnVal += '<td class="plaintablecellborderright" style="width:70px;">'+formatComma(roundValue(Grants[i].exercise_cost,4))+'</td>';
			returnVal += '<td class="plaintablecellborderright" style="width:70px;">'+formatComma(roundValue(Grants[i].fair_mkt_val,2))+'</td>';
			returnVal += '<td class="plaintablecellborderright" style="width:70px;">'+formatComma(roundValue(Grants[i].gain_lost_val,2))+'</td>';
			returnVal += '<td class="plaintablecellborderright" style="width:70px;">'+formatComma(roundValue(Grants[i].tax_wage_upd,2))+'</td>';
			returnVal += '<td class="plaintablecellborderright" style="width:70px;">'+formatComma(roundValue(Grants[i].emp_tax_amt,2))+'</td>';
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
function PaintBottomLeftWindow(index)
{
	var Grant;
	if (optionTabs.activetab == 1)
		Grant = BN332.ToExpireRecords[index];
	else
		Grant = BN332.AvailRecords[index];	
	var VestedDetail = BN333.Records;
	var returnVal = '';
	if (VestedDetail.length > 0)
	{
		returnVal += '<table border="0" cellpadding="0" cellspacing="0" width="100%" styler="list" summary="'+getSeaPhrase("TSUM_24","SEA",[Grant.Certificate])+'">';
		returnVal += '<caption class="offscreen">'+getSeaPhrase("TCAP_16","SEA",[Grant.Certificate])+'</caption>';
		returnVal += '<tr><th scope="col" class="plaintableheaderborder" style="width:80px;text-align:center">'+getSeaPhrase("GRANT_DATE","ESS")+'</th>';
		returnVal += '<th scope="col" class="plaintableheaderborderright" style="width:80px;">'+getSeaPhrase("PERCENT","ESS")+'</th>';
		returnVal += '<th scope="col" class="plaintableheaderborderright" style="width:80px;">'+getSeaPhrase("CUMULATIVE_SHARES","ESS")+'</th>';
		returnVal += '<th scope="col" class="plaintableheaderborderright" style="width:80px;">'+getSeaPhrase("PERIOD_PERCENT","ESS")+'</th>';
		returnVal += '<th scope="col" class="plaintableheaderborderright" style="width:80px;">'+getSeaPhrase("PERIOD_SHARES","ESS")+'</th></tr>';	
	}	
	if (VestedDetail.length == 0)
	{
		returnVal += '<table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">';
		returnVal += '<tr><td class="fieldlabelboldleft" style="padding-top:10px;padding-left:10px">'+getSeaPhrase("NO_VEST_SCHEDULE","ESS")+'</td></tr>';
	}
	for (var i=0; i<VestedDetail.length; i++)
	{
		returnVal += '<tr><td class="plaintablecellborder" style="width:80px;text-align:center">'+FormatDte4(VestedDetail[i].Date)+'</td>';
		returnVal += '<td class="plaintablecellborderright" style="width:80px;">'+roundValue(VestedDetail[i].Percent,2)+'</td>';
		returnVal += '<td class="plaintablecellborderright" style="width:80px;">'+formatComma(VestedDetail[i].CumulativeShares,true)+'</td>';
		returnVal += '<td class="plaintablecellborderright" style="width:80px;">'+roundValue(VestedDetail[i].PeriodPercent,2)+'</td>';
		returnVal += '<td class="plaintablecellborderright" style="width:80px;">'+formatComma(VestedDetail[i].PeriodShares,true)+'</td></tr>';
	}
	returnVal += '</table>';
   	self.bottomleft.document.getElementById("paneBody").innerHTML = returnVal;
   	self.bottomleft.stylePage();
	document.getElementById("bottomleft").style.visibility = "visible";
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.topright.getWinTitle()])+' '+getSeaPhrase("CNT_UPD_FRM","SEA",[self.bottomleft.getWinTitle()]));
	fitToScreen();
}

///////////////////////////////////////////////////////////////////////////////////////////
//
// Content for the top right window - Option Detail.
//
function PaintTopRightWindow(index)
{
	var Grant;
	if (optionTabs.activetab == 1)
		Grant = BN332.ToExpireRecords[index];
	else
		Grant = BN332.AvailRecords[index];
	var returnVal = '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" width="100%" summary="'+getSeaPhrase("TSUM_25","SEA",[Grant.Certificate])+'">';	
	returnVal += '<caption class="offscreen">'+getSeaPhrase("TCAP_17","SEA",[Grant.Certificate])+'</caption>';
	returnVal += '<tr><th scope="col" colspan="2"></th></tr>'
	returnVal += '<tr><th class="plaintablerowheaderborder" style="width:50%;">'+getSeaPhrase("GRANT_ID","ESS")+'</th>';
	returnVal += '<td class="plaintablecelldisplayright" style="width:50%;">'+Grant.GrantID+'</td></tr>';
	returnVal += '<tr><th class="plaintablerowheaderborder" style="width:50%;">'+getSeaPhrase("STOCK_SYMBOL","ESS")+'</th>';
	returnVal += '<td class="plaintablecelldisplayright" style="width:50%;">'+Grant.StockSymbol+'</td></tr>';
	returnVal += '<tr><th class="plaintablerowheaderborder" style="width:50%;">'+getSeaPhrase("DATE_TO_EXPIRE","ESS")+'</th>';
	returnVal += '<td class="plaintablecelldisplayright" style="width:50%;">'+FormatDte4(Grant.ExpireDate)+'</td></tr>';
	returnVal += '<tr><th class="plaintablerowheaderborder" style="width:50%;">&nbsp;</th>';
	returnVal += '<td class="plaintablecelldisplayright" style="width:50%;">&nbsp;</td></tr>';
	returnVal += '<tr><th class="plaintablerowheaderborder" style="width:50%;">'+getSeaPhrase("SHARES","ESS")+':</th>';
	returnVal += '<td class="plaintablecelldisplayright" style="width:50%;">&nbsp;</td></tr>';
	returnVal += '<tr><th class="plaintablerowheaderborder" style="width:50%;">'+getSeaPhrase("VESTED","ESS")+'</th>';
	returnVal += '<td class="plaintablecelldisplayright" style="width:50%;">'+formatComma(Grant.VestedShares,true)+'</td></tr>';
	returnVal += '<tr><th class="plaintablerowheaderborder" style="width:50%;">'+getSeaPhrase("UNVESTED","ESS")+'</th>';
	returnVal += '<td class="plaintablecelldisplayright" style="width:50%;">'+formatComma(Grant.UnvestedShares,true)+'</td></tr>';
	returnVal += '<tr><th class="plaintablerowheaderborder" style="width:50%;">'+getSeaPhrase("AS_OF_DATE","ESS")+'</th>';
	returnVal += '<td class="plaintablecelldisplayright" style="width:50%;">'+fmttoday+'</td></tr>';
	returnVal += '<tr><th class="plaintablerowheaderborder" style="width:50%;">'+getSeaPhrase("VESTED","ESS")+'</th>';
	returnVal += '<td class="plaintablecelldisplayright" style="width:50%;">'+formatComma(Grant.VestedShares,true)+'</td></tr>';
	returnVal += '<tr><th class="plaintablerowheaderborder" style="width:50%;">'+getSeaPhrase("EXERCISED","ESS")+'</th>';
	returnVal += '<td class="plaintablecelldisplayright" style="width:50%;">'+formatComma(Grant.ExercisedShares,true)+'</td></tr>';
	returnVal += '<tr><th class="plaintablerowheaderborder" style="width:50%;">'+getSeaPhrase("FORFEITED","ESS")+'</th>';
	returnVal += '<td class="plaintablecelldisplayright" style="width:50%;">'+formatComma(Grant.ForfeitedShares,true)+'</td></tr>';	
	returnVal += '<tr><th class="plaintablerowheaderborder" style="width:50%;">'+getSeaPhrase("EXPIRED","ESS")+'</th>';
	returnVal += '<td class="plaintablecelldisplayright" style="width:50%;text-decoration:underline">';
	for (var j=formatComma(Grant.ExpiredShares,true).toString().length; j<formatComma(Grant.AvailableShares,true).toString().length+2; j++)
		returnVal += '&nbsp;';
	returnVal += formatComma(Grant.ExpiredShares,true)+'</td></tr>';
	returnVal += '<tr><th class="plaintablerowheaderborderbottom" style="width:50%;">'+getSeaPhrase("AVAILABLE","ESS")+'</th>';
	returnVal += '<td class="plaintablecelldisplayright" style="width:50%;">'+formatComma(Grant.AvailableShares,true)+'</td></tr></table>';
   	self.topright.document.getElementById("paneBody").innerHTML = returnVal;
   	self.topright.stylePage();
	document.getElementById("topright").style.visibility = "visible";
	fitToScreen();
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
		if (BN332.Records.length > 0 && ((NonSpace(BN332.NextGrantNbr) > 0 && BN332.NextGrantNbr != BN332.LastGrantNbr) 
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
				BN332.Records.sort(sortByDscAlpha);		
			}
			// Display only those grants which are web-available
			for (var i=0; i<BN332.Records.length; i++)
			{
				// Only display stock option records that are web available
				if ((IsMgr == false && BN332.Records[i].WebAvailable == "Y") || (IsMgr == true && parseInt(BN332.Records[i].SupervisorWebAvailable,10) == 2))
				{
					// Records for Stock Option Grants tab
					BN332.AvailRecords = BN332.AvailRecords.concat(BN332.Records[i]);
					// Only display 100% vested shares to expire within the next 12 months 
					if (parseInt(BN332.Records[i].PercentVested,10) == 100 && isNaN(parseInt(BN332.Records[i].ExpireDate,10)) == false 
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
				BN332.ToExpireRecords.sort(sortByDscAlpha);					
			}
			PaintTopLeftWindow();
		}
	}
	else
	{
		removeWaitAlert();
		seaAlert(window.lawheader.gmsg, null, null, "error");
	}	
}

function OptionDetail(index, IsMgr)
{
	IsMgr = (IsMgr) ? true : false;
	activateTableRow("optionTbl"+optionTabs.activetab,index,optionTabs.frame);
	if (IsMgr == false) 
	{
		document.getElementById("bottomleft2").style.visibility = "hidden";
		document.getElementById("bottomleft3").style.visibility = "hidden";
		document.getElementById("bottomright").style.visibility = "hidden";
	}
	var nextFunc = function()
	{
		GetOptionDetail(index);
		GetVestingDetail("I", index);	
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function GetOptionDetail(index)
{
	var pDMEObj = new DMEObject(authUser.prodline, "BNSTKGNT");
	pDMEObj.out = "JAVASCRIPT";
	pDMEObj.index = "BSGSET1";
	pDMEObj.field = "stock-symbol";
	if (optionTabs.activetab == 1)
		pDMEObj.key = authUser.company+"="+BN332.ToExpireRecords[index].GrantID;
	else
		pDMEObj.key = authUser.company+"="+BN332.AvailRecords[index].GrantID;
	pDMEObj.max = "1";
	pDMEObj.func = "GetOptionDetail_Done("+index+")";
	pDMEObj.exclude = "drills;keys";
	pDMEObj.debug = false;
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
		if (BN333.Records.length > 0 && (BN333msg.indexOf("MORE") != -1 ||  BN333msg.indexOf("PAGEDOWN") != -1))
			GetVestingDetail(escape("+",1), index)		
		else
			PaintVestingDetailWindow(index);
	}
	else
	{
		removeWaitAlert();
		seaAlert(window.lawheader.gmsg, null, null, "error");
	}	
}

function PaintVestingDetailWindow(index)
{	
	// Refresh the window contents 
	if (optionTabs.activetab == 1)
		self.bottomleft.document.getElementById("paneHeader").innerHTML = getSeaPhrase("VESTING_DETAIL","ESS")+" - "+BN332.ToExpireRecords[index].Certificate;
	else
		self.bottomleft.document.getElementById("paneHeader").innerHTML = getSeaPhrase("VESTING_DETAIL","ESS")+" - "+BN332.AvailRecords[index].Certificate;
	PaintBottomLeftWindow(index);		
}

function PaintOptionDetailWindow(index)
{
	// Refresh the window contents	
	if (optionTabs.activetab == 1)
		self.topright.document.getElementById("paneHeader").innerHTML = getSeaPhrase("OPTION_DETAIL","ESS")+" - "+BN332.ToExpireRecords[index].Certificate;
	else
		self.topright.document.getElementById("paneHeader").innerHTML = getSeaPhrase("OPTION_DETAIL","ESS")+" - "+BN332.AvailRecords[index].Certificate;
	PaintTopRightWindow(index);
}

function ValidFormValue(type, obj, size, decimal, winname, signed)
{
	var isValid = true;
	if (NonSpace(obj.value) == 0)
		return true;
	switch (type.toString().toUpperCase())
	{
		case "NUMBER":		
			isValid = ValidNumber(obj,size,decimal,signed); break;
		case "PERCENT":
			isValid = ValidPercent(obj,size,decimal,signed); break;
	}
	return isValid;
}

// Round a numeric value and ensure a zero value is maintained.  Function roundToDecimal returns an empty space if the value parameter is zero.
function roundValue(value, places)
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

function SortGrants(Property, SortByNbr, Dir)
{
	var nextFunc = function()
	{
		SortByNbr = (SortByNbr) ? true : false;
		SortByProperty = Property;
		if (Property != LastGrantSortField)
			Dir = "ascending";
		LastGrantSortField = Property;	
		var SortFunc;
		if (SortByNbr)
			SortFunc = (Dir == "ascending") ? sortByAscNumber : sortByDscNumber;
		else
			SortFunc = (Dir == "ascending") ? sortByAscAlpha : sortByDscAlpha;
		if (optionTabs.activetab == 1)
			BN332.ToExpireRecords.sort(SortFunc);
		else if (optionTabs.activetab == 2)
			ExerciseHist.Records.sort(SortFunc);
		else
			BN332.AvailRecords.sort(SortFunc);
		// Only re-paint the main window contents with the sorted records	
		PaintTopLeftWindow(true, Property, Dir);
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function sortByAscAlpha(obj1, obj2)
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

function sortByDscAlpha(obj1, obj2)
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

function sortByAscNumber(obj1, obj2)
{
	return obj1[SortByProperty] - obj2[SortByProperty];
}

function sortByDscNumber(obj1, obj2)
{
	return obj2[SortByProperty] - obj1[SortByProperty];
}

function ParseAGSValue(value, flag)
{
	return (value == "")? escape(" ") : escape(value,1);
}

// last column header is losing its class attributes when the tab is switched; work around that by resetting its classname.
function optionTabs_OnActivate(tab)
{
	var tabProps = tab.id.split("_");
	var tabId = tabProps[0];
	var tabType = tabProps[1];
	var tabNbr = tabProps[2];
	try 
	{
		switch (tabNbr) 
		{
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
			default: break;
		}
	}
	catch(e) {}
}

// if tab does not scroll, activate it twice.
function showTabByNbr(tabNbr)
{
	tabOnClick(optionTabs.frame.document.getElementById("optionTabs_TabBody_"+tabNbr));
}

function hideDetailFrames()
{
	try 
	{
		document.getElementById("topright").style.visibility = "hidden";
		document.getElementById("bottomleft").style.visibility = "hidden";
		document.getElementById("bottomleft2").style.visibility = "hidden";
		document.getElementById("bottomleft3").style.visibility = "hidden";
		document.getElementById("bottomright").style.visibility = "hidden";
		document.getElementById("historydetail").style.visibility = "hidden";
	}
	catch(e) {}
}
