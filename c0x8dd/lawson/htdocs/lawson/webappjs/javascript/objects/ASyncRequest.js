/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/ASyncRequest.js,v 1.1.2.3.2.2 2014/01/10 14:29:55 brentd Exp $ */
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
//		commonHTTP.js
//-----------------------------------------------------------------------------
//
//	WARNING!
//		This object does not handle LSF 9.0 timed out scenarios!
//-----------------------------------------------------------------------------


//-----------------------------------------------------------------------------
function ASyncRequestObject()
{
	this.browser = new SEABrowser();
	this.objFactory = new SEAObjectFactory();
	this.http = this.objFactory.createInstance("HTTP");

	this.onreadystatechange = "";
}
//-----------------------------------------------------------------------------
ASyncRequestObject.prototype.readyState = function()
{
	return (this.browser.isIE) ? this.http.readyState : 4;
}
//-----------------------------------------------------------------------------
ASyncRequestObject.prototype.responseBody = function()
{
	return (this.browser.isIE) ? this.http.responseBody : null;
}
//-----------------------------------------------------------------------------
ASyncRequestObject.prototype.responseStream = function()
{
	return (this.browser.isIE) ? this.http.responseStream : null;
}
//-----------------------------------------------------------------------------
ASyncRequestObject.prototype.responseText = function()
{
	return this.http.responseText;
}
//-----------------------------------------------------------------------------
ASyncRequestObject.prototype.responseXML = function()
{
	return this.http.responseXML;
}
//-----------------------------------------------------------------------------
ASyncRequestObject.prototype.status = function()
{
	return this.http.status;
}
//-----------------------------------------------------------------------------
ASyncRequestObject.prototype.statusText = function()
{
	return this.http.statusText;
}
//-----------------------------------------------------------------------------
ASyncRequestObject.prototype.abort = function()
{
	this.http.abort();
}
//-----------------------------------------------------------------------------
ASyncRequestObject.prototype.getAllResponseHeaders = function()
{
	return this.http.getAllResponseHeaders();
}
//-----------------------------------------------------------------------------
ASyncRequestObject.prototype.getResponseHeader = function(strHeader)
{
	return this.http.getResponseHeader(strHeader);
}
//-----------------------------------------------------------------------------
ASyncRequestObject.prototype.open = function(cmd, url)
{
	if (this.browser.isIE)
		this.http.onreadystatechange = this.onreadystatechange;
	else
		this.http.onload = this.onreadystatechange;

	// make call
	this.http.open(cmd, url, true);
}
//-----------------------------------------------------------------------------
ASyncRequestObject.prototype.send = function(payload)
{
	this.http.send(payload);
}
//-----------------------------------------------------------------------------
ASyncRequestObject.prototype.setRequestHeader = function(strHeader, value)
{
	this.http.setRequestHeader(strHeader, value);
}
//-----------------------------------------------------------------------------
