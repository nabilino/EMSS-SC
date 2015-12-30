/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/admin/officemanager/officemanager.js,v 1.43.2.19.4.14.14.1.2.3 2012/08/08 12:37:24 jomeli Exp $ */
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
var portalObj = null

// xml docs
var treeSource = null
var oXML = null
var oFeedBack=null
var subMsgs = null
var hlpMsgs = null;

// oft used div tags
var navObj = null
var lyrPopup = null
var Tree = null
var lyrDrag = null
var lyrFind = null
var lyrFormArea = null
var lyrRename = null
var inputRename = null
var iFrameNode = null
var formareaTitleBar = null
var txtSearch = null
var scrWidth = 0
var scrHeight = 0
var arrAnchs = null

// mouse events
var hotSpan = null
var dblClickThres = 250
var lastSpanClick = null
var mdX = 0
var mdY = 0
var mX = 0
var mY = 0
var layoutLeft = 0
var layoutTop = 0

// rename
var renaming = false
var renamelayer = null
var renamebookmark = ""
var renameseq = ""
var renameparam = ""

// has add/edit been loaded in lyrFormArea?
var accessLoaded = false
var addLoaded = false
var editLoaded = false			

// used to create unique ids between tree loads
var loadCount = 0

// active source - span was last clicked on
var activesourcebookmark = ""
var activesourceid = ""
var activesourcetype = ""
var activesourceparam = ""
var activesourcelevel = "0"	
var activesourcelayer = null
var activesourceparentlayer = null
var activesourceseq = ""

// active img - img was last clicked on
var activeimgid = ""
var activeimgtype = ""	
var activeimgparam = ""
var activeimglevel = "0"	
var activeimglayer = null
var activeimgparentlayer = null

// javascript clipboard
var isCopy
var activesourceclipid = ""
var activesourcecliptype = ""
var activesourceclipparam = ""
var activesourcecliplevel = "0"
var activesourcecliplayer = null
var activesourceclipparentlayer = null
var activesourceclipseq = ""

// commonly used phrases
var accessPhrase = "";
var	addPhrase = "";
var addTopPhrase = "";
var collapsePhrase = "";
var defaultPhrase = "";
var deletePhrase = "";
var expandPhrase = "";
var	findPhrase = "";
var loadingPhrase = "";
var	nextPhrase = "";
var noChildrenPhrase = "";
var	previousPhrase = "";
var relocatingPhrase = "";
var	removePhrase = "";
var removeAllPhrase ="";
var searchPhrase = "";
var updatingPhrase = "";
var moveAfterPhrase = "";
var moveIntoPhrase = "";
var moveBeforePhrase = "";
var updateQuestion = "";

// remember paging state
var treereload = ""
var	treeprev = ""
var	treenext = ""

var TOP_MAX_RECORDS = 23
var SUB_MAX_RECORDS = 200
var isDirty = false
var isIE = false
var firstseq = ""

var ATTR_COUNT = "count"
var ATTR_DISPLAYNAME = "dspname"

var TAG_COLUMN = "COLUMN"
var TAG_COL = "COL"
var TAG_COLS = "COLS"
var TAG_DME_MESSAGE = "MESSAGE"
var TAG_MESSAGE = "Message"
var TAG_MSGNBR = "MsgNbr"
var TAG_NEXTCALL = "NEXTCALL"
var TAG_PREVCALL = "PREVCALL"
var TAG_RECORD = "RECORD"
var TAG_RECORDS = "RECORDS"

// forms
var oFrm=null
// stored array of images for quick updates to access in lyrFormArea
var arrAccessImages=null;
// used for access screen in lyrFormArea
var accessbookmarkid="";
var	accessbookmarkname="";
var	accessbookmarkaccess="";
var arrWindows=null;

// user and group access ids
var groupAccessIds=null;
var webuserAccessIds=null;

var searchTry;

