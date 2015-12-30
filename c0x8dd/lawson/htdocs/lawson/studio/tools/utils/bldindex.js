/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/tools/utils/bldindex.js,v 1.5.2.3.26.2 2012/08/08 12:48:54 jomeli Exp $ */
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

var studioWnd=null
var contentPath=""
var strBaseFolder=""

//-----------------------------------------------------------------------------
function bldInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	// save dialog arguments
	studioWnd=wndArguments[0]
	contentPath=studioWnd.contentPath

	strBaseFolder=contentPath+"/forms"
	txtFolder.value=strBaseFolder
	txtFolder.title=strBaseFolder

	document.body.style.visibility="visible"
	btnOK.focus()
}

//-----------------------------------------------------------------------------
function bldOnKeyDown()
{
	if (event.keyCode == 27)			// escape
	{
		window.close()
		event.returnValue=false
		event.cancelBubble=true
		return (false);
	}
}

//-----------------------------------------------------------------------------
function bldOnClickBrowse()
{
	// browse for custom forms folder
	var init=txtFolder.value.substr(strBaseFolder.length)
	var folder=studioWnd.cmnDlg.selectFolder(strBaseFolder, "", init, "server", window)
	if (folder && folder != txtFolder.value)
	{
		txtFolder.value=folder
		txtFolder.title=folder
	}
}

//-----------------------------------------------------------------------------
function bldOnAnalysis()
{
	var dlgArgs=new Array()
	dlgArgs[0]=studioWnd;
	dlgArgs[1]=window;
	dlgArgs[2]=txtFolder.value;
 	var sFeatures="dialogWidth:450px;dialogHeight:450px;center:yes;help:no;scroll:no;status:no;";
	window.showModalDialog("bldanalysis.htm", dlgArgs, sFeatures);
	btnAnalysis.focus()
}

//-----------------------------------------------------------------------------
function bldOnRebuild()
{
	btnRebuild.style.cursor="wait"
	waitDiv.style.display=""
	setTimeout("bldDoRebuild()", 5)
}

//-----------------------------------------------------------------------------
function bldDoRebuild()
{
	var folder=txtFolder.value.substr(contentPath.length)
	var bRecurse = document.getElementById("cbxSubFolders").checked ? true : false;
	var oXML = studioWnd.fileMgr.rebuildIndex(contentPath,folder,bRecurse)
	waitDiv.style.display="none"
	btnRebuild.style.cursor="auto"
	if (oXML==null) return

	// any error on individual files?
	var fileMsgs=""
	var fileNodes=oXML.selectNodes("/FILEMANAGER//FILE/MSG[@status!='0']")
	var len = fileNodes ? fileNodes.length : 0;
	var bShowPrint=(len ? true : false);
	for (var i = 0; i < len; i++)
	{
		var parNode=fileNodes[i].parentNode
		fileMsgs+="\n\n"+parNode.selectSingleNode("./FILEPATH").text+"/"
		fileMsgs+=parNode.selectSingleNode("FILENAME").text+" error:\n"
		fileMsgs+=fileNodes[i].text;
	}
	var icon="alert";
	var msg="Rebuild index completed";
	if (oXML.selectSingleNode("/FILEMANAGER/MSG[@status='0']"))
	{
		if (fileMsgs == "")
		{
			msg+=" successfully ";
			icon="info";
		}
		else
			msg+=" but errors detected ";
		msg+="for folder:\n"+contentPath+folder;
		if (fileMsgs != "")
			msg+="\n\nServlet FileMgr reported the following errors:";
	}
	else
		msg=oXML.selectSingleNode("/FILEMANAGER/MSG").text;
	msg+=fileMsgs;

	if (bShowPrint)
		msg+="\n\n"

	// show the message
	studioWnd.cmnDlg.messageBox(msg, "ok", bShowPrint ? "alert" : icon, window, bShowPrint)
	btnOK.focus()
}

