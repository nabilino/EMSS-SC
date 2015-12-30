/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/admin/rolemgr/LocksTab.js,v 1.8.2.11.4.5.14.1.2.5 2012/08/08 12:37:29 jomeli Exp $ */
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

LocksTab.prototype = new TabPage();
LocksTab.prototype.constructor = LocksTab;
LocksTab.superclass = TabPage.prototype;

//-----------------------------------------------------------------------------
function LocksTab(id,pageMgr)
{
	LocksTab.superclass.setId.call(this,id);
	LocksTab.superclass.setManager.call(this,pageMgr);

	// saved phrases
	this.collapsePhrase="";
	this.expandPhrase="";
	this.noChildrenPhrase="";

	// constants		
	this.dmeMax=18
	this.lockColWidth=140;
	this.nameWidth=400;
	this.loadCount=0;		// used to create unique ids between tree loads

	// active source - span was last clicked on
	this.activeSourceId=null;
	this.activeSourceType=null;
	this.activeSourceParam=null;
	this.activeSourceLevel="0";
	this.activeSourceLayer=null;
	this.activeSourceParentLayer=null;

	// active img - img was last clicked on
	this.activeImgId=null;
	this.activeImgType=null;
	this.activeImgParam=null;
	this.activeImgLevel="0"
	this.activeImgLayer=null;
	this.activeImgParentLayer=null;
	this.objAdminBlocks=null;

	this.treeReload="";
	this.treePrev=null;
	this.treeNext=null;
	this.bkmrkTree=null;

	// image urls
	var path=this.mgr.portal.path;
	this.spacerURL = path+"/images/spacer.gif"
	this.bookopenURL = path+"/images/ico_bookmark_children.gif"
	this.bookclosedURL = path+"/images/ico_bookmark_collapsed.gif"
	this.bookemptyURL = path+"/images/ico_bookmark_no-children.gif"
	this.unlockedURL = path+"/images/ico_lock_open.gif"
	this.lockedURL = path+"/images/ico_lock_closed.gif"

	// tags
	this.TAG_COLUMN = "COLUMN"
	this.TAG_COL = "COL"
	this.TAG_COLS = "COLS"
	this.TAG_MESSAGE = "MESSAGE"
	this.TAG_RECORD = "RECORD"
	this.TAG_RECORDS = "RECORDS"
	this.TAG_BLOCK = "BLOCK"
	this.TAG_BLOCKS = "BLOCKS"
	this.TAG_ROLE = "ROLE"

	// attributes
	this.ATTR_COUNT = "count"
	this.ATTR_DISPLAYNAME = "dspname"
	this.ATTR_KEY = "key"
	this.ATTR_NAME = "nm"
	this.ATTR_TYPE = "type"
	this.ATTR_SUBSCRIPTION = "subscription"
	this.ATTR_LAYOUT = "layout"

	this.LOCK_ADMIN = "admin"
	this.LOCK_USER = "user"
}

//-----------------------------------------------------------------------------
LocksTab.prototype.abandonChildren=function(node)
{
	var childNode
	var arrRemove=new Array()
	var len = node.childNodes.length
	for (var i=0; i < len; i++)
	{
		childNode=node.childNodes[i]
		if (childNode.getAttribute("canHide") == "true")
			arrRemove[arrRemove.length]=childNode
	}
	for (var i=arrRemove.length-1; i >= 0; i--)
		node.removeChild(arrRemove[i])
}

//-----------------------------------------------------------------------------
LocksTab.prototype.activate=function()
{
	try {
		var elem=this.mgr.document.getElementById("txtBkmrkSearch");
		elem.focus();
		elem.select();
	} catch (e) { }
}

//-----------------------------------------------------------------------------
LocksTab.prototype.deactivate=function()
{
	return true;
}

