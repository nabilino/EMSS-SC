/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/Attic/ResourceSearch.js,v 1.1.2.11.8.1.2.3 2012/08/08 12:37:30 jomeli Exp $ */
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
// This package is a collection of JavaScript API objects to assist with typical
// Resource Search calls within Lawson Portal.  These objects assume that you
// pass the portal as the portalWnd attribute (usually is the top window).
//
// For more information on the Resource Search API, including group and people
// attributes, consult http://support.lawson.com documentation.
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// RSPackage represents the information necessary to create an xml query for
// Resource search.
// - author Jeff Conrad, Lawson Software
// - user <code>String</code> the webuser, required
// - type <code>String</code> type of RM objects to search, either "People" | "Group", required
// - arrAttr <code>Array</code> of <code>String</code> attribute names to return, required
// - filter <code>String</code> the search filter.  See 3.1 of the RS-API., required
// - max <code>int</code> the maximum number of records to return, optional, >0 if set
// - sortDir <code>String</code> direction to sort by, either "ascend" | "descend"
// - arrSortAttr <code>Array</code> of <code>String</code> attributes to sort by, optional.
// - page <code>int</code> which page to show, optional.
//-----------------------------------------------------------------------------
function RSPackage(portalWnd, user, type, arrAttr, filter, max, sortDir, arrSortAttr, page)
{
	this.portalWnd = portalWnd;
	this.user = user;
	this.type = type;
	this.arrAttr = arrAttr;
	this.filter = filter;
	this.max = max;
	this.sortDir = sortDir;
	this.arrSortAttr = arrSortAttr;
	this.page = page;
}

RSPackage.ASCEND = "ascend";
RSPackage.DESCEND = "descend";
RSPackage.GROUP = "lwsnRMGroup";
RSPackage.PEOPLE = "People";

//-----------------------------------------------------------------------------
// Escape a string according to RFC2254
// - see http://www.faqs.org/rfcs/rfc2254.html
//-----------------------------------------------------------------------------
RSPackage.escapeLDAP = function(str)
{
	var retVal=str.replace(/\*/g,"\\0x2a");
	retVal=retVal.replace(/\(/g,"\\0x28");
	retVal=retVal.replace(/\)>/g,"\\0x29");
	retVal=retVal.replace(/\\/g,"\\0x5c");
	retVal=retVal.replace(/NUL/g,"\\0x00");
	return retVal;
}

//-----------------------------------------------------------------------------
RSPackage.prototype.isValid = function()
{
	var ret = true;
	ret = ret && (this.user != "");
	ret = ret && ((this.type == RSPackage.PEOPLE) || (this.type == RSPackage.GROUP));
	ret = ret && (this.arrAttr != null);
	ret = ret && (this.filter != "");
	ret = ret && ((this.sortDir == RSPackage.ASCEND) || (this.sortDir == RSPackage.DESCEND));
	return ret;
}

//-----------------------------------------------------------------------------
RSPackage.prototype.toXML = function()
{
	if (!this.isValid())
		return null;

	var ret = null;
	var sb = new StringBuilder();
	sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>");
	sb.append("<TRANSACTION user=\"" + this.user + "\" method=\"getRMQuery\">");
	sb.append("<OBJECT><![CDATA[" + this.type + "]]></OBJECT>");
	if (this.arrAttr != null)
	{
		sb.append("<ATTRIBUTES>");
		var len = this.arrAttr.length;
		for (var i=0;i<len;i++)
		{
			sb.append("<ATTRIBUTE><![CDATA[" + this.arrAttr[i] + "]]></ATTRIBUTE>");
		}
		sb.append("</ATTRIBUTES>");
	}
	sb.append("<WHERE><![CDATA[" + this.filter + "]]></WHERE>");
	if (this.max)
	{
		sb.append("<MAXRECORDS><![CDATA[" + this.max + "]]></MAXRECORDS>");
	}
	sb.append("<ORDERBY sort=\"" + this.sortDir + "\">");
	if (this.arrSortAttr != null)
	{
		var len = this.arrSortAttr.length;
		for (var i=0;i<len;i++)
		{
			sb.append("<ATTRIBUTE><![CDATA[" + this.arrSortAttr[i] + "]]></ATTRIBUTE>");
		}
	}
	sb.append("</ORDERBY>");
	if (this.page != null)
	{
		sb.append("<PAGE><![CDATA[" + this.page + "]]></PAGE>");
	}
	sb.append("</TRANSACTION>");
	ret = sb.toString();
	return (ret);
}

