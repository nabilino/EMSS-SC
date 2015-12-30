// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/directdeposit/jslib/Attic/directdepositlib.js,v 1.1.2.26 2011/07/01 21:27:01 brentd Exp $

//
//****************************************************************************************//
//				General Direct Deposit Functions
//****************************************************************************************//
//
// Global images, stylesheets, and variables.
var ScrWidth 			= screen.availWidth
var ScrHeight 			= screen.availHeight
var Spacer 			= "/lawson/xhrnet/images/spacer.gif"
var waitAlertWind

var ShowOtherCtryAccts = false
var DONE = false
var Employee = new Object()		// Employee recordset
var BankAccount = new Object()		// Stores prenotification flag for tips window text
var Rules = new Object()		// System rules for direct deposit
var PrSystem = new Object()		// PR System properties for direct deposit
var FormValues = new Object()		// Save the current form's values
var OldDefault = new Object()		// The user's old default account
var NewDefault = new Object()		// The user's new default account
var OldDefaultCopy = new Object()   	// Save the original old default to restore on a cancel
var NewDefaultCopy = new Object()   	// Save the most recent new default to restore on a cancel
var FormValuesCopy = new Object()	// Save the most recent old default to restore on a cancel
var Accounts = new AccountObj()		// Direct deposit account recordset; all accounts for employee
var AchOrderNbrFree = new Array()	// Maintains a record of order numbers not used by employee's accounts
var AchDistNbrFree = new Array()	// Maintains a record of dist numbers not used by employee's accounts
var OpenAccounts = new Array()		// Current accounts with empty end dates
var ClosedAccounts = new Array()	// Current accounts with non-empty end dates
var UpdateQueue	= new Array()		// Array of accounts that need updating, in the correct order
var DefaultQueue = new Array()		// Array of closed accounts that need to be cleared on the server
var MailQueue = new Array()		// Array of before and after account info for sending mail after a change
var AUTHORIZED = false			// True if the user has passed the authorization screen
var CLEARFLAG = false			// True if direct deposit flag needs to be cleared (to "No") on HR11
var SETFLAG = false			// True if direct deposit flag needs to be set (to "Yes") on HR11
var FIRSTTIME = true			// True if user just loaded accounts for the first time
var PROCESSDEFCHG = false		// Flag to ensure accounts get processed in the correct order to PR12
var ADDNEWDEFAULT = false		// True if user is adding/setting a new default account and didn't have one before
var CLEARDEFAULTS = false		// True if there exists at least one closed account with the default flag set
var SETORDER = false			// True if user has re-ordered his/her accounts
var HAVEBANKS = false			// True if user has added at least one new account; only do DME for bank desc once
var MAXACCOUNTS = 99			// Maximum number of accounts allowed by PR12
var maxDistPtr = 0			// Index of highest used distribution number
var maxOrderPtr = 0			// Index of highest used order number
var freeOrderPtr = 1			// Index of next available free order number
var defaultAcctPtr = -1			// Distribution number of original default account
var MailEvent = ""			// Current update event for use in sending email afterward
var warnTimer = null			// Time the lifespan of warning windows
var alertTimer = null			// Time the lifespan of alert windows
var prodline
var company
var employee
var SSLLoc = ((document.getElementById && !document.all) || document.layers) ? "javascript:''" : "/lawson/xhrnet/dot.htm";
var tips_action = ""
// OLD LOGIC
var WaitAlertStyle = "background-color:white;color:black;font-weight:bold"
var pfServiceObj;
var sortProperty;
var manualBankEntry = parent.emssObjInstance.emssObj.manualBankEntry;

// The main account object.  There should only be one used, since there is only one defined per employee.
// This object holds a list of country codes for which accounts exist, and a hash array object for each
// country code found.
function AccountObj()
{
	this.Countries = new Array()  // list of country codes used by all direct deposit accounts on record
	this.Hash = new Array()	      // list of accounts indexed by country code; each is an AccountsHash object
	this.sysAvailable = 0	      // total accounts available to add for the system, independent of country
	this.totalOpen = 0	      // total number of active accounts for the system, across all countries
	this.totalClose = 0	      // total number of inactive accounts for the system, across all countries
	this.sysLimit = MAXACCOUNTS   // the maximum allowable number of accounts the system will hold
}

// This object contains comprehensive data about the accounts for a particular country code.
// Each AccountsHash object holds a list of open and closed accounts, and the default account.
function AccountsHash(country)
{
	this.country = country		  // the country code for this country-specific record
	this.Recs = new Array()		  // the list of all accounts for this country
	this.DefaultAccount = new Array() // the default account(s) for this country
	this.OpenAccounts = new Array()	  // the list of active accounts for this country
	this.ClosedAccounts = new Array() // the list of inactive accounts for this country
	this.DefaultQueue = new Array()   // a list of any inactive defaults for this country that may cause PR12.1 edits
	this.defaultAcctPtr = -1	  // the unique ACH-DIST-NBR belonging to the default account
	this.openCount = 0		  // a count of the total number of active accounts for this country
	this.closeCount = 0		  // a count of the total number of inactive accounts for this country
	this.totalPercent = 0		  // the total percentage used by active accounts for this country
	this.compAvailable = 0		  // the number of accounts available to add based off the rules (HS06.1)
	this.acctAvailable = 0		  // the number of accounts available to add based off rules and system limit
	this.addBackPercent = 0;	  // the percentage to add back to the total when changing an account
}

function OpenHelpDialog(name)
{
	if (name == "list") 
	{
		var thisCtry = Accounts.Hash[Employee.work_country];
		var tips_partial = (Rules.partial_ach=="Y")?true:false
		var tips_full = !tips_partial
		var tips_count = thisCtry.openCount
		var tips_prenote = (BankAccount.prenote_option=="Y")?true:false
		var tips_default = true
		var tips_view = "list"
		if (tips_action.indexOf("Default") != -1)
			tips_view = "selectdefault"
		else if (tips_action.indexOf("ReOrder") != -1)
			tips_view = "reorder"
		
		var tipsparms = "full="+tips_full+"&partial="+tips_partial+"&view="+tips_view+"&count="+tips_count+"&prenote="+tips_prenote
		+ "&default="+tips_default+"&accounts="+Rules.company_accts+"&country="+Employee.work_country;
		openHelpDialogWindow("/lawson/xhrnet/directdeposit/ddhelp.htm?"+tipsparms);
	}
	else if (name == "detail" && Employee.detailWindow == "auth")
	{
		var tips_partial = (Rules.partial_ach=="Y")?true:false
		var tips_full = !tips_partial
		var tips_count = Employee.open_count
		var tips_prenote = (BankAccount.prenote_option=="Y")?true:false
		var tips_default = (Accounts[Employee.authIndex] && Accounts[Employee.authIndex].default_flag=="Y")?true:false	
		
		var tipsparms = "full=false&partial=false&view=list&count="+tips_count+"&prenote="+tips_prenote
		+ "&default="+tips_default+"&accounts="+Rules.company_accts+"&country="+Employee.work_country;
		openHelpDialogWindow("/lawson/xhrnet/directdeposit/ddhelp.htm?"+tipsparms);
	}
	else if (name == "detail" && Employee.detailWindow == "query")
	{
		var tips_partial = (Rules.partial_ach=="Y")?true:false
		var tips_full = !tips_partial
		var tips_count = Employee.open_count
		var tips_prenote = (BankAccount.prenote_option=="Y")?true:false
		var tips_default = true

		var tipsparms = "full="+tips_full+"&partial="+tips_partial+"&view=enteringaccounts&count="+tips_count+"&prenote="+tips_prenote
		+ "&default="+tips_default+"&accounts="+Rules.company_accts+"&country="+Employee.work_country;
		openHelpDialogWindow("/lawson/xhrnet/directdeposit/ddhelp.htm?"+tipsparms);		
	}
	else if (name == "detail" && Employee.detailWindow == "default")
	{	
		var tips_partial = (Rules.partial_ach=="Y")?true:false
		var tips_full = !tips_partial
		var tips_count = Employee.open_count
		var tips_prenote = (BankAccount.prenote_option=="Y")?true:false
		var tips_default = true

		var tipsparms = "full="+tips_full+"&partial="+tips_partial+"&view=default&count="+tips_count+"&prenote="+tips_prenote
		+ "&default="+tips_default+"&accounts="+Rules.company_accts+"&country="+Employee.work_country;
		openHelpDialogWindow("/lawson/xhrnet/directdeposit/ddhelp.htm?"+tipsparms);	
	}
	else if (name == "detail" && Employee.detailWindow == "add")
	{
		var tips_partial = (Rules.partial_ach=="Y")?true:false
		var tips_full = !tips_partial
		var tips_count = Employee.open_count
		var tips_prenote = (BankAccount.prenote_option=="Y")?true:false
		var tips_default = (Employee.addingDefault)?true:false

		var tipsparms = "full="+tips_full+"&partial="+tips_partial+"&view=add&count="+tips_count+"&prenote="+tips_prenote
		+ "&default="+tips_default+"&accounts="+Rules.company_accts+"&country="+Employee.work_country;
		openHelpDialogWindow("/lawson/xhrnet/directdeposit/ddhelp.htm?"+tipsparms);		
	}
	else if (name == "chgdetail" && Employee.detailWindow == "change")
	{
		var thisCtry = Accounts.Hash[Employee.work_country]
		var Accts = thisCtry.OpenAccounts	
		var tips_partial = (Rules.partial_ach=="Y")?true:false
		var tips_full = !tips_partial
		var tips_count = Employee.open_count
		var tips_prenote = (BankAccount.prenote_option=="Y")?true:false
		var tips_default = (Accts[Employee.detailIndex].default_flag=="Y")?true:false	

		var tipsparms = "full="+tips_full+"&partial="+tips_partial+"&view=change&count="+tips_count+"&prenote="+tips_prenote
		+ "&default="+tips_default+"&accounts="+Rules.company_accts+"&country="+Employee.work_country;
		openHelpDialogWindow("/lawson/xhrnet/directdeposit/ddhelp.htm?"+tipsparms);			
	}
	else if (name == "chgdetail" && Employee.detailWindow == "changedef")
	{
		var thisCtry = Accounts.Hash[Employee.work_country]
		var Accts = thisCtry.OpenAccounts
		var tips_partial = (Rules.partial_ach=="Y")?true:false
		var tips_full = !tips_partial
		var tips_count = thisCtry.openCount
		var tips_prenote = (BankAccount.prenote_option=="Y")?true:false
		var tips_default = (Accts[Employee.detailIndex] && Accts[Employee.detailIndex].default_flag=="Y")?true:false	

		var tipsparms = "full="+tips_full+"&partial="+tips_partial+"&view=changeautoroute&count="+tips_count+"&prenote="+tips_prenote
		+ "&default="+tips_default+"&accounts="+Rules.company_accts+"&country="+Employee.work_country;
		openHelpDialogWindow("/lawson/xhrnet/directdeposit/ddhelp.htm?"+tipsparms);			
	}
}

// DspDeposits takes an action as input.  The action parameter will update the main screen to contain radio
// buttons so that the user can decide what account to select. Moreover, it determines the subsequent
// account modification process (e.g., change default, re-order, add).
function DspDeposits(action,notify)
{
	// Perform any necessary initializations before displaying the screen.
	DONE = false;
	self.focus();

	var htmlStr = "";
	var thisCtry = Accounts.Hash[Employee.work_country];
	// make sure detail screen don't display when refreshing accounts
	document.getElementById("detail").style.visibility = "hidden";
	document.getElementById("chgdetail").style.visibility = "hidden";
	try {
		deactivateTableRows2("ddTbl",self.list,false,true);
	}
	catch(e) {}
	
	if (Rules.company_accts < thisCtry.openCount || thisCtry.acctAvailable < 0)
	{
		tips_action = "";
		try {
			self.list.document.getElementById("paneHeader").innerHTML = getSeaPhrase("ACCOUNTS","DD");
			self.list.document.getElementById("paneBody").innerHTML = '<div class="fieldlabelbold" style="padding:10px;text-align:left">'
			+ getSeaPhrase("DD_24","DD")+' '+getSeaPhrase("DD_511","DD")+'</div>';
		}
		catch(e) {}

		self.list.stylePage();
		self.list.setLayerSizes();
		document.getElementById("list").style.visibility = "visible";
		if (fromTask) {
			parent.removeWaitAlert();
		}
		CloseProgram();
		return;
	}
	else
	{
		tips_action = action;
		
		if (action == "AddDefault" && Employee.work_country != "UK" && !AUTHORIZED)
		{
			OpenAuthWindow(-1,"AddDefault","ADDDEF");
			return;
		}

		var hdrContent = new Array();
		var tblContent = new Array();
		var tbl2Content = new Array();
		var btnContent = new Array();

		var mainTitle = (Employee.work_country == "UK")?getSeaPhrase("DD_93","DD"):getSeaPhrase("DD_83","DD")

		// Create the header content.	
		hdrContent[hdrContent.length] = '<html><head><title>'+mainTitle+'</title></head>'
		hdrContent[hdrContent.length] = '<body>'						
		hdrContent[hdrContent.length] = '<form name="tableform" onSubmit="return false">'
		
		if (action.indexOf("Default") != -1 || action == "ReOrder") {
			hdrContent[hdrContent.length] = '<div style="padding-top:5px;padding-bottom:5px">'
		}
		else {
			hdrContent[hdrContent.length] = '<div style="padding-top:5px;padding-bottom:10px">'
		}
		
		hdrContent[hdrContent.length] = '<table border="0" cellpadding="0" cellspacing="0" width="100%">'

		if (action.indexOf("Default") != -1)
		{
			hdrContent[hdrContent.length] = '<tr><td class="fieldlabelbold" style="text-align:center" valign="top">'
			hdrContent[hdrContent.length] = getSeaPhrase("SELECT_NEW_DEFAULT","DD");		
		}
		else if (action == "ReOrder")
		{
			hdrContent[hdrContent.length] = '<tr><td class="fieldlabelbold" style="text-align:center" valign="top">'
			hdrContent[hdrContent.length] = getSeaPhrase("DD_515","DD")+' '+getSeaPhrase("DD_221","DD")
		}
		else
		{
			hdrContent[hdrContent.length] = '<tr><td class="fieldlabelbold" style="text-align:center" valign="top">'

			if (thisCtry.acctAvailable > 0)
			{
				hdrContent[hdrContent.length] = '<span class="fieldlabelbold" style="text-align:left">'+getSeaPhrase("DD_223","DD")+' '
				hdrContent[hdrContent.length] = thisCtry.acctAvailable + ' '

				if (thisCtry.acctAvailable == 1)
					hdrContent[hdrContent.length] = getSeaPhrase("DD_118","DD")+'</span>'
				else
					hdrContent[hdrContent.length] = getSeaPhrase("DD_119","DD")+'</span>'
			}
			else
			{
				if (Accounts.sysAvailable == 0)
				{
					hdrContent[hdrContent.length] = '<span class="fieldlabelbold" style="text-align:left">'+getSeaPhrase("DD_224","DD")+'</span>'
				}
				else
				{
					var accts_remaining = (Rules.company_accts<Accounts.sysAvailable)?Rules.company_accts:Accounts.sysAvailable
					hdrContent[hdrContent.length] = '<span class="fieldlabelbold" style="text-align:left">'+getSeaPhrase("DD_225","DD")+' '
					hdrContent[hdrContent.length] = parseInt(accts_remaining,10)+'.'
					hdrContent[hdrContent.length] = '<br>'+getSeaPhrase("DD_226","DD")+'</span>'
				}
			}
		}

		hdrContent[hdrContent.length] = '</table></div>';

		// Write the header content.
		htmlStr += hdrContent.join("");

		if (action == "CloseDefault" && Rules.partial_ach != "N") action = "AddDefault"

		// Create the main table content.
		if (!thisCtry.openCount)
		{
			Employee.open_count = 0;
			tblContent[tblContent.length] = '<table border="0" cellpadding="0" cellspacing="0" width="100%">'
			+ '<tr><td class="plaintablecell">'
			if (Employee.work_country == "UK")
			{
				tblContent[tblContent.length] = getSeaPhrase("DD_516","DD")
			}
			else if (Employee.work_country == "CA")
			{
				tblContent[tblContent.length] = getSeaPhrase("DD_517","DD")
			}
			else
			{
				tblContent[tblContent.length] = getSeaPhrase("DD_518","DD")
			}
			tblContent[tblContent.length] = '</table>'
		}
		else
		{
			// Draw the active account table.
			tblContent[tblContent.length] = DrawAcctTable(Employee.work_country,action)
		}

		// If there are any active accounts for US or CA that don't belong to the employee's work-country,
		// paint those for display below the main table.  Disable the buttons on the latter table.
		// Only display these "read-only" active accounts on the main list screen.
		var readOnlyExists = false;
		
		if (action.indexOf("Default") == -1 && action != "ReOrder")
		{
			if (Employee.work_country != "CA" && Accounts.Hash["CA"] && Accounts.Hash["CA"].openCount > 0)
			{
				readOnlyExists = true;
				tbl2Content[tbl2Content.length] = DrawAcctTable("CA",action,true);
			}
			if (Employee.work_country != "US" && Accounts.Hash["US"] && Accounts.Hash["US"].openCount > 0)
			{
				readOnlyExists = true;
				tbl2Content[tbl2Content.length] = DrawAcctTable("US",action,true);
			}
			if (Employee.work_country != "UK" && Accounts.Hash["UK"] && Accounts.Hash["UK"].openCount > 0)
			{
				readOnlyExists = true;
				tbl2Content[tbl2Content.length] = DrawAcctTable("UK",action,true);
			}
		}

		// Display the main table content.
		htmlStr += tblContent.join("")
		
		// The navigation buttons.
		btnContent[btnContent.length] = '<table border="0" cellpadding="0" cellspacing="0" width="100%">'
		+ '<tr><td class="plaintablecell" style="text-align:left">'
		
		if (action == "ReOrder")
		{
			btnContent[btnContent.length] = uiButton(getSeaPhrase("DD_233","DD"),"parent.SaveOrder();return false");
		}

		if ((!thisCtry.openCount && action != "AddDefault")
		|| (thisCtry.acctAvailable && action.indexOf("Default") == -1 && action != "ReOrder"))
		{
			if (thisCtry.acctAvailable >= 0 || Accounts.sysAvailable != 0)
			{
				btnContent[btnContent.length] = uiButton(getSeaPhrase("DD_178","DD"),"parent.QueryAdd('"+action+"');return false");
			}
		}

		if (Rules.partial_ach=="Y" && thisCtry.defaultAcctPtr == -1 && thisCtry.openCount > 1
		&& action != "ReOrder" && action.indexOf("Default") == -1)
		{
			btnContent[btnContent.length] = uiButton(getSeaPhrase("DD_234","DD"),"parent.DspDeposits('AddDefault');return false");
		}
		else if (thisCtry.openCount > 1 && thisCtry.defaultAcctPtr != -1 && action.indexOf("Default") == -1 && action != "ReOrder")
		{
			btnContent[btnContent.length] = uiButton(getSeaPhrase("DD_234","DD"),"parent.DspDeposits('ChangeDefault');return false");
		}

		if (thisCtry.openCount > 1 && action.indexOf("Default") == -1 && action != "ReOrder"
		&& !(thisCtry.openCount == 2 && thisCtry.defaultAcctPtr != -1))
		{
			btnContent[btnContent.length] = uiButton(getSeaPhrase("DD_235","DD"),"parent.DspDeposits('ReOrder');return false");
		}

		if (action.indexOf("Default") != -1 || action == "ReOrder")
		{
			if (!(action == "AddDefault" && Rules.partial_ach == "N"))
			{
				btnContent[btnContent.length] = uiButton(getSeaPhrase("DD_109","DD"),"parent.DspDeposits('');return false");
			}
		}

		if (parentTask != "" && parentTask != "main")
		{
			btnContent[btnContent.length] = uiButton(getSeaPhrase("DD_252","DD"),"parent.CloseDirectDeposit();return false");
		}
		
		btnContent[btnContent.length] = '</td></tr></table>'
		
		htmlStr += btnContent.join("");
		
		if (ShowOtherCtryAccts) {
			htmlStr += tbl2Content.join("");
		}	
		
		htmlStr += '</form></body></html>';
	}

	try {
		self.list.document.getElementById("paneHeader").innerHTML = getSeaPhrase("ACCOUNTS","DD");
		self.list.document.getElementById("paneBody").innerHTML = htmlStr;
	}
	catch(e) {}
	
	self.list.stylePage();
	self.list.setLayerSizes();
	document.getElementById("list").style.visibility = "visible";
	if (fromTask) {
		parent.removeWaitAlert();
	}
	ClearTimer();

	if (action == "Refresh" || notify)
	{
		CheckPerTotal(Employee.work_country,action);
		Notify();
	}
	else
	{
		CheckPerTotal(Employee.work_country,action);
	}
}

function CloseDirectDeposit()
{
	try {
		parent.document.getElementById("fullrelatedtask").style.visibility = "hidden";
		parent.document.getElementById("relatedtask").style.visibility = "hidden";
		parent.document.getElementById("right").style.visibility = "hidden";
		parent.document.getElementById("left").style.visibility = "visible";
	}
	catch(e) {}

	// display the checkmark indicating that this task has been accessed.
	try {
		parent.left.setImageVisibility("directdeposit_checkmark","visible");
	}
	catch(e) {}
}

// PT 121559
var currentlyNoDefault = true;
var currentlyNo100Percent = true;

