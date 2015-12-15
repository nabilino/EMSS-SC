/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/home.js,v 1.44.2.36.4.13.10.6.2.5 2010/07/22 04:15:21 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.9.153 2011-06-13 04:00:00 (201111) */
//-----------------------------------------------------------------------------
//	Proprietary Program Material
//	This material is proprietary to Lawson Software, and is not to be
//	reproduced or disclosed except in accordance with software contract
//	provisions, or upon written authorization from Lawson Software.
//
//	Copyright (C) 2002-2007 by Lawson Software. All Rights Reserved.
//	Saint Paul, Minnesota
//-----------------------------------------------------------------------------

var HOMEJS = "home.js";			// filename constant for error handling
var objAdminBlocks
var objBookmarkKeys
var objContent
var objNavigation
var objPortalUser
var objUserBlocks


var arrBookmarkObj
var arrBorders
var arrColumns
var arrIframes
var arrNuglets
var arrNugletSpans
var arrNugletTables

var lyrContent
var lyrDrag
var lyrExpand

var editMode
var hotNode
var hotSpan
var lastNuglet
var lastSpanClick
var layoutLoaded
var headerHeight = 14

var colWidthPhrase
var heightPhrase
var	locked1Phrase
var	locked2Phrase
var	lockedSubPhrase
var	lockedLayoutPhrase
var nugletPhrase
var removeLayoutPhrase
var relocatingPhrase
var resizingPhrase
var toggleStatePhrase
var toggleExpandPhrase
var	yourAdminPhrase

var imagesURL = "images"
var deleteURL = imagesURL + "/ico_delete.gif"
var restoreURL = imagesURL + "/ico_restore.gif"
var lockedURL = imagesURL + "/ico_lock_closed.gif"
var logoURL = "";
var rollupURL = imagesURL + "/ico_rollup.gif"
var rolldnURL = imagesURL + "/ico_rolldown.gif"
var maximizeURL = imagesURL + "/ico_maximize.gif"
var resizeURL = imagesURL + "/spacer.gif"
var spacerURL = imagesURL + "/spacer.gif"

// xml tags
var ATTR_DIR = "dir"
var ATTR_HEIGHT = "height"
var ATTR_KEY = "key"
var ATTR_LAYOUT = "layout"
var ATTR_NAME = "nm"
var ATTR_PARENTKEY = "parentkey"
var ATTR_STATE = "state"
var ATTR_SUBSCRIPTION = "subscription"
var ATTR_TYPE = "type"
var ATTR_URL = "url"
var ATTR_WIDTH = "width"

var TAG_BLOCK = "BLOCK"
var TAG_BLOCK_CHECK = "BLOCK_CHECK"
var TAG_BLOCKS = "BLOCKS"
var TAG_BOOKMARK = "BOOKMARK"
var TAG_BOOKMARKS = "BOOKMARKS"
var TAG_CONTENT = "CONTENT"
var TAG_FLOW = "FLOW"
var TAG_DME_MESSAGE = "MESSAGE" // #105583
var TAG_MESSAGE = "Message"
var TAG_MSGNBR = "MsgNbr"
var TAG_NAVIGATION = "NAVIGATION"
var TAG_NAVLET = "NAVLET"
var TAG_NUGLET = "NUGLET"
var TAG_PORTAL_USER = "PORTAL_USER"
var TAG_DATE = "DATE"
var TAG_TIME = "TIME"

var LOCK_ADMIN = "admin"
var LOCK_USER = "user"

var DIR_HORIZONTAL = "h"
var DIR_VERTICAL = "v"

var MAX_COLUMNS = 2
var indentPx = 25
var minColPercentage = 10
var maxColPercentage = 90
var minHeight = 16

var portalWnd=null;
var portalObj=null;
var profile=null;
var profileDoc=null;
var isIE
var homeLoaded = false;

var layoutLeft
var layoutTop
var contentMargin = 4
var mdX, mdY
var imgsTimerArray
var gridPx = 10
var minContentPx = 150

// Variables for greybox (PSA) critical section handling
var greyBoxCriticalSection = 0;
var greybBoxCriticalSectionTimer;
var elapsedTime = new Array();
var endTime = new Array();
var start = new Array();
var greyBoxSleepBObj = new Array();
var greyBoxSleepKey = new Array();
var greyBoxSleepExpandStatus = new Array();
var greyBoxArraySize = 0;
var greyBoxIndex = 0;
// End Variables for greybox (PSA) critical section handling

// MOD rnevinger password q&a
var presentSecQuestions;


//-----------------------------------------------------------------------------

function homeInit()
{
	portalWnd=envFindObjectWindow("lawsonPortal");
	if (!portalWnd || !portalWnd.lawsonPortal || !portalWnd.oUserProfile) 
	{
		setTimeout("homeInit()",300)
		return
	}
	if (!portalWnd.oUserProfile.storage)
		return

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	portalObj = portalWnd.lawsonPortal;
	profile = portalWnd.oUserProfile;

	profileDoc = portalWnd.oUserProfile.storage.getDocument();
	isIE = portalObj.browser.isIE
	setTitle()
	portalObj.backURL="home.htm";
	logoURL=portalWnd.oPortalConfig.getSetting("logo_src",imagesURL+"/logo.gif"); 
	
	// layers
	lyrContent = document.getElementById("lyrContent")
	lyrContent.onselectstart = portalWnd.cmnBlockSelect;
	lyrExpand = document.getElementById("lyrExpand")
	
	// different drag layer based on scrolling
	if (isIE)
		lyrDrag = document.getElementById("lyrDrag")
	else
		lyrDrag = document.getElementById("lyrDrag2")
	
	colWidthPhrase = portalObj.getPhrase("LBL_COLUMN_WIDTH")
	heightPhrase = portalObj.getPhrase("LBL_HEIGHT")
	nugletPhrase = portalObj.getPhrase("LBL_NUGLET")
	relocatingPhrase = portalObj.getPhrase("LBL_RELOCATING")
	resizingPhrase = portalObj.getPhrase("LBL_RESIZING")
	toggleExpandPhrase = portalObj.getPhrase("LBL_TOGGLE_EXPAND")
	toggleStatePhrase = portalObj.getPhrase("LBL_TOGGLE_STATE")
	
	// locked phrases
	locked1Phrase = portalObj.getPhrase("LBL_LOCKED1")
	locked2Phrase = portalObj.getPhrase("LBL_LOCKED2")
	lockedSubPhrase = portalObj.getPhrase("LBL_LOCKED_SUB")
	lockedLayoutPhrase = portalObj.getPhrase("LBL_LOCKED_LAYOUT")
	removeLayoutPhrase = portalObj.getPhrase("LBL_REMOVE_LAYOUT")
	yourAdminPhrase = portalObj.getPhrase("LBL_YOUR_ADMIN")
	
	sizeFind()

	// arrBookmarkObj has bookmark objects
	arrBookmarkObj = new Array()

	window.status = portalObj.getPhrase("LBL_LOADING")

	// all bookmarks available to this user
	loadBookmarks()

	// layout
	loadLayout()
	
	// if layout locked, but not in layout, add to layout
	// if bookmark unsubscribed, resubscribe for next time
	// also checks consistency of existing navlets and nuglets
	checkLocked();
	
	// layout
	renderLayout();
	if (!isDirty) 
		notDirty();

	// if changes, prompt for update
	if (isDirty)
	{
		var bUpdate="ok";
		if (portalWnd.oPortalConfig.getSetting("updates_prompt","0") == "1")
		{
			var msg=portalObj.getPhrase("LBL_SAVE_UPDATES");
			bUpdate = (isIE
	 			? portalWnd.cmnDlg.messageBox(msg,"okcancel","question")
				: (confirm(msg) ? "ok" : "cancel"));
		}
		if (bUpdate=="ok")
			fnDone();
	}
		
	portalWnd.cmnClearStatus();
	//if not the home page, redirect to custom home page.
	//custom home page wasn't loaded to give way for bookmark locks
	if (portalWnd.getHome() != "home.htm")
	{
		var blockNodes = portalObj.profile.getElementsByTagName("BLOCK");
		if (blockNodes.length > 0)
			portalWnd.switchContents(portalWnd.getHome());
	}
}

function sizeFind()
{
	var scrWidth = (isIE ? document.body.offsetWidth : window.innerWidth);
	var scrHeight = (isIE ? document.body.offsetHeight : window.innerHeight);

	if (scrWidth < 8) return;
	
	// lyrContent
	var layoutLeft = contentMargin
	var layoutTop = contentMargin
	var wdth = scrWidth - layoutLeft - contentMargin - 16;
	if (wdth < 8) return;

	if (lyrContent)
	{
		with (lyrContent.style)
		{
			left = layoutLeft + "px"
			top = layoutTop + "px"
			height = (scrHeight - layoutTop - contentMargin) + "px"
			width = (scrWidth - layoutLeft - contentMargin) + "px"
			visibility = "visible"
		}
	}
	if (lyrExpand)
	{
		with (lyrExpand.style)
		{
			left = layoutLeft + "px"
			top = layoutTop + "px"
			height = (scrHeight - layoutTop - contentMargin - 16) + "px"
			width = wdth + "px"
		}
	}
}

function homeUnloadFunc()
{
	if(!portalWnd) return;
	
	portalWnd.cmnClearStatus();
	if (isDirty)
	{
		if (confirm(portalObj.getPhrase("LBL_SAVE_LAYOUT_QUESTION")))
			homeSave();
		notDirty();
	}
	if (typeof(portalWnd.formUnload) == "function")
		portalWnd.formUnload(true);
}

function loadBookmarks()
{
	var bmStorage=portalObj.profile.getElementsByTagName(TAG_BOOKMARKS)
	bmStorage=bmStorage[0]
	bmStorage=new portalWnd.DataStorage(bmStorage)

	arrBookmarkObj=new Array()

	var objBookmark=bmStorage.document.getElementsByTagName(TAG_BOOKMARK)
	for (var i=0;i < objBookmark.length; i++)
	{
		var key = objBookmark[i].getAttribute(ATTR_KEY)
		// otherwise netscape will find itself again and again
		if (getBookmarkObj(key) == null)
		{
			var bObj = new BookmarkObj(key)
			bObj.content = objBookmark[i]
			arrBookmarkObj[arrBookmarkObj.length] = bObj
		}
	}
	objBookmark=null
}

function renderLayout() {
	// render right content pane - nuglets
	imgsTimerArray=new Array()
	renderContentPane()
}

