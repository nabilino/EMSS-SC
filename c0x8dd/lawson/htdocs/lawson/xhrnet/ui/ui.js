// Version: 8-)@(#)@10.00.05.00.27
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/ui/ui.js,v 1.34.2.243.2.5 2014/07/30 02:45:23 kevinct Exp $
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
var uiNoPhotoPath = "/lawson/xhrnet/ui/images/no_photo.gif";
var filterWin;
//NOTE: The FILTER_SELECT_ENABLED and FILTER_RECORDS_PER_PAGE settings have been moved to the xhrnet/xml/config/emss_config.xml file.
var userWnd = null;
var calObj = null;
var activityDialog = null;
var stylerWnd;
var styler;
var theme = null;
var messageDialog =  null;
if (window.location.search && window.location.search.toLowerCase().indexOf("theme=") >= 0)
	theme = getVarFromString("theme", window.location.search);
else
	theme = findTheme(true);
if (window.location.search && window.location.search.toLowerCase().indexOf("dir=") >= 0)
	dir = getVarFromString("dir", window.location.search);
else
	dir = findDir(true);
seaAlert = window.alert;
seaConfirm = window.confirm;
seaPageMessage = window.alert;
var browserUserAgent = navigator.userAgent;
var browserAppName = navigator.appName;

// Workaround for IE 7 "Shrink to fit" default print feature
if (browserAppName == "Microsoft Internet Explorer" && browserUserAgent.indexOf("Opera") == -1)
{
	var browserKey = "MSIE ";
	var browserVersion = parseFloat(browserUserAgent.substr(browserUserAgent.indexOf(browserKey) + browserKey.length)); 
	if (browserVersion >= 7 && window.document.execCommand)
		window.print = function(){window.document.execCommand('print', false, null);};
}

if (typeof(ProfileHandler) != "undefined")
{	
	ProfileHandler.prototype.checkForError = function()
	{
		if (!setStylerWnd(window))
			return;
		var errorWnd = window.stylerWnd || window;
		var errorType = 0;
		if (this.authUser)
		{	
			if (!this.authUser.prodline)
				errorType = 1;
			else if (!this.authUser.company || isNaN(Number(this.authUser.company)) || !this.authUser.employee || isNaN(Number(this.authUser.employee)))
				errorType = 2;
		}
		else
			errorType = 3;		
		if (errorType > 0)
		{
			errorWnd.stylePage();
			switch (errorType)
			{
				case 1: this.errorMsg = errorWnd.getSeaPhrase("PROFILE_ERR_3","SEA") + " " + this.authUser.webuser + "."; break;
				case 2: this.errorMsg = errorWnd.getSeaPhrase("PROFILE_ERR_4","SEA") + " " + this.authUser.webuser + "."; break;
				case 3: this.errorMsg = errorWnd.getSeaPhrase("PROFILE_ERR_2","SEA"); break;
				default: this.errorMsg = ""; break;
			}			
			var logoToolTip = errorWnd.getSeaPhrase("INFOR_LOGO","ESS");
			var str = '<div id="errorDiv" class="plaintablecell" style="position:relative;top:0px;padding:10px;font-size:12px"><table border="0" role="presentation"><tr><td><img class="logo" alt="'+logoToolTip+'" title="'+logoToolTip+'" src="/lawson/xhrnet/ui/images/logo.png"></td>'
			+ '<td><span style="color:#666666;font-weight:normal;font-size:18px;padding-left:10px">'+errorWnd.getSeaPhrase("EMSS","ESS")+'</span></td></tr></table>'
			+ '<div id="errorMsg" class="plaintablecell" style="color:#666666;font-weight:normal;font-size:12px"><p>'+errorWnd.getSeaPhrase("PROFILE_ERR_1","SEA")+' '+errorWnd.getSeaPhrase("PROFILE_ERR_5","SEA")+'</p><ul><li>'+this.errorMsg+'</li></ul></div>';
			errorWnd.document.body.onresize = function() {};
			errorWnd.document.body.innerHTML = str;
			if (errorWnd.styler && errorWnd.styler.showInfor3)
			{
				errorWnd.document.getElementById("errorDiv").style.top = "75px";
				errorWnd.document.getElementById("errorMsg").style.display = "none";
				errorWnd.$('body', errorWnd.document).inforSlideInMessage({
                    messageType: 'Alert',
                    messageTitle: errorWnd.getSeaPhrase("PROFILE_ERR_1","SEA"),
                    message: this.errorMsg+' '+errorWnd.getSeaPhrase("PROFILE_ERR_5","SEA"),
					showClose: false,
					autoDismiss: false
				});
			}			
			return true;
		}	
		else
			return false;
	}
}

function findPortal(searchOpener, ref)
{
	return findObjWnd("lawsonPortal", searchOpener, ref);
}

function findStyler(searchOpener, ref)
{
	return findObjWnd("StylerEMSS", searchOpener, ref);
}

function findAuthWnd(searchOpener, ref)
{
	return findObjWnd("authUser", searchOpener, ref);
}

function findSSOWnd(searchOpener, ref)
{
	return findObjWnd("SSORequest", searchOpener, ref);
}

function findPhraseWnd(searchOpener, ref)
{
	return findObjWnd("getSeaPhrase", searchOpener, ref);
}

function findObjWnd(objName, searchOpener, ref)
{
	if (!ref)
		ref = self;
	try
	{
		if (typeof(ref[objName]) != "undefined" && ref[objName] != null)
			return ref;
		else if (ref != ref.parent)
			return findObjWnd(objName, searchOpener, ref.parent);
	}
	catch(e) {}
	try
	{
		if (searchOpener && ref.opener)
		{
			if (typeof(ref.opener[objName]) != "undefined" && ref.opener[objName] != null)
				return ref.opener;
			else
				return findObjWnd(objName, searchOpener, ref.opener);
		}
	}
	catch(e) {}
	return null;
}

function findTheme(searchOpener, ref)
{
	return findProperty("theme", searchOpener, ref);
}

function findDir(searchOpener, ref)
{
	return findProperty("dir", searchOpener, ref);
}

function findProperty(propName, searchOpener, ref)
{
	if (!ref)
		ref = window;
	try
	{
		if (typeof(ref[propName]) != "undefined" && ref[propName] != null && ref[propName] != "")
			return ref[propName];
		else if (ref != ref.parent)
			return findProperty(propName, searchOpener, ref.parent);
	}
	catch(e) {}
	try
	{
		if (searchOpener && ref.opener)
		{
			if (typeof(ref["opener"][propName]) != "undefined" && ref.opener[propName] && ref.opener[propName] != "")
				return ref.opener[propName];
			else
				return findProperty(propName, searchOpener, ref.opener);
		}
	}
	catch(e) {}
	return null;
}

function setStylerWnd(wnd)
{
	try
	{
		wnd = wnd || window;
		if (typeof(wnd["styler"]) == "undefined" || wnd.styler == null)
			wnd.stylerWnd = findStyler(true);
		if (!wnd.stylerWnd)
			return false;
		if (typeof(wnd.stylerWnd["StylerEMSS"]) == "function")
			wnd.styler = new wnd.stylerWnd.StylerEMSS();
		else
			wnd.styler = wnd.stylerWnd.styler;
		wnd.theme = wnd.stylerWnd.theme;
		wnd.dir = wnd.stylerWnd.dir;
		wnd.styler.setByURL(wnd, wnd.theme, wnd.dir);
		return true;
	}
	catch(e) { return false; }
}

function stylePage(titleBar, titleBarName)
{
	if (!setStylerWnd(window))
		return;
	// find user's profile data
	if (window.userWnd == null)
		window.userWnd = findAuthWnd(true);
	var sysEnc = (window.userWnd && window.userWnd.authUser && window.userWnd.authUser.encoding) ? window.userWnd.authUser.encoding : null;
	var calType = (window.userWnd && window.userWnd.authUser && window.userWnd.authUser.calendar_type) ? window.userWnd.authUser.calendar_type : null;
	var dtFmt = (window.userWnd && window.userWnd.authUser && window.userWnd.authUser.datefmt) ? window.userWnd.authUser.datefmt : null;
	var dtSep = (window.userWnd && window.userWnd.authUser && window.userWnd.authUser.date_separator) ? window.userWnd.authUser.date_separator : null;
	var lang = (window.userWnd && window.userWnd.authUser && window.userWnd.authUser.language) ? window.userWnd.authUser.language : null;
	var tranFunc = (window.stylerWnd && typeof(window.stylerWnd["getSeaPhrase"]) == "function") ? window.stylerWnd.getSeaPhrase : null;
	// set titles, load config file
	if (tranFunc)	
		window.stylerWnd.translateFrameTitles(window);
	if (window.document.getElementById("paneHeader"))
	{
		var hdrElm = window.document.getElementById("paneHeader");
		hdrElm.setAttribute("role", "heading");
		hdrElm.setAttribute("aria-level", "1");
		if (hdrElm.childNodes.length == 1 && hdrElm.childNodes[0].nodeType == 3)
		{
			var hdrTxt = (hdrElm.childNodes[0].innerText) ? hdrElm.childNodes[0].innerText : ((hdrElm.childNodes[0].textContent) ? hdrElm.childNodes[0].textContent : null);
			if (hdrTxt)
				setWinTitle(hdrTxt);
		}
	}	
	getConfig();
	try
	{
		if (window.theme == null)
		{	
			window.theme = window.emssObjInstance.emssObj.theme;
			window.stylerWnd.theme = window.theme;
		}
	}
	catch(e) {}
	try		
	{
		if (window.dir == null && window.userWnd && window.userWnd.authUser && window.userWnd.authUser.language_dir && window.userWnd.authUser.language_dir.toLowerCase() == "rtl")
		{
			window.dir = "rtl";
			window.stylerWnd.dir = window.dir;
		}
	}
	catch(e) {}
	window.styler.setByURL(window, window.theme, window.dir);
	if ((window.styler.showLDS || window.styler.showInfor || window.styler.showInfor3) && titleBar)
	{
		if (window.styler.showLDS)
			window.document.body.style.backgroundPosition = "0px 26px";
		else if (window.styler.showInfor || window.styler.showInfor3)
		{
			try 
			{
				if (window != parent && window.frameElement)
					window.frameElement.style.visibility = "hidden";
			}
			catch(e) {}
		}
		if (typeof(window.stylerWnd["StylerEMSS"]) == "function")
			parent.styler = new window.stylerWnd.StylerEMSS();
		else
			parent.styler = window.stylerWnd.styler;
		parent.styler.showLDS = window.styler.showLDS;
		parent.styler.showInfor = window.styler.showInfor;
		parent.styler.showInfor3 = window.styler.showInfor3;
		if (typeof(window.stylerWnd["SSORequest"]) == "undefined" || window.stylerWnd.SSORequest == null)
		{
			if (window.userWnd != null && typeof(window.userWnd["SSORequest"]) != "undefined" && window.userWnd.SSORequest != null)
				window.stylerWnd.SSORequest = window.userWnd.SSORequest;
			else
			{
				var ssoWnd = findSSOWnd(true); 
				window.stylerWnd.SSORequest = (ssoWnd) ? ssoWnd.SSORequest : null;
			}
		}
		window.styler.loadLibrary(window.stylerWnd, window.stylerWnd.SSORequest, sysEnc, calType, dtFmt, dtSep, lang, tranFunc);		
		window.styler.selectStyleSheet(parent, "ui");
		window.styler.addTitleBar(parent);
		if (titleBarName)
			window.styler.setTitleBarName(parent, titleBarName);
    	var titleBarExists = true;
    	var winRef = parent;
		try
		{
	    	// find the window that contains the title bar
	    	while (winRef != winRef.parent && !titleBarExists)
	    	{
	    		if (window.styler.titleBarExists(winRef))
	       		    titleBarExists = true;
	           	else
	           		winRef = winRef.parent;
	        }
        }
        catch(e)
        {
        	winRef = parent;
        }
    	if (window.styler.titleBarExists(winRef))
       	    titleBarExists = true;
		// insert the help icon into the title bar if help text exists in the main window
		if (parent.document.getElementById("paneHelpIcon"))
		{	
            if (titleBarExists)
            {
               	var helpFunc = parent.document.getElementById("paneHelpIcon").onclick;
                // make sure the proper window name is passed in as an argument to the help function
                if (helpFunc.toString().indexOf("parent.OpenHelpDialog") != -1 && typeof(parent["OpenHelpDialog"]) == "function")
                    helpFunc = function() { parent.OpenHelpDialog(window.name); }
                else if (helpFunc.toString().indexOf("OpenHelpDialog") != -1 && typeof(window["OpenHelpDialog"]) == "function")
                	helpFunc = function() { OpenHelpDialog(window.name); }
                var toolTip = (typeof(window.stylerWnd["getSeaPhrase"]) == "function") ? window.stylerWnd.getSeaPhrase("HELP","ESS")+' '+window.stylerWnd.getSeaPhrase("OPENS_WIN","SEA") : "Help (opens new window)";
                window.styler.addTitleBarIcon(winRef, window.stylerWnd.StylerEMSS.TITLE_BAR_HELP_ICON, null, toolTip);
    			window.styler.addTitleBarMenuItem(winRef, window.stylerWnd.StylerEMSS.TITLE_BAR_HELP_ICON, toolTip, helpFunc);                
            }
		}
		// logout/close button
		try
		{
			if (titleBarExists)
			{
				var portalWnd = findPortal(false, winRef);
				var iconClick = null;
				var toolTip = "";
				if (portalWnd != null)
				{	
					iconClick = function() { emssClose(false) };
					toolTip = (typeof(window.stylerWnd["getSeaPhrase"]) == "function") ? window.stylerWnd.getSeaPhrase("CLOSE","ESS") : "";						
				}
				else
				{
					iconClick = emssLogout;
					toolTip = (typeof(window.stylerWnd["getSeaPhrase"]) == "function") ? window.stylerWnd.getSeaPhrase("LOGOUT_LBL","ESS") : "";
				}
				window.styler.addTitleBarIcon(winRef, window.stylerWnd.StylerEMSS.TITLE_BAR_LOGOFF_ICON, iconClick, toolTip);	
				try
				{
					portalWnd.lawsonPortal.hideModuleHeader();
					if (titleBar && titleBarName)
						portalWnd.enableAddShortcut(titleBarName, titleBarName, parent.location.href, true);						
				}
				catch(e) {}
				try
				{
					if (portalWnd != null && window.stylerWnd.parent == portalWnd)				
						window.stylerWnd.document.body.onunload = function() { emssClose(true) };
				} catch(e) {}	
			}
		}
		catch(e) {}
		// add skip link
		var linkTxt = (typeof(window.stylerWnd["getSeaPhrase"]) == "function") ? window.stylerWnd.getSeaPhrase("SKIP_TO_CONTENT","SEA") : "Skip to Content";
		var contentID = "";
		var i = 0;
		var len = parent.frames.length;
		while (i<len && contentID == "")
		{
			var frameID = parent.frames[i].frameElement.getAttribute("id");
		    if (frameID && frameID.toString().toLowerCase() != "header")
		    	contentID = frameID;
		    i++;
		}
		window.styler.addSkipLink(parent, linkTxt, contentID);
		if (window.styler.showLDS)	
			window.styler.addFooter(parent);	
	}
	else if (titleBar)
	{
		// theme 8 logout/close button
		var portalWnd = findPortal(false, window.stylerWnd);
		try { portalWnd.lawsonPortal.hideModuleHeader(); } catch(e) {}			
		var iconClick = null;
		var logoutMsg = "";
		if (portalWnd != null)
		{
			iconClick = function() { emssClose(false) };
			logoutMsg = window.stylerWnd.getSeaPhrase("CLOSE_ICON","ESS") || "[X]";
		}
		else
		{
			iconClick = emssLogout;
			logoutMsg = window.stylerWnd.getSeaPhrase("LOGOUT","ESS") || "[logout]";
		}
		var logoutDiv = window.stylerWnd.document.createElement("div");
		var logoutSpan = window.stylerWnd.document.createElement("span");
		logoutDiv.className = "logoutDiv";
		logoutSpan.className = "logoutSpan";
		logoutSpan.innerHTML = logoutMsg + "&nbsp;";
		logoutSpan.onclick = iconClick;
		logoutDiv.appendChild(logoutSpan);
		window.stylerWnd.document.body.appendChild(logoutDiv);
		try { portalWnd.lawsonPortal.hideModuleHeader(); } catch(e) {}
		try
		{
			if (portalWnd != null && window.stylerWnd.parent == portalWnd)
				window.stylerWnd.document.body.onunload = function() { emssClose(true) };
		} catch(e) {}
	}
	
	if (window.styler.showLDS || window.styler.showInfor || window.styler.showInfor3)
	{
		if (typeof(window["DialogObject"]) == "undefined" && typeof(window.stylerWnd["DialogObject"]) != "undefined")
			window.DialogObject = window.stylerWnd.DialogObject;
	}
	if (typeof(window.stylerWnd["SSORequest"]) == "undefined" || window.stylerWnd.SSORequest == null)
	{
		if (window.userWnd != null && typeof(window.userWnd["SSORequest"]) != "undefined" && window.userWnd.SSORequest != null)
			window.stylerWnd.SSORequest = window.userWnd.SSORequest;
		else
		{
			var ssoWnd = findSSOWnd(true); 
			window.stylerWnd.SSORequest = (ssoWnd) ? ssoWnd.SSORequest : null;
		}
	}
	window.styler.loadLibrary(window.stylerWnd, window.stylerWnd.SSORequest, sysEnc, calType, dtFmt, dtSep, lang, tranFunc);
	if (window.stylerWnd != window && typeof(window.stylerWnd["escapeForCharset"]) != "undefined")
		window.escapeForCharset = window.stylerWnd.escapeForCharset;
	window.styler.selectStyleSheet(window, "ui");
}

