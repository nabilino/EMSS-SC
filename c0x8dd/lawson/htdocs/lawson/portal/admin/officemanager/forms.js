/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/admin/officemanager/forms.js,v 1.31.2.14.4.18.12.2.2.3 2012/08/08 12:37:24 jomeli Exp $ */
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
// form functions for office manager
//-----------------------------------------------------------------------------

// user has selected "edit bookmark".
// display general, webuser, and then group access
function loadBookmarkAccess( bookmarkId, bookmarkName )
{
	hideHelp()
	hideIFrame()
	accessLoaded = true
	oFrm=null
	groupAccessIds = new Array()
	webuserAccessIds = new Array()

	// store access images for toggling
	arrAccessImages=new Array()

	// dme call to get bookmark specs
	var query = "PROD=LOGAN" +
			"&FILE=LOBKMARK" +
			"&FIELD=ACCESS" +
			"&INDEX=LOBSET1" +
			"&OUT=XML" +
			"&KEY=" + portalWnd.trim(bookmarkId)
			
	var req = new portalWnd.DMERequest(portalWnd, query);
	var res = req.getResponse(true);
	if (!res.isValid())
	{
		window.status = res.error;
		return null;
	}

	// determine bookmark access
	var access = res.getRecordValue(0,0);
	req = null;
	res = null;
	var oldaccessbookmarkid = accessbookmarkid;
	
	// remember bookmark attributes
	accessbookmarkid = portalWnd.trim(bookmarkId)
	accessbookmarkname = bookmarkName
	accessbookmarkaccess = access
	
	if (oldaccessbookmarkid!=accessbookmarkid)
		closeAccessWindows();
	
	abandonChildren(lyrFormArea)

	var divNode = document.createElement("div")
	divNode.id = bookmarkId
	divNode.bookmarkname = bookmarkName
	divNode.canHide = true
	divNode.className = "xTFormTitleBar"
	divNode.style.width = "95%" //#101875 <100%
	divNode.style.height = "28px";

	var tableNode = document.createElement("table")
	tableNode.cellPadding = 0
	tableNode.cellSpacing = 0
	tableNode.style.width = "100%"
	var rowNode = tableNode.insertRow(tableNode.rows.length)
	rowNode.className = "xTFormTitleBar";

	// col 0 - icon
	var cellNode = rowNode.insertCell(0);
	cellNode.style.width = "16px"
	var bookimgNode = document.createElement("button");
	bookimgNode.className = "xTBookClosed";
	bookimgNode.style.width = "16px";
	cellNode.appendChild(bookimgNode);
	
	// col 1 - name
	cellNode = rowNode.insertCell(1);
	// LO12.1 may allow untitled bookmarks
	var n=portalWnd.trim(bookmarkName)
	if (!n)
		n="[ " + subMsgs.getPhrase("LBL_UNTITLED") + " ]"
	var p = camelCase(n + " - " + accessPhrase)
	cellNode.innerHTML = p;
	
	// col 2 - access label
	cellNode = rowNode.insertCell(2);
	cellNode.style.textAlign = "right";
	cellNode.innerHTML = defaultPhrase + " " + accessPhrase;

	// col 3 - access icon
	cellNode = rowNode.insertCell(3);
	cellNode.style.textAlign = "right"
	btn = document.createElement("button");
	btn.accessType = "bookmark";
	btn.accessStd = "bookmark";
	btn.className = getAccessStyle(access);
	btn.onclick = reverseAccessClick;
	btn.title = defaultPhrase + " " + getAccessPhrase(access);
	arrAccessImages["everybody"]=btn;

	cellNode.appendChild(btn);
	divNode.appendChild(tableNode)
	lyrFormArea.appendChild(divNode)
	
	loadGroupBookmarkAccess( bookmarkId )
	loadUserBookmarkAccess( bookmarkId )

	showFormArea()
}

//-----------------------------------------------------------------------------
// get bookmark access for groups
function loadGroupBookmarkAccess(bookmark)
{
	var query = "PROD=LOGAN" +
			"&FILE=LOGRPBKMRK" +
			"&FIELD=group;access;" +
			"&INDEX=GPPSET2" +
			"&KEY=" + portalWnd.trim(bookmark) +
			"&EXCLUDE=DRILL;KEYS;SORTS" +
			"&MAX=600" +
			"&OUT=XML";

	try {
		var req = new portalWnd.DMERequest(portalWnd, query);
		var res = req.getResponse(true);

		// if valid, render
		if (res.isValid())
		{
			renderAccess(res.resDoc,"group");
			window.status = "";
		}
		else
		{
			window.status = error;
		}
		req = null;
		res = null;

	} catch (e)	{
		var msg=subMsgs.getPhrase("LBL_GROUP_ACCESS_NOT_FOUND");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		window.status = msg;
	}
}

//-----------------------------------------------------------------------------
// get bookmark access for users
function loadUserBookmarkAccess(bookmark)
{
	var query = "PROD=LOGAN" +
			"&FILE=LOUSRBKMRK" +
			"&FIELD=web-user;access;" +
			"&INDEX=USPSET2" +
			"&KEY=" + portalWnd.trim(bookmark) +
			"&EXCLUDE=DRILL;KEYS;SORTS" +
			"&MAX=600" +
			"&OUT=XML";

	try {
		var req = new portalWnd.DMERequest(portalWnd, query);
		var res = req.getResponse(true);
		
		// if valid, render
		if (res.isValid())				
		{
			renderAccess(res.resDoc, "webuser");
			window.status = "";
		}
		else
			window.status = res.error;
			
		req = null;
		res = null;

	} catch (e)	{
		var msg=subMsgs.getPhrase("LBL_USER_ACCESS_NOT_FOUND");
		portalWnd.displayExceptionMessage(e,"admin/officemanager/forms.js","loadUserBookmarkAccess",msg)
		window.status = msg;
	}
}

