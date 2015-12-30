/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/emss/StylerEMSS.js,v 1.32.2.14.2.9 2014/02/18 16:42:37 brentd Exp $ */
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

/*jsl:option explicit*/
StylerBase.extendTo(StylerEMSS);

//-----------------------------------------------------------------------------
function StylerEMSS()
{
    if (!StylerEMSS._singleton)
    {
        StylerEMSS._singleton =
            StylerEMSS.baseConstructor.call(this, StylerBase.EMSS);
        StylerBase._singleton = StylerEMSS._singleton;
    }
    return StylerEMSS._singleton;
}

//-- EMSS static methods -----------------------------------------------------
//-----------------------------------------------------------------------------
StylerEMSS.getPreviousSibling = function(node)
{
    return StylerEMSS.baseStaticMethod.getPreviousSibling.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.getNextSibling = function(node)
{
    return StylerEMSS.baseStaticMethod.getNextSibling.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.getElementDocument = function(node)
{	
    return StylerEMSS.baseStaticMethod.getElementDocument.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.performFunctionCallback = function(wnd, functionPath, functionParams)
{
    StylerEMSS.baseStaticMethod.performFunctionCallback.apply(this, arguments);
};

//-- static variables ---------------------------------------------------------
StylerEMSS._singleton = null;

//-- EMSS instance methods -----------------------------------------------------

//-- overidden base instance methods ------------------------------------------
//-----------------------------------------------------------------------------
StylerEMSS.prototype.setType = function(value)
{
    StylerEMSS.baseMethod.setType.apply(this, arguments);
    if (!StylerEMSS._singleton)
    {
        StylerEMSS._singleton = this;
    }
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.getType = function()
{
    return StylerEMSS.baseMethod.getType.apply(this, arguments);
};

//-----------------------------------------------------------------------------
// Used second for any overrides from URL parameters
StylerEMSS.prototype.setByURL = function(wnd, theme, dir)
{
    StylerEMSS.baseMethod.setByURL.apply(this, (new Array(wnd)));
    
    if (theme)
    {
    	if (theme.toLowerCase() == "10.3" || theme.toLowerCase() == "infor3")
    	{
    		this.setShowLDS(false);
    		this.setShowInfor(false);
    		this.setShowInfor3(true);
    	}    	
    	else if (theme.toLowerCase() == "10" || theme.toLowerCase() == "infor")
    	{
    		this.setShowLDS(false);
    		this.setShowInfor(true);
    		this.setShowInfor3(false);
    	}	
    	else if (theme.toLowerCase() == "9" || theme.toLowerCase() == "lds")
    	{
    		this.setShowLDS(true);
    		this.setShowInfor(false);
    		this.setShowInfor3(false);
    	}
    	else if (theme.toLowerCase() == "8" || theme.toLowerCase() == "classic")
    	{	 		
	   		this.setShowLDS(false);
			this.setShowInfor(false);
			this.setShowInfor3(false);
    	}
    	else 
    	{
    		this.setShowLDS(false);
    		this.setShowInfor(false);
    		this.setShowInfor3(true);
    	}
    }  
    
    if (dir)
    {
  		if ((this.showInfor || this.showInfor3) && dir.toLowerCase() == "rtl")
    	{
    		this.setTextDir("rtl");
    	}
    	else
    	{
    		this.setTextDir("ltr");
    	}
    }
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.loadLibrary = function(wnd, httpRequest, encoding)
{
	if (!wnd)
	{
		wnd = window;
	}
	
	StylerEMSS.baseMethod.loadLibrary.apply(this, arguments);

	this.httpRequest = httpRequest || null;
	if (!this.httpRequest && typeof(wnd["SSORequest"]) != "undefined")
		this.httpRequest = wnd.SSORequest;

 	var libUrl = null;
	var libId = null;
	var subDir = null;
	if (this.showInfor || this.showInfor3)
	{
		subDir = (this.showInfor3) ? "/infor3" : "/infor";
		libId = "inforStylerEMSS";
		libUrl = StylerEMSS.webappjsURL + subDir + "/javascript/emss/inforStylerEMSS.js";
	}
	else if (this.showLDS)
	{
		libId = "ldsStylerEMSS";
		libUrl = StylerEMSS.webappjsURL + "/lds/javascript/emss/ldsStylerEMSS.js";	
	}
	
	this.lib = this.loadJsFile(wnd, libId, libUrl);	  	
};

//-----------------------------------------------------------------------------
// Theme 8 preProccessDom.  This should get replaced for other themes.
StylerEMSS.prototype.preProcessDom = function(wnd)
{
	if (!wnd)
	{
		wnd = window;
	}	

	var initCalendar = false;
	var elms = this.getLikeElements(wnd, "input", "type", "text");
	var i = 0;
	var len = elms.length;

	for (i = 0; i < len; i++)
	{   	
		// date fields
		var sib = StylerEMSS.getNextSibling(elms[i]);
		if (sib != null && sib.nodeName.toLowerCase() == "a")
		{
			// date fields
			var hrefAttr = sib.getAttribute("href");
			var clickAttr = sib.getAttribute("onclick");
			if ((hrefAttr != null && hrefAttr.indexOf("DateSelect") >= 0)
			|| (clickAttr != null && clickAttr.toString().indexOf("DateSelect") >= 0))
			{
				initCalendar = true;
				if (!elms[i].getAttribute("id"))
					elms[i].setAttribute("id", elms[i].getAttribute("name"));
				elms[i].setAttribute("for", elms[i].getAttribute("id"));
				sib.removeAttribute("onclick");
				sib.removeAttribute("href");
				sib.setAttribute("for", elms[i].getAttribute("id"));
				var toolTip = "Display calendar";
				if (typeof(wnd["findPhraseWnd"]) == "function")
				{
					var phraseWnd = findPhraseWnd(wnd);
					if (phraseWnd)	
						toolTip = phraseWnd.getSeaPhrase("DISPLAY_CAL","ESS");	
				}
				sib.setAttribute("aria-label", toolTip);
				sib.setAttribute("title", toolTip);					
				sib.onclick = elms[i].onclick = function(evt) 
				{
					if (!wnd)
						wnd = window;	            			
					if (!evt)
						evt = wnd.event || wnd.Event;
					// NOTE: You must have Calendar.js and Sizer.js loaded from webappjs
					if (typeof(wnd["CalendarObject"]) != "function")
					{
						alert("ERROR: Cannot initialize CalendarObject. \n\n " +
							"StylerEMSS.selectStyleSheet \n StylerEMSS.js");
						return;
					}	            			
					// NOTE: You must have a variable called "calObj" declared as a CalendarObject() from webappjs
					if (typeof(wnd.calObj) == "undefined" || wnd.calObj == null)
					{
						wnd.calObj = new wnd.CalendarObject(wnd,  wnd.CalendarObject.MMDDYY, "/", null);                                            
						wnd.calObj.styler = StylerEMSS._singleton;
						wnd.calObj.openDirection = wnd.CalendarObject.OPEN_LEFT_DOWN;
						if (wnd.userWnd && wnd.userWnd.authUser.calendar_type)
							wnd.calObj.setType(wnd.userWnd.authUser.calendar_type);						
					}
					var elm = null;
					if (evt.target)
						elm = evt.target;
					else if (evt.srcElement)
						elm = evt.srcElement;
					if (elm.nodeName.toLowerCase() != "input")
					{	
						while (elm && elm.parentNode && elm.parentNode != elm && elm.nodeName.toLowerCase() != "a")
							elm = elm.parentNode;
					}							
					inputFld = (elm && elm.nodeName.toLowerCase() == "a") ? wnd.document.getElementById(elm.getAttribute("for")) : null;
					if (inputFld && typeof(wnd["PositionObject"]) != "undefined")
					{			
						var inputFldPos = wnd.PositionObject.getInstance(inputFld);			
						var rightPos = inputFldPos.left + 200;							
						var windowWidth = 1024;
						var windowHeight = 768;
						if (wnd.innerWidth)
						{ 
							// non-IE browsers
							windowWidth = wnd.innerWidth;
							windowHeight = wnd.innerHeight;
						}
						else if (wnd.document && wnd.document.documentElement && wnd.document.documentElement.clientWidth)
						{
							// IE 6+ in "standards compliant mode"
							windowWidth = wnd.document.documentElement.clientWidth;
							windowHeight = wnd.document.documentElement.clientHeight;
						}
						else if (wnd.document && wnd.document.body && wnd.document.body.clientWidth)
						{
							// IE 6 in "quirks mode"
							windowWidth = wnd.document.body.clientWidth;
							windowHeight = wnd.document.body.clientHeight;
						}
						var topSpace = inputFldPos.thetop;
						var bottomSpace = windowHeight - (topSpace + inputFldPos.height);
						if (rightPos > windowWidth)
							wnd.calObj.openDirection = (bottomSpace >= 160 || bottomSpace > topSpace) ? wnd.CalendarObject.OPEN_RIGHT_DOWN : wnd.CalendarObject.OPEN_RIGHT_UP;
						else
							wnd.calObj.openDirection = (bottomSpace >= 160 || bottomSpace > topSpace) ? wnd.CalendarObject.OPEN_LEFT_DOWN : wnd.CalendarObject.OPEN_LEFT_UP;
					}			
					wnd.calObj.openCalendar(this, evt);
				}
				continue;	            	
            }
			//Time Entry tasks call different date functions
			else if ((hrefAttr != null && (hrefAttr.indexOf("Date") >= 0 || hrefAttr.indexOf("Calendar") >= 0))
			|| (clickAttr != null && (clickAttr.toString().indexOf("Date") >= 0 || clickAttr.toString().indexOf("Calendar") >= 0)))
			{
				initCalendar = true;
			}
			
			// select fields
			var selImgs = sib.getElementsByTagName("img");
			if ((selImgs.length > 0 && selImgs[0].src.indexOf("ico_form_dropmenu.gif") >= 0)
			|| ((hrefAttr != null && hrefAttr.indexOf("DropDown") >= 0)
			|| (clickAttr != null && clickAttr.toString().indexOf("DropDown") >= 0)))
			{
				var toolTip = "Select a value";
				if (typeof(wnd["findPhraseWnd"]) == "function")
				{
					var phraseWnd = findPhraseWnd(wnd);
					if (phraseWnd)	
						toolTip = phraseWnd.getSeaPhrase("SELECT_VALUE","ESS");	
				}
				sib.setAttribute("aria-label", toolTip);
				sib.setAttribute("title", toolTip);						
				for (var j=0; j<selImgs.length; j++)
				{	
					selImgs[j].setAttribute("alt", toolTip);
					selImgs[j].setAttribute("title", toolTip);
				}          		
			}			
        }        	
    }        
	if (initCalendar)
	{
		StylerEMSS.initCalendarControl(wnd);
		this.loadEnableCssFile(wnd, "/lawson/xhrnet/ui/calendar.css");
		wnd.calObj.openDirection = wnd.CalendarObject.OPEN_LEFT_DOWN;
	}	
}

//-----------------------------------------------------------------------------
StylerEMSS.prototype.selectStyleSheet = function(wnd, id)
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
	
	if (this.showLDS || this.showInfor || this.showInfor3)
	{
    	if (typeof(this.preProcessDom) == "undefined")
    	{
    		this.loadLibrary(wnd);
    	}	
		this.preProcessDom(wnd);
	}
	else
	{	
		//theme 8 preproccess
		this.preProcessDom(wnd);
	}

	var fileName = null;
	var subDir = null;
	if (this.showInfor || this.showInfor3)
	{	
		subDir = (this.showInfor3) ? "/infor3" : "/infor";
		fileName = StylerEMSS.webappjsURL + subDir + "/css/inforEMSS.css";
	}
	else if (this.showLDS)
		fileName = StylerEMSS.webappjsURL + "/lds/css/ldsEMSS.css";
	else
		fileName = "/lawson/xhrnet/ui/ui.css";

	StylerEMSS.baseMethod.setReplaceCss(true, "/lawson/xhrnet/ui/default.css", fileName);	
	StylerEMSS.baseMethod.replaceCssFile(wnd);		
	    
	if ((this.showInfor || this.showInfor3) && this.getTextDir() == "rtl")
	{
		subDir = (this.showInfor3) ? "/infor3" : "/infor"; 
		this.loadEnableCssFile(wnd, StylerEMSS.webappjsURL + subDir + "/css/inforEMSS_RTL.css");    
	}
	   
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
    	this.postProcessDom(wnd);    
	}    	

	return null;
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.loadCssFile = function(wnd, fileName)
{
    //cache the file before loading for non IE browsers
    //so we don't see an unstyled page before the CSS loads
    if (navigator.userAgent.indexOf("MSIE") == -1)
    {
		this.httpRequest = this.httpRequest || null;
		if (!this.httpRequest && typeof(wnd["SSORequest"]) != "undefined")
			this.httpRequest = wnd.SSORequest;
	    if (this.httpRequest)
	    {
			this.cssText = this.httpRequest(fileName, null, "text/plain", "text/plain", false);	
	    }
    }
    return StylerEMSS.baseMethod.loadCssFile.apply(this, arguments);    
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.loadEnableCssFile = function(wnd, fileName)
{
    var links = this.getLikeElements(wnd, "link", "type", "text/css");
    var cssLink = null;
    for (var i=0; i<links.length; i++)
    {
    	var relValue = links[i].getAttribute("rel");
    	var hrefValue = links[i].getAttribute("href");
    	if ((relValue == "stylesheet" || relValue == "alternate stylesheet") && hrefValue == fileName)
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
StylerEMSS.prototype.getLikeElements = function(wnd, tagName, attrName, attrValue)
{
    return StylerEMSS.baseMethod.getLikeElements.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.initCalendarControl = function(wnd)
{
	if (wnd.calObj == null && typeof(wnd["CalendarObject"]) == "function" && wnd.userWnd != null)
	{	
		var stylerObj = this;
		wnd.CalendarObject.prototype.translateLabels = function(func)
		{
			if (!func)
				return;

			// months
			this.monthNameAry[0] = func("JAN", "ESS");
			this.monthNameAry[1] = func("FEB", "ESS");
			this.monthNameAry[2] = func("MAR", "ESS");
			this.monthNameAry[3] = func("APR", "ESS");
			this.monthNameAry[4] = func("MAY", "ESS");
			this.monthNameAry[5] = func("JUN", "ESS");
			this.monthNameAry[6] = func("JUL", "ESS");
			this.monthNameAry[7] = func("AUG", "ESS");
			this.monthNameAry[8] = func("SEP", "ESS");
			this.monthNameAry[9] = func("OCT", "ESS");
			this.monthNameAry[10] = func("NOV", "ESS");
			this.monthNameAry[11] = func("DEC", "ESS");
	
			// days
			this.dayNameAry[0] = func("SU", "ESS");
			this.dayNameAry[1] = func("MO", "ESS");
			this.dayNameAry[2] = func("TU", "ESS");
			this.dayNameAry[3] = func("WE", "ESS");
			this.dayNameAry[4] = func("TH", "ESS");
			this.dayNameAry[5] = func("FR", "ESS");
			this.dayNameAry[6] = func("SA", "ESS");
			
			// labels
			this.labelsAry[0] = func("TODAY", "ESS");
			this.labelsAry[1] = func("OK", "ESS");
			this.labelsAry[2] = func("CANCEL", "ESS");			
		}		
		
		var sixDigitDateFmt = "";
		
		switch (wnd.userWnd.authUser.datefmt)
		{
			case "DDMMYYYY": sixDigitDateFmt = wnd.CalendarObject.DDMMYY;
				break;
			case "YYYYMMDD": sixDigitDateFmt = wnd.CalendarObject.YYMMDD;
				break;
			default: sixDigitDateFmt = wnd.CalendarObject.MMDDYY;
		}
		
		wnd.calObj = new wnd.CalendarObject(wnd, sixDigitDateFmt, wnd.userWnd.authUser.date_separator, wnd.userWnd.getSeaPhrase);
		wnd.calObj.styler = styler;
		if (wnd.userWnd.authUser.calendar_type)
		{
			wnd.calObj.setType(wnd.userWnd.authUser.calendar_type);
		}		
	}	
};