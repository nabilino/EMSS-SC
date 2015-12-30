/*$Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/utility/formpdl.js,v 1.22.2.6.4.14.14.2.2.3 2012/08/08 12:37:22 jomeli Exp $*/
/*$NoKeywords: $*/
/*LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00*/
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

var portalObj=null;
var portalWnd=null;
var oFormXML=null;
var oFeedBack=null;

var contentDir=""
var selCurPDL
var selNewPDL
var selForms
var txtForm

//-----------------------------------------------------------------------------
function frmInit()
{
	portalWnd=envFindObjectWindow("lawsonPortal");
	portalObj=portalWnd.lawsonPortal;
	oMsgs=new portalWnd.phraseObj("utility");

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	var title=oMsgs.getPhrase("lblTitleSetPDL");
	portalObj.setMessage(portalObj.getPhrase("LBL_LOADING") + " " + title);

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
		clear();
		target=window;
		createButton(oMsgs.getPhrase("btnUpdate"), "doUpdate()", "update", "disabled","","chg");
		createButton(portalObj.getPhrase("LBL_HOME"), "doCancel()", "cancel","","","home");
	}
	oFeedBack = new FeedBack(window,portalWnd);

	// set labels on screen
	document.getElementById("lblCurPDL").innerHTML=oMsgs.getPhrase("lblCurPDL")
	document.getElementById("lblNewPDL").innerHTML=oMsgs.getPhrase("lblNewPDL")
	document.getElementById("lblFormFilter").innerHTML=oMsgs.getPhrase("lblFormFilter")
	document.getElementById("lblSelectForms").innerHTML=oMsgs.getPhrase("lblSelectForms")
	document.getElementById("btnFind").value=oMsgs.getPhrase("btnFind")

	selCurPDL=document.getElementById("selCurPDL")
	selNewPDL=document.getElementById("selNewPDL")
	txtForm=document.getElementById("txtForm")
	selForms=document.getElementById("selForms")

	contentDir=portalObj.path+"/content"

	frmLoadPDLs()

	document.body.style.visibility="visible"
	document.body.style.cursor="auto"

	if (selCurPDL.options.length < 1)
		document.getElementById("btnFind").disabled=true
	posInFirstField()
	portalObj.setMessage("")
}

//-----------------------------------------------------------------------------
function posInFirstField()
{
	if (selCurPDL.options.length < 1)
		portalWnd.frmPositionInToolbar()
	else
		selCurPDL.focus()
}

//-----------------------------------------------------------------------------
function frmLoadPDLs()
{
	// first load the "new" PDL dropdown:
	// choices may only be valid productlines
	var strDefault=portalWnd.oUserProfile.getAttribute("productline");
	portalWnd.cmnLoadSelectPDL(selNewPDL,strDefault);
	portalWnd.cmnLoadSelectProject(selNewPDL,strDefault,false);
	
	// now load the "current" PDL dropdown:
	// choices come from the XML index file (which may contains 'invalid' productlines)
	var strQuery = "?_PDL=LOGAN&_TKN=RD69.2&FC=I&_EVT=ADD&_OUT=XML&_LFN=TRUE";

	var oResponse = portalWnd.httpRequest(portalWnd.AGSPath+strQuery,null,"","text/xml",false)
	var msg = "Error calling Data service to retrieve ProductLines.\n";
	if (portalWnd.oError.isErrorResponse(oResponse,true,true,false,msg,window))
		return;

	// check the status message, number
	var ds = portalWnd.oError.getDSObject();
	try {
		errorNbr = ds.getElementValue("MsgNbr");
		errorMsg = ds.getElementValue("Message");
		if (errorNbr != "000")
		{
			msg+=errorNbr + ":" + errorMsg;
			portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
			portalWnd.goBack();
			return;
		}
	
	} catch(e) {}

	var nIndex=0;
	var nFNbr=1;
	var strNodeNamePre="XML-PRODLINE";
	var pdlNode = ds.getNodeByName(strNodeNamePre+(nFNbr))
	while (pdlNode)
	{
		// there are 95 product-line nodes! ...but we 
		// can't stop at the first one since blank PDL entries may exist! huh?
		var pdlText=portalWnd.cmnGetElementText(pdlNode);
		if (pdlText)
		{
			if (portalObj.browser.isIE)
			{
				var oOption = document.createElement("OPTION");
				selCurPDL.options.add(oOption);
				oOption.text = pdlText;
				oOption.value = pdlText;
			}
			else
			{
				selCurPDL.options[nIndex] = new Option(pdlText, pdlText);
				nIndex++;
			}
		}
		nFNbr++
		pdlNode = ds.getNodeByName(strNodeNamePre+(nFNbr))
	}

	if (selCurPDL.options.length>0)	
		selCurPDL.selectedIndex=0
}

