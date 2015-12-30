// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/401k/401kfiles/Attic/401k.js,v 1.1.2.21 2014/02/24 22:02:30 brentd Exp $
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
/*
 *	401(k) Savings Modeling Common Objects
 */
function FrequencyObject(code, description, value)
{
	this.code = code;
	this.description = description;
	this.value = value;
}
 
/******
FormatDollar takes an argument, string or number, checks for validity in
that, it determines whether or not the string can be formatted into a 
number then formats this number with commas and a rounded decimal field 
if necessary
******/
function FormatDollar(arg)
{	
	if (GetNumber(arg)!=-1)
	{
		arg = '$'+FormatNumber(arg);
		return arg;
	}
	else
		return 0;

}

/*******
FormatPercent performs the same operations as FormatDollar, with the exception
that FormatPercent formats the number into a percentage, it appends a "%" sign
at the end of the number whereas the FormatDollar gives a "$" before the
number
*******/
function FormatPercent(arg)
{
	if (GetNumber(arg) != -1)
	{
		arg = FormatNumber(arg)+'%';
		return arg;
	}
	else
		return 0;
}

/******
GetNumber checks whether the number typed is a valid number. It checks 
for precedeing "$", "%" and "+" and postceding "$", "%", "+". It fails 
when the user types in a negative value or the "-" sign or if the user 
types in characters other then the "$", "%" and "+".  The user may also 
type in commas. If the number passes the test it is returned back to the 
function from where it was called. If not, the function returns either a 
zero for an empty string or a -1 for an invalid number.
*******/
function GetNumber(str)
{
	var flag = false;
	str += '';
	newstr = '';
	if (str.length == 0)
		return 0;
	for (var y=0; y<str.length; y++)
	{
		var arg = str.charAt(y);
		if (arg < '0' || arg > '9')
		{
			if ((arg == '$' || arg=='%' || arg=='+') && (y==0 || y==str.length-1))
			{
				var arg2 = str.charAt(++y);
				if ((arg2 >= '0' && arg2 <= '9') || arg2 == '$' || arg2 == '%' || arg2 == '+')
				{
					if (arg == '$' && (arg2 == '%' || arg2 == '$'))
						break;
					else if (arg == '%' && (arg2 == '$' || arg2 == '%'))
						break;
					else if (arg == '+' && arg2 == '+')
						break;
					else
						continue;						
				}
				else
					break;
			}
			else if (arg == ',')
				continue;
			else if (arg == '.' && flag)
				break;
			else if (arg == '.' && !flag)
				flag = true;
			else
				break;			
		}
		else
			newstr += arg;
	}
	if (y == str.length)
		return (newstr);
	else if (str.length == 0)
		return 0;
	else
		return -1;
}

/*******
FormatNumber will take a valid number and format it by placing commas where 
needed and rounding the decimal field to a certain number of decimal places. 
Other functions are called from within the function that are defined elsewhere. 
********/
function FormatNumber(arg)
{
	var retval = "";
	var front = true;
	var n = 0;
	arg += '';
	for (var i=0; i<arg.length; i++)
	{
		if ((arg.charAt(i)>='0' && arg.charAt(i)<='9') || arg.charAt(i)=='.')
		{
			if (front)
			{
				if (arg.charAt(i) == '0')
					continue;
				else
					front = false;
			}	
			retval += arg.charAt(i);
		}
	}
	retval = formatComma(roundToDecimal(retval,2)+'');	
	return retval;
}

function checkYears(myObj)
{
	var myYears = self.MAIN.document.forms["savingModel"].elements[myObj];
	var invalidDigits = function(val)
	{
		for (var i=0; i<val.length; i++)
		{
			if (val.charAt(i) < '0' || val.charAt(i) > '9')
				return true;
		}
		return false;
	}
	if (invalidDigits(myYears.value))
		myYears.value = "0";
}

