/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/reports/jobsubmit.js,v 1.20.2.21.4.13.6.2.2.9 2012/08/08 12:37:19 jomeli Exp $ */
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

window.document.title = wndArguments ? wndArguments[2] : window.document.title;

var portalWnd = null;
var portalObj = null;
var oDropDown=null;
var oJob=null;
var gQueueAry = null;
var keyStr = "";
var keyTime = null;

function init()
{
	if (wndArguments)
		portalWnd = wndArguments[0];
	else
		portalWnd=envFindObjectWindow("lawsonPortal");
	if (!portalWnd) return;

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	portalObj=portalWnd.lawsonPortal;
	portalObj.setMessage("");

	//load phrases
	portalWnd.rptPhrases = new portalWnd.phraseObj("reports");
		
	// get job object reference
	oJob = portalWnd.oJob;
	if (oJob == null)
	{
		portalWnd.history.back();
		portalWnd.hideDrillFrame();
		return;
	}
	
	var allowJobQ = portalWnd.oUserProfile.getAttribute("allowjobqueue");

	if(allowJobQ == "N")
	{
		var jobQueueParamElem = document.getElementById("jobQueueParam");
		jobQueueParamElem.style.display = "none";
		
		if(portalObj.browser.isIE)
		{
			var toolBarElement = document.getElementById("toolBarDiv");
			toolBarElement.style.pixelTop = 85;
			window.dialogHeight = "155px";
		}
	}
	
	// set title of page
	if (!portalObj.browser.isIE)
		portalObj.setTitle(portalWnd.rptPhrases.getPhrase("lblJobSubmit"));

	// Initialize toolbar
	buildToolbar();

	// update label/fields
	var txtObj = document.getElementById("jobName");
	portalWnd.cmnSetElementText(txtObj,oJob.jobName)
	txtObj = document.getElementById("userName");
	portalWnd.cmnSetElementText(txtObj,oJob.userName)
	txtObj = document.getElementById("lblJobName");
	portalWnd.cmnSetElementText(txtObj,portalWnd.rptPhrases.getPhrase("lblJobName"));
	txtObj = document.getElementById("lblJobQueue");
	portalWnd.cmnSetElementText(txtObj,portalWnd.rptPhrases.getPhrase("lblJobQueue"));
	txtObj = document.getElementById("lblUserName");
	portalWnd.cmnSetElementText(txtObj,portalWnd.rptPhrases.getPhrase("lblUserName"));
	txtObj = document.getElementById("lblStartDate");
	portalWnd.cmnSetElementText(txtObj,portalWnd.rptPhrases.getPhrase("lblStartDate"));
	txtObj = document.getElementById("lblStartTime");
	portalWnd.cmnSetElementText(txtObj,portalWnd.rptPhrases.getPhrase("lblStartTime"));

	document.body.style.visibility = "visible";
	document.body.style.overflow = "hidden";
	posInFirstFld();
}

function submitThisJob()
{
	var frmtStartDate=""
	var startDate = document.getElementById("startDate");
	var startTime = document.getElementById("startTime");
	var jobQueue = document.getElementById("jobQueue");
	
	if(!validateQueue(jobQueue)) return;
	if(!validateDate(startDate)) return;
	if(!validateTime(startTime)) return;
		
	// if a date is selected then time can't be blank
	if (startDate.value != "" && startTime.value=="")
	{
		var msg =portalWnd.rptPhrases.getPhrase("msgInvalidSubmitTime1");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		startTime.focus();
		return;
	}
	
	if (startDate.value != "")
	{
		var oStartDate = portalWnd.edGetDateObject(startDate.value);
		frmtStartDate = portalWnd.edFormatLawsonDate(oStartDate);
	}	

	oJob.startTime = startTime.value;
	oJob.startDate = frmtStartDate;
	oJob.jobQueue = jobQueue.value;

	portalObj.setMessage(portalWnd.rptPhrases.getPhrase("msgSubmitting"));	
 	var runXML = oJob.submitJob();

	var msg = "";
	if (portalWnd.oError.isErrorResponse(runXML,true,true,false,msg,window))
	{
		msg=portalObj.getPhrase("JOBRUN_ERROR1");
	}

	try { msg=portalWnd.oError.getDSMessage(); } catch (e) { }
	closeJobSubmit(msg);
}
function showQueues()
{
	if(!gQueueAry)
		getJobQueues();
		
	if (!window.oDropDown)
		window.oDropDown=new window.Dropdown(portalWnd);
		
	window.oDropDown.clearItems();	
	var loop = gQueueAry.length;
	
	for(var i=0;i<loop;i++)
	{
		var queueName = gQueueAry[i].queueName
		var queueValue = gQueueAry[i].queueValue

		oDropDown.addItem(queueName,queueValue);
	}

	var jobQueueElm = document.getElementById("jobQueue");
	window.oDropDown.show(jobQueueElm.value, jobQueueElm, "showQueuesReturn");
}
function showQueuesReturn(queue)
{
	var jobQueueElm = document.getElementById("jobQueue");
	
	if (queue == null)
	{
		jobQueueElm.select();
		return;
	}	

	jobQueueElm.value = queue;
	jobQueueElm.select();
}

