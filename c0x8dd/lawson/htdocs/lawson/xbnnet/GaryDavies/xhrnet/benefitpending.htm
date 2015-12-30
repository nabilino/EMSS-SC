<!--
// JRZ 7/8/08 added start date to pending benefits
// JRZ 7/8/08 added print of frame
// JRZ 7/8/08 adding start date column data to pending benefits
-->
<head>
<title>Pending Benefits</title>
<META HTTP-EQUIV="Pragma" CONTENT="No-Cache">
<script src="/lawson/javascript/chgcolor.js"></script>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script src="/lawson/javascript/rndtodecimal.js"></script>
<script>
var company = 0
var employee = 0
var prodline = ""

function OpenCurrentBenefits()
{
	clearTimeout(timer)
	authenticate("frameNm='HIDDEN'|funcNm='GetBenefit()'|desiredEdit='EM'")
}

function GetBenefit()
{
	var pObj   	= new DMEObject(authUser.prodline,"BNBEN")
	pObj.out   	= "JAVASCRIPT"
	pObj.index 	= "BNBSET1"
	pObj.field	= "plan-group;plan-type;plan-code;start-date;stop-date;cover-opt;mult-salary;"
	+ "cover-amt;pay-rate;pct-amt-flag;pre-aft-flag;smoker-flag;emp-pre-cont;emp-aft-cont;cop-cov-desc;rcd-type;"
	+ "plan-desc;dep-cover-amt;cov-pct;flex-cost;emp-cost;comp-cost;update-date;user-id;"
	+ "plan.cmp-ded-code-p;plan.waive-flag;employee.pay-frequency"
	pObj.max 	= "600"
	pObj.key   	= parseInt(authUser.company,10) + "=" + parseInt(authUser.employee,10)
	//pObj.cond	= "Current"
	DME(pObj,"FRAME1")
}

var benefits
var pfreq
var pretotal
//PT 140013

