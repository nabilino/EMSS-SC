<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">
<meta charset="utf-8">
<title>Enroll in Benefit Plan</title>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"></script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script>

// MOD BY LARRY TAYLOR
var vPlanGroup = parent.parent.EligPlans[parent.parent.CurrentEligPlan][8];
// END OF MOD

function startProgram()
{
	setWinTitle(getSeaPhrase("ENROLL_PLAN","BEN"));
	REC_TYPE=parent.parent.EligPlans[parent.parent.CurrentEligPlan][6]
	parent.flexflag=0
	parent.empflag=0
	parent.compflag=0
	var html=""
	var head=""
	var bod=""
	// PT 145479. Fix issue where radio button appears under wrong column.
	for (var i=1; i<parent.parent.SelectedPlan.length; i++) 
	{
		if (parent.parent.SelectedPlan[i][6]!="" && parent.parent.SelectedPlan[i][6]!=null && parent.parent.SelectedPlan[i][6]!=0)
			parent.flexflag = 1;
		if (parent.parent.SelectedPlan[i][5]!="" && parent.parent.SelectedPlan[i][5]!=null && parent.parent.SelectedPlan[i][5]!=0)
			parent.empflag = 1;
		if (parent.parent.SelectedPlan[i][8]!="" && parent.parent.SelectedPlan[i][8]!=null && parent.parent.SelectedPlan[i][8]!=0)
			parent.compflag = 1;
	}
	for (var i=1; i<parent.parent.SelectedPlan.length; i++) 
	{
		bod+='<tr><td class="plaintablecellborder" style="text-align:center">'
		//GDD  09/27/14  Add call on radio checked
		//bod+='<input class="inputbox" type="radio" id="opt'+i+'" name="opt" onclick="parent.parent.choice='+i+';styleElement(this);" aria-labelledby="covHdr optLbl'+i+' flexHdr flexLbl'+i+' empCostHdr empCostLbl'+i+' compCostHdr compCostLbl'+i+'">'	
		bod+='<input class="inputbox" type="radio" id="opt'+i+'" name="opt" onclick="fRadioOnClick('+i+');styleElement(this);" aria-labelledby="covHdr optLbl'+i+' flexHdr flexLbl'+i+' empCostHdr empCostLbl'+i+' compCostHdr compCostLbl'+i+'">'	

		bod+='</td><td class="plaintablecellborder"><label id="optLbl'+i+'" for="opt'+i+'">&nbsp;'+parent.parent.SelectedPlan[i][2]+'</label></td>'
		// flex column
		if (parent.parent.SelectedPlan[i][6]!="" && parent.parent.SelectedPlan[i][6]!=null && parent.parent.SelectedPlan[i][6]!=0) 
		{
			bod+='<td class="plaintablecellborderright" nowrap><span id="flexLbl'+i+'">&nbsp;'
			bod+=parent.parent.formatCont(parent.parent.SelectedPlan[i][6])
			if(parent.parent.EMP_CONT_TYPE=="P")
				bod+=getSeaPhrase("PER","BEN")
			bod+='</span></td>'
		}
		else if (parent.flexflag == 1)
			bod+='<td class="plaintablecellborder" style="text-align:center">&nbsp;</td>'
		// employee cost column
		if (parent.parent.SelectedPlan[i][5]!="" && parent.parent.SelectedPlan[i][5]!=null && parent.parent.SelectedPlan[i][5]!=0) 
		{
			bod+='<td class="plaintablecellborderright" nowrap><span id="empCostLbl'+i+'">&nbsp;'
			bod+=parent.parent.formatCont(parent.parent.SelectedPlan[i][5])
			if (parent.parent.EMP_CONT_TYPE=="P")
				bod+=getSeaPhrase("PER","BEN")
			bod+='</span></td>'
		}
		else if (parent.empflag == 1)
			bod+='<td class="plaintablecellborder" style="text-align:center">&nbsp;</td>'
		// company cost column
		if (parent.parent.SelectedPlan[i][8]!="" && parent.parent.SelectedPlan[i][8]!=null && parent.parent.SelectedPlan[i][8]!=0) 
		{
			bod+='<td class="plaintablecellborderright" nowrap><span id="compCostLbl'+i+'">&nbsp;'
			bod+=parent.parent.formatCont(parent.parent.SelectedPlan[i][8])
			if (parent.parent.EMP_CONT_TYPE=="P")
				bod+=getSeaPhrase("PER","BEN")
			bod+='</span></td>'
		}
		else if (parent.compflag == 1)
			bod+='<td class="plaintablecellborder" style="text-align:center">&nbsp;</td>'
		bod+='</tr>'
	}
	bod+='</table></div></form>'
	var docHeader = parent.header(parent.planMessages(parent.parent.SelectedPlan[1][3],parent.parent.SelectedPlan[1][4])+' '+getSeaPhrase("SELECT_COVERAGE_OPTION","BEN"));
	html += docHeader
	html += '<table border="0" cellpadding="0" cellspacing="0" style="width:100%;margin-left:auto;margin-right:auto" role="presentation">'
	html += '<tr><td class="plaintablecell" valign="top">'
    head += '<form onsubmit="return false;"><div role="radiogroup">'
	head += '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" style="width:100%;margin-left:auto;margin-right:auto" styler="list" summary="'+getSeaPhrase("TSUM_14","BEN",[parent.parent.EligPlans[parent.parent.CurrentEligPlan][4]])+'">'
	head += '<caption class="offscreen">'+getSeaPhrase("TCAP_13","BEN",[parent.parent.EligPlans[parent.parent.CurrentEligPlan][4]])+'</caption>' 
	head += '<tr><th scope="col" class="plaintableheaderborder" style="width:50px;text-align:center">'+getSeaPhrase("SELECT","BEN")+'</th>'
	head += '<th scope="col" class="plaintableheaderborder" style="text-align:center"><span id="covHdr">'+getSeaPhrase("COVERAGE","BEN")+'</span></th>'
	if (parent.flexflag==1)
		head += '<th scope="col" class="plaintableheaderborder style="text-align:center" nowrap><span id="flexHdr">'+getSeaPhrase("FLEX_CR","BEN")+'</span></th>'
	if (parent.empflag==1)
		head += '<th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap><span id="empCostHdr">'+getSeaPhrase("COST","BEN")+'</span></th>'
	if (parent.compflag==1)
		head += '<th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap><span id="compCostHdr">'+getSeaPhrase("CO_COST","BEN")+'</span></th>'
	head += '</tr>'

// MOD BY BILAL 
//	var docHeader = parent.header('<br>'+parent.planMessages(parent.parent.SelectedPlan[1][3],parent.parent.SelectedPlan[1][4])+'<p>'+getSeaPhrase("SELECT_COVERAGE_OPTION","BEN"));
	// CLYNCH 02/14/2012 - Customizing header messages for Child Supp Life
	if (parent.parent.EligPlans[parent.parent.CurrentEligPlan][8]!="CHILD SUPP LIFE") {
		var docHeader = parent.header('<br>'+'Note: All coverage options provide self coverage too.'+'<br>'+parent.planMessages(parent.parent.SelectedPlan[1][3],parent.parent.SelectedPlan[1][4])+'<p>'+getSeaPhrase("SELECT_COVERAGE_OPTION","BEN"))
	}
	if (parent.parent.EligPlans[parent.parent.CurrentEligPlan][8]=="CHILD SUPP LIFE") {
		var docHeader = parent.header('<br>'+parent.planMessages(parent.parent.SelectedPlan[1][3],parent.parent.SelectedPlan[1][4])+'<p>'+getSeaPhrase("SELECT_COVERAGE_OPTION","BEN"))
	}
	// ~CLYNCH
	// END OF MOD 
	var docFooter = parent.footer(parent.parent.SelectedPlan[1][3],parent.parent.SelectedPlan[1][4])
	html += head + bod
	html += '</td></tr></table>'
	html += docFooter
	document.getElementById("paneBody").innerHTML = '<div style="padding:0px">'+html+'</div>';
	document.getElementById("paneHeader").innerHTML = getSeaPhrase("BEN_ELECT","BEN")+' - '+parent.parent.EligPlans[parent.parent.CurrentEligPlan][8];
	stylePage();
	document.body.style.visibility = "visible";
	parent.parent.stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[getWinTitle()]));
	parent.fitToScreen();
}
// MOD BY LARRY TAYLOR
function fRadioOnClick(i)
{
// this was in the original code above
	parent.parent.choice = i;
	
// new stuff: set a flag to indicate if the employee chooses MEDICAL high family or single
	if (vPlanGroup == parent.parent.gMedicalPlanGroup)
	{// only do this for MEDICAL
		var vOption = parent.parent.SelectedPlan[i][2];
// set flag to indicate if the employee chooses MEDICAL high family option
		parent.parent.gHasMedHighFamily = false;
		parent.parent.gHasMedHighSingle = false;
		if (parent.parent.gHasMedHighPlan)
		{
			if (vOption == parent.parent.gMedicalSingleCoverage)
				parent.parent.gHasMedHighSingle = true;
			else
				parent.parent.gHasMedHighFamily = true;
		}
	}
	//GDD  09/28/14 Set has PILB if checked
	if (vPlanGroup == parent.parent.gPilbPlanGroup)
	{// only do this for PAY IN LUIE BENEF
	//alert(i + ":" + parent.parent.SelectedPlan[i][12] + ":" + parent.parent.gPilbPlan)
		if (i == 2 && parent.parent.SelectedPlan[i][12] == parent.parent.gPilbPlan) parent.parent.gHasPilbPlan = true
		else parent.parent.gHasPilbPlan = false;
	}
	//GDD End of Change
}
// END OF MOD

</script>
</head>
<body onload="setLayerSizes();startProgram()" style="visibility:hidden">
<div id="paneBorder" class="paneborder">
	<table id="paneTable" border="0" height="100%" width="100%" cellpadding="0" cellspacing="0" role="presentation">
	<tr><td style="height:16px">
		<div id="paneHeader" class="paneheader" role="heading" aria-level="2">&nbsp;</div>
	</td></tr>
	<tr><td>
		<div id="paneBodyBorder" class="panebodyborder" styler="groupbox"><div id="paneBody" class="panebody" tabindex="0"></div></div>
	</td></tr>
	</table>
</div>
</body>
</html>
<!-- Version: 8-)@(#)@10.00.05.00.12 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/elect_ben_01.htm,v 1.20.2.40 2014/02/25 22:49:14 brentd Exp $ -->
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
