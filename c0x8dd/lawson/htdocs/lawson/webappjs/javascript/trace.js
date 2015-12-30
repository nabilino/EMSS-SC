/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/trace.js,v 1.5.2.3.2.2 2014/01/10 14:29:59 brentd Exp $ */
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

var stackDiv = null;
var stackAry = new Array();
var stackCnt = 0;

//-----------------------------------------------------------------------------
function trace_init(nbrOfCalls)
{
	if (!opener)
	{
		window.close();
		return;
	}

	var srch = document.location.search;
	var namePrm = "name=";
	var traceObj = eval("opener." + srch.substring(srch.indexOf(namePrm)+namePrm.length));
	stackDiv = document.getElementById("messages");

	if (traceObj && traceObj.setTraceReady)
	{
		traceIt("START (" + traceObj.getCurrentTimeString() + ")");
		traceObj.setTraceReady();
	}
	else if (nbrOfCalls == 10)
	{
		// tried to many times... fail now
		opener.alert("Error while loading trace window");
		window.close();
	}
	else
	{
		// try again
		setTimeout("trace_init(" + (++nbrOfCalls) + ")", 100);
	}
}

//-----------------------------------------------------------------------------
function traceIt(msg, txtData, color)
{
	msg = (msg) ? msg : "";
	txtData = (txtData) ? txtData : null;
	color = (color) ? color : "#000000";

	var dmpDiv = document.createElement("DIV");
	dmpDiv.style.color = color;
	dmpDiv.style.cursor = "default";

	if (txtData)
	{
		dmpDiv.ondblclick = showData;
		stackAry[stackAry.length] = dmpDiv;
		var expandImg = document.createElement("IMG");
		expandImg.src = "../images/plus.gif";
		expandImg.style.margin = "2px";
		expandImg.onclick = showData;
		expandImg.style.cursor = "hand";
		dmpDiv.appendChild(expandImg);
		var nobr = document.createElement("NOBR");
		nobr.appendChild(document.createTextNode(msg));
		dmpDiv.appendChild(nobr);
		var dataDiv = document.createElement("DIV");
		var dmpTxt = document.createElement("PRE");
		var theText = txtData.replace(/\r\n|\n/g,"\r");
		dmpTxt.appendChild(document.createTextNode(theText));
		dataDiv.style.border = "1px solid black";
		dataDiv.style.margin = "5px";
		dataDiv.style.display = "none"
		dataDiv.appendChild(dmpTxt);
		dmpDiv.appendChild(dataDiv);
	}
	else
	{
		var blankImg = document.createElement("IMG");
		blankImg.src = "../images/blank.gif";
		blankImg.style.margin = "2px";
		dmpDiv.appendChild(blankImg);
		var nobr = document.createElement("NOBR");
		nobr.appendChild(document.createTextNode(msg));
		dmpDiv.appendChild(nobr);
	}

	dmpDiv.style.backgroundColor = (++stackCnt%2) ? "#FFFFFF" : "#CCCCCC";
	stackDiv.appendChild(dmpDiv);
	window.scrollBy(0,100000);	// scroll to the bottom
}

//-----------------------------------------------------------------------------
function trace_keydown(evt)
{
	evt = getEventObject(evt);
	if (!evt)
		return;

	var evtCaught = false;
	switch (evt.keyCode)
	{
		// + (keypad)
		case 107:
		// +/=
		case 187:
			expandAll();
			evtCaught = true;
			break;
		// -
		case 109:
		case 189:
			collapseAll();
			evtCaught = true;
			break;
	}

	if (evtCaught)
	{
		setEventCancel(evt);
		cancelEventBubble(evt);
	}
}

//-----------------------------------------------------------------------------
function trace_unload()
{
	try
	{
		opener.TRACE.isTraceOn = false;
	}
	catch (e)
	{}
}

//-----------------------------------------------------------------------------
function clearTrace()
{
	stackCtn = 0;
	stackAry = new Array();

	var mDiv = document.getElementById("messages");
	while (mDiv.childNodes.length > 0)
		mDiv.removeChild(mDiv.childNodes[0]);
}

//-----------------------------------------------------------------------------
function printTrace()
{
	window.print();
}

//-----------------------------------------------------------------------------
function stopTrace()
{
	window.close();
}

//-----------------------------------------------------------------------------
function expandAll()
{
	for (var i=0; i<stackAry.length; i++)
		expand(stackAry[i]);
}

//-----------------------------------------------------------------------------
function collapseAll()
{
	for (var i=0; i<stackAry.length; i++)
		collapse(stackAry[i]);
}

//-----------------------------------------------------------------------------
function expand(obj)
{
	obj.childNodes[2].style.display = "block";
	obj.childNodes[0].src = "../images/minus.gif";
}

//-----------------------------------------------------------------------------
function collapse(obj)
{
	obj.childNodes[2].style.display = "none";
	obj.childNodes[0].src = "../images/plus.gif";
}

//-----------------------------------------------------------------------------
function showData(evt)
{
	evt = getEventObject(evt);
	if (!evt)
		return;

	var elem;
    var imgElem;
    if (evt.target)
    {
        imgElem = (evt.target.nodeType == 3) ? evt.target.parentNode : evt.target;
    	elem = imgElem.parentNode;
    }
    else
    {
        imgElem = window.event.srcElement;
        elem = imgElem.parentElement;
    }
    
	if (elem.childNodes.length == 3)
	{
		if (elem.childNodes[2].style.display == "none")
			expand(elem);
		else
			collapse(elem);
	}
}