function loadLayout()
{
	if (layoutLoaded) return;

	// get objPortalUser
	objPortalUser=profile.storage.getRootNode();
	if (objPortalUser == null)
	{
		objPortalUser=profileDoc.createElement(TAG_PORTAL_USER)
		profileDoc.appendChild(objPortalUser)
	}
	
	// get objNavigation - for locks only
	objNavigation=objPortalUser.getElementsByTagName(TAG_NAVIGATION)
	objNavigation = (objNavigation && objNavigation.length > 0 && objNavigation[0].nodeType == 1 
			? objNavigation[0] : null);

	// create objNavigation if does not exist - for locks only
	if (objNavigation == null) {
		objNavigation=profileDoc.createElement(TAG_NAVIGATION)
		objPortalUser.appendChild(objNavigation)
	}

	// get objContent
	objContent=objPortalUser.getElementsByTagName(TAG_CONTENT)
	objContent = (objContent && objContent.length > 0 && objContent[0].nodeType == 1 
			? objContent[0] : null);
		
	// create objContent if does not exist	
	if (objContent == null) {
		objContent=profileDoc.createElement(TAG_CONTENT)
		objPortalUser.appendChild(objContent)
	}
	
	// get objBookmarkKeys
	objBookmarkKeys=objPortalUser.getElementsByTagName(TAG_BOOKMARKS)
	objBookmarkKeys = (objBookmarkKeys && objBookmarkKeys.length > 0 && objBookmarkKeys[0].nodeType == 1 
			? objBookmarkKeys[0] : null);
		
	// create objBookmarkKeys if does not exist	
	if (objBookmarkKeys == null) {
		objBookmarkKeys=profileDoc.createElement(TAG_BOOKMARKS)
		objPortalUser.appendChild(objBookmarkKeys)
	}
	
	// get objUserBlocks from user profile
	objUserBlocks = null
	var objBlocks = profileDoc.getElementsByTagName(TAG_BLOCKS)
	if (objBlocks)
		for (var i=0; i < objBlocks.length; i++)
			if (objBlocks[i].nodeType == 1)
				objUserBlocks = objBlocks[i]

	// get objAdminBlocks from role profile
	objAdminBlocks = null
	var roleDoc = portalWnd.oUserProfile.oRole.storage.getDocument();	
	if (roleDoc)
	{
		objBlocks = roleDoc.getElementsByTagName(TAG_BLOCKS)
		if (objBlocks)
			for (var i=0; i < objBlocks.length; i++)
				if (objBlocks[i].nodeType == 1)
					objAdminBlocks = objBlocks[i]
	}

	// create objUserBlocks if does not exist	
	if (objUserBlocks == null)
	{
		objUserBlocks=profileDoc.createElement(TAG_BLOCKS)
		objUserBlocks.setAttribute(ATTR_TYPE,LOCK_USER)
		objPortalUser.appendChild(objUserBlocks)
	}
}

function renderContentPane()
{
	abandonChildren(lyrContent)
	arrNuglets = new Array()
	arrBorders = new Array()
	arrNugletSpans = new Array()
	arrNugletTables = new Array()
	arrColumns = new Array()
	arrIframes = new Array()
	hotSpan = null
	lastNuglet = null
	
	var bHasContent = false
	if (arrBookmarkObj.length)
		bHasContent=renderContent(objContent,lyrContent,false,false)
	if (bHasContent) return;

	// no content, so render default home page
	homeLoaded=false;
	if (profile.isPortalAdmin())
		showHomePage("admin");
	else if (profile.oRole.getUseMenus())
		showHomePage("users");
	else
		renderLogo(lyrContent);
}
function showHomePage(type)
{
	homeLoaded=true;
	var contentFrame=document.getElementById("contentFrame");
	contentFrame.style.visibility="visible";
	contentFrame.style.display="block";
	contentFrame.src=type+"/home.htm";
}
function renderLogo(parentNode)
{
	var t = document.createElement("table")
	t.cellPadding = 0
	t.cellSpacing = 0
	with (t.style) {
		margin = "0px"
		textAlign = "center"
		verticalAlign = "middle"
		width = "90%"
		height = "90%"
	}
	var r = t.insertRow(t.rows.length)

	var c = r.insertCell(r.cells.length)
	with (c.style) {
		verticalAlign = "middle"
		width = "100%"
		height = "100%"
	}
		
	var i = document.createElement("img")
	i.alt = portalObj.getPhrase("LBL_HOME")
	i.src = logoURL
	
	c.appendChild(i)
	
	parentNode.appendChild(t)
}

function renderContent(content,parentNode,wholeColumn,noMax)
{
	if (!content) return false

	if (content.tagName == TAG_CONTENT)
	{
		// render children
		if (content.hasChildNodes()) {
			var rChildren = 0;
			var len = content.childNodes.length
			var bookmarkLen = arrBookmarkObj.length
			var wcCounter=0
			for (var i=0; i < len; i++)
			{
				if(content.childNodes[i].nodeType == 1)
				{
					for(var j=0; j < bookmarkLen; j++)
					{
						if(arrBookmarkObj[j].key == content.childNodes[i].getAttribute("key"))
							wcCounter++
					}
				}
			}
			for (var i=0; i < len; i++)
			{
				if (content.childNodes[i].nodeType == 1)
				{ // ns
					var b=renderContent(content.childNodes[i],parentNode,(wcCounter==1),noMax)
					rChildren += (b ? 1 : 0);
				}
			}
			return rChildren
		}
	}
	else if (content.tagName == TAG_FLOW)
	{
		var dir = content.getAttribute(ATTR_DIR)
		if (dir == DIR_HORIZONTAL)
		{
			var t = document.createElement("table")
			t.cellPadding = 0
			t.cellSpacing = 0
			with (t.style) 
			{
				if (wholeColumn)
					height = "90%"
				margin = "0px"
				textAlign = "left"
				verticalAlign = "top"
				width = "100%"
			}
			t.content = content
			t.canHide = true
			var r = t.insertRow(t.rows.length)

			// render children
			// rChildren in this case is the count of rendered childNodes
			var rChildren = 0;
			if (content.hasChildNodes()) {
				var len = content.childNodes.length
				if (len) {
					// real children - ns
					// by placing the elements into this temporary array, we can
					// trim the parent node if necessary
					var realChildren = new Array()
					for(var i=0;i<len;i++) {
						if (content.childNodes[i].nodeType == 1)
							realChildren[realChildren.length]=content.childNodes[i]
					}
					len = realChildren.length
					if (len) {
						var p
						for(var i=0;i<len;i++) {
							p = 100/len
							if (isIE || (realChildren[i].hasAttributes() && realChildren[i].hasAttribute(ATTR_WIDTH))) {
								var tp = realChildren[i].getAttribute(ATTR_WIDTH)
								if (tp)
									p=tp
							}
							var c = r.insertCell(r.cells.length)
							c.style.verticalAlign = "top"
							c.style.width = p + "%"
							var b=renderContent(realChildren[i],c,true,noMax)

							// render column sizer
							if (r.cells.length>1) {
								c = r.insertCell(r.cells.length-1)
								with (c.style) 
								{
									verticalAlign = "middle"
									width = edgeWidth + "px"
									height = (isIE) ? "100%" : headerHeight + "px";
								}
								var cz=renderColumnSizer(content,r.cells.length,c,t)
							}
							rChildren += (b ? 1 : 0);
						}
					}
				}
			}
			if (rChildren) {
				// rChildren is the count of the number of rendered childNodes
				parentNode.appendChild(t)
				return true
			} else {
				t=null
				return false
			}
		}

		if (dir == DIR_VERTICAL || !dir)
		{
			var t = document.createElement("table")
			t.cellPadding = 0
			t.cellSpacing = 0
			with (t.style) {
				margin = "0px"
				textAlign = "left"
				verticalAlign = "top"
				width = "100%"
			}
			t.canHide = true
			t.content = content

			// render children
			var rChildren = 0;
			if (content.hasChildNodes()) {
				var len = content.childNodes.length
				if (len) {
					if (len==1)
						t.style.height="100%"
				
					// real children - ns
					// by placing the elements into this temporary array, we can
					// trim the parent node if necessary
					var realChildren = new Array()
					for (var i=0; i < len; i++)
					{
						if (content.childNodes[i].nodeType == 1)
							realChildren[realChildren.length]=content.childNodes[i]
					}
					len = realChildren.length
						for (var i=0; i < len; i++)
						{
							var r = t.insertRow(t.rows.length)
							var c = r.insertCell(r.cells.length)
							c.style.width = "100%"
							c.style.verticalAlign = "top"
							var b=renderContent(realChildren[i],c,(len==1),noMax)
							rChildren += (b ? 1 : 0);
						}
				}
			}
			if (rChildren)
			{
				parentNode.appendChild(t)
				return true
			}
			else
			{
				t=null
				return false
			}
		}
	}
	else if (content.tagName == TAG_NUGLET)
	{
		if (noMax)
		{
			var state = content.getAttribute(ATTR_STATE)
			if (state)
				content.removeAttribute(ATTR_STATE)
		}
	
		var bDidRender=renderNuglet(content,parentNode,null,wholeColumn,noMax);
		
		// if unsubscribed, remove this child
		// but only if not layout locked
		if (!bDidRender)
		{
			var key=content.getAttribute(ATTR_KEY)
			if (key && !getBookmarkLock(key,ATTR_LAYOUT))
			{
				content.parentNode.removeChild(content)
				forgetBookmarkKey(key)
				homeDirty();
			}
		}
		
		return (bDidRender);
	}
}

function homeDirty()
{
	dirty();
	profile.setModified();
}

