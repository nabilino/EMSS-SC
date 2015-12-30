/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/wzdesigner/wzcommand.js,v 1.9.28.2 2012/08/08 12:48:48 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// wzcommand.js
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
function CommandHandler()
{
	this.receiver = "WIZARD";
	this.commandId = "";
}

//-----------------------------------------------------------------------------
CommandHandler.prototype.execute=function(commandId)
{
	var bHandled = false;
	this.commandId = commandId;
	myDesigner=top.designStudio.activeDesigner;
   	myDoc=(myDesigner ? myDesigner.activeDocument : null);
	var node = myDoc.getCurNode();

	switch(this.commandId)
	{
	//------------------------------------------------------------ file menu
	case "ID_FILE_RELOAD":
		bHandled=true;
		if (myDoc.getModifiedFlag())
		{
			var msg=myDesigner.stringTable.getPhrase("MSG_DOC_IS_MODIFIED")+
				"\n"+myDesigner.stringTable.getPhrase("MSG_OK_TO_CONTINUE")
 			if ( top.cmnDlg.messageBox(msg,"okcancel","question",window) == "cancel" )
				return (true);
		}
		myDoc.reloadDocument()
		break;

	//------------------------------------------------------------ edit menu
	case "ID_EDIT_UNDO":
		if (myDoc)
		{
			myDoc.commandHistory.undo();
			bHandled=true;
		}
		break;
		
	case "ID_EDIT_REDO":
		if (myDoc)
		{
			myDoc.commandHistory.redo();
			bHandled=true;
		}
		break;

	case "ID_EDIT_CUT":
		if (myDoc)
		{
			var type="wzcut";
			var wzCommand = new WzCommand(type, node);
			myDoc.commandHistory.add(wzCommand);
			wzCommand.execute();
		}
		break;

	case "ID_EDIT_DELETE":
		if (myDoc)
		{
			var type = "wzdelete";
			var wzCommand = new WzCommand(type, node);
			myDoc.commandHistory.add(wzCommand);
			wzCommand.execute();
		}
		break;
		
	case "ID_EDIT_COPY":
		if (myDoc)
		{
			var type="wzcopy";
			var wzCommand = new WzCommand(type, node);
			myDoc.commandHistory.add(wzCommand);
			wzCommand.execute();
		}
		break;

	case "ID_EDIT_PASTE":
		if (myDoc)
		{
			var type="wzpaste";
			var pasteCmd = myDoc.getLastCutCopy();
			if (pasteCmd)
			{
				var target=myDoc.getCurNode();
				var wzCommand = new WzCommand(type, node, pasteCmd);
				myDoc.commandHistory.add(wzCommand);
				wzCommand.execute();
			}
		}
		break;
		
	case "ID_EDIT_SHIFT_UP":
		if (myDoc)
		{
			var type="wzshiftup";
			var target=myDoc.getCurNode();
			var wzCommand = new WzCommand(type, node);
			myDoc.commandHistory.add(wzCommand);
			wzCommand.execute();
		}
		break;

	case "ID_EDIT_SHIFT_DOWN":
		if (myDoc)
		{
			var type="wzshiftdown";
			var target=myDoc.getCurNode();
			var wzCommand = new WzCommand(type, node);
			myDoc.commandHistory.add(wzCommand);
			wzCommand.execute();
		}
		break;
		
	//------------------------------------------------------------ view menu
	case "ID_VIEW_PREVIEW":
		myDoc.doPreview();
		bHandled=true;
		break;

	case "ID_EXPAND_ALL":
		myDoc.doExpandAll();
		bHandled=true;
		break;

	case "ID_COLLAPSE_ALL":
		myDoc.doCollapseAll();
		bHandled=true;
		break;

	case "ID_VIEW_REFRESH":
		if (mySourceView.active)
		{
			mySourceView.reset();
			bHandled=true;
		}
		break;

	//------------------------------------------------------------ tools menu

	//------------------------------------------------------------ help menu
	case "ID_HELP_ABOUTDESIGNER":
	 	var sFeatures="dialogWidth:380px;dialogHeight:220px;center:yes;help:no;scroll:no;status:no";
		var args = new Array(top);
		window.showModalDialog(top.studioPath+"/wzdesigner/about.htm", args, sFeatures);
		bHandled=true;
		break;
	}

	if (!bHandled)
		return (parent.designStudio.commandHandler.execute(commandId));
	return (bHandled);
}