function emssLogout()
{
	var logoutWnd = window.stylerWnd || window;
	var postLogoutUrl = window.location.protocol + "//" + location.host + "/lawson/xhrnet/ui/logout.htm";
	logoutWnd.document.body.style.visibility = "hidden";
	if (typeof(logoutWnd["SSOAuthObject"]) == "function")
		new logoutWnd.SSOAuthObject().logout(postLogoutUrl, logoutWnd);
	else
	{
		// SSOAuthObject not found
		var logoutUrl = "/sso/logout.htm";	
		try
		{
			logoutWnd.location.replace(logoutUrl + "?" + escape(postLogoutUrl));
		}
		catch (e)
		{
			try
			{
				logoutWnd.src = logoutUrl + "?" + escape(postLogoutUrl);
			}
			catch (e)
			{
				window.location.replace(logoutUrl + "?" + escape(postLogoutUrl));
			}
		}		
	}	
}

function emssClose(pageUnloading)
{
	var closeWnd = window.stylerWnd || window;
	try
	{
		var portalWnd = findPortal(false, closeWnd);
		if (!pageUnloading)
		{
			try
			{
				portalWnd.goHome();	
			}
			catch(e)
			{
				closeWnd.location = "/lawson/xhrnet/ui/logo.htm";
			}	
		}
		portalWnd.lawsonPortal.showModuleHeader();	
	}
	catch(e) 
	{
		//closeWnd.location = "/lawson/xhrnet/ui/logo.htm";
	}
}

function removeHelpIcon()
{
	if (!setStylerWnd(window))
		return;
	// load the config file	
	getConfig();
	try
	{
		if (window.theme == null)
		{	
			window.theme = window.emssObjInstance.emssObj.theme;
			window.stylerWnd.theme = window.theme;
		}
	}
	catch(e) {}
	if (window.styler.textDir == "rtl")
		window.dir = window.styler.textDir;
	else
		window.dir = null;
	window.stylerWnd.dir = window.dir;
	window.styler.setByURL(window, window.theme, window.dir);
	if (window.styler.showLDS || window.styler.showInfor || window.styler.showInfor3)
	{
		var titleBarExists = false;
		var winRef = parent;
		try
		{	
			// find the window that contains the title bar
			while (winRef != winRef.parent && !titleBarExists)
			{
				if (window.styler.titleBarExists(winRef))
					titleBarExists = true;
				else
					winRef = winRef.parent;
			}
		}
		catch(e)
		{
			winRef = parent;
		}
		if (window.styler.titleBarExists(winRef))
			titleBarExists = true;
		if (titleBarExists)
			window.styler.removeTitleBarIcon(winRef, window.stylerWnd.StylerEMSS.TITLE_BAR_HELP_ICON);			
	}
}

function addHelpIcon(wnd)
{
	var paneHelpIcon = window.document.getElementById("paneHelpIcon");
	if (!paneHelpIcon)
		return;
	if (!setStylerWnd(window))
		return;
	// load the config file	
	getConfig();
	try
	{
		if (window.theme == null)
		{	
			window.theme = window.emssObjInstance.emssObj.theme;
			window.stylerWnd.theme = window.theme;
		}
	}
	catch(e) {}
	if (window.styler.textDir == "rtl")
		window.dir = window.styler.textDir;
	else
		window.dir = null;
	window.stylerWnd.dir = window.dir;
	window.styler.setByURL(window, window.theme, window.dir);
	if (window.styler.showLDS || window.styler.showInfor || window.styler.showInfor3)
	{
		var titleBarExists = false;
		var winRef = parent;
		try
		{	
			// find the window that contains the title bar
			while (winRef != winRef.parent && !titleBarExists)
			{
				if (window.styler.titleBarExists(winRef))
					titleBarExists = true;
				else
					winRef = winRef.parent;
			}
		}
		catch(e)
		{
			winRef = parent;
		}
		if (window.styler.titleBarExists(winRef))
			titleBarExists = true;
 		if (titleBarExists)
  		{
			var helpFunc = paneHelpIcon.onclick;
			// make sure the proper window name is passed in as an argument to the help function
			if (helpFunc.toString().indexOf("parent.OpenHelpDialog") != -1 && typeof(parent["OpenHelpDialog"]) == "function")
				helpFunc = function(){parent.OpenHelpDialog(window.name);}
			else if (helpFunc.toString().indexOf("OpenHelpDialog") != -1 && typeof(window["OpenHelpDialog"]) == "function")
				helpFunc = function(){OpenHelpDialog(window.name);}
			var toolTip = (typeof(window.stylerWnd["getSeaPhrase"]) == "function") ? window.stylerWnd.getSeaPhrase("HELP","ESS")+' '+window.stylerWnd.getSeaPhrase("OPENS_WIN","SEA") : "Help (opens new window)";
			window.styler.addTitleBarIcon(winRef, window.stylerWnd.StylerEMSS.TITLE_BAR_HELP_ICON, null, toolTip);
			window.styler.addTitleBarMenuItem(winRef, window.stylerWnd.StylerEMSS.TITLE_BAR_HELP_ICON, toolTip, helpFunc);
		}			
	}
}

function styleElement(stylerElement, options)
{
	if (!setStylerWnd(window))
		return;
	if (!stylerElement || !window.styler || (!window.styler.showLDS && !window.styler.showInfor && !window.styler.showInfor3))
		return;
	options = options || {};
	var tagName = stylerElement.tagName.toLowerCase();
	switch (tagName)
	{
		case "input":
			window.styler.processInputElement(window, stylerElement, options);
			break;
		case "button":
			window.styler.processButtonElement(window, stylerElement, options);
			break;
		case "div":
			window.styler.processDivElement(window, stylerElement, options);
			break;
		case "select":
			window.styler.processComboBoxElement(window, stylerElement, options);
			break;
		case "span":
			window.styler.processSpanElement(window, stylerElement, options);
			break;
		case "table":
			window.styler.processTableElement(window, stylerElement, options);
			break;
		case "img":
			window.styler.processImageElement(window, stylerElement, options);
			break;
		case "textarea":
			window.styler.processTextAreaElement(window, stylerElement, options);
			break;
		case "a":
			window.styler.processHyperlinkElement(window, stylerElement, options);
			break;			
		default:break;
	}
}

function focusElement(stylerElement)
{
	if (!setStylerWnd(window))
		return;
	if (!stylerElement)
		return;
	if (!window.styler || !window.stylerWnd || (!window.styler.showLDS && !window.styler.showInfor && !window.styler.showInfor3))
	{
		try { styleElement.focus() } catch(e) {}
		return;	
	}	
	window.stylerWnd.StylerBase.focusElement(stylerElement);
}

function triggerElement(stylerElement, eventNm)
{
	if (!setStylerWnd(window))
		return;
	if (!stylerElement || !window.styler || (!window.styler.showLDS && !window.styler.showInfor && !window.styler.showInfor3))
		return;
	var tagName = stylerElement.tagName.toLowerCase();
	switch (tagName)
	{
		case "select":
			window.styler.triggerComboBoxElement(window, stylerElement, eventNm);
			break;

		default:break;
	}	
}

function styleSortArrow(tblID, fldName, direction)
{
	if (!setStylerWnd(window))
		return;
	if (window.styler.showLDS || window.styler.showInfor || window.styler.showInfor3)
	{
		var tbl = document.getElementById(tblID);
		if (!tbl)
			return;
		var tblHdrs = tbl.getElementsByTagName("th");
		var len = tblHdrs.length;
		for (var i=0; i<len; i++)
		{
			var links = tblHdrs[i].getElementsByTagName("a");
			if (links.length > 0)
			{
				if ((links[0].onclick && links[0].onclick.toString().indexOf(fldName) >= 0) || (links[0].href && links[0].href.toString().indexOf(fldName) >= 0))
				{
					if (!direction)
						direction = "ascending";
					window.styler.addSortArrow(window, tblHdrs[i].childNodes[0], direction);
		        	var toolTip = links[0].getAttribute("title");
		        	if (toolTip != null)
		        	{
						var phraseWnd = findPhraseWnd();
						if (phraseWnd)	
						{
			        		toolTip = toolTip.split(" - ")[0];
			        		if (direction == "descending")
			        			toolTip += ' - ' + phraseWnd.getSeaPhrase("DESC","SEA") + ' - ' + phraseWnd.getSeaPhrase("SORT_ASC","SEA");
			        		else
			        			toolTip += ' - ' + phraseWnd.getSeaPhrase("ASC","SEA") + ' - ' + phraseWnd.getSeaPhrase("SORT_DESC","SEA");
			        		links[0].setAttribute("title", toolTip);
			        		links[0].setAttribute("aria-label", toolTip);						
						}
		        	}					
					break;
				}
			}
		}
	}
}

function getConfig()
{
	if (typeof(window["stylerWnd"]) == "undefined")
		window.stylerWnd = findStyler(true);
	var wnd = window.stylerWnd || window;
	if (typeof(wnd["StylerEMSS"]) != "function")
		return;
	window.emssObjInstance = wnd.findEMSSObj(true);
	if (!window.emssObjInstance)
		window.emssObjInstance = window;
	if (!window.emssObjInstance.emssObj)
	{	
		window.emssObjInstance.emssObj = new wnd.EMSSShell();
		// find the user's profile data
		if (window.userWnd == null)
			window.userWnd = findAuthWnd(true);
		if (window.userWnd && window.userWnd.authUser)
			window.emssObjInstance.emssObj.configure(window.userWnd.authUser.company);
		else
			window.emssObjInstance.emssObj.configure();
	}
}

function setLayerSizes(sizeToData,expandToFit)
{
	var tmpTags1 = document.getElementsByTagName("DIV");
	var tmpTags2 = document.getElementsByTagName("IFRAME");
	var tmpTags3 = document.getElementsByTagName("IMG");
	var tmpTags4 = document.getElementsByTagName("SPAN");
	var len = tmpTags1.length;
	for (var i=0; i<len; i++)
		setLayerSize(tmpTags1[i]);
	len = tmpTags2.length;
	for (var j=0; j<len; j++)
		setLayerSize(tmpTags2[j]);
	len = tmpTags3.length;
	for (var k=0; k<len; k++)
		setLayerSize(tmpTags3[k]);	
	len = tmpTags4.length;
	for (var l=0; l<len; l++)
		setLayerSize(tmpTags4[l]);	
	if (sizeToData)
		resizeFrame(expandToFit);	
}

function resizeFrame(expandToFit, expandOnly)
{
	if (!setStylerWnd(window))
		return;
    if (window.styler && window.styler != null && (window.styler.showLDS || window.styler.showInfor || window.styler.showInfor3))
    	return;
	try 
	{
		// initialize the inner div heights before we resize the frame
		var paneBody = document.getElementById("paneBody");
		var paneBodyBorder = document.getElementById("paneBodyBorder");
		var paneBorder = document.getElementById("paneBorder");
		var frameElm = (window.name != "") ? parent.document.getElementById(window.name) : null;
		if (!frameElm)
			return;
		// disable the onresize window event if it exists - we don't want the elements in the frame to resize themselves
		if (window.onresize && window.onresize.toString().indexOf("setLayerSizes") >= 0)
			window.onresize = null;
		frameElm.setAttribute("scrolling", "no");
		paneBody.style.height = "auto";
		paneBodyBorder.style.height = "auto";
		if (document.getElementById("paneTable"))
			document.getElementById("paneTable").style.height = "auto";
		paneBorder.style.height = "auto";	
		var visibleWindowHeight;
		// get the height of the frame contents by looking at the height of the outer paneBorder
		if (paneBorder.offsetHeight || paneBorder.clientHeight)
		{
			visibleWindowHeight = (paneBorder.offsetHeight) ? paneBorder.offsetHeight : paneBorder.clientHeight;
			if (navigator.appName.indexOf("Microsoft") == -1)
				visibleWindowHeight += 5;
		}
		if (typeof(visibleWindowHeight) != "undefined")
		{
			// include the height of the pane header in our calculations, if one exists
			var paneHeaderHeight = 0; 	
			if (paneBodyBorder.offsetTop > 0)
				paneHeaderHeight = paneBodyBorder.offsetTop;			
			else if (document.getElementById("paneHeader"))
			{
				var paneHeader = document.getElementById("paneHeader");
				paneHeaderHeight = paneHeader.offsetHeight + paneHeader.offsetTop;
			}
			// first, keep track of the original frame height - we will never size greater than that value
			var resizedAttribute = frameElm.getAttribute("resized");
			var frameHeight = Number(frameElm.style.height.toString().replace("px",""));
			var origHeight = 0;
			if (resizedAttribute == null)
			{
				origHeight = frameHeight;
				frameElm.setAttribute("origheight", String(frameHeight));
				frameElm.setAttribute("resized", "true");
			}
			else if (frameElm.getAttribute("origheight") != null)
				origHeight = Number(frameElm.getAttribute("origheight"));
			if (visibleWindowHeight > origHeight)
				visibleWindowHeight = origHeight;
			// next, resize the frame height
			if (visibleWindowHeight != frameHeight)
				parent.document.getElementById(window.name).style.height = visibleWindowHeight + "px";
			// finally, set the heights of the div elements containing the contents to the actual content height 
			// and make sure we only get scrollbars on the innermost "paneBody" div; setting the heights should 
			// introduce scrollbars if necessary
			var posObj = getCurrentElementPosition(paneBodyBorder);
			paneBodyBorder.style.overflow = "hidden";
			if (!isNaN(posObj.thetop))
				paneBodyBorder.style.height = (visibleWindowHeight - posObj.thetop) + "px";
			else
				paneBodyBorder.style.height = (visibleWindowHeight - paneHeaderHeight) + "px";

			var paneBodyBorderContentHeight = getComputedClientHeight(window, paneBodyBorder);
			paneBody.style.height = paneBodyBorderContentHeight + "px";
			// adjust for border heights in firefox
			if (navigator.appName.indexOf("Microsoft") == -1)
				paneBorder.style.height = (visibleWindowHeight - 2) + "px";
			else
				paneBorder.style.height = visibleWindowHeight + "px";			
		}
	} 
	catch(e) {}
}

function setWinTitle(str, wnd)
{
	wnd = wnd || window;
	try
	{
		wnd.document.title = str;
		if (wnd.frameElement)
			wnd.frameElement.setAttribute("title", str)
	}
	catch(e) {}
}

function getWinTitle(wnd)
{
	wnd = wnd || window;
	var str = "";
	try
	{
		if (wnd.frameElement)
			str = wnd.frameElement.getAttribute("title");
		else
			str = wnd.document.title;
	}
	catch(e) {}
	return str;
}

function getComputedClientHeight(wnd, elm)
{
	return (elm.offsetHeight - getComputedPadding(wnd, elm));
}

