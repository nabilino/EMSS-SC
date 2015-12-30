/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/admin/officemanager/popup.js,v 1.17.2.15.4.6.14.1.2.3 2012/08/08 12:37:24 jomeli Exp $ */
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

var popupclicked
var popupTreeItems = new Array()
var popupCount = 0

//-----------------------------------------------------------------------------
// show popup layer, and update contents
function popupShow()
{
	if (activesourcetype)
	{
		if(lyrPopup.type != activesourcetype)
		{
			lyrPopup.type = activesourcetype
	
			var popupheight = 0
			popupCount++
	
			// remember the tree for this type, store in popupTreeItems
			var items = popupTreeItems[activesourcetype]
			if (!items)
			{
				items = getTreePopupItems()
				popupTreeItems[activesourcetype] = items
			}
	
			// remove old contents
			abandonChildren(lyrPopup)
	
			var divNode = document.createElement("div")
			divNode.style.width = "100%"
			divNode.style.height = "100%"
			divNode.canHide = true
			
			var tableNode = document.createElement("table")
			tableNode.style.width = "100%"
			tableNode.style.height = "100%"
			tableNode.cellPadding = 1
			tableNode.cellSpacing = 0
			tableNode.style.border = "1px"
			
			var rowNode
			var cellNode
			var itemCaption
			var itemClick
			var itemPhrase
			var itemRequires
			var textNode
			var localeChanged = 0;
			var captPhrase = "";
			
			for (var i=0; i < items.length; i++)
			{
				itemCaption = items[i].getElementsByTagName("caption")
				itemCaption = itemCaption[0].firstChild.nodeValue
				itemClick = items[i].getElementsByTagName("onclick")
				itemClick = itemClick[0].firstChild.nodeValue
				itemRequires = items[i].getElementsByTagName("requires")
				if (itemRequires && itemRequires[0])
				{
					if (itemRequires[0].firstChild)
						itemRequires = itemRequires[0].firstChild.nodeValue
					else
						itemRequires = null
				}
				else
					itemRequires = null
				captPhrase = subMsgs.getPhrase(itemCaption);
				itemPhrase = captPhrase;
				if (itemPhrase == itemCaption)
					itemPhrase = portalObj.getPhrase(itemCaption);
				if (itemPhrase != itemCaption)
					localeChanged = Math.max(localeChanged, itemPhrase.length);
				
				rowNode = tableNode.insertRow(tableNode.rows.length)
		
				cellNode = rowNode.insertCell(rowNode.cells.length)
				cellNode.className = "xTPopup"
				cellNode.style.height = "15px"
		
				spanNode = document.createElement("span")
				spanNode.innerHTML = itemPhrase;
				spanNode.id = getPopupSpanId(i)
				spanNode.i = i // keyboard
				spanNode.style.height = "15px"
				spanNode.style.width = "100%"
				spanNode.style.cursor = "hand"
				spanNode.style.paddingLeft = "13px"
				spanNode.itemRequires = itemRequires
				spanNode.itemClick = itemClick
				spanNode.tabIndex = 1
		
				cellNode.appendChild(spanNode)
				
				popupheight += 17
	
			} // for
			
			popupheight += 17
			//lyrPopup.appendChild(tableNode)
			divNode.appendChild(tableNode)
			lyrPopup.appendChild(divNode)
			lyrPopup.style.height=(popupheight) + "px"
	
		} // lyrPopup.type
		
		// dim or brighten menu options based on status
		var items = popupTreeItems[activesourcetype]
		var spanNode
		var itemRequires
		var itemRequiresValue
		for (var i=0; i < items.length; i++)
		{
			spanNode = getPopupSpan(i)
			itemRequires = spanNode.itemRequires
			if (typeof(itemRequires)!="undefined")
				eval("itemRequiresValue = " + itemRequires)
			else
				itemRequiresValue = null
				
			// check to make sure cannot paste on top of itself
			if (!itemRequires || (itemRequiresValue!=null && itemRequiresValue!=activesourceid) )
			{
				spanNode.onmouseover = popupSpanMouseOver
				spanNode.onmouseout = popupSpanMouseOut
				eval("spanNode.onclick = "+spanNode.itemClick)
				spanNode.className = "xTPopupItem"
			}
			else
			{
				spanNode.onmouseover = null
				spanNode.onmouseout = null
				spanNode.onclick = null
				spanNode.className = "xTPopupItemDim"
			}
		}
		
		detCoords(lyrPopup);
		with (lyrPopup.style)
		{
			if (localeChanged)
				width = parseInt(localeChanged*8,10) + "px";
			left = (mX - mdX - 5) + "px";
			
			var h = lyrPopup.detHeight
			if ((mY - mdY - 5 + h) > scrHeight)
				top = Math.max(0,scrHeight - h) + "px"
			else
				top=(mY - mdY - 5) + "px"
			visibility="visible"
		}
		
		// focus on first menu item
		spanNode = document.getElementById(getPopupSpanId(0))
		if (spanNode && typeof(spanNode.focus)!="undefined")
			spanNode.focus()

		if (isIE)
		{
			with (lyrPopupCover.style)
			{
				left = "0px"
				top = "0px"
				width = "100%"
				height = "100%"
				visibility = "visible"
			}
		}
		popupclicked = true
	}
}

