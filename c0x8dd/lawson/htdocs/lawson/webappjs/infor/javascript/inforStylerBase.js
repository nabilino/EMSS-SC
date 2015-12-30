/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/infor/javascript/inforStylerBase.js,v 1.1.2.76.2.21 2014/08/05 02:45:25 kevinct Exp $ */
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
StylerBase.refreshElement = function(theElement, wnd)
{
    // Return if not already styled
    var elementType = theElement.getAttribute("styledAs");
    if (!elementType)
    {
        return;
    }

    if (!wnd)
    {
        wnd = window;
    }
    var stylerObj = StylerBase._singleton;
    if (!stylerObj)
    {
        alert("Attempt to use Styler before instantiation.");
        debugger;
        return;
    }

    switch (parseInt(elementType, 10))
    {
        case StylerBase.ElementTypeUnknown:
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh unknown element (ElementTypeUnknown).");
                debugger;
            }
            break;

        case StylerBase.ElementTypeHidden:          // <???? styler='hidden'>
                                                    // eliminated classic elements
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh element that doesn't have a refresh.");
                debugger;
            }
//            stylerObj.processHiddenElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeInputSelect:     // <input type='text' styler='select'>			
            stylerObj.processSelectElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeInputCalendar:   // <input type='text' styler='calendar'>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh element that doesn't have a refresh.");
                debugger;
            }
//            stylerObj.processCalendarElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeInputSearch:     // <input type='text' styler='search'>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh element that doesn't have a refresh.");
                debugger;
            }
//            stylerObj.processSearchElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeInputText:       // <input type='text' styler>
                                                    // <input type='password' styler>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh element that doesn't have a refresh.");
                debugger;
            }
//            stylerObj.processInputTextElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeInputRadio:      // <input type='radio' styler>
            stylerObj.processInputRadioElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeInputCheckbox:   // <input type='checkbox' styler>
            stylerObj.processInputCheckboxElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeInputUnknown:    // <input type='????' styler>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh unknown element (ElementTypeInputUnknown).");
                debugger;
            }
            break;

        case StylerBase.ElementTypeButton:          // <button styler>
            stylerObj.processButtonElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeDivGroupBox:     // <div styler='groupbox'>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh element that doesn't have a refresh.");
                debugger;
            }
//            stylerObj.processGroupBoxElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeDivTabControl:   // <div styler='tabcontrol'>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh element that doesn't have a refresh.");
                debugger;
            }
//            stylerObj.processTabControlElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeDivHeader:       // <div styler='header'>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh element that doesn't have a refresh.");
                debugger;
            }
//            stylerObj.processHeaderElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeDivGroupLine:    // <div styler='groupline'>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh element that doesn't have a refresh.");
                debugger;
            }
//            stylerObj.processGroupLineElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeDivExpander:     // <div styler='expander'>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh element that doesn't have a refresh.");
                debugger;
            }
//            stylerObj.processExpanderElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeDivUnknown:      // <div styler='????'>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh unknown element (ElementTypeDivUnknown).");
                debugger;
            }
            break;

        case StylerBase.ElementTypeComboBox:        // <select styler>
            stylerObj.processComboBoxElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeAsterisk:        // <span styler='asterisk'>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh element that doesn't have a refresh.");
                debugger;
            }
//            stylerObj.processAsteriskElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeSpanUnknown:     // <span styler='????'>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh unknown element (ElementTypeSpanUnknown).");
                debugger;
            }
            break;

        case StylerBase.ElementTypeList:            // <table styler='list'>
            stylerObj.processListElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeTableUnknown:    // <table styler='????'>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh unknown element (ElementTypeTableUnknown).");
                debugger;
            }
            break;

        case StylerBase.ElementTypeHelpIcon:        // <img styler='help'>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh element that doesn't have a refresh.");
                debugger;
            }
//            stylerObj.processHelpIconElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeDrillIcon:       // <img styler='drill'>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh element that doesn't have a refresh.");
                debugger;
            }
//            stylerObj.processDrillIconElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeImgUnknown:      // <img styler='????'>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh unknown element (ElementTypeImgUnknown).");
                debugger;
            }
            break;

        case StylerBase.ElementTypeTextArea:        // <textarea styler>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh element that doesn't have a refresh.");
                debugger;
            }
//            stylerObj.processTextAreaElement(wnd, theElement);
            break;

        case StylerBase.ElementTypeSettingsIcon:       // <img styler='settings'>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh element that doesn't have a refresh.");
                debugger;
            }
//            stylerObj.processSettingsIconElement(wnd, theElement);
            break;

        default:
            break;
    }
};

//-----------------------------------------------------------------------------
StylerBase.focusElement = function(theElement, wnd)
{
    // Return if not already styled
    var elementType = theElement.getAttribute("styledAs");
    if (!elementType)
    {
    	try { theElement.focus(); } catch(e) {}
        return;
    }

    if (!wnd)
    {
        wnd = window;
    }
    var stylerObj = StylerBase._singleton;
    if (!stylerObj)
    {
        alert("Attempt to use Styler before instantiation.");
        debugger;
        return;
    }

    switch (parseInt(elementType, 10))
    {
        case StylerBase.ElementTypeInputSelect:     // <input type='text' styler='select'>	
        case StylerBase.ElementTypeInputCalendar:   // <input type='text' styler='calendar'>
        case StylerBase.ElementTypeInputSearch:     // <input type='text' styler='search'>
        case StylerBase.ElementTypeInputText:       // <input type='text' styler>, <input type='password' styler>
        case StylerBase.ElementTypeButton:          // <button styler>
        case StylerBase.ElementTypeTextArea:        // <textarea styler>
        case StylerBase.ElementTypeInputRadio:      // <input type='radio' styler>
        case StylerBase.ElementTypeInputCheckbox:   // <input type='checkbox' styler>
        case StylerBase.ElementTypeHelpIcon:		// <img styler='help'>
        case StylerBase.ElementTypeDrillIcon:       // <img styler='drill'>
        case StylerBase.ElementTypeSettingsIcon:    // <img styler='settings'>
        	try { theElement.focus(); } catch(e) {}
            break;
        case StylerBase.ElementTypeComboBox:        // <select styler>
        	try { wnd.document.getElementById(theElement.getAttribute("id")+"_comboboxinput").focus(); } catch(e) {}
            break;
        default:
            break;
    }
};

//
// Push button functions
//-----------------------------------------------------------------------------
StylerBase.primaryPushButtonByIdWithinId = function(elementID,
                                                    containedById,
                                                    wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

    var theElement = wnd.document.getElementById(elementID);
    if (!theElement)
    {
        return;
    }

    // Return if not already styled
    var elementType = theElement.getAttribute("styledAs");
    if (elementType == null || parseInt(elementType, 10) != StylerBase.ElementTypeButton)
    {
        return;
    }

    var containedBy = null;
    if (containedById)
    {
        containedBy = wnd.document.getElementById(containedById);
    }
    if (!containedBy)
    {
        containedBy = wnd.document;
    }

    if (theElement.disabled)
    {
        alert("Attempt to set disabled '" + elementID + "' button as primary.");
        debugger;
        return;
    }

    var buttonList = containedBy.getElementsByTagName("button");

//    alert("Buttons found: " + buttonList.length);

    thisButtonIndex = -1;
    for (var i = 0; i < buttonList.length; i++)
    {
        if (buttonList[i] == theElement)
        {
            thisButtonIndex = i;
            break;
        }
    }

    if (thisButtonIndex < 0)
    {
        alert("Attempt to set '" + elementID +
              "' button as primary not within '" + containedById + "'.");
        debugger;
        return;
    }
    for (var i = 0; i < buttonList.length; i++)
    {
        if (i == thisButtonIndex)
        {
            buttonList[i].styler_state = "";
        }
        else
        {
            buttonList[i].styler_state = "secondary";
        }
        StylerBase.refreshElement(buttonList[i], wnd);
    }
//   StylerBase.disablePushButtonById(elementID, wnd, false);
};

//-----------------------------------------------------------------------------
StylerBase.enablePushButtonById = function(elementID, wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

    StylerBase.disablePushButtonById(elementID, wnd, false);
};

//-----------------------------------------------------------------------------
StylerBase.disablePushButtonById = function(elementID, wnd)
{
    if (!wnd)
    {
        wnd = window;
    }
    if (arguments.length < 3)
    {
        StylerBase.disablePushButtonById(elementID, wnd, true);
        return;
    }

    var theElement = wnd.document.getElementById(elementID);
    if (!theElement)
    {
        return;
    }

    theElement.disabled = arguments[2];

    // Return if not already styled
    var elementType = theElement.getAttribute("styledAs");
    if (elementType == null || parseInt(elementType, 10) != StylerBase.ElementTypeButton)
    {
        return;
    }

    StylerBase.refreshElement(theElement, wnd);
};

//-----------------------------------------------------------------------------
StylerBase.pushButtonMouseOver = function(obj)
{
    var elms = obj.getElementsByTagName("div");
    var imgs = obj.getElementsByTagName("img");

    if (imgs.length > 0) {
		if (obj.getAttribute("state") == "primary") {
			imgs[0].src = StylerBase.webappjsURL + "/infor/images/btn_ctr_1x20_over.png";
		}
		else {
			imgs[0].src = StylerBase.webappjsURL + "/infor/images/btn_ctr_1x20_over.png";
		}
	}

    for (var i = 0; i < elms.length; i++) {
		if (elms[i].className.indexOf("LeftSide") >= 0) {
			elms[i].className = (obj.getAttribute("state") == "primary") ? "inforPushButtonLeftSideHover" : "inforPushButtonSecondaryLeftSideHover";
		}
		else if (elms[i].className.indexOf("RightSide") >= 0) {
			elms[i].className = (obj.getAttribute("state") == "primary") ? "inforPushButtonRightSideHover" : "inforPushButtonSecondaryRightSideHover";
		}
		else if (elms[i].className.indexOf("PushButtonContent") >= 0) {
			elms[i].className = (obj.getAttribute("state") == "primary") ? "inforPushButtonContentOver" : "inforPushButtonContentOver";
		}
	}	
};

//-----------------------------------------------------------------------------
StylerBase.pushButtonMouseOut = function(obj)
{
    var elms = obj.getElementsByTagName("div");
    var imgs = obj.getElementsByTagName("img");

    if (imgs.length > 0)
    {
        if (obj.getAttribute("state") == "primary") {
			imgs[0].src = StylerBase.webappjsURL + "/infor/images/btn-form_ctr_1x20_enabled.png";
		}
		else {
			imgs[0].src = StylerBase.webappjsURL + "/infor/images/btn_ctr_1x20_enabled.png";
		}
    }

    for (var i=0; i<elms.length; i++)
    {
        if (elms[i].nodeName.toLowerCase() == "img")
        {
            if (obj.getAttribute("state") == "primary") {
				elms[i].src = StylerBase.webappjsURL + "/infor/images/btn-form_ctr_1x20_enabled.png";
			}
			else {
				elms[i].src = StylerBase.webappjsURL + "/infor/images/btn_ctr_1x20_enabled.png";
			}
        }
        else if (elms[i].className.indexOf("LeftSide") >= 0) {
			elms[i].className = (obj.getAttribute("state") == "primary") ? "inforPushButtonLeftSide" : "inforPushButtonSecondaryLeftSide";
		}
		else if (elms[i].className.indexOf("RightSide") >= 0) {
			elms[i].className = (obj.getAttribute("state") == "primary") ? "inforPushButtonRightSide" : "inforPushButtonSecondaryRightSide";
		}
		else if (elms[i].className.indexOf("PushButtonContent") >= 0) {
			elms[i].className = (obj.getAttribute("state") == "primary") ? "inforPushButtonContent" : "inforPushButtonContentSecondary";
		}
	}
};

//-----------------------------------------------------------------------------
StylerBase.pushButtonMousePress = function(obj)
{
    var elms = obj.getElementsByTagName("div");
    var imgs = obj.getElementsByTagName("img");

    if (imgs.length > 0)
    {
        if (obj.getAttribute("state") == "primary") {
			imgs[0].src = StylerBase.webappjsURL +  "/infor/images/btn_ctr_1x20_press.png";
		}
		else {
			imgs[0].src = StylerBase.webappjsURL + "/infor/images/btn_ctr_1x20_press.png";
		}
    }

    for (var i=0; i<elms.length; i++)
    {
        if (elms[i].nodeName.toLowerCase() == "img")
        {
            if (obj.getAttribute("state") == "primary") {
				elms[i].src = StylerBase.webappjsURL +
				"/infor/images/btn_ctr_1x20_press.png";
			}
			else {
				elms[i].src = StylerBase.webappjsURL +
				"/infor/images/btn_ctr_1x20_press.png";
			}
        }
        else if (elms[i].className.indexOf("LeftSide") >= 0) {
			elms[i].className = (obj.getAttribute("state") == "primary") ? "inforPushButtonLeftSidePress" : "inforPushButtonSecondaryLeftSidePress";
		}
		else if (elms[i].className.indexOf("RightSide") >= 0) {
			elms[i].className = (obj.getAttribute("state") == "primary") ? "inforPushButtonRightSidePress" : "inforPushButtonSecondaryRightSidePress";
		}
		else if (elms[i].className.indexOf("PushButtonContent") >= 0) {
			elms[i].className = (obj.getAttribute("state") == "primary") ? "inforPushButtonContentOver" : "inforPushButtonContentOver";
		}
    }
};

//
// Tab control functions
//-----------------------------------------------------------------------------
StylerBase.setActiveTabControlTab = function(obj, wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

    var tabControl = obj.parentNode;
    var stylerLoadAttribute = tabControl.getAttribute("styler_load");
    var stylerClickAttribute = tabControl.getAttribute("styler_click");

    if (stylerClickAttribute != null)
    {    
        StylerBase.performFunctionCallback(wnd, stylerClickAttribute, new Array(wnd, obj));
    }

    var spans = obj.getElementsByTagName("span");
    var doc = StylerBase.getElementDocument(obj);

    if (spans[1].className.indexOf("inforTab") >= 0)
    {
        var ul = obj.parentNode;
        var lis = ul.getElementsByTagName("li");
		var len = lis.length;
		
        for (var i=0; i<len; i++)
        {
            var sp = lis[i].getElementsByTagName("span");
            var classNm = sp[1].className + "";

            // activate this tab
            if (lis[i] == obj)
            {
            	sp[0].className = "inforTabLeftActive";
            	sp[1].className = "inforTabActive";
            	sp[2].className = "inforTabRightActive";
            	sp[3].style.visibility = "hidden";
                var contentDiv = doc.getElementById(lis[i].getAttribute("tabId"));
                if (contentDiv != null)
                {
                    contentDiv.className = "inforTabContentActive";
                }
                StylerBase.hideAdjacentTabSeparator(obj);
            }
            // inactivate the previous active tab
            else if (classNm.indexOf("inforTab") == -1)
            {
            	sp[0].className = "inforTabLeft";
            	sp[1].className = "inforTab";
            	sp[2].className = "inforTabRight";
            	sp[3].style.visibility = "";
                var contentDiv = doc.getElementById(lis[i].getAttribute("tabId"));
                if (contentDiv != null)
                {
                    contentDiv.className = "inforTabContent";
                }
                StylerBase.showAdjacentTabSeparator(lis[i]);
            }
            else
            {
            	sp[0].className = "inforTabLeft";
            	sp[1].className = "inforTab";
            	sp[2].className = "inforTabRight";
            	sp[3].style.visibility = "";
                var contentDiv = doc.getElementById(lis[i].getAttribute("tabId"));
                if (contentDiv != null)
                {
                    contentDiv.className = "inforTabContent";
                }
                StylerBase.showAdjacentTabSeparator(lis[i]);
            }
        }
    }

    if (stylerLoadAttribute != null)
    {
        StylerBase.performFunctionCallback(wnd, stylerLoadAttribute, new Array(wnd, obj));
    }
};

//-----------------------------------------------------------------------------
StylerBase.getFirstCssClass = function(obj)
{
    var firstClass = obj.className.split(" ")[0];
    firstClass = firstClass.replace(new RegExp("Hover"), "");

    return firstClass;
};

//-----------------------------------------------------------------------------
StylerBase.hideAdjacentTabSeparator = function(obj)
{
	var prevTab = StylerBase.getPreviousSibling(obj);
	if (prevTab)
	{	
		var spans = prevTab.getElementsByTagName("span");
		spans[3].style.visibility = "hidden";
	}
};

//-----------------------------------------------------------------------------
StylerBase.showAdjacentTabSeparator = function(obj)
{
	var prevTab = StylerBase.getPreviousSibling(obj);
	if (prevTab)
	{
		var spans = prevTab.getElementsByTagName("span");
		if (spans[1].className.indexOf("inforTabActive") == -1)
		{
			spans[3].style.visibility = "";
		}	
	}
};

//-----------------------------------------------------------------------------
StylerBase.tabControlOnMouseOver = function(obj)
{
	var spans = obj.getElementsByTagName("span");
	if (spans[1].className.indexOf("Over") == -1)
	{
		StylerBase.addTabControlHoverEffect(spans[0]);
		StylerBase.addTabControlHoverEffect(spans[1]);
		StylerBase.addTabControlHoverEffect(spans[2]);
		spans[3].style.visibility = "hidden";
		StylerBase.hideAdjacentTabSeparator(obj);
	}
};

//-----------------------------------------------------------------------------
StylerBase.addTabControlHoverEffect = function(obj)
{
    if (obj.className != "" && obj.className.indexOf("Over") == -1)
    {
        obj.className = obj.className + "Over";
    }
};

//-----------------------------------------------------------------------------
StylerBase.removeTabControlHoverEffect = function(obj)
{
	obj.className = obj.className.replace(new RegExp("Over"), "");
};

//-----------------------------------------------------------------------------
StylerBase.tabControlOnMouseOut = function(obj)
{
	var spans = obj.getElementsByTagName("span");
	if (spans[1].className.indexOf("Over") >= 0)
	{
		StylerBase.removeTabControlHoverEffect(spans[0]);
		StylerBase.removeTabControlHoverEffect(spans[1]);
		StylerBase.removeTabControlHoverEffect(spans[2]);
		if (spans[1].className.indexOf("inforTabActive") == -1)
		{
			spans[3].style.visibility = "";
			StylerBase.showAdjacentTabSeparator(obj);
		}
	}
};

//
// List functions
//
//-----------------------------------------------------------------------------
StylerBase.highlightListRow = function(obj)
{
	if (obj)
		obj.className = "inforDataGridRowOver";
};

//-----------------------------------------------------------------------------
StylerBase.unhighlightListRow = function(obj)
{
	if (obj)
		obj.className = "inforDataGridRow";
};

//-----------------------------------------------------------------------------
StylerBase.selectControlOnClick = function(obj, wnd)
{
    var inputBox = StylerBase.getPreviousSibling(obj);
    var clickAttribute = inputBox.getAttribute("styler_click");

    StylerBase.performFunctionCallback(wnd, clickAttribute, new Array(inputBox, wnd));
};

//-----------------------------------------------------------------------------
StylerBase.searchControlOnClick = function(wnd, obj, evt)
{
    var inputBox = wnd.document.getElementById(obj.getAttribute("for"));
    var clickAttribute = inputBox.getAttribute("styler_click");
    
    StylerBase.performFunctionCallback(wnd, clickAttribute, new Array(wnd, inputBox, evt));
};

//-----------------------------------------------------------------------------
StylerBase.expanderControlOnClick = function(obj, wnd)
{
    var expanderDiv = StylerBase.getNextSibling(obj);
    var clickAttribute = expanderDiv.getAttribute("styler_click");

    StylerBase.performFunctionCallback(wnd, clickAttribute, new Array(expanderDiv, wnd));
};

