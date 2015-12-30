<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">
<meta charset="utf-8">
<title>Benefits Enrollment</title>
<meta name="viewport" content="width=device-width" />
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<script src="/lawson/webappjs/common.js"></script>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/xhrnet/waitalert.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/transaction.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script src="/lawson/xbnnet/bessws.js"></script>
<script src="/lawson/xbnnet/besscommon.js"></script>
<script src="/lawson/xbnnet/bessload.js"></script>
<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"></script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script src="/lawson/webappjs/javascript/objects/ActivityDialog.js"></script>
<script src="/lawson/webappjs/javascript/objects/OpaqueCover.js"></script>
<script src="/lawson/webappjs/javascript/objects/Dialog.js"></script>
<script src="/lawson/portal/slrmc.js"></script>
<script>
var process = "";
if (window.location.search && window.location.search.toLowerCase().indexOf("type=") >= 0)
	process = getVarFromString("type", window.location.search).toLowerCase();
var event = "annual";
var rule_type = "A";
var eventname = "annual";
var eventdte = "";
var company;
var employee;
var prodline;
var ELSalary = 0;
var appObj;
// MOD BY LARRY TAYLOR
//-----------------------------------------------------------------------------------------------------
//-----> It is important to note all the hard-coded values that come from bentfits setup.
//-----> If anything changes in benefits setup then this ESS code may not work.
//-----> Always check the values below after making any changes on BN15, BN17, etc. or BS02, BS03, etc.
//-----------------------------------------------------------------------------------------------------
var gPilbPlanGroup		= "PAY IN LIEU OF BENEF" // Pay In Lieu of Benefits plan group (BS02)
var gMedicalPlanGroup		= "MEDICAL"		// Medical plan group (BS02)
var gMedSpendingPlanGroup	= "HEALTH SAVINGS ACCT"	// Medical Spending Acct plan group (BS02)
var gFlexMedPlanGroup		= "FLEX SPEND MEDICAL"	// Medical Flex Spending plan group (BS02)
var gFlexLtdPlanGroup		= "FLEX SPEND LIMITED"	// Limited Flex Spending plan group (BS02)
var gMedicalSingleCoverage	= "Self Only"		// Medical high plan single coverage option (BN17)
var gPilbPlan			= "PILB"		// Pay In Lieu of Benefits (BN15 type HL)
var gMedHighPlan		= "MED1"		// Medical high deductible plan (BN15 type HL)
var gMedPpoPlan			= "MED2"		// Medical PPO plan (BN15 type HL)
var gHsaFamilyPlan		= "HSA2"		// HSA family plan (BN15 type RS)
var gHsaSinglePlan		= "HSA1"		// HSA single plan (BN15 type RS)
var gHsaWaivePlan		= "WHSA"		// HSA waive plan (BN15 type RS)
var gFlexLtdPlan		= "FSA3"		// Flex Limited plan (BN15 type RS)
var gFlexLtdWaive		= "WFS3"		// Flex Limited waive (BN15 type RS)
var gFlexMedPlan		= "FSA1"		// Flex Medical plan (BN15 type RS)
var gFlexMedWaive		= "WFS1"		// Flex Medical waive (BN15 type RS)
var gFirstTime			= true;			// true = 1st time thru enrollment
var gHasMedPpoPlan		= false			// true = selected medical PPO plan
var gHasMedHighPlan		= false			// true = selected medical high plan
var gHasMedHighFamily		= false			// true = selected MEDICAL high plan with Family coverage
var gHasMedHighSingle		= false			// true = selected MEDICAL high plan with Single coverage
var gHasHsaPlan			= false			// true = selected HSA plan
var gHasHsaFamily		= false			// true = selected HSA family plan
var gHasHsaSingle		= false			// true = selected HSA single plan
var gHasFlexLtdPlan		= false			// true = selected Flex Limited plan
var gHasFlexMedPlan		= false			// true = selected Flex Medical plan
var gHasPilbPlan		= false			// true = selected PILB plan