function getComputedPadding(wnd, elm)
{
 	var styleObj = (wnd.getComputedStyle) ? wnd.getComputedStyle(elm, null) : elm.currentStyle;
	var computedPadding = 0;
	if (styleObj)
	{
		if (!isNaN(parseInt(styleObj.paddingTop, 10)))
			computedPadding += parseInt(styleObj.paddingTop, 10);
		if (!isNaN(parseInt(styleObj.paddingBottom, 10)))
			computedPadding += parseInt(styleObj.paddingBottom, 10);
		if (!isNaN(parseInt(styleObj.borderTopWidth, 10)))
			computedPadding += parseInt(styleObj.borderTopWidth, 10);
		if (!isNaN(parseInt(styleObj.borderBottomWidth, 10)))
			computedPadding += parseInt(styleObj.borderBottomWidth, 10);
	}
	return computedPadding;
}

function getCurrentElementPosition(obj)
{
	if (typeof(obj.offsetParent) != "object")
		return;
	var tempObj = obj;
    var tempDoc = null;
    var retObj = new Object();
    if (tempObj.ownerDocument)
    	tempDoc = tempObj.ownerDocument;
    else if (tempObj.document)
    	tempDoc = tempObj.document;
	// Gecko-based browsers
	if (tempDoc != null && tempDoc.getBoxObjectFor)
	{
  		var box = tempDoc.getBoxObjectFor(tempObj);
  		var vpBox = tempDoc.getBoxObjectFor(tempDoc.documentElement);
    	retObj.left = box.screenX - vpBox.screenX;
    	retObj.thetop = box.screenY - vpBox.screenY;
	}
	// IE
	else if (tempObj.offsetParent)
    {         	    	
        do
        {
			retObj.thetop += tempObj.offsetTop;
			retObj.left += tempObj.offsetLeft;
        	// account for the scroll positions for everything but the body element
        	if (tempDoc != null && tempObj != tempDoc.body && tempObj != tempDoc.documentElement)
        	{	
        		retObj.thetop -= tempObj.scrollTop;
        		retObj.left -= tempObj.scrollLeft;
			}
			tempObj = tempObj.offsetParent;
        }
        while (tempObj);        	
    }
	retObj.bottom = retObj.thetop + obj.offsetHeight;
	retObj.right = retObj.left + obj.offsetWidth;
	retObj.width = obj.offsetWidth;
	retObj.height = obj.offsetHeight;
	return retObj;
}

function setLayerSize(docTag)
{
	if (!docTag.className) return;
	if (!setStylerWnd(window))
		return;
	var isIE = (navigator.userAgent.indexOf("MSIE") >= 0);
	var winObj = getWinSize();
	var winWidth = winObj[0];	
	var winHeight = winObj[1];
	if (isIE)
	{
		var version = parseFloat(navigator.userAgent.substr(navigator.userAgent.indexOf("MSIE ") + 5));
		if (version > 6 && (window.styler.showLDS || window.styler.showInfor || window.styler.showInfor3))
			return;
		if (docTag.className == "paneborder" || docTag.className == "paneborderlite" || docTag.className == "panebordertimeentry"
		|| docTag.className == "helppaneborder" || docTag.className == "dialogpaneborder")
		{
			docTag.style.height = (winHeight-10)+"px";
			docTag.style.width = (winWidth-10)+"px";
		}
		else if (docTag.className == "paneborder2")
			docTag.style.height = (winHeight-10)+"px";
		else if (docTag.className == "panebodyborder" || docTag.className == "panebodyborder2" || docTag.className == "panebodyborder3")
		{
			var hdrHeight = (document.getElementById("paneHeader"))?document.getElementById("paneHeader").offsetHeight:-5;
			var recordsHeight = (document.getElementById("paneRecords"))?document.getElementById("paneRecords").offsetHeight:0;			
			docTag.style.height = (winHeight-hdrHeight-recordsHeight-15)+"px";
			docTag.style.width = (winWidth-10)+"px";
		}		
		else if (docTag.className == "contentframe")
			docTag.style.height = (winHeight-42)+"px";	
		else if (docTag.className == "panebodylite")
			docTag.style.width = (winWidth-10)+"px";		
		else if (docTag.className == "helpicon")
		{				
			if (window.styler && window.styler.textDir == "rtl")
			{	
				docTag.style.left = "5px";
				docTag.style.marginLeft = "10px";
				docTag.style.right = "auto";
				docTag.style.float = "left";
			}	
			else
			{	
				docTag.style.left = "auto";
				docTag.style.right = "5px";
				docTag.style.marginRight = "10px";
				docTag.style.float = "right";				
			}	
		}		
		else if (docTag.className == "taskheader")
			docTag.style.width = (winWidth-20)+"px";		
	}
	else
	{	
		if (docTag.className == "paneborder" || docTag.className == "paneborderlite")
		{
			docTag.style.height = (winHeight-12)+"px";
			docTag.style.width = (winWidth-7)+"px";
		}
		else if (docTag.className == "helppaneborder")
		{
			docTag.style.height = (winHeight-12)+"px";
			docTag.style.width = (winWidth-12)+"px";
		}			
		else if (docTag.className == "paneheader" || docTag.className == "paneheaderlite" || docTag.className == "helppaneheader")
			docTag.style.width = (winWidth-42)+"px";
		else if (docTag.className == "panebodyborder" || docTag.className == "panebodyborder2" || docTag.className == "panebodyborder3")
		{
			var hdrHeight = (document.getElementById("paneHeader"))?document.getElementById("paneHeader").offsetHeight:-5;
			var recordsHeight = (document.getElementById("paneRecords"))?document.getElementById("paneRecords").offsetHeight:0;
			if (window.styler && window.styler != null && window.styler.showInfor)
			{
				if (document.getElementById("paneBorder") && document.getElementById("paneBorder").className == "helppaneborder")
				{
					docTag.style.height = (winHeight-recordsHeight-36)+"px";
					docTag.style.width = (winWidth-14)+"px";			
				}
				else
				{
					docTag.style.height = (winHeight-recordsHeight-32)+"px";
					docTag.style.width = (winWidth-10)+"px";	
				}
			}		
			else if (window.styler && window.styler != null && window.styler.showLDS)
				docTag.style.height = (winHeight-hdrHeight-recordsHeight-22)+"px";		
			else
			{
				docTag.style.height = (winHeight-hdrHeight-recordsHeight-15)+"px";
				docTag.style.width = (winWidth-7)+"px";	
			}
		}
		else if (docTag.className == "panebody" || docTag.className == "panebodylite")
		{
			var hdrHeight = (document.getElementById("paneHeader"))?document.getElementById("paneHeader").offsetHeight:-5;
			var recordsHeight = (document.getElementById("paneRecords"))?document.getElementById("paneRecords").offsetHeight:0;
			if (window.styler && window.styler != null && window.styler.showInfor)		
				docTag.style.height = (winHeight-recordsHeight-32)+"px";			
			else if (window.styler && window.styler != null && window.styler.showLDS)		
				docTag.style.height = (winHeight-hdrHeight-recordsHeight-24)+"px";		
			else
				docTag.style.height = (winHeight-hdrHeight-recordsHeight-19)+"px";
		}
		else if (docTag.className == "helppanebody")
		{
			var hdrHeight = (document.getElementById("paneHeader"))?document.getElementById("paneHeader").offsetHeight:-5;
			var recordsHeight = (document.getElementById("paneRecords"))?document.getElementById("paneRecords").offsetHeight:0;
			if (window.styler && window.styler != null && window.styler.showInfor)
			{		
				if (document.getElementById("paneBorder") && document.getElementById("paneBorder").className == "helppaneborder")
				{
					docTag.style.height = (winHeight-recordsHeight-36)+"px";
					docTag.style.width = (winWidth-14)+"px";			
				}
				else
				{		
					docTag.style.height = (winHeight-recordsHeight-32)+"px";
					docTag.style.width = (winWidth-10)+"px";
				}	
			}		
			else if (window.styler && window.styler != null && window.styler.showLDS)
			{
				docTag.style.height = (winHeight-hdrHeight-recordsHeight-24)+"px";	
				docTag.style.width = (winWidth-20)+"px";	
			}		
			else
			{
				docTag.style.height = (winHeight-hdrHeight-recordsHeight-19)+"px";		
				docTag.style.width = (winWidth-10)+"px";	
			}
			docTag.style.padding = "0px";
		}
		else if (docTag.className == "innertabs")
		{
			docTag.style.top = "2px";
			docTag.style.marginBottom = "0px";
		}
		else if (docTag.className == "taskheader")
			docTag.style.width = (winWidth-30)+"px";
		else if (docTag.className == "dialogpaneborder")
		{
			docTag.style.height = (winHeight-12)+"px";
			docTag.style.width = (winWidth-15)+"px";
		}
		else if (docTag.className == "helpicon")
		{
			docTag.style.top = "5px";
			if (window.styler && window.styler.textDir == "rtl")
			{	
				docTag.style.left = "5px";
				docTag.style.marginLeft = "10px";
				docTag.style.right = "auto";
				docTag.style.float = "left";
			}	
			else
			{	
				docTag.style.left = "auto";
				docTag.style.marginRight = "10px";
				docTag.style.right = "5px";
				docTag.style.float = "right";				
			}			
		}
		else if (docTag.className == "contentframe")
			docTag.style.height = (winHeight-30)+"px";
		else if (docTag.className == "fullcontentframe")
			docTag.style.height = (winHeight)+"px";	
		else if (docTag.className == "panebordertimeentry")
		{
			docTag.style.width = (winWidth-15)+"px";
			docTag.style.height = (winHeight-65)+"px";
			try { document.getElementById('TABLE').style.height = "525px"; } catch(e) {
				try { document.getElementById('CONTROLITEM').style.height = "525px"; } catch(e) {
					try { document.getElementById('main').style.height = "525px"; } catch(e) {
						try { document.getElementById('MAIN').style.height = "525px"; } catch(e) {}
					}
				}
			}
		}
	}
}

function uiTabSet(id, tabs, tabHtml)
{
	this.id = id;
	this.tabs = (tabs)?tabs:new Array();
	if (tabHtml)
		this.tabHtml = tabHtml;
	else 
	{
		this.tabHtml = new Array();
		for (var i=0; i<this.tabs.length; i++)
			this.tabHtml[i] = "";
	}
	this.getActiveTab = function ()
	{
		var contentFrame;
		var done = false;
		var i = 0;
		while (!done)
		{
			try 
			{
				contentFrame = this.frame.document.getElementById(this.id+"_Body_"+i);
				if (contentFrame)
				{
					if (contentFrame.style.display != "none")
					{
						this.activetab = i;
						return i;
					}
				}
				else
					done = true;
			}
			catch (e) 
			{
				done = true;
			}
			i++;
		}
		this.activetab = 0;
		return 0;
	}
	this.setTabHtml = function (tabNbr, tabHtml)
	{
		try 
		{
			var contentFrame = this.frame.document.getElementById(this.id+"_Body_"+tabNbr);
			if (!contentFrame)
				contentFrame = this.frame.document.getElementById(this.id+"_TabBody_"+tabNbr);
			contentFrame.innerHTML = tabHtml;
			this.frame.stylePage();
			this.frame.setLayerSizes();
		}
		catch(e) {}
	}
	this.setActiveTab = function (tabNbr)
	{
		try 
		{
			var tabObj = this.frame.document.getElementById(this.id+"_TabBody_"+tabNbr);
			activateTab(tabObj);
		}
		catch(e) {}
	}
	this.activetab = 0;
	this.draw = false;
	this.frame = self;
	this.isDetail = false;
	this.create = uiTabs;
	this.rendered = false;
}

function uiTabs(frameObj)
{
	var tabClassStr = (this.isDetail) ? "innertabbodylite" : "innertabbody";
	var bodyClassStr = (this.isDetail) ? "panebodylite" : "panebody";
	this.frame = (frameObj) ? frameObj : this.frame;
	this.id = (this.id) ? this.id : "innerTabs";
	var str = '<div id="'+this.id+'" class="innertabs" styler="tabcontrol" styler_init="StylerEMSS.initTabControl" styler_click="StylerEMSS.onClickTabControlTab" styler_load="StylerEMSS.onLoadTabControlTab">'
	str += '<table border="0" cellspacing="0" cellpadding="0" role="presentation"><tr>'
	for (var i=0; i<this.tabs.length; i++)
	{
		var tip = this.tabs[i]+' - '+getSeaPhrase("OPEN_TAB_X","SEA");
		if (this.activetab == i)
		{
			if (i > 0)
				str += '<td><a href="javascript:;" name="'+tabClassStr+'" id="'+this.id+'_TabBody_'+i+'" class="'+tabClassStr+'" style="border-left:0px" onclick="tabOnClick(this);return false;" title="'+tip+'">'+this.tabs[i]+'</a></td>'
			else
				str += '<td><a href="javascript:;" name="'+tabClassStr+'" id="'+this.id+'_TabBody_'+i+'" class="'+tabClassStr+'" onclick="tabOnClick(this);return false;" title="'+tip+'">'+this.tabs[i]+'</a></td>'
		}
		else
		{
			if (i > 0)
				str += '<td><a href="javascript:;" name="'+tabClassStr+'" id="'+this.id+'_TabBody_'+i+'" class="innertabbodyoff" style="border-left:0px" onclick="tabOnClick(this);return false;" title="'+tip+'">'+this.tabs[i]+'</a></td>'
			else
				str += '<td><a href="javascript:;" name="'+tabClassStr+'" id="'+this.id+'_TabBody_'+i+'" class="innertabbodyoff" onclick="tabOnClick(this);return false;" title="'+tip+'">'+this.tabs[i]+'</a></td>'
		}
	}
	str += '</tr></table></div>';		
	if (this.draw)
	{
		try 
		{
			this.frame.document.getElementById("paneInnerTabs").innerHTML = str;
			var tabBodyHtml = "";
			for (var i=0; i<this.tabs.length; i++)
			{
				if (this.activetab == i)
					tabBodyHtml += '<div id="'+this.id+'_Body_'+i+'" class="'+bodyClassStr+'" style="position:relative;overflow:hidden;display:block">'+this.tabHtml[i]+'</div>';
				else
					tabBodyHtml += '<div id="'+this.id+'_Body_'+i+'" class="'+bodyClassStr+'" style="position:relative;overflow:hidden;display:none">'+this.tabHtml[i]+'</div>';
			}
			// disable scrolling on the parent layer; the individual tab content layers will scroll
			this.frame.document.getElementById("paneBody").style.overflow = "hidden";
			this.frame.document.getElementById("paneBody").innerHTML = tabBodyHtml;
			this.frame.stylePage();
			this.frame.setLayerSizes();
			this.rendered = true;	
		}
		catch (e) { return str; }
		if (!setStylerWnd(window))
			return;
		// make sure the active tab is activated		
		if (!window.styler.showInfor3)
			try { this.frame.tabOnClick(this.frame.document.getElementById(this.id+"_TabBody_"+this.activetab)); } catch (e) {}
	}
	return str;
}

function displaySwitchSetup(positionIndices, wnd) 
{
	wnd = wnd || window;
	for (var v=0; v<positionIndices.length; v++)
	{
		try { wnd.document.getElementById("collapsibleList"+positionIndices[v]).style.listStyle = "none"; } catch(e) {}
		wnd.document.getElementById("Position"+positionIndices[v]+"List").style.listStyle = "none";
		wnd.document.getElementById("Position"+positionIndices[v]+"List").style.display = "none";
	}
	try { wnd.document.getElementById("StaticList").style.listStyle = "none"; } catch(e) {}
}

