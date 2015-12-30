<!--
// JRZ 11/05/08 Added custom plan names to accrual history, consolidated leave balances by custom plan name, 
//                           Developed method to filter accrual history by custom plan name.
// JRZ 11/03/08 Adding EMTATRANS accrual history
// JRZ 9/9/08 Fixing Lawson bug where if you have no (blank) eligible balance for a TA plan, you get NaN displayed
//JRZ 9/5/08 Adding a message that the Available Days column uses 8 hour days
// JRZ 8/26/08 Changing background color to fit with all the other HTML files
// JRZ 8/26/08 Adding a print and back button to time accrual page
// JRZ 1/7/09 Adding logic to not display accrual history during payroll
// CGL 10/10/11 Added link back to LP current balances page and removed total balance display of TA accounts
-->
<html>
<head>
<title>Leave Balances</title>
<meta name="viewport" content="width=device-width" />
<META HTTP-EQUIV="Pragma" CONTENT="No-Cache">
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/xhrnet/waitalert.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"></script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script src="/lawson/webappjs/javascript/objects/ActivityDialog.js"></script>
<script src="/lawson/webappjs/javascript/objects/OpaqueCover.js"></script>
<script src="/lawson/webappjs/javascript/objects/Dialog.js"></script>
<!-- MOD BY BILAL -->
<!-- JRZ 1/7/09 Adding in St. Luke's pay period interface through stlukescycles.js -->
<script src="/lawson/xhrnet/stlukescycles.js"></script>
<!-- END OF MOD -->
<script>
var loadTimer;
var EmployeeName;
var leaveBalances = new Array();
// MOD BY BILAL	-- Prior customizations 
// JRZ 11/03/08 Adding accrualHistory array to store query output from EMTATRANS
var accrualHistory = new Array();

// JRZ 11/05/08 a mapping of plan name to web description shown
var planLookup = new Array();
var ptoName = "PTO Paid Time Off";
planLookup["PTO EXMPT"] = ptoName;
planLookup["PTO DIR/EX"] = ptoName;
planLookup["PTO EX PT"] = ptoName;
planLookup["PTO EXMPT"] = ptoName;
planLookup["PTO NON"] = ptoName;
planLookup["PTO NON2"] = ptoName;
planLookup["PTO12"] = ptoName;
planLookup["PTO7N7"] = ptoName;
planLookup["PTODIR"] = ptoName;
planLookup["PTOEXEGRDF"] = ptoName;
planLookup["PTOEXEMPT"] = ptoName;
planLookup["PTOHRLY"] = ptoName;
var ptoNightName = "PTO Night - Paid Time Off Night";
planLookup["PTO NIGHT"] = ptoNightName;
planLookup["PTO NIGHT1"] = ptoNightName;
var eslName = "ESL Extended Sick Leave";
planLookup["ESL12"] = eslName;
planLookup["ESLDIR"] = eslName;
planLookup["ESLDOC"] = eslName;
planLookup["ESLEXEMPT"] = eslName;
planLookup["ESLGRNDFTH"] = eslName;
planLookup["ESLHIST"] = eslName;
planLookup["ESLHRLY"] = eslName;
planLookup["STD DIR/EX"] = eslName;
planLookup["STD EXEMPT"] = eslName;
planLookup["STD NON"] = eslName;
planLookup["STD HX"] = eslName;
//~JRZ

// JRZ 11/10/08 array containing accrual types to list because affect balances, other types don't
var eligibleTypes = ["U","TE","ME","X","LE"];
// types not eligible are A, TA, B, LA, MA
// END OF MOD
var authUser;
var Employee;
var sortProperty;
var sortByNumber = false;

function CallBack()
{
	// Adjust the frame height for Netscape
	setLayerSizes();
	stylePage();
	if(opener)
	{
		authUser = opener.authUser;
		showWaitAlert(getSeaPhrase("WAIT","ESS"));
		document.title = getSeaPhrase("LEAVE_BALANCES","ESS");
		setTaskHeader("header", getSeaPhrase("TIME_ENTRY","TE"), "TimeEntry");

		if(typeof(opener.Employee)!="undefined")
		{
			EmployeeName = opener.Employee.EmployeeName;
			Employee = opener.Employee.EmployeeNbr;
			GetEmtamastr();
		}
		else
		{
			Employee = authUser.employee;
			GetEmployee();
		}
	}
	else {
		authenticate("frameNm='jsreturn'|funcNm='user=authUser;GetEmployee(true)'|desiredEdit='EM'")
	}
}

