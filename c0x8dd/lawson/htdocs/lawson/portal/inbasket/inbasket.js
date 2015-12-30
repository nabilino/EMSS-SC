/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/inbasket/inbasket.js,v 1.11.4.4.4.19.6.17.2.3 2012/08/08 12:37:26 jomeli Exp $ */
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

var pfInbasket = null;
var portalWnd = null;
var portalObj = null;
var pfMsgs = null;
var gNextPrevURL = "";
var showDispatchAlert = true;

//-----------------------------------------------------------------------------
function inbOnLoad()
{
	portalWnd=envFindObjectWindow("lawsonPortal",window);
	if (!portalWnd)
			return;
	
	// load the script versions
	//envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	portalObj = portalWnd.lawsonPortal;
	portalObj.toolbar.clear();
	portalObj.setMessage("");
	gNextPrevURL = "";
	// instantiate phrase object
	pfMsgs = new portalWnd.phraseObj("inbasket");

	// instantiate inbasket object
	pfInbasket = new INBASKET(portalWnd,window);
	var args=unescape(document.location.search.substr(1));
	pfInbasket.bUser=portalWnd.getVarFromString("USER",args)=="TRUE" ? true : false;
	var taskId=portalWnd.getVarFromString("TASKID",args);
	pfInbasket.taskId = taskId;
	pfInbasket.getWorkObj();
		 
	// extend the portal help menu items
	buildHelpMenu();
}

//-----------------------------------------------------------------------------
function unloadInbasket()
{
	if(typeof(portal) != "undefined")
		portalObj.helpOptions.clearItems();
	
	portalWnd.formUnload();
}
//-----------------------------------------------------------------------------
function displayBlankPage()
{
	inbasketSwitchContents(false)
	var objFrame = document.getElementById("pfDetail")
	objFrame.src = "blank.htm?"
}

//-----------------------------------------------------------------------------
// getNextPrevious links in case the workobjects exceeds certain value
function displayNextPrev(mainDiv,nextUrl,prevUrl)
{
	if (nextUrl.length > 0 || prevUrl.length > 0)
	{					
		var oTableNP = window.document.createElement("TABLE")
		mainDiv.appendChild(oTableNP)
		oTableNP.id = "nextlink"
		oTableNP.align = "center"
		var oTheadNP = oTableNP.createTHead();
	
		var oRowNP, oColNP;
		oRowNP = oTheadNP.insertRow(0)
		if (nextUrl.length > 0)
		{
			oColNP = oRowNP.insertCell(0)
			oColNP.align = "center"
			oColNP.appendChild(pfInbasket.createSpanNP(pfMsgs.getPhrase("lblNext"), true,nextUrl))
		}
		if (prevUrl.length > 0)
		{
			oColNP = oRowNP.insertCell(0)
			oColNP.align = "center"
			oColNP.appendChild(pfInbasket.createSpanNP(pfMsgs.getPhrase("lblPrevious"), true,prevUrl))
		}
	}
}

//-----------------------------------------------------------------------------
// called by createSpan to get all the details attached to a workobject
// gets called when a user clicks on a workobject for action and details
function getDetails(e)
{
	portalObj.setMessage("");
	var oSpan = e ? e.currentTarget : window.event.srcElement;
	var retMsg = pfInbasket.showWorkObjDetails(oSpan.index);
}

//-----------------------------------------------------------------------------
// called by createSpanNP function to call the url associated to this span
// gets called when a user clicks on the next and previous button
function getNextPrev(e)
{
	var oSpan = e ? e.currentTarget : window.event.srcElement;
	pfInbasket.getWorkObj(oSpan.index)
}

//-----------------------------------------------------------------------------
function getWorkObjects(e)
{
	var oSpan = e ? e.currentTarget : window.event.srcElement;
	pfInbasket.displayWorkObjs(oSpan.index);
}

//-----------------------------------------------------------------------------
// go back to the work oject listing page after hiding the PAGE tab
function goBackToShowHome()
{
	portalObj.tabArea.tabs["HOME"].show();
	portalObj.tabArea.tabs["PAGE"].clearNavlets();
	portalObj.tabArea.tabs["PAGE"].hide();
	
	if (portalObj.browser.isIE && portalObj.browser.version < 6)
		displayBlankPage(); 
	pfInbasket.getWorkObj(gNextPrevURL);
	portalObj.toolbar.clear(); 
}

