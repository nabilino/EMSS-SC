/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/wizards/erp_open.js,v 1.7.2.2.4.1.22.2 2012/08/08 12:48:54 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// erp_open.js
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

var tabArray = new Array()
tabArray[0] = "tabOpen"
var maxTabIndex=0;
var dlgActiveTab=null;

var dsSelections=null;
var bReloadList=true;
var studioWnd=null;
var oDirXML=null;
var oDirXSL=null;
var currentRow=null;

var strRowClass="dsListText"
var strRowSelClass="dsListTextHighlight"
var strFileRow="fileRow"

var bDeleteDlg=false;

//-----------------------------------------------------------------------------
function dlgInit()
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

	// set the active tab
	dlgActiveTab = window.document.all.tabOpen

 	// initialize values
	dsSelections = new studioWnd.DataStorage()

	var path=studioWnd.studioPath+"/uidesigner/wizards/erp_open.xsl"
	oDirXSL = studioWnd.xmlFactory.createInstance("DOM");
	oDirXSL.async=false
	oDirXSL.load(path)
	if (oDirXSL.parseError.errorCode != 0)
	{
		studioWnd.displayDOMError(oDirXSL.parseError,path)
		window.close()
		return;
	}

	studioWnd.cmnLoadSelectPDL(window,cboPDL,studioWnd.designStudio.getUserVariable("ProductLine"))
	studioWnd.cmnLoadSelectProject(window,cboPDL)
	if (bDeleteDlg)
		btnOK.value="Delete"
	else
		btnDelete.style.display="inline"
 	
	// show the document
	window.document.body.style.visibility="visible"
	btnOK.disabled=true;
	if (cboPDL.options.length)
		txtToken.focus()
	else
		btnCancel.focus()
}

//-----------------------------------------------------------------------------
function dlgOnKeyDown()
{
	var bEvtCaught=false;
	switch(event.keyCode)
	{
	case studioWnd.keys.ESCAPE:
		bEvtCaught=true
		window.close()
		break;
	case studioWnd.keys.ENTER:
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			btnOK.click()
			bEvtCaught=true
		}
		else if (event.srcElement.id == "txtToken")
		{
			btnFind.click()
			bEvtCaught=true
		}
		break;
	case studioWnd.keys.PAGE_UP:
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			dlgMoveFilePage(-1)
			bEvtCaught=true
		}
		break;
	case studioWnd.keys.PAGE_DOWN:
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			dlgMoveFilePage(1)
			bEvtCaught=true
		}
		break;
	case studioWnd.keys.HOME:
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			dlgMoveFileHomeEnd(-1)
			bEvtCaught=true
		}
		break;
	case studioWnd.keys.END:
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			dlgMoveFileHomeEnd(1)
			bEvtCaught=true
		}
		break;
	case studioWnd.keys.UP_ARROW:
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			dlgMoveFileRow(-1)
			bEvtCaught=true
		}
		break;
	case studioWnd.keys.DOWN_ARROW:
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			dlgMoveFileRow(1)
			bEvtCaught=true
		}
		break;
	}
	if (bEvtCaught)
	{
		event.cancelBubble=true;
		event.returnValue=true;
	}
	return (!bEvtCaught)
}

//-----------------------------------------------------------------------------
function dlgActivateTab(inc)
{
	var curIndex = parseInt(dlgActiveTab.tabind)
	var tabIndex = curIndex + inc

	if(tabIndex < 0)
		tabIndex = 0
	else if (tabIndex > maxTabIndex)
		tabIndex = maxTabIndex

	if (curIndex == tabIndex) return;

	var objTab = document.getElementById(tabArray[tabIndex])
	if(objTab.id == dlgActiveTab.id) return;

	// make the previously active tab inactive
	window.document.all["div" + dlgActiveTab.id.substr(3)].style.display = "none"
	window.document.all["tab" + dlgActiveTab.id.substr(3)].style.display = "none"

	// show the new active tab and div
	objTab.style.display="block"
	window.document.all["div"+objTab.id.substr(3)].style.display = "block"

	switch(objTab.id)
	{
		case "tabOpen":
			break;
	}

	// save reference to new active tab
	dlgActiveTab = objTab
}