function DspBnben()
{
	var freqStr = ''


	if (self.FRAME1.NbrRecs > 0)
	{
   		pfreq = payFreq(self.FRAME1.record[0].employee_pay_frequency)
		freqStr	= '<tr align=CENTER><td>Costs are ' + Freq(pfreq) + '.'
	}
	//PT 142572
	//pfreq = payFreq(self.FRAME1.record[0].employee_pay_frequency)
// JRZ 7/8/08 added start date to pending benefits
	var benefits = '<html><body link=maroon vlink=maroon><center>'
	+ '<table border=0 cellspacing=0 cellpadding=2>\n'
	+ '<tr align=center>'
	+ '<th colspan=8><h2><b>Your Pending Benefits</b></h2>'
	+ freqStr
  // JRZ 7/8/08 added print of frame
  + '</tr><tr align=center>'
  + '<th colspan=8><input type=\"button\" onclick=\"print()\" name=\"printPendBen\" value=\"Print\"/></th></tr>'
  // JRZ 2/26/09 added wording about life ins not during open enroll
  // CLYNCH 02/06/12 - Removing wording about life insurance elections for special life ins enroll period for 2012
  //+ '<tr align=center><td><b>Reminder:</b> Since you cannot elect supplemental life insurance during annual enrollment, life insurance will not be listed here.  Please see <u>1-Review Current Benefit</u> for the life insurance elections that you have.</td></tr>'
  + '</table>'
  + '<table border=1 cellspacing=0 cellpadding=2>\n<tr>'
	+ '<th><a target=HIDDEN href=javascript:parent.SortBenefit("plan_group")'
	+ ' onMouseOver="window.status=\'Sort by Plan Type\';return true"'
	+ ' onMouseOut="window.status=\'\';return true">Type of Plan</a>'
	+ '<th><a target=HIDDEN href=javascript:parent.SortBenefit("plan_desc")'
	+ ' onMouseOver="window.status=\'Sort by Plan\';return true"'
	+ ' onMouseOut="window.status=\'\';return true">Plan</a>'
	+ '<th>Coverage<th>Pre-Tax \n Cost<th>After-Tax \n Cost<th>Company \n Cost<th>Start Date<th>Last \n Update'
//~JRZ
	self.CONTROLITEM.document.open()
	self.CONTROLITEM.document.write(benefits)
	

	var color = 0

	for (var i=0; i<self.FRAME1.NbrRecs; i++)
	{

		obj = self.FRAME1.record[i]

		rsamount = insertCommas(roundToDecimal(obj.pay_rate,2))
		dcamount = insertCommas(roundToDecimal(obj.pay_rate,2))
		vaamount = insertCommas(roundToDecimal(obj.mult_salary,2))

		if (String(dcamount).indexOf(".") == -1) dcamount += '.00'
		//alert(obj.plan_type + "=" + obj.rcd_type + "=" + dcamount)
	
		benefits = '<tr bgcolor='+chgColor(color++,"ffffff","d0dfff")+'>'

		// Plan Type column data:
		benefits += '<td>' + obj.plan_group + "&nbsp;" + "\n"

		// Plan Description column data:
		benefits += '<td>' + obj.plan_desc + "&nbsp;" + "\n"

		// Coverage column data:

		if ((obj.plan_type == "HL" || obj.plan_type == "DN") && obj.plan_waive_flag == "Y")
		{
			benefits += '<td align=center>Waive &nbsp;\n'
		}
		else if (obj.plan_type == "DI" || obj.plan_type == "DL" || obj.plan_type == "EL")
		{
			if (obj.cover_opt != 0)
			{
				benefits += '<td align=center>' + insertCommas(obj.cop_cov_desc) + '&nbsp;\n'
			}
			else
			{
				benefits += '<td align=center>' + insertCommas(obj.cover_amt) + '&nbsp;\n'
			}
		}
		else if (obj.plan_type == "DN" || obj.plan_type == "HL")
		{
			benefits += '<td align=center>' + obj.cop_cov_desc + '&nbsp;\n'
		}
		else if (obj.plan_type == "RS")
		{
			benefits += '<td align=center>' + rsamount + '&nbsp;\n'
		}
		else if (obj.plan_type == "VA")
		{
			benefits += '<td align=center>' + vaamount + '&nbsp;\n'
		}
		else if (obj.plan_type == "DC")
		{
			if (obj.pct_amt_flag == "P")
			{
				benefits += '<td align=center>' + dcamount + '%' + '&nbsp;\n'			
			}
			else
			{
				benefits += '<td align=center>' + dcamount + '&nbsp;\n'
			}
		}
		else benefits += '<td>&nbsp;\n'

		
		pfreq = payFreq(obj.employee_pay_frequency)
		pretotal = parseFloat(obj.emp_cost)

		if (String(pretotal).indexOf(".") == -1) pretotal += '.00'

		// My Pre-Tax column data:
		benefits += '<td nowrap align=right>'

		if (obj.emp_cost < 0)
		{
			if (obj.pct_amt_flag == "P")
				benefits += obj.emp_cost + '%'
			else benefits += insertCommas(roundToDecimal(obj.emp_cost/pfreq,2))
		}
		else if ((obj.emp_cost != 0) && (obj.pre_aft_flag == "P"))
		{
			if (obj.pct_amt_flag == "P")
				benefits += obj.emp_cost + '%'
			//PT 140013
			else
			{
					if (obj.plan_type != "VA")
					{
						benefits += insertCommas(roundToDecimal(obj.emp_cost,2))
					}
					else benefits += insertCommas(roundToDecimal((obj.flex_cost),2))
			 }
			//PT 140013
		}

		// My After-Tax Cost column data:
		benefits += '&nbsp;\n<td nowrap align=right>'

		if ((obj.emp_cost != 0) && (obj.pre_aft_flag == "A"))
		{
			if (obj.pct_amt_flag == "P")
				benefits += obj.emp_cost + '%'
			//PT 150518
			else
			{
				benefits += insertCommas(roundToDecimal(obj.emp_cost,2));
			}
			//PT 150518
		}

		// Company Cost column data:
		benefits += '&nbsp;\n<td nowrap align=right>'

		if (obj.comp_cost != 0 )
		{
			benefits += insertCommas(roundToDecimal(obj.comp_cost,2))
		}
		else benefits += '&nbsp;\n'

    // JRZ 7/8/08 adding start date column data to pending benefits
		// Start Date Column:
		benefits += '&nbsp;\n<td nowrap align=right>'

		if (obj.plan_type != " " )
		{
			benefits += obj.start_date
		}
		else benefits += '&nbsp;\n'
		//~JRZ
    
		// Last Update Date Column:
		benefits += '&nbsp;\n<td nowrap align=right>'

		if (obj.plan_type != " " )
		{
			benefits += obj.update_date
		}
		else benefits += '&nbsp;\n'

		self.CONTROLITEM.document.write(benefits)
	}

	
	benefits = '</table>'

	if(opener)
	{
		benefits += '<table><form><tr>'
		+ '<td><input type=button value="Back" onClick="parent.window.close()">'
		+ '</table></form></body>'
	}

	self.CONTROLITEM.document.write(benefits)

	if (self.FRAME1.NbrRecs == 0)
		self.CONTROLITEM.document.write('<br><b>You have no benefits.</b>')

	if (self.FRAME1.Next)
	{
		benefits = '<br><h3 align=center><a href="'+self.FRAME1.Next
		+ '" target=FRAME1'
		+ ' onMouseOver="window.status=\'Display More Records\';return true"'
		+ ' onMouseOut="window.status=\'\';return true">More</a>'
	}
	
	//benefits += '<center><p><a>If any of the elections are not correct, go back to <b>Step 3 - Enroll Now</b> and make your election changes.</a></center>'
	benefits += '</body></html>'

	self.CONTROLITEM.document.write(benefits)
	self.CONTROLITEM.document.close()
}