function renderNuglet(content,parentNode,expandStatus,wholeColumn,prevNode)
{
	var key = content.getAttribute(ATTR_KEY)
	if (!key)
		return false

	var bObj = getBookmarkObj(key)
	if (bObj==null) 
	{
		// the bookmark was in the layout, but not provided by authen/profile.
		// the user no longer has access to the bookmark.
		//window.status = subMsgs.getPhrase("LBL_TRIMMED")
		return false
	}

	var objTable = document.createElement("table")
	objTable.cellPadding = 0
	objTable.cellSpacing = 0
	
	var h=null
	var state = content.getAttribute(ATTR_STATE)
	var bState = (!state || state != "min" || expandStatus)
	if (bState && !expandStatus && (isIE || content.getAttribute)) 
	{
		h = content.getAttribute(ATTR_HEIGHT)
		if (h!=null && h!="")
			h += "px"
	}
	if ( bState && (h==null || h=="") && (expandStatus || wholeColumn))
		h = "99%";
		
	// make the table height only be the header height if state is min
	if (!expandStatus && state && state == "min")
		h = headerHeight + "px"
	
	with (objTable.style) 
	{
		textAlign = "left"
		verticalAlign = "top"
		width = "100%"
		borderStyle = "solid"
		borderWidth = "1px"
		if (h!=null)
			height = h
	}
	objTable.canHide = true

	// row 0 - header
	var r = objTable.insertRow(objTable.rows.length)
	r.style.height = headerHeight + "px"

	var c = r.insertCell(r.cells.length)
	c.className = "xTNugletHead"
	c.onselectstart = portalWnd.cmnBlockSelect;
	c.style.width = "100%"
		
	// inner table for title, expand, min/max buttons
	var it = document.createElement("table")
	it.cellPadding = 0
	it.cellSpacing = 0
	with (it.style) 
	{
		textAlign = "left"
		verticalAlign = "top"
		width = "100%"
	}
	var ir = it.insertRow(it.rows.length)
		
	// bookmark title
	var ic = ir.insertCell(ir.cells.length)
	var laylock = getBookmarkLock(key,ATTR_LAYOUT)
	var name = getBookmarkObjName(bObj)
	
	var	s = document.createElement("span")
	// if expanded, no user actions allowed on the titlebar
	if (!expandStatus)
	{
		s.onselectstart = portalWnd.cmnBlockSelect;
		s.onmousedown = layoutDragStart
		if(!laylock) 
		{
			s.onclick = spanClick
			s.ondblclick = spanDoubleClick
		}
	}
	if (isIE)
	{
		s.style.width = "100%"
		s.style.height = "100%"
	}
	s.pos = 0
	s.expandStatus = expandStatus
	s.table = objTable
	s.content = content
	s.className = "xTCustomHeader"
	s.state = state
	s.name = name
	
	// remember for collapse rerendering
	s.key = key
	s.remParentNode = parentNode
	s.remExpandStatus = expandStatus
	s.remWholeColumn = wholeColumn
					
	arrNugletSpans[arrNugletSpans.length] = s
	arrNugletTables[arrNugletTables.length] = objTable
			
	var t = document.createTextNode(name)
	s.appendChild(t)
	ic.appendChild(s)

	ic = ir.insertCell(ir.cells.length)
	ic.style.textAlign = "right"
		
	// min/max state
	if (!laylock && !expandStatus)
	{
		var minmaxSpan = document.createElement("span")
		minmaxSpan.id="spanMinMax";
		minmaxSpan.className="xTCustomHeaderBtn";
		minmaxSpan.onclick = spanStateClick
		minmaxSpan.style.backgroundImage = "url('"+
			(s.state && s.state=="min" ? rolldnURL : rollupURL)+"')";
		minmaxSpan.setAttribute("title",toggleStatePhrase);
		minmaxSpan.span = s;
		ic.appendChild(minmaxSpan)
	}

	// expand state
	var expandSpan = document.createElement("span")
	expandSpan.id="spanExpand";
	expandSpan.className="xTCustomHeaderBtn";
	expandSpan.onclick = expandClick
 	expandSpan.style.backgroundImage = "url('"+
 		(expandStatus ? maximizeURL : restoreURL)+"')";
 	expandSpan.setAttribute("title",toggleExpandPhrase);
	expandSpan.span = s
	ic.appendChild(expandSpan)

	if (!expandStatus)
	{
		var imgSpan = document.createElement("span")
		imgSpan.id="spanImage";
		imgSpan.className="xTCustomHeaderBtn";
		if (!laylock)
		{
			imgSpan.onclick = spanDeleteClick
			imgSpan.style.cursor="default"
		 	imgSpan.style.backgroundImage = "url('"+deleteURL+"')";
			imgSpan.style.cursor="default"
			imgSpan.setAttribute("title",removeLayoutPhrase);
		}
		else
		{
		 	imgSpan.style.backgroundImage = "url('"+lockedURL+"')";
			imgSpan.setAttribute("title",getLaylockPhrase(laylock));
		}
		imgSpan.span = s
		ic.appendChild(imgSpan)
	}
	
	c.appendChild(it)
	c.span = s
		
	// row 1, col 0 - content
	r = objTable.insertRow(objTable.rows.length)
	c = r.insertCell(r.cells.length)
	c.style.width = "100%"
	c.className = "xTNugletBody"
		
	var state = content.getAttribute(ATTR_STATE)
	if (!expandStatus && state && state == "min")
		c.style.display="none"

	s.collapseNode=c
	renderNugletImage(s)

	// row 2 - grow - north - south
	// do not show if nuglet is in expanded mode
	if (!expandStatus)
	{
		r = objTable.insertRow(objTable.rows.length)
		r.style.height = edgeWidth + "px"
		c = r.insertCell(r.cells.length)
		c.className = "xTNugletResize"
		c.style.height = edgeWidth + "px"

		// grow_ns
		s.grow_ns = document.createElement("span")
		s.grow_ns.onselectstart = portalWnd.cmnBlockSelect;
		s.grow_ns.onmouseover = growStatus
		s.grow_ns.onmousedown = growDragStart
		s.grow_ns.onclick = growClick
		s.grow_ns.ondblclick = growDoubleClick
		s.grow_ns.direction = DIR_VERTICAL
		with (s.grow_ns.style) {
			height = edgeWidth + "px"
			overflow = "hidden"
			textAlign = "right"
			width = "100%"
		}
		
		s.grow_ns.title = portalObj.getPhrase("LBL_PRESCRIBE_HEIGHT")
		s.grow_ns.cell = c
		s.grow_ns.span = s

		s.grow_ns_img = document.createElement("img")
		s.grow_ns_img.alt = portalObj.getPhrase("LBL_PRESCRIBE_HEIGHT")
		s.grow_ns_img.src = resizeURL
		s.grow_ns_img.style.height = edgeWidth + "px"
		s.grow_ns_img.style.width = "100%"
		s.grow_ns_img.style.marginRight = edgeWidth + "px"
		s.grow_ns.appendChild(s.grow_ns_img)
		c.grow_ns = s.grow_ns
		c.appendChild(s.grow_ns)
		
		// hide the grow if state is min
		if (!expandStatus && state && state == "min")
			s.grow_ns.cell.style.display="none"
	}
		
	if (prevNode)
		parentNode.insertBefore(objTable,prevNode)
	else
		parentNode.appendChild(objTable)

	return true
}

function renderNugletImage(s) {
	var bImage = (!s.state || s.state=="max" || s.expandStatus)
	var img = document.createElement("img")
	img.id = "img_" + s.key + (s.expandStatus?"_x":"")
	img.span = s
	img.loaded = false
	if (bImage) {
		img.src = spacerURL
		img.onload = imgLoad
	} else {
		img.src = spacerURL
	}
	if (s.collapseNode.image)
		s.collapseNode.replaceChild(img,s.collapseNode.image)
	else
		s.collapseNode.appendChild(img)
	s.collapseNode.image = img
	
	// onload event does not trigger for browser settings = "automatically"
	if (bImage) {
		var j=imgsTimerArray.length
		imgsTimerArray[j] = img
		img.timeout=setTimeout("imgLoad_i("+j+")",300)
	}
}

function imgLoad() {
	clearTimeout(this.timeout)
	this.timeout=null
	if (!this.loaded) {
		this.loaded=true
		loadNuglet(this.span.key,this.span.expandStatus)
	}
}

function imgLoad_i(i) {
	var img=imgsTimerArray[i]
	clearTimeout(img.timeout)
	img.timeout=null
	if (!img.loaded) {
		img.loaded=true
		loadNuglet(img.span.key,img.span.expandStatus)
	}
}

// clicking/double clicking on nuglet spans
function spanClick(e) {
	var t = detTarget(e)
	spanClickSpan(t)
}

function spanClickSpan(span) {
	// if user clicked on open space, turn off any old hot nodes
	if (!span) {
		// turn off old hot node
		lastSpanClick=null
		hotSpan=null
		return
	}
	
	// compare times for double click
	var newDate = new Date()
	if (hotSpan == span && lastSpanClick && doubleClickTime(lastSpanClick,newDate)) {
		spanCollapse(span)
		lastSpanClick=null
		hotSpan=null
		return
	}
	lastSpanClick=newDate
	hotSpan = span
}

function getLaylockPhrase(laylock)
{
	return (locked1Phrase + " " + 
		(laylock == LOCK_USER ? ". ": "") + 
		(laylock == LOCK_ADMIN ? yourAdminPhrase + " " : "") + 
		locked2Phrase + " " + lockedLayoutPhrase);
}

function spanDoubleClick(e)
{
	var t = detTarget(e)
	spanCollapse(t)
}

function spanCollapse(s)
{
	lastSpanClick=null
	hotSpan=null
		
	if (s.state && s.state == "min")
	{
		s.content.setAttribute(ATTR_STATE,"max")

		// min/max only works first time if ever in netscape - rerender
		if (isIE) 
		{
			s.state = "max"
			s.collapseNode.style.display="block"
			if (isIE || s.content.getAttribute) 
			{
				h = s.content.getAttribute(ATTR_HEIGHT)
				if (h)
					h += "px"
			}
			if (!h && s.oldHeight)
				h = s.oldHeight + "px"
			if (!h)
				h = "200px"
			with (s.table.style) 
			{
				if (h!=null)
					height = h
			}
			if (s.grow_ns)
				s.grow_ns.cell.style.display="block"
			document.getElementById("spanMinMax").style.backgroundImage = "url('"+rollupURL+"')";
			renderNugletImage(s)
		} else
			homeRefresh();
	} 
	else
	{
		s.content.setAttribute(ATTR_STATE,"min")

		// min/max only works first time if ever in netscape - rerender
		if (isIE) 
		{
			s.state = "min"
			detCoords(s.table)
			s.oldHeight = s.table.detHeight
			s.collapseNode.style.display="none"
			detCoords(s)
			var sHeight = s.detHeight
			s.table.style.height = sHeight + "px"
			if (s.grow_ns)
				s.grow_ns.cell.style.display="none"
			document.getElementById("spanMinMax").style.backgroundImage = "url('"+rolldnURL+"')";
			renderNugletImage(s)
			window.focus();
		}
		else
			homeRefresh();
	}
}

// function stores data for second grey box startup
// then sleeps the startup
function sleepLoadNuglet(milliseconds, key, expandStatus, bObj, idx)
{
	if(idx != null)
	{
		sleeper(10, idx);
		return;
	}
	greyBoxSleepBObj[greyBoxArraySize] = bObj;
	greyBoxSleepKey[greyBoxArraySize] = key;
	greyBoxSleepExpandStatus[greyBoxArraySize] = expandStatus;
	elapsedTime[greyBoxArraySize] = 0;
	endTime[greyBoxArraySize] = milliseconds;
	start[greyBoxArraySize] = true;
	greyBoxArraySize = greyBoxArraySize + 1;
	sleeper(50, greyBoxArraySize - 1);		
}

// sleeper function for greybox startup
function sleeper(milliseconds, idx)
{
	if(elapsedTime[idx] >= endTime[idx])
	{
		setTimeout("loadNuglet(\""+String(greyBoxSleepKey[idx])+"\","+greyBoxSleepExpandStatus[idx]+","+idx+")",0);
	}
	else
	{
		if(!start[idx])
			elapsedTime[idx] = elapsedTime[idx] + milliseconds;
		else
			start[idx] = false;
		setTimeout("sleeper("+milliseconds+","+idx+")", milliseconds);
	}
}

