/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/dialogs/foldersel.js,v 1.7.2.1.18.3.2.2 2012/08/08 12:37:24 jomeli Exp $ */
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

// objects
var portalWnd=null;
var portalObj=null;
var oDirXSL=null;
var fso=null;
var currentRow=null;

// popup object, variables
var oPopup=null;
var popWidth=80;
var popHeight=0;
var popLength=0;
var popHighlight=0;

// folders, separator
var strRootFolder="";
var strStartFolder="";
var strCurFolder="";
var sep="\\";

// screen elements
var btnNewDrive=null;
var btnHome=null;
var btnUpLevel=null;

// CSS class names
var strRowClass="dlgListText";
var strRowSelClass="dlgListTextHighlight";
var strFileRow="fileRow";
var strBtnClass="buttonface";
var strBtnSelClass="threedhighlight";

//-----------------------------------------------------------------------------
function dlgInit()
{
	// get dialog arguments
	portalWnd=wndArguments[0];
	portalObj=portalWnd.lawsonPortal;
	strStartFolder=wndArguments[1];
	strRootFolder=(strStartFolder ? strStartFolder.substr(0,3) : "c:\\");

	// save references to screen elements
	btnHome=window.document.getElementById("btnGoRootFolder");
	btnUpLevel=window.document.getElementById("btnUpOneLevel");
	btnNewDrive=window.document.getElementById("btnNewDrive");
	btnNewDrive.disabled=true;

	// instantiate a file system object
	fso = new ActiveXObject("Scripting.FileSystemObject");
	if (!fso.FolderExists(strStartFolder))
	{
		strStartFolder="c:\\";
		strRootFolder=strStartFolder;
	}

	btnNewDrive.disabled=false;
	oPopup=window.createPopup();		// drive popup

	// initialize the drive popup window
	dlgBuildDriveList()

	// load the folder xslt
	var path=portalWnd.lawsonPortal.path+"/dialogs/foldersel.xsl";
	oDirXSL = portalWnd.objFactory.createInstance("DOM");
	oDirXSL.async=false;
	oDirXSL.load(path);
	if (oDirXSL.parseError.errorCode != 0)
	{
		portalWnd.oError.displayDOMParseError(oDirXSL.parseError,path,window);
		window.close();
		return;
	}

	// translate the labels?
	if (portalObj.getLanguage() != "en-us")
	{
		var lblElems = window.document.getElementsByTagName("LABEL");
		var len = lblElems.length;
		for (var i = 0; i < len; i++)
		{
			var lbl = lblElems[i];
			try {
				var ph=portalObj.getPhrase(lbl.id);
				if (ph!=lbl.id)
					portalWnd.cmnSetElementText(lbl,ph);
			} catch (e) { }
		}

		// set button titles
		var btnElems=window.document.getElementsByTagName("BUTTON");
		len = btnElems.length;
		for (var i = 0; i < len; i++)
		{
			var btn = btnElems[i];
			phId="lbl"+btn.id.substr(3);
			var ph=portalObj.getPhrase(phId);
			if (ph != phId)
				btn.setAttribute("title",ph);
		}
	}

	// load the available folders (in startFolder)
	dlgLoadFolders(strStartFolder);

	document.body.style.visibility="visible";
	btnOK.focus();
}

//-----------------------------------------------------------------------------
function dlgLoadFolders(folder)
{
	// get an Xml Dom of folder contents and transform it
	var oDirXML=dlgGetFolderXml(folder);
	folderdiv.innerHTML=(oDirXML!=null ? oDirXML.transformNode(oDirXSL) : "");

	// highlight the first folder
	dlgChooseFirstFolder()

	// format, show the current folder name
	var newFolder = folder;
    newFolder=newFolder.replace(/\\\\/g,"\\");
    newFolder=newFolder.replace("//","/");
	txtFolder.value = newFolder;
	txtFolder.setAttribute("title",newFolder);
	strCurFolder=folder;

	// set buttons state
	var path=portalWnd.lawsonPortal.path;
	if (folder==strRootFolder)
	{
		// at the root: already home; can't go up
		btnHome.disabled=true;
		btnHome.style.cursor="auto";
		btnHome.style.backgroundImage="url('"+path+"/images/ico_home_gray.gif')";
		btnUpLevel.disabled=true;
		btnUpLevel.style.cursor="auto";
		btnUpLevel.style.backgroundImage="url('"+path+"/images/folderupgray.gif')";
	}
	else
	{
		btnHome.disabled=false;
		btnHome.style.cursor="hand";
		btnHome.style.backgroundImage="url('"+path+"/images/ico_home.gif')";
		btnUpLevel.disabled=false;
		btnUpLevel.style.cursor="hand";
		btnUpLevel.style.backgroundImage="url('"+path+"/images/folderup.gif')";
	}
}

