/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/infor/javascript/emss/inforStylerEMSS.js,v 1.1.2.53.2.22 2014/08/05 02:45:24 kevinct Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@10.00.05.00.27 Tue Aug 19 11:23:12 Central Daylight Time 2014 */
//***************************************************************
//*                                                             *
//*                           NOTICE                            *
//*                                                             *
//*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//*                                                             *
//*   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************
StylerEMSS.prototype.initListRowDrillDown = function(wnd, row, drillAnchor)
{
	wnd = wnd || window;
	var foundLink = false;
	var cells = row.cells;
	var clen = cells.length;
	for (var i=0; i<clen; i++)
	{
		if (cells[i].getAttribute("type") == "styler_drilldown")
			continue;
		var anchors = cells[i].getElementsByTagName("a");
		if (anchors.length > 0)
		{
			foundLink = true;
			drillAnchor.onclick = StylerEMSS.getLinkClick(wnd, anchors[0]);
			if (!drillAnchor.onclick)
			{
				drillAnchor.onclick = function()
				{
					anchors[0].click();
				}
			}
			var span = window.document.createElement("span");
			span.innerHTML = anchors[0].innerHTML;
			cells[i].insertBefore(span, anchors[0]);
			anchors[0].style.display = "none";
			break;
		}
	}
	return foundLink;
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processImageElement = function(wnd, theElement)
{
    var stylerAttribute = theElement.getAttribute("styler");

    switch (stylerAttribute)
    {
        case "prevcalendararrow":
             this.processCalendarPrevArrowElement(wnd, theElement);
            break;        
        case "nextcalendararrow":
             this.processCalendarNextArrowElement(wnd, theElement);
            break;
        case "multipleentrydetailicon":
            this.processMultipleEntryDetailIconElement(wnd, theElement);
            break;
        case "documenticon":
            this.processDocumentIconElement(wnd, theElement);
            break;   
        case "downarrow":
             this.processDownArrowElement(wnd, theElement);
            break;
        case "bargraphicon":
            this.processBarGraphIconElement(wnd, theElement);
            break; 
        case "activityicon":
            this.processActivityIconElement(wnd, theElement);
            break; 
        case "checkmarkicon":
            break;
        case "deleteicon":
            this.processDeleteIconElement(wnd, theElement);
            break;            
        default:
            StylerEMSS.baseMethod.processImageElement.apply(this, arguments);
            break;
    }
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.defineSpanCalOnclickStaticCall = function(spanCal, wnd)
{
    spanCal.onclick = function(evt)
    {
        if (!evt)
        {
            evt = wnd.event || wnd.Event;
        }
    
        StylerEMSS.calendarControlOnClick(wnd, this, evt);
    };
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.defineBodyOnmousedownStaticCall = function(wnd)
{ 
    // close the calendar when the user clicks outside the dropdown
    var mouseDownAttribute = wnd.document.body.getAttribute("styler_mousedown");
    if (mouseDownAttribute == null || mouseDownAttribute != "1")
    {    
        StylerEMSS.baseStaticMethod.addEvent(wnd.document, "mousedown",
            function(evt)
            {
                evt = (evt) ? evt : ((wnd.event) ? wnd.event : "");
                StylerEMSS.closeOpenControls(evt, wnd);
                // "bubble up" this event to the parent element
                try
                {
                	if (typeof(wnd.parent != wnd && wnd.parent["StylerEMSS"]) != "undefined")
                	{
                		wnd.parent.StylerEMSS.closeOpenControls(evt, parent.wnd);
                	}
                }
                catch(e)
                {}                
            });        
        wnd.document.body.setAttribute("styler_mousedown", "1");
    }
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processGroupBoxElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

	// set the dimensions so scrollbars appear - for firefox these get set in setLayerSizes()
	// this needs to be done every time in case the parent frame/window has been resized
	var paneBody = wnd.document.getElementById("paneBody");	
	if (paneBody && navigator.userAgent.indexOf("MSIE") >= 0)
	{
		var hdrHeight = (paneHeader) ? paneHeader.offsetHeight : 0;
		var recordsHeight = (wnd.document.getElementById("paneRecords")) ? wnd.document.getElementById("paneRecords").offsetHeight : 0;
		var paneHeight = wnd.document.body.offsetHeight - hdrHeight - recordsHeight - 37;
		var paneWidth = wnd.document.body.offsetWidth - 7;
		try
		{
			if (wnd.frameElement && (wnd.frameElement.getAttribute("scrolling") == "auto" || wnd.frameElement.getAttribute("scrolling") == "yes"))
			{
				//account for scrollbar width
				paneWidth -= 18;
			}
		}
		catch(e) {}		
		try
		{
			paneBody.style.height = paneHeight + "px";
			//let the width flow naturally on help windows
			if (paneBody.className != "helppanebody")
				paneBody.style.width = paneWidth + "px";	
			var paneBodyBorder = wnd.document.getElementById("paneBodyBorder");
			if (paneBodyBorder)
			{
				paneBodyBorder.style.height = paneHeight + "px";
				if (paneBody.className != "helppanebody")
					paneBodyBorder.style.width = paneWidth + "px";		
			}				
		}
		catch(e) {}		
		paneBody.style.overflow = "auto";
	}

    // get the label    
    var label = "";
    var paneHeader = wnd.document.getElementById("paneHeader");
    if (paneHeader)
    {
    	label = (paneHeader.innerText) ? paneHeader.innerText : ((paneHeader.textContent) ? paneHeader.textContent : "");
    	var node = paneHeader.parentNode;
    	while (node.nodeName.toLowerCase() != "tr" && node.parentNode != node && node.nodeName.toLowerCase() != "body")
    	{
    		node = node.parentNode;
    	}
    	if (node.nodeName.toLowerCase() == "tr")
    	{
    		node.style.display = "none";
    	}	
    }
    
    // return if already styled, but make sure the label is set first
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeDivGroupBox)
    {    	
    	if (theElement.parentNode.parentNode.className == "inforFieldSet")
    	{ 
    		this.setGroupBoxElementLabel(theElement.parentNode.parentNode, label);
        }
        return;
    }

	var fieldSetDiv = this.createGroupBoxElement(wnd, label);		
	var oldChild = theElement.parentNode.replaceChild(fieldSetDiv, theElement);
	var fieldSetDivs = fieldSetDiv.getElementsByTagName("div");
	var len = fieldSetDivs.length;
    for (var i=0; i<len; i++)
    {    
        if (fieldSetDivs[i].className == "inforFieldSetContent")
        {	      
			fieldSetDivs[i].appendChild(oldChild);
            break;
        }
    }	

    if (this.moreInfo)
    {
        alert("Replacing " + theElement.className + " with inforFieldSet");
        debugger;
        this.elementWarnings(wnd, theElement);
    }
    oldChild.setAttribute("styledAs", StylerBase.ElementTypeDivGroupBox);
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processAsteriskElement = function(wnd, theElement)
{
    // Return if already styled
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeAsterisk)
    {
        return;
    }

    if (!wnd)
    {
        wnd = window;
    }

    // replace the old span element with a new one
    var newSpan = wnd.document.createElement("span");
    newSpan.className = "inforRequiredIndicator";
	newSpan.style.margin = "0px";
	if (navigator.userAgent.indexOf("MSIE") >= 0)
		newSpan.style.styleFloat = "none";
	else
		newSpan.style.cssFloat = "none";
	if (this.textDir == "rtl")
		newSpan.style.paddingRight = "5px";
	else
		newSpan.style.paddingLeft = "5px";
	if (theElement.getAttribute("id"))
		newSpan.setAttribute("id", theElement.getAttribute("id"));
    newSpan.appendChild(wnd.document.createTextNode("\u00a0"));
		
	var parNode = null;
	if (theElement.parentNode.nodeName.toLowerCase() == "td" || theElement.parentNode.nodeName.toLowerCase() == "th")
	{
		parNode = theElement.parentNode;
	}     
	//else if (theElement.parentNode.parentNode.nodeName.toLowerCase() == "td" || theElement.parentNode.parentNode.nodeName.toLowerCase() == "th")
	//{
	//	parNode = theElement.parentNode.parentNode;
	//}
	if (parNode != null)
	{	
		var firstChild = (parNode.childNodes.length > 0) ? parNode.childNodes[0] : null;
		if (this.textDir == "rtl")
		{
			parNode.style.paddingRight = "0px";
			parNode.style.paddingLeft = "5px";
		}
		else
		{
			parNode.style.paddingRight = "5px";
			parNode.style.paddingLeft = "0px";
		}
		if (navigator.userAgent.indexOf("MSIE") >= 0)
		{
			newSpan.style.position = "relative";
			newSpan.style.top = "-3px";
		}
		parNode.style.whiteSpace = "nowrap";
		parNode.style.verticalAlign = "top";
		if (firstChild != null)		
			parNode.insertBefore(newSpan, firstChild);
		else
			parNode.appendChild(newSpan);	
		var oldChild = theElement.parentNode.removeChild(theElement);				
	}
	else
	{	
		var oldChild = theElement.parentNode.replaceChild(newSpan, theElement);   
	}

    if (this.moreInfo)
    {
        alert("Replacing " + theElement.className + " with inforRequiredIndicator");
        debugger;
        this.elementWarnings(wnd, theElement);
    }
    newSpan.setAttribute("styler", "asterisk");
    newSpan.setAttribute("styledAs", StylerBase.ElementTypeAsterisk);
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processCalendarPrevArrowElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

	var imgUrl = StylerEMSS.webappjsURL + "/infor/images/";
	if (this.textDir == "rtl")
	{
		imgUrl += "button_grid_next.png";
	}
	else
	{
		imgUrl += "button_grid_previous.png";
	}

    var imgArrow = wnd.document.createElement("img");
    imgArrow.src = imgUrl;
    imgArrow.style.verticalAlign = "top";
	imgArrow.style.width = "22px";    
	imgArrow.style.height = "20px";    
    imgArrow.setAttribute("width", "22");
    imgArrow.setAttribute("height", "20");
    if (theElement.getAttribute("alt") != null)
    {
    	imgArrow.setAttribute("alt", theElement.getAttribute("alt")); 
    }
    if (theElement.parentNode.nodeName.toLowerCase() == "a")
    {
    	theElement.parentNode.style.border = "none";
    	if (this.textDir == "rtl")
    	{
    		theElement.parentNode.style.marginLeft = "5px";
		}
		else
		{
    		theElement.parentNode.style.marginRight = "5px";
        }
        theElement.parentNode.onmouseover = null;
        theElement.parentNode.onmouseout = null;
        theElement.parentNode.onfocus = null;
        theElement.parentNode.onblur = null;
        theElement.parentNode.removeAttribute("onmouseover");
        theElement.parentNode.removeAttribute("onmouseout");
        theElement.parentNode.removeAttribute("onfocus");
        theElement.parentNode.removeAttribute("onblur");        
    }
    
    var oldChild = theElement.parentNode.replaceChild(imgArrow, theElement);	
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processCalendarNextArrowElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }
    
	var imgUrl = StylerEMSS.webappjsURL + "/infor/images/";
	if (this.textDir == "rtl")
	{
		imgUrl += "button_grid_previous.png";
	}
	else
	{
		imgUrl += "button_grid_next.png";
	}    
    
    var imgArrow = wnd.document.createElement("img");
    imgArrow.src = imgUrl;
    imgArrow.style.verticalAlign = "top";
	imgArrow.style.width = "22px";    
	imgArrow.style.height = "20px";
    imgArrow.setAttribute("width", "22");
    imgArrow.setAttribute("height", "20");
    if (theElement.getAttribute("alt") != null)
    {
    	imgArrow.setAttribute("alt", theElement.getAttribute("alt")); 
    }
    if (theElement.parentNode.nodeName.toLowerCase() == "a")
    {
    	theElement.parentNode.style.border = "none";
    	if (this.textDir == "rtl")
    	{
    		theElement.parentNode.style.marginRight = "5px";
    	}
    	else
    	{    	
    		theElement.parentNode.style.marginLeft = "5px";
        }
        theElement.parentNode.onmouseover = null;
        theElement.parentNode.onmouseout = null; 
        theElement.parentNode.onfocus = null;
        theElement.parentNode.onblur = null; 
        theElement.parentNode.removeAttribute("onmouseover");
        theElement.parentNode.removeAttribute("onmouseout");
        theElement.parentNode.removeAttribute("onfocus");
        theElement.parentNode.removeAttribute("onblur");
    }
    
    var oldChild = theElement.parentNode.replaceChild(imgArrow, theElement); 
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processMultipleEntryDetailIconElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    var activeIconAttribute = theElement.getAttribute("active_icon");
    var isActive = (activeIconAttribute != null && theElement.src.indexOf(activeIconAttribute) != -1);
    var imgSrc;
    var imgColor = parseInt(theElement.getAttribute("image_color")); 
    
    switch(imgColor)
    {
      case -1:
            imgSrc = "/infor/images/icon_multientrysingle_RED.png";
            break;
      case 0:
            imgSrc = "/infor/images/icon_multientrysingle_YELLOW.png";
            break;
      case 1:
            imgSrc = "/infor/images/icon_multientrysingle_GREEN.png";
            break;
      default:
            imgSrc = "/infor/images/icon_multientrysingle_BLUE.png";
            break;
    }
    
    theElement.src = StylerEMSS.webappjsURL + imgSrc;
    theElement.setAttribute("orig_icon", theElement.src);
    theElement.setAttribute("border", "0");
    theElement.style.marginTop = "0px";
    theElement.style.verticalAlign = "middle";
    
    if(imgColor == -1 || imgColor == 0 || imgColor == 1)
    {
		theElement.style.height = "14px";
		theElement.style.width = "14px";
		theElement.setAttribute("height", "14");
		theElement.setAttribute("width", "14");
    }
    else
    {
		theElement.style.height = "14px";
		theElement.style.width = "14px";
		theElement.setAttribute("height", "14");
		theElement.setAttribute("width", "14");
    } 
    
    if (theElement.getAttribute("default_icon") != null)
    {
    	theElement.setAttribute("default_icon", StylerEMSS.webappjsURL + imgSrc);
    }
    
    if (activeIconAttribute)
    {
    	theElement.setAttribute("active_icon", StylerEMSS.webappjsURL + imgSrc);
    	if (isActive)
    	{
    	    theElement.src = StylerEMSS.webappjsURL + imgSrc;
    	}
    }
    
    var parNode = theElement.parentNode;
    if (parNode.nodeName.toLowerCase() == "a")
    {
    	parNode.style.border = "none";
    	parNode.onmouseover = null;
    	parNode.onmouseout = null;
    	parNode.onfocus = null;
    	parNode.onblur = null;    	
    	parNode.removeAttribute("onmouseover");
    	parNode.removeAttribute("onmouseout");
    	parNode.removeAttribute("onfocus");
    	parNode.removeAttribute("onblur"); 
    }
    if (parNode.parentNode.nodeName.toLowerCase() == "td" || parNode.parentNode.nodeName.toLowerCase() == "th")
    {
    	parNode.parentNode.style.textAlign = "center";
    }     
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processDocumentIconElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    var activeIconAttribute = theElement.getAttribute("active_icon");
    var isActive = (activeIconAttribute != null && theElement.src.indexOf(activeIconAttribute) != -1);

    theElement.src = StylerEMSS.webappjsURL + "/infor/images/icon_comment_empty_rest.png";
    theElement.setAttribute("orig_icon", theElement.src);
    theElement.style.width = "12px";
    theElement.style.height = "12px";
    theElement.setAttribute("height", "12");
    theElement.setAttribute("width", "12");
    theElement.setAttribute("border", "0");
    
    if (theElement.getAttribute("default_icon") != null)
    {
    	theElement.setAttribute("default_icon", StylerEMSS.webappjsURL + "/infor/images/icon_comment_empty_rest.png");
    }
    
    if (activeIconAttribute != null)
    {
    	theElement.setAttribute("active_icon", StylerEMSS.webappjsURL + "/infor/images/icon_comment_rest.png");
		if (isActive)
		{
		    theElement.src = StylerEMSS.webappjsURL + "/infor/images/icon_comment_rest.png";
		}
    }
    
    theElement.onmouseover = theElement.onfocus = function()
    {
    	if (this.src.indexOf("icon_comment_empty") != -1)
    	{
    		this.src = StylerEMSS.webappjsURL + "/infor/images/icon_comment_empty_hover.png";
    	} 
    	else
    	{
    		this.src = StylerEMSS.webappjsURL + "/infor/images/icon_comment_hover.png";
    	}
    };
    theElement.onmousedown = theElement.onkeydown = function()
    {
    	if (this.src.indexOf("icon_comment_empty") != -1)
    	{
    		this.src = StylerEMSS.webappjsURL + "/infor/images/icon_comment_empty_pressed.png";
    	} 
    	else
    	{
    		this.src = StylerEMSS.webappjsURL + "/infor/images/icon_comment_pressed.png";
    	}    
    };
    theElement.onmouseout = theElement.onblur = function()
    {
    	if (this.src.indexOf("icon_comment_empty") != -1)
    	{
    		this.src = StylerEMSS.webappjsURL + "/infor/images/icon_comment_empty_rest.png";
    	} 
    	else
    	{
    		this.src = StylerEMSS.webappjsURL + "/infor/images/icon_comment_rest.png";
    	}    
    };
    
    var parNode = theElement.parentNode;
    if (parNode.nodeName.toLowerCase() == "a")
    {
    	parNode.style.border = "none";
    	parNode.onmouseover = null;
    	parNode.onmouseout = null;
    	parNode.onfocus = null;
    	parNode.onblur = null;    	
    	parNode.removeAttribute("onmouseover");
    	parNode.removeAttribute("onmouseout");
    	parNode.removeAttribute("onfocus");
    	parNode.removeAttribute("onblur"); 
    }
    if (parNode.parentNode.nodeName.toLowerCase() == "td" || parNode.parentNode.nodeName.toLowerCase() == "th")
    {
    	parNode.parentNode.style.textAlign = "center";
    }
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processDownArrowElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }
    
    var imgArrow = wnd.document.createElement("img");
    if (theElement.getAttribute("id"))
    	imgArrow.setAttribute("id", theElement.getAttribute("id"));    
    imgArrow.src = StylerEMSS.webappjsURL + "/infor/images/icn_arrow-down_7x5_enabled_gray999999.png";
	imgArrow.style.width = "7px";    
	imgArrow.style.height = "5px";    
    imgArrow.setAttribute("width", "7");
    imgArrow.setAttribute("height", "5");
    imgArrow.style.verticalAlign = "middle";
    if (theElement.getAttribute("alt") != null)
    {
    	imgArrow.setAttribute("alt", theElement.getAttribute("alt")); 
    }    
	imgArrow.onmouseover = function()
	{
		this.src = StylerEMSS.webappjsURL + "/infor/images/icn_arrow-down_7x5_over_gray555555.png";
	}
	imgArrow.onmousedown = function()
	{
		this.src = StylerEMSS.webappjsURL + "/infor/images/icn_arrow-down_7x5_press_gray666666.png";
	}
	imgArrow.onmouseout = function()
	{
		this.src = StylerEMSS.webappjsURL + "/infor/images/icn_arrow-down_7x5_enabled_gray999999.png";
	}
	
	var oldChild = theElement.parentNode.replaceChild(imgArrow, theElement);    
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processBarGraphIconElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    theElement.src = StylerEMSS.webappjsURL + "/infor/images/icon_grid_graph_2.png";
    theElement.style.height = "11px";
    theElement.style.width = "11px";
    theElement.setAttribute("height", "11");
    theElement.setAttribute("width", "11");
    theElement.setAttribute("border", "0");
    
    var parNode = theElement.parentNode;
    if (parNode.nodeName.toLowerCase() == "a")
    {
    	parNode.style.border = "none";
    	parNode.onmouseover = null;
    	parNode.onmouseout = null;
    	parNode.onfocus = null;
    	parNode.onblur = null;    	
    	parNode.removeAttribute("onmouseover");
    	parNode.removeAttribute("onmouseout");
    	parNode.removeAttribute("onfocus");
    	parNode.removeAttribute("onblur"); 
    }
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processActivityIconElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    theElement.src = StylerEMSS.webappjsURL + "/infor/images/infor_ajax-loader_24x24.gif";
    theElement.style.height = "24px";
    theElement.style.width = "24px";
    theElement.setAttribute("height", "24");
    theElement.setAttribute("width", "24");
    theElement.setAttribute("border", "0");
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processDeleteIconElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }
    
    var imgArrow = wnd.document.createElement("img");
    if (theElement.getAttribute("id"))
    	imgArrow.setAttribute("id", theElement.getAttribute("id"));    
    imgArrow.src = StylerEMSS.webappjsURL + "/infor/images/icn_delete_21x21_55595c_enabled.png";
	imgArrow.style.width = "21px";    
	imgArrow.style.height = "21px";    
    imgArrow.setAttribute("width", "21");
    imgArrow.setAttribute("height", "21");
    imgArrow.style.verticalAlign = "middle";
    imgArrow.setAttribute("border", "0");
    if (theElement.getAttribute("alt") != null)
    {
    	imgArrow.setAttribute("alt", theElement.getAttribute("alt")); 
    }
    if (theElement.getAttribute("title") != null)
    {
    	imgArrow.setAttribute("title", theElement.getAttribute("title")); 
    }    
	imgArrow.onmouseover = imgArrow.onfocus = function()
	{
		this.src = StylerEMSS.webappjsURL + "/infor/images/icn_delete_21x21_55595c_over.png";
	}
	imgArrow.onmousedown = imgArrow.onkeydown = function()
	{
		this.src = StylerEMSS.webappjsURL + "/infor/images/icn_delete_21x21_55595c_press.png";
	}
	imgArrow.onmouseout = imgArrow.onblur = function()
	{
		this.src = StylerEMSS.webappjsURL + "/infor/images/icn_delete_21x21_55595c_enabled.png";
	}
	
    var parNode = theElement.parentNode;
    if (parNode.nodeName.toLowerCase() == "a")
    {
    	parNode.style.border = "none";
    	parNode.onmouseover = null;
    	parNode.onmouseout = null;
    	parNode.onfocus = null;
    	parNode.onblur = null;    	
    	parNode.removeAttribute("onmouseover");
    	parNode.removeAttribute("onmouseout");
    	parNode.removeAttribute("onfocus");
    	parNode.removeAttribute("onblur"); 
    }	
	
	var oldChild = theElement.parentNode.replaceChild(imgArrow, theElement);	
};

