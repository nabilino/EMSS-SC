/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/layout.js,v 1.9.2.3.4.1.14.1.2.2 2012/08/08 12:37:20 jomeli Exp $ */
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

var MAX_COLUMNS = 2
var isDirty = false
var mThresh = 8
var edgeWidth = 4
var minColPercentage = 10
var maxColPercentage = 90
var dblClickThres = 250
var mX, mY
var lastX, lastY

//-----------------------------------------------------------------------------
// called when user changes something
function dirty()
{
	if (!isDirty)
	{
		// setup toolbar with necessary links
		with (portalObj.toolbar)
		{
			target = window
			clear()
			createButton(portalObj.getPhrase("LBL_SAVE_LAYOUT"), "fnDone()")
			createButton(portalObj.getPhrase("LBL_CANCEL_LAYOUT"), "cancelLayout()")
		}
		isDirty=true
	}
}

//-----------------------------------------------------------------------------
function mouseMoved(x1,y1,x2,y2)
{
	return ( ( Math.abs(x2-x1) >= mThresh) || ( Math.abs(y2-y1) >= mThresh) )
}

//-----------------------------------------------------------------------------
function detMouse(event)
{
	if (isIE)
	{
		mX = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
		mY = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
	}
	else
	{
		mX = event.clientX + window.scrollX;
		mY = event.clientY + window.scrollY;
	}
	
	if (typeof(detMouse2)=="function")
		detMouse2(event)
}

//-----------------------------------------------------------------------------
function nodeContains(node,x,y)
{
	if (!node)
		return false
	if (!node.detCoords)
		detCoords(node)
	return ((x>=node.detLeft) && (x<=node.detRight)) &&
		((y>=node.detTop) && (y<=node.detBottom))
}

//-----------------------------------------------------------------------------
function detCoords(t)
{
	// in ns, t sometimes null
	if (!t) return
	
	// loop upwards, adding coordinates
 	var oTmp=t
	var iTop=0
	var iLeft=0
	
	if (typeof(oTmp.offsetParent) != "object") 
		return
	
	while(oTmp.offsetParent)
	{
		iTop+=oTmp.offsetTop
		iLeft+=oTmp.offsetLeft
		oTmp=oTmp.offsetParent
	}
		
	t.detLeft = iLeft
	t.detTop = iTop
	t.detWidth = parseInt(t.offsetWidth,10)
	t.detHeight = parseInt(t.offsetHeight,10)
	t.detRight = t.detLeft + t.detWidth
	t.detBottom = t.detTop + t.detHeight
	t.detCoords = true
}

//-----------------------------------------------------------------------------
// determine closest distance, edge of span
// ret either 'edge' or 'dist'
function detClosest(span,x,y,ret,vertOnly,noInside)
{
	if (!span.detCoords)
		detCoords(span)

	if (!span.detC)
	{
		span.cx = (span.detLeft + span.detRight)/2
		span.cy = (span.detTop + span.detBottom)/2
		span.detC = true
	}

	var dLeft = span.detLeft - x; 		dLeft = dLeft * dLeft;
	var dRight = span.detRight - x; 	dRight = dRight * dRight;
	var dBottom = span.detBottom - y; 	dBottom = dBottom * dBottom;
	var dTop = span.detTop - y; 		dTop = dTop * dTop;

	var dCX = span.cx - x; dCX = dCX * dCX
	var dCY = span.cy - y; dCY = dCY * dCY
	
	var d8X = Math.min(dLeft,dCX)
	d8X = Math.min(d8X,dRight)
	var d8Y = dTop
	
	var d6X = dRight
	var d6Y = Math.min(dTop,dCY)
	d6Y = Math.min(d6Y,dBottom)
	
	var d4X = dLeft
	var d4Y = d6Y
	
	var d2X = d8X
	var d2Y = dBottom

	var d8=d8X+d8Y
	var d4=d4X+d4Y
	var d6=d6X+d6Y
	var d2=d2X+d2Y
	
	var iCont = (nodeContains(span,x,y)?((!noInside)?(-100000):0):0)
	var ed = (ret == "edge")
	
	if (vertOnly)
	{
		if (d2<=d8)
			return (ed?2:iCont+d2)
		else
			return (ed?8:iCont+d8)
	}
	else
	{
		if (d2<=d4 && d2<=d6 && d2<=d8)
			return (ed?2:iCont+d2)
		else if (d4<=d6 && d4<d8)
			return (ed?4:iCont+d4)
		else if (d6<=d8)
			return (ed?6:iCont+d6)
		else
			return (ed?8:iCont+d8)
	}
}

//-----------------------------------------------------------------------------
function acceptP(p)
{
	p = parseInt(p,10)
	p = Math.max(p,minColPercentage)
	p = Math.min(p,maxColPercentage)
	return p
}

//-----------------------------------------------------------------------------
function transferWidthAttribute(n1,n2)
{
	// if exists, transfers the width attribute from the toNode to the toFlowNode
	if (isIE || (n1.hasAttributes() && n1.hasAttribute(ATTR_WIDTH))) {
		var w = n1.getAttribute(ATTR_WIDTH)
		if (w) {
			n1.removeAttribute(ATTR_WIDTH)
			n2.setAttribute(ATTR_WIDTH,w)
		}
	}
}

//-----------------------------------------------------------------------------
function doubleClickTime(d1,d2)
{
	var t=Math.abs(d2.getTime() - d1.getTime())
	return (t<dblClickThres)
}

//-----------------------------------------------------------------------------
function lowestSpan(arrSpans)
{
	var b = 0
	var ret = null
	for (var i=0;i<arrSpans.length;i++) {
		span = arrSpans[i]
		if (!span.detCoords)
			detCoords(span)
		if (span.detBottom>b) {
			b = span.detBottom
			ret=span
		}
	}
	return ret
}
