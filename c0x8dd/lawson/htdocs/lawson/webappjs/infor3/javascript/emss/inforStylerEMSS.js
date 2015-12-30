/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/infor3/javascript/emss/Attic/inforStylerEMSS.js,v 1.1.2.75 2014/08/05 02:45:25 kevinct Exp $ */
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
StylerEMSS.prototype.translateCulture = function(wnd, func, culture)
{	
	if (!wnd)
	{
		wnd = window;
	}
	
	if (!func || func("OK","ESS") == "" || func("OK","ESS") == null)
		return;
	
	var culture = culture || wnd.Globalize.culture();
	var cal = culture.calendar;
	
	if (typeof(culture.isTranslated) != "undefined" && culture.isTranslated)
		return;	
	
	// don't override Arabic translations
	if (culture.name != "ar-SA")
	{	
		cal.days = 
		{
			// full day names
			names: [ func("SUN","ESS"), func("MON","ESS"), func("TUE","ESS"), func("WED","ESS"), func("THU","ESS"), func("FRI","ESS"), func("SAT","ESS") ],
			// abbreviated day names
			namesAbbr: [ func("SUN","ESS"), func("MON","ESS"), func("TUE","ESS"), func("WED","ESS"), func("THU","ESS"), func("FRI","ESS"), func("SAT","ESS") ],
			// shortest day names
			namesShort: [ func("SU","ESS"), func("MO","ESS"), func("TU","ESS"), func("WE","ESS"), func("TH","ESS"), func("FR","ESS"), func("SA","ESS") ]
		};
		cal.months = 
		{
			// full month names (13 months for lunar calendars -- 13th month should be "" if not lunar)
			names: [ func("JAN","ESS"), func("FEB","ESS"), func("MAR","ESS"), func("APR","ESS"), func("MAY","ESS"), func("JUN","ESS"), func("JUL","ESS"), func("AUG","ESS"), func("SEP","ESS"), func("OCT","ESS"), func("NOV","ESS"), func("DEC","ESS"), "" ],
			// abbreviated month names
			namesAbbr: [ func("JAN_2","ESS"), func("FEB_2","ESS"), func("MAR_2","ESS"), func("APR_2","ESS"), func("MAY_2","ESS"), func("JUN_2","ESS"), func("JUL_2","ESS"), func("AUG_2","ESS"), func("SEP_2","ESS"), func("OCT_2","ESS"), func("NOV_2","ESS"), func("DEC_2","ESS"), "" ]
		};
		culture.messages["Cancel"] = func("CANCEL","ESS");
		culture.messages["Next"] = func("NEXT","ESS");
		culture.messages["Ok"] = func("OK","ESS");
		culture.messages["Previous"] = func("PREVIOUS","ESS");
		culture.messages["Today"] = func("TODAY","ESS");
		culture.messages["Yes"] = func("YES","ESS");
		culture.messages["No"] = func("NO","ESS");
		culture.messages["Close"] = func("CLOSE","ESS");
		culture.messages["SelectDate"] = func("SELECT_DATE","ESS");
		culture.messages["More"] = func("MORE","ESS") + "...";
	}
	
	// custom messages needed for dialog buttons
	culture.messages["Stop"] = func("STOP","ESS");
	culture.messages["Continue"] = func("CONTINUE","ESS");
	culture.messages["Dialog"] = func("DIALOG","ESS");
	culture.isTranslated = true;
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.listSelectedRowsChanged = function(wnd, theElement, grid, rows)
{

};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.listRowOnClick = function(wnd, theElement, grid, row)
{

};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.listRowDrillDownOnClick = function(wnd, row)
{
	var anchor = null;
	for (var o in row)
	{	
		if (o.toString().indexOf("col") == 0 && row[o].toString().toLowerCase().indexOf("<a") >= 0)
		{
			var tmpElm = wnd.document.createElement("span");
			tmpElm.style.visibility = "hidden";
			tmpElm.innerHTML = row[o];
			var anchors = tmpElm.getElementsByTagName("a");
			if (anchors.length > 0)	
				anchor = anchors[0];
			break;
		}		
	}
	if (anchor)
	{
    	if (navigator.userAgent.indexOf("Firefox") != -1 && parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf("Firefox/") + 8)) >= 5)
		{
			StylerEMSS.fireLink(wnd, anchor);
		}
    	else if (anchor.click)
    	{
    	    anchor.click();
    	}
    	else if (anchor.onclick)
    	{	
            anchor.onclick();
        }
        else
        {
        	StylerEMSS.fireLink(wnd, anchor);
        }
	}
};