//-----------------------------------------------------------------------------
function dlgDoFind()
{
	if (cboPDL.selectedIndex < 0) return;
		
	var api=studioWnd.DMEPath+"?PROD=LOGAN&FILE=SIRDXMIDX&FIELD=TOKEN;ID;FILE-NAME;FILE-PATH;" +
				"&INDEX=XMLSET3&KEY="+cboPDL.options[cboPDL.selectedIndex].text
	if (txtToken.value!="")
		api+=("&SELECT=TOKEN~"+txtToken.value.toUpperCase())
	api+="&OUT=XML&MAX=1000"

	oDirXML=studioWnd.SSORequest(api);
	if (!oDirXML || oDirXML.status)
	{
		var msg="Error calling Data service.\n";
		if (oDirXML)
			msg+=studioWnd.getHttpStatusMsg(oDirXML.status) + 
				"\nServer response: " + oDirXML.statusText + " (" + oDirXML.status + ")" 
		oDirXML=null;
		studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
	}
	else if(oDirXML.xml == "")
	{
		oDirXML=null;
		var msg=pageXLT.selectSingleNode("//phrase[@id='msgInvalidServerResponse']").text
		studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
	}
	else
	{
		var errNode=oDirXML.selectSingleNode("//ERROR")
		if (errNode)
		{
			oDirXML=null;
			var msg=pageXLT.selectSingleNode("//phrase[@id='msgDMEError']").text + 
					"\n" + errNode.selectSingleNode("MSG").text
			studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
		}
	}
	if (!oDirXML) return;

	txtFile.value=""
	btnDelete.disabled=true;
	var noneHTML="<label class=\"dsListText\">&nbsp;None</label>"
	var root=oDirXML.documentElement
	if (root)
	{
		listFiles.innerHTML=oDirXML.transformNode(oDirXSL)
		if ( !dlgChooseFirstFile() )
			listFiles.innerHTML=noneHTML;
		else if ( !bDeleteDlg )
			btnDelete.disabled=false;
	}
	else
		listFiles.innerHTML=noneHTML;

	btnOK.disabled = (txtFile.value == "" ? true : false);
}

//-----------------------------------------------------------------------------
function dlgChooseFirstFile()
{
	var firstRow=document.getElementById(strFileRow+"1")
	if (!firstRow) return (false);
	currentRow=firstRow

	if (txtFile.value != "")
	{
		var idx=1
		var thisRow=firstRow
		do
		{
			if (thisRow.value==txtFile.value)
			{
				currentRow=thisRow
				break;
			}
			idx += 1
			thisRow=document.getElementById(strFileRow+idx)
		}
		while (thisRow!=null);
	}
	currentRow.className=strRowSelClass
	currentRow.tabIndex=0
	listFiles.scrollTop=0

	if (currentRow.type=="file" && txtFile.value=="")
		txtFile.value=currentRow.value
	return (true);
}

//-----------------------------------------------------------------------------
function dlgMoveFileRow(inc)
{
	if (!currentRow) return

	var rowidx = parseInt(currentRow.id.substr(strFileRow.length))
	if (rowidx==0 && inc == -1) return

	rowidx += inc
	var nextId=strFileRow+rowidx
	var row=document.getElementById(nextId)
	if (row) dlgOnFileClick(row)
}

//-----------------------------------------------------------------------------
function dlgMoveFilePage(inc)
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

	dlgOnFileClick(row)
}

