<html>
<head>
<title>Benefits Enrollment</title>
<meta name="viewport" content="width=device-width" />
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/xhrnet/email.js"></script>
<script src="/lawson/xhrnet/waitalert.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/webappjs/transaction.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script src="/lawson/xbnnet/bessws.js"></script>
<script src="/lawson/xbnnet/besscommon.js"></script>
<script src="/lawson/xbnnet/bessload.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"></script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script src="/lawson/webappjs/javascript/objects/ActivityDialog.js"></script>
<script src="/lawson/webappjs/javascript/objects/OpaqueCover.js"></script>
<script src="/lawson/webappjs/javascript/objects/Dialog.js"></script>
<script src="/lawson/portal/slrmc.js"></script>   <!-- Prior Customizations -->
<script>
var process = "";
if (window.location.search && window.location.search.toLowerCase().indexOf("type=") >= 0)
	process = getVarFromString("type", window.location.search).toLowerCase();
var event="annual"
var rule_type="A"
var eventname="annual"
var eventdte=""
var company
var employee
var prodline
var ELSalary = 0;
// MOD BY BILAL - Prior customizations
var SLRMC = new Slrmc();
// END OF MOD
_BaseDateWord=unescape(_BaseDateWord)
if (process=="newhire")
{
	event="newhire"
	rule_type="N"
	eventname="newhire"
}
function startProgram()
{
	authenticate('frameNm="jsreturn"|funcNm="getNHRules()"|desiredEdit="EM"');
}
function keepcheck1()
{
	eventdte=BenefitRules[1]
// MOD BY BILAL
      // ISH no current benefits
      /*
	if(typeof(CurrentBens[1]) != "undefined" && CurrentBens[1] != null)	
	{
		HasCurrentBens=1
		self.document.getElementById("main").src = baseurl+"currentbens.htm"
	} 
	else
      */
// END OF MOD
		keepcheck2()
}
function keepcheck2()
{
	var len = EligPlanGroups.length-1
	if(CurrentPlanGroup<EligPlanGroups.length-1 && alreadyElect != "Y")	
	{
 		CurrentPlanGroup++
 		planname=1
		if(CurrentBens[1] != null) 
		{
	 		if(CurrentBens[planname][32]==EligPlanGroups[CurrentPlanGroup][0])
	 			self.document.getElementById("main").src = baseurl+"disp_benefits.htm"
			else
	 			self.document.getElementById("main").src = baseurl+"availplans.htm"
		} 
		else
 			self.document.getElementById("main").src = baseurl+"availplans.htm"
	} 
	else 
	{
		var foundEligPlan=new Array()
		for(var i=1; i<EligPlanGroups.length; i++)
			foundEligPlan[i]=false
		for (var y=1; y<EligPlanGroups.length; y++) 
		{
			for(var j=0; j<ElectedPlans.length; j++) 
			{
				if (!foundEligPlan[y] && ElectedPlans[j][3] == EligPlanGroups[y][0]) 
				{
					foundEligPlan[y]=true
					break
				}
			}
		}
		for(var k=1; k<foundEligPlan.length; k++)	
		{
			if(!foundEligPlan[k])
				errorGroups[errorGroups.length]=EligPlanGroups[k][0]
		}
		var planMatch=false
		for(var i=0; i<ElectedPlans.length; i++) 
		{
			planMatch=false
			for(var x=0; x<EligPlans.length; x++)	
			{
				if(parseFloat(ElectedPlans[i][0])==1 && ElectedPlans[i][2][11]==EligPlans[x][1] && ElectedPlans[i][2][12]==EligPlans[x][2])	
				{
					planMatch=true
					break
				}
				if(((parseFloat(ElectedPlans[i][0])>1 && parseFloat(ElectedPlans[i][0])<6) || parseFloat(ElectedPlans[i][0])==13) && ElectedPlans[i][2][37]==EligPlans[x][1] && ElectedPlans[i][2][38]==EligPlans[x][2]) 
				{
					planMatch=true
					break
				}
				if(parseFloat(ElectedPlans[i][0])>5 && ElectedPlans[i][2][38]==EligPlans[x][1] && ElectedPlans[i][2][39]==EligPlans[x][2]) 
				{
					planMatch=true
					break
				}
			}
			if(!planMatch)
				errorPlans[errorPlans.length]=ElectedPlans[i][3]
		}
		self.document.getElementById("main").src = baseurl+"bensummary.htm"
 	}
}
function selOption(msgNum)
{
	msgNbr=msgNum
	actiontaken=msgNum
	if(msgNum==5) 
	{				
		if (!self.main.DepOptionAlert())	
		{
			LastDoc[LastDoc.length]=baseurl+"disp_benefits.htm"
			currentdoc=LastDoc.length-1
			if(EligPlans[CurrentEligPlan][18]=="Y" && dependents.length>0)
				self.document.getElementById("main").src = baseurl+"depscr.htm"
			else
				self.document.getElementById("main").src = baseurl+"bensconfirm.htm"
		}
	} 
	else 
	{
		if(msgNum==4) 
		{
			for (var i=1; i<EligPlans.length; i++)	
			{
				if(CurrentBens[planname][2]==EligPlans[i][2] && CurrentBens[planname][1]==EligPlans[i][1]) 
				{
					CurrentEligPlan=i
					break
				}
			}
			LastDoc[LastDoc.length]=baseurl+"disp_benefits.htm"
			currentdoc=LastDoc.length-1
			self.document.getElementById("main").src = baseurl+"elect_benefits.htm"
		} 
		else 
		{
			if(msgNum==1) 
			{
				LastDoc[LastDoc.length]=baseurl+"disp_benefits.htm"
				currentdoc=LastDoc.length-1
				self.document.getElementById("main").src = baseurl+"availplans.htm"
			} 
			else if(msgNum==2) 
			{
				if (!self.main.DepOptionAlert())	
				{
					LastDoc[LastDoc.length]=baseurl+"disp_benefits.htm"
					currentdoc=LastDoc.length-1
					if(self.main.button5 && dependents.length>0 && (coveredDeps.length==0 || self.main.IneligibleCoveredDepAgeExists()))
					{
						actiontaken = 5
						msgNbr = 5
						self.document.getElementById("main").src = baseurl+"depscr.htm"
					}
					else
						self.document.getElementById("main").src = baseurl+"bensconfirm.htm"
				}
			} 
			else 
			{
				LastDoc[LastDoc.length]=baseurl+"disp_benefits.htm"
				currentdoc=LastDoc.length-1
				self.document.getElementById("main").src = baseurl+"bensconfirm.htm"
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
	var winHeight = 464;
	var winWidth = 721;
	// resize the table frame to the screen dimensions
	if (document.body.clientHeight)
	{
		winHeight = document.body.clientHeight;
		winWidth = document.body.clientWidth;
	}
	else if (window.innerHeight)
	{
		winHeight = window.innerHeight;
		winWidth = window.innerWidth;
	}
	// disable the onresize window event if it exists - we don't want the elements in the frame to resize themselves
	if (self.main.onresize && self.main.onresize.toString().indexOf("setLayerSizes") >= 0)
		self.main.onresize = null;
	mainFrame.style.width = (winWidth - 10) + "px";
	mainFrame.style.height = (winHeight - 25) + "px";
	var fullContentWidth = (window.styler && window.styler.showLDS) ? (winWidth - 17) : ((navigator.appName.indexOf("Microsoft") >= 0) ? (winWidth - 12) : (winWidth - 12));
	var fullPaneContentWidth = (window.styler && window.styler.showLDS) ? fullContentWidth - 15 : fullContentWidth - 5;
	try
	{
		if (fullContentWidth > 0)
			self.main.document.getElementById("paneBorder").style.width = fullContentWidth + "px";
		if (winHeight >= 35)
			self.main.document.getElementById("paneBorder").style.height = (winHeight - 35) + "px";
		if (fullPaneContentWidth >= 5)
		{
			self.main.document.getElementById("paneBodyBorder").style.width = fullPaneContentWidth + "px";
			self.main.document.getElementById("paneBody").style.width = (fullPaneContentWidth - 5) + "px";
		}
		if (winHeight >= 55)
		{
			self.main.document.getElementById("paneBodyBorder").style.height = (winHeight - 55) + "px";
			self.main.document.getElementById("paneBody").style.height = (winHeight - 60) + "px";
		}
		if (fullContentWidth >= 15)
			self.main.document.getElementById("paneHeader").style.width = (fullContentWidth - 15) + "px";
	}
	catch(e) {}
}
</script>
</head>
<body style="overflow:hidden" onload="startProgram();fitToScreen()" onresize="fitToScreen()">
	<iframe id="header" name="header" src="/lawson/xhrnet/ui/header.htm" style="visibility:hidden;position:absolute;height:32px;width:803px;left:0px;top:0px" marginwidth="0" marginheight="0" frameborder="no" scrolling="no"></iframe>
	<iframe id="main" name="main" src="/lawson/xhrnet/ui/headerpane.htm" style="visibility:hidden;position:absolute;top:32px;left:0px;width:721px;height:464px" marginwidth="0" marginheight="0" frameborder="no" scrolling="no"></iframe>
	<iframe name="jsreturn" src="/lawson/xhrnet/dot.htm" style="visibility:hidden;height:0px;width:0px;"></iframe>
	<iframe name="lawheader" src="/lawson/xbnnet/besslawheader.htm" style="visibility:hidden;height:0px;width:0px;"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@(201111) 09.00.01.06.00 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/benannenroll.htm,v 1.24.2.18 2011/05/04 21:10:18 brentd Exp $ -->
