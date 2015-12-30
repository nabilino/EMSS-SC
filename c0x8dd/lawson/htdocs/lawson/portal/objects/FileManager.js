/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/FileManager.js,v 1.11.2.5.4.10.14.2.2.3.2.1 2012/10/10 08:22:07 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.692 2013-12-12 04:00:00 */
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
	this.portalWnd=wnd;
	this.dispError=false;
	this.textXML="text/xml";
	this.textPlain="text/plain";
	this.service="/servlet/FileMgr";
	this.scriptName="objects/FileManager.js";
	this.fileMgrErrorMsg="FileMgr Error: ";
}

//-----------------------------------------------------------------------------
FileManager.prototype.dbFileConv=function(fileContent, root, bDispErr)
{
	if (fileContent.length < 1) return null;
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);

	var str = "action=dbfileconversion&rootdir="+root;
	return ( this.getResponse(str,fileContent,this.textXML,this.textXML,"POST") );
}

//-----------------------------------------------------------------------------
FileManager.prototype.getFile=function(folder, name, fileType, bDispErr, bNoCache)
{
	bNoCache=(typeof(bNoCache)=="boolean" ? bNoCache : false);
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);

	var str = "action=get&folder="+folder+"&name="+name;
	str+=(bNoCache ? "&nocache=" + (new Date().getTime()) : "");
	return ( this.getResponse(str,null,this.textPlain,fileType,null) );
}

FileManager.prototype.checkFile=function(folder, fileType, bDispErr, bNoCache)
{

	bNoCache=(typeof(bNoCache)=="boolean" ? bNoCache : false);
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);

	var str = "action=checkfile&folder="+folder+"&type="+fileType;
	str+=(bNoCache ? "&nocache=" + (new Date().getTime()) : "");

	return ( this.getResponse(str,null,this.textPlain,fileType,null) );
}

//-----------------------------------------------------------------------------
// returns an xml DOM of files/folders
// 		type = filelist/folderlist/alllist
FileManager.prototype.getList=function(type, folder, filter, bDispErr)
{
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);

	var str = "action="+type+"&folder="+folder
	if (typeof(filter) != "undefined")
		str+=("&type="+filter);
	return ( this.getResponse(str,null,this.textPlain,this.textXML,null) );
}

//-----------------------------------------------------------------------------
FileManager.prototype.getMessage=function(ds)
{
	try {
		var msgNode=ds.getElementsByTagName("MSG")
		msgNode = (msgNode && msgNode.length > 0 ? msgNode : ds.getElementsByTagName("MESSAGE"));
		msgNode = (msgNode && msgNode.length > 0 ? msgNode[msgNode.length-1] : null);
		return (msgNode && msgNode.childNodes.length > 0 
				? msgNode.firstChild.nodeValue : "");
		
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
	try	{
		var service = this.service + "?" + str;
		var oResponse=this.portalWnd.httpRequest(service,(cmd ? data : null),cntType,outType,false);
		retVal=oResponse
		if (oResponse == null)
			return null;
		if (this.portalWnd.oError.handleBadResponse(oResponse,this.dispError,this.fileMgrErrorMsg))
		{
			if (this.dispError)
				retVal=null;
		}
		else if (outType==this.textXML)
		{
			var ds=new DataStorage(this.portalWnd.oBrowser.isIE ? oResponse.xml : oResponse);
			var msgNode=oResponse.getElementsByTagName("MSG");
			// assumes the last MSG element is the overall result message
			msgNode = (msgNode && msgNode.length < 1 ? null : msgNode[msgNode.length-1]);
			if (msgNode && msgNode.getAttribute("status")!="0" && this.dispError)
			{
				this.portalWnd.oError.displayIOSErrorMessage(ds,true,this.fileMgrErrorMsg+"\n");
				retVal=null;
			}
		}

	} catch(e) {
		if (this.dispError)
		{
			this.portalWnd.oError.displayExceptionMessage(e,this.scriptName,
					"getResponse",this.fileMgrErrorMsg);
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
		var msgNode=ds.getElementsByTagName("MSG")
		msgNode = (msgNode && msgNode.length > 0 ? msgNode : ds.getElementsByTagName("MESSAGE"));
		msgNode = (msgNode && msgNode.length > 0 ? msgNode[msgNode.length-1] : null);
		return (msgNode ? msgNode.getAttribute("status") : "0");
		
	} catch (e) { return ("99") }
}

//-----------------------------------------------------------------------------
FileManager.prototype.isFileNotFoundStatus=function(ds)
{
	try {
		var errNode=ds.getElementsByTagName("ERROR")
		errNode = (errNode && errNode.length > 0 ? errNode[errNode.length-1] : null);
		return (errNode && errNode.getAttribute("key")=="FILE_NOT_FOUND" ? true : false);
		
	} catch (e) { }
	return false;
}

//-----------------------------------------------------------------------------
FileManager.prototype.remove=function(folder, name, token, pdl, id, bDispErr)
{
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);

	var str = "action=delete&folder="+folder+"&name="+name;
	if (typeof(token) != "undefined" && token)
		str+="&token="+token+"&pdl="+pdl+"&id="+id;
	return ( this.getResponse(str,null,this.textPlain,this.textXML,null) );
}

//-----------------------------------------------------------------------------
FileManager.prototype.rebuildIndex=function(root, folder, bRecurse, bDispErr)
{
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);

	var str = "action=rebuildindex&folder="+folder+"&rootdir="+root;
	if (typeof(bRecurse) == "boolean" && !bRecurse)
		str+="&norecurse=TRUE";
	return ( this.getResponse(str,null,this.textPlain,this.textXML,null) );
}

//-----------------------------------------------------------------------------
FileManager.prototype.save=function(folder, fileName, fileContent, fileType, bOverwrite, bDispErr)
{
	if (fileContent.length < 1)
		return null;

	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);

	if (typeof(bOverwrite)!="boolean")
		bOverwrite=true;
	var str = "action=save&folder="+folder+"&name="+fileName+
			"&overwrite="+(bOverwrite ? "TRUE" : "FALSE");
	return (this.getResponse(str,fileContent,fileType,this.textXML,"POST"));
}
