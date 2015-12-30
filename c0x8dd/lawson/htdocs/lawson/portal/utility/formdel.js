/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/utility/formdel.js,v 1.25.2.5.4.13.14.2.2.3 2012/08/08 12:37:22 jomeli Exp $ */
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

var portalObj=null;
var portalWnd=null;
var oFormXML=null
var oFeedBack=null;

var contentDir=""

var selPDL=null;
var selForms=null;
var strFileRow="fileRow"
var strDir="";
var strTKN="";
var strId="";
var strFileName="";

//-----------------------------------------------------------------------------
function frmInit()
{
	portalWnd=envFindObjectWindow("lawsonPortal");
	portalObj=portalWnd.lawsonPortal;
	oMsgs=new portalWnd.phraseObj("utility");

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	var title=oMsgs.getPhrase("lblTitleDelete");
	portalObj.setMessage(portalObj.getPhrase("LBL_LOADING")+" "+title)

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
		createButton(oMsgs.getPhrase("btnDelete"), frmDoDelete, "delete", "disabled","","del");
		createButton(portalObj.getPhrase("LBL_HOME"), frmDoCancel, "cancel","","","home");
	}
	oFeedBack = new FeedBack(window,portalWnd);

	// set labels on screen
	document.getElementById("lblPDL").innerHTML=oMsgs.getPhrase("lblPDL")
	document.getElementById("lblFormFilter").innerHTML=oMsgs.getPhrase("lblFormFilter")
	document.getElementById("lblSelectForm").innerHTML=oMsgs.getPhrase("lblSelectForm")
	document.getElementById("btnFind").value=oMsgs.getPhrase("btnFind")

	contentDir=portalObj.path+"/content"
	selPDL=document.getElementById("selPDL")
	selForms=document.getElementById("selForms")

	frmLoadPDLs()

	document.body.style.visibility="visible"
	document.body.style.cursor="auto"

	if (selPDL.options.length < 1)
	{
		portalObj.toolbar.changeButtonState("delete","disabled");
		document.getElementById("btnFind").disabled=true
	}

	posInFirstField();
	portalObj.setMessage("")
}

//-----------------------------------------------------------------------------
function posInFirstField()
{
	if (selPDL.options.length < 1)
		portalWnd.frmPositionInToolbar()
	else
		selPDL.focus()
}

//-----------------------------------------------------------------------------
function frmLoadPDLs()
{
	// load the PDL dropdown:
	// choices come from the XML index file (which may contains 'invalid' productlines)
	var strQuery = "?_PDL=LOGAN&_TKN=RD69.2&FC=I&_EVT=ADD&_OUT=XML&_LFN=TRUE";

	var oResponse = portalWnd.httpRequest(portalWnd.AGSPath+strQuery,null,"","",false)
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

	var defPDL=portalWnd.oUserProfile.getAttribute("productline");
	var nIndex=0;		// required for NS
	var nFNbr=1;
	var selIndex = -1;
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
				var oOption = document.createElement("option");
				selPDL.options.add(oOption);
				oOption.text = pdlText;
				oOption.value = pdlText;
				if (pdlNode.text == defPDL)
					selIndex=selPDL.options.length-1;
			}
			else
			{
				selPDL.options[nIndex] = new Option(pdlText, pdlText);
				if (pdlText == defPDL)
					selIndex=selPDL.options.length-1;
				nIndex++;
			}
		}
		nFNbr++;
		pdlNode = ds.getNodeByName(strNodeNamePre+(nFNbr))
	}

	if (selPDL.options.length > 0)
		selPDL.selectedIndex = (selIndex == -1 ? 0 : selIndex);
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
// find forms in repository for delete
function frmDoFind()
{
	// let's protect ourselves!
	portalObj.toolbar.changeButtonState("delete","disabled");
	if (selPDL.options.length < 1)
	{
		portalObj.setMessage("")
		oFeedBack.hide();
		return
	}
	if (selPDL.selectedIndex < 0)
	{
		portalObj.setMessage("")
		oFeedBack.hide();
		return
	}
	
	var api="?PROD=LOGAN&FILE=SIRDXMIDX&INDEX=XMLSET3&KEY=" + 
				selPDL.options[selPDL.selectedIndex].value
	if (document.getElementById("txtForm").value!="")
		api+=("&SELECT=TOKEN~"+document.getElementById("txtForm").value.toUpperCase())
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
		if (portalObj.browser.isIE)
		{
			var oChild=selForms.children(i-1)
			selForms.removeChild(oChild)
		}
		else
		{
			var oChild=selForms.childNodes[i-1]
			selForms.removeChild(oChild)
		}
	}

	// any hits on find?
	var rcdsNode=oFormXML.getNodeByName("RECORDS")
	if ( rcdsNode && rcdsNode.getAttribute("count") == "0" )
	{
		portalObj.setMessage("")
		oFeedBack.hide();
		var msg=oMsgs.getPhrase("idNoFormsFound");
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

	str=str.replace(/\x0A/gm, "");
	str=str.replace(/\n/gm, "");

	var options=new Array()
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
			oOption.value=portalWnd.trim(values[2])
		}
		else
		{
			oOption.appendChild(document.createTextNode(strText))
			oOption.value = portalWnd.trim(values[2])
			selForms.appendChild(oOption)
		}
	}
	if (selForms.options.length > 0)
		portalObj.toolbar.changeButtonState("delete","enabled");
	selForms.selectedIndex=0
	portalObj.setMessage("")
	oFeedBack.hide();
}

