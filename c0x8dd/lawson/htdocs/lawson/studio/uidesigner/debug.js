/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/debug.js,v 1.2.28.2 2012/08/08 12:48:51 jomeli Exp $ */
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

var myDoc=null;
var myDesign=null;
var myObject=null;
var myDesigner=null;
var studioWnd=null;

var docViewText=""
var htmlViewText=""
var dataViewText=""
var controlsViewText=""
var baseViewText=""

var textloc=null

//-----------------------------------------------------------------------------
function initAbout()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	myDoc = wndArguments[0]
	myDesign = wndArguments[1]
	myObject = wndArguments[2]
	myDesigner = wndArguments[3]
	studioWnd = wndArguments[4]
	loadView("doc")
}

//-----------------------------------------------------------------------------
function onTextFocus()
{
	if (textloc)
		textloc.select()
	else
	{
		textloc = textWindow.createTextRange();
		textloc.collapse()
		textloc.select()
		textloc.moveStart("textedit")
	}
}

//-----------------------------------------------------------------------------
function onTextSelect()
{
	textloc = document.selection.createRange()
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
	}
	if (bEvtCaught)
	{
		event.cancelBubble=true;
		event.returnValue=true;
	}
	return (bEvtCaught)
}

//-----------------------------------------------------------------------------
function loadView(view)
{
	document.body.style.cursor="wait"
	setTimeout("switchView('"+view+"')",10)
}

//-----------------------------------------------------------------------------
function switchView(view)
{
	var textValue=""
	cmdDoc.disabled=false
	cmdHtml.disabled=false
	cmdData.disabled=false
	cmdControls.disabled=false
	cmdBase.disabled=false

	switch(view)
	{
		case "doc":
			cmdDoc.disabled=true
			textValue=getDocViewText()
			break
		case "html":
			cmdHtml.disabled=true
			textValue=getHtmlViewText()
			break
		case "data":
			cmdData.disabled=true
			textValue=getDataViewText()
			break
		case "controls":
			cmdControls.disabled=true
			textValue=getControlsViewText()
			break
		case "base":
			cmdBase.disabled=true
			textValue=getBaseViewText()
			break
	}
	closeBtn.focus()
	textWindow.value=textValue
	document.body.style.cursor="auto"
	textloc=null
}

//-----------------------------------------------------------------------------
function getDocViewText()
{
	if (docViewText != "")
		return (docViewText);

	docViewText="Document class variables\n----------------------------------------------------------\n"
	docViewText+="docId:\t\t"+myDoc.docId+"\n"
	docViewText+="docName:\t"+myDoc.docName+"\n"
	docViewText+="docPath:\t"+myDoc.docPath+"\n"
	docViewText+="provId:\t\t"+myDoc.provId+"\n"
	docViewText+="dataId:\t\t"+myDoc.params.getItem("pdl").value+"\n"
	docViewText+="sysId:\t\t"+myDoc.params.getItem("sys").value+"\n"
	docViewText+="tknId:\t\t"+myDoc.params.getItem("tkn").value+"\n"
	docViewText+="custId:\t\t"+myDoc.params.getItem("id").value+"\n"
	docViewText+="dirty:\t\t"+myDoc.dirty+"\n"
	docViewText+="maxDtlHeight:\t"+myDoc.maxDtlHeight+"\n"
	docViewText+="maxDtlRows:\t"+myDoc.maxDtlRows+"\n"
	docViewText+="dtlCols:\t"+myDoc.dtlCols+"\n"
	docViewText+="lastControl:\t"+myDoc.lastControl+"\n"
	docViewText+="lastControlId:\t"+myDoc.lastControlId+"\n"
	docViewText+="\n\nObject class variables\n----------------------------------------------------------\n"
	docViewText+="baseElement:\t"+myObject.baseElement+"\n"
	docViewText+="targetElement:\t"+myObject.targetElement+"\n"
	docViewText+="objLevel:\t"+myObject.objLevel+"\n"
	return (docViewText);
}

//-----------------------------------------------------------------------------
function getHtmlViewText()
{
	if (htmlViewText != "")
		return (htmlViewText);

	htmlViewText="----------------------------------------------------------\n"
	htmlViewText+="Design View HTML\n----------------------------------------------------------\n"
	htmlViewText+=myDesign.editor.cwDoc.body.outerHTML.replace( /\>\</g, ">\n<" )
	htmlViewText+="\n\n----------------------------------------------------------\n"
	htmlViewText+="Object View HTML\n----------------------------------------------------------\n"
	htmlViewText+=myObject.editor.cwDoc.body.outerHTML.replace( /\>\</g, ">\n<" )
	return (htmlViewText);
}

//-----------------------------------------------------------------------------
function getDataViewText()
{
	if (dataViewText != "")
		return (dataViewText);

	dataViewText="Hidden Data DOM\n------------------------------------------------------------\n"
	try {
		if (myDoc.dsm.hiddenXML)
		{
			var root = myDoc.dsm.hiddenXML.documentElement;
			var len = root.childNodes.length
			for (var i = 0; i < len; i++)
			{
				dataViewText+=("  "+root.childNodes[i].getAttribute("nbr")+"\t"+
						root.childNodes[i].getAttribute("nm")+"\n")
			}
		}
		
	} catch (e) { }

	dataViewText+="\nDetail Data DOM\n------------------------------------------------------------\n"
	try {
		if (myDoc.dsm.detailXML)
		{
			var root = myDoc.dsm.detailXML.documentElement;
			var len = root.childNodes.length
			for (var i = 0; i < len; i++)
			{
				dataViewText+=("  "+root.childNodes[i].getAttribute("nbr")+"\t"+
						root.childNodes[i].getAttribute("nm")+"\n")
			}
		}
		
	} catch (e) { }

	dataViewText+="\nPushes Data DOM\n------------------------------------------------------------\n"
	try {
		if (myDoc.dsm.pushXML)
		{
			var root = myDoc.dsm.pushXML.documentElement;
			var len = root.childNodes.length
			for (var i = 0; i < len; i++)
			{
				dataViewText+=("  "+root.childNodes[i].getAttribute("nbr")+"\t"+
						root.childNodes[i].getAttribute("nm")+"\n")
			}
		}
		
	} catch (e) { }

	return (dataViewText);
}

//-----------------------------------------------------------------------------
function getControlsViewText()
{
	if (controlsViewText != "")
		return (controlsViewText);

	var len=myDoc.controls.count
	for (var i = 0; i < len; i++)
	{
		var ctl = myDoc.controls.item(i);
		controlsViewText+="--------------------------------------------------------------------------------\n"
		controlsViewText+=(ctl.id+" "+(ctl.deleted ? "deleted" : "active")+"\n")
		controlsViewText+="  "
		var len2 = ctl.propertyBag.elements.length;
		for(var j=0; j < len2; j++)
		{
			var prop=ctl.propertyBag.elements.children(j)
			if (prop.name != "id")
				controlsViewText+=(prop.name+"="+prop.value+" ")
		}
		controlsViewText+="\n"
	}
	return (controlsViewText);
}

//-----------------------------------------------------------------------------
function getBaseViewText()
{
	try {
		if (baseViewText != "")
			return (baseViewText);
		baseViewText=myDoc.origDoc.xml.replace( /\>\</g, ">\n<" )
		var xmlDom=myDesigner.source.uiCreateDOMFromString(baseViewText)
		baseViewText=xmlDom.xml
		
	} catch (e) { }
	return (baseViewText);
}
