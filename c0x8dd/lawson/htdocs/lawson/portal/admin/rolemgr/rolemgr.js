/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/admin/rolemgr/rolemgr.js,v 1.18.2.12.4.12.14.2.2.3 2012/08/08 12:37:29 jomeli Exp $ */
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

var portalWnd=null;
var portalObj=null;
var oMsgs=null;
var oFeedBack=null;
var oPortalRole=null;
var oDefaultRole=null;
var fileStorage=null;

var strRowClass="xTListTextRow"
var strRowSelClass="xTListTextRowSelected"
var strFileRow="fileRow"
var strCurFile="";
var strRolePath="";
var currentRow=null
var bInMaint=false;
var bHasMigrated=true;
var bUpdatedUserRole=false;

var listFiles=null;
var txtfile=null;
var btnDelete=null;
var tblFiles=null;
var frmDisplayTabs=null;
var divMigrate=null;

//-----------------------------------------------------------------------------
function rolInit()
{
	portalWnd=envFindObjectWindow("lawsonPortal");
	if (!portalWnd)
		return;

	portalObj=portalWnd.lawsonPortal;

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	// validate user is active in SSO
	if (!portalWnd.portalIsUserSSOActive(true))
	{
		portalWnd.portalLogout();
		return;
	}

	// load messages and set loading message
	oMsgs=new portalWnd.phraseObj("rolemgr")
	portalObj.setMessage(portalObj.getPhrase("LBL_LOADING")+" "+
			oMsgs.getPhrase("lblTitleRoleMgr"))
	portalObj.setTitle(oMsgs.getPhrase("lblTitleRoleMgr"))

	// check for admin role
	if (!portalWnd.oUserProfile.isPortalAdmin())
	{
		var msg=oMsgs.getPhrase("lblTitleRoleMgr")+":\n"+
			portalObj.getPhrase("MUST_BE_ADMIN_TO_ACCESS");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		portalWnd.goHome();
		return;
	}

	oDefaultRole = new PortalRole(portalWnd,"default.xml");
	
	if (!oDefaultRole.initialized)
	{
		portalWnd.goHome();
		return;
	}
	
	if(!oDefaultRole.getVersion())
	{
		var msg=oMsgs.getPhrase("lblTitleRoleMgr")+":\n"+
			oMsgs.getPhrase("msgDefaultRoleNoVersion");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);	
		portalWnd.goHome();
		return;		
	}
	
	oFeedBack = new FeedBack(window,portalWnd);

	// set labels on screen
	document.getElementById("lblSelectFile").innerHTML=oMsgs.getPhrase("lblSelectFile")

	// save references to screen elements
	listFiles=document.getElementById("listFiles")
	txtfile=document.getElementById("txtfile")
	btnDelete=document.getElementById("btnDelete")
	tblFiles=document.getElementById("tblFiles")
	frmDisplayTabs=document.getElementById("frmDisplayTabs")
	divMigrate=document.getElementById("divMigrate")
	strRolePath=portalObj.path+"/data/roles"

	// get role file list and display
	rolSetFrameworkState("select");
 	rolDoDirListing()

	if (!fileStorage)
	{
		// FileMgr error
	 	rolSetFrameworkState("disabled");
	}
	else
	{
		var files=fileStorage.document.getElementsByTagName("FILE")
		if (!files || files.length < 1)
		{
			// FileMgr error or missing default.xml
		 	rolSetFrameworkState("disabled");
		}
		else if (files.length == 1)
		{
			// only have a default: set migration
			bHasMigrated=rolSetMigrated();
			rolSetFrameworkState("select");
		 	rolSetFrameworkState("emptylist");
		}
		else
		{
			// multiple files: check migrated status
			rolSetHasMigrated();
			rolSetFrameworkState("select");
			if (!bHasMigrated)
				rolSetFrameworkState("disabled");
		}
	}

	document.body.style.visibility="visible"
	posInFirstField()	
	portalObj.setMessage("")
}