//-----------------------------------------------------------------------------
// render an access list
// called by loadGroupBookmarkAccess, loadUserBookmarkAccess
function renderAccess(oUsrXml,accessStd)
{
	// get dme description of "Webuser"
	var arrCOLUMN = oUsrXml.getElementsByTagName(TAG_COLUMN)
	var accessType = arrCOLUMN[0].getAttribute(ATTR_DISPLAYNAME)
	var re = /-/g;
	accessType = accessType.replace( re, "");
	accessType = accessType.toLowerCase();
	
	// get dme description of "Access"
	if (!accessPhrase)
	{
		accessPhrase = arrCOLUMN[1].getAttribute("dspname")
		accessPhrase = accessPhrase.replace( re, " " )
	}
	
	// create webuser access div
	var divNode = document.createElement("div")
	divNode.style.width="95%" //#101875 <100%
	divNode.canHide = true

	// category table
	var tableNode = document.createElement("table")
	tableNode.className = "xTFormTitleBar"
	tableNode.cellPadding = 0
	tableNode.cellSpacing = 0
	tableNode.style.height = "20px"
	tableNode.style.border = "0px"
	
	var rowNode = tableNode.insertRow(tableNode.rows.length)

	// row 0, cell 0, group or webuser
	var cellNode = rowNode.insertCell(0);
	var strHeading = (accessType == "group" ? subMsgs.getPhrase("LBL_GROUP") : subMsgs.getPhrase("LBL_USER"));
	cellNode.innerHTML = camelCase(strHeading);
	
	// row 0, cell 1, Remove All
	cellNode = rowNode.insertCell(1);
	cellNode.style.textAlign = "right"
	cellNode.style.verticalAlign = "bottom"
	cellNode.style.width = "200px";
	var btn = document.createElement("button");
	btn.innerHTML = removeAllPhrase;
	btn.accessType = accessType.replace(/ /g,'');
	btn.accessStd = accessStd;
	btn.id = "btn_" + btn.accessType;
	btn.className = "xTClearButton";
	btn.onclick = accessRemoveAllClick;
	cellNode.appendChild(btn);
	
	// row 0, cell 2, Add
	cellNode = rowNode.insertCell(2);
	cellNode.style.textAlign = "right"
	cellNode.style.verticalAlign = "bottom"
	cellNode.style.width = "100px";
	
	var btn = document.createElement("button");
	btn.innerHTML = addPhrase;
	btn.accessType = accessType.replace(/ /g,'');
	btn.accessStd = accessStd;
	btn.className = "xTClearButton";
	btn.onclick = accessAddClick;
	cellNode.appendChild(btn);

	divNode.appendChild(tableNode)

	// webusers with specified access to this bookmark
	var arrRECORD = oUsrXml.getElementsByTagName(TAG_RECORD)
	var nRECORD = ((arrRECORD==null)?0:arrRECORD.length)
	
	// show dashes or records
	if (nRECORD==0)
	{
		tableNode = document.createElement("table")
		tableNode.cellPadding = 0
		tableNode.cellSpacing = 0
		tableNode.style.width = "100%"

		rowNode = tableNode.insertRow(tableNode.rows.length)

		cellNode = rowNode.insertCell(rowNode.cells.length)
		cellNode.className = "xTLabel"
		cellNode.style.textAlign = "left"
		cellNode.innerHTML = "&nbsp;&nbsp;" + portalObj.getPhrase("NO_RECORDS_EXIST");
		divNode.appendChild(tableNode)
	}
	else
	{ // nRECORD > 0
		// header
		tableNode = document.createElement("table")
		tableNode.className = "xTTableList"
		tableNode.cellPadding = 0
		tableNode.cellSpacing = 1
		tableNode.style.border = "0px"
		tableNode.style.textAlign = "center"

		rowNode = tableNode.insertRow(tableNode.rows.length)
		rowNode.className = "xTTableColumnHeader";

		// row 1, cell 0, accessType
		cellNode = rowNode.insertCell(rowNode.cells.length);
		cellNode.style.width = "50%";
		cellNode.innerHTML = "&nbsp;";
		
		// row 0, cell 1, accessPhrase
		cellNode = rowNode.insertCell(rowNode.cells.length);
		cellNode.style.width = "25%";
		cellNode.innerHTML = camelCase(accessPhrase);

		// row 0, cell 2, removePhrase
		cellNode = rowNode.insertCell(rowNode.cells.length);
		cellNode.style.width = "25%";
		cellNode.innerHTML = camelCase(removePhrase);
		
		divNode.appendChild(tableNode);

		// webuser bookmark access
		var btn = null;
		var namePhrase
		var access
		var arrCOL
			
		for (var iRECORD = 0; iRECORD < nRECORD; iRECORD++)
		{
			if (isIE)
			{
				arrCOL = arrRECORD[iRECORD].getElementsByTagName(TAG_COL)
				namePhrase = arrCOL[0].firstChild.nodeValue
				access = arrCOL[1].firstChild.nodeValue
			}
			else
			{
				arrCOL=getNodeChildElementsByTagName(arrRECORD[iRECORD],TAG_COL)
				for (var k=0;k<arrCOL[0].childNodes.length;k++) {
					if (arrCOL[0].childNodes[k].nodeType==4) {					
						namePhrase = arrCOL[0].childNodes[k].nodeValue
						break
					}
				}
				for (var k=0;k<arrCOL[1].childNodes.length;k++) {
					if (arrCOL[1].childNodes[k].nodeType==4) {					
						access = arrCOL[1].childNodes[k].nodeValue
						break
					}
				}
			}

			rowNode = tableNode.insertRow(tableNode.rows.length)
		
			// row i, cell 0, namePhrase
			cellNode = rowNode.insertCell(0);
			cellNode.className = "xTLabel"
			cellNode.style.textAlign = "left"
			cellNode.style.width = "50%";
			cellNode.style.fontSize = "12px";
			cellNode.innerHTML = namePhrase;
				
			// row i, cell 1, accessPhrase
			cellNode = rowNode.insertCell(1);
			cellNode.style.textAlign = "center"
			cellNode.style.width = "25%"
				
			btn = document.createElement("button");
			btn.access = access;
			btn.accessType = accessType.replace(/ /g,'');
			btn.accessStd = accessStd;
			btn.className = getAccessStyle(access);
			btn.onclick = accessClick;
			btn.record = namePhrase;
			
			switch (btn.accessStd)
			{
			case "webuser":
				webuserAccessIds[webuserAccessIds.length]=namePhrase;
				break;
			case "group":
				groupAccessIds[groupAccessIds.length]=namePhrase;
				break;
			}
			btn.title = ((btn.accessStd== "webuser") ? subMsgs.getPhrase("LBL_USER") : "")
					+ ((btn.accessStd == "group") ? subMsgs.getPhrase("LBL_GROUP") : "")
					+ (" " + getAccessPhrase(access));
			arrAccessImages[btn.accessType+"_"+btn.record]=btn;
			cellNode.appendChild(btn);
	
			// row i, cell 2, removePhrase
			cellNode = rowNode.insertCell(2);
			cellNode.style.textAlign = "center"
			cellNode.style.width = "25%"
			
			var btn = document.createElement("button");
			btn.accessType = accessType.replace(/ /g,'');
			btn.accessStd = accessStd;
			btn.className = "xTDelete";
			btn.record = namePhrase;
			btn.onclick = deleteAccessClick;
			btn.title = removePhrase;
			cellNode.appendChild(btn);
		} // for i
	} // nRECORDS > 0
	
	textNode = document.createElement("br")
	divNode.appendChild(textNode)
	lyrFormArea.appendChild(divNode)
}

