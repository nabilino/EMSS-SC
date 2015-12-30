/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/wzdesigner/wzdatasrc.js,v 1.4.8.1.22.2 2012/08/08 12:48:49 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// wzdatasrc.js
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
function DataSrcMgr(xmlDoc)
{
	this.xmlDoc=xmlDoc;
	this.selectXML=null;

	if (xmlDoc)
		this.buildSelectList();
}

//-----------------------------------------------------------------------------
DataSrcMgr.prototype.buildSelectList=function()
{
	var strXML="<?xml version=\"1.0\"?>\n<SELECT>\n</SELECT>\n";
	this.selectXML=top.xmlFactory.createInstance("DOM");
 	this.selectXML.async=false;
 	this.selectXML.setProperty("SelectionLanguage", "XPath");
 	this.selectXML.loadXML(strXML);
 	
	// copy acceptable fields to new DOM
	var root=this.selectXML.documentElement;
 	var fldNodes=this.xmlDoc.selectNodes("//fld[@tp='Text' or @tp='Fc' or @tp='Select' or @tp='Hidden' or @tp='Out']");
	var len=(fldNodes?fldNodes.length:0);
	for (var i=0;i<len;i++)
		root.appendChild(fldNodes[i].cloneNode(false));
}

//-----------------------------------------------------------------------------
DataSrcMgr.prototype.getAvailableFields=function()
{
	return(this.selectXML);
}
