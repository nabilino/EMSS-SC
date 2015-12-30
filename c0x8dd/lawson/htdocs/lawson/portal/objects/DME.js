/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/Attic/DME.js,v 1.1.2.7.4.9.14.1.2.3 2012/08/08 12:37:30 jomeli Exp $ */
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
//
// This package is a collection of JavaScript API objects to assist with typical
// DME calls within Lawson Portal.  These objects assume that you pass the portal
// as the portalWnd attribute (usually is the top window).
//
// Since DME can return much more data than is really required,
// ideally the query and received data should be constructed efficiently as
// possible.  Using the field, max, index, and select parameters to limit return
// data can speed the DME queries. INDEX sorting is global,
// whereas sortasc and sortdesc are local.
//
// For more information on DME, consult http://support.lawson.com documentation.
//
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// DMEFields
// mapping object
//-----------------------------------------------------------------------------
function DMEFields()
{
	this._fields = new Array();
	this._pos = new Array();
	
	var len = arguments.length;
	for (var i=0;i<len;i++)
	{
		this._fields[i] = arguments[i];
		this._pos[arguments[i]] = i;
	}
}

DMEFields.prototype.pos = function(field)
{
	return this._pos[field];
}

DMEFields.prototype.toString = function()
{
	// returns string for DME query
	return this._fields.join(";");
}

//-----------------------------------------------------------------------------
// DMERequest
// create a request object
// performs call in getResponse
//-----------------------------------------------------------------------------
function DMERequest(portalWnd, query)
{
	// object which calls DME and creates a DMEResponse object from the returned data
	this.query = query;
	
	this.portalWnd = portalWnd;
	this.response = null;
}

//-----------------------------------------------------------------------------
// - dispError <code>boolean</code>, optional
//-----------------------------------------------------------------------------
DMERequest.prototype.getResponse = function(dispError)
{
	var url = this.portalWnd.DMEPath + "?" + this.query;
	var pkg = null;
	var cntType = null;
	var outType = "text/xml";
	var httpRes = this.portalWnd.httpRequest(url, pkg, cntType, outType, false);
	
	// create a response object
	dispError = dispError ? true : false;
	this.response = new DMEResponse(this.portalWnd,httpRes,dispError);
	return (this.response);
}

//-----------------------------------------------------------------------------
// DMEResponse
// examines a response from DME with OUT=XML
// provides assistance with document parsing
// if an error is noticed, this.error will be an error string
//-----------------------------------------------------------------------------
function DMEResponse(portalWnd, res, dispError)
{
	// res - response datastorage from httpRequest
	this.dispError=dispError ? true : false;
	this.error="";
	this.portalObj = portalWnd.lawsonPortal;
	this.portalWnd = portalWnd;
	this.res=null;
	this.resDS=null;
	this.resDoc=null;
	this.service = "DME";

	if (res)
		this.parse(res);
}

