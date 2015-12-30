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
var REC_TYPE=parent.EligPlans[parent.CurrentEligPlan][6]
// start date of employee benefit
var BnStartDate=""
if(parent.event=="annual") 
{
	if(parent.actiontaken==3)
		BnStartDate=parent.setStopDate(parent.BenefitRules[2])
	else
		BnStartDate=parent.BenefitRules[2]
} 
else if(parent.rule_type=="N")
	BnStartDate=parent.EligPlans[parent.CurrentEligPlan][5]
else 
{
	if(parent.actiontaken==2 || parent.actiontaken==5)
		BnStartDate=parent.BenefitRules[2]
	if(parent.actiontaken==1)
		BnStartDate=parent.EligPlans[parent.CurrentEligPlan][11]
	if(parent.actiontaken==3)
		BnStartDate=parent.setStopDate(parent.EligPlans[parent.CurrentEligPlan][15])
	if(parent.actiontaken==4)
		BnStartDate=parent.EligPlans[parent.CurrentEligPlan][13]
}
if(parent.updatetype=="CRT" || (typeof(REC_TYPE)!="undefined" && parseInt(REC_TYPE,10)==1)) 
{
	REC_TYPE=parseFloat(parent.SelectedPlan[parent.choice][9])
	var COP_STUDENT_AGE=parseFloat(parent.SelectedPlan[parent.choice][13])
	var COP_DEP_AGE=parseFloat(parent.SelectedPlan[parent.choice][14])
	var COP_COV_DEPENDENTS=parent.SelectedPlan[parent.choice][16]
} 
else if(parent.updatetype=="CRT2" || (typeof(REC_TYPE)!="undefined" && ((1<parseInt(REC_TYPE,10)&&parseInt(REC_TYPE,10)<6) || parseInt(REC_TYPE,10)==13))) 
{
	var COP_STUDENT_AGE=parseFloat(parent.SelectedPlan[45])
	var COP_DEP_AGE=parseFloat(parent.SelectedPlan[46])
	var COP_COV_DEPENDENTS=parent.SelectedPlan[4]
}
if(isNaN(COP_STUDENT_AGE))
	COP_STUDENT_AGE=0
if(isNaN(COP_DEP_AGE))
	COP_DEP_AGE=0
