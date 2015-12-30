/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/Transaction.js,v 1.13.2.6.2.2 2014/01/10 14:29:55 brentd Exp $ */
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
function TransactionObject(mainWnd, techVersion, httpRequest, funcAfterCall)
{
	this.mainWnd = mainWnd || window;
	this.httpRequest = httpRequest || null;
	this.techVersion = techVersion || TransactionObject.TECHNOLOGY_900;
	this.funcAfterCall = funcAfterCall;
	this.isPost = true;
	this.showErrors = true;
	this.encoding = null;
	this.escapeFunc = this.mainWnd.cmnEscapeIt || this.mainWnd.escape;
	this.dom = null;

	// array for fields
	this.paramsAry = new Array();

	// private fields (for TransactionObject only!)
	this.message = null;
	this.msgNbr = null;
}
//-- static variables ---------------------------------------------------------
TransactionObject.TECHNOLOGY_803 = "8.0.3";
TransactionObject.TECHNOLOGY_900 = "9.0.0";
TransactionObject.TRANSACTION_URL_803 = "/servlet/ags";
TransactionObject.TRANSACTION_URL_900 = "/servlet/Router/Transaction/Erp";
//-- static response messages -------------------------------------------------
TransactionObject.ADD_COMPLETE_CONTINUE = "Add Complete - Continue";
TransactionObject.CHANGE_COMPLETE_CONTINUE = "Change Complete - Continue";
TransactionObject.FIELD_IS_REQUIRED = "Field is required";
TransactionObject.INQUIRY_COMPLETE = "Inquiry Complete";
TransactionObject.RECORDS_DELETED = "Records Have Been Deleted";
TransactionObject.SUCCESS_MSGNBR = "000";
//-----------------------------------------------------------------------------
TransactionObject.prototype.setParameter = function(name, value)
{
	this.paramsAry[name] = value;
}
//-----------------------------------------------------------------------------
TransactionObject.prototype.removeParameter = function(name)
{
	this.setParameter(name, null);
}
//-----------------------------------------------------------------------------
TransactionObject.prototype.resetPrivateVars = function()
{
	this.message = null;
	this.msgNbr = null;
}
//-----------------------------------------------------------------------------
TransactionObject.prototype.getParameter = function(name)
{
	return (this.paramsAry[name] || null);
}
//-----------------------------------------------------------------------------
TransactionObject.prototype.setEncoding = function(encoding)
{
	this.encoding = encoding || null;
	if (this.encoding != null && typeof(this.mainWnd["escapeForCharset"]) != "undefined")
		this.escapeFunc = this.mainWnd.escapeForCharset;
}
//-----------------------------------------------------------------------------
TransactionObject.prototype.getUrl = function()
{
	var url = (this.techVersion == TransactionObject.TECHNOLOGY_900)
			? TransactionObject.TRANSACTION_URL_900
			: TransactionObject.TRANSACTION_URL_803;
	return (url + "?" + this.getQuery());
}
//-----------------------------------------------------------------------------
TransactionObject.prototype.getQuery = function()
{
	var query = "";
	if (this.techVersion == TransactionObject.TECHNOLOGY_803)
		query += "_OUT=XML&";

	for (var i in this.paramsAry)
	{
		var val = this.paramsAry[i];
		if (val == null)
			continue;

		// escape if call is a GET or 803 tech or has a & or %
		val = "" + val;
		if (!this.isPost
		 || this.techVersion == TransactionObject.TECHNOLOGY_803
		 || val.indexOf("&") != -1
		 || val.indexOf("+") != -1
		 || val.indexOf("%") != -1
		 || this.encoding)
		 	val = this.escapeFunc(val);				

		query += i + "=" + val + "&";
	}

	// remove the ending "&" and return it
	return query.substring(0, query.length-1);
}
//-----------------------------------------------------------------------------
TransactionObject.prototype.callTransaction = function()
{
	if (!this.httpRequest)
		return null;

	this.resetPrivateVars();
	if (this.isPost)
	{
		var url = (this.techVersion == TransactionObject.TECHNOLOGY_900)
				? TransactionObject.TRANSACTION_URL_900
				: TransactionObject.TRANSACTION_URL_803;
		var cntType = "application/x-www-form-urlencoded";
		if (this.encoding)
			cntType += "; charset=" + this.encoding;
		this.dom = this.httpRequest(url, this.getQuery(), cntType, null, this.showErrors);
	}
	else
	{
		var cntType = (this.encoding) ? "text/xml; charset=" + this.encoding : null;
		this.dom = this.httpRequest(this.getUrl(), null, cntType, null, this.showErrors);
	}
	if (this.funcAfterCall)
		this.funcAfterCall();

	return this.dom;
}
//-----------------------------------------------------------------------------
TransactionObject.prototype.getMessage = function()
{
	if (!this.dom)
		return null;

	if (this.message == null)
	{
		var nodes = this.dom.getElementsByTagName("Message");
		if (nodes.length > 0)
			this.message = this.mainWnd.cmnGetElementText(nodes[0]);
	}
	return this.message;
}
//-----------------------------------------------------------------------------
TransactionObject.prototype.getMsgNbr = function()
{
	if (!this.dom)
		return;

	if (this.msgNbr == null)
	{
		var nodes = this.dom.getElementsByTagName("MsgNbr");
		if (nodes.length > 0)
			this.msgNbr = this.mainWnd.cmnGetElementText(nodes[0]);
	}
	return this.msgNbr;
}
//-----------------------------------------------------------------------------
TransactionObject.prototype.getValue = function(name)
{
	if (name && this.dom)
	{
		var nameNodes = this.dom.getElementsByTagName(name);
		if (nameNodes.length > 0)
			return (this.mainWnd.cmnGetElementText(nameNodes[0]) || null);
	}
	return null;
}