//-----------------------------------------------------------------------------
// opens up custom form to add a top-level bookmark. 
// NOTE:  this form has a custom script that runs after the user adds a bookmark.
function loadBookmarkAddTop()
{
	popupHide(true);

	addLoaded = false
	editLoaded = false
	accessLoaded = false
	loadForm()

	iFrameNode.style.visibility="visible"
	formareaTitleBar.style.visibility="visible"
	oFrm=null

	portalWnd.cmnSetElementText(formareaTitleBar,subMsgs.getPhrase("LBL_ADD_BOOKMARK_TOP"))

	portalWnd.formTransfer("LO12.1","LOGAN", iFrameNode,"","BKMRKADDTOP","page")
}

//-----------------------------------------------------------------------------
// opens up custom form to add a child bookmark. 
// NOTE:  this form has a custom script that to get the ParSeq number when it loads
// and it calls a nodeRefresh function after the user adds the child bookmark.
function loadBookmarkAdd( key, seq, lyr )
{
	addLoaded = true
	editLoaded = false
	accessLoaded = false
	loadForm()

	iFrameNode.style.visibility="visible"
	formareaTitleBar.style.visibility="visible"
	oFrm=new Object()
	oFrm.globalParSeq=seq
	oFrm.bookmarkID=portalWnd.trim(key)
	oFrm.bookmarkName=activesourcebookmark
	oFrm.refNode=lyr
	oFrm.titleNode = formareaTitleBar
	oFrm.titleString = " - " + subMsgs.getPhrase("LBL_ADD_CHILD")

	// LO12.1 may allow untitled bookmarks
	var n=portalWnd.trim(activesourcebookmark)
	if (!n)
		n="[ " + subMsgs.getPhrase("LBL_UNTITLED") + " ]"
	var s=camelCase(n + oFrm.titleString)
	portalWnd.cmnSetElementText(oFrm.titleNode,s)

	portalWnd.formTransfer("LO12.1","LOGAN",iFrameNode,"","BKMRKADDCHILD","page")
}

//-----------------------------------------------------------------------------
// opens up custom form to edit a bookmark.
// NOTE:  this form has custom script to keep the information in the custom form current with
// 		  the information of the bookmark that the user clicks on.
function loadBookmarkEdit( key, seq, lyr )
{
	addLoaded = false
	editLoaded = true
	accessLoaded = false
	portalWnd.cmnSetElementText(formareaTitleBar,subMsgs.getPhrase("LBL_EDIT"))
	loadForm()
	
	iFrameNode.style.visibility="visible"
	formareaTitleBar.style.visibility="visible"
	oFrm=new Object()
	oFrm.globalParSeq=seq
	oFrm.bookmarkID=portalWnd.trim(key)
	oFrm.refNode=lyr
	oFrm.titleNode = formareaTitleBar
	oFrm.titleString = " - " + subMsgs.getPhrase("LBL_EDIT")

	// LO12.1 may allow untitled bookmarks
	var n=portalWnd.trim(activesourcebookmark)
	if (!n)
		n="[ " + subMsgs.getPhrase("LBL_UNTITLED") + " ]"
	var s=camelCase(n + oFrm.titleString)
	portalWnd.cmnSetElementText(oFrm.titleNode,s)

	portalWnd.formTransfer("LO12.1","LOGAN",iFrameNode,key,"BKMRKEDIT","page")
}

