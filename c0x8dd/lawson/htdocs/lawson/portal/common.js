/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/common.js,v 1.49.2.19.4.27.6.8.2.5 2012/08/08 12:37:20 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
//-----------------------------------------------------------------------------
//		***************************************************************
//		*                                                             *                          
//		*                           NOTICE                            *
//		*                                                             *
//		*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//		*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//		*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//		*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//		*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//		*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//		*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//		*                                                             *
//		*   (c) COPYRIGHT 2012 INFOR.  ALL RIGHTS RESERVED.           *
//		*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//		*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//		*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//		*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//		*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//		*                                                             *
//		*************************************************************** 
//-----------------------------------------------------------------------------
// common cross-browser utilities
//-----------------------------------------------------------------------------

var COMMONJS="common.js"		// filename constant for error handler

// SHOW ALL DEPRECATED METHODS FIRST...

// @deprecated
function ObjectFactory(portalWnd)
{
	return new SSOObjectFactory();
}
// @deprecated
function displayDOMParseError(pe,path)
{
	oError.displayDOMParseError(pe,path,window);
}
// @deprecated
function displayExceptionMessage(e,file,func,prefMsg)
{
	oError.displayExceptionMessage(e,file,func,prefMsg,window);
}
// @deprecated
function displayIOSErrorMessage(ds,force,prefMsg)
{
	oError.displayIOSErrorMessage(ds,force,prefMsg,window);
}
// @deprecated
function getHttpStatusMsg(stat)
{
	return (oError.getHttpStatusMsg(stat));
}
// @deprecated
function trim(str)
{
	return strTrim(str);
}

//-----------------------------------------------------------------------------
function cmnErrorHandler(e,wnd,filename,msg,func)
{
	wnd = (typeof(wnd) != "undefined" ? wnd : window);
	filename = (typeof(filename) == "string" ? filename : "");
	msg = (typeof(msg) == "string" ? msg : "");

	if (typeof(func) == "undefined")
	{
		if(!cmnErrorHandler.caller)
			func = "";
		else if (!oBrowser.isIE)
			func = cmnErrorHandler.caller.name;
		else
		{
			func=cmnErrorHandler.caller.toString().substr(9);
			iPos=func.indexOf("(");
			func=func.substr(0,iPos);
		}
	}
	oError.displayExceptionMessage(e,filename,func,msg,wnd);
}

//-----------------------------------------------------------------------------
function cmnSetCookie (name, value, expires)
{
	if (expires)
	{
		var expDate = new Date();
		expDate.setTime (expDate.getTime() + expires);
	    document.cookie = name + "=" + escape(value) + "; expires=" + expDate.toGMTString();
    }
    else
        document.cookie = name + "=" + escape(value);
}
//-----------------------------------------------------------------------------
function cmnGetCookie(name)
{
  	var str = document.cookie;
  	var set = str.split (";");
  	var size = set.length;
  	var retVal = "";
  	for (var i = 0; ((i < size) && (retVal == "")); i++)
  	{
    	var crumb = set[i].split("=");
    	if (crumb[0].substring (0,1) == " ")
     	 	crumb[0] = crumb[0].substring (1, crumb[0].length);
    	if (crumb[0] == name)
      		retVal = unescape(crumb[1]);
  	}
	return retVal;
}

//-----------------------------------------------------------------------------
// this method takes an htm (i.e. "blank.htm") and returns a full url path or
//  it takes a relative path (i.e. "/portal/blank.htm") and returns full path
function getFullUrl(pageStr)
{
	if (pageStr.indexOf("/") != 0)
		pageStr = lawsonPortal.path + "/" + pageStr;
	return window.location.protocol + "//" + window.location.host + pageStr;
}