//-----------------------------------------------------------------------------
// button click handler
function frmOnFindClick()
{
	oFeedBack.show();
	portalObj.setMessage(oMsgs.getPhrase("msgPerformingFind"))
	setTimeout("frmDoFind()", 5)
}

//-----------------------------------------------------------------------------
// find forms in repository
function frmDoFind()
{
	// let's protect ourselves!
	portalObj.toolbar.changeButtonState("update","disabled");
	if (selCurPDL.options.length < 1)
	{
		portalObj.setMessage("");
		oFeedBack.hide();
		return;
	}
	if (selCurPDL.selectedIndex < 0)
	{
		portalObj.setMessage("");
		oFeedBack.hide();
		return;
	}

	var msg="";	
	var api="?PROD=LOGAN&FILE=SIRDXMIDX&INDEX=XMLSET3&KEY=" + 
				selCurPDL.options[selCurPDL.selectedIndex].value
	if (txtForm.value!="")
		api+=("&SELECT=TOKEN~"+txtForm.value.toUpperCase())
	api+="&OUT=XML&MAX=1000"
	
	var oXML = portalWnd.httpRequest(portalWnd.DMEPath+api,null,"text/plain","text/xml",false);
	var msg = portalObj.getPhrase("msgErrorCallingDME")+"\n";
	if (portalWnd.oError.isErrorResponse(oXML,true,true,false,msg,window))
	{
		portalObj.setMessage("")
		oFeedBack.hide();
		return;
	}

	oFormXML = portalWnd.oError.getDSObject();
	var arrMsgs=oFormXML.document.getElementsByTagName("MESSAGE")
	var lenMsgs=(arrMsgs?arrMsgs.length:0)
	if (lenMsgs && (arrMsgs[0].getAttribute("status")=="1"))
	{
		var msg = portalObj.getPhrase("LBL_ERROR") + " - " + arrMsgs[0].firstChild.nodeValue;
		portalWnd.cmnDlg.messageBox(msg,"ok","stop", window);
		portalObj.setMessage("")
		oFeedBack.hide();
		return;
	}	

	// remove any forms in the list
	for (var i = selForms.options.length; i > 0 ; i--)
	{
		var oChild
		if (portalObj.browser.isIE)
			oChild=selForms.children(i-1);
		else
			oChild=selForms.childNodes[i-1];
		selForms.removeChild(oChild);
	}

	// any hits on find?
	var rcdsNode=oFormXML.getNodeByName("RECORDS");
	if ( rcdsNode && rcdsNode.getAttribute("count") == "0" )
	{
		portalObj.setMessage("");
		oFeedBack.hide();
		msg=oMsgs.getPhrase("idNoFormsFound");
		portalWnd.cmnDlg.messageBox(msg,"ok","info",window);
		return;
	}

	// call Data service and transform the output
	var str="";
	var objDmeApi=portalWnd.DMEPath+api;
	var xslURL=portalWnd.getFullUrl(portalObj.path+"/utility/formlist.xsl");
	var transAPI=objDmeApi+"&_XSL1="+xslURL;

	var oResponse=portalWnd.httpRequest(transAPI,null,"text/plain","text/html",false);

	var msg = portalObj.getPhrase("msgErrorCallingDME")+"\n";
	if (!portalWnd.oError.handleBadResponse(oResponse,true,msg,window))
		str=oResponse;
	if (typeof(str) == "object")
	{
		portalWnd.oError.isErrorResponse(str,true,true,false,msg,window);
		str="";
	}

	str=str.replace(/\x0A/gm, "")
	str=str.replace(/\n/gm, "")

	var options=new Array();
	options=str.split("~~")
	for (var i = 0; i < options.length; i++)
	{
		var values=new Array()
		values=options[i].split("~")
		var strValue=""
		var strText=""
		for (var j = 0; j < values.length; j++)
		{
			var thisVal=portalWnd.trim(values[j])
			strText+=thisVal
			if (j==0)
				strText+=(thisVal.length==6 ? " " : "  ");
			else if (j==1)
			{
				for (var x = thisVal.length; x < 13; x++)
					strText+=" ";
				strText+=" ";
			}
			else if (j==2)
			{
				for (var x = thisVal.length; x < 21; x++)
					strText+=" ";
				strText+=" ";
			}
		}
		var oOption=document.createElement("OPTION")
		if (portalObj.browser.isIE)
		{
			selForms.options.add(oOption)
			oOption.innerText=strText
			oOption.value=portalWnd.trim(options[i])
		}
		else
		{
			oOption.appendChild(document.createTextNode(strText))
			oOption.value = portalWnd.trim(options[i])
			selForms.appendChild(oOption)
		}
	}
	if (selForms.options.length > 0)
		portalObj.toolbar.changeButtonState("update","enabled");
	portalObj.setMessage("");
	oFeedBack.hide();
}

