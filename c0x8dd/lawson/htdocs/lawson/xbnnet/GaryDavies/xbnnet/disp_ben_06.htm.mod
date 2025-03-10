<html>
<head>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script>
if(parent.parent.SelectedPlan[18]=="" || parent.parent.SelectedPlan[18]==null)
{
	parent.parent.SelectedPlan[18]=""
}
if(parent.parent.SelectedPlan[16]=="" || parent.parent.SelectedPlan[16]==null)
{
	parent.parent.SelectedPlan[16]=""
}
if(parent.parent.SelectedPlan[22]=="" || parent.parent.SelectedPlan[22]==null)
{
	parent.parent.SelectedPlan[22]=""
}

var ben_pct_amt_flag = parent.parent.CurrentBens[parent.parent.planname][11]
var pre_emp_cont_type = parent.parent.SelectedPlan[24]
var ben_pay_rate = parent.parent.CurrentBens[parent.parent.planname][36]
// PT 167293. Use the BEN-BOND-DED-AMT for the pay period amount if this is an RS or SP type plan.
if (parent.parent.CurrentBens[parent.parent.planname][1] == "RS" || parent.parent.CurrentBens[parent.parent.planname][1] == "SP")
	ben_pay_rate = parent.parent.CurrentBens[parent.parent.planname][26]
var ben_cover_amt = parent.parent.CurrentBens[parent.parent.planname][27]
var pre_pay_per_min	= parent.parent.SelectedPlan[5]
if(typeof(parent.parent.SelectedPlan[5])=='undefined')
	pre_pay_per_min=0
var pre_pay_per_max	= parent.parent.SelectedPlan[7]
var pre_ann_amt_min	= parent.parent.SelectedPlan[9]
if(typeof(parent.parent.SelectedPlan[9])=='undefined')
	pre_ann_amt_min=0
var pre_ann_amt_max	= parent.parent.SelectedPlan[11]
var pre_pct_min	= parent.parent.SelectedPlan[13]
var pre_pct_max	= parent.parent.SelectedPlan[15]
var ben_pre_aft_flag = parent.parent.CurrentBens[parent.parent.planname][13]
var cnd_emp_pre_pct	= parent.parent.SelectedPlan[25]
var cnd_emp_post_pct = parent.parent.SelectedPlan[29]
var cnd_emp_tot_pct	= parent.parent.SelectedPlan[31]
var ben_emp_pre_cont = parent.parent.CurrentBens[parent.parent.planname][18]
var ben_emp_aft_cont = parent.parent.CurrentBens[parent.parent.planname][19]
var cal_pre_pct	= parent.parent.SelectedPlan[27]
var cal_post_pct = parent.parent.SelectedPlan[30]
var cal_tot_pct	= parent.parent.SelectedPlan[32]
var pre_end_pct	= parent.parent.SelectedPlan[10]
var cal_end_pct	= parent.parent.SelectedPlan[12]
var divisor = parent.parent.SelectedPlan[37]

var errMsg=""

if(parent.REC_TYPE=="06")
{
	if(ben_pct_amt_flag=="A" && pre_emp_cont_type=="P")
		errMsg=getSeaPhrase("DISPBEN_7","BEN")
	else
	{
		if(ben_pct_amt_flag=="P" && pre_emp_cont_type=="A")
			errMsg=getSeaPhrase("DISPBEN_8","BEN")
		else
		{
			if(ben_pct_amt_flag=="A")
			{
				if(parseFloat(ben_pay_rate)<parseFloat(pre_pay_per_min))
					errMsg=getSeaPhrase("DISPBEN_30","BEN")+' '+pre_pay_per_min
				if(parseFloat(ben_pay_rate)>parseFloat(pre_pay_per_max))
					errMsg=getSeaPhrase("DISPBEN_31","BEN")+' '+pre_pay_per_max
				if(parseFloat(ben_cover_amt)<parseFloat(pre_ann_amt_min))
					errMsg=getSeaPhrase("DISPBEN_32","BEN")+' '+pre_ann_amt_min
				if(parseFloat(ben_cover_amt)>parseFloat(pre_ann_amt_max))
					errMsg=getSeaPhrase("DISPBEN_33","BEN")+' '+pre_ann_amt_max
			}
			if(ben_pct_amt_flag=="P")
			{
				if(parseFloat(ben_cover_amt)<parseFloat(pre_pct_min))
					errMsg=getSeaPhrase("DISPBEN_34","BEN")+' '+pre_pct_min
				if(parseFloat(ben_cover_amt)>parseFloat(pre_pct_max))
					errMsg=getSeaPhrase("DISPBEN_35","BEN")+' '+pre_pct_max
			}
		}
	}
}