function SortBenefit(property)
{
	sortObjArray(self.FRAME1.record,property,self.FRAME1.NbrRecs)
	DspBnben()
}

function GetNbr(str)
{
	
	if (str.length == 0||str.length == null||str.length == " "||typeof(str.length) == "undefined") return 0
	
	len = str.length - 1

	if (str.charAt(len) == "-")
	{
		n = eval(str.substring(0,len))
		n = 0 - n
		return n
	}
	else return eval(str)
}

function payFreq(paycode)
{
	switch(paycode)
	{
		case "1": return 52
		case "2": return 26
		case "3": return 24
		case "4": return 12
		default:  return 1
	}
}

function Freq(payfreq)
{
	switch(payfreq)
	{
		case 52: return "Weekly"
		case 26: return "Bi-Weekly"
		case 24: return "Semi-Monthly"
		case 12: return "Monthly"
		default: return ""
	}
}

function insertCommas(value)
{
	var lhs = ""
	var rhs = ""
	var decnt = 0
	var places = 1
	var tmp = ""
	var newval = ""

	value = String(value)

	if ((value == "" || value == " " || typeof(value) == "undefined") &&
		(typeof(size) == "undefined" || typeof(places) == "undefined"))
	{
		return value
	}

	for (var i=0; i<value.length; i++)
	{
		if (value.charAt(i) >= "0" && value.charAt(i) <= "9" && decnt == 0)
			lhs += value.charAt(i)
		else if (value.charAt(i) >= "0" && value.charAt(i) <= "9" && decnt == 1)
			rhs += value.charAt(i)
		else if (value.charAt(i) == "." && decnt < 2)
			decnt++
		else if (i == 0 && value.charAt(i) == "-")
			lhs += value.charAt(i)
		else if ((i == 0 && value.charAt(i) == "+") || value.charAt(i) == " ")
			continue
		else
		{
			return value
		}
	}

	if (lhs.length > 3)
	{
		for (var i=lhs.length-1; i>=0; i--)
		{
			if (places == 3)
			{
				places = 1
				if (i > 0 && lhs.charAt(i-1) == "-")
					tmp += lhs.charAt(i)
				else tmp += lhs.charAt(i) + ","
			}
			else
			{
				places++
				tmp += lhs.charAt(i)
			}
		}

		for (var i=tmp.length-1; i>=0; i--)
		{
			if (i == tmp.length-1 && tmp.charAt(i) == ",")
				continue
			else
				newval += tmp.charAt(i)
		}

		if (rhs.length > 0)
			value = newval + "." + rhs
		else value = newval
	}

	return value
}

var timer = setTimeout("OpenCurrentBenefits()", 3000)
</script>
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-395426-5");
pageTracker._trackPageview();
} catch(err) {}</script>
</head>
<frameset cols="100%,*,*" frameborder=no border=0 onLoad="OpenCurrentBenefits()">
	<frame src=/lawson/xhrnet/dot.htm marginwidth=14 marginheight=8 name=CONTROLITEM>
	<frame src=/lawson/xhrnet/dot.htm marginwidth=0 marginheight=0 name=HIDDEN scrolling=no>
	<frame src=/lawson/xhrnet/dot.htm marginwidth=0 marginheight=0 name=FRAME1 scrolling=no>
</frameset>



