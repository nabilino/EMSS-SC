/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/wzdesigner/wzdesigner.js,v 1.7.28.2 2012/08/08 12:48:49 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// wzdesigner.js
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
var myCommands = null;				// my commandHandler implementation
var myDesigner = null;				// top.designStudio.activeDesigner
var myDesignView = null;			// my design view class
var myDoc = null;					// my activeDocument implementation
var myObject = null;				// my object view class
var mySourceView = null;			// my source view class

var bDocLoaded = false;
var bStyleSheetLoaded = false;
var keys=top.keys; // for maple
var oPreview = null;
var oPreviewXML = null;

var BRANCH_ID_TAG = "branch";
var BRANCH_TAG = "BRANCH";
var DESIGN_VIEW = "design";
var STEP_ID_TAG = "step";
var STEP_TAG = "STEP";
var WIZARD_ID_TAG = "wizard";
var WIZARD_TAG = "WIZARD";

var objPropPath="/cgi-lawson/objprop.exe";

//-----------------------------------------------------------------------------
function wzInitialize(evtObj)
{
	// save reference to designer and my active doc class
	myDesigner=top.designStudio.activeDesigner;
	myDesigner.versionNumber="9.0.1";
	myDesigner.buildNumber="11.231 2012-09-05 04:00:00";

	myDoc=myDesigner.activeDocument;
	myDoc.readyState="loading";

	// save reference to command handler
	myCommands=myDesigner.commandHandler;
	
	// add,initialize non-default views
	myDesignView=myDesigner.workSpace.views.item("design");
 	mySourceView=myDesigner.workSpace.addView("source", new SourceView());

	// initialize preview objects
	oPreviewXML=top.xmlFactory.createInstance("DOM");
	top.oPreview=new Object();

	// open a document
 	var ci = evtObj.extraInfo;
	if (ci.commandId == "ID_FILE_NEW")
 		myDoc.newDocument(ci);
 	else if (ci.commandId == "ID_FILE_OPEN")
 		myDoc.openDocument(ci);
		
	// complete initialization based on doc type
	myDesigner.showPropertyArea(true);
	if (myDoc.xmlDoc==null || myDoc.xmlFormDoc==null)
	{
		// xml doc did not load
		var layout=myDesignView.editor.cwDoc.getElementById("wizardDocument");
		if (layout)
			layout.setAttribute("isSelectable","0");
		wzDisableAllTools();
		if (myDoc)
			myDoc.setModifiedFlag(false);
		if (mySourceView)
			mySourceView.enableView(false);
		window.status="";
		window.setTimeout("top.designStudio.commandHandler.execute(\"ID_FILE_CLOSE\")",1000);		
		return;
	}

	// now that we have a document, tell
	// the script view to load the field elements
	myDesignView.setToolboxState();
	myDoc.readyState="complete";
	myDoc.setModifiedFlag(false);
	myDoc.selectFirstControlInstance();
	window.status="";
}

//-----------------------------------------------------------------------------
function wzCreateDOMFromString(xmlDef)
{
	// load the xml string in a DOM
	// returns null if failure.
	var oDOM=top.xmlFactory.createInstance("DOM");
 	oDOM.async=false;
 	oDOM.loadXML(xmlDef);
	if (oDOM.parseError.errorCode != 0)
	{
		top.displayDOMError(oDOM.parseError,"wizCreateDOMFromString()");
		return null;
	}
	return oDOM;
}

//-----------------------------------------------------------------------------
function wzDisableAllTools()
{
	// disable all tools
	var toolbox=myDesigner.toolBox;
	for (var i = 0; i < toolbox.controlGroups.count; i++)
	{
		var ctlGrp = toolbox.controlGroups.item(i);
		for (var j = 0; j < ctlGrp.controls.count; j++)
		{
			myDesigner.source.wzEnableToolbtn(ctlGrp.controls.item(j).id, false);
		}
	}
}

//-----------------------------------------------------------------------------
function wzEnableToolbtn(ctlId, fEnable)
{
	var bEnable = ( typeof(fEnable) == "boolean" ) ? fEnable : true;
	var control=myDesigner.toolBox.getControlObject(ctlId,"wzdesign")
	if (control)
	{
		if (bEnable)
			parent.dsToolBox.enableControl(control.id);
		else
			parent.dsToolBox.disableControl(control.id);
	}
}

//-----------------------------------------------------------------------------
function wzOnLoad()
{
	// called by index.htm when doc loaded
	bDocLoaded=true;
	// signal the framework we're ready to continue
	parent.designStudio.loadDesignerComplete();
}
