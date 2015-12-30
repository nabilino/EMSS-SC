/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/propstext.js,v 1.2.6.6.16.3 2012/08/08 12:48:49 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// propstext.js
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
tabArray[0] = "tabGeneral"
tabArray[1] = "tabEdits"
var maxTabIndex=1
var ppgActiveTab=null

var studioWnd=null
var sourceWnd=null
var oFormDef=null
var mFormElem=null
var ctlNode=null
var ctlOrigNode=null
var propBag=null
var tool=null
var origId=""
var bModified=false;
var bHasKeyNbr=false;
var edAttr="";
var radioBtn=null;

//-----------------------------------------------------------------------------
function txtInit()
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
	propBag = wndArguments[1]
	sourceWnd = wndArguments[2]

	// make a local copy of the UI xml
	oFormDef=studioWnd.xmlFactory.createInstance("DOM");
	oFormDef.async=false;
	oFormDef.loadXML(sourceWnd.myDoc.xmlDoc.xml);

	mFormElem=wndArguments[3];
	origId=mFormElem.getAttribute("id");
	ctlNode=oFormDef.selectSingleNode("/form//fld[@id='"+origId+"']");
	var fnbr = ctlNode.getAttribute("nbr");
	if (fnbr)
		ctlOrigNode=sourceWnd.myDoc.origDoc.selectSingleNode("/form//fld[@nbr='"+fnbr+"']");

	// set the active tab
	ppgActiveTab = tabGeneral

	// initialize values
	bHasKeyNbr=txtHasKeyNbr()
	cbxIsOutput.checked = (ctlNode.getAttribute("tp") == "Out" ? true : false);

	// enable edit tab? only if not data bound
	if (txtIsDataBound())
	{
		tabEdits.style.visibility="hidden";
		maxTabIndex=0;
	}
	else
	{
		edAttr=ctlNode.getAttribute("ed");
		radioBtn = document.getElementById("rb"+edAttr)
		if (!radioBtn)
			radioBtn=rbNone;
		radioBtn.checked=true;
		if (edAttr != "numeric" && edAttr != "signed")
		{
			lblDecsz.disabled=true;
			txtDecsz.disabled=true;
		}
		var decsz=ctlNode.getAttribute("decsz");
		if (decsz)
			txtDecsz.value=decsz;
	}

	txtTextId.innerText=origId
	txtTextId2.innerText=origId
	if (bHasKeyNbr)
	{
		cbxIsSelect.checked = ctlNode.getAttribute("hsel")=="1" ? true : false;
		cbxAllowDrill.checked = ctlNode.getAttribute("hdet")=="1" ? true : false;
		cbxHasRule.checked = ctlNode.getAttribute("hselrul")=="1" ? true : false;
		cbxHasDefine.checked = ctlNode.getAttribute("deftkn") ? true : false;
		txtDefineURI.disabled = cbxHasDefine.checked ? false : true;
		txtDefineURI.value = (ctlNode.getAttribute("deftkn"))
				? ctlNode.getAttribute("deftkn")
				: "";
		lblURI.disabled = cbxHasDefine.checked ? false : true;
	}
	else
	{
		cbxIsSelect.disabled = true;
		cbxAllowDrill.disabled = true;
		cbxHasRule.disabled = true;
		cbxHasDefine.disabled = true;
		txtDefineURI.disabled = true;
		lblURI.disabled = true;
	}

	// show the document
	document.body.style.visibility="visible"
	document.body.style.cursor="auto"
	cbxIsOutput.focus()
}

//-----------------------------------------------------------------------------
function txtIsDataBound()
{
	var dField=ctlNode.getAttribute("nm")
	return (!dField ? false : true);
}

//-----------------------------------------------------------------------------
function txtHasKeyNbr()
{
	var dField=ctlNode.getAttribute("nm")
	if (!dField) return (false);
		
	return ( ctlNode.getAttribute("keynbr") != "" ? true : false );
}

