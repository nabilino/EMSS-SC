<html>
<head>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script>
function startProgram()
{
	var head=""
	var bod=""
	var bod2=""
	var bod3=""
	var addlStr = "";
	var html = '<div class="plaintablecell" style="padding:10px">'

	parent.button1=1
	parent.button2=1

	var maxPlansElected = false;

	if(parent.plangroup>1 || (parent.plangroup==1 && (parent.GrpPlans[0][1]!=parent.parent.CurrentBens[parent.parent.planname][1]
	|| parent.GrpPlans[0][2]!=parent.parent.CurrentBens[parent.parent.planname][2])))
	{
		var noOfPlan = 0;
		for(var i=1; i<parent.parent.EligPlans.length; i++)
		{
				if(parent.parent.EligPlans[i][8]==parent.parent.EligPlanGroups[parent.parent.CurrentPlanGroup][0] && parent.parent.selectedPlanInGrp[i]==true)
				{
						noOfPlan++ ;
				}
		}
		if (noOfPlan < parent.parent.EligPlanGroups[parent.parent.CurrentPlanGroup][1])
		{
			parent.button3=1
		}
		else
		{
			maxPlansElected = true;
		}
	}

	// if the maximum hours to buy or sell has decreased from the previous election,
	// force the user to make a new election.
	var currentMaxHrs = parseFloat(parent.parent.CurrentBens[parent.parent.planname][30]);
	var newMaxHrs = parseFloat(parent.parent.SelectedPlan[19]);
	if(!isNaN(currentMaxHrs) && !isNaN(newMaxHrs) && currentMaxHrs > newMaxHrs)
	{
		parent.button1=0
	}
	if(parent.parent.CurrentBens[parent.parent.planname][14]=="N")
	{
		parent.button1=0
		parent.button2=0
	}

	var divisor=1
	if(parent.parent.BenefitRules[6]=="P")
		divisor=parent.parent.SelectedPlan[37]
	else if(parent.parent.BenefitRules[6]=="M")
		divisor=12
	else if(parent.parent.BenefitRules[6]=="S")
		divisor=24

	if(parent.parent.CurrentBens[parent.parent.planname][30]=="")
		parent.parent.CurrentBens[parent.parent.planname][30]=0

	if(parent.parent.CurrentBens[parent.parent.planname][35]=="")
		parent.parent.CurrentBens[parent.parent.planname][35]=0

	head+='<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" styler="list">'
		+'<TR><TH class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("AS_OF","BEN")+'</TH>'
		+'<TH class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("NBR_OF_HOURS","BEN")+'</TH>'
		+'<TH class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("HR_RATE","BEN")+'</TH>'
	bod+='<TR><TD class="plaintablecellborder" align=center>&nbsp;'+parent.parent.currentdate+'</TD>'
		+'<TD class="plaintablecellborder" align=right>&nbsp;'+parent.parent.formatCont(parent.parent.CurrentBens[parent.parent.planname][30])+'</TD>'
		+'<TD class="plaintablecellborder" align=right>&nbsp;'+parent.parent.formatCont(parent.parent.CurrentBens[parent.parent.planname][35])+'</TD>'
	bod2+='<TR><TD class="plaintablecellborder" align=center>&nbsp;'+parent.parent.newdate+'</TD>'
		+'<TD class="plaintablecellborder" align=right>&nbsp;'+parent.parent.formatCont(parent.parent.CurrentBens[parent.parent.planname][30])+'</TD>'
		+'<TD class="plaintablecellborder" align=right>&nbsp;'+parent.parent.formatCont((parent.parent.SelectedPlan[23]*parent.parent.SelectedPlan[21])/100)+'</TD>'
	bod3+='<TR><TD class="plaintablecellborder" align=center>&nbsp;</TD><TD class="plaintablecellborder" align=right>&nbsp;</TD>'
	bod3+='<TD class="plaintablecellborder" align=center>&nbsp;</TD>'

	if((parseFloat(parent.flxcost)!=0 && !isNaN(parent.parent.unFormat(parent.flxcost)))
		|| (parent.parent.SelectedPlan[18] && parent.parent.SelectedPlan[18]!="" && parent.parent.SelectedPlan[18]!=0))
	{
		head+='<TH class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("FLEX_CR","BEN")+'</TH>'
		bod+='<TD class="plaintablecellborder" align=right>&nbsp;'+parent.parent.formatCont(parent.flxcost)+'</TD>'
		bod2+='<TD class="plaintablecellborder" align=right>&nbsp;'+parent.parent.formatCont((parent.parent.SelectedPlan[18]*parent.parent.CurrentBens[parent.parent.planname][30])/divisor)+'</TD>'
		bod3+='<TD class="plaintablecellborder">&nbsp;</TD>'
	}
	if((parseFloat(parent.empcost)!=0 && !isNaN(parent.parent.unFormat(parent.empcost)))
		|| (parent.parent.SelectedPlan[16] && parent.parent.SelectedPlan[16]!="" && parent.parent.SelectedPlan[16]!=0))
	{
		head+='<TH class="plaintableheaderborder" style="text-align:center" colspan=2 nowrap>'+getSeaPhrase("YOUR_COST","BEN")+'</TH>'
		if(parent.empcost!=0)
		{
			if(parent.parent.CurrentBens[parent.parent.planname][13] == "B")
			{
				if(parent.empcst1!=0)
				{
					bod+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(parent.empcst1)+'</TD><TD class="plaintablecellborder" nowrap>&nbsp;'+parent.parent.displayTaxable("P")
					if(parent.parent.EMP_CONT_TYPE=="P")
						bod+=getSeaPhrase("PER","BEN")	
					bod+='</TD>'	
				}
				else
					bod+='<TD class="plaintablecellborder">&nbsp;</TD><TD class="plaintablecellborder">&nbsp;</TD>'
				if(parent.empcst2!=0)
				{
					bod3+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(parent.empcst2)+'</TD><TD class="plaintablecellborder" nowrap>&nbsp;'+parent.parent.displayTaxable("A")
					if(parent.parent.EMP_CONT_TYPE=="P")
						bod3+=getSeaPhrase("PER","BEN")	
					bod3+='</TD>'	
				}
				else
					bod3+='<TD class="plaintablecellborder">&nbsp;</TD><TD class="plaintablecellborder">&nbsp;</TD>'								
			}
			else
			{		
				bod+='<TD class="plaintablecellborder" align=right>&nbsp;'+parent.parent.formatCont(parent.empcost)
				if(parent.parent.EMP_CONT_TYPE=="P")
					bod+=getSeaPhrase("PER","BEN")
				bod+='</TD><TD class="plaintablecellborder">&nbsp;'+parent.parent.displayTaxable(parent.taxable)+'</TD>'
			}
		}
		else
			bod+='<TD class="plaintablecellborder">&nbsp;</TD><TD class="plaintablecellborder">&nbsp;</TD>'
		if(parent.parent.SelectedPlan[16]!=0)
		{
			bod2+='<TD class="plaintablecellborder" align=right>&nbsp;'+parent.parent.formatCont((parent.parent.SelectedPlan[16]*parent.parent.CurrentBens[parent.parent.planname][30])/divisor)
			if(parent.parent.EMP_CONT_TYPE=="P")
				bod2+=getSeaPhrase("PER","BEN")
	    	bod2+='</TD><TD class="plaintablecellborder">&nbsp;'
			if(parent.parent.CurrentBens[parent.parent.planname][13] == "B" && parent.parent.SelectedPlan[28])
				bod2+=parent.parent.displayTaxable(parent.parent.SelectedPlan[28]);
			else
				bod2+=parent.parent.displayTaxable(parent.taxable);	    	
	    	bod2+='</TD>'
		}
		else
			bod2+='<TD class="plaintablecellborder">&nbsp;</TD><TD class="plaintablecellborder">&nbsp;</TD>'
	}

	if((parseFloat(parent.compcost)!=0 && !isNaN(parent.parent.unFormat(parent.compcost)))
		|| (parent.parent.SelectedPlan[22] && parent.parent.SelectedPlan[22]!="" && parent.parent.SelectedPlan[22]!=0))
	{
		head+='<TH class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("CO_COST","BEN")+'</TH>'
		if(parent.compcost!=0)
		{
			bod+='<TD class="plaintablecellborder" align=right>&nbsp;'+parent.parent.formatCont(parent.compcost)
			if(parent.parent.EMP_CONT_TYPE=="P")
				bod+=getSeaPhrase("PER","BEN")
			bod+='</TD>'	
		}
		else
			bod+='<TD class="plaintablecellborder">&nbsp;</TD>'
		if(parent.parent.SelectedPlan[22]!=0)
		{
			bod2+='<TD class="plaintablecellborder" align=right>&nbsp;'+parent.parent.formatCont(parent.parent.SelectedPlan[22])
			if(parent.parent.EMP_CONT_TYPE=="P")
				bod2+=getSeaPhrase("PER","BEN")
			bod2+='</TD>'	
		} 
		else
			bod2+='<TD class="plaintablecellborder">&nbsp;</TD>'
		bod3+='<TD class="plaintablecellborder">&nbsp;</TD>'
	}

	bod+='</TR>'
	bod2+='</TR>'
	bod3+='</TR>'

	html += '<table border="0" cellpadding="0" cellspacing="0">'
	html += '<tr><td class="plaintablecell" valign="top" colspan="2">'

	html += head
	html += bod
	if (parent.empcst2!=0 && parent.parent.CurrentBens[parent.parent.planname][13] == "B")
		html += bod3	
	if(parent.button1 != 0 && parent.parent.BenefitRules[0]=="A")
		html += bod2
	html += '</table><br>'

	if(parent.flxcost!=0 || parent.empcost!=0 || parent.compcost!=0)
	{
		addlStr += '<br>'+parent.parent.costdivisor
	}

	//PT118701: check if plan has already been elected
	for (var i=1;i<parent.parent.EligPlans.length;i++)
	{
    	if (parent.parent.EligPlans[i][1]==parent.parent.CurrentBens[parent.parent.planname][1]
		&& parent.parent.EligPlans[i][2]==parent.parent.CurrentBens[parent.parent.planname][2])
		{
			if (parent.parent.selectedPlanInGrp[i]) {
				parent.button1 = 0;
				parent.button2 = 0;
				addlStr += '<br>'+getSeaPhrase("ALREADY_ELECTED","BEN")+'<br>';
				break;
			}
		}
	}

	if (maxPlansElected) {
			parent.button1 = 0;
			parent.button2 = 0;
			parent.button5 = 0;
			addlStr += '<br>'+getSeaPhrase("MAX_PLAN","BEN")+'<br>';
	}

	if(parent.parent.CurrentBens[parent.parent.planname][14]=="N")
	{
		parent.button1=0
		parent.button2=0
		parent.parent.CurrentEligPlan=""
		addlStr += '<br>'+getSeaPhrase("DISPBEN_4","BEN")
	}
	else
	{
		if(parent.button1==0) {
			addlStr += '<br>'+getSeaPhrase("DISPBEN_28","BEN")
		} else {
			parent.parent.NbrHours=parseFloat(parent.parent.CurrentBens[parent.parent.planname][30])
			parent.parent.SelectedPlan[23]=parent.parent.NbrHours
			parent.parent.SelectedPlan[16]=(parent.parent.SelectedPlan[16]*parent.parent.NbrHours)/divisor
			parent.parent.SelectedPlan[18]=(parent.parent.SelectedPlan[18]*parent.parent.NbrHours)/divisor
			parent.parent.SelectedPlan[22]=""
			parent.parent.setpreaft_flag(parent.parent.SelectedPlan[28])
		}
	}

	html += '</td></tr>'
	html += '<tr><td class="plaintablecell" valign="top">'

	html += '<form name="options">'
	html += '<table class="plaintableborder" cellspacing="0" cellpadding="0" border="0" styler="list"><tr>'
	//html += '<th class="plaintablecellborder" nowrap>'+getSeaPhrase("DISPBEN_6","BEN")+'</th>'
	html += '<th class="plaintableheaderborder" style="text-align:center">'
	html += getSeaPhrase("OPTION","BEN")+'</th>'
	html += '<th class="plaintableheaderborder" style="text-align:center">'
	html += getSeaPhrase("SELECT","BEN")+'</th></tr>'

// MOD BY BILAL - Prior Customization
	//ISH 2007 RENAME AND MODIFY LINK
	if(parent.button1!=0 && parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][12]=="Y") {
		html += '<tr>'
//		html += '<td class="plaintablerowheaderborder" style="text-align:right">'+getSeaPhrase("DISPBEN_23","BEN")+'</td>'
		html += '<td class="plaintablerowheaderborder" style="text-align:right">'+'keep the same coverage.'+'</td>'
		html += '<td class="plaintablecellborder" style="text-align:center">'
		html += '<input type="radio" name="option" value="0"></td></tr>'
		//html += '<a href="javascript:parent.setTaxType()">'+getSeaPhrase("DISPBEN_23","BEN")+'</a><br>'
	}
	if(parent.button2!=0 && parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][12]=="Y" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][17]==1) {
		html += '<tr>'
//		html += '<td class="plaintablerowheaderborder" style="text-align:right">'+getSeaPhrase("DISPBEN_24","BEN")+'</td>'
		html += '<td class="plaintablerowheaderborder" style="text-align:right">'+'change the coverage.'+'</td>'
		html += '<td class="plaintablecellborder" style="text-align:center">'
		html += '<input type="radio" name="option" value="1"></td></tr>'
		//html += '<a href="javascript:parent.parent.selOption(4)">'+getSeaPhrase("DISPBEN_24","BEN")+'</a><br>'
	}
	if(parent.button3!=0 && (parent.parent.CurrentEligPlan=="" || (parent.parent.EligPlans[parent.parent.CurrentEligPlan][14]=="Y" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][17]==1))) {
		html += '<tr>'
//		html += '<td class="plaintablerowheaderborder" style="text-align:right">'+getSeaPhrase("DISPBEN_25","BEN")+'</td>'
		html += '<td class="plaintablerowheaderborder" style="text-align:right">'+'select a different plan or waive plan.'+'</td>'
		html += '<td class="plaintablecellborder" style="text-align:center">'
		html += '<input type="radio" name="option" value="3"></td></tr>'
		//html += '<a href="javascript:parent.parent.selOption(1)">'+getSeaPhrase("DISPBEN_25","BEN")+'</a><br>'
	}
