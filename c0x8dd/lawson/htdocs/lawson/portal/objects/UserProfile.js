/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/UserProfile.js,v 1.23.2.19.4.19.8.6.2.3 2012/08/08 12:37:30 jomeli Exp $ */
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

// UserProfile object constructor
function UserProfile(portalWnd)
{
	this.initialized = false;
	this.portalWnd = portalWnd;
	this.portalObj = this.portalWnd.lawsonPortal;
	this.attStorage = null;
	this.loadAttributes();
	this.path = this.portalObj.path + "/data/users";
	this.id = this.getAttribute("ID");
	// must force filename to lowercase
	this.fileName = (this.id
		? this.id.replace('\\','_').toLowerCase() + ".xml"
		: "unknown.xml");
	this.oRole = null;
	this.portalAdmin=false;
	this.allowHotKeys = false;
	this.allowShortcuts = false;
	this.storage = null;
	this.modified = false;
	this.storageDoc = null;
	this.refresh(true);
}

// ----------------------------------------------------------------------------
UserProfile.prototype.getAttribute = function(id,bPrompt,fPersist)
{
	var retVal = "";
	try {
		bPrompt = (typeof(bPrompt) == "boolean" ? bPrompt : false);
		
		if (!this.attStorage) return retVal;

		var item = this.attStorage.getNodeByAttributeId("ATTR", "name", id);
		if (item)
		{
			var value=item.getAttribute("value");
			if (value || !bPrompt)
				return value;
		}
		else
		{
			// since attribute names are mixed case, we may has missed it, so search
			var attrs=this.attStorage.document.getElementsByTagName("ATTR");
			var len = attrs ? attrs.length : 0;
			for (var i = 0; i < len; i++)
			{
				var nm = attrs[i].getAttribute("name");
				if (nm && nm.toLowerCase() == id.toLowerCase())
				{
					var value=attrs[i].getAttribute("value");
					if (value || !bPrompt)
						return value;
					break;
				}
			}
		}

		// didn't find attribute or had empty value: should we prompt for value?
		if (!bPrompt) return retVal;

		var prompt=this.portalObj.getPhrase("msgPleaseEnterAttributeValue") + " '" + id +"'";
		var title=this.portalObj.getPhrase("LBL_ATTRIBUTE_VALUE");
		var promptVal=this.portalWnd.cmnDlg.prompt("",title,prompt,this.portalWnd);
		if (!promptVal)
			return retVal;

		// persist the value?
		if (typeof(eval("this.portalWnd."+fPersist)) == "function")
		{
			if (!eval("this.portalWnd."+fPersist+"('"+promptVal+"')"))
				return retVal;
		}
		this.setAttribute(id,promptVal);
		return promptVal;

	} catch (e) { }
	return retVal;
}

// ----------------------------------------------------------------------------
// store a temporary (not persisted) user attribute
UserProfile.prototype.setAttribute = function(aName,value)
{
	if (aName == "PSAINKEY")
	{
		this.portalWnd.lawTraceMsg( value
			? "Setting PSAINKEY on the UserProfile object."
			: "Clearing PSAINKEY on the UserProfile object.");
	}

	try {
		if (!this.attStorage) return retVal;

		var item = this.attStorage.getNodeByAttributeId("ATTR", "name", aName);
		if (item)
		{
			// found it, update the value
			item.setAttribute("value",value);
			return;
		}

		// since attribute names are mixed case, we may has missed it, so search
		var attrs=this.attStorage.document.getElementsByTagName("ATTR");
		var len = attrs ? attrs.length : 0;
		for (var i = 0; i < len; i++)
		{
			var nm = attrs[i].getAttribute("name");
			if (nm && nm.toLowerCase() == aName.toLowerCase())
			{
				// found it, update the value
				attrs[i].setAttribute("value",value);
				return;
			}
		}

		// node does not exist, create it
		var attrsNode = this.attStorage.getElementsByTagName("ATTRIBUTES");
		attrsNode = attrsNode[0];
		var newNode = this.attStorage.document.createElement("ATTR");
		newNode.setAttribute("name",aName);
		newNode.setAttribute("value",value);
		attrsNode.appendChild(newNode)
	} catch (e)	{ }
}

