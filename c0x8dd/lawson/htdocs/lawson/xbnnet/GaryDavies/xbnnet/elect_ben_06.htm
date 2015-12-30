<html>
<head>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/ui/ui.js"></script>
<script>
var head=""
var bod=""
var flexflag=0
var empflag=0
var compflag=0
var BEN_START_DATE="" // start date of employee benefit
var BEN_YTD_CONT=""   // employee's ytd contribution
var cycles=0		  // pay periods remaining for year (web display)
var payperiods=0	  // employee pay periods remaining for year (web update)
REC_TYPE=parent.parent.EligPlans[parent.parent.CurrentEligPlan][6]
PRE_EMP_CONT_TYPE=parent.parent.SelectedPlan[24]
BAE_COST_DIVISOR=parent.parent.BenefitRules[6]
// Get pay frequency and pay plan from employee master
EMP_PAY_FREQ=parent.parent.emppayfreq
EMP_PLAN_CODE=parent.parent.otplancode

if(parent.parent.rule_type=="A") {
	if(parent.parent.actiontaken==3)
		BEN_START_DATE=parent.parent.FormatDte4(parent.parent.setStopDate(parent.parent.BenefitRules[2]))
	else
		BEN_START_DATE=parent.parent.FormatDte4(parent.parent.BenefitRules[2])
} else if(parent.parent.rule_type=="N")
	BEN_START_DATE=parent.parent.FormatDte4(parent.parent.EligPlans[parent.parent.CurrentEligPlan][5])
else {
	if(parent.parent.CurrentBens[parent.parent.planname] && parent.parent.CurrentBens[parent.parent.planname][40] 
	  && parent.parent.CurrentBens[parent.parent.planname][1] == parent.parent.EligPlans[parent.parent.CurrentEligPlan][1]
	  && parent.parent.CurrentBens[parent.parent.planname][2] == parent.parent.EligPlans[parent.parent.CurrentEligPlan][2])
		BEN_YTD_CONT=parent.parent.CurrentBens[parent.parent.planname][40]
	if(parent.parent.actiontaken==1)
		BEN_START_DATE=parent.parent.FormatDte4(parent.parent.EligPlans[parent.parent.CurrentEligPlan][11])
	else if(parent.parent.actiontaken==2 || parent.parent.actiontaken==4 || parent.parent.actiontaken==5)
		BEN_START_DATE=parent.parent.FormatDte4(parent.parent.EligPlans[parent.parent.CurrentEligPlan][13])
	else if(parent.parent.actiontaken==3)
		BEN_START_DATE=parent.parent.FormatDte4(parent.parent.setStopDate(parent.parent.EligPlans[parent.parent.CurrentEligPlan][15]))
	else
		BEN_START_DATE=parent.parent.FormatDte4(parent.parent.BenefitRules[2])
}

if(!isNaN(parseFloat(BEN_YTD_CONT)) && parent.parent.SelectedPlan[11]!=null && parent.parent.SelectedPlan[11]!="") {
	var ReducedMax = parseFloat(parent.parent.SelectedPlan[11])-parseFloat(BEN_YTD_CONT)
	if (ReducedMax<=0) {
		var alertmsg = getSeaPhrase("ERROR_110","BEN")
		parent.parent.seaAlert(alertmsg)
		parent.parent.document.getElementById("main").src = parent.parent.LastDoc[parent.parent.currentdoc]
		parent.parent.currentdoc--
	}
	parent.parent.SelectedPlan[11]=ReducedMax
}

