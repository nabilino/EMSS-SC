// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/careermanagement/lib/writeattach.js,v 1.5.4.2 2008/10/03 17:50:00 brentd Exp $

function callWRITEATTACH(string, frameStr, debugFl)
{
	if (debugFl)
		alert("DEBUG: Calling callWRITEATTACH(" + string + "," + frameStr + ")");
	eval("window." + frameStr + ".location.replace(\"" + string + "\")");
}

function WRITEATTACHObject(prodLine, fileName)
{
	this.protocol = location.protocol;
	this.host =  location.host;
	this.progName = "/cgi-lawson/writeattach";
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		this.progName += CGIExt;
    else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				this.progName += opener.CGIExt;
	this.prod = prodLine;
	this.out = null;
	this.filename = fileName;
	this.key = null;
	this.opm = null;
	this.index = null;
	this.drilltitle = null;
	this.rectype = null;
	this.usertype = null;
	this.options = null;
	this.data = null;
	this.header = null;
	this.title = null;
	this.body = null;
	this.reckey = null;
	this.seqkey = null;
	this.encode = null;
	this.func = null;
	this.debug = false;
    this.WRITEATTACHBuild = WRITEATTACHBuild;
}

function WRITEATTACHBuild()
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
			alert(getSeaPhrase("CM_189","CM")+" " + object.out);
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
		
	if (object.usertype != null && object.usertype.length > 0)
		parmsStr += urlSep + "_AUDT=" + object.usertype;	
	
	if (object.options != null && object.options.length > 0)
		parmsStr += urlSep + object.options;
	
	if (object.linesize != null && object.linesize.length > 0)
		parmsStr += urlSep + "_AWID=" + object.linesize;
		
	if (object.title != null && object.title.length > 0)
		parmsStr += urlSep + "_ANAM=" + object.title;
		
	if (object.body != null && object.body.length > 0)
		parmsStr += urlSep + "_ATXT=" + object.body;
		
	if (object.reckey != null && object.reckey.length > 0)
		parmsStr += urlSep + "_AK=" +  object.reckey;		
	else
		parmsStr += urlSep + "_AK=" + escape(" ");
		
	if (object.seqkey != null && object.seqkey.length > 0)
		parmsStr += urlSep + "_KS=" +  object.seqkey;			
	else
		parmsStr += urlSep + "_KS=" + escape(" ");
	
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
			alert(getSeaPhrase("CM_190","CM")+" " + object.stat);
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
			alert(getSeaPhrase("CM_191","CM")+" " + object.header);
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
			alert(getSeaPhrase("CM_192","CM")+" " + object.data);
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
			alert(getSeaPhrase("CM_193","CM")+" " + object.encode);
			return null;
		}
	}	
		
	if (object.func != null && object.func.length > 0)
		parmsStr += urlSep + "_FNAM=" + object.func;
	
	parmsStr += urlSep + "_AOBJ=TRUE";
	
	urlStr += parmsStr;
   return urlStr;
}

function WRITEATTACH(object, frameStr)
{
	// PT 100928
	if (object.body == null || object.body.length < 750)
	{
		callWRITEATTACH(object.WRITEATTACHBuild(), frameStr, object.debug);
	}
	else
	{
		// PT 100928
		// construct a form to submit more data instead of using url coded parameter
		callWRITEATTACHForPost(object, object.WRITEATTACHBuild(), frameStr, object.debug);
	}
}

// PT 100928
function callWRITEATTACHForPost(object, string, frameStr, debugFl)
{
	if (debugFl)
		alert("DEBUG: Calling callWRITEATTACHForPost(" + string + "," + frameStr + ")");
		
	var attachData;
	if (typeof(SSORequest) != "undefined")
		attachData = SSORequest(object.progName, buildAttachXml(string), "text/xml", "text/html");
	else
		attachData = SEARequest(object.progName, buildAttachXml(string), "text/xml", "text/html");	
		
	var attachobj = window[frameStr];

	if (object.out == "JS")
	{
		attachobj.document.write(attachData);
	}
	else
	{
		alert("Unhandled output type " + object.out + " - writeattach.js");
	}
}