function getJobQueues()
{
	gQueueAry = new Array();
	var queueObj = new Object();
	queueObj.queueName = "          ";
	queueObj.queueValue = "";
	gQueueAry.unshift(queueObj);
	
	var api=portalWnd.IDAPath + "?_OUT=XML&_TYP=SL&_KNB=@jq&_RECSTOGET=1000"
	var oJobQueueXml = portalWnd.httpRequest(api,null,null,null,false);

	var msg=portalObj.getPhrase("msgErrorInvalidResponse") + " "+portalWnd.IDAPath+".\n\n";
	if (portalWnd.oError.isErrorResponse(oJobQueueXml,true,true,false,msg,window))
		return false;
		
	var oDS = portalWnd.oError.getDSObject();
	var len = oDS.getNodeByName("LINES").getAttribute("count");
	for (var i=0; i < len; i++)
	{
		var queueObj = new Object();
		queueObj.queueName = oDS.getElementsByTagName("COL")[i].firstChild.nodeValue;
		queueObj.queueValue = oDS.getElementsByTagName("KEYFLD")[i].firstChild.nodeValue;
		
		gQueueAry.push(queueObj);
	}
}

function showCalendar(window, fld)
{
	var mElement=window.document.getElementById(fld)
	window.lastControl=mElement

	var strDate = mElement.value
	var oDate=null
	if (strDate!="")
		oDate=portalWnd.edGetDateObject(strDate)
	if (!oDate || isNaN(oDate))
		oDate = new Date()

	if (!window.oDropDown)
		window.oDropDown=new window.Dropdown(portalWnd)
	
	window.oDropDown.show(oDate, mElement, "calendarSel")
}
function calendarSel(date)
{	
	var mElement=lastControl
	if (date)
	{
		var strDate=portalWnd.edSetUserDateFormat(date)
		mElement.value = strDate;
	}
	mElement.focus()
	mElement.select()
}
function fieldFocus(mElement)
{	
	mElement.className = "textBoxHighLight";
	mElement.select();
}
function fldOnBlur(mElement)
{
	mElement.className = "textbox"
	
	var edit = mElement.getAttribute("edit");
	
	if(edit == "date")
		validateDate(mElement);
	
}
function validateDate(mElement)
{
	if(mElement.value=="")
		return true;
		
	mElement.className = "textbox";
	portalWnd.edValidateDateLength(mElement)			 
	mElement.value = portalWnd.edFormatDate(mElement.value);
		
	if (mElement.value=="")
	{
		
		var msg = portalWnd.rptPhrases.getPhrase("msgInvalidSubmitDate");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		mElement.focus();
		return false;
	}

	var oStartDate = portalWnd.edGetDateObject(mElement.value);
	var oTodayDate = new Date();
	var oTodayDate1 = new Date(oTodayDate.getFullYear(),oTodayDate.getMonth(), oTodayDate.getDate()) 
	
	if(oStartDate && oStartDate < oTodayDate1)
	{	
		var msg = portalWnd.rptPhrases.getPhrase("msgInvalidSubmitDate1");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		mElement.value = "";
		mElement.focus();
		return false;
	}	
	
	return true;		
}
function validateTime(mElement)
{
	
	var startTime = mElement.value;
	
	if(startTime == "")
		return true;
		
	mElement.className = "textbox";

	// time must be four digits - 0 pad to the left
	while (startTime.length < 4)
		startTime = "0" + startTime;
		
	var startHour = startTime.substring(0,2);
	var startMinute = startTime.substring(2,4);

	if(startTime == "0000" || startHour > 23 || startMinute > 59)
	{			
		var msg = portalWnd.rptPhrases.getPhrase("msgInvalidSubmitTime");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		mElement.focus();
		return false;
	}			
	mElement.value = startTime;
	return true;
}
function validateQueue(mElement)
{
	mElement.value = portalWnd.trim(mElement.value);
	
	if(mElement.value=="")
		return true;

	if(!gQueueAry)
		getJobQueues();
		
	var loop = gQueueAry.length;
	
	for(var i=0; i<loop; i++)
	{
		if(mElement.value.toLowerCase() == gQueueAry[i].queueName.toLowerCase())
			return true;
	}
		
	var msg = portalWnd.rptPhrases.getPhrase("msgInvalidQueue");
	portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
	mElement.focus();
	return false;	

}
function handleKeyDown(evt)
{
	var evtCaught = false;
	var keyVal=null;
	
	evt = portalWnd.getEventObject(evt);
	if (!evt) return false;

	if (portalObj.browser.isIE)
	{
		// get portal hotkey action
		var action = portalObj.keyMgr.getHotkeyAction(evt, "portal");
		// hotkey defined for this keystroke
		if (action != null)
		{
			cntxtActionHandler(evt, action);
			portalWnd.setEventCancel(evt);
			return false;
		}
	}
	else
	{
		// check with portal for hotkey action
		var action = portalWnd.getFrameworkHotkey(evt, "erpReporting");
		if (!action)
		{
			// framework handled the keystroke
			portalWnd.setEventCancel(evt)
			return false;
		}

		// hotkey defined for this keystroke
		if (action != "erpReporting")
		{
			cntxtActionHandler(evt, action);
			portalWnd.setEventCancel(evt);
			return false;
		}
	}
	
	var keyVal = (portalObj.browser.isIE) ? evt.keyCode : evt.charCode ;
	
	if (keyVal == 0)	// netscape only
		keyVal = evt.keyCode;
	
	switch(keyVal)
	{
		case 13://ENTER
			var mElement = portalWnd.getEventElement(evt);
			
			if(mElement && mElement.id == "jobQueue")
			{
				showQueues();
				evtCaught = true;
			}
			else if(mElement && mElement.id == "startDate")
			{
				showCalendar(window, "startDate");
				evtCaught = true;
			}
			else(mElement.onclick && typeof(mElement.onclick) == "function")
			{
				mElement.click();
				evtCaught = true;
			}
			break;
	}

	if (evtCaught)
		portalWnd.setEventCancel(evt);
		
	return evtCaught;	
}