//-----------------------------------------------------------------------------
function inbasketHelp()
{
	var file="portal_inbasket_help.xml";
 	//portalWnd.openWindow("/lawson/inbasket/portalhelp/wwhelp.htm");
	var strLang = portalObj.getLanguage();
	var strURL="/servlet/Help?_LANG="+strLang+"&_FILE=inbasket/" + file +
				"&_PARMS=rootdir|"+ portalObj.path+"||onerror|portalAdminUserHelpError"; 
										

	if (portalWnd.helpWnd && !portalWnd.helpWnd.closed && portalWnd.lastHelp==file)
		portalWnd.helpWnd.focus();
	else if (portalWnd.helpWnd && !portalWnd.helpWnd.closed)
	{
		portalWnd.lastHelp=file;
		portalWnd.helpWnd.navigate(strURL);
		portalWnd.helpWnd.focus();
	}
	else
	{
		portalWnd.lastHelp=file;
		portalWnd.helpWnd = portalWnd.open(strURL, "_blank", "top=5,left=" + (screen.width-570) +
				",width=560,height=" + (screen.height-100) + 
				",status=no,resizable=yes,scrollbars=no");
	}
}

//-----------------------------------------------------------------------------
function inbasketOptions()
{
 	portalWnd.openWindow("/lawson/inbasket");
}

//-----------------------------------------------------------------------------
function inbasketDoAction(action, i)
{
	if (!confirm(action + " " + pfMsgs.getPhrase("cfmsg_ConfirmActionMsg")))
	return;	

	var goURL = pfInbasket.curWorkObj.getElementsByTagName("GOURL")[0].firstChild.nodeValue
	goURL += "&ACTION="+action
	
	var oReturn = portalWnd.httpRequest(goURL)
	if(oReturn.status)
	{
		portalObj.setMessage(pfMsgs.getPhrase("errMsg3"))
		portalWnd.cmnDlg.messageBox(pfMsgs.getPhrase("errMsg3"));
	}
	else
	{
		var workDisp = oReturn.getElementsByTagName("WORKDISPATCH")
		var errBool  = false;
		if (workDisp && workDisp.length > 0)
		{
			portalObj.setMessage(workDisp[0].getAttribute("returnmsg"))
			var msgType = workDisp[0].getAttribute("msgtype");
			if (msgType && (msgType == "Warning" || msgType == "Error"))
			{
				var msg = workDisp[0].getAttribute("returnmsg")
				if(msg.indexOf("already processed")>=0)
					msg = pfMsgs.getPhrase("msgWobProcessed");
				portalWnd.cmnDlg.messageBox(msg);
				portalObj.setMessage(msg);
				errBool = true;		
			}
			else
			{
				//PT 158827 - Amit K Shah - 1-Jun-06
				//Parameter to disable display of post WU Dispatch alert
				if(showDispatchAlert)
					portalWnd.cmnDlg.messageBox(workDisp[0].getAttribute("returnmsg"));
			}
		} 
		var postaction = pfInbasket.curWorkObj.getElementsByTagName("LISTACTION")
		postaction = postaction[i]
		if(postaction && postaction.firstChild)
		{
			if(postaction.firstChild.nodeValue != "")
			{
				window.open(postaction.firstChild.nodeValue,'Exec','scrollbars=yes,resizable=yes,height=500,width=600')
			}
		}
 
		goBackToShowHome();		
	}	
}

