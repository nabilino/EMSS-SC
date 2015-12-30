//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
var tree = new Array()
	// *** Global Cosmetic Variables...
	tree.body_background		= "white"
	tree.background				= "white"
	tree.font_color				= "black"
	tree.font_type				= "Arial"
	tree.font_size				= 3
	tree.font_bold				= false
	tree.no_image				= "/lawson/images/misc/trans.gif"
	tree.indent_scale			= 2

	// *** Global functional variables...
	tree.window_reference		= ""
	tree.user_added_code		= ""
	tree.netscape_initial_height= 15
	tree.focusedObj				= false

	// *** Items for the right-click menu (if applicable)
	tree.right_click_menu		= false
	tree.add_item_func			= false
	tree.edit_item_func			= false
	tree.paste_item_func		= false
	tree.move_item_func			= false
	tree.remove_item_func		= false
	tree.clipboard				= false

	// *** Do not write to these...!!!!!!
	tree.netscape_height		= 0
	tree.mouseLeft				= 0
	tree.mouseTop				= 0
	tree.mousedOverLast			= false
	tree.mockitem				= new treeObject()

function treeObject(name, text, icon_closed, icon_opened, icon_bottom)
{
	name = (typeof(name) == "undefined")?"":name;
	text = (typeof(text) == "undefined")?"":text;
	icon_closed = (typeof(icon_closed) == "undefined")?tree.no_image:icon_closed;
	icon_opened = (typeof(icon_opened) == "undefined")?tree.no_image:icon_opened;
	icon_bottom = (typeof(icon_bottom) == "undefined")?tree.no_image:icon_bottom;

	// Standard Items...
	this.name			= name;
	this.text			= text;
	this.icon_closed	= icon_closed;
	this.icon_opened	= icon_opened;
	this.icon_bottom	= icon_bottom;

	// Cosmetic Items...
	this.background		= tree.background;
	this.font_color		= tree.font_color;
	this.font_type		= tree.font_type;
	this.font_size		= tree.font_size;
	this.font_bold		= tree.font_bold;

	// Functional Items...
	this.is_open		= false;
	this.points_to_obj	= false;
	this.points_to_url	= false;
	this.target			= "new";
	this.onLeftClick	= false;
	this.parent			= false;
	this.children		= new Array();
}

function writeTree()
{
	var thepre  = "<html><head><title>Dynamic Tree</title>"
//				+ "<STYLE TYPE='text/css'>"
//				+ "A {text-decoration:none}"
//				+ "</STYLE>"
				+ "</head><body bgColor='" + tree.body_background + "'>"
	var thecode = tree.user_added_code + getTreeCode(tree)
	if (document.all)
		var thepost = "<div id='rightmenu' style='position:absolute; display:none; left:0px; top:0px'>&nbsp;</div></body></html>"
	else if (document.layers)
		var thepost	= "<layer id='rightmenu' visibility='hide' left=0 top=0>&nbsp;</layer></body></html>"

	eval(tree.window_reference + "document.write(thepre + thecode + thepost)")
	eval(tree.window_reference + "document.close()")

	if (tree.focusedObj)
		tree.focusedObj = false
	if (tree.mousedOverLast)
		tree.mousedOverLast = false

	refreshTreeView()
	if (tree.right_click_menu)
		captureEvents()
}

