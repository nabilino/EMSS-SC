/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/AboutDialog.js,v 1.3.2.5.2.8 2014/02/28 15:00:22 tmd Exp $ */
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
//	DEPENDENCIES:
//		commonHTTP.js
//-----------------------------------------------------------------------------
//
//	PARAMETERS:
//		webappjsDir				(optional) the location of the webappjs code 
//								(i.e. /lawson/webappjs/ is the default)
//		traceObj				(optional) a reference to your trace object
//-----------------------------------------------------------------------------
function AboutObject(webappjsDir, traceObj, stylerObj, product, version, copyright, httpRequest)
{
	this.browser = new SEABrowser();
	this.webappjsDir = (webappjsDir) ? webappjsDir : "/lawson/webappjs/";
	if (this.webappjsDir.substring(this.webappjsDir.length-1) != "/")
		this.webappjsDir += "/";
	this.traceObj = (traceObj) ? traceObj : null;
	this.translationFunc = null;
	this.stylerObj = stylerObj;
	this.product = product;
	this.version= version;
	this.copyright = copyright;
	this.httpRequest = httpRequest;
	this.modWidth = 636;
	this.modHeight = 454;
}

AboutObject._arguments = null;

//-----------------------------------------------------------------------------
AboutObject.prototype.setTranslationFunc = function(func)
{
	if (!func)
		return;
	this.getPhrase = func;
}

//-----------------------------------------------------------------------------
AboutObject.prototype.getPhrase = function(phrase)
{
	return (this.translationFunc)
		  ? this.translationFunc(phrase)
		  : phrase;
}

//-----------------------------------------------------------------------------
AboutObject.prototype.translateButton = function(btn, phrase, wnd)
{
	wnd = wnd || window;
	if (typeof(btn) == "string")
		btn = wnd.document.getElementById(btn);
	if (!btn || !phrase)
		return;

	btn.value = this.getPhrase(phrase);

	if (btn.innerText)
	{	
		btn.innerText = btn.value;
	}
	else if (btn.textContent)
	{
		btn.textContent = btn.value;
	}
	else
	{
		btn.innerHTML = btn.value;
	}
}

//-----------------------------------------------------------------------------
AboutObject.prototype.aboutBox = function(wnd)
{
	if (this.stylerObj.showInfor3) {
		var additionalDetails = 
			"Browser : " + navigator.appCodeName + " " + navigator.appVersion + "\r\n\r\n" +
			"OS : " + navigator.platform + "\r\n\r\n" +
			"Language : " + (navigator.appName == "Microsoft Internet Explorer" ? navigator.userLanguage : navigator.language) + "\r\n\r\n" + 
			"Cookies Enabled : " + navigator.cookieEnabled;
			 
		$('body').inforAboutDialog({
			productName: this.product,
			version: this.version,
			additionalDetails: additionalDetails,
			copyRightYear: mainWnd.user.date.substring(0,4)
		})
		return;
	}
	
// **********************************************************************	
	
	if (!wnd)
		wnd = window;

	var abtArgs = new Array();
	abtArgs[0] = this;
	AboutObject._arguments = abtArgs;

	var strDlgPath = this.webappjsDir + "html/about.htm"
	// prepare to open modal window in classical
	var modLeft = parseInt((screen.width / 2) - (this.modWidth / 2), 10);
	var modTop = parseInt((screen.height / 2) - (this.modHeight / 2), 10);

	if (browser.isIE)
	{
		var strFeatures ="dialogLeft:" + modLeft + "px;dialogTop:" + modTop +
				"px;dialogWidth:" + this.modWidth + "px;dialogHeight:" + this.modHeight +
				"px;status:0;help:0;"
		 return window.showModalDialog(strDlgPath, abtArgs, strFeatures);
	}
	else
	{
		return window.open(strDlgPath, "about" + winNameTime,
							  "left=" + modLeft + ",top=" + modTop + ",width=" + this.modWidth +
							  ",height=" + this.modHeight + ",modal");
	}
}