function GetEmployee(setHeader)
{
	if (setHeader) {
		showWaitAlert(getSeaPhrase("WAIT","ESS"));
		document.title = getSeaPhrase("LEAVE_BALANCES","ESS");
		setTaskHeader("header",getSeaPhrase("LEAVE_BALANCES","ESS"),"TimeEntry");
	}
	StoreDateRoutines();

	var obj 		= new DMEObject(authUser.prodline, "employee")
		obj.out 	= "JAVASCRIPT";
		obj.field 	= "first-name;last-name;middle-name;label-name-1";
		obj.key 	= parseFloat(authUser.company) +"="+ parseFloat(authUser.employee);
		obj.max 	= "1";
	DME(obj,"jsreturn");
}

function DspEmployee()
{
	EmployeeName = self.jsreturn.record[0].label_name_1;
	Employee = authUser.employee;
	GetEmtamastr();
}

function GetEmtamastr()
{
	sub_emp_name = ""
	leaveBalances = new Array();

	var obj = new DMEObject(authUser.prodline, "emtamastr");
		obj.out 	= "JAVASCRIPT";
		obj.index 	= "etmset1";
// MOD BY BILAL - Prior customizations
// JRZ 11/04/08 adding plan name field to emtamastr query
//		obj.field 	= "plan.description;elig-balance;pl-end-date;run-date";
		obj.field 	= "plan.description;elig-balance;pl-end-date;run-date;plan-name";
// END OF MOD
		obj.key 	= authUser.company+"="+Employee;
		obj.debug 	= false;
		obj.max		= "600";
  	DME(obj,"jsreturn")
}

// MOD BY BILAL - Prior customization
/*
 * Function: GetEmtatrans
 * Purpose: Query EMTATRANS table for the employee for all accruals from January 1st of last year
 *                 and sorted by date descending.
 * Arguments:
 *   none
 * Returns:
 *   none
 */
// JRZ 11/03/08 Function GetEmtatrans added to query EMTATRANS to get accrual history
function GetEmtatrans()
{
	sub_emp_name = ""
	accrualHistory = new Array();
  // set the date to go back and retrieve accruals from
  var todayDate = new Date();
  var lastYear = todayDate.getFullYear() - 1;
  var historyDate = lastYear+"0101"; // Jan 1st of last year

	var obj = new DMEObject(authUser.prodline, "emtatrans");
		obj.out 	= "JAVASCRIPT";
		obj.index 	= "ettset1";
		obj.field 	= "plan.description;plan-name;date;seq-nbr;ta-hours;type;description";
		obj.key 	= authUser.company+"="+Employee;
		obj.debug 	= false;
    obj.sortdesc 	= "date";
    obj.select	= "date>=" + historyDate;
		obj.max		= "600";
  	DME(obj,"jsreturn")
}
//~JRZ
// END OF MOD
function DspEmtamastr()
{
	leaveBalances = leaveBalances.concat(self.jsreturn.record);

	if (self.jsreturn.Next != "")
	{
		self.jsreturn.location.replace(self.jsreturn.Next);
	}
	else
	{
		MakeForm();
	}
}

// MOD BY BILAL  - Prior Customization
/*
 * Function: DspEmtatrans
 * Purpose: To be called after EMTATRANS DME call complete to fire off MakeAccrualHistory
 *                 which processes the data and generates the HTML to display
 * Arguments:
 *   none
 * Returns:
 *   none
 */
