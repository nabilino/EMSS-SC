/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/uicommand.js,v 1.3.28.2 2012/08/08 12:48:51 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// uicommand.js
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
// Command Handler implementation ---------------------------------------------
//-----------------------------------------------------------------------------

function CommandHandler()
{
	this.receiver = "UIDESIGNER";
	this.commandId = "";
}

//-----------------------------------------------------------------------------
CommandHandler.prototype.handleKeyboardEvent=function(evt)
{
	var	bHandled=false;
	switch (evt.keyCode)
	{
	case top.keys.AKEY:
		// debug html: ctrl+shift+H
		if (evt.ctrlKey && evt.altKey)
		{
			var strFeatures="dialogHeight:600px;dialogWidth:800px;help:no;scroll:no;resizable:yes;status:no;"
			var dlgArgs=new Array()
			dlgArgs[0]=myDoc
			dlgArgs[1]=myDesign
			dlgArgs[2]=myObject
			dlgArgs[3]=myDesigner
			dlgArgs[4]=top
			window.showModalDialog("debug.htm", dlgArgs, strFeatures)
			bHandled = true;
		}
		break;
	}
	return (bHandled);
}

//-----------------------------------------------------------------------------
CommandHandler.prototype.execute=function(commandId)
{
	var bHandled=false;
	this.commandId = commandId;
	switch(this.commandId)
	{
	//------------------------------------------------------------ file menu
	case "ID_FILE_RELOAD":
		if (!myDoc.isValid(true)) return (true);
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

	case "ID_FILE_DELETE":
		var path=top.designStudio.path+"/uidesigner/wizards/erp_open.htm"
 		var dlgArgs = new Array();
		dlgArgs[0]=top;
		dlgArgs[1]="delete";
		var strFeatures="dialogHeight:420px;dialogWidth:420px;center:yes;help:no;scroll:no;status:no;";
		top.showModalDialog(path,dlgArgs,strFeatures);
		break;

	case "ID_FILE_INCLUDE":
		if (myScript.active)
		{
			myScript.openIncludeDlg()
			bHandled=true;
		}
		break;
	
	//------------------------------------------------------------ edit menu
	case "ID_EDIT_DESELECTALL":
		// disable object view (don't set handled flag)
		if (!myObject.active)
			myObject.enableView(false);
		break;

	case "ID_EDIT_TABORDER":
		if (myDesign.active || myObject.active)
		{
			myDoc.editTabOrder()
			bHandled=true;
		}
		break;

	case "ID_EDIT_APPLYCHANGES":
		if (mySource.active)
		{
			mySource.apply()
			bHandled=true;
		}
		else if (myScript.active)
		{
			myScript.apply()
			bHandled=true;
		}
		break;

	case "ID_EDIT_SENDTOBACK":
		if (myDesign.active || myObject.active)
		{
			myDoc.changeZOrder(-1)
			bHandled=true;
		}
		break;

	case "ID_EDIT_BRINGTOFRONT":
		if (myDesign.active || myObject.active)
		{
			myDoc.changeZOrder(1)
			bHandled=true;
		}
		break;
	
	//------------------------------------------------------------ view menu
	case "ID_VIEW_DOCPROPERTIES":
		myDoc.selectControlInstance("form1")
		var btn=top.dsPropArea.getElement("btn_proppage")
		if (btn)
		{
			btn.focus()
			btn.click()
			bHandled=true;
		}
		break;
	case "ID_VIEW_OBJECT":
		myDesigner.workSpace.switchView("object")
		bHandled=true;
		break;
	case "ID_VIEW_PREVIEW":
		myDoc.doPreview()
		bHandled=true;
		break;
	case "ID_VIEW_REFRESH":
		if (mySource.active)
		{
			mySource.reset()
			bHandled=true;
		}
		else if (myScript.active)
		{
			myScript.setContent()
 			bHandled=true;
		}
		break;

	//------------------------------------------------------------ tools menu

	//------------------------------------------------------------ help menu
	case "ID_HELP_ABOUTDESIGNER":
	 	var sFeatures="dialogWidth:380px;dialogHeight:220px;center:yes;help:no;scroll:no;status:no";
		var args = new Array(top);
		top.showModalDialog(top.studioPath+"/uidesigner/about.htm", args, sFeatures);
		bHandled=true;
		break;
	}

	// did we handle?
	if (!bHandled)
		return (parent.designStudio.commandHandler.execute(commandId));
	return (bHandled);
}


//-----------------------------------------------------------------------------
CommandHandler.prototype.setEnable=function(id)
{
	var bEnable=false;
	try {
		switch (id)
		{
		//---------------------------------------------------- file menu
		case "reload":
			bEnable=true;
			break;
		case "include":
			bEnable=(myScript.active);
			break;

		//---------------------------------------------------- edit menu
		case "undo":
		case "redo":
		case "deselectall":
		case "delete":
			bEnable=(myDesign.active || myObject.active) ? true : false;
			break;

		case "sendtoback":
		case "bringtofront":
			if (myDesign.active && myDesign.editor.selectedElements.count == 1)
				bEnable=true;
			else if (myObject.active && myObject.editor.selectedElements.count == 1)
				bEnable=true;
			break;

		case "taborder":
			bEnable=(myDesign.active || myObject.active) ? true : false;
			break;
			
		case "apply":
			// only valid in source, script view...
			bEnable=(myDesign.active || myObject.active) ? false : true;
			if (bEnable)
			{	// ...and only if modfied
				if (mySource.active)
					bEnable=mySource.getModifiedFlag()
				else if (myScript.active)
					bEnable=myScript.getModifiedFlag()
			}
			break;

		//---------------------------------------------------- view menu
		case "toolbox":
			bEnable=(!mySource.active && !myScript.active);
			break;
		case "design":
		case "source":
		case "script":
			var vu=myDesigner.workSpace.views.item(id)
			bEnable=( !vu.active && vu.isEnabled() )
			break;
		case "object":
			if (!myObject.active)
				bEnable=myObject.isEnabled();
			break;
		case "refresh":
			bEnable=(!myDesign.active && !myObject.active);
			break;
		case "properties":
			bEnable=(myDesign.active && myDoc.xmlDoc);
			break;
		case "proppane":
			bEnable=(myDoc.xmlDoc && (myDesign.active || myObject.active));
			break;
		case "preview":
			bEnable=(myDoc.xmlDoc ? true : false);
			break;
		}
	} catch (e) { }
	return (bEnable);
}