// ----------------------------------------------------------------------------
UserProfile.prototype.getModified = function()
{
	return this.modified;
}
UserProfile.prototype.setModified = function(bModified)
{
	if (typeof(bModified) != "boolean")
		bModified=true;
	this.modified = bModified;
	return this.modified;
}

// ----------------------------------------------------------------------------
UserProfile.prototype.getHotKeys = function()
{
	return this.allowHotKeys;
}
UserProfile.prototype.setHotKeys = function(val)
{
	if (typeof(val) == "boolean")
		this.allowHotKeys = val;
	return this.allowHotKeys;
}

// ----------------------------------------------------------------------------
UserProfile.prototype.getId = function()
{
	return this.id;
}

// ----------------------------------------------------------------------------
UserProfile.prototype.getMetrics = function(id)
{
	if (!this.isOpenWindow(id))
		return null;

	var item = this.storage.getNodeByAttributeId("ITEM", "id", id);
	var top = item.getAttribute("top");
	var obj = new Object();

	obj.retValue = (top == "") ? false : true;
	obj.top = top;
	obj.left = item.getAttribute("left");
	obj.height = item.getAttribute("height");
	obj.width = item.getAttribute("width");
	return obj;
}
UserProfile.prototype.setMetrics = function(id, top, left, height, width)
{
	var metrics = this.getMetrics(id);

	if (metrics && (metrics.top != top || metrics.left != left 
	|| metrics.height != height || metrics.width != width))
	{
		var item = this.storage.getNodeByAttributeId("ITEM", "id", id);
		item.setAttribute("top", top);
		item.setAttribute("left", left);
		item.setAttribute("height", height);
		item.setAttribute("width", width);
		this.modified = true;
		return true;
	}
	return false;
}

// ----------------------------------------------------------------------------
UserProfile.prototype.clearNavletState = function()
{
	try {
		var prefs = this.storageDoc.getElementsByTagName("NAVLETSTATE");
		if (prefs.length == 0)
		{
			var root = this.storage.getRootNode();
			prefs = this.storageDoc.createElement("NAVLETSTATE");
			root.appendChild(prefs);
		}
		else
			prefs = prefs[0];

		var len=prefs.childNodes.length;
		for (var i = len-1; i >= 0; i--)
			prefs.removeChild(prefs.childNodes[i]);

	} catch (e) { }
}
UserProfile.prototype.getNavletState = function(id)
{
	var item = this.storage.getNodeByAttributeId("NAVSTATE", "id", id);
	return (item) ? item.getAttribute("value") : "";		// default to closed
}
UserProfile.prototype.setNavletState = function(id, value)
{
	this.modified=true;

	// save current value to local storage
	var item = this.storage.getNodeByAttributeId("NAVSTATE", "id", id);
	if (item)
	{
		item.setAttribute("value", value);
		return;
	}

	// not found, so create it
	var prefs = this.storageDoc.getElementsByTagName("NAVLETSTATE");
	if (prefs.length == 0)
	{
		var root = this.storage.getRootNode();
		prefs = this.storageDoc.createElement("NAVLETSTATE");
		root.appendChild(prefs);
	}
	else
		prefs = prefs[0];

	item = this.storageDoc.createElement("NAVSTATE");
	item.setAttribute("id", id);
	item.setAttribute("value", value);
	prefs.appendChild(item);
}

// ----------------------------------------------------------------------------
UserProfile.prototype.getRecords = function(id)
{
	var item = this.storage.getNodeByAttributeId("ITEM", "id", id);
	return parseInt(item.getAttribute("recstoget"));
}

