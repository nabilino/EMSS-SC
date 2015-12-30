/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/uidesign.js,v 1.2.34.2 2012/08/08 12:48:51 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// uidesign.js
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
// DesignView -----------------------------------------------------------------
//-----------------------------------------------------------------------------

DesignViewSub.prototype = new parent.DesignView();
DesignViewSub.prototype.constructor = DesignViewSub;
DesignViewSub.superclass = parent.DesignView.prototype;
function DesignViewSub()
{
	DesignViewSub.superclass.initialize.call(this, "design");

	this.modified=false;
	this.baseElement="form1";
	this.targetElement="form1";
	this.reload=false;
	this.objNode=null;

	// initialize the editor
	this.editor=top.designStudio.activeDesigner.workSpace.editors.item(this.id)
  	this.editor.registerCanvas(this.baseElement);
}

//-----------------------------------------------------------------------------
DesignViewSub.prototype.setActive=function()
{
	myDesigner.showPropertyArea(true);
	if (myDesigner.workSpace.maximized)
		myDesigner.workSpace.setWindowState("maximize");
}

//-----------------------------------------------------------------------------
DesignViewSub.prototype.setContent=function()
{
	if (!this.getReload()) return;
	this.setReload(false);

	window.status="Rebuilding design view..."
	myDoc.readyState="loading"
	this.editor.cwDoc.getElementById("form1").innerHTML=""
	myDoc.buildDisplay(true)
	myDoc.readyState="complete"
	window.status=""
}

//-----------------------------------------------------------------------------
DesignViewSub.prototype.setToolboxState=function()
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
			var bSingleUse = (control.getRule("singleUse") == "1") ? true : false;
			if (bSingleUse)
			{
				if (control.id=="detail")
				{
 					if (myDoc.xmlDoc.selectSingleNode("//detail[@tp='Detail']"))
	 					bEnable=false
					else
					{
						// any tran fld nodes with detail attribute?
						var detNode=myDoc.xmlDoc.selectSingleNode("//*[@det and @det!='']")
		 				if (!detNode) bEnable=false
					}
				}
 				else if (myDoc.xmlDoc.selectSingleNode("//"+control.id))
 					bEnable=false
			}
			myDesigner.source.uiEnableToolbtn(control.id, bEnable)
		}
	}
}

//-----------------------------------------------------------------------------
DesignViewSub.prototype.setReload=function(bReload)
{
	if (typeof(bReload) != "boolean")
		bReload=true;
	this.reload=bReload;
}

//-----------------------------------------------------------------------------
DesignViewSub.prototype.getReload=function()
{
	return (this.reload);
}

//-----------------------------------------------------------------------------
DesignViewSub.prototype.setObjNode=function(node)
{
	this.objNode=node;
	return (this.getObjNode());
}

//-----------------------------------------------------------------------------
DesignViewSub.prototype.getObjNode=function()
{
	return (this.objNode);
}
