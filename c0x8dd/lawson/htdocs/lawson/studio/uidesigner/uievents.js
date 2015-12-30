/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/uievents.js,v 1.7.4.3.4.2.22.2 2012/08/08 12:48:51 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// uievents.js
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
// Event Handler implementation -----------------------------------------------
//-----------------------------------------------------------------------------

function EventHandler()
{
	// need this reference: can't use myDesigner since
	// some events fire before myDesigner reference is valid

	this.designer=top.designStudio.activeDesigner
}

//-----------------------------------------------------------------------------
// no editor 'onBefore' notifications implemented
//-----------------------------------------------------------------------------
// EventHandler.prototype.onBeforeEvent=function(evtObj)
// {
// 	var evt=evtObj.windowEvent
// 	switch(evt.type)
// 	{
// 	default:
//   		return false;
// 		break;
// 	}
// }

//-----------------------------------------------------------------------------
EventHandler.prototype.onAfterEvent=function(evtObj)
{
	var evt=evtObj.windowEvent
	switch(evt.type)
	{
	case "controlselect":
		switch (this.designer.workSpace.view)
		{
		case "design":
			var bEnable=false;
			if (myDesign.editor.selectedElements.count == 1)
			{
				var objId=myDesign.editor.selectedElements.item(0).id
				var control=myDoc.getControlObject(objId)
				if (control && control.getRule("isObject")=="1")
				{
					bEnable=true;
					myObject.setReload()
					myObject.setObjNode(
						myDoc.xmlDoc.selectSingleNode("/form//*[@id='"+objId+"']"))
					if (control.id=="detail")
						myObject.setTargetElement(objId)
					else
						myObject.setTargetElement(myObject.objNode.getAttribute("grp"))
				}
			}
			myObject.enableView(bEnable);
			break;
		case "object":
			// allow other objects to take over the view
			var bEnable=false;
			if (myObject.editor.selectedElements.count == 1)
			{
				var objElem=myObject.editor.selectedElements.item(0)
				var objId=objElem.id
				if (objId != myObject.getBaseElement())
				{
					var control=myDoc.getControlObject(objId)
					if (control && control.getRule("isObject")=="1")
						bEnable=true;
					if (objElem.getAttribute("isObject")=="1")
						bEnable=true;
				}
			}
			myObject.enableButton("btnChildObj",bEnable);
			break;
		}
		break;

	case "keyup":
		if ( mySource.active && evt.srcElement.id == "textBody" )
		{
			if (mySource.getTextContent() != mySource.getContent())
				mySource.setModifiedFlag()
		}
		if ( myScript.active && evt.srcElement.id == "textBody" )
		{
			if (myScript.getTextContent() != myScript.getContent())
				myScript.setModifiedFlag()
		}
		// fall through!
	case "mouseup":
	case "select":
		if ( myScript.active && evt.srcElement.id == "textBody" )
		{
			myScript.textloc = myScript.editor.cwDoc.selection.createRange();
		}
		break;

	}
}

//-----------------------------------------------------------------------------
EventHandler.prototype.processEvent=function(evtObj)
{
	switch(evtObj.eventId)
	{
	case top.ON_LOAD_DESIGNER_COMPLETE:
		// add,initialize default view
		this.designer.workSpace.addView("design", new DesignViewSub());
		break;

	case top.ON_DOCUMENT_INITIALIZED:
		uiInitialize(evtObj);
		break;

	case top.ON_BEFORE_PA_CLEAR:
		return false;		// never clear property area!
		break;

	case top.ON_BEFORE_DELETE_CONTROLS:
		return (this.handleBeforeDeleteControls(evtObj));
		break;

	case top.ON_BEFORE_METRIC_RULE_CHANGE:
		return (myDoc.handleBeforeMetricRuleChange(evtObj));
		break;

	case top.ON_BEFORE_SWITCH_VIEW:
		return (this.handleBeforeSwitchView(evtObj));
		break;

	case top.ON_CLICK_PROPAREA_BROWSEBTN:
		myDoc.handlePropertyBrowse(evtObj);
		break;

	case top.ON_CONTROL_INSTANCE_DELETED:
		return (this.handleControlDeleted(evtObj));
		break;

	case top.ON_PROPERTY_CHANGE:
		// only respond to property change if not redrawing
		if (!myDoc.getRedraw())
			myDoc.handlePropertyChange(evtObj)
		break;

	case top.ON_PROPERTYAREA_PAINTED:
		myDoc.handlePropertyAreaPainted(evtObj)
		break;

	case top.ON_PROPERTYPAGE_RETURN:
		myDoc.handlePropertyPageReturn(evtObj)
		break;

	case top.ON_SWITCH_VIEW:
		this.handleSwitchView(evtObj);
		break;

	case top.ON_WINDOW_INACTIVATE:
		this.handleWindowInactivated(evtObj);
		break;

	case top.ON_WINDOW_ACTIVATE:
		this.handleWindowActivated(evtObj);
		break;
	}
	return true;
}