UserProfile.prototype.getFindOption = function(id)
{
	var item = this.storage.getNodeByAttributeId("ITEM", "id", id);
	if(item)
		findOption = parseInt(item.getAttribute("value"));
	else
		findOption = "";
	return findOption;
}
// ----------------------------------------------------------------------------
UserProfile.prototype.isPortalAdmin = function()
{
	return (this.portalAdmin);
}
UserProfile.prototype.setPortalAdmin = function()
{
	var portalAdmin=this.getAttribute("PortalAdmin","NO");
	this.portalAdmin = (portalAdmin && portalAdmin.toLowerCase() == "yes"
		? true : false);
}

// ----------------------------------------------------------------------------
UserProfile.prototype.getShortcuts = function()
{
	return this.allowShortcuts;
}
UserProfile.prototype.setShortcuts = function(val)
{
	if (typeof(val) == "boolean")
		this.allowShortcuts = val;
	return this.allowShortcuts;
}

// ----------------------------------------------------------------------------
UserProfile.prototype.useFormCache = function()
{
	if (this.oRole == null)
		return false;
	return (this.portalWnd.oPortalConfig.getRoleOptionValue("use_form_cache","0") == "1" 
			? true : false);
}

// ----------------------------------------------------------------------------
UserProfile.prototype.getPreference = function(id)
{
	var item = this.storage.getNodeByAttributeId("ITEM", "id", id);
	return (item) ? item.getAttribute("value") : "";
}
UserProfile.prototype.setPreference = function(id, value)
{
	this.modified=true;

	// save current value to local storage
	var item = this.storage.getNodeByAttributeId("ITEM", "id", id);
	if (item)
	{
		item.setAttribute("value", value);
		return;
	}

	// prefs item not found, so create it
	var prefs = this.storageDoc.getElementsByTagName("PREFERENCES");
	prefs = (!prefs || prefs.length < 1 
		? this.createPrefsNode()
		: prefs[0]);

	item = this.storageDoc.createElement("ITEM");
	item.setAttribute("id", id);
	item.setAttribute("value", value);
	prefs.appendChild(item);
}

// ----------------------------------------------------------------------------
UserProfile.prototype.createPrefsNode = function()
{
	var root = this.storage.getRootNode();
	var prefs = this.storageDoc.createElement("PREFERENCES");
	root.appendChild(prefs);
	return prefs;
}

// ----------------------------------------------------------------------------
// called to verify/create all preference items
UserProfile.prototype.createPrefsNodeItems = function()
{
	var prefs = this.storageDoc.getElementsByTagName("PREFERENCES");
	prefs = prefs[0];

	var cfg=this.portalWnd.oPortalConfig;
	var aryId = new Array("explorer", "select", "attachment", "list");
	var aryRecs = new Array();
	aryRecs[aryRecs.length]=cfg.getUserOptionDefault("explorer","50");
	aryRecs[aryRecs.length]=cfg.getUserOptionDefault("select","25");
	aryRecs[aryRecs.length]=cfg.getUserOptionDefault("attachment","0");
	aryRecs[aryRecs.length]=cfg.getUserOptionDefault("list","25");

	var aryWin = new Array("1", "1", "1", "0");
	var item;
	var len = aryId.length;

	for (var i=0; i < len; i++)
	{
		item = this.storage.getNodeByAttributeId("ITEM", "id", aryId[i]);
		if (item) continue;

		item = this.storageDoc.createElement("ITEM");
		item.setAttribute("id", aryId[i]);
		item.setAttribute("recstoget", aryRecs[i]);
		item.setAttribute("newwin", aryWin[i]);
		item.setAttribute("top", "");
		item.setAttribute("left", "");
		item.setAttribute("height", "");
		item.setAttribute("width", "");
		prefs.appendChild(item);
	}

	aryId = new Array("reportformat", "autoselect", "uselist", "fieldhelp", 
			"autonavlet", "toolbardisplay","leftbarstate","otheroptions");
	var aryVals = new Array();
	aryVals[aryVals.length]=cfg.getUserOptionDefault("reportformat","2");
	aryVals[aryVals.length]=cfg.getUserOptionDefault("autoselect","0");
	aryVals[aryVals.length]=cfg.getUserOptionDefault("uselist","0");
	aryVals[aryVals.length]=cfg.getUserOptionDefault("fieldhelp","0");
	aryVals[aryVals.length]=cfg.getUserOptionDefault("autonavlet","0");
	aryVals[aryVals.length]=cfg.getUserOptionDefault("toolbardisplay","2");
	aryVals[aryVals.length]=cfg.getUserOptionDefault("leftbarstate","0");
	aryVals[aryVals.length]=cfg.getUserOptionDefault("leftbarwidth","0");
	aryVals[aryVals.length]=cfg.getUserOptionDefault("otheroptions","0");	

	len = aryId.length;
	for (var i=0; i<len; i++)
	{
		item = this.storage.getNodeByAttributeId("ITEM", "id", aryId[i]);
		if (item) continue;

		item = this.storageDoc.createElement("ITEM");
		item.setAttribute("id", aryId[i]);
		item.setAttribute("value", aryVals[i]);
		prefs.appendChild(item);
	}
}

