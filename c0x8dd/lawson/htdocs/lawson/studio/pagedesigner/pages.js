/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/pagedesigner/pages.js,v 1.13.2.10.4.6.6.1.8.4 2012/08/08 12:48:53 jomeli Exp $NoKeywords: $ */
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
var oPreviewXML=null;

function pageInit()
{
	top.designStudio.loadDesignerComplete();
}

ActiveDocument.prototype = new top.DefaultDocument();
ActiveDocument.prototype.constructor = ActiveDocument;
ActiveDocument.superclass = top.DefaultDocument.prototype;
function ActiveDocument()
{
	ActiveDocument.superclass.initialize.call(this);
	this.mainHost = "portalpage";
	this.pageXML = top.xmlFactory.createInstance("DOM");
	this.pageXMLOrigCopy = top.xmlFactory.createInstance("DOM");
}
ActiveDocument.prototype.getPageXML=function()
{
	return this.pageXML;
}
ActiveDocument.prototype.setPageXML=function(strXML)
{
	this.pageXML.loadXML(strXML);
	if(this.pageXML.parseError.errorCode != 0)
	{
		top.displayDOMError(this.pageXML.parseError);
		return null;
	}
}
ActiveDocument.prototype.getPageXMLOrigCopy=function()
{
	return this.pageXMLOrigCopy;
}
ActiveDocument.prototype.setPageXMLOrigCopy=function(strXML)
{
	this.pageXMLOrigCopy.loadXML(strXML);
	if(this.pageXMLOrigCopy.parseError.errorCode != 0)
	{
		top.displayDOMError(this.pageXMLOrigCopy.parseError);
		return null;
	}
}
ActiveDocument.prototype.createControlInstance=function(ctlId, propbag, bDraw)
{
	if(!propbag)propbag = new top.DataStorage();
	var id = propbag.getItem("id");
	if(!id || id.value == "")
	{
		// Assign a id to it
        var strId = this.createUniqueId(ctlId);
		if(!id)
			propbag.add("id", strId);
		else
			propbag.setItem("id", strId);
	}
	var ctlInst = ActiveDocument.superclass.createControlInstance.call(this, ctlId, propbag, bDraw);
	return ctlInst;
}
ActiveDocument.prototype.createUniqueId=function(ctlId)
{
    var nodes = this.pageXML.selectNodes("//"+ctlId.toUpperCase());
    var i = nodes.length;
    var id = ctlId + i;
    while (true)
    {
        var item = this.getControlInstance(id);
        if(item)
            id = ctlId + (i++);
        else
            break;
    }
    return id;
}
ActiveDocument.prototype.loadDocument=function()
{
	this.readyState = "loading";
	var navlets = this.pageXML.selectSingleNode("//NAVLETS").childNodes;
	var len = navlets.length;
	var node, ctlInst;
	
	var oTravNode = this.pageXML.selectSingleNode("//TRAVLETTE");
	var pageTitle = oTravNode.getAttribute("TITLE");
	var pageVersion = oTravNode.getAttribute("version");
	var pageWidth = oTravNode.getAttribute("width");
	var pageHeight = oTravNode.getAttribute("height");
	var oCtl = this.getControlInstance("portalpage");
	oCtl.set("title_str",pageTitle);
	oCtl.set("version",pageVersion);
	oCtl.set("width",pageWidth);
	oCtl.set("height",pageHeight);
	
	for(var i=0; i<len; i++)
	{
		node = navlets[i];
		ctlInst = this.createCtlInstFromNode(node);
	}
	var nugglets = this.pageXML.selectSingleNode("//NUGGLETS").childNodes;
	var len = nugglets.length;
	var node, ctlInst;
	for(var i=0; i<len; i++)
	{
		node = nugglets[i];
		ctlInst = this.createCtlInstFromNode(node);
	}

	this.readyState = "complete";
	var activeId=(this.activeControl)?this.activeControl.id:this.mainHost;
	this.selectControlInstance(activeId)
}
ActiveDocument.prototype.reloadDocument=function()
{
	var desWorkSpace = top.designStudio.activeDesigner.workSpace;
	var editor = desWorkSpace.editors.item("design");
	editor.cwDoc.getElementById("portalpage").innerHTML="";
	editor.cwDoc.getElementById("leftbar").innerHTML="";
	this.commandHistory.removeAll();
	top.dsPropArea.removeAllIds();
	top.dsPropArea.addId(this.mainHost);
	var i, len=this.controls.count;
	for(i=len-1; i>=0; i--)
	{
		if(this.controls.item(i).id == this.mainHost)continue;
		this.controls.remove(this.controls.item(i).id);
	}
	this.loadDocument()

	if (desWorkSpace.view != "design")
		desWorkSpace.switchView("design");
}
ActiveDocument.prototype.handleLoadFailure=function()
{
	var editor = top.designStudio.activeDesigner.workSpace.editors.item("design");
	var page = editor.cwDoc.getElementById(this.mainHost);
	if(page)page.setAttribute("isSelectable", "0");

	top.dsToolBox.disableToolbox();
	top.dsPropArea.disablePA();
	this.setModifiedFlag(false);
	var view = top.designStudio.activeDesigner.workSpace.views.item("source");
	view.enableView(false);
	view = top.designStudio.activeDesigner.workSpace.views.item("script");
	view.enableView(false);

	var msg = top.designStudio.activeDesigner.stringTable.getPhrase("MSG_LOAD_FAILURE");
	top.cmnDlg.messageBox(msg,"ok","stop");
	window.status = "";
}
ActiveDocument.prototype.createCtlInstFromNode=function(node)
{
	var node, ctl, ctlInst, ctlId, name, value, len2;
	if(node.documentElement)node = node.documentElement;
	ctlId = node.nodeName.toLowerCase();
	if(ctlId == "travlette")ctlId="composite";
	// Get all the attributes and define a property bag
	var ds = new top.DataStorage();
	ctl = top.designStudio.activeDesigner.toolBox.getControlObject(ctlId);
	if(!ctl)return;
	len2 = ctl.properties.count;
	for (var j=0; j<len2; j++)
	{
		name = ctl.properties.item(j).id;
		value = node.getAttribute(name);
		if(!value)
		{
			value = ctl.properties.item(j).init;
			node.setAttribute(name, value);
		}
		ds.add(name, value);
	}
	// Construct the instance and draw
	ctlInst = this.createControlInstance(ctlId, ds, true);
	// And add the properties
	this.getNodeData(ctlInst, node);
	ctlInst.setModifiedFlag(false);
	return ctlInst;
}
ActiveDocument.prototype.getNodeData=function(ctlInst, nodeXml)
{
	var ctlId = nodeXml.nodeName;
	switch(ctlId)
	{
		case "DATA":
			this.getNodeDataDME(ctlInst, nodeXml);
			break;
		case "AGS":
			this.getNodeDataAGS(ctlInst, nodeXml);
			break;
		case "IDA":
			this.getNodeDataIDA(ctlInst, nodeXml);
			break;
		case "TEXT":
			this.getNodeDataText(ctlInst, nodeXml);
			break;
		case "RSS":
		case "IMAGE":
		case "HTM":
			this.getNodeDataUrl(ctlInst, nodeXml);
			break;
		case "MENU":
		case "TRANSFER":
		case "USER":
			this.getNodeDataMenu(ctlInst, nodeXml);
			break;
	}
}
ActiveDocument.prototype.setNodeData=function(ctlInst)
{
	if(this.readyState != "complete")return;

	var ctlId = ctlInst.ctlId.toUpperCase()
	var node = this.pageXML.selectSingleNode("//"+ctlId + "[@id='" +ctlInst.id+"']");
	var i, len, name, value;
	if(!node)
	{
		var newNode = this.pageXML.createElement(ctlId);
		len = ctlInst.propertyBag.elements.length;
		for(i=0; i<len; i++)
		{
			name = ctlInst.propertyBag.elements.children(i).name;
			value = ctlInst.propertyBag.elements.children(i).value;
			newNode.setAttribute(name, value);
		}
		var parNode = (ctlId == "MENU" || ctlId == "TRANSFER" || ctlId == "USER") ?
						this.pageXML.selectSingleNode("//NAVLETS") :
						this.pageXML.selectSingleNode("//NUGGLETS")

		parNode.appendChild(newNode);
		if(this.readyState == "complete" && (ctlId != "TEXT" && ctlId != "IMAGE" && ctlId != "FORMLET"))
		{
			var elmNode = this.pageXML.selectSingleNode("//DATASRC/ELEMENT[@id='"+ctlInst.id+"URL']");
			if(!elmNode)
			{
				parNode = this.pageXML.selectSingleNode("//DATASRC");
				var newNode = this.pageXML.createElement("ELEMENT");
				newNode.setAttribute("id", ctlInst.id+"URL");
				parNode.appendChild(newNode);
			}
			else
				elmNode.setAttribute("id", ctlInst.id+"URL");
		}
	}
}
ActiveDocument.prototype.getNodeDataDME=function(ctlInst, nodeXml)
{
	var table = ctlInst.getObject("table");
	var tableNode = nodeXml.selectSingleNode("./TABLE");
	if(tableNode)
	{
		table.header = tableNode.getAttribute("header");
		table.state = "initialized";
	}

	var link = ctlInst.getObject("link");
	var linkNode = nodeXml.selectSingleNode("./LINK");
	if(linkNode)
	{
		link.type = linkNode.getAttribute("type");
		link.tkn = linkNode.getAttribute("tkn");
		link.desc = linkNode.getAttribute("desc");
		link.state = "initialized";
	}

	var graphStyle = ctlInst.getObject("graphStyle");
	var graphNode = nodeXml.selectSingleNode("./GRAPHSTYLE");
	if(graphNode)
	{
		graphStyle.font = graphNode.getAttribute("font");
		graphStyle.size = graphNode.getAttribute("size");
		graphStyle.color = graphNode.getAttribute("color");
		graphStyle.state = "initialized";
	}

	var fields = ctlInst.getObject("fields");
	var fNode = nodeXml.selectSingleNode(".//FIELDS");
	if(fNode)
	{
		fields.font = chkValue(fNode.getAttribute("font"), "Arial");
		fields.size = chkValue(fNode.getAttribute("size"), "8pt");
		fields.color = chkValue(fNode.getAttribute("color"), "black");
		fields.addtorow = chkValue(fNode.getAttribute("addtorow"), "none");
		fields.btnlabel = chkValue(fNode.getAttribute("btnlabel"), "");
		fields.btnvalue = chkValue(fNode.getAttribute("btnvalue"), "");

		fields.coll = new top.LawCollection();
		var fieldNodes = fNode.childNodes;
		var node, i, len = fieldNodes.length;
		for(i=0; i<len; i++)
		{
			node = fieldNodes[i];
			var field = new Object();
			field.name = node.getAttribute("name");
			field.caption = node.getAttribute("heading");
			field.hdralign = chkValue(node.getAttribute("hdralign"), "2");
			field.align = node.getAttribute("align");
			field.hdrwrap = chkValue(node.getAttribute("hdrwrap"), "y");
			field.wrap = chkValue(node.getAttribute("wrap"), "y");
			field.sortorder = node.getAttribute("sortorder");
			field.rtsort = node.getAttribute("rtsort");
			field.drill = node.getAttribute("drill");
			field.hide = node.getAttribute("hide");
			field.tooltip = chkValue(node.getAttribute("tooltip"), "");
			field.hdrtooltip = chkValue(node.getAttribute("hdrtooltip"), "");
			fields.coll.add(field.name, field);
		}
		fields.state = "initialized";
	}

	var index = ctlInst.getObject("index");
	var indexNode = nodeXml.selectSingleNode("./INDEX");
	if(indexNode)
	{
		index.name = indexNode.getAttribute("name");
		index.keys = new top.LawCollection();
		len = indexNode.childNodes.length;
		for (i=0; i<len; i++)
		{
			node = indexNode.childNodes[i];
			var key = new Object();
			key.name = node.getAttribute("name");
			key.value = node.getAttribute("value");
			key.refresh = node.getAttribute("rtupdate");
			key.type = node.getAttribute("type");
			key.size = node.getAttribute("size");
			key.caption = node.getAttribute("label");
			key.readonly = node.getAttribute("readonly");
			key.hide = node.getAttribute("hide");
			index.keys.add(key.name, key);
		}
		index.state = "initialized";
	}

	var cond = ctlInst.getObject("conditions");
	cond.coll = new top.LawCollection();
	var condNode = nodeXml.selectSingleNode("./CONDITIONS");
	if(condNode)
	{
		len = condNode.childNodes.length;
		for(i=0; i<len; i++)
		{
			node = condNode.childNodes[i];
			var cond1 = new Object();
			cond1.name = node.getAttribute("name");
			cond1.selected = node.getAttribute("selected");
			cond1.caption = node.getAttribute("label");
			cond1.hide = node.getAttribute("hide");
			cond.coll.add(cond1.name, cond1);
		}
		cond.state = "initialized";
	}

	var criteria = ctlInst.getObject("criteria");
	var crNode = nodeXml.selectSingleNode("./CRITERIA")
	if(crNode)
	{
		criteria.criteria = crNode.text;
		criteria.state = "initialized";
	}
}
ActiveDocument.prototype.getNodeDataIDA=function(ctlInst, nodeXml)
{
	var keys = ctlInst.getObject("keys");
	keys.coll = new top.LawCollection();
	var keyNodes = nodeXml.selectNodes(".//KEY");
	var i, len=keyNodes.length;
	for(i=0; i<len; i++)
	{
		var key = new Object();
		key.keynum = keyNodes[i].getAttribute("keynum");
		key.name = keyNodes[i].getAttribute("name");
		key.value = keyNodes[i].text;
		key.refresh = keyNodes[i].getAttribute("refresh");
		keys.coll.add(key.name, key);
	}
	keys.state = "initialized";
}
ActiveDocument.prototype.getNodeDataAGS=function(ctlInst, nodeXml)
{
	var bGraph = (ctlInst.get("xsl") == "agstable.xsl")?false:true;
	if(bGraph)
	{
		ctlInst.getObject("charttitle").text = (nodeXml.selectSingleNode("./CHARTTITLE"))?nodeXml.selectSingleNode("./CHARTTITLE").text:"";
		ctlInst.getObject("categorytitle").text = (nodeXml.selectSingleNode("./CATEGORYTITLE"))?nodeXml.selectSingleNode("./CATEGORYTITLE").text:"";
		ctlInst.getObject("valuetitle").text = (nodeXml.selectSingleNode("./VALUETITLE"))?nodeXml.selectSingleNode("./VALUETITLE").text:"";

		var fields = ctlInst.getObject("fields");
		fields.coll = new top.LawCollection();
		var fldNodes = nodeXml.selectNodes(".//FIELDS/FIELD");
		var i, len=fldNodes.length;
		for(i=0; i<len; i++)
		{
			var fld = new Object();
			fld.name = fldNodes[i].getAttribute("name");
			fld.value = fldNodes[i].text;
			fld.refresh = chkValue(fldNodes[i].getAttribute("refresh"), "y");
			fields.coll.add(fld.name, fld);
		}
		fields.state = "initialized";

		var dps = ctlInst.getObject("datapoints");
		dps.coll = new top.LawCollection();
		var dpNodes = nodeXml.selectNodes(".//DATAPOINTS/DP");
		len = dpNodes.length;
		for(i=0; i<len; i++)
		{
			var dp = new Object();
			dp.id = dpNodes[i].getAttribute("id");
			dp.det = dpNodes[i].getAttribute("det");
			dp.height = dpNodes[i].getAttribute("height");
			dp.label = dpNodes[i].childNodes[0].getAttribute("val");
			dp.value = dpNodes[i].childNodes[1].getAttribute("val");
			dps.coll.add(dp.id, dp);
		}
		dps.state = "initialized";
	}
	else
	{
		var fields = ctlInst.getObject("fields");
		fields.coll = new top.LawCollection();
		var fldNodes = nodeXml.selectNodes(".//INPFIELDS/INPFIELD");
		var i, len=fldNodes.length;
		for(i=0; i<len; i++)
		{
			var fld = new Object();
			fld.name = fldNodes[i].getAttribute("name");
			fld.value = fldNodes[i].text;
			fld.refresh = chkValue(fldNodes[i].getAttribute("refresh"), "y");
			fields.coll.add(fld.name, fld);
		}
		fields.state = "initialized";

		var tblfields = ctlInst.getObject("agstable");
		tblfields.coll = new top.LawCollection();
		var tblNodes = nodeXml.selectNodes(".//FIELDS/FIELD");
		len = tblNodes.length;
		for(i=0; i<len; i++)
		{
			var fld = new Object();
			fld.id = tblNodes[i].getAttribute("id");
			fld.name = tblNodes[i].getAttribute("name");
			fld.heading = tblNodes[i].getAttribute("heading");
			fld.align = tblNodes[i].getAttribute("align");
			fld.type = tblNodes[i].getAttribute("type");
			fld.sort = tblNodes[i].getAttribute("sort");
			fld.drill = tblNodes[i].getAttribute("drill");
			fld.hide = tblNodes[i].getAttribute("hide");
			tblfields.coll.add(fld.id, fld);
		}
		tblfields.state = "initialized";
	}
}
ActiveDocument.prototype.getNodeDataText=function(ctlInst, nodeXml)
{
	var textContent = ctlInst.getObject("textcontent");
	var contentNode = nodeXml.selectSingleNode("./textarea");
	if(!contentNode)return;
	textContent.content = new Object();
	textContent.content.text = contentNode.text;
	textContent.content.style = new Object();
	textContent.content.style.font = contentNode.getAttribute("fontfamily");
	if(!textContent.content.style.font)textContent.content.style.font="tahoma";
	textContent.content.style.size = contentNode.getAttribute("fontsize");
	if(!textContent.content.style.size)textContent.content.style.size="8pt";
	textContent.content.style.bold = contentNode.getAttribute("bold");
	textContent.content.style.italic = contentNode.getAttribute("ital");
	textContent.content.style.underline = contentNode.getAttribute("uline");
	textContent.content.style.align = contentNode.getAttribute("align");
	textContent.content.style.bgcolor= contentNode.getAttribute("bgcolor");
	textContent.content.style.color = contentNode.getAttribute("color");
	textContent.state  = "initialized";
}
ActiveDocument.prototype.getNodeDataUrl=function(ctlInst, nodeXml)
{
	var urlNode = nodeXml.selectSingleNode("./URL");
	if(urlNode)
	{
		var strUrl = urlNode.text;
		var objUrl = ctlInst.getObject("url");
		objUrl.url = strUrl;
		objUrl.state = "initialized";
	}

	var datasrc = ctlInst.getObject("datasrc");
	datasrc.datasrc = new top.LawCollection();
	var tranNode = nodeXml.selectSingleNode("./DATASRC");
	if(!tranNode)return;
	var i, node, item, len = tranNode.childNodes.length;
	for(i=0; i<len; i++)
	{
		node = tranNode.childNodes[i];
		item = new Object();
		item.name = node.getAttribute("id");
		item.value = node.text;
		datasrc.datasrc.add(item.name, item);
	}
	datasrc.state = "initialized";
}
ActiveDocument.prototype.getNodeDataMenu=function(ctlInst, nodeXml)
{
	var menudata = ctlInst.getObject("menudata");
	menudata.menuitems = new top.LawCollection();
	var items = nodeXml.selectNodes("./submenu");
	var i,item,len = items.length;
	for(i=0; i<len; i++)
	{
		item = new Object();
		item.tkn = items[i].getAttribute("TKN");
		item.caption = items[i].getAttribute("TKNValue");
		item.description = items[i].getAttribute("TKNDesc");
		item.url = items[i].getAttribute("TKNURL");
		item.curpos = items[i].getAttribute("TKNCurPos");
		menudata.menuitems.add(item.tkn, item);
	}
	menudata.state = "initialized";
}
ActiveDocument.prototype.copyNode=function(evtInfo)
{
	var srcNode, newNode, parNode;
	srcNode = this.pageXML.selectSingleNode("//*[@id='"+evtInfo.oldId+"']");
	if(!srcNode)return;
	parNode = srcNode.parentNode;
	newNode = srcNode.cloneNode(true);
	newNode.setAttribute("id", evtInfo.newId);
	parNode.appendChild(newNode);
}
ActiveDocument.prototype.deleteNode=function(ctlInstId)
{
	var ctlInst = this.getControlInstance(ctlInstId);
	var nodeName = ctlInst.ctlId.toUpperCase();
	var child = this.pageXML.selectSingleNode("/TRAVLETTE//*[@id='"+ctlInstId+"']");
	if(child)
	{
		var par = child.parentNode;
		par.removeChild(child);

		var parNode = this.pageXML.selectSingleNode("/TRAVLETTE/DATASRC");
		var node = this.pageXML.selectSingleNode("/TRAVLETTE/DATASRC/ELEMENT[@id='"+ctlInstId+"URL']");
		if(node)parNode.removeChild(node);

		parNode = this.pageXML.selectSingleNode("/TRAVLETTE/DATAMAP");
		var nodes = this.pageXML.selectNodes("/TRAVLETTE/DATAMAP/ELEMENT[@nglt='"+ctlInstId+"']");
		var i, len=nodes.length;
		for(i=len-1; i>=0; i--)
		{
			parNode.removeChild(nodes[i]);
		}

		var nodes = this.pageXML.selectNodes("/TRAVLETTE/DATAMAP/ELEMENT");
		var i, len=nodes.length;
		for(i=len-1; i>=0; i--)
		{
			if (nodes[i].text == ctlInstId+"URL")
				parNode.removeChild(nodes[i]);
		}
	}
	return null;
}
ActiveDocument.prototype.updateInstanceId=function(oldId, newId)
{
	if(ActiveDocument.superclass.updateInstanceId.call(this, oldId, newId))
	{
		this.designer.draw.updateInstanceId(oldId, newId);
		var ctlId = this.activeControl.ctlId
		if(this.readyState == "complete" && (ctlId != "text" && ctlId != "image" && ctlId != "formlet"))
		{
			var elmNode = this.pageXML.selectSingleNode("/TRAVLETTE/DATASRC/ELEMENT[@id='"+oldId+"URL']");
			if(elmNode)
				elmNode.setAttribute("id", newId+"URL");
				
			var nodes = this.pageXML.selectNodes("/TRAVLETTE/DATAMAP/ELEMENT[@nglt='"+oldId+"']");
			var i, len=nodes.length;
			for(i=len-1; i>=0; i--)
			{
				nodes[i].setAttribute("nglt",newId);
			}
		}
		return true;
	}
	else
		return false;
}
ActiveDocument.prototype.isValid=function(bClosing)
{
	var view = new Object();
	view.activeView = this.designer.workSpace.view;
	view.newView = this.designer.workSpace.view;
	if(view.activeView == "source" || view.activeView == "script")
	{
		var evtObj = top.designStudio.createEventObject(top.ON_BEFORE_SWITCH_VIEW, null, null, view);
		return ( this.designer.eventHandler.processEvent(evtObj) );
	}
	return true;
}
ActiveDocument.prototype.saveAsDocument=function()
{
	if (!this.isValid(false)) return (false);

	var ds=new top.DataStorage();
	if (this.designer.id)	ds.add("id",this.designer.id);
	if (this.docName)		ds.add("docName",this.docName);
	if (this.docPath)		ds.add("docPath",this.docPath);
	if (this.provId)		ds.add("provId",this.provId);
	if (this.docId)			ds.add("docId",this.docId);

	var inDS=new top.DataStorage();
	inDS.add("doc",this);
	inDS.add("dirDS",ds);
	var outDS=top.cmnDlg.saveAsDlg(inDS);
	if (outDS && typeof(outDS) != "undefined")
	{
		// doc location from saveasdialog
		// defined by prov, path, and name
		this.provId=outDS.prov;
		this.docPath=outDS.loc;
		this.isNew=false;
		//var ext=((outDS.name && (outDS.name.length>4))?outDS.name.substring(outDS.name.length-4):"");
		//if (ext!=".xml")this.docName=outDS.name+".xml";
		var oldDocName=this.docName;
		this.setDocName(outDS.name);
		if(this.provId == "local")
			return (this.saveDocument());
		else
		{
			//Iterate the controls collection and prompt save as dlg for each control
			if(this.remoteSaveAsNugglets(true))
			{
				var bRet = this.savePortalPage(true);
				if(!bRet)this.setDocName(oldDocName);
			}
		}
	}
	return false;
}
ActiveDocument.prototype.remoteSaveAsNugglets=function(bSaveAs)
{
	var i, len = this.controls.count;
	var ctlInst, ctlNode;
	for(i=0; i<len; i++)
	{
		ctlInst = this.controls.item(i);
		if(ctlInst.deleted) continue;
		if((ctlInst.dirty == false && !bSaveAs)|| ctlInst.id == this.mainHost
			|| ctlInst.ctlId == "formlet" || ctlInst.ctlId == "composite")continue;
		if(!bSaveAs && ctlInst.get("src") != "")continue;

		var ds=new top.DataStorage();
		if (this.designer.id)	ds.add("id",this.designer.id);
		var docName = ctlInst.get("src");
		if(docName == "")docName = ctlInst.id;
		else docName = docName.substr(docName.indexOf("/")+1);
		if (this.docName)		ds.add("docName",docName);
		if (this.docPath)		ds.add("docPath",this.docPath+"/"+this.getControlDirectory(ctlInst.ctlId));
		if (this.provId)		ds.add("provId",this.provId);
		if (this.docId)			ds.add("docId",this.docId);

		var prov=top.designStudio.persist.getProv(this.provId);
		var arrProv=new Array();
		arrProv.push(prov);
		ds.add("arrProv",arrProv);

		var inDS=new top.DataStorage();
		inDS.add("doc",this);
		inDS.add("dirDS",ds);
		var outDS=top.cmnDlg.saveAsDlg(inDS);
		if(outDS && typeof(outDS) != "undefined")
		{
			var ext=((outDS.name && (outDS.name.length>4))?outDS.name.substring(outDS.name.length-4):"");
			if (ext!=".xml")outDS.name+=".xml";
			ctlInst.set("src", outDS.name);
			ctlNode = this.pageXML.selectSingleNode("//*[@id='"+ctlInst.id+"']");
			ctlNode.setAttribute("src", outDS.name);
		}
		else
			return false;
	}
	return true;
}
ActiveDocument.prototype.saveDocument=function()
{
	if (!this.isValid(false)) return (false);

	if (!this.provId || !this.docPath || !this.docName || this.isNew)
		return (this.saveAsDocument());

	if (this.provId == "local")
	{
		var prov=top.designStudio.persist.getProv(this.provId);
		// bad path
		var newLoc=prov.cd(this.docPath);
		if (!newLoc) return false;
		// save datastorage used by provider - give all info
		var ds=new top.DataStorage();
		ds.add("overwrite",true);
		var contents=this.getSaveContents();
		if (contents)			ds.add("contents",contents);
		if (this.designer.id)	ds.add("id",this.designer.id);
		if (this.docName)		ds.add("docName",this.docName);
		if (this.docPath)		ds.add("docPath",this.docPath);
		if (this.provId)		ds.add("provId",this.provId);
		if (this.docId)			ds.add("docId",this.docId);
		var bReturn = prov.put(ds);
		if (bReturn)
		{
			this.setModifiedFlag(false);
			window.status=top.designStudio.stringTable.getPhrase("MSG_FILE_SAVED");

			this.commandHistory.setSaveIndex();
			this.setPageXMLOrigCopy(this.pageXML.xml);

			if (this.params) ds.add("params",this.params);
			top.designStudio.pushRecentFileDS(ds);
		}
	}
	else
	{
		//Iterate the controls collection and prompt save as dlg for new control
		if(this.remoteSaveAsNugglets(false))
			this.savePortalPage(false);
	}
	return (bReturn);
}
ActiveDocument.prototype.savePortalPage=function(bSaveAs)
{
	var ctlInst, i, len = this.controls.count;
	var prov=top.designStudio.persist.getProv(this.provId);
	for(i=0; i<len; i++)
	{
		ctlInst = this.controls.item(i);
		if(ctlInst.deleted) continue;
		if(((ctlInst.dirty == false && !bSaveAs) || ctlInst.id == this.mainHost) && ctlInst.ctlId != "data")continue;

		if(ctlInst.ctlId == "formlet" || ctlInst.ctlId == "composite")
		{
			ctlInst.setModifiedFlag(false);
			continue;
		}

		var newLoc=prov.cd(this.docPath+"/"+this.getControlDirectory(ctlInst.ctlId));
		if (!newLoc) return false;
		// save datastorage used by provider - give all info
		var ds=new top.DataStorage();
		ds.add("overwrite",true);
		var ctlNode = this.pageXML.selectSingleNode("//*[@id='"+ctlInst.id+"']");
		var contents=ctlNode.xml;
		if (contents)			ds.add("contents",contents);
		if (this.designer.id)	ds.add("id",this.designer.id);
		var src = ctlInst.get("src").substr(ctlInst.get("src").lastIndexOf("/")+1)
		if (this.docName)		ds.add("docName",src);
		if (this.docPath)		ds.add("docPath",this.docPath+"/"+this.getControlDirectory(ctlInst.ctlId));
		if (this.provId)		ds.add("provId",this.provId);
		if (this.docId)			ds.add("docId",this.docId);
		var bReturn = prov.put(ds);
		if (bReturn)
			ctlInst.setModifiedFlag(false);
		else
			return bReturn;
	}

	// All the components are saved. Now save the portal page.
	var docClone = this.getSaveContents();
	var newLoc=prov.cd(this.docPath);
	if (!newLoc) return false;
	// save datastorage used by provider - give all info
	var ds=new top.DataStorage();
	ds.add("overwrite",true);
	var contents=docClone.documentElement.xml;
	if (contents)			ds.add("contents",contents);
	if (this.designer.id)	ds.add("id",this.designer.id);
	if (this.docName)		ds.add("docName",this.docName);
	if (this.docPath)		ds.add("docPath",this.docPath);
	if (this.provId)		ds.add("provId",this.provId);
	if (this.docId)			ds.add("docId",this.docId);
	var bReturn = prov.put(ds);
	if (bReturn)
	{
		this.setModifiedFlag(false);
		//this.setDocName(this.docName);
		window.status=top.designStudio.stringTable.getPhrase("MSG_FILE_SAVED");
		this.commandHistory.setSaveIndex();
		this.setPageXMLOrigCopy(this.pageXML.xml);

		if (this.params) ds.add("params",this.params);
		top.designStudio.pushRecentFileDS(ds);
	}
	return bReturn;
}
ActiveDocument.prototype.getSaveContents=function()
{
	if(this.provId == "local")
		return this.pageXML.xml;
	else if(this.provId == "remote")
	{
		var docClone = top.xmlFactory.createInstance("DOM");
		docClone.loadXML(this.pageXML.xml);
		var nugglets = docClone.selectSingleNode("//NUGGLETS").childNodes;
		var i, len, j, len2, src;
		len = nugglets.length;
		var newNode, nugNode, parNode;
		parNode = docClone.selectSingleNode("//NUGGLETS");
		for(i=0; i<len; i++)
		{
			nugNode = nugglets[i];
			newNode = docClone.createElement("NUGGLET");
			len2 = nugNode.attributes.length;
			for(j=0; j<len2; j++)
				newNode.setAttribute(nugNode.attributes[j].nodeName, nugNode.attributes[j].nodeValue);

			var tp = nugNode.getAttribute("tp"); 	
			src = nugNode.getAttribute("src").substr(nugNode.getAttribute("src").lastIndexOf("/")+1)
			
			if(tp == "CMP" || tp == "frmlt")
				newNode.setAttribute("src", src);
			else
				newNode.setAttribute("src", this.getControlDirectory(nugNode.nodeName.toLowerCase()) + "/" + src);

			parNode.replaceChild(newNode, nugNode)
		}
		var navlets = docClone.selectSingleNode("//NAVLETS").childNodes;
		len = navlets.length;
		parNode = docClone.selectSingleNode("//NAVLETS");
		for(i=0; i<len; i++)
		{
			nugNode = navlets[i];
			newNode = docClone.createElement("NAVLET");
			len2 = nugNode.attributes.length;
			for(j=0; j<len2; j++)
				newNode.setAttribute(nugNode.attributes[j].nodeName, nugNode.attributes[j].nodeValue);
			src = nugNode.getAttribute("src").substr(nugNode.getAttribute("src").lastIndexOf("/")+1)
			newNode.setAttribute("src", this.getControlDirectory(nugNode.nodeName.toLowerCase()) + "/" + src);
			parNode.replaceChild(newNode, nugNode)
		}
		return docClone;
	}

}
ActiveDocument.prototype.getControlDirectory=function(ctlId)
{
	var strRtn = "";
	switch(ctlId)
	{
		case "data": return "dme";
		case "ags": return "ag"
		case "ida": return "ida";
		case "rpt": return "rpt";
		case "menu": return "mn";
		case "transfer": return "lft";
		case "user": return "al";
		case "formlet": return "";
		case "composite": return "";
		case "travlette": return "";
		case "rss": return "rss"
		case "text": return "txt";
		case "image": return "img";
		case "htm": return "htm";
	}
}
ActiveDocument.prototype.previewDocument=function()
{
	oPreviewXML = top.xmlFactory.createInstance("DOM");
	oPreviewXML.async = false;
	oPreviewXML.loadXML(this.pageXML.xml);

	top.oPreview = new Object();
	top.oPreview.URL = top.portalPath + "/pages/index.htm";
	top.oPreview.XMLDocument = oPreviewXML;

	if(!top.oPreviewWin || top.oPreviewWin.closed)
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

function Draw()
{
	this.designer = top.designStudio.activeDesigner;
}
Draw.prototype.drawControl=function(ctlInst,xml,copyCtlId)
{
	var ctl = this.designer.toolBox.getControlObject(ctlInst.ctlId);
	var strHTML="";
	if(ctl.host == "portalpage")
	{
		strHTML = "<SPAN id='"+ctlInst.id +"' class='nugglet' style='position:absolute;left:"+ctlInst.get("col")+";top:"+ctlInst.get("row")+
						";height:"+ctlInst.get("height")+";width:"+ctlInst.get("width")+";'>"+ctlInst.id+"</SPAN>"
	}
	else if(ctl.host == "leftbar")
	{
		strHTML = "<SPAN id='"+ctlInst.id +"' class='navlet' style='position:relative;left:0;height:20px;width:200px;'>"+ctlInst.id+"</SPAN>"
	}
	this.designer.workSpace.editors.item("design").addElement(strHTML, ctlInst.id, ctl.host);
}
Draw.prototype.drawScreen=function()
{
}
Draw.prototype.updateInstanceId=function(oldId, newId)
{
	var elm = this.designer.workSpace.editor.cwDoc.getElementById(oldId);
	if(elm)
	{
		elm.id = newId;
		elm.innerText = newId;
	}
	else
	{
		elm = this.designer.workSpace.editor.cwDoc.getElementById(newId);
		if(elm)
			elm.innerText = newId;
	}
}


function CommandHandler()
{
	this.receiver = "PORTALPAGE";
	this.commandId = "";
	this.designer = top.designStudio.activeDesigner;
	this.activeDoc = this.designer.activeDocument;
}
CommandHandler.prototype.execute=function(commandId)
{
	this.commandId = commandId;
	switch(this.commandId)
	{
		case "ID_FILE_IMPORT":
			this.importDefinitions();
			break;
		case "ID_FILE_INCLUDE":
			this.includeScriptFiles();
			break;
		case "ID_FILE_RELOAD":
			this.reloadDocument();
		case "ID_EDIT_APPLYCHANGES":
			this.applyChanges();
			break;
		case "ID_VIEW_PREVIEW":
			this.previewDocument();
			break;
		case "ID_TOOLS_OBJVIEWER":
			alert("To be implemented");
			break;
		case "ID_HELP_ABOUTDESIGNER":
			var sFeatures="dialogWidth:380px;dialogHeight:220px;center:yes;help:no;scroll:no;status:no;";
			var args = new Array(top);
			window.showModalDialog(top.studioPath+"/pagedesigner/about.htm", args, sFeatures);
			bHandled=true;
			break;
		default:
			top.designStudio.commandHandler.execute(commandId)
			break;
	}
}
CommandHandler.prototype.handleKeyboardEvent=function(evt)
{
	var	bHandled=false;
	switch (evt.keyCode)
	{
		case top.keys.AKEY:
			if (evt.ctrlKey && evt.altKey)
			{
				var strFeatures="dialogHeight:600px;dialogWidth:800px;edge:sunken;help:no;scroll:no;resizable:yes";
				var dlgArgs=new Array();
				dlgArgs[0]=this.activeDoc;
				dlgArgs[1]=this.designer.workSpace.views.item("design");
				dlgArgs[2]=this.designer;
				dlgArgs[3]=top;
				window.showModalDialog("debug.htm", dlgArgs, strFeatures);
				bHandled = true;
			}
			break;
	}
	return (bHandled);
}
CommandHandler.prototype.importDefinitions=function()
{
	var ds = new top.DataStorage();
	ds.add("actId", "ID_FILE_OPEN");
	ds.add("retContent", true);
	ds.add("docPath", top.contentPath+"/pages");
	var prov=top.designStudio.persist.getProv("remote");
	prov.cd(top.contentPath+"/pages");
	var arrProv=new Array();
	arrProv.push(prov);
	ds.add("arrProv",arrProv);
	var arrTabs=new Array();
	arrTabs.push("existing"); // can be new, existing, or recent
	ds.add("arrTabs",arrTabs);
	var bUsher=top.cmnDlg.usher(ds);
	if(bUsher && typeof(bUsher.contents) != "undefined")
	{
		var node = top.xmlFactory.createInstance("DOM");
		node.async = false;
		node.loadXML(bUsher.contents.xml);
		//var id = node.documentElement.getAttribute("id");
		//node.documentElement.setAttribute("id", id+"_import");
		//if(node.documentElement.nodeName != "COMPOSITE" || node.documentElement.nodeName != "FORMLET")
		//	node.documentElement.setAttribute("src", "");
		if(node && node.xml != "")
		{
			if(node.documentElement.nodeName.toUpperCase() == "TRAVLETTE")
			{
				var msg = this.designer.stringTable.getPhrase("MSG_IMPORT_ERROR0");
				top.cmnDlg.messageBox(msg,"ok","stop");
				return false;
			}
			var ctlInst = this.activeDoc.createCtlInstFromNode(node);
			ctlInst.setModifiedFlag(true);
			var parNode, oldNode;
			oldNode = this.activeDoc.pageXML.selectSingleNode("//*[@id='"+ctlInst.id+"']");
			parNode = oldNode.parentNode;
			parNode.replaceChild(node.documentElement, oldNode);
			return true;
		}
	}
	return false;
}
CommandHandler.prototype.includeScriptFiles=function()
{
	var scriptView = this.designer.workSpace.views.item("script");
	if(scriptView)
		scriptView.includeFiles();
}
CommandHandler.prototype.reloadDocument=function()
{
	var pageXml = this.activeDoc.getPageXMLOrigCopy();
	this.activeDoc.setPageXML(pageXml.xml);
	this.activeDoc.reloadDocument();
	this.activeDoc.setModifiedFlag(false);
}
CommandHandler.prototype.applyChanges=function()
{
	if (this.designer.workSpace.view == "design")
		return;
	var view = this.designer.workSpace.views.item(this.designer.workSpace.view);
	if (view)
		view.save();
}
CommandHandler.prototype.previewDocument=function()
{
	this.activeDoc.previewDocument();
}

function EventHandler()
{
	this.designer = top.designStudio.activeDesigner;
	this.activeDoc = this.designer.activeDocument;
	this.designView=null;
	this.sourceView=null;
	this.scriptView=null;
}
EventHandler.prototype.onBeforeEvent=function(evt)
{
	switch(evt.type)
	{
	}
	return false;
}
EventHandler.prototype.onAfterEvent=function(evtObj)
{
	var evt = evtObj.windowEvent;
	switch (evt.type)
	{
		case "change":
			switch(this.designer.workSpace.view)
			{
				case "script":
					var scriptView = this.designer.workSpace.views.item("script");
					var txtContent = evt.srcElement.value.replace(/\x0D\x0A/g, "\n");
					if(evt.srcElement.id == "txtArea" && scriptView.script != txtContent)
						scriptView.setModifiedFlag(true);
					break;
				case "source":
					if(evt.srcElement.id == "txtArea")
						this.designer.workSpace.views.item("source").setModifiedFlag(true);
					break;
			}
			break;

		case "keyup":
			if ( this.sourceView.active && evt.srcElement.id == "txtArea" )
			{
				if (this.sourceView.getTextContent() != this.sourceView.getContent())
					this.sourceView.setModifiedFlag(true);
			}
			if ( this.scriptView.active && evt.srcElement.id == "txtArea" )
			{
				if (this.scriptView.getTextContent() != this.scriptView.getContent())
					this.scriptView.setModifiedFlag(true);
			}
			// fall through!
		case "mouseup":
		case "select":
			if ( this.scriptView.active && evt.srcElement.id == "txtArea" )
				this.scriptView.textloc = this.scriptView.editor.cwDoc.selection.createRange();
			break;
	}
	return false;
}
EventHandler.prototype.processEvent=function(evtObj)
{
	var bRet = true;
	switch(evtObj.eventId)
	{
		case top.ON_LOAD_DESIGNER_COMPLETE:
			this.designView=this.designer.workSpace.addView("design", new DesignViewOv());
			this.sourceView=this.designer.workSpace.addView("source", new SourceView());
			this.scriptView=this.designer.workSpace.addView("script", new ScriptView());
			break;
		case top.ON_DOCUMENT_INITIALIZED:
			this.onDocumentInitialized(evtObj);
			break;
		case top.ON_CONTROL_INSTANCE_CREATED:
			this.activeDoc.setNodeData(evtObj.extraInfo);
			break;
		case top.ON_CONTROL_INSTANCE_COPIED:
			this.activeDoc.copyNode(evtObj.extraInfo);
			break;
		case top.ON_CONTROL_INSTANCE_DELETED:
			bRet=this.activeDoc.deleteNode(evtObj.extraInfo);
			break;
		case top.ON_BEFORE_SWITCH_VIEW:
			bRet = this.onBeforeSwitchView(evtObj);
			break;
		case top.ON_SWITCH_VIEW:
			this.onSwitchView(evtObj);
			break;
		case top.ON_PROPERTY_CHANGE:
			this.onPropertyChange(evtObj);
			break;
		case top.ON_PROPERTYAREA_PAINTED:
			this.onPropertyAreaPainted(evtObj);
			break;
		case top.ON_CLICK_PROPAREA_BROWSEBTN:
			this.onClickPropAreaBrowseBtn(evtObj);
			break;
		case top.ON_PROPERTYPAGE_RETURN:
			this.onPropertyPageReturn(evtObj);
			break;
		case top.ON_WINDOW_ACTIVATE:
			this.onWindowActivate(evtObj);
			break;
		case top.ON_WINDOW_INACTIVATE:
			this.onWindowInactivated(evtObj);
			break;
	}
	return bRet;
}

EventHandler.prototype.onDocumentInitialized=function(evtObj)
{
	window.status = top.designStudio.activeDesigner.stringTable.getPhrase("MSG_LOADING");
	var strXml = "";
	switch (evtObj.extraInfo.commandId)
	{
		case "ID_FILE_NEW":
			strXml += "<?xml version=\"1.0\"?>";
			strXml += "<TRAVLETTE id=\"portalpage\" tp=\"TRAVLETTE\" mode=\"design\" nm=\"travlette\" width=\"600\" height=\"600\" TITLE=\"Portal Page\" version=\"\">";
			strXml += "<DATASRC></DATASRC><DATAMAP></DATAMAP>";
			strXml += "<NAVLETS></NAVLETS><NUGGLETS></NUGGLETS>";
			strXml += "</TRAVLETTE>";
			this.activeDoc.bNew = true;
			this.activeDoc.setPageXML(strXml);
			this.activeDoc.setPageXMLOrigCopy(strXml);
			this.activeDoc.loadDocument();
			break;
		case "ID_FILE_OPEN":
			this.activeDoc.bNew = false;
			if(evtObj.extraInfo.provId == "remote")
			{
				var api = top.servicesPath+"/gettrav?src="+top.contentPath+"/pages/";
				api+=evtObj.extraInfo.docName+"&_NOCACHE=" + (new Date().getTime());

				// call gettrav servlet
				var prefMsg="Error calling web server GetTrav service.\n";
				var pageXml = top.SSORequest(api,null,"","",false);
				if (!pageXml || pageXml.status)
				{
					var msg=prefMsg;
					if (pageXml && pageXml.status)
						msg+="Server response: " + pageXml.statusText + 
								" (" + pageXml.status + ")\n" +
								top.getHttpStatusMsg(pageXml.status);
					top.cmnDlg.messageBox(msg,"ok","stop");
					this.activeDoc.handleLoadFailure();
					return false;
				}
				else if (pageXml.selectSingleNode("//ERROR"))
				{
					top.displayIOSErrorMessage(pageXml,true,prefMsg);
					this.activeDoc.handleLoadFailure();
					return false;
				}
				else
				{
					if(pageXml.xml == "")
					{
						top.cmnDlg.messageBox(prefMsg+"Invalid response from service: empty document.","ok","stop");
						this.activeDoc.handleLoadFailure();
						return false;
					}
					var node = pageXml.selectSingleNode("//NUGGLETS")
					if (!node) //Error may be
					{
						top.cmnDlg.messageBox(pageXml.documentElement.childNodes[0].text,"ok","stop");
						this.activeDoc.handleLoadFailure();
						return false;
					}
					else
					{
						this.activeDoc.setPageXML(pageXml.xml);
						this.activeDoc.setPageXMLOrigCopy(pageXml.xml);
						this.activeDoc.loadDocument();
					}
				}
			}
			else if(evtObj.extraInfo.provId == "local")
			{
				var localMsg="Error loading local copy or Portal Page:\n";
				var ds = new top.DataStorage()
				ds.add("docName", evtObj.extraInfo.docName);
				ds.add("docPath", evtObj.extraInfo.docPath);
				ds = top.designStudio.persist.activeProv.get(ds, true);
				if (ds)
				{
					var contents = ds.getItem("contents")
							? ds.getItem("contents").value
							: null;
					if (contents)
					{
						this.activeDoc.setPageXML(contents.xml);
						this.activeDoc.setPageXMLOrigCopy(contents.xml);
						this.activeDoc.loadDocument();
					}
					else
					{
						top.cmnDlg.messageBox(localMsg+"Unable to retrieve file contents.","ok","stop");
						this.activeDoc.handleLoadFailure();
						return false;
					}
				}
				else
				{
					top.cmnDlg.messageBox(localMsg+"Error creating storage object.","ok","stop");
					this.activeDoc.handleLoadFailure();
					return false;
				}
			}
			break;
	}
	this.designer.showPropertyArea(true);
	window.status = "";
	return true;
}
EventHandler.prototype.onBeforeSwitchView=function(evtObj)
{
	var viewId = evtObj.extraInfo.activeView;
	switch (viewId)
	{
		case "source":
		case "script":
		{
			var view= this.designer.workSpace.views.item(viewId);
			if(view.getModifiedFlag())
			{
				var phraseId = (viewId=="source")?"MSG_SOURCE_CHANGED":"MSG_SCRIPT_CHANGED";
				var msg = this.designer.stringTable.getPhrase(phraseId);
				var ret=top.cmnDlg.messageBox(msg,"yesnocancel");
				switch(ret)
				{
					case "cancel":
						view.textBody.focus();
						return (false);
					case "yes":
						if(!view.save())
						{
							view.textBody.focus();
							return (false);
						}
					case "no":
						view.setModifiedFlag(false);
						break;
				}
			}
			break;
		}
	}
	return true;
}
EventHandler.prototype.onSwitchView=function (evtObj)
{
	if (evtObj.extraInfo.activeView == "script")
	{
		// populate the objects in the dropdown
		var i,len, option, scriptEditor, objSelect;
		scriptEditor = this.designer.workSpace.editors.item("script");
		objSelect = scriptEditor.cwDoc.getElementById("selObj");
		for (i=objSelect.options.length-1; i>=0; i--)
		{
			objSelect.removeChild(objSelect.options[i]);
		}
		var objEvent = scriptEditor.cwDoc.getElementById("selEvent");
		for (i=objEvent.options.length-1; i>=0; i--)
		{
			objEvent.removeChild(objEvent.options[i]);
		}

		var nodes = this.activeDoc.pageXML.selectSingleNode("//NUGGLETS").childNodes;
		len = nodes.length
		var option;
		option = scriptEditor.cwDoc.createElement("OPTION");
		option.value = this.activeDoc.mainHost;
		option.text = option.value;
		objSelect.add(option);

		for(i=0; i<len; i++)
		{
			option =  scriptEditor.cwDoc.createElement("OPTION");
			option.value = nodes[i].getAttribute("id");
			option.text = option.value;
			objSelect.add(option);
		}
		nodes = this.activeDoc.pageXML.selectSingleNode("//NAVLETS").childNodes;
		len = nodes.length
		for(i=0; i<len; i++)
		{
			option =  scriptEditor.cwDoc.createElement("OPTION");
			option.value = nodes[i].getAttribute("id");
			option.text = option.value;
			objSelect.add(option);
		}
		objSelect.selectedIndex = -1;
	}

	if (evtObj.extraInfo.activeView == "design")
	{
		top.dsToolBox.enableToolbox();
		top.dsPropArea.enablePA();
		var ctlId="portalpage";
		if (this.activeDoc.activeControl && !this.activeDoc.activeControl.deleted)
		{
			ctlId=this.activeDoc.activeControl.id;
			this.activeDoc.selectControlInstance(this.activeDoc.activeControl.id);
		}
		try { 
			var ctl=this.designView.editor.cwDoc.getElementById(ctlId);
			if (ctl) ctl.focus();
		} catch (e) { }
	}
	else
	{
		top.dsToolBox.disableToolbox();
		top.dsPropArea.disablePA();
	}
	return true;
}
EventHandler.prototype.onPropertyChange=function(evtObj)
{
	var propInfo = evtObj.extraInfo;
	var len = propInfo.selectedElements.count;
	var ctlInstId, ctlInst, ctlId, ctlNode, dsc, nm, val;
	for(var i=0; i<len; i++)
	{
		ctlInstId = propInfo.selectedElements.hash[i];
		ctlInst = this.activeDoc.getControlInstance(ctlInstId);
		ctlId = ctlInst.ctlId.toUpperCase();
		if(ctlInstId == this.activeDoc.mainHost)
			ctlNode = this.activeDoc.pageXML.selectSingleNode("//TRAVLETTE");
		else
			ctlNode = this.activeDoc.pageXML.selectSingleNode("//"+ctlId+"[@id='"+ctlInstId+"']");
		if(!ctlNode)continue;

		dsc = propInfo.selectedElements.item(i);
		var len2 = dsc.length;
		for(var j=0; j<len2; j++)
		{
			nm = dsc.children(j).name;
			val = dsc.children(j).value;

			if(nm == "id")
				this.activeDoc.updateInstanceId(ctlInstId, val);
			if(ctlInstId == this.activeDoc.mainHost && nm == "title_str")
				nm="TITLE";
			ctlNode.setAttribute(nm, val);
		}
		ctlInst.setModifiedFlag(true);
	}
}
EventHandler.prototype.onPropertyAreaPainted=function(evtObj)
{
}
EventHandler.prototype.onClickPropAreaBrowseBtn=function(evtObj)
{
	var ctlInstId = evtObj.extraInfo.getItem("ctlName").value;
	var ctlInst = this.activeDoc.getControlInstance(ctlInstId);
	var propId = evtObj.extraInfo.getItem("propName").value;

	if(propId == "src" && ctlInst.ctlId == "formlet")
	{
		var strFeatures="dialogHeight:420px;dialogWidth:420px;center:yes;help:no;scroll:no;status:no;";
		var dlgArgs = new Array();
		var src="";
		dlgArgs[0] = top;
		var ret = window.showModalDialog(top.studioPath+"/uidesigner/wizards/erp_open.htm", dlgArgs, strFeatures);
		if(ret && typeof(ret) != "undefined")
		{
			var id = ret.getItem("id").value;
			src = "_PDL="+ret.getItem("pdl").value+"&_TKN="+ret.getItem("tkn").value+"&_ID="+id;
			if(ctlInst.get(propId) != src)
			{
				this.activeDoc.updateProperty(propId, src, ctlInst.id);
				this.activeDoc.updateProperty("id", id, ctlInst.id);

				// Get the title by loading the form
				var api = top.servicesPath+"/Xpress?"+src+"&_CONTENTDIR="+top.contentPath;
				var formdef = top.SSORequest(api);
				if (!formdef || formdef.status)
				{
					formdef=null;
					this.activeDoc.updateProperty("TITLE", "", ctlInst.id);
					return false;
				}
				if (formdef.xml == "")
				{
					this.activeDoc.updateProperty("TITLE", "", ctlInst.id);
					return false;
				}
				var errNode=formdef.selectSingleNode("//ERROR")
				if (errNode)
				{
					this.activeDoc.updateProperty("TITLE", "", ctlInst.id);
					return false;
				}
				var formNode = formdef.documentElement;
				var title = (formNode.getAttribute("TITLE"))?formNode.getAttribute("TITLE"):"";
				this.activeDoc.updateProperty("TITLE", title, ctlInst.id);
			}
		}
	}
	else if(propId == "src" && ctlInst.ctlId == "composite")
	{
		var ds = new top.DataStorage();
		ds.add("actId", "ID_FILE_OPEN");
		ds.add("retContent", true);
		ds.add("docPath", top.contentPath+"/pages/");
		var prov=top.designStudio.persist.getProv("remote");
		prov.cd(top.contentPath+"/pages/");
		var arrProv=new Array();
		arrProv.push(prov);
		ds.add("arrProv",arrProv);
		var arrTabs=new Array();
		arrTabs.push("existing"); // can be new, existing, or recent
		ds.add("arrTabs",arrTabs);
		var bUsher=top.cmnDlg.usher(ds);
		if(bUsher && bUsher.docName != "")
		{
			this.activeDoc.updateProperty("src", bUsher.docName, ctlInst.id);
			if(bUsher.contents)
			{
				var title = bUsher.contents.documentElement.getAttribute("TITLE");
				if(!title)title = "";
				this.activeDoc.updateProperty("TITLE", title, ctlInst.id);
			}
		}
		return false;
	}
}
EventHandler.prototype.onPropertyPageReturn=function(evtObj)
{
	if(evtObj.extraInfo)
	{
		this.activeDoc.activeControl.setModifiedFlag(true);
		this.activeDoc.setModifiedFlag(true, false);
	}
}
EventHandler.prototype.onWindowActivate=function(evtObj)
{
	if (this.designer.workSpace.view != "design")
	{
		if (this.scriptView.active)
		{
			var selObjects = this.scriptView.editor.cwDoc.getElementById("selObj");
			var selEvents = this.scriptView.editor.cwDoc.getElementById("selEvent");
			if (selEvents) selEvents.style.visibility = "visible";
			if (selObjects) selObjects.style.visibility = "visible";
		}

		this.designer.showPropertyArea(false);
		top.dsToolBox.disableToolbox();
		top.dsPropArea.disablePA();
		var view= this.designer.workSpace.views.item(this.designer.workSpace.view);
		view.setActive();
		return;
	}
	else
	{
		this.designer.showPropertyArea(true);
		top.dsToolBox.enableToolbox();
		top.dsPropArea.enablePA();
		var view= this.designer.workSpace.views.item(this.designer.workSpace.view);
		view.setActive();
		var id = (this.activeDoc.activeControl)?this.activeDoc.activeControl.id:this.activeDoc.mainHost;
		this.designer.workSpace.editor.cwDoc.body.focus();
		this.activeDoc.selectControlInstance(id);
		return;
	}
}
//-----------------------------------------------------------------------------
EventHandler.prototype.onWindowInactivated=function(evtObj)
{
	var myDoc=this.activeDoc;
	if (!myDoc || myDoc.readyState != "complete")
		return;
	var myScript=this.scriptView;
	if (myScript.active && myScript.editor.cwDoc)
	{
		var selObjects = myScript.editor.cwDoc.getElementById("selObj");
		var selEvents = myScript.editor.cwDoc.getElementById("selEvent");
		if (selObjects) selObjects.style.visibility = "hidden";
		if (selEvents) selEvents.style.visibility = "hidden";
	}
}

SourceView.prototype = new top.View();
SourceView.prototype.constructor = SourceView;
SourceView.superclass = top.View.prototype;
function SourceView()
{
	SourceView.superclass.initialize.call(this, "source");

	this.designer = top.designStudio.activeDesigner;
	this.activeDoc = this.designer.activeDocument;
	this.editor = this.designer.workSpace.editors.item("source");
	this.editor.registerTextArea("txtArea");

	this.textBody = this.editor.cwDoc.getElementById("txtArea");
	this.modified = false;
	this.source = null;
}
SourceView.prototype.setActive=function()
{
	this.designer.showPropertyArea(false);
	if (this.designer.workSpace.maximized)
		this.designer.workSpace.setWindowState("maximize");
	this.textBody.focus();
}
SourceView.prototype.setContent=function()
{
	var strXML = this.activeDoc.pageXML.xml.replace(/\>\</g, ">\n<");
	this.source = top.xmlFactory.createInstance("DOM");
	this.source.loadXML(strXML)
	this.editor.setTextContent(this.source.xml);
	this.isValidXML(this.source.xml);
 	this.setModifiedFlag(false)
}
SourceView.prototype.getContent=function()
{
	return this.source.xml;
}
SourceView.prototype.getTextContent=function()
{
	var textBody=this.editor.cwDoc.getElementById("txtArea")
	return (textBody.value);
}
SourceView.prototype.setModifiedFlag=function(bFlag)
{
	this.modified = bFlag;
}
SourceView.prototype.getModifiedFlag=function()
{
	return this.modified;
}
SourceView.prototype.save=function()
{
	if(!this.getModifiedFlag())return true;

	var strSrc = this.editor.getTextContent();
	if(strSrc == this.source.xml)
	{
		this.setModifiedFlag(false);
		this.setMsg();
		this.textBody.focus();
		return true;
	}

	if(!this.isValidXML(strSrc))return false;

	this.activeDoc.setPageXML(strSrc);
	this.activeDoc.setModifiedFlag(true, false);

	this.designer.workSpace.views.item("design").setReload(true);
	this.setModifiedFlag(false);
	return true;
}
SourceView.prototype.isValidXML=function(strXML)
{
	this.setMsg();
	var xmlDoc = top.xmlFactory.createInstance("DOM");
	xmlDoc.loadXML(strXML);
	if(xmlDoc.parseError.errorCode !=0)
	{
		var errLine="", errMsg="";
		var err=xmlDoc.parseError;
		if(err.linepos>0 && err.srcText!="")
		{
			errLine=err.srcText.replace(/\t/g," ")+String.fromCharCode(13);
			for(var i=0;i<err.linepos;i++)
				errLine+="-";
			errLine+="^";
		}
		errMsg=err.reason+String.fromCharCode(13)+"Line: "+err.line+", Character: "+err.linepos;
		errMsg+=String.fromCharCode(13)+errLine;
		this.setMsg(errMsg);
		this.textBody.focus();
		return false;
	}
	this.source.loadXML(strXML);
	return true;
}
SourceView.prototype.setMsg=function(msg)
{
	var msgDiv=this.editor.cwDoc.getElementById("edtMsg")
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

function onSelChangeHandler()
{
	var views = top.designStudio.activeDesigner.workSpace.views
	switch(this.id)
	{
		case "selObj":
			views.item("script").onObjectSelectionChange(this.options[this.selectedIndex].value);
			break;
		case "selEvent":
			views.item("script").onEventSelection(this.options[this.selectedIndex].value);
			break;
	}
}
ScriptView.prototype = new top.View();
ScriptView.prototype.constructor = ScriptView;
ScriptView.superclass = top.View.prototype;
function ScriptView()
{
	ScriptView.superclass.initialize.call(this, "script");

	this.designer = top.designStudio.activeDesigner;
	this.activeDoc = this.designer.activeDocument;
	this.editor = this.designer.workSpace.editors.item("script")
	this.editor.registerTextArea("txtArea");
	this.textBody = this.editor.cwDoc.getElementById("txtArea");
	this.modified = false;
	this.script = "";

	var selObj = this.editor.cwDoc.getElementById("selObj");
	selObj.onchange = onSelChangeHandler;
	var selEvent = this.editor.cwDoc.getElementById("selEvent");
	selEvent.onchange = onSelChangeHandler;
}
ScriptView.prototype.setActive=function()
{
	this.designer.showPropertyArea(false);
	if (this.designer.workSpace.maximized)
		this.designer.workSpace.setWindowState("maximize");
	this.textBody.focus();
}
ScriptView.prototype.setContent=function()
{
	this.script="";
	var content = this.activeDoc.pageXML.selectSingleNode("//XSCRIPT");
	if (content)
	{
		var text=this.getTextContentFormatted(content.text);
		// strip leading CR for display
		while (text.substr(0,2)=="\n\n")
			text=text.substr(1);
		this.script=text;
	}
	this.editor.setTextContent(this.script);
	this.checkSyntax();
 	this.setModifiedFlag(false);
}
ScriptView.prototype.getContent=function()
{
	if (this.script.substr(0,1) != "\n")
		this.script="\n"+this.script;
	return (this.script);
}
ScriptView.prototype.getTextContent=function()
{
	var textBody=this.editor.cwDoc.getElementById("txtArea")
	var text=textBody.value.replace(/\x0D\x0A/g,"\n");
	if (text.substr(0,1) != "\n")
		text="\n"+text;
	return (text);
}
ScriptView.prototype.getTextContentFormatted=function(src)
{
	if (typeof(src) == "undefined")
	{
		var textBody=this.editor.cwDoc.getElementById("txtArea")
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
ScriptView.prototype.setModifiedFlag=function(bFlag)
{
	this.modified = bFlag;
}
ScriptView.prototype.getModifiedFlag=function()
{
	return this.modified;
}
ScriptView.prototype.onObjectSelectionChange=function(objName)
{
	var ctl = this.activeDoc.getControlObject(objName);
	var selEvent = this.editor.cwDoc.getElementById("selEvent");
	var len, i, option, evt;
	for(i=selEvent.options.length-1; i>=0; i--)
	{
		selEvent.removeChild(selEvent.options[i]);
	}
	len = ctl.events.count;
	for (i=0; i<len; i++)
	{
		evt = ctl.events.item(i);
		option = this.editor.cwDoc.createElement("OPTION");
		option.text = evt.label;
		option.value = evt.id;
		selEvent.add(option);
	}
	selEvent.selectedIndex = -1;
}
ScriptView.prototype.onEventSelection=function(strEvent)
{
	var selObj = this.editor.cwDoc.getElementById("selObj");
	var selEvent = this.editor.cwDoc.getElementById("selEvent");

	var obj = selObj.options[selObj.selectedIndex].value;
	var evt = selEvent.options[selEvent.selectedIndex].value

	var ctl = this.activeDoc.getControlObject(obj);
	var oEvent =ctl.events.item(evt)

	var sParms=oEvent.parms
	var label=oEvent.label
	var sFunc = "function "+obj+"_"+label+"("+sParms+")"
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

	var oTextRng=this.textBody.createTextRange()
	var bFound=oTextRng.findText(sFunc, 0, 2)
	if (bFound)
		oTextRng.select()
	else
	{
		oTextRng.text+=sNewData;
		this.textBody.focus();
		oTextRng.moveEnd("textedit");

		// move cursor position to the line above "return true;"
		oTextRng.move("character", cursorPos);
		oTextRng.select();
		this.setModifiedFlag(true);
		//this.textloc = this.editor.cwDoc.selection.createRange();
	}
}
ScriptView.prototype.save=function()
{
	if (!this.getModifiedFlag()) return true;

	var textBody=this.editor.cwDoc.getElementById("txtArea")
	if (this.getTextContent() == this.getContent()) 
		return (true);

	this.script=this.getTextContent();
	var scriptNode = this.activeDoc.pageXML.selectSingleNode("//XSCRIPT");
	var sNode, cData;

	if (!this.checkSyntax())
		return false;

	if (this.script.length > 0)
	{
		this.script = this.script.replace(/^\n\n|\n\n$/,"") + "\n\n";
		sNode=this.activeDoc.pageXML.createNode(1, "XSCRIPT","");
		cData=this.activeDoc.pageXML.createNode(4, "cdata","");
		cData.text=this.script;
		sNode.appendChild(cData)
		if (scriptNode)
		{
			sNode.setAttribute("nbr", "s1")
			this.activeDoc.pageXML.documentElement.replaceChild(sNode, scriptNode)
		}
		else
		{
			sNode.setAttribute("id", "script1")
			this.activeDoc.pageXML.documentElement.appendChild(sNode)
		}
	}
	else
	{
		if (scriptNode)
			this.activeDoc.pageXML.selectSingleNode("//TRAVLETTE").removeChild(scriptNode);
	}
	this.setModifiedFlag(false);
	this.activeDoc.setModifiedFlag(true, false);
	return true;
}
ScriptView.prototype.checkSyntax=function()
{
	this.setMsg();
	if (this.script.length==0) return true;

	try {
		var sc = new ActiveXObject("ScriptControl");
		if(typeof(sc) != "undefined")
		{
			sc.Language = "javascript";
			sc.AddCode(this.script);
		}
		return true;
	}
	catch (e) {
		if(typeof(sc) != "undefined")
		{
			var msg="Syntax error at line "+sc.Error.Line+", column "+sc.Error.Column+":\n\n"+sc.Error.Description;
			this.setMsg(msg);
			this.setTextPosition(sc.Error.Line, sc.Error.Column);
			return false;
		}
		else
		{// If the script control object is not installed.
			var msg=this.designer.stringTable.getPhrase("MSG_SCRIPTING_OCX_NOT_FOUND_SAVE");
			top.cmnDlg.messageBox(msg,"ok","stop");
			return true;
		}
	}
}
ScriptView.prototype.setTextPosition=function(line, col)
{
	try {
			var oBody = this.editor.cwDoc.body;
			this.textBody.focus()
			var r=this.textBody.createTextRange();
			var oRects = r.getClientRects()
			r.moveToPoint(oRects[line-1].left+oBody.scrollLeft, oRects[line-1].top+oBody.scrollTop)
			r.expand("sentence")
			r.select()

	} catch (e) { }
}
ScriptView.prototype.setMsg=function(msg)
{
	var msgDiv=this.editor.cwDoc.getElementById("edtMsg")
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
ScriptView.prototype.includeFiles=function()
{
	var incNode = this.activeDoc.pageXML.selectSingleNode("/TRAVLETTE/INCLUDE");
	var fileList = new top.DataStorage();
	var len = (incNode)?incNode.childNodes.length:0;
	var nm, val;
	for(var i=0; i<len; i++)
	{
		nm = "file" + (i+1);
		val = incNode.childNodes[i].getAttribute("name");
		var iPos = val.indexOf("name=");
		if (iPos != -1)
			val = val.substr(iPos+5);
		fileList.add(nm, val);
	}
	fileList = top.cmnDlg.selectScriptFiles(fileList, "", window);
	if(!fileList || typeof(fileList) == "undefined")return;

	var newIncNode = this.activeDoc.pageXML.createElement("INCLUDE");
	newIncNode.setAttribute("id", "include1");
	var fileNode;
	len = fileList.length;
	for(i=0; i<len; i++)
	{
		fileNode = this.activeDoc.pageXML.createElement("FILE");
		fileNode.setAttribute("name", fileList.getItem("file"+ (i+1)).value);
		newIncNode.appendChild(fileNode);
	}
	if(len == 0 && incNode)
		this.activeDoc.pageXML.documentElement.removeChild(incNode);
	else if(incNode && len != 0)
		this.activeDoc.pageXML.documentElement.replaceChild(newIncNode, incNode);
	else if(!incNode)
		this.activeDoc.pageXML.documentElement.appendChild(newIncNode);
	this.activeDoc.setModifiedFlag(true, false);
}

DesignViewOv.prototype = new top.DesignView();
DesignViewOv.prototype.constructor = DesignViewOv;
DesignViewOv.superclass = top.DesignView.prototype;
function DesignViewOv()
{
	DesignViewOv.superclass.initialize.call(this, "design");
	this.designer = top.designStudio.activeDesigner;
	this.activeDoc = this.designer.activeDocument;
	this.editor = this.designer.workSpace.editors.item("design");
	this.reload=false;

	this.editor.registerCanvas('portalpage');
	this.editor.registerCanvas('leftbar');
}
DesignViewOv.prototype.setActive=function()
{
	this.designer.showPropertyArea(true);
	if (this.designer.workSpace.maximized)
		this.designer.workSpace.setWindowState("maximize");
}
DesignViewOv.prototype.setReload=function(bReload)
{
	this.reload=bReload;
}
DesignViewOv.prototype.getReload=function()
{
	return this.reload;
}
DesignViewOv.prototype.setContent=function()
{
	if(this.getReload())
	{
		this.activeDoc.reloadDocument();
		this.setReload(false);
	}
}

function pgEnableMenuItem(strMenu)
{
	switch (strMenu)
	{
		case "include":
			if(top.designStudio.activeDesigner.workSpace.view == "script")
				return true;
			else
				return false;
		case "reload":
			if(top.designStudio.activeDesigner.activeDocument.isNew)
				return false;
			else
				return true;
		case "undo":
		case "redo":
		case "delete":
		case "import":
			if(top.designStudio.activeDesigner.workSpace.view == "design")
				return true;
			else
				return false;
		case "apply":
			if(top.designStudio.activeDesigner.workSpace.view != "design")
			{
				var bModified = top.designStudio.activeDesigner.workSpace.views.item(top.designStudio.activeDesigner.workSpace.view).getModifiedFlag();
				if(bModified)
					return true;
				else
					return false;
			}
			return false;
		case "deselectall":
			if(top.designStudio.activeDesigner.activeDocument.activeControl &&
				top.designStudio.activeDesigner.activeDocument.activeControl.id != top.designStudio.activeDesigner.activeDocument.mainHost)
				return true;
			else
				return false;
		case "design":
		case "source":
		case "script":
			if(top.designStudio.activeDesigner.workSpace.view == strMenu)
				return false;
			else
				return true;
		default:
			return true;
	}
}

function chkValue(strValue, strDef)
{
	if(!strValue || typeof(strValue) == "undefined")
	{
		if(!strDef || typeof(strDef) == "undefined")
			strValue = "";
		else
			strValue = strDef;
	}
	return strValue;
}
