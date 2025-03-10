<html>
<head>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<!--
<style>
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
</style>
-->
<script type="text/javascript" src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<!--
<script type="text/javascript">
//function setCompany(c) {
      // set up different guarantee Issues per company
//      var maxAge = 0;
//      var maxStudentAge = 0;
//      var payFrequency = "";
//      var levelRates = Array();
//      if(c == 0) {
//        maxAge = 19;
//        maxStudentAge = 23;
//        payFrequency = "month";
//        levelRates[0] = 0.22; // 5k
//        levelRates[1] = 0.44; // 10k
//      }
//      else {
//        maxAge = 21;
//        maxStudentAge = 25;
//        payFrequency = "pay period";
//        levelRates[0] = 0.25; // 5k
//        levelRates[1] = 0.59; // 10k
//      }
//      document.getElementById("maxAge").innerHTML = maxAge;
//      document.getElementById("maxStudentAge").innerHTML = maxStudentAge;
//      document.getElementById("payFrequency").innerHTML = payFrequency;
//      document.getElementById("payFrequency2").innerHTML = payFrequency;
//      for(var i=0;i<levelRates.length;i++) {
//        var ageId = "age" + i;
//        document.getElementById(ageId).innerHTML = "$" + levelRates[i].toFixed(2);
//      }
      
      // set up different EOI link per company
 //     var eoiLink = "";
 //     if(c == 0) {
 //       eoiLink = "BoiseEvidenceOfInsurability.pdf";
 //     }
 //     else {
 //       eoiLink = "MagicValleyEvidenceOfInsurability.pdf";
 //     }
 //     document.getElementById("eoi").href = eoiLink;      
      
      
      // make selector invisible
//      document.getElementById("companySelect").style.visibility = "hidden";
      
      // make info visible
//      document.getElementById("companySpecific").style.visibility = "visible";
      
//      return true;
//}
</script>
-->
<script>
function startProgram()
{
	var html = '<div class="plaintablecell" style="padding:10px">';
    var headertext = '<table border="0" width="100%"><tr><td width="60%"><font style="font-size:smaller" color="#FFFFFF"><b>Employee CHILD Supplemental Life</b></font></td><td width="20%" align="right" valign="middle"><a href=javascript:self.close()><font color="#FFFFFF"><b>Close</b></font></a>&nbsp;</td><td width="20%" align="right" valign="middle"><a href=javascript:self.print()><font color="#FFFFFF"><b>Print</b></font></a>&nbsp;</td></tr></table></div>'
	html += '<div><p>'
	html += 'As an active, benefits eligible employee, St. Luke\'s provides you with a life insurance benefit of 1 times your annual salary.  This benefit is paid for by the company.</div>'
	//html += '<div id="companySelect" style="visibility:visible"><select id="site"><option value="1">Treasure Valley or Wood River Valley</option><option value="8001">Magic Valley</option></select><input type="button" onclick="setCompany(document.getElementById(\'site\').selectedIndex);" value="Select Site >>"/></div>'
	//html += '<div id="companySpecific" style="visibility:hidden">'
html += '<div>'
//html += '<table border="0" width="100%" height="46">'
//  html += '<tr>'
//    html += '<td width="44%" valign="top" align="left" height="42">'
html += '<p class="MsoBodyText">You have the option of purchasing supplemental life insurance for your child(ren) in the amount of either $5,000 or $10,000.  Children are eligible up to age 23.</p>'
html += '<p class="MsoBodyText">Premiums are deducted once per month.</p>'
//html += '&nbsp;</td>'
//html += '</tr>'
//html += '</table>'
html += '</div>'

html += '<hr color="#8080FF">'
<!-- Generation of PM publication page 4 -->


//html += '<form name="listform">'
html += '<div>'
html += '<p class="MsoNormal">The costs are as follows:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>'
html += '<table class="MsoNormalTable" border="1" cellspacing="0" cellpadding="0" style="border: medium none; margin-left: 63.9pt" id="table1">'
	html += '<tr>'
		html += '<td width="210" valign="top" style="width: 157.5pt; border: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12"><b>Level of Coverage</b></font></td>'
		html += '<td width="192" valign="top" style="width: 2.0in; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: 1.0pt solid windowtext; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12"><b>Costs per Month</b></font></td>'
	html += '</tr>'
	html += '<tr>'
		html += '<td width="210" valign="top" style="width: 157.5pt; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">$5,000.00</font></td>'
		html += '<td width="192" valign="top" style="width: 2.0in; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<font style="font-size:12">$0.304</font></td>'
	html += '</tr>'
	html += '<tr>'
		html += '<td width="210" valign="top" style="width: 157.5pt; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">$10,000.00</font></td>'
		html += '<td width="192" valign="top" style="width: 2.0in; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<font style="font-size:12">$0.608</font></td>'
	html += '</tr>'
html += '</table>'
html += '<p class="MsoNormal"><span style="font-size:10.0pt">&nbsp;</span></p>'
html += '<p class="MsoBodyText">You have the option of enrolling, increasing or decreasing your child supplemental life insurance coverage at any time during the year.  To make changes you must complete a <a href="EnrollSuppLife.pdf" target="_new">Supplemental Life insurance enrollment form</a> and return it to Benefits Services.  Your coverage will go into effect the first of the month following receipt of the form in Benefits Services.</p>'
html += '<p class="MsoNormal">&nbsp;</p>'
html += '</div>'
html += '</form>'
html += '</div>'
html += '</div>'
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