//-----------------------------------------------------------------------------
function rolSetFrameworkState(state)
{
	switch (state)
	{
	case "select":
		portalObj.setTitle(oMsgs.getPhrase("lblTitleRoleMgr"))
		with (portalObj.toolbar)
		{
			clear()
			target=window
			if (bHasMigrated)
			{
				createButton(oMsgs.getPhrase("btnSelect"), doSelect, "select","","","chg");
				createButton(oMsgs.getPhrase("btnNew"), doNew, "new","","","add");
				createButton(oMsgs.getPhrase("btnCopy"), doCopy, "copy");
				createButton(oMsgs.getPhrase("btnDelete"), doDelete, "delete","","","del");
				createButton(portalObj.getPhrase("LBL_HOME"), doCancel, "cancel","","","home");
 			}
 			else
 			{
 				createButton(oMsgs.getPhrase("btnSelect"), doSelect, "select", "disabled","","chg");
 				createButton(oMsgs.getPhrase("btnNew"), doNew, "new", "disabled","","add");
				createButton(oMsgs.getPhrase("btnCopy"), doCopy, "copy", "disabled");
 				createButton(oMsgs.getPhrase("btnDelete"), doDelete, "delete","","","del");
 				createButton(portalObj.getPhrase("LBL_HOME"), doCancel, "cancel","","","home");
 				createButton(oMsgs.getPhrase("btnMigrate")+"...", doMigrate, "migrate");
 			}
		}
		break;
	case "maint":
		portalObj.setTitle(oMsgs.getPhrase("lblTitleRoleMaint") + " ("+strCurFile+")")
		with (portalObj.toolbar)
		{
			clear()
			target=window
			createButton(oMsgs.getPhrase("btnOK"), doOK, "ok");
			createButton(oMsgs.getPhrase("btnApply"), doApply, "apply", "disabled");
			createButton(oMsgs.getPhrase("btnCancel"), doCancel, "cancel");
		}
		break;
	case "migrate":
		portalObj.setTitle(oMsgs.getPhrase("lblTitleRoleMigrate"))
		with (portalObj.toolbar)
		{
			clear()
			target=window
			createButton(oMsgs.getPhrase("btnCancel"), rolSetMigCancel, "cancel");
		}
		break;
	case "new":
		portalObj.setTitle(oMsgs.getPhrase("lblTitleRoleNew") + " ("+strCurFile+")")
		with (portalObj.toolbar)
		{
			clear()
			target=window
			createButton(oMsgs.getPhrase("btnOK"), doOK, "ok");
			createButton(oMsgs.getPhrase("btnApply"), doApply, "apply");
			createButton(oMsgs.getPhrase("btnCancel"), doCancel, "cancel");
		}
		break;
	case "disabled":
		with (portalObj.toolbar)
		{
			changeButtonState("select", "disabled");
			changeButtonState("new", "disabled");
			changeButtonState("copy", "disabled");
			changeButtonState("delete", "disabled");
		}
	case "emptylist":
		with (portalObj.toolbar)
		{
			changeButtonState("select", "disabled");
			changeButtonState("copy", "disabled");
			changeButtonState("delete", "disabled");
		}
		break;
	}
}

//-----------------------------------------------------------------------------
function rolGetRoleSetting()
{
	return (portalWnd.oPortalConfig.isRoleBased());
}

//-----------------------------------------------------------------------------
function rolOnBeforeUnload(evt)
{
	// supported only by IE
	if (bInMaint && window.frames[0].tabMgr.getModified())
		event.returnValue=oMsgs.getPhrase("msgCancelUnload");
}

//-----------------------------------------------------------------------------
function rolOnUnload()
{
	if (portalWnd)
		portalWnd.formUnload();
}

//-----------------------------------------------------------------------------
function posInFirstField()
{
	if (currentRow)
	{
		if (!bInMaint)
			rolOnFileClick(currentRow)
		//else ??
	}
	else	
		portalWnd.frmPositionInToolbar()
}

