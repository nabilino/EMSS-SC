/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/servenv.js,v 1.6.2.3.4.9.8.1.2.3 2012/08/08 12:37:20 jomeli Exp $ */
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
// Do not comment out the following
var wndArguments = (window.dialogArguments != null && typeof(window.dialogArguments) != "undefined")
	? window.dialogArguments : null;

var msgDOMAIN = "Window dialog arguments not available.\n" + 
			"Notify administrator 'servenv.js' document domain not set.";
var bDomain = false;

//-----------------------------------------------------------------------------
// method to locate window with object strObj defined (start window optional)
function envFindObjectWindow(strObj,startWnd)
{
	var aWnd=null;
	try {
		var aParent=(typeof(startWnd) != "undefined" 
				? startWnd : window);
		while (aParent)
		{
			var obj=eval("aParent."+strObj);
			if (obj != null && typeof(obj) != "undefined")
			{
				aWnd=aParent;
				break;
			}
			aParent=(typeof(aParent.parent) != "undefined" && aParent.parent != aParent.self
					? aParent.parent : null);
		}
	} catch (e) { }
	return aWnd;
}
//-----------------------------------------------------------------------------
// method to load value storage object with script version info
function envLoadWindowScriptVersions(oVer,oWnd,portalWnd)
{
	try {
		if (typeof(portalWnd) == "undefined")
			portalWnd=oWnd;

		if (!oVer) return;	// page loading from index.htm?

		var path=oWnd.document.location.pathname;
		if (path.substr(0,1) != "/")
			path="/"+path;
		var iPos=path.lastIndexOf("/");
		if (iPos != -1)
			path=path.substr(0,iPos);
		var len=oWnd.document.scripts.length;
		for (var i=0; i < len; i++)
		{
			// build a full path to the file
			var name=oWnd.document.scripts(i).src;
			if (!name) continue;
			var thispath=path;
			while (name.substr(0,3)=="../")
			{
				name=name.substr(3);
				iPos=thispath.lastIndexOf("/");
				if (iPos != -1)
					thispath=thispath.substr(0,iPos);
			}
			var fullpath=(name.substr(0,1) == "/" ? name : thispath+"/"+name);

			// set the name value relative to portal root
			var name = fullpath;
			var portalPath=(portalWnd.lawsonPortal
				? portalWnd.lawsonPortal.path : path);
			if (name.substr(0,portalPath.length) == portalPath)
				name=name.substr(portalPath.length+1);
			var item=oVer.getItem(name);
			if (item) continue;		// already have the version info

			// have to get the file to parse out version info
			var text = portalWnd.httpRequest(fullpath,null,"text/plain","text/plain",false);
			if (text.status) continue;		// 404? or some other failure
			iPos=text.indexOf(".js,v ");
			if (iPos == -1) continue;
			var value = text.substr(iPos+6,60);
			iPos=value.indexOf("Exp $");
			if (iPos != -1)
				value=value.substr(0,iPos-1);
			iPos=value.lastIndexOf(" ");		// strip developer name
			if (iPos != -1)
				value=value.substr(0,iPos);
			oVer.add(name,value);
		}
		
	} catch (e) { }
}

//-----------------------------------------------------------------------------
//Uncomment the following for PSA
/*
var ENVDOMAIN = "lawson.com";

if (navigator.appName.indexOf("Microsoft") >= 0)
{
	try	{
		window.document.domain = ENVDOMAIN;
	}
	catch(e) {
		window.status = "WARNING: Could not enforce domain rules ("+ENVDOMAIN+"). [servenv.js]";
	}
}
//Cross-domain is unsupported in Mozilla XMLHTTP
else
	bDomain = true;
*/