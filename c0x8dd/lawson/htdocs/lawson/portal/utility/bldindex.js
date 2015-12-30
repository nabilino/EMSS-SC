/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/utility/bldindex.js,v 1.24.2.9.4.8.14.2.2.2 2012/08/08 12:37:22 jomeli Exp $ */
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

var oMsgs=null;
var oFeedBack=null;
var portalObj=null;
var portalWnd=null;
var contentDir=""

var strBaseFolder=""
var strCurFolder=""
var strRowClass="xTListTextRow"
var strRowSelClass="xTListTextRowSelected"
var strFileRow="fileRow"
var currentRow=null
var bInAnalysis=false;

var listFiles=null;
var txtfolder=null;
var btnUpDir=null;
var tblFolders=null;
var frmAnalysis=null;

//-----------------------------------------------------------------------------
function bldInit()
{
	portalWnd=envFindObjectWindow("lawsonPortal");
	portalObj=portalWnd.lawsonPortal;
	oMsgs=new portalWnd.phraseObj("utility")

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	var title=oMsgs.getPhrase("lblTitleRebuild");
	portalObj.setMessage(portalObj.getPhrase("LBL_LOADING")+" "+title);

	// check for admin role
	if (!portalWnd.oUserProfile.isPortalAdmin())
	{
		var msg=title+":\n"+portalObj.getPhrase("MUST_BE_ADMIN_TO_ACCESS");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		portalWnd.goHome();
		return;
	}

	portalObj.setTitle(title);
	with (portalObj.toolbar)
	{
		clear()
		target=window
		createButton(oMsgs.getPhrase("btnRebuild"), doRebuild, "btnRebuild");
		if (portalObj.xsltSupport)
			createButton(oMsgs.getPhrase("btnAnalysis"), doAnalysis, "btnAnalysis");
		createButton(portalObj.getPhrase("LBL_HOME"), doCancel, "btnCancel", "", "", "home" );
	}
	oFeedBack = new FeedBack(window,portalWnd);

	// set labels on screen
	document.getElementById("lblSelectFormsFolder").innerHTML=oMsgs.getPhrase("lblSelectFormsFolder")

	// save references to screen elements
	contentDir=portalObj.path+"/content"
	listFiles=document.getElementById("listFiles")
	txtfolder=document.getElementById("txtfolder")
	btnUpDir=document.getElementById("btnUpDir")
	tblFolders=document.getElementById("tblFolders")
	frmAnalysis=document.getElementById("frmAnalysis")

 	strBaseFolder=contentDir+"/forms"
 	bldDoDirListing("forms")

	document.body.style.visibility="visible"
	posInFirstField()	
	portalObj.setMessage("")
}

//-----------------------------------------------------------------------------
function posInFirstField()
{
	if (currentRow)
		bldOnFileClick(currentRow)
	else	
		portalWnd.frmPositionInToolbar()
}

//-----------------------------------------------------------------------------
function bldDoDirListing(strFolder)
{
	currentRow=null

	var oFileMgr = portalWnd.fileMgr.getList("folderlist", 
				contentDir+"/"+strFolder, "*.xml", false);
	if (!oFileMgr || oFileMgr.status)
	{
		listFiles.innerHTML=""
		with (portalObj.toolbar)
		{
			changeButtonState("btnRebuild", "disabled");
			changeButtonState("btnAnalysis", "disabled");
			bldEnableRecurse(false)
		}
	}
	else
	{
		var ds
		if (portalObj.browser.isIE)
			ds=new portalWnd.DataStorage(oFileMgr.xml)
		else
			ds=new portalWnd.DataStorage(oFileMgr)
		var msgNode=ds.getNodeByName("MSG")
		msgNode=(msgNode ? msgNode : ds.getNodeByName("MESSAGE"));
		if (!msgNode || msgNode.getAttribute("status")!="0")
			listFiles.innerHTML=""
		else
		{
			listFiles.innerHTML=bldGetFolderList(ds)
			currentRow=document.getElementById(strFileRow+"0")
			if (currentRow)
			{
				bldEnableRecurse()
				currentRow.className=strRowSelClass
				currentRow.tabIndex=0
			}
			else
				bldEnableRecurse(false)
		}
	}

	txtfolder.value=contentDir+"/"+strFolder
	strCurFolder=strFolder

	if (contentDir+"/"+strFolder==strBaseFolder)
	{
		// at the root: already home; can't go up
		btnUpDir.disabled=true
		btnUpDir.style.cursor="auto"
		btnUpDir.style.backgroundImage="url('../images/folderupgray.gif')"
	}
	else
	{
		btnUpDir.disabled=false
		btnUpDir.style.cursor="hand"
		btnUpDir.style.backgroundImage="url('../images/folderup.gif')"
	}
}

