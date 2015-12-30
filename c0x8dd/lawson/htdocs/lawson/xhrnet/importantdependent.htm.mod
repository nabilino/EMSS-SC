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
	var html = '<div class="plaintablecell" style="padding:10px">';
   // var headertext = '<table border="0" width="100%"><tr><td width="60%"><font style="font-size:smaller" color="#FFFFFF"><b>Important Information about Dependents Update</b></font></td><td width="20%" align="right" valign="middle"><a href="javascript:self.close()"><font color="#FFFFFF"><b>Close</b></font></a>&nbsp;</td><td width="20%" align="right" valign="middle"><a href="javascript:self.print()"><font color="#FFFFFF"><b>Print</b></font></a>&nbsp;</td></tr></table>'
    var headertext = '<table border="0" width="100%"><tr><td width="60%"><font style="font-size:smaller" color="#000000"><b>Important Information about Dependents Update</b></font></td><td width="15%" align="right" valign="middle"><a href="javascript:self.close()"><font color="#000000"><b>Close</b></font></a>&nbsp;</td><td width="15%" align="right" valign="middle"><a href="javascript:self.print()"><font color="#000000"><b>Print</b></font></a>&nbsp;</td></tr></table>'
	//headertext = '<div onclick="window.close()">Close</div>'
	html += '<p>'
	html += '<div align="left">'
	html += '<!--// JRZ 6/10/2008 adding 25% discount information -->'
	html += '<table border="0" width="100%" height="46">'
	html += '<tr>'
    html += '<td width="44%" valign="top" align="left" height="42"><font size="2" face="Arial">To receive the '
	html += '<b>25% facilities discount</b> for any of your eligible dependents, '
	html += '<font color="#FF0000"><b>you must add your dependent (including your spouse) to this screen</b></font>. </font>'
	html += '<p><font size="2" face="Arial">If you have dependents, please review the information we have on file for accuracy. However, adding or changing dependents on this screen <b><u>does not</u></b> affect your elected benefit plans.</font>'
	html += '</p>'
	html += '<p><font size="2" face="Arial">You will make dependent benefit additions or changes when you go to the '
	html += '<b>“Enroll Now”</b> bookmark, located on the left hand side of the screen. In order for your dependent child(ren) to be eligible for St. Luke\’s benefits, your child(ren) must be under the age of 26.</font></p>'
	html += '<p><b><font size="2" face="Arial" color="red">Dependent Verification</font></b></br>'
	html += '<font size="2" face="Arial">To ensure that our plan is complying with plan eligibility rules and federal regulations, if you choose to enroll a dependent on your medical, dental and/or vision plan, you will be required to provide documentation, including social security number, to verify the eligibility of any newly-enrolled dependents. <u>This applies if you enroll a dependent(s) whose eligibility has <b>not</b> previously been verified.</u>  Your dependents <u>will not</u> be added to your plan until you have verified eligibility! Click <a href="DepVerifyPDF.htm" target="_blank">here</a> for additional details.</font>'
	html += '<p><font size="2" face="Arial"><u>Eligible dependents are:</u></font></br>'


    html += '<ul><font size="2" face="Arial">'
       html += '<li>Opposite-gender spouse under a legally valid marriage, as determined in accordance with the laws of the State of Idaho, who is not legally separated or divorced from you (Idaho does not recognize common-law marriage).</li>'
       html += '<li>Same-gender spouse who is legally married under state or national law that recognizes same-gender marriages.</li>'


       html += '<li>A child under the age of 26 years. For purposes of the plan, a “child” means your:</li>'
          html += '<ul>'
             html += '<li>Biological child,</li>'
             html += '<li>Legally adopted child or child placed with you for whom legal adoption proceedings have been initiated,</li>'
             html += '<li>Stepchild,</li>'
             html += '<li>Child for whom you are the legal guardian, and/or </li>'
             html += '<li>Child who is required to be covered by a Qualified Medical Child Support Order.</li>'
          html += '</ul>'
    html += '</font></ul>'
	html += '<p><b><font size="2" face="Arial" color="red">Dependent Social Security Numbers</font></b></br>'
	html += '<font size="2" face="Arial">In order to comply with Federal law, we are requiring Social Security numbers for all dependents enrolled in St. Luke\’s health plan. During open enrollment, please check to make sure Social Security numbers are entered in myHR for your dependents. If you do not have a Social Security number for your dependent(s), please contact Benefits Services. Failure to provide social security numbers for dependents may affect coverage for your dependent.</font></p>'
	html += '<p><font size="2" face="Arial">Coverage for your child will terminate at the end of the month of his or her 26th birthday unless he or she (1) is not capable of self-support because of intellectual disability, physical disability or illness which began before the age of 26, (2) is dependent on the Covered Member for the majority of their financial support and maintenance, and (3) is unmarried. To continue coverage, you must provide St. Luke’s Benefits Services with proof of your child’s condition within 60 days of the date your child would otherwise cease to be eligible.</font><br/>'
	html += '<p><font size="2" face="Arial">If you have a child over the age of 26 and you feel they are disabled, please contact Benefits Services at 381-6180 for information on how to apply for your child to qualify for disabled dependent status.</font></p>'
	html += '</td>'
	html += '</tr>'
	html += '</table>'
	html += '</div>'
	document.getElementById("paneBody").innerHTML = html;
	document.getElementById("paneHeader").innerHTML = headertext 
	// ianm 20141009 - remove stylePage as it prevents the buttons from working. 
	//stylePage();
	document.body.style.visibility = "visible";
}
</script>
</head>
<body onload="setLayerSizes();startProgram()" style="visibility:hidden">
<div id="paneBorder" class="paneborder">
	<table id="paneTable" border="0" height="100%" width="100%" cellpadding="0" cellspacing="0">
	<tr><td style="height:16px">
		<div id="paneHeader" class="paneheader">&nbsp;<div onclick="window.close()">Hi</div>
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
