/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/dialogs/foldersel.js,v 1.3.28.2 2012/08/08 12:48:47 jomeli Exp $ */
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

var oPopup=null;
var popWidth=80;
var popHeight=0;
var popLength=0;
var popHighlight=0;
var studioWnd=null;
var oDirXSL=null
var localProv=null
var strEngine=""
var strBaseFolder=""
var strRootFolder=""
var strProjFolder=""
var strStartFolder=""
var strCurFolder=""
var sep="/";
var savePath="";

var strRowClass="dsListText"
var strRowSelClass="dsListTextHighlight"
var strFileRow="fileRow"
var currentRow=null
var strBtnClass="buttonface"
var strBtnSelClass="threedhighlight"

//-----------------------------------------------------------------------------
function dlgInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	studioWnd=wndArguments[0]
	strRootFolder=wndArguments[1]
	strProjFolder=wndArguments[2]
	strStartFolder=wndArguments[3]
	strBaseFolder=strRootFolder+strProjFolder
	strEngine=wndArguments[4]
	if (wndArguments[5])
		localProv=wndArguments[5]

	btnNewDrive.disabled=true;
	if (strEngine == "local" && typeof(ENVDOMAIN) == "undefined")
	{
        if (!localProv || !localProv.fso)
        {
    		var msg=pageXLT.selectSingleNode("//phrase[@id='msgInvalidLocalProv']").text
            studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
    		window.close()
	    	return;
        }
		localProv.setWorkspaceByPath(strRootFolder+strStartFolder);
		sep = localProv.wksp.trail
		savePath = localProv.wksp.path
		btnNewDrive.disabled=false;
		oPopup=window.createPopup();		// drive popup
		dlgBuildDriveList()
	}
	else if (typeof(ENVDOMAIN) != "undefined")
	{
		btnNewDrive.style.display = "none";
		btnNewDrive.style.visibility = "hidden";
	}

	// load the folder xml
	var path=studioWnd.studioPath+"/dialogs/foldersel.xsl"
	oDirXSL = studioWnd.xmlFactory.createInstance("DOM");
	oDirXSL.async=false
	oDirXSL.load(path)
	if (oDirXSL.parseError.errorCode != 0)
	{
		studioWnd.displayDOMError(oDirXSL.parseError,path)
		window.close()
		return;
	}

	// load the available folders
	dlgLoadFolders(strStartFolder)

	document.body.style.visibility="visible"
	btnOK.focus()
}

//-----------------------------------------------------------------------------
function dlgLoadFolders(folder)
{
	var oDirXML=null
	switch (strEngine)
	{
	case "local":
		localProv.wksp.path=strRootFolder+folder
		oDirXML=localProv.dir()
		break;
	case "server":
		oDirXML = studioWnd.fileMgr.getList("folderlist", strRootFolder+"/"+folder, "*.*")
		break;
	case "km":
		break;
	}
	if (oDirXML!=null)
		folderdiv.innerHTML=oDirXML.transformNode(oDirXSL)
	else
		folderdiv.innerHTML=""

	dlgChooseFirstFolder()

	var newFolder = (strRootFolder==sep) ? folder : strRootFolder+folder;
    newFolder=newFolder.replace(/\\\\/g,"\\")
    newFolder=newFolder.replace("//","/")
	txtDirectory.value = newFolder;
	txtDirectory.setAttribute("title",newFolder)
	strCurFolder=folder

	if (strRootFolder+folder==strBaseFolder)
	{
		// at the root: already home; can't go up
		btnHome.disabled=true
		btnHome.style.cursor="auto"
		btnHome.style.backgroundImage="url('../images/homegray.gif')"
		btnUpLevel.disabled=true
		btnUpLevel.style.cursor="auto"
		btnUpLevel.style.backgroundImage="url('../images/folderupgray.gif')"
	}
	else
	{
		btnHome.disabled=false
		btnHome.style.cursor="hand"
		btnHome.style.backgroundImage="url('../images/home.gif')"
		btnUpLevel.disabled=false
		btnUpLevel.style.cursor="hand"
		btnUpLevel.style.backgroundImage="url('../images/folderup.gif')"
	}
}

//-----------------------------------------------------------------------------
function dlgChooseFirstFolder()
{
	var bDoFocus=(document.body.style.visibility=="visible") ? true : false;
	if (bDoFocus) btnOK.focus()
	var firstRow=document.getElementById(strFileRow+"1")
	if (!firstRow) return (false);

	currentRow=firstRow
	currentRow.className=strRowSelClass
	currentRow.tabIndex=0
	if (bDoFocus) currentRow.focus()
	return (true);
}