//-----------------------------------------------------------------------------
function loadForm()
{
	closeAccessWindows();
	hideFormArea();
	hideHelp();
}

//-----------------------------------------------------------------------------
// changes node to allow renaming a bookmark
function loadBookmarkRename( param, seq, bookmark, layer )
{
	var anch = layer.anch;
	if (!anch)
	{
		renaming = false;
		renameparam = "";
		renameseq = "";
		renamebookmark = "";
		renamelayer = null;
		return;
	}
	renaming = true
	renameparam = param
	renameseq = seq
	renamebookmark = bookmark
	renamelayer = layer
	
	detCoords(anch);

	var oLeft = anch.detLeft - ((isIE) ? 11 : 3);
	var oHeight = anch.detHeight + 4
	var oWidth = anch.detWidth + 4
	var oTop = (isIE) ? parseInt(anch.style.pixelTop,10) + 1 : parseInt(anch.style.top,10) + 1;
	var offset = 2;

	lyrRename = document.createElement("span")
	lyrRename.style.visibility = 'hidden'
	inputRename = document.createElement("input")
	inputRename.id = "txt" + activesourceid
	inputRename.className = "xTTreeNodeEdit"
	inputRename.onblur = inputRenameBlur
	inputRename.ondblclick = inputRenameDblClick
	inputRename.onkeypress = inputRenameKeyPress
	inputRename.onclick = inputRenameClick
	inputRename.maxlength = 24
	inputRename.size = 29
	inputRename.style.zIndex = "0"
	lyrRename.appendChild(inputRename)
	lyrRename.inputRename = inputRename
	lyrRename.style.position = "absolute"

	anch.appendChild(lyrRename)
	anch.lyrRename = lyrRename
	
	inputRename.value = renamebookmark
	
	lyrRename.style.left = (oLeft-offset) + "px"
	lyrRename.style.top = (oTop-offset) + "px"
	lyrRename.style.height = (oHeight+2*offset) + "px"
	lyrRename.style.width = (oWidth+2*offset) + "px"

	lyrRename.style.visibility = 'visible'
	try	{
		inputRename.focus();
		inputRename.select();
	} catch (e)	{
		// unexpected call to method or property access
	}
}

//-----------------------------------------------------------------------------
// intercept double click during a rename
function inputRenameDblClick(e)
{
	return true;
}

//-----------------------------------------------------------------------------
// intercept click during a rename
function inputRenameClick(e)
{
	return true;
}

//-----------------------------------------------------------------------------
// intercept key presses during a rename
function inputRenameKeyPress(e)
{
	e = portalWnd.getEventObject(e,window);
	if ( (isIE && e.keyCode == 13) || (!isIE && e.which == 13))
	{
		inputRenameBlur()
		return true
	}
	else
	{
		// should not have to do this, but looks like IE is not using either
		// the maxlength or the style.maxLength properties
		// removed because it was causing errors with double - clicking of words!
		var maxlength = inputRename.maxlength
		if (maxlength)
			if (inputRename.value.length>maxlength)
				inputRename.value=inputRename.value.substring(0,maxlength)
		return true
	}
}

//-----------------------------------------------------------------------------
// blurred away from a bookmark name
function inputRenameBlur()
{
	if (renaming)
	{
		renaming = false
		if (inputRename && renamelayer)
		{
			var newname = inputRename.value
			//renamelayer.style.visibility = 'hidden'
			var anch = renamelayer.anch
	
			// make sure newname is real
			if(newname && (renamebookmark != newname))
			{
				try {
					var api = portalWnd.AGSPath + "?_PDL=LOGAN&" +
						"_TKN=LO12.1&"+
						"_LFN=TRUE&" +
						"_EVT=CHG&" +
						"_RTN=MSG&" +
						"_TDS=IGNORE&" +
						"_OUT=XML&" +
						"FC=C&" +
						"LOB-BOOK-MARK=" + portalWnd.trim(renameparam) + "&" +
						"LOB-NAME=" + escape(newname) + "&" +
						"_EOT=TRUE";
						
					// get request storage
					portalObj.setMessage(portalObj.getPhrase("LBL_LOADING"));
					var oXml = portalWnd.httpRequest(api, null, "", "", false);
					portalObj.setMessage("");

					var msg=portalObj.getPhrase("LBL_ERROR") + " - " + portalObj.getPhrase("AGSXMLERROR");
					portalWnd.oError.setMessage("");
					if (portalWnd.oError.isErrorResponse(oXml,true,true,false,msg,window))
						return;
					
					var objRename = portalWnd.oError.getDSObject();
					
					// message and message number
					var message = objRename.getElementValue(TAG_MESSAGE);
					var msgnbr = parseInt(objRename.getElementValue(TAG_MSGNBR),10);
					if ((message == "") && (msgnbr != 0))
						message = portalObj.getPhrase("LBL_AGS_ERROR") + " " + msgnbr;
					portalObj.setMessage(message);

					// message number 0 == success
					if(msgnbr == 0)
					{
						dirty()
						portalWnd.cmnSetElementText(anch,newname)
						
						// update title
						var titleExtra = anch.title.split(renamebookmark)[1];
						anch.title = newname + titleExtra;
						
						renamelayer.bookmarkname = newname
						
						//refresh if currently editing
						renamebookmark = newname
						if (
							( (addLoaded || editLoaded)
							&& (oFrm!=null)
							&& (oFrm.bookmarkID == portalWnd.trim(renameparam) )
							) || (accessLoaded && (accessbookmarkid = portalWnd.trim(renameparam) ) )
						)
							if (!updateForm(renameparam,renameseq,renamebookmark,renamelayer,true))
								return;
					}
					// show error message, if exists
					else
						portalWnd.cmnDlg.messageBox(message,"ok","stop",window);

					objRename = null;
				}
				catch (e)
				{
					var msg = portalObj.getPhrase("LBL_ERROR") + " - " + portalObj.getPhrase("AGSXMLERROR");
					portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
				}
			}

			try	{
				lyrRename.inputRename.blur();
				lyrRename.style.visibility = "hidden";
			} catch (e)	{
				// occasionally will get: unexpected call to method or property access
			}
			renamebookmark = null;
			renamelayer = null;
		}
	}
	lyrRename.style.visibility = 'hidden';
}

