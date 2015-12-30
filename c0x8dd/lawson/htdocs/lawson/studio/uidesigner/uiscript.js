/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/uiscript.js,v 1.1.4.2.4.2.12.1.8.2 2012/08/08 12:48:51 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// uiscript.js
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
// ScriptView -----------------------------------------------------------------
//-----------------------------------------------------------------------------

ScriptView.prototype = new parent.View();
ScriptView.prototype.constructor = ScriptView;
ScriptView.superclass = parent.View.prototype;
function ScriptView()
{
	// call ancestor initialize method
	ScriptView.superclass.initialize.call(this, "script", 
		top.document.getElementById("view_script"), 
		top.document.getElementById("btn_script"));

	this.script="";
	this.modified=false;
	this.textloc=null;
	this.widgtXML=null;
	this.funcXML=null;
	this.funcXSL=null;
	this.fieldXML=null;
	this.fieldXSL=null;
	this.sortBy="id";
	this.sortAsc=true;

	// load script elements XSL
	var path=top.studioPath+"/uidesigner/scriptelem.xsl"
	this.fieldXSL=top.xmlFactory.createInstance("DOM");
	this.fieldXSL.async=false;
	this.fieldXSL.load(path);
	if (this.fieldXSL.parseError.errorCode != 0)
		top.displayDOMError(this.fieldXSL.parseError,path)

	// load functions XML
	path=top.studioPath+"/uidesigner/functions.xml"
	this.funcXML=top.xmlFactory.createInstance("DOM");
	this.funcXML.async=false;
	this.funcXML.load(path);
	if (this.funcXML.parseError.errorCode != 0)
		top.displayDOMError(this.funcXML.parseError,path)

	// load functions XSL
	path=top.studioPath+"/uidesigner/functions.xsl"
	this.funcXSL=top.xmlFactory.createInstance("DOM");
	this.funcXSL.async=false;
	this.funcXSL.load(path);
	if (this.funcXSL.parseError.errorCode != 0)
		top.displayDOMError(this.funcXSL.parseError,path)

	// initialize the editor
	this.editor=top.designStudio.activeDesigner.workSpace.editors.item(this.id);
	this.editor.registerTextArea("textBody");

	// hook up the input event handlers
	var sel=this.editor.cwDoc.getElementById("selObjects")
	sel.onchange=myDesigner.source.uiOnSelectChange
	sel=this.editor.cwDoc.getElementById("selEvents")
	sel.onchange=myDesigner.source.uiOnSelectChange
	sel=this.editor.cwDoc.getElementById("selWidgets")
	sel.onchange=myDesigner.source.uiOnSelectChange

	// load the widgets select options (form should be first)
	var oOption = document.createElement("option")
	oOption.text = "Form"
	oOption.value = "form"
	sel.add(oOption)

	var toolbox=myDesigner.toolBox
	for ( var i = 0; i < toolbox.controlGroups.count; i++)
	{
		var ctlGrp = toolbox.controlGroups.item(i);
		for (var j = 0; j < ctlGrp.controls.count; j++)
		{
			var control = ctlGrp.controls.item(j);
			// skip the form control (we've already added it above)
			if (control.id == "form")
				continue;
 			if (control.events.count > 0)
 			{
 		 		var oOption = document.createElement("option")
 		 		oOption.text = control.name
 		 		oOption.value = control.id
 				sel.add(oOption)
 			}
		}
	}
  	sel.selectedIndex=-1

	// default to functions radion button
	this.editor.cwDoc.getElementById("tablediv").innerHTML=this.funcXML.transformNode(this.funcXSL)
	this.setModifiedFlag(false)
}

//-----------------------------------------------------------------------------
ScriptView.prototype.apply=function()
{
	this.setMsg()
	if (!this.getModifiedFlag()) return true;

	var textBody=this.editor.cwDoc.getElementById("textBody")
	if (this.getTextContent() == this.getContent()) return (true);

	var oFormDef=myDoc.xmlDoc
	var scriptNode = oFormDef.selectSingleNode("//XSCRIPT")
	if (scriptNode)
	{
		if (textBody.value.length > 0)
		{
			if (!this.checkSyntax()) return false;
			var newNode=oFormDef.createNode(1, "XSCRIPT","")
			var cData=oFormDef.createNode(4, "cdata","")
			cData.text=this.getTextContentFormatted();
			newNode.appendChild(cData)
			newNode.setAttribute("id", "script1")
			newNode.setAttribute("nbr", "_s1")
			oFormDef.documentElement.replaceChild(newNode, scriptNode)
			this.script=cData.text
		}
		else
		{
			oFormDef.documentElement.removeChild(scriptNode)
			this.script=""
		}
	}
	else
	{
		if (textBody.value.length > 0)
		{
			if (!this.checkSyntax()) return false;
			var oFormDef=myDoc.xmlDoc
			var sNode=oFormDef.createNode(1, "XSCRIPT","")
			var cData=oFormDef.createNode(4, "cdata","")
			cData.text=this.getTextContentFormatted();
			sNode.appendChild(cData)
			sNode.setAttribute("id", "script1")
			sNode.setAttribute("nbr", "_s1")
			oFormDef.documentElement.appendChild(sNode)
			this.script=cData.text
		}
	}
	this.setModifiedFlag(false)
	myDoc.setModifiedFlag(true,false)
	return true
}