//releases cricitcal section, makes it possible for next greybox startup to start
function releaseCriticalSection()
{
	clearTimeout(greybBoxCriticalSectionTimer);
	greyBoxCriticalSection = 0;
}

//timeout for cricitcal section, in case login fails and cs is never released
function timeOutCriticalSection()
{
	this.portalWnd.lawTraceMsg("Login Timed Out, Releasing Lock");
	greyBoxCriticalSection = 0;
	this.portalWnd.lawTraceMsg("Exited Critical Section <Timeout>");
}

//checks if greybox is already logged into
function isLoggedInFromAttrUrl(strURL)
{
	var urlAry = strURL.split("|");
	var svcName = null;
	var bgURL="";
	for (var i=0; i<urlAry.length; i++)
	{
		if (urlAry[i].substring(0,4) == "URL=")
			bgURL = urlAry[i].substring(4);
		else if (urlAry[i].substring(0,12) == "SERVICENAME=")
			svcName = urlAry[i].substring(12);
	}
	if (bgURL == "")
		return false;
	else
	{
		var bgBox = new portalWnd.BBoxObject(bgURL, svcName);
		return bgBox.isLoggedIn();
	}
}

function isGreyBox(strURL)
{
	var urlAry = strURL.split("|");
	var svcName = null;
	var bgURL="";
	for (var i=0; i<urlAry.length; i++)
	{
		if (urlAry[i].substring(0,4) == "URL=")
			bgURL = urlAry[i].substring(4);
		else if (urlAry[i].substring(0,12) == "SERVICENAME=")
			svcName = urlAry[i].substring(12);
	}
	if (bgURL == "")
		return false;
	else
	{
		var bgBox = new portalWnd.BBoxObject(bgURL, svcName);
		return (bgBox.type.toLowerCase() == "greybox");
	}
}

function loadNuglet(key,expandStatus,idx)
{
	if(typeof(idx) == "undefined")
		idx = null;

	var bObj = null;
	if(idx != null)
	{
		bObj = greyBoxSleepBObj[idx];
	}
	else
	{
		bObj = getBookmarkObj(key)
		if (bObj==null) {
			// the bookmark was in the layout, but not provided by 						
			// authen/profile.
			// the user no longer has access to the bookmark.
			//window.status = subMsgs.getPhrase("LBL_TRIMMED")
			return false
		}
	}
	if(bObj == null)
		return false;

	var content = bObj.content
	var url=content.getAttribute(ATTR_URL)

	//*************************************************************************************
	if(isGreyBox(url))
	{
		this.portalWnd.lawTraceMsg("Bookmark is a GreyBox");
		if(greyBoxCriticalSection == 1) 
		{
			if(idx == null)
				sleepLoadNuglet(100, key, expandStatus, bObj);
			else
				sleepLoadNuglet(100, key, expandStatus, bObj, idx);
			return;
		}
	
		greyBoxCriticalSection = 1
		greybBoxCriticalSectionTimer = setTimeout("timeOutCriticalSection()", 10 * 1000);
		this.portalWnd.lawTraceMsg("Entered Critical Section");
	
		if(isLoggedInFromAttrUrl(url))
		{
			clearTimeout(greybBoxCriticalSectionTimer);
			greyBoxCriticalSection = 0;
			this.portalWnd.lawTraceMsg("Exited Critical Section <Already Logged In>");
		}
	}
	//**************************************************************************************

	if (url)
	{
		url=portalWnd.processURLString(url)
        	url=url.replace(/host\|portal/, "host|page");
   	}

	var imgId = "img_" + key + (expandStatus?"_x":"")
	var img = document.getElementById(imgId)
	if (!img) return
		

	var iframe = document.createElement("iframe")
	iframe.id = "iframe_" + key + (expandStatus?"_x":"")
	iframe.name = "iframe_" + key + (expandStatus?"_x":"")
	iframe.title = getBookmarkObjName(bObj)
	iframe.src = url
	iframe.frameBorder = "false"
	
	var pNode = img.parentNode
	if (isIE) 
		pNode.replaceChild(iframe,img)
	else
	{
		// need to do this before there are changes to the nuglet size
		detCoords(pNode);
		pNode.insertBefore(iframe,img)
		pNode.removeChild(img)
	} 

	// det prescribed height
	var h
	if (isIE || content.getAttribute)
		h=content.getAttribute(ATTR_HEIGHT);

	arrIframes[arrIframes.length] = iframe
	img.span.collapseNode.image = iframe
	var style = iframe.style;
	if (isIE) 
	{
		style.height = "100%"
		style.width = "100%"
	} 
	else 
	{
		// specify size to parent node for ns
		style.width = pNode.detWidth + "px"
		style.height = pNode.detHeight + "px";
	}
	// make it at least the minimum height
	if (!expandStatus && !h)
		iframe.check = setTimeout("checkIframe('"+key+"')",100)
}

function checkIframe(key) {
	var id="iframe_" + key;
	var iframe = document.getElementById(id);
	if (typeof(iframe)!="undefined")
	{
		detCoords(iframe)
		if (iframe.detHeight<minContentPx) {
			iframe.style.height = minContentPx + "px"
		}
	}
}

function renderColumnSizer(content,cellNumber,parentNode,baseNode) {
	var s = document.createElement("div")
	s.className = "xTColResize"
	with (s.style) {
		whiteSpace = "nowrap"
		if (isIE)
			height = "100%"
		else
		{
			height = "100px"
			arrColumns[arrColumns.length]=s
		} 
		width = edgeWidth + "px"
	}
	s.onselectstart = portalWnd.cmnBlockSelect;
	s.onmousedown = columnDragStart
	s.baseNode = baseNode
	parentNode.appendChild(s)
	return s
}

function growColumnsNS() {
	for (var i=0;i<arrColumns.length;i++) {
		var c=arrColumns[i]
		detCoords(c.parentNode)
		c.style.height = c.parentNode.detHeight + "px"
	}
}

function getBookmarkObj(key) {
	if (!arrBookmarkObj)
		return null
	var len = arrBookmarkObj.length
	var bObj = null
	for (var i=0;i<len;i++) {
		bObj = arrBookmarkObj[i]
		if (bObj.key == key)
			return bObj
	}
	return null
}

// bookmarkObj for storing array of smart bookmarks
function BookmarkObj(key) {
	this.content = null
	this.key = key
	this.nm = null
}

///// LAYOUT DRAG

function layoutDragStart(event) {
	// start dragging a nuglet
	var t = detTarget(event)
	if (t.tagName.toUpperCase() == "TD") {
		t = t.span
	}
	lyrDrag.elNode = t
	lyrDrag.table = t.table

	// leave if not in edit mode
	if (!editMode) {
		var fromNode = lyrDrag.elNode
		layoutNodeClick(fromNode)
		return
	}
	
	window.status = relocatingPhrase + " " + t.name
	
	// Get cursor position with respect to the page.
	detCoords(lyrContent)
	detMouse(event)
	lyrDrag.oX = mX
	lyrDrag.oY = mY
	
	// iterative position finding code from menu.js
	detCoords(lyrDrag.table)
			
	lyrDrag.oLeft = lyrDrag.table.detLeft
	lyrDrag.oTop = lyrDrag.table.detTop
	lyrDrag.oHeight = lyrDrag.table.detHeight
	lyrDrag.oWidth = lyrDrag.table.detWidth
		
	// position so when visible, appears ok
	with (lyrDrag.style) {
		// scroll offset - lyrDrag is on page coords, not scroller
		left = (lyrDrag.oLeft - mdX) + "px"
		top = (lyrDrag.oTop - mdY) + "px"
		height = lyrDrag.oHeight + "px"
		width = lyrDrag.oWidth + "px"
	}
	
	// Determine bottom most nuglet, for drop below
	lastNuglet = lowestSpan(arrNugletTables)
	
	// Capture mousemove and mouseup events on the page.
	if (isIE) 
	{
		lyrDrag.setCapture()
		document.attachEvent("onmousemove", layoutDragGo);
		document.attachEvent("onmouseup",   layoutDragStop);
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	}
	else
	{
		document.addEventListener("mousemove", layoutDragGo,   true);
		document.addEventListener("mouseup",   layoutDragStop, true);
		event.preventDefault();
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
			hideIframes()
		}
	
		// determine hot edges
		hotSpans(mX,mY)

		var nL, nT
		if (hotSpan) {
			var t = hotSpan.table
		
	 		// Move drag element to hotEdge position
			switch (hotSpan.pos) {
				case 8:
					lyrDrag.oHeight = edgeWidth
					lyrDrag.oWidth = t.detWidth
					nL = t.detLeft
 					nT = (t.detTop - lyrDrag.oHeight)
					break;
					
				case 6:
					lyrDrag.oHeight = t.detHeight
					lyrDrag.oWidth = edgeWidth
					nL = t.detRight
 					nT = t.detTop
					break;
				
				case 4:
					lyrDrag.oHeight = t.detHeight
					lyrDrag.oWidth = edgeWidth
					nL = (t.detLeft - lyrDrag.oWidth)
 					nT = t.detTop
					break;
				
				case 2:
					lyrDrag.oHeight = edgeWidth
					lyrDrag.oWidth = t.detWidth
					nL = t.detLeft
 					nT = t.detBottom
					break;
						
				default:
					break;

			} // switch

			with (lyrDrag.style) {
				height = lyrDrag.oHeight + "px"
				width = lyrDrag.oWidth + "px"
				left = (nL - mdX) + "px"
				top = (nT - mdY) + "px"
				visibility = "visible"
			}

		} else {
			// drag to top or bottom
			with (lyrDrag.style) {
				detCoords(lyrDrag.elNode)
				height = lyrDrag.elNode.detHeight + "px"
				width = lyrContent.detWidth + "px"
				left = lyrContent.detLeft + "px"
				var weight = mY - ((lastNuglet?lastNuglet.detBottom:rcCell.detTop)/2) 
				if (weight < 0) {
					top = (lyrContent.detTop - edgeWidth) + "px"
				} else
					top = ((lastNuglet?lastNuglet.detBottom:lyrContent.detTop) + edgeWidth) + "px"
			}
		}
	}

	if (isIE) 
	{
		window.event.cancelBubble = true;
	   	window.event.returnValue = false;
	}
	else
   		event.preventDefault();
}