//-----------------------------------------------------------------------------
function accessAddClick(e)
{
	// determine bookmark and reverse access
	e = portalWnd.getEventObject(e,window);
	var elem = portalWnd.getEventElement(e);
	if (!elem) return;

	var type = elem.accessType; // accessType is bookmark, webuser, or group
	if (type != "webuser" && type != "group")
		return;

	var iosVersion = portalWnd.oPortalConfig.getShortIOSVersion();
	var url = portalObj.path + "/admin/officemanager";
	if (type == "webuser")
		url+="/bookmarkuser.htm";
	else
		url+="/bookmarkgroup.htm";
	
	// open the appropriate search/add window
	var params = "dependent=yes,toolbar=no,location=no,status=no,menubar=no," + 
				"scrollbars=no,resizable=yes,width=450,height=470";
	var wnd=window.open(url,'officeadd',params);
	arrWindows[arrWindows.length]=wnd;
	wnd.focus();
}

//-----------------------------------------------------------------------------
function accessRemoveAllClick(e)
{
	// determine type
	e = portalWnd.getEventObject(e,window);
	var t = portalWnd.getEventElement(e);
	if (t)
	{
		var sConfirm = removeAllPhrase + " " + accessPhrase.toLowerCase() + " - " + t.accessType + "?";
		if(!confirm( sConfirm ) )
			return;
		oFeedBack.show();
		setTimeout("accessRemoveAll('"+t.id+"')",50);
	}
}

//-----------------------------------------------------------------------------
function accessRemoveAll(id)
{
	var t=document.getElementById(id);
	if (t)
	{
		var arr=null;
		switch (t.accessStd)
		{
			case "group":
				arr=groupAccessIds;
				break;
			case "webuser":
				arr=webuserAccessIds;
				break;
		}
		var len=(arr?arr.length:0);
		for (var i=len-1;i>=0;i--)
		{
			deleteAccess(t.accessStd, arr[i], accessbookmarkid);
		}
		oFeedBack.hide();
	}
}

//-----------------------------------------------------------------------------
// user clicked on access for bookmark
function accessClick(e)
{
	// determine bookmark and reverse access
	e = portalWnd.getEventObject(e,window);
	var t = portalWnd.getEventElement(e);
	if (t)
	{
		var which = t.accessStd; // accessStd is bookmark, webuser, or group
		var id = t.record; // record can be webuserid or groupid
		var bookmark = accessbookmarkid;
		var access = t.access;
		reverseAccess(which, id, bookmark, access);
	}
}

//-----------------------------------------------------------------------------
// user clicked on remove access for bookmark
function deleteAccessClick(e)
{
	// determine bookmark and delete access
	e = portalWnd.getEventObject(e,window);
	var t = portalWnd.getEventElement(e);
	if (t)
	{
		var which = t.accessStd; // accessStd is bookmark, webuser, or group
		var id = t.record; // record can be webuserid or groupid
		var bookmark = accessbookmarkid;
		var sConfirm = removePhrase + " " + accessPhrase.toLowerCase() + " - " + which + " \"" + id + "\"?";
		if( !confirm( sConfirm ) )
			return;
		deleteAccess(which, id, bookmark);
	}
}