//-----------------------------------------------------------------------------
ScriptView.prototype.checkSyntax=function()
{
	this.setMsg()
	var src=this.editor.cwDoc.getElementById("textBody").value
	if (src.length==0) return true;

	try {
		var sc = new ActiveXObject("ScriptControl")
		if(typeof(sc) != "undefined")
		{
			sc.Language = "javascript"
			sc.AddCode(src)
		}
		return true;
	}
	catch (e) {
		if(typeof(sc) != "undefined")
		{
			var msg="Syntax error at line "+sc.Error.Line+
				", column "+sc.Error.Column+
				":\n\n"+sc.Error.Description
			this.setMsg(msg)
			this.setTextPosition(sc.Error.Line, sc.Error.Column)
			return false;
		}
		else	
		{// If the script control object is not installed.
			var msg=myDesigner.stringTable.getPhrase("MSG_SCRIPTING_OCX_NOT_FOUND_SAVE")
			top.cmnDlg.messageBox(msg,"ok","stop")
			return true;
		}
	}
}

//-----------------------------------------------------------------------------
ScriptView.prototype.disableFieldXML=function()
{
	var sel=this.editor.cwDoc.getElementById("selObjects")
	var len=sel.options.length
	for (var i = len-1; i >=0 ; i--)
	{
		if (sel.options[i].value!="funcs")
			sel.removeChild(sel.options[i])
	}
}

//-----------------------------------------------------------------------------
ScriptView.prototype.loadFieldXML=function()
{
	// load data and widget elements XML
	this.fieldXML=top.xmlFactory.createInstance("DOM");
	this.fieldXML.async=false;
	this.fieldXML.loadXML(myDoc.xmlDoc.xml);
	if (this.fieldXML.parseError.errorCode != 0)
		top.displayDOMError(this.fieldXML.parseError,"ScriptView.loadFieldXML()")
	else
	{
		var root=this.fieldXML.documentElement
		root.setAttribute("displayset", "data")
	}
}

//-----------------------------------------------------------------------------
ScriptView.prototype.onObjectChange=function(val)
{
	var tablediv=this.editor.cwDoc.getElementById("tablediv")
	switch (val)
	{
	case "data":
		var root=this.fieldXML.documentElement
		root.setAttribute("displayset", "data")
		tablediv.innerHTML=this.fieldXML.transformNode(this.fieldXSL)
		break;

	case "all":
		var root=this.fieldXML.documentElement
		root.setAttribute("displayset", "all")
		tablediv.innerHTML=this.fieldXML.transformNode(this.fieldXSL)
		break;

	case "funcs":
		tablediv.innerHTML=this.funcXML.transformNode(this.funcXSL)
		break;
	}

	// always want focus in text area
	var textBody=this.editor.cwDoc.getElementById("textBody")
	if (textBody) textBody.focus()
	if (this.textloc) this.textloc.select()
}

//-----------------------------------------------------------------------------
ScriptView.prototype.onWidgetChange=function(value)
{
	// remove existing event options
	var selEvents=this.editor.cwDoc.getElementById("selEvents")
	for (var i=selEvents.options.length-1; i > -1; i--)
		selEvents.removeChild(selEvents.children(i))

	var control = myDesigner.toolBox.getControlObject(value);
	for (var i = 0; i < control.events.count; i++)
	{
		evt = control.events.item(i);
		var oOption = document.createElement("option")
		oOption.text = evt.label
		oOption.value = evt.id
		selEvents.add(oOption)
	}
	selEvents.selectedIndex=-1
}

