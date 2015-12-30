/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/StringBuffer.js,v 1.3.2.3.2.2 2014/01/10 14:29:55 brentd Exp $ */
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
//		none
//-----------------------------------------------------------------------------
//
//	PARAMETERS:
//		str			(optional) string to start the stringbuffer
//-----------------------------------------------------------------------------
function StringBuffer(str)
{
	str = (str) ? str : "";
	this.buffer = [str];
}
//-----------------------------------------------------------------------------
StringBuffer.prototype.append = function(str)
{
	this.buffer.push(str);
	return this;
}
//-----------------------------------------------------------------------------
StringBuffer.prototype.charAt = function(idx)
{
	return this.toString().charAt(idx);
}
//-----------------------------------------------------------------------------
StringBuffer.prototype.clear = function()
{
	this.buffer = [];
	return this;
}
//-----------------------------------------------------------------------------
StringBuffer.prototype.insert = function(idx, str)
{
	this.buffer = [this.substring(0,idx)+str+this.substring(idx)];
	return this;
}
//-----------------------------------------------------------------------------
// *** delete in javascript is a reserved word/function ***
StringBuffer.prototype.remove = function(start, end)
{
	this.buffer = [this.substring(0, start) + this.substring(end)];
	return this;
}
//-----------------------------------------------------------------------------
// *** delete in javascript is a reserved word/function ***
StringBuffer.prototype.removeCharAt = function(idx)
{
	this.buffer = [this.substring(0,idx)+this.substring(idx+1)];
	return this;
}
//-----------------------------------------------------------------------------
StringBuffer.prototype.replace = function(start, end, str)
{
	this.buffer = [this.substring(0,start)+str+this.substring(end)];
	return this;
}
//-----------------------------------------------------------------------------
StringBuffer.prototype.replaceCharAt = function(idx, str)
{
	this.buffer = [this.substring(0,idx)+str+this.substring(idx+1)];
	return this;
}
//-----------------------------------------------------------------------------
StringBuffer.prototype.reverse = function()
{
	var str = this.toString();
	this.clear();
	for (var i=str.length-1; i>-1; i--)
		this.append(str.charAt(i));
	return this;
}
//-----------------------------------------------------------------------------
StringBuffer.prototype.substring = function(start, end)
{
	return (typeof(end) == "number")
		? this.toString().substring(start, end)
		: this.toString().substring(start);
}
//-----------------------------------------------------------------------------
StringBuffer.prototype.length = function()
{
	return this.toString().length;
}
//-----------------------------------------------------------------------------
StringBuffer.prototype.toString = function()
{
	return this.buffer.join("");
}
//-- end stringbuffer code
//-----------------------------------------------------------------------------