function layoutDragStop(event) {
	// Stop capturing mousemove and mouseup events.
	if (isIE) 
	{
    	document.detachEvent("onmousemove", layoutDragGo);
    	document.detachEvent("onmouseup", layoutDragStop);
    	document.releaseCapture()
	}
	else
	{
    	document.removeEventListener("mousemove", layoutDragGo, true);
    	document.removeEventListener("mouseup", layoutDragStop, true);
  	}
	
	portalWnd.cmnClearStatus();

	// hide drag layer
	lyrDrag.style.visibility = "hidden"

	if (lyrDrag.dragging) {
		lyrDrag.dragging = false
		showIframes()
		
	 	// Get mouse position
		detMouse(event)
	 	
		// position node
 		var lastLeft = (lyrDrag.oLeft + mX - lyrDrag.oX)
 		var lastTop = (lyrDrag.oTop + mY - lyrDrag.oY)
		layoutDrop(lastLeft, lastTop)
		return
	} else {
		var fromNode = lyrDrag.elNode
		layoutNodeClick(fromNode)
		return
	}
}

// user clicked on the text for a node
// called by selectNodeId
var lastLayoutClick
function layoutNodeClick(node) {
	// if user clicked on open space, turn off any old hot nodes
	if (!node) {
		// turn off old hot node
		lastLayoutClick=null
		hotNode=null
		return
	}
	
	// compare times for double click
	var newDate = new Date()
	if (hotNode == node && lastLayoutClick && doubleClickTime(lastLayoutClick,newDate)) {
		spanCollapse(node)
		lastLayoutClick=null
		hotNode=null
		return
	}
	lastLayoutClick=newDate
	
	// set new hot node	
	hotNode = node
}

function hotSpans(x,y) {
	// see if hot span still hot
	var edge
	if (hotSpan) {
		if (nodeContains(hotSpan.table,x,y)) {
			edge = detClosest(hotSpan.table,x,y,"edge")
			hotSpan.pos = edge
			return
		}
		else {
			cleanSpan()
		}
	}

	// find closest span
	var span
	var d
	var minSpan = null
	var minD = 5000 * 5000
	for (var i=0;i<arrNugletSpans.length;i++) {
		span = arrNugletSpans[i]
		d = detClosest(span.table,x,y,"dist")
		if (d<minD) {
			minSpan = span
			minD = d
		}
	}
	
	// find closest edge
	if (minD < 100 * 100) {
		edge = detClosest(minSpan.table,x,y,"edge")
		hotSpan = minSpan
		hotSpan.pos = edge
		return
	}
}

function cleanSpan() {
	if (hotSpan) {
		hotSpan.pos = 0
		hotSpan = null
	}
}

function layoutDrop(lastLeft, lastTop) {
	// from node is the node that was being dragged
	// lastLeft and lastTop are the upper left corner of lyrDrag
	dropNuglet();
	homeDirty();
	cleanSpan();
}

function dropNuglet() {
	// from = old source node
	var fromElement = lyrDrag.elNode
	if (!fromElement)
		return

	var fromNode = fromElement.content
	var fromParent = fromNode.parentNode
	
	if (hotSpan!=null) {

		// to = new destination node
		var toNode = hotSpan.content
		
		var notSame = (fromNode != toNode)
		if (notSame) {

			var toParent = toNode.parentNode
			var toParentTag = toParent.tagName
			var toParentFlow = ((toParentTag == TAG_FLOW) ? toParent.getAttribute(ATTR_DIR) : null)
			var nextSibling = toNode.nextSibling
			var nextSibling2 = null
			if (nextSibling!=null)
				nextSibling2 = nextSibling.nextSibling
	
			fromParent.removeChild(fromNode)
			switch (hotSpan.pos) {
				case 8:
					if (!toParentFlow || toParentFlow == DIR_HORIZONTAL) {
	
						// remove elements
						toParent.removeChild(toNode)
						
						// create flow element in parent
						var toFlowNode = profileDoc.createElement(TAG_FLOW)
						toFlowNode.setAttribute(ATTR_DIR,DIR_VERTICAL)
						toFlowNode.appendChild(fromNode)
						if (nextSibling && nextSibling.parentNode == toParent)
							toParent.insertBefore(toFlowNode,nextSibling)			
						else if (nextSibling == fromNode) {
							toParent.insertBefore(toFlowNode,nextSibling2)
						} else
							toParent.appendChild(toFlowNode)
								
						// add nodes to flow element
						toFlowNode.appendChild(fromNode)
						toFlowNode.appendChild(toNode)

						transferWidthAttribute(toNode,toFlowNode)
					}
					else if (toParentFlow == DIR_VERTICAL) {
						var beforeNode
						if (fromNode==toNode) {
							beforeNode = nextSibling
						} else
							beforeNode=toNode
						toParent.insertBefore(fromNode,beforeNode)
					}
					cleanNode(fromParent)
					break
		
				case 4:
					if (!toParentFlow || toParentFlow == DIR_VERTICAL) {
						// remove elements
						toParent.removeChild(toNode)
						
						// create flow element in parent
						var toFlowNode = profileDoc.createElement(TAG_FLOW)
						toFlowNode.setAttribute(ATTR_DIR,DIR_HORIZONTAL)
						if (nextSibling && nextSibling.parentNode == toParent)
							toParent.insertBefore(toFlowNode,nextSibling)			
						else if (nextSibling == fromNode) {
							toParent.insertBefore(toFlowNode,nextSibling2)
						} else
							toParent.appendChild(toFlowNode)
	
						// add nodes to flow element
						toFlowNode.appendChild(fromNode)
						toFlowNode.appendChild(toNode)

						transferWidthAttribute(toNode,toFlowNode)
					}
					else if (toParentFlow == DIR_HORIZONTAL) {
						if (MAX_COLUMNS && toParent.childNodes.length>=MAX_COLUMNS) {
							toParent.parentNode.insertBefore(fromNode,toParent)
						} else {
							var beforeNode
							if (fromNode==toNode) {
								beforeNode = nextSibling
							} else
								beforeNode=toNode
							toParent.insertBefore(fromNode,beforeNode)
						}
					}
					cleanNode(fromParent)
					break
		
				case 6:
					if (!toParentFlow || toParentFlow == DIR_VERTICAL) {
						// remove elements
						toParent.removeChild(toNode)
						
						// create flow element in parent
						var toFlowNode = profileDoc.createElement(TAG_FLOW)
						toFlowNode.setAttribute(ATTR_DIR,DIR_HORIZONTAL)
						if (nextSibling && nextSibling.parentNode == toParent)
							toParent.insertBefore(toFlowNode,nextSibling)			
						else if (nextSibling == fromNode) {
							toParent.insertBefore(toFlowNode,nextSibling2)
						} else
							toParent.appendChild(toFlowNode)
								
						// add nodes to flow element
						toFlowNode.appendChild(toNode)
						toFlowNode.appendChild(fromNode)

						transferWidthAttribute(toNode,toFlowNode)
					}
					else if (toParentFlow == DIR_HORIZONTAL) {
						if (MAX_COLUMNS && toParent.childNodes.length>=MAX_COLUMNS) {
							toParent.parentNode.insertBefore(fromNode,toParent.nextSibling)
						} else {
							var beforeNode
							if (fromNode==nextSibling) {
								beforeNode = nextSibling2
							} else
								beforeNode=nextSibling
							toParent.insertBefore(fromNode,beforeNode)
						}
					}
					break
		
				case 2:
					if (!toParentFlow || toParentFlow == DIR_HORIZONTAL) {
						// remove elements
						toParent.removeChild(toNode)
						
						// create flow element in parent
						var toFlowNode = profileDoc.createElement(TAG_FLOW)
						toFlowNode.setAttribute(ATTR_DIR,DIR_VERTICAL)
						if (nextSibling && nextSibling.parentNode == toParent)
							toParent.insertBefore(toFlowNode,nextSibling)			
						else if (nextSibling == fromNode) {
							toParent.insertBefore(toFlowNode,nextSibling2)
						} else
							toParent.appendChild(toFlowNode)
		
						// add nodes to flow element
						toFlowNode.appendChild(toNode)
						toFlowNode.appendChild(fromNode)

						transferWidthAttribute(toNode,toFlowNode)
					}
					else if (toParentFlow == DIR_VERTICAL) {
						var beforeNode
						if (fromNode==nextSibling) {
							beforeNode = nextSibling2
						} else
							beforeNode=nextSibling
						toParent.insertBefore(fromNode,beforeNode)
					}
					break
		
				default:
					break
			} // switch hotSpan.pos
			cleanNode(fromParent)
			
			// redraw content pane
			renderContentPane()
		} // fromNode != toNode
	} // hotSpan
	
	//else if (confirm(portalObj.getPhrase("LBL_DROPNEW"))) { // ! hotSpan
	else { // ! hotSpan
		
		// remove from old location
		fromParent.removeChild(fromNode)
		
 		// put element in parent at start or end
		var toParent = objContent
		var weight = mY - ((lastNuglet?lastNuglet.detBottom:rcCell.detTop)/2)
		if (weight<0 && toParent.firstChild) {
			toParent.insertBefore(fromNode,toParent.firstChild)
		} else {
			toParent.appendChild(fromNode)
		}
		
		cleanNode(fromParent)

		renderContentPane()
	}
}

///// COLUMN DRAG

function columnDragStart(event) {
	// leave if not in edit mode
	if (!editMode) {
		return
	}

	window.status = resizingPhrase + " " + colWidthPhrase
	 hideIframes() 
	// start dragging a column
	var t = detTarget(event)
	lyrDrag.elNode = t

	// Get cursor position with respect to the page.
	detMouse(event)
	lyrDrag.oX = mX
	lyrDrag.oY = mY
	
	// iterative position finding code from menu.js
	detCoords(t)
	detCoords(t.baseNode)

	if (isIE)
		lyrDrag.oLeft = t.detLeft
	else	
		lyrDrag.oLeft = mX 
	
	lyrDrag.oTop = t.detTop
	lyrDrag.oHeight = Math.max(t.detHeight,t.baseNode.detHeight)
	lyrDrag.oWidth = t.detWidth

	lyrDrag.baseLeft = lyrDrag.elNode.baseNode.detLeft
	lyrDrag.baseWidth = lyrDrag.elNode.baseNode.detWidth
	
	// position so when visible, appears ok
	with (lyrDrag.style)
	 {
		// scroll offset - lyrDrag is on page coords, not scroller
		left = (lyrDrag.oLeft - mdX) + "px"
		top = (lyrDrag.oTop - mdY) + "px"
		height = lyrDrag.oHeight + "px"
		width = lyrDrag.oWidth + "px"
	}

	// Capture mousemove and mouseup events on the page.
	if (isIE) 
	{
		lyrDrag.setCapture()
		document.attachEvent("onmousemove", columnDragGo);
		document.attachEvent("onmouseup",   columnDragStop);
		window.event.cancelBubble = true;					
		window.event.returnValue = false;
	}
	else
	{
		document.addEventListener("mousemove", columnDragGo,   true);
		document.addEventListener("mouseup",   columnDragStop, true);
		event.preventDefault();		
	}
}

function hideIframes() {
	for (var i=0;i<arrIframes.length;i++) {
		arrIframes[i].style.visibility="hidden"
	}
}