function breakdown(val)
{
	var retval = '';
	for (var i=0; i<val.length; i++)
	{
		if (val.charAt(i)!=',' && val.charAt(i)!='$' && val.charAt(i)!='%')
			retval += val.charAt(i);
	}
	if (retval.length==0)
		return 0;
	else
		return parseFloat(retval);
}

/*
 *	Savings Modeling Results Logic
 */
var total;
var contrib;
var match;
var inftotal;
var place;

function prepareResults()
{
	Scenerios[Scenerios.length-1].Year = thisYear + Scenerios[Scenerios.length-1].Years;
	FutureValue();
}

function FutureValue()
{
	var len = Scenerios.length;
	var Sal = Scenerios[len-1].Salary;
	var PayRate = pay = Scenerios[len-1].payRate;
	var Amt = Scenerios[len-1].employeeAmount;
	var Cmp = Scenerios[len-1].companyAmount;
	var pv = IAT = Total = Scenerios[len-1].beginningBalance;
	var IE = 0;
	var FC = parseInt(Scenerios[len-1].Frequency.value,10);
	var AIR = Scenerios[len-1].anticipatedInterestRate;
	var ERoI = Scenerios[len-1].estimatedInflationRate;
	var Hours = Scenerios[len-1].AnnualHours;
	var FTE = Scenerios[len-1].FTE;
	var ir = (AIR/100)/FC;
	var inf = (ERoI/100)/FC;
	var Inflation = 0;
	var ECTotal = 0;
	var CCTotal = 0;
	contrib = new Array();
	match = new Array();
	total = new Array();
	inftotal = new Array();
	for (var i=0; i<(parseInt(Scenerios[len-1].Years,10)); i++) 
	{
		for (var j=0; j<FC; j++) 
		{
			if (!Amt)
				Scenerios[len-1].employeeAmount = (Scenerios[len-1].employeePercent/100) * Sal;
			if (!Cmp)
				Scenerios[len-1].companyAmount = Scenerios[len-1].employeeAmount * (Scenerios[len-1].companyPercent/100);
			ECTotal += (Scenerios[len-1].employeeAmount/FC);
			CCTotal += (Scenerios[len-1].companyAmount/FC);
			IE += (Total*ir)
			Total += (Total*ir);
			Total += (Scenerios[len-1].employeeAmount/FC) + (Scenerios[len-1].companyAmount/FC);
			IAT += (IAT*(ir-inf));
			IAT += (Scenerios[len-1].employeeAmount/FC) + (Scenerios[len-1].companyAmount/FC);
		}
		contrib[i] = ECTotal;
		match[i] = CCTotal;
		total[i] = Total;
		inftotal[i] = IAT;
		if (Scenerios[0].Class == "S")
			Sal = Sal*(1+(Scenerios[len-1].projectedIncrease/100));
		else 
		{
			PayRate = parseFloat(PayRate) + parseFloat(Scenerios[len-1].projectedIncrease);
			Sal = PayRate * parseInt(Hours,10) * parseFloat(FTE);
		}
	}
	if (!ERoI)
		IAT = Total;
	ECTotal += Scenerios[len-1].beginningBalance;
	Scenerios[len-1].employeeContributionTotal = (isNaN(ECTotal)) ? 0 : roundToDecimal(ECTotal,2);
	Scenerios[len-1].companyContributionTotal = (isNaN(CCTotal)) ? 0 : roundToDecimal(CCTotal,2);
	Scenerios[len-1].interestEarned = (isNaN(IE)) ? 0 : roundToDecimal(IE,2);
	Scenerios[len-1].Total = (isNaN(Total)) ? 0 : roundToDecimal(Total,2);
	Scenerios[len-1].inflationAdjustedTotal = (isNaN(IAT)) ? 0 :roundToDecimal(IAT,2);
	Scenerios[len-1].contrib = contrib;
	Scenerios[len-1].match = match;
	Scenerios[len-1].total = total;
	Scenerios[len-1].inftotal = inftotal;
	Scenerios[len-1].futureSalary = Sal;
	Scenerios[len-1].futurePayRate = PayRate;
	PaintResults();
}

