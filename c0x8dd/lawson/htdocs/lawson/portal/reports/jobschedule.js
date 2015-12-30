/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/reports/Attic/jobschedule.js,v 1.1.2.28.4.36.6.2.2.5 2012/08/08 12:37:19 jomeli Exp $ */
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
var JOBSCHEDULEJS = "reports/jobschedule.js";	// filename constant for error handler

var portalWnd = null;
var portalObj = null;
var g=null;
var gJobSchedule=null;
var oDropDown=null;
var oJobScheduleTbl = null;
var oFeedBack = null;
var oTimer = null;
var httpPolling = null;

function GlobalObject()
{
	this.username=null;
	this.longname=null;	
	this.jobCtrlCgi="/cgi-lawson/xjobctrl.exe?";
	this.jobScheduleCall=portalWnd.JOBSRVPath+"?_TYPE=jobSchedule";
	this.jobScheduleName=portalWnd.JOBSRVPath;
	this.currentFilter = "complete";
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
	this.monitorKey = "";
	this.linkTextAry = new Array();
	this.linkTknAry = new Array();
}
//============================================================//
function init()
{
	try {
		//set portal global objects
		portalWnd=envFindObjectWindow("lawsonPortal");
		if (!portalWnd) return;

		// load the script versions
		envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

		portalObj=portalWnd.lawsonPortal;

		if(portalWnd.oPortalConfig.getRoleOptionValue("allow_jobschedule","0")!= "1")
		{
			var msg = portalObj.getPhrase("NO_ACCESS_TO_JOBSCHEDULE");
		 	portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		 	portalWnd.goHome();
		 	return;
		}

		if(portalWnd.oPortalConfig.getRoleOptionValue("allow_jobpolling","0")!= "1")
			showAutoMonitor(false);

		oFeedBack = new FeedBack(window, portalWnd);
		showBusy();
		g=new GlobalObject();

		//load phrases
		//if(!portalWnd.rptPhrases) IE9 doesn't like this. Must recreate phrases object.
			portalWnd.rptPhrases = new portalWnd.phraseObj("reports");

		//if (!portalWnd.erpPhrases) IE9 doesn't like this. Must recreate phrases object
			portalWnd.erpPhrases=new portalWnd.phraseObj("forms")

		// load the hotkeys
		portalObj.keyMgr.addHotkeySet("forms","forms",portalWnd.erpPhrases);
		portalObj.keyMgr.addHotkeySet("erpReporting","reports",portalWnd.rptPhrases);

		var initialParameters = getInitialParameters();
		buildRelatedForms();
		buildPortalObjects();
		translateLabels();
		document.body.style.visibility = "visible";
		buildJobsTable(initialParameters);
		showReady();

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","init");
	}
}
//============================================================//
function translateLabels()
{
	try {
		var labelElem = document.getElementById("lblUserName");
		var phrase = portalWnd.rptPhrases.getPhrase("lblUserName");
		portalWnd.cmnSetElementText(labelElem, phrase);
		labelElem = document.getElementById("selBtn_f2");
		phrase = portalObj.getPhrase("LBL_SELECT");
		labelElem.setAttribute("title",phrase);
		labelElem = document.getElementById("btnActive");
		phrase = portalWnd.rptPhrases.getPhrase("lblActiveJobs");
		portalWnd.cmnSetElementText(labelElem, phrase);
		labelElem = document.getElementById("btnWaiting");
		phrase = portalWnd.rptPhrases.getPhrase("lblJobsWaiting");
		portalWnd.cmnSetElementText(labelElem, phrase);
		labelElem = document.getElementById("btnComplete");
		phrase = portalWnd.rptPhrases.getPhrase("lblJobsComplete");
		portalWnd.cmnSetElementText(labelElem, phrase);	
		labelElem = document.getElementById("lblAutoInq");
		phrase = portalWnd.rptPhrases.getPhrase("lblAutoMonitor");
		portalWnd.cmnSetElementText(labelElem, phrase);	
		phrase = portalWnd.rptPhrases.getPhrase("msgAutoMonitor");
		labelElem.setAttribute("title",phrase);
		labelElem = document.getElementById("autoInqReadyBtn");
		phrase = portalWnd.rptPhrases.getPhrase("msgRefreshList");
		labelElem.setAttribute("title",phrase);

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","translateLabels");
	}
}
//============================================================//
function buildPortalObjects()
{
	try {
		var title = portalObj.getPhrase("LBL_JOBS_SCHEDULE");
		title = g.username ? title + " - " + g.username : title
		portalObj.setTitle(title);
		buildToolbar();

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","buildPortalObjects");
	}
}
//============================================================//
function buildToolbar()
{
	try {
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
			var text=portalObj.getPhrase("LBL_RELATED_FORMS");
			var title=portalWnd.erpPhrases.getPhrase("lblShowFormTransfers");
			portalObj.toolbar.addDropdownButtonRight("links",text,title,showRelatedForms,
				title,showRelatedForms);
		}

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","buildToolbar");
	}
}
//============================================================//
function updateToolbar()
{
	try {
		// no records
		if(gJobSchedule.length==0)
		{
			portalObj.toolbar.changeButtonState("submit", "DISABLED");
			portalObj.toolbar.changeButtonState("delete", "DISABLED");
			portalObj.toolbar.changeButtonState("runImmediate", "DISABLED");
			portalObj.toolbar.changeButtonState("recover", "DISABLED");
			portalObj.toolbar.changeButtonState("logFile", "DISABLED");
			return;
		}

		// more than on selected record
		var oRowsAry = oJobScheduleTbl.getSelectedRows();
		if(oRowsAry.length > 1)
		{
			portalObj.toolbar.changeButtonState("submit", "DISABLED");
			portalObj.toolbar.changeButtonState("runImmediate", "DISABLED");
			portalObj.toolbar.changeButtonState("recover", "DISABLED");
			portalObj.toolbar.changeButtonState("logFile", "DISABLED");

			if(g.currentFilter == "active")
				portalObj.toolbar.changeButtonState("delete", "DISABLED");
			else
				portalObj.toolbar.changeButtonState("delete", "ENABLED");
			return;
		}

		// one record is highlighted
		var job=getSelectedJob()
		portalObj.toolbar.changeButtonState("submit", job.isValidAction("submit")?"ENABLED":"DISABLED");
		portalObj.toolbar.changeButtonState("runImmediate", job.isValidAction("runImmediate")?"ENABLED":"DISABLED");
		portalObj.toolbar.changeButtonState("recover", job.isValidAction("recover")?"ENABLED":"DISABLED");
		portalObj.toolbar.changeButtonState("delete", job.isValidAction("delete")||job.isValidAction("kill")?"ENABLED":"DISABLED");
		portalObj.toolbar.changeButtonState("logFile", job.isValidAction("viewLog")?"ENABLED":"DISABLED");

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","updateToolbar");
	}
}
//============================================================//
function buildRelatedForms()
{
	try {
		if(portalWnd.oPortalConfig.getRoleOptionValue("allow_joblist","0")== "1")
		{
			g.linkTextAry.push(portalObj.getPhrase("LBL_JOBS_REPORTS"));
			g.linkTknAry.push("JOBLIST");
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

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","buildRelatedForms");
	}
}
//============================================================//
function showRelatedForms()
{
	try {
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

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","showRelatedForms");
	}
}
//============================================================//
function removePortalObjects()
{
	try {
		portalObj.toolbar.clear();

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","removePortalObjects");
	}
}
//============================================================//
function getInitialParameters()
{
	try {
		var qString =unescape(window.location.search);
		var login = portalWnd.getVarFromString("_LOGIN", qString);
		var jobName = portalWnd.getVarFromString("_JOBNAME", qString);
		var filter = portalWnd.getVarFromString("_FILTER", qString);

		var userName = login ? login : portalWnd.oUserProfile.getAttribute("lawsonusername");
		var re = /\\{2}/g
		userName = userName.replace(re, "\\");
		setUserName(userName);
		g.currentFilter = filter != "" ? filter : "complete";

		var parameters = jobName ? "&_FINDKEYFIELD=JOBNAME&_FINDKEY="+jobName : "";

		switch(filter)
		{
			case "active":
				parameters = "&_JOBSTATUS=activejobs" + parameters;
				break;
			case "waiting":
				parameters = "&_JOBSTATUS=waitingjobs" + parameters;
				break;
			case "complete":
				parameters = "&_JOBSTATUS=completedjobs" + parameters;
				break;
			default:
				parameters = "&_JOBSTATUS=completedjobs" + parameters;
		}

		return parameters;

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","getInitialParameters");
	}
}
//============================================================//
function doFormTransfer(tkn)
{
	try {
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
			case "UNPM.1":	//print manager
				goPrintFiles();
				return;
		}

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doFormTransfer");
	}
}
//============================================================//
function goJobDefinition()
{
	try {
		portalWnd.switchContents(portalWnd.getGoJobDefURL());

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","goJobDefinition");
	}
}
//============================================================//
function goJobList()
{
	try {
		var userName = getUserName();
		portalWnd.switchContents(portalWnd.getGoJobListURL(userName));

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","goJobList");
	}
}
//============================================================//
function goPrintFiles()
{
	try {
		var userName = getUserName();
		portalWnd.switchContents(portalWnd.getGoPrintFilesURL(userName));

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","goPrintFiles");
	}
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

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doSelect");
	}
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

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doSelectReturn");
	}
}
//============================================================//
function doInquire()
{
	try {
		showBusy();

		if(oTimer && oTimer.isEnabled)
		{
			oTimer.resetTimer()
			var autoInqBtnElem = document.getElementById("autoInqBtn");
			autoInqBtnElem.style.display = "inline";
			var autoInqReadyBtnElem = document.getElementById("autoInqReadyBtn");
			autoInqReadyBtnElem.style.display = "none";
		}

		clearSearchOptions();
		var userName = getUserName();
		setUserName(userName);
		buildJobsTable();
		showReady();

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doInquire");
	}
}
//============================================================//
function doAutoRefresh(elem)
{
	try {
		if(elem.getAttribute("autoInq") == "0")
		{
			if(!oTimer)
				oTimer = new Timer(60000, "doMonitor()")

			elem.setAttribute("autoInq","1");
			elem.checked = true;
			oTimer.startTimer();
			var autoInqBtnElem = document.getElementById("autoInqBtn")
			autoInqBtnElem.style.display = "inline";
			return;
		}

		elem.setAttribute("autoInq","0");
		elem.checked = false;
		oTimer.stopTimer();
		var autoInqBtnElem = document.getElementById("autoInqBtn")
		autoInqBtnElem.style.display = "none";
		var autoInqReadyBtnElem = document.getElementById("autoInqReadyBtn");
		autoInqReadyBtnElem.style.display = "none";

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doAutoRefresh");
	}
}
//============================================================//
function doMonitor()
{
	try {
		pollJobserver1()

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doMonitor");
	}
}
//============================================================//
function pollJobserver1()
{
	try {
		if (httpPolling && httpPolling.doneState == 0)
		{
			window.setTimeout("pollJobserver1()", 100);
			return;
 		}

		var parameters="&_USERNAME=" + g.username + "&_PAGESIZE=1";
		var refreshKey = "";
 		var navigationNode=null;

		switch(g.currentFilter)
		{
			case "active":
				parameters = "&_JOBSTATUS=activejobs" + parameters;
				break;
			case "waiting":
				parameters = "&_JOBSTATUS=waitingjobs" + parameters;
				break;
			case "complete":
				parameters = "&_JOBSTATUS=completedjobs" + parameters;
				break;
			default:
				parameters = "&_JOBSTATUS=completedjobs" + parameters;
		}

		var jobScheduleCall=g.jobScheduleCall + parameters + "&_NOCACHE=" + new Date().getTime();

		httpPolling=new portalWnd.RequestObject(portalWnd);
		httpPolling.doneState=0;
		httpPolling.onreadystatechange=handlePollingReturn;
		httpPolling.open("GET",jobScheduleCall,true);
		httpPolling.setRequestHeader("content-type","text/html");
		httpPolling.send(null);

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","pollJobserver1");
	}
}
//============================================================//
function handlePollingReturn()
{
	try	{
		if (!httpPolling) return;

		if(httpPolling.readyState()==4)
		{
			if(httpPolling.status()==200)
			{
				var ssoAuthObj = new portalWnd.SSOAuthObject();	// get singleton auth object
				var newXml=null;
				var ssoResponse=null;
				if (httpPolling.getResponseHeader("content-type") == "text/xml")
				{
					if (httpPolling.cached_url != ssoAuthObj.configUrl 
					&& portalWnd.isTimeout(httpPolling.responseXML()))
					{
						ssoResponse=portalWnd.handleTimeout(httpPolling,"text/html","object",false);
						if (ssoResponse)
							newXml = ssoResponse.responseXML();
					}
					else
						newXml = httpPolling.responseXML();
				}
				else
				{
					// Check for login page first...
					if (httpPolling.cached_url != ssoAuthObj.configUrl 
					&& portalWnd.isLoginPage(httpPolling))
					{
						ssoResponse = portalWnd.showLoginPage(httpPolling,"text/html","object",false);
						if (ssoResponse)
							newXml = ssoResponse.responseXML;
					}
					else
						newXml = httpPolling.responseXML();
				}

				// procede with response
				httpPolling=null;
				if (newXml)
					pollJobserver2(newXml)

			}
			if (httpPolling)
				httpPolling.doneState=1;
		}

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","handlePollingReturn");
	}
}
//============================================================//
function pollJobserver2(jobScheduleXml)
{
	try {
		var oDS = (portalObj.browser.isIE
			? new portalWnd.DataStorage(jobScheduleXml.xml)
			: new portalWnd.DataStorage(jobScheduleXml));
		if (oDS.isEmptyDoc() || oDS.isErrorDoc())
			return;

		var oNavigationNode = oDS.getNodeByName("NAVIGATION");
		var refreshKey = (!oNavigationNode ? "" : oNavigationNode.getAttribute("REFRESHCALL"));
					 
		if (parseInt(refreshKey,10) <= parseInt(g.monitorKey,10))
			return;			 

		if ( (g.previousKey != "") 		//not on first page
		|| (g.searchMode=="FILTER")
		|| (oJobScheduleTbl && oJobScheduleTbl.checkedRows > 0)
		|| (oDropDown && oDropDown.isVisible)
		|| (portalWnd.jobsContentWin) )
		{
			var autoInqBtnElem = document.getElementById("autoInqBtn");
			autoInqBtnElem.style.display = "none";
			var autoInqReadyBtnElem = document.getElementById("autoInqReadyBtn");
			autoInqReadyBtnElem.style.display = "inline";

			if (portalWnd.jobsContentWin ||(oDropDown && oDropDown.isVisible))
				return;

			var msg=portalWnd.rptPhrases.getPhrase("msgNewJobDetected");
			if (portalWnd.cmnDlg.messageBox(msg,"yesno","question",window) != "yes")
				return;
		}
		setTimeout("doInquire()",50);

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","pollJobserver2");
	}
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
								 
		if(!job || !job.isValidAction("submit"))
		{
			showReady();
			return;
		}

		if (!portalObj.browser.isIE)
			removePortalObjects();

		portalWnd.showJobSubmit(job.jobName, job.jobOwner.replace(re, "\\"), window, "doSubmitReturn");

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doSubmit");
	}
}
//============================================================//
function doSubmitReturn()
{
	try {
		if (!portalObj.browser.isIE)
			buildPortalObjects();

		var oRow = oJobScheduleTbl.getCurrentRow();
		oJobScheduleTbl.setCurrentRow(oRow);
		showReady();

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doSubmitReturn");
	}
}
//============================================================//
function doDelete(oRow)
{
	try {
		if(g.currentFilter == "active")
		{
			doKill(oRow);
			return;
		}

		showBusy();
		var oRowsAry = oJobScheduleTbl.getSelectedRows();

		if(oRowsAry.length > 0 && !oRow)
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

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doDelete");
	}
}
function doDeleteSelected(oRow)
{
	try {
		var job = getSelectedJob(oRow);
		if (!job || !job.isValidAction("delete"))
			return;

		var msg=portalWnd.rptPhrases.getPhrase("msgOkToDeleteJob") + " " + job.jobName + ".";
		if (portalWnd.cmnDlg.messageBox(msg,"yesno","question",window) != "yes")
			return;

		// is this right check with CGI code -- should it be the job username
		var userName=getUserName();
		deleteJobs(userName, job.jobNbr);

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doDeleteSelected");
	}
}
//============================================================//
function deleteChecked(oRowsAry)
{
	try {
		var joblist="";
		var loop = oRowsAry.length;
		var msg = portalWnd.rptPhrases.getPhrase("msgOkToDeleteTheFollowingJobs")+"\n\n";

		for (var i=0; i<loop; i++)
		{
			var listKey = oRowsAry[i].getKey();
			var job = gJobSchedule.getMember(listKey);

			if(!job || !job.isValidAction("delete"))
				continue;

			msg += "\t\t\t\t - " + job.jobName + "\n";
			joblist += job.jobNbr + "&";
		}

		if (portalWnd.cmnDlg.messageBox(msg,"yesno","question",window) != "yes")
			return;

		var userName=getUserName();
		deleteJobs(userName, joblist);

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","deleteChecked");
	}
}
//============================================================//
function deleteJobs(jobUser, joblist)
{
	try {
		var api;
		if(g.currentFilter == "waiting")
			api = g.jobCtrlCgi + "-d&" + jobUser + "&" + joblist; 
		else
			api = "/cgi-lawson/xdelqueued.exe?" + jobUser + "&" + joblist;
		var oDeleteXml = portalWnd.httpRequest(api,null,null,null,false);

		var msg=portalObj.getPhrase("msgErrorInvalidResponse") + " xdelqueued.exe.\n\n";
		if (portalWnd.oError.isErrorResponse(oDeleteXml,true,true,false,msg,window))
			return;

		var oDS = portalWnd.oError.getDSObject();
		var oJobNodes = oDS.getElementsByTagName("Job");
		var len = oJobNodes ? oJobNodes.length : 0;

		// need to add the job identity for when you do multiple deletes
		msg="";
		for (var i=0; i < len; i++)
			msg += oJobNodes[i].firstChild.nodeValue + "\n";

		portalWnd.cmnDlg.messageBox(msg,"ok","",window);
		doInquire();

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","deleteJobs");
	}
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
	try {
		oRow = oRow && oRow.r ? oRow : oJobScheduleTbl.getCurrentRow();
		doLogFile(oRow);

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doDefault");
	}
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
			escape(job.jobName) + "&" + escape(job.jobNbr), window, "doLogFileReturn");

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doLogFile");
	}
}
//============================================================//
function doLogFileReturn()
{
	try{
		showBusy();
		buildPortalObjects();
		var oRow = oJobScheduleTbl.getCurrentRow();
		oJobScheduleTbl.setCurrentRow(oRow);
		showReady();

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doLogFileReturn");
	}
}
//============================================================//
function doRunImmediate(oRow)
{
	try {
		var job = getSelectedJob(oRow);
		if (!job || !job.isValidAction("runImmediate"))
		{
			showReady();
			return;
		}

		var msg = portalWnd.rptPhrases.getPhrase("msgOkToRunImmediatelyJob") + " " + job.jobName;
		if (portalWnd.cmnDlg.messageBox(msg,"yesno","question",window) != "yes")
			return;

		// NT backslashes!! make 2->1
		var re=/\\{2}/g;
		var paddedJobNbr = padJobNumber(job.jobNbr);
		var queryString = "-i&" + job.jobOwner.replace(re, "\\") + "&" + job.jobName + "&" + paddedJobNbr + "&" + job.jobQueue;
		var response = portalWnd.httpRequest(g.jobCtrlCgi + queryString,null,null,null,false);

		msg=portalObj.getPhrase("msgErrorInvalidResponse") + "\n" + g.jobCtrlCgi + queryString;
		if (portalWnd.oError.isErrorResponse(response,true,true,false,msg,window))
			return;

		var oDS = portalWnd.oError.getDSObject();
		msg = oDS.getElementValue("IMMEDIATE");
		portalWnd.cmnDlg.messageBox(msg,"ok","",window);
		doInquire();
		portalObj.setMessage(msg);

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doRunImmediate");
	}
}
//============================================================//
function doRecover(oRow)
{
	try {
		var job = getSelectedJob(oRow);
		if (!job || !job.isValidAction("recover"))
		{
			showReady();
			return;
		}

		var msg = portalWnd.rptPhrases.getPhrase("msgOkToRecoverJob") + " " + job.jobName;
		if (portalWnd.cmnDlg.messageBox(msg,"yesno","question",window) != "yes")
			return;

		// NT backslashes!! make 2->1
		var re=/\\{2}/g;
		var paddedJobNbr = padJobNumber(job.jobNbr);
		var queryString = "-r&" + job.jobOwner.replace(re, "\\") + "&" + job.jobName + "&" + paddedJobNbr;
		var response = portalWnd.httpRequest(g.jobCtrlCgi + queryString,null,null,null,false);

		msg=portalObj.getPhrase("msgErrorInvalidResponse") + "\n" + g.jobCtrlCgi + queryString;
		if (portalWnd.oError.isErrorResponse(response,true,true,false,msg,window))
			return;

		var oDS = portalWnd.oError.getDSObject();
		msg = oDS.getElementValue("RECOVER");
		portalWnd.cmnDlg.messageBox(msg,"ok","",window);
		doInquire();
		portalObj.setMessage(msg);

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doRecover");
	}
}
//============================================================//
function doKill(oRow)
{
	try {
		var job = getSelectedJob(oRow);
		if (!job || !job.isValidAction("kill"))
		{
			showReady();
			return;
		}

		var msg = portalWnd.rptPhrases.getPhrase("lblOkToKillJob") + job.jobName + ".";
		if (portalWnd.cmnDlg.messageBox(msg,"yesno","question",window) != "yes")
			return;

		// NT backslashes!! make 2->1
		var re=/\\{2}/g;
		var paddedJobNbr = padJobNumber(job.jobNbr);
		var queryString = "-k&" + job.jobOwner.replace(re, "\\") + "&" + job.jobName + "&" + paddedJobNbr;
		var response = portalWnd.httpRequest(g.jobCtrlCgi + queryString,null,null,null,false);

		msg=portalObj.getPhrase("msgErrorInvalidResponse") + "\n" + g.jobCtrlCgi + queryString;
		if (portalWnd.oError.isErrorResponse(response,true,true,false,msg,window))
			return;

		var oDS = portalWnd.oError.getDSObject();
		msg = oDS.getElementValue("KILL");
		portalWnd.cmnDlg.messageBox(msg,"ok","",window);
		doInquire();
		portalObj.setMessage(msg);

	} catch(e) {
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doKill");
		showReady();
	}
}
//============================================================/
function buildSearchDOM()
{
	try {
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

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","buildSearchDOM");
	}
}
//============================================================//
function doSearch()
{
	try {
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

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doSearch");
	}
}
//============================================================//
function clearSearchOptions()
{
	try {
		g.findKeyField = "JobName";
		g.findKey = "";
		g.searchParameters = "";
		g.searchMode = null;
			
		portalObj.toolbar.changeButtonState("FindNext","disabled")
		portalObj.toolbar.changeButtonState("Reset","disabled")

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","clearSearchOptions");
	}
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

		buildJobsTable(g.searchParameters);
		showReady();	
		
	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","findJob");
	}
}
//============================================================//
function findNextJob()
{
	try {
		showBusy();
		var parameters=g.searchParameters+"&_PAGEKEY="+g.refreshKey+"&_FINDNEXT=true";
		buildJobsTable(parameters);
		showReady();

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","findNextJob");
	}
}
//============================================================//
function doFindReset()
{
	try {
		showBusy();
		clearSearchOptions();
		buildJobsTable();
		showReady();

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","doFindReset");
	}
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

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","pageUp");
	}
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

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","pageDown");
	}
}
//============================================================//
function updatePagingButtons()
{
	try {
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

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","updatePagingButtons");
	}
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
function showAutoMonitor(show)
{
	try {
		var autoInqContainerElem = document.getElementById("autoInqContainer");
		autoInqContainerElem.style.display = (show ? "inline" : "none");

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","showAutoMonitor");
	}
}
//============================================================//
function getJobActions()
{
	try {
		var retObj = new Object();
		retObj.textAry = new Array();
		retObj.actionAry = new Array();

		if (gJobSchedule.length ==0)
			return retObj;
			
		//more than on selected record
		var oRowsAry = oJobScheduleTbl.getSelectedRows();
		if(oRowsAry.length > 1)
		{
			retObj.textAry.push(portalWnd.rptPhrases.getPhrase("lblDelete"));
			retObj.actionAry.push("delete");		
		}
		else
		{
			//one record is highlighted
			var job=getSelectedJob();

			if(job.isValidAction("submitJob"))
			{		
				retObj.textAry.push(portalWnd.rptPhrases.getPhrase("lblSubmit"));
				retObj.actionAry.push("submit");
			}		
			if(job.isValidAction("runImmediate"))
			{
				retObj.textAry.push(portalWnd.rptPhrases.getPhrase("lblRunJobImmediately"));
				retObj.actionAry.push("runImmediate");
			}
			if(job.isValidAction("recover"))
			{		
				retObj.textAry.push(portalWnd.rptPhrases.getPhrase("lblRecover"));
				retObj.actionAry.push("recover");
			}
			if(job.isValidAction("delete") || job.isValidAction("kill"))
			{		
				retObj.textAry.push(portalWnd.rptPhrases.getPhrase("lblDelete"));
				retObj.actionAry.push("delete");
			}		
			if(job.isValidAction("viewLog"))
			{		
				retObj.textAry.push(portalWnd.rptPhrases.getPhrase("lblLog"));
				retObj.actionAry.push("viewLog");
			}
		}

		return retObj;
	
	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","getJobActions");
	}
	return null;
}
//============================================================//
function showActions()
{
	try {
		var oJobActions = getJobActions();
		if (oJobActions == null) return;
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
	
	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","showActions");
	}
}
//============================================================//
function showContextMenu(evt,window, mElement)
{
	try {
		if (gJobSchedule.length==0)
			return;

		if (typeof(mElement) == "undefined")
		{
			mElement = portalWnd.getEventElement(evt)
			if (typeof(mElement) == "undefined") return;
		}

		if (!mElement || typeof(mElement.r)=="undefined")
			return;

		var oRow = oJobScheduleTbl.getRowById(mElement.r);
		if (!oRow) return;

		window.lastControl=mElement;
		oJobScheduleTbl.setCurrentRow(oRow);

		var listKey=oRow.getKey();
		var job=gJobSchedule.getMember(listKey);
		if (!job) return;

		if (!window.oDropDown)
			window.oDropDown=new window.Dropdown()

		window.oDropDown.clearItems()

		var oRowsAry = oJobScheduleTbl.getSelectedRows();
		var loop = oRowsAry.length;

		if(loop > 1 && oRow.isChecked())
		{
			for(var i=0; i<loop; i++)
				oRowsAry[i].shade(true);
		}

		var oJobActions = getJobActions();
		if (oJobActions == null) return;
		var loop = oJobActions.textAry.length;		

		for (var i = 0; i < loop; i++)
			oDropDown.addItem(oJobActions.textAry[i], oJobActions.actionAry[i]);

		window.oDropDown.show("", mElement, "returnContextMenu")
		evt=portalWnd.getEventObject(evt);

		if(evt) 
			portalWnd.setEventCancel(evt);

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","init");
	}
}
//============================================================//
function returnContextMenu(value)
{
	try {
		var oRow = oJobScheduleTbl.getCurrentRow();
		oJobScheduleTbl.setCurrentRow(oRow);
		var oRowsAry = oJobScheduleTbl.getSelectedRows();
		var loop = oRowsAry.length;

		switch (value)
		{
			case "submit":
				doSubmit(oRow);
				break;
			case "runImmediate":
				doRunImmediate(oRow);
				break;
			case "recover":
				doRecover(oRow);
				break;
			case "delete":
				if(loop > 1 && oRow.isChecked())
					doDelete();
				else
					doDelete(oRow);
				break;
			case "viewLog":
				doLogFile(oRow);
				break;
		}

		if(loop > 1 && oRow.isChecked())
		{
			for(var i=0; i<loop; i++)
				oRowsAry[i].shade(false);
		}

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","returnContextMenu");
	}
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

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","showUserContextMenu");
	}
}
//============================================================//
function returnUserContextMenu(value)
{
	try {
		if(value == "select")
			doSelect();
		else
			window.lastControl.select();

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","returnUserContextMenu");
	}
}
//============================================================//
function buildJobsTable(parameters)
{
	try {
		parameters = parameters ? parameters : "";
		oFeedBack.show();
		var re = /\\/g;
		var parameters1 = parameters.replace(re, "\\\\");	 //necessary because using setTimeout
		setTimeout("buildJobsTable1('" + parameters1 + "')",10)

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","buildJobsTable");
	}
}
function buildJobsTable1(parameters)
{
	try {
		gJobSchedule = new portalWnd.ListObj();
		parameters = getParameters(parameters);

		if(!getJobScheduleList(parameters))
		{
			oFeedBack.hide();
			return;
		}
		
		if(!oJobScheduleTbl)
			createJobScheduleTable();
		else
			oJobScheduleTbl.clearTable();

		for (var i=0; i<gJobSchedule.length; i++)
		{
			var oJob = gJobSchedule.getMember(gJobSchedule.sortIndex[i]);
			addTableRow(oJob);
		}

		setLongName(g.longname);
		var title = portalObj.getPhrase("LBL_JOBS_SCHEDULE");
		title = title + " - " + g.username;
	
		// clear the active tab
		var tabCont = document.getElementById("tabContainer");
		var len = (tabCont && tabCont.childNodes && tabCont.childNodes.length 
				? tabCont.childNodes.length : 0);
		for (var i = 0; i < len; i++)
		{
			if (tabCont.childNodes[i].tagName == "DIV")
				tabCont.childNodes[i].className="";
		}


		var tabDiv = document.getElementById("div"+g.currentFilter);
		if (tabDiv)
		{
			tabDiv.className="activeTab";
			var tabImg = document.getElementById("imgTabBottom");
			tabImg.style.left=tabDiv.offsetLeft+11;
			tabImg.style.width=tabDiv.offsetWidth-2;
		}

		portalObj.setTitle(title);

		if(gJobSchedule.length > 0)
		{
			var oRow = oJobScheduleTbl.getFirstRow();
			if (oRow)
				oJobScheduleTbl.setCurrentRow(oRow);
		}
		else
			positionInFirstField();

		updateToolbar();
		updatePagingButtons();
		oFeedBack.hide();
		document.getElementById("footer").style.visibility = "visible";

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","buildJobsTable1");
	}
}
//============================================================//
function setLongName(longName)
{
	try {
		var oInput = document.getElementById("_f3");
		oInput.firstChild.nodeValue = longName;
	
	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","setLongName");
	}
}
//============================================================//
function setUserName(userName)
{
	try {
		var oInput = document.getElementById("_f2");
		oInput.value = userName;
		g.username = userName;

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","setUserName");
	}
}
//============================================================//
function setFilter(filter)
{
	try {
		g.currentFilter = filter;
		setTimeout("doInquire()",50);

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","setFilter");
	}
}
//============================================================//
function getUserName()
{
	try {
		var oInput = document.getElementById("_f2");
		return oInput.value;

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","getUserName");
	}
	return "";
}
//============================================================//
function getSelectedJob(oRow)
{
	try {
		if(!oRow)
		{
			var oRowsAry = oJobScheduleTbl.getSelectedRows();
			var oRow = (oRowsAry && oRowsAry.length > 0 
				? oRowsAry[0]
				: oJobScheduleTbl.getCurrentRow());
			if (!oRow) return null;
		}

		var listKey=oRow.getKey();
		return gJobSchedule.getMember(listKey);

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","getSelectedJob");
	}
	return null;
}
//============================================================//
function getTableWidth()
{
	try {
		var width = (portalObj.browser.isIE
			? document.body.offsetWidth - 45
			: window.innerWidth - 45);
		return width;

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","getTableWidth");
	}
	return 0;
}
//============================================================//
function getTableHeight()
{
	try {
		var containerElement = document.getElementById("jobScheduleContainer");
		var scrHeight = portalObj.browser.isIE 
				? document.body.offsetHeight 
				: window.innerHeight;
		var pixelsUsed = portalObj.contentFrame.offsetTop 
				+ containerElement.offsetTop - 10;

		return (scrHeight - pixelsUsed);

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","getTableHeight");
	}
	return 0;
}
//============================================================//
function getParameters(parameters)
{
	try {
		if(typeof(parameters)=="undefined")
			parameters="";

		if(g.searchMode=="FILTER")
			parameters=parameters+"&_FILTER=true";

		var defaultParameters="&_USERNAME=" + g.username + "&_PAGESIZE=" + g.pageSize;

		switch(g.currentFilter)
		{
			case "active":
				defaultParameters = "&_JOBSTATUS=activejobs" + defaultParameters;
				break;
			case "waiting":
				defaultParameters = "&_JOBSTATUS=waitingjobs" + defaultParameters;
				break;
			case "complete":
				defaultParameters = "&_JOBSTATUS=completedjobs" + defaultParameters;
				break;
			default:
				defaultParameters = "&_JOBSTATUS=completedjobs" + defaultParameters;
		}
		return (defaultParameters + parameters);

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","getParameters");
	}
	return "";
}
//============================================================//
function padJobNumber(jobNbr)
{
	try {
		var zerosToAdd 	= 10 - jobNbr.length 
		var strOfZeros	= "";

		for (var i=0; i<zerosToAdd; i++)
			strOfZeros += "0";

		return (strOfZeros + jobNbr)

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","padJobNumber");
	}
	return jobNbr;
}
//============================================================//
function createJobScheduleTable()
{
	try {
		var	tableParent = document.getElementById("jobScheduleTable");
		var height = getTableHeight();
		var tableWidth = getTableWidth();

		var labelAry = new Array()
		labelAry[0] = portalWnd.rptPhrases.getPhrase("lblJobName");
		labelAry[1] = portalWnd.rptPhrases.getPhrase("lblParameters");
		labelAry[2] = portalWnd.rptPhrases.getPhrase("lblJobQueue");
		labelAry[3] = portalWnd.rptPhrases.getPhrase("lblStartDate");
		labelAry[4] = portalWnd.rptPhrases.getPhrase("lblStopDate");
		labelAry[5] = portalWnd.rptPhrases.getPhrase("lblStatus");

		var widthAry = new Array()
		widthAry[0] = tableWidth * .15;
		widthAry[1] = tableWidth * .15;
		widthAry[2] = tableWidth * .15;
		widthAry[3] = tableWidth * .15;
		widthAry[4] = tableWidth * .15;
		widthAry[5] = tableWidth * .25;

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
			sourceAry[i] = "<COLUMN label=\"" + labelAry[i] + "\" width=\"" + widthAry[i] + 
				"\" labelalign=\"" + labelAlignAry[i] + "\" dataalign=\"" + dataAlignAry[i] + "\"/>";

		sourceAry.push("</COLUMNS>");
		sourceAry.push("</TABLE>");
		sourceAry.unshift("<COLUMNS>");
		sourceAry.unshift("<TABLE height=\"" + height + "\" ismultipleselect=\"true\" rowselectchange=\"updateToolbar()\">");
		sourceAry.unshift("<?xml version=\"1.0\"?>");

		var sourceString = sourceAry.join("");
		var xmlSource = portalWnd.cmnCreateXmlObjectFromString(sourceString);

		oJobScheduleTbl = new Table(document, tableParent, "oJobScheduleTbl", xmlSource);
		oJobScheduleTbl.showTitle(false);

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","createJobSchduleTable");
	}
}
//============================================================//
function addTableRow(oJob)
{
	try {
		var dataAry = new Array();
		dataAry[0] = portalWnd.xmlEncodeString(oJob.jobName);
		dataAry[1] = oJob.token;
		dataAry[2] = oJob.jobQueue;
		dataAry[3] = oJob.startDate + " " + oJob.startTime;
		dataAry[4] = oJob.stopDate + " " + oJob.stopTime;
		dataAry[5] = oJob.statusDescription;

		var sourceAry = new Array();

		for(var i=0; i<6; i++)
			sourceAry[i] = "<DATA>" + dataAry[i] + "</DATA>";

		sourceAry.push("</ROW>");
		sourceAry.unshift("<ROW key=\"" + oJob.listKey + "\">");
		sourceAry.unshift("<?xml version=\"1.0\"?>");

		var sourceString = sourceAry.join("");
		var xmlSource = portalWnd.cmnCreateXmlObjectFromString(sourceString);

		var oRow = oJobScheduleTbl.addRow(xmlSource);
		oRow.setOnDblClickFunc(doDefault);

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","addTableRow");
	}
}
//============================================================//
function handleKeyDown(evt)
{
	try {
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
					var oRow = oJobScheduleTbl.getCurrentRow();
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

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","handleKeyDown");
	}
	return evtCaught;
}
//============================================================//
function cntxtActionHandler(evt,action)
{
	try {
	
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
				setFilter("active");
				bHandled=true;
				break;
			case "doViewWaiting":
				setFilter("waiting");
				bHandled=true;
				break;
			case "doViewComplete":
				setFilter("complete");
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
				var oRow = oJobScheduleTbl.getCurrentRow();
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
			case "doTabPageDn":
				if (g.currentFilter == "active")
					setFilter("waiting");
				else if (g.currentFilter == "waiting")
					setFilter("complete");
				bHandled=true
				break;
			case "doTabPageUp":
				if (g.currentFilter == "waiting")
					setFilter("active");
				else if (g.currentFilter == "complete")
					setFilter("waiting");
				bHandled=true
				break;
			case "openNewWindow":
				if (!portalObj.drill.mode)
				{
					var url = "?_URL=reports/jobschedule.htm?_LOGIN=" + getUserName() + "&_FILTER=" + g.currentFilter;

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

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","cntxtActionHanderl");
	}
	return false;
}
//============================================================//
function getJobScheduleList(parameters)
{
	try {
		var jobScheduleNode=null;
		var navigationNode=null;
		var errorNode=null;
		var messageNode=null;
		g.lastCall = parameters;
		var jobScheduleCall=g.jobScheduleCall + parameters + "&_NOCACHE=" + new Date().getTime();

		var jobScheduleXml=portalWnd.httpRequest(jobScheduleCall,null,null,null,false);

		var msg=portalObj.getPhrase("msgErrorInvalidResponse") + " " +g.jobScheduleName+"\n";
		if (portalWnd.oError.isErrorResponse(jobScheduleXml,true,true,false,msg,window))
			return false;

		var oDS = portalWnd.oError.getDSObject();
		g.longname = !oDS.getRootNode().getAttribute("longName") ? "" : oDS.getRootNode().getAttribute("longName");
		
		var oJobNodes = oDS.getElementsByTagName("QUEUEDJOB");
		var len = oJobNodes.length;

		for (var i=0; i < len; i++)
			parseQueuedJobSchedule(oJobNodes[i]);

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

		if (g.previousKey == "" && g.searchMode!="FILTER")
			g.monitorKey = g.refreshKey;

		return true;

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","getJobScheduleList");
	}
	return false;
}
//============================================================//
function parseQueuedJobSchedule(node)
{
	try {
		var jobNbr=node.getAttribute("JOBNBR");
		var jobName=node.getAttribute("JOBNAME");
		var jobOwner=node.getAttribute("JOBOWNER");
		var jobQueue=node.getAttribute("JOBQUEUE");
		var startDate=node.getAttribute("STARTDATE");
		var startTime=node.getAttribute("STARTTIME");
		var stopDate=node.getAttribute("STOPDATE");
		var stopTime=node.getAttribute("STOPTIME");
		var actualStartDate=node.getAttribute("ACTUALSTARTDATE");
		var actualStartTime=node.getAttribute("ACTUALSTARTTIME");
		var status=node.getAttribute("STATUS");
		var pdl=node.getAttribute("PRODUCTLINE");
		var token=node.getAttribute("TOKEN");

		var myQueuedJob=new QueuedJob(portalWnd,jobNbr,jobName,jobOwner,jobQueue,
					startDate,startTime,stopDate,stopTime,actualStartDate,
					actualStartTime,status,pdl,token);
		gJobSchedule.addMember(myQueuedJob);

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","parseQueuedJobSchedule");
	}
}
//============================================================//
function jobScheduleResize()
{
	try {
		if (oFeedBack && typeof(oFeedBack.resize) == "function")
			oFeedBack.resize();

		if(!oJobScheduleTbl)
			return;

		var height = getTableHeight();
		oJobScheduleTbl.setHeight(height);

		var tableWidth = getTableWidth();

		var widthAry = new Array()
		widthAry[0] = tableWidth * .15;
		widthAry[1] = tableWidth * .15;
		widthAry[2] = tableWidth * .15;
		widthAry[3] = tableWidth * .15;
		widthAry[4] = tableWidth * .15;
		widthAry[5] = tableWidth * .25;

		for(var i=0; i<6; i++)
		{
			var oCol = oJobScheduleTbl.getColumnById(i);
			oCol.setWidth(widthAry[i]);
		}

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","jobScheduleResize");
	}
}
//============================================================//
function jobScheduleMouseOver(btn)
{
	try {
		if (btn.className == "anchorActive")
			btn.className = "anchorHover";
	} catch(e) { }
}
//============================================================//
function jobScheduleMouseOut(btn)
{
	try {
		if (btn.className == "anchorHover")
			btn.className="anchorActive";
	} catch(e) { }
}
//============================================================//
function jobScheduleBlur(mElement)
{
	try {
		if(mElement.className == "textBoxHighLight" || mElement.id == "_f2")
			mElement.className = "textbox";
		else
			mElement.className = "anchorActive";
	} catch(e) { }
}
//============================================================//
function jobScheduleFocus(mElement)
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
	try {
		document.body.style.cursor = "auto";
		portalObj.setMessage(portalObj.getPhrase("AGSREADY"));
	} catch(e) { }
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
		gJobSchedule=null;
		oDropDown=null;
		oJobScheduleTbl = null;

		if(oTimer)
		{
			oTimer.stopTimer();
			oTimer = null;
		}

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","unloadFunc");
	}
}
// QUEUEDJOB OBJECT ===========================================//
function QueuedJob(portalWnd,jobNbr,jobName,jobOwner,jobQueue,startDate,startTime,stopDate,stopTime,actualStartDate,actualStartTime,status,pdl,token)
{
	try {
		this.portalWnd=portalWnd;
		this.jobNbr=jobNbr;
		this.jobName=jobName;
		this.jobOwner=jobOwner;
		this.jobQueue=jobQueue;
		this.stopDate=stopDate;
		this.stopTime=stopTime;
		this.status=parseInt(status,10);
		this.pdl=pdl;
		this.token=token;

		//DERIVED ATTRIBUTES
		this.statusDescription = portalWnd.rptPhrases.getPhrase(this.status);

		if(this.status == 0  || this.status == 1)
			this.view="active";
		else if(this.status >= 60 && this.status <= 63)
			this.view="complete";
		else if(this.status >= 30 && this.status <= 37)
			this.view="waiting";
		else
			this.view="complete";

		if(this.view == "waiting")
		{
			this.startDate=(startDate!="")?startDate : actualStartDate;
			this.startTime=(startTime!="")?startTime : actualStartTime;
		}
		else
		{
			this.startDate=(actualStartDate!="")?actualStartDate:startDate;
			this.startTime=(actualStartDate!="")?actualStartTime:startTime;
		}

		if(this.startDate=="")
		{
			this.startDate	=""
			this.startTime = ""
		}
		else
		{
			this.startDate = portalWnd.edSetUserDateFormat(portalWnd.edGetDateTimeObjectFromLawsonDate(this.startDate))
			this.startTime = portalWnd.edFormatTime(this.startTime, 6)
		}

		if(stopDate=="")
		{
			this.stopDate	=""
			this.stopTime = ""
		}
		else
		{
			this.stopDate = portalWnd.edSetUserDateFormat(portalWnd.edGetDateTimeObjectFromLawsonDate(stopDate))
			this.stopTime = portalWnd.edFormatTime(stopTime, 6)
		}

		this.validActions = this.setValidActions();

	} catch(e) {
		this.portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","QueuedJob constructor");
	}
}
QueuedJob.prototype.setValidActions=function()
{
	try {
		var actionAry = new Array();
		actionAry["viewLog"]=true;
		actionAry["submit"]=true;
		actionAry["runImmediate"]=false;
		actionAry["recover"]=false;
		actionAry["delete"]=false;
		actionAry["kill"]=false;

		if(this.view=="active")
			actionAry["kill"]=true;
		else
			actionAry["delete"]=true;

		if (this.status == 30 || this.status == 32)
			actionAry["runImmediate"]=true;

		if (this.status == 34)
			actionAry["recover"]=true;

		return actionAry;

	} catch(e) {
		this.portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","QueuedJob.setValidActions");
	}
}
QueuedJob.prototype.isValidAction=function(action)
{
	try {
		return this.validActions[action];
	} catch(e) {
		this.portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","QueuedJob.isValidAction");
	}
	return "";
}
//============================================================//
function cntxtGetPrintContent()
{
	try {
		var elem = document.createElement("body");
		var sourceHTML = document.getElementById("jobScheduleContainer").innerHTML;
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

		var content = elem.document.getElementById("oJobScheduleTbl_content");
		content.style.overflow = "visible";
			
		var printHTML = elem.innerHTML;
		elem = null;
		return printHTML;

	} catch(e) {
		showReady();
		portalWnd.cmnErrorHandler(e,window,JOBSCHEDULEJS,"","cntxtGetPrintContent");
	}
}
//-----------------------------------------------------------------------------
function jobScheduleButtonFocus(btn)
{
	if (typeof(btn) == "undefined")
		return;
	try	{
		if (oHelp && oHelp.isVisible)
			oHelp.showFieldHelp(btn);
		else if (lawForm.fldHelp)
			portalWnd.frmToggleFieldHelp(window, btn.id);
		lastControl=btn;
		btn.className = (btn.className.substr(0,9) == "flowChart"
			 ? "flowChartButtonFocus" : "buttonOver" );

		var elemId=btn.id
		var rowNbr = -1;
		var pos=elemId.lastIndexOf("r")
		if (pos > 0)
		{
			portalWnd.frmSetActiveRow(window, btn)
			rowNbr=formState.currentRow
			elemId=elemId.substr(0,pos)+"r0"
		}
		if(typeof(BUTTON_OnFocus)=="function")
		{
			var btnItem=idColl.getItemByFld(elemId);
			BUTTON_OnFocus(btnItem.id,rowNbr);
		}
	} catch (e) { }
}
//-----------------------------------------------------------------------------
function jobScheduleButtonBlur(btn)
{
	btn.className = (btn.className.substr(0,9) == "flowChart"
		? "flowChartButton" : "");
}