//-----------------------------------------------------------------------------
// delete a bookmark access record
function deleteAccess(which, id, bookmark)
{
	//user confirm occurs in deleteAccessClick
	var api	= portalWnd.AGSPath + "?_PDL=LOGAN"
		+ "&_EVT=CHG"
		+ "&_RTN=MSG"
		+ "&_OUT=XML"
		+ "&_TDS=Ignore"
		+ "&_LFN=TRUE"
		+ "&FC=D";
	switch (which)
	{
		case "group":
			api	+= "&_TKN=LO13.1"
				+ "&GPP-GROUP=" + escape( id )
				+ "&GPP-BOOK-MARK="	+ escape( portalWnd.trim( bookmark ) );
			break;
		case "webuser":
			api	+= "&_TKN=LO14.1"
				+ "&USP-WEB-USER=" + escape( id )
				+ "&USP-BOOK-MARK="	+ escape( portalWnd.trim( bookmark ) );
			break;
		default:
			return;
			break;
	} 
	try {
		// get request storage
		portalObj.setMessage(portalObj.getPhrase("LBL_LOADING"));
		var oXml = portalWnd.httpRequest(api, null, "", "", false);
		portalObj.setMessage("");

		var msg=portalObj.getPhrase("LBL_ERROR") + " - " + portalObj.getPhrase("AGSXMLERROR");
		portalWnd.oError.setMessage("");
		if (portalWnd.oError.isErrorResponse(oXml,true,true,false,msg,window))
			return;
		
		var objAccess = portalWnd.oError.getDSObject();

		// message and message number
		var message = objAccess.getElementValue(TAG_MESSAGE);
		var msgnbr = parseInt(objAccess.getElementValue(TAG_MSGNBR),10);
		if ((message == "") && (msgnbr != 0))
			message = portalObj.getPhrase("LBL_AGS_ERROR") + " " + msgnbr;
		portalObj.setMessage(message);

		// message number 0 == success
		if (msgnbr == 0)
			// refresh the access display for this bookmark
			loadBookmarkAccess( accessbookmarkid, accessbookmarkname, accessbookmarkaccess);
		// show error message, if exists
		else
			portalWnd.cmnDlg.messageBox(message,"ok","stop",window);
		
		objAccess=null;
	}
	catch (e)
	{
		var msg=portalObj.getPhrase("LBL_ERROR") + " - " + portalObj.getPhrase("AGSXMLERROR");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		return;
	}
}

//-----------------------------------------------------------------------------
// user clicked on global access node
function reverseAccessClick(e)
{
	var which = "everybody"
	var id = ""
	var bookmark = accessbookmarkid
	var access = accessbookmarkaccess
	
	reverseAccess(which, id, bookmark, access)
}

//-----------------------------------------------------------------------------
// reverse a specific access record
function reverseAccess( which, id, bookmark, access )
{
	var sFunction = "";
	var newAccess = ( access == "D") ? "A" : "D";
	var api	= portalWnd.AGSPath + "?_PDL=LOGAN"
		+ "&_EVT=CHG"
		+ "&_RTN=MSG"
		+ "&_OUT=XML"
		+ "&_TDS=Ignore"
		+ "&_LFN=TRUE"
		+ "&FC=C";
	switch (which)
	{
		case "group":
			api += "&_TKN=LO13.1"
				+ "&GPP-GROUP=" + escape( id )
				+ "&GPP-BOOK-MARK=" + escape( portalWnd.trim( bookmark ) )
				+ "&GPP-ACCESS=" + escape( newAccess );
			break;
		case "webuser":
			api += "&_TKN=LO14.1"
				+ "&USP-WEB-USER=" + escape( id )
				+ "&USP-BOOK-MARK=" + escape( portalWnd.trim( bookmark ) )
				+ "&USP-ACCESS=" + escape( newAccess );
			break;
		default:
			api += "&_TKN=LO12.1"
				+ "&LOB-BOOK-MARK=" + escape( portalWnd.trim( bookmark ) )
				+ "&LOB-ACCESS=" + escape( newAccess );
			break;
	}
	try {
		// get request storage
		portalObj.setMessage(portalObj.getPhrase("LBL_LOADING"));
		var oXml = portalWnd.httpRequest(api, null, "", "", false);
		portalObj.setMessage("");

		var msg=portalObj.getPhrase("LBL_ERROR") + " - " + portalObj.getPhrase("AGSXMLERROR");
		portalWnd.oError.setMessage("");
		if (portalWnd.oError.isErrorResponse(oXml,true,true,false,msg,window))
			return;
		
		var objAccess = portalWnd.oError.getDSObject();
		
		// message and message number
		var message=objAccess.getElementValue(TAG_MESSAGE);
		var msgnbr=parseInt(objAccess.getElementValue(TAG_MSGNBR),10);
		if ((message == "") && (msgnbr != 0))
			message = portalObj.getPhrase("LBL_AGS_ERROR") + " " + msgnbr;
		portalObj.setMessage(message);
		
		// message number 0 == success
		if (msgnbr == 0)
		{
			var btn=null;
			var newAlt;
			if (which == "group" || which == "webuser")
			{
				btn=arrAccessImages[which+"_"+id];
				btn.access = newAccess;
				if (which == "webuser") 
					newAlt = subMsgs.getPhrase("LBL_USER");
				else
					newAlt = subMsgs.getPhrase("LBL_GROUP");
			}
			else
			{  // which == "EVERYBODY"
				btn=arrAccessImages["everybody"];
				accessbookmarkaccess = newAccess;
				newAlt=defaultPhrase;
			}
			if (btn)
			{
				btn.className = getAccessStyle(newAccess);
				btn.title = newAlt + " " + getAccessPhrase(newAccess);
			}
		}
		// show error message, if exists
		else
		{
			portalWnd.cmnDlg.messageBox(message,"ok","stop",window);
			return;
		}
		
		objAccess=null;

	} catch (e)	{
		var msg=portalObj.getPhrase("LBL_ERROR") + " - " + portalObj.getPhrase("AGSXMLERROR");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		return;
	}
}