//-----------------------------------------------------------------------------
function dlgChooseFirstFolder()
{
	var bDoFocus=(document.body.style.visibility=="visible") ? true : false;
	if (bDoFocus) btnOK.focus();
	var firstRow=document.getElementById(strFileRow+"1");
	if (!firstRow) return (false);

	currentRow=firstRow;
	currentRow.className=strRowSelClass;
	currentRow.tabIndex=0;
	if (bDoFocus) currentRow.focus();
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
			event.srcElement.fireEvent("ondblclick");
			evtCaught=true;
		}
		else if (event.srcElement.id=="btnGoRootFolder")
			;
		else if (event.srcElement.id=="btnUpOneLevel")
			;
		else if (event.srcElement.id=="btnNewDrive")
			;
		else if (event.srcElement.id != "btnCancel")
		{
			btnOK.fireEvent("onclick");
			evtCaught=true;
		}
		break;

	case 27:			// escape
		btnCancel.fireEvent("onclick");
		evtCaught=true;
		break;

	case 33:			// pageup
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			dlgMoveFilePage(-1);
			evtCaught=true;
		}
		break;

	case 34:			// pagedown
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			dlgMoveFilePage(1);
			evtCaught=true;
		}
		break;

	case 35:			// end
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			dlgMoveFileHomeEnd(1);
			evtCaught=true;
		}
		break;

	case 36:			// home
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
		{
			dlgMoveFileHomeEnd(-1);
			evtCaught=true;
		}
		break;

	case 38:			// up arrow
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
			dlgMoveFileRow(-1);
		evtCaught=true;
		break;

	case 40:			// down arrow
		if (event.srcElement.id.substr(0,strFileRow.length)==strFileRow)
			dlgMoveFileRow(1);
		evtCaught=true;
		break;
	}

	if (evtCaught)
	{
		event.returnValue=false;
		event.cancelBubble=true;
	}
	return (evtCaught);
}

//-----------------------------------------------------------------------------
// handle dialog btnOK and btnCancel keys (call from keypress event):
// enter fires btnOK; ESC fires btnCancel
function khdlOKCancel(evt)
{
	if (evt.keyCode==13)		// enter
	{
		if (document.activeElement.id == "btnCancel") return false;
		if (document.activeElement.id != "btnOK"
		&& document.activeElement.id.substr(0,3) == "btn")
			return false;
		window.document.getElementById("btnOK").click();
		return true;
	}
	else if (evt.keyCode==27)	// ESC
	{
		window.document.getElementById("btnCancel").click();
		return true;
	}
	return false;
}

//-----------------------------------------------------------------------------
function dlgOK()
{
	// all done: return the current folder
	var retFolder = strCurFolder;
	retFolder = retFolder.replace(/\\\\/g,"\\");
	retFolder = retFolder.replace("//","/");
	window.returnValue=retFolder;
	window.close();
}

//-----------------------------------------------------------------------------
function dlgOnUnload()
{
}

//-----------------------------------------------------------------------------
function dlgOnGoHome()
{
	dlgLoadFolders(strRootFolder);
}

//-----------------------------------------------------------------------------
function dlgOnUpOneLevel()
{
	var pos = strCurFolder.lastIndexOf(sep);
	var upFolder=strCurFolder.substr(0, pos);
	if (upFolder.indexOf(sep) == -1)
		upFolder = strRootFolder;
	dlgLoadFolders(upFolder);
}

//-----------------------------------------------------------------------------
function dlgOnSelectFolder(folder)
{
	dlgLoadFolders(strCurFolder+sep+folder);
}

//-----------------------------------------------------------------------------
function dlgOnFileClick(fElement)
{
	if (currentRow)
	{
		currentRow.className=strRowClass;
		currentRow.tabIndex=-1;
	}
	currentRow=fElement;
	fElement.className=strRowSelClass;
	fElement.tabIndex=0;
	fElement.focus();
}

//-----------------------------------------------------------------------------
function dlgMoveFileRow(inc)
{
	if (!currentRow) return;

	var rownbr = parseInt(currentRow.id.substr(strFileRow.length));
	if (rownbr == 1 && inc == -1) return;

	rownbr += inc;
	var nextId=strFileRow+rownbr;
	var row=document.getElementById(nextId);
	if (row) dlgOnFileClick(row);
}

