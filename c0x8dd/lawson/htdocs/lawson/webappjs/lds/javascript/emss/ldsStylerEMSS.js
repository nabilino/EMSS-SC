/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/lds/javascript/emss/ldsStylerEMSS.js,v 1.1.2.19.2.16 2014/02/18 16:42:38 brentd Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@10.00.05.00.12 Mon Mar 31 10:17:31 Central Daylight Time 2014 */
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
        case "calendaricon":
            this.processCalendarIconElement(wnd, theElement);
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
        case "uparrow":
             this.processUpArrowElement(wnd, theElement);
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
StylerEMSS.prototype.processSearchElement = function(wnd, theElement)
{
    // Return if already styled
    if (theElement.getAttribute("styledAs") == StylerEMSS.ElementTypeInputSearch)
    {
        return;
    }

    if (!wnd)
    {
        wnd = window;
    }

    var spanLeft = wnd.document.createElement("span");
    spanLeft.className = "inputBoxLeftSideStyler";
    if (theElement.disabled)
    {
        spanLeft.className += " disabledElementStyler";
    }
    spanLeft.appendChild(wnd.document.createTextNode("\u00a0"));

    var spanSrchBorder = wnd.document.createElement("span");
    spanSrchBorder.className = "searchBorderStyler";
    if (theElement.disabled)
    {
        spanSrchBorder.className += " disabledElementStyler";
    }

    var spanSrch = wnd.document.createElement("span");
    spanSrch.className = "searchStyler";
    if (theElement.disabled)
    {
        spanSrch.className += " disabledElementStyler";
    }

    if (!theElement.getAttribute("id"))
    {
        var nameAttr = theElement.getAttribute("name");
        theElement.setAttribute("id", nameAttr);
    }

    spanSrch.setAttribute("for", theElement.getAttribute("id"));
    spanSrch.appendChild(wnd.document.createTextNode("\u00a0"));

    if (!theElement.disabled)
    {
        spanSrch.onclick = function(evt)
        {
            if (!evt)
            {
                evt = wnd.event || wnd.Event;
            }

            StylerEMSS.searchControlOnClick(wnd, this, evt);
        };
    }

    spanSrchBorder.appendChild(spanSrch);

    var spanRight = wnd.document.createElement("span");
    spanRight.className = "inputBoxRightSideStyler";

    if (theElement.disabled)
    {
        spanRight.className += " disabledElementStyler";
    }

    spanRight.appendChild(wnd.document.createTextNode("\u00a0"));

    var newSpan = wnd.document.createElement("span");
    newSpan.className = "inputBoxWrapper";

    var oldChild = theElement.parentNode.replaceChild(newSpan, theElement);
    newSpan.insertBefore(spanRight, null);
    newSpan.insertBefore(spanSrchBorder, spanRight);
    newSpan.insertBefore(oldChild, spanSrchBorder);
    newSpan.insertBefore(spanLeft, oldChild);

    if (oldChild.className == "")
    {
        oldChild.className = "inputBoxStyler";
    }
    else
    {
        if (this.moreInfo)
        {
            alert("Replacing " +
                   oldChild.className +
                   "with inputBoxStyler");
            debugger;
        }
        oldChild.className = "inputBoxStyler";
    }

    if (theElement.disabled)
    {
        oldChild.className += " disabledElementStyler";
    }

    if (!document.all)
    {
    	if (navigator.userAgent.toLowerCase().indexOf('chrome') == -1)
    	{	
    		oldChild.style.marginTop = "1px";
    		oldChild.style.marginBottom = "1px";
    	}	
    }

    if (this.moreInfo)
    {
        this.elementWarnings(wnd, oldChild);
    }
    oldChild.setAttribute("styledAs", StylerEMSS.ElementTypeInputSearch);
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processGroupBoxElement = function(wnd, theElement)
{
    // Return if already styled
    if (theElement.getAttribute("styledAs") == StylerEMSS.ElementTypeDivGroupBox)
    {
        return;
    }

    if (!wnd)
    {
        wnd = window;
    }

    // check to see if this groupbox is contained inside a frame with a hard-coded width
    var staticWidth = false;
    try
    {
    	if (wnd.parent != wnd && wnd.name != "" && wnd.parent.document.getElementById(wnd.name))
    	{
    		var iFrm = wnd.parent.document.getElementById(wnd.name);
    		if (iFrm.style.width.toString().indexOf("px") >= 0)
    		{
    			staticWidth = true;
    		}
    	}
    }
    catch(e)
    {}

    // get the original element's dimensions
    var boxHeight = (theElement.offsetHeight) ? theElement.offsetHeight : 0;
    var boxWidth = (theElement.offsetWidth) ? theElement.offsetWidth : 0;

    // wrap the old div element with the group box divs
    var groupBoxDiv = this.createGroupBoxElement(wnd);
    var oldChild = theElement.parentNode.replaceChild(groupBoxDiv, theElement);
    //oldChild.removeAttribute("styler");

    var groupBoxDivs = groupBoxDiv.getElementsByTagName("div");
    for (var i=0; i<groupBoxDivs.length; i++)
    {
        if (groupBoxDivs[i].className == "groupBoxStyler")
        {           
            if (navigator.appName.indexOf("Microsoft") >= 0)
            {	
            	oldChild.style.height = "auto";
            }

		    // IE does not size the original element's dimensions properly after it has been appended to a group box.            
		    if (navigator.appName.indexOf("Microsoft") >= 0 || oldChild.style.height == "")
		    {
	            	// size the group box to the original element's dimensions
	            	if (boxHeight)
	            	{
	            	    oldChild.style.height = (boxHeight) + "px";
	            	    //groupBoxDivs[i].style.height = (boxHeight) + "px";
	            	}            	
		    }
		    else
		    {
		    	oldChild.style.height = "auto";	    
		    }

            oldChild.style.width = "auto";
            
            if (boxWidth && staticWidth)
            {
                oldChild.style.width = (boxWidth - 10) + "px";
                //groupBoxDivs[i].style.width = (boxWidth - 10) + "px";
            }
            else
            {
            	oldChild.style.width = "100%";
            	groupBoxDivs[i].style.width = "100%";
            }

            groupBoxDivs[i].appendChild(oldChild);            
            break;
        }
    }

    if (this.moreInfo)
    {
        alert("Replacing " +
              theElement.className +
              " with groupBoxStyler");
        debugger;
        this.elementWarnings(wnd, theElement);
    }
    oldChild.setAttribute("styledAs", StylerBase.ElementTypeDivGroupBox);
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processCalendarPrevArrowElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    var imgArrow = wnd.document.createElement("img");
    imgArrow.src = StylerEMSS.webappjsURL + "/lds/images/17_datepicker_arrow_left.png";
    imgArrow.style.verticalAlign = "middle";
    if (theElement.getAttribute("alt") != null)
    {
    	imgArrow.setAttribute("alt", theElement.getAttribute("alt")); 
    }    

    var calDiv = wnd.document.createElement("div");
    calDiv.className = "calendarArrow";
    calDiv.onmouseover = function()
    {
        this.className = "calendarArrowOver";
    }
    calDiv.onmouseout = function()
    {
        this.className = "calendarArrow";
    }
    calDiv.appendChild(imgArrow);

    if (theElement.parentNode.nodeName.toLowerCase() == "a")
    {
        theElement.parentNode.onmouseover = null;
        theElement.parentNode.onmouseout = null; 
        theElement.parentNode.onfocus = null;
        theElement.parentNode.onblur = null;  
        theElement.parentNode.removeAttribute("onmouseover");
        theElement.parentNode.removeAttribute("onmouseout");
        theElement.parentNode.removeAttribute("onfocus");
        theElement.parentNode.removeAttribute("onblur");
    }
    
    var oldChild = theElement.parentNode.replaceChild(calDiv, theElement);	
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processCalendarNextArrowElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }
    
    var imgArrow = wnd.document.createElement("img");
    imgArrow.src = StylerEMSS.webappjsURL + "/lds/images/17_datepicker_arrow_right.png";
    imgArrow.style.verticalAlign = "middle";
    if (theElement.getAttribute("alt") != null)
    {
    	imgArrow.setAttribute("alt", theElement.getAttribute("alt")); 
    }    

    var calDiv = wnd.document.createElement("div");
    calDiv.className = "calendarArrow";
    calDiv.onmouseover = function()
    {
        this.className = "calendarArrowOver";
    }
    calDiv.onmouseout = function()
    {
        this.className = "calendarArrow";
    }
    calDiv.appendChild(imgArrow);

    if (theElement.parentNode.nodeName.toLowerCase() == "a")
    {
        theElement.parentNode.onmouseover = null;
        theElement.parentNode.onmouseout = null;    
        theElement.parentNode.onfocus = null;
        theElement.parentNode.onblur = null;
        theElement.parentNode.removeAttribute("onmouseover");
        theElement.parentNode.removeAttribute("onmouseout");
        theElement.parentNode.removeAttribute("onfocus");
        theElement.parentNode.removeAttribute("onblur");        
    }
    
    var oldChild = theElement.parentNode.replaceChild(calDiv, theElement); 
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processCalendarIconElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    if (theElement.style.display == "none" || theElement.style.visibility == "hidden")
    {
    	return;
    }

    // hidden text box
    var textBox = wnd.document.createElement("input");
    textBox.setAttribute("styler", "hidden");
    textBox.className = "hiddenElementStyler";
    textBox.setAttribute("id", "hiddenCalendarStylerDate");
    textBox.setAttribute("name", "hiddenCalendarStylerDate");
    textBox.setAttribute("value", "");
    textBox.onchange = function()
    {
        StylerEMSS.hiddenCalendarDateChanged(window, this);
    }

    // calendar icon
    var imgCal = wnd.document.createElement("img");
    imgCal.src = StylerEMSS.webappjsURL + "/lds/images/17_datepicker_btncal_rest.png";
    if (theElement.getAttribute("alt") != null)
    {
    	imgCal.setAttribute("alt", theElement.getAttribute("alt")); 
    }
    if (theElement.getAttribute("id") != null)
    {
    	imgCal.setAttribute("id", theElement.getAttribute("id")); 
    }    
    if (theElement.getAttribute("name") != null)
    {
    	imgCal.setAttribute("name", theElement.getAttribute("name")); 
    }     
    
    var spanCal = wnd.document.createElement("span");
    spanCal.className = "calendarStyler";

    if (!theElement.getAttribute("id"))
    {
        var nameAttr = theElement.getAttribute("name");
        theElement.setAttribute("id", nameAttr);
    }

    spanCal.setAttribute("for", "hiddenCalendarStylerDate");
    spanCal.appendChild(imgCal);

    spanCal.onclick = function(evt)
    {
        if (!evt)
        {
            evt = wnd.event || wnd.Event;
        }
    
        StylerEMSS.calendarControlOnClick(wnd, this, evt);
    };    

    spanCal.onmouseover = function()
    {
        this.childNodes[0].src = StylerEMSS.webappjsURL + "/lds/images/17_datepicker_btncal_activ.png";
    };

    spanCal.onmouseout = function()
    {
        this.childNodes[0].src = StylerEMSS.webappjsURL + "/lds/images/17_datepicker_btncal_rest.png";
    };
    
    if (theElement.parentNode.nodeName.toLowerCase() == "a")
    {
        theElement.parentNode.parentNode.insertBefore(textBox, theElement.parentNode);
    	theElement.parentNode.onclick = function(evt)
    	{
            var spans = this.getElementsByTagName("span");
            for (var i=0; i<spans.length; i++)
            {
                if (spans[i].className != "" && spans[i].className.indexOf("calendarStyler") >= 0)
                {
                    spans[i].onclick();
                    break;
                }
            }
    	}
    	theElement.parentNode.setAttribute("href", "javascript:;");
    }
    else if (theElement.parentNode.parentNode.nodeName.toLowerCase() == "a")
    {
    	theElement.parentNode.parentNode.parentNode.insertBefore(textBox, theElement.parentNode.parentNode);
    	theElement.parentNode.parentNode.onclick = function()
    	{
            var spans = this.getElementsByTagName("span");
            for (var i=0; i<spans.length; i++)
            {
                if (spans[i].className != "" && spans[i].className.indexOf("calendarStyler") >= 0)
                {
                    spans[i].onclick();
                    break;
                }
            }    
    	}
    	theElement.parentNode.parentNode.setAttribute("href", "javascript:;");
    }
    else
    {
        theElement.parentNode.appendChild(textBox);
    }
    
    var oldChild = theElement.parentNode.replaceChild(spanCal, theElement);
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
            imgSrc = "/lds/images/multiple_entry_detail_red.png";
            break;
      case 0:
            imgSrc = "/lds/images/multiple_entry_detail_yellow.png";
            break;
      case 1:
            imgSrc = "/lds/images/multiple_entry_detail_green.png";
            break;
      default:
            imgSrc = "/lds/images/multiple_entry_detail.gif";
            break;
    }
    
    theElement.src = StylerEMSS.webappjsURL + imgSrc;
    theElement.setAttribute("orig_icon", theElement.src);
    theElement.setAttribute("border", "0");
    theElement.style.verticalAlign = "middle";
    
    if(imgColor == -1 || imgColor == 0 || imgColor == 1)
    {
		theElement.style.height = "16px";
		theElement.style.width = "16px";
		theElement.setAttribute("height", "16");
		theElement.setAttribute("width", "16");
    }
    else
    {
		theElement.style.height = "21px";
		theElement.style.width = "16px";
		theElement.setAttribute("height", "21");
		theElement.setAttribute("width", "16");
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
StylerEMSS.prototype.processDocumentIconElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    var activeIconAttribute = theElement.getAttribute("active_icon");
    var isActive = (activeIconAttribute != null && theElement.src.indexOf(activeIconAttribute) != -1);

    theElement.src = StylerEMSS.webappjsURL + "/lds/images/document_blank.png";
    theElement.setAttribute("orig_icon", theElement.src);
    theElement.style.height = "16px";
    theElement.style.width = "16px";
    theElement.setAttribute("height", "16");
    theElement.setAttribute("width", "16");
    theElement.setAttribute("border", "0");
    
    if (theElement.getAttribute("default_icon") != null)
    {
    	theElement.setAttribute("default_icon", StylerEMSS.webappjsURL + "/lds/images/document_blank.png");
    }
    
    if (activeIconAttribute != null)
    {
    	theElement.setAttribute("active_icon", StylerEMSS.webappjsURL + "/lds/images/document_content.png");
		if (isActive)
		{
		    theElement.src = StylerEMSS.webappjsURL + "/lds/images/document_content.png";
		}
    }
    
    var parNode = theElement.parentNode;
    if (parNode.nodeName.toLowerCase() == "a")
    {
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
StylerEMSS.prototype.processDownArrowElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }
    
    var imgArrow = wnd.document.createElement("img");
    if (theElement.getAttribute("id"))
    	imgArrow.setAttribute("id", theElement.getAttribute("id"));    
    imgArrow.src = StylerEMSS.webappjsURL + "/lds/images/07_scrollbar_arrow_down.png";
    imgArrow.style.verticalAlign = "middle";
    if (theElement.getAttribute("alt") != null)
    {
    	imgArrow.setAttribute("alt", theElement.getAttribute("alt")); 
    }    

    var arrowSpan = wnd.document.createElement("span");
    arrowSpan.className = "scrollbarArrowStyler";
    arrowSpan.appendChild(imgArrow);
    
    var oldChild = theElement.parentNode.replaceChild(arrowSpan, theElement); 
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processUpArrowElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }
    
    var imgArrow = wnd.document.createElement("img");
    imgArrow.src = StylerEMSS.webappjsURL + "/lds/images/07_scrollbar_up_down.png";
    imgArrow.style.verticalAlign = "middle";
    if (theElement.getAttribute("alt") != null)
    {
    	imgArrow.setAttribute("alt", theElement.getAttribute("alt")); 
    }    

    var arrowSpan = wnd.document.createElement("span");
    arrowSpan.className = "scrollbarArrowStyler";
    arrowSpan.appendChild(imgArrow);
    
    var oldChild = theElement.parentNode.replaceChild(arrowSpan, theElement); 
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processBarGraphIconElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    theElement.src = StylerEMSS.webappjsURL + "/lds/images/bar_graph.gif";
    theElement.style.height = "21px";
    theElement.style.width = "17px";
    theElement.setAttribute("height", "21");
    theElement.setAttribute("width", "17");
    theElement.setAttribute("border", "0");
    
    var parNode = theElement.parentNode;
    if (parNode.nodeName.toLowerCase() == "a")
    {
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

    theElement.src = StylerEMSS.webappjsURL + "/lds/images/activity-indicator_blue_transbg.gif";
    theElement.style.height = "22px";
    theElement.style.width = "42px";
    theElement.setAttribute("height", "22");
    theElement.setAttribute("width", "42");
    theElement.setAttribute("border", "0");
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processDeleteIconElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }
    
    theElement.src = StylerEMSS.webappjsURL + "/lds/images/18px-delete.png";
    theElement.style.height = "24px";
    theElement.style.width = "18px";
    theElement.style.verticalAlign = "bottom";
    theElement.setAttribute("height", "24");
    theElement.setAttribute("width", "18");
    theElement.setAttribute("border", "0");
    theElement.removeAttribute("styler");
   
	theElement.onmouseover = theElement.onfocus = theElement.onmousedown = function()
	{
		this.src = StylerEMSS.webappjsURL + "/lds/images/18px-delete-active.png";
	}    
	theElement.onmouseout = theElement.onblur = function()
	{
		this.src = StylerEMSS.webappjsURL + "/lds/images/18px-delete.png";
	}	
    
    var parNode = theElement.parentNode;
    if (parNode.nodeName.toLowerCase() == "a")
    {
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
        expAnchor.className = "hiddenElementStyler";    
    }
}

