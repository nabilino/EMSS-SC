//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/logansrch.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $

function callSEARCH(string, frameStr)
{
	eval("window." + frameStr + ".location.replace(\"" + string + "\")")
}

function SEARCHObject(searchFile)
{
	this.protocol = location.protocol;
	this.hostname = location.host;
    this.progName = "/cgi-lawson/logansrch" 
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		this.progName += CGIExt
    else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				this.progName += opener.CGIExt
    this.searchFile  = searchFile;
	this.searchStr   = null;
    this.awkExpr     = null;
    this.fldNumber   = null;
    this.func        = null;
	this.max         = null;
    this.SEARCHBuild = SEARCHBuild
}

function SEARCHBuild()
{
var object   = this;
var urlStr   = object.protocol + "//" + object.hostname + object.progName + object.searchFile + "?"
var urlSep   = "&";
var parmsStr = "";

    if (object.awkExpr != null && object.awkExpr.length > 0)
    	parmsStr += "Awk-Expression=" + escape(object.awkExpr)
    else
    {
		parmsStr += "Search-String=" + escape(object.searchStr)
		if (object.fldNumber != null && object.fldNumber.toString().length > 0)
	    	parmsStr += urlSep + "Field-Number=" + escape(object.fldNumber)
    }

	if (object.func != null && object.func.length > 0)
	   	parmsStr += urlSep + "Function=" + escape(object.func)
	if (object.max != null && object.max.toString().length > 0)
		parmsStr += urlSep + "Max=" + object.max

    urlStr += parmsStr
    return urlStr
}

function SEARCH(object, frameStr)
{
	callSEARCH(object.SEARCHBuild(), frameStr);
}

