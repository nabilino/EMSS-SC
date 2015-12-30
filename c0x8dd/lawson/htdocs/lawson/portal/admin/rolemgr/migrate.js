/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/admin/rolemgr/migrate.js,v 1.16.2.10.4.5.12.2.2.2 2012/08/08 12:37:29 jomeli Exp $ */
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

var migrateDS=null;
var bCancelMig=false;
var migrateFile="";
var dsHotkeys=null;

//-----------------------------------------------------------------------------
function doMigrate()
{
	var msg = oMsgs.getPhrase("msgFunctionWillMigrate") +
		" " + oDefaultRole.ver + ".\n" + oMsgs.getPhrase("msgOkToContinue")
	var retVal = portalWnd.cmnDlg.messageBox(msg,"okcancel","question",window);
	if (retVal == "cancel") return;

	// start
	oFeedBack.show();
	bInMigrate=true;
	tblFiles.style.display="none"
	divMigrate.style.display="block"
	document.body.style.cursor="wait"
	rolSetFrameworkState("migrate")
	setTimeout("rolDoMigrate()",5);
}

//-----------------------------------------------------------------------------
function rolDoMigrate()
{
	// load default role hotkeys xml (may not exist after 8.1.0?)
	var oFile=portalWnd.fileMgr.getFile(portalObj.path+"/data",
				"hotkeys.xml","text/xml",false);
	if (oFile && !oFile.status)
	{
		dsHotkeys = new portalWnd.DataStorage(
			(portalObj.browser.isIE ? oFile.xml : oFile), portalWnd);
	}

	var errorMsg=oMsgs.getPhrase("msgMigrateError")+"\n";
	var bError=false;
	var files=fileStorage.document.getElementsByTagName("FILE")
	var len = files.length
	for (var i = 0; i < len; i++)
	{
		// check cancel flag
		if (bCancelMig)
		{
			var msg = oMsgs.getPhrase("msgCancelMigrate");
			var retVal = portalWnd.cmnDlg.messageBox(msg,"yesno","question",window);
			var bCancel = (retVal == "yes" ? true : false);
			if (bCancel)
			{
				rolMigrationDone();
				return;
			}
			// continue with migration
			rolSetMigCancel(false);
		}

		// skip the default role file
		if (files[i].firstChild.nodeValue == "default.xml")
			continue;

		// we have a file to migrate
		migrateFile=files[i].firstChild.nodeValue;
		if (!rolMigrateFile())
		{
			// update error message
			bError=true;
			errorMsg+=migrateFile+"\n";
		}
	}
	if (bError)
		portalWnd.cmnDlg.messageBox(errorMsg,"ok","alert",window);
	bHasMigrated=(bError ? false : rolSetMigrated());
	rolMigrationDone();
}

//-----------------------------------------------------------------------------
function rolMigrationDone()
{
	bInMigrate=false;
	oFeedBack.hide();
	document.body.style.cursor="auto"
	divMigrate.style.display="none";
	tblFiles.style.display="block";
	rolSetFrameworkState("select");
	posInFirstField();
}

//-----------------------------------------------------------------------------
function rolMigrateFile()
{
	try	{
		var oResponse=portalWnd.fileMgr.getFile(portalObj.path+"/data/roles",
				migrateFile,"text/xml",false,true);
		if (!oResponse || oResponse.status)
		{
			var msg=portalObj.getPhrase("ERROR_LOAD_XML")+": "+migrateFile;
			portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
			return false;
		}
		if (portalWnd.fileMgr.getStatus(oResponse) != "0")
		{
			var msg=portalObj.getPhrase("ERROR_LOAD_XML")+": "+migrateFile + "\n";
			msg += portalWnd.fileMgr.getMessage(oResponse);
			portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
			return false;
		}

		// load response in data storage object
		var roleNode = oResponse.getElementsByTagName("ROLE")
		if (roleNode.length < 1) return false;
		roleNode = roleNode[0]
		migrateDS=null
		migrateDS = new portalWnd.DataStorage(
			(portalObj.browser.isIE ? roleNode.xml : roleNode), portalWnd)
		if (!migrateDS.document) return false;

		// validate the XML format
		var roleDoc=migrateDS.getElementsByTagName("ROLE")
		if (roleDoc.length < 1) return false;
		roleDoc = roleDoc[0];

		// already at right version?
		var ver=roleDoc.getAttribute("version")
		if (ver && ver == oDefaultRole.ver)
			return true;

		// construct migration method
		var re=/\./g
		var migFunction="rolMigrate" + (ver ? ver.replace(re,"_") : "None") + 
				"To" + oDefaultRole.ver.replace(re,"_") + "()";
		return (eval(migFunction));

	} catch(e) { }
	return false;
}

//-----------------------------------------------------------------------------
function rolSaveMigratedDS()
{
	try {
		var strXML=migrateDS.getDataString(true)
		var oResponse = portalWnd.fileMgr.save(portalObj.path+"/data/roles",
					migrateFile, strXML, "text/xml");
		// server error?
		return (oResponse ? true : false);

	} catch (e) { }
	return false;
}