function getTreeCode(thetree, indent)
{
	indent = (typeof(indent) == "undefined")?0:indent;
	var ss = "", preFont = "", postFont = ""
	for (var i=0; i<thetree.length; i++)
	{
		// Build the <div> and include styling parameters...
		if (document.all)
			ss += "<div id='" + thetree[i].name + "' class='" + thetree[i].name + "' style='position:relative; display:none; width:" + (3*eval(tree.window_reference+"document.body.clientWidth")/4) + "; left:" + (eval(tree.window_reference+"document.body.clientWidth")/8) + "; background-color:" + thetree[i].background + "' onMouseOver='javascript:parent.divMouseOver(\"" + thetree[i].name + "\")' onMouseOut='javascript:parent.divMouseOut(\"" + thetree[i].name + "\")'>&nbsp;"
		else
			ss += "<layer id='" + thetree[i].name + "' left='" + (eval(tree.window_reference+"innerWidth")/8) + "' width='" + (3*eval(tree.window_reference+"innerWidth")/4) + "' bgColor='" + thetree[i].background + "' visibility='hide' onMouseOver='javascript:parent.divMouseOver(\"" + thetree[i].name + "\")' onMouseOut='javascript:parent.divMouseOut(\"" + thetree[i].name + "\")'>&nbsp;"

		// Add indention for sub menus...
		for (var k=0; k<indent; k++)
			for (var m=0; m<tree.indent_scale; m++)
				ss += "<img src='/lawson/images/misc/trans.gif' border=0 name='indent_"+k+m+"_"+thetree[i].name+"'>"

		// Strip "()" from the function name
		if (thetree[i].onLeftClick && thetree[i].onLeftClick.indexOf("()") != -1)
			thetree[i].onLeftClick = thetree[i].onLeftClick.substring(0,thetree[i].onLeftClick.indexOf("()"))

		// Check the "is_open" property... if no children, set it to false
		if (thetree[i].children.length == 0)
			thetree[i].is_open = false

		// Set font types for this item...
		preFont  = (thetree[i].font_bold)?"<b>":"";
		preFont += "<font size='" + thetree[i].font_size + "' face='" + thetree[i].font_type + "' color='" + thetree[i].font_color + "'>"
		postFont = "</font></b>"

		// Build Open Item
		if (thetree[i].is_open)
		{
			if (thetree[i].onLeftClick)
				ss += "<a href='javascript:void(0)' onClick='parent.openCloseTree(\"" + thetree[i].name + "\")'><img name='icon_" + thetree[i].name + "' src='" + thetree[i].icon_opened + "' border=0></a> "
					+ "<a href='javascript:void(0)' onClick='parent." + thetree[i].onLeftClick + "(parent.tree[\"" + thetree[i].name + "\"])'>" + preFont + thetree[i].text + postFont + "</a>"
			else if (thetree[i].points_to_url)
				ss += "<a href='javascript:void(0)' onClick='parent.openCloseTree(\"" + thetree[i].name + "\")'><img name='icon_" + thetree[i].name + "' src='" + thetree[i].icon_opened + "' border=0></a> "
					+ "<a href='" + thetree[i].points_to_url + "' target='" + thetree[i].target + "'>" + preFont + thetree[i].text + postFont +  "</a>"
			else
				ss += "<a href='javascript:void(0)' onClick='parent.openCloseTree(\"" + thetree[i].name + "\")'><img name='icon_" + thetree[i].name + "' src='" + thetree[i].icon_opened + "' border=0></a> " + preFont + thetree[i].text + postFont
		}
		// Build Bottom Item
		else if (thetree[i].children.length == 0)
		{
			if (thetree[i].onLeftClick)
				ss += "<a href='javascript:void(0)' onClick='parent." + thetree[i].onLeftClick + "(parent.tree[\"" + thetree[i].name + "\"])'><img name='icon_" + thetree[i].name + "' src='" + thetree[i].icon_bottom + "' border=0></a> "
					+ "<a href='javascript:void(0)' onClick='parent." + thetree[i].onLeftClick + "(parent.tree[\"" + thetree[i].name + "\"])'>" + preFont + thetree[i].text + postFont +  "</a>"
			else if (thetree[i].points_to_url)
				ss += "<a href='" + thetree[i].points_to_url + "' target='" + thetree[i].target + "'><img name='icon_" + thetree[i].name + "' src='" + thetree[i].icon_bottom + "' border=0></a> "
					+ "<a href='" + thetree[i].points_to_url + "' target='" + thetree[i].target + "'>" + preFont + thetree[i].text + postFont +  "</a>"
			else
				ss += "<img name='icon_" + thetree[i].name + "' src='" + thetree[i].icon_bottom + "' border=0> " + preFont + thetree[i].text + postFont
		}
		// Build Closed Item
		else
		{
			if (thetree[i].onLeftClick)
				ss += "<a href='javascript:void(0)' onClick='parent.openCloseTree(\"" + thetree[i].name + "\")'><img name='icon_" + thetree[i].name + "' src='" + thetree[i].icon_closed + "' border=0></a> "
					+ "<a href='javascript:void(0)' onClick='parent." + thetree[i].onLeftClick + "(parent.tree[\"" + thetree[i].name + "\"])'>" + preFont + thetree[i].text + postFont +  "</a>"
			else if (thetree[i].points_to_url)
				ss += "<a href='javascript:void(0)' onClick='parent.openCloseTree(\"" + thetree[i].name + "\")'><img name='icon_" + thetree[i].name + "' src='" + thetree[i].icon_closed + "' border=0></a> "
					+ "<a href='" + thetree[i].points_to_url + "' target='" + thetree[i].target + "'>" + preFont + thetree[i].text + postFont +  "</a>"
			else
				ss += "<a href='javascript:void(0)' onClick='parent.openCloseTree(\"" + thetree[i].name + "\")'><img name='icon_" + thetree[i].name + "' src='" + thetree[i].icon_closed + "' border=0></a> " + preFont + thetree[i].text + postFont
		}

		if (document.all)
			ss += "</div>"
		else
			ss += "</layer>"

		if (thetree[i].children.length > 0)
			ss += getTreeCode(thetree[i].children, (indent+1))
	}
	if (indent == 0 && ss == "")
		return "<body>There are no items in this tree to show</body>";
	else
		return ss;
}