//-----------------------------------------------------------------------------
function initOfficeManager() 
{
	portalWnd=envFindObjectWindow("lawsonPortal");
	portalObj = portalWnd.lawsonPortal;
	isIE = portalObj.browser.isIE

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	// get office manager messages	
	subMsgs=new portalWnd.phraseObj("officemanager",portalWnd);
	
	// get help messages
	hlpMsgs=new parent.portalWnd.phraseObj("officemanager",parent.portalWnd);

	// check for admin role
	if (!portalWnd.oUserProfile.isPortalAdmin())
	{
		var msg=subMsgs.getPhrase("LBL_OFFICE_MANAGER")+":\n"+
			portalObj.getPhrase("MUST_BE_ADMIN_TO_ACCESS");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		portalWnd.goHome();
		return;
	}

	accessPhrase = subMsgs.getPhrase("LBL_ACCESS");
	addPhrase = portalObj.getPhrase("LBL_ADD");
	addTopPhrase = subMsgs.getPhrase("LBL_ADD_BOOKMARK_TOP");
	bookmarkPhrase = subMsgs.getPhrase("LBL_BOOKMARK");
	collapsePhrase = hlpMsgs.getPhrase("LBL_BOOKMARK_EXPANDED_CHILDREN");
	defaultPhrase = subMsgs.getPhrase("LBL_DEFAULT");
	deletePhrase = portalObj.getPhrase("LBL_DELETE");
	expandPhrase = hlpMsgs.getPhrase("LBL_BOOKMARK_CLOSED");
	findPhrase = portalObj.getPhrase("LBL_FIND");
	loadingPhrase = portalObj.getPhrase("LBL_LOADING");
	nextPhrase = portalObj.getPhrase("LBL_NEXT");
	noChildrenPhrase = hlpMsgs.getPhrase("LBL_BOOKMARK_EXPANDED_NO_CHILDREN");
	moveAfterPhrase = subMsgs.getPhrase("LBL_MOVE_AFTER");
	moveIntoPhrase = subMsgs.getPhrase("LBL_MOVE_INTO");
	moveBeforePhrase = subMsgs.getPhrase("LBL_MOVE_BEFORE");
	previousPhrase = portalObj.getPhrase("LBL_PREVIOUS");
	relocatingPhrase = 	portalObj.getPhrase("LBL_RELOCATING");
	removePhrase = subMsgs.getPhrase("LBL_REMOVE");
	removeAllPhrase = subMsgs.getPhrase("LBL_REMOVE_ALL");
	searchPhrase = portalObj.getPhrase("SEARCH_VALUE_MISSING");
	updatingPhrase = portalObj.getPhrase("LBL_UPDATING");
	updateQuestion = subMsgs.getPhrase("LBL_UPDATE_CACHE_QUESTION");

	// link top-level objects
	var treeTitle = document.getElementById("treeTitle")
	var image_prev = document.getElementById("image_prev")
	var image_next = document.getElementById("image_next")
	var image_search = document.getElementById("image_search")
	lyrDrag = document.getElementById("lyrDrag")
	lyrDrag.style.backgroundColor = "transparent"
	lyrDrag.style.cursor = "move"

	lyrFind = document.getElementById("lyrFind")
	Tree = document.getElementById("Tree")
	lyrPopup = document.getElementById("lyrPopup")
	lyrFormArea = document.getElementById("lyrFormArea")
	formareaTitleBar = document.getElementById("formareaTitleBar")
	iFrameNode = document.getElementById("iFrameNode")
	txtSearch=document.getElementById("txtSearch")
	txtSearch.onkeypress=keyPress

	// assumes messages have been loaded
	// (must come after element variables set)
	initPortal()
	
	var spansearch=document.getElementById("spansearch")
	portalWnd.cmnSetElementText(spansearch,findPhrase)
	spansearch.title = findPhrase
	
	var btnAdd=document.getElementById("btnAdd")
	portalWnd.cmnSetElementText(btnAdd,addPhrase)
	btnAdd.title = addTopPhrase
	
	// create feedback
	oFeedBack = new FeedBack(window,portalWnd);
	
	// initialize top-level objects
	Tree.onclick = TreeOnClick
	lyrPopup.type = ""
	lyrPopup.style.visibility = "hidden"

	portalWnd.cmnSetElementText(treeTitle,portalObj.getPhrase("lbl_BOOKMARKS"))
		
	// Set non-IE positions
	if (!isIE)
	{
		Tree.style.top = parseInt(Tree.style.top,10) + 3;
		Tree.style.width = parseInt(Tree.style.width,10) - 1;
		iFrameNode.style.top = parseInt(iFrameNode.style.top,10) + 3;
	}
	// reposition find box
	sizeFind()
	
	// get tree XML
	popupTreeItems = new Array()
	var popupSource = portalObj.path + "/admin/officemanager/tree.xml"
	treeSource = portalWnd.httpRequest(popupSource)
	if (treeSource.status)
	{
		var msg=portalObj.getPhrase("ERROR_LOAD_XML") + "\n" + popupSource + "\n" + 
				treeSource.status + ": " + treeSource.statusText;
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		return
	}
	treeSource=new portalWnd.DataStorage(treeSource);
	
	// load initial bookmark tree
	initTree()

	// turn off right click and enable popup hide
	document.oncontextmenu = noContextMenu
		
	// reposition find box
	sizeFind()
	showHelp()
	txtSearch.focus()
}

function showHelp()
{
	hideFormArea()
	addLoaded=false
	editLoaded=false
	accessLoaded=false

	iFrameNode.src = portalObj.path + "/admin/officemanager/help.htm"
	iFrameNode.style.visibility = "visible"
	formareaTitleBar.style.visibility="visible"
}

function noContextMenu(e)
{
	if (isIE)
	{
		e=portalWnd.getEventObject(e,window);
		e.cancelBubble = true
		e.returnValue = false
	}
	return false
}

function initTree()
{
	firstseq = null

	// load the tree at the top level, sorted by name
	treereload = "&SELECT=parent-bkmark=0"
	loadTree(Tree,"")
}

// loop through children and set style.display to setting
function setLayerChildrenSetting(layer,setting)
{
	var layerid=layer.id
	var childid
	var childtype
	var childexpand

	for(var i=0; i < layer.childNodes.length; i++)
	{
		childid = layer.childNodes[i].id
		childtype = layer.childNodes[i].nodeType
		childexpand = layer.childNodes[i].canExpand
		if (childexpand)
			layer.childNodes[i].style.display = setting
	}
}

function nodeRefresh( nodelayer )
{
	if( nodelayer.id == "Tree" )
	{
		initTree()
		return
	}
	
	abandonChildren(nodelayer)
	nodelayer.status = "";
	nodelayer.expandstatus = "closed"
		
	nodeExpand(nodelayer)
}

function nodeExpand(node)
{
	var sourceid = node.id
	sourceid = sourceid.substring(0,sourceid.length-4)
	setActiveImg(sourceid)
	imgExpand()
}

