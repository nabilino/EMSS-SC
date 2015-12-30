/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/tools/utils/wizpdl.js,v 1.3.28.2 2012/08/08 12:48:54 jomeli Exp $ */
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

var studioWnd=null;
var contentPath="";

//-----------------------------------------------------------------------------
function wizInit()
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

	txtfolder.value=contentPath+"/wizards"
	wizLoadPDLs()

	document.body.style.visibility="visible"
	btnOK.focus()
}

//-----------------------------------------------------------------------------
function wizLoadPDLs()
{
	studioWnd.cmnLoadSelectPDL(window,cboPDL,studioWnd.designStudio.getUserVariable("ProductLine"))
	studioWnd.cmnLoadSelectProject(window,cboPDL)
}

//-----------------------------------------------------------------------------
function wizOnKeyDown()
{
	if (event.keyCode==13)		// enter
	{
		if (document.activeElement.id == "btnCancel") return false
		if (document.activeElement.id != "btnOK"
		&& document.activeElement.id.substr(0,3) == "btn")
			return false
		document.all.btnOK.click()
		event.cancelBubble=true
		event.returnValue=false
		return true
	}
	else if (event.keyCode==27)	// ESC
	{
		document.all.btnCancel.click()
		event.cancelBubble=true
		event.returnValue=false
		return true
	}
	return(false)
}

//-----------------------------------------------------------------------------
function wizOnOK()
{
	document.body.style.cursor="wait"
	setTimeout("wizSetPDL()", 5)
}

//-----------------------------------------------------------------------------
function wizSetPDL()
{
	document.body.style.cursor="auto"
	if (cboPDL.selectedIndex == -1) return

	// get a list of wizard files
	var oFileMgrXML = studioWnd.fileMgr.getList("filelist", contentPath+"/wizards", "*.xml")
	if (oFileMgrXML==null) return

	// now loop through the list
	var nCount=0
	var fileNodes=oFileMgrXML.selectNodes("//FILE")
	for (var i = 0; i < fileNodes.length; i++)
	{
		if ( wizUpdateFile(fileNodes[i].text) )
			nCount++
	}

	// all done
	var msg=pageXLT.selectSingleNode("//phrase[@id='idCompleteMsg1']").text +
			" " + nCount + " " + pageXLT.selectSingleNode("//phrase[@id='idCompleteMsg2']").text
	studioWnd.cmnDlg.messageBox(msg,"ok","info",window)

	window.returnValue=true
	window.close()
}

//-----------------------------------------------------------------------------
function wizUpdateFile(name)
{
	var path=txtfolder.value+"/"+name

	wizXML = studioWnd.xmlFactory.createInstance("DOM");
	wizXML.async=false
	wizXML.load(path)
	if (wizXML.parseError.errorCode != 0)
	{
		studioWnd.displayDOMError(wizXML.parseError,path)
		return false;
	}

	// can we get the root node?
	var root=wizXML.documentElement
	if (!root) return false;

	// don't change a LOGAN type wizard
	var strPDL=root.getAttribute("pdl")
	if (strPDL && strPDL=="LOGAN") return false;

	// now update the attribute and write the file back
	try {
		root.setAttribute("pdl", cboPDL.options[cboPDL.selectedIndex].value)
		if ( studioWnd.fileMgr.save(contentPath+"/wizards", name, root.xml, "text/xml")!=null )
			return true;

	} catch (e) { }
	return false;
}

