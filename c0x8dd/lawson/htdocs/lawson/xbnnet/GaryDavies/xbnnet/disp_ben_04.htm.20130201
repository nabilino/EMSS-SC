<html>
<head>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script>
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

var currentcov=0
var increment=0
var increment=0
var newempcost=0 //18
var newcompcost=0 //24
var newflxcost=0 //20
var max=0
var min=0
var PRE_CONTRIB_BASIS=parent.parent.SelectedPlan[42]

if(parent.parent.SelectedPlan[18]!="")
	newempcost=parseFloat(parent.parent.SelectedPlan[18])
if(parent.parent.SelectedPlan[24]!="")
	newcompcost=parseFloat(parent.parent.SelectedPlan[24])
if(parent.parent.SelectedPlan[20]!="")
	newflxcost=parseFloat(parent.parent.SelectedPlan[20])

if(parent.parent.CurrentBens[parent.parent.planname][8]!="")
	currentcov=parseFloat(parent.parent.CurrentBens[parent.parent.planname][8])
if(parent.parent.SelectedPlan[35]!="")
	increment=parseFloat(parent.parent.SelectedPlan[35])

if(parent.parent.SelectedPlan[34]!="")
   	max=parseFloat(parent.parent.SelectedPlan[34])
if(parent.parent.SelectedPlan[33]!="")
	min=parseFloat(parent.parent.SelectedPlan[33])

//Added for fix for a benefit with a limit based on another benefit and the max
//coverage is being returned as 0, thus preventing the Keep These Benefits" link
//from appearing
if(max==0)
{
	var percent = parent.parent.SelectedPlan[36];
	var sTemp = percent.substr(0, percent.length - 1)
	var sSign = percent.substr(percent.length - 1, percent.length)
	percent = parseFloat(sSign + sTemp) / 100;
	if(parent.parent.ELSalary)
		max = Number(parent.parent.ELSalary) * (Number(percent)/100)
}

if(PRE_CONTRIB_BASIS=="C")
{
	if(currentcov%increment==0)
	{
		if(parseFloat(currentcov)>=min && (max==0 || parseFloat(currentcov)<=max))
		{
			newempcost=parent.parent.roundToPennies(parseFloat(currentcov)/parseFloat(increment)*newempcost)
			newcompcost=parent.parent.roundToPennies(parseFloat(currentcov)/parseFloat(increment)*newcompcost)
			newflxcost=parent.parent.roundToPennies(parseFloat(currentcov)/parseFloat(increment)*newflxcost)
			parent.button1=1
		}
	}
}
else
	parent.button1=1

parent.button2=1