//-----------------------------------------------------------------------------
function rolDoDirListing()
{
	currentRow=null

	var oFileXML = portalWnd.fileMgr.getList("filelist", portalObj.path+"/data/roles", "*.xml", false);
	var msg=oMsgs.getPhrase("msgFileMgrError")+"\n";
	if (portalWnd.oError.handleBadResponse(oFileXML,true,msg,window))
	{
		listFiles.innerHTML=""
		fileStorage=null;
	}
	else
	{
		fileStorage=new portalWnd.DataStorage(
			(portalObj.browser.isIE ? oFileXML.xml : oFileXML), portalWnd);
		var msgNode=fileStorage.getNodeByName("MSG");
		msgNode = (msgNode ? msgNode : fileStorage.getNodeByName("MESSAGE"));
		if (!msgNode || msgNode.getAttribute("status") != "0")
		{
			listFiles.innerHTML="";
			portalObj.toolbar.changeButtonState("btnSelect", "disabled");
		}
		else
		{
			listFiles.innerHTML=rolGetFileList()
			if (strCurFile == "") 
				currentRow = document.getElementById(strFileRow+"0")
			else
			{
				for (var i = 0; ; i++)
				{
					currentRow = document.getElementById(strFileRow+i)
					if (!currentRow) break;
					if (currentRow.getAttribute("value")==strCurFile)
						break;
				}
			}
			if (currentRow)
			{
				currentRow.className=strRowSelClass
				currentRow.tabIndex=0
			}
		}
	}

	txtfile.value=strRolePath;
	if (currentRow)
		txtfile.value+="/"+currentRow.getAttribute("value");
}

//-----------------------------------------------------------------------------
function rolGetFileList()
{
	var strHTML="<span id=\"filediv\" style=\"background-color:white;width:100%\">"
	try {
		
		var files=fileStorage.document.getElementsByTagName("FILE")
		var fileCount = -1;
		for (var i = 0; i < files.length; i++)
		{
			var fileName=files[i].firstChild.nodeValue
			if (fileName == "default.xml") continue;		// no edits to default
			fileCount++;
			strHTML+="<div class=\"xTListTextRow\" onclick=\"rolOnFileClick(this)\" "
			strHTML+="type=\"file\" id=\"fileRow"+fileCount+"\" value=\""+fileName+"\" "
			strHTML+="ondblclick=\"doSelect()\">"
			strHTML+="<span style=\"top:0;left:0;width:10%;text-align:center;\">"
			strHTML+="<img src=\"../../images/document.gif\"></img></span>"
			strHTML+="<span style=\"top:0;width:90%;text-align:left;font-family:verdana;font-size:10px;padding-bottom:4px;\">"
			strHTML+=fileName+"</span></div>"
		}

	} catch (e) { }
	strHTML+="</span>"
	return strHTML;
}

//-----------------------------------------------------------------------------
function rolMoveFileRow(inc)
{
	if (!currentRow) return

	var rowidx = parseInt(currentRow.id.substr(strFileRow.length))
	if (rowidx==0 && inc == -1) return

	rowidx += inc
	var nextId=strFileRow+rowidx
	var row=document.getElementById(nextId)
	if (row) rolOnFileClick(row)
}

//-----------------------------------------------------------------------------
function rolMoveFilePage(inc)
{
	var row=null
	var rowidx = -1
	if (currentRow)
		rowidx=parseInt(currentRow.id.substr(strFileRow.length))

	if (inc == -1)		// page up
	{
		if (rowidx < 8) rowidx = 0
		else rowidx -= 8
		row=document.getElementById(strFileRow+rowidx)
		if (!row) return
	}
	else				// page dn
	{
		var curRow=null
		for (var i = 1; i < 9; i++)
		{
			curRow=document.getElementById(strFileRow+(rowidx+i))
			if (!curRow) break
			row=curRow
		}
		if (!row) return
	}

	rolOnFileClick(row)
}

//-----------------------------------------------------------------------------
function rolMoveFileHomeEnd(inc)
{
	var row=null
	var rowidx = -1
	if (currentRow)
		rowidx=parseInt(currentRow.id.substr(strFileRow.length))

	if (inc == -1)		// move home
	{
		var firstRow=document.getElementById(strFileRow+"0")
		if (!firstRow) return
		row=firstRow
	}
	else				// move end
	{
		for (var i = rowidx+1; ; i++)
		{
			var thisRow=document.getElementById(strFileRow+i)
			if (!thisRow) break
			row=thisRow
		}
		if (!row) return
	}

	rolOnFileClick(row)
}
 
//-----------------------------------------------------------------------------
function rolOnFileClick(fElement)
{
	if (currentRow)
	{
		currentRow.className=strRowClass
		currentRow.tabIndex=-1
	}
	currentRow=fElement
	txtfile.value=strRolePath+"/"+currentRow.getAttribute("value");
	fElement.className=strRowSelClass
	fElement.tabIndex=0

	// need a try/catch only to prevent Netscrape error message:
	// (and why can't I set focus if it's a tab stop???)
	try { fElement.focus(); } catch (e) { }	
}