// JRZ 11/03/08 Adding DspEmtatrans function to display accrual history
function DspEmtatrans()
{
	if(!accrualHistory.length && !self.jsreturn.NbrRecs)
	{
		alert("There are no accrual history available");
		return;
	}
	else
	{
		accrualHistory = accrualHistory.concat(self.jsreturn.record);
		if(self.jsreturn.Next != "")
		{
			self.jsreturn.location.replace(self.jsreturn.Next);
		}
		else
		{
      // JRZ 1/7/09 Adding logic to not display time accrual history while payroll is running
      var stlukescycles = new StLukesCycles();
      if(stlukescycles.isPayrollRunningToday()) {
        ClosedAccrualHistory();
      }
      else {
        MakeAccrualHistory();
      }
      //~JRZ
		}
	}
}
var newLeaveBalances = new Array();
//~JRZ
// END OF MOD
function MakeForm(onsort, property)
{
// MOD BY BILAL	-	Prior mods
	var leaveBalancesHtml = '<table id="balanceTbl" styler="list" class="plaintableborder" cellspacing="0" cellpadding="0" width="100%"'
	+ ' summary="'+getSeaPhrase("LEAVE_BALANCES_SUMMARY","ESS")+'"><tr><th></th><th></th><th></th><th></th></tr>'
//	+ '<tr><th scope="col" class="plaintableheaderborder" style="width:38%;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
//	+ '<a class="columnsort" href="javascript:void(0);" onclick="parent.SortEmtamastr(\'plan_description\');return false"'
//	+ ' onmouseover="window.status=\''+getSeaPhrase("SORT_PLAN_NAME","ESS").replace(/\'/g,"\\'")+'\';return true"'
//	+ ' onmouseout="window.status=\' \';return true">'
//	+ getSeaPhrase("PLAN_NAME","ESS")
//	+ '</a>'
//	+ '</th>'
//	+ '<th scope="col" class="plaintableheaderborder" style="width:17%;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
//	+ '<a class="columnsort" href="javascript:void(0);" onclick="parent.SortEmtamastr(\'run_date\');return false"'
//	+ ' onmouseover="window.status=\''+getSeaPhrase("SORT_RUN_DATE","ESS").replace(/\'/g,"\\'")+'\';return true"'
//	+ ' onmouseout="window.status=\' \';return true">'
//	+ getSeaPhrase("AS_OF_DATE","ESS")
//	+ '</a>'
//	+ '</th>'
//	+ '<th scope="col" class="plaintableheaderborder" style="width:23%;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
//	+ '<a class="columnsort" href="javascript:void(0);" onclick="parent.SortEmtamastr(\'elig_balance\');return false"'
//	+ ' onmouseover="window.status=\''+getSeaPhrase("SORT_AVAILABLE_HOURS","ESS").replace(/\'/g,"\\'")+'\';return true"'
//	+ ' onmouseout="window.status=\' \';return true">'
//	+ getSeaPhrase("AVAILABLE_HOURS","ESS")
//	+ '</a>'
//	+ '</th>'
//	+ '<th scope="col" class="plaintableheaderborder" style="width:22%;text-align:center" styler_click="StylerEMSS.onClickColumn" styler_init="StylerEMSS.initListColumn">'
//	+ '<a class="columnsort" href="javascript:void(0);" onclick="parent.SortEmtamastr(\'avail_days\');return false"'
//	+ ' onmouseover="window.status=\''+getSeaPhrase("SORT_AVAILABLE_DAYS","ESS").replace(/\'/g,"\\'")+'\';return true"'
//	+ ' onmouseout="window.status=\' \';return true">'
//	+ getSeaPhrase("AVAILABLE_DAYS","ESS")
//	+ '</a>'
//	+ '</th>'
//	+ '</tr>'

	var tableHtml = "";

	for (var i=0; i<leaveBalances.length; i++)
	{
		var sysdate	= parseFloat(ymdtoday);
		var enddate = parseFloat(formjsDate(formatDME(leaveBalances[i].pl_end_date)));

		if (enddate > sysdate || isNaN(enddate))
		{
// MOD BY BILAL - prior customization
        // JRZ 9/9/08 Fixing Lawson bug where if you have no (blank) eligible balance for a TA plan, you get NaN displayed
		if(leaveBalances[i].elig_balance != '')
			{leaveBalances[i].elig_balance = EvaluateBCD(leaveBalances[i].elig_balance);	}
			else {	leaveBalances[i].elig_balance = 0; }
		// ~JRZ
// END OF MOD
			leaveBalances[i].avail_days = leaveBalances[i].elig_balance/8;
// MOD BY BILAL - Prior customization
        // JRZ 11/04/08 map plan name to our customized plan description
        if(planLookup[leaveBalances[i].plan_name]  !== undefined) {
          leaveBalances[i].custom_plan_name = planLookup[leaveBalances[i].plan_name];
        }
        else {
          leaveBalances[i].custom_plan_name = leaveBalances[i].plan_description;
        }
// END OF MOD
// MOD BY BILAL

//			tableHtml += '<tr>'
//			+ '<td class="plaintablecellborder" style="text-align:left">' + leaveBalances[i].plan_description + '</td>'
//			+ '<td class="plaintablecellborder" style="text-align:center">' + ((leaveBalances[i].run_date)?formatDME(leaveBalances[i].run_date):'&nbsp;') + '</td>'
//			+ '<td class="plaintablecellborder" style="text-align:center">' + ((NonSpace(roundToDecimal(leaveBalances[i].elig_balance,2))>0)?roundToDecimal(leaveBalances[i].elig_balance,2):'&nbsp;') + '</td>'
//			+ '<td class="plaintablecellborder" style="text-align:center">' + ((NonSpace(roundToDecimal(leaveBalances[i].avail_days,2))>0)?roundToDecimal(leaveBalances[i].avail_days,2):'&nbsp;') + '</td></tr>'
// END OF MOD
		}
	}
// MOD BY BILAL 
    refreshLeaveBalances();
    //JRZ 9/5/08 Adding a message that the Available Days column uses 8 hour days
    tableHtml += '<tr><td colspan="4" class="plaintablecellborder" style="text-align:center"><b>This page displays only accrual history prior to October 9, 2011.<br>Click <a href="/lawson/xhrnet/emtamastrlp.htm" target="_parent"><b>here</b></a> to view your current PTO/ESL history and balances.</b><p></td></tr>'
    //~JRZ
// END OF MOD

	leaveBalancesHtml += tableHtml + '</table>';
// MOD BY BILAL  - prior customization
    // JRZ 8/26/08 Adding a print and back button to time accrual page
//    leaveBalancesHtml += '<div><center><input type=\"button\" onclick=\"javascript:history.go(-3)\" name=\"backToPaystub\" value=\"Back\"/>&nbsp;<input type=\"button\" onclick=\"print()\" name=\"printTA\" value=\"Print\"/></center></div>'
    leaveBalancesHtml += '<div><center><input type=\"button\" onclick=\"print()\" name=\"printTA\" value=\"Print\"/></center></div>'
    //~JRZ
// END OF MOD
// MOD BY BILAL
//	if (opener)
//	{
//		//document.getElementById("MAIN").style.top = "5px";
//		leaveBalancesHtml += '<form>'
//		+ '<table cellspacing="0" cellpadding="0" width="100%">'
//		+ '<tr><td class="plaintablecell">'
//		+ uiButton(getSeaPhrase("QUIT","ESS"),"parent.DoneClicked();return false")
//		+ '</td></tr>'
//		+ '</table>'
//		+ '</form>'
//	}
// END OF MOD
	try {
		self.MAIN.document.getElementById("paneHeader").innerHTML = getSeaPhrase("BALANCES","ESS");

		if (leaveBalances.length > 0) {
			self.MAIN.document.getElementById("paneBody").innerHTML = leaveBalancesHtml;
		}
		else {
			self.MAIN.document.getElementById("paneBody").innerHTML = '<div class="fieldlabelbold" style="text-align:left;padding-top:5px;padding-left:5px">'
			+ getSeaPhrase("NO_LEAVE_BALANCE","ESS")
			+ '</div>'
		}
	}
	catch(e) {}

// MOD BY BILAL
	if (!onsort) {
//		self.MAIN.stylePage();
//		self.MAIN.setLayerSizes(true);
//		document.getElementById("MAIN").style.visibility = "visible";
	} else {
//		self.MAIN.stylePage();
		self.MAIN.styleSortArrow("balanceTbl", property);
	}
// END OF MOD
	removeWaitAlert();
// MOD BY BILAL - Prior Customization
  // JRZ 11/03/08 Added call to GetEmtatrans() function to get accruals
  GetEmtatrans();
  //~JRZ      
// END OF MOD
}
// MOD BY BILAL - Prior Customization
/*
 * Function: refreshLeaveBalances
 * Purpose: To consolidate leave balances by the custom plan name, so that balances in multiple plans
 *                 won't show up as two separate leave balances.  Just populates newLeaveBalances array.
 * Arguments:
 *   none
 * Returns:
 *   none
 */
