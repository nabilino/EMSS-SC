<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">
<meta charset="utf-8">
<title>Enroll Dependents in Benefit Plan</title>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"></script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script>
var REC_TYPE=parent.EligPlans[parent.CurrentEligPlan][6];
var BnStartDate = ""; // start date of employee benefit
var COP_STUDENT_AGE = 0;
var COP_DEP_AGE = 0;
var COP_COV_DEPENDENTS = "";
if (parent.event == "annual")
{
	if (parent.actiontaken == 3)
		BnStartDate = parent.setStopDate(parent.BenefitRules[2]);
	else
		BnStartDate = parent.BenefitRules[2];
}
else if (parent.rule_type == "N")
	BnStartDate = parent.EligPlans[parent.CurrentEligPlan][5];
else 
{
	if (parent.actiontaken == 2 || parent.actiontaken == 5)
		BnStartDate=parent.BenefitRules[2];
	if (parent.actiontaken == 1)
		BnStartDate = parent.EligPlans[parent.CurrentEligPlan][11];
	if (parent.actiontaken == 3)
		BnStartDate = parent.setStopDate(parent.EligPlans[parent.CurrentEligPlan][15]);
	if (parent.actiontaken == 4)
		BnStartDate = parent.EligPlans[parent.CurrentEligPlan][13];
}
if (parent.updatetype == "CRT" || (typeof(REC_TYPE) != "undefined" && parseInt(REC_TYPE,10) == 1)) 
{
	REC_TYPE = parseFloat(parent.SelectedPlan[parent.choice][9]);
	COP_STUDENT_AGE = parseFloat(parent.SelectedPlan[parent.choice][13]);
	COP_DEP_AGE = parseFloat(parent.SelectedPlan[parent.choice][14]);
	COP_COV_DEPENDENTS = parent.SelectedPlan[parent.choice][16];
} 
else if (parent.updatetype == "CRT2" || (typeof(REC_TYPE) != "undefined" && ((1 < parseInt(REC_TYPE,10) && parseInt(REC_TYPE,10) < 6) || parseInt(REC_TYPE,10) == 13))) 
{
	COP_STUDENT_AGE = parseFloat(parent.SelectedPlan[45]);
	COP_DEP_AGE = parseFloat(parent.SelectedPlan[46]);
	COP_COV_DEPENDENTS = parent.SelectedPlan[4];
}
if (isNaN(COP_STUDENT_AGE))
	COP_STUDENT_AGE = 0;
if (isNaN(COP_DEP_AGE))
	COP_DEP_AGE = 0;