//-----------------------------------------------------------------------------
function txtOnKeyDown()
{
	var bEvtCaught=false;
	switch(event.keyCode)
	{
	case studioWnd.keys.ESCAPE:
		var mElement=event.srcElement
		bEvtCaught=true
		window.close()
		break;
	case studioWnd.keys.ENTER:
		break;
	case studioWnd.keys.PAGE_UP:		// previous tab
		if( !event.altKey && event.ctrlKey && !event.shiftKey )
		{
			txtActivateTab(-1)
			bEvtCaught=true
		}
		break;
	case studioWnd.keys.PAGE_DOWN:		// next tab
		if( !event.altKey && event.ctrlKey && !event.shiftKey )
		{
			txtActivateTab(1)
			bEvtCaught=true
		}
		break;
	}

	if (bEvtCaught)
		studioWnd.setEventCancel(event)
	return (!bEvtCaught)
}

//-----------------------------------------------------------------------------
function decszOnKeyDown()
{
	if (event.keyCode == 8 		// backspace
	|| event.keyCode == 9 		// tab
	|| event.keyCode == 27)		// esc
		return;
	if ( (event.keyCode > 47 && event.keyCode < 58)		// 0-9
	|| (event.keyCode > 95 && event.keyCode < 106) )	// 0-9 on keypad
		return;
	studioWnd.setEventCancel(event);
}

//-----------------------------------------------------------------------------
function txtActivateTab(inc)
{
	var curIndex = parseInt(ppgActiveTab.tabind)
	var tabIndex = curIndex + inc

	if(tabIndex < 0)
		tabIndex = 0
	else if (tabIndex > maxTabIndex)
		tabIndex = maxTabIndex

	if (curIndex != tabIndex)
	{
		var obj = document.getElementById(tabArray[tabIndex])
		obj.fireEvent("onclick")
	}
}

//-----------------------------------------------------------------------------
function txtSwitchTab(objTab)
{
	if(objTab.id == ppgActiveTab.id) return;

	// make the previously active tab inactive
	ppgActiveTab.className = "dsTabButtonInactive"
	document.all["div" + ppgActiveTab.id.substr(3)].style.display = "none"

	objTab.className = "dsTabButtonActive"
	switch(objTab.id)
	{
		case "tabGeneral":
			divGeneral.style.display = "block"
			cbxIsOutput.focus()
			break;
		case "tabEdits":
			divEdits.style.display = "block"
			radioBtn.focus()
			break;
	}

	// Make this tab as active tab
	ppgActiveTab = objTab
}

//-----------------------------------------------------------------------------
function txtOnClickDefine()
{
	ppgEnableApply(true)

	var bDisabled = (cbxHasDefine.checked) ? false : true;
	txtDefineURI.disabled = bDisabled;
	if (!bDisabled && !txtDefineURI.value
	 && ctlOrigNode && ctlOrigNode.getAttribute("deftkn"))
		txtDefineURI.value = ctlOrigNode.getAttribute("deftkn");
	lblURI.disabled = bDisabled;
}

//-----------------------------------------------------------------------------
function txtOnClickOutput()
{
	ppgEnableApply(true);

	var bDisabled = false;
	if (cbxIsOutput.checked || !txtHasKeyNbr())
	{
		bDisabled = true;
		cbxIsSelect.checked = false;
		cbxAllowDrill.checked = false;
		cbxHasRule.checked = false;
		cbxHasDefine.checked = false;
		txtDefineURI.disabled = true;
		lblURI.disabled = true;
	}
	else
	{
		cbxIsSelect.checked = ctlNode.getAttribute("hsel")=="1" ? true : false;
		cbxAllowDrill.checked = ctlNode.getAttribute("hdet")=="1" ? true : false;
		cbxHasRule.checked = ctlNode.getAttribute("hselrul")=="1" ? true : false;
		cbxHasDefine.checked = ctlNode.getAttribute("deftkn") ? true : false;
		txtDefineURI.disabled = cbxHasDefine.checked ? false : true;
		lblURI.disabled = cbxHasDefine.checked ? false : true;
	}

	cbxIsSelect.disabled = bDisabled;
	cbxAllowDrill.disabled = bDisabled;
	cbxHasRule.disabled = bDisabled;
	cbxHasDefine.disabled = bDisabled;
}