function fDebug(vModule)
{
	var vDebug	= 'benannenroll.htm called from: '+vModule
			+ '\ngPilbPlanGroup:\t\t'+gPilbPlanGroup
			+ '\ngMedicalPlanGroup:\t\t'+gMedicalPlanGroup
			+ '\ngMedSpendingPlanGroup:\t'+gMedSpendingPlanGroup
			+ '\ngFlexMedPlanGroup:\t'+gFlexMedPlanGroup
			+ '\ngFlexLtdPlanGroup:\t\t'+gFlexLtdPlanGroup
			+ '\ngMedicalSingleCoverage:\t'+gMedicalSingleCoverage
			+ '\ngPilbPlan:\t\t\t'+gPilbPlan
			+ '\ngMedHighPlan:\t\t'+gMedHighPlan
			+ '\ngMedPpoPlan:\t\t'+gMedPpoPlan
			+ '\ngHsaFamilyPlan:\t\t'+gHsaFamilyPlan
			+ '\ngHsaSinglePlan:\t\t'+gHsaSinglePlan
			+ '\ngHsaWaivePlan:\t\t'+gHsaWaivePlan
			+ '\ngFlexLtdPlan:\t\t'+gFlexLtdPlan
			+ '\ngFlexLtdWaive:\t\t'+gFlexLtdWaive
			+ '\ngFlexMedPlan:\t\t'+gFlexMedPlan
			+ '\ngFlexMedWaive:\t\t'+gFlexMedWaive
			+ '\ngFirstTime:\t\t'+gFirstTime
			+ '\ngHasMedPpoPlan:\t\t'+gHasMedPpoPlan
			+ '\ngHasMedHighPlan:\t\t'+gHasMedHighPlan
			+ '\ngHasMedHighFamily:\t'+gHasMedHighFamily
			+ '\ngHasMedHighSingle:\t'+gHasMedHighSingle
			+ '\ngHasHsaPlan:\t\t'+gHasHsaPlan
			+ '\ngHasHsaFamily:\t\t'+gHasHsaFamily
			+ '\ngHasHsaSingle:\t\t'+gHasHsaSingle
			+ '\ngHasFlexLtdPlan:\t\t'+gHasFlexLtdPlan
			+ '\ngHasFlexMedPlan:\t\t'+gHasFlexMedPlan
			+ '\ngHasPilbPlan:\t\t'+gHasPilbPlan
	alert(vDebug);
}

// END OF MOD

