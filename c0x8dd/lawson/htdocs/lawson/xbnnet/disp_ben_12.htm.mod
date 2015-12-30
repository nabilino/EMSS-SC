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
function startProgram()
{
	setWinTitle(getSeaPhrase("ENROLL_PLAN","BEN"));
	var addlStr = '';
	var html = '';
	parent.button1 = 1;
	parent.button2 = 0;
	var maxPlansElected = false;
	if (parent.plangroup>1 || (parent.plangroup==1 && (parent.GrpPlans[0][1]!=parent.parent.CurrentBens[parent.parent.planname][1]
	|| parent.GrpPlans[0][2]!=parent.parent.CurrentBens[parent.parent.planname][2])))
	{
		var noOfPlan = 0;
		for (var i=1; i<parent.parent.EligPlans.length; i++)
		{
			if (parent.parent.EligPlans[i][8] == parent.parent.EligPlanGroups[parent.parent.CurrentPlanGroup][0] && parent.parent.selectedPlanInGrp[i] == true)
				noOfPlan++;
		}
		if (noOfPlan < parent.parent.EligPlanGroups[parent.parent.CurrentPlanGroup][1])
			parent.button3 = 1;
		else
			maxPlansElected = true;
	}
	//PT118701: check if plan has already been elected
	for (var i=1; i<parent.parent.EligPlans.length; i++)
	{
    	if (parent.parent.EligPlans[i][1]==parent.parent.CurrentBens[parent.parent.planname][1] && parent.parent.EligPlans[i][2]==parent.parent.CurrentBens[parent.parent.planname][2])
		{
			if (parent.parent.selectedPlanInGrp[i]) 
			{
				parent.button1 = 0;
				parent.button2 = 0;
				addlStr += getSeaPhrase("ALREADY_ELECTED","BEN")+' ';
				break;
			}
		}
	}
	if (maxPlansElected) 
	{
		parent.button1 = 0;
		parent.button2 = 0;
		parent.button5 = 0;
		addlStr += getSeaPhrase("MAX_PLAN","BEN")+' ';
	}
	if (parent.parent.CurrentBens[parent.parent.planname][14]=="N")
	{
		parent.button1 = 0;
		parent.parent.CurrentEligPlan = "";
		addlStr += getSeaPhrase("DISPBEN_4","BEN")+' ';
	} 
	else
		parent.parent.setpreaft_flag(parent.parent.SelectedPlan[28]);
	html += '<div class="plaintablecell" style="padding:0px">';
	html += parent.header(addlStr);
	if ((parent.parent.CurrentBens[parent.parent.planname][1]=="HL" || parent.parent.CurrentBens[parent.parent.planname][1]=="DN") && parent.parent.CurrentBens[parent.parent.planname][48]=="Y")
	{
		html += '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" style="width:100%;margin-left:auto;margin-right:auto" styler="list" summary="'+getSeaPhrase("TSUM_12","BEN",[parent.parent.CurrentBens[parent.parent.planname][5]])+'">'
		//head += '<caption class="offscreen">'+getSeaPhrase("TCAP_11","BEN",[parent.parent.CurrentBens[parent.parent.planname][5]])+'</caption>'
		html += '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("AS_OF","BEN")+'</th>'
		html += '<th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("COVERAGE","BEN")+'</th></tr>'
		html += '<tr><td class="plaintablecellborder" style="text-align:center">&nbsp;'+parent.parent.currentdate+'</td><td class="plaintablecellborder" nowrap>&nbsp;'+getSeaPhrase("CURBEN_26","BEN")+'</td></tr>'
		if (parent.button1!=0 && parent.parent.BenefitRules[0]=="A")
			html += '<tr><td class="plaintablecellborder" style="text-align:center">&nbsp;'+parent.parent.newdate+'</td><td class="plaintablecellborder" nowrap>&nbsp;'+getSeaPhrase("CURBEN_26","BEN")+'</td></tr>'
		html += '</table><br/>'
	}
	html += '<form name="options">'
	html += '<div role="radiogroup">'
	html += '<table class="plaintableborder" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin-left:auto;margin-right:auto" styler="list" summary="'+getSeaPhrase("TSUM_13","BEN",[parent.parent.CurrentBens[parent.parent.planname][5]])+'">'
	html += '<caption class="offscreen">'+getSeaPhrase("TCAP_12","BEN",[parent.parent.CurrentBens[parent.parent.planname][5]])+'</caption>'
	html += '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("SELECT","BEN")+'</th>'
	html += '<th scope="col" class="plaintableheaderborder" style="width:100%;text-align:center">'+getSeaPhrase("OPTION","BEN")+'</th></tr>'
	if (parent.button1!=0 && parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][12]=="Y") 
	{
		html += '<tr><td class="plaintablecellborder" style="text-align:center">'
		html += '<input type="radio" id="option0" name="option" value="0" onclick="styleElement(this);"></td>'
		html += '<td class="plaintablecellborder"><label for="option0">'+getSeaPhrase("DISPBEN_23","BEN")+'</label></td></tr>'
	}
	if (parent.button2!=0 && parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][12]=="Y" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][17]==1) 
	{
		html += '<tr><td class="plaintablecellborder" style="text-align:center">'
		html += '<input type="radio" id="option1" name="option" value="1" onclick="styleElement(this);"></td>'
		html += '<td class="plaintablecellborder"><label for="option1">'+getSeaPhrase("DISPBEN_24","BEN")+'</label></td></tr>'
	}
	if (parent.button3!=0 && (parent.parent.CurrentEligPlan=="" || (parent.parent.EligPlans[parent.parent.CurrentEligPlan][14]=="Y" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][17]==1))) 
	{
		html += '<tr><td class="plaintablecellborder" style="text-align:center">'
		html += '<input type="radio" id="option3" name="option" value="3" onclick="styleElement(this);"></td>'
		html += '<td class="plaintablecellborder"><label for="option1">'+getSeaPhrase("DISPBEN_25","BEN")+'</label></td></tr>'
	}
	if (parent.button4!=0 && parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][14]=="Y" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][17]==1) 
	{
		html += '<tr><td class="plaintablecellborder" style="text-align:center">'
		html += '<input type="radio" id="option4" name="option" value="4" onclick="styleElement(this);"></td>'
		html += '<td class="plaintablecellborder"><label for="option4">'+getSeaPhrase("DISPBEN_26","BEN")+'</label></td></tr>'
	}
	html += '</table></div><p class="textAlignRight">'
	html += uiButton(getSeaPhrase("CONTINUE","BEN"),"parent.parseChoice(this.form);return false","margin-right:5px;margin-top:10px")
	html += uiButton(getSeaPhrase("EXIT","BEN"),"parent.parent.quitEnroll(parent.location);return false","margin-right:5px;margin-top:10px",null,'aria-haspopup="true"')
	html += '</p></form>'
	html += '</div>';
	document.getElementById("paneBody").innerHTML = html;
	document.getElementById("paneHeader").innerHTML = getSeaPhrase("ENROLLMENT_ELECTIONS","BEN")+' - '+parent.parent.CurrentBens[parent.parent.planname][32];
	stylePage();
	document.body.style.visibility = "visible";
	parent.parent.stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[getWinTitle()]));
	parent.fitToScreen();
}
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
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/disp_ben_12.htm,v 1.12.2.42 2014/02/25 22:49:14 brentd Exp $ -->
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
