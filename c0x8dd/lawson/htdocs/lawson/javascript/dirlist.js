//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/dirlist.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
function callDirList(string, frameStr, debugFl)
{
	if (debugFl)
		alert("DEBUG: Calling callDirList(" + string + "," + frameStr + ")");

	eval("window." + frameStr + ".location.replace(\"" + string + "\")")
}

function DirListObject(directory)
{
	this.protocol        = location.protocol;
	this.host            = location.host;
	this.progName        = "/cgi-lawson/dirlist";
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		this.progName += CGIExt
    else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				this.progName += opener.CGIExt
	this.remoteProgName  = "/cgi-lawson/dirlistlaw";
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		this.remoteProgName += CGIExt
    else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				this.remoteProgName += opener.CGIExt
	this.directory       = directory;
	this.func            = null;
	this.debug           = false;
	this.isRemote			= false;
}

function DirList(object, frameStr)
{
var urlStr   = object.protocol + "//" + object.host;
var urlSep   = "&";
var parmsStr = "";
var editParm = "";
var isRemote = "";

	if (isRemote)
	{
		//alert("isremote")
		if (getWebDir() && getLawWebDir())
		{
			var theWebDir = getWebDir();
			var theLawWebDir = getLawWebDir();

			if (object.directory.indexOf(theWebDir) != -1)
			{
				var relativePath = object.directory.substring(theWebDir.length, object.directory.length);
				object.directory = theLawWebDir + relativePath;
			}
		}

		urlStr += object.remoteProgName;
	}
	else if (getWebDir() && getLawWebDir())
	{
		var theWebDir = getWebDir();
		var theLawWebDir = getLawWebDir();

		//alert("webdir=" + theWebDir + " lawwebdir=" + theLawWebDir)
		if (object.directory.indexOf(theWebDir) != -1)
		{
			if ((object.directory.indexOf('srchdata') != -1) ||
				(object.directory.indexOf('/print/') != -1))
			{
				var relativePath = object.directory.substring(theWebDir.length, object.directory.length);
				object.directory = theLawWebDir + relativePath;
				urlStr += object.remoteProgName;
			}
			else
			{
				urlStr += object.progName;
			}
		}
		else
		{
			urlStr += object.remoteProgName;
		}
	}
	else
	{
		urlStr += object.progName;
	}

	urlStr += "?";

	parmsStr += object.directory
	if (object.func)
		parmsStr += urlSep + object.func

	urlStr += parmsStr;
	//alert("urlstr=" + urlStr)
	callDirList(urlStr, frameStr, object.debug);
}

function getWebDir()
{
	var theWebDir = null;

	if (typeof(WebDir) != null && typeof(WebDir) != 'undefined')
	{
		theWebDir = WebDir;
	}
	else if (opener != null)
	{
		if (typeof(opener.WebDir) != null && typeof(opener.WebDir) != 'undefined')
		{
			theWebDir = opener.WebDir;
		}
	}
	else
	{
		var message = '';
			message += 'Error dirlist.js: variable WebDir not found' + '\n';
			message += 'Please have the variable WebDir added to all copies of loganenv.js and logan.env';

		//alert(message);
	}

	return theWebDir;
}

function getLawWebDir()
{
	var theLawWebDir = null;

	if (typeof(LawWebDir) != null && typeof(LawWebDir) != 'undefined')
	{
		theLawWebDir = LawWebDir;
	}
	else if (opener != null)
	{
		if (typeof(opener.LawWebDir) != null && typeof(opener.LawWebDir) != 'undefined')
		{
			theLawWebDir = opener.LawWebDir;
		}
		else
		{
			var message = '';
				message += 'Error dirlist.js: variable LawWebDir not found' + '\n';
				message += 'Please have the variable LawWebDir added to all copies of loganenv.js and logan.env';
	
			//alert(message);
		}
	}
	else
	{
		var message = '';
			message += 'Error dirlist.js: variable LawWebDir not found' + '\n';
			message += 'Please have the variable LawWebDir added to all copies of loganenv.js and logan.env';

		//alert(message);
	}

	return theLawWebDir;
}
