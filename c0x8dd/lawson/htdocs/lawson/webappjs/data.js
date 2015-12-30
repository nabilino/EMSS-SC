/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/data.js,v 1.37.2.5.2.3 2014/01/10 14:29:55 brentd Exp $ */
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

var dmeFileInstance = findDME();
var dmeHandler = new DMEHandler();

//-----------------------------------------------------------------------------
function findDME(searchOpener, ref)
{
	if (!ref)
		ref = self;

	try
	{
		// is there a parent ?
		if (ref != ref.parent)
		{
			// does the parent have a dmeFileInstance variable ?
			if (typeof(ref.parent.dmeFileInstance) != "undefined")
			{
				// found a copy...
				if (ref.parent.dmeFileInstance != null)
					return ref.parent.dmeFileInstance;
				else
					return ref.parent;
			}
			else
			{
				// didn't find it... try higher
				return findDME(searchOpener, ref.parent);
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
			// does the opener have a dmeFileInstance variable ?
			if (typeof(ref.opener.dmeFileInstance) != "undefined")
			{
				// found a copy...
				if (ref.opener.dmeFileInstance != null)
					return ref.opener.dmeFileInstance;
				else
					return ref.opener;
			}
			else
			{
				// didn't find it... try higher on the opener
				return findDME(searchOpener, ref.opener);
			}
		}
	}
	catch (e)
	{}

	try
	{
		// does the current window have a dmeFileInstance variable ?
		if (typeof(dmeFileInstance) != "undefined")
		{
			// found a copy...
			if (dmeFileInstance != null)
				return dmeFileInstance;
			else
				return self;
		}
	}
	catch (e)
	{}

	return null;
}

//-----------------------------------------------------------------------------
//-- start DMEHandler object code
function DMEHandler(programName)
{
	// only allow 1 instance of this object
	if (DMEHandler._singleton)
		return DMEHandler._singleton;
	else
	{
		// try to get objects from 1 instance of this file
		DMEHandler._singleton = this;
		try {
			if (dmeFileInstance && dmeFileInstance.DMEHandler && dmeFileInstance.DMEHandler._singleton)
			{
				// copy over parameters...
				this.dme = dmeFileInstance.DMEHandler._singleton.dme;
				this.xsl = dmeFileInstance.DMEHandler._singleton.xsl;
			}
			else
			{
				this.dme = null;	// dme XML reference
				this.xsl = null;	// dme XSL reference
			}
		} catch(e) {
				this.dme = null;	// dme XML reference
				this.xsl = null;	// dme XSL reference		
		}
	}

	this.ssoFileAppended = false;
	this.ssoFileUrl = "/sso/sso.js";
	this.commonHTTPUrl = "/lawson/webappjs/commonHTTP.js";
	this.commonHTTPAppended = false;
	this.dmeUrl_802_803 = "/cgi-lawson/dme.exe";
	this.dmeUrl_8033 = "/servlet/dme";
	this.dmeUrl_810 = "/servlet/Router/Data/Erp";
	this.idaUrl_810 = "/servlet/Router/Drill/Erp";
	this.dmeXsl = location.protocol + "//" + location.host + "/lawson/webappjs/dataTOjavascript.xsl";	
	if (typeof(RECShell) != "undefined" && RECShell.PRODUCT_ID == "REC")
		programName = "RSS"; 
	this.programName = (programName) ? programName : null;

	if (this.programName != "" && this.programName != null){
		this.dmeHtm = "../webappjs/data.htm";
	}else{
		this.dmeHtm = "/lawson/webappjs/data.htm";
	}
}
DMEHandler.prototype._singleton = null;	
//-----------------------------------------------------------------------------
DMEHandler.prototype.getProgName = function()
{
	if (!this.isCommonHTTPLoaded())
	{
		this.loadCommonHTTP();
		setTimeout("dmeHandler.getProgName()", 5);
		return;
	}

	// what version of IOS do I call?
	if (iosHandler.getIOS() == null && !iosHandler.calledWhat)		
		iosHandler.createIOS();
		
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
		setTimeout("dmeHandler.getProgName()", 5);
		return;
	}
	
	try {
		var iosVersion = iosHandler.getIOSVersionNumber();
		
		if (iosVersion >= "08.00.03.03" && iosVersion < "08.01.00") 
			return this.dmeUrl_8033;
		else if (iosVersion >= "08.01.00")
			return this.dmeUrl_810;
		else	
			return this.dmeUrl_802_803;
	} 
	catch(e) 
	{
		return this.dmeUrl_802_803;
	}

	return this.dmeUrl_802_803;
}
//-----------------------------------------------------------------------------
DMEHandler.prototype.getXSL = function()
{
	if (!this.isCommonHTTPLoaded())
	{
		this.loadCommonHTTP();
		setTimeout("dmeHandler.getXSL()", 5);
		return;
	}
	
	// what version of IOS do I call?	
	if (iosHandler.getIOS() == null && !iosHandler.calledWhat)		
		iosHandler.createIOS();
		
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
		setTimeout("dmeHandler.getXSL()", 5);
		return;
	}
	
	try {
		this.xsl = (iosHandler.getIOSVersionNumber() >= "08.01.00") ? this.dmeXsl : null;
	} 
	catch(e) 
	{
		this.xsl = null;
	}

	return this.xsl;
}
//-----------------------------------------------------------------------------
DMEHandler.prototype.isCommonHTTPLoaded = function()
{
	if (typeof(SEARequest) == "function")
	{
		this.commonHTTPAppended = true;
		return true;
	}	
	return false;
}
//-----------------------------------------------------------------------------
DMEHandler.prototype.isSSOFileLoaded = function()
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
DMEHandler.prototype.loadCommonHTTP = function()
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
DMEHandler.prototype.loadSSOFile = function()
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
//-- end DMEHandler object code
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// BELOW IS THE OLD ORIGINAL STUFF FROM DME.JS
// (with the exception of the new DME methods)
//-----------------------------------------------------------------------------