function displaySwitchClick(e, id, openMsg, closeMsg, openImg, openImgOver, openImgActive, closeImg, closeImgOver, closeImgActive, wnd)
{
	var evt = e || window.event;
	if (evt)
	{
		if (evt.stopPropagation)
			evt.stopPropagation();
		else
			evt.cancelBubble = true;
	}
	wnd = wnd || window;
	var listObj = (id) ? wnd.document.getElementById('Position'+id+'List') : null;
	var imgObj = (id) ? wnd.document.getElementById('Position'+id+'Image') : null;
	if (!listObj || !imgObj)
		return;
	var listElementStyle = listObj.style;
	if (!openMsg)
		openMsg  = "Open";
	if (!closeMsg)
		closeMsg  = "Close";
    if (listElementStyle.display == "none") 
    {
    	listElementStyle.display = "block";
    	imgObj.src = (openImg) ? openImg : "/lawson/xhrnet/ui/images/ico_reveal_open.gif";
    	imgObj.setAttribute("alt", closeMsg);
    	imgObj.setAttribute("title", closeMsg);
    	imgObj.onmouseover = imgObj.onfocus = function(){this.src = openImgOver;};
    	imgObj.onmousedown = imgObj.onkeydown = function(){this.src = openImgActive;};    	
    	imgObj.onmouseout = imgObj.onblur = function(){this.src = openImg;};
    	try
    	{
			if (styler.showInfor3)
			{
				var itemObj = (id) ? wnd.document.getElementById('Position'+id+'Item') : null;
				if (itemObj)
					itemObj.style.paddingLeft = "2px";
				var lblObj = (id) ? wnd.document.getElementById('Position'+id+'Label') : null;
				if (lblObj)
				{	
					if (!itemObj || !itemObj.className)
						lblObj.style.color = "#13A3F7";    	
					lblObj.style.marginLeft = "2px";
				}	
			}
    	}
    	catch(e) {}
    }
    else 
    {
    	listElementStyle.display = "none";
    	imgObj.src = (closeImg) ? closeImg : "/lawson/xhrnet/ui/images/ico_reveal_close.gif";
    	imgObj.setAttribute("alt", openMsg);
    	imgObj.setAttribute("title", openMsg);
    	imgObj.onmouseover = imgObj.onfocus = function(){this.src = closeImgOver;};
    	imgObj.onmousedown = imgObj.onkeydown = function(){this.src = closeImgActive;};  	
    	imgObj.onmouseout = imgObj.onblur = function(){this.src = closeImg;};
    	try
    	{
			if (styler.showInfor3)
			{
				var itemObj = (id) ? wnd.document.getElementById('Position'+id+'Item') : null;
				if (itemObj)
					itemObj.style.paddingLeft = "10px";
				var lblObj = (id) ? wnd.document.getElementById('Position'+id+'Label') : null;
				if (lblObj)
				{	
					if (!itemObj || !itemObj.className)
						lblObj.style.color = "#1a1a1a";    	
					lblObj.style.marginLeft = "7px";
				}	
			}
    	}
    	catch(e) {}
    }
	if (typeof(wnd['switchClicked']) == "function")
		wnd.switchClicked(id);
	else if (typeof(window['switchClicked']) == "function")
		switchClicked(id);
}

function tabOnClick(tab)
{
	var tabProps = tab.id.split("_");
	var tabId = tabProps[0];
	var tabType = tabProps[1];
	var tabNbr = tabProps[2];
	// invoke on tab click event function
	try 
	{
		if (typeof(window[tabId+"_OnClick"]) == "function")
		{
			if (!window[tabId+"_OnClick"](tab))
				return;
		}
		else if (typeof(parent[tabId+"_OnClick"]) == "function")
		{
			if (!parent[tabId+"_OnClick"](tab))
				return;
		}
	}
	catch(e) {}
	activateTab(tab);
}

function activateTab(tab)
{
	var tabProps = tab.id.split("_");
	var tabId = tabProps[0];
	var tabType = tabProps[1];
	var tabNbr = tabProps[2];
	var tabObj;
	// find the global tab set object
	try 
	{
		if (typeof(window[tabId]) != "undefined" && typeof(window[tabId].activetab) != "undefined")
			tabObj = window[tabId];
		if (typeof(parent[tabId]) != "undefined" && typeof(parent[tabId].activetab) != "undefined")
			tabObj = parent[tabId];
	}
	catch(e) {}
	if (tabObj && Number(tabNbr) == Number(tabObj.activetab))
		return;	
	// set the active tab
	try 
	{
		if (typeof(window[tabId]) != "undefined" && typeof(window[tabId].activetab) != "undefined")
			window[tabId].activetab = Number(tabNbr);
		if (typeof(parent[tabId]) != "undefined" && typeof(parent[tabId].activetab) != "undefined")
			parent[tabId].activetab = Number(tabNbr);
	}
	catch(e) {}
	var tabFrame = (tabObj) ? tabObj.frame : window;
	// deactivate other tabs
	try 
	{
		var tabSet = tabFrame.document.getElementById(tabId);
		var tabList = tabSet.getElementsByTagName("a");
		for (var i=0; i<tabList.length; i++)
		{
			tabProps = tabList[i].id.split("_");
			if (tabProps[2] != tabNbr)
				deactivateTab(tabList[i],tabFrame);
		}
	}
	catch(e) {}
	tabFrame.document.getElementById(tabId+"_TabBody_"+tabNbr).className = tab.getAttribute("name");
	setTabContents(tab,tabFrame);
}

function deactivateTab(tab,tabFrame)
{
	var tabProps = tab.id.split("_");
	var tabId = tabProps[0];
	var tabType = tabProps[1];
	var tabNbr = tabProps[2];
	tabFrame.document.getElementById(tabId+"_TabBody_"+tabNbr).className = "innertabbodyoff";
}

function setTabContents(tab,tabFrame)
{
	var tabProps = tab.id.split("_");
	var tabId = tabProps[0];
	var tabType = tabProps[1];
	var tabNbr = tabProps[2];
	try 
	{
		if (typeof(window[tabId+"_OnBeforeLoad"]) == "function")
		{
			if (!window[tabId+"_OnBeforeLoad"](tab))
				return;
		}
	}
	catch(e) {}
	var contentFrame;
	var done = false;
	var i = 0;
	while (!done)
	{
		if (i != tabNbr)
		{
			try 
			{
				contentFrame = tabFrame.document.getElementById(tabId+"_Body_"+i);
				if (contentFrame)
				{
					contentFrame.setAttribute("tabindex", "0");
					contentFrame.style.overflow = "auto";
					contentFrame.style.display = "none";
				}
				else
					done = true;
			}
			catch (e) 
			{
				done = true;
			}
		}
		i++;
	}
	try 
	{
		if (window.navigator.appName == "Microsoft Internet Explorer") 
			tabFrame.document.getElementById(tabId+"_Body_"+tabNbr).style.display = "block";
		else 
			tabFrame.document.getElementById(tabId+"_Body_"+tabNbr).style.display = "block";
	}
	catch(e) {}
	// invoke on tab activate event function
	try 
	{
		if (typeof(window[tabId+"_OnActivate"]) == "function")
		{
			if (!window[tabId+"_OnActivate"](tab))
				return;
		}
		else if (typeof(parent[tabId+"_OnActivate"]) == "function")
		{
			if (!parent[tabId+"_OnActivate"](tab))
				return;
		}
	}
	catch(e) {}
}

function setTabContentSizes(tabId, tabFrame, tabWidth, tabHeight)
{
	var contentFrame = null;
	var done = false;
	var i = 0;
	if (!setStylerWnd(window))
		return;
	try
	{
		if (tabWidth)
		{
			tabFrame.document.getElementById("paneBorder").style.width = tabWidth + "px";
			tabFrame.document.getElementById("paneBodyBorder").style.width = tabWidth + "px";
			tabFrame.document.getElementById("paneBody").style.width = tabWidth + "px";
		}
		if (tabHeight)
		{
			tabFrame.document.getElementById("paneBorder").style.height = tabHeight + "px";
			tabFrame.document.getElementById("paneBodyBorder").style.height = tabHeight + "px";
			tabFrame.document.getElementById("paneBody").style.height = tabHeight + "px";
		}
	}
	catch(e) {}
	while (!done)
	{
		var contentWidth;
		var contentHeight;
		if (styler && styler.showInfor3)
		{
			contentWidth = tabWidth - 18;
			contentHeight = tabHeight - 65;			
		}		
		else if (styler && styler.showInfor)
		{
			contentWidth = tabWidth - 18;
			contentHeight = tabHeight - 50;			
		}	
		else if (styler && (styler.showLDS || styler.showInfor3))
		{
			contentWidth = tabWidth - 10;
			contentHeight = tabHeight - 55;			
		}	
		else
		{
			contentWidth = tabWidth;
			contentHeight = tabHeight - 48;				
		}	
		try
		{
			contentFrame = tabFrame.document.getElementById(tabId+"_Body_"+i);
			if (!contentFrame)
				contentFrame = tabFrame.document.getElementById(tabId+"_TabBody_"+i);
			if (contentFrame)
			{
				if (contentWidth > 0)
					contentFrame.style.width = contentWidth + "px";
				if (contentHeight > 0)
					contentFrame.style.height = contentHeight + "px";
				if (contentFrame.style.display != "none")
				{	
					//IE may not introduce scrollbars if overflow isn't defaulted first
					contentFrame.setAttribute("tabindex", "0");
					contentFrame.style.overflow = "";
					contentFrame.style.overflow = "auto";
				}	
				if (styler && styler.showInfor3)
				{	
					contentFrame.style.minHeight = "";
					contentFrame.style.maxHeight = "";
				}				
			}
			else
				done = true;			
		}
		catch (e)
		{
			done = true;
		}
		i++;
	}
}

function uiButton(innerText, evtFunc, style, id, attrStr, titleStr)
{
	titleStr = titleStr || innerText;
	var str = '<button class="button" type="button" role="button" title="'+titleStr+'" aria-label="'+titleStr+'"'	
	str += (id) ? ' id="'+id+'"' : ''
	str += (style) ? ' style="'+style+'"' : ''
	str += (evtFunc) ? ' onclick="'+evtFunc+'"' : ''
	str += (attrStr) ? ' ' + attrStr : ''
	str += '>'+((innerText) ? innerText : '')+'</button>'
	return str;
}

function uiCheckmarkIcon(id, style)
{
	var toolTip = getSeaPhrase("CHECKMARK_ICON","SEA");
	var str = '<img border="0"';
	if (id)
		str += ' id="' + id + '"';
	str += ' class="checkmarkicon" styler="checkmarkicon" style="margin-right:5px';
	if (style)
		str += ';' + style;
	str += '" alt="'+toolTip+'" title="'+toolTip+'" index="" src="/lawson/xhrnet/ui/images/checkmark.gif">';
	return str;
}

function uiRequiredIcon(altStr, id)
{
	var toolTip = (altStr) ? altStr : getSeaPhrase("REQUIRED","ESS");
	return '<span style="margin-left:5px" styler="asterisk"'+((id)?' id="'+id+'"':'')+'><img class="requiredicon" border="0" alt="'+toolTip+'" title="'+toolTip+'" src="/lawson/xhrnet/ui/images/asterisk.gif"></span>';
}

function uiRequiredFooter()
{
	return '<div id="paneFooter" class="panefooter">'+uiRequiredIcon()+getSeaPhrase("REQUIRED","ESS")+'</div>';
}

function uiCalendarIcon()
{
	var toolTip = getSeaPhrase("DISPLAY_CAL","ESS");
	return '<span style="margin-left:5px;margin-top:5px"><img border="0" class="calendaricon" alt="'+toolTip+'" title="'+toolTip+'" border="0" src="/lawson/xhrnet/ui/images/ico_calendar.gif"></span>';
}

function uiSearchIcon()
{
	var toolTip = getSeaPhrase("SEARCH","ESS");
	return '<span style="margin-left:5px;margin-top:5px"><img border="0" class="searchicon" alt="'+toolTip+'" title="'+toolTip+'" border="0" src="/lawson/xhrnet/ui/images/ico_search2+FFFFFF.gif"></span>';
}

function toggleClass(classStr)
{
	if (!classStr || classStr == "")
		return " class=tablerowhighlight";
	else
		return "";
}

function uiDateString()
{
	var str = "";
	try 
	{
		switch (authUser.datefmt)
		{
			case "MMDDYYYY":
				str = getSeaPhrase("TWO_DIGIT_MONTH","ESS")+authUser.date_separator+getSeaPhrase("TWO_DIGIT_DAY","ESS")+authUser.date_separator+getSeaPhrase("FOUR_DIGIT_YEAR","ESS"); break;
			case "MMDDYY":
				str = getSeaPhrase("TWO_DIGIT_MONTH","ESS")+authUser.date_separator+getSeaPhrase("TWO_DIGIT_DAY","ESS")+authUser.date_separator+getSeaPhrase("TWO_DIGIT_YEAR","ESS"); break;
			case "DDMMYYYY":
				str = getSeaPhrase("TWO_DIGIT_DAY","ESS")+authUser.date_separator+getSeaPhrase("TWO_DIGIT_MONTH","ESS")+authUser.date_separator+getSeaPhrase("FOUR_DIGIT_YEAR","ESS"); break;
			case "DDMMYY":
				str = getSeaPhrase("TWO_DIGIT_DAY","ESS")+authUser.date_separator+getSeaPhrase("TWO_DIGIT_MONTH","ESS")+authUser.date_separator+getSeaPhrase("TWO_DIGIT_YEAR","ESS"); break;
			case "YYYYMMDD":
				str = getSeaPhrase("FOUR_DIGIT_YEAR","ESS")+authUser.date_separator+getSeaPhrase("TWO_DIGIT_MONTH","ESS")+authUser.date_separator+getSeaPhrase("TWO_DIGIT_DAY","ESS"); break;
			case "YYMMDD":
				str = getSeaPhrase("TWO_DIGIT_YEAR","ESS")+authUser.date_separator+getSeaPhrase("TWO_DIGIT_MONTH","ESS")+authUser.date_separator+getSeaPhrase("TWO_DIGIT_DAY","ESS"); break;
		}
	} catch(e) {}
	return str;
}

function uiDateFormatSpan(id)
{
	return '<span class="datestring"'+((id)?' id="'+id+'"':'')+'>'+uiDateString()+'</span>';
}

function uiDateToolTip(fldDesc)
{
	var lbl = "";
	var phraseWin = findPhraseWnd(true);
	if (fldDesc)
		try { lbl = fldDesc+' - '+phraseWin.getSeaPhrase("SELECT_DATE_FOR","ESS"); } catch(e) {}
	else
		try { lbl = phraseWin.getSeaPhrase("SELECT_DATE","ESS"); } catch(e) {}
	return lbl;
}

function activateTableRow(tableId,rowNbr,frameObj,isHeader,hasBorder)
{
	try 
	{
		var tblObj;
		var tblRows;
		var tblRow;
		var tblCells;
		if (!frameObj) frameObj = self;
		if (!isHeader) isHeader = false;
		if (typeof(hasBorder) == "undefined") hasBorder = true;
		rowNbr = parseInt(rowNbr,10)+1;
		tblObj = frameObj.document.getElementById(tableId);
		tblRows = tblObj.getElementsByTagName("tr");
		tblRow = tblRows[rowNbr];
		tblCells = tblRow.getElementsByTagName("td");
		// remove highlighting from previously clicked row
		if (tblObj.getAttribute("currentRow") || tblObj.getAttribute("currentRow") == "0")
		{
			var currRow = parseInt(tblObj.getAttribute("currentRow"),10);
			// do not select a row that is already active
			if (rowNbr == currRow) return false;
			var oldRow = tblRows[currRow];
			var oldCells = oldRow.getElementsByTagName("td");
			oldRow.className = "";
			oldCells[oldCells.length-1].className = (isHeader)?((hasBorder)?"plaintableheaderborder":"plaintableheader"):((hasBorder)?"plaintablecellborder":"plaintablecell");
			if (typeof(window[tableId+"_OnRowDeactivate"]) == "function")
			{
				if (!window[tableId+"_OnRowDeactivate"](currRow))
					return;
			}
		}
		// set highlighting on clicked row
		tblObj.setAttribute("currentRow",rowNbr);
		tblRow.className = "tablerowhighlight";
		tblCells[tblCells.length-1].className = (isHeader)?((hasBorder)?"plaintableheaderborderactive":"plaintableheaderactive"):((hasBorder)?"plaintablecellborderactive":"plaintablecellactive");
		if (typeof(window[tableId+"_OnRowActivate"]) == "function")
		{
			if (!window[tableId+"_OnRowActivate"](rowNbr))
				return;
		}
		return true;
	}
	catch(e) {}
}

