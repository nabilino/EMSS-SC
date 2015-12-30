/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/filemanager.js,v 1.10.2.3.2.2 2014/01/10 14:29:55 brentd Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@10.00.05.00.12 Mon Mar 31 10:17:31 Central Daylight Time 2014 */
//***************************************************************
//*                                                             *
//*                           NOTICE                            *
//*                                                             *
//*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//*                                                             *
//*   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************

var fmFileInstance = findFM();
var fmHandler = new FMHandler();

//-----------------------------------------------------------------------------
function findFM(searchOpener, ref)
{
	if (!ref)
		ref = self;

	try
	{
		// is there a parent ?
		if (ref != ref.parent)
		{
			// does the parent have a fmFileInstance variable ?
			if (typeof(ref.parent.fmFileInstance) != "undefined")
			{
				// found a copy...
				if (ref.parent.fmFileInstance != null)
					return ref.parent.fmFileInstance;
				else
					return ref.parent;
			}
			else
			{
				// didn't find it... try higher
				return findFM(searchOpener, ref.parent);
			}
		}
	}
	catch (e)
	{}

	try
	{
		// is there an opener ?
		if (searchOpener && ref.opener)
		{
			// does the opener have an FmFileInstance variable ?
			if (typeof(ref.opener.fmFileInstance) != "undefined")
			{
				// found a copy...
				if (ref.opener.fmFileInstance != null)
					return ref.opener.fmFileInstance;
				else
					return ref.opener;
			}
			else
			{
				// didn't find it... try higher on the opener
				return findFM(searchOpener, ref.opener);
			}
		}
	}
	catch (e)
	{}

	try
	{
		// does the current window have an FmFileInstance variable ?
		if (typeof(fmFileInstance) != "undefined")
		{
			// found a copy...
			if (fmFileInstance != null)
				return fmFileInstance;
			else
				return self;
		}
	}
	catch (e)
	{}

	return null;
}