//-----------------------------------------------------------------------------
function dlgOnKeyDown()
{
	var evtCaught=false;

	switch(event.keyCode)
	{
	case 13:			// enter Key
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			event.srcElement.fireEvent("ondblclick")
			evtCaught=true
		}
		else if (event.srcElement.id=="btnHome")
			;
		else if (event.srcElement.id=="btnUpLevel")
			;
		else if (event.srcElement.id=="btnNewDrive")
			;
		else if (event.srcElement.id != "btnCancel")
		{
			btnOK.fireEvent("onclick")
			evtCaught=true
		}
		break;

	case 27:			// escape
		btnCancel.fireEvent("onclick")
		evtCaught=true
		break;

	case 33:			// pageup
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			dlgMoveFilePage(-1)
			evtCaught=true
		}
		break;

	case 34:			// pagedown
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			dlgMoveFilePage(1)
			evtCaught=true
		}
		break;

	case 35:			// end
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			dlgMoveFileHomeEnd(1)
			evtCaught=true
		}
		break;

	case 36:			// home
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			dlgMoveFileHomeEnd(-1)
			evtCaught=true
		}
		break;

	case 38:			// up arrow
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
			dlgMoveFileRow(-1)
		evtCaught=true
		break;

	case 40:			// down arrow
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
			dlgMoveFileRow(1)
		evtCaught=true
		break;
	}

	if (evtCaught)
	{
		event.returnValue=false
		event.cancelBubble=true
	}
	return (evtCaught)
}

//-----------------------------------------------------------------------------
// handle dialog btnOK and btnCancel keys (call from keypress event):
// enter fires btnOK; ESC fires btnCancel
function khdlOKCancel(evt)
{
	if (evt.keyCode==13)		// enter
	{
		if (document.activeElement.id == "btnCancel") return false
		if (document.activeElement.id != "btnOK"
		&& document.activeElement.id.substr(0,3) == "btn")
			return false
		document.all.btnOK.click()
		return true
	}
	else if (evt.keyCode==27)	// ESC
	{
		document.all.btnCancel.click()
		return true
	}
	return false
}

//-----------------------------------------------------------------------------
function dlgOK()
{
	// all done: return full path
	var retFolder = strRootFolder + strCurFolder
	retFolder = retFolder.replace(/\\\\/g,"\\")
	retFolder = retFolder.replace("//","/")
	window.returnValue=retFolder
	window.close()
}

//-----------------------------------------------------------------------------
function dlgOnUnload()
{
	// restore local path if necessary
	if (localProv && savePath != "")
		localProv.wksp.path=savePath;
}

//-----------------------------------------------------------------------------
function dlgOnGoHome()
{
	dlgLoadFolders(strProjFolder)
}

//-----------------------------------------------------------------------------
function dlgOnUpOneLevel()
{
	var pos = strCurFolder.lastIndexOf(sep)
	var upFolder=strCurFolder.substr(0, pos)
	dlgLoadFolders(upFolder)
}

//-----------------------------------------------------------------------------
function dlgOnSelectFolder(folder)
{
	dlgLoadFolders(strCurFolder+sep+folder)
}

//-----------------------------------------------------------------------------
function dlgOnFileClick(fElement)
{
	if (currentRow)
	{
		currentRow.className=strRowClass
		currentRow.tabIndex=-1
	}
	currentRow=fElement
	fElement.className=strRowSelClass
	fElement.tabIndex=0
	fElement.focus()
}

//-----------------------------------------------------------------------------
function dlgMoveFileRow(inc)
{
	if (!currentRow) return

	var rownbr = parseInt(currentRow.id.substr(strFileRow.length))
	if (rownbr==1 && inc == -1) return

	rownbr += inc
	var nextId=strFileRow+rownbr
	var row=document.getElementById(nextId)
	if (row) dlgOnFileClick(row)
}

//-----------------------------------------------------------------------------
function dlgMoveFilePage(inc)
{
	var row=null
	var rownbr = -1
	if (currentRow)
		rownbr=parseInt(currentRow.id.substr(strFileRow.length))

	if (inc == -1)		// page up
	{
		if (rownbr < 12) rownbr = 1
		else rownbr -= 12
		row=document.getElementById(strFileRow+rownbr)
		if (!row) return
	}
	else				// page dn
	{
		var curRow=null
		for (var i = 1; i < 12; i++)
		{
			curRow=document.getElementById(strFileRow+(rownbr+i))
			if (!curRow) break
			row=curRow
		}
		if (!row) return
	}

	dlgOnFileClick(row)
}

//-----------------------------------------------------------------------------
function dlgMoveFileHomeEnd(inc)
{
	var row=null
	var rownbr = -1
	if (currentRow)
		rownbr=parseInt(currentRow.id.substr(strFileRow.length))

	if (inc == -1)		// move home
	{
		var firstRow=document.getElementById(strFileRow+"1")
		if (!firstRow) return
		row=firstRow
	}
	else				// move end
	{
		for (var i = rownbr+1; ; i++)
		{
			var thisRow=document.getElementById(strFileRow+i)
			if (!thisRow) break
			row=thisRow
		}
		if (!row) return
	}

	dlgOnFileClick(row)
}

