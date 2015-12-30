/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/wzdesigner/wzdocument.js,v 1.16.6.1.20.4 2012/08/08 12:48:49 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// wzdocument.js
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
ActiveDocument.prototype = new parent.DefaultDocument();
ActiveDocument.prototype.constructor = ActiveDocument;
ActiveDocument.superclass = parent.DefaultDocument.prototype;

//-----------------------------------------------------------------------------
function ActiveDocument()
{
	ActiveDocument.superclass.initialize.call(this);
	
	this.arrHelpText = new Array(); // for remembering array help info
	this.ci=null; // command info for reload
	this.dsm = null; // DataSrcMgr references
	this.fileName = "";
	this.htmDoc = null; // HTML Page for designView.
	this.htmTree = null; // treeview on designer of XML doc
	this.isRedrawing = false;
	this.lastControl = ""; // for debugging, error display
	this.lastControlId = "";
	this.lastFocus = null;
	this.leaf = null;
	this.loading = false;
	this.mainHost = "wizardDocument";
	//this.primaryNodesOpen = true;
	this.selLeaf = null;
	this.xmlDoc = null; // contains the wizard definition
	this.xmlFormDoc=null; // contains the form Definition

	this.pdl = ""; // used to be dataID, changed
	this.provId = "";
	this.sysId = "";
	this.tknId = "";
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.addNewBranch=function()
{
	// prompts the user for a branch name
	// return new XML branch node if created
	// returns null if no branch added
	// called by createNewNode
	var curNode = this.getCurNode();
	if (!curNode)
	{
		// invalid location dialog
		var	msg=myDesigner.stringTable.getPhrase("MSG_INVALID_BRANCH_LOCATION");
		parent.cmnDlg.messageBox(msg,"ok","stop");
		return null;
	}

	if (this.canAddNewBranch(curNode))
	{
		// request branch name
		var name=this.dlgBranchName(this.getUniqueTest(BRANCH_TAG));
 		if (typeof(name) == "undefined" || !name)
 			return null;
		return this.XMLAddBranch(name, curNode);
	}
	else
	{
		// invalid location dialog
		var	msg=myDesigner.stringTable.getPhrase("MSG_INVALID_BRANCH_LOCATION");
		parent.cmnDlg.messageBox(msg,"ok","stop");
		return null;
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.addNewStep=function()
{
	// prompts the user for the step field
	// return new XML step node if created
	// returns null if no step added
	// called by createNewNode
	var curNode = this.getCurNode();
	if (!curNode)
	{
		// invalid location dialog
		var	msg=myDesigner.stringTable.getPhrase("MSG_INVALID_STEP_LOCATION");
		parent.cmnDlg.messageBox(msg,"ok","stop");
		return null;
	}
	
	if (this.canAddNewStep(curNode))
	{
		// request step name
		var name=this.dlgStepName("");
 		if (typeof(name) == "undefined" || !name) 
 			return null;
		return this.XMLAddStep(name, curNode);
	}
	else
	{
		// invalid location dialog
		var	msg=myDesigner.stringTable.getPhrase("MSG_INVALID_STEP_LOCATION");
		parent.cmnDlg.messageBox(msg,"ok","stop");
		return null;
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.addNewWizard=function()
{
	// returns new XML wizard node
	// called by createNewNode, loadTemplate
	return this.XMLAddWizard();
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.buildCtl=function(node)
{
	// called from buildCtlFromNode, createControlInstance
	if (!node) return;
	var ds=new top.DataStorage();
	var ctlId=node.getAttribute("id");
	ds.add("id",ctlId);
	switch (node.nodeName)
	{
	case BRANCH_TAG:
		ds.add("test",node.getAttribute("test"));
		break;
	case STEP_TAG:
		var fld=node.getAttribute("fld");
		var type=node.getAttribute("type");
		var FC=node.getAttribute("FC");
		if (!fld)
		{
			var lbl = node.previousSibling ? "lblEndWz":"lblStartWz";
			type = myDesigner.stringTable.getPhrase(lbl);
		}
		ds.add("fld",fld);
		ds.add("type",type);
		ds.add("FC",FC);
		break;
	case WIZARD_TAG:
		var ctlName=node.getAttribute("name");
		ds.add("name",ctlName);
	}
	// call the frame work default implementation to create control instance.
	var ctlName = node.nodeName.toLowerCase();
	ActiveDocument.superclass.createControlInstance.call(this, ctlName, ds, false);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.buildCtlFromNode=function(node)
{
	// called from buildCtlsFromDoc
	// build the clt instance for this node
	this.buildCtl(node);

	// now recursively build the children
	var children=node.childNodes;
	var len = (children?children.length:0);
	for (var i=0;i<len;i++)
	{
		switch (children[i].nodeName)
		{
		case BRANCH_TAG:
		case WIZARD_TAG:
		case STEP_TAG:
			this.buildCtlFromNode(children[i],false);
			break;
		}			
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.buildCtlsFromDoc=function()
{
	// called from openDocument
	// recursively build all wizard nodes
	var wizards = this.getXMLContent().childNodes;
	var len = wizards?wizards.length:0;
	for (var i=0;i<len;i++)
	{
		switch (wizards[i].nodeName)
		{
		case WIZARD_TAG:
			this.buildCtlFromNode(wizards[i]);
			break;
		}			
	}
	
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.buildDisplay=function()
{
	// peformance enhancement - this routine completely removes the old maple
	// and builds a free one from scratch.
 	try {
		var treeElem=myDesignView.editor.cwDoc.getElementById("uTree");
		treeElem.innerHTML = "";
		this.htmTree=new Maple(treeElem,false);
		this.htmTree.buildTreeFromXML(this.xmlDoc);
		this.htmTree.focus();
		myDesignView.editor.cwDoc.body.style.display='inline';
	} catch (e) { 
		var msg="Error in buildDisplay, last control = '" + this.lastControl +
			"' last control id = '"+this.lastControlId +"'.\nError description:\n"+e.description;
		top.cmnDlg.messageBox(msg,"ok","stop");
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.canAddNewBranch=function(node)
{
	var retVal=false;
	switch (node.nodeName)
	{
	case BRANCH_TAG:
	case WIZARD_TAG:
		break;
	case STEP_TAG:
		// false if start/end wizard step
		retVal = (node.getAttribute("fld") ? true : false);
		break;
	}
	return retVal;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.canAddNewStep=function(node)
{
	var retVal=false;
	switch (node.nodeName)
	{
	case BRANCH_TAG:
	case STEP_TAG:
		retVal=true;
		break
	case WIZARD_TAG:
		break;
	}
	return retVal;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.canDeleteNode=function(node)
{
	if (!node)
		return false;
	var type=node.tagName;
	switch (type.toUpperCase())
	{
	case BRANCH_TAG:
		return true;
		break;
	case STEP_TAG:
		var fld=node.getAttribute("fld");
		return (fld?true:false);
		break;
	case WIZARD_TAG:
		var arrWizards=this.xmlDoc.selectNodes("//"+WIZARD_TAG);
		var lenWizards=(arrWizards?arrWizards.length:0);
		return (lenWizards>1) ? true : false;
		break;
	}
	return false;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.copyNodeId=function(node)
{
	// updates ids
	var id=node.getAttribute("id");
	
	// similar to DefaultDocument.copyControlInstance
	if (id)
	{
		var type=node.nodeName;
		id=this.getUniqueID(type);
		node.setAttribute("id",id);
		
		// recursively update child elements
		var len = (node.childNodes?node.childNodes.length:0);
		for (var i=0;i<len;i++)
		{
			if (node.childNodes[i].nodeType == 1)
				this.copyNodeId(node.childNodes[i]);
		}
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.canPerformCurrent=function(action, dependentNode)
{
	var curNode = this.getCurNode();
	if (!curNode)
		return false;
		
	switch (action.toLowerCase())
	{
	case "copy":
		// we are not concerned about not deleting, but the logic is the same
		return this.canDeleteNode(curNode);
		break;
	case "cut":
		return this.canDeleteNode(curNode);
		break;
	case "delete":
		return this.canDeleteNode(curNode);
		break;
	case "paste":
		switch (dependentNode.tagName.toUpperCase())
		{
			case BRANCH_TAG:
				return this.canAddNewBranch(curNode);
				break;
			case STEP_TAG:
				return this.canAddNewStep(curNode);
				break;
			case WIZARD_TAG:
				return true;
				break;
		}
		break;
	case "shiftup":
		var s=curNode.previousSibling;
		switch (curNode.tagName.toUpperCase())
		{
			case BRANCH_TAG:
			case WIZARD_TAG:
				return (s)?true:false;
				break;
			case STEP_TAG:
				return (s && s.getAttribute("fld") && curNode.getAttribute("fld"))?true:false;
				break;
		}
		break;
	case "shiftdown":
		var s=curNode.nextSibling;
		switch (curNode.tagName.toUpperCase())
		{
			case BRANCH_TAG:
			case WIZARD_TAG:
				return (s)?true:false;
				break;
			case STEP_TAG:
				return (s && s.getAttribute("fld") && curNode.getAttribute("fld"))?true:false;
				break;
		}
		break;
	}
	return false;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.copyNode=function(node)
{
	// returns a copied XML node, with updated ids
	var ret = node.cloneNode(true);
	this.copyNodeId(ret);
	return ret;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.createControlInstance=function(ctlId)
{
	// creates a new node based on ctlId of branch, step or wizard
	var node = this.createNewNode(ctlId);
	if (node)
	{
		this.buildCtlFromNode(node);
		this.buildDisplay();
		var nodeId=node.getAttribute("id");
		if (this.htmTree)
			this.htmTree.openToId(nodeId);
		top.dsPropArea.showIdProperties(nodeId);
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.createNewNode=function(ctlId)
{
	// returns the new node type
	// returns null if could not create
	switch (ctlId.toUpperCase())
	{
	case BRANCH_TAG:
		return this.addNewBranch();
		break;
	case STEP_TAG:
		return this.addNewStep();
		break;
	case WIZARD_TAG:
		return this.addNewWizard();
		break;
	}
	return null;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.didSelectLeaf=function(leaf)
{
	//if (this.leaf==leaf)
	// 	return;
	if (leaf)
	{	
		switch (leaf.xml.nodeName.toUpperCase())
		{
		case STEP_TAG:
			this.helpTextAction("show");
			break;
		case BRANCH_TAG:
		case WIZARD_TAG:
		default:
			this.helpTextAction("hide");
			break;
		}
		this.helpTextAction("set",leaf.getHelpText());
		var ctlId = leaf.xml.getAttribute("id");
		var ctl = this.getControlInstance(ctlId);
		if (this.activeControl!=ctl)
			this.selectControlInstance(ctlId);
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.dlgBranchName=function(name)
{
	var dlgArgs = new Array();
 	dlgArgs[0] = top;
 	dlgArgs[1] = name;
	dlgArgs[2] = myDesigner.source;

	var strDlgPath=top.designStudio.path+"/wzdesigner/dialogs/testcondition.htm";
 	var strFeatures="dialogWidth:320px;dialogHeight:140px;center:yes;help:no;scroll:no;status:no;";
	return window.showModalDialog(strDlgPath, dlgArgs, strFeatures);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.dlgStepFC=function(FC)
{
	var dlgArgs = new Array();
	dlgArgs[0] = top;
	dlgArgs[1] = FC;
	dlgArgs[2] = myDesigner.source;
	dlgArgs[3] = this.xmlFormDoc;
	
	var strDlgPath=top.designStudio.path+"/wzdesigner/dialogs/fc.htm";
	var strFeatures="dialogWidth:320px;dialogHeight:240px;center:yes;help:no;scroll:no;status:no;";
	return window.showModalDialog(strDlgPath, dlgArgs, strFeatures);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.dlgStepName=function(name)
{
	var dlgArgs = new Array();
	dlgArgs[0] = top;
	dlgArgs[1] = name;
	dlgArgs[2] = myDesigner.source;
	dlgArgs[3] = this.dsm.getAvailableFields();
	dlgArgs[4] = this.xmlFormDoc;
	
	var strDlgPath=top.designStudio.path+"/wzdesigner/dialogs/datafld.htm";
	var strFeatures="dialogWidth:600px;dialogHeight:360px;center:yes;help:no;scroll:no;status:no;";
	return window.showModalDialog(strDlgPath, dlgArgs, strFeatures);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.doCollapseAll=function()
{
	if (this.htmTree)
		this.htmTree.collapseAll();
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.doDelete=function()
{
	// delete the current selected node
	var curNode = this.getCurNode();
	if (curNode && this.canDeleteNode(curNode))
		this.doDeleteNode(curNode);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.doDeleteNode=function(node)
{
	// remember parent
	var nodeId=node.getAttribute("id");
	var parentNodeId=node.parentNode.getAttribute("id");

	// don't know how this could happen but it would be bad if it did
	if (this.mainHost==nodeId)
		return;

	// need to delete child nodes as well
	var arrBranches = node.selectNodes(BRANCH_TAG);
	var lenBranches = (arrBranches?arrBranches.length:0);
	var arrSteps = node.selectNodes(STEP_TAG);
	var lenSteps = (arrSteps?arrSteps.length:0);
	
	this.XMLDelete(node);
	
	// delete child branches
	for (var i=lenBranches-1;i>=0;i--)
	{
		var branchId=arrBranches[i].getAttribute("id");
		this.deleteControlInstance(branchId,false);
	}
	
	// delete child steps
	for (var i=lenSteps-1;i>=0;i--)
	{
		var stepId=arrSteps[i].getAttribute("id");
		this.deleteControlInstance(stepId,false);
	}

	// delete control
	this.deleteControlInstance(nodeId,false);

	// rebuild tree
	// ideally we could just tell the parent node in the tree to rebuild based on its xml
	this.buildDisplay();

	// selects current control id
	if (this.htmTree)
		this.htmTree.openToId(parentNodeId);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.doExpandAll=function()
{
	if (this.htmTree)
		this.htmTree.expandAll();
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.doPreview=function()
{
	if (!this.xmlDoc) return;

	oPreviewXML.async=false;
	oPreviewXML.loadXML(this.getXMLContent().xml);
	if (oPreviewXML.parseError.errorCode != 0)
	{
		top.displayDOMError(this.xmlFormDoc.parseError,"preview")
		return;
	}
	this.preview();
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getCurControlId=function()
{
	var ret = this.activeControl ? this.activeControl.id : "";
	if (!ret)
	{
		var tree = this.getTree();
		if (tree)
		{
			var leaf = tree.getSelLeaf();
			if (leaf)
				ret = leaf.xml.getAttribute("id");
		}
	}
	return ret;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getCurrentFieldName=function()
{
	// called from helpTextAction
	var curNode = this.getCurNode();
	return curNode ? curNode.getAttribute("fld") : "";
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getCurrentTagName=function()
{
	// called from helpTextAction
	var curNode = this.getCurNode();
	return curNode ? curNode.tagName : "";
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getCurNode=function()
{
	var curId = this.getCurControlId();
	return ( this.getStep( curId ) );
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getCurStep=function()
{
	var curSel = this.getTree().getSelLeaf();
	return curSel ? curSel.xml : null;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getDesignerId=function(id)
{
	return parentWin.designStudio.userInfo.designers.item(id);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getFirstWizard=function()
{
	return this.xmlDoc.selectSingleNode("//WIZARD[not(@deleted) or not(@deleted='1')]");
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getLastCutCopy=function()
{
	// returns the last cut or copy command, or null if not found
	var ret = null;
	var commands=this.commandHistory.commands.items();
	var len=(commands?commands.length:0);
	for (var i=len-1;i>=0 && !ret;i--)
	{
		var wzCommand = commands[i].item(commands[i].hash[0]);
		switch (wzCommand.type)
		{
		case "wzcopy":
		case "wzcut":
			ret=wzCommand;
			break;
		}
	}
	return ret;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getStep=function(id)
{
	return ( this.xmlDoc.selectSingleNode("//*[@id='" + id + "']") );
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getTest=function(test)
{
	return ( this.xmlDoc.selectSingleNode("//*[@test='" + test + "']") );
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getRedraw=function()
{
	return this.isRedrawing;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getSaveContents=function()
{
	return this.getXMLContent().xml;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getTree=function()
{
	return this.htmTree;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getUniqueID=function(type)
{
	// based on type, construct a unique id - unique to this document
	var elementType = "";
	var elementIdx = 0;
	switch (type.toUpperCase())
	{
	case BRANCH_TAG:
		elementType = BRANCH_ID_TAG;
		break;
	case STEP_TAG:
		elementType = STEP_ID_TAG;
		break;
	case WIZARD_TAG:
		elementType = WIZARD_ID_TAG;
		break;
	}
	while(this.getStep(elementType + elementIdx))
	{
		elementIdx++;
	}
	return elementType + elementIdx;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getUniqueTest=function(type)
{
	// based on type, construct a unique test - unique to this document
	// used only for branch nodes
	var elementType = "";
	var elementIdx = 0;
	switch (type.toUpperCase())
	{
	case BRANCH_TAG:
		elementType = BRANCH_ID_TAG;
		break;
	}
	while(this.getTest(elementType + elementIdx))
	{
		elementIdx++;
	}
	return elementType + elementIdx;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getWizard=function(ctlNode)
{
	// calls self recursively,
	// called from preview
	var ret = null;
	if (ctlNode)
	{
		switch (ctlNode.nodeName.toUpperCase())
		{
		case BRANCH_TAG:
		case STEP_TAG:
			ret = this.getWizard(ctlNode.parentNode);
			break;
		case WIZARD_TAG:
			ret = ctlNode;
			break;
		}
	}
	return ret;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getWizardFirstStep=function(wz)
{
	var arr=wz.selectNodes("//STEP");
	return (arr && arr.length) ? arr[0]:null;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.getXMLContent=function(baseNode)
{
	// returns a version of the xml that has the deleted nodes
	// trimmed, and the deleted attribute removed.
	
	// if baseNode is passed, use it, otherwise assume WIZARDS node
	if (!baseNode)
		baseNode=this.xmlDoc.selectSingleNode("//WIZARDS");
	baseNode=baseNode.cloneNode(true);
	
	// remove deleted nodes
	var node=baseNode.selectSingleNode("//*[@deleted='1']");
	while (node)
	{
		node.parentNode.removeChild(node);
		node=baseNode.selectSingleNode("//*[@deleted='1']");
	}
	
	// remove deleted attribute from remaining nodes
	node=baseNode.selectSingleNode("//*[@deleted='0']");
	while (node)
	{
		node.removeAttribute("deleted");
		node=baseNode.selectSingleNode("//*[@deleted='0']");
	}
	return baseNode;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.handlePropertyAreaPainted=function(evtObj)
{
	// called by EventHandler.processEvent
	// the property area has been freshly painted, 
	// so let's disable or enable properties there	
	if (!evtObj || !evtObj.extraInfo) return;
	{
		var oPropInfo=evtObj.extraInfo;
		var ctlName=oPropInfo.ctlInstId;
		var ctlNode=this.xmlDoc.selectSingleNode("//*[@id='"+ctlName+"']")
		if (!ctlNode) return;
		
		// disable buttons for start and end steps
		var fld=ctlNode.getAttribute("fld");
		if (!fld)
		{
			top.dsPropArea.disable("btn_fld");
			parent.dsToolBox.disableControl("branch");
		}
		else
			parent.dsToolBox.enableControl("branch");			
	
		// update maple
	 	if (this.htmTree)
			this.htmTree.openToId(ctlName);
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.handlePropertyBrowse=function(evtObj)
{
	// called by Event.processEvent
	// user has clicked on browse "..." in property pane
 	var oPropInfo=(evtObj?evtObj.extraInfo:null);
 	if (!oPropInfo) return;
	
 	var propName=oPropInfo.getItem("propName").value;
 	switch (propName)
 	{
 	case "FC":
		this.handlePropertyBrowseFC(oPropInfo);
 		break;

 	case "fld":
		this.handlePropertyBrowseFld(oPropInfo);
 		break;

 	case "test":
		this.handlePropertyBrowseTest(oPropInfo);
 		break;
 	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.handlePropertyBrowseFC=function(oPropInfo)
{
	// step - FC property
 	var ctlName = oPropInfo.getItem("ctlName").value;
	var ctlInst = this.getControlInstance(ctlName);	

	// if this is the initial or final step of the wizard, do not edit
	var ctlType=ctlInst.get("type");
	if (!ctlType)
	{
		// invalid property dialog
		var	msg=myDesigner.stringTable.getPhrase("MSG_INVALID_STEP_PROPERTY");
		parent.cmnDlg.messageBox(msg,"ok","stop");
		return;
	}

 		// open the dialog window
	var FC=ctlInst.get("FC");
	FC = this.dlgStepFC(FC);
	if (!FC)
		return;
		
	if (FC.toLowerCase()=="none")
		FC="";

	// update property pane
 	var propName=oPropInfo.getItem("propName").value;
	top.dsPropArea.updateBrowseValue(ctlName, propName, FC);
	
	// update control
	this.updateCtl(ctlName,propName,FC);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.handlePropertyBrowseFld=function(oPropInfo)
{
	// step - fld property
 	var ctlName = oPropInfo.getItem("ctlName").value;
	var ctlInst = this.getControlInstance(ctlName);	

	// if this is the initial or final step of the wizard, do not edit
	var ctlType=ctlInst.get("type");
	if (!ctlType)
	{
		// invalid property dialog
		var	msg=myDesigner.stringTable.getPhrase("MSG_INVALID_STEP_PROPERTY");
		parent.cmnDlg.messageBox(msg,"ok","stop");
		return;
	}

	// open the dialog window
	var ctlSource=ctlInst.get("fld");
	var retVal = this.dlgStepName(ctlSource);
	if (!retVal)
		return;

	// retval contains the string and the type			
	var fldName=retVal.split("/")[0];
	
	// update property pane
 	var propName=oPropInfo.getItem("propName").value;
	top.dsPropArea.updateBrowseValue(ctlName, propName, fldName);
	
	// update control
	this.updateCtl(ctlName,propName,fldName);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.handlePropertyBrowseTest=function(oPropInfo)
{
	// branch - test property
 	var ctlName = oPropInfo.getItem("ctlName").value;
	var ctlInst = this.getControlInstance(ctlName);	

	// open the dialog window
	var ctlTest=ctlInst.get("test");
	var retVal = this.dlgBranchName(ctlTest);
	if (!retVal)
		return;
		
	var test=retVal;

	// update property pane
 	var propName=oPropInfo.getItem("propName").value;
	top.dsPropArea.updateBrowseValue(ctlName, propName, test);
	
	// update control
	this.updateCtl(ctlName,propName,test);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.handlePropertyChange=function(evtObj)
{
	// called by Event.processEvent
 	var oPropInfo=(evtObj?evtObj.extraInfo:null);
 	if (!oPropInfo) return;
	var ilen = (oPropInfo.selectedElements ? oPropInfo.selectedElements.count : 0);
 	for (var i = 0; i < ilen; i++)
 	{
		// update controls
  		var ctlId=oPropInfo.selectedElements.hash[i];
		var ctl=oPropInfo.selectedElements.item(ctlId);
		var jlen = ctl.length;
		for (var j=0;j<jlen;j++)
		{
			var propId=ctl.items[j].name;
			var val=ctl.items[j].value;
			this.updateCtl(ctlId, propId, val);
		}
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.helpTextAction=function(action,param)
{
	switch (action)
	{
	case "change":
		var helpText = myDesignView.getTextContent();
		this.helpTextSetXML(this.getCurStep(), helpText);
		break;
	case "clear":
		this.helpTextAction("set","");
		var curStep=this.getCurStep();
		if (curStep)
			this.helpTextSetXML(curStep, "");
		break;
	case "hide":
		//myDesignView.editor.cwDoc.all.edtBtns.style.visibility = "hidden";
		//myDesignView.editor.cwDoc.all.edtFrame.style.visibility = "hidden";
		myDesignView.editor.cwDoc.all.textBody.value = "";
		myDesignView.editor.cwDoc.all.textBody.disabled = true;
		myDesignView.editor.cwDoc.all.clearBtn.disabled = true;
		myDesignView.editor.cwDoc.all.resetBtn.disabled = true;
		break;
	case "reset":
		var fld = this.getCurrentFieldName();
		var helpText="";
		var step = this.getCurStep();
		if (fld)
		{
			helpText = this.helpTextRetrieve(fld);
		}
		else
		{
			var lbl = step.previousSibling ? "lblEndWz":"lblStartWz";
			helpText = myDesigner.stringTable.getPhrase(lbl);
		}
		this.helpTextSetXML(step, helpText);
		//this.htmTree.setControlById(this.curControlId);
		this.helpTextAction("set",helpText);
		break;
	case "set":
		myDesignView.editor.setTextContent(param);
		break;
	case "show":
		//myDesignView.editor.cwDoc.all.edtBtns.style.visibility = "visible";
		//myDesignView.editor.cwDoc.all.edtFrame.style.visibility = "visible";
		myDesignView.editor.cwDoc.all.textBody.value = "";
		myDesignView.editor.cwDoc.all.textBody.disabled = false;
		myDesignView.editor.cwDoc.all.clearBtn.disabled = false;
		myDesignView.editor.cwDoc.all.resetBtn.disabled = false;
		break;
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.helpTextRetrieve=function(fld)
{
	// returns from the database, the help text, as a string
	// returns "" if error

	// we cache in the designer document, the ones we have previously
	// looked up in this session. if stored value return it.
	if (this.arrHelpText[fld])
		return this.arrHelpText[fld];
	
	var retVal="";
	try
	{
		var strObjProp = "?_PDL=" + this.pdl + "&_TKN=" + this.tknId.toUpperCase()
			+ "&_FLD="+fld + "&_OUT=XML"

		var domXML=top.SSORequest(objPropPath+strObjProp);
		if(!domXML || domXML.status)
		{
			var msg="Error retrieving object properties.\n";
			if (domXML)
				msg+=studioWnd.getHttpStatusMsg(domXML.status) + 
					"\nServer response: " + domXML.statusText + " (" + domXML.status + ")" 
			domXML=null;
			studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
			return ("");
		}
		
		domXML.setProperty("SelectionLanguage","XPath");
		var fldNode=domXML.selectSingleNode("//prop[@scrfld='"+fld+"']")
		var descNode=descNode=fldNode?fldNode.selectSingleNode("description"):null;
		retVal=(descNode?descNode.text:"");

	} catch(e) {
		top.cmnDlg.messageBox(e,"ok","stop")
		retVal="";
	}
	// store for speed
	this.arrHelpText[fld]=retVal;
	return (retVal);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.helpTextSetXML=function(stepNode, helpText)
{
	// updates INFO element
	var cData = this.xmlDoc.createCDATASection(helpText);
	var newNode = this.xmlDoc.createElement("INFO");
	newNode.appendChild(cData);
 	if (stepNode.hasChildNodes())
 	{
		var oldNode = stepNode.getElementsByTagName("INFO").nextNode();
		stepNode.replaceChild(newNode, oldNode);
 	}
 	else
 	{
		stepNode.appendChild(newNode);
 	}
	this.setModifiedFlag();
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.loadForm=function(pdl,tkn)
{
	var api=top.servicesPath+"/Xpress?"
		+"&_PDL="+pdl+"&_TKN="+tkn+"&_CONTENTDIR="+top.contentPath;

	this.xmlFormDoc=top.SSORequest(api);
	if (!this.xmlFormDoc || this.xmlFormDoc.status)
	{
		var msg=myDesigner.stringTable.getPhrase("ERR_XPRESS")+".\n"
		if (this.xmlFormDoc)
			msg+=top.getHttpStatusMsg(this.xmlFormDoc.status) + 
				"\nServer response: " + this.xmlFormDoc.statusText + " (" + this.xmlFormDoc.status + ")";
		top.cmnDlg.messageBox(msg,"ok","stop");
		this.xmlFormDoc=null;
		return false;
	}
	// valid return status, now validate
 	if(this.xmlFormDoc.xml == "")
 	{
 		var msg=myDesigner.stringTable.getPhrase("MSG_INVALID_SERVER_RESPONSE");
 		top.cmnDlg.messageBox(msg,"ok","stop");
 		this.xmlFormDoc=null;
 		return false;
 	}
 	// if error node display msg
	this.xmlFormDoc.setProperty("SelectionLanguage","XPath");
 	var errNode=this.xmlFormDoc.selectSingleNode("//ERROR");
  	if (errNode)
 	{
 		var msg = errNode.getAttribute("msg");
 		msg = myDesigner.stringTable.getPhrase("ERR_XPRESS") + "\n" + (msg?msg:"");
 	 	top.cmnDlg.messageBox(msg,"ok","stop");
 		this.xmlFormDoc=null;
 		return false;
 	}
	
	// need this for functioning form
	var root=this.xmlFormDoc.documentElement;
	if (root)
		root.setAttribute("pdl", pdl);
	
	// put here so we don't do everytime we open a dialog
	this.dsm = new DataSrcMgr(this.xmlFormDoc);
	return true;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.loadTemplate=function(pdl,tkn)
{
	// called from newDocument
	this.xmlDoc = top.xmlFactory.createInstance("DOM");
	this.xmlDoc.setProperty("SelectionLanguage","XPath");
	this.xmlDoc.async = false;
	this.xmlDoc.resolveExternals = false;
 	this.xmlDoc.loadXML('<WIZARDS pdl="'+pdl+'" tkn="'+tkn+'"></WIZARDS>');
	if (this.xmlDoc.parseError.errorCode != 0)
 	{
 		var msg=myDesigner.stringTable.getPhrase("ERR_INVALID_FORM_XML");
 		top.displayDOMError(this.xmlDoc.parseError,msg);
 		this.xmlDoc = null;
 		return false;
 	}
 	if(this.xmlDoc.xml == "")
 	{
 		var msg=myDesigner.stringTable.getPhrase("MSG_INVALID_SERVER_RESPONSE");
 		top.cmnDlg.messageBox(msg,"ok","stop");
 		this.xmlDoc = null;
 		return false;
 	}

	this.addNewWizard();
	this.buildCtlsFromDoc();
	return true;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.newDocument=function(ci)
{
	// called from wzdesigner.js, wzInitialize
	// if there is an error, this.xmlDoc is set to null
	try {
		this.ci=ci;
		var dsNew = ci.params;
	 	if (!dsNew)
	 		return;
		this.pdl = dsNew.getItem("pdl").value;
		this.sysId = dsNew.getItem("sys").value;
		this.tknId = dsNew.getItem("tkn").value;
		this.provId = "remote";
		var msg=myDesigner.stringTable.getPhrase("MSG_LOADING_FORM");
		window.status = msg + " " + this.pdl + "/" + this.tknId + "...";

		// Get the form XML document - returns false if server error, etc.
		if (this.loadForm(this.pdl,this.tknId))
		{
			this.loadTemplate(this.pdl, this.tknId);
			this.setTitle();
			this.buildDisplay();
		}
		else
		{
			var msg=myDesigner.stringTable.getPhrase("ERR_FORM_RET") + " [1144]";;
			top.cmnDlg.messageBox(msg,"ok","stop");
			this.xmlDoc=null;
			return;
		}
	} catch (e) {
		top.cmnDlg.messageBox(e.description,"ok","stop");
		this.xmlDoc=null;
		return;
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.onClose=function()
{
	// call the frame work default implementation
	return (ActiveDocument.superclass.onClose.call(this));
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.openDocument=function(ci)
{
	// called from wzdesigner.js, wzInitialize
	// if there is an error, this.xmlDoc is set to null
	try {
		this.loading=true;
		this.ci=ci;
		if (ci.provId == "local")
 		   this.xmlDoc=this.openLocalDocument(ci);
		else
 		   this.xmlDoc=this.openRemoteDocument(ci);

		if (!this.xmlDoc)
		{
			var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_GET") + "\n" + ci.docPath + "/" + ci.docName;
			top.cmnDlg.messageBox(msg,"ok","stop");
			this.loading=false;
			this.xmlDoc=null;
			return;
		}
		
		if (this.xmlDoc.parseError.errorCode != 0)
		{
			top.displayDOMError(this.xmlDoc.parseError,"Open Document:\n" + ci.docPath + "/" + ci.docName)
			this.loading=false;
			this.xmlDoc=null;
			return;
		}
		var wizardNode=this.xmlDoc.selectSingleNode("//WIZARDS")
		if (!wizardNode)
		{
			var msg=myDesigner.stringTable.getPhrase("MSG_INVALID_XML_FORMAT")
			msg+="\n\n"+contents.xml.substr(0,400)+"\n\n"
			top.cmnDlg.messageBox(msg,"ok","stop");
			this.loading=false;
			this.xmlDoc=null;
			return;
		}
		
		// Now that we know we have a document,
		// also need to load form XML.
		// try and get PDL, SYS, and TKN from document.
		// if not found, get the last two from the file name.
		this.pdl = wizardNode.getAttribute("pdl");
		this.fileName = ci.docName;
		this.tknId = wizardNode.getAttribute("tkn");
		
		if (!this.tknId && ci.docName.indexOf(".xml")>-1)
			this.tknId=ci.docName.split(".xml")[0];
		
		if (!this.pdl || !this.tknId)
		{
			var msg=myDesigner.stringTable.getPhrase("ERR_FORM_RET") + " [1237]";
			top.cmnDlg.messageBox(msg,"ok","stop");
			this.loading=false;
			this.xmlDoc=null;
			return;
		}
		if (this.loadForm(this.pdl,this.tknId))
		{
			this.buildCtlsFromDoc();
			this.buildDisplay();
			this.setTitle();
		}
		else
		{
			var msg=myDesigner.stringTable.getPhrase("ERR_FORM_RET") + "\n"
				+ myDesigner.stringTable.getPhrase("ERR_WIZ_FILENAME")
				+ " [1252]";
			top.cmnDlg.messageBox(msg,"ok","stop");
			this.loading=false;
			this.xmlDoc=null;
			return;
		}
		this.loading=false;
	} catch (e) {
		top.cmnDlg.messageBox(e.description,"ok","stop");
		this.loading=false;
		this.xmlDoc=null;
		return;
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.openLocalDocument=function(ci)
{
		var xmlDoc=top.xmlFactory.createInstance("DOM");
		xmlDoc.setProperty("SelectionLanguage","XPath");
		xmlDoc.async=false;
		var ds = new top.DataStorage()
		ds.add("docName", ci.docName);
		ds.add("docPath", ci.docPath);
		
		var prov=(ci.provId?top.designStudio.persist.getProv(ci.provId):null);
		if (!prov)
			return null;		
		
		ds = prov.get(ds, true);
		if (!ds)
			return null;
		
		var contents = ds.getItem("contents")?ds.getItem("contents").value:null;
		if (!contents)
			return null;
			
		xmlDoc.loadXML(contents.xml);
		return xmlDoc;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.openRemoteDocument=function(ci)
{
	return top.fileMgr.getFile(ci.docPath,ci.docName,"text/xml",false);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.preview=function()
{
	try
	{
		// get selected wizard based on tree selection.
		var curNode = this.getCurStep();
		var selectedWizard = curNode?this.getWizard(curNode):this.getFirstWizard();
		if(this.pdl && selectedWizard)
		{
			oPreviewXML.async=false;
			oPreviewXML.loadXML(this.xmlFormDoc.xml);
			oPreviewXML.documentElement.setAttribute("mode","design");
			top.oPreview.URL = top.portalPath + "/forms/prevhost.htm";
			top.oPreview.XMLDocument = oPreviewXML;
			top.oPreview.wizPreview = true;
			top.oPreview.wizXml = this.getXMLContent(selectedWizard).xml;
			if(top.oPreview.wizXml)
			{
				if(!top.oPreviewWin || top.oPreviewWin.closed)
				{
					var u=top.portalPath+"/index.htm?PREVIEW";
					var p="resizable=1,scrollbars=1,WIDTH=900,HEIGHT=600,TOP=10,LEFT=10,status=yes,toolbar=no,menubar=no,location=no,dependent=yes";
					top.oPreviewWin = top.open(u,"wzPreview",p);
				}
				else
				{
					top.oPreviewWin.loadPreviewContent();
					top.oPreviewWin.focus();
				}
			}
		}
	}
	catch(e)
	{
		top.cmnDlg.messageBox(e,"ok","stop");
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.reloadDocument=function()
{
	// store my command info for the reload (we will be going away here)
	var ci=this.ci;
	var ds=top.designStudio;
	ds.explorer.closeFile(ds.explorer.activeFileName); // same action as "ID_FILE_CLOSE"
	ds.loadDesigner(ci);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.removeContent=function(contentNode)
{
	var currentNode;
	var dataNodes=contentNode.childNodes;
	for (var i=0; i < dataNodes.length; i++)
	{
		currentNode=dataNodes[i];
		switch(currentNode.nodeName)
		{
		case "push":
			currentNode.setAttribute("tp", "Hidden");
			break;
		default:
			contentNode.removeChild(currentNode);
			i--;
			break;
		}
	}

	if (contentNode.nodeName=="detail")
		contentNode.setAttribute("tp", "Hidden");
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.selectFirstControlInstance=function()
{
	// called from wzInitialize (wzdesigner.js)
	var wz = this.getFirstWizard();
	var step = (wz ? this.getWizardFirstStep(wz) : null);
	var stepId = (step ? step.getAttribute("id") : "");
	if (stepId)
		this.selectControlInstance(stepId);
	return stepId;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.setDocName=function(name)
{
	var oldName=this.docName;
	ActiveDocument.superclass.setDocName.call(this,name);
	if (oldName != this.docName)
		this.setTitle();
	// prompt user that this doc name may not be the most valid
 	var stdDocName=this.tknId.toLowerCase()+".xml";
	var stdDocPath=top.contentPath+"/wizards";
	if ((stdDocPath != this.docPath) || (stdDocName != this.docName))
	{
		var msg=myDesigner.stringTable.getPhrase("MSG_NONSTANDARDFILELOCATION")
			+ " " + stdDocPath + "/" + stdDocName;
		top.cmnDlg.messageBox(msg,"ok","alert");
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.setRedraw=function(flag)
{
	if (typeof(flag) != "boolean")
		flag=true;
	this.isRedrawing=flag;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.setTitle=function()
{
	// updates the document titlebar based on xml
	if (!this.xmlDoc) return;
	var formNode = this.xmlDoc.selectSingleNode("/form");
	if (!formNode) return;
	var title=(formNode.getAttribute("TITLE")
		? formNode.getAttribute("TITLE")
		: "Title not found") + " (" + this.docName + ")";
	top.designStudio.explorer.setTitle(this.docName,title);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.updateCtl=function(ctlId, propId, val)
{
	// called by handlePropertyBrowse, handlePropertyChange
	var node=this.xmlDoc.selectSingleNode("//*[@id='"+ctlId+"']");
	if (!node) return;

	// only update if different
	if (node.getAttribute(propId)!=val)
	{
        if (propId=="id")
        {
            if (!ActiveDocument.superclass.updateInstanceId.call(this, ctlId, val))
                return;
        }

		switch (node.nodeName)
		{
			case BRANCH_TAG:
				break;
			case STEP_TAG:
				break;
			case WIZARD_TAG:
				if(propId=="id")
					node.setAttribute("name", val);
				break;
	 	}
		node.setAttribute(propId, val);
		this.setModifiedFlag();
		if (this.htmTree)
		{
			this.htmTree.buildTreeFromXML(this.xmlDoc);
			this.htmTree.openToId(ctlId);
		}
	}
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.XMLAddBranch=function(test, curStep)
{
	// add a branch XML node
	// returns the new node
	// called by addNewBranch
 	var newBranch = this.xmlDoc.createElement("BRANCH");
	var branchID = this.getUniqueID(BRANCH_TAG);
	newBranch.setAttribute("id", branchID);
	newBranch.setAttribute("test", test);
	curStep.appendChild(newBranch);
	return newBranch;
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.XMLAddStep=function(name, curStep)
{
	// adds a step node to the XML document
	// returns the new node
	// called by addNewStep, XMLAddWizard
	var nameSplit = name.split("/");
	var fldName = nameSplit[0];
	var fldType = nameSplit[1];
			
	var ctlId = this.getUniqueID(STEP_TAG);
	var newStep = this.xmlDoc.createElement("STEP");
	newStep.setAttribute("id",  ctlId);
	newStep.setAttribute("fld", fldName);
	newStep.setAttribute("type", fldType);
	newStep.setAttribute("FC", "");
	switch (curStep.nodeName)
	{
		case STEP_TAG:
			// revised to have same logic as studio 3.0
			// if has sibling, add before that sibling
			// (this also handles the begin wizard node)
			// try to add after current, unless the end, in which case, add before.
			var beforeNode = null;
			var afterNode = null;
			// If curStep is first node or step with siblings, place before next sibling
			if (curStep.nextSibling)
				beforeNode = curStep.nextSibling;
			else
			{
				if (curStep.getAttribute("fld"))
				{
					// If curStep is step, but no siblings, place after it
					afterNode=curStep;
				}
				else
				{
					// If curStep final node, place before it
					beforeNode=curStep;
				}
			}
			// Create the new step
			var parentNode = curStep.parentNode;
			if (beforeNode)
				parentNode.insertBefore(newStep, beforeNode);
			else if (afterNode)
			{
				var sib=afterNode.nextSibling;
				if (sib)
					parentNode.insertBefore(newStep, sib);
				else
					parentNode.appendChild(newStep);
			}
			break;
		case BRANCH_TAG:
		case WIZARD_TAG:
			// Create the new step control
			curStep.appendChild(newStep);
			break;
 	}
	this.helpTextSetXML(newStep, this.helpTextRetrieve(fldName));
	return(newStep);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.XMLAddWizard=function()
{
	var wizardsRoot = this.xmlDoc.selectSingleNode("//WIZARDS");
	var wz = this.xmlDoc.createElement(WIZARD_TAG);
	var wzID = this.getUniqueID(WIZARD_TAG);
	wz.setAttribute("id", wzID);
	wz.setAttribute("name", wzID);
 	wizardsRoot.appendChild(wz);

	// Start Wizard
	var startStep=this.XMLAddStep("/", wz);
	var startText=myDesigner.stringTable.getPhrase("lblStartWz");
	this.helpTextSetXML(startStep, startText);
		
	// End Wizard
	var endStep=this.XMLAddStep("/", wz);
	var endText=myDesigner.stringTable.getPhrase("lblEndWz");
	this.helpTextSetXML(endStep, endText);

	return(wz);
}

//-----------------------------------------------------------------------------
ActiveDocument.prototype.XMLDelete=function(node)
{
	node.parentNode.removeChild(node);
}