//-----------------------------------------------------------------------------
CommandHandler.prototype.handleKeyboardEvent=function(evt)
{
	var	bHandled=false;
	if (evt.srcElement && evt.srcElement.id == "uTree")
  		bHandled = myDoc.getTree().handleKeyDown(evt);
	if (!bHandled)
	{
		switch (evt.keyCode)
		{
		// A - debug
		case top.keys.AKEY:
			if (evt.ctrlKey && evt.altKey)
			{
				var strFeatures="dialogHeight:600px;dialogWidth:800px;edge:sunken;help:no;scroll:no;resizable:yes,dependent:yes;";
				var dlgArgs=new Array();
				dlgArgs[0]=myDoc;
				dlgArgs[1]=myDesignView;
				dlgArgs[2]=myDesigner;
				dlgArgs[3]=top;
				
				// it is imperative that window is used, not top
				// otherwise /studio/debug.htm is loaded instead.
				window.showModalDialog("debug.htm", dlgArgs, strFeatures);
				bHandled = true;
			}
			break;
	
		// H - command history
		case top.keys.HKEY:
			if (evt.ctrlKey && evt.altKey)
			{
				var strFeatures="dialogHeight:280px;dialogWidth:700px;edge:sunken;help:no;toolbar=no;status=no;scroll:no;resizable:yes,dependent:yes;";
				var dlgArgs=new Array();
				dlgArgs[0]=top;
				dlgArgs[1]=myDoc;
				window.showModalDialog("dialogs/history.htm", dlgArgs, strFeatures);
				bHandled = true;
			}
			break;
			
		case top.keys.DELETE:
		case top.keys.KEYPAD_DELETE:
			if (evt.srcElement && (evt.srcElement.id == "uTree")
				&& (!evt.altKey && !evt.ctrlKey && !evt.shiftKey) 
				&& myDoc.canPerformCurrent("delete")
			)
			{
				this.execute("ID_EDIT_DELETE");
				evtCaught = true;
			}
			break;	
		}
	}
	return (bHandled);
}

//-----------------------------------------------------------------------------
CommandHandler.prototype.setEnable=function(action)
{	
	// called by menu.xml
	var bEnable=false;
	try {
		switch (action)
		{
		
		//---------------------------------------------------- file menu
		case "reload":
			bEnable=true;
			break;

		//---------------------------------------------------- edit menu
		case "undo":
			var lastId=(myDoc.lastFocus?myDoc.lastFocus.id:"");
			if (lastId!="textBody")
				bEnable=myDoc.commandHistory.canUndo();
			break;
		case "redo":
			var lastId=(myDoc.lastFocus?myDoc.lastFocus.id:"");
			if (lastId!="textBody")
				bEnable=myDoc.commandHistory.canRedo();
			break;

		case "cut":
		case "copy":
			bEnable=(!myDesignView.active && myObject.active) ? true : false;
			bEnable|=(myDesignView.active && myDoc.canPerformCurrent(action));
			break;
			
		case "delete":
			bEnable=(!myDesignView.active && myObject.active) ? true : false;
			bEnable|=(myDesignView.active && myDoc.canPerformCurrent(action));
			break;
			
		case "paste":
			bEnable=(!myDesignView.active && myObject.active) ? true : false;
			var pasteCmd = myDoc.getLastCutCopy();
			var pasteNode = (pasteCmd?pasteCmd.cloneNode:null);
			bEnable|=(myDesignView.active && pasteNode && myDoc.canPerformCurrent(action,pasteNode));
			break;

		case "shiftup":
		case "shiftdown":
			bEnable=(myDesignView.active && myDoc.canPerformCurrent(action));
			break;
		
		//---------------------------------------------------- view menu
		case "design":
		case "source":
			var vu=myDesigner.workSpace.views.item(action);
			bEnable=( !vu.active && vu.isEnabled() ) ? true : false;
			break;
			
		case "refresh":
			// only allow for source view
			bEnable=mySourceView.active ? true : false;
			break;
			
		case "properties":
			bEnable=(myDesignView.active && myDoc.xmlDoc) ? true : false;
			break;
			
		case "preview":
			bEnable=myDoc.xmlDoc ? true : false;
			break;
		}
	} catch (e) { }
	return (bEnable);
}

//-----------------------------------------------------------------------------
function WzCommand(type, node, pasteCmd)
{
	// src depicts what has been previously selected.
	// type is type of command - add, delete, move up, move down.
	// target depicts what the new target location may be.
	// xml contains the wizard xml affected by this change.
	
	this.initiator = "wz"; // field used by CommandHistory
	this.date = new Date(); // used by history dialog
	this.type = type;
	this.node = node;
	
	switch (this.type)
	{
	case "wzadd":
		break;
	case "wzcopy":
		this.cloneNode = node.cloneNode(true);
		break;
	case "wzcut":
	case "wzdelete":
		this.parentNode = node.parentNode;
		this.nextSibling = node.nextSibling;
		this.cloneNode = node.cloneNode(true);
		break;
	case "wzpaste":
		this.afterNode = null;
		this.beforeNode = null;
		this.nextSibling = null;
		this.pasteCmd = pasteCmd;
		this.parentNode = null;
		this.cloneNode = myDoc.copyNode(this.pasteCmd.cloneNode);
		switch (this.cloneNode.tagName.toUpperCase())
		{
			case BRANCH_TAG:
				this.parentNode = this.node;
				this.nextSibling = this.node.firstChild;
				break;
			case STEP_TAG:
				switch (this.node.tagName.toUpperCase())
				{
					case BRANCH_TAG:
						this.parentNode = this.node;
						this.nextSibling = this.node.firstChild;
						break;
					case STEP_TAG:
						// logic from XMLAddStep
						this.parentNode = this.node.parentNode;
						if (this.node.getAttribute("fld"))
						{
							// If curStep is step, but no siblings, place after it
							this.afterNode = this.node;
							this.nextSibling=this.afterNode.nextSibling;
						}
						else
						{
							if (this.node.nextSibling)
							{
								// If curStep is start wizard node, place after it
								this.afterNode = this.node;
								this.nextSibling=this.afterNode.nextSibling;
							}
							else
							{
								// If curStep is end wizard node, place before it
								this.beforeNode = this.node;
								this.nextSibling=this.beforeNode;
							}
						}
						break;
				}
				break;
			case WIZARD_TAG:
				this.parentNode = myDoc.xmlDoc.selectSingleNode("//WIZARDS");
				break;
		}
		this.parentNode.insertBefore(this.cloneNode, this.nextSibling);
		myDoc.buildCtlFromNode(this.cloneNode);
		break;
	case "wzshiftdown":
	case "wzshiftup":
		this.parentNode = node.parentNode;
		this.previousSibling = node.previousSibling;
		this.nextSibling = node.nextSibling;
		break;
	}
}

