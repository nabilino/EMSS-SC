<html>
<head>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script>
var newcovamt=0
var head=""
var bod=""
var bod2=""
var bod3=""

parent.parent.currentmult=parseFloat(parent.parent.CurrentBens[parent.parent.planname][9])

var start=parseFloat(parent.parent.SelectedPlan[29])
var stop=parseFloat(parent.parent.SelectedPlan[31])
var multsal=parseFloat(parent.parent.SelectedPlan[17])
var temp=""
var limitObj=parent.parent.coverageLimit(parseInt(parent.REC_TYPE))
var newmult=parent.parent.currentmult

var flexrate=parseFloat(parent.parent.SelectedPlan[20])
var emprate=parseFloat(parent.parent.SelectedPlan[18])
var comprate=parseFloat(parent.parent.SelectedPlan[24])
var ann_increment
var ann_emp
var ann_flex
var ann_comp

var flex=parseFloat(parent.parent.SelectedPlan[20])
var emp=parseFloat(parent.parent.SelectedPlan[18])
var comp=parseFloat(parent.parent.SelectedPlan[24])

var newYcost=emp
var newCcost=comp
var newFcost=flex

var MIN_MULT_START=parseFloat(parent.parent.SelectedPlan[29])
var MAX_MULT_STOP=parseFloat(parent.parent.SelectedPlan[31])
var CVR_BEF_AFT_FLAG=(parent.parent.SelectedPlan[39])
var CVR_ROUND_METH=(parent.parent.SelectedPlan[40])
var CVR_ROUND_TO=(parent.parent.SelectedPlan[41])
var PRE_CONTRIB_BASIS=(parent.parent.SelectedPlan[42])
var BN_PLAN_TYPE=(parent.parent.SelectedPlan[43])
var BN_PLAN_CODE=(parent.parent.SelectedPlan[44])
var CAL_SALARY_START=parseFloat(parent.parent.SelectedPlan[14])

parent.parent.ELSalary = CAL_SALARY;

var CAL_SALARY=parseFloat(parent.parent.SelectedPlan[14])
var CVR_MULT_SALARY=parseFloat(parent.parent.SelectedPlan[17])
var CVR_MIN_COVER=parseFloat(parent.parent.SelectedPlan[26])
var CVR_MAX_COVER=parseFloat(parent.parent.SelectedPlan[27])
var PRE_COST_PER_CVG=""
if(parent.parent.SelectedPlan[56])
	PRE_COST_PER_CVG=parseFloat(parent.parent.SelectedPlan[56])
var EMP_PAY_FREQ=parseFloat(parent.parent.SelectedPlan[57])
var CVR_RATE_TABLE=""
if(parent.parent.SelectedPlan[58])
	CVR_RATE_TABLE=parent.parent.SelectedPlan[58]
var REDUCE_PCT=0
if(parent.parent.SelectedPlan[59])
	REDUCE_PCT=parseFloat(parent.parent.SelectedPlan[59]/100)
var REDUCE_AMOUNT=0
if(parent.parent.SelectedPlan[60])
	REDUCE_AMOUNT=parseFloat(parent.parent.SelectedPlan[60])
var REDUCE_METH=parent.parent.SelectedPlan[61]
var REDUCE_ROUND_TO=parent.parent.SelectedPlan[62]

if(typeof(parent.parent.SelectedPlan[26])=="undefined" || parent.parent.SelectedPlan[26]=='')
	CVR_MIN_COVER=0
if(typeof(parent.parent.SelectedPlan[27])=="undefined" || parent.parent.SelectedPlan[27]=='')
	CVR_MAX_COVER=Number.MAX_VALUE
if(typeof(parent.parent.SelectedPlan[29])=="undefined" || parent.parent.SelectedPlan[29]=='')
	MIN_MULT_START=0
if(typeof(parent.parent.SelectedPlan[31])=="undefined" || parent.parent.SelectedPlan[31]=='')
	MAX_MULT_STOP=Number.MAX_VALUE

// we have a new limit of another benefit coverage
if(limitObj.newCov)
{
	// if the new coverage is less than the current max, cut the max down
	if(limitObj.newCov<CVR_MAX_COVER || isNaN(CVR_MAX_COVER))
		CVR_MAX_COVER=limitObj.newCov

	// calculate the new coverage multiple
	if(limitObj.newCov<(CAL_SALARY*newmult))
	{
		var calc_stop=limitObj.newCov/CAL_SALARY
		while(newmult>calc_stop && (newmult-CVR_MULT_SALARY)>=calc_stop)
			newmult-=CVR_MULT_SALARY
		if(newmult!=parent.parent.currentmult)
			limitObj.msg=getSeaPhrase("DISPBEN_28","BEN")
	            +"<br>"
	            +getSeaPhrase("DISPBEN_29","BEN")
	            +' '+limitObj.desc+"."
	}
}

parent.parent.currentmult=newmult

