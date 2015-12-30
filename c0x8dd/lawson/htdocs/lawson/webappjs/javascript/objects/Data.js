/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/Data.js,v 1.21.2.5.2.2 2014/01/10 14:29:55 brentd Exp $ */
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
//	DEPENDENCIES:
//		common.js
//-----------------------------------------------------------------------------
//
//	PARAMETERS:
//		mainWnd			(optional) location of the common.js file
//		techVersion		(optional) defaults to 9.0.0
//		httpRequest		(optional) reference to a request method (i.e. SSORequest, httpRequest, etc..)
//							if null, the call() method will always return null
//		funcAfterCall	(optional) function to run after the data call is executed
//-----------------------------------------------------------------------------
function DataObject(mainWnd, techVersion, httpRequest, funcAfterCall)
{
	this.mainWnd = mainWnd || window;
	this.httpRequest = httpRequest || null;
	this.techVersion = techVersion || DataObject.TECHNOLOGY_900;
	this.funcAfterCall = funcAfterCall;
	this.isPost = true;
	this.showErrors = true;
	this.encoding = null;
	this.escapeFunc = this.mainWnd.cmnEscapeIt || this.mainWnd.escape;
	this.dom = null;

	// arrays for fields
	this.paramsAry = new Array();
	this.oneTimeParamsAry = new Array();

	// private fields (for DataObject only!)
	this.nbrRecs = null;
	this.prevCall = null;
	this.nextCall = null;
	this.reloadCall = null;
	this.columns = new Array();
	this.records = new Array();
	this.drillCall = null;
	this.isPrev = false;
	this.isNext = false;	
}
//-- static variables ---------------------------------------------------------
DataObject.TECHNOLOGY_803 = "8.0.3";
DataObject.TECHNOLOGY_900 = "9.0.0";
DataObject.DATA_URL_803 = "/servlet/dme";
DataObject.DATA_URL_900 = "/servlet/Router/Data/Erp";
//-----------------------------------------------------------------------------
DataObject.prototype.setParameter = function(name, value, oneTimeOnly)
{
	if (oneTimeOnly)
		this.oneTimeParamsAry[name] = value;
	else
		this.paramsAry[name] = value;
}
//-----------------------------------------------------------------------------
DataObject.prototype.removeParameter = function(name, oneTimeOnly)
{
	if (oneTimeOnly)
		this.setParameter(name, null, oneTimeOnly);
	else
		this.setParameter(name, null);
}
//-----------------------------------------------------------------------------
DataObject.prototype.resetPrivateVars = function()
{
	this.nbrRecs = null;
	this.prevCall = null;
	this.nextCall = null;
	this.reloadCall = null;
	this.columns = new Array();
	this.records = new Array();
}
//-----------------------------------------------------------------------------
DataObject.prototype.getParameter = function(name, oneTimeOnly)
{
	if (oneTimeOnly)
		return (this.oneTimeParamsAry[name] || null);
	else
		return (this.paramsAry[name] || null);
}
//-----------------------------------------------------------------------------
DataObject.prototype.setEncoding = function(encoding)
{
	this.encoding = encoding || null;
	if (this.encoding != null && typeof(this.mainWnd["escapeForCharset"]) != "undefined")
		this.escapeFunc = this.mainWnd.escapeForCharset;
}
//-----------------------------------------------------------------------------
DataObject.prototype.getUrl = function()
{
	var url = (this.techVersion == DataObject.TECHNOLOGY_900)
			? DataObject.DATA_URL_900
			: DataObject.DATA_URL_803;
	return (url + "?" + this.getQuery());
}
//-----------------------------------------------------------------------------
DataObject.prototype.getQuery = function()
{
	var query = "";
	if (this.techVersion == DataObject.TECHNOLOGY_803)
		query += "OUT=XML&";

	for (var i in this.paramsAry)
	{
		var val = this.paramsAry[i];
		if (val == null)
			continue;

		// if it is a GET or contains a & or %, it needs to be escaped
		val = "" + val;
		if (!this.isPost || val.indexOf("&") != -1 || val.indexOf("%") != -1 || val.indexOf("+") != -1 || this.encoding)
			val = this.escapeFunc(val);
		query += i + "=" + val + "&";
	}
	
	// one time manual parameters, which are assumed to be escaped
	for (var j in this.oneTimeParamsAry)
	{
		var val = this.oneTimeParamsAry[j];
		if (val == null)
			continue;

		query += j + "=" + val + "&";
	}
	this.oneTimeParamsAry = new Array();

	// remove the ending "&" and return it
	return query.substring(0, query.length-1);
}
//-----------------------------------------------------------------------------
DataObject.prototype.callData = function(addToUrl)
{
    if (arguments.length>0 && !addToUrl)
        return null;

	if (!this.httpRequest)
		return null;

	this.resetPrivateVars();
	if (this.isPost)
	{
		var url = (this.techVersion == DataObject.TECHNOLOGY_900)
				? DataObject.DATA_URL_900
				: DataObject.DATA_URL_803;
		var query = this.getQuery() + (addToUrl || "");
		var cntType = "application/x-www-form-urlencoded";
		if (this.encoding)
			cntType += "; charset=" + this.encoding;		
		this.dom = this.httpRequest(url, query, cntType, null, this.showErrors);
	}
	else
	{
		var cntType = (this.encoding) ? "text/xml; charset=" + this.encoding : null;
		this.dom = this.httpRequest(this.getUrl() + (addToUrl || ""), null, cntType, null, this.showErrors);
	}
	if (this.funcAfterCall)
		this.funcAfterCall();

	return this.dom;
}
//-----------------------------------------------------------------------------
DataObject.prototype.isNextCall = function()
{	
	return this.isNext;
}
//-----------------------------------------------------------------------------
DataObject.prototype.isPrevCall = function()
{	
	return this.isPrev;
}
//-----------------------------------------------------------------------------
DataObject.prototype.callNext = function()
{	
	this.isPrev = false;
	this.isNext = true;
	return (this.getNextCall())
			? this.callData(this.getNextCall())
			: null;
}
//-----------------------------------------------------------------------------
DataObject.prototype.callPrev = function()
{	
	this.isPrev = true;
	this.isNext = false;
	return (this.getPrevCall())
			? this.callData(this.getPrevCall())
			: null;
}
//-----------------------------------------------------------------------------
DataObject.prototype.reload = function()
{
	this.isPrev = false;
	this.isNext = false;
	return (this.getReloadCall())
			? this.callData(this.getReloadCall())
			: null;
}
//-----------------------------------------------------------------------------
DataObject.prototype.getNbrRecs = function()
{
	if (this.nbrRecs == null && this.dom)
		this.nbrRecs = this.dom.getElementsByTagName("RECORD").length;
	return this.nbrRecs;
}
//-----------------------------------------------------------------------------
DataObject.prototype.getColumnIndex = function(name)
{
	if (!name)
		return null;

	// set up the columns array
	if (this.columns.length == 0 && this.dom)
		this.getColumnName(0);

	var idx = this.columns[name.toUpperCase()];
	if (typeof(idx) == "undefined")
		return null;
	else
		return idx;
}
//-----------------------------------------------------------------------------
DataObject.prototype.getColumnName = function(idx)
{
	if (typeof(idx) != "number")
		return null;

	if (this.columns.length == 0 && this.dom)
	{
		var columnNodes = this.dom.getElementsByTagName("COLUMN");
		for (var i=0; i<columnNodes.length; i++)
		{
			// index the columns array by number and string
			var fldName = columnNodes[i].getAttribute("header");
			if (fldName != null)
			{
				fldName = fldName.split("_").join("-").toUpperCase();
				this.columns[i] = fldName;
				this.columns[fldName] = i;
			}
		}
	}

	if (idx < 0 || idx > this.columns.length-1)
		return null;
	else
		return this.columns[idx];
}
//-----------------------------------------------------------------------------
DataObject.prototype.getRecord = function(idx)
{
	if (typeof(idx) != "number")
		return null;

	if (this.records.length == 0 && this.dom)
	{
		var recordNodes = this.dom.getElementsByTagName("RECORD");
		for (var i=0; i<recordNodes.length; i++)
			this.records[i] = new RecordObject(this, recordNodes[i]);
	}

	if (idx < 0 || idx > this.records.length-1)
		return null;
	else
		return this.records[idx];
}
//-----------------------------------------------------------------------------
DataObject.prototype.getNextCall = function()
{
	if (this.nextCall == null && this.dom)
	{
		// loop backwards through just the children of the top node
		// NEXTCALL is always towards the end
		for (var i=this.dom.documentElement.childNodes.length-1; i>=0; i--)
		{
			var node = this.dom.documentElement.childNodes[i];
			if (node.nodeName.toUpperCase() == "NEXTCALL")
			{
				this.nextCall = this.mainWnd.cmnGetNodeCDataValue(node);

				// add a prepending "&"
				if (this.nextCall.substring(0,1) != "&")
					this.nextCall = "&" + this.nextCall;
	
				// remove the ending "&"
				if (this.nextCall.substring(this.nextCall.length-1) == "&")
					this.nextCall = this.nextCall.substring(0, this.nextCall.length-1);

				break;
			}
		}
	}
	return this.nextCall;
}
//-----------------------------------------------------------------------------
DataObject.prototype.getPrevCall = function()
{
	if (this.prevCall == null && this.dom)
	{
		// loop backwards through just the children of the top node
		// PREVCALL is always towards the end
		for (var i=this.dom.documentElement.childNodes.length-1; i>=0; i--)
		{
			var node = this.dom.documentElement.childNodes[i];
			if (node.nodeName.toUpperCase() == "PREVCALL")
			{
				this.prevCall = this.mainWnd.cmnGetNodeCDataValue(node);

				// add a prepending "&"
				if (this.prevCall.substring(0,1) != "&")
					this.prevCall = "&" + this.prevCall;

				// remove the ending & for 8.0.3 technology
				if (this.prevCall.substring(this.prevCall.length-1) == "&")
					this.prevCall = this.prevCall.substring(0, this.prevCall.length-1);

				break;
			}
		}
	}
	return this.prevCall;
}
//-----------------------------------------------------------------------------
DataObject.prototype.getReloadCall = function()
{
	if (this.reloadCall == null && this.dom)
	{
		var reloadNodes = this.dom.getElementsByTagName("RELOAD");
		if (reloadNodes.length > 0)
		{
			this.reloadCall = this.mainWnd.cmnGetNodeCDataValue(reloadNodes[0]);

			// add a prepending "&"
			if (this.reloadCall.substring(0,1) != "&")
				this.reloadCall = "&" + this.reloadCall;

			// remove the ending & for 8.0.3 technology
			if (this.reloadCall.substring(this.reloadCall.length-1) == "&")
				this.reloadCall = this.reloadCall.substring(0, this.reloadCall.length-1);
		}
	}
	return this.reloadCall;
}
//-----------------------------------------------------------------------------
DataObject.prototype.getDrillCall = function()
{
	if (this.drillCall == null && this.dom)
	{
		var drillNodes = this.dom.getElementsByTagName("IDABASE");
		if (drillNodes.length > 0)
		{
			var drillNode = drillNodes[0];
			this.drillCall = drillNode.getAttribute("executable") + "?" + this.mainWnd.cmnGetNodeCDataValue(drillNodes[0]);
		}
	}
	return this.drillCall;
}
//-- end data object code
//-----------------------------------------------------------------------------



