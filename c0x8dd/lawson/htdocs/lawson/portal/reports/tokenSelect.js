/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/reports/tokenSelect.js,v 1.18.2.13.4.4.8.1.2.2 2012/08/08 12:37:19 jomeli Exp $ */
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

var portalWnd = null;
var portalObj = null;
var oDrillToken = null;
var oTokenTable = null;
var oDropDown = null;
var gTableWidth = 0;
var bFormClosing = false;

var CONST_TOOLBAR_ELEMENT = "toolBarDiv";
var CONST_SYSTEMCODE_LIST_ELEMENT = "selSystemCode";
var CONST_SYSTEMCODE_TITLE = "txtSystemcode";
var CONST_TOKEN_TABLE_PARENT_ELEMENT = "tokenDiv";
var CONST_MSGBAR_ELEMENT = "messageDiv";

function init()
{
	var qString = unescape(window.location.search);
	var pdl = null;
	var filter = null;
	var callback = null;
	var isModal = (wndArguments ? true : false);
	portalWnd = (wndArguments 
		? wndArguments[0]
		: envFindObjectWindow("lawsonPortal",window));
	if (!portalWnd) return;

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	portalObj = portalWnd.lawsonPortal;
		
	if (qString != "")
	{
		pdl = portalWnd.getVarFromString("_PDL", qString);
		filter = portalWnd.getVarFromString("_FILTER", qString);
		callback = portalWnd.getVarFromString("_FUNC", qString);
	}

	oDrillToken =  new portalWnd.DrillToken(portalWnd, isModal, pdl, filter, callback)	
	
	if(!oDrillToken)
		return;

	if(!portalWnd.rptPhrases)
		portalWnd.rptPhrases = new parent.phraseObj("reports");

	oDrillToken.setFilter(filter);
	setToolBar();
	buildToolBar();
	showMessageBar();
	setMessage(portalObj.getPhrase("LOADING"));	
	oTokenTable = createTokenTable();
	
	if (!oTokenTable)
		return;

	oTokenTable.showTitle(false);
	if (!oDrillToken.getSystemCodes())
	{
		onClose();
		return;
	}

	if(!oDrillToken.systemCode)
	{
		var msg = portalObj.getPhrase("msgNoRecordsMeetCriteria");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		onClose();
		return;
	}	
	
	setSystemCode(oDrillToken.systemCode);
	buildTokenTable();
	setMessage("");	
		
	var viewOptions = document.getElementById(CONST_SYSTEMCODE_LIST_ELEMENT);
	viewOptions.className = "DrillViewSelect";
	document.body.style.cursor = "auto";
	document.body.style.display = "block";
	document.body.style.visibility = "visible";
	
	var oRow = oTokenTable.getFirstRow();
		
	if(oRow)
		oTokenTable.setCurrentRow(oRow);
		
	gTableWidth = oTokenTable.parent.offsetWidth;
}

function buildToolBar()
{
	var selectPhrase = portalObj.getPhrase("LBL_SELECT");
	var closePhrase = portalObj.getPhrase("LBL_CLOSE");

	oDrillToken.oToolbar.clear();
	oDrillToken.oToolbar.createButton(selectPhrase,onSelect);
	oDrillToken.oToolbar.createButton(closePhrase,onClose);
}

function createTokenTable()
{
	var tokenPhrase = portalObj.getPhrase("lblToken");
	var titlePhrase = portalObj.getPhrase("LBL_TITLE");	
	var tblParent = document.getElementById(CONST_TOKEN_TABLE_PARENT_ELEMENT);
	var height = getListHeight(tblParent);
	
	var width = (portalObj.browser.isIE
		? document.body.offsetWidth - 45
		: window.innerWidth - 45);
		
	var col1Width = width * .20
	var col2Width = width * .80

	var tableString = "<TABLE height=\"" + height + "\">";
	tableString += "<COLUMNS>";
	tableString += "<COLUMN id=\"token\" label=\"" + tokenPhrase;
	tableString += "\" labelAlign=\"left\" dataAlign=\"left\" width=\"" + col1Width + "\"/>";
	tableString += "<COLUMN id=\"tokenTitle\" label=\"" + titlePhrase;
	tableString += "\" labelAlign=\"left\" dataAlign=\"left\" width=\"" + col2Width + "\"/>";
	tableString += "</COLUMNS>";
	tableString += "<ROWS>";
	tableString += "</ROWS>";
	tableString += "</TABLE>";

	var tableXml = portalWnd.cmnCreateXmlObjectFromString(tableString)
	
	var oTable = new Table(document, tblParent, "oTokenTable", tableXml);
	return oTable;
}

