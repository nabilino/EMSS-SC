/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/StylerBase.js,v 1.58.2.14.2.19 2014/05/01 20:31:54 brentd Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@10.00.05.00.27 Tue Aug 19 11:23:12 Central Daylight Time 2014 */
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

/*jsl:option explicit*/
//-----------------------------------------------------------------------------
function StylerBase()
{
    if (arguments.length == 1)
    {
        this.setType(arguments[0]);
        return this;
    }

    if (!StylerBase._singleton)
    {
        this.setType(StylerBase.UNKNOWN);
    }
    return StylerBase._singleton;
}

//-- static variables ---------------------------------------------------------
StylerBase._singleton = null;
StylerBase.UNKNOWN = 0;
StylerBase.RSS = 1;
StylerBase.EMSS = 2;
StylerBase.SMR = 3;
StylerBase.TITLE_BAR_CLOSE_ICON = "close";
StylerBase.TITLE_BAR_HOME_ICON = "home";
StylerBase.TITLE_BAR_HELP_ICON = "help";
StylerBase.TITLE_BAR_LOGOFF_ICON = "logoff";
StylerBase.TITLE_BAR_SETTINGS_ICON = "settings";
StylerBase.TITLE_BAR_DROPDOWN_ICON = "dropdown";
StylerBase.COMMAND_BAR_NEXT_ICON = "next";
StylerBase.COMMAND_BAR_PREV_ICON = "previous";
StylerBase.COMMAND_BAR_BACK_ICON = "back";
StylerBase.COMMAND_BAR_REVIEW_ICON = "review";
StylerBase.ENCODING_WIN_1256 = "Windows-1256";
StylerBase.CALENDAR_TYPE_GREGORIAN = "Gregorian";
StylerBase.CALENDAR_TYPE_HIJRI = "Hijri";
StylerBase.DEFAULT_DATE_FORMAT = "MMDDYY";
StylerBase.DEFAULT_DATE_SEP = "/";

// styledAs attribute values
StylerBase.ElementTypeUnknown = 0;
StylerBase.ElementTypeHidden = 1;           // <???? styler='hidden'>
                                            // eliminated classic elements
StylerBase.ElementTypeInputSelect = 2;      // <input type='text' styler='select'>
StylerBase.ElementTypeInputCalendar = 3;    // <input type='text' styler='calendar'>
StylerBase.ElementTypeInputSearch = 4;      // <input type='text' styler='search'>
StylerBase.ElementTypeInputText = 5;        // <input type='text' styler>
                                            // <input type='password' styler>
StylerBase.ElementTypeInputRadio = 6;       // <input type='radio' styler>
StylerBase.ElementTypeInputCheckbox = 7;    // <input type='checkbox' styler>
StylerBase.ElementTypeInputUnknown = -1;    // <input type='????' styler>
StylerBase.ElementTypeButton = 8;           // <button styler>
StylerBase.ElementTypeDivGroupBox = 9;      // <div styler='groupbox'>
StylerBase.ElementTypeDivTabControl = 10;   // <div styler='tabcontrol'>
StylerBase.ElementTypeDivHeader = 11;       // <div styler='header'>
StylerBase.ElementTypeDivGroupLine = 12;    // <div styler='groupline'>
StylerBase.ElementTypeDivExpander = 13;     // <div styler='expander'>
StylerBase.ElementTypeDivUnknown = -2;      // <div styler='????'>
StylerBase.ElementTypeComboBox = 14;        // <select styler>
StylerBase.ElementTypeAsterisk = 15;        // <span styler='asterisk'>
StylerBase.ElementTypeSpanUnknown = -3;     // <span styler='????'>
StylerBase.ElementTypeList = 16;            // <table styler='list'>
StylerBase.ElementTypeTableUnknown = -4;    // <table styler='????'>
StylerBase.ElementTypeHelpIcon = 17;        // <img styler='help'>
StylerBase.ElementTypeDrillIcon = 18;       // <img styler='drill'>
StylerBase.ElementTypeImgUnknown = -5;      // <img styler='????'>
StylerBase.ElementTypeTextArea = 19;        // <textarea styler>
StylerBase.ElementTypeSettingsIcon = 20;    // <img styler='settings'>
StylerBase.ElementTypeHyperlink = 21;		// <a styler='hyperlink'>
StylerBase.ElementTypeButtonIcon = 22;		// <button> with icon background
StylerBase.ElementTypeDataGrid = 23;		// <table styler='datagrid'>
StylerBase.ElementTypeAppNav = 24;			// <table styler='appNav'>

