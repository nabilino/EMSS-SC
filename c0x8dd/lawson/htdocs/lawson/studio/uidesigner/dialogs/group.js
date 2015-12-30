/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/group.js,v 1.3.6.4.16.2 2012/08/08 12:48:50 jomeli Exp $ */
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
var oFormDef=null
var parentNode=null
var tabNode=null
var tabFldNode=null;
var origId=""
var mode=""

//-----------------------------------------------------------------------------
function grpInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	studioWnd = wndArguments[0]
	oFormDef = wndArguments[1]
	origId = wndArguments[2]
	mode = wndArguments[3]

	if (mode == "new")
	{
		parentNode=oFormDef.selectSingleNode("/form//tabregion[@id='"+origId+"']")
		origId=""
		txtTabId.value="tab"+studioWnd.designStudio.activeDesigner.source.myDoc.getUniqueID("tab","",oFormDef)
	}
	else
	{
		tabNode=oFormDef.selectSingleNode("/form//tab[@id='"+origId+"']")
		parentNode=tabNode.parentNode

		txtTabId.value=tabNode.getAttribute("id")
		if (tabNode.getAttribute("nm"))
			txtPhrase.value=tabNode.getAttribute("nm")

		tabFldNode = tabNode.selectSingleNode("./fld[@tp='Tab']");
		if (tabFldNode) 
			txtDataSrc.value = tabFldNode.getAttribute("nm");
	}

	document.body.style.visibility="visible"
	txtPhrase.focus()
	txtPhrase.select()
}

//-----------------------------------------------------------------------------
function grpOnKeyPress()
{
	var evtCaught=false;

	if (khdlOKCancel(event))
		evtCaught=true;
	else if (event.srcElement.id.substr(0,3) == "txt")
	{
		if (event.keyCode==34)	// double qoute
		{
			event.keyCode=0;
			evtCaught=true;
		}
	}

	if (evtCaught)
	{
		event.cancelBubble=true;
		event.returnValue=false;
	}
	return (evtCaught);
}

//-----------------------------------------------------------------------------
function grpOnOK()
{
	if (txtTabId.value == "")
		return;

	if ( origId != txtTabId.value )
	{
		// check for existing id
		if ( oFormDef.selectSingleNode("/form//tab[@id='"+txtTabId.value+"']") )
		{
			txtTabId.focus()
			txtTabId.select()
			var msg=pageXLT.selectSingleNode("//phrase[@id='msgIdAlreadyAssigned']").text +
				"\n" + pageXLT.selectSingleNode("//phrase[@id='msgDifferentIdReq']").text
			studioWnd.cmnDlg.messageBox(msg,"ok","info",window)
			return;
		}
	}
	if (mode == "new")
	{
		if (!tabFldNode)
		{
			tabNode=oFormDef.createNode("1","tab","");
			parentNode.appendChild(tabNode);

			// set nbr attribute for new node
			var parNbr=parentNode.getAttribute("nbr")
			var start=parentNode.childNodes.length-1
			var nbr=parNbr.replace("TR","TF")+"-"

			for (var i = start; ; i++)
			{
				nbr+=(""+i)
				if (!parentNode.selectSingleNode("./tab[@nbr='"+nbr+"']"))
					break;
			}
			tabNode.setAttribute("nbr", nbr)
		}
		else
		{
			var tabNbr = tabFldNode.getAttribute("par");
			tabNode = oFormDef.selectSingleNode("/form//tab[@nbr='" + tabNbr +"']");
			tabNode.setAttribute("tp","");
			var tabNodes = parentNode.selectNodes("child::tab");
			var lastTabNode = tabNodes[tabNodes.length -1];			
			parentNode.insertBefore(lastTabNode, tabNode);
		}
	}

	window.returnValue=txtTabId.value;
	tabNode.setAttribute("id", txtTabId.value)
	tabNode.setAttribute("nm", txtPhrase.value.length ? txtPhrase.value : txtTabId.value)
	tabNode.setAttribute("par", parentNode.getAttribute("nbr"))
	window.close()
}

//-----------------------------------------------------------------------------
function onClickDataSrc()
{
	// open data source dialog
	var curVal=""
	var tabFldNbr="";
	if (tabFldNode)
	{
		tabFldNbr=tabFldNode.getAttribute("nbr");
		curVal=tabFldNode.getAttribute("nm");
	}
	var dlgArgs = new Array();
	dlgArgs[0] = studioWnd;
	dlgArgs[1] = curVal;
	dlgArgs[2] = studioWnd.designStudio.activeDesigner.source;
 	dlgArgs[3] = tabFldNbr;
	dlgArgs[4] = parentNode;
	dlgArgs[5] = oFormDef;

	var strFeatures="dialogHeight:420px;dialogWidth:280px;" +
		"dialogTop:px;dialogLeft:px;center:yes;help:no;scroll:no;status:no;";
	var retVal = window.showModalDialog(
		studioWnd.studioPath+"/uidesigner/dialogs/datafld.htm", dlgArgs, strFeatures);

	// new data field selection?
	if (typeof(retVal) == "undefined" || retVal == curVal)
		return;

	var value=retVal;
	if (value == "")
	{
		if (tabFldNode)
			tabFldNode.setAttribute("tp","TabHidden");
	}
	else
	{
		var pos=value.indexOf("/");
		var fldnbr=retVal.substr(0,pos);
		value=retVal.substr(pos+1);
		if (value == curVal) return;

		tabFldNode=oFormDef.selectSingleNode("//*[@nbr='"+fldnbr+"']");
		if (tabFldNode)
		{
			tabFldNode.setAttribute("tp","Tab");
			if (txtDataSrc.value != "")
			{
				var oldNode = oFormDef.selectSingleNode("//fld[@tp='Tab' and @nm='"+txtDataSrc.value+"']");
				if (oldNode)
				{
					oldNode.setAttribute("tp","TabHidden");
					oFormDef.documentElement.appendChild(oldNode);
				}
			}
			txtDataSrc.value = tabFldNode.getAttribute("nm");
			
			tabNode=tabFldNode.selectSingleNode("parent::tab");
			if (!tabNode) return;

			tabNode.removeAttribute("tp");
			if (tabNode.childNodes.length)
				tabNode.insertBefore(tabFldNode,tabNode.childNodes[0]);
			else
				tabNode.appendChild(tabFldNode);

			// default the tab label?
			if (!txtPhrase.value.length)
				txtPhrase.value=tabNode.getAttribute("nm");
		}
	}
}