if(parent.REC_TYPE=="08")
{
	if(ben_pct_amt_flag=="A" && pre_emp_cont_type=="P")
		errMsg=getSeaPhrase("DISPBEN_7","BEN")
	else
	{
		if(ben_pct_amt_flag=="P" && pre_emp_cont_type=="A")
			errMsg=getSeaPhrase("DISPBEN_8","BEN")
		else
		{
			if(ben_pct_amt_flag=="P")
			{
				if(ben_pre_aft_flag=="P" && parseFloat(ben_cover_amt) > parseFloat(cnd_emp_pre_pct))
					errMsg=getSeaPhrase("DISPBEN_16","BEN")+' '+cnd_emp_pre_pct+getSeaPhrase("PER","BEN")
				if(ben_pre_aft_flag=="A" && parseFloat(ben_cover_amt) > parseFloat(cnd_emp_post_pct))
					errMsg=getSeaPhrase("DISPBEN_17","BEN")+' '+cnd_emp_post_pct+getSeaPhrase("PER","BEN")
				if(ben_pre_aft_flag=="B" && parseFloat(ben_cover_amt) > parseFloat(cnd_emp_tot_pct))
					errMsg=getSeaPhrase("DISPBEN_18","BEN")+' '+cnd_emp_tot_pct+getSeaPhrase("PER","BEN")
				if(ben_pre_aft_flag=="B" && parseFloat(ben_emp_pre_cont) > parseFloat(cnd_emp_pre_pct))
					errMsg=getSeaPhrase("DISPBEN_16","BEN")+' '+cnd_emp_pre_pct+getSeaPhrase("PER","BEN")
				if(ben_pre_aft_flag=="B" && parseFloat(ben_emp_aft_cont) > parseFloat(cnd_emp_post_pct))
					errMsg=getSeaPhrase("DISPBEN_17","BEN")+' '+cnd_emp_post_pct+getSeaPhrase("PER","BEN")
			}
			if(ben_pct_amt_flag=="A")
			{
				if(ben_pre_aft_flag=="P" && parseFloat(ben_cover_amt) > parseFloat(cal_pre_pct))
					errMsg=getSeaPhrase("DISPBEN_19","BEN")+' '+cal_pre_pct
				if(ben_pre_aft_flag=="A" && parseFloat(ben_cover_amt) > parseFloat(cal_post_pct))
					errMsg=getSeaPhrase("DISPBEN_20","BEN")+' '+cal_post_pct
				if(ben_pre_aft_flag=="B" && parseFloat(ben_cover_amt) > parseFloat(cal_tot_pct))
					errMsg=getSeaPhrase("DISPBEN_21","BEN")+' '+cal_tot_pct
				if(ben_pre_aft_flag=="B" && parseFloat(ben_emp_pre_cont) > parseFloat(cal_pre_pct))
					errMsg=getSeaPhrase("DISPBEN_19","BEN")+' '+cal_pre_pct
				if(ben_pre_aft_flag=="B" && parseFloat(ben_emp_aft_cont) > parseFloat(cal_post_pct))
					errMsg=getSeaPhrase("DISPBEN_20","BEN")+' '+cal_post_pct
			}
		}
	}
}

