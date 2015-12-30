/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/PortalRole.js,v 1.14.2.10.4.5.14.3.2.2 2012/08/08 12:37:30 jomeli Exp $ */
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
// PortalRole object constructor
function PortalRole(portalWnd,id)
{
	this.initialized=false;
	this.portalWnd = portalWnd;
	this.portalObj = this.portalWnd.lawsonPortal;
	this.path = this.portalObj.path+"/data/roles";
	this.id = id;

	this.home = "home.htm";
	this.accessKnowledgeBase = false;
	this.allowHotkeys = true;
	this.useFind = true;
	this.useInbasket = false;
	this.useMenus = true;
	this.usePreferencesMenu = false;
	this.useContentMenu = false;
	this.useShortcuts = true;
	this.ver = "";
	this.loadMsg = "";
	this.storage = null;

	if (typeof(id) == "undefined")
		return;
	if (!this.load(id))
	{
		if (id == "default.xml" || !this.load("default.xml"))
		{
			// serious problem!
			msg=this.portalObj.getPhrase("msgErrorLoadRoleDefault") + this.loadMsg;
			this.portalWnd.cmnDlg.messageBox(msg,"ok","stop")
			return;
		}
		this.setId(id);
	}
	this.initialized=this.initialize();
}

//-----------------------------------------------------------------------------
PortalRole.prototype.getHome=function()
{
	return this.home;
}
PortalRole.prototype.setHome=function(home)
{
	if (typeof(home) == "string")
		this.home=home;
	return this.home;
}
//-----------------------------------------------------------------------------
PortalRole.prototype.getAccessKnowledgeBase=function()
{
	return this.accessKnowledgeBase;
}
PortalRole.prototype.setAccessKnowledgeBase=function(accessKnowledgeBase)
{
	if (typeof(accessKnowledgeBase) == "boolean")
		this.accessKnowledgeBase=accessKnowledgeBase;
	return this.accessKnowledgeBase;
}

//-----------------------------------------------------------------------------
PortalRole.prototype.getAllowHotkeys=function()
{
	return this.allowHotkeys;
}
PortalRole.prototype.setAllowHotkeys=function(allowHotkeys)
{
	if (typeof(allowHotkeys) == "boolean")
		this.allowHotkeys=allowHotkeys;
	return this.allowHotkeys;
}

//-----------------------------------------------------------------------------
PortalRole.prototype.getId=function()
{
	return this.id;
}
PortalRole.prototype.setId=function(id)
{
	this.id=id;
	var roleNode=this.storage.getRootNode();
	roleNode.setAttribute("id",id);
}

//-----------------------------------------------------------------------------
PortalRole.prototype.getRoleOption=function(id)
{
	return (this.storage.getNodeByAttributeId("ROLEOPTION","id",id));
}

//-----------------------------------------------------------------------------
PortalRole.prototype.setRoleOption=function(id,value)
{
	var optionNode = this.storage.getNodeByAttributeId("ROLEOPTION","id",id);
	if (optionNode)
		optionNode.setAttribute("value",value);
}

//-----------------------------------------------------------------------------
PortalRole.prototype.getRoleOptionValue=function(id,defVal)
{
	var optionNode = this.storage.getNodeByAttributeId("ROLEOPTION","id",id);
	return (optionNode
		? optionNode.getAttribute("value")
		: defVal);
}

//-----------------------------------------------------------------------------
PortalRole.prototype.getUseFind=function()
{
	return this.useFind;
}
PortalRole.prototype.setUseFind=function(useFind)
{
	if (typeof(useFind) == "boolean")
		this.useFind=useFind;
	return this.useFind;
}

//-----------------------------------------------------------------------------
PortalRole.prototype.getUseInbasket=function()
{
	return this.useInbasket;
}
PortalRole.prototype.setUseInbasket=function(useInbasket)
{
	if (typeof(useInbasket) == "boolean")
		this.useInbasket=useInbasket;
	return this.useInbasket;
}

//-----------------------------------------------------------------------------
PortalRole.prototype.getUseMenus=function()
{
	return this.useMenus;
}
PortalRole.prototype.setUseMenus=function(useMenus)
{
	if (typeof(useMenus) == "boolean")
		this.useMenus=useMenus;
	return this.useMenus;
}
PortalRole.prototype.getUsePreferencesMenu=function()
{
	return this.usePreferencesMenu;
}
PortalRole.prototype.setUsePreferencesMenu=function(usePrefs)
{
	if (typeof(usePrefs) == "boolean")
		this.usePrefs=usePrefs;
	return this.usePrefs;
}
PortalRole.prototype.getUseContentMenu=function()
{
	return this.useContentMenu;
}
PortalRole.prototype.setUseContentMenu=function(useContent)
{
	if (typeof(useContent) == "boolean")
		this.useContent=useContent;
	return this.useContent;
}