function autoComplete(evt)
{
	var mElement = portalWnd.getEventElement(evt);
	var newTime = new Date().getTime();


	if(mElement && mElement.id == "jobQueue" && evt.keyCode != 8) //skip autoComplete when backspacing
	{
		if(!gQueueAry)
			getJobQueues();
		var keyStr = mElement.value.toUpperCase();
		
		if( keyStr.length < 1 )
		{
			return
		}
		if(keyTime != null && newTime - keyTime < 1000)
		{
			for( var nI = 0; nI < gQueueAry.length; nI++ )
			{
				sQueue = gQueueAry[ nI ].queueName;
				nIdx = sQueue.indexOf( keyStr, 0 );
				if( nIdx == 0 && sQueue.length > keyStr.length)
				{
					mElement.value = sQueue;
					return;
				}
			}
		}
		else
		{
			for( var nI = 0; nI < gQueueAry.length; nI++ )
			{
				sQueue = gQueueAry[ nI ].queueName;
				nIdx = sQueue.indexOf( keyStr, 0 );
				if( nIdx == 0 && sQueue.length > keyStr.length)
				{
					mElement.value = sQueue;
					return;
				}
			}
		}
		keyTime = newTime;
	}
}
function cntxtActionHandler(evt,action)
{
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"erpReporting");
		if (!action || action=="erpReporting")
			return false;
	}

	var bHandled=false;

	switch(action)
	{
		case "doCancel":
			closeJobSubmit();
			bHandled=true;
			break;		
		case "doSubmit":
			var mElement=portalWnd.getEventElement(evt);
			submitThisJob();	
			bHandled=true;
			break;		
		case "posInFirstField":
			posInFirstFld();	
			bHandled=true;
			break;
		case "posInToolbar":
			posInToolbar();
			bHandled=true;
			break;
	}
	
	return (bHandled);
}
function closeJobSubmit(message)
{
	message = (typeof(message) != "string" ? "" : message);
	portalObj.setMessage(message);

	portalWnd.oJob = null;	
		
	if (portalObj.browser.isIE)
	{
		portalWnd.clearCallBackPrms();
		window.close();
	}
	else
		portalWnd.hideDrillFrame();
}
function buildToolbar()
{
	if (portalObj.browser.isIE)
	{
		var toolBarElement = document.getElementById("toolBarDiv");
		toolBarElement.style.display = "block"
		var oToolbar = new portalWnd.Toolbar(portalWnd, window, toolBarElement);	
	}
	else
		var oToolbar = portalObj.toolbar;

	oToolbar.clear();
	oToolbar.target = window;
	oToolbar.createButton(portalWnd.rptPhrases.getPhrase("lblSubmit"), submitThisJob);
	oToolbar.createButton(portalWnd.rptPhrases.getPhrase("lblCancel"), closeJobSubmit);
}

function posInFirstFld()
{
	var jobQueueParamElem = document.getElementById("jobQueueParam");
	var isHidden = 	jobQueueParamElem.style.display == "none" ? true : false;
	if (isHidden)
		posInToolbar();	
	else
	{
		var	firstFldElm = document.getElementById("jobQueue");
		firstFldElm.focus();	
	}
}
function posInToolbar()
{
	var toolBar=window.document.getElementById("toolBarDiv");
	if (!toolBar) return false;

	var tbList=toolBar.getElementsByTagName("BUTTON")
	for (var i = 0; i < tbList.length; i++)
	{
		if (tbList[i].disabled) continue;
		if (tbList[i].style.visibility=="hidden") continue;

		tbList[i].focus();
		return true;
	}
	return false;
}
