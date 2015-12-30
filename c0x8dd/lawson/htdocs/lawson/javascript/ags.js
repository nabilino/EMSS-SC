//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/ags.js,v 1.3.8.1.14.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901_SP11 $
var gProtocol = location.protocol;
var gHost = location.host;

function callAGS(string, frameStr, doPost, debugFl)
{
	if (debugFl)
		alert("DEBUG: Calling callAGS(" + string + "," + frameStr + ")");

	if (doPost)
	{
		var isIE = (navigator.userAgent.indexOf("MSIE") >= 0) ? true : false;
		if (isIE)
		{
			// IE changes the document's charset to unicode on a 
			// document.write.  Force the document's charset to iso-8859-1.
			var form = '<HTML><HEAD><meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"></HEAD>'
						+ '<BODY>'
						+ '<FORM METHOD=POST ENCTYPE="application/x-www-form-urlencoded">'
						+ '<INPUT TYPE=SUBMIT NAME="callAgs" VALUE="Do AGS Calls">'
						+ '</FORM>'
						+ '</BODY>'
						+ '</HTML>';
			eval("window." + frameStr + ".document.write(\'" + form + "\')");
			eval("window." + frameStr + ".document.close()");
			eval("window." + frameStr + ".document.charset = 'iso-8859-1'");			

			eval("window." + frameStr + ".document.write(\'" + string + "\')");
			eval("window." + frameStr + ".document.close()");
			eval("window." + frameStr + ".document.charset = 'iso-8859-1'");			
		}
		else
		{
			eval("window." + frameStr + ".document.write(\'" + string + "\')");
			eval("window." + frameStr + ".document.close()");
		}
	}
	else
	    eval("window." + frameStr + ".location.replace(\"" + string + "\")")
}

function AGSObject(prodLine, tokenName)
{
	this.protocol  = gProtocol;
	this.host      = gHost;
	this.progName  = "/cgi-lawson/ags";
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		this.progName += CGIExt
    else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				this.progName += opener.CGIExt
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
}

