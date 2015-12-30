//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/dme.js,v 1.1.6.1.18.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $

function callDME(string, frameStr, debugFl)
{
	if (debugFl)
		alert("DEBUG: Calling callDME(" + string + "," + frameStr + ")");
	eval("window." + frameStr + ".location.replace(\"" + string + "\")")
//	window.open(string, frameStr);
}

function DMEObject(prodLine, fileName)
{
	this.protocol = location.protocol;
	this.host = location.host;
	this.progName = "/cgi-lawson/dme";
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		this.progName += CGIExt
    else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				this.progName += opener.CGIExt
	this.prod = prodLine;
	this.file = fileName;
	this.system = null;
	this.out = null;
	this.delim = null;
	this.filename = null;
	this.noheader = false;
	this.datefield = null;
	this.periodend = null;
	this.period = null;
	this.total = null;
	this.index = null;
	this.field = null;
	this.key = null;
	this.select = null;
	this.cond = null;
	this.boolcond = null;
	this.max = null;
	this.otmmax = null;
	this.otmdelim = null;
	this.func = null;
	this.sortdesc = null;
	this.sortasc = null;
	this.pub = false;
	this.url = null;
	this.begin = null;
	this.prev = false;
	this.exclude = null;
	this.webuser = null;
	this.logan = null;
	this.allowequals = false;
	this.noFilter = false;	
	this.debug = false;
   this.DMEBuild = DMEBuild
}

function DMEBuild()
{
   var object = this;
	var urlStr = object.protocol + "//" + object.host + object.progName + "?"
	var urlSep = "&";
	var parmsStr = "";

	parmsStr += "PROD=" + object.prod;
	parmsStr += urlSep + "FILE=" + object.file;

	// Set the output format 
	// JAVASCRIPT, FORM, REPORT, CSV, GRAPH, FILE, SS, TOTALS, COUNT
	if (object.out != null && object.out.length > 0)
	{
		parmsStr += urlSep + "OUT="
		var upperout = object.out.toUpperCase()
		if (upperout == "JAVASCRIPT" ||
		upperout == "FORM" ||
		upperout == "REPORT" ||
		upperout == "CSV" ||
		upperout == "GRAPH" ||
		upperout == "FILE" ||
		upperout == "SS" ||
		upperout == "TOTALS" ||
		upperout == "EXPORT" ||
		upperout == "COUNT")
			parmsStr += upperout;
		else
		{
			alert("Invalid OUT value " + object.out);
			return null;
		}
	}

	if (object.filename != null && object.filename.length > 0)
		parmsStr += urlSep + "FILENAME=" + object.filename;

	if (object.system != null && object.system.length > 0)
		parmsStr += urlSep + "SYSTEM=" + object.system;

	// Set the total option SUM or AVERAGE
	// Allow WEEKLY, MONTHLY, QUARTERLY, and YEARLY for backwards
	// compatibility
	if (object.total != null && object.total.length > 0)
	{
		var uppertotal = object.total.toUpperCase();
		parmsStr += urlSep + "TOTAL=";
		if (uppertotal == "SUM" ||
		uppertotal == "AVERAGE" ||
		uppertotal == "DAILY" ||
		uppertotal == "WEEKLY" ||
		uppertotal == "MONTHLY" ||
		uppertotal == "QUARTERLY" ||
		uppertotal == "YEARLY" )
			parmsStr += uppertotal
		else
		{
			alert("Invalid TOTAL value " + object.total);
			return null;
		}
	}

	// Set the period option DAILY, WEEKLY, MONTHLY, QUARTERLY, or YEARLY
	if (object.period != null && object.period.length > 0)
	{
		var upperperiod = object.period.toUpperCase();
		parmsStr += urlSep + "PERIOD=";
		if (upperperiod == "DAILY" ||
		upperperiod == "WEEKLY" ||
		upperperiod == "MONTHLY" ||
		upperperiod == "QUARTERLY" ||
		upperperiod == "YEARLY" )
			parmsStr += upperperiod
		else
		{
			alert("Invalid PERIOD value " + object.period);
			return null;
		}
	}

	if (object.delim != null && object.delim.length > 0)
		parmsStr += urlSep + "DELIM=" + object.delim;

	if (object.datefield != null && object.datefield.length > 0)
		parmsStr += urlSep + "DATEFIELD=" + escape(object.datefield);

	if (object.periodend != null && object.periodend.length > 0)
		parmsStr += urlSep + "PERIODEND=" + object.periodend;

	if (object.noheader) parmsStr += urlSep + "NOHEADER";

	if (object.index != null && object.index.length > 0)
		parmsStr += urlSep + "INDEX=" + object.index;

	if (object.field != null && object.field.length > 0)
		parmsStr += urlSep + "FIELD=" + object.field;

	if (object.key != null && object.key.length > 0)
		parmsStr += urlSep + "KEY=" + object.key;

	if (object.select != null && object.select.length > 0)
		parmsStr += urlSep + "SELECT=" + escape(object.select);

	if (object.cond != null && object.cond.length > 0)
		parmsStr += urlSep + "COND=" + object.cond;

	if (object.boolcond != null && object.boolcond.length > 0)
		parmsStr += urlSep + "BOOLCOND=" + object.boolcond;

	if (object.exclude != null && object.exclude.length > 0)
		parmsStr += urlSep + "EXCLUDE=" + object.exclude;

	if (object.max != null && object.max.length > 0)
		parmsStr += urlSep + "MAX=" + object.max.toString();

	if (object.otmmax != null && object.otmmax.length > 0)
		parmsStr += urlSep + "OTMMAX=" + object.otmmax.toString();

	if (object.otmdelim != null && object.otmdelim.length > 0)
		parmsStr += urlSep + "OTMDELIM=" + object.otmdelim.toString();

	if (object.func != null && object.func.length > 0)
		parmsStr += urlSep + "FUNC=" + object.func;

	if (object.sortdesc != null && object.sortdesc.length > 0)
		parmsStr += urlSep + "SORTDESC=" + object.sortdesc;

	if (object.sortasc != null && object.sortasc.length > 0)
		parmsStr += urlSep + "SORTASC=" + object.sortasc;

	if (object.pub) parmsStr += urlSep + "PUB";

	if (object.url != null && object.url.length > 0)
		parmsStr += urlSep + "URL=" + object.url;

	if (object.begin != null && object.begin.length > 0)
		parmsStr += urlSep + "BEGIN=" + object.begin;

	if (object.prev) parmsStr += urlSep + "PREV";

	if (object.webuser != null && object.webuser.length > 0)
		parmsStr += urlSep + "WEBUSER=" + object.webuser;

	if (object.logan != null && object.logan.length > 0)
		parmsStr += urlSep + "LOGAN=" + object.logan;

	if (object.allowequals)
		parmsStr += urlSep + "ALLOWEQUALS=TRUE";
		
	if (object.noFilter)
		parmsStr += urlSep + "NOFILTER=TRUE";		

	urlStr += parmsStr;
   return urlStr
}

function DME(object, frameStr)
{
	callDME(object.DMEBuild(), frameStr, object.debug);
}

