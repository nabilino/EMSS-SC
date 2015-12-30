/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/wzdesigner/wzevents.js,v 1.6.8.1.22.2 2012/08/08 12:48:48 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// wzevents.js
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
function EventHandler()
{
	// need this reference: can't use myDesigner since
	// some events fire before myDesigner reference is valid
	this.designer=top.designStudio.activeDesigner
}

//-----------------------------------------------------------------------------
EventHandler.prototype.handleBeforeSwitchView=function(evtObj)
{
	// allows view switch to proceed
	return true; 
}

//-----------------------------------------------------------------------------
EventHandler.prototype.handleControlDeleted=function(evtObj)
{
	try {
		var ctlId=evtObj.extraInfo;

		if (myDesignView.active)
			myObject.setReload()
		else if (myObject.active)
			myDesignView.editor.deleteElement(ctlId)

		// get reference to control node
		var ctlNode=myDoc.xmlDoc.selectSingleNode("//*[@id='"+ctlId+"']")

		// call document remove content method
		myDoc.removeContent(ctlNode)

		// get the control object associated with element
		var control=myDoc.getControlObject(ctlId)
		if (!control) return;

		// re-able singleuse control
		wizEnableToolbtn(control.id)
	
		// was this an object? (if so we have to disable object view)
		if (control.getRule("isObject")=="1" && !myObject.active)
			myObject.enableView(false);

	} catch (e) { }
}

//-----------------------------------------------------------------------------
EventHandler.prototype.handleSwitchView=function(evtObj)
{
	switch (evtObj.extraInfo.activeView)
	{
	case "design":
		var nodeId = myDoc.getCurControlId();
        if (nodeId)
            myDoc.selectControlInstance(nodeId);
        else
			nodeId = myDoc.selectFirstControlInstance();
		if (nodeId)
		{		
			if (myDoc.htmTree)
				myDoc.htmTree.openToId(nodeId);
			top.dsPropArea.showIdProperties(nodeId);
		}

        if (myDoc && myDoc.htmTree)
            myDoc.htmTree.focus();
		break;
	case "source":
		// cannot focus directly on textBody, since it is disabled
		mySourceView.editor.cwDoc.getElementById("textBody").select();
		mySourceView.editor.cwDoc.Script.focus()
		break;
	}
}

//-----------------------------------------------------------------------------
EventHandler.prototype.handleWindowActivated=function(evtObj)
{
	// copied from uievents.js
	// need this when the window activates to make sure we restore the
	// property area, and to disable someone else's selected controls
	
	// designer window being activated: on load, from
	// minimized state, or from window menu item

	if (!myDoc || !myDoc.xmlDoc) return;
	if (myDoc.readyState != "complete") return;

	var vu=null;
	if (myDesignView.active)
		vu=myDesignView;
	else if (mySourceView.active)
		vu=mySourceView;

	if (!vu) return;
	if (evtObj.extraInfo) return;	// if returning from minimized state,
									// framework already did setActive work.
	vu.setActive();
	vu.setToolboxState();
	if (vu.editor.cwDoc)
	{
		if (vu==mySourceView)
		{
			var textBody=vu.editor.cwDoc.getElementById("textBody")
			textBody.select();
			vu.editor.cwDoc.Script.focus();
		}
		else if (vu==myDesignView)
		{
			// need this to clear other designer's grabbers
			vu.editor.cwDoc.Script.focus();
			
			var nodeId = myDoc.getCurControlId();
	        if (nodeId)
	            myDoc.selectControlInstance(nodeId);
	        else
				nodeId = myDoc.selectFirstControlInstance();
			if (nodeId)
			{		
				if (myDoc.htmTree)
					myDoc.htmTree.openToId(nodeId);
				top.dsPropArea.showIdProperties(nodeId);
			}
	
	        if (myDoc && myDoc.htmTree)
	            myDoc.htmTree.focus();
		}
	}
}

//-----------------------------------------------------------------------------
EventHandler.prototype.processEvent=function(evtObj)
{
	switch(evtObj.eventId)
	{
	case top.ON_BEFORE_PA_CLEAR:
		return false;	// never clear property area!
		break;
				
	case top.ON_BEFORE_SWITCH_VIEW:
		return (this.handleBeforeSwitchView(evtObj));
		break;
		
 	case top.ON_CLICK_PROPAREA_BROWSEBTN:
 		myDoc.handlePropertyBrowse(evtObj);                                                         
 		break;                                                                                      
 		          
	case top.ON_CONTROL_INSTANCE_CREATED:
		if (!myDoc.loading)
		{
			var ctlId=evtObj.extraInfo.id;
			top.dsPropArea.showIdProperties(ctlId);
			
			if (myDoc)
			{
				var step=myDoc.getStep(ctlId);
				var type="wzadd";
				var wzCommand = new WzCommand(type, step);
				myDoc.commandHistory.add(wzCommand);
				wzCommand.execute();
			}
		}
		break;
			                                                                                  
 	case top.ON_CONTROL_INSTANCE_DELETED:
		return null;
 		break;                                                                                      
 		                                                                                            
	case top.ON_DOCUMENT_INITIALIZED:
		wzInitialize(evtObj);
		break;

	case top.ON_LOAD_DESIGNER_COMPLETE:
		this.designer.workSpace.addView("design", new WzDesignView());
		break;

	case top.ON_PROPERTY_CHANGE:
  		myDoc.handlePropertyChange(evtObj);                                                      
  		break;   
		
	case top.ON_PROPERTYAREA_PAINTED:                                                               
 		myDoc.handlePropertyAreaPainted(evtObj);
 		break;                                                                                      
                                                                                                  
 	case top.ON_PROPERTYPAGE_RETURN:                                                               
 		myDoc.handlePropertyPageReturn(evtObj);                                                   
 		break;                                                                                     

	case top.ON_SWITCH_VIEW:
		this.handleSwitchView(evtObj);
		break;

	case top.ON_WINDOW_ACTIVATE:
		this.handleWindowActivated(evtObj);
		break;
	
	case top.ON_WINDOW_INACTIVATE:
		break;
	}
	return true;
}
