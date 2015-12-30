/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/commonHTTP.js,v 1.39.2.12.2.6 2014/02/18 16:42:31 brentd Exp $ */
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

var iosFileInstance = findIOS();
var iosHandler = new IOSHandler();

//-----------------------------------------------------------------------------
//-- start browser object code
function SEABrowser()
{
	// only allow 1 instance of this object
	if (SEABrowser._singleton)
		return SEABrowser._singleton;
	else
		SEABrowser._singleton = this;

	// browsers
	this.isIE = false;
	this.isNS = false;
	this.isFirefox = false;
	this.isOpera = false;
	this.isSafari = false;
	this.isGecko = false;
	this.isMozilla = false;
	this.isChrome = false;
	this.version = null;
	this.language = "en-us";

	// operating systems
	this.isMAC = false;
	this.isWIN = false;
	this.osVersion = 0;
	this.isXP = false;

	// other
	this.isQuirksMode = false;
	this.isGetCurrentStyle = false;
 	this.isGetElementById = false;
 	this.BACK_COMP = "BackCompat";

	var ua = navigator.userAgent;
	var an = navigator.appName;

	// BROWSER
	if (an == "Microsoft Internet Explorer")
	{
		// Opera lies and says it's IE
		if (ua.indexOf("Opera") != -1)
		{
			var key = "Opera ";
			this.isOpera = true;
			this.version = parseFloat(ua.substr(ua.indexOf(key) + key.length));
		}
		else
		{
			var key = "MSIE ";
			this.isIE = true;
			this.version = parseFloat(ua.substr(ua.indexOf(key) + key.length));
		}
	}
	else if (an == "Netscape")
	{
		// IE 11+ lies and says it's Netscape
		if (ua.indexOf("Trident") != -1)
		{
			var key = "rv:";
			this.isIE = true;
			this.version = parseFloat(ua.substr(ua.indexOf(key) + key.length));
		}
		// Firefox lies and says it's Netscape
		if (ua.indexOf("Firefox") != -1)
		{
			var key = "Firefox/";
			this.isFirefox = true;
			this.version = parseFloat(ua.substr(ua.indexOf(key) + key.length));
		}
		// Chrome lies and says it's Netscape
		else if (ua.indexOf("Chrome") != -1)
		{
			var key = "Chrome/";
			this.isChrome = true;
			this.version = parseFloat(ua.substr(ua.indexOf(key) + key.length));
		}
		// Safari lies and says it's Netscape
		else if (ua.indexOf("Safari") != -1)
		{
			var key = "Safari/";
			this.isSafari = true;
			this.version = parseFloat(ua.substr(ua.indexOf(key) + key.length));
		}
		else
		{
			this.isNS = true;
			this.version = parseFloat(navigator.vendorSub);
		}
	}

	// gecko & mozilla
	if (navigator.product == "Gecko")
		this.isGecko = true;
	if (navigator.appCodeName == "Mozilla")
		this.isMozilla = true;

	// language
	this.language = ((this.isIE) ? navigator.userLanguage : navigator.language).toLowerCase();

	// OPERATING SYSTEM
	if (ua.indexOf("Windows") >= 0)
	{
		this.isWIN = true;
		var idx = ua.indexOf("Windows NT ");
		if (idx != -1)
		{
			this.osVersion = parseFloat(ua.substring(idx+11), 10);
			if (this.osVersion >= 5.1)
				this.isXP = true;
		}
	}
	else if (ua.indexOf("Macintosh") >= 0)
		this.isMAC = true;

	// Render Mode (Quirks)
 	if (document.compatMode == this.BACK_COMP)
		this.isQuirksMode = true;

	// checking for method getComputedStyle()
 	if (window.getComputedStyle)
	 	this.isGetCurrentStyle = true;

	// checking for method getElementById()
 	if (document.getElementById)
	 	this.isGetElementById = true;
}
//-----------------------------------------------------------------------------
SEABrowser.prototype.cookiesEnabled = function()
{
	if (navigator.cookieEnabled)
	{
		var cName = "TestCookie";
		var cValue = "Cookie Saved!";
		this.setCookie(cName, cValue, new Date(new Date().getTime()+25000)); // a 25-second cookie
		if (this.getCookie(cName) == cValue)
			return true;
	}
	return false;
}
//-----------------------------------------------------------------------------
SEABrowser.prototype.getCookie = function(name)
{
	var re = new RegExp(name + "=([^;]+)");
	var value = re.exec(document.cookie);
	return (value != null) ? unescape(value[1]) : null;
}
//-----------------------------------------------------------------------------
SEABrowser.prototype.setCookie = function(name, value, expires, path, domain, secure)
{
	if (!name || !value)
		return;

	var c = name + "=" + escape(value);
	if (expires)
		c += "; expires=" + expires.toGMTString();
	if (path)
		c += "; path=" + path;
	if (domain)
		c += "; domain=" + domain;
	if (secure && typeof(secure) == "boolean")
		c += "; secure";
	document.cookie = c;
}
SEABrowser.prototype._singleton = null;
//-- end browser object code
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
//-- start object factory code
function SEAObjectFactory()
{
	// only allow 1 instance of this object
	if (SEAObjectFactory._singleton)
		return SEAObjectFactory._singleton;
	else
		SEAObjectFactory._singleton = this;

	// default to minimal XML support
	this.browser = new SEABrowser();
	this.errorObj = new SEAErrorObject();
	this.xmlVersion = (this.browser.isIE ? "2.0" : "");
	this.xmlDOMProgId = (this.browser.isIE ? "Microsoft.XMLDOM" : "");
	this.xmlHTTPProgId = (this.browser.isIE ? "Microsoft.XMLHTTP" : "NSMTTPReqest");
	this.xmlFTDOMProgId = "";
	this.xmlXSLTProgId = "";

	if (!this.browser.isIE)
		return;

	var domObj = null;
	var ver = "";
	try
	{
		domObj = new ActiveXObject("Msxml2.DOMDocument.6.0");
		ver = "6.0";
	}
	catch (e)
	{
		try
		{
			domObj = new ActiveXObject("Msxml2.DOMDocument.4.0");
			ver = "4.0";
		}
		catch (e)
		{
			try
			{
				domObj = new ActiveXObject("Msxml2.DOMDocument.3.0");
				ver = "3.0";
			}
			catch (e)
			{
				try
				{
					// 'basic' DOM Documents only
					domObj = new ActiveXObject(this.xmlDOMProgId);
				}
				catch (e)
				{
					this.xmlDOMProgId = "";
					this.xmlHTTPProgId = "";
				}
				return;
			}
		}			
	}
	this.xmlVersion  = ver;
	this.xmlDOMProgId = "Msxml2.DOMDocument." + ver;
	this.xmlHTTPProgId = "Msxml2.XMLHTTP." + ver;
	this.xmlFTDOMProgId = "Msxml2.FreeThreadedDOMDocument." + ver;
	this.xmlXSLTProgId = "Msxml2.XSLTemplate." + ver;
	this.xsltSupport = (this.browser.isIE && (this.xmlVersion == "6.0" || this.xmlVersion == "4.0" || this.xmlVersion == "3.0"))
					 ? true
					 : false;
}
SEAObjectFactory.prototype._singleton = null;
//-----------------------------------------------------------------------------
SEAObjectFactory.prototype.getMSXMLVersion = function()
{
	return this.xmlVersion;
}
//-----------------------------------------------------------------------------
SEAObjectFactory.prototype.createInstance = function(type)
{
	var retObj = null;
	try
	{
		switch(type.toUpperCase())
		{
			case "DOM":  // DOM document
				retObj = this.browser.isIE
					? new ActiveXObject(this.xmlDOMProgId)
					: null;
				if (this.xmlVersion.indexOf("6.0") >= 0) 
				{
	                retObj.setProperty("AllowXsltScript", true);
	                retObj.setProperty("AllowDocumentFunction", true);
	                retObj.resolveExternals = true;
	            }
				break;
			case "HTTP": // HTTP request object
				retObj = this.browser.isIE
					? new ActiveXObject(this.xmlHTTPProgId)
					: new XMLHttpRequest();
				break;
			case "FTDOM": // FreeThreaded DOM document
				retObj = this.browser.isIE
					? new ActiveXObject(this.xmlFTDOMProgId)
					: null;
				break;
			case "XSLT": // XSLT Template object
				retObj = this.browser.isIE
					? new ActiveXObject(this.xmlXSLTProgId)
					: null;
				break;
		}
	}
	catch (e)
	{ // do nothing
	}
	return retObj;
}
//-----------------------------------------------------------------------------
SEAObjectFactory.prototype.formatXML = function(dom)
{
	if (dom == null)
		return "null";

	var strXml = (dom.xml) ? dom.xml : this.getStringFromDom(dom, true);
	strXml = strXml.replace( /\>\</gm ,">\n<");

	if (this.xsltSupport)
	{
		// jump through hoops to get nice format ;-)
		dom = this.createInstance("DOM");
		dom.async = false;
		dom.loadXML(strXml);
		strXml = dom.xml;
	}
	return strXml;
}
//-----------------------------------------------------------------------------
SEAObjectFactory.prototype.getDomFromString = function(xmlStr)
{
	if (typeof(xmlStr) != "string")
		xmlStr = "";

	var retDom = null;
	var errorMsg = "Invalid XML String";
	var errorDtl = "SEAObjectFactory.getDomFromString() - commonHTTP.js";

	if (this.browser.isIE)
	{
		retDom = this.createInstance("DOM");
		retDom.async = false;
		retDom.loadXML(xmlStr);
		var pErr = retDom.parseError;
		if (pErr.errorCode != 0)
		{
			errorDtl = "Reason: " + pErr.reason + "\n"
					 + ((pErr.url != "") ? "URL: " + pErr.url + "\n" : "")
					 + "Source: " + pErr.srcText + "\n"
					 + "Line: " + pErr.line + "\n"
					 + "Line Position: " + pErr.linepos + "\n"
					 + "File Position: " + pErr.filepos + "\n"
					 + errorDtl;
			return this.errorObj.getErrorDom(errorMsg, errorDtl);
		}
	}
	else
	{
		var parser = new DOMParser();
		retDom = parser.parseFromString(xmlStr, "text/xml");

		if (retDom.documentElement.nodeName == "parsererror")
		{
			if (retDom.documentElement.firstChild)
				errorDtl = retDom.documentElement.firstChild.nodeValue + "\n\n" + errorDtl;
			return this.errorObj.getErrorDom(errorMsg, errorDtl);
		}
	}
	return retDom;
}
//-----------------------------------------------------------------------------
SEAObjectFactory.prototype.getStringFromDom = function(xmlDom, bFormat)
{
	if (typeof(bFormat) != "boolean")
		bFormat = false;

	if (this.browser.isIE)
	{
		if (!bFormat)
			return xmlDom.xml;

		try
		{
			var str = xmlDom.replace(/\>\</gi,">\n<");
			var dom = this.createInstance("DOM");
			dom.async = false;
			dom.loadXML(str);
			str = dom.xml;
			return str;
		}
		catch (e)
		{}

		return xmlDom.xml;
	}

	// non IE
	var ser = new XMLSerializer();
	var str = ser.serializeToString(xmlDom);
	if (bFormat)
	{
		str = str.replace(/\>\</gi,">\n<");
		str = str.replace(/\>\t/g,">\n\t");
	}
	return str;
}
//-- end object factory code
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
//-- start error object code
function SEAErrorObject()
{
	this.browser = new SEABrowser();
	this.objFactory = new SEAObjectFactory();
}
//-----------------------------------------------------------------------------
SEAErrorObject.prototype.getErrorDom = function(msg, details, errorNbr, levelNbr)
{
	if (typeof(msg) == "undefined")
		msg = "Error";
	if (typeof(details) == "undefined")
		details = "No additional details to provide.\n\nSEAErrorObject.getErrorDom() - commonHTTP.js";
	if (typeof(errorNbr) == "undefined")
		errorNbr = 1;
	if (typeof(levelNbr) == "undefined")
		levelNbr = 1;

	var xmlStr = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>"
			   + "<ERROR key=\"" + errorNbr + "\" level=\"" + levelNbr + "\">"
			   + "<MSG>" + msg + "</MSG>"
			   + "<DETAILS><![CDATA[" + details + "]]></DETAILS>"
			   + "</ERROR>";

	return this.objFactory.getDomFromString(xmlStr);
}
//-----------------------------------------------------------------------------
SEAErrorObject.prototype.isErrorDom = function(errorDom)
{
	return (this.getErrorKey(errorDom) == null ||
			this.getErrorLevel(errorDom) == null ||
			this.getErrorMessage(errorDom) == null)
		? false : true;
}
//-----------------------------------------------------------------------------
SEAErrorObject.prototype.getErrorKey = function(errorDom)
{
	var errorNodes = errorDom.getElementsByTagName("ERROR");
	if (errorNodes && errorNodes.length > 0)
		return errorNodes[0].getAttribute("key");
	return null;
}
//-----------------------------------------------------------------------------
SEAErrorObject.prototype.getErrorLevel = function(errorDom)
{
	var errorNodes = errorDom.getElementsByTagName("ERROR");
	if (errorNodes && errorNodes.length > 0)
		return errorNodes[0].getAttribute("level");
	return null;
}
//-----------------------------------------------------------------------------
SEAErrorObject.prototype.getErrorMessage = function(errorDom)
{
	var msgNodes = errorDom.getElementsByTagName("MSG");
	if (msgNodes.length == 0)
		return null;

	var nodes = msgNodes[0].childNodes;
	var len = (nodes && nodes.length ? nodes.length : 0);
	var strRet = "";
	for (var i=0; i<len; i++)
	{
		if (nodes[i].nodeType == 3 || nodes[i].nodeType == 4)
			strRet += nodes[i].nodeValue;
	}
    return strRet;
}
//-----------------------------------------------------------------------------
SEAErrorObject.prototype.getErrorDetails = function(errorDom)
{
	var detNodes = errorDom.getElementsByTagName("DETAILS");
	if (detNodes.length == 0)
		return null;

	var nodes=detNodes[0].childNodes;
	var len=nodes.length;
	for (var i=0; i<len; i++)
	{
		if (nodes[i].nodeType==4)
		{
			var ary = nodes[i].nodeValue.split(")");
			var details = "";
			for (var j=0; j<ary.length-1; j++)
				details += ary[j] + ")\n";
			details += ary[ary.length-1];
			return details;
		}
	}
	return null;

}
//-----------------------------------------------------------------------------
SEAErrorObject.prototype.getExceptionMsg = function(e)
{
	var errorMsg = "";
	if (this.browser.isIE)
	{
		errorMsg = "ERROR: " + e.name + "\n"
				 + "Number: " + (e.number & 0xFFFF) + "\n"
				 + "Message: " + e.message + "\n"
				 + "Description: " + e.description
	}
	else
	{
		errorMsg += "ERROR:\n";
		var isCharAry = null;
		var ctr = 0;
		for (var i in e)
		{
			if (isCharAry == null)
				isCharAry = (e[i].length > 1) ? false : true ;
			if (isCharAry)
			{
				errorMsg += e[i];
				if (++ctr % 70 == 0)
					errorMsg += "\n"
			}
			else
				errorMsg += e[i] + "\n";
		}
	}
	return errorMsg;
}
//-- end error object code
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
function SEARequest(url, pkg, cntType, outType, bShowErrors, xmlVersion)
{
	try
	{
		var objFactory = new SEAObjectFactory();
		var browser = new SEABrowser();
		var errorObj = new SEAErrorObject();
		var oHTTP;
		var oResponse;
		var sndDom;
		var cmd = "GET";
		var conType;

		if (typeof(cntType) == "undefined" || cntType == "" || cntType == null)
			cntType = "text/xml";	//Default to XML if undefined
		if (typeof(outType )== "undefined" || outType == "" || outType == null)
			outType = "text/xml";	//Default to XML if undefined
		if (typeof(bShowErrors) != "boolean")
			bShowErrors = true;

		// Check for an invalid URL
		if (typeof(url) == "undefined" || url == null || url == "")
		{
			var errorMsg = "Invalid URL: " + url;
			var errorDtl = "SEARequest() - commonHTTP.js";
			if (bShowErrors)
				alert(errorMsg + "\n\n" + errorDtl);

			if (outType == "text/xml")
				return errorObj.getErrorDom(errorMsg, errorDtl);
			else
				return errorMsg;
		}

		oHTTP = objFactory.createInstance("HTTP");

		switch(typeof(pkg))
		{
			case "string":
			{
				if (pkg == "")
				{
					pkg = null;
					break;
				}
				//Load into a DOM object, NS can not take a javascript string as a send parameter
				cmd = "POST";
				if (cntType == "text/xml")
				{
					pkg = objFactory.getDomFromString(pkg);
					if (pkg.documentElement.nodeName == "ERROR")
					{
						if (bShowErrors)
							alert(pkg.documentElement.firstChild.firstChild.nodeValue + "\n\n" + pkg.documentElement.firstChild.nextSibling.firstChild.nodeValue);
						return pkg;
					}
				}
				break;
			}
			case "object":
			{
				if (pkg == null)
					break;
				//Must be a DOM or some other stream type object
				cmd = "POST";
				break;
			}
			default:
			{
				//No package, request is a get
				pkg = null;
				break;
			}
		}

		oHTTP.open(cmd, url, false);
		oHTTP.setRequestHeader("content-type", cntType);
		oHTTP.send(pkg);

		// on error return http object so caller can inquire on status
		if (oHTTP.status >= 400)
			return (oHTTP);

		// Check for a blank server response
		if ((browser.isIE && oHTTP.responseText == "" && oHTTP.responseXML.xml == "")
		 || (oHTTP.responseText == null && oHTTP.responseXML == null))
		{
			var errorMsg = "Server response not populated";
			var errorDtl = url + "\nSEARequest() - commonHTTP.js";
			if (bShowErrors)
				alert(errorMsg + "\n\n" + errorDtl);

			if (outType == "text/xml")
				return errorObj.getErrorDom(errorMsg, errorDtl);
			else
				return errorMsg;
		}
		
		// if content-type is undefined (not text/xml) from the middle tier app we must use responseText
		// once all middle tier apps set response header to text/xml we will be able to use responseXML solely
		try
		{
			conType = oHTTP.getResponseHeader("content-type");
		}
		catch (e)
		{
			conType = null;
		}

		if (conType.indexOf("text/xml") == 0)
			oResponse = oHTTP.responseXML;
		else if (outType == "text/xml")
			oResponse = objFactory.getDomFromString(oHTTP.responseText);
		else
			oResponse = oHTTP.responseText;

		if (conType.indexOf("text/xml") == 0 || outType == "text/xml")
		{
			// check for valid DOM
			if (!oResponse.documentElement)
			{
				var errorMsg = "Invalid XML - Root node does not exist";
				var errorDtl = url + "\nSEARequest() - commonHTTP.js";
				if (bShowErrors)
					alert(errorMsg + "\n\n" + errorDtl);
				return errorObj.getErrorDom(errorMsg, errorDtl);
			}

			// check for Netscape parse error, wrap in standard error format
			if (browser.isNS && oResponse.documentElement.nodeName == "parsererror")
			{
				var errorMsg = "Invalid XML";
				var errorDtl = url + "\nSEARequest() - commonHTTP.js";
				if (oResponse.documentElement.firstChild)
					errorDtl = oResponse.documentElement.firstChild.nodeValue;
				oResponse = errorObj.getErrorDom(errorMsg, errorDtl);
			}

			// check for standard error
			if (oResponse.documentElement.nodeName == "ERROR")
			{
				if (bShowErrors)
				{
					var details = oResponse.documentElement.firstChild.nextSibling.firstChild.nodeValue;
					if (details.length > 1024)
						details = details.substring(0, 1024) + "...";
					var msg = oResponse.documentElement.firstChild.firstChild.nodeValue
							+ "\n\n" + url + "  -  SEARequest() - commonHTTP.js"
							+ "\n\n" + details;
					alert(msg);
				}
				return oResponse;
			}
		}

		return oResponse;
	}
	catch (e)
	{
		var errorMsg = "Error calling " + url;
		var errorDtl = errorObj.getExceptionMsg(e) + "\n\nSEARequest() - commonHTTP.js";
		if (bShowErrors)
			alert(errorMsg + "\n\n" + errorDtl);
		return errorObj.getErrorDom(errorMsg, errorDtl);
	}
}

