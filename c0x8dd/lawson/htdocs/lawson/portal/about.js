/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/about.js,v 1.17.4.1.4.3.14.1.2.3 2012/08/08 14:19:30 jomeli Exp $ */
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
var winOpener=null;
var portalWnd=null;
var portalObj=null;

function aboutInit()
{
	// find portal
	winOpener = (wndArguments) ? wndArguments[0] : ((opener) ? opener : null) ;
	if (winOpener && winOpener.lawsonPortal)
		portalWnd=winOpener;
	else
		portalWnd=envFindObjectWindow("lawsonPortal");;
	portalObj=portalWnd.lawsonPortal;

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	// size and position things
	var scrWidth = (portalObj.browser.isIE) ? document.body.offsetWidth : window.innerWidth;
	var scrHeight = (portalObj.browser.isIE) ? document.body.offsetHeight : window.innerHeight;
	var imgDiv = document.getElementById("imgDiv");
	imgDiv.style.left = parseInt((scrWidth-468)/2, 10) + "px";
	imgDiv.style.top = parseInt((scrHeight-368)/2, 10) + "px";
	var bgDiv = document.getElementById("bgDiv");
	bgDiv.style.left = imgDiv.style.left;
	bgDiv.style.top = imgDiv.style.top;

	
	// start building page
	portalWnd.cmnSetElementText(document.getElementById("versionNumber"),
			portalWnd.oPortalConfig.getPortalVersion());

	/* EKM currently doesn't work with Portal 4.0
	if (typeof(portalObj.knIsEKM) != "boolean"
		|| portalObj.knIsEKM == true)
	{
		var scDir =  portalObj.path + "/knowledge/knowledge.js";
		var scSource =  portalWnd.httpRequest(scDir, null, "text/html", "text/plain");

		if (scSource.status)
			portalObj.knIsEKM = false;
		else
		{
			portalObj.knIsEKM = true;
			var iPos = scSource.indexOf("knEKMVersion");
			scSource = scSource.substr(iPos+16);
			iPos = scSource.indexOf("\"");
			var ver = scSource.substr(0,iPos);
			portalWnd.cmnSetElementText(document.getElementById("ekmVersion"),ver);
			document.getElementById("copyright").style.top = "120px";
			var elem = document.getElementById("knowledge");
			elem.style.visibility = "visible";
			elem.style.display = "block";
		}
	}
	*/

	document.body.style.visibility="visible";
	document.getElementById("btnClose").focus();
}
function aboutKeyDown(e)
{
	var evt = e ? e : window.event;
	if (evt.keyCode == 27)	// Esc
		aboutClose()
}
function aboutClose()
{
	if (winOpener)
		window.close();
	else
		portalWnd.goHome();
}