function addItem(itemhere, name, text, icon_closed, icon_opened, icon_bottom)
{
	itemhere = (typeof(itemhere) == "undefined")?"":itemhere;
	name = (typeof(name) == "undefined")?"":name;
	text = (typeof(text) == "undefined")?"":text;
	icon_closed = (typeof(icon_closed) == "undefined")?tree.no_image:icon_closed;
	icon_opened = (typeof(icon_opened) == "undefined")?tree.no_image:icon_opened;
	icon_bottom = (typeof(icon_bottom) == "undefined")?tree.no_image:icon_bottom;

	if (itemhere == "")
	{
		tree[tree.length] = new treeObject(name, text, icon_closed, icon_opened, icon_bottom)
		if (name != "")
			tree[name] = tree[tree.length-1]
		return tree[tree.length-1]
	}
	else
	{
		itemhere.children[itemhere.children.length] = new treeObject(name, text, icon_closed, icon_opened, icon_bottom)
		if (name != "")
			itemhere.children[name] = itemhere.children[itemhere.children.length-1]
		itemhere.children[name].parent = itemhere
		tree[name] = itemhere.children[itemhere.children.length-1]
		return itemhere.children[itemhere.children.length-1]
	}
}

function removeItem(thetree, bypass_alert)
{
	bypass_alert = (typeof(bypass_alert) == "undefined")?false:true;
	if (!bypass_alert)
	{
		if (thetree.children.length > 0)
		{
			if (!confirm("CAUTION!!\n\nThis will remove all subfolders and subfiles as well.\nDo you still wish to remove '" + thetree.text + "' ?"))
				return false;
		}
		else if (!confirm("Are you sure you want to remove '" + thetree.text + "' ?"))
			return false;
	}

	var flipflag = false
	theparent = (thetree.parent)?thetree.parent.children:tree;
	for (var i=0; i<theparent.length; i++)
	{
		if (!flipflag)
			if (theparent[i] == thetree)
				flipflag = true

		if (flipflag)
		{
			if ((i+1) < theparent.length)
				theparent[i] = theparent[i+1]
			else
				theparent.length--
		}
	}
	writeTree()
	return true;
}

