<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title>Direct Reports</title>
<meta name="viewport" content="width=device-width" />
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/webappjs/common.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/webappjs/transaction.js"></script>
<script src="/lawson/xhrnet/waitalert.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script src="/lawson/webappjs/drill.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"></script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script src="/lawson/webappjs/javascript/objects/ActivityDialog.js"></script>
<script src="/lawson/webappjs/javascript/objects/OpaqueCover.js"></script>
<script src="/lawson/webappjs/javascript/objects/Dialog.js"></script>
<script>
//NOTE: The DISPLAY_REVIEWS_WITHIN_DAYS setting has been moved to the xhrnet/xml/config/emss_config.xml file.
var PersonnelActionWindow = null;
var emps = new Array();
var allemps	= new Array();
var thisMgrId = '';
var thisMgrDesc	= '';
var thisMgrOpenPos = false;
var navcnt = 0;
var employee;
var company;
var prodline;
var Pcompany;
var relatedLinks = new Array();

function OpenDirectReports()
{
	authenticate("frameNm='jsreturn'|funcNm='DisplayReports()'|officeObjects=true|desiredEdit='EM'");
}

function DisplayReports()
{
	stylePage();
	document.title = getSeaPhrase("DIRECT_REPORTS","ESS");
	setTaskHeader("header",getSeaPhrase("DIRECT_REPORTS","ESS"),"Manager");
	StoreDateRoutines();

	company  = authUser.company;
	employee = authUser.employee;
	prodline = authUser.prodline;
	Pcompany = company;

	for(var i=company.toString().length;i<4;i++)
	   Pcompany = "0" + Pcompany;

	emps = new Array();
	GetReports(employee);
}

function GetReports(empNo, isOpenPosition)
{
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"));
	thisMgrId = empNo;
	var managerKey = "";
	if (typeof(isOpenPosition)!="undefined" && isOpenPosition)
	{
		thisMgrOpenPos = true;
		managerKey = "&PTF-CODE=" + escape(empNo);
	}
	else
	{
		thisMgrOpenPos = false;
		managerKey = "&HSU-EMPLOYEE=" + escape(parseInt(empNo,10));
  	}

  	var obj   			= new AGSObject(prodline, "HS10.1");
   	obj.event		  	= "ADD";
   	obj.rtn	 			= "DATA";
	obj.longNames 		= "ALL";
	obj.tds				= false;
    obj.field			= "FC=I"
	  					+ "&HSU-COMPANY=" + escape(parseInt(company,10))
	  					// + "&HSU-EMPLOYEE=" + escape(parseInt(empNo,10))
						+ managerKey
  						+ "&OPEN-POS=Y"
  						+ "&DIR-RPT=Y"
						//+ "&ALL-LVL=Y"
  	if (self.lawheader.pg)
  	{
  	  	obj.field		+= "&PT-FC=" + escape(self.lawheader.PT_FC)
	  					+ "&PT-PTF-EMPLOYEE=" + escape(parseInt(self.lawheader.PT_PTF_EMPLOYEE,10))
	  	if (NonSpace(self.lawheader.PT_HSU_CODE))
			obj.field += "&PT-HSU-CODE=" + escape(self.lawheader.PT_HSU_CODE)
	  	if (NonSpace(self.lawheader.PT_HSU_OP_CODE))
			obj.field += "&PT-HSU-OP-CODE=" + escape(self.lawheader.PT_HSU_OP_CODE)
  	}
	obj.func			= "parent.DrawReportsScreen()";
	obj.debug			= false;
  	AGS(obj, "jsreturn");
}