function PaintResults()
{
	var html = '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_9","SEA")+'"><tr>'
	html += '<caption class="offscreen">'+getSeaPhrase("TCAP_7","SEA")+'</caption>'
	html += '<tr><th scope="col" class="plaintablerowheaderborder" style="width:168px" nowrap>&nbsp;</td>'
	var len = Scenerios.length;
	for (var t=0; t<len; t++)
		html += '<th scope="col" class="plaintableheaderborder">'+getSeaPhrase("SCENARIO_NBR","ESS",[''+(t+1)])+'</th>'
	html += '<tr><th scope="row" class="plaintablerowheaderborder" style="width:168px" nowrap>'+getSeaPhrase("AS_OF","ESS")+'</th>'
	for (var t=0; t<len; t++)
		html += '<td class="plaintablecellboldborder">'+Scenerios[t].Year+'&nbsp;</td>'
	html += '</tr><tr><th scope="row" class="plaintablerowheaderborder" style="width:168px" nowrap>'+getSeaPhrase("EMPLOYEE_CONTRIBUTION","ESS")+'</th>'
	for (var t=0; t<len; t++)
		html += '<td class="plaintablecellborder">'+FormatNumber(Scenerios[t].employeeContributionTotal)+'&nbsp;</td>'
	html += '</tr><tr><th scope="row" class="plaintablerowheaderborder" style="width:168px" nowrap>'+getSeaPhrase("COMPANY_CONTRIBUTION","ESS")+'</th>'
	for (var t=0; t<len; t++)
		html += '<td class="plaintablecellborder">'+FormatNumber(Scenerios[t].companyContributionTotal)+'&nbsp;</td>'
	html += '</tr><tr><th scope="row" class="plaintablerowheaderborder" style="width:168px" nowrap>'+getSeaPhrase("INTEREST_EARNED","ESS")+'</th>'
	for (var t=0; t<len; t++)
		html += '<td class="plaintablecellborder">'+FormatNumber(Scenerios[t].interestEarned)+'&nbsp;</td>'
	html += '</tr><tr><th scope="row" class="plaintablerowheaderborder" style="width:168px" nowrap>'+getSeaPhrase("TOTAL","ESS")+'</th>'
	for (var t=0; t<len; t++)
		html += '<td class="plaintablecellboldborder">'+FormatNumber(Scenerios[t].Total)+'&nbsp;</td>'
	html += '</tr><tr><th scope="row" class="plaintablerowheaderborder" style="width:168px" nowrap>'+getSeaPhrase("ADJUSTED_TOTAL","ESS")+'</th>'
	for (var t=0; t<len; t++)
		html += '<td class="plaintablecellborder">'+FormatNumber(Scenerios[t].inflationAdjustedTotal)+'&nbsp;</td>'
	html += '</tr><tr><td class="plaintablecellborder" style="width:10px">&nbsp;</td>'
	for (var t=0; t<len; t++) 
		html += '<td class="plaintablecellborder" style="height:10px">&nbsp;</td>'
	html += '</tr><tr><th scope="row" class="plaintablerowheaderborder" style="width:168px" nowrap>'+getSeaPhrase("EMPLOYEE_CONTRIBUTION","ESS")+'</th>'
	for (var t=0; t<len; t++) 
	{
		if (Scenerios[t].employeeAmount)
			Scenerios[t].employeeContribution = FormatNumber(Scenerios[t].employeeAmount)
		else
			Scenerios[t].employeeContribution = roundToDecimal(Scenerios[t].employeePercent,2)+'%'
		html += '<td class="plaintablecellborder">'+FormatNumber(Scenerios[t].employeeContribution)+'&nbsp;</td>'
	}
	html += '</tr><tr><th scope="row" class="plaintablerowheaderborder" style="width:168px" nowrap>'+getSeaPhrase("COMPANY_CONTRIBUTION","ESS")+'</th>'
	for (var t=0; t<len; t++) 
	{
		if (Scenerios[t].companyAmount)
			Scenerios[t].companyContribution = FormatNumber(Scenerios[t].companyAmount)
		else
			Scenerios[t].companyContribution = FormatNumber(Scenerios[t].companyPercent)+'%'
		html += '<td class="plaintablecellborder">'+FormatNumber(Scenerios[t].companyContribution)+'&nbsp;</td>'
	}
	html += '</tr><tr><th scope="row" class="plaintablerowheaderborder" style="width:168px" nowrap>'+getSeaPhrase("INTEREST_RATE","ESS")+'</th>'
	for (var t=0; t<len; t++) 
		html += '<td class="plaintablecellborder">'+Scenerios[t].anticipatedInterestRate+'%</td>'
	html += '</tr><tr><th scope="row" class="plaintablerowheaderborder" style="width:168px" nowrap>'+getSeaPhrase("YEARS_INVESTED","ESS")+'</th>'
	for (var t=0; t<len; t++) 
		html += '<td class="plaintablecellborder">'+Scenerios[t].Years+'&nbsp;</td>'
	html += '</tr><tr><th scope="row" class="plaintablerowheaderborder" style="width:168px" nowrap>'+getSeaPhrase("INFLATION_RATE","ESS")+'</th>'
	for (var t=0; t<len; t++) 
		html += '<td class="plaintablecellborder">'+Scenerios[t].estimatedInflationRate+'%</td>'
	html += '</tr><tr><th scope="row" class="plaintablerowheaderborder" style="width:168px" nowrap>'+getSeaPhrase("BEGINNING_BALANCE","ESS")+'</th>'
	for (var t=0; t<len; t++) 
		html += '<td class="plaintablecellborder">'+FormatNumber(Scenerios[t].beginningBalance)+'&nbsp;</td>'
	html += '</tr><tr><th scope="row" class="plaintablerowheaderborder" style="width:168px" nowrap>'
	if (len > 0 && Scenerios[0].Class == "S")
		html += getSeaPhrase("ANNUAL_SALARY","ESS")
	else
		html += getSeaPhrase("PAY_RATE","ESS")
	html += '</th>'
	for (var t=0; t<len; t++) 
	{
		html += '<td class="plaintablecellborder">'
		if (Scenerios[t].Class == "H")
			html += FormatNumber(Scenerios[t].futurePayRate)
		else
			html += FormatNumber(Scenerios[t].futureSalary)
		html += '</td>'
	}
	html += '</tr><tr><th scope="row" class="plaintablerowheaderborder" style="width:168px" nowrap>'+getSeaPhrase("SALARY_INCREASE","ESS")+'</th>'
	for (var t=0; t<len; t++) 
	{
		html += '<td class="plaintablecellborder">'
		if (Scenerios[t].Class == "H")
			html += FormatNumber(Scenerios[t].projectedIncrease) + '&nbsp;'
		else
			html += FormatNumber(Scenerios[t].projectedIncrease) + '%'
		html += '</td>'
	}
	html += '</tr><tr><th scope="row" class="plaintablerowheaderborder" style="width:168px" nowrap>'+getSeaPhrase("COMPOUND_INTEREST","ESS")+'</th>'
	for (var t=0; t<len; t++)
		html += '<td class="plaintablecellborder">'+Scenerios[t].Frequency.description+'&nbsp;</td>'
	html += '</tr><tr><th scope="row" class="plaintablerowheaderborder" style="padding-top:15px">'+getSeaPhrase("GRAPH_SCENARIO","ESS")+'</th>'
	for (var t=0; t<len; t++)
	{
		var toolTip = getSeaPhrase("DISPLAY_SCENARIO_GRAPH","ESS",[''+(t+1)]);
		html += '<td class="plaintablecellborder" style="padding-right:5px;padding-top:5px">'
		html += '<a href="javascript:;" onclick="parent.GraphScenario('+t+');return false;" aria-label="'+toolTip+'" title="'+toolTip+'">'
		html += '<img styler="bargraphicon" border="0" src="/lawson/xhrnet/images/graph.gif" alt="'+toolTip+'" title="'+toolTip+'"></a></td>'
	}
	html += '</tr><tr><th scope="row" class="plaintablecell">&nbsp;</th><td class="plaintablecell" nowrap>'
	if (len > 0)
		html += uiButton(getSeaPhrase("CLEAR","ESS"), "parent.ClearAllScenerios();return false;","margin-top:5px")
	html += '</td></tr></table>'
	self.RESULTS.document.getElementById("paneHeader").innerHTML = getSeaPhrase("RESULTS","ESS");
	self.RESULTS.document.getElementById("paneBody").innerHTML = html;
	self.RESULTS.stylePage();
	self.document.getElementById("RESULTS").style.visibility = "visible";
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.RESULTS.getWinTitle()]));
	fitToScreen();
}

