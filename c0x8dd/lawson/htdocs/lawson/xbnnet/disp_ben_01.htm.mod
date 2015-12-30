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
var vPlanGroup = parent.parent.EligPlanGroups[parent.parent.CurrentPlanGroup][0];

if (vPlanGroup == parent.parent.gMedicalPlanGroup)
{// MEDICAL
	if (parent.parent.CurrentBens[parent.parent.planname][2] == parent.parent.gMedPpoPlan)
	{
		parent.parent.gHasMedPpoPlan = true;
		parent.parent.gHasMedHighPlan = false;
		parent.parent.gHasMedHighFamily = false;
		parent.parent.gHasMedHighSingle = false;
	}
	if (parent.parent.CurrentBens[parent.parent.planname][2] == parent.parent.gMedHighPlan)
	{
		parent.parent.gHasMedPpoPlan = false;
		parent.parent.gHasMedHighPlan = true;
		var vCovOpt = parent.parent.CurrentBens[parent.parent.planname][23];
		if (vCovOpt.toUpperCase() == parent.parent.gMedicalSingleCoverage.toUpperCase())
			parent.parent.gHasMedHighSingle = true;
		else
			parent.parent.gHasMedHighFamily = true;
	}
}
// END OF MOD

function startProgram()
{
	setWinTitle(getSeaPhrase("ENROLL_PLAN","BEN"));
	parent.parent.choice = 1; // PT121317,PT119875: default to first coverage option on new plan
	for (var i=1; i<parent.parent.SelectedPlan.length; i++)
	{
		//check to see if coverage exists
		if (parent.parent.SelectedPlan[i][1]==parent.parent.CurrentBens[parent.parent.planname][16])
		{
			parent.newPlan = i;
			parent.parent.choice = i;
			parent.button1 = 1;
			//check to see if the dependent button should show
			if (parent.parent.SelectedPlan[i][16]!="N" && parent.parent.SelectedPlan[i][16]!="E")
				parent.button5 = 1;
			break;
		}
	}
	//check to see that there are other coverage levels
	if ((parent.newPlan>0 && parent.parent.SelectedPlan.length>1) || parent.parent.SelectedPlan.length>2)
		parent.button2 = 1;
	var maxPlansElected = false;
	//check to see that there are other plans
	if ((parent.newPlan==0 && parent.plangroup>0) || (parent.newPlan!=0 && parent.plangroup>1) || parent.plangroup>1 
	|| (parent.plangroup==1 && (parent.GrpPlans[0][1]!=parent.parent.CurrentBens[parent.parent.planname][1] || parent.GrpPlans[0][2]!=parent.parent.CurrentBens[parent.parent.planname][2])))
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
	var addlStr = '';
	var html = ''
	var head=''
	var bod=''
	var bod1=''
	var bod2=''
	var bod3=''
	head+='<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" style="width:100%;margin-left:auto;margin-right:auto" styler="list" summary="'+getSeaPhrase("TSUM_12","BEN",[parent.parent.CurrentBens[parent.parent.planname][5]])+'">'
	head+='<caption class="offscreen">'+getSeaPhrase("TCAP_11","BEN",[parent.parent.CurrentBens[parent.parent.planname][5]])+'</caption>' 
	head+='<tr><th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("AS_OF","BEN")+'</th>'
	head+='<th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("COV_TYPE","BEN")+'</th>'
	bod+='<tr><td class="plaintablecellborder" style="text-align:center">&nbsp;'+parent.parent.currentdate+'</td><td class="plaintablecellborder" nowrap>&nbsp;'+parent.parent.CurrentBens[parent.parent.planname][23]+'</td>'
	bod2+='<tr><td class="plaintablecellborder" style="text-align:center">&nbsp;'+parent.parent.newdate+'</td><td class="plaintablecellborder" nowrap>&nbsp;'+parent.parent.CurrentBens[parent.parent.planname][23]+'</td>'
	bod3+='<tr><td class="plaintablecellborder" style="text-align:center">&nbsp;</td><td class="plaintablecellborderright">&nbsp;</td>'
	if (parent.newPlan>0 && (parent.flxcost!=0 || parent.parent.SelectedPlan[parent.newPlan][6]!=''))
	{
		head+='<th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("FLEX_CR","BEN")+'</th>'
		bod+='<td class="plaintablecellborderright">&nbsp;'+parent.parent.formatCont(parent.flxcost)+'</td>'
		bod2+='<td class="plaintablecellborderright">&nbsp;'+parent.parent.formatCont(parent.parent.SelectedPlan[parent.newPlan][6])+'</td>'
		bod3+='<td class="plaintablecellborder">&nbsp;</td>'
	}
	if (parent.newPlan>0 && (parent.empcost!=0 || parent.parent.SelectedPlan[parent.newPlan][5]!=''))
	{
		head+='<th scope="col" class="plaintableheaderborder" style="text-align:center" colspan="2">'+getSeaPhrase("YOUR_COST","BEN")+'</th>'
		if (parent.empcost!=0)
		{
			if (parent.parent.CurrentBens[parent.parent.planname][13] == "B")
			{
				if (parent.empcst1!=0)
				{
					bod+='<td class="plaintablecellborderright">'+parent.parent.formatCont(parent.empcst1)+'</td><td class="plaintablecellborder" nowrap>&nbsp;'+parent.parent.displayTaxable("P")
					if(parent.parent.EMP_CONT_TYPE=="P")
						bod+=getSeaPhrase("PER","BEN")	
					bod+='</td>'	
				}
				else
				{
					if (parent.empcst2!=0)
					{
						bod+='<td class="plaintablecellborderright">'+parent.parent.formatCont(parent.empcst2)+'</td><td class="plaintablecellborder" nowrap>&nbsp;'+parent.parent.displayTaxable("A")
						if(parent.parent.EMP_CONT_TYPE=="P")
							bod+=getSeaPhrase("PER","BEN")	
						bod+='</td>'					
					}
					else
						bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'				
				}
				if (parent.empcst1!=0 && parent.empcst2!=0)
				{
					bod3+='<td class="plaintablecellborderright">'+parent.parent.formatCont(parent.empcst2)+'</td><td class="plaintablecellborder" nowrap>&nbsp;'+parent.parent.displayTaxable("A")
					if(parent.parent.EMP_CONT_TYPE=="P")
						bod3+=getSeaPhrase("PER","BEN")	
					bod3+='</td>'	
				}
				else
					bod3+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'								
			}
			else
			{		
				bod+='<td class="plaintablecellborderright">&nbsp;'+parent.parent.formatCont(parent.empcost)
				if(parent.parent.EMP_CONT_TYPE=="P")
					bod+=getSeaPhrase("PER","BEN")
				bod+='</td><td class="plaintablecellborder">&nbsp;'+parent.parent.displayTaxable(parent.taxable)+'</td>'
				bod3+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'
			}
		}
		else
			bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'
		if (parent.parent.SelectedPlan[parent.newPlan][5]!="" && parent.parent.SelectedPlan[parent.newPlan][5]!=0)
		{
			bod2+='<td class="plaintablecellborderright">&nbsp;'+parent.parent.formatCont(parent.parent.SelectedPlan[parent.newPlan][5])
			if (parent.parent.EMP_CONT_TYPE=="P")
				bod2+=getSeaPhrase("PER","BEN")
			bod2+='</td><td class="plaintablecellborder">&nbsp;'	
			if (parent.parent.CurrentBens[parent.parent.planname][13] == "B" && parent.parent.SelectedPlan[parent.newPlan][4])
				bod2+=parent.parent.displayTaxable(parent.parent.SelectedPlan[parent.newPlan][4]);
			else
				bod2+=parent.parent.displayTaxable(parent.taxable);			
			bod2+='</td>'
		}
		else
			bod2+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'
	}
	if (parent.newPlan>0 && (parent.compcost!=0 || parent.parent.SelectedPlan[parent.newPlan][8]!=''))
	{
		head+='<th scope="col" class="plaintableheaderborder">'+getSeaPhrase("CO_COST","BEN")+'</th>'
		if(parent.compcost!=0)
		{
			bod+='<td class="plaintablecellborderright">&nbsp;'+parent.parent.formatCont(parent.compcost)
			if (parent.parent.EMP_CONT_TYPE=="P")
				bod+=getSeaPhrase("PER","BEN")
			bod+='</td>'	
		}
		else
			bod += '<td class="plaintablecellborder">&nbsp;</td>'
		if (parent.parent.SelectedPlan[parent.newPlan][8]!="" && parent.parent.SelectedPlan[parent.newPlan][8]!=0)
		{
			bod2+='<td class="plaintablecellborderright">&nbsp;'+parent.parent.formatCont(parent.parent.SelectedPlan[parent.newPlan][8])
			if (parent.parent.EMP_CONT_TYPE=="P")
				bod2+=getSeaPhrase("PER","BEN")
			bod2+='</td>'	
		}
		else
			bod2+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'
		bod3+='<td class="plaintablecellborder">&nbsp;</td>'	
	}
	head+='</tr>'
	bod+='</tr>'
	bod2+='</tr>'
	bod3+='</tr>'
	html += '<form name="options">'
	html += head
	html += bod
	if (parent.empcst1!=0 && parent.empcst2!=0 && parent.parent.CurrentBens[parent.parent.planname][13] == "B")
		html += bod3;
	if (parent.parent.CurrentBens[parent.parent.planname][14]=="N")
	{
		parent.button1 = 0;
		parent.button2 = 0;
		// PT 150929. Plan is no longer available; do not allow change of dependents only.
		parent.button5 = 0;
		parent.parent.CurrentEligPlan = "";
		addlStr += getSeaPhrase("DISPBEN_4","BEN")+' ';
	}
	else
	{
		if (parent.button1==0)
		{
			// PT 150929. Coverage level is no longer available; do not allow change of dependents only.
			parent.button5 = 0;	  
// MOD BY BILAL
//			addlStr += getSeaPhrase("DISPBEN_22","BEN")+' ';
		        // JRZ 1/27/09 Changing wording to stand out more
			html+='<TR><TD colspan=5>';
		        html+='<div style="font-size:0.9em;width:300px;border-style:solid;border-width:1px;border-color:#ff0000;color:#ff0000;padding:5px;">'
		        if(parent.parent.SLRMC.isDualDiscount(parent.parent.CurrentBens[parent.parent.planname])) {
		          html+='<img style="margin:10px;float:left" src="/lawson/xbnnet/images/warning-icon.gif"/>Dual Discount has changed codes in the system<br/>'
		          html='If you still want Dual Discount,<br/>';
		          html+='click on "Change the dependent coverage" below to elect it again<br/>';
		        }
		        else {
		          html+='<img style="margin:10px;float:left" src="/lawson/bnnet/images/warning-icon.gif"/>The "Family" Coverage Type is no longer available.<br/>'
		          html+='More Family plan options have been added to save you money.<br/>';
		          html+='Click on "Change the dependent coverage" below to select a new one.<br/>';
		        }
		        html+='</div></td></tr>'
		        //~JRZ
// END OF MOD
		}
		else
		{
			parent.parent.setpreaft_flag(parent.parent.CurrentBens[parent.parent.planname][13]);
			parent.parent.choice = parent.newPlan;
			parent.parent.setpreaft_flag(parent.parent.SelectedPlan[parent.parent.choice][4]);
			if (parent.parent.BenefitRules[0]=="A")
				html += bod2;
		}
	}
	html += '</table><br/>'	
// MOD BY BILAL
		// CGL 1/19/2011 - Add Healthy U credit notice in box to medical plan screens.
        if(parent.parent.CurrentBens[parent.parent.planname][32] == "MEDICAL") {
			html+='<div style="font-size:0.9em;width:400px;border-style:solid;border-width:1px;border-color:#ff0000;color:#ff0000;padding:5px;">';
			html+='<b>Complete the Healthy U requirements to earn credits to reduce your medical premiums!</b><br/>';
			html+='</div><br>';
			}
		// ~CGL
// END OF MOD	
// MOD BY BILAL
	if(parent.flxcost!=0 || parent.empcost!=0 || parent.compcost!=0) {
//		addlStr += '<br>'+parent.parent.costdivisor
		html    += '<div style="text-align:center;width:400px;">'+parent.parent.costdivisor + '</div><br>'
	}
// END OF MOD
	html += parent.parent.writeDepPortion(parent.parent.currentdate, parent.parent.CurrentBens[parent.parent.planname][5])
	//PT 150062
	//if (parent.parent.choice)
	//	parent.parent.SelectedPlan[parent.parent.choice][24] = parent.parent.CurrentBens[parent.parent.planname][11]
	if (parent.flxcost!=0 || parent.empcost!=0 || parent.compcost!=0)
		addlStr += parent.parent.costdivisor+' ';
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
	html += '<div role="radiogroup">'
	html += '<table class="plaintableborder" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin-left:auto;margin-right:auto" styler="list" summary="'+getSeaPhrase("TSUM_13","BEN",[parent.parent.CurrentBens[parent.parent.planname][5]])+'">'
	html += '<caption class="offscreen">'+getSeaPhrase("TCAP_12","BEN",[parent.parent.CurrentBens[parent.parent.planname][5]])+'</caption>'
	html += '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("SELECT","BEN")+'</th>' 
	html += '<th scope="col" class="plaintableheaderborder" style="width:100%;text-align:center">'+getSeaPhrase("OPTION","BEN")+'</th></tr>'  
// MOD BY BILAL - Prior Customization
		//ISH 2007 Remove and change description of links
    // JRZ 2/13/09 If last year's plan isn't eligible this year due to elections you made (like PILB or Tobacco)
    //  		   then don't allow keeping last years plan or changing dependents, allowing election would be incorrect
if(parent.parent.SLRMC.isPlanVisible(parent.parent.company,parent.parent.CurrentBens[parent.parent.planname][32],parent.parent.CurrentBens[parent.parent.planname][2],parent.parent.ElectedPlans)) {
	if (parent.button1!=0 && parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][12]=="Y") 
	{
		html += '<tr><td class="plaintablecellborder" style="text-align:center">'
		html += '<input type="radio" id="option0" name="option" value="0" onclick="styleElement(this);"></td>'
		html += '<td class="plaintablecellborder"><label for="option0">'+getSeaPhrase("DISPBEN_23","BEN")+'</label></td></tr>'
	}
	if (parent.button5!=0 && parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][12]=="Y" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][17]==1) 
	{
		html += '<tr><td class="plaintablecellborder" style="text-align:center">'
		html += '<input type="radio" id="option2" name="option" value="2" onclick="styleElement(this);"></td>'
		html += '<td class="plaintablecellborder"><label for="option2">'+getSeaPhrase("DISPBEN_27","BEN")+'</label></td></tr>'
	}
	if (parent.button2!=0 && parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][12]=="Y" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][17]==1) 
	{
		html += '<tr><td class="plaintablecellborder" style="text-align:center">'
		html += '<input type="radio" id="option1" name="option" value="1" onclick="styleElement(this);"></td>'
		html += '<td class="plaintablecellborder"><label for="option1">'+getSeaPhrase("DISPBEN_24","BEN")+'</label></td></tr>'
	}  
}
// END OF MOD	isPlanVisible()
	if (parent.button3!=0 && (parent.parent.CurrentEligPlan=="" || (parent.parent.EligPlans[parent.parent.CurrentEligPlan][14]=="Y" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][17]==1))) 
	{
		html += '<tr><td class="plaintablecellborder" style="text-align:center">'
		html += '<input type="radio" id="option3" name="option" value="3" onclick="styleElement(this);"></td>'
		html += '<td class="plaintablecellborder"><label for="option1">'+getSeaPhrase("DISPBEN_25","BEN")+'</label></td></tr>'
	}