//-----------------------------------------------------------------------------
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
			drillAnchor.onclick = function() 
			{
		    	if (navigator.userAgent.indexOf("Firefox") != -1 && parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf("Firefox/") + 8)) >= 5)
					StylerEMSS.fireLink(wnd, anchors[0]);
		    	else if (anchors[0].click)
		    		anchors[0].click();
		    	else if (anchors[0].onclick)
		    		anchors[0].onclick();
		        else
		        	StylerEMSS.fireLink(wnd, anchors[0]);			
				return false;
			};
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
StylerEMSS.prototype.processGroupBoxElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }		

    // get the label    
    var label = "";  
    var hdrLevel = "1";
    var paneHeader = wnd.document.getElementById("paneHeader");
    if (paneHeader)
    {   	
    	label = (paneHeader.innerText) ? paneHeader.innerText : ((paneHeader.textContent) ? paneHeader.textContent : "");
    	hdrLevel = (paneHeader.getAttribute("role") == "heading") ? paneHeader.getAttribute("aria-level") : "1";
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
    	var classNm = theElement.parentNode.parentNode.className;
    	if (classNm && classNm.toString().indexOf("inforFieldSet") >= 0)
    	{ 
    		this.setGroupBoxElementLabel(theElement.parentNode.parentNode, label);
        }
        return;
    }

    options = options || {};
    
    var opts = {
    	collapsible: false,
    	divider: false,
    	initialState: 'open'
    };
    
    var o = wnd.$.extend({}, opts, options); //extend the options if any provided
    
	var fieldSetDiv = this.createGroupBoxElement(wnd, label, options);
	var oldChild = theElement.parentNode.replaceChild(fieldSetDiv, theElement);
	var ariaLvl = hdrLevel;
	try { ariaLvl = (wnd.frameElement && wnd.frameElement.getAttribute("level") != null) ? wnd.frameElement.getAttribute("level") : hdrLevel; } catch(e) { ariaLvl = hdrLevel; }
	wnd.$(fieldSetDiv, wnd.document).find('.inforFieldSetLabel').attr('role','heading').attr('aria-level',ariaLvl);
	var fieldSetDivs = fieldSetDiv.getElementsByTagName("div");
	var len = fieldSetDivs.length;
    for (var i=0; i<len; i++)
    {
        if (fieldSetDivs[i].className == "content")
        {
            fieldSetDivs[i].appendChild(oldChild);
            break;
        }
    }   
    
    wnd.$(function ()
    {    
    	wnd.$(fieldSetDiv, wnd.document).inforFieldSet(o);
    });
    
    oldChild.setAttribute("styledAs", StylerBase.ElementTypeDivGroupBox);
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processImageElement = function(wnd, theElement, options)
{
    var stylerAttribute = theElement.getAttribute("styler");

    switch (stylerAttribute)
    {
        case "prevcalendararrow":
            this.processCalendarPrevArrowElement(wnd, theElement, options);
            break;        
        case "nextcalendararrow":
            this.processCalendarNextArrowElement(wnd, theElement, options);
            break;
        case "multipleentrydetailicon":
            this.processMultipleEntryDetailIconElement(wnd, theElement, options);
            break;
        case "documenticon":
            this.processDocumentIconElement(wnd, theElement, options);
            break;   
        case "downarrow":
            this.processDownArrowElement(wnd, theElement, options);
            break;
        case "bargraphicon":
            this.processBarGraphIconElement(wnd, theElement, options);
            break; 
        case "activityicon":
            this.processActivityIconElement(wnd, theElement, options);
            break;
        case "checkmarkicon":
            this.processCheckmarkIconElement(wnd, theElement, options);
            break;  
        case "deleteicon":
            this.processDeleteIconElement(wnd, theElement, options);
            break;            
        default:
            StylerEMSS.baseMethod.processImageElement.apply(this, arguments);
            break;
    }
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processAsteriskElement = function(wnd, theElement, options)
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

    // If next to a control, let the control style itself as required
    var elmRef = wnd.$(theElement, wnd.document);
    if (elmRef.siblings("[styler]").length > 0)
    {
    	elmRef.attr("class", "inforHiddenCustom");
    	return;
    }
    
    theElement.className = "inforRequiredIndicator";
    theElement.style.marginLeft = "0px";
    theElement.style.marginRight = "0px";
	theElement.style.position = "relative";
	theElement.style.top = "0px";	
	if (this.textDir == "rtl")
	{	
		if (theElement.parentNode.className != "panefooter")
		{	
			theElement.style.marginLeft = "-8px";
			theElement.style.float = "right";
		}	
	}	
	else
		theElement.style.float = "left";
    if (theElement.childNodes.length > 0 && theElement.childNodes[0].tagName.toLowerCase() == "img")
    	var oldChild = theElement.replaceChild(wnd.document.createTextNode("\u00a0"), theElement.childNodes[0]);		
	var parNode = null;
	if (theElement.parentNode.nodeName.toLowerCase() == "td" || theElement.parentNode.nodeName.toLowerCase() == "th")
		parNode = theElement.parentNode;    
	else if (theElement.parentNode.parentNode.nodeName.toLowerCase() == "td" || theElement.parentNode.parentNode.nodeName.toLowerCase() == "th")
		parNode = theElement.parentNode;
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
		parNode.style.whiteSpace = "nowrap";
		parNode.style.verticalAlign = "top";
		if (firstChild != null)		
			parNode.insertBefore(theElement, firstChild);
		else	
			parNode.appendChild(theElement);	
	}
	//label for screen readers
	theElement.setAttribute("title", "Required");
	theElement.setAttribute("aria-label", "Required");
    if (this.moreInfo)
    {
        this.elementWarnings(wnd, theElement);
    }

    theElement.setAttribute("styledAs", StylerBase.ElementTypeAsterisk);
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processCalendarPrevArrowElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }

    if (theElement.parentNode.nodeName.toLowerCase() == "a")
    {
    	theElement.parentNode.style.border = "none";
    	if (this.textDir == "rtl")
    		theElement.parentNode.style.marginLeft = "5px";
		else
    		theElement.parentNode.style.marginRight = "5px";
        theElement.parentNode.onmouseover = null;
        theElement.parentNode.onmouseout = null; 
        theElement.parentNode.onfocus = null;
        theElement.parentNode.onblur = null;
        theElement.parentNode.removeAttribute("onmouseover");
        theElement.parentNode.removeAttribute("onmouseout");
        theElement.parentNode.removeAttribute("onfocus");
        theElement.parentNode.removeAttribute("onblur");        
    }    
       
    var prevBtn = wnd.document.createElement("button");
    prevBtn.setAttribute("type", "button");
    prevBtn.setAttribute("role", "button");
    prevBtn.className = "inforIconButton previous";
    prevBtn.onclick = null;
    prevBtn.appendChild(wnd.document.createElement("span"));
    
    var titleTxt = "Previous";
    if (theElement.getAttribute("alt") != null && theElement.getAttribute("title") == null)
    	theElement.setAttribute("title", theElement.getAttribute("alt"));
    if (theElement.getAttribute("title") != null)
    	titleStr = theElement.getAttribute("title");
    
    prevBtn.setAttribute("title", titleTxt);
	//label for screen readers
    prevBtn.setAttribute("aria-label", titleTxt);    
    var oldChild = theElement.parentNode.replaceChild(prevBtn, theElement); 
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processCalendarNextArrowElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }
    
    if (theElement.parentNode.nodeName.toLowerCase() == "a")
    {
    	theElement.parentNode.style.border = "none";
    	if (this.textDir == "rtl")
    		theElement.parentNode.style.marginRight = "5px";
    	else    	
    		theElement.parentNode.style.marginLeft = "5px";
        theElement.parentNode.onmouseover = null;
        theElement.parentNode.onmouseout = null;
        theElement.parentNode.onfocus = null;
        theElement.parentNode.onblur = null;     
        theElement.parentNode.removeAttribute("onmouseover");
        theElement.parentNode.removeAttribute("onmouseout");
        theElement.parentNode.removeAttribute("onfocus");
        theElement.parentNode.removeAttribute("onblur");        
    }    
       
    var nextBtn = wnd.document.createElement("button");
    nextBtn.setAttribute("type", "button");
    nextBtn.setAttribute("role", "button");
    nextBtn.className = "inforIconButton next";
    nextBtn.onclick = null;
    nextBtn.appendChild(wnd.document.createElement("span"));
    
    var titleTxt = "Next";
    if (theElement.getAttribute("alt") != null && theElement.getAttribute("title") == null)
    	theElement.setAttribute("title", theElement.getAttribute("alt"));
    if (theElement.getAttribute("title") != null)
    	titleTxt = theElement.getAttribute("title");    
    
    nextBtn.setAttribute("title", titleTxt);
	//label for screen readers
    nextBtn.setAttribute("aria-label", titleTxt);      
    var oldChild = theElement.parentNode.replaceChild(nextBtn, theElement);
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processMultipleEntryDetailIconElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }

    var activeIconAttribute = theElement.getAttribute("active_icon");
    var isActive = (activeIconAttribute != null && theElement.src.indexOf(activeIconAttribute) != -1);
    var imgSrc;
    var imgColor = parseInt(theElement.getAttribute("image_color")); 
    
    switch (imgColor)
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
    
    if (theElement.getAttribute("alt") != null && theElement.getAttribute("title") == null)
    	theElement.setAttribute("title", theElement.getAttribute("alt"));    
    
    if (imgColor == -1 || imgColor == 0 || imgColor == 1)
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
    	theElement.setAttribute("default_icon", StylerEMSS.webappjsURL + imgSrc);
    
    if (activeIconAttribute)
    {
    	theElement.setAttribute("active_icon", StylerEMSS.webappjsURL + imgSrc);
    	if (isActive)
    	    theElement.src = StylerEMSS.webappjsURL + imgSrc;
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
    	parNode.parentNode.style.textAlign = "center";     
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processDocumentIconElement = function(wnd, theElement, options)
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
    
    if (theElement.getAttribute("alt") != null && theElement.getAttribute("title") == null)
    	theElement.setAttribute("title", theElement.getAttribute("alt"));   
    
    if (theElement.getAttribute("default_icon") != null)
    	theElement.setAttribute("default_icon", StylerEMSS.webappjsURL + "/infor/images/icon_comment_empty_rest.png");
    
    if (activeIconAttribute != null)
    {
    	theElement.setAttribute("active_icon", StylerEMSS.webappjsURL + "/infor/images/icon_comment_rest.png");
		if (isActive)
		    theElement.src = StylerEMSS.webappjsURL + "/infor/images/icon_comment_rest.png";
    }
    
    theElement.onmouseover = theElement.onfocus = function()
    {
    	if (this.src.indexOf("icon_comment_empty") != -1)
    		this.src = StylerEMSS.webappjsURL + "/infor/images/icon_comment_empty_hover.png";
    	else
    		this.src = StylerEMSS.webappjsURL + "/infor/images/icon_comment_hover.png";
    };
    theElement.onmousedown = theElement.onkeydown = function()
    {
    	if (this.src.indexOf("icon_comment_empty") != -1)
    		this.src = StylerEMSS.webappjsURL + "/infor/images/icon_comment_empty_pressed.png"; 
    	else
    		this.src = StylerEMSS.webappjsURL + "/infor/images/icon_comment_pressed.png";   
    };
    theElement.onmouseout = theElement.onblur = function()
    {
    	if (this.src.indexOf("icon_comment_empty") != -1)
    		this.src = StylerEMSS.webappjsURL + "/infor/images/icon_comment_empty_rest.png"; 
    	else
    		this.src = StylerEMSS.webappjsURL + "/infor/images/icon_comment_rest.png";   
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
    	parNode.parentNode.style.textAlign = "center";
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processDownArrowElement = function(wnd, theElement, options)
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
    	imgArrow.setAttribute("title", theElement.getAttribute("alt"));
    }    
	imgArrow.onmouseover = imgArrow.onfocus = function()
	{
		this.src = StylerEMSS.webappjsURL + "/infor/images/icn_arrow-down_7x5_over_gray555555.png";
	}
	imgArrow.onmousedown = imgArrow.onkeydown = function()
	{
		this.src = StylerEMSS.webappjsURL + "/infor/images/icn_arrow-down_7x5_press_gray666666.png";
	}
	imgArrow.onmouseout = imgArrow.onblur = function()
	{
		this.src = StylerEMSS.webappjsURL + "/infor/images/icn_arrow-down_7x5_enabled_gray999999.png";
	}
	
	var oldChild = theElement.parentNode.replaceChild(imgArrow, theElement);   
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processBarGraphIconElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }
    
    theElement.src = StylerEMSS.webappjsURL + "/infor3/images/bar.png";
    theElement.style.height = "16px";
    theElement.style.width = "16px";
    theElement.setAttribute("height", "16");
    theElement.setAttribute("width", "16");
    theElement.setAttribute("border", "0");
    if (theElement.getAttribute("alt") != null && theElement.getAttribute("title") == null)
    	theElement.setAttribute("title", theElement.getAttribute("alt"));    
	theElement.onmouseover = theElement.onfocus = function()
	{
		this.src = StylerEMSS.webappjsURL + "/infor3/images/bar_hover.png";
	}
	theElement.onmouseout = theElement.onblur = function()
	{
		this.src = StylerEMSS.webappjsURL + "/infor3/images/bar.png";
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
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processActivityIconElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }
    
    theElement.src = StylerEMSS.webappjsURL + "/infor3/css/base/images/infor_ajax-loader_32x32.gif";
    theElement.style.height = "32px";
    theElement.style.width = "32px";
    theElement.setAttribute("height", "32");
    theElement.setAttribute("width", "32");
    theElement.setAttribute("border", "0");
    if (theElement.getAttribute("alt") != null && theElement.getAttribute("title") == null)
    	theElement.setAttribute("title", theElement.getAttribute("alt"));    
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processCheckmarkIconElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }
    
    theElement.src = StylerEMSS.webappjsURL + "/infor3/images/20x20_ok.png";
    theElement.style.height = "20px";
    theElement.style.width = "20px";
    theElement.setAttribute("height", "20");
    theElement.setAttribute("width", "20");
    theElement.setAttribute("border", "0");
    if (theElement.getAttribute("alt") != null && theElement.getAttribute("title") == null)
    	theElement.setAttribute("title", theElement.getAttribute("alt"));    
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.processDeleteIconElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }
    
    var deleteBtn = wnd.document.createElement("button");   
    deleteBtn.setAttribute("type", "button");
    deleteBtn.className = "inforIconButton reject";
    deleteBtn.appendChild(wnd.document.createElement("span"));
	
    var titleTxt = "Delete";
    if (theElement.getAttribute("alt") != null && theElement.getAttribute("title") == null)
    	theElement.setAttribute("title", theElement.getAttribute("alt"));
    if (theElement.getAttribute("title") != null)
    	titleTxt = theElement.getAttribute("title");
    
    deleteBtn.setAttribute("title", titleTxt);
	//label for screen readers
    deleteBtn.setAttribute("aria-label", titleTxt);      
	var oldChild = theElement.parentNode.replaceChild(deleteBtn, theElement);
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
        expAnchor.className = "inforHiddenCustom";    
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
        var tabText = (tabs[i].innerText) ? tabs[i].innerText : ((tabs[i].textContent) ? tabs[i].textContent : "");
        var contentId = tabId.replace(new RegExp('_TabBody_'), '_Body_');
        var contentDiv = wnd.document.getElementById(contentId);
		
        wnd.styler.addTab(wnd, tabControl, tabId, tabText, (tabs[i].className != "innertabbodyoff"), contentDiv);		
    }
	
    wnd.document.getElementById("paneBody").className = "inforHiddenCustom";
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
            if (uls[i].className && uls[i].className.indexOf("inforTabset") >= 0)
            {
                ul = uls[i];
            }
            i++;
        }
    		
        if (ul != null)
        {
            var anchors = ul.getElementsByTagName("a");
            for (var j=0; j<anchors.length; j++)
            {
                if (anchors[j].getAttribute("href") == ("#" + tabId))
                {
                    StylerEMSS.setActiveTabControlTab(anchors[j].parentNode, wnd);	
                    if (typeof(wnd[tabControlId]) != "undefined")
                    	wnd[tabControlId].activetab = j;
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
    }
	
    wnd.document.getElementById("paneBody").className = "inforHiddenCustom";

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
            if (uls[i].className && uls[i].className.indexOf("inforTabset") >= 0)
            {
                ul = uls[i];
            }
            i++;
        }

        if (ul != null)
        {
            var anchors = ul.getElementsByTagName("a");
            for (var j=0; j<anchors.length; j++)
            {
                if (anchors[j].getAttribute("href") == ("#" + tabId))
                {
                    StylerEMSS.setActiveTabControlTab(anchors[j].parentNode, wnd);	
                    break;
                }
	    	}	
        }   	
    };
    
    wnd.deactivateTab = function() {};    
    wnd.tabOnClick = wnd.activateTab;  
    
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
	var tabId = null;
    var anchors = tabObj.getElementsByTagName("a");
    if (anchors.length > 0)
    {
    	var hash = anchors[0].getAttribute("href");
    	tabId = hash.substring(1, hash.length);
	}
    if (!tabId)
    	return;
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
    }
    
    wnd.CallBack_Tabs = function() {};
    wnd.activateTab = function() {};
    wnd.deactivateTab = function() {};
    
    wnd.tabOnClick = function(tabContent)
    {		
        var tabId = tabContent.getAttribute("id");
        var tabControl = tabContent.parentNode;   
        var tabControlId = tabControl.getAttribute("id");
		
        var uls = tabControl.getElementsByTagName("ul");
        var ul = null;
        var i = 0;
        while (i < uls.length && ul == null)
        {
            if (uls[i].className && uls[i].className.indexOf("inforTabset") >= 0)
            {
                ul = uls[i];
            }
            i++;
        }
    		
        if (ul != null)
        { 	
            var anchors = ul.getElementsByTagName("a");
            for (var j=0; j<anchors.length; j++)
            {
            	if (anchors[j].getAttribute("href") == ("#" + tabId))
                {
            		StylerEMSS.setActiveTabControlTab(anchors[j].parentNode, wnd);
                    if (typeof(wnd[tabControlId]) != "undefined")
                    	wnd[tabControlId].activetab = j;                    
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
StylerEMSS.onLoadTabControlTabCM = function(wnd, tabObj)
{
	var tabId = null;
	var tabLink = null;
    var anchors = tabObj.getElementsByTagName("a");
    if (anchors.length > 0)
    {
    	tabLink = anchors[0];
    	var hash = tabLink.getAttribute("href");
    	tabId = hash.substring(1, hash.length);
	}
    if (!tabId)
    	return;
    var tabIdParams = tabId.split("_"); 
    // call the Career Management tab onclick method
    if (tabIdParams.length > 1)
    {
        var tabName = tabIdParams[0];
        var tabCode = (tabIdParams.length >= 2) ? tabIdParams[tabIdParams.length-2] : null;
        var tabArg = (tabIdParams.length >= 3) ? tabIdParams[tabIdParams.length-3] : null;
        var parWnd = wnd.parent;
        var funcExists = (typeof(parWnd["OnTabClicked_" + tabName]) == "function");
        if (!funcExists && tabIdParams.length > 3)
        {
        	if (typeof(parWnd["OnTabClicked_" + tabName + "_" + tabIdParams[1]]) == "function")
        	{
        		funcExists = true;
        		tabName = tabName + "_" + tabIdParams[1];
        	}	
        }
        if (funcExists)
        {
        	var argAry = (tabIdParams.length > 3) ? new Array(tabCode, tabArg) : new Array(tabCode);
        	// if the user clicks a main tab, reset the sub tabs
        	if (tabName == "MainTabs")
        	{
        		var tmpAry = new Array();
        		if (parWnd.ActiveTabRegistry["MainTabs"])
        			tmpAry["MainTabs"] = parWnd.ActiveTabRegistry["MainTabs"];
            	parWnd.ActiveTabRegistry = tmpAry;
        	}	
            parWnd.TabsLoaded = function()
            {
            	if (typeof(parWnd.ActiveTabRegistry) == "undefined")
            		parWnd.ActiveTabRegistry = new Array();
            	parWnd.ActiveTabRegistry[tabName] = tabId;           	
	            for (var tName in parWnd.ActiveTabRegistry)
	            {   
	            	// select the active tabs but don't fire load events
	            	var tid = parWnd.ActiveTabRegistry[tName];
            		var tabContent = parWnd.main.document.getElementById(tid);
            		if (tabContent)
            		{
            	        var tabControl = tabContent.parentNode;   
            	        var tabControlId = tabControl.getAttribute("id");
            	        var uls = tabControl.getElementsByTagName("ul");
            	        var ul = null;
            	        var i = 0;
            	        while (i < uls.length && ul == null)
            	        {
            	            if (uls[i].className && uls[i].className.indexOf("inforTabset") >= 0)
            	                ul = uls[i];
            	            i++;
            	        }	
	                    if (ul != null)
	                    {
	                        var anchors = ul.getElementsByTagName("a");
	                        for (var j=0; j<anchors.length; j++)
	                        {
	                        	var tab = anchors[j].parentNode;
	                            if (anchors[j].getAttribute("href") == ("#" + tid))
	                            {
	                                tab.className = "ui-tabs-selected ui-state-active";
	                                if (typeof(wnd[tabControlId]) != "undefined")
	                                	wnd[tabControlId].activetab = j;
	                            }
	                            else
	                            	tab.className = "";
	            	    	}	
	                    }
            		}	            	
	            } 	                       	
            }
            setTimeout(function() { StylerEMSS.performFunctionCallback(parWnd, "OnTabClicked_" + tabName, argAry); }, 5);
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
    	obj.setAttribute("styler_sort", "ascending");
    StylerEMSS.baseMethod.addSortArrow.apply(this, arguments);
    
    var anchorList = obj.getElementsByTagName("a");
    for (var j=0; j<anchorList.length; j++)
    {
        var anchorElm = anchorList[j];
        if (anchorElm.getAttribute("onclick") != null)
        {
        	var toolTip = anchorElm.getAttribute("title");
        	if (toolTip != null)
        	{
				if (typeof(wnd["findPhraseWnd"]) == "function")
				{
					var phraseWnd = wnd.findPhraseWnd(wnd);
					if (phraseWnd)	
					{
		        		toolTip = toolTip.split(" - ")[0];
		        		if (obj.getAttribute("styler_sort") == "descending")
		        			toolTip += ' - ' + phraseWnd.getSeaPhrase("DESC","SEA") + ' - ' + phraseWnd.getSeaPhrase("SORT_ASC","SEA");
		        		else
		        			toolTip += ' - ' + phraseWnd.getSeaPhrase("ASC","SEA") + ' - ' + phraseWnd.getSeaPhrase("SORT_DESC","SEA");
		        		anchorElm.setAttribute("title", toolTip);
		        		anchorElm.setAttribute("aria-label", toolTip);						
					}	
				}
        	}    	
	        if (anchorElm.click)
	        {
	        	anchorElm.click();
	        }
	        else if (anchorElm.onclick)
	        {
	        	anchorElm.onclick();
	        }
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
	
	var clickAttr = obj.getAttribute("styler_click");
    var anchorList = obj.getElementsByTagName("a");      
    for (var j=0; j<anchorList.length; j++)
    {
        var anchorElm = anchorList[j];
        //when a link is clicked, prevent event from propagating to the th
    	wnd.$(anchorElm, wnd).click(function(e) {
            e.stopPropagation(); 
        });		    
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
    if (!wnd)
    {
        wnd = window;
    }

    if (theElement.getAttribute("styledAs") != StylerBase.ElementTypeComboBox)
    	return;
    
    wnd.$(function ()
    {   	
    	wnd.$(theElement, wnd.document).next().find(".inforDropDownListButton").trigger(eventNm);
    });  
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.preProcessDom = function(wnd)
{
	if (!wnd)
	{
		wnd = window;
	}

	wnd.uiNoPhotoPath = StylerEMSS.webappjsURL + "/infor3/images/icon_person.png";
        
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
					elms[i].setAttribute("data-tooltip-maxwidth", "100"); 
					sib.setAttribute("styler", "hidden");
					sib.className = "inforHidden";
					var toolTip = "Display calendar";
					if (typeof(wnd["findPhraseWnd"]) == "function")
					{
						var phraseWnd = findPhraseWnd(wnd);
						if (phraseWnd)	
							toolTip = phraseWnd.getSeaPhrase("DISPLAY_CAL","ESS");	
					}
					sib.setAttribute("aria-label", toolTip);
					sib.setAttribute("title", toolTip);					
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
					elms[i].setAttribute("data-tooltip-maxwidth", "100");
					elms[i].setAttribute("styler_click", "StylerEMSS.selectControlOnClick");
					sib.setAttribute("styler", "hidden");
					sib.className = "inforHidden";
					var toolTip = "Select a value";
					if (typeof(wnd["findPhraseWnd"]) == "function")
					{
						var phraseWnd = findPhraseWnd(wnd);
						if (phraseWnd)	
							toolTip = phraseWnd.getSeaPhrase("SELECT_VALUE","ESS");	
					}
					sib.setAttribute("aria-label", toolTip);
					sib.setAttribute("title", toolTip);						
					for (var j=0; j<selImgs.length; j++)
					{	
						selImgs[j].setAttribute("alt", toolTip);
						selImgs[j].setAttribute("title", toolTip);
					}
				}           		
			}
		}
	}

	// style all hyperlinks
	elms = this.getLikeElements(wnd, "a", "", "");
	len = elms.length;
	for (i = 0; i < len; i++)
	{
		if (elms[i].getAttribute("styledAs") != StylerEMSS.ElementTypeHyperlink && elms[i].getAttribute("styledAs") != StylerBase.ElementTypeHidden && !elms[i].getAttribute("styler"))
		{
			if (elms[i].childNodes.length > 0)
			{	
				elms[i].setAttribute("styler", "hyperlink");
				elms[i].setAttribute("role", "link");
			}	
		}            
	}	
	
	// style all radio buttons
	elms = this.getLikeElements(wnd, "input", "type", "radio");
	len = elms.length;
	for (i = 0; i < len; i++)
	{
		if (elms[i].getAttribute("styler") == null && elms[i].getAttribute("styledAs") != StylerEMSS.ElementTypeInputRadio)
		{
			elms[i].setAttribute("styler", "radio");
			elms[i].setAttribute("role", "radio");
			elms[i].setAttribute("data-tooltip-maxwidth", "100");
		}            
	}
        
	// style all checkboxes
	elms = this.getLikeElements(wnd, "input", "type", "checkbox");
	len = elms.length;
	for (i = 0; i < len; i++)
	{
		if (elms[i].getAttribute("styler") == null && elms[i].getAttribute("styledAs") != StylerEMSS.ElementTypeInputCheckbox)
		{        
			elms[i].setAttribute("styler", "checkbox");
			elms[i].setAttribute("role", "checkbox");
			elms[i].setAttribute("data-tooltip-maxwidth", "100");
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
			elms[i].setAttribute("role", "button"); 
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
			elms[i].setAttribute("data-tooltip-maxwidth", "100");
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
			elms[i].setAttribute("data-tooltip-maxwidth", "100");
		}            
	}     

	var paneBorderDiv = wnd.document.getElementById("paneBodyBorder");
	if (paneBorderDiv != null)
	{        
		// restyled tabs will handle their own overflow - set overflow to hidden on the parent
		var paneTabs = wnd.document.getElementById("paneInnerTabs");
	    if (paneTabs != null)
	    {
	    	var paneBorder = wnd.document.getElementById("paneBorder");
	    	paneBorderDiv.className = (paneBorder != null) ? "panebodyborder2" : "panebodyborder3";
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
		
		wnd.seaPageMessage = function(msg, secondaryMsg, type, icon, alertCallbackFunc, submitOnEnter, title, autoDismiss)
		{
			icon = icon || 'info';
			title = title || '';
			dismiss = (autoDismiss) ? true : false;
			if (secondaryMsg)
				msg += ' ' + secondaryMsg;
			var inforType = 'Info';
			switch (icon)
			{
				case "alert":
				case "error":
				case "stop":
				case "trash": inforType = 'Alert'; break;
				default: inforType = 'Info'; break;
			}
			wnd.$('body', wnd.document).inforSlideInMessage({
                messageType: inforType,
                messageTitle: title,
                message: msg,
				showClose: true,
				autoDismiss: dismiss
			});
			if (alertCallbackFunc)
				alertCallbackFunc.apply(this, new Array(wnd));
		};
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
		wnd.XIconOut = StylerEMSS.webappjsURL + "/infor3/images/close_normal.png";
		wnd.XIconOver = StylerEMSS.webappjsURL + "/infor3/images/close_hover.png";
		wnd.XIconActive = StylerEMSS.webappjsURL + "/infor3/images/close_hover.png";
 	}
 	
 	if (typeof(wnd.openImg) != "undefined" && typeof(wnd.closeImg) != "undefined")
 	{
		wnd.openImg = StylerEMSS.webappjsURL + "/infor3/images/arrow_down_normal.png";
		wnd.openImgOver = StylerEMSS.webappjsURL + "/infor3/images/arrow_down_hover.png";
		wnd.openImgActive = StylerEMSS.webappjsURL + "/infor3/images/arrow_down_hover.png";
		if (this.textDir == "rtl")
		{
			wnd.closeImg = StylerEMSS.webappjsURL + "/infor3/images/arrow_left_normal.png";
			wnd.closeImgOver = StylerEMSS.webappjsURL + "/infor3/images/arrow_left_hover.png";
			wnd.closeImgActive = StylerEMSS.webappjsURL + "/infor3/images/arrow_left_hover.png";		
		}
		else
		{
			wnd.closeImg = StylerEMSS.webappjsURL + "/infor3/images/arrow_right_normal.png";
			wnd.closeImgOver = StylerEMSS.webappjsURL + "/infor3/images/arrow_right_hover.png";
			wnd.closeImgActive = StylerEMSS.webappjsURL + "/infor3/images/arrow_right_hover.png";		
 		}
 	}
 	
 	if (typeof(wnd.ActivityDeleteIcon) != "undefined")
 	{
		wnd.ActivityDeleteIcon = StylerEMSS.webappjsURL + "/infor3/images/close_normal.png";
		wnd.ActivityDeleteIconOver = StylerEMSS.webappjsURL + "/infor3/images/close_hover.png";
		wnd.ActivityDeleteIconActive = StylerEMSS.webappjsURL + "/infor3/images/close_hover.png"; 		
 	}

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
 	
	// insert the help icon into the title bar if help text exists
	if (wnd.document.getElementById("paneHelpIcon"))
	{			
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
	
	// about icon
	if (titleBarExists)
	{
		var aboutFunc = function()
		{
			var additionalDetails = 
			"Browser : " + navigator.appCodeName + " " + navigator.appVersion + "\r\n\r\n" +
			"OS : " + navigator.platform + "\r\n\r\n" +
			"Language : " + (navigator.appName == "Microsoft Internet Explorer" ? navigator.userLanguage : navigator.language) + "\r\n\r\n" + 
			"Cookies Enabled : " + navigator.cookieEnabled;
			var emssObj = (wnd.emssObjInstance) ? wnd.emssObjInstance.emssObj : ((winRef.emssObjInstance) ? winRef.emssObjInstance.emssObj : window.emssObjInstance.emssObj);
			var year = (wnd.userWnd && wnd.userWnd.authUser && wnd.userWnd.authUser.date) ? wnd.userWnd.authUser.date.substring(0,4) : (new Date()).getFullYear();
			winRef.$('body', winRef.document).inforAboutDialog({
				productName: emssObj.productName,
				version: emssObj.version,
				copyRightYear: year,
				additionalDetails: additionalDetails
			});			
		}
		var toolTip = "Help";
		var menuItem = "About";
		if (typeof(wnd.stylerWnd) != "undefined" && typeof(wnd.stylerWnd["getSeaPhrase"]) == "function")
		{
			toolTip = wnd.stylerWnd.getSeaPhrase("HELP","ESS");
			menuItem = wnd.stylerWnd.getSeaPhrase("ABOUT","ESS");
		}
		window.styler.addTitleBarIcon(winRef, window.stylerWnd.StylerEMSS.TITLE_BAR_HELP_ICON, null, toolTip);
		window.styler.addTitleBarMenuItem(winRef, window.stylerWnd.StylerEMSS.TITLE_BAR_HELP_ICON, menuItem, aboutFunc);
	}	
};

//-----------------------------------------------------------------------------
StylerEMSS.prototype.addTitleBarMenuItem = function(wnd, icon, itemDesc, menuClickFunc, toolTipText)
{	
    if (!wnd)
    {
        wnd = window;
    }

	if (!this.titleBarExists(wnd))
	{
		return;
    }
	
	icon = icon || StylerBase.TITLE_BAR_DROPDOWN_ICON;

	var modHeaderRight = wnd.document.getElementById("inforModuleHeaderRight");
	var btns = modHeaderRight.getElementsByTagName("button");
	var btn = null;
	var menuExists = false;
	for (var i=0; i<btns.length; i++)
	{
		var btnType = btns[i].getAttribute("styler_type");
		if (btnType == icon)
		{
			btn = btns[i];
			menuExists = true;
			break;
		}
	}

	if (!menuExists)
	{	
		this.addTitleBarMenu(wnd, icon, menuClickFunc, toolTipText);
	}
	else if (toolTipText)
	{
		btn.setAttribute("title", toolTipText);
	}	
	
	StylerBase.ContextMenuActions[icon+"|"+itemDesc] = menuClickFunc;	
	
	var menuList = this.createTitleBarMenuDropDown(wnd, icon);
	var menuItems = menuList.getElementsByTagName("li");
	var len = menuItems.length;
	var itemExists = false;
	var aboutItem = null;
	var aboutDesc = (typeof(wnd.stylerWnd) != "undefined" && typeof(wnd.stylerWnd["getSeaPhrase"]) == "function") ? wnd.stylerWnd.getSeaPhrase("ABOUT","ESS") : "About";	
	for (var i=0; i<len; i++)
	{
		var li = menuItems[i];
		var a = li.childNodes[0];
		var menuDesc = a.getAttribute("href");
		if (menuDesc == ("#"+itemDesc))
			itemExists = true;
		if (menuDesc == ("#"+aboutDesc))
			aboutItem = li;
	}	
	
	if (!itemExists)
	{
		var mItem = wnd.document.createElement("li");        
		var a = wnd.document.createElement("a");
		a.setAttribute("href", "#"+itemDesc);
        a.appendChild(wnd.document.createTextNode(String(itemDesc)));
        mItem.appendChild(a);
        if (aboutItem != null)
        	menuList.insertBefore(mItem, aboutItem);
        else	
        	menuList.appendChild(mItem);
	}
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

//-----------------------------------------------------------------------------
StylerEMSS.prototype.init508 = function(wnd, skipLinkText, skipToID)
{
    if (!wnd)
    {
        wnd = window;
    }
    //add content element if not specified
    if (!skipToID)
    {
    	skipToID = "maincontent";
    	if (!wnd.document.getElementById(skipToID))
    	{	
	    	//first frame in DOM after header is content element
	    	var contentFrameID = "";
			var i = 0;
			var len = wnd.frames.length;
			while (i<len && contentFrameID == "")
			{
				var frameID = wnd.frames[i].frameElement.getAttribute("id");
				if (frameID && frameID.toString().toLowerCase() != "header")
					contentFrameID = frameID;
				i++;
			}
			skipToID = contentFrameID;
    	}
    }
    //add skip location link before content element in DOM
    var contentElm = wnd.document.getElementById(skipToID);
    if (contentElm)
    {	
    	skipToID = "skiplocation";
		var skipToLink = wnd.document.getElementById(skipToID);
		if (!skipToLink)
		{	
			skipToLink = wnd.document.createElement("a");
			skipToLink.className = "inforOffScreen";
			skipToLink.setAttribute("id", "skiplocation");
			skipToLink.setAttribute("styler", "none");
			skipToLink.setAttribute("styledAs", StylerBase.ElementTypeHidden);
			skipToLink.setAttribute("tabindex", "-1");
		}
		contentElm.parentNode.insertBefore(skipToLink, contentElm);
    }
    StylerEMSS.baseMethod.init508.call(this, wnd, skipLinkText, skipToID);
};

//-- Overidden base static methods --------------------------------------------
//
//
// Tab control functions
//-----------------------------------------------------------------------------
StylerEMSS.setActiveTabControlTab = function(obj, wnd)
{
    StylerEMSS.baseStaticMethod.setActiveTabControlTab.apply(this, arguments);
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

	var elmObj = obj;
	var found = false;
    while (!found && elmObj && elmObj.nodeName && (elmObj != elmObj.parentNode))
    {
    	if (elmObj.nodeName.toLowerCase() == "div" && elmObj.className && elmObj.className.indexOf("inforTriggerField") >= 0)
    		found = true;
    	else	
    		elmObj = elmObj.parentNode;
    }
    
    var selectAnchor = (elmObj) ? StylerEMSS.getNextSibling(elmObj) : null;
    while ((selectAnchor != null) && (selectAnchor.nodeName.toLowerCase() != "a"))
    {
    	selectAnchor = StylerEMSS.getNextSibling(selectAnchor);
    }
    
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
StylerEMSS.searchControlOnClick = function(wnd, obj)
{
    if (!wnd)
    {
        wnd = window;
    }

	var elmObj = obj;
	var found = false;
    while (!found && elmObj && elmObj.nodeName && (elmObj != elmObj.parentNode))
    {
    	if (elmObj.nodeName.toLowerCase() == "div" && elmObj.className && elmObj.className.indexOf("inforTriggerField") >= 0)
    		found = true;
    	else	
    		elmObj = elmObj.parentNode;
    }
    
    var selectAnchor = (elmObj) ? StylerEMSS.getNextSibling(elmObj) : null;
    while ((selectAnchor != null) && (selectAnchor.nodeName.toLowerCase() != "a"))
    {
    	selectAnchor = StylerEMSS.getNextSibling(selectAnchor);
    }       

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

//-----------------------------------------------------------------------------
StylerEMSS.selectControlOnLoad = function(wnd, theElement)
{
	 StylerEMSS.baseStaticMethod.selectControlOnLoad.apply(this, arguments);		
};

//-----------------------------------------------------------------------------
StylerEMSS.searchControlOnLoad = function(wnd, theElement)
{
	 StylerEMSS.baseStaticMethod.searchControlOnLoad.apply(this, arguments);		
};