// MOD BY BILAL - Prior customizations
var SLRMC = new Slrmc();
// END OF MOD
if (process == "newhire")
{
	event = "newhire";
	rule_type = "N";
	eventname = "newhire";
}
function startProgram()
{
	authenticate('frameNm="jsreturn"|funcNm="authenDone()"|desiredEdit="EM"');
}
function authenDone()
{
	stylePage();
	startProcessing(getSeaPhrase("WAIT","ESS"), getNHRules);
}
function keepcheck1()
{
	eventdte = BenefitRules[1];
// MOD BY BILAL
      // ISH no current benefits
      /*
	if (typeof(CurrentBens[1]) != "undefined" && CurrentBens[1] != null)	
	{
		HasCurrentBens = 1;
		self.document.getElementById("main").src = baseurl+"currentbens.htm";
	} 
	else
      */
// END OF MOD
		keepcheck2();
}
function keepcheck2()
{
	var len = EligPlanGroups.length - 1;
	if (CurrentPlanGroup<EligPlanGroups.length-1 && alreadyElect != "Y")	
	{
 		CurrentPlanGroup++;
 		planname = 1;
		if (CurrentBens[1] != null) 
		{
	 		if (CurrentBens[planname][32] == EligPlanGroups[CurrentPlanGroup][0])
	 			self.document.getElementById("main").src = baseurl+"disp_benefits.htm";
			else
	 			self.document.getElementById("main").src = baseurl+"availplans.htm";
		} 
		else
 			self.document.getElementById("main").src = baseurl+"availplans.htm";
	} 
	else 
	{
		var foundEligPlan = new Array();
		for (var i=1; i<EligPlanGroups.length; i++)
			foundEligPlan[i] = false;
		for (var y=1; y<EligPlanGroups.length; y++) 
		{
			for (var j=0; j<ElectedPlans.length; j++) 
			{
				if (!foundEligPlan[y] && ElectedPlans[j][3] == EligPlanGroups[y][0]) 
				{
					foundEligPlan[y] = true;
					break;
				}
			}
		}
		for (var k=1; k<foundEligPlan.length; k++)	
		{ 
// MOD BY LARRY TAYLOR
// This code is to avoid pre-checking "FLEX SPEND MEDICAL" on besschange.htm, since this is
// a plan group that is sometimes skipped in other parts of the code.
// This will avoid the error: SUMBEN_5 = You have one or more plan groups that need a benefit election. Select 'Make changes' to make new elections.
//
//			if (foundEligPlan[k] == false && EligPlanGroups[k][4] == "Y") 
			if(foundEligPlan[k] == false && EligPlanGroups[k][4] == "Y" && EligPlanGroups[k][0] != gFlexMedPlanGroup)
// END OF MOD
				errorGroups[errorGroups.length]=EligPlanGroups[k][0];
		}
		var planMatch = false;
		for (var i=0; i<ElectedPlans.length; i++) 
		{
			planMatch = false;
			for (var x=0; x<EligPlans.length; x++)	
			{
				if (parseFloat(ElectedPlans[i][0])==1 && ElectedPlans[i][2][11]==EligPlans[x][1] && ElectedPlans[i][2][12]==EligPlans[x][2])	
				{
					planMatch = true;
					break;
				}
				else if (((parseFloat(ElectedPlans[i][0])>1 && parseFloat(ElectedPlans[i][0])<6) || parseFloat(ElectedPlans[i][0])==13) && ElectedPlans[i][2][37]==EligPlans[x][1] && ElectedPlans[i][2][38]==EligPlans[x][2]) 
				{
					planMatch = true;
					break;
				}
				else if (parseFloat(ElectedPlans[i][0])>5 && ElectedPlans[i][2][38]==EligPlans[x][1] && ElectedPlans[i][2][39]==EligPlans[x][2]) 
				{
					planMatch = true;
					break;
				}
			}
			if (!planMatch)
				errorPlans[errorPlans.length]=ElectedPlans[i][3]
		}

// MOD BY LARRY TAYLOR
//-----------------------------------------------------------------------------------------
// Set global flags based on data coming from BS31.
// We examine the ElectedPlans object.
// The plan code is stored in a different place in ElectedPlans for each plan type.
// For medical it is [14].  HSA is [41].
//-----------------------------------------------------------------------------------------
		var vPlanCode = "";
		gFirstTime = false; // if we get here it means the employee has been through enrollment already
		for (var x=0;x<ElectedPlans.length;x++)
		{
			var tmp = ElectedPlans[x].toString();
			var vAry = tmp.split(",");
	//-----> See if employee previously enrolled in PILB plan
			if (gHasPilbPlan == false)
				gHasPilbPlan = (vAry[14] == gPilbPlan) ? true : false;

	//-----> See if employee previously enrolled in medical PPO plan
			if (gHasMedPpoPlan == false)
				gHasMedPpoPlan = (vAry[14] == gMedPpoPlan) ? true : false;

	//-----> See if employee previously enrolled in medical high plan
			if (gHasMedHighPlan == false)
				gHasMedHighPlan = (vAry[14] == gMedHighPlan) ? true : false;

	//-----> Get med high plan coverage option (if exists)
			var vCovOpt = "";
			try{
				vCovOpt = vAry[4];
			}
			catch(e){}
			if (gHasMedHighPlan && gHasMedHighSingle == false && gHasMedHighFamily == false)
			{
				if (vCovOpt.toUpperCase() == gMedicalSingleCoverage.toUpperCase())
					gHasMedHighSingle = true;
				else
					gHasMedHighFamily = true;
			}

	//-----> See if employee previously enrolled in HSA
			if (gHasHsaPlan == false)
			{
				gHasHsaPlan = (vAry[41] == gHsaSinglePlan || vAry[41] == gHsaFamilyPlan) ? true : false;
				gHasHsaFamily = (vAry[41] == gHsaFamilyPlan) ? true : false;
				gHasHsaSingle = (vAry[41] == gHsaSinglePlan) ? true : false;
			}
	//-----> See if employee previously enrolled in Flex Limited
			if (gHasFlexLtdPlan == false)
			{
				gHasFlexLtdPlan = (vAry[41] == gFlexLtdPlan) ? true : false;
			}
	//-----> See if employee previously enrolled in Flex Medical
			if (gHasFlexMedPlan == false)
			{
				gHasFlexMedPlan = (vAry[41] == gFlexMedPlan) ? true : false;
			}
		}
// END OF MOD

		self.document.getElementById("main").src = baseurl+"bensummary.htm";
 	}
}
function selOption(msgNum)
{
	msgNbr = msgNum;
	actiontaken = msgNum;
	if (msgNum == 5) 
	{				
		if (!self.main.DepOptionAlert())	
		{
			LastDoc[LastDoc.length] = baseurl+"disp_benefits.htm";
			currentdoc = LastDoc.length - 1;
			if (EligPlans[CurrentEligPlan][18] == "Y" && dependents.length > 0)
				self.document.getElementById("main").src = baseurl+"depscr.htm";
			else
				self.document.getElementById("main").src = baseurl+"bensconfirm.htm";
		}
	} 
	else 
	{
		if (msgNum == 4) 
		{
			for (var i=1; i<EligPlans.length; i++)	
			{
				if (CurrentBens[planname][2]==EligPlans[i][2] && CurrentBens[planname][1]==EligPlans[i][1]) 
				{
					CurrentEligPlan = i;
					break
				}
			}
			LastDoc[LastDoc.length] = baseurl+"disp_benefits.htm";
			currentdoc = LastDoc.length - 1;
			self.document.getElementById("main").src = baseurl+"elect_benefits.htm";
		} 
		else 
		{
			if (msgNum == 1) 
			{
				LastDoc[LastDoc.length] = baseurl+"disp_benefits.htm";
				currentdoc = LastDoc.length - 1
				self.document.getElementById("main").src = baseurl+"availplans.htm";
			} 
			else if (msgNum == 2) 
			{
				if (!self.main.DepOptionAlert())	
				{
					LastDoc[LastDoc.length] = baseurl+"disp_benefits.htm";
					currentdoc = LastDoc.length - 1
					if (self.main.button5 && dependents.length>0 && (coveredDeps.length==0 || self.main.IneligibleCoveredDepAgeExists()))
					{
						actiontaken = 5;
						msgNbr = 5;
						self.document.getElementById("main").src = baseurl+"depscr.htm";
					}
					else
						self.document.getElementById("main").src = baseurl+"bensconfirm.htm";
				}
			} 
			else 
			{
				LastDoc[LastDoc.length] = baseurl+"disp_benefits.htm";
				currentdoc = LastDoc.length-1;
				self.document.getElementById("main").src = baseurl+"bensconfirm.htm";
			}
		}
	}
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
	var mainFrame = document.getElementById("main");
	var winObj = getWinSize();
	var winWidth = winObj[0];	
	var winHeight = winObj[1];
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
	mainFrame.style.width = winWidth + "px";
	mainFrame.style.height = winHeight + "px";
	try
	{
		if (self.main.onresize && self.main.onresize.toString().indexOf("setLayerSizes") >= 0)
			self.main.onresize = null;		
	}
	catch(e) {}
	try
	{
		self.main.document.getElementById("paneBorder").style.width = contentWidthBorder + "px";
		self.main.document.getElementById("paneBodyBorder").style.width = contentWidth + "px";
		self.main.document.getElementById("paneBorder").style.height = contentHeightBorder + "px";
		self.main.document.getElementById("paneBodyBorder").style.height = contentHeight + "px";
		self.main.document.getElementById("paneBody").style.width = contentWidth + "px";
		self.main.document.getElementById("paneBody").style.height = contentHeight + "px";
	}
	catch(e) {}
}
</script>
</head>
<body style="width:100%;height:100%;overflow:hidden" onload="startProgram();fitToScreen()" onresize="fitToScreen()">
	<iframe id="header" name="header" title="Header" level="1" tabindex="0" src="/lawson/xhrnet/ui/header.htm" style="visibility:hidden;position:absolute;height:32px;width:803px;left:0px;top:0px" marginwidth="0" marginheight="0" frameborder="no" scrolling="no"></iframe>
	<iframe id="main" name="main" title="Main Content" level="2" tabindex="0" src="/lawson/xhrnet/ui/headerpane.htm" style="visibility:hidden;position:absolute;top:32px;left:0px;width:721px;height:464px" marginwidth="0" marginheight="0" frameborder="no" scrolling="no"></iframe>
	<iframe name="jsreturn" title="Empty" src="/lawson/xhrnet/dot.htm" style="visibility:hidden;height:0px;width:0px;"></iframe>
	<iframe name="lawheader" title="Empty" src="/lawson/xbnnet/besslawheader.htm" style="visibility:hidden;height:0px;width:0px;"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@10.00.05.00.12 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/benannenroll.htm,v 1.24.2.47 2014/02/24 22:02:28 brentd Exp $ -->
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