function refreshTreeView(whereAt)
{
	whereAt = (typeof(whereAt) == "undefined")?tree:whereAt;
	tree.netscape_height = (whereAt == tree)?tree.netscape_initial_height:tree.netscape_height;
	for (var i=0; i<whereAt.length; i++)
	{
		if (!whereAt[i].parent)
		{
			if (document.all)
				eval(tree.window_reference + "document.all['" + whereAt[i].name + "'].style.display = 'block'")
			else
			{
				eval(tree.window_reference + "document.layers['" + whereAt[i].name + "'].pageY = " + tree.netscape_height)
				eval(tree.window_reference + "document.layers['" + whereAt[i].name + "'].visibility = 'show'")
				tree.netscape_height = parseInt(eval(tree.window_reference + "document.layers['" + whereAt[i].name + "'].pageY + " + tree.window_reference + "document.layers['" + whereAt[i].name + "'].document.height"), 10)
			}

			if (whereAt[i].children.length > 0)
				refreshTreeView(whereAt[i].children)
		}
		else
		{
			if (isAllOpen(whereAt[i].parent))
			{
				if (document.all)
					eval(tree.window_reference + "document.all['" + whereAt[i].name + "'].style.display = 'block'")
				else
				{
					eval(tree.window_reference + "document.layers['" + whereAt[i].name + "'].pageY = " + tree.netscape_height)
					eval(tree.window_reference + "document.layers['" + whereAt[i].name + "'].visibility = 'show'")
					tree.netscape_height = parseInt(eval(tree.window_reference + "document.layers['" + whereAt[i].name + "'].pageY + " + tree.window_reference + "document.layers['" + whereAt[i].name + "'].document.height"), 10)
				}
			}
			else
			{
				if (document.all)
					eval(tree.window_reference + "document.all['" + whereAt[i].name + "'].style.display = 'none'")
				else
					eval(tree.window_reference + "document.layers['" + whereAt[i].name + "'].visibility = 'hide'")
			}

			if (whereAt[i].children.length > 0)
				refreshTreeView(whereAt[i].children)
		}
	}
}

function isAllOpen(thetree)
{
	if (!thetree.parent && thetree.is_open)
		return true;
	else if (!thetree.is_open)
		return false;
	else
		return isAllOpen(thetree.parent)
}

function openCloseTree(whichOne)
{
	whichOne = (typeof(whichOne) == "object")?whichOne.name:whichOne;
	if (tree[whichOne].children.length == 0)
		return
	tree.focusedObj = tree[whichOne]
	tree[whichOne].is_open = !tree[whichOne].is_open
	if (document.all)
	{
		if (tree[whichOne].is_open)
			eval(tree.window_reference + "document.all['icon_" + whichOne + "'].src = '" + tree[whichOne].icon_opened + "'")
		else
			eval(tree.window_reference + "document.all['icon_" + whichOne + "'].src = '" + tree[whichOne].icon_closed + "'")
	}
	else
	{
		if (tree[whichOne].is_open)
			eval(tree.window_reference + "document.layers['" + whichOne + "'].document.images['icon_" + whichOne + "'].src = '" + tree[whichOne].icon_opened + "'")
		else
			eval(tree.window_reference + "document.layers['" + whichOne + "'].document.images['icon_" + whichOne + "'].src = '" + tree[whichOne].icon_closed + "'")
	}
	refreshTreeView()
}

function isParent(parentTree, childTree)
{
	if (childTree.parent == parentTree)
		return true;
	else if (!childTree.parent)
		return false;
	else
		isParent(parentTree, childTree.parent)
}

function isVisible(thedivname)
{
	if (document.all)
		if (eval(tree.window_reference + "document.all[\"" + thedivname + "\"].style.display") == "block")
			return true;

	if (document.layers)
		if (eval(tree.window_reference + "document.layers[\"" + thedivname + "\"].visibility") == "show")
			return true;

	return false;
}

function divMouseOver(thedivname)
{
	tree.mousedOverLast = tree[thedivname]
}

function divMouseOut(thedivname)
{
//	alert(thedivname)
}

