/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/drill.js,v 1.9.2.6.2.2 2014/01/10 14:29:55 brentd Exp $ */
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

var idaFileInstance = findIDA(true);
var idaHandler = new IDAHandler();

//-----------------------------------------------------------------------------
function findIDA(searchOpener, ref)
{
	if (!ref)
		ref = self;

	try
	{
		// is there a parent ?
		if (ref != ref.parent)
		{
			// does the parent have an idaFileInstance variable ?
			if (typeof(ref.parent.idaFileInstance) != "undefined")
			{
				// found a copy...
				if (ref.parent.idaFileInstance != null)
					return ref.parent.idaFileInstance;
				else
					return ref.parent;
			}
			else
			{
				// didn't find it... try higher
				return findIDA(searchOpener, ref.parent);
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
			// does the opener have an idaFileInstance variable ?
			if (typeof(ref.opener.idaFileInstance) != "undefined")
			{
				// found a copy...
				if (ref.opener.idaFileInstance != null)
					return ref.opener.idaFileInstance;
				else
					return ref.opener;
			}
			else
			{
				// didn't find it... try higher on the opener
				return findIDA(searchOpener, ref.opener);
			}
		}
	}
	catch (e)
	{}

	try
	{
		// does the current window have a idaFileInstance variable ?
		if (typeof(idaFileInstance) != "undefined")
		{
			// found a copy...
			if (idaFileInstance != null)
				return idaFileInstance;
			else
				return self;
		}
	}
	catch (e)
	{}

	return null;
}

//-----------------------------------------------------------------------------
//-- start IDAHandler object code
function IDAHandler()
{
	// only allow 1 instance of this object
	if (IDAHandler._singleton)
		return IDAHandler._singleton;
	else
	{
		// try to get objects from 1 instance of this file
		IDAHandler._singleton = this;
		try {
			if (idaFileInstance && idaFileInstance.IDAHandler && idaFileInstance.IDAHandler._singleton)
			{
				// copy over parameters...
				this.ida = idaFileInstance.IDAHandler._singleton.ida;
				this.xsl = idaFileInstance.IDAHandler._singleton.xsl;
			}
			else
			{
				idaFileInstance = window;
				this.ida = null;	// ida XML reference
				this.xsl = null;	// ida XSL reference
			}
		} catch(e) {
				idaFileInstance = window;
				this.ida = null;	// ida XML reference
				this.xsl = null;	// ida XSL reference		
		}
	}

	this.translationFunc = null;
	this.labelsIDAry = new Array("prevLnk","nextLnk","backLnk");
	this.labelsAry = new Array("Previous","Next","Back");
	this.commonHTTPUrl = "/lawson/webappjs/commonHTTP.js";
	this.commonHTTPAppended = false;
	this.idaUrl_801 = "/cgi-lawson/ida.exe";
	this.idaUrl_802_803 = "/servlet/ida";
	this.idaUrl_810 = "/servlet/Router/Drill/Erp";
	this.idaXsl = location.protocol + "//" + location.host + "/lawson/webappjs/drillTOhtml.xsl";
	this.win1256idaXsl = location.protocol + "//" + location.host + "/lawson/webappjs/win1256drillTOhtml.xsl";
}
IDAHandler.prototype._singleton = null;
//-----------------------------------------------------------------------------
IDAHandler.prototype.translateLabels = function(wnd)
{
	if (!this.translationFunc)
		return;
	
	if (!wnd)
		wnd = window;
	
	var i = 0;
	
	// labels
	for (i = 0; i<this.labelsAry.length; i++)
	{	
		this.labelsAry[i] = this.translationFunc(this.labelsAry[i]);
		try
		{
			wnd.document.getElementById(this.labelsIDAry[i]).innerHTML = this.labelsAry[i];
		}
		catch(e) {}
	}
}
//-----------------------------------------------------------------------------
IDAHandler.prototype.getProgName = function()
{
	if (!this.isCommonHTTPLoaded())
	{
		this.loadCommonHTTP();
		setTimeout("idaHandler.getProgName()", 5);
		return;
	}

	// what version of IOS do I call?
	if (iosHandler.getIOS() == null && !iosHandler.calledWhat)
		iosHandler.createIOS();

	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
		setTimeout("idaHandler.getProgName()", 5);
		return;
	}

	try {
		var iosVersion = iosHandler.getIOSVersionNumber();

		if (iosVersion.toString().indexOf("08.00.01") != -1)
			return this.idaUrl_801;
		else if (iosVersion < "08.01.00")
			return this.idaUrl_802_803;
		else
			return this.idaUrl_810;
	}
	catch(e)
	{
		return this.idaUrl_801;
	}

	return this.idaUrl_801;
}
//-----------------------------------------------------------------------------
IDAHandler.prototype.getXSL = function()
{
	if (!this.isCommonHTTPLoaded())
	{
		this.loadCommonHTTP();
		setTimeout("idaHandler.getXSL()", 5);
		return;
	}

	// what version of IOS do I call?
	if (iosHandler.getIOS() == null && !iosHandler.calledWhat)
		iosHandler.createIOS();

	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
		setTimeout("idaHandler.getXSL()", 5);
		return;
	}

	try {
		if (iosHandler.getIOSVersionNumber() >= "08.01.00")
		{
			var encoding = iosHandler.getEncoding();
			if (encoding && encoding.toString().toLowerCase() == "windows-1256")
				this.xsl = this.win1256idaXsl;
			else	
				this.xsl = this.idaXsl;
		}
		else
		{
			this.xsl = null;
		}	
	}
	catch(e)
	{
		this.xsl = null;
	}

	return this.xsl;
}
//-----------------------------------------------------------------------------
IDAHandler.prototype.isCommonHTTPLoaded = function()
{
	if (typeof(SEARequest) == "function")
	{
		this.commonHTTPAppended = true;	
		return true;
	}	
	return false;
}
//-----------------------------------------------------------------------------
IDAHandler.prototype.loadCommonHTTP = function()
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
//-- end IDAHandler object code
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// METHODS TO CREATE AND EXECUTE THE DRILL CALL
//
//-----------------------------------------------------------------------------