//-----------------------------------------------------------------------------
function rolOnResize()
{
	if (oFeedBack && typeof(oFeedBack.resize) == "function")
		oFeedBack.resize();
}

//-----------------------------------------------------------------------------
function rolOnKeyDown(evt)
{
    evt = portalWnd.getEventObject(evt,window)
    if (!evt) return false;

	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"rolemgr");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "rolemgr")
	{
		cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt)
		return false;
	}

	var evtCaught=false;
	var mElement=portalWnd.getEventElement(evt)
	var keyVal = portalObj.browser.isIE ? evt.keyCode : evt.charCode;
	if (keyVal==0)		// netscrape only
		keyVal=evt.keyCode

	switch(keyVal)
	{
	case 13:			// enter Key
		if (mElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			doSelect()
			evtCaught=true
		}
		break;

	case 35:			// end
		if (mElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			rolMoveFileHomeEnd(1)
			evtCaught=true
		}
		break;

	case 36:			// home
		if (mElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			rolMoveFileHomeEnd(-1)
			evtCaught=true
		}
		break;
		
	case 38:			// up arrow
		if (mElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			rolMoveFileRow(-1)
			evtCaught=true
		}
		break;

	case 40:			// down arrow
		if (mElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			rolMoveFileRow(1)
			evtCaught=true
		}
		break;
	}

	if (evtCaught)
		portalWnd.setEventCancel(evt)
	return (evtCaught)
}

//-----------------------------------------------------------------------------

function cntxtActionHandler(evt,action)
{
	if (action==null)		// called by the portal
	{
		// if in maintenance, route to it
		if (bInMaint && typeof(window.frames[0].cntxtActionHandler)=="function")
			return (window.frames[0].cntxtActionHandler(evt,null));

		action = portalWnd.getFrameworkHotkey(evt,"rolemgr");
		if (!action || action=="rolemgr")
			return false;
	}

	var bHandled=false;
	switch (action)
	{
	case "doCancel":
        doCancel()
		bHandled=true
		break;
	case "doDelete":
        doDelete()
		bHandled=true
		break;
	case "doPageUp":
		if (mElement.id.substr(0,strFileRow.length)==strFileRow)
			rolMoveFilePage(-1)
		bHandled=true
		break;
	case "doPageDn":
		if (mElement.id.substr(0,strFileRow.length)==strFileRow)
			rolMoveFilePage(1)
		bHandled=true
		break;
	case "doSubmit":
        doSelect()
		bHandled=true
		break;
	case "openNewWindow":
		portalWnd.newPortalWindow("?_URL=admin/rolemgr/index.htm");
		bHandled=true;
		break;
	case "posInFirstField":
        posInFirstField()
		bHandled=true
		break;
	}
	return (bHandled);
}

//-----------------------------------------------------------------------------
function doSelect()
{
	if (!bHasMigrated) return;

	// validate user is active in SSO
	if (!portalWnd.portalIsUserSSOActive(true))
	{
		portalWnd.portalLogout();
		return;
	}

	strCurFile=currentRow.getAttribute("value");
	oPortalRole = new PortalRole(portalWnd,strCurFile);

	document.body.style.cursor="wait"
	oFeedBack.show();
	rolSetFrameworkState("maint")
	setTimeout("rolDoSelect()", 50)
}

//-----------------------------------------------------------------------------
function rolDoSelect()
{
	oFeedBack.show();
	bInMaint=true;
	tblFiles.style.display="none"
	frmDisplayTabs.style.display="block"
	frmDisplayTabs.src=portalObj.path+"/objects/tabhost.htm?"+
		portalObj.path+"/admin/rolemgr/rolemgr.xml"
}

//-----------------------------------------------------------------------------
// callback from tabhost when tab construction complete
function tabInitialization()
{
	window.frames[0].tabMgr.tabs["tabHotkeys"].setMode("admin");
}