//-----------------------------------------------------------------------------
function bldEnableRecurse(bEnable)
{
	if (typeof(bEnable) != "boolean")
		bEnable=true;

	document.getElementById("cbxSubFolders").disabled=!bEnable;
	document.getElementById("lblSubFolders").style.fontWeight=(bEnable ? "Bold" : "Normal");
}

//-----------------------------------------------------------------------------
function bldGetFolderList(ds)
{
	var strHTML="<span id=\"filediv\" style=\"background-color:white;width:100%\">"
	try {
		
		var fldrs=ds.document.getElementsByTagName("FOLDER")
		for (var i = 0; i < fldrs.length; i++)
		{
			var fldrName=fldrs[i].firstChild.nodeValue
			strHTML+="<div class=\"xTListTextRow\" onclick=\"bldOnFileClick(this)\" "
			strHTML+="type=\"folder\" id=\"fileRow"+i+"\" value=\""+fldrName+"\" "
			strHTML+="ondblclick=\"bldOnSelectFolder('"+fldrName+"')\">"
			strHTML+="<span style=\"top:0;left:0;width:10%;text-align:center;\">"
			strHTML+="<img src=\"../images/folder.gif\"></img></span>"
			strHTML+="<span style=\"top:0;width:90%;text-align:left;font-family:verdana;";
			strHTML+="font-size:10px;padding-bottom:4px;\">"
			strHTML+=fldrName+"</span></div>"
		}

	} catch (e) { }
	strHTML+="</span>"
	return strHTML;
}

//-----------------------------------------------------------------------------
function bldOnUpDir()
{
	var pos = strCurFolder.lastIndexOf("/")
	var upFolder=strCurFolder.substr(0, pos)
	bldDoDirListing(upFolder)
	bldOnFileClick(currentRow)
}

//-----------------------------------------------------------------------------
function bldOnSelectFolder(folder)
{
	bldDoDirListing(strCurFolder+"/"+folder)
	btnUpDir.focus()
}

//-----------------------------------------------------------------------------
function bldMoveFileRow(inc)
{
	if (!currentRow) return

	var rowidx = parseInt(currentRow.id.substr(strFileRow.length))
	if (rowidx==0 && inc == -1) return

	rowidx += inc
	var nextId=strFileRow+rowidx
	var row=document.getElementById(nextId)
	if (row) bldOnFileClick(row)
}

//-----------------------------------------------------------------------------
function bldMoveFilePage(inc)
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

	bldOnFileClick(row)
}

//-----------------------------------------------------------------------------
function bldMoveFileHomeEnd(inc)
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

	bldOnFileClick(row)
}
 
//-----------------------------------------------------------------------------
function bldOnFileClick(fElement)
{
	if (currentRow)
	{
		currentRow.className=strRowClass
		currentRow.tabIndex=-1
	}
	currentRow=fElement
	fElement.className=strRowSelClass
	fElement.tabIndex=0
	fElement.focus()
}

//-----------------------------------------------------------------------------
function bldOnResize()
{
	if (oFeedBack && typeof(oFeedBack.resize) == "function")
		oFeedBack.resize();
}