// ***************************************** //
// ***  Events Captured and Right Click  *** //
// ***  Menu Code follows...             *** //
// ***************************************** //

function captureEvents()
{
	if (document.all)
	{
		eval(tree.window_reference + "document.oncontextmenu = bgMouseDown")
		eval(tree.window_reference + "document.onmousedown = bgMouseDown")
		eval(tree.window_reference + "document.onmousemove = mouseLocation")
		eval(tree.window_reference + "document.onkeydown   = bgKeyDown")
	}
	else if (document.layers)
	{
		eval(tree.window_reference + "captureEvents(Event.MOUSEDOWN|Event.MOUSEMOVE|Event.KEYDOWN)")
		eval(tree.window_reference + "onmousedown = bgMouseDown")
		eval(tree.window_reference + "onmousemove = mouseLocation")
		eval(tree.window_reference + "onkeydown   = bgKeyDown")
	}
}

function bgMouseDown(e)
{
	if (document.all)
	{
		eval("e = " + tree.window_reference + "event")
		var tmpary = eval(tree.window_reference + "document.getElementsByTagName(\"div\")")
		if ((tree.mouseLeft < tmpary["rightmenu"].offsetLeft) || (tree.mouseLeft > (tmpary["rightmenu"].offsetLeft+tmpary["rightmenu"].clientWidth)) || (tree.mouseTop < tmpary["rightmenu"].offsetTop) || (tree.mouseTop > (tmpary["rightmenu"].offsetTop+tmpary["rightmenu"].clientHeight)))
			rightMenu("hide")
		else if (isVisible("rightmenu"))
		{
			e.returnValue = false
			return
		}

		if (tree.focusedObj)
			tree.focusedObj = false

		for (var i=0; i<tmpary.length; i++)
			if (tmpary[i].style.display == 'block')
				if ((tree.mouseLeft > tmpary[i].offsetLeft) && (tree.mouseLeft < (tmpary[i].offsetLeft+tmpary[i].clientWidth)) && (tree.mouseTop > tmpary[i].offsetTop) && (tree.mouseTop < (tmpary[i].offsetTop+tmpary[i].clientHeight)))
				{
					tree.focusedObj = tree[tmpary[i].id]
					break
				}

		if (e.button == 0 || e.button == 2)
		{
			e.returnValue = false
			rightMenu("show", tree.mouseLeft, tree.mouseTop)
		}
	}
	else if (document.layers)
	{
		var tmpary = eval(tree.window_reference + "document.layers")
		if ((tree.mouseLeft < tmpary["rightmenu"].left) || (tree.mouseLeft > (tmpary["rightmenu"].left+tmpary["rightmenu"].clip.width)) || (tree.mouseTop < tmpary["rightmenu"].top) || (tree.mouseTop > (tmpary["rightmenu"].top+tmpary["rightmenu"].clip.height)))
			rightMenu("hide")
		else if (isVisible("rightmenu"))
			return;

		if (tree.focusedObj)
			tree.focusedObj = false

		for (var i=0; i<tmpary.length; i++)
			if (tmpary[i].visibility == 'show')
				if ((tree.mouseLeft > tmpary[i].left) && (tree.mouseLeft < (tmpary[i].left+tmpary[i].clip.width)) && (tree.mouseTop > tmpary[i].top) && (tree.mouseTop < (tmpary[i].top+tmpary[i].clip.height)))
				{
					tree.focusedObj = tree[tmpary[i].id]
					break
				}

		if (e.which == 3)
		{
			rightMenu("show", tree.mouseLeft, tree.mouseTop)
			return false;
		}
	}
}

function mouseLocation(e)
{
	tree.mouseLeft = (document.all)?eval(tree.window_reference+"event.clientX + "+tree.window_reference+"document.body.scrollLeft"):e.pageX;
	tree.mouseTop  = (document.all)?eval(tree.window_reference+"event.clientY + "+tree.window_reference+"document.body.scrollTop"):e.pageY;
}