//-----------------------------------------------------------------------------
function cmnLoadScript(type,value,wnd)
{
	wnd = (typeof(wnd) == "undefined" ? portalWnd : wnd);
	var scSource=value;
	var scPath="";
	try
	{
		if(type=="file")
		{
			scPath=value;
			scSource=httpRequest(scPath,null,"text/html","text/plain");
		}
		if ((typeof(scSource)=="string") && (scSource.length))
		{
			var scElem=document.createElement("script");
			if (scPath)
				scElem.text=scSource;
			else
				scElem.src=scSource;
			wnd.document.body.appendChild(scElem);
		}
	}
	catch (e)
	{
		var msg=lawsonPortal.getPhrase("ERROR_LOADING_SCRIPT") + (scPath?(" - "+scPath):"");
		cmnDlg.messageBox(msg,"ok","alert",wnd);
		lawTraceMsg(msg);
	}
}
//-----------------------------------------------------------------------------
// create xml object from string
function cmnCreateXmlObjectFromString(strSource)
{
	var oXml;
	if (oBrowser.isIE)
	{
		oXml = objFactory.createInstance("DOM");
		oXml.async = false;
		oXml.loadXML(strSource)
		if (oXml.parseError.errorCode!=0)
		{
			oError.displayDOMParseError(oXml.parseError);
			return null;
		}
	}
	else
	{
		var parser=new DOMParser();
		oXml=parser.parseFromString(strSource, "text/xml");
	}
	return oXml;
}

//-----------------------------------------------------------------------------
function displayErrorPage(portalWnd,msg)
{
	// by default, error.htm will display an SSO error msg
	// must pass a reference to the portal window
	try {
		// hide all the containers of the portal window (index.htm)
		portalWnd.document.getElementById("divLogo").style.display="none";
		portalWnd.document.getElementById("menuBar").style.display="none";
		portalWnd.document.getElementById("topDivider").style.display="none";
		portalWnd.document.getElementById("leftLinks").style.display="none";
		portalWnd.document.getElementById("lawtoolbar").style.display="none";
		portalWnd.document.getElementById("drlContainer").style.display="none";
		portalWnd.document.getElementById("splitBar").style.display="none";
		portalWnd.document.getElementById("rightGrip").style.display="none";
		portalWnd.document.getElementById("leftGrip").style.display="none";

		var src="error.htm" + (typeof(msg)=="string" ? "?"+msg : "");
		var cntFrm = portalWnd.document.getElementById("content");
		cntFrm.style.top="0";
		cntFrm.style.left="0";
		cntFrm.style.width=screen.width;
		cntFrm.style.height=screen.height;
		cntFrm.src = src;
		cntFrm.style.visibility="visible"
	} catch (e) { }
}

//-----------------------------------------------------------------------------
function getEventElement(evt)
{
    var elem = null;
    if (evt && evt.target)
        elem = (evt.target.nodeType == 3) ? evt.target.parentNode : evt.target
    else if (evt)
        elem = evt.srcElement
    return elem
}

//-----------------------------------------------------------------------------
function getEventObject(evt,wnd)
{
	if (typeof(wnd) == "undefined")
		return (evt ? evt : (window.event ? window.event : null));
	else
		return (evt ? evt : (wnd.event ? wnd.event : null));
}

//-----------------------------------------------------------------------------
function setEventCancel(evt)
{
	try {
		if (typeof(evt) == "undefined" || evt == null)
			return;
		if (oBrowser.isIE)
		{
			evt.cancelBubble=true;
			evt.returnValue=false;
			evt.keyCode = 0
		}
		else
		{
			evt.cancelBubble=true;
			evt.preventDefault();
			evt.stopPropagation();
		}
		
	} catch (e) { }
}

//-----------------------------------------------------------------------------
function cancelEventBubble(evt)
{
	if (typeof(evt) == "undefined" || evt == null)
		return;
	if (oBrowser.isIE)
		evt.cancelBubble=true;
	else
	{
		evt.cancelBubble=true;
		evt.stopPropagation();
	}
}

//-----------------------------------------------------------------------------
// common focus, blur handlers for textbox
function cmnOnTextboxFocus(evt,txtBox)
{
	if (typeof(txtBox) == "undefined")
		this.className="xTTextBoxHighlight";
	else
		txtBox.className="xTTextBoxHighlight";
}
function cmnOnTextboxBlur(evt,txtBox)
{
	if (typeof(txtBox) == "undefined")
		this.className="xTTextBox";
	else
		txtBox.className="xTTextBox";
}

//-----------------------------------------------------------------------------
function cmnSetElementText(node,text)
{
	if ( !node.hasChildNodes() ) return;
	// for translation to work:
	node.innerHTML = text;
}

