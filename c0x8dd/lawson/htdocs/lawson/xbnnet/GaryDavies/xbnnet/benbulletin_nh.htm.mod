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
	var empname = parent.nickname + " " + parent.lastname
	var html = '<div class="plaintablecell" style="padding:10px">';
	// This is where you can define your own instructions. Do not change anything outside the **** lines
	// You should replace the translation calls with straight text if you are not using your own phrase file
	// *****************************************************************************************************
	if (parent.noGo) {
// MOD BY BILAL - prior customizations
		// JRZ Lawson logic about the number of days doesn't agree with our logic where hire date is day 1
		// so using 29 in BS05, but want to say 30 to employee to avoid confusion.
		var hardDateRange = "30"; // replacing parent._DateRange
		html='You may only select benefits within the first '+hardDateRange+' days from your '+parent._BaseDateWord+'. <p>If you need assistance, please contact your benefits department.'
		//~JRZ
//		html += getSeaPhrase("NHBULLETIN_1","BEN")+' '+parent._DateRange+' '
//		html += getSeaPhrase("NHBULLETIN_2","BEN")+' '+parent._BaseDateWord+'.' + '</p>'
//		html += '<p>' + getSeaPhrase("NHBULLETIN_14","BEN") + '</p>'
	} else {
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
	html += '<p style="text-align:center">'
	if (!parent.noGo)
//		html += uiButton(getSeaPhrase("CONTINUE","BEN"), "parent.CheckBenis();return false", "margin-top:10px")
		html += uiButton(getSeaPhrase("CONTINUE","BEN"), "parent.CheckBenis();return false", "font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
	if (parent.opener)
//		html += uiButton(getSeaPhrase("EXIT","BEN"), "parent.close();return false", "margin-top:10px")
		html += uiButton(getSeaPhrase("EXIT","BEN"), "parent.close();return false", "font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px;margin-left:10px")
// END OF MOD
	html += '</p>'
	html += '</div>'
	document.getElementById("paneBody").innerHTML = html;
	document.getElementById("paneHeader").innerHTML = getSeaPhrase("WELCOME","BEN");
	if (parent.noGo) {
		// The content is small; adjust the window height.
		document.getElementById("paneBorder").style.width = "500px";
		setLayerSizes(true);
	}
	stylePage();
	document.body.style.visibility = "visible";
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
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/benbulletin_nh.htm,v 1.23.2.4 2009/03/04 17:39:46 brentd Exp $ -->