///// LOAD

function loadTree(parentlayer,strappend)
{
	// hide old popup
	popupHide()
	var msg="";
	var level
	var maxrec="&MAX="

	if (parentlayer == Tree) {
		level=1
		loadCount++
		arrAnchs=new Array()
		maxrec+=TOP_MAX_RECORDS
	} else {
		level=parentlayer.level+1
		maxrec+=SUB_MAX_RECORDS
	}

	var modTree=treereload
	
	// index from strappend overrides modTree
	var relIndex=modTree.indexOf("&INDEX=")
	var strIndex=strappend.indexOf("&INDEX=")
	if ((relIndex>-1) && (strIndex>-1))
	{
		var after=modTree.substring(relIndex+7)
		var amp=after.indexOf("&")
		modTree=modTree.substring(0,relIndex)+(amp>-1?after.substring(amp):"")
	}

	// select from strappend overrides modTree
	relIndex=modTree.indexOf("&SELECT=")
	strIndex=strappend.indexOf("&SELECT=")
	if ((relIndex>-1) && (strIndex>-1))
	{
		var after=modTree.substring(relIndex+8)
		var amp=after.indexOf("&")
		modTree=modTree.substring(0,relIndex)+(amp>-1?after.substring(amp):"")
	}

	// build api call	
	var api = "PROD=LOGAN&FILE=LOBKMARK&OUT=XML"
		+ "&FIELD=book-mark;parent-bkmark;seq-nbr;name"
		+ modTree + maxrec + strappend;
	if (api.indexOf("INDEX")==-1)
		api += (api.substring(api.length-1)=="&"?"":"&") + "INDEX=LOBSET2";
			
	// replace spaces with escapes
	var c = "";
	var escApi = "";
	for (var i=0;i<api.length;i++) {
		c = api.substring(i,i+1);
		escApi += (c == " ") ? "%20" : c;
	}
	api = escApi;
	
	// assumes portal loads DME.js
	var dmeRequest = new portalWnd.DMERequest(portalWnd, api);
	var res = dmeRequest.getResponse(true);
	if (!res.isValid())
	{	
		window.status = res.error;
		return;
	}
	oXML = res.resDoc;
			
	var records=oXML.getElementsByTagName(TAG_RECORDS)
	if (!records)
	{
		if (parentlayer == Tree)
			abandonChildren(Tree)
		msg=portalObj.getPhrase("ERROR_LOAD_XML")+" (calling data mining engine)";
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		portalWnd.cmnClearStatus();
		return
	}
	
	// process records
	var len = (records[0]?records[0].getAttribute(ATTR_COUNT):0)
	len=(len?parseInt(len,10):0)
	if (!len) {
		if (parentlayer == Tree)
		{
			abandonChildren(Tree);
			if (searchTry != 1)
			{
				msg=subMsgs.getPhrase("LBL_BOOKMARK_NOT_FOUND");
				portalWnd.cmnDlg.messageBox(msg,"ok","alert",window);
			}
		}
		else
		{
			if (typeof(activeimglayer)!="undefined")
				activeimglayer.expandstatus = "empty"
		}
		portalWnd.cmnClearStatus();
		return false;
	}
	
	// if limited by upper bound, tell user
	if (len == SUB_MAX_RECORDS)
	{
		msg=subMsgs.getPhrase("LBL_MAX_CHILD_BOOKMARKS");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
	}

	// prepare prev/next
	if (parentlayer == Tree)
	{
		abandonChildren(Tree)
		treeprev = oXML.getElementsByTagName(TAG_PREVCALL)
		if(treeprev && treeprev.length)
			treeprev=treeprev[0].firstChild.nodeValue
		else
			treeprev=null
		portalObj.toolbar.changeButtonState("prev",treeprev ? "enabled" : "disabled");
					
		treenext = oXML.getElementsByTagName(TAG_NEXTCALL)
		if(treenext && treenext.length)
			treenext=treenext[0].firstChild.nodeValue
		else
			treenext=null
		portalObj.toolbar.changeButtonState("next",treenext ? "enabled" : "disabled");
			
		if (len == 0)
		{
			disableToolbar();
			msg=subMsgs.getPhrase("LBL_BOOKMARK_NOT_FOUND");
			portalWnd.cmnDlg.messageBox(msg,"ok","alert",window);
			return
		}
		else
		{
			portalObj.toolbar.changeButtonState("update","enabled");
			portalObj.toolbar.changeButtonState("refresh","enabled");
		}
	} // parentlayer == Tree
	
	// render tree
	var sourceid
	var divid
	var imgid
	var layerid
	var param
	var bookmarkname
	var seq
	var btn = null;
	
	var strId = portalObj.getPhrase("lblId");
	var strSeq = subMsgs.getPhrase("LBL_SEQUENCE");
	
	for (var i=0; i < len; i++)
	{
		window.status = subMsgs.getPhrase("LBL_PROCESSING_BOOKMARK") + i;
		
		sourceid = (parentlayer == Tree) ? idToLayerId( i+1 ) :
			parentlayer.id + "_" + i+1;
		divid = sourceid + "_div";
		layerid = sourceid + "_lyr";
		imgid = sourceid + "_img";
		
		param = res.getRecordValue(i,0);
		seq = res.getRecordValue(i,2);
		bookmarkname = res.getRecordValue(i,3);
		
		// LO12.1 may allow untitled bookmarks
		if (!portalWnd.trim(bookmarkname))
			bookmarkname="[ " + subMsgs.getPhrase("LBL_UNTITLED") + " ]";

		param = param.replace('\'','%27') // replace the tick with %27 for querystring
		seq=portalWnd.trim(seq)
		if ((firstseq==null) && (seq != "1") )
			firstseq = seq
		var indent = Math.max((25 * parseInt(level-1)),0);
		
		// a tree div - do not specify height, width, allow to auto-flow of contents
		var conNode=document.createElement("span")
		conNode.id = layerid
		conNode.bookmarkname = bookmarkname
		conNode.type = "Bookmark"
		conNode.level = level
		conNode.param = param
		conNode.seq = seq
		conNode.parentlayer = parentlayer
		conNode.expandstatus = "closed"
		conNode.className = "xTItem"
		conNode.style.display = "block" // helps NS find coordinates
		conNode.canHide = true
		conNode.canExpand = true
		conNode.status = ""
		
		// for any value but 200 does not seem to render in netscape
		conNode.style.width = Math.max((200 - indent),0) + "px"

		var tableNode = document.createElement("table")
		tableNode.cellPadding = 0
		tableNode.cellSpacing = 0
		
		var rowNode = tableNode.insertRow(tableNode.rows.length)
		
		// cell 0 - indent +  book image
		var cellNode = rowNode.insertCell(0);
		cellNode.style.width=(indent + 16) + "px";
		btn = document.createElement("button");
		btn.className = "xTBookClosed";
		btn.id = imgid;
		btn.onclick = imgClick;
		btn.style.width = (indent + 16) + "px";
		btn.status = "closed";
		btn.title = expandPhrase;
		cellNode.appendChild(btn);		
		
		// cell 1 - bookmark name
		cellNode = rowNode.insertCell(1);
		btn = document.createElement("button");
		btn.className = "xTButton";
		btn.conNode = conNode;
		btn.id = divid;
		btn.ondblclick = nodeDblClick;
		btn.onmousedown = nodeMouseDown;
		btn.onmouseup = nodeMouseUp;
		// construction required for NS6.  value does not work
		btn.appendChild(document.createTextNode(bookmarkname));
		btn.title = bookmarkname + "\n(" + strId + "=" + portalWnd.trim(param) + "; "
			+ strSeq + "=" + seq + ")";
		cellNode.appendChild(btn);
		arrAnchs[arrAnchs.length] = btn;
		conNode.divNode=btn;
		conNode.anch=btn;
				
		conNode.appendChild(tableNode)
		
		parentlayer.appendChild(conNode)
		parentlayer.style.display = "block"
	}	
	portalWnd.cmnClearStatus();
	window.focus();
	txtSearch.focus()
}