//-----------------------------------------------------------------------------
DMEResponse.prototype.createDataStorage = function(res)
{
	var ds = null;
	if (res)
	{
		// throws exception when you try to use this simpler approach
		//ds = new this.portalWnd.DataStorage(res, this.portalWnd);	
		var uniqueFcnName = "DataStorage_DME";
	
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
// returns as a string the contents of the CDATA node from a DME XML document
// - cdata <code>Element</code>
// - returns "" if no value.
//-----------------------------------------------------------------------------
DMEResponse.prototype.getCDATA = function(cdata)
{
	var ret = this.portalWnd.cmnGetNodeCDataValue(cdata);
	ret = (ret != null) ? ret : "";
	return ret;
}

//-----------------------------------------------------------------------------
DMEResponse.prototype.getColumn = function(column)
{
	// returns a column node [COLUMNS/COLUMN] from a DME XML document
	// column is the [0..cols]th COLUMN
	// returns null if error or column is greater than number of columns
	if (this.error)
		return null;
	var arrCols = this.resDoc.getElementsByTagName("COLUMNS");
	var lenCols = (arrCols ? arrCols.length : 0);
	if (!lenCols)
		return null;
	var arrCol = arrCols[0].getElementsByTagName("COLUMN");
	var lenCol = (arrCol ? arrCol.length : 0);
	if (column>=lenCol)
		return null;
	return arrCol[column];
}
 
//-----------------------------------------------------------------------------
DMEResponse.prototype.getColumnHeader = function(column)
{
	// returns as a string, the column field header title from the
	// [COLUMNS/COLUMN] node from a DME XML document
	// column is the [0..cols]th COLUMN
	// returns "" if error or column is greater than number of columns
	var col=this.getColumn(column);
	return (col?col.getAttribute("header"):"");
}

//-----------------------------------------------------------------------------
DMEResponse.prototype.getColumnDspName = function(column)
{
	// returns as a string, the column field display name from the
	// [COLUMNS/COLUMN] node from a DME XML document
	// column is the [0..cols]th COLUMN
	// returns "" if error or column is greater than number of columns
	var col=this.getColumn(column);
	return (col ? col.getAttribute("dspname") : "");
}

//-----------------------------------------------------------------------------
DMEResponse.prototype.getColumnOcc = function(column)
{
	// returns as an integer, the column occurrence length
	// [COLUMNS/COLUMN] from a DME XML document
	// column is the [0..cols]th COLUMN
	// returns -1 if error or column is greater than number of columns
	// returns -1 if there is no occurrence specified
	var col=this.getColumn(column);
	if (!col)
		return -1;
	try	{
		var nOccurs=col.getAttribute("nOccurs");
		return (nOccurs ? parseInt(nOccurs,10) : -1);

	} catch (e)	{
		return -1;
	}
}

//-----------------------------------------------------------------------------
DMEResponse.prototype.getColumnSize = function(column)
{
	// returns as an integer, the column field size from the
	// [COLUMNS/COLUMN] node from a DME XML document
	// column is the [0..cols]th COLUMN
	// returns -1 if error or column is greater than number of columns
	// note that although there is an attribute returned by dme.exe, OccurSize,
	// it is the same value as the COLUMN size attribute (DEV802 dme.c 1.1.2.4)
	var col=this.getColumn(column);
	if (!col)
		return -1;
	try	{
		var size=col.getAttribute("size");
		return (size ? parseInt(size,10) : -1);

	} catch (e)	{
		return -1;
	}
}

//-----------------------------------------------------------------------------
DMEResponse.prototype.getColumnType = function(column)
{
	// returns as a string, the column type from the
	// [COLUMNS/COLUMN] node from a DME XML document
	// column is the [0..cols]th COLUMN
	// returns "" if error or column is greater than number of columns
	var col=this.getColumn(column);
	if (!col)
		return "";
	return col.getAttribute("type");
}

//-----------------------------------------------------------------------------
DMEResponse.prototype.getDoc = function()
{
	// returns a direct access to the XML document
	// useful if you want to create custom parsing routines,
	// otherwise use the methods provided in DMEResponse.
	return this.resDoc;
}

//-----------------------------------------------------------------------------
DMEResponse.prototype.getNbrColumns = function()
{
	// returns the number of columns returned
	// or -1 if error or 0 if no columns tag
	if (this.error)
		return -1;
	var arrCols = this.resDoc.getElementsByTagName("COLUMNS");
	var lenCols = (arrCols ? arrCols.length : 0);
	if (!lenCols)
		return 0;
	var arrCol = arrCols[0].getElementsByTagName("COLUMN");
	return (arrCol ? arrCol.length : 0);
}

//-----------------------------------------------------------------------------
DMEResponse.prototype.getNbrRecs = function()
{
	// returns the number of records
	// or -1 if error or 0 if no RECORD tags
	if (this.error)
		return -1;
	var arrRec = this.resDoc.getElementsByTagName("RECORD");
	var count = (arrRec && arrRec.length ? arrRec.length : 0);
	return (count ? parseInt(count,10) : 0);
}

//-----------------------------------------------------------------------------
DMEResponse.prototype.getRecord = function(record)
{
	// returns a record or row [RECORD/COLS] node from a DME XML document
	// record is the [0..n]th record occurence
	// returns null if error or record is greater than number of records
	if (this.error)
		return null;
	var arrRec = this.resDoc.getElementsByTagName("RECORD");
	var lenRec = (arrRec ? arrRec.length : 0);
	if (record>=lenRec)
		return null;
	return arrRec[record];
}

//-----------------------------------------------------------------------------
DMEResponse.prototype.getRecordColumn = function(record,column)
{
	// returns a column node [RECORDS/RECORD/COLS/COL] from a DME XML document
	// column is the [0..cols]th COL
	// returns null if error or column is greater than number of columns
	if (this.error)
		return null;
	var rec=this.getRecord(record)
	if (!rec)
		return null;
	var arrCol = rec.getElementsByTagName("COL");
	var lenCol = (arrCol ? arrCol.length : 0);
	if (column>=lenCol)
		return null;
	return arrCol[column];
}

//-----------------------------------------------------------------------------
DMEResponse.prototype.getRecordValue = function(record,column,occurrence)
{
	// returns as a string the contents of the CDATA node from a DME XML document
	// record is the [0..n]th record occurence
	// column is the [0..cols] column
	// occurrence is the [0..occ] occurrence (special case when column has nOccurs)
	// returns null if error or record is greater than number of records
	if (this.error)
		return null;
	var col=this.getRecordColumn(record,column);
	if (!col)
		return null;

	// occurence requires one level deeper
	if (occurrence==null || occurrence==-1)
		return this.getCDATA(col);
	else
	{
		var arrOcc = col.getElementsByTagName("OCC");
		var lenOcc = (arrOcc ? arrOcc.length : 0);
		if (occurrence>=lenOcc)
			return null;
		return this.getCDATA(arrOcc[occurrence]);
	}	
	return null;
}

//-----------------------------------------------------------------------------
// Returns whether the response was considered completely valid.
//-----------------------------------------------------------------------------
DMEResponse.prototype.isValid = function()
{
	return (!this.error);
}

//-----------------------------------------------------------------------------
// Sets error to a non-empty string, if there is an HTTP status, the return
// is null, cannot create a data storage, or if it is empty.
// - res <code>DOM</code>
// - return <code>boolean</code> whether the parsing was successful
//-----------------------------------------------------------------------------
DMEResponse.prototype.parse=function(res)
{
	this.res=res;
	this.resDS=null;
	this.resDoc=null;
	this.error="";

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
		this.resDS = this.createDataStorage(res);
	else if (resType == "object")
		this.resDS = this.createDataStorage(this.portalWnd.oBrowser.isIE?res.xml:res);

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

	// check message node
	var arrMsgs=this.resDS.document.getElementsByTagName("MESSAGE")
	var lenMsgs=(arrMsgs?arrMsgs.length:0)
	if (lenMsgs && (arrMsgs[0].getAttribute("status")=="1"))
	{
		this.error = this.portalObj.getPhrase("LBL_ERROR") + " - " + arrMsgs[0].firstChild.nodeValue;
		this.portalWnd.cmnDlg.messageBox(this.error,"ok","stop", window);
		return false;
	}	

	this.resDoc = (this.resDS ? this.resDS.document : null);
}
