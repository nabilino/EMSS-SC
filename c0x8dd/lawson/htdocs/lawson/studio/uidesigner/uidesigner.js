/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/uidesigner.js,v 1.2.4.1.26.2 2012/08/08 12:48:51 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// uidesigner.js
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

var myDesigner=null					// top.designStudio.activeDesigner
var myCommands=null					// my commandHandler implementation
var myDoc=null						// my activeDocument implementation
var myDesign=null					// my design view class
var myObject=null					// my object view class
var mySource=null					// my source view class
var myScript=null					// my script view class

var bDocLoaded=false;
var bStyleSheetLoaded=false;
var oPreviewXML=null;

//-----------------------------------------------------------------------------
function uiOnLoad()
{
	bDocLoaded=true;
	// signal the framework we're ready to continue?
	if (bStyleSheetLoaded)
		parent.designStudio.loadDesignerComplete();
}

//-----------------------------------------------------------------------------
function uiStyleLinkReadyChange()
{
	if(StyleLink.readyState == "complete" )
	{
		bStyleSheetLoaded=true;
		// signal the framework we're ready to continue?
		if (bDocLoaded)
			parent.designStudio.loadDesignerComplete();
	}
}

//-----------------------------------------------------------------------------
function uiInitialize(evtObj)
{
	// save reference to designer and my active doc class
	myDesigner=top.designStudio.activeDesigner;
	myDesigner.versionNumber="9.0.1"
	myDesigner.buildNumber="11.231 2012-09-05 04:00:00"

	myDoc=myDesigner.activeDocument;
	myDoc.readyState="loading"

	// save reference to command handler
	myCommands=myDesigner.commandHandler;

	// add,initialize non-default views
	myDesign=myDesigner.workSpace.views.item("design")
	myObject=myDesigner.workSpace.addView("object", new ObjectView());
	myObject.enableView(false);
	mySource=myDesigner.workSpace.addView("source", new SourceView());
	myScript=myDesigner.workSpace.addView("script", new ScriptView());

	// initialize preview objects
	oPreviewXML=top.xmlFactory.createInstance("DOM");
	top.oPreview=new Object();

	// open a document
 	var ci = evtObj.extraInfo
 	if (ci.commandId == "ID_FILE_NEW")
 		myDoc.newDocument()
 	else if (ci.commandId == "ID_FILE_OPEN")
	{
		if (ci.provId == "local")
 			myDoc.openLocalDocument()
		else
 			myDoc.openRemoteDocument()
	}

	// complete initialization
	myDesigner.showPropertyArea(true);
	if (myDoc.xmlDoc==null)
	{
		// xml doc did not load
		var layout=myDesign.editor.cwDoc.getElementById("form1")
		layout.setAttribute("isSelectable","0")
		uiDisableAllTools();
		myDoc.setModifiedFlag(false);
		mySource.enableView(false);
		myScript.enableView(false);
		window.status="";
		return;
	}

	// now that we have a document, tell
	// the script view to load the field elements
	myScript.loadFieldXML()
	myDesign.setToolboxState()
	myDoc.readyState="complete"
	myDoc.setModifiedFlag(false);
	myDoc.selectControlInstance("form1")
	myDesign.editor.cwDoc.getElementById("form1").focus()

	window.status="";
}

//-----------------------------------------------------------------------------
function uiOnSelectChange()
{
	switch (this.id)
	{
	case "selWidgets":
		myScript.onWidgetChange(this.value)
		break;
	case "selEvents":
		myScript.onEventChange(this.value)
		break;
	case "selObjects":
		myScript.onObjectChange(this.value)
		break;
	}
}

//-----------------------------------------------------------------------------
function uiOnObjectButtonClick()
{
	switch (this.id)
	{
	case "btnParentObj":
		myObject.parentObjectView();
		break;
	case "btnChildObj":
		myObject.childObjectView();
		break;
	case "btnObjProps":
		myObject.selectBaseObject();
		break;
	}
}

//-----------------------------------------------------------------------------
function uiDisableAllTools()
{
	// disable all tools
	var toolbox=myDesigner.toolBox
	for ( var i = 0; i < toolbox.controlGroups.count; i++)
	{
		var ctlGrp = toolbox.controlGroups.item(i);
		for (var j = 0; j < ctlGrp.controls.count; j++)
		{
			var control = ctlGrp.controls.item(j);
			myDesigner.source.uiEnableToolbtn(control.id, false)
		}
	}
}

//-----------------------------------------------------------------------------
function uiEnableToolbtn(ctlId, fEnable)
{
	var bEnable = ( typeof(fEnable) == "boolean" ) ? fEnable : true;
	var control=myDesigner.toolBox.getControlObject(ctlId,"lawform")
	if (control)
	{
		if (bEnable)
			parent.dsToolBox.enableControl(control.id)
		else
			parent.dsToolBox.disableControl(control.id)
	}
}

//-----------------------------------------------------------------------------
function uiCreateDOMFromString(xmlDef)
{
	// load the xml string in a DOM
	var oDOM=top.xmlFactory.createInstance("DOM");
 	oDOM.async=false
 	oDOM.loadXML(xmlDef)
	if (oDOM.parseError.errorCode != 0)
	{
		top.displayDOMError(oDOM.parseError,"uiCreateDOMFromString()")
		return null;
	}
	return oDOM
}
