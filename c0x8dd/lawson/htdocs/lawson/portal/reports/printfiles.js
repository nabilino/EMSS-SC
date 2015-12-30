/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/reports/Attic/printfiles.js,v 1.1.2.22.4.39.6.1.2.10 2012/08/08 12:37:18 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
//-----------------------------------------------------------------------------
//		***************************************************************
//		*                                                             *                          
//		*                           NOTICE                            *
//		*                                                             *
//		*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//		*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//		*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//		*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//		*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//		*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//		*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//		*                                                             *
//		*   (c) COPYRIGHT 2012 INFOR.  ALL RIGHTS RESERVED.           *
//		*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//		*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//		*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//		*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//		*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//		*                                                             *
//		*************************************************************** 
//-----------------------------------------------------------------------------
var PRINTFILESJS = "reports/printfiles.js";	// filename constant for error handler

var portalWnd = null;
var portalObj = null;
var g=null;
var gReportList=null;
var oDropDown=null;
var oReportTbl = null;
var oFeedBack = null;

function GlobalObject()
{
	this.username=null;
	this.longname=null;	
	this.printManagerCall=portalWnd.JOBSRVPath+"?_TYPE=printmanager";
	this.refreshKey=null;
	this.nextKey=null;
	this.previousKey=null;
	this.pageSize="25";
	this.findKeyField=null;
	this.findKey=null;
	this.searchParameters="";
	this.searchMode = null; //NULL | FILTER | FIND 
	this.searchDS = null;
	this.lastCall = null;
	this.linkTextAry = new Array();
	this.linkTknAry = new Array();
}
//============================================================//
function init()
{
	try{
		//set portal global objects
		portalWnd=envFindObjectWindow("lawsonPortal");
		if (!portalWnd) return;

		// load the script versions
		envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

		portalObj=portalWnd.lawsonPortal;

		if (portalWnd.oPortalConfig.getRoleOptionValue("allow_printfiles","0")!= "1")
		{
			var msg = portalObj.getPhrase("NO_ACCESS_TO_PRINTFILES");
		 	portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		 	portalWnd.goHome();
		 	return;
		}

		oFeedBack = new FeedBack(window, portalWnd);
		showBusy();
		g=new GlobalObject();

		//load phrases
		//if(!portalWnd.rptPhrases) IE9 doesn't like this. Must recreate the phrases object.
			portalWnd.rptPhrases = new portalWnd.phraseObj("reports");

		//if (!portalWnd.erpPhrases) IE9 doesn't like this. Must recreate phrases object
			portalWnd.erpPhrases=new portalWnd.phraseObj("forms")

		// load the hotkeys
		portalObj.keyMgr.addHotkeySet("forms","forms",portalWnd.erpPhrases);
		portalObj.keyMgr.addHotkeySet("erpReporting","reports",portalWnd.rptPhrases);

		buildRelatedForms();
		buildPortalObjects();
		translateLabels();
		var initialParameters = getInitialParameters();
		document.body.style.visibility = "visible";

		var qString =unescape(window.location.search);
		
		if(portalWnd.getVarFromString("_PAGEKEY", qString) != "")
		{
			buildReportsTable(initialParameters,portalWnd.jobUtilTableIndex);
			portalWnd.jobUtilTableIndex = -1;
		}
		else
			buildReportsTable(initialParameters);

		showReady();

	} catch(e){reportError(e)}		
}
//============================================================//
function translateLabels()
{
	try{
	
	var labelElem = document.getElementById("lblUserName");
	var phrase = portalWnd.rptPhrases.getPhrase("lblUserName");
	portalWnd.cmnSetElementText(labelElem, phrase);
	phrase = portalObj.getPhrase("LBL_SELECT");
	labelElem.setAttribute("title",phrase);

	} catch(e){reportError(e)}		
}
//============================================================//
function buildPortalObjects()
{
	try{
	
	var title = portalObj.getPhrase("LBL_PRINT_MANAGER") + (g.username ? " - " + g.username : "");
	portalObj.setTitle(title);
	buildToolbar();

	} catch(e){reportError(e)}		
}
//============================================================//
function buildToolbar()
{
	try{
	
	portalObj.toolbar.target = window;
	portalObj.toolbar.clear();

	var text = portalWnd.rptPhrases.getPhrase("lblReportActions");
	var title = portalWnd.rptPhrases.getPhrase("lblShowReportActions");
	portalObj.toolbar.addDropdownButton("actions",text,title,showActions,
		title,showActions);
	portalObj.toolbar.createButton(portalWnd.rptPhrases.getPhrase("lblInquire"), "doInquire()", "inquire");
	portalObj.toolbar.addSeparator();
	var findNextEnable = (g.searchMode == "FIND" ? "enabled" : "disabled");
	var resetEnable = g.searchMode == null ? "disabled" : "enabled";	
	portalObj.toolbar.createButton(portalObj.getPhrase("LBL_SEARCH"), doSearch, "Search");
	portalObj.toolbar.createButton(portalObj.getPhrase("LBL_FIND_NEXT"), findNextJob, "FindNext", findNextEnable);
	portalObj.toolbar.createButton(portalObj.getPhrase("LBL_RESET"), doFindReset, "Reset", resetEnable);
	portalObj.toolbar.addSeparator();
	portalObj.toolbar.createButton(portalObj.getPhrase("LBL_PRINTABLE_VIEW"),portalWnd.portalOnPrint, "printableView", "enabled");	
	portalObj.toolbar.changeButtonTitle("printableView",portalObj.getPhrase("LBL_PRINT_THIS_PAGE"));
	
	
	//related forms drop button
	if(g.linkTextAry.length > 0)
	{
		var text=portalObj.getPhrase("LBL_RELATED_FORMS");
		var title=portalWnd.erpPhrases.getPhrase("lblShowFormTransfers");
		portalObj.toolbar.addDropdownButtonRight("links",text,title,showRelatedForms,title,showRelatedForms);
	}

	} catch(e){reportError(e)}			
}
//============================================================//
function updateToolbar()
{
	try{
	
	// no records
	if(gReportList.length==0)
	{
		portalObj.toolbar.changeButtonState("view", "DISABLED");
		portalObj.toolbar.changeButtonState("print", "DISABLED");
		portalObj.toolbar.changeButtonState("delete", "DISABLED");
		portalObj.toolbar.changeButtonState("parameters", "DISABLED");
		return;
	}

	// more than on selected record
	var oRowsAry = oReportTbl.getSelectedRows();
	if(oRowsAry.length > 1)
	{
		portalObj.toolbar.changeButtonState("delete", "ENABLED");
		portalObj.toolbar.changeButtonState("view", "DISABLED");
		portalObj.toolbar.changeButtonState("print", "DISABLED");
		portalObj.toolbar.changeButtonState("parameters", "DISABLED");
		return;
	}

	// one record is highlighted
	var job=getSelectedReport()
	portalObj.toolbar.changeButtonState("delete", job.isValidAction("delete")?"ENABLED":"DISABLED");
	portalObj.toolbar.changeButtonState("view", job.isValidAction("viewReport")?"ENABLED":"DISABLED");
	portalObj.toolbar.changeButtonState("print", job.isValidAction("printReport")?"ENABLED":"DISABLED");
	portalObj.toolbar.changeButtonState("parameters", job.isValidAction("viewParameters")?"ENABLED":"DISABLED");

	} catch(e){reportError(e)}		
}
//============================================================//
function buildRelatedForms()
{
	try{
	
	if(portalWnd.oPortalConfig.getRoleOptionValue("allow_joblist","0")== "1")
	{
		g.linkTextAry.push(portalObj.getPhrase("LBL_JOBS_REPORTS"));
		g.linkTknAry.push("JOBLIST");
	}

	if(portalWnd.oPortalConfig.getRoleOptionValue("allow_jobschedule","0")== "1")
	{
		g.linkTextAry.push(portalObj.getPhrase("LBL_JOBS_SCHEDULE"));
		g.linkTknAry.push("UNJS.2")
	}
			
	if(portalWnd.oPortalConfig.getRoleOptionValue("allow_jobdef","0")== "1")
	{
		g.linkTextAry.push(portalObj.getPhrase("LBL_JOB_DEFINITION"));
		g.linkTknAry.push("JOBDEF");
	}

	} catch(e){reportError(e)}	
}
//============================================================//
function showRelatedForms()
{
	try{
	
	var actionBtn=portalWnd.document.getElementById("LAWTBBUTTONlinks");
	var dropBtn=portalWnd.document.getElementById("LAWDROPBUTTONlinks")
	actionBtn.className="";
	dropBtn.className="";
	portalWnd.iWindow.dropObj.clearItems();
	
	var loop = g.linkTextAry.length;

	for (var i = 0; i < loop; i++)
	{
		var menuText = g.linkTextAry[i];
		var menuClick = portalWnd.iWindow.dropObj.trackMenuClick;
		var menuHref = "frames[0].doFormTransfer('" + g.linkTknAry[i] + "')";
		portalWnd.iWindow.dropObj.addItem(menuText, null, "FUNCTION", menuClick, menuHref);
	}
	
	portalWnd.iWindow.dropObj.showIframe("",actionBtn,"dropObj.portalWnd.frames[0].doFormTransfer");

	} catch(e){reportError(e)}		
}
//============================================================//
function removePortalObjects()
{
	try{
	
	portalObj.toolbar.clear();

	} catch(e){reportError(e)}		
}
//============================================================//
function getInitialParameters()
{
	try{
	
	var parameters = "";
	var qString =unescape(window.location.search);
	var login = portalWnd.getVarFromString("_LOGIN", qString);
	var jobName = portalWnd.getVarFromString("_JOBNAME", qString);
	var pageIndex = portalWnd.getVarFromString("_PAGEKEY", qString);

	var userName = login ? login : portalWnd.oUserProfile.getAttribute("lawsonusername");
	var re = /\\{2}/g
	userName = userName.replace(re, "\\");
	setUserName(userName);

	if(pageIndex)
	{
		parameters = portalWnd.jobUtilLastCall;
		portalWnd.jobUtilPageIndex = "";
		g.findKeyField = portalWnd.jobUtilFindFieldIndex;;
		g.findKey = portalWnd.jobUtilFindKeyValue;
		g.searchMode = portalWnd.jobUtilSearchMode;
		g.searchParameters="&_FINDKEYFIELD=" + g.findKeyField + "&_FINDKEY=" + g.findKey;
		var findNextEnable = g.searchMode == "FIND" ? "enabled" : "disabled";
		portalObj.toolbar.changeButtonState("FindNext", findNextEnable)
		var resetEnable = g.searchMode == null ? "disabled" : "enabled";
		portalObj.toolbar.changeButtonState("Reset",resetEnable)
		return parameters;		
	}

	if(jobName)
	{
		parameters = "&_FINDKEYFIELD=JOBNAME&_FINDKEY="+jobName;
		return parameters;
	}

	return parameters;

	} catch(e){reportError(e)}		
}
//============================================================//
function doFormTransfer(tkn)
{
	try{
	
	if (typeof(tkn) == "undefined")
		return;
		
	switch(tkn)
	{
		case "JOBDEF":	//job definition
			goJobDefinition();	
			return;	
		case "JOBLIST":	//job list
			goJobList();	
			return;					
		case "UNJS.1":	//active jobs
			goActiveJobs();
			return;		
		case "UNJS.2":	//completed jobs
			goJobSchedule();
			return;		
		case "UNJS.3":	//waiting jobs
			goWaitingJobs();
			return;
	}

	} catch(e){reportError(e)}	
}
//============================================================//
function goJobDefinition(job)
{
	try{
	
	portalWnd.switchContents(portalWnd.getGoJobDefURL(job?job.name:job));

	} catch(e){reportError(e)}		
}
//============================================================//
function goJobSchedule()
{
	try{
	
	var userName = getUserName();
	portalWnd.switchContents(portalWnd.getGoJobScheduleURL(userName));

	} catch(e){reportError(e)}		
}
//============================================================//
function goActiveJobs()
{
	try{
	
	var userName = getUserName();
	portalWnd.switchContents(portalWnd.getGoJobScheduleURL(userName,"active"));

	} catch(e){reportError(e)}		
}
//============================================================//
function goWaitingJobs()
{
	try{
	
	var userName = getUserName();
	portalWnd.switchContents(portalWnd.getGoJobScheduleURL(userName,"waiting"));

	} catch(e){reportError(e)}		
}
//============================================================//
function goJobList()
{
	try{
	
	var userName = getUserName();
	portalWnd.switchContents(portalWnd.getGoJobListURL(userName));

	} catch(e){reportError(e)}		
}
//============================================================//
function doSelect()
{
	try {
		showBusy();

		if(!portalWnd.oUserProfile.isOpenWindow("select"))
		{
			removePortalObjects();
			var title = "Drill Around" + String.fromCharCode(174);
			portalObj.setTitle(title);
		}			

		portalObj.drill.doSelect(window, "doSelectReturn", portalWnd.IDAPath + "?_OUT=XML&_TYP=SV&_KNB=@un");

	} catch(e){reportError(e)}	
}
//============================================================//
function doSelectReturn(keys)
{
	try {
		showBusy();

		if(!portalWnd.oUserProfile.isOpenWindow("select"))
			buildPortalObjects();

		var bDoInquire=false;
		if (keys && keys.childNodes)
		{
			for (var i=0; i<keys.childNodes.length; i++)
			{
				if (keys.childNodes[i].nodeType != 3 
				&& "@un" == keys.childNodes[i].getAttribute("keynbr"))
				{
					var userName = keys.childNodes[i].firstChild.nodeValue;
				}
				
				if (keys.childNodes[i].nodeType != 3
				&& "@ln" == keys.childNodes[i].getAttribute("keynbr"))
				{
					var longName = keys.childNodes[i].firstChild.nodeValue;
					setLongName(longName);
				}					
			}

			if (g.username != userName)
			{
				setUserName(userName);
				bDoInquire=true;
			}

		}
		positionInFirstField();
		showReady();

		if (bDoInquire) doInquire();

	} catch(e){reportError(e)}	
}
//============================================================//
function doInquire()
{
	try {
		showBusy();
		clearSearchOptions();
		var userName = getUserName();
		setUserName(userName);
		buildReportsTable();
		showReady();

	} catch(e){reportError(e)}	
}
//============================================================//
function doJobAction(action)
{
	try{
		
	if(!action)
		setTimeout("returnContextMenu()",10)
	else 
		setTimeout("returnContextMenu('" + action + "')",10)
	
	} catch(e){reportError(e)}		
}
//============================================================//
function doDefault(oRow)
{
	try{
	
	oRow = oRow && oRow.r ? oRow : oReportTbl.getCurrentRow();
	doView(oRow);

	} catch(e){reportError(e)}		
}
//============================================================//
function doView(oRow)
{
	try {
		var printFile = getSelectedReport(oRow);

		var type = portalWnd.getDefaultViewFormat();
		var pdl="";
		var token="";
		var name="";
		var description="";
		var filePath="";
		var jobStep="";
		var relatedReports=null;
		// NT backslashes!! make 2->1
		var re=/\\{2}/g;

		if(!printFile || !printFile.isValidAction("viewReport"))
		{
			showReady();
			return;
		}

		portalWnd.oJobPrintFiles = new portalWnd.JobPrintFilesObj();
		portalWnd.oJobPrintFiles.caller = "Reports";
		
		portalWnd.jobUtilTableIndex = oReportTbl.currentRowIndex;
		portalWnd.jobUtilPageIndex = g.refreshKey;
		portalWnd.jobUtilLastCall = g.lastCall;		
		portalWnd.jobUtilFindFieldIndex = g.findKeyField;
		portalWnd.jobUtilFindKeyValue = g.findKey;
		portalWnd.jobUtilSearchMode = g.searchMode;				
		
		portalWnd.oJobPrintFiles.viewFormat=type;
		portalWnd.oJobPrintFiles.selectedPrintFile=0;
		portalWnd.oJobPrintFiles.userName=printFile.userName.replace(re, "\\");
		portalWnd.oJobPrintFiles.jobOwner=printFile.jobUserName.replace(re, "\\");

		pdl=printFile.pdl;
		token=printFile.token;
		name=printFile.jobName;
		description=printFile.jobDescription;
		filePath=printFile.filePath + "/" + printFile.fileName;
		jobStep=printFile.jobStep;
		portalWnd.oJobPrintFiles.addPrintFile(pdl,token,name,description,filePath,jobStep);

		//GET RELATED PRINT FILES BASED UPON JOBNAME - IF JOBNAME =="" DONT GET RELATED PRINTFILE IT IS AN ONLINE JOB
		if(name)
		{
			gRelatedReportList = new portalWnd.ListObj();
			getRelatedReports("&_JOBNAME="+ name, printFile.jobUserName + "&_PRINTFILEPATH=" + printFile.filePath);

			for(var i=0;i<gRelatedReportList.length;i++)
			{
				if((printFile.filePath+"/"+printFile.fileName)!=
					(gRelatedReportList.members[i].filePath+"/"+gRelatedReportList.members[i].fileName))
				{
					pdl=gRelatedReportList.members[i].pdl;
					token=gRelatedReportList.members[i].token;
					name=gRelatedReportList.members[i].jobName;
					description=gRelatedReportList.members[i].jobDescription;
					filePath=gRelatedReportList.members[i].filePath + "/" + gRelatedReportList.members[i].fileName 
					jobStep=gRelatedReportList.members[i].jobStep;
					portalWnd.oJobPrintFiles.addPrintFile(pdl,token,name,description,filePath,jobStep);
				}
			}
		}
	
		portalWnd.switchContents(portalObj.path + "/reports/viewjobs.htm?");

	} catch(e){reportError(e)}	
}
//============================================================//
function doPrint(oRow)
{
	try {
		if (!portalObj.browser.isIE)
			showBusy();

		var printFile = getSelectedReport(oRow);
		if(!printFile || !printFile.isValidAction("printReport"))
		{
			showReady();
			return;
		}

		var docPath=printFile.filePath+"/"+printFile.fileName;

		if (!portalObj.browser.isIE)
			removePortalObjects();

		portalWnd.showRptPrint(printFile.jobName, printFile.jobUserName, printFile.token, docPath, window, "doPrintReturn");

	} catch(e){reportError(e)}	
}
function doPrintReturn()
{
	try {
		if (!portalObj.browser.isIE)
			buildPortalObjects();

		var oRow = oReportTbl.getCurrentRow();
		oReportTbl.setCurrentRow(oRow);
		showReady();

	} catch(e){reportError(e)}	
}
//============================================================//
function doDelete(oRow)
{
	try {
		showBusy();
		var oRowsAry = oReportTbl.getSelectedRows();

		if(oRowsAry.length > 0)
		{
			var loop = oRowsAry.length;

			for(var i=0; i<loop; i++)
				oRowsAry[i].shade(true);

			deleteChecked(oRowsAry);

			for(var i=0; i<loop; i++)
				oRowsAry[i].shade(false);
		}
		else
			doDeleteSelected(oRow);

		showReady();

	} catch(e){reportError(e)}	
}
function doDeleteSelected(oRow)
{
	try{
	
	var printFile = getSelectedReport(oRow);
	if (!printFile || !printFile.isValidAction("delete"))
		return;

	var msg=portalWnd.rptPhrases.getPhrase("msgOkToDeleteReport") + " " + printFile.fileName + ".";
	if (portalWnd.cmnDlg.messageBox(msg,"yesno","question",window) != "yes")
		return;

	var	printPath = printFile.filePath + "/" + printFile.fileName;
	var userName=printFile.userName;
	deleteReports(userName, printPath);

	} catch(e){reportError(e)}		
}
//============================================================//
function deleteChecked(oRowsAry)
{
	try{
	
	var userName="";
	var reportList="";
	var loop = oRowsAry.length;
	var msg = portalWnd.rptPhrases.getPhrase("msgOkToDeleteTheFollowingReports")+"\n\n";

	for (var i=0; i<loop; i++)
	{
		var listKey = oRowsAry[i].getKey();
		var printFile = gReportList.getMember(listKey);

		if(!printFile || !printFile.isValidAction("delete"))
			continue;

		msg += "\t\t\t\t - " + printFile.fileName + "\n";
		var	printPath = printFile.filePath + "/" + printFile.fileName;
		reportList += printPath + "&";
		userName = printFile.userName;
	}

	if (portalWnd.cmnDlg.messageBox(msg,"yesno","question",window) != "yes")
		return;

	deleteReports(userName, reportList);

	} catch(e){reportError(e)}		
}
//============================================================//
function deleteReports(user, reportList)
{	
	try{
	
	var api = "/cgi-lawson/xdelprint.exe?" + user + "&" + reportList;
	var oDeleteXml = portalWnd.httpRequest(api,null,null,null,false);

	var msg=portalObj.getPhrase("msgErrorInvalidResponse") + " xdelprint.exe.\n\n";
	if (portalWnd.oError.isErrorResponse(oDeleteXml,true,true,false,msg,window))
		return;

	var oDS = portalWnd.oError.getDSObject();
	var oJobNodes = oDS.getElementsByTagName("Document");
	var len = oJobNodes ? oJobNodes.length : 0;
	msg="";
	for (var i=0; i < len; i++)
		msg += oJobNodes[i].firstChild.nodeValue + "\n";

	// need to add the job identity for when you do multiple deletes
	portalWnd.cmnDlg.messageBox(msg,"ok","",window);
	doInquire();

	} catch(e){reportError(e)}		
}
//============================================================/
function buildSearchDOM()
{
	try{
	
	if(!g.searchDS)
	{
		var jobNamePhrase =portalWnd.rptPhrases.getPhrase("lblJobName");
		var parametersPhrase =portalWnd.rptPhrases.getPhrase("lblParameters");
		var fileNamePhrase =portalWnd.rptPhrases.getPhrase("lblFileName");
		var ownerPhrase =portalWnd.rptPhrases.getPhrase("lblJobOwner");
	
		var strXML = "<SEARCH>"
		strXML += "<FINDFLDS>"
		strXML += "<FINDFLD name=\"JobName\" size=\"10\" type=\"ALPHA\"><![CDATA[" + jobNamePhrase + "]]></FINDFLD>"
		strXML += "<FINDFLD name=\"Token\" size=\"10\" type=\"ALPHA\"><![CDATA[" + parametersPhrase + "]]></FINDFLD>"
		strXML += "<FINDFLD name=\"FileName\" size=\"30\" type=\"ALPHA\"><![CDATA[" + fileNamePhrase + "]]></FINDFLD>"
		strXML += "<FINDFLD name=\"JobUserName\" size=\"30\" type=\"ALPHA\"><![CDATA[" + ownerPhrase + "]]></FINDFLD>"
		strXML += "</FINDFLDS>"
		strXML += "<FIELDS id=\"drill\" tab=\"tabGenSearch\" filter=\"0\"/>"
		strXML += "<OUTPUT><![CDATA[]]>"
		strXML += "</OUTPUT>"
		strXML += "</SEARCH>"
		g.searchDS = new portalWnd.DataStorage(strXML);
	}

	return g.searchXML;

	} catch(e){reportError(e)}		
}
//============================================================//
function doSearch()
{
	try{
	
	buildSearchDOM();
	var searchNode = g.searchDS.getNodeByName("SEARCH");
	searchNode.setAttribute("filter", portalWnd.cmnGetCookie("filteroption"));

	// create object on window for drill information; mostly for Netscape
	window.nsrchObj = new Object();
	nsrchObj.portalWnd = portalWnd;
	nsrchObj.storage = g.searchDS;
	nsrchObj.url = "";
	nsrchObj.callback = null;
	nsrchObj.mode = "genlist";
	
	var strFeatures = "";
	var dlgArgs = new Array();
	dlgArgs[0] = portalObj.getPhrase("LBL_SEARCH");
	dlgArgs[1] = nsrchObj;

	if (portalObj.browser.isIE)
	{
		strFeatures = "dialogWidth:616px;dialogHeight:282px;center:yes;help:no;scroll:no;status:no;resizable:no;";
		var retObj = portalWnd.showModalDialog(portalObj.path + "/drill/drsearch.htm", dlgArgs, strFeatures);

		if (typeof(retObj) != "undefined")
			findJob();
	}
	else
	{
		nsrchObj.callback = "window.opener.findJob()";
		strFeatures = "top=255px,left=201px,width=621px,height=258px,chrome,dependent,dialog,modal,";

		// needs to be last statement in this function; uses callback on return if search takes place
		searchWnd = window.open(portalObj.path + "/drill/drsearch.htm", nsrchObj.title, strFeatures);
	}

	} catch(e){reportError(e)}		
}
//============================================================//
function clearSearchOptions()
{
	try{
	
	g.findKeyField = "JobName";
	g.findKey = "";
	g.searchParameters = "";
	g.searchMode = null;
		
	portalObj.toolbar.changeButtonState("FindNext","disabled")
	portalObj.toolbar.changeButtonState("Reset","disabled")

	} catch(e){reportError(e)}	
}
//============================================================//
function findJob()
{
	try {
		showBusy();
			
		var oCriteriaDS = new portalWnd.DataStorage(nsrchObj.storage.getDataString());
		var	bFilter = oCriteriaDS.getNodeByAttributeId("FIELDS", "id", "drill").getAttribute("filter");
		var	oNode = oCriteriaDS.getNodeByAttributeId("FIELD", "id", "0");
		g.findKeyField = oNode.getAttribute("fldname");
		g.findKey = oCriteriaDS.getElementValue("FIELD", "0");		
		g.searchMode = bFilter == "1" ? "FILTER" : "FIND";
		g.searchParameters="&_FINDKEYFIELD=" + g.findKeyField + "&_FINDKEY=" + g.findKey;

		portalObj.toolbar.changeButtonState("Reset","enabled")

		if(g.searchMode=="FILTER")
			portalObj.toolbar.changeButtonState("FindNext","disabled")
		else
			portalObj.toolbar.changeButtonState("FindNext","enabled")

		buildReportsTable(g.searchParameters);
		showReady();	
		
	} catch(e){reportError(e)}	
}
//============================================================//
function findNextJob()
{
	try {
		showBusy();
		var parameters=g.searchParameters+"&_PAGEKEY="+g.refreshKey+"&_FINDNEXT=true";
		buildReportsTable(parameters);
		showReady();

	} catch(e){reportError(e)}	
}
//============================================================//
function doFindReset()
{
	try {
		showBusy();
		clearSearchOptions();
		buildReportsTable();
		showReady();

	} catch(e){reportError(e)}	
}
//============================================================//
function pageUp()
{
	try {
		showBusy();
		var parameters="";

		if(g.searchMode=="FILTER") 
			parameters=g.searchParameters;

		if(g.previousKey != "" && g.previousKey != null)
			buildReportsTable(parameters+"&_PAGEKEY=" + g.previousKey);

		showReady();

	} catch(e){reportError(e)}	
}
//============================================================//
function pageDown()
{
	try {
		showBusy();

		var parameters="";

		if(g.searchMode=="FILTER") 
			parameters=g.searchParameters;

		if(g.nextKey != "" && g.nextKey != null)
			buildReportsTable(parameters+"&_PAGEKEY=" + g.nextKey);

		showReady();

	} catch(e){reportError(e)}	
}
//============================================================//
function updatePagingButtons()
{
	try{
	
	var pageUpBtn = document.getElementById("btnPageUp");
	var pageDnBtn = document.getElementById("btnPageDn");

	pageUpBtn.value = portalObj.getPhrase("LBL_PREVIOUS") +  " " + g.pageSize;
	pageDnBtn.value = portalObj.getPhrase("LBL_NEXT") + " " + g.pageSize;

	if(g.nextKey=="" || g.nextKey==null)
	{
		pageDnBtn.disabled = true;
		pageDnBtn.className = "anchorDisabled";
	}
	else
	{
		pageDnBtn.disabled = false;
		pageDnBtn.className="anchorActive";
	}

	if(g.previousKey=="" || g.previousKey==null)
	{
		pageUpBtn.disabled = true;
		pageUpBtn.className = "anchorDisabled";
	}
	else
	{
		pageUpBtn.disabled = false;
		pageUpBtn.className="anchorActive"
	}

	} catch(e){reportError(e)}		
}
//============================================================//
function positionInFirstField()
{
	try {
		var oElem = document.getElementById("_f2");
		oElem.select();
	} catch(e) { }
}
//============================================================//
function getReportActions()
{
	try{
	
	var retObj = new Object();
	retObj.textAry = new Array();
	retObj.actionAry = new Array();

	if(gReportList.length ==0)
		return retObj;
		
	//more than on selected record
	var oRowsAry = oReportTbl.getSelectedRows();
	if(oRowsAry.length > 1)
	{
		retObj.textAry.push(portalWnd.rptPhrases.getPhrase("lblDelete"));
		retObj.actionAry.push("delete");		
	}
	else
	{
		//one record is highlighted
		var report=getSelectedReport();

		if(report.isValidAction("viewReport"))
		{		
			retObj.textAry.push(portalWnd.rptPhrases.getPhrase("lblView"));
			retObj.actionAry.push("viewReport");
		}		
		if(report.isValidAction("printReport"))
		{
			retObj.textAry.push(portalWnd.rptPhrases.getPhrase("lblPrint"));
			retObj.actionAry.push("printReport");
		}
		if(report.isValidAction("delete"))
		{		
			retObj.textAry.push(portalWnd.rptPhrases.getPhrase("lblDelete"));
			retObj.actionAry.push("delete");
		}		
	}

	return retObj;
	
	} catch(e){reportError(e)}	
}
//============================================================//
function showActions()
{
	try{
	var oJobActions = getReportActions();
	var loop = oJobActions.textAry.length;	
	
	if(loop == 0) return;
	
	var actionBtn=portalWnd.document.getElementById("LAWTBBUTTONactions");
	portalWnd.iWindow.dropObj.clearItems();

	for (var i = 0; i < loop; i++)
	{
		var menuText = oJobActions.textAry[i];
		var menuClick=portalWnd.iWindow.dropObj.trackMenuClick
		var menuHref="portalWnd.frames[0].doJobAction('" + oJobActions.actionAry[i] + "')";
		portalWnd.iWindow.dropObj.addItem(menuText,null,"FUNCTION",menuClick,menuHref);
	}

	portalWnd.iWindow.dropObj.showIframe("",actionBtn,"dropObj.portalWnd.frames[0].doJobAction");

	} catch(e){reportError(e)}	
}
//============================================================//
function showContextMenu(evt,window, mElement)
{
	try {
		if(gReportList.length==0)
			return;

		if (typeof(mElement) == "undefined")
		{
			mElement = portalWnd.getEventElement(evt)
			if (typeof(mElement) == "undefined") return;
		}

		if (!mElement || typeof(mElement.r)=="undefined")
			return;
		else
			var oRow = oReportTbl.getRowById(mElement.r);

		if (!oRow) return;

		window.lastControl=mElement;
		oReportTbl.setCurrentRow(oRow);

		var listKey=oRow.getKey();
		var printFile=gReportList.getMember(listKey);
		if(!printFile) return;

		if (!window.oDropDown)
			window.oDropDown=new window.Dropdown()

		window.oDropDown.clearItems()

		var oRowsAry = oReportTbl.getSelectedRows();
		var loop = oRowsAry.length;

		if(loop > 1 && oRow.isChecked())
		{
			for(var i=0; i<loop; i++)
				oRowsAry[i].shade(true);

			oDropDown.addItem(portalWnd.rptPhrases.getPhrase("lblDelete"),"delete")
		}

		var oJobActions = getReportActions();
		var loop = oJobActions.textAry.length;		

		for (var i = 0; i < loop; i++)
			oDropDown.addItem(oJobActions.textAry[i], oJobActions.actionAry[i]);

		window.oDropDown.show("", mElement, "returnContextMenu")
		evt=portalWnd.getEventObject(evt);

		if(evt) 
			portalWnd.setEventCancel(evt);

	} catch(e){reportError(e)}	
}
//============================================================//
function returnContextMenu(value)
{
	try {
		var oRow = oReportTbl.getCurrentRow();
		oReportTbl.setCurrentRow(oRow);
		var oRowsAry = oReportTbl.getSelectedRows();
		var loop = oRowsAry.length;

		switch (value)
		{
			case "delete":
				if(loop > 1 && oRow.isChecked())
					doDelete();
				else
					doDelete(oRow);
				break;
			case "printReport":
				doPrint(oRow);
				break;
			case "viewReport":
				doView(oRow);
				break;
		}

		if(loop > 1 && oRow.isChecked())
		{
			for(var i=0; i<loop; i++)
				oRowsAry[i].shade(false);
		}

	} catch(e){reportError(e)}	
}
//============================================================//
function showUserContextMenu(evt,window, mElement)
{
	try {
		if (typeof(mElement) == "undefined")
		{
			mElement = portalWnd.getEventElement(evt)
			if (typeof(mElement) == "undefined") return;
		}

		if (!mElement)
			return;

		window.lastControl=mElement;

		if (!window.oDropDown)
			window.oDropDown=new window.Dropdown()

		window.oDropDown.clearItems()
		oDropDown.addItem(portalWnd.rptPhrases.getPhrase("lblSelect"), "select");

		window.oDropDown.show("", mElement, "returnUserContextMenu")
		evt=portalWnd.getEventObject(evt);

		if(evt) 
			portalWnd.setEventCancel(evt);

	} catch(e){reportError(e)}	
}
//============================================================//
function returnUserContextMenu(value)
{
	try {
		if(value == "select")
			doSelect();
		else
			window.lastControl.select();

	} catch(e){reportError(e)}	
}
//============================================================//
function buildReportsTable(parameters, rowIndex)
{
	try{
	
	parameters = parameters ? parameters : "";
	rowIndex = rowIndex ? rowIndex : null;
	oFeedBack.show();
	var re = /\\/g;
	var parameters1 = parameters.replace(re, "\\\\");	 //necessary because using setTimeout
	setTimeout("buildReportsTable1('" + parameters1 + "'," + rowIndex + ")",10)

	} catch(e){reportError(e)}		
}
function buildReportsTable1(parameters,rowIndex)
{
	try{
	
	gReportList = new portalWnd.ListObj();
	parameters = getParameters(parameters);

	if(!getPrintFileList(parameters))
	{
		oFeedBack.hide();
		return;
	}

	if(!oReportTbl)
		createReportTable();
	else
		oReportTbl.clearTable();

	for (var i=0; i<gReportList.length; i++)
	{
		var oJob = gReportList.getMember(gReportList.sortIndex[i]);
		addTableRow(oJob);
		if (oJob.jobStatus == "running")
			var jobStatus = true;
	}
	oRow = oReportTbl.runningJobs(jobStatus);
	setLongName(g.longname);
	var title = portalObj.getPhrase("LBL_PRINT_MANAGER") + " - " + g.username;
	portalObj.setTitle(title);

	if(gReportList.length > 0)
	{
		if(!rowIndex)
			var oRow = oReportTbl.getFirstRow();
		else
			var oRow = oReportTbl.getRowById(rowIndex);

		if(oRow)
			oReportTbl.setCurrentRow(oRow);
	}
	else
		positionInFirstField();

	updateToolbar();
	updatePagingButtons();
	oFeedBack.hide();
	document.getElementById("footer").style.visibility = "visible";

	} catch(e){reportError(e)}		
}
//============================================================//
function setLongName(longName)
{
	try{
	
	var oInput = document.getElementById("_f3");
	oInput.firstChild.nodeValue = longName;
	
	} catch(e){reportError(e)}	
}
//============================================================//
function setUserName(userName)
{
	try{
	
	var oInput = document.getElementById("_f2");
	oInput.value = userName;
	g.username = userName;

	} catch(e){reportError(e)}		
}
//============================================================//
function getUserName()
{
	try{
	
	var oInput = document.getElementById("_f2");
	return oInput.value;

	} catch(e){reportError(e)}		
}
//============================================================//
function getSelectedReport(oRow)
{
	try{
	
	if(!oRow)
	{
		var oRowsAry = oReportTbl.getSelectedRows();

		if(oRowsAry.length > 0)
			var oRow = oRowsAry[0];
		else
			var oRow = oReportTbl.getCurrentRow();

		if(!oRow)
			return null;
	}

	var listKey=oRow.getKey();
	return gReportList.getMember(listKey);

	} catch(e){reportError(e)}		
}
//============================================================//
function getTableWidth()
{
	try{
	
	var width = (portalObj.browser.isIE
		? document.body.offsetWidth - 45
		: window.innerWidth - 45);

	return width;

	} catch(e){reportError(e)}		
}
//============================================================//
function getTableHeight()
{
	try{
	
	var containerElement = document.getElementById("reportContainer");
	var scrHeight = portalObj.browser.isIE ? document.body.offsetHeight : window.innerHeight;
	var pixelsUsed = portalObj.contentFrame.offsetTop + containerElement.offsetTop - 10;

	return (scrHeight - pixelsUsed);

	} catch(e){reportError(e)}		
}
//============================================================//
function getParameters(parameters)
{
	try{
	
	if(typeof(parameters)=="undefined")
		parameters="";

	if(g.searchMode=="FILTER")
		parameters=parameters+"&_FILTER=true";

	var defaultParameters="&_USERNAME=" + g.username + "&_PAGESIZE=" + g.pageSize;
	return (defaultParameters + parameters);

	} catch(e){reportError(e)}		
}
//============================================================//
function createReportTable()
{
	try{
	
	var	tableParent = document.getElementById("reportTable");
	var height = getTableHeight();
	var tableWidth = getTableWidth();

	var labelAry = new Array()
	labelAry[0] = portalWnd.rptPhrases.getPhrase("lblJobOwner");
	labelAry[1] = portalWnd.rptPhrases.getPhrase("lblJobName");
	labelAry[2] = portalWnd.rptPhrases.getPhrase("lblDescription");
	labelAry[3] = portalWnd.rptPhrases.getPhrase("lblParameters");
	labelAry[4] = portalWnd.rptPhrases.getPhrase("lblFileName");
	labelAry[5] = portalWnd.rptPhrases.getPhrase("lblCreated");

	var widthAry = new Array()
	widthAry[0] = tableWidth * .15;
	widthAry[1] = tableWidth * .15;
	widthAry[2] = tableWidth * .25;
	widthAry[3] = tableWidth * .15;
	widthAry[4] = tableWidth * .15;
	widthAry[5] = tableWidth * .15;

	var labelAlignAry = new Array()
	labelAlignAry[0] = "left";
	labelAlignAry[1] = "left";
	labelAlignAry[2] = "left"
	labelAlignAry[3] = "left";
	labelAlignAry[4] = "left";
	labelAlignAry[5] = "left";

	var dataAlignAry = new Array()
	dataAlignAry[0] = "left";
	dataAlignAry[1] = "left";
	dataAlignAry[2] = "left"
	dataAlignAry[3] = "left";
	dataAlignAry[4] = "left";
	dataAlignAry[5] = "left";

	var sourceAry = new Array();

	for(var i=0; i<6; i++)
		sourceAry[i] = "<COLUMN label=\"" + labelAry[i] + "\" width=\"" + widthAry[i] + "\" labelalign=\"" + labelAlignAry[i] + "\" dataalign=\"" + dataAlignAry[i] + "\"/>";

	sourceAry.push("</COLUMNS>");
	sourceAry.push("</TABLE>");
	sourceAry.unshift("<COLUMNS>");
	sourceAry.unshift("<TABLE height=\"" + height + "\" ismultipleselect=\"true\" rowselectchange=\"updateToolbar()\">");
	sourceAry.unshift("<?xml version=\"1.0\"?>");

	var sourceString = sourceAry.join("");
	var xmlSource = portalWnd.cmnCreateXmlObjectFromString(sourceString);

	oReportTbl = new Table(document, tableParent, "oReportTbl", xmlSource);
	oReportTbl.showTitle(false);

	} catch(e){reportError(e)}		
}
//============================================================//
function addTableRow(oPrintFile)
{
	try{
	
	var dataAry = new Array();
	var totalDataAry = 6;
	dataAry[0] = portalWnd.xmlEncodeString(oPrintFile.jobUserName); //do I need to watch for \\ for window users DPB
	dataAry[1] = portalWnd.xmlEncodeString(oPrintFile.jobName);
	dataAry[2] = portalWnd.xmlEncodeString(oPrintFile.jobDescription);
	dataAry[3] = oPrintFile.token;
	dataAry[4] = portalWnd.xmlEncodeString(oPrintFile.fileName);
	dataAry[5] = oPrintFile.createDate + " " + oPrintFile.createTime;
	if (portalWnd.xmlEncodeString(oPrintFile.jobStatus) == "running")
		{
		dataAry[6] = portalWnd.xmlEncodeString(oPrintFile.jobStatus);
		totalDataAry = 7
		}

	var sourceAry = new Array();

	for(var i=0; i<totalDataAry; i++)
		sourceAry[i] = "<DATA>" + dataAry[i] + "</DATA>";

	sourceAry.push("</ROW>");
	sourceAry.unshift("<ROW key=\"" + oPrintFile.listKey + "\">");
	sourceAry.unshift("<?xml version=\"1.0\"?>");

	var sourceString = sourceAry.join("");
	var xmlSource = portalWnd.cmnCreateXmlObjectFromString(sourceString);
	// PT 176487
	var title = "Job Name: " + dataAry[1] + "\n";
	title = title + "File Name: " + dataAry[4] + "\n";
	title = title + "File Path: " + portalWnd.xmlEncodeString(oPrintFile.filePath) + "\n";
	title = title + "Submitted by: " + dataAry[0] + "\n";
	title = title + "Dist Group: " + portalWnd.xmlEncodeString(oPrintFile.dstGroup);
	var oRow = oReportTbl.addRow(xmlSource, title);
	oRow.setOnDblClickFunc(doDefault);

	} catch(e){reportError(e)}		
}
//============================================================//
function handleKeyDown(evt)
{
	try{
	
	var evtCaught = false;

	evt = portalWnd.getEventObject(evt);
	if (!evt)
		return false;

	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"erpReporting");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "erpReporting")
	{
		evtCaught=cntxtActionHandler(evt,action);

		if(evtCaught)
		{
			portalWnd.setEventCancel(evt);
			return false;
		}
	}

	action = portalObj.keyMgr.getHotkeyAction(evt,"forms");

	// hotkey defined for this keystroke
	if (action != null)
	{
		evtCaught=cntxtActionHandler(evt,action);

		if(evtCaught)
		{
			portalWnd.setEventCancel(evt);
			return false;
		}
	}

	var keyVal = (portalObj.browser.isIE) ? evt.keyCode : evt.charCode ;
	if (keyVal == 0)	// netscape only
		keyVal = evt.keyCode;

	var mElement=portalWnd.getEventElement(evt);

	switch(keyVal)
	{
		case 13:	// enter
			if(typeof(mElement.onclick) == "function")
			{
				mElement.click();
				evtCaught=true;
			}
			break;
		case 27:	// esc
			portalWnd.hideDrillFrame();
			evtCaught = true;
			break;
		case 46:	// delete
			if(typeof(mElement.r) != "undefined")
			{
				var oRow = oReportTbl.getCurrentRow();
				var bChecked = oRow.inputControl.checked;

				if(bChecked)
					doDelete();
				else
					doDelete(oRow);

				evtCaught = true;
			}
			break;
	}

	if (evtCaught)
		portalWnd.setEventCancel(evt);

	return evtCaught;

	} catch(e){reportError(e)}		
}
//============================================================//
function cntxtActionHandler(evt,action)
{
	try{
	
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"erpReporting");
		if (!action || action=="erpReporting")
			return false;
	}

	var mElement=portalWnd.getEventElement(evt);
	var bHandled=false;

	switch(action)
	{
		case "doViewActive":
			if(portalWnd.oPortalConfig.getRoleOptionValue("allow_jobschedule","0")== "1")			
				goActiveJobs();
					
			bHandled=true;
			break;
		case "doViewWaiting":
			if(portalWnd.oPortalConfig.getRoleOptionValue("allow_jobschedule","0")== "1")
				goWaitingJobs();
					
			bHandled=true;
			break;
		case "doViewComplete":
			if(portalWnd.oPortalConfig.getRoleOptionValue("allow_jobschedule","0")== "1")
				goJobSchedule();
					
			bHandled=true;
			break;
		case "doDelete":
			var oRow = oReportTbl.getCurrentRow();
			var bChecked = oRow.inputControl.checked;

			if(bChecked)
				doDelete();
			else
				doDelete(oRow);

			bHandled=true
			break;
		case "doPrev":
 			pageUp();
			bHandled=true;
			break;
		case "doNext":
			pageDown();
			bHandled=true;
			break;
		case "doCancel":
			portalWnd.hideDrillFrame();
			bHandled=true;
			break;
		case "openNewWindow":
			if (!portalObj.drill.mode)
			{		
				var url = "?_URL=reports/printfiles.htm?_LOGIN=" + getUserName(); 

				if (portalWnd.oPortalConfig.isPortalLessMode())
					url+="&RUNASTOP=0";
									
				portalWnd.newPortalWindow(url);
			}
			bHandled=true;			
			break;
		case "posInFirstField":
			positionInFirstField();
			bHandled=true;
			break;
		case "doContextMenu":
			if(mElement.id == "_f2")
				showUserContextMenu(evt,window, mElement);
			else
				showContextMenu(evt,window);

			bHandled=true;
			break;
		case "doFuncInq":
			doInquire();
			bHandled=true;
			break;
		case "doOpenField":
			if(mElement.id == "_f2")
			{
				doSelect();
				bHandled=true
			}

			if(typeof(mElement.onclick) == "function")
			{
				mElement.click();
				bHandled=true;
			}
			break;
	}

	return (bHandled);

	} catch(e){reportError(e)}		
}
//============================================================//
function getRelatedReports(parameters, userName)
{
	try{
	
	var defaultParameters="&_USERNAME=" + userName;
	var reportsNode=null;
	var errorNode=null;
	var printManagerCall=g.printManagerCall + defaultParameters + parameters + "&_NOCACHE=" + new Date().getTime();

	var printMgrXml=portalWnd.httpRequest(printManagerCall,null,null,null,false);

	var msg=portalObj.getPhrase("msgErrorInvalidResponse") + "\n" + printManagerCall;
	if (portalWnd.oError.isErrorResponse(printMgrXml,true,true,false,msg,window))
		return;

	var oDS = portalWnd.oError.getDSObject();
	var oReportNodes = oDS.getElementsByTagName("REPORT");
	var len = oReportNodes.length;

	for (var i=0; i < len; i++)
		parseRelatedReports(oReportNodes[i]);

	} catch(e){reportError(e)}			
}
function parseRelatedReports(node)
{
	try{
	
	var fileName=node.getAttribute("FILENAME");
	var filePath=node.getAttribute("FILEPATH");
	var token=node.getAttribute("TOKEN");
	var pdl=node.getAttribute("PRODUCTLINE");
	var userName=node.getAttribute("USERNAME");
	var createDate=node.getAttribute("CREATEDATE");
	var createTime=node.getAttribute("CREATETIME");
	var submitUser=node.getAttribute("SUBMITUSER");
	var jobUserName=node.getAttribute("JOBUSERNAME");
	var jobName=node.getAttribute("JOBNAME");
	var jobDescription=node.getAttribute("JOBDESCRIPTION");
	var dstGroup=node.getAttribute("DSTGROUP");
	var jobStep=node.getAttribute("JOBSTEP");

	var myPrintFile=new PrintFile(fileName,filePath,token,pdl,userName,createDate,createTime,submitUser,jobUserName,jobName,jobDescription,dstGroup,jobStep);
	gRelatedReportList.addMember(myPrintFile);

	} catch(e){reportError(e)}		
}
function getPrintFileList(parameters)
{
	try{
	
	var reportsNode=null;
	var navigationNode=null;
	var errorNode=null;
	var messageNode=null;
	var printManagerCall=g.printManagerCall + parameters + "&_NOCACHE=" + new Date().getTime();
	g.lastCall = parameters;
	
	var printMgrXml=portalWnd.httpRequest(printManagerCall,null,null,null,false);

	var msg=portalObj.getPhrase("msgErrorInvalidResponse") + "\n" + printManagerCall;
	if (portalWnd.oError.isErrorResponse(printMgrXml,true,true,false,msg,window))
		return false;

	var oDS = portalWnd.oError.getDSObject();
	g.longname = !oDS.getRootNode().getAttribute("longName") ? "" : oDS.getRootNode().getAttribute("longName");
	var oReportNodes = oDS.getElementsByTagName("REPORT");
	
	var len = oReportNodes.length;

	for (var i=0; i < len; i++)
		parsePrintFileList(oReportNodes[i]);

	g.previousKey="";
	g.refreshKey="";
	g.nextKey="";
	var oNavigationNode = oDS.getNodeByName("NAVIGATION");
	if (oNavigationNode)
	{
		g.previousKey=oNavigationNode.getAttribute("PREVIOUSCALL");
		g.refreshKey=oNavigationNode.getAttribute("REFRESHCALL");
		g.nextKey=oNavigationNode.getAttribute("NEXTCALL");
	}

	var oMessageNode = oDS.getNodeByName("MESSAGE");
	if (oMessageNode)
	{
		var statusBarMsg = oMessageNode.firstChild.nodeValue;
		setTimeout("portalObj.setMessage(\""+statusBarMsg+"\")",10)
	}
	return true;

	} catch(e){reportError(e)}		
}