//-----------------------------------------------------------------------------
//-- start FmHandler object code
function FMHandler()
{
	// only allow 1 instance of this object
	if (FMHandler._singleton)
		return FMHandler._singleton;
	else
	{
		// try to get objects from 1 instance of this file
		FMHandler._singleton = this;
		try {
			if (fmFileInstance && fmFileInstance.FmHandler && fmFileInstance.FmHandler._singleton)
			{
				// copy over parameters...
				this.fm = fmFileInstance.FmHandler._singleton.fm;
			}
			else
			{
				this.fm = null;	// fm XML reference
			}
		} catch(e) {
				this.fm = null;	// fm XML reference
		}
	}
	this.ssoFileAppended = false;
	//PT 155861
	this.ssoFileUrl = "/sso/sso.js";
	this.commonHTTPUrl = "/lawson/webappjs/commonHTTP.js";
	this.commonHTTPAppended = false;
	this.fmUrl="/servlet/FileMgr";
	this.FMservice="/servlet/FileMgr";
}
FMHandler.prototype._singleton = null;	
//-----------------------------------------------------------------------------
FMHandler.prototype.isCommonHTTPLoaded = function()
{
	if (typeof(SEARequest) == "function")
	{
		this.commonHTTPAppended = true;	
		return true;
	}	
	return false;
}
//-----------------------------------------------------------------------------
FMHandler.prototype.loadCommonHTTP = function()
{
	if (this.commonHTTPAppended)
		return;
	
	if (!this.isCommonHTTPLoaded())
	{	
		var scElm = document.createElement("SCRIPT");
		scElm.src = this.commonHTTPUrl;
		document.body.appendChild(scElm);
		this.commonHTTPAppended = true;
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------
FMHandler.prototype.isSSOFileLoaded = function()
{
	if (typeof(ssoFileInstance) != "undefined")
	{
		this.ssoFileAppended = true;
		var ssoWnd = (ssoFileInstance != null) ? ssoFileInstance : window;
		SSORequest = ssoWnd.SSORequest;
		SEARequest = ssoWnd.SSORequest;
		return true;
	}
	return false;
}
//-----------------------------------------------------------------------------
FMHandler.prototype.loadSSOFile = function()
{
	if (!this.ssoFileAppended)
	{
		var scElm = document.createElement("SCRIPT");
		scElm.src = this.ssoFileUrl;
		document.body.appendChild(scElm);
		this.ssoFileAppended = true;
	}
}
//-- end FmHandler object code
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-- start FileManager object code
function FileManager(wnd)
{	
	if (typeof(fmHandler) == "undefined")
	{
		fmHandler = new FMHandler();
	}

	if (!fmHandler.isCommonHTTPLoaded())
	{
	 	fmHandler.loadCommonHTTP();
		setTimeout(function(){ FileManager(wnd); }, 5);
		return;
	}

	if (!fmHandler.isSSOFileLoaded())
	{
		fmHandler.loadSSOFile();
		setTimeout(function(){ FileManager(wnd); }, 5);
		return;
	}

	
	iosFileInstance = findIOS();
	iosHandler = new IOSHandler();
	iosHandler.createIOS();

	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
	 	setTimeout(function(){ FileManager(wnd); }, 5);
		return;
	}	
	var iosVersion = iosHandler.getIOSVersionNumber();
	this.portalWnd=wnd;
	this.iosVersion=iosVersion;
	this.dispError=false;
	this.textXML="text/xml";
	this.textPlain="text/plain";
	this.service="/servlet/FileMgr";
	this.scriptName="webappjs/FileManager.js";
	this.fileMgrErrorMsg="FileMgr Error: ";
}
//-----------------------------------------------------------------------------
/*	FileManager.prototype.dbFileConv=function(fileContent, root, bDispErr)
{
	var iosVersion = iosHandler.getIOSVersionNumber();
	this.portalWnd = window

	if (fileContent.length < 1)
		return null;
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);
	if (iosVersion.indexOf("8.0") != -1)
	{
		var strFileXml = "<?xml version=\"1.0\"?><FILEMANAGER>"
		strFileXml += "<ACTION>dbfileconversion</ACTION>";
		strFileXml +="<ROOTDIR>" + root + "</ROOTDIR>\n"
		strFileXml += "<TYPE>xml</TYPE>"
		strFileXml += "<CONTENT>" + fileContent + "</CONTENT>"
		strFileXml += "</FILEMANAGER>"
		return ( this.getResponse803(strFileXml) );
	}
	var str = "action=dbfileconversion&rootdir="+root;
	return ( this.getResponse(str,fileContent,this.textXML,this.textXML,"POST") );
}	*/
//-----------------------------------------------------------------------------
FileManager.prototype.getFile=function(folder, name, fileType, bDispErr, bNoCache,frameName,FTR)
{
	var iosVersion = iosHandler.getIOSVersionNumber();
	bNoCache=(typeof(bNoCache)=="boolean" ? bNoCache : false);
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);
	if (iosVersion.indexOf("8.0") != -1)
	{
		var strFileXml = "<?xml version=\"1.0\"?>\n<FILEMANAGER>\n";
		strFileXml +="<ACTION>get</ACTION>\n";
		strFileXml +="<ROOTDIR>lawson</ROOTDIR>\n";
	  	strFileXml +="<FOLDER>"+ folder+"</FOLDER>\n";
	 	strFileXml += "<NAME>" + name + "</NAME>\n";
		strFileXml +="</FILEMANAGER>";
		return (this.getResponse803(strFileXml) );
	}
	var str = "action=get&folder="+folder+"&name="+name;
	str+=(bNoCache ? "&nocache=" + (new Date().getTime()) : "");
	var test = str;
	return (this.getResponse(str,null,this.textPlain,fileType,null) );
}
//-----------------------------------------------------------------------------
// returns an xml DOM of files/folders
//	type = filelist/folderlist/alllist
/*	FileManager.prototype.getList=function(type, folder, filter, bDispErr)
{
	var iosVersion = iosHandler.getIOSVersionNumber();
	this.portalWnd = window
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);
	if (iosVersion.indexOf("8.0") != -1)
	{
		var strFileXml = "<?xml version=\"1.0\"?>\n<FILEMANAGER>\n";
		strFileXml +="<ACTION>" + type + "</ACTION>\n";
		strFileXml +="<ROOTDIR>" + this.portalWnd.lawsonPortal.path + "</ROOTDIR>\n";
	  	strFileXml +="<FOLDER>" + 
	  		(folder.indexOf(this.portalWnd.lawsonPortal.path) == 0 
	  			? folder.substr(this.portalWnd.lawsonPortal.path.length)
	  			: folder) + 
	  		"</FOLDER>\n";
	 	strFileXml += "<TYPE>" + filter + "</TYPE>\n";
		strFileXml +="</FILEMANAGER>";
		return ( this.getResponse803(strFileXml) );
	}
	var str = "action="+type+"&folder="+folder
	if (typeof(filter) != "undefined")
		str+=("&type="+filter);
	return ( this.getResponse(str,null,this.textPlain,this.textXML,null) );
}	*/
//-----------------------------------------------------------------------------
FileManager.prototype.getMessage=function(ds)
{
	this.portalWnd = window
	try
	{
		var msgNode=ds.getElementsByTagName("MSG")
		msgNode = (msgNode && msgNode.length > 0 ? msgNode : ds.getElementsByTagName("MESSAGE"));
		msgNode = (msgNode && msgNode.length > 0 ? msgNode[msgNode.length-1] : null);
		return (msgNode && msgNode.childNodes.length > 0 
				? msgNode.firstChild.nodeValue : "");
	}
	catch (e)
	{
		return "";
	}
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
	this.portalWnd = window
	var retVal = null
	try
	{
		this.service=fmHandler.FMservice;		
		var service = this.service + "?" + str;
		var oResponse=this.portalWnd.SEARequest(service,data,"POST","text/plain",false);
		if (oResponse.documentElement.nodeName == 'ERROR')
		{
			return null;
		}
		retVal=oResponse
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
	}
	catch(e)
	{
		if (this.dispError)
		{
			retVal=null;
		}
		else if (typeof(oResponse) != "undefined")
			retVal=oResponse;
	}
	return retVal;
}
//-----------------------------------------------------------------------------
FileManager.prototype.getResponse803=function(strXML,fileType,bCallServlet)
{
	this.portalWnd = window
	this.service=fmHandler.FMservice;	
	var retVal = null;
	//fileType = (typeof(fileType) == "string" ? fileType : "");
	//bCallServlet = (typeof(bCallServlet) == "boolean" ? bCallServlet : true);
	//try{
	var oResponse=SEARequest(service,strXML,"text/xml","text/xml",false,true);
	//var oResponse=(bCallServlet
	//		? this.portalWnd.SSORequest("/servlet/FileMgr",strXML,"","",this.bDispError)
	//		: this.portalWnd.SSORequest(strXML,null,"",fileType,this.bDispError));
	retVal=oResponse;
	/*
		if (retVal.status)
		{
			if (this.bDispError)
			{
				var msg=this.fileMgrErrorMsg + "\n" + 
					this.portalWnd.lawsonPortal.getPhrase("AGSXMLERROR") + "\n" +
					retVal.status + ": " + retVal.statusText;
				alert(msg);
			}
		}
		else
		{
			var ds=new this.portalWnd.DataStorage(this.portalWnd.oBrowser.isIE ? oResponse.xml : oResponse);
			var msgNode=ds.getNodeByName("MESSAGE");
			if (msgNode && msgNode.getAttribute("status")=="1" && this.bDispError)
			{
				alert(this.fileMgrErrorMsg + "\n" + msgNode.firstChild.nodeValue);
			}
		}
	}
	catch(e)
	{
		if (this.bDispError)
			alert(this.fileMgrErrorMsg +
				+ ((e.name && e.message) ? "\n" + e.name + ": " + e.message : ""))
		retVal=oResponse;
	}
	*/
	return retVal;
}
//-----------------------------------------------------------------------------
FileManager.prototype.getStatus=function(ds)
{
	/*
	this.portalWnd = window
	if (!this.iosVersion)
		this.iosVersion=this.portalWnd.oPortalConfig.getShortIOSVersion();
	*/
	try
	{
		var msgNode=ds.getElementsByTagName("MSG")
		msgNode = (msgNode && msgNode.length > 0 ? msgNode : ds.getElementsByTagName("MESSAGE"));
		msgNode = (msgNode && msgNode.length > 0 ? msgNode[msgNode.length-1] : null);
		return (msgNode ? msgNode.getAttribute("status") : "0");
	}
	catch (e)
	{
		return "99"
	}
}
//-----------------------------------------------------------------------------
FileManager.prototype.isFileNotFoundStatus=function(ds)
{
	this.portalWnd = window
	try
	{
		var errNode=ds.getElementsByTagName("ERROR")
		errNode = (errNode && errNode.length > 0 ? errNode[errNode.length-1] : null);
		return (errNode && errNode.getAttribute("key")=="FILE_NOT_FOUND" ? true : false);
	}
	catch (e)
	{}
	return false;
}
//-----------------------------------------------------------------------------
/*	FileManager.prototype.remove=function(folder, name, token, pdl, id, bDispErr)
{
	this.portalWnd = window
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);
	var iosVersion = iosHandler.getIOSVersionNumber();
	if (iosVersion.indexOf("8.0") != -1)
	{
		var strFileXml = "<?xml version=\"1.0\"?><FILEMANAGER>";
		strFileXml += "<ACTION>delete</ACTION>";
		strFileXml += "<ROOTDIR>" + this.portalWnd.lawsonPortal.path + "</ROOTDIR>";
	  	strFileXml +="<FOLDER>" + 
	  		(folder.indexOf(this.portalWnd.lawsonPortal.path) == 0 
	  			? folder.substr(this.portalWnd.lawsonPortal.path.length)
	  			: folder) + 
	  		"</FOLDER>\n";
		strFileXml += "<NAME>" + name + "</NAME>";
		if (typeof(token) != "undefined" && token)
		{
			strFileXml += "<TYPE>form</TYPE>";
			strFileXml +="<PDL>" + pdl + "</PDL>\n";
			strFileXml +="<TOKEN>" + token + "</TOKEN>\n";
			strFileXml +="<ID>" + id + "</ID>\n";
		}
		else
			strFileXml += "<TYPE></TYPE>";
		strFileXml += "</FILEMANAGER>";
		return ( this.getResponse803(strFileXml) );
	}
	var str = "action=delete&folder="+folder+"&name="+name;
	if (typeof(token) != "undefined" && token)
		str+="&token="+token+"&pdl="+pdl+"&id="+id;
	return ( this.getResponse(str,null,this.textPlain,this.textXML,null) );
}
//-----------------------------------------------------------------------------
FileManager.prototype.rebuildIndex=function(root, folder, bRecurse, bDispErr)
{
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);
	var iosVersion = iosHandler.getIOSVersionNumber();
	if (iosVersion.indexOf("8.0") != -1)
	{
		var strFileXml = "<?xml version=\"1.0\"?>\n<FILEMANAGER>\n"
		strFileXml +="<ACTION>rebuildindex</ACTION>\n";
		strFileXml += "<ROOTDIR>" + root + "</ROOTDIR>\n";
	  	strFileXml +="<FOLDER>" + folder + "</FOLDER>\n";
		strFileXml +="</FILEMANAGER>";
		return ( this.getResponse803(strFileXml) );
	}

	var str = "action=rebuildindex&folder="+folder+"&rootdir="+root;
	if (typeof(bRecurse) == "boolean" && !bRecurse)
		str+="&norecurse=TRUE";
	return ( this.getResponse(str,null,this.textPlain,this.textXML,null) );
}	*/
//-----------------------------------------------------------------------------
FileManager.prototype.save=function(folder, fileName, fileContent, fileType, bOverwrite, bDispErr)
{
	var iosVersion = iosHandler.getIOSVersionNumber();
	this.portalWnd = window
	if (fileContent.length < 1)
		return null;
	this.dispError=(typeof(bDispErr)=="boolean" ? bDispErr : true);
	this.dispError = true
	if (iosVersion.indexOf("8.0") != -1)
	{
		var strFileXml = "<?xml version=\"1.0\"?>\n<FILEMANAGER>\n";
		strFileXml += "<ACTION>save</ACTION>\n";
		strFileXml += "<ROOTDIR> /lawson</ROOTDIR>\n";
		strFileXml +="<FOLDER>" + folder+"</FOLDER>\n";
		strFileXml += "<NAME>" + fileName + "</NAME>\n";
		var str=fileContent;
		if (fileType.indexOf("xml") == -1)
			strFileXml += "<TYPE>TXT</TYPE>\n";
		else
		{
			strFileXml += "<TYPE>XMLNOFMT</TYPE>\n";
			// clean up the XML data
			/*
			var ds=new this.portalWnd.DataStorage(fileContent,this.portalWnd);
			str=ds.getDataString();
			str=str.replace(/^.*\?\>/,"");					// strip xml version
			str=str.replace(/\<\!.*\-\>/g,"");				// xml comments
			str=str.replace(/\t/g,"");						// tabs
			str=str.replace(/^.*\</g,"<");					// whitespace at bol
			str=str.replace(/\n/gm,"");						// newlines
			str=str.replace(/\x0D/gm,"");					// CR
			*/
		}
		strFileXml += "<CONTENT>" + str + "</CONTENT>\n";
		strFileXml += "</FILEMANAGER>";
		return (this.getResponse803(strFileXml));
	}
	if (typeof(bOverwrite)!="boolean")
		bOverwrite=true;
	var str = "action=save&folder="+folder+"&name="+fileName+
			"&overwrite="+(bOverwrite ? "TRUE" : "FALSE");
	return (this.getResponse(str,fileContent,fileType,this.textXML,"POST"));
}
