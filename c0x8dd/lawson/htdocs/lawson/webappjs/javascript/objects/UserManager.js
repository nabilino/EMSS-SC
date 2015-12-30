/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/UserManager.js,v 1.12.2.9.2.2 2014/01/10 14:29:55 brentd Exp $ */
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
//
//	NOTE:
//		this object is intended to be extended
//-----------------------------------------------------------------------------
//
//	DEPENDENCIES:
//		common.js
//		commonHTTP.js
//		/sso/sso.js		(for 9.0 tech only)
//-----------------------------------------------------------------------------
function UserManager(techVersion, httpRequest, bAppVersion, bShowErrors, bSysProps)
{
	this.techVersion = techVersion || UserManager.TECHNOLOGY_900;
	this.httpRequest = httpRequest || null;
	this.profileDom = null;
	this.sysEnvDom = null;
	this.sysEnvProps = null;

	// user attributes
	this.acGrpCollect = null;
	this.activityList = null;
	this.approveCd = null;
	this.appVersion = null;
	this.longAppVersion = null;
	this.buyerCode = null;
	this.calendarType = null;
	this.commaSeparator = ",";
	this.company = null;
	this.currencySymbol = "$";
	this.custGroup = null;
	this.customer = null;
	this.date = null;
	this.dateSeparator = "/";
	this.dateFormat = "MMDDYY";
	this.timeSeparator = ":";
	this.timeFormat = "12 HOUR";
	this.decimalSeparator = ".";
	this.employee = null;
	this.firstname = null;
	this.lastname = null;
	this.email = null;
	this.id = null;		// i.e. webuser
	this.name = null;
	this.defaultLanguage = "enus";
	this.language = this.defaultLanguage;
	this.languageDir = null;
	this.languageDom = null;
	this.login = null;
	this.percentSymbol = "%";
	this.prodline = null;
	this.requester = null;
	this.time = null;
	this.vendor = null;
	this.vendorGroup = null;
	this.wfUser = null;
	this.encoding = null;

	// errors with profile
	this.errorMsg = "";
	this.showErrors = (typeof(bShowErrors) == "boolean") ? bShowErrors : true;

	// set up time
	this.success = this.loadProfile();
	if (typeof(bAppVersion) != "boolean")
		bAppVersion = true;
	if (typeof(bSysProps) != "boolean")
		bSysProps = false;
	if (this.success)
	{
		if (bAppVersion)
			this.setAppVersion();
		if (bSysProps)
			this.loadSysEnvDom();
	}	
}
//-- static methods -----------------------------------------------------------
UserManager.extendTo = function(subClass)
{
	// *** DO NOT CHANGE THIS CODE! ***
	var baseClass = UserManager;
	for (var i in baseClass)
	{
		if (i == "extendTo")
			continue;
		subClass[i] = baseClass[i];
	}
	function inheritance() {}
	inheritance.prototype = baseClass.prototype;
	subClass.prototype = new inheritance();
	subClass.prototype.constructor = subClass;
	subClass.baseConstructor = baseClass;
	subClass.superClass = baseClass.prototype;
}
//-- static variables ---------------------------------------------------------
UserManager.PROFILE_ERROR_803 = "ERRORMSG";
UserManager.PROFILE_URL_803 = "/servlet/Profile";
UserManager.PROFILE_URL_900 = "/servlet/Profile?_SECTION=attributes";
UserManager.SYSENV_URL = "/servlet/SysEnv?_OUT=XML";
UserManager.SYSTEM_CODE = "";			// override this value (i.e. HR, RQ, etc...)
UserManager.TECHNOLOGY_803 = "8.0.3";
UserManager.TECHNOLOGY_900 = "9.0.0";
//-----------------------------------------------------------------------------
UserManager.prototype.isTimedOut = function()
{
	if (this.techVersion == UserManager.TECHNOLOGY_803)
		return false;
	return !(new SSOAuthObject().ping());
}
//-----------------------------------------------------------------------------
UserManager.prototype.getPhrase = function(phraseId)
{
	var phrase = phraseId;
	if (this.languageDom)
	{
		var lawxml = this.languageDom.documentElement;
		var len = lawxml.childNodes.length
		for (var i=0; i<len; i++)
		{
			var node = lawxml.childNodes[i];
			if ("phrase" == node.nodeName && phraseId == node.getAttribute("id"))
				return cmnGetElementText(node);
		}
	}
	return phrase;
}
//-----------------------------------------------------------------------------
UserManager.prototype.loadLanguageDom = function(lang)
{
	// not implemented
}
//-----------------------------------------------------------------------------
UserManager.prototype.loadSysEnvDom = function()
{
	if (!this.httpRequest)
		return false;
	
	this.sysEnvDom = this.httpRequest(UserManager.SYSENV_URL);
	this.parseSysEnv();
}
//-----------------------------------------------------------------------------
UserManager.prototype.loadProfile = function()
{
	// return
	//		false - if errors are found
	//		true  - if everything is OK

	if (!this.httpRequest)
		return false;

	if (this.techVersion == UserManager.TECHNOLOGY_803)
	{
		this.profileDom = this.httpRequest(UserManager.PROFILE_URL_803);
		this.parse803TechProfile();
	}
	else
	{
		this.profileDom = this.httpRequest(UserManager.PROFILE_URL_900);
		if (!this.profileDom)
			return false;
		this.parse900TechProfile();
	}

	var bSuccess = this.checkForSuccess();
	return bSuccess;
}
//-----------------------------------------------------------------------------
UserManager.prototype.parse803TechProfile = function()
{
	// Any errors from this method cannot be translated
	var webuserNodes = this.profileDom.getElementsByTagName("WEBUSER");
	if (webuserNodes.length == 0)
	{
		this.errorMsg = "Invalid Profile output";
		return;
	}

	var webuserNode = webuserNodes[0];
	for (var i=0; i<webuserNodes[0].childNodes.length; i++)
	{
		var node = webuserNodes[0].childNodes[i];
		if (node.nodeType == 1)
		{
			var name = node.nodeName;
			var value = cmnGetElementText(node);
			switch (name)
			{
				case UserManager.PROFILE_ERROR_803:
					this.errorMsg = UserManager.PROFILE_ERROR_803 + cmnGetElementText(node).toUpperCase();
					break;
				case "ACGRPCOLLECT":
					this.acGrpCollect = value;
					break;
				case "ACTIVITYLIST":
					this.activityList = value;
					break;
				case "APPROVECD":
					this.approveCd = value;
					break;
				case "BUYERCODE":
					this.buyerCode = value;
					break;
				case "COMMASEP":
					if (value != "")
						this.commaSeparator = value;
					break;
				case "COMPANY":
					this.company = value;
					break;
				case "CURRENCYSYMBOL":
					if (value != "")
						this.currencySymbol = value;
					break;
				case "CUSTGROUP":
					this.custGroup = value;
					break;
				case "CUSTOMER":
					this.customer = value;
					break;
				case "DATE":
					this.date = value;
					break;
				case "DATEFMTSTR":
					if (value != "")
						this.dateFormat = value;
					break;
				case "TIMESEP":
					if (value != "")
						this.timeSeparator = value;
					break;
				case "TIMEFMT":
					if (value != "")
						this.timeFormat = value;
					break;

				case "DATESEP":
					if (value != "")
						this.dateSeparator = value;
					break;
				case "DECIMALSEP":
					if (value != "")
						this.decimalSeparator = value;
					break;
				case "EMPLOYEE":
					this.employee = value;
					break;
				case "LANGUAGE":
					if (value != "")
						this.language = value;
					this.loadLanguageDom(this.language);
					break;
				case "LOGIN":
					this.login = value;
					break;
				case "LONGNAME":
					this.name = value;
					break;
				case "PERCENTSYMBOL":
					if (value != "")
						this.percentSymbol = value;
					break;
				case "PRODLINE":
					this.prodline = value.toUpperCase();
					break;
				case "REQUESTER":
					this.requester = value;
					break;
				case "TIME":
					this.time = value;
					break;
				case "VENDOR":
					this.vendor = value;
					break;
				case "VENDORGROUP":
					this.vendorGroup = value;
					break;
				case "WEBUSER":
					this.id = value;
					break;
			}
		}
	}
}
//-----------------------------------------------------------------------------
UserManager.prototype.parse900TechProfile = function()
{
	// Any errors from this method cannot be translated
	var attrNodes = this.profileDom.getElementsByTagName("ATTR");
	if (attrNodes.length == 0)
	{
		this.errorMsg = "Invalid Profile output";
		return;
	}

	for (var i=0; i<attrNodes.length; i++)
	{
		var name = attrNodes[i].getAttribute("name").toLowerCase();
		var value = attrNodes[i].getAttribute("value");
		switch (name)
		{
			case "acgrpcollect":
				this.acGrpCollect = value;
				break;
			case "activitylist":
				this.activityList = value;
				break;
			case "approvecd":
				this.approveCd = value;
				break;
			case "buyercode":
				this.buyerCode = value;
				break;
			case "calendartype":
				this.calendarType = value;
				break;				
			case "commaseparator":
				if (value != "")
					this.commaSeparator = value;
				break;
			case "company":
				this.company = value;
				break;
			case "currencysymbol":
				if (value != "")
					this.currencySymbol = value;
				break;
			case "cust_group":
				this.custGroup = value;
				break;
			case "customer":
				this.customer = value;
				break;
			case "date":
				this.date = value;
				break;
			case "dateformat":
				if (value != "")
					this.dateFormat = value;
				break;
			case "dateseparator":
				if (value != "")
					this.dateSeparator = value;
				break;
			case "decimalseparator":
				if (value != "")
					this.decimalSeparator = value;
				break;
			case "employee":
				this.employee = value;
				break;
			case "firstname":
				this.firstname = value;
				break;
			case "lastname":
				this.lastname = value;
				break;				
			case "email":
				this.email = value;
				break;				
			case "id":
				this.id = value;
				break;
			case "language":
				if (value != "")
					this.language = value;
				this.loadLanguageDom(this.language);
				break;
			case "languagedirection":
				this.languageDir = value;
				break;	
			case "lawsonuserlogin":
				this.login = value;
				break;
			case "name":
				this.name = value;
				break;
			case "percentsymbol":
				if (value != "")
					this.percentSymbol = value;
				break;
			case "productline":
				this.prodline = value.toUpperCase();
				break;
			case "requester":
				this.requester = value;
				break;
			case "time":
				this.time = value;
				break;
			case "vendor":
				this.vendor = value;
				break;
			case "vendor_group":
				this.vendorGroup = value;
				break;
			case "wfuser":
				this.wfUser = value;
				break;				
		}
	}
}
//-----------------------------------------------------------------------------
UserManager.prototype.setEncoding = function(encoding)
{
	this.encoding = encoding || null;
}
//-----------------------------------------------------------------------------
UserManager.prototype.parseSysEnv = function()
{
	// Any errors from this method cannot be translated
	var catNodes = this.sysEnvDom.getElementsByTagName("CATEGORY");
	var nbrCats = catNodes.length;
	if (nbrCats == 0)
	{
		this.errorMsg = "Invalid SysEnv output";
		return;
	}

	this.sysEnvProps = new Array();
	for (var i=0; i<nbrCats; i++)
	{
		var props = catNodes[i].getElementsByTagName("PROPERTY");
		var nbrProps = props.length;
		var node;
		for (var j=0; j<nbrProps; j++) 
		{
			node = props[j];
			this.sysEnvProps[node.getAttribute("name")] = node.getAttribute("value");
		}
	}
	this.setEncoding(this.sysEnvProps["com.lawson.encoding"]);
}
//-----------------------------------------------------------------------------
UserManager.prototype.getSysProperty = function(name)
{
	if (!name || !this.sysEnvProps)
		return null;
		
	return this.sysEnvProps[name];	
}
//-----------------------------------------------------------------------------
UserManager.prototype.checkForSuccess = function()
{
	// return
	//		false - if errors are found
	//		true  - if everything is OK

	// maybe populated already if response was invalid
	if (this.errorMsg)
	{
		this.handleError();
		return false;
	}

	// implement your own method to check
	// for required attributes (i.e. prodline)
	// populate this.errorMsg with a message

	return true;
}
//-----------------------------------------------------------------------------
UserManager.prototype.handleError = function()
{
	// override this to show a nice error page with the message
	if (this.showErrors)
		alert(this.errorMsg);
}
//-----------------------------------------------------------------------------
UserManager.prototype.setAppVersion = function()
{
	if (this.appVersion == null)
	{
		if (this.prodline == null)
		{
			this.success = this.loadProfile();
			if (!this.success)
				return;
		}

		var appObj = new AppVersionObject(this.prodline, UserManager.SYSTEM_CODE, false);
		this.appVersion = appObj.getAppVersion();
		this.longAppVersion = appObj.getLongAppVersion();
		if (this.appVersion == null)
		{
			if (appObj.errorMessage)
			{
				// THIS CANNOT BE TRANSLATED!!!
				// show the error from the Data call
				this.errorMsg = "There was an error retrieving the application version.  " + appObj.errorMessage;

				// THIS CANNOT BE TRANSLATED!!!
				// did it say "lawson is not a valid webuser" ?
				// 803 tech... a lot of times RMI needs to be bounced
				if (appObj.errorMessage.indexOf("not a valid webuser") != -1)
					this.errorMsg += "  System Administrator: This sometimes indicates RMI needs to be restarted.";
			}
			else
			{
				// THIS CANNOT BE TRANSLATED!!!
				// this productline doesn't have the right system codes
				this.errorMsg = "The product line " + this.prodline + " is not supported.";
			}
			this.handleError();
		}
	}
}