//-----------------------------------------------------------------------------
function cmnGetElementText(node)
{
	var nodes = node.childNodes;
	var len = (nodes && nodes.length ? nodes.length : 0);
	var strRet="";
	for (var i=0; i < len; i++)
	{
		if (nodes[i].nodeType == 3 || nodes[i].nodeType == 4)
			strRet += nodes[i].nodeValue;
	}
    return strRet;
}

//-----------------------------------------------------------------------------
function strTrim(str)
{
	if (!str) return ("");
	var s=str.replace(/^\s+|\s+$/g, "");
	return (s);
}
function strLTrim(str)
{
	if (!str) return ("");
	var s=str.replace(/^\s+/g, "");
	return (s);
}
function strRTrim(str)
{
	if (!str) return ("");
	var s=str.replace(/\s+$/g, "");
	return (s);
}

//-----------------------------------------------------------------------------
function strFillChar(str,max,dir,ch)
{
	var c = (ch ? ch.substr(0,1) : " ");
	var s = str;
	var n = (s ? max - s.length : max);
	for (var i = 0; i < n; i++)
		s = (dir == "right" ? s + c : c + s);
	return (s);
}
//-----------------------------------------------------------------------------
function strStripChar(str,ch)
{
	var c = (ch ? ch.substr(0,1) : " ");
	var s = str;
	var iPos = s.indexOf(c);
	while (iPos != -1)
	{
		s = s.substr(0,iPos) + s.substr(iPos+1);
		iPos = s.indexOf(c);
	}
	return (s);
}
//-----------------------------------------------------------------------------
function strLimitLen(s,len)
{
	if (s.length>len)
		s=s.substring(0,len)
	return s
}

//-----------------------------------------------------------------------------
// use this method to extract ? and & separated string parameters
// (allows for or ignores presence of underscore (_) precending varName) 
function getVarFromString(varName,str)
{
	str+='&'
	reStr="(?:\\&|\\?|^)" + varName + "=(.*?)(?:\\&|$)"
	var re=new RegExp(reStr,"gi")
	if(re.test(str))
		return RegExp.$1
	else if (varName.substr(0,1) != "_")
	{
		reStr="(?:\\&|\\?|^)\\_" + varName + "=(.*?)(?:\\&|$)"
		re=new RegExp(reStr,"gi")
		if(re.test(str))
			return RegExp.$1
	}
	return "";
}

//-----------------------------------------------------------------------------
// use this method to extract | and || separated string parameters
function getParmFromString(varName,str)
{
	str+="|"
	reStr="(?:\\||)" + varName + "=(.*?)(?:\\||$)"
	var re=new RegExp(reStr,"gi")
	if(re.test(str))
		return RegExp.$1
	else
		return ""
}

//-----------------------------------------------------------------------------
function formatURL(str)
{
	re=/^(ftp\:\/\/|http(?:s)?\:\/\/|mailto\:\/\/)?(?:\w+\@)?(\w+\.)?\w+(?:\.\w+)+(?:\:\d+)?/
	mtch=re.test(str)
	if(mtch)
	{
		if(RegExp.$1=="" && RegExp.$2=="")
			str="http://www."+str
		else if(RegExp.$1=="")
			str="http://"+str
	}
	return str
}

