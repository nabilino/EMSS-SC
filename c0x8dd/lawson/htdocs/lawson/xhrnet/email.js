// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/Attic/email.js,v 1.1.2.11 2014/02/17 16:30:21 brentd Exp $
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
var gProtocol = location.protocol;
var gHost = location.host;
var emailObjInstance = null;

function callEMAIL(string, frameStr, doPost)
{
	if (doPost)
	{
		eval("window." + frameStr + ".document.write(\'" + string + "\')");
		eval("window." + frameStr + ".document.close()");
	}
	else
	    eval("window." + frameStr + ".location.replace(\"" + string + "\")");   
}

function EMAILObject(whoto,whofrom)
{
	this.protocol = gProtocol;
	this.hostname = gHost;
 	this.progName = "/cgi-lawson/email";
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		this.progName += CGIExt
	else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				this.progName += opener.CGIExt				
	this.whoto = whoto;
	this.whofrom = whofrom;
	this.subject = null;
	this.message = null;
	this.EMAILBuild = EMAILBuild;
	this.doPost = false;
	this.mailTo = false;
	try
	{
		this.encoding = iosHandler.getEncoding();
		this.escapeFunc = iosHandler.escapeStr;
		this.unescapeFunc = window.unescape;
	}
	catch(e) 
	{
		this.encoding = null;
		this.escapeFunc = window.escape;
		this.unescapeFunc = window.unescape;
	}
}

var targetConversionFrame = "";
function convert()
{
	var unescapeFunc = (emailObjInstance) ? emailObjInstance.unescapeFunc : window.unescape;
	var subject = eval("self."+targetConversionFrame+".document.getElementById('subject')");
	subject.value = unescapeFunc(subject.value);
	var message = eval("self."+targetConversionFrame+".document.getElementById('message')");
	message.value = unescapeFunc(message.value);
	targetConversionFrame = "";
}

function insertCarriageReturns(object, str)
{
	var retStr = str;
	if (retStr && (object.mailTo || !object.encoding))
	{
		retStr = object.escapeFunc(retStr);
		// if there are line feeds with no carriage returns, insert a carriage return before each line feed
		if (retStr.indexOf("%0A") != -1 && retStr.indexOf("%0D%0A") == -1)
			retStr = retStr.replace(/%0A/g, "%0D%0A");
		retStr = object.unescapeFunc(retStr);		
	}
	return retStr;
}

function EMAILBuild(frameStr)
{
	var object = this;
	var urlStr = object.protocol + "//" + object.hostname + object.progName + "?"
	var urlSep = "&";
	var parmsStr = "";
	var postForm = "";
	// only mailto is supported on Microsoft
	if (typeof(authUser) != "undefined" && typeof(authUser) != null && typeof(authUser.serverSoftware) != "undefined" && authUser.serverSoftware.substr(0,9).toUpperCase() == "MICROSOFT")
	{
		object.mailTo = true;
		// mail clients will need to accept mailto links in UTF-8 format
		if (object.encoding)
		{
			object.encoding = "UTF-8";
			object.escapeFunc = encodeURIComponent;
			object.unescapeFunc = decodeURIComponent;
		}
	}
	if ((object.escapeFunc(object.message)).length > 650)
		object.doPost = true;
	object.subject = insertCarriageReturns(object, object.subject);
	object.message = insertCarriageReturns(object, object.message);
	if (object.mailTo)
	{	
		object.doPost = false;
		urlStr = 'mailto:';
		parmStr  = object.escapeFunc(object.whoto);
		parmStr += '?' + 'sender=' + object.escapeFunc(object.whofrom);
		parmStr += urlSep + 'subject=' + object.escapeFunc(object.subject);
		parmStr += urlSep + 'body=' + object.escapeFunc(object.message);
		urlStr += parmStr;       
		return urlStr;
	}
	else
	{
	  	if (object.doPost)
	  	{
  			targetConversionFrame = frameStr;
 	  		postForm = '<body onload="parent.convert();document.emailform.submit();return false">'
 	  		+ '<form action="'+urlStr+'" target="'+frameStr+'" method="post" name="emailform">'
 	  		+ '<input name="whoto" type="hidden" value="'+object.whoto+'">'
 	  		+ '<input name="whofrom" type="hidden" value="'+object.whofrom+'">'
 	  		+ '<input id="subject" name="subject" type="hidden" value="'+object.escapeFunc(object.subject)+'">'
 	  		+ '<textarea id="message" name="body">'+object.escapeFunc(object.message)+'</textarea>'
 	  		+ '<input type="submit" name="callEMAIL" value="Do EMAIL Calls">'
 	  		+ '</form></body>'
			urlStr = postForm;
		}
		else
		{
			parmsStr += object.escapeFunc(object.whoto);
	    	parmsStr += urlSep + object.escapeFunc(object.whofrom);
	    	parmsStr += urlSep + object.escapeFunc(object.subject);
	    	parmsStr += urlSep + object.escapeFunc(object.message);
	    	urlStr += parmsStr;
	    }
	    return urlStr;
	}
}

function EMAIL(object, frameStr)
{
	var url = object.EMAILBuild(frameStr);
	emailObjInstance = object;
	if (object.encoding && !object.mailTo)
	{
		var emailData = "";
		var urlSep = "&";
		if (object.doPost)
		{
			url = object.protocol + "//" + object.hostname + object.progName;
			var query = "whoto=" + object.escapeFunc(object.whoto)
			+ urlSep + "whofrom=" + object.escapeFunc(object.whofrom)
			+ urlSep + "subject=" + object.escapeFunc(object.subject)
			+ urlSep + "body=" + object.escapeFunc(object.message)
			var cntType = "application/x-www-form-urlencoded; charset=" + object.encoding;
			if (typeof(SSORequest) != "undefined")
				emailData = SSORequest(url, query, cntType, "text/html");
			else
				emailData = SEARequest(url, query, cntType, "text/html");		
		}
		else
		{
			var cntType = (object.encoding) ? "text/xml; charset=" + object.encoding : null;
			if (typeof(SSORequest) != "undefined")
				emailData = SSORequest(url, null, cntType, "text/html");
			else
				emailData = SEARequest(url, null, cntType, "text/html");			
		}	
		var frameObj = window[frameStr];
		frameObj.document.open();
		frameObj.document.write(emailData);
		frameObj.document.close();			
	}
	else
		callEMAIL(url, frameStr, object.doPost);
}