//-----------------------------------------------------------------------------
function inbasketDisplayDetails()
{
	var objFrame = document.getElementById("pfDetail")
	var display = pfInbasket.curWorkObj.getAttribute("displayexec")
	var preexec = pfInbasket.curWorkObj.getAttribute("preexec")
	buildLeftBar();
	if(preexec != "")
	{
		if (preexec.indexOf(".xml") >= 0)
		{
			var portalPgURL1 = portalObj.path+"/pages/index.htm?FILE=" + preexec
			var variables1 = pfInbasket.curWorkObjDetail.getElementsByTagName("VARIABLE")
			for (var i=0; i < variables1.length; i++)
			{
				var variable1Value = ""
				if (variables1[i].firstChild) 
				{
					variable1Value = escape(variables1[i].firstChild.nodeValue)
				}
				portalPgURL1 += "&" + variables1[i].getAttribute("name") + "=" + variable1Value
			}
			inbasketSwitchContents(false)
			objFrame.src = portalPgURL1
		}
		else
		{
			inbasketSwitchContents(false)
			objFrame.src = pfInbasket.curWorkObj.getElementsByTagName("PREEXECURL")[0].firstChild.nodeValue
		}
	}
	else if (display.indexOf(".xml") >= 0)
	{
		// Get the work variables and attach it to the end of the portal page url
		var portalPgURL = portalObj.path+"/pages/index.htm?FILE=" + display
		var variables = pfInbasket.curWorkObjDetail.getElementsByTagName("VARIABLE")
		for (var i=0; i < variables.length; i++)
		{
			var variableValue = "";
			if (variables[i].firstChild) 
			{
				variableValue = escape(variables[i].firstChild.nodeValue);
			}
			portalPgURL += "&" + variables[i].getAttribute("name") + "=" + variableValue
		}
		inbasketSwitchContents(false)
		objFrame.src = portalPgURL	
	}
	else if(display != "")
	{
		// This is not a portal page. Just switchContents to it
		inbasketSwitchContents(false)
		objFrame.src = pfInbasket.curWorkObj.getElementsByTagName("DISPLAYEXECURL")[0].firstChild.nodeValue.replace("/bpm/htmlinbasket/inbasket/execs/dev", "/lawson/portal/inbasket/execs/dev")
	}
	else
	{
		//No Display exec or pre exec has been set.
		//Check for folders of type Landmark and display the 1st one.
		//If no folders of landmark type, show the default display.
		var folders = pfInbasket.curWorkObjDetail.getElementsByTagName("FOLDER")
		var landmarkFolderFound = false
		var landmarkFolderURL = ""
		for (var i=0; i < folders.length; i++)
		{
		
			var errMsg = folders[i].getElementsByTagName("FOLDERERROR")
			if(errMsg && errMsg.length > 0) {	
				errMsg = "" + errMsg[0].firstChild.nodeValue
			} else {
				errMsg=""
			}
	
			if (errMsg != "") 
			{ 
				errMsg="&_FOLDERERROR=" + errMsg
			}
			if(folders[i].getAttribute("type") == "LANDMARK") {
				var temp = folders[i].getElementsByTagName("FOLDERURL")
				landmarkFolderURL = temp[0].firstChild.nodeValue+errMsg
				landmarkFolderFound = true
				break
			}
		}
		if(landmarkFolderFound) {
			inbasketSwitchContents(false)
			objFrame.src = landmarkFolderURL
		} else {
			inbasketSwitchContents(true)
			pfInbasket.displayWorkObjs(true)
		}
	}
}

//-----------------------------------------------------------------------------
function inbasketDisplayFolders()
{
	//PT 146685 - Jyothi.m - 10-10-05
	//inbasket doesn't remove titles for custom xml for 
	portalObj.setTitle(pfInbasket.taskDescription);
	inbasketSwitchContents(false);
	var objFrame = document.getElementById("pfDetail")
	objFrame.src = "pfdetail.htm?FOLDER"
}

//-----------------------------------------------------------------------------
function inbasketDisplayMessages()
{
	//PT 146685 - Jyothi.m - 10-10-05
	//inbasket doesn't remove titles for custom xml for 
	portalObj.setTitle(pfInbasket.taskDescription);
	inbasketSwitchContents(false)
	var objFrame = document.getElementById("pfDetail")
	objFrame.src = "pfdetail.htm?MESSAGE"
}

//-----------------------------------------------------------------------------
function inbasketDisplayHistory()
{
	//PT 146685 - Jyothi.m - 10-10-05
	//inbasket doesn't remove titles for custom xml for 
	portalObj.setTitle(pfInbasket.taskDescription);
	inbasketSwitchContents(false)
	var objFrame = document.getElementById("pfDetail")
	objFrame.src = "pfdetail.htm?HISTORY"
}

//-----------------------------------------------------------------------------
function inbasketSwitchContents(bMain)
{
	 var objDiv = document.getElementById("pfdiv")
	 var objFrame = document.getElementById("pfDetail")
	 if (bMain)
	 {
 		 objFrame.style.display = "none"
 		 objFrame.style.height = "100%";
 		 objFrame.style.width = "100%";
 		 objDiv.style.display = ""
 		 objDiv.style.height = "100%";
 		 objDiv.style.width = "100%";
	 }
	 else
	 {
 		 objDiv.style.display = "none"
 		 objDiv.style.height = "100%";
 		 objDiv.style.width = "100%";
 		 objFrame.style.display = ""
 		 objFrame.style.height = "100%";
 		 objFrame.style.width = "100%";
	 }
}


