/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/filemgr.js,v 1.9.2.3.4.3.20.3 2012/08/08 12:48:50 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
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

// constructor
function FileManager(wnd)
{
	this.studioWnd=wnd;
	this.dispError=false;
	this.textXML="text/xml";
	this.textPlain="text/plain";
	this.service="/servlet/FileMgr";
	this.fileMgrErrorMsg="FileMgr Error: ";
}

//-----------------------------------------------------------------------------
FileManager.prototype.checkFormId=function(pdl, tkn, id, bDispErr)
{
	var str = "action=checkformid&pdl="+pdl+"&token="+tkn+"&id="+id;
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);
	return ( this.getResponse(str,null,this.textPlain,this.textXML) );
}

//-----------------------------------------------------------------------------
FileManager.prototype.dbFileConv=function(fileContent, root, bDispErr)
{
	if (fileContent.length < 1) return(null);
	var str = "action=dbfileconversion&rootdir="+root;
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);
	return ( this.getResponse(str,fileContent,this.textXML,this.textXML,"POST") );
}

//-----------------------------------------------------------------------------
FileManager.prototype.getFile=function(folder, name, fileType, bDispErr)
{
	var str = "action=get&folder="+folder+"&name="+name;
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);
	return ( this.getResponse(str,null,this.textPlain,fileType,null) );
}

//-----------------------------------------------------------------------------
// returns an xml DOM of files/folders
// 		type = filelist/folderlist/alllist
FileManager.prototype.getList=function(type, folder, filter, bDispErr)
{
	var str = "action="+type+"&folder="+folder
	if (typeof(filter) != "undefined")
		str+=("&type="+filter);
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);
	return ( this.getResponse(str,null,this.textPlain,this.textXML,null) );
}

//-----------------------------------------------------------------------------
FileManager.prototype.getMessage=function(ds)
{
	try {
		var root=ds.documentElement;
		var msgNode=root.selectSingleNode("MSG");
		return (msgNode ? msgNode.text : "");
		
	} catch (e) { return ("") }
}

//-----------------------------------------------------------------------------
// getResponse is a 'non-public' method to POST a message to FileMgr 
// and return an XMLDom if successful or null on error.  all other functions in 
// this file are 'public' methods which call this function.
//
// for the public functions, the bDispErr parameter is optional and defaults
// to true.  this flag indicates if FileMgr error message should be displayed.
// passing false assumes the caller will display its own error messages.
//-----------------------------------------------------------------------------
FileManager.prototype.getResponse=function(str,data,cntType,outType,cmd)
{
	var retVal = null
	try
	{
		var service = this.service + "?" + str;
		var oResponse=this.studioWnd.SSORequest(service,(cmd ? data : null),
							cntType,outType,false);
		retVal=oResponse
		if (retVal.status)
		{
			if (this.dispError)
			{
				alert(this.fileMgrErrorMsg + "\n" + 
						this.studioWnd.getHttpStatusMsg(retVal.status));
				retVal=null;
			}
		}
		else if (outType==this.textXML)
		{
			var root=oResponse.documentElement;
			var msgNode=root.selectSingleNode("MSG");
			if (msgNode && msgNode.getAttribute("status")!="0" && this.dispError)
			{
				alert(this.fileMgrErrorMsg + "\n" + msgNode.firstChild.nodeValue);
				retVal=null;
			}
		}

	} catch(e) {
		if (this.dispError)
		{
			alert(this.fileMgrErrorMsg +
				+ ((e.name && e.message) ? "\n" + e.name + ": " + e.message : ""))
			retVal=null;
		}
		else if (typeof(oResponse) != "undefined")
			retVal=oResponse;
	}
	return retVal;
}

//-----------------------------------------------------------------------------
FileManager.prototype.getStatus=function(ds)
{
	try {
		var root=ds.documentElement;
		var msgNode=root.selectSingleNode("MSG");
		return (msgNode ? msgNode.getAttribute("status") : "0");
		
	} catch (e) { return ("99") }
}

//-----------------------------------------------------------------------------
FileManager.prototype.remove=function(folder, name, token, pdl, id, bDispErr)
{
	var str = "action=delete&folder="+folder+"&name="+name;
	if (typeof(token) != "undefined" && token)
		str+="&token="+token+"&pdl="+pdl+"&id="+id;
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);
	return ( this.getResponse(str,null,this.textPlain,this.textXML,null) );
}

//-----------------------------------------------------------------------------
FileManager.prototype.rebuildIndex=function(root, folder, bRecurse, bDispErr)
{
	var str = "action=rebuildindex&folder="+folder+"&rootdir="+root;
	if (typeof(bRecurse) == "boolean" && !bRecurse)
		str+="&norecurse=TRUE";		// thank KH for the inverse boolean!
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);
	return ( this.getResponse(str,null,this.textPlain,this.textXML,null) );
}

//-----------------------------------------------------------------------------
FileManager.prototype.save=function(folder, fileName, fileContent, fileType, bOverwrite, bDispErr)
{
	if (fileContent.length < 1)
		return null;
	if (typeof(bOverwrite)!="boolean")
		bOverwrite=true;

	fileName = fileName.toLowerCase();
	
	// is this a custom form?
	if (fileContent.substr(0,6)=="<UIDEF")
		return this.saveToken(folder, fileName, fileContent, fileType, bOverwrite, bDispErr);

	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);
	var str = "action=save&folder="+folder+"&name="+fileName+
			"&overwrite="+(bOverwrite ? "TRUE" : "FALSE");
	return (this.getResponse(str,fileContent,fileType,this.textXML,"POST"));
}

//-----------------------------------------------------------------------------
FileManager.prototype.saveToken=function(folder, fileName, fileContent, fileType, bOverwrite, bDispErr)
{
	if (fileContent.length < 1)
		return null;
	if (typeof(bOverwrite)!="boolean")
		bOverwrite=true;

	var strXML=fileContent.replace(/\>\</g,">\n<");
	var oFormXML = this.studioWnd.xmlFactory.createInstance("DOM");
	oFormXML.async=false
	oFormXML.loadXML(strXML)
	if (oFormXML.parseError.errorCode != 0)
	{
		this.studioWnd.displayDOMError(oFormXML.parseError,folder+"/"+fileName)
		return null;
	}

	var str = "action=saveToken&rootdir=" + this.studioWnd.contentPath +
			"&folder=" + folder.substr(this.studioWnd.contentPath.length+1) + 
			"&name="+fileName + "&overwrite="+(bOverwrite ? "TRUE" : "FALSE");

	var uidefNode = oFormXML.documentElement;
	str+="&token="+uidefNode.getAttribute("token");
	str+="&id="+uidefNode.getAttribute("id");
	str+="&isdefault="+uidefNode.getAttribute("default");
	var formNode = oFormXML.selectSingleNode("/UIDEF/form");
	str+="&pdl="+formNode.getAttribute("pdl");

	// reset the content for 'nice' format
	strXML=oFormXML.xml;

	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);
	return (this.getResponse(str,strXML,fileType,this.textXML,"POST"));
}

//-----------------------------------------------------------------------------
// FileStub object - based loosely on java.io.File
function FileStub(name,title,docId)
{
	this.name=name;
	this.title=title;
	this.docId=docId;
}

