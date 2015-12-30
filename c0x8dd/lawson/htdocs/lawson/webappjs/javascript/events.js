/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/events.js,v 1.3.2.3.2.4 2014/01/10 14:29:59 brentd Exp $ */
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
//		every method in this file has to do with event handling
//-----------------------------------------------------------------------------


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
function getEventElementId(evt)
{
    var elem = null;
    if (evt && evt.target)
        elem = (evt.target.nodeType == 3) ? evt.target.parentNode : evt.target
    else if (evt)
        elem = evt.srcElement
    return (elem) ? elem.id : null;
}

//-----------------------------------------------------------------------------
function getEventObject(evt, wnd)
{
	if (typeof(wnd) == "undefined")
		return (evt ? evt : (window.event ? window.event : null));
	else
		return (evt ? evt : (wnd.event ? wnd.event : null));
}

//-----------------------------------------------------------------------------
function setEventCancel(evt)
{
	if (typeof(evt) == "undefined" || evt == null)
		return;

	try
	{
		evt.cancelBubble = true;
		
		if (evt.preventDefault)
			evt.preventDefault();
		
		if (evt.stopPropagation)
			evt.stopPropagation();

		if (evt.returnValue)
			evt.returnValue = false;
		
		if (evt.keyCode)
			evt.keyCode = 0;
	}
	catch (e)
	{}
}

//-----------------------------------------------------------------------------
function cancelEventBubble(evt)
{
	if (typeof(evt) == "undefined" || evt == null)
		return;

	try
	{
		evt.cancelBubble = true;
		
		if (evt.stopPropagation)
			evt.stopPropagation();
	}
	catch (e)
	{}
}

//-----------------------------------------------------------------------------
function returnFalse()
{
	return false;
}

//-----------------------------------------------------------------------------
function changeObjClass(obj, newClassStr)
{
	if (!obj)
		return;

	if (obj.getAttribute("oldClass") == null)
		obj.setAttribute("oldClass", obj.className);
	obj.className = newClassStr;
}

//-----------------------------------------------------------------------------
function restoreObjClass(obj)
{
	if (!obj)
		return;

	var oldClass = obj.getAttribute("oldClass");
	if (oldClass != null)
		obj.className = oldClass;
}