//-----------------------------------------------------------------------------
function doOK()
{
	if (!window.frames[0].tabMgr.getModified()
	&& portalWnd.document.getElementById("LAWTBBUTTONapply").disabled)
	{
		if (!bUpdatedUserRole)
			doCancel();
		else
		{
			var msg = oMsgs.getPhrase("msgReloadPortal")
			if (portalWnd.cmnDlg.messageBox(msg,"yesno") == "yes")
				portalWnd.location.reload();
		}
		return;
	}
	document.body.style.cursor="wait"
	oFeedBack.show();
	setTimeout("rolDoOK()", 50)
}

//-----------------------------------------------------------------------------
function rolDoOK()
{
	// validate user is active in SSO
	if (!portalWnd.portalIsUserSSOActive(true))
	{
		// if user did not re-authenticate, all changes lost
		window.frames[0].tabMgr.setModified(false);
		portalWnd.portalLogout();
		return;
	}

	rolDoApply("false")
	oPortalRole=null;

	if (bUpdatedUserRole)
	{
		var msg = oMsgs.getPhrase("msgReloadPortal")
		if (portalWnd.cmnDlg.messageBox(msg,"yesno") == "yes")
		{
			portalWnd.location.reload();
			return;
		}
	}

	// hide analysis div, enable buttons
	bUpdatedUserRole=false;
	document.body.style.cursor="auto"
	frmDisplayTabs.src=portalObj.path+"/blank.htm"
	frmDisplayTabs.style.display="none"
	tblFiles.style.display="block"
	bInMaint=false;
	rolSetFrameworkState("select");
	rolDoDirListing();
	posInFirstField();
	document.body.style.cursor="auto"
	oFeedBack.hide();
}

//-----------------------------------------------------------------------------
function doApply()
{
	// validate user is active in SSO
	if (!portalWnd.portalIsUserSSOActive(true))
	{
		// if user did not re-authenticate, all changes lost
		window.frames[0].tabMgr.setModified(false);
		portalWnd.portalLogout();
		return;
	}
	document.body.style.cursor="wait"
	oFeedBack.show();
	setTimeout("rolDoApply('true')", 50)
}

//-----------------------------------------------------------------------------
function rolDoApply(hide)
{
	// call 'apply' on each tab (default implementation returns true)
	for (var t in window.frames[0].tabMgr.tabs)
	{
		if (!window.frames[0].tabMgr.tabs[t].apply())
			return;
	}
	// reset flag on hotkeys: also resets the tab manager
	window.frames[0].tabMgr.tabs["tabHotkeys"].setModified(null,false);

	// save the portal object
	var ds = window.frames[0].storage;
	oPortalRole.storage=new portalWnd.DataStorage(
		(portalObj.browser.isIE ? ds.document.xml : ds.document), portalWnd);

	if (!oPortalRole.save())
	{
		portalWnd.cmnDlg.messageBox(oMsgs.getPhrase("msgSaveError"),"ok","stop",window);
		return;
	}

	if (oPortalRole.getId() == portalWnd.oUserProfile.oRole.getId())
		bUpdatedUserRole=true;

	if (hide != "true") return;
	document.body.style.cursor="auto"
	oFeedBack.hide();
}

//-----------------------------------------------------------------------------
function doNew()
{
	var newName="";
	var initValue="";
	var bDone=false;
	while (!bDone)
	{
		// prompt for new name (must have 'xml' extension)
		newName=portalWnd.cmnDlg.prompt(initValue,oMsgs.getPhrase("lblNewRoleFile"), 
				oMsgs.getPhrase("lblEnterRoleFileName"), window)
		if (!newName) return;
		newName=newName.toLowerCase();
		if (newName.length > 4 
		&& newName.substr(newName.length-4) == ".xml")
		{
			// check for duplicate
			var bDuplicate=false;
			var files=fileStorage.document.getElementsByTagName("FILE")
			for (var i = 0; i < files.length; i++)
			{
				if (newName == files[i].firstChild.nodeValue)
				{
					msg=oMsgs.getPhrase("msgFileExists")
					portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
					bDuplicate=true;
				}
			}
			bDone=!bDuplicate;
		}
		else
		{
			var msg=(newName.length < 5 ? oMsgs.getPhrase("msgInvalidFileName")+"\n" : "");
			msg+=oMsgs.getPhrase("msgMustBeXMLFile");
			portalWnd.cmnDlg.messageBox(msg,"ok","alert",window);
			initValue=newName;
		}
	}

	// validate user is active in SSO
	if (!portalWnd.portalIsUserSSOActive(true))
	{
		portalWnd.portalLogout();
		return;
	}
	oPortalRole = new PortalRole(portalWnd,newName);

	// now go into maintenance mode
	strCurFile=newName;
	document.body.style.cursor="wait"
	oFeedBack.show();
	rolSetFrameworkState("new")
	setTimeout("rolDoSelect()", 50)
}