function startProgram()
{
	var addlStr = "";
	var html = '<div class="plaintablecell" style="padding:10px">'
// MOD BY CLYNCH - Centering page content
	html += parent.header('<br>') + '<div style="text-align:center">';
// ~CLYNCH
	var head=''
	var bod=''
	var bod2=''
	var bod3=''

	head+='<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" styler="list">'
	head+='<TR><TH class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("AS_OF","BEN")+'</TH>'
	head+='<TH class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("COVERAGE","BEN")+'</TH>'
	bod+='<TR><TD class="plaintablecellborder" align=center>'+parent.parent.currentdate+'</TD><TD class="plaintablecellborder">'+parent.parent.formatCont(parent.parent.CurrentBens[parent.parent.planname][8])+'</TD>'
	bod2+='<TR><TD class="plaintablecellborder" align=center>'+parent.parent.newdate+'</TD><TD class="plaintablecellborder">'+parent.parent.formatCont(parent.parent.CurrentBens[parent.parent.planname][8])+'</TD>'
	bod3+='<TR><TD class="plaintablecellborder" align=center>&nbsp;</TD><TD class="plaintablecellborder" align=right>&nbsp;</TD>'
	
	if(parent.flxcost!=0 || newflxcost!=0)
	{
		head+='<TH class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("FLEX_CR","BEN")+'</TH>'
		bod+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(parent.flxcost)+'</TD>'
		bod2+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(newflxcost)+'</TD>'
		bod3+='<TD class="plaintablecellborder">&nbsp;</TD>'
	}
	if(parent.empcost!=0 || newempcost!=0)
	{
		head+='<TH class="plaintableheaderborder" style="text-align:center" colspan=2 nowrap>'+getSeaPhrase("COST","BEN")+'</TH>'
		if(parent.parent.CurrentBens[parent.parent.planname][13] == "B")
		{
			if(parent.empcst1!=0)
				bod+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(parent.empcst1)+'</TD><TD class="plaintablecellborder" nowrap>&nbsp;'+parent.parent.displayTaxable("P")+'</TD>'	
			else
			{
				if(parent.empcst2!=0)
					bod+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(parent.empcst2)+'</TD><TD class="plaintablecellborder" nowrap>&nbsp;'+parent.parent.displayTaxable("A")+'</TD>'	
				else
					bod+='<TD class="plaintablecellborder">&nbsp;</TD><TD class="plaintablecellborder">&nbsp;</TD>'											
			}
			if(parent.empcst1!=0 && parent.empcst2!=0)
				bod3+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(parent.empcst2)+'</TD><TD class="plaintablecellborder" nowrap>&nbsp;'+parent.parent.displayTaxable("A")+'</TD>'	
			else
				bod3+='<TD class="plaintablecellborder">&nbsp;</TD><TD class="plaintablecellborder">&nbsp;</TD>'								
		}
		else
		{	
			bod+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(parent.empcost)+'</TD><TD class="plaintablecellborder">&nbsp;'
			if(parent.empcost!=0)
				bod+=parent.parent.displayTaxable(parent.taxable)
			bod+='</TD>'
			bod3+='<TD class="plaintablecellborder">&nbsp;</TD><TD class="plaintablecellborder">&nbsp;</TD>'	
		}
		bod2+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(newempcost)+'<TD class="plaintablecellborder">&nbsp;'
		if(newempcost!=0)
		{
			if(parent.parent.CurrentBens[parent.parent.planname][13] == "B" && parent.parent.SelectedPlan[16])
				bod2+=parent.parent.displayTaxable(parent.parent.SelectedPlan[16]);
			else
				bod2+=parent.parent.displayTaxable(parent.taxable);
		}	
		bod2+='</TD>'	
	}
	if(parent.compcost!=0 || newcompcost!=0)
	{
		head+='<TH class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("CO_COST","BEN")+'</TH>'
		bod+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(parent.compcost)+'</TD>'
		bod2+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(newcompcost)+'</TD>'
		bod3+='<TD class="plaintablecellborder" align=right>&nbsp;</TD>'
	}

	bod+='</TR>'
	bod2+='</TR>'
	bod3+='</TR>'

	html += '<table border="0" cellpadding="0" cellspacing="0">'
	html += '<tr><td class="plaintablecell" valign="top" colspan="2">'

	html += head
	html += bod
	if (parent.empcst1!=0 && parent.empcst2!=0 && parent.parent.CurrentBens[parent.parent.planname][13] == "B")
		html += bod3	

	if(parent.parent.CurrentBens[parent.parent.planname][14]=="N")
	{
		parent.button1=0
		parent.button2=0
		// PT 150929. Plan is no longer available; do not allow change of dependents only.
		parent.button5=0;
		parent.parent.CurrentEligPlan=""
		addlStr += '<br>'+getSeaPhrase("DISPBEN_4","BEN")
	}
	else
	{
		if(parent.button1==0) {
			// PT 150929. Coverage level is no longer available; do not allow change of dependents only.
			parent.button5=0;
			addlStr += '<br>'+getSeaPhrase("DISPBEN_28","BEN")
		} else {
			if(newflxcost==0) newflxcost=''
			if(newempcost==0) newempcost=''
			if(newcompcost==0) newcompcost=''
			parent.parent.setpreaft_flag(parent.parent.SelectedPlan[16])
			if(parent.parent.BenefitRules[0]=="A")
			{
				html += bod2
			}
		}
	}

	html += '</table><br>'
	html += parent.parent.writeDepPortion()

	if(parent.flxcost!=0 || parent.empcost!=0 || parent.compcost!=0) {
//  MOD BY CLYNCH - Relocate cost per pay period text 
	//		addlStr += '<br>'+parent.parent.costdivisor
		html    += '<div style="text-align:center">'+parent.parent.costdivisor + '</div><br>'
//  ~CLYNCH
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

	parent.parent.SelectedPlan[51] = parent.parent.CurrentBens[parent.parent.planname][11]
	parent.parent.SelectedPlan[15] = parent.parent.CurrentBens[parent.parent.planname][13]
	parent.parent.SelectedPlan[20] = newflxcost
	parent.parent.SelectedPlan[24] = newcompcost
	parent.parent.SelectedPlan[18] = newempcost
	parent.parent.SelectedPlan[17] = currentcov

	html += '<form name="options">'
	html += '<table class="plaintableborder" cellspacing="0" cellpadding="0" border="0" styler="list"><tr>'
	//html += '<th class="plaintablecellborder" nowrap>'+getSeaPhrase("DISPBEN_6","BEN")+'</th>'
	html += '<th class="plaintableheaderborder" style="text-align:center">'
	html += getSeaPhrase("OPTION","BEN")+'</th>'
	html += '<th class="plaintableheaderborder" style="text-align:center">'
	html += getSeaPhrase("SELECT","BEN")+'</th></tr>'

// *********************************************
// CLYNCH PLAN VISIBLILTIY CHECK CODE ADDED HERE
// *********************************************

		if(parent.parent.SLRMC.isPlanVisible(parent.parent.company,parent.parent.CurrentBens[parent.parent.planname][32],parent.parent.CurrentBens[parent.parent.planname][2],parent.parent.ElectedPlans)) {
		if(parent.parent.CurrentBens[parent.parent.planname][14] == "Y")
		{


// *********************************************
// CLYNCH PLAN VISIBLILTIY CHECK CODE ENDS HERE
// *********************************************

	if(parent.button1!=0 && parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][12]=="Y") {
		html += '<tr>'
		html += '<td class="plaintablerowheaderborder" style="text-align:right">'+getSeaPhrase("DISPBEN_23","BEN")+'</td>'
		html += '<td class="plaintablecellborder" style="text-align:center">'
		html += '<input type="radio" name="option" value="0"></td></tr>'
		//html += '<a href="javascript:parent.setTaxType()">'+getSeaPhrase("DISPBEN_23","BEN")+'</a><br>'
	}
// MOD BY BILAL - Prior customization
	//ISH 2007 remove and rename link
//	if(parent.button5!=0 && parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][12]=="Y" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][17]==1) {
//		html += '<tr>'
//		html += '<td class="plaintablerowheaderborder" style="text-align:right">'+getSeaPhrase("DISPBEN_27","BEN")+'</td>'
//		html += '<td class="plaintablecellborder" style="text-align:center">'
//		html += '<input type="radio" name="option" value="2"></td></tr>'
//		//html += '<a href="javascript:parent.parent.selOption(5)">'+getSeaPhrase("DISPBEN_27","BEN")+'</a><br>'
//	}
	if(parent.button2!=0 && parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][12]=="Y" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][17]==1) {
		html += '<tr>'
		html += '<td class="plaintablerowheaderborder" style="text-align:right">'+getSeaPhrase("DISPBEN_24","BEN")+'</td>'
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
// END OF MOD
	html += '</table>'
	html += '<p>'
// MOD BY CLYNCH - Format button style per St Luke's requirements
	html += 'center>'
//	html += uiButton(getSeaPhrase("CONTINUE","BEN"),"parent.parseChoice(this.form);return false","margin-top:10px")
//	html += uiButton(getSeaPhrase("EXIT","BEN"),"parent.parent.quitEnroll(parent.location);return false","margin-right:0px;margin-top:10px")
	html += uiButton(getSeaPhrase("CONTINUE","BEN"),"parent.parseChoice(this.form);return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
	html += "&nbsp;&nbsp;"
	html += uiButton(getSeaPhrase("EXIT","BEN"),"parent.parent.quitEnroll(parent.location);return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
// ~CLYNCH
	html += '</p>'
	html += '/center>'
// END OF MOD
	html += '</form>'

	html += '</td><td class="plaintablecell" valign="top">'

//  MOD BY CLYNCH - Moving text to top of page
//	html += parent.header('<br>'+addlStr)
//  ~CLYNCH
	html += '</td></tr>'
	html += '</table>'

	html += '</div>'

	parent.parent.removeWaitAlert();
	if (typeof(parent.parent.parent.removeWaitAlert) != "undefined") {
		parent.parent.parent.removeWaitAlert();
	}
	document.getElementById("paneBody").innerHTML = html;
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
<!-- Version: 8-)@(#)@(201111) 09.00.01.06.09 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/disp_ben_04.htm,v 1.14.2.15.6.1 2012/02/08 21:59:43 brentd Exp $ -->
