// Version: 8-)@(#)@(201111) 09.00.01.06.09
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/xml/xmlcommon.js,v 1.14.2.40.4.3 2012/05/02 20:34:18 brentd Exp $
var thisLocalUserBrowser = new Browser();
var userPhrases = new Object();
var deadURL = new Array();
var xmlVersion = "";
var strMSDOMDOCUMENT = "";
var strMSHTTPOBJECT = "";
var seaPhrasePath = "/lawson/xhrnet/xml/lang";
var AGSPath = "/servlet/ags";
//var AGSPath = "/cgi-lawson/ags.exe";
var DMEPath = "/cgi-lawson/dme.exe";
var servRE=/^\/servlet|^\/cgi\-lawson/;

function findEMSSObj(searchOpener, ref)
{
	if (!ref)
		ref = self;

	try
	{
		// is there a parent ?
		if (ref != ref.parent)
		{
			// does the parent have a emssObj ?
			if ((typeof(ref.parent.emssObj) != "undefined") && (ref.parent.emssObj != null))
			{
				// found a copy...
				return ref.parent;
			}
			else
			{
				// didn't find it... try higher
				return findEMSSObj(searchOpener, ref.parent);
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
			// does the opener have an emssObj variable ?
			if ((typeof(ref.opener.emssObj) != "undefined") && (ref.opener.emssObj != null))
			{
				// found a copy...
				return ref.opener;
			}
			else
			{
				// didn't find it... try higher on the opener
				return findEMSSObj(searchOpener, ref.opener);
			}
		}
	}
	catch (e)
	{}

	return null;
}

if(thisLocalUserBrowser.isIE) {

	xmlVersion=getMSXMLVersion();
	if(xmlVersion=="4.0" || xmlVersion=="3.0")
	{
		strMSDOMDOCUMENT="Msxml2.DOMDocument." + xmlVersion;
		strMSHTTPOBJECT="Msxml2.XMLHTTP." + xmlVersion;
	}
	else
	{
		strMSDOMDOCUMENT="Microsoft.XMLDOM";
		strMSHTTPOBJECT="Microsoft.XMLHTTP";
	}
}

function Browser() {

 	var ua, s, i;

  	this.isIE    = false;
  	this.isNS    = false;
  	this.version = null;

  	ua = navigator.userAgent;

  	s = "MSIE";
  	if ((i = ua.indexOf(s)) >= 0) {
    		this.isIE = true;
    		this.version = parseFloat(ua.substr(i + s.length));
    		return;
  	}

  	s = "Netscape6/";
  	if ((i = ua.indexOf(s)) >= 0) {
    		this.isNS = true;
    		this.version = parseFloat(ua.substr(i + s.length));
    		return;
  	}

  	// Treat any other "Gecko" browser as NS 6.1.
  	s = "Gecko";
  	if ((i = ua.indexOf(s)) >= 0) {
    		this.isNS = true;
    		this.version = 6.1;
    		return;
  	}
}

function getMSXMLVersion()
{
	try{
		var x=new ActiveXObject("Msxml2.DOMDocument.4.0");	
		return "4.0";
	}catch(e){
		try{
			var x=new ActiveXObject("Msxml2.DOMDocument.3.0");		
			return "3.0";
		}catch(e){
			return "";
		}
	}
}

function httpRequest(url,pkg,cntType,outType,uid,pwd)
{
	var oHTTP;
	var oResponse;
	var sndDom;
	var cmd="GET";
	var conType;
	var parser;	//Used in NS only

	if(typeof(cntType)=="undefined" || cntType=="" || cntType==null)
		cntType="text/xml";	//Default to XML if undefined
	if(typeof(outType)=="undefined" || outType=="" || outType==null)
		outType="text/xml";	//Default to XML if undefined
		
	if(thisLocalUserBrowser.isIE)
		oHTTP=new ActiveXObject(strMSHTTPOBJECT);
	else
	{
		oHTTP=new XMLHttpRequest();
		parser=new DOMParser();
	}

	switch(typeof(pkg))
	{
		case "string":
		{
			if(pkg=="")
			{
				pkg=null;
				break;
			}
			//Load into a DOM object, NS can not take a javascript string as a send parameter
			cmd="POST";
			if(thisLocalUserBrowser.isIE)
			{
				sndDom=new ActiveXObject(strMSDOMDOCUMENT);
				sndDom.async=false;
				sndDom.loadXML(pkg);
			}
			else
				sndDom=parser.parseFromString(pkg,"text/xml");
			pkg=sndDom;
			break;
		}
		case "object":
		{
			if(pkg==null) break;
			
			//Must be a DOM or some other stream type object
			cmd="POST";
			break;
		}
		default:
		{
			//No package, request is a get
			pkg=null;
			break;
		}
	}
	//logFile(true,"[OPEN]",cmd,url);
	
	if(uid && pwd)
		oHTTP.open(cmd,url,false,uid,pwd);
	else
		oHTTP.open(cmd,url,false);
		
	oHTTP.setRequestHeader("content-type",cntType);

	if(cmd=="POST" && thisLocalUserBrowser.isNS && servRE.test(url))
	{
		var authcookie=tvltGetUserElmSea("KEY");
		if(authcookie!="")
			oHTTP.setRequestHeader("Authorization",authcookie);
	}

	try {	
		//logFile(false,"[SEND]");
		oHTTP.send(pkg);
		//logFile(false,"[RECV]");
	}
	catch (e) {}
	
	// on error return http object so caller can inquire on status
	if(oHTTP.status>=400) return (oHTTP);
	
	//if content-type is undefined (not text/xml) from the middle tier app we must use responseText
	//once all middle tier apps set response header to text/xml we will be able to use responseXML solely	
	try {
		conType = oHTTP.getResponseHeader("content-type");
	}
	catch (e) {
		conType = null;
	}

	switch(conType)
	{
		case "text/xml":
		{
			oResponse=oHTTP.responseXML;
			break;
		}
		case "text/html":		//for now go to default
		case "text/plain":		//for now go to default
		default:
		{
			if(outType=="text/xml")
			{
				if(thisLocalUserBrowser.isIE)
				{
					oResponse=new ActiveXObject(strMSDOMDOCUMENT);
					oResponse.async=false;	
					oResponse.load(oHTTP.responseBody);	
					if(oResponse.parseError.errorCode!=0)
						oResponse=oHTTP;	
				}
				else
				{
					var re=new RegExp(/\n|\r|\t/g);
					oResponse=oHTTP.responseText;	
					if (url.indexOf(AGSPath)!=-1)
						oResponse=oResponse.replace(re,"");
					// Netscape 6 already performed the encoding; tell the parser to skip encoding.	
					if(oResponse.indexOf("encoding=")!=-1)
					{
						oResponse='<?xml version="1.0"'+oResponse.substring(oResponse.indexOf("?\>"));
					}
					oResponse=parser.parseFromString(oResponse,"text/xml");
				}
			}
			else
				oResponse=oHTTP.responseText;
			break;
		}
	}
	try{
		if(oResponse.documentElement.nodeName=="ERROR")
		{
			seaAlert(oResponse.documentElement.firstChild.firstChild.nodeValue + "\n\n" +oResponse.documentElement.firstChild.nextSibling.firstChild.nodeValue);
			return oHTTP;
		}
	
	}catch(e)
	{
	
	}
	return oResponse;
}

function seaPhraseObj(construct,lang)
{
	if(typeof(construct)=="object")
	{
		this.phraseDoc=construct.document
	}
	else if(typeof(construct)=="string")
	{
		//parm is a string that is a filepath
		try{
			if(lang != "") {
				if (construct.indexOf(seaPhrasePath+"/"+lang) != 0) {
					this.phraseDoc=httpRequest(seaPhrasePath+"/"+lang+"/"+construct);
				}
				else {
					this.phraseDoc=httpRequest(construct);
				}
			}
			else {
				if (construct.indexOf(seaPhrasePath+"/enus") != 0) {
					this.phraseDoc=httpRequest(seaPhrasePath+"/enus/"+construct);
				}
				else {
					this.phraseDoc=httpRequest(construct);
				}
			}
			//if error, try to just get the untranslated file
			if(this.phraseDoc.status && lang != "") {
				deadURL[construct+"_"+lang] = true;
				if (construct.indexOf(seaPhrasePath+"/enus") != 0) {
					this.phraseDoc=httpRequest(seaPhrasePath+"/enus/"+construct);
				}
				else {
					this.phraseDoc=httpRequest(construct);	
				}
			}
		}catch(e)
		{
			//if error, try to just get the untranslated file
			this.phraseDoc=httpRequest(seaPhrasePath+"/enus/"+construct);
		}
	}
	this.phraseHash=new Array();
	this.getXML = function()
	{
		if (document.implementation && document.implementation.createDocument)
		{
			var y=new XMLSerializer();
			var str=y.serializeToString(this.phraseDoc);
			return str;
		}
		else
			return this.phraseDoc.xml;
	}
	this.getPhrase = function(ID)
	{
		var x;
		var fromHash = false;
		try {
			if(document.implementation && document.implementation.createDocument)
			{
				x=this.phraseDoc.getElementById(ID);
			
				if(!x)
				{
					fromHash = true;
					if(!this.phraseHash.length) {
						var msgs=this.phraseDoc.getElementsByTagName("Translate");
						msgs=msgs[0].childNodes;
						for(var i=0;i<msgs.length;i++)
						{
						/*
							if(msgs[i].nodeType==1 && msgs[i].getAttribute("id")==ID)
							{
								x=msgs[i];
								break;
							}
						*/
							if(msgs[i].nodeType==1)
							{
								this.phraseHash[msgs[i].getAttribute("id")] = msgs[i].firstChild.nodeValue;
							}
						}	
					}
					x = this.phraseHash[ID];
				}
			}
			else
			{
				x=this.phraseDoc.selectSingleNode("LAWXML/Translate/*[@id='"+ID+"']");
			}
			if(x) {
				if(fromHash) {
					return x;
				}
				else {
					return x.firstChild.nodeValue;
				}
			}
			else {
				return "";
			}
		}
		catch(e) {
			return ID;
		}
	}	
}

function seaPhraseObjGetXML()
{
	if (document.implementation && document.implementation.createDocument)
	{
		var y=new XMLSerializer();
		var str=y.serializeToString(this.phraseDoc);
		return str;
	}
	else
		return this.phraseDoc.xml;
}

function seaPhraseObjGetPhrase(ID)
{
	var x;
	var fromHash = false;
	try {
		if(document.implementation && document.implementation.createDocument)
		{
			x=this.phraseDoc.getElementById(ID);
			
			if(!x)
			{
				fromHash = true;
				if(!this.phraseHash.length) {
					var msgs=this.phraseDoc.getElementsByTagName("Translate");
					msgs=msgs[0].childNodes;
					var len=msgs.length;
					for(var i=0;i<len;i++)
					{
					/*
						if(msgs[i].nodeType==1 && msgs[i].getAttribute("id")==ID)
						{
							x=msgs[i];
							break;
						}
					*/
						if(msgs[i].nodeType==1)
						{
							this.phraseHash[msgs[i].getAttribute("id")] = msgs[i].firstChild.nodeValue;
						}
					}	
				}
				x = this.phraseHash[ID];
			}
		}
		else
		{
			x=this.phraseDoc.selectSingleNode("LAWXML/Translate/*[@id='"+ID+"']");
		}
		if(x) {
			if(fromHash) {
				return x;
			}
			else {
				return x.firstChild.nodeValue;
			}
		}
		else {
			return "";
		}
	}
	catch(e) {
		return ID;
	}
}

function fileExists(url,filetype,outtype) {

    	// returns true if file was found
	if(typeof(filetype)=="undefined" || filetype=="" || filetype==null)
    		filetype = "text/xml";	// default to XML if undefined
    	if(typeof(outtype)=="undefined" || outtype=="" || outtype==null)
		outtype = "text/xml";	// default to XML if undefined
	var tmpFile = httpRequest(url,null,filetype,outtype);	
    	return(!tmpFile.status || tmpFile.status == 200);
}

function loadSeaMsgsXml(fileNm,Lang)
{	
    	var msgDOM;
	
    	if(fileNm=="") return null;

    	msgDOM=new seaPhraseObj(fileNm,Lang);

    	if(msgDOM.phraseDoc.status) {
    		return null;
	}
	
	return msgDOM;
}

function getEnglishSeaPhraseXML(serviceCenter)
{
	var ref = self;
	while (ref != top && (typeof(ref.parent.lawsonPortal) == "undefined" || typeof(ref.parent.lawsonPortal) == "unknown")) {
		ref = ref.parent;
	}	
	if (typeof(ref.lawsonPortal) == "undefined" || typeof(ref.lawsonPortal) == "unknown") {
		ref = self;
	}
	
	try {
		var xml;
		
        	switch(serviceCenter.toLowerCase()) {
        		
        		case "cm":
				if(!ref.engCMMSGXML || typef(ref.engCMMSGXML.phraseDoc) == "undefined" || typef(ref.engCMMSGXML.phraseDoc) == "unknown") {
					xml = loadSeaMsgsXml("cmmsgs.xml");
				   	engCMMSGXML = xml;
					ref.engCMMSGXML = xml;
				}
				else {
					xml = ref.engCMMSGXML;
				 	// If we are storing the phrase object in the ref window, re-set the object functions,
				 	// as on a reload of this file the script references are lost.
					if(!opener && self != ref)
					{
						ref.engCMMSGXML.getXML = seaPhraseObjGetXML;
						ref.engCMMSGXML.getPhrase = seaPhraseObjGetPhrase;
					}				
				}
				break;
        		
        		case "cr":
				if(!ref.engCRMSGXML || typeof(ref.engCRMSGXML.phraseDoc) == "undefined" || typeof(ref.engCRMSGXML.phraseDoc) == "unknown") {
					xml = loadSeaMsgsXml("crmsgs.xml");
					engCRMSGXML = xml;
					ref.engCRMSGXML = xml;
				}
				else {
					xml = ref.engCRMSGXML;
					// If we are storing the phrase object in the ref window, re-set the object functions,
					// as on a reload of this file the script references are lost.
					if(!opener && self != ref)
					{
						ref.engCRMSGXML.getXML = seaPhraseObjGetXML;
						ref.engCRMSGXML.getPhrase = seaPhraseObjGetPhrase;
					}
				}
				break;
            		
				case "ess":
				if(!ref.engESSMSGXML || typeof(ref.engESSMSGXML.phraseDoc) == "undefined" || typeof(ref.engESSMSGXML.phraseDoc) == "unknown") {
					xml = loadSeaMsgsXml("essmsgs.xml");
					engESSMSGXML = xml;
					ref.engESSMSGXML = xml;
				}
				else {
				 	xml = ref.engESSMSGXML;
				 	// If we are storing the phrase object in the ref window, re-set the object functions,
				 	// as on a reload of this file the script references are lost.
					if(!opener && self != ref)
					{
						ref.engESSMSGXML.getXML = seaPhraseObjGetXML;
						ref.engESSMSGXML.getPhrase = seaPhraseObjGetPhrase;
					}
				}
				break;

				case "ben":
				if(!ref.engBENMSGXML || typeof(ref.engBENMSGXML.phraseDoc) == "undefined" || typeof(ref.engBENMSGXML.phraseDoc) == "unknown") {
					xml = loadSeaMsgsXml("benmsgs.xml");
					engBENMSGXML = xml;
					ref.engBENMSGXML = xml;
				}
				else {
					xml = ref.engBENMSGXML;
				 	// If we are storing the phrase object in the ref window, re-set the object functions,
				 	// as on a reload of this file the script references are lost.
					if(!opener && self != ref)
					{
						ref.engBENMSGXML.getXML = seaPhraseObjGetXML;
						ref.engBENMSGXML.getPhrase = seaPhraseObjGetPhrase;
					}				
				}
				break;

 				case "dd":
				if(!ref.engDDMSGXML || typeof(ref.engDDMSGXML.phraseDoc) == "undefined" || typeof(ref.engDDMSGXML.phraseDoc) == "unknown") {
					xml = loadSeaMsgsXml("ddmsgs.xml");
					engDDMSGXML = xml;
					ref.engDDMSGXML = xml;
				}
				else {
					xml = ref.engDDMSGXML;
				 	// If we are storing the phrase object in the ref window, re-set the object functions,
				 	// as on a reload of this file the script references are lost.
					if(!opener && self != ref)
					{
						ref.engDDMSGXML.getXML = seaPhraseObjGetXML;
						ref.engDDMSGXML.getPhrase = seaPhraseObjGetPhrase;
					}								
				}
				break;
            		
				case "sea":
				if(!ref.engSEAMSGXML || typeof(ref.engSEAMSGXML.phraseDoc) == "undefined" || typeof(ref.engSEAMSGXML.phraseDoc) == "unknown") {
					xml = loadSeaMsgsXml("seamsgs.xml");
					engSEAMSGXML = xml;
					ref.engSEAMSGXML = xml;
				}
				else {
					xml = ref.engSEAMSGXML;
				 	// If we are storing the phrase object in the ref window, re-set the object functions,
				 	// as on a reload of this file the script references are lost.
					if(!opener && self != ref)
					{
						ref.engSEAMSGXML.getXML = seaPhraseObjGetXML;
						ref.engSEAMSGXML.getPhrase = seaPhraseObjGetPhrase;
					}								
				}
				break;

				case "te":
				if(!ref.engTEMSGXML || typeof(ref.engTEMSGXML.phraseDoc) == "undefined" || typeof(ref.engTEMSGXML.phraseDoc) == "unknown") {
					xml = loadSeaMsgsXml("temsgs.xml");
					engTEMSGXML = xml;
					ref.engTEMSGXML = xml;
				}
				else {
					xml = ref.engTEMSGXML;
				 	// If we are storing the phrase object in the ref window, re-set the object functions,
				 	// as on a reload of this file the script references are lost.
					if(!opener && self != ref)
					{
						ref.engTEMSGXML.getXML = seaPhraseObjGetXML;
						ref.engTEMSGXML.getPhrase = seaPhraseObjGetPhrase;
					}								
				}
				break;
            
				default: break;
        	}
	} catch(e) { 
		xml = null;
	}
	finally {
		return xml;
	}
}

function getUserLanguage()
{
	try {

	if ((parent && parent.authUser && typeof(parent.authUser.prodline) != "undefined" && typeof(parent.authUser.prodline) != "unknown")
	|| (top && top.authUser && typeof(top.authUser.prodline) != "undefined" && typeof(top.authUser.prodline) != "unknown") 
	|| (opener && opener.top && opener.top.authUser && typeof(opener.top.authUser.prodline) != "undefined" && typeof(opener.top.authUser.prodline) != "unknown"))
	{
	      	if (parent && parent.authUser && typeof(parent.authUser.prodline) != "undefined" && typeof(parent.authUser.prodline) != "unknown")
	  	{
	  		authUser = parent.authUser;
	       	}
	       	else if (top && top.authUser && typeof(top.authUser.prodline) != "undefined" && typeof(top.authUser.prodline) != "unknown")
	  	{
	  		authUser = top.authUser;
	       	}
	       	else if (opener && opener.top && opener.top.authUser && typeof(opener.top.authUser.prodline) != "undefined" && typeof(opener.top.authUser.prodline) != "unknown")
	  	{
	          	authUser = opener.top.authUser;
	  	}
  	}

	return ((authUser && typeof(authUser.language)!="undefined")?authUser.language:tvltGetUserElmSea("LANGUAGE"));
	}
	catch(e) {
	 	try {
	 		return tvltGetUserElmSea("LANGUAGE");
	  	} catch(e) {
		 	return "";
		}
	}
}

function getSeaPhraseXML(serviceCenter)
{
	var ref = top;
	while (ref != top && (typeof(ref.parent.lawsonPortal) == "undefined" || typeof(ref.parent.lawsonPortal) == "unknown")) {
		ref = ref.parent;
	}	
	if (typeof(ref.lawsonPortal) == "undefined" || typeof(ref.lawsonPortal) == "unknown") {
		ref = self;
	}

	try {
		var userLang = getUserLanguage().replace(" ","_").toLowerCase(); // user's language preference in lowercase
		var xml;
		
        	switch(serviceCenter.toLowerCase()) 
        	{	
        		case "cm":
				if(!ref.objCMMSGXML || typeof(ref.objCMMSGXML.phraseDoc) == "undefined" || typeof(ref.objCMMSGXML.phraseDoc) == "unknown") {
					xml = loadSeaMsgsXml("cmmsgs.xml",userLang);
				   	objCMMSGXML = xml;
					ref.objCMMSGXML = xml;
				}
				else {
					xml = ref.objCMMSGXML;
				 	// If we are storing the phrase object in the ref window, re-set the object functions,
				 	// as on a reload of this file the script references are lost.
					if(!opener && self != ref)
					{
						ref.objCMMSGXML.getXML = seaPhraseObjGetXML;
						ref.objCMMSGXML.getPhrase = seaPhraseObjGetPhrase;
					}				
				}
				break;
        		
        		case "cr":
				if(!ref.objCRMSGXML || typeof(ref.objCRMSGXML.phraseDoc) == "undefined" || typeof(ref.objCRMSGXML.phraseDoc) == "unknown") {
					xml = loadSeaMsgsXml("crmsgs.xml",userLang);
					objCRMSGXML = xml;
					ref.objCRMSGXML = xml;
				}
				else {
					xml = ref.objCRMSGXML;
					// If we are storing the phrase object in the ref window, re-set the object functions,
					// as on a reload of this file the script references are lost.
					if(!opener && self != ref)
					{
						ref.objCRMSGXML.getXML = seaPhraseObjGetXML;
						ref.objCRMSGXML.getPhrase = seaPhraseObjGetPhrase;
					}
				}
				break;
            		
				case "ess":
				if(!ref.objESSMSGXML || typeof(ref.objESSMSGXML.phraseDoc) == "undefined" || typeof(ref.objESSMSGXML.phraseDoc) == "unknown") {	
					xml = loadSeaMsgsXml("essmsgs.xml",userLang);
					objESSMSGXML = xml;	
					ref.objESSMSGXML = xml;
				}
				else {
				 	xml = ref.objESSMSGXML;
				 	// If we are storing the phrase object in the ref window, re-set the object functions,
				 	// as on a reload of this file the script references are lost.
					if(!opener && self != ref)
					{
						ref.objESSMSGXML.getXML = seaPhraseObjGetXML;
						ref.objESSMSGXML.getPhrase = seaPhraseObjGetPhrase;
					}
				}
				break;

				case "ben":
				if(!ref.objBENMSGXML || typeof(ref.objBENMSGXML.phraseDoc) == "undefined" || typeof(ref.objBENMSGXML.phraseDoc) == "unknown") {
					xml = loadSeaMsgsXml("benmsgs.xml",userLang);
					objBENMSGXML = xml;
					ref.objBENMSGXML = xml;
				}
				else {
					xml = ref.objBENMSGXML;
				 	// If we are storing the phrase object in the ref window, re-set the object functions,
				 	// as on a reload of this file the script references are lost.
					if(!opener && self != ref)
					{
						ref.objBENMSGXML.getXML = seaPhraseObjGetXML;
						ref.objBENMSGXML.getPhrase = seaPhraseObjGetPhrase;
					}
				}
				break;

				case "dd":
				if(!ref.objDDMSGXML || typeof(ref.objDDMSGXML.phraseDoc) == "undefined" || typeof(ref.objDDMSGXML.phraseDoc) == "unknown") {
					xml = loadSeaMsgsXml("ddmsgs.xml",userLang);
					objDDMSGXML = xml;
					ref.objDDMSGXML = xml;
				}
				else {
					xml = ref.objDDMSGXML;
				 	// If we are storing the phrase object in the top window, re-set the object functions,
				 	// as on a reload of this file the script references are lost.
					if(!opener && self != ref)
					{
						ref.objDDMSGXML.getXML = seaPhraseObjGetXML;
						ref.objDDMSGXML.getPhrase = seaPhraseObjGetPhrase;
					}								
				}
				break;
            		
				case "sea":
				if(!ref.objSEAMSGXML || typeof(ref.objSEAMSGXML.phraseDoc) == "undefined" || typeof(ref.objSEAMSGXML.phraseDoc) == "unknown") {
					xml = loadSeaMsgsXml("seamsgs.xml",userLang);
					objSEAMSGXML = xml;
					ref.objSEAMSGXML = xml;
				}
				else {
					xml = ref.objSEAMSGXML;
				 	// If we are storing the phrase object in the top window, re-set the object functions,
				 	// as on a reload of this file the script references are lost.
					if(!opener && self != ref)
					{
						ref.objSEAMSGXML.getXML = seaPhraseObjGetXML;
						ref.objSEAMSGXML.getPhrase = seaPhraseObjGetPhrase;
					}								
				}
				break;

				case "te":
				if(!ref.objTEMSGXML || typeof(ref.objTEMSGXML.phraseDoc) == "undefined" || typeof(ref.objTEMSGXML.phraseDoc) == "unknown") {
					xml = loadSeaMsgsXml("temsgs.xml",userLang);
					objTEMSGXML = xml;
					top.objTEMSGXML = xml;
				}
				else {
					xml = ref.objTEMSGXML;
				 	// If we are storing the phrase object in the top window, re-set the object functions,
				 	// as on a reload of this file the script references are lost.
					if(!opener && self != ref)
					{
						ref.objTEMSGXML.getXML = seaPhraseObjGetXML;
						ref.objTEMSGXML.getPhrase = seaPhraseObjGetPhrase;
					}								
				}
				break;
                	
				default: break;
        	}
	} catch(e) { 
		xml = null;
	}
	finally {
		return xml;
	}
}

function getSeaPhrase(id, serviceCenter)
{
	var re=new RegExp(/\n|\r|\t/g);
	var seaphrase = "";
	if(typeof(serviceCenter) != "undefined") {
		try {
			var seamsgs = getSeaPhraseXML(serviceCenter.toLowerCase());
			if (seamsgs) {
				seaphrase = seamsgs.getPhrase(id);
			}
			if (!seaphrase && getUserLanguage())
			{
				seamsgs = getEnglishSeaPhraseXML(serviceCenter.toLowerCase());	
				seaphrase = seamsgs.getPhrase(id);
			}
			if (!seaphrase) seaphrase = "";
		}
		catch(e) {
			seaphrase = "";
		}
	}
	seaphrase = seaphrase.replace(re," ");
	return seaphrase;
}

function getUserProfileAttribute(profileXML, attrStr)
{
	var result = "";
	if (!profileXML)
	{	
		return result;
	}
	
	var tmpNode = profileXML.getElementsByTagName(attrStr)[0];
	if (tmpNode && tmpNode.hasChildNodes())
	{
		result = tmpNode.childNodes[0].nodeValue;
	}
	else
	{
		var attrNodes = profileXML.getElementsByTagName("ATTR");
		var attrName;
		for (var i=0; i<attrNodes.length; i++)
		{
			attrName = attrNodes[i].getAttribute("name");	
			if (attrName.toLowerCase() == attrStr.toLowerCase())
			{
				result = attrNodes[i].getAttribute("value");	
				break;
			}
		}
	}
	
	return result;
}

// Returns the value of a user environment/webuser variable.
// Example of use:
// 	var pdl = tvltGetUserElmSea("PRODLINE");
//-----------------------------------------------------------------------------
function tvltGetUserElmSea(strElement)
{
	var result = "";
	var tmpNode;
	var page=self; // window that contains the Profile and Translate servlet DOM objects
	
	if (typeof(top.lawsonPortal) == "undefined" || typeof(top.lawsonPortal) == "unknown")
	{	
		//PT 138940
		try {
			if (top.opener && ((typeof(top.opener.top.lawsonPortal) != "undefined" && typeof(top.opener.top.lawsonPortal) != "unknown") || typeof(top.opener.top.objUSERENVXML) != "undefined"))
			{
				page=top.opener.top;
			}
		} catch(e) {}	
	}
	else
	{
		page = top;
	}
	
	if (page != self && typeof(page.lawsonPortal) != "undefined" && typeof(page.lawsonPortal) != "unknown")
	{
		return page.lawsonPortal.getUserVariable(strElement);
	}
	else if(typeof(page.objUSERENVXML) == "undefined")
	{
		var dt=new Date();
		var t1 = Date.UTC(dt.getYear(), dt.getMonth(), dt.getDate(),dt.getHours(),dt.getMinutes(),dt.getSeconds(),dt.getMilliseconds());    //Get milliseconds since 1/1/1970.
		page.objUSERENVXML = httpRequest("/servlet/Profile?path=/lawson/portal&t="+t1);
	}
	result = getUserProfileAttribute(page.objUSERENVXML, strElement);
	return result;
}

function httpRequestSea(url, msg, conType, outType)
{
    var ds = null;

	if (typeof(msg)=="string")
   		var oResponse = httpRequest(url+"?"+msg,null,conType,outType);
	else
   		var oResponse = httpRequest(url,msg,conType,outType);
   	
   	if (oResponse.status) 
   		return null;

	var isIE=(window.ActiveXObject)?true:false
    if (isIE) 
    	ds = new DataStorage(oResponse.xml);
	else 
    	ds = new DataStorage(oResponse);
    
    if (typeof(ds.document)=="object")
    	return ds.document;
    else
    	return null;
}

// begin of data storage object code
DataStorage.prototype.setElementValue=function(nodeName,value,index)
{
	var nodeList;
	var oNode;
	var txtNode;

	if(typeof(nodeName)=="undefined" || nodeName=="") return null;

	nodeList=this.document.getElementsByTagName(nodeName);
	if(typeof(index)=="undefined")
		oNode=nodeList[0];
	else
		oNode=nodeList[index];

	if(!oNode) return null;

    var aNode=oNode
	if(oNode.hasChildNodes())
	{
		oNode=oNode.childNodes[0];
		if(oNode.nodeType==3 || oNode.nodeType==4)		 //Validate Node type Text or CData
		 	oNode.nodeValue=value;
		else
			aNode=oNode.appendChild(this.document.createTextNode(value));
	}
	else
    	aNode=oNode.appendChild(this.document.createTextNode(value));
    return (aNode ? aNode : null);
}

DataStorage.prototype.getElementValue=function(nodeName,index)
{
	var nodeList;
	var oNode;

	nodeList=this.document.getElementsByTagName(nodeName);
	if(typeof(index)=="undefined")
		oNode=nodeList[0];
	else
		oNode=nodeList[index];

	if(!oNode) return "";

	if(oNode.hasChildNodes())
	{
		oNode=oNode.childNodes[0];
		if(oNode.nodeType==3 || oNode.nodeType==4)		 //Validate Node type Text or CData
			return oNode.nodeValue;
	}
    return ("");
}

DataStorage.prototype.getAttributeById=function(nodeName,idName,idVal,attrName)
{
	var nodeList;
	var attr="";

	nodeList=this.document.getElementsByTagName(nodeName);
	if(!nodeList) return attr;

	for (var i = 0; i < nodeList.length; i++)
	{
		if (!nodeList[i].getAttribute(idName)) continue;
		if (nodeList[i].getAttribute(idName)!=idVal) continue;
		if (!nodeList[i].getAttribute(attrName)) continue;
		attr=nodeList[i].getAttribute(attrName);
		break;
	}
	return attr;
}

DataStorage.prototype.getNodeByAttributeId=function(nodeName,attrName,attrVal)
{
	var nod=null
	var nodeList=this.document.getElementsByTagName(nodeName);
	if(!nodeList) return null;

	for (var i = 0; i < nodeList.length; i++)
	{
		if (!nodeList[i].getAttribute(attrName)) continue;
		if (nodeList[i].getAttribute(attrName)!=attrVal) continue;
		nod=nodeList[i];
		break;
	}
	return nod;
}

DataStorage.prototype.getNodeByName=function(nodeName,index)
{
	var nodeList=this.document.getElementsByTagName(nodeName);
	if(!nodeList) return null;

    if (typeof(index) == "undefined") index=0
    if (index+1 > nodeList.length) return (null);

	return nodeList[index];
}

DataStorage.prototype.getDataString=function(bFormat)
{
	if (typeof(bFormat) != "boolean") bFormat=false

	if (window.ActiveXObject)
		return(this.document.xml)

	var ser=new XMLSerializer();
	var str=ser.serializeToString(this.document)
	if (bFormat)
	{
		var re=new RegExp("(<[^\/].*?>)(?:[^\n])")
		while(str.match(re))
			str=str.replace(RegExp.$1,RegExp.$1 + "\n")
	}
	return (str);
}

function DataStorage(construct)
{
	var parser;
	var typ=typeof(construct);
	var isIE=(window.ActiveXObject)?true:false;

	switch(typ)
	{
	case "string":
		if(isIE)
		{
			this.document=new ActiveXObject(strMSDOMDOCUMENT);
			this.document.async=false;
			this.document.loadXML(construct);
		}
		else
		{
			parser=new DOMParser();
			this.document=parser.parseFromString(construct,"text/xml");
		}
		break;
	case "object":
		if(isIE)
			this.document=construct;
		else
		{
			if(construct.constructor==Array)
				this.document=document.implementation.createDocument(construct[0],construct[1],construct[2]);
			else
			this.document=construct;
		}
		break;
	default:
		this.document=null;
		break;
	}
}
// end of data storage object code

function getBookmarkNode(lawsonNm)
{
	var bookmarks;
	var page=self; // window that contains the Profile and Translate servlet DOM objects
	
	if (typeof(top.lawsonPortal) == "undefined" || typeof(top.lawsonPortal) == "unknown")
	{	
		if (top.opener && ((typeof(top.opener.top.lawsonPortal) != "undefined" && typeof(top.opener.top.lawsonPortal) != "unknown") || typeof(top.opener.top.objUSERENVXML) != "undefined"))
		{
			page=top.opener.top;
		}
	}
	else
	{
		page = top;
	}
	
	if (page != self && typeof(page.lawsonPortal) != "undefined" && typeof(page.lawsonPortal) != "unknown")
	{
		tmpNode = page.lawsonPortal.profile.getElementsByTagName("BOOKMARKS")[0];
		bookmarks = tmpNode.getElementsByTagName("BOOKMARK");
		for (var i=0; i<bookmarks.length; i++) {
			if (bookmarks[i].getAttribute("lawnm") == lawsonNm) {
				return (bookmarks[i]);
			}
		}
		return (new Array());		
	}
	else if(typeof(page.objUSERENVXML) == "undefined")
	{
		var dt=new Date();
		var t1 = Date.UTC(dt.getYear(), dt.getMonth(), dt.getDate(),dt.getHours(),dt.getMinutes(),dt.getSeconds(),dt.getMilliseconds());    //Get milliseconds since 1/1/1970.
		page.objUSERENVXML = httpRequest("/servlet/Profile?path=/lawson/portal&t="+t1);
	}
	tmpNode = page.objUSERENVXML.getElementsByTagName("BOOKMARKS")[0];
	bookmarks = tmpNode.getElementsByTagName("BOOKMARK");
	for (var i=0; i<bookmarks.length; i++) {
		if (bookmarks[i].getAttribute("lawnm") == lawsonNm) {
			return (bookmarks[i]);
		}
	}
	return (new Array());
}

/**************************** ENWISEN INTEGRATION **************************/

//---------Global Variables----------------------------------------------------
var emssObj = null;
var XMLDocs = "/lawson/xhrnet/xml/";
var XMLConfigDocs = XMLDocs + "config/";
var EnwisenDocs = XMLDocs + "enwisen/";
var enwisenWnd = null;
var emssObjInstance = null;

//-----------------------------------------------------------------------------
function getVarFromString(varName, str)
{
	var url = str;
	var ptr = url.indexOf(varName + "=");
	var ptr2;
	var val1 = "";
	
	if (ptr != -1)
	{
		var val1 = url.substring(ptr + varName.length + 1, url.length);
		var ptr2;
	
		if ((ptr2 = val1.indexOf("&")) != -1)
		{
			if (ptr2 == -1)
				ptr2 = val1.length;
			val1 = val1.substring(0, ptr2);
		}
	}
	return val1;
}

/*
		Sample Usage #1. Open a pop-up window to an Enwisen page containing an alias or code in this config file.
		Note: a <page> node with id="NAVIGATOR_HOME" must be defined below.
			     
		if (isEnwisenEnabled())
		{
			openEnwisenWindow("id=NAVIGATOR_HOME");
		}

		Sample Usage #2. Open a pop-up window to an Enwisen page with a pre-defined alias in the Enwisen system.
		Note: this will open a pop-up window containing the Enwisen home page.
			     
		if (isEnwisenEnabled())
		{
			openEnwisenWindow("alias=navigator");
		}
				
		Sample Usage #3. Load the current window document with an Enwisen page that is configured in this config file.
		Note: a <page> node with id="NAVIGATOR_HOME" must be defined below.
			     
		if (isEnwisenEnabled())
		{
			var enwisenUrl = getEnwisenPageUrl("id=NAVIGATOR_HOME");
			if (enwisenUrl != null)
				self.location = enwisenUrl;	
		}
			     	
		Sample Usage #4. Dynamic hyperlink creation to a named Enwisen page.
		Note: a page exists in the Enwisen system with the alias "uynmedical" which will be directly linked to.
			     
		if (isEnwisenEnabled())
		{
			var strHtml = '<ul>';
			strHtml += '<li style="padding:2px">' + getEnwisenLink("alias=uynmedical");		
			var strHtml = '</ul>';
			window.document.write(strHtml);
		}
*/

/**************************** ENWISEN INTEGRATION METHODS **************************/
/*
 * Use these functions in your Javascript to access Enwisen pages:
 *
 * Use the isEnwisenEnabled() method to check if Enwisen is enabled for the employee's company.
 *
 * These methods look up subscription pages defined in the emss_config.xml config file or on the Enwisen server:
 *		openEnwisenWindow():		open the page in a pop-up window
 *		getEnwisenPageUrl():		get the full URL to Enwisen for the page
 *		getEnwisenLink():		construct a hyperlink to the Enwisen page
 */

//-----------------------------------------------------------------------------
// Returns a boolean value (true or false) based on the "enable_enwisen" configuration 
// setting for the user's company in the emss_config.xml configuration file.  
// Should the user be able to access Enwisen?
//
function isEnwisenEnabled()
{
	if (emssObj == null)
		emssObj = new EMSSShell();

	var companyNbr = null;
	try 
	{
		companyNbr = authUser.company;	
	} 
	catch(e) 
	{
		companyNbr = null;
	}

	// if emssObj cannot be configured, don't continue
	if (!emssObj || !emssObj.configure(companyNbr))
		return false;
	
	try
	{
		return emssObj.enableEnwisen;
	}
	catch(e)
	{
		return false;
	}
}

//-----------------------------------------------------------------------------
// Constructs a URL to an Enwisen page with the specified page parameters for
// the user's company.
// Inputs: 
//	pageParams: string of the form "id=<ID>", "name=<NAME>", "alias=<ALIAS>", or "code=<CODE>",
// 	where 	<ID> = <page> id from /lawson/xhrnet/xml/config/emss_config.xml to an Enwisen page,
//		<NAME> = pre-defined Enwisen page name
//		<ALIAS> = pre-defined Enwisen alias to a page
//		<CODE> = pre-defined numeric subscription code to a page
//
function getEnwisenPageUrl(pageParams)
{
	var id = "";
	var code = "";
	var name = "";
	var alias = "";
	var page = null;
	
	if (pageParams)
	{
		id = getVarFromString("id", pageParams); 
		code = getVarFromString("code", pageParams);
		name = getVarFromString("name", pageParams);
		alias = getVarFromString("alias", pageParams);
	}

	// if an id has been set, look up the <page> node in the emss_config.xml file
	if (id != "")
	{
		page = getEnwisenPageNode(id);
		
		if (page == null)
		{
			if (emssObj.debugEnwisen)
			{
				alert("ERROR: Enwisen page not found in emss_config.xml for id: " + id + " from xmlcommon.js in getEnwisenPageUrl().");
			}
			return null;		
		}		
		
		code = page.getAttribute("code");
		name = page.getAttribute("name");
		alias = page.getAttribute("alias");	
	}
	
	if ((!code && !name && !alias) || emssObj.enwisenHostUrl == null)
	{
		alert("ERROR: Invalid Enwisen URL from xmlcommon.js in getEnwisenPageUrl().  The enwisen_host_url must be defined in the emss_config.xml file and an id, code, name, or alias page subscription parameter must be specified.\n\n"
			+ "enwisen_host_url: " + emssObj.enwisenHostUrl + "\n"
			+ "id: " + id + "\n"
			+ "code: " + code + "\n"
			+ "name: " + name + "\n"
			+ "alias: " + alias + "\n");
		return null;
	}
	
	var failUrl = self.location.protocol + "//" + self.location.host + EnwisenDocs + "enwisenPost.htm";
	
	var enwisenUrl = emssObj.enwisenHostUrl + "?";
	
	// if an alias is defined, use that, otherwise use the name, or code, in that order
	if (alias)
	{
		// handle the case where the alias has not been encoded
		alias = unescape(alias);		
		enwisenUrl += "alias=" + escape(alias,1);	
	}
	else if (name)
	{
		// handle the case where the name has not been encoded
		name = unescape(name);		
		enwisenUrl += "name=" + escape(name,1);
	}
	else if (code)
	{
		enwisenUrl += "code=" + code;
	}
	
	if (emssObj.enwisenHeader)
	{
		enwisenUrl += "&header=on";
	}	
	
	enwisenUrl += "&failurl=" + failUrl;
	
	if (emssObj.debugEnwisen)
	{
		var alertStr = "ENWISEN PAGE URL\n\n"
			+ "id = " + id + "\n"
			+ "code = " + code + "\n"
			+ "name = " + name + "\n"
			+ "alias = " + alias + "\n"
			+ "header = " + ((emssObj.enwisenHeader) ? "on" : "off") + "\n"
			+ "URL = " + enwisenUrl + "\n";
		alert(alertStr);		
	}	
		
	return (enwisenUrl);
}

//-----------------------------------------------------------------------------
// Constructs a hyperlink that opens a pop-up window to an Enwisen page when clicked.
// Inputs: 
//	pageParams: string of the form "id=<ID>", "name=<NAME>", "alias=<ALIAS>", or "code=<CODE>",
// 	where 	<ID> = <page> id from /lawson/xhrnet/xml/config/emss_config.xml to an Enwisen page,
//		<NAME> = pre-defined Enwisen page name
//		<ALIAS> = pre-defined Enwisen alias to a page
//		<CODE> = pre-defined numeric subscription code to a page
//
//	desc: string description that should display in the hyperlink
//
function getEnwisenLink(pageParams, desc)
{
	if (pageParams != null)
	{
		if (!enwisenParamExists(pageParams))
			return null;				
	
		var enwisenLink = '<a href="" onclick="openEnwisenWindow(\''+pageParams+'\');return false">';
		if (desc)
			enwisenLink += desc;
		else
		{
			var id = getVarFromString("id", pageParams); 
			var code = getVarFromString("code", pageParams);
			var name = getVarFromString("name", pageParams);
			var alias = getVarFromString("alias", pageParams);
		
			// if an id has been set, look up the <page> node in the emss_config.xml file
			if (id)
			{
				var page = getEnwisenPageNode(id);
				if (page != null)
				{		
					code = page.getAttribute("code");
					name = page.getAttribute("name");
					alias = page.getAttribute("alias");
				}		
			}
			
			enwisenLink += "HR Service Delivery: ";
			if (alias)
				enwisenLink += unescape(alias);
			else if (name)
				enwisenLink += unescape(name);
			else if (code)
				enwisenLink += code;
			else if (id)
				enwisenList += id;
		}
		enwisenLink += '</a>';
		
		if (emssObj.debugEnwisen)
		{
			var alertStr = "ENWISEN PAGE LINK\n\n"
				+ "id = " + id + "\n"
				+ "code = " + code + "\n"
				+ "name = " + name + "\n"
				+ "alias = " + alias + "\n"
				+ "link description = " + desc + "\n"
				+ "link HTML = " + enwisenLink + "\n";
			alert(alertStr);		
		}		
		
		return enwisenLink;
	}
	else
	{
		alert("ERROR: Missing Enwisen page parameters for page link from getEnwisenLink() in xmlcommon.js.\n\n"
			+ "page parameters: " + pageParams + "\n");		
	}

	return null;
}

//-----------------------------------------------------------------------------
// Opens a pop-up window to an Enwisen page.
// Inputs: 
//	pageParams: string of the form "id=<ID>", "name=<NAME>", "alias=<ALIAS>", or "code=<CODE>",
// 	where 	<ID> = <page> id from /lawson/xhrnet/xml/config/emss_config.xml to an Enwisen page,
//		<NAME> = pre-defined Enwisen page name
//		<ALIAS> = pre-defined Enwisen alias to a page
//		<CODE> = pre-defined numeric subscription code to a page
//
function openEnwisenWindow(pageParams)
{
	if (isEnwisenEnabled())
	{		
		var enwisenUrl = getEnwisenPageUrl(pageParams);
		if (enwisenUrl != null)
		{
			enwisenWnd = window.open(enwisenUrl, "EnwisenWindow", "left="+(parseInt(screen.width/2,10)-400)+",top="+(parseInt(screen.height/2,10)-300)+",toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600");
			try { enwisenWnd.focus(); } catch(e) {}
			return true;
		}
	}
	return null;
}

//-----------------------------------------------------------------------------
// Verifies that the page parameter string contains an Enwisen page id, code, name, or alias.
// Inputs: 
//	pageParams: string of the form "id=<ID>", "name=<NAME>", "alias=<ALIAS>", or "code=<CODE>",
// 	where 	<ID> = <page> id from /lawson/xhrnet/xml/config/emss_config.xml to an Enwisen page,
//		<NAME> = pre-defined Enwisen page name
//		<ALIAS> = pre-defined Enwisen alias to a page
//		<CODE> = pre-defined numeric subscription code to a page
//
function enwisenParamExists(pageParams)
{
	if (!pageParams)
		return false;
		
	var id = getVarFromString("id", pageParams); 
	var code = getVarFromString("code", pageParams);
	var name = getVarFromString("name", pageParams);
	var alias = getVarFromString("alias", pageParams);
	var page = null;
		
	// if an id has been set, look up the <page> node in the emss_config.xml file
	if (id)
	{
		page = getEnwisenPageNode(id);
		if (page == null)
		{
			return false;
		}
		
		code = page.getAttribute("code");
		name = page.getAttribute("name");
		alias = page.getAttribute("alias");
	}
	
	if (!code && !name && !alias)
	{
		return false;
	}
	
	return true;
}

//-----------------------------------------------------------------------------
// Returns an XML <page> node from the /lawson/xhrnet/xml/config/emss_config.xml file with
// the specified id for the user's company.
// Inputs: 
//	id: configuration id from /lawson/xhrnet/xml/config/emss_config.xml to an Enwisen page
//
function getEnwisenPageNode(id)
{
	if (!isEnwisenEnabled())
		return null;
		
	return emssObj.getConfigSettingPageNode("enwisen_subscription_ids", id);
}

/**************************** END ENWISEN INTEGRATION METHODS **************************/

//-----------------------------------------------------------------------------
function EMSSShell()
{
	// framework stuff
	this.configDom = null;
	this.companyDom = null;
	this.debugEnwisen = false;

	// configurable from emss_config.xml
	this.theme = "9";
	this.companyNbr = null;
	this.filterSelect = true;
	this.futurePayments = false;
	this.periodStartDate = false;
	this.calcHourlyRate = false;
	this.maskBankInfo = false;
	this.manualBankEntry = true;
	this.benPayInfo = true;
	this.rothPayModel = false;
	this.w4Exempt = false;
	this.requireDepSSN = false;
	this.teDailyLines = 10;
	this.teDaily24HourEdit = true;
	this.tePeriod24HourEdit = true;
	this.teEmployeeSubmitEmail = false;
	this.teManagerChangeEmail = true;
	this.teManagerRejectEmail = true;
	this.teManagerApproveEmail = true;
	this.tePostOrGlActivites = true;
	this.teAllowNegativeHours = true;
	this.cmQualExpireDays = 90;
	this.reviewsWithinDays = 30;
	this.requirePostingDates = false;
	this.emailFormat = "html";
	this.enableEnwisen = false;
	this.enwisenHeader = true;
	this.employeeGroups = false;
	this.hrCallCenterResponderGroups = new Array();
	this.onboardingAdminGroups = new Array();
	this.onboardingDay1NewHireGroups = new Array();
	this.offboardingAdminGroups = new Array();
	this.offboardingDay1TermGroups = new Array();
	this.loginTimeStamp = false;
	this.enwisenHostUrl = null;
	this.tpLoginUrl = null;
	this.tpUserId = null;
	this.tpPassword = null;
}
//-- static variables ---------------------------------------------------------
EMSSShell.PRODUCT_ID = "EMSS";
EMSSShell.PRODUCT_NAME = "Employee and Manager Self-Service";
EMSSShell.TECHNOLOGY_VERSION = "8.0.3";
//-- returns true/false for success --------------------------------------------
EMSSShell.prototype.configure = function(companyNbr)
{
	var initDone = false;
	
	if (!this.configDom)
	{
		if (typeof(SSORequest) == "function")
			this.configDom = SSORequest(XMLConfigDocs + "emss_config.xml", null, "text/xml", "text/xml", true);
		else if (parent && typeof(parent.SSORequest) == "function")
			this.configDom = parent.SSORequest(XMLConfigDocs + "emss_config.xml", null, "text/xml", "text/xml", true);
		else if (opener && typeof(opener.SSORequest) == "function")
			this.configDom = opener.SSORequest(XMLConfigDocs + "emss_config.xml", null, "text/xml", "text/xml", true);
		else if (typeof(SEARequest) == "function")
			this.configDom = SEARequest(XMLConfigDocs + "emss_config.xml", null, "text/xml", "text/xml", true);
		else if (parent && typeof(parent.SEARequest) == "function")
			this.configDom = parent.SEARequest(XMLConfigDocs + "emss_config.xml", null, "text/xml", "text/xml", true);
		else if (opener && typeof(opener.SEARequest) == "function")
			this.configDom = opener.SEARequest(XMLConfigDocs + "emss_config.xml", null, "text/xml", "text/xml", true);				
		
		if (this.configDom == null)
			return false;
	
		initDone = true;
	}

	var value;
	var node;

	// COMPANY SETTINGS
	value = this.getConfigCompanyNode(companyNbr);
	if (value != null)
	{
		this.companyDom = value;
		this.companyNbr = companyNbr;
	}
	
	// USER INTERFACE THEME
	value = this.getConfigOption("theme");
	if (value != null)
		this.theme = value.toLowerCase();	
	
	// FILTER SELECT
	value = this.getConfigOption("filter_select");
	if (value != null)
		this.filterSelect = (value.toLowerCase() == "false") ? false : true;	
	
	// FUTURE PAYMENTS
	value = this.getConfigOption("future_payments");
	if (value != null)
		this.futurePayments = (value.toLowerCase() == "false") ? false : true;
	
	// PERIOD START DATE
	value = this.getConfigOption("period_start_date");
	if (value != null)
		this.periodStartDate = (value.toLowerCase() == "false") ? false : true;	

	// HOURLY RATE CALCULATION IN PRINTABLE PAY STUB
	value = this.getConfigOption("calc_hourly_rate");
	if (value != null)
		this.calcHourlyRate = (value.toLowerCase() == "false") ? false : true;	
	
	// MASK BANK INFO
	value = this.getConfigOption("mask_bank_info");
	if (value != null)
		this.maskBankInfo = (value.toLowerCase() == "false") ? false : true;	
	
	// MANUAL BANK ENTRY
	value = this.getConfigOption("manual_bank_entry");
	if (value != null)
		this.manualBankEntry = (value.toLowerCase() == "false") ? false : true;	
	
	// BENEFITS ENROLLMENT PAY INFO DISPLAY
	value = this.getConfigOption("ben_pay_info");
	if (value != null)
		this.benPayInfo = (value.toLowerCase() == "false") ? false : true;	
	
	// ROTH PAY MODEL
	value = this.getConfigOption("roth_pay_model");
	if (value != null)
		this.rothPayModel = (value.toLowerCase() == "false") ? false : true;	
	
	// TAX WITHHOLDING EXEMPT
	value = this.getConfigOption("w4_exempt");
	if (value != null)
		this.w4Exempt = (value.toLowerCase() == "false") ? false : true;	
		
	// REQUIRE DEPENDENT SSN
	value = this.getConfigOption("require_dep_ssn");
	if (value != null)
		this.requireDepSSN = (value.toLowerCase() == "false") ? false : true;	
	
	// TIME ENTRY DAILY LINES
	value = this.getConfigOption("te_daily_lines");
	if (value != null)
		this.teDailyLines = Number(value);	
	
	// TIME ENTRY DAILY 24 HOUR EDIT
	value = this.getConfigOption("te_daily_24_hour_edit");
	if (value != null)
		this.teDaily24HourEdit = (value.toLowerCase() == "false") ? false : true;
	
	// TIME ENTRY PERIOD 24 HOUR EDIT
	value = this.getConfigOption("te_period_24_hour_edit");
	if (value != null)
		this.tePeriod24HourEdit = (value.toLowerCase() == "false") ? false : true;	
	
	// TIME ENTRY EMPLOYEE SUBMIT EMAIL
	value = this.getConfigOption("te_employee_submit_email");
	if (value != null)
		this.teEmployeeSubmitEmail = (value.toLowerCase() == "false") ? false : true;	
	
	// TIME ENTRY MANAGER CHANGE EMAIL
	value = this.getConfigOption("te_manager_change_email");
	if (value != null)
		this.teManagerChangeEmail = (value.toLowerCase() == "false") ? false : true;
	
	// TIME ENTRY MANAGER REJECT EMAIL
	value = this.getConfigOption("te_manager_reject_email");
	if (value != null)
		this.teManagerRejectEmail = (value.toLowerCase() == "false") ? false : true;	
	
	// TIME ENTRY MANAGER APPROVE EMAIL
	value = this.getConfigOption("te_manager_approve_email");
	if (value != null)
		this.teManagerApproveEmail = (value.toLowerCase() == "false") ? false : true;	
	
	// TIME ENTRY POST OR GL-ONLY ACTIVITIES
	value = this.getConfigOption("te_post_or_gl_activities");
	if (value != null)
		this.tePostOrGlActivites = (value.toLowerCase() == "false") ? false : true;	
	
	// TIME ENTRY ALLOW NEGATIVE VALUES
	value = this.getConfigOption("te_allow_negative_hours");
	if (value != null)
		this.teAllowNegativeHours = (value.toLowerCase() == "false") ? false : true;	
		
	// CAREER MANAGEMENT QUAL EXPIRE DAYS
	value = this.getConfigOption("cm_qual_expire_days");
	if (value != null)
		this.cmQualExpireDays = Number(value);
	
	// UPCOMING REVIEWS DUE WITHIN DAYS
	value = this.getConfigOption("reviews_within_days");
	if (value != null)
		this.reviewsWithinDays = Number(value);	
	
	// REQUIRE POSTING DATES ON JOB REQS
	value = this.getConfigOption("require_posting_dates");
	if (value != null)
		this.requirePostingDates = (value.toLowerCase() == "false") ? false : true;	
	
	// EMAIL FORMAT
	value = this.getConfigOption("email_format");
	if (value != null)
		this.emailFormat = value.toLowerCase();
	
	// ENABLE ENWISEN
	value = this.getConfigOption("enable_enwisen");
	if (value != null)
		this.enableEnwisen = (value.toLowerCase() == "false") ? false : true;
	
	// DISPLAY ENWISEN HEADER
	value = this.getConfigOption("enwisen_header");
	if (value != null)
		this.enwisenHeader = (value.toLowerCase() == "false") ? false : true;	
	
	// SEND EMPLOYEE GROUPS TO ENWISEN
	value = this.getConfigOption("employee_groups");
	if (value != null)
		this.employeeGroups = (value.toLowerCase() == "false") ? false : true;		
	
	// SEND ELIGIBLE BENEFIT PLAN CODES TO ENWISEN
	value = this.getConfigOption("eligible_benefit_plans");
	if (value != null)
		this.eligibleBenefitPlans = (value.toLowerCase() == "false") ? false : true;	
	
	// SEND EMPLOYEE'S CURRENT BENEFIT PLAN CODES TO ENWISEN
	value = this.getConfigOption("current_benefit_plans");
	if (value != null)
		this.currentBenefitPlans = (value.toLowerCase() == "false") ? false : true;		
	
	// EMPLOYEE GROUP NAMES FOR ENWISEN CALL CENTER RESPONDERS
	this.hrCallCenterResponderGroups = new Array();
	node = this.getConfigSettingNode("hr_call_center_responders");
	if (node != null)
	{
		var groupNodes = node.getElementsByTagName("group");
		for (var i=0; i<groupNodes.length; i++)
			this.hrCallCenterResponderGroups[i] = groupNodes[i].getAttribute("name");
	}
	
	// EMPLOYEE GROUP NAMES FOR ENWISEN ONBOARDING ADMINS
	this.onboardingAdminGroups = new Array();
	node = this.getConfigSettingNode("onboarding_admins");
	if (node != null)
	{
		var groupNodes = node.getElementsByTagName("group");
		for (var i=0; i<groupNodes.length; i++)
			this.onboardingAdminGroups[i] = groupNodes[i].getAttribute("name");
	}	
	
	// EMPLOYEE GROUP NAMES FOR ENWISEN ONBOARDING DAY 1 NEW HIRES
	this.onboardingDay1NewHireGroups = new Array();
	node = this.getConfigSettingNode("onboarding_day_1_new_hires");
	if (node != null)
	{
		var groupNodes = node.getElementsByTagName("group");
		for (var i=0; i<groupNodes.length; i++)
			this.onboardingDay1NewHireGroups[i] = groupNodes[i].getAttribute("name");
	}	
	
	// EMPLOYEE GROUP NAMES FOR ENWISEN OFFBOARDING ADMINS
	this.offboardingAdminGroups = new Array();
	node = this.getConfigSettingNode("offboarding_admins");
	if (node != null)
	{
		var groupNodes = node.getElementsByTagName("group");
		for (var i=0; i<groupNodes.length; i++)
			this.offboardingAdminGroups[i] = groupNodes[i].getAttribute("name");
	}	
	
	this.offboardingDay1TermGroups = new Array();
	node = this.getConfigSettingNode("offboarding_day_1_terms");
	if (node != null)
	{
		var groupNodes = node.getElementsByTagName("group");
		for (var i=0; i<groupNodes.length; i++)
			this.offboardingDay1TermGroups[i] = groupNodes[i].getAttribute("name");
	}
	
	// SEND TIMESTAMP IN GMT FORMAT TO ENWISEN WHEN LOGGING IN
	value = this.getConfigOption("login_timestamp");
	if (value != null)
		this.loginTimeStamp = (value.toLowerCase() == "false") ? false : true;	
	
	// ENWISEN LOGIN URL
	value = this.getConfigOption("enwisen_host_url");
	if (value != null)
		this.enwisenHostUrl = value;
		
	// DEBUG ENWISEN
	value = this.getConfigOption("debug_enwisen");
	if (value != null)
		this.debugEnwisen = (value.toLowerCase() == "false") ? false : true;
	
	if (initDone && this.debugEnwisen)
	{
		var alertStr = "GENERAL CONFIGURATION SETTINGS\n\n";
		alertStr += "configuration file = " + XMLConfigDocs + "emss_config.xml\n" 
			 + "user company = " + companyNbr + "\n"
			 + "configuration company = " + this.companyDom.getAttribute("value") + "\n"
			 +  "theme = " + this.theme + "\n"
			 +  "enable_enwisen = " + this.enableEnwisen + "\n"
			 +  "employee_groups = " + this.employeeGroups + "\n"
			 +  "eligible_benefit_plans = " + this.eligibleBenefitPlans + "\n"
			 +  "current_benefit_plans = " + this.currentBenefitPlans + "\n"
			 +  "login_timestamp = " + this.loginTimeStamp + "\n"
			 +  "enwisen_host_url = " + this.enwisenHostUrl + "\n"
			 +  "debug_enwisen = " + this.debugEnwisen + "\n";
		alert(alertStr);		
	}

	return true;
}
//-----------------------------------------------------------------------------
EMSSShell.prototype.getConfigOption = function(id)
{
	if (!this.configDom || !this.companyDom)
		return null;
	var sNodes = this.companyDom.getElementsByTagName("setting");
	var len = sNodes.length;
	for (var i=0; i<len; i++)
		if (id == sNodes[i].getAttribute("id"))
			return sNodes[i].getAttribute("value");
	return null;
}
//-----------------------------------------------------------------------------
EMSSShell.prototype.getConfigSettingNode = function(id)
{
	if (!this.configDom || !this.companyDom)
		return null;
	var sNodes = this.companyDom.getElementsByTagName("setting");
	var len = sNodes.length;
	for (var i=0; i<len; i++)
		if (id == sNodes[i].getAttribute("id"))
			return sNodes[i];
	return null;
}
//-----------------------------------------------------------------------------
EMSSShell.prototype.getConfigSettingPageNode = function(id, nodeId)
{
	var sNode = emssObj.getConfigSettingNode(id);
	if (sNode != null)
	{
		var sNodes = sNode.getElementsByTagName("page");
		var len = sNodes.length;
		for (var i=0; i<len; i++)
		{
			var node = sNodes[i];
			if (nodeId == node.getAttribute("id"))
				return node;
		}	
	}

	return null;
}
//-----------------------------------------------------------------------------
EMSSShell.prototype.getConfigCompanyNode = function(companyNbr)
{
	var defaultNode = null;
	var parseError = false;
	var alertRef = (typeof(seaAlert) != "undefined") ? seaAlert : alert;
	if (this.configDom)
	{			
		try
		{	
			var cNodes = this.configDom.getElementsByTagName("company");
			var len = cNodes.length;
			for (var i=0; i<len; i++)
			{
				if (!cNodes[i].getAttribute("value") || (trimString(cNodes[i].getAttribute("value").toString()) == ""))
					defaultNode = cNodes[i];
				else if (Number(companyNbr) == Number(cNodes[i].getAttribute("value")))
					return cNodes[i];
			}
			if (this.configDom.getElementsByTagName("ERROR").length > 0)
			{
				parseError = true;
			}
		}
		catch(e)
		{
			parseError = true;
		}
	}
	if (parseError)
	{
		alertRef(getSeaPhrase("CONFIG_ERROR_3","ESS"));
	}
	else if (defaultNode == null)
	{
		alertRef(getSeaPhrase("CONFIG_ERROR_1","ESS")+' '+getSeaPhrase("CONFIG_ERROR_2","ESS"));	
	}
	return defaultNode;
}	

function trimString(str) 
{
	str = str.replace(/^\s\s*/, '');
	var ws = /\s/;
	var i = str.length;
	while (ws.test(str.charAt(--i)));
	return str.slice(0, i+1);
}
