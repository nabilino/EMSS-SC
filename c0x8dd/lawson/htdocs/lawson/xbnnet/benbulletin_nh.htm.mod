<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">
<meta charset="utf-8">
<title>Welcome to New Hire Enrollment</title>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"></script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script>
function startProgram()
{
	setWinTitle(getSeaPhrase("WELCOME_NH","BEN"));
	var empname = parent.nickname + " " + parent.lastname
	var html = '<div class="plaintablecell" style="padding:5px">';
	// This is where you can define your own instructions. Do not change anything outside the **** lines
	// You should replace the translation calls with straight text if you are not using your own phrase file
	// *****************************************************************************************************
	if (parent.noGo) 
	{ 
// MOD BY BILAL - prior customizations
		// JRZ Lawson logic about the number of days doesn't agree with our logic where hire date is day 1
		// so using 29 in BS05, but want to say 30 to employee to avoid confusion.
		var hardDateRange = "30"; // replacing parent._DateRange
		html='You may only select benefits within the first '+hardDateRange+' days from your '+parent._BaseDateWord+'. <p>If you need assistance, please contact your benefits department.'
		//~JRZ
		//html += getSeaPhrase("NHBULLETIN_1","BEN")+' '+parent._DateRange+' '
		//html += getSeaPhrase("NHBULLETIN_2","BEN")+' '+parent._BaseDateWord+'.' + '</p>'
		//html += '<p>' + getSeaPhrase("NHBULLETIN_14","BEN") + '</p>'
	} 
	else 
	{
		html='<p>Welcome to St. Luke\'s Online Benefits Enrollment for new hires.</p>';
		html+='<p>You will have 30 days from your hire date to complete your benefits online enrollment, your date of hire is day one.  The benefits you elect will be effective until the next plan year which starts April 1.</p>';
		html+='<p>In the event of any conflict between the online enrollment application and the enrollment documents, the summary plan descriptions and the official plan documents will rule.</p>';
		html+='<p><font size="-1"><b>Authorization for Salary Reduction:  </b></font> I have read and understand the benefit choices available to me.  I further understand that coverage will become effective only after coverage has been approved and on the date specified.  I agree to all payroll deductions for all benefits that I select.</p>';
		html+='<p><font size="-1"><b>Certification:  </b></font> I certify that the information I will provide on this form is true and accurate to the best of my knowledge.  Any misrepresentation or deliberate omission of fact may invalidate coverage for me and/or my dependents and may result in termination of my employment.</p>';
//		html += getSeaPhrase("NHBULLETIN_15","BEN")
//		html += '<p>' + getSeaPhrase("NHBULLETIN_16","BEN") + '</p>'
//		html += '<p>' + getSeaPhrase("NHBULLETIN_17","BEN") + '</p>'
	}
// END OF MOD
	// *****************************************************************************************************
//MOD BY BILAL
	html += '<p class="textAlignRight">'
	if (!parent.noGo)
//		html += uiButton(getSeaPhrase("CONTINUE","BEN"), "continueApp();return false", "margin-right:5px;margin-top:10px")
		html += uiButton(getSeaPhrase("CONTINUE","BEN"), "continueApp();return false", "font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")

	if (parent.opener)
//		html += uiButton(getSeaPhrase("EXIT","BEN"), "parent.close();return false", "margin-right:5px;margin-top:10px")
		html += uiButton(getSeaPhrase("EXIT","BEN"), "parent.close();return false", "font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px;margin-left:10px")
// END OF MOD
	html += '</p></div>'
	document.getElementById("paneBody").innerHTML = html;
	document.getElementById("paneHeader").innerHTML = getSeaPhrase("WELCOME_NH","BEN");
	stylePage();
	document.body.style.visibility = "visible";
	parent.fitToScreen();
}
function continueApp()
{
	parent.LastDoc = new Array();
	parent.currentdoc = 0;
	parent.LastDoc[parent.currentdoc] = parent.baseurl+"benbulletin_nh.htm";
	parent.loadBenefits();
}
</script>
<!-- MOD BY BILAL - Prior customizations -->
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-395426-5");
pageTracker._trackPageview();
} catch(err) {}</script>
<!-- END OF MOD -->
</head>
<body onload="setLayerSizes();startProgram()" style="visibility:hidden">
<div id="paneBorder" class="paneborder">
	<table id="paneTable" border="0" height="100%" width="100%" cellpadding="0" cellspacing="0" role="presentation">
	<tr><td style="height:16px">
		<div id="paneHeader" class="paneheader" role="heading" aria-level="2">&nbsp;</div>
	</td></tr>
	<tr><td style="vertical-align:top">
		<div id="paneBodyBorder" class="panebodyborder" styler="groupbox"><div id="paneBody" class="panebody" tabindex="0"></div></div>
	</td></tr>
	</table>
</div>
</body>
</html>
<!-- Version: 8-)@(#)@10.00.05.00.12 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/benbulletin_nh.htm,v 1.23.2.27 2014/02/25 22:49:14 brentd Exp $ -->
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