var temp=(parseFloat(parent.parent.currentmult)/CVR_MULT_SALARY)*CAL_SALARY

//PT121389: impose the coverage limits before performing any multipling and rounding
if(temp<CVR_MIN_COVER)
	temp=CVR_MIN_COVER
if(temp>CVR_MAX_COVER)
	temp=CVR_MAX_COVER

if(CVR_BEF_AFT_FLAG=="A")
{
	temp=parent.parent.MultAndRound(parseFloat(temp),"Y",CVR_BEF_AFT_FLAG,CVR_ROUND_METH,parseFloat(CVR_ROUND_TO),0,0)

	// coverage reduction calculation and rounding
	if(CVR_RATE_TABLE!="")
	{
		if(REDUCE_PCT!=0)
		{
			var reducedcov=parseFloat(temp)*REDUCE_PCT
			temp=parent.parent.MultAndRound(parseFloat(reducedcov),"Y",CVR_BEF_AFT_FLAG,REDUCE_METH,parseFloat(REDUCE_ROUND_TO),0,0)
			if(REDUCE_AMOUNT!=0 && (REDUCE_AMOUNT > temp))
				temp=REDUCE_AMOUNT
		}
		else if(REDUCE_AMOUNT!=0 && REDUCE_AMOUNT > parseFloat(temp))
			temp=REDUCE_AMOUNT
	}

	// after multipling and rounding, make sure the limits are still imposed
	if(temp<CVR_MIN_COVER)
		temp=CVR_MIN_COVER
	if(temp>CVR_MAX_COVER)
		temp=CVR_MAX_COVER
}

if((parent.parent.currentmult < MIN_MULT_START) || (parent.parent.currentmult > MAX_MULT_STOP)) {
	parent.button1=0
} else {
	parent.button1=1
}

if(PRE_COST_PER_CVG!="" && parseFloat(PRE_COST_PER_CVG)!=0)
{
	ann_increment = temp/PRE_COST_PER_CVG

	if(emprate!="")
	{
		ann_emp = ann_increment*emprate
		newYcost = ann_emp/EMP_PAY_FREQ
	}
	if(flexrate!="")
	{
		ann_flex = ann_increment*flexrate
		newFcost = ann_flex/EMP_PAY_FREQ
	}
	if(comprate!="")
	{
		ann_comp = ann_increment*comprate
		newCcost = ann_comp/EMP_PAY_FREQ
	}
}
else
{
	if(temp<=CVR_MIN_COVER || temp>=CVR_MAX_COVER)
	{
		if(PRE_CONTRIB_BASIS=="C")
		{
			newFcost=parseFloat((flexrate/CAL_SALARY_START)*temp)
			newYcost=parseFloat((emprate/CAL_SALARY_START)*temp)
			newCcost=parseFloat((comprate/CAL_SALARY_START)*temp)
		}
	}
	else
	{
		calccost(parent.parent.currentmult,CVR_MULT_SALARY,temp)
	}
}

parent.parent.SelectedPlan[18]=newYcost
parent.parent.SelectedPlan[20]=newFcost
parent.parent.SelectedPlan[24]=newCcost
parent.parent.SelectedPlan[14]=temp
parent.parent.SelectedPlan[17]=parent.parent.currentmult
parent.parent.SelectedPlan[11]=temp

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

parent.button2=1