//-----------------------------------------------------------------------------
// INBASKET object constructor
function INBASKET(portalWnd,wnd)
{
	this.wnd=wnd;
	this.portalWnd=portalWnd;
	this.portalObj=portalWnd.lawsonPortal;
	this.taskId = "";
	this.taskDescription = "";	
	this.workObjs = null;
	this.curWorkObj = null;
	this.curWorkObjDetail = null;
	this.bUser = false;
}
//-----------------------------------------------------------------------------
INBASKET.prototype.createSpan=function(colText, bBold, anchor)
{
	var oSpan = this.wnd.document.createElement("SPAN");
	oSpan.className = "cellText";
	oSpan.style.fontWeight = bBold ? "bold" : "normal";
	if (typeof(anchor) != "undefined")
	{
		oSpan.style.textDecoration = "underline"
		oSpan.style.cursor = (this.portalObj.browser.isIE ? "hand" : "pointer");
		oSpan.index = anchor
		oSpan.onclick = getDetails
	}
	oSpan.appendChild(this.wnd.document.createTextNode(colText))
	return oSpan;
}
//-----------------------------------------------------------------------------
INBASKET.prototype.createSpanNP=function(colText, bBold, npURL)
{
	var oSpan = this.wnd.document.createElement("SPAN");
	oSpan.className = "cellText";
	oSpan.style.fontWeight = bBold ? "bold" : "normal";
	if (typeof(npURL) != "undefined")
	{
		oSpan.style.textDecoration = "underline"
		oSpan.style.cursor = (this.portalObj.browser.isIE ? "hand" : "pointer");
		oSpan.index = npURL // the next previous URL
		oSpan.onclick = getNextPrev
	}
	oSpan.appendChild(this.wnd.document.createTextNode(colText))
	return oSpan;
}
//-----------------------------------------------------------------------------
// fetches all the workobject details under a workobject. 
// makes a FUNCTION=workdetail call to the inbasket servlet
INBASKET.prototype.displayWorkObjs=function(bCurWorkObj)
{
	var mainDiv = this.wnd.document.getElementById("pfdiv")
	if(mainDiv.firstChild)
		mainDiv.removeChild(mainDiv.firstChild)

	if(mainDiv.firstChild)
		mainDiv.removeChild(mainDiv.firstChild)

	if(mainDiv.firstChild)
		mainDiv.removeChild(mainDiv.firstChild)

	if(mainDiv.firstChild)
		mainDiv.removeChild(mainDiv.firstChild)

	var oTable = this.wnd.document.createElement("TABLE")
	mainDiv.appendChild(oTable)
	oTable.id = "workObjs"
	oTable.align = "center"
	var oThead = oTable.createTHead();

	var oRow, oCol;
	oRow = oThead.insertRow(0)
	oCol = oRow.insertCell(0)
	oCol.align = "center"
	oCol.appendChild(this.createSpan(this.wnd.pfMsgs.getPhrase("lblWorkUnit"), true))

	oCol = oRow.insertCell(1)
	oCol.align = "center"
	oCol.appendChild(this.createSpan(this.wnd.pfMsgs.getPhrase("LBL_DESCRIPTION"), true))

	oCol = oRow.insertCell(2)
	oCol.align = "center"
	oCol.appendChild(this.createSpan(this.wnd.pfMsgs.getPhrase("lblWorkCatgry"), true))

	oRow = oThead.insertRow(1)
	oCell = oRow.insertCell(0)
	oCell.colSpan = 3
	var oHr = document.createElement("HR")
	oHr.size = "0"
	oHr.noShade = true
	oCell.appendChild(oHr)

	var oTbody = this.wnd.document.createElement("TBODY")
         
	oTable.appendChild(oTbody)
	if (!bCurWorkObj)
	{
		var wobjs = this.workObjs.getElementsByTagName("WORKOBJECT")
		for (var i=0; i < wobjs.length; i++)
		{
			oRow = oTbody.insertRow(i)
			oCol = oRow.insertCell(0)
			oCol.appendChild(this.createSpan(wobjs[i].getAttribute("workunit"), false))

			oCol = oRow.insertCell(1)
			// Changed as part of PT 131609
			oCol.appendChild(this.createSpan(wobjs[i].getElementsByTagName("WORKTITLE")[0].firstChild.nodeValue, false, i))
			
			oCol = oRow.insertCell(2)
			oCol.appendChild(this.createSpan(wobjs[i].getAttribute("workcatval"), false))
		}
		var nextUrl="";
		if(this.workObjs.getElementsByTagName("NEXTURL")!=null && this.workObjs.getElementsByTagName("NEXTURL")[0] !=null &&
			this.workObjs.getElementsByTagName("NEXTURL")[0].firstChild!=null)
		{
			nextUrl = this.workObjs.getElementsByTagName("NEXTURL")[0].firstChild.nodeValue
		}

		var prevUrl = "";
		if(this.workObjs.getElementsByTagName("PREVURL")!=null && this.workObjs.getElementsByTagName("PREVURL")[0]!=null &&
		 	this.workObjs.getElementsByTagName("PREVURL")[0].firstChild!=null)
		{
			prevUrl = this.workObjs.getElementsByTagName("PREVURL")[0].firstChild.nodeValue
		}
		this.wnd.displayNextPrev(mainDiv,nextUrl,prevUrl);				
	}
	else
	{
		oRow = oTbody.insertRow(0)
		oCol = oRow.insertCell(0)
		oCol.appendChild(this.createSpan(this.curWorkObj.getAttribute("workunit"), false))

		oCol = oRow.insertCell(1)
		//oCol.appendChild(this.createSpan(this.curWorkObj.getAttribute("worktitle"), false))
		oCol.appendChild(this.createSpan(this.curWorkObj.getElementsByTagName("WORKTITLE")[0].firstChild.nodeValue, false))
			

		oCol = oRow.insertCell(2)
		oCol.appendChild(this.createSpan(this.curWorkObj.getAttribute("workcatval"), false))
	}
}
//PT 161782 - Mukesh Upadhyay - 14-Sep-06
//ProcessFlow Task Description w/special char - not displaying 