if(parent.REC_TYPE=="09")
{
	if(ben_pct_amt_flag=="A" && pre_emp_cont_type=="P")
		errMsg=getSeaPhrase("DISPBEN_7","BEN")
	else
	{
		if(ben_pct_amt_flag=="P" && pre_emp_cont_type=="A")
			errMsg=getSeaPhrase("DISPBEN_8","BEN")
		else
		{
			if(ben_pct_amt_flag=="P")
			{
				if(parseFloat(ben_cover_amt) > parseFloat(pre_end_pct))
					errMsg=getSeaPhrase("CONTRI_PER_GT_MAX","BEN")+' '+pre_end_pct+getSeaPhrase("PER","BEN")
			}
			if(ben_pct_amt_flag=="A")
			{
				if(parseFloat(ben_cover_amt) > parseFloat(cal_end_pct))
					errMsg=getSeaPhrase("CONTRI_GT_MAX","BEN")+' '+cal_end_pct
			}
		}
	}
}

if(parent.parent.CurrentBens[parent.parent.planname][14]=="Y")
{
	parent.button1=1
	parent.button2=1
}
else
{
	parent.button1=0
	parent.button2=0
}

if(errMsg!="")
	parent.button1=0

var maxPlansElected = false;

if(parent.plangroup>0 || parent.plangroup>1 || (parent.plangroup==1 && (parent.GrpPlans[0][1]!=parent.parent.CurrentBens[parent.parent.planname][1]
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

function startProgram()
{
	var html = '<div class="plaintablecell" style="padding:10px">';
	var addlStr = "";
	var taxable="";
	var bod="";

	if(parent.parent.CurrentBens[parent.parent.planname][13]=="P")
		taxable=getSeaPhrase("PRE_TAX","BEN")
	if(parent.parent.CurrentBens[parent.parent.planname][13]=="A")
		taxable=getSeaPhrase("AFTER_TAX","BEN")

	parent.parent.SelectedPlan[24] = parent.parent.CurrentBens[parent.parent.planname][11]
	if(parent.REC_TYPE=="06")
	{
		bod += '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0">'
		if(parent.parent.BenefitRules[6]=="M")
			divisor = 12
		else if(parent.parent.BenefitRules[6]=="S")
			divisor = 24
		else if(parent.parent.BenefitRules[6]=="A")
			divisor = 1
		if(parent.parent.CurrentBens[parent.parent.planname][11]=="A")
		{
			bod += '<tr><td class="plaintableheaderborder">'+getSeaPhrase("DISPBEN_3","BEN")+'</td><td class="plaintablecellborder">&nbsp;'
			if(parent.parent.BenefitRules[6]=="M")
			{
				var mthlyAmt = 0;
				// Display monthly amount as BEN-ANNUAL-AMT / BCC-REMAIN-CYCLES for RS plans.
				if (parent.parent.CurrentBens[parent.parent.planname][1] == "RS" && typeof(parent.parent.CurrentBens[parent.parent.planname][44])!="undefined" && parent.parent.CurrentBens[parent.parent.planname][44]!="" && parseInt(parent.parent.CurrentBens[parent.parent.planname][44],10) != 0)
				{
					mthlyAmt = parseFloat(ben_cover_amt)/parseFloat(parent.parent.CurrentBens[parent.parent.planname][44]);
				}
				else
				{
					mthlyAmt = parseFloat(ben_cover_amt)/12;
				}
				parent.parent.SelectedPlan[16] = mthlyAmt
				bod += parent.parent.formatCont(mthlyAmt)+' '+taxable+' '+getSeaPhrase("PER_MONTH","BEN")+'</td><td class="plaintablecellborder">&nbsp;</td>'
			}
			else if(parent.parent.BenefitRules[6]=="S")
			{
				var semiMthlyAmt = 0;
				// Display semi-monthly amount as BEN-ANNUAL-AMT / BCC-REMAIN-CYCLES for RS plans.
				if (parent.parent.CurrentBens[parent.parent.planname][1] == "RS" && typeof(parent.parent.CurrentBens[parent.parent.planname][44])!="undefined" && parent.parent.CurrentBens[parent.parent.planname][44]!="" && parseInt(parent.parent.CurrentBens[parent.parent.planname][44],10) != 0)
				{
					semiMthlyAmt = parseFloat(ben_cover_amt)/parseFloat(parent.parent.CurrentBens[parent.parent.planname][44]);
				}
				else
				{
					semiMthlyAmt = parseFloat(ben_cover_amt)/24;
				}
				parent.parent.SelectedPlan[16] = semiMthlyAmt
				bod += parent.parent.formatCont(semiMthlyAmt)+' '+taxable+' '+getSeaPhrase("SEMI_MONTHLY","BEN").toLowerCase()+'</td><td class="plaintablecellborder">&nbsp;</td>'
			}
			else if(parent.parent.BenefitRules[6]=="P")
				bod += parent.parent.formatCont(parent.parent.CurrentBens[parent.parent.planname][26])+' '+taxable+' '+getSeaPhrase("PER_PP","BEN")+'</td><td class="plaintablecellborder">&nbsp;</td>'
			if(parent.parent.BenefitRules[6]!="A")
				bod += '</tr><tr><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">'
			bod += parent.parent.formatCont(parent.parent.CurrentBens[parent.parent.planname][27])+' '+taxable+' '+getSeaPhrase("PER_YEAR","BEN")+'</td><td class="plaintablecellborder">&nbsp;</td>'
			parent.parent.SelectedPlan[26] = "A"
			parent.parent.SelectedPlan[36] = parent.parent.CurrentBens[parent.parent.planname][27]
			parent.parent.SelectedPlan[23] = parent.parent.CurrentBens[parent.parent.planname][27]
			if(parent.parent.BenefitRules[6]=="P")
				parent.parent.SelectedPlan[16] = parseFloat(parent.parent.SelectedPlan[23])/divisor
			else if(parent.parent.BenefitRules[6]=="A")
				parent.parent.SelectedPlan[16] = parent.parent.SelectedPlan[23]
		}
		else
		{
			if(parent.parent.CurrentBens[parent.parent.planname][11]=="P")
			{
				bod += '<tr><td class="plaintableheaderborder">'+getSeaPhrase("DISPBEN_3","BEN")+'</td><td class="plaintablecellborder">'+parent.parent.formatCont(parent.parent.CurrentBens[parent.parent.planname][27])+getSeaPhrase("PER","BEN")+'</td><td class="plaintablecellborder">&nbsp;'+taxable+'</td></tr>'
				parent.parent.SelectedPlan[26] = "P"
				parent.parent.SelectedPlan[23] = parent.parent.CurrentBens[parent.parent.planname][27]
				parent.parent.SelectedPlan[16] = parent.parent.SelectedPlan[23]
			}
		}
		bod += '</table><br>'
	}
	else
	{
		if (!isNaN(parseFloat(parent.parent.CurrentBens[parent.parent.planname][18])) ||
			!isNaN(parseFloat(parent.parent.CurrentBens[parent.parent.planname][21])))
		{
			var pretax = 0
			if (!isNaN(parseFloat(parent.parent.CurrentBens[parent.parent.planname][18])))
				pretax+=parseFloat(parent.parent.CurrentBens[parent.parent.planname][18])
			if (!isNaN(parseFloat(parent.parent.CurrentBens[parent.parent.planname][21])))
				pretax+=parseFloat(parent.parent.CurrentBens[parent.parent.planname][21])
		}
		else
			var pretax = ""
		var afttax = parent.parent.CurrentBens[parent.parent.planname][19]
		if (!isNaN(parseFloat(pretax)) || !isNaN(parseFloat(afttax)))
		{
			var total = 0
			if (!isNaN(parseFloat(pretax))) total+=parseFloat(pretax)
			if (!isNaN(parseFloat(afttax))) total+=parseFloat(afttax)
		}
		else
			var total = ""
		var pctamtflag = parent.parent.CurrentBens[parent.parent.planname][11]

		bod += '<br><table class="plaintableborder" border="0" cellpadding="0" cellspacing="0">'
		if(parent.parent.CurrentBens[parent.parent.planname][13]=="P")
		{
			if(!isNaN(parseFloat(parent.parent.formatCont(pretax))))
			{
				bod += '<tr><td class="plaintableheaderborder">'+getSeaPhrase("DISPBEN_3","BEN")+'</td><td class="plaintablecellborder">'
				bod += parent.parent.formatCont(pretax)
				if(pctamtflag=="P")
					bod += getSeaPhrase("PER","BEN")
				bod += ' '+getSeaPhrase("PRE_TAX","BEN")+'</td><td class="plaintablecellborder">&nbsp;</td></tr>'
			}
			parent.parent.SelectedPlan[26] = "P"
			parent.parent.SelectedPlan[23] = pretax
			parent.parent.SelectedPlan[36] = ""
		}
		else if(parent.parent.CurrentBens[parent.parent.planname][13]=="A")
		{
			if(!isNaN(parseFloat(parent.parent.formatCont(afttax))))
			{
				bod += '<tr><td class="plaintableheaderborder">'+getSeaPhrase("DISPBEN_3","BEN")+'</td><td class="plaintablecellborder">'
				bod += parent.parent.formatCont(afttax)
				if(pctamtflag=="P")
					bod += getSeaPhrase("PER","BEN")
				bod += ' '+getSeaPhrase("AFTER_TAX","BEN")+'</td><td class="plaintablecellborder">&nbsp;</td></tr>'
			}
			parent.parent.SelectedPlan[26] = "A"
			parent.parent.SelectedPlan[36] = afttax
			parent.parent.SelectedPlan[23] = ""
		}
		else if(parent.parent.CurrentBens[parent.parent.planname][13]=="B")
		{
			if(!isNaN(parseFloat(parent.parent.formatCont(pretax))))
			{
				bod += '<tr><td class="plaintableheaderborder">'+getSeaPhrase("DISPBEN_3","BEN")+'</td><td class="plaintablecellborder">'
				bod += parent.parent.formatCont(pretax)
				if(pctamtflag=="P")
					bod += getSeaPhrase("PER","BEN")
				bod += ' '+getSeaPhrase("PRE_TAX","BEN")+'</td><td class="plaintablecellborder">&nbsp;</td></tr>'
			}
			if(!isNaN(parseFloat(parent.parent.formatCont(afttax))))
			{
				bod += '<tr><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">'
				bod += parent.parent.formatCont(afttax)
				if(pctamtflag=="P")
					bod += getSeaPhrase("PER","BEN")
				bod += ' '+getSeaPhrase("AFTER_TAX","BEN")+'</td><td class="plaintablecellborder">&nbsp;</td></tr>'
			}
			if(!isNaN(parseFloat(parent.parent.formatCont(total))))
			{
				bod += '<tr><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">'
				bod += parent.parent.formatCont(total)
				if(pctamtflag=="P")
					bod += getSeaPhrase("PER","BEN")
				bod += ' '+getSeaPhrase("TOTAL","BEN")+'<td class="plaintablecellborder">&nbsp;</td></tr>'
			}
			parent.parent.SelectedPlan[26] = "B"
			parent.parent.SelectedPlan[23] = pretax
			parent.parent.SelectedPlan[36] = afttax
		}
		bod += '</table><br>'
	}

	addlStr += '<br>'+parent.parent.contdivisor

	//PT118701: check if plan has already been elected
	for (var i=1;i<parent.parent.EligPlans.length;i++)
	{
    	if (parent.parent.EligPlans[i][1]==parent.parent.CurrentBens[parent.parent.planname][1]
		&& parent.parent.EligPlans[i][2]==parent.parent.CurrentBens[parent.parent.planname][2])
		{
			if (parent.parent.selectedPlanInGrp[i]) {
				parent.button1 = 0;
				parent.button2 = 0;
				addlStr += '<br>'+getSeaPhrase("ALREADY_ELECTED","BEN");
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
			addlStr += '<p>'+errMsg
		}
		else {
			parent.parent.setpreaft_flag(parent.parent.CurrentBens[parent.parent.planname][13])
		}
	}

	if(parent.REC_TYPE=="06")
	{
		parent.parent.SelectedPlan[40]=""
		parent.parent.SelectedPlan[43]=""
		if(parent.parent.CurrentEligPlan!="")
		{
			if (parent.parent.EligPlans[parent.parent.CurrentEligPlan][22]=="Y")
				parent.parent.SelectedPlan[40]=parent.parent.SelectedPlan[37]
		}
	}
	parent.parent.SelectedPlan[42]=parent.parent.CurrentBens[parent.parent.planname][11]
	parent.parent.SelectedPlan[41]=parent.parent.CurrentBens[parent.parent.planname][27]

// MOD BY BILAL
	html += parent.header('<br>');
	html += '<center>'
// END OF MOD
	html += '<table border="0" cellpadding="0" cellspacing="0">'
	html += '<tr><td class="plaintablecell" valign="top">'

	html += bod;
// MOD BY BILAL
//	html += '</td><td class="plaintablecell" valign="top" rowspan="2">'
	html += '</td></tr>'
	html += '<tr><td class="plaintablecell" valign="top">'
// END OF MOD
// MOD BY BILAL	-	Moving to Top
//	html += parent.header('<br>'+addlStr);
	html += '<center><br>'+addlStr + '</center>'
// END OF MOD
	html += '</td></tr>'
	html += '<tr><td class="plaintablecell" valign="top">'

	html += '<br><form name="options">'
	html += '<table class="plaintableborder" cellspacing="0" cellpadding="0" border="0" styler="list"><tr>'
	//html += '<th class="plaintablecellborder" nowrap>'+getSeaPhrase("DISPBEN_6","BEN")+'</th>'
	html += '<th class="plaintableheaderborder" style="text-align:center">'
	html += getSeaPhrase("OPTION","BEN")+'</th>'
	html += '<th class="plaintableheaderborder" style="text-align:center">'
	html += getSeaPhrase("SELECT","BEN")+'</th></tr>'

// MOD BY BILAL - Prior customization
	//ISH 2007 RENAME AND ADD LINK
	if(parent.button1!=0 && parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][12]=="Y") {
		html += '<tr>'
		html += '<td class="plaintablerowheaderborder" style="text-align:right">'+getSeaPhrase("DISPBEN_23","BEN")+'</td>'
		html += '<td class="plaintablecellborder" style="text-align:center">'
		html += '<input type="radio" name="option" value="0"></td></tr>'
		//html += '<a href="javascript:parent.setTaxType()">'+getSeaPhrase("DISPBEN_23","BEN")+'</a><br>'
	}
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
	html += '</table>'
	html += '<p>'
// MOD BY BILAL
//	html += uiButton(getSeaPhrase("CONTINUE","BEN"),"parent.parseChoice(this.form);return false","margin-top:10px")
//	html += uiButton(getSeaPhrase("EXIT","BEN"),"parent.parent.quitEnroll(parent.location);return false","margin-right:0px;margin-top:10px")
	html += '<center>'
	html += uiButton(getSeaPhrase("CONTINUE","BEN"),"parent.parseChoice(this.form);return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
	html += uiButton(getSeaPhrase("EXIT","BEN"),"parent.parent.quitEnroll(parent.location);return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px;margin-left:20px")
	html += '</center>'
// END OF MOD
	html += '</p>'
	html += '</form>'

	html += '</td></tr>'
	html += '</table>'
// MOD BY BILAL
	html += '</center>'
// MOD BY BILAL - Prior customization
	// JRZ reminder for flex spending
	var currentPlanType = escape(parent.parent.EligPlans[parent.parent.CurrentEligPlan][1],1);
	if(currentPlanType == "RS") {
			html +='<p>Flexible Spending is an annual election and you must re-elect each year.  If you want to elect the same amount of flexible spending from last year, you can choose �keep the same coverage� and it will default to your last plan year�s election.</p>'
	}
	//~JRZ
// END OF MOD
//	html += '</div>'
// END OF MOD

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
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/disp_ben_06.htm,v 1.14.2.21 2010/12/16 10:53:58 juanms Exp $ -->
