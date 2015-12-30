<!--    Proprietary Program Material -->
<!--    This material is proprietary to Lawson Software, and is not to be -->
<!--    reproduced or disclosed except in accordance with software contract -->
<!--    provisions, or upon written authorization from Lawson Software. -->
<!--    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved. -->
<!--    Saint Paul, Minnesota -->
<html>
<!-- $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/home.htm,v 1.18.2.6.4.1.14.1 2007/02/06 22:08:38 keno Exp $ -->
<!-- $NoKeywords: $ -->
<!-- LaVersion=8-)@(#)@9.0.1.9.153 2011-06-13 04:00:00 (201111) -->
<head>
<title>Lawson Portal</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<link rel="stylesheet" href="portal.css" type="text/css" />
<script language="javascript" src="servenv.js"></script>
<script language="javascript" src="home.js"></script>
<script language="javascript" src="layout.js"></script>
<!-- MOD BY BILAL	-->
<script language="javascript" src="/navi/portal_home.js"></script>
<!-- END OF MOD		-->
<script language="javascript">
function abandonChildren(node)
{
	var len = node.childNodes.length
	var childNode
	var i
	var arrRemove=new Array()
	for (i=0;i<len;i++) {
		childNode=node.childNodes[i]
		if (childNode.canHide)
			arrRemove[arrRemove.length]=childNode
	}
	for (i=arrRemove.length-1;i>=0;i--) {
		node.removeChild(arrRemove[i])
	}
}
function detTarget(e)
{
	e = e ? e : window.event;
	return portalWnd.getEventElement(e);
}
function detEvent(e)
{
	if (e)
		return e
	else if (window.event) { // IE
		return window.event
	}
	return null
}
</script>
</head>

<!-- MOD BY BILAL	-->
<!--
<body tabIndex="-1" onload="homeInit()" onunload="homeUnloadFunc()" onkeydown="handleKeyDown(event)" 
			style="margin:0px;" onresize="sizeFind();">
-->
<body tabIndex="-1" onload="homeInit();naviHomeInit();" onunload="homeUnloadFunc()" onkeydown="handleKeyDown(event)" 
			style="margin:0px;" onresize="sizeFind();">
<!-- END OF MOD -->
	<div id="lyrContent" style="position:absolute;visibility:hidden;overflow:auto;">
		<div id="lyrDrag2" style="position:absolute;visibility:hidden;" class="xTDragHighlight"><img src="images/spacer.gif" height="1" width="1" border="0"></div>
	</div>
	<div id="lyrExpand" style="position:absolute;visibility:hidden;overflow:auto;"></div>
	<div id="lyrDrag" style="position:absolute;visibility:hidden;" class="xTDragHighlight"><img src="images/spacer.gif" height="1" width="1" border="0"></div>
	<iframe tabIndex="-1" id="contentFrame" src="blank.htm" height="100%" width="100%" frameborder="no" 
			style="top:0px;left:0px;position:absolute;visibility:hidden;display:none;z-index:0">
	</iframe>
</body>

</html>
