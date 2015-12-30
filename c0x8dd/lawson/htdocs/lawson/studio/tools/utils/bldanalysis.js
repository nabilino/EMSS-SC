/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/tools/utils/bldanalysis.js,v 1.4.2.3.26.2 2012/08/08 12:48:54 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// bldanalysis.js
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
var parentWnd=null
var oIndexXML=null
var oIndexXSL=null
var oFileXML=null
var strFolder=""
var strSubFolder=""

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
	studioWnd = wndArguments[0]
	parentWnd = wndArguments[1]
	strFolder=wndArguments[2]
	strSubFolder=strFolder.substr(studioWnd.contentPath.length+1)

	// load the forms XSL
	var path=studioWnd.studioPath+"/tools/utils/bldanalysis.xsl"
	oIndexXSL = studioWnd.xmlFactory.createInstance("DOM");
	oIndexXSL.async=false
	oIndexXSL.load(path)
	if (oIndexXSL.parseError.errorCode != 0)
	{
		studioWnd.displayDOMError(oIndexXSL.parseError,path)
		window.close()
		return;
	}

	// show the document
	document.body.style.visibility="visible"
	window.setTimeout("bldPerformAnalysis()",5)
}

//-----------------------------------------------------------------------------
function bldPerformAnalysis()
{
	// perform analysis
	lblFolderName.innerText=strFolder
	bldBuildIndexXML()
	bldBuildFileXML()
	bldBuildFileEntryList()
	bldBuildIndexEntryList()
	bldSetPDLMessage()

	// show the document
	waitDiv.style.display="none";
	document.body.style.cursor="auto";
	btnOK.focus()
}

//-----------------------------------------------------------------------------
function bldBuildIndexXML()
{
// ideally, we should have an index on FILE-PATH;
// since we don't, we ask for all the records
	var api="?PROD=LOGAN&FILE=SIRDXMIDX&INDEX=XMLSET1&KEY&OUT=XML&MAX=1000"
	var tempDOM = studioWnd.SSORequest(studioWnd.DMEPath+api,null,"","",false);
	if(!tempDOM || (tempDOM.status && tempDOM.status >= 400))
	{
		var msg="Error retrieving Index XML.";
		if (tempDOM)
			msg+="\n"+studioWnd.getHttpStatusMsg(tempDOM.status) + "\nServer response: " +
				tempDOM.statusText + " (" + tempDOM.status + ")\n\n"
		studioWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		return;
	}

	// did DME return an error message?
	var errNode=tempDOM.selectSingleNode("//ERROR");
	if (errNode)
	{
		var msg="Error retrieving index entries:\n"+
			errNode.selectSingleNode("MSG").text;
		studioWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		return;
	}

	// set up the resulting document
	oIndexXML = studioWnd.xmlFactory.createInstance("DOM");
	oIndexXML.async = false;
	oIndexXML.validateOnParse = true;
	tempDOM.transformNodeToObject(oIndexXSL, oIndexXML)
}

//-----------------------------------------------------------------------------
function bldBuildFileXML()
{
	oFileXML = studioWnd.fileMgr.getList("filelist", 
				studioWnd.contentPath+"/"+strSubFolder,"*.xml");
}

