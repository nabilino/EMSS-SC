/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/admin/admincommon.js,v 1.13.2.4.4.1.14.1.2.2 2012/08/08 12:37:31 jomeli Exp $ */
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

function keyPress(e)
{
	e=portalWnd.getEventObject(e,window);
	if (e==null) return;
	
	if ((portalObj.browser.isIE && e.keyCode == 13) 
		|| (!portalObj.browser.isIE && e.which == 13))
	{
		doSearch();
		return false;
	}
	return true;
}

//-----------------------------------------------------------------------------
function cleanApostrophes( s )
{
	var re = /\'/g
	s = s.replace(re,"\\'")
	return s
}

//-----------------------------------------------------------------------------
function abandonChildren(node)
{
	var len = node.childNodes.length
	var childNode
	var i
	var arrRemove=new Array()
	for (i=0;i<len;i++)
	{
		childNode=node.childNodes[i]
		if (childNode.canHide)
			arrRemove[arrRemove.length]=childNode
	}
	for (i=arrRemove.length-1;i>=0;i--)
		node.removeChild(arrRemove[i])
}

function getNodeChildElementsByTagName(node,tagname)
{
	var retArray=new Array()
	
	// if this node has that tag, add
	if (node.tagName == tagname && !portalWnd.cmnArrayContains(retArray,node))
		retArray[retArray.length] = node
		
	// look through children
	var tArray
	for(var i = 0; i < node.childNodes.length; i++)
	{
		if (node.childNodes[i].nodeType == 1)
		{
			tArray = getNodeChildElementsByTagName(node.childNodes[i], tagname)
			if (tArray && tArray.length)
				retArray = retArray.concat(tArray)	
		}
	}
	
	if (retArray.length)
		return retArray
	else
		return null
}

//-----------------------------------------------------------------------------
function rightClickEvent(e)
{
	var rc = false
	if (portalObj.browser.isIE)
		rc |= (e.button==2)
	else
		rc |= (e.which==3) // which == 1 for a primary click; 3 for a secondary click
	
	// if not right click by button, look for activation keys
	if (!rc)
		rc = (e.metaKey) || (e.ctrlKey)
	
	return rc
}