//-----------------------------------------------------------------------------
StylerBase.setElementWidth = function(wnd, newElement, oldElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    if (oldElement.offsetWidth > 0)
    {
        newElement.style.width = oldElement.offsetWidth + "px";
    }
    else if (oldElement.offsetWidth == 0)
    {
        var thisParent = oldElement.parentNode;
        var nextChild = StylerBase.getNextSibling(oldElement);
        var thisChild = wnd.document.body.insertBefore(oldElement, null);

        if (thisChild.offsetWidth > 0)
        {
            newElement.style.width = thisChild.offsetWidth + "px";
        }

        thisParent.insertBefore(thisChild, nextChild);
    }
};

//-----------------------------------------------------------------------------
StylerBase.calendarControlOnClick = function(wnd, obj, evt)
{
    if (!wnd)
    {
        wnd = window;
    }

    // NOTE: You must have Calendar.js and Sizer.js loaded from webappjs
    if (typeof(wnd["CalendarObject"]) != "function")
    {
        alert("ERROR: Cannot initialize CalendarObject. \n\n " +
              "StylerBase.calendarControlOnClick \n inforStylerBase.js");
        return;
    }

    // NOTE: You must have a variable called "calObj" declared as a CalendarObject() from webappjs
    if (typeof(wnd.calObj) == "undefined" || wnd.calObj == null)
    {
        wnd.calObj = new wnd.CalendarObject(wnd, wnd.CalendarObject.MMDDYY, "/", null);
        wnd.calObj.styler = StylerBase._singleton;
        wnd.calObj.setType(wnd.CalendarObject.TYPE_GREGORIAN);        
    }

    wnd.calObj.openCalendar(obj, evt);
    return;
};

//
// Combo box functions
//-----------------------------------------------------------------------------
StylerBase._comboBoxPageSize = 50;
StylerBase._currentComboBox = null;

StylerBase.addEvent = function(obj, type, fn)
{
    if (obj.addEventListener)
    {
        obj.addEventListener(type, fn, false);
    }
    else if (obj.attachEvent)
    {
        obj.attachEvent("on" + type, fn);
    }
    else
    {
        obj["on" + type] = fn;
    }
};

StylerBase.removeEvent = function(obj, type, fn)
{
    if (obj.removeEventListener)
    {
        obj.removeEventListener(type, fn, false);
    }
    else if (obj.detachEvent)
    {
        obj.detachEvent("on" + type, fn);
    }
    else
    {
        obj["on" + type] = null;
    }
};

StylerBase.selectComboBoxItem = function(evt, obj, open, highLight)
{
    var doc = StylerBase.getElementDocument(obj);
    var comboBox = obj.parentNode;
    var lis = comboBox.getElementsByTagName("li");
    var selectIndex = comboBox.getAttribute("selectIndex");

    if (selectIndex != null)
    {
        var prevItem = lis[Number(selectIndex)];

        // unhighlight the previous selected item
        StylerBase.unhilightComboBoxItem(prevItem);
        prevItem.className = "";        
    }

    // if the combobox should remain open, highlight the selected item;
    // otherwise unhighlight it and close the combo box
    if (open)
    {
        StylerBase.hilightComboBoxItem(obj);
    }
    else
    {
        StylerBase.unhilightComboBoxItem(obj);
        StylerBase._currentComboBox = null;
    }

    var selectID = comboBox.getAttribute("selectID");
    var selectTxt = (obj.innerText) ? obj.innerText : ((obj.textContent) ? obj.textContent : "");
    var itemIndex = Number(obj.getAttribute("itemIndex"));

    obj.className += " selected";
    comboBox.className = (open) ? "inforDropDownOpen" : "inforDropDown";                           
    comboBox.setAttribute("selectIndex", String(itemIndex));

    // scroll the item list
    var scrollOffset = obj.offsetTop - parseInt(comboBox.offsetHeight/2, 10);
    if (isNaN(scrollOffset) || scrollOffset < 0)
    {
    	scrollOffset = 0;
    }    
    comboBox.scrollTop = scrollOffset;

    var selectElm = doc.getElementById(selectID);
    StylerBase.setSelectElementValue(selectElm, selectID, itemIndex, selectTxt, highLight);
};

//-----------------------------------------------------------------------------
StylerBase.setSelectElementValue = function(obj, objID, selIndex, selTxt, highLight)
{
    // set the selected option in the select element
    var oldIndex = obj.selectedIndex;
    obj.selectedIndex = selIndex;

    // fire the onchange event in the select element
    if (obj.onchange && oldIndex != selIndex)
    {
        obj.onchange();
    }

    // set the selected option in the input box element
    var doc = StylerBase.getElementDocument(obj);
    var inputBoxObj = doc.getElementById(objID + "_comboboxinput");
    inputBoxObj.value = selTxt;

    if (!inputBoxObj.disabled)
    {
        if (highLight)
        {
            try
            {
                inputBoxObj.select();
            }
            catch(e)
            {}
        }
    }
};

//-----------------------------------------------------------------------------
StylerBase.hilightComboBoxItem = function(obj)
{
    // unhighlight the old selected combo box item
    var ul = obj.parentNode;

    if (ul.getAttribute("selectIndex") != null)
    {
        var index = Number(ul.getAttribute("selectIndex"));
        var li = ul.getElementsByTagName("li")[index];
        StylerBase.unhilightComboBoxItem(li);
    }

    ul.setAttribute("hilightIndex", obj.getAttribute("itemIndex"));

    // highlight this combo box item
    if (obj.className.indexOf("selected") >= 0)
    {
        obj.className = "inforDropDownOpenOver selected";
    }
    else
    {
        obj.className = "inforDropDownOpenOver";
    }
};

//-----------------------------------------------------------------------------
StylerBase.unhilightComboBoxItem = function(obj)
{
    // unhighlight this combo box item
    var ul = obj.parentNode;
    var sp = obj.getElementsByTagName("span");

    ul.removeAttribute("hilightIndex");
    obj.className = obj.className.replace(new RegExp("inforDropDownOpenOver\\b"),"");
};

//-----------------------------------------------------------------------------
StylerBase.loadComboBox = function(obj)
{
    // add the combo box list items
    var doc = StylerBase.getElementDocument(obj);
    var selectID = obj.getAttribute("selectID");
    var selectElm = doc.getElementById(selectID);
    var opt = selectElm.options;
    var optLen = opt.length;
    var selectedItem = null;

    for (var j=0; j<optLen; j++)
    {
        var optObj = opt[j];
        var optTxt = (optObj.innerText) ? optObj.innerText : ((optObj.textContent) ? optObj.textContent : "\u00a0");
        var li = doc.createElement("li");

        if (optTxt == "")
        {
            optTxt = "\u00a0";
        }

        li.setAttribute("itemIndex", String(j));
        li.setAttribute("itemValue", String(optObj.getAttribute("value")));
        li.onclick = function(evt)
        {
            evt = (evt) ? evt : ((window.event) ? window.event : "");
            StylerBase.selectComboBoxItem(evt, this);
        };
        li.onmouseover = function(evt)
        {
            evt = (evt) ? evt : ((window.event) ? window.event : "");
            StylerBase.hilightComboBoxItem(this);
        };
        li.onmouseout = function(evt)
        {
            evt = (evt) ? evt : ((window.event) ? window.event : "");
            StylerBase.unhilightComboBoxItem(this);
        };
        
        li.appendChild(doc.createTextNode(optTxt.replace(/ /g,"\u00a0")));

		obj.appendChild(li);

        if (selectElm.selectedIndex == j)
        {
            selectedItem = li;
        }
    }
    
    obj.setAttribute("loaded", "1");
};

//-----------------------------------------------------------------------------
StylerBase.openComboBox = function(obj, wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

    // expand the combo box
    var doc = StylerBase.getElementDocument(obj);

    var loadedAttribute = obj.getAttribute("loaded");
    if (loadedAttribute == null || loadedAttribute != "1")
    {
        StylerBase.loadComboBox(obj);
    }
    
    var selectID = obj.getAttribute("selectID");
    var comboBoxList = doc.getElementById("comboBoxList");
    if (comboBoxList == null)
    {
        comboBoxList = doc.createElement("div");
        comboBoxList.setAttribute("id", "comboBoxList");
        comboBoxList.appendChild(obj);
        doc.body.appendChild(comboBoxList);
    }
    else
    {
        if (comboBoxList.childNodes.length > 0)
        {
            try
            {
                // insert the last combo box list back to its original position
            	var lastCbElm = comboBoxList.removeChild(comboBoxList.childNodes[0]);
                var lastSelectID = lastCbElm.getAttribute("selectID");
                var lastSelectElm = doc.getElementById(lastSelectID);
                // if a combobox is clicked twice, do nothing so we don't get a duplicate list
                if (lastSelectID != selectID)	
                {
                	var lastCbID = lastCbElm.getAttribute("id");
                	var origCbElm = doc.getElementById(lastCbID);
                	if (!origCbElm)
                		lastSelectElm.parentNode.insertBefore(lastCbElm, lastSelectElm);
                }
            }   
            catch(e)
            {}
        }
        comboBoxList.appendChild(obj);  
    }

    var lis = obj.getElementsByTagName("li");
    var selItem = null;
    var selIndex = obj.getAttribute("selectIndex");
    if (selIndex != null)
    {
        selItem = lis[Number(selIndex)];
        StylerBase.hilightComboBoxItem(selItem);
    }

    obj.className = "inforDropDownOpen";

    var comboSpan = doc.getElementById(selectID + "_combobox");
    var inputBox = doc.getElementById(selectID + "_comboboxinput");

    // position it
    var comboFldPos = wnd.PositionObject.getInstance(inputBox);
    var leftPos = comboFldPos.left - 2;
    var topPos = comboFldPos.thetop + comboFldPos.height - 1;

	var stylerObj = StylerBase._singleton;
	if (stylerObj && stylerObj.textDir == "rtl")
	{
		leftPos -= 13;
	}

    // size the width according to the size of the data
    var totalWidth = comboSpan.offsetWidth;

    if (lis.length > 0 && (obj.offsetWidth - 2) > comboSpan.offsetWidth)
    {
    	var selectElm = doc.getElementById(selectID);
    	if (selectElm.style.width && selectElm.style.width.toString().indexOf("px") >= 0)	
    		inputBox.style.width = selectElm.style.width;	
    	else	
    		inputBox.style.width = obj.offsetWidth + "px";
        // add the width of the button plus borders
        totalWidth = obj.offsetWidth;
    }
    else if (wnd.innerWidth ||
             (doc.documentElement &&
              doc.documentElement.clientWidth))
    {
        totalWidth -= 2;
    }

	var getWindowHeight = function(w)
	{
		w = w || window;
		h = 0;
		if (w.innerHeight)
		{
			// non-IE browsers
			h = w.innerHeight;
		}
		else if (w.document && w.document.documentElement && w.document.documentElement.clientHeight)
		{
			// IE 6+ in "standards compliant mode"
			h = w.document.documentElement.clientHeight;
		}
		else if (w.document && w.document.body && w.document.body.clientHeight)
		{
			// IE 6 in "quirks mode"
			h = w.document.body.clientHeight;
		}
		return h;
	}	
	
    // reduce the height and introduce scrollbars if necessary 
    var totalHeight = obj.scrollHeight;
    var windowHeight = getWindowHeight(wnd);
    try
    {
	    if (wnd.frameElement && wnd.frameElement.nodeName.toLowerCase() == "iframe")
	    {
	    	var topWnd = null;
	    	var tmpWnd = wnd;
	    	while (tmpWnd != tmpWnd.parent)
	    	{	
			    if (typeof(tmpWnd["StylerBase"]) != "undefined")
			    	topWnd = tmpWnd;
			    tmpWnd = tmpWnd.parent;
	    	}
		    if (typeof(tmpWnd["StylerBase"]) != "undefined")
		    	topWnd = tmpWnd;
        	if (topWnd != null)
        	{
				tmpWnd = wnd;
				var clippedHeight = 0;
				while (tmpWnd != topWnd)
        		{
					var winFrame = wnd.PositionObject.getInstance(tmpWnd.frameElement);
					var parHeight = getWindowHeight(tmpWnd.parent);
					if ((winFrame.thetop + winFrame.height) > parHeight)
						clippedHeight = (winFrame.thetop + winFrame.height) - parHeight;
					tmpWnd = tmpWnd.parent;
        		}			
				if (clippedHeight > 0 && (windowHeight - clippedHeight - 2) > 0)
					windowHeight = windowHeight - clippedHeight - 2;
        	}    	
	    }
    } catch(e) {}
    
    obj.setAttribute("openDir", "down"); 
    
    // will the combo box drop down be clipped by the window?
    if (topPos + totalHeight > windowHeight)
    { 
        totalHeight = windowHeight - topPos - 4;

        if ((totalHeight > 0) && (topPos < (windowHeight - topPos)))
        {
            // there is more room below the text box; display it below
            obj.style.height = totalHeight + "px";
        }
        else
        {
            // there is more room above the text box; display it above
            topPos = comboFldPos.thetop;
            totalHeight = obj.scrollHeight;

        	// add two to account for the top and bottom borders in IE (box model)
        	if (navigator.userAgent.indexOf("MSIE") >= 0)
        	{
        		totalHeight += 2;
        	}
            if (topPos - totalHeight < 0)
            {
            	totalHeight = topPos;
            	obj.style.height = totalHeight + "px";
            }
            else
            {
            	obj.style.height = "auto";
            }
            
            topPos = comboFldPos.thetop - totalHeight;
            obj.setAttribute("openDir", "up");
        }
    }
    else
    {
    	obj.style.height = "auto";
    }
    
    if (wnd.pageYOffset)
    {
    	topPos += wnd.pageYOffset;
    }

    obj.style.left = leftPos + "px";
    obj.style.top =  topPos + "px";
    obj.style.width = totalWidth + "px";

    // scroll the item list
    if (selItem != null && selItem.offsetTop >= 0)
    {
    	var scrollOffset = selItem.offsetTop - parseInt(totalHeight/2, 10);
    	if (isNaN(scrollOffset) || scrollOffset < 0)
    	{
    		scrollOffset = 0;
        }
        obj.scrollTop = scrollOffset;
    }

    // select the text in the input box
    selectID = obj.getAttribute("selectID");
    var selObj = doc.getElementById(selectID + "_comboboxinput");
    selObj.select();

    // add a mouse down handler on the document body to collapse the combobox
    // when the user clicks the mouse outside the combobox
    var mouseDownAttribute = wnd.document.body.getAttribute("styler_mousedown");
    if (mouseDownAttribute == null || mouseDownAttribute != "1")
    {
        StylerBase.addEvent(wnd.document, "mousedown",
            function(evt)
            {
                evt = (evt) ? evt : ((wnd.event) ? wnd.event : "");
                StylerBase.closeOpenControls(evt, wnd);
                // "bubble up" this event to the parent element
                try
                {
                	if (typeof(wnd.parent != wnd && wnd.parent["StylerBase"]) != "undefined")
                	{
                		wnd.parent.StylerBase.closeOpenControls(evt, parent.wnd);
                	}
                }
                catch(e)
                {}
            });
        wnd.document.body.setAttribute("styler_mousedown", "1");
    }
};

//-----------------------------------------------------------------------------
StylerBase.closeOpenControls = function(evt, wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

    evt = (evt) ? evt : ((wnd.event) ? wnd.event : "");

    // combo box
    if (StylerBase._currentComboBox)
    {
        // make sure we have a current reference to the open combo box
        var ul = wnd.document.getElementById(StylerBase._currentComboBox.getAttribute("id"));
        if (ul && ul != StylerBase._currentComboBox)
        {
            StylerBase._currentComboBox = ul;
        }

        StylerBase.collapseComboBox(evt, StylerBase._currentComboBox);
    }

    // calendar
    if (typeof(wnd.calObj) != "undefined" && wnd.calObj != null)
    {
        StylerBase.collapseCalendar(evt, wnd.calObj);
    }
    
    var menuObj = wnd.document.getElementById("titleBarMenu");
    if (menuObj)
    {
    	var menuList = menuObj.childNodes[0];
    	StylerBase.collapseTitleBarMenu(evt, menuList);
    }    
};

//-----------------------------------------------------------------------------
StylerBase.isMouseOutsideComboBox = function(evt, comboBox)
{
    var doc = StylerBase.getElementDocument(comboBox);
    var cbId = comboBox.getAttribute("id");
    var cbSpanId = cbId.replace("list", "");
    var cbSpan = doc.getElementById(cbSpanId);

    // get the position of the mouse
    var docElm = (doc.documentElement && (doc.documentElement.scrollLeft || doc.documentElement.scrollTop)) 
    	? doc.documentElement : doc.body;
    var mouseX = evt.clientX;
	var stylerObj = StylerBase._singleton;
	if (stylerObj && stylerObj.textDir == "rtl")
	{
		mouseX -= docElm.scrollLeft;
	}
	else
	{    
		mouseX += docElm.scrollLeft;
    }    
    var mouseY = evt.clientY + docElm.scrollTop;

    // get the position of input box
    var spanPos = window.PositionObject.getInstance(cbSpan);

    // get the position of dropdown
    var comboFldPos = window.PositionObject.getInstance(comboBox);
    var leftPos = spanPos.left;
    var topPos;

    if (comboBox.getAttribute("openDir") == "down")
    {
        topPos = spanPos.thetop + spanPos.height;
    }
    else
    {
        topPos = spanPos.thetop - comboFldPos.height;
    }

    // set the outer boundary positions and total width and height
    if (spanPos.left < leftPos)
    {
        leftPos = spanPos.left + 2;
    }

    if (spanPos.thetop < topPos)
    {
        topPos = spanPos.thetop + 2;
    }

    leftPos = (leftPos < 0) ? 0 : leftPos;
    topPos = (topPos < 0) ? 0 : topPos;

    var totalWidth = (comboFldPos.width > spanPos.width) ?
                      comboFldPos.width - 2 :
                      spanPos.width - 2;
    var totalHeight = comboFldPos.height + spanPos.height - 2;

    return (mouseX < leftPos ||
           mouseX > (leftPos + totalWidth) ||
           mouseY < topPos ||
           mouseY > (topPos + totalHeight));
};

//-----------------------------------------------------------------------------
StylerBase.collapseComboBox = function(evt, comboBox)
{
    if (comboBox == null)
    {
        return;
    }

    if (comboBox.className == "inforDropDownOpen" && StylerBase.isMouseOutsideComboBox(evt, comboBox))
    {
        // close the combo box; if an item is highlighted, select it first
        var selIndex = StylerBase.getComboBoxHilightedIndex(comboBox);
        var lis = comboBox.getElementsByTagName("li");

        if (selIndex >= 0 && selIndex < lis.length)
        {
            var selItem = lis[selIndex];
            StylerBase.selectComboBoxItem(evt, selItem);
        }
        else
        {
            StylerBase.closeComboBox(comboBox);
        }
    }
    return;
};

