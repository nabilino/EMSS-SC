/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/uidraw.js,v 1.3.4.1.4.6.16.2 2012/08/08 12:48:51 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// uidraw.js
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
// Draw implementation --------------------------------------------------------
//-----------------------------------------------------------------------------

function Draw()
{
	this.designer = parent.designStudio.activeDesigner;
	this.name = "Draw UI";
}

//-----------------------------------------------------------------------------
Draw.prototype.drawControl=function(ctlInst,xml,copyCtlId)
{
	var bQuickDtl=false;
	var nodeName=""
	var props=ctlInst.propertyBag.elements;
	var control=myDoc.getControlObject(ctlInst.id)
	if (control.getRule("nodeName"))
		nodeName=control.getRule("nodeName")
	else
		nodeName=control.id.toUpperCase()

	var nodeDef="";
	if (typeof(xml) == "string")
		nodeDef=xml;
	else
	{
		nodeDef+="<"+nodeName
		var len=(props ? props.length : 0);
		for (var i = 0; i < len; i++)
		{
			nodeDef+=" "+props.children(i).name+"=\""
			nodeDef+=props.children(i).value+"\""
		}
		if (ctlInst.getRule("nodeTp"))
		{
			var tp=ctlInst.getRule("nodeTp")
			nodeDef+=" tp=\""+tp+"\""
			if (tp.toLowerCase() == "select")
				nodeDef+=" seltype=\""+ctlInst.getRule("nodeSeltype")+"\""
		}
		nodeDef+=" />\n"
	}

	// get the parent name for the new control
	var parentName=(myDesign.active ? control.host : myObject.getTargetElement());

	// instantiate DOM for this control's form xml
	var oNodeDOM=null
	if (nodeName=="detail")
	{
		// reuse existing detail area
		msg="Quick Paint the detail control?";
		bQuickDtl = (top.cmnDlg.messageBox(msg,"yesno","question",window) == "yes" ? true : false);
		oNodeDOM=myDoc.initNewDetail(ctlInst.get("id"), bQuickDtl);
		if (!oNodeDOM) return;
	}
	if (!oNodeDOM)
		oNodeDOM=uiCreateDOMFromString(nodeDef)
	if (!oNodeDOM) return;

	var newNode=oNodeDOM.documentElement
	if (nodeName=="tabregion")
	{
		// add an empty tab element to the tabregion
		var nbr=newNode.getAttribute("nbr")
		nbr=nbr.replace("TR","TF")+"-0"
		var tabId="tab"+myDoc.getUniqueID("tab","")
		var tabDef="<tab nbr='"+nbr+"' id='"+tabId+"' />\n"
		var oTabDOM=uiCreateDOMFromString(tabDef)
		newNode.appendChild(oTabDOM.documentElement)
		newNode.setAttribute("grp",tabId)
		ctlInst.set("grp",tabId)
	}

	if (typeof(copyCtlId) != "undefined" && copyCtlId != null)
	{
		// Copy vals nodes
		var copyNode=myDoc.xmlDoc.selectSingleNode("//*[@id='"+copyCtlId+"']")
		var valsNodes=copyNode.selectNodes("./vals")
		var len=valsNodes.length
		for (var i = 0; i < len; i++)
		{
			var cloneNode=valsNodes[i].cloneNode(true)
			cloneNode.setAttribute("id",
				"vals"+myDoc.getUniqueID("vals","",myDoc.xmlDoc))
			myDoc.labelCnt++
			cloneNode.setAttribute("nbr","_l" + myDoc.labelCnt)
			if (!cloneNode.getAttribute("Tran"))
				cloneNode.setAttribute("Tran",cloneNode.getAttribute("Disp"))
			newNode.appendChild(cloneNode)
		}
	}

	// get the parent node to attach to
	var parentNode=null
	if (parentName=="form1")
		parentNode=myDoc.xmlDoc.selectSingleNode("/form")
	else
		parentNode=myDoc.xmlDoc.selectSingleNode("/form//*[@id='"+parentName+"']")
	if (nodeName == "detail")
	{
		var oldNode=parentNode.selectSingleNode("./detail[@nbr='"+newNode.getAttribute("nbr")+"']")
		if (oldNode)
			parentNode.replaceChild(newNode,oldNode)
		else
		{
			oldNode=myDoc.xmlDoc.selectSingleNode("//detail[@nbr='"+newNode.getAttribute("nbr")+"']")
			if (oldNode)
				oldNode.parentNode.removeChild(oldNode)
			parentNode.appendChild(newNode)
		}
		ctlInst.set("id",newNode.getAttribute("id"));
		myDoc.createIDs();		// rows, others may not have ids
	}
	else if (parentNode.nodeName == "detail")
	{
		var rowNode=parentNode.selectSingleNode("./row[@row]")
		// undeleting fld in detail?
		if (typeof(xml) == "string" && newNode.nodeName == "fld")
		{
			// replace the hidden node if it exists
			var oldNode=parentNode.selectSingleNode("./fld[@nm='"+newNode.getAttribute("nm")+"']")
			if (oldNode)
				parentNode.replaceChild(newNode,oldNode);
			else
				parentNode.insertBefore(newNode,rowNode);
		}
		else
		{
			// insert controls before row nodes
			parentNode.insertBefore(newNode,rowNode);
		}

		// some controls initially go in header
		if (newNode.nodeName == "fld" && newNode.getAttribute("tp") == "label"
		|| newNode.nodeName == "LINE")
		{
			newNode.setAttribute("dtlhdr","1");
			ctlInst.set("dtlhdr","1");
			newNode.setAttribute("row","0");
			ctlInst.set("row","0");
		}
	}
	else
	{
		// undeleting fld?
		if (typeof(xml) == "string" && newNode.nodeName == "fld")
		{
			// replace the hidden node if it exists
			var oldNode=parentNode.selectSingleNode("./fld[@nm='"+newNode.getAttribute("nm")+"']")
			if (oldNode)
				parentNode.replaceChild(newNode,oldNode);
			else
				parentNode.appendChild(newNode);
		}
		else
			parentNode.appendChild(newNode);
	}
	myDoc.singleUse = (control.getRule("singleUse") == "1") ? true : false;

	// when quick painting a detail we need to re-initialize first
	if (bQuickDtl) myDoc.initDetails();

	// get the htm from transform and add to editor palette
	var objXSLTProc = myDoc.xslCache.createProcessor();
	objXSLTProc.input = newNode;
	objXSLTProc.transform();
	var strHTML="";
	strHTML+=objXSLTProc.output;

	if (strHTML != "")
	{
		if (myDesign.active)
		{
			myDesign.editor.addElement(strHTML, ctlInst.id, parentName);
			myObject.setReload()
		}
		else if (myObject.active)
		{
			myObject.editor.addElement(strHTML, ctlInst.id, parentName);
			var mElement=myDesign.editor.addElement(strHTML, ctlInst.id, parentName, false);
			mElement.setAttribute("isSelectable","0")
		}
	}

	// if detail quick paint, now create all the child controls
	if (!bQuickDtl) return;

	myDoc.initDetailFCs();	// fc must be converted to Select

	var dtlId=newNode.getAttribute("id");
	var len=newNode.childNodes.length;
	for (var i = 0; i < len; i++)
	{
		var parId=dtlId;
		if (newNode.childNodes[i].nodeName == "tabregion")
		{
			var trNode=newNode.childNodes[i];
			var dupTR=myDoc.xmlDoc.selectSingleNode("//tabregion[@nbr='"+trNode.getAttribute("nbr")+"']");
			if (dupTR)
				myDoc.changeTabNbrs(dupTR);
			parId=newNode.parentNode.getAttribute("id");
			myDoc.initTabRegions();
		}
		var child=newNode.childNodes[i];
		myDoc.createControlFromNode(child, parId);
		var ctlInst=myDoc.getControlInstance(child.getAttribute("id"));
		if (ctlInst)
			myDoc.dsm.remove(child);
	}
	myDoc.selectControlInstance(dtlId);
	if (myDesign.active)
	{
		myObject.setReload();
		myObject.setObjNode(newNode);
		myObject.setTargetElement(dtlId);
	}
}

