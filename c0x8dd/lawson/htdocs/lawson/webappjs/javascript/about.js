/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/about.js,v 1.3.2.3.2.4 2014/01/10 14:29:59 brentd Exp $ */
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

var aboutObj = null;

//-----------------------------------------------------------------------------
function about_init()
{
	if (!window.dialogArguments)
	{
		window.dialogArguments = opener.AboutObject._arguments;
		aboutObj = opener.AboutObject._arguments[0];
	}
	else
	{
		aboutObj = window.dialogArguments[0];
	}

	// translations
	aboutObj.translateButton(versionLbl, "Version", window);
	aboutObj.translateButton(btnClose, "Close", window);

	// size and position things
	var imgDiv = document.getElementById("imgDiv");
	imgDiv.style.left = parseInt((aboutObj.modWidth-604)/2, 10) + "px";
	imgDiv.style.top = parseInt((aboutObj.modHeight-404)/2, 10) + "px";
	var bgDiv = document.getElementById("bgDiv");
	bgDiv.style.left = imgDiv.style.left;
	bgDiv.style.top = imgDiv.style.top;

	// apply filter to png
	var imgDiv = document.getElementById("imgDiv");
	if (aboutObj.browser.isIE)
		imgDiv.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../images/login.png',sizingMethod='scale')";
	else
		imgDiv.style.backgroundImage = "url('../images/login.png')";

	// set the title
	document.title = aboutObj.product;

	// start building page
	var pName = document.getElementById("productName");
	pName.innerHTML = aboutObj.product;

	var copyRightName = document.getElementById("copyrightLbl");
	copyRightName.innerHTML = aboutObj.copyright;

	var verNbr = document.getElementById("versionNumber");
	verNbr.innerHTML = aboutObj.version;

	document.body.style.visibility = "visible";
	document.getElementById("btnClose").focus();
}

//-----------------------------------------------------------------------------
function about_keydown(e)
{
	var evt = e ? e : window.event;
	if (evt.keyCode == 27)	// Esc
		aboutClose();
}

//-----------------------------------------------------------------------------
function aboutClose()
{
	window.close();
}