function showIframes() {
	for (var i=0;i<arrIframes.length;i++) {
		arrIframes[i].style.visibility="visible"
	}
}

function columnDragGo(event) {
	lastX = mX
	lastY = mY
	detMouse(event)

	if (lastX != mX || lastY != mY) {
	
		// If moved, show draglayer
		if (!lyrDrag.dragging && mouseMoved(mX,mY,lyrDrag.oX,lyrDrag.oY)) {
			lyrDrag.dragging = true
			lyrDrag.style.visibility = "visible"
			hideIframes()
			var where=lyrDrag.style.position="absolute"
			where.left="800"
		}
	
 		// Move drag element by the same amount the cursor has moved.
		nL = (lyrDrag.oLeft + mX - lyrDrag.oX)
		nT = lyrDrag.oTop
		
		var p = ((nL-lyrDrag.baseLeft) / lyrDrag.baseWidth) * 100
		lyrDrag.alt = ( event.altKey && !event.ctrlKey && !event.shiftKey )
		if (lyrDrag.alt)
			p = (Math.round(p/gridPx)*gridPx)
		p=acceptP(p)
		
		nL = parseInt(lyrDrag.baseLeft + ((p * lyrDrag.baseWidth) / 100))
		lyrDrag.style.left = nL + "px";
		lyrDrag.style.top = nT + "px";
		window.status = colWidthPhrase + ": " + p + "%"
		}

	if (isIE) 
	{
		window.event.cancelBubble = true;
	   	window.event.returnValue = false;
	}
	else
   		event.preventDefault();
}

function acceptP(p) {
	p = parseInt(p,10)
	p = Math.max(p,minColPercentage)
	p = Math.min(p,maxColPercentage)
	return p
}

function columnDragStop(event) {
	// Stop capturing mousemove and mouseup events.
	if (isIE) 
	{
    	document.detachEvent("onmousemove", columnDragGo);
    	document.detachEvent("onmouseup", columnDragStop);
    	document.releaseCapture()
	}
	else
	{
    	document.removeEventListener("mousemove", columnDragGo, true);
    	document.removeEventListener("mouseup", columnDragStop, true);
  	}
	
	// hide drag layer
	lyrDrag.style.visibility = "hidden";
	portalWnd.cmnClearStatus();

	if (lyrDrag.dragging) 
	{
		lyrDrag.dragging = false
		showIframes()
		
	 	// Get mouse position
		detMouse(event)
	 	
		// position node
 		var nL = (lyrDrag.oLeft + mX - lyrDrag.oX)
		columnDrop(nL)

		if (!isIE)
			growColumnsNS()		
	}
}

function columnDrop(nL) {
	// Determine final
	var p = (nL-lyrDrag.baseLeft) / lyrDrag.baseWidth * 100
	if (lyrDrag.alt)
		p = (Math.round(p/gridPx)*gridPx)
	p=acceptP(p)
		
	var content = lyrDrag.elNode.baseNode.content
	if (content.hasChildNodes()) {
		var arrPercent = new Array()
		for(var i=0;i<content.childNodes.length;i++) {
			if (content.childNodes[i].nodeType == 1) {
				arrPercent[arrPercent.length] = content.childNodes[i]
			}
		}
		
		// 2 columns max
		if (arrPercent.length==2) {
			arrPercent[0].setAttribute(ATTR_WIDTH,p)
			arrPercent[1].setAttribute(ATTR_WIDTH,100-p)
			homeDirty();
			renderContentPane()
		}
	}
}

function transferWidthAttribute(n1,n2) {
	// if exists, transfers the width attribute from the toNode to the toFlowNode
	if (isIE || (n1.hasAttributes() && n1.hasAttribute(ATTR_WIDTH))) {
		var w = n1.getAttribute(ATTR_WIDTH)
		if (w) {
			n1.removeAttribute(ATTR_WIDTH)
			n2.setAttribute(ATTR_WIDTH,w)
		}
	}
}

// called if changes on load, or if the user presses save
function fnDone()
{
	if (homeSave())
	{
		notDirty();
		homeRefresh();
	}
}

function homeSave()
{
	var ret=profile.save();
	return (!ret ? false : true);
}

// if this is a flow element and is now empty, remove it
//#105097 return true if changed; remove empty flows
function cleanNode(node) {
	var nodeTag = node.tagName
	var nodeParent = node.parentNode
	var nodeFlow = ((nodeTag == TAG_FLOW) ? node.getAttribute(ATTR_DIR) : null)
	
	// only continue if we are a flow node
	if (nodeFlow && nodeParent) {
		// if there are no children, remove this node
		var len=(node.childNodes?node.childNodes.length:0)
		if (len==0)
		{
			nodeParent.removeChild(node)
			return cleanNode(nodeParent)
		}

		// if there is only 1 child, this flow node can be pruned and the child raised
		if (len==1)
		{
			var sib = node.nextSibling
			nodeParent.removeChild(node)
			var pushNode = node.childNodes[0]
			nodeParent.insertBefore(pushNode,sib)
			transferWidthAttribute(node,pushNode)
			return true
		}
		
		var arr = node.getElementsByTagName(TAG_NUGLET)
		len = (arr?arr.length:0)

		// if there are no nuglet children, remove this node
		if (len == 0) {
			nodeParent.removeChild(node)
			return cleanNode(nodeParent)
		}

		// if there is ouglet cnly 1 nhild, this flow node can be pruned and the child raised
		else if (len == 1) {
			var sib = node.nextSibling
			nodeParent.removeChild(node)
			var pushNode = arr[0]
			nodeParent.insertBefore(pushNode,sib)
			transferWidthAttribute(node,pushNode)
			return true
		}
	}
	return false
}

function notDirty() {
	portalObj.toolbar.target = window
	portalObj.toolbar.clear()
	if (arrNugletSpans && arrNugletSpans.length)
		portalObj.toolbar.createButton(portalObj.getPhrase("LBL_EDIT_LAYOUT"), "editLayout()")

	isDirty=false
	editMode = false
}

function editLayout() {
	// setup toolbar with necessary links
	portalObj.toolbar.target = window
	portalObj.toolbar.clear()
	portalObj.toolbar.createButton(portalObj.getPhrase("LBL_CANCEL_LAYOUT"), "cancelLayout()")
	
	if (!isIE)
		growColumnsNS()
		
	editCursors()
			
	editMode = true
}

// user pressed cancel layout toolbar button
function cancelLayout()
{
	if (isDirty)
		notDirty();
	if (editMode)
		defaultCursors();
	profile.setModified(false);
	homeRefresh();
}

///// EXPAND functions

function expandClick(e) {
	var t=detTarget(e)
	var span = t.span
	var content = span.content
	if (span.expandStatus)
		hideExpand()
	else
		renderExpand(content)	
}

function renderExpand(content) {
	abandonChildren(lyrExpand)
	renderNuglet(content,lyrExpand,true)
	lyrExpand.style.visibility = "visible"
	lyrContent.style.visibility = "hidden"
}

function hideExpand() {
	abandonChildren(lyrExpand)
	lyrExpand.style.visibility = "hidden"
	lyrContent.style.visibility = "visible"
}

function spanStateClick(e)
{
	var targ = detTarget(e)
	if (targ && targ.span)
		spanCollapse(targ.span)
}

function getBookmarkName(key) {
	// remove from bookmarks array
	var bObj = getBookmarkObj(key)
	if (!bObj)
		return null
	return getBookmarkObjName(bObj)
}

function getBookmarkObjName(bObj) {
	return bObj.content.getAttribute(ATTR_NAME)
}

function handleKeyDown(evt)
{
	evt = detEvent(evt)
	if (!evt) return false
		
	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"home");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "home")
	{
		cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt)
		return false;
	}

	// want to 'hide' this feature -- no hotkey defined (ctrl+alt+A or ctrl+shft+V)
	if (evt.altKey && evt.ctrlKey && !evt.shiftKey && evt.keyCode == 65
	|| !evt.altKey && evt.ctrlKey && evt.shiftKey && evt.keyCode == 86)
	{
		portalWnd.switchContents("homedebug.htm");
		portalWnd.setEventCancel(evt);
		return false;
	}
	return true;
}


//-----------------------------------------------------------------------------
function cntxtActionHandler(evt,action)
{
	if (action==null)
	{
		// if home frame is loaded
		if (homeLoaded)
		{
			var contentFrame=document.getElementById("contentFrame")
			if (contentFrame && typeof(contentFrame.contentWindow.cntxtActionHandler)=="function")
				return (contentFrame.contentWindow.cntxtActionHandler(evt,action));
		}

		// called by the portal
		action = portalWnd.getFrameworkHotkey(evt,"home");
		if (!action || action=="home")
			return false;
	}
	var bHandled=false
	switch (action)
	{
	case "doCancel":
		bHandled=true
		break;
	case "openNewWindow":
		portalWnd.newPortalWindow();
		bHandled=true;
		break;
	}
	return (bHandled);
}

function spanDeleteClick(e) {
	var t = detTarget(e)
	if (t && t.span)
		layoutRemoveNode(t.span)
}

///// BOOKMARK KEYS

function forgetBookmarkKey(key) {
	// remove from bookmarks array
	var bm
	for (var i=0;i<objBookmarkKeys.childNodes.length;i++) {
		bm = objBookmarkKeys.childNodes[i]
		if (bm.nodeType == 1) {
			if (bm.getAttribute(ATTR_KEY) == key) {
				objBookmarkKeys.removeChild(bm)
				return
			}
		}
	}
}

function layoutRemoveNode(node)
{
	// do not remove if locked!
	if (node.laylock)
	{
		alert(getLaylockPhrase(node.laylock))
		return
	}
	
	var nodeContent = node.content
	var nodeParent = nodeContent.parentNode
	nodeParent.removeChild(nodeContent)
	var key = nodeContent.getAttribute(ATTR_KEY)
	if (key)
		forgetBookmarkKey(key)

	cleanNode(nodeParent)
	renderContentPane()
	homeDirty();
}

function getBookmarkLock(key,attr)
{
	// attr is ATTR_LAYOUT or ATTR_SUBSCRIPTION
	var bm
	if (objAdminBlocks!=null) {
		for (var i=0;i<objAdminBlocks.childNodes.length;i++) {
			bm = objAdminBlocks.childNodes[i]
			if (bm.nodeType == 1) {
				if (bm.getAttribute(ATTR_KEY) == key) {
					var s=bm.getAttribute(attr)
					if (s)
						return s
					break
				}
			}
		}
	}
	if (objUserBlocks!=null) {
		for (var i=0;i<objUserBlocks.childNodes.length;i++) {
			bm = objUserBlocks.childNodes[i]
			if (bm.nodeType == 1) {
				if (bm.getAttribute(ATTR_KEY) == key) {
					var s=bm.getAttribute(attr)
					if (s)
						return s
					break
				}
			}
		}
	}
	return null
}