// Create the content for a Direct Deposit table.
function DrawAcctTable(country,action,readonly)
{
	// PT 121559
	currentlyNoDefault = true;
	currentlyNo100Percent = true;

	var thisCtry = Accounts.Hash[country]
	var Accts = thisCtry.OpenAccounts
	var Content = new Array()
	Content[0] = '<div style="width:100%;text-align:left">';

	Employee.open_count = Accts.length;

	if (readonly)
	{
		Content[0] += '<table border="0" cellpadding="0" cellspacing="0" width="100%">'
		Content[0] += '<tr><td class="fieldlabelbold" style="text-align:center">'
		Content[0] += getSeaPhrase("DD_519","DD")
		Content[0] += '</table>'
	}

	Content[0] += '<table styler="list" '
	if (country == Employee.work_country) {
		Content[0] += 'id="ddTbl" ';
	}
	
	Content[0] += 'border="0" cellpadding="0" cellspacing="0" width="100%">'

	// Institution, Bank
	Content[0] += '<tr style="text-align:center">'
	Content[0] += '<th class="plaintableheaderbordergreytop">'
	Content[0] += ((country == "CA")?getSeaPhrase("INSTITUTION","DD"):getSeaPhrase("DD_82","DD"))
	Content[0] += '</th>'
	if (country == "CA") {
		// Number, Transit
		Content[0] += '<th class="plaintableheaderbordergreytop">'
		Content[0] += getSeaPhrase("DD_176","DD")
		Content[0] += '</th>'	
		Content[0] += '<th class="plaintableheaderbordergreytop">'
		Content[0] += getSeaPhrase("TRANSIT","DD")
		Content[0] += '</th>'		
	} else if (country == "UK") {
		// Sort Code
		Content[0] += '<th class="plaintableheaderbordergreytop">'
		Content[0] += getSeaPhrase("DD_37","DD")
		Content[0] += '</th>'	
	}
	// Account Number
	Content[0] += '<th class="plaintableheaderbordergreytop">'
	Content[0] += getSeaPhrase("DD_244","DD")
	Content[0] += '</th>'	
	// Account Type, Roll Number
	if (country == "UK") {
		Content[0] += '<th class="plaintableheaderbordergreytop">'
		Content[0] += getSeaPhrase("DD_45","DD")
		Content[0] += '</th>'
		Content[0] += '<th class="plaintableheaderbordergreytop">'
		Content[0] += getSeaPhrase("DD_139","DD")
		Content[0] += '</th>'					
	}
	// Description
	Content[0] += '<th class="plaintableheaderbordergreytop">'
	Content[0] += getSeaPhrase("DD_36","DD")
	Content[0] += '</th>'	
	// Type
	if (country == "US") {
		Content[0] += '<th class="plaintableheaderbordergreytop">'
		Content[0] += getSeaPhrase("TYPE","DD")
		Content[0] += '</th>'						
	}	
	// Payable To
	if (country == "UK") {
		Content[0] += '<th class="plaintableheaderbordergreytop">'
		Content[0] += getSeaPhrase("DD_49","DD")
		Content[0] += '</th>'					
	}	
	// Amount
	Content[0] += '<th class="plaintableheaderbordergreytop">'
	Content[0] += getSeaPhrase("DD_44","DD")
	Content[0] += '</th>'	
	
	if (action.indexOf("Default") != -1 || action == "ReOrder") {
		// Select option
		Content[0] += '<th class="plaintableheaderbordergreytop" style="width:30px">&darr;</th>'
	}
	else {
		// Close button
		Content[0] += '<th class="plaintablecell" style="width:30px">&nbsp;</th>'	
	}
	
	Content[0] += '</tr>'
	
	var ACHOrder = 1
	// Display each open account.
	for (var i=0; i<Accts.length; i++)
	{
		Accts[i].ebank_id = LeadingZeros(Accts[i].ebank_id)
		Content[i+1] = '<tr>';
		
		// Institution
		if (country == "CA") 
		{
			Content[i+1] += '<td class="plaintablecellborder" nowrap>'
			Content[i+1] += Accts[i].ca_inst_nbr+'</td>'	
		}
		else // Bank
		{
			Content[i+1] += '<td class="plaintablecellborder" nowrap>'
			Content[i+1] += Accts[i].description+'</td>'
		}

		// Number, Transit
		if (country == "CA")
		{
			Content[i+1] += '<td class="plaintablecellborder" nowrap>'
			Content[i+1] += Accts[i].ebnk_acct_nbr+'</td>'		
			Content[i+1] += '<td class="plaintablecellborder" nowrap>'
			Content[i+1] += Accts[i].ca_transit_nbr+'</td>'			
		}
		else if (country == "UK") // Sort Code
		{
			Content[i+1] += '<td class="plaintablecellborder" nowrap>'
			Content[i+1] += Accts[i].ebank_id+'</td>'		
		}

		// Account Number
		Content[i+1] += '<td class="plaintablecellborder" nowrap>'
		Content[i+1] += ACHOrder + '. '
		
		if (action.indexOf("Default") == -1 && action != "ReOrder") {
			Content[i+1] += '<a href="" onclick="parent.ChangeAccount('+i+');return false">'
			Content[i+1] += Accts[i].ebnk_acct_nbr
			Content[i+1] += '</a>'
		} else {
			Content[i+1] += Accts[i].ebnk_acct_nbr			
		}
		
		// Default
		if (Accts[i].default_flag == "Y")
		{
			Content[i+1] += '<span class="fieldlabelbold" style="text-align:right">'+getSeaPhrase("DD_54","DD")+'</span>'
		}
		
		Content[i+1] += '</td>'				
	
		// Account Type, Roll Number
		if (country == "UK")
		{
			Content[i+1] += '<td class="plaintablecellborder" nowrap>'
			Content[i+1] += Accts[i].account_type_xlt+'</td>'	
			Content[i+1] += '<td class="plaintablecellborder" nowrap>'
			Content[i+1] += Accts[i].bank_roll_no+'</td>'			
		}
	
		// Description
		Content[i+1] += '<td class="plaintablecellborder" nowrap>'
		Content[i+1] += Accts[i].check_desc+'</td>'		
		
		// Type
		if (country == "US")
		{
			Content[i+1] += '<td class="plaintablecellborder" nowrap>'
			Content[i+1] += Accts[i].account_type_xlt+'</td>'					
		}
		
		// Payable To
		if (country == "UK")
		{
			Content[i+1] += '<td class="plaintablecellborder" nowrap>'
			Content[i+1] += Accts[i].payable_to+'</td>'				
		}		
		
		// Amount
		Content[i+1] += '<td class="plaintablecellborder" nowrap>'
		
		if (Rules.partial_ach == "N" && thisCtry.openCount > 1 && Accts[i].default_flag == "Y") {
			Content[i+1] += '100.00'+per;
		}	
		else {
			if (parseFloat(Accts[i].deposit_amt))
			{
				Content[i+1] += TruncateNbr(Accts[i].deposit_amt,2);
			}
			else
			{
				Content[i+1] += TruncateNbr(Accts[i].net_percent,2)+per; 
			}
		}		

		Content[i+1] += '</td>';
		
		if (!readonly && action != "ReOrder" && action.indexOf("Default") == -1)
		{
			Content[i+1] += '<td class="plaintablecell" style="text-align:left;padding-right:0px;padding-top:0px;padding-bottom:0px" nowrap>';
			//PT 162728
			//Content[i+1] += uiButton(getSeaPhrase("DD_531","DD"),"parent.CloseAccount("+i+");return false");		
			Content[i+1] += '<a href="" onclick="javascript:parent.CloseAccount('+i+');return false;">'+getSeaPhrase("DD_531","DD")+'</a>';
			Content[i+1] += '</td>';
		}
		else
		{
			// Re-order checkboxes
			if (!readonly && action == "ReOrder" && Accts[i].default_flag != "Y")
			{
				Content[i+1] += '<td class="plaintablecellborder" style="text-align:center" nowrap>'
				Content[i+1] += '<input class="inputbox" name=order type=text size=2 maxlength=2 value='+ACHOrder+'>'
				Content[i+1] += '<input class="inputbox" name=acct_index type=hidden value='+i+'>'
				Content[i+1] += '</td>'
			}
			// Select new default radio buttons
			else if (Accts[i].default_flag != "Y" && (action == "ChangeDefault" || action == "AddDefault"))
			{
				Content[i+1] += '<td class="plaintablecellborder" style="text-align:center" nowrap>'
				Content[i+1] += '<input class="inputbox" type=radio name=select onClick=parent.ChangeDefault('+i+',"'+action+'")'
				Content[i+1] += ((Accts[i].default_flag=="Y")?' checked>':'>')
				Content[i+1] += '</td>'
			}
			// Use Rules.partial_ach to determine the action on the CloseDefault function.
			else if (Accts[i].default_flag != "Y" && action == "CloseDefault")
			{
				Content[i+1] += '<td class="plaintablecellborder" style="text-align:center" nowrap>'
				Content[i+1] += '<input class="inputbox" type=radio name=select onClick=parent.ProcessCloseDefault('+i+')'
				Content[i+1] += ((Accts[i].default_flag=="Y")?' checked>':'>')
				Content[i+1] += '</td>'
			}
			else if (action.indexOf("Default") != -1 || action == "ReOrder")
			{
				Content[i+1] += '<td class="plaintablecellborder" style="text-align:center" nowrap>&nbsp;</td>'
			}
		}	

		Content[i+1] += '</tr>';
		
		ACHOrder++;

		if (Accts[i].default_flag == "Y")
		{
			// PT 121559
			currentlyNoDefault = false;
		}
		else {
			// PT 121559
			if (!parseFloat(Accts[i].deposit_amt) && parseFloat(Accts[i].net_percent)==100.0)
				currentlyNo100Percent = false;
		}		
	}

	Content[Content.length] = '</table></div>';
	return Content.join("");
}

//********************************************************************************************//
// 							General Editing Functions
//********************************************************************************************//

// Warn the user if the total net percent (excluding a default) exceeds 100%.
function CheckPerTotal(country,action)
{
	clearTimeout(alertTimer)
	FIRSTTIME = false
	if (fromTask) {
		parent.removeWaitAlert();
	}

	if (!Accounts.Hash[country]) return

	var thisCtry = Accounts.Hash[country]

	if (thisCtry.totalPercent > 100 && action.indexOf("Default") == -1 && FIRSTTIME)
	{
		parent.seaAlert(getSeaPhrase("DD_254","DD"))
	}
}

// If system rules dictate, send email about the user's last update.  Show "Update Complete" alert.
function Notify()
{
	clearTimeout(alertTimer)

	if (Rules.notify == "Y" || Rules.notifyee == "Y")
	{
		// If the ProcessFlow service was found, trigger the flow.  Otherwise use the email CGI program.
		var techVersion = (iosHandler && iosHandler.getIOSVersionNumber() >= "9.0") ? ProcessFlowObject.TECHNOLOGY_900 : ProcessFlowObject.TECHNOLOGY_803;
		var httpRequest = (typeof(SSORequest) == "function") ? SSORequest : SEARequest;
		var pfObj = new ProcessFlowObject(window, techVersion, httpRequest, "EMSS");
		pfObj.showErrors = false;

		if (typeof(pfServiceObj) == "undefined")
		{
			pfServiceObj = pfObj.lookUpService("EMSSAutoDepChg");
		}
		
		if (pfServiceObj != null)
		{
			if (fromTask) 
			{
				alertTimer = setTimeout(function(){parent.showWaitAlert(getSeaPhrase("SENDING_EMAIL","ESS"))}, 50);
			}

			var flowObj = pfObj.setFlow("EMSSAutoDepChg", Workflow.SERVICE_EVENT_TYPE, Workflow.ERP_SYSTEM,
						authUser.prodline, authUser.webuser, null, "");
			flowObj.addVariable("company", String(authUser.company));
			flowObj.addVariable("employee", String(authUser.employee));
			flowObj.addVariable("updateType", MailEvent);
			flowObj.addVariable("emailFormat", String(parent.emssObjInstance.emssObj.emailFormat));
			switch (MailEvent)
			{
				case "Add":
					flowObj.addVariable("achDistNbr", String(MailQueue[0].ach_dist_nbr));
					break;
				case "Change":
					flowObj.addVariable("achDistNbr", String(MailQueue[1].ach_dist_nbr));
					break;					
				case "Close":
					flowObj.addVariable("achDistNbr", String(MailQueue[0].ach_dist_nbr));
					break;					
				case "Default":
					flowObj.addVariable("achDistNbr", String(MailQueue[3].ach_dist_nbr));
					break;					
			}
			pfObj.triggerFlow();
			UpdateAlert();
			return;
		}
		
		if (MailEvent == "Reorder")
		{
			var Accts = Accounts.Hash[Employee.work_country].OpenAccounts
			MailQueue = MailQueue.concat(Accts)
		}

		// Send an email message to the payroll department about the Direct Deposit change.
		if (Rules.notify == "Y")
		{
			SendEmail(Rules.email_address,Employee.email_address,MailEvent,MailQueue,"jsreturn",true)
		}

		if (Rules.notifyee == "Y" && typeof(Employee.email_address) != "undefined" && Employee.email_address)
		{
			// Mimic the email message to the employee confirming the change.
			if (Rules.notify=="Y")
				alertTimer = setTimeout("NotifyEmployee(false)",1500)
			else
				alertTimer = setTimeout("NotifyEmployee(true)",1500)
		}
		else
		{
			alertTimer = setTimeout("UpdateAlert()",1500)
		}
	}
	else
		UpdateAlert()
}

function NotifyEmployee(showalert)
{
	clearTimeout(alertTimer)
	SendEmail(Employee.email_address,Employee.email_address,MailEvent,MailQueue,"email",showalert)
	alertTimer = setTimeout("UpdateAlert()",1500)
}

// Popup a window that tells the user his/her update has been completed.
function UpdateAlert()
{
	clearTimeout(alertTimer)
	UPDATING = false

	if (!DONE)
	{
		DONE = true
		if (fromTask) {
			parent.removeWaitAlert();
			parent.showWaitAlert(getSeaPhrase("DD_255","DD"))
		}
		alertTimer = setTimeout("UpdateWarning()",2000)
	}
	else
	{
		if (fromTask) {
			parent.removeWaitAlert();
		}
	}
}

function UpdateWarning()
{
	clearTimeout(alertTimer)
	if (fromTask) {
		parent.removeWaitAlert();
		parent.showWaitAlert(getSeaPhrase("DD_520","DD"))
	}
	alertTimer = setTimeout("ClearTimers()",5000)
}

function ClearTimers()
{
	if (fromTask) {
		parent.removeWaitAlert();
	}
	clearTimeout(alertTimer)
}

// Remove a specified window from the display.
function CloseWindow(msg)
{
	var win

	if (msg == "ADD")
		win = AddAccountWind
	else if (msg == "CHG")
		win = ChangeAccountWind

	if (typeof(win) != "undefined" && !win.closed)
		win.close()
}

// Remove all windows from the interface.
function CloseWindows()
{
	if(waitAlertWind && typeof(waitAlertWind) != "undefined" && !waitAlertWind.closed)
		waitAlertWind.close()
	
	if(ChangeAccountWind && typeof(ChangeAccountWind) != "undefined" && !ChangeAccountWind.closed)
		ChangeAccountWind.close()
	
	if(AddAccountWind && typeof(AddAccountWind) != "undefined" && !AddAccountWind.closed)
		AddAccountWind.close()
	
	if(TipsWind && typeof(TipsWind) != "undefined" && !TipsWind.closed)
		TipsWind.close()
	
	if(AuthWind && typeof(AuthWind) != "undefined" && !AuthWind.closed)
		AuthWind.close()
	
	if(QueryWind && typeof(QueryWind) != "undefined" && !QueryWind.closed)
		QueryWind.close()
	
	if(DescWind && typeof(DescWind) != "undefined" && !DescWind.closed)
		DescWind.close()
	
	if(SelectWind && typeof(SelectWind) != "undefined" && !SelectWind.closed)
		SelectWind.close()

	if(opener != null)
		self.close()
}

// Perform a form edit and display a message where appropriate.
function CheckElement(_func,msg,obj,_2obj,flag,win)
{
	if (eval(_func))
	{
		setRequiredField(_2obj);
		win.seaAlert(msg);
		try
		{
			_2obj.focus();
			if(flag) _2obj.select();
		}
		catch(e)
		{}

		return true;
	}
	else 
	{
		clearRequiredField(_2obj);
		return false;
	}
}

// Zero-fill any leading white space (" ") in a field.  Use this to display and
// update the routing number appropriately.
function LeadingZeros(str)
{
	var retval = ""
	str += ""

	for(var i=0;i<str.length;i++)
	{
		if (str.charAt(i) == " ")
			retval += "0"
		else retval += str.charAt(i)
	}

	return retval
}

// Remember the current account order information for use in email confirmation.
function SaveOldOrder()
{
	var thisCtry = Accounts.Hash[Employee.work_country]
	var Accts = thisCtry.OpenAccounts

	if (Rules.notify == "Y" || Rules.notifyee == "Y")
	{
		MailQueue = new Array()
		for (var i=0;i<Accts.length;i++)
		{
			var mlgth = MailQueue.length
			MailQueue[mlgth] = new Object()
			SaveAccountInfo(MailQueue[mlgth],i)
		}
	}
}


// Edit for a valid routing number.
function ValidCheckDigit(obj)
{
	if (obj.value.length == 0)
		return true

	if (obj.value.length != 9)
		return false

	if (ValidNumber(obj,9,0) == false)
		return false

	var str = obj.value
	var calc = 0
	calc += eval(str.charAt(0) * 3)
	+ eval(str.charAt(1) * 7)
	+ eval(str.charAt(2) * 1)
	+ eval(str.charAt(3) * 3)
	+ eval(str.charAt(4) * 7)
	+ eval(str.charAt(5) * 1)
	+ eval(str.charAt(6) * 3)
	+ eval(str.charAt(7) * 7)
	rnd = Math.ceil(calc / 10) * 10

	if (eval(rnd - calc) != eval(str.charAt(8)))
		return false
	else
		return true
}