//-----------------------------------------------------------------------------
StylerEMSS.initTabControl = function(wnd, oldDiv)
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
        var contentId = tabId.replace(new RegExp('_TabBody_'), '_Body_');
        var contentDiv = wnd.document.getElementById(contentId);
		
        wnd.styler.addTab(wnd, tabControl, tabId, tabs[i].innerHTML, (tabs[i].className != "innertabbodyoff"), contentDiv);
	
		if (wnd.document.body.offsetHeight > 58)
		{
			contentDiv.style.height = (wnd.document.body.offsetHeight - 58) + "px";
		}	
        contentDiv.style.width = "auto";
    }
	
    wnd.document.getElementById("paneBody").className = "hiddenElementStyler";
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
        var contentId = tabId.replace(new RegExp('_TabBody_'), '_Body_');
        var contentDiv = wnd.document.getElementById(contentId);
		
        wnd.styler.addTab(wnd, tabControl, tabId, 
	    tabs[i].innerHTML, (tabs[i].className != "innertabbodyoff"),
	    contentDiv);
	
        contentDiv.style.height = (wnd.document.body.offsetHeight - 40) + "px";
        contentDiv.style.width = (wnd.document.body.offsetWidth - 20) + "px";
    }
	
    wnd.document.getElementById("paneBody").className = "hiddenElementStyler";

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
            StylerEMSS.performFunctionCallback(parWnd,
                                  tabControlId + "_OnClick",
                                  new Array(oldTab));            
        }
    }
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
		contentDiv.style.overflow = "visible";  
		var winHeight = 600;
		var winWidth = 800;
		if (typeof(wnd["getWinSize"]) == "function")
		{	
			var winObj = wnd.getWinSize(wnd);
			var winWidth = winObj[0];	
			var winHeight = winObj[1];			
		}
		contentDiv.style.height = winHeight + "px";		
    }
	
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

	wnd.uiNoPhotoPath = StylerEMSS.webappjsURL + "/lds/images/ic-user.gif";
        
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
					sib.className = "hiddenElementStyler";
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
					sib.className = "hiddenElementStyler";
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
	    
		wnd.seaAlert = function(msg, secondaryMsg, type, icon, alertCallbackFunc)
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
			styler = (wnd.styler) ? wnd.styler : null;
            
			messageDialog = new wnd.DialogObject("/lawson/webappjs/", null, styler, true);
			messageDialog.pinned = true;
			messageDialog.messageBox(msg, type, icon, wnd, false, secondaryMsg, alertCallbackFunc);
		};

		wnd.seaConfirm = function(msg, secondaryMsg, confirmCallbackFunc, type, icon)
		{
			if (typeof(type) == "undefined" || type == null)
			{
 				type = "okcancel";
			}
            	
			if (typeof(icon) == "undefined" || icon == null)
			{
				icon = "question";
			}
            
			styler = (wnd.styler) ? wnd.styler : null;
            
			messageDialog = new wnd.DialogObject("/lawson/webappjs/", null, styler, true);
 			messageDialog.pinned = true;
			var msgObj = messageDialog.messageBox(msg, type, icon, wnd, false, secondaryMsg, confirmCallbackFunc);

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
		wnd.XIconOut = StylerEMSS.webappjsURL + "/lds/images/ic-delete.gif";
		wnd.XIconOver = StylerEMSS.webappjsURL + "/lds/images/ic-delete.gif";
		wnd.XIconActive = StylerEMSS.webappjsURL + "/lds/images/ic-delete.gif";
 	}

 	if (typeof(wnd.openImg) != "undefined" && typeof(wnd.closeImg) != "undefined")
 	{
		wnd.openImg = StylerEMSS.webappjsURL + "/lds/images/04_treemenu_arrow_expand.png";
		wnd.openImgOver = wnd.openImg;
		wnd.openImgActive = wnd.openImg;
		wnd.closeImg = StylerEMSS.webappjsURL + "/lds/images/04_treemenu_arrow_coll.png";
		wnd.closeImgOver = wnd.closeImg;
		wnd.closeImgActive = wnd.closeImg;
 	}

	// insert the help icon into the title bar if help text exists
	if (wnd.document.getElementById("paneHelpIcon"))
	{
		var titleBarExists = false;
		var winRef = wnd;
					
		// find the window that contains the title bar
		try
		{
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
				helpFunc = function() { wnd.parent.OpenHelpDialog(wnd.name); }	
			}
			else if (helpFunc.toString().indexOf("OpenHelpDialog") != -1 && typeof(wnd["OpenHelpDialog"]) == "function")
			{
				helpFunc = function() { wnd.OpenHelpDialog(wnd.name); }	
			}                
			var toolTip = (typeof(window["getSeaPhrase"]) == "function") ? window.getSeaPhrase("HELP","ESS") : "";
			this.addTitleBarIcon(winRef, StylerEMSS.TITLE_BAR_HELP_ICON, helpFunc, toolTip);
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

    var inputBox = wnd.document.getElementById(obj.getAttribute("for"));
    var searchAnchor = StylerEMSS.getNextSibling(inputBox.parentNode);
    
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
	    		var inputFldPos = wnd.PositionObject.getInstance(inputFld);
	    		var calendarHeight = (wnd.calObj.calendar.offsetHeight > 50) ? wnd.calObj.calendar.offsetHeight : 165;
	            var topPos = inputFldPos.thetop + inputFldPos.height; 
	            var totalHeight = topPos + calendarHeight;
	            var windowHeight = 10000;
	    
	            if (wnd.innerHeight)
	            { 
	                // non-IE browsers
	                windowHeight = wnd.innerHeight;
	            }
	            else if (wnd.document && wnd.document.documentElement && wnd.document.documentElement.clientHeight)
	            {
	                // IE 6+ in "standards compliant mode"
	                windowHeight = wnd.document.documentElement.clientHeight;
	            }
	            else if (wnd.document && wnd.document.body && wnd.document.body.clientHeight)
	            {
	                // IE 6 in "quirks mode"
	                windowHeight = wnd.document.body.clientHeight;
	            }    
	    	
	            // will the calendar be clipped by the bottom edge of the window?
	            if (totalHeight > windowHeight)
	            {
	                // there is more room above the text box; display it above
	                if (topPos >= (windowHeight - topPos))
	                {
	            	    wnd.calObj.openDirection = wnd.CalendarObject.OPEN_UP;
	                }
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