// modifies the mouse coordinates determined in detMouse (layout.js) for the
// current layout/scroll situation.
function detMouse2(event) 
{
	mdX = 0;
	mdY = 0;

	if (isIE)  
	{
		mdX = lyrContent.scrollLeft;
		mdY = lyrContent.scrollTop;
	}
	mX += mdX;
	mY += mdY;
}

///// grow

// clicking/double clicking on nuglet spans
function growClick(e) {
	var t = detTarget(e)
	if (!t)
		return
	if (t.grow_ns)
		t = t.grow_ns
	growClickSpan(t)
}

//#105097 - growStatus added
function growStatus(e) {
	if (!editMode)
		return
	var t = detTarget(e)
	if (!t)
		return
	if (t.tagName.toUpperCase() == "IMG") {
		t = t.parentNode
	}
	var table=t.span.table
	detCoords(table)
	window.status = heightPhrase + ": " + table.detHeight + "px"
	
}

function growClickSpan(span) {

	// if user clicked on open space, turn off any old hot nodes
	if (!span) {
		// turn off old hot node
		lastSpanClick=null
		hotSpan=null
		return
	}
	
	// compare times for double click
	var newDate = new Date()
	if (hotSpan == span && lastSpanClick && doubleClickTime(lastSpanClick,newDate)) {
		growDoubleClickSpan(span)
		return
	}
	lastSpanClick=newDate
	hotSpan = span
}

function growDoubleClick(e) {
	var t = detTarget(e)
	if (t.grow_ns)
		t = t.grow_ns
	growDoubleClickSpan(t)
}

function growDoubleClickSpan(span) {
	if (!editMode)
		return
		
	// only do double click if height specified
	var	h = span.span.content.getAttribute(ATTR_HEIGHT)
	if (h!=null) {
		if (confirm(portalObj.getPhrase("LBL_REMOVE_PRESCRIPT"))) {
			span.span.content.removeAttribute(ATTR_HEIGHT)
			homeDirty();
			renderContentPane()
		}
	}

	lastSpanClick=null
	hotSpan=null
}

function growDragStart(event) 
{
	// start dragging a nuglet

	var t = detTarget(event)
	if (t.tagName.toUpperCase() == "IMG") {
		t = t.parentNode
	}
	lyrDrag.elNode = t.span
	lyrDrag.table = t.span.table


	// leave if not in edit mode
	if (!editMode) {
		growClickSpan(t)
		return
	}
	
	window.status = resizingPhrase + " " + t.span.name
	
	// Get cursor position with respect to the page.
	detCoords(lyrContent)
	detMouse(event)
	lyrDrag.oX = mX
	lyrDrag.oY = mY
	
	// iterative position finding code from menu.js
	detCoords(lyrDrag.table)
	
	if (!isIE)
		lyrDrag.oLeft = mX + mdX
	
	lyrDrag.oLeft = lyrDrag.table.detLeft
	lyrDrag.oTop = lyrDrag.table.detTop
	lyrDrag.oHeight = lyrDrag.table.detHeight
	lyrDrag.oWidth = lyrDrag.table.detWidth

	
	with (lyrDrag.style) {
		// scroll offset - lyrDrag is on page coords, not scroller
		left = (lyrDrag.oLeft - mdX) + "px"
		top = (lyrDrag.oTop - mdY) + "px"
		height = lyrDrag.oHeight + "px"
		width = lyrDrag.oWidth + "px"
	}
	
	// Capture mousemove and mouseup events on the page.
	if (isIE) 
	{
		lyrDrag.setCapture()
		document.attachEvent("onmousemove", growDragGo);
		document.attachEvent("onmouseup", growDragStop);
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	}
	else
	{
		document.addEventListener("mousemove", growDragGo, true);
		document.addEventListener("mouseup", growDragStop, true);
		event.preventDefault();
	}
}

function growDragGo(event) {
	lastX = mX
	lastY = mY
	detMouse(event)

	if (lastX != mX || lastY != mY) {
		// If moved, show draglayer
		if (!lyrDrag.dragging && mouseMoved(mX,mY,lyrDrag.oX,lyrDrag.oY)) {
			lyrDrag.dragging = true
			lyrDrag.style.visibility = "visible"
			hideIframes()
		}
	
		// determine current h
		var h = lyrDrag.oHeight - lyrDrag.oY + mY
		if ( event.altKey && !event.ctrlKey && !event.shiftKey ) {
			h = (Math.round(h/gridPx)*gridPx)
		}
		h = Math.max(h,minHeight)
		lyrDrag.style.height = h + "px"
		
		window.status = heightPhrase + ": " + h + "px"
	}

	if (isIE) 
	{
		window.event.cancelBubble = true;
	   	window.event.returnValue = false;
	}
	else
   		event.preventDefault();
}

function growDragStop(event) {
	// Stop capturing mousemove and mouseup events.
	if (isIE) 
	{
    	document.detachEvent("onmousemove", growDragGo);
    	document.detachEvent("onmouseup", growDragStop);
    	document.releaseCapture()
	}
	else
	{
    	document.removeEventListener("mousemove", growDragGo, true);
    	document.removeEventListener("mouseup", growDragStop, true);
  	}
	
	portalWnd.cmnClearStatus();

	// hide drag layer
	lyrDrag.style.visibility = "hidden"

	if (lyrDrag.dragging) {
		lyrDrag.dragging = false
		showIframes()
		
	 	// Get mouse position
		detMouse(event)
	 	
		// determine final h
		var h = lyrDrag.oHeight - lyrDrag.oY + mY
		if ( event.altKey && !event.ctrlKey && !event.shiftKey ) {
			h = (Math.round(h/gridPx)*gridPx)
		}
		h = Math.max(h,minHeight)
		
		// from = old source node
		var fromElement = lyrDrag.elNode
		if (!fromElement)
			return
			
		fromElement.content.setAttribute(ATTR_HEIGHT,h+"")
		if (isIE) 
		{
			lyrDrag.table.style.height = h + "px"
			// reset iframe height
			resetIframeHeight(fromElement.content)
			// reset span coordinates
			resetSpans()
		}
		else
		{
			renderContentPane()
			growColumnsNS()
		}
					
		homeDirty();
		return
	} else {
		var fromNode = lyrDrag.elNode
		growClick(fromNode)
		return
	}
}

function resetSpans() {
	for (var i=0;i<arrNugletSpans.length;i++) {
		span = arrNugletSpans[i]
		span.detCoords=false
	}
}

function resetIframeHeight(content) {
	var key=content.getAttribute(ATTR_KEY)
	var id = "iframe_" + key
	var iframe = document.getElementById(id)
	var pNode = iframe.parentNode
	
	var h=null
	if (isIE || content.getAttribute)
		h = content.getAttribute(ATTR_HEIGHT)
				
	with (iframe.style) 
	{
		if (isIE) 
		{
			height = "100%"
			width = "100%"
		} 
		else 
		{
			// specify size to parent node for ns
			detCoords(pNode)
			width = pNode.detWidth + "px"
			height = pNode.detHeight + "px"
			
			// set twice for exact fit for ns
			detCoords(pNode)
			height = pNode.detHeight + "px"
		}
	}
	if (!h)
		iframe.check = setTimeout("checkIframe('"+key+"')",100)
}

// if layout locked, but not in layout, add to layout
// if bookmark unsubscribed, resubscribe for next time
// if bookmark changed navlet/nuglet status, reposition in layout
function checkLocked()
{
	window.status = portalObj.getPhrase("LBL_CHECKING_BOOKMARK_LOCKS")

	// if there are no locks - return
	var blockNodes = portalObj.profile.getElementsByTagName("BLOCK");
	if (blockNodes.length == 0)
		return;

	var bm
	var bDirty=false

	var arrNavlets=objNavigation.getElementsByTagName(TAG_NAVLET)
	var arrNavlets2=new Array();
	for (var i=0; i < arrNavlets.length; i++)
		arrNavlets2[i]=arrNavlets[i].getAttribute(ATTR_KEY)

	var arrNuglets=objContent.getElementsByTagName(TAG_NUGLET)
	var arrNuglets2=new Array();
	for (var i=0; i < arrNuglets.length; i++)
		arrNuglets2[i]=arrNuglets[i].getAttribute(ATTR_KEY)
	
	portalWnd.arrUnsub=null
	if (objAdminBlocks!=null)
	{
		if (!portalWnd.arrUnsub)
			loadUnsubscribed()
		for (var i=0;i<objAdminBlocks.childNodes.length;i++) {
			bm = objAdminBlocks.childNodes[i]
			if (bm.nodeType == 1) {
				var key = bm.getAttribute(ATTR_KEY)
				if (key) {
					if (bm.getAttribute(ATTR_LAYOUT)) {
						if (lockToLayout(key, arrNavlets2, arrNuglets2))
							bDirty|=true
					} else if (bm.getAttribute(ATTR_SUBSCRIPTION)) {
						if (lockToSubscription(key))
							bDirty|=true
					}
				}
			}
		}
	}
	if (objUserBlocks!=null) {
		//#102206 dme call
		if (!portalWnd.arrUnsub)
			loadUnsubscribed()
		for (var i=0;i<objUserBlocks.childNodes.length;i++) {
			bm = objUserBlocks.childNodes[i]
			if (bm.nodeType == 1) {
				var key = bm.getAttribute(ATTR_KEY)
				if (key) {
					if (bm.getAttribute(ATTR_LAYOUT)) {
						if (lockToLayout(key, arrNavlets2, arrNuglets2))
							bDirty|=true
					} else if (bm.getAttribute(ATTR_SUBSCRIPTION)) {
						if (lockToSubscription(key))
							bDirty|=true
					}
				}
			}
		}
	}

	// check consistency of navlet and nuglet information
	var k
	var n
	var found
	var navlen=(arrNavlets2?arrNavlets2.length:0)
	var nuglen=(arrNuglets2?arrNuglets2.length:0)
	// check navlets
	for (var i=0; i < navlen; i++)
	{
		k=arrNavlets2[i]

		// check for duplicates
		found=false
		for (var j=0;j<i && !found;j++)
			found|=(k==arrNavlets2[j]);

		// remove if duplicate
		if (found)
		{
			// remove navlet
			n=arrNavlets[i]
			n.parentNode.removeChild(n)
		}
		// check consistency
		else if (!bookmarkIsNavlet(k))
		{
			// remove navlet
			n=arrNavlets[i]
			n.parentNode.removeChild(n)
			
			// create nuglet if not already there
			found=false
			for (var j=0; j < nuglen && !found; j++)
				found|=(k==arrNuglets2[j])
			if (!found)
			{
				n = profileDoc.createElement(TAG_NUGLET)
				n.setAttribute(ATTR_KEY,k)
				objContent.appendChild(n)
				bDirty=true			
			}
		}
	}
	
	// check nuglets
	for (var i=0;i<nuglen;i++) {
		k=arrNuglets2[i]

		// check for duplicates
		found=false
		for (var j=0;j<i && !found;j++) {
			found|=(k==arrNuglets2[j])
		}
		// remove if duplicate
		if (found) {
			// remove nuglet
			n=arrNuglets[i]
			n.parentNode.removeChild(n)
		} 
		// check consistency
		else if (bookmarkIsNavlet(k))
		{
			// remove nuglet
			n=arrNuglets[i]
			n.parentNode.removeChild(n)
				
			// create navlet if not already there
			found=false
			for (var j=0;j<navlen && !found;j++) {
				found|=(k==arrNavlets2[j])
			}
			if (!found) {
				n = profileDoc.createElement(TAG_NAVLET)
				n.setAttribute(ATTR_KEY,k)
				objNavigation.appendChild(n)
				bDirty=true			
			}
		}
	}

	if (bDirty)
		homeDirty();
	arrNavlets=null;
	arrNavlets2=null;
	arrNuglets=null;
	arrNuglets2=null;
}