// PT 100928
function WRITEATTACHBuildForPost(object, frameStr)
{
	var urlStr = object.protocol + "//" + object.host + object.progName;
	var parmsStr = "";

	parmsStr += '<INPUT TYPE=HIDDEN NAME="_PDL" VALUE="' + object.prod + '">';

	// Set the output format 
	// JS, TEXT
	if (object.out != null && object.out.length > 0)
	{
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_OUT" VALUE="';
		var upperout = object.out.toUpperCase();
		if (upperout == "JS" ||	upperout == "JAVASCRIPT" ||	upperout == "TEXT")
			parmsStr += upperout + '">';
		else {
			alert(getSeaPhrase("CM_189","CM")+" " + object.out);
			return null;
		}
	}
	
	parmsStr += '<INPUT TYPE=HIDDEN NAME="_FN" VALUE="' + object.filename + '">';
	parmsStr += '<INPUT TYPE=HIDDEN NAME="_ATTR" VALUE="TRUE">';
	
	if (object.index != null && object.index.length > 0)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_IN" VALUE="' + object.index + '">';
	
	if (object.key != null && object.key.length > 0) {
		var keys = object.key.split("&");
		for (var j=0; j<keys.length; j++) {
			var keysArr = keys[j].split("=");
			parmsStr += '<INPUT TYPE=HIDDEN NAME="K' + (j+1) + '" VALUE="' + keysArr[1] + '">';
		}
		/*
		var key1s = keys[0].split("=");
		var key2s = keys[1].split("=");
		var key3s = keys[2].split("=");
		var key4s = keys[3].split("=");
		parmsStr += '<INPUT TYPE=HIDDEN NAME="K1" VALUE="' + key1s[1] + '">';
		parmsStr += '<INPUT TYPE=HIDDEN NAME="K2" VALUE="' + key2s[1] + '">';
		parmsStr += '<INPUT TYPE=HIDDEN NAME="K3" VALUE="' + key3s[1] + '">';
		parmsStr += '<INPUT TYPE=HIDDEN NAME="K4" VALUE="' + key4s[1] + '">';
		*/
	}
	
	if (object.opm != null && object.opm.length > 0)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_OPM" VALUE="' + object.opm + '">';
	
	if (object.drilltitle != null && object.drilltitle.length > 0)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_ON" VALUE="' + object.drilltitle + '">';
	
	if (object.rectype != null && object.rectype.length > 0)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_ATYP" VALUE="' + object.rectype + '">';
		
	if (object.usertype != null && object.usertype.length > 0)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_AUDT" VALUE="' + object.usertype + '">';

	// PT 100928
	// might be a potential bug	
	// if (object.options != null && object.options.length > 0)
	// 	parmsStr += urlSep + object.options;
	
	if (object.linesize != null && object.linesize.length > 0)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_AWID" VALUE="' + object.linesize + '">';
		
	if (object.title != null && object.title.length > 0) {
		// PT 100928
		// at this time, no " or ' allowed in title
		// if we have to accept " or ' using unescape(), server side needs some change
		//var titleString = repStr(repStr(unescape(object.title), "'", " "), '"', ' ');
		//parmsStr += "<INPUT TYPE=HIDDEN NAME=\"_ANAM\" VALUE=\"" + titleString + "\">";
		parmsStr += "<INPUT TYPE=HIDDEN NAME=\"_ANAM\" VALUE=\"" + object.title + "\">";
	}
	
	if (object.body != null && object.body.length > 0) {
		// PT 100928
		// at this time, no " or ' allowed in plan description
		// if we have to accept " or ' using unescape(), server side needs some change
		//var planString = repStr(repStr(unescape(object.body), "'", " "), '"', ' ');
		//parmsStr += "<INPUT TYPE=HIDDEN NAME=\"_ATXT\" VALUE=\"" + planString + "\">";
		parmsStr += "<INPUT TYPE=HIDDEN NAME=\"_ATXT\" VALUE=\"" + object.body + "\">";
	}
		
	if (object.reckey != null && object.reckey.length > 0)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_AK" VALUE="' + object.reckey + '">';
	else
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_AK" VALUE=" ">';
		
	if (object.seqkey != null && object.seqkey.length > 0)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_KS" VALUE="' + object.seqkey + '">';
	else
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_KS" VALUE=" ">';
	
	// Set the stat option 
	// TRUE, FALSE
	if (object.stat != null && object.stat.length > 0)
	{
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_STAT" VALUE="';
		var upperout = object.stat.toUpperCase();
		if (upperout == "TRUE" || upperout == "FALSE")
			parmsStr += upperout + '">';
		else
		{
			alert(getSeaPhrase("CM_190","CM")+" " + object.stat);
			return null;
		}
	}
	
	// Set the header object option 
	// TRUE, FALSE
	if (object.header != null && object.header.length > 0)
	{
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_AOBJ" VALUE="';
		var upperout = object.header.toUpperCase();
		if (upperout == "TRUE" || upperout == "FALSE")
			parmsStr += upperout + '">';
		else
		{
			alert(getSeaPhrase("CM_191","CM")+" " + object.header);
			return null;
		}
	}
	
	// Set the output data format 
	// TRUE, LINES
	if (object.data != null && object.data.length > 0)
	{
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_DATA" VALUE="';
		var upperout = object.data.toUpperCase();
		if (upperout == "TRUE" || upperout == "LINES")
			parmsStr += upperout + '">';
		else
		{
			alert(getSeaPhrase("CM_192","CM")+" " + object.data);
			return null;
		}
	}
		
	// Set the output data encoding 
	// TRUE, FALSE, ALL, TEXT
	if (object.encode != null && object.encode.length > 0)
	{
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_ECODE" VALUE="';
		var upperout = object.encode.toUpperCase();
		if (upperout == "TRUE" || upperout == "FALSE" || upperout == "ALL" || upperout == "TEXT")
			parmsStr += upperout + '">';
		else
		{
			alert(getSeaPhrase("CM_193","CM")+" " + object.encode);
			return null;
		}
	}	
		
	if (object.func != null && object.func.length > 0)
		parmsStr += '<INPUT TYPE=HIDDEN NAME="_FNAM" VALUE="' + object.func + '">';
	
	parmsStr += '<INPUT TYPE=HIDDEN NAME="_AOBJ" VALUE="TRUE">';
	
	var htmlForm = '<BODY onLoad="javascript:document.myForm.submit(); return false">' +
		'<FORM ACTION=' + urlStr + ' TARGET=' + frameStr + ' METHOD=POST name=myForm>' +
		parmsStr +
		'<INPUT TYPE=SUBMIT NAME="addThisAttachment" VALUE="'+getSeaPhrase("CM_327","CM")+'">' +
		'</FORM>' +
		'</BODY>';

	return htmlForm;
}

function buildAttachXml(string)
{
    	var dataArray = new Array();
	var xmlString = '<?xml version="1.0" encoding="utf-8"?>';
	xmlString += '<ATTACHXML>';
	
	var str = string.split("?")[1].split("&");
	
	for (var i=0; i<str.length;i++)
	{
		var str1 = str[i].split("=");
		
		xmlString += '<' + str1[0] + '>';
		if (str1.length == 2)
		{
			if (str1[0] == "_ANAM" || str1[0] == "_ATXT")
			{
				xmlString += '<![CDATA[';
				xmlString += unescape(str1[1]);
				xmlString += ']]>';	
			}
			else if ((str1[0] == "_AK" || str1[0] == "_KS") && unescape(str1[1]) == " ")
			{
				xmlString += '';
			}
			else
			{
				xmlString += unescape(str1[1]);
			}
		}
		xmlString += '</' + str1[0] + '>';
	}
	
	xmlString += '</ATTACHXML>';	
	return xmlString;
}
