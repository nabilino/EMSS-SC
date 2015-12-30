/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/reports/joblist.js,v 1.48.2.39.4.38.6.1.2.6 2012/08/08 12:37:19 jomeli Exp $ */
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

var JOBLISTJS="reports/joblist.js"		// filename constant for error handler
var portalWnd = null;
var portalObj = null;
var g=null;
var gJobList=null;
var oDropDown=null;
var oJobListTbl = null;
var oFeedBack = null;

function GlobalObject()
{
	this.username=null;
	this.longname=null;
	this.jobListCall=portalWnd.JOBSRVPath+"?_TYPE=joblist";
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

		if (portalWnd.oPortalConfig.getRoleOptionValue("allow_joblist","0")!= "1")
		{
			var msg = portalObj.getPhrase("NO_ACCESS_TO_JOBLIST");
		 	portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		 	portalWnd.goHome();
		 	return;
		}
		oFeedBack = new FeedBack(window, portalWnd);
		showBusy();
		g=new GlobalObject();

		//load phrases
		//if(!portalWnd.rptPhrases)IE9 doesn't like this. Must recreate phrases object.
			portalWnd.rptPhrases = new portalWnd.phraseObj("reports");

		//if (!portalWnd.erpPhrases) IE9 doesn't like this. Must recreate phrases object
			portalWnd.erpPhrases=new portalWnd.phraseObj("forms")

		// load the hotkeys
		portalObj.keyMgr.addHotkeySet("forms","forms",portalWnd.erpPhrases);
		portalObj.keyMgr.addHotkeySet("erpReporting","reports",portalWnd.rptPhrases);
		
		buildRelatedForms()
		buildPortalObjects();
		translateLabels();
		var initialParameters = getInitialParameters();
		document.body.style.visibility = "visible";

		var qString =unescape(window.location.search);
		
		if(portalWnd.getVarFromString("_PAGEKEY", qString) != "")
		{
			buildJobsTable(initialParameters,portalWnd.jobUtilTableIndex);
			portalWnd.jobUtilTableIndex = -1;
		}
		else
			buildJobsTable(initialParameters);

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
	labelElem = document.getElementById("selBtn_f2");
	phrase = portalObj.getPhrase("LBL_SELECT");
	labelElem.setAttribute("title",phrase);
	
	} catch(e){reportError(e)}
}
//============================================================//
function buildPortalObjects()
{
	try{
	
	var title = portalObj.getPhrase("LBL_JOBS_REPORTS") + (g.username ? " - " + g.username : "");
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

	var text = portalWnd.rptPhrases.getPhrase("lblJobActions");
	var title = portalWnd.rptPhrases.getPhrase("lblShowJobActions");
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
		var text = portalObj.getPhrase("LBL_RELATED_FORMS");
		var title = portalWnd.erpPhrases.getPhrase("lblShowFormTransfers");
		portalObj.toolbar.addDropdownButtonRight("links",text,title,showRelatedForms,
			title,showRelatedForms);
	}
	
	} catch(e){reportError(e)}
}
//============================================================//
function updateToolbar()
{
	try{
	
	//no records
	if(gJobList.length==0)
	{
		portalObj.toolbar.changeButtonState("delete", "DISABLED");
		portalObj.toolbar.changeButtonState("submit", "DISABLED");
		portalObj.toolbar.changeButtonState("logFile", "DISABLED");
		portalObj.toolbar.changeButtonState("parameters", "DISABLED");
		portalObj.toolbar.changeButtonState("reports", "DISABLED");
		return;
	}

	//more than on selected record
	var oRowsAry = oJobListTbl.getSelectedRows();
	if(oRowsAry.length > 1)
	{
		portalObj.toolbar.changeButtonState("delete", "ENABLED");
		portalObj.toolbar.changeButtonState("submit", "DISABLED");
		portalObj.toolbar.changeButtonState("logFile", "DISABLED");
		portalObj.toolbar.changeButtonState("parameters", "DISABLED");
		portalObj.toolbar.changeButtonState("reports", "DISABLED");
		return;
	}

	//one record is highlighted
	var job=getSelectedJob()
	portalObj.toolbar.changeButtonState("delete", job.isValidAction("deleteJob")?"ENABLED":"DISABLED");
	portalObj.toolbar.changeButtonState("submit", job.isValidAction("submitJob")?"ENABLED":"DISABLED");
	portalObj.toolbar.changeButtonState("logFile", job.isValidAction("viewLog")?"ENABLED":"DISABLED");
	portalObj.toolbar.changeButtonState("parameters", job.isValidAction("gotoParam")?"ENABLED":"DISABLED");
	portalObj.toolbar.changeButtonState("reports", job.isValidAction("viewReport")?"ENABLED":"DISABLED");
	
	} catch(e){reportError(e)}	
}
//============================================================//
function buildRelatedForms()
{
	try{
	
	if(portalWnd.oPortalConfig.getRoleOptionValue("allow_jobschedule","0")== "1")
	{
		g.linkTextAry.push(portalObj.getPhrase("LBL_JOBS_SCHEDULE"));
		g.linkTknAry.push("UNJS.2");
	}

	if(portalWnd.oPortalConfig.getRoleOptionValue("allow_printfiles","0")== "1")
	{
		g.linkTextAry.push(portalObj.getPhrase("LBL_PRINT_MANAGER"));
		g.linkTknAry.push("UNPM.1")
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

	var userName = (login
		? login : portalWnd.oUserProfile.getAttribute("lawsonusername"));
	var re = /\\{2}/g
	userName = userName.replace(re, "\\");
	setUserName(userName);

	if (pageIndex)
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

	if (jobName)
		parameters = "&_FINDKEYFIELD=JOBNAME&_FINDKEY="+jobName;

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
		case "UNJS.1":	//active jobs
			goActiveJobs();
			return;		
		case "UNJS.2":	//completed jobs
			goJobSchedule();
			return;		
		case "UNJS.3":	//waiting jobs
			goWaitingJobs();
			return;
		case "UNPM.1":	//print manager
			goPrintFiles();
			return;
	}

	} catch(e){reportError(e)}
}
//============================================================//
function goJobDefinition(job)
{
	try{
	
	if (!job)
		portalWnd.switchContents(portalWnd.getGoJobDefURL(job?job.name:job));
	else
		portalWnd.switchContents(portalWnd.getGoJobDefURL(job?job.name:job) + "&" + job.userName);
	
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
function goPrintFiles()
{
	try{
	
	var userName = getUserName();
	portalWnd.switchContents(portalWnd.getGoPrintFilesURL(userName));
	
	} catch(e){reportError(e)}	
}
//============================================================//
function doSelect()
{
	try {
		showBusy();

		if (!portalWnd.oUserProfile.isOpenWindow("select"))
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
	try{
		showBusy();
		clearSearchOptions();
		var userName = getUserName();
		setUserName(userName);
		buildJobsTable();
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
	
	oRow = oRow && oRow.r ? oRow : oJobListTbl.getCurrentRow();
	doSubmit(oRow);
	
	} catch(e){reportError(e)}
}
//============================================================//
function doSubmit(oRow)
{
	try {
		if (!portalObj.browser.isIE)
			showBusy();

		var job = getSelectedJob(oRow);
		// NT backslashes!! make 2->1
		var re=/\\{2}/g;
								
		if(!job || !job.isValidAction("submitJob"))
		{
			showReady();
			return;
		}

		if (!portalObj.browser.isIE)
			removePortalObjects();

		portalWnd.showJobSubmit(job.name, job.userName.replace(re, "\\"), window, "doSubmitReturn");

	} catch(e){reportError(e)}
}
//============================================================//
function doSubmitReturn()
{
	try {
		if (!portalObj.browser.isIE)
			buildPortalObjects();

		var oRow = oJobListTbl.getCurrentRow();
		oJobListTbl.setCurrentRow(oRow);
		showReady();

	} catch(e){reportError(e)}
}
//============================================================//
function doDelete(oRow)
{
	try {
		showBusy();

		var oRowsAry = oJobListTbl.getSelectedRows();
		if (oRowsAry && oRowsAry.length > 0 && !oRow)
		{
			var len = oRowsAry.length;
			for (var i=0; i < len; i++)
				oRowsAry[i].shade(true);

			deleteChecked(oRowsAry);

			for (var i=0; i < len; i++)
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
	
	var job = getSelectedJob(oRow);
	if (!job || !job.isValidAction("deleteJob"))
		return false;

	var msg=portalWnd.rptPhrases.getPhrase("msgOkToDeleteJob") + " " + job.name + "?";
	if (portalWnd.cmnDlg.messageBox(msg,"yesno","question",window) != "yes")
		return true;

	deleteJobs(job.userName, job.name);
	
	} catch(e){reportError(e)}	
}
//============================================================//
function deleteChecked(oRowsAry)
{
	try{
	
	var joblist="";
	var loop = oRowsAry.length;
	var msg = portalWnd.rptPhrases.getPhrase("msgOkToDeleteTheFollowingJobs")+"\n\n";

	for (var i=0; i<loop; i++)
	{
		var listKey = oRowsAry[i].getKey();
		var job = gJobList.getMember(listKey);

		if(!job || !job.isValidAction("deleteJob"))
		{
			msg = portalWnd.rptPhrases.getPhrase("msgUnableToDelete") + " ";
			msg += portalWnd.rptPhrases.getPhrase("lblJob") + " " + job.name + ".";

			portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
			return true;
		}

		msg += "\t\t\t\t - " + job.name + "\n";
		joblist += job.name + "&";
	}

	if (portalWnd.cmnDlg.messageBox(msg,"yesno","question",window) != "yes")
		return true;

	var jobUser=job.userName;
	deleteJobs(jobUser, joblist);
	
	} catch(e){reportError(e)}	
}
//============================================================//
function deleteJobs(jobUser, joblist)
{
	try {
		var api = "/cgi-lawson/xdeljob.exe?" + jobUser + "&" + joblist;
		var oDeleteXml = portalWnd.httpRequest(api,null,null,null,false);

		var msg=portalObj.getPhrase("msgErrorInvalidResponse") + " xdeljob.exe.\n\n";
		if (portalWnd.oError.isErrorResponse(oDeleteXml,true,true,false,msg,window))
			return;

		var oDS = portalWnd.oError.getDSObject();
		var oJobNodes = oDS.getElementsByTagName("Job");

		var len = oJobNodes ? oJobNodes.length : 0;
		msg="";
		for (var i=0; i < len; i++)
			msg += oJobNodes[i].firstChild.nodeValue + "\n";

		portalWnd.cmnDlg.messageBox(msg,"ok","",window);
		doInquire();

	} catch(e){reportError(e)}
}
//============================================================//
function doParameters(oRow)
{
	try {
		showBusy();

		var job = getSelectedJob(oRow);
		if (!job || !job.isValidAction("gotoParam"))
		{
			showReady();
			return;
		}

		if (job.isMultiStep == 1)
		{
			goJobDefinition(job);
			return;
		}

		portalWnd.jobUtilTableIndex = oJobListTbl.currentRowIndex;
		portalWnd.jobUtilPageIndex = g.refreshKey;
		portalWnd.jobUtilLastCall = g.lastCall;		
		portalWnd.jobUtilFindFieldIndex = g.findKeyField;
		portalWnd.jobUtilFindKeyValue = g.findKey;
		portalWnd.jobUtilSearchMode = g.searchMode;	
		var userName = g.username.replace(/\\/g, "\\\\"); //window DOMAIN\USER issue			
		var hybridHK = "_JOBPARAM~jobList~" + userName + "~" + job.name + "~" + 0;
		portalWnd.formTransfer(job.token, job.pdl, null, hybridHK);

	} catch(e){reportError(e)}
}
//============================================================//
function doLogFile(oRow)
{
	try {
		showBusy();

		var job = getSelectedJob(oRow);
		if (!job || !job.isValidAction("viewLog"))
		{
			showReady();
			return;
		}

		removePortalObjects();
		portalWnd.useDrillFrame(portalObj.path + "/reports/viewlog.htm?" +
			escape(job.name) + "&" + escape(job.jobNumber), window, "doLogFileReturn");

	} catch(e){reportError(e)}
}
//============================================================//
function doLogFileReturn()
{
	try {
		showBusy();
		buildPortalObjects();
		var oRow = oJobListTbl.getCurrentRow();
		oJobListTbl.setCurrentRow(oRow);
		showReady();

	} catch(e){reportError(e)}
}
//============================================================//
function doRelatedReports(oRow,printFile)
{
	try {
		showBusy();

		var job = getSelectedJob(oRow);

		var viewFormat=portalWnd.getDefaultViewFormat();

		if(!job || !job.isValidAction("viewReport"))
		{
			showReady();
			return;
		}

		portalWnd.oJobPrintFiles = new portalWnd.JobPrintFilesObj();
		portalWnd.oJobPrintFiles.caller = "Jobs";
		portalWnd.jobUtilTableIndex = oJobListTbl.currentRowIndex;
		portalWnd.jobUtilPageIndex = g.refreshKey;
		portalWnd.jobUtilLastCall = g.lastCall;		
		portalWnd.jobUtilFindFieldIndex = g.findKeyField;
		portalWnd.jobUtilFindKeyValue = g.findKey;
		portalWnd.jobUtilSearchMode = g.searchMode;			
		portalWnd.oJobPrintFiles.viewFormat=viewFormat;
		portalWnd.oJobPrintFiles.selectedPrintFile=0;
		portalWnd.oJobPrintFiles.userName=job.userName;
		portalWnd.oJobPrintFiles.jobOwner=job.userName;

		for(var i=0;i<job.prtFiles.length;i++)
		{
			if(typeof(printFile)!="undefined"
			  && printFile == job.prtFiles[i].filePath + "/" + job.prtFiles[i].fileName)
			 	portalWnd.oJobPrintFiles.selectedPrintFile=i;

			var pdl=job.pdl;
			var token=job.prtFiles[i].token;
			var name=job.name;
			var description=job.description;
			var filePath=job.prtFiles[i].filePath+"/"+job.prtFiles[i].fileName;
			var jobStep=job.prtFiles[i].jobStep;
			portalWnd.oJobPrintFiles.addPrintFile(pdl,token,name,description,filePath,jobStep);
		}

		portalWnd.switchContents(portalObj.path + "/reports/viewjobs.htm?");

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
	
		var strXML = "<SEARCH>"
		strXML += "<FINDFLDS>"
		strXML += "<FINDFLD name=\"JobName\" size=\"10\" type=\"ALPHA\"><![CDATA[" + jobNamePhrase + "]]></FINDFLD>"
		strXML += "<FINDFLD name=\"Token\" size=\"10\" type=\"ALPHA\"><![CDATA[" + parametersPhrase + "]]></FINDFLD>"
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
		
//		if (typeof(blnFindNext) == "undefined")
//			blnFindNext = false;		
			
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

		buildJobsTable(g.searchParameters);
		showReady();

	} catch(e){reportError(e)}
}
//============================================================//
function findNextJob()
{
	try {
		showBusy();
		var parameters=g.searchParameters+"&_PAGEKEY="+g.refreshKey+"&_FINDNEXT=true";
		buildJobsTable(parameters);
		showReady();

	} catch(e){reportError(e)}
}
//============================================================//
function doFindReset()
{
	try {
		showBusy();
		clearSearchOptions();
		buildJobsTable();
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
			buildJobsTable(parameters+"&_PAGEKEY=" + g.previousKey);

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
			buildJobsTable(parameters+"&_PAGEKEY=" + g.nextKey);

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
	} catch(e){reportError(e)}
}
//============================================================//
function getJobActions()
{
	try{
	
	var retObj = new Object();
	retObj.textAry = new Array();
	retObj.actionAry = new Array();

	if(gJobList.length ==0)
		return retObj;
		
	//more than on selected record
	var oRowsAry = oJobListTbl.getSelectedRows();
	if(oRowsAry.length > 1)
	{
		retObj.textAry.push(portalWnd.rptPhrases.getPhrase("lblDelete"));
		retObj.actionAry.push("deleteJob");		
	}
	else
	{
		//one record is highlighted
		var job=getSelectedJob();
		
		if(job.isValidAction("deleteJob"))
		{
			retObj.textAry.push(portalWnd.rptPhrases.getPhrase("lblDelete"));
			retObj.actionAry.push("deleteJob");
		}
		
		if(job.isValidAction("submitJob"))
		{		
			retObj.textAry.push(portalWnd.rptPhrases.getPhrase("lblSubmit"));
			retObj.actionAry.push("submitJob");
		}
		if(job.isValidAction("gotoParam"))
		{		
			retObj.textAry.push(portalWnd.rptPhrases.getPhrase("lblViewParameters"));
			retObj.actionAry.push("gotoParam");
		}
		if(job.isValidAction("viewLog"))
		{		
			retObj.textAry.push(portalWnd.rptPhrases.getPhrase("lblLog"));
			retObj.actionAry.push("viewLog");
		}
		if(job.isValidAction("viewReport"))
		{
			for(var i=0;i<job.prtFiles.length;i++)
			{
				retObj.textAry.push(portalWnd.rptPhrases.getPhrase("lblView")+" "+ job.prtFiles[i].fileName + " - " + portalWnd.rptPhrases.getPhrase("lblStep") + " " + job.prtFiles[i].jobStep);
				retObj.actionAry.push(job.prtFiles[i].filePath + "/" + job.prtFiles[i].fileName);			
			}
		}
	}

	return retObj;
	
	} catch(e){reportError(e)}
}
//============================================================//
function showActions()
{
	try{
	var oJobActions = getJobActions();
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
		if(gJobList.length==0)
			return;

		if (typeof(mElement) == "undefined")
		{
			mElement = portalWnd.getEventElement(evt)
			if (typeof(mElement) == "undefined") return;
		}

		if (!mElement || typeof(mElement.r)=="undefined")
			return;
		else
			var oRow = oJobListTbl.getRowById(mElement.r);

		if (!oRow)
			return;

		window.lastControl=mElement;
		oJobListTbl.setCurrentRow(oRow);

		var listKey=oRow.getKey();
		var job=gJobList.getMember(listKey);

		if(!job)
			return;

		if (!window.oDropDown)
			window.oDropDown=new window.Dropdown();

		window.oDropDown.clearItems()

		var oRowsAry = oJobListTbl.getSelectedRows();
		var loop = oRowsAry.length;

		if(loop > 1 && oRow.isChecked())
		{
			for(var i=0; i<loop; i++)
				oRowsAry[i].shade(true);
		}

		var oJobActions = getJobActions();
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
		var oRow = oJobListTbl.getCurrentRow();
		oJobListTbl.setCurrentRow(oRow);
		var oRowsAry = oJobListTbl.getSelectedRows();
		var loop = oRowsAry.length;

		switch (value)
		{
			case "viewLog":
				doLogFile(oRow);
				break;
			case "gotoParam":
				doParameters(oRow);
				break;
			case "submitJob":
				doSubmit(oRow);
				break;
			case "deleteJob":
				if(loop > 1 && oRow.isChecked())
					doDelete();
				else
					doDelete(oRow);
				break;
			default:
				if(value)
					doRelatedReports(oRow,value);
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
		if (!mElement) return;
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
		if (value == "select")
			doSelect();
		else
			window.lastControl.select();

	} catch(e){reportError(e)}
}
//============================================================//
function buildJobsTable(parameters, rowIndex)
{
	try{
	parameters = parameters ? parameters : "";
	rowIndex = rowIndex ? rowIndex : null;
	oFeedBack.show();
	var re = /\\/g;
	var parameters1 = parameters.replace(re, "\\\\");	 //necessary because using setTimeout
	setTimeout("buildJobsTable1('" + parameters1 + "'," + rowIndex + ")",10)
	
	} catch(e){reportError(e)}
}
function buildJobsTable1(parameters, rowIndex)
{
	try{
	
	gJobList = new portalWnd.ListObj();
	parameters = getParameters(parameters);

	if(!getJobList(parameters))
	{
		oFeedBack.hide();
		return;
	}		

	if(!oJobListTbl)
		createJobListTable();
	else
		oJobListTbl.clearTable();

	for (var i=0; i<gJobList.length; i++)
	{
		var oJob = gJobList.getMember(gJobList.sortIndex[i]);
		addTableRow(oJob);
	}

	setLongName(g.longname);
	var title = portalObj.getPhrase("LBL_JOBS_REPORTS") + " - " + g.username;
	portalObj.setTitle(title);

	if(gJobList.length > 0)
	{
		if(!rowIndex)
			var oRow = oJobListTbl.getFirstRow();
		else
			var oRow = oJobListTbl.getRowById(rowIndex);

		if(oRow)
			oJobListTbl.setCurrentRow(oRow);
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
function setUserName(userName)
{
	try{
	
	var oInput = document.getElementById("_f2");
	oInput.value = userName;
	g.username = userName;
	
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
function getUserName()
{
	try{
	
	var oInput = document.getElementById("_f2");
	return oInput.value;
	
	} catch(e){reportError(e)}	
}
//============================================================//
function getSelectedJob(oRow)
{
	try{
	
	if(!oRow)
	{
		var oRowsAry = oJobListTbl.getSelectedRows();

		if(oRowsAry.length > 0)
			var oRow = oRowsAry[0];
		else
			var oRow = oJobListTbl.getCurrentRow();

		if(!oRow)
			return null;
	}

	var listKey=oRow.getKey();
	return gJobList.getMember(listKey);
	
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
	
	var containerElement = document.getElementById("joblistContainer");
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
function createJobListTable()
{
	try{
	
	var	tableParent = document.getElementById("joblistTable");
	var height = getTableHeight();
	var tableWidth = getTableWidth();

	var labelAry = new Array()
	labelAry[0] = portalWnd.rptPhrases.getPhrase("lblJobName");
	labelAry[1] = portalWnd.rptPhrases.getPhrase("lblDescription");
	labelAry[2] = portalWnd.rptPhrases.getPhrase("lblReports");
	labelAry[3] = portalWnd.rptPhrases.getPhrase("lblParameters");
	labelAry[4] = portalWnd.rptPhrases.getPhrase("lblStatus");

	var widthAry = new Array()
	widthAry[0] = tableWidth * .20;
	widthAry[1] = tableWidth * .25;
	widthAry[2] = tableWidth * .15;
	widthAry[3] = tableWidth * .15;
	widthAry[4] = tableWidth * .25;

	var labelAlignAry = new Array()
	labelAlignAry[0] = "left";
	labelAlignAry[1] = "left";
	labelAlignAry[2] = "center"
	labelAlignAry[3] = "left";
	labelAlignAry[4] = "left";

	var dataAlignAry = new Array()
	dataAlignAry[0] = "left";
	dataAlignAry[1] = "left";
	dataAlignAry[2] = "center"
	dataAlignAry[3] = "left";
	dataAlignAry[4] = "left";

	var sourceAry = new Array();

	for(var i=0; i<5; i++)
		sourceAry[i] = "<COLUMN label=\"" + labelAry[i] + "\" width=\"" + widthAry[i] + "\" labelalign=\"" + labelAlignAry[i] + "\" dataalign=\"" + dataAlignAry[i] + "\"/>";

	sourceAry.push("</COLUMNS>");
	sourceAry.push("</TABLE>");
	sourceAry.unshift("<COLUMNS>");
	sourceAry.unshift("<TABLE height=\"" + height + "\" ismultipleselect=\"true\" rowselectchange=\"updateToolbar()\">");
	sourceAry.unshift("<?xml version=\"1.0\"?>");

	var sourceString = sourceAry.join("");
	var xmlSource = portalWnd.cmnCreateXmlObjectFromString(sourceString);

	oJobListTbl = new Table(document, tableParent, "oJobListTbl", xmlSource);
	oJobListTbl.showTitle(false);
	
	} catch(e){reportError(e)}
}
//============================================================//
function addTableRow(oJob)
{
	try{
	
	var dataAry = new Array();
	dataAry[0] = portalWnd.xmlEncodeString(oJob.name);
	dataAry[1] = portalWnd.xmlEncodeString(oJob.description);
	dataAry[2] = oJob.prtFiles.length;
	dataAry[3] = oJob.parameter;
	dataAry[4] = oJob.statusDescription;

	var sourceAry = new Array();

	for(var i=0; i<5; i++)
		sourceAry[i] = "<DATA>" + dataAry[i] + "</DATA>";

	sourceAry.push("</ROW>");
	sourceAry.unshift("<ROW key=\"" + oJob.listKey + "\">");
	sourceAry.unshift("<?xml version=\"1.0\"?>");

	var sourceString = sourceAry.join("");
	var xmlSource = portalWnd.cmnCreateXmlObjectFromString(sourceString);

	var oRow = oJobListTbl.addRow(xmlSource);
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
		case 13://ENTER
			if(typeof(mElement.onclick) == "function")
			{
				mElement.click();
				evtCaught=true;
			}
			break;
		case 27://ESC
			portalWnd.hideDrillFrame();
			evtCaught = true;
			break;
		case 46://DELETE
			if(typeof(mElement.r) != "undefined")
			{
				var oRow = oJobListTbl.getCurrentRow();
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
		case "doViewPrint":
			if(portalWnd.oPortalConfig.getRoleOptionValue("allow_printfiles","0")== "1")			
				goPrintFiles();
					
			bHandled=true;
			break;
		case "doSubmit":
			doSubmit();
			bHandled=true
			break;
		case "doDelete":
			var oRow = oJobListTbl.getCurrentRow();
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
				var url = "?_URL=reports/joblist.htm?_LOGIN=" + getUserName(); 

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
function getJobList(parameters)
{
	try{
	
	var jobListCall=g.jobListCall + parameters + "&_NOCACHE=" + new Date().getTime();
	var jobListXML=null;
	var jobsNode=null;
	var navigationNode=null;
	var errorNode=null;
	var messageNode=null;
	g.lastCall = parameters;
	
	jobListXML = portalWnd.httpRequest(jobListCall,null,null,null,false);

	var msg=portalObj.getPhrase("msgErrorInvalidResponse") + " "+g.jobListCall+".\n\n";
	if (portalWnd.oError.isErrorResponse(jobListXML,true,true,false,msg,window))
		return;

	var oDS=portalWnd.oError.getDSObject();
	g.longname = !oDS.getRootNode().getAttribute("longName") ? "" : oDS.getRootNode().getAttribute("longName");
	
	var oJobNodes = oDS.getElementsByTagName("JOB");
	var loop = oJobNodes.length;

	for (var i=0; i < loop; i++)
		parseJobList(oJobNodes[i]);

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
//============================================================//
function parseJobList(node)
{
	try{
	
	var webUser=null;
	var userName=node.getAttribute("USERNAME");
	var name=node.getAttribute("JOBNAME");
	var description=node.getAttribute("DESCRIPTION");
	var isMultiStep=(node.getAttribute("ISMULTISTEPJOB")=="true")? "1":"0";
	var pdl=node.getAttribute("PRODUCTLINE");
	var project=node.getAttribute("PROJECT");
	var token=node.getAttribute("TOKEN");
	var jobNumber=node.getAttribute("JOBNBR");
	var status=node.getAttribute("STATUS");

	var myBatchJob = new BatchJob(webUser,userName,name,description,isMultiStep,pdl,project,token,jobNumber,status);

	for (var i=0; i<node.getElementsByTagName("REPORT").length; i++)
	{
		var fileName=node.getElementsByTagName("REPORT")[i].getAttribute("FILENAME");
		var filePath=escape(node.getElementsByTagName("REPORT")[i].getAttribute("FILEPATH"));
		var rptToken=node.getElementsByTagName("REPORT")[i].getAttribute("TOKEN");
		var rptPdl=node.getElementsByTagName("REPORT")[i].getAttribute("PRODUCTLINE");
		var jobStep=node.getElementsByTagName("REPORT")[i].getAttribute("JOBSTEP");

		myBatchJob.addReport(fileName,filePath,rptToken,rptPdl,jobStep);
	}

	myBatchJob.validActions=myBatchJob.setValidActions();
	gJobList.addMember(myBatchJob);

	} catch(e){reportError(e)}	
}
//============================================================//
function jobListResize()
{
	try {
		if (oFeedBack && typeof(oFeedBack.resize) == "function")
			oFeedBack.resize();

		if (!oJobListTbl) return;

		var height = getTableHeight();
		oJobListTbl.setHeight(height);

		var tableWidth = getTableWidth();

		var widthAry = new Array()
		widthAry[0] = tableWidth * .20;
		widthAry[1] = tableWidth * .25;
		widthAry[2] = tableWidth * .15;
		widthAry[3] = tableWidth * .15;
		widthAry[4] = tableWidth * .25;

		for(var i=0; i<5; i++)
		{
			var oCol = oJobListTbl.getColumnById(i);
			oCol.setWidth(widthAry[i]);
		}

	} catch(e){reportError(e)}
}
//============================================================//
function jobListMouseOver(btn)
{
	try {
		if (btn.className == "anchorActive")
			btn.className = "anchorHover";
	} catch(e){reportError(e)}
}
//============================================================//
function jobListMouseOut(btn)
{
	try {
		if (btn.className == "anchorHover")
			btn.className="anchorActive";
	} catch(e){reportError(e)}
}
//============================================================//
function jobListBlur(mElement)
{
	try {
		if(mElement.className == "textBoxHighLight" || mElement.id == "_f2")
			mElement.className = "textbox";
		else
			mElement.className = "anchorActive";
	} catch(e){reportError(e)}
}
//============================================================//
function jobListFocus(mElement)
{
	try {
		if(mElement.className == "textbox" || mElement.id == "_f2")
			mElement.className = "textBoxHighLight";
		else
			mElement.className = "anchorFocus";
	} catch(e){reportError(e)}
}
//============================================================//
function showBusy()
{
	try{
	
	portalObj.setMessage(portalObj.getPhrase("PROCESSING"));
	document.body.style.cursor = "wait";
	
	} catch(e){}	
}
//============================================================//
function showReady()
{
	try {
		document.body.style.cursor = "auto";
		portalObj.setMessage(portalObj.getPhrase("AGSREADY"));
	} catch(e){}
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
		gJobList=null;
		oDropDown=null;
		oJobListTbl = null;

	} catch(e){reportError(e)}
}
// BATCHJOB OBJECT ===========================================//
function BatchJob(webUser,userName,jobName,jobDescription,isMultiStep,productline,project,token,jobNumber,status)
{
	try{
	
	this.webUser=webUser;
	this.userName=userName;
	this.name=jobName;
	this.description=jobDescription;
	this.token=token;
	this.pdl=project?project:productline;
	this.isMultiStep=parseInt(isMultiStep,10);
	this.jobNumber=jobNumber;
	this.status=status;

	this.prtFiles=new Array();
	this.validActions= new Array();

	//DERIVED ATTRIBUTES
	this.parameter=(this.isMultiStep) ? portalWnd.rptPhrases.getPhrase("lblMultiStep"):this.token;
	this.statusDescription=portalWnd.rptPhrases.getPhrase(this.status);

	} catch(e){reportError(e)}	
}
BatchJob.prototype.addReport=function(fileName,filePath,token,productline,jobStep)
{
	try{
	
	var reportItem=new Object();

	reportItem.fileName=fileName;
	reportItem.filePath=filePath;
	reportItem.token=token;
	reportItem.pdl=productline;
	reportItem.jobStep=jobStep;

	this.prtFiles[this.prtFiles.length]=reportItem;

	} catch(e){reportError(e)}	
}
BatchJob.prototype.setValidActions=function()
{
	try{
	
	var actionAry = new Array();
	actionAry["viewReport"]=false;
	actionAry["viewLog"]=false;
	actionAry["gotoParam"]=true;
	actionAry["submitJob"]=false;
	actionAry["deleteJob"]=false;

	if(portalWnd.oPortalConfig.getRoleOptionValue("allow_jobdef","0")== "0" && this.isMultiStep == 1)
		actionAry["gotoParam"]=false;
		
	if(this.status==null || this.status=="" || this.status > 35)
	{
		actionAry["submitJob"]=true;
		actionAry["deleteJob"]=true;
	}

	if(this.jobNumber!=null && this.jobNumber!="")
		actionAry["viewLog"]=true;

	if(this.prtFiles.length>0)
		actionAry["viewReport"]=true;

	return actionAry;

	} catch(e){reportError(e)}	
}
BatchJob.prototype.isValidAction=function(action)
{
	try{
		
	return this.validActions[action];
	
	} catch(e){reportError(e)}
}
//============================================================//
function cntxtGetPrintContent()
{
	try{

	var elem = document.createElement("body");
	var sourceHTML = document.getElementById("joblistContainer").innerHTML;
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
	
	var content = elem.document.getElementById("oJobListTbl_content");
	content.style.overflow = "visible";
	
	var printHTML = elem.innerHTML;
	elem = null;
	return printHTML;

	} catch(e){reportError(e)}	
}

function reportError(error)
{
	try{
		showReady();
		var strFunction = reportError.caller.toString();
		var i = (strFunction.indexOf("("));
		var funcName = strFunction.substr(0,i);
		funcName = funcName.replace("function ","");
		portalWnd.cmnErrorHandler(error,window,JOBLISTJS,"",funcName);	
	}catch(e){}
}