//-----------------------------------------------------------------------------
function getPopupSpanId(i)
{
	return ("pc_" + popupCount + "_ts_" + activesourcetype + "_" + i);
}

//-----------------------------------------------------------------------------
function getPopupSpan(i)
{
	return (document.getElementById(getPopupSpanId(i)));
}

//-----------------------------------------------------------------------------
function getTreePopupItems()
{
	// parse tree doco
	var types = treeSource.document.getElementsByTagName("types")
	var nType
	var nName
	var popups
	var items
	var type
	var typefound = false
	var widths
	
	for (var i=0; i < types[0].childNodes.length && !typefound; i++)
	{
		nType=types[0].childNodes[i]
		if (nType.tagName == "type")
		{
			nName=nType.getAttribute("name")
			
			// if this is the one we are looking for
			if (nName == activesourcetype) {
				typefound = true
				widths = nType.getElementsByTagName("width")
				if (widths) {
					var popupwidth = widths[0].firstChild.nodeValue
					lyrPopup.style.width = (popupwidth) + "px"
				}
				items = nType.getElementsByTagName("item")
			}
		}
	}
	return items
}

//-----------------------------------------------------------------------------
function popupHide(force)
{
	if (!force && popupclicked)
	{
		var oLeft=parseInt(lyrPopup.style.left,10)
		var oTop=parseInt(lyrPopup.style.top,10)
		var oRight=oLeft + parseInt(lyrPopup.style.width,10)
		var oBottom=oTop + parseInt(lyrPopup.style.height,10)
	
		if ((mX - mdX >= oLeft) && (mX - mdX <= oRight) && ((mY - mdY) >= oTop) && ((mY - mdY) <= oBottom))
		{
			lyrPopup.style.visibility="visible"
			return
		}
	}

	if (lyrPopup.style.visibility == "visible")
	{
		lyrPopup.style.visibility = "hidden"
		var nLeft = "-" + parseInt(lyrPopup.style.width,10) + "px"
		var nTop = "-" + parseInt(lyrPopup.style.height,10) + "px"
		lyrPopup.style.left = nLeft
		lyrPopup.style.top = nTop
		popupclicked=false
	
		//if (activesourcelayer && activesourcelayer.anch)
		if (!renaming && activesourcelayer && activesourcelayer.anch)
			activesourcelayer.anch.focus()
			
		if (isIE)
		{
			with (lyrPopupCover.style)
			{
				left = "-1000px"
				top = "-1000px"
				width = "100px"
				height = "100px"
				visibility = "hidden"
			}
		}
	}
}

//-----------------------------------------------------------------------------
// when the mouse is over a popup menu item, change the style
function popupSpanMouseOver(e)
{
	e = portalWnd.getEventObject(e,window);
	var span = portalWnd.getEventElement(e);
	if (span)
		span.className="xTPopupItemOver";
}

//-----------------------------------------------------------------------------
// when the mouse has left a popup menu item, reset the style
function popupSpanMouseOut(e)
{
	e = portalWnd.getEventObject(e,window);
	detMouse(e);

	// based on mouse coordinates, may or may not hide popup
	popupHide();
	
	var span = portalWnd.getEventElement(e);
	if (span)
		span.className="xTPopupItem";
}

//-----------------------------------------------------------------------------
function popupAddChild()
{
	popupclicked = false
	popupHide()
	loadBookmarkAdd( activesourceparam, activesourceseq, activesourcelayer )	
}

//-----------------------------------------------------------------------------
function popupEditAccess()
{
	popupclicked = false
	popupHide()
 	loadBookmarkAccess( activesourceparam, activesourcebookmark )
}