//-----------------------------------------------------------------------------
// Capitalizes the first letter of each word
function camelCase(str)
{
	str=str.toLowerCase();
	//capitalize first letter
	var len=str.length
	if (len)
		str=str.substr(0,1).toUpperCase() + str.substring(1);
	for(var x=1;x<len-1;x++)
	{
		var ch=str.substr(x,1);
		switch (ch)
		{
		case ' ':
		case '-':
			x++;
			var y=str.substr(x,1);
			str=str.replace(ch + y, ch + y.toUpperCase());
			break;
		}
	}
	return(str);
}

//-----------------------------------------------------------------------------
function getAccessStyle(a)
{
	switch (a)
	{
		case "A":
			return "xTUnlocked";
			break;
		case "D":
			return "xTLocked";
			break;
		default:
			return "xTUnspecified";
			break;
	}
}

//-----------------------------------------------------------------------------
function getAccessPhrase(a)
{
	var pid = "";
	switch (a)
	{
		case "D":
			pid = "LBL_IS_DENIED";
			break;
		case "A":
			pid = "LBL_IS_ALLOWED";
			break;
		default:
			break;
	}
	var ret = pid ? accessPhrase.toLowerCase() + " " + subMsgs.getPhrase(pid) : "";
	return ret;
}

//-----------------------------------------------------------------------------
// deletes bookmark, refreshes its node
function deleteBookmark( bookmark )
{
	// prepare ags call
	var functionCode = "E"; // D=Delete, E=DeleteWithChildren, M=Move, O=MoveWithChildren, V=Copy, W=CopyWithChildren

	var api	= portalWnd.AGSPath + "?_PDL=LOGAN&_TKN=LO12.1"
		+ "&_EVT=CHG"
		+ "&_RTN=MSG"
		+ "&_OUT=XML"
		+ "&_TDS=Ignore"
		+ "&_LFN=TRUE"
		+ "&FC=" + functionCode
		+ "&LOB-BOOK-MARK=" + portalWnd.trim( bookmark );
		
	try {
		// get request storage
		portalObj.setMessage(portalObj.getPhrase("LBL_LOADING"));
		var oXml = portalWnd.httpRequest(api, null, "", "", false);
		portalObj.setMessage("");

		var msg=portalObj.getPhrase("LBL_ERROR") + " - " + portalObj.getPhrase("AGSXMLERROR");
		portalWnd.oError.setMessage("");
		if (portalWnd.oError.isErrorResponse(oXml,true,true,false,msg,window))
			return;
		
		var objDelete = portalWnd.oError.getDSObject();

		// message and message number
		var message=objDelete.getElementValue(TAG_MESSAGE);
		var msgnbr=parseInt(objDelete.getElementValue(TAG_MSGNBR),10);
		if ((message == "") && (msgnbr != 0))
			message = portalObj.getPhrase("LBL_AGS_ERROR") + " " + msgnbr;
		portalObj.setMessage(message);
		
		// message number 0 == success
		if (msgnbr == 0)
		{
			dirty();
			nodeRefresh(activesourceparentlayer);
			showHelp();
		}
		// show error message, if exists
		else
			portalWnd.cmnDlg.messageBox(message,"ok","stop",window);
		
		objDelete = null;

	} catch (e)	{
		var msg=portalObj.getPhrase("LBL_ERROR") + " - " + portalObj.getPhrase("AGSXMLERROR");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
	}
}

//-----------------------------------------------------------------------------
// group is now a group resource id
function accessAddGroup(group,wnd)
{
	var trimmedbookmarkid = portalWnd.trim( accessbookmarkid );
	if ( group == "" || trimmedbookmarkid == "" )
	{
		var msg="Invalid value for user or bookmark --> webuser ::  " + 
				group + " -- bookmarkID :: " + trimmedbookmarkid ;
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",wnd);
	}
	else
	{
// todo: LFN=all vs true?
		var api	= portalWnd.AGSPath + "?_PDL=LOGAN&"
			+"_TKN=LO13.1&"
			+"_LFN=TRUE&"		
			+"_EVT=ADD&"
			+"_RTN=MSG&"
			+"_TDS=IGNORE&"
			+"_OUT=XML&"
			+"FC=A&"
			+"GPP-GROUP=" + escape(group) + "&"
			+"GPP-BOOK-MARK=" + escape(trimmedbookmarkid) + "&"
			+"GPP-ACCESS=A&"
			+"_EOT=TRUE";
				
		try {
			// get request storage
			portalObj.setMessage(portalObj.getPhrase("LBL_LOADING"));
			var oXml = portalWnd.httpRequest(api, null, "", "", false);
			portalObj.setMessage("");

			var msg=portalObj.getPhrase("LBL_ERROR") + " - " + portalObj.getPhrase("AGSXMLERROR");
			portalWnd.oError.setMessage("");
			if (portalWnd.oError.isErrorResponse(oXml,true,true,false,msg,wnd))
				return;

			var objAdd = portalWnd.oError.getDSObject();

			// message and message number
			var message = objAdd.getElementValue(TAG_MESSAGE);
			var msgnbr = parseInt(objAdd.getElementValue(TAG_MSGNBR),10);
			if ((message == "") && (msgnbr != 0))
				message = portalObj.getPhrase("LBL_AGS_ERROR") + " " + msgnbr;
			portalObj.setMessage(message);

			// message number 0 == success
			if (msgnbr == 0)
				loadBookmarkAccess(accessbookmarkid, accessbookmarkname);
			// show error message, if exists
			else
				portalWnd.cmnDlg.messageBox(message,"ok","stop",wnd);
				
			objAdd = null;

		} catch (e)	{
			var msg=portalObj.getPhrase("LBL_ERROR") + " - " + portalObj.getPhrase("AGSXMLERROR");
			portalWnd.cmnDlg.messageBox(msg,"ok","stop",wnd);
		}
	}
}

