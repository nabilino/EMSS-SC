/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/content.js,v 1.4.4.4.4.1.14.1.2.2 2012/08/08 12:37:20 jomeli Exp $ */
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

var portalWnd=null;
var portalObj=null;
var objContent=null;

function init()
{
	// potential exceptions - permissions security
	try	{
		portalWnd=envFindObjectWindow("lawsonPortal");
		if (!portalWnd) return;
		portalObj=portalWnd.lawsonPortal;

		// load the script versions
		envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

		var strsearch = document.location.search.substr(1)
		var strType = portalWnd.getVarFromString("_TYPE", strsearch)
		var index = strsearch.indexOf("_URL=")
		var strUrl = strsearch.substr(index+5)
		if(strType.toUpperCase() == "DME")
			objContent = new DME(strUrl)
		else if(strType.toUpperCase()=="RSS")
			objContent = new RSS(strUrl)
		objContent.render()

	} catch (e)	{
		// show the exception error
		var name = "<h4>" + (e.name ? e.name : "Exception") + "</h4>";
		var message = (e.message ? e.message + "<br/>" : e);
		var loc = "<p>URL:" + document.location + "</p>";
		var query = escape(name + message + loc);
		var url = "error.htm?" + query;
		window.location.replace(url);
	}
}

function DME(srcUrl)
{
	this.id="contentDME"
	this.url = srcUrl
	this.prevnext=""
	this.numFields = 0
	this.objDmeResult = null
	this.error=false
}

DME.prototype.render=function()
{
	var dmeFrame = document.createElement("DIV")
	dmeFrame.id=this.id
	dmeFrame.style.position = "absolute"
	dmeFrame.style.left = "0px"
	dmeFrame.style.top = "0px"
	dmeFrame.style.height = "100%"
	dmeFrame.style.width = "100%"
	document.body.appendChild(dmeFrame)
	this.dmeWriteHtm0()
	this.objDmeResult = portalWnd.httpRequest(portalWnd.DMEPath+"?"+this.url+this.prevnext)
	this.dmeWriteHtm1()// Create header
	if(!this.error)
		this.dmeWriteHtm2()// Create table and display
}

DME.prototype.dmeWriteHtm0=function()
{
	var objMainWin = document.getElementById(this.id)
	var objTitDiv = document.createElement("DIV")
	this.dmeSetStyle(objTitDiv, "titleDiv_"+this.id, true, "0%", "0%", "15%", "100%")
	objTitDiv.style.borderBottom = "1px solid black"
	objMainWin.appendChild(objTitDiv)

	var dmeTitle = document.createElement("TABLE")
	dmeTitle.style.width = "100%"
	dmeTitle.id = "dmeTitle_"+this.id
	objTitDiv.appendChild(dmeTitle)
	var objRow = dmeTitle.insertRow(0)

	var cell0 = objRow.insertCell(0)
	cell0.width = "40%";
	cell0.align = "left"

	var cell1 = objRow.insertCell(1)
	cell1.width="20%"
	cell1.align = "center"
	var btnPrev = this.dmeCreateButton("btnPrev_"+this.id, false, "Previous", "PREVCALL")
	btnPrev.onclick = dmePreviousNext
	cell1.appendChild(btnPrev)

	var cell2 = objRow.insertCell(2)
	cell1.width="20%"
	cell1.align = "center"
	var btnNext = this.dmeCreateButton("btnNext_"+this.id, false, "Next", "NEXTCALL")
	btnNext.onclick = dmePreviousNext
	cell2.appendChild(btnNext)

	var contentDiv = document.createElement("DIV")
	this.dmeSetStyle(contentDiv, "contentDiv_"+this.id, true, "0%", "15%", "84.5%", "99.5%")
	contentDiv.style.overflow = "auto"
	objMainWin.appendChild(contentDiv)

	var dmeTable = document.createElement("TABLE")
	dmeTable.align = "center"
	dmeTable.id = "dmeTable_"+this.id
	contentDiv.appendChild(dmeTable)

	var tbody0 = document.createElement("TBODY")
	tbody0.id = "tbody0_"+this.id
	dmeTable.appendChild(tbody0)
}