//-----------------------------------------------------------------------------
function popupEdit()
{
	popupclicked = false
	popupHide()
	loadBookmarkEdit( activesourceparam, activesourceseq, activesourceparentlayer )
}

//-----------------------------------------------------------------------------
function popupRename()
{
	popupclicked = false
	popupHide()
	loadBookmarkRename( activesourceparam, activesourceseq, activesourcebookmark, activesourcelayer )
}

//-----------------------------------------------------------------------------
function popupCopy()
{
	popupclicked = false
	popupHide()

	// set the current clip
	setActiveClip(activesourceid)

	// type of clip
	isCopy = true

	// show the current clip
	var copyPhrase = portalObj.getPhrase("COPY")+ " " + activesourcebookmark;
	var span = document.createElement("span");
	span.innerHTML = copyPhrase;
	if (isIE)
		copyPhrase = span.innerText;
	else
		copyPhrase = span.innerHTML;
	window.status = copyPhrase;
	portalObj.setMessage(copyPhrase);
}

//-----------------------------------------------------------------------------
function popupCut()
{
	popupclicked = false
	popupHide()
	
	// set the current clip
	setActiveClip(activesourceid)

	// type of clip
	isCopy = false
	
	// show the current clip
	var cutPhrase = portalObj.getPhrase("CUT") + " " + activesourcebookmark;
	var span = document.createElement("span");
	span.innerHTML = cutPhrase;
	if (isIE)
		cutPhrase = span.innerText;
	else
		cutPhrase = span.innerHTML;
	window.status = cutPhrase;
	portalObj.setMessage(cutPhrase);
}

//-----------------------------------------------------------------------------
function popupPaste()
{
	// get the sequence number of the new parent
	var newparseq = activesourceseq
	var addas = "C" // C=Child, P=Peer

	popupPasteGeneral(newparseq,addas)
}

//-----------------------------------------------------------------------------
function popupPasteTopLevel()
{
	// get the sequence number of the new parent
	var newparseq = "1"
	var addas = "P" // C=Child, P=Peer
	
	// special case where copy seq == 1
	if (activesourceclipseq == "1")
		newparseq = firstseq

	popupPasteGeneral(newparseq,addas)
}

//-----------------------------------------------------------------------------
function popupPasteGeneral(newparseq,addas)
{
	popupclicked = false
	popupHide()

	if (isCopy)
		clipCopy(newparseq,addas)
	else
		clipPaste(newparseq,addas)
	dirty()
}

//-----------------------------------------------------------------------------
function popupDelete()
{
	popupclicked = false
	popupHide()

	var deletePhrase = portalObj.getPhrase("DELETE_BM_WITH_CHILDREN")
	var span = document.createElement("span");
	span.innerHTML = deletePhrase;
	if (isIE)
		deletePhrase = span.innerText;
	else
		deletePhrase = span.innerHTML;
	if( confirm( deletePhrase ) )
		deleteBookmark( activesourceparam )
}

//-----------------------------------------------------------------------------
function popupMouseOut(e)
{
	e = portalWnd.getEventObject(e);
	detMouse(e);
	popupHide();
}

//-----------------------------------------------------------------------------
function clipCopy(newparseq, addas)
{
	// prepare ags call
	var functionCode = "W" // D=Delete, E=DeleteWithChildren, M=Move, O=MoveWithChildren, V=Copy, W=CopyWithChildren

	// copy the bookmark (and children) to the new location
	var api = portalWnd.AGSPath + "?_PDL=LOGAN&_TKN=LO12.1&" +
		"_EVT=CHG&" +
		"_RTN=DATA&" +
		"_OUT=XML&" +
		"_TDS=Ignore&" +
		"_LFN=TRUE&" +
		"FC=" + functionCode + "&" +
		"LOB-BOOK-MARK=" + portalWnd.trim( activesourceclipparam ) + "&" +
		"DOCOPY-MOVE-TO-SEQ=" + portalWnd.trim( newparseq ) + "&" +
		"DOCOPY-MOVE-AS=" + addas

	try {
		// get request storage
		portalObj.setMessage(portalObj.getPhrase("LBL_LOADING"));
		var oXml = portalWnd.httpRequest(api, null, "", "", false);
		portalObj.setMessage("");

		var msg=portalObj.getPhrase("msgErrorReportedBy") + " Transaction service:\n";
		portalWnd.oError.setMessage("");
		if (portalWnd.oError.isErrorResponse(oXml,true,true,false,msg,window))
			return;

		var objCopy = portalWnd.oError.getDSObject();
		lastAGS = objCopy;

		// message and message number
		var message = objCopy.getElementValue(TAG_MESSAGE);
		var msgnbr = parseInt(objCopy.getElementValue(TAG_MSGNBR),10);
		if ((message == "") && (msgnbr != 0))
			message = portalObj.getPhrase("LBL_AGS_ERROR") + " " + msgnbr;
		portalObj.setMessage(message);
	
		// message number 0 == success
		if (msgnbr == 0)
		{
			dirty()
			loadTree(Tree,"")
			showHelp()
		}
		// show error message, if exists
		else
			portalWnd.cmnDlg.messageBox(message,"ok","stop",window);

		objCopy = null;

	} catch (e)	{
		portalWnd.displayExceptionMessage(e,"admin/officemanager/popup.js","clipCopy");
	}
}

