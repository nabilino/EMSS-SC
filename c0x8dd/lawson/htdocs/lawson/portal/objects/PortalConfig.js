/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/Attic/PortalConfig.js,v 1.1.2.7.4.13.8.5.2.6 2012/08/08 14:18:15 jomeli Exp $ */
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
// PortalConfig object constructor

function PortalConfig(portalWnd)
{
	this.initialized = false;
	this.portalWnd = portalWnd;

	var path=portalWnd.document.location.pathname;
	var iPos=path.lastIndexOf("/");
	this.path=(iPos != -1 ? path.substr(0,iPos) : "");

	this.portalIsTop=(top == portalWnd ? true : false);
	if (this.portalIsTop)
	{
		// command-line override of top?
		var srch=portalWnd.document.location.search;
		var topVal=portalWnd.getVarFromString("RUNASTOP",srch);
		if (topVal == "0")
		{
			var tkn=portalWnd.getVarFromString("_TKN",srch);
			var isReportPage = srch.indexOf("reports/") != -1 ? true : false
			if (tkn || isReportPage) this.portalIsTop=false;
		}
	}
	this.version="";
	this.iosVersion="";
	this.scriptName="object/PortalConfig.js";
	this.storage = null;
	this.storageDoc = null;
	this.roleBased = false;
	this.arrValues = new Array();
	this.refresh(true);
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.getServiceName=function(id)
{
	try {
		var serviceNode=(this.portalWnd.oBrowser.isIE
			? this.storageDoc.selectSingleNode("//SERVICE[@id='"+id+"']")
			: this.storage.getNodeByAttributeId("SERVICE","id",id));
		if (serviceNode)
		{
			var serviceName=serviceNode.getAttribute("name");
			return (serviceName ? serviceName : null);
		}

	} catch (e) { }
	return null;
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.getServiceNode=function(id)
{
	try {
		var serviceNode=(this.portalWnd.oBrowser.isIE
			? this.storageDoc.selectSingleNode("//SERVICE[@id='"+id+"']")
			: this.storage.getNodeByAttributeId("SERVICE","id",id));
		return (serviceNode ? serviceNode : null);

	} catch (e) { }
	return null;
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.getServiceURL=function(id)
{
	try {
		var serviceNode=(this.portalWnd.oBrowser.isIE
			? this.storageDoc.selectSingleNode("//SERVICE[@id='"+id+"']")
			: this.storage.getNodeByAttributeId("SERVICE","id",id));
		if (serviceNode)
		{
			var serviceURL=serviceNode.getAttribute("url");
			return (serviceURL ? serviceURL : null);
		}

	} catch (e) { }
	return null;
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.getSetting=function(id,defaultVal)
{
	try {
		// caller specifying default return value is optional
		if (typeof(defaultVal) == "undefined")
			defaultVal="";

		var settingNode=(this.portalWnd.oBrowser.isIE
			? this.storageDoc.selectSingleNode("//SETTING[@id='"+id+"']")
			: this.storage.getNodeByAttributeId("SETTING","id",id));
		if (settingNode)
		{
			var settingValue=settingNode.getAttribute("value");
			return (settingValue ? settingValue : defaultVal);
		}

	} catch (e) { }
	return defaultVal;
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.getRoleOption=function(id)
{
	try {
		var storageObj = this.roleBased
			? this.portalWnd.oUserProfile.oRole.storage
			: this.storage;
		var optionNode=(this.portalWnd.oBrowser.isIE
			? storageObj.document.selectSingleNode("//ROLEOPTION[@id='"+id+"']")
			: storageObj.getNodeByAttributeId("ROLEOPTION","id",id));
		return (optionNode ? optionNode : null);

	} catch (e) { }
	return null;
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.getRoleOptionValue=function(id,defaultVal)
{
	try {
		// caller specifying default return value is optional
		if (typeof(defaultVal) == "undefined")
			defaultVal="1";

		var optionNode=this.getRoleOption(id);
		if (optionNode)
		{
			var val=optionNode.getAttribute("value");
			return (val ? val : defaultVal);
		}

	} catch (e) { }
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.getUserOption=function(id)
{
	try {
		var storageObj = this.roleBased
			? this.portalWnd.oUserProfile.oRole.storage
			: this.storage;
		var optionNode=(this.portalWnd.oBrowser.isIE
			? storageObj.document.selectSingleNode("//USEROPTION[@id='"+id+"']")
			: storageObj.getNodeByAttributeId("USEROPTION","id",id));
		return (optionNode ? optionNode : null);

	} catch (e) { }
	return null;
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.getUserOptionDefault=function(id,defaultVal)
{
	try {
		// caller specifying default return value is optional
		if (typeof(defaultVal) == "undefined")
			defaultVal="";

		var optionNode=this.getUserOption(id);
		if (optionNode)
		{
			var defval=optionNode.getAttribute("defval");
			return (defval ? defval : defaultVal);
		}

	} catch (e) { }
	return defaultVal;
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.getUserRequiredValue=function(id)
{
	try {
		var optionNode=this.getUserOption(id);
		if (optionNode)
		{
			var reqval=optionNode.getAttribute("reqval");
			return (reqval ? reqval : null);
		}

	} catch (e) { }
	return null;
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.getPortalVersion=function()
{
	return (this.portalWnd.versionNumber);
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.getIOSVersion=function()
{
	return this.iosVersion;
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.getShortIOSVersion=function()
{
	return this.iosVersion.substr(0,5);
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.setIOSVersion=function()
{
	this.iosVersion="9.0.0";
	try {
		var profile=this.portalWnd.lawsonPortal.profile;
		var profNode=profile.getElementsByTagName("PROFILE");
		profNode = (profNode && profNode.length ? profNode[0] : null);
		if (profNode && profNode.getAttribute("laversion"))
		{
			this.iosVersion=profNode.getAttribute("laversion");
			return;
		}

		var whatAPI="/servlet/What?_JAR=IOS.jar";
		var oResponse=this.portalWnd.httpRequest(whatAPI,null,"","",false);
		if (!oResponse || oResponse.status)
			return;

		var items=oResponse.getElementsByTagName("LAVERSION")
		var verNode = (items && items.length ? items[0] : null);
		if (verNode)
		{
			var verText = this.portalWnd.cmnGetNodeCDataValue(verNode);
			if (verText.indexOf("no such field") == -1)
				this.iosVersion=verText;
			// need to strip version token?
			var idx=verText.indexOf("@(#)@");
			if (idx != -1)
				this.iosVersion=verText.substr(idx+5);
		}
			
	} catch (e) { }
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.setGlobalVars=function()
{
	// nee to 'tweak' global variables?
	return;
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.isPortalLessMode=function()
{
	return (!this.portalIsTop && (this.getSetting("hide_framework")=="1"));
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.isPortalTop=function()
{
	return this.portalIsTop;
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.isRoleBased=function()
{
	return this.roleBased;
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.loadScripts=function()
{
	try {
		var id=this.getServiceName("userprofile");

		// because we can't rely on our install to have all the scripts listed
		// necessary for the Portal when running against the IOSprofile (everything
		// except PSA standalone), we must insure that those required scripts
		// are loaded here.

		var arScriptNames = null;
		var arScriptLoaded = new Array();
		var nbrScripts = 0;

		if (id == "IOSprofile")		
		{
			// IOSprofile required scripts
			arScriptNames = new Array(
					"forms/magic.js",
					"forms/formutil.js",
					"forms/collections.js",
					"objects/FormCache.js",
					"objects/FileManager.js",
					"reports/jobutil.js"
					);

			nbrScripts = arScriptNames.length;
			for (var i = 0; i < nbrScripts; i++)
				arScriptLoaded[i] = 0;
		}

		// now find the SCRIPTS node in the portalconfig.xml
		var scriptsNode=(this.portalWnd.oBrowser.isIE
			? this.storageDoc.selectSingleNode("//SCRIPTS[@id='"+id+"']")
			: this.storage.getNodeByAttributeId("SCRIPTS","id",id));

		// iterate the children (SCRIPT) and load them
		var len=(scriptsNode ? scriptsNode.childNodes.length : 0);
		for (var i = 0; i < len; i++)
		{
			var node=scriptsNode.childNodes[i];
			if (node.nodeName != "SCRIPT")
				continue;
			var src=node.getAttribute("src");
			this.portalWnd.cmnLoadScript("src",src,this.portalWnd);

			// find the script name in our array and flag it as loaded
			if (nbrScripts > 0)
			{
				for (var i = 0; i < nbrScripts; i++)
				{
					if (src == arScriptNames[i])
					{
						arScriptLoaded[i] = 1;
						break;
					}
				}
			}
		}

		// now check if any of the required scripts were not loaded
		if (nbrScripts > 0)
		{
			for (var i = 0; i < nbrScripts; i++)
			{
				if (arScriptLoaded[i] == 0)
					this.portalWnd.cmnLoadScript("src",arScriptNames[i],this.portalWnd);
			}
		}

	} catch (e) {
		this.portalWnd.oError.displayExceptionMessage(e,
				this.scriptName,"loadScripts");
	}
}

//-----------------------------------------------------------------------------
PortalConfig.prototype.loadStorage=function()
{
	try	{
		var oConfig=this.portalWnd.httpRequest(this.path+"/portalconfig.xml",null,"","",false);
		if (this.portalWnd.oError.isErrorResponse(oConfig,true,true,false,"",this.portalWnd))
			return false;

		// load the XML in data storage object
		var ds=new this.portalWnd.DataStorage(
			(this.portalWnd.oBrowser.isIE ? oConfig.xml : oConfig),
			this.portalWnd );

		// validate the XML format
		var root=ds.getRootNode();
		if (!root || root.nodeName != "PORTAL_CONFIG")
			return false;

		this.version=root.getAttribute("version");
		this.storage = ds;
		this.storageDoc = this.storage.getDocument();

		// set initial iosVerson
		var serviceNode=this.getServiceNode("userprofile");
		if (serviceNode && serviceNode.getAttribute("name").toLowerCase() == "iosprofile")
			this.iosVersion = serviceNode.getAttribute("version");

		oConfig=null;
		return true;

	} catch(e) { 
		this.portalWnd.oError.displayExceptionMessage(e,
				this.scriptName,"loadStorage");
	}
	return false;
}
//-----------------------------------------------------------------------------
PortalConfig.prototype.refresh=function(bFromConstruct)
{
	try {
		if (typeof(bFromConstruct) != "boolean")
			bFromConstruct = false;
		this.initialized = false;
		this.storage = null;
		this.storageDoc = null;
		this.roleBased = false;

		// load the config file in storage
		if (!this.loadStorage())
			return false;

		// are we role-based or global?
		this.roleBased = this.getSetting("role_based_options","0") == "1"
				? true : false;

		// setup drill object retrieval values
		var drillValues=this.getSetting("drill_values");
		var vals=drillValues.split("|");
		var len=vals.length;
		for (var i = 0; i < len; i++)
			this.arrValues[i]=vals[i];

		this.initialized = true;
		
	} catch (e) {
		this.portalWnd.oError.displayExceptionMessage(e,
				this.scriptName,"refresh");
	}
}
