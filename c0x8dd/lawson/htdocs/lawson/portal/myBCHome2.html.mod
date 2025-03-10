<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<title>myBusinessConnect</title>

<link rel="stylesheet" type="text/css" href="myBC.css"/>
<script src="XMLObjTree.js"></script>

<script>
function openLink(href)
{
	window.open(href)
	return false;
}

function doQuery(query, callBack)
{
	//alert('doQuery')
	if (typeof(query) == "object")
	{
		var q = query.query
		var forcedCols = query.forcedCols
	}
	else
	{
		var q = query
		var forcedCols = null
	}
	if (window.XMLHttpRequest) {							
		ajax=new XMLHttpRequest();							
	} else {																	
		ajax=new ActiveXObject("Microsoft.XMLHTTP");
	}
		
	var url = q
	
	ajax.open("GET", url, false)
	ajax.setRequestHeader("Content-Type", "text/xml");
	//ajax.setRequestHeader("Content-Length", data.length);
	ajax.send()
	var xotree = new XML.ObjTree();
	xotree.force_array = forcedCols
	var resp = ajax.responseText
	
	if (typeof resp == "string")
	{
		if (window.DOMParser)
		{
			parser=new DOMParser();
			xmlDoc=parser.parseFromString(resp,"text/xml");
		}
		else // Internet Explorer
		{
			xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async=false;
			xmlDoc.loadXML(resp);
		}
	}
	var res = xotree.parseDOM(xmlDoc);
	return res['#document']
	//var rows = res['#document'].DME.RECORDS.RECORD
}
with ( { vProfile: null } )
{
	Profile = function()
	{
		if (! vProfile)
		{
			this.loadProfile()	
			vProfile = this;
		}
		else
			return vProfile;
	}
	Profile.prototype.loadProfile = function()
	{
		this.attribs = {}
		this.objDoc = doQuery("/servlet/Profile")
		this.profileLoadedAt = new Date()
		
		var attribs = this.objDoc.PROFILE.ATTRIBUTES.ATTR
		for (var a=0; a < attribs.length; a++)
		{
			this.attribs[attribs[a]['-name']] = attribs[a]['-value']
		}
	}
	Profile.prototype.getAttrib = function(a)
	{
		return this.attribs[a]
	}
	Profile.prototype.serverTime = function()
	{
		var nowMS = new Date().getTime()
		var thenMS = this.profileLoadedAt.getTime()
		var serverThenMS = strsToDate(this.getAttrib('date'), this.getAttrib('time')).getTime()
		return new Date(serverThenMS + (nowMS - thenMS))
	}
}
function strsToDate(date,time)
{
	//alert(date + ":" + time)
	return new Date(date.substr(0,4), date.substr(4,2) -1, date.substr(6,2), time.substr(0,2), time.substr(2,2), time.substr(4,2), 0)
}
function msTilServerTime(date, time)
{
	var profile = new Profile();
	var sDate, sTime;
	
	var pTime = strsToDate(date, time) // parameters time
	
	var now = new Date()
		
	var sTime = profile.getAttrib('time')
	var sDate = profile.getAttrib('date')

	var lTime = new Date(strsToDate(sDate, sTime).getTime() + (now.getTime() - profile.profileLoadedAt.getTime())) // lawson time
	var timeDiff = lTime.getTime() - now.getTime()
	return lTime.getTime() - pTime.getTime()
	//return 
}
function hideEnroll()
{
	var container = document.getElementById("myHR")
	var enrollClosed = document.getElementById("enrollmentClosed")
	container.removeChild(container.firstChild);
	container.appendChild(enrollClosed)
	enrollClosed.style.display = "block"
}
function checkContent()
{
	return
	// The HR Benefits enrollment section will expire at the date and time below (Central Time) and be hidden from view
	// automatically
	var eDate = "20150227"
	var eTime = "180000"
		
	if ( msTilServerTime(eDate, eTime) < 0)
	{
		setTimeout(hideEnroll, 0 - msTilServerTime(eDate, eTime))
		return
	}

	hideEnroll()
	
}
</script>
</head>