// Remove any white space (" ") from a number.
function RemoveSpace(Num)
{
	var Val = ""

	for (var i=0;i<Num.toString().length;i++)
	{
		if (Num.charAt(i) != " ")
			Val += Num.charAt(i)
	}
	if (Val == "") Val = 0

	var retVal = parseInt(Val,10)

	if (isNaN(retVal))
		return Num
	else
		return parseInt(Val,10)
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

// Save the new account distribution order entered by the user
// and submit those affected accounts for update.
function SaveOrder()
{
	if (UPDATING)
		return;

	if (Employee.work_country != "UK" && !AUTHORIZED)
	{
		OpenAuthWindow(-1,"","ORDER")
		return
	}

	SaveOldOrder()
	var thisCtry = Accounts.Hash[Employee.work_country]
	var Accts = thisCtry.OpenAccounts
	var orders = self.list.document.tableform.order
	var indexes = self.list.document.tableform.acct_index
	var MadeChange = false
	var NbrUsed = new Array()
	var ActiveAccounts = new Array()
	var OrderedAccounts = new Array()
	var UsedOrderNbrs = new Array()
	UpdateQueue = new Array()

	for (var i=0;i<orders.length;i++)
	{
		orders[i].value = RemoveSpace(orders[i].value)
		if (!ValidNumber(orders[i],2,0) || !NonSpace(orders[i].value))
		{
			if (!NonSpace(orders[i].value))
				parent.seaAlert(getSeaPhrase("DD_261","DD"))
			else
				parent.seaAlert(getSeaPhrase("DD_521","DD"))
			orders[i].focus()
			orders[i].select()
			return
		}

		if (NbrUsed[orders[i].value])
		{
			parent.seaAlert(getSeaPhrase("DD_522","DD"))
			orders[i].focus()
			orders[i].select()
			return
		}
		NbrUsed[orders[i].value] = true
	}

	for (var i=0;i<orders.length;i++)
	{
		if (i+1 != orders.length && parseInt(orders[i].value,10) > parseInt(orders[i+1].value,10))
			MadeChange = true
		OrderedAccounts[i] = new Object()
		OrderedAccounts[i].ach_dist_order = orders[i].value
		OrderedAccounts[i].index = parseInt(indexes[i].value,10)
		if (OrderedAccounts[i].ach_dist_order.length == 1)
			OrderedAccounts[i].ach_dist_order = "0" + OrderedAccounts[i].ach_dist_order
	}

	if (!MadeChange)
	{
		parent.seaAlert(getSeaPhrase("DD_262","DD"))
		return
	}
	
	sortProperty = "ach_dist_order";
	OrderedAccounts.sort(sortByProperty);

	for (var i=0;i<Accts.length;i++)
	{
		// Ignore the default account when re-ordering accounts.
		if (Accts[i].default_flag == "Y") continue

		UsedOrderNbrs[UsedOrderNbrs.length] = Accts[i].ach_dist_order
		if (typeof(Accts[i].amt_type) == "undefined")
		{
			if (parseFloat(Accts[i].deposit_amt))
			{
				Accts[i].amt_type = "A"
				Accts[i].net_percent = 0
			}
			else
			{
				Accts[i].amt_type = "P"
				Accts[i].deposit_amt = 0
			}
		}
	}

	UsedOrderNbrs.sort(compare)
	
	for (var j=0;j<OrderedAccounts.length;j++)
	{
		if (Accts[OrderedAccounts[j].index].ach_dist_order != UsedOrderNbrs[j])
		{
			Accts[OrderedAccounts[j].index].ach_dist_order = 0
			Accts[OrderedAccounts[j].index].newOrder = UsedOrderNbrs[j]
			UpdateQueue[UpdateQueue.length] = Accts[OrderedAccounts[j].index]
		}
	}

	if (UpdateQueue.length > 0)
	{
		UPDATING = true
		SETORDER = true
		if (Rules.notify == "Y" || Rules.notifyee == "Y")
		{
			MailEvent = "Reorder"
		}		
		Update(UpdateQueue,0)
	}
}

function compare(a,b)
{
	return (a - b)
}

function TruncateNbr(nbr,decimal)
{
	if (nbr == null || typeof(nbr) == "undefined")
		return nbr;

	if (decimal == null || typeof(decimal) == "undefined" || isNaN(parseFloat(decimal)))
		decimal = 0;

	nbr = nbr.toString();
	decimal = parseInt(decimal,10);
	var dec = nbr.indexOf(".");

	if (dec >= 0)
	{
		for (var i=nbr.length; i<dec+decimal+1; i++)
			nbr += "0"
		nbr = nbr.substring(0,dec) + nbr.substring(dec,dec+decimal+1)
	}
	return nbr;
}

function activateTableRow2(tableId,rowNbr,frameObj,isHeader,hasBorder)
{
	try {
		var tblObj;
		var tblRows;
		var tblRow;
		var tblCells;

		if (!frameObj) frameObj = self;
		if (!isHeader) isHeader = false;
		if (typeof(hasBorder) == "undefined") hasBorder = true; 
			
		rowNbr = parseInt(rowNbr,10)+1;	
		tblObj = frameObj.document.getElementById(tableId);
		
		tblRows = tblObj.getElementsByTagName("tr");
		tblRow = tblRows[rowNbr];
		tblCells = tblRow.getElementsByTagName("td");

		// remove highlighting from previously clicked row
		if (tblObj.getAttribute("currentRow") || tblObj.getAttribute("currentRow") == "0")
		{
			var currRow = parseInt(tblObj.getAttribute("currentRow"),10);
			// do not select a row that is already active
			if (rowNbr == currRow) return false;
			
			var oldRow = tblRows[currRow];
			var oldCells = oldRow.getElementsByTagName("td"); 
			
			oldRow.className = "";
			oldCells[oldCells.length-2].className = (isHeader)?((hasBorder)?"plaintableheaderborder":"plaintableheader"):((hasBorder)?"plaintablecellborder":"plaintablecell");	
			if(typeof(window[tableId+"_OnRowDeactivate"])=="function")
			{
				if(!eval(tableId+"_OnRowDeactivate("+currRow+")"))
					return;	
			}		
		}

		// set highlighting on clicked row	
		tblObj.setAttribute("currentRow",rowNbr);		
		tblRow.className = "tablerowhighlight";	
		tblCells[tblCells.length-1].style.backgroundColor = "#ffffff";
		tblCells[tblCells.length-2].className = (isHeader)?((hasBorder)?"plaintableheaderborderactive":"plaintableheaderactive"):((hasBorder)?"plaintablecellborderactive":"plaintablecellactive");		
		if(typeof(window[tableId+"_OnRowActivate"])=="function")
		{
			if(!eval(tableId+"_OnRowActivate("+rowNbr+")"))
				return;	
		}
		return true;
	}
	catch(e) {}
}

function deactivateTableRows2(tableId,frameObj,isHeader,hasBorder)
{
	try {
		var tblObj;
		var tblRows;
		var tblRow;
		var tblCells;

		if (!frameObj) frameObj = self;
		if (!isHeader) isHeader = false;
		if (typeof(hasBorder) == "undefined") hasBorder = true; 
		
		tblObj = frameObj.document.getElementById(tableId);
		tblObj.setAttribute("currentRow","");
		
		tblRows = tblObj.getElementsByTagName("tr");
		
		for (var i=0; i<tblRows.length; i++) 
		{
			tblRow = tblRows[i];
			tblCells = tblRow.getElementsByTagName("td");
			
			if (tblRow.className) {
				tblRow.className = "";
				tblCells[tblCells.length-2].className = (isHeader)?((hasBorder)?"plaintableheaderborder":"plaintableheader"):((hasBorder)?"plaintablecellborder":"plaintablecell");	
			}
		}
		if(typeof(window[tableId+"_OnRowsDeactivate"])=="function")
		{
			if(!eval(tableId+"_OnRowsDeactivate()"))
				return;	
		}		
	}
	catch(e) {}
}

//
//****************************************************************************************//
//				Add Record Functions
//****************************************************************************************//
//
var AddAccountWind
var BankAddrWind
var Banks = new SelectObject()
var ABORTCANCEL = false
var CANCELADDR = false
var SHOWALERT = true
var ADDEDACCOUNT = false
var ALLOFCHECK = true
var JUSTSETNOFLAG = false
var AddWinProps = "resizable=yes,status=no,toolbar=no,height=340,width=725,scrollbars=yes,left="
		+((ScrWidth-735)*.5)+",top="+((ScrHeight-370)*.5)
var BankWinProps = "toolbar=no,menubar=no,resizable=no,scrollbars=yes,width=500,height=350,status=no,left="
		+((ScrWidth-410)*.5)+",top="+((ScrHeight-455)*.5)

function SelectObject()
{
	this.Labels = new Array()
	this.Values = new Array()
	this.FormElements = new Array()
	this.ColWidths = new Array()
	this.ColAlign = new Array()
	this.Fields = new Array();
	this.FieldSizes = new Array();

	if (arguments.length > 0)
	{
		this.Labels = arguments
	}
}

function CaBankObject(ca_inst_nbr, ca_transit_nbr, ebank_id, bank_name)
{
	return new Array(ca_inst_nbr,ca_transit_nbr,bank_name)
}

function BankObject(ca_inst_nbr, ca_transit_nbr, ebank_id, bank_name)
{
	return new Array(ebank_id,bank_name)
}

// Ask the user a question (based on Partial or Full ACH mode) to determine whether to
// next add a default account.
function QueryAdd(action)
{
	if (Employee.work_country != "UK" && !AUTHORIZED)
	{
		OpenAuthWindow(-1,action,"QUERY")
		return
	}

	document.getElementById("chgdetail").style.visibility = "hidden";
	try {
		deactivateTableRows2("ddTbl",self.list,false,true);
	}
	catch(e) {}

	var thisCtry = Accounts.Hash[Employee.work_country]

	if (Rules.partial_ach == "N")
	{
		if (Rules.company_accts == 1)
		{
			if (Rules.waive_receipt == "Y")
				OpenQueryWindow(action,"Full")
			else
		 		AddAccount(action,true)
		}
		else if (Rules.company_accts > 1)
		{
			if (thisCtry.defaultAcctPtr == -1)
				OpenQueryWindow(action,"Full")
			else AddAccount(action)
		}
		else
		{
			parent.seaAlert(getSeaPhrase("DD_462","DD")+'\n'+getSeaPhrase("DD_463","DD"))
			DspDeposits("")
		}
	}
	else
	{
		if (thisCtry.defaultAcctPtr != -1 || !ALLOFCHECK)
			AddAccount(action)
		else
			OpenQueryWindow(action,"Partial")
	}
}

// Load the add account check window.
function AddAccount(action,isdefault,waiveReceipt)
{
	waiveReceipt = (waiveReceipt) ? true : false;
	
	if (!HAVEBANKS && Banks.Values.length == 0)
	{
		if (fromTask) {
			alertTimer = setTimeout("parent.showWaitAlert(getSeaPhrase('DD_157','DD'))",200)
		}
		// Make a quick check to see if there are any banks in the PREMPBANK file.  If not, do not display
		// the drop down arrow.
		if (isdefault)
			GetBanks(1,action,true,waiveReceipt)
		else GetBanks(1,action,false,waiveReceipt)
	}
	else
	{
		if (isdefault) {
			if (Employee.work_country == "UK")
				PaintUKAddWindow(action,true,waiveReceipt)
			else
				PaintAddWindow(action,true,waiveReceipt)
		} else {
			if (Employee.work_country == "UK")
				PaintUKAddWindow(action,false,waiveReceipt)
			else
				PaintAddWindow(action,false,waiveReceipt)
		}
	}
}

// Get a list of the current bank descriptions and rounting numbers.
function GetBanks(max,action,isdefault,waiveReceipt)
{
	clearTimeout(Timer)
	if (Employee.work_country == "UK")
	{
		Banks = new SelectObject(getSeaPhrase('DD_158','DD'),getSeaPhrase('DD_159','DD'))
		Banks.FormElements = new Array("self.detail.document.addform.ebank_id",
			"self.detail.document.addform.description")
		Banks.ColWidths = new Array("80","195")
		Banks.ColAlign = new Array("right","right","left")
	}
	else if (Employee.work_country == "CA")
	{
		Banks = new SelectObject(getSeaPhrase('DD_160','DD'),getSeaPhrase('DD_161','DD'),getSeaPhrase('DD_162','DD'))
		Banks.FormElements = new Array("self.detail.document.addform.ca_inst_nbr",
			"self.detail.document.addform.ca_transit_nbr","self.detail.document.addform.description")
		Banks.ColWidths = new Array("60","60","155")
		Banks.ColAlign = new Array("right","right","left")
	}
	else
	{
		Banks = new SelectObject(getSeaPhrase('DD_163','DD'),getSeaPhrase('DD_164','DD'))
		Banks.FormElements = new Array("self.detail.document.addform.ebank_id",
			"self.detail.document.addform.description")
		Banks.ColWidths = new Array("80","195")
		Banks.ColAlign = new Array("right","left")
	}

	var dmeObj = new DMEObject(prodline,"prempbank")
      	dmeObj.out = "JAVASCRIPT"
      	dmeObj.index = "pebset1"
      	dmeObj.field = "bank-name;ebank-id;ca-inst-nbr;ca-transit-nbr"
      	dmeObj.key = ""
	dmeObj.max = max.toString()
	dmeObj.sortasc = "bank-name"

	if (isdefault)
      		dmeObj.func = "ProcessBanks("+max+",'"+action+"',true,"+waiveReceipt+")"
	else dmeObj.func = "ProcessBanks("+max+",'"+action+"',false,"+waiveReceipt+")"
	dmeObj.debug = false
   	DME(dmeObj,"jsreturn")
}

// Assemble bank descriptions and routing numbers for display in a select window.
function ProcessBanks(max,action,isdefault,waiveReceipt)
{
	var BankObj = (Employee.work_country == "CA")?CaBankObject:BankObject

	// Store the bank records we just retrieved.
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var thisRec = self.jsreturn.record[i]
		index = Banks.Values.length
		Banks.Values[index] = BankObj(thisRec.ca_inst_nbr,thisRec.ca_transit_nbr,thisRec.ebank_id,thisRec.bank_name)
	}

	// If we're not doing the initial check to see if bank records exist AND there are
	// more records to retrieve, execute the next DME call.  Otherwise, if we're not doing
	// the intial check, flag that we've retrieved all the records and paint the list.
	if (max != 1)
	{
		if (self.jsreturn.Next != "")
			self.jsreturn.location.replace(self.jsreturn.Next)
		else
		{
			HAVEBANKS = true
			if (Employee.work_country == "UK")
			{
				if (fromTask) {
					parent.showWaitAlert(getSeaPhrase("DD_165","DD"))
				}
				OpenSelectWindow("Banks",getSeaPhrase("DD_168","DD"))
			}
			else if (Employee.work_country == "CA")
			{
				if (fromTask) {
					parent.showWaitAlert(getSeaPhrase("DD_166","DD"))
				}
				OpenSelectWindow("Banks",getSeaPhrase("DD_169","DD"))
			}
			else
			{
				if (fromTask) {
					parent.showWaitAlert(getSeaPhrase("DD_167","DD"))
				}
				OpenSelectWindow("Banks",getSeaPhrase("DD_170","DD"))
			}
		}
	}
	else // If we've completed our initial check for bank records, paint the Add screen.
	{
		// If we didn't get any records back, flag that we've retrieved all the records.
		if (Banks.Values.length == 0) HAVEBANKS = true

		if (isdefault) {
			if (Employee.work_country == "UK")
				PaintUKAddWindow(action,true,waiveReceipt)
			else	
				PaintAddWindow(action,true,waiveReceipt)
		} else { 
			if (Employee.work_country == "UK")
				PaintUKAddWindow(action,false,waiveReceipt)
			else
				PaintAddWindow(action,false,waiveReceipt)
		}
	}
}

function OpenBankSelect()
{
	// PT 98199
	openBankSelectWindow();
}

// Display the add account window info.
function PaintAddWindow(action,isdefault,waiveReceipt)
{
	if (!ADDEDACCOUNT)
		SHOWALERT = true
	else SHOWALERT = false

	var strHtml = "";

	Employee.detailWindow = "add";
	Employee.addingDefault = isdefault;
	self.detail.document.getElementById("paneHelpIcon").style.visibility = "visible";

	strHtml += '<html><head>'
	strHtml += '<title>'+getSeaPhrase("DD_171","DD")+'</title></head>'
	strHtml += '<body onUnload=parent.opener.CancelAdd("'+action+'",true)>'

	if (navigator.appName.indexOf("Microsoft") == -1)
		strHtml += '<form name="addform" style="padding-right:5px" onsubmit="return false;">'
	strHtml += '<table border="0" cellpadding="0" cellspacing="0" width="100%">'
	if (navigator.appName.indexOf("Microsoft") >= 0) {
		strHtml += '<thead/>'
		strHtml += '<tbody>'
		strHtml += '<form name="addform" onsubmit="return false;">'
	}
	
	if (waiveReceipt) // "No"
		strHtml += '<input type="hidden" name="print_rcpt" id="print_rcpt" maxlength="1" size="1" value="1">'
	else // "Yes"
		strHtml += '<input type="hidden" name="print_rcpt" id="print_rcpt" maxlength="1" size="1" value=" ">'
		
	strHtml += '<tr>'
	strHtml += '<td class="plaintableheaderwhite" style="text-align:right;width:20%" nowrap><label for="desc">'
		
	if (Employee.work_country == "CA")
	{
		strHtml += getSeaPhrase("INSTITUTION","DD")+'</label>'
	}
	else
	{
		strHtml += getSeaPhrase("DD_82","DD")+'</label>'
	}
	strHtml += '</td><td class="plaintableheaderwhite" style="text-align:left;width:70%" colspan="2" nowrap><input class="inputbox" id=desc type=text name=description maxlength=30 size=30 onfocus="this.select();" styler="search" styler_click="StylerEMSS.searchControlOnClick" onkeyup="parent.CheckBankSelection(this);return false;"'
	if(!manualBankEntry)
		strHtml += ' readonly="true" style="color:#a7a6aa"'
	strHtml += '>'

	if (Banks.Values.length > 0)
	{
		strHtml += '<a href="" onclick="javascript:parent.OpenBankSelect();return false;">'
		strHtml += uiSearchIcon()
		strHtml += '</a>'
	}
	
	strHtml += uiRequiredIcon()
	strHtml += '</td>'
	
	strHtml += '<td class="plaintablecell" style="text-align:right;vertical-align:top;width:10%" nowrap>'+fmttoday+'</td>'		
	strHtml += '</tr><tr>'
		
	if (Employee.work_country == "CA")
	{		
		strHtml += '<td class="plaintableheaderwhite" style="text-align:right;width:20%" nowrap><label for="check_desc">'+getSeaPhrase("DD_48","DD")+'</label>'
		strHtml += '<td class="plaintablecell" style="text-align:left;width:80%" colspan="3" nowrap>'
		strHtml += '<input class="inputbox" id=check_desc type=text name=check_desc maxlength=8 size=8>'
		strHtml += uiRequiredIcon()
	}
	else
	{
		strHtml += '<td class="plaintableheaderwhite" style="text-align:right;width:20%" nowrap><label for="check_desc">'+getSeaPhrase("DD_36","DD")+'</label>'
		strHtml += '<td class="plaintablecell" style="text-align:left;width:80%" colspan="3" nowrap>'
		strHtml += '<input class="inputbox" id=check_desc type=text name=check_desc maxlength=8 size=8>'	
		strHtml += uiRequiredIcon()	
	}	
	
	if (Employee.work_country != "CA")
	{
		strHtml += '&nbsp;&nbsp;<span class="plaintableheaderwhite">'+getSeaPhrase("DD_45","DD")+'</span>&nbsp;'
		strHtml += '<input class="inputbox" type=radio name=account_type_xlt value="C" onClick=parent.VerifyAcctType("ADD","C")> '+getSeaPhrase("DD_53","DD")+'&nbsp;'
		strHtml += '<input class="inputbox" type=radio name=account_type_xlt value="S" onClick=parent.VerifyAcctType("ADD","S")> '+getSeaPhrase("DD_47","DD")
		strHtml += uiRequiredIcon()
	}
	else
	{
		strHtml += '&nbsp;';
	}
	
	strHtml += '</td></tr>'
	
	strHtml += '</table>'
	strHtml += '<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>'
	strHtml += '<tr><td>'
	
	strHtml += '<table border="0" cellspacing="0" cellpadding="0"><tr>'
	strHtml += '<td class="plaintablecellsmall" style="text-align:left" nowrap>'
	strHtml += Employee.label_name_1+'</td>'
	strHtml += '<tr><td class="plaintablecellsmall" style="text-align:left" nowrap>'
	strHtml += Employee.addr1

	if (Employee.addr2 != "") {
		strHtml += '<tr><td class="plaintablecellsmall" style="text-align:left" nowrap>'
		strHtml += Employee.addr2
	}
	
	if (Employee.work_country == "CA")
	{
		if (Employee.city != "")
			strHtml += '<tr><td class="plaintablecellsmall" style="text-align:left" nowrap>'+Employee.city+'&nbsp;'
		strHtml += Employee.state+'&nbsp;&nbsp;'+Employee.zip.substring(0,3)+'&nbsp;'
		strHtml += Employee.zip.substring(3,6)
	}
	else
	{
		if(Employee.city != "")
			strHtml += '<tr><td class="plaintablecellsmall" style="text-align:left" nowrap>'+Employee.city+', '
		strHtml += Employee.state+' '+Employee.zip
		strHtml += '<tr><td class="plaintablecellsmall" style="text-align:left" nowrap>'+Employee.country_code
	}
	strHtml += '</table>'
	
	strHtml += '</td><td style="vertical-align:bottom" colspan="2">'
	
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%"><tr>'	
	
	if (isdefault)
	{
		strHtml += '<td class="plaintableheaderwhite" style="text-align:right;width:100%" nowrap>'
		strHtml += getSeaPhrase("DD_51","DD")+'</td><td class="plaintablecell" style="text-align:right;width:10px" nowrap>100%'
		strHtml += '</td>'		
	}
	else
	{
		strHtml += '<td class="plaintableheaderwhite" style="text-align:right;width:100%">'
		strHtml += '<label for="deposit_amt">'+getSeaPhrase("DD_50","DD")+'</label></td><td class="plaintableheaderwhite" style="text-align:left" nowrap>'
		strHtml += '<input class="inputbox" id=deposit_amt type=text name=deposit_amt maxlength=12 size=12>'
		strHtml += '&nbsp;'+getSeaPhrase("DD_177","DD")+'</td>'	
		
		strHtml += '<tr>'
		strHtml += '<td class="plaintableheaderwhite" style="text-align:right;width:100%"><label for="net_percent">'+getSeaPhrase("DD_51","DD")+'</label></td><td class="plaintablecell" style="text-align:left" nowrap>'
		strHtml += '<input class="inputbox" id=net_percent type=text name=net_percent maxlength=7 size=7>'
		strHtml += '</td>'
	}
	
	strHtml += '</tr><tr>'

	strHtml += '<td class="plaintablecell" style="text-align:left" colspan="2">'+getSeaPhrase("DD_172","DD") 
	strHtml += ' _____________________________________________________________'
	strHtml += '</td></tr>'
	
	strHtml += '</table>'
	
	strHtml += '</td></tr>'
	
	strHtml += '<tr><td class="plaintablecell" style="text-align:left" colspan="3">'
	strHtml += '___________________________________________________________________________________ '
	strHtml += getSeaPhrase("DD_44","DD").toUpperCase()
	strHtml += '</td></tr>'
	strHtml += '</table>'
	
	strHtml += '<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>'
	strHtml += '<tr>'
	
	if (Employee.work_country == "CA")
	{
		strHtml += '<td class="plaintablecell" nowrap>'
		strHtml += '<input class="inputbox" id=ca_inst_nbr type=text name=ca_inst_nbr value="" maxlength=4 size=4 onFocus="this.select();" onkeyup="parent.CheckBankSelection(this);return false;"'
		if(!manualBankEntry)
			strHtml += ' readonly="true" style="color:#a7a6aa" onkeydown="return false;"'
		strHtml += '>'
		strHtml += '<br/><span class="plaintableheaderwhite" style="padding-left:0px"><label for="ca_inst_nbr">'+getSeaPhrase("DD_38","DD")+'</label></span>'
		strHtml += '</td>'
		strHtml += '<td class="plaintablecell" nowrap>'
		strHtml += '<input class="inputbox" id=ca_transit_nbr type=text name=ca_transit_nbr value="" maxlength=5 size=5 onFocus="this.select();" onkeyup="parent.CheckBankSelection(this);return false;"'
		if(!manualBankEntry) 
			strHtml += ' readonly="true" style="color:#a7a6aa" onkeydown="return false;"'
		strHtml += '>'		
		strHtml += uiRequiredIcon()
		strHtml += '<br/><span class="plaintableheaderwhite" style="padding-left:0px"><label for="ca_transit_nbr">'+getSeaPhrase("DD_39","DD")+'</label></span>'
		strHtml += '</td>'
		strHtml += '<td class="plaintablecell" style="width:100%" nowrap>'
		strHtml += '<input class="inputbox" id=ebnk_acct_nbr type=text name=ebnk_acct_nbr value="" maxlength=12 size=12 onFocus="this.select();">'	
		strHtml += uiRequiredIcon()
		strHtml += '<br/><span class="plaintableheaderwhite" style="padding-left:0px"><label for="ebnk_acct_nbr">'+getSeaPhrase("DD_41","DD")+'</label></span>'
		strHtml += '</td>'
	}
	else
	{
		strHtml += '<td class="plaintablecell" nowrap>'
		strHtml += '<input class="inputbox" id=ebank_id type=text name=ebank_id value="" maxlength=9 size=9 onFocus="this.select();" onkeyup="parent.CheckBankSelection(this);return false;"'
		if(!manualBankEntry) 
			strHtml += ' readonly="true" style="color:#a7a6aa" onkeydown="return false;"'
		strHtml += '>'
		strHtml += uiRequiredIcon()	
		strHtml += '<br/><span class="plaintableheaderwhite" style="padding-left:0px"><label for="ebank_id">'+getSeaPhrase("DD_40","DD")+'</label></span>'
		strHtml += '</td>'
		strHtml += '<td class="plaintablecell" style="width:100%" nowrap>'
		strHtml += '<input class="inputbox" id=ebnk_acct_nbr type=text name=ebnk_acct_nbr value="" maxlength=17 size=17 onFocus="this.select();">'
		strHtml += uiRequiredIcon()
		strHtml += '<br/><span class="plaintableheaderwhite" style="padding-left:0px"><label for="ebnk_acct_nbr">'+getSeaPhrase("DD_41","DD")+'</label></span>'
		strHtml += '</td>'
	}
	
	strHtml += '<td class="plaintablecell" style="text-align:right" nowrap>'
	if (isdefault) {
		strHtml	+= uiButton(getSeaPhrase("DD_141","DD"),"parent.ProcessAddAccount('"+action+"',true,"+waiveReceipt+");return false")
	}
	else {
		strHtml	+= uiButton(getSeaPhrase("DD_141","DD"),"parent.ProcessAddAccount('"+action+"',false,"+waiveReceipt+");return false")
	}
	
	strHtml	+= uiButton(getSeaPhrase("DD_109","DD"),"parent.CancelAdd('');return false")
	//strHtml += uiButton(getSeaPhrase("DD_179","DD"),"parent.ClearForm(this.form);return false")

	strHtml += '</td></tr>'
	if (navigator.appName.indexOf("Microsoft") >= 0) {
		strHtml += '</form>'
		strHtml += '</tbody>'
	}
	strHtml += '</table>'
 	strHtml += uiRequiredFooter()
 	if (navigator.appName.indexOf("Microsoft") == -1)
		strHtml += '</form>'
	strHtml += '</body></html>'
	
	try {
		self.detail.document.getElementById("paneHeader").innerHTML = getSeaPhrase("ADD_ACCOUNT","DD");
		self.detail.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}
	self.detail.stylePage();
	self.detail.setLayerSizes();
	document.getElementById("detail").style.width = "750px";
	document.getElementById("detail").style.visibility = "visible";	
	ClearTimer();
}

