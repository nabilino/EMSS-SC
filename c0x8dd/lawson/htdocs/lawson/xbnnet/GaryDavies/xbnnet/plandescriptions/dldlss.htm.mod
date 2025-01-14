<html>
<head>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script type="text/javascript" src="/lawson/xhrnet/ui/ui.js"></script>
<style>
<!--
h1
	{margin-bottom:.0001pt;
	page-break-after:avoid;
	font-size:12.0pt;
	font-family:"Arial";
	font-weight:normal; margin-left:0in; margin-right:0in; margin-top:0in}
 table.MsoNormalTable
	{mso-style-parent:"";
	font-size:10.0pt;
	font-family:"Arial"}
h2
	{margin-bottom:.0001pt;
	text-align:center;
	page-break-after:avoid;
	font-size:10.0pt;
	font-family:"Arial";
	margin-left:0in; margin-right:0in; margin-top:0in}
div.Section1
	{page:Section1;}
-->
</style>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script>
function startProgram()
{
	var html = '<div class="plaintablecell" style="padding:10px">';
    var headertext = '<table border="0" width="100%"><tr><td width="60%"><font style="font-size:smaller" color="#0066cc"><b>Employee SPOUSE Supplemental Life Plan Coverage</b></font></td><td width="20%" align="right" valign="middle"><a href=javascript:self.close()><font color="#0066cc"><b>Close</b></font></a>&nbsp;</td><td width="20%" align="right" valign="middle"><a href=javascript:self.print()><font color="#0066cc"><b>Print</b></font></a>&nbsp;</td></tr></table>'
	html += '<p>'
	html += '<div align="left">'
	html += '<table border="0" width="100%" height="46">'
	html += '<tr><td width="44%" valign="top" align="left" height="42">'
	html += '<p class="MsoNormal" style="font-size:10pt">As an active, benefits eligible employee, St. Luke\'s provides you with a life insurance benefit of 1 times your annual salary.  &nbsp; This benefit is paid for by the company.</p>'
	html += '<p class="MsoNormal" style="font-size:10pt">In addition, you have the option of purchasing supplemental life insurance for your spouse up to $100,000. You may elect coverage in $5,000 increments.  Any coverage election over the guarantee issue amount is subject to Evidence of Insurability approval from Lincoln Financial Group.</p>'
	html += '<p class="MsoNormal" style="font-size:10pt"">The guarantee issue amount for spouse is $50,000</p></td>'
	html += '</tr>'
	html += '</table>'
	html += '</div>'
	html += '<hr color="#8080FF">'
	html += '<form name="listform">'
	html += '<div class=Section1>'
	html += '<p class="MsoNormal">The rates for additional coverage for your spouse are based upon your spouse�s age.&nbsp; As is normally the case with term insurance, these rates will increase as your spouse grows older and moves into a new age bracket.&nbsp; The brackets for your spouse are based on coverage per month per $5000 and are as follows:</p>'
	html += '<table class="MsoNormalTable" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: medium none; margin-left: 90.9pt" id="table1">'
		html += '<tr>'
			html += '<td width="168" valign="top" style="width: 1.75in; border: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center"><b>AGE</b></td>'
			html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: 1.0pt solid windowtext; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<h2>RATE</h2>'
			html += '</td>'
		html += '</tr>'
		html += '<tr>'
			html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">0-29</td>'
			html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">$.357</td>'
		html += '</tr>'
		html += '<tr>'
			html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">30-34</td>'
			html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">$.357</td>'
		html += '</tr>'
		html += '<tr>'
			html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">35-39</td>'
			html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">$.418</td>'
		html += '</tr>'
		html += '<tr>'
			html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">40-44</td>'
			html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">$.589</td>'
		html += '</tr>'
		html += '<tr>'
			html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">45-49</td>'
			html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">$.833</td>'
		html += '</tr>'
		html += '<tr>'
			html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">50-54</td>'
			html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">$1.267</td>'
		html += '</tr>'
		html += '<tr>'
			html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">55-59</td>'
			html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">$2.023</td>'
		html += '</tr>'
		html += '<tr>'
			html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">60-64</td>'
			html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">$3.195</td>'
		html += '</tr>'
		html += '<tr>'
			html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">65-69</td>'
			html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">$5.078</td>'
		html += '</tr>'
		html += '<tr>'
			html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">70 &amp; older</td>'
			html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
			html += '<p class="MsoNormal" align="center" style="text-align:center">$8.519</td>'
		html += '</tr>'
	html += '</table>'
	html += '<p class="MsoBodyText"><b>Example:</b></p>'
	html += '<p class="MsoNormal">Employee Dave\'s spouse is 35.</p>'
	html += '<p class="MsoNormal">He elects $50,000 of coverage.</p>'
	html += '<p class="MsoNormal">'
		html += '<table class="MsoNormalTable">'
			html += '<tr>'
				html += '<td>&nbsp;</td>'
				html += '<td style="text-align:right"><u>$50,000</u></td>'
			html += '</tr>'
			html += '<tr>'
				html += '<td>He divides by $5,000</td>'
				html += '<td style="text-align:right">10</td>'
			html += '</tr>'
			html += '<tr>'
				html += '<td>He multiplies by rate from chart</td>'
				html += '<td style="text-align:right">x <u>$.418</u></td>'
			html += '</tr>'
			html += '<tr>'
				html += '<td><b>Dave\'s Monthly Cost:</b></td>'
				html += '<td style="text-align:right"><b><u>$4.18</u></b></td>'
			html += '</tr>'
		html += '</table>'
	html += '</p>'
	html += '<p class="MsoNormal">&nbsp;</p>'
	html += '<p class="MsoNormal">You have the option of enrolling, increasing or decreasing your supplemental life insurance coverage at any time during the year.  However, your election or increase in coverage requires an Evidence of Insurability form to be completed.  You may obtain the form under the �forms� bookmark to the left or contact Benefits Services.  Once you have completed the Evidence of Insurability, please return it to Benefits Services.  Your coverage will go into effect once you have completed this form and it has been approved.</div>'
	html += '</form>'
	document.getElementById("paneBody").innerHTML = html;
	document.getElementById("paneHeader").innerHTML = headertext
	stylePage();
	document.body.style.visibility = "visible";
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
<!-- Version: 8-)@(#)@(201005) 09.00.01.03.00 Mon Apr 19 10:15:09 CDT 2010 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/benbulletin.htm,v 1.22.2.4 2009/03/04 17:39:46 brentd Exp $ -->