function buildTokenTable()
{
	if(!oTokenTable)
		return;

	if(!oDrillToken.pdl || !oDrillToken.systemCode)
		return;
		
	setMessage(portalObj.getPhrase("PROCESSING"));
	oTokenTable.showTable(false);
	oTokenTable.clearTable();
	
	var systemCodeIndex = oDrillToken.getSystemCodeIndex(oDrillToken.systemCode);
	var oSystemCode = oDrillToken.systemCodeList[systemCodeIndex];
	var tokenAry = oSystemCode.tokens;
	var loop =  (tokenAry ? tokenAry.length : 0);

	for(var i=0;i<loop;i++)
	{
		var name = tokenAry[i].name ; 
		var title = tokenAry[i].title;
		title = portalWnd.xmlEncodeString(title);
		var rowXml = "<?xml version=\"1.0\"?>"
		rowXml += "<ROW key=\"" + name + "\" " + "title=\"" + title + "\">"
		rowXml += "<DATA>" + name + "</DATA>"
		rowXml += "<DATA>" + title + "</DATA>"
		rowXml += "</ROW>";
		
		var xmlSource = portalWnd.cmnCreateXmlObjectFromString(rowXml);
		
		var oRow = oTokenTable.addRow(xmlSource);
		oRow.setOnDblClickFunc(onSelect)
	}
		
	oTokenTable.showTable(true);
	
	if(loop == 0)
		setMessage(portalObj.getPhrase("msgNoRecordsFound"));
	else	
		setMessage(portalObj.getPhrase("AGSREADY"));
}

function buildSystemCodeMenu()
{
	if (!window.oDropDown)
		window.oDropDown=new window.Dropdown(portalWnd);
		
	window.oDropDown.clearItems();	

	var systemCodeList = document.getElementById(CONST_SYSTEMCODE_LIST_ELEMENT);
	var loop = oDrillToken.systemCodeList.length;
	
	if(loop == 0) return;
	
	for(var i=0;i<loop;i++)
	{
		var oSystemCode = oDrillToken.systemCodeList[i];
		var name = oSystemCode.name;
		var title = oSystemCode.title;
		
		oDropDown.addItem(name + " -- " + title,name);
	}

	window.oDropDown.show(oDrillToken.systemCode, systemCodeList, "buildSystemCodeMenuReturn");
}
function buildSystemCodeMenuReturn(systemCode)
{
	setMessage(portalObj.getPhrase("PROCESSING"));
	setSystemCode(systemCode);
	buildTokenTable();

	var oRow = oTokenTable.getFirstRow();
		
	if(oRow)
		oTokenTable.setCurrentRow(oRow);
}
function onSelect()
{
	var oRow = null;
	var token = null;
	var title = null;
	var systemCode = oDrillToken.systemCode;
	
	oRow = oTokenTable.getCurrentRow();

	if(oRow)
	{
		token = oRow.key;
		title = oRow.getUserAttribute("title");
	}

	onClose(token, title);
}
function onClose(token, title)
{
	if(bFormClosing) return;
	
	bFormClosing = true;
	token = !token || typeof(token) != "string" ? null : token;
	title = !title || typeof(title) != "string"? null : title;

	oDrillToken.callBack(token,title);
	
	if(oDrillToken.isModal)
		window.close();		
}
function unloadFunc()
{
	onClose();
	
	if(oDrillToken.isModal)
		oDrillToken.close();
}
function setToolBar()
{
	if(oDrillToken.isModal)
	{
		var toolBarElement = document.getElementById(CONST_TOOLBAR_ELEMENT);
		toolBarElement.className = "DrillToolbar";
		oDrillToken.oToolbar = new portalWnd.Toolbar(portalWnd, window, toolBarElement);
	}		
	else
		oDrillToken.oToolbar = oDrillToken.portalObj.toolbar;
}
function showMessageBar()
{
	if(oDrillToken.isModal)
	{
		var msgBarElement = document.getElementById(CONST_MSGBAR_ELEMENT);
		msgBarElement.className="DrillMsg";
	}		

}
function setMessage(message)
{
	if(oDrillToken.isModal)
	{
		var messageDiv = document.getElementById(CONST_MSGBAR_ELEMENT);
		messageDiv.firstChild.nodeValue = message;
	}
	else
		portalObj.setMessage(message);		
}
function setSystemCode(systemCode)
{
	if(typeof(systemCode) != "string")
		return false;
	
	var systemCodeIndex = oDrillToken.getSystemCodeIndex(systemCode);
	var oSystemCode = oDrillToken.systemCodeList[systemCodeIndex];
	
	if(typeof(oSystemCode) != "object")
		return null;
	
	var bHasTokens = oSystemCode.hasTokens;
	var tabChar=String.fromCharCode(9);
		
	oDrillToken.systemCode = systemCode;
	var systemCodeTitle = document.getElementById(CONST_SYSTEMCODE_TITLE);
	var title = oSystemCode.title == "" ? oSystemCode.name : oSystemCode.name + " - " + oSystemCode.title;
	
	systemCodeTitle.firstChild.nodeValue = title;

	if(!bHasTokens)
	{
		oSystemCode.tokens = oDrillToken.getTokens();
		oSystemCode.hasTokens = true;
		oDrillToken.systemCodeList[systemCodeIndex] = oSystemCode;
	}
		
	return true;
}