function callIDA(string, frameStr, debugFl)
{
	if (debugFl)
		alert("DEBUG: Calling callIDA(" + string + "," + frameStr + ")");
	eval("window." + frameStr + ".location.replace(\"" + string + "\")")
}

function IDAObject(prodLine, type)
{
	if (typeof(idaHandler) != "object")
		idaHandler = new IDAHandler();

	this.protocol = location.protocol;
	this.host = location.host;
	this.progName = idaHandler.idaUrl_801;
	this.prod = prodLine;
	this.file = null;
	this.system = null;
	this.out = null;
	this.index = null;
	this.type = type;
	this.keynbr = null;
	this.keynbrval = null;
	this.keys = null;
	this.debug = false;
   	this.IDABuild = IDABuild;
   	this.xsl = null;
   	this.theme = "9";
   	this.webappjsUrl = "/lawson/webappjs";
   	this.textDir = "ltr";
   	this.encoding = null;
}

function IDABuild()
{
	var object = this;
	var urlStr = object.protocol + "//" + object.host + object.progName + "?"
	var urlSep = "&";
	var parmsStr = "";
	var is810 = (object.xsl != null && object.progName == idaHandler.idaUrl_810) ? true : false;

	parmsStr += "_PDL=" + object.prod;

	if (object.file != null && object.file.length > 0)
	{
		parmsStr += urlSep + "_FN=" + object.file;
	}

	// Set the output format
	// HTML, XML
	if (object.out != null && object.out.length > 0)
	{
		parmsStr += urlSep + "_OUT="
		if (!is810)
		{
			var upperout = object.out.toUpperCase()
			if (upperout == "HTML" ||
			upperout == "XML"
			)
				parmsStr += upperout;
			else
			{
				alert("Invalid _OUT value " + object.out);
				return null;
			}
		}
		else
			parmsStr += "XML";
	}

	if (object.type != null && object.type.length > 0)
		parmsStr += urlSep + "_TYP=" + object.type;

	if (object.system != null && object.system.length > 0)
		parmsStr += urlSep + "_SYS=" + object.system;

	if (object.index != null && object.index.length > 0)
		parmsStr += urlSep + "_IN=" + object.index;

	if (object.keynbr != null && object.keynbr.length > 0)
		parmsStr += urlSep + "_KNB=" + object.keynbr;

	if (object.keys != null && object.keys.length > 0)
		parmsStr += urlSep + object.keys;

	if (is810)
		parmsStr += urlSep + "_XSL1=" + object.xsl + "&_XSLPARAM=theme|" + object.theme + ";webappjsUrl|" + object.webappjsUrl + ";dir|" + object.textDir;
	
	urlStr += parmsStr;
   	return urlStr;
}

function IDA(object, frameStr)
{
	if (!idaHandler.isCommonHTTPLoaded())
	{
		idaHandler.loadCommonHTTP();
		var thisObj = object;
		var thisFrame = frameStr;
		setTimeout(function(){ IDA(thisObj, frameStr); }, 5);
		return;
	}

	iosFileInstance = findIOS();
	iosHandler = (iosFileInstance && iosFileInstance.iosHandler) ? iosFileInstance.iosHandler : new IOSHandler();
	iosHandler.setEscapeFunc();
	
    // what version of IOS do I call?
	if (iosHandler.getIOS() == null && !iosHandler.calledWhat)
		iosHandler.createIOS();

	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
		var thisObj = object;
		var thisFrame = frameStr;
		setTimeout(function(){ IDA(thisObj, frameStr); }, 5);
		return;		
	}

	object.xsl = idaHandler.getXSL();
	object.progName = idaHandler.getProgName();
	object.encoding = iosHandler.getEncoding();

	if (frameStr)
	{
		callIDA(object.IDABuild(), frameStr, object.debug);
		return "";
	}
	else
	{
		return object.IDABuild();
	}
}

function escapeParam(str)
{
	return iosHandler.escapeStr(unescape(str));
}