//-----------------------------------------------------------------------------
StylerBase.isMouseOutsideCalendar = function(evt, calObj)
{
    if (!calObj || !calObj.inputFld || !calObj.calendar)
    {
        return false;
    }

    // get the position of the mouse
    var doc = StylerBase.getElementDocument(calObj.inputFld);
    var docElm = (doc.documentElement && (doc.documentElement.scrollLeft || doc.documentElement.scrollTop)) 
    	? doc.documentElement : doc.body;
    var mouseX = evt.clientX;
	var stylerObj = StylerBase._singleton;
	if (stylerObj && stylerObj.textDir == "rtl")
	{
		mouseX -= docElm.scrollLeft;
	}
	else
	{    
		mouseX += docElm.scrollLeft;
    }    
    var mouseY = evt.clientY + docElm.scrollTop;

    // get the position of input box
    var inputFldPos = window.PositionObject.getInstance(calObj.inputFld);

    // get the position of dropdown
    var calendarDivPos = window.PositionObject.getInstance(calObj.calendar);
    var leftPos = calendarDivPos.left;
    var topPos;

    if (calObj.openDirection.toLowerCase().indexOf("up") >= 0)
    {
        topPos = inputFldPos.thetop - calendarDivPos.height;
    }
    else if (calObj.openDirection.toLowerCase() == "center")
    {
        topPos = inputFldPos.thetop + Math.floor(inputFldPos.height / 2) - Math.floor(calendarDivPos.height / 2);
    }
    else
    {
        topPos = inputFldPos.thetop;
    }

    if (calObj.openDirection.toLowerCase() != "center")
    {
        if (inputFldPos.thetop < topPos)
        {
            topPos = inputFldPos.thetop;
        }
        
    	if (inputFldPos.left < leftPos)
    	{
            leftPos = inputFldPos.left;
        }
    }

    leftPos = (leftPos < 0) ? 0 : leftPos;
    topPos = (topPos < 0) ? 0 : topPos;

    // set the outer boundary positions (total width and height) 
    var totalWidth = (calendarDivPos.width > inputFldPos.width) ?
                      calendarDivPos.width :
                      inputFldPos.width;
    var totalHeight = calendarDivPos.height + inputFldPos.height;
    
    return (mouseX < leftPos ||
           mouseX > (leftPos + totalWidth) ||
           mouseY < topPos ||
           mouseY > (topPos + totalHeight));
};

//-----------------------------------------------------------------------------
StylerBase.collapseCalendar = function(evt, calObj)
{
    if (calObj == null || !calObj.inputFld || !calObj.calendar)
    {
        return;
    }

    if (StylerBase.isMouseOutsideCalendar(evt, calObj))
    {
        // close the calendar
        calObj.close();
    }
    return;
};

//-----------------------------------------------------------------------------
StylerBase.closeComboBox = function(obj)
{
    if (obj.className == "inforDropDownOpen")
    {
        StylerBase._currentComboBox = null;
        obj.className = "inforDropDown";

        var doc = StylerBase.getElementDocument(obj);
        var selectID = obj.getAttribute("selectID");

        if (selectID != null && selectID != "")
        {
            var selObj = doc.getElementById(selectID + "_comboboxinput");
            selObj.select();
        }
    }
};

//-----------------------------------------------------------------------------
StylerBase.toggleComboBox = function(wnd, evt, obj)
{
    // work-around for firefox issue with event bubbling
    var srcNode = (evt.srcElement) ?
                    evt.srcElement :
                    ((evt.target) ? evt.target : null);

    if (srcNode != null && srcNode.nodeName.toLowerCase() == "li" && srcNode.className.indexOf("comboBoxOpenStyler") == -1)
    {
        return;
    }

    var cbSpan = obj.childNodes[0];
    var doc = StylerBase.getElementDocument(obj);
    var cbSpanId = cbSpan.getAttribute("id");
    var ul = doc.getElementById(cbSpanId + "list");

    // if there is another combobox currently open, close it
    if (StylerBase._currentComboBox != null && StylerBase._currentComboBox != ul && StylerBase._currentComboBox.className == "inforDropDownOpen")
    {
        StylerBase.closeComboBox(StylerBase._currentComboBox);
    }

    StylerBase._currentComboBox = ul;

    if (ul.className == "inforDropDownOpen")
    {
        StylerBase.closeComboBox(ul);
    }
    else
    {
        StylerBase.openComboBox(ul, wnd);
    }

    var selectID = ul.getAttribute("selectID");
    var selectElm = doc.getElementById(selectID);

    if (selectElm.onclick != null)
    {
        selectElm.onclick();
    }
    return;
};

//-----------------------------------------------------------------------------
StylerBase.getComboBoxSelectedIndex = function(obj)
{
    var selIndex = -1;

    if (obj.getAttribute("selectIndex") != null)
    {
        selIndex = Number(obj.getAttribute("selectIndex"));
    }

    return selIndex;
};

//-----------------------------------------------------------------------------
StylerBase.getComboBoxHilightedIndex = function(obj)
{
    var hilightIndex = -1;

    if (obj.getAttribute("hilightIndex") != null)
    {
        hilightIndex = Number(obj.getAttribute("hilightIndex"));
    }

    return hilightIndex;
};

//-----------------------------------------------------------------------------
StylerBase.selectHilightedItem = function(evt, obj, highLight)
{
    var selIndex = StylerBase.getComboBoxHilightedIndex(obj);
    var lis = obj.getElementsByTagName("li");

    if (selIndex == -1)
    {
        selIndex = StylerBase.getComboBoxSelectedIndex(obj);
    }

    if (selIndex >= 0 && selIndex < lis.length)
    {
        var selItem = lis[selIndex];
        StylerBase.selectComboBoxItem(evt, selItem, false, highLight);
    }
};

//-----------------------------------------------------------------------------
StylerBase.doComboBoxOnKeyDown = function(evtArg, wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

    var selectID;
    var selIndex;
    var cbItems;
    var evt = (evtArg) ? evtArg : ((wnd.event) ? wnd.event : "");
    var srcElm = (evt.srcElement) ? evt.srcElement : evt.target;
    var doc = StylerBase.getElementDocument(srcElm);

    // if the combo box has not been created or the event did not
    // come from a combo box, do not handle keyboard events
    if (srcElm.nodeName.toLowerCase() != "input" || srcElm.parentNode.getAttribute("id") == null || srcElm.parentNode.getAttribute("id").indexOf("_combobox") == -1)
    {
        if (StylerBase._currentComboBox != null && StylerBase._currentComboBox.className == "inforDropDownOpen")
        {
            selectID = StylerBase._currentComboBox.getAttribute("selectID");
            var textBox = doc.getElementById(selectID + "_comboboxinput");
            srcElm = textBox;
        }
        else
        {
            return;
        }
    }

    var comboBoxObj = null;
    selectID = srcElm.parentNode.getAttribute("id");
    if (selectID != null)
    {
        selectID = selectID.replace(new RegExp("_combobox\\b"), "");
        comboBoxObj = doc.getElementById(selectID + "_comboboxlist");
    }

    if (!comboBoxObj)
    {
        return;
    }

    var caught = false;
    var vis = (comboBoxObj.className == "inforDropDownOpen");

    switch (evt.keyCode)
    {
        case 9:         //tab
            if (srcElm.form)
            {
                // find the index of the combo box in the parent form
                var srcForm = srcElm.form;
                var len = srcForm.length;
                var elmIndex = -1;
                for (var j=0; j<len; j++)
                {
                    if (srcForm[j] == srcElm)
                    {
                        elmIndex = j;
                        break;
                    }
                }
                // tab to the next element
                if (elmIndex != -1)
                {
                    // close the combo box
                    StylerBase.closeComboBox(comboBoxObj);

                    // unselect the combo box text
                    var srcText = srcElm.value;
                    srcElm.value = "";
                    srcElm.value = srcText;

                    // set focus on the next element in the parent form
                    var nextIndex = (evt.shiftKey) ? (elmIndex - 1) % len : (elmIndex + 1) % len;
                    var nextElm = srcForm[nextIndex];
                    var success = false;
                    while (!success && ((evt.shiftKey && nextIndex > 0) || (!evt.shiftKey && nextIndex < len)))
                    {
                        try
                        {
                            if (nextElm.className == "inforHidden" ||
                                nextElm.style.display == "none" ||
                                nextElm.style.visibility == "hidden")
                            {
                                if (evt.shiftKey)
                                {
                                    nextIndex--;
                                }
                                else
                                {
                                    nextIndex++;
                                }
                                nextElm = srcForm[nextIndex];
                            }
                            else
                            {
                                nextElm.focus();
                                success = true;
                            }
                        }
                        catch(e)
                        {
                            if (evt.shiftKey)
                            {
                                nextIndex--;
                            }
                            else
                            {
                                nextIndex++;
                            }
                            nextElm = srcForm[nextIndex];
                        }
                    }
                }
            }
            caught = true;
            break;
        case 33:        //page up
            var loadedAttribute = comboBoxObj.getAttribute("loaded");
            if (loadedAttribute == null || loadedAttribute != "1")
            {
                StylerBase.loadComboBox(comboBoxObj);
            }
            cbItems = comboBoxObj.getElementsByTagName("li");
            selIndex = StylerBase.getComboBoxSelectedIndex(comboBoxObj);
            if (selIndex - StylerBase._comboBoxPageSize >= 0)
            {
                // select the first item in the previous page
                StylerBase.selectComboBoxItem(evt, cbItems[selIndex - StylerBase._comboBoxPageSize], vis, true);
            }
            else
            {
                // select the first item in the list
                StylerBase.selectComboBoxItem(evt, cbItems[0], vis, true);
            }
            caught = true;
            break;
        case 34:        //page down
            var loadedAttribute = comboBoxObj.getAttribute("loaded");
            if (loadedAttribute == null || loadedAttribute != "1")
            {
                StylerBase.loadComboBox(comboBoxObj);
            }
            cbItems = comboBoxObj.getElementsByTagName("li");
            selIndex = StylerBase.getComboBoxSelectedIndex(comboBoxObj);
            if (selIndex + StylerBase._comboBoxPageSize < cbItems.length)
            {
                // select the first item in the next page
                StylerBase.selectComboBoxItem(evt, cbItems[selIndex + StylerBase._comboBoxPageSize], vis, true);
            }
            else
            {
                // select the last item in the list
                StylerBase.selectComboBoxItem(evt, cbItems[cbItems.length - 1], vis, true);
            }
            caught = true;
            break;
        case 13:        //enter
            if (vis)
            {
                // find and select the highlighted item
                StylerBase.selectHilightedItem(evt, comboBoxObj, true);
                caught = true;
            }
            break;
        case 38:        //up arrow
            var loadedAttribute = comboBoxObj.getAttribute("loaded");
            if (loadedAttribute == null || loadedAttribute != "1")
            {
                StylerBase.loadComboBox(comboBoxObj);
            }
            cbItems = comboBoxObj.getElementsByTagName("li");
            selIndex = cbItems.length;
            if (!vis)
            {
                // if Alt and up arrow keys are pressed when
                // the combo box is closed, open the combo box
                if (evt.altKey)
                {
                    StylerBase.openComboBox(comboBoxObj, wnd);
                    return;
                }

                selIndex = StylerBase.getComboBoxSelectedIndex(comboBoxObj);
            }
            else
            {
                // if Alt and up arrow keys are pressed when
                // the combo box is open, close the combo box
                if (evt.altKey)
                {
                    StylerBase.closeComboBox(comboBoxObj);
                    return;
                }

                selIndex = StylerBase.getComboBoxHilightedIndex(comboBoxObj);
            }
            if (selIndex > 0)
            {
                StylerBase.unhilightComboBoxItem(cbItems[selIndex]);
                StylerBase.selectComboBoxItem(evt, cbItems[selIndex - 1], vis, true);
            }
            else if (comboBoxObj.getAttribute("openDir") != null && comboBoxObj.getAttribute("openDir") == "up" && selIndex == -1)
            {
                StylerBase.selectComboBoxItem(evt, cbItems[cbItems.length - 1], vis, true);
            }
            caught = true;
            break;
        case 40:        //down arrow
            var loadedAttribute = comboBoxObj.getAttribute("loaded");
            if (loadedAttribute == null || loadedAttribute != "1")
            {
                StylerBase.loadComboBox(comboBoxObj);
            }
            cbItems = comboBoxObj.getElementsByTagName("li");
            selIndex = -1;
            if (!vis)
            {
                // if Alt and down arrow keys are pressed when
                // the combo box is closed, open the combo box
                if (evt.altKey)
                {
                    StylerBase.openComboBox(comboBoxObj, wnd);
                    return;
                }

                selIndex = StylerBase.getComboBoxSelectedIndex(comboBoxObj);
            }
            else
            {
                // if Alt and down arrow keys are pressed when
                // the combo box is open, close the combo box
                if (evt.altKey)
                {
                    StylerBase.closeComboBox(comboBoxObj);
                    return;
                }

                selIndex = StylerBase.getComboBoxHilightedIndex(comboBoxObj);
            }
            if (cbItems.length - 1 > selIndex)
            {
                if (selIndex >= 0)
                {
                    StylerBase.unhilightComboBoxItem(cbItems[selIndex]);
                }
                StylerBase.selectComboBoxItem(evt,
                                              cbItems[selIndex + 1],
                                              vis,
                                              true);
            }
            caught = true;
            break;
        default:        // character input
            var loadedAttribute = comboBoxObj.getAttribute("loaded");
            if (loadedAttribute == null || loadedAttribute != "1")
            {
                StylerBase.loadComboBox(comboBoxObj);
            }
            // auto select the first item that matches the entered character
            var key = String.fromCharCode(evt.keyCode);
            cbItems = comboBoxObj.getElementsByTagName("li");
            var itemTxt = "";
            var firstChar = -1;
            var cbItem = null;
            var hiIndex = StylerBase.getComboBoxSelectedIndex(comboBoxObj);
            var selectedItem = false;

            // first, search from the selected item to the end of the list
            for (var i=hiIndex+1; i<cbItems.length; i++)
            {
                cbItem = cbItems[i];
                itemTxt = (cbItem.innerText) ? cbItem.innerText : ((cbItem.textContent) ? cbItem.textContent : "");
                firstChar = itemTxt.search(/\S/i);
                if (firstChar >= 0 && itemTxt.charAt(firstChar).toLowerCase() == key.toLowerCase())
                {
                    StylerBase.selectComboBoxItem(evt, cbItem, vis, true);
                    selectedItem = true;
                    break;
                }
            }

            // if no match was found, search from the first item to the item preceding the selected item
            if (!selectedItem && hiIndex != -1)
            {
                for (var j=0; j<hiIndex; j++)
                {
                    cbItem = cbItems[j];
                    itemTxt = (cbItem.innerText) ? cbItem.innerText : ((cbItem.textContent) ? cbItem.textContent : "");
                    firstChar = itemTxt.search(/\S/i);
                    if (firstChar >= 0 && itemTxt.charAt(firstChar).toLowerCase() == key.toLowerCase())
                    {
                        StylerBase.selectComboBoxItem(evt, cbItem, vis, true);
                        selectedItem = true;
                        break;
                    }
                }
            }
            break;
    }

    if (caught)
    {
        evt.cancelBubble = true;
    }

    return caught;
};

//-----------------------------------------------------------------------------
StylerBase.openTitleBarMenu = function(wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

	var menuDropDown = wnd.document.getElementById("titleBarMenu");
	var menuBtn = wnd.document.getElementById("titleBarDropDownButton");
	
	if (!menuDropDown || !menuBtn)
		return;
	
	var menuList = menuDropDown.childNodes[0];
	var lis = menuList.getElementsByTagName("li");
    	
    menuList.className = "inforDropDownOpen";

    // position it
    var menuWidth = (menuList.clientWidth < 100) ? 100 : menuList.clientWidth;
    var menuPos = wnd.PositionObject.getInstance(menuBtn);
    var leftPos;
	var stylerObj = StylerBase._singleton;
	if (stylerObj && stylerObj.textDir == "rtl")
	{
		leftPos = menuPos.left;
	}
	else
	{
    	leftPos = menuPos.right - menuWidth;
    }
    var topPos = menuPos.thetop + menuPos.height;

    menuList.setAttribute("openDir", "down");
    menuList.style.height = "auto";
    menuList.style.width = menuWidth + "px";

    menuList.style.left = leftPos + "px";
    menuList.style.top =  topPos + "px";

    // add a mouse down handler on the document body to collapse the menu
    // when the user clicks the mouse outside the dropdown
    var mouseDownAttribute = wnd.document.body.getAttribute("styler_mousedown");
    if (mouseDownAttribute == null || mouseDownAttribute != "1")
    {
        StylerBase.addEvent(wnd.document, "mousedown",
            function(evt)
            {
                evt = (evt) ? evt : ((wnd.event) ? wnd.event : "");
                StylerBase.closeOpenControls(evt, wnd);
                // "bubble up" this event to the parent element
                try
                {
                	if (typeof(wnd.parent != wnd && wnd.parent["StylerBase"]) != "undefined")
                	{
                		wnd.parent.StylerBase.closeOpenControls(evt, parent.wnd);
                	}
                }
                catch(e)
                {}
            });
        wnd.document.body.setAttribute("styler_mousedown", "1");
    }    	
};

//-----------------------------------------------------------------------------
StylerBase.isMouseOutsideTitleBarMenu = function(evt, menuList)
{
    if (!menuList)
    {
        return false;
    }

    // get the position of the mouse
    var doc = StylerBase.getElementDocument(menuList);
 	var menuBtn = doc.getElementById("titleBarDropDownButton");   
    var docElm = (doc.documentElement && (doc.documentElement.scrollLeft || doc.documentElement.scrollTop)) 
    	? doc.documentElement : doc.body;	
    var mouseX = evt.clientX;
	var stylerObj = StylerBase._singleton;
	if (stylerObj && stylerObj.textDir == "rtl")
	{
		mouseX -= docElm.scrollLeft;
	}
	else
	{    
		mouseX += docElm.scrollLeft;
    }
    var mouseY = evt.clientY + docElm.scrollTop;

    // get the position of dropdown
    var menuWidth = (menuList.clientWidth < 100) ? 100 : menuList.clientWidth;
    var menuListPos = window.PositionObject.getInstance(menuList);
    var menuBtnPos = window.PositionObject.getInstance(menuBtn);
    var leftPos;
	if (stylerObj && stylerObj.textDir == "rtl")
	{
		leftPos = menuBtnPos.left;
	}
	else
	{
    	leftPos = menuBtnPos.right - menuWidth;
    }    
    var topPos = menuBtnPos.thetop + menuBtnPos.height;

    // set the outer boundary positions (total width and height) 
    var totalWidth = menuWidth;
    var totalHeight = menuListPos.height;
    
    return (mouseX < leftPos ||
           mouseX > (leftPos + totalWidth) ||
           mouseY < topPos ||
           mouseY > (topPos + totalHeight));
};

//-----------------------------------------------------------------------------
StylerBase.collapseTitleBarMenu = function(evt, menuList)
{
	if (!menuList)
	{
		return;
	}	
    if (StylerBase.isMouseOutsideTitleBarMenu(evt, menuList))
    {
        StylerBase.closeTitleBarMenu(menuList);
    }	
};

//-----------------------------------------------------------------------------
StylerBase.closeTitleBarMenu = function(menuList)
{
    if (!menuList)
    {
        return;
    }
	menuList.className = "inforDropDown";
};

//
// Radio button functions
//-----------------------------------------------------------------------------
StylerBase.resetRadioButtons = function(formObj, radioNm)
{
    if (!formObj)
    {
        return;
    }

    var formElms = formObj.elements;
    var pElm = null;
    var pLen = formElms.length;

    for (var i=0; i<pLen; i++)
    {
        pElm = formElms[i];
        if (pElm.getAttribute("type") == "radio" &&
            pElm.getAttribute("name") == radioNm &&
			pElm.getAttribute("styledAs") == StylerBase.ElementTypeInputRadio)
        {
            if (!pElm.checked)
            {
                pElm.parentNode.className = "inforRadioButtonOff";
            }
        }
    }
};