function getListHeight(containerElement)
{
	var pixelsUsed = 0;
	var height = 0;	
	
	if(portalObj.browser.isIE)
		scrHeight = document.body.offsetHeight;
	else
		scrHeight=window.innerHeight;

	
	if(oDrillToken.isModal)
		pixelsUsed = 59 + containerElement.offsetTop;
	else
		pixelsUsed = portalObj.contentFrame.offsetTop + containerElement.offsetTop;

	return (scrHeight - pixelsUsed);
}
function onTokenResize()
{	
	var tableParent = oTokenTable.parent;
	var height = getListHeight(tableParent);
	
	var oCol1 = oTokenTable.getColumnById(0);
	var oCol2 = oTokenTable.getColumnById(1);
	
	if(portalObj.browser.isIE)
		var width = document.body.offsetWidth;
	else
		var width = window.innerWidth;
		
	var tableStretch = width - gTableWidth;
	var col1Stretch = (oCol1.getWidth() + (tableStretch * .20));
	var col2Stretch = (oCol2.getWidth() + (tableStretch * .80));
	
	oCol1.setWidth(col1Stretch);
	oCol2.setWidth(col2Stretch);
	oTokenTable.resizeTable(height)
	gTableWidth = tableParent.offsetWidth;
}
function handleKeyDown(evt)
{
	var evtCaught = false;
	
	evt = portalWnd.getEventObject(evt);
	if (!evt)
		return false;

	if(oDrillToken.isModal)
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
		case 27://ESC
			onClose();
			evtCaught = true;
			break;
		case 13:
			var mElement=portalWnd.getEventElement(evt);
			if(typeof(mElement.onclick) == "function")
			{
				mElement.click();
				evtCaught=true;
			}
	}
	
	if (evtCaught)
		portalWnd.setEventCancel(evt);
	
	return evtCaught;
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
		case "doSubmit":
			onSelect();
			bHandled=true;
			break;	
		case "doCancel":
			onClose();
			bHandled=true;
			break;		
		case "posInFirstField":
			var oRow = oTokenTable.getFirstRow();
			oTokenTable.setCurrentRow(oRow);
			bHandled=true;
			break;
		case "posInToolbar":
			positionInToolbar();
			bHandled=true;
			break;
	}
	return (bHandled);
}

function positionInToolbar()
{
	var toolBar=window.document.getElementById(CONST_TOOLBAR_ELEMENT);
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