//------------------------------------------------------------------------------
DME.prototype.dmeWriteHtm1=function()
{
	if(this.objDmeResult.status)
	{
		this.error=true
		alert(portalObj.getPhrase("ERROR_LOAD_XML"))
		return
	}
	
	//#106081 - DME error messages
	var arrMsgs=this.objDmeResult.getElementsByTagName("MESSAGE")
	var lenMsgs=(arrMsgs?arrMsgs.length:0)
	if (lenMsgs && (arrMsgs[0].getAttribute("status")=="1"))
	{
		this.error=true
		alert(portalObj.getPhrase("LBL_ERROR") + " - " + arrMsgs[0].firstChild.nodeValue)
		return
	}
	
	var oTable = document.getElementById("dmeTable_"+this.id)
	var oThead = oTable.createTHead()
	var objRow = oThead.insertRow(0)

	var columns = this.objDmeResult.getElementsByTagName("COLUMN")
	this.numFields=columns.length
	var oChild=null
	for (var i=0; i < this.numFields; i++)
	{
		var objCol = objRow.insertCell(i)
		objCol.align = "center"
		oChild=this.dmeCreateSpan(columns[i].getAttribute("dspname"), true, false)
		objCol.appendChild(oChild)
	}
	objRow = oThead.insertRow(1)
	var objHr = objRow.insertCell(0)
	objHr.colSpan = oTable.rows[0].cells.length
	objHr.appendChild(this.dmeCreateHr())
}

//------------------------------------------------------------------------------
DME.prototype.dmeWriteHtm2=function()
{
	if(this.objDmeResult.getElementsByTagName("RECORDS").length == 0)
	{
		this.dmePrintNoRecords("msgErrorCallingDME")
		return;
	}
	var dmeRecords = this.objDmeResult.getElementsByTagName("RECORD")
	if (dmeRecords.length == 0)
	{
		this.dmePrintNoRecords("msgNoRecordsFound")
		return;
	}

	var objRow, objCol;
	var oTbody = document.getElementById("tbody0_"+this.id)
	var oChild;
	for (var i=0; i<dmeRecords.length; i++)
	{
		var colNodes = dmeRecords[i].getElementsByTagName("COL")
		objRow = oTbody.insertRow(i)
		for(var j=0; j<this.numFields; j++)
		{
			objCol = objRow.insertCell(j)
			objCol.align = "left"
			for(var x=0;x<colNodes[j].childNodes.length;x++)
			{
				if(colNodes[j].childNodes[x].nodeType==4)
				{
					oChild = this.dmeCreateSpan(colNodes[j].childNodes[x].nodeValue, false, false)
					objCol.appendChild(oChild)
					break
				}
			}
		}
	}
	objRow = oTbody.insertRow(i)
	objCol = objRow.insertCell(0)
	objCol.colSpan = this.numFields
	objCol.appendChild(this.dmeCreateHr())

	//  Enable/Disable Prev/Next buttons
	var btnPrev = document.getElementById("btnPrev_"+this.id)
	var btnNext = document.getElementById("btnNext_"+this.id)
	btnPrev.style.display = (this.objDmeResult.getElementsByTagName("PREVCALL").length == 1)?"block":"none"
	btnNext.style.display = (this.objDmeResult.getElementsByTagName("NEXTCALL").length == 1)?"block":"none"
}

//------------------------------------------------------------------------------
DME.prototype.dmeSetStyle=function(obj, id, bPosAbs, sleft, stop, sheight, swidth)
{
	if (!obj)return
	if(id != "")obj.id = id
	obj.style.position=bPosAbs ? "absolute": "relative";
	if(sleft != "")obj.style.left=sleft
	if(stop != "")obj.style.top=stop
	if(sheight != "")obj.style.height=sheight
	if(swidth != "")obj.style.width=swidth
}
//------------------------------------------------------------------------------
DME.prototype.dmeCreateSpan=function(strText, bBold, bCursor)
{
	var oSpan = document.createElement("SPAN")
	oSpan.className = "DMECol"
	oSpan.style.position = "relative"
	oSpan.style.paddingRight = "10px"
	if(bBold)oSpan.style.fontWeight = "bold"
	if(bCursor)oSpan.style.cursor = (portalObj.browser.isIE)?"hand":"pointer"
	var oText = document.createTextNode(strText)
	oSpan.appendChild(oText)
	return oSpan
}

//------------------------------------------------------------------------------
DME.prototype.dmeCreateHr=function()
{
	var oHr = document.createElement("HR")
	oHr.size = "0"
	oHr.noShade = true
	return oHr
}

//------------------------------------------------------------------------------
DME.prototype.dmePrintNoRecords=function(strPhrase)
{
	var dmeTable = document.getElementById("dmeTable_" + this.id)
	var oTbody = document.getElementById("tbody0_" + this.id)
	var objRow = oTbody.insertRow(0)
	var objCol = objRow.insertCell(0)
	objCol.colSpan = this.numFields
	var msg = portalObj.getPhrase(strPhrase)
	if (strPhrase=="msgErrorCallingDME")
		msg+=("\n"+this.url);
	objCol.appendChild(this.dmeCreateSpan(msg, false, false))

	objRow = oTbody.insertRow(1)
	objCol = objRow.insertCell(0)
	objCol.colSpan = this.numFields
	objCol.appendChild(this.dmeCreateHr())
}