//-----------------------------------------------------------------------------
ScriptView.prototype.onEventChange=function(value)
{
	var selWidgets=this.editor.cwDoc.getElementById("selWidgets")
	var selEvents=this.editor.cwDoc.getElementById("selEvents")

	var sWidget=selWidgets.options[selWidgets.selectedIndex].value
	var sEvent=selEvents.options[selEvents.selectedIndex].text
	
	var oEvent=null
	var control = myDesigner.toolBox.getControlObject(sWidget);
	oEvent=control.events.item(value)

	var sParms=oEvent.parms
	var sFunc = "function "+sWidget.toUpperCase()+"_"+sEvent+"("+sParms+")"
	var sNewData="\n\n"+sFunc+"\n{\n\t"
	var cursorPos = -2
	var sReturn=oEvent.returnVal
	if (!sReturn)
		sNewData+="\n}"
	else
	{
		if (sReturn.toLowerCase()=="boolean")
		{
			sNewData+="\n\treturn true;\n}"
			cursorPos = -16
		}
		else if (sReturn.toLowerCase()=="string")
		{
			sNewData+="\n\treturn str;\n}"
			cursorPos = -15
		}
		else if (sReturn != "")
		{
			sNewData+="\n\treturn "+sReturn+";\n}"
			cursorPos = -1*(16+(sReturn.length-4))
		}
		else
		{
			sNewData+="\n}"
		}
	}

	var textBody=this.editor.cwDoc.getElementById("textBody")
	var oTextRng=textBody.createTextRange()
	var bFound=oTextRng.findText(sFunc, 0, 2)
	if (bFound)
		oTextRng.select()
	else
	{
		oTextRng.text+=sNewData
		textBody.focus()
		oTextRng.moveEnd("textedit")

		// move cursor position to the line above "return true;"
		oTextRng.move("character", cursorPos)
		oTextRng.select()
		this.textloc = this.editor.cwDoc.selection.createRange();
		this.setModifiedFlag()
	}
}

//-----------------------------------------------------------------------------
ScriptView.prototype.openIncludeDlg=function()
{
 	var ds = new top.DataStorage()
 	var incNode=myDoc.xmlDoc.selectSingleNode("/form/INCLUDE")
 	var uiNode=myDoc.xmlDoc.documentElement

	// build list of current include files
	var len = incNode ? incNode.childNodes.length : 0
	for (var i = 0; i < len; i++)
	{
		var fNode=incNode.childNodes[i]
		var name = fNode.getAttribute("name");
		var iPos = name.indexOf("name=");
		if (iPos != -1)
			name = name.substr(iPos+5);
		ds.add("file"+(i+1), name );
	}

	// call the common dialog
	ds=top.cmnDlg.selectScriptFiles(ds,null,window);
	if (typeof(ds) == "undefined" || ds==null) return;

	myDoc.setModifiedFlag(true,false)
	
	// remove the include node
	if (incNode)
		uiNode.removeChild(incNode)

	// add the the include files
	if (ds.length < 1) return;
	incNode = myDoc.xmlDoc.createNode("1","INCLUDE","")
	incNode.setAttribute("id", "include1")
	uiNode.insertBefore(incNode,uiNode.childNodes(0))

	for (var i = 0; i < ds.length; i++)
	{
		var scNode = myDoc.xmlDoc.createNode("1","FILE","")
		scNode.setAttribute("name",ds.getItem("file"+(i+1)).value)
		incNode.appendChild(scNode)
	}
}

//-----------------------------------------------------------------------------
ScriptView.prototype.pastePrototype=function(funcName)
{
	// build the function prototype
	var funcNode=this.funcXML.selectSingleNode("//FUNCTION[@name='"+funcName+"']")
	var funcP="lawForm."+funcNode.getAttribute("name")
	funcP+="("
	for (var i = 0; i < funcNode.childNodes.length; i++)
	{
		funcP+=funcNode.childNodes(i).getAttribute("name")
		if (i+1 < funcNode.childNodes.length)
			funcP+=","
	}
	funcP+=");"

	var copyText=this.editor.cwDoc.getElementById("copyText")
	var textBody=this.editor.cwDoc.getElementById("textBody")

	copyText.value=funcP

	var rng=copyText.createTextRange()
	rng.execCommand("Copy")

	if (!this.textloc)
	 	this.textloc = this.editor.cwDoc.selection.createRange();
	this.textloc.execCommand("Paste")

	textBody.focus()
	this.textloc.moveEnd("textedit")

	// if any parms, select the first
	var count = 0
	if (funcNode.childNodes.length > 0)
	{
		count = -2*(funcNode.childNodes.length)
		this.textloc.move("word", count)
		this.textloc.select()
		this.textloc.findText(funcNode.childNodes(0).getAttribute("name"), 1, 4)
		this.textloc.select()
	}
	else
	{
		this.textloc.move("word", count)
		this.textloc.select()
	}
	this.setModifiedFlag()
}

//-----------------------------------------------------------------------------
ScriptView.prototype.pasteString=function(strValue)
{
	try {
		var copyText=this.editor.cwDoc.getElementById("copyText")
		var textBody=this.editor.cwDoc.getElementById("textBody")
		copyText.value="\""+strValue+"\""
		var rng=copyText.createTextRange()
		rng.execCommand("Copy")
		this.textloc.execCommand("Paste")

		textBody.focus()
		this.textloc.select()
		this.setModifiedFlag()
		
	} catch (e) { }
}