//-----------------------------------------------------------------------------
// RSRequest represents the packaged information necessary to call Resource Search.
// - author Jeff Conrad, Lawson Software
// - wnd <code>Window</code>, the current window, required
// - portalWnd <code>Window</code>, the portal window object, required
// - query <code>String</code> XML to call with, required
//-----------------------------------------------------------------------------
function RSRequest(wnd, portalWnd, pkg)
{
	this.path = "/rmwebapp/RMApiServlet";
	this.portalObj = portalWnd.lawsonPortal;
	this.portalWnd = portalWnd;
	this.pkg = pkg;
	this.response = null;
	this.wnd = wnd;
}

//-----------------------------------------------------------------------------
// - dispError <code>boolean</code>, optional
//-----------------------------------------------------------------------------
RSRequest.prototype.getResponse = function(dispError)
{
	var url = this.path;
	var pkg = this.pkg;
	var cntType = null;
	var outType = "text/xml";
	dispError = dispError ? true : false;
	
	// put a local function on the portal
	var uniqueFcnName = "httpRequest_RS";
	portalWnd.eval("window." + uniqueFcnName + " = function (url, pkg, cntType, outType, dispError) { return httpRequest(url, pkg, cntType, outType, dispError) }");

	// create the data storage using this new function
	var httpRes = null;
	eval("httpRes = this.portalWnd." + uniqueFcnName + "(url, pkg, cntType, outType, false)");

	// clean up portal
	portalWnd.eval("window." + uniqueFcnName + " = null");

	// create a response object
	this.response = new RSResponse(this.portalWnd, httpRes, dispError);
	return (this.response);
}

//-----------------------------------------------------------------------------
// RSElementDef data storage for an element definition.  Useful for column
// typing.
// - name <code>String</code>
// - dspname <code>String</code>
// - type <code>String</code> Known types: "String"
// - size <code>int</code>
// - multivalued <code>boolean</code>
//-----------------------------------------------------------------------------
function RSElementDef(name, dspname, type, size, multivalued)
{
	this.name = name;
	this.dspname = dspname;
	this.type = type;
	this.size = size;
	this.multivalued = multivalued;
}

RSElementDef.ATTR_NAME = "name";
RSElementDef.ATTR_DISPLAYNAME = "dspname";
RSElementDef.ATTR_SIZE = "size";
RSElementDef.ATTR_TYPE = "type";
RSElementDef.ATTR_MULTIVALUED = "multivalued";
RSElementDef.MULTIVALUED_TRUE = "TRUE";
RSElementDef.TYPE_STRING = "String";

//-----------------------------------------------------------------------------
// Creates a new RSElementDef object from a DOM Element object.
// - element <code>DOM element</code>
// - returns <code>RSElementDef</code>
//-----------------------------------------------------------------------------
RSElementDef.fromElement = function(element)
{
	if (!element)
		return null;
		
	// get attributes
	var name = element.getAttribute(RSElementDef.ATTR_NAME);
	var dspname = element.getAttribute(RSElementDef.ATTR_DISPLAYNAME);
	var type = element.getAttribute(RSElementDef.ATTR_TYPE);
	var size = element.getAttribute(RSElementDef.ATTR_SIZE);
	size = size ? parseInt(size, 10) : 0;
	var multivalued = element.getAttribute(RSElementDef.ATTR_MULTIVALUED);
	multivalued = multivalued ? (multivalued == RSElementDef.MULTIVALUED_TRUE) : false;
	
	// create RSElementDef object
	var elementDef = new RSElementDef(name, dspname, type, size, multivalued);
	return elementDef;
}

//-----------------------------------------------------------------------------
RSElementDef.prototype.isValid = function()
{
	var ret = true;
	ret = ret && (this.name != "");
	ret = ret && (this.dspname != "");
	ret = ret && (this.type != "");
	ret = ret && (this.size > 0);
	ret = ret && (this.multivalued != null);
	
	return ret;
}

