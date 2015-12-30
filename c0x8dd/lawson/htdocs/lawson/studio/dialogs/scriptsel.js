/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/dialogs/scriptsel.js,v 1.4.28.2 2012/08/08 12:48:48 jomeli Exp $ */
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

var studioWnd=null
var scriptDir="";

//-----------------------------------------------------------------------------
function incInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	studioWnd=wndArguments[0]
	var ds=wndArguments[1]
	scriptDir=wndArguments[2]
	lblScriptFolder.innerText=scriptDir;

	// load the files
	incLoadFiles(ds)

	document.body.style.visibility="visible"
	if (btnOK.disabled)
		btnCancel.focus()
	else
		btnOK.focus()
	window.returnValue=null
}

//-----------------------------------------------------------------------------
function incLoadFiles(ds)
{
	var oDirXML = studioWnd.fileMgr.getList("filelist", 
				studioWnd.contentPath+"/scripts", "*.js", false)
	if (oDirXML==null)
	{
		// error with FileMgr: don't allow updates
		studioWnd.cmnDlg.messageBox(pageXLT.selectSingleNode("//phrase[@id='msgNoFolder']").text +
			": " + scriptDir,"ok","stop",window)
		btnOK.disabled=true
		window.close()
		return;
	}

	// transform the file list
	var path=studioWnd.studioPath+"/dialogs/scriptsel.xsl"
	var oXsl = studioWnd.xmlFactory.createInstance("DOM");
	oXsl.async=false
	oXsl.load(path)
	if (oXsl.parseError.errorCode != 0)
	{
		studioWnd.displayDOMError(oXsl.parseError,path)
		window.close()
		return;
	}

	filediv.innerHTML=oDirXML.transformNode(oXsl)

	// any files?
	if (!oDirXML.selectSingleNode("//FILELIST/FILE"))
	{
		// no files, display message...
		studioWnd.cmnDlg.messageBox(pageXLT.selectSingleNode("//phrase[@id='msgNoFiles']").text +
			": " + scriptDir,"ok","info",window)
		window.close()
		return;
	}

	// select any in the list?
	if (typeof(ds) == "undefined" || ds==null) return;
	var len=selFiles.options.length
	if (len < 1) return;

	for (var i = 0; i < ds.length; i++)
	{
		var filename=ds.getItem("file"+(i+1)).value
		for (var j = 0; j < len; j++)
		{
			if (filename == selFiles.options[j].value)
			{
				selFiles.options[j].selected=true;
				break;
			}
			if (filename < selFiles.options[j].value)
				break;		// options are sorted
		}
	}
}

//-----------------------------------------------------------------------------
function incOnKeyPress()
{
	var bHandled=false
	if (event.keyCode==13)		// enter
	{
		if (document.activeElement.id == "btnCancel") return false
		if (document.activeElement.id != "btnOK"
		&& document.activeElement.id.substr(0,3) == "btn")
			return false
		document.all.btnOK.click()
		bHandled=true
	}
	else if (event.keyCode==27)	// ESC
	{
		document.all.btnCancel.click()
		bHandled=true
	}
	if (bHandled)
	{
		event.cancelBubble=true
		event.returnValue=false
		return true
	}
	return false
}

//-----------------------------------------------------------------------------
function incOK()
{
	var ds = new studioWnd.DataStorage();
	var count=0;
	var len = selFiles.options.length;
	var getCall=studioWnd.servicesPath+"/FileMgr?action=get&folder="+scriptDir+"&name=";
	for ( var i = 0; i < len; i++ )
	{
		if (selFiles.options[i].selected)
		{
			count += 1;
			ds.add("file"+count,getCall+selFiles.options[i].value);
		}
	}
	if (count < 1) 
		window.returnValue=null;
	else
		window.returnValue=ds;

	// all done
	window.close()
}