function parsePrintFileList(node)
{
	try
	{	
		var jobStatus=node.getAttribute("JOBSTATUS");

		if ( jobStatus != "running" )
		{		
			var fileName=node.getAttribute("FILENAME");
			var filePath=node.getAttribute("FILEPATH");
			var token=node.getAttribute("TOKEN");
			var pdl=node.getAttribute("PRODUCTLINE");
			var userName=node.getAttribute("USERNAME");
			var createDate=node.getAttribute("CREATEDATE");
			var createTime=node.getAttribute("CREATETIME");
			var submitUser=node.getAttribute("SUBMITUSER");
			var jobUserName=node.getAttribute("JOBUSERNAME");
			var jobName=node.getAttribute("JOBNAME");
			var jobDescription=node.getAttribute("JOBDESCRIPTION");
			var dstGroup=node.getAttribute("DSTGROUP");
			var jobStep=node.getAttribute("JOBSTEP");

			var myPrintFile=new PrintFile(fileName,filePath,token,pdl,userName,createDate,createTime,submitUser,jobUserName,jobName,jobDescription,dstGroup,jobStep,jobStatus);
			gReportList.addMember(myPrintFile);
		}
	} 
	catch(e)
	{
		reportError(e);
	}		
}

//============================================================//
function printFileResize()
{
	try {
		if (oFeedBack && typeof(oFeedBack.resize) == "function")
			oFeedBack.resize();

		if(!oReportTbl) return;

		var height = getTableHeight();
		oReportTbl.setHeight(height);

		var tableWidth = getTableWidth();

		var widthAry = new Array()
		widthAry[0] = tableWidth * .15;
		widthAry[1] = tableWidth * .15;
		widthAry[2] = tableWidth * .25;
		widthAry[3] = tableWidth * .15;
		widthAry[4] = tableWidth * .15;
		widthAry[5] = tableWidth * .15;

		for(var i=0; i<6; i++)
		{
			var oCol = oReportTbl.getColumnById(i);
			oCol.setWidth(widthAry[i]);
		}

	} catch(e){reportError(e)}	
}
//============================================================//
function printFileMouseOver(btn)
{
	try {
		if (btn.className == "anchorActive")
			btn.className = "anchorHover";
	} catch(e) { }
}
//============================================================//
function printFileMouseOut(btn)
{
	try {
		if (btn.className == "anchorHover")
			btn.className="anchorActive";
	} catch(e) { }
}
//============================================================//
function printFileBlur(mElement)
{
	try {
		if(mElement.className == "textBoxHighLight" || mElement.id == "_f2")
			mElement.className = "textbox";
		else
			mElement.className = "anchorActive";
	} catch(e) { }
}
//============================================================//
function printFileFocus(mElement)
{
	try {
		if(mElement.className == "textbox" || mElement.id == "_f2")
			mElement.className = "textBoxHighLight";
		else
			mElement.className = "anchorFocus";
	} catch(e) { }
}
//============================================================//
function showBusy()
{
	portalObj.setMessage(portalObj.getPhrase("PROCESSING"));
	document.body.style.cursor = "wait";
}
//============================================================//
function showReady()
{
	document.body.style.cursor = "auto";
	portalObj.setMessage(portalObj.getPhrase("AGSREADY"));
}
//============================================================//
function unloadFunc()
{
	try {
		portalWnd.clearCallBackPrms();
		if (typeof(portalWnd.formUnload) == "function")
			portalWnd.formUnload();

		portalWnd = null;
		portalObj = null;
		g=null;
		gReportList=null;
		oDropDown=null;
		oReportTbl = null;

	} catch(e){reportError(e)}	
}
// PRINTFILE OBJECT ===========================================//
function PrintFile(fileName,filePath,token,pdl,userName,createDate,createTime,submitUser,jobUserName,jobName,jobDescription,dstGroup,jobStep,jobStatus)
{
	try{
	
	this.fileName=fileName;
	this.filePath=filePath;
	this.token=token;
	this.pdl=pdl;
	this.userName=userName;
	this.submitUser=submitUser;
	this.jobUserName=jobUserName;
	this.jobName=jobName;
	this.jobDescription=jobDescription;
	this.dstGroup=dstGroup;
	this.jobStep=jobStep;
	this.jobStatus=jobStatus;

	if(createDate=="00000000")
	{
		this.createDate = ""
		this.createTime = ""
	}
	else
	{
		this.createDate = portalWnd.edSetUserDateFormat(portalWnd.edGetDateTimeObjectFromLawsonDate(createDate));
		this.createTime = portalWnd.edFormatTime(createTime, 6);
	}

	//DERIVED ATTRIBUTES
	this.view="print";
	this.validActions = this.setValidActions();

	} catch(e){reportError(e)}		
}
PrintFile.prototype.setValidActions=function()
{
	try{
	
	var actionAry = new Array();
	actionAry["viewReport"]=true;
	actionAry["printReport"]=true;
	actionAry["delete"]=true;

	return actionAry;

	} catch(e){reportError(e)}		
}
PrintFile.prototype.isValidAction=function(action)
{
	try{
	
	return this.validActions[action];

	} catch(e){reportError(e)}		
}
function cntxtGetPrintContent()
{
	try{
	
	var elem = document.createElement("body");
	var sourceHTML = document.getElementById("reportContainer").innerHTML;
	elem.innerHTML = sourceHTML;

	//hide non-printable items
	var nonPrintableElements = new Array()
	nonPrintableElements["titleBar"]="titleBar";
	nonPrintableElements["btnPageUp"]="btnPageUp";
	nonPrintableElements["btnPageDn"]="btnPageDn";
		
		
	var elemAry = elem.getElementsByTagName("*");	
	var loop = elemAry.length;
	
	for(var i = 0; i  < loop; i ++)
	{
		var elem1 = elemAry[i];
		//hide non-printable elements
		if(nonPrintableElements[elem1.id])
		{
			elem1.style.visibility = "hidden";
			elem1.style.display = "none";
		}
			
		//do not allow input			
		elem1.readOnly = true;
		//disable events
		elem1.onhelp = null;
		elem1.onclick = null;
		elem1.ondblclick = null;
		elem1.oncontextmenu = null;
		elem1.onkeydown = null;
		elem1.onkeyup = null;
		elem1.onkeypress = null;
		elem1.onmouseout = null;
		elem1.onmouseover = null;
		elem1.onmousemove = null;
		elem1.onmousedown = null;
		elem1.onmouseup = null;
		elem1.onfocus = null;
		elem1.onblur = null;
	}

	var content = elem.document.getElementById("oReportTbl_content");
	content.style.overflow = "visible";

	
	var printHTML = elem.innerHTML;
	elem = null;
	return printHTML;

	} catch(e){reportError(e)}		
}
//============================================================//
function reportError(error)
{
	try{
		showReady();
		var strFunction = reportError.caller.toString();
		var i = (strFunction.indexOf("("));
		var funcName = strFunction.substr(0,i);
		funcName = funcName.replace("function ","");
		portalWnd.cmnErrorHandler(error,window,PRINTFILESJS,"",funcName);		
	}catch(e){}
}