//-----------------------------------------------------------------------------
function frmDoDelete()
{
	var idx=selForms.selectedIndex
	if ( idx < 0 ) return

	var msg=oMsgs.getPhrase("idOKDelete")
	strFileName=selForms.options[idx].value

	var recs = oFormXML.document.getElementsByTagName("COLS")
	if (recs.length < 1) return;
	var cols = recs[idx].getElementsByTagName("COL");
	strTKN=getColValue(cols[0])
	strId=getColValue(cols[3])
	strDir=getColValue(cols[5])
	// strip trailing slash?
	if (strDir.lastIndexOf("/") == (strDir.length-1))
		strDir=strDir.substr(0, strDir.length-1)
	msg += ( " '" + strTKN + " " + strId + " " + 
		contentDir + "/" + strDir + "/" + strFileName + "'?")

	if ( ! window.confirm(msg) ) return;

	oFeedBack.show();
	setTimeout("frmPerformDelete()", 5)
}

//-----------------------------------------------------------------------------
function frmPerformDelete()
{
	try	{
		var oDelXML = portalWnd.fileMgr.remove(contentDir+"/"+strDir, strFileName, 
				strTKN, selPDL.options[selPDL.selectedIndex].value, strId, true)
		if (!oDelXML || oDelXML.status) return;

		// file deleted
		var msg=oDelXML.getElementsByTagName("MSG");
		msg = (msg && msg.length > 0 ? msg : oDelXML.getElementsByTagName("MESSAGE"));
		msg = (msg && msg.length > 0 ? msg[0] : null);
		if (msg)
			portalWnd.cmnDlg.messageBox(msg.text,"ok","info",window);
		frmDoFind()

	} catch(e) {
		oFeedBack.hide();
		var msg=oMsgs.getPhrase("idErrorDeleting") + " " + strFileName + ":\n"+e.description;
		portalWnd.cmnDlg.messageBox(msg,"ok","info",window);
	}
}

//-----------------------------------------------------------------------------
function getColValue(colNode)
{
	var text = "";
	for (var x=0; x < colNode.childNodes.length; x++)
	{
		if (colNode.childNodes[x].nodeType == 4)
		{
			var text=colNode.childNodes[x].nodeValue;
			break;
		}
	}
	return text;
}

//-----------------------------------------------------------------------------
function frmDoCancel()
{
	portalWnd.goHome()
}
//-----------------------------------------------------------------------------
function frmOnUnload()
{
	portalWnd.formUnload(true)
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
    if (!evt) return;

	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"formdel");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return;
	}

	// hotkey defined for this keystroke
	if (action != "formdel")
	{
		cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt)
		return;
	}
}

//-----------------------------------------------------------------------------
function cntxtActionHandler(evt,action)
{
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"formdel");
		if (!action || action=="formdel")
			return false;
	}

	var bHandled=false;
	switch (action)
	{
	case "doSubmit":
        frmDoDelete()
		bHandled=true
		break;
	case "doCancel":
        frmDoCancel()
		bHandled=true
		break;
	case "openNewWindow":
		portalWnd.newPortalWindow("?_URL=utility/formdel.htm");
		bHandled=true;
		break;
	case "posInFirstField":
        posInFirstField();
		bHandled=true
		break;
	}
	return (bHandled);
}