function sizeFind()
{
	scrWidth=(isIE
		? document.body.offsetWidth
		: window.innerWidth);
	scrHeight=(isIE
		? document.body.offsetHeight
		: window.innerHeight);
	
	// push lyrFind to bottom of page
	var findHeight = parseInt(lyrFind.style.height,10)
	var findTop = scrHeight - findHeight - ((isIE) ? 0 : 2);

	lyrFind.style.left = "0px"
	lyrFind.style.top = findTop + "px"

	// resize Tree between top and lyrFind
	var diff = (isIE) ? 0 : 4;
	var TreeTop = parseInt(Tree.style.top,10);
	var TreeHeight = (scrHeight - findHeight - TreeTop - diff)
	var TreeWidth = parseInt(Tree.style.width,10);
	var TreeLeft = parseInt(Tree.style.left,10);

	if (TreeHeight < 1) return;
	Tree.style.height = TreeHeight + "px";
	
	// for drag coords
	layoutLeft = TreeLeft
	layoutTop = TreeTop
	
	var formAreaTop = parseInt(lyrFormArea.style.top) + diff;
	var formAreaLeft = TreeLeft + TreeWidth + ((isIE) ? 5 : 7) 
	var formAreaWidth = scrWidth - formAreaLeft;
	var formAreaHeight = scrHeight - formAreaTop
	if (formAreaWidth < 1) return;
	
	with (lyrFormArea.style) 
	{
		left = formAreaLeft + "px"
		width = formAreaWidth + "px"
		height = formAreaHeight + "px"
	}
	
	with (formareaTitleBar.style) 
	{
		width = formAreaWidth + "px"
		left = formAreaLeft + "px"
	}

	with (iFrameNode.style) 
	{
		left = formAreaLeft + "px"
		width = formAreaWidth + "px"
		height = formAreaHeight + "px"
		top = formAreaTop + "px"
		border = "0px"
	}

	if (oFeedBack && typeof(oFeedBack.resize) == "function")
		oFeedBack.resize();
}
 
function goRefresh()
{
	initTree()
}

function idToLayerId(id)
{
	return "lc" + loadCount + "_" + id
}

// node routines

function divId(str)
{
	if (!str)
		return str;
	var idiv=str.indexOf("_div");
	if (idiv>-1)
		str=str.substring(0,idiv);
	return str;
}

function imgId(str)
{
	if (!str)
		return str;
	var iimg=str.indexOf("_img");
	if (iimg>-1)
		str=str.substring(0,iimg);
	return str;
}

