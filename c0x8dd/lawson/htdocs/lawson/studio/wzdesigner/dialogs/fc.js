/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/wzdesigner/dialogs/fc.js,v 1.4.28.2 2012/08/08 12:48:52 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// datafld.js
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
var studioWnd=null;
var sourceWnd=null;
var xmlFormDoc=null;

//-----------------------------------------------------------------------------
function fcInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	studioWnd = wndArguments[0];
	var FC = wndArguments[1];
	sourceWnd = wndArguments[2]
	xmlFormDoc=wndArguments[3];

	fcBuildList(FC);

	document.body.style.visibility="visible";
	btnOK.focus();
}

//-----------------------------------------------------------------------------
function fcBuildList(FC)
{
	var toolbar=xmlFormDoc.selectSingleNode(".//toolbar");
	var len=(toolbar && toolbar.childNodes?toolbar.childNodes.length:0);

	// clone childnodes array
	var arrFC=new Array();
	for (var i=0;i<len;i++)
	{
		if (toolbar.childNodes[i].getAttribute("nm") && toolbar.childNodes[i].getAttribute("value"))
			arrFC.push(toolbar.childNodes[i]);
	}
	arrFC.sort(fcSortName);
	len=(arrFC ? arrFC.length : 0);
	for (var i=0; i < len; i++ )
	{
		var oOption = document.createElement("option");
		var nm=arrFC[i].getAttribute("nm");
		var value=arrFC[i].getAttribute("value");

        // translations - format
        var transValue = value;
        if (value.indexOf("^")>-1)
        {
            var splitValue=value.split("^");
            value=splitValue[0];
            transValue=splitValue[1];
        }
		oOption.text=nm + " (" + transValue + ")";
		oOption.value=value;

		// initial value
		if (oOption.value == FC)
			oOption.selected=true;
		selFCList.add(oOption);
	}
	return;
}

//-----------------------------------------------------------------------------
function fcCancel()
{
	// user pressed cancel button
	window.close();
}

//-----------------------------------------------------------------------------
function fcOK()
{
	// user pressed ok button
	var i=selFCList.selectedIndex;
	if (i == -1) return;
	
	window.returnValue=selFCList.options[i].value;
	window.close();
}

//-----------------------------------------------------------------------------
function fcOnBodyKeyPress()
{
	var evtCaught=false;
	if (event.keyCode == 27)
	{
		fcCancel();
		return;
	}
	else if (event.srcElement.id == "selFCList")
	{
		if ( event.keyCode == 13 || event.keyCode == 32 )
		{
			evtCaught=true;
			if ( event.keyCode == 13 )
				fcOK();
		}
	}
	if (evtCaught)
	{
		event.cancelBubble=true;
		event.returnValue=false;
	}
	return (!evtCaught);
}

//-----------------------------------------------------------------------------
function fcSortName(a,b)
{
	// sorts folders alphabetically by name
	// used by ProvSelect.render
	var aText=a.getAttribute("nm").toLowerCase()
	var bText=b.getAttribute("nm").toLowerCase()
	if (aText < bText) return (-1);
	if (aText == bText) return (0);
	if (aText > bText) return (1);
}

//-----------------------------------------------------------------------------
function padSpaces(s,n)
{
	var ret=s+""
	while (ret.length<n)
		ret+=" "
	return ret
}