//------------------------------------------------------------------------------
DME.prototype.dmeCreateButton=function(id, bDisplay, strValue, strNodeName)
{
	var btnObj = document.createElement("INPUT")
	btnObj.type = "button"
	btnObj.className = "DMEButton"
	btnObj.style.position = "relative"
	btnObj.id = id
	btnObj.style.display = bDisplay?"block":"none"
	btnObj.value = strValue
	btnObj.prevNext = strNodeName
	return btnObj
}

//------------------------------------------------------------------------------
function dmePreviousNext(e)
{
	e = e?e.currentTarget:window.event.srcElement
	var objPrev = objContent.objDmeResult.getElementsByTagName(e.prevNext)[0]
	var strPrev=""
	//#106081 - objPrev may be null
	var len=(objPrev && objPrev.childNodes?objPrev.childNodes.length:0)
	for(var x = 0; x < len; x++)
	{
		if(objPrev.childNodes[x].nodeType == 4)
		{
			strPrev = objPrev.childNodes[x].nodeValue
			break
		}
	}
	var oTable = document.getElementById("dmeTable_contentDME")
	for(var i=oTable.rows.length-1; i >1; i--)
		oTable.deleteRow(i)
	objContent.prevnext = strPrev
	var url=portalWnd.DMEPath+"?"+objContent.url
		+(objContent.prevnext?"&"+objContent.prevnext:"")
	objContent.objDmeResult = portalWnd.httpRequest(url)
	if(objContent.objDmeResult.status)
	{
		objContent.error=true
		alert(portalObj.getPhrase("ERROR_LOAD_XML"))
		return
	}
	
	//#106081 - DME error messages
	var arrMsgs=objContent.objDmeResult.getElementsByTagName("MESSAGE")
	var lenMsgs=(arrMsgs?arrMsgs.length:0)
	if (lenMsgs && (arrMsgs[0].getAttribute("status")=="1"))
	{
		objContent.error=true
		alert(portalObj.getPhrase("LBL_ERROR") + " - " + arrMsgs[0].firstChild.nodeValue)
		return
	}
	objContent.dmeWriteHtm2()
}

//------------------------------------------------------------------------------
function RSS(strUrl)
{
	this.id = "contentRSS"
	this.url = strUrl
}

//------------------------------------------------------------------------------
RSS.prototype.render=function()
{
	var rssFrame;
	var objChild;
	var objTxt;

	rssFrame=document.createElement("DIV");
	rssFrame.id=this.id;
	rssFrame.style.position="absolute";
	rssFrame.style.top="0px";
	rssFrame.style.left="0px";
	rssFrame.style.height="100%"
	rssFrame.style.width="100%"
	document.body.appendChild(rssFrame)

	var rssTable = document.createElement("TABLE");
	rssTable.align = "center";
	rssTable.width = "100%";
	rssFrame.appendChild(rssTable);

	var rssReturn = portalWnd.httpRequest("/servlet/PassThrough?_URL="+this.url)
	if(rssReturn.status)
	{
		alert(portalObj.getPhrase("ERROR_LOAD_XML"));
		return;
	}
	var rssItems=rssReturn.documentElement.childNodes;

	var objRow, objCell;
	var strTitle, strLink, strDescription
	var j=0;
	var x=0;
	for (var i=0; i<rssItems.length; i++)
	{
		if(rssItems[i].nodeName != "item")continue;
		for (x=0; x < rssItems[i].childNodes.length; x++)
		{
			if (rssItems[i].childNodes[x].nodeName == "title")
				strTitle = rssItems[i].childNodes[x].childNodes[0].nodeValue
			if (rssItems[i].childNodes[x].nodeName == "link")
				strLink = rssItems[i].childNodes[x].childNodes[0].nodeValue
		}

		objRow = rssTable.insertRow(j++)
		objCell = objRow.insertCell(0)
		var objLink = document.createElement("SPAN")
		objLink.className="RSSLink"
		objLink.style.position="relative"
		objLink.link=strLink
		objLink.onclick=rssOpenWindow
		objTxt=document.createTextNode(strTitle)
		objLink.appendChild(objTxt)
		objCell.appendChild(objLink)
	}
}

//------------------------------------------------------------------------------
function rssOpenWindow(e)
{
	e=e?e.currentTarget:window.event.srcElement
	var strLink = e.link
	window.open(strLink);
}