// JRZ refreshLeaveBalances() takes accrual plans with the same names and sums up the hours, storing in the newLeaveBalances array
function refreshLeaveBalances() {
  newLeaveBalances = new Array();
		for (var i=0;i<leaveBalances.length;i++)
		{
			var sysdate	= parseFloat(ymdtoday)
			var enddate = parseFloat(formjsDate(formatDME(leaveBalances[i].pl_end_date)))

			if (enddate > sysdate || isNaN(enddate))
			{
        // JRZ use the adjusted plan name to consolidate balances of like named plans together
        var newPlanMatch = 0;
        for(var n=0;n<newLeaveBalances.length && !newPlanMatch;n++) {
          if(leaveBalances[i].custom_plan_name == newLeaveBalances[n].custom_plan_name) {
            newLeaveBalances[n].elig_balance += leaveBalances[i].elig_balance;
            newPlanMatch = 1;
          }
        }
        if(!newPlanMatch) {
          // need to copy leaveBalances to avoid just modifying a pointer
          var copyBalance = new Array();
          copyBalance.elig_balance = leaveBalances[i].elig_balance;
          copyBalance.custom_plan_name = leaveBalances[i].custom_plan_name;
          copyBalance.run_date = leaveBalances[i].run_date;
          copyBalance.plan_name = leaveBalances[i].plan_name;
          copyBalance.plan_description = leaveBalances[i].plan_description;
          copyBalance.avail_days = leaveBalances[i].avail_days;

          newLeaveBalances.push(copyBalance);
        }
		}
		}
}

