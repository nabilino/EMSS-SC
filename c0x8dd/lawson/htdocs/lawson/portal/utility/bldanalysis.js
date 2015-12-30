/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/utility/bldanalysis.js,v 1.8.2.6.4.12.14.2.2.3 2012/08/08 12:37:21 jomeli Exp $ */
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
//	Note: Code assumes this feature is available in IE only!
//-----------------------------------------------------------------------------

var portalObj=null
var portalWnd=null
var oIndexXML=null
var oIndexXSL=null
var oFileXML=null
var strFolder=""
var strSubFolder=""

//-----------------------------------------------------------------------------
function bldInit()
{
	// save dialog arguments
	portalWnd = envFindObjectWindow("lawsonPortal");
	portalObj = portalWnd.lawsonPortal;
	strFolder=parent.strBaseFolder;
	strSubFolder=strFolder.substr(parent.contentDir.length+1)

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	// load the forms XSL
	var path=portalObj.path+"/utility/bldanalysis.xsl"
	oIndexXSL = portalWnd.objFactory.createInstance("DOM");
	oIndexXSL.async=false
	oIndexXSL.load(path)
	if (oIndexXSL.parseError.errorCode != 0)
	{
		portalWnd.oError.displayDOMParseError(oIndexXSL.parseError,path)
		return;
	}

	// show the document
	document.body.style.visibility="visible"
	window.setTimeout("bldPerformAnalysis()",5)
}

//-----------------------------------------------------------------------------
function bldPerformAnalysis()
{
	// perform analysis - only continue if build index xml succeeds
	lblFolderName.innerText=strFolder
	if (bldBuildIndexXML())
	{
		bldBuildFileXML()
		bldBuildFileEntryList()
		bldBuildIndexEntryList()
		bldSetPDLMessage()
	}

	// show the document
	document.body.style.cursor="auto";
	parent.oFeedBack.hide();
	portalObj.setMessage("")
	portalObj.toolbar.changeButtonState("btnCancel","enabled");
	posInFirstField();
}

//-----------------------------------------------------------------------------
function bldBuildIndexXML()
{
// ideally, we should have an index on FILE-PATH;
// since we don't, we ask for all the records
	oIndexXML=null;
	var api="?PROD=LOGAN&FILE=SIRDXMIDX&INDEX=XMLSET1&KEY=&OUT=XML&MAX=1000"
	var oResponse = portalWnd.httpRequest(portalWnd.DMEPath+api,null,"text/plain","text/xml",false)
	if (portalWnd.oError.isErrorResponse(oResponse,true,true,false,
			"Error calling Data service:\n",window))
		return false;

	var arrMsgs=oResponse.getElementsByTagName("MESSAGE")
	var lenMsgs=(arrMsgs?arrMsgs.length:0)
	if (lenMsgs && (arrMsgs[0].getAttribute("status")=="1"))
	{
		lblPDLMessage.innerText = portalObj.getPhrase("LBL_ERROR") + " - " + arrMsgs[0].firstChild.nodeValue;
		return false;
	}

	// set up the resulting document
	oIndexXML = portalWnd.objFactory.createInstance("DOM");
	oIndexXML.async = false;
	oIndexXML.validateOnParse = true;
	oResponse.transformNodeToObject(oIndexXSL, oIndexXML)
	return true;
}

//-----------------------------------------------------------------------------
function bldBuildFileXML()
{
	oFileXML = portalWnd.fileMgr.getList("filelist", 
		parent.contentDir+"/"+strSubFolder, "*.xml",false);
}