//-----------------------------------------------------------------------------
//-- start record object code
function RecordObject(dataObj, recordNode)
{
	this.dataObj = dataObj;
	this.recordNode = recordNode;
	this.colNodes = null;
	this.nbrRelRecs = null;
	this.relRecsAry = null;
	this.drillUrl = null;
}
//-----------------------------------------------------------------------------
RecordObject.prototype.getNbrRelRecs = function()
{
	if (this.nbrRelRecs == null)
		this.nbrRelRecs = this.recordNode.getElementsByTagName("RELRECS").length;
	return this.nbrRelRecs;
}
//-----------------------------------------------------------------------------
RecordObject.prototype.getRelatedRecordsName = function(idx)
{
	if (typeof(idx) != "number" || this.getNbrRelRecs() == 0)
		return null;

	if (this.relRecsAry == null)
	{
		this.relRecsAry = new Array();
		var relRecsNodes = this.recordNode.getElementsByTagName("RELRECS");
		for (var i=0; i<relRecsNodes.length; i++)
			this.relRecsAry[i] = new RelatedRecordsObject(this, relRecsNodes[i]);
	}

	if (idx < 0 || idx > this.relRecsAry.length-1)
		return null;

	return this.relRecsAry[idx].getName();
}
//-----------------------------------------------------------------------------
RecordObject.prototype.getRelatedRecords = function(strOrNbr)
{
	if ((typeof(strOrNbr) != "string" && typeof(strOrNbr) != "number") || this.getNbrRelRecs() == 0)
		return null;

	// make sure the relRecsAry is populated!
	this.getRelatedRecordsName(-1);

	var nbr = -1;
	if (typeof(strOrNbr) == "string")
	{
		// find out if a name matches
		for (var i=0; i<this.getNbrRelRecs(); i++)
		{
			if (strOrNbr.toUpperCase() == this.relRecsAry[i].getName())
			{
				nbr = i;
				break;
			}
		}
	}
	else
		nbr = strOrNbr;

	if (nbr < 0 || nbr > this.relRecsAry.length-1)
		return null;

	return this.relRecsAry[nbr];
}
//-----------------------------------------------------------------------------
RecordObject.prototype.getIndex = function()
{
	for (var i=0; i<this.dataObj.getNbrRecs(); i++)
		if (this.dataObj.records[i] == this)
			return i;
	return null;
}
//-----------------------------------------------------------------------------
RecordObject.prototype.getColValue = function(idx)
{
	if (typeof(idx) != "number")
		return null;

	var cols = this.getColNodes();
	if (idx < 0 || idx > cols.length-1)
		return null;

	var occNodes = cols[idx].getElementsByTagName("OCC");
	if (occNodes.length > 0)
	{
		var occAry = new Array();
		for (var i=0; i<occNodes.length; i++)
			occAry[i] = this.dataObj.mainWnd.cmnGetNodeCDataValue(occNodes[i]);
		return occAry;
	}
	else
		return this.dataObj.mainWnd.cmnGetNodeCDataValue(cols[idx]);
}
//-----------------------------------------------------------------------------
RecordObject.prototype.getColNode = function(idx)
{
	if (typeof(idx) != "number")
		return null;

	var cols = this.getColNodes();
	if (idx < 0 || idx > cols.length-1)
		return null;

	return cols[idx];
}
//-----------------------------------------------------------------------------
RecordObject.prototype.getFieldValue = function(fieldName)
{
	return this.getColValue(this.dataObj.getColumnIndex(fieldName));
}
//-----------------------------------------------------------------------------
RecordObject.prototype.getColNodes = function()
{
	if (this.colNodes == null)
		this.colNodes = this.recordNode.getElementsByTagName("COL");
	return this.colNodes;
}
//-----------------------------------------------------------------------------
RecordObject.prototype.getDrillUrl = function()
{
	if (this.drillUrl == null && this.dataObj)
	{
		if (this.dataObj.drillCall == null)
			this.dataObj.getDrillCall();	
		var drillNodes = this.recordNode.getElementsByTagName("IDACALL");
		if (drillNodes.length > 0)
			this.drillUrl = this.dataObj.drillCall + this.dataObj.mainWnd.cmnGetNodeCDataValue(drillNodes[0]);
	}
	return this.drillUrl;
}
//-- end record object code
//-----------------------------------------------------------------------------