//-----------------------------------------------------------------------------
function rolSetMigrated()
{
	var oResponse = portalWnd.fileMgr.save(portalObj.path+"/data/roles",
				"migratedversion", oDefaultRole.ver, "text/plain");
	// server error?
	return (oResponse ? true : false);
}

//-----------------------------------------------------------------------------
function rolSetHasMigrated()
{
	bHasMigrated=false;
	var textMig = portalWnd.fileMgr.getFile(portalObj.path+"/data/roles",
			"migratedversion", "text/plain", false);
	if (!textMig || textMig.status || textMig.document || textMig.xml)
		return;
	bHasMigrated = (textMig == oDefaultRole.ver ? true : false);
}

//-----------------------------------------------------------------------------
function rolSetMigCancel(cancel)
{
	if (typeof(cancel) != "boolean")
		cancel=true;
	bCancelMig=cancel;
}

//-----------------------------------------------------------------------------
// start version specific migration logic
//-----------------------------------------------------------------------------
function rolMigrateNoneTo4_0_0()
{
	var roleNode=migrateDS.getElementsByTagName("ROLE")
	roleNode = (roleNode && roleNode.length > 0 ? roleNode[0] : null);
	if (!roleNode) return false;

	// allow keyboard customization
	var node=migrateDS.document.createElement("CUSTOMKEYBOARD");
	roleNode.appendChild(node);

	// allow shortcuts?
	node=roleNode.getElementsByTagName("CUSTOMSHORTCUTS");
	if (node && node.length == 1)
	{
		roleNode.appendChild(node[0]);
		node=roleNode.getElementsByTagName("LEFTBAR");
		if (node && node.length == 1)
			roleNode.removeChild(node[0])
	}

	// move find menu node
	var findNode=roleNode.getElementsByTagName("FIND");
	if (findNode && findNode.length == 1)
	{
		findNode=findNode[0];
		node = findNode.getElementsByTagName("MENU");
		if (node && node.length==1)
		{
			findNode.appendChild(node[0]);
			node = findNode.getElementsByTagName("BUTTON");
			if (node && node.length==1)
				findNode.removeChild(node[0]);
		}
		// add the lawson applications search item
		var mnuNode = findNode.getElementsByTagName("MENU");
		if (mnuNode && mnuNode.length==1)
		{
			mnuNode=mnuNode[0];
			var appsNode=migrateDS.document.createElement("ITEM");
			appsNode.setAttribute("id","lawson");
			appsNode.setAttribute("labelid","lblLawsonApps");
			appsNode.setAttribute("action","LAW_SEARCH");
			appsNode.setAttribute("href","/servlet/LawSearch?PDL=<<productline>>&TYPE=Programs.token;Bookmarks;Programs.name&ROF=Programs.token&q=");
			mnuNode.insertBefore(appsNode,mnuNode.childNodes[0]);
		}

		// change Excite to MSN
		var msnNode=migrateDS.getNodeByAttributeId("ITEM","id","Excite");
		if (msnNode)
		{
			msnNode.setAttribute("id","MSN");
			msnNode.setAttribute("labelid","lbl_MSN");
			msnNode.setAttribute("action","WEB_SEARCH");
			msnNode.setAttribute("href","http://search.msn.com/results.aspx?FORM=SMCRT&q=");
		}

		// change Yahoo search url
		var yahooNode=migrateDS.getNodeByAttributeId("ITEM","id","Yahoo");
		if (yahooNode)
		{
			yahooNode.setAttribute("id","Yahoo");
			yahooNode.setAttribute("labelid","lbl_YAHOO");
			yahooNode.setAttribute("action","WEB_SEARCH");
			yahooNode.setAttribute("href","http://search.yahoo.com/bin/search?p=");
		}
	
		// change PRODLINE to ProductLine on bookmarks item
		node=migrateDS.getNodeByAttributeId("ITEM","id","bkmrks");
		if (node)
		{
			var href=node.getAttribute("href")
			href=href.replace("PRODLINE","productline");
			node.setAttribute("href",href);
		}
	
		// change href for KnowledgeBase (or add KB item)
		node=migrateDS.getNodeByAttributeId("ITEM","id","KB");
		if (node)
			node.setAttribute("href","http://knowledgebase.lawson.com?query=");
		
		// update any items missing an action attribute
		node = findNode.getElementsByTagName("MENU");
		if (node && node.length==1)
		{
			node=node[0];
			var len = node.childNodes.length;
			for (var i = 0; i < len; i++)
			{
				var itmNode=node.childNodes[i];
				if (itmNode.getAttribute("action"))
					continue;
				itmNode.setAttribute("action","WEB_SEARCH")
			}
		}
	}
	
	// change DESCRIPTION to FirstName on welcome message
	try {
		node=migrateDS.getElementsByTagName("WELCOME");
		node = (node && node.length > 0 ? node[0] : null);
		if (node)
		{
			var text=node.childNodes[0].nodeValue
			text=text.replace("DESCRIPTION","FirstName");
			text=text.replace("&&,","&&");
			node.childNodes[0].nodeValue=text;
		}
	} catch (e) { }

	// move the support menu item
	var supNode=migrateDS.getNodeByAttributeId("ITEM","id","Support")
	if (supNode)
	{
		supNode.setAttribute("action","function");
		supNode.setAttribute("href","portalShowSupport");
		node=migrateDS.getNodeByAttributeId("MENU","id","LAWMENUBTNHELP")
		if (node)
			node.insertBefore(supNode,node.childNodes[0]);
	}

	// create new portal user help menu item
	node=migrateDS.getNodeByAttributeId("MENU","id","LAWMENUBTNHELP")
	if (node)
	{
		var userHelp=migrateDS.document.createElement("ITEM");
		userHelp.setAttribute("href","portalShowUserHelp");
		userHelp.setAttribute("id","UserHelp");
		userHelp.setAttribute("labelid","LBL_USER_HELP");
		userHelp.setAttribute("action","function");
		node.appendChild(userHelp);
	}

	// insert hotkeys if needed
	node=roleNode.getElementsByTagName("EVENTS");
	if (!node || node.length < 1 && dsHotkeys)
	{
		node=dsHotkeys.getElementsByTagName("EVENTS");
		node = (node && node.length > 0 ? node[0] : null);
		if (node)
			roleNode.appendChild(node);
	}
	
	// change user options href
	node=migrateDS.getNodeByAttributeId("ITEM","id","UserOpts");
	if (node)
		node.setAttribute("href","users/preferences/index.htm");

	// remove the NAV (GoTo) menu
	node=migrateDS.getNodeByAttributeId("MENU","id","LAWMENUBTNNAV");
	if (node)
		node.parentNode.removeChild(node);

	// remove USENEWTB
	node=roleNode.getElementsByTagName("USENEWTB");
	if (node && node.length == 1)
		roleNode.removeChild(node[0]);

	// remove the posInMenubar
	node=migrateDS.getNodeByAttributeId("EVENT","action","posInMenubar");
	if (node)
		node.parentNode.removeChild(node);

	// reset 'incontext' on posInNavbar
	node=migrateDS.getNodeByAttributeId("EVENT","action","posInNavbar");
	if (node)
	{
		node.setAttribute("incontext","0");

		// insert toggle nav panel
		var toggleNode=migrateDS.document.createElement("EVENT");
		toggleNode.setAttribute("labelid","lblSwitchNavbarState");
		toggleNode.setAttribute("code","118");
		toggleNode.setAttribute("alt","0");
		toggleNode.setAttribute("ctrl","1");
		toggleNode.setAttribute("shift","1");
		toggleNode.setAttribute("action","switchNavPanelState");
		toggleNode.setAttribute("incontext","0");
		node.parentNode.insertBefore(toggleNode,node);
	}

	// insert new window hotkey
	node=migrateDS.getNodeByAttributeId("EVENT","action","openNewWindow");
	if (!node)
	{
		node=migrateDS.getNodeByAttributeId("EVENT","action","goHome");
		if (node)
		{
			var newWndNode=migrateDS.document.createElement("EVENT");
			newWndNode.setAttribute("labelid","lblOpenNewWindow");
			newWndNode.setAttribute("code","78");
			newWndNode.setAttribute("alt","0");
			newWndNode.setAttribute("ctrl","1");
			newWndNode.setAttribute("shift","0");
			newWndNode.setAttribute("action","openNewWindow");
			newWndNode.setAttribute("incontext","1");
			node.parentNode.insertBefore(newWndNode,node);
		}
	}

	// reset about,hotkeys menu items
	node=migrateDS.getNodeByAttributeId("ITEM","id","About");
	if (node)
	{
		node.setAttribute("href","portalShowAbout");
		node.setAttribute("action","function");
	}
	node=migrateDS.getNodeByAttributeId("ITEM","id","Hotkeys");
	if (node)
	{
		node.setAttribute("href","portalShowHotkeyHelp");
		node.setAttribute("action","function");
	}

	// set the id
	roleNode.setAttribute("id",migrateFile);

	// set the version
	roleNode.setAttribute("version",oDefaultRole.ver);
	return (rolSaveMigratedDS());
}
//-----------------------------------------------------------------------------
function rolMigrateNoneTo9_0_0()
{
	//reuse 400 migration path since 900 is only a rename
	var success = rolMigrateNoneTo4_0_0();
	return success;
}
//-----------------------------------------------------------------------------
function rolMigrate4_0_0To9_0_0()
{
	//nothing to migrate... 400 is the same as 900
	return true
}
//-----------------------------------------------------------------------------
function rolMigrateNoneTo4_1_0()
{
// future example or:
//function rolMigrate4_1_0To4_2_0()
}