//-----------------------------------------------------------------------------
function doUpdate()
{
	// has the user selected any forms?
	var msg="";
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
		msg=oMsgs.getPhrase("idSelectForm");
		portalWnd.cmnDlg.messageBox(msg,"ok","info",window)
		selForms.focus()
		return
	}

	// do we have a different PDL specified?
	if (selCurPDL.options[selCurPDL.selectedIndex].value == 
			selNewPDL.options[selNewPDL.selectedIndex].value)
	{
		msg=oMsgs.getPhrase("idSamePDL");
		portalWnd.cmnDlg.messageBox(msg,"ok","info",window)
		selNewPDL.focus()
		return
	}

	oFeedBack.show();
	setTimeout("frmSetPDL()", 5)
}

//-----------------------------------------------------------------------------
function frmSetPDL()
{
	// build a list of forms to update
	var strContent="<DBFILECONV oldpdl=\"" + selCurPDL.options[selCurPDL.selectedIndex].value +
		"\" newpdl=\"" + selNewPDL.options[selNewPDL.selectedIndex].value + "\" >"

	// get the DME columns node and its children
	var colNode=oFormXML.getNodeByName("COLUMNS")
	var ds=new portalWnd.DataStorage(colNode)
	strContent+=ds.getDataString(true)

	// for each selected form, get the DME record node
	var recsNode=oFormXML.document.getElementsByTagName("RECORD")
	for (var i = 0; i < selForms.options.length; i++)
	{
		if (selForms.options[i].selected)
		{
			var recNode=recsNode[i]
			var rs=new portalWnd.DataStorage(recNode)
			strContent+=rs.getDataString(true)
		}
	}
	strContent+="</DBFILECONV>"

	// call the filemgr
	var oFileMgr = portalWnd.fileMgr.dbFileConv(strContent,portalObj.path+"/content")
	if (oFileMgr==null || oFileMgr.status)
	{
		oFeedBack.hide();
		return;
	}

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
			// error in execution
			msg=portalWnd.cmnGetElementText(msgNode);
		else if (fileMsgs == "")
		{
			// no execution error, no files in error
			msg=oMsgs.getPhrase("msgSetPDLSuccess");
			icon="info";
		}
		else
			// no execution error, but files are in error
			msg=oMsgs.getPhrase("msgSetPDLError")+"\n\n"+oMsgs.getPhrase("msgFileMgrError");
		msg+=fileMsgs+"\n\n";
	}
	portalWnd.cmnDlg.messageBox(msg,"ok",icon,window)

	// all done; redo find to reload the list
	frmDoFind()
}


//-----------------------------------------------------------------------------
function doCancel()
{
	portalWnd.goHome();
}

//-----------------------------------------------------------------------------
function frmOnUnload()
{
	portalWnd.formUnload(true);
}

//-----------------------------------------------------------------------------
function frmOnResize()
{
	if (oFeedBack && typeof(oFeedBack.resize) == "function")
		oFeedBack.resize();
}

//-----------------------------------------------------------------------------
function frmOnKeyDown(evt)
{
    evt = portalWnd.getEventObject(evt)
    if (!evt) return false;

	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"formpdl");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "formpdl")
	{
		cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt)
		return false;
	}
}

//-----------------------------------------------------------------------------
function cntxtActionHandler(evt,action)
{
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"formpdl");
		if (!action || action=="formpdl")
			return false;
	}

	var bHandled=false;
	switch (action)
	{
	case "doSubmit":
        doUpdate()
		bHandled=true
		break;
	case "doCancel":
        doCancel()
		bHandled=true
		break;
	case "openNewWindow":
		portalWnd.newPortalWindow("?_URL=utility/formpdl.htm");
		bHandled=true;
		break;
	case "posInFirstField":
        posInFirstField()
		bHandled=true
		break;
	}
	return (bHandled);
}