/*
 * Function: MakeAccrualHistory
 * Purpose: To be called after EMTATRANS query has been completed to display its results
 * Arguments:
 *   none
 * Returns:
 *   none
 */
// JRZ 11/03/08 Adding MakeAccrualHistory function to display HTML for accrual history block
function MakeAccrualHistory()
{
    var accrualHistoryHtml ='<p>&nbsp;</p>'
		+'<div align=center>'
		+'<font style="font-family:arial;font-size:12pt;font-weight:bold;">'
		+'Accrual History for '+EmployeeName+'<p>'

    // entering filter box for selecting only the plan you want to see
    accrualHistoryHtml +='<select id="accrualSelect">'
    var myAccrualPlans = GetAccrualPlans();
    for(var a=0;a<myAccrualPlans.length;a++) {
      accrualHistoryHtml +='<option value=test'+a+'>'+myAccrualPlans[a]+'</option>';
    }
    accrualHistoryHtml += '</select>'
	accrualHistoryHtml += uiButton("Show only this Plan","parent.CreateAccrualTableDynamic();return false")
    
    	accrualHistoryHtml += '<div id="accrualTable">'
    	accrualHistoryHtml += CreateAccrualTable("")
    	accrualHistoryHtml += '</div></td></tr></table></table></div>'
    
    	accrualHistoryHtml += '<div><center>' + uiButton("Back","history.go(-3);return false;") + '&nbsp;' + uiButton("Print", "print();return false;") + '</center></div>'
    

	if (opener)
	{
		//document.getElementById("MAIN").style.top = "5px";
		accrualHistoryHtml += '<form>'
		+ '<table cellspacing="0" cellpadding="0" width="100%">'
		+ '<tr><td class="plaintablecell">'
		+ uiButton(getSeaPhrase("QUIT","ESS"),"parent.DoneClicked();return false")
		+ '</td></tr>'
		+ '</table>'
		+ '</form>'
	}
// Appending the data.
		self.MAIN.document.getElementById("paneBody").innerHTML += accrualHistoryHtml;
		self.MAIN.stylePage();
		self.MAIN.setLayerSizes(true);
		document.getElementById("MAIN").style.visibility = "visible";

}
//~JRZ

/*
 * Function: ClosedAccrualHistory
 * Purpose: To be called while payroll is running to avoid showing accrual history
 * Arguments:
 *   none
 * Returns:
 *   none
 */