function footer(precont,defaul)
{
	var html = "";
	html += '<span class="plaintablecell">'
	if(precont=="P"||precont=="N"||precont=="A")
	{
		if(precont=="P")
		{
			parent.parent.setpreaft_flag("P")
		}
		if(precont=="A")
		{
			parent.parent.setpreaft_flag("A")
		}
		if(precont=="N")
		{
			parent.parent.setpreaft_flag("")
		}
	}
	else
	{
		html += '<form name="preaft" onsubmit="return false">'
		if(defaul=="P")
		{
			parent.parent.setpreaft_flag("P")
			html += getSeaPhrase("ELECTBEN_6","BEN")+' '
			html += '<INPUT class="inputbox" TYPE=radio name=preaft value=pre onClick=parent.parent.setpreaft_flag("P") CHECKED>'+getSeaPhrase("PRE_TAX","BEN")
			html += '<INPUT class="inputbox" TYPE=radio name=preaft value=aft onClick=parent.parent.setpreaft_flag("A")>'+getSeaPhrase("AFTER_TAX","BEN")
		}
		else
		{
			if(defaul=="A")
			{
				parent.parent.setpreaft_flag("A")
				html += getSeaPhrase("ELECTBEN_6","BEN")+' '
				html += '<INPUT class="inputbox" TYPE=radio name=preaft value=pre onClick=parent.parent.setpreaft_flag("P")>'+getSeaPhrase("PRE_TAX","BEN")
				html += '<INPUT class="inputbox" TYPE=radio name=preaft value=aft onClick=parent.parent.setpreaft_flag("A") CHECKED>'+getSeaPhrase("AFTER_TAX","BEN")
			}
			else
			{
				parent.parent.setpreaft_flag("")
				html += getSeaPhrase("ELECTBEN_6","BEN")+' '
				html += '<INPUT class="inputbox" TYPE=radio name=preaft value=pre onClick=parent.parent.setpreaft_flag("P")>'+getSeaPhrase("PRE_TAX","BEN")
				html += '<INPUT class="inputbox" TYPE=radio name=preaft value=aft onClick=parent.parent.setpreaft_flag("A")>'+getSeaPhrase("AFTER_TAX","BEN")
			}
		}
		html += '</form>'
	}
	html += '<p>'
// MOD BY BILAL
//	html += uiButton(getSeaPhrase("CONTINUE","BEN"),"parent.limitCheck();return false","margin-top:10px")
	html += uiButton(getSeaPhrase("CONTINUE","BEN"),"parent.limitCheck();return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
	if(parent.parent.LastDoc[parent.parent.currentdoc]!=null)
	{
//		html += uiButton(getSeaPhrase("PREVIOUS","BEN"),"parent.parent.parent.document.getElementById('main').src='"+parent.parent.LastDoc[parent.parent.currentdoc]+"';parent.parent.parent.currentdoc--;return false","margin-top:10px")
		html += uiButton(getSeaPhrase("PREVIOUS","BEN"),"parent.parent.parent.document.getElementById('main').src='"+parent.parent.LastDoc[parent.parent.currentdoc]+"';parent.parent.parent.currentdoc--;return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px;margin-left:15px")
	}
//	html += uiButton(getSeaPhrase("EXIT","BEN"),"parent.parent.parent.quitEnroll(parent.parent.location);return false","margin-top:10px")
	html += uiButton(getSeaPhrase("EXIT","BEN"),"parent.parent.parent.quitEnroll(parent.parent.location);return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px;margin-left:15px")
// END OF MOD
	html += '</p>'
	html += '</span>'
// MOD BY BILAL
	html += '</center>'
// END OF MOD
	return html;
}

function limitCheck()
{
	var payperamt=parseFloat('')
	var mthamt=parseFloat('')
	var annamt=parseFloat('')
	var percent=parseFloat('')
	var mthmin=0
	var mthmax=0
	var payperiodcalc=''

	if(self.MAIN.document.type6a && self.MAIN.document.type6a.payper)
	{
		payperamt=parseFloat(parent.parent.roundToPennies(self.MAIN.document.type6a.payper.value))
		if(!isNaN(payperamt))
			self.MAIN.document.type6a.payper.value=parent.parent.roundToPennies(payperamt)
	}
	if(self.MAIN.document.type6a && self.MAIN.document.type6a.mth)
	{
		mthamt=parseFloat(parent.parent.roundToPennies(self.MAIN.document.type6a.mth.value))
		if(!isNaN(mthamt))
			self.MAIN.document.type6a.mth.value=parent.parent.roundToPennies(mthamt)
	}
	if(self.MAIN.document.type6a && self.MAIN.document.type6a.ann)
	{
		annamt=parseFloat(parent.parent.roundToPennies(self.MAIN.document.type6a.ann.value))
		if(!isNaN(annamt))
			self.MAIN.document.type6a.ann.value=parent.parent.roundToPennies(annamt)
	}
	if(self.MAIN.document.type6b && self.MAIN.document.type6b.ann)
		percent=parseFloat(parent.parent.roundToPennies(self.MAIN.document.type6b.ann.value))

	// PT 150030. Get min and max percent values right away because we may need these
	// to calculate min and max contribution amounts.
	if(parent.parent.SelectedPlan[13]!=null && parent.parent.SelectedPlan[13]!="")
		var percentmin=parseFloat(parent.parent.SelectedPlan[13])
	else
		var percentmin=0
	if(parent.parent.SelectedPlan[15]!=null && parent.parent.SelectedPlan[15]!="")
		var percentmax=parseFloat(parent.parent.SelectedPlan[15])
	else
		var percentmax=0

	if(parent.parent.SelectedPlan[5]!=null && parent.parent.SelectedPlan[5]!="")
		var paypermin=parseFloat(parent.parent.SelectedPlan[5])
	else
		var paypermin=0
	if(parent.parent.SelectedPlan[7]!=null && parent.parent.SelectedPlan[7]!="")
		var paypermax=parseFloat(parent.parent.SelectedPlan[7])
	else
		var paypermax=0

	// PT146313
	if(parent.parent.SelectedPlan[9]!=null && parent.parent.SelectedPlan[9]!="")
	{
		var annmin=parseFloat(parent.parent.SelectedPlan[9])
		if(parent.parent.BenefitRules[6]=="M" || parent.parent.BenefitRules[6]=="S")
		{
			// PT 152252. Monthly contribution incorrectly rounded up.
			mthmin=parent.parent.roundToPennies(annmin/cycles);
		}
	}
	else
	{
		var annmin=0
		var mthmin=0
		// PT114702
		if(paypermin>0)
		{
			mthmin=(paypermin*payperiods)/cycles;
			// PT 151080
			annmin=(paypermin*payperiods);
		}
	}

	// PT 150030. If the contribution type is amount and there is a minimum percent, set the annual min based on the
	// salary in CAL-SALARY2 from BS15.1.
	if(parent.parent.SelectedPlan[24]=="A" && parent.parent.SelectedPlan[13]!=null && parent.parent.SelectedPlan[13]!="" && parent.parent.SelectedPlan[17]!=null && parent.parent.SelectedPlan[17]!="")
	{
		var annmin2=(percentmin*parent.parent.SelectedPlan[17])/100;
		// if there is no annual min for the plan, or if there is but we just calculated a larger minimum amount, set it
		if (annmin == 0 || (annmin2 > annmin))
		{
			annmin=annmin2;
			if(parent.parent.BenefitRules[6]=="M" || parent.parent.BenefitRules[6]=="S")
			{
				// PT 152252. Monthly contribution incorrectly rounded up.
				mthmin=parent.parent.roundToPennies(annmin/cycles);
			}
		}
	}

	if(parent.parent.SelectedPlan[11]!=null && parent.parent.SelectedPlan[11]!="")
	{
		var annmax=parseFloat(parent.parent.SelectedPlan[11])
		if(parent.parent.BenefitRules[6]=="M" || parent.parent.BenefitRules[6]=="S")
			mthmax=parent.parent.Truncate(annmax/cycles)
	}
	else
	{
		var annmax=0
		var mthmax=0
		// PT114702
		if(paypermax>0)
		{
			mthmax=(paypermax*payperiods)/cycles;
			// PT 151080
			annmax=(paypermax*payperiods);
		}
	}

	// PT 150030. If the contribution type is amount and there is a maximum percent, set the annual max based on the
	// salary in CAL-SALARY2 from BS15.1.
	if(parent.parent.SelectedPlan[24]=="A" && parent.parent.SelectedPlan[15]!=null && parent.parent.SelectedPlan[15]!="" && parent.parent.SelectedPlan[17]!=null && parent.parent.SelectedPlan[17]!="")
	{
		var annmax2=(percentmax*parent.parent.SelectedPlan[17])/100;
		// if there is no annual max for the plan, or if there is but we just calculated a smaller maximum amount, set it
		if (annmax == 0 || (annmax2 < annmax))
		{
			annmax=annmax2;
			if(parent.parent.BenefitRules[6]=="M" || parent.parent.BenefitRules[6]=="S")
				mthmax=parent.parent.Truncate(annmax/cycles);
		}
	}

	var msg=""
	if(parent.parent.SelectedPlan[24]=="A" && (isNaN(payperamt) || payperamt==0) && (isNaN(mthamt) || mthamt==0)  && (isNaN(annamt) || annamt==0))
		msg=getSeaPhrase("ERROR_69","BEN")
	else if(parent.parent.SelectedPlan[24]=="P" && (isNaN(percent) || percent==0))
		msg=getSeaPhrase("ERROR_70","BEN")
	else if(parent.parent.SelectedPlan[24]=="B" && (isNaN(percent) || percent==0) && (isNaN(payperamt) || payperamt==0) && (isNaN(mthamt) || mthamt==0) && (isNaN(annamt) || annamt==0))
		msg=getSeaPhrase("ERROR_71","BEN")
	else if(parent.parent.SelectedPlan[24]=="B" && !isNaN(percent) && percent!=0 && ((!isNaN(payperamt) && payperamt!=0) || (!isNaN(mthamt) && mthamt!=0) || (!isNaN(annamt) && annamt!=0)))
		msg=getSeaPhrase("ERROR_72","BEN")

	if(parent.parent.SelectedPlan[24]=="A" || parent.parent.SelectedPlan[24]=="B")
	{
		if(parent.parent.BenefitRules[6]!="P")
		{
			if(isNaN(mthamt) || isNaN(annamt))
			{
				if(!isNaN(mthamt) && isNaN(annamt))
					annamt=mthamt*cycles
				if(isNaN(mthamt) && !isNaN(annamt))
					mthamt=annamt/cycles
			}
			else if(parent.parent.BenefitRules[6]=="M")
			{
				if(mthamt!=parent.parent.roundToPennies(annamt/cycles))
					msg=getSeaPhrase("ERROR_107","BEN")
			}
			else if(parent.parent.BenefitRules[6]=="S")
			{
				if(mthamt!=parent.parent.roundToPennies(annamt/cycles))
					msg=getSeaPhrase("ERROR_108","BEN")
			}
		}
		else
		{
			if(isNaN(payperamt) || isNaN(annamt))
			{
				if(!isNaN(payperamt) && isNaN(annamt))
					annamt=payperamt*cycles
				if(isNaN(payperamt) && !isNaN(annamt))
					payperamt=annamt/cycles
			}
			else
			{
				if(payperamt!=parent.parent.roundToPennies(annamt/cycles))
					msg=getSeaPhrase("ERROR_76","BEN")
			}
		}
	}
	if(parent.parent.SelectedPlan[24]=="P")
	{
		if(isNaN(percent))
			msg=getSeaPhrase("ERROR_70","BEN")
	}
	if(parent.parent.BenefitRules[6]=="M" || parent.parent.BenefitRules[6]=="S")
	{
		if(parent.parent.BenefitRules[6]=="M" && self.MAIN.document.type6a && self.MAIN.document.type6a.mth
			&& parent.parent.NonSpace(self.MAIN.document.type6a.mth.value))
		{
			if(mthmin!=0 && mthamt<mthmin && msg=="")
				msg=(getSeaPhrase("ELECTBEN_12","BEN")+" "+parent.parent.roundToPennies(mthmin))
			if(mthmax!=0 && mthamt>mthmax && msg=="")
				msg=(getSeaPhrase("ELECTBEN_13","BEN")+" "+parent.parent.roundToPennies(mthmax))
		}
		if(parent.parent.BenefitRules[6]=="S" && self.MAIN.document.type6a && self.MAIN.document.type6a.mth
			&& parent.parent.NonSpace(self.MAIN.document.type6a.mth.value))
		{
			if(mthmin!=0 && mthamt<mthmin && msg=="")
				msg=(getSeaPhrase("ELECTBEN_14","BEN")+" "+parent.parent.roundToPennies(mthmin))
			if(mthmax!=0 && mthamt>mthmax && msg=="")
				msg=(getSeaPhrase("ELECTBEN_15","BEN")+" "+parent.parent.roundToPennies(mthmax))
		}
	}
	else if(self.MAIN.document.type6a && self.MAIN.document.type6a.payper
		&& parent.parent.NonSpace(self.MAIN.document.type6a.payper.value))
	{
		if(paypermin!=0 && payperamt<paypermin && msg=="")
			msg=(getSeaPhrase("ELECTBEN_16","BEN")+" "+parent.parent.roundToPennies(paypermin))
		if(paypermax!=0 && payperamt>paypermax && msg=="")
			msg=(getSeaPhrase("ELECTBEN_17","BEN")+" "+parent.parent.roundToPennies(paypermax))
	}

	if(annmin!=0 && annamt<annmin && msg=="")
		msg=(getSeaPhrase("ELECTBEN_18","BEN")+" "+parent.parent.roundToPennies(annmin))
	if(annmax!=0 && annamt>annmax && msg=="")
		msg=(getSeaPhrase("ELECTBEN_19","BEN")+" "+parent.parent.roundToPennies(annmax))
	if(percentmin!=0 && percent<percentmin && msg=="")
		msg=(getSeaPhrase("ELECTBEN_20","BEN")+" "+parent.parent.roundToPennies(percentmin)+getSeaPhrase("PER","BEN"))
	if(percentmax!=0 && percent>percentmax && msg=="")
		msg=(getSeaPhrase("ELECTBEN_21","BEN")+" "+parent.parent.roundToPennies(percentmax)+getSeaPhrase("PER","BEN"))

	if((!isNaN(payperamt) && payperamt<0) || (!isNaN(mthamt) && mthamt<0) || (!isNaN(annamt) && annamt<0) || (!isNaN(percent) && percent<0))
		msg = getSeaPhrase("ELECTBEN_36","BEN")

	if(msg=="")
	{
		if(!isNaN(parseFloat(percent)))
		{
			annamt=percent
			payperamt=''
			parent.parent.SelectedPlan[24]="P"
		}
		else if(!isNaN(parseFloat(annamt)))
		{
			payperamt=parent.parent.RoundUp(annamt/cycles)
			payperiodcalc=parent.parent.RoundUp(annamt/payperiods)
			parent.parent.SelectedPlan[19]=-1 // tell confirm not to re-compute employee cost
			parent.parent.SelectedPlan[24]="A"
		}
		else if(!isNaN(parseFloat(payperamt)))
		{
			parent.parent.SelectedPlan[24]="A"
		}

		annamt = isNaN(annamt) ? "" : annamt;
		payperamt = isNaN(payperamt) ? "" : payperamt;

		if (parent.parent.EligPlans[parent.parent.CurrentEligPlan][1] == "RS")
		{
			parent.parent.SelectedPlan[42]=parent.parent.SelectedPlan[24]
			parent.parent.SelectedPlan[23]=parent.parent.roundToPennies(annamt)
			parent.parent.SelectedPlan[16]=payperamt
			parent.parent.SelectedPlan[37]=cycles
			parent.parent.SelectedPlan[18]=""
			parent.parent.SelectedPlan[22]=""
			parent.parent.SelectedPlan[40]=""
			parent.parent.SelectedPlan[43]=""
		}
		else
		{
	  		parent.parent.SelectedPlan[42]=parent.parent.SelectedPlan[24]
			parent.parent.SelectedPlan[23]=parent.parent.roundToPennies(annamt)
			parent.parent.SelectedPlan[16]=payperamt
			parent.parent.SelectedPlan[37]=cycles
			parent.parent.SelectedPlan[18]=""
			parent.parent.SelectedPlan[22]=""
			parent.parent.SelectedPlan[40]=""
			parent.parent.SelectedPlan[43]=""
		}

		if (parent.parent.CurrentEligPlan!="" && parent.parent.EligPlans[parent.parent.CurrentEligPlan][1] == "RS")
		{
			if (parent.parent.EligPlans[parent.parent.CurrentEligPlan][22]=="Y" ||
				(typeof(parent.parent.EligPlans[parent.parent.CurrentEligPlan][23])!="undefined"
				&&	parent.parent.EligPlans[parent.parent.CurrentEligPlan][23]=="Y"))
			{
				parent.parent.SelectedPlan[40]=payperiods
			}
		}

		if (parent.parent.EligPlans[parent.parent.CurrentEligPlan][1] == "RS")
		{
			if (parent.parent.SelectedPlan[40]=="")
				parent.parent.SelectedPlan[43]=parent.parent.roundToPennies(payperiodcalc)
		}
		parent.setBenefit(parent.parent.SelectedPlan[26])
	}
	else
		parent.parent.seaAlert(msg)
}

function ElectScreen()
{
	stylePage();

	if (parent.parent.EligPlans[parent.parent.CurrentEligPlan][1] == "RS")
	{
		// If the COST-DIV-CYCLE and PAY-FREQ-CYCLE fields were returned by BS15, use it for the cycles remaining value (application version 9.0.1 or higher).
		if (typeof(parent.parent.SelectedPlan[52]) != "undefined" && parent.parent.SelectedPlan[52] != ""
			&& typeof(parent.parent.SelectedPlan[53]) != "undefined" && parent.parent.SelectedPlan[53] != "")
		{
			if (BAE_COST_DIVISOR == "A")
				cycles = 1;
			else if (parent.parent.SelectedPlan[52])
				cycles = parent.parent.SelectedPlan[52]; // cost divisor cycles remaining from BS15 here

			if (BAE_COST_DIVISOR == "P")
				payperiods = cycles;
			else if (parent.parent.SelectedPlan[53])
				payperiods = parent.parent.SelectedPlan[53]; // employee pay frequency cycles remaining from BS15 here
		}
		else if (self.cycleslib.GetNbrCycles) // cycles.htm library exists
		{
			if (BAE_COST_DIVISOR=="A")
				cycles=1
			else
				cycles=self.cycleslib.GetNbrCycles(BAE_COST_DIVISOR,EMP_PAY_FREQ,BEN_START_DATE,EMP_PLAN_CODE)

			if (BAE_COST_DIVISOR=="P")
				payperiods=cycles
			else
				payperiods=self.cycleslib.GetNbrCycles("P",EMP_PAY_FREQ,BEN_START_DATE,EMP_PLAN_CODE)
		}
	}
	else
	{
		// if the cost divisor is P, divide amounts according employee's pay frequency;
		// otherwise, divide amounts according to the cost divisor
		if(BAE_COST_DIVISOR=="P")
		{
			if(EMP_PAY_FREQ == 1)
				cycles=52
			else if(EMP_PAY_FREQ == 2)
				cycles=26
			else if(EMP_PAY_FREQ == 3)
				cycles=24
			else if(EMP_PAY_FREQ == 4)
				cycles=12
			else
				cycles=1
		}
		else
		{
			if(BAE_COST_DIVISOR == "S")
				cycles=24
			else if(BAE_COST_DIVISOR == "M")
				cycles=12
			else
				cycles=1
		}

		payperiods = cycles;
	}

	if(cycles==0 || payperiods==0 || isNaN(parseFloat(cycles)) || isNaN(parseFloat(payperiods)))
	{
		parent.parent.removeWaitAlert();
		if (typeof(parent.parent.parent.parent.removeWaitAlert) != "undefined") {
			parent.parent.parent.parent.removeWaitAlert();
		}
		var alertmsg = getSeaPhrase("ERROR_111","BEN")
		             + "\n"
		             + getSeaPhrase("ERROR_12","BEN")
		parent.parent.seaAlert(alertmsg)
		parent.parent.selectedPlanInGrp[parent.parent.CurrentEligPlan]=true
		parent.parent.cantEnroll[parent.parent.CurrentEligPlan]=true
		parent.parent.notAvailable[parent.parent.CurrentEligPlan]=true
		for (var i=parent.parent.LastDoc.length-1;i>=0;i--)
		{
			if(parent.parent.LastDoc[i]==parent.parent.baseurl+"availplans.htm")
			{
				parent.parent.currentdoc=i
				var tmpLastDoc=new Array()
				for (var j=0; j<(i+1); j++)
					tmpLastDoc[j]=parent.parent.LastDoc[j]
                parent.parent.LastDoc=tmpLastDoc;
				parent.parent.document.getElementById("main").src = parent.parent.LastDoc[parent.parent.currentdoc]
				return
			}
		}
		parent.parent.LastDoc=new Array()
		parent.parent.currentdoc=0
		parent.parent.document.getElementById("main").src = parent.parent.baseurl+"availplans.htm"
		return
	}

	precont = parent.parent.SelectedPlan[26]
	defaul = parent.parent.SelectedPlan[28]

	var payperMin = payperMax = annualMin = annualMax = annualPercentMin = annualPercentMax = 0;
	var bod1 = "";
	var bod2 = "";
	var bod3 = "";
	var html = '<div class="plaintablecell" style="padding-top:10px">'
	// MOD BY BILAL
		html += '<center>'
	// END OF MOD
	var addlMsg = "";

	if(precont=="P"||precont=="N"||precont=="A")
	{
		if(precont=="P")
		{
			addlMsg += '<br>'+getSeaPhrase("ELECTBEN_3","BEN")
		}
		if(precont=="A")
		{
			parent.parent.setpreaft_flag("A")
			addlMsg += '<br>'+getSeaPhrase("ELECTBEN_4","BEN")
		}
		if(precont=="N")
		{
			parent.parent.setpreaft_flag("")
			addlMsg += '<br>'+getSeaPhrase("ELECTBEN_7","BEN")
		}
	}

// MOD BY BILAL
//	bod2 +=	parent.header(addlMsg);
	html +=	parent.header(addlMsg);
	html += '<center>'
// END OF MOD

	if(parent.parent.SelectedPlan[24]=="A" || parent.parent.SelectedPlan[24]=="B")
	{
		if (parent.parent.SelectedPlan[5]!=null && parent.parent.SelectedPlan[5]!="" && !isNaN(parseFloat(payperiods)))
		{
			if (!parent.parent.SelectedPlan[9])
			{
				parent.parent.SelectedPlan[9] = parent.parent.SelectedPlan[5]*payperiods;
			}
		}

		// if the max pay period amt * payperiods remaining is less than the annual max,
		// adjust the annual max lower.
		if (parent.parent.SelectedPlan[7]!=null && parent.parent.SelectedPlan[7]!="" && !isNaN(parseFloat(payperiods)))
		{
			var payperiodmaxcont = parent.parent.SelectedPlan[7]*payperiods;
			if (parent.parent.SelectedPlan[11]!=null && parent.parent.SelectedPlan[11]!="")
			{
				if (parent.parent.SelectedPlan[11] > payperiodmaxcont)
					parent.parent.SelectedPlan[11] = payperiodmaxcont;
			}
			else
				parent.parent.SelectedPlan[11] = payperiodmaxcont;
		}

		bod1 += '<br><span class="plaintablecell">'+getSeaPhrase("ELECTBEN_22","BEN")+'</span><p>'

		// pay period min/max values
		if(parent.parent.BenefitRules[6]!="A" || (!isNaN(parseFloat(cycles)) && cycles>1))
		{
			if(parent.parent.BenefitRules[6]=="P")
			{
				if(parent.parent.SelectedPlan[5]!=null && parent.parent.SelectedPlan[5]!="") {
					payperMin = parent.parent.roundToPennies(parent.parent.SelectedPlan[5])
				}
				if(parent.parent.SelectedPlan[7]!=null && parent.parent.SelectedPlan[7]!="") {
					payperMax = parent.parent.Truncate(parent.parent.SelectedPlan[7])
				}
			}
			else
			{
				if((parent.parent.SelectedPlan[5]!=null && parent.parent.SelectedPlan[5]!="")
				||(parent.parent.SelectedPlan[9]!=null && parent.parent.SelectedPlan[9]!=""))
				{
					if(!isNaN(parseFloat(cycles)))
					{
						if(parent.parent.SelectedPlan[9]!=null && parent.parent.SelectedPlan[9]!="") {
							payperMin = parent.parent.ForceRoundUp(parent.parent.SelectedPlan[9]/cycles)
						}
						else if(parent.parent.SelectedPlan[5]!=null && parent.parent.SelectedPlan[5]!="") {
							payperMin = parent.parent.ForceRoundUp((parent.parent.SelectedPlan[5]*payperiods)/cycles)
						}
						if(parent.parent.SelectedPlan[5]!=null && parent.parent.SelectedPlan[5]!=""
						&& Number(parent.parent.roundToPennies(parent.parent.SelectedPlan[5])) > Number(payperMin)) {
							payperMin = parent.parent.roundToPennies(parent.parent.SelectedPlan[5])
						}
					}
					else if(parent.parent.SelectedPlan[5]!=null && parent.parent.SelectedPlan[5]!="") {
						payperMin = parent.parent.roundToPennies(parent.parent.SelectedPlan[5])
					}
				}
				if((parent.parent.SelectedPlan[7]!=null && parent.parent.SelectedPlan[7]!="")
				||(parent.parent.SelectedPlan[11]!=null && parent.parent.SelectedPlan[11]!=""))
				{
					if(!isNaN(parseFloat(cycles)))
					{
						if(parent.parent.SelectedPlan[11]!=null && parent.parent.SelectedPlan[11]!="") {
							payperMax = parent.parent.Truncate(parent.parent.SelectedPlan[11]/cycles)
						}
						else if(parent.parent.SelectedPlan[7]!=null && parent.parent.SelectedPlan[7]!="") {
							payperMax = parent.parent.Truncate((parent.parent.SelectedPlan[7]*payperiods)/cycles)
						}
					}
					else if(parent.parent.SelectedPlan[7]!=null && parent.parent.SelectedPlan[7]!="")
					{
						payperMax = parent.parent.Truncate(parent.parent.SelectedPlan[7])
					}
				}
			}

			bod1 += '<form name=type6a onSubmit="return false">'
			bod1 += '<table border="0" cellspacing="0" cellpadding="0">'
// MOD BY BILAL
//			bod1 += '<tr><td class="plaintablecell">'
			bod1 += '<tr><td class="plaintablecell" style="text-align:left">'
// END OF MOD
			if(parent.parent.BenefitRules[6]=="A")
				bod1 += '<input class="inputbox" id=amount type=text size=8 name=mth> '+getSeaPhrase("PER_YEAR","BEN")
			else if(parent.parent.BenefitRules[6]=="M")
				bod1 += '<input class="inputbox" id=amount type=text size=8 name=mth> '+getSeaPhrase("PER_MONTH","BEN")
			else if(parent.parent.BenefitRules[6]=="S")
				bod1 += '<input class="inputbox" id=amount type=text size=8 name=mth> '+getSeaPhrase("SEMI_MONTHLY","BEN").toLowerCase()
			else
				bod1 += '<input class="inputbox" id=amount type=text size=8 name=payper> '+getSeaPhrase("PER_PP","BEN")
			bod1 += '</td></tr>'
			bod1 += '</table>'

			bod1 += '<table border="0" cellspacing="0" cellpadding="0">'

			if (!isNaN(parseFloat(cycles)) && parent.parent.EligPlans[parent.parent.CurrentEligPlan][1]=="RS")
			{
				if(cycles>1)
					bod1 += '<tr><td class="plaintablecell" style="text-align:right">'+cycles+' '+getSeaPhrase("ELECTBEN_23","BEN")
				else
					bod1 += '<tr><td class="plaintablecell" style="text-align:right">'+cycles+' '+getSeaPhrase("ELECTBEN_24","BEN")
			}
			bod1 += '<tr><td class="plaintablecell" colspan="4">'+getSeaPhrase("OR","BEN")
		}
		else
		{
			bod1 += '<form name=type6a onSubmit="return false">'
			bod1 += '<table border="0" cellspacing="0" cellpadding="0">'
			bod1 += '<tr><td colsplan="4">&nbsp;</td></tr>'
			bod1 += '<tr><td colspan="4">&nbsp;</td></tr>'
		}
		if(parent.parent.rule_type=="A")
			bod1 += '<tr><td class="plaintablecell"><input class="inputbox" id=amount type=text size=8 name=ann> '+getSeaPhrase("PER_YEAR","BEN")
		else
			bod1 += '<tr><td class="plaintablecell"><input class="inputbox" id=amount type=text size=8 name=ann> '+getSeaPhrase("ELECTBEN_25","BEN")

		if(parent.parent.SelectedPlan[9]!=null && parent.parent.SelectedPlan[9]!="") {
			annualMin = parent.parent.roundToPennies(parent.parent.SelectedPlan[9])
			// PT 150030. If the contribution type is amount and there is a minimum percent, set the annual min based on the
			// salary in CAL-SALARY2 from BS15.1.
			if(parent.parent.SelectedPlan[24]=="A" && parent.parent.SelectedPlan[13]!=null && parent.parent.SelectedPlan[13]!="" && parent.parent.SelectedPlan[17]!=null && parent.parent.SelectedPlan[17]!="")
			{
				var annualMin2=(parent.parent.SelectedPlan[13]*parent.parent.SelectedPlan[17])/100;
				// if there is no annual min for the plan, or if there is but we just calculated a larger minimum amount, set it
				if (annualMin == 0 || (annualMin2 > annualMin))
				{
					annualMin=parent.parent.roundToPennies(annualMin2);
				}
			}
		}
		if(parent.parent.SelectedPlan[11]!=null && parent.parent.SelectedPlan[11]!="")
		{
			annualMax = parent.parent.roundToPennies(parent.parent.SelectedPlan[11])
			// PT 150030. If the contribution type is amount and there is a maximum percent, set the annual max based on the
			// salary in CAL-SALARY2 from BS15.1.
			if(parent.parent.SelectedPlan[24]=="A" && parent.parent.SelectedPlan[15]!=null && parent.parent.SelectedPlan[15]!="" && parent.parent.SelectedPlan[17]!=null && parent.parent.SelectedPlan[17]!="")
			{
				var annualMax2=(parent.parent.SelectedPlan[15]*parent.parent.SelectedPlan[17])/100;
				// if there is no annual max for the plan, or if there is but we just calculated a smaller maximum amount, set it
				if (annualMax == 0 || (annualMax2 < annualMax))
				{
					annualMax=parent.parent.parent.roundToPennies(annualMax2);
				}
// MOD BY BILAL - Prior customization
				//ISH 2007 Add Per Pay Period Maximum
				bod1 +=parent.parent.roundToPennies(annualMax) + ' year ' + parent.parent.Truncate(annualMax/cycles,0) + ' pay period<td></tr>'
// END OF MOD
			}
		}

		bod1 += '</table></form>'
	}
	if(parent.parent.SelectedPlan[24]=="B")
	{
		bod1 += '<br><span class="plaintablecell">'+getSeaPhrase("OR","BEN")+'</span><br>'
	}
	if(parent.parent.SelectedPlan[24]=="P" || parent.parent.SelectedPlan[24]=="B")
	{
		bod1 += '<br><span class="plaintablecell">'+getSeaPhrase("ELECTBEN_26","BEN")+'</span><br>'
		bod1 += '<form name=type6b onSubmit="return false">'
		bod1 += '<table border="0" cellspacing="0" cellpadding="0">'
		bod1 += '<tr><td>&nbsp;<td class="plaintablecell"><input class="inputbox" id=amount type=text size=8 name=ann>'

		if(parent.parent.SelectedPlan[13]!=null && parent.parent.SelectedPlan[13]!="") {
			annualPercentMin = parent.parent.roundToPennies(parent.parent.SelectedPlan[13])
		}
		if(parent.parent.SelectedPlan[15]!=null && parent.parent.SelectedPlan[15]!="") {
			annualPercentMax = parent.parent.roundToPennies(parent.parent.SelectedPlan[15])
		}
		bod1 += '</table></form>'
	}

	bod3 += footer(parent.parent.SelectedPlan[26],parent.parent.SelectedPlan[28])

	html += '<table border="0" cellpadding="0" cellspacing="0">'
// MOD BY BILAL
	html += '<tr><td class="plaintablecell" valign="top">'
	html += bod1
	html += '<br><br></td></tr>'
// END OF MOD

	html += '<tr>'

	if (payperMin != 0 || payperMax != 0 || annualMin != 0 || annualMax != 0 || annualPercentMin != 0 || annualPercentMax != 0) {

		var ppHdrStrMin = "";
		var ppHdrStrMax = "";

		switch(parent.parent.BenefitRules[6]) {
			case "A": break;
			case "P": ppHdrStrMin = getSeaPhrase("PAY_PERIOD_MIN","BEN");
					  ppHdrStrMax = getSeaPhrase("PAY_PERIOD_MAX","BEN");
					  break;
			case "M": ppHdrStrMin = getSeaPhrase("MONTHLY_MIN","BEN");
					  ppHdrStrMax = getSeaPhrase("MONTHLY_MAX","BEN");
					  break;
			case "S": ppHdrStrMin = getSeaPhrase("SEMIMONTHLY_MIN","BEN");
					  ppHdrStrMax = getSeaPhrase("SEMIMONTHLY_MAX","BEN");
					  break;
			default: break;
		}

		html += '<td class="plaintablecell" valign="top">'

		if (ppHdrStrMin != "" && ppHdrStrMax != "" && payperMin != 0 || payperMax != 0) {
			html += '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" styler="list">'
			html += '<tr><th class="plaintableheaderborder" nowrap>'
			html += ppHdrStrMin
			html += '</th><th class="plaintableheaderborder" nowrap>'
			html += ppHdrStrMax
			html += '</th></tr>'
			html += '<tr><td class="plaintablecellborder">&nbsp;'
			html += parent.parent.formatCont2(payperMin)
			html += '</td><td class="plaintablecellborder">&nbsp;'
			html += parent.parent.formatCont2(payperMax)
			html += '</td></tr>'
			html += '</table><br>';
		}

		if (annualMin != 0 || annualMax != 0) {
			html += '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" styler="list">'
			html += '<tr><th class="plaintableheaderborder" nowrap>'
			html += getSeaPhrase("ANNUAL_MIN","BEN")
			html += '</th><th class="plaintableheaderborder" nowrap>'
			html += getSeaPhrase("ANNUAL_MAX","BEN")
// MOD BY BILAL
				//ISH 2007 Add Per Pay Period Maximum
			html += '</th><th class="plaintableheaderborder" nowrap>'
			html += getSeaPhrase("PAY_PERIOD_MAX","BEN");
// END OF MOD 
			html += '</th></tr>'
			html += '<tr><td class="plaintablecellborder">&nbsp;'
			html += parent.parent.formatCont2(annualMin)
			html += '</td><td class="plaintablecellborder">&nbsp;'
			html += parent.parent.formatCont2(annualMax)
// MOD BY BILAL
				//ISH 2007 Add Per Pay Period Maximum
			html += '</td><td class="plaintablecellborder">&nbsp;'
			if (parent.parent.EligPlans[parent.parent.CurrentEligPlan][2] == "RSD1")  // FLEX SPEND DEPENDENT
			   html += '192.30'
			else
			   html += parent.parent.Truncate(annualMax/cycles,0)
// END OF MOD
			html += '</td></tr>'
			html += '</table><br>'
		}

		if (annualPercentMin != 0 || annualPercentMax != 0) {
			html += '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" styler="list">'
			html += '<tr><th class="plaintableheaderborder" nowrap>'
			html += getSeaPhrase("ANNUAL_MIN","BEN")
			html += '</th><th class="plaintableheaderborder" nowrap>'
			html += getSeaPhrase("ANNUAL_MAX","BEN")
			html += '</th></tr>'
			html += '<tr><td class="plaintablecellborder">&nbsp;'
			html += parent.parent.formatCont2(annualPercentMin)+getSeaPhrase("PER","BEN")
			html += '</td><td class="plaintablecellborder">&nbsp;'
			html += parent.parent.formatCont2(annualPercentMax)+getSeaPhrase("PER","BEN")
			html += '</td></tr>'
			html += '</table>'
		}

		html += '</table>'

		html += '</td>'
		html += '<td class="plaintablecell" valign="top">'
	}
	else {
		html += '<td class="plaintablecell" valign="top" colspan="2">'
	}

// MOD BY BILAL
//	html += bod2
// END OF MOD
	html += '</td></tr>'
//MOD BY BILAL	- Shifted above
//	html += '<tr><td class="plaintablecell" valign="top" colspan="2">'
//	html += bod1
//	html += '</td></tr>'
//END OF MOD
	html += '<tr><td class="plaintablecell" style="text-align:right" valign="top" colspan="2">'

	html += bod3

	html += '</td></tr>'
	html += '</table>'

	html += '</div>'
	parent.parent.removeWaitAlert();
	if (typeof(parent.parent.parent.removeWaitAlert) != "undefined") {
		parent.parent.parent.removeWaitAlert();
	}

	self.MAIN.document.getElementById("paneBody").innerHTML = html
	self.MAIN.document.getElementById("paneHeader").innerHTML = '<span>'+getSeaPhrase("BEN_ELECT","BEN")+' - '+parent.parent.EligPlans[parent.parent.CurrentEligPlan][8]+'</span>';
	self.MAIN.stylePage();
	document.getElementById("MAIN").style.visibility = "visible";
}

function fitToScreen()
{
	if (typeof(window["styler"]) == "undefined" || window.styler == null)
	{
		window.stylerWnd = findStyler(true);
	}

	if (!window.stylerWnd)
	{
		return;
	}

	if (typeof(window.stylerWnd["StylerEMSS"]) == "function")
	{
		window.styler = new window.stylerWnd.StylerEMSS();
	}
	else
	{
		window.styler = window.stylerWnd.styler;
	}

	var mainFrame = document.getElementById("MAIN");
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
	if (self.MAIN.onresize && self.MAIN.onresize.toString().indexOf("setLayerSizes") >= 0)
	{
		self.MAIN.onresize = null;
	}

	mainFrame.style.width = (winWidth - 10) + "px";
	mainFrame.style.height = (winHeight - 25) + "px";

	var fullContentWidth = (window.styler && window.styler.showLDS) ? (winWidth - 17) : ((navigator.appName.indexOf("Microsoft") >= 0) ? (winWidth - 12) : (winWidth - 12));
	var fullPaneContentWidth = (window.styler && window.styler.showLDS) ? fullContentWidth - 15 : fullContentWidth - 5;

	try
	{
		if (fullContentWidth > 0)
		{
			self.MAIN.document.getElementById("paneBorder").style.width = fullContentWidth + "px";
		}
		if (winHeight >= 35)
		{
			self.MAIN.document.getElementById("paneBorder").style.height = (winHeight - 35) + "px";
		}
		if (fullPaneContentWidth >= 5)
		{
			self.MAIN.document.getElementById("paneBodyBorder").style.width = fullPaneContentWidth + "px";
			self.MAIN.document.getElementById("paneBody").style.width = (fullPaneContentWidth - 5) + "px";
		}
		if (winHeight >= 55)
		{
			self.MAIN.document.getElementById("paneBodyBorder").style.height = (winHeight - 55) + "px";
			self.MAIN.document.getElementById("paneBody").style.height = (winHeight - 60) + "px";
		}
		if (fullContentWidth >= 15)
		{
			self.MAIN.document.getElementById("paneHeader").style.width = (fullContentWidth - 15) + "px";
		}
	}
	catch(e)
	{}
}
</script>
</head>
<body style="overflow:hidden" onload="ElectScreen();fitToScreen()" onresize="fitToScreen()">
	<iframe id="MAIN" name="MAIN" src="/lawson/xhrnet/ui/headerpane.htm" style="visibility:hidden;position:absolute;top:0px;left:0px;width:721px;height:464px" marginwidth="0" marginheight="0" frameborder="no" scrolling="no"></iframe>
	<iframe id="cycleslib" name="cycleslib" src="/lawson/xbnnet/cycles.htm" style="visibility:hidden;height:0px;width:0px;"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@(201111) 09.00.01.06.00 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/elect_ben_06.htm,v 1.18.2.27 2011/06/02 09:22:45 juanms Exp $ -->