// called when a user selects a node, as when they are selecting a different bookmark
function nodeMouseDown(e)
{
	e = portalWnd.getEventObject(e,window);
	var target = portalWnd.getEventElement(e);
	if (target)
	{
		var sourceid = divId(target.id);
		if (rightClickEvent(e))
		{
			// right-click mouse button event
			return false;
		} else {
			// normal mouse button event - handled on mouse down
			var b=setActiveSource(sourceid);
			detMouse(e);
			popupHide();
			
			// start drag
			if (b)
				layoutDragStart(e);
		}
	}
}

function nodeMouseUp(e)
{
	e = portalWnd.getEventObject(e,window);
	var target = portalWnd.getEventElement(e);
	if (target)
	{
		var sourceid = divId(target.id);
		if (rightClickEvent(e))
		{
			// right-click mouse button event
			var b=setActiveSource(sourceid,true);
			if (b)
			{
				detMouse(e);
				popupShow();
			}
			return false;
		}
		else
		{
			// normal mouse button event - handled on mouse down
			// compare times for double click
			var newDate = new Date();
			if (hotSpan == target && lastSpanClick && doubleClickTime(lastSpanClick,newDate)) {
				nodeDblClickNode(target);
				lastSpanClick=null;
				hotSpan=null;
				return false;
			}
			lastSpanClick=newDate;
			hotSpan = target;
			return true;
		}
	}
}

function nodeDblClick(e)
{
	// right-click mouse button event
	// if we are still editing a bookmark name, do not change
	e = portalWnd.getEventObject(e,window);
	detMouse(e);
	var target = portalWnd.getEventElement(e);
	if (target)
		nodeDblClickNode(target);
}

function nodeDblClickNode(node)
{
	if (!renaming)
	{
		var sourceid = divId(node.id);
		var b=setActiveSource(sourceid)
		popupclicked = false
		popupHide()
		if (b)
			loadBookmarkRename(activesourceparam, activesourceseq, activesourcebookmark, activesourcelayer)
	}
}

// img routines

function imgClick(e)
{
	e = portalWnd.getEventObject(e,window);
	var target = portalWnd.getEventElement(e);
	if (target)
	{
		var sourceid = imgId(target.id);
		detMouse(e);
		if (rightClickEvent(e))
		{
			// right-click mouse button event - do not show if possible.
			var b=setActiveSource(sourceid, true);
			if (b) popupShow();
			return false;
		}
		else
		{
			// normal mouse button event
			popupHide();
			setActiveImg(sourceid);
			imgExpand();
		}
	}
}

function imgExpand()
{
	if (!activeimglayer)
		return
		
	// load the child div if it hasn't been
	if (activeimglayer.status != "loaded")
	{
		loadTree(activeimglayer,"&INDEX=LOBSET2&SELECT=parent-bkmark=" + portalWnd.trim(activeimgparam))
		activeimglayer.status="loaded"
	}  
	
	var myImage = document.getElementById(activeimgid+"_img")
	if(activeimglayer.expandstatus == "closed")
	{
		activeimglayer.expandstatus = "open"

		// show children
		setLayerChildrenSetting(activeimglayer,"block")

		// show open book image
		myImage.className = "xTBookOpen";
		myImage.title = collapsePhrase;
	
	} else if (activeimglayer.expandstatus == "open")
	{
		activeimglayer.expandstatus = "closed"
		
		// hide children
		setLayerChildrenSetting(activeimglayer,"none")
		
		// show closed book image
		myImage.className = "xTBookClosed";
		myImage.title = expandPhrase;

	} else if (activeimglayer.expandstatus == "empty")
	{
		// show empty book image
		myImage.className = "xTBookEmpty";
		myImage.title = noChildrenPhrase;
	}
}

///// ACTIVE LAYERS

function setActiveSource(sourceid, noshow)
{
	if (sourceid)
	{
		activesourcelayer = document.getElementById( sourceid + "_lyr" )
		if (activesourcelayer)
		{
			activesourceid = sourceid
			with (activesourcelayer)
			{
				activesourcebookmark = bookmarkname
				activesourcetype = type
				activesourceparam = param
				activesourcelevel = level
				activesourceparentlayer = parentlayer
				activesourceseq = getSeqNumber(param)
			}
			if (!activesourceseq)
			{
				var b=setActiveSource(null,noshow);
				return false;
			}
			return (!noshow
				? updateForm(activesourceparam,activesourceseq,activesourcebookmark,activesourcelayer,false)
				: true);
		}
		else
		{
			var b=setActiveSource(null,noshow);
			return false;
		}
	}
	else
	{
		activesourceid = "";
		activesourcebookmark = "";
		activesourcelayer = null;
		activesourcelevel = "0";
		activesourceparam = "";
		activesourcetype = "";
		activesourceparentlayer = null;
		activesourceseq = null;
		return true;
	}
}

function setActiveImg(sourceid) {
	if (sourceid) {
		activeimglayer = document.getElementById( sourceid + "_lyr" )
	
		if (activeimglayer) {
			activeimgid =			sourceid
			activeimgbookmark = 	activeimglayer.bookmarkname
			activeimgtype = 		activeimglayer.type
			activeimgparam = 		activeimglayer.param
			activeimglevel = 		activeimglayer.level
			activeimgparentlayer = 	activeimglayer.parentlayer
		}
	} else {
		activeimglayer =		null
		activeimgid =			""
		activeimgbookmark = 	""
		activeimgtype = 		""
		activeimgparam = 		""
		activeimglevel = 		"0"
		activeimgparentlayer = 	null
	}
}

