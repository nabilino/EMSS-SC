<!-- This HTML file contains the logic for the List window plus the first window which lists -->
<!-- all of the personnel actions for the manager -->

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<HTML>
<HEAD>
<TITLE>Personnel Actions</TITLE>
<META NAME="Generator" CONTENT="TextPad 3.0">
<META NAME="Author" CONTENT="?">
<META NAME="Keywords" CONTENT="?">
<META NAME="Description" CONTENT="?">
<META HTTP-EQUIV="Pragma" 	CONTENT="No-Cache">
<META HTTP-EQUIV="Expires" 	CONTENT="Mon, 01 Jan 1990 00:00:01 GMT">

<script type="text/javascript" src="/lawson/webappjs/data.js"></script>
<script type="text/javascript" src="/lawson/webappjs/transaction.js"></script>
<script type="text/javascript" src="/lawson/webappjs/common.js"></script>
<script type="text/javascript" src="/lawson/webappjs/commonHTTP.js"></script>
<script type="text/javascript" src="/lawson/webappjs/user.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/email.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/esscommon80.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/dr.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/empinfo.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/ProcessFlow.js"></script>
<script src="/lawson/webappjs/javascript/objects/Data.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/personnelactions/personnelactionsfiles/pactionslib.js"></script>


<SCRIPT SRC="/lawson/xhrnet/personnelactions/addresschange.js">		</SCRIPT> <!-- JRZ HR11 call -->
<!-- JRZ 12/01/09 Adding in St. Luke's pay period interface through stlukescycles.js -->
<script src="/lawson/xhrnet/stlukescycles.js"></script>

<SCRIPT>

var StopWatch 	= "/lawson/xhrnet/images/stopwtch.gif";
var empIndex 	= window.location.search.substring(1);
var supervisor  = '';

/*if(empIndex.length)
{
	DirectReports = opener.emps;

	for(var i=0;i<opener.emps.length; i++)
	{
		DirectReports[i].FullName = opener.emps[i].full_name;
		DirectReports[i].Code = opener.emps[i].employee;
	}
}
*/
var Highlight = "#7FFFD4"
var Background = "#FFFFFF"
var Dark = "#66CDAA"
var Shadow = "#458B74"
var Rules;

// JRZ global object to pass real address info to popup
var addressData = new Object();

function RulesObject(Description, ActionCode, WebAvail, WebAvailSuper, WebImmediate, WorkFlowFlag)
{
	this.Description = Description;
	this.ActionCode = ActionCode;
	this.WebAvail = WebAvail;
	this.WebAvailSuper = WebAvailSuper;
	this.WebImmediate = WebImmediate;
	this.WorkFlowFlag = WorkFlowFlag;
	this.EffectiveDate = null;
	this.Reason1 = null;
	this.Reason2 = null;
	this.ActionType = null;
	this.Company = null;
	this.Employee = null;
	this.FicaNbr = null;
	this.EmployeeName = null;
	this.UpdateBenefit = null;
	this.ReasonText = null;
	this.EmailAddress = null;
	this.DoEmail = 0;			// PT 105729
	this.AddressChange = false;	// PT 105729
	this.SuppAddrChange = false; // PT 105729
	this.SchoolDist = ""; // PT 105729
	this.OldState = ""; // PT 105729
	this.NewState = ""; // PT 105729
	this.EmpTaxFilter = 0; // PT 105729
	this.PrsEmpTaxAddr = 0; // PT 105729
	this.PrsTaxFilter = 0; // PT 105729
}

function DisplayActionList(Index)
{
	Rules = new Array()
	var pDMEObj 		= new DMEObject(authUser.prodline, "PERSACTYPE");
		pDMEObj.out 	= "JAVASCRIPT";
		pDMEObj.field 	= "action-code;description;web-available;web-avail-supv;web-immediate;workflow-flag"
		pDMEObj.key 	= parseInt(authUser.company,10)+"";
		pDMEObj.cond    = "Web-Available";
		pDMEObj.max		= "300";
    pDMEObj.select	= "action-code=WEBADDRESS";
		pDMEObj.debug = false
		pDMEObj.func 	= "PersactypeFinished("+Index+")";
	DME(pDMEObj,"jsreturn");
}