//-----------------------------------------------------------------------------
function dlgMoveFilePage(inc)
{
	var row=null;
	var rownbr = -1;
	if (currentRow)
		rownbr=parseInt(currentRow.id.substr(strFileRow.length));

	if (inc == -1)		// page up
	{
		if (rownbr < 12) rownbr = 1;
		else rownbr -= 12;
		row=document.getElementById(strFileRow+rownbr);
		if (!row) return;
	}
	else				// page dn
	{
		var curRow=null;
		for (var i = 1; i < 12; i++)
		{
			curRow=document.getElementById(strFileRow+(rownbr+i));
			if (!curRow) break;
			row=curRow;
		}
		if (!row) return;
	}

	dlgOnFileClick(row);
}

//-----------------------------------------------------------------------------
function dlgMoveFileHomeEnd(inc)
{
	var row=null;
	var rownbr = -1;
	if (currentRow)
		rownbr=parseInt(currentRow.id.substr(strFileRow.length));

	if (inc == -1)		// move home
	{
		var firstRow=document.getElementById(strFileRow+"1");
		if (!firstRow) return;
		row=firstRow;
	}
	else				// move end
	{
		for (var i = rownbr+1; ; i++)
		{
			var thisRow=document.getElementById(strFileRow+i);
			if (!thisRow) break;
			row=thisRow;
		}
		if (!row) return;
	}

	dlgOnFileClick(row);
}

//-----------------------------------------------------------------------------
function dlgOnFileClick(fElement)
{
	if (currentRow)
	{
		currentRow.className=strRowClass;
		currentRow.tabIndex=-1;
	}
	currentRow=fElement;
	fElement.className=strRowSelClass;
	fElement.tabIndex=0;
	fElement.focus();
}

//-----------------------------------------------------------------------------
function dlgBuildDriveList()
{
	// get the file system drives collection
	var drives=fso.drives;
	popLength=drives.count;
	popHeight=(popLength*22)+4;
	var strHTML="<div id=\"popWrapper\" style=\"position:relative;top:0;left:0;" +
		"border:2px solid black;border-top:2px solid #cccccc;border-left:2px solid #cccccc;" +
		"background:#666666;width:80px;height:"+popHeight+"px;\">";

    // enumerate the drives collection
	var en=new Enumerator(drives);
	var idx = -1;
	for ( ; !en.atEnd(); en.moveNext())
	{
		idx++;
		var drive=en.item();
		var icoName=dlgGetDriveTypeIcon(drive.DriveType);
		var background = (idx == 0) ? strBtnSelClass : strBtnClass;
		strHTML+="<div id=\"driveDiv"+idx+"\" drive=\""+drive.DriveLetter + "\" " +
				"style=\"position:relative;top:0;left:0;background:"+background + ";" +
				"border:1px solid black;border-top:1px solid white;" + 
				"border-left:1px solid white;height:20px;color:black;font-family:verdana;" +
				"font-weight:bold;padding:2px;padding-left:10px;font-size:8pt;cursor:auto;\" " +
				"onmouseover=\"parent.dlgOnDriveMouseOver(this)\" " +
				"onmouseout=\"parent.dlgOnDriveMouseOut(this)\" " +
				"onclick=\"parent.dlgChangeDrive(this);\">";
		strHTML+="<img src=\"../images/"+icoName+"\" align=\"absmiddle\">&nbsp;&nbsp;"+drive.DriveLetter+"</div>";

	}
	strHTML+="</div>";
	oDrivePopup.innerHTML=strHTML;
}

//-----------------------------------------------------------------------------
function dlgOnNewDrive()
{
	// always reset highlight to 1st item before showing popup
	if (popHighlight != 0)
	{
		var elem=oPopup.document.getElementById("driveDiv"+popHighlight);
		if (elem) elem.style.background=strBtnClass;
		elem=oPopup.document.getElementById("driveDiv0");
		if (elem) elem.style.background=strBtnSelClass;
	}
	popHighlight=0;

    var left = btnNewDrive.offsetY+btnNewDrive.offsetWidth;
    var top = btnNewDrive.offsetX;
    oPopup.document.body.innerHTML = oDrivePopup.innerHTML;
    oPopup.show(top, left, popWidth, popHeight, btnNewDrive);
}