//-----------------------------------------------------------------------------
PortalRole.prototype.getUseShortcuts=function()
{
	return this.useShortcuts;
}
PortalRole.prototype.setUseShortcuts=function(useShortcuts)
{
	if (typeof(useShortcuts) == "boolean")
		this.useShortcuts=useShortcuts;
	return this.useShortcuts;
}

//-----------------------------------------------------------------------------
PortalRole.prototype.getVersion=function()
{
	return this.ver;
}

//-----------------------------------------------------------------------------
PortalRole.prototype.addAdminHelpItem=function()
{
	if (!this.useMenus) return;

	var helpMenu=this.storage.getNodeByAttributeId("ITEM","id","AdminHelp")
	if (helpMenu) return;
		
	var helpBtn=this.storage.getNodeByAttributeId("MENU","id","LAWMENUBTNHELP")
	if (!helpBtn) return;

	helpMenu = this.storage.getDocument().createElement("ITEM");
	helpMenu.setAttribute("href","portalShowAdminHelp");
	helpMenu.setAttribute("id","AdminHelp");
	helpMenu.setAttribute("labelid","LBL_ADMIN_HELP");
	helpMenu.setAttribute("action","function");
	helpBtn.appendChild(helpMenu);
}

//-----------------------------------------------------------------------------
PortalRole.prototype.addChangePasswordItem=function()
{
	if (!this.useMenus) return;

	var pwMenu=this.storage.getNodeByAttributeId("ITEM","id","ChangePassword")
	if (pwMenu) return;
		
	var prefsBtn=this.storage.getNodeByAttributeId("MENU","id","LAWMENUBTNPREF")
	if (!prefsBtn) return;

	pwMenu = this.storage.getDocument().createElement("ITEM");
	pwMenu.setAttribute("href","portalChangePassword");
	pwMenu.setAttribute("id","ChangePassword");
	pwMenu.setAttribute("labelid","LBL_CHANGE_PASSWORD");
	pwMenu.setAttribute("action","function");
	prefsBtn.appendChild(pwMenu);
}

//-----------------------------------------------------------------------------
PortalRole.prototype.initialize=function()
{
	if (this.initialized)
		return true;

	if (!this.storage || !this.storage.document)
		return false;

	var roleNode=this.storage.getRootNode();
	if (!roleNode) return false;
	this.ver = roleNode.getAttribute("version");

	// get home page
	var homePage=roleNode.getElementsByTagName("HOME")
	this.home=(homePage.length > 0 
			? homePage[0].firstChild.nodeValue
			: "home.htm");

	// use find?
	var nodes=roleNode.getElementsByTagName("FIND")
	this.useFind = (nodes.length > 0 ? true : false);

	// use inbasket?
	nodes=roleNode.getElementsByTagName("INBASKET")
	this.useInbasket = (nodes.length > 0 ? true : false);

	// use menus?
	nodes=roleNode.getElementsByTagName("MENUBAR")
	this.useMenus = (nodes.length > 0 ? true : false);
	if (this.useMenus)
	{
		var subMenu=this.storage.getNodeByAttributeId("ITEM","id","UserOpts")
		this.usePreferencesMenu=(subMenu ? true : false);
		subMenu=this.storage.getNodeByAttributeId("ITEM","id","Content")
		this.useContentMenu=(subMenu ? true : false);
	}

	// use shortcuts?
	nodes=roleNode.getElementsByTagName("CUSTOMSHORTCUTS")
	this.useShortcuts = (nodes.length > 0 ? true : false);

	// keyboard customization?
	nodes=roleNode.getElementsByTagName("CUSTOMKEYBOARD")
	this.allowHotkeys = (nodes.length > 0 ? true : false);

	// access knowledge base?
	subMenu=this.storage.getNodeByAttributeId("ITEM","id","KB")
	this.accessKnowledgeBase=(subMenu ? true : false);

	return true;
}