//-----------------------------------------------------------------------------
EventHandler.prototype.handleBeforeDeleteControls=function(evtObj)
{
	var bReturn=true;			// allows delete to proceed
	var elems=evtObj.extraInfo;

	var len = elems ? elems.count : 0;
	for (var i=0; i < len; i++)
	{
		var se = elems.item(i);
		var ctlNode = myDoc.xmlDoc.selectSingleNode("//*[@id='"+se.id+"']");
		if (!ctlNode) continue;
		var ctlType = ctlNode.nodeName.toLowerCase();
		if (ctlType == "tabregion" || ctlType == "detail")
		{
			var msg = this.designer.stringTable.getPhrase("MSG_DELETE_MAY_NOT_UNDO")
			msg += (" "+se.id+".\n\n");
			msg += this.designer.stringTable.getPhrase("MSG_OK_TO_CONTINUE")
			msg += "\n\n";
			var ret=top.cmnDlg.messageBox(msg,"okcancel")
			if (ret == "cancel")
			{
				bReturn=false;
				break;
			}
		}
	}
	return bReturn;
}

//-----------------------------------------------------------------------------
EventHandler.prototype.handleBeforeSwitchView=function(evtObj)
{
	var bReturn=true;			// allows view switch to proceed
	switch (evtObj.extraInfo.activeView)
	{
	case "design":
		if (evtObj.extraInfo.newView=="object")
			myDoc.commandHistory.removeAll();
		break;

	case "object":
		if (evtObj.extraInfo.newView=="design")
			myDoc.commandHistory.removeAll();
		break;

	case "source":
		if (mySource.getModifiedFlag())
		{
			// prompt to save source
			var msg = this.designer.stringTable.getPhrase("MSG_SOURCE_MODIFIED")
			var ret=top.cmnDlg.messageBox(msg,"yesnocancel")
			switch (ret)
			{
			case "cancel":
				mySource.editor.cwDoc.getElementById("textBody").focus()
				return false;			// don't allow switch
				break;
			case "yes":
				if (!mySource.apply())
				{
					mySource.editor.cwDoc.getElementById("textBody").focus()
					return false;		// don't allow switch
				}
				myDoc.commandHistory.removeAll();
				break;
			}
		}
		break;

	case "script":
		if (myScript.getModifiedFlag())
		{
			// prompt to save script
			var msg = this.designer.stringTable.getPhrase("MSG_SCRIPT_MODIFIED")
			var ret=top.cmnDlg.messageBox(msg,"yesnocancel")
			switch (ret)
			{
			case "cancel":
				myScript.editor.cwDoc.getElementById("textBody").focus()
				return false;			// don't allow switch
				break;
			case "yes":
				if (!myScript.apply())
				{
					myScript.editor.cwDoc.getElementById("textBody").focus()
					return false;		// don't allow switch
				}
				break;
			}
		}
		break;
	}
	return (bReturn);
}

//-----------------------------------------------------------------------------
EventHandler.prototype.handleControlDeleted=function(evtObj)
{
	try {
		var ctlId=evtObj.extraInfo;

		if (myDesign.active)
			myObject.setReload()
		else if (myObject.active)
			myDesign.editor.deleteElement(ctlId)

		// get reference to control node
		var ctlNode=myDoc.xmlDoc.selectSingleNode("//*[@id='"+ctlId+"']")
		// clone node for return purposes		
		var retNode=ctlNode.cloneNode(false);

		// call document remove content method
		myDoc.removeContent(ctlNode)
		// put field back in available pool
		myDoc.dsm.freeDataSrc(ctlNode)

		// delete the node?
		var bDelete = true;
		switch (ctlNode.nodeName.toLowerCase())
		{
			case "fld":
				if (ctlNode.getAttribute("tp") == "label"
				|| ctlNode.getAttribute("tp") == "rect")
					bDelete=(ctlNode.selectSingleNode("ancestor::detail") ? false : true);
				else
					bDelete = false;
				break;
			case "push":
			case "detail":
				bDelete=false;
				break;
			default:
				bDelete=true;
				break;
		}

		if (bDelete)
			ctlNode.parentNode.removeChild(ctlNode)
		else
		{
			// set type attribute to hidden and change id
			ctlNode.setAttribute("tp","Hidden")
			ctlNode.setAttribute("id","hidden"+myDoc.getUniqueID("Hidden","fld"))
		}

		// get the control object associated with element
		var control=myDoc.getControlObject(ctlId)
		if (!control) return retNode;

		// re-able singleuse control
		uiEnableToolbtn(control.id)

		// was this an object? (if so we have to disable object view)
		if (control.getRule("isObject")=="1" && !myObject.active)
			myObject.enableView(false);

		// in object view, show base element properties
		if (myObject.active)
		{
			// have to display base object without actually selecting it,
			// else undo will have base element HTML rather that the object
			// just deleted. so don't call myObject.selectBaseObject()...

			var baseElement=myObject.getBaseElement();
			top.dsPropArea.showIdProperties(baseElement);
			myDoc.activeControl = myDoc.getControlInstance(baseElement);
		}

		return retNode;

	} catch (e) { }
}