function setActiveClip(sourceid) {
	if (sourceid) {
		activesourcecliplayer = document.getElementById( sourceid + "_lyr" )
	
		if (activesourcecliplayer) {
			activesourceclipid = sourceid
			with (activesourcecliplayer) {
				activesourceclipbookmark = bookmarkname
				activesourcecliptype = type
				activesourceclipparam = param
				activesourcecliplevel = level
				activesourceclipparentlayer = parentlayer
				activesourceclipseq = getSeqNumber(param)
				if (!activesourceclipseq)
				{
					setActiveClip(null)
					return
				}
			}
		}
	} else {
		activesourcecliplayer =	null
		activesourceclipid = ""
		activesourceclipbookmark = ""
		activesourcecliptype = ""
		activesourceclipparam = ""
		activesourcecliplevel = "0"
		activesourceclipparentlayer = null
	}
}

function TreeOnClick(e)
{
	e = portalWnd.getEventObject(e,window);
	detMouse(e);
	popupHide();
	if (renaming)
	{
		var t = portalWnd.getEventElement(e);
		if (t)
		{
			if (renamelayer && renamelayer.anch && (t != renamelayer.anch) && inputRename && (t != inputRename))
				inputRenameBlur();
		}
	}
}

function doSearch()
{
	popupHide(true)
	var s = txtSearch.value
	if (s)
	{
		if (isNaN(s))
		{
			treereload = "&INDEX=LOBSET3&SELECT=name^~"+escape(s)
			searchTry = -1;
		}
		else
		{
			treereload = "&INDEX=LOBSET6&KEY="+escape(s)
			searchTry = 1;
		}
		
		var isLoaded = loadTree(Tree,"")
		
		if (isLoaded != null && !isLoaded && !isNaN(s))
		{
			searchTry = 2;
			treereload = "&INDEX=LOBSET3&SELECT=name^~"+escape(s)
			loadTree(Tree, "")
		}
	}
	else initTree()
}

function doPrev()
{
	if (!treeprev) return;
	
	// render previous
	loadTree(Tree,"&"+treeprev)
}

function doNext()
{
	if (!treenext) return;
	
	// render next
	loadTree(Tree,"&"+treenext)
}
function reloadPortal()
{
	portalWnd.location.reload()
}

function onOMHelp(e)
{
	// fired by IE only - see if we need to cancel
	var evt=window.event
	if (portalObj.keyMgr.cancelHelpKey(evt,"officemanager"))
		portalWnd.setEventCancel(evt)
}

function handleKeyDown(evt)
{
	evt = portalWnd.getEventObject(evt,window);
	if (!evt) return false;
		
	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"officemanager");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "officemanager")
	{
		cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt)
		return false;
	}

	var evtCaught = false
	var keyVal = (isIE ? evt.keyCode : evt.charCode)
	if (keyVal == 0) // netscape only
		keyVal = evt.keyCode;
	var charCode = String.fromCharCode(keyVal)
	var t=portalWnd.getEventElement(evt);

	if (!evt.altKey && !evt.ctrlKey && !evt.shiftKey)
	{
		switch(keyVal)
		{
			case 13:		// enter
				if (t && typeof(t.onclick)=="function")
				{
					t.click()
					evtCaught = true
				}
				if (t && typeof(t.onkeypress)=="function")
				{
					t.onkeypress(evt)
					evtCaught = true
				}
				break
				
			case 38:			// up arrow
				if (lyrPopup.style.visibility=="visible")
				{
					if (t && t.i!=null)
					{
						var i = Math.max(0,t.i-1)
						if (i!=t.i) {
							var spanNode = getPopupSpan(i)
							spanNode.focus()
							evtCaught = true
						}
					}
				}
				break
		
			case 40:			// down arrow
				if (lyrPopup.style.visibility=="visible")
				{
					if (t && t.i!=null)
					{
						var items = popupTreeItems[activesourcetype]
						var i = Math.min(items.length-1,t.i+1)
						if (i!=t.i) {
							var spanNode = getPopupSpan(i)
							spanNode.focus()
							evtCaught = true
						}
					}
				}
				break	
		}
	}

	if (evtCaught)
		portalWnd.setEventCancel(evt);
	return evtCaught;
}

//-----------------------------------------------------------------------------
function cntxtActionHandler(evt,action)
{
	evt = portalWnd.getEventObject(evt,window);
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"officemanager");
		if (!action || action=="officemanager")
			return false;
	}

	var bHandled=false;
	switch (action)
	{
	case "doSubmit":
		fnDone()
		bHandled=true
		break;
	case "doCancel":
		if (lyrPopup.style.visibility=="visible")
			popupHide(true)
		else
			reloadPortal()
		bHandled=true
		break;
	case "doNext":
		doNext()
		bHandled=true
		break;
	case "doPrev":
		doPrev()
		bHandled=true
		break;
	case "doPrev":
		doPrev()
		bHandled=true
		break;
	case "doFormHelp":
		showHelp()
		bHandled=true
		break;
	case "posInFirstField":
        txtSearch.focus()
		bHandled=true
		break;
	case "doContextMenu": // shift - f10
		var mElement = portalWnd.getEventElement(evt);
		if (mElement && mElement.id)
		{
			var id=divId(mElement.id);
			if (setActiveSource(id,true) )
			{
				fakeMouse();
				popupShow();
			}	
			evtCaught=true;
		}
		break;
	}
	return (bHandled);
}