// Display the add account window info.
function PaintUKAddWindow(action,isdefault,waiveReceipt)
{
	if (!ADDEDACCOUNT)
		SHOWALERT = true
	else SHOWALERT = false

	document.getElementById("detail").style.visibility = "hidden";

	var strHtml = "";

	Employee.detailWindow = "add";
	Employee.addingDefault = isdefault;
	self.detail.document.getElementById("paneHelpIcon").style.visibility = "visible";

	strHtml += '<html><head>'
	strHtml += '<title>'+getSeaPhrase("DD_171","DD")+'</title></head>'
	strHtml += '<body onUnload=parent.opener.CancelAdd("'+action+'",true)>'
	strHtml += '<form name=addform onsubmit="return false;">'
	
	if (waiveReceipt) // "No"
		strHtml += '<input type="hidden" name="print_rcpt" id="print_rcpt" maxlength="1" size="1" value="1">'
	else // "Yes"
		strHtml += '<input type="hidden" name="print_rcpt" id="print_rcpt" maxlength="1" size="1" value=" ">'	
	
	strHtml += '<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>'
	strHtml += '<td class="plaintablerowheader"><label for="desc">'
		
	strHtml += getSeaPhrase("DD_35","DD")+'</label><td class="plaintablecell" nowrap>'
	strHtml += '<input class="inputbox" id=desc type=text name=description maxlength=30 size=30 onFocus="this.select();" styler="search" styler_click="StylerEMSS.searchControlOnClick" onkeyup="parent.CheckBankSelection(this);return false;"'
	if(!manualBankEntry)
		strHtml += ' readonly="true" style="color:#a7a6aa"' 
	strHtml += '>'

	if (Banks.Values.length > 0)
	{
		strHtml += '<a href="" onclick="javascript:parent.OpenBankSelect();return false;">'
		strHtml += uiSearchIcon()
		strHtml += '</a>'
	}
	
	strHtml += uiRequiredIcon()
	strHtml += '<tr>'
	strHtml += '<td class="plaintablerowheader"><label for="ebnk_acct_nbr">'+getSeaPhrase("DD_41","DD")+'</label><td class="plaintablecell" nowrap>'
	strHtml += '<input class="inputbox" id=ebnk_acct_nbr type=text name=ebnk_acct_nbr value="" maxlength=17 size=17>'
	strHtml += uiRequiredIcon()
	strHtml += '<tr>'
	strHtml += '<td class="plaintablerowheader"><label for="ebank_id">'+getSeaPhrase("DD_37","DD")+'</label><td class="plaintablecell" nowrap>'
	strHtml += '<input class="inputbox" id=ebank_id type=text name=ebank_id maxlength=9 size=9 onFocus="this.select();" onkeyup="parent.CheckBankSelection(this);return false;"'
	if(!manualBankEntry) 
		strHtml += ' readonly="true" style="color:#a7a6aa" onkeydown="return false;"'
	strHtml += '>'
	strHtml += uiRequiredIcon()
	strHtml += '<tr>'
	strHtml += '<td class="plaintablerowheader">'+getSeaPhrase("DD_45","DD")+'<td class="plaintablecell" nowrap>'
	strHtml += '<input class="inputbox" type=radio name=account_type_xlt value="C" onClick=parent.VerifyAcctType("ADD","C")> '+getSeaPhrase("DD_46","DD")+'&nbsp;&nbsp;&nbsp;'
	strHtml += '<input class="inputbox" type=radio name=account_type_xlt value="S" onClick=parent.VerifyAcctType("ADD","S")> '+getSeaPhrase("DD_47","DD")
	strHtml += uiRequiredIcon()
	strHtml += '<tr>'
	strHtml += '<td class="plaintablerowheader"><label for="bank_roll_no">'+getSeaPhrase("DD_139","DD")+'</label><td class="plaintablecell" nowrap>'
	strHtml += '<input class="inputbox" id=bank_roll_no type=text name=bank_roll_no maxlength=20 size=20>'
	strHtml += '<tr>'
	strHtml += '<td class="plaintablerowheader"><label for="check_desc">'+getSeaPhrase("DD_48","DD")+'</label><td class="plaintablecell" nowrap>'
	strHtml += '<input class="inputbox" id=check_desc type=text name=check_desc maxlength=8 size=8>'
	strHtml += uiRequiredIcon()
	strHtml += '<tr>'
	strHtml += '<td class="plaintablerowheader"><label for="payable_to">'+getSeaPhrase("DD_49","DD")+'</label><td class="plaintablecell" nowrap>'
	strHtml += '<input class="inputbox" id=payable_to type=text name=payable_to maxlength=18 size=18>'
	strHtml += '<tr>'
	
	if (isdefault)
	{
		strHtml += '<td class="plaintablerowheaderborderbottom">'+getSeaPhrase("DD_51","DD")+'<td class="plaintablecell" nowrap>100%'
	}
	else
	{
		strHtml += '<td class="plaintablerowheader"><label for="deposit_amt">'+getSeaPhrase("DD_50","DD")+'</label><td class="plaintablecell" nowrap>'
		strHtml += '<input class="inputbox" id=deposit_amt type=text name=deposit_amt maxlength=12 size=12>'
		strHtml += '<tr><td class="plaintablerowheader">'+getSeaPhrase("DD_177","DD")+'</td></tr><tr>'
		strHtml += '<td class="plaintablerowheaderborderbottom"><label for="net_percent">'+getSeaPhrase("DD_51","DD")+'</label><td class="plaintablecell" nowrap>'
		strHtml += '<input class="inputbox" id=net_percent type=text name=net_percent maxlength=7 size=7>'
	}

	strHtml += '<tr><td class="fieldlabelbold">&nbsp;</td><td class="plaintablecell">'
	
	if (isdefault) {
		strHtml	+= uiButton(getSeaPhrase("DD_141","DD"),"parent.ProcessAddAccount('"+action+"',true,"+waiveReceipt+");return false")
	}
	else {
		strHtml	+= uiButton(getSeaPhrase("DD_141","DD"),"parent.ProcessAddAccount('"+action+"',false,"+waiveReceipt+");return false")
	}
	
	strHtml	+= uiButton(getSeaPhrase("DD_109","DD"),"parent.CancelAdd('');return false")
	//strHtml += uiButton(getSeaPhrase("DD_179","DD"),"parent.ClearForm(this.form);return false")

	strHtml += '</td></tr></table>'
	strHtml += uiRequiredFooter()
	strHtml += '</form></body>'
	
	try {
		self.detail.document.getElementById("paneHeader").innerHTML = getSeaPhrase("ADD_ACCOUNT","DD");
		self.detail.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}
	
	self.detail.stylePage();
	self.detail.setLayerSizes();
	document.getElementById("detail").style.visibility = "visible";	
	ClearTimer();
}

function ClearTimer()
{
	clearTimeout(alertTimer);
	if (fromTask) {
		parent.removeWaitAlert();
	}
}

// Toggle the account type boxes when the user selects a type.
function VerifyAcctType(win,type)
{
	var AcctType
	var ThisWindow
	var ThisForm

	if (win == "ADD")
	{
		ThisWindow = self.detail
		ThisForm = self.detail.document.addform
	}
	else if (win == "CHG")
	{
		ThisWindow = self.chgdetail
		ThisForm = self.chgdetail.document.chgform
	}

	AcctType = ThisForm.account_type_xlt
	for (var i=0; i<AcctType.length; i++)
	{
		if (AcctType[i].value != type)
		{
			AcctType[i].checked = false
			break
		}
	}
}

// Format the routing number to the maximum number of digits if the user has not done so.
function FmtRoutingNbr(ebank_id,digits)
{
	var str = ebank_id.value
	var retval = ""

	for(var i=0;i<digits;i++)
	{
		if (i < str.length)
		{
			if (str.charAt(i) == " ")
				retval += "0"
			else retval += str.charAt(i)
		}
		else
			retval = "0" + retval
	}
	ebank_id.value = retval
}

// Clear all enterable fields on the add account window.
function ClearForm(obj)
{
	obj.reset()
	obj.elements[0].select()
}

// Back out of the current add action.
function CancelAdd(action,onunload)
{
	if (JUSTSETNOFLAG)
	{
		JUSTSETNOFLAG = false
		ALLOFCHECK = true
	}

	if (typeof(SelectWind) != "undefined" && typeof(SelectWind) != "unknown" && !SelectWind.closed)
		SelectWind.close()

	if (!onunload)
	{
		self.document.getElementById('detail').style.visibility = "hidden";
		self.list.addHelpIcon();
	}
}

// PT 121559
var autoDepositFlag = "";

// Verify the new account info the user has entered and submit it for update.
function ProcessAddAccount(action,isdefault,waiveReceipt)
{
    if (UPDATING)
        return;

	var obj = self.detail.document.addform;
	var checkmsg = ""
	FormValues = new Object()

	if (Employee.work_country == "UK")
	{
		if (CheckElement("!NonSpace(obj.description.value)",
		getSeaPhrase("DD_183","DD"),obj,obj.description,true,parent))
			return	
	
		FmtRoutingNbr(obj.ebank_id,9)
		
		if (CheckElement("!NonSpace(obj.ebank_id.value) || obj.ebank_id.value == 0",
		getSeaPhrase("DD_180","DD"),obj,obj.ebank_id,true,parent))
			return
			
		if (CheckElement("!ValidNumber(obj.ebank_id,9,0)",
		getSeaPhrase("DD_181","DD"),obj,obj.ebank_id,true,parent))
			return	
		
		if (CheckElement("!NonSpace(obj.ebnk_acct_nbr.value)",
		getSeaPhrase("DD_182","DD"),obj,obj.ebnk_acct_nbr,true,parent))
			return	
			
		if (CheckElement("!NonSpace(obj.check_desc.value)",
		getSeaPhrase("DD_147","DD"),obj,obj.check_desc,true,parent))
			return	
			
		if (CheckElement("!obj.account_type_xlt[0].checked && !obj.account_type_xlt[1].checked",
		getSeaPhrase("DD_145","DD"),obj,obj.account_type_xlt[0],false,parent))
			return	
	}
	else if (Employee.work_country == "CA")
	{
		if (CheckElement("!NonSpace(obj.description.value)",
		getSeaPhrase("DD_186","DD"),obj,obj.description,true,parent))
			return	
	
		FmtRoutingNbr(obj.ca_transit_nbr,5)

		if (CheckElement("!NonSpace(obj.ca_transit_nbr.value) || obj.ca_transit_nbr.value == 0",
		getSeaPhrase("DD_184","DD"),obj,obj.ca_transit_nbr,true,parent))
			return

		if (CheckElement("!ValidNumber(obj.ca_transit_nbr,5,0)",
		getSeaPhrase("DD_181","DD"),obj,obj.ca_transit_nbr,true,parent))
			return

		if (CheckElement("!NonSpace(obj.ebnk_acct_nbr.value)",
		getSeaPhrase("DD_185","DD"),obj,obj.ebnk_acct_nbr,true,parent))
			return

		if (CheckElement("!NonSpace(obj.check_desc.value)",
		getSeaPhrase("DD_147","DD"),obj,obj.check_desc,true,parent))
			return
	}
	else
	{
		if (CheckElement("!NonSpace(obj.description.value)",
		getSeaPhrase("DD_192","DD"),obj,obj.description,true,parent))
			return	
	
		FmtRoutingNbr(obj.ebank_id,9)

		if (CheckElement("!NonSpace(obj.ebank_id.value) || obj.ebank_id.value == 0",
		getSeaPhrase("DD_187","DD"),obj,obj.ebank_id,true,parent))
			return

		if (CheckElement("!ValidNumber(obj.ebank_id,9,0)",
		getSeaPhrase("DD_181","DD"),obj,obj.ebank_id,true,parent))
			return

		if (CheckElement("!ValidCheckDigit(obj.ebank_id)",
		getSeaPhrase("DD_188","DD"),obj,obj.ebank_id,true,parent))
			return

		if (CheckElement("!NonSpace(obj.ebnk_acct_nbr.value)",
		getSeaPhrase("DD_182","DD"),obj,obj.ebnk_acct_nbr,true,parent))
			return

		if (CheckElement("!obj.account_type_xlt[0].checked && !obj.account_type_xlt[1].checked",
		getSeaPhrase("DD_146","DD"),obj,obj.account_type_xlt[0],false,parent))
			return
			
		if (CheckElement("!NonSpace(obj.check_desc.value)",
		getSeaPhrase("DD_147","DD"),obj,obj.check_desc,true,parent))
			return			
	}

	if (isdefault)
	{
		FormValues.net_percent = 100
		FormValues.amt_type = "P"
		FormValues.deposit_amt = 0
		
	}
	else
	{
		if (CheckElement("!NonSpace(obj.deposit_amt.value) && !NonSpace(obj.net_percent.value)",
		getSeaPhrase("DD_148","DD"),obj,obj.deposit_amt,true,parent))
				return
	
		if (CheckElement("NonSpace(obj.deposit_amt.value) && NonSpace(obj.net_percent.value)",
		getSeaPhrase("DD_193","DD"),obj,obj.deposit_amt,true,parent))
				return
	
		if (CheckElement("NonSpace(obj.net_percent.value) && !ValidNumber(obj.net_percent,7,3)",
		getSeaPhrase("DD_150","DD"),obj,obj.net_percent,true,parent))
				return
			
		if (CheckElement("NonSpace(obj.net_percent.value) && obj.net_percent.value>100",
		getSeaPhrase("DD_151","DD"),obj,obj.net_percent,true,parent))
				return	
		
		if (CheckElement("NonSpace(obj.deposit_amt.value) && obj.deposit_amt.value==0",
		getSeaPhrase("DD_152","DD"),obj,obj.deposit_amt,true,parent))
				return
				
		if (CheckElement("NonSpace(obj.net_percent.value) && parseInt(Accounts.Hash[Employee.work_country].totalPercent,10)>=100",
		getSeaPhrase("DD_465","DD"),obj,obj.deposit_amt,true,parent))
				return

		var PercentLeft = 100-Accounts.Hash[Employee.work_country].totalPercent
		if (parseInt(PercentLeft,10) != parseFloat(PercentLeft)) PercentLeft = TruncateNbr(PercentLeft,3)
		if (CheckElement("NonSpace(obj.net_percent.value) && ((parseFloat(obj.net_percent.value)+parseFloat(Accounts.Hash[Employee.work_country].totalPercent))>100)",
			getSeaPhrase("DD_466","DD")+" "+PercentLeft+ per +" "+getSeaPhrase("DD_155","DD"),obj,obj.deposit_amt,true,parent))
				return

		if (CheckElement("NonSpace(obj.deposit_amt.value) && !ValidNumber(obj.deposit_amt,12,2)",
		getSeaPhrase("DD_156","DD"),obj,obj.deposit_amt,true,parent))
				return

		if (NonSpace(obj.deposit_amt.value))
		{
			FormValues.amt_type = "A"
			FormValues.deposit_amt = obj.deposit_amt.value
			FormValues.net_percent = 0
		}
		else
		{
			FormValues.amt_type = "P"
			FormValues.net_percent = obj.net_percent.value
			FormValues.deposit_amt = 0
		}
	}

	if (Employee.work_country == "UK")
	{
		FormValues.ebank_id = obj.ebank_id.value
		FormValues.account_type_xlt = (obj.account_type_xlt[0].checked)?"Current":"Savings"
		FormValues.check_desc = obj.check_desc.value
		FormValues.payable_to = obj.payable_to.value
		FormValues.bank_roll_no = obj.bank_roll_no.value
	}
	else if (Employee.work_country == "CA")
	{
		FormValues.ca_inst_nbr = obj.ca_inst_nbr.value
		FormValues.ca_transit_nbr = obj.ca_transit_nbr.value
		FormValues.check_desc = obj.check_desc.value
	}
	else
	{
		FormValues.ebank_id = obj.ebank_id.value
		FormValues.account_type_xlt = (obj.account_type_xlt[0].checked)?"Checking":"Savings"
		FormValues.check_desc = obj.check_desc.value
	}
	
	FormValues.description = obj.description.value
	FormValues.ebnk_acct_nbr = obj.ebnk_acct_nbr.value
	FormValues.end_date = " "
	FormValues.isNew = true
	FormValues.isTouched = false

	if (Employee.work_country != "UK")
	{
		if (FormValues.amt_type == "P")
		{
			if (obj.net_percent)
				FormValues.net_percent = obj.net_percent.value
			else
				FormValues.net_percent = FormValues.net_percent
			FormValues.deposit_amt = 0
		}
		else
		{
			if (obj.deposit_amt)
				FormValues.deposit_amt = obj.deposit_amt.value
			else
				FormValues.deposit_amt = FormValues.deposit_amt
			FormValues.net_percent = 0
		}
	}
	
	if (isdefault)
	{
		ADDNEWDEFAULT = true
		FormValues.default_flag = "Y"
	}
	else
		FormValues.default_flag = "N"
		
	if (waiveReceipt) // "No"
		FormValues.print_rcpt = "1"
	else // "Yes"
		FormValues.print_rcpt = " "

	if (PrepAccount(FormValues))
	{
		UPDATING = true
		CLEARFLAG = false

		if (Employee.open_count == 0) SETFLAG = true

		// PT 121559
		if (Rules.partial_ach=="Y" && 
		(isdefault || (FormValues.amt_type=="P" && parseFloat(FormValues.net_percent)==100.0)))
			autoDepositFlag = "Y";
		else
			autoDepositFlag = "";

		SHOWALERT = false
		ADDEDACCOUNT = true
		JUSTSETNOFLAG = false
		UpdateQueue = new Array()
		UpdateQueue[UpdateQueue.length] = FormValues
		CloseAddAccountWindows()

		if (Rules.notify == "Y" || Rules.notifyee == "Y")
		{
			MailEvent = "Add"
			MailQueue = new Array()
			MailQueue[MailQueue.length] = FormValues
		}
		
		Update(UpdateQueue,0)
	}
}

// Function to close the main add and bank select windows.
function CloseAddAccountWindows()
{
	closeDmeFieldFilter();
}

//
//****************************************************************************************//
//				Change Record Functions
//****************************************************************************************//
//
var Timer;

var ChangeAccountWind
var ChangeWinProps = "resizable=yes,status=no,toolbar=no,height=400,width=500,scrollbars=yes,left="
		+((ScrWidth-410)*.5)+",top="+((ScrHeight-405)*.5)
// Launch a change subwindow that allows changes to the selected account.
function ChangeAccount(index)
{
	var thisCtry = Accounts.Hash[Employee.work_country]
	var Accts = thisCtry.OpenAccounts

	document.getElementById("detail").style.visibility = "hidden";

	// Set active row highlight
	activateTableRow2("ddTbl",index,self.list,false,true);
	
	// If the account to be changed has a net percentage, subtract it from the total
	// distribution percentage, since the new amount will be added in after the
	// database change is effective.
	if (NonSpace(Accts[index].net_percent))
	{
		thisCtry.addBackPercent = Accts[index].net_percent;
	}
	else
	{
		thisCtry.addBackPercent = 0;
	}

	// Authorize the user.
	if (Employee.work_country != "UK" && !AUTHORIZED)
	{
		OpenAuthWindow(index,"ChangeAccount","CHG")
	}
	else
	{
		PaintChangeWindow(index,"ChangeAccount")
	}
}

// Paint the change window contents.
function PaintChangeWindow(index,action)
{
	var strHtml = '<HTML><HEAD><title>'+getSeaPhrase("DD_450","DD")+'</title>'
	+ '</HEAD><body'

	if (action == "ChangeDefault")
	{
		strHtml += ' onunload="parent.opener.RollBack();">'
		+ ChangeDefaultContents(index,action)
	}
	else
	{
		strHtml += '>'+ChangeContents(index,action)
	}

	try {
		self.chgdetail.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DETAIL","DD");
		self.chgdetail.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}
	
	self.chgdetail.stylePage();
	self.chgdetail.setLayerSizes();
	document.getElementById("detail").style.visibility = "hidden";	
	document.getElementById("chgdetail").style.visibility = "visible";	
}

function ChangeContents(index,action)
{
	var thisCtry = Accounts.Hash[Employee.work_country]
	var Accts = thisCtry.OpenAccounts

	var arg = '<form name="chgform" onSubmit="return false">'
	+ '<table border="0" cellpadding="0" cellspacing="0" width="100%">'
	
	if (Employee.work_country != "UK" && Accts[index].country_code != "UK")
	{
		Employee.detailWindow = "change";
		Employee.detailIndex = index;
		self.chgdetail.document.getElementById("paneHelpIcon").style.visibility = "visible";		
	}
	else
	{
		self.chgdetail.document.getElementById("paneHelpIcon").style.visibility = "hidden";		
	}
	
	// Bank or Building Society, Sort Code
	if (Employee.work_country == "UK" || Accts[index].country_code == "UK")
	{
		arg += '<tr><th class="plaintablerowheaderlite">'+getSeaPhrase("DD_35","DD")+'<td class="plaintablecelldisplay" nowrap>'+Accts[index].description
		+ '<tr><th class="plaintablerowheaderlite">'+getSeaPhrase("DD_37","DD")+'<td class="plaintablecelldisplay" nowrap>'+Accts[index].ebank_id
	}
	// Institution, Institution Number, Transit Number
	else if (Employee.work_country == "CA" || Accts[index].country_code == "CA")
	{
		arg += '<tr><th class="plaintablerowheaderlite">'+getSeaPhrase("INSTITUTION","DD")+'<td class="plaintablecelldisplay" nowrap>'+Accts[index].description
		+ '<tr><th class="plaintablerowheaderlite">'+getSeaPhrase("DD_38","DD")+'<td class="plaintablecelldisplay" nowrap>'+Accts[index].ca_inst_nbr
		+ '<tr><th class="plaintablerowheaderlite">'+getSeaPhrase("DD_39","DD")+'<td class="plaintablecelldisplay" nowrap>'+Accts[index].ca_transit_nbr
	}
	// Bank, Routing Number
	else
	{
		arg += '<tr><th class="plaintablerowheaderlite">'+getSeaPhrase("DD_82","DD")+'<td class="plaintablecelldisplay" nowrap>'+Accts[index].description
		+ '<tr><th class="plaintablerowheaderlite">'+getSeaPhrase("DD_40","DD")+'<td class="plaintablecelldisplay" nowrap>'+Accts[index].ebank_id
	}

	// Account
	if (Employee.work_country == "UK" || Accts[index].country_code == "UK")
	{
		arg += '<tr><th class="plaintablerowheaderlite">'+getSeaPhrase("DD_244","DD")
		+ '<td class="plaintablecelldisplay" nowrap>'+Accts[index].ebnk_acct_nbr
	}
	// Account Number
	else 
	{
		arg += '<tr><th class="plaintablerowheaderlite">'+getSeaPhrase("DD_41","DD")
		+ '<td class="plaintablecelldisplay" nowrap>'+Accts[index].ebnk_acct_nbr
	}
	
	// Account Type, Roll Number
	if (Employee.work_country == "UK" || Accts[index].country_code == "UK")
	{
		arg += '<tr><th class="plaintablerowheaderlite">'+getSeaPhrase("DD_45","DD")+'<td class="plaintablecelldisplay" nowrap>'
		+ '<input class="inputbox" type=radio name=account_type_xlt value="C"'
		
		if (Accts[index].account_type == "C")
			arg += ' checked'
		arg += ' onClick=parent.VerifyAcctType("CHG","C")>'+getSeaPhrase("DD_46","DD")+'&nbsp;&nbsp;&nbsp;'
		+ '<input class="inputbox" type=radio name=account_type_xlt value="S"'
		
		if (Accts[index].account_type == "S")
			arg += ' checked'
		arg += ' onClick=parent.VerifyAcctType("CHG","S")>'+getSeaPhrase("DD_47","DD")
	
		arg += '<tr><th class="plaintablerowheaderlite">'+getSeaPhrase("DD_139","DD")
		+ '<td class="plaintablecelldisplay" nowrap>'+Accts[index].bank_roll_no
	}
	// Account Type
	else if (Employee.work_country == "US" || Accts[index].country_code == "US")
	{
		arg += '<tr><th class="plaintablerowheaderlite">'+getSeaPhrase("DD_45","DD")+'<td class="plaintablecelldisplay" nowrap>'
		+ '<input class="inputbox" type=radio name=account_type_xlt value="C"'

		if (Accts[index].account_type == "C")
			arg += ' checked'
		arg += ' onClick=parent.VerifyAcctType("CHG","C")> '+getSeaPhrase("DD_53","DD")+'&nbsp;&nbsp;&nbsp;'
		+ '<input type=radio name=account_type_xlt value="S"'

		if (Accts[index].account_type == "S")
			arg += ' checked'
		arg += ' onClick=parent.VerifyAcctType("CHG","S")> '+getSeaPhrase("DD_47","DD")
	}
	
	// Description
	arg += '<tr><th class="plaintablerowheaderlite"><label for="check_desc">'+getSeaPhrase("DD_52","DD")+'</label>'
	+ '<td class="plaintablecelldisplay" nowrap><input class="inputbox" id=check_desc type=text name=check_desc value="'+Accts[index].check_desc
	+ '" maxlength=8 size=8 onFocus=this.select()>'

	// Payable To
	if (Employee.work_country == "UK" || Accts[index].country_code == "UK")
	{
		arg + '<tr><th class="plaintablerowheaderlite"><label for="payable_to">'+getSeaPhrase("DD_49","DD")+'</label>'
		+ '<td class="plaintablecelldisplay" nowrap><input class="inputbox" id=payable_to type=text name=payable_to value="'+Accts[index].payable_to
		+ '" maxlength=18 size=18 onFocus=this.select()>'
	}
	
	
	if ((Accts.length == 1 && Rules.partial_ach == "N")
	|| (thisCtry.openCount == 1 && Rules.partial_ach == "N"))
	{
		if (Rules.waive_receipt == "Y")
		{
			arg += '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("DD_54","DD")+'<td class="plaintablecelldisplay" nowrap>100%'
		 	arg += '<tr><td class="fieldlabelboldliteunderline">'+getSeaPhrase("WAIVE_PAPER_RECEIPT","DD")+'<td class="plaintablecelldisplay" nowrap><input class="inputbox" type="radio" name="waive_receipt" value="Y"'
			if (Accts[index].print_rcpt == "1") // "No"
				arg += ' checked'
			arg += '>'+getSeaPhrase("DD_55","DD")+'&nbsp;&nbsp;&nbsp;'
			arg += '<input class="inputbox" type="radio" name="waive_receipt" value="N"'
			if (Accts[index].print_rcpt != "1") // "Yes"
				arg += ' checked'
		   	arg += '>'+getSeaPhrase("DD_56","DD")
		}
		else
		{
			arg += '<tr><td class="fieldlabelboldliteunderline">'+getSeaPhrase("DD_54","DD")+'<td class="plaintablecelldisplay" nowrap>100%'
		}
	}
	else
	{
		if (Accts[index].default_flag == "Y")
		{
			if (Rules.waive_receipt == "Y")
			{
				arg += '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("DD_54","DD")+'<td class="plaintablecelldisplay" nowrap>100%'
			 	arg += '<tr><td class="fieldlabelboldliteunderline">'+getSeaPhrase("WAIVE_PAPER_RECEIPT","DD")+'<td class="plaintablecelldisplay" nowrap><input class="inputbox" type="radio" name="waive_receipt" value="Y"'
				if (Accts[index].print_rcpt == "1") // "No"
					arg += ' checked'
				arg += '>'+getSeaPhrase("DD_55","DD")+'&nbsp;&nbsp;&nbsp;'
				arg += '<input class="inputbox" type="radio" name="waive_receipt" value="N"'
				if (Accts[index].print_rcpt != "1") // "Yes"
					arg += ' checked'
			   	arg += '>'+getSeaPhrase("DD_56","DD")
			}
			else
			{
				arg += '<tr><td class="fieldlabelboldliteunderline">'+getSeaPhrase("DD_54","DD")+'<td class="plaintablecelldisplay" nowrap>100%'
			}
		}
		else
		{
			arg +='<tr><td class="plaintablerowheaderlite"><label for="deposit_amt">'+getSeaPhrase("DD_50","DD")+'</label><td class="plaintablecelldisplay" nowrap>'
			    + '<input class="inputbox" id=deposit_amt type=text name=deposit_amt maxlength=12 size=12'
			if (eval(Accts[index].deposit_amt) != 0)
				arg += ' value="'+parseFloat(Accts[index].deposit_amt)+'"'

			arg +='>'
			    + '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("DD_177","DD")+'<td class="plaintablecelldisplay" nowrap>'
			    + '<tr><td class="fieldlabelboldliteunderline"><label for="net_percent">'+getSeaPhrase("DD_51","DD")+'</label><td class="plaintablecelldisplay" nowrap>'
			    + '<input class="inputbox" id=net_percent type=text name=net_percent maxlength=7 size=7'

			if (Accts[index].net_percent != 0)
				arg += ' value="'+parseFloat(Accts[index].net_percent)+'"'
			arg +='>'
		}
	}

	arg += '<tr><td class="plaintablecelldisplay">&nbsp;</td>'
	+ '<td class="plaintablecell">'
	+ uiButton(getSeaPhrase("DD_141","DD"),"parent.ProcessChange("+index+",'"+action+"');return false")
	+ uiButton(getSeaPhrase("DD_109","DD"),"parent.CancelChange();return false")
	//+ uiButton(getSeaPhrase("DD_252","DD"),"parent.CloseAccount("+index+");return false","margin-left:15px")
	+ '</td></tr>'
	+ '</table>'
	+ '</form>'

	return arg;
}

