/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/wzdesigner/wzdesignview.js,v 1.2.34.2 2012/08/08 12:48:48 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// wzdesign.js
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
// WzDesignView ---------------------------------------------------------------
//-----------------------------------------------------------------------------
WzDesignView.prototype = new parent.View();
WzDesignView.prototype.constructor = WzDesignView;
WzDesignView.superclass = parent.View.prototype;

//-----------------------------------------------------------------------------
function WzDesignView()
{
 	WzDesignView.superclass.initialize.call(this, "design", 
 		top.document.getElementById("view_source"), 
 		top.document.getElementById("btn_source"));

	this.modified=false;
	this.xmlDoc=null;
	this.xmlSrc="";
	this.myWizards=null;

	// initialize the editor
	this.editor=top.designStudio.activeDesigner.workSpace.editors.item(this.id)
	this.editor.registerTextArea("textBody");
	this.htmDoc = this.editor.cwDoc;
}

//-----------------------------------------------------------------------------
WzDesignView.prototype.getContent=function()
{
	// stored content
	return (this.xmlSrc);
}

//-----------------------------------------------------------------------------
WzDesignView.prototype.getObjNode=function()
{
	return (this.objNode);
}

//-----------------------------------------------------------------------------
WzDesignView.prototype.getTextContent=function()
{
	// current (perhaps user-modified) content
	return (this.editor.cwDoc.getElementById("textBody").value);
}

//-----------------------------------------------------------------------------
WzDesignView.prototype.setActive=function()
{
	myDesigner.showPropertyArea(true);
	if (myDesigner.workSpace.maximized)
		myDesigner.workSpace.setWindowState("maximize");
}

//-----------------------------------------------------------------------------
WzDesignView.prototype.setContent=function()
{
	if (!this.reload) return;
	this.setReload(false);
	window.status="Rebuilding design view...";
	myDoc.readyState="loading";
	myDoc.buildDisplay();
	myDoc.readyState="complete";
	window.status="";
}

//-----------------------------------------------------------------------------
WzDesignView.prototype.setReload=function(bReload)
{
	if (typeof(bReload) != "boolean")
		bReload=true;
	this.reload=bReload;
}

//-----------------------------------------------------------------------------
WzDesignView.prototype.setTitle=function(s)
{
	this.elem.title=s;
} 

//-----------------------------------------------------------------------------
WzDesignView.prototype.setToolboxState=function()
{
	// disable any tools?
	var toolbox = myDesigner.toolBox;
	var lenGroups = toolbox.controlGroups.count;
	for ( var i = 0; i < lenGroups; i++)
	{
		var ctlGrp = toolbox.controlGroups.item(i);
		var lenControls = ctlGrp.controls.count;
		for (var j = 0; j < lenControls; j++)
		{
			var bEnable = true;
			var control = ctlGrp.controls.item(j);
			myDesigner.source.wzEnableToolbtn(control.id, bEnable);
		}
	}
}