//-----------------------------------------------------------------------------
function xmlEncodeString(str)
{
	var retVal=str.replace(/\&/g,"&amp;")
	retVal=retVal.replace(/\</g,"&lt;")
	retVal=retVal.replace(/\>/g,"&gt;")
	retVal=retVal.replace(/\"/g,"&quot;")
	return retVal
}

//-----------------------------------------------------------------------------
function xmlDecodeString(str)
{
	var retVal=str.replace(/\&amp;/g,"&")
	retVal=retVal.replace(/\&lt;/g,"<")
	retVal=retVal.replace(/\&gt;/g,">")
	retVal=retVal.replace(/\&quot;/g,"\"")
	return retVal
}

//-----------------------------------------------------------------------------
function cmnLoadSelectPDL(oCbo, strDefault, bClear, wnd)
{
	bClear = (typeof(bClear) != "boolean") ? true : bClear;
	wnd = (typeof(wnd) == "undefined") ? portalWnd : wnd;

	// first clear any existing options?
	if (bClear)
	{
		for (var i = oCbo.options.length-1; i > 0; i--)
		{
			if (oBrowser.isIE)
			{
				var oChild=oCbo.children(i-1)
				oCbo.removeChild(oChild)
			}
			else
			{
				var oChild=oCbo.childNodes[i-1]
				oCbo.removeChild(oChild)
			}
		}
	}
	
	// get a list of PDLs
	var strQuery = "?PROD=GEN&FILE=PRODLINE&FIELD=ProductLine&OUT=XML" +
			"&XKEYS=FALSE&XRELS=FALSE&XIDA=FALSE&MAX=1000"
	var oResponse = httpRequest(DMEPath+strQuery)
	if (oResponse.status) return

	var ds=new DataStorage((oBrowser.isIE ? oResponse.xml : oResponse), portalWnd);
	if (!ds.document) return

	var arrMsgs=ds.document.getElementsByTagName("MESSAGE")
	var lenMsgs=(arrMsgs?arrMsgs.length:0)
	if (lenMsgs && (arrMsgs[0].getAttribute("status")=="1"))
	{
		var msg = lawsonPortal.getPhrase("LBL_ERROR") + " - " + arrMsgs[0].firstChild.nodeValue;
		cmnDlg.messageBox(msg,"ok","stop", wnd);
		return;
	}	

	var oNodes = ds.document.getElementsByTagName("COL")
	var selIndex=0
 	for (var i=0; i < oNodes.length; i++)
 	{
		var colText=cmnGetNodeCDataValue(oNodes[i]);
		if (oBrowser.isIE)
		{
			var oOption = document.createElement("option");
			oCbo.options.add(oOption);
			oOption.innerText = colText;
			oOption.value = colText;
			if (colText==strDefault)
				selIndex=i;
		}
		else
		{
			var index = oCbo.options.length;
			oCbo.options[index] = new Option(colText, colText);
			if (colText==strDefault)
				selIndex=i;
		}
 	}
	oCbo.selectedIndex=selIndex
}

//-----------------------------------------------------------------------------
function cmnLoadSelectProject(oCbo, strDefault, bClear, wnd)
{
	bClear = (typeof(bClear) != "boolean") ? true : bClear;
	wnd = (typeof(wnd) == "undefined") ? portalWnd : wnd;

	// first clear any existing options?
	if (bClear)
	{
		for (var i = oCbo.options.length-1; i > 0; i--)
		{
			if (oBrowser.isIE)
			{
				var oChild=oCbo.children(i-1)
				oCbo.removeChild(oChild)
			}
			else
			{
				var oChild=oCbo.childNodes[i-1]
				oCbo.removeChild(oChild)
			}
		}
	}
	
	// get a list of Projects
	var strQuery = "?PROD=GEN&FILE=PROJECT&FIELD=project&OUT=XML" +
			"&XKEYS=FALSE&XRELS=FALSE&XIDA=FALSE&MAX=1000"
	var oResponse = httpRequest(DMEPath+strQuery)
	if (oResponse.status) return;

	var ds=new DataStorage((oBrowser.isIE ? oResponse.xml : oResponse), portalWnd);
	if (!ds.document) return;

	var arrMsgs=ds.document.getElementsByTagName("MESSAGE")
	var lenMsgs=(arrMsgs?arrMsgs.length:0)
	if (lenMsgs && (arrMsgs[0].getAttribute("status")=="1"))
	{
		var msg = lawsonPortal.getPhrase("LBL_ERROR") + " - " + arrMsgs[0].firstChild.nodeValue;
		cmnDlg.messageBox(msg,"ok","stop", wnd);
		return;
	}	

	var selIndex = -1;
	var oNodes = ds.document.getElementsByTagName("COL")
	for (var i=0; i < oNodes.length; i++)
 	{
		var colText=cmnGetNodeCDataValue(oNodes[i]);
		if (oBrowser.isIE)
		{
			var oOption = document.createElement("option");
			oCbo.options.add(oOption);
			oOption.innerText = colText;
			oOption.value = colText;
			if (colText==strDefault)
				selIndex=oCbo.options.length;
		}
		else
		{
			var index = oCbo.options.length;
			oCbo.options[index] = new Option(colText, colText);
			if (colText==strDefault)
				selIndex=oCbo.options.length
		}
 	}
	if (selIndex != -1)
		oCbo.selectedIndex=selIndex
}

//------------------------------------------------------------------------------------------
function cmnCreateSelectOption(doc,selElement,text,value)
{
	var oOption = doc.createElement("option");
	oOption.text = text;
	oOption.value = value;
	selElement.options.add(oOption);
}

//-----------------------------------------------------------------------------
function fixPath(path)
{
	// NT backslashes!! make 1->2	
	var re=/\\/g
	return path.replace(re,"\\\\")
}

//------------------------------------------------------------------------------------------
// remove a key and its data from a string
function cmnRemoveVarFromString(key, value)
{
	// add trailing equal sign to variable if not provided
	key = (key.substr(key.length - 1) == "=") ? key : key + "=";
	var retValue = value;

	// search for uppercase variable first
	var beginPos = value.indexOf(key.toUpperCase());

	// if no uppercase, look for lowercase variable
	if (beginPos == -1)
		beginPos = value.indexOf(key.toLowerCase());

	// found it
	if (beginPos != -1)
	{
		// get balance of string and look for next ampersand
		var lenValue = -1;
		var strValue = value.substring(beginPos + key.length, value.length);
		if (strValue.indexOf("&") != -1)
		{
			lenValue = strValue.indexOf("&");
			if (lenValue == -1)
				lenValue = strValue.length;
		}

		// is the variable preceded by '&', '&_', '?_', '_' characters
		var endPos = (value.substring(beginPos - 1, beginPos) == "&")
			? beginPos - 1 : (value.substring(beginPos - 2, beginPos) == "&_") 
			? beginPos - 2 : (value.substring(beginPos - 2, beginPos) == "?_")
			? beginPos - 1 : (value.substring(beginPos - 1, beginPos) == "_")
			? beginPos - 1 : beginPos;
		
		retValue = value.substring(0, endPos);
		if (lenValue > -1)
			retValue += value.substring(beginPos + key.length + lenValue, value.length);
	}
	return retValue;
}

//-----------------------------------------------------------------------------
function cmnBlockSelect(evt)
{
	// to block user from selecting text
	// via elem.onselectstart=portalWnd.cmnBlockSelect
	evt=getEventObject(evt);
	if (evt)	
	{
		try	{
		    setEventCancel(evt);
		} catch (evt) {	}
	}
	return false;
}

//-----------------------------------------------------------------------------
// for an integer-indexed array arr, determine if str is in
function cmnArrayContains(arr,str)
{
	var len=arr.length;
	for (var i=0; i < len; i++)
	{
		if (arr[i] == str)
			return true;
	}
	return false;
}

//-----------------------------------------------------------------------------
// for an integer-indexed array arr, determine if str is in and return index
// (could have re-factored other method, but already in wide usage)
function cmnArrayIndex(arr,str)
{
	var len=arr.length;
	for (var i=0; i < len; i++)
	{
		if (arr[i] == str)
			return i;
	}
	return -1;
}

//-----------------------------------------------------------------------------
function cmnClearStatus()
{
	window.status="";
}

//-----------------------------------------------------------------------------
function cmnGetNodeCDataValue(node)
{
	if (typeof(node) == "undefined")
		return null;
	var nodes=node.childNodes;
	var len=nodes.length;
	for (var i = 0; i < len; i++)
	{
		if (nodes[i].nodeType==4)
			return nodes[i].nodeValue;
	}
	return null;
}

//-----------------------------------------------------------------------------
// Request Object
function RequestObject(portalWnd)
{
	this.portalWnd=portalWnd
	this.target=(typeof(target) == "object" ? target : portalWnd);
	this.browser=this.portalWnd.oBrowser;
	this.http=this.portalWnd.objFactory.createInstance("HTTP");

	this.onreadystatechange="";
	this.onreadystatedone="";

	// cached date in case the call needs to be generated again
	this.cached_cmd="";
	this.cached_url="";
	this.cached_basync="";
}
RequestObject.prototype.readyState=function()
{
	return (this.browser.isIE ? this.http.readyState : 4);
}
RequestObject.prototype.responseBody=function()
{
	return (this.browser.isIE ? this.http.responseBody : null);
}
RequestObject.prototype.responseStream=function()
{
	return (this.browser.isIE ? this.http.responseStream : null);
}
RequestObject.prototype.responseText=function()
{
	return this.http.responseText;
}
RequestObject.prototype.responseXML=function()
{
	return this.http.responseXML;
}
RequestObject.prototype.status=function()
{
	return this.http.status;
}
RequestObject.prototype.statusText=function()
{
	return this.http.statusText;
}
RequestObject.prototype.abort=function()
{
	this.http.abort();
}
RequestObject.prototype.getAllResponseHeaders=function()
{
	var retVal=this.http.getAllResponseHeaders();
	return retVal;
}
RequestObject.prototype.getResponseHeader=function(strHeader)
{
	var retVal=this.http.getResponseHeader(strHeader);
	return retVal;
}
RequestObject.prototype.open=function(cmd,url,basync)
{
	if (this.browser.isIE)
		this.http.onreadystatechange=this.onreadystatechange;
	else
		this.http.onload=this.onreadystatechange;

	if (typeof(cmd) == "undefined" 
	&& typeof(url) == "undefined" 
	&& typeof(basync) == "undefined")
	{
		// retrieve from cache
		cmd = this.cached_cmd;
		url = this.cached_url;
		basync = this.cached_basync;
	}
	else
	{
		// cache data in case call needs to be regenerated
		this.cached_cmd = cmd;
		this.cached_url = url;
		this.cached_basync = basync;
	}

	// make call
	this.http.open(cmd,url,basync);
}
RequestObject.prototype.send=function(payload)
{
	this.http.send(payload);
}
RequestObject.prototype.setRequestHeader=function(strHeader,value)
{
	this.http.setRequestHeader(strHeader,value);
}

//-----------------------------------------------------------------------------
// String Builder object
function StringBuilder(sString) 
{
	this.length = 0;
	this._current = 0;
	this._parts = [];
	this._string = null;
	if (sString != null)
		this.append(sString);
}
StringBuilder.prototype.append=function(sString) 
{
	// append argument
	this.length += (this._parts[this._current++] = String(sString)).length;	
	// reset cache
	this._string = null;
	return this;
}
StringBuilder.prototype.toString=function()
{
	if (this._string != null)
		return this._string;
	var s = this._parts.join("");
	this._parts = [s];
	this._current = 1;
	this.length = s.length;
	return this._string = s;
}
//-----------------------------------------------------------------------------
function cmnIsValueInString(myValue, myString)
{
	if(typeof(myValue) != "string" || typeof(myString) != "string")
		return false;

	if(myString.indexOf(myValue)!= -1)
			return true;
		
	return false;
}
//-----------------------------------------------------------------------------
function cmnIsNumberBetween(lowerLimit, upperLimit, myNumber)
{
	lowerLimit = parseFloat(lowerLimit, 10);
	upperLimit = parseFloat(upperLimit, 10);
	myNumber = parseFloat(myNumber, 10);
	
	if(isNaN(lowerLimit) || isNaN(upperLimit) || isNaN(myNumber))
		return false;

				
	if((myNumber >= lowerLimit) && (myNumber <= upperLimit))
   		return true;
   		
   	return false;
  }

//-----------------------------------------------------------------------------
function isDigit(keyCode)
{
	return ((keyCode < 48 || keyCode > 57) 
				&& (keyCode < 96 || keyCode > 105)
		? false : true);
}
function isSign(keyCode,shiftKey)
{
	return (keyCode == 107 || keyCode == 109 
			|| (shiftKey && keyCode == 187) 
			|| (!shiftKey && keyCode == 189)
		? true : false);
}

function urlDecode(str) {

    var histogram = {}, histogram_r = {}, code = 0, str_tmp = [];
    var ret = str.toString();
    
    histogram['!']   = '%21';
    histogram['%20'] = '+';
 
    for (replace in histogram) {
        search = histogram[replace]; 
        tmp_arr = ret.split(search); 
        ret = tmp_arr.join(replace);   
    }
    ret = decodeURIComponent(ret);
    return ret;
}

function escapeExtended( str ) {
    var histogram = {}, histogram_r = {}, code = 0, str_tmp = [];
	str = escape(str);
    var ret = str.toString();
    
    histogram['%40']   = '@';
	histogram['%2B']   = '+';
	histogram['%2F']   = '/';

    for (replace in histogram) {
        search = histogram[replace]; 
        tmp_arr = ret.split(search); 
        ret = tmp_arr.join(replace);   
    }
	return ret;
}