//-----------------------------------------------------------------------------
function accessAddWebuser(webuser,wnd)
{
	var trimmedbookmarkid = portalWnd.trim( accessbookmarkid );
	if ( webuser == '' || trimmedbookmarkid == '' )
	{
		var msg="Invalid value for user or bookmark --> webuser ::  " + 
				webuser + " -- bookmarkID :: " + trimmedbookmarkid;
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",wnd);
	}
	else
	{
		try {
			var api	= portalWnd.AGSPath + "?_PDL=LOGAN&"
				+"_TKN=LO14.1&"
				+"_LFN=TRUE&"
				+"_EVT=ADD&"
				+"_RTN=MSG&"
				+"_TDS=IGNORE&"
				+"_OUT=XML&"
				+"FC=A&"
				+"USP-WEB-USER=" + escape(webuser) + "&"
				+"USP-BOOK-MARK=" + escape(trimmedbookmarkid) + "&"
				+"USP-ACCESS=A&"
				+"_EOT=TRUE";
				
			// get request storage
			portalObj.setMessage(portalObj.getPhrase("LBL_LOADING"));
			var oXml = portalWnd.httpRequest(api, null, "", "", false);
			portalObj.setMessage("");


			var msg=portalObj.getPhrase("LBL_ERROR") + " - " + portalObj.getPhrase("AGSXMLERROR");
			portalWnd.oError.setMessage("");
			if (portalWnd.oError.isErrorResponse(oXml,true,true,false,msg,wnd))
				return;
			
			var objAdd = portalWnd.oError.getDSObject();
			// message and message number
			var message = objAdd.getElementValue(TAG_MESSAGE);
			var msgnbr = parseInt(objAdd.getElementValue(TAG_MSGNBR),10);
			if ((message == "") && (msgnbr != 0))
				message = portalObj.getPhrase("LBL_AGS_ERROR") + " " + msgnbr;
			portalObj.setMessage(message);

			// message number 0 == success
			if(msgnbr == 0)
				loadBookmarkAccess(accessbookmarkid, accessbookmarkname);
			// show error message, if exists
			else
				portalWnd.cmnDlg.messageBox(message,"ok","stop",wnd);
			
			objAdd = null;

		} catch (e){
			var msg=portalObj.getPhrase("LBL_ERROR") + " - " + portalObj.getPhrase("AGSXMLERROR");
			portalWnd.cmnDlg.messageBox(msg,"ok","stop",wnd);
		}
	}
}

//-----------------------------------------------------------------------------
function hideIFrame()
{
	iFrameNode.src=portalObj.path+"/blank.htm"
	addLoaded = false
	editLoaded = false
	accessLoaded = false

	// hide iframe-related elements
	iFrameNode.style.visibility="hidden"
	formareaTitleBar.style.visibility="hidden"
	
	initPortal()
	txtSearch.focus()
}

//-----------------------------------------------------------------------------
function showIFrame(src)
{
	// show iframe-related elements
	iFrameNode.style.visibility="visible"
	formareaTitleBar.style.visibility="visible"
	if (src)
		iFrameNode.src = src
}

//-----------------------------------------------------------------------------
function showFormArea()
{
	lyrFormArea.style.visibility="visible"
}

//-----------------------------------------------------------------------------
function hideFormArea()
{
	lyrFormArea.style.visibility="hidden"
}

//-----------------------------------------------------------------------------
function closeAccessWindows()
{
	var len = arrWindows ? arrWindows.length : 0;
	for (var i=0; i < len; i++)
	{
		try	{
			if (arrWindows[i])
				arrWindows[i].close();
		} catch (e)	{ }
	}
	arrWindows = new Array();
}

//-----------------------------------------------------------------------------
// called from lawform.xsl, lawformc.xsl
function initializeFramework()
{
	if (portalWnd.rfWindow && (typeof(portalWnd.rfWindow.FORM_OnInit)=="function") )
		portalWnd.rfWindow.FORM_OnInit()
}

//-----------------------------------------------------------------------------
function updateForm(param,seq,bookmark,layer,forceRefresh)
{
	// update edit form if exists
	var key = portalWnd.trim(param);
	var bUpdated=true;
	if ((addLoaded || editLoaded) && (oFrm!=null))
	{
		// only refresh if new or force
		if (forceRefresh || (oFrm.bookmarkID != key))
		{
			oFrm.globalParSeq=seq;
			oFrm.bookmarkID=key;
			oFrm.bookmarkName=bookmark;
			oFrm.refNode=layer;
					
			if (portalWnd.rfWindow)
				bUpdated=portalWnd.rfWindow.refreshForm();
			if (!bUpdated)
				return false;

			if ((oFrm.titleNode!=null) && oFrm.titleString)
			{
				var s=camelCase(bookmark + oFrm.titleString);
				portalWnd.cmnSetElementText(oFrm.titleNode,s);
			}
		}
	}
	else if (accessLoaded && (forceRefresh || (accessbookmarkid != key)))
		loadBookmarkAccess( param, bookmark );
	return bUpdated;
}