//-----------------------------------------------------------------------------
WzCommand.prototype.getTitle=function()
{
	var ret="";
	switch (this.type)
	{
	case "wzadd":
		ret = "Add "+this.node.getAttribute("id")+".";
		break;
	case "wzcopy":
		ret = "Copy "+this.node.getAttribute("id")+".";
		break;
	case "wzcut":
		ret = "Cut "+this.node.getAttribute("id")+".";
		break;
	case "wzdelete":
		ret = "Delete "+this.node.getAttribute("id")+".";
		break;
	case "wzpaste":
		ret = "Paste "+this.cloneNode.getAttribute("id")+".";
		break;
	case "wzshiftdown":
		ret = "Shift "+this.node.getAttribute("id")+" after "+this.nextSibling.getAttribute("id")+".";
		break;
	case "wzshiftup":
		ret = "Shift "+this.node.getAttribute("id")+" before "+this.previousSibling.getAttribute("id")+".";
		break;
	}
	return ret;
}

//-----------------------------------------------------------------------------
WzCommand.prototype.execute=function()
{
	var bOpen = false;
	var openId="";
	switch (this.type)
	{
	case "wzadd":
		this.node.setAttribute("deleted","0");
		openId=this.node.getAttribute("id");
		bOpen = true;
		break;
	case "wzcut":
		//myDoc.doDeleteNode(this.node);
		this.node.setAttribute("deleted","1");
		openId=this.parentNode.getAttribute("id");
		bOpen = true;
		break;
	case "wzcopy":
		break;
	case "wzdelete":
		//myDoc.doDeleteNode(this.node);
		this.node.setAttribute("deleted","1");
		bOpen = true;
		openId=this.parentNode.getAttribute("id");
		break;
	case "wzpaste":
		this.cloneNode.setAttribute("deleted","0");
		openId=this.cloneNode.getAttribute("id");
		bOpen = true;
		break;
	case "wzshiftdown":
		this.parentNode.removeChild(this.nextSibling);
		this.parentNode.insertBefore(this.nextSibling,this.node);
		openId=this.node.getAttribute("id");
		bOpen = true;
		break;
	case "wzshiftup":
		this.parentNode.removeChild(this.node);
		this.parentNode.insertBefore(this.node,this.previousSibling);
		openId=this.node.getAttribute("id");
		bOpen = true;
		break;
	}
	if (bOpen)
	{
		myDoc.buildDisplay();
		if (openId)
		{
			if (myDoc.htmTree)
				myDoc.htmTree.openToId(openId);
			top.dsPropArea.showIdProperties(openId);
		}	
	}
}

//-----------------------------------------------------------------------------
WzCommand.prototype.unExecute=function()
{
	var bOpen = false;
	var openId="";
	switch (this.type)
	{
	case "wzadd":
		this.node.setAttribute("deleted","1");
		bOpen = true;
		openId=this.parentNode.getAttribute("id");
		break;
	case "wzcopy":
		break;
	case "wzcut":
		this.node.setAttribute("deleted","0");
		bOpen = true;
		openId=this.node.getAttribute("id");
		break;
	case "wzdelete":
		this.node.setAttribute("deleted","0");
		bOpen = true;
		openId=this.node.getAttribute("id");
		break;
	case "wzpaste":
		this.cloneNode.setAttribute("deleted","1");
		bOpen = true;
		openId=this.parentNode.getAttribute("id");
		break;
	case "wzshiftdown":
		this.parentNode.removeChild(this.node);
		this.parentNode.insertBefore(this.node,this.nextSibling);
		bOpen = true;
		openId=this.node.getAttribute("id");
		break;
	case "wzshiftup":
		this.parentNode.removeChild(this.previousSibling);
		this.parentNode.insertBefore(this.previousSibling,this.node);
		bOpen = true;
		openId=this.node.getAttribute("id");
		break;
	}
	if (bOpen)
	{
		myDoc.buildDisplay();
		if (openId)
		{
			if (myDoc.htmTree)
				myDoc.htmTree.openToId(openId);
			top.dsPropArea.showIdProperties(openId);
		}	
	}
}