function PersactypeFinished(Index)
{
	for(var n=0;n<self.jsreturn.NbrRecs;n++)
	{
		var pObj = self.jsreturn.record[n];
		Rules[Rules.length] = new RulesObject(pObj.description, pObj.action_code, pObj.web_available, pObj.web_avail_supv, pObj.web_immediate, pObj.workflow_flag);
	}
	if(self.jsreturn.Next!='')
		window.open(self.jsreturn.Next,"jsreturn")
	else
		PaintPersonnelActions(Index)
}

function PaintPersonnelActions(Index)
{
var stlukescycles = new StLukesCycles();
	with(self.CONTROLITEM.document)
	{
		open()
		write('<p><body bgcolor='+Background+'><div align=center><br>')

		if(!Rules.length)
		{
			write('<font style="font-family:arial;font-size:14pt;font-weight:bold;font-style:italic;color:black;">')
			write('There are no Personnel Actions available</font>')
		}
		else
		{
    
      
      if(stlukescycles.isPersonnelClosedToday()) {
        write('<font style="font-size:12pt;font-family:arial;font-weight:bold;color:red;">');
        write('Address/Phone changes cannot occur on Monday through Wednesday during a week when payroll runs.  Please come back on Thursday.  Thank you for your patience.  If you need your address/phone changed for this Fridays paycheck, call HR: Boise/Meridian - 208-381-2470, WR - 208-727-8487, MV - 208-737-2135.</font>')
      }
      else {      
    
			  write('<font style="font-family:arial;font-size:14pt;font-weight:bold;color:black;">')
			  write('Online Address/Phone Change Form</font><br><br>')
			  write('<font style="font-family:arial;font-size:12pt;font-weight:bold;color:black;">')
			  write('Effective date of the change will be today</font><br><p>')
			  write('<font style="font-family:arial;font-size:10pt;font-weight:bold;color:black;">')
			  // PT 99910
			  // write('<form onSubmit="return false;" name=personalAction><div align=center><input type=text name=dateneeded value="" size=10 maxlength=10 onFocus=this.select() onChange="parent.ValidateDate(this);" onBlur=parent.ReturnProperDate(personalAction.dateneeded)>')
      
        // JRZ compute the date for the current day and insert into the field in format mm/dd/yyyy
        var todayDate = new Date();
        var todayMonth = todayDate.getMonth() + 1; if(todayMonth < 10) { todayMonth = "0" + todayMonth; }
        var todayDay = todayDate.getDate(); if(todayDay < 10) { todayDay = "0" + todayDay; }
        var todayYear = todayDate.getFullYear();
        var todayFormatDate = todayMonth + "/" + todayDay + "/" + todayYear;
			  write('<form onSubmit="return false;" name=personalAction><div align=center><input type=text name=dateneeded value="' + todayFormatDate + '" size=10 maxlength=10 onFocus=this.select() disabled>')
			  //write('&nbsp;<a href="" onClick="parent.DateSelect(\'dateneeded\');return false;" onMouseOver="window.status=\'Display Calendar\';return true" onMouseOut="window.status=\' \';return true">')
			  //write('<img border=0 src=/lawson/xhrnet/images/selarrow.gif></a>
        write('</div></form>')
      }
		}
		write('</div>');
		close()
	}

	with(self.ACTIONS.document)
	{
		open()
		write('<body bgcolor='+Background+'><div align=center>')
      if(!stlukescycles.isPersonnelClosedToday()) {
    write('<font style="font-family:arial;font-size:12pt;font-weight:bold;color:black;">')
    write('Click on the link below to change address or phone</font><br>');
		write('<br><table border=0><tr><td align=left>')

//		COMMENTING OUT FOR LOOP TO DISABLE CHANGE ADDRESS LINK AND REPLACING WITH INFORMATIONAL COMMENT
//		write('<font style="font-family:arial;font-size:12pt;font-weight:bold;color:red;">')
//		write('Online Address Changes are temporarily unavailable.  We are sorry for the inconvenience.<br>During this time, please contact your HR department.<ul><li>Boise/Meridian - 208-381-2470</li><li>WR - 208-727-8487</li><li>MV - 208-737-2135</li></ul></font>');
// MOD BY BILAL	-	uncommenting
		for(var n=0;n<Rules.length;n++)
		{
			write('<a href="" onClick="parent.Action('+Index+','+n+');return false;" onMouseOver="window.status=\' \';return true" onMouseOut="window.status=\' \';return true">')
			write(Rules[n].Description+'</a><br>')
		}
// END OF MOD
		write('</td></tr></table>')
       }
            // JRZ 12/15/09 adding link to instructions doc
            write('<p style="font-size:12pt"><b>Need Help or Have Questions?</b><br/><a href="/lawson/xhrnet/personnelactions/Online-Address-Guide.pdf" target="_new">Online Address/Phone Change Instructions</a></p>');

		close();
	}
	with(self.BUTTON.document)
	{
		open()
		write('<body bgcolor='+Background+'><div align=center>')

		if(opener)
			write('<form><input type=button value="Back" onClick=parent.Back()></form>')

		close();
	}

	self.BLANK1.document.open()
	self.BLANK1.document.write('<body bgcolor='+Background+'>')
	self.BLANK1.document.close()

	self.BLANK2.document.open()
	self.BLANK2.document.write('<body bgcolor='+Background+'>')
	self.BLANK2.document.close()
	
	// JRZ adding additional data call of HR11 address stuff
	GetWebuser();
  //removeWaitAlert()
}