function bgKeyDown(e)
{
	if (!isVisible("rightmenu"))
		return;

	if (!tree.focusedObj)
	{
		if (document.layers)
			return routeEvent(e);
		else
			return;
	}

	if (document.all)
		eval("var key = " + tree.window_reference + "event.keyCode")
	else if (document.layers)
		eval("var key = " + e.which)

	rightMenu("hide")

	switch (key)
	{
		// The "E" key
		case ((document.all && 69) || (document.layers && 101)):
			rightClick_editItem()
			break;
		// The "N" key
		case ((document.all && 78) || (document.layers && 110)):
			rightClick_addItem()
			break;
		// The "D" key
		case ((document.all && 68) || (document.layers && 100)):
			rightClick_removeItem()
			break;
		// The "C" key
		case ((document.all && 67) || (document.layers && 99)):
			rightClick_copyItem()
			break;
		// The "P" key
		case ((document.all && 80) || (document.layers && 112)):
			rightClick_pasteItem(true)
			break;
		// The "M" key
		case ((document.all && 77) || (document.layers && 109)):
			rightClick_moveItem()
			break;
		default:
			if (tree.focusedObj)
				tree.focusedObj = false
	}

	if (document.layers)
		return routeEvent(e)
}

function rightMenu(showHide, theleft, thetop)
{
	if (showHide.toLowerCase() == "show")
	{
		build_right_menu()
		if (document.all)
		{
			eval(tree.window_reference + "document.all['rightmenu'].style.pixelLeft = " + theleft)
			eval(tree.window_reference + "document.all['rightmenu'].style.pixelTop = " + thetop)
			eval(tree.window_reference + "document.all['rightmenu'].style.display = 'block'")
		}
		else if (document.layers)
		{
			eval(tree.window_reference + "document.layers['rightmenu'].pageX = " + theleft)
			eval(tree.window_reference + "document.layers['rightmenu'].pageY = " + thetop)
			eval(tree.window_reference + "document.layers['rightmenu'].visibility = 'show'")
		}
	}
	else
	{
		if (document.all)
			eval(tree.window_reference + "document.all['rightmenu'].style.display = 'none'")
		else if (document.layers)
			eval(tree.window_reference + "document.layers['rightmenu'].visibility = 'hide'")
	}
}

function build_right_menu()
{
	var rm1='', rm2='', rm3=''
	var preFont  = (tree.font_bold)?"<font face='"+tree.font_type+"' size='"+tree.font_size+"' color='"+tree.background+"'><b>":"<font face='"+tree.font_type+"' size='"+tree.font_size+"' color='"+tree.background+"'>";
	var postFont = (tree.font_bold)?"</b></font>":"</font>";

	rm1	= "<table border=2 cellpadding=0 cellspacing=0 bgColor='" + tree.body_background + "'><tr><td>"
		+ "<table border=0 cellpadding=1 cellspacing=1 bgColor='" + tree.body_background + "'>"
	if (tree.focusedObj && tree.edit_item_func)
		rm2 += "<tr><td bgColor='" + tree.font_color + "'><a href='javascript:void(0)' onClick='parent.rightClick_editItem()'>" + preFont + "<font size=+1>E</font>dit \"" + tree.focusedObj.text + "\"" + postFont + "</a></td></tr>"

	if (tree.add_item_func)
		rm2 += "<tr><td bgColor='" + tree.font_color + "'><a href='javascript:void(0)' onClick='parent.rightClick_addItem()'>" + preFont + "<font size=+1>N</font>ew Item Here" + postFont + "</a></td></tr>"

	if (tree.focusedObj)
		rm2 += "<tr><td bgColor='" + tree.font_color + "'><a href='javascript:void(0)' onClick='parent.rightClick_removeItem()'>" + preFont + "<font size=+1>D</font>elete \"" + tree.focusedObj.text + "\"" + postFont + "</a></td></tr>"
			+  "<tr><td bgColor='" + tree.font_color + "'><a href='javascript:void(0)' onClick='parent.rightClick_copyItem()'>" + preFont + "<font size=+1>C</font>opy \"" + tree.focusedObj.text + "\"" + postFont + "</a></td></tr>"

	if (tree.clipboard)
		rm2 += "<tr><td bgColor='" + tree.font_color + "'><a href='javascript:void(0)' onClick='parent.rightClick_pasteItem(true)'>" + preFont + "<font size=+1>P</font>aste \"" + tree.clipboard.text + "\" Here" + postFont + "</a></td></tr>"
			+  "<tr><td bgColor='" + tree.font_color + "'><a href='javascript:void(0)' onClick='parent.rightClick_moveItem()'>" + preFont + "<font size=+1>M</font>ove \"" + tree.clipboard.text + "\" Here" + postFont + "</a></td></tr>"

	rm3 = "</table>"
		+ "</td></tr></table>"

	if (rm2 == "")
		rm2 = "<tr><td bgColor='" + tree.font_color + "'>" + preFont + "Nothing is copied to clipboard" + postFont + "</td></tr>"

	if (document.all)
		eval(tree.window_reference + "document.all[\"rightmenu\"].innerHTML = rm1 + rm2 + rm3")
	else if (document.layers)
	{
		eval(tree.window_reference + "document.layers[\"rightmenu\"].document.write(rm1 + rm2 + rm3)")
		eval(tree.window_reference + "document.layers[\"rightmenu\"].document.close()")
	}
}