//	if(parent.button4!=0 && parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][14]=="Y" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][17]==1) {
//		html += '<tr>'
//		html += '<td class="plaintablerowheaderborder" style="text-align:right">'+getSeaPhrase("DISPBEN_26","BEN")+'</td>'
//		html += '<td class="plaintablecellborder" style="text-align:center">'
//		html += '<input type="radio" name="option" value="4"></td></tr>'
//		//html += '<a href="javascript:parent.parent.selOption(3)">'+getSeaPhrase("DISPBEN_26","BEN")+'</a><br>'
//	}
	html += '</table>'
	html += '<p>'
	html += uiButton(getSeaPhrase("CONTINUE","BEN"),"parent.parseChoice(this.form);return false","margin-top:10px")
	html += uiButton(getSeaPhrase("EXIT","BEN"),"parent.parent.quitEnroll(parent.location);return false","margin-right:0px;margin-top:10px")
	html += '</p>'
	html += '</form>'

	html += '</td><td class="plaintablecell" valign="top">'

	html += parent.header('<br>'+addlStr)

	html += '</td></tr>'
	html += '</table>'

	html += '</div>'

	parent.parent.removeWaitAlert();
	if (typeof(parent.parent.parent.removeWaitAlert) != "undefined") {
		parent.parent.parent.removeWaitAlert();
	}
	document.getElementById("paneBody").innerHTML = html
	document.getElementById("paneHeader").innerHTML = '<span>'+getSeaPhrase("ENROLLMENT_ELECTIONS","BEN")+' - '+parent.parent.CurrentBens[parent.parent.planname][32]+'</span>';
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
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/disp_ben_07.htm,v 1.13.2.15 2010/04/02 14:48:54 brentd Exp $ -->
