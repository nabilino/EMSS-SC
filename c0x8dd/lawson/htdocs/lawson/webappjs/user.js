/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/user.js,v 1.41.2.8.2.8 2014/02/18 22:59:43 brentd Exp $ */
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

var authenFileInstance = findAuthen();
var profileHandler = new ProfileHandler();
var usethisIOS = "";

//-----------------------------------------------------------------------------
function findAuthen(searchOpener, ref)
{
	if (!ref)
		ref = self;

	try
	{
		// is there a parent ?
		if (ref != ref.parent)
		{
			// does the parent have an authenFileInstance variable ?
			if (typeof(ref.parent.authenFileInstance) != "undefined")
			{
				// found a copy...
				if (ref.parent.authenFileInstance != null)
					return ref.parent.authenFileInstance;
				else
					return ref.parent;
			}
			else
			{
				// didn't find it... try higher
				return findAuthen(searchOpener, ref.parent);
			}
		}
	}
	catch (e)
	{}

	try
	{
		// is there an opener ?
		if (searchOpener && ref.opener)
		{
			// does the opener have an authenFileInstance variable ?
			if (typeof(ref.opener.authenFileInstance) != "undefined")
			{
				// found a copy...
				if (ref.opener.authenFileInstance != null)
					return ref.opener.authenFileInstance;
				else
					return ref.opener;
			}
			else
			{
				// didn't find it... try higher on the opener
				return findAuthen(searchOpener, ref.opener);
			}
		}
	}
	catch (e)
	{}

	return null;
}
//-----------------------------------------------------------------------------
function inOffice(searchOpener, ref)
{
	if (!ref)
		ref = self;
	try
	{
		// is there a parent ?
		if (ref != ref.parent)
		{
			// is this the Information Office window ?
			if (ref.document.location.href.indexOf("/lawson/office") != -1)
			{
				return true;
			}
			else
			{
				// didn't find it... try higher
				return inOffice(searchOpener, ref.parent);
			}
		}
	}
	catch (e)
	{}

	try
	{
		// is there an opener ?
		if (searchOpener && ref.opener)
		{
			// is this the Information Office window ?
			if (ref.document.location.href.indexOf("/lawson/office") != -1)
			{
				// found a copy...
				return true;
			}	
			else
			{
				// didn't find it... try higher on the opener
				return inOffice(searchOpener, ref.opener);
			}
		}
	}
	catch (e)
	{}

	try
	{
		// is this the Information Office window ?
		if (ref.document.location.href.indexOf("/lawson/office") != -1)
		{
			return true;
		}	
	}
	catch(e)
	{}

	return false;
}