function getGenericName(thename)
{
	thename = (typeof(thename) == "undefined")?"":thename;
	if (thename)
		return thename + "zxq";
	else
	{
		for (var i=0; i<3000; i++)
			if (typeof(tree["zxqzxqzxq" + i]) == "undefined")
				return "zxqzxqzxq" + i;
			else if (i == 2999)
			{
				alert("Please re-load before adding any more items.")
				return false;
			}
	}
}

function rightClick_addItem()
{
	rightMenu("hide")
	var thename = getGenericName()
	if (thename == false)
		return;

	if (tree.focusedObj)
		addItem(tree.focusedObj, thename, "New Item " + thename)
	else
		addItem("", thename, "New Item " + thename)

	// Strip "()" from the function name
	if (tree.add_item_func.indexOf("()") != -1)
		tree.add_item_func = tree.add_item_func.substring(0,tree.add_item_func.indexOf("()"))

	setTimeout(tree.add_item_func + "(tree[\"" + thename + "\"])", 1)
}

function rightClick_editItem()
{
	rightMenu("hide")
	if (!tree.focusedObj)
		return;

	// Strip "()" from the function name
	if (tree.edit_item_func.indexOf("()") != -1)
		tree.edit_item_func = tree.edit_item_func.substring(0,tree.edit_item_func.indexOf("()"))

	setTimeout(tree.edit_item_func + "(tree[\"" + tree.focusedObj.name + "\"])", 1)
}

function rightClick_removeItem()
{
	rightMenu("hide")
	if (!tree.focusedObj)
		return;

	tree.mockitem.name = tree.focusedObj.name
	tree.mockitem.text = tree.focusedObj.text
	tree.mockitem.icon_closed = tree.focusedObj.icon_closed
	tree.mockitem.icon_opened = tree.focusedObj.icon_opened
	tree.mockitem.icon_bottom = tree.focusedObj.icon_bottom
	tree.mockitem.background = tree.focusedObj.background
	tree.mockitem.font_color = tree.focusedObj.font_color
	tree.mockitem.font_type = tree.focusedObj.font_type
	tree.mockitem.font_size = tree.focusedObj.font_size
	tree.mockitem.font_bold = tree.focusedObj.font_bold
	tree.mockitem.is_open = tree.focusedObj.is_open
	tree.mockitem.points_to_obj = tree.focusedObj.points_to_obj
	tree.mockitem.points_to_url = tree.focusedObj.points_to_url
	tree.mockitem.target = tree.focusedObj.target
	tree.mockitem.onLeftClick = tree.focusedObj.onLeftClick
	tree.mockitem.parent = tree.focusedObj.parent
	tree.mockitem.children = tree.focusedObj.children

	if (removeItem(tree.focusedObj) && tree.remove_item_func)
	{
		// Strip "()" from the function name
		if (tree.remove_item_func.indexOf("()") != -1)
			tree.remove_item_func = tree.remove_item_func.substring(0,tree.remove_item_func.indexOf("()"))
		eval(tree.remove_item_func + "(tree.mockitem)")
	}
}