function startProgram()
{
	if(parent.updatetype=="CRT" || parseInt(REC_TYPE,10)==1)
	{
		if(isNaN(parseFloat(parent.SelectedPlan[parent.choice][18])) || parseFloat(parent.SelectedPlan[parent.choice][18]) == 0)
			parent.SelectedPlan[parent.choice][18]=99
	}
	var msg1=''
	var msg2=''
	if(COP_COV_DEPENDENTS=="B")	
	{
		msg1+=getSeaPhrase("ELECTBEN_34","BEN")
		if(parent.updatetype=="CRT" || parseInt(REC_TYPE,10)==1) 
		{
			if(parseFloat(parent.SelectedPlan[parent.choice][18])!=99) 
			{
				msg2=getSeaPhrase("ERROR_52","BEN")+' '+parseFloat(parent.SelectedPlan[parent.choice][18])
				if(parseFloat(parent.SelectedPlan[parent.choice][18])==1)
					msg2+=" "+getSeaPhrase("DEPENDENT","BEN")+"."
				else
					msg2+=" "+getSeaPhrase("DEPENDENTS","BEN")+"."
			}
		}
	}
	if(COP_COV_DEPENDENTS=="E")
		msg1=getSeaPhrase("ERROR_53","BEN")
	if(COP_COV_DEPENDENTS=="N")
		msg1=getSeaPhrase("ERROR_53","BEN")
	if(COP_COV_DEPENDENTS=="D")	{
		msg1+=getSeaPhrase("ERROR_54","BEN")
		if(parent.updatetype=="CRT" || parseInt(REC_TYPE,10)==1) {
			if(parseFloat(parent.SelectedPlan[parent.choice][18])!=99) 
			{
				msg2=getSeaPhrase("ERROR_52","BEN")+' '+parseFloat(parent.SelectedPlan[parent.choice][18])
				if(parseFloat(parent.SelectedPlan[parent.choice][18])==1)
					msg2+=" "+getSeaPhrase("DEPENDENT","BEN")+"."
				else
					msg2+=" "+getSeaPhrase("DEPENDENTS","BEN")+"."
			}
		}
	}
	if(COP_COV_DEPENDENTS=="S")
		msg1+=getSeaPhrase("ERROR_55","BEN")
// MOD BY BILAL
//	var deplist = '<form><table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" styler="list">'
	var deplist = '<form><center><table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" styler="list">'
// END OF MOD

	deplist += '<tr>'
	deplist += '<th class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("DEPENDENT","BEN")+'</th>'
	deplist += '<th class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("SELECT","BEN")+'</th>'
	deplist += '</tr>'
	var isCovered = false;
	var coveredIndex = -1;
	for (var i=0; i<parent.dependents.length; i++)
	{
		isCovered = false;
		coveredIndex = -1;
		for (var x=0; x<parent.coveredDeps.length; x++)
		{
			if (parent.dependents[i].seq_nbr == parent.coveredDeps[x].dependent
			&& parent.formjsDate(parent.formatDME(parent.dependents[i].birthdate)) <= BnStartDate)
			{
				isCovered = true;
				coveredIndex = x;
				break;
			}
		}
		var msg = getMessage(i, coveredIndex);
		deplist += '<tr>';
		deplist += '<td class="plaintablecellborder">' + parent.dependents[i].label_name_1 + '</td>';
		deplist += '<td class="plaintablecellborder">';
		if (msg == '')
		{
			deplist += '<input class="inputbox" type="checkbox" name="R' + i + '" ';
			deplist += ((isCovered) ? 'value="yes" checked' : '');
			deplist += ' onclick="checknbr('+i+')">';
		}
		else
			deplist += ' ' + msg;
		deplist += '</td>';
		deplist += '</tr>';
	}
	deplist += '</table>'
// MOD BY BILAL
	deplist += '</center>'
// END OF MOD
	deplist += '</form>'
	var nme = parent.removespace(parent.EligPlans[parent.CurrentEligPlan][1]+parent.EligPlans[parent.CurrentEligPlan][2])
	var html = '<div class="plaintablecell" style="padding:10px">'
// MOD BY BILAL
	html += '<center>'
// END OF MOD
// MOD BY BILAL
	html += getSeaPhrase("CONBEN_2","BEN")+' '
	html += '<font color=red><b>' + parent.EligPlans[parent.CurrentEligPlan][4] + '</b></font>'+ ' '
// END OF MOD
	html += '<a href="" onclick="javascript:var winRef=(typeof(parent.openWinDesc2)==\'function\')?parent:parent.parent;winRef.openWinDesc2(\''+parent.EligPlans[parent.CurrentEligPlan][1]+'\',\''+parent.EligPlans[parent.CurrentEligPlan][2]+'\');return false">'
// MOD BY BILAL
	html += 'View Description'
// END OF MOD
	html += '</a>.'



	html += '<table border="0" cellpadding="0" cellspacing="0">'
	html += '<tr><td class="plaintablecell" valign="top">'
// MOD BY BILAL - changing the layout
//	html += deplist
//	html += '</td><td class="plaintablecell" valign="top">'
// MOD BY BILAL
	html += '<center>'
// END OF MOD
	html += '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0">'
// MOD BY BILAL  - Hiding theBlank Header
//	html += '<tr>'
//	html += '<td class="plaintableheaderborder">&nbsp;</td></tr>'
// END OF MOD
	html += '<tr>'
	html += '<td class="plaintablecellborder">'
// MOD BY BILAL
//	html += getSeaPhrase("CONBEN_2","BEN")+' '
//	html += '<a href="" onclick="javascript:var winRef=(typeof(parent.openWinDesc2)==\'function\')?parent:parent.parent;winRef.openWinDesc2(\''+parent.EligPlans[parent.CurrentEligPlan][1]+'\',\''+parent.EligPlans[parent.CurrentEligPlan][2]+'\');return false">'
//	html += parent.EligPlans[parent.CurrentEligPlan][4]
//	html += '</a>.'
	html += '<br><br>'
// END OF MOD
	html += '<br>'+msg1
	html += '<br>'+msg2
	html += '<p><span class="fieldlabelbold" style="text-align:left">'
	html += getSeaPhrase("SELECT_DEPENDENTS", "BEN")+'</span>'
	html += '</td>'
	html += '</tr>'
	html += '</table>'
// MOD BY BILAL
	html += '</center>'
// END OF MOD
	html += '</td></tr>'
//  CLYNCH TEMP COMMENT OUT
	html += '<tr>'
// MOD BY BILAL - changing the layout
	html += '<tr><td class="plaintablecell" valign="top"><br>'
	html += deplist
	html += '</td></tr>'
//	html += '<td class="plaintablecell" valign="top" style="text-align:right" colspan="2">'
	html += '<td class="plaintablecell" valign="top" style="text-align:center" colspan="2">'
// END OF MOD
	html += '<table border="0" cellspacing="0" cellpadding="0">'
	html += '<tr>'
// MOD BY BILAL  - Changing the button style
//	html += '<td>'
	html += '<td style="text-align:center">'
//	html += uiButton(getSeaPhrase("CONTINUE","BEN"),"cont();return false","margin-top:10px")
//	html += uiButton(getSeaPhrase("PREVIOUS","BEN"),"parent.EndEnroll('NO');return false","margin-top:10px")
	html += uiButton(getSeaPhrase("CONTINUE","BEN"),"cont();return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
	html += "&nbsp;&nbsp;"
	html += uiButton(getSeaPhrase("PREVIOUS","BEN"),"parent.EndEnroll('NO');return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
// END OF MOD 
	html += '</td>'
	html += '</tr>'
// CLYNCH 2/15/2012 - Add dependent verification text for medical, dental, vision dependent pages only
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
		html += 'You will be required to provide documentation to verify the eligibility of any newly-enrolled dependents. <u>If you enrolled a dependent(s) whose eligibility has <b>not</b> previously been verified</u>, you will receive a letter from ConSova (a benefits firm specializing in eligibility verification) requesting copies of documents to verify that the dependents you have enrolled meet our eligibility requirements. Failure to submit the required information will result in termination of coverage for the dependent.</font>';
		html += '<p><u>Eligible dependents are:</u></font>';
		html += '<ul>';
			html += '<li>Your spouse under a legally valid marriage, as determined in accordance with the laws of the State of Idaho, who is not legally separated or divorced from you.</li>';
			html += '<li>A child under the age of 26 years. For purposes of the plan, a “child” means your:</li>';
			html += '<ul>';
				html += '<li>Biological child,</li>';
				html += '<li>Legally adopted child or child placed with you for whom legal adoption proceedings have been initiated,</li>';
				html += '<li>Stepchild,</li>';
				html += '<li>Child for whom you are the legal guardian, and/or </li>';
				html += '<li>Child who is required to be covered by a Qualified Medical Child Support Order (QMSCO).</li>';
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
        deplist += '<LI>Each family member I have enrolled is either my legally married spouse; my natural, step, or adopted child (or child placed with me for adoption) who is under the age of 26; or is otherwise my “dependent” for health insurance purposes (i.e., disabled dependent over age 26);</LI>';
        deplist += '<LI>If an enrolled family member ceases to be eligible for any reason (including but not limited to divorce, legal separation, or attainment of the plan’s limiting age), I will promptly notify the employer in writing;</LI>';
        deplist += '<LI>If I submit false information to the Plan regarding the eligibility of my family members, or fail to promptly notify the St. Luke’s Benefits department in writing when one or more family members cease to be eligible under the terms of the Plan, the coverage of the affected family members may be terminated retroactively, my coverage and the coverage of other family members may be terminated to the extent permitted by applicable law, and I may be subject to such other disciplinary action as the employer in its discretion may deem appropriate; and</LI>';
        deplist += '<LI>I agree to provide supporting documentation, regarding the eligibility of any enrolled family member, upon the request of the employer.</LI>';
	deplist += '</UL>';
	// ~CGL

// END OF MOD
	html += '</td></tr>'
	html += '</table>'
// MOD BY BILAL
	html += '</center>'
// END OF MOD
	html += '</div>'
	document.getElementById("paneBody").innerHTML = html
	document.getElementById("paneHeader").innerHTML = '<span>'+getSeaPhrase("BEN_ELECT","BEN")+' - '+parent.EligPlans[parent.CurrentEligPlan][8]+'</span>';
	stylePage();
	document.body.style.visibility = "visible";
}
function checknbr(x)
{
	if(parent.updatetype=="CRT" || parseInt(REC_TYPE,10)==1) 
	{
		var nbrchecked=0
		for(var i=0; i<self.document.forms[0].elements.length; i++) 
		{
			if(self.document.forms[0].elements[i].checked) 
			{
				nbrchecked++
				if(nbrchecked>parseFloat(parent.SelectedPlan[parent.choice][18])) 
				{
					nbrchecked=-1
					break;
				}
			}
		}
		if(nbrchecked==-1) 
		{
			self.document.forms[0].elements["R"+x].checked=false
			styleElement(self.document.forms[0].elements["R"+x]);
			var alertmsg = getSeaPhrase("ERROR_51","BEN")+" "+parseFloat(parent.SelectedPlan[parent.choice][18])
			if(parseFloat(parent.SelectedPlan[parent.choice][18])==1)
				alertmsg += " "+getSeaPhrase("DEPENDENT","BEN")+"."
			else
				alertmsg += " "+getSeaPhrase("DEPENDENTS","BEN")+"."
			parent.seaAlert(alertmsg)
		}
	}
	return
}
function getMessage(i, coveredIndex)
{
	var msg=''
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
			if (parent.dependents[i].student == "N")
			{
				if (parent.isDepAgeEligible(parent.termopt, birthDate, COP_DEP_AGE, BnStartDate) == false)
				{
					msg = getSeaPhrase("ERROR_48","BEN")+' '+COP_DEP_AGE+'.';
					errorAge = COP_DEP_AGE;
				}
			}
		}
		if (COP_COV_DEPENDENTS == "S" || COP_COV_DEPENDENTS == "N")
			msg = getSeaPhrase("ERROR_49","BEN");
	}
	if (parent.dependents[i].dep_type == "S")
	{
		if (COP_COV_DEPENDENTS == "D" || COP_COV_DEPENDENTS == "N")
			msg = getSeaPhrase("ERROR_50","BEN");
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
	var temp=new Array()
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
		if(parent.SelectedPlan[parent.choice][18] && parseFloat(parent.SelectedPlan[parent.choice][18])>1 &&
		self.document.forms[0].elements.length>1)
			parent.seaAlert(getSeaPhrase("ERROR_44","BEN"))
		else
			parent.seaAlert(getSeaPhrase("ERROR_45","BEN"))
		return
	}
	parent.coveredDeps=new Array()
	parent.coveredDeps=temp
	parent.currentdoc++
	parent.LastDoc[parent.currentdoc]="/lawson/xbnnet/depscr.htm"
	parent.document.getElementById("main").src = "/lawson/xbnnet/bensconfirm.htm"
}
function depBenObj(dependent,lastname,firstname,stop_date)
{
	this.dependent=dependent
	this.last_name=lastname
	this.first_name=firstname
	this.stop_date=stop_date
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
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/depscr.htm,v 1.18.2.22 2011/03/09 07:59:11 juanms Exp $ -->