//-----------------------------------------------------------------------------
//-- start ProfileHandler object code
function ProfileHandler()
{
	// only allow 1 instance of this object
	if (ProfileHandler._singleton)
		return ProfileHandler._singleton;
	else
	{
		// try to get objects from 1 instance of this file
		ProfileHandler._singleton = this;
		try {
			if (authenFileInstance && authenFileInstance.ProfileHandler && authenFileInstance.ProfileHandler._singleton)
			{
				// copy over parameters...
				this.browser = authenFileInstance.ProfileHandler._singleton.browser;
				this.portalWnd = authenFileInstance.ProfileHandler._singleton.portalWnd;
				this.profile = authenFileInstance.ProfileHandler._singleton.profile;
				this.authUser = authenFileInstance.ProfileHandler._singleton.authUser;
			}
			else
			{
				this.browser = null;
				this.portalWnd = null;			// gets set if I am running in Portal
				this.profile = null;			// profile XML reference
				this.authUser = null;			// cached authUser object
			}
		} catch(e) {
				this.browser = null;
				this.portalWnd = null;			// gets set if I am running in Portal
				this.profile = null;			// profile XML reference
				this.authUser = null;			// cached authUser object		
		}
	}

	this.tmpParam = null;
	this.commonHTTPAppended = false;
	this.ssoFileAppended = false;
	this.loganenvAppended = false;
	this.loganenvUrl = "/lawson/javascript/loganenv.js";
	this.commonHTTPUrl = "/lawson/webappjs/commonHTTP.js";
	this.ssoFileUrl = "/sso/sso.js";
	this.xauthenUrl = "/cgi-lawson/xauthen.exe?ADMIN=TRUE";
	this.listBookmarksUrl = "/lawson-ios/action/LISTBOOKMARKS?display=SIMPLE&_MAXRECS=10000";
	this.profileUrl_802_803 = "/servlet/Profile?t=" + new Date().getTime();
	this.profileUrl_810 = "/servlet/Profile?_SECTION=attributes";
	this.sysEnvUrl = "/servlet/SysEnv?_OUT=XML";
	this.errorMsg = null;
}
ProfileHandler.prototype._singleton = null;
//-----------------------------------------------------------------------------
ProfileHandler.prototype.createAuthUser = function(param)
{
	// store the param on my object...
	if (param)
		this.tmpParam = param;
	else if (this.tmpParam != null)
		param = this.tmpParam;

	if (!this.isCommonHTTPLoaded())
	{
		this.loadCommonHTTP();
		setTimeout("profileHandler.createAuthUser()", 5);
		return;
	}

	this.browser = new SEABrowser();
	this.portalWnd = this.findPortal(window, true);

	iosFileInstance = findIOS();	
	iosHandler = (iosFileInstance && iosFileInstance.iosHandler) ? iosFileInstance.iosHandler : new IOSHandler();
	iosHandler.setEscapeFunc();

	// what version of IOS do I call?
	if (iosHandler.getIOS() == null && !iosHandler.calledWhat)
	{
		iosHandler.createIOS();
		setTimeout("profileHandler.createAuthUser()", 5);
		return;
	}
	
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
		setTimeout("profileHandler.createAuthUser()", 5);
		return;
	}
	
	usethisIOS = iosHandler.getIOSVersionNumber();
	
	// detect cached authUser object	
	this.findAuthUser();
	try 
	{	
		if (!this.authUser && this.portalWnd && this.portalWnd.lawsonPortal && this.portalWnd.lawsonPortal.profile) 
		{
			// get the Portal's profile object and reset the this.authUser object
			this.profile = this.portalWnd.lawsonPortal.profile;	
			this.authUser = null;
		}
	}
	catch (e) {}

	if (param && this.authUser && iosHandler.getIOS() != null && iosHandler.getIOSVersionNumber() != null) 
	{
		try 
		{
			var getBookmarks = param.toLowerCase().indexOf("officeobjects=true") != -1 && !this.authUser.OfficeObject;
			var getSysEnv = (param.toLowerCase().indexOf("sysenv=true") != -1 || iosHandler.getIOSVersionNumber() >= "10.00.00" || this.authUser.encoding) && !this.authUser.SysEnv;
			if (getBookmarks || getSysEnv)
			{
				// We need to call xauthen or SysEnv to get bookmarks and/or system info; let execution continue.
			} 
			else 
			{							
				// Set old loganenv.js values for backwards compatibility
				this.setLoganenvVars();				
                window.authUser = this.authUser;				
				this.callFuncNm(param);
				return;	
			}
		} 
		catch(e) {}
	}		

	if (iosHandler.getIOSVersionNumber().indexOf("08.00.03") != -1 || iosHandler.getIOSVersionNumber().indexOf("08.00.02") != -1)
	{
		if (!this.isLoganenvLoaded())
		{
			this.loadLoganenv();
			setTimeout("profileHandler.createAuthUser()", 5);
			return;
		}		
		this.createAuthUser_802_803(this.tmpParam);
	}
	else if (iosHandler.getIOSVersionNumber() >= "08.01.00")
	{
		if (!this.isSSOFileLoaded())
		{
			this.loadSSOFile();
			setTimeout("profileHandler.createAuthUser()", 5);
			return;
		}
		this.createAuthUser_810(this.tmpParam);
	}
	else
	{
		if (!this.isLoganenvLoaded())
		{
			this.loadLoganenv();
			setTimeout("profileHandler.createAuthUser()", 5);
			return;
		}	
		oldAuthenticate(this.tmpParam);
	}

	this.tmpParam = null;
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.createAuthUser_802_803 = function(param)
{
	// fill the authUser object
	if (!this.authUser || typeof(this.authUser.prodline) != "string")
	{
		try 
		{
			if (this.portalWnd.lawsonPortal.profile)
				this.profile = this.portalWnd.lawsonPortal.profile;
		}
		catch (e) 
		{
			this.profile = SEARequest(this.profileUrl_802_803, null, null, null, false);
		} 
		
		if (!this.profile || (this.profile.status && this.profile.status >= 400))
		{
			this.authUser = null;
			this.profile = null;
			this.errorMsg = "Invalid output returned from Profile servlet.";
			this.checkForError();
			return;
		}
		
		// Populate the authUser object
		this.authUser = new Object();

		// SET USER ATTRIBUTES...
		this.authUser.encoding = null;
		this.authUser.prodline = this.getUserAttribute("PRODLINE");
		this.authUser.company = this.getUserAttribute("COMPANY");
		this.authUser.employee = this.getUserAttribute("EMPLOYEE");
		this.authUser.approve_cd = this.getUserAttribute("APPROVECD");
		this.authUser.buyer_code = this.getUserAttribute("BUYERCODE");
		this.authUser.cust_group = this.getUserAttribute("CUSTGROUP");
		this.authUser.customer = this.getUserAttribute("CUSTOMER");
		this.authUser.requester = this.getUserAttribute("REQUESTER");
		this.authUser.vendor = this.getUserAttribute("VENDOR");
		this.authUser.vendor_group = this.getUserAttribute("VENDORGROUP");
		this.authUser.activity_list = this.getUserAttribute("ACTIVITYLIST");
		this.authUser.ac_grp_collect = this.getUserAttribute("ACGRPCOLLECT");
		this.authUser.name = this.getUserAttribute("LONGNAME");
		this.authUser.date = this.getUserAttribute("DATE");
		this.authUser.datefmt = this.getUserAttribute("DATEFMTSTR");
		if (this.authUser.datefmt.indexOf("YYYY") == -1)
			this.authUser.datefmt = this.authUser.datefmt.split("YY").join("YYYY");
		this.authUser.curr_symbol = this.getUserAttribute("CURRENCYSYMBOL");
		this.authUser.decimal_sep = this.getUserAttribute("DECIMALSEP");
		this.authUser.comma_sep = this.getUserAttribute("COMMASEP");
		this.authUser.percent_symbol = this.getUserAttribute("PERCENTSYMBOL");
		this.authUser.locale_datefmt = this.getUserAttribute("DATEFMTSTR");
		this.authUser.date_separator = this.getUserAttribute("DATESEP");
		this.authUser.century = this.getUserAttribute("CENTURY");
		this.authUser.language = this.getUserAttribute("LANGUAGE");
		this.authUser.language_dir = "";
		this.authUser.calendar_type = "GREGORIAN";
		this.authUser.time = this.getUserAttribute("TIME");
		this.authUser.webuser = this.getUserAttribute("WEBUSER");
		this.authUser.login = this.getUserAttribute("LOGIN");
		
		window.authUser = this.authUser;	
		cacheAuthUser();	
	}
	
	if (this.checkForError())
		return;	
	
	// create office objects from bookmarks
	if (param && param.toLowerCase().indexOf("officeobjects=true") != -1 && !this.authUser.OfficeObject)
		this.createOfficeObjects();
	
	// create SysEnv properties for OS, LAWDIR, WEBDIR, and PRODLINE variables.
	if (param && param.toLowerCase().indexOf("sysenv=true") != -1 && !this.authUser.SysEnv)
		this.createSysEnv();		
	
	window.authUser = this.authUser;	
	cacheAuthUser();
	this.callFuncNm(param);
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.createAuthUser_810 = function(param)
{
	// fill the authUser object
	if (!this.authUser || typeof(this.authUser.prodline) != "string")
	{
		try 
		{
			if (this.portalWnd.lawsonPortal.profile)
				this.profile = this.portalWnd.lawsonPortal.profile;
		}
		catch (e) 
		{
			this.profile = SSORequest(this.profileUrl_810, null, null, null, false);
		}

		if (!this.profile || (this.profile.status && this.profile.status >= 400))
		{
			this.authUser = null;
			this.profile = null;
			this.errorMsg = "Invalid output returned from Profile servlet.";
			this.checkForError();
			return;
		}

		// Populate the authUser object
		this.authUser = new Object();

		// SET USER ATTRIBUTES...
		this.authUser.encoding = null;
		this.authUser.prodline = this.getUserAttribute("productline");
		this.authUser.company = this.getUserAttribute("company");
		this.authUser.employee = this.getUserAttribute("employee");
		this.authUser.approve_cd = this.getUserAttribute("approvecd");
		this.authUser.buyer_code = this.getUserAttribute("buyercode");
		this.authUser.cust_group = this.getUserAttribute("cust_group");
		this.authUser.customer = this.getUserAttribute("customer");
		this.authUser.requester = this.getUserAttribute("requester");
		this.authUser.vendor = this.getUserAttribute("vendor");
		this.authUser.vendor_group = this.getUserAttribute("vendor_group");
		this.authUser.activity_list = this.getUserAttribute("activitylist");
		this.authUser.ac_grp_collect = this.getUserAttribute("acgrpcollect");
		this.authUser.name = this.getUserAttribute("name");
		this.authUser.date = this.getUserAttribute("date");
		this.authUser.datefmt = this.getUserAttribute("dateformat");
		if (this.authUser.datefmt.indexOf("YYYY") == -1)
			this.authUser.datefmt = this.authUser.datefmt.split("YY").join("YYYY");
		this.authUser.curr_symbol = this.getUserAttribute("currencysymbol");
		this.authUser.decimal_sep = this.getUserAttribute("decimalseparator");
		this.authUser.comma_sep = this.getUserAttribute("commaseparator");
		this.authUser.percent_symbol = this.getUserAttribute("percentsymbol");
		this.authUser.locale_datefmt = this.getUserAttribute("dateformat");
		this.authUser.date_separator = this.getUserAttribute("dateseparator");
		this.authUser.language = this.getUserAttribute("language");
		// TODO - start using language from the user's browser.. ISO standard
		//		this.authUser.language = this.browser.language;
		this.authUser.language_dir = this.getUserAttribute("languagedirection");
		this.authUser.calendar_type = this.getUserAttribute("calendartype");
		this.authUser.time = this.getUserAttribute("time");
		this.authUser.webuser = this.getUserAttribute("id");
		this.authUser.login = this.getUserAttribute("lawsonuserlogin");	
		
		window.authUser = this.authUser;	
		cacheAuthUser();		
	}

	if (this.checkForError())
		return;
	
	// create office objects from bookmarks
	if (param && param.toLowerCase().indexOf("officeobjects=true") != -1 && !this.authUser.OfficeObject)
	{
		if (iosHandler.getIOSVersionNumber() < "09.00.01.08")
			this.createOfficeObjects();
		else
			this.createOfficeObjects_901();	
	}
	
	// create SysEnv properties for OS, LAWDIR, WEBDIR, and PRODLINE variables.
	if (!this.authUser.SysEnv)
		this.createSysEnv();

	// Set old loganenv.js values for backwards compatibility
	this.setLoganenvVars();

	window.authUser = this.authUser;		
	cacheAuthUser();
	this.callFuncNm(param);
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.createOfficeObjects = function()
{
	if (!this.isCommonHTTPLoaded())
	{
		this.loadCommonHTTP();
		setTimeout("profileHandler.createOfficeObjects()", 5);
		return;
	}

	if (!this.authUser)
		this.authUser = new Object();

	this.authUser.OfficeObject = new Array();
	this.authUser.NbrOfOfficeObj = 0;

	// call xauthen.exe for available bookmarks
	var xauthen;
	if (iosHandler.getIOSVersionNumber() < "08.01.00")
		xauthen = SEARequest(this.xauthenUrl);
	else
		xauthen = SSORequest(this.xauthenUrl);
		
	// do this for Mozilla - abort if call failed - could be due to SSO timeout
	if (!xauthen)
	{
		this.callFuncNm = function() {};
		return;
	}

	var pBkmks = xauthen.getElementsByTagName("Bookmarks");
	if (pBkmks.length == 0)
		return;

	for (var i=0; i<pBkmks[0].childNodes.length; i++)
		this.createOfficeObjRecur(pBkmks[0].childNodes[i]);

	this.authUser.NbrOfOfficeObj = this.authUser.OfficeObject.length;
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.createOfficeObjRecur = function(node)
{
	if (node.nodeType != 1 || node.nodeName != "Bookmark")
		return;

	var o = this.authUser.OfficeObject.length++;
	this.authUser.OfficeObject[o] = new Object();
	this.authUser.OfficeObject[o].key = node.getAttribute("key");
	this.authUser.OfficeObject[o].name = node.getAttribute("nm");
	this.authUser.OfficeObject[o].url = node.getAttribute("url");
	this.authUser.OfficeObject[o].lawnm = node.getAttribute("lawnm");
	if (!this.authUser.OfficeObject[o].lawnm) 
		this.authUser.OfficeObject[o].lawnm = "";

	for (var j=0; j<node.childNodes.length; j++)
		this.createOfficeObjRecur(node.childNodes[j]);
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.createOfficeObjects_901 = function()
{
	if (!this.isCommonHTTPLoaded())
	{
		this.loadCommonHTTP();
		setTimeout("profileHandler.createOfficeObjects()", 5);
		return;
	}

	if (!this.authUser)
		this.authUser = new Object();

	this.authUser.OfficeObject = new Array();
	this.authUser.NbrOfOfficeObj = 0;

	// call listbookmarks for available bookmarks
	var bkDom = SSORequest(this.listBookmarksUrl);
		
	// do this for Mozilla - abort if call failed - could be due to SSO timeout
	if (!bkDom)
	{
		this.callFuncNm = function() {};
		return;
	}

	var pBkmks = bkDom.getElementsByTagName("BOOKMARK");
	if (pBkmks.length == 0)
		return;

	var len = pBkmks.length;
	for (var i=0; i<len; i++)
		this.createOfficeObjRecur_901(pBkmks[i]);

	this.authUser.NbrOfOfficeObj = this.authUser.OfficeObject.length;
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.createOfficeObjRecur_901 = function(node)
{
	if (node.nodeType != 1 || node.nodeName != "BOOKMARK")
		return;

	var o = this.authUser.OfficeObject.length++;
	this.authUser.OfficeObject[o] = new Object();
	this.authUser.OfficeObject[o].key = node.getAttribute("key");
	this.authUser.OfficeObject[o].name = node.getAttribute("bookmarkName");
	this.authUser.OfficeObject[o].url = node.getAttribute("bookmarkUrl");
	this.authUser.OfficeObject[o].lawnm = node.getAttribute("lawsonName");
	if (!this.authUser.OfficeObject[o].lawnm) 
		this.authUser.OfficeObject[o].lawnm = "";
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.setSysEnvProps = function()
{
	if (!this.authUser || !this.authUser.SysEnv)
		return;
	if (this.authUser.SysEnv["os.name"] && this.authUser.SysEnv["os.name"].indexOf("Windows") != -1)
		this.authUser.serverSoftware = "Microsoft";
	if (this.authUser.SysEnv["com.lawson.encoding"])
	{
		this.authUser.encoding = this.authUser.SysEnv["com.lawson.encoding"];
		iosHandler.setEncoding(this.authUser.SysEnv["com.lawson.encoding"]);
	}
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.createSysEnv = function()
{
	if (!this.isCommonHTTPLoaded())
	{
		this.loadCommonHTTP();
		setTimeout("profileHandler.createSysEnv()", 5);
		return;
	}

	if (!this.authUser)
		this.authUser = new Object();

	this.authUser.SysEnv = new Array();
	this.authUser.serverSoftware = ""; // for backwards compatibility with old authen object
	this.authUser.encoding = null;

	// call SysEnv for system info
	var sysEnv;
	if (iosHandler.getIOSVersionNumber() < "08.01.00")
		sysEnv = SEARequest(this.sysEnvUrl);
	else
		sysEnv = SSORequest(this.sysEnvUrl);

	// do this for Mozilla - abort if call failed - could be due to SSO timeout
	if (!sysEnv)
	{
		this.callFuncNm = function() {};
		return;
	}

	var pCats = sysEnv.getElementsByTagName("CATEGORY");
	var nbrCats = pCats.length;
	if (nbrCats == 0)
		return;

	var nbrProps;
	var props;
	for (var i=0; i<nbrCats; i++) 
	{
		props = pCats[i].childNodes;
		nbrProps = props.length;
		for (var j=0; j<nbrProps; j++) 
			this.createSysEnvRecur(props[j]);	
	}
	
	this.setSysEnvProps();
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.createSysEnvRecur = function(node)
{
	if (node.nodeType != 1 || node.nodeName != "PROPERTY")
		return;
	
	this.authUser.SysEnv[node.getAttribute("name").toLowerCase()] = node.getAttribute("value");
}	
//-----------------------------------------------------------------------------
ProfileHandler.prototype.findPortal = function(ref, searchOpener)
{
	if (!ref)
		ref = self;
	try
	{
		if (typeof(ref["lawsonPortal"]) != "undefined" && ref["lawsonPortal"] != null)
			return ref;
		else if (ref != ref.parent)
			return this.findPortal(ref.parent, searchOpener);
	}
	catch(e) {}
	try
	{
		if (searchOpener && ref.opener)
		{
			if (typeof(ref.opener["lawsonPortal"]) != "undefined" && ref.opener["lawsonPortal"] != null)
				return ref.opener;
			else
				return this.findPortal(ref.opener, searchOpener);
		}
	}
	catch(e) {}
	return null;
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.callFuncNm = function(param)
{
	if (!param)
		return;

	var funcNmStr = "funcNm=";
	var paramLst = param.split('|');
	for (var i=0; i<paramLst.length; i++)
		if (paramLst[i].indexOf("funcNm=") == 0)
		{
			// eval b/c prmAry[1] is buried in quotes
			setTimeout(eval(paramLst[i].substring(funcNmStr.length)), 1);
			return;
		}
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.getUserAttribute = function(name)
{
	if (!this.isCommonHTTPLoaded())
	{
		this.loadCommonHTTP();
		setTimeout("profileHandler.getUserAttribute()", 5);
		return;
	}

	if (this.portalWnd)
	{
		var val = null;
		try
		{
			return this.portalWnd.lawsonPortal.getUserVariable(name);
		}
		catch (e)
		{
			try
			{
				return this.portalWnd.oUserProfile.getAttribute(name);
			}
			catch (e)
			{}
		}
	}

	if (!this.profile)
		return null;

	var iosver = iosHandler.getIOSVersionNumber();
	if (iosver >= "08.01.00")
	{
		var attrNodes = this.profile.getElementsByTagName("ATTR");
		var nameLower = name.toLowerCase();
		for (var i=0; i<attrNodes.length; i++)
		{
			if (attrNodes[i].getAttribute("name").toLowerCase() == nameLower)
				return attrNodes[i].getAttribute("value");
		}
	}
	else
	{
		var webusers = this.profile.getElementsByTagName("WEBUSER");
		if (webusers.length > 0)
		{
			var nodes = webusers[0].getElementsByTagName(name.toUpperCase());
			if (nodes.length > 0 && nodes[0].childNodes.length > 0)
				return nodes[0].childNodes[0].nodeValue;
		}
	}

	return "";
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.getLoganenv = function(param)
{
	// store the param on my object...
	if (param)
		this.tmpParam = param;
	else if (!this.tmpParam)
		param = this.tmpParam;
		
	iosFileInstance = findIOS();
	iosHandler = (iosFileInstance && iosFileInstance.iosHandler) ? iosFileInstance.iosHandler : new IOSHandler();
	iosHandler.setEscapeFunc();

	// what version of IOS do I call?
	if (iosHandler.getIOS() == null && !iosHandler.calledWhat)		
	{	
		iosHandler.createIOS();
		setTimeout("profileHandler.getLoganenv()", 5);
		return;	
	}

	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
		setTimeout("profileHandler.getLoganenv()", 5);
		return;
	}		
	
	if (iosHandler.getIOSVersionNumber() >= "08.01.00")
	{
		if (!this.isLoganenvLoaded())
		{
			this.loadLoganenv();
			setTimeout("profileHandler.getLoganenv()", 5);
			return;
		}		
	}
	else
	{
		if (!this.authUser || !this.authUser.SysEnv)
			this.createSysEnv();
		this.setLoganenvVars();
	}
	
	if (!this.tmpParam)
		return;

	setTimeout(this.tmpParam, 1);	
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.setLoganenvVars = function()
{
	CGIExt = ".exe";
	if (this.authUser && this.authUser.SysEnv)
	{
		WebDir = this.authUser.SysEnv["webdir"];
		LawsonDir = this.authUser.SysEnv["lawdir"];
		DefaultProductLine = this.authUser.SysEnv["dftprod"];
		DefaultUnixUser = this.authUser.SysEnv["dftuser"];
	}
	else if (iosHandler.getIOS() != null && iosHandler.getIOSVersionNumber() != null && iosHandler.getIOSVersionNumber() >= "08.01.00")
	{
		WebDir = "";	// <-- SPECIFY A DEFAULT VALUE HERE FOR 8.1.0 IOS/Env
		LawsonDir = "";	// <-- SPECIFY A DEFAULT VALUE HERE FOR 8.1.0 IOS/Env
		DefaultProductLine = ""; // <-- SPECIFY A DEFAULT VALUE HERE FOR 8.1.0 IOS/Env
		DefaultUnixUser = ""; // <-- SPECIFY A DEFAULT VALUE HERE FOR 8.1.0 IOS/Env
	}
	else if (!this.isLoganenvLoaded())
	{
		this.loadLoganenv();
		setTimeout("profileHandler.setLoganenvVars()", 5);
		return;	
	}
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.isCommonHTTPLoaded = function()
{
	if (!this.commonHTTPAppended || typeof(SEARequest) != "function")
		return false;
	return true;
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.isSSOFileLoaded = function()
{
	if (typeof(ssoFileInstance) != "undefined")
	{
		this.ssoFileAppended = true;
		var ssoWnd = (ssoFileInstance != null) ? ssoFileInstance : window;
		SSORequest = ssoWnd.SSORequest;	
		SEARequest = ssoWnd.SSORequest;	
		return true;
	}
	return false;
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.loadCommonHTTP = function()
{
	if (!this.commonHTTPAppended)
	{
		var scElm = document.createElement("SCRIPT");
		scElm.src = this.commonHTTPUrl;
		document.body.appendChild(scElm);
		this.commonHTTPAppended = true;
	}
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.loadSSOFile = function()
{
	if (this.ssoFileAppended)
		return;

	if (!this.isSSOFileLoaded())
	{
		var scElm = document.createElement("SCRIPT");
		scElm.src = this.ssoFileUrl;
		document.body.appendChild(scElm);
		this.ssoFileAppended = true;
	}
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.isLoganenvLoaded = function()
{
	if (!this.loganenvAppended || typeof(WebDir) != "string")
		return false;
	return true;
}
//-----------------------------------------------------------------------------
ProfileHandler.prototype.loadLoganenv = function()
{
	if (!this.loganenvAppended)
	{
		var scElm = document.createElement("SCRIPT");
		scElm.src = this.loganenvUrl;
		document.body.appendChild(scElm);
		this.loganenvAppended = true;
	}
}
//------------------------------------------------------------------------------
ProfileHandler.prototype.findAuthUser = function()
{
	if (!this.authUser)
	{
		try	
		{
			if (parent && parent.authUser)
				this.authUser = parent.authUser;
			else if (top && top.authUser)
				this.authUser = top.authUser;
			else if (opener && opener.top && opener.top.authUser)
				this.authUser = opener.top.authUser;		
			// set the cached bookmark array to null if it cannot be referenced, as this will force another call to xauthen.exe
			try 
			{
				if (this.authUser && ((typeof(this.authUser.OfficeObject) == "undefined") || (!this.authUser.OfficeObject.length)))
				{
					this.authUser.OfficeObject = null;
				}
			}
			catch(e) 
			{
				this.authUser.OfficeObject = null;
			}
			try
			{	
				// set the cached SysEnv array to null if it cannot be referenced
				if (this.authUser && ((typeof(this.authUser.SysEnv) == "undefined") || (!this.authUser.SysEnv["os.name"])))
				{
					this.authUser.SysEnv = null;
				}	
				else
				{
					this.setSysEnvProps();		
				}	
			}
			catch (e)
			{
				this.authUser.SysEnv = null;
			}
		}	
		catch (e)
		{
			this.authUser = null;
		}
	}	

	if (this.authUser)
		authUser = this.authUser;
}
//-----------------------------------------------------------------------------
// Override this method in your app to make additional checks. Return true to stop authentication.
ProfileHandler.prototype.checkForError = function()
{
	if (!this.authUser && !this.profile)
	{
		this.errorMsg = "Invalid output returned from Profile servlet";
		return true;
	}
	
	return false;
}
//-- end ProfileHandler object code
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// BELOW IS THE OLD ORIGINAL STUFF FROM AUTHENTICATE.JS
// (with the exception of the new authenticate methods)
//-----------------------------------------------------------------------------

var authenHost = ''
var authenFrameNm = ''
var authenFuncNm  = ''
var authenDesiredEdit = ''
var officeObjects = false
var skinsobjs = false
var CGIExt = ".exe"; // default value for CGI extension

//-----------------------------------------------------------------------------
function authenticate(param)
{	
	if (inOffice(true))
	{
		if (!profileHandler.isCommonHTTPLoaded())
		{
			profileHandler.loadCommonHTTP();
			setTimeout(function(){authenticate(param);}, 5);
			return;
		}
		
		if (iosHandler.getIOS() == null && !iosHandler.calledWhat)		
		{
			iosHandler.createIOS();
			setTimeout(function(){authenticate(param);}, 5);
			return;			
		}
		
		if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
		{
			setTimeout(function(){authenticate(param);}, 5);	
			return;
		}
		oldAuthenticate(param);
	}
	else
		profileHandler.createAuthUser(param);
}

//-----------------------------------------------------------------------------
function oldAuthenticate(param)
{
	var host        = ''
	var frameNm     = ''
	var funcNm      = ''
	var desiredEdit = ''
	var quickEdit   = false
   	var paramLst  = param.split('|')
   	var NbrParams = paramLst.length

   	for (var i=0;i<NbrParams;i++)
   	    if (paramLst[i].indexOf("=") != -1)
   	        eval(paramLst[i])

	if (host != "")
	   	authenHost = host
	else
		authenHost = location.host

	authenFrameNm = frameNm
   	authenFuncNm  = funcNm
   	authenDesiredEdit = desiredEdit

   	if (authenFrameNm == "")
   	    alert("ERROR: In Calling Authenticate Routine.\n\noldAuthenticate() - user.js");
   	else
   	{
   	    if ((top && top.authUser) || (opener && opener.top && opener.top.authUser))
   	    {
   	        quickEdit = true
   	        if (top && top.authUser)
				authUser = top.authUser
           	else if (opener && opener.top && opener.top.authUser)
		       	authUser = opener.top.authUser
			if (typeof(authUser.editDone) == "unknown")
               	doCGIAuthentication(true)
           	else if (desiredEdit == authUser.editDone || desiredEdit == null || desiredEdit == '')
			{
				if (typeof(authUser.FATALError) == "undefined")
	               	finishUp(false)
				else
	               	finishUp(authUser.FATALError)
			}
           	else
           		doCGIAuthentication(true)
       	}
       	else
   			doCGIAuthentication(false)
	}
}

//-----------------------------------------------------------------------------
function authLengthenBar(what,firstText,secondText)
{
	if (typeof(stretchProgressBar) != 'undefined')
		stretchProgressBar(what,firstText,secondText)
}

//-----------------------------------------------------------------------------
function callTAUTHEN(string, frameStr, debugFl)
{
	if (debugFl)
		alert("DEBUG: Calling callTAUTHEN(" + string + "," + frameStr + ")");
	eval("window." + frameStr + ".location.replace(\"" + string + "\")")
}

//-----------------------------------------------------------------------------
function doCGIAuthentication(editTypeOnly)
{
	var urlSep = "&"
	var urlStr = location.protocol + "//" + authenHost + "/cgi-lawson/authen" 
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		urlStr += CGIExt
   	else if (opener != null)
		if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
			urlStr += opener.CGIExt
   	urlStr += "?"

	var parmsStr = "func=returnToAuthen()"
   	if (authenDesiredEdit != '')
   		parmsStr += urlSep + "edit=" + authenDesiredEdit
   	if (editTypeOnly)
   		parmsStr += urlSep + "edittypeonly"
	if (!officeObjects)
		parmsStr += urlSep + "officeobjs=false"
	if (skinsobjs)
		parmsStr += urlSep + "skinsobjs=true"
	urlStr += parmsStr
	callTAUTHEN(urlStr, authenFrameNm, false)
}

//-----------------------------------------------------------------------------
function returnToAuthen(FatalErrorFl)
{
	authUser = eval(authenFrameNm + ".authUser")
	if (skinsobjs)
		skin = eval(authenFrameNm + ".skin")				
   	finishUp(FatalErrorFl)
}

//-----------------------------------------------------------------------------
function finishUp(FatalErrorFl)
{
	var tmpStr = ''
	if (typeof(authUser.FATALError) != 'undefined')
	{
	    if (authenFuncNm != "")
	    {
	    	tmpStr  = authenFuncNm.substring(0,authenFuncNm.lastIndexOf(")"))
	        if (tmpStr.charAt(tmpStr.length-1) != "(")
	        	tmpStr += ","
	        tmpStr += authUser.FATALError + ")"
			eval(tmpStr)
	    }
	    else
		{
	    	startApp(authUser.FATALError)
		}
	}
	else
	{
	    if (authenFuncNm != "")
	    {
	    	tmpStr  = authenFuncNm.substring(0,authenFuncNm.lastIndexOf(")"))
	        if (tmpStr.charAt(tmpStr.length-1) != "(")
	        	tmpStr += ","

			tmpStr += FatalErrorFl + ")"
			eval(tmpStr)
	    }
	    else
	    	startApp(FatalErrorFl)
	}
}

//------------------------------------------------------------------------------
function cacheAuthUser()
{
	// try to cache the authUser object
	try
	{
		// try to store the authUser object in the top window
		top.authUser = authUser;
	}
	catch(e)
	{}
	
	// try to store the authUser object in the parent window
	try
	{
		parent.authUser = authUser;
	}
	catch(e)
	{}	
}