function encodeHTML(str)
{
       
	while(str.indexOf('<')!=-1)
	{
	str = str.replace("<","&lt;")
	}
	
	while(str.indexOf('>')!=-1)
	{
	str = str.replace(">","&gt;")
	}

  return str
}

//-----------------------------------------------------------------------------
// fetches all the workobjects under a test. 
// makes a FUNCTION=gettasks call to the inbasket servlet
INBASKET.prototype.getWorkObj=function(nextPrevURL)
{
	this.wnd.gNextPrevURL = nextPrevURL;
	var taskNodes = this.portalObj.profile.getElementsByTagName("TASK")
	var userTaskNodes = portalObj.profile.getElementsByTagName("USERTASKS")
	var Description = portalObj.profile.getElementsByTagName("DESCRIPTION")
	var taskNode = null;
	var taskNavletObj = null;
	var getWobjURL;

	//PT 158827 - Amit K Shah - 3-Jun-06
	//Parameter to disable display of post WU Dispatch alert
	if (userTaskNodes != null && userTaskNodes[0].getAttribute("wu_dispatch_alert") != null) {
		showDispatchAlert = userTaskNodes[0].getAttribute("wu_dispatch_alert").toLowerCase() == "true";
	}

	if (taskNodes.length > 0 )
	{
		for (var i=0; i < taskNodes.length; i++)
		{
			if (taskNodes[i].getAttribute("id") == this.taskId)
			{
				taskNode = taskNodes[i];

				//PT 161782 - Mukesh Upadhyay - 14-Sep-06
				//ProcessFlow Task Description w/special char - not displaying 				
				this.taskDescription = encodeHTML(Description[i].firstChild.nodeValue)
				portalObj.setTitle(this.taskDescription);
				//PT 153778 - Amit K Shah - 4-Jan-06
				//* does not get removed when all wobs are actioned.
				taskNavletObj = portalObj.tabArea.tabs["HOME"].navletObjects["inbasket"].items["inbaskettask"+i];
				break;
			}
		}
	}
	if (taskNode)
	{
		var dtlurl = taskNode.getElementsByTagName("TASKDETAILURL")
		getWobjURL = dtlurl[0].firstChild.nodeValue
	}
	else if(this.bUser)
	{
		getWobjURL = "/bpm/inbasket?RDUSER="+this.taskId+"&FUNCTION=getuserwobs&PAGE=NEXT";
		taskNavletObj = portalObj.tabArea.tabs["HOME"].navletObjects["inbasket"].items["inbaskettask"+(taskNodes.length+1)];
	}

	// if nextPrevURL is undefined or null do the usual stuff
	// else invoke the url to get details
	if (typeof(nextPrevURL) != "undefined")
		getWobjURL = nextPrevURL;				

	var dt = new Date();
	var t1 = Date.UTC(dt.getYear(), dt.getMonth(), dt.getDate(),
			dt.getHours(),dt.getMinutes(),dt.getSeconds(),dt.getMilliseconds())
	t1 = "&t="+t1;
			
	this.workObjs = this.portalWnd.httpRequest(getWobjURL+t1);
	if (this.workObjs.status)
	{
		this.portalObj.setMessage(pfMsgs.getPhrase("errMsg1"))
		this.workObjs = null
	}
	else
	{
		//PT 153778 - Amit K Shah - 4-Jan-06
		//* does not get removed when all wobs are actioned.
		if(this.workObjs.getElementsByTagName("WORKOBJECT").length == 0) {
			var taskDispName = taskNavletObj.name;
			if(taskDispName.substr(taskDispName.length-1,1) == '*') {
				taskNavletObj.name = taskDispName.substr(0,taskDispName.length-1);
				taskNavletObj.htmlElement.childNodes[0].innerHTML = taskNavletObj.htmlElement.childNodes[0].innerHTML.replace(taskNavletObj.name+'\*',taskNavletObj.name);
			}
		} else {
			var taskDispName = taskNavletObj.name;
			if(taskDispName.substr(taskDispName.length-1,1) != '*') {
				taskNavletObj.name = taskDispName + '*';
				taskNavletObj.htmlElement.childNodes[0].innerHTML = taskNavletObj.htmlElement.childNodes[0].innerHTML + '*';
			}
		}

		this.wnd.inbasketSwitchContents(true)
		this.displayWorkObjs(false);
	}
}
//-----------------------------------------------------------------------------
INBASKET.prototype.showWorkObjDetails=function(index)
{
	var wobjs = this.workObjs.getElementsByTagName("WORKOBJECT")
	this.curWorkObj = wobjs[index]
	var detailURL = this.curWorkObj.getElementsByTagName("DETAILURL")[0].firstChild.nodeValue
	var dt = new Date();
	var t1 = Date.UTC(dt.getYear(), dt.getMonth(), dt.getDate(),dt.getHours(),
			dt.getMinutes(),dt.getSeconds(),dt.getMilliseconds())
	t1 = "&t="+t1;
	
	this.curWorkObjDetail = this.portalWnd.httpRequest(detailURL+t1)
	var retMsg = "";
	if (this.curWorkObjDetail.status)
	{
		retMsg += this.wnd.pfMsgs.getPhrase("errMsg2");
		this.curWorkObjDetail = null
		return;
	}
	else
	{
		var stack = this.curWorkObjDetail.getElementsByTagName("STACKTRACE")
		if (stack && stack.length > 0)
		{
			retMsg = this.wnd.pfMsgs.getPhrase("errMsg2");
			this.portalObj.setMessage(retMsg)
			return;
		}

		var root = this.curWorkObjDetail.getElementsByTagName("WORKDETAILS")
		if (root && root.length > 0)
		{
			var msgType = root[0].getAttribute("msgtype");
			if (msgType != "normal")
			{
				retMsg += msgType + ":" + root[0].getAttribute("returnmsg");
				this.portalWnd.cmnDlg.messageBox(retMsg);
				this.portalObj.setMessage(retMsg);
				return;
			}
		}
	}

	this.wnd.buildLeftBar();
	this.wnd.inbasketDisplayDetails();
	this.wnd.buildToolbar();
}
//-----------------------------------------------------------------------------
function buildPortalFramework()
{
	//Portal Title
	portalObj.setTitle(pfInbasket.taskDescription);
	//Portal Toolbar
	buildToolbar();		
	//Portal Left Bar
	buildLeftBar();
	//Portal Help
	buildHelpMenu();
}
//-----------------------------------------------------------------------------
function buildToolbar()
{
	portalObj.toolbar.clear()
	portalObj.toolbar.target = window
	portalObj.toolbar.createButton(pfMsgs.getPhrase("lblGoBack"), 
			"goBackToShowHome()", "btnIdGoBack")
}
//-----------------------------------------------------------------------------
function buildLeftBar()
{
	portalObj.tabArea.tabs["PAGE"].clearNavlets();
	var navletObj = portalObj.tabArea.tabs["PAGE"].addNavlet(pfMsgs.getPhrase("lblActions"), "inbasketActions", window);
	var actions = pfInbasket.curWorkObj.getElementsByTagName("LISTACTION");
	
	for(var i = 0; i<actions.length; i++)
		navletObj.addItem("action"+i, actions[i].getAttribute("action"), "inbasketDoAction('" + actions[i].getAttribute("action") + "'," + i + ")")

	var folders = pfInbasket.curWorkObjDetail.getElementsByTagName("FOLDER")
	var messages = pfInbasket.curWorkObjDetail.getElementsByTagName("MESSAGE")
	var history = pfInbasket.curWorkObjDetail.getElementsByTagName("WORKITEM")
	var foldelLbl = pfMsgs.getPhrase("lblFolders")
	var messageLbl = pfMsgs.getPhrase("lblMessages")
	var historyLbl = pfMsgs.getPhrase("lblHistory")

	if(folders.length > 0)
		foldelLbl=foldelLbl+"*"
	if(messages.length > 0)
		messageLbl=messageLbl+"*"
	if(history.length > 0)
		historyLbl=historyLbl+"*"

	var listMessage="";
	if(pfInbasket.curWorkObj.getElementsByTagName("LISTMESSAGE")[0]!=null && pfInbasket.curWorkObj.getElementsByTagName("LISTMESSAGE")[0].firstChild)
	  listMessage= pfInbasket.curWorkObj.getElementsByTagName("LISTMESSAGE")[0].firstChild.nodeValue

	if(listMessage.length ==0)
		listMessage=pfInbasket.curWorkObj.getElementsByTagName("WORKTITLE")[0].firstChild.nodeValue

	navletObj = portalObj.tabArea.tabs["PAGE"].addNavlet(listMessage, "inbasketDetails", window);
	navletObj.addItem("details1", pfMsgs.getPhrase("lblDisplay"), "inbasketDisplayDetails()");
	navletObj.addItem("details2", foldelLbl, "inbasketDisplayFolders()");
	navletObj.addItem("details3", messageLbl, "inbasketDisplayMessages()");
	navletObj.addItem("details4", historyLbl, "inbasketDisplayHistory()");

	portalObj.tabArea.tabs["PAGE"].setTitle(pfInbasket.curWorkObj.getElementsByTagName("WORKTITLE")[0].firstChild.nodeValue);
	portalObj.tabArea.tabs["PAGE"].show();
}
//-----------------------------------------------------------------------------
function buildHelpMenu()
{
	if(typeof(portalObj) != "undefined")
	{
		var strHelp = pfMsgs.getPhrase("lblInbasket") + " " + pfMsgs.getPhrase("LBL_HELP");
		var strOptions = pfMsgs.getPhrase("lblInbasket") + " " + "Options";
		portalObj.helpOptions.clearItems();
		portalObj.helpOptions.addItem(strHelp, strHelp, "inbasketHelp()", window);
	}
}

function handleKeyDown(evt)
{
	var evtCaught = false;
	
	evt = portalWnd.getEventObject(evt);
	if (!evt)
		return false;
	
	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"processFlow");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "processFlow")
	{
		evtCaught=cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt);
		return false;
	}
	
	return evtCaught;
}

function cntxtActionHandler(evt,action)
{
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"processFlow");
		if (!action || action=="processFlow")
			return false;
	}

	var bHandled=false;

	switch(action)
	{
		case "posInNavbar":
		 	posInNavbar();
		 	bHandled=true;
		 	break;
	}
	
	return (bHandled);
}

function posInNavbar()
{
	try{
		var oNavlet = portalObj.tabArea.tabs["PAGE"].getNavlet("inbasketActions");

		if(!oNavlet)
			oNavlet = portalObj.tabArea.tabs["HOME"].getNavlet("inbasket");		
	
		if(oNavlet)
			oNavlet.selectFirst();
	}catch(e){}
}
