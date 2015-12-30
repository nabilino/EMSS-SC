/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/uiobject.js,v 1.4.4.1.26.2 2012/08/08 12:48:51 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// uiobject.js
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
// ObjectView -----------------------------------------------------------------
//-----------------------------------------------------------------------------

ObjectView.prototype = new parent.View();
ObjectView.prototype.constructor = ObjectView;
ObjectView.superclass = parent.View.prototype;
function ObjectView()
{
	var viewName="object"		// becomes this.id
	ObjectView.superclass.initialize.call(this, viewName, 
		top.document.getElementById("view_"+viewName), 
		top.document.getElementById("btn_"+viewName));

	this.modified=false;
	this.baseElement="";
	this.targetElement="";
	this.parents=new Array();
	this.targets=new Array();
	this.reload=true;
	this.objNode=null;
	this.objLevel=1;

	// initialize local editor reference
	this.editor=top.designStudio.activeDesigner.workSpace.editors.item(this.id);
	this.editor.registerCanvas("objFrame");

	// since we initialized the WYSIWYG editor without an
	// editable body, we must now set it's default state to
	// allow editing in our 'canvas'
	this.editor.setDefaultState();

	var objFrame=this.editor.cwDoc.getElementById("objFrame")
	objFrame.contentEditable=false;

	// hookup button events
	var btn=this.editor.cwDoc.getElementById("btnParentObj")
	btn.onclick=myDesigner.source.uiOnObjectButtonClick
	btn=this.editor.cwDoc.getElementById("btnChildObj")
	btn.onclick=myDesigner.source.uiOnObjectButtonClick
	btn=this.editor.cwDoc.getElementById("btnObjProps")
	btn.onclick=myDesigner.source.uiOnObjectButtonClick
}

//-----------------------------------------------------------------------------
ObjectView.prototype.setActive=function()
{
	myDesigner.showPropertyArea(true);
	if (myDesigner.workSpace.maximized)
		myDesigner.workSpace.setWindowState("maximize");
}

//-----------------------------------------------------------------------------
ObjectView.prototype.setToolboxState=function()
{
	// disable any tools?
	var toolbox=myDesigner.toolBox
	for ( var i = 0; i < toolbox.controlGroups.count; i++)
	{
		var ctlGrp = toolbox.controlGroups.item(i);
		for (var j = 0; j < ctlGrp.controls.count; j++)
		{
			var bEnable=true;
			var control = ctlGrp.controls.item(j);

			// first check single use rule
			var bSingleUse = (control.getRule("singleUse") == "1") ? true : false;
			if (bSingleUse)
			{
				var ctlNode = myDoc.xmlDoc.selectSingleNode("/form//"+control.id);
 				if (ctlNode && ctlNode.getAttribute("tp") != "Hidden")
 					bEnable=false
				else if (control.id=="detail")
				{
					// any msg nodes with detail attribute?
					var detNode=myDoc.origDoc.selectSingleNode("/form//*[@det='DT0']")
	 				if (!detNode)
 						bEnable=false
				}
			}

			// check for object rules (if not already disabled)
			if (bEnable)
			{
				if (this.objNode.nodeName.toLowerCase() == "detail")
					bEnable = (control.getRule("useInDetail") == "1") ? true : false;
			}
			myDesigner.source.uiEnableToolbtn(control.id, bEnable)
		}
	}
}

//-----------------------------------------------------------------------------
ObjectView.prototype.setContent=function()
{
	if (!this.getReload()) return;

	window.status="Rebuilding object view..."
	myDoc.readyState="loading"

	// must force a re-scan of current object xml before painting
	var objId=this.objNode.getAttribute("id")
	this.objNode=myDoc.xmlDoc.selectSingleNode("//*[@id='"+objId+"']")
	this.paint()
	
	myDoc.readyState="complete"
	window.status=""

	this.setReload(false);
 	this.setModifiedFlag(false)
}

//-----------------------------------------------------------------------------
ObjectView.prototype.getContent=function()
{
}

//-----------------------------------------------------------------------------
ObjectView.prototype.updateView=function(ctl, name)
{
// note: must use fully qualified editor (...editors.item(x)...) in
// this method as this.designer.workSpace.editor may not be the objectview editor.

	var dsUpdate = new top.DataStorage();
	var i=0;
	if(typeof(ctl) == "undefined")
	{
		dsUpdate.add("top","0");
		dsUpdate.add("left","0");
		this.editor.updateElement(dsUpdate, this.getBaseElement());
	}
	else if(typeof(name) == "undefined")
	{
		var ctldef=myDesigner.toolBox.getControlObject(ctl.ctlId, ctl.ctlGrpId);
		for(i=0; i < ctldef.properties.count; i++)
		{
			dsUpdate.add(ctldef.properties.item(i).id,ctl.get(ctldef.properties.item(i).id));
		}
		this.editor.updateElement(dsUpdate, ctl.id);
	}
	else
	{
		// update the control metrics
		if (ctl.id == this.getBaseElement())
		{
			// don't move from origin
			if (name == "top" || name == "left"
			|| name == "row" || name == "col")
				return;
		}
		dsUpdate.add(name,ctl.get(name));
		this.editor.updateElement(dsUpdate, ctl.id);
	}
}

//-----------------------------------------------------------------------------
ObjectView.prototype.selectBaseObject=function()
{
	var elem=this.editor.cwDoc.getElementById(this.getBaseElement())
	if (elem)
		elem.fireEvent("oncontrolselect");
}

//-----------------------------------------------------------------------------
ObjectView.prototype.getBaseElement=function()
{
	return (this.baseElement);
}