//-----------------------------------------------------------------------------
// RSRow data storage for a data row.
// Creates a new RSRow object from a DOM Element object.
// Assumes we can ignore the secured attribute.
// - portalWnd <code>Window</code>
// - element <code>Element</code>
//-----------------------------------------------------------------------------
function RSRow(portalWnd, element)
{
	this.portalWnd = portalWnd;
	if (!element)
		return;

	// find attrs
	var arrRowAttrs = element.getElementsByTagName(RSRow.ELEMENT_ROWATTR);
	var lenRowAttrs = (arrRowAttrs ? arrRowAttrs.length : 0);
	if (lenRowAttrs == 0)
		return;
	
	// populate hashtable
	var hash = new Array();	
	for (var i=0;i<lenRowAttrs;i++)
	{
		var attrElement = arrRowAttrs[i];
		var name = this.getAttrName(attrElement);
		var value = this.getAttrValue(attrElement);
		if ((name != null) && (value != null))
			hash[name] = value;
	}
	this.hash = hash;
}

RSRow.ATTR_NAME = "name";
RSRow.ELEMENT_ROWATTR = "ROWATTR";
RSRow.ELEMENT_VALUE = "VALUE";

//-----------------------------------------------------------------------------
RSRow.prototype.getAttrName = function(attrElement)
{
	if (!attrElement)
		return null;
	else
		return attrElement.getAttribute(RSRow.ATTR_NAME);
}

//-----------------------------------------------------------------------------
RSRow.prototype.getAttrValue = function(attrElement)
{
	if (!attrElement)
		return null;
	else
	{
		// find value
		var arrValues = attrElement.getElementsByTagName(RSRow.ELEMENT_VALUE);
		var lenValues = (arrValues ? arrValues.length : 0);
		if (lenValues == 0)
			return null;
		
		var valueElement = arrValues[0];
		return this.getCDATA(valueElement);
	}
}

//-----------------------------------------------------------------------------
// returns as a string the contents of the element's CDATA node
// this version allows line returns and whitespace, outside the CDATA node
// - node should contain a single CDATA node
// - returns "" if no value.
//-----------------------------------------------------------------------------
RSRow.prototype.getCDATA = function(cdata)
{
	var ret = this.portalWnd.cmnGetNodeCDataValue(cdata);
	ret = (ret != null) ? ret : "";
	return ret;
}

//-----------------------------------------------------------------------------
// Return the value of an attribute in the row, given the name of the attribute.
// - name <code>String</code> name of the desired attribute
// - returns <code>String</code> value of the attribute
//-----------------------------------------------------------------------------
RSRow.prototype.getValue = function(name)
{
	return this.hash[name];
}

//-----------------------------------------------------------------------------
RSRow.prototype.isValid = function()
{
	var ret = true;
	ret = ret && (this.hash != null);
	return ret;
}

//-----------------------------------------------------------------------------
// RSResponse manages a response from Resource Search Servlet
// provides assistance with document parsing
// if an error is noticed, this.error will be an error string
// - portalWnd <code>Window</code>, the portal window object, required
// - res <code>HttpResponse</code>
// - dispError <code>boolean</code>
//-----------------------------------------------------------------------------
function RSResponse(portalWnd, res, dispError)
{
	this.arrRowObjs = null;
	if (typeof(dispError)=="undefined")
		dispError = true;
	this.dispError = dispError;
	this.error = "";
	this.nextPage = null;
	this.portalObj = portalWnd.lawsonPortal;
	this.portalWnd = portalWnd;
	this.prevPage = null;
	this.res = null;
	this.resDoc = null;
	this.resDS = null;
	this.rowArray = null;
	this.rowsReturned = null;
	this.service = "RS";
	
	if (res)
		this.parse(res);
}

RSResponse.ELEMENT_ELEMENT = "ELEMENT";
RSResponse.ELEMENT_NEXTPAGE = "NEXTPAGE";
RSResponse.ELEMENT_PREVPAGE = "PREVPAGE";
RSResponse.ELEMENT_ROW = "ROW";
RSResponse.ELEMENT_ROWDEF = "ROWDEF";
RSResponse.ELEMENT_ROWS = "ROWS";
RSResponse.ELEMENT_ROWSRETURNED = "ROWSRETURNED";
RSResponse.ELEMENT_VALUE = "VALUE";

