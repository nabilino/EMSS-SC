/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/transaction.js,v 1.39.2.5.2.4 2014/02/18 16:42:32 brentd Exp $ */
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

var agsFileInstance = findAGS();
var agsHandler = new AGSHandler();
var agsTkn = "";

//-----------------------------------------------------------------------------
function findAGS(searchOpener, ref)
{
	if (!ref)
		ref = self;

	try
	{
		// is there a parent ?
		if (ref != ref.parent)
		{
			// does the parent have an agsFileInstance variable ?
			if (typeof(ref.parent.agsFileInstance) != "undefined")
			{
				// found a copy...
				if (ref.parent.agsFileInstance != null)
					return ref.parent.agsFileInstance;
				else
					return ref.parent;
			}
			else
			{
				// didn't find it... try higher
				return findAGS(searchOpener, ref.parent);
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
			// does the opener have an agsFileInstance variable ?
			if (typeof(ref.opener.agsFileInstance) != "undefined")
			{
				// found a copy...
				if (ref.opener.agsFileInstance != null)
					return ref.opener.agsFileInstance;
				else
					return ref.opener;
			}
			else
			{
				// didn't find it... try higher on the opener
				return findAGS(searchOpener, ref.opener);
			}
		}
	}
	catch (e)
	{}

	try
	{
		// does the current window have an agsFileInstance variable ?
		if (typeof(agsFileInstance) != "undefined")
		{
			// found a copy...
			if (agsFileInstance != null)
				return agsFileInstance;
			else
				return self;
		}
	}
	catch (e)
	{}

	return null;
}

//-----------------------------------------------------------------------------
//-- start AGSHandler object code
function AGSHandler()
{	
	// only allow 1 instance of this object
	if (AGSHandler._singleton)
		return AGSHandler._singleton;
	else
	{
		// try to get objects from 1 instance of this file
		AGSHandler._singleton = this;
		try {
			if (agsFileInstance && agsFileInstance.AGSHandler && agsFileInstance.AGSHandler._singleton)
			{
				// copy over parameters...
				this.ags = agsFileInstance.AGSHandler._singleton.ags;
				this.xsl = agsFileInstance.AGSHandler._singleton.xsl;
			}
			else
			{
				this.ags = null;	// ags XML reference
				this.xsl = null;	// ags XSL reference
			}
		} catch(e) {
				this.ags = null;	// ags XML reference
				this.xsl = null;	// ags XSL reference		
		}
	}

	this.ssoFileAppended = false;
	this.ssoFileUrl = "/sso/sso.js";
	this.commonHTTPUrl = "/lawson/webappjs/commonHTTP.js";
	this.commonHTTPAppended = false;
	this.agsUrl_802 = "/cgi-lawson/ags.exe";
	this.agsUrl_803 = "/servlet/ags";
	this.agsUrl_810 = "/servlet/Router/Transaction/Erp";
	this.agsXsl_javascript = location.protocol + "//" + location.host + "/lawson/webappjs/transactionTOjavascript.xsl";
	this.agsXsl_js = location.protocol + "//" + location.host + "/lawson/webappjs/transactionTOjs.xsl";	
}
AGSHandler.prototype._singleton = null;
//-----------------------------------------------------------------------------
AGSHandler.prototype.getProgName = function()
{
	if (!this.isCommonHTTPLoaded())
	{
		this.loadCommonHTTP();
		setTimeout("agsHandler.getProgName()", 5);
		return;
	}

	// what version of IOS do I call?	
	if (iosHandler.getIOS() == null && !iosHandler.calledWhat)		
		iosHandler.createIOS();
		
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
		setTimeout("agsHandler.getProgName()", 5);
		return;
	}
	
	try {
		var iosVersion = iosHandler.getIOSVersionNumber();			
		if (iosVersion >= "08.00.03" && iosVersion < "08.01.00") 
			return this.agsUrl_803;
		else if (iosVersion >= "08.01.00")
			return this.agsUrl_810;
		else	
			return this.agsUrl_802;
	} 
	catch(e) 
	{
		return this.agsUrl_802;
	}

	return this.agsUrl_802;
}
//-----------------------------------------------------------------------------
AGSHandler.prototype.getXSL = function(outType)
{
	if (!this.isCommonHTTPLoaded())
	{
		this.loadCommonHTTP();
		setTimeout("agsHandler.getXSL()", 5);
		return;
	}

	// what version of IOS do I call?	
	if (iosHandler.getIOS() == null && !iosHandler.calledWhat)		
		iosHandler.createIOS();
		
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
		setTimeout("agsHandler.getXSL()", 5);
		return;
	}
	
	try {
		if (iosHandler.getIOSVersionNumber() >= "08.01.00") 
		{
			if (outType && outType.toString().toUpperCase() == "JS")
				this.xsl = this.agsXsl_js;
			else 	
				this.xsl = this.agsXsl_javascript; 
		}	
	} 
	catch(e) 
	{
		this.xsl = null;
	}

	return this.xsl;
}
//-----------------------------------------------------------------------------
AGSHandler.prototype.isCommonHTTPLoaded = function()
{
	if (typeof(SEARequest) == "function")
	{
		this.commonHTTPAppended = true;	
		return true;
	}	
	return false;
}
//-----------------------------------------------------------------------------
AGSHandler.prototype.isSSOFileLoaded = function()
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
AGSHandler.prototype.loadCommonHTTP = function()
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
//-----------------------------------------------------------------------------
AGSHandler.prototype.loadSSOFile = function()
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
//-- end AGSHandler object code
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// BELOW IS THE OLD ORIGINAL STUFF FROM AGS.JS
// (with the exception of the new AGS methods)
//-----------------------------------------------------------------------------