function rightClick_copyItem()
{
	rightMenu("hide")
	if (!tree.focusedObj)
		return;
	tree.clipboard = tree.focusedObj
}

function rightClick_pasteItem(do_writeTree)
{
	rightMenu("hide")
	if (!tree.clipboard)
		return;
	do_writeTree = (typeof(do_writeTree) == "undefined")?false:true;

	var thename = getGenericName(tree.clipboard.name)
	if (tree.focusedObj)
		addItem(tree.focusedObj, thename, tree.clipboard.text, tree.clipboard.icon_closed, tree.clipboard.icon_opened, tree.clipboard.icon_bottom)
	else
		addItem("", thename, tree.clipboard.text, tree.clipboard.icon_closed, tree.clipboard.icon_opened, tree.clipboard.icon_bottom)
	tree[thename].background = tree.clipboard.background
	tree[thename].font_color = tree.clipboard.font_color
	tree[thename].font_type = tree.clipboard.font_type
	tree[thename].font_size = tree.clipboard.font_size
	tree[thename].font_bold = tree.clipboard.font_bold
	tree[thename].points_to_obj = tree.clipboard.points_to_obj
	tree[thename].points_to_url = tree.clipboard.points_to_url
	tree[thename].target = tree.clipboard.target
	tree[thename].onLeftClick = tree.clipboard.onLeftClick

	if (do_writeTree)
		writeTree()

	if (tree.paste_item_func)
	{
		// Strip "()" from the function name
		if (tree.paste_item_func.indexOf("()") != -1)
			tree.paste_item_func = tree.paste_item_func.substring(0,tree.paste_item_func.indexOf("()"))
		setTimeout(tree.paste_item_func + "(tree[\"" + thename + "\"])", 1)
	}
}

function rightClick_moveItem()
{
	rightMenu("hide")
	if (!tree.clipboard)
		return;

	var thename = tree.clipboard.name
	tree.clipboard.name = getGenericName(tree.clipboard.name)
	if (tree.focusedObj)
		addItem(tree.focusedObj, thename, tree.clipboard.text, tree.clipboard.icon_closed, tree.clipboard.icon_opened, tree.clipboard.icon_bottom)
	else
		addItem("", thename, tree.clipboard.text, tree.clipboard.icon_closed, tree.clipboard.icon_opened, tree.clipboard.icon_bottom)
	tree[thename].background = tree.clipboard.background
	tree[thename].font_color = tree.clipboard.font_color
	tree[thename].font_type = tree.clipboard.font_type
	tree[thename].font_size = tree.clipboard.font_size
	tree[thename].font_bold = tree.clipboard.font_bold
	tree[thename].points_to_obj = tree.clipboard.points_to_obj
	tree[thename].points_to_url = tree.clipboard.points_to_url
	tree[thename].target = tree.clipboard.target
	tree[thename].onLeftClick = tree.clipboard.onLeftClick
	tree[thename].is_open = tree.clipboard.is_open
	tree[thename].children = tree.clipboard.children

	for (var i=0; i<tree[thename].children.length; i++)
		tree[thename].children[i].parent = tree[thename]

	removeItem(tree.clipboard, true)
	writeTree()

	if (tree.move_item_func)
	{
		// Strip "()" from the function name
		if (tree.move_item_func.indexOf("()") != -1)
			tree.move_item_func = tree.move_item_func.substring(0,tree.move_item_func.indexOf("()"))
		setTimeout(tree.move_item_func + "(tree[\"" + thename + "\"])", 1)
	}
}