//-----------------------------------------------------------------------------
LocksTab.prototype.deleteBookmarkLock=function(key)
{
	if (!this.objAdminBlocks)
		return;

	var len = this.objAdminBlocks.childNodes.length;
	for (var i=0; i < len; i++)
	{
		var bm = this.objAdminBlocks.childNodes[i]
		if (bm.nodeType == 1)
		{
			var bmkey=this.trimLeadingZeros(bm.getAttribute(this.ATTR_KEY))
			if (bmkey == key)
			{
				this.objAdminBlocks.removeChild(this.objAdminBlocks.childNodes[i])
				break
			}
		}
	}
}

//-----------------------------------------------------------------------------
LocksTab.prototype.disableButtons=function()
{
	var btn=this.mgr.document.getElementById("btnBkmrkPrev");
	btn.disabled=true;
	btn.className="xTToolBarButtonDisabled";
	btn=this.mgr.document.getElementById("btnBkmrkNext");
	btn.disabled=true;
	btn.className="xTToolBarButtonDisabled";
	btn=this.mgr.document.getElementById("btnBkmrkFind");
	btn.disabled=true;
	btn.className="xTToolBarButtonDisabled";
}
//-----------------------------------------------------------------------------
LocksTab.prototype.expandImg=function()
{
	if (!this.activeImgLayer)
		return;
		
	// load the child div if it hasn't been
	if (this.activeImgLayer.status != "loaded")
		{
		this.treeReload="";
		this.loadTree(this.activeImgLayer,
				"&INDEX=LOBSET3&SELECT=parent-bkmark=" + 
				this.mgr.portalWnd.trim(this.activeImgParam))
		this.activeImgLayer.status="loaded"
	}  
	
	var myImage = this.mgr.document.getElementById(this.activeImgId+"_img")
	if (this.activeImgLayer.expandStatus == "closed")
	{
		this.activeImgLayer.expandStatus = "open"
		// show children
		this.setLayerChildrenSetting(this.activeImgLayer,"block")
		// show open book image
		myImage.alt = this.collapsePhrase
		myImage.src = this.bookopenURL
	} 
	else if (this.activeImgLayer.expandStatus == "open")
	{
		this.activeImgLayer.expandStatus = "closed"
		// hide children
		this.setLayerChildrenSetting(this.activeImgLayer,"none")
		// show closed book image
		myImage.alt = this.expandPhrase
		myImage.src = this.bookclosedURL
	}
	else if (this.activeImgLayer.expandStatus == "empty")
	{
		// show empty book image
		myImage.alt = this.noChildrenPhrase
		myImage.src = this.bookemptyURL
	}
}

//-----------------------------------------------------------------------------
LocksTab.prototype.getBookmarkLock=function(key,attr)
{
	// attr is ATTR_LAYOUT or ATTR_SUBSCRIPTION
	if (!this.objAdminBlocks)
		return null;

	var len = this.objAdminBlocks.childNodes.length;
	for (var i=0; i < len; i++)
	{
		var bm = this.objAdminBlocks.childNodes[i]
		if (bm.nodeType == 1)
		{
			var bmkey=this.trimLeadingZeros(bm.getAttribute(this.ATTR_KEY))
			if (bmkey == key)
			{
				var s=bm.getAttribute(attr)
				if (s) return s
				break
			}
		}
	}
	return null
}

//-----------------------------------------------------------------------------
LocksTab.prototype.getBookmarkLockNode=function(key)
{
	if (!this.objAdminBlocks)
		return null;

	var len = this.objAdminBlocks.childNodes.length;
	for (var i=0; i < len; i++)
	{
		var bm = this.objAdminBlocks.childNodes[i]
		if (bm.nodeType == 1)
		{
			var bmkey=this.trimLeadingZeros(bm.getAttribute(this.ATTR_KEY))
			if (bmkey == key)
				return this.objAdminBlocks.childNodes[i]
		}
	}
	return null
}