// ----------------------------------------------------------------------------
UserProfile.prototype.fixShortcuts = function()
{
	var bChanged = false;
	var links = this.storageDoc.getElementsByTagName("LINKS");
	if (links.length == 0)
		return;
	var link = links[0].getElementsByTagName("LINK");
	var len = link ? link.length : 0;
	for (var i=0; i < len; i++)
	{
		var id = link[i].getAttribute("id");
		if (!id)
		{
			id = this.getUniqueId(this.storage, "LINK", "id", "shortcut");
			link[i].setAttribute("id", id);
			bChanged = true;
		}
	}
	if (bChanged)
		this.setModified(true);
}

//-----------------------------------------------------------------------------
UserProfile.prototype.getUniqueId = function(ds, nodeName, attrName, idName)
{
	var id = "";
	var suffix = "item";
	var bDone = false;
	var i = 1;
	while (!bDone)
	{
		id = idName + suffix + i++;
		var node = ds.getNodeByAttributeId(nodeName, attrName, id);
		if (!node) 
			bDone = true;
	}
	return id;
}

// ----------------------------------------------------------------------------
UserProfile.prototype.hasRequiredAttributes = function(bDispMsg)
{
	if (typeof(bDispMsg) != "boolean")
		bDispMsg=false;

	var missingAttrs="";
	if (!this.id)
		missingAttrs+="ID";

	if (missingAttrs && bDispMsg)
	{
		var msg=this.portalObj.getPhrase("msgErrorLoadUserProfile");
		if (msg=="msgErrorLoadUserProfile")
			// phrases didn't load
			msg="User Profile Object: error during initialization.\n" +
				"The following required attributes are missing:\n";
		else
			msg+="\n"+this.portalObj.getPhrase("msgMissingRequiredAttributes")+"\n"
		msg += missingAttrs;
		this.portalWnd.cmnDlg.messageBox(msg,"ok","stop")
	}
	return (missingAttrs ? false : true);
}