function ClearAllScenerios()
{
	var nextFunc = function()
	{
		Scenerios = new Array();
		PaintResults();
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

/*
 *	Savings Modeling Java Applet Graph Logic
 */
var wstotcontrib = 0;
var wstotmatch = 0;

function GraphScenario(place)
{
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"));
	wstotcontrib = Scenerios[place].employeeContributionTotal;
	wstotmatch = Scenerios[place].companyContributionTotal;
	var number;
	values = "";
	values1 = "";
	values2 = "";
	values3 = "";
	labels = "";
	for (var i=0; i<total.length; i++) 
	{
		values += Math.round(Scenerios[place].total[i])+',';
		values1 += Math.round(Scenerios[place].inftotal[i])+',';
		if (wstotcontrib != 0)
			values2 += Math.round(Scenerios[place].contrib[i])+',';
		if (wstotmatch != 0)
			values3 += Math.round(Scenerios[place].match[i])+',';
		number = i+thisYear;
		labels += number+',';
	}
	var titleLbl = getSeaPhrase("PORTFOLIO_VALUE","ESS",[(place+1)]);
	accessibleTableBuffer = new Array();
	accessibleTableBuffer[0] = '<table border="1" summary="'+getSeaPhrase("TSUM_10","SEA",[(place+1)])+'"><caption>'+titleLbl+'</caption>'
	+ '<tr><th scope="col">'+getSeaPhrase("YEAR","ESS")+'</th>'
	+ '<th scope="col">'+getSeaPhrase("TOTAL","ESS")+'</th>'
	+ '<th scope="col">'+getSeaPhrase("INFLATION_ADJUSTED","ESS")+'</th>'
	+ '<th scope="col">'+getSeaPhrase("CONTRIBUTIONS","ESS")+'</th>'
	+ '<th scope="col">'+getSeaPhrase("COMPANY_MATCH","ESS")+'</th></tr>';
	var accLabels = (labels.substring(0,labels.length-1)).split(",");
	var accTotals = (values.substring(0,values.length-1)).split(",");
	var accInflation = (values1.substring(0,values1.length-1)).split(",");
	var accContributions = (values2.substring(0,values2.length-1)).split(",");
	var accCompMatch = (values3.substring(0,values3.length-1)).split(",");
	for (var n=0; n<accLabels.length; n++)
	{
		accessibleTableBuffer[n+1] = '<tr><th scope="row">'+accLabels[n]+'</th>'
		+ '<td style="text-align:right">'+accTotals[n]+'</td><td style="text-align:right">'+accInflation[n]+'</td>'
		+ '<td style="text-align:right">'+accContributions[n]+'</td><td>'+accCompMatch[n]+'</td></tr>';
	}
	accessibleTableBuffer[accessibleTableBuffer.length] = '</table>';
	page = '<br/><div style="margin-left:auto;margin-right:auto;text-align:center">'
	+ '<applet id="savingsApplet" codebase="/lawson/java" archive="jchart.jar" code="lawson.jchart.ChartApplet.class" width="700" height="380" alt="'+titleLbl+'" title="'+titleLbl+'">'
	+ '<param name="chartType" value="vbar,hbar,line"/>'
	+ '<param name="graphNames" value="tab0"/>'
	+ '<param name="tab0.chartTitle" value="'+titleLbl+'"/>'
	+ '<param name="3D" value="true"/>'
	+ '<param name="tab0.dataset0.name" value="'+getSeaPhrase("TOTAL","ESS")+'"/>'
	+ '<param name="tab0.dataset0.values" value="'+values.substring(0,values.length-1)+'"/>'
	+ '<param name="tab0.dataset0.globalValueColor" value="ffff99"/>'
	+ '<param name="tab0.dataset0.labels" value="'+labels.substring(0,labels.length-1)+'"/>'
	+ '<param name="tab0.dataset1.name" value="'+getSeaPhrase("INFLATION_ADJUSTED","ESS")+'"/>'
	+ '<param name="tab0.dataset1.values" value="'+values1.substring(0,values1.length-1)+'"/>'
	+ '<param name="tab0.dataset1.globalValueColor" value="33ffff"/>';
	if (wstotcontrib != 0)
	{
		page += '<param name="tab0.dataset2.name" value="'+getSeaPhrase("CONTRIBUTIONS","ESS")+'"/>'
		+ '<param name="tab0.dataset2.values" value="' + values2.substring(0,values2.length - 1)+'"/>'
		+ '<param name="tab0.dataset2.globalValueColor" value="66ccff"/>';
	}
	if (wstotmatch != 0)
	{
		page += '<param name="tab0.dataset3.name" value="'+getSeaPhrase("COMPANY_MATCH","ESS")+'"/>'
		+ '<param name="tab0.dataset3.values" value="' + values3.substring(0,values3.length - 1)+'"/>'
		+ '<param name="tab0.dataset3.globalValueColor" value="00cc99"/>';
	}
	titleLbl = getSeaPhrase("ACC_401K","ESS")+' '+getSeaPhrase("OPENS_WIN","SEA");
	page += '</applet><br/><a href="javascript:;" onclick="parent.openAccessibleAppletWindow();" title="'+titleLbl+'" aria-haspopup="true">'+getSeaPhrase("ACC_401K","ESS")+'<span class="offscreen"> - '+getSeaPhrase("OPENS_WIN","SEA")+'</span></a>'
	page += '</div><div class="textAlignRight">'
	page += uiButton(getSeaPhrase("BACK","ESS"), "parent.GoBackToMain();return false","margin-right:20px")
	page += '</div>';
	self.document.getElementById("MAIN").style.visibility = "hidden";
	self.document.getElementById("RESULTS").style.visibility = "hidden";
	self.GRAPH.document.getElementById("paneHeader").innerHTML = getSeaPhrase("GRAPH","ESS");
	self.GRAPH.document.getElementById("paneBody").innerHTML = page;
	try
	{
		var savingsApplet = self.GRAPH.document.getElementById("savingsApplet");
		savingsApplet.style.position = "relative";
		savingsApplet.style.top = "0px";
		savingsApplet.style.left = "0px";
	}
	catch(e) {}
	self.GRAPH.stylePage();
	self.GRAPH.document.getElementById("paneBody").style.visibility = "visible";	
	self.document.getElementById("GRAPH").style.visibility = "visible";
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.GRAPH.getWinTitle()]));
	fitToScreen();
}

function GoBackToMain()
{
	self.GRAPH.document.getElementById("paneBody").style.visibility = "hidden";
	self.document.getElementById("GRAPH").style.visibility = "hidden";
	self.document.getElementById("MAIN").style.visibility = "visible";
	self.document.getElementById("RESULTS").style.visibility = "visible";
}
 
 