//	if (parent.button4!=0 && parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][14]=="Y" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][17]==1) 
//	{
//		html += '<tr><td class="plaintablecellborder" style="text-align:center">'
//		html += '<input type="radio" id="option4" name="option" value="4" onclick="styleElement(this);"></td>'
//		html += '<td class="plaintablecellborder"><label for="option4">'+getSeaPhrase("DISPBEN_26","BEN")+'</label></td></tr>'
//	} 
		//ISH End	
// END OF MOD
	html += '</table></div><p class="textAlignRight">'	
// MOD BY BILAL  - Styling the buttons as per St Luke's
	html += '<center>'
//	html += uiButton(getSeaPhrase("CONTINUE","BEN"),"parent.parseChoice(this.form);return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
//	html += uiButton(getSeaPhrase("EXIT","BEN"),"parent.parent.quitEnroll(parent.location);return false","margin-right:5px;margin-top:10px",null,'aria-haspopup="true"')
	html += uiButton(getSeaPhrase("CONTINUE","BEN"),"parent.parseChoice(this.form);return false","margin-right:5px;margin-top:10px")
	html += "&nbsp;&nbsp;"
	html += uiButton(getSeaPhrase("EXIT","BEN"),"parent.parent.quitEnroll(parent.location);return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px",null,'aria-haspopup="true"')
// END OF MOD
	html += '</p></form>'  	
// END OF MOD
		// JRZ adding EPO reminder
		if(typeof(parent.parent.EligPlans[parent.parent.CurrentEligPlan]) != "undefined") {
			var currentCode = escape(parent.parent.EligPlans[parent.parent.CurrentEligPlan][2],1);
			// CGL 1/13/2011 - Note that EPO reminder is now displayed for all med plans; using existing code and expanding to include other med plans.
			if(parent.parent.SLRMC.isEPOPlan(parent.parent.company,currentCode)) {
        			html+=parent.parent.SLRMC.EPOReminder(parent.rule_type);
			}
		}
		//~JRZ
//MOD BY BILAL - Moving to Top
//	bod1 += parent.header(addlStr);	   
// END OF MOD
	var page = '<div class="plaintablecell" style="padding:0px">'	
	page += bod1
	page += html
	page += '</div>'
	document.getElementById("paneBody").innerHTML = page;
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
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/disp_ben_01.htm,v 1.16.2.51 2014/02/25 22:49:14 brentd Exp $ -->
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