//-----------------------------------------------------------------------------
function bldBuildIndexEntryList()
{
	// clear the list
	for (var i=selIndexList.options.length-1; i > -1; i--)
		selIndexList.removeChild(selIndexList.children(i))

	var nodes=(oIndexXML && oIndexXML.documentElement 
			? oIndexXML.documentElement.childNodes : null);
// could limit loop with the following, but need child node position as 'value'
//	var nodes=oIndexXML.selectNodes("//ENTRY[@path='"+strSubFolder+"']")

	var len = nodes ? nodes.length : 0;
	for (var i = 0; i < len; i++)
	{
		if (nodes[i].getAttribute("path") != strSubFolder)
			continue;
		if (oFileXML.selectSingleNode("//FILE[text()='"+nodes[i].getAttribute("file")+"']"))
			continue;
		var strText=nodes[i].getAttribute("tkn");
		var strValue=nodes[i].getAttribute("tkn");
		strText += (strValue.length==6 ? " " : "  ");
		strValue=nodes[i].getAttribute("id");
		strText+=strValue;
		for (var j = strValue.length; j < 16; j++)
			strText+=" ";

		strText+=" ";
		strValue=nodes[i].getAttribute("file")
		strText+=strValue

		var oOption=document.createElement("OPTION")
		selIndexList.options.add(oOption)
		oOption.innerText=strText
		oOption.value=[i]
	}

	btnDeleteIndex.disabled=false;
	btnDeleteIndex.className="xTToolBarButton";
	if (selIndexList.options.length < 1)
	{
		// add a 'none' choice	
		bldAddNoneChoice(selIndexList)	
		btnDeleteIndex.disabled=true;
		btnDeleteIndex.className="xTToolBarButtonDisabled";
	}
}

//-----------------------------------------------------------------------------
function bldBuildFileEntryList()
{
	// clear the list
	for (var i=selFileList.options.length-1; i > -1; i--)
		selFileList.removeChild(selFileList.children(i))

	if (oFileXML!=null && oIndexXML!=null)
	{
		// iterate the files list
		var fNodes=oFileXML.selectNodes("//FILE")
		var len = (fNodes ? fNodes.length : 0);
		for (var i = 0; i < len; i++)
		{
			var strFile=fNodes[i].text
			var dmeNode=oIndexXML.selectSingleNode("//ENTRY[@file='"+strFile+"']")
			if (dmeNode) continue;

			var oOption = document.createElement("option")
			oOption.text = strFile
			oOption.value = strFile
			selFileList.add(oOption)
		}
	}

	btnDeleteFileEntry.disabled=false;
	btnDeleteFileEntry.className="xTToolBarButton";
	if (selFileList.options.length < 1)
	{
		bldAddNoneChoice(selFileList)	
		btnDeleteFileEntry.disabled=true;
		btnDeleteFileEntry.className="xTToolBarButtonDisabled";
	}
}

//-----------------------------------------------------------------------------
function bldAddNoneChoice(sel)
{
	var oOption = document.createElement("option")
	oOption.text = "None"
	oOption.value = ""
	sel.add(oOption)
}

//-----------------------------------------------------------------------------
function bldSetPDLMessage()
{
	// use hidden select to hold valid PDL list
	portalWnd.cmnLoadSelectPDL(selHiddenPDL,"",true);
	portalWnd.cmnLoadSelectProject(selHiddenPDL,"",false);

	// check for PDLs not valid for this environment
	var strQuery = "?_PDL=LOGAN&_TKN=RD69.2&FC=I&_EVT=ADD&_OUT=XML&_LFN=TRUE";

	var oResponse = portalWnd.httpRequest(portalWnd.AGSPath+strQuery,null,"","text/xml",false);
	var msg="Error attempting to retrieve count of Productlines:\n";
	if (portalWnd.oError.isErrorResponse(oResponse,true,true,false,msg,window))
	{
		lblPDLMessage.innerText=parent.oMsgs.getPhrase("msgUnknownInvalidPDL")
		return;
	}

	// check the status message, number
	var ds = portalWnd.oError.getDSObject();
	try {
		errorNbr = ds.getElementValue("MsgNbr");
		errorMsg = ds.getElementValue("Message");
		if (errorNbr != "000")
		{
			lblPDLMessage.innerText = errorNbr + ":" + errorMsg;
			return;
		}
	
	} catch(e) {}

	var nCount=0;
	var nFNbr=1;
	var strNodeNamePre="//XML-PRODLINE"
	var pdlNode = oResponse.selectSingleNode(strNodeNamePre+(nFNbr))
	while (pdlNode)
	{
		// there are 95 product-line nodes! ...but we can't stop at
		// the first one since blank PDL entries may exist! huh?
		if (pdlNode.text !="")
		{
			var len=selHiddenPDL.options.length
			var bFound=false;
			for (var i = 0; i < len; i++)
			{
				if (pdlNode.text==selHiddenPDL.options[i].value)
				{
					bFound=true;
					break;
				}
			}
			if (!bFound) nCount++;
		}
		nFNbr++
		pdlNode = oResponse.selectSingleNode(strNodeNamePre+(nFNbr))
	}

	if (nCount == 0)
		lblPDLMessage.innerText=parent.oMsgs.getPhrase("msgNoInvalidPDL")
	else
		lblPDLMessage.innerText=parent.oMsgs.getPhrase("msgInvalidPDLFound") +" "+ nCount
}

