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
	if(parent.parent.CurrentBens[parent.parent.planname][14]=="Y")
		parent.button1=1

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
		//PT 160142
		if (noOfPlan < parent.parent.EligPlanGroups[parent.parent.CurrentPlanGroup][1])
		{
			parent.button3=1
		}
		else
		{
			maxPlansElected = true;
		}
	}

	var addlStr = "";
	var html = '<div class="plaintablecell" style="padding:10px">'
	var head=""
	var bod=""
	var bod2=""
	var bod3=""
	var covg=""

	if(parent.parent.CurrentBens[parent.parent.planname][31]=='E')
		covg=getSeaPhrase("EMPLOYEE","BEN")
	if(parent.parent.CurrentBens[parent.parent.planname][31]=='S')
		covg=getSeaPhrase("SPOUSE","BEN")
	if(parent.parent.CurrentBens[parent.parent.planname][31]=='D')
		covg=getSeaPhrase("DEPENDENTS","BEN")
	if(parent.parent.CurrentBens[parent.parent.planname][31]=='B')
		covg=getSeaPhrase("SPOUSE","BEN")

	head+='<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" styler="list">'
	head+='<TR><TH class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("AS_OF","BEN")+'</TH>'
	head+='<TH class="plaintableheaderborder" colspan=2 style="text-align:center" nowrap>'+getSeaPhrase("COVERAGE","BEN")+'</TH>'
	bod+='<TR><TD class="plaintablecellborder" align=center>&nbsp;'+parent.parent.currentdate+'</TD><TD class="plaintablecellborder" nowrap>'+covg+'</TD>'
	bod+='<TD class="plaintablecellborder">&nbsp;'+parent.parent.formatCont(parent.parent.CurrentBens[parent.parent.planname][8])+'</TD>'
	bod2+='<TR><TD class="plaintablecellborder" align=center>&nbsp;'+parent.parent.newdate+'</TD><TD class="plaintablecellborder" nowrap>'+covg+'</TD>'
	bod2+='<TD class="plaintablecellborder" align=right>&nbsp;'+parent.parent.formatCont(parent.parent.SelectedPlan[14])+'</TD>'
	bod3+='<TR><TD class="plaintablecellborder" align=center>&nbsp;</TD>'
	if (parent.parent.CurrentBens[parent.parent.planname][31]=="B")
		bod3+='<TD class="plaintablecellborder">'+getSeaPhrase("DEPENDENTS","BEN")+'</TD><TD class="plaintablecellborder">&nbsp;'+parent.parent.formatCont(parent.parent.CurrentBens[parent.parent.planname][24])+'</TD>'	
	else
		bod3+='<TD class="plaintablecellborder" align=right>&nbsp;</TD><TD class="plaintablecellborder" align=right>&nbsp;</TD>'

	if(parent.flxcost!=0 || parent.parent.SelectedPlan[20]!="")
	{
		head+='<TH class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("FLEX_CR","BEN")+'</TH>'
		bod+='<TD class="plaintablecellborder" align=right>&nbsp;'+parent.parent.formatCont(parent.flxcost)+'</TD>'
		bod2+='<TD class="plaintablecellborder" align=right>&nbsp;'+parent.parent.formatCont(parent.parent.SelectedPlan[20])+'</TD>'
		bod3+='<TD class="plaintablecellborder">&nbsp;</TD>'
	}
	if(parseFloat(parent.empcost)!=0 || parent.parent.SelectedPlan[18]!="")
	{
		head+='<TH class="plaintableheaderborder" style="text-align:center" colspan=2>'+getSeaPhrase("YOUR_COST","BEN")+'</TH>'
		if(parent.parent.CurrentBens[parent.parent.planname][13] == "B")
		{
			if(parent.empcst1!=0)
			{
				bod+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(parent.empcst1)+'<TD class="plaintablecellborder" nowrap>&nbsp;'+parent.parent.displayTaxable("P")
				if(parent.parent.EMP_CONT_TYPE=="P")
					bod+=getSeaPhrase("PER","BEN")	
				bod+='</TD>'	
			}
			else
			{
				if(parent.empcst2!=0)
				{
					bod+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(parent.empcst2)+'</TD><TD class="plaintablecellborder" nowrap>&nbsp;'+parent.parent.displayTaxable("A")
					if(parent.parent.EMP_CONT_TYPE=="P")
						bod+=getSeaPhrase("PER","BEN")	
					bod+='</TD>'	
				}		
				else
					bod+='<TD class="plaintablecellborder">&nbsp;</TD><TD class="plaintablecellborder">&nbsp;</TD>'		
			}
			if(parent.empcst1!=0 && parent.empcst2!=0)
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
			if(Number(parent.empcost)!=0)
			{
				bod+='<TD class="plaintablecellborder" align=right>&nbsp;'+parent.parent.formatCont(parent.empcost)
				if(parent.parent.EMP_CONT_TYPE=="P")
					bod+=getSeaPhrase("PER","BEN")
				bod+='</TD><TD class="plaintablecellborder">&nbsp;'+parent.parent.displayTaxable(parent.taxable)+'</TD>'
			}
			else
				bod+='<TD class="plaintablecellborder">&nbsp;</TD><TD class="plaintablecellborder">&nbsp;</TD>'
			bod3+='<TD class="plaintablecellborder">&nbsp;</TD><TD class="plaintablecellborder">&nbsp;</TD>'	
		}	
		if(parent.parent.SelectedPlan[18]!="")
		{
			bod2+='<TD class="plaintablecellborder" align=right>&nbsp;'+parent.parent.formatCont(parent.parent.SelectedPlan[18])
			if(parent.parent.EMP_CONT_TYPE=="P")
				bod2+=getSeaPhrase("PER","BEN")
			bod2+='</TD><TD class="plaintablecellborder">&nbsp;'
			if(parent.parent.CurrentBens[parent.parent.planname][13] == "B" && parent.parent.SelectedPlan[16])
				bod2+=parent.parent.displayTaxable(parent.parent.SelectedPlan[16]);
			else
				bod2+=parent.parent.displayTaxable(parent.taxable);
			bod2+='</TD>'
		}
		else
			bod2+='<TD class="plaintablecellborder">&nbsp;<TD class="plaintablecellborder">&nbsp;</TD>'	
	}
	if(parent.compcost!=0 || parent.parent.SelectedPlan[24]!="")
	{
		head+='<TH class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("CO_COST","BEN")+'</TH>'
		if(parent.compcost!=0)
		{
			bod+='<TD class="plaintablecellborder" align=right>&nbsp;'+parent.parent.formatCont(parent.compcost)
			if(parent.parent.EMP_CONT_TYPE=="P")
				bod+=getSeaPhrase("PER","BEN")
			bod+='</TD>'	
		}
		else
			bod+='<TD class="plaintablecellborder">&nbsp;</TD>'
		if(parent.parent.SelectedPlan[24]!="")
		{
			bod2+='<TD class="plaintablecellborder" align=right>&nbsp;'+parent.parent.formatCont(parent.parent.SelectedPlan[24])
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
		
	parent.parent.SelectedPlan[51] = parent.parent.CurrentBens[parent.parent.planname][11]

	html += '<table border="0" cellpadding="0" cellspacing="0">'
	html += '<tr><td class="plaintablecell" valign="top" colspan="2">'

	html += head
	html += bod
	if (parent.empcst1!=0 && parent.empcst2!=0 && parent.parent.CurrentBens[parent.parent.planname][13] == "B")
		html += bod3
	else if(parent.parent.CurrentBens[parent.parent.planname][31]=="B")
	{
		html += '<TR><TD class="plaintablecellborder">&nbsp;</TD><TD class="plaintablecellborder">'+getSeaPhrase("DEPENDENTS","BEN")+'</TD><TD class="plaintablecellborder">&nbsp;'+parent.parent.formatCont(parent.parent.CurrentBens[parent.parent.planname][24])+'</TD>'
		if(Number(parent.empcost)!=0)
			html += '<TD class="plaintablecellborder">&nbsp;</TD><TD class="plaintablecellborder">&nbsp;</TD>'
		if(Number(parent.compcost)!=0)
			html += '<TD class="plaintablecellborder">&nbsp;</TD>'
		html += '</TR>'
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
		parent.parent.setpreaft_flag(parent.parent.SelectedPlan[16])
		if(parent.parent.BenefitRules[0]=="A")
		{
			html += bod2
			if(parent.parent.CurrentBens[parent.parent.planname][31] == "B")
			{
				html += '<TR><TD class="plaintablecellborder">&nbsp;</TD><TD class="plaintablecellborder">'+getSeaPhrase("DEPENDENTS","BEN")+'</TD><TD class="plaintablecellborder">&nbsp;'+parent.parent.formatCont(parent.parent.SelectedPlan[7])+'</TD>'
				if(Number(parent.empcost)!=0)
					html += '<TD class="plaintablecellborder">&nbsp;</TD><TD class="plaintablecellborder">&nbsp;</TD>'
				if(Number(parent.compcost)!=0)
					html += '<TD class="plaintablecellborder">&nbsp;</TD>'
				html += '</TR>'				
			}	
		}
	}

	html += '</table><br>'
	html += parent.parent.writeDepPortion()

	if(parent.flxcost!=0 || parent.empcost!=0 || parent.compcost!=0) {
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

	html += '</td></tr>'
	html += '<tr><td class="plaintablecell" valign="top">'

	html += '<form name="options">'
	html += '<table class="plaintableborder" cellspacing="0" cellpadding="0" border="0" styler="list"><tr>'
	//html += '<th class="plaintablecellborder" nowrap>'+getSeaPhrase("DISPBEN_6","BEN")+'</th>'
	html += '<th class="plaintableheaderborder" style="text-align:center">'
	html += getSeaPhrase("OPTION","BEN")+'</th>'
	html += '<th class="plaintableheaderborder" style="text-align:center">'
	html += getSeaPhrase("SELECT","BEN")+'</th></tr>'

// MOD BY BILAL
	//ISH 2007 Remove description link
	if(parent.button1!=0 && parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][12]=="Y") {
		html += '<tr>'
		html += '<td class="plaintablerowheaderborder" style="text-align:right">'+getSeaPhrase("DISPBEN_23","BEN")+'</td>'
		html += '<td class="plaintablecellborder" style="text-align:center">'
		html += '<input type="radio" name="option" value="0"></td></tr>'
		//html += '<a href="javascript:parent.setTaxType()">'+getSeaPhrase("DISPBEN_23","BEN")+'</a><br>'
	}
//	if(parent.button5!=0 && parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][12]=="Y" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][17]==1) {
//		html += '<tr>'
//		html += '<td class="plaintablerowheaderborder" style="text-align:right">'+getSeaPhrase("DISPBEN_27","BEN")+'</td>'
//		html += '<td class="plaintablecellborder" style="text-align:center">'
//		html += '<input type="radio" name="option" value="2"></td></tr>'
//		//html += '<a href="javascript:parent.parent.selOption(5)">'+getSeaPhrase("DISPBEN_27","BEN")+'</a><br>'
//	}
	if(parent.button3!=0 && (parent.parent.CurrentEligPlan=="" || (parent.parent.EligPlans[parent.parent.CurrentEligPlan][14]=="Y" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][17]==1))) {
		html += '<tr>'
//		html += '<td class="plaintablerowheaderborder" style="text-align:right">'+getSeaPhrase("DISPBEN_25","BEN")+'</td>'
		html += '<td class="plaintablerowheaderborder" style="text-align:right">select a different plan or waive plan.</td>'
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
	//ISH 2007 End
//  END OF MOD
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
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/disp_ben_02.htm,v 1.13.2.14 2010/04/02 14:48:54 brentd Exp $ -->