// bookmark is subscription locked, insure subscribed
function lockToSubscription(key) {
	var ret=false
	var bObj=getBookmarkObj(key)
	if (!bObj) {
		// insure subscribed
		ret=subscribeKey(key)
	}
	return ret
}


// delete previous "unsubscribe" record from lobkmarkopt
// will only help the next time we load
function subscribeKey(key)
{
	var ret=false

	// check keys to see if unsubscribed before calling ags
	if (!isUnsub(key))
		return ret

	var api = portalWnd.AGSPath + "?_PDL=LOGAN&" +
		"_TKN=LO15.1&" +
		"_LFN=TRUE&" +
		"_EVT=CHG&" +
		"_RTN=MSG&" +
		"_TDS=IGNORE&" +
		"_OUT=XML&" +
		"FC=D&" +
		"UBO-WEB-USER=" + profile.getId() + "&" +
		"UBO-BOOK-MARK=" + key + "&" +
		"_EOT=TRUE"
			
	try {
		// get request storage
		portalObj.setMessage(portalObj.getPhrase("LBL_LOADING"));
		var oXml = portalWnd.SSORequest(api, null, "", "", false);
		portalObj.setMessage("");

		var msg=portalObj.getPhrase("LBL_ERROR") + " - " + portalObj.getPhrase("AGSXMLERROR");
		portalWnd.oError.setMessage(msg);
		if (portalWnd.oError.isErrorResponse(oXml,true,true))
			return false;

		var objSubscribe = portalWnd.oError.getDSObject();

		// message and message number
		var message = objSubscribe.getElementValue(TAG_MESSAGE);
		var msgnbr = objSubscribe.getElementValue(TAG_MSGNBR);
		if ((message == "") && (msgnbr != "000"))
			message = portalObj.getPhrase("LBL_AGS_ERROR") + " " + msgnbr;
		portalObj.setMessage(message);

		// message number 0 == success
		if (msgnbr == 0)
			ret=true;

		// show error message, if exists
		else
			portalWnd.cmnDlg.messageBox(message,"ok","stop",window);

		objSubscribe=null;
	}
	catch (e) {
		var errMsg = portalObj.getPhrase("LBL_ERROR") + " - " + portalObj.getPhrase("LBL_UPDATING");
		portalWnd.cmnErrorHandler(e,window,HOMEJS,errMsg);
		ret = false;
	}
	return ret
}

// bookmark is layout locked, insure it is in layout
function lockToLayout(key, arrNavlets, arrNuglets)
{
	// simulate subscription lock because layout needs subscription
	var ret = lockToSubscription(key)
	
	// return if found in layout
	for (var i=0;i<arrNavlets.length;i++)
		if (arrNavlets[i] == key)
			return ret
	for (var i=0;i<arrNuglets.length;i++)
		if (arrNuglets[i] == key)
			return ret

	// determine type from server call since we do not know
	var tp = (bookmarkHasChildren(key)?TAG_NAVLET:TAG_NUGLET)
	if (tp == TAG_NAVLET)
	{
		// create navlet
		var node = profileDoc.createElement(TAG_NAVLET)
		node.setAttribute(ATTR_KEY,key)
		objNavigation.appendChild(node)
		rememberBookmarkKey(key)
		ret=true
	}
	else if (tp == TAG_NUGLET)
	{
		// create nuglet
		var node = profileDoc.createElement(TAG_NUGLET)
		node.setAttribute(ATTR_KEY,key)
		objContent.appendChild(node)
		rememberBookmarkKey(key)
		ret=true
	}
	return ret
}

function rememberBookmarkKey(key)
{
	// add to bookmarks array
	if (!getBookmarkKey(key)) {
		var bm = profileDoc.createElement(TAG_BOOKMARK)
		bm.setAttribute(ATTR_KEY,key)
		objBookmarkKeys.appendChild(bm)
	}
}

function getBookmarkKey(key)
{
	// find in bookmarks array
	var bm
	for (var i=0; i < objBookmarkKeys.childNodes.length; i++)
	{
		bm = objBookmarkKeys.childNodes[i]
		if (bm.nodeType == 1)
		{
			if (bm.getAttribute(ATTR_KEY) == key) {
				return bm
			}
		}
	}
	return null
}

function bookmarkIsNavlet(key)
{
	var hasChildren = bookmarkHasChildren(key);
	var bObj = getBookmarkObj(key);
	var url = bObj ? bObj.content.getAttribute(ATTR_URL) : null;
	var hasURL = ((typeof(url)!="undefined") && (url != ""));
	return (hasChildren || !hasURL);
}

// home.js uses key, subscriptions.js uses object
function bookmarkHasChildren(key)
{
	var ret = false
	var bObj = getBookmarkObj(key)
	if (bObj)
	{
		// det child nodes for rendering 
		ret = bObj.content.childNodes.length
	
		// in NS, childNodes may not be bookmarks
		if (!isIE && ret)
		{
			ret=false
			for (var i=0;i<bObj.content.childNodes.length && !ret;i++)
				ret |= isBookmarkNode(bObj.content.childNodes[i])
		}
	}
	return ret
}

function isBookmarkNode(node)
{
	if (isIE)
		return (node.getAttribute(ATTR_KEY) && node.getAttribute(ATTR_NAME))
	else
		return (node.nodeType == 1) && (node.tagName == TAG_BOOKMARK) && node.hasAttributes()
}

function stylesheetGetRule(stylesheet, selectorText)
{
	var rules
	if (isIE)
		rules=stylesheet.rules
	else
		rules=stylesheet.cssRules
	for (var i=0; i < rules.length; i++)
	{
		if (rules[i].selectorText == selectorText)
			return rules[i]
	}
	return null
}

// change all edit cursors to their edit
function editCursors()
{
	try {
		var ss = window.document.styleSheets[0]
		var rule = stylesheetGetRule(ss, ".xTNugletResize")
		if (rule)
			rule.style.cursor = "s-resize"
		rule=stylesheetGetRule(ss, ".xTColResize")
		if (rule)
			rule.style.cursor = "e-resize"
		rule=stylesheetGetRule(ss, ".xTNugletHead")
		if (rule) {
			rule.style.cursor = "pointer"
			rule.style.cursor = "hand"
		}
	} catch (e) { }
}

// change all edit cursors to default
function defaultCursors()
{
	try {
		var ss = window.document.styleSheets[0]
		var rule = stylesheetGetRule(ss, ".xTNugletResize")
		if (rule)
			rule.style.cursor = "default"
		rule=stylesheetGetRule(ss, ".xTColResize")
		if (rule)
			rule.style.cursor = "default"
		rule=stylesheetGetRule(ss, ".xTNugletHead")
		if (rule)
			rule.style.cursor = "default"

	} catch (e) { }
}

// load a trimmed array of the bookmark keys that this user doesn't want to display
function loadUnsubscribed()
{
	portalWnd.arrUnsub = new Array();
	var userId = profile.getId();
	if (!userId) return false;		// DME call will fail!

	try {
		var query = "PROD=LOGAN" +
				"&FILE=LOUSRBKOPT" +
				"&FIELD=BOOK-MARK;" +
				"&INDEX=UBOSET1" +
				"&KEY=" + userId +
				"&MAX=600" +
				"&OUT=XML";

		var req = new portalWnd.DMERequest(portalWnd, query);
		var res = req.getResponse(false);
		if (res.error)
		{
			var errorNodes = res.resDoc.getElementsByTagName("ERROR");
			var error = errorNodes ? errorNodes[0] : null;
			var key = error ? error.getAttribute("key") : null;
			if (key != "ITEM_SECURED")	
				portalWnd.cmnDlg.messageBox(res.error, "ok", "stop");
			return false;
		}
		var len = res.getNbrRecs();
		var key;
		for (var j=0;j<len;j++) {
			// get DME columns
			// this is where home.js and subscription.js differ
			key = res.getRecordValue(j,0);
			if (key)
				portalWnd.arrUnsub[portalWnd.arrUnsub.length]=key;
		}
		return true;

	} catch (e)	{
		portalWnd.cmnErrorHandler(e,window,HOMEJS);
		return false;
	}
}

function isUnsub(key)
{
	// see if key is in arrUnsub array
	// (DME call of LO15.1 unsubscription records)
	if (!portalWnd.arrUnsub)
		return false

	// trim keys for comparison
	var zkey=trimLeadingZeros(key)
	var len=portalWnd.arrUnsub.length
	for (var i=0; i < len; i++)
	{
		var tkey=portalWnd.trim(portalWnd.arrUnsub[i]);
		if (tkey==zkey) return true;
	}
	return false
}

//from portal/users/subscriptions/subscriptions.js
function trimLeadingZeros( text )
{
	if (text==null) return text
	var flag = false
	var retString = ""
	for (var i=0; i < text.length; i++)
	{
		if((text.charAt(i) != "0") && (!flag))
			flag = true
		if(flag)
			retString += text.charAt(i)
	}
	return retString
}

function getNodeChildElementsByTagName(node,tagname)
{
	var retArray=new Array()
	
	// if this node has that tag, add
	if (node.tagName == tagname && !portalWnd.cmnArrayContains(retArray,node))
		retArray[retArray.length] = node
		
	// look through children
	var tArray
	for(var i = 0; i < node.childNodes.length; i++) {
		if (node.childNodes[i].nodeType == 1) {
			tArray = getNodeChildElementsByTagName(node.childNodes[i], tagname)
			if (tArray && tArray.length)
				retArray = retArray.concat(tArray)	
		}
	}
	
	return (retArray.length ? retArray : null);
}

function setTitle()
{
	portalObj.setTitle(portalObj.getPhrase("LBL_HOME"))
}

function homeRefresh()
{
	portalWnd.location.reload();
}