//-----------------------------------------------------------------------------
function bldOnDeleteIndex()
{
	if (selIndexList.selectedIndex == -1) return;

	// confirm delete is ok
	var msg=parent.oMsgs.getPhrase("msgOkToDeleteEntries")
	if ( portalWnd.cmnDlg.messageBox(msg,"okcancel","question",window) != "ok" )
		return;

	portalObj.setMessage(parent.oMsgs.getPhrase("msgPerformingDelete"))
	parent.oFeedBack.show();
	window.setTimeout("bldDoDeleteIndex()",5)
}

//-----------------------------------------------------------------------------
function bldDoDeleteIndex()
{
	var nodes=oIndexXML.documentElement.childNodes
	var len=selIndexList.options.length
	for (var i = len-1; i > -1; i--)
	{
		if (!selIndexList.options[i].selected)
			continue;
		var idxNode=nodes[selIndexList.options[i].value]

		// call filemgr 'delete file' method to delete index entry
		// (ignore any errors: should report 'file not found')
		portalWnd.fileMgr.remove(parent.contentDir+"/"+strSubFolder, 
				idxNode.getAttribute("file"), idxNode.getAttribute("tkn"), 
				idxNode.getAttribute("pdl"), idxNode.getAttribute("id"), false)
	}

	// rebuild the index list - only continue if build index xml succeeds
	if (bldBuildIndexXML())
		bldBuildIndexEntryList();

	parent.oFeedBack.hide();
	portalObj.setMessage("")
}

//-----------------------------------------------------------------------------
function bldOnDeleteFileEntry()
{
	if (selFileList.selectedIndex == -1) return;

	// confirm delete is ok
	var msg=parent.oMsgs.getPhrase("msgOkToDeleteFiles")
	if ( portalWnd.cmnDlg.messageBox(msg,"okcancel","question",window) != "ok" )
		return;

	portalObj.setMessage(parent.oMsgs.getPhrase("msgPerformingDelete"))
	parent.oFeedBack.show();
	window.setTimeout("bldDoDeleteFileEntry()",5)
}

//-----------------------------------------------------------------------------
function bldDoDeleteFileEntry()
{
	var bError=false;
	var strErrorFile=""
	var len=selFileList.options.length
	for (var i = 0; i < len; i++)
	{
		// delete selected options
		if (!selFileList.options[i].selected)
			continue;
		var filename=selFileList.options[i].value
		if (portalWnd.fileMgr.remove(parent.contentDir+"/"+strSubFolder, filename) == null)
		{
			// break on first error
			strErrorFile=parent.contentDir+"/"+strSubFolder+"/"+filename;
			bError=true;
			break;
		}
	}

	if (bError)
	{
		msg=parent.oMsgs.getPhrase("msgErrorDeleteFile")
		msg += "\n"+strErrorFile
		portalWnd.cmnDlg.messageBox(msg,"ok","alert",window)
	}

	// rebuild the file list
	bldBuildFileXML()
	bldBuildFileEntryList()

	parent.oFeedBack.hide();
	portalObj.setMessage("")
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

	return false;
}

//-----------------------------------------------------------------------------
function cntxtActionHandler(evt,action)
{
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"bldindex");
		if (!action || action=="bldindex")
			return false;
	}

	var bHandled=false;
	switch (action)
	{
	case "doSubmit":
	case "doCancel":
        parent.doCancel()
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
function posInFirstField()
{
	selIndexList.focus()
}