function AGS(object, frameStr)
{
var urlStr   = object.protocol + "//" + object.host;
var urlSep   = "&";
var parmsStr = "";
var editParm = "";
var postForm = "";
var doPost = false

	if (object.callmethod == 'post')
		doPost = true
	else
	if (object.callmethod == 'get')
		doPost = false
	else
	if (object.field.length > 750)
		doPost = true

    urlStr += object.progName;

	if (doPost)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_EVT" VALUE="'
	else
		parmsStr += "_EVT="
    editParm = object.event.toUpperCase()
    if (editParm == "ADD"
    ||  editParm == "CHANGE"
    ||  editParm == "CHG")
    {
    	if (editParm == "CHANGE")
        	editParm = "CHG"
    	parmsStr += editParm
		if (doPost)
			parmsStr += '"><BR>'
    }
    else
    	alert("Invalid EVENT Value '" + object.event + "'")

	if (doPost)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_RTN" VALUE="'
	else
		parmsStr += urlSep + "_RTN="
    editParm = object.rtn.toUpperCase()
    if (editParm == "DATA"
    ||  editParm == "MESSAGE")
    {
        if (editParm == "MESSAGE")
        	editParm = "MSG"
    	parmsStr += editParm
		if (doPost)
			parmsStr += '"><BR>'
    }
    else
    	alert("Invalid RETURN Value '" + object.rtn + "'")

	if (!object.tds)
	{
		if (doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_TDS" VALUE="Ignore"><BR>'
		else
 			parmsStr += urlSep + "_TDS=Ignore";
	}


	if (doPost)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_PDL" VALUE="' + object.prod + '"><BR>'
	else
		parmsStr += urlSep + "_PDL=" + object.prod

	if (doPost)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_TKN" VALUE="' + object.token + '"><BR>'
	else
	    parmsStr += urlSep + "_TKN=" + object.token

	if ((object.longNames || object.lfn != null)
	&&  object.rtn.toUpperCase() == 'DATA')
	{
		if (object.lfn == null)
			object.lfn = 'TRUE';

		if (doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_LFN" VALUE="' + object.lfn + '"><BR>'
		else
			parmsStr += urlSep + "_LFN=" + object.lfn;
	}

	if (doPost)
	{
	var tmp = unescape(object.func)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_ONLOAD" VALUE="' + chgString(escape(unescape(object.func))) + '"><BR>'
	}
	else
		parmsStr += urlSep + "_ONLOAD=" + object.func

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
			tmpValue  = chgString(escape(tmpValue))
			parmsStr += '<INPUT TYPE=HIDDEN NAME="' + tmpFields[fCntr].substring(0,equalSign) + '"'
					 +  ' VALUE="' + tmpValue + '"><BR>'
		}
	}
	else
		parmsStr += urlSep + object.field

	if (object.enm != null && object.enm.length > 0)
	{
		if (doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_ENM" VALUE="' + object.enm + '"><BR>'
		else
			parmsStr += urlSep + "_ENM=" + object.enm
	}

	if (object.unm != null && object.unm.length > 0)
	{
		if (doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_UNM" VALUE="' + object.unm + '"><BR>'
		else
			parmsStr += urlSep + "_UNM=" + object.unm
	}

	if (object.fmt != null && object.fmt.length > 0)
	{
		if (object.fmt == "form"
		||  object.fmt == "win")
		{
			if (doPost)
				parmsStr += '<INPUT TYPE=HIDDEN NAME="_FMT" VALUE="' + object.fmt + '"><BR>'
			else
				parmsStr += urlSep + "_FMT=" + object.fmt
		}
		else
			alert("Invalid FORMAT Value '" + object.fmt + "'\nValid Values are 'form' and 'win'")
	}

	if (object.pfc != null && object.pfc.length > 0)
	{
		if (doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_PFC" VALUE="' + object.pfc + '"><BR>'
		else
			parmsStr += urlSep + "_PFC=" + object.pfc
	}

	if (object.flb)
	{
		if (doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_FLB" VALUE="TRUE"><BR>'
		else
			parmsStr += urlSep + "_FLB=TRUE"
	}

	if (object.out != null && object.out.length > 0)
	{
  		if (object.out == "TEXT"
		||  object.out == "JAVASCRIPT"
		||  object.out == "JS")
		{
			if (doPost)
				parmsStr += '<INPUT TYPE=HIDDEN NAME="_OUT" VALUE="' + object.out + '"><BR>'
			else
				parmsStr += urlSep + "_OUT=" + object.out
		}
		else
			alert("Invalid OUT Value '" + object.out + "'\nValid Values are 'TEXT' and 'JAVASCRIPT'")
	}

	if (object.ufd)
	{
		if (doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_UFD" VALUE="TRUE"><BR>'
		else
			parmsStr += urlSep + "_UFD=TRUE"
	}

	if (object.vfmt)
	{
		if (doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_VFMT" VALUE="TRUE"><BR>'
		else
			parmsStr += urlSep + "_VFMT=TRUE"
	}

	if (object.msgtarget != null && object.msgtarget.length > 0)
	{
		if (doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_MSGTARGET" VALUE="' + object.msgtarget + '"><BR>'
		else
			parmsStr += urlSep + "_MSGTARGET=" + object.msgtarget
	}

	if (object.initdtl)
	{
		if (doPost)
			parmsStr += '<INPUT TYPE=HIDDEN NAME="_INITDTL" VALUE="TRUE"><BR>'
		else
			parmsStr += urlSep + "_INITDTL=TRUE"
	}

	if (doPost)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_EOT" VALUE="TRUE"><BR>'
	else
		parmsStr += urlSep + "_EOT=TRUE"

	if (doPost)
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

	callAGS(urlStr, frameStr, doPost, object.debug);
}

function chgString(passedStr)
{
var myStr = repStrs(passedStr,'%22','&quot;')
    myStr = repStrs(myStr,'%26','&amp;')
    myStr = repStrs(myStr,'%3C','&gt;')
    myStr = repStrs(myStr,'%2E','&lt;')
    myStr = repStrs(myStr,'%27',"\\'")

	return unescape(myStr)
}
