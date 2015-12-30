<html>
<head>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"></script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"></script>
<script>
function startProgram()
{
	var Desc = '<div class="plaintablecell" style="padding:10px">'
	Desc += '<center>'
	Desc += '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0">'
	Desc += '<tr>'
	Desc += '<td class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("WARNING","BEN")+'</td></tr>'
	Desc += '<tr>'
	Desc += '<td class="plaintableheadertallwhite">'
// MOD BY BILAL - Prior customization
//	Desc += getSeaPhrase("NHBULLETIN_22","BEN")
	Desc += '<font size=+3>Your benefits have NOT been saved due to an error.<br/>'
		+ 'Please click the Continue button below, and try to enroll again by going back to step 3 - Enroll Now.</font>'
            + '<hr/>'
            + '<p>This error can be avoided by using the Internet Explorer 7 web browser.'
            + ' Your work computer likely has version 6, so if you have version 7 at home, we encourage you to complete online enrollment from home.'
            + ' The web site address to use to enroll from home is: http://www.stlukesonline.org/myHR </p>'
            + '<p>If you do not have Internet Explorer 7 available to you at home, please call the Benefits hotline and they will find additional help for you.</p>'
            + '<p>Benefits Hotline phone numbers: Treasure Valley (381-6180), Magic Valley (737-2135), Wood River (727-8487)</p>'
// END OF MOD
	if (parent.parent.emailSummary || parent.parent.printSummary) 
	{
		Desc += '<p>'
		if (parent.parent.emailSummary && parent.parent.emailaddress)
			Desc += getSeaPhrase("EMAIL_SENT_TO","BEN")+' '+parent.parent.emailaddress+'<br/><br/>'
		if (parent.parent.printSummary)
		{
			Desc += getSeaPhrase("WAIT_PRINT","BEN")+'&nbsp;&nbsp;'
			if (parent.parent.opener)
				Desc += getSeaPhrase("PRINT_COMP_DONE_EXIT","BEN")			
		}
		Desc += '</p>'
	}	
	Desc += '</td>'
	Desc += '</tr>'
	Desc += '<tr><td class="plaintablecell" valign="top">'
	if (parent.parent.opener) 
	{
		Desc += '<p style="text-align:center">'
		Desc += uiButton(getSeaPhrase("DONE","BEN"), "parent.parent.EndEnroll('YES');return false", "margin-top:10px")
		Desc += '</p>'
	}
	else 
	{
		Desc += '<p style="text-align:center">'
		Desc += uiButton(getSeaPhrase("DONE","BEN"), "parent.parent.EndEnroll('YES');return false", "margin-top:10px")
		Desc += '</p>'
	}
	Desc += '</td></tr>'
	Desc += '</table>'
	Desc += '</center>'
	Desc += '</div>'
	document.getElementById("paneBody").innerHTML = Desc
	document.getElementById("paneHeader").innerHTML = getSeaPhrase("ERROR_3","BEN")
	stylePage();
	document.body.style.visibility = "visible";
	checkNotifications()
}
function checkNotifications()
{
	if (parent.parent.emailSummary)
		parent.parent.emailScr(parent.parent.main,true);
	if (parent.parent.printSummary)
		setTimeout(function() { parent.parent.printScr(parent.parent.main.printScreen); }, 500);
}
</script>
</head>
<body onload="setLayerSizes();startProgram()" style="visibility:hidden">
<div id="paneBorder" class="paneborder">
	<table id="paneTable" border="0" height="100%" width="100%" cellpadding="0" cellspacing="0">
	<tr><td style="height:16px">
		<div id="paneHeader" class="paneheader">&nbsp;
		</div>
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
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/besserror.htm,v 1.19.2.7 2011/06/21 16:10:37 brentd Exp $ -->
