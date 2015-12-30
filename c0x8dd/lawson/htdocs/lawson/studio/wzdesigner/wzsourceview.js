/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/wzdesigner/wzsourceview.js,v 1.3.34.2 2012/08/08 12:48:48 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// wzsourceview.js
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
SourceView.prototype = new parent.View();
SourceView.prototype.constructor = SourceView;
SourceView.superclass = parent.View.prototype;

//-----------------------------------------------------------------------------
function SourceView()
{
	SourceView.superclass.initialize.call(this, "source", 
		top.document.getElementById("view_source"), 
		top.document.getElementById("btn_source"));

	this.modified=false;
	this.xmlDoc=null;
	this.xmlSrc="";

	// initialize the editor
	this.editor=top.designStudio.activeDesigner.workSpace.editors.item(this.id);
	this.editor.registerTextArea("textBody");
	this.editor.setReadOnly(true);
}

//-----------------------------------------------------------------------------
SourceView.prototype.apply=function()
{
	this.setMsg();
	if (!this.getModifiedFlag()) return (true);

	if(this.getTextContent()==this.getContent())
	{
		this.reset();
		return (true);
	}

	if( !this.validateXML())
		return (false);

	this.reset();
	if (this.xmlDoc.xml != myDoc.xmlDoc.xml)
	{
		myDoc.xmlDoc.loadXML(this.getTextContent())
		myDoc.setModifiedFlag(true)

		// must set reload on design/object views
		myDesignView.setReload()
		myObject.setReload()
		if (myObject.objNode)
		{
			var objId=myObject.objNode.getAttribute("id")
			var objNode=myDoc.xmlDoc.selectSingleNode("/form//*[@id='"+objId+"']")
			if (!objNode)
			{
				myObject.objNode=null
				myObject.enableView(false)
}
		}
	}
	return (true);
}

//-----------------------------------------------------------------------------
SourceView.prototype.getContent=function()
{
	return (this.xmlSrc);
}

//-----------------------------------------------------------------------------
SourceView.prototype.getModifiedFlag=function()
{
	return (this.modified);
}

//-----------------------------------------------------------------------------
SourceView.prototype.getTextContent=function()
{
	return (this.editor.cwDoc.getElementById("textBody").value);
}

//-----------------------------------------------------------------------------
SourceView.prototype.handleSourceError=function()
{
	var errLine="";
	var errMsg="";
	var err=this.xmlDoc.parseError;

	if(err.linepos>0 && err.srcText!="")
	{
		errLine=err.srcText.replace(/\t/g," ")+String.fromCharCode(13);
		for(var i=0;i<err.linepos;i++)
			errLine+="-";
		errLine+="^";
	}
	errMsg=err.reason+String.fromCharCode(13)+"Line: "+err.line+", Character: "+err.linepos;
	errMsg+=String.fromCharCode(13)+errLine;

	// set message bar text
	this.setMsg(errMsg);
	this.editor.cwDoc.getElementById("textBody").focus();
}

//-----------------------------------------------------------------------------
SourceView.prototype.reset=function()
{
	this.editor.setTextContent(this.xmlSrc);
	this.setModifiedFlag(false);
	this.setMsg();
}

//-----------------------------------------------------------------------------
SourceView.prototype.setActive=function()
{
	myDesigner.showPropertyArea(false);
	if (myDesigner.workSpace.maximized)
		myDesigner.workSpace.setWindowState("maximize");
}

//-----------------------------------------------------------------------------
SourceView.prototype.setContent=function()
{
	this.xmlSrc=myDoc.getXMLContent().xml.replace( /\>\</g, ">\n<" );

	//load xml definition into DOM
	this.xmlDoc=myDesigner.source.wzCreateDOMFromString(this.xmlSrc);
	if (this.xmlDoc)
	{
		this.xmlDoc.validateOnParse=true;
		this.xmlSrc=this.xmlDoc.xml;
		this.editor.setTextContent(this.xmlSrc);
		this.validateXML();
	}
 	this.setModifiedFlag(false);
}

//-----------------------------------------------------------------------------
SourceView.prototype.setModifiedFlag=function(bModified)
{
	if (typeof(bModified) != "boolean")
		bModified=true;
	this.modified=bModified;
}

//-----------------------------------------------------------------------------
SourceView.prototype.setMsg=function(msg)
{
	var msgDiv=this.editor.cwDoc.getElementById("edtMsg");
	var msgText=this.editor.cwDoc.getElementById("errMsg");
	if (typeof(msg)!="string")
	{
		msgDiv.style.height="0px";
		msgText.innerText="";
	}
	else
	{
		msgDiv.style.height="100px";
		msgText.innerText=msg;
	}
}

//-----------------------------------------------------------------------------
SourceView.prototype.setToolboxState=function()
{
	// called from wzInitialize
  	myDesigner.source.wzDisableAllTools();
}

//-----------------------------------------------------------------------------
SourceView.prototype.validateXML=function()
{
	this.setMsg();
	if (this.getTextContent() == this.getContent())
		return true;
	// store off good xml
	var tmpXML=this.xmlSrc;
	this.xmlDoc.loadXML(this.getTextContent());
	if(this.xmlDoc.parseError.errorCode!=0)
	{
		this.handleSourceError();
		this.xmlDoc.loadXML(tmpXML);
		return false;
	}
	this.xmlSrc=this.xmlDoc.xml;
	return true;
}