//-----------------------------------------------------------------------------
StylerEMSS.initExpanderControl = function(wnd, oldDiv, expanderSpan)
{
    if (!wnd)
    {
        wnd = window;
    }
	
    var links = oldDiv.getElementsByTagName("a");
	
    if (links.length > 0)
    {
        var expAnchor = links[0];
        var expText = (expAnchor.innerText) ? expAnchor.innerText : ((expAnchor.textContent) ? expAnchor.textContent : "");    
        expText = expText.replace("<<", "").replace(">>", "");                    
        expanderSpan.appendChild(wnd.document.createTextNode(expText));
        expAnchor.className = "inforHidden";    
    }
}

//-----------------------------------------------------------------------------
StylerEMSS.initTabControl = function(wnd, oldDiv)
{
    if (!wnd)
    {
        wnd = window;
    }

	var tabControlId = oldDiv.getAttribute("id");	
    var tabControl = wnd.document.getElementById(tabControlId); 	
    //ugly IE RTL hack
	var stylerObj = StylerEMSS._singleton;    
	if (stylerObj && stylerObj.textDir == "rtl" && (navigator.userAgent.indexOf("MSIE") >= 0)
	&& (!document.documentMode || (document.documentMode < 8)))
	{	
		tabControl.style.marginLeft = "17px";
	}   
    var tabs = oldDiv.getElementsByTagName("a");
	
    for (var i=0; i<tabs.length; i++)
    {
        var tabId = tabs[i].getAttribute("id");
        var tabText = (tabs[i].innerText) ? tabs[i].innerText : ((tabs[i].textContent) ? tabs[i].textContent : "");
        var contentId = tabId.replace(new RegExp('_TabBody_'), '_Body_');
        var contentDiv = wnd.document.getElementById(contentId);
		
        wnd.styler.addTab(wnd, tabControl, tabId, tabText, (tabs[i].className != "innertabbodyoff"), contentDiv);
	
		if (wnd.document.body.offsetHeight > 58)
		{
			contentDiv.style.height = (wnd.document.body.offsetHeight - 58) + "px";
		}
		contentDiv.style.width = "100%";
		if (tabControlId == "optionTabs")
		{
			if (navigator.userAgent.indexOf("MSIE") >= 0)
			{
				if (wnd.document.body.offsetHeight > 64) 
				{
					contentDiv.style.height = (wnd.document.body.offsetHeight - 64) + "px";
				}
				contentDiv.style.width = "100%";		
			}
			else
			{
				contentDiv.style.width = (wnd.document.body.offsetWidth - 27) + "px";
			}	
		}	
    }
	
    wnd.document.getElementById("paneBody").className = "inforHidden";
    wnd.activateTab = function() {};
    wnd.deactivateTab = function() {};
    
    wnd.tabOnClick = function(tabContent)
    {		
        var tabId = tabContent.getAttribute("id");
        var tabControlId = tabId.substring(0, tabId.indexOf("_"));
        var doc = StylerEMSS.getElementDocument(tabContent);
        var tabControl = doc.getElementById(tabControlId);        
		
        var uls = tabControl.getElementsByTagName("ul");
        var ul = null;
        var i = 0;
        while (i < uls.length && ul == null)
        {
            if (uls[i].className == "inforTabset")
            {
                ul = uls[i];
            }
            i++;
        }
    		
        if (ul != null)
        {
            var lis = ul.getElementsByTagName("li");
            for (var j=0; j<lis.length; j++)
            {
                if (lis[j].getAttribute("tabId") == tabId)
                {
                    StylerEMSS.setActiveTabControlTab(lis[j], wnd);	
                    break;
                }
	    	}	
        }
    };  
    
    if (wnd.parent && typeof(wnd.parent["activateTab"]) == "function")
    {
        wnd.parent.activateTab = wnd.activateTab;
        wnd.parent.deactivateTab = wnd.deactivateTab;
        wnd.parent.tabOnClick = wnd.tabOnClick;
    }
}

