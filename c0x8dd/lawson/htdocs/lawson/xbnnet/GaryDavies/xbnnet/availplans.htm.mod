<html>
<head>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script>
var ch=""
parent.choice=0
parent.actiontaken=1
if(parent.clearGroup)
{
	var temp=new Array()
	var tempdepbens = new Array()
	for(var j=0; j<parent.ElectedPlans.length; j++) 
	{
		if(parent.ElectedPlans[j][3]!=parent.EligPlanGroups[parent.CurrentPlanGroup][0]) 
		{
			temp[temp.length]=new Array()
			temp[temp.length-1]=parent.ElectedPlans[j]
			tempdepbens[tempdepbens.length]=new Array()
			tempdepbens[tempdepbens.length-1]=parent.DependentBens[j]
		}
	}
	parent.ElectedPlans=new Array()
	parent.ElectedPlans=temp
	parent.DependentBens=new Array()
	parent.DependentBens=tempdepbens
	parent.clearGroup=false
}
function imgSwitch(img,plan)
{
	parent.choice=plan
    parent.CurrentEligPlan=plan
}
function back()
{
	parent.document.getElementById("main").src = parent.LastDoc[0]
}
// function to navigate to the election screen
function ElectBen()
{
	if(self.document.listform.length>0) 
	{
		parent.choices = new Array()
		parent.selectedPlan=-1		
		if(ch!="") 
		{
			for(var i=0; i<self.document.listform.length; i++) 
			{
				if(self.document.listform.elements[i].checked==true) 
				{
					parent.choices[parent.choices.length]=self.document.listform.elements[i].name.substring(1,self.document.listform.elements[i].name.length)
					if(parent.CurrentBens[parent.planname] && parent.EligPlans[parent.choices[parent.choices.length-1]][1]==parent.CurrentBens[parent.planname][1] &&
					parent.EligPlans[parent.choices[parent.choices.length-1]][2]==parent.CurrentBens[parent.planname][2])
						parent.selectedPlan=parent.choices[parent.choices.length-1]
				}
			}
			parent.currentChoice=0
		}
		if((parent.msgNbr==1 || parent.msgNbr==99) && parent.selectedPlan==-1 && parent.CurrentBens[parent.planname] && parent.CurrentEligPlan!="") {
				parent.CurrentBens[parent.planname][0]=new Array()
				parent.CurrentBens[parent.planname][0][0]=1

				for(var i=0; i<parent.EligPlans.length; i++) 
				{
					if(parent.CurrentBens[parent.planname][1] == parent.EligPlans[i][1] && parent.CurrentBens[parent.planname][2] == parent.EligPlans[i][2])
					{
						parent.CurrentBens[parent.planname][0][1]=parent.EligPlans[i][11]
						parent.CurrentBens[parent.planname][0][2]=parent.EligPlans[i][13]
						parent.CurrentBens[parent.planname][0][3]=parent.EligPlans[i][15]						
					}
				}	                                                               					
		}
		if (parent.choice==0) 
		{
			if(ch=="")
				parent.seaAlert(getSeaPhrase("ERROR_CHOOSE_PLAN_1","BEN"))
			else 
			{
				if(parent.choices.length==0)
					parent.seaAlert(getSeaPhrase("ERROR_CHOOSE_PLAN_2","BEN"))
				else 
				{
					if(parent.choices.length>parseInt(ch,10)) 
					{
						var alertmsg = getSeaPhrase("ERROR_CHOOSE_PLAN_3","BEN")+" "+parseInt(ch,10)
						if(parseInt(ch,10)==1)
							alertmsg += " "+getSeaPhrase("ERROR_CHOOSE_PLAN_4","BEN")
						else
							alertmsg += " "+getSeaPhrase("ERROR_CHOOSE_PLAN_5","BEN")
						parent.seaAlert(alertmsg)
					} 
					else 
					{
						parent.CurrentEligPlan=parent.choices[parent.currentChoice]
						parent.LastDoc[parent.LastDoc.length]=parent.baseurl+"availplans.htm"
						parent.currentdoc=parent.LastDoc.length-1
						parent.document.getElementById("main").src = parent.baseurl+"elect_benefits.htm"
					}
				}
			}
		} 
		else 
		{
			parent.LastDoc[parent.LastDoc.length]=parent.baseurl+"availplans.htm"
			parent.currentdoc=parent.LastDoc.length-1
			parent.document.getElementById("main").src = parent.baseurl+"elect_benefits.htm"
		}
	} 
	else
		parent.navigate1()
}