//-----------------------------------------------------------------------------
//-- start related records object code
function RelatedRecordsObject(recordObj, relRecsNode)
{
	this.recordObj = recordObj;
	this.dataObj = recordObj.dataObj;
	this.relRecsNode = relRecsNode;
	this.name = null;
	this.nbrRecs == null;
	this.columns = new Array();
	this.nextCall = null;
}
//-----------------------------------------------------------------------------
RelatedRecordsObject.prototype.getName = function()
{
	if (this.name == null && this.relRecsNode)
	{
		this.name = this.relRecsNode.getAttribute("name");
		if (this.name != null)
			this.name = this.name.split("_").join("-").toUpperCase();
	}
	return this.name;
}
//-----------------------------------------------------------------------------
RelatedRecordsObject.prototype.getNbrRecs = function()
{
	if (this.nbrRecs == null && this.relRecsNode)
		this.nbrRecs = this.relRecsNode.getElementsByTagName("RELREC").length;
	return this.nbrRecs;
}
//-----------------------------------------------------------------------------
RelatedRecordsObject.prototype.getNbrColumns = function()
{
	// set up the columns array first!
	if (this.columns.length == 0)
		this.getColumnName(0);
	return this.columns.length;
}
//-----------------------------------------------------------------------------
RelatedRecordsObject.prototype.getColumnIndex = function(name)
{
	if (!name)
		return null;

	// set up the columns array first!
	if (this.columns.length == 0)
		this.getColumnName(0);

	var idx = this.columns[name.toUpperCase()];
	if (typeof(idx) == "undefined")
		return null;
	else
		return idx;
}
//-----------------------------------------------------------------------------
RelatedRecordsObject.prototype.getColumnName = function(idx)
{
	if (typeof(idx) != "number")
		return null;

	if (this.columns.length == 0)
	{
		// make sure the columns array on the dataObj is ready!
		if (this.dataObj.columns.length == 0)
			this.dataObj.getColumnName(0);

		var len = this.dataObj.columns.length;
		for (var i=0; i<len; i++)
		{
			// index the relColumns array by number and string
			var colName = this.dataObj.getColumnName(i);
			if (colName != null && colName.indexOf(this.getName() + ".") == 0)
			{
				var colIdx = this.columns.length;
				this.columns[colIdx] = colName;
				this.columns[colName] = colIdx;
			}
		}
	}

	if (idx < 0 || idx > this.columns.length-1)
		return null;
	else
		return this.columns[idx];
}
//-----------------------------------------------------------------------------
RelatedRecordsObject.prototype.getValue = function(recIdx, colIdxOrName)
{
	if (typeof(recIdx) != "number" || recIdx < 0 || recIdx > this.getNbrRecs()-1)
		return null;

	var colIdx = -1;
	if (typeof(colIdxOrName) == "string")
		colIdx = this.getColumnIndex(colIdxOrName);
	else if (typeof(colIdxOrName) == "number")
		colIdx = colIdxOrName;

	if (colIdx < 0 || colIdx > this.getNbrColumns()-1)
		return null;

	try
	{
		var relRecNodes = this.relRecsNode.getElementsByTagName("RELREC");
		var colNodes = relRecNodes[recIdx].getElementsByTagName("COL");
		return this.dataObj.mainWnd.cmnGetNodeCDataValue(colNodes[colIdx]);
	}
	catch (e)
	{
		return null;
	}
}
//-----------------------------------------------------------------------------
RelatedRecordsObject.prototype.getNextCall = function()
{
	if (this.nextCall == null && this.relRecsNode)
	{
		var nextCallNodes = this.relRecsNode.getElementsByTagName("NEXTCALL");
		if (nextCallNodes.length > 0)
			this.nextCall = this.dataObj.mainWnd.cmnGetNodeCDataValue(nextCallNodes[0]);
	}
	return this.nextCall;
}
//-----------------------------------------------------------------------------
RelatedRecordsObject.prototype.getDataObjForNextCall = function()
{
	if (!this.getNextCall())
		return null;

	var relDataObj = new DataObject(this.dataObj.mainWnd, this.dataObj.techVersion, this.dataObj.httpRequest, null);
	relDataObj.showErrors = this.dataObj.showErrors;	
	var nextAry = this.getNextCall().split("&");
	for (var i=0; i<nextAry.length; i++)
	{
		var nAry = nextAry[i].split("=");
		var oneTimeParam = (nAry.length > 0 && (nAry[0] == "PREV" || nAry[0] == "BEGIN")) ? true : false;	 
		switch (nAry.length)
		{
			case 0:
				break;
			case 1:
				relDataObj.setParameter(nAry[0], "", oneTimeParam);
				break;
			case 2:
				relDataObj.setParameter(nAry[0], nAry[1], oneTimeParam);
				break;				
			default:
				relDataObj.setParameter(nAry[0], nextAry[i].substring(nextAry[i].indexOf("=")+1), oneTimeParam);
				break;
		}
	}
	return relDataObj;
}
//-- end related records object code
//-----------------------------------------------------------------------------