function CancelChange()
{
	deactivateTableRows2("ddTbl",self.list,false,true);
	CancelChangeDetail();	
}	

function CancelChangeDetail()
{
	document.getElementById("chgdetail").style.visibility = "hidden";
	self.list.addHelpIcon();
}

// Perform edits on the form data entered by the user and submit
// for update.
function ProcessChange(i,action)
{
	if (UPDATING)
		return;

	var obj = self.chgdetail.document.chgform
	var thisCtry = Accounts.Hash[Employee.work_country]
	var Accts = thisCtry.OpenAccounts
	FormValues = new Object()

	/* account number now is read-only
	if (Employee.work_country != "UK" && obj.ebnk_acct_nbr)
	{
		if (CheckElement("!NonSpace(obj.ebnk_acct_nbr.value)",
			getSeaPhrase("DD_143","DD"),obj,obj.ebnk_acct_nbr,true,parent))
				return

		if (CheckElement("isNaN(parseFloat(obj.ebnk_acct_nbr.value))",
			getSeaPhrase("DD_144","DD"),obj,obj.ebnk_acct_nbr,true,parent))
			return
	}
	*/

	if (obj.account_type_xlt)
	{
		if (Employee.work_country == "UK")
		{
			if(CheckElement("!obj.account_type_xlt[0].checked && !obj.account_type_xlt[1].checked",
				getSeaPhrase("DD_145","DD"),obj,obj.account_type_xlt[0],false,parent))
					return
		}
		else
		{
			if(CheckElement("!obj.account_type_xlt[0].checked && !obj.account_type_xlt[1].checked",
				getSeaPhrase("DD_146","DD"),obj,obj.account_type_xlt[0],false,parent))
					return
		}
	}	

	if (obj.check_desc)
	{
		if(CheckElement("!NonSpace(obj.check_desc.value)",
			getSeaPhrase("DD_147","DD"),obj,obj.check_desc,true,parent))
				return
	}

	if (action != "ChangeDefault" && ((!Accts.length && Rules.partial_ach == "N") ||
		(!thisCtry.openCount && Rules.partial_ach == "N") || (Accts[i].default_flag == "Y")))
	{
		FormValues.net_percent = 100
		FormValues.deposit_amt = 0
		FormValues.amt_type = "P"
	}
	else
	{
		if (obj.deposit_amt)
		{
			if (CheckElement("!NonSpace(obj.deposit_amt.value) && !NonSpace(obj.net_percent.value)",
				getSeaPhrase("DD_148","DD"),obj,obj.deposit_amt,true,parent))
					return

			if (CheckElement("NonSpace(obj.deposit_amt.value) && NonSpace(obj.net_percent.value)",
				getSeaPhrase("DD_193","DD"),obj,obj.deposit_amt,false,parent))
					return

			if (CheckElement("!NonSpace(obj.deposit_amt.value) && !ValidNumber(obj.net_percent,7,3)",
				getSeaPhrase("DD_150","DD"),obj,obj.net_percent,true,parent))
					return

			if (CheckElement("!NonSpace(obj.deposit_amt.value) && obj.net_percent.value>100",
				getSeaPhrase("DD_151","DD"),obj,obj.net_percent,true,parent))
					return

			if (CheckElement("!NonSpace(obj.deposit_amt.value) && obj.net_percent.value==0",
				getSeaPhrase("DD_152","DD"),obj,obj.net_percent,true,parent))
					return

			var PercentLeft = 100 - parseFloat(thisCtry.totalPercent) + parseFloat(thisCtry.addBackPercent);
			if (parseInt(PercentLeft,10) != parseFloat(PercentLeft)) PercentLeft = TruncateNbr(PercentLeft,3)

			if (CheckElement("!NonSpace(obj.deposit_amt.value) && ((parseFloat(obj.net_percent.value)+parseFloat(Accounts.Hash[Employee.work_country].totalPercent)-parseFloat(Accounts.Hash[Employee.work_country].addBackPercent))>100)",
				getSeaPhrase("DD_466","DD")+" "+PercentLeft+ per +" "+getSeaPhrase("DD_155","DD"),obj,obj.net_percent,true,parent))
					return

			if (CheckElement("!NonSpace(obj.net_percent.value) && !ValidNumber(obj.deposit_amt,12,2) && obj.deposit_amt.value==0",
				getSeaPhrase("DD_156","DD"),obj,obj.deposit_amt,true,parent))
					return

			if (NonSpace(obj.deposit_amt.value))
			{
				FormValues.amt_type = "A"
				FormValues.net_percent = 0
				FormValues.deposit_amt = obj.deposit_amt.value
			}
			else
			{
				FormValues.amt_type = "P"
				FormValues.net_percent = obj.net_percent.value
				FormValues.deposit_amt = 0
			}

			// PT 121559
			if (Rules.partial_ach=="Y" && currentlyNoDefault) {
				if (FormValues.amt_type=="P" && parseFloat(FormValues.net_percent)==100.0 && 
			    (Accts[i].net_percent==0 || parseFloat(Accts[i].net_percent)!=100.0))
					autoDepositFlag = "Y";
				else if (Accts[i].net_percent!=0 && parseFloat(Accts[i].net_percent)==100.0 &&
				(FormValues.amt_type!="P" || parseFloat(FormValues.net_percent)!=100.0))
					autoDepositFlag = "P";
				else
					autoDepositFlag = "";
			}
		}
	}

	/* account number now is read-only
	if (obj.ebnk_acct_nbr)
		FormValues.ebnk_acct_nbr = obj.ebnk_acct_nbr.value
	else */
	FormValues.ebnk_acct_nbr = Accts[i].ebnk_acct_nbr

	if (Employee.work_country == "UK")
	{
		if (obj.account_type_xlt)
			FormValues.account_type_xlt = (obj.account_type_xlt[0].checked)?"Current":"Savings"
		else
			FormValues.account_type_xlt = Accts[i].account_type_xlt
		FormValues.ebank_id = Accts[i].ebank_id
		if (obj.check_desc)
			FormValues.check_desc = obj.check_desc.value
		else
			FormValues.check_desc = Accts[i].check_desc
		if (obj.bank_roll_no)
			FormValues.bank_roll_no = obj.bank_roll_no.value
		else
			FormValues.bank_roll_no = Accts[i].bank_roll_no
		if (obj.payable_to)
			FormValues.payable_to = obj.payable_to.value
		else
			FormValues.payable_to = Accts[i].payable_to	
	}
	else if (Employee.work_country == "CA")
	{
		if (obj.ca_inst_nbr)
			FormValues.ca_inst_nbr = obj.ca_inst_nbr.value
		else
			FormValues.ca_inst_nbr = Accts[i].ca_inst_nbr
		if (obj.ca_transit_nbr)
			FormValues.ca_transit_nbr = obj.ca_transit_nbr.value
		else
			FormValues.ca_transit_nbr = Accts[i].ca_transit_nbr
		if (obj.check_desc)
			FormValues.check_desc = obj.check_desc.value
		else
			FormValues.check_desc = Accts[i].check_desc
	}
	else
	{
		if (obj.account_type_xlt)
			FormValues.account_type_xlt = (obj.account_type_xlt[0].checked)?"Checking":"Savings"
		else
			FormValues.account_type_xlt = Accts[i].account_type_xlt
		FormValues.ebank_id = Accts[i].ebank_id
		if (obj.check_desc)
			FormValues.check_desc = obj.check_desc.value
		else
			FormValues.check_desc = Accts[i].check_desc		
	}

	if (obj.waive_receipt)
	{
		// waive paper check?
		if (obj.waive_receipt[0].checked) // if waiving, print receipt should be "No"
			FormValues.print_rcpt = "1"
		else // if not waiving, print receipt should be "Yes"
			FormValues.print_rcpt = " "
	}
	else
	{
		FormValues.print_rcpt = Accts[i].print_rcpt
	}
	
	FormValues.description = Accts[i].description
	FormValues.ach_dist_nbr = Accts[i].ach_dist_nbr
	FormValues.ach_dist_order = Accts[i].ach_dist_order
	FormValues.beg_date = Accts[i].beg_date
	FormValues.end_date = Accts[i].end_date
	FormValues.default_flag = Accts[i].default_flag
	FormValues.isTouched = true

	if (action == "ChangeDefault")
	{
		OldDefault = FormValues
		OldDefault.default_flag = "N"
		OldDefault.print_rcpt = " "
		OldDefault.saveOrder = OldDefault.ach_dist_order
		if (PrepAccount(OldDefault) && PrepAccount(NewDefault))
		{
			UPDATING = true
			PROCESSDEFCHG = true
			UpdateQueue = new Array()
			UpdateQueue[UpdateQueue.length] = OldDefault
			UpdateQueue[UpdateQueue.length] = NewDefault
			UpdateQueue[UpdateQueue.length] = OldDefault

			if (Rules.notify == "Y" || Rules.notifyee == "Y")
			{
				MailEvent = "Default"
				MailQueue = new Array()
				MailQueue[MailQueue.length] = OldDefaultCopy
				MailQueue[MailQueue.length] = NewDefaultCopy
				MailQueue[MailQueue.length] = OldDefault
				MailQueue[MailQueue.length] = NewDefault
			}
			
			Update(UpdateQueue,0)
			document.getElementById("chgdetail").style.visibility = "hidden";
		}
	}
	else
	{
		if (PrepAccount(FormValues))
		{
			UPDATING = true
			UpdateQueue = new Array()
			UpdateQueue[UpdateQueue.length] = FormValues

			if (Rules.notify == "Y" || Rules.notifyee == "Y")
			{
				MailEvent = "Change"
				MailQueue = new Array()
				MailQueue[MailQueue.length] = Accts[i]
				MailQueue[MailQueue.length] = FormValues
			}
			
			Update(UpdateQueue,0)
			document.getElementById("chgdetail").style.visibility = "hidden";
		}
	}
}

//
//****************************************************************************************//
//				Change Default Record Functions
//****************************************************************************************//
//
// index	.... index of new default account (Accts[index])

function ChangeDefault(index,action)
{
	if (UPDATING)
		return;

	var thisCtry = Accounts.Hash[Employee.work_country]
	var Accts = thisCtry.OpenAccounts

	var FoundDefault = false
	OldDefault = new Object()
	NewDefault = new Object()
	FormValuesCopy = new Object()
	OldDefaultCopy = new Object()
	NewDefaultCopy = new Object()

	if (action == "AddDefault")
	{
		ADDNEWDEFAULT = true
		if (thisCtry.defaultAcctPtr == -1)
			thisCtry.defaultAcctPtr = Accts[index].ach_dist_nbr
		i = index
	}
	else
	{
		// Find the old default account.
		for (var i=0;i<Accts.length;i++)
		{
			if (Accts[i].default_flag == "Y")
			{
				if(!NonSpace(Accts[i].end_date)||(formjsDate(Accts[i].end_date) > ymdtoday))
					{
						FoundDefault = true
						break
					}
			}
		}

		if (thisCtry.openCount == 2)
		{
			// Find the new default account.
			for (var j=0;j<Accts.length;j++)
			{
				if (Accts[j].default_flag == "N")
				{
					if(!NonSpace(Accts[j].end_date)||(formjsDate(Accts[j].end_date) > ymdtoday))
					{
						index = j
						break
					}
				}
			}
		}
	}

	FormValuesCopy = null
	if (FoundDefault)
		SaveAccountInfo(OldDefaultCopy,i)
	else OldDefaultCopy = null
	SaveAccountInfo(NewDefaultCopy,index)

	// If the account to be changed has a net percentage, subtract it from the total
	// distribution percentage, since the new amount will be added in after the
	// database change is effective.
	if (NonSpace(Accts[index].net_percent))
	{
		thisCtry.addBackPercent = Accts[index].net_percent;
	}
	else
	{
		thisCtry.addBackPercent = 0;
	}

	// Make sure the new default account has distribution percentage 100.
	//NewDefault = Accts[index]
	SaveAccountInfo(NewDefault,index)
	NewDefault.default_flag = "Y"
	NewDefault.amt_type = "P"
	NewDefault.deposit_amt = 100
	if (!Accts[index].isNew)
		NewDefault.isNew = false
	else NewDefault.isNew = true
	NewDefault.isTouched = true

	if (action != "AddDefault" && FoundDefault)
	{
		NewDefault.print_rcpt = Accts[i].print_rcpt
		SaveAccountInfo(OldDefault,i)
		OldDefault.default_flag = "N"
		OldDefault.print_rcpt = " "
		if (!Accts[i].isNew)
			OldDefault.isNew = false
		else OldDefault.isNew = true
		OldDefault.isTouched = true
	}

	if (Rules.partial_ach=="Y" && action == "AddDefault")
		autoDepositFlag = "Y";
	else
		autoDepositFlag = "";

	if (action == "AddDefault")
	{
		if (PrepAccount(NewDefault))
		{
			UPDATING = true
			ADDEDACCOUNT = true
			UpdateQueue = new Array()
			UpdateQueue[UpdateQueue.length] = NewDefault

			if (Rules.notify == "Y" || Rules.notifyee == "Y")
			{
				MailEvent = "Add"
				MailQueue = new Array()
				MailQueue[MailQueue.length] = NewDefault
			}
			
			Update(UpdateQueue,0)
		}
	}
	// If we have more than one account, go off the user-selected one.
	else
	{
		// Authorize the user.
		if (Employee.work_country != "UK" && !AUTHORIZED)
			OpenAuthWindow(i,action,"CHG")
		else
		{
			// Proceed to open a window to allow changes to this account.
			PaintChangeWindow(i,action)
		}
	}
}

function ChangeDefaultContents(index,action)
{
	var thisCtry = Accounts.Hash[Employee.work_country]
	var Accts = thisCtry.OpenAccounts

	var arg = '<form name="chgform" onSubmit="return false">'
	+ '<table border="0" cellpadding="0" cellspacing="0" width="100%">'
	+ '<tr><td class="fieldlabelbold" style="text-align:center">'
	+ getSeaPhrase("DD_467","DD")
	+ '</td></tr>'
	+ '</table>'
	+ '<table border="0" cellpadding="0" cellspacing="0" width="100%">'
	
	if (Employee.work_country != "UK" && Accts[index].country_code != "UK")
	{
		Employee.detailWindow = "changedef";
		Employee.detailIndex = index;
		self.chgdetail.document.getElementById("paneHelpIcon").style.visibility = "visible";
	}
	else
	{
		self.chgdetail.document.getElementById("paneHelpIcon").style.visibility = "hidden";
	}

	if (Employee.work_country == "UK" || Accts[index].country_code == "UK")
	{
		arg += '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("DD_136","DD")+'</td><td class="plaintablecelldisplay" nowrap>'+Accts[index].description
		+ '</td></tr><tr><td class="plaintablerowheaderlite">'+getSeaPhrase("DD_37","DD")+'</td><td class="plaintablecelldisplay" nowrap>'+Accts[index].ebank_id
	}
	else if (Employee.work_country == "CA" || Accts[index].country_code == "CA")
	{
		arg += '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("DD_38","DD")+'</td><td class="plaintablecelldisplay" nowrap>' + Accts[index].ca_inst_nbr
		+ '</td></tr><tr><td class="plaintablerowheaderlite">'+getSeaPhrase("DD_39","DD")+'</td><td class="plaintablecelldisplay" nowrap>'+Accts[index].ca_transit_nbr
		+ '</td></tr><tr><td class="plaintablerowheaderlite">'+getSeaPhrase("DD_137","DD")+'</td><td class="plaintablecelldisplay" nowrap>'+Accts[index].description
	}
	else
	{
		arg += '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("DD_138","DD")+'&nbsp;</td><td class="plaintablecelldisplay" nowrap>'+Accts[index].description
		+ '</font></td></tr><tr><td class="plaintablerowheaderlite">'+getSeaPhrase("DD_40","DD")+'</td><td class="plaintablecelldisplay" nowrap>'+Accts[index].ebank_id
	}

	arg += '</td></tr><tr><td class="plaintablerowheaderlite">'+getSeaPhrase("DD_41","DD")+'</td><td class="plaintablecelldisplay" nowrap>'+ Accts[index].ebnk_acct_nbr
	
	if (Employee.work_country == "UK" || Accts[index].country_code == "UK")
	{
		arg += '</td></tr><tr><td class="plaintablerowheaderlite">'+getSeaPhrase("DD_139","DD")+'</td><td class="plaintablecelldisplay" nowrap>'+Accts[index].bank_roll_no	
	}
	
	arg +='</td></tr>'
	+ '<tr><td class="plaintablerowheaderlite"><label for="deposit_amt">'+getSeaPhrase("DD_50","DD")+'</label><td class="plaintablecelldisplay" nowrap>'
	+ '<input class="inputbox" id=deposit_amt type=text name=deposit_amt maxlength=12 size=12>'
	+ '<tr><td class="plaintablerowheaderlite">'+getSeaPhrase("DD_177","DD")+'&nbsp;<td class="plaintablecelldisplay" nowrap>&nbsp;</td>'
	+ '<tr><td class="fieldlabelboldliteunderline"><label for="net_percent">'+getSeaPhrase("DD_51","DD")+'</label><td class="plaintablecelldisplay" nowrap>'
	+ '<input class="inputbox" id=net_percent type=text name=net_percent maxlength=7 size=7></td></tr>'
	+ '<tr><td class="plaintablecelldisplay">&nbsp;</td>'
	+ '<td class="plaintablecell">'
	+ uiButton(getSeaPhrase("DD_141","DD"),"parent.ProcessChange("+index+",'"+action+"');return false")
	+ uiButton(getSeaPhrase("DD_109","DD"),"parent.CancelChangeDetail();return false")
	+ '</td></tr>'
	+ '</table>'
	+ '</form>'

	return arg;
}

function RollBack()
{
	if (!UPDATING)
	{
		if (OldDefaultCopy != null)
			ResetAccountInfo(OldDefaultCopy,OldDefaultCopy.account_index)
		ResetAccountInfo(NewDefaultCopy,NewDefaultCopy.account_index)
		if (FormValuesCopy != null)
			ResetAccountInfo(FormValuesCopy,FormValuesCopy.account_index)
		CloseWindow("CHG")
	}

	DspDeposits("Rollback")
}

function SaveAccountInfo(copyobj,index)
{
	var thisCtry = Accounts.Hash[Employee.work_country]
	var Accts = thisCtry.OpenAccounts

	if (typeof(Accts) == "undefined" || !Accts || !Accts[index])
		return

	if (typeof(Accts[index]) != "undefined")
	{
		copyobj.account_index = index
		copyobj.country_code = Accts[index].country_code
		copyobj.deposit_amt = Accts[index].deposit_amt
		copyobj.net_percent = Accts[index].net_percent
		copyobj.default_flag = Accts[index].default_flag
		copyobj.print_rcpt = Accts[index].print_rcpt
		copyobj.amt_type = Accts[index].amt_type
		copyobj.description = Accts[index].description
		copyobj.ebnk_acct_nbr = Accts[index].ebnk_acct_nbr
		copyobj.ach_dist_nbr = Accts[index].ach_dist_nbr
		copyobj.ach_dist_order = Accts[index].ach_dist_order
		copyobj.beg_date = Accts[index].beg_date
		copyobj.end_date = Accts[index].end_date
		copyobj.check_desc = Accts[index].check_desc
		copyobj.isNew = Accts[index].isNew
		copyobj.isTouched = Accts[index].isTouched

		if (Employee.work_country == "UK")
		{
			copyobj.ebank_id = Accts[index].ebank_id
			copyobj.account_type_xlt = Accts[index].account_type_xlt
			copyobj.bank_roll_no = Accts[index].bank_roll_no
			copyobj.payable_to = Accts[index].payable_to
		}
		else if (Employee.work_country == "CA")
		{
			copyobj.ca_inst_nbr = Accts[index].ca_inst_nbr
			copyobj.ca_transit_nbr = Accts[index].ca_transit_nbr
			
		}
		else
		{
			copyobj.ebank_id = Accts[index].ebank_id
			copyobj.account_type_xlt = Accts[index].account_type_xlt
		}
	}
}

