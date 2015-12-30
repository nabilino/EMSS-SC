/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/Drill.js,v 1.14.2.5.2.2 2014/01/10 14:29:55 brentd Exp $ */
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
//		funcAfterCall	(optional) function to run after the drill call is executed
//-----------------------------------------------------------------------------
function DrillObject(mainWnd, techVersion, httpRequest, funcAfterCall)
{
	this.mainWnd = mainWnd || window;
	this.httpRequest = httpRequest || null;
	this.techVersion = techVersion || DrillObject.TECHNOLOGY_900;
	this.funcAfterCall = funcAfterCall;
	this.isPost = true;
	this.encoding = null;
	this.escapeFunc = this.mainWnd.cmnEscapeIt || this.mainWnd.escape;
	this.dom = null;
	this.recsToGet = null;
	this.bIsAttachment = false;

	// array for fields
	this.paramsAry = new Array();

	// array for history
	this.drillUrlAry = new Array();

	// private fields (for DrillObject only!)
	this.nbrLines = null;
	this.nbrColumns = null;
	this.nbrFindFlds = null;
	this.prevCall = null;
	this.nextCall = null;
	this.findNextCall = null;	
	this.columns = new Array();
	this.findflds = new Array();
	this.lines = new Array();
}
//-- static variables ---------------------------------------------------------
DrillObject.TECHNOLOGY_803 = "8.0.3";
DrillObject.TECHNOLOGY_900 = "9.0.0";
DrillObject.DRILL_URL_803 = "/servlet/ida";
DrillObject.DRILL_URL_900 = "/servlet/Router/Drill/Erp";
DrillObject.ATTACHMENT_URL = "/cgi-lawson/getattachrec.exe?"
DrillObject.MAX_PARAM = "_RECSTOGET";
//-----------------------------------------------------------------------------
DrillObject.prototype.setParameter = function(name, value)
{
	// persist max records parameter for future calls
	if (name == DrillObject.MAX_PARAM)
		this.recsToGet = value;
	this.paramsAry[name] = value;
}
//-----------------------------------------------------------------------------
DrillObject.prototype.removeParameter = function(name)
{
	this.setParameter(name, null);
}
//-----------------------------------------------------------------------------
DrillObject.prototype.resetPrivateVars = function()
{
	this.nbrLines = null;
	this.nbrColumns = null;
	this.nbrFindFlds = null;
	this.prevCall = null;
	this.nextCall = null;
	this.findNextCall = null;
	this.columns = new Array();
	this.findflds = new Array();
	this.lines = new Array();
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getParameter = function(name)
{
	return (this.paramsAry[name] || null);
}
//-----------------------------------------------------------------------------
DrillObject.prototype.setEncoding = function(encoding)
{
	this.encoding = encoding || null;
	if (this.encoding != null && typeof(this.mainWnd["escapeForCharset"]) != "undefined")
		this.escapeFunc = this.mainWnd.escapeForCharset;
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getUrl = function(query)
{
	if (!query)
		query = this.getQuery();
	var url = (this.techVersion == DrillObject.TECHNOLOGY_900)
			? DrillObject.DRILL_URL_900
			: DrillObject.DRILL_URL_803;
	return (url + "?" + query);
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getQuery = function()
{
	var query = "";
	if (this.techVersion == DrillObject.TECHNOLOGY_803)
		query += "_OUT=XML&";

	for (var i in this.paramsAry)
	{
		var val = this.paramsAry[i];
		if (val == null)
			continue;

		// if it is a GET or contains a & or %, it needs to be escaped
		val = "" + val;
		if (!this.isPost || val.indexOf("&") != -1 || val.indexOf("%") != -1 || this.encoding)
			val = this.escapeFunc(val);
		query += i + "=" + val + "&";
	}

	// remove the ending "&" and return it
	return query.substring(0, query.length-1);
}
//-----------------------------------------------------------------------------
DrillObject.prototype.callDrill = function(query)
{
	query = (typeof(query) == "undefined")
		  ? this.getQuery()
		  : this.fixIdaCallForResend(query);

	if (this.drillUrlAry.length == 0 || query != this.drillUrlAry[this.drillUrlAry.length-1])
		this.drillUrlAry[this.drillUrlAry.length] = query;

	if (!this.httpRequest)
		return null;

	this.resetPrivateVars();

	var cntType = (this.encoding) ? "text/xml; charset=" + this.encoding : null;

	if (this.bIsAttachment)
		this.dom = this.httpRequest(query, null, cntType);
	else
	{
		if (this.isPost)
		{
			var url = (this.techVersion == DrillObject.TECHNOLOGY_900)
					? DrillObject.DRILL_URL_900
					: DrillObject.DRILL_URL_803;
			cntType = "application/x-www-form-urlencoded";
			if (this.encoding)
				cntType += "; charset=" + this.encoding;				
			this.dom = this.httpRequest(url, query, cntType);
		}
		else
		{
			this.dom = this.httpRequest(this.getUrl(query), null, cntType);
		}
	}

	if (this.dom && this.funcAfterCall)
		this.funcAfterCall();

	return this.dom;
}
//-----------------------------------------------------------------------------
DrillObject.prototype.callBack = function()
{
	var backCall = this.getBackCall();
	if (backCall)
	{
		// If prior URL is a drill - don't reset back to beginning		
		if ((this.drillUrlAry[this.drillUrlAry.length-1].indexOf("_TYP=OS") != -1)
		||  (this.drillUrlAry[this.drillUrlAry.length-1].indexOf("_TYP=OW") != -1)
		||  (this.drillUrlAry[this.drillUrlAry.length-1].indexOf("_TYP=OV") != -1))
			this.drillUrlAry.length--;
		else
			this.drillUrlAry.length = 1;
			
		return this.callDrill(backCall);
	}
	return null;
}
//-----------------------------------------------------------------------------
DrillObject.prototype.reload = function()
{
	var reloadCall = this.getReloadCall();
	if (reloadCall)
		return this.callDrill(reloadCall);
	return null;
}
//-----------------------------------------------------------------------------
DrillObject.prototype.callNext = function()
{
	return (this.getNextCall())
			? this.callDrill(this.getNextCall())
			: null;
}
//-----------------------------------------------------------------------------
DrillObject.prototype.callPrev = function()
{
	return (this.getPrevCall())
			? this.callDrill(this.getPrevCall())
			: null;
}
//-----------------------------------------------------------------------------
DrillObject.prototype.callFindNext = function()
{
	return (this.getFindNextCall())
			? this.callDrill(this.getFindNextCall())
			: null;
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getNbrLines = function()
{
	if (this.nbrLines == null && this.dom)
		this.nbrLines = this.dom.getElementsByTagName("LINE").length;
	return this.nbrLines;
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getNbrColumns = function()
{
	if (this.nbrColumns == null && this.dom)
	{
		this.nbrColumns = this.dom.getElementsByTagName("COLUMN").length;
		// make sure it has a name attribute, in 803 tech sometimes it is blank!
		if (this.techVersion == DrillObject.TECHNOLOGY_803
		 && this.nbrColumns == 1
		 && this.getColumn(0).getColumnAttribute("name") == null)
		{
			this.nbrColumns = 0;
		}
	}
	return this.nbrColumns;
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getNbrFindFields = function()
{
	if (this.nbrFindFlds == null && this.dom)
		this.nbrFindFlds = this.dom.getElementsByTagName("FINDFLD").length;
	return this.nbrFindFlds;
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getColumn = function(idx)
{
	if (typeof(idx) != "number")
		return null;

	if (this.columns.length == 0 && this.dom)
	{
		var columnNodes = this.dom.getElementsByTagName("COLUMN");
		for (var i=0; i<columnNodes.length; i++)
			this.columns[i] = new DrillColumnObject(this, columnNodes[i]);
	}

	if (idx < 0 || idx > this.columns.length-1)
		return null;
	else
		return this.columns[idx];
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getFindField = function(idx)
{
	if (typeof(idx) != "number")
		return null;

	if (this.findflds.length == 0 && this.dom)
	{
		var findFldNodes = this.dom.getElementsByTagName("FINDFLD");
		for (var i=0; i<findFldNodes.length; i++)
			this.findflds[i] = new DrillFindFieldObject(this, findFldNodes[i]);
	}

	if (idx < 0 || idx > this.findflds.length-1)
		return null;
	else
		return this.findflds[idx];
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getLine = function(idx)
{
	if (typeof(idx) != "number")
		return null;

	if (this.lines.length == 0 && this.dom)
	{
		var lineNodes = this.dom.getElementsByTagName("LINE");
		for (var i=0; i<lineNodes.length; i++)
			this.lines[i] = new DrillLineObject(this, lineNodes[i]);
	}

	if (idx < 0 || idx > this.lines.length-1)
		return null;
	else
		return this.lines[idx];
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getReloadCall = function()
{
	if (this.drillUrlAry.length < 1)
		return null;
	return this.drillUrlAry[this.drillUrlAry.length-1];
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getBackCall = function()
{
	if (this.drillUrlAry.length < 2)
		return null;
		
	// If prior URL is a drill - don't go back to beginning		
	if ((this.drillUrlAry[this.drillUrlAry.length-1].indexOf("_TYP=OS") != -1)
	||  (this.drillUrlAry[this.drillUrlAry.length-1].indexOf("_TYP=OW") != -1)
	||  (this.drillUrlAry[this.drillUrlAry.length-1].indexOf("_TYP=OV") != -1))
		return this.drillUrlAry[this.drillUrlAry.length-2];
	else
		return this.drillUrlAry[0];
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getNextCall = function()
{
	if (this.nextCall == null && this.dom)
	{
		// loop forwards through just the children of the top node
		// NEXTPAGE is always towards the top
		var len = this.dom.documentElement.childNodes.length;
		for (var i=0; i<len; i++)
		{
			var node = this.dom.documentElement.childNodes[i];
			if (node.nodeName.toUpperCase() == "NEXTPAGE")
			{
				this.nextCall = this.mainWnd.cmnGetNodeCDataValue(node);
				break;
			}
		}
	}
	return this.nextCall;
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getPrevCall = function()
{
	if (this.prevCall == null && this.dom)
	{
		// loop forwards through just the children of the top node
		// PREVPAGE is always towards the top
		var len = this.dom.documentElement.childNodes.length;
		for (var i=0; i<len; i++)
		{
			var node = this.dom.documentElement.childNodes[i];
			if (node.nodeName.toUpperCase() == "PREVPAGE")
			{
				this.prevCall = this.mainWnd.cmnGetNodeCDataValue(node);
				break;
			}
		}
	}
	return this.prevCall;
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getFindNextCall = function()
{
	if (this.findNextCall == null && this.dom)
	{
		// loop forwards through just the children of the top node
		// FINDNEXT is always towards the top
		var len = this.dom.documentElement.childNodes.length;
		for (var i=0; i<len; i++)
		{
			var node = this.dom.documentElement.childNodes[i];
			if (node.nodeName.toUpperCase() == "FINDNEXT")
			{
				this.findNextCall = this.mainWnd.cmnGetNodeCDataValue(node);
				break;
			}
		}
	}
	return this.findNextCall;
}
//-----------------------------------------------------------------------------
DrillObject.prototype.fixIdaCallForResend = function(urlStr)
{
	if (!urlStr)
		return null;

	// attachment record ? return the URI and query
	// 803 Tech - url only contains 'getattachrec.exe'
	this.bIsAttachment = false;
	if (urlStr.indexOf("getattachrec.exe?") != -1)
	{
		var strBeforeQuery = (this.techVersion == DrillObject.TECHNOLOGY_803)
						   ? "getattachrec.exe?"
						   : "cgi-lawson/getattachrec.exe?";
		if (urlStr.indexOf(strBeforeQuery) == 0)
			urlStr = DrillObject.ATTACHMENT_URL + urlStr.substring(strBeforeQuery.length);
		urlStr = urlStr + "&_ECODE=FALSE";
		this.bIsAttachment = true;
		this.funcAfterCall = paintAttachScreen;
		return urlStr;	
	}
	
	// strip off the URI to just get the query...
	var strBeforeQuery = (this.techVersion == DrillObject.TECHNOLOGY_803)
					   ? "ida?"
					   : "Drill/Erp?";
	if (urlStr.indexOf(strBeforeQuery) == 0)
		urlStr = urlStr.substring(strBeforeQuery.length);

	// strip URI - just in case scenario
	var qIdx = urlStr.indexOf("?");
	if (!this.isPost && qIdx != -1)
		urlStr = urlStr.substring(qIdx);

	// persist what we want for max records
	if (this.recsToGet && urlStr.indexOf(DrillObject.MAX_PARAM) == -1)
		urlStr += "&" + DrillObject.MAX_PARAM + "=" + this.recsToGet;

	return urlStr;
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getTitle = function()
{
	if (!this.dom)
		return;
	return this.dom.documentElement.getAttribute("title");
}
//-- end drill object code
//-----------------------------------------------------------------------------


//-----------------------------------------------------------------------------
//-- start drill column object code
function DrillColumnObject(drillObj, columnNode)
{
	this.drillObj = drillObj;
	this.columnNode = columnNode;
}
//-----------------------------------------------------------------------------
DrillColumnObject.prototype.getIndex = function()
{
	for (var i=0; i<this.drillObj.getNbrColumns(); i++)
		if (this.drillObj.columns[i] == this)
			return i;
	return null;
}
//-----------------------------------------------------------------------------
DrillColumnObject.prototype.getColumnAttribute = function(name)
{
	return this.columnNode.getAttribute(name);
}
//-----------------------------------------------------------------------------
DrillColumnObject.prototype.getColumnValue = function()
{
	return this.drillObj.mainWnd.cmnGetNodeCDataValue(this.columnNode);
}
//-- end drill column object code
//-----------------------------------------------------------------------------


//-----------------------------------------------------------------------------
//-- start drill find field object code
function DrillFindFieldObject(drillObj, findFldNode)
{
	this.drillObj = drillObj;
	this.findFldNode = findFldNode;
	this.valNodes = null;
}
//-----------------------------------------------------------------------------
DrillFindFieldObject.prototype.getIndex = function()
{
	for (var i=0; i<this.drillObj.getNbrFindFlds(); i++)
		if (this.drillObj.findflds[i] == this)
			return i;
	return null;
}
//-----------------------------------------------------------------------------
DrillFindFieldObject.prototype.getFindFldAttribute = function(name)
{
	return this.findFldNode.getAttribute(name);
}
//-----------------------------------------------------------------------------
DrillFindFieldObject.prototype.getFindFldValue = function()
{
	return this.drillObj.mainWnd.cmnGetNodeCDataValue(this.findFldNode);
}
//-----------------------------------------------------------------------------
DrillFindFieldObject.prototype.getValValue = function(idx)
{
	if (typeof(idx) != "number")
		return null;

	var valNode = this.getValNode(idx);
	if (valNode)
		return this.drillObj.mainWnd.cmnGetNodeCDataValue(valNode);
	return null;
}
//-----------------------------------------------------------------------------
DrillFindFieldObject.prototype.getValAttribute = function(idx, name)
{
	if (typeof(idx) != "number")
		return null;

	var valNode = this.getValNode(idx);
	if (valNode)
		return valNode.getAttribute(name);
	return null;
}
//-----------------------------------------------------------------------------
DrillFindFieldObject.prototype.getValNode = function(idx)
{
	if (typeof(idx) != "number")
		return null;

	var vals = this.getValNodes();
	if (idx < 0 || idx > vals.length-1)
		return null;

	return vals[idx];
}
//-----------------------------------------------------------------------------
DrillFindFieldObject.prototype.getValCount = function()
{
	if (this.valNodes == null)
		this.valNodes = this.findFldNode.getElementsByTagName("VAL");
	return this.valNodes.length;
}
//-----------------------------------------------------------------------------
DrillFindFieldObject.prototype.getValNodes = function()
{
	if (this.valNodes == null)
		this.valNodes = this.findFldNode.getElementsByTagName("VAL");
	return this.valNodes;
}
//-- end drill find field object code
//-----------------------------------------------------------------------------


//-----------------------------------------------------------------------------
//-- start drill line object code
function DrillLineObject(drillObj, lineNode)
{
	this.drillObj = drillObj;
	this.lineNode = lineNode;
	this.colNodes = null;
	this.keyFldNodes = null;
	this.idaCallNode = null;
}
//-----------------------------------------------------------------------------
DrillLineObject.prototype.getIndex = function()
{
	for (var i=0; i<this.drillObj.getNbrRecs(); i++)
		if (this.drillObj.lines[i] == this)
			return i;
	return null;
}
//-----------------------------------------------------------------------------
DrillLineObject.prototype.getIdaCall = function()
{
	if (!this.idaCallNode)
		this.getIdaCallNode();
	return (this.idaCallNode) ? this.drillObj.mainWnd.cmnGetNodeCDataValue(this.idaCallNode) : null;
}
//-----------------------------------------------------------------------------
DrillLineObject.prototype.getIdaCallType = function()
{
	if (!this.idaCallNode)
		this.getIdaCallNode();
	return (this.idaCallNode) ? this.idaCallNode.getAttribute("type") : null;
}
//-----------------------------------------------------------------------------
DrillLineObject.prototype.getIdaCallNode = function()
{
	if (!this.idaCallNode)
	{
		var idaCallNodes = this.lineNode.getElementsByTagName("IDACALL");
		if (idaCallNodes.length > 0)
			this.idaCallNode = idaCallNodes[0];
	}
	return this.idaCallNode;
}
//-----------------------------------------------------------------------------
DrillLineObject.prototype.getColValue = function(idx)
{
	if (typeof(idx) != "number")
		return null;

	var colNode = this.getColNode(idx);
	if (colNode)
		return this.drillObj.mainWnd.cmnGetNodeCDataValue(colNode);
	return null;
}
//-----------------------------------------------------------------------------
DrillLineObject.prototype.getColNode = function(idx)
{
	if (typeof(idx) != "number")
		return null;

	var cols = this.getColNodes();
	if (idx < 0 || idx > cols.length-1)
		return null;

	return cols[idx];
}
//-----------------------------------------------------------------------------
DrillLineObject.prototype.getColCount = function()
{
	if (this.colNodes == null)
		this.colNodes = this.lineNode.getElementsByTagName("COL");
	return this.colNodes.length;
}
//-----------------------------------------------------------------------------
DrillLineObject.prototype.getColNodes = function()
{
	if (this.colNodes == null)
		this.colNodes = this.lineNode.getElementsByTagName("COL");
	return this.colNodes;
}
//-----------------------------------------------------------------------------
DrillLineObject.prototype.getKeyFldValue = function(idx)
{
	if (typeof(idx) != "number")
		return null;

	var keyFldNode = this.getKeyFldNode(idx);
	if (keyFldNode)
		return this.drillObj.mainWnd.cmnGetNodeCDataValue(keyFldNode);
	return null;
}
//-----------------------------------------------------------------------------
DrillLineObject.prototype.getKeyFldAttribute = function(idx, name)
{
	if (typeof(idx) != "number")
		return null;

	var keyFldNode = this.getKeyFldNode(idx);
	if (keyFldNode)
		return keyFldNode.getAttribute(name);
	return null;
}
//-----------------------------------------------------------------------------
DrillLineObject.prototype.getKeyFldNode = function(idx)
{
	if (typeof(idx) != "number")
		return null;

	var keyFlds = this.getKeyFldNodes();
	if (idx < 0 || idx > keyFlds.length-1)
		return null;

	return keyFlds[idx];
}
//-----------------------------------------------------------------------------
DrillLineObject.prototype.getKeyFldCount = function()
{
	if (this.keyFldNodes == null)
		this.keyFldNodes = this.lineNode.getElementsByTagName("KEYFLD");
	return this.keyFldNodes.length;
}
//-----------------------------------------------------------------------------
DrillLineObject.prototype.getKeyFldNodes = function()
{
	if (this.keyFldNodes == null)
		this.keyFldNodes = this.lineNode.getElementsByTagName("KEYFLD");
	return this.keyFldNodes;
}
//-- end drill line object code
//-----------------------------------------------------------------------------
//-- start attachment code
//-----------------------------------------------------------------------------
DrillObject.prototype.getAttachTitle = function()
{
	if (!this.dom)
		return;
	var titleNode = this.dom.getElementsByTagName("WinTitle");
	if (titleNode.length > 0)
		return this.mainWnd.cmnGetNodeCDataValue(titleNode[0]);
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getAttachQuery = function(idx)
{
	if (!this.dom)
		return;
	
	var queryBaseNode = this.dom.getElementsByTagName("QueryBase");
	if (queryBaseNode.length > 0)
		return (this.getRecAttCdataValue(idx,"QueryVal") + this.mainWnd.cmnGetNodeCDataValue(queryBaseNode[0]));
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getRecAttCount = function()
{
	var recAttNodes = this.dom.getElementsByTagName("RecAtt");
 	if (recAttNodes	)
 		return recAttNodes.length;
	return null;
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getRecAttNode = function(idx)
{
	if (typeof(idx) != "number")
		return null;

	var recAtt = this.getRecAttNodes();
	if (idx < 0 || idx > recAtt.length-1)
		return null;

	return recAtt[idx];
}
//-----------------------------------------------------------------------------
DrillObject.prototype.getRecAttNodes = function()
{
	if (!this.dom)
		return;
	
	var recAttNodes = this.dom.getElementsByTagName("RecAtt");
	if (recAttNodes.length > 0)
		return recAttNodes;
}
//-----------------------------------------------------------------------------
// Get the value of a child node of <RecAtt> that is wrapped in CDATA
DrillObject.prototype.getRecAttCdataValue = function(idx, name)
{
	if (typeof(idx) != "number")
		return null;
	
	var recAttChildNode = this.getRecAttNode(idx).getElementsByTagName(name);
	if (recAttChildNode.length > 0 )
		return this.mainWnd.cmnGetNodeCDataValue(recAttChildNode[0]);
	return null;
}
//-----------------------------------------------------------------------------
// Get the value of a child node of <RecAtt> that is NOT wrapped in CDATA
DrillObject.prototype.getRecAttValue = function(idx, name)
{
	if (typeof(idx) != "number")
		return null;

	var recAttChildNode = this.getRecAttNode(idx).getElementsByTagName(name);
	if (recAttChildNode.length > 0)
		return this.mainWnd.cmnGetElementText(recAttChildNode[0]);
	return null;
}
//-----------------------------------------------------------------------------
DrillObject.prototype.isBrowserIE = function()
{
	return (navigator.appName == "Microsoft Internet Explorer") ? true : false;
}
//-----------------------------------------------------------------------------