//-----------------------------------------------------------------------------
StylerEMSS.initTabControlLP = function(wnd, oldDiv)
{
    if (!wnd)
    {
        wnd = window;
    }
	
    var tabControl = wnd.document.getElementById(oldDiv.getAttribute("id")); 	
    var tabs = oldDiv.getElementsByTagName("a");
	
    for (var i=0; i<tabs.length; i++)
    {
        var tabId = tabs[i].getAttribute("id");
        var tabText = (tabs[i].innerText) ? tabs[i].innerText : ((tabs[i].textContent) ? tabs[i].textContent : "");
        var contentId = tabId.replace(new RegExp('_TabBody_'), '_Body_');
        var contentDiv = wnd.document.getElementById(contentId);
		
        wnd.styler.addTab(wnd, tabControl, tabId, tabText, (tabs[i].className != "innertabbodyoff"), contentDiv);
	
        contentDiv.style.height = (wnd.document.body.offsetHeight - 40) + "px";
        contentDiv.style.width = (wnd.document.body.offsetWidth - 20) + "px";
    }
	
    wnd.document.getElementById("paneBody").className = "inforHidden";

    wnd.activateTab = function(tabContent) 
    {    
        var tabId = tabContent.getAttribute("id");
        var tabControlId = tabId.substring(0, tabId.indexOf("_"));
        var doc = StylerEMSS.getElementDocument(tabContent);
        var tabControl = doc.getElementById(tabControlId); 
        
        var uls = tabControl.getElementsByTagName("ul");
        var ul = null;
        var i = 0;
        while (i < uls.length && ul == null)
        {
            if (uls[i].className == "tabControlStyler")
            {
                ul = uls[i];
            }
            i++;
        }
    		
        if (ul != null)
        {
            var lis = ul.getElementsByTagName("li");
            for (var j=0; j<lis.length; j++)
            {
                if (lis[j].getAttribute("tabId") == tabId)
                {
                    StylerEMSS.setActiveTabControlTab(lis[j], wnd);	
	            	break;
                }
			}	
        }   	
    };
    
    wnd.deactivateTab = function() {};
    
    wnd.tabOnClick = function(tabContent)
    {		
        var tabId = tabContent.getAttribute("id");
        var tabControlId = tabId.substring(0, tabId.indexOf("_"));
        var doc = StylerEMSS.getElementDocument(tabContent);
        var tabControl = doc.getElementById(tabControlId);        
		
        var uls = tabControl.getElementsByTagName("ul");
        var ul = null;
        var i = 0;
        while (i < uls.length && ul == null)
        {
            if (uls[i].className == "inforTabset")
            {
                ul = uls[i];
            }
            i++;
        }
    		
        if (ul != null)
        {
            var lis = ul.getElementsByTagName("li");
            for (var j=0; j<lis.length; j++)
            {
                if (lis[j].getAttribute("tabId") == tabId)
                {
                    StylerEMSS.setActiveTabControlTab(lis[j], wnd);	
	            	break;
                }
	    }	
        }
    };  
    
    if (wnd.parent && typeof(wnd.parent["activateTab"]) == "function")
    {
        wnd.parent.activateTab = wnd.activateTab;
        wnd.parent.deactivateTab = wnd.deactivateTab;
        wnd.parent.tabOnClick = wnd.tabOnClick;
    }
}