//base prototype methods
//-----------------------------------------------------------------------------
StylerBase.prototype.modifyDOM = function(wnd)
{
    var stylerElements;
    if (!wnd)
    {
        wnd = window;
    }

    stylerElements = this.getLikeElements(wnd, "", "styler", "");
    var len = stylerElements.length;

    for (var i=0; i<len; i++)
    {
        if (stylerElements[i].getAttribute("styler") == "hidden")
        {
            this.processHiddenElement(wnd, stylerElements[i]);
            continue;
        }

        var tagName = stylerElements[i].tagName.toLowerCase();
        switch (tagName)
        {
            case "input":
                this.processInputElement(wnd, stylerElements[i]);
                break;

            case "button":
                this.processButtonElement(wnd, stylerElements[i]);
                break;

            case "div":
                this.processDivElement(wnd, stylerElements[i]);
                break;

            case "select":
                this.processComboBoxElement(wnd, stylerElements[i]);
                break;

            case "span":
                this.processSpanElement(wnd, stylerElements[i]);
                break;

            case "table":
                this.processTableElement(wnd, stylerElements[i]);
                break;

            case "img":
                this.processImageElement(wnd, stylerElements[i]);
                break;

            case "textarea":
                this.processTextAreaElement(wnd, stylerElements[i]);
                break;

            case "a":
                this.processHyperlinkElement(wnd, stylerElements[i]);
                break;

            default:
                stylerElements[i].setAttribute("styledAs", StylerBase.ElementTypeUnknown);
                if (this.moreInfo)
                {
                    alert("STYLER attribute with unsupported tag of: " +
                          tagName);
                    debugger;
                }
                break;
        }
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processHiddenElement = function(wnd, theElement)
{
    // Return if already styled
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeHidden)
    {
        return;
    }

    if (!wnd)
    {
        wnd = window;
    }

    theElement.className = "inforHidden";
    theElement.setAttribute("styledAs", StylerBase.ElementTypeHidden);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processTableElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    var stylerAttribute = theElement.getAttribute("styler");

    switch (stylerAttribute)
    {
        case "list":
        case "datagrid":	
            this.processListElement(wnd, theElement);
            break;
            
        // TODO: add cases for filter or sorted list?
        
        default:
            theElement.setAttribute("styledAs", StylerBase.ElementTypeTableUnknown);
            if (this.moreInfo)
            {
                alert("STYLER attribute on TABLE tag with unsupported styler value of: " + stylerAttribute);
                debugger;
            }
            break;
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processListElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    this.processListElementColumns(wnd, theElement);
    this.processListElementRows(wnd, theElement);

    if (this.moreInfo)
    {
        if (theElement.className != "")
        {
            alert("Replacing " + theElement.className + " with inforDataGrid");
            debugger;
        }
        this.elementWarnings(wnd, theElement);
    }

    theElement.className = "inforDataGrid";
    theElement.setAttribute("cellspacing", "0");
    theElement.setAttribute("cellpadding", "0");
    theElement.setAttribute("border", "0");
    theElement.cellSpacing = 0;
    theElement.cellPadding = 0;
    theElement.setAttribute("styledAs", StylerBase.ElementTypeList);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.setListElementColumnMouseovers = function(tblHdr)
{
	if (!tblHdr)
		return;
	
	tblHdr.onmouseover = function()
	{
		this.className = "inforDataGridColumnHeaderOver";
	};
	
	tblHdr.onmouseout = function()
	{
		this.className = "inforDataGridColumnHeader";
	};	
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processListElementColumns = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

	var drillDown = theElement.getAttribute("styler_drilldown") == "true";
	var rows = theElement.getElementsByTagName("tr");
	var rowsNotStyled = this.getLikeDescendants(theElement, "tr", "styler", "skip");	

    if (rows.length - rowsNotStyled.length > 0)
    {	
    	rows[0].className = "inforDataGridColumnRow";
    	if (rows[0].getAttribute("style") != "")
    	{
    		rows[0].removeAttribute("style");
    	}
		var hdrs = rows[0].getElementsByTagName("th");
		// has this row been styled already?
		if (hdrs.length == 0 || hdrs[0].className == "inforDataGridColumnHeader")
		{
			return;
		}
		if (drillDown && !this.dataGridDrillDownColumnExists(theElement))
		{
			var drillHdr = wnd.document.createElement("th");
			drillHdr.className = "inforDataGridColumnHeader";
			drillHdr.appendChild(wnd.document.createTextNode("\u00a0"));
			if (hdrs.length > 0)
				rows[0].insertBefore(drillHdr, hdrs[0]);
			else
				rows[0].appendChild(drillHdr);
			hdrs = rows[0].getElementsByTagName("th");
		}
		var len = hdrs.length;
		for (var i=0; i<len; i++)
		{
			var hdr = hdrs[i];		
			hdr.className = "inforDataGridColumnHeader";
			var clickAttribute = hdr.getAttribute("styler_click");
			var sortAttribute = hdr.getAttribute("styler_sort");
			var initAttribute = hdr.getAttribute("styler_init");

			this.setListElementColumnMouseovers(hdr);
			
			var nameSpan = wnd.document.createElement("span");	
			var arrowSpan = wnd.document.createElement("span");	
			// insert the child nodes of the table header into the new header span
			if (hdr.childNodes.length > 0)
			{
				var clen = hdr.childNodes.length;
				var firstNode;
				for (var j=clen-1; j>=0; j--)
				{
					firstNode = (nameSpan.childNodes.length > 0) ? nameSpan.childNodes[0] : null;
					nameSpan.insertBefore(hdr.childNodes[j], firstNode);
				}
			}	
			if (sortAttribute != null)
			{
				nameSpan.className = "inforDataGridColumnNameSorted";
				arrowSpan.className = (sortAttribute.toLowerCase() == "descending") ? "inforSortIndicatorDesc" : "inforSortIndicatorAsc";
				nameSpan.setAttribute("styler_sort", sortAttribute);				
				// Remove the sort indicator in cases where none of the fields are yet sorted.
				if (sortAttribute == "none")
					arrowSpan.className = "";
			}
			else
			{
				nameSpan.className = "inforDataGridColumnName";				
			}						

			if (clickAttribute != null)
			{
				nameSpan.setAttribute("styler_click", clickAttribute);
				hdr.onclick = function()
				{
					var sAttr = this.getAttribute("styler_sort");
					var nSpan = (this.childNodes.length > 0) ? this.childNodes[0] : null;
					var aSpan = (this.childNodes.length > 1) ? this.childNodes[1] : null;

					if (sAttr != null && nSpan != null && aSpan != null)
					{
						nSpan.className = "inforDataGridColumnNameSorted";
						if (sAttr.toLowerCase() == "ascending")
						{
							aSpan.className = "inforSortIndicatorDesc";
							nSpan.setAttribute("styler_sort", "descending");
						}
						else
						{
							aSpan.className = "inforSortIndicatorAsc";
							nSpan.setAttribute("styler_sort", "ascending");
						}
					}

					var clickAttr = this.getAttribute("styler_click");
					if (clickAttr != null)
					{
						wnd = (typeof(wnd) == "undefined" || !wnd) ? window : wnd;
						StylerBase.performFunctionCallback(wnd, clickAttr, new Array(wnd, this));
					}					
				};
			}			
		
			hdr.innerHTML = "";
			hdr.appendChild(nameSpan);
			hdr.appendChild(arrowSpan);
			
			if (initAttribute != null)
			{
				StylerBase.performFunctionCallback(wnd, initAttribute, new Array(wnd, hdr));
			}			
		}    
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.getTableHeadBodyFoot = function(theElement)
{
    var tableHBF = {};

    tableHBF.isThead = false;
    tableHBF.isTbody = false;
    tableHBF.isTfoot = false;

    tableHBF.theadCountRows = 0;
    tableHBF.theadRows = null;
    tableHBF.theadElement = null;
    tableHBF.theadCountRowsNotStyled = 0;
    tableHBF.theadRowsNotStyled = null;
    var elementList = theElement.getElementsByTagName("thead");
    var i = 0;
    for (i = 0; i < elementList.length; i++)
    {
        if (elementList[i].parentNode == theElement)
        {
            tableHBF.theadElement = elementList[i];
            tableHBF.theadRows = tableHBF.theadElement.getElementsByTagName("tr");
            tableHBF.theadCountRows = tableHBF.theadRows.length;
            tableHBF.isThead = true;
            tableHBF.theadRowsNotStyled = this.getLikeDescendants(tableHBF.theadElement, "tr", "styler", "skip");
            tableHBF.theadCountRowsNotStyled = tableHBF.theadRowsNotStyled.length;
            break;
        }
    }

    tableHBF.tbodyCountRows = 0;
    tableHBF.tbodyRows = null;
    tableHBF.tbodyElement = null;
    tableHBF.tbodyCountRowsNotStyled = 0;
    tableHBF.tbodyRowsNotStyled = null;
    elementList = theElement.getElementsByTagName("tbody");
    for (i = 0; i < elementList.length; i++)
    {
        if (elementList[i].parentNode == theElement)
        {
            tableHBF.tbodyElement = elementList[i];
            tableHBF.tbodyRows = tableHBF.tbodyElement.getElementsByTagName("tr");
            tableHBF.tbodyCountRows = tableHBF.tbodyRows.length;
            tableHBF.isTbody = true;
            tableHBF.tbodyRowsNotStyled = this.getLikeDescendants(tableHBF.tbodyElement, "tr", "styler", "skip");
            tableHBF.tbodyCountRowsNotStyled = tableHBF.tbodyRowsNotStyled.length;
            break;
        }
    }

    tableHBF.tfootCountRows = 0;
    tableHBF.tfootRows = null;
    tableHBF.tfootElement = null;
    tableHBF.tfootCountRowsNotStyled = 0;
    tableHBF.tfootRowsNotStyled = null;
    elementList = theElement.getElementsByTagName("tfoot");
    for (i = 0; i < elementList.length; i++)
    {
        if (elementList[i].parentNode == theElement)
        {
            tableHBF.tfootElement = elementList[i];
            tableHBF.tfootRows = tableHBF.tfootElement.getElementsByTagName("tr");
            tableHBF.tfootCountRows = tableHBF.tfootRows.length;
            tableHBF.isTfoot = true;
            tableHBF.tfootRowsNotStyled = this.getLikeDescendants(tableHBF.tfootElement, "tr", "styler", "skip");
            tableHBF.tfootCountRowsNotStyled = tableHBF.tfootRowsNotStyled.length;
            break;
        }
    }

    return tableHBF;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processListElementRows = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    var tableHeadBodyFoot = this.getTableHeadBodyFoot(theElement);
    var rows = null;
    var hdrs = null;
    var drillDownExists = false;
    var drillDown = theElement.getAttribute("styler_drilldown") == "true";
    var countRowsNotStyled = 0;
    var editableData = theElement.getAttribute("styler_edit") == "true";
    var editableCols = new Array();
    if (tableHeadBodyFoot.isTbody)
    {
        rows = tableHeadBodyFoot.tbodyRows;
        countRowsNotStyled = tableHeadBodyFoot.tbodyCountRowsNotStyled;
    }
    else
    {
        rows = theElement.getElementsByTagName("tr");
        var rowsNotStyled = this.getLikeDescendants(theElement, "tr", "styler", "skip");
        countRowsNotStyled = rowsNotStyled.length;
    }

    if (rows.length - countRowsNotStyled > 0)
    {
        var hdrRow = null;
        var firstRowIndex = 0;
        if (tableHeadBodyFoot.isThead && tableHeadBodyFoot.theadCountRows > 0)
        {
            hdrRow = tableHeadBodyFoot.theadRows[0];
            if (!tableHeadBodyFoot.isTbody)
            	firstRowIndex++;
        }
        else
        {
            while (rows[firstRowIndex].getAttribute("styler") == "skip")
            {
                firstRowIndex++;
            }
            hdrRow = rows[firstRowIndex];
            firstRowIndex++;
        }
        hdrs = hdrRow.getElementsByTagName("th");
        if (editableData)
        {
	        var len = hdrs.length;
	        for (var i=0; i<len; i++)
	        {
	        	editableCols[i] = hdrs[i].getAttribute("styler_edit") == "true";
	        }
        }

        // style the remaining rows
        if (rows.length > firstRowIndex)
        {
            var firstRow = rows[firstRowIndex];
            var cells = firstRow.cells;

            // is there a drilldown column?
            if (cells.length > 0)
            {
            	var typeAttr = cells[0].getAttribute("type");
            	if (typeAttr != null && typeAttr == "styler_drilldown")
                	drillDownExists = true;
            }

            // style rows
            for (var j=firstRowIndex; j<rows.length; j++)
            {
            	var cells = rows[j].cells;
				if (rows[j].getAttribute("styled") == "true")
				{
					continue;
				}
	            // insert the drilldown column if it doesn't exist
	            if (!drillDownExists && drillDown)
	            {
					var drillAnchor = wnd.document.createElement("a");
					drillAnchor.className = "inforDrillDown";
					drillAnchor.style.border = "none";
					drillAnchor.onmouseover = function()
					{
						this.className = "inforDrillDownOver";
					}
					drillAnchor.onmousedown = function()
					{
						this.className = "inforDrillDownActive";
					}
					drillAnchor.onmouseout = function()
					{
						this.className = "inforDrillDown";
					}
	
					var addIcon = this.initListRowDrillDown(wnd, rows[j], drillAnchor);	
					var drillDownColExists = false;
					if (cells.length > 0)
					{
						var elms = cells[0].getElementsByTagName("input");
						var elen = elms.length;
						for (var k=0; k<elen; k++)
						{
							if (elms[k].getAttribute("type") == "checkbox")
							{
								drillDownColExists = true;
								break;
							}
						}
					}
					if (drillDownColExists)
					{
						drillAnchor.style.margin = "0px 0px 0px 3px";
						cells[0].setAttribute("type", "styler_drilldown");
						cells[0].setAttribute("align", "center");
						cells[0].style.textAlign = "center";
						if(addIcon)
							cells[0].appendChild(drillAnchor);
						else
							cells[0].appendChild(wnd.document.createTextNode("\u00a0"));
					}
					else
					{
						var drillCell = wnd.document.createElement("td");
						drillCell.setAttribute("type", "styler_drilldown");
						drillCell.setAttribute("align", "center");
						drillCell.style.textAlign = "center";
						if(addIcon)
							drillCell.appendChild(drillAnchor);
						else
							drillCell.appendChild(wnd.document.createTextNode("\u00a0"));
						if (cells.length > 0)
							rows[j].insertBefore(drillCell, cells[0]);
						else
							rows[j].appendChild(drillCell);	
						cells = rows[j].cells;	
					}					
	            }
                rows[j].className = "inforDataGridRow";
		    	if (rows[j].getAttribute("style") != "")
		    	{
		    		rows[j].removeAttribute("style");
		    	}                
                rows[j].onmouseover = function()
                {
                    StylerBase.highlightListRow(this);
                };
                rows[j].onmouseout = function()
                {
                    StylerBase.unhighlightListRow(this);
                };
				if (editableData)
				{
	                var clen = cells.length;
	                for (var k=0; k<clen; k++)
	                {
	                	if (editableCols[k] || (cells[k].getAttribute("styler_edit") == "true"))
	                	{
	                		cells[k].className = "inforDataGridCellEditable";
	                	}	
	                }
                }
                rows[j].setAttribute("styled", "true");
            }
        }
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.dataGridDrillDownColumnExists = function(theElement)
{
	var drillDownColExists = false;
	var tableHeadBodyFoot = this.getTableHeadBodyFoot(theElement);
	var bodyRows;
	if (tableHeadBodyFoot.isTbody)
	{
		bodyRows = tableHeadBodyFoot.tbodyRows;
	}
	else
	{
		bodyRows = theElement.getElementsByTagName("tr");
	}
	var firstRowIndex = 0;
	if (tableHeadBodyFoot.isThead && tableHeadBodyFoot.theadCountRows > 0)
	{
		if (!tableHeadBodyFoot.isTbody)
			firstRowIndex++;
	}
	else
	{
		while (bodyRows[firstRowIndex].getAttribute("styler") == "skip")
		{
			firstRowIndex++;
		}
		firstRowIndex++;
	}
	if (bodyRows.length > firstRowIndex)
	{
		var bodyCells = bodyRows[firstRowIndex].cells;
		if (bodyCells.length > 0)
		{
			if (bodyCells[0].getAttribute("type") == "styler_drilldown")
			{
				drillDownColExists = true;
			}
			else
			{
				var elms = bodyCells[0].getElementsByTagName("input");
				var elen = elms.length;
				for (var k=0; k<elen; k++)
				{
					if (elms[k].getAttribute("type") == "checkbox")
					{
						drillDownColExists = true;
						break;
					}
				}
			}
		}
	}
	return drillDownColExists;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.initListRowDrillDown = function(wnd, row, drillAnchor)
{
	//Override this method for your app!
}

//-----------------------------------------------------------------------------
StylerBase.prototype.processImageElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    var stylerAttribute = theElement.getAttribute("styler");

    switch (stylerAttribute)
    {
        case "help":
            this.processHelpIconElement(wnd, theElement);
            break;
        case "drill":
            this.processDrillIconElement(wnd, theElement);
            break;
        case "settings":
            this.processSettingsIconElement(wnd, theElement);
            break;
        default:
            theElement.setAttribute("styledAs", StylerBase.ElementTypeImgUnknown);
            if (this.moreInfo)
            {
                alert("STYLER attribute on IMG tag with unsupported styler value of: " + stylerAttribute);
                debugger;
            }
            break;
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processHelpIconElement = function(wnd, theElement)
{
    // Return if already styled
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeHelpIcon)
    {
        return;
    }

    if (!wnd)
    {
        wnd = window;
    }

    theElement.src = StylerBase.webappjsURL + "/infor/images/btn_help_22x20_enabled.gif";
    theElement.style.width = "22px";
    theElement.style.height = "20px";
    theElement.setAttribute("width", "22");
    theElement.setAttribute("height", "20");
    theElement.onmouseover = function()
    {
        this.src = StylerBase.webappjsURL + "/infor/images/btn_help_22x20_over.gif";
    };
    theElement.onmousedown = function()
    {
        this.src = StylerBase.webappjsURL + "/infor/images/btn_help_22x20_press.gif";
    };
    theElement.onmouseout = function()
    {
        this.src = StylerBase.webappjsURL + "/infor/images/btn_help_22x20_enabled.gif";
    };
    theElement.setAttribute("styledAs", StylerBase.ElementTypeHelpIcon);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processDrillIconElement = function(wnd, theElement)
{
    // Return if already styled
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeDrillIcon)
    {
        return;
    }

    if (!wnd)
    {
        wnd = window;
    }
    
    var drillSpan = wnd.document.createElement("span");
    drillSpan.className = "inforDrillDown";
	drillSpan.onmouseover = function()
	{
		this.className = "inforDrillDownOver";
	}
	drillSpan.onmousedown = function()
	{
		this.className = "inforDrillDownActive";
	}
	drillSpan.onmouseout = function()
	{
		this.className = "inforDrillDown";
	}    
    if (theElement.getAttribute("alt") != null)
    {
    	drillSpan.setAttribute("title", theElement.getAttribute("alt")); 
    }
    
    if (theElement.parentNode.nodeName.toLowerCase() == "a")
    {
    	theElement.parentNode.style.border = "none";
        theElement.parentNode.onmouseover = null;
        theElement.parentNode.onmouseout = null;    
    }    

    theElement.setAttribute("styledAs", StylerBase.ElementTypeDrillIcon);
	var oldChild = theElement.parentNode.replaceChild(drillSpan, theElement);
};


//-----------------------------------------------------------------------------
StylerBase.prototype.processSettingsIconElement = function(wnd, theElement)
{
    // Return if already styled
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeSettingsIcon)
    {
        return;
    }

    if (!wnd)
    {
        wnd = window;
    }

    theElement.src = StylerBase.webappjsURL + "/infor/images/btn_settings_22x20_enabled.png";
    theElement.style.width = "22px";
    theElement.style.height = "20px";
    theElement.setAttribute("width", "22");
    theElement.setAttribute("height", "20");
    theElement.onmouseover = function()
    {
        this.src = StylerBase.webappjsURL + "/infor/images/btn_settings_22x20_over.png";
    };
    theElement.onmousedown = function()
    {
        this.src = StylerBase.webappjsURL + "/infor/images/btn_settings_22x20_press.png";
    };
    theElement.onmouseout = function()
    {
        this.src = StylerBase.webappjsURL + "/infor/images/btn_settings_22x20_enabled.png";
    };
    theElement.setAttribute("styledAs", StylerBase.ElementTypeSettingsIcon);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processTextAreaElement = function(wnd, theElement)
{
    // Return if already styled
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeTextArea)
    {
        return;
    }

    if (!wnd)
    {
        wnd = window;
    }

    if (theElement.className != "")
    {
        if (this.moreInfo)
        {
            alert("Replacing " + theElement.className + " with textAreaStyler");
            debugger;
        }
    }
    
    if (theElement.disabled || theElement.readOnly)
    {
    	theElement.className = "inforTextAreaReadOnly";
    }
    else
    {
    	theElement.className = "inforTextArea";
		
    }

    theElement.setAttribute("styledAs", StylerBase.ElementTypeTextArea);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processHyperlinkElement = function(wnd, theElement)
{
    // Return if already styled
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeHyperlink)
    {
        return;
    }

    if (!wnd)
    {
        wnd = window;
    }

    if (theElement.className != "")
    {
        if (this.moreInfo)
        {
            alert("Replacing " +
                theElement.className +
                " with inforHyperlink");
            debugger;
        }
    }
    
    theElement.className = "inforHyperlink";
    theElement.setAttribute("styledAs", StylerBase.ElementTypeHyperlink);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processInputElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    var typeAttribute = theElement.getAttribute("type");
	if (typeAttribute == null)
		typeAttribute = "text";
	
    var stylerAttribute = theElement.getAttribute("styler");

    switch (typeAttribute)
    {
        case "text":
            switch (stylerAttribute)
            {
                case "select":
                    this.processSelectElement(wnd, theElement);
                    break;

                case "calendar":
                    this.processCalendarElement(wnd, theElement);
                    break;

                case "search":
                	this.processSearchElement(wnd, theElement);
                    break;

                default:
                    this.processInputTextElement(wnd, theElement);
                    break;
            }
            break;

        case "radio":
            this.processInputRadioElement(wnd, theElement);
            break;

        case "checkbox":
            this.processInputCheckboxElement(wnd, theElement);
            break;

        case "password":
            this.processInputTextElement(wnd, theElement);
            break;

        default:
            theElement.setAttribute("styledAs",
                                    StylerBase.ElementTypeInputUnknown);
            if (this.moreInfo)
            {
                alert("STYLER attribute on INPUT tag " +
                      "with unsupported type of: " +
                      typeAttribute);
                debugger;
            }
            break;
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processSelectElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    var stylerClickAttribute = theElement.getAttribute("styler_click");
    var isDisabled = theElement.disabled;

    // disable/enable existing restyled input selects if the state has changed
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeInputSelect)
    {
        var selectState = "";
        if (isDisabled)
        {
            selectState = "disabled";
        }
        else
        {
            selectState = "enabled";
        }
        if (selectState != theElement.getAttribute("state"))
        {
            theElement.setAttribute("state", selectState);
            var leftSpan = StylerBase.getPreviousSibling(theElement);
            var rightSpan = StylerBase.getNextSibling(theElement);

            leftSpan.className = (theElement.getAttribute("state") == "enabled") ? "inforTextboxLeft" : "inforTextboxLeft inforDisabled";
            rightSpan.className = (theElement.getAttribute("state") == "enabled") ? "inforLookup" : "inforLookupDisabled";
			if (!theElement.disabled)
			{
				this.defineSelectControlOnClickStaticCall(rightSpan, wnd);
			}
			else
			{
				this.clearSelectControlOnClickStaticCall(rightSpan, wnd);
			}
            theElement.className = (theElement.getAttribute("state") == "enabled") ? "inforTextbox" : "inforTextbox inforDisabled";
        }
        return;
    }

    var spanLeft = wnd.document.createElement("span");
    spanLeft.className = "inforTextboxLeft";
    if (theElement.disabled)
    {
        spanLeft.className += " inforDisabled";
    }
    //spanLeft.appendChild(wnd.document.createTextNode("\u00a0"));

    var spanIcon = wnd.document.createElement("span");
    spanIcon.className = "inforLookup";

    if (!theElement.getAttribute("id"))
    {
        var nameAttr = theElement.getAttribute("name");
        theElement.setAttribute("id", nameAttr);
    }

    spanIcon.setAttribute("for", theElement.getAttribute("id"));
    //spanIcon.appendChild(wnd.document.createTextNode("\u00a0"));

    if (theElement.disabled)
    {
    	spanIcon.className = "inforLookupDisabled";
    }
    else
    {
    	this.defineSelectControlOnClickStaticCall(spanIcon, wnd);       
    }

    var newSpan = wnd.document.createElement("span");
    newSpan.className = "inforTextboxWrapper";

    var oldChild = theElement.parentNode.replaceChild(newSpan, theElement);
    newSpan.insertBefore(spanIcon, null);
	newSpan.insertBefore(oldChild, spanIcon);
    newSpan.insertBefore(spanLeft, oldChild);

    if (oldChild.className == "")
    {
        oldChild.className = "inforTextbox";
    }
    else
    {
        if (this.moreInfo)
        {
            alert("Replacing " +
                   oldChild.className +
                   " with inforTextbox");
            debugger;
        }
        oldChild.className = "inforTextbox";
    }

    if (theElement.disabled)
    {
        oldChild.className += " inforDisabled";
    }

    if (!document.all)
    {
    	if (navigator.userAgent.toLowerCase().indexOf('chrome') == -1)
    		oldChild.style.marginTop = "1px";
        oldChild.style.marginBottom = "1px";
    }

    if (this.moreInfo)
    {
        this.elementWarnings(wnd, oldChild);
    }
    oldChild.setAttribute("styledAs", StylerBase.ElementTypeInputSelect);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.defineSelectControlOnClickStaticCall = function(element, wnd)
{
    element.onclick = function()
    {
        StylerBase.selectControlOnClick(this, wnd);
    };               
	element.onmouseover = function()
	{
		this.className = "inforLookupOver";
	};
	element.onmouseout = function()
	{
		this.className = "inforLookup";
 	}; 
	element.onmousedown = function()
	{
		this.className = "inforLookupActive";
	};
};

//-----------------------------------------------------------------------------
StylerBase.prototype.clearSelectControlOnClickStaticCall = function(element, wnd)
{
    element.onclick = function()
    {
    };
	element.onmouseover = null;
	element.onmouseout = null; 
	element.onmousedown = null;    
};

//-----------------------------------------------------------------------------
StylerBase.prototype.defineSearchControlOnClickStaticCall = function(element, wnd)
{
    element.onclick = function(evt)
    {
		if (!evt)
		{
			evt = wnd.event || wnd.Event;
		}
		StylerBase.searchControlOnClick(wnd, this, evt);	
    };               
	element.onmouseover = function()
	{
		this.className = "inforSearchOver";
	};
	element.onmouseout = function()
	{
		this.className = "inforSearch";
 	}; 
	element.onmousedown = function()
	{
		this.className = "inforSearchActive";
	};
};

//-----------------------------------------------------------------------------
StylerBase.prototype.clearSearchControlOnClickStaticCall = function(element, wnd)
{
    element.onclick = function()
    {
    };
	element.onmouseover = null;
	element.onmouseout = null; 
	element.onmousedown = null;    
};

//-----------------------------------------------------------------------------
StylerBase.prototype.defineSpanCalOnclickStaticCall = function(spanCal, wnd)
{
    spanCal.onclick = function(evt)
    {
        if (!evt)
        {
            evt = wnd.event || wnd.Event;
        }

        StylerBase.calendarControlOnClick(wnd, this, evt);
    };
};

//-----------------------------------------------------------------------------
StylerBase.prototype.defineBodyOnmousedownStaticCall = function(wnd)
{
    // close the calendar when the user clicks outside the dropdown
    var mouseDownAttribute = wnd.document.body.getAttribute("styler_mousedown");
    if (mouseDownAttribute == null || mouseDownAttribute != "1")
    {
        StylerBase.addEvent(wnd.document, "mousedown",
            function(evt)
            {
                evt = (evt) ? evt : ((wnd.event) ? wnd.event : "");
                StylerBase.closeOpenControls(evt, wnd);
                // "bubble up" this event to the parent element
                try
                {
                	if (typeof(wnd.parent != wnd && wnd.parent["StylerBase"]) != "undefined")
                	{
                		wnd.parent.StylerBase.closeOpenControls(evt, parent.wnd);
                	}
                }
                catch(e)
                {}                
            });
        wnd.document.body.setAttribute("styler_mousedown", "1");
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processCalendarElement = function(wnd, theElement)
{
    // Return if already styled
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeInputCalendar)
    {
        return;
    }

    if (!wnd)
    {
        wnd = window;
    }

    var spanLeft = wnd.document.createElement("span");
    spanLeft.className = "inforTextboxLeft";
    if (theElement.disabled)
    {
        spanLeft.className += " inforDisabled";
    }
    //spanLeft.appendChild(wnd.document.createTextNode("\u00a0"));

    var spanIcon = wnd.document.createElement("span");
    spanIcon.className = "inforDatePicker";

    if (!theElement.getAttribute("id"))
    {
        var nameAttr = theElement.getAttribute("name");
        theElement.setAttribute("id", nameAttr);
    }

    spanIcon.setAttribute("for", theElement.getAttribute("id"));
    //spanIcon.appendChild(wnd.document.createTextNode("\u00a0"));

	if (theElement.disabled)
	{
		spanIcon.className = "inforDatePickerDisabled";
	}
    else
    {
        this.defineSpanCalOnclickStaticCall(spanIcon, wnd);                
        spanIcon.onmouseover = function()
        {
            this.className = "inforDatePickerOver";
        };
        spanIcon.onmouseout = function()
        {
            this.className = "inforDatePicker";
        }; 
        spanIcon.onmousedown = function()
        {
            this.className = "inforDatePickerActive";
        };        
    }

    var newSpan = wnd.document.createElement("span");
    newSpan.className = "inforTextboxWrapper";

    var oldChild = theElement.parentNode.replaceChild(newSpan, theElement);
    newSpan.insertBefore(spanIcon, null);
	newSpan.insertBefore(oldChild, spanIcon);
    newSpan.insertBefore(spanLeft, oldChild);

    if (oldChild.className == "")
    {
        oldChild.className = "inforTextbox";
    }
    else
    {
        if (this.moreInfo)
        {
            alert("Replacing " +
                   oldChild.className +
                   " with inforTextbox");
            debugger;
        }
        oldChild.className = "inforTextbox";
    }

    if (theElement.disabled)
    {
        oldChild.className += " inforDisabled";
    }

    if (!document.all)
    {
    	if (navigator.userAgent.toLowerCase().indexOf('chrome') == -1)
    		oldChild.style.marginTop = "1px";
        oldChild.style.marginBottom = "1px";
    }

    this.defineBodyOnmousedownStaticCall(wnd);
    if (this.moreInfo)
    {
        this.elementWarnings(wnd, oldChild);
    }
    oldChild.setAttribute("styledAs", StylerBase.ElementTypeInputCalendar);	
    
    //dates and numbers are still left-to-right
    if (this.getCalendarType() == StylerBase.CALENDAR_TYPE_HIJRI)
    {
    	oldChild.setAttribute("dir", "ltr");
    }    
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processSearchElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

	var isDisabled = theElement.disabled;

    // disable/enable existing restyled input selects if the state has changed
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeInputSearch)
    {
        var selectState = "";
        if (isDisabled)
        {
            selectState = "disabled";
        }
        else
        {
            selectState = "enabled";
        }
        if (selectState != theElement.getAttribute("state"))
        {
            theElement.setAttribute("state", selectState);
            var leftSpan = StylerBase.getPreviousSibling(theElement);
            var rightSpan = StylerBase.getNextSibling(theElement);

            leftSpan.className = (theElement.getAttribute("state") == "enabled") ? "inforTextboxLeft" : "inforTextboxLeft inforDisabled";
            rightSpan.className = (theElement.getAttribute("state") == "enabled") ? "inforSearch" : "inforSearchDisabled";
			if (!theElement.disabled)
			{
				this.defineSearchControlOnClickStaticCall(rightSpan, wnd);
			}
			else
			{
				this.clearSearchControlOnClickStaticCall(rightSpan, wnd);
			}
            theElement.className = (theElement.getAttribute("state") == "enabled") ? "inforTextbox" : "inforTextbox inforDisabled";
        }
        return;
    }

    var spanLeft = wnd.document.createElement("span");
    spanLeft.className = "inforTextboxLeft";
    if (theElement.disabled)
    {
        spanLeft.className += " inforDisabled";
    }
    //spanLeft.appendChild(wnd.document.createTextNode("\u00a0"));

    var spanIcon = wnd.document.createElement("span");
    spanIcon.className = "inforSearch";

    if (!theElement.getAttribute("id"))
    {
        var nameAttr = theElement.getAttribute("name");
        theElement.setAttribute("id", nameAttr);
    }

    spanIcon.setAttribute("for", theElement.getAttribute("id"));
    //spanIcon.appendChild(wnd.document.createTextNode("\u00a0"));

    if (theElement.disabled)
    {
    	spanIcon.className = "inforSearchDisabled";
    }
    else
    {
    	this.defineSearchControlOnClickStaticCall(spanIcon, wnd);       
    }

    var newSpan = wnd.document.createElement("span");
    newSpan.className = "inforTextboxWrapper";

    var oldChild = theElement.parentNode.replaceChild(newSpan, theElement);
    newSpan.insertBefore(spanIcon, null);
	newSpan.insertBefore(oldChild, spanIcon);
    newSpan.insertBefore(spanLeft, oldChild);

    if (oldChild.className == "")
    {
        oldChild.className = "inforTextbox";
    }
    else
    {
        if (this.moreInfo)
        {
            alert("Replacing " +
                   oldChild.className +
                   " with inforTextbox");
            debugger;
        }
        oldChild.className = "inforTextbox";
    }

    if (theElement.disabled)
    {
        oldChild.className += " inforDisabled";
    }

    if (!document.all)
    {
    	if (navigator.userAgent.toLowerCase().indexOf('chrome') == -1)
    		oldChild.style.marginTop = "1px";
        oldChild.style.marginBottom = "1px";
    }

    if (this.moreInfo)
    {
        this.elementWarnings(wnd, oldChild);
    }
    oldChild.setAttribute("styledAs", StylerBase.ElementTypeInputSearch);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processInputTextElement = function(wnd, theElement)
{
    // Return if already styled
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeInputText)
    {
		if (theElement.readOnly)
		{
            if (theElement.className.indexOf("inforDisabled") == -1)
			{			
				theElement.className += " inforDisabled";
			}
			var spanLeft = StylerBase.getPreviousSibling(theElement);
            if (spanLeft.className.indexOf("inforDisabled") == -1)
            {
		        spanLeft.className += " inforDisabled";
			}
			var spanRight = StylerBase.getNextSibling(theElement);
            if (spanRight.className.indexOf("inforDisabled") == -1)
			{
		        spanRight.className += " inforDisabled";
			}
		}
        else {
        	var disabledPattern = new RegExp("inforDisabled");
            if (theElement.className.indexOf("inforDisabled") != -1)
			{			
            	theElement.className = theElement.className.replace(disabledPattern, "");
			}
			var spanLeft = StylerBase.getPreviousSibling(theElement);
            if (spanLeft.className.indexOf("inforDisabled") != -1)
            {
            	spanLeft.className = spanLeft.className.replace(disabledPattern, "");
			}
			var spanRight = StylerBase.getNextSibling(theElement);
            if (spanRight.className.indexOf("inforDisabled") != -1)
			{
            	spanRight.className = spanRight.className.replace(disabledPattern, "");
			}
        }		
        return;
    }
    else if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeComboBox)
    {	
    	return;
    }

    if (!wnd)
    {
        wnd = window;
    }

    var spanLeft = wnd.document.createElement("span");
    spanLeft.className = "inforTextboxLeft";
    if (theElement.disabled || theElement.readOnly)
    {
        spanLeft.className += " inforDisabled";
    }
    //spanLeft.appendChild(wnd.document.createTextNode("\u00a0"));

    var spanRight = wnd.document.createElement("span");
	spanRight.className = "inforTextboxRight";

    if (theElement.disabled || theElement.readOnly)
    {
        spanRight.className += " inforDisabled";
    }
    //spanRight.appendChild(wnd.document.createTextNode("\u00a0"));

    var newSpan = wnd.document.createElement("span");
    newSpan.className = "inforTextboxWrapper";

    var oldChild = theElement.parentNode.replaceChild(newSpan, theElement);
    newSpan.insertBefore(spanRight, null);
    newSpan.insertBefore(oldChild, spanRight);
    newSpan.insertBefore(spanLeft, oldChild);

    if (oldChild.className == "")
    {
        oldChild.className = "inforTextbox";
    }
    else
    {
        if (this.moreInfo)
        {
            alert("Replacing " +
                   oldChild.className +
                   " with inforTextbox");
            debugger;
        }
        oldChild.className = "inforTextbox";
    }

    if (theElement.disabled)
    {
        oldChild.className += " inforDisabled";
    }

    if (!document.all)
    {
    	if (navigator.userAgent.toLowerCase().indexOf('chrome') == -1)
    		oldChild.style.marginTop = "1px";
        oldChild.style.marginBottom = "1px";
    }

    if (this.moreInfo)
    {
        this.elementWarnings(wnd, oldChild);
    }
    oldChild.setAttribute("styledAs", StylerBase.ElementTypeInputText);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processInputRadioElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeInputRadio)
    {
        // disable/enable existing restyled check box if the state has changed
        var parNode = theElement.parentNode;
        if (theElement.checked)
        {
        	parNode.className = (theElement.disabled) ? "inforRadioButtonOnDisabled" : "inforRadioButtonOn";	
        }
        else
        {
        	parNode.className = (theElement.disabled) ? "inforRadioButtonOffDisabled" : "inforRadioButtonOff";
        }
        this.attachRadioElementEvents(wnd, parNode, theElement.disabled);
        return;
    }

    var outerSpan = wnd.document.createElement("span");
    var newSpan = wnd.document.createElement("span");
    newSpan.setAttribute("name", theElement.getAttribute("name"));
	if (theElement.checked)
	{
		newSpan.className = (theElement.disabled) ? "inforRadioButtonOnDisabled" : "inforRadioButtonOn";	
	}
	else
	{
		newSpan.className = (theElement.disabled) ? "inforRadioButtonOffDisabled" : "inforRadioButtonOff";
	}	    

    this.attachRadioElementEvents(wnd, newSpan, theElement.disabled);
    theElement.className = "inforHidden";

    outerSpan.appendChild(newSpan);
    var oldChild = theElement.parentNode.replaceChild(outerSpan, theElement);
    newSpan.appendChild(oldChild);
    oldChild.setAttribute("styledAs", StylerBase.ElementTypeInputRadio);
    return;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.attachRadioElementEvents = function(wnd, spanElement, isDisabled)
{
    if (isDisabled)
    {
        spanElement.onmousedown = null;
        spanElement.onmouseup = null;
        spanElement.onmouseover = null;
        spanElement.onmouseout = null;
        spanElement.onclick = null;
    }
    else if (spanElement.onclick == null)
    {
    	spanElement.onclick = function()
    	{
            var radioBtn = (this.childNodes.length > 0) ? this.childNodes[0] : null;     
			if (radioBtn != null)
			{		
				this.className = "inforRadioButtonOn";
	            radioBtn.click();
	            StylerBase.resetRadioButtons(radioBtn.form, this.getAttribute("name"));    		
            }
    	};
        spanElement.onmousedown = function()
        {
            var radioBtn = (this.childNodes.length > 0) ? this.childNodes[0] : null;
            if (radioBtn != null)
            {
				this.className = (radioBtn.checked) ? "inforRadioButtonOnActive" : "inforRadioButtonOffActive";            
            	StylerBase.resetRadioButtons(radioBtn.form, this.getAttribute("name"));
        	}
        };
        spanElement.onmouseup = function()
        {
			var radioBtn = (this.childNodes.length > 0) ? this.childNodes[0] : null;
			if (radioBtn != null)
			{
            	this.className = (radioBtn.checked) ? "inforRadioButtonOn" : "inforRadioButtonOff";
        	}
        };
        spanElement.onmouseover = function()
        {
			var radioBtn = (this.childNodes.length > 0) ? this.childNodes[0] : null;
			if (radioBtn != null)
			{
            	this.className = (radioBtn.checked) ? "inforRadioButtonOnOver" : "inforRadioButtonOffOver";
        	}
        }; 
        spanElement.onmouseout = function()
        {
			var radioBtn = (this.childNodes.length > 0) ? this.childNodes[0] : null;
			if (radioBtn != null)
            {
            	this.className = (radioBtn.checked) ? "inforRadioButtonOn" : "inforRadioButtonOff";
        	}
        };               
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processInputCheckboxElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    // ignore check boxes that do not have the styler attribute value of 'checkbox'.
    if (theElement.getAttribute("styler") != "checkbox")
        return;

    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeInputCheckbox)
    {
        // disable/enable existing restyled check box if the state has changed
        var cbSpan = StylerBase.getPreviousSibling(theElement);
        if (theElement.checked)
        {
        	cbSpan.className = (theElement.disabled) ? "inforCheckboxOnDisabled" : "inforCheckboxOn";	
        }
        else
        {
        	cbSpan.className = (theElement.disabled) ? "inforCheckboxOffDisabled" : "inforCheckboxOff";
        }
        this.attachCheckboxElementEvents(wnd, cbSpan, theElement.disabled);
        return;
    }

    var newSpan = wnd.document.createElement("span");
    newSpan.setAttribute("name", theElement.getAttribute("name"));
	if (theElement.checked)
	{
		newSpan.className = (theElement.disabled) ? "inforCheckboxOnDisabled" : "inforCheckboxOn";	
	}
	else
	{
		newSpan.className = (theElement.disabled) ? "inforCheckboxOffDisabled" : "inforCheckboxOff";
	}    
    this.attachCheckboxElementEvents(wnd, newSpan, theElement.disabled);

    theElement.className = "inforHidden";
    theElement.parentNode.insertBefore(newSpan, theElement);
    theElement.setAttribute("styledAs", StylerBase.ElementTypeInputCheckbox);
};
    
//-----------------------------------------------------------------------------
StylerBase.prototype.attachCheckboxElementEvents = function(wnd, spanElement, isDisabled)
{
    if (isDisabled)
    {
        spanElement.onmousedown = null;
        spanElement.onmouseup = null;
        spanElement.onmouseover = null;
        spanElement.onmouseout = null;        
        spanElement.onclick = null;
    }
    else if (spanElement.onclick == null)
    {
        spanElement.onclick = function(evt)
        {
            evt = (evt) ? evt : ((wnd.event) ? wnd.event : "");
            var srcNode = (evt.srcElement) ? evt.srcElement : ((evt.target) ? evt.target : null);
            
            // only handle the event if it came from the span
            if (srcNode != null && srcNode.nodeName.toLowerCase() == "input")
                return;

            var checkBox = StylerBase.getNextSibling(this);
            this.className = (checkBox.checked) ? "inforCheckboxOff" : "inforCheckboxOn";

            // make sure this event does not bubble up to the span (does not work in firefox)
            evt.cancelBubble = true;
            if (evt.stopPropagation)
            {
            	evt.stopPropagation();
            }
            checkBox.checked = !checkBox.checked;
            if (checkBox.onclick)
            {
            	checkBox.onclick();
            }
        };       
        spanElement.onmousedown = function()
        {
            var checkBox = StylerBase.getNextSibling(this);
			this.className = (checkBox.checked) ? "inforCheckboxOnActive" : "inforCheckboxOffActive";
        };
        spanElement.onmouseup = function()
        {
            var checkBox = StylerBase.getNextSibling(this);
            this.className = (checkBox.checked) ? "inforCheckboxOn" : "inforCheckboxOff";
        };
        spanElement.onmouseover = function()
        {
            var checkBox = StylerBase.getNextSibling(this);
            this.className = (checkBox.checked) ? "inforCheckboxOnOver" : "inforCheckboxOffOver";
        };        
        spanElement.onmouseout = function()
        {
            var checkBox = StylerBase.getNextSibling(this);
            this.className = (checkBox.checked) ? "inforCheckboxOn" : "inforCheckboxOff";
        };        
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processButtonElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    // ignore button elements that do not have the styler attribute value of 'pushbutton'
    // or have been styled as another control
    var stylerAttribute = theElement.getAttribute("styler");
    var elementType = theElement.getAttribute("styledAs");
    if (stylerAttribute != "pushbutton" || (elementType != null && elementType != StylerBase.ElementTypeButton))
    {
        return;
    }

    var isDisabled = theElement.disabled;
    var isSecondary = ((theElement.getAttribute("styler_state") != null) &&
                       (theElement.getAttribute("styler_state") == "secondary"));
    isSecondary = isSecondary || isDisabled;

    // disable/enable existing restyled button if the button state has changed
    if (elementType != null && parseInt(elementType, 10) == StylerBase.ElementTypeButton)
    {
        var btnState = "";

        if (isDisabled)
        {
            btnState = "disabled";
        }
        else if (isSecondary)
        {
            btnState = "secondary";
        }
        else
        {
            btnState = "primary";
        }

        if (btnState != theElement.getAttribute("state"))
        {
            theElement.setAttribute("state", btnState);

            var btnImg = theElement.getElementsByTagName("img")[0];
			if (isDisabled) {
        		btnImg.src = StylerBase.webappjsURL + "/infor/images/btn_ctr_1x20_disabled.png";
			}
			else if (theElement.getAttribute("state") == "primary") {
				btnImg.src = StylerBase.webappjsURL + "/infor/images/btn-form_ctr_1x20_enabled.png";
			}
			else {
				btnImg.src = StylerBase.webappjsURL + "/infor/images/btn_ctr_1x20_enabled.png";
			}

            var btnSpans = theElement.getElementsByTagName("div");
            var btnSpan;

            for (var i = 0; i < btnSpans.length; i++) {
				btnSpan = btnSpans[i];
				
				if (btnSpan.className == null || btnSpan.className == "") {
					continue;
				}
				
				if (btnSpan.className.indexOf("LeftSide") != -1) {
					if (isDisabled)
						btnSpan.className = "inforPushButtonLeftSideDisable";
					else
						btnSpan.className = (theElement.getAttribute("state") == "primary") ? "inforPushButtonLeftSide" : "inforPushButtonSecondaryLeftSide";
				}
				else 
					if (btnSpan.className.indexOf("RightSide") != -1) {
						if (isDisabled)
							btnSpan.className = "inforPushButtonRightSideDisable";
						else
							btnSpan.className = (theElement.getAttribute("state") == "primary") ? "inforPushButtonRightSide" : "inforPushButtonSecondaryRightSide";
					}
					else 
						if (btnSpan.className.indexOf("inforPushButtonContent") != -1) {
							if (isDisabled) {
								btnSpan.className = "inforPushButtonContentDisable";
							}
							else if (theElement.getAttribute("state") == "primary") {
								btnSpan.className = "inforPushButtonContent";
							}	
							else
								btnSpan.className = "inforPushButtonContentSecondary";
						}
						else {
							continue;
						}
				
//				if (isDisabled) {
//					btnSpan.className += " inforDisabled";
//				}
			}

            if (isDisabled)
            {
            	theElement.onmouseover = null;
            	theElement.onmouseout =  null;
            	theElement.onmousedown = null;
            }	
            else
            {	
	            theElement.onmouseover = function()
	            {
	                StylerBase.pushButtonMouseOver(this);
	            };
	
	            theElement.onmouseout = function()
	            {
	                StylerBase.pushButtonMouseOut(this);
	            };
	
	            theElement.onmousedown = function()
	            {
	                StylerBase.pushButtonMousePress(this);
	            };
            }
        }
        return;
    }

    theElement.className = "pushButtonStyler";

    if (isDisabled) {
        theElement.setAttribute("state", "disabled");
    }
    else if (isSecondary) {
        theElement.setAttribute("state", "secondary");
    }
    else {
        theElement.setAttribute("state", "primary");
    }

    var buttonTxt = (theElement.innerText) ? theElement.innerText : ((theElement.textContent) ? theElement.textContent : "");

    if ((buttonTxt == "") && (theElement.childNodes.length > 0 && theElement.childNodes[0].data != null)) {
        buttonTxt = theElement.childNodes[0].data;
    }

    var buttonImg = wnd.document.createElement("img");
	if (isDisabled) {
        buttonImg.src = StylerBase.webappjsURL + "/infor/images/btn_ctr_1x20_disabled.png";
	}
	else if (theElement.getAttribute("state") == "primary") {
        buttonImg.src = StylerBase.webappjsURL + "/infor/images/btn-form_ctr_1x20_enabled.png";
    }
    else {
        buttonImg.src = StylerBase.webappjsURL + "/infor/images/btn_ctr_1x20_enabled.png";
    }

    var spanLeft = wnd.document.createElement("div");
    if (isDisabled) {
		spanLeft.className += "inforPushButtonLeftSideDisable";
	}
	else {
		spanLeft.className = (theElement.getAttribute("state") == "primary") ? "inforPushButtonLeftSide" : "inforPushButtonSecondaryLeftSide";
	}

    var spanMid = wnd.document.createElement("div");
    if (isDisabled) {
        spanMid.className = "inforPushButtonContentDisable";
    }
	else if (theElement.getAttribute("state") == "primary") {
		spanMid.className = "inforPushButtonContent";
	}    
	else {
	    spanMid.className = "inforPushButtonContentSecondary";
	}
    spanMid.appendChild(wnd.document.createTextNode(buttonTxt));

    var spanRight = wnd.document.createElement("div");
    if (isDisabled) {
        spanRight.className += "inforPushButtonRightSideDisable";
    }
	else {
    	spanRight.className = (theElement.getAttribute("state") == "primary") ? "inforPushButtonRightSide" : "inforPushButtonSecondaryRightSide";
	}

    // append the new child nodes to the button
    spanRight.appendChild(buttonImg);
    spanRight.appendChild(spanMid);
    spanLeft.appendChild(spanRight);

    theElement.innerHTML = "";
    theElement.appendChild(spanLeft);

    // create a temporary span to capture the width of the button text
    var spanTmp = wnd.document.createElement("span");
    spanTmp.className = "inforPushButtonContent";
    spanTmp.style.visibility = "hidden";
    spanTmp.style.width = "auto";
	spanTmp.style.float = "left";
	spanTmp.style.display = "inline-block";
    spanTmp.appendChild(wnd.document.createTextNode(buttonTxt));
    wnd.document.body.appendChild(spanTmp);
    
    // explicitly set the button width so the background image displays correctly
    var spanWidth = (spanTmp.clientWidth) ? (spanTmp.clientWidth + 22) : (spanTmp.offsetWidth + 14);
    if (this.textDir == "rtl" && navigator.userAgent.indexOf("MSIE") >= 0)
    {
    	spanWidth -= 7;
    	spanMid.style.width = "auto";
    }	
	else
	{
		spanMid.style.float = "left";
	}

    // Minimum with to display properly 
    if (spanWidth < 24)
		spanWidth = 24;

    theElement.style.width = spanWidth + "px";

    // remove the temporary span
    spanTmp = wnd.document.body.removeChild(spanTmp);

    // replace the existing button with the new one
    //var oldButton = theElement.parentNode.replaceChild(newButton, theElement);

    if (!isDisabled)
    {	
	    theElement.onmouseover = function()
	    {
	        StylerBase.pushButtonMouseOver(this);
	    };
	
	    theElement.onmouseout = function()
	    {
	        StylerBase.pushButtonMouseOut(this);
	    };
	
	    theElement.onmousedown = function()
	    {
	        StylerBase.pushButtonMousePress(this);
	    };
    }

    if (this.moreInfo && (theElement.className != "")) {
        alert("Replacing " + theElement.className + " with pushButtonStyler");
        debugger;
        this.elementWarnings(wnd, theElement);
    }
    theElement.setAttribute("styledAs", StylerBase.ElementTypeButton);
    return;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processDivElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    var stylerAttribute = theElement.getAttribute("styler");

    switch (stylerAttribute)
    {
        case "groupbox":
            this.processGroupBoxElement(wnd, theElement);
            break;

        case "tabcontrol":
            this.processTabControlElement(wnd, theElement);
            break;

        case "header":
            this.processHeaderElement(wnd, theElement);
            break;

        case "groupline":
            this.processGroupLineElement(wnd, theElement);
            break;

        case "expander":
            this.processExpanderElement(wnd, theElement);
            break;

        default:
            theElement.setAttribute("styledAs", StylerBase.ElementTypeDivUnknown);
            if (this.moreInfo)
            {
                alert("STYLER attribute on DIV tag with unsupported styler value of: " + stylerAttribute);
                debugger;
            }
            break;
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processGroupBoxElement = function(wnd, theElement)
{
    // Return if already styled
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeDivGroupBox)
    {
        return;
    }

    if (!wnd)
    {
        wnd = window;
    }
    
	var fieldSetDiv = this.createGroupBoxElement(wnd);
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
StylerBase.prototype.processTabControlElement = function(wnd, theElement)
{
    // Return if already styled
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeDivTabControl)
    {
        return;
    }

    if (!wnd)
    {
        wnd = window;
    }

    var stylerInitAttribute = theElement.getAttribute("styler_init");
    var stylerClickAttribute = theElement.getAttribute("styler_click");
    var stylerLoadAttribute = theElement.getAttribute("styler_load");

    // replace the old div element with the tab control div
    var tabControlDiv = this.createTabControlElement(wnd);
    tabControlDiv.setAttribute("id", theElement.getAttribute("id"));
    tabControlDiv.setAttribute("styler", "tabcontrol");
    var oldChild = theElement.parentNode.replaceChild(tabControlDiv, theElement);

    // store the click and load event attributes on the tab control element
    if (stylerClickAttribute != null || stylerLoadAttribute != null)
    {
        var uls = tabControlDiv.getElementsByTagName("ul");
        if (uls.length > 0)
        {
            var tabControl = uls[0];
            if (stylerClickAttribute != null)
            {
                tabControl.setAttribute("styler_click", stylerClickAttribute);
            }
            if (stylerLoadAttribute != null)
            {
                tabControl.setAttribute("styler_load", stylerLoadAttribute);
            }
        }
    }

    if (stylerInitAttribute != null)
    {
        // tell the application to render the tabs
        StylerBase.performFunctionCallback(wnd, stylerInitAttribute, new Array(wnd, oldChild));
    }

    if (this.moreInfo)
    {
        alert("Replacing " + theElement.className + " with inforTabset");
        debugger;
        this.elementWarnings(wnd, theElement);
    }
    tabControlDiv.setAttribute("styledAs", StylerBase.ElementTypeDivTabControl);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processHeaderElement = function(wnd, theElement)
{
	//ignore - not part of UI specs
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processGroupLineElement = function(wnd, theElement)
{
	//ignore - not part of UI specs
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processExpanderElement = function(wnd, theElement)
{
    // Return if already styled
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeDivExpander)
    {
        return;
    }

    if (!wnd)
    {
        wnd = window;
    }

    var initAttribute = theElement.getAttribute("styler_init");
    var stateAttribute = theElement.getAttribute("styler_state");

    if (stateAttribute == null)
    {
        stateAttribute = "collapsed";
    }

    var expanderSpan = wnd.document.createElement("span");
    expanderSpan.className = (stateAttribute == "expanded") ? "inforExpanderExpanded" : "inforExpanderCollapsed";

    expanderSpan.onclick = function()
    {
        if (this.className == "inforExpanderCollapsed")
        {
            this.className = "inforExpanderExpanded";
        }
        else
        {
            this.className = "inforExpanderCollapsed";
        }
        StylerBase.expanderControlOnClick(this, wnd);
    };
    
    expanderSpan.onmouseover = function()
    {
        if (this.className == "inforExpanderCollapsed")
        {
            this.className = "inforExpanderCollapsedOver";
        }
        else
        {
            this.className = "inforExpanderExpandedOver";
        }
    };

    expanderSpan.onmousedown = function()
    {
        if (this.className == "inforExpanderCollapsed")
        {
            this.className = "inforExpanderCollapsedOver";
        }
        else
        {
            this.className = "inforExpanderExpandedOver";
        }
    };

    expanderSpan.onmouseup = function()
    {
        if (this.className.toString().indexOf("Collapsed") != -1)
        {
            this.className = "inforExpanderCollapsed";
        }
        else
        {
            this.className = "inforExpanderExpanded";
        }
    };
    
    expanderSpan.onmouseout = expanderSpan.onmouseup;
    
    theElement.parentNode.insertBefore(expanderSpan, theElement);

    if (initAttribute != null)
    {
        // call the init function
        StylerBase.performFunctionCallback(wnd, initAttribute, new Array(wnd, theElement, expanderSpan));
    }

    if (this.moreInfo)
    {
        alert("Replacing " + theElement.className + " with inforExpander");
        debugger;
        this.elementWarnings(wnd, theElement);
    }
    theElement.setAttribute("styledAs", StylerBase.ElementTypeDivExpander);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processSpanElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    var stylerAttribute = theElement.getAttribute("styler");

    switch (stylerAttribute)
    {
        case "asterisk":
            this.processAsteriskElement(wnd, theElement);
            break;
        default:
            theElement.setAttribute("styledAs", StylerBase.ElementTypeSpanUnknown);
            if (this.moreInfo)
            {
                alert("STYLER attribute on SPAN tag with unsupported styler value of: " + stylerAttribute);
                debugger;
            }
            break;
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processAsteriskElement = function(wnd, theElement)
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
    newSpan.appendChild(wnd.document.createTextNode("\u00a0"));
	if (theElement.getAttribute("id"))
		newSpan.setAttribute("id", theElement.getAttribute("id"));    

	if (theElement.parentNode.nodeName.toLowerCase() == "td" || theElement.parentNode.nodeName.toLowerCase() == "th")
	{
		theElement.parentNode.insertBefore(newSpan, theElement.parentNode.childNodes[0]);
	    var oldChild = theElement.parentNode.removeChild(theElement);
    }
    else
    {
    	newSpan.style.float = "";
    	newSpan.style.margin = "0px";
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
StylerBase.prototype.processComboBoxElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    var isDisabled = theElement.disabled;
    var cbId = null;

    if (theElement.getAttribute("id") == null || theElement.getAttribute("id") == "")
    {
        cbId = theElement.getAttribute("name") + "_select";
        theElement.setAttribute("id", cbId);
    }
    else
    {
        cbId = theElement.getAttribute("id");
    }

    // disable/enable existing restyled combobox; reset the item list
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeComboBox)
    {
        var cbSpan = wnd.document.getElementById(cbId + "_combobox");
        var outerSpan = cbSpan.parentNode;
        var cbState = "";

        if (isDisabled)
        {
            cbState = "disabled";
        }
        else
        {
            cbState = "primary";
        }

        var leftSpan = cbSpan.childNodes[0];
        var textBox = cbSpan.childNodes[1];
        var rightSpan = cbSpan.childNodes[2];

        if (cbState != outerSpan.getAttribute("state"))
        {
            outerSpan.setAttribute("state", cbState);
            this.attachComboBoxElementEvents(wnd, outerSpan, isDisabled);

	        if (isDisabled)
	        {
	            leftSpan.className = "inforTextboxLeft inforDisabled";
	            textBox.className = "inforTextbox inforDisabled";
	            textBox.disabled = true;
	            rightSpan.className = "inforDropDownDisabled";
	        }
	        else
	        {
	            leftSpan.className = "inforTextboxLeft";
	            textBox.className = "inforTextbox";
	            textBox.disabled = false;
	            rightSpan.className = "inforDropDown";
	        }
		}

        var cbDropDown = wnd.document.getElementById(cbId + "_comboboxlist");

        var newCbDropDown = wnd.document.createElement("ul");
        newCbDropDown.className = "inforDropDown";
        newCbDropDown.setAttribute("id", cbId + "_comboboxlist");
        newCbDropDown.setAttribute("name", cbId + "_comboboxlist");
        newCbDropDown.setAttribute("selectID", cbId);
        newCbDropDown.setAttribute("loaded", "0");

        // size the combo box width according to the original select element
        theElement.className = "inforDropDown";
        if (theElement.offsetWidth > 0)
        {
        	StylerBase.setElementWidth(wnd, newCbDropDown, theElement);
        	StylerBase.setElementWidth(wnd, textBox, theElement);
        }

        theElement.className = "inforHidden";

        // if there is a selected item in the original select element,
        // select it in the combobox
        if (theElement.selectedIndex != -1)
        {
            newCbDropDown.setAttribute("selectIndex", String(theElement.selectedIndex));
            var selectElm = theElement.options[theElement.selectedIndex];
            var selectTxt = (selectElm.innerText) ? selectElm.innerText : ((selectElm.textContent) ? selectElm.textContent : "");
            newCbDropDown.setAttribute("hilightIndex", String(theElement.selectedIndex));
            StylerBase.setSelectElementValue(selectElm, cbId, theElement.selectedIndex, selectTxt);
        }

        cbDropDown.parentNode.replaceChild(newCbDropDown, cbDropDown);
        if (cbDropDown.className == "inforDropDownOpen")
        {
            StylerBase.openComboBox(newCbDropDown, wnd);
        }
        return;
    }

    var outerSpan = wnd.document.createElement("span");
    if (isDisabled)
    {
        outerSpan.setAttribute("state", "disabled");
    }
    else
    {
        outerSpan.setAttribute("state", "primary");
    }
    this.attachComboBoxElementEvents(wnd, outerSpan, isDisabled);

    var cbSpan = wnd.document.createElement("span");
    cbSpan.setAttribute("id", cbId + "_combobox");
    cbSpan.className = "inforTextboxWrapper";

    var leftSpan = wnd.document.createElement("span");
    leftSpan.className = "inforTextboxLeft";
    if (isDisabled)
    {
        leftSpan.className += " inforDisabled";
    }
    //leftSpan.appendChild(wnd.document.createTextNode("\u00a0"));

    var textBox = wnd.document.createElement("input");
    textBox.className = "inforTextbox";
    if (isDisabled)
    {
        textBox.className += " inforDisabled";
        textBox.disabled = true;
    }

    if (!document.all)
    {
    	if (navigator.userAgent.toLowerCase().indexOf('chrome') == -1)
    		textBox.style.marginTop = "1px";
        textBox.style.marginBottom = "1px";
    }

    if (!isDisabled)
    {
        textBox.onfocus = function()
        {
            this.select();
        };
    }

    textBox.onkeydown = function()
    {
        return false;
    };

    textBox.setAttribute("size", "25");
    textBox.setAttribute("value", "");
    textBox.setAttribute("id", cbId + "_comboboxinput");
    textBox.setAttribute("name", cbId + "_comboboxinput");
    textBox.setAttribute("styledAs", StylerBase.ElementTypeComboBox);

    var rightSpan = wnd.document.createElement("span");
    rightSpan.setAttribute("id", cbId + "_comboboxbutton");
    rightSpan.className = (isDisabled) ? "inforDropDownDisabled" : "inforDropDown";
    //rightSpan.appendChild(wnd.document.createTextNode("\u00a0"));

    cbSpan.appendChild(leftSpan);
    cbSpan.appendChild(textBox);
    cbSpan.appendChild(rightSpan);

    var cbDropDown = wnd.document.createElement("ul");
    cbDropDown.className = "inforDropDown";
    cbDropDown.setAttribute("id", cbId + "_comboboxlist");
    cbDropDown.setAttribute("name", cbId + "_comboboxlist");
    cbDropDown.setAttribute("selectID", cbId);
    cbDropDown.setAttribute("loaded", "0");

    outerSpan.appendChild(cbSpan);

    // insert the new select immediately before the original one
    theElement.parentNode.insertBefore(outerSpan, theElement);
    theElement.parentNode.insertBefore(cbDropDown, theElement);

    // size the combo box width according to the original select element
    theElement.className = "inforDropDown";

    StylerBase.setElementWidth(wnd, cbDropDown, theElement);
    StylerBase.setElementWidth(wnd, textBox, theElement);

    // hide the original select element
    theElement.className = "inforHidden";

    // if the old select element is programmatically given focus,
    // set focus on the combobox instead
    theElement.focus = function()
    {
        if (this.getAttribute("id") != null)
        {
            var cbId = this.getAttribute("id");
            var doc = StylerBase.getElementDocument(this);
            var inputBox = doc.getElementById(cbId + "_comboboxinput");

            if (inputBox != null)
            {
                inputBox.focus();
            }
        }
    };

    // if there is a selected item in the original select element,
    // select it in the combobox
    if (theElement.selectedIndex != -1)
    {
        cbDropDown.setAttribute("selectIndex", String(theElement.selectedIndex));
        var selectElm = theElement.options[theElement.selectedIndex];
        var selectTxt = (selectElm.innerText) ? selectElm.innerText : ((selectElm.textContent) ? selectElm.textContent : "");
        cbDropDown.setAttribute("hilightIndex", String(theElement.selectedIndex));
        StylerBase.setSelectElementValue(selectElm, cbId, theElement.selectedIndex, selectTxt);
    }

    // handle keyboard events
    var mouseDownAttribute = wnd.document.body.getAttribute("styler_keydown");
    if (mouseDownAttribute == null || mouseDownAttribute != "1")
    {
        StylerBase.addEvent(wnd.document, "keydown",
            function(evt)
            {
                evt = (evt) ? evt : ((wnd.event) ? wnd.event : "");
                StylerBase.doComboBoxOnKeyDown(evt, wnd);
            });
        wnd.document.body.setAttribute("styler_keydown", "1");
    }

    if (this.moreInfo)
    {
        alert("Replacing " +
              theElement.className +
              " with inforDropDown");
        debugger;
        this.elementWarnings(wnd, theElement);
    }
    theElement.setAttribute("styledAs", StylerBase.ElementTypeComboBox);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.attachComboBoxElementEvents = function(wnd, spanElement, isDisabled)
{
    if (isDisabled)
    {
        spanElement.onclick = null;
        spanElement.onmousedown = null;
        spanElement.onmouseover = null;
        spanElement.onmouseup = null;
        spanElement.onmouseout = null;
    }
    else if (spanElement.onclick == null)
    {
        spanElement.onclick = function(evt)
        {
            evt = (evt) ? evt : ((wnd.event) ? wnd.event : "");
            StylerBase.toggleComboBox(wnd, evt, this);
        };
        spanElement.onmousedown = function()
        {
            var cbSpan = this.childNodes[0];
            var cbBtnId = cbSpan.getAttribute("id") + "button";
            var tSpans = cbSpan.getElementsByTagName("span");
            var tSpan = null;
            for (var i=0; i<tSpans.length; i++)
            {
                tSpan = tSpans[i];
                if (tSpan.getAttribute("id") != null && tSpan.getAttribute("id") == cbBtnId)
                {
                    tSpan.className = "inforDropDownActive";
                    break;
                }
            }
        };
        spanElement.onmouseover = function()
        {
            var cbSpan = this.childNodes[0];
            var cbBtnId = cbSpan.getAttribute("id") + "button";
            var tSpans = cbSpan.getElementsByTagName("span");
            var tSpan = null;

            for (var i=0; i<tSpans.length; i++)
            {
                tSpan = tSpans[i];
                if (tSpan.getAttribute("id") != null && tSpan.getAttribute("id") == cbBtnId)
                {
                    tSpan.className = "inforDropDownOver";
                    break;
                }
            }
        };
        spanElement.onmouseup = function()
        {
            var cbSpan = this.childNodes[0];
            var cbBtnId = cbSpan.getAttribute("id") + "button";
            var tSpans = cbSpan.getElementsByTagName("span");
            var tSpan = null;

            for (var i=0; i<tSpans.length; i++)
            {
                tSpan = tSpans[i];
                if (tSpan.getAttribute("id") != null && tSpan.getAttribute("id") == cbBtnId)
                {
                    tSpan.className = "inforDropDown";
                    break;
                }
            }
        };
        spanElement.onmouseout = function()
        {
           this.onmouseup();
        };
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.createGroupBoxElement = function(wnd, label)
{
    if (!wnd)
    {
        wnd = window;
    }

    var fieldSetDiv = wnd.document.createElement("div");
    fieldSetDiv.className = "inforFieldSet";

    var labelSpan = wnd.document.createElement("span");
    labelSpan.className = "inforFieldSetLabel";
    if (label && typeof(label) == "string" && label.match(/\S/))
    	labelSpan.innerHTML = String(label);
    else
    	labelSpan.appendChild(wnd.document.createTextNode("\u00a0"));

    var contentDiv = wnd.document.createElement("div");
    contentDiv.className = "inforFieldSetContent";

	fieldSetDiv.appendChild(labelSpan);
	fieldSetDiv.appendChild(contentDiv);
	
    return fieldSetDiv;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.setGroupBoxElementLabel = function(groupBox, label)
{
    if (!groupBox || groupBox.childNodes.length == 0 || !label)
    {
        return;
    }
    
	var labelSpan = groupBox.childNodes[0];
	if (labelSpan.className == "inforFieldSetLabel")
	{
		labelSpan.innerHTML = label;	
	}
};

//-----------------------------------------------------------------------------
StylerBase.prototype.createTabControlElement = function(wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

	var tabCtrlDiv = wnd.document.createElement("div");
	tabCtrlDiv.className = "inforTabContainer";
    
    var ul = wnd.document.createElement("ul");
    ul.className = "inforTabset";	
    tabCtrlDiv.appendChild(ul);

    return tabCtrlDiv;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.createTabControlListElement = function(wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

    var li = wnd.document.createElement("li");    
    li.onmouseover = function()
    {
        StylerBase.tabControlOnMouseOver(this);
    };
    li.onmouseout = function()
    {
        StylerBase.tabControlOnMouseOut(this);
    };

    return li;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addTab = function(wnd, tabControl, tabId, tabText, active, tabContent)
{
    if (!wnd)
    {
        wnd = window;
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

    if (ul == null)
    {
        if (this.moreInfo)
        {
            alert("Error adding tab element to tab control " 
            + tabControl.getAttribute("id") + " with inforTabset");
            debugger;
        }
        return ul;
    }

    var lis = ul.getElementsByTagName("li");
    var tabLi = this.createTabControlListElement(wnd);
    tabLi.setAttribute("tabId", tabId);
    tabLi.setAttribute("tabNbr", String(lis.length));

    var leftSpan = wnd.document.createElement("span");
    leftSpan.className = (active) ? "inforTabLeftActive" : "inforTabLeft";
    leftSpan.appendChild(wnd.document.createTextNode("\u00a0"));

    var midSpan = wnd.document.createElement("span");
    midSpan.className = (active) ? "inforTabActive" : "inforTab";
    
    var midLink = wnd.document.createElement("a");
    midLink.className = "inforTabLink";
    midLink.setAttribute("href", "javascript:;");
    midLink.onclick = function()
    {
    	wnd = wnd || window;
    	var tab = this;
	    while (tab != tab.parentNode && tab.nodeName.toLowerCase() != "li")
	    {
			tab = tab.parentNode;
	    }
		StylerBase.setActiveTabControlTab(tab, wnd);    
    }
    midLink.appendChild(wnd.document.createTextNode(tabText));
    midSpan.appendChild(midLink);

    var rightSpan = wnd.document.createElement("span");
    rightSpan.className = (active) ? "inforTabRightActive" : "inforTabRight";
    rightSpan.appendChild(wnd.document.createTextNode("\u00a0"));
    
    var sepSpan = wnd.document.createElement("span");
    sepSpan.className = "inforTabSeparator";
    sepSpan.style.visibility = (active) ? "hidden" : "";

    tabLi.appendChild(leftSpan);
    tabLi.appendChild(midSpan);
    tabLi.appendChild(rightSpan);
    tabLi.appendChild(sepSpan);

    ul.appendChild(tabLi);

    if (tabContent)
    {
        tabContent.setAttribute("id", tabId);
        tabContent.className = ((active) ? "inforTabContentActive" : "inforTabContent");
        tabContent.removeAttribute("style");
		if (navigator.userAgent.indexOf("MSIE") >= 0)
		{
			tabContent.style.width = "100%";
		}
		else
		{
			tabContent.style.marginTop = "-3px";
			tabContent.style.width = "auto";        
        }
        ul.parentNode.appendChild(tabContent);
    }

	if (active)
	{
		try { midLink.focus(); } catch(e) {}		
	}
    return ul;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addTitleBar = function(wnd, title, msg, recId)
{
    if (!wnd)
    {
        wnd = window;
    }

	if (this.titleBarExists(wnd))
	{
		return;
    }

	var modContainer = wnd.document.createElement("div");
    modContainer.className = "inforModuleContainer";
    modContainer.setAttribute("id", "inforModuleContainer");

	var modHeaderLeftCnr = wnd.document.createElement("div");
	modHeaderLeftCnr.className = "inforModuleHeaderLeftCorner";

	var modHeaderRightCnr = wnd.document.createElement("div");
	modHeaderRightCnr.className = "inforModuleHeaderRightCorner";

	var modHeader = wnd.document.createElement("div");
    modHeader.className = "inforModuleHeader";

	var modHeaderLeft = wnd.document.createElement("div");
    modHeaderLeft.className = "inforModuleHeaderLeft";
    
    var pageTitle = wnd.document.createElement("span");
    pageTitle.className = "inforPageTitleText";
    pageTitle.setAttribute("id", "inforPageTitleText");
    if (title)
    	pageTitle.appendChild(wnd.document.createTextNode(title));

    var recordId = wnd.document.createElement("span");
    recordId.className = "inforModuleRecordIdText";
    recordId.setAttribute("id", "inforModuleRecordIdText"); 
    if (recId)
    	pageTitle.appendChild(wnd.document.createTextNode(recId));
    	    
 	var modHeaderRight = wnd.document.createElement("div");
    modHeaderRight.className = "inforModuleHeaderRight";
    modHeaderRight.setAttribute("id", "inforModuleHeaderRight");
    modHeaderRight.appendChild(wnd.document.createTextNode("\u00a0"));
    
    modHeaderLeft.appendChild(pageTitle);
    modHeaderLeft.appendChild(recordId);
    modHeader.appendChild(modHeaderLeft);
    modHeader.appendChild(modHeaderRight);
    modHeaderRightCnr.appendChild(modHeader);
    modHeaderLeftCnr.appendChild(modHeaderRightCnr);
    modContainer.appendChild(modHeaderLeftCnr);

	if (wnd.document.body.childNodes.length > 0)        
    	wnd.document.body.insertBefore(modContainer, wnd.document.body.childNodes[0]); 
	else
		wnd.document.body.appendChild(modContainer);	
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addTitleBarMenu = function(wnd, icon, menuClickFunc, toolTipText)
{
    if (!wnd)
    {
        wnd = window;
    }

	if (!this.titleBarExists(wnd))
	{
		return;
    }
	
	var menuClickFunc = function()
	{
		wnd = wnd || null;
		StylerBase.openTitleBarMenu(wnd);	
	};
	
	icon = icon || StylerBase.TITLE_BAR_DROPDOWN_ICON;
	toolTipText = toolTipText || "Menu";
	this.addTitleBarIcon(wnd, icon, menuClickFunc, toolTipText);	
};

//-----------------------------------------------------------------------------
StylerBase.prototype.createTitleBarMenuDropDown = function(wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

	if (!this.titleBarExists(wnd))
	{
		return;
    }
    
	var menuDiv;
	
	if (wnd.document.getElementById("titleBarMenu"))
	{
		menuDiv = wnd.document.getElementById("titleBarMenu");
	}
	else
	{
		menuDiv = wnd.document.createElement("div");
		menuDiv.setAttribute("id", "titleBarMenu");
		var menuList = wnd.document.createElement("ul");
		menuList.setAttribute("id", "titleBarMenuList");
		menuList.className = "inforDropDown";
		menuDiv.appendChild(menuList);
		wnd.document.body.appendChild(menuDiv);
	}
	
	return menuDiv;	
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addTitleBarMenuItem = function(wnd, icon, itemDesc, menuClickFunc, toolTipText)
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
		var btnType = btns[i].getAttribute("type");
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
	
	var menuDropDown = this.createTitleBarMenuDropDown(wnd);
	var menuList = menuDropDown.childNodes[0];
	var menuItems = menuList.getElementsByTagName("li");
	var len = menuItems.length;
	var itemExists = false;
	for (var i=0; i<len; i++)
	{
		var li = menuItems[i];
		if (li.getAttribute("itemVame") == String(itemDesc))
		{
			itemExists = true;
			break;
		}
	}	
	
	if (!itemExists)
	{
		var mItem = wnd.document.createElement("li");
		mItem.setAttribute("itemIndex", String(len));
		mItem.setAttribute("itemVame", String(itemDesc));
        if (menuClickFunc)
        {
	        mItem.onclick = function()
	        {
	        	wnd = wnd || window;
	        	var menuObj = wnd.document.getElementById("titleBarMenu");
	        	if (menuObj)
	        	{
	        		var menuList = menuObj.childNodes[0];
	        		StylerBase.closeTitleBarMenu(menuList);
	        	}	
	        	menuClickFunc.apply(this, new Array());
	        }	
        }
        mItem.onmouseover = function(evt)
        {
            evt = (evt) ? evt : ((window.event) ? window.event : "");
            StylerBase.hilightComboBoxItem(this);
        };
        mItem.onmouseout = function(evt)
        {
            evt = (evt) ? evt : ((window.event) ? window.event : "");
            StylerBase.unhilightComboBoxItem(this);
        };
        mItem.appendChild(wnd.document.createTextNode(String(itemDesc)));
        menuList.appendChild(mItem);
	}
};

//-----------------------------------------------------------------------------
StylerBase.prototype.titleBarExists = function(wnd)
{
    if (!wnd)
    {
        wnd = window;
    }
    
    try
    {
	    if (wnd.document.getElementById("inforModuleContainer"))
	    {
	        return true;
	    }	
	    else
	    {
	    	return false;
	    }
    }
    catch(e)
    {
    	return false;
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.navBarExists = function(wnd)
{
    if (!wnd)
    {
        wnd = window;
    }
    
    try
    {
	    if (wnd.document.getElementById("inforApplicationNav1"))
	    {
	        return true;
	    }	
	    else
	    {
	    	return false;
	    }
    }
    catch(e)
    {
    	return false;
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addTitleBarIcon = function(wnd, icon, iconClickFunc, toolTipText, itemDesc)
{
    if (!wnd)
    {
        wnd = window;
    }

	if (!this.titleBarExists(wnd))
	{
		return;
    }	
  
    var btn = wnd.document.createElement("button");
    btn.setAttribute("type", icon);
    btn.onclick = iconClickFunc;
	var newIcon = icon;

    switch(icon)
    {
    	case StylerBase.TITLE_BAR_HELP_ICON: 
        case StylerBase.TITLE_BAR_DROPDOWN_ICON:
        	newIcon = StylerBase.TITLE_BAR_DROPDOWN_ICON;
            btn.className = "inforModuleDropDownButton";
            btn.setAttribute("id", "titleBarDropDownButton");
            btn.setAttribute("title", toolTipText || "Menu");
            btn.setAttribute("order", "0");
            btn.setAttribute("type", newIcon);
            btn.onclick = function()
            {
            	wnd = wnd || window;
            	StylerBase.openTitleBarMenu(wnd);
            };        
        	break;            
        case StylerBase.TITLE_BAR_SETTINGS_ICON:
            btn.className = "inforModuleSettingsButton";
            btn.setAttribute("title", toolTipText || "Settings");
            btn.setAttribute("order", "2");
            break;
		//style logout button the same as close for now
        case StylerBase.TITLE_BAR_LOGOFF_ICON:
        case StylerBase.TITLE_BAR_CLOSE_ICON:
        	var toolText = (icon == StylerBase.TITLE_BAR_CLOSE_ICON) ? "Close" : "Logout";       
            newIcon = StylerBase.TITLE_BAR_CLOSE_ICON;
            btn.className = "inforModuleCloseButton";
            btn.setAttribute("title", toolTipText || toolText);
            btn.setAttribute("order", "3");
            btn.setAttribute("type", newIcon);
            break;
        default:
            return;
    }

	this.attachTitleBarIconEvent(btn, "onmouseover");
	this.attachTitleBarIconEvent(btn, "onmousedown");
	this.attachTitleBarIconEvent(btn, "onmouseout");

	var modHeaderRight = wnd.document.getElementById("inforModuleHeaderRight");
	var btns = modHeaderRight.getElementsByTagName("button");
	var btnExists = false;
	var nextBtn = null;
	var btnOrder = Number(btn.getAttribute("order"));
	for (var i=0; i<btns.length; i++)
	{
		var btnType = btns[i].getAttribute("type"); 
		if (btnType == icon || btnType == newIcon)
		{
			btnExists = true;
			break;
		}
		else if (Number(btns[i].getAttribute("order")) >= btnOrder)
		{
			nextBtn = btns[i];
			break;
		}
	}	
	if (!btnExists)
	{
		if (nextBtn)
			modHeaderRight.insertBefore(btn, nextBtn);
		else	
			modHeaderRight.appendChild(btn);
		btn.setAttribute("styledAs", StylerBase.ElementTypeButtonIcon);
		
		// if this is a menu icon, create the first menu item if passed in
		switch (icon)
	    {
	    	case StylerBase.TITLE_BAR_HELP_ICON: 
	        case StylerBase.TITLE_BAR_DROPDOWN_ICON:
	            if (iconClickFunc)
	            {
	            	itemDesc = itemDesc || toolTipText;
	            	this.addTitleBarMenuItem(wnd, icon, itemDesc, iconClickFunc, toolTipText);	            
	            }
	            break;
	        default:
	            return;
	    }		
	}
};

//-----------------------------------------------------------------------------
StylerBase.prototype.attachTitleBarIconEvent = function(icon, evtName)
{
	if (!icon)
		return;
	
	var classExt = "";
	if (evtName == "onmouseover")
		classExt = "Over";
	else if (evtName == "onmousedown")
		classExt = "Active";	
	
	icon[evtName] = function()
	{
		var type = this.getAttribute("type");
	    switch(type)
	    {
	    	case StylerBase.TITLE_BAR_DROPDOWN_ICON:
	    		icon.className = "inforModuleDropDownButton" + classExt;
	    		break;
	        case StylerBase.TITLE_BAR_HELP_ICON:
	            //need new help icons
	            //icon.className = "inforStandardIconHelpButton" + classExt;
	            break;
	        case StylerBase.TITLE_BAR_SETTINGS_ICON:
	            icon.className = "inforModuleSettingsButton" + classExt;
	            break;           
	        case StylerBase.TITLE_BAR_CLOSE_ICON:
	        case StylerBase.TITLE_BAR_LOGOFF_ICON:
	        	icon.className = "inforModuleCloseButton" + classExt;
	            break;    
	        default:
	            return;
	    }				
	}		
};

//-----------------------------------------------------------------------------
StylerBase.prototype.removeTitleBarIcon = function(wnd, icon)
{
    if (!wnd)
    {
        wnd = window;
    }

	if (!this.titleBarExists(wnd))
	{
		return;
    }

    var modHeaderRight = wnd.document.getElementById("inforModuleHeaderRight");
 	var btns = modHeaderRight.getElementsByTagName("button");
	for (var i=0; i<btns.length; i++)
	{
		var btnType = btns[i].getAttribute("type");
		if ((btnType == icon) || (icon == StylerBase.TITLE_BAR_HELP_ICON && btnType == StylerBase.TITLE_BAR_DROPDOWN_ICON))
		{
			btns[i].parentNode.removeChild(btns[i]);
			break;
		}
	}
};

//-----------------------------------------------------------------------------
StylerBase.prototype.setTitleBarName = function(wnd, name)
{
    if (!wnd)
    {
        wnd = window;
    }

	if (!this.titleBarExists(wnd))
	{
		return;
    }

	var pageTitleText = wnd.document.getElementById("inforPageTitleText");
	pageTitleText.innerHTML = "";
	pageTitleText.appendChild(wnd.document.createTextNode(name));
};

//-----------------------------------------------------------------------------
StylerBase.prototype.setTitleBarData = function(wnd, text)
{
    if (!wnd)
    {
        wnd = window;
    }

	if (!this.titleBarExists(wnd))
	{
		return;
    }

	var pageTitleText = wnd.document.getElementById("inforModuleRecordIdText");
	pageTitleText.innerHTML = "";
	pageTitleText.appendChild(wnd.document.createTextNode(text));
};

//-----------------------------------------------------------------------------
StylerBase.prototype.getTitleBarData = function(wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

	if (!this.titleBarExists(wnd))
	{
		return;
    }

	var pageTitleText = wnd.document.getElementById("inforModuleRecordIdText");
	return pageTitleText.innerHTML;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.setTitleBarMessage = function(wnd, msg)
{
	//no message on title bar
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addSortArrow = function(wnd, theElement, sortDirection, clickFunctionStr)
{
	while (theElement != theElement.parentNode && theElement.nodeName.toLowerCase() != "th")
	{			
		theElement = theElement.parentNode;
	}	

    sortDirection = (sortDirection) ? sortDirection.toLowerCase() : "ascending"; 
    var newSortDirection = (sortDirection == "ascending") ? "descending" : "ascending";  
    var nameSpan = (theElement.childNodes.length > 0) ? theElement.childNodes[0] : null;
    var anchorSpan = (theElement.childNodes.length > 1) ? theElement.childNodes[1] : null;
    
    if (nameSpan == null || anchorSpan == null || nameSpan.getAttribute("styler_sort") == newSortDirection)
    {
    	return;
    }
    
	nameSpan.className = "inforDataGridColumnNameSorted";
	if (sortDirection == "ascending")
	{
		anchorSpan.className = "inforSortIndicatorAsc";
	}
	else
	{
		anchorSpan.className = "inforSortIndicatorDesc";
	}			    

	nameSpan.setAttribute("styler_sort", sortDirection);
    theElement.setAttribute("styler_sort", sortDirection);

    if (clickFunctionStr)
    {
        theElement.setAttribute("styler_click", clickFunctionStr);
        theElement.onclick = function()
        {
			var sAttr = this.getAttribute("styler_sort");
			var nSpan = this.childNodes[0];
			var aSpan = this.childNodes[1];

			if (sAttr != null && nSpan != null && aSpan != null)
			{
				nSpan.className = "inforDataGridColumnNameSorted";
				if (sAttr.toLowerCase() == "ascending")
				{
					aSpan.className = "inforSortIndicatorDesc";
					nSpan.setAttribute("styler_sort", "descending");
				}
				else
				{
					aSpan.className = "inforSortIndicatorAsc";
					nSpan.setAttribute("styler_sort", "ascending");
				}
			}

			var clickAttr = this.getAttribute("styler_click");
			if (clickAttr != null)
			{
				wnd = (typeof(wnd) == "undefined" || !wnd) ? window : wnd;
				StylerBase.performFunctionCallback(wnd, clickAttr, new Array(wnd, this));
			}
        };        
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addFooter = function(wnd)
{
	//ignore - not part of UI specs
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addCommandBar = function(wnd, appName, msg, text)
{
//TODO: Add infor styling
return;
    if (!wnd)
    {
        wnd = window;
    }

    // title bar background
    var bgImg = wnd.document.createElement("img");
    bgImg.src = StylerBase.webappjsURL + "/lds/images/01_title_bar_base.png";
    bgImg.className = "titleBarIconStyler";

    var bgDiv = wnd.document.createElement("div");
    bgDiv.className = "titleBarStyler";
    bgDiv.setAttribute("id", "commandBarDiv");
    bgDiv.appendChild(bgImg);
    wnd.document.body.appendChild(bgDiv);

    // title bar background gloss effect
    var glossImg = wnd.document.createElement("img");
    glossImg.src = StylerBase.webappjsURL + "/lds/images/01_title_bar_gloss.png";
    glossImg.className = "titleBarIconStyler";

    var glossDiv = wnd.document.createElement("div");
    glossDiv.className = "titleBarPanelStyler";
    glossDiv.appendChild(glossImg);
    wnd.document.body.appendChild(glossDiv);

    // title bar horizontal rule
    var ruleImg = wnd.document.createElement("img");
    ruleImg.src = StylerBase.webappjsURL + "/lds/images/01_title_bar_rule.png";
    ruleImg.className = "titleBarRuleIconStyler";

    var ruleDiv = wnd.document.createElement("div");
    ruleDiv.className = "titleBarRuleStyler";
    ruleDiv.appendChild(ruleImg);
    wnd.document.body.appendChild(ruleDiv);

    var dataDiv = wnd.document.createElement("div");
    dataDiv.setAttribute("id","commandData");
    dataDiv.className = "commandBarDataStyler";
    dataDiv.appendChild(wnd.document.createTextNode("\u00a0"));
    wnd.document.body.appendChild(dataDiv);

    // title bar content list
    var ul = wnd.document.createElement("ul");
    ul.setAttribute("id", "titleBarContentList");
    ul.className = "titleBarContentStyler";

    // logo
    var span = wnd.document.createElement("span");
    span.className = "commandBarLeftStyler";
    span.appendChild(wnd.document.createTextNode("\u00a0"));

    var li = wnd.document.createElement("li");
    li.setAttribute("type", "logo");
    li.appendChild(span);
    ul.appendChild(li);

    // application name
    span = wnd.document.createElement("span");
    span.className = (appName) ?
                     "titleBarAppNameStyler" :
                     "hiddenElementStyler";
    span.appendChild(wnd.document.createTextNode((appName) ? appName : ""));

    li = wnd.document.createElement("li");
    li.setAttribute("type", "title");
    li.appendChild(span);
    ul.appendChild(li);

    // application data
    span = wnd.document.createElement("span");
    span.className = (appName) ?
                     "titleBarAppDataStyler" :
                     "hiddenElementStyler";
    span.appendChild(wnd.document.createTextNode((text) ? text : ""));

    li = wnd.document.createElement("li");
    li.setAttribute("type", "data");
    li.setAttribute("id", "titleBarData");

    li.appendChild(span);
    ul.appendChild(li);

    // left content area
    var contentDiv = wnd.document.createElement("div");
    contentDiv.className = "titleBarPanelStyler";
    contentDiv.appendChild(ul);
    wnd.document.body.appendChild(contentDiv);

    // right content area (message, icons)
    var spanRight = wnd.document.createElement("span");
    spanRight.className = (msg) ?
                          "titleBarMessageStyler" :
                          "hiddenElementStyler";
    spanRight.setAttribute("type", "message");
    spanRight.appendChild(wnd.document.createTextNode((msg) ? msg : ""));

    var iconSpan = wnd.document.createElement("span");
    iconSpan.className = "commandBarIconPanelStyler";
    iconSpan.appendChild(spanRight);

    li = wnd.document.createElement("li");
    li.setAttribute("type", "icons");
    li.appendChild(iconSpan);
    ul.appendChild(li);

    wnd.document.body.style.backgroundPosition = "0px 26px";
    wnd.document.body.style.marginTop = "26px";
    wnd.document.body.style.marginLeft = "0px";
    wnd.document.body.style.marginRight = "0px";
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addCommandBarButton = function(wnd, icon, iconClickFunc,text,code)
{
//TODO: Add infor styling
return;
    if (!wnd)
    {
        wnd = window;
    }

    if (!wnd.document.getElementById("titleBarContentList"))
    {
        return;
    }

    var ul = wnd.document.getElementById("titleBarContentList");

    // icon
	//var span = wnd.document.createElement("span");

    // leave text blank when creating a icon with an image available
    if (text == "")
    {
        var button = wnd.document.createElement("span");
        var pButton = button.appendChild(wnd.document.createElement("button"));

        switch(icon)
        {
            case StylerBase.COMMAND_BAR_NEXT_ICON:
                pButton.className= "commandBarIconNextStyler";
                pButton.setAttribute("id","nextBtnLDS");
                break;
            case StylerBase.COMMAND_BAR_PREV_ICON:
                pButton.className = "commandBarIconPrevStyler";
                pButton.setAttribute("id","prevBtnLDS");
                break;
            default:
                return;
        }

        pButton.setAttribute("type",icon);
        pButton.appendChild(wnd.document.createTextNode(text));
        pButton.onclick = iconClickFunc;

        pButton.onmouseover = function()
        {
            if (this.className != null && this.className.indexOf("Active") == -1)
            {
                this.className += "Active";
            }
        };
        pButton.onmouseout = function()
        {
            if (this.className != null && this.className.indexOf("Active") >= 0)
            {
                this.className = this.className.replace("Active", "");
            }
        };
    }
    else
    {
        // add other controls to command using passed in html code
        if (code > "")
        {
            var codeSpan = wnd.document.createElement("span");
            var divCode = button.appendChild(wnd.document.createElement("div"));
            divCode.setAttribute("type",icon);
            divCode.setAttribute("id",text+"LDS");
            divCode.innHTML = code;
            codeSpan.className = "commandBarHtmlCodeStyler";
        }
        else
        {
            // add buttons using the text parameter
            var button = wnd.document.createElement("span");
            var pButton = button.appendChild(wnd.document.createElement("button"));
            pButton.setAttribute("type",icon);
            pButton.appendChild(wnd.document.createTextNode(text));
            pButton.setAttribute("id",text+"LDS");
            pButton.setAttribute("styler", "pushbutton");
            button.className  = "commandBarButtonStyler";
            button.onclick = iconClickFunc;
        }
    }

    // append the icon the icon panel
    var lis = ul.getElementsByTagName("li");
    var done = false;
    var i = lis.length - 1;

    while (i >= 0 && !done)
    {
        if (lis[i].getAttribute("type") != null &&
            lis[i].getAttribute("type") == "icons")
        {
            var iconPanel = lis[i].childNodes[0];
            var iconSpans = iconPanel.getElementsByTagName("span");
            var iconExists = false;
            for (var j=0; j<iconSpans.length; j++)
            {
                if (iconSpans[j].getAttribute("type") == icon)
                {
                    iconExists = true;
                    iconSpans[j].onclick = iconClickFunc;
                    break;
                }
            }
            if (!iconExists)
            {
                if (code != "")
                {
                    iconPanel.appendChild(divCode);
                }
                else
                {
                    iconPanel.appendChild(button);
                }
            }
            done = true;
        }
        i--;
    }
    return;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addCommandBarLeftButton = function(wnd, icon, iconClickFunc,text)
{
//TODO: Add infor styling
return;
    if (!wnd)
    {
        wnd = window;
    }

    if (!wnd.document.getElementById("titleBarContentList"))
    {
        return;
    }

    var ul = wnd.document.getElementById("titleBarContentList");

    // icon
    // pass in blank text to show an icon
    // pass in text to display a button

    if (text == "")
    {
        var button = wnd.document.createElement("span");
        button.setAttribute("type", icon);

        switch(icon)
        {
            case StylerBase.COMMAND_BAR_BACK_ICON:
                button.className = "commandBarIconBackStyler";
                break;
            default:
                return;
        }

        button.appendChild(wnd.document.createTextNode("\u00a0"));
        button.onclick = iconClickFunc;
        button.onmouseover = function()
        {
            if (this.className != null && this.className.indexOf("Active") == -1)
            {
                this.className += "Active";
            }
        };
        button.onmouseout = function()
        {
            if (this.className != null && this.className.indexOf("Active") >= 0)
            {
                this.className = this.className.replace("Active", "");
            }
        };
    }
    else
    {
        var button = wnd.document.createElement("span");
        button.setAttribute("type",icon);
        button.appendChild(wnd.document.createTextNode(text));
        button.setAttribute("styler", "pushbutton");
        button.onclick = iconClickFunc;
    }

    // append the icon the icon panel
    var lis = ul.getElementsByTagName("li");
    var done = false;
    var i = lis.length - 1;

    while (i >= 0 && !done)
    {
        if (lis[i].getAttribute("type") != null &&
            lis[i].getAttribute("type") == "logo")
        {
            var iconPanel = lis[i].childNodes[0];
            var iconSpans = iconPanel.getElementsByTagName("span");
            var iconExists = false;
            for (var j=0; j<iconSpans.length; j++)
            {
                if (iconSpans[j].getAttribute("type") == icon)
                {
                    iconExists = true;
                    iconSpans[j].onclick = iconClickFunc;
                    break;
                }
            }
            if (!iconExists)
            {
                iconPanel.appendChild(button);
            }
            done = true;
        }
        i--;
    }
    return;
};
//-----------------------------------------------------------------------------
StylerBase.prototype.setCommandBarMessage = function(wnd,id,msg, code)
{
//TODO: Add infor styling
return;
    if (!wnd)
    {
        wnd = window;
    }

    if (!wnd.document.getElementById("titleBarContentList"))
    {
        return;
    }

    var ul = wnd.document.getElementById("titleBarContentList");
    var lis = ul.getElementsByTagName("li");
    var done = false;
    var i = lis.length - 1;
    var span;

    while (i >= 0 && !done)
    {
        if (lis[i].getAttribute("type") != null &&
            lis[i].getAttribute("type") == "icons")
    	{
            var iconPanel = lis[i].childNodes[0];
            var items = iconPanel.getElementsByTagName("span");
            var found = false;
            var j = 0;

            while (j < items.length && !found)
            {
                if (items[j].getAttribute("type") != null &&
                    items[j].getAttribute("type") == "message")
                {

                    if (code != null)
                    {
                        span = wnd.document.createElement("span");
                        span.innerHTML = code;
                        span.setAttribute("id",id);
                        span.className = "commandBarMessageStyler";
						//span.appendChild(divCode);
                    }
                    else
                    {
                        span = wnd.document.createElement("span");
                        span.className = "commandBarMessageStyler";
                        span.appendChild(wnd.document.createTextNode(msg));
                    }
                    iconPanel.replaceChild(span, items[j]);
                    found = true;
                }
                j++;
            }
            done = true;
        }
        i--;
    }

    while ((i < lis.length) && !done)
    {
        if (lis[i].getAttribute("type") != null &&
            lis[i].getAttribute("type") == "title")
        {
            span = wnd.document.createElement("span");
            span.className = "titleBarAppNameStyler";
            span.appendChild(wnd.document.createTextNode(name));

            lis[i].replaceChild(span, lis[i].childNodes[0]);
            done = true;
        }
        i++;
    }
    return;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.setCommandBarData = function(wnd,id,text)
{
//TODO: Add infor styling
return;
    if (!wnd)
    {
        wnd = window;
    }

    if (!wnd.document.getElementById("commandData"))
    {
        return;
    }

    var cmdata = wnd.document.getElementById("commandData");
    var span = cmdata.appendChild(wnd.document.createElement("span"));

    span.setAttribute("id",id);
    span.className = "commandBarAppDataStyler";
    span.appendChild(wnd.document.createTextNode(text));
};