// ----------------------------------------------------------------------------
UserProfile.prototype.initialize = function()
{
	if (this.initialized)
		return true;

	if (!this.storage || !this.storageDoc)
		return false;

	var prefsDoc = this.storage.getRootNode();
	if (!prefsDoc) return false;

	// create new preferences node if it doesn't exist
	var prefs = prefsDoc.getElementsByTagName("PREFERENCES");
	prefs = (!prefs || prefs.length < 1 
		? this.createPrefsNode()
		: prefs[0]);

	// create preferences children if they don't exist
	this.createPrefsNodeItems();

	// preferences added since version 4.0 (will not execute
	// create methods above) should be defaulted here
	var val = this.getPreference("cachelevel");
	if (!val) this.setPreference("cachelevel","0");
	var item = this.storage.getNodeByAttributeId("ITEM", "id", "cachepath");
	if (!item) this.setPreference("cachepath","");

	// shortcuts
	this.allowShortcuts = (this.portalWnd.oPortalConfig.isPortalLessMode()
			? false : this.oRole.getUseShortcuts());
	if (this.allowShortcuts)
		this.fixShortcuts();

	// hot keys
	this.allowHotKeys = this.oRole.getAllowHotkeys();

	// do required values check
	this.setRequiredValues();

	return true;
}

// ----------------------------------------------------------------------------
UserProfile.prototype.isOpenWindow = function(id)
{
	var item = this.storage.getNodeByAttributeId("ITEM", "id", id);
	return (item && item.getAttribute("newwin") == "1") 
		? (this.portalObj.browser.isIE) ? true : false
		: false;
}

// ----------------------------------------------------------------------------
UserProfile.prototype.load = function()
{
	try	{
		var ds = null;
		var user = this.portalObj.profile.getElementsByTagName("PORTAL_USER");
		user = (user && user.length == 1 ? user[0] : null);
		if (!user) return false;

		// load profile data in data storage object
		if (this.portalObj.browser.isIE)
			ds = new this.portalWnd.DataStorage("<?xml version=\"1.0\"?>"+user.xml,this.portalWnd);
		else
			ds = new this.portalWnd.DataStorage(user,this.portalWnd);

		// validate the XML format
		var root=ds.getRootNode();
		if (!root || root.nodeName != "PORTAL_USER")
			return false;

		this.storage = ds;
		this.storageDoc = this.storage.getDocument();
		return true;

	} catch(e) { }
	return false;
}

// ----------------------------------------------------------------------------
UserProfile.prototype.loadAttributes = function()
{
	this.attStorage = null;
	var attrs = this.portalObj.profile.getElementsByTagName("ATTRIBUTES");
	attrs = (attrs && attrs.length > 0 ? attrs[0] : null);
	if (attrs)
	{
		if (this.portalObj.xsltSupport)
			this.attStorage = new this.portalWnd.DataStorage(attrs.xml,this.portalWnd);
		else
			this.attStorage = new this.portalWnd.DataStorage(attrs,this.portalWnd);
	}
}

// ----------------------------------------------------------------------------
UserProfile.prototype.refresh = function(bFromConstruct)
{
	try {
		var msg=this.portalObj.getPhrase("msgErrorLoadUserProfile");
		if (typeof(bFromConstruct) != "boolean")
			bFromConstruct=false;
		this.initialized = false;
		this.oRole = null;

		var role = this.portalObj.profile.getElementsByTagName("ROLE");
		role = (role && role.length > 0 ? role[0] : null);
		if (!role)
		{
			if (msg=="msgErrorLoadUserProfile")
				// phrases didn't load
				msg="User Profile Object: error during initialization.\n" +
					"Invalid XML format for file: Profile.\n";
			else
				msg+="\n"+this.portalObj.getPhrase("msgInvalidXMLFormat")+" Profile."
			var errNode=this.portalObj.profile.getElementsByTagName("ERROR")
			errNode = (errNode && errNode.length > 0 ? errNode[0] : null);
			if (errNode)
			{
				var msgNode=this.portalObj.profile.getElementsByTagName("MSG")
				msgNode = (msgNode && msgNode.length > 0 ? msgNode[0] : null);
				if (msgNode)
					msg+="\n"+msgNode.childNodes[0].nodeValue;
			}
			this.portalWnd.cmnDlg.messageBox(msg,"ok","stop")
			return
		}
		roleId = role.getAttribute("id");

		this.oRole = new this.portalWnd.PortalRole(this.portalWnd, roleId);

		this.allowHotKeys = false;
		this.allowShortcuts = false;
		this.storage = null;
		this.modified = false;
		this.storageDoc = null;

		if (!bFromConstruct)
			this.loadAttributes();
		this.setPortalAdmin();

		if (!this.load())
		{
			// serious problem!
			this.portalWnd.cmnDlg.messageBox(msg,"ok","stop")
			return;
		}
		
		// is portal-less mode? or remove user help? or add portal admin menu item?
		if (this.portalWnd.oPortalConfig.isPortalLessMode())
			this.oRole.setPortalLessMenus();
		else if (this.isPortalAdmin())
			this.oRole.addAdminHelpItem();
		
		// add change password menu item?
		var ssoAuthObj = new this.portalWnd.SSOAuthObject();	// get singleton auth object
		if (ssoAuthObj.canChangePwd())
			this.oRole.addChangePasswordItem();

		this.initialized = this.initialize();
		return;
		
	} catch (e) {
		this.portalWnd.displayExceptionMessage(e,"objects/UserProfile.js","refresh");
	}
}

