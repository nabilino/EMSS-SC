<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">
<meta charset="utf-8">
<title>Enrollment Order</title>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"></script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script>
function startProgram()
{
	setWinTitle(getSeaPhrase("ENROLLMENT_ORDER","BEN")); 
// MOD BY BILAL
//	var html = '<div class="plaintablecell" style="padding:0px"><br/>'	
	var html = '<center><div class="plaintablecell" style="padding:0px"><br/>'
// END OF MOD
	html += '<table class="plaintable" border="0" cellpadding="0" cellspacing="0" style="width:100%;margin-left:auto;margin-right:auto" role="presentation">'
	html += '<tr><td class="plaintablecell">'
	if (parent.event == "annual")
//		html += getSeaPhrase("BULLETIN2_1","BEN")+'.'
		html += getSeaPhrase("BULLETIN2_1","BEN")+':'
	else if (parent.event == "B")
		html += getSeaPhrase("BULLETIN_6","BEN")
	else if (parent.event == "M")
		html += getSeaPhrase("BULLETIN_7","BEN")
	else if (parent.event == "A")
		html += getSeaPhrase("BULLETIN_8","BEN")
	else if (parent.rule_type == "N")
		html += getSeaPhrase("BULLETIN2_1","BEN")
	else
		html += getSeaPhrase("BULLETIN_9","BEN")
	html += '</td></tr></table><br/>'
	html += '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" style="width:100%;margin-left:auto;margin-right:auto" styler="list" summary="'+getSeaPhrase("TSUM_2","BEN")+'">'
	html += '<caption class="offscreen">'+getSeaPhrase("TCAP_1","BEN")+'</caption>'
	html += '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center">'+getSeaPhrase("PLAN_TYPE","BEN")+'</th></tr>'
	for (var i=1; i<parent.EligPlanGroups.length; i++)
		html += '<tr><td class="plaintablecellborder" style="text-align:center" nowrap>'+parent.EligPlanGroups[i][0]+'</td></tr>'
	html += '</table><br/>'
	html += '<table border="0" cellpadding="0" cellspacing="0" style="width:100%;margin-left:auto;margin-right:auto" role="presentation">'
	html += '<tr><td class="textAlignRight">'
	//html += uiButton(getSeaPhrase("CONTINUE","BEN"), "continueClicked();return false", "margin-right:5px;margin-top:10px")
	html += uiButton(getSeaPhrase("CONTINUE","BEN"), "continueClicked();return false", "font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
	//html += uiButton(getSeaPhrase("PREVIOUS","BEN"), "backClicked();return false", "margin-right:5px;margin-top:10px")
	html += '&nbsp;&nbsp;'+ uiButton(getSeaPhrase("PREVIOUS","BEN"), "backClicked();return false", "font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")

	html += '&nbsp;&nbsp;'
	//html += uiButton(getSeaPhrase("EXIT","BEN"), "parent.quitEnroll(self.location.href);return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-right:0px;margin-top:10px",null,'aria-haspopup="true"')
	html += uiButton(getSeaPhrase("EXIT","BEN"), "parent.quitEnroll(self.location.href);return false","margin-right:5px;margin-top:10px",null,'aria-haspopup="true"')

// MOD BY BILAL
	//html += '</td></tr></table></div>'	
	html += '</td></tr></table></div></center>'
// END OF MOD
	document.getElementById("paneBody").innerHTML = html;
	document.getElementById("paneHeader").innerHTML = getSeaPhrase("ENROLLMENT_ORDER","BEN");
	stylePage();
	document.body.style.visibility = "visible";
	parent.fitToScreen();
}
function backClicked()
{
	parent.initAppVars();	
	parent.document.getElementById("main").src = parent.LastDoc[parent.currentdoc];
	parent.currentdoc--;
}
function continueClicked()
{
	parent.LastDoc[parent.LastDoc.length] = parent.baseurl+"benbulletin2.htm";
	parent.currentdoc = parent.LastDoc.length - 1;
	parent.keepcheck1();
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
</body>
</html>
<!-- Version: 8-)@(#)@10.00.05.00.12 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/benbulletin2.htm,v 1.21.2.33 2014/02/25 22:49:14 brentd Exp $ -->
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