function unloadFunc()
{
	portalWnd.cmnClearStatus();
	closeAccessWindows();
	if (isDirty && confirm(updateQuestion))
		fnDone()
	if (typeof(portalWnd.formUnload) == "function")
		portalWnd.formUnload();
}

function initPortal() 
{
	var omPhrase=subMsgs.getPhrase("LBL_OFFICE_MANAGER")
	document.title=omPhrase
	portalObj.setTitle(omPhrase)
	portalObj.setMessage(subMsgs.getPhrase("LBL_INITIALIZING"))

	with (portalObj.toolbar)
	{
		target = window
		clear()
		createButton(subMsgs.getPhrase("LBL_UPDATE_CACHE"), fnDone, "update")
		createButton(portalObj.getPhrase("LBL_REFRESH"), goRefresh, "refresh")
		createButton(previousPhrase, doPrev, "prev",treeprev?"enabled":"disabled",null,"prev")
		createButton(nextPhrase, doNext, "next",treenext?"enabled":"disabled",null,"next")
		createButton(portalObj.getPhrase("LBL_HOME"), reloadPortal, "cancel","","","home")
		createButton(portalObj.getPhrase("LBL_TIPS"), showHelp, "help")
	}
}
function disableToolbar()
{
	with (portalObj.toolbar)
	{
		changeButtonState("update","disabled");
		changeButtonState("refresh","disabled");
		changeButtonState("prev","disabled");
		changeButtonState("next","disabled");
		changeButtonState("help","disabled");
	}
	var btn=document.getElementById("spansearch");
	if (btn) btn.disabled=true;
}

// called after fnDone
function setDirty(bIsDirty)
{
	if (typeof(bIsDirty) != "boolean")
		bIsDirty=true
	isDirty=bIsDirty
}

function dirty()
{
	if (!isDirty) setDirty()
}

function fnDone() 
{
	window.status = subMsgs.getPhrase("LBL_UPDATING_CACHE")
	var api = "/servlet/LawSearch?refresh=true&dt="+(new Date()).getTime()
	
	lastLawSearch=portalWnd.httpRequest(api)

	var msg=""
	if (lastLawSearch && (!lastLawSearch.status || lastLawSearch.status < 400))
	{
		var arrMsg = lastLawSearch.getElementsByTagName("MSG")
		if (arrMsg && arrMsg.length)
		{
			if (isIE)
				msg = arrMsg[0].firstChild.nodeValue
			else
			{
				for (var k=0;k<arrMsg[0].childNodes.length;k++)
				{
					if (arrMsg[0].childNodes[k].nodeType==4)
					{
						msg = arrMsg[0].childNodes[k].nodeValue
						break
					}
				}
			}
		}
	}
	var bError=false;
	if (!msg)
	{
		bError=true;
		msg=portalObj.getPhrase("LBL_ERROR") + " - " + subMsgs.getPhrase("LBL_UPDATING_CACHE")
	}
	portalWnd.cmnDlg.messageBox(msg,"ok",bError ? "stop" : "info", window);
	window.status="";
	
	setDirty(false)
}

// hide help page - called from script in forms.js
function hideHelp() {
}

function doubleClickTime(d1,d2) {
	var t=Math.abs(d2.getTime() - d1.getTime())
	return (t<dblClickThres)
}

///// DRAG AND DROP

function layoutDragStart(evt) 
{
	// start dragging a bookmark
	evt = portalWnd.getEventObject(evt,window);
	var t = portalWnd.getEventElement(evt);
	if (!t.conNode)
		return;
	lyrDrag.elNode = t.conNode;

	// Get cursor position with respect to the page.
	detMouse(evt)
	lyrDrag.oX = mX
	lyrDrag.oY = mY
	
	// iterative position finding code from menu.js
	clearCoords()
	detCoords(t)

	lyrDrag.oLeft = t.detLeft
	lyrDrag.oTop = t.detTop
	lyrDrag.oHeight = t.detHeight
	lyrDrag.oWidth = t.detWidth
	
	with (lyrDrag.style) {
		left = lyrDrag.oLeft + "px"
		top = lyrDrag.oTop + "px"
		height = lyrDrag.oHeight + "px"
		width = lyrDrag.oWidth + "px"
	}

	// Capture mousemove and mouseup events on the page.
	if (isIE) {
		lyrDrag.setCapture()
		document.attachEvent("onmousemove", layoutDragGo)
		document.attachEvent("onmouseup",   layoutDragStop)
		window.event.cancelBubble = true
		window.event.returnValue = false
	}
}