function deactivateTableRows(tableId,frameObj,isHeader,hasBorder)
{
	try 
	{
		var tblObj;
		var tblRows;
		var tblRow;
		var tblCells;
		if (!frameObj) frameObj = self;
		if (!isHeader) isHeader = false;
		if (typeof(hasBorder) == "undefined") hasBorder = true;
		tblObj = frameObj.document.getElementById(tableId);
		tblObj.setAttribute("currentRow","");
		tblRows = tblObj.getElementsByTagName("tr");
		for (var i=0; i<tblRows.length; i++)
		{
			tblRow = tblRows[i];
			tblCells = tblRow.getElementsByTagName("td");
			if (tblRow.className) 
			{
				tblRow.className = "";
				tblCells[tblCells.length-1].className = (isHeader)?((hasBorder)?"plaintableheaderborder":"plaintableheader"):((hasBorder)?"plaintablecellborder":"plaintablecell");
			}
		}
		if (typeof(window[tableId+"_OnRowsDeactivate"])=="function")
		{
			if (!window[tableId+"_OnRowsDeactivate"]())
				return;
		}
	}
	catch(e) {}
}

function openHelpDialogWindow(URL, strHandle)
{
	try
	{
		if (strHandle) 
		{
			winHandle = window[strHandle];
			if (typeof(winHandle) == "undefined" || winHandle == null || winHandle.closed)
				winHandle = window.open(URL,strHandle.toUpperCase(),"width=325,height=400,left="+parseInt((screen.width/2)-150,10)+",top="+parseInt((screen.height/2)-250,10)+",resizable=yes,toolbar=no,scrollbars=auto");
			winHandle.focus();
			return;
		}
		if (typeof(helpDialog) == "undefined" || helpDialog == null || helpDialog.closed)
			helpDialog = window.open(URL,"HELP","width=325,height=400,left="+parseInt((screen.width/2)-150,10)+",top="+parseInt((screen.height/2)-250,10)+",resizable=yes,toolbar=no,scrollbars=auto");
		helpDialog.focus();
	}
	catch(e) {}
}

function setRequiredField(textBox, errorMsg, focusObj, alertMsg)
{	
	errorMsg = errorMsg || "";
	alertMsg = (typeof(alertMsg) == "boolean") ? alertMsg : true;
	var focusFnc = (focusObj && typeof(focusObj) == "function") ? focusObj : null;
	var focusFld = (focusObj && typeof(focusObj) != "function") ? focusObj : textBox;
	if (!textBox || !setStylerWnd(window))
		return;
	var textBoxCss = "requiredinputbox";
	if (typeof(window["styler"]) != "undefined" && window.styler)
	{
		var elmDoc = window.stylerWnd.StylerEMSS.getElementDocument(textBox);
		var elmWnd = ('defaultView' in elmDoc) ? elmDoc.defaultView : elmDoc.parentWindow;	
		if ((window.styler.showLDS || window.styler.showInfor) && textBox.nodeName.toLowerCase() == "select")
			textBox = elmDoc.getElementById(textBox.getAttribute("id")+"_comboboxinput");		
		if (window.styler.showLDS)
		{
			textBoxCss = "inputBoxError";
			if (textBox.nodeName.toLowerCase() == "input" && textBox.parentNode && textBox.parentNode.className != "")
			{
				if (textBox.parentNode.className.indexOf("inputBoxWrapper") != -1)
					textBox = textBox.parentNode;
				else if (textBox.parentNode.className.indexOf("radioButton") != -1)
					textBox = textBox.parentNode.parentNode;				
			}			
		}
		else if (window.styler.showInfor)
		{
			textBoxCss = "inforTextboxError";
			if (textBox.nodeName.toLowerCase() == "input" && textBox.parentNode && textBox.parentNode.className != "")
			{
				if (textBox.parentNode.className.indexOf("inforTextboxWrapper") != -1)
					textBox = textBox.parentNode;
				else if (textBox.parentNode.className.indexOf("inforRadioButton") != -1)
					textBox = textBox.parentNode.parentNode;				
			}			
		}
		else if (window.styler.showInfor3)
		{	
			var elmName = textBox.nodeName.toLowerCase();
			if (elmName != "input" && elmName != "select" && elmName != "textarea")
			{
				try
				{
					elmWnd.$(function () 
				    {
						var elms = elmWnd.$(textBox, elmDoc).find("textarea[styledAs]");
						if (elms.length == 0)
							elms = elmWnd.$(textBox, elmDoc).find("select[styledAs]");
						if (elms.length == 0)
							elms = elmWnd.$(textBox, elmDoc).find("input[styledAs]");
						if (elms.length > 0)
						{
							textBox = elms[0];
							elmName = textBox.nodeName.toLowerCase();
						}	
				    });
				}
				catch(e) {}
			}	
			if (elmName == "input" || elmName == "select" || elmName == "textarea")
			{
				scrollToFld(textBox);
				try
				{
					elmWnd.$(function () 
				    {
						elmWnd.$(textBox, elmDoc).validationMessage("show", errorMsg, alertMsg);
				    });
				}
				catch(e) {}	
				// if the validation message shows immediately, do not also show a message dialog
				alertMsg = false;
			}
			if (alertMsg && errorMsg)
				window.stylerWnd.seaAlert(errorMsg);
			return;			
		}
	}	
	var showDialog = (alertMsg && errorMsg) ? true : false;
	if (focusFnc)
		focusFnc();
	// dialog should have focus if displayed
	else if (focusFld && !showDialog)	
		setTimeout(function(){try{focusFld.focus();focusFld.select();}catch(e){}}, 500);
	if (showDialog)
		window.stylerWnd.seaAlert(errorMsg, "", null, null, focusFnc);	
	scrollToFld(textBox);
	if (textBox.className != "" && textBox.className.indexOf(textBoxCss) != -1)
		return;
	try { textBox.className += " " + textBoxCss; } catch(e) {}
}

function clearRequiredField(textBox)
{	
	if (!textBox || !setStylerWnd(window))
		return;
	var textBoxCss = "requiredinputbox";
	if (typeof(window["styler"]) != "undefined" && window.styler)
	{
		var elmDoc = window.stylerWnd.StylerEMSS.getElementDocument(textBox);
		var elmWnd = ('defaultView' in elmDoc) ? elmDoc.defaultView : elmDoc.parentWindow;
		if ((window.styler.showLDS || window.styler.showInfor) && textBox.nodeName.toLowerCase() == "select")
			textBox = elmDoc.getElementById(textBox.getAttribute("id")+"_comboboxinput");				
		if (window.styler.showLDS)
		{
			textBoxCss = "inputBoxError";
			if (textBox.nodeName.toLowerCase() == "input" && textBox.parentNode && textBox.parentNode.className != "")
			{
				if (textBox.parentNode.className.indexOf("inputBoxWrapper") != -1)
					textBox = textBox.parentNode;
				else if (textBox.parentNode.className.indexOf("radioButton") != -1)
					textBox = textBox.parentNode.parentNode;				
			}			
		}
		else if (window.styler.showInfor)
		{
			textBoxCss = "inforTextboxError";
			if (textBox.nodeName.toLowerCase() == "input" && textBox.parentNode && textBox.parentNode.className != "")
			{
				if (textBox.parentNode.className.indexOf("inforTextboxWrapper") != -1)
					textBox = textBox.parentNode;
				else if (textBox.parentNode.className.indexOf("inforRadioButton") != -1)
					textBox = textBox.parentNode.parentNode;				
			}			
		}
		else if (window.styler.showInfor3)
		{		
			var elmName = textBox.nodeName.toLowerCase();
			if (elmName != "input" && elmName != "select" && elmName != "textarea")
			{
				try
				{
					elmWnd.$(function () 
				    {
						var elms = elmWnd.$(textBox, elmDoc).find("textarea[styledAs]");
						if (elms.length == 0)
							elms = elmWnd.$(textBox, elmDoc).find("select[styledAs]");
						if (elms.length == 0)
							elms = elmWnd.$(textBox, elmDoc).find("input[styledAs]");
						if (elms.length > 0)
						{
							textBox = elms[0];
							elmName = textBox.nodeName.toLowerCase();
						}	
				    });
				}
				catch(e) {}	
			}	
			if (elmName == "input" || elmName == "select" || elmName == "textarea")
			{
				var elmDoc = window.stylerWnd.StylerEMSS.getElementDocument(textBox);
				var elmWnd = ('defaultView' in elmDoc) ? elmDoc.defaultView : elmDoc.parentWindow;								
				try
				{
					elmWnd.$(function () 
				    {
						elmWnd.$(textBox, elmDoc).validationMessage("remove");
				    });
				}
				catch(e) {}			
			}
			return;
		}	
	}	
	
	if (textBox.className != "" && textBox.className.indexOf(textBoxCss) == -1)
		return;
	try 
	{
		if (textBox.className != "")	
			textBox.className = textBox.className.replace(" " + textBoxCss, "");			
	}
	catch(e) {}
}

function scrollToFld(fldElm, scrollDiv)
{
	try
	{	
		if (!fldElm)
			return;
		if (!setStylerWnd(window))
			return;
		if (typeof(window["styler"]) != "undefined" && window.styler)
		{			
			var fldDoc = window.stylerWnd.StylerEMSS.getElementDocument(fldElm);
			var fldWnd = ('defaultView' in fldDoc) ? fldDoc.defaultView : fldDoc.parentWindow;
			var offsetTop;
			scrollDiv = scrollDiv || null;			
			if (window.styler.showInfor3)
			{
				offsetTop = fldWnd.$(fldElm, fldDoc).position().top;
				if (!scrollDiv)
				{	
					fldWnd.$('#paneBody:not(.inforHidden)', fldDoc).each(function() {
						var $elm = $(this);
					    if ($elm.css("overflow") == "auto")
					    {
					    	scrollDiv = this;	
					    	return false;
					    }	
					});
					if (!scrollDiv)
					{	
						fldWnd.$(fldElm, fldDoc).parents().find("div").each(function() {
							var $elm = $(this);
						    if ($elm.css("overflow") == "auto")
						    {
						    	scrollDiv = this;	
						    	return false;
						    }							
						});
					}		
				}
			}	
			else
			{
				offsetTop = fldElm.offsetTop || fldElm.parentNode.offsetTop;				
				if (!scrollDiv)
					scrollDiv = fldDoc.getElementById("paneBody");
			}	
			if (scrollDiv)
			{
				if (offsetTop < 0)
					offsetTop = 0;
				scrollDiv.scrollTop = offsetTop;	
			}	
		}
	}
	catch(e) {}
}

function displayHelpText(frameStr, whereId, hlpId, show)
{
	if (!document.getElementById) return;
	var frameObj = eval(frameStr);
	if (show)
		frameObj.document.getElementById(hlpId).style.left = "5px";
	else
		frameObj.document.getElementById(hlpId).style.left = "-9999px";
}

function setTaskHeader(frameNm, taskStr, taskGroup, hideFrame)
{
	var frameObj = window[frameNm];
	if (typeof(frameObj["styler"]) == "undefined" || frameObj.styler == null)
		frameObj.stylerWnd = findStyler(true);
	if (!frameObj.stylerWnd)
		return;
	if (typeof(frameObj.stylerWnd["StylerEMSS"]) == "function")
		frameObj.styler = new frameObj.stylerWnd.StylerEMSS();
	else
		frameObj.styler = frameObj.stylerWnd.styler;
	frameObj.theme = frameObj.stylerWnd.theme;	

	if ((frameObj.styler.showLDS || frameObj.styler.showInfor || frameObj.styler.showInfor3) && !frameObj.styler.titleBarExists(frameObj.parent))
		frameObj.stylePage(true, taskStr);
	else
		frameObj.stylePage(true);

	if (typeof(frameObj["styler"]) == "undefined" || !frameObj.styler || (!frameObj.styler.showLDS && !frameObj.styler.showInfor && !frameObj.styler.showInfor3))
	{	
		var imgPath = "/lawson/xhrnet/ui/images";
		var iconURL = "";
		// "LifeEvents", "Employment", "Personal", "Pay", "Training", "OrgChart",
		// "Retirement", "Credentials", "Benefits", "Career", "Stock", "Manager",
		// "TimeEntry", "Applicant", "NewHire"
		switch (taskGroup) 
		{
			case "LifeEvents": iconURL = imgPath + "/ico_life_events.gif"; break;
			case "Employment": iconURL = imgPath + "/ico_employment.gif"; break;
			case "Personal": iconURL = imgPath + "/ico_personal.gif"; break;
			case "Pay": iconURL = imgPath + "/ico_pay.gif"; break;
			case "Training": iconURL = imgPath + "/ico_training.gif"; break;
			case "OrgChart": iconURL = imgPath + "/ico_orgchart.gif"; break;
			case "Retirement": iconURL = imgPath + "/ico_retirement.gif"; break;
			case "Credentials": iconURL = imgPath + "/ico_credentials.gif"; break;
			case "Benefits": iconURL = imgPath + "/ico_benefits.gif"; break;
			case "Career": iconURL = imgPath + "/ico_career.gif"; break;
			case "Stock": iconURL = imgPath + "/ico_stock.gif"; break;
			case "Manager": iconURL = imgPath + "/ico_manager.gif"; break;
			case "TimeEntry": iconURL = imgPath + "/ico_time_entry.gif"; break;
			case "Applicant": iconURL = imgPath + "/ico_applicant.gif"; break;
			case "NewHire":	iconURL = imgPath + "/ico_newhire.gif"; break;
			case "Goal Management": iconURL = imgPath + "/ico_career.gif"; break;
			case "Perf Management": iconURL = imgPath + "/ico_career.gif"; break;
			default: iconURL = imgPath + "/ico_flying_house.gif"; break;
		}
		try 
		{
			if (iconURL) 
				frameObj.document.getElementById("taskIcon").innerHTML = '<img border="0" alt="'+taskStr+'" title="'+taskStr+'" src="'+iconURL+'"/>';
		} catch(e) {}
	}
	else if (typeof(window["styler"]) != "undefined")
	{
		window.styler.setTitleBarName(window, taskStr);
		if (window.styler.showLDS && typeof(window["getSeaPhrase"]) == "function" && typeof(window["authUser"]) != "undefined")
		{
			var msgStr = getSeaPhrase("WELCOME", "ESS");
			if (authUser.name)
				msgStr += ", " + authUser.name;
			window.styler.setTitleBarMessage(window, msgStr);
		}
		//hide the header frame if not theme 8; other themes create a title bar
		if (window.styler.showInfor3 || window.styler.showInfor || window.styler.showLDS)
		{
			document.getElementById(frameNm).style.display = "none";
			hideFrame = true;
		}	
	}	
	try { frameObj.document.getElementById("taskName").innerHTML = taskStr; } catch(e) {}	
	try 
	{
		if (hideFrame)
			document.getElementById(frameNm).style.visibility = "hidden";
		else
			document.getElementById(frameNm).style.visibility = "visible";
	}
	catch(e) {}
}

function setHelpRollover()
{
	try 
	{
		var phraseWin = findPhraseWnd(true);
		if (!phraseWin)
			return;
		var helpIcon = document.getElementById("paneHelpIcon");
		var helpToolTip = phraseWin.getSeaPhrase("HELP","ESS")+' '+window.stylerWnd.getSeaPhrase("OPENS_WIN","SEA");
		helpIcon.setAttribute("alt", helpToolTip);
		helpIcon.setAttribute("title", helpToolTip);
	}
	catch(e) {}
}

function getFrameLevel(wnd)
{
	wnd = wnd || window;
	var level = "2";
	try 
	{
		if (wnd.frameElement && wnd.frameElement.getAttribute("level") != null)
			level = ""+(parseInt(wnd.frameElement.getAttribute("level"),10)+1);
	}
	catch(e) {}
	return level;
}

function uiDetailTable(wnd, strHeading, strBody)
{
	wnd = wnd || window;
	var strHtml = '<table border="0" cellspacing="0" cellpadding="0" width="100%" role="presentation">'
	+ '<tr><td class="paneheaderlite" style="margin:0px;height:16px;padding-bottom:4px;padding-left:7px;padding-right:0px;padding-top:4px">'
	+ '<div class="paneheaderlite" style="margin:0px" role="heading" aria-level="'+getFrameLevel(wnd)+'">'+((strHeading)?strHeading:'&nbsp;')+'</div></td></tr>'
	+ '<tr><td><div class="panebodybordernested"><div class="panebodynested" style="overflow:hidden">'+((strBody)?strBody:'&nbsp;')+'</div></div></td></tr></table>';
	return strHtml;
}