var gProtocol = location.protocol;
var gHost = location.host;

function callAGS(string, frameStr, doPost, debugFl)
{	
	if (debugFl)
		alert("DEBUG: Calling callAGS(" + string + "," + frameStr + ")");

	var fr = eval("window." + frameStr);

	if (doPost)
	{
		var isIE = (navigator.userAgent.indexOf("MSIE") >= 0) ? true : false;
		if (isIE)
		{
			// IE changes the document's charset to unicode on a 
			// document.write.  Force the document's charset to iso-8859-1.
			var form = '<HTML lang="en"><HEAD><meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"></HEAD>'
						+ '<BODY>'
						+ '<FORM METHOD=POST ENCTYPE="application/x-www-form-urlencoded">'
						+ '<INPUT TYPE=SUBMIT NAME="callAgs" VALUE="Do AGS Calls">'
						+ '</FORM>'
						+ '</BODY>'
						+ '</HTML>';
						
			fr.document.write(form);
			fr.document.close();
			fr.document.charset = 'iso-8859-1';
						
			fr.document.write(unescape(string));
			fr.document.close();			
			fr.document.charset = 'iso-8859-1';			
		}
		else
		{
			fr.document.write(unescape(string));
			fr.document.close();
		}
	}
	else {
		fr.location.replace(string);	
	}
}

function AGSObject(prodLine, tokenName)
{		
	if (typeof(agsHandler) == "undefined")
		agsHandler = new AGSHandler();

	this.protocol  = gProtocol;
	this.host      = gHost;	
	this.progName  = agsHandler.agsUrl_802;	
	this.prod      = prodLine;
	this.token     = tokenName;
	this.callmethod= 'automated'; //** valid values 'automated','post','get'
	this.event     = 'ADD';
	this.rtn       = 'DATA';
	this.longNames = true;
	this.lfn       = null;
	this.tds       = false;
	this.func      = null;
	this.field     = null;
	this.dtlField  = null;		// names of detail area fields passed to AGS	
    this.enm       = null;
    this.unm       = null;
    this.fmt       = null;
    this.pfc       = null;
    this.flb       = false;
    this.out       = 'JAVASCRIPT'
    this.ufd       = false;
    this.vfmt      = false;
    this.msgtarget = null;
	this.initdtl   = false;
	this.debug     = false;	
	this.xsl       = null;
	this.xmlOnly = false;
	this.noLineFC = false;   // SEA form with details but no Line FC
	this.preInquire = false; // force AGS to preinquire before doing an Add function code
	this.encoding = null;
}

