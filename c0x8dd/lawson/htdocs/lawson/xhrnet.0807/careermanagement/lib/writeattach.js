// Version: 8-)@(#)@10.00.02.00.29
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/careermanagement/lib/writeattach.js,v 1.5.4.8 2012/07/19 13:31:55 brentd Exp $
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
//*   (c) COPYRIGHT 2012 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************

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
    this.encoding = null;
    this.callmethod = 'get';
	this.aesc = null;
	this.usch = null;
}

function WRITEATTACHBuild()
{
    var object = this;
	var urlStr = object.protocol + "//" + object.host + object.progName + "?";
	var urlSep = "&";
	var parmsStr = "";

	var doPost = (object.callmethod == 'post') ? true : false;

	parmsStr += "_PDL=" + object.prod;
	
	if (object.aesc != null)
		parmsStr += urlSep + "_AESC=" + object.aesc;
	if (object.usch != null)
		parmsStr += urlSep + "_USCH="; + object.usch;
	
	// Set the output format 
	// JS, TEXT
	if (object.out != null && object.out.length > 0)
	{
		parmsStr += urlSep + "_OUT=";
		var upperout = object.out.toUpperCase();
		if (upperout == "JS" || upperout == "JAVASCRIPT" || upperout == "XML" || upperout == "TEXT")
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
		parmsStr += urlSep + setAttachKeys(object.key, doPost);
	
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
		parmsStr += urlSep + "_ANAM=" + escapeParam(object.title, doPost);
		
	if (object.body != null && object.body.length > 0)
		parmsStr += urlSep + "_ATXT=" + escapeParam(object.body, doPost);
		
	if (object.reckey != null && object.reckey.length > 0)
		parmsStr += urlSep + "_AK=" +  escapeParam(object.reckey, doPost);		
	else
		parmsStr += urlSep + "_AK=" + escape(" ");
		
	if (object.seqkey != null && object.seqkey.length > 0)
		parmsStr += urlSep + "_KS=" +  escapeParam(object.seqkey, doPost);			
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
		
	if (object.out != "XML" && object.func != null && object.func.length > 0)
		parmsStr += urlSep + "_FNAM=" + object.func;
	
	parmsStr += urlSep + "_AOBJ=TRUE";
	
	urlStr += parmsStr;
   return urlStr;
}

function WRITEATTACH(object, frameStr)
{
	try
	{
		object.encoding = iosHandler.getEncoding();
    	if (object.encoding)
    	{
	    	object.out = "XML";
	    	object.encode = "FALSE";
			object.aesc = "IE";
			object.usch = "";
    	}		
	}
	catch(e) {}	
	var url = object.WRITEATTACHBuild();
	if (object.callmethod != 'post' && (object.body == null || object.body.length < 750))
	{
	    if (object.encoding || object.out == "XML")
	    {	    
			if (object.debug)
				alert("DEBUG: " + url);
			try 
			{
				var attachData;
				var cntType = "text/html";
				if (object.encoding)
					cntType += "; charset=" + object.encoding;				
				if (typeof(SSORequest) != "undefined")
					attachData = SSORequest(url, null, cntType, "text/xml");
				else
					attachData = SEARequest(url, null, cntType, "text/xml");
				parseAttachDataXML(frameStr, object, attachData);
			} 
			catch(e) 
			{
				return;
			}    	
	    }
	    else
	    {
			callWRITEATTACH(url, frameStr, object.debug);
		}
	}
	else
	{
		object.callmethod = 'post';
		url = object.WRITEATTACHBuild();
		// PT 100928
		// construct a form to submit more data instead of using url coded parameter
		callWRITEATTACHForPost(object, url, frameStr, object.debug);
	}
}

function callWRITEATTACHForPost(object, string, frameStr, debugFl)
{
	if (debugFl)
		alert("DEBUG: Calling callWRITEATTACHForPost(" + string + "," + frameStr + ")");
	
	var cntType = (object.encoding) ? "text/xml; charset=" + object.encoding : "text/xml";
	var outType = (object.out == "XML") ? "text/xml" : "text/html";
	var attachData;
	if (typeof(SSORequest) != "undefined")
		attachData = SSORequest(object.progName, buildAttachXml(string, object.encoding), "text/xml", outType);
	else
		attachData = SEARequest(object.progName, buildAttachXml(string, object.encoding), "text/xml", outType);

	if (object.out == "JS")
	{
		attachobj.document.write(attachData);
	}
	else if (object.out == "XML")
	{
		parseAttachDataXML(frameStr, object, attachData);
	}
	else
	{
		alert("Unhandled output type " + object.out + " - writeattach.js");
	}
}

function buildAttachXml(string, encoding)
{
    var dataArray = new Array();
	var xmlString = '<?xml version="1.0" encoding="' + ((encoding) ? encoding : 'UTF-8') + '"?>';
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
				if (encoding)
					xmlString += iosHandler.escapeStr(unescape(str1[1]));
				else
					xmlString += unescape(str1[1]);
				xmlString += ']]>';
			}
			else if ((str1[0] == "_AK" || str1[0] == "_KS") && unescape(str1[1]) == " ")
			{
				xmlString += '';
			}
			else
			{
				if (encoding)
					xmlString += iosHandler.escapeStr(unescape(str1[1]));
				else
					xmlString += unescape(str1[1]);
			}
		}
		xmlString += '</' + str1[0] + '>';
	}
	
	xmlString += '</ATTACHXML>';	
	return xmlString;
}