//-----------------------------------------------------------------------------
RSResponse.prototype.createDataStorage = function(res)
{
	var ds = null;
	if (res)
	{
		// throws exception when you try to use this simpler approach
		//ds = new this.portalWnd.DataStorage(res, this.portalWnd);	
		var uniqueFcnName = "DataStorage_RS";
	
		// put a local function on the portal
		portalWnd.eval("window." + uniqueFcnName + " = function (construct, portalWnd) { return new DataStorage(construct,portalWnd) }");

		// create the data storage using this new function
		eval("ds = this.portalWnd." + uniqueFcnName + "(res, this.portalWnd)");
	
		// clean up portal
		portalWnd.eval("window." + uniqueFcnName + " = null");
	}
	return ds;
}

//-----------------------------------------------------------------------------
RSResponse.prototype.getAttrValue = function(attrElement)
{
	if (!attrElement)
		return null;
	else
	{
		// find value
		var arrValues = attrElement.getElementsByTagName(RSResponse.ELEMENT_VALUE);
		var lenValues = (arrValues ? arrValues.length : 0);
		if (lenValues == 0)
			return null;
		
		var cdataElement = arrValues[0];
		return this.getCDATA(cdataElement);
	}
}

//-----------------------------------------------------------------------------
// returns as a string the contents of the CDATA element
// - cdata is an CDATA node
// - returns "" if no value.
//-----------------------------------------------------------------------------
RSResponse.prototype.getCDATA = function(cdata)
{
	var ret = this.portalWnd.cmnGetNodeCDataValue(cdata);
	ret = (ret != null) ? ret : "";
	return ret;
}

//-----------------------------------------------------------------------------
// Returns the element definitions (column definitions, really), as an array
// of RSElement objects.  If the response was an error, returns null.
//-----------------------------------------------------------------------------
RSResponse.prototype.getElementDefArray = function()
{
	if (this.error)
	    return null;
	
	var arrRowDef = this.resDoc ? this.resDoc.getElementsByTagName(RSResponse.ELEMENT_ROWDEF) : null;
	var lenRowDef = (arrRowDef ? arrRowDef.length : 0);
	if (lenRowDef == 0)
		return null;
		
	var arrElements = arrRowDef[0].getElementsByTagName(RSResponse.ELEMENT_ELEMENT);
	var lenElements = (arrElements ? arrElements.length : 0);
	if (lenElements == 0)
		return null;
		
	var arrElementDef = new Array();
	for (var i=0;i<lenElements;i++)
	{
		var element = arrElements[i];
		var elementDef = RSElementDef.fromElement(element);
		if (elementDef)
			arrElementDef[arrElementDef.length] = elementDef;
	}
		
	return arrElementDef;
}

//-----------------------------------------------------------------------------
// Returns the element definitions (column definitions, really), as an array
// of RSElement objects.  If the response was an error, returns null.
//-----------------------------------------------------------------------------
RSResponse.prototype.getRowArray = function()
{
	if (this.arrRowObjs)
		return this.arrRowObjs;
	if (this.error)
	    return null;
	var arrRowsNodes = (this.resDoc ? this.resDoc.getElementsByTagName(RSResponse.ELEMENT_ROWS) : null);
	var lenRowsNodes = (arrRowsNodes ? arrRowsNodes.length : 0);
	if (lenRowsNodes == 0)
		return null;
		
	var arrRowNodes = arrRowsNodes[0].getElementsByTagName(RSResponse.ELEMENT_ROW);
	var lenRowNodes = (arrRowNodes ? arrRowNodes.length : 0);
	if (lenRowNodes == 0)
		return null;
		
	var arrRowObjs = new Array();
	for (var i=0;i<lenRowNodes;i++)
	{
		var element = arrRowNodes[i];
		var row = new RSRow(this.portalWnd, element);
		if (row && row.isValid())
			arrRowObjs[arrRowObjs.length] = row;
	}
	this.arrRowObjs = arrRowObjs;
		
	return arrRowObjs;
}

//-----------------------------------------------------------------------------
// Returns the next page number.
// - return <code>int</code>
//-----------------------------------------------------------------------------
RSResponse.prototype.getNextPage = function()
{
	if (this.nextPage != null)
		return this.nextPage;
	if (this.error)
	    return 0;
	var arrRowsRet = (this.resDoc ? this.resDoc.getElementsByTagName(RSResponse.ELEMENT_NEXTPAGE) : null);
	var lenRowsRet = (arrRowsRet ? arrRowsRet.length : 0);
	if (lenRowsRet == 0)
		return 0;
		
	var rowsElement = arrRowsRet[0];
	var rowsStr = this.getAttrValue(rowsElement);
	var nextPage = parseInt(rowsStr, 10);
	this.nextPage = nextPage;
	return nextPage;
}