// JRZ 1/07/09 Adding ClosedAccrualHistory function to display HTML during payroll
function ClosedAccrualHistory()
{
var htmlStr = '<p>&nbsp;</p>'
    + '<div align=center><table border=1 cellspacing=2 cellpadding=2>'
    + '<tr><td width=100% height=100% align=center valign=center>'
    + '<font style="font-size:14pt;font-family:arial;font-weight:bold;color:red;">'
    + 'Accrual history information cannot be viewed while payroll is running (Tuesday through Thursday).  Please check back on Friday.  Thank you for your patience.</font></td></tr></table></div>'
    
//    +'<div><center><input type=\"button\" onclick=\"javascript:history.go(-3)\" name=\"backToPaystub\" value=\"Back\"/>&nbsp;<input type=\"button\" onclick=\"print()\" name=\"printTA\" value=\"Print\"/></center></div>'
    

		if(opener)
		{
		htmlStr += '<div align=center>'
			+ '<a href="javascript:void(0);" onClick="parent.DoneClicked();" >'
//			+ 'onMouseOver="parent.BUTTONS.document.quit.src=\'/lawson/xhrnet/timeentry/Skins/Desert/images/quitover.gif\';return true;" '
//			+ 'onMouseOut="parent.BUTTONS.document.quit.src=\'/lawson/xhrnet/timeentry/Skins/Desert/images/quit.gif\';return true;">'
			+ '<img src="/lawson/xhrnet/timeentry/Skins/Desert/images/quit.gif" border=0 name=quit alt="Close Leave Balances"></a>'
			+ '</div>'
		}
 	  self.MAIN.document.getElementById("paneBody").innerHTML += htmlStr
      self.MAIN.stylePage();
      self.MAIN.setLayerSizes(true);
      document.getElementById("MAIN").style.visibility = "visible";

}

//~JRZ
/*
 * Function: CreateAccrualTableDynamic
 * Purpose: To be called from a button press to filter the accruals by the selected custom plan name
 *                 in the accrualSelect select element and fill the accrualTable element with the resulting HTML
 * Arguments:
 *   none
 * Returns:
 *   none
 */
// JRZ 11/05/2008 created CreateAccrualTableDynamic function
function CreateAccrualTableDynamic() {
  with (self.MAIN.document) {
    var planSelectedIndex = getElementById("accrualSelect").selectedIndex;
    var planName = getElementById("accrualSelect").options[planSelectedIndex].text;
    getElementById('accrualTable').innerHTML = CreateAccrualTable(planName);
  }
}

/*
 * Function: GetAccrualPlans
 * Purpose: To return an array containing all of the possible custom plan names that there are accruals for
 * Arguments:
 *   none
 * Returns:
 *   an array containing custom plan names
 */
// JRZ 11/05/2008 created GetAccrualPlans function
function GetAccrualPlans() {
  var uniqueAccrualPlans = new Array();
		for (var i=0,j=0;i<accrualHistory.length;i++)
		{
      // JRZ 11/04/08 map plan name to our customized plan description
      if(planLookup[accrualHistory[i].plan_name] !== undefined) {
        accrualHistory[i].custom_plan_name = planLookup[accrualHistory[i].plan_name];
      }
      else {
        accrualHistory[i].custom_plan_name = accrualHistory[i].plan_description;
      }
      
      // JRZ if plan name is unique, list it out
      var matchPlan = 0;
      for(var j=0;j<uniqueAccrualPlans.length;j++) {
        if(uniqueAccrualPlans[j] == accrualHistory[i].custom_plan_name) {
          matchPlan = 1;
        }
      }
      if(!matchPlan) {
        uniqueAccrualPlans.push(accrualHistory[i].custom_plan_name);
      }
    }
    return uniqueAccrualPlans;
}

/*
 * Function: CreateAccrualTable
 * Purpose: To return HTML table containing all or a subset of accruals.
 * Arguments:
 *   matchPlan = contains text of the custom plan name to display plans for.  If blank, means to display all plans.
 * Returns:
 *   HTML table holding all of the accruals for the matchPlan argument passed in.
 */
 // JRZ 11/05/2008 created CreateAccrualTable function