//-----------------------------------------------------------------------------
function dlgOnFileClick(fElement)
{
	if (currentRow)
	{
		currentRow.className=strRowClass
		currentRow.tabIndex=-1
	}
	currentRow=fElement
	fElement.className=strRowSelClass
	fElement.tabIndex=0
	fElement.focus()
}

//-----------------------------------------------------------------------------
function dlgBuildDriveList()
{
	var drives=localProv.fso.drives;
	popLength=drives.count
	popHeight=(popLength*22)+4
	var strHTML="<div id='popWrapper' style='position:relative;top:0;left:0;border:2px solid black;border-top:2px solid #cccccc;border-left:2px solid #cccccc;background:#666666;width:80px;height:"+popHeight+"px;'>"

    // enumerate the drives collection
	var en=new Enumerator(drives);
	var idx = -1;
	for ( ; !en.atEnd(); en.moveNext())
	{
		idx++;
		var drive=en.item();
		var icoName=studioWnd.getDriveTypeIcon(drive.DriveType)
		var background = (idx == 0) ? strBtnSelClass : strBtnClass;
		strHTML+="<div id=\"driveDiv"+idx+"\" drive=\""+drive.DriveLetter+"\" style=\"position:relative;top:0;left:0;background:"+background+";border:1px solid black;border-top:1px solid white;border-left:1px solid white;height:20px;color:black;font-family:verdana;font-weight:bold;padding:2px;padding-left:10px;font-size:8pt;cursor:auto;\" "
		strHTML+="onmouseover=\"parent.dlgOnDriveMouseOver(this)\" onmouseout=\"parent.dlgOnDriveMouseOut(this)\" onclick=\"parent.dlgChangeDrive(this);\">"
		strHTML+="<img src=\"../images/"+icoName+"\" align=\"absmiddle\">&nbsp;&nbsp;"+drive.DriveLetter+"</div>"

	}
	strHTML+="</div>"
	oDrivePopup.innerHTML=strHTML
}

//-----------------------------------------------------------------------------
function dlgOnNewDrive()
{
	// always reset highlight to 1st item before showing popup
	if (popHighlight != 0)
	{
		var elem=oPopup.document.getElementById("driveDiv"+popHighlight)
		if (elem) elem.style.background=strBtnClass;
		elem=oPopup.document.getElementById("driveDiv0")
		if (elem) elem.style.background=strBtnSelClass;
	}
	popHighlight=0;

    var left = btnNewDrive.offsetY+btnNewDrive.offsetWidth;
    var top = btnNewDrive.offsetX;
    oPopup.document.body.innerHTML = oDrivePopup.innerHTML;
    oPopup.show(top, left, popWidth, popHeight, btnNewDrive);
}

//-----------------------------------------------------------------------------
function dlgOnDriveMouseOver(elem)
{
	var idx=parseInt(elem.id.substr(8))
	if (idx != popHighlight)
	{
		var hElem=oPopup.document.getElementById("driveDiv"+popHighlight)
		if (hElem) dlgOnDriveMouseOut(hElem)
	}
	elem.style.background=strBtnSelClass
	popHighlight=idx
}

//-----------------------------------------------------------------------------
function dlgOnDriveMouseOut(elem)
{
	elem.style.background=strBtnClass
}

//-----------------------------------------------------------------------------
function dlgDriveKeyDown()
{
	if (oPopup.isOpen)
	{
		var bCaught=false;
		switch (event.keyCode)
		{
		case 13:			// enter
			var elem=oPopup.document.getElementById("driveDiv"+popHighlight)
			dlgChangeDrive(elem)
			bCaught=true;
			break;

		case 38:			// up arrow
			if (popHighlight > 0)
			{
				var elem=oPopup.document.getElementById("driveDiv"+popHighlight)
				if (elem) elem.style.background=strBtnClass;
				popHighlight -= 1;
				elem=oPopup.document.getElementById("driveDiv"+popHighlight)
				if (elem) elem.style.background=strBtnSelClass;
				bCaught=true;
			}
			break;

		case 40:			// down arrow
			if (popHighlight < (popLength-1))
			{
				var elem=oPopup.document.getElementById("driveDiv"+popHighlight)
				if (elem) elem.style.background=strBtnClass;
				popHighlight += 1;
				elem=oPopup.document.getElementById("driveDiv"+popHighlight)
				if (elem) elem.style.background=strBtnSelClass;
				bCaught=true;
			}
			break;
		}
		if (bCaught)
		{
			event.returnValue=false;
			event.cancelBubble=true;
			return (false);
		}
	}
}

//-----------------------------------------------------------------------------
function dlgChangeDrive(driveElem)
{
	oPopup.hide()

	var drive=driveElem.getAttribute("drive")
	strRootFolder=drive+":\\"
	strProjFolder=""
	strBaseFolder=strRootFolder+strProjFolder
	strStartFolder=""
	dlgLoadFolders(strProjFolder)
}
