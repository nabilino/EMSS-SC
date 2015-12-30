/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/dialogs/Attic/searchdlg.js,v 1.1.2.1.14.3.2.3 2012/08/08 12:37:24 jomeli Exp $NoKeywords: $ */
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
var portalWnd=window.opener;
var isIE=(portalWnd.oBrowser.isIE);
window.document.title=portalWnd.lawsonPortal.getPhrase("LBL_SEARCH_RESULTS");


function srchInit()
{
	var srchTitle=window.document.getElementById("srchTitle");
	srchTitle.innerHTML=portalWnd.lawsonPortal.getPhrase("LBL_SEARCH_RESULTS");
	var btnClose=window.document.getElementById("btnClose");
	btnClose.value=portalWnd.lawsonPortal.getPhrase("LBL_CLOSE");

	srchRefresh();

	document.body.style.visibility="visible";
	document.body.style.cursor="auto";
	btnClose.focus()
	window.setTimeout("srchOnResize()",5);
}

//-----------------------------------------------------------------------------
function srchOnResize()
{
	var scrHeight=(isIE 
		? window.document.body.offsetHeight
		: window.innerHeight-2);
	var scrWidth=(isIE 
		? window.document.body.offsetWidth
		: window.innerWidth-2);

	var srchTitle=window.document.getElementById("srchTitle");
	var srchText=window.document.getElementById("srchText");
	srchText.style.left=srchTitle.offsetWidth+80;

	var srchContentFrm=window.document.getElementById("srchContentFrm");
	srchContentFrm.style.top=10;
	srchContentFrm.style.left=10;
	srchContentFrm.style.height=scrHeight-20;
	srchContentFrm.style.width=scrWidth-20;

	var srchContent=window.document.getElementById("srchContent");
	srchContent.style.top=25;
	srchContent.style.left=15;
	srchContent.style.height=srchContentFrm.offsetHeight-40;
	srchContent.style.width=srchContentFrm.offsetWidth-30;

	var srchButtons=window.document.getElementById("srchButtons");
	srchButtons.style.top=srchContent.offsetHeight-30;
	srchButtons.style.left=0;
	srchButtons.style.width="100%";
	srchButtons.style.textAlign="right";

	var listDiv=window.document.getElementById("listDiv");
	listDiv.style.width=srchContent.offsetWidth-20;
	listDiv.style.height=srchContent.offsetHeight-50;

	var scrollDiv=window.document.getElementById("scrollDiv");
	scrollDiv.style.top=0;
	scrollDiv.style.left=0;
	scrollDiv.style.width=listDiv.offsetWidth;
	scrollDiv.style.height=listDiv.offsetHeight;

	var tableDiv=window.document.getElementById("tableDiv");
	tableDiv.style.top=0;
	tableDiv.style.left=0;
	tableDiv.style.width=scrollDiv.offsetWidth - 
				(scrollDiv.scrollHeight <= scrollDiv.offsetHeight ? 2 : 20);
	tableDiv.style.height=scrollDiv.offsetHeight;
}