//-----------------------------------------------------------------------------
PortalRole.prototype.load=function(fileName)
{
	try	{
		var ds=null
		var role = this.portalObj.profile.getElementsByTagName("ROLE");
		role = (role && role.length == 1 ? role[0] : null);
		if (!role) return false;

		if (fileName == role.getAttribute("id"))
		{
			// if name is profile role, use profile data
			if (this.portalObj.xsltSupport)
				ds = new this.portalWnd.DataStorage("<?xml version=\"1.0\"?>"+role.xml,this.portalWnd)
			else
				ds = new this.portalWnd.DataStorage(role,this.portalWnd)
		}
		else
		{
			var oResponse=this.portalWnd.fileMgr.getFile(this.path,fileName,"text/xml",false,true);
			if ( (!oResponse || oResponse.status)
			|| (this.portalWnd.fileMgr.getStatus(oResponse) != "0") )
			{
				this.loadMsg="\n"+this.portalObj.getPhrase("msgErrorRetrievingFile")+" "+
					this.path+"/"+fileName;
				if (oResponse && oResponse.status)
					this.loadMsg+="\n"+this.portalWnd.oError.getHttpStatusMsg(oResponse.status);
				return false;
			}

			// load response in data storage object
			if (this.portalObj.xsltSupport)
				ds = new this.portalWnd.DataStorage(oResponse.xml,this.portalWnd)
			else
				ds = new this.portalWnd.DataStorage(oResponse,this.portalWnd)
		}

		// validate the XML format
		var root=ds.getRootNode();
		if (!root || root.nodeName != "ROLE")
		{
			this.loadMsg="\n"+this.portalObj.getPhrase("msgInvalidXMLFormat")+" "+
					this.path+"/"+fileName;
			return false;
		}
		
		this.storage=ds;

		// insert configuration options?
		if (!this.portalWnd.oPortalConfig.isRoleBased() )
			return true;

		var node=this.storage.getElementsByTagName("ROLEOPTIONS");
		if (!node || node.length < 1)
		{
			// role options not in role file, insert the global options
			var optsNode=this.portalWnd.oPortalConfig.storage.getElementsByTagName("ROLEOPTIONS");
			optsNode = optsNode && optsNode.length == 1 ? optsNode[0] : null;
			if (optsNode)
			{
				var cloneNode=optsNode.cloneNode(true);
				root.appendChild(cloneNode);
			}
		}

		node=this.storage.getElementsByTagName("USEROPTIONS");
		if (!node || node.length < 1)
		{
			// user options not in role file, insert the global options
			var optsNode=this.portalWnd.oPortalConfig.storage.getElementsByTagName("USEROPTIONS");
			optsNode = optsNode && optsNode.length == 1 ? optsNode[0] : null;
			if (optsNode)
			{
				var cloneNode=optsNode.cloneNode(true);
				root.appendChild(cloneNode);
			}
		}
		return true;

	} catch(e) { 
		this.portalWnd.displayExceptionMessage(e,"objects/PortalRole.js","load")
	}
	return false;
}

//-----------------------------------------------------------------------------
PortalRole.prototype.save=function()
{
	if (!this.initialized)
		return false;
	try {
		// first update storage based on options
		this.validateStorage();

		// ask file manager to save
		var strXML=this.storage.getDataString(true)
		var oResponse = this.portalWnd.fileMgr.save(this.portalObj.path+"/data/roles",
					this.id, strXML, "text/xml");
		if (!oResponse || oResponse.status)
			return false;
		return (this.portalWnd.fileMgr.getStatus(oResponse) != "0" ? false : true);

	} catch (e) { }
	return false;
}

//-----------------------------------------------------------------------------
PortalRole.prototype.setPortalLessMenus=function()
{
	// 'skinny down' the preferences and help menus
	if (!this.useMenus) return;

	var menuBtn=this.storage.getNodeByAttributeId("MENU","id","LAWMENUBTNPREF")
	if (menuBtn)
	{
		var menuItems=menuBtn.getElementsByTagName("ITEM");
		var len = (menuItems ? menuItems.length : 0);
		for (var i = 0; i < len; i++)
		{
			if (menuItems[i].getAttribute("id") == "UserOpts")
				continue;
			menuBtn.removeChild(menuItems[i]);
		}
	}

	menuBtn=this.storage.getNodeByAttributeId("MENU","id","LAWMENUBTNHELP")
	if (menuBtn)
	{
		var menuItems=menuBtn.getElementsByTagName("ITEM");
		var len = (menuItems ? menuItems.length : 0);
		for (var i = 0; i < len; i++)
		{
			if (menuItems[i].getAttribute("id") == "Hotkeys")
				continue;
			menuBtn.removeChild(menuItems[i]);
		}
	}
}

//-----------------------------------------------------------------------------
PortalRole.prototype.validateStorage=function()
{
	// get the root node
	var roleNode = this.storage.getRootNode();

	// allow hotkeys?
	var node=this.storage.document.getElementsByTagName("CUSTOMKEYBOARD");
	node = (node && node.length > 0 ? node[0] : null);
	if (this.allowHotkeys)
	{
		if (!node)
		{
			var doc=this.storage.getDocument();
			node=doc.createElement("CUSTOMKEYBOARD");
			roleNode.appendChild(node);
		}
	}
	else if (node)
		roleNode.removeChild(node);

	// search/find not allowed?
	node = this.storage.document.getElementsByTagName("FIND");
	node = (node && node.length > 0 ? node[0] : null);
	if (!this.useFind && node)
		roleNode.removeChild(node);

	// menubar not allowed?
	node = this.storage.document.getElementsByTagName("MENUBAR");
	node = (node && node.length > 0 ? node[0] : null);
	if (!this.useMenus && node)
		roleNode.removeChild(node);

	// allow shortcuts?
	node=this.storage.document.getElementsByTagName("CUSTOMSHORTCUTS");
	node = (node && node.length > 0 ? node[0] : null);
	if (this.useShortcuts)
	{
		if (!node)
		{
			var doc=this.storage.getDocument();
			node=doc.createElement("CUSTOMSHORTCUTS");
			roleNode.appendChild(node);
		}
	}
	else if (node)
		roleNode.removeChild(node);
}