//-----------------------------------------------------------------------------
LocksTab.prototype.getLockImagePhrase=function(state, attr)
{
	// state is boolean - locked?
	// type is ATTR_LAYOUT or ATTR_SUBSCRIPTION
	var ret = ( attr==this.ATTR_LAYOUT
			? this.mgr.msgs.getPhrase("lblLayout") + " "
			: "" );
	ret += ( attr==this.ATTR_SUBSCRIPTION
			? this.mgr.msgs.getPhrase("lblSubscription") + " "
			: "" );
	ret += ( this.mgr.msgs.getPhrase("lblRemoval").toLowerCase() + " " );
	ret += ( this.mgr.msgs.getPhrase( state ? "lblIsDenied" : "lblIsAllowed") + " " );
	ret += this.mgr.msgs.getPhrase("lblClickToChange");
	return ret
}

//-----------------------------------------------------------------------------
LocksTab.prototype.getNodeChildElementsByTagName=function(node,tagname)
{
	var retArray=new Array()
	
	// if this node has that tag, add
	if (node.tagName == tagname && !this.mgr.portalWnd.cmnArrayContains(retArray,node))
		retArray[retArray.length] = node
		
	// look through children
	var tArray
	var len=node.childNodes.length;
	for (var i = 0; i < len; i++)
	{
		if (node.childNodes[i].nodeType == 1)
		{
			tArray = this.getNodeChildElementsByTagName(node.childNodes[i], tagname)
			if (tArray && tArray.length)
				retArray = retArray.concat(tArray)	
		}
	}
	
	return (retArray.length ? retArray : null);
}

//-----------------------------------------------------------------------------
LocksTab.prototype.init=function()
{
	this.collapsePhrase = this.mgr.msgs.getPhrase("lblCollapse")
	this.expandPhrase = this.mgr.msgs.getPhrase("lblExpand")
	this.noChildrenPhrase = this.mgr.msgs.getPhrase("lblNoChildren")
	
	this.bkmrkTree=this.mgr.document.getElementById("bkmrkTree")

	var phrase=this.mgr.portal.getPhrase("LBL_PREVIOUS");	
	var btn=this.mgr.document.getElementById("btnBkmrkPrev");
	btn.value=phrase;
	btn.title = phrase;

	phrase = this.mgr.portal.getPhrase("LBL_NEXT");
	btn=this.mgr.document.getElementById("btnBkmrkNext");
	btn.value=phrase;
	btn.title = phrase;
	
	phrase = this.mgr.portal.getPhrase("LBL_FIND");
	btn=this.mgr.document.getElementById("btnBkmrkFind");
	btn.value=phrase;
	btn.title = phrase;
	
	// store DME call in tree object for later use
	this.bkmrkTree.dmecall = this.mgr.portalWnd.DMEPath + "?PROD=LOGAN&" +
		"FILE=LOBKMARK&" +
		"OUT=XML&" +
		"FIELD=book-mark;parent-bkmark;seq-nbr;name"
	
	// get objAdminBlocks
	this.objAdminBlocks=null;
	var objBlocks=this.mgr.storage.document.getElementsByTagName(this.TAG_BLOCKS)
	if (objBlocks)
	{
		var len=objBlocks.length;
		for (var i=0; i < len; i++)
		{
			if (objBlocks[i].nodeType == 1)
			{
				var type = objBlocks[i].getAttribute(this.ATTR_TYPE)
				if (type == this.LOCK_ADMIN)
					this.objAdminBlocks = objBlocks[i]
			}
		}	
	}
		
	// create objAdminBlocks if does not exist	
	if (this.objAdminBlocks == null)
	{
		var doc = this.mgr.storage.getDocument();
		this.objAdminBlocks=doc.createElement(this.TAG_BLOCKS)
		this.objAdminBlocks.setAttribute(this.ATTR_TYPE,this.LOCK_ADMIN)
		
		var roleNode = this.mgr.storage.getRootNode();
		roleNode.appendChild(this.objAdminBlocks)
	}
	
	// load initial bookmark tree
	this.initTree()
	return true;
}