//-----------------------------------------------------------------------------
function bldOnKeyDown(evt)
{
    evt = portalWnd.getEventObject(evt)
    if (!evt) return false;

	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"bldindex");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "bldindex")
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
			bldOnSelectFolder(mElement.value)
			evtCaught=true
		}
		break;

	case 35:			// end
		if (mElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			bldMoveFileHomeEnd(1)
			evtCaught=true
		}
		break;

	case 36:			// home
		if (mElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			bldMoveFileHomeEnd(-1)
			evtCaught=true
		}
		break;
		
	case 38:			// up arrow
		if (mElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			bldMoveFileRow(-1)
			evtCaught=true
		}
		break;

	case 40:			// down arrow
		if (mElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			bldMoveFileRow(1)
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
		// if in analysis, route to it
		if (bInAnalysis && typeof(window.frames[0].cntxtActionHandler)=="function")
			return (window.frames[0].cntxtActionHandler(evt,null));

		action = portalWnd.getFrameworkHotkey(evt,"bldindex");
		if (!action || action=="bldindex")
			return false;
	}

	var bHandled=false;
	switch (action)
	{
	case "doSubmit":
        doRebuild()
		bHandled=true
		break;
	case "doCancel":
        doCancel()
		bHandled=true
		break;
	case "doPageUp":
		if (mElement.id.substr(0,strFileRow.length)==strFileRow)
			bldMoveFilePage(-1)
		bHandled=true
		break;
	case "doPageDn":
		if (mElement.id.substr(0,strFileRow.length)==strFileRow)
			bldMoveFilePage(1)
		bHandled=true
		break;
	case "openNewWindow":
		portalWnd.newPortalWindow("?_URL=utility/bldindex.htm");
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
function doRebuild()
{
	document.body.style.cursor="wait"
	portalObj.setMessage(oMsgs.getPhrase("msgPerformingRebuild"))
	oFeedBack.show();
	setTimeout("bldDoRebuild()", 50)
}

//-----------------------------------------------------------------------------
function bldDoRebuild()
{
	var bRecurse = document.getElementById("cbxSubFolders").checked ? true : false;
	var oFileMgr = portalWnd.fileMgr.rebuildIndex(contentDir,strCurFolder,bRecurse);
	oFeedBack.hide();
	portalObj.setMessage("");
	document.body.style.cursor="auto";
	if (!oFileMgr || oFileMgr.status)
		return;

	// all done
	var msg="Unknown status return by FileMgr service.";
	var icon="alert";
	var msgNode=oFileMgr.getElementsByTagName("MSG");
	msgNode=(msgNode && msgNode.length > 0 ? msgNode[msgNode.length-1] : null);
	if (msgNode)
	{
		// any error on individual files?
		var fileMsgs="";
		var fileNodes=oFileMgr.getElementsByTagName("FILE")
		var len = fileNodes ? fileNodes.length : 0;
		for (var i = 0; i < len; i++)
		{
			var fMsgNode=fileNodes[i].getElementsByTagName("MSG").item(0)
			if (!fMsgNode || fMsgNode.getAttribute("status") == "0")
				continue;
			var pathNode=fileNodes[i].getElementsByTagName("FILEPATH").item(0)
			var nameNode=fileNodes[i].getElementsByTagName("FILENAME").item(0)

			fileMsgs+="\n\n"+pathNode.firstChild.nodeValue+"/"
			fileMsgs+=nameNode.firstChild.nodeValue+" error:\n"
			fileMsgs+=fMsgNode.firstChild.nodeValue;
		}

		if (msgNode.getAttribute("status")!="0")
			// error in execution
			msg=portalWnd.cmnGetElementText(msgNode);
		else if (fileMsgs == "")
		{
			// no execution error, no files in error
			msg=oMsgs.getPhrase("msgRebuildSuccess")+"\n"+contentDir+"/"+strCurFolder
			icon="info";
		}
		else
			// no execution error, but files are in error
			msg=oMsgs.getPhrase("msgRebuildError")+"\n"+contentDir+"/"+strCurFolder +
					"\n\n"+oMsgs.getPhrase("msgFileMgrError");
		msg+=fileMsgs+"\n\n";
	}
	portalWnd.cmnDlg.messageBox(msg,"ok",icon,window)

	doCancel()
}

//-----------------------------------------------------------------------------
function doAnalysis()
{
//	document.body.style.cursor="wait"
	portalObj.setTitle(oMsgs.getPhrase("lblTitleAnalysis"))
	portalObj.setMessage(oMsgs.getPhrase("msgPerformingAnalysis"))
	oFeedBack.show();

	portalWnd.document.getElementById("LAWTBBUTTONbtnCancel").focus()
	with (portalObj.toolbar)
	{
		changeButtonState("btnRebuild","disabled");
		changeButtonState("btnAnalysis","disabled");
		changeButtonState("btnCancel","disabled");	// until analysis done
		changeButtonText("btnCancel","Return");
		changeButtonIcon("btnCancel","back");
	}
	bInAnalysis=true;
	tblFolders.style.display="none"
	frmAnalysis.style.display="block"
	frmAnalysis.src="bldanalysis.htm"
}

//-----------------------------------------------------------------------------
function doCancel()
{
	if (!bInAnalysis)
	{
		portalWnd.goHome()
		return;
	}

	// hide analysis div, enable buttons
	frmAnalysis.src=portalObj.path+"/blank.htm"
	frmAnalysis.style.display="none"
	tblFolders.style.display="block"
	bInAnalysis=false;
	portalObj.setTitle(oMsgs.getPhrase("lblTitleRebuild"))
	with (portalObj.toolbar)
	{
		changeButtonText("btnCancel",portalObj.getPhrase("LBL_HOME"));
		changeButtonIcon("btnCancel","home");
		changeButtonState("btnRebuild","enabled");
		changeButtonState("btnAnalysis","enabled");
	}
	posInFirstField()
}

//-----------------------------------------------------------------------------
function bldOnUnload()
{
	portalWnd.formUnload(true);
}