// ----------------------------------------------------------------------------
UserProfile.prototype.save = function()
{
	try	{
		if (!this.initialized)
			return false;
		if (!this.modified)
			return true;

		// ask file manager to save
		var strXML = this.storage.getDataString(true);
		var oResponse = this.portalWnd.fileMgr.save(this.portalObj.path+"/data/users",
					this.fileName, strXML, "text/xml");
		if (!oResponse || oResponse.status)
			return false;
		if (this.portalWnd.fileMgr.getStatus(oResponse) != "0")
			return false;

		// success
		this.modified=false;
		return true;
	
	} catch (e) { }
	return false;
}

//-----------------------------------------------------------------------------
// function called at end of initialization: once all data has been
// loaded, check the portal configuration for required values
UserProfile.prototype.setRequiredValues=function()
{
	// these required values are 'attributes'
	var aryId = new Array("pdl", "locale", "printer");
	var attId = new Array("productline", "locale", "printername");
	var len = aryId.length;
	var reqVal=null;
	for (var i=0; i < len; i++)
	{
		reqVal = this.getRequiredValue(aryId[i]);
		if (reqVal)
			this.setAttribute(attId[i],reqVal);
	}

	// these required values are 'values'
	aryId = new Array("reportformat", "separator", "autoselect", "uselist", "toolbardisplay","otheroptions");
	len = aryId.length;
	for (var i=0; i < len; i++)
	{
		reqVal = this.getRequiredValue(aryId[i]);
		if (reqVal)
			this.setPreference(aryId[i],reqVal);
	}

	// these required values are 'recstoget'	
	aryId = new Array("explorer", "select", "list");
	len = aryId.length;
	for (var i=0; i < len; i++)
	{
		reqVal = this.getRequiredValue(aryId[i]);
		if (reqVal)
		{
			var itm = this.storage.getNodeByAttributeId("ITEM", "id", aryId[i]);
			if (itm)
				itm.setAttribute("recstoget", reqVal);
		}
	}

}
//-----------------------------------------------------------------------------
// if using role-based settings, but the user profile is being constructed
// go to our on role storage rather than accessing via global config object
UserProfile.prototype.getRequiredValue=function(id)
{
	var obj = (this.portalWnd.oPortalConfig.isRoleBased() && !this.portalWnd.oUserProfile
		? this : this.portalWnd.oPortalConfig);
	return obj.getUserRequiredValue(id);
}
UserProfile.prototype.getUserRequiredValue=function(id)
{
	try {
		var optionNode = this.oRole.storage.getNodeByAttributeId("USEROPTION","id",id);
		if (optionNode)
		{
			var reqval=optionNode.getAttribute("reqval");
			return (reqval ? reqval : null);
		}
		
	} catch (e) { }
	return null;
}