//-----------------------------------------------------------------------------
function doCopy()
{
	var newName="";
	var initValue="";
	var bDone=false;
	while (!bDone)
	{
		// prompt for new name (must have 'xml' extension)
		newName=portalWnd.cmnDlg.prompt(initValue,oMsgs.getPhrase("lblNewRoleFile"), 
				oMsgs.getPhrase("lblEnterRoleFileName"), window)
		if (!newName) return;
		newName=newName.toLowerCase();
		if (newName.substr(newName.length-4) == ".xml")
		{
			// check for duplicate
			var bDuplicate=false;
			var files=fileStorage.document.getElementsByTagName("FILE")
			for (var i = 0; i < files.length; i++)
			{
				if (newName == files[i].firstChild.nodeValue)
				{
					msg=oMsgs.getPhrase("msgFileExists")
					portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
					bDuplicate=true;
				}
			}
			bDone=!bDuplicate;
		}
		else
		{
			portalWnd.cmnDlg.messageBox(oMsgs.getPhrase("msgMustBeXMLFile"),"ok","alert",window);
			initValue=newName;
		}
	}

	// validate user is active in SSO
	if (!portalWnd.portalIsUserSSOActive(true))
	{
		portalWnd.portalLogout();
		return;
	}
	strCurFile=currentRow.getAttribute("value");
	oPortalRole = new PortalRole(portalWnd,strCurFile);
	oPortalRole.setId(newName);

	// now go into maintenance mode
	strCurFile=newName;
	document.body.style.cursor="wait"
	oFeedBack.show();
	rolSetFrameworkState("new")
	setTimeout("rolDoSelect()", 50)
}

//-----------------------------------------------------------------------------
function doDelete()
{
	strCurFile=currentRow.getAttribute("value");
	var msg=oMsgs.getPhrase("msgOkToDeleteRole")+ ": " + strCurFile+"?";
	var retVal = portalWnd.cmnDlg.messageBox(msg,"okcancel","question",window);
	if (retVal == "cancel") return;

	// validate user is active in SSO
	if (!portalWnd.portalIsUserSSOActive(true))
	{
		portalWnd.portalLogout();
		return;
	}

	// ask file manager to delete
	if (portalWnd.fileMgr.remove(portalObj.path+"/data/roles", strCurFile) == null)
		return;

	// build new list
	var rowidx = parseInt(currentRow.id.substr(strFileRow.length))
	if (rowidx!=0) rowidx--;

	var newRow=document.getElementById(strFileRow+rowidx);
	strCurFile=newRow.getAttribute("value");
 	rolDoDirListing();
	if (!currentRow)
		rolSetFrameworkState("emptylist");
	posInFirstField();
}

//-----------------------------------------------------------------------------
function doCancel()
{
	if (!bInMaint)
	{
		oPortalRole=null;
		portalWnd.goHome()
		return;
	}

	// are there pending changes?
	if (window.frames[0].tabMgr.getModified())
	{
		var msg=oMsgs.getPhrase("msgSaveChanges");
		var retVal = portalWnd.cmnDlg.messageBox(msg,"yesno","question",window);
		if (retVal == "yes")
		{
			// validate user is active in SSO
			if (!portalWnd.portalIsUserSSOActive(true))
			{
				// if user did not re-authenticate, all changes lost
				window.frames[0].tabMgr.setModified(false);
				portalWnd.portalLogout();
				return;
			}
			rolDoApply("false");
		}
		else
			// to prevent a second prompt
			window.frames[0].tabMgr.setModified(false);
	}

	// hide analysis div, enable buttons
	oPortalRole=null;
	document.body.style.cursor="auto"
	frmDisplayTabs.src=portalObj.path+"/blank.htm"
	frmDisplayTabs.style.display="none"
	tblFiles.style.display="block"
	bInMaint=false;
	rolSetFrameworkState("select")
	if (!currentRow)
		rolSetFrameworkState("emptylist");
	posInFirstField()
}