StylerBase.TYPE = StylerBase.UNKNOWN;

var scriptElements = (window.document.scripts) ?
                      window.document.scripts :
                      window.document.getElementsByTagName("script");

for (var i=scriptElements.length-1; i>=0; i--)
{
    var searchFor = "StylerBase.js?";
    var foundIndex = scriptElements[i].src.indexOf(searchFor);
    if (foundIndex != -1)
    {
        foundIndex += searchFor.length;
        var foundParameter = scriptElements[i].src.substring(foundIndex).toLowerCase();
        switch (foundParameter)
        {
            case "emss":
                StylerBase.TYPE = StylerBase.EMSS;
                break;

            case "rss":
                StylerBase.TYPE = StylerBase.RSS;
                break;

            case "smr":
                StylerBase.TYPE = StylerBase.SMR;
                break;

            default:
                StylerBase.TYPE = StylerBase.UNKNOWN;
                break;
        }
        break;
    }
}
StylerBase.baseNamespace = "webappjs";
if (StylerBase.TYPE == StylerBase.RSS)
{
    if ((window.location.pathname.substring(0, 4) == "/rss") || (window.location.pathname.substring(0, 4) == "/rqc")) // EP
    {
		var contextRoot = new Array();
		contextRoot = window.location.pathname.split('/');	
        StylerBase.baseNamespace = contextRoot[1] + ".webappjs";
    }
	else
	{
	    if (window.location.pathname.substring(0, 14) == "/lawson/pcards")
		{
			StylerBase.baseNamespace = "lawson.pcards.webappjs";
		}
	}	
}
if (StylerBase.TYPE == StylerBase.EMSS)
{
    StylerBase.baseNamespace = "lawson.webappjs";
}
if (StylerBase.TYPE == StylerBase.SMR)
{
    if (window.location.pathname.lastIndexOf("/") >= 0)
    {
        var firstIndex = (window.location.pathname.charAt(0) == "/") ? 1 : 0;
        StylerBase.baseNamespace =
            window.location.pathname.substring(
                firstIndex, window.location.pathname.lastIndexOf("/")) +
            "/" + StylerBase.baseNamespace;
    }
}

StylerBase.webappjsURL = window.location.protocol + "//" +
    window.location.host + "/" + StylerBase.baseNamespace.replace(/\./g, "/");

//-- static methods -----------------------------------------------------------
StylerBase.extendTo = function(subClass)
{
    // *** DO NOT CHANGE THIS CODE! ***
    var baseClass = StylerBase;
    for (var i in baseClass)
    {
        if (i == "extendTo")
        {
            continue;
        }
        subClass[i] = baseClass[i];
    }
    function inheritance() {};
    inheritance.prototype = baseClass.prototype;
    subClass.prototype = new inheritance();
    subClass.prototype.constructor = subClass;
    subClass.baseConstructor = baseClass;
    subClass.superClass = baseClass.prototype;
    subClass.baseMethod = baseClass.prototype;
    subClass.baseStaticMethod = baseClass;
};