function startProgram()
{
	newcovamt=temp

	var addlStr = "";
	var html = '<div class="plaintablecell" style="padding:10px">';

	head+='<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" styler="list">'
	head+='<TR><TH class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("AS_OF","BEN")+'</TH>'
	head+='<TH class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("MULTIPLE","BEN")+'</TH>'
	head+='<TH class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("COV_AMT","BEN")+'</TH>'
	bod+='<TR><TD class="plaintablecellborder" align=center>'+parent.parent.currentdate+'</TD><TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(parent.parent.CurrentBens[parent.parent.planname][9])+'</TD>'
	bod+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(parent.parent.CurrentBens[parent.parent.planname][8])+'</TD>'
	bod2+='<TR><TD class="plaintablecellborder" align=center>'+parent.parent.newdate+'</TD><TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(parent.parent.currentmult)+'</TD>'
	bod2+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(newcovamt)+'</TD>'
	bod3+='<TR><TD class="plaintablecellborder" align=center>&nbsp;</TD><TD class="plaintablecellborder" align=right>&nbsp;</TD>'
	bod3+='<TD class="plaintablecellborder" align=right>&nbsp;</TD>'

	if((!isNaN(parent.parent.unFormat(newFcost)) && parseFloat(newFcost)!=0) ||
		(!isNaN(parent.parent.unFormat(parent.flxcost)) && parseFloat(parent.flxcost)!=0))
	{
		head+='<TH class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("FLEX_CR","BEN")+'</TH>'
		bod+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(parent.flxcost)+'</TD>'
		bod2+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(newFcost)+'</TD>'
		bod3+='<TD class="plaintablecellborder">&nbsp;</TD>'
	}

	if((!isNaN(parent.parent.unFormat(newYcost)) && parseFloat(newYcost)!=0) ||
		(!isNaN(parent.parent.unFormat(parent.empcost)) && parseFloat(parent.empcost)!=0))
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
				bod+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(parent.empcost)+'<TD class="plaintablecellborder" nowrap>&nbsp;'+parent.parent.displayTaxable(parent.taxable)
				if(parent.parent.EMP_CONT_TYPE=="P")
					bod+=getSeaPhrase("PER","BEN")
				bod+='</TD>'
				bod3+='<TD class="plaintablecellborder">&nbsp;</TD><TD class="plaintablecellborder">&nbsp;</TD>'	
			}
		}
		else
			bod+='<TD class="plaintablecellborder">&nbsp;</TD><TD class="plaintablecellborder">&nbsp;</TD>'
		if(newYcost!=0)
		{
			bod2+='<TD class="plaintablecellborder" align=right>'+parent.parent.formatCont(newYcost)
			if(parent.parent.EMP_CONT_TYPE=="P")
				bod2+=getSeaPhrase("PER","BEN")
			bod2+='</TD><TD class="plaintablecellborder" nowrap>&nbsp;'							
			if(parent.parent.CurrentBens[parent.parent.planname][13] == "B" && parent.parent.SelectedPlan[16])
				bod2+=parent.parent.displayTaxable(parent.parent.SelectedPlan[16]);
			else
				bod2+=parent.parent.displayTaxable(parent.taxable);
			bod2+='</TD>'	
		}
		else
			bod2+='<TD class="plaintablecellborder">&nbsp;</TD><TD class="plaintablecellborder">&nbsp;</TD>'	
	}

	if((!isNaN(parent.parent.unFormat(newCcost)) && parseFloat(newCcost)!=0) ||
		(!isNaN(parent.parent.unFormat(parent.compcost)) && parseFloat(parent.compcost)!=0))
	{
		head+='<TH class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("CO_COST","BEN")+'</TH>'
		if(parent.compcost!=0)
		{
			bod+='<TD class="plaintablecellborder" align=right nowrap>'+parent.parent.formatCont(parent.compcost)
			if(parent.parent.EMP_CONT_TYPE=="P")
				bod+=getSeaPhrase("PER","BEN")
			bod+='</TD>'	
		}
		else
			bod+='<TD class="plaintablecellborder">&nbsp;</TD>'
		if(newCcost!=0)
		{
			bod2+='<TD class="plaintablecellborder" align=right nowrap>'+parent.parent.formatCont(newCcost)
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

	if(parent.parent.CurrentBens[parent.parent.planname][14]=="N")
	{
		parent.button1=0
		parent.button2=0
		parent.parent.CurrentEligPlan=""
		addlStr += '<br>'+getSeaPhrase("DISPBEN_4","BEN")
	}
	else
	{
		if(parent.button1==0)
			addlStr += '<br>'+getSeaPhrase("DISPBEN_28","BEN")
		else if(limitObj.err)
		{
			if(limitObj.err==1)
			{
				parent.button1=0
				parent.button2=0
				parent.button5=0
			}

			if(limitObj.msg!="")
				addlStr += '<br>'+limitObj.msg
		}
		else {
			parent.parent.setpreaft_flag(parent.parent.SelectedPlan[16])
		}
	}

	parent.parent.SelectedPlan[51] = parent.parent.CurrentBens[parent.parent.planname][11]

	html += '<table border="0" cellpadding="0" cellspacing="0">'
	html += '<tr><td class="plaintablecell" valign="top" colspan="2">'

	html += head
	html += bod
	if (parent.empcst1!=0 && parent.empcst2!=0 && parent.parent.CurrentBens[parent.parent.planname][13] == "B")
		html += bod3
	if(parent.parent.BenefitRules[0]=="A")
		html += bod2

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

// MOD BY BILAL - Prior Customization
	//ISH 2007 remove and rename link
	if(parent.button1!=0 && parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][12]=="Y") {
		html += '<tr>'
//		html += '<td class="plaintablerowheaderborder" style="text-align:right">'+getSeaPhrase("DISPBEN_23","BEN")+'</td>'
		html += '<td class="plaintablerowheaderborder" style="text-align:right">keep the same coverage.</td>'
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
		html += '<td class="plaintablerowheaderborder" style="text-align:right">'+'select a different plan.'+'</td>'
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

	html += parent.header('<br>'+addlStr);

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

function calccost(mult,multsal,cover)
{
	if(PRE_CONTRIB_BASIS=="C")
	{
		var temp=0
		temp=mult/parseFloat(multsal)
		newFcost=flexrate*temp
		newYcost=emprate*temp
		newCcost=comprate*temp
	}
	return
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
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/disp_ben_03.htm,v 1.13.2.19 2010/09/03 09:07:10 juanms Exp $ -->