//-----------------------------------------------------------------------------
// Returns the previous page number.
// - return <code>int</code> 0 if not available
//-----------------------------------------------------------------------------
RSResponse.prototype.getPrevPage = function()
{
	if (this.prevPage != null)
		return this.prevPage;
	if (this.error)
	    return 0;
	var arrRowsRet = (this.resDoc ? this.resDoc.getElementsByTagName(RSResponse.ELEMENT_PREVPAGE) : null);
	var lenRowsRet = (arrRowsRet ? arrRowsRet.length : 0);
	if (lenRowsRet == 0)
		return 0;
	var rowsElement = arrRowsRet[0];
	var rowsStr = this.getAttrValue(rowsElement);
	var prevPage = parseInt(rowsStr, 10);
	this.prevPage = prevPage;
	return prevPage;
}

//-----------------------------------------------------------------------------
// Returns the reported number of rows returned (not necessarily valid & 
// stored).
// - return <code>int</code>
//-----------------------------------------------------------------------------
RSResponse.prototype.getRowsReturned = function()
{
	if (this.rowsReturned != null)
		return this.rowsReturned;
	if (this.error)
	    return 0;
	var arrRowsRet = (this.resDoc ? this.resDoc.getElementsByTagName(RSResponse.ELEMENT_ROWSRETURNED) : null);
	var lenRowsRet = (arrRowsRet ? arrRowsRet.length : 0);
	if (lenRowsRet == 0)
		return 0;
	var rowsElement = arrRowsRet[0];
	var rowsStr = this.getAttrValue(rowsElement);
	rowsReturned = parseInt(rowsStr, 10);
	this.rowsReturned = rowsReturned;
	return rowsReturned;
}

//-----------------------------------------------------------------------------
// Returns whether the response was considered completely valid.
//-----------------------------------------------------------------------------
RSResponse.prototype.isValid = function()
{
	return (!this.error);
}

//-----------------------------------------------------------------------------
// RSResponse manages a response from Resource Search Servlet
// provides assistance with document parsing.
// Sets error to a non-empty string, if there is an HTTP status, the return
// is null, cannot create a data storage, or if it is empty.
// Also populates the row data array.
// - res <code>DOM</code>
// - return <code>boolean</code> whether the parsing was successful
//-----------------------------------------------------------------------------
RSResponse.prototype.parse=function(res)
{
	this.res = res; // raw response - from httpRequest
	this.resDS = null; // data storage of response
	this.resDoc = null;
	this.error = "";
	
	// phrases
	var stdError = this.portalObj.getPhrase("msgErrorReportedBy") + " " + this.service;
	
	// check null, status
	var bBadResponse = this.portalWnd.oError.handleBadResponse(res, this.dispError, stdError, window);
	if (bBadResponse)
	{
		this.error = stdError;
		return false;
	}
			
	// save datastorage reference
	var resType = typeof(res);
	if (resType == "string")
	{
		this.resDS = this.createDataStorage(res);
	}
	else if (resType == "object")
	{
		this.resDS = this.createDataStorage(this.portalWnd.oBrowser.isIE?res.xml:res);
	}
	if (this.resDS.isErrorDoc())
	{
		this.error = stdError;
		this.portalWnd.oError.displayIOSErrorMessage(this.resDS, true, stdError, window);
		return false;
	}
	
	// save document reference
	if (this.resDS.isEmptyDoc())
	{
		this.error = stdError;
		this.portalWnd.oError.handleBadResponse(null, this.dispError, stdError, window);
		return false;
	}
	this.resDoc = (this.resDS ? this.resDS.document : null);
	
	// store row data - valid/ok if no data.
	var arrRowObjs=this.getRowArray();
	if (arrRowObjs == null)
	{
	}
	return true;
}

//-----------------------------------------------------------------------------
RSResponse.prototype.toXML = function()
{
	if (!this.isValid())
		return null;
	else
		return this.resDoc ? this.resDoc.xml : null;
}