//-----------------------------------------------------------------------------
function txtRadioClick()
{
	ppgEnableApply(true);

	lblDecsz.disabled=true;
	txtDecsz.disabled=true;

	// edits tab active only for non-databound fields
	if (rbNone.checked)
	{
		radioBtn=rbNone;
		ctlNode.removeAttribute("ed");
		ctlNode.removeAttribute("decsz");
	}
	else if (rbdate.checked)
	{
		radioBtn=rbdate;
		ctlNode.setAttribute("ed","date");
		ctlNode.setAttribute("sz","6");
	}
	else if (rbtime.checked)
	{
		radioBtn=rbtime;
		ctlNode.setAttribute("ed","time");
		ctlNode.setAttribute("sz","4");
	}
	else if (rbupper.checked)
	{
		radioBtn=rbupper;
		ctlNode.setAttribute("ed","upper");
	}
	else if (rbnumeric.checked)
	{
		radioBtn=rbnumeric;
		ctlNode.setAttribute("ed","numeric");
		lblDecsz.disabled=false;
		txtDecsz.disabled=false;
	}
	else if (rbsigned.checked)
	{
		radioBtn=rbsigned;
		ctlNode.setAttribute("ed","signed");
		lblDecsz.disabled=false;
		txtDecsz.disabled=false;
	}
}

//-----------------------------------------------------------------------------
function ppgEnableApply(bEnable)
{
	if (typeof(bEnable) != "boolean")
		bEnable=true;
	btnApply.disabled=!bEnable
}

//-----------------------------------------------------------------------------
function txtReturn()
{
	window.returnValue=bModified
	window.close()
}

//-----------------------------------------------------------------------------
function txtOK()
{
	if (!btnApply.disabled)
	{
		if (!txtUpdate()) return;
	}
	txtReturn()
}

//-----------------------------------------------------------------------------
function txtUpdate()
{
	if (cbxHasDefine.checked && txtDefineURI.value=="")
	{
		var msg=pageXLT.selectSingleNode("//phrase[@id='msgRequiredValue']").text
		studioWnd.cmnDlg.messageBox(msg,"ok","info",window)
		return false;
	}

	ppgEnableApply(false)
	btnCancel.focus()

	// apply xml to parent window's xml
	if ( !oFormDef ) return (false);

	var tp=cbxIsOutput.checked ? "Out" : "Text";
	ctlNode.setAttribute("tp",tp);
	var ctlInst=sourceWnd.myDoc.getControlInstance(ctlNode.getAttribute("id"));	
	ctlInst.setRule("nodeTp",tp);

	if (bHasKeyNbr)
	{
		ctlNode.setAttribute("hsel", (cbxIsSelect.checked ? "1" : "0") )
		ctlNode.setAttribute("hdet", (cbxAllowDrill.checked ? "1" : "0") )
		ctlNode.setAttribute("hselrul", (cbxHasRule.checked ? "1" : "0") )
		if (cbxHasDefine.checked)
			ctlNode.setAttribute("deftkn",txtDefineURI.value)
		else
			ctlNode.removeAttribute("deftkn");
	}

	// need to update decsz for non-databound controls
	if (!txtIsDataBound())
	{
		ctlNode.removeAttribute("decsz");
		if ((radioBtn.id == "rbsigned" || radioBtn.id == "rbnumeric")
		&& (txtDecsz.value != ""))
		{
			var decsz=parseInt(txtDecsz.value,10);
			if (decsz != 0)
				ctlNode.setAttribute("decsz",txtDecsz.value);
			var size=parseInt(ctlNode.getAttribute("sz"),10);
			if (size <= decsz)
				ctlNode.setAttribute("sz",""+(decsz+2));
		}
	}

	// apply the form XML
	sourceWnd.myDoc.xmlDoc.loadXML(oFormDef.xml)
	sourceWnd.myDoc.setModifiedFlag(true,false)
	bModified=true;
	return (true);
}