//-----------------------------------------------------------------------------
function dlgMoveFileHomeEnd(inc)
{
	var row=null
	var rowidx = -1
	if (currentRow)
		rowidx=parseInt(currentRow.id.substr(strFileRow.length))

	if (inc == -1)		// move home
	{
		var firstRow=document.getElementById(strFileRow+"1")
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

	dlgOnFileClick(row)
}

//-----------------------------------------------------------------------------
function dlgOnFileClick(mElement)
{
	if (currentRow)
	{
		currentRow.className=strRowClass
		currentRow.tabIndex=-1
	}
	currentRow=mElement
	mElement.className=strRowSelClass
	mElement.tabIndex=0
	mElement.focus()
	if (mElement.type=="file")
		txtFile.value=mElement.value
}

//-----------------------------------------------------------------------------
function dlgOnListDblClick()
{
	dlgOnClickOK(btnOK)
}

//-----------------------------------------------------------------------------
function dlgOnClickOK(btn)
{
	if (cboPDL.selectedIndex < 0) return;
	if (txtFile.value == "") return;

	if (btn.value == "Delete")
	{
		dlgPerformDelete()
		return
	}

	var rec = oDirXML.selectSingleNode("/DME/RECORDS/RECORD[RECKEY = '"+currentRow.key+"']")
	if (!rec)
	{
		var msg=pageXLT.selectSingleNode("//phrase[@id='msgErrorFormFileMissing']").text
		studioWnd.cmnDlg.messageBox(msg+"\n"+txtFile.value,"ok","alert",window)
		return;
	}
	var strTKN=rec.childNodes[1].childNodes[0].text
	var strID=rec.childNodes[1].childNodes[1].text
	var strFileName=rec.childNodes[1].childNodes[2].text
	
	var strDir=studioWnd.contentPath + "/" + rec.childNodes[1].childNodes[3].text
	// strip trailing slash?
	if (strDir.lastIndexOf("/") == (strDir.length-1))
		strDir=strDir.substr(0, strDir.length-1)

	var strFullPath=studioWnd.contentPath + "/" + rec.childNodes[1].childNodes[3].text + "/" + strFileName
	var path=studioWnd.contentPath + "/" + rec.childNodes[1].childNodes[3].text;
	if (!dlgServerFileExists(path,strFileName))
	{
		var msg=pageXLT.selectSingleNode("//phrase[@id='msgErrorFormFileMissing']").text
		studioWnd.cmnDlg.messageBox(msg+"\n"+strFullPath,"ok","alert",window)
		return;
	}

	dsSelections.add("pdl",cboPDL.options[cboPDL.selectedIndex].text)
	dsSelections.add("sys","")
	dsSelections.add("tkn",strTKN)
	dsSelections.add("id",strID)

	// give framework an override of default document name and path
	studioWnd.designStudio.commandHandler.commandInfo.docName = strFileName
	studioWnd.designStudio.commandHandler.commandInfo.docPath = strDir

	window.returnValue=dsSelections
	window.close()
}

//-----------------------------------------------------------------------------
function dlgServerFileExists(folder,fileName)
{
	var oFile=studioWnd.fileMgr.getFile(folder,fileName,"text/xml",false);
	if ( !oFile || oFile.status )
		return false;

	var msgNode=oFile.selectSingleNode("//MSG");
	return ( msgNode && msgNode.getAttribute("status") == "1" ? false : true );
}


//-----------------------------------------------------------------------------
function dlgPerformDelete()
{
	if (cboPDL.selectedIndex < 0) return false;
	var idx=parseInt(currentRow.id.substr(strFileRow.length))-1
	var recs = oDirXML.selectNodes("/DME/RECORDS/RECORD/COLS")
	if (recs.length < 1) return false;

	var strTKN=recs[idx].childNodes[0].text
	var strID=recs[idx].childNodes[1].text
	var strFileName=recs[idx].childNodes[2].text
	var msg=pageXLT.selectSingleNode("//phrase[@id='msgOkToDelete']").text
	msg += ( " '" + strTKN + " " + strID + " " +
		studioWnd.contentPath + "/" + recs[idx].childNodes[3].text + "/" + strFileName + "'?")
	var strDir=studioWnd.contentPath + "/" + recs[idx].childNodes[3].text
	// strip trailing slash?
	if (strDir.lastIndexOf("/") == (strDir.length-1))
		strDir=strDir.substr(0, strDir.length-1)

	if (studioWnd.cmnDlg.messageBox(msg,"okcancel","question",window) != "ok")
		return false;

	var retVal=false
	try
	{
		var oDelXML = studioWnd.fileMgr.remove(studioWnd.contentPath + "/" + 
				strDir.substr(studioWnd.contentPath.length+1), strFileName, 
				strTKN, cboPDL.options[cboPDL.selectedIndex].text, strID);
		if (oDelXML==null) return false;

		// file deleted, update the file recent list
		var ds=new studioWnd.DataStorage();
		ds.add("docName", strFileName);
		ds.add("docPath", strDir);
		studioWnd.designStudio.popRecentFileDS(ds);

		// file deleted, rebuild list
		txtFile.value=""
		dlgDoFind()
		retVal = true
	}
	catch(e)
	{
		var msg=pageXLT.selectSingleNode("//phrase[@id='msgErrorFormFileMissing']").text + strFileName + "."
		studioWnd.cmnDlg.messageBox(msg,"ok","alert",window)
	}
	return (retVal);
}
