/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/dialogs/imgsel.js,v 1.4.28.2 2012/08/08 12:48:48 jomeli Exp $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// imgsel.js
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

var oImgXML=null;
var studioWnd=null;
var strSource="";
var imagesDir="";
var getCall="";


//-----------------------------------------------------------------------------
function imgInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	studioWnd=wndArguments[0]
	strSource=wndArguments[1]
	imagesDir=wndArguments[2]
	lblImageFolder.innerText=imagesDir;
	getCall=studioWnd.servicesPath+"/FileMgr?action=get&folder="+imagesDir+"&name=";

	imgLoadList()
	imgOnChange()

	window.returnValue=null;
	document.body.style.visibility="visible"

	if (btnOK.disabled)
		btnCancel.focus()
	else
		selImages.focus()
}

//-----------------------------------------------------------------------------
function imgLoadList()
{
	var oImgXML = studioWnd.fileMgr.getList("filelist", 
				studioWnd.contentPath+"/images", "*.jpg,*.gif")
	if (oImgXML==null)
	{
		// error with Persist: don't allow updates
		btnOK.disabled=true
		return;
	}

 	var fileNodes=oImgXML.selectNodes("//FILE")
	var selIndex=0

	var oOption = document.createElement("option")
	oOption.text=pageXLT.selectSingleNode("//phrase[@id='optNone']").text
	oOption.value="None"
	document.all.selImages.add(oOption)

 	for(var i=0; i < fileNodes.length; i++)
 	{
 		var name = fileNodes[i].text.toLowerCase()
		oOption = document.createElement("option")
		oOption.text=name.substr(0,name.length-4)
		oOption.value=name
		if (strSource==imagesDir+"/"+name)
		{
			oOption.selected=true
			selIndex=selImages.options.length
		}
		document.all.selImages.add(oOption)
 	}
	selImages.selectedIndex=selIndex
}

//-----------------------------------------------------------------------------
function imgOnKeyPress()
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
function imgOnChange()
{
	var selIndex=selImages.selectedIndex;
	if (selIndex == -1) return;

	if (selImages.options[selIndex].value == "None")
		imgTag.src="";
	else
		imgTag.src=getCall + selImages.options[selIndex].value;
}

//-----------------------------------------------------------------------------
function imgSelected()
{
	var selIndex=selImages.selectedIndex;
	if (selIndex == -1) return;

	if (selImages.options[selIndex].value == "None")
		window.returnValue="";
	else
		window.returnValue=getCall + selImages.options[selIndex].value;

	// all done
	window.close();
}

