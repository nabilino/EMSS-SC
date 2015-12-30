/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/uidocument.js,v 1.21.2.18.4.29.6.2.6.7 2012/08/08 12:48:51 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// uidocument.js
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
// Active Document object for UI Designer -------------------------------------
//-----------------------------------------------------------------------------
ActiveDocument.prototype = new parent.DefaultDocument();
ActiveDocument.prototype.constructor = ActiveDocument;
ActiveDocument.superclass = parent.DefaultDocument.prototype;

function ActiveDocument()
{
	ActiveDocument.superclass.initialize.call(this);

	// additional member variables
	this.jsText=""
	this.mainHost="form1";
	this.xmlDoc=null;
	this.origDoc=null;
	this.dsm=null;				// data sources manager
	this.isRedrawing=false;
	this.idVerified=false;
	this.maxDtlHeight=0;
	this.maxDtlRows=0;
	this.dtlCols=0;
	this.labelCnt=0;
	this.fieldCnt=0;
	this.selectAdjust=2;		// minWidth - 1;
	this.lastControl="";		// for debugging, error display
	this.lastControlId="";
	this.openCmd="";
	this.addVal=null;
	this.chgVal=null;
	this.delVal=null;
	this.inqVal=null;
	this.nxtVal=null;
	this.prvVal=null;
	this.maxLen = "20";
	this.convertNames=new Array();

	// load my XSL
	this.xslDoc=top.xmlFactory.createInstance("FTDOM");
	this.xslDoc.async=false;
	var path=top.designStudio.path+"/uidesigner/uidesigner.xsl"
	this.xslDoc.load(path);
	if (this.xslDoc.parseError.errorCode != 0)
		top.displayDOMError(this.xslDoc.parseError,path)

    this.xslCache=top.xmlFactory.createInstance("XSLT");
    this.xslCache.stylesheet = this.xslDoc;

	this.singleUse=false;	// used only during control instantiation
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.createControlInstance=function(ctlId, propbag, bDraw)
{
	// construct id for new control
	var strId=this.getNewControlId(ctlId);
	if (!strId) return;

	// create data storage to pass to base class
	var ds=new top.DataStorage()
	ds.add("id",strId)

	// need to initialize nbr attribute
	this.getNewControlNbr(ctlId,ds);

	// if creating control in object view:
	if (myObject.active)
	{
		// set par/det attributes
		var targNode=this.xmlDoc.selectSingleNode("//*[@id='"+myObject.getTargetElement()+"']")
		var nbr = targNode ? targNode.getAttribute("nbr") : null;
		if (nbr)
		{
			ds.add("par",nbr)
			var oDetailNode = targNode.selectSingleNode("ancestor::detail");
			if (myObject.objNode.nodeName == "detail" || oDetailNode)
			{
				nbr = myObject.objNode.nodeName == "detail" ? nbr : oDetailNode.getAttribute("nbr")
				ds.add("det",nbr)
			}
		}
		// override the row/top attribute
		ds.add("row","0")
	}

	// call the frame work default implementation
	ActiveDocument.superclass.createControlInstance.call(this, ctlId, ds, bDraw);

	// if single use and we just added it, disable the toolbox button
	if (this.singleUse)
		myDesigner.source.uiEnableToolbtn(ctlId,false)
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.copyControlInstance=function(ctlInstId, propbag)
{
	// construct id for new control
	var ctlInst=this.getControlInstance(ctlInstId)
	if (ctlInst.getRule("singleUse")=="1") return;
	var strId=this.getNewControlId(ctlInst.ctlId);
	if (!strId) return;

	var ds=new top.DataStorage()
	ds.add("id",strId)

	// need to initialize nbr attribute
	this.getNewControlNbr(strId,ds);

	if (ctlInst.getRule("nodeName") == "fld")
	{
		// Override nm property when it references a data source
		var tp=ctlInst.getRule("nodeTp");
		if (tp && tp.toLowerCase() != "rect" && tp.toLowerCase() != "label")
			ds.add("nm","");

		// Override defval property when it's an xlt output field
		if (tp && tp.toLowerCase() == "out")
		{
			var v=ctlInst.propertyBag.getElement("defval");
			if (ctlInst.propertyBag.getElement("defval").indexOf("_f") == 0)
				ds.add("defval","");
		}
	}

	// call the frame work default implementation
	ActiveDocument.superclass.copyControlInstance.call(this, ctlInstId, ds);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.setControlInstanceProperties=function(ctlInst,ctlNode,bEval)
{
	try {
		if (typeof(bEval) != "boolean") bEval=true;
		var len=(ctlInst.propertyBag.elements ? ctlInst.propertyBag.elements.length : 0);
		for (var i = 0; i < len; i++)
		{
			var name=ctlInst.propertyBag.elements.children(i).name
			var val = ctlNode.getAttribute(name)
			if (val==null) continue;
	 		ctlInst.set(name, val)
			if (bEval)
				// during document load we must evaluate the properties read-only
				// attributes and rules to see if this instance overrides the
				// defaults for the control
				this.evalPropertyRules(ctlNode,name,val,false)

	 	}
	} catch (e) { }
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getNewControlId=function(ctlId)
{
	try {
		// select current nodes of this type
		var control=myDesigner.toolBox.getControlObject(ctlId,"lawform");
		if (!control) return (null);

		var nodeName=""
		if (control.getRule("nodeName"))
			nodeName+=control.getRule("nodeName")
		else
			nodeName=ctlId
		switch(nodeName)
		{
		case "fld":
			var tp=control.getRule("nodeTp")
			var seltyp = ( tp=="Select" ? control.getRule("nodeSeltype") : "");
			var id = ( (seltyp == "") 
					? tp.toLowerCase() 
					: seltyp ) + this.getUniqueID(tp,"fld",null,seltyp);
			return (id);
			break;
		case "detail":
			return "detail1";
			break;
		default:
			return nodeName.toLowerCase() + this.getUniqueID(nodeName,"")
			break;
		}

	} catch (e) { }
	return (null);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getNewControlNbr=function(ctlId,ds)
{
	if (ctlId=="tabregion")
	{
		var trNodes=this.xmlDoc.selectNodes("//tabregion")
		for (var i = trNodes.length; ; i++)
		{
			var trNbr="TR"+i
			if (!this.xmlDoc.selectSingleNode("//tabregion[@nbr='"+trNbr+"']"))
			{
				ds.add("nbr",trNbr)
				break;
			}
		}
	}
	else if (ctlId=="detail")
	{
		// do nothing here... special drawing in drawControl
	}
	else if (ctlId=="text")
	{
		this.fieldCnt++
		ds.add("nbr","_f" + this.fieldCnt)
	}
	else
	{
		this.labelCnt++
		ds.add("nbr","_l" + this.labelCnt)
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.changeTabNbrs=function(tabNode)
{
	// determine new nbr to assign
	var trNbr="TR";
	var trNodes=this.xmlDoc.selectNodes("//tabregion");
	var len=trNodes.length;
	for (var i = 0; i < len; i++)
	{
		trNbr="TR"+i;
		if (!this.xmlDoc.selectSingleNode("//tabregion[@nbr='"+trNbr+"']"))
			break;
	}

	// assign the new nbr
	tabNode.setAttribute("nbr",trNbr);
	var ctlInst=this.getControlInstance(tabNode.getAttribute("id"));
	ctlInst.set("nbr",trNbr);

	// now each tab child must be updated
	len=tabNode.childNodes.length;
	var tabNbr=0;
	for (var i = 0; i < len; i++)
	{
		if (tabNode.childNodes[i].nodeName != "tab")
			continue;
		var tab=tabNode.childNodes[i];
		tab.setAttribute("nbr",trNbr.replace("TR","TF")+"-"+tabNbr);
		if (tabNbr==0)
		{
			var id=tab.getAttribute("id");
			tabNode.setAttribute("grp",id);
			ctlInst.set("grp",id);
		}
		tabNbr++;
	}
}


//-----------------------------------------------------------------------------
// called on initial load of form XML
ActiveDocument.prototype.createControlFromNode=function(node, parentId)
{
	// create a control instance
	var ctlName=node.nodeName.toLowerCase();
	// get out right away for these 
	// (need to process ids of others before we get out below)
	if (ctlName == "#text" || ctlName == "#comment")
		return;

	// for backward compatibility, force all ids (new and old) to lower case.
	var ctlId=node.getAttribute("id");
	var saveId=ctlId;
	ctlId = ctlId.toLowerCase();
	if (ctlId != saveId)
		this.convertNames[this.convertNames.length]=saveId;
	node.setAttribute("id",ctlId);
	
	this.lastControl=ctlName;
	this.lastControlId=ctlId;

	// now special processing for nodes we have not ignored
	switch (ctlName)
	{
	case "transfers":	case "toolbar":		case "path":
	case "row":			case "vals":		case "xscript":
	case "include":		case "workflows":
		// ignore all of these
		return;
		break;

   case "detail":
		// if detail node has tp='Hidden', do not instantiate
		if (node.getAttribute("tp")=="Hidden") return;
		node.setAttribute("rows",node.getAttribute("height"))
		break;

	case "push":
		ctlName="button";
		break;

	case "fld":
		var tp=node.getAttribute("tp")
		if (!tp) return;
		switch (tp.toLowerCase())
		{
		case "hidden":
		case "sp":
		case "tab":
			return;
			break;
		case "label":
			ctlName="label";
			break;
		case "text":
		case "out":
			ctlName="text";
			break;
		case "select":
			if (node.getAttribute("seltype"))
				ctlName=node.getAttribute("seltype");
			else
				ctlName="values";
			break;
		case "rect":
			ctlName="rect";
			break;
		case "textarea": //PT183407
			ctlName="textarea";
			break;
		}
	}

	// create the control instance
	var ctlInst = myDesigner.toolBox.createInstance(ctlName);
	var control=null
	if (ctlInst)
	{
		// add the control to the doc collection and properties area dropdown
		ctlInst.id=ctlId;
		this.controls.add(ctlInst.id, ctlInst);
		control=this.getControlObject(ctlInst.id);

		this.activeControl = ctlInst;
		parent.dsPropArea.addId(ctlInst.id);

		// get the attribute values
		this.setControlInstanceProperties(ctlInst,node,true)
	}

	// create the HTML element?
	var mElement=null
	if ( ctlName!="tab"
	|| (ctlName=="tab" && ctlId == node.parentNode.getAttribute("grp")) ) // only paint active tab
	{
		if (ctlName == "tab")
			mElement=myDesign.editor.cwDoc.getElementById(ctlId);
		if (!mElement)
		{
			var objXSLTProc = this.xslCache.createProcessor();
			objXSLTProc.input = node
			objXSLTProc.transform();
			var strHTML=""
			strHTML+=objXSLTProc.output
			if (strHTML != "")
			{
				var target = parentId ? parentId : (control ? control.host : null);
				mElement = myDesign.editor.addElement(strHTML, ctlId, target);
				if (mElement && ctlName == "detail")
					mElement.setAttribute("maxHeight",this.maxDtlHeight)
				if (myObject.active)
					mElement = myObject.editor.addElement(strHTML, ctlId, target);
			}
		}
	}

	// iterate any child nodes
	var bIsParent = (control ? control.getRule("isParent")=="1" : true);
 	if (node.childNodes.length && bIsParent)
 	{
 		for (var i = 0; i < node.childNodes.length; i++)
		{
			var parId = ""
			// detail area subbordinate tab has different parent
			if (ctlName=="detail" && node.childNodes[i].nodeName=="tabregion")
				parId = mElement ? mElement.parentElement.id : node.parentNode.getAttribute("id")
			else
				parId = mElement ? mElement.id : node.getAttribute("id")
 			this.createControlFromNode(node.childNodes[i], parId)
		}
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.paintControlFromNode=function(editor, node, parentId, bHasSubset)
{
	var ctlId=node.getAttribute("id")
	var ctlName=node.nodeName.toLowerCase()

	// create the HTML element?
	var mElement=editor.cwDoc.getElementById(ctlId)
	if ( !mElement
	&& (ctlName!="tab"
		|| (ctlName=="tab" && ctlId == node.parentNode.getAttribute("grp"))) )
	{
		var objXSLTProc = this.xslCache.createProcessor();
		objXSLTProc.input = node
		objXSLTProc.transform();
		var strHTML=""
		strHTML+=objXSLTProc.output
		if (strHTML != "")
		{
			mElement = editor.addElement(strHTML, ctlId, parentId, false);
			if (mElement && ctlName == "detail")
				mElement.setAttribute("maxHeight",this.maxDtlHeight)
		}
	}

	if (bHasSubset) return;

	// iterate any child nodes
 	if (node.childNodes.length && mElement)
 	{
		var subTabNode=null;
		var control=this.getControlObject(ctlId);
		if (control ? control.getRule("isParent")=="1" : true)
		{
 			for (var i = 0; i < node.childNodes.length; i++)
			{
				// delay painting of detail area subbordinate tab
				if (ctlName=="detail" && node.childNodes[i].nodeName=="tabregion")
				{
					subTabNode=node.childNodes[i]
					continue;
				}
				this.paintControlFromNode(editor, node.childNodes[i], mElement.id, false)
			}
		}
		if (subTabNode)
		{
			if (myDesign.active || (myObject.active && myObject.objNode.nodeName != "detail"))
				this.paintControlFromNode(editor, subTabNode, mElement.parentElement.id, false)
		}
 	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.openLocalDocument=function()
{
	try {
		window.status="Loading local document..."
		this.openCmd="local"
		var docName=this.docPath+"\\"+this.docName;
		var tmpDom=top.xmlFactory.createInstance("DOM");
		tmpDom.async=false;
		tmpDom.load(docName);
		if (tmpDom.parseError.errorCode != 0)
		{
			top.displayDOMError(tmpDom.parseError,"Local Document "+docName)
			return false;
		}

		// we have a dom: is it the right format?
		var formNode=tmpDom.selectSingleNode("/PROJECT/UIDEF/form")
		if (!formNode)
		{
			var msg=myDesigner.stringTable.getPhrase("MSG_INVALID_XML_FORMAT")
			msg+="\n\n"+tmpDom.xml.substr(0,400)+"\n\n"
			top.cmnDlg.messageBox(msg,"ok","stop");
			return false;
		}

		this.xmlDoc=top.xmlFactory.createInstance("DOM");
		this.xmlDoc.async=false;
		this.xmlDoc.setProperty("SelectionLanguage", "XPath");
		this.xmlDoc.loadXML(formNode.xml);
		if (this.xmlDoc.parseError.errorCode != 0)
		{
			top.displayDOMError(this.xmlDoc.parseError,"Local Document "+docName)
			this.xmlDoc=null;
			return false;
		}

		// get reference to new form node
		var formNode=this.xmlDoc.selectSingleNode("/form")
		if (!formNode)
		{
			var msg=myDesigner.stringTable.getPhrase("MSG_INVALID_XML_FORMAT")
			msg+="\n\n"+this.xmlDoc.xml.substr(0,400)+"\n\n"
			top.cmnDlg.messageBox(msg,"ok","stop");
			this.xmlDoc=null;
			return false;
		}

		this.createLabelIDS();

		// complete the initialization
		this.params = new top.DataStorage()
		var pdl=formNode.getAttribute("pdl")
		this.params.add("pdl",pdl)
		var tkn=formNode.getAttribute("TOKEN")
		this.params.add("tkn",tkn)
		this.params.add("sys",formNode.getAttribute("SYSTEM"))
		this.params.add("id",formNode.getAttribute("formid"))
		this.idVerified = true;

		window.status="Loading local document "+pdl+"/"+tkn+"..."
		if ( !this.completeNewDocumentInitialization(pdl,tkn) )
			return false;

		this.buildDisplay(true);
		this.setTitle();

	} catch (e) { top.cmnDlg.messageBox(e.description,"ok","stop") }
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.openRemoteDocument=function()
{
	try {
		var pdl=this.params.getItem("pdl").value
		var tkn=this.params.getItem("tkn").value
		var id=this.params.getItem("id").value

		window.status="Loading custom document "+pdl+"/"+tkn+"/"+id+"..."
		this.openCmd="remote"

		if (!this.loadRemoteXmlDoc(pdl,tkn,id))
			return;

		this.buildDisplay(true);
		this.setTitle();

	} catch (e) { top.cmnDlg.messageBox(e.description,"ok","stop") }
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.newDocument=function()
{
	try {
		var pdl=this.params.getItem("pdl").value
		var sys=this.params.getItem("sys").value
		var tkn=this.params.getItem("tkn").value
		this.provId="remote"

		window.status="Creating new document "+pdl+"/"+tkn+"..."
		this.openCmd="new"

		if (!this.loadRemoteXmlDoc(pdl,tkn))
			return;

		var paint=this.params.getItem("paint").value

		var bIsBlank = (paint=="blank" ? true : false);
		this.buildDisplay(!bIsBlank);
		if (bIsBlank)
		{
			var formNode=this.xmlDoc.selectSingleNode("/form")
			if (formNode)
				this.removeContent(formNode)
		}
		this.setTitle();

	} catch (e) { top.cmnDlg.messageBox(e.description,"ok","stop") }
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.reloadDocument=function()
{
	// clear the display
	this.readyState="loading"
	var formElem=myDesign.editor.cwDoc.getElementById("form1")
	formElem.innerHTML="";

	// clear the xmlDoc and some other member variables
	this.xmlDoc=null;
	this.origDoc=null;
	this.dsm=null;
	this.isRedrawing=false;
	this.maxDtlHeight=0;
	this.maxDtlRows=0;
	this.dtlCols=0;
	this.labelCnt=0;
	this.lastControl="";
	this.lastControlId="";
	this.commandHistory.removeAll();

	// call the open command
	switch (this.openCmd)
	{
	case "local":
		this.openLocalDocument();
		break;
	case "remote":
		this.openRemoteDocument();
		break;
	case "new":
		this.newDocument();
		break;
	}
	myDoc.readyState="complete"
	myDoc.setModifiedFlag(false);
	myDesigner.workSpace.switchView("design");
	myDoc.selectControlInstance("form1")
	myDesign.editor.cwDoc.getElementById("form1").focus()

	window.status="";
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.setTitle=function()
{
	// set a new title
	if (!this.xmlDoc) return;
	var formNode=this.xmlDoc.selectSingleNode("/form")
	if (!formNode) return;

	var title=(formNode.getAttribute("TITLE") ? formNode.getAttribute("TITLE") : "Title not found") +
			" (" + this.docName + ")"
	top.designStudio.explorer.setTitle(this.docName,title)
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.setDocName=function(name)
{
	var oldName=this.docName
	ActiveDocument.superclass.setDocName.call(this,name);
	if (oldName != this.docName)
		this.setTitle()
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.setRedraw=function(flag)
{
	if (typeof(flag) != "boolean")
		flag=true;
	this.isRedrawing=flag;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getRedraw=function()
{
	return (this.isRedrawing)
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.isFormIdUnique=function(id,dom)
{
	var oDom = (typeof(dom) != "undefined") ? dom : this.xmlDoc;
	var formId = (typeof(id) == "string") ? id : oDom.selectSingleNode("//form/@formid").text
 	var oFileMgrXML = top.fileMgr.checkFormId(oDom.selectSingleNode("//form/@pdl").text,
			oDom.selectSingleNode("//form/@TOKEN").text, formId)
	if (oFileMgrXML==null) return null;

	return (oFileMgrXML.selectSingleNode("//IDCHECK[@unique='true']")) ? true : false;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getUniqueID=function(element,type,dom,seltyp)
{
	var mTemp=0
	var nbrCnt=this.xmlDoc.selectNodes("//*[@nbr]")
	var xmlDoc = (dom!=null && typeof(dom) == "object") ? dom : this.xmlDoc;

	if (type=="fld")
	{
		var fldNodes=null
		var idPrefix = element
		var fldNodes = xmlDoc.selectNodes("//fld[starts-with(@id,'" + element.toLowerCase() + "')]");
		if (typeof(seltyp) == "string" && seltyp != "")
		{
			fldNodes = xmlDoc.selectNodes("//fld[starts-with(@id,'" + seltyp.toLowerCase() + "')]");
			idPrefix = seltyp;
		}
		if (idPrefix=="Tab")
			idPrefix+="fld";

		for (var i=0; i < fldNodes.length; i++)
		{
			var lNbr=fldNodes[i].getAttribute("id")
			if (lNbr == null) break;
			if (lNbr.indexOf(idPrefix.toLowerCase())==0)
			{
				mNbr=parseInt(lNbr.substr(idPrefix.length))
				if (mNbr > mTemp) mTemp=mNbr
			}
		}
	}
	else
	{
		var nbrCnt=xmlDoc.selectNodes("//" + element)
		for (var i=0; i < nbrCnt.length; i++)
		{
			var lNbr=nbrCnt[i].getAttribute("id")+""
			if (lNbr.indexOf(element.toLowerCase())==0)
			{
				mNbr=parseInt(lNbr.substr(element.length))
				if (mNbr > mTemp)
					mTemp=mNbr
			}
		}
	}
	mTemp++
	return mTemp
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.convertScript=function()
{
	try {
		// check the script node
		var scriptNode = this.xmlDoc.selectSingleNode("//XSCRIPT")
		if (scriptNode)
		{
			var strScript=this.convertScriptText(scriptNode.text);
			if (strScript != scriptNode.text)
			{
				scriptNode.parentNode.removeChild(scriptNode);
				scriptNode=this.xmlDoc.createNode(1,"XSCRIPT","");
				var cData=this.xmlDoc.createNode(4,"cdata","");
				cData.text=strScript;
				scriptNode.appendChild(cData);
				scriptNode.setAttribute("id","script1");
				this.xmlDoc.documentElement.appendChild(scriptNode);
			}
		}

		// now check any include files
	 	var incNode=myDoc.xmlDoc.selectSingleNode("/form/INCLUDE")
		if (incNode)
		{
			var fileNodes=incNode.selectNodes("./FILE");
			var len=fileNodes.length;
			for (var i = 0; i < len; i++)
			{
				// 'name' attribute is FileMgr call
				var fileName=fileNodes[i].getAttribute("name");
				var fileText=top.SSORequest(fileName,null,"text/plain","text/plain",false);
				if (typeof(fileText) != "string")
					continue;
				var convText=this.convertScriptText(fileText);
				if (convText != fileText)
				{
					var iPos=fileName.lastIndexOf("=");
					if (iPos != -1)
					{
						fileName=fileName.substr(iPos+1);
						top.fileMgr.save(top.contentPath+"/scripts", fileName, 
									convText, "text/plain", true, false);
					}
				}
			}
		}
		return;

	} catch (e) { 
		var msg="Error during script conversion process:\n"+e.description+
			"\n\nSome associated script may not have been converted.\n\n";
		top.cmnDlg.messageBox(msg,"ok","alert");
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.convertScriptText=function(str)
{
	var theText=str
	var len = this.convertNames.length;
	for (var i = 0; i < len; i++)
	{
		var oldName=this.convertNames[i];
		var newName=oldName.toLowerCase();
		var re = new RegExp(oldName,"g");
		theText=theText.replace(re,newName);
	}
	return theText;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.createElementID=function(node)
{
	switch(node.nodeName)
	{
	case "fld":
		var tp=node.getAttribute("tp")
		var seltyp = ( tp=="Select" ? node.getAttribute("seltype") : "" );
		var id = (seltyp && seltyp != "") 
				? seltyp + this.getUniqueID(tp,"fld",null,seltyp) 
				: (tp == "Tab") 
					? "tabfld" + this.getUniqueID(tp,"fld",null,seltyp)
					: tp.toLowerCase() + this.getUniqueID(tp,"fld",null,seltyp);
		return (id);
		break
	default:
		return node.nodeName.toLowerCase() + this.getUniqueID(node.nodeName,"")
		break
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.createIDs=function()
{
	var mElements=this.xmlDoc.selectNodes("//*[not(@id)]")
	for (var i=0; i < mElements.length; i++)
	{
		var newId=this.createElementID(mElements[i])
		mElements[i].setAttribute("id",newId)
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.createLabelIDS=function()
{
	this.labelCnt=0
	this.fieldCnt=0
	var nbrCnt=this.xmlDoc.selectNodes("//*[@nbr]")

	// initialize cnt var to largest existing L nbr
	for (var i=0; i < nbrCnt.length; i++)
	{
		lNbr=nbrCnt[i].getAttribute("nbr")
		if (lNbr.indexOf("_l")==0)
		{
			mNbr=parseInt(lNbr.substr(2))
			if (mNbr > this.labelCnt) this.labelCnt=mNbr
		}
		if (lNbr.indexOf("_f")==0)
		{
			mFieldNbr=parseInt(lNbr.substr(2))
			if (mFieldNbr > this.fieldCnt) this.fieldCnt=mFieldNbr
		}
	}
	// initialize label sizes on labels that do not have one
	var labels=this.xmlDoc.selectNodes("//fld[@tp='label' and not(@sz)]")
	for (var i=0; i < labels.length; i++)
		labels[i].setAttribute("sz",(labels[i].getAttribute("nm")+"").length)

	// assign L nbrs to everything that does not have a nbr
	labels=this.xmlDoc.selectNodes("//*[not(@nbr)]")
	for (var i=0; i < labels.length; i++)
		labels[i].setAttribute("nbr","_l" + i)
	this.labelCnt+=labels.length

	// initialize seltype attribute
	var sels=this.xmlDoc.selectNodes("//*[@tp='Select' and not(@seltype)]")
	for (var i=0; i < sels.length; i++)
		sels[i].setAttribute("seltype", "")
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.initDetailFCs=function()
{
	// convert detail FC to Select Type fields for design (convert back before saving)
	var fcs=this.xmlDoc.selectNodes("//detail/fld[@tp='Fc' and @detFC='1']");
	for (var i=0; i < fcs.length; i++)
		fcs[i].setAttribute("tp","Select");
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.initDetails=function()
{
	var details=this.xmlDoc.selectNodes("//detail")
	for (var i=0; i < details.length; i++)
	{
		var daTP = details[i].getAttribute("tp")
		if (!daTP)
			details[i].setAttribute("tp", "Detail")

		// initialize any detail col/width attributes
		var parId = details[i].parentNode.getAttribute("id");
		if ( !details[i].getAttribute("col") )
			details[i].setAttribute("col", (parId == "form1" ? "1" : "0"))
		if ( !details[i].getAttribute("width") )
			details[i].setAttribute("width", (parId == "form1" ? "79" : "80"))

		var hdrNodes=details[i].selectNodes("./fld[@header='1' or @dtlhdr='1']")
		var len = hdrNodes ? hdrNodes.length : 0;
		for (var j = 0; j < len; j++)
		{
			// only use dtlhdr attribute!
			hdrNodes[j].removeAttribute("header")
			hdrNodes[j].setAttribute("dtlhdr","1")
		}

		if (details[i].getAttribute("tp") == "Detail")
		{
			details[i].setAttribute("hdrsize",details[i].selectSingleNode("./row[@rowID='0']").getAttribute("row"))

			var detLabels=details[i].selectNodes("./fld[@tp='label' and (not(@dtlhdr))]")
			var rowBottom=parseInt(details[i].getAttribute("hdrsize")) + parseInt(details[i].getAttribute("rowspan"))
			rowBottom -= 1	// rows are 0 relative
			if(detLabels)
			{
				var currentLabel=detLabels.nextNode()
				while(currentLabel)
				{
					labelRow=parseInt(currentLabel.getAttribute("row"))

					if(labelRow>rowBottom)
						details[i].removeChild(currentLabel)
					else
						currentLabel.setAttribute("repeat","true")
					currentLabel=detLabels.nextNode()
				}
			}
		}

		// if all the fields on detail area are hidden, hide detail area
		var fldNode=details[i].selectSingleNode("./fld[@tp!='Hidden']")
		if (!fldNode)
			details[i].setAttribute("tp", "Hidden")
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.initNewDetail=function(newId,bQuick)
{
	// find first hidden detail area
	var msg="";
	var dtlNode = this.xmlDoc.selectSingleNode("//detail[@tp='Hidden']");
	if (!dtlNode)
	{
		msg="No detail node found on form, unable to instantiate control.";
		top.cmnDlg.messageBox(msg,"ok","alert");
		return null;
	}

	// get the original detail area to apply some attributes
	var origDtl = this.origDoc.selectSingleNode("//detail[@nbr='"+dtlNode.getAttribute("nbr")+"']");
	if (!origDtl)
	{
		msg="Default detail area properties unknown, unable to instantiate control.";
		top.cmnDlg.messageBox(msg,"ok","alert");
		return null;
	}

	if (bQuick)
		dtlNode=origDtl.cloneNode(true);

	dtlNode.setAttribute("tp","Detail");
	dtlNode.setAttribute("id",newId);

	// remove the row nodes
	var len = dtlNode.childNodes.length;
	for (var i = len-1; i > 0 ; i--)
	{
		if (dtlNode.childNodes[i].nodeName == "row")
			dtlNode.removeChild(dtlNode.childNodes[i]);
	}

	// initialize rows based on original form def
	var origRows=origDtl.selectNodes("./row");
	len = origRows ? origRows.length : 0;
	for (var i = 0; i < len; i++)
	{
		var clNode=origRows[i].cloneNode(true);
		dtlNode.appendChild(clNode);
	}

	// assign L nbrs to everything that does not have a nbr
	var nodes=dtlNode.selectNodes("./*[not(@nbr)]");
	for (var i=0; i < nodes.length; i++)
		nodes[i].setAttribute("nbr","_l" + parseInt(this.labelCnt+i+1));
	this.labelCnt+=nodes.length;

	dtlNode.setAttribute("row", origDtl.getAttribute("row"));
	dtlNode.setAttribute("height", origDtl.getAttribute("height"));
	dtlNode.setAttribute("rowspan", origDtl.getAttribute("rowspan"));
	dtlNode.setAttribute("rows", len);

	// load the xml string in a DOM
	var oDOM=top.xmlFactory.createInstance("DOM");
 	oDOM.async=false;
 	oDOM.loadXML(dtlNode.xml);
	if (oDOM.parseError.errorCode != 0)
	{
		top.displayDOMError(oDOM.parseError,"initNewDetail()");
		return null;
	}
	return oDOM;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.isDataBoundControl=function(node)
{
	// must have 'nbr' attribute '_fNNN'
	if (!node.getAttribute("nbr"))
		return false;
	if (node.getAttribute("nbr").indexOf("_f") != 0)
		return false;

	// also must have an 'sz' attribute
	return (node.getAttribute("sz") ? true : false);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.unbindField=function(node)
{
	this.dsm.freeDataSrc(node)

	var oldNode=node.cloneNode(true)
	oldNode.setAttribute("id","hidden"+this.getUniqueID("Hidden","fld"))

	if(node.getAttribute("tp") != "Text")
	{
		this.labelCnt++
		node.setAttribute("nbr","_l" + this.labelCnt)
	}
	else
	{
		this.fieldCnt++
		node.setAttribute("nbr","_f" + this.fieldCnt)
	}
	node.setAttribute("nm","")
	node.setAttribute("keynbr","")
	node.removeAttribute("req")
	node.removeAttribute("nextreq")
	node.removeAttribute("deftkn")
	node.removeAttribute("hsel")
	node.removeAttribute("hdet")
	node.removeAttribute("hselrul")
	node.removeAttribute("hrul")
	node.removeAttribute("att_url")
	node.removeAttribute("att_cmt")
	node.removeAttribute("key")
	node.removeAttribute("mxsz")
	this.labelCnt++

	node.parentNode.insertBefore(oldNode,node)

	this.changeFieldDataBind(oldNode,node,false)
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.changeFieldDataBind=function(oldNode,newNode,move)
{
	if (!oldNode || !newNode) return;
	if (oldNode==newNode) return;

	if (oldNode.nodeName=="push")
		newNode.setAttribute("tp","")
	else if (oldNode.nodeName=="TEXTAREA")
		newNode.setAttribute("tp","textArea")
	else
		newNode.setAttribute("tp",oldNode.getAttribute("tp"))

	// update UI aspects of newNode with oldNode attributes
	newNode.setAttribute("row",oldNode.getAttribute("row"))
	newNode.setAttribute("col",oldNode.getAttribute("col"))

	if (oldNode.getAttribute("width")!=null)
		newNode.setAttribute("width",oldNode.getAttribute("width"))
	if (oldNode.getAttribute("height")!=null)
		newNode.setAttribute("height",oldNode.getAttribute("height"))
	
	if (oldNode.getAttribute("par")!=null)
		newNode.setAttribute("par",oldNode.getAttribute("par"))

	if (oldNode.getAttribute("seltype")!=null)
		this.changeSeltypeBind(oldNode,newNode)

	// change xlt binding?
	var xltNode=oldNode.parentNode.selectSingleNode("./fld[@isxlt='"+oldNode.getAttribute("nbr")+"']");
	if (xltNode)
	{
		xltNode.setAttribute("isxlt",newNode.getAttribute("nbr"));
		xltNode.setAttribute("nm", newNode.getAttribute("nm"));
	}

	// place newNode into XML structure where old Node is
	if (typeof(move) != "boolean") move=true;
	if (move)
	{
		if (oldNode.getAttribute("nbr").indexOf("_f") == -1)
			oldNode.parentNode.replaceChild(newNode,oldNode)
		else
		{
			oldNode=oldNode.parentNode.replaceChild(newNode,oldNode)
			oldNode=newNode.parentNode.insertBefore(oldNode,newNode)
			oldNode.setAttribute("tp","Hidden")
		}
	}
	else
	{
		// only from unbind...old node is always '_fn'
		oldNode.setAttribute("tp","Hidden")
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.changeSeltypeBind=function(oldNode,newNode)
{
	if (oldNode.getAttribute("label")!=null)
		newNode.setAttribute("label", oldNode.getAttribute("label"))
	var seltype=oldNode.getAttribute("seltype")
	newNode.setAttribute("seltype", seltype)

	// standard select
	if (seltype == "")
		return;

	// radio button
	if (seltype == "radio")
	{
		if (oldNode.getAttribute("across")!=null)
			newNode.setAttribute("across",oldNode.getAttribute("across"))
		return;
	}

	// checkbox
	if (seltype=="check")
	{
		if (oldNode.getAttribute("al")!=null)
			newNode.setAttribute("al",oldNode.getAttribute("al"))
		if (oldNode.childNodes.length > 0)
		{
			// bring forward any child nodes?
 			for (var i = newNode.childNodes.length-1; i > -1; i--)
 				newNode.removeChild(newNode.childNodes(i))
 			// now attach the children of the old node
 			for (var i = 0; i < oldNode.childNodes.length; i++)
 			{
 				var newChild=oldNode.childNodes(i).cloneNode(false)
 				newNode.appendChild(newChild)
 			}
		}
		else
		{
 			// be sure children have a Tran and checked attribute
			var child = newNode.selectNodes("./vals")
			if (child.length <= 0)
			{
				// Get original formdef information when no children available for the data
				var origNode = this.origDoc.selectSingleNode("//*[@nbr='"+newNode.getAttribute("nbr")+"']")

				// Get the contains value nodes from parent
				child = origNode.selectNodes("./vals")
			}
 			for (var i = 0; i < child.length; i++)
			{
				child[i].setAttribute("checked", "0")
				var tran = child[i].getAttribute("Tran")
				var disp = child[i].getAttribute("Disp")
				if (!tran)
				{
					if (disp)
					{
						tran=disp
						child[i].setAttribute("Tran", disp)
					}
					else
					{
						disp=""
						tran=disp
						child[i].setAttribute("Tran", tran)
						child[i].setAttribute("Disp", tran)
					}
				}
				else if (!disp)
				{
				 	disp=""
					child[i].setAttribute("Disp", disp)
				}
				if (tran=="Y"||tran=="A")
					child[i].setAttribute("checked", "1")
				newNode.appendChild(child[i])
			}
		}
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.loadRemoteXmlDoc=function(pdl,tkn,formId)
{
	var api=top.servicesPath+"/Xpress?_PDL="+pdl+"&_TKN="+tkn+"&_CONTENTDIR="+top.contentPath
	if (typeof(cust) != "undefined")
		//to get original formdef and not the custom, set this value to false.
		api+="&_CUST=" + cust
	if(typeof(formId)=="undefined")
		api+="&_CUST=false"
	else
		api+="&_ID=" + formId

	this.xmlDoc=top.SSORequest(api,null,"","",false);
	if(!this.xmlDoc || this.xmlDoc.status)
	{
		var msg="Error calling web server Xpress service.\n";
		if (this.xmlDoc)
			msg+=top.getHttpStatusMsg(this.xmlDoc.status) +
				"\nServer response: " + this.xmlDoc.statusText + " (" + this.xmlDoc.status + ")"
		this.xmlDoc=null;
		top.cmnDlg.messageBox(msg,"ok","stop")
		return false;
	}

	if(this.xmlDoc.xml == "")
	{
		var msg=myDesigner.stringTable.getPhrase("MSG_INVALID_SERVER_RESPONSE")
		top.cmnDlg.messageBox(msg,"ok","stop")
		this.xmlDoc=null;
		return false;
	}

	this.xmlDoc.setProperty("SelectionLanguage", "XPath");
	var errNode=this.xmlDoc.selectSingleNode("//ERROR")
	if (errNode)
	{
		var msg="Error calling web server Xpress service.\n";
		try {
			if(errNode.selectSingleNode("MSG"))
				msg+=errNode.selectSingleNode("MSG").text.substr(0,240);
			else
				msg+=errNode.text.substr(0,240);
		} catch (e) { }
		top.cmnDlg.messageBox(msg,"ok","stop")
		this.xmlDoc=null;
		return false;
	}

	// we have xml: is it the right format?
	var formNode=this.xmlDoc.selectSingleNode("/form")
	if (!formNode)
	{
		var msg=myDesigner.stringTable.getPhrase("MSG_INVALID_XML_FORMAT")
		msg+="\n\n"+ci.contents.xml.substr(0,400)+"\n\n"
		top.cmnDlg.messageBox(msg,"ok","stop");
		this.xmlDoc=null;
		return false;
	}

	// must default form node id to 'form1'
	formNode.setAttribute("id","form1")
	// default the value for defaultui to false
	if (!formNode.getAttribute("defaultui"))
		formNode.setAttribute("defaultui","false")

	// default formid to tokenid
	var defId=formNode.getAttribute("TOKEN")+"_CUSTOM";
	if (!formNode.getAttribute("formid"))
	{
		formNode.setAttribute("formid",defId)
		this.params.setItem("id",defId)
		
		// for new documents default button alignment to center
		// (will become unnecessary with future xscrgen change. vlm:9.21.04)
		var pushBtns=this.xmlDoc.selectNodes("//push");
		var len=(pushBtns ? pushBtns.length : 0);
		for (var i = 0; i < len; i++)
			pushBtns[i].setAttribute("al","center");
	}
	else if (formNode.getAttribute("formid") != defId)
		this.idVerified = true;

	if (!this.params.setItem("sys",formNode.getAttribute("SYSTEM")))
		this.params.add("sys",formNode.getAttribute("SYSTEM"))

	if (typeof(formId) == "string")
	{// existing custom form

		// delete any hiddenFC fld nodes
		if (formNode.getAttribute("hiddenFC")=="1")
		{
			var hFCNodes = formNode.selectNodes("./fld[@tp='Hidden' and @nm='FC']")
			for (var i=hFCNodes.length-1; i > 0; i--)
				formNode.removeChild(hFCNodes[i])
		}

		this.createIDs()
	}
	else
	{// new from standard form
		var pathNode=formNode.selectSingleNode("./PATH")
		if(pathNode==null)
		{
			pathNode=this.xmlDoc.createElement("PATH")
			formNode.appendChild(pathNode)
		}

		var msgBarNode=formNode.selectSingleNode("./msgBar")
		if(msgBarNode==null)
		{
			msgBarNode=this.xmlDoc.createElement("msgBar")
			msgBarNode.setAttribute("bMsgArea", "1")
			msgBarNode.setAttribute("nbr", "msgBar")
			formNode.appendChild(msgBarNode)
		}

		// forms with HiddenFC fld node need to convert that node to a toolbar node
		this.removeHiddenFC(this.xmlDoc,false)
	}


	// assign ids to everything else
	this.createLabelIDS()
	this.createIDs()
	this.initDetails()

	// set/validate other root node attributes
	formNode.setAttribute("staticsize","1")
	formNode.setAttribute("nbr","form1")
	formNode.setAttribute("pdl",pdl)
	formNode.setAttribute("custom","1")
	if (!formNode.getAttribute("width"))
	{
		formNode.setAttribute("width","80")
		formNode.setAttribute("height","24")
		formNode.setAttribute("gWidth","10")
		formNode.setAttribute("gHeight","24")
	}
	else if (!formNode.getAttribute("gWidth"))
	{
		var cols = formNode.getAttribute("columns")
		var newWidth = cols ? cols : 0+parseInt(parseInt(formNode.getAttribute("width")/10))
		var rows = formNode.getAttribute("rows")
		var newHeight = rows ? rows : 0+parseInt(parseInt(formNode.getAttribute("height")/24))
		formNode.setAttribute("width",newWidth)
		formNode.setAttribute("height",newHeight)
		formNode.setAttribute("gWidth","10")
		formNode.setAttribute("gHeight","24")
	}
	formNode.removeAttribute("rows")
	formNode.removeAttribute("columns")

	// set the form type (flowchart,batch,online)
	try {
		var strType="o"
		var bIsFlow=false;
		var flowRE=/^\w*FL\.\d+$|^\w*SU\.\d+$|^\w*BB\.\d+$|^\w*BF\.\d+$|^APPI\.\d+$|^APPR\.\d+$|^ARRP\.\d+$|^APIQ\.\d+$/i
		if (tkn.match(flowRE)) bIsFlow=true;
		if (!bIsFlow && formNode.getAttribute("TYPE")=="BATCH")
			strType="b"
		formNode.setAttribute("typ", bIsFlow ? "f" : strType)

		// clear certain batch defvals
		if (strType=="b")
		{
			var node=oFormDef.selectSingleNode("//*[@nm='USER-NAME']")
			if (node) node.setAttribute("defval","")
			node=oFormDef.selectSingleNode("//*[@nm='LONG-NAME']")
			if (node) node.setAttribute("defval","")
			node=oFormDef.selectSingleNode("//*[@nm='PRODUCT-LINE']")
			if (node) node.setAttribute("defval","")
		}

	} catch (e) { }

	// set workflow to 0, but only if it is not already enabled - speed transactions
	if (!formNode.getAttribute("workflow"))
		formNode.setAttribute("workflow","0");

	this.initDetailFCs();

	// this is for binding a field to the message
	// we create a hidden fld message node the datasource stuff will use
	if(this.xmlDoc.selectSingleNode("//form/fld[@nbr='Message']")==null)
	{
		newNode = this.xmlDoc.createNode (1, "fld", "")
		newNode.setAttribute("id","message1")
		newNode.setAttribute("nm","Message")
		newNode.setAttribute("nbr","Message")
		newNode.setAttribute("tp","Hidden")
		newNode.setAttribute("sz","40")
		formNode.appendChild(newNode)
	}
	return (this.completeNewDocumentInitialization(pdl,tkn));
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.completeNewDocumentInitialization=function(pdl,tkn)
{
	// load the original form definition
 	if ( !this.loadOrigDoc(pdl,tkn) )
		return (false);

	// forms with HiddenFC fld node need to convert that node to a toolbar node
	this.removeHiddenFC(this.origDoc,true)

	// set visibility of toolbar buttons
	this.initToolbarButtons()

	// set the detail area max values
	try {
		var origDtl=this.origDoc.selectSingleNode("//detail")
		if (origDtl)
		{
			var hdrRows = origDtl.getAttribute("hdrsize") ? origDtl.getAttribute("hdrsize") : 1;
			var bodyRows = parseInt(origDtl.getAttribute("height")) * parseInt(origDtl.getAttribute("rowspan"))
			var rowNodes=origDtl.selectNodes("./row[@row]")
			var len = rowNodes ? rowNodes.length : 0;
			for (var i = 0; i < len; i++)
			{
				if(parseInt(rowNodes[i].getAttribute("row"))!=hdrRows)
					break;
			}
			this.dtlCols = (i==0 ? 1 : i);
			this.maxDtlHeight=hdrRows+(Math.ceil(bodyRows/this.dtlCols))
			this.maxDtlRows=origDtl.getAttribute("height")
		}
	} catch (e) { }

	// load the data sources manager
	this.dsm = new DataSrcMgr(this.xmlDoc, this.origDoc)
	if (!this.dsm.hiddenXML)
	{
		var msg=myDesigner.stringTable.getPhrase("MSG_DSM_LOAD_FAILURE")
		top.cmnDlg.messageBox(msg,"ok","stop");
		this.xmlDoc=null;
		return false;
	}
	return (true);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.isStandardAction=function(val)
{
	var bIsStandard=false;
	switch (val)
	{
		case this.addVal:	// fall through the standard actions
		case this.chgVal:
		case this.delVal:
		case this.inqVal:
		case this.nxtVal:
		case this.prvVal:
			bIsStandard=true;
			break;
		default:
			bIsStandard=false;
			break;
	}
	return bIsStandard;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.initTabRegions=function()
{
	// initialize any tabregion 'grp' attributes
	var grpNode=this.xmlDoc.selectNodes("/form//tabregion")
	var len = grpNode ? grpNode.length : 0;
	for (var i = 0; i < len; i++)
	{
		var parId = grpNode[i].parentNode.getAttribute("id");
		if ( !grpNode[i].getAttribute("col") )
			grpNode[i].setAttribute("col", (parId == "form1" ? "1" : "0"));
		if ( !grpNode[i].getAttribute("width") )
			grpNode[i].setAttribute("width", (parId == "form1" ? "79" : "80"));

		var childId=""
		var childNode=grpNode[i].childNodes[0]
		if (childNode) childId=childNode.getAttribute("id")
		grpNode[i].setAttribute("grp",childId)
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.initToolbarButtons=function()
{
	var value="";
	var formNode=this.xmlDoc.selectSingleNode("/form");
	this.addVal=(formNode.getAttribute("add") 
			? formNode.getAttribute("add").substr(0,1) : null);
	this.chgVal=(formNode.getAttribute("chg") 
			? formNode.getAttribute("chg").substr(0,1) : null);
	this.delVal=(formNode.getAttribute("del") 
			? formNode.getAttribute("del").substr(0,1) : null);
	this.inqVal=(formNode.getAttribute("inq") 
			? formNode.getAttribute("inq").substr(0,1) : null);
	this.nxtVal=(formNode.getAttribute("next") 
			? formNode.getAttribute("next").substr(0,1) : null);
	this.prvVal=(formNode.getAttribute("next") 
			? formNode.getAttribute("next").substr(1,1) : null);

	var btnNodes=formNode.selectNodes("./toolbar/button");
	var len=btnNodes ? btnNodes.length : 0;
	for (var i = 0; i < len; i++)
	{
		if (btnNodes[i].getAttribute("visible"))
			continue;
		if (btnNodes[i].getAttribute("tp") == "Hidden")
			continue;
		value = btnNodes[i].getAttribute("value")
		btnNodes[i].setAttribute("visible",
			(this.isStandardAction(value) ? "1" : "0"));
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.removeHiddenFC=function(dom,bReload)
{
	// forms with HiddenFC fld node need to convert that node to a toolbar node
	var tmpDom=top.xmlFactory.createInstance("DOM");
	tmpDom.async=false;
	tmpDom.loadXML(dom.xml)

	var fNode=tmpDom.selectSingleNode("//form")
	if (fNode.getAttribute("hiddenFC")=="1")
	{
		var hFCNodes=fNode.selectNodes("./fld[@tp='Hidden' and @nm='FC']")
		for (var i=0; i < hFCNodes.length; i++)
		{
			var newNode = this.xmlDoc.createElement("toolbar")
			for(var x=0; x < hFCNodes[i].attributes.length; x++)
			{
				var attName=hFCNodes[i].attributes[x].name
				var attValue=hFCNodes[i].attributes[x].value
				if (attName == "tp")
					newNode.setAttribute(attName,"HiddenFC")
				else
					newNode.setAttribute(attName,attValue)
			}
			fNode.appendChild(newNode)
			hFCNodes=fNode.removeChild(hFCNodes[i])
		}
		if (bReload && fNode)
			this.origDoc.loadXML(fNode.xml)
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.loadOrigDoc=function(pdl,tkn)
{
	var api=top.servicesPath+"/Xpress?&_PDL="+pdl+"&_TKN="+tkn+"&_CONTENTDIR="+top.contentPath+"&_CUST=false"

	this.origDoc=top.SSORequest(api,null,"","",false);
	if(!this.origDoc || this.origDoc.status)
	{
		var msg="Error calling web server Xpress service.\n"
		if (this.origDoc)
			msg+=top.getHttpStatusMsg(this.origDoc.status) +
				"\nServer response: " + this.origDoc.statusText + " (" + this.origDoc.status + ")"
		this.origDoc=null;
		top.cmnDlg.messageBox(msg,"ok","stop")
		return false;
	}

	// valid return status, now validate
	if(this.origDoc.xml == "")
	{
		var msg=myDesigner.stringTable.getPhrase("MSG_INVALID_SERVER_RESPONSE")
		top.cmnDlg.messageBox(msg,"ok","stop")
		this.origDoc=null;
		return false;
	}

	this.origDoc.setProperty("SelectionLanguage", "XPath");
	var errNode=this.origDoc.selectSingleNode("//ERROR")
	if (errNode)
	{
		var msg="Error calling web server Xpress service.\n";
		try {
			if(errNode.selectSingleNode("MSG"))
				msg+=errNode.selectSingleNode("MSG").text.substr(0,240);
			else
				msg+=errNode.text.substr(0,240);
		} catch (e) { }
		top.cmnDlg.messageBox(msg,"ok","stop")
		this.origDoc=null;
		return false;
	}

	// we have xml: is it the right format?
	var formNode=this.origDoc.selectSingleNode("/form")
	if (!formNode)
	{
		var msg=myDesigner.stringTable.getPhrase("MSG_INVALID_XML_FORMAT")
		msg+="\n\n"+ci.contents.xml.substr(0,400)+"\n\n"
		top.cmnDlg.messageBox(msg,"ok","stop");
		this.origDoc=null;
		return false;
	}
	return (true);
}
//-----------------------------------------------------------------------------
ActiveDocument.prototype.removeContent=function(contentNode)
{
	var currentNode
	var dataNodes=contentNode.childNodes
	for (var i=0; i < dataNodes.length; i++)
	{
		currentNode=dataNodes[i]
		this.deleteControlInstance(currentNode.getAttribute("id"),false)
		switch(currentNode.nodeName)
		{
		case "push":
			currentNode.setAttribute("tp", "Hidden")
			this.dsm.freeDataSrc(currentNode)
			break;

		case "fld":
			var fldType=currentNode.getAttribute("tp")
			if (fldType=="label" || fldType=="rect")
			{
				this.dsm.freeDataSrc(currentNode)
				if (currentNode.selectSingleNode("ancestor::detail"))
					currentNode.setAttribute("tp",fldType+"Hidden");
				else
				{
					contentNode.removeChild(currentNode);
					i--
				}
			}
			else
			{
				if (fldType == "Tab")
					currentNode.setAttribute("tp",fldType+"Hidden");
				else if (fldType.indexOf("Hidden") <= 0)
				{
					this.dsm.freeDataSrc(currentNode)
					currentNode.setAttribute("tp","Hidden");
				}
			}
			break;

		case "detail":
			if ((!currentNode.getAttribute("tp")) || (currentNode.getAttribute("tp")=="Detail"))
			{
				this.removeContent(currentNode)
				i--
			}
			break;
		case "tab":
			this.removeContent(currentNode)
			while (currentNode.childNodes.length>0)
			{
				contentNode.parentNode.appendChild(currentNode.removeChild(currentNode.childNodes[0]))
			}
			contentNode.removeChild(currentNode)
			i--
			break;

		case "msgBar":
		case "PATH":
		case "row":
			break;

		case "tabregion":
			var id=currentNode.getAttribute("id");
			this.removeContent(currentNode)
			if (contentNode.nodeName == "detail")
			{
				// try to remove designer element for subordinate tab
				try {
					if (myDesign.active)
					{
						myObject.setReload()
						myDesign.editor.deleteElement(id)
					}
					else if (myObject.active)
						myObject.editor.deleteElement(id)
				} catch (e) { }
			}
			// fall through!
		case "transfers":
		default:
			contentNode.removeChild(currentNode)
			i--
			break;
		}
	}
	if (contentNode.nodeName == "detail" || contentNode.nodeName == "tab")
		contentNode.setAttribute("tp", "Hidden")
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.buildDisplay=function(bPaint)
{
	try {
		if (typeof(bPaint) != "boolean")
			bPaint=true;

		// first clear any controls
		this.lastControl="";
		this.lastControlId="";
		this.controls.removeAll()
		top.dsPropArea.removeAllIds()
		this.setDocumentProperties()

		// add the layout and controls to the screen
		var formNode=this.xmlDoc.selectSingleNode("/form")
		if (!formNode) return;
		formNode.setAttribute("objmode","0")

		// tell the editors about a grid cell size
		var gHeight=formNode.getAttribute("gHeight") ? formNode.getAttribute("gHeight") : "20"
		var gWidth=formNode.getAttribute("gWidth") ? formNode.getAttribute("gWidth") : "9"
		myDesign.editor.setGrid(gHeight,gWidth,(parseInt(gHeight)*0.1))
		myObject.editor.setGrid(gHeight,gWidth,(parseInt(gHeight)*0.1))

		// update the form properties
		var dataStorage=new top.DataStorage()
		var attrs = formNode.attributes;
		for (var i = 0; i < attrs.length; i++)
		{
			var attr=attrs.item(i)
			if (attr.nodeName && attr.nodeValue)
				dataStorage.add(attr.nodeName,attr.nodeValue)
		}

		// initialize tab regions
		this.initTabRegions();

		// create the controls
		this.convertNames=new Array();
		if (bPaint)
		{
			var ctls=formNode.childNodes
			for (var i = 0; i < ctls.length; i++)
				this.createControlFromNode(ctls[i], null)
		}

		// any converted control names?
		if (this.convertNames.length)
		{
			if (this.xmlDoc.selectSingleNode("//XSCRIPT")
			|| this.xmlDoc.selectSingleNode("//INCLUDE"))
			{
				var msg=this.convertNames.length < 10
					? myDesigner.stringTable.getPhrase("MSG_CONTROLS_CONVERTED1")
					: myDesigner.stringTable.getPhrase("MSG_CONTROLS_CONVERTED1b");

				// display no more than 10 control names
				var len=this.convertNames.length < 10 ? this.convertNames.length : 10;
				if (this.convertNames.length > 9)
					msg=msg.replace("999",this.convertNames.length);
				for (var i = 0; i < len; i++)
				{
					msg+=this.convertNames[i]+"\n";
				}
				msg+=(myDesigner.stringTable.getPhrase("MSG_CONTROLS_CONVERTED2") +
					myDesigner.stringTable.getPhrase("MSG_CONTROLS_CONVERTED3"));
		 		if ( top.cmnDlg.messageBox(msg,"okcancel","question",window) == "ok" )
					this.convertScript();
			}
		}

		// mark clean point
		this.updateProperties(dataStorage,"form1");
		this.setModifiedFlag(false)

	} catch (e) {
		var msg="Error in buildDisplay, last control = '" + this.lastControl +
			"' last control id = '"+this.lastControlId +"'.\nError description:\n"+e.description
		top.cmnDlg.messageBox(msg,"ok","stop")
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getSaveContents=function()
{
	if (!this.xmlDoc) return "";

	var xml=this.getXMLContent();
	try {
		// have to replace document's xml since getXMLContent performs cleanup
		var tempDoc=top.xmlFactory.createInstance("DOM");
		tempDoc.async=false;
		tempDoc.loadXML(xml);

		// we don't want the 'UIDEF' node wrapper
		var formNode=tempDoc.selectSingleNode("//form");
		this.xmlDoc.loadXML(formNode.xml);
		if (mySource.active)
			mySource.setContent();
		tempDoc=null;

	} catch (e) { }
	return xml;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getXMLContent=function()
{
	if (!this.xmlDoc) return ("");

	var tempDoc=top.xmlFactory.createInstance("DOM");
	tempDoc.async=false;
	tempDoc.setProperty("SelectionLanguage", "XPath");
	tempDoc.loadXML("<UIDEF>" + this.xmlDoc.selectSingleNode("//form").xml + "</UIDEF>")

	// convert detail FC to Back to @tp=Fc for save
	var fcs=tempDoc.selectNodes("//detail/fld[@tp='Select' and @detFC='1']")
	for (var i=0; i < fcs.length; i++)
		fcs[i].setAttribute("tp","Fc")

	var formNode=tempDoc.selectSingleNode("//form");
	var strDefault="false"
	if (formNode.getAttribute("defaultui"))
		strDefault=formNode.getAttribute("defaultui")
 	var rootNode=tempDoc.selectSingleNode("//UIDEF")
 	rootNode.setAttribute("default",strDefault)
 	rootNode.setAttribute("id",formNode.getAttribute("formid"))
 	rootNode.setAttribute("token",formNode.getAttribute("TOKEN"))
 	var tranNode=tempDoc.createElement("TRANSACTION")
 	if ( formNode.getAttribute("rtntype") && formNode.getAttribute("rtntype")=="SEL" )
	{
		tranNode.setAttribute("trantype","SELECT")
		var tranNodes = tempDoc.selectNodes("//fld[@rtn='1' and (@tp='Hidden' or @tp='Out' or @tp='Select' or @tp='Text')] | //push[@rtn='1']")
		var tmp=null
		for ( var i=0; i < tranNodes.length; i++)
		{
		 	tmp=tempDoc.createElement("fld")
		 	for (var x=0; x < tranNodes[i].attributes.length; x++)
		 	{
		 		attName=tranNodes[i].attributes[x].name
				switch(attName)
				{
				case "isxlt":
					tmp.setAttribute(attName,"true")
					break
				case "nm":
				case "nbr":
				case "keynbr":
				case "key":
				case "req":
				case "nextreq":
					tmp.setAttribute(attName,tranNodes[i].attributes[x].text)
					break
				}
		 	}
			tranNode.appendChild(tmp)
		}
	}
	else
		tranNode.setAttribute("trantype","ALL")

	// remove hiddens without an '_fnn' nbr attribute
	var hiddenNode=tempDoc.selectSingleNode("//fld[@tp='Hidden' and not(starts-with(@nbr,'_f'))]");
	while (hiddenNode!=null)
	{
		hiddenNode.parentNode.removeChild(hiddenNode)
		hiddenNode=tempDoc.selectSingleNode("//fld[@tp='Hidden' and not(starts-with(@nbr,'_f'))]");
	}

	// remove hiddens with a '_fnn' nbr attribute if same f-number exists not hidden
	var fNodes=tempDoc.selectNodes("//fld[(starts-with(@nbr,'_f') and not (@tp='Hidden'))]");
	var len=(fNodes && fNodes.length ? fNodes.length : 0);
	for (var i = 0; i < len; i++)
	{
		var nbr=fNodes[i].getAttribute("nbr");
		hiddenNode=tempDoc.selectSingleNode("//fld[@nbr='"+nbr+"' and @tp='Hidden']");
		while (hiddenNode!=null)
		{
			hiddenNode.parentNode.removeChild(hiddenNode)
			hiddenNode=tempDoc.selectSingleNode("//fld[@nbr='"+nbr+"' and @tp='Hidden']");
		}
	}

	tempDoc.selectSingleNode("//UIDEF").appendChild(tranNode)
	return tempDoc.xml
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.isValid=function(bClosing, bIsSaveAs)
{
	if (mySource.active || myScript.active)
	{
		var extraInfo = new Object();
		extraInfo.activeView = (mySource.active ? "source" : "script");

		// treat valid check like switch view (assumes we are generally called on close/save):
		// syntax check and prompt to save changes (in event handler)
		var evtObj = top.designStudio.createEventObject(top.ON_BEFORE_SWITCH_VIEW, null, null, extraInfo);
		return ( myDesigner.eventHandler.processEvent(evtObj) );
	}

	if (typeof(bClosing) == "boolean" && bClosing)
		return (true);

	// check for unique formid when performing saveas	
	var bPrompt = false;
	var strFormId=this.xmlDoc.selectSingleNode("//form/@formid").text;
	if (typeof(bIsSaveAs) == "boolean" && bIsSaveAs)
	{
		strFormId=strFormId.toUpperCase();
		bPrompt = !this.isFormIdUnique(strFormId);
	}

	// must also check for unique formid
	if ((strFormId == this.params.getItem("tkn").value+"_CUSTOM" && !this.idVerified) || bPrompt)
	{
		// verify here only if not changed from default or a non-unique saveas
		// (form property page would have checked for uniqueness)
	 	var strPrompt = "Form Id"
		strFormId = top.cmnDlg.prompt(strFormId,strPrompt,window,this.maxLen);
		if (!strFormId) return (false);
		this.idVerified = true;

//--------------------------------------------
//TODO: delete original RD69 record if changed?
//--------------------------------------------
		strFormId=strFormId.toUpperCase();
		var bUnique=this.isFormIdUnique(strFormId)
		if (bUnique == null) return false;
		if ( !bUnique )
		{
			var msg=myDesigner.stringTable.getPhrase("MSG_FORMID_NOT_UNIQUE")+" "+strFormId+
				"\n"+myDesigner.stringTable.getPhrase("MSG_OK_TO_CONTINUE")
	 		if ( top.cmnDlg.messageBox(msg,"okcancel","question",window) == "cancel" )
				return (false);
		}
		var formNode=this.xmlDoc.selectSingleNode("/form")
		if (!formNode) return (false);
		formNode.setAttribute("formid",strFormId)
		this.params.setItem("id",strFormId)
	}
	return (true);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.doPreview=function()
{
	if (!this.xmlDoc) return;

	oPreviewXML.async=false;
	oPreviewXML.loadXML(this.xmlDoc.xml);
	if (oPreviewXML.parseError.errorCode != 0)
	{
		top.displayDOMError(this.xmlDoc.parseError,"preview")
		return;
	}

	oPreviewXML.documentElement.setAttribute("mode","design");
	top.oPreview.URL = top.portalPath+"/forms/prevhost.htm"
	top.oPreview.XMLDocument = oPreviewXML

	if (!top.oPreviewWin || top.oPreviewWin.closed)
	{
		var strFeatures="top=10,left=10,width=900,height=600,resizable=1,scrollbars=1," +
				"status=1,toolbar=0,menubar=0,location=0";
		top.oPreviewWin = top.open(top.portalPath + "/index.htm?PREVIEW","_new", strFeatures)
	}
	else
	{
		top.oPreviewWin.loadPreviewContent()
		top.oPreviewWin.focus()
	}
}

//-----------------------------------------------------------------------------
// signaled by property pane on control metrics (width/height)
// evtObj.extraInfo.ruleVal - contains a value only if min/max is about to be applied
// evtObj.extraInfo.value - contains a the value entered by user
//
// note: the sole purpose of this mechanism is to allow extra columns on selects
// (list control or textbox with hsel attribute) to paint the drop down image.
// here we add the selectAdjust amount so that on the propertychange notification
// we can subtract it out.  when resizing in the editor the drawing is already
// constrained by the rules and we only get the propertychange notification

ActiveDocument.prototype.handleBeforeMetricRuleChange=function(evtObj)
{
	// default the return value to:
	// ruleVal if calculated (new min/max), else the value entered)
	var retVal = (evtObj.extraInfo.ruleVal
			? evtObj.extraInfo.ruleVal
			: evtObj.extraInfo.value);

	// so far we only need to be concerned with the 'sz' property:
	// for select fields we need to allow for (this.selectAdjust) extra column(s)
	if (evtObj.extraInfo.propId != "sz")
		return retVal;

	// get the XML node for this control
	var ctlNode=this.xmlDoc.selectSingleNode("//*[@id='"+evtObj.extraInfo.instId+"']");
	if (!ctlNode) return retVal;

	// text box may be a select or a date: if neither, impose a minimum of 1
	var tp=ctlNode.getAttribute("tp");
	if (!tp) return retVal;
	if (tp.toLowerCase()=="text" && !this.isSelectControl(ctlNode))
	{
		var value=parseInt(evtObj.extraInfo.value,10);
		return (value < 1 ? 1 : value);
	}

	// now that we have eliminated non-select textboxes, 
	// eliminate everything but selects (and dates)
	if (!this.isSelectControl(ctlNode))
		return retVal;

	// date fields can have a size of 4 or 6
	if (ctlNode.getAttribute("ed") == "date")
		retVal = (parseInt(evtObj.extraInfo.value,10) == 4 ? 4 : 6) + this.selectAdjust;
	else
		retVal = evtObj.extraInfo.value + this.selectAdjust;
	return retVal;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.handlePropertyChange=function(evtObj)
{
	var oPropInfo=evtObj.extraInfo;

	for (var i = 0; i < oPropInfo.selectedElements.count; i++)
	{
		var ctlName=oPropInfo.selectedElements.hash[i]
		var ctlNode=this.xmlDoc.selectSingleNode("//*[@id='"+ctlName+"']")
		if (!ctlNode) continue;		// why not?

		// get control object
		var control=this.getControlObject(ctlName)
		var bIsObject = control ? control.getRule("isObject")=="1" : false;

		var mElement=null;
		var bRedraw=false;
		var dataStorage=oPropInfo.selectedElements.item(i)
		var len=(dataStorage ? dataStorage.length : 0);
		for (var j = 0; j < len; j++)
		{
			var attr=dataStorage.children(j).name
			var value=dataStorage.children(j).value

			var prevVal=ctlNode.getAttribute(attr)
			if ((!prevVal && value == "") || (prevVal == value)) continue;

			if (attr != "grp")
				this.setModifiedFlag()

			switch (attr)
			{
			case "top":		case "row":
			case "left":	case "col":
			case "width":	case "sz":
			case "gHeight":	case "gWidth":
			case "height":
				this.evalMetricChange(ctlNode,attr,value);
				break;
			case "id":
				this.handleIdChange(ctlNode,value,prevVal)
				break;
			case "grp":
				this.handleGrpChange(ctlNode,value)
				break;

			default:
				// sometimes 'nm' is simply text and not a data name,
				// how's that for consistency? :-(
				if (attr == "nm" && ctlNode.nodeName == "fld")
				{
					var tp=ctlNode.getAttribute("tp")
					if (tp && tp != "rect" && tp !="label")
						break;
				}

				if (myDoc.evalPropertyRules(ctlNode,attr,value,true))
				{
					bRedraw=true;
					mElement=top.dsPropArea.getElement("btn_"+attr)
					if (mElement) mElement.focus()
					else
					{
						mElement=top.dsPropArea.getElement(attr)
						if (mElement)
						{
							try {
							mElement.focus()
							mElement.select()
							} catch (e) { }
						}
					}
				}
				ctlNode.setAttribute(attr,value)
				break;
			}
		}
		if (bRedraw)
			myDesigner.draw.redrawControl(ctlName,ctlNode)
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.evalPropertyRules=function(ctlNode,attr,value,bUpdate)
{
	var ctlId=ctlNode.getAttribute("id")
	var ctlInst=this.getControlInstance(ctlId)

	// certain property changes require control instance
	// read-only flag and editor rules changes
	switch (ctlNode.nodeName)
	{
	case "form":
		if (attr=="type" || attr=="TITLE")
			// could impact visual appearance, but we won't redraw
			return (false);
		break;

	case "fld":
		// justification not significant for some items (drawn as selects)
		if (attr=="al")
		{
			if (this.isSelectControl(ctlNode))
				return (false);
			var tp=ctlNode.getAttribute("tp")
			if (tp && (tp.toLowerCase()=="text" || tp.toLowerCase()=="out"))
				return (false);
		}
		if (attr=="across")		// only radios have this
			return (true);
		if (attr=="id")
		{
			var tp=ctlNode.getAttribute("tp");
			if (tp && tp.toLowerCase()=="out")
				ctlInst.setRule("nodeTp","Out");
			return (false);
		}
		break;

	case "LINE":
		if (attr=="typ" && value=="horiz")
		{
			ctlInst.propertyBag.setElementROF("height",true)
			ctlInst.propertyBag.setElementROF("width",false)
			ctlInst.setRule("minWidth","10")
			ctlInst.setRule("maxWidth","100")
			ctlInst.setRule("minHeight","1")
			ctlInst.setRule("maxHeight","1")
			if (bUpdate)
			{
				var ht=ctlNode.getAttribute("height")
				var wd=ctlNode.getAttribute("width")
				ctlNode.setAttribute("height",wd)
				ctlInst.set("height",wd)
				ctlNode.setAttribute("width",ht)
				ctlInst.set("width",ht)
			}
		}
		if (attr=="typ" && value=="vert")
		{
			ctlInst.propertyBag.setElementROF("height",false)
			ctlInst.propertyBag.setElementROF("width",true)
			ctlInst.setRule("minWidth","1")
			ctlInst.setRule("maxWidth","1")
			ctlInst.setRule("minHeight","4")
			ctlInst.setRule("maxHeight","100")
			if (bUpdate)
			{
				var ht=ctlNode.getAttribute("height")
				var wd=ctlNode.getAttribute("width")
				ctlNode.setAttribute("height",wd)
				ctlInst.set("height",wd)
				ctlNode.setAttribute("width",ht)
				ctlInst.set("width",ht)
			}
		}
		break;
	}

	return (true);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.isSelectControl=function(ctlNode)
{
	var tp=ctlNode.getAttribute("tp")
	if (!tp) return (false);
	tp = tp.toLowerCase();

	if (tp == "text" && ctlNode.getAttribute("hsel") == "1")
		return (true);
	if (tp == "text" && ctlNode.getAttribute("ed") == "date")
		return (true);
	if (tp == "select"
	&& ( !ctlNode.getAttribute("seltype") || ctlNode.getAttribute("seltype") == "") )
		return (true);
	return (false);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.evalMetricChange=function(ctlNode,attr,value)
{
	// create storage object for updates
	var ds = new top.DataStorage()
	var ctlName=ctlNode.getAttribute("id")

	// check for attribute changes that require special stuff!
	switch (attr)
	{
	case "height":
		ds.add(attr,value)
		myDesign.editor.updateElement(ds,ctlName)
		if (myDesign.active)
			myObject.setReload()

		if (ctlNode.nodeName=="detail")
		{
			// detail height has to account for multi-column rows and header areas
			ctlNode.setAttribute(attr,this.handleDtlHeightChange(ctlNode,value))
			if (myObject.active)
				myDesigner.draw.redrawControl(ctlNode.getAttribute("id"),ctlNode)
		}
		else if (ctlNode.nodeName=="tabregion")
			// tabregion heights are adjusted up by 1 when drawn
			ctlNode.setAttribute(attr,parseInt(value) - 1)
		else
			ctlNode.setAttribute(attr,value)
		break;

	case "top":
	case "row":
		// if top is 0, move to 1 else not visible at runtime
		if (parseInt(value) == 0 && !myObject.active)
		{
			value="1";
			top.dsPropArea.setElementValue(top.dsPropArea.getElement(attr),value);
			var ctlInst=this.getControlInstance(ctlName)
			if (ctlInst) ctlInst.set(attr,value);
		}
		// fall through

	case "left":
	case "col":
		ds.add(attr,value)

		if (myObject.active
		&& ctlNode.nodeName != "detail"
		&& this.xmlDoc.selectSingleNode("/form").getAttribute("targetid") == "detail")
		{
			// we must constrain positioning for elements within a detail area
			value=this.handleDtlPosChange(ctlNode,attr,value)
			ds.setItem(attr,value)
			myObject.editor.updateElement(ds,ctlName)
		}

		myDesign.editor.updateElement(ds,ctlName)
		if (myDesign.active)
			myObject.setReload()
		ctlNode.setAttribute(attr,value)
		break;

	case "sz":
	case "width":
		// set maxsize on data bound controls (if none)
		// (must also exclude dates -- only formatted field without a mxsz?)
		var mxszAtt = ctlNode.getAttribute("mxsz");
		var edAtt = ctlNode.getAttribute("ed");
		
		//don't set mxsz to sz, sz is currently being changed.
		//use the current value instead
		if (this.isDataBoundControl(ctlNode) && !mxszAtt && edAtt != "date")
		{
			ctlNode.setAttribute("mxsz",value);
			ds.add("mxsz",value)
		}

		ds.add(attr,value)
		myDesign.editor.updateElement(ds,ctlName)
		if (myDesign.active)
			myObject.setReload()

		// some width values must be adjusted to allow for use of select elements
		if (this.isSelectControl(ctlNode))
		{
			if (!myDesign.active)
				myDesign.setReload(true);
				
			value = parseInt(value) - this.selectAdjust;
			// date fields can have a size of 4 or 6
			if (edAtt == "date")
			{
				value = (parseInt(value,10) == 4 ? 4 : 6);
				edValue=value+this.selectAdjust;
				myDesigner.draw.redrawControl(ctlName,ctlNode)
			}
			top.dsPropArea.setElementValue(top.dsPropArea.getElement(attr),value);
			var ctlInst=this.getControlInstance(ctlName)
			if (ctlInst) ctlInst.set(attr,value);
		}
		ctlNode.setAttribute(attr,value)
		break;

	case "gHeight":		// form node only
	case "gWidth":
		ds.add(attr,value)
		myDesign.editor.updateElement(ds,ctlName)
		myObject.setReload()
		ctlNode.setAttribute(attr,value)
		var gHeight=ctlNode.getAttribute("gHeight") ? ctlNode.getAttribute("gHeight") : "24"
		var gWidth=ctlNode.getAttribute("gWidth") ? ctlNode.getAttribute("gWidth") : "10"
		myDesign.editor.setGrid(gHeight,gWidth,(parseInt(gHeight)*0.1))
		myObject.editor.setGrid(gHeight,gWidth,(parseInt(gHeight)*0.1))
		myDesign.setReload();
		myDesign.setContent();
		this.selectControlInstance("form1")
		myDesign.editor.cwDoc.getElementById("form1").focus()
		break;
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.handleDtlPosChange=function(ctlNode,attr,value)
{
	var retVal=value		// default return value to current value
	var hdrsize=parseInt(ctlNode.parentNode.getAttribute("hdrsize"))
	var rowspan=parseInt(ctlNode.parentNode.getAttribute("rowspan"))

	if (attr == "top" || attr == "row")
	{
		if (ctlNode.getAttribute("dtlhdr") == "1")
		{
			// must stay within header
			if (value > (hdrsize-1))
				retVal = (hdrsize-1)	// last row of header
		}
		else
		{
			// must stay within body
			if (value > (hdrsize+rowspan-1))
				retVal = hdrsize		// first row of body
			else if (value < hdrsize)
				retVal = hdrsize
		}
	}
	else if (attr == "left" || attr == "col")
	{
		if (ctlNode.getAttribute("dtlhdr") != "1")
		{
			// must stay within body
			var size=parseInt(ctlNode.getAttribute("sz"))
			var width = ctlNode.parentNode.getAttribute("width") ?
				ctlNode.parentNode.getAttribute("width") : 80;
			if ((value+size) > (width/this.dtlCols))
				retVal = ((width/this.dtlCols)-(size+2))	// fit on end of detail
		}
	}

	// if value is changed, we must update control instance and properties pane
	if (value != retVal)
	{
		var ctlInst=this.getControlInstance(ctlNode.getAttribute("id"))
		if (ctlInst)
		{
			ctlInst.set(attr,retVal);
			var elem=top.dsPropArea.getElement(attr);
			if (elem) elem.value=retVal;
		}
	}
	return (retVal);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.handleDtlHeightChange=function(ctlNode,value)
{
	var newHeight=parseInt(value)
	var dtlElement=myDesign.editor.cwDoc.getElementById(ctlNode.getAttribute("id"))
	var curHeight=parseInt(dtlElement ?
			dtlElement.getAttribute("curHeight") : ctlNode.getAttribute("height"));
	if (dtlElement) dtlElement.setAttribute("curHeight",value)

	var hdrSize=parseInt(ctlNode.getAttribute("hdrsize") ? ctlNode.getAttribute("hdrsize") : 1);
	var rowNodes=ctlNode.selectNodes("./row[@row]")
	var len = rowNodes ? rowNodes.length : 0;

	if (newHeight < curHeight)
	{
		// height is decreasing
		var rowNbr=parseInt(newHeight-hdrSize)
		for (var i = len-1; i > -1; i--)
		{
			if (rowNodes[i].getAttribute("row") > rowNbr)
				rowNodes[i].parentNode.removeChild(rowNodes[i])
			else if (rowNodes[i].getAttribute("row") == rowNbr)
			{
				newHeight=parseInt(rowNodes[i].getAttribute("rowID")) + 1
				break;
			}
		}
	}
	else
	{
		// height is increasing
		var lastRowNbr=parseInt(value-hdrSize)
		var firstCol=parseInt(rowNodes[0].getAttribute("col"));
		var lastRow=rowNodes[len-1];
		var rowID = parseInt(lastRow.getAttribute("rowID"));
		var rowNbr = parseInt(lastRow.getAttribute("row"));
		var colNbr = parseInt(lastRow.getAttribute("col"));
		var dtlWidth = parseInt(ctlNode.getAttribute("width") ? ctlNode.getAttribute("width") : 80);
		var colWidth = (dtlWidth/this.dtlCols)-1
		var nextNbrId = parseInt(lastRow.getAttribute("nbr").substr(2))

		// insert no more than max rows, up to size that fits new height
		while ( rowID < (this.maxDtlRows-1) )
		{
			rowID++;
			if (this.dtlCols==1) rowNbr++
			else
			{
				var curCol=(rowID % this.dtlCols)
				if (curCol == 0)
				{
					colNbr=firstCol;
					rowNbr++
				}
				else
					colNbr += colWidth;
			}

			if ((rowNbr+hdrSize) > newHeight)
			{
				rowID--
				break;
			}

			var newRow=lastRow.cloneNode(true)
			ctlNode.appendChild(newRow);

			newRow.setAttribute("rowID",rowID)
			newRow.setAttribute("id","row"+(rowID+1))
			newRow.setAttribute("row",rowNbr)
			newRow.setAttribute("col",colNbr)
			nextNbrId++
			newRow.setAttribute("nbr","_l"+nextNbrId)
		}
		// convert new height to number of rows
		newHeight=rowID+1;
	}

	// update rows attribute and return new height
	ctlNode.setAttribute("rows",newHeight)
	return (newHeight);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.handleIdChange=function(ctlNode,value,prevVal)
{
	// force the id to lowercase
	value=value.toLowerCase();

	// see if the id is already assigned
	if (this.xmlDoc.selectSingleNode("//*[@id='"+value+"']"))
	{
		var texBox=top.dsPropArea.getElement("id")
		if (texBox)
		{
			texBox.value=prevVal
			texBox.focus()
			texBox.select()
		}
		var msg=myDesigner.stringTable.getPhrase("MSG_DUPLICATE_ID_NOT_ALLOWED")
		top.cmnDlg.messageBox(msg,"ok","alert")
		return;
	}

	this.updateInstanceId(prevVal,value)
	ctlNode.setAttribute("id",value)
	var mElement=myDesign.editor.cwDoc.getElementById(prevVal)
	if (mElement)
		mElement.setAttribute("id",value)
	myObject.setReload()
	if (myObject.objNode)
	{
		if (myObject.getBaseElement()==prevVal)
			myObject.setBaseElement(value)
		if (myObject.getTargetElement()==prevVal)
			myObject.setTargetElement(value)
	}
	if (myObject.active)
		myObject.setContent()
	this.selectControlInstance(value)
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.handleGrpChange=function(ctlNode,value)
{
	// tab change
	ctlNode.setAttribute("grp",value)

	myObject.setReload()
	if (!myObject.getObjNode()
	|| (myObject.getObjNode().getAttribute("id") == 
			this.xmlDoc.selectSingleNode("//tab[@id='"+value+"']").parentNode.getAttribute("id")))
		myObject.setTargetElement(value)
	if (myObject.active)
		myObject.setContent()

	myDesign.editor.deleteElement(ctlNode.getAttribute("id"))
	window.status="Rebuilding design view..."
	this.readyState="loading"
	var formNode=this.xmlDoc.selectSingleNode("/form")
	var saveMode=formNode.getAttribute("objmode")
	formNode.setAttribute("objmode","0")
	var parId = (ctlNode.parentNode.nodeName == "detail") ?
		ctlNode.parentNode.parentNode.getAttribute("id") :
		ctlNode.parentNode.getAttribute("id");
	this.paintControlFromNode(myDesign.editor, ctlNode, parId, true)
	var childNode=ctlNode.selectSingleNode("./tab[@id='"+value+"']")
	if (childNode)
		this.paintControlFromNode(myDesign.editor, childNode, ctlNode.getAttribute("id"), false)
	formNode.setAttribute("objmode",saveMode)
	this.readyState="complete"
	window.status=""
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.handleDataNmBrowse=function(ctlNode)
{
	// open data source dialog
	var ctlId=ctlNode.getAttribute("id");
	var curVal=ctlNode.getAttribute("nm") ? ctlNode.getAttribute("nm") : "";
	var strFeatures="dialogHeight:420px;dialogWidth:280px;" +
		"dialogTop:px;dialogLeft:px;center:yes;help:no;scroll:no;status:no;";
	var dlgArgs = new Array();
	dlgArgs[0] = top;
	dlgArgs[1] = curVal
	dlgArgs[2] = myDesigner.source;
	if (myDesign.active)
		dlgArgs[3] = myDesign.editor.cwDoc.getElementById(ctlId);
	else
		dlgArgs[3] = myObject.editor.cwDoc.getElementById(ctlId);
	dlgArgs[4] = this.dsm.getAvailableDOM(ctlNode)
	var retVal = window.showModalDialog(top.studioPath+"/uidesigner/dialogs/datafld.htm", dlgArgs, strFeatures);

	// new data field selection?
	if (typeof(retVal) == "undefined" || retVal == curVal)
		return;

	this.setModifiedFlag()
	var value=retVal
	if (value == "")
		this.unbindField(ctlNode)
	else
	{
		var pos=value.indexOf("/")
		var fldnbr=retVal.substr(0,pos)
		value=retVal.substr(pos+1)
		var fNode=this.xmlDoc.selectSingleNode("//*[@nbr='"+fldnbr+"']")
		if (fNode)
		{
			var curId=ctlNode.getAttribute("id")
			ctlNode.setAttribute("id","hidden"+this.getUniqueID("Hidden","fld"))
			fNode.setAttribute("id",curId)

			this.changeFieldDataBind(ctlNode,fNode)
			
			// before making field nbr unavailable for selection, we must return current field nbr to the data source pool
			// get available data sources from data source manager
			root = this.dsm.getAvailableDOM(ctlNode)
			//check if the current field nbr is still available in pool
			var isPresent = false;
			for (i = 0; i < root.documentElement.childNodes.length; i++)
			{
				if (ctlNode.getAttribute("nm") == root.documentElement.childNodes.item(i).getAttribute("nm"))
				{
					isPresent = true;
					break;
				}
			}
			// if current field nbr is not in pool, add it up
			if (!isPresent)
				this.dsm.add(ctlNode)
			
			
			ctlNode=fNode
			// make field nbr unavailable for selection
			this.dsm.remove(ctlNode);
		}
	}

	// set and display the latest control property values
	this.setControlInstanceProperties(this.activeControl,ctlNode,false)
	top.dsPropArea.showIdProperties(ctlId)
	myDesigner.draw.redrawControl(ctlNode.getAttribute("id"),ctlNode)
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.handlePropertyBrowse=function(evtObj)
{
	if (!evtObj || !evtObj.extraInfo) return;

	var oPropInfo=evtObj.extraInfo;
	var ctlId=oPropInfo.getItem("ctlName").value
	var propName=oPropInfo.getItem("propName").value
	var ctlNode=this.xmlDoc.selectSingleNode("//*[@id='"+ctlId+"']")

	switch (propName)
	{
	case "color":
		var curColor = ctlNode.getAttribute(propName) ? ctlNode.getAttribute(propName) : "000000"
		var newColor=top.cmnDlg.colorPicker(curColor,window)
		if (newColor && (newColor != curColor))
		{
			this.setModifiedFlag()
			newColor = "#"+newColor
			top.dsPropArea.updateBrowseValue(ctlId, propName, newColor)
			top.dsPropArea.getElement(propName).focus()
			top.dsPropArea.getElement(propName).select()
		}
		else
			top.dsPropArea.getElement("btn_"+propName).focus()
		break;

	case "font":
		var strFont=ctlNode.getAttribute(propName) ? ctlNode.getAttribute(propName) : ""
		var fontDS = new top.DataStorage();
		if (strFont.length)
		{
			var props=strFont.split(";")
			for (var i = 0; i < props.length; i++)
			{
				var valPairs=props[i].split(":")
				fontDS.add(valPairs[0].substr(5),valPairs[1])	// strip 'font-'
			}
		}
		fontDS=top.cmnDlg.fontPicker(fontDS,window);
		if (fontDS)
		{
			this.setModifiedFlag()
			var newFont="font-family:"+fontDS.getItem("family").value+";"
			newFont+="font-style:"+fontDS.getItem("style").value+";"
			newFont+="font-size:"+fontDS.getItem("size").value+";"
			newFont+="font-weight:"+fontDS.getItem("weight").value+";"
			top.dsPropArea.updateBrowseValue(ctlId, propName, newFont)
			top.dsPropArea.getElement(propName).focus()
			top.dsPropArea.getElement(propName).select()
		}
		else
			top.dsPropArea.getElement("btn_"+propName).focus()
		break;

	case "src":
		// image src
		var strSrc=ctlNode.getAttribute(propName) ? ctlNode.getAttribute(propName) : ""
		strSrc=top.cmnDlg.selectImage(strSrc,null,window);
		if (strSrc)
		{
			this.setModifiedFlag()
			top.dsPropArea.updateBrowseValue(ctlId, propName, strSrc)
		}
		top.dsPropArea.getElement("btn_"+propName).focus()
		break;

	case "nm":
		var control=this.getControlObject(ctlId)
		if (control && control.getRule("allowDataBind")=="1")
		{
			this.handleDataNmBrowse(ctlNode)
			break;
		}
		// note: fall through for label, line, rectangle text
		// this is UGLY! nm should not be data name in some cases, text in others

	case "btnnm":		// button text
	case "label":		// checkbox text
	case "tooltip":		// tooltip text
	case "TITLE":		// form title
		var strText=ctlNode.getAttribute(propName) ? ctlNode.getAttribute(propName) : "";
		var strPrompt = top.dsPropArea.getElement("lbl_"+propName).innerText;
		if (propName=="btnnm")
			strPrompt="Button Text"
		var newText = top.cmnDlg.prompt(strText,strPrompt,window);
		if ( newText && newText !="" )
		{
			if ((this.activeControl.get("nm")!==null || this.activeControl.get("nm")!="") 
				&&  this.isDataBoundControl(ctlNode) && propName=="btnnm")
			{
				var size = (ctlNode.getAttribute("mxsz") ? ctlNode.getAttribute("mxsz") : ctlNode.getAttribute("sz"))
				if(newText.length > size)	//jai
				{
					var msg="Button text must be less that "+(parseInt(ctlNode.getAttribute("sz"),10)+1)+" characters.\n\n";
					top.cmnDlg.messageBox(msg,"ok","alert");
					return;
				}
			}			
			this.setModifiedFlag()
			top.dsPropArea.updateBrowseValue(ctlId, propName, newText)
			top.dsPropArea.getElement("btn_"+propName).focus()
			if (propName=="TITLE")
				this.setTitle()
		}
		break;
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.handlePropertyPageReturn=function(evtObj)
{
	if (!evtObj || !evtObj.extraInfo) return;

	var oPropInfo=evtObj.extraInfo;
	var ctlName=oPropInfo.selectedElements.hash[0]
	var ctlNode=this.xmlDoc.selectSingleNode("//*[@id='"+ctlName+"']")
	if (!ctlNode) return;

	var returnVal = oPropInfo.selectedElements.elements[ctlName].children(0).value
	if (returnVal)
	{
		myDesigner.draw.redrawControl(ctlName,ctlNode)
		myDoc.selectControlInstance(ctlName)

		// text box size may have been altered
		if (ctlNode.getAttribute("tp") == "Text")
		{
			top.dsPropArea.updateBrowseValue(ctlNode.getAttribute("id"),
					"sz", ctlNode.getAttribute("sz"))
		}
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.handlePropertyAreaPainted=function(evtObj)
{
	if (!evtObj || !evtObj.extraInfo) return;

	// must force lowercase on all element names
	var nameElem=top.dsPropArea.getElement("id");
	if (nameElem)
		nameElem.style.textTransform = "lowercase";

	var oPropInfo=evtObj.extraInfo;
	var ctlName=oPropInfo.ctlInstId;
	var ctlNode=this.xmlDoc.selectSingleNode("//*[@id='"+ctlName+"']")
	if (!ctlNode) return;

	if ( ctlNode.nodeName == "push" && this.dsm.getAvailableDOM(ctlNode) == null)
	{
		var btn = top.dsPropArea.getElement("btn_nm");
		var text = top.dsPropArea.getElement("nm");
		if (btn) 
			btn.disabled = true;
		if (text) 
			text.value = myDesigner.stringTable.getPhrase("lblNone");			
	}
	
	// disable defval for certain batch token fields
	if (this.xmlDoc.documentElement.getAttribute("typ")=="b")
	{
		if (ctlNode.getAttribute("nm")=="USER-NAME"
		|| ctlNode.getAttribute("nm")=="LONG-NAME"
		|| ctlNode.getAttribute("nm")=="PRODUCT-LINE")
		{
			var btnDefVal=top.dsPropArea.getElement("btn_defval")
			if (btnDefVal) btnDefVal.disabled=true;
			var txtDefVal=top.dsPropArea.getElement("defval")
			if (txtDefVal) txtDefVal.disabled=true;
		}
	}

	var control=this.getControlObject(ctlName)
	if (!control || control.getRule("isObject")!="1")
	{
		var elem=myDesigner.workSpace.editor.cwDoc.getElementById(ctlName)
		if (!elem) return
		if (elem.getAttribute("isObject")!="1")
			return;
	}

	if (control.id!="tabregion")
		return;

	var grpName=oPropInfo.propertyBag.getElement("grp")
	var selGroup=top.dsPropArea.getElement("grp")
	var len=ctlNode.childNodes.length
	var selIndex = -1
	for (var i = 0; i < len; i++)
	{
		var grpNode=ctlNode.childNodes(i)
		if (grpNode.getAttribute("tp") == "Hidden")
			continue;
					
		var oOption = top.dsPropArea.document.createElement("option")
		oOption.value=grpNode.getAttribute("id")
		oOption.text=grpNode.getAttribute("id")
		if (grpNode.getAttribute("nm"))
			oOption.text=grpNode.getAttribute("nm")
		if (oOption.value==grpName)
			selIndex=i
		selGroup.add(oOption)
	}
	selGroup.selectedIndex = selIndex == -1 ? 0 : selIndex ;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.editTabOrder=function()
{
 	var frmArgs = new Array()
 	frmArgs[0]=top
 	frmArgs[1]=myDesigner.source
	if (myObject.active)
	 	frmArgs[2]=this.xmlDoc.selectSingleNode("/form//*[@id='"+
	 			myObject.getTargetElement()+"']")
	else
	 	frmArgs[2]=this.xmlDoc.selectSingleNode("/form")

	var bMod = showModalDialog(top.studioPath+"/uidesigner/dialogs/taborder.htm", frmArgs,
		"dialogHeight:340px;dialogWidth:300px;center:yes;help:no;scroll:no;status:no;")
	if (bMod)
		this.setModifiedFlag(true)
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.changeZOrder=function(dir)
{
	var mElement=null
	if (myDesign.active)
		mElement=myDesign.editor.selectedElements.item(0)
	else if (myObject.active)
		mElement=myObject.editor.selectedElements.item(0)
	if (!mElement) return;

	mElement.style.zIndex=dir*100
}