function sortByName(obj1, obj2)
{
	var name1 = obj1.last_name + ' ' + obj1.first_name;
	var name2 = obj2.last_name + ' ' + obj2.first_name;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function DrawReportsScreen()
{
	// Save off this page of reports.
	emps = emps.concat(self.lawheader.e);
	// Grab more reports, if they exist.
	// This ensures that we will have all reports before we display.
   	if (self.lawheader.pg)
   	{
   		GetReports(thisMgrId, thisMgrOpenPos);
		return;
   	}

	emps.sort(sortByName);
//PT 152935
	thisMgrDesc = self.lawheader.HSU_FULL_NAME
//PT 152935
	allemps[navcnt] = new ManagerObj(thisMgrDesc,emps);
   	DrawReportsTable(allemps[navcnt]);
}

function DrawReportsTable(thislevel)
{
	emps = thislevel.reports;
	var ReportsContent = '';
	var ReportsContent2 = '';
	var ReportsStruct = new Array();

	self.main.document.getElementById("paneHeader").innerHTML = getSeaPhrase("REPORTS_OF","ESS")+'&nbsp;'+thislevel.manager;

	if (!emps.length) {
   		ReportsContent = '<div align="center">'
   		ReportsContent += '<p class="fieldlabelbold" style="text-align:left">'+getSeaPhrase("NO_DIRECT_REPORTS","ESS")+'</p>'
		ReportsContent += '<p>'
      	if (navcnt > 0)
          	ReportsContent += uiButton(getSeaPhrase("BACK","ESS"),"parent.backOne();return false");
      	if (navcnt > 1)
			ReportsContent += uiButton(getSeaPhrase("START_OVER","ESS"),"parent.startOver();return false");
		ReportsContent += '</p>'
   		ReportsContent += '</div>'
		DrawFrameContent(ReportsContent);
   	} else {
		ReportsContent = '<table>'
		for (var i=0; i<emps.length; i++) {
			ReportsStruct[i] = '<tr>';
			if (NonSpace(emps[i].super_code) == 0) {
	       		if (parseFloat(getDteDifference(emps[i].date_hired,ymdtoday)) <= 90)
    	        	ReportsStruct[i] += '<td class="plaintablecell" style="color:red">'+getSeaPhrase("NEW_HIRE","ESS")+'</td>'
        	   	else
        	   		ReportsStruct[i] += '<td></td>'
       	   		ReportsStruct[i] += '<td style="width:10px"></td>'
	           	ReportsStruct[i] += '<td><img alt="" border="0" src="/lawson/xhrnet/images/employees/'
				// + 'P'+Pcompany+Pemployee(emps[i].employee)+'.jpg" onerror=this.style.visibility="hidden"></td>'
				+ 'P'+Pcompany+Pemployee(emps[i].employee)+'.jpg" onerror=this.src="'+uiNoPhotoPath+'"></td>'
       	   		+ '<td style="width:10px"></td>'
           		+ '<td><a href=javascript:parent.getProfile('+parseInt(i,10)+')'
				+ ' onmouseover="window.status=\''+getSeaPhrase("VIEW_EMPLOYEE_PROFILE_2","ESS").replace(/\'/g,"\\'")+'\';return true"'
				+ ' onmouseout="window.status=\' \';return true">'
				+ emps[i].full_name+'</a></td>'
       	   		+ '<td style="width:10px"></td>'
//CLYNCH 09/01/2011 - Remove Employee Drill-Around link from Direct Reports screen
//            	+ '<td><a href="javascript:parent.drillwind('+parseInt(emps[i].employee,10)+')"'
//				+ ' onmouseover="window.status=\''+getSeaPhrase("EMPLOYEE_DRILL","ESS").replace(/\'/g,"\\'")+'\';return true"'
//				+ ' onmouseout="window.status=\' \';return true">'
//        	    + '<img border="0" src="/lawson/xhrnet/images/detail.gif" styler="drill" alt="'+getSeaPhrase("EMPLOYEE_DRILL","ESS")+'"></a>'
//       	   		+ '</td><td style="width:10px"></td>'
//CLYNCH 09/01/2011 - Remove Personnel Actions link from Direct Reports screen
//			if (relatedLinkIsAccessible("PERSONNEL ACTIONS", "XMLHREMPPACTIONS"))
//			{
//				ReportsStruct[i] += '<td><a href=javascript:parent.getPersAction('+parseInt(i,10)+')'
//					+ ' onmouseover="window.status=\''+getSeaPhrase("SUBMIT_PERSONNEL_ACTION","ESS").replace(/\'/g,"\\'")+'\';return true"'
//					+ ' onmouseout="window.status=\' \';return true">'
//					+ getSeaPhrase("PERSONNELACTION","ESS")+'</a></td>'
//			}
//CLYNCH 09/01/2011 - Remove Emergency Contacts link from Direct Reports screen
//        	    ReportsStruct[i] += '<td style="width:10px"></td>'
//        	    + '<td><a href=javascript:parent.getEmergencyContacts('+parseInt(i,10)+')'
//				+ ' onmouseover="window.status=\''+getSeaPhrase("EMERGENCY_CONTACTS","ESS").replace(/\'/g,"\\'")+'\';return true"'
//				+ ' onmouseout="window.status=\' \';return true">'
//				+ getSeaPhrase("EMERGENCY_CONTACTS","ESS")+'</a></td>'
// END OF MOD
			} else
				ReportsStruct[i] += '<td colspan="4"></td><td class="plaintablecell">'+emps[i].full_name+'</td><td colspan="4"></td>'
				+ '<td style="width:10px"></td><td></td>';

   	   		ReportsStruct[i] += '<td style="width:10px"></td>'
          	if (emps[i].direct_reports == "Y") {
				var managerID = "";
				var isOpenPosition = false;
				if (NonSpace(emps[i].super_code) != 0) {
					managerID = '"' + escape(emps[i].employee,1) + '"';
					isOpenPosition = true;
				} else
					managerID = parseInt(emps[i].employee,10);
        	  	ReportsStruct[i] += '<td><a href=javascript:parent.nextReports('+ isOpenPosition +','+ managerID +',"'+escape(emps[i].full_name)+'")'
					+ ' onmouseover="window.status=\''+getSeaPhrase("VIEW_DIRECT_REPORTS","ESS").replace(/\'/g,"\\'")+'\';return true"'
					+ ' onmouseout="window.status=\' \';return true">'+getSeaPhrase("DIRECT_REPORTS","ESS")+'</a></td>'
			} else
				ReportsStruct[i] += '<td></td>'

   	   		ReportsStruct[i] += '<td style="width:10px"></td>'
//CLYNCH 09/01/2011 - Remove Performance Review link from Direct Reports screen
//	if (emps[i].next_review != "" && relatedLinkIsAccessible("PERFORMANCE MANAGEMENT", "XMLHRMGRPERFMGMT")) {
//		if (emps[i].next_review < ymdtoday) {
//			ReportsStruct[i] += '<td><a href=javascript:parent.getReview('+parseInt(i,10)+')'
//					+ ' onmouseover="window.status=\''+getSeaPhrase("SUBMIT_PERFORMANCE_REVIEW","ESS").replace(/\'/g,"\\'")+'\';return true"'
//					+ ' onmouseout="window.status=\' \';return true">'+getSeaPhrase("OVERDUE","ESS")+'</a></td>'
//		} else if (parseFloat(getDteDifference(ymdtoday,emps[i].next_review)) <= emssObjInstance.emssObj.reviewsWithinDays) {
//			ReportsStruct[i] += '<td><a href=javascript:parent.getReview('+parseInt(i,10)+')'
//					+ ' onmouseover="window.status=\''+getSeaPhrase("SUBMIT_PERFORMANCE_REVIEW","ESS").replace(/\'/g,"\\'")+'\';return true"'
//					+ ' onmouseout="window.status=\' \';return true">'+getSeaPhrase("DUE","ESS")+'</a></td>'
//				} else
//					ReportsStruct[i] += '<td></td>'
//	} else
//            	ReportsStruct[i] += '<td></td>'
// END OF MOD	    
           	ReportsStruct[i] += '</tr>'
      	}
		ReportsContent2 = '</table><p style="text-align:center">'
		if (navcnt > 0)
			ReportsContent2 += uiButton(getSeaPhrase("BACK","ESS"),"parent.backOne();return false");
		if (navcnt > 1)
			ReportsContent2 += uiButton(getSeaPhrase("START_OVER","ESS"),"parent.startOver();return false");
		ReportsContent2 += '</p>'
		DrawFrameContent(ReportsContent+ReportsStruct.join("")+ReportsContent2);
	}
	self.main.stylePage();
	self.document.getElementById("main").style.visibility = "visible";
	removeWaitAlert();
	fitToScreen();
}

function Pemployee(e)
{
	var Pemp = parseInt(e,10).toString();
 	for (var i=Pemp.length;i<9;i++)
		Pemp = "0" + Pemp;
	return Pemp;
}

function nextReports(isOpenPosition, id, name)
{
	// Navigate to next level of reports.
	navcnt++;
	if (navcnt != allemps.length && allemps[navcnt].manager == unescape(name))
	{
		// No need to re-create the AGS call: the user is trying to
		// re-generate the same level.  Simply re-display the stored reports.
		DrawReportsTable(allemps[navcnt]);
	} else {
		// Create a new level of reports.
		thisMgrDesc = unescape(name);
		id = unescape(id);
		emps = new Array();
		allemps = allemps.slice(0,navcnt);
		GetReports(id, isOpenPosition);
	}
}

function backOne()
{
   	// Navigate to previous level of reports.
   	navcnt--;
	DrawReportsTable(allemps[navcnt]);
}

function startOver()
{
  	navcnt = 0;
  	emps = new Array();
  	allemps = allemps.slice(0,navcnt+1);
  	DrawReportsTable(allemps[navcnt]);
}

function goToSub(frame, urlStr)
{
	self.document.getElementById("main").style.visibility = "hidden";
	self.document.getElementById(frame).src = urlStr;
	self.document.getElementById(frame).style.visibility = "visible";
}

function backToMain(frame, updated)
{
	self.document.getElementById(frame).style.visibility = "hidden";

	// if an employee review has been updated, refresh the report list to reflect the changes
	if (frame == "review" && updated)
	{
		self.lawheader.e = new Array();
		emps = new Array();
		GetReports(employee);
	}
	else
	{
		self.document.getElementById("main").style.visibility = "visible";
	}

	fitToScreen();
}

function getProfile(i)
{
	var thisEmp = allemps[navcnt].reports[i];
   	var urlStr = "/lawson/xhrnet/empprofile.htm?number="+parseInt(thisEmp.employee,10)+"&name="+escape(thisEmp.full_name,1)+"&from=directreports";
	goToSub("profile", urlStr);
}

function getPersAction(i)
{
	var thisEmp = allemps[navcnt].reports[i];
   	var urlStr = "/lawson/xhrnet/personnelactions/pactions.htm?index="+i+"&from=directreports";
	goToSub("personnelactions", urlStr);
}

function getEmergencyContacts(i)
{
	var thisEmp = allemps[navcnt].reports[i];
   	var urlStr = "/lawson/xhrnet/emergcnt.htm?number="+parseInt(thisEmp.employee,10)+"&name="+escape(thisEmp.full_name,1)+"&from=directreports";
	goToSub("emergencycontacts", urlStr);
}

function getReview(i)
{
	var urlStr;
	var thisEmp = allemps[navcnt].reports[i];

	showWaitAlert(getSeaPhrase("WAIT","ESS"));
	//if (navigator.appName.indexOf("Microsoft") != -1) {
	//	document.getElementById("review").style.width = "100%";
	//	document.getElementById("review").style.height = "100%";
	//} else {
		document.getElementById("review").style.width = document.body.clientWidth + "px";
		document.getElementById("review").style.height = (document.body.clientHeight - 32) + "px";
	//}
	urlStr = "/lawson/xhrnet/performancemanagement.html?number=" + parseInt(thisEmp.employee, 10) + "&name=" + escape(thisEmp.full_name, 1) + "&from=directreports";

	goToSub("review", urlStr);
}

function ManagerObj(manager, reports)
{
	this.manager = manager;
	if (!reports)
		this.reports = null;
	else
		this.reports = reports;
}

function drillwind(id)
{
	// Use new IDA library to call most recent version of drill service available
	var idaObj = new IDAObject(prodline.toUpperCase(), "DT");
	idaObj.out = "HTML";
	idaObj.system = "HR";
	idaObj.keynbr = "H07";
	idaObj.keys = "01="+parseInt(company,10)+"&H07="+parseInt(id,10);
	idaObj.theme = (styler && styler.showLDS) ? "9" : "8";
	idaObj.webappjsUrl = "/lawson/webappjs";

	var drillStr = IDA(idaObj);
	var drillWindow = window.open(drillStr,"DRILLAROUND","toolbar=yes,location=no,menubar=no,status=no,scrollbars=yes,width=750,height=450,resizable=yes,left="+parseInt((screen.width/2)-375,10)+",top="+parseInt((screen.height/2)-250,10))
	drillWindow.focus()
}

function DrawFrameContent(Content)
{
	var obj = self.main.document.getElementById("paneBody");
	obj.innerHTML = Content;
}

function relatedLinkIsAccessible(bkName, bkLawName)
{
   	bkName = bkName.toUpperCase();
   	bkLawName = bkLawName.toUpperCase();

	if (relatedLinks[bkLawName])
	{
		return true;
	}

   	if ((typeof(authUser) != "undefined") && authUser.OfficeObject)
   	{
		var bkmks = authUser.OfficeObject;
		var foundBkmk = false;
		var bkLen = authUser.NbrOfOfficeObj;

		var i = 0;

		while ((i < bkLen) && (!foundBkmk))
		{
			var bkmkName = bkmks[i].name.toUpperCase(); // the Lawson-assigned task
			var bkmkLawName = (bkmks[i].lawnm) ? bkmks[i].lawnm.toUpperCase() : "";	// the Lawson-assigned Lawson name

			if ((bkName == bkmkName) || (bkLawName == bkmkLawName))
			{
				// grant access to this bookmark
				relatedLinks[bkLawName] = true;
				foundBkmk = true;
			}
			i++;
		}
	}

	return foundBkmk;
}

function fitToScreen()
{
	if (typeof(window["styler"]) == "undefined" || window.styler == null)
	{
		window.stylerWnd = findStyler(true);
	}

	if (!window.stylerWnd)
	{
		return;
	}

	if (typeof(window.stylerWnd["StylerEMSS"]) == "function")
	{
		window.styler = new window.stylerWnd.StylerEMSS();
	}
	else
	{
		window.styler = window.stylerWnd.styler;
	}

	var mainFrame = document.getElementById("main");
	var profileFrame = document.getElementById("profile");
	var reviewFrame = document.getElementById("review");
	var pactionsFrame = document.getElementById("personnelactions");
	var emergencyFrame = document.getElementById("emergencycontacts");
	var winHeight = 464;
	var winWidth = 400;

	// resize the table frame to the screen dimensions
	if (document.body.clientHeight)
	{
		winHeight = document.body.clientHeight;
		winWidth = document.body.clientWidth;
	}
	else if (window.innerHeight)
	{
		winHeight = window.innerHeight;
		winWidth = window.innerWidth;
	}

	var fullContentWidth = (window.styler && window.styler.showLDS) ? (winWidth - 17) : ((navigator.appName.indexOf("Microsoft") >= 0) ? (winWidth - 12) : (winWidth - 7));

	mainFrame.style.width = winWidth + "px";
	mainFrame.style.height = (winHeight - 30) + "px";
	try
	{
		self.main.document.getElementById("paneBodyBorder").style.width = fullContentWidth + "px";
		self.main.document.getElementById("paneBodyBorder").style.height = (winHeight - 65) + "px";
	}
	catch(e)
	{}
	profileFrame.style.width = winWidth + "px";
	profileFrame.style.height = (winHeight - 30) + "px";
	try
	{
		self.profile.document.getElementById("paneBodyBorder").style.width = fullContentWidth + "px";
		self.profile.document.getElementById("paneBodyBorder").style.height = (winHeight - 65) + "px";
	}
	catch(e)
	{}
	reviewFrame.style.width = winWidth + "px";
	reviewFrame.style.height = (winHeight - 30) + "px";
	try
	{
		self.review.document.getElementById("paneBodyBorder").style.width = fullContentWidth + "px";
		self.review.document.getElementById("paneBodyBorder").style.height = (winHeight - 65) + "px";
	}
	catch(e)
	{}
	pactionsFrame.style.width = winWidth + "px";
	pactionsFrame.style.height = (winHeight - 30) + "px";
	try
	{
		self.personnelactions.document.getElementById("paneBodyBorder").style.width = fullContentWidth + "px";
		self.personnelactions.document.getElementById("paneBodyBorder").style.height = (winHeight - 65) + "px";
	}
	catch(e)
	{}
	emergencyFrame.style.width = winWidth + "px";
	emergencyFrame.style.height = (winHeight - 30) + "px";
	try
	{
		self.emergencycontacts.document.getElementById("paneBodyBorder").style.width = fullContentWidth + "px";
		self.emergencycontacts.document.getElementById("paneBodyBorder").style.height = (winHeight - 65) + "px";
	}
	catch(e)
	{}
}
</script>
</head>
<body style="overflow:hidden" onload="fitToScreen();OpenDirectReports()" onresize="fitToScreen()">
	<iframe id="header" name="header" style="visibility:hidden;position:absolute;height:32px;width:803px;left:0px;top:0px" src="/lawson/xhrnet/ui/header.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="main" name="main" style="visibility:hidden;position:absolute;top:32px;left:0px;width:803px;height:464px" marginwidth="0" marginheight="0" scrolling="no" frameborder="no" src="/lawson/xhrnet/ui/headerpane.htm"></iframe>
	<iframe id="profile" name="profile" style="visibility:hidden;position:absolute;top:32px;left:0px;width:803px;height:464px" marginwidth="0" marginheight="0" scrolling="no" frameborder="no" src="/lawson/xhrnet/dot.htm"></iframe>
	<iframe id="review" name="review" style="visibility:hidden;position:absolute;top:32px;left:0px;width:803px;height:464px" marginwidth="0" marginheight="0" scrolling="no" frameborder="no" src="/lawson/xhrnet/dot.htm"></iframe>
	<iframe id="personnelactions" name="personnelactions" style="visibility:hidden;position:absolute;top:32px;left:0px;width:803px;height:464px" marginwidth="0" marginheight="0" scrolling="no" frameborder="no" src="/lawson/xhrnet/dot.htm"></iframe>
	<iframe id="emergencycontacts" name="emergencycontacts" style="visibility:hidden;position:absolute;top:32px;left:0px;width:803px;height:464px" marginwidth="0" marginheight="0" scrolling="no" frameborder="no" src="/lawson/xhrnet/dot.htm"></iframe>
	<iframe name="jsreturn" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/dot.htm"></iframe>
	<iframe name="lawheader" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/orglawheader.htm"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@(201111) 09.00.01.06.00 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/manager.htm,v 1.15.2.47 2011/05/04 21:10:10 brentd Exp $ -->