//-----------------------------------------------------------------------------
ScriptView.prototype.sortList=function(type)
{
	var tablediv=this.editor.cwDoc.getElementById("tablediv")
	var sortNodes=this.fieldXSL.selectNodes("//*[@order='"+
			(this.sortAsc ? "ascending" : "descending")+"']")

	if (type == this.sortBy)
		this.sortAsc=!this.sortAsc;
	else
		this.sortAsc=true;

	var len=sortNodes.length
	var strSelect="translate(@"+type+",'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')"
	for (var i = 0; i < len; i++)
	{
		sortNodes[i].setAttribute("select", strSelect);
		sortNodes[i].setAttribute("order", (this.sortAsc ? "ascending" : "descending"));
	}

	this.sortBy=type
	tablediv.innerHTML=this.fieldXML.transformNode(this.fieldXSL)

	// always want focus in text area
	var textBody=this.editor.cwDoc.getElementById("textBody")
	if (textBody) textBody.focus()
	if (this.textloc) this.textloc.select()
}

//-----------------------------------------------------------------------------
ScriptView.prototype.setActive=function()
{
	myDesigner.showPropertyArea(false);
	if (myDesigner.workSpace.maximized)
		myDesigner.workSpace.setWindowState("maximize");
}

//-----------------------------------------------------------------------------
ScriptView.prototype.getContent=function()
{
	if (this.script.substr(0,1) != "\n")
		this.script="\n"+this.script;
	return (this.script);
}

//-----------------------------------------------------------------------------
ScriptView.prototype.setContent=function()
{
	this.script=""
	var scrNode=myDoc.xmlDoc.selectSingleNode("//XSCRIPT")
	if (scrNode)
	{
		var text=this.getTextContentFormatted(scrNode.text);
		// strip leading CR for display
		while (text.substr(0,2)=="\n\n")
			text=text.substr(1);
		this.script=text;
	}

	this.editor.setTextContent(this.script);
 	this.editor.cwDoc.getElementById("textBody").focus()
 	this.textloc = this.editor.cwDoc.selection.createRange();
	this.checkSyntax()
 	this.setModifiedFlag(false)
}

//-----------------------------------------------------------------------------
ScriptView.prototype.getModifiedFlag=function()
{
	return (this.modified);
}

//-----------------------------------------------------------------------------
ScriptView.prototype.setModifiedFlag=function(bModified)
{
	if (typeof(bModified) != "boolean")
		bModified=true
	this.modified=bModified
}

//-----------------------------------------------------------------------------
ScriptView.prototype.setMsg=function(msg)
{
	var msgDiv=this.editor.cwDoc.getElementById("scrMsg")
	var msgText=this.editor.cwDoc.getElementById("errMsg")
	if (typeof(msg)!="string")
	{
		msgDiv.style.height="0px";
		msgText.innerText="";
	}
	else
	{
		msgDiv.style.height="100px";
		msgText.innerText=msg;
	}
}

//-----------------------------------------------------------------------------
ScriptView.prototype.getTextContent=function()
{
	var textBody=this.editor.cwDoc.getElementById("textBody")
	var text=textBody.value.replace(/\x0D\x0A/g,"\n");
	if (text.substr(0,1) != "\n")
		text="\n"+text;
	return (text);
}

//-----------------------------------------------------------------------------
ScriptView.prototype.getTextContentFormatted=function(src)
{
	if (typeof(src) == "undefined")
	{
		var textBody=this.editor.cwDoc.getElementById("textBody")
		src=textBody.value;
	}
	var text=src.replace(/\x0D\x0A/g,"\n")
	if (text.substr(0,1) != "\n")
		text="\n"+text;
	while (text.substr(text.length-2,3)=="\n\n\n")
		text=text.substr(0,text.length-1);
	while (text.substr(text.length-2,2)!="\n\n")
		text=text+"\n";
	return text;
}

//-----------------------------------------------------------------------------
ScriptView.prototype.setTextPosition=function(line, col)
{
	try {
		var textBody=this.editor.cwDoc.getElementById("textBody")
		textBody.focus()
		var r=textBody.createTextRange();
		var oRects = r.getClientRects()
		r.collapse()
		r.moveToPoint(oRects[line-1].left, oRects[line-1].top)
		if (col > 0) r.move("character", col)
		r.select()

	} catch (e) { }
}

//-----------------------------------------------------------------------------
ScriptView.prototype.setToolboxState=function()
{
	myDesigner.source.uiDisableAllTools()
}
