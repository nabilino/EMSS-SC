/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/common.js,v 1.20.2.3.2.3 2014/01/10 14:29:55 brentd Exp $ */
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
//
//	NOTE:
//		All these methods start with "cmn" which makes it very easy
//		to determine what comes from (and is used from) this file
//-----------------------------------------------------------------------------


//-----------------------------------------------------------------------------
//-- only used for quick checks.. for more information, use the SEABrowser object
function cmnIsBrowserIE()
{
	return (navigator.appName == "Microsoft Internet Explorer") ? true : false;
}

//-----------------------------------------------------------------------------
function cmnIsElementVisible(obj, wnd, bCheckDisplay)
{
	if (typeof(obj) == "string")
	{
		wnd = (wnd) ? wnd : window;
		obj = wnd.document.getElementById(obj);
	}

	if (!obj)
		return false;

	var isVisible = (obj.style.visibility == "visible");
	if (bCheckDisplay)
		isVisible = (isVisible && obj.style.display == "block")
	return isVisible;
}

//-----------------------------------------------------------------------------
function cmnShowElement(obj, wnd, bChangeDisplay)
{
	if (typeof(obj) == "string")
	{
		wnd = (wnd) ? wnd : window;
		obj = wnd.document.getElementById(obj);
	}

	if (!obj)
		return;

	obj.style.visibility = "visible";
	if (bChangeDisplay)
		obj.style.display = "block";
}

//-----------------------------------------------------------------------------
function cmnHideElement(obj, wnd, bChangeDisplay)
{
	if (typeof(obj) == "string")
	{
		wnd = (wnd) ? wnd : window;
		obj = wnd.document.getElementById(obj);
	}

	if (!obj)
		return;

	obj.style.visibility = "hidden";
	if (bChangeDisplay)
		obj.style.display = "none";
}

//-----------------------------------------------------------------------------
function cmnLoadScriptFile(src, wnd)
{
	if (!wnd)
		wnd = window;
	var scriptElement = wnd.document.createElement("script");
	scriptElement.src = src;
	wnd.document.body.appendChild(scriptElement);
}

//-----------------------------------------------------------------------------
function cmnGetElementText(node)
{
	var nodes = node.childNodes;
	var len = (nodes && nodes.length ? nodes.length : 0);
	var strRet = "";
	for (var i=0; i<len; i++)
	{
		if (nodes[i].nodeType == 3 || nodes[i].nodeType == 4)
			strRet += nodes[i].nodeValue;
	}
    return strRet;
}

//-----------------------------------------------------------------------------
function cmnGetNodeCDataValue(node)
{
	if (typeof(node) == "undefined")
		return null;
	var nodes = node.childNodes;
	var len = nodes.length;
	for (var i=0; i<len; i++)
	{
		if (nodes[i].nodeType == 4)
			return nodes[i].nodeValue;
	}
	return null;
}

//-----------------------------------------------------------------------------
function cmnSetElementText(node,text)
{
	if (!node.hasChildNodes())
		return;
	// for translation to work:
	node.innerHTML = text;
}

//-----------------------------------------------------------------------------
// for an integer-indexed array arr, determine if str is in
function cmnArrayContains(arr,str)
{
	var len = arr.length;
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
	var len = arr.length;
	for (var i=0; i < len; i++)
	{
		if (arr[i] == str)
			return i;
	}
	return -1;
}

//-----------------------------------------------------------------------------
function cmnIsNumberBetween(lowerLimit, upperLimit, myNumber)
{
	lowerLimit = parseInt(lowerLimit, 10);
	upperLimit = parseInt(upperLimit, 10);
	myNumber = parseInt(myNumber, 10);
	if (isNaN(lowerLimit) || isNaN(upperLimit) || isNaN(myNumber))
		return false;
	if ((myNumber >= lowerLimit) && (myNumber <= upperLimit))
   		return true;
   	return false;
}

//-----------------------------------------------------------------------------
function cmnGetIntegerBetween(lowerLimit, upperLimit)
{
	return Math.round(cmnGetNumberBetween(lowerLimit, upperLimit))
}

//-----------------------------------------------------------------------------
function cmnGetNumberBetween(lowerLimit, upperLimit)
{
	lowerLimit = parseInt(lowerLimit, 10);
	upperLimit = parseInt(upperLimit, 10);
	if (isNaN(lowerLimit) || isNaN(upperLimit))
		return 0;

	return ((upperLimit - lowerLimit) / 2 + lowerLimit);
}

//-----------------------------------------------------------------------------
function cmnRemoveChildNodes(obj)
{
	if (typeof(obj) == "string")
		obj = document.getElementById(obj);
	if (!obj)
		return;
	while (obj.firstChild)
		obj.removeChild(obj.firstChild);
}

//-----------------------------------------------------------------------------
function cmnShowObject(obj, bChangeDisplay)
{
	if (typeof(obj) == "string")
		obj = document.getElementById(obj);
	if (!obj)
		return;
	obj.style.visibility = "visible";
	if (bChangeDisplay)
		obj.style.display = "block";
}

//-----------------------------------------------------------------------------
function cmnHideObject(obj, bChangeDisplay)
{
	if (typeof(obj) == "string")
		obj = document.getElementById(obj);
	if (!obj)
		return;
	obj.style.visibility = "hidden";
	if (bChangeDisplay)
		obj.style.display = "none";
}

//-----------------------------------------------------------------------------
function cmnGetElementForId(elmType, id, wnd)
{
	if (!elmType || !id)
		return null;
	if (!wnd)
		wnd = window;
	var elmNodes = wnd.document.getElementsByTagName(elmType);
	var elmCount = elmNodes.length;
	for (var i=0; i<elmCount; i++)
		if (id == elmNodes[i].htmlFor || id == elmNodes[i].getAttribute("for"))
			return elmNodes[i];
	return null;
}

//-----------------------------------------------------------------------------
function cmnGetLabelTextForId(id, wnd)
{
	if (!id)
		return "";
	if (!wnd)
		wnd = window;
	var labelNodes = wnd.document.getElementsByTagName("label");
	var labelCount = labelNodes.length;
	for (var i=0; i<labelCount; i++)
		if (id == labelNodes[i].htmlFor)
			return cmnGetElementText(labelNodes[i]);
	return "";
}

//-----------------------------------------------------------------------------
function cmnEscapeIt(value)
{
	// convert to a string
	value = escape("" + value);

	// this step must be AFTER the javascript escape
	// manually escape the + signs... javascript escape won't do this
	if (value.indexOf("+") != -1)
		value = value.split("+").join("%2B");

	return value;
}

//-----------------------------------------------------------------------------
function cmnTrimString(str)
{
	if (!str || typeof(str) != "string")
		return str;
	if (str.trim)
		return str.trim();
	else	
		return str.replace(/^\s+|\s+$/g, '');
}