function uiTable(wnd, strHeading, strBody)
{
	wnd = wnd || window;
	var strHtml = '<table border="0" cellspacing="0" cellpadding="0" width="100%" role="presentation">'
	+ '<tr><td class="paneheader" style="margin:0px;height:16px;padding-bottom:4px;padding-left:7px;padding-right:0px;padding-top:4px">'
	+ '<div class="paneheader" style="margin:0px" role="heading" aria-level="'+getFrameLevel(wnd)+'">'+((strHeading)?strHeading:'&nbsp;')+'</div></td></tr>'
	+ '<tr><td>'+((strBody)?strBody:'&nbsp;')+'</td></tr></table>';
	return strHtml;
}

function emptyStr(str)
{
	for (var i=0; i<str.length; i++)
	{
		if (str.charAt(i) != " ")
			return false;
	}
	return true;
}

function doFilter(filterForm, recordForm, recordElement, winRef, filterType)
{
	var selObj;
	var filterField = null;
	var filterOption = null;
	var keywords;
	var nbrRecords = null;
	if (!filterType)
		filterType = "select";
	if (!winRef)
		try { winRef = opener; } catch(e) {}
	// filter field - this is the field in DME's KEY or SELECT parameter
	selObj = filterForm.elements["filterField"];
	if (selObj.selectedIndex >= 0)
		filterField = selObj.options[selObj.selectedIndex];
	// filter option - this is used in DME's KEY or SELECT parameter
	selObj = filterForm.elements["filterOption"];
	if (selObj.selectedIndex >= 0)
		filterOption = selObj.options[selObj.selectedIndex].value;
	// keywords - this is the string to match
	keywords = filterForm.elements["keywords"].value;
	// nbr records - this is used for DME's MAX parameter
	selObj = recordForm.elements["nbrRecords"];
	if (selObj.getAttribute("type") != "text" && selObj.selectedIndex >= 0)
		nbrRecords = selObj.options[selObj.selectedIndex].value;
	else
		nbrRecords = parseInt(selObj.value, 10);
	var dmeFilter = new DMEFilterHandler();
	dmeFilter.setId(window.name);
	dmeFilter.setFilterType(filterType);
	dmeFilter.setLaunchedFrom(winRef);
	dmeFilter.setWindow(window);
	dmeFilter.setFieldNm(filterForm.elements["fieldNm"].value);
	dmeFilter.setFilterForm(filterForm);
	dmeFilter.setRecordForm(recordForm);
	dmeFilter.setRecordElement(recordElement);
	dmeFilter.setEnabled(true);
	if (filterField != null)
		dmeFilter.setFilterField(filterField.value, filterField.getAttribute("fieldSize"), filterField.getAttribute("isCode"), filterField.getAttribute("isNumeric"));
	if (filterOption != null)
		dmeFilter.setOption(filterOption);
	dmeFilter.setKeywords(keywords);
	if (filterOption != null)
		dmeFilter.setNbrRecords(nbrRecords);
	dmeFilter.setWindowTitle();
	dmeFilterFieldHash.put(dmeFilter);
    if (typeof(dmeFilter.getLaunchedFrom().validateDmeFieldFilter) != "undefined")
	{
		var retVal = dmeFilter.getLaunchedFrom().validateDmeFieldFilter(dmeFilter, filterForm);
		if (retVal == false)
			return false;
	}
	if (typeof(dmeFilter.getLaunchedFrom().performDmeFieldFilter) != "undefined")
	{
		dmeFilter.startProcessing();
		dmeFilter.getLaunchedFrom().performDmeFieldFilter(dmeFilter);
		return true;
	}
	return false;
}

function doPrevious(filterForm, recordForm, recordElement)
{
	var dmeFilter = dmeFilterFieldHash.get(filterForm.elements["fieldNm"].value);
	dmeFilter.isPrev = true;
	dmeFilter.isNext = false;
	var prevCall = dmeFilter.getPrev();
	if (prevCall != null)
	{
		prevCall = stripServerURLParams(prevCall);
		var frameRef = dmeFilter.getFrame();
		dmeFilter.startProcessing();
		dmeFilter.getWindow().document.getElementById("paneBody").style.visibility = "hidden";
		dmeFilter.getWindow().document.getElementById("paneRecords").style.visibility = "hidden";		
		frameRef.location.replace(prevCall);
	}
}

function doNext(filterForm, recordForm, recordElement)
{
	var dmeFilter = dmeFilterFieldHash.get(filterForm.elements["fieldNm"].value);
	dmeFilter.isNext = true;
	dmeFilter.isPrev = false;
	var nextCall = dmeFilter.getNext();
	if (nextCall != null)
	{
		nextCall = stripServerURLParams(nextCall);
		var frameRef = dmeFilter.getFrame();
		dmeFilter.startProcessing();
		dmeFilter.getWindow().document.getElementById("paneBody").style.visibility = "hidden";
		dmeFilter.getWindow().document.getElementById("paneRecords").style.visibility = "hidden";		
		frameRef.location.replace(nextCall);
	}
}

function stripServerURLParams(urlStr)
{
	var urlParams = urlStr.split("&");
	var newParams = new Array();
	var serverParam = new Array();
	serverParam["USER"] = false;
	serverParam["HTTPS"] = false;
	serverParam["SERVER_NAME"] = false;
	serverParam["SERVER_PORT"] = false;
	var len = urlParams.length;
	for (var i=0; i<len; i++)
	{
		var foundDup = false;
		var keyVal = urlParams[i].split("=");
		if (typeof(serverParam[keyVal[0]]) != "undefined")
		{
			if (serverParam[keyVal[0]] == true)
				foundDup = true;
			serverParam[keyVal[0]] = true;
		}
		if (!foundDup)
			newParams[newParams.length] = urlParams[i];
	}
	return newParams.join("&");
}

var dmeDefaultFilterOptions = new Array("contains", "starts with", "is");
//var dmeAlphaFilterOptions = new Array("contains", "starts with", "is");
var dmeAlphaFilterOptions = new Array("contains", "is");
var dmeNumericFilterOptions = new Array("is");
var currentFilterOptions = dmeDefaultFilterOptions;

function getFilterOptionTranslation(optVal)
{
	var phraseWin = findPhraseWnd(true);
	if (!phraseWin)
		return optVal;
	var retVal = optVal;
	switch (optVal)
	{
		case "contains": retVal = phraseWin.getSeaPhrase("CONTAINS", "ESS"); break;
		case "starts with": retVal = phraseWin.getSeaPhrase("STARTS_WITH", "ESS"); break;
		case "is": retVal = phraseWin.getSeaPhrase("IS", "ESS"); break;
		default : break;
	}
	return retVal;
}

function setFilterOptions(fieldNm, selectedFld, selObj)
{
	var dmeFilter = dmeFilterFieldHash.get(fieldNm);
	var fldObj = dmeFilter.getFilterFieldObject(selectedFld);
	var isNumeric = (fldObj && (fldObj.getAttribute("isNumeric") == "true"));
	var filterOpts;
	if (isNumeric)
		filterOpts = dmeNumericFilterOptions;
	else
		filterOpts = dmeAlphaFilterOptions;
	if (fldObj && (isNaN(parseInt(fldObj.getAttribute("fieldSize"), 10)) == false)) 
	{
		var fieldSize = parseInt(fldObj.getAttribute("fieldSize"), 10);
		var filterForm = dmeFilter.getFilterForm();	
		var keywords = filterForm.elements["keywords"];
		//keywords.size = String(fieldSize);
		keywords.maxLength = String(fieldSize);
		if (isNumeric && isNaN(Number(keywords.value)))
			keywords.value = "";		
		else if (keywords.value.length > fieldSize)
			keywords.value = keywords.value.substring(0, fieldSize);
	}
	if (currentFilterOptions != filterOpts) 
	{
		currentFilterOptions = filterOpts;
		selObj.innerHTML = "";
		for (var i=0; i<filterOpts.length; i++) 
		{
			var tmpObj = document.createElement("OPTION");
			tmpObj.value = filterOpts[i];
			tmpObj.text = getFilterOptionTranslation(filterOpts[i]);
			if (navigator.appName.indexOf("Microsoft") >= 0)
				selObj.add(tmpObj);
			else
				selObj.appendChild(tmpObj);
		}
		if (dmeFilter.getEnabled())
		{
			var winRef = dmeFilter.getWindow();
			winRef.styleElement(selObj);
		}
	}
	if (typeof(dmeFilter.getLaunchedFrom().performDmeFieldFilterOnChange) != "undefined")
	{
		dmeFilter.getLaunchedFrom().performDmeFieldFilterOnChange(dmeFilter);
		return true;
	}	
}

function filterDmeCallDone(fieldNm)
{
	var dmeFilter = dmeFilterFieldHash.get(fieldNm);
	if (dmeFilter != null) 
	{
		drawDmeFieldFilterContent(dmeFilter);
		dmeFilter.setRecordParams();
		// if the keywords were set parametrically, display them in the text box
		var filterWnd = dmeFilter.getWindow();
		var filterForm = dmeFilter.getFilterForm();
		var keywords = filterForm.elements["keywords"];
		if (keywords.value != dmeFilter.getKeywords())
			keywords.value = dmeFilter.getKeywords();
		if (dmeFilter.getEnabled())
		{
			dmeFilter.setStyled(true);			
			filterWnd.stylePage();
			filterWnd.document.getElementById("paneBody").style.visibility = "visible";
			filterWnd.document.getElementById("paneRecords").style.visibility = "visible";
			filterWnd.fitToScreen();
			filterWnd.document.body.style.visibility = "visible";			
		}
		var msg = getSeaPhrase("CNT_UPD_WND","SEA",[dmeFilter.getWindow().getWinTitle()]);
		try
		{
			if (dmeFilter.getWindow().frameElement)
				msg = getSeaPhrase("CNT_UPD_FRM","SEA",[dmeFilter.getWindow().getWinTitle()]);
		}
		catch(e) {}
		dmeFilter.doneProcessing(msg);	
	}
}

function dmeFilterOnLoad(filterForm, recordForm, recordElement, winRef, filterType)
{	
	if (!filterType)
		filterType = "select";
	var winElm;
	if (winRef)
		winElm = (navigator.appName.indexOf("Microsoft") >= 0) ? winRef.document.body : winRef;
	else 
	{
		winRef = opener;
		winElm = (navigator.appName.indexOf("Microsoft") >= 0) ? opener.document.body : opener.window;
	}
	if (winRef == opener) 
	{
		try 
		{
			if (opener.document.body.getAttribute("onunload")) 
			{
				winElm.onunload = function() 
				{
					opener.document.body.getAttribute("onunload");
					window.close();
				};
			} 
			else
				winElm.onunload = function() {window.close();};
		} catch(e) {}
	}
	document.getElementById("paneBody").style.visibility = "hidden";
	document.getElementById("paneRecords").style.visibility = "hidden";
	var dmeFilter = new DMEFilterHandler();
	dmeFilter.setId(window.name);
	dmeFilter.setFilterType(filterType);
	dmeFilter.setLaunchedFrom(winRef);
	dmeFilter.setWindow(window);
	dmeFilter.setFieldNm(filterForm.elements["fieldNm"].value);
	dmeFilter.setFilterForm(filterForm);
	dmeFilter.setRecordForm(recordForm);
	dmeFilter.setRecordElement(recordElement);
	// filter option
	var selObj = filterForm.elements["filterOption"];
	filterOption = selObj.options[selObj.selectedIndex].value;
	dmeFilter.setOption(filterOption);
	// nbr records - this is used for DME's MAX parameter
	var selObj = recordForm.elements["nbrRecords"];
	if (selObj.getAttribute("type") != "text")
		nbrRecords = selObj.options[selObj.selectedIndex].value;
	else
		nbrRecords = selObj.value;
	dmeFilter.setNbrRecords(nbrRecords);
	dmeFilter.setNbrRecordsView();
	dmeFilter.setWindowTitle();
	dmeFilterFieldHash.put(dmeFilter);
	var filterReturn = false;
	if (typeof(dmeFilter.getLaunchedFrom().performDmeFieldFilterOnLoad) != "undefined")
	{
		filterReturn = dmeFilter.getLaunchedFrom().performDmeFieldFilterOnLoad(dmeFilter);
		if (filterReturn != false)
			dmeFilter.enable();
	}	
	if (filterReturn != false)
		return true;
	else
		return false;
}

function dmeFieldToolTip(fieldNm)
{
	var lbl = "";
	var phraseWin = findPhraseWnd(true);
	if (typeof(getDmeFieldElement) != "undefined")
	{		
		var fldObj = getDmeFieldElement(fieldNm);
		var fldDesc = fldObj[2];
		if (fldDesc)
			try { lbl = fldDesc+' - '+phraseWin.getSeaPhrase("VALUE_SELECT_FOR","ESS"); } catch(e) {}
	}
	else
		try { lbl = fieldNm+' - '+phraseWin.getSeaPhrase("VALUE_SELECT_FOR","ESS"); } catch(e) {}
	return lbl;
}

function createFilterIFrame(wnd, frameName)
{
	wnd = wnd || window;
	frameName = frameName || "filterselectiframe";
	if (wnd.document.getElementById(frameName))
		frameElm = wnd.document.getElementById(frameName);
	else
	{		
		frameElm = wnd.document.createElement("iframe");
		frameElm.setAttribute("frameborder", "no");
		frameElm.setAttribute("frameBorder", "no");
		frameElm.setAttribute("marginwidth", "0");
		frameElm.setAttribute("marginheight", "0");
		frameElm.setAttribute("scrolling", "no");
		frameElm.setAttribute("name", "filterselectiframe");
		frameElm.setAttribute("id", "filterselectiframe");
		var phraseWin = findPhraseWnd(true);
		if (phraseWin)
			frameElm.setAttribute("title", phraseWin.getSeaPhrase("VALUE_SELECT","ESS"));
		frameElm.style.position = "absolute";
		frameElm.style.backgroundColor = "#ffffff";
		frameElm.style.left = "0px";
		frameElm.style.top = "0px";
		frameElm.style.width = "100%";
		frameElm.style.height = "97%";
		frameElm.style.zIndex = "99999";
		wnd.document.body.appendChild(frameElm);		
	}
	frameElm.style.visibility = "visible";
	frameElm.style.display = "";
	return frameElm;
}

function positionFilterIFrame(wnd, frameElm, fieldNm)
{
	wnd = wnd || window;
	if (typeof(wnd["getDmeFieldElement"]) == "function")
	{
		var fldObj = wnd.getDmeFieldElement(fieldNm);
		var fldWin = fldObj[0];
		var inputFld = fldObj[1];
		if (fldWin && inputFld && typeof(fldWin["PositionObject"]) != "undefined")
		{
			if (typeof(wnd["styler"]) == "undefined" || wnd.styler == null)
				wnd.stylerWnd = findStyler(true);
			if (!wnd.stylerWnd)
				return;
			if (typeof(wnd.stylerWnd["StylerEMSS"]) == "function")
				wnd.styler = new wnd.stylerWnd.StylerEMSS();
			else
				wnd.styler = wnd.stylerWnd.styler;			
			var inputFldPos = fldWin.PositionObject.getInstance(inputFld);
			var frameTop = 0;
			var frameLeft = 0;
			try 
			{
				if (fldWin.frameElement && fldWin != wnd.stylerWnd)
				{	
					var framePos = fldWin.PositionObject.getInstance(fldWin.frameElement);
					frameTop += framePos.thetop;
					frameLeft += framePos.left;
				}
			} 
			catch(e) {};
			var filterWidth = 550;
			var filterHeight = 263;
			var leftPadding = 0;
			var rightPadding = 0;
			var topPadding = 0;
			frameElm.style.border = "1px solid #707070";
			if (wnd.styler.showInfor3)
			{
				frameElm.style.border = "1px solid #999999";
				leftPadding = (wnd.styler.textDir == "rtl") ? 22 : 3;
				if (navigator.appName.indexOf("Microsoft") >= 0)
					leftPadding -= 3;
				rightPadding = 10;
				topPadding = 2;
			}	
			else if (wnd.styler.showInfor)
			{
				leftPadding = (wnd.styler.textDir == "rtl") ? 15 : 2;
				rightPadding = 10;
			}
			else if (wnd.styler.showLDS)
			{
				leftPadding = 5;
				rightPadding = -1;
				topPadding = 1;
			}
			var topPos = frameTop + inputFldPos.thetop + inputFldPos.height;
			if (navigator.appName.indexOf("Microsoft") >= 0)
				topPos += topPadding;
			frameElm.style.top = topPos + "px";
			var leftPos = frameLeft + inputFldPos.left - leftPadding;
			if (leftPos < 0)
				leftPos = 0;
			frameElm.style.left = leftPos + "px";
			frameElm.style.width = filterWidth + "px";
			frameElm.style.height = filterHeight + "px";
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
			// if the right side is clipped by the window, shift left
			var leftSpace = frameLeft + inputFldPos.left - leftPadding;
			var rightSpace = windowWidth - (leftSpace + filterWidth);
			leftPos = leftSpace;
			if (rightSpace < 0)
			{
				leftPos = frameLeft + inputFldPos.right - filterWidth;
				if (wnd.styler.textDir != "rtl")
					leftPos += (leftPadding + rightPadding);
				if (leftPos < 0)
					leftPos = 0;
				frameElm.style.left = leftPos + "px";
			}
			// if filter will not fit down put it on top
			var topSpace = frameTop + inputFldPos.thetop;
			var bottomSpace = windowHeight - (topSpace + inputFldPos.height);
			if (bottomSpace < filterHeight && topSpace >= filterHeight)
			{
				var topPos = topSpace - filterHeight - topPadding;				
				if (topPos >= 0)
					frameElm.style.top = topPos + "px";	
			}				
		}
	}
}		