//-----------------------------------------------------------------------------
function dlgOnNewFolder()
{
	// prompt for new folder name
	var strTitle = portalObj.getPhrase("lblNewFolder");
	var strPrompt = portalObj.getPhrase("lblNewFolderPrompt");
	var newFolder = portalWnd.cmnDlg.prompt(strTitle, strTitle, strPrompt, window); 
	newFolder = portalWnd.strTrim(newFolder);
	if (!newFolder) return;

	// validate folder doesn't exist
	var path = strCurFolder + "\\" + newFolder;
	if (fso.FolderExists(path))
	{
		var msg = portalObj.getPhrase("lblFolderAlreadyExists") + ": "+ path;
		portalWnd.cmnDlg.messageBox(msg,"ok","alert",window);
		return;
	}

	// catch any errors in creating the new folder
	try {
		fso.CreateFolder(path);		
	} catch (e) {
		var msg = portalObj.getPhrase("lblErrorCreatingFolder") + ": "+ path;
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		return;
	}

	// make the new folder the current selection
	dlgLoadFolders(path);
}

//-----------------------------------------------------------------------------
function dlgOnDriveMouseOver(elem)
{
	var idx=parseInt(elem.id.substr(8));
	if (idx != popHighlight)
	{
		var hElem=oPopup.document.getElementById("driveDiv"+popHighlight);
		if (hElem) dlgOnDriveMouseOut(hElem);
	}
	elem.style.background=strBtnSelClass;
	popHighlight=idx;
}

//-----------------------------------------------------------------------------
function dlgOnDriveMouseOut(elem)
{
	elem.style.background=strBtnClass;
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
			var elem=oPopup.document.getElementById("driveDiv"+popHighlight);
			dlgChangeDrive(elem);
			bCaught=true;
			break;

		case 38:			// up arrow
			if (popHighlight > 0)
			{
				var elem=oPopup.document.getElementById("driveDiv"+popHighlight);
				if (elem) elem.style.background=strBtnClass;
				popHighlight -= 1;
				elem=oPopup.document.getElementById("driveDiv"+popHighlight);
				if (elem) elem.style.background=strBtnSelClass;
				bCaught=true;
			}
			break;

		case 40:			// down arrow
			if (popHighlight < (popLength-1))
			{
				var elem=oPopup.document.getElementById("driveDiv"+popHighlight);
				if (elem) elem.style.background=strBtnClass;
				popHighlight += 1;
				elem=oPopup.document.getElementById("driveDiv"+popHighlight);
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
	oPopup.hide();

	var drive=driveElem.getAttribute("drive");
	strRootFolder=drive+":\\";
	strStartFolder="";
	dlgLoadFolders(strRootFolder);
}

//-----------------------------------------------------------------------------
function dlgGetFolderXml(folder)
{
	try	{
		var xmlFileList=portalWnd.objFactory.createInstance("DOM");
		var xmlRtNode=xmlFileList.createElement("LIST");
		xmlFileList.documentElement=xmlRtNode;
		xmlRtNode.setAttribute("path",folder);

		var oFolder=null;
		try {
			oFolder=fso.getFolder(folder);
		} catch (e) {
			window.setTimeout("dlgGetFolderXml('"+strRootFolder+"')",10);
			return;
		}
		if (!oFolder) return null;
		var cFolders=oFolder.subFolders;
		var en=new Enumerator(cFolders);
		for(;!en.atEnd();en.moveNext())
		{
			var oSubFolder=en.item();
			// if hidden or system folder, skip it
			if ( (oSubFolder.attributes & 2)
			|| (oSubFolder.attributes & 4))
				continue;
			var xmlFolder=xmlFileList.createElement("FOLDER");
			xmlFolder.appendChild(xmlFileList.createCDATASection(oSubFolder.name));
			xmlRtNode.appendChild(xmlFolder);
		}
		return xmlFileList;

	} catch (e)	{
		portalWnd.oError.displayExceptionMessage(e,"dialogs/foldersel.js","dlgGetFolderXml",window);
	}
	return null;
}

//-----------------------------------------------------------------------------
function dlgGetDriveTypeIcon(type)
{
	var icoName="";
	switch (type)
	{
	case 1:
		icoName="ico_drive_floppy.gif";
		break;
	case 3:
		icoName="ico_drive_net.gif";
		break;
	case 4:
		icoName="ico_drive_cd.gif";
		break;
	default:
		icoName="ico_drive.gif";
		break;
	}
	return (icoName);
}