function layoutDragGo(event) {
	lastX = mX
	lastY = mY
	detMouse(event)
	if (lastX != mX || lastY != mY) {
	
		// If moved, show draglayer
		if (!lyrDrag.dragging && mouseMoved(mX,mY,lyrDrag.oX,lyrDrag.oY)) {
			lyrDrag.dragging = true
			lyrDrag.style.visibility = "visible"
		}
	
		// determine hot edges
		hotSpans(mX,mY)
		if (hotSpan) {
			var nL, nT
			var t = hotSpan
			var phrase
			t = t.conNode;
			
	 		// Move drag element to hotEdge position
			switch (hotSpan.pos) {
				case 8:
					lyrDrag.oHeight = edgeWidth
					lyrDrag.oWidth = t.detWidth
					nL = t.detLeft
					nT = (t.detTop - lyrDrag.oHeight)
	 				phrase = moveBeforePhrase
					break
					
				case 5:
					lyrDrag.oHeight = t.detHeight
					lyrDrag.oWidth = t.detWidth
					nL = t.detLeft
 					nT = t.detTop
	 				phrase = moveIntoPhrase
					break

				case 2:
					lyrDrag.oHeight = edgeWidth
					lyrDrag.oWidth = t.detWidth
					nL = t.detLeft
 					nT = t.detBottom
	 				phrase = moveAfterPhrase
					break
						
				default:
					break
					
			} // switch

			with (lyrDrag.style) {
				height = lyrDrag.oHeight + "px"
				width = lyrDrag.oWidth + "px"		
				left = (nL - mdX) + "px"
				top = (nT - mdY) + "px"
				visibility = "visible"
			}
			window.status = relocatingPhrase + " " + lyrDrag.elNode.bookmarkname + ": " + phrase + " " + t.bookmarkname
			
		} else {
			lyrDrag.style.visibility = "hidden"
			window.status = relocatingPhrase + " " + lyrDrag.elNode.bookmarkname
		}
	}

	if (isIE) {
		window.event.cancelBubble = true
	   	window.event.returnValue = false
	}
	else
   		event.preventDefault()
}

function layoutDragStop(event)
{
	// stop capturing mousemove and mouseup events.
	if (isIE)
	{
    	document.detachEvent("onmousemove", layoutDragGo)
    	document.detachEvent("onmouseup", layoutDragStop)
    	document.releaseCapture()
	}
	else
	{
    	document.removeEventListener("mousemove", layoutDragGo, true)
    	document.removeEventListener("mouseup", layoutDragStop, true)
  	}
	portalWnd.cmnClearStatus();
	
	// hide drag layer
	lyrDrag.style.visibility = "hidden"

	if (lyrDrag.dragging) {
		lyrDrag.dragging = false
		
	 	// Get mouse position
		detMouse(event)
	 	
		if (hotSpan) {
			popupclicked = false
		
			// move bookmark is a simulated cut / paste operation
			// set the current clip
			setActiveClip(activesourceid)

			// type of clip
			isCopy = false
	
			var seq = getSeqNumber(hotSpan.conNode.param);
			var addas = null
			switch (hotSpan.pos) {
				case 8:
					addas = "P" // C=Child, P=Peer
					break
				case 5:
					addas = "C" // C=Child, P=Peer
					break
				case 2:
					addas = "P" // C=Child, P=Peer
					break
				default:
					break
			} // switch
			
			if (addas)
				popupPasteGeneral(seq,addas)
			portalWnd.cmnClearStatus();
		}
	}
}

function clearCoords() {
	if (!arrAnchs)
		return
	for (var i=0;i<arrAnchs.length;i++) {
		span = arrAnchs[i]
		span.detCoords = false
	}
}

function hotSpans(x,y) {
	// see if hot span still hot
	var vertOnly = true
	var noInside = true
	
	// find closest span
	var span
	var d
	var minSpan = null
	var minD = 5000 * 5000
	if (!arrAnchs)
		return
		
	var conNode
	// go reverse order to catch newest nodes first
	for (var i=arrAnchs.length-1;i>=0;i--) {
		span = arrAnchs[i]
		conNode = span.conNode;
		d = detClosest(conNode,x,y,"dist",vertOnly,noInside)
		if (d<minD) {
			minSpan = span
			minD = d
		}
	}
	
	// find closest edge
	if (minD < 100 * 100) {
		hotSpan = minSpan
		conNode = minSpan.conNode;
		if (nodeContainsWithin(conNode,x,y,edgeWidth))
			hotSpan.pos = 5
		else
			hotSpan.pos = detClosest(conNode,x,y,"edge",vertOnly,noInside)

		return
	}
}

// like nodeContains, but inside margin
function nodeContainsWithin(node,x,y,edge) {
	if (!node)
		return false
	if (!node.detCoords)
		detCoords(node)
	return ((x-edge>=node.detLeft) && (x+edge<=node.detRight)) &&
		((y-edge>=node.detTop) && (y+edge<=node.detBottom))
}

function cleanSpan() {
	if (hotSpan) {
		hotSpan.pos = 0
		hotSpan = null
	}
}

// modifies the mouse coordinates determined in detMouse (layout.js) for the
// current layout/scroll situation.
function detMouse2(event) {
	mdX=0
	mdY=0
	if (isIE) {
		mdX = Tree.scrollLeft
		mdY = Tree.scrollTop
	} else {
		mdX = -layoutLeft
		mdY = -layoutTop
	}
	mX+=mdX
	mY+=mdY
}

function getSeqNumber(key)
{
	var ret = null;
	try
	{
		var query = "PROD=LOGAN" +
			"&FILE=LOBKMARK" +
			"&FIELD=seq-nbr;" +
			"&INDEX=LOBSET1" +
			"&KEY=" + portalWnd.trim(key) + 
			"&EXCLUDE=DRILL;KEYS;SORTS" +
			"&MAX=1" +
			"&OUT=XML";
			
		var req = new portalWnd.DMERequest(portalWnd, query);
		var res = req.getResponse(true);
		if (!res.isValid())
		{
			window.status = res.error;
			return null;
		}
		ret = res.getRecordValue(0,0);
	}
	catch (e)
	{
		var msg=subMsgs.getPhrase("LBL_SEQUENCE_NOT_FOUND");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		ret = null;
	}
	return ret;
}
