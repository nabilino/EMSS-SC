<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">
<meta charset="utf-8">
<title>Enrollment Complete</title>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"></script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script>
function initProgram()
{
	setWinTitle(getSeaPhrase("QUIT_ENROLLMENT","BEN"));
	parent.startProcessing(getSeaPhrase("PROCESSING_WAIT","ESS"), startProgram);
}
function startProgram()
{
	setWinTitle(getSeaPhrase("ENROLL_DONE","BEN"));
	var empname = parent.parent.nickname+' '+parent.parent.lastname	 
// MOD BY BILAL
//	var msg = getSeaPhrase("ENROLL_COMPLETE","BEN")+' '	
	var msg = '<font size=+2>' + getSeaPhrase("ENROLL_COMPLETE","BEN")+'&nbsp;&nbsp;'
	if (parent.parent.opener || parent.parent.rule_type == "F") 
		msg += getSeaPhrase("CONT_TO_EXIT","BEN") +' '
	if (parent.parent.emailSummary || parent.parent.printSummary) 
	{
	//	msg = getSeaPhrase("ENROLL_SUC","BEN")+'<br/><br/>'
		msg=getSeaPhrase("ENROLL_SUC","BEN")+"&nbsp;&nbsp;"
		if (parent.parent.emailSummary && parent.parent.emailaddress)
			msg += getSeaPhrase("EMAIL_SENT_TO","BEN")+' '+parent.parent.emailaddress+'<br/><br/>'
		if (parent.parent.printSummary)
		{
			msg += getSeaPhrase("WAIT_PRINT","BEN")+' '
			if (parent.parent.opener || parent.parent.rule_type == "F")
				msg += getSeaPhrase("PRINT_COMP_CONT_EXIT","BEN")
		}	
	} 
	msg += '</font><br><br>'	// LINE ADDED BY BILAL
// END OF MOD
	var html = '<div class="plaintablecell" style="padding:0px">' 
// MOD BY BILAL - Prior customization
		// JRZ Adding final summary page instructions
		// CGL 1/18/2011 - Add Partners in Giving text to summary page
	msg += '<br><table border=0 width=100%><TR><TD class="plaintablecell">'
		+ '<b>Become a Partner in Giving!</b><br>Maxed on your PTO hours?  Looking for a tax deduction?  Become a Partner today!  St. Luke\'s has ONE promise to our communities: to care for every patient regardless of their ability to pay. To uphold this promise, St. Luke\'s is asking for the help and support of its employees. Please consider a charitable gift of cash or PTO. New this year! If you give PTO, your taxes will be deducted from the amount of your gift, rather than your paycheck. Click <a href="http://inside.slrmc.org/resources/donation.php" target="_blank">here</a> for information.'
		+ '</td></tr>'
		+ '</table><BR>';
		// ~CGL		
	msg += '<table border=0 width=80%><TR><TD class="plaintablecell">';
	msg += parent.parent.SLRMC.EPOReminder(parent.parent.rule_type);
	msg  += '</td></tr>';
	msg += '</table><BR>';
		//~JRZ
// END OF MOD
 	html += '<br/><table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" style="width:100%;margin-left:auto;margin-right:auto" role="presentation">'
	html += '<tr><td class="plaintablecellborder"><p>'+getSeaPhrase("CONGRATS","BEN")+' '+empname+'.<br/><br/>'+msg+'</p></td></tr>'
	html += '</table><p class="textAlignRight">'	   
// MOD BY BILAL
	if (parent.parent.opener || parent.parent.rule_type == "F")
		html += uiButton(getSeaPhrase("CONTINUE","BEN"), "parent.parent.EndEnroll('YES');return false","margin-right:5px;margin-top:10px")
//		html += uiButton(getSeaPhrase("CONTINUE","BEN"), "parent.parent.EndEnroll('YES');return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")

	html += '</p></div>'
	document.getElementById("paneBody").innerHTML = html;
	document.getElementById("paneHeader").innerHTML = getSeaPhrase("ENROLLMENT_ELECTIONS","BEN");
	stylePage();
	document.body.style.visibility = "visible";
	parent.stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[getWinTitle()]));
	CheckNotifications();
	parent.fitToScreen();
}
function CheckNotifications()
{
	if (parent.parent.emailSummary)
		parent.parent.emailScr(parent.parent.main,false);
	if (parent.parent.printSummary)
		setTimeout(function() { parent.parent.printScr(parent.parent.main.printScreen, false, true); }, 500);	
}
</script>
</head>
<body onload="setLayerSizes();initProgram()">
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
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/update.htm,v 1.19.2.34 2014/02/25 22:49:14 brentd Exp $ -->
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