//-----------------------------------------------------------------------------
function srchRefresh()
{
	var listDiv=window.document.getElementById("listDiv");
	listDiv.innerHTML="";

	var srchDoc=portalWnd.lawsonPortal.searchDoc;
	var programs=srchDoc.getElementsByTagName("PROGRAM");
	var bookmarks=srchDoc.getElementsByTagName("BOOKMARK");
 	var srchText=window.document.getElementById("srchText");
	var cnt=0;
	
	var strHTML="<div id='scrollDiv' class='scrollDiv' style='position:absolute;top:0px;left:0px;'>";
	strHTML+="<div id='tableDiv' style='position:absolute;top:0px;left:0px;'>";

	var len=bookmarks.length;
	if (len > 0)
	{
		strHTML+="<table border='0' cellspacing='0' cellpadding='0' ";
		strHTML+="style='table-layout:fixed;width:100%;";
		strHTML+="margin-bottom:10px;border:1px solid lightgrey;'>\n";
		strHTML+="<tr><td class='xTNavHead' style='border:0;padding:3px;cursor:default;height:100%;'>";
		strHTML+=portalWnd.lawsonPortal.getPhrase("lbl_BOOKMARKS")+"</td></tr>\n";
	
		for (var i=0; i < len; i++)
		{
			if (bookmarks[i].nodeName=="#comment")
				continue;
			cnt=cnt+1;
			strHTML+="<tr>\n";
			var value=bookmarks[i].getAttribute("nm");
			strHTML+="<td valign='top' style='word-wrap:break-word;'>";
			strHTML+="<button class='xTNavItem' hideFocus ";
			strHTML+=(isIE ? "style='width:98%' " : "");
			strHTML+="onclick='srchOnClick(this)' ";
			strHTML+="onfocus='srchOnFocus(this)' ";
			strHTML+="onblur='srchOnBlur(this)' ";
			strHTML+="onmouseover='srchOnMouseOver(this)' ";
			strHTML+="onmouseout='srchOnMouseOut(this)' ";
			var url=bookmarks[i].getAttribute("url");
			var key=bookmarks[i].getAttribute("key")
			var desc=bookmarks[i].getAttribute("desc")
			var fcn="switchContents('"+url+"')";
			if(bookmarks[i].getAttribute("newwin")=="1")
				fcn="openBookmarkWindow('" + key + "', '" + url + "')";

			strHTML+=" fcn=\""+fcn+"\">"+(value ? value : "&nbsp;")+"</button></td>";
			strHTML+="<tr>\n";
		}
		strHTML+="</table>\n";
	}

	var curSys="";
	len=programs.length
	for (var i=0; i < len; i++)
	{
		// exclude from list if transfer not allowed
		if (programs[i].getAttribute("notokenxfer") == "1")
			continue;
		cnt=cnt+1;
		var sysname=programs[i].getAttribute("sysname")
		if (curSys != sysname)
		{
			if (i!=0) strHTML+="</table>\n";
			curSys=sysname;
			strHTML+="<table border='0' cellspacing='0' cellpadding='0' ";
			strHTML+="style='table-layout:fixed;width:100%;";
			if (i!=0) strHTML+="margin-top:10px;"
			strHTML+="margin-bottom:10px;border:1px solid lightgrey;'>\n";
			strHTML+="<tr><td class='xTNavHead' style='border:0;padding:3px;cursor:default;height:100%;'>";
			strHTML+=curSys+"</td></tr>\n";
		}
		var name=programs[i].getAttribute("nm")
		var tkn=programs[i].getAttribute("tkn")
		strHTML+="<tr>\n";
		strHTML+="<td valign='top' style='word-wrap:break-word;'>";
		strHTML+="<button class='xTNavItem' hideFocus ";
		strHTML+=(isIE ? "style='width:98%' " : "");
		strHTML+="onclick='srchOnClick(this)' ";
		strHTML+="onfocus='srchOnFocus(this)' ";
		strHTML+="onblur='srchOnBlur(this)' ";
		strHTML+="onmouseover='srchOnMouseOver(this)' ";
		strHTML+="onmouseout='srchOnMouseOut(this)' ";
		strHTML+="fcn=\"formTransfer('"+tkn+"')\">"+name+" ("+tkn+")</button></td>";
		strHTML+="<tr>\n";
	}
	strHTML+="</table></div></div>\n";
	srchText.innerHTML = (cnt + " " + portalWnd.lawsonPortal.getPhrase("HITS_FOR") + 
			" \'" + portalWnd.lawsonPortal.searchText + "\'" );
			
	listDiv.innerHTML=strHTML;
	window.setTimeout("srchOnResize()",5);
}

//-----------------------------------------------------------------------------
function srchOnKeyDown()
{
	var bEvtCaught=false;
	var mElement;
	switch(event.keyCode)
	{
		case 13:				// Enter
			if (event.srcElement.id == "txtPhrase")
			{
				bEvtCaught=true
				btnOK.click()
			}
			break;
		case 27:				// escape
			bEvtCaught=true
			window.close()
			break;
	}
	if (bEvtCaught)
	{
		event.cancelBubble=true
		event.returnValue=false
	}
	return (!bEvtCaught)
}

//-----------------------------------------------------------------------------
function srchOnClick(btn)
{
	try {
		var fcn=btn.getAttribute("fcn");
		portalWnd.focus();
		eval("portalWnd."+fcn);
		window.close()
		
	} catch (e) { }
}

//-----------------------------------------------------------------------------
function srchOnFocus(btn)
{
	try { portalWnd.navletItemFocus(window.event); } catch (e) { }
}
function srchOnBlur(btn)
{
	try { portalWnd.navletItemBlur(window.event); } catch (e) { }
}
function srchOnMouseOver(btn)
{
	try { portalWnd.navletItemMouseOver(window.event); } catch (e) { }
}
function srchOnMouseOut(btn)
{
	try { portalWnd.navletItemMouseOut(window.event); } catch (e) { }
}