//-----------------------------------------------------------------------------
function bldBuildIndexEntryList()
{
	// clear the list
	for (var i=selIndexList.options.length-1; i > -1; i--)
		selIndexList.removeChild(selIndexList.children(i))

	var nodes=oIndexXML.documentElement.childNodes
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
	if (selIndexList.options.length < 1)
	{
		// add a 'none' choice	
		bldAddNoneChoice(selIndexList)	
		btnDeleteIndex.disabled=true;
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
	if (selFileList.options.length < 1)
	{
		bldAddNoneChoice(selFileList)	
		btnDeleteFileEntry.disabled=true;
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
	studioWnd.cmnLoadSelectPDL(window,selHiddenPDL,studioWnd.designStudio.getUserVariable("ProductLine"))
	studioWnd.cmnLoadSelectProject(window,selHiddenPDL)

	// check for PDLs not valid for this environment
	var api = "<?xml version=\"1.0\"?>"
	+"<XRD69.2>"
	+"<RD69.2>"
	+"<_OUT>XML</_OUT>"
	+"<_PDL>LOGAN</_PDL>"
	+"<_TKN>RD69.2</_TKN>"
	+"<_LFN>TRUE</_LFN>"
	+"<_EVT>ADD</_EVT>"
	+"<FC>I</FC>"
	+"</RD69.2>"
	+"</XRD69.2>"


	var objPDLXML = studioWnd.SSORequest(studioWnd.AGSPath,api,"","",false);
	if(!objPDLXML || objPDLXML.status)
	{
		var msg="Server error: ";
		if (objPDLXML)
			msg+=objPDLXML.statusText + " (" + objPDLXML.status + ")\n\n"
		lblPDLMessage.innerText=msg;
		return;
	}

	// check for error message
	var errNode=objPDLXML.selectSingleNode("//ERROR")
	if (errNode)
	{
		errMsg="Error retrieving index Product Lines:\n"+
			errNode.selectSingleNode("MSG").text;
		studioWnd.cmnDlg.messageBox(errMsg,"ok","alert");
		return;
	}

	var nIndex=0
	var nCount=0
	var strNodeNamePre="//XML-PRODLINE"
	var pdlNode = objPDLXML.selectSingleNode(strNodeNamePre+(nIndex+1))
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
		nIndex++
		pdlNode = objPDLXML.selectSingleNode(strNodeNamePre+(nIndex+1))
	}

	if (nCount == 0)
		lblPDLMessage.innerText=pageXLT.selectSingleNode("//phrase[@id='msgNoInvalidPDL']").text
	else
		lblPDLMessage.innerText=pageXLT.selectSingleNode("//phrase[@id='msgInvalidPDLFound']").text +" "+ nCount
}

//-----------------------------------------------------------------------------
function bldOnKeyDown()
{
	if (event.keyCode == studioWnd.keys.ESCAPE)
	{
		window.close()
		studioWnd.setEventCancel(event)
		return (false);
	}
}

//-----------------------------------------------------------------------------
function bldOnDeleteIndex()
{
	if (selIndexList.selectedIndex == -1) return;

	// confirm delete is ok
	var msg=pageXLT.selectSingleNode("//phrase[@id='msgOkToDeleteEntries']").text
	if ( studioWnd.cmnDlg.messageBox(msg,"okcancel","question",window) != "ok" )
		return;

	var nodes=oIndexXML.documentElement.childNodes
	var len=selIndexList.options.length
	for (var i = len-1; i > -1; i--)
	{
		if (!selIndexList.options[i].selected)
			continue;
		var idxNode=nodes[selIndexList.options[i].value]

		// call filemgr 'delete file' method to delete index entry
		// (ignore any errors: should report 'file not found')
		studioWnd.fileMgr.remove(studioWnd.contentPath+"/"+strSubFolder, 
				idxNode.getAttribute("file"), idxNode.getAttribute("tkn"), 
				idxNode.getAttribute("pdl"), idxNode.getAttribute("id"), false)
	}

	// rebuild the index list
	bldBuildIndexXML()
	bldBuildIndexEntryList()
}

//-----------------------------------------------------------------------------
function bldOnDeleteFileEntry()
{
	if (selFileList.selectedIndex == -1) return;

	// confirm delete is ok
	var msg=pageXLT.selectSingleNode("//phrase[@id='msgOkToDeleteFiles']").text
	if ( studioWnd.cmnDlg.messageBox(msg,"okcancel","question",window) != "ok" )
		return;

	var bError=false;
	var strErrorFile=""
	var len=selFileList.options.length
	for (var i = 0; i < len; i++)
	{
		// delete selected options
		if (!selFileList.options[i].selected)
			continue;
		var filename=selFileList.options[i].value
		if (studioWnd.fileMgr.remove(studioWnd.contentPath+"/"+strSubFolder, filename) == null)
		{
			// break on first error
			strErrorFile=studioWnd.contentPath+"/"+strSubFolder+"/"+filename;
			bError=true;
			break;
		}
	}

	if (bError)
	{
		msg=pageXLT.selectSingleNode("//phrase[@id='msgErrorDeleteFile']").text
		msg += "\n"+strErrorFile
		studioWnd.cmnDlg.messageBox(msg,"ok","alert",window)
	}

	// rebuild the file list
	bldBuildFileXML()
	bldBuildFileEntryList()
}