//-----------------------------------------------------------------------------
Draw.prototype.redrawControl=function(ctlName,ctlNode)
{
	if (!ctlNode) return;
	myDoc.setRedraw();
	if (ctlNode.nodeName == "detail")
	{
		this.redrawDetail(ctlName,ctlNode)
		myDoc.setRedraw(false);
		return;
	}
	else if (ctlNode.nodeName == "tabregion")
	{
		this.redrawTabRegion(ctlName,ctlNode)
		myDoc.setRedraw(false);
		return;
	}

	var objXSLTProc = myDoc.xslCache.createProcessor();
	objXSLTProc.input = ctlNode
	objXSLTProc.transform();
	var strHTML=""
	strHTML+=objXSLTProc.output
	if (strHTML != "")
	{
		if (myDesign.active)
		{
			myDesign.editor.redrawElement(strHTML, ctlName);
			myObject.setReload();
		}
		else if (myObject.active)
		{
			myDesign.editor.redrawElement(strHTML, ctlName, false);
			if (ctlName==myObject.getObjNode().getAttribute("id"))
			{
				myObject.setReload()
				myObject.setContent()
			}
			else
				myObject.editor.redrawElement(strHTML, ctlName, false);
		}
	}
	myDoc.setRedraw(false);
}

//-----------------------------------------------------------------------------
Draw.prototype.redrawDetail=function(dtlName,dtlNode)
{
	// remove existing detail area htm element
	var dtlElem = myDesign.editor.cwDoc.getElementById(dtlName);
	if (dtlElem)
		dtlElem.removeNode(true);

	// iterate across the detail node
	window.status="Rebuilding design view..."
	this.readyState="loading"

	var formNode=myDoc.xmlDoc.selectSingleNode("/form")
	formNode.setAttribute("objmode","0")

	myDoc.paintControlFromNode(myDesign.editor, dtlNode, dtlNode.parentNode.getAttribute("id"), true)
	var len=dtlNode.childNodes.length
	for (var i = 0; i < len; i++)
		myDoc.paintControlFromNode(myDesign.editor, dtlNode.childNodes[i], dtlName, false)

	// set reload on object view
	myObject.setReload();
	if (myObject.active)
		myObject.setContent()

	this.readyState="complete"
	window.status=""
}

//-----------------------------------------------------------------------------
Draw.prototype.redrawTabRegion=function(trName,trNode)
{
	// if this was a subbordinate tab node, 
	// get pointers to parent tab for design view
	if (trNode.parentNode.getAttribute("id") != "form1"
	&& trNode.selectSingleNode("ancestor::tabregion"))
	{
		trNode=trNode.selectSingleNode("ancestor::tabregion");
		trName=trNode.getAttribute("id");
	}

	// remove existing tabregion htm element from design view
	var trElem = myDesign.editor.cwDoc.getElementById(trName);
	if (trElem)
		trElem.removeNode(true);

	// iterate across the detail node
	window.status="Rebuilding design view..."
	this.readyState="loading"

	var formNode=myDoc.xmlDoc.selectSingleNode("/form")
	formNode.setAttribute("objmode","0")

	var tabNode=trNode.selectSingleNode("./tab[@id=../@grp]")
	myDoc.paintControlFromNode(myDesign.editor, trNode, "form1", true)
	myDoc.paintControlFromNode(myDesign.editor, tabNode, trName, false)

	// set reload on object view
	myObject.setReload();
	if (myObject.active)
		myObject.setContent();

	this.readyState="complete";
	window.status="";
}