function ResetAccountInfo(copyobj,index)
{
	var thisCtry = Accounts.Hash[Employee.work_country]
	var Accts = thisCtry.OpenAccounts

	if (typeof(Accts) == "undefined" || !Accts || !Accts[index]
	|| typeof(copyobj) == "undefined" || !copyobj)
		return

	if (typeof(copyobj) != "undefined" && typeof(Accts[index]) != "undefined")
	{
		Accts[index].country_code = copyobj.country_code
		Accts[index].deposit_amt = copyobj.deposit_amt
		Accts[index].net_percent = copyobj.net_percent
		Accts[index].default_flag = copyobj.default_flag
		Accts[index].print_rcpt = copyobj.print_rcpt
		Accts[index].amt_type = copyobj.amt_type
		Accts[index].description = copyobj.description
		Accts[index].ebnk_acct_nbr = copyobj.ebnk_acct_nbr
		Accts[index].ach_dist_nbr = copyobj.ach_dist_nbr
		Accts[index].ach_dist_order = copyobj.ach_dist_order
		Accts[index].beg_date = copyobj.beg_date
		Accts[index].end_date = copyobj.end_date
		Accts[index].check_desc = copyobj.check_desc
		Accts[index].isNew = copyobj.isNew
		Accts[index].isTouched = copyobj.isTouched

		if (Employee.work_country == "UK")
		{
			Accts[index].bank_roll_no = copyobj.bank_roll_no
			Accts[index].payable_to = copyobj.payable_to
		}
		else if (Employee.work_country == "CA")
		{
			Accts[index].ca_inst_nbr = copyobj.ca_inst_nbr
			Accts[index].ca_transit_nbr = copyobj.ca_transit_nbr
		}
		else
		{
			Accts[index].ebank_id = copyobj.ebank_id
			Accts[index].account_type_xlt = copyobj.account_type_xlt
		}
	}
}

//
//********************************************************************************************//
// 				Close Record Functions
//********************************************************************************************//
//
var closeAccountIndex = -1;

function CloseAccount(index)
{
	if (UPDATING)
		return;

	if (Employee.work_country != "UK" && !AUTHORIZED)
	{
		OpenAuthWindow(index,"CloseAccount","CLOSE")
		return
	}	
	
	var thisCtry = Accounts.Hash[Employee.work_country]
	var Accts = thisCtry.OpenAccounts

        closeAccountIndex = index;
	msg = getSeaPhrase("DD_94","DD")+" " + Accts[index].description + "?"

	if (parent.seaConfirm(msg, "", FireFoxConfirmClose))
	{
        	ProcessAccountClose(index);
	}
}

function FireFoxConfirmClose(confirmWin)
{
    if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
    {
        ProcessAccountClose(closeAccountIndex);    
    }
}

function ProcessAccountClose(index)
{
	var thisCtry = Accounts.Hash[Employee.work_country]
	var Accts = thisCtry.OpenAccounts
	
	if (Rules.partial_ach == "N" && Accts[index].default_flag == "Y" 
	&& thisCtry.openCount > 1)
	{	
		if (thisCtry.openCount == 2)
		{
			for (var i=0;i<Accts.length;i++)
			{
				if (Accts[i].default_flag != "Y" && (!NonSpace(Accts[i].end_date)||(formjsDate(Accts[i].end_date) > ymdtoday)))
					break
			}
			// Accts[i] is new default account
			CloseDefault(i,index)
		}
		// If we can't deduce the new default account, allow the user to select one.
		else
			DspDeposits("CloseDefault")
	}
	// If the user isn't closing the default account, directly delete it.
	else
	{
		if (Accts[index].default_flag == "Y" && thisCtry.openCount > 1) {
			if (Rules.partial_ach=="Y" && currentlyNo100Percent)
				autoDepositFlag = "P";
			else
				autoDepositFlag = "";
			CloseRecord(index,"CloseDefault")
		} else {
			if (Rules.partial_ach=="Y" && Accts[index].default_flag=="N" && thisCtry.openCount>1) {
				if (currentlyNoDefault && 
				!parseFloat(Accts[index].deposit_amt) && parseFloat(Accts[index].net_percent)==100.0)
					autoDepositFlag = "P";
				else
					autoDepositFlag = "";
			}
			CloseRecord(index)	
		}
	}
}

function CloseRecord(index,action)
{
	UPDATING = true
	var CloseCopy = new Object()
	var thisCtry = Accounts.Hash[Employee.work_country]
	var Accts = thisCtry.OpenAccounts
	Accts[index].end_date = fmttoday
	
	SaveAccountInfo(CloseCopy,index)

	if (Accts[index].default_flag == "Y")
		thisCtry.defaultAcctPtr = -1
	Accts[index].ach_dist_order = 0
	Accts[index].default_flag = "N"
	// print receipt should be "Yes" for a closed account
	Accts[index].print_rcpt = " "
	Accts[index].isTouched = true
	thisCtry.totalPercent -= Accts[index].net_percent
	
	if (Accts[index].deposit_amt == 0 && Accts[index].net_percent != 0)
		Accts[index].amt_type = "P"
	else 
		Accts[index].amt_type = "N"	
		
	SETFLAG = false	
	if (thisCtry.openCount == 1)
		CLEARFLAG = true
	else CLEARFLAG = false	
	
	UpdateQueue = new Array()
	UpdateQueue[UpdateQueue.length] = Accts[index]
	document.getElementById("chgdetail").style.visibility = "hidden";	
	
	if (Rules.notify == "Y" || Rules.notifyee == "Y")
	{
		MailEvent = "Close"
		MailQueue = new Array()
		MailQueue[MailQueue.length] = CloseCopy
	}
	
	Update(UpdateQueue,0,action)
}

function ProcessCloseDefault(new_index,old_index)
{
	if (UPDATING)
		return;
		
	CloseDefault(new_index,old_index);	
}

// Used only when there is more than one account remaining.
// User is closing the default account.  Set another to be the default.
function CloseDefault(new_index,old_index)
{
	var thisCtry = Accounts.Hash[Employee.work_country]
	var Accts = thisCtry.OpenAccounts
	OldDefault = new Object()
	NewDefault = new Object()
	OldDefaultCopy = new Object()
	NewDefaultCopy = new Object()
	
	// Find the old default account.
	if (!old_index)
	{
		for (var i=0;i<Accts.length;i++)
		{
			if (Accts[i].default_flag == "Y")
				break
		}
		var old_index = i
	}
	
	if (Rules.notify == "Y" || Rules.notifyee == "Y")
	{
		SaveAccountInfo(OldDefaultCopy,old_index)
		SaveAccountInfo(NewDefaultCopy,new_index)
		MailQueue = new Array()
		MailQueue[MailQueue.length] = OldDefaultCopy
		MailQueue[MailQueue.length] = NewDefaultCopy
	}
	
	// If the account to be closed has a net percentage, subtract it from the total
	// distribution percentage, since the new amount will be added in after the
	// database change is effective.
	if (NonSpace(Accts[old_index].net_percent))
		thisCtry.totalPercent -= Accts[old_index].net_percent
	
	// Make sure the new default account has distribution percentage 100, since we're in 
	// Full ACH mode.	
	SaveAccountInfo(NewDefault,new_index)	
	NewDefault.default_flag = "Y"
	NewDefault.amt_type = "P"
	NewDefault.deposit_amt = 100
	NewDefault.isTouched = true
	
	SaveAccountInfo(OldDefault,old_index)
	OldDefault.ach_dist_order = 0
	OldDefault.end_date = fmttoday	
	OldDefault.default_flag = "N"
	// print receipt should be "Yes" for a non-default account
	OldDefault.print_rcpt = " "
	OldDefault.amt_type = "P"
	OldDefault.isTouched = true
		
	if (PrepAccount(OldDefault) && PrepAccount(NewDefault))
	{
		UPDATING = true
		PROCESSDEFCHG = true
		UpdateQueue = new Array()
		UpdateQueue[UpdateQueue.length] = OldDefault
		UpdateQueue[UpdateQueue.length] = NewDefault
		document.getElementById("chgdetail").style.visibility = "hidden";
		Update(UpdateQueue,0)			
		
		if (Rules.notify == "Y" || Rules.notifyee == "Y")
		{
			MailEvent = "Default"
			MailQueue[MailQueue.length] = OldDefault
			MailQueue[MailQueue.length] = NewDefault
		}
	}
}

//
//****************************************************************************************//
//				Authorization Screen Functions
//****************************************************************************************//
//
var AuthWind
var AuthWinProps = "toolbar=no,menubar=no,resizable=yes,width=500,height=350,status=no,left="
		+((ScrWidth-510)*.5)+",top="+((ScrHeight-430)*.5)

function OpenAuthWindow(index,action,msg)
{
	PaintAuthWindow(index,action,msg);
}

function PaintAuthWindow(index,action,msg)
{
	if (Employee.work_country != "UK")
	{
		Employee.authIndex = index;
		Employee.detailWindow = "auth";
		self.detail.document.getElementById("paneHelpIcon").style.visibility = "visible";
	}
	else
	{
		self.detail.document.getElementById("paneHelpIcon").style.visibility = "hidden";
	}
	
	var Contents = '<div class="plaintablecell" style="padding-top:5px">'
	
	Contents += getSeaPhrase("DD_96","DD")+' '+Employee.company_name+
	getSeaPhrase("DD_468","DD")+'<P>'+
	getSeaPhrase("DD_100","DD")+' '+Employee.company_name+' '+
	getSeaPhrase("DD_469","DD")+' '+Employee.company_name+' '+
	getSeaPhrase("DD_470","DD")

	Contents += '<P><FORM NAME="auth"><CENTER><TABLE BORDER=0><TR><TD class="plaintablecelldisplay">'
	+ '<INPUT class="input" TYPE="radio" NAME="agree" VALUE="Y" onclick="parent.VerifyAuth('+index+',\''+action+'\',\''+msg+'\')">'
	+ getSeaPhrase("DD_106","DD")+'<TR><TD class="plaintablecelldisplay">'
	+ '<INPUT class="input" TYPE="radio" NAME="agree" VALUE="N" onclick="parent.VerifyAuth('+index+',\''+action+'\',\''+msg+'\')">'
	+ getSeaPhrase("DD_107","DD")+'</TABLE></CENTER></FORM>'
	+ '</div>'
		
	try {
		self.detail.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DD_437","DD");
		self.detail.document.getElementById("paneBody").innerHTML = Contents;
	}
	catch(e) {}

	self.detail.stylePage();
	self.detail.setLayerSizes();
	document.getElementById("detail").style.visibility = "visible";	
}

function VerifyAuth(index,action,msg)
{
	if (self.detail.document.auth.agree[0].checked)
	{
		AUTHORIZED = true
		switch(msg)
		{
			case "QUERY":
				QueryAdd(action)
				break
			case "ADD":
				if (Employee.work_country == "UK") {
					document.getElementById("detail").style.visibility = "hidden";
					PaintUKAddWindow(action)
				} else {	
					PaintAddWindow(action)
				}
				break
			case "CHG":
				document.getElementById("detail").style.visibility = "hidden";
				PaintChangeWindow(index,action)
				break
			case "CLOSE":
				document.getElementById("detail").style.visibility = "hidden";
				CloseAccount(index)
				break
			case "ORDER":
				document.getElementById("detail").style.visibility = "hidden";
				SaveOrder()
				break
			case "ADDDEF":
				document.getElementById("detail").style.visibility = "hidden";
				DspDeposits("AddDefault")
				break
			default:
				break
		}
	}
	else
	{
		document.getElementById("detail").style.visibility = "hidden";
		if (msg == "CHG")
			RollBack()
	}
}

//
//****************************************************************************************//
//			Add Account Query Screen Functions
//****************************************************************************************//
//
var QueryWind
var DescWind
var QueryWinProps = "toolbar=no,menubar=no,resizable=yes,width=500,height=300,status=no,left="
		+((ScrWidth-510)*.5)+",top="+((ScrHeight-330)*.5)
var DescWinProps = "toolbar=no,menubar=no,resizable=yes,width=500,height=300,status=no,left="
		+((ScrWidth-510)*.5)+",top="+((ScrHeight-430)*.5)

function OpenQueryWindow(action,type)
{
	PaintQueryWindow(action,type);	
}

function PaintQueryWindow(action,type)
{
	var msg = ""
	var table = ""
	var navbuttons = '<tr><td class="plaintablecell" style="text-align:right">'
	+ uiButton(getSeaPhrase("DD_108","DD"),"parent.VerifyQuery('"+action+"','"+type+"');return false")
	+ uiButton(getSeaPhrase("DD_109","DD"),"parent.CancelDetail();return false");
	+ '</td></tr>'

	if (type == "Partial")
	{
		msg = getSeaPhrase("DD_111","DD")
		table = '<table border="0" cellspacing="0" cellpadding="0" align="center" style="margin-left:auto;margin-right:auto">'
		+'<tr><td class="plaintablecelldisplay">'
		+'<INPUT class="inputbox" TYPE="radio" NAME="agree" VALUE="Y" onclick="parent.VerifyQuery(\''+action+'\',\''+type+'\')">'
		+getSeaPhrase("DD_55","DD")+'</td></tr>'
		+'<tr><td class="plaintablecelldisplay">'
		+'<INPUT class="inputbox" TYPE="radio" NAME="agree" VALUE="N" onclick="parent.VerifyQuery(\''+action+'\',\''+type+'\')">'
		+getSeaPhrase("DD_56","DD")+'</td></tr>'
		//+navbuttons
		+'</table>'
	}
	else
	{
		msg = getSeaPhrase("DD_112","DD")
		table = '<table border="0" cellspacing="0" cellpadding="0" width="100%">'
		+'<tr><td class="plaintablecell" style="text-align:center">' 
		+'<INPUT class="inputbox" TYPE="text" NAME="nbr" VALUE=0 MAXLENGTH="2" SIZE="2">'
		+'</td></tr>'
		+navbuttons
		+'</table>'
	}

	var strHtml = "";

	strHtml += '<body>'
	
	if (Employee.work_country != "UK") 
	{
		Employee.detailWindow = "query";
		self.detail.document.getElementById("paneHelpIcon").style.visibility = "visible";
	}
	else 
	{
		self.detail.document.getElementById("paneHelpIcon").style.visibility = "hidden";
	}
	
	strHtml += '<center><div class="plaintablecell" style="padding-top:5px">'+msg+'</div></center>'
	strHtml += '<p><form name=query onSubmit="return false">'
	strHtml += table
	strHtml += '</form></body>'
	
	try {
		self.detail.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DEPOSIT_AMT","DD");
		self.detail.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}
	
	self.detail.stylePage();
	self.detail.setLayerSizes();
	document.getElementById("detail").style.visibility = "visible";	
}

function VerifyQuery(action,type)
{
	if (type == "Partial")
	{
		if (!self.detail.document.query.agree[0].checked &&
			!self.detail.document.query.agree[1].checked)
		{
			parent.seaAlert(getSeaPhrase("DD_113","DD"))
			return
		}
	 	if (self.detail.document.query.agree[0].checked)
		{
			if (Rules.company_accts == 1)
			{
				if (Rules.waive_receipt == "Y")
				{
					OpenDescWindow(action)
				}
				else
				{
					AddAccount(action,true)
				}
			}
			else if (Rules.company_accts > 1)
				OpenDescWindow(action)
			else
			{
				parent.seaAlert(getSeaPhrase("DD_462","DD")+'\n'+getSeaPhrase("DD_463","DD"))
				DspDeposits(action)
				document.getElementById("detail").style.visibility = "hidden";
			}	
		}
		else
		{
			ALLOFCHECK = false
			JUSTSETNOFLAG = true
			AddAccount(action)
		}
	}
	else
	{
		var AcctsPlanned = parseFloat(self.detail.document.query.nbr.value)
		if (!isNaN(AcctsPlanned) && AcctsPlanned >0)
		{
			if (AcctsPlanned > Employee.acct_available)
			{
				var querymsg = getSeaPhrase("DD_117","DD")+" "+Employee.acct_available
				if (Employee.acct_available == 1)
					querymsg += " "+getSeaPhrase("DD_118","DD")
				else querymsg += " "+getSeaPhrase("DD_119","DD")
				self.detail.document.query.nbr.focus()
				self.detail.document.query.nbr.select()
				parent.seaAlert(querymsg)
				return
			}
		}
		if (AcctsPlanned == 1)
		{
			if (Rules.waive_receipt == "Y")
			{
				OpenDescWindow(action)		
			}
			else
			{
				AddAccount(action,true)
			}
		}
		else if (AcctsPlanned > 1)
		{
			OpenDescWindow(action)
		}
		else
		{
			self.detail.document.query.nbr.focus()
			self.detail.document.query.nbr.select()
			if (!isNaN(AcctsPlanned) && AcctsPlanned <= 0)
				parent.seaAlert(getSeaPhrase("DD_120","DD"))
			else
				parent.seaAlert(getSeaPhrase("DD_121","DD"))
			return
		}
	}
}

function OpenDescWindow(action)
{
	PaintDescWindow(action);
}

function PaintDescWindow(action)
{
	var strHtml = "";

   	strHtml += '<body>'
   	strHtml += '<form name="defaultacct" onsubmit="return false">'
	strHtml += '<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>'
	
	if (Employee.work_country != "UK")
	{
		Employee.detailWindow = "default";
		self.detail.document.getElementById("paneHelpIcon").style.visibility = "visible";
	}
	else 
	{
		self.detail.document.getElementById("paneHelpIcon").style.visibility = "hidden";
	}
	
	strHtml += '<td class="plaintablecell">'
	strHtml += getSeaPhrase("DD_471","DD") + ' '
	strHtml += getSeaPhrase("DD_472","DD")
	strHtml += '<p>'
	strHtml += getSeaPhrase("DD_473","DD")
	strHtml += '<p>'
	
	if (ALLOFCHECK && Rules.waive_receipt == "Y")
	{
		strHtml += getSeaPhrase("WAIVE_RECEIPT_INSTRUCTIONS","DD")
		strHtml += '<p>'
		strHtml += getSeaPhrase("WAIVE_RECEIPT_CONFIRMATION","DD")
		strHtml += '<ul style="list-style:none">'
		strHtml += '<li><input class="inputbox" type="radio" name="waive_receipt" value="A">'
		strHtml += getSeaPhrase("ACCEPT","DD")
		strHtml += '<br>'
		strHtml += '<li><input class="inputbox" type="radio" name="waive_receipt" value="D">'
		strHtml += getSeaPhrase("DECLINE","DD")
		strHtml += '</ul><p>'
	}
	
	strHtml += getSeaPhrase("DD_131","DD")
	strHtml += '</td></tr>'
	strHtml += '<tr><td class="plaintablecell" style="text-align:right">'
	
	if (ALLOFCHECK && Rules.waive_receipt == "Y")
	{
		strHtml	+= uiButton(getSeaPhrase("DD_108","DD"),"parent.VerifyReceiptSelection('"+action+"');return false")
	}
	else
	{
		strHtml	+= uiButton(getSeaPhrase("DD_108","DD"),"parent.AddAccount('"+action+"',true);return false")
	}
	strHtml	+= uiButton(getSeaPhrase("DD_109","DD"),"parent.CancelDetail();return false")
	strHtml += '</td></tr>'
	strHtml += '</table>'
	strHtml += '</form>'
	strHtml += '</body>'

	try {
		self.detail.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DD_305","DD");
		self.detail.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}
	
	self.detail.stylePage();
	self.detail.setLayerSizes();
	document.getElementById("detail").style.visibility = "visible";	
}

function CancelDetail()
{
	document.getElementById("detail").style.visibility = "hidden";
	self.list.addHelpIcon();
}

function VerifyReceiptSelection(action)
{
	if (!self.detail.document.defaultacct.waive_receipt[0].checked 
	&& !self.detail.document.defaultacct.waive_receipt[1].checked)
	{
		parent.seaAlert(getSeaPhrase("ACCEPT_OR_DECLINE","DD"));
		return;
	}
	
	if (self.detail.document.defaultacct.waive_receipt[0].checked)
	{
		AddAccount(action,true,true);
	}
	else
	{
		AddAccount(action,true,false);
	}
}

//
//****************************************************************************************//
//				Select Window Functions
//****************************************************************************************//
//
var SelectWind
var SelectWinProps = "toolbar=no,menubar=no,resizable=no,scrollbars=yes,width=375,height=425,status=no,left="
		+((ScrWidth-410)*.5)+",top="+((ScrHeight-455)*.5)

function OpenSelectWindow(dmeArray,Title)
{	
	if (navigator.userAgent.indexOf("Mac") != -1) {
		SelectWind = window.open("","SELECT",SelectWinProps)
	}
	else {	
		SelectWind = window.open(SSLLoc,"SELECT",SelectWinProps)
	}
	PaintSelectWindow(dmeArray,Title)
}

function PaintSelectWindow(dmeArray,Title)
{
	with (SelectWind.document)
	{
		open()
		write('<HTML><HEAD>')
		if (typeof(Title) != "undefined" && Title)
			write('<TITLE>'+unescape(Title)+'</TITLE>')
		else
			write('<TITLE>'+getSeaPhrase("DD_448","DD")+'</TITLE>')
		write('<FRAMESET rows="40,*,35" border="0" frameborder="0" onload=opener.SelectContents("'+dmeArray+'")>') 
		write('<FRAME SRC="/lawson/xhrnet/dot.htm" name="HEADER" scrolling="no" marginheight="5" marginwidth="5" title="Header Frame">')
		write('<FRAME SRC="/lawson/xhrnet/dot.htm" name="MAIN" scrolling="auto" marginheight="1" marginwidth="1" title="Main Frame">')
		write('<FRAME SRC="/lawson/xhrnet/dot.htm" name="FOOTER" scrolling=no marginheight=5 marginwidth=5 frameborder=yes title="Footer Frame">')
		write('</FRAMESET>')
		write("</HTML>")
		close()
	}
}