function callDME(string, frameStr, debugFl)
{	
	if (debugFl)
		alert("DEBUG: Calling callDME(" + string + "," + frameStr + ")");
	eval("window." + frameStr + ".location.replace(\"" + string + "\")")
}

function DMEObject(prodLine, fileName, programName)
{
	if (programName != ""){
		if (typeof(dmeHandler) != "object")
		dmeHandler = new DMEHandler(programName);
	}else{
		if (typeof(dmeHandler) != "object")
		dmeHandler = new DMEHandler("");
	}

	this.protocol = location.protocol;
	this.host = location.host;
	this.progName = dmeHandler.dmeUrl_802_803;	
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
	this.DMEBuild = DMEBuild;
	this.xsl = null;
   	this.strOnly = false;
	this.xrels = false;
	this.xkeys = false;
	this.xida = false;   
	this.encoding = null;	
}

function DMEBuild()
{
	var object = this;		
	var urlStr = object.protocol + "//" + object.host + object.progName + "?"
	var urlSep = "&";
	var parmsStr = "";
	var is810 = (object.progName == dmeHandler.dmeUrl_810) ? true : false;

	parmsStr += "PROD=" + object.prod;
	parmsStr += urlSep + "FILE=" + object.file;

	// Set the output format 
	// JAVASCRIPT, FORM, REPORT, CSV, GRAPH, FILE, SS, TOTALS, COUNT
	if (object.out != null && object.out.length > 0)
	{
		parmsStr += urlSep + "OUT="
		if (!is810) 
		{
			var upperout = object.out.toUpperCase()
			if (upperout == "JAVASCRIPT" ||
			upperout == "XML" ||
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
		else
			parmsStr += "XML";
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
		parmsStr += urlSep + "DATEFIELD=" + escapeParam(object.datefield);

	if (object.periodend != null && object.periodend.length > 0)
		parmsStr += urlSep + "PERIODEND=" + object.periodend;

	if (object.noheader) parmsStr += urlSep + "NOHEADER";

	if (object.index != null && object.index.length > 0)
		parmsStr += urlSep + "INDEX=" + object.index;

	if (object.field != null && object.field.length > 0)
		parmsStr += urlSep + "FIELD=" + object.field;

	if (object.key != null && object.key.length > 0)
		parmsStr += urlSep + "KEY=" + escapeParam(object.key);

	if (object.select != null && object.select.length > 0)
		parmsStr += urlSep + "SELECT=" + escapeParam(object.select);

	if (object.cond != null && object.cond.length > 0)
		parmsStr += urlSep + "COND=" + object.cond;

	if (object.boolcond != null && object.boolcond.length > 0)
		parmsStr += urlSep + "BOOLCOND=" + object.boolcond;

	if (object.exclude != null && object.exclude.length > 0)
		parmsStr += urlSep + "EXCLUDE=" + object.exclude;

	if (object.max != null && object.max.toString().length > 0)
		parmsStr += urlSep + "MAX=" + object.max.toString();

	if (object.otmmax != null && object.otmmax.toString().length > 0)
		parmsStr += urlSep + "OTMMAX=" + object.otmmax.toString();

	if (object.otmdelim != null && object.otmdelim.toString().length > 0)
		parmsStr += urlSep + "OTMDELIM=" + object.otmdelim.toString();

	if (object.func != null && object.func.length > 0)
		parmsStr += urlSep + "FUNC=" + escapeParam(object.func);

	if (object.sortdesc != null && object.sortdesc.length > 0)
		parmsStr += urlSep + "SORTDESC=" + object.sortdesc;

	if (object.sortasc != null && object.sortasc.length > 0)
		parmsStr += urlSep + "SORTASC=" + object.sortasc;

	if (object.pub) parmsStr += urlSep + "PUB";

	if (object.url != null && object.url.length > 0)
		parmsStr += urlSep + "URL=" + object.url;

	if (object.begin != null && object.begin.length > 0)
		parmsStr += urlSep + "BEGIN=" + object.begin;

	if (object.prev) parmsStr += urlSep + "PREV=TRUE";

	if (object.webuser != null && object.webuser.length > 0)
		parmsStr += urlSep + "WEBUSER=" + escapeParam(object.webuser);

	if (object.logan != null && object.logan.length > 0)
		parmsStr += urlSep + "LOGAN=" + object.logan;

	if (object.allowequals)
		parmsStr += urlSep + "ALLOWEQUALS=TRUE";
		
	if (object.noFilter)
		parmsStr += urlSep + "NOFILTER=TRUE";		

	// XML output parameters
	if (is810 || (object.out != null && object.out.toString().toUpperCase() == "XML"))
	{
		if (!object.xrels)
			parmsStr += urlSep + "XRELS=FALSE";
		
		if (!object.xkeys)
			parmsStr += urlSep + "XKEYS=FALSE";		

		if (!object.xida)
			parmsStr += urlSep + "XIDA=FALSE";

		//if (is810)
		//	parmsStr += urlSep + "_XSL1=" + object.xsl;
	}

	urlStr += parmsStr;
   	return urlStr
}

function DME(object, frameStr)
{
	if (!dmeHandler.isCommonHTTPLoaded())
	{
		dmeHandler.loadCommonHTTP();
		var thisObj = object;
		var thisFrame = frameStr;
		setTimeout(function(){ DME(thisObj, frameStr); }, 5);	
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
        	setTimeout(function(){ DME(thisObj, frameStr); }, 5);
        	return;		
	}

	//object.xsl = dmeHandler.getXSL();
	object.progName = dmeHandler.getProgName();
	object.encoding = iosHandler.getEncoding();
	
	// if strOnly = true, only the DME string will be returned - the DME call will not be executed.
	if (object.strOnly)
		return object.DMEBuild();
	else if (iosHandler.getIOSVersionNumber() >= "08.01.00")
	{
		if (!dmeHandler.isSSOFileLoaded())
		{
			dmeHandler.loadSSOFile();
			var thisObj = object;
			var thisFrame = frameStr;			
			setTimeout(function(){ DME(thisObj, frameStr); }, 5);
			return;
		}		
		callDME_810(frameStr, object);	
	}
	else
	{
		if (object.out.toUpperCase() == "XML")
			callDME_803_XML(frameStr, object, object.DMEBuild());	
		else
			callDME(object.DMEBuild(), frameStr, object.debug);
	}
} 

function callDME_803_XML(frameStr, object, dataStr)
{
	// If this is a Next or Previous call, the dataStr will be parsed from the initial DME call and 
	// passed into this function.
	var dataStr = (dataStr) ? dataStr : object.DMEBuild();	

	if (object.debug)
		alert("DEBUG: " + dataStr);
	
	try 
	{
		var xmlData = SEARequest(dataStr);
	} 
	catch(e) 
	{
		return;
	}
	parseDMEDataXML(frameStr, object, xmlData);
}

function callDME_810(frameStr, object, dataStr)
{
	// If this is a Next or Previous call, the dataStr will be parsed from the initial DME call and 
	// passed into this function.
	var dataStr = (dataStr) ? dataStr : object.DMEBuild();	

	if (object.debug)
		alert("DEBUG: " + dataStr);
	try 
	{
		var cntType = (object.encoding) ? "text/xml; charset=" + object.encoding : null;
		var xmlData = SSORequest(dataStr, null, cntType);
	} 
	catch(e) 
	{
		return;
	}
	parseDMEDataXML(frameStr, object, xmlData);
}

function parseDMEDataXML(frameStr, object, xmlData)
{
	var dataobj;
	// don't do this, as it wipes out the location object
	//eval("window." + frameStr + " = new Object()");
	eval("dataobj = window." + frameStr);

	// Initialize return data objects
	dataobj.NbrRecs = 0;
	dataobj.record = new Array();
        dataobj.primkey = new Array();
	dataobj.primtype = new Array();
	dataobj.primsize = new Array();
	dataobj.nPrimKeys = 0;
        dataobj.rechdr = new Array();
	dataobj.fldtype = new Array();
	dataobj.fldsize = new Array();		
	dataobj.Basic_Call = "";
	dataobj.Next = "";
	dataobj.Prev = "";
	dataobj.Reload = "";

	// RECORDS
	var periods= xmlData.getElementsByTagName("PERIODS");
	var records = xmlData.getElementsByTagName("RECORDS");
	if ((!records || records.length < 1) && (!periods || periods.length < 1))
		return;

	if (object.total != null)
	{		
		if (object.periodend != null)
		{
			var lenP = periods.length
			for (var m=0; m<lenP; m++)
			{
				var fieldP = "PeriodEndDates"
				var fieldN = "NbrRecsInPeriod"
				eval("dataobj."+fieldP + " = new Array();");
				eval("dataobj."+fieldN + " = new Array();");		
				var period = periods[m].getElementsByTagName("PERIOD");
				var lenP2  = period.length
				for (var k=0; k<lenP2; k++)
				{									
				    var enddate = period[k].getElementsByTagName("ENDDATE");				
					var numrecs = period[k].getElementsByTagName("NUMRECS");
					var valE = getElementText(enddate[0]);
					var valN = getElementText(numrecs[0]);
					eval("dataobj." + fieldP + "["+k+"] = \"" + valE + "\";");
					eval("dataobj." + fieldN + "["+k+"] = \"" + valN + "\";");

				}
			}
			var totals = xmlData.getElementsByTagName("TOTALS");
			if (totals != null)
			{
				var total = totals[0].getElementsByTagName("TOTAL");
				var colT =total[0].getElementsByTagName("COL")
				var fieldT = total[0].getAttribute("name").replace(/\.|,/g,"_").toLowerCase();
				var lenT = total.length;
				for (var i=0; i<lenT; i++)
				{
					var colT =total[i].getElementsByTagName("COL")
					var fieldT = "Tot_"+total[i].getAttribute("name").replace(/\.|,/g,"_").toLowerCase();
					eval("dataobj."+fieldT + " = new Array();");
					var lenC = colT.length
					for (var f=0; f<lenC; f++)
					{
						var valT = getElementText(colT[f]);
						eval("dataobj." + fieldT + "["+f+"] = \"" + valT + "\";");
					}
				}
				doFunc(dataobj, object);
			}
		}
	}
	else
	{
		dataobj.NbrRecs = Number(records[0].getAttribute("count"));
		dataobj.record = new Array();

		var drillBase;

		if (object.xida != false)
		{
			drillBase = xmlData.getElementsByTagName("IDABASE");
			drillBase = dmeHandler.idaUrl_810 + "?" + getElementText(drillBase[0])			
			dataobj.DrillRef = new Array();
		}
		
		var columns = xmlData.getElementsByTagName("COLUMNS");
		var column = columns[0].getElementsByTagName("COLUMN");
		var record = records[0].getElementsByTagName("RECORD");
		var len = record.length;
		for (var i=0; i<len; i++)
		{
			dataobj.record[i] = new Object();
			var cols = record[i].getElementsByTagName("COLS");
			var col = cols[0].getElementsByTagName("COL");
			var len2 = col.length;
			for (var j=0; j<len2; j++)
			{
				var hdr = column[j].getAttribute("header").replace(/\.|,/g,"_");
				var val;
				// OCCURS FIELDS
				if (column[j].getAttribute("nOccurs") && Number(column[j].getAttribute("nOccurs")) > 1)
				{
					var occ = Number(column[j].getAttribute("nOccurs"));
					var occs = col[j].getElementsByTagName("OCC");
					for (var k=1; k<=occ; k++)
					{
						val = getElementText(occs[k-1]);
						var rec = dataobj.record[i];
						eval("rec." + hdr + "_" + k + " = val");
					}
				}
				else
				{
					val = getElementText(col[j]);
					var rec = dataobj.record[i];
					eval("rec." + hdr + " = val");
				}
			}
			// RELATED RECORDS
			var rels = record[i].getElementsByTagName("RELRECS");
			var len3 = rels.length;
			for (var l=0; l<len3; l++)
			{
				var relnm = rels[l].getAttribute("name").replace(/\.|,|-/g,"_").toLowerCase();
				var relrecs = rels[l].getElementsByTagName("RELREC");
				var len4 = relrecs.length;
				dataobj.record[i]["Rel_" + relnm] = new Array();
				for (var m=0; m<len4; m++)
				{		
					dataobj.record[i]["Rel_" + relnm][m] = new Object();
					var relcols = relrecs[m].getElementsByTagName("COLS");
					var relcol = relcols[0].getElementsByTagName("COL");
					var len5 = relcol.length;
					var n = 0;
					for (var p=0; p<len5; p++)
					{
						var val = getElementText(relcol[p]);
						var matched = false;
						while (n < len2 && !matched)
						{
							var dbfld = column[n].getAttribute("dbname").toLowerCase();
							var relx = dbfld.indexOf(".");
							if (relx != -1)
							{
								var relcolnm = dbfld.substring(0, relx).replace(/\.|,|-/g,"_");
								if (relcolnm == relnm) 
								{												
									var relfld = dbfld.substring(relx + 1, dbfld.length).replace(/\.|,|-/g,"_");																				
									dataobj.record[i]["Rel_" + relnm][m][relfld] = val;
									matched = true;
								}	
							}	
							n++;
						}
					}
				}			
			}
			if (object.xida != false)
			{
				var drillRefRec  = record[i].getElementsByTagName("IDACALL");
				var drillRef = drillBase + getElementText(drillRefRec[0]);				
				eval("dataobj.DrillRef[" + i + "] = \"" + drillRef + "\";");
			}		
		}
			
		// KEYS		
		var keys = xmlData.getElementsByTagName("KEYS");
		var key = keys[0].getElementsByTagName("KEY");
		var len3 = key.length;
		for (var i=0; i<len3; i++)
		{
			dataobj.primkey[i] = key[i].getAttribute("name");
			dataobj.primtype[i] = key[i].getAttribute("type");
			dataobj.primsize[i] = key[i].getAttribute("size");
		}
		dataobj.nPrimKeys = key.length;
		
		// COLUMN META DATA
		var len4 = column.length;
		for (var i=0; i<len4; i++)
		{
			dataobj.rechdr[i] = column[i].getAttribute("header");
			dataobj.fldtype[i] = column[i].getAttribute("type");
			dataobj.fldsize[i] = column[i].getAttribute("size");
		}		

		// URL DATA
		var base = xmlData.getElementsByTagName("DMEBASE");
		dataobj.Basic_Call = (base.length > 0) ? base[0].getAttribute("executable") + "?" + getElementText(base[0]) : "";			
		if (dataobj.Basic_Call.charAt(dataobj.Basic_Call.length - 1) != "&") 
			dataobj.Basic_Call += "&";
		
		var dmeNodes = xmlData.getElementsByTagName("DME");
		var next = null;
		var prev = null;
		var reload = null;
		if (dmeNodes.length > 0) {
			var dmeNodeChildren = dmeNodes[0].childNodes;
			var len = dmeNodeChildren.length;
			var i = 0;
			while ((i < len) && ((next == null) || (prev == null) || (reload == null))) {
				if (dmeNodeChildren[i].nodeName.toUpperCase() == "NEXTCALL") {
					next = dmeNodeChildren[i];			
				} else if (dmeNodeChildren[i].nodeName.toUpperCase() == "PREVCALL") { 
					prev = dmeNodeChildren[i];
				} else if (dmeNodeChildren[i].nodeName.toUpperCase() == "RELOAD") { 
					reload = dmeNodeChildren[i];
				}
				i++;
			}
			dataobj.Next = (next) ? dmeHandler.dmeHtm + "?query=" + object.protocol + "//" + object.host + dataobj.Basic_Call + getElementText(next) + "|frame=" + frameStr : "";
			dataobj.Prev = (prev) ? dmeHandler.dmeHtm + "?query=" + object.protocol + "//" + object.host + dataobj.Basic_Call + getElementText(prev) + "|frame=" + frameStr : "";
			dataobj.Reload = (reload) ? dmeHandler.dmeHtm + "?query=" + object.protocol + "//" + object.host + dataobj.Basic_Call + getElementText(reload) + "|frame=" + frameStr : "";
		}		

		doFunc(dataobj, object);

	/*if (object.func != null)
		eval(unescape(object.func));	
	else
		eval(getFuncParam(object.file));*/
	}
}

function doFunc(dataobj, object)
{
    var funcWinRef = "";
    try {
        if (dataobj.parent != self) {
            funcWinRef = "dataobj.parent.";
    	}
    } catch(e) {
        funcWinRef = "";
    }

    if (object.func != null)
        eval(funcWinRef + unescape(object.func));
    else
        eval(funcWinRef + getFuncParam(object.file));
}

function getElementText(node)
{
	var nodes = node.childNodes;
	var len = (nodes && nodes.length ? nodes.length : 0);
	var strRet="";
	for (var i=0; i < len; i++)
	{
		if (nodes[i].nodeType == 3 || nodes[i].nodeType == 4)
			strRet += nodes[i].nodeValue.replace(/\n/g,"").replace(/"/g,'\"').replace(/\\/g,'\\');
	}
    return strRet;
}

function getFuncParam(filename)
{
	return ("Dsp" + filename.charAt(0).toUpperCase() + filename.substring(1).toLowerCase() + "()");
}

function escapeParam(str)
{
	return iosHandler.escapeStr(unescape(str));
}