//-----------------------------------------------------------------------------
LocksTab.prototype.initTree=function()
{
	// load the tree at the top level, sorted by name
	this.treeReload = "&INDEX=LOBSET3&SELECT=parent-bkmark=0"
	this.loadTree(this.bkmrkTree,"")
}

//-----------------------------------------------------------------------------
LocksTab.prototype.loadTree=function(parentLayer,strAppend)
{
	var sourceid
	var divid
	var imgid
	var layerid
	var anchid
	var param
	var bookmarkName

	var level=1;
	if (parentLayer == this.bkmrkTree)
		this.loadCount++
	else
		level = parentLayer.level + 1
	
	// Call DME to get the next tree structure
	// Tree.dmecall stores the basic dme call
	var dmecall 
	if (level > 1)
		dmecall = this.bkmrkTree.dmecall + this.treeReload + strAppend
	else
		dmecall = this.bkmrkTree.dmecall + "&MAX="+this.dmeMax+"&" + this.treeReload + strAppend
		
	var cleancall=""
	var len=dmecall.length;
	for (var i=0; i < len; i++)
	{
		var c=dmecall.substring(i,i+1)
		cleancall+=(c==" ")?"%20":c
	}

	// retrieve the bookmarks
	this.mgr.portal.setMessage(this.mgr.portal.getPhrase("LBL_LOADING"));
	var oXML = this.mgr.portalWnd.httpRequest(cleancall,null,"","",false);

	var msg=this.mgr.msgs.getPhrase("lblBookmarkError") + ":\n"
	this.mgr.portalWnd.oError.setMessage(msg);
	if (this.mgr.portalWnd.oError.isErrorResponse(oXML,true,true))
	{
		this.disableButtons();
		oXML=null;
		return;
	}
	oXML = portalWnd.oError.getDSObject();

	this.mgr.portal.setMessage("")

	var arrMsgs=oXML.document.getElementsByTagName(this.TAG_MESSAGE)
	var lenMsgs=(arrMsgs ? arrMsgs.length : 0)
	if (lenMsgs && (arrMsgs[0].getAttribute("status")=="1"))
	{
		this.disableButtons();
		var msg=this.mgr.msgs.getPhrase("lblBookmarkError") + ": " + arrMsgs[0].firstChild.nodeValue;
		this.mgr.portalWnd.cmnDlg.messageBox(msg,"ok","stop",window)
		return null
	}

	var records=oXML.document.getElementsByTagName(this.TAG_RECORDS)
	len = records[0].getAttribute(this.ATTR_COUNT)
	len = parseInt(len,10)
	if (len == 0)
	{
		if (typeof(this.activeImgLayer)!="undefined" && this.activeImgLayer)
			this.activeImgLayer.expandStatus = "empty"
		this.mgr.portalWnd.cmnClearStatus();
		return
	}

	var list=oXML.document.getElementsByTagName(this.TAG_COLS)
	if (parentLayer == this.bkmrkTree)
	{
		this.abandonChildren(this.bkmrkTree)

		// get prev, set disabled on Previous button
		this.treePrev = oXML.document.getElementsByTagName("PREVCALL")
		this.treePrev = (this.treePrev && this.treePrev.length)
			? this.treePrev[0].firstChild.nodeValue
			: null;
		this.mgr.document.getElementById("btnBkmrkPrev").disabled = !this.treePrev ? true : false;
		this.mgr.document.getElementById("btnBkmrkPrev").className = "xTToolBarButton" +
			(!this.treePrev ? "Disabled" : "");

		// get next, set disabled on Next button
		this.treeNext = oXML.document.getElementsByTagName("NEXTCALL")
		this.treeNext = (this.treeNext && this.treeNext.length)
			? this.treeNext[0].firstChild.nodeValue
			: null;
		this.mgr.document.getElementById("btnBkmrkNext").disabled = !this.treeNext ? true : false;
		this.mgr.document.getElementById("btnBkmrkNext").className = "xTToolBarButton" +
			(!this.treeNext ? "Disabled" : "");
			
		if (len == 0)
		{
			var msg=this.mgr.msgs.getPhrase("lblBookmarkFotFound");
			this.mgr.portalWnd.cmnDlg.messageBox(msg,"ok","alert",window)
			return;
		}

		// set header elements text
		var lbl=this.mgr.document.getElementById("lblBookmarkName");
		this.mgr.portalWnd.cmnSetElementText(lbl,this.mgr.msgs.getPhrase("lblBookmarkName"));

		lbl=this.mgr.document.getElementById("lblSubLock");
		this.mgr.portalWnd.cmnSetElementText(lbl,this.mgr.msgs.getPhrase("lblSubLock"));

		lbl=this.mgr.document.getElementById("lblLayoutLock");
		this.mgr.portalWnd.cmnSetElementText(lbl,this.mgr.msgs.getPhrase("lblLayoutLock"));
		
	} // parentLayer == this.bkmrkTree
	
	i = 0;
	while ( i < len )
	{
		window.status = this.mgr.msgs.getPhrase("lblProcessingBookmark") + i;

		if (parentLayer == this.bkmrkTree)
		{
			sourceid = "lc" + this.loadCount + "_" + (i+1)
			divid = sourceid + "_div"
			layerid = sourceid + "_lyr"
			imgid = sourceid + "_img"
			anchid = sourceid + "_anch"
		}
		else
		{
			sourceid = parentLayer.id + "_" + (i+1)
			divid = sourceid + "_div"
			layerid = sourceid + "_lyr"
			imgid = sourceid + "_img"
			anchid = sourceid + "_anch"
		}
		
		if (this.mgr.portal.browser.isIE)
		{
			param = list[i].childNodes[0].firstChild.nodeValue
			bookmarkName = list[i].childNodes[3].firstChild.nodeValue
		} 
		else
		{
			var arrCOL=this.getNodeChildElementsByTagName(list[i],this.TAG_COL)
			var klen=arrCOL[0].childNodes.length;
			for (var k=0; k < klen; k++)
			{
				if (arrCOL[0].childNodes[k].nodeType==4)
				{
					param = arrCOL[0].childNodes[k].nodeValue
					break
				}
			}
			klen=arrCOL[3].childNodes.length;
			for (var k=0; k < klen; k++)
			{
				if (arrCOL[3].childNodes[k].nodeType==4)
				{
					bookmarkName = arrCOL[3].childNodes[k].nodeValue
					break
				}
			}
		}
		
		// clean up
		param = param.replace("\'","%27")    // replace the tick with %27 for querystring
		var trimparam=this.mgr.portalWnd.trim(param)
		bookmarkName = bookmarkName.replace("\'"," ")
		
		var indent = (25 * parseInt(level-1))
		
		// a tree div - do not specify height, width, allow to auto-flow of contents
		var conNode=this.mgr.document.createElement("span")
		conNode.id = layerid
		conNode.bookmarkName = bookmarkName
		conNode.type = "Bookmark"
		conNode.level = level
		conNode.param = param
		conNode.parentLayer = parentLayer
		conNode.expandStatus = "closed"
		conNode.className = "xTItem"
		conNode.style.display = "block"
		conNode.setAttribute("canHide","true")
		conNode.setAttribute("canExpand","true")
		conNode.status = ""

		var strHTML="<table border='0' cellpadding='0' cellspacing='0'>";
		strHTML+="<tr>";

		// spacer image
		strHTML+="<td>";
		strHTML+="<img src='"+this.spacerURL+"' style='height:20px;width:"+indent+"px;' />";
		strHTML+="</td>";
		
		// book image
		strHTML+="<td>";
		strHTML+="<img id='"+imgid+"' alt='"+this.expandPhrase+"' src='"+this.bookclosedURL+"' ";
		strHTML+="status='closed' style='height:15px;width:16px;";
		strHTML+="margin-right:5px;margin-left:2px;align:absmiddle;' tabIndex='1' ";
		strHTML+="onclick=\"window.tabMgr.tabs['"+this.id+"'].onClickImage(event,this)\" />";
		strHTML+="</td>";
		
		// bookmark anchor / text
		strHTML+="<td style='width:"+(this.nameWidth - indent - 16)+"px;'>";
		strHTML+="<span id='"+divid+"'>";
		strHTML+="<span id='"+anchid+"' class='xTLabel' style='cursor:default;' ";
		strHTML+="onmousedown=\"window.tabMgr.tabs['"+this.id+"'].onNodeMouseDown(event,this)\" ";
		strHTML+="onmouseup=\"window.tabMgr.tabs['"+this.id+"'].onNodeMouseUp(event,this)\">";
		strHTML+=bookmarkName+"</span>";
		strHTML+="</span>";
		strHTML+="</td>";
		
		// subscription
		var state=this.getBookmarkLock(trimparam,this.ATTR_SUBSCRIPTION);
		strHTML+="<td style='width:"+this.lockColWidth+"px;text-align:center;'>";
		strHTML+="<span>";
		strHTML+="<img tabIndex='1' attr='"+this.ATTR_SUBSCRIPTION+"' ";
		strHTML+="state='"+state+"' layerid='"+layerid+"' ";
		strHTML+="alt='"+this.getLockImagePhrase(state, this.ATTR_SUBSCRIPTION)+"' ";
		strHTML+="src='"+(state ? this.lockedURL : this.unlockedURL)+"' ";
		strHTML+="onclick=\"window.tabMgr.tabs['"+this.id+"'].onClickLock(event,this)\" />";
		strHTML+="</span>";
		strHTML+="</td>";

		// layout
		state=this.getBookmarkLock(trimparam,this.ATTR_LAYOUT);
		strHTML+="<td style='width:"+this.lockColWidth+"px;text-align:center;'>";
		strHTML+="<span>";
		strHTML+="<img tabIndex='1' attr='"+this.ATTR_LAYOUT+"' ";
		strHTML+="state='"+state+"' layerid='"+layerid+"' ";
		strHTML+="alt='"+this.getLockImagePhrase(state,this.ATTR_LAYOUT)+"' ";
		strHTML+="src='"+(state ? this.lockedURL : this.unlockedURL)+"' ";
		strHTML+="onclick=\"window.tabMgr.tabs['"+this.id+"'].onClickLock(event,this)\" />";
		strHTML+="</span>";
		strHTML+="</td>";

		strHTML+="</tr>";
		strHTML+="</table>";
		conNode.innerHTML=strHTML;
		parentLayer.appendChild(conNode);
		i++
	}
	parentLayer.style.display = "block"
	oXML = null;
	this.positionInputs();
	this.mgr.portalWnd.cmnClearStatus();
}