function setAttachKeys(str, doPost)
{
	if (!str)
		return str;	
	var keys = str.split("&");
	var nbrKeys = keys.length;
	for (var i=0; i<nbrKeys; i++)
	{
		if (keys[i].indexOf("=") == -1)
			continue;
		var params = keys[i].split("=");
		if (params.length > 0)
			params[1] = escapeParam(params[1], doPost);
		keys[i] = params.join("=");
	}
	return keys.join("&");
}

function escapeParam(str, doPost)
{
	if (doPost)
		return str;
	try
	{
		return iosHandler.escapeStr(unescape(str));
	}
	catch(e)
	{
		return escape(unescape(str)).replace(/\+/g, "%2B");
	}	
}

function parseAttachDataXML(frameStr, object, xmlData)
{
	var attachobj = window[frameStr];

	attachobj.fHasHeader = false;
	attachobj.nHeaders = 0;
	
	attachobj.nCmtHdrs = 0;
	attachobj.CommentData = new Array();
	attachobj.CmtLineCnt = new Array();

	attachobj.UrlDrillHdr = new Array() ;
	attachobj.nUrlHdrs = 0;
	attachobj.UrlData = new Array();
	attachobj.UrlLineCnt = new Array();

	attachobj.StatObj = function(nAttachRecs, nCmtRecs, nUrlRecs, nParentRecs)
	{
	    this.nAttachRecs = nAttachRecs;
	    this.nCmtRecs    = nCmtRecs;
	    this.nUrlRecs    = nUrlRecs;
	    this.nParentRecs = nParentRecs;
	}

	attachobj.AttachStatistics = new Array();

	attachobj.AttachObj = function(AttachType, Title, UserType, RecKey, SeqKey, Scheme)
	{
	    this.AttachType = AttachType;
	    this.Title = Title;
	    this.UserType = UserType;
	    this.RecKey = RecKey;
	    this.SeqKey = SeqKey;
	    this.Scheme = Scheme;
	}

	attachobj.nAttachRecords = 0;
	attachobj.nParentRecords = 0;
	attachobj.CmtRec = new Array();
	attachobj.CmtRecordCnt = 0;
	attachobj.UrlRec = new Array();
	attachobj.UrlRecordCnt = 0;	

	attachobj.CmtObjectHeader = function(UserType, Creator, Modifier, HeaderSize)
	{
	    this.UserType = UserType;
	    this.Creator = Creator;
	    this.Modifier = Modifier;
	    this.HeaderSize = HeaderSize;
	}

	attachobj.CmtObjHeader = new Array();

	attachobj.UrlObjectHeader = function(UserType, Scheme, HeaderSize)
	{
	    this.UserType = UserType;
	    this.Scheme = Scheme;
	    this.HeaderSize = HeaderSize;
	}

	attachobj.UrlObjHeader = new Array();

	attachobj.AttribObj = function(CreateDate, CreateTime, ModifyDate, ModifyTime, HeaderSize, ObjectSize)
	{
	    this.CreateDate = CreateDate;
	    this.CreateTime = CreateTime;
	    this.ModifyDate = ModifyDate;
	    this.ModifyTime = ModifyTime;
	    this.HeaderSize = HeaderSize;
	    this.ObjectSize = ObjectSize;
	}

	attachobj.CmtAttrib = new Array();
	attachobj.CmtParentKey = new Array();
	attachobj.UrlAttrib = new Array();
	attachobj.UrlParentKey = new Array();

	var attNode;
	var records = xmlData.getElementsByTagName("RecAtt");
	var len = records.length;
	for (var i=0; i<len; i++)
	{
		var queryHash = new Array();
		attNode = records[i].getElementsByTagName("QueryVal");
		var queryVal = (attNode.length > 0) ? getAttachElementText(attNode[0]) : "";
		attNode = records[i].parentNode.getElementsByTagName("QueryVal");	
		var parQueryVal = (attNode.length > 0) ? getAttachElementText(attNode[0]) : "";
		if (parQueryVal)
			queryVal = parQueryVal + "&" + queryVal;
		if (queryVal.charAt(queryVal.length-1) == "&")
			queryVal = queryVal.substring(0, queryVal.length-1);	
		var queryParams = (queryVal) ? queryVal.split("&") : new Array();
		for (var j=0; j<queryParams.length; j++)
		{
			var prms = queryParams[j].split("=");
			queryHash[prms[0]] = (prms.length > 1) ? prms[1] : "";
		}
		
		//attach obj
		attNode = records[i].getElementsByTagName("AttType");
		var attType = (attNode.length > 0) ? getAttachElementText(attNode[0]) : "";
		attNode = records[i].getElementsByTagName("AttName");
		var attName = (attNode.length > 0) ? getAttachElementText(attNode[0]) : "";
		attNode = records[i].getElementsByTagName("UsrType");
		var usrType = (attNode.length > 0) ? getAttachElementText(attNode[0]) : "";		
		attNode = records[i].getElementsByTagName("AttScheme");
		var attScheme = (attNode.length > 0) ? getAttachElementText(attNode[0]) : "none";
		
		if (attType == "C")
			attachobj.CmtRec[i] = new attachobj.AttachObj(attType, attName, usrType, queryHash["_AK"], queryHash["_KS"], attScheme);
		else if (attType == "U")
			attachobj.UrlRec[i] = new attachobj.AttachObj(attType, attName, usrType, queryHash["_AK"], queryHash["_KS"], attScheme);

		//data
		attNode = records[i].getElementsByTagName("AttData");
		if (attType == "C")
		{
			attachobj.CommentData[i] = new Array();
			attachobj.CmtLineCnt[i] = 0;
			if (attNode.length > 0)
			{
				attachobj.CommentData[i][0] = getAttachElementText(attNode[0]);			
				attachobj.CmtLineCnt[i] = attachobj.CommentData[i].length;
			}			
		}
		else if (attType == "U")
		{
			attachobj.UrlData[i] = new Array();
			attachobj.UrlLineCnt[i] = 0;
			if (attNode.length > 0)
			{
				attachobj.UrlData[i][0] = getAttachElementText(attNode[0]);			
				attachobj.UrlLineCnt[i] = attachobj.UrlData[i].length;
			}					
		}
		
		//parent keys
		var parKeys = new Array();
		var re = /(K)(\d+)$/;
		for (var k in queryHash)
		{
			if (k.search(re) != -1) 
				parKeys[parKeys.length] = k + "=" + queryHash[k]; 
		}
		
		if (attType == "C")
			attachobj.CmtParentKey[i] = parKeys.join("&");
		else if (attType == "U")
			attachobj.UrlParentKey[i] = parKeys.join("&");
		
		//attributes
		attNode = records[i].getElementsByTagName("CrtDate");
		var crtDate = (attNode.length > 0) ? getAttachElementText(attNode[0]) : "";
		attNode = records[i].getElementsByTagName("CrtTime");
		var crtTime = (attNode.length > 0) ? getAttachElementText(attNode[0]) : "";
		attNode = records[i].getElementsByTagName("ModDate");
		var modDate = (attNode.length > 0) ? getAttachElementText(attNode[0]) : "";
		attNode = records[i].getElementsByTagName("ModTime");
		var modTime = (attNode.length > 0) ? getAttachElementText(attNode[0]) : "";
		attNode = records[i].getElementsByTagName("HdrSize");
		var hdrSize = (attNode.length > 0) ? getAttachElementText(attNode[0]) : "";
		attNode = records[i].getElementsByTagName("AttSize");
		var attSize = (attNode.length > 0) ? getAttachElementText(attNode[0]) : "";
		var objSize = String(Number(hdrSize) + Number(attSize));
		if (typeof(storeFormatedUserDate) == "function")
		{
			crtDate = (crtDate != "") ? storeFormatedUserDate(crtDate) : crtDate;	
			crtTime = (crtTime != "") ? crtTime.replace(/\:/g, "") : crtTime;
			modDate = (modDate != "") ? storeFormatedUserDate(modDate) : modDate;
			modTime = (modTime != "") ? modTime.replace(/\:/g, "") : modTime;
		}
		
		if (attType == "C")
			attachobj.CmtAttrib[i] = new attachobj.AttribObj(crtDate, crtTime, modDate, modTime, hdrSize, objSize);
		else if (attType == "U")
			attachobj.UrlAttrib[i] = new attachobj.AttribObj(crtDate, crtTime, modDate, modTime, hdrSize, objSize);
		
		//header
		attNode = records[i].getElementsByTagName("AttCreator");
		var attCreator = (attNode.length > 0) ? getAttachElementText(attNode[0]) : "";
		attNode = records[i].getElementsByTagName("AttModifier");
		var attModifier = (attNode.length > 0) ? getAttachElementText(attNode[0]) : "";
		
		if (attType == "C")
			attachobj.CmtObjHeader[i] = new attachobj.CmtObjectHeader(usrType, attCreator, attModifier, hdrSize);	
		else if (attType == "U")
			attachobj.UrlObjHeader[i] = new attachobj.UrlObjectHeader(usrType, attScheme, hdrSize);

		//stats
		attachobj.nAttachRecords = 0;
		attachobj.nParentRecords = 0;
		if (attType == "C")
		{
			attachobj.CmtRecordCnt = 0;
			attachobj.nCmtHdrs = 0;
		}
		else
		{
			attachobj.UrlRecordCnt = 0;
			attachobj.nUrlHdrs = 0;
		}
		attachobj.nHeaders = 0;
		attNode = records[i].getElementsByTagName("RecStats");
		if (attNode.length > 0)
		{
			var attRecs = attNode[0].getElementsByTagName("AttRecs");
			var parRecs = attNode[0].getElementsByTagName("ParRecs");
			if (attType == "C")
				attachobj.CmtRecordCnt = attRecs.getAttribute("NbrCmts");
			else if (attType == "U")
				attachobj.UrlRecordCnt = attRecs.getAttribute("NbrUrls");
			attachobj.nAttachRecords = attRecs.getAttribute("NbrAttachments");
			attachobj.nParentRecords = parRecs.getAttribute("nRecords");
			attachobj.AttachStatistics[i] = new attachobj.StatObj(attRecs.getAttribute("NbrAttachments"), 
				attRecs.getAttribute("NbrCmts"), 
				attRecs.getAttribute("NbrUrls"), 
				parRecs.getAttribute("nRecords"));
		}
	}
	
	if (object.func)
	{
		attNode = xmlData.getElementsByTagName("ErrMsg");
		var errMsg = (attNode.length > 0) ? getAttachElementText(attNode[0]) : "";
		var fn = attachobj.parent[object.func];
		fn.apply(this, new Array("", "", errMsg, ""));
	}	
}

function getAttachElementText(node)
{
	var nodes = node.childNodes;
	var len = (nodes && nodes.length ? nodes.length : 0);
	var strRet = "";
	for (var i=0; i < len; i++)
	{
		//if (nodes[i].nodeType == 3 || nodes[i].nodeType == 4)
		//	strRet += nodes[i].nodeValue.replace(/\n/g,"").replace(/"/g,'\"').replace(/\\/g,'\\');
		if (nodes[i].nodeType == 3 || nodes[i].nodeType == 4)
			strRet += nodes[i].nodeValue.replace(/"/g,'\"').replace(/\\/g,'\\');	
	}
    return strRet;
}