//-----------------------------------------------------------------------------
function findIOS(searchOpener, ref)
{
	if (!ref)
		ref = self;	
	
	try
	{
		// is there a parent ?
		if (ref != ref.parent)
		{
			// does the parent have an iosFileInstance variable ?
			if (typeof(ref.parent.iosFileInstance) != "undefined")
			{
				// found a copy...
				if (ref.parent.iosFileInstance != null)
					return ref.parent.iosFileInstance;
				else
					return ref.parent;
			}
			else
			{
				// didn't find it... try higher
				return findIOS(searchOpener, ref.parent);
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
			// does the opener have an iosFileInstance variable ?
			if (typeof(ref.opener.iosFileInstance) != "undefined")
			{
				// found a copy...
				if (ref.opener.iosFileInstance != null)
					return ref.opener.iosFileInstance;
				else
					return ref.opener;
			}
			else
			{
				// didn't find it... try higher on the opener
				return findIOS(searchOpener, ref.opener);
			}
		}
	}
	catch (e)
	{}

	try
	{
		// does the current window have an iosFileInstance variable ?
		if (typeof(iosFileInstance) != "undefined")
		{
			// found a copy...
			if (iosFileInstance != null)
				return iosFileInstance;
			else
				return self;
		}
	}
	catch (e)
	{}

	return null;
}

function findSSORequest(searchOpener, ref)
{
	if (!ref)
	{
		ref = self;
	}
	try
	{
		// does the current window have this object?
		if (typeof(ref["SSORequest"]) != "undefined" && ref["SSORequest"] != null)
		{
			return ref;
		}
		// is there a parent ?
		else if (ref != ref.parent)
		{
			// didn't find it... try higher
			return findSSO(searchOpener, ref.parent);
		}
	}
	catch (e)
	{}
	try
	{
		// is there an opener ?
		if (searchOpener && ref.opener)
		{
			// does the opener have this object?
			if (typeof(ref.opener["SSORequest"]) != "undefined" && ref.opener["SSORequest"] != null)
			{
				// found a copy...
				return ref.opener;
			}
			else
			{
				// didn't find it... try higher on the opener
				return findObjWnd(searchOpener, ref.opener);
			}
		}
	}
	catch (e)
	{}
	return null;
}

//-----------------------------------------------------------------------------
//-- start IOSHandler object code
function IOS()
{
	this.version = null;
	this.versionNumber = null;
	this.title = null;
	this.vendor = null;
	this.date = null;
	this.time = null;
}
//-- end IOSHandler object code
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
function cloneIOS(iosInstance)
{
    var clonedIOS = new IOS();
    clonedIOS.version = iosInstance.version;
    clonedIOS.versionNumber = iosInstance.versionNumber;
    clonedIOS.title = iosInstance.title;
    clonedIOS.vendor = iosInstance.vendor;
    clonedIOS.date = iosInstance.date;
    clonedIOS.time = iosInstance.time;
    return clonedIOS;
}

//-----------------------------------------------------------------------------
//-- start IOSHandler object code
function IOSHandler()
{
	// only allow 1 instance of this object
	if (IOSHandler._singleton)
		return IOSHandler._singleton;
	else
	{
		// try to get objects from 1 instance of this file
		IOSHandler._singleton = this;
		try
		{
			if (iosFileInstance && iosFileInstance.IOSHandler && iosFileInstance.IOSHandler._singleton && iosFileInstance.IOSHandler._singleton.IOS)
			{
				// copy over parameters...
				this.browser = iosFileInstance.IOSHandler._singleton.browser;
				this.IOS = cloneIOS(iosFileInstance.IOSHandler._singleton.IOS);
				this.xml = iosFileInstance.IOSHandler._singleton.xml;
			}
			else
			{
				this.browser = null;
				this.IOS = null;			// IOS version object
				this.xml = null;			// What servlet XML reference	
			}
		}
		catch (e)
		{
			this.browser = null;
			this.IOS = null;			// IOS version object
			this.xml = null;			// What servlet XML reference		
		}
	}

	this.calledWhat = false;
	this.ssoFileAppended = false;
	this.ssoFileUrl = "/sso/sso.js";
	this.whatUrl = "/servlet/What?_JAR=IOS.jar&_SERVLET=Profile";
	this.versionBeginsWith = "8-)@(#)@";
	this.cvsString = "@" + "PRODNUM" + "@." + "@" + "BUILDNUM" + "@";
	this.encoding = null;
}
IOSHandler.prototype._singleton = null;
//-----------------------------------------------------------------------------
IOSHandler.prototype.createIOS = function(param)
{
	this.browser = new SEABrowser();
	if (!this.IOS)
		this.IOS = new IOS();

	// what version of IOS do I call?
	if (this.getIOSVersion() == null)
	{	
		// detect cached version string	
		var iosVersionString = null;
		try
		{
			// try to retrieve the IOS version string in the top window
			if (top && top._IOSVersion)
				iosVersionString = top._IOSVersion;
			else if (parent && parent._IOSVersion)
				iosVersionString = parent._IOSVersion;
			else if (opener && opener.top && opener.top._IOSVersion)
				iosVersionString = opener.top._IOSVersion;
		}
		catch(e)
		{}
	
		try
		{
			if (iosVersionString)
			{
				// make sure sso.js is loaded before we set the IOS version so the SSORequest()
				// function is available
				if (iosVersionString >= "08.01.00.00")
				{
					if (!this.isSSOFileLoaded())
					{
						this.loadSSOFile();
						setTimeout("iosHandler.createIOS()", 5);
						return;
					}
					SEARequest = SSORequest;
				}
				
				this.setIOSVersion(null, iosVersionString);
				return;
			}
		}
		catch(e)
		{}
	
		this.IOS = new IOS();

		// check for the IOS.jar version, on fail check laversion of Profile
		if (this.isSSOFileLoaded())
		{
			if (!this.browser.isIE)
			{
				var authObj = new SSOAuthObject();
				if (!authObj.ping())	
				{
					var ssoWnd = (ssoFileInstance != null) ? ssoFileInstance : window;				
					return ssoWnd.showLoginPage();
				}
			}
			SEARequest = SSORequest;
			var whatDom = SSORequest(this.whatUrl, null, null, null, false);
			// do this for Netscape
			if (whatDom == null)
				return;
			this.setIOSVersion(whatDom, "09.00.00.00");
			this.calledWhat = true;
		}
		else if (this.ssoFileAppended)
		{
			// sso.js file appended... but not yet ready
			setTimeout("iosHandler.createIOS()", 5);
			return;
		}
		else
		{
			this.loadSSOFile();
			setTimeout("iosHandler.createIOS()", 5);
			return;			
		}
	}	

	// if the What servlet failed to produce a valid version or if it is this.cvsString then set it to 9.0.0
	//PT 154588- Added this.getIOSVersion() != null check in the if condition.
	if (this.getIOSVersion() != null && this.getIOSVersion().indexOf(this.cvsString) >= 0)
       		this.setIOSVersion(null, "09.00.00.00");		
	else if (this.getIOSVersion() == null || isNaN(parseFloat(this.getIOSVersion())))
       		this.setIOSVersion(null, "09.00.00.00");

	// try to cache the version string	
	try
	{
		// try to store the IOS version string in the top window
		top._IOSVersion = this.getIOSVersionNumber();
	}
	catch(e)
	{}
	
	// try to store the IOS version string in the parent window
	try
	{
		parent._IOSVersion = this.getIOSVersionNumber();
	}
	catch(e)
	{}
	
	// try to store the IOS version string in the opener window
	try
	{
		opener.top._IOSVersion = this.getIOSVersionNumber();
	}
	catch(e)
	{}
}
//-----------------------------------------------------------------------------
IOSHandler.prototype.getIOS = function()
{
	return this.IOS;
}
//-----------------------------------------------------------------------------
IOSHandler.prototype.getIOSVersion = function()
{
	this.formatDigits();
	return this.IOS.version;
}
//-----------------------------------------------------------------------------
IOSHandler.prototype.getIOSVersionNumber = function()
{
	this.formatDigits();
	return this.IOS.versionNumber;
}
//-----------------------------------------------------------------------------
IOSHandler.prototype.getIOSTitle = function()
{
	return this.IOS.title;
}
//-----------------------------------------------------------------------------
IOSHandler.prototype.getIOSVendor = function()
{
	return this.IOS.vendor;
}
//-----------------------------------------------------------------------------
IOSHandler.prototype.getIOSDate = function()
{
	return this.IOS.date;
}
//-----------------------------------------------------------------------------
IOSHandler.prototype.getIOSTime = function()
{
	return this.IOS.time;
}
//-----------------------------------------------------------------------------
IOSHandler.prototype.setEncoding = function(value)
{
	this.encoding = value || null;
}
//-----------------------------------------------------------------------------
IOSHandler.prototype.getEncoding = function()
{
	return this.encoding;
}
//-----------------------------------------------------------------------------
IOSHandler.prototype.escapeStr = function(value)
{
	return escape(value).replace(/\+/g, "%2B");
}
//-----------------------------------------------------------------------------
IOSHandler.prototype.setEscapeFunc = function(func)
{
	if (func)
		this.escapeStr = func;
	else if (this.encoding != null && typeof(window["escapeForCharset"]) == "function")
		this.escapeStr = window.escapeForCharset;
}
//-----------------------------------------------------------------------------
IOSHandler.prototype.isSSOFileLoaded = function()
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
IOSHandler.prototype.loadSSOFile = function()
{
	if (this.ssoFileAppended)
		return;

	if (!this.isSSOFileLoaded())
	{
		var scElm = document.createElement("SCRIPT");
		scElm.src = this.ssoFileUrl;
		document.body.appendChild(scElm);
		this.ssoFileAppended = true;
	}
}
//-----------------------------------------------------------------------------
IOSHandler.prototype.isSSOLoginPage = function(resTxt)
{
	var tmpAry = new Array("_ssoUser", "_ssoPass", "_ssoOrigUrl");

	try
	{
		for (var i in tmpAry)
		{
			if (resTxt.indexOf(tmpAry[i]) == -1)
			{
				return false;
			}
		}
	} 
	catch(e)
	{
		return false;
	}
	
	return true;
}
//-----------------------------------------------------------------------------
IOSHandler.prototype.setIOSVersionString = function(vString)
{
//alert("setIOSVersionString\n" + vString)	
	// strip this string, if it's there: 8-)@(#)@
	if (vString.indexOf(this.versionBeginsWith) == 0)
	{
		this.IOS.version = vString.substring(this.versionBeginsWith.length);
	}
	else
	{
		this.IOS.version = vString;
	}

	try 
	{
		var tArr = this.IOS.version.split(" ");
		if (tArr.length > 0) 
		{
			this.IOS.versionNumber = tArr[0];
		}
		if (tArr.length > 2) 
		{
			this.IOS.date = tArr[1];
			this.IOS.time = tArr[2];
		}
	}
	catch(e) 
	{
		this.IOS.versionNumber = this.IOS.version;
		this.IOS.date = null;
		this.IOS.time = null;
	}
	this.formatDigits();	
}
//-----------------------------------------------------------------------------
IOSHandler.prototype.formatDigits = function()
{
	if (this.IOS && this.IOS.versionNumber)
	{
		var versionDigits = this.IOS.versionNumber.split(".");
		for (var i=0; i<versionDigits.length; i++)
		{
			var len = versionDigits[i].length;
			if (len < 2)
			{
				for (var j=len; j<2; j++)
				{
					versionDigits[i] = "0" + versionDigits[i];	
				}
			}	
		}
		this.IOS.versionNumber = versionDigits.join(".");
		this.IOS.version = versionDigits.join(".");
	}
}
//-----------------------------------------------------------------------------
IOSHandler.prototype.setIOSManifest = function(mString)
{
	var tArr = mString.split(": ");
   	this.IOS.title = tArr[1].split("\n")[0];
   	this.IOS.vendor = tArr[3].split("\n")[0];
}
//-----------------------------------------------------------------------------
IOSHandler.prototype.setIOSVersion = function(whatDom, dVersion)
{
	if (!whatDom)
	{
		this.setIOSVersionString(dVersion);
		return;
	}

	try
	{
		var jars = whatDom.getElementsByTagName("JAR");
		var setVersion = false;
		var setManifest = false;
		
		for (var i=0; i<jars.length; i++)
		{
			if (jars[i].getAttribute("name") == "IOS.jar")
			{
				var laver = jars[i].getElementsByTagName("LAVERSION");
				if (laver.length > 0 && !setVersion)
				{
					// check for error node...
					var errors = laver[0].getElementsByTagName("ERROR");
					if (errors.length > 0)
					{
						// try to get the version off the Profile servlet class
						setVersion = this.getProfileVersion(whatDom);

						// didn't work, alert the msg and go to default
						var msgs = errors[0].getElementsByTagName("MSG");
						alert(msgs[0].childNodes[0].nodeValue + "\n\nSetting IOS Version = " + dVersion + "\nIOSHandler.setIOSVersion() - commonHTTP.js");
						break;
					}
					else
					{
						for (var n=0; n<laver[0].childNodes.length; n++)
							if (laver[0].childNodes[n].nodeType == 4)
							{
								var laverStr = laver[0].childNodes[n].nodeValue;
								// make sure the LAVERSION string is a numeric value
								if (laverStr.search(/^(\s*)(\d+)/) == -1)
								{
									// try to get the version off the Profile servlet class
									setVersion = this.getProfileVersion(whatDom);									
								}
								else
								{
									this.setIOSVersionString(laverStr);
									setVersion = true;
								}
								break;							
							}
					}
				}
				var manifest = jars[i].getElementsByTagName("MANIFEST");
				if (manifest.length > 0 && !setManifest)
				{
						for (var n=0; n<manifest[0].childNodes.length; n++)
							if (manifest[0].childNodes[n].nodeType == 4)
							{
								this.setIOSManifest(manifest[0].childNodes[n].nodeValue);
								setManifest = true;
								break;
							}					
				}
			}
		}
	}
	catch (e)
	{}

   	// if we get the cvs string, assume a dev sandbox
   	if (this.getIOSVersion() == this.cvsString)
   	{
       		this.IOS.version = "09.00.00.00";
       		this.setIOSVersionString(this.IOS.version);
   	}
   	else
   	{
		if (this.getIOSVersion() == null)
			this.IOS.version = dVersion;
		if (this.getIOSVersionNumber() == null)
			this.setIOSVersionString(this.IOS.version);
	}
}

IOSHandler.prototype.getProfileVersion = function(whatDom)
{
	var setVersion = false;
	var classes = whatDom.getElementsByTagName("CLASS");
	
	for (var j=0; j<classes.length; j++)
	{
		if (classes[j].getAttribute("name").indexOf("Profile") != -1)
		{
			var laver2 = classes[j].getElementsByTagName("LAVERSION");
			if (laver2.length > 0)
			{
				// check for error node...
				var errors = laver2[0].getElementsByTagName("ERROR");
				if (errors.length == 0)
				{	
					for (var n=0; n<laver2[0].childNodes.length; n++)
					{
						if (laver2[0].childNodes[n].nodeType == 4)
						{
							this.setIOSVersionString(laver2[0].childNodes[n].nodeValue);
							setVersion = true;
							break;
						}
					}
				}
			}
		}
	}
	
	return setVersion;
}
//-- end IOSHandler object code
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
//-- start app version object code
function AppVersionObject(productLine, systemCode, alertErrors)
{
	productLine = (!productLine) ? "" : productLine.toUpperCase();
	systemCode = (!systemCode) ? "" : systemCode.toUpperCase();

	// only allow 1 instance of this object per product line
	if (AppVersionObject._singleton && AppVersionObject._singleton[productLine])
		return AppVersionObject._singleton[productLine];
	else
	{
		if (!AppVersionObject._singleton)
			AppVersionObject._singleton = new Array();
		AppVersionObject._singleton[productLine] = this;
	}

	// make sure the iosHandler is set up
	if (iosHandler.getIOS() == null)
		iosHandler.createIOS();

	// public
	this.productLine = productLine;
	this.systemCode = systemCode;
	this.alertErrors = (typeof(alertErrors) == "boolean") ? alertErrors : true;
	this.longAppVersion = null;
	this.appVersion = null;
	this.errorMessage = null;

	// private, do not reference directly
	this.dmeUrl_802_803 = "/cgi-lawson/dme.exe?OUT=XML&";
	this.dmeUrl_8033 = "/servlet/dme?OUT=XML&";
	this.dmeUrl_810 = "/servlet/Router/Data/Erp?";
	this.appUrl = "PROD=GEN&FILE=SYSTEM&FIELD=releaseinfo,prodline&KEY=";
	this.projUrl = "PROD=GEN&FILE=PROJECT&INDEX=PRJSET2&FIELD=productline&KEY=";
}
AppVersionObject.prototype._singleton = null;
//-----------------------------------------------------------------------------
AppVersionObject.prototype.getAppVersion = function()
{
	// don't run the call if no product line was passed in
	if (this.appVersion == null && this.productLine)
	{
		this.getAppVersionData();
	}

	return this.appVersion;
}
//-----------------------------------------------------------------------------
AppVersionObject.prototype.getLongAppVersion = function()
{
	// don't run the call if no product line was passed in
	if (this.longAppVersion == null && this.productLine)
	{
		this.getAppVersionData();
	}

	return this.longAppVersion;
}
//-----------------------------------------------------------------------------
AppVersionObject.prototype.getAppVersionData = function()
{
	var urlToCall = "";
	try
	{
		var iosVersion = iosHandler.getIOSVersionNumber();
		
		// Check to see if the user's prodline is actually a project - if it is we need to use the associated
		// productline when looking up the systemCode's application version.
		if (iosVersion >= "08.00.03.03" && iosVersion < "08.01.00")
			urlToCall = this.dmeUrl_8033 + this.projUrl + this.productLine;
		else if (iosVersion >= "08.01.00")
		{
			if (iosHandler.isSSOFileLoaded())
			{
				var ssoWnd = findSSORequest();
				if (ssoWnd)
					SEARequest = ssoWnd.SSORequest;
			}
			urlToCall = this.dmeUrl_810 + this.projUrl + this.productLine;			
		}
		else
			urlToCall = this.dmeUrl_802_803 + this.projUrl + this.productLine;
	
		var projDom = SEARequest(urlToCall);
		var projProdLine = "";
		var lookUpProdLine = this.productLine; 
		if (projDom)
		{
			var projColNodes = projDom.getElementsByTagName("COL");
			if (projColNodes.length > 0)
			{
				projProdLine = cmnGetElementText(projColNodes[0]);
				lookUpProdLine = projProdLine;
			}
		}
			
		if (iosVersion >= "08.00.03.03" && iosVersion < "08.01.00")
			urlToCall = this.dmeUrl_8033 + this.appUrl + lookUpProdLine + "=" + this.systemCode;
		else if (iosVersion >= "08.01.00")
			urlToCall = this.dmeUrl_810 + this.appUrl + lookUpProdLine + "=" + this.systemCode;			
		else
			urlToCall = this.dmeUrl_802_803 + this.appUrl + lookUpProdLine + "=" + this.systemCode;
	}
	catch (e)
	{
		return null;
	}

	var dataDom = SEARequest(urlToCall);
	if (!dataDom)
		return;
	var msgNodes = dataDom.getElementsByTagName("MESSAGE");
	var colNodes = dataDom.getElementsByTagName("COL");
	var releaseNbr = "";
	var releaseTkns;
	if (colNodes.length > 0)
	{
		// releaseNbr should be of the form: "Release x.x.x" or "Release x.x.x MSP#xx"
		releaseNbr = cmnTrimString(cmnGetElementText(colNodes[0]));
		releaseTkns = releaseNbr.split(" ");
		if (releaseTkns.length >= 2)
		{
			var releaseStr = releaseTkns[1];
			// make sure we have 3 release digits
			var appParams = releaseStr.split(".");
			var nbrParams = appParams.length;
			if (nbrParams < 3)
			{
				for (var j=nbrParams; j<3; j++)
					appParams[j] = "0";
			}
			releaseStr = appParams.join(".");
			this.appVersion = releaseStr;
			this.longAppVersion = releaseStr;
			// add the MSP level, if it exists
			if (releaseTkns.length >= 3 && releaseTkns[2].indexOf("MSP#") != -1)
				this.longAppVersion += releaseTkns[2].replace("MSP#",".");
			else
				this.longAppVersion += ".00";	
			var appDigits = this.longAppVersion.split(".");
			var len;
			for (var i=0; i<appDigits.length; i++)
			{
				len = appDigits[i].length; 
				if (len < 2)
				{
					for (var j=len; j<2; j++)
					{
						appDigits[i] = "0" + appDigits[i];
					}	
				}	
			}
			len = appDigits.length - 1;
			this.longAppVersion = appDigits.join(".");
			this.appVersion = appDigits.slice(0, len).join(".");
		}
		// else this.appVersion will still be null - not a valid productline
	}
	else if (msgNodes.length > 0)
	{
		// some error occurred
		this.errorMessage = cmnGetElementText(msgNodes[0]);
		if (this.alertErrors)
			alert('Error getting application version:\n\n' + this.errorMessage);
	}
}
//-- end app version object code
//-----------------------------------------------------------------------------

