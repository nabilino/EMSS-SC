/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/wzdesigner/debug.js,v 1.2.28.2 2012/08/08 12:48:49 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// debug.js
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
var myDesign=null;
var myDesigner=null;
var myDoc=null;
var myObject=null;

var baseFormText="";
var studioWnd=null;
var textloc=null; // text range

//-----------------------------------------------------------------------------
function dbgInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	myDoc = wndArguments[0];
	myDesign = wndArguments[1];
	myDesigner = wndArguments[2];
	studioWnd = wndArguments[3];
	dbgLoadView("WizardXML");
}

//-----------------------------------------------------------------------------
function dbgClose()
{
	window.close();
}

//-----------------------------------------------------------------------------
function dbgLoadView(view)
{
	setTimeout("dbgSwitchView('"+view+"')",10);
}

//-----------------------------------------------------------------------------
function dbgOnKeyDown()
{
	var bEvtCaught=false;
	switch(event.keyCode)
	{
	case studioWnd.keys.ESCAPE:
		bEvtCaught=true;
		window.close();
		break;
	}
	if (bEvtCaught)
	{
		event.cancelBubble=true;
		event.returnValue=true;
	}
	return (bEvtCaught);
}

//-----------------------------------------------------------------------------
function dbgSwitchView(view)
{
	cmdWizard.disabled=false;
	cmdForm.disabled=false;
	cmdHtml.disabled=false;

	var textValue="";
	switch(view)
	{
		case "WizardXML":
			cmdWizard.disabled=true;
			textValue=getWizardViewText();
			break
		case "FormXML":
			cmdForm.disabled=true;
			textValue=getFormText();
			break
		case "HTML":
			cmdHtml.disabled=true;
			textValue=getHtmlViewText();
			break
	}
	closeBtn.focus();
	textWindow.value=textValue;
	textloc=null;
}

//-----------------------------------------------------------------------------
function dbgTextFocus()
{
	if (textloc)
		textloc.select();
	else
	{
		textloc = textWindow.createTextRange();
		textloc.collapse();
		textloc.select();
		textloc.moveStart("textedit");
	}
}

//-----------------------------------------------------------------------------
function getCleanXML(xml)
{
	var cleanXML=xml.replace( /\>\</g, ">\n<" );
	cleanXML=myDesigner.source.wzCreateDOMFromString(cleanXML).xml;
	return (cleanXML);
}

//-----------------------------------------------------------------------------
function getFormText()
{
	// remember this - will not change
	if (baseFormText != "")
		return (baseFormText);
	baseFormText=getCleanXML(myDoc.xmlFormDoc.xml);
	return (baseFormText);
}

//-----------------------------------------------------------------------------
function getHtmlViewText()
{
	return (myDesign.editor.cwDoc.body.outerHTML.replace( /\>\</g, ">\n<" ));
}

//-----------------------------------------------------------------------------
function getWizardViewText()
{
	return (getCleanXML(myDoc.xmlDoc.xml));
}

