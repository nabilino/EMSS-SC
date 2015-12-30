/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/tools/utils/formpdl.js,v 1.4.2.1.4.1.12.2.6.2 2012/08/08 12:48:54 jomeli Exp $ */
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

var oFormXML=null
var oFormXSL=null
var studioWnd=null
var contentPath=""

//-----------------------------------------------------------------------------
function frmInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	studioWnd=wndArguments[0]
	contentPath=studioWnd.contentPath

	// load the forms XSL
	var path=studioWnd.studioPath+"/tools/utils/formpdl.xsl"
	oFormXSL = studioWnd.xmlFactory.createInstance("DOM");
	oFormXSL.async=false
	oFormXSL.load(path)
	if (oFormXSL.parseError.errorCode != 0)
	{
		studioWnd.displayDOMError(oFormXSL.parseError,path)
		window.close()
		return;
	}

	frmLoadPDLs()

	document.body.style.visibility="visible"
	document.body.style.cursor="auto"

	if (selCurPDL.options.length < 1)
	{
		btnFind.disabled=true
		btnOK.disabled=true
		btnCancel.focus()
	}
	else
		selCurPDL.focus()
}

//-----------------------------------------------------------------------------
function frmLoadPDLs()
{
	// first load the "new" PDL dropdown:
	// choices may only be valid productlines
	studioWnd.cmnLoadSelectPDL(window,selNewPDL,studioWnd.designStudio.getUserVariable("ProductLine"))
	studioWnd.cmnLoadSelectProject(window,selNewPDL)

	// now load the "current" PDL dropdown:
	// choices come from the XML index file (which may contains 'invalid' productlines)
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

	var objPDLXML = studioWnd.SSORequest(studioWnd.AGSPath,api);
	if (!objPDLXML || objPDLXML.status)
	{
		msg="Error retrieving index Product Lines.";
		if (objPDLXML)
			msg+="\n"+studioWnd.getHttpStatusMsg(objPDLXML.status) + "\nServer response: " +
				objPDLXML.statusText + " (" + objPDLXML.status + ")\n\n"
		studioWnd.cmnDlg.messageBox(msg,"ok","stop",window);
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
	var strNodeNamePre="//XML-PRODLINE"
	var pdlNode = objPDLXML.selectSingleNode(strNodeNamePre+(nIndex+1))
	while (pdlNode)
	{
		// there are 95 product-line nodes! ...but we can't stop at
		// the first one since blank PDL entries may exist! huh?
		if (pdlNode.text !="")
		{
			var oOption = document.createElement("OPTION")
			selCurPDL.options.add(oOption)
			oOption.innerText = pdlNode.text
			oOption.value = pdlNode.text
		}
		nIndex++
		pdlNode = objPDLXML.selectSingleNode(strNodeNamePre+(nIndex+1))
	}

	if (selCurPDL.options.length>0)
		selCurPDL.selectedIndex=0
}

//-----------------------------------------------------------------------------
// find forms in repository
function frmDoFind()
{
	// let's protect ourselves!
	if (selCurPDL.options.length < 1) return
	if (selCurPDL.selectedIndex < 0) return

	var api="?PROD=LOGAN&FILE=SIRDXMIDX&INDEX=XMLSET3&KEY=" +
				selCurPDL.options[selCurPDL.selectedIndex].value
	if (txtForm.value!="")
		api+=("&SELECT=TOKEN~"+txtForm.value.toUpperCase())
	api+="&OUT=XML&MAX=1000"

	oFormXML = studioWnd.SSORequest(studioWnd.DMEPath+api);
	if (!oFormXML || oFormXML.status)
	{
		var msg="Error calling Data service.";
		if (oFormXML)
			msg+="\n"+studioWnd.getHttpStatusMsg(oFormXML.status) + "\nServer response: " +
				oFormXML.statusText + " (" + oFormXML.status + ")\n\n"
		studioWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		oFormXML=null;
		return;
	}
	var errNode=oFormXML.selectSingleNode("//ERROR");
	if (errNode)
	{
		errMsg="Error retrieving index entries:\n"+
			errNode.selectSingleNode("MSG").text;
		studioWnd.cmnDlg.messageBox(errMsg,"ok","alert");
		return;
	}

	// remove any forms in the list
	for (var i = selForms.options.length; i > 0 ; i--)
	{
		var oChild=selForms.children(i-1)
		selForms.removeChild(oChild)
	}

	// any hits on find?
	if ( oFormXML.selectSingleNode("//DME/RECORDS")
	&& oFormXML.selectSingleNode("//DME/RECORDS").getAttribute("count") != "0" )
	{
		var options=new Array()
		var strOptions=oFormXML.transformNode(oFormXSL)
		strOptions=strOptions.replace(/\x0A/gm, "")
		strOptions=strOptions.replace(/\n/gm, "")
		options=strOptions.split("~~")

		for (var i = 0; i < options.length; i++)
		{
			var oOption=document.createElement("OPTION")
			selForms.options.add(oOption)
			var values=new Array()
			values=options[i].split("~")
			var strValue=""
			var strText=""
			for (var j = 0; j < values.length; j++)
			{
				var thisVal=studioWnd.trim(values[j])
				strText+=thisVal
				if (j==0)
				{
					if (thisVal.length==6)
						strText+=" "
					else
						strText+="  "
				}
				else if (j==1)
				{
					for (var x = thisVal.length; x < 13; x++)
					{
						strText+=" "
					}
					strText+=" "
				}
				else if (j==2)
				{
					for (var x = thisVal.length; x < 21; x++)
					{
						strText+=" "
					}
					strText+=" "
				}
			}
			oOption.innerText=strText
			oOption.value=options[i]
		}
	}
	else
	{
		var msg=pageXLT.selectSingleNode("//phrase[@id='idNoFormsFound']").text
		studioWnd.cmnDlg.messageBox(msg,"ok","info",window)
	}
}

//-----------------------------------------------------------------------------
function frmOnKeyDown()
{
	if (event.srcElement.id=="btnFind" && event.keyCode==13)
		return;		// let the onclick handler have it
	else if (khdlOKCancel(event))
	{
		event.cancelBubble=true
		event.returnValue=false
		return true
	}
	return(false)
}

//-----------------------------------------------------------------------------
// handle dialog btnOK and btnCancel keys (call from keypress event):
// enter fires btnOK; ESC fires btnCancel
function khdlOKCancel(evt)
{
	if (evt.keyCode==13)		// enter
	{
		if (document.activeElement.id == "btnCancel") return false
		if (document.activeElement.id != "btnOK"
		&& document.activeElement.id.substr(0,3) == "btn")
			return false
		document.all.btnOK.click()
		return true
	}
	else if (evt.keyCode==27)	// ESC
	{
		document.all.btnCancel.click()
		return true
	}
	return false
}

//-----------------------------------------------------------------------------
function frmOnOK()
{
	// has the user selected any forms?
	var bAnySelected=false
	for (var i = 0; i < selForms.options.length; i++)
	{
		if (selForms.options[i].selected)
		{
			bAnySelected=true
			break
		}
	}
	if (!bAnySelected)
	{
		var msg=pageXLT.selectSingleNode("//phrase[@id='idSelectForm']").text
		studioWnd.cmnDlg.messageBox(msg,"ok","alert",window)
		selForms.focus()
		return
	}

	// do we have a different PDL specified?
	if (selCurPDL.options[selCurPDL.selectedIndex].value ==
			selNewPDL.options[selNewPDL.selectedIndex].value)
	{
		var msg=pageXLT.selectSingleNode("//phrase[@id='idSamePDL']").text
		studioWnd.cmnDlg.messageBox(msg,"ok","alert",window)
		selNewPDL.focus()
		return
	}

	document.body.style.cursor="wait"
	setTimeout("frmSetPDL()", 5)
}

//-----------------------------------------------------------------------------
function frmSetPDL()
{
	document.body.style.cursor="auto"

	// build a list of forms to update
	var strContent="<DBFILECONV oldpdl=\"" + selCurPDL.options[selCurPDL.selectedIndex].value +
		"\" newpdl=\"" + selNewPDL.options[selNewPDL.selectedIndex].value + "\" >"

	// get the DME columns node and its children
	var colNode=oFormXML.selectSingleNode("//DME/COLUMNS").cloneNode(true)
	strContent+=colNode.xml

	// for each selected form, get the DME record node
	var recsNode=oFormXML.selectSingleNode("//DME/RECORDS")
	for (var i = 0; i < selForms.options.length; i++)
	{
		if (selForms.options[i].selected)
		{
			var recNode=recsNode.childNodes[i].cloneNode(true)
			strContent+=recNode.xml
		}
	}
	strContent+="</DBFILECONV>"

	// call the filemgr
	var oFileMgr = studioWnd.fileMgr.dbFileConv(strContent,studioWnd.contentPath);
	if (oFileMgr==null) return;

	// now loop through the results
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

		icon="alert";
		if (msgNode.getAttribute("status")!="0")
		{
			// error in execution
			var nodes = msgNode.childNodes;
			var len = (nodes && nodes.length ? nodes.length : 0);
			for (var i=0; i < len; i++)
			{
				if (nodes[i].nodeType == 3 || nodes[i].nodeType == 4)
					msg += nodes[i].nodeValue;
			}
		}

		else if (fileMsgs == "")
		{
			// no execution error, no files in error
			msg="Set PDL Successful";
			icon="info";
		}
		else
			// no execution error, but files are in error
			msg="Error Returned By FileManager";
		msg+=fileMsgs+"\n\n";
	}
	// all done
	studioWnd.cmnDlg.messageBox(msg,"ok",icon,window)

//	window.returnValue=true
//	window.close()
}