function AGS(object, frameStr)
{			
	if (!agsHandler.isCommonHTTPLoaded())
	{
		agsHandler.loadCommonHTTP();
		var thisObj = object;
		var thisFrame = frameStr;
		setTimeout(function(){ AGS(thisObj, frameStr); }, 5);	
		return;
	}

	iosFileInstance = findIOS();
	iosHandler = (iosFileInstance && iosFileInstance.iosHandler) ? iosFileInstance.iosHandler : new IOSHandler();
	iosHandler.setEscapeFunc();

	// what version of IOS do I call?
	if (iosHandler.getIOS() == null && !iosHandler.calledWhat)
	{
		iosHandler.createIOS();
	}

	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
		var thisObj = object;
		var thisFrame = frameStr;
		setTimeout(function(){ AGS(thisObj, frameStr); }, 5);
		return;		
	}

	//object.xsl = agsHandler.getXSL(object.out);
	object.progName = agsHandler.getProgName();
	object.encoding = iosHandler.getEncoding();

	var urlStr   = object.protocol + "//" + object.host;
	var urlSep   = "&";
	var parmsStr = "";
	var editParm = "";
	var postForm = "";
	var doPost = false;
	var is810 = (iosHandler.getIOSVersionNumber() >= "08.01.00") ? true : false;

	if (object.callmethod == 'post')
		doPost = true;
	else if (object.callmethod == 'get')
		doPost = false;
	else if (object.field.length > 750)
		doPost = true;

    urlStr += object.progName;

	if (!is810 && doPost)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_EVT" VALUE="'
	else
		parmsStr += "_EVT="
    
	editParm = object.event.toUpperCase()
	if (editParm == "ADD" || editParm == "CHANGE" || editParm == "CHG")
	{
		if (editParm == "CHANGE")
			editParm = "CHG"
		parmsStr += editParm
		if (!is810 && doPost)
			parmsStr += '"><BR>'
	}
	else
		alert("Invalid EVENT Value '" + object.event + "'")

	if (!is810 && doPost)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_RTN" VALUE="'
	else
		parmsStr += urlSep + "_RTN="
    	
    editParm = object.rtn.toUpperCase()
    
    if (editParm == "DATA" || editParm == "MESSAGE")
    {
		if (editParm == "MESSAGE")
			editParm = "MSG"
		parmsStr += editParm
		if (!is810 && doPost)
			parmsStr += '"><BR>'
	}
	else
		alert("Invalid RETURN Value '" + object.rtn + "'")

	if (!object.tds)
	{
		if (!is810 && doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_TDS" VALUE="Ignore"><BR>'
		else
 			parmsStr += urlSep + "_TDS=Ignore";
	}

	if (!is810 && doPost)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_PDL" VALUE="' + object.prod + '"><BR>'
	else
		parmsStr += urlSep + "_PDL=" + object.prod

	if (!is810 && doPost)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_TKN" VALUE="' + object.token + '"><BR>'
	else
	    parmsStr += urlSep + "_TKN=" + object.token

	if ((object.longNames || object.lfn != null) &&  object.rtn.toUpperCase() == 'DATA')
	{
		if (object.lfn == null)
			object.lfn = 'TRUE';

		if (!is810 && doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_LFN" VALUE="' + object.lfn + '"><BR>'
		else
			parmsStr += urlSep + "_LFN=" + object.lfn;
	}

	if (!is810) 
	{
		if (doPost)
		{
			var tmp = unescape(object.func)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_ONLOAD" VALUE="' + unescape(chgString(escape(unescape(object.func)))) + '"><BR>'
		}
		else
			parmsStr += urlSep + "_ONLOAD=" + object.func
	}
	
	parmsStr += getAgsTransactionFields(object,is810,doPost,urlSep)
	if (object.enm != null && object.enm.length > 0)
	{
		if (!is810 && doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_ENM" VALUE="' + object.enm + '"><BR>'
		else
			parmsStr += urlSep + "_ENM=" + object.enm
	}
	if (object.unm != null && object.unm.length > 0)
	{
		if (!is810 && doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_UNM" VALUE="' + object.unm + '"><BR>'
		else
			parmsStr += urlSep + "_UNM=" + object.unm
	}
	if (object.fmt != null && object.fmt.length > 0)
	{
		if (object.fmt == "form"
		||  object.fmt == "win")
		{
			if (!is810 && doPost)
				parmsStr += '<INPUT TYPE=HIDDEN NAME="_FMT" VALUE="' + object.fmt + '"><BR>'
			else
				parmsStr += urlSep + "_FMT=" + object.fmt
		}
		else
			alert("Invalid FORMAT Value '" + object.fmt + "'\nValid Values are 'form' and 'win'")
	}

	if (object.pfc != null && object.pfc.length > 0)
	{
		if (!is810 && doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_PFC" VALUE="' + object.pfc + '"><BR>'
		else
			parmsStr += urlSep + "_PFC=" + object.pfc
	}

	if (object.flb)
	{
		if (!is810 && doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_FLB" VALUE="TRUE"><BR>'
		else
			parmsStr += urlSep + "_FLB=TRUE"
	}

	if (object.out != null && object.out.length > 0)
	{
		if (!is810 && !object.xmlOnly) 
		{
  			if (object.out == "TEXT" || object.out == "JAVASCRIPT" || object.out == "JS")
			{
				if (doPost)
					parmsStr += '<INPUT TYPE=HIDDEN NAME="_OUT" VALUE="' + object.out + '"><BR>'
				else
					parmsStr += urlSep + "_OUT=" + object.out
			}
			else
				alert("Invalid OUT Value '" + object.out + "'\nValid Values are 'TEXT' and 'JAVASCRIPT'")
		}
		else
		{
			parmsStr += urlSep + "_OUT=XML"			
		}
	}

	if (object.ufd)
	{
		if (!is810 && doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_UFD" VALUE="TRUE"><BR>'
		else
			parmsStr += urlSep + "_UFD=TRUE"
	}

	if (object.vfmt)
	{
		if (!is810 && doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_VFMT" VALUE="TRUE"><BR>'
		else
			parmsStr += urlSep + "_VFMT=TRUE"
	}

	if (object.msgtarget != null && object.msgtarget.length > 0)
	{
		if (!is810 && doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_MSGTARGET" VALUE="' + object.msgtarget + '"><BR>'
		else
			parmsStr += urlSep + "_MSGTARGET=" + object.msgtarget
	}

	if (object.initdtl)
	{
		if (!is810 && doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_INITDTL" VALUE="TRUE"><BR>'
		else
			parmsStr += urlSep + "_INITDTL=TRUE"
	}

	if (!is810 && doPost)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_EOT" VALUE="TRUE"><BR>'
	else
		parmsStr += urlSep + "_EOT=TRUE"

	if (is810)
	{
		parmsStr += urlSep + "_DTLROWS=FALSE";
		if (object.preInquire)
			parmsStr += urlSep + "_INQADD=TRUE";
	}

	if (!is810 && doPost)
	{
		postForm = '<BODY onLoad="javascript:document.myAGSForm.submit();return false">'
                 + '<FORM ACTION=' + urlStr + ' TARGET=' + frameStr + ' METHOD=POST name=myAGSForm>'
				 + parmsStr
				 + '<INPUT TYPE=SUBMIT NAME="callAgs" VALUE="Do AGS Calls">'
                 + '</FORM>'
                 + '</BODY>'
		urlStr = postForm
	}
	else
		urlStr += "?" + parmsStr
		
	if (is810)
	{
		if (!agsHandler.isSSOFileLoaded())
		{
			agsHandler.loadSSOFile();
			var thisObj = object;
			var thisFrame = frameStr;			
			setTimeout(function(){ AGS(thisObj, frameStr); }, 5);
			return;
		}
	
		if (object.debug)
			alert("DEBUG: " + urlStr);
               
		var xmlData;
		var cntType = (object.encoding) ? "text/xml; charset=" + object.encoding : null;
	
		if (doPost)
			xmlData = SSORequest(object.progName, buildAgsXml(urlStr, object.encoding));
		else
			xmlData = SSORequest(urlStr, null, cntType);
		
		if (object.xmlOnly)
		{		
			var fn = unescape(object.func);				
			fn = appendXmlDataParam(fn, "xmlData");	
			eval(fn);
			return;
		}
		
		var fldNbr = "";
		var msgNbr = "";
		var msg = "";
		var rootNode = xmlData.documentElement;
		var parNode = (rootNode.hasChildNodes() && rootNode.childNodes[0].nodeType != 3) ? rootNode.childNodes[0] : rootNode;
		var dataobj;
		// don't do this, as it wipes out the location object
		//eval("window." + frameStr + " = new Object()");
		eval("dataobj = window." + frameStr);

		if (object.out == "JS")
		{
			// Initialize return data objects
			dataobj.NbrRecs = 0;
			dataobj.field = new Array();
			dataobj.RtnMsgField = "";
			dataobj.RtnMsgErrNbr = "";
			dataobj.RtnMsg = "";
			dataobj.CrtRequest = "";
			dataobj.CrtScreen = "";
			dataobj.CrtPassXlt = "";
			dataobj.CrtDspXlt = "";        	    	
		
			var fldVal;
			var tmpNode;
			var re = /(r)(\d+)/;			
		
			for (var x=0; x<parNode.childNodes.length; x++) 
			{
				tmpNode = parNode.childNodes[x];
				fld = tmpNode.nodeName;
				if (tmpNode.hasChildNodes())
					fldVal = tmpNode.childNodes[0].nodeValue;
				else
					fldVal = "";
				if (fld == "FldNbr")
					dataobj.RtnMsgField = fldVal;
				else if (fld == "MsgNbr")
					dataobj.RtnMsgErrNbr = fldVal;
				else if (fld == "Message")
					dataobj.RtnMsg = fldVal;
				else
				{
					var digit = fld.search(re);
					if (digit != -1)
						dataobj.field[fld] = new fieldV(fld.substring(0,digit)+(Number(fld.substring(digit+1))+1),fldVal);
					else
						dataobj.field[fld] = new fieldV(fld.replace(re,"$2"),fldVal);
				}
			}
			
			dataobj.NbrRecs = dataobj.field.length;
		}
		else // object.out == "JAVASCRIPT"
		{
			with (window.lawheader)
			{
				var fldVal;
				var tmpNode;
				var re = /(r)(\d+)$/;
				var re2 = /(r)(\d+)(\D+)/;
				var re3 = /(\D+)/;
			
				for (var x=0; x<parNode.childNodes.length; x++) 
				{
					tmpNode = parNode.childNodes[x];
					fld = tmpNode.nodeName;
					if (tmpNode.hasChildNodes())
						fldVal = tmpNode.childNodes[0].nodeValue;
					else
						fldVal = "";
					if (fld == "FldNbr")
						fldNbr = fldVal;
					else if (fld == "MsgNbr")
						msgNbr = fldVal;
					else if (fld == "Message")
						msg = fldVal;
					else if (object.rtn != null && object.rtn.toUpperCase() == "DATA")
					{
						// Handle detail row field data
						// Replace occurrences of "r" followed by a number with the value of the number + 1
						var digit = fld.search(re);
						var digit2 = fld.search(re2);
						// Does the field end in "r" followed by a number?
						// Example: "EMPLOYEEr0" is replaced with "EMPLOYEE1"
						if (digit != -1)
						{
							V(fld.substring(0,digit)+(Number(fld.substring(digit+1))+1),fldVal);
						}
						// Does the field contain "r" followed by a number embedded within the field?
						// Example: "EMP-STATUSr0-XLT" is replaced with "EMP-STATUS1-XLT"
						else if (digit2 != -1)
						{
							var tmpFld = fld.substring(digit2+1);
							var character = tmpFld.search(re3); 
							V(fld.substring(0,digit2)+(Number(fld.substring(digit2+1,digit2+1+character))+1)+fld.substring(digit2+1+character),fldVal);
						}
						// Otherwise use the field as it was returned by the Transaction servlet.
						else
						{
							V(fld,fldVal);
						}
					}
				}
				
				DataReturned(fldNbr,msgNbr,msg);
			}		
		}	

		with (dataobj)
		{
			var fn = unescape(object.func);	
			setTimeout(fn, 0);
		}
	}	
	else if (object.xmlOnly)
	{		
		if (object.debug)
			alert("DEBUG: " + urlStr);
                    
		var xmlData;
		var cntType = (object.encoding) ? "text/xml; charset=" + object.encoding : null;		
		
		if (doPost)
			xmlData = SEARequest(object.progName, buildAgsXml(urlStr, object.encoding));
		else
			xmlData = SEARequest(urlStr, null, cntType);
					
		var fn = unescape(object.func);	
		fn = appendXmlDataParam(fn, "xmlData");
		eval(fn);			
	}
	else
		callAGS(urlStr, frameStr, doPost, object.debug);	
}

function getAgsTransactionFields(object, is810, doPost, urlSep)
{
	var parmsStr = "";

	// pre-810 AGS field logic
	if (!is810 && !object.xmlOnly)
	{
		if (doPost)
		{
			var tmpFields = object.field.split("&")
			var equalSign = 0
			var fieldLgth = 0
			var tmpValue  = ''

			for (var fCntr=0; fCntr<tmpFields.length; fCntr++)
			{
				fieldLgth = tmpFields[fCntr].length
				equalSign = tmpFields[fCntr].indexOf("=")
				tmpValue  = unescape(tmpFields[fCntr].substring((equalSign+1),fieldLgth))
				tmpValue  = unescape(chgString(iosHandler.escapeStr(tmpValue)))
				parmsStr += '<INPUT TYPE=HIDDEN NAME="' + tmpFields[fCntr].substring(0,equalSign) + '"'
						 +  ' VALUE="' + tmpValue + '"><BR>'
			}
		}
		else
			parmsStr += urlSep + object.field	
	}
	// 810 AGS field logic - assume every detail field has a single digit detail row number
	else if (object.dtlField == null)
	{
		var tmpFields = object.field.split("&")
		var dtlForm = (object.field.toUpperCase().indexOf("LINE-FC") != -1 || object.noLineFC)? true : false;
		var equalSign = 0
		var fieldLgth = 0
		var tmpFldNm  = ''
		var tmpValue  = ''
		var tmpRowNbr = 0
		var re = /r[\d]+/;	
		
		for (var fCntr=0; fCntr<tmpFields.length; fCntr++)
		{
			fieldLgth = tmpFields[fCntr].length
			equalSign = tmpFields[fCntr].indexOf("=")
			tmpValue  = unescape(tmpFields[fCntr].substring((equalSign+1),fieldLgth))
			tmpFldNm = tmpFields[fCntr].substring(0,equalSign)
			var digitIndex = tmpFldNm.length;
			var done = false;
			var tmpRowNbr = "";

			while ((digitIndex >= 0) && (!done)) {
				digitIndex--;
				if (isNaN(parseInt(tmpFldNm.charAt(digitIndex)))) {
					done = true;
				}	
			}
			digitIndex++;

			if ((digitIndex < tmpFldNm.length) && (tmpFldNm.charAt(digitIndex - 1) != "r")) {
				tmpRowNbr = tmpFldNm.substring(digitIndex, tmpFldNm.length);
			}
			
			if (dtlForm && !isNaN(parseInt(tmpRowNbr,10)) && tmpFldNm.search(re) == -1)
			{
				if(is810)
				{
					tmpRowNbr = (Number(tmpRowNbr) -1)
				}
				tmpFldNm = tmpFldNm.substring(0, digitIndex) + "r" + Number(tmpRowNbr);
			}
			
			//do not escape posts, except for query delimiters so parameters get parsed properly
			if (doPost && (is810 || object.xmlOnly))
			{
	            tmpValue = tmpValue.replace(/\&/g,escape("&"));
	            tmpValue = tmpValue.replace(/\=/g,escape("="));
	            tmpValue = tmpValue.replace(/\?/g,escape("?"));
			}
			else
			{
				tmpValue = iosHandler.escapeStr(tmpValue,1);
	            tmpValue = tmpValue.replace(/\+/g,"%2B");			
			}
			parmsStr += urlSep + tmpFldNm + "=" + tmpValue;
		}
	}
	// 810 AGS field logic - insert the detail field row numbers according to detail fields specified
	else 
	{
		var tmpDtlFields = object.dtlField.split(";")
		var tmpFields = object.field.split("&")
		var equalSign = 0
		var fieldLgth = 0
		var tmpFldNm  = ''
		var tmpFldNmUpper = ''
		var tmpValue  = ''		
		var tmpDtlFldNm = ''	
		var tmpDtlFldNmUpper = ''
		var tmpRowNbr = 0
		var re = /r[\d]+/;
		
		for (var fCntr=0; fCntr<tmpFields.length; fCntr++)
		{
			fieldLgth = tmpFields[fCntr].length
			equalSign = tmpFields[fCntr].indexOf("=")
			tmpValue  = unescape(tmpFields[fCntr].substring((equalSign+1),fieldLgth))
			tmpFldNm = tmpFields[fCntr].substring(0,equalSign)
			tmpFldNmUpper = tmpFldNm.toUpperCase()
			tmpRowNbr = tmpFldNm.charAt(tmpFldNm.length-1) // if no match, assume row number is last char of field
			
			for (var fCntr2=0; fCntr2<tmpDtlFields.length; fCntr2++)
			{
				tmpDtlFldNm = tmpDtlFields[fCntr2]
				tmpDtlFldNmUpper = tmpDtlFldNm.toUpperCase()
				
				if (tmpFldNmUpper.indexOf(tmpDtlFldNmUpper) != -1 && tmpFldNmUpper != tmpDtlFldNmUpper)
				{
					tmpRowNbr = tmpFldNm.substring(tmpDtlFldNm.length)
					if (!isNaN(parseInt(tmpRowNbr,10)) && tmpFldNm.search(re) == -1)
					{
						if(is810)
						{
							tmpRowNbr = (Number(tmpRowNbr) -1)
						}
						tmpFldNm = tmpFldNm.substring(0,tmpDtlFldNm.length) + "r" + Number(tmpRowNbr) 	
					}
					break;
				}
			}
			
			if (!is810 && doPost)
			{
				parmsStr += '<INPUT TYPE=HIDDEN NAME="' + tmpFldNm + '"'
					 +  ' VALUE="' + unescape(chgString(iosHandler.escapeStr(tmpValue))) + '"><BR>'
			}
			else
			{
				//do not escape posts, except for query delimiters so parameters get parsed properly
				if (doPost && (is810 || object.xmlOnly))
				{
					tmpValue = tmpValue.replace(/\&/g,escape("&"));
					tmpValue = tmpValue.replace(/\=/g,escape("="));
					tmpValue = tmpValue.replace(/\?/g,escape("?"));
				}
				else
				{			
					tmpValue = iosHandler.escapeStr(tmpValue,1);
	                tmpValue = tmpValue.replace(/\+/g,"%2B");
                }			
				parmsStr += urlSep + tmpFldNm + "=" + tmpValue;
			}			
		}
	}
	
	return parmsStr;
}

function chgString(passedStr)
{
    var myStr = repStrs(passedStr,'%22','&quot;');
    myStr = repStrs(myStr,'%26','&amp;');
    myStr = repStrs(myStr,'%3E','&gt;');
    myStr = repStrs(myStr,'%3C','&lt;');
    return myStr;
}

function chgPostString(passedStr)
{
    var myStr = passedStr.replace(/\&/g, "&amp;");
    myStr = myStr.replace(/\>/g, "&gt;");
    myStr = myStr.replace(/\</g, "&lt;");
    return myStr;
}

function getFront(mainStr, srchStr)
{
	fndOffset = mainStr.indexOf(srchStr);
	if (fndOffset == -1)
		return null;
	else
		return mainStr.substring(0, fndOffset);
}

function getEnd(mainStr, srchStr)
{
	fndOffset = mainStr.indexOf(srchStr);
	if (fndOffset == -1)
		return null;
	else
		return mainStr.substring(fndOffset+srchStr.length, mainStr.length);
}

function repStrs(inStr, fromStr, toStr)
{
	var resultStr = "" + inStr;
	if (resultStr == "")
		return "";
	var front = getFront(resultStr, fromStr);
	var end = getEnd(resultStr, fromStr);
	while (front != null && end != null)
	{
		resultStr = front + toStr + end;
		var front = getFront(resultStr, fromStr);
		var end = getEnd(resultStr, fromStr);
	}
	return resultStr;
}

function buildAgsXml(string, encoding)
{
    var dataArray = new Array();
	var xmlString = '<?xml version="1.0" encoding="' + ((encoding) ? encoding : 'ISO-8859-1') + '"?>';
	var str = string.split("?")[1].split("&");
	
	for (var i=0; i<str.length; i++)
	{
		var str1 = str[i].split("=");
		if (str1[0] == "_TKN")
		{
			agsTkn = str1[1];
			xmlString += '<X' + agsTkn + '><' + agsTkn + '>';
			break;
		}
	}
	
	for (var i=0; i<str.length; i++)
	{
		var str1 = str[i].split("=");
		if (str[i].charAt(0) == "_")
		{
			xmlString += '<' + str1[0] + '>';
			if (str1.length == 2)
				xmlString += unescape(str1[1]);
			xmlString += '</' + str1[0] + '>';
		}
		else
		{
			if (str1.length == 2)
			{
				var j = dataArray.length;
				dataArray[j] = '<' + str1[0] + '>'
				if (unescape(str1[1]) != " ")
					dataArray[j] += chgPostString(unescape(str1[1]));    	    			
				dataArray[j] += '</' + str1[0] + '>';
  			}
		}
	}

	xmlString += dataArray.join('');
	xmlString += '</' + agsTkn + '></X' + agsTkn + '>';
	return xmlString;
}

function fieldV(Name, Value)
{
	this.name = Name;
	this.value = Value;
}

// Parse the AGS function string and append the xmlData object to the list of parameters
function appendXmlDataParam(fn, xmlDataStr)
{
	var paren1 = fn.indexOf("(");
	var paren2 = fn.indexOf(")");
	var fnBegin = fn.substring(0, paren1 + 1);
	var fnParams = fn.substring(paren1 + 1, paren2);
	var fnEnd = fn.substring(paren2);

	// strip off the first parent reference, since we are not calling the function in a frame
	var parRef = fnBegin.indexOf("parent.");
	if (parRef >= 0)
		fnBegin = fnBegin.substring(parRef + 7);

	if ((fnParams.indexOf(",") != -1) || (emptyStr(fnParams) == false))
		fnParams += "," + xmlDataStr;
	else
		fnParams = xmlDataStr;
	fn = fnBegin + fnParams + fnEnd;
	return fn;
}

function emptyStr(str) 
{
	for (var i=0; i<str.length; i++) {
		if (str.charAt(i) != " ")
			return false;
	}
	return true;
}