function Action(DRINDEX, RULESINDEX)
{
	if(!self.CONTROLITEM.document.personalAction.dateneeded.value)
	{
		MsgBox("You must enter a date")
		self.CONTROLITEM.document.personalAction.dateneeded.focus()
		self.CONTROLITEM.document.personalAction.dateneeded.select();
		return;
	}

	// PT 99910
	var obj = self.CONTROLITEM.document.personalAction.dateneeded;
	if (!ValidateDate(obj)) {
		obj.focus();
		obj.select();
		return;
	} else
		// PT 107138
		// obj.value = FormatDte4(formjsDate(obj.value));
		// formhsDate() takes formatted date
		obj.value = FormatDte4(formjsDate(dateIsValid(obj.value)));

	Rules[RULESINDEX].EffectiveDate = self.CONTROLITEM.document.personalAction.dateneeded.value;
	window.open("/lawson/xhrnet/personnelactions/addresschange2.htm?"+DRINDEX+","+RULESINDEX, "ACTIONWINDOW", "width=750,height=640,toolbar=no");
}

/* PT 99910
function ReturnProperDate(obj)
{
	if(obj.value != "")
		obj.value=FormatDte4(formjsDate(obj.value))
}
*/

function ReturnDate(date)
{
	self.CONTROLITEM.document.personalAction.dateneeded.value = date
}

function Back()
{
	if(typeof(opener.PersonalActionWindow)!="undefined" && !opener.PersonalActionWindow.closed)
		opener.PersonalActionWindow.close()

	self.close()
}

function Call()
{
	clearTimeout(loadTimer);
//    showWaitAlert("Getting Current Address...")
	authenticate("frameNm='jsreturn'|funcNm='AuthenticateFinished()'|sysenv=true|officeObjects=true|desiredEdit='EM'")
}

function AuthenticateFinished()
{
	if(!empIndex.length) {
    empIndex = 0;
		DisplayActionList(empIndex)
  }
}

// PT 108365
function sortByName(obj1, obj2)
{
	var name1 = obj1.LastName + ' ' + obj1.FullName;
	var name2 = obj2.LastName + ' ' + obj2.FullName;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

loadTimer = setTimeout("Call()",3000)

</SCRIPT>
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-395426-5");
pageTracker._trackPageview();
} catch(err) {}</script>
</HEAD>

<!-- No Body tag included with this file -->

<FRAMESET rows="150,100%,50,*,*" frameborder=no border=0 onLoad="clearTimeout(loadTimer);Call()">
	<FRAME SRC="/lawson/xhrnet/dot.htm" name=CONTROLITEM scrolling=no>
	<FRAMESET cols="*,40%,*">
		<FRAME SRC="/lawson/xhrnet/dot.htm" name=BLANK1 scrolling=no>
		<FRAME SRC="/lawson/xhrnet/dot.htm" name=ACTIONS>
		<FRAME SRC="/lawson/xhrnet/dot.htm" name=BLANK2 scrolling=no>
	</FRAMESET>
	<FRAME SRC="/lawson/xhrnet/dot.htm" name=BUTTON scrolling=no>
	<FRAME SRC="/lawson/xhrnet/dot.htm" name=jsreturn scrolling=no>
	<FRAME SRC=/lawson/xhrnet/personnelactions/palawheader.htm name=lawheader scrolling=no>
</FRAMESET>

</HTML>