//-----------------------------------------------------------------------------
StylerEMSS.onClickTabControlTab = function(wnd, tabObj)
{
    var tabId = tabObj.getAttribute("tabId");
    var tabControlId = tabId.substring(0, tabId.indexOf("_"));
    var parWnd = wnd.parent;

    if (typeof(parWnd[tabControlId + "_OnClick"]) == "function")
    {   
        var oldTab = wnd.document.getElementById(tabId);       
        if (oldTab != null)
        {       
            StylerEMSS.performFunctionCallback(parWnd, tabControlId + "_OnClick", new Array(oldTab));            
        }
    }
    
    if (typeof(parWnd[tabControlId]) != "undefined" && tabObj.getAttribute("tabNbr") != null)
    	parWnd[tabControlId].activetab = Number(tabObj.getAttribute("tabNbr"));    
}

//-----------------------------------------------------------------------------
StylerEMSS.onLoadTabControlTab = function(wnd, oldDiv)
{
    if (typeof(calObj) != "undefined" && calObj != null)
    {
        calObj.close();
    }
}

//-----------------------------------------------------------------------------
StylerEMSS.initTabControlCM = function(wnd, oldDiv)
{
    if (!wnd)
    {
        wnd = window;
    }
	
    var tabControl = wnd.document.getElementById(oldDiv.getAttribute("id")); 	
    var tabs = oldDiv.getElementsByTagName("a");
	
    for (var i=0; i<tabs.length; i++)
    {
        var tabId = tabs[i].getAttribute("id");
		var tabText = (tabs[i].innerText) ? tabs[i].innerText : ((tabs[i].textContent) ? tabs[i].textContent : "");		
		var isActive = (tabs[i].className == "tabupCM");
		var contentDiv = null;
	
		if (wnd.document.getElementById(tabId))
		{
		    contentDiv = wnd.document.getElementById(tabId);
		}
		else
		{
		    contentDiv = wnd.document.createElement("div");
		    contentDiv.setAttribute("id", tabId);
		    contentDiv.style.display = (isActive) ? "block" : "none";
		    wnd.document.body.appendChild(contentDiv);
		}
	
        wnd.styler.addTab(wnd, tabControl, tabId, tabText, isActive, contentDiv);
		contentDiv.style.width = "100%";
		contentDiv.style.height = "100%";		
		contentDiv.style.overflow = "visible";    
    }
	
    var uls = tabControl.getElementsByTagName("ul");
    var ul = null;
    var i = 0;
    while (i < uls.length && ul == null)
    {
        if (uls[i].className == "inforTabset")
        {
            ul = uls[i];
        }
        i++;
    }
    if (ul != null)
    {
    	ul.style.overflow = "hidden";
    }	
    wnd.CallBack_Tabs = function() {};
}

//-----------------------------------------------------------------------------
StylerEMSS.onLoadTabControlTabCM = function(wnd, tabObj)
{
    if (typeof(calObj) != "undefined" && calObj != null)
    {
        calObj.close();
    }

    var tabId = tabObj.getAttribute("tabId");
    var tabIdParams = tabId.split("_");
    
    // call the Career Management tab onclick method
    if (tabIdParams.length > 1)
    {
        var tabName = tabIdParams[0];
        var tabCode = (tabIdParams.length >= 2) ? tabIdParams[tabIdParams.length-2] : null;
        var tabArg = (tabIdParams.length >= 3) ? tabIdParams[tabIdParams.length-3] : null;
        var argAry = (tabIdParams.length > 3) ? new Array(tabCode, tabArg) : new Array(tabCode);
        var parWnd = wnd.parent;

        if (typeof(parWnd["OnTabClicked_" + tabName]) != "function" && tabIdParams.length > 3)
        {
        	if (typeof(parWnd["OnTabClicked_" + tabName + "_" + tabIdParams[1]]) == "function")
        	{	
        		tabName = tabName + "_" + tabIdParams[1];
        	}	
        }        
        if (typeof(parWnd["OnTabClicked_" + tabName]) == "function")
        {
            StylerEMSS.performFunctionCallback(parWnd, "OnTabClicked_" + tabName, argAry);
        }
    }
    return true;
}

