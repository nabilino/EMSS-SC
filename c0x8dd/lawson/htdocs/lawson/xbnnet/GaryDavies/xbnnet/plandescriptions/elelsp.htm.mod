<html>
<head>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script type="text/javascript" src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script>
function startProgram()
{
//===============================================================================

      // make info visible
      //document.getElementById("companySpecific").style.visibility = "visible";

      //var guaranteeIssueEmp = "";
      //var maxCoverage = "$300,000";
      //var coverageIncrement = "";
      //var rateIncrement = 0;
      //var period = "";
      //var ageRates = Array();
        // Lawson Company 1 (Treasure Valley)
		//maxCoverage = "$300,000";
        //guaranteeIssueEmp = "$120,000";
        //coverageIncrement = "$5,000";
        //period = "month";
        //rateIncrement = 5000;
        //ageRates[0] = 0.39;
        //ageRates[1] = 0.43; // 30-34
        //ageRates[2] = 0.50;
        //ageRates[3] = 0.86;
        //ageRates[4] = 1.10;
        //ageRates[5] = 2.01;
        //ageRates[6] = 3.01; // 55-59
        //ageRates[7] = 5.50;
        //ageRates[8] = 11.23;
        //ageRates[9] = 20.16; // 70+

	  //document.getElementById("guaranteeIssueEmp").innerHTML = guaranteeIssueEmp;
      //document.getElementById("coverageIncrement").innerHTML = coverageIncrement;
      //document.getElementById("maxCoverage").innerHTML = maxCoverage;
      //document.getElementById("rateIncrement").innerHTML = "$" + rateIncrement;
      //document.getElementById("period").innerHTML = period;
      //document.getElementById("period2").innerHTML = period;
      //for(var i=0;i<ageRates.length;i++) {
        //var ageId = "age" + i;
        //document.getElementById(ageId).innerHTML = "$" + ageRates[i].toFixed(2);
      //}
      // compute the example
      //var exampleCoverage = 50000;
      //var exampleAgeOffset = 2; // offset of age into rate array
      //document.getElementById("rateIncrement2").innerHTML = "$" + rateIncrement;
      //var exampleNumInc = exampleCoverage / rateIncrement;
      //document.getElementById("exampleNumInc").innerHTML = exampleNumInc;
      //var exampleRate = ageRates[exampleAgeOffset];
      //document.getElementById("exampleRate").innerHTML = "$" + exampleRate.toFixed(2);
      //var exampleCost = exampleNumInc * exampleRate;
      //document.getElementById("exampleCost").innerHTML = "$" + exampleCost.toFixed(2);
      
      // set up different EOI link per company
      //var eoiLink = "";
      //if(c == 0) {
        //eoiLink = "BoiseEvidenceOfInsurability.pdf";
      //}
      //else {
        //eoiLink = "MagicValleyEvidenceOfInsurability.pdf";
      //}
      //document.getElementById("eoi").href = eoiLink;
      
      // make selector invisible
      //document.getElementById("companySelect").style.visibility = "hidden";
      
      // make info visible
      //document.getElementById("companySpecific").style.visibility = "visible";


//===============================================================================
	var html = '<div class="plaintablecell" style="padding:10px">';
    var headertext = '<table border="0" width="100%"><tr><td width="60%"><font style="font-size:smaller" color="#FFFFFF"><b>Employee Supplemental Life Plan Coverage</b></font></td><td width="20%" align="right" valign="middle"><a href=javascript:self.close()><font color="#FFFFFF"><b>Close</b></font></a>&nbsp;</td><td width="20%" align="right" valign="middle"><a href=javascript:self.print()><font color="#FFFFFF"><b>Print</b></font></a>&nbsp;</td></tr></table></div>'
	html += '<div><p>'
	html += 'As an active, benefits eligible employee, St. Luke\'s provides you with a life insurance benefit of one times your annual salary.  This benefit is paid for by the company.</div>'
	//
	//	html += '<div id="companySelect" style="visibility:hidden"><select id="site"><option value="1">Treasure Valley or Wood River Valley</option><option value="8001">Magic Valley</option></select><input type="button" onclick="setCompany(document.getElementById(\'site\').selectedIndex);" value="Select Site >>"/></div>'
	//setCompany(1);
	html += '<div>'
	//
	html += '<div><p class="MsoBodyText">In addition, you have the option of purchasing supplemental life insurance up to $300,000. You may elect coverage in $5,000 increments.  Any coverage election over the guarantee issue amount is subject to Evidence of Insurability approval from Lincoln Financial Group.</p><p>The guarantee issue amount for employees is $120,000.</p></div>'
	//html += '<form name="listform">'
	html += '<p class="MsoNormalTable">The rates for supplemental coverage for you are based upon your age.&nbsp; As is normally the case with term insurance, these rates will increase as you grow older and move into a new age bracket.&nbsp; The rates shown are per month per $5,000 of coverage:</p>'
	html += '<table class="MsoNormal" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: medium none; margin-left: 90.9pt" id="table1">'
	html += '<tr><td width="168" valign="top" style="width: 1.75in; border: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoBodyText" align="center" style="text-align:center"><font style="font-size:12"><b>AGE</b></font></td>'
		html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: 1.0pt solid windowtext; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12"><b>RATE PER $5,000</font></b>'
		html += '</td>'
	html += '</tr>'

	html += '<tr>'
		html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">0-29</font></td>'
		html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">$  0.395</font></td>'
	html += '</tr>'

	html += '<tr>'
		html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">30-34</font></td>'
		html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">$  0.395</font></td>'
	html += '</tr>'

	html += '<tr>'
		html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">35-39</font></td>'
		html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">$  0.449</font></td>'
	html += '</tr>'

	html += '<tr>'
		html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">40-44</font></td>'
		html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">$  0.587</font></td>'
	html += '</tr>'

	html += '<tr>'
		html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">45-49</font></td>'
		html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">$  0.863</font></td>'
	html += '</tr>'

	html += '<tr>'
		html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">50-54</font></td>'
		html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">$  1.150</font></td>'
	html += '</tr>'

	html += '<tr>'
		html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">55-59</font></td>'
		html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">$  2.022</font></td>'
	html += '</tr>'

	html += '<tr>'
		html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">60-64</font></td>'
		html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">$  3.078</font></td>'
	html += '</tr>'

	html += '<tr>'
		html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">65-69</font></td>'
		html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">$  5.451</font></td>'
		html += '</p>'
	html += '</tr>'

	html += '<tr>'
		html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">70-74</font></td>'
		html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">$11.129</font></td>'
	html += '</tr>'

	html += '<tr>'
		html += '<td width="168" valign="top" style="width: 1.75in; border-left: 1.0pt solid windowtext; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">75 &amp; older</font></td>'
		html += '<td width="162" valign="top" style="width: 121.5pt; border-left: medium none; border-right: 1.0pt solid windowtext; border-top: medium none; border-bottom: 1.0pt solid windowtext; padding-left: 5.4pt; padding-right: 5.4pt; padding-top: 0in; padding-bottom: 0in">'
		html += '<p class="MsoNormal" align="center" style="text-align:center"><font style="font-size:12">$20.016</font></td>'
	html += '</tr>'

html += '</table>'


html += '<p class="MsoBodyText"><b>Example:</b>&nbsp;</p>'
html += '<p class="MsoNormal">Employee Dave is 35 years old.</p>'
html += '<p class="MsoNormal">He elects $50,000 of coverage.</p>'
html += '<p class="MsoNormal">'
	html += '<table class="MsoBodyText">'
		html += '<tr>'
			html += '<td>&nbsp;</td>'
			html += '<td style="text-align:right"><font style="font-size:12"><u>$50,000</u></font></td>'
		html += '</tr>'
		html += '<tr>'
			html += '<td><font style="font-size:12">He divides by $5,000</font></td>'
			html += '<td style="text-align:right"><font style="font-size:12">10</font></td>'
		html += '</tr>'
		html += '<tr>'
			html += '<td><font style="font-size:12">He multiplies by rate from chart</font></td>'
			html += '<td style="text-align:right"><font style="font-size:12">x <u>$0.449</u></font></td>'
		html += '</tr>'
		html += '<tr>'
			html += '<td><font style="font-size:12"><b>Dave\'s cost per month:</b></font></td>'
			html += '<td style="text-align:right"><font style="font-size:12"><b><u>$4.49</u></b></font></td>'
		html += '</tr>'
	html += '</table>'
html += '</p>'
html += '<p class="MsoBodyText">You have the option of enrolling, increasing or decreasing your supplemental life insurance coverage at any time during the year.  However, your election or increase in coverage requires an <a href="EvidenceOfInsurability.pdf" target="_new">Evidence of Insurability form</a> to be completed.  You may obtain the form under the “forms” bookmark to the left or contact Benefits Services.  Once you have completed the Evidence of Insurability, please return it to Benefits Services.  Your coverage will go into effect once you have completed this form and it has been approved.</p>'
html += '<p align="center">&nbsp;</p>'
//html += '</form>'
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
<div id="paneBorder" class="paneborder"  style="padding:10px">
	<table id="paneTable" border="0" height="100%" width="100%" cellpadding="0" cellspacing="0">
	<tr><td style="height:16px">
		<div id="paneHeader" class="paneheader" style="padding:10px">&nbsp;
		</div>
	</td></tr>
	<tr><td>
		<div id="paneBodyBorder" class="panebodyborder" styler="groupbox"><div id="paneBody" class="panebody" style="padding:10px"></div>
		</div>
	</td></tr>
	</table>
</div>
</body>
</html>
<!-- Version: 8-)@(#)@(201005) 09.00.01.03.00 Mon Apr 19 10:15:09 CDT 2010 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/benbulletin.htm,v 1.22.2.4 2009/03/04 17:39:46 brentd Exp $ -->
