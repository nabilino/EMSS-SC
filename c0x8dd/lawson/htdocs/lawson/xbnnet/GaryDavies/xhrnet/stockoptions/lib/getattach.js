// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/stockoptions/lib/getattach.js,v 1.1 2003/04/23 22:52:05 brentd Exp $
function callGETATTACH(string, frameStr, debugFl)
{
	if (debugFl)
		alert("DEBUG: Calling callGETATTACH(" + string + "," + frameStr + ")");
	eval("window." + frameStr + ".location.replace(\"" + string + "\")");
}

function GETATTACHObject(prodLine, fileName)
{
	this.protocol = location.protocol;
	this.host = location.host;
	this.progName = "/cgi-lawson/getattachrec";
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		this.progName += CGIExt;
    	else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				this.progName += opener.CGIExt;
	this.prod = prodLine;
	this.opm = null;
	this.out = null;
	this.filename = fileName;
	this.key = null;
	this.index = null;
	this.drilltitle = null;
	this.rectype = null;
	this.usertype = null;
	this.reckey = null;
	this.seqkey = null;
	this.options = null;
	this.data = null;
	this.stat = null;
	this.header = null;
	this.linesize = null;
	this.encode = null;
	this.func = null;
	this.debug = false;
    this.GETATTACHBuild = GETATTACHBuild;
}

function GETATTACHBuild()
{
    var object = this;
	var urlStr = object.protocol + "//" + object.host + object.progName + "?";
	var urlSep = "&";
	var parmsStr = "";

	parmsStr += "_PDL=" + object.prod;
	
	// Set the output format 
	// JS, TEXT
	if (object.out != null && object.out.length > 0)
	{
		parmsStr += urlSep + "_OUT=";
		var upperout = object.out.toUpperCase();
		if (upperout == "JS" ||
		upperout == "JAVASCRIPT" ||
		upperout == "TEXT")
			parmsStr += upperout;
		else
		{
			alert(getSeaPhrase("INVALID_OUT","ESS") + object.out);
			return null;
		}
	}
	
	parmsStr += urlSep + "_FN=" + object.filename;
	parmsStr += urlSep + "_ATTR=TRUE";
	
	if (object.index != null && object.index.length > 0)
		parmsStr += urlSep + "_IN=" + object.index;
	
	if (object.key != null && object.key.length > 0)
		parmsStr += urlSep + object.key;
		
	if (object.opm != null && object.opm.length > 0)
		parmsStr += urlSep + "_OPM=" + object.opm;	
	
	if (object.drilltitle != null && object.drilltitle.length > 0)
		parmsStr += urlSep + "_ON=" + object.drilltitle;
	
	if (object.rectype != null && object.rectype.length > 0)
		parmsStr += urlSep + "_ATYP=" + object.rectype;
	else
		parmsStr += urlSep + "_ATYP=+";
		
	if (object.usertype != null && object.usertype.length > 0)
		parmsStr += urlSep + "_AUDT=" + object.usertype;
	else
		parmsStr += urlSep + "_AUDT=+";		
	
	if (object.options != null && object.options.length > 0)
		parmsStr += urlSep + object.options;
	
	if (object.linesize != null && object.linesize.length > 0)
		parmsStr += urlSep + "_AWID=" + object.linesize;
	
	if (object.reckey != null && object.reckey.length > 0)
		parmsStr += urlSep + "_AK=" +  object.reckey;		
		
	if (object.seqkey != null && object.seqkey.length > 0)
		parmsStr += urlSep + "_KS=" +  object.seqkey;			
	
	// Set the stat option 
	// TRUE, FALSE
	if (object.stat != null && object.stat.length > 0)
	{
		parmsStr += urlSep + "_STAT=";
		var upperout = object.stat.toUpperCase();
		if (upperout == "TRUE" ||
		upperout == "FALSE")
			parmsStr += upperout;
		else
		{
			alert(getSeaPhrase("INVALID_STAT","ESS") + object.stat);
			return null;
		}
	}
	
	// Set the header object option 
	// TRUE, FALSE
	if (object.header != null && object.header.length > 0)
	{
		parmsStr += urlSep + "_AOBJ=";
		var upperout = object.header.toUpperCase();
		if (upperout == "TRUE" ||
		upperout == "FALSE")
			parmsStr += upperout;
		else
		{
			alert(getSeaPhrase("INVALID_HEADER","ESS") + object.header);
			return null;
		}
	}
	
	// Set the output data format 
	// TRUE, LINES
	if (object.data != null && object.data.length > 0)
	{
		parmsStr += urlSep + "_DATA=";
		var upperout = object.data.toUpperCase();
		if (upperout == "TRUE" ||
		upperout == "LINES")
			parmsStr += upperout;
		else
		{
			alert(getSeaPhrase("INVALID_DATA","ESS") + object.data);
			return null;
		}
	}
	
	// Set the output data encoding 
	// TRUE, FALSE, ALL, TEXT
	if (object.encode != null && object.encode.length > 0)
	{
		parmsStr += urlSep + "_ECODE=";
		var upperout = object.encode.toUpperCase();
		if (upperout == "TRUE" ||
		upperout == "FALSE" ||
		upperout == "ALL" ||
		upperout == "TEXT")
			parmsStr += upperout;
		else
		{
			alert(getSeaPhrase("INVALID_ENCODE","ESS") + object.encode);
			return null;
		}
	}
		
	if (object.func != null && object.func.length > 0)
		parmsStr += urlSep + "_FNAM=" + object.func;
	
	urlStr += parmsStr;
   return urlStr;
}

function GETATTACH(object, frameStr)
{
	callGETATTACH(object.GETATTACHBuild(), frameStr, object.debug);
}