//-----------------------------------------------------------------------------
ObjectView.prototype.setBaseElement=function(base)
{
	if (typeof(base) != "string") return (null);
	var prevBase=this.baseElement;
	this.baseElement=base
	return (prevBase);
}

//-----------------------------------------------------------------------------
ObjectView.prototype.getTargetElement=function()
{
	return (this.targetElement);
}

//-----------------------------------------------------------------------------
ObjectView.prototype.setTargetElement=function(target)
{
	if (typeof(target) != "string") return (null);

	var prevTarget=this.targetElement;
	this.targetElement=target
	return (prevTarget);
}

//-----------------------------------------------------------------------------
ObjectView.prototype.setReload=function(bReload)
{
	if (typeof(bReload) != "boolean")
		bReload=true;
	this.reload=bReload;
}

//-----------------------------------------------------------------------------
ObjectView.prototype.getReload=function()
{
	return (this.reload);
}

//-----------------------------------------------------------------------------
ObjectView.prototype.setObjNode=function(node)
{
	this.objNode=node;
	return (this.getObjNode());
}

//-----------------------------------------------------------------------------
ObjectView.prototype.getObjNode=function()
{
	return (this.objNode);
}

//-----------------------------------------------------------------------------
ObjectView.prototype.setModifiedFlag=function(fModified)
{
	if (typeof(fModified) != "boolean")
		fModified=true;
	this.modified=fModified;
}

//-----------------------------------------------------------------------------
ObjectView.prototype.getModifiedFlag=function()
{
	return (this.modified);
}

//-----------------------------------------------------------------------------
ObjectView.prototype.enableButton=function(id,bEnable)
{
	if (typeof(bEnable) != "boolean")
		bEnable=true;
	var btn=this.editor.cwDoc.getElementById(id)
	if (!btn) return;
	btn.disabled=!bEnable
}

//-----------------------------------------------------------------------------
ObjectView.prototype.childObjectView=function()
{
	window.status="Rebuilding object view..."
	myDoc.readyState="loading"
	myDoc.commandHistory.removeAll();
	this.objLevel += 1

	this.enableButton("btnChildObj",false)

	// add current object id to parent stack
	var idx=this.parents.length
	this.parents[idx]=this.getBaseElement()
	this.targets[idx]=this.getTargetElement()

	// set the new object node
	var elem=this.editor.selectedElements.item(0)
	if (!elem) return;

	this.objNode=myDoc.xmlDoc.selectSingleNode("/form//*[@id='"+elem.id+"']")
	if (this.objNode.nodeName=="detail")
		this.setTargetElement(elem.id)
	else
		this.setTargetElement(this.objNode.getAttribute("grp"))

	this.paint()
	this.setToolboxState()

	myDoc.readyState="complete"
	window.status=""

	var elem=this.editor.selectedElements.item(0)
	if (elem)
		elem.fireEvent("oncontrolselect");
}

//-----------------------------------------------------------------------------
ObjectView.prototype.parentObjectView=function()
{
	// if no more parents, switch to design view
	if (!this.parents.length)
	{
		myDesigner.workSpace.switchView("design")
		return;
	}
	
	window.status="Rebuilding object view..."
	myDoc.readyState="loading"
	myDoc.commandHistory.removeAll();
	this.objLevel -= 1

	// pop the the last parent, select it
	var parentId=this.parents.pop()
	var targetId=this.targets.pop()
	this.objNode=myDoc.xmlDoc.selectSingleNode("/form//*[@id='"+parentId+"']")

	this.enableButton("btnChildObj")

	// save the base element (it's reset in paint())
	var childId=this.getBaseElement()
	this.setTargetElement(targetId)

	this.paint()
	this.setToolboxState()

	myDoc.readyState="complete"
	window.status=""

	var elem=this.editor.cwDoc.getElementById(childId)
	if (elem)
		elem.fireEvent("oncontrolselect");
}

//-----------------------------------------------------------------------------
ObjectView.prototype.paint=function()
{
	this.setBaseElement(this.objNode.getAttribute("id"))

	var formNode=myDoc.xmlDoc.selectSingleNode("/form")
	formNode.setAttribute("objmode",this.objLevel)

	// need a targetid if object is detail
	var objNode=myDoc.xmlDoc.selectSingleNode("//*[@id='"+this.getTargetElement()+"']")
	var control=myDoc.getControlObject(objNode?objNode.getAttribute("id"):"junk")
	formNode.setAttribute("targetid", control ? control.id: "junk")

	// clear the frame to repaint it
	var objFrame=this.editor.cwDoc.getElementById("objFrame")
	objFrame.innerHTML="";

	// iterate the object and its child nodes
	var bTargetIsBase=true
	if (this.getTargetElement() != this.getBaseElement())
		bTargetIsBase=false

	myDoc.paintControlFromNode(this.editor, this.objNode, "objFrame", !bTargetIsBase)

	var baseElem=this.editor.cwDoc.getElementById(this.getBaseElement())
//	baseElem.setAttribute("isResizable","0")
	baseElem.setAttribute("isResizable","1")
	baseElem.setAttribute("isMoveable","1")
	baseElem.setAttribute("isSelectable","1")
	baseElem.setAttribute("contentEditable","true")

	if (!bTargetIsBase)
	{
		var targetId=this.getTargetElement()
		var chNode=null
		if (this.objNode.childNodes.length==1)
			// detail footer may have single fldgroup
			chNode=this.objNode.childNodes[0]
		else
			chNode=this.objNode.selectSingleNode("./*[@id='"+targetId+"']")
		if (chNode)
			myDoc.paintControlFromNode(this.editor, chNode, this.getBaseElement(), false)
	}

	this.updateView()

	var titleText=this.editor.cwDoc.getElementById("lblObjectName")
	titleText.innerText=this.getBaseElement();
}