//-----------------------------------------------------------------------------
StylerEMSS.onClickColumn = function(wnd, obj)
{
	if (!obj)
		return;
		
	while (obj != obj.parentNode && obj.nodeName.toLowerCase() != "th")
	{	
		obj = obj.parentNode;
	}
	
    if (obj.getAttribute("styler_sort") == null)
    {
    	obj.setAttribute("styler_sort", "ascending");
    }

    StylerEMSS.baseMethod.addSortArrow.apply(this, arguments);	
    
    var anchorList = obj.getElementsByTagName("a");
                        
    for (var j=0; j<anchorList.length; j++)
    {
        var anchorElm = anchorList[j];
        if (anchorElm.getAttribute("onclick") != null)
        {
            if (anchorElm.click)
            {
                anchorElm.click();
            }
            else if (anchorElm.onclick)
            {
                anchorElm.onclick();
            }
            break;
        }
    }        
}

//-----------------------------------------------------------------------------
StylerEMSS.initListColumn = function(wnd, obj)
{
	if (!obj)
		return;
		
	while (obj != obj.parentNode && obj.nodeName.toLowerCase() != "th")
	{	
		obj = obj.parentNode;
	}
	
    var anchorList = obj.getElementsByTagName("a");
                        
    for (var j=0; j<anchorList.length; j++)
    {
        var anchorElm = anchorList[j];
        //if there is a styler_click attribute, leave the hyperlinks visible
        if (clickAttr == null && anchorElm.getAttribute("onclick") != null)
        {
            anchorElm.style.display = "none";
            var textContent = (anchorElm.innerText) ? anchorElm.innerText : ((anchorElm.textContent) ? anchorElm.textContent : "");
            var textNode = wnd.document.createTextNode(textContent);
            anchorElm.parentNode.insertBefore(textNode, anchorElm);	
            break;
        }
    }   
}

//-----------------------------------------------------------------------------
StylerEMSS.hiddenCalendarDateChanged = function(wnd, obj)
{
    if (!wnd)
    {
        wnd = window;
    }

    var winRef = wnd;
  
  	try
  	{
	    while (winRef.parent != winRef && typeof(winRef.ReturnDate) == "undefined")
	    {
	        winRef = winRef.parent;	
	    }
    }
    catch(e)
    {
    	winRef = wnd;
    }
    
    try
    {
	    if (typeof(winRef.ReturnDate) != "undefined")
	    {
	    	winRef.ReturnDate(obj.value);
	    }
	    else if (opener && typeof(opener.ReturnDate) != "undefined")
	    {
	    	opener.ReturnDate(obj.value);
	    }
    }
    catch(e) {}
};

