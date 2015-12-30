<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">
<meta charset="utf-8">
<title>Welcome to Benefits Enrollment</title>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"></script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script>
function startProgram()
{
	setWinTitle(getSeaPhrase("WELCOME_AE","BEN"));
	var html = '<div class="plaintablecell" style="padding:5px">';
	// This is where you can define your own instructions. Do not change anything outside the **** lines
	// You should replace the translation calls with straight text if you are not using your own phrase file
	// *****************************************************************************************************
// MOD BY BILAL
//	html += getSeaPhrase("BULLETIN_4","BEN")
//	html += '<p>' + getSeaPhrase("BULLETIN_5","BEN") + '</p>'
//	html += '<p>' + getSeaPhrase("NHBULLETIN_17","BEN") + '</p>'
// MOD BY CLYNCH - Moved empname value set, added display of name to text, removed name display in paneHeader.
	var empname = parent.nickname + " " + parent.lastname
	html += '<p>'
	html += '<font size="-1"><b>Welcome ' + empname
	html += '</b></font><p>'
	html += '<font size="-1">The benefits enrollment period is from <b>7:30am MST February 10, 2014 through 5:00pm MST February 28, 2014</b>.  You must elect your benefits during this time frame. Failure to do so may affect your ability to have benefits for the new plan year. The new plan year is <b>April 1, 2014 through March 31, 2015</b></font>'
	html += '<p>'
	html += '<font size="-1">Under the myHR Benefits section of this website, you will have links to plan descriptions for the different benefit plans and a provider directory to help answer any questions.  The plan descriptions provide additional information about the benefit plans.  In the event of any conflict between these enrollment materials, the plan descriptions and the official plan documents will rule.</font>'
	html += '<p><font size="-1"><b>Authorization for Salary Reduction:  </b> I have read and understand the benefit choices available to me.  I further understand that coverage will become effective only after coverage has been approved and on the date specified.  I agree to all payroll deductions for all benefits that I select (including default benefits that I receive because I do not make a contrary election).</font></p> '
	html += '<p><font size="-1"><b>Certification:  </b> I certify that the information I will provide on this form is true and accurate to the best of my knowledge.  Any misrepresentation or deliberate omission of fact may invalidate coverage for me and/or my dependents and may result in termination of my employment.</font></p>'
// END OF MOD
	// *****************************************************************************************************
	html += '<p class="textAlignRight">'
// MOD BY CLYNCH - Added font size/weight/color and button width/backgroundcolor attributes to style parameter.
//	html += uiButton(getSeaPhrase("CONTINUE","BEN"), "continueApp();return false", "margin-right:5px;margin-top:10px")

	html += uiButton(getSeaPhrase("CONTINUE","BEN"), "continueApp();return false", "font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
	if (parent.opener)
		//html += uiButton(getSeaPhrase("EXIT","BEN"), "parent.parent.EndEnroll('YES');return false", "margin-right:5px;margin-top:10px")
		html += "&nbsp.&nbsp."+uiButton(getSeaPhrase("EXIT","BEN"), "parent.parent.EndEnroll('YES');return false", "font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
// END OF MOD
	html += '</p></div>'
	document.getElementById("paneBody").innerHTML = html;
	document.getElementById("paneHeader").innerHTML = getSeaPhrase("WELCOME_AE","BEN");
	stylePage();
	document.body.style.visibility = "visible";
	parent.fitToScreen();
}
function continueApp()
{
	parent.LastDoc = new Array();
	parent.currentdoc = 0;
	parent.LastDoc[parent.currentdoc] = parent.baseurl+"benbulletin.htm";
	parent.loadBenefits();
}
</script>
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
<!-- END OF MOD  -->
</body>
</html>
<!-- Version: 8-)@(#)@10.00.05.00.12 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/benbulletin.htm,v 1.22.2.27 2014/02/25 22:49:14 brentd Exp $ -->
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