//-----------------------------------------------------------------------------
LocksTab.prototype.onClickImage=function(evt,img)
{
	evt = this.mgr.portalWnd.getEventObject(evt,this.wnd);
	if (!evt) return;
	var sourceid = img.id;
	if (sourceid)
	{
		var iimg=sourceid.indexOf("_img");
		if (iimg>-1)
			sourceid=sourceid.substring(0,iimg);
	}
	this.setActiveImg(sourceid);
	this.expandImg();
}

//-----------------------------------------------------------------------------
LocksTab.prototype.onClickLock=function(evt,img)
{
	evt = this.mgr.portalWnd.getEventObject(evt,this.wnd);
	if (!evt) return;

	var layerElem=this.mgr.document.getElementById(img.getAttribute("layerid"));
	var key = this.mgr.portalWnd.trim(layerElem.getAttribute("param"));
	var attr = img.attr // ATTR_LAYOUT or ATTR_SUBSCRIPTION

	var laylock = this.getBookmarkLock(key,this.ATTR_LAYOUT)
	var sublock = this.getBookmarkLock(key,this.ATTR_SUBSCRIPTION)
	
	if (laylock == null && sublock == null)
	{ // no block exists for this key
		// create block node
		var doc=this.mgr.storage.getDocument();
		objBlock = doc.createElement(this.TAG_BLOCK)
		objBlock.setAttribute(this.ATTR_KEY,this.zeros(key,15))
		objBlock.setAttribute(attr,this.LOCK_ADMIN)
		this.objAdminBlocks.appendChild(objBlock)
		// update img
		img.src = this.lockedURL
		img.state = true
		img.alt = this.getLockImagePhrase(img.state, attr)
	} 
	else
	{ // laylock != null || sublock != null
		// block exists for this key - remove block if no more attributes
		if ( (attr==this.ATTR_LAYOUT && laylock && sublock == null) 
		|| (attr==this.ATTR_SUBSCRIPTION && sublock && laylock == null))
		{
			this.deleteBookmarkLock(key)
			// update img
			img.src = this.unlockedURL
			img.state = false
			img.alt = this.getLockImagePhrase(img.state, attr)
		}

		// block exists for this key - add attribute
		else if ( (attr==this.ATTR_LAYOUT && laylock == null) 
		|| (attr==this.ATTR_SUBSCRIPTION && sublock == null) )
		{
			var objBlock = this.getBookmarkLockNode(key)
			if (objBlock) 
			{
				objBlock.setAttribute(attr,this.LOCK_ADMIN)
				// update img
				img.src = this.lockedURL
				img.state = true
				img.alt = this.getLockImagePhrase(img.state, attr)
			}
		}

		// block exists for this key - remove attribute
		else if ( (attr==this.ATTR_LAYOUT && laylock) 
		|| (attr==this.ATTR_SUBSCRIPTION && sublock) )
		{	
			var objBlock = this.getBookmarkLockNode(key)
			if (objBlock)
				objBlock.removeAttribute(attr)
			// update img
			img.src = this.unlockedURL
			img.state = false
			img.alt = this.getLockImagePhrase(img.state, attr)
		}
	}
	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
LocksTab.prototype.onKeyDown=function(evt)
{
	return true;
}

//-----------------------------------------------------------------------------
LocksTab.prototype.onNext=function()
{
	// render next
	this.treeReload="";
	this.loadTree(this.bkmrkTree,"&INDEX=LOBSET3&SELECT=parent-bkmark=0&"+this.treeNext)
}

//-----------------------------------------------------------------------------
LocksTab.prototype.onNodeMouseDown=function(evt,anchor)
{
	evt = this.mgr.portalWnd.getEventObject(evt,this.wnd);
	if (!evt) return;
	var sourceid = anchor.id;
	if (sourceid)
	{
		var ianc=sourceid.indexOf("_anc");
		if (ianc>-1)
			sourceid=sourceid.substring(0,ianc);
		this.setActiveSource(sourceid);
	}
}

//-----------------------------------------------------------------------------
LocksTab.prototype.onNodeMouseUp=function(evt,anchor)
{
	evt = this.mgr.portalWnd.getEventObject(evt,this.wnd);
	if (!evt) return;
	var sourceid = anchor.id;
	if (sourceid)
	{
		var ianc=sourceid.indexOf("_anc");
		if (ianc>-1)
			sourceid=sourceid.substring(0,ianc);
	}
	// normal mouse button event
	this.setActiveImg(sourceid);
	this.expandImg();
}

//-----------------------------------------------------------------------------
LocksTab.prototype.onPrev=function()
{
	// render previous
	this.treeReload="";
	this.loadTree(this.bkmrkTree,"&INDEX=LOBSET3&SELECT=parent-bkmark=0&"+this.treePrev)
}

//-----------------------------------------------------------------------------
LocksTab.prototype.onTreeResize=function(div)
{
	var inputs = this.mgr.document.getElementById("bkmrkInputs");
	inputs.style.top=div.offsetHeight+10;
}

//-----------------------------------------------------------------------------
LocksTab.prototype.onTextFocus=function(evt,txtBox)
{
	txtBox.className="xTTextBoxHighlight";
}

//-----------------------------------------------------------------------------
LocksTab.prototype.onTextBlur=function(evt,txtBox)
{
	txtBox.className="xTTextBox";
}

//-----------------------------------------------------------------------------
LocksTab.prototype.onSearch=function()
{
	var srch = this.mgr.document.getElementById("txtBkmrkSearch").value
	if (srch)
	{
		this.treeReload = "&INDEX=LOBSET3&SELECT=name^~"+escape(srch)
		this.loadTree(this.bkmrkTree,"")
	}
	else
		this.initTree();
}

//-----------------------------------------------------------------------------
LocksTab.prototype.positionInputs=function()
{
	var inputs = this.mgr.document.getElementById("bkmrkInputs");
	var sibling = this.mgr.document.getElementById("treeDiv");
	inputs.style.top=sibling.offsetHeight+10;
}

//-----------------------------------------------------------------------------
LocksTab.prototype.setActiveImg=function(sourceid)
{
	if (sourceid)
	{
		this.activeImgLayer = document.getElementById( sourceid + "_lyr" )
		if (!this.activeImgLayer) return;

		this.activeImgId =			sourceid
		this.activeImgBookmark = 	this.activeImgLayer.bookmarkName
		this.activeImgType = 		this.activeImgLayer.type
		this.activeImgParam = 		this.activeImgLayer.param
		this.activeImgLevel = 		this.activeImgLayer.level
		this.activeImgParentLayer = this.activeImgLayer.parentLayer
	}
	else
	{
		this.activeImgLayer =		null
		this.activeImgId =			null
		this.activeImgBookmark = 	null
		this.activeImgType = 		null
		this.activeImgParam = 		null
		this.activeImgLevel = 		null
		this.activeImgParentLayer = null
	}
}

//-----------------------------------------------------------------------------
LocksTab.prototype.setActiveSource=function(sourceid)
{
	if (sourceid)
	{
		this.activeSourceLayer = document.getElementById( sourceid + "_lyr" )
		if (!this.activeSourceLayer) return;

		this.activeSourceId = 			sourceid
		this.activeSourceBookmark =		this.activeSourceLayer.bookmarkName
		this.activeSourceType =    		this.activeSourceLayer.type
		this.activeSourceParam = 		this.activeSourceLayer.param
		this.activeSourceLevel = 		this.activeSourceLayer.level
		this.activeSourceParentLayer = 	this.activeSourceLayer.parentLayer
	} 
	else
	{
		this.activeSourceLayer = 		null
		this.activeSourceId = 			null
		this.activeSourceBookmark =		null
		this.activeSourceType =    		null
		this.activeSourceParam = 		null
		this.activeSourceLevel = 		null
		this.activeSourceParentLayer = 	null
	}
}

//-----------------------------------------------------------------------------
// loop through children and set style.display to setting
LocksTab.prototype.setLayerChildrenSetting=function(layer,setting)
{
	var len = layer.childNodes.length;
	for (var i=0; i < len; i++)
	{
		if (layer.childNodes[i].getAttribute("canExpand")=="true")
			layer.childNodes[i].style.display = setting;
	}
}

//-----------------------------------------------------------------------------
LocksTab.prototype.trimLeadingZeros=function(text)
{
	if (text==null) return text
	var flag = false
	var retString = "";
	var len=text.length;
	for (var i=0; i < len; i++)
	{
		if((text.charAt(i) != "0") && (!flag))
			flag = true
		if (flag)
			retString += text.charAt(i)
	}
	return retString
}

//-----------------------------------------------------------------------------
LocksTab.prototype.zeros=function(z,len)
{
	while (z.length < len)
		z="0"+z
	return z
}