//-----------------------------------------------------------------------------
StylerBase.prototype.triggerComboBoxElement = function(wnd, theElement, eventNm)
{
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.preProcessDom = function(wnd)
{
	if (!wnd)
	{
		wnd = window;
	}

	wnd.uiNoPhotoPath = StylerEMSS.webappjsURL + "/infor/images/nophoto4_36x36.png";
        
	var initCalendar = false;

	// style all "text" and "password" input boxes
	var elms = this.getLikeElements(wnd, "input", "type", "text");
	var elms2 = this.getLikeElements(wnd, "input", "type", "password");
	elms = elms.concat(elms2);
	var i = 0;
	var len = elms.length;

	for (i = 0; i < len; i++)
	{
		if (elms[i].getAttribute("styler") == null && elms[i].getAttribute("styledAs") == null)
		{
			elms[i].setAttribute("styler", "textbox");
		}            

		// date fields, select fields
		var sib = StylerEMSS.getNextSibling(elms[i]);
		if (sib != null && sib.nodeName.toLowerCase() == "a")
		{
			// date fields
			if ((sib.getAttribute("href") != null && sib.getAttribute("href").indexOf("DateSelect") >= 0)
			|| (sib.getAttribute("onclick") != null && sib.getAttribute("onclick").toString().indexOf("DateSelect") >= 0))
			{
				if (elms[i].getAttribute("styledAs") != StylerEMSS.ElementTypeInputCalendar)
				{
					initCalendar = true;
					elms[i].setAttribute("styler", "calendar");
					sib.className = "inforHidden";
				}
			}

			// select fields
			var selImgs = sib.getElementsByTagName("img");
			if ((selImgs.length > 0 && selImgs[0].src.indexOf("ico_form_dropmenu.gif") >= 0)
			|| ((sib.getAttribute("href") != null && sib.getAttribute("href").indexOf("DropDown") >= 0)
			|| (sib.getAttribute("onclick") != null && sib.getAttribute("onclick").toString().indexOf("DropDown") >= 0)))
			{
				if (elms[i].getAttribute("styledAs") != StylerEMSS.ElementTypeInputSelect)
				{
					elms[i].setAttribute("styler", "select");
					elms[i].setAttribute("styler_click", "StylerEMSS.selectControlOnClick");
					sib.className = "inforHidden";
				}           		
			}
		}
	}

	// style all radio buttons
	elms = this.getLikeElements(wnd, "input", "type", "radio");
	len = elms.length;
	for (i = 0; i < len; i++)
	{
		if (elms[i].getAttribute("styledAs") != StylerEMSS.ElementTypeInputRadio)
		{
			elms[i].setAttribute("styler", "radio");
		}            
	}
        
	// style all checkboxes
	elms = this.getLikeElements(wnd, "input", "type", "checkbox");
	len = elms.length;
	for (i = 0; i < len; i++)
	{
		if (elms[i].getAttribute("styledAs") != StylerEMSS.ElementTypeInputCheckbox)
		{        
			elms[i].setAttribute("styler", "checkbox");
		}             
	}        

	// style all push buttons
	elms = this.getLikeElements(wnd, "button", "", "");
	len = elms.length;
	for (i = 0; i < len; i++)
	{      
		if (elms[i].getAttribute("styledAs") != StylerEMSS.ElementTypeButton)
		{
			elms[i].setAttribute("styler", "pushbutton");            
		}	
	}

	// style all select dropdowns
	elms = this.getLikeElements(wnd, "select", "", "");
	len = elms.length;
	for (i = 0; i < len; i++)
	{
		if (elms[i].getAttribute("styledAs") != StylerEMSS.ElementTypeComboBox)
		{        
			elms[i].setAttribute("styler", "combobox");
		}             
	}

	// style all text areas
	elms = this.getLikeElements(wnd, "textarea", "", "");
	len = elms.length;
	for (i = 0; i < len; i++)
	{
		if (elms[i].getAttribute("styledAs") != StylerEMSS.ElementTypeTextArea)
		{        
			elms[i].setAttribute("styler", "textarea");
		}            
	}
	
	// ensure lists are not double styled
	elms = this.getLikeElements(wnd, "table", "styler", "list");
	len = elms.length;
	for (i = 0; i < len; i++)
	{
		if (elms[i].getAttribute("styledAs") == StylerEMSS.ElementTypeList)
		{        
			elms[i].removeAttribute("styler");
		}            
	}	

	var paneBorderDiv = wnd.document.getElementById("paneBodyBorder");
	if (paneBorderDiv != null)
	{        
		// restyled tabs will handle their own overflow - set overflow to hidden on the parent
		var paneTabs = wnd.document.getElementById("paneInnerTabs");
	    if (paneTabs != null)
	    {
	    	paneBorderDiv.className = "panebodyborder2";
	    }
	}

	// initialize the calendar object
	if (initCalendar)
	{
		StylerEMSS.initCalendarControl(wnd);
	}

	// override the window.alert and window.confirm functions so they launch a restyled dialog window
	if (typeof(wnd["DialogObject"]) == "function")
	{
		wnd.DialogObject.prototype.translateButton = function(btn, phrase, wnd)
		{
			wnd = wnd || window;
		
			if (typeof(btn) == "string")
			{	
				btn = wnd.document.getElementById(btn);
			}	
		
			if (!btn || !phrase)
			{	
				return;
			}
		
			if (typeof(window["getSeaPhrase"]) != null)
			{
				btn.value = getSeaPhrase(phrase.toUpperCase(), "ESS");
			}
			else
			{
				btn.value = this.getPhrase(phrase);
			}	
				 
			if (btn.innerText)
			{	
				btn.innerText = btn.value;
			}
			else if (btn.textContent)
			{
				btn.textContent = btn.value;
			}
			else
			{
				btn.innerHTML = btn.value;
			}
		};
	    
		wnd.seaAlert = function(msg, secondaryMsg, type, icon, alertCallbackFunc, submitOnEnter)
		{
 			if (typeof(type) == "undefined" || type == null)
			{
 				type = "ok";
			}
            	
			if (typeof(icon) == "undefined" || icon == null)
			{
				icon = "alert";
			}            
			
			alertCallbackFunc = alertCallbackFunc || null;
			submitOnEnter = (typeof(submitOnEnter) == "boolean") ? submitOnEnter : true;
			styler = (wnd.styler) ? wnd.styler : null;
            
			messageDialog = new wnd.DialogObject("/lawson/webappjs/", null, styler, true);
			messageDialog.pinned = true;
			messageDialog.messageBox(msg, type, icon, wnd, false, secondaryMsg, alertCallbackFunc, null, submitOnEnter);
		};

		wnd.seaConfirm = function(msg, secondaryMsg, confirmCallbackFunc, type, icon, submitOnEnter)
		{
			if (typeof(type) == "undefined" || type == null)
			{
 				type = "okcancel";
			}
            	
			if (typeof(icon) == "undefined" || icon == null)
			{
				icon = "question";
			}
            
			confirmCallbackFunc = confirmCallbackFunc || null;
			submitOnEnter = (typeof(submitOnEnter) == "boolean") ? submitOnEnter : true;			
			styler = (wnd.styler) ? wnd.styler : null;
            
			messageDialog = new wnd.DialogObject("/lawson/webappjs/", null, styler, true);
 			messageDialog.pinned = true;
			var msgObj = messageDialog.messageBox(msg, type, icon, wnd, false, secondaryMsg, confirmCallbackFunc, null, submitOnEnter);

			if (msgObj && typeof(msgObj) == "string")
			{
				// IE returns a string response indicating the user's choice
				return (msgObj == "ok" || msgObj == "continue");
			}

			// Non-IE browsers must wait for the callback function to be executed
			return null;
		};
		
		wnd.seaPageMessage = wnd.seaAlert;		
	}
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.postProcessDom = function(wnd)
{
	if (!wnd)
	{
		wnd = window;
	}
    // post-styling logic
    
	// disable classic table row highlighting functions
 	wnd.activateTableRow = function() {}
  	wnd.activateMultipleTableRow = function() {}
	wnd.deactivateTableRows = function() {}
	wnd.activateTableRow2 = function() {}
	wnd.deactivateTableRows = function() {}
           
	if (typeof(wnd.WindowColor) != "undefined")
	{
 		wnd.WindowColor = "transparent";
		wnd.BackgroundColor = "transparent";
 		wnd.BodybgColor = "transparent";
		wnd.ChartEmployeeDataColor = "#afc75c";
		wnd.ChartJobDataColor = "#465701";
		wnd.XIconOut = StylerEMSS.webappjsURL + "/infor/images/icn_delete_21x21_55595c_enabled.png";
		wnd.XIconOver = StylerEMSS.webappjsURL + "/infor/images/icn_delete_21x21_55595c_over.png";
		wnd.XIconActive = StylerEMSS.webappjsURL + "/infor/images/icn_delete_21x21_55595c_press.png";
 	}
 	
 	if (typeof(wnd.openImg) != "undefined" && typeof(wnd.closeImg) != "undefined")
 	{
		wnd.openImg = StylerEMSS.webappjsURL + "/infor/images/icn_collapseDown_21x21_55595c_enabled.png";
		wnd.openImgOver = StylerEMSS.webappjsURL + "/infor/images/icn_collapseDown_21x21_55595c_over.png";
		wnd.openImgActive = StylerEMSS.webappjsURL + "/infor/images/icn_collapseDown_21x21_55595c_press.png";
		if (this.textDir == "rtl")
		{
			wnd.closeImg = StylerEMSS.webappjsURL + "/infor/images/icn_expandLeft_21x21_55595c_enabled.png";
			wnd.closeImgOver = StylerEMSS.webappjsURL + "/infor/images/icn_expandLeft_21x21_55595c_over.png";
			wnd.closeImgActive = StylerEMSS.webappjsURL + "/infor/images/icn_expandLeft_21x21_55595c_press.png";		
		}
		else
		{
			wnd.closeImg = StylerEMSS.webappjsURL + "/infor/images/icn_expandRight_21x21_55595c_enabled.png";
			wnd.closeImgOver = StylerEMSS.webappjsURL + "/infor/images/icn_expandRight_21x21_55595c_over.png";
			wnd.closeImgActive = StylerEMSS.webappjsURL + "/infor/images/icn_expandRight_21x21_55595c_press.png";		
 		}
 	}
 	
 	if (typeof(wnd.ActivityDeleteIcon) != "undefined")
 	{
		wnd.ActivityDeleteIcon = StylerEMSS.webappjsURL + "/infor/images/icn_delete_21x21_55595c_enabled.png";
		wnd.ActivityDeleteIconOver = StylerEMSS.webappjsURL + "/infor/images/icn_delete_21x21_55595c_over.png";
		wnd.ActivityDeleteIconActive = StylerEMSS.webappjsURL + "/infor/images/icn_delete_21x21_55595c_press.png"; 		
 	}

	// insert the help icon into the title bar if help text exists
	if (wnd.document.getElementById("paneHelpIcon"))
	{
		var titleBarExists = false;
		var winRef = wnd;
					
		try
		{				
			// find the window that contains the title bar
			while (winRef != winRef.parent && !titleBarExists)
			{
				if (this.titleBarExists(winRef))
				{
					titleBarExists = true;
				}
				else
				{
					winRef = winRef.parent;
				}
			}
		}
		catch(e)
		{
			winRef = wnd;
		}
		
		if (this.titleBarExists(winRef))
		{
			titleBarExists = true;
		}
				
		if (titleBarExists)
		{			
			var helpFunc = wnd.document.getElementById("paneHelpIcon").onclick;		
			// make sure the proper window name is passed in as an argument to the help function
			if (helpFunc.toString().indexOf("parent.OpenHelpDialog") != -1 && typeof(wnd.parent["OpenHelpDialog"]) == "function")
			{
				window.helpDialogFuncRef = wnd.parent.OpenHelpDialog;
				window.helpDialogWndName = wnd.name;				
				helpFunc = function() 
				{
					try { wnd.parent.OpenHelpDialog(wnd.name); } catch(e) { window.helpDialogFuncRef(window.helpDialogWndName); }
				}	
			}
			else if (helpFunc.toString().indexOf("OpenHelpDialog") != -1 && typeof(wnd["OpenHelpDialog"]) == "function")
			{
				window.helpDialogFuncRef = wnd.OpenHelpDialog;
				window.helpDialogWndName = wnd.name;				
				helpFunc = function() 
				{ 
					try { wnd.OpenHelpDialog(wnd.name); } catch(e) { window.helpDialogFuncRef(window.helpDialogWndName); } 
				}	
			}			
			var toolTip = (typeof(window["getSeaPhrase"]) == "function") ? window.getSeaPhrase("HELP","ESS") : "Help";
			this.addTitleBarIcon(winRef, StylerEMSS.TITLE_BAR_HELP_ICON, null, toolTip);
			this.addTitleBarMenuItem(winRef, StylerEMSS.TITLE_BAR_HELP_ICON, toolTip, helpFunc);
 		}
	}
		
	// add onmousedown event to this window
	this.defineBodyOnmousedownStaticCall(wnd);
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.addTitleBarIcon = function(wnd, icon, iconClickFunc, toolTipText)
{
    StylerEMSS.baseMethod.addTitleBarIcon.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.removeTitleBarIcon = function(wnd, icon)
{
    StylerEMSS.baseMethod.removeTitleBarIcon.apply(this, arguments);
};

//-- Overidden base static methods --------------------------------------------
//
// Push button functions
//-----------------------------------------------------------------------------
StylerEMSS.pushButtonMouseOver = function(obj)
{
    StylerEMSS.baseStaticMethod.pushButtonMouseOver.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.pushButtonMouseOut = function(obj)
{
    StylerEMSS.baseStaticMethod.pushButtonMouseOut.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.pushButtonMousePress = function(obj)
{
    StylerEMSS.baseStaticMethod.pushButtonMousePress.apply(this, arguments);
};

//
// Tab control functions
//-----------------------------------------------------------------------------
StylerEMSS.setActiveTabControlTab = function(obj, wnd)
{
    StylerEMSS.baseStaticMethod.setActiveTabControlTab.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.getFirstCssClass = function(obj)
{
    return StylerEMSS.baseStaticMethod.getFirstCssClass.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.tabControlOnMouseOver = function(obj)
{
    StylerEMSS.baseStaticMethod.tabControlOnMouseOver.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.addTabControlHoverEffect = function(obj)
{
    StylerEMSS.baseStaticMethod.addTabControlHoverEffect.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.removeTabControlHoverEffect = function(obj)
{
    StylerEMSS.baseStaticMethod.removeTabControlHoverEffect.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.tabControlOnMouseOut = function(obj)
{
    StylerEMSS.baseStaticMethod.tabControlOnMouseOut.apply(this, arguments);
};

//
// List functions
//-----------------------------------------------------------------------------
StylerEMSS.highlightListRow = function(obj)
{
    StylerEMSS.baseStaticMethod.highlightListRow.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.unhighlightListRow = function(obj)
{
    StylerEMSS.baseStaticMethod.unhighlightListRow.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.fireLink = function(wnd, anchor)
{
    if (!wnd)
    {
    	wnd = window;
    }
	var hrefVal = anchor.getAttribute("href");
	var clickVal = anchor.getAttribute("onclick");
	if (hrefVal != null && hrefVal.indexOf("javascript:") == 0 && hrefVal != "javascript:" && hrefVal != "javascript:;")
	{
		hrefVal = hrefVal.substring(11, hrefVal.length);
		anchor.onclick = wnd.Function(hrefVal);
		anchor.onclick();
	}
	else if (clickVal != null)
	{
		anchor.onclick = wnd.Function(clickVal);
		anchor.onclick();		
	}
}

//-----------------------------------------------------------------------------
StylerEMSS.getLinkClick = function(wnd, anchor)
{
	wnd = wnd || window;
	if ((navigator.userAgent.indexOf("Firefox") != -1 && parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf("Firefox/") + 8)) >= 5)
	|| (!anchor.click && !anchor.onclick))
	{
		var hrefVal = anchor.getAttribute("href");
		var clickVal = anchor.getAttribute("onclick");
		if (hrefVal != null && hrefVal.indexOf("javascript:") == 0 && hrefVal != "javascript:" && hrefVal != "javascript:;")
		{
			hrefVal = hrefVal.substring(11, hrefVal.length);
			return wnd.Function(hrefVal);
		}
		else if (clickVal != null)
		{
			return wnd.Function(clickVal);		
		}
	}
	else if (anchor.onclick)
	{
		return anchor.onclick;
	}
	return null;
}

//-----------------------------------------------------------------------------
StylerEMSS.selectControlOnClick = function(obj, wnd)
{
    if (!wnd)
    {
    	wnd = window;
    }

    var selectAnchor = StylerEMSS.getNextSibling(obj.parentNode);

    if ((selectAnchor != null) && (selectAnchor.nodeName.toLowerCase() == "a"))
    {
    	if (navigator.userAgent.indexOf("Firefox") != -1 && parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf("Firefox/") + 8)) >= 5)
		{
			StylerEMSS.fireLink(wnd, selectAnchor);
		}
    	else if (selectAnchor.click)
    	{
    	    selectAnchor.click();
    	}
    	else if (selectAnchor.onclick)
    	{	
            selectAnchor.onclick();
        }
        else
        {
        	StylerEMSS.fireLink(wnd, selectAnchor);
        }
    }
};

//-----------------------------------------------------------------------------
StylerEMSS.searchControlOnClick = function(wnd, obj, evt)
{
    if (!wnd)
    {
        wnd = window;
    }

    var searchAnchor = StylerEMSS.getNextSibling(obj.parentNode);
    
    if (searchAnchor != null && searchAnchor.nodeName.toLowerCase() == "a")
    {
    	if (navigator.userAgent.indexOf("Firefox") != -1 && parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf("Firefox/") + 8)) >= 5)
		{
			StylerEMSS.fireLink(wnd, searchAnchor);
		}    
    	else if (searchAnchor.click)
    	{	
    	    searchAnchor.click();
    	}
    	else if (searchAnchor.onclick)
    	{	
            searchAnchor.onclick();
        }
        else
        {
            StylerEMSS.fireLink(wnd, searchAnchor);
        }    
    }                                       
};

//-----------------------------------------------------------------------------
StylerEMSS.expanderControlOnClick = function(obj, wnd)
{
    if (!wnd)
    {
    	wnd = window;
    }

    var links = obj.getElementsByTagName("a");
    
    if (links.length > 0)
    {
        var expAnchor = links[0];
    	if (navigator.userAgent.indexOf("Firefox") != -1 && parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf("Firefox/") + 8)) >= 5)
		{
			StylerEMSS.fireLink(wnd, expAnchor);
		}        
        else if (expAnchor.click)
        {
            expAnchor.click();
        }
        else if (expAnchor.onclick)
        {
            expAnchor.onclick();
        }
        else
        {
			StylerEMSS.fireLink(wnd, expAnchor);
        }        
    }
};

//-----------------------------------------------------------------------------
StylerEMSS.initCalendarControl = function(wnd)
{
	if (wnd.calObj == null && typeof(wnd["CalendarObject"]) == "function" && wnd.userWnd != null)
	{	
		var stylerObj = this;
		wnd.CalendarObject.prototype.translateLabels = function(func)
		{
			if (!func)
				return;

			// months
			this.monthNameAry[0] = func("JAN", "ESS");
			this.monthNameAry[1] = func("FEB", "ESS");
			this.monthNameAry[2] = func("MAR", "ESS");
			this.monthNameAry[3] = func("APR", "ESS");
			this.monthNameAry[4] = func("MAY", "ESS");
			this.monthNameAry[5] = func("JUN", "ESS");
			this.monthNameAry[6] = func("JUL", "ESS");
			this.monthNameAry[7] = func("AUG", "ESS");
			this.monthNameAry[8] = func("SEP", "ESS");
			this.monthNameAry[9] = func("OCT", "ESS");
			this.monthNameAry[10] = func("NOV", "ESS");
			this.monthNameAry[11] = func("DEC", "ESS");
			
			this.monthShortNameAry[0] = func("JAN_2", "ESS");
			this.monthShortNameAry[1] = func("FEB_2", "ESS");
			this.monthShortNameAry[2] = func("MAR_2", "ESS");
			this.monthShortNameAry[3] = func("APR_2", "ESS");
			this.monthShortNameAry[4] = func("MAY_2", "ESS");
			this.monthShortNameAry[5] = func("JUN_2", "ESS");
			this.monthShortNameAry[6] = func("JUL_2", "ESS");
			this.monthShortNameAry[7] = func("AUG_2", "ESS");
			this.monthShortNameAry[8] = func("SEP_2", "ESS");
			this.monthShortNameAry[9] = func("OCT_2", "ESS");
			this.monthShortNameAry[10] = func("NOV_2", "ESS");
			this.monthShortNameAry[11] = func("DEC_2", "ESS");
	
			// days
			this.dayNameAry[0] = func("SUN_2", "ESS");
			this.dayNameAry[1] = func("MON_2", "ESS");
			this.dayNameAry[2] = func("TUE_2", "ESS");
			this.dayNameAry[3] = func("WED_2", "ESS");
			this.dayNameAry[4] = func("THU_2", "ESS");
			this.dayNameAry[5] = func("FRI_2", "ESS");
			this.dayNameAry[6] = func("SAT_2", "ESS");
			
			// labels
			this.labelsAry[0] = func("TODAY", "ESS");
			this.labelsAry[1] = func("OK", "ESS");
			this.labelsAry[2] = func("CANCEL", "ESS");
		}		
		
		var sixDigitDateFmt = "";
		
		switch (wnd.userWnd.authUser.datefmt)
		{
			case "DDMMYYYY": sixDigitDateFmt = wnd.CalendarObject.DDMMYY;
				break;
			case "YYYYMMDD": sixDigitDateFmt = wnd.CalendarObject.YYMMDD;
				break;
			default: sixDigitDateFmt = wnd.CalendarObject.MMDDYY;
		}
		
		wnd.calObj = new wnd.CalendarObject(wnd, sixDigitDateFmt, wnd.userWnd.authUser.date_separator, wnd.userWnd.getSeaPhrase);
		wnd.calObj.styler = styler;
		if (wnd.userWnd && wnd.userWnd.authUser.calendar_type)
		{
			wnd.calObj.setType(wnd.userWnd.authUser.calendar_type);
		}
	}	
};

//-----------------------------------------------------------------------------
StylerEMSS.calendarControlOnClick = function(wnd, obj, evt)
{
    if (!wnd)
    {
        wnd = window;
    }

    // NOTE: You must have Calendar.js loaded from webappjs
    if (typeof(wnd["CalendarObject"]) != "function")
    {
        alert("ERROR: Cannot initialize CalendarObject. \n\n " +
              "StylerEMSS.calendarControlOnClick \n StylerEMSS.js");
        return;
    }

    // NOTE: You must have a variable called "calObj" declared
    // as a CalendarObject() from webappjs
    if (typeof(wnd.calObj) == "undefined" || wnd.calObj == null)
    {
    	StylerEMSS.initCalendarControl(wnd);
    }

    wnd.calObj.openDirection = wnd.CalendarObject.OPEN_DOWN;	

    var id = obj.getAttribute("for");
    
    if (id)
    {
    	var inputFld = wnd.document.getElementById(id);

    	if (inputFld)
    	{
    	    var dir = inputFld.getAttribute("styler_dir");
    	    if (dir == wnd.CalendarObject.OPEN_UP)
    	    	wnd.calObj.openDirection = wnd.CalendarObject.OPEN_UP;
    	    else if (dir == wnd.CalendarObject.OPEN_CENTER)
    	    	wnd.calObj.openDirection = wnd.CalendarObject.OPEN_CENTER;
    	    else if (dir == wnd.CalendarObject.OPEN_DOWN)
    	    	wnd.calObj.openDirection = wnd.CalendarObject.OPEN_DOWN;
    	    else if (dir == wnd.CalendarObject.OPEN_LEFT_DOWN)
    	    	wnd.calObj.openDirection = wnd.CalendarObject.OPEN_LEFT_DOWN;
    	    else if (dir == wnd.CalendarObject.OPEN_RIGHT_DOWN)
    	    	wnd.calObj.openDirection = wnd.CalendarObject.OPEN_RIGHT_DOWN;
    	    else if (dir == wnd.CalendarObject.OPEN_LEFT_UP)
    	    	wnd.calObj.openDirection = wnd.CalendarObject.OPEN_LEFT_UP;
    	    else if (dir == wnd.CalendarObject.OPEN_RIGHT_UP)
    	    	wnd.calObj.openDirection = wnd.CalendarObject.OPEN_RIGHT_UP;    	    
    	    else
    	    {
				var stylerObj = StylerEMSS._singleton;     	    
    	    	wnd.calObj.openDirection = wnd.CalendarObject.OPEN_LEFT_DOWN;
	    		var inputFldPos = wnd.PositionObject.getInstance(inputFld);
	    		var calendarHeight = (wnd.calObj.calendar.offsetHeight > 50) ? wnd.calObj.calendar.offsetHeight : 165;
	    		var calendarWidth = (wnd.calObj.calendar.offsetWidth > 50) ? wnd.calObj.calendar.offsetWidth : 200;
	            var topPos = inputFldPos.thetop + inputFldPos.height; 
	            var rightPos = inputFldPos.left + calendarWidth;
	            var leftPos = inputFldPos.left;
	    		if (stylerObj && stylerObj.textDir == "rtl")
	    			leftPos = inputFldPos.right - calendarWidth; 	            
	            var windowHeight = 768;
	    		var windowWidth = 1024;
	    
	            if (wnd.innerHeight)
	            { 
	                // non-IE browsers
	                windowHeight = wnd.innerHeight;
	                windowWidth = wnd.innerWidth;
	            }
	            else if (wnd.document && wnd.document.documentElement && wnd.document.documentElement.clientHeight)
	            {
	                // IE 6+ in "standards compliant mode"
	                windowWidth = wnd.document.documentElement.clientWidth;
	                windowHeight = wnd.document.documentElement.clientHeight;
	            }
	            else if (wnd.document && wnd.document.body && wnd.document.body.clientHeight)
	            {
	                // IE 6 in "quirks mode"
	                windowWidth = wnd.document.body.clientWidth;
	                windowHeight = wnd.document.body.clientHeight;
	            }    
	            
				var topSpace = inputFldPos.thetop;
				var bottomSpace = windowHeight - (topSpace + inputFldPos.height);
				if ((stylerObj && stylerObj.textDir == "rtl" && leftPos < 0)
				|| (rightPos > windowWidth))
				{
					wnd.calObj.openDirection = (bottomSpace >= calendarHeight || bottomSpace > topSpace) ? wnd.CalendarObject.OPEN_RIGHT_DOWN : wnd.CalendarObject.OPEN_RIGHT_UP;								
				}
				else
				{
					wnd.calObj.openDirection = (bottomSpace >= calendarHeight || bottomSpace > topSpace) ? wnd.CalendarObject.OPEN_LEFT_DOWN : wnd.CalendarObject.OPEN_LEFT_UP;
				}	            
    	    }    
        }        
    }    

    wnd.calObj.openCalendar(obj, evt);
};

//
// Combo box functions
//-----------------------------------------------------------------------------
StylerEMSS.selectComboBoxItem = function(evt, obj, open, highLight)
{
    StylerEMSS.baseStaticMethod.selectComboBoxItem.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.setSelectElementValue = function(objID, selIndex, selTxt, highLight)
{
    StylerEMSS.baseStaticMethod.setSelectElementValue.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.hilightComboBoxItem = function(obj)
{
    StylerEMSS.baseStaticMethod.hilightComboBoxItem.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.unhilightComboBoxItem = function(obj)
{
    StylerEMSS.baseStaticMethod.unhilightComboBoxItem.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.loadComboBox = function(obj)
{
    StylerEMSS.baseStaticMethod.loadComboBox.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.openComboBox = function(obj)
{
    StylerEMSS.baseStaticMethod.openComboBox.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.closeOpenControls = function(evt, wnd)
{
    return StylerEMSS.baseStaticMethod.closeOpenControls.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.isMouseOutsideComboBox = function(evt, comboBox)
{
    return StylerEMSS.baseStaticMethod.isMouseOutsideComboBox.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.collapseComboBox = function(evt, comboBox)
{
    StylerEMSS.baseStaticMethod.collapseComboBox.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.isMouseOutsideCalendar = function(evt, calObj)
{
    return StylerEMSS.baseStaticMethod.isMouseOutsideCalendar.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.collapseCalendar = function(evt, calObj)
{
    StylerEMSS.baseStaticMethod.collapseCalendar.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.closeComboBox = function(obj)
{
    StylerEMSS.baseStaticMethod.closeComboBox.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.toggleComboBox = function(wnd, evt, obj)
{
    StylerEMSS.baseStaticMethod.toggleComboBox.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.getComboBoxSelectedIndex = function(obj)
{
    return StylerEMSS.baseStaticMethod.getComboBoxSelectedIndex.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.getComboBoxHilightedIndex = function(obj)
{
    return StylerEMSS.baseStaticMethod.getComboBoxHilightedIndex.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.selectHilightedItem = function(evt, obj, highLight)
{
    StylerEMSS.baseStaticMethod.selectHilightedItem.apply(this, arguments);
};

//-----------------------------------------------------------------------------
StylerEMSS.doComboBoxOnKeyDown = function(evtArg)
{
    return StylerEMSS.baseStaticMethod.doComboBoxOnKeyDown.apply(this, arguments);
};

//
// Radio button functions
//-----------------------------------------------------------------------------
StylerEMSS.resetRadioButtons = function(formObj, radioNm)
{
    StylerEMSS.baseStaticMethod.resetRadioButtons.apply(this, arguments);
};