function startProgram()
{
	var header=""
	var table1=""
	var imgNbr=1
	var dspbox=false
	var plngroup=parent.EligPlanGroups[parent.CurrentPlanGroup][0]
	if(parent.EligPlanGroups[parent.CurrentPlanGroup][1]!=null && parent.EligPlanGroups[parent.CurrentPlanGroup][1]!=1
	&& parent.EligPlanGroups[parent.CurrentPlanGroup][1]!="") 
	{
		ch=parent.EligPlanGroups[parent.CurrentPlanGroup][1]
	}
// MOD BY BILAL 	-- Changed width to 60%	
// MOD BY BILAL
//	table1 += '<table border="0" cellpadding="0" cellspacing="0" width="60%">'
// MOD BY BILAL 
	table1 += '<CENTER><table border="0" cellpadding="0" cellspacing="0" width="60%">'
	table1 += '<tr><td class="plaintablecellborder"><b>' + getSeaPhrase("AVAILBEN_9","BEN") + '</b><br><br></td></tr>'
	table1 += '</table>'
	table1 += '<table border="0" cellpadding="0" cellspacing="0" width="60%">'
	table1 += '<tr><td class="plaintablecell" valign="top" align="center">'
// END OF MOD 	
	table1 += '<form name="listform">'
	table1 += '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" styler="list">'
	table1 += '<tr>'
	table1 += '<th class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("PLAN","BEN")+'</th>'
	if(parent.rule_type=="N")
		table1 += '<th class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("AVAILBEN_1","BEN")+'</th>'
	table1 += '<th class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("SELECT","BEN")+'</th>'
	table1 += '</tr>'
	for (var i=1; i<parent.EligPlans.length; i++) 
	{
		dspbox = true
		if(parent.EligPlans[i][8]==plngroup) 
		{
			if(parent.EligPlans[i][10]=="Y") 
			{
				var EOI=true

// MOD BY BILAL - Prior customization
	// JRZ 2/13/09 Use results of prior enrollment steps to determine eligibility for plan elections
          // generic plan visibility function, answers question: Based on prior elections, shoulw this plan be visible?

          if(!parent.SLRMC.isPlanVisible(parent.company,plngroup,parent.EligPlans[i][2],parent.ElectedPlans)) {
            continue;

          }
	//~JRZ
// END OF MOD

				table1 += '<tr>'
				table1 += '<td class="plaintablecellborder" nowrap>'
				table1 += '<a href="" onclick="parent.openWinDesc2(\''+parent.EligPlans[i][1]+'\',\''+parent.EligPlans[i][2]+'\');return false">'
				table1 += ((parent.EligPlans[i][4])?parent.EligPlans[i][4]:'&nbsp;')+'</a>'
				if(parent.selectedPlanInGrp[i])	
				{
					if(!parent.cantEnroll[i]) 
					{
						if(ch!="" && ch>1)
							ch--
						table1+=' <span class="fieldlabelbold">&nbsp;'+getSeaPhrase("AVAILBEN_2","BEN")+'</span>'
					} 
					else if (parent.notAvailable[i])
						table1+=' <span class="fieldlabelbold">&nbsp;'+getSeaPhrase("AVAILBEN_3","BEN")+'</span>'
					else
						table1+=' <span class="fieldlabelbold">&nbsp;'+getSeaPhrase("AVAILBEN_4","BEN")+'</span>'
				}
				table1+='</td>'
				if(parent.rule_type=="N")
					table1 += '<td class="plaintablecellborder">'+parent.FormatDte4(parent.EligPlans[i][5])+'</td>'
				table1 += '<td class="plaintablecellborder" style="text-align:center" nowrap>&nbsp;'
				if(ch=="") 
				{
					if(parent.EligPlans[i][17]==1) 
					{
						if(!parent.selectedPlanInGrp[i])
							table1 += '<input class="inputbox" type=radio name=one onClick=imgSwitch('+imgNbr+','+i+')>'
						else
							dspbox = false
					} 
					else
						EOI=false
				} 
				else 
				{
					if(parent.EligPlans[i][17]==1) 
					{
						if(!parent.selectedPlanInGrp[i])
							table1 += '<input class="inputbox" type=checkbox name="C'+i+'">'
						else
							dspbox = false
					} 
					else
						EOI=false
				}
				if(EOI==false) 
				{
					table1+='<br><span class="fieldlabelbold">'+getSeaPhrase("AVAILBEN_5","BEN")+'</span><br>'
					table1+='<span class="fieldlabelbold">'+getSeaPhrase("ERROR_12","BEN")+'</span>'
				}
				table1 += '</td>'
				if(dspbox)
					imgNbr++
				table1 += '</tr>'
			}
		}
	}
	table1 += '</table></form>'
	table1 += '<table border="0" cellpadding="0" cellspacing="0">'
	table1 += '<tr><td style="text-align:center">'	// MOD BY BILAL - Aligning in Center
	// MOD BY BILAL
	//Changing the Button styling per St. Lukes requirement.
//	table1 += uiButton(getSeaPhrase("CONTINUE","BEN"), "ElectBen();return false", "margin-top:10px")
	table1 += uiButton(getSeaPhrase("CONTINUE","BEN"), "ElectBen();return false", "font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")

	if(parent.LastDoc[0]==parent.baseurl+"disp_benefits.htm")
//		table1 += uiButton(getSeaPhrase("PREVIOUS","BEN"), "back();return false", "margin-top:10px")
		table1 += "&nbsp;&nbsp;" + uiButton(getSeaPhrase("PREVIOUS","BEN"), "back();return false", "font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
//	table1 += uiButton(getSeaPhrase("EXIT","BEN"), "parent.quitEnroll(self.location.href);return false", "margin-top:10px")
	table1 += "&nbsp;&nbsp;" + uiButton(getSeaPhrase("EXIT","BEN"), "parent.quitEnroll(self.location.href);return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
//	table1 += uiButton(getSeaPhrase("ELECTIONS","BEN"), "parent.printScr('newwindow');return false", "margin-top:10px")
	table1 += "<br>" + uiButton(getSeaPhrase("ELECTIONS","BEN"), "parent.printScr('newwindow');return false", "font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
	table1 += '</td></tr></table>'
// END OF MOD 
	table1 += '</td>'
// MOD BY BILAL  - Centralizing
//	table1 += '<td class="plaintablecell" valign="top">'
	table1 += '<td class="plaintablecell" valign="top" align=center>'
// END OF MOD
	table1 += '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0">'
// MOD BY BILAL -  Removing the Blank Header
//	table1 += '<tr>'
//	table1 += '<td class="plaintableheaderborder">&nbsp;</td></tr>'
// END OF MOD
	table1 += '<tr><td class="plaintablecellborder">'
	if(ch==null || parseInt(ch,10)==1 || ch=="") 
	{
// MOD BY BILAL - Prior customization

			// JRZ changing based on plan

			// CGL 1/12/2011 - Removing Tobacco Declaration processing

			if(plngroup == "TOBACCO DECLARATION") {

//				table1 +='Choose an option:'
				table1 +=''

			}
//			else
			// ~CGL
// END OF MOD
//		table1 += getSeaPhrase("AVAILBEN_9","BEN")
	} 
	else 
	{
		if(parseInt(ch,10)>imgNbr-1)
			ch=imgNbr-1
		table1 += getSeaPhrase("AVAILBEN_10","BEN")+'<br>'+getSeaPhrase("AVAILBEN_11","BEN")+' '+parseInt(ch,10)+' '
		if(parseInt(ch,10)==1)
			table1 += getSeaPhrase("ERROR_CHOOSE_PLAN_4","BEN")
		else
			table1 += getSeaPhrase("ERROR_CHOOSE_PLAN_5","BEN")
	}
	// **********************************************************************************************************
	// Example Enwisen Integration.
	//
	// If Enwisen is enabled in the config file for the employee's company and the "Medical Cost Estimator"
	// and "Learn About: Medical Programs" pages have been defined for this plan group in the
	// config file, show the links.
	//
	// **********************************************************************************************************
	if (isEnwisenEnabled())
	{
		table1 += '<ul>';
		var planGroup = parent.EligPlanGroups[parent.CurrentPlanGroup][0];
		// <page> nodes are defined with id="PlanGroup=ID"
		if (getEnwisenLink("id=" + planGroup + "=MEDICAL_COST_ESTIMATOR") != null)
			table1 += '<li style="padding:2px">' + getEnwisenLink("id=" + planGroup + "=MEDICAL_COST_ESTIMATOR","Medical Cost Estimator");
		if (getEnwisenLink("id=" + planGroup + "=YOUR_NEEDS_MEDICAL") != null)
			table1 += '<li style="padding:2px">' + getEnwisenLink("id=" + planGroup + "=YOUR_NEEDS_MEDICAL","Learn About: Medical Programs");
		table1 += '</ul>';
	}
	table1 += '</td></tr></table>'
	table1 += '</td></tr>'
// MOD BY BILAL - Prior customization
    // JRZ 2/13/09 Print out custom wording on the enrollment screen that lists the different plans to elect
    var wording = parent.SLRMC.availplanWording(parent.company,plngroup,parent.rule_type,parent.ElectedPlans);
	//~JRZ

	table1 += '<tr>'
	table1 += '<td class="plaintablecellborder"><BR>' + wording + '<BR></td></tr>'
// END OF MOD
	table1 += '</table>'
// MOD BY BILAL
	table1 += "</center>"
// END OF MOD
	document.getElementById("paneBody").innerHTML = '<div style="padding:10px">'
		+ table1
		+ '</div>'
	document.getElementById("paneHeader").innerHTML = '<span>'+getSeaPhrase("BEN_ELECT","BEN")+' - '+plngroup+'</span>';
	stylePage();
	document.body.style.visibility = "visible";
}
</script>
</head>
<body onload="setLayerSizes();startProgram()" style="visibility:hidden">
<div id="paneBorder" class="paneborder">
	<table id="paneTable" border="0" height="100%" width="100%" cellpadding="0" cellspacing="0">
	<tr><td style="height:16px">
		<div id="paneHeader" class="paneheader">&nbsp;</div>
	</td></tr>
	<tr><td>
		<div id="paneBodyBorder" class="panebodyborder" styler="groupbox"><div id="paneBody" class="panebody"></div>
		</div>
	</td></tr>
	</table>
</div>
</body>
</html>
<!-- Version: 8-)@(#)@(201111) 09.00.01.06.00 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/availplans.htm,v 1.20.2.12.2.1 2011/09/07 18:41:21 brentd Exp $ -->