//-- instance methods ---------------------------------------------------------
//-----------------------------------------------------------------------------
StylerBase.prototype.setType = function(value)
{
    this.setReplaceCss(false);
    this.setShowLDS(false);
    this.setShowInfor(false);
    this.setShowInfor3(false);
    this.setMoreInfo(false);
    this.setTextDir(null);
    this.setEncoding(null);
    this.setCalendarType(StylerBase.CALENDAR_TYPE_GREGORIAN);
    this.setDateFormat(StylerBase.DEFAULT_DATE_FORMAT);
    this.setDateSep(StylerBase.DEFAULT_DATE_SEP);
    this.setLanguage(null);
    this.setTranslationFunc(null);
    this.type = value;
    this.webappjsURL = StylerBase.webappjsURL;
    if ((!StylerBase._singleton) &&
        (value == StylerBase.UNKNOWN))
    {
        StylerBase._singleton = this;
        if (StylerBase.TYPE == StylerBase.RSS)
        {
            alert("'new StylerRSS()' should be used with " +
                  "StylerBase.js?rss included before StylerRSS.js");
        }
        if (StylerBase.TYPE == StylerBase.EMSS)
        {
            alert("'new StylerEMSS()' should be used with " +
                  "StylerBase.js?emss included before StylerEMSS.js");
        }
        if (StylerBase.TYPE == StylerBase.SMR)
        {
            alert("'new StylerSMR()' should be used with " +
                  "StylerBase.js?smr included before StylerSMR.js");
        }
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.setMoreInfo = function(value)
{
    this.moreInfo = value;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.setReplaceCss = function()
{
    if (arguments.length >= 1)
    {
        this.replaceCss = arguments[0];
    }
    else
    {
        this.replaceCss = false;
    }
    if (arguments.length == 3)
    {
        this.replaceCssFrom = arguments[1];
        this.replaceCssTo = arguments[2];
    }
    else
    {
        this.replaceCss = false;
    }
};

//-----------------------------------------------------------------------------
// Used first by any configuration file setting
StylerBase.prototype.setTextDir = function(sValue)
{
    this.textDir = sValue;
};

StylerBase.prototype.getTextDir = function()
{
    return this.textDir;
};

//-----------------------------------------------------------------------------
//Used first by any configuration file setting
StylerBase.prototype.setEncoding = function(sValue)
{
	this.encoding = sValue;
};

StylerBase.prototype.getEncoding = function()
{
	return this.encoding;
};

//-----------------------------------------------------------------------------
//Used first by any configuration file setting
StylerBase.prototype.setCalendarType = function(sValue)
{
	if (sValue && sValue.toString().toLowerCase() == StylerBase.CALENDAR_TYPE_HIJRI.toLowerCase())
		this.calType = StylerBase.CALENDAR_TYPE_HIJRI;
	else
		this.calType = StylerBase.CALENDAR_TYPE_GREGORIAN;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.getCalendarType = function()
{
	return this.calType;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.setDateFormat = function(sValue)
{
	this.dateFormat = sValue;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.getDateFormat = function()
{
	return this.dateFormat;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.setDateSep = function(sValue)
{
	this.dateSep = sValue;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.getDateSep = function()
{
	return this.dateSep;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.setLanguage = function(sValue)
{
	this.language = sValue;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.getLanguage = function()
{
	return this.language;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.setTranslationFunc = function(oValue)
{
	this.translationFunc = oValue;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.getTranslationFunc = function()
{
	return this.translationFunc;
};

//-----------------------------------------------------------------------------
// Used first by any configuration file setting
StylerBase.prototype.setShowLDS = function(bValue)
{
    this.showLDS = bValue;
};

//-----------------------------------------------------------------------------
// Used first by any configuration file setting
StylerBase.prototype.setShowInfor = function(bValue)
{
    this.showInfor = bValue;
};

//-----------------------------------------------------------------------------
//Used first by any configuration file setting
StylerBase.prototype.setShowInfor3 = function(bValue)
{
	this.showInfor3 = bValue;
};

//-----------------------------------------------------------------------------
// Used second for any overrides from URL parameters
StylerBase.prototype.setByURL = function(wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

    var searchStringLowerCase = wnd.location.search.toLowerCase();

    if (searchStringLowerCase.indexOf("info=1") != -1)
    {
        this.setMoreInfo(true);
    }
    else if (searchStringLowerCase.indexOf("info=0") != -1)
    {
        this.setMoreInfo(false);
    }

    if (searchStringLowerCase.indexOf("replace") != -1)
    {
        this.setReplaceCss(true, getVarFromString("replacefrom", searchStringLowerCase), getVarFromString("replaceto", searchStringLowerCase));
    }

    // override any configuration setting with URL parameter  
    if (searchStringLowerCase.indexOf("theme=10.3") != -1 ||
    	searchStringLowerCase.indexOf("theme=infor3") != -1)
    {
    	this.setShowInfor3(true);
    	this.setShowLDS(false);
    	this.setShowInfor(false);
    }    
    else if (searchStringLowerCase.indexOf("theme=10") != -1 ||
        searchStringLowerCase.indexOf("theme=infor") != -1)
    {
    	this.setShowInfor(true);
        this.setShowLDS(false);
        this.setShowInfor3(false);
    }	   
    else if (searchStringLowerCase.indexOf("theme=9") != -1 ||
        searchStringLowerCase.indexOf("theme=lds") != -1)
    {
        this.setShowLDS(true);
        this.setShowInfor3(false);
        this.setShowInfor(false);
    }	
	else
	{
		this.setShowLDS(false);
		this.setShowInfor(false);
		this.setShowInfor3(false);
	}

    if (searchStringLowerCase.indexOf("dir=rtl") != -1 && (this.showInfor || this.showInfor3))
    {
    	this.setTextDir("rtl");
    }

    if (this.moreInfo)
    {
        var confirmPrompt = "Show " + ((this.showLDS) ? "LDS-9" : ((this.showInfor3) ? "Infor-10.3" : ((this.showInfor) ? "Infor-10" : "Classic-8")));
        if (!confirm(confirmPrompt))
        {
        	if (this.showLDS)
            	this.setShowLDS(!this.showLDS);
            else if (this.showInfor)
            	this.setShowInfor(!this.showInfor);	
            else if (this.showInfor3)
            	this.setShowInfor3(!this.showInfor3);        	
        }
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.createJsElement = function(wnd, fileName)
{
	if (!wnd)
	{
		wnd = window;
	}
    var fileElement = wnd.document.createElement("script");
    fileElement.setAttribute("type", "text/javascript");
    if (fileName)
    	fileElement.setAttribute("src", fileName);
    return fileElement;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.loadJs = function(wnd, id, source)
{
	if (!wnd)
	{
		wnd = window;
	}
	if (!source)
	{
		return;
	}	
	var jsElm = null;
	try
	{	
	 	jsElm = this.createJsElement(wnd);
	 	if (id)
	 		jsElm.setAttribute("id", String(id));	
		jsElm.text = source;
		var headElms = wnd.document.getElementsByTagName("head");
		if (headElms.length > 0)
			headElms[0].appendChild(jsElm);
	}
	catch(e) {}
	return jsElm;	
};

//-----------------------------------------------------------------------------
StylerBase.prototype.loadJsFile = function(wnd, id, fileUrl)
{
    if (this.httpRequest && fileUrl)
    {
    	var scriptNode = null;
    	if (id)
    	{
			var scriptNodes = this.getLikeElements(wnd, "script", "type", "text/javascript");
			for (var i=0; i<scriptNodes.length; i++)
		    {
		    	var idValue = scriptNodes[i].getAttribute("id");
		    	if (idValue != null && idValue == id)
		    	{
		    		scriptNode = scriptNodes[i];
		    		break;
		    	}
		    }
		}		    
		if (!scriptNode)
		{
			jsText = this.httpRequest(fileUrl, null, "text/javascript", "text/plain", false);
			return this.loadJs(wnd, id, jsText);
		}	
    }
    return null;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.loadEncodingLibraries = function(wnd, encoding)
{
	encoding = encoding || "";
	if (encoding.toLowerCase() == StylerBase.ENCODING_WIN_1256.toLowerCase())
	{
		this.loadJsFile(wnd, "win1256CharsetMap", StylerBase.webappjsURL + "/javascript/win1256CharsetMap.js");
	}
};

//-----------------------------------------------------------------------------
StylerBase.prototype.loadCalendarLibraries = function(wnd, type)
{
	type = type || StylerBase.CALENDAR_TYPE_GREGORIAN;
	if (type.toLowerCase() == StylerBase.CALENDAR_TYPE_HIJRI.toLowerCase())
	{
		try
		{
			//inforControlsCombined.min.js includes the Globalize library, which requires jquery
			if (this.showInfor3)
				this.loadHTMLControlLibraries(wnd);
			else	
				this.loadJsFile(wnd, "globalize.min", StylerBase.webappjsURL + "/javascript/globalize.min.js");
			if (this.getTextDir() != "rtl")
				wnd.Globalize.culture("ar-SA").isRTL = false;
			wnd.Globalize.culture("ar-SA");
			wnd.Globalize.culture().calendar = wnd.Globalize.culture().calendars.standard;		
		}
		catch(e) {}
	}
};

//-----------------------------------------------------------------------------
StylerBase.prototype.translateCulture = function(wnd, translationFunc, culture)
{
	//override this in your subclass
};

//-----------------------------------------------------------------------------
StylerBase.prototype.assertHTMLControlLibraries = function(wnd)
{
	wnd = wnd || window;
	if (typeof(wnd["$"]) == "undefined")	
		this.loadHTMLControlLibraries(wnd);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.loadHTMLControlLibraries = function(wnd)
{
	var libUrls = new Array();
	if (this.showInfor3)
	{
		libUrls[libUrls.length] = {id:"jquery-1.10.2.min", url:StylerBase.webappjsURL + "/javascript/jquery/jquery-1.10.2.min.js"};
		libUrls[libUrls.length] = {id:"jquery-ui-1.10.2.custom.min", url:StylerBase.webappjsURL + "/javascript/jquery/jquery-ui-1.10.2.custom.min.js"};
		libUrls[libUrls.length] = {id:"inforControlsCombined.min", url:StylerBase.webappjsURL + "/infor3/javascript/inforControlsCombined.min.js"};		
	}
	
	for (var i=0; i<libUrls.length; i++)
	{	
		var libObj = libUrls[i];
		this.lib = this.loadJsFile(wnd, libObj.id, libObj.url);
	}	
};

//-----------------------------------------------------------------------------
StylerBase.prototype.loadLibrary = function(wnd, httpRequest, encoding, calType, dateFmt, dateSep, language, translationFunc)
{
	if (!wnd)
	{
		wnd = window;
	}

	this.httpRequest = httpRequest || null;
	if (!this.httpRequest && typeof(wnd["SSORequest"]) != "undefined")
		this.httpRequest = wnd.SSORequest;

	var libUrls = new Array();
	if (this.showInfor3)
	{
		this.loadHTMLControlLibraries(wnd);
		libUrls[libUrls.length] = {id:"inforStylerBase", url:StylerBase.webappjsURL + "/infor3/javascript/inforStylerBase.js"};
	}	
	else if (this.showInfor)
	{
		libUrls[libUrls.length] = {id:"inforStylerBase", url:StylerBase.webappjsURL + "/infor/javascript/inforStylerBase.js"};
	}
	else if (this.showLDS)
	{
		libUrls[libUrls.length] = {id:"ldsStylerBase", url:StylerBase.webappjsURL + "/lds/javascript/ldsStylerBase.js"};	
	}
	
	for (var i=0; i<libUrls.length; i++)
	{	
		var libObj = libUrls[i];
		this.lib = this.loadJsFile(wnd, libObj.id, libObj.url);
	}	
	if (encoding)
	{
		this.setEncoding(encoding);
		this.loadEncodingLibraries(wnd, encoding);  	
	}
	if (calType)
	{
		this.setCalendarType(calType);
		this.loadCalendarLibraries(wnd, calType);
	}
	if (dateFmt)
	{			
		this.setDateFormat(dateFmt);	
	}	
	if (dateSep)
	{			
		this.setDateSep(dateSep);	
	}
	if (language)
	{
		this.setLanguage(language);
		this.setTranslationFunc(translationFunc || null);
		if (typeof(wnd["Globalize"]) != "undefined")
		{
			this.translateCulture(wnd, translationFunc, wnd.Globalize.culture());
		}
	}	
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addSkipLink = function(wnd, skipLinkText, skipToID)
{
	//backwards compatibility - replaced by init508()
	this.init508(wnd, skipLinkText, skipToID);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.init508 = function(wnd, skipLinkText, skipToID)
{
	//overridden by themes that support 508
};

//-----------------------------------------------------------------------------
StylerBase.prototype.selectStyleSheet = function(wnd, id)
{
    if (!wnd)
    {
        wnd = window;
    }
		
	if (this.getTextDir() == "rtl") 
	{
		var htmlObjs = this.getLikeElements(wnd, "html");
		for (var i=0; i<htmlObjs.length; i++) 
		{
		    htmlObjs[i].setAttribute("dir", this.getTextDir());
		}
		if (typeof(wnd["Globalize"]) != "undefined")
		{	
			wnd.Globalize.culture().isRTL = true;
		}	
	}

    var selectedLinkElement = null;
    var links = this.getLikeElements(wnd, "link", "rel", "alternate stylesheet");
    for (var i=0; i<links.length; i++)
    {
        links[i].disabled = true;
        if (this.showInfor3 && links[i].id == id + "Infor3")
        {
            links[i].disabled = false;
            selectedLinkElement = links[i];
        }
        else if (this.showInfor && links[i].id == id + "Infor")
        {
            links[i].disabled = false;
            selectedLinkElement = links[i];
        }
        else if (this.showLDS && links[i].id == id + "LDS")
        {
            links[i].disabled = false;
            selectedLinkElement = links[i];
        }        
        else if (!this.showLDS && !this.showInfor && !this.showInfor3 && links[i].id == id)
        {
            links[i].disabled = false;
            selectedLinkElement = links[i];
        }
    }
    this.replaceCssFile(wnd);
    if (this.showLDS || this.showInfor || this.showInfor3)
    {
    	if (typeof(this.modifyDOM) == "undefined")
    	{
    		this.loadLibrary(wnd);
    	}
    	if (this.showInfor3)
    	{
    		this.assertHTMLControlLibraries(wnd);
    	}	
        this.modifyDOM(wnd);
    }
    return selectedLinkElement;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.loadCssFile = function(wnd, fileName)
{
	var cssElm = null;
	try
	{
		cssElm = this.createCssElement(wnd, fileName);
		var headElms = wnd.document.getElementsByTagName("head");
		if (headElms.length > 0)	
			headElms[0].appendChild(cssElm);
	}
	catch(e) {}
    return cssElm;
};

StylerBase.prototype.loadEnableCssFile = function(wnd, fileName)
{
    var links = this.getLikeElements(wnd, "link", "type", "text/css");
    var cssLink = null;
    for (var i=0; i<links.length; i++)
    {
    	var relValue = links[i].getAttribute("rel");
    	var hrefValue = links[i].getAttribute("href");
    	if (((relValue == "stylesheet") || (relValue == "alternate stylesheet"))
    		&& (hrefValue == fileName))
    	{
    		cssLink = links[i];
    		links[i].disabled = false;
    		break;
    	}
    }
    if (!cssLink)
    {
    	cssLink = this.loadCssFile(wnd, fileName);
    }
	return cssLink;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.createCssElement = function(wnd, fileName)
{
    var fileElement = wnd.document.createElement("link");
    fileElement.setAttribute("rel", "stylesheet");
    fileElement.setAttribute("type", "text/css");
    fileElement.setAttribute("href", fileName);
    return fileElement;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.replaceCssFile = function(wnd)
{
    if (this.replaceCss)
    {
        this.replaceCssFileWith(wnd, this.replaceCssFrom, this.replaceCssTo);
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.replaceCssFileWith = function(wnd, replaceFile, withFile)
{
    this.removeCssFile(wnd, replaceFile, withFile);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.removeCssFile = function(wnd, fileName)
{
    var replaceWith = "";
    if (arguments.length == 3)
    {
        replaceWith = arguments[2];
    }
    var links = this.getLikeElements(wnd, "link", "type", "text/css");
    for (var i=0; i<links.length; i++)
    {
        var relValue = links[i].getAttribute("rel");
        var hrefValue = links[i].getAttribute("href");
        if ((relValue == "stylesheet") ||
            (relValue == "alternate stylesheet"))
        {
            if ((hrefValue.indexOf(fileName) != -1) &&
                (!links[i].disabled))
            {
                if (replaceWith != "")
                {
                	if (replaceWith != hrefValue)
                	{
	                    links[i].
	                        parentNode.
	                        replaceChild(this.createCssElement(wnd, replaceWith),
	                                     links[i]);
                	}
                }
                else
                {
                    links[i].parentNode.removeChild(links[i]);
                }
            }
        }
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.listCssFiles = function(wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

    var links = this.getLikeElements(wnd, "link", "type", "text/css");
    var result = "CSS Links ("+links.length+")\n\n";
    for (var i=0; i<links.length; i++)
    {
        var relValue = links[i].getAttribute("rel");
        var hrefValue = links[i].getAttribute("href");
        var disabledValue = links[i].getAttribute("disabled");
        if ((relValue == "stylesheet") ||
            ((relValue == "alternate stylesheet") &&
             (!links[i].getAttribute("disabled"))))
        {
            result += links[i].outerHTML + "\n";
        }
    }
    return result;
};

//-----------------------------------------------------------------------------
StylerBase.getPreviousSibling = function(node)
{
    var tNode = node.previousSibling;

    while (tNode != null && tNode.nodeType != 1)
    {
        tNode = tNode.previousSibling;
    }

    return tNode;
};

//-----------------------------------------------------------------------------
StylerBase.getNextSibling = function(node)
{
    var tNode = node.nextSibling;

    while (tNode != null && tNode.nodeType != 1)
    {
        tNode = tNode.nextSibling;
    }

    return tNode;
};

//-----------------------------------------------------------------------------
StylerBase.getElementDocument = function(node)
{
    var tDoc = null;

    if (node && node.ownerDocument)
    {
        return node.ownerDocument;
    }
    else if (node && node.document)
    {
        return node.document;
    }
    else
    {
        return document;
    }
};

//-----------------------------------------------------------------------------
StylerBase.focusElement = function(theElement)
{
	try { theElement.focus(); } catch(e) {}
}

//-----------------------------------------------------------------------------
StylerBase.performFunctionCallback = function(wnd, functionPath, functionParams)
{
    if (!wnd)
    {
        wnd = window;
    }

    if (functionPath != null)
    {
        var refPath = functionPath.split(".");
        var wndRef = wnd;
        var funcCalled = false;
        var funcObj = wnd;

        for (var i=0; i<refPath.length; i++)
        {
            try
            {
            	funcObj = funcObj[refPath[i]];
            }
            catch(e)
            {
                break;
            }
        }

        if (typeof(funcObj) == "function")
        {
            funcObj.apply(this, functionParams);
            funcCalled = true;
        }        

		// if we did not find the function in the wnd window, try the parent windows
        try
        {
	        while (!funcCalled && wndRef != wndRef.parent)
	        {
	        	wndRef = wndRef.parent;
	        	var funcObj = wndRef;
	
	        	for (var i=0; i<refPath.length; i++)
	        	{
	        	    try
	        	    {
	        	    	funcObj = funcObj[refPath[i]];
	        	    }
	        	    catch(e)
	        	    {
	        	        break;
	        	    }
	        	}
	
	        	if (typeof(funcObj) == "function")
	        	{
	        	    funcObj.apply(this, functionParams);
	        	    funcCalled = true;
	        	}
	        }
        }
        catch(e) {}
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.setAttribute = function(element, name, value)
{
    if (this.moreInfo)
    {
        var oldValue = element.getAttribute(name);
        if (oldValue != "")
        {
            alert("Overriding attribute value\n\nid: " +
                  element.id +
                  "\ntagName: " +
                  element.tagName +
                  "\nattribute:" +
                  name +
                  "\nold value:" +
                  oldValue +
                  "\nnew value:" +
                  value);
            debugger;
        }
    }
    element.setAttribute(name, value);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.elementWarnings = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    if (theElement.outerHTML.toLowerCase().indexOf("style=") != -1)
    {
        if (this.moreInfo)
        {
            alert("inline style\n\n" +
                  theElement.outerHTML);
            debugger;
        }
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.getLikeDescendants = function(theElement, tagName, attrName, attrValue)
{
    var startSet;
    var endSet = new Array();
    if (tagName)
    {
        startSet = theElement.getElementsByTagName(tagName);
    }
    else
    {
        startSet = theElement.getElementsByTagName("*");
    }
    if (attrName)
    {
        var len = startSet.length;
        for (var i=0; i<len; i++)
        {
            if (startSet[i].getAttribute(attrName))
            {
                if (attrValue)
                {
                    if (startSet[i].getAttribute(attrName) == attrValue)
                    {
                        endSet[endSet.length] = startSet[i];
                    }
                }
                else
                {
                    endSet[endSet.length] = startSet[i];
                }
            }
        }
    }
    else
    {
        endSet = startSet;
    }
    return endSet;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.getLikeElements = function(wnd, tagName, attrName, attrValue)
{
    if (!wnd)
    {
        wnd = window;
    }

    var startSet;
    var endSet = new Array();
    if (tagName)
    {
        startSet = wnd.document.getElementsByTagName(tagName);
    }
    else
    {
        startSet = (wnd.document.all) ?
                        wnd.document.all :
                        wnd.document.getElementsByTagName("*");
    }
    if (attrName)
    {
        var len = startSet.length;
        for (var i=0; i<len; i++)
        {
            if (startSet[i].getAttribute(attrName))
            {
                if (attrValue)
                {
                    if (startSet[i].getAttribute(attrName) == attrValue)
                    {
                        endSet[endSet.length] = startSet[i];
                    }
                }
                else
                {
                    endSet[endSet.length] = startSet[i];
                }
            }
        }
    }
    else
    {
        endSet = startSet;
    }
    return endSet;
};