<body onload="checkContent()">
	<div class="myBCPage">
		<div class="myBCHeader">
			<div class="myBCTitle">Welcome to <i>my</i>BusinessConnect</div>
			<br>Helping to improve and streamline business processes by putting human resources and business information in your hands.
		</div>
		<table class="myBCTableContainer">
			<col width="50%">
			<col width="50%">
			<tr class="myBCRowContainer">
				<td class="myBCContainer">
					<table class="myBCTableContainer">
						<tr class="myBCRowHeader">
							<th class="myBCContainer">
								<span class="myBCTitle"><i>my</i>BusinessConnect</span>
							</th>
						</tr>
						<tr class="myBCRowContainer">
							<td class="myBCContainer">
								<div>
									<ul>
									<!-- <li class="myBCMain"><span><a href="http://inside.slrmc.org/mybusinessconnect/crosswalk.php" onclick="return openLink(this.href)">Crosswalk Lookup Tools</a></span></li> -->
									<li class="myBCMain"><span>For your new personnel information, click <b><i>my</i>BC Data</b> on the left menu under <i>my</i>HR Employee Self-Serve.</span></li>
									<li class="myBCMain"><span><a onclick="return openLink(this.href)" href=" http://weekly.stlukesblogs.org/mybc-frequently-asked-questions/">Frequently Asked Questions (FAQs)</a></span></li>
									<li class="myBCMain"><span>Contact HelpDesk at <a href="mailto:helpdesk@slhs.org" onclick="return openLink(this.href)">helpdesk@slhs.org</a> or 208-381-4357 for assistance.</span></li>
									</ul>
								</div>
							</td>
						</tr>
					</table>
				</td>
				<td class="myBCContainer">
					<table class="myBCTableContainer">
						<tr class="myBCRowHeader">
							<th class="myBCContainer">
								<span class="myBCTitle">Human Resources</span>
							</th>
						</tr>
						<tr class="myBCRowContainer">
							<td class="myBCContainer">
								<div id="myHR">
										<ul>
										<!-- <li class="myBCMain"><span><a href="http://inside.slrmc.org/mybusinessconnect/crosswalk.php">Human Resources Crosswalks</a></span></li>
										<li class="myBCMain"><span><a href="http://inside.slrmc.org/hr/">Inside St Luke's Human Resources</a></span></li>
										<li class="myBCMain"><span><a href="http://inside.slrmc.org/hr/indexbmw_myhr.php">New Hire Benefits Page</a></span></li>
										<li class="myBCMain"><span><a href="../xbnnet/plandescriptions/NewHireBenefitsPresentation.pdf" target="_new">New Hire Benefits Presentation</a></span></li>
										</ul> -->
										<!-- <li class="myBCMain"><span>Benefits Open Enrollment is February 9 through Friday, February 27, at 5 PM MST.</span></li>
										<li class="myBCMain"><span>Important!  All benefits eligible employees are required to actively enroll or waive benefits.  Click on the <i>my</i>HR Employee Self-Serve bookmark to the left and select Benefits Open Enrollment to get started.</span></li>
										<li class="myBCMain"><span><a onclick="return openLink(this.href)" href="/lawson/xhrnet/st_lukes/HRDocs/OE Employee presenation Slides 2-9-2015 Final.pdf">Click here</a> to view the Open Enrollment Presentation.</span></li>
										<li class="myBCMain"><span><a onclick="return openLink(this.href)" href="/lawson/xhrnet/st_lukes/HRDocs/Computer compatibility document.pdf">Click here</a> to view Computer Compatibility Document.</span></li> -->
										<li class="myBCMain"><span>Benefits Plan year begins 4/1/15</span></li>
										<li class="myBCMain"><span>Please verify your new plan year deductions are correct on your 4/10/15 paycheck</span></li>
										<li class="myBCMain"><span>If you changed plans, you should receive new ID cards around the middle of April</span></li>
										<li class="myBCMain"><span>New Hires:  Select the myHR Employee Self-Serve bookmark for more information</span></li>
										<li class="myBCMain"><span><a onclick="return openLink(this.href);" href="/lawson/xhrnet/st_lukes/HRDocs/New Hire Employee Benefits Presentation 2015-2016.pdf">Click here</a> for the New Hire Benefits Presentation</span></li>
										<li class="myBCMain"><span><a onclick="return openLink(this.href);" href="/lawson/xhrnet/st_lukes/HRDocs/Quick Start Guide New Hires.pdf">Click here</a> for the Benefits Enrollment Quick Start Guide</span></li>
										</ul>
								</div>
							</td>
						</tr>
					</table>
				</td>
			</tr>
			<tr class="myBCRowContainer">
				<td class="myBCContainer">
					<table class="myBCTableContainer">
						<tr class="myBCRowHeader">
							<th class="myBCContainer">
								<span class="myBCTitle">Supply Chain</span>
							</th>
						</tr>
						<tr class="myBCRowContainer">
							<td>
								<div>
								<ul>
								<!--<li class="style3"><span><a onclick="return openLink(this.href)" href="https://sumtotal.slhs.org/SumTotal/app/taxonomy/learnerSearch/LearnerSearch.aspx?RootNodeID=-1&NodeID=231&UserMode=0">Requisition Center (RQC) Job Aids </a>(Requires you to log in to Learning Center)</span></li>-->
								<li class="style3"><span><a onclick="return openLink(this.href)" href="http://inside.slhs.org/supply_chain_management/purchasing.php">Mode of Purchase</a> (How to purchase items and services job aid)</span></li>
								<li class="style3"><span><a onclick="return openLink(this.href)" href="http://inside.slhs.org/supply_chain_management/P-CardInfo.php">Purchasing Cards (PCard) Website</a></span></li>
								<li class="style3"><span><a onclick="return openLink(this.href)" href="http://inside.slhs.org/supply_chain_management/index.php">Supply Chain Website</a></span></li>
								</ul>
								</div>
							</td>
						</tr>
					</table>
				</td>
				<td class="myBCContainer">
					<table class="myBCTableContainer">
						<tr class="myBCRowHeader">
							<th class="myBCContainer">
								<span class="myBCTitle">Finance and Payroll</span>
							</th>
						</tr>
						<tr class="myBCRowContainer">
							<td class="myBCContainer">
								<div>
								<ul>
								<!-- <li><a onclick="return openLink(this.href)" href="http://inside.slrmc.org/mybusinessconnect/crosswalk.php">Pay Code Crosswalk</a>
								<li><span><a onclick="return openLink(this.href)" href="http://inside.slrmc.org/mybusinessconnect/crosswalk.php">Finance Crosswalk</a> (Old to new & new to old - Company and Dept. numbers) -->
								<li><span><a onclick="return openLink(this.href)" href="http://inside.slrmc.org/finance/documents/SPLEmployeeExpenseForm.pdf">Employee Expense Form Job Aid</a> (How to complete your EE Reimbursement Request Form)</span>
								<li><span><a onclick="return openLink(this.href)" href="http://inside.slrmc.org/finance/">Inside St. Luke�s Finance</a> (Visit for all your Finance needs)</span>
								<li><span><a onclick="return openLink(this.href)" href="http://inside.slrmc.org/finance/Finance_Crosswalk.php">Finance and Payroll Crosswalk Tools</a></span>
								
								</ul>
								</div>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</div>
	<div id="enrollmentClosed" style="display: none;">
		<li class="myBCMain"><span>BENEFITS OPEN ENROLLMENT OFFICIALLY CLOSED at 5 pm MST, Friday, Feb. 27, 2015.</span></li>
		<li class="myBCMain"><span>We encourage all employees to review your Open Enrollment benefit elections by clicking on <a href="/lawson/xhrnet/benefitpending.htm">�4-Review Pending Benefits�</a>.</span></li>
		<li class="myBCMain"><span>If you discover an error in your enrollment, please contact Benefits Services at 208-381-6180 or <a href="mailto:benefitsquestions@slhs.org" onclick="return openLink(this.href)">benefitsquestions@slhs.org</a> to report the error for evaluation.</span></li>
		<li class="myBCMain"><span><b><i>You have until Friday, Mar. 6, 2015 at 5pm MST to report mistakes to Benefits Services.</b></i></span></li>
		<li class="myBCMain"><span>Please refer to your Benefits Highlights Booklet for details on what happens if you did NOT complete Open Enrollment and had coverage for the 2014/2015 plan year.</span></li>

	
	</div>
</body>