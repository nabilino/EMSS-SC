/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/ValueStorage.js,v 1.1.2.1.18.1.2.2 2012/08/08 12:37:30 jomeli Exp $ */
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

//-----------------------------------------------------------------------------
// Name/Value Storage constructor
function ValueStorage()
{
	this.length=0;
	this.items=new Array()
	this.index=new Object()
}
ValueStorage.prototype.add=function(name,value)
{
	var i=this.items.length;
	if(typeof(value)=="undefined")
		value="";

	var item=new Object();
	item.name=name;
	item.value=value;
	this.items[i]=item;
	this.length=this.items.length;
	this.index[name]=i;

	return this.items[i];
}
ValueStorage.prototype.children=function(index)
{
	if(arguments.length==0)
		return this.items;
	return this.items[index];
}
ValueStorage.prototype.getItem=function(name)
{
	var index=this.index[name];
	if(typeof(index)=="undefined")
		return null;
	return this.items[index];
}
ValueStorage.prototype.setItem=function(name,value)
{
	if (typeof(value) == "undefined")
		value=""
	var index=this.index[name];
	if(typeof(index)=="undefined")
		return false;
	var item=this.items[index];
	if (!item) return false;
	item.value=value
	return true;
}
ValueStorage.prototype.remove=function(name)
{
	var index=this.index[name];
	if(typeof(index)=="undefined")
		return;
	this.items.splice(index,1);
	this.length=this.items.length;
}