//-----------------------------------------------------------------------------
EventHandler.prototype.handleSwitchView=function(evtObj)
{
	switch (evtObj.extraInfo.activeView)
	{
	case "design":
		var formNode=myDoc.xmlDoc.selectSingleNode("/form")
		formNode.setAttribute("objmode","0")
		myDesign.editor.cwDoc.getElementById("form1").focus()
		if (myDesign.editor.selectedElements.count == 1)
		{
			var elem=myDesign.editor.selectedElements.item(0)
			myDoc.selectControlInstance(elem.id)
		}
		break;
	case "object":
		var formNode=myDoc.xmlDoc.selectSingleNode("/form")
		formNode.setAttribute("objmode",myObject.objLevel)
		// need a targetid if object is detail
		var objNode=myDoc.xmlDoc.selectSingleNode("//*[@id='"+myObject.getTargetElement()+"']")
		var control=myDoc.getControlObject(objNode?objNode.getAttribute("id"):"junk")
		formNode.setAttribute("targetid", control ? control.id: "junk")
		myObject.editor.cwDoc.getElementById(myObject.getBaseElement()).focus()
		if (myObject.editor.selectedElements.count == 1)
		{
			var elem=myObject.editor.selectedElements.item(0)
			myDoc.selectControlInstance(elem.id)
		}
		break;
	case "source":
		mySource.editor.cwDoc.getElementById("textBody").focus()
		break;
	case "script":
		myScript.editor.cwDoc.getElementById("textBody").focus()
		break;
	}
}

//-----------------------------------------------------------------------------
EventHandler.prototype.handleWindowActivated=function(evtObj)
{
	// designer window being activated: on load, from
	// minimized state, or from window menu item

	if (!myDoc || !myDoc.xmlDoc) return;
	if (myDoc.readyState != "complete") return;

	var vu=null
	if (myDesign.active)
		vu=myDesign
	else if (myObject.active)
		vu=myObject
	else if (mySource.active)
		vu=mySource
	else if (myScript.active)
	{
		vu=myScript
		if (myScript.editor.cwDoc)
		{
			var selWidgets = myScript.editor.cwDoc.getElementById("selWidgets");
			var selEvents = myScript.editor.cwDoc.getElementById("selEvents");
			var selObjects = myScript.editor.cwDoc.getElementById("selObjects");
			if (selWidgets) selWidgets.style.visibility = "visible";
			if (selEvents) selEvents.style.visibility = "visible";
			if (selObjects) selObjects.style.visibility = "visible";
		}
	}

	if (!vu) return;
	if (evtObj.extraInfo) return;		// if returning from minimized state,
										// framework already did setActive work.
	vu.setActive()
	vu.setToolboxState()
	if (vu.editor.cwDoc)
	{
		var textBody=vu.editor.cwDoc.getElementById("textBody")
		if (textBody) textBody.focus()
		else
		{
			vu.editor.cwDoc.body.focus()
			myDoc.selectControlInstance(vu.targetElement)
		}
	}
}

//-----------------------------------------------------------------------------
EventHandler.prototype.handleWindowInactivated=function(evtObj)
{
	if (!myDoc || !myDoc.xmlDoc) return;
	if (myDoc.readyState != "complete") return;

	if(myScript.active && myScript.editor.cwDoc)
	{
		var selWidgets = myScript.editor.cwDoc.getElementById("selWidgets");
		var selEvents = myScript.editor.cwDoc.getElementById("selEvents");
		var selObjects = myScript.editor.cwDoc.getElementById("selObjects");
		if(selWidgets) selWidgets.style.visibility = "hidden";
		if(selEvents) selEvents.style.visibility = "hidden";
		if(selObjects) selObjects.style.visibility = "hidden";
	}
}