function SelectContents(dmeArray)
{
	var selectData = eval(dmeArray)
	var selectLabels = selectData.Labels
	var selectValues = selectData.Values
	var colWidths = selectData.ColWidths
	var colAlign = selectData.ColAlign
	var hdrContent = new Array()
	var tblContent = new Array()
	var ftrContent = ""
	
	// Create the header content.
	hdrContent[0] = '<html><head>'+
	                '</head><body>'	+
	                '<table width="100%" border="0" cellspacing="0" cellpadding="0">'

	if (selectLabels.length > 0) hdrContent[0] += '<tr>'		

	for (var i=0; i<selectLabels.length; i++)
	{		
		hdrContent[i+1] = '<th align="center" width="'+colWidths[i]+'">'
		+unescape(selectLabels[i])+'<th align="center" width="25">&nbsp;'
	}		
	hdrContent[hdrContent.length] = '</table>'

	// Create the main select table content.
	tblContent[0] = '<html><head>'+
	                '</head><body onload="if(parent.opener.fromTask){parent.opener.parent.removeWaitAlert()}">'+
			'<table width="90%" border="0" cellspacing="0" cellpadding="0">'
		
	for (var i=0; i<selectValues.length; i++)
	{
		if (selectValues[i].length > 0) tblContent[tblContent.length] = '<tr>'
			
		for (var j=0; j<selectValues[i].length; j++)
		{
			if (typeof(selectValues[i][j]) != "undefined" && NonSpace(selectValues[i][j]))
			{	
				tblContent[tblContent.length] =	'<td align="'+colAlign[j]+'" width="'+colWidths[j]+'" nowrap>'
				+ '<a href=javascript:parent.opener.FillBoxes("'+dmeArray+'",'+i+',true)>'
				+ '<b>'+selectValues[i][j]+'</b></a>'
				+ '<td align="center" width="25">&nbsp;'
			}
		}
	}
	tblContent[tblContent.length] = '</table>'

	// Create the footer content.
	ftrContent += '<html><head>'+
	              '</head><body>' +
	              '<center><form>' +
	              '<input type=button value="'+getSeaPhrase("DD_252","DD")+'" onClick="javascript:parent.opener.SelectWind.close()">'+
	              '</form></center>'

	// Write the header content.
	with (SelectWind.HEADER.document)
	{
		open()
		write(hdrContent.join(""))
		close()
	}

	// Write the main table content.
	with (SelectWind.MAIN.document)
	{
		open()
		write(tblContent.join(""))
		close()
	}		
	
	// Write the footer content.
	with (SelectWind.FOOTER.document)
	{
		open()
		write(ftrContent)
		close()
	}
}

function FillBoxes(dmeArray, index, closewin)
{
	var selectData = eval(dmeArray)
	var selectValues = selectData.Values[index]
	var formElements = selectData.FormElements

	for (var i=0; i<formElements.length; i++)
	{
		var textbox = eval(formElements[i])		
		textbox.value = unescape(selectValues[i])
	}

	if (typeof(SelectWind) != "undefined" && !SelectWind.closed)
	{
		if (closewin)	
			SelectWind.close()	
		else SelectWind.blur()
	}
}

function AddLeadingZeros(str)
{
	var retval = ""
	str += ""

	for(var i=0;i<str.length;i++)
	{
		if (str.charAt(i) == " ")
			retval += "0"
		else
			retval += str.charAt(i)
	}
	return retval
}

// begin of PT 98199
// all title, messages in select window, excluding lables for bank fields
var windowTexts;
// bank record assignment object: canadian or us
// see definition of CaBankObject, BankObject in addaccount.js
var BankObj;
// DME returned bank data plus some lables, corresponding form elements and others
// see definition of SelectObject in addaccount.js
var Banks;
// whether the corresponding field is number or not
var isNumber;
function initialization()
{
	if (Employee.work_country == "CA") {
		windowTexts = new Array(getSeaPhrase('DD_453','DD'),
			getSeaPhrase('INSTITUTION','DD'),
			getSeaPhrase('DD_455','DD'));
		BankObj = CaBankObject;
		
		Banks = new SelectObject(getSeaPhrase('DD_160','DD'), 
			getSeaPhrase('DD_161','DD'), getSeaPhrase('INSTITUTION','DD'));
		Banks.FormElements = new Array("self.detail.document.addform.ca_inst_nbr",
			"self.detail.document.addform.ca_transit_nbr",
			"self.detail.document.addform.description");
		Banks.Fields = new Array("ca-inst-nbr", "ca-transit-nbr", "bank-name");
		Banks.FieldTypes = new Array("numeric", "numeric", "alpha");
		Banks.FieldSizes = new Array("4", "5", "30");
		Banks.ColWidths = new Array("23%","21%","56%")
		Banks.ColAlign = new Array("right","right","left")

		// number, number, name
		isNumber = new Array(true, true, false);
	} else {
		BankObj = BankObject;

		if (Employee.work_country == "UK") {
			windowTexts = new Array(getSeaPhrase('DD_456','DD'), 
				getSeaPhrase('DD_35','DD'),
				getSeaPhrase('DD_458','DD'));
			Banks = new SelectObject(getSeaPhrase('DD_158','DD'),
				getSeaPhrase('DD_35','DD'));
		} else {
			windowTexts = new Array(getSeaPhrase('DD_459','DD'), 
				getSeaPhrase('DD_82','DD'),
				getSeaPhrase('DD_461','DD'));
			Banks = new SelectObject(getSeaPhrase('DD_163','DD'), 
				getSeaPhrase('DD_82','DD'));
		}

		Banks.FormElements = new Array("self.detail.document.addform.ebank_id",
			"self.detail.document.addform.description");
		Banks.Fields = new Array("ebank-id", "bank-name");
		Banks.FieldTypes = new Array("numeric", "alpha");
		Banks.FieldSizes = new Array("9", "30");
		Banks.ColWidths = new Array("35%","65%")
		Banks.ColAlign = new Array("right","left")

		// number, name
		isNumber = new Array(true, false);
	}
}

var bankSelectWindow;

function openBankSelectWindow()
{
	initialization();
	openDmeFieldFilter("bankname");
} 

function processField(data, index)
{
	if (isNumber[index])
		// add leading 0s
		return AddLeadingZeros(data);
	else 
		return data;
}

// end of PT 98199

/* Filter Select logic - start */
function performDmeFieldFilterOnLoad(dmeFilter)
{
	switch (dmeFilter.getFieldNm().toLowerCase())
	{
		case "bankname":
			for (var i=0; i < Banks.Fields.length; i++)
			{
				dmeFilter.addFilterField(Banks.Fields[i], Banks.FieldSizes[i], Banks.Labels[i], false, (Banks.FieldTypes[i] == "numeric"));
			}	
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prempbank",
				"pebset1",
				Banks.Fields.join(";"),
				"",
				"",
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;
		default: break;
	}
}

function performDmeFieldFilter(dmeFilter)
{
	switch (dmeFilter.getFieldNm().toLowerCase())
	{
		case "bankname":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prempbank",
			"pebset1",
			Banks.Fields.join(";"),
			"",
			"",
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;
		default: break;
	}
}

function dmeFieldRecordSelected(recIndex, fieldNm)
{
	var selRec = self.jsreturn.record[recIndex];

	switch(fieldNm.toLowerCase())
	{
		case "bankname":
			for (var i=0; i<Banks.FormElements.length; i++)
			{
				// populate corresponding form text box
				var textbox = eval(Banks.FormElements[i]);
				var fldValue = eval("selRec." + Banks.Fields[i].replace(/-/g, "_"));
				textbox.value = processField(fldValue, i);
			}
			break;
		default:
			break;
	}
	try
	{
		filterWin.close();
	} catch(e) {}
}

function getDmeFieldElement(fieldNm)
{
	var fld = [null, null];
	switch(fieldNm.toLowerCase())
	{
		case "bankname":
			if (Banks.FormElements.length > 0)
			{
				var textbox = eval(Banks.FormElements[0]);
				fld = [self.detail, textbox];
			}
			break;
		default:
			break;
	}
	return fld;
}

function drawDmeFieldFilterContent(dmeFilter)
{
	var selectHtml = new Array();
	var dmeRecs = self.jsreturn.record;
	var nbrDmeRecs = dmeRecs.length;
	var fieldNm = dmeFilter.getFieldNm().toLowerCase();

	switch(fieldNm)
	{
		case "bankname":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px"  styler="list">'
			selectHtml[0] += '<tr>'			
			
			for (var j=0; j<Banks.Labels.length; j++)
			{
				selectHtml[0] += '<th style="width:' + Banks.ColWidths[j] +'">' + Banks.Labels[j] + '</th>'
			}
			
			selectHtml[0] += '</tr>'
			
			for (var i=0; i<nbrDmeRecs; i++)
			{
				tmpObj = dmeRecs[i];
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				
				for (var k=0; k<Banks.Fields.length; k++)
				{
					var dmeRec = eval("tmpObj." + Banks.Fields[k].replace(/-/g, "_"));
					var fldAlign = Banks.ColAlign[k];
					selectHtml[i+1] += '<td style="padding-' + fldAlign + ':5px;text-align:' + fldAlign + '" nowrap>'
					selectHtml[i+1] += (dmeRec) ? dmeRec : '&nbsp;'
					selectHtml[i+1] += '</td>';
				}				
				
				selectHtml[i+1] += '</td></tr>'
			}

			if (nbrDmeRecs == 0)
			{
				selectHtml[1] = '<tr class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="' + Banks.Labels.length + '" nowrap>'
				selectHtml[1] += getSeaPhrase("NORECS","ESS");
				selectHtml[1] += '</td></tr>'
			}

			selectHtml[selectHtml.length] = '</table>'
		break;
		default: break;
	}
	dmeFilter.getRecordElement().innerHTML = selectHtml.join("");
	try
	{
		if (typeof(parent.removeWaitAlert) != "undefined")
			parent.removeWaitAlert();
	} catch(e) {}
}

/* Filter Select logic - end */

//
//****************************************************************************************//
//				Update Record Functions
//****************************************************************************************//
//
// This function does all the user's account updating (i.e., it processes all changes/updates
// the user has made) since the last update request.  Careful attention is made to the order
// in which accounts may be updated.  These cases are detailed in the code below.
// Parameters:
// index    .... the index of the account to update in the global Accounts array
// warning  .... true if I want to receive server update warnings, false otherwise
var waitAlertWind = null	// The wait alert window for a showWaitAlert()
var thisQueue = new Array()	// Point to the queue being processed during an AGS call
var WARNING = true		// False when it's desirable to suppress server warnings
var DDON = true			// Always true; enables direct deposit flag option on HR11
var DDOFF = false		// Always false; disables direct deposit flag option on HR11
var LOOP1 = false		// If we need to loop through the queue twice, this is 1st loop
var LOOP2 = false		// Second loop through the update queue
var SHOWALERT = false		// Force the display of the next waitalert
var UPDATING = false		// Remove buttons while updating record(s)
var GOTCOUNTRIES = false

function Update(queue,index,action)
{
	var msg = ""
	var fc = ""
	var evt = ""
	var thisCtry = Accounts.Hash[Employee.work_country]
	index = parseInt(index,10)

	if (index >= queue.length || !queue[index])
	{
		if (CLEARDEFAULTS && queue == thisCtry.DefaultQueue)
		{
			CLEARDEFAULTS = false
			Update(UpdateQueue,0)
			return
		}

		if (ADDNEWDEFAULT) ADDNEWDEFAULT = false

		if (SETORDER)
		{
			if (LOOP1)
			{
				LOOP1 = false
				LOOP2 = true
				Update(queue,0)
				return
			}
			else if (LOOP2)
			{
				LOOP2 = false
				SETORDER = false
			}
		}

		if (PROCESSDEFCHG) PROCESSDEFCHG = false

		// Only clear the Direct Deposit flag on HR11 if the user has closed all accounts.
		if (CLEARFLAG && !SETFLAG)
		{
			SetDepositOption(queue,DDOFF,index,WARNING)
			return
		}

		//if (typeof(AddAccountWind) != "undefined" && typeof(AddAccountWind) != "unknown" && !AddAccountWind.closed)
		//	AddAccountWind.close()

		if (fromTask) {
			alertTimer = setTimeout("parent.showWaitAlert(getSeaPhrase('DD_16','DD'))",3000)
		}
		
		if (action)
			GetAccounts(action,true)
		else
			GetAccounts("Refresh",true)
		return
	}

	// Set the Direct Deposit flag on HR11
	// PT 121559
	// if (SETFLAG && !CLEARFLAG)
	if ((SETFLAG && !CLEARFLAG) || autoDepositFlag!="")
	{
		SetDepositOption(queue,DDON,index,WARNING)
		return
	}

	// UNCOMMENT THIS IF YOU WANT THE HR11 FLAG CLEARED BEFORE THE LAST ACCOUNT IS CLOSED
	// Only clear the Direct Deposit flag on HR11 if the user has closed all accounts.
	//if (CLEARFLAG && !SETFLAG)
	//{
	//	SetDepositOption(queue,DDOFF,index,WARNING)
	//	return
	//}

	if (CLEARDEFAULTS && (PROCESSDEFCHG || ADDNEWDEFAULT))
	{
		if (index == 0 && queue != thisCtry.DefaultQueue)
		{
			Update(thisCtry.DefaultQueue,0)
			return
		}
		else if (index == 0 && queue == thisCtry.DefaultQueue && waitAlertWind && waitAlertWind.closed)
		{
			msg = getSeaPhrase("DD_17","DD")
			if (fromTask) {
				parent.showWaitAlert(msg)
			}
		}
		queue[index].isTouched = true
		queue[index].isNew = false
	}
	else
		CLEARDEFAULTS = false

	if (SETORDER && !CLEARDEFAULTS && !ADDNEWDEFAULT)
	{
		queue[index].isTouched = true
		queue[index].isNew = false
		
		if (index == 0 && !LOOP1 && !LOOP2)
		{
			msg = getSeaPhrase("DD_18","DD")
			if (fromTask) {
				parent.showWaitAlert(msg)
			}
			LOOP1 = true
		}
		else if (LOOP2)
		{
			queue[index].ach_dist_order = queue[index].newOrder
		}
	}

	if (PROCESSDEFCHG && !CLEARDEFAULTS && !ADDNEWDEFAULT && !SETORDER)
	{
		switch(index)
		{
			case 0:
				SHOWALERT = false
				msg = getSeaPhrase("DD_19","DD")+" "+queue[index+1].description+"."
				if (fromTask) {
					parent.showWaitAlert(msg)
				}
				queue[index].ach_dist_order = 0
				break
			case 1:
				queue[index].default_flag = "Y"
				queue[index].amt_type = "P"
				queue[index].net_percent = 100
				queue[index].deposit_amt = 0
				break
			case 2:
				queue[index].ach_dist_order = queue[index].saveOrder
				delete queue[index].saveOrder
				break
			default:
		}
	}
	else if (queue[index].default_flag == "Y" && Rules.partial_ach != "N" && index == 0)
		msg = getSeaPhrase("DD_19","DD")+" "+queue[index].description+"."
				
	if (queue[index].isNew)
	{
		//alert("Account is NEW")
		evt = "ADD"
		fc = "A"
		if (!PROCESSDEFCHG && !ADDNEWDEFAULT)
			msg = getSeaPhrase("DD_20","DD")+" " + queue[index].description + "."
	}
	// This account has been changed but is not new.
	else // if (queue[index].isTouched)
	{
		//alert("Account is TOUCHED")
		evt = "CHANGE"
		fc = "C"
		act = (NonSpace(queue[index].end_date)||queue[index].ach_dist_order==0)?"DD_21":"DD_22"
		if (!SETORDER && !PROCESSDEFCHG && !ADDNEWDEFAULT)
			msg = getSeaPhrase(act,"DD") + " " + queue[index].description + "."
	}

	if (((waitAlertWind && waitAlertWind.closed) || SHOWALERT) && msg != "")
	{
		SHOWALERT = false
		if (fromTask) {
			parent.showWaitAlert(msg)
		}
	}

	UpdateAccount(queue,index,evt,fc,WARNING,action) // Perform the update for this account.
}

function FmtAmt(Num)
{
	var Val = parseFloat(Num)

	if (isNaN(Val))
		return "0"
	else
	{
		if (Val.toString().charAt(0) == ".")
			Val = "0" + Val
	}
	return Val
}

// Construct the call to update the database with the new info for this account.
// Parameters:
// index 	.... the index of the account to update (Accounts[index])
// evt		.... "CHG","ADD"
// fc		.... "C","A","D"
// warning  .... false to supress server warnings
function UpdateAccount(queue,index,evt,fc,warning,action)
{
	thisQueue = queue

	var ddObj 	= new AGSObject(prodline, "PR12.1")
	ddObj.event 	= evt
	ddObj.rtn 	= "MESSAGE"
	ddObj.longNames = "ALL"
	ddObj.tds	= false
	ddObj.field 	= "FC=" + fc
	+ "&EAD-COMPANY=" + escape(company)
	+ "&EAD-EMPLOYEE=" + escape(employee)
	+ "&EAD-ACH-DIST-NBR=" + escape(parseInt(queue[index].ach_dist_nbr,10))
	+ "&EAD-ACH-DIST-ORDER=" + escape(parseInt(queue[index].ach_dist_order,10))
	+ "&EAD-COUNTRY-CODE=" + escape(queue[index].country_code)
	+ "&ACCESS-BY-NBR=Y"
	+ "&WEB-UPDATE=Y"

	if (Employee.work_country == "CA")
	{
		ddObj.field += "&CA-EAD-DEFAULT-FLAG=" + escape(queue[index].default_flag)
		+ "&CA-EAD-DESCRIPTION=" + escape(queue[index].description)
		+ "&CA-EAD-TRANSIT-NBR=" + escape(queue[index].ca_transit_nbr)
		+ "&CA-EAD-INST-NBR=" + escape(queue[index].ca_inst_nbr)
		+ "&CA-EAD-CHECK-DESC=" + escape(queue[index].check_desc)
		+ "&CA-EAD-BEG-DATE=" + escape(formjsDate(queue[index].beg_date))

		if (NonSpace(queue[index].end_date))
			ddObj.field += "&CA-EAD-END-DATE=" + escape(formjsDate(queue[index].end_date))
		else
			ddObj.field += "&CA-EAD-END-DATE=00000000"

		if (typeof(queue[index].ebnk_acct_nbr) != "undefined")
			ddObj.field += "&CA-EAD-EBNK-ACCT-NBR=" + escape(queue[index].ebnk_acct_nbr)

		if (typeof(queue[index].amt_type) != "undefined")
		{
			if (queue[index].amt_type == "P")
			{
				ddObj.field += "&CA-EAD-NET-PERCENT=" + escape(FmtAmt(queue[index].net_percent))
				+ "&CA-EAD-DEPOSIT-AMT=0"
			}
			else
			{
				ddObj.field += "&CA-EAD-NET-PERCENT=0"
				+ "&CA-EAD-DEPOSIT-AMT=" + escape(FmtAmt(queue[index].deposit_amt))
			}
		}
		else
		{
			if (queue[index].deposit_amt == 0 && queue[index].net_percent != 0)
			{
				ddObj.field += "&CA-EAD-NET-PERCENT=" + escape(FmtAmt(queue[index].net_percent))
				+ "&CA-EAD-DEPOSIT-AMT=0"
			}
			else
			{
				ddObj.field += "&CA-EAD-NET-PERCENT=0"
				+ "&CA-EAD-DEPOSIT-AMT=" + escape(FmtAmt(queue[index].deposit_amt))
			}
		}

		if (queue[index].isNew)
		{
			for (var i=1; i<10; i++)
			{
				cycle_obj = eval('Rules.alphadata1_' + i)
				if (!NonSpace(cycle_obj)) cycle_obj = " "
				ddObj.field += "&CA-EAD-DED-CYCLE"+i+"=" + escape(cycle_obj)
			}
		}
	}
	else
	{
		ddObj.field += "&EAD-DEFAULT-FLAG=" + escape(queue[index].default_flag)
		+ "&EAD-DESCRIPTION=" + escape(queue[index].description)
		+ "&EAD-EBANK-ID=" + escape(queue[index].ebank_id)

		if (Employee.work_country == "UK")
		{
			ddObj.field += "&EAD-CHECK-DESC=" + escape(queue[index].check_desc)
			+ "&EAD-BANK-ROLL-NO=" + escape(queue[index].bank_roll_no)
			+ "&EAD-PAYABLE-TO=" + escape(queue[index].payable_to)
		}
		else
		{
			//PT 160314
			ddObj.field += "&EAD-CHECK-DESC=" + escape(queue[index].check_desc)
		}
		
		ddObj.field += "&EAD-BEG-DATE=" + escape(formjsDate(queue[index].beg_date))
		+ "&EAD-COUNTRY-CODE=" + escape(queue[index].country_code)

		if (NonSpace(queue[index].end_date))
			ddObj.field += "&EAD-END-DATE=" + escape(formjsDate(queue[index].end_date))
		else
			ddObj.field += "&EAD-END-DATE=00000000"

		if (typeof(queue[index].ebnk_acct_nbr) != "undefined")
			ddObj.field += "&EAD-EBNK-ACCT-NBR=" + escape(queue[index].ebnk_acct_nbr)

		if (typeof(queue[index].account_type_xlt) != "undefined")
			ddObj.field += "&EAD-ACCOUNT-TYPE=" + escape(queue[index].account_type_xlt)

		if (typeof(queue[index].amt_type) != "undefined")
		{
			if (queue[index].amt_type == "P")
			{
				ddObj.field += "&EAD-NET-PERCENT=" + escape(FmtAmt(queue[index].net_percent))
				+ "&EAD-DEPOSIT-AMT=0"
			}
			else
			{
				ddObj.field += "&EAD-NET-PERCENT=0"
				+ "&EAD-DEPOSIT-AMT=" + escape(FmtAmt(queue[index].deposit_amt))
			}
		}
		else
		{
			if (queue[index].deposit_amt == 0 && queue[index].net_percent != 0)
			{
				ddObj.field += "&EAD-NET-PERCENT=" + escape(FmtAmt(queue[index].net_percent))
				+ "&EAD-DEPOSIT-AMT=0"
			}
			else
			{
				ddObj.field += "&EAD-NET-PERCENT=0"
				+ "&EAD-DEPOSIT-AMT=" + escape(FmtAmt(queue[index].deposit_amt))
			}
		}

		if (queue[index].isNew)
		{
			for (var i=1; i<10; i++)
			{
				cycle_obj = eval('Rules.alphadata1_' + i)
				if (!NonSpace(cycle_obj)) cycle_obj = " "
				ddObj.field += "&EAD-DED-CYCLE"+i+"=" + escape(cycle_obj)
			}
		}
//PT 156373
		else if (NonSpace(queue[index].end_date)&&(formjsDate(queue[index].end_date) <= ymdtoday))
		{
			for (var i=1; i<10; i++)
			{
				ddObj.field += "&EAD-DED-CYCLE"+i+"=" + escape(" ")
			}
		}
	}

	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "9.0.1")
	{
		ddObj.field += "&EAD-PRINT-RCPT=" + escape(queue[index].print_rcpt);
		ddObj.field += "&EAD-USER-ID=W" + escape(employee);
	}

	if (!warning)
		ddObj.field += "&EAD-PERCENT-XMIT-NBR=1"

	if (action)
		ddObj.func = "parent.UpdateReturnMsg("+index+",'"+evt+"','"+fc+"','"+action+"')"
	else
		ddObj.func = "parent.UpdateReturnMsg("+index+",'"+evt+"','"+fc+"')"

	ddObj.debug = false
	AGS(ddObj,"jsreturn")
}