function CreateAccrualTable(matchPlan) {
		var arg = ''
    // reset the leave balances to their original state
    refreshLeaveBalances();
    
    // set up the top row in the table
		arg += '<table id="HistoryTbl" styler="list" class="plaintableborder" cellspacing="0" cellpadding="0" width="100%">'
		+ '<tr>'
		+ '<th scope="col" class="plaintableheaderborder" style="width:38%;text-align:center">' + getSeaPhrase("PLAN_NAME","ESS") + '</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="width:17%;text-align:center" >Date</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="width:23%;text-align:center">Accrued Hours</th>'
		+ '<th scope="col" class="plaintableheaderborder" style="width:22%;text-align:center">Balance</th>'
		+ '</tr>'
    
		for (var i=0,j=0;i<accrualHistory.length;i++)
		{
			var sysdate	= parseFloat(ymdtoday)
			var enddate = parseFloat(formjsDate(formatDME(accrualHistory[i].date)))

			if (enddate <= sysdate)
			{
      
        // JRZ check the accrual type to see if it affects balance, skip if it doesn't
        var skipType = 1;
        for(var e=0;e<eligibleTypes.length;e++) {
          if(accrualHistory[i].type == eligibleTypes[e]) {
            skipType = 0;
            break;
          }
        }
        if(skipType) {
          continue;
        }
        
        // JRZ 9/9/08 Fixing Lawson bug where if you have no (blank) eligible balance for a TA plan, you get NaN displayed
        if(accrualHistory[i].ta_hours != '') {
				  accrualHistory[i].ta_hours = EvaluateBCD(accrualHistory[i].ta_hours);
        }
        else {
          accrualHistory[i].ta_hours = 0;
        }
        
        // in the type field, a U is usage, so display a negative sign for usage
        var negativeSign = "";
        if(accrualHistory[i].type == 'U') {
          negativeSign = "-";
        }
        
        // map plan name to our customized plan description
        if(planLookup[accrualHistory[i].plan_name] !== undefined) {
          accrualHistory[i].custom_plan_name = planLookup[accrualHistory[i].plan_name];
        }
        else {
          accrualHistory[i].custom_plan_name = accrualHistory[i].plan_description;
        }
        
        // calculate the accrual balances
        
        // find the current balance for the current plan name
        var matchedBalance = 0;
        for(var b=0;b<newLeaveBalances.length && !matchedBalance;b++) {
          if(accrualHistory[i].custom_plan_name == newLeaveBalances[b].custom_plan_name) {
            var aRate = (negativeSign != ""?-1*accrualHistory[i].ta_hours:accrualHistory[i].ta_hours);
		accrualHistory[i].balance = newLeaveBalances[b].elig_balance;
            newLeaveBalances[b].elig_balance -= aRate;
            matchedBalance = 1;
          }
        }
        
        // matchedBalance = 0 catches the case where there is an accrual for a balance that doesn't exist, likely in the case of a stopped plan
        
        // see if plan has been selected to be displayed
        if(matchedBalance && (matchPlan == "" || accrualHistory[i].custom_plan_name == matchPlan)) {
        
        // JRZ 6/8/09 converting balance to a number to properly handle negative balances
        var balanceNumber = new Number(accrualHistory[i].balance);
        
				arg += '<tr>'
					+ '<td class="plaintablecellborder" style="text-align:center">'  +accrualHistory[i].custom_plan_name+ '&nbsp;</td>'
					+ '<td class="plaintablecellborder" style="text-align:center">' +formatDME(accrualHistory[i].date)+ '&nbsp;</td>'
					+ '<td class="plaintablecellborder" style="text-align:center">' + (negativeSign!=""?-1*accrualHistory[i].ta_hours:accrualHistory[i].ta_hours) +'&nbsp;</td>'
          				+ '<td class="plaintablecellborder" style="text-align:center">' + balanceNumber.toFixed(3) +'&nbsp;</td></tr>'
        j++
        }
				
			}
		}
    arg += '</table>';
    return arg;
}
// END OF MOD
function DoneClicked()
{
	self.close();
	if (typeof(parent) != "undefined")
		parent.focus();
	else
		opener.focus();
}

function sortByProperty(obj1, obj2)
{
	var name1 = obj1[sortProperty];
	var name2 = obj2[sortProperty];
	if (sortProperty == "run_date")
	{
		name1 = formjsDate(formatDME(name1));
		name2 = formjsDate(formatDME(name2));
	}
	if (sortByNumber)
	{
		name1 = Number(name1);
		name2 = Number(name2);
	}
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function SortEmtamastr(property)
{
   	sortByNumber = (property == "elig_balance" || property == "avail_days") ? true : false;
	sortProperty = property;
	leaveBalances.sort(sortByProperty);
	MakeForm(true, property);
}
</script>
<!-- MOD BY BILAL -->
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
<body onload="CallBack()">
	<iframe id="header" name="header" style="visibility:hidden;position:absolute;height:32px;width:803px;left:0px;top:0px" src="/lawson/xhrnet/ui/header.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="MAIN" name="MAIN" style="visibility:hidden;position:absolute;height:464px;width:575px;left:0px;top:32px" src="/lawson/xhrnet/ui/headerpane.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="auto"></iframe>
	<iframe id="jsreturn" name="jsreturn" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/dot.htm" marginwidth="0" marginheight="0" scrolling="no"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@(201111) 09.00.01.06.00 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/emtamastr.htm,v 1.22.2.16 2011/05/04 21:10:11 brentd Exp $ -->