function openDmeFieldFilter(fieldNm, noProcessing)
{
	var nextFunc = function()
	{
		getConfig();
		var filterNode = emssObjInstance.emssObj.getConfigSettingNode("filter_select");
		if (filterNode != null && filterNode.getAttribute("pinned") != null && filterNode.getAttribute("pinned").toLowerCase() == "false")
		{
			var urlStr = "/lawson/xhrnet/ui/filter.htm?recs="+escape(filterNode.getAttribute("recs_per_page"),1);
			if (typeof(fieldNm) != "undefined")
				urlStr += "&fieldNm="+escape(fieldNm.toString(),1);
			try 
			{
				filterWin = window.open(urlStr,window.name+"filter","left="+parseInt((screen.width/2)-150,10)+",top="+parseInt((screen.height/2)-250,10)+",width=450,height=263,resizable=yes,toolbar=no,scrollbars=auto");
				filterWin.focus();
			} catch(e) {}
		}
		else
		{
			var frameElm = createFilterIFrame();
			filterWin = window.frames["filterselectiframe"];
			positionFilterIFrame(window, frameElm, fieldNm);	
			openDmeListFieldFilter("filterselectiframe", fieldNm, noProcessing);
		}	
	};
	if (!noProcessing) 
	{
		startProcessing(getSeaPhrase("RETRIEVING_RECORDS","ESS"), nextFunc);
		try { setTimeout("stopProcessing()", 30000); } catch(e) {}
	}
	else
		nextFunc();	
}

function closeDmeFieldFilter()
{
	try 
	{
		if ((typeof(filterWin) != "undefined") && (typeof(filterWin) != "unknown") && !filterWin.closed)
			filterWin.close();
	} catch(e) {}
}

function openDmeListFieldFilter(frameNm, fieldNm, noProcessing)
{
	var nextFunc = function()
	{
		getConfig();
		var filterNode = emssObjInstance.emssObj.getConfigSettingNode("filter_select");
		var nbrRecs = (filterNode != null) ? filterNode.getAttribute("recs_per_page") : "25";
		var urlStr = "/lawson/xhrnet/ui/list.htm?recs="+escape(nbrRecs,1);	
		if (typeof(fieldNm) != "undefined")
			urlStr += "&fieldNm="+escape(fieldNm.toString(),1);
		var frameObj = window.frames[frameNm];
		frameObj.location.replace(urlStr);		
	};
	if (!noProcessing)
	{	
		startProcessing(getSeaPhrase("RETRIEVING_RECORDS","ESS"), nextFunc);
		try { setTimeout("stopProcessing()", 30000); } catch(e) {}
	}	
	else
		nextFunc();
}

function openFieldValueList(fieldNm, noProcessing)
{
	var nextFunc = function()
	{
		var urlStr = "/lawson/xhrnet/ui/valuelist.htm"
		if (typeof(fieldNm) != "undefined")
			urlStr += "?fieldNm="+escape(fieldNm.toString(),1);	
		getConfig();
		var filterNode = emssObjInstance.emssObj.getConfigSettingNode("filter_select");
		if (filterNode != null && filterNode.getAttribute("pinned") != null && filterNode.getAttribute("pinned").toLowerCase() == "false")
		{	
			try 
			{
				filterWin = window.open(urlStr,window.name+"filter","left="+parseInt((screen.width / 2)-150,10)+",top="+parseInt((screen.height/2)-250,10)+",width=450,height=263,resizable=yes,toolbar=no,scrollbars=auto");
				filterWin.focus();
			} catch(e) {}
		}
		else
		{
			var frameElm = createFilterIFrame();
			filterWin = window.frames["filterselectiframe"];
			positionFilterIFrame(window, frameElm, fieldNm);
			filterWin.location.replace(urlStr);		
		}
	};
	if (!noProcessing) 
	{
		startProcessing(getSeaPhrase("RETRIEVING_RECORDS","ESS"), nextFunc);
		try { setTimeout("stopProcessing()", 30000); } catch(e) {}
	}	
	else
		nextFunc();
}

function filterDmeCall(dmeFilter, frameNm, fileNm, indexNm, fields, keys, condExpr, selectExpr, nbrRecs, otmNbrRecs)
{
	dmeFilter.setFrame(window.frames[frameNm]);
	dmeFilterFieldHash.put(dmeFilter);
	var fieldNm = dmeFilter.getFieldNm();
	var dmeObj = new DMEObject(authUser.prodline, String(fileNm));
	dmeObj.out = "JAVASCRIPT";
	dmeObj.index = String(indexNm);
	dmeObj.field = String(fields);
	dmeObj.key = String(keys);
	dmeObj.max = String(nbrRecs);
	dmeObj.func = "filterDmeCallDone('"+fieldNm+"')";
	dmeObj.exclude = "drills;keys";
	dmeObj.debug = false;
	if (typeof(condExpr) != "undefined" && condExpr)
		dmeObj.cond = String(condExpr);
	if (typeof(selectExpr) != "undefined" && selectExpr)
		dmeObj.select = String(selectExpr);
	if (typeof(otmNbrRecs) != "undefined" && otmNbrRecs)
		dmeObj.otmmax = String(otmNbrRecs);
	var msg = getSeaPhrase("CNT_UPD_WND","SEA",[dmeFilter.getWindow().getWinTitle()]);
	try
	{
		if (dmeFilter.getWindow().frameElement)
			msg = getSeaPhrase("CNT_UPD_FRM","SEA",[dmeFilter.getWindow().getWinTitle()]);
	}
	catch(e) {}	
	setTimeout(function(){try{dmeFilter.doneProcessing(msg);}catch(e){}}, 10000);	
	DME(dmeObj, frameNm);
}

// Global singleton hash array of DME filters created.
var dmeFilterFileInstance = findDmeFilterHash(true, self);
var dmeFilterFieldHash = new DMEFilterHash();

//-----------------------------------------------------------------------------
function findDmeFilterHash(searchOpener, ref)
{
	if (!ref)
		ref = self;
	try
	{
		if (ref != ref.parent)
		{
			if (typeof(ref.parent.dmeFilterFileInstance) != "undefined")
			{
				if (ref.parent.dmeFilterFileInstance != null)
					return ref.parent.dmeFilterFileInstance;
				else
					return ref.parent;
			}
			else
				return findDmeFilterHash(searchOpener, ref.parent);
		}
	}
	catch (e) {}
	try
	{
		if (searchOpener && ref.opener)
		{
			if (typeof(ref.opener.dmeFilterFileInstance) != "undefined")
			{
				if (ref.opener.dmeFilterFileInstance != null)
					return ref.opener.dmeFilterFileInstance;
				else
					return ref.opener;
			}
			else
				return findDmeFilterHash(searchOpener, ref.opener);
		}
	}
	catch (e) {}
	return null;
}

//-----------------------------------------------------------------------------
//-- start DMEFilterHash object code
function DMEFilterHash()
{
	// only allow 1 instance of this object
	if (DMEFilterHash._singleton && DMEFilterHash._singleton.filters && DMEFilterHash._singleton.filters.length)
		return DMEFilterHash._singleton;
	else
	{
		// try to get objects from 1 instance of this file
		DMEFilterHash._singleton = this;
		try
		{
			if (dmeFilterFileInstance && dmeFilterFileInstance.DMEFilterHash && dmeFilterFileInstance.DMEFilterHash._singleton && dmeFilterFileInstance.DMEFilterHash._singleton.filters && dmeFilterFileInstance.DMEFilterHash._singleton.filters.length)
				this.filters = dmeFilterFileInstance.DMEFilterHash._singleton.filters;
			else
				this.filters = new Array();
		}
		catch(e)
		{
			this.filters = new Array();
		}
	}
}

//-----------------------------------------------------------------------------
DMEFilterHash.prototype.put = function(filter)
{
	this.filters[filter.getFieldNm()] = filter;
    // if this is executed from the filter select window, put the filter
	// back into the hash array in the window it was launched from
	if (filter.getLaunchedFrom() != self) 
	{
		var filterHash = filter.getLaunchedFrom().dmeFilterFieldHash;
		filterHash.filters[filter.getFieldNm()] = filter;
	}
}

//-----------------------------------------------------------------------------
DMEFilterHash.prototype.get = function(fieldNm)
{
	try
	{
		return this.filters[fieldNm];
	}
	catch(e)
	{
		return null;
	}
}

DMEFilterHash.prototype._singleton = null;

function DMEFilterField(field, size, isCode, isNumeric)
{
	if (typeof(field) != "undefined")
		this.field = field;
	else
		this.field = null;
	if (typeof(size) != "undefined")
		this.size = size;
	else
		this.size = 0;
	if (typeof(isCode) != "undefined" && eval(isCode))
		this.isCode = true;
	else
		this.isCode = false;
	if (typeof(isNumeric) != "undefined" && eval(isNumeric))
		this.isNumeric = true;
	else
		this.isNumeric = false;
}

function DMEDataMiner()
{
	this.frameNm = null;
	this.fileNm = null;
	this.indexNm = null;
	this.fields = "";
	this.keys = "";
	this.condExpr = null;
	this.selectExpr = null;
	this.nbrRecs = 25;
	this.otmNbrRecs = null;
}

