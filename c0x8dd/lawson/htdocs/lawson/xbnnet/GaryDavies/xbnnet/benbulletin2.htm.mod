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
// MOD BY BILAL
//	var html = '<div class="plaintablecell" style="padding:10px">'
	var html = '<center><div class="plaintablecell" style="padding:10px">'
// END OF MOD

	html += '<table border="0" cellpadding="0" cellspacing="0">'
	html += '<tr><td class="plaintablecell" valign="top">'

	html += '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0">'
// MOD BY CLYNCH - Remove empty header row in table
//	html += '<tr>'
//	html += '<td class="plaintableheaderborder">&nbsp;</td></tr>'
	html += '<tr>'
//	html += '<td class="plaintablecellborder">'
	html += '<td class="plaintablecellborder" style="font-size:14px;font-weight:bold">'

	if(parent.event=="annual")
//		html += getSeaPhrase("BULLETIN2_1","BEN")+'.'
		html += getSeaPhrase("BULLETIN2_1","BEN")+':'
	else if(parent.event=="B")
		html += getSeaPhrase("BULLETIN_6","BEN")
	else if(parent.event=="M")
		html += getSeaPhrase("BULLETIN_7","BEN")
	else if(parent.event=="A")
		html += getSeaPhrase("BULLETIN_8","BEN")
	else if(parent.rule_type=="N")
		html += getSeaPhrase("BULLETIN2_1","BEN")
	else
		html += getSeaPhrase("BULLETIN_9","BEN")

	html += '</td>'
	html += '</tr>'
	html += '</table>'

//	html += '</td><td class="plaintablecell" valign="top">'
	html += '</td></tr><tr><td>&nbsp;</td></tr><tr><td class="plaintablecell" valign="top" style="text-align:center">'

	html += '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" styler="list">'
	//  MOD BY CLYNCH - Remove table header for plan types
//		html += '<tr><th class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("PLAN_TYPE","BEN")+'</th></tr>'
		html += '<tr><th class="plaintableheaderborder" style="text-align:center">'+'</th></tr>'
	for (var i=1; i<parent.EligPlanGroups.length; i++)
//		html += '<tr><td class="plaintablecellborder" border="0" style="font-size:14px;text-align:left" nowrap>'+parent.EligPlanGroups[i][0]+'</td></tr>'
		html += '<tr><td class="plaintablecellborder" style="text-align:center" nowrap>'+parent.EligPlanGroups[i][0]+'</td></tr>'
	html += '</table><br>'
	html += '<table border="0" cellpadding="0" cellspacing="0" width="100%">'
//	html += '<tr><td style="text-align:right">'
	html += '<tr><td style="text-align:center">'
//	html += uiButton(getSeaPhrase("CONTINUE","BEN"), "parent.keepcheck1();return false", "margin-top:10px")
	html += uiButton(getSeaPhrase("CONTINUE","BEN"), "parent.keepcheck1();return false", "font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
//	html += uiButton(getSeaPhrase("EXIT","BEN"), "parent.quitEnroll(self.location.href);return false","margin-right:0px;margin-top:10px")
	html += '&nbsp;&nbsp;'
	html += uiButton(getSeaPhrase("EXIT","BEN"), "parent.quitEnroll(self.document.location);return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-right:0px;margin-top:10px")
	html += '</td></tr>'
	html += '</table>'

	html += '</td></tr>'
	html += '</table>'

// MOD BY BILAL
//	html += '</div>'
	html += '</div></center>'
// END OF MOD
	document.getElementById("paneBody").innerHTML = html;
	document.getElementById("paneHeader").innerHTML = getSeaPhrase("ENROLLMENT_ORDER","BEN");
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
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/benbulletin2.htm,v 1.21.2.5 2010/12/01 17:25:45 brentd Exp $ -->
