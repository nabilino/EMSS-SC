/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/drill/aboutdrill.js,v 1.4.6.3.4.5.14.1.2.2 2012/08/08 12:37:23 jomeli Exp $NoKeywords: $ */
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

// dynamic window title
window.document.title = "Lawson Portal Support Information - Drill";

var drlAbout = null;
var portalWnd = null;
var drillObj = null;
var activeTab = "tab0";
var maxTabIndex = 3;

//-----------------------------------------------------------------------------
function aboutInit()
{
	drlAbout = window.opener;
	portalWnd = drlAbout.drlDrillObj.portalWnd;
	drillObj = drlAbout.drlDrillObj;
	// Must be done first
	aboutOnResize();

	var elem = document.getElementById(activeTab);
	aboutSwitchView(elem);
}

//-----------------------------------------------------------------------------
function aboutCurrentTreeNode()
{
	var aboutText = "";
	for (var props in drillObj.selectedTreeNode)
	{
		if (typeof(drillObj.selectedTreeNode[props]) != "object" 
		&& typeof(drillObj.selectedTreeNode[props]) != "function")
			aboutText += props + "\t[" + drillObj.selectedTreeNode[props] + "]\n";
	}
	return "\n" + aboutText;
}

//-----------------------------------------------------------------------------
function aboutDrillHTML()
{
	return aboutFormat(drlAbout.document.body.innerHTML);
}

//-----------------------------------------------------------------------------
function aboutDrillObj()
{
	var aboutText = "";
	for (var props in drillObj)
	{
		if (typeof(drillObj[props]) != "object" 
		&& typeof(drillObj[props]) != "function")
			aboutText += props + "\t[" + drillObj[props] + "]\n";
	}
	return "\n" + aboutText;
}

//-----------------------------------------------------------------------------
function aboutDrillXML()
{
	if (drillObj.idaLoad)
	{
		var str = drillObj.idaLoad.getDataString(drillObj.bIsIE);
		if (drillObj.bIsIE)
			return "\n" + str;
		else
			return "\n" + str.replace( /\>\</g ,">\n<");
	}
	else
		return "";
}

//-----------------------------------------------------------------------------
function aboutFormat(str)
{
	return str.replace( /(\<[^!\?])/g ,"\n$1");
}

//-----------------------------------------------------------------------------
function aboutIncTab(increment)
{
	var curIndex = parseInt(activeTab.substr(3,1));
	var tabIndex = curIndex + increment;

	if (tabIndex < 0)
		tabIndex = 0
	else if (tabIndex > this.maxTabIndex)
		tabIndex = this.maxTabIndex

	if (curIndex != tabIndex)
	{
		var elem = document.getElementById("tab" + tabIndex);
		aboutSwitchView(elem);
	}
	return true;
}

//-----------------------------------------------------------------------------
function aboutKeyDown(evt)
{
    evt = portalWnd.getEventObject(evt);
    if (!evt) return false;

	var evtCaught = false;
	var keyVal = drillObj.bIsIE ? evt.keyCode : evt.charCode;
	if (keyVal == 0)		// netscape only
		keyVal = evt.keyCode;

	// escape; closes window
	if (keyVal == 27)
	{
		window.close();		
		evtCaught = true;
	}
	// ctrl - page down; shifts tab to right
	else if (!evt.altKey && evt.ctrlKey && !evt.shiftKey && keyVal == 34)
		evtCaught = aboutIncTab(1);
	// ctrl - page up; shifts tab to left
	else if (!evt.altKey && evt.ctrlKey && !evt.shiftKey && keyVal == 33)
		evtCaught = aboutIncTab(-1);

	if (evtCaught)
		portalWnd.setEventCancel(evt);
	return evtCaught;
}

//-----------------------------------------------------------------------------
function aboutOnResize(evt)
{
	var scrWidth = 0;
	var scrHeight = 0;
	if (drillObj.bIsIE)
	{
		scrWidth = document.body.offsetWidth;
		scrHeight = document.body.offsetHeight;
	}
	else
	{
		scrWidth = window.innerWidth;
		scrHeight = window.innerHeight;
	}

	if (scrWidth < 157) return;
	if (scrHeight < 170) return;

	var textWindow = document.getElementById("textWindow");
	if (!textWindow) return;
	
	var widthDiff = (drillObj.bIsIE) ? 5 : 1;
	var heightDiff = (drillObj.bIsIE) ? 32 : 31;

	textWindow.style.width = scrWidth - widthDiff;
	textWindow.style.height = scrHeight - heightDiff;
}

//-----------------------------------------------------------------------------
function aboutSwitchView(elem)
{
	if (drlAbout.closed)
		return;

	var prev = document.getElementById(activeTab);
	prev.className = "";
	prev.title = "";

	activeTab = elem.id;
	elem.className = "activeTab";
	elem.title = document.getElementById("btn" + elem.id.substr(3,1)).firstChild.nodeValue;

	var imgBottom = document.getElementById("imgTabBottom");
	imgBottom.style.left = elem.offsetLeft + 1;
	imgBottom.style.width = elem.offsetWidth - 2;


	var textWnd = document.getElementById("textWindow");
	switch(elem.id)
	{
		case "tab0":
			textWnd.value = aboutDrillXML();
			break;

		case "tab1":
			textWnd.value = aboutDrillHTML();
			break;

		case "tab2":
			textWnd.value = aboutDrillObj();
			break;

		case "tab3":
			textWnd.value = aboutCurrentTreeNode();
			break;
	}
	textWnd.focus();
}

//-----------------------------------------------------------------------------
function aboutUnload()
{
	return false;
}