//-----------------------------------------------------------------------------
function clipPaste(newparseq, addas)
{
	// prepare ags call
	var functionCode = "O" // D=Delete, E=DeleteWithChildren, M=Move, O=MoveWithChildren, V=Copy, W=CopyWithChildren

	// copy the bookmark (and children) to the new location
	var api = portalWnd.AGSPath + "?_PDL=LOGAN&_TKN=LO12.1&" +
		"_EVT=CHG&" +
		"_RTN=DATA&" +
		"_OUT=XML&" +
		"_TDS=Ignore&" +
		"_LFN=TRUE&" +
		"FC=" + functionCode + "&" +
		"LOB-BOOK-MARK=" + portalWnd.trim( activesourceclipparam ) + "&" +
		"DOCOPY-MOVE-TO-SEQ=" + portalWnd.trim( newparseq ) + "&" +
		"DOCOPY-MOVE-AS=" + addas
	
	try {
		// get request storage
		portalObj.setMessage(portalObj.getPhrase("LBL_LOADING"));
		var oXml = portalWnd.httpRequest(api, null, "", "", false);
		portalObj.setMessage("");

		var msg=portalObj.getPhrase("msgErrorReportedBy") + " Transaction service:\n";
		portalWnd.oError.setMessage("");
		if (portalWnd.oError.isErrorResponse(oXml,true,true,false,msg,window))
			return;

		var objPaste = portalWnd.oError.getDSObject();
		lastAGS = objPaste;
		
		// message and message number
		var message = objPaste.getElementValue(TAG_MESSAGE);
		var msgnbr = parseInt(objPaste.getElementValue(TAG_MSGNBR),10);
		if ((message == "") && (msgnbr != 0))
			message = portalObj.getPhrase("LBL_AGS_ERROR") + " " + msgnbr;
		portalObj.setMessage(message);
		
		// message number 0 == success
		if (msgnbr == 0)
		{
			dirty()
			loadTree(Tree,"")
			showHelp()
		}
		// show error message, if exists
		else
			portalWnd.cmnDlg.messageBox(message,"ok","stop",window);
		
		objPaste=null;

	} catch (e)	{
		portalWnd.displayExceptionMessage(e,"admin/officemanager/popup.js","clipPaste")
	}
}

//-----------------------------------------------------------------------------
function detCoords(t)
{
	// in ns, t sometimes null
	if (!t) return;
	
	// loop upwards, adding coordinates
 	var oTmp=t
	var iTop=0
	var iLeft=0
	
	if (typeof(oTmp.offsetParent) != "object")
		return
	
	while(oTmp.offsetParent)
	{
		iTop+=oTmp.offsetTop
		iLeft+=oTmp.offsetLeft
		oTmp=oTmp.offsetParent
	}
		
	t.detLeft = iLeft
	t.detTop = iTop
	
	t.detWidth = parseInt(t.offsetWidth,10)
	t.detHeight = parseInt(t.offsetHeight,10)
	t.detRight = t.detLeft + t.detWidth
	t.detBottom = t.detTop + t.detHeight

	t.detCoords = true
}

//-----------------------------------------------------------------------------
// fake mouse position based on activesourcelement location
function fakeMouse()
{
	detCoords(activesourcelayer)
	mX = parseInt((activesourcelayer.detLeft + activesourcelayer.detRight)/2,10)
	mY = parseInt((activesourcelayer.detTop + activesourcelayer.detBottom)/2,10)
	detMouse2()
}