// Handle any messages coming back from the server update call.  Continue to
// process modified accounts until we reach the end of the list.
function UpdateReturnMsg(index,evt,fc,action)
{
	var thisCtry = Accounts.Hash[Employee.work_country]

	if (self.lawheader.gmsgnbr == "000" || self.lawheader.gmsgnbr == "100")
	{
		thisQueue[index].isNew = false
		thisQueue[index].isTouched = false

		if (index+1 == thisQueue.length)
		{
			if (CLEARDEFAULTS && thisQueue == thisCtry.DefaultQueue)
			{
				CLEARDEFAULTS = false
				Update(UpdateQueue,0)
				return
			}

			if (ADDNEWDEFAULT) ADDNEWDEFAULT = false

			if (SETORDER)
			{
				if (LOOP1)
				{
					LOOP1 = false
					LOOP2 = true
					Update(thisQueue,0)
					return
				}
				else if (LOOP2)
				{
					LOOP2 = false
					SETORDER = false
				}
			}

			if (PROCESSDEFCHG) PROCESSDEFCHG = false

			// Only clear the Direct Deposit flag on HR11 if the user has closed all accounts.
			if (CLEARFLAG && !SETFLAG)
			{
				SetDepositOption(thisQueue,DDOFF,index,WARNING)
				return
			}

			//if (typeof(AddAccountWind) != "undefined" && typeof(AddAccountWind) != "unknown" && !AddAccountWind.closed)
			//	AddAccountWind.close()

			if (fromTask) {
				alertTimer = setTimeout("parent.showWaitAlert(getSeaPhrase('DD_16','DD'))",3000)
			}
			
			if (action)
				GetAccounts(action,true)
			else
				GetAccounts("Refresh",true)
		}
		else
			Update(thisQueue,index+1)
	}
	else if (self.lawheader.gmsg.toUpperCase().indexOf("WARNING") != -1)
	{
		UpdateAccount(thisQueue,index,evt,fc,!WARNING)
	}
	else
	{
		UPDATING = false
		if (fromTask) {
			parent.removeWaitAlert()
		}
		var catchEdit = false
		var addWinExists;
		if (document.getElementById("detail").style.visibility == "visible"
		&& self.detail.document.addform) {
			addWinExists = true
		}	
		else {
			addWinExists = false
		}
		
		switch(self.lawheader.gmsgnbr)
		{
			case "601":
				if (addWinExists)
				{
					parent.seaAlert(self.lawheader.gmsg)
					self.detail.document.addform.ebank_id.focus()
					self.detail.document.addform.ebank_id.select()
					catchEdit = true
				}
				break;
			case "602":
				if (addWinExists)
				{
					parent.seaAlert(self.lawheader.gmsg)
					self.detail.document.addform.ebank_id.focus()
					self.detail.document.addform.ebank_id.select()
					catchEdit = true
				}
				break;
			case "603":
				if (addWinExists)
				{
					parent.seaAlert(self.lawheader.gmsg)
					self.detail.document.addform.ebank_id.focus()
					self.detail.document.addform.ebank_id.select()
					catchEdit = true
				}
				break;
			case "604":
				if (addWinExists)
				{
					parent.seaAlert(getSeaPhrase("DD_523","DD"))
					self.detail.document.addform.ebnk_acct_nbr.focus()
					self.detail.document.addform.ebnk_acct_nbr.select()
					catchEdit = true
				}
				break;				
			case "606":
				if (addWinExists)
				{		
					catchEdit = true
				}
				break;				
			case "607":
				if (addWinExists)
				{
					parent.seaAlert(self.lawheader.gmsg)
					self.detail.document.addform.ebnk_acct_nbr.focus()
					self.detail.document.addform.ebnk_acct_nbr.select()
					catchEdit = true
				}
				break;
			case "608":
				if (addWinExists)
				{
					parent.seaAlert(self.lawheader.gmsg)
					self.detail.document.addform.ebnk_acct_nbr.focus()
					self.detail.document.addform.ebnk_acct_nbr.select()
					catchEdit = true
				}
				break;
		}

		if (!catchEdit)
		{
			var act = (NonSpace(thisQueue[index].end_date)||thisQueue[index].ach_dist_order==0)?"closing":fc.toLowerCase()
			if (act == "c") act = "DD_27"
			else if (act == "a") act = "DD_26"
			parent.seaAlert(getSeaPhrase(act,"DD")+" " + thisQueue[index].description + ".\n\n" + self.lawheader.gmsg + ".")
		}
	}
}

// This function makes the appropriate modification(s) to an account found in global array
// Accounts.  Must be called for each account that has been modified prior to calling UpdateAll()
// so that the server call gets all the updated account information.
function PrepAccount(acct)
{
	var msg = "CHG"
	var thisCtry = Accounts.Hash[Employee.work_country]

	if (acct.isNew && !acct.isTouched)
	{
		if ((freeOrderPtr >= AchOrderNbrFree.length || maxOrderPtr > MAXACCOUNTS || maxDistPtr >= MAXACCOUNTS) && thisCtry.acctAvailable == 0)
		{
			var alertmsg = getSeaPhrase("DD_28","DD")+"\n"

			if (maxDistPtr >= MAXACCOUNTS)
				alertmsg += getSeaPhrase("DD_29","DD")+"\n"
			alertmsg += getSeaPhrase("DD_30","DD")+"\n"
			alertmsg += getSeaPhrase("DD_24","DD")+"\n"

			parent.seaAlert(alertmsg)
			return false
		}

		// Assuming we've grabbed all accounts, we know the largest ACH distribution number used by
		// an account, so give this new account the next sequential number, mimicing PR12.
		if (maxDistPtr < MAXACCOUNTS)
		{
			maxDistPtr++
		}
		else
		{
			for (var i=1;i<=MAXACCOUNTS;i++)
			{
				if(AchDistNbrFree[i] == true)
					maxDistPtr = i
			}	
		}

		// Grab the next available order number of least value for this new account.
		for (var j=freeOrderPtr;j<AchOrderNbrFree.length;j++)
		{
			if (AchOrderNbrFree[j])
			{
				freeOrderPtr = j+1
				break
			}
		}

		var AchOrder = j
		AchOrderNbrFree[AchOrder] = false

		acct.ach_dist_nbr = maxDistPtr
		acct.ach_dist_order = AchOrder
		acct.beg_date = fmttoday

		if (!CLEARFLAG && Rules.partial_ach=="N" &&
			(thisCtry.defaultAcctPtr == -1 || acct.default_flag == "Y"))
		{
			thisCtry.defaultAcctPtr = acct.ach_dist_nbr
		}
		msg = "ADD"
	}

	if (acct.amt_type == "P")
	{
		if (acct.deposit_amt != 0)
		{
			acct.net_percent = acct.deposit_amt
			acct.deposit_amt = 0
		}
	}
	else
	{
		if (acct.net_percent != 0)
		{
			acct.deposit_amt = acct.net_percent
			acct.net_percent = 0
		}
	}

	// Any account we are updating must have a country code equal to the
	// employee's work country.
	acct.country_code = Employee.work_country

	return true
}

// Either clear or set the Direct Deposit flag on the main employee record, signaling no
// open direct deposit accounts exist, or the user is about to add a first account, respectively.
function SetDepositOption(queue,opt,index,warning)
{
	var msg, flag
	thisQueue = queue

	if (opt)
	{
		msg = "DD_31"

		// PT 121559
		// flag = (Rules.partial_ach=="N")?"Y":"P"
		if (Rules.partial_ach=="N")
			flag = "Y"
		else {
			if (autoDepositFlag == "")
				flag = "P"
			else {
				flag = autoDepositFlag
				autoDepositFlag = ""
			}
		}
		
		SETFLAG = false
	}
	else
	{
		msg = "DD_32"
		flag = "N"
		CLEARFLAG = false
	}
	
	if (fromTask) {
		parent.showWaitAlert(getSeaPhrase(msg,"DD"))
	}
	
	var ddObj = new AGSObject(prodline, "HR11.1")
	ddObj.event = "CHANGE"
	ddObj.rtn = "MESSAGE"
	ddObj.longNames = "ALL"
	ddObj.tds = false
	ddObj.field = "FC=C"
		+ "&EFFECT-DATE=" + escape(ymdtoday)
		+ "&EMP-COMPANY=" + escape(company)
		+ "&EMP-EMPLOYEE=" + escape(employee)
		+ "&EMP-AUTO-DEPOSIT=" + escape(flag)
		+ "&XMIT-HREMP-BLOCK=1000000000"
		+ "&XMIT-REQDED=1";
	ddObj.func = "parent.OptionReturnMsg("+index+","+opt+","+warning+")"
	ddObj.debug = false
	AGS(ddObj,"jsreturn")
}

// Handle any messages coming back from setting the default flag on HR11.
// If no errors, continue where we left off in the update process.
function OptionReturnMsg(index,opt,warning)
{
	// PT 133367
	// if (self.lawheader.gmsgnbr == "000")
	if (self.lawheader.gmsgnbr == "000" || self.lawheader.gmsgnbr == "050")
	{
		// PT 133367
		if (self.lawheader.gmsgnbr == "050" && self.lawheader.gmsg == "Field is required") {
			var msg = (opt)?"DD_33":"DD_34"
			parent.seaAlert(getSeaPhrase(msg,"DD")+"\n\n" + self.lawheader.gmsg +".")
		}
		SHOWALERT = true
		Update(thisQueue,index,"")
		return
	}
	else
	{
		if (fromTask) {
			parent.removeWaitAlert()
		}
		var msg = (opt)?"DD_33":"DD_34"
		UPDATING = false
		parent.seaAlert(getSeaPhrase(msg,"DD")+"\n\n" + self.lawheader.gmsg +".")
		// PT118859: refresh display when an error is encountered updating the HR11.1 flag.
		// This re-synchs the global flags with the database.
		GetAccounts();	
	}
}

// Displays account info for email message.  Valid fields are:
// ach-dist-nbr;ach-dist-order;ebank-id;ebnk-acct-nbr;account-type,xlt;
// net-percent;deposit-amt;description;check-desc;beg-date;end-date;default-flag;
// account-type;ded-cycle;employee.ach-dist-nbr;employee.auto-deposit;
// payable-to;bank-roll-no
function WriteAccount(acct)
{
	if (typeof(acct) == "undefined" || acct == null || !acct)
		return ""

	var Info = ""

	if (Employee.work_country == "UK")
	{
		Info += getSeaPhrase("DD_35","DD")+": "+acct.description+"\n"
	}
	else
	{
		Info += getSeaPhrase("DD_36","DD")+": "+acct.description+"\n"
	}

	if (Employee.work_country == "UK" || acct.country_code == "UK")
	{
		Info += getSeaPhrase("DD_37","DD")+": "+maskDigits(acct.ebank_id, "x", 4)+"\n"
	}
	else if (Employee.work_country == "CA" || acct.country_code == "CA")
	{
		Info += getSeaPhrase("DD_38","DD")+": "+maskDigits(acct.ca_inst_nbr, "x", 4)+"\n"
		+ getSeaPhrase("DD_39","DD")+": "+maskDigits(acct.ca_transit_nbr, "x", 4)+"\n"
	}
	else
	{
		Info += getSeaPhrase("DD_40","DD")+": "+maskDigits(acct.ebank_id, "x", 4)+"\n"
	}

	Info +=  getSeaPhrase("DD_41","DD")+": "+maskDigits(acct.ebnk_acct_nbr, "x", 4)+"\n"

	if (Employee.work_country == "UK" || acct.country_code == "UK")
	{
		Info += getSeaPhrase("DD_42","DD")+": "+maskDigits(acct.bank_roll_no, "x", 4)+"\n"
	}

	Info +=  getSeaPhrase("DD_43","DD")+": "+acct.ach_dist_order+"\n"

	if (Employee.work_country != "UK")
	{
		Info +=  getSeaPhrase("DD_44","DD")+": "
		if (acct.net_percent != 0)
			Info += TruncateNbr(acct.net_percent,3)+ per +" \n"
		else Info += TruncateNbr(acct.deposit_amt,2)+"\n"
	}

	if (Employee.work_country == "UK" || acct.country_code == "UK")
	{
		Info += getSeaPhrase("DD_45","DD")+": "
		if (acct.account_type_xlt.charAt(0) == "C")
			Info += getSeaPhrase("DD_46","DD")+"\n"
		else Info += getSeaPhrase("DD_47","DD")+"\n"
		Info += getSeaPhrase("DD_48","DD")+": "+acct.check_desc+"\n"
		+ getSeaPhrase("DD_49","DD")+": "

		if (NonSpace(acct.payable_to))
			Info += acct.payable_to+"\n"
		else
			Info += Employee.first_name+" "+Employee.last_name+"\n"

		if (acct.deposit_amt == 0)
			Info += getSeaPhrase("DD_50","DD")+": 0.00\n"
		else
			Info += getSeaPhrase("DD_50","DD")+": "+TruncateNbr(acct.deposit_amt,2)+"\n"
		if (acct.net_percent == 0)
			Info += getSeaPhrase("DD_51","DD")+": 0.000"+ per +" \n"
		else
			Info += getSeaPhrase("DD_51","DD")+": "+TruncateNbr(acct.net_percent,3)+ per +" \n"
	}
	else if (Employee.work_country == "CA" || acct.country_code == "CA")
	{
		Info += getSeaPhrase("DD_52","DD")+": "+acct.check_desc+"\n"
	}
	else
	{
		Info += getSeaPhrase("DD_45","DD")+": "
		if (acct.account_type_xlt.charAt(0) == "C")
			Info += getSeaPhrase("DD_53","DD")+"\n"
		else Info += getSeaPhrase("DD_47","DD")+"\n"
	}

	Info += getSeaPhrase("DD_54","DD")+": "
	if (acct.default_flag == "Y")
		Info += getSeaPhrase("DD_55","DD")+"\n"
	else Info += getSeaPhrase("DD_56","DD")+"\n"

	if (Employee.work_country == "UK" || acct.country_code == "UK")
	{
		Info += getSeaPhrase("DD_57","DD")+": "
	}
	else
	{
		Info += getSeaPhrase("DD_58","DD")+": "
	}
	Info += acct.beg_date+"\n"

	if (NonSpace(acct.end_date))
		Info += getSeaPhrase("DD_59","DD")+": "+fmttoday+"\n"
	Info += "\n"

	return Info
}

function SendEmail(To,From,Type,MQueue,Frame,Alert)
{
	var TitleStr, AddStr, ChgStr, CloseStr, DefaultStr1, DefaultStr2, ReorderStr

	if (Employee.work_country == "UK")
	{
		TitleStr = getSeaPhrase("DD_60","DD")+"\n\n"
		AddStr = getSeaPhrase("DD_61","DD")+".\n\n"
		ChgStr = getSeaPhrase("DD_62","DD")+".\n\n"
		CloseStr = getSeaPhrase("DD_63","DD")+".\n\n"
		DefaultStr1 = getSeaPhrase("DD_64","DD")+".\n"
		DefaultStr2 = ""
		ReorderStr = getSeaPhrase("DD_65","DD")+".\n\n"
	}
	else
	{
		TitleStr = getSeaPhrase("DD_66","DD")+"\n\n"
		AddStr = getSeaPhrase("DD_524","DD")+":\n\n"
		ChgStr = getSeaPhrase("DD_525","DD")+":\n\n"
		CloseStr = getSeaPhrase("DD_526","DD")+":\n\n"
		DefaultStr1 = getSeaPhrase("DD_527","DD")+":\n\n"
		DefaultStr2 = getSeaPhrase("DD_70","DD")+"\n"
		ReorderStr = getSeaPhrase("DD_528","DD")+":\n\n"
	}

	var Msg = TitleStr
	+ getSeaPhrase("COMPANY","DD")+": "+company+"\n"
	+ getSeaPhrase("EMPLOYEE_NUMBER","DD")+": "+employee+"\n"
	+ getSeaPhrase("EMPLOYEE_NAME","DD")+": "+Employee.label_name_1+"\n"
	+ getSeaPhrase("PROCESS_LEVEL","DD")+": "+Employee.process_level_name+"\n\n"
	
	if (Type == "Add")
	{
		Msg += AddStr
		+ WriteAccount(MQueue[0])
	}
	else if (Type == "Close")
	{
		Msg += CloseStr
		+ WriteAccount(MQueue[0])
	}
	else if (Type == "Default")
	{
		Msg += DefaultStr1
		if (NonSpace(MQueue[2].end_date))
			Msg += DefaultStr2
		Msg += "\n"
		+ getSeaPhrase("DD_71","DD")+":\n"
		+ getSeaPhrase("DD_73","DD")+"\n\n"
		+ WriteAccount(MQueue[0])
		+ getSeaPhrase("DD_74","DD")+"\n\n"
		+ WriteAccount(MQueue[1])
		+ getSeaPhrase("DD_72","DD")+":\n"
		+ getSeaPhrase("DD_77","DD")+"\n\n"
		+ WriteAccount(MQueue[2])
		+ getSeaPhrase("DD_78","DD")+"\n\n"
		+ WriteAccount(MQueue[3])
	}
	else if (Type == "Reorder")
	{
		Msg += ReorderStr
		+ getSeaPhrase("DD_71","DD")+":\n"
		+ getSeaPhrase("DD_75","DD")+"\n\n"
		for (var i=0;i<MQueue.length/2;i++)
			Msg += WriteAccount(MQueue[i])
		Msg += getSeaPhrase("DD_72","DD")+":\n"
		+ getSeaPhrase("DD_76","DD")+"\n\n"
		for (var i=MQueue.length/2;i<MQueue.length;i++)
			Msg += WriteAccount(MQueue[i])
	}
	else // Type == "Change"
	{
		Msg += ChgStr
		+ getSeaPhrase("DD_71","DD")+":\n\n"
		+ WriteAccount(MQueue[0])
		+ getSeaPhrase("DD_72","DD")+":\n\n"
		+ WriteAccount(MQueue[1])
	}	

	if (Rules.notifyee == "Y" && To == Rules.email_address && From == Employee.email_address
	&& (typeof(From) == "undefined" || !From))
	{
		Msg += getSeaPhrase("DD_529","DD")
	}

	SendMsg(To,From,Msg,Type,Frame,Alert)
}

function SendMsg(To,From,Msg,Type,Frame,Alert)
{
	var Desc = getSeaPhrase("DD_81","DD")
	var Subj = (Employee.work_country == "UK")?getSeaPhrase("DD_82","DD")+" ":getSeaPhrase("DD_83","DD")+" "

	if (typeof(To) == "undefined" || To == null || NonSpace(To)==0 || To==""
	|| typeof(Msg) == "undefined" || Msg == null || NonSpace(Msg)==0 || Msg=="")
		return

	if (typeof(From) == "undefined" || From == null || NonSpace(From)==0 || From=="")
		From = To

	if (Type == "Add")
		Desc = getSeaPhrase("DD_84","DD")
	else if (Type == "Change")
		Desc = getSeaPhrase("DD_85","DD")
	else if (Type == "Close")
		Desc = getSeaPhrase("DD_86","DD")
	else if (Type == "Default")
		Desc = getSeaPhrase("DD_87","DD")
	else if (Type == "Reorder")
		Desc = getSeaPhrase("DD_88","DD")

	if (Alert)
	{
		if (fromTask) {
			parent.showWaitAlert(getSeaPhrase("DD_89","DD")+" "+Desc.toLowerCase()+".")
		}
	}

	var ddObj = new EMAILObject(To,From)
	ddObj.subject = Subj+Desc
	ddObj.message = Msg;	
	EMAIL(ddObj,Frame)
}

function cgiEmailDone()
{
}

function AddBankRecord(index)
{
	UPDATING = true
	var ddObj 	= new AGSObject(prodline, "PR12.4")
	ddObj.event 	= "CHANGE"
	ddObj.rtn 	= "MESSAGE"
	ddObj.longNames = "ALL"
	ddObj.tds	= false
	ddObj.field 	= "FC=C"
	+ "&LINE-FC1=A"
	+ "&PEB-EBANK-ID1=" + escape(thisQueue[index].ebank_id)
	+ "&PEB-BANK-NAME1=" + escape(thisQueue[index].description)
	+ "&PEB-CA-INST-NBR1=0"
	+ "&PEB-CA-TRANSIT-NBR1=0"

	if (typeof(thisQueue[index].bank_addr1) != "undefined")
		ddObj.field += "&PEB-ADDR11=" + escape(thisQueue[index].bank_addr1)

	if (typeof(thisQueue[index].bank_addr2) != "undefined")
		ddObj.field += "&PEB-ADDR21=" + escape(thisQueue[index].bank_addr2)

	if (typeof(thisQueue[index].bank_addr3) != "undefined")
		ddObj.field += "&PEB-ADDR31=" + escape(thisQueue[index].bank_addr3)

	if (typeof(thisQueue[index].bank_addr4) != "undefined")
		ddObj.field += "&PEB-ADDR41=" + escape(thisQueue[index].bank_addr4)

	if (typeof(thisQueue[index].postal_code) != "undefined")
		ddObj.field += "&PEB-ZIP1=" + escape(thisQueue[index].postal_code)

	if (typeof(thisQueue[index].bank_cntry) != "undefined")
		ddObj.field += "&PEB-COUNTRY-CODE1=" + escape(thisQueue[index].bank_cntry)

	ddObj.dtlField = "LINE-FC;PEB-EBANK-ID;PEB-BANK-NAME;PEB-CA-INST-NBR;PEB-CA-TRANSIT-NBR;PEB-ADDR1;PEB-ADDR2;"
	+ "PEB-ADDR3;PEB-ADDR4;PEB-ZIP;PEB-COUNTRY-CODE";
	
	ddObj.func = "parent.PrEmpBankReturnMsg("+index+")"
	ddObj.debug = false
	AGS(ddObj,"jsreturn")
}

function PrEmpBankReturnMsg(index)
{
	if (self.lawheader.gmsgnbr == "000")
	{
		Update(thisQueue,0)
	}
	else
	{
		UPDATING = false
		parent.seaAlert(getSeaPhrase("DD_90","DD")+" " + thisQueue[index].description + ".\n\n" + self.lawheader.gmsg + ".")
	}
}

function CheckBankSelection(textElm)
{
	var bankDesc = self.detail.document.getElementById("desc").value.replace(/\s+/g, '');

	if (!manualBankEntry || bankDesc == "")
	{
		textElm.blur();
		if (Employee.work_country == "CA")
		{
			if(manualBankEntry && (self.detail.document.getElementById("ca_transit_nbr").value != "" || self.detail.document.getElementById("ca_inst_nbr").value != ""))
			{
				parent.seaAlert(getSeaPhrase("SEL_BANK_B4_ROUTING_CA","DD")); 
				self.detail.document.getElementById("ca_transit_nbr").value = "";
				self.detail.document.getElementById("ca_inst_nbr").value = "";
			}
			else if(!manualBankEntry)
			{
				parent.seaAlert(getSeaPhrase("SEL_BANK_B4_ROUTING_CA_SELECT","DD")); 
			}
		}
		else if (Employee.work_country == "UK")
		{
			if(manualBankEntry && self.detail.document.getElementById("ebank_id").value != "")
			{	
				parent.seaAlert(getSeaPhrase("SEL_BANK_B4_ROUTING_UK","DD")); 
				self.detail.document.getElementById("ebank_id").value = "";
			}
			else if(!manualBankEntry)
			{
				parent.seaAlert(getSeaPhrase("SEL_BANK_B4_ROUTING_SELECT","DD")); 
			}
		}
		else
		{
			if(manualBankEntry && self.detail.document.getElementById("ebank_id").value != "")
			{	
				parent.seaAlert(getSeaPhrase("SEL_BANK_B4_ROUTING","DD")); 
				self.detail.document.getElementById("ebank_id").value = "";
			}
			else if(!manualBankEntry)
			{
				parent.seaAlert(getSeaPhrase("SEL_BANK_B4_ROUTING_SELECT","DD")); 
			}
		}
	}	
}