//-----------------------------------------------------------------------------
//-- start DMEFilterHandler object code
function DMEFilterHandler()
{
	this.id = null;
	this.filterField = new DMEFilterField();
	this.option = null;
	this.keywords = "";
	this.nbrRecords = "25";
	this.filterForm = null;
	this.recordForm = null;
	this.recordElement = null;
	this.launchedFrom = self;
	this.fieldNm = null;
	this.docRef = document;
	this.winRef = window;
	this.next = null;
	this.prev = null;
	this.recordCount = 0;
	this.isNext = false;
	this.isPrev = false;
	this.frame = null;
	this.filterFields = new Array();
	this.dataMiner = new DMEDataMiner();
	this.filterType = "select";
	this.enabled = false;
	this.styled = false;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setId = function(id)
{
	this.id = id;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getId = function()
{
	return this.id;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setFilterField = function(filterField, fieldSize, isCode, isNumeric)
{
	this.filterField = new DMEFilterField(filterField, fieldSize, isCode, isNumeric);
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getFilterField = function()
{
	return this.filterField;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setOption = function(option)
{
	this.option = option;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getOption = function()
{
	return this.option;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setKeywords = function(keywords)
{
	this.keywords = keywords;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getKeywords = function()
{
	return this.keywords;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setNbrRecords = function(nbrRecords)
{
	this.nbrRecords = nbrRecords;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getNbrRecords = function()
{
	return this.nbrRecords;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setRecordCount = function(recordCount)
{
	this.recordCount = recordCount;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getRecordCount = function()
{
	return this.recordCount;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setFilterForm = function(filterForm)
{
	this.filterForm = filterForm;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getFilterForm = function()
{
	return this.filterForm;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setRecordForm = function(recordForm)
{
	this.recordForm = recordForm;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getRecordForm = function()
{
	return this.recordForm;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setRecordElement = function(recordElement)
{
	this.recordElement = recordElement;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getRecordElement = function()
{
	return this.recordElement;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setFilterType = function(filterType)
{
	this.filterType = filterType;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getFilterType = function()
{
	return this.filterType;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setLaunchedFrom = function(launchedFrom)
{
	this.launchedFrom = launchedFrom;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getLaunchedFrom = function()
{
	return this.launchedFrom;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setFieldNm = function(fieldNm)
{
	this.fieldNm = fieldNm;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getFieldNm = function()
{
	return this.fieldNm;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setDocument = function(docRef)
{
	this.docRef = docRef;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getDocument = function()
{
	return this.docRef;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setWindow = function(winRef)
{
	this.winRef = winRef;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getWindow = function()
{
	return this.winRef;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setWindowTitle = function(lbl)
{
	var phraseWin = findPhraseWnd(true);
	if (!lbl && this.launchedFrom && this.fieldNm)
	{
		var getFieldElm = (this.filterType == "valuelist") ? this.launchedFrom.getValueListFieldElement : this.launchedFrom.getDmeFieldElement;
		var fldObj = getFieldElm(this.fieldNm);
		var fldDesc = fldObj[2];
		if (fldDesc)
			try { lbl = fldDesc+' - '+phraseWin.getSeaPhrase("VALUE_SELECT_FOR","ESS"); } catch(e) {}
	}
	if (!lbl)
		try { lbl = phraseWin.getSeaPhrase("VALUE_SELECT_FOR","ESS"); } catch(e) {}
	this.winRef.setWinTitle(lbl);
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setNext = function(next)
{
	this.next = next;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getNext = function()
{
	return this.next;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setPrev = function(prev)
{
	this.prev = prev;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getPrev = function()
{
	return this.prev;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.isPrev = function()
{
	return this.isPrev;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.isNext = function()
{
	return this.isNext;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setFrame = function(frame)
{
	this.frame = frame;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getFrame = function()
{
	return this.frame;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setEnabled = function(enabled)
{
	this.enabled = enabled;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getEnabled = function()
{
	return this.enabled;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setStyled = function(styled)
{
	this.styled = styled;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getStyled = function()
{
	return this.styled;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setDataMiner = function(frameNm, fileNm, indexNm, fields, keys, condExpr, selectExpr, nbrRecs, otmNbrRecs)
{
	this.dataMiner = new DMEDataMiner();
	this.dataMiner.frameNm = frameNm;
	this.dataMiner.fileNm = fileNm;
	this.dataMiner.indexNm = indexNm;
	this.dataMiner.fields = fields;
	this.dataMiner.keys = keys;
	this.dataMiner.condExpr = condExpr;
	this.dataMiner.selectExpr = selectExpr;
	this.dataMiner.nbrRecs = nbrRecs;
	this.dataMiner.otmNbrRecs = otmNbrRecs;
	this.setFrame(this.launchedFrom.frames[frameNm]);
	dmeFilterFieldHash.put(this);
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getDataMiner = function()
{
	return this.dataMiner;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setRecordParams = function(nbrRecs)
{
	var nbrRecords = Number(this.getNbrRecords());
	var frameRef = this.getFrame();
	var nbrRecsFound = (typeof(nbrRecs) != "undefined") ? nbrRecs : frameRef.NbrRecs;
	if (frameRef.Next)
	{
		this.setNext(frameRef.Next);
		this.enableNextBtn();
	}
	else
	{
		this.setNext(null);
		this.disableNextBtn();
	}
	if (frameRef.Prev)
	{
		// Work around a DME servlet bug; when performing a previous call, if there
		// is no previous page of records but DME returned a Prev query, ignore it.
		if ((this.isPrev) && ((this.getRecordCount() - nbrRecords) == nbrRecords))
		{
			this.setPrev(null);
			this.disablePrevBtn();
		}
		else
		{
			this.setPrev(frameRef.Prev);
			this.enablePrevBtn();
		}
	}
	else
	{
		this.setPrev(null);
		this.disablePrevBtn();
	}
	if (this.isPrev)
	{
		if ((this.getRecordCount() - nbrRecords) < 0)
			this.setRecordCount(0);
		else
			this.setRecordCount(this.getRecordCount() - nbrRecords);
	}
	else
		this.setRecordCount(this.getRecordCount() + nbrRecords);
	if (this.getRecordCount() > 0)
	{
		if (nbrRecsFound < nbrRecords)
			this.setEndRecordNbr(this.getRecordCount() - nbrRecords + nbrRecsFound);
		else
			this.setEndRecordNbr(this.getRecordCount());
		if (Number(this.getEndRecordNbr()) == 0)
			this.setBeginRecordNbr(0);
		else
			this.setBeginRecordNbr(this.getRecordCount() - nbrRecords + 1);		
	}
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.addFilterField = function(filterField, fieldSize, fieldDesc, isCode, isNumeric)
{
	if (!this.filterFields[filterField])
	{
		var selObj = this.filterForm.elements["filterField"];
		var optObj = document.createElement("OPTION");
		optObj.value = filterField;
		optObj.text = fieldDesc;
		optObj.setAttribute("fieldSize", String(fieldSize));
		if (typeof(isCode) != "undefined")
			optObj.setAttribute("isCode", String(isCode));
		else
			optObj.setAttribute("isCode", "false");
		if (typeof(isNumeric) != "undefined")
			optObj.setAttribute("isNumeric", String(isNumeric));
		else
			optObj.setAttribute("isNumeric", "false");
		if (navigator.appName.indexOf("Microsoft") >= 0)
			selObj.add(optObj);
		else
			selObj.appendChild(optObj);
		this.filterFields[filterField] = optObj;
	}
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.isFilterField = function(filterField)
{
	if (this.filterFields[filterField])
		return true;
	else
		return false;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getFilterFieldObject = function(filterField)
{
	if (!this.filterFields[filterField])
	{
		var filterOptions = this.filterForm.elements['filterField'].options;
		var i = 0;
		var found = false;
		var len = filterOptions.length;
		while ((i < len) && (found == false))
		{
			if (filterOptions[i].value == filterField)
			{
				found = true;
				this.filterFields[filterField] = filterOptions[i];
				return filterOptions[i];
			}
			i++;
		}
		return null;
	}
	else
		return this.filterFields[filterField];
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.enableFilterControls = function()
{
	try { this.filterForm.elements["filterBtn"].disabled = ""; } catch(e) {}
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.enable = function()
{
	var filterField = this.filterForm.elements["filterField"];
	var selectedField = null;
	if (filterField.selectedIndex >= 0)
		selectedField = filterField.options[filterField.selectedIndex].value;
	setFilterOptions(this.filterForm.elements["fieldNm"].value, selectedField, this.filterForm.elements["filterOption"]);
	this.enableFilterControls();
	this.setEnabled(true);
	if (!this.getStyled())
	{
		this.setStyled(true);	
		this.winRef.stylePage();
		this.winRef.document.getElementById("paneBody").style.visibility = "visible";
		this.winRef.document.getElementById("paneRecords").style.visibility = "visible";
		this.winRef.fitToScreen();
		this.winRef.document.body.style.visibility = "visible";
		try
		{
			if (this.winRef.frameElement && this.winRef.frameElement.getAttribute("name") == "filterselectiframe")
			{	
				this.winRef.frameElement.style.display = "";
				this.winRef.frameElement.style.visibility = "visible";
			}	
		}
		catch(e) {}
		setTimeout(function(){focusElement(filterForm.elements["filterField"]);}, 500);	
	}
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.enableNextBtn = function()
{
	try
	{
		var filterBtn = this.docRef.getElementById("nextFilterBtn");
		if (this.filterType == "list") 
		{
			if (filterBtn.className == "filterListButtonDisabled")
				filterBtn.className = "filterListButton";
		} 
		else 
		{
			if (filterBtn.className == "filterButtonDisabled")		
				filterBtn.className = "filterButton";
		}
		filterBtn.disabled = "";
	}
	catch(e) {}
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.disableNextBtn = function()
{
	try
	{
		var filterBtn = this.docRef.getElementById("nextFilterBtn");
		if (this.filterType == "list") 
		{
			if (filterBtn.className == "filterListButton")
				filterBtn.className = "filterListButtonDisabled";
		} 
		else 
		{
			if (filterBtn.className == "filterButton")		
				filterBtn.className = "filterButtonDisabled";
		}		
		filterBtn.disabled = "disabled";
	}
	catch(e) {}
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.enablePrevBtn = function()
{
	try
	{
		var filterBtn = this.docRef.getElementById("prevFilterBtn");
		if (this.filterType == "list") 
		{
			if (filterBtn.className == "filterListButtonDisabled")
				filterBtn.className = "filterListButton";
		} 
		else 
		{
			if (filterBtn.className == "filterButtonDisabled")		
				filterBtn.className = "filterButton";
		}		
		filterBtn.disabled = "";
	}
	catch(e) {}
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.disablePrevBtn = function()
{
	try
	{
		var filterBtn = this.docRef.getElementById("prevFilterBtn");
		if (this.filterType == "list") 
		{
			if (filterBtn.className == "filterListButton")
				filterBtn.className = "filterListButtonDisabled";
		} 
		else 
		{
			if (filterBtn.className == "filterButton")		
				filterBtn.className = "filterButtonDisabled";
		}
		filterBtn.disabled = "disabled";
	}
	catch(e) {}
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.enableNbrRecords = function()
{
	try
	{
		var nbrRecords = this.docRef.getElementById("nbrRecords");		
		nbrRecords.disabled = "";
	}
	catch(e) {}
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.disableNbrRecords = function()
{
	try
	{
		var nbrRecords = this.docRef.getElementById("nbrRecords");		
		nbrRecords.disabled = "disabled";
	}
	catch(e) {}
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setNbrRecordsView = function()
{
	var winRef = this.launchedFrom || window;
	if (typeof(winRef["styler"]) == "undefined" || winRef.styler == null)
		winRef.stylerWnd = findStyler(true);
	if (winRef.stylerWnd && typeof(winRef.stylerWnd["StylerEMSS"]) == "function")
		winRef.styler = new winRef.stylerWnd.StylerEMSS();
	else
		winRef.styler = winRef.stylerWnd.styler;
	// nbr records is an input box for theme 10.3
	if (winRef.styler.showInfor3)
	{
		var nbrRecords = this.docRef.getElementById("nbrRecords");
		if (nbrRecords && nbrRecords.nodeName.toLowerCase() == "select")
		{
			var nbrRecordsBox = this.docRef.createElement("input");
			nbrRecordsBox.setAttribute("name", "nbrRecords");
			nbrRecordsBox.setAttribute("id", "nbrRecords");
			nbrRecordsBox.setAttribute("type", "text");
			nbrRecordsBox.setAttribute("size", "3");
			nbrRecordsBox.setAttribute("maxlength", "3");
			var dmeFilterObj = this;
			nbrRecordsBox.onchange = function()
			{
				if (!isNaN(parseInt(this.value,10)))
					this.value = parseInt(this.value, 10);
				else 
				{
					var filterWnd = dmeFilterObj.getWindow();
					if (filterWnd && typeof(filterWnd["RECORDS_PER_PAGE"]) != "undefined" && !isNaN(parseInt(filterWnd.RECORDS_PER_PAGE,10)))
						this.value = parseInt(RECORDS_PER_PAGE,10);
				}
				document.forms["filterForm"].elements["filterBtn"].click();
				return false;
			};
			nbrRecordsBox.onkeypress = function(evt)
			{
				evt = evt || window.event;
				var keyCode = evt.keyCode || evt.which;
				var key = String.fromCharCode(keyCode);
		 		// enter key is pressed; route the event to the button click   	
		    	if (keyCode == 13)
		    	{	
			    	if (!isNaN(parseInt(this.value,10)))	
			    		this.value = parseInt(this.value, 10);
		    		document.forms["filterForm"].elements["filterBtn"].click();
		    		return false;
		    	}	
		    	else
		    	{				
					// key codes: 46 = delete; 8 = backspace; 37-40: arrow keys.
					// make sure that the charCode is '0' while doing this check as there are characters, such as '%&( that have the same key code.
		    		var isValidOtherKey = (evt.charCode == 0 && ((keyCode == 46) || (keyCode == 8) || (keyCode > 36 && keyCode < 41)));
					var digitCheck = /\d/;
					if (!digitCheck.test(key))
					{
						if (!isValidOtherKey)
							return false;
					}
					else if (parseInt(key,10) == 0 && isNaN(parseInt(this.value,10)))
						return false;
		    	}
		    	if (!isNaN(parseInt(this.value,10)))	
		    		this.value = parseInt(this.value, 10);
		    	return true;
			};			
			nbrRecords.parentNode.replaceChild(nbrRecordsBox, nbrRecords);
			if (this.nbrRecords)
				nbrRecordsBox.value = this.nbrRecords;
		}
	}
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setBeginRecordNbr = function(nbr)
{
	try { this.docRef.getElementById("beginRecNbr").innerHTML = nbr.toString(); } catch(e) {}
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getBeginRecordNbr = function()
{
	try { return this.docRef.getElementById("beginRecNbr").innerHTML; } catch(e) { return null; }
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.setEndRecordNbr = function(nbr)
{
	try { this.docRef.getElementById("endRecNbr").innerHTML = nbr.toString(); } catch(e) {}
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getEndRecordNbr = function()
{
	try { return this.docRef.getElementById("endRecNbr").innerHTML; } catch(e) { return null; }
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.startProcessing = function()
{
	try { this.docRef.getElementById("spinArrow").style.display = ""; } catch(e) {}
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.doneProcessing = function(msg)
{
	try { this.docRef.getElementById("spinArrow").style.display = "none"; } catch(e) {}
	var winRef = this.launchedFrom || window;
	if (typeof(winRef["getDmeFieldElement"]) != "undefined")
	{
		if (typeof(winRef["styler"]) == "undefined" || winRef.styler == null)
			winRef.stylerWnd = findStyler(true);
		if (winRef.stylerWnd && typeof(winRef.stylerWnd["StylerEMSS"]) == "function")
			winRef.styler = new winRef.stylerWnd.StylerEMSS();
		else
			winRef.styler = winRef.stylerWnd.styler;
		if (typeof(winRef.stylerWnd.StylerEMSS["selectControlOnLoad"]) != "undefined")
		{
			var fldObj = winRef.getDmeFieldElement(this.fieldNm);
			var fldWin = fldObj[0];
			var inputFld = fldObj[1];
			winRef.stylerWnd.StylerEMSS.selectControlOnLoad(fldWin, inputFld);
		}		
	}
	if (typeof(winRef["stopProcessing"]) == "undefined" || typeof(winRef["stopProcessing"]) == "unknown")
		winRef.stopProcessing = window.stopProcessing;
	winRef.stopProcessing(msg);	
	try { filterWin.focus(); } catch(e) {}
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.getSelectStr = function()
{
	var selectStr = null;
	var keywords = this.getKeywords();
	var filterField = this.getFilterField();
	var lowChar = " ";
	var highChar = "z";
	if (!emptyStr(keywords))
	{
		if (filterField.isCode && (this.getOption() != "is"))
			keywords = keywords.toUpperCase();
		if (filterField.isNumeric)
			highChar = "9";
		switch (this.getOption())
		{
			case "contains":
				selectStr = filterField.field + "^~" + keywords;
				break;
			case "starts with":
				var fieldSize = filterField.size;
				var keywordsBegin = keywords;
				var keywordsEnd = keywords;
				for (var i=keywords.length; i<fieldSize; i++)
					keywordsBegin += lowChar;
				for (var j=keywords.length; j<fieldSize; j++)
					keywordsEnd += highChar;
				selectStr = filterField.field + ">=" + keywordsBegin + "&" + filterField.field + "<=" + keywordsEnd;
				break;
			case "is":
				selectStr = filterField.field + "=" + keywords;
			default: break;
		}
	}
	return selectStr;
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.selectFilterOption = function(filterField)
{
	setFilterOptions(this.getFieldNm(), filterField, this.getFilterForm().elements['filterOption']);
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.enableSearch = function(flag)
{
	var filterTable = this.getWindow().document.getElementById("paneTable");
	var filterBarRow = filterTable.getElementsByTagName("TR")[0];
	filterBarRow.style.display = "block";
}

//-----------------------------------------------------------------------------
DMEFilterHandler.prototype.disableSearch = function(flag)
{
	var filterTable = this.getWindow().document.getElementById("paneTable");
	var filterBarRow = filterTable.getElementsByTagName("TR")[0];
	filterBarRow.style.display = "none";
}

function dmeFieldOnKeyUpHandler(evt, fieldNm)
{
	evt = evt || window.event;
	var keyCode = evt.keyCode || evt.which;
	var key = String.fromCharCode(keyCode);
	// ignore tab, enter, esc and shift keys	
	if (keyCode == 9 || keyCode == 13 || keyCode == 16 || keyCode == 27 || evt.shiftKey)
		return true;
	if (fieldNm && typeof(window["dmeFieldKeyUpHandler"]) == "function")
		dmeFieldKeyUpHandler(fieldNm);
	return true;
}

function cancelEvent(evt)
{
	evt = evt || window.event;
	if (evt.preventDefault)
		evt.preventDefault();
	if (evt.stopPropagation)
		evt.stopPropagation();
	else
		evt.cancelBubble = true;	
}

function findWaitWnd()
{
	try { if (typeof(parent.parent.showWaitAlert) == "function") { return parent.parent; } } catch(e) {}
	try { if (typeof(parent.showWaitAlert) == "function") { return parent; } } catch(e) {}
	try { if (typeof(showWaitAlert) == "function") { return window; } } catch(e) {}
	return null;
}

function startProcessing(msg, callback)
{
	var waitWnd = findWaitWnd();
	if (waitWnd)
		waitWnd.showWaitAlert(msg, callback);		
	else if (callback)
		callback();
}

function stopProcessing(msg)
{
	try { parent.parent.removeWaitAlert(msg); msg = ""; } catch(e) {}	
	try { parent.removeWaitAlert(msg); msg = ""; } catch(e) {}
	try { removeWaitAlert(msg); } catch(e) {}
}

var accessibleTableBuffer = new Array();
var accessibleWindow = null;
function openAccessibleAppletWindow(accessibleTableHtml) 
{
	try { accessibleWindow.close(); } catch(e) {}
	var tableHtml = accessibleTableHtml || accessibleTableBuffer.join("");
	accessibleWindow = window.open('/lawson/xhrnet/dot.htm','accessiblePopUp','resizable=yes,scrollbars=auto,height=400,width=350');
	var popUpDoc = accessibleWindow.document;
	popUpDoc.write(tableHtml);
	popUpDoc.close();
	try { accessibleWindow.focus(); } catch(e) {}
}

function getVarFromString(varName, str)
{
	var url = unescape(str);
	var ptr = url.indexOf(varName + "=");
	var ptr2;
	var val1 = "";
	if (ptr != -1)
	{
		var val1 = url.substring(ptr + varName.length + 1,url.length);
		var ptr2;
		if ((ptr2 = val1.indexOf("&")) != -1)
		{
			if (ptr2 == -1)
				ptr2 = val1.length;
			val1 = val1.substring(0,ptr2);
		}
	}
	return val1;
}

function getWinSize(wnd)
{
	wnd = wnd || window;
	var winHeight = 768;
	var winWidth = 1024;
	// resize the table frame to the screen dimensions
	if (typeof(wnd.innerWidth) == "number") 
	{
	    //non-IE
		winHeight = wnd.innerHeight;
		winWidth = wnd.innerWidth;
	} 
	else if (wnd.document.documentElement && (wnd.document.documentElement.clientWidth || wnd.document.documentElement.clientHeight)) 
	{
	    //IE 6+ in 'standards compliant mode'
		winHeight = wnd.document.documentElement.clientHeight;
		winWidth = wnd.document.documentElement.clientWidth;
	} 
	else if (wnd.document.body && (wnd.document.body.clientWidth || wnd.document.body.clientHeight)) 
	{
	    //IE 4 compatible
	    winHeight = wnd.document.body.clientHeight;
	    winWidth = wnd.document.body.clientWidth;
	}
	return [winWidth, winHeight];
}