function initProgram()
{
	setWinTitle(getSeaPhrase("ENROLL_PLAN_DEPS","BEN"));
	parent.startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), startProgram);
}	
function startProgram()
{
	if (parent.updatetype == "CRT" || parseInt(REC_TYPE,10) == 1)
	{
		if (isNaN(parseFloat(parent.SelectedPlan[parent.choice][18])) || parseFloat(parent.SelectedPlan[parent.choice][18]) == 0)
			parent.SelectedPlan[parent.choice][18] = -1;
		if (isNaN(parseFloat(parent.SelectedPlan[parent.choice][19])) || parseFloat(parent.SelectedPlan[parent.choice][19]) == 0)
			parent.SelectedPlan[parent.choice][19] = -1;		
	}
	var msg1 = '';
	var msg2 = '';
	if (COP_COV_DEPENDENTS == "B")
		msg1 += getSeaPhrase("ELECTBEN_34","BEN");
	else if (COP_COV_DEPENDENTS == "E")
		msg1 = getSeaPhrase("ERROR_53","BEN");
	else if (COP_COV_DEPENDENTS == "N")
		msg1 = getSeaPhrase("ERROR_53","BEN");
	else if (COP_COV_DEPENDENTS == "D")
		msg1 += getSeaPhrase("ERROR_54","BEN");
	else if (COP_COV_DEPENDENTS == "S")
		msg1 += getSeaPhrase("ERROR_55","BEN");
	else if (COP_COV_DEPENDENTS == "P")
		msg1 += getSeaPhrase("ERROR_56","BEN");
	else if (COP_COV_DEPENDENTS == "O")
		msg1 += getSeaPhrase("ERROR_57","BEN");
	else if (COP_COV_DEPENDENTS == "R")
		msg1 += getSeaPhrase("ERROR_58","BEN");
	else if (COP_COV_DEPENDENTS == "C")
		msg1 += getSeaPhrase("ERROR_59","BEN");
	else if (COP_COV_DEPENDENTS == "A")
		msg1 += getSeaPhrase("ERROR_60","BEN");	
	if (COP_COV_DEPENDENTS == "B" || COP_COV_DEPENDENTS == "D" || COP_COV_DEPENDENTS == "R" || COP_COV_DEPENDENTS == "C" || COP_COV_DEPENDENTS == "A")	
	{
		if (parent.updatetype == "CRT" || parseInt(REC_TYPE,10) == 1) 
		{
			var minNbrDeps = parseFloat(parent.SelectedPlan[parent.choice][19]);
			var maxNbrDeps = parseFloat(parent.SelectedPlan[parent.choice][18]);
			//do we have a max number of dependents?
			if (maxNbrDeps != -1) 
			{
				//do we have a min number of dependents?
				if (minNbrDeps != -1)
				{
					if (minNbrDeps == maxNbrDeps)
					{
						if (minNbrDeps == 1)
							msg2 = getSeaPhrase("ERROR_138","BEN",[minNbrDeps,maxNbrDeps]);
						else
							msg2 = getSeaPhrase("ERROR_139","BEN",[minNbrDeps,maxNbrDeps]);
					}	
					else
						msg2 = getSeaPhrase("ERROR_140","BEN",[minNbrDeps,maxNbrDeps]);
				}
				else
				{	
					msg2 = getSeaPhrase("ERROR_52","BEN")+' '+parseFloat(parent.SelectedPlan[parent.choice][18])
					if (parseFloat(parent.SelectedPlan[parent.choice][18]) == 1)
						msg2 += ' '+getSeaPhrase("DEPENDENT","BEN")+'.';
					else
						msg2 += ' '+getSeaPhrase("DEPENDENTS","BEN")+'.';
				}	
			}
		}
	} 
	// MOD BY BILAL
//	var deplist = '<form><table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" style="width:100%;margin-left:auto;margin-right:auto" styler="list" summary="'+getSeaPhrase("TSUM_11","BEN",[parent.EligPlans[parent.CurrentEligPlan][4]])+'">'
	var deplist = '<form><center><table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" style="width:100%;margin-left:auto;margin-right:auto" styler="list" summary="'+getSeaPhrase("TSUM_11","BEN",[parent.EligPlans[parent.CurrentEligPlan][4]])+'">'
// END OF MOD
	deplist += '<caption class="offscreen">'+getSeaPhrase("TCAP_10","BEN",[parent.EligPlans[parent.CurrentEligPlan][4]])+'</caption>'
	deplist += '<tr><th scope="col" class="plaintableheaderborder" style="width:50px;text-align:center">'+getSeaPhrase("SELECT","BEN")+'</th>'
	deplist += '<th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("DEPENDENT","BEN")+'</th>'
	deplist += '<th scope="col" class="plaintableheaderborder" style="text-align:center;width:100%">'+getSeaPhrase("STATUS","BEN")+'</th></tr>'
	var isCovered = false;
	var coveredIndex = -1;
	for (var i=0; i<parent.dependents.length; i++)
	{
		isCovered = false;
		coveredIndex = -1;
		for (var x=0; x<parent.coveredDeps.length; x++)
		{
			if (parent.dependents[i].seq_nbr == parent.coveredDeps[x].dependent && parent.formjsDate(parent.formatDME(parent.dependents[i].birthdate)) <= BnStartDate)
			{
				isCovered = true;
				coveredIndex = x;
				break;
			}
		}
		var msg = getMessage(i, coveredIndex);
		deplist += '<tr>';
		if (msg == '')
		{
			deplist += '<td class="plaintablecellborder" style="text-align:center">';			
			deplist += '<input class="inputbox" type="checkbox" id="R'+i+'" name="R'+i+'" ';
			deplist += ((isCovered) ? 'value="yes" checked' : '');
			deplist += ' onclick="checknbr('+i+');styleElement(this);"></td>';
			deplist += '<td class="plaintablecellborder"><label for="R'+i+'"><span class="offscreen">'+getSeaPhrase("SELECT_DEPENDENT","BEN")+'</span>&nbsp;'+parent.dependents[i].label_name_1+'</label></td>';
			deplist += '<td class="plaintablecellborder">'+getSeaPhrase("ELIGIBLE","BEN")+'</td>';
		}
		else
		{
			deplist += '<td class="plaintablecellborder" style="text-align:center">&nbsp;</td>';
			deplist += '<td class="plaintablecellborder">'+parent.dependents[i].label_name_1+'</td>';
			deplist += '<td class="plaintablecellborder">'+msg+'</td>';
		}
		deplist += '</tr>';
	}
// MOD BY BILAL
	//deplist += '</table></form>'  
	deplist += '</table></center></form>' 
// END OF MOD
	var nme = parent.removespace(parent.EligPlans[parent.CurrentEligPlan][1]+parent.EligPlans[parent.CurrentEligPlan][2]);
	var titleLbl = parent.EligPlans[parent.CurrentEligPlan][4]+' - '+getSeaPhrase("VIEW_PLAN_DESC","BEN")+' '+getSeaPhrase("OPENS_WIN","SEA");
	var html = '<div class="plaintablecell" style="padding:0px">'
// MOD BY BILAL
	html += '<center>'
// END OF MOD	
	html += '<br/><table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" style="width:100%;margin-left:auto;margin-right:auto" role="presentation">'
	html += '<tr><td class="plaintablecellborder" style="padding-top:5px">'+getSeaPhrase("CONBEN_2","BEN")+' '
	html += '<a href="javascript:;" onclick="javascript:var winRef=(typeof(parent.openWinDesc2)==\'function\')?parent:parent.parent;winRef.openWinDesc2(\''+parent.EligPlans[parent.CurrentEligPlan][1]+'\',\''+parent.EligPlans[parent.CurrentEligPlan][2]+'\');return false" title="'+titleLbl+'" aria-haspopup="true">'
// MOD BY BILAL
	//html += parent.EligPlans[parent.CurrentEligPlan][4]+'<span class="offscreen"> - '+titleLbl+'</span></a>. '+msg1+' '+msg2
	html += '<font color=red><b>' + parent.EligPlans[parent.CurrentEligPlan][4]+ '</b></font> <span class="offscreen"> - '+titleLbl+'</span></a>. '
// END OF MOD
	html += '<span class="fieldlabelboldleft">'+getSeaPhrase("SELECT_DEPENDENTS","BEN")+'</span>'
	html += '</td></tr></table><br/>'
	html += '<table border="0" cellpadding="0" cellspacing="0" style="width:100%;margin-left:auto;margin-right:auto" role="presentation">'
	html += '<tr><td class="plaintablecell" valign="top">'+deplist+'</td></tr></table>'
	html += '<p class="textAlignRight">'  
// MOD BY BILAL  - Changing the button style
//	html += uiButton(getSeaPhrase("CONTINUE","BEN"),"cont();return false","margin-right:5px;margin-top:10px")
//	html += uiButton(getSeaPhrase("PREVIOUS","BEN"),"parent.EndEnroll('NO');return false","margin-right:5px;margin-top:10px")
	html += uiButton(getSeaPhrase("CONTINUE","BEN"),"cont();return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
	html += "&nbsp;&nbsp;"
	html += uiButton(getSeaPhrase("PREVIOUS","BEN"),"parent.EndEnroll('NO');return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
// CLYNCH 2/15/2012 - Add dependent verification text for medical, dental, vision dependent pages only
	html += '<table border="0" cellpadding="0" cellspacing="0" style="width:100%;margin-left:auto;margin-right:auto" role="presentation">'
	if(parent.EligPlans[parent.CurrentEligPlan][8]!="AIR ST LUKES" && parent.EligPlans[parent.CurrentEligPlan][8]!="CHILD SUPP LIFE" && parent.EligPlans[parent.CurrentEligPlan][8]!="SPOUSE SUPP LIFE")
	{
		html += '<tr>';
		html += '<td>';
		html += "&nbsp;&nbsp;";
		html += '</td>';
		html += '</tr>';
		html += '<tr>';
		html += '<td class="plaintablecell">';
		html += '<center><b><font color="red">IMPORTANT INFORMATION</font></b></center></br>';
		html += 'To ensure that our plan is complying with plan eligibility rules and federal regulations, you will be required to provide documentation, including social security number, to verify the eligibility of any newly-enrolled dependents. <u>This applies if you enroll a dependent(s) whose eligibility has <b>not</b> previously been verified</u>. Your dependents <b><u>will not</u></b> be added to your plan until you have verified eligibility! Click <a href="plandescriptions/DepVerify.pdf" target="_blank">here</a> for additional details.</font>';
		html += '<p><u>Eligible dependents are:</u></font>';
		html += '<ul>';
			html += '<li>Opposite-gender spouse under a legally valid marriage, as determined in accordance with the laws of the State of Idaho, who is not legally separated or divorced from you (Idaho does not recognize common-law marriage).</li>';
			html += '<li>Same-gender spouse who is legally married under state or national law that recognizes same-gender marriages.</li>';
			html += '<li>A child under the age of 26 years. For purposes of the plan, a \"child\" means your:</li>';
			html += '<ul>';
				html += '<li>Biological child,</li>';
				html += '<li>Legally adopted child or child placed with you for whom legal adoption proceedings have been initiated,</li>';
				html += '<li>Stepchild,</li>';
				html += '<li>Child for whom you are the legal guardian, and/or </li>';
				html += '<li>Child who is required to be covered by a Qualified Medical Child Support Order.</li>';
			html += '</ul>';
		html += '</ul>';
		html += '</td>';
		html += '</tr>';
	}
// ~CLYNCH	
	html += '</table>'
// MOD BY BILAL - Prior Customization
	// JRZ adding dependent reminder
  var depStep = "";
  if(parent.parent.rule_type=="N") {
    depStep = "1";
  }
  else {
    depStep = "2";
  }

	deplist += '<p>Please verify you have all of your dependents you wish to have covered listed and selected using the checkbox next to their name.  Any dependent not selected using the checkbox next to their name will not be considered covered.  If you need to go back and add additional dependents, you must quit and go add your dependents in step ' + depStep + '-Update Dependents.</p>';
	//~JRZ
	// CGL 1/13/2011 - Adding dependent affidavit text (NOTE: THIS TEXT IS NO LONGER DISPLAYED)
	deplist += '<P><b>By enrolling one or more family members for coverage under the Plan, I certify and acknowledge that:</b></p>';
        deplist += '<UL PLAIN>';
        deplist += '<LI>Each family member whom I have enrolled for coverage is eligible under the terms of the Plan, as described in the 2011-2012 Benefits Highlights Booklet and in the summary plan description;</LI>';
        deplist += '<LI>Each family member I have enrolled is either my legally married spouse; my natural, step, or adopted child (or child placed with me for adoption) who is under the age of 26; or is otherwise my �dependent� for health insurance purposes (i.e., disabled dependent over age 26);</LI>';
        deplist += '<LI>If an enrolled family member ceases to be eligible for any reason (including but not limited to divorce, legal separation, or attainment of the plan�s limiting age), I will promptly notify the employer in writing;</LI>';
        deplist += '<LI>If I submit false information to the Plan regarding the eligibility of my family members, or fail to promptly notify the St. Luke�s Benefits department in writing when one or more family members cease to be eligible under the terms of the Plan, the coverage of the affected family members may be terminated retroactively, my coverage and the coverage of other family members may be terminated to the extent permitted by applicable law, and I may be subject to such other disciplinary action as the employer in its discretion may deem appropriate; and</LI>';
        deplist += '<LI>I agree to provide supporting documentation, regarding the eligibility of any enrolled family member, upon the request of the employer.</LI>';
	deplist += '</UL>';
	// ~CGL

// END OF MOD
	html += '</td></tr>'
	html += '</table>'
// MOD BY BILAL
	html += '</center>'
// END OF MOD
	html += '</p></div>'
	document.getElementById("paneBody").innerHTML = html;
	document.getElementById("paneHeader").innerHTML = getSeaPhrase("BEN_ELECT","BEN")+' - '+parent.EligPlans[parent.CurrentEligPlan][8];
	stylePage();
	document.body.style.visibility = "visible";
	parent.stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[getWinTitle()]));
	parent.fitToScreen();
}
function checknbr(x)
{
	var nbrchecked = 0;
	var spouseIdx = -1;
	var partnerIdx = -1;
	for (var i=0; i<self.document.forms[0].elements.length; i++) 
	{
		if (self.document.forms[0].elements[i].checked) 
		{
			nbrchecked++;
			var depIdx = parseInt(self.document.forms[0].elements[i].getAttribute("name").substring(1),10);			
			if (parent.dependents[depIdx].dep_type == "S")
				spouseIdx = depIdx;
			if (parent.dependents[depIdx].dep_type == "P")
				partnerIdx = depIdx;
		}
	}
	//max number of dependents allowed for coverage option
	if (parent.updatetype=="CRT" || parseInt(REC_TYPE,10)==1) 
	{
		var maxNbrDeps = parseFloat(parent.SelectedPlan[parent.choice][18]);
		if (maxNbrDeps > 0 && nbrchecked > maxNbrDeps) 
		{
			self.document.forms[0].elements["R"+x].checked = false;
			styleElement(self.document.forms[0].elements["R"+x]);
			var alertmsg = getSeaPhrase("ERROR_51","BEN")+" "+maxNbrDeps;
			if (maxNbrDeps == 1)
				alertmsg += ' '+getSeaPhrase("DEPENDENT","BEN")+'.';
			else
				alertmsg += ' '+getSeaPhrase("DEPENDENTS","BEN")+'.';
			parent.seaAlert(alertmsg, null, null, "error");
			return;
		}
	}
	//do not allow both spouse and partner
	if (COP_COV_DEPENDENTS == "O" || COP_COV_DEPENDENTS == "A")
	{
		if ((spouseIdx >= 0 && parent.dependents[x].dep_type == "P") || (partnerIdx >= 0 && parent.dependents[x].dep_type == "S"))
		{
			self.document.forms[0].elements["R"+x].checked = false;
			styleElement(self.document.forms[0].elements["R"+x]);
			parent.seaAlert(getSeaPhrase("ERROR_62","BEN"), null, null, "error");
			return;			
		}	
	}
	//do not allow multiple spouses
	if (COP_COV_DEPENDENTS == "S" || COP_COV_DEPENDENTS == "O" || COP_COV_DEPENDENTS == "A")
	{
		if (spouseIdx >= 0 && spouseIdx != x && parent.dependents[x].dep_type == "S")
		{
			self.document.forms[0].elements["R"+x].checked = false;
			styleElement(self.document.forms[0].elements["R"+x]);
			parent.seaAlert(getSeaPhrase("ERROR_63","BEN"), null, null, "error");
			return;			
		}	
	}	
	//do not allow multiple partners
	if (COP_COV_DEPENDENTS == "P" || COP_COV_DEPENDENTS == "O" || COP_COV_DEPENDENTS == "C" || COP_COV_DEPENDENTS == "A")
	{
		if (partnerIdx >= 0 && partnerIdx != x && parent.dependents[x].dep_type == "P")
		{
			self.document.forms[0].elements["R"+x].checked = false;
			styleElement(self.document.forms[0].elements["R"+x]);
			parent.seaAlert(getSeaPhrase("ERROR_64","BEN"), null, null, "error");
			return;			
		}	
	}	
	return;
}
function getMessage(i, coveredIndex)
{
	var msg = '';
	var birthDate = parent.formjsDate(parent.formatDME(parent.dependents[i].birthdate));
	var errorAge = -1;
	if (parent.dependents[i].dep_type == "D")
	{
		if (birthDate > BnStartDate)
			msg = getSeaPhrase("ERROR_46","BEN");
		if (parent.dependents[i].disabled == "N")
		{
			if (parent.dependents[i].student == "Y")
			{
				if (parent.isDepAgeEligible(parent.termopt, birthDate, COP_STUDENT_AGE, BnStartDate) == false)
				{
					msg = getSeaPhrase("ERROR_47","BEN")+' '+COP_STUDENT_AGE+'.';
					errorAge = COP_STUDENT_AGE;
				}
			}
			else if (parent.dependents[i].student == "N")
			{
				if (parent.isDepAgeEligible(parent.termopt, birthDate, COP_DEP_AGE, BnStartDate) == false)
				{
					msg = getSeaPhrase("ERROR_48","BEN")+' '+COP_DEP_AGE+'.';
					errorAge = COP_DEP_AGE;
				}
			}
		}
		if (COP_COV_DEPENDENTS == "S" || COP_COV_DEPENDENTS == "N" || COP_COV_DEPENDENTS == "P" || COP_COV_DEPENDENTS == "O")
			msg = getSeaPhrase("ERROR_49","BEN");
	}
	else if (parent.dependents[i].dep_type == "S")
	{
		if (COP_COV_DEPENDENTS == "D" || COP_COV_DEPENDENTS == "N" || COP_COV_DEPENDENTS == "P" || COP_COV_DEPENDENTS == "R" || COP_COV_DEPENDENTS == "C")
			msg = getSeaPhrase("ERROR_50","BEN");
	}
	else if (parent.dependents[i].dep_type == "P")
	{
		if (COP_COV_DEPENDENTS == "S" || COP_COV_DEPENDENTS == "D" || COP_COV_DEPENDENTS == "N" || COP_COV_DEPENDENTS == "R")
			msg = getSeaPhrase("ERROR_61","BEN");
	}	
	parent.dependents[i].stop_date = "";
	if (errorAge > -1 && coveredIndex > -1)
	{
		var birthYear = birthDate.substring(0, 4);
		var ageYear = parseInt(birthYear, 10) + errorAge;
		var ageDate = ageYear + birthDate.substring(4, 8);
		var formattedAgeDate = parent.FormatDte4(ageDate);
		if (parent.coveredDeps[coveredIndex].stop_date)
		{
			var coveredDepStopDate = parent.formjsDate(parent.formatDME(parent.coveredDeps[coveredIndex].stop_date));
			if (coveredDepStopDate > ageDate)
			{
				parent.coveredDeps[coveredIndex].stop_date = formattedAgeDate;
				parent.dependents[i].stop_date = formattedAgeDate;
			}
		}
		else
		{
			parent.coveredDeps[coveredIndex].stop_date = formattedAgeDate;
			parent.dependents[i].stop_date = formattedAgeDate;
		}
	}
	return msg;
}
function cont()
{
	var temp = new Array();
	for (var i=0; i<parent.dependents.length; i++)
	{
		if (typeof(self.document.forms[0].elements["R"+i])!='undefined' && self.document.forms[0].elements["R"+i].checked)
		{
			temp[temp.length] = new depBenObj(parent.dependents[i].seq_nbr, parent.dependents[i].last_name,
				parent.dependents[i].first_name, parent.dependents[i].stop_date);
		}
	}
	if (temp.length == 0 && self.document.forms[0].elements.length)	
	{
		if (parent.updatetype=="CRT" || parseInt(REC_TYPE,10)==1)
		{
			var maxNbrDeps = parseFloat(parent.SelectedPlan[parent.choice][18]);
			if (maxNbrDeps > 1 && self.document.forms[0].elements.length > 1)
			{	
				parent.seaAlert(getSeaPhrase("ERROR_44","BEN"), null, null, "error");
				return;
			}
		}
		parent.seaAlert(getSeaPhrase("ERROR_45","BEN"), null, null, "error");
		return;
	}
	//min number of dependents allowed for coverage option
	if (parent.updatetype=="CRT" || parseInt(REC_TYPE,10)==1) 
	{
		var minNbrDeps = parseFloat(parent.SelectedPlan[parent.choice][19]);
		if (minNbrDeps != -1 && temp.length < minNbrDeps) 
		{
			var alertmsg;
			if (minNbrDeps == 1)
				alertmsg = getSeaPhrase("ERROR_141","BEN");
			else
				alertmsg = getSeaPhrase("ERROR_142","BEN",[minNbrDeps]);
			alertmsg += ' '+getSeaPhrase("ERROR_143","BEN");
			parent.seaAlert(alertmsg, null, null, "error");
			return;
		}
	}	
	parent.coveredDeps = new Array();
	parent.coveredDeps = temp;
	parent.currentdoc++;
	parent.LastDoc[parent.currentdoc] = "/lawson/xbnnet/depscr.htm";
	parent.document.getElementById("main").src = "/lawson/xbnnet/bensconfirm.htm";
}
function depBenObj(dependent, lastname, firstname, stop_date)
{
	this.dependent = dependent;
	this.last_name = lastname;
	this.first_name = firstname;
	this.stop_date = stop_date;
}
</script>
</head>
<body onload="setLayerSizes();initProgram()" style="visibility:hidden">
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
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/depscr.htm,v 1.18.2.61.2.1 2014/03/25 15:16:56 brentd Exp $ -->
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
