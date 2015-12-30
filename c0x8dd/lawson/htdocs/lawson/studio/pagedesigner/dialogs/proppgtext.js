/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/pagedesigner/dialogs/proppgtext.js,v 1.2.28.2 2012/08/08 12:48:48 jomeli Exp $ */
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
var parentWnd=null;
var src=null;
var ds = null;
var designer = null;
var doc = null;
var objText=null;
var objOrigText = null;

function ppgInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	parentWnd = wndArguments[0];
	src = wndArguments[2];
	ds = parentWnd.designStudio;
	designer = ds.activeDesigner;
	doc = designer.activeDocument;

	objOrigText = doc.activeControl;
	ppgLoadData();

	document.body.style.visibility="visible";
	document.body.style.cursor="auto";
	text.focus();
}

function ppgLoadData()
{
	objText = new Object();
	objText.id = objOrigText.id;
	objText.content = new Object();
	objText.content.style = new Object();

	var orig = objOrigText.getObject("textcontent");
	if(orig.state != "uninitialized")
	{
		objText.content.text = orig.content.text;
		objText.content.style.bold = orig.content.style.bold;
		objText.content.style.italic = orig.content.style.italic;
		objText.content.style.underline = orig.content.style.underline;
		objText.content.style.align = orig.content.style.align;
		objText.content.style.bgcolor = orig.content.style.bgcolor;
		objText.content.style.color = orig.content.style.color;
		objText.content.style.font = orig.content.style.font;
		objText.content.style.size = orig.content.style.size;
		ppgShowFontSelection();
	}
	else
	{
		objText.content.text = "";
		objText.content.style.bold = "normal";
		objText.content.style.italic = "normal";
		objText.content.style.underline = "none";
		objText.content.style.align = "left";
		objText.content.style.bgcolor = "FFFFFF";
		objText.content.style.color = "000000";
		objText.content.style.font = "tahoma";
		objText.content.style.size = "8pt";
	}
	text.value = objText.content.text;
	ppgSetStyle();
}

function ppgSetStyle()
{
	if(objText.content != "")
	{
		text.style.fontWeight = objText.content.style.bold;
		text.style.fontStyle = objText.content.style.italic;
		text.style.textDecoration = objText.content.style.underline;
		text.style.textAlign = objText.content.style.align;
		text.style.backgroundColor = objText.content.style.bgcolor;
		text.style.color = objText.content.style.color;
		text.style.fontFamily = objText.content.style.font;
		text.style.fontSize = objText.content.style.size;
	}
}

function ppgShowFontSelection()
{
	var i, len;
	len = font.options.length;
	for(i=0; i < len; i++)
	{
		if(font.options[i].value == objText.content.style.font)
		{
			font.selectedIndex = i;
			break;
		}
	}
	len = size.options.length;
	for(i=0; i < len; i++)
	{
		if(size.options[i].value == objText.content.style.size)
		{
			size.selectedIndex = i;
			break;
		}
	}
}

function ppgFormat(obj)
{
	text.focus();
	switch (obj.id)
	{
		case "bold":
			objText.content.style.bold = (objText.content.style.bold == "bold") ? "normal" : "bold";
			text.style.fontWeight = objText.content.style.bold;
			break;
		case "italic":
			objText.content.style.italic = (objText.content.style.italic == "italic") ? "normal" : "italic";
			text.style.fontStyle = objText.content.style.italic;
			break;
		case "underline":
			objText.content.style.underline = (objText.content.style.underline == "underline") ? "none" : "underline";
			text.style.textDecoration = objText.content.style.underline;
			break;
		case "alignleft":
		case "aligncenter":
		case "alignright":
			objText.content.style.align = obj.id.substr(5);
			text.style.textAlign = objText.content.style.align;
			break;
		case "bgcolor":
			var cpRtn = parentWnd.cmnDlg.colorPicker(objText.content.style.bgcolor, window);
			if(cpRtn)
			{
				objText.content.style.bgcolor = cpRtn;
				text.style.backgroundColor = objText.content.style.bgcolor;
			}
			break;
		case "color":
			var cpRtn2 = parentWnd.cmnDlg.colorPicker(objText.content.style.color, window);
			if(cpRtn2)
			{
				objText.content.style.color = cpRtn2;
				text.style.color = objText.content.style.color;
			}
			break;
		case "font":
			objText.content.style.font = obj.options[obj.selectedIndex].value;
			text.style.fontFamily = objText.content.style.font;
			break;
		case "size":
			objText.content.style.size = obj.options[obj.selectedIndex].value;
			text.style.fontSize = objText.content.style.size;
			break;
	}
	btnApply.disabled = false;
}

function ppgMouseover(objImg)
{
	var btn=window.event.srcElement
	btn.className="dsViewButtonHover"

}

function ppgMouseout(objImg)
{
	var btn=window.event.srcElement
	btn.className="dsViewButton"
}

function ppgUpdate()
{
	objText.content.text = text.value;
	var orig = objOrigText.getObject("textcontent");
	if(orig.state == "uninitialized")
	{
		orig.content = new Object();
		orig.content.style = new Object();
	}
	orig.content.text = objText.content.text;
	orig.content.style.bold = objText.content.style.bold;
	orig.content.style.italic = objText.content.style.italic;
	orig.content.style.underline = objText.content.style.underline;
	orig.content.style.align = objText.content.style.align;
	orig.content.style.bgcolor = objText.content.style.bgcolor;
	orig.content.style.color = objText.content.style.color;
	orig.content.style.font = objText.content.style.font;
	orig.content.style.size = objText.content.style.size;
	orig.state = "initialized";

	var textNode = doc.pageXML.selectSingleNode("//TEXT[@id='" + objText.id + "']");
	var newNode = doc.pageXML.createElement("textarea");
	newNode.appendChild(doc.pageXML.createCDATASection(objText.content.text));
	newNode.setAttribute("fontfamily",  orig.content.style.font);
	newNode.setAttribute("fontsize",  orig.content.style.size);
	newNode.setAttribute("bold",  orig.content.style.bold);
	newNode.setAttribute("ital",  orig.content.style.italic);
	newNode.setAttribute("uline",  orig.content.style.underline);
	newNode.setAttribute("align",  orig.content.style.align);
	newNode.setAttribute("bgcolor",  orig.content.style.bgcolor);
	newNode.setAttribute("color",  orig.content.style.color);

	var oldNode = textNode.selectSingleNode("./textarea");
	if(oldNode)
		textNode.replaceChild(newNode, oldNode);
	else
		textNode.appendChild(newNode);
	btnApply.disabled = true;
	window.returnValue = "changed";
}

function ppgOK()
{
	if(!btnApply.disabled)ppgUpdate();
	window.close();
}

function ppgOnKeyDown()
{
	var bEvtCaught=false;
	switch(event.keyCode)
	{
		case parentWnd.keys.ESCAPE:
			bEvtCaught=true
			window.close()
			break;
	}
	if(event.srcElement.id == "text")
	{
		if(event.keyCode != parentWnd.keys.TAB)
			btnApply.disabled = false;
	}
	if (bEvtCaught)
		parentWnd.setEventCancel(event)
	return (!bEvtCaught)
}
