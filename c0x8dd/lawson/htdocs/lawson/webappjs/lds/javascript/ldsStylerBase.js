/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/lds/javascript/ldsStylerBase.js,v 1.1.2.23.2.21 2014/03/21 18:09:01 brentd Exp $ */
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

    if (imgs.length > 0)
    {
        if (obj.getAttribute("state") == "primary")
        {
            imgs[0].src = StylerBase.webappjsURL +
                "/lds/images/05_pushbutton_p_over_panel.png";
        }
        else
        {
            imgs[0].src = StylerBase.webappjsURL +
                "/lds/images/05_pushbutton_s_over_panel.png";
        }
    }

    for (var i=0; i<elms.length; i++)
    {
        if (elms[i].className.indexOf("LeftSideStyler") >= 0)
        {
            elms[i].className = (obj.getAttribute("state") == "primary") ?
                                 "pushButtonLeftSideStylerHover" :
                                 "pushButtonSecondaryLeftSideStylerHover";
        }
        else if (elms[i].className.indexOf("RightSideStyler") >= 0)
        {
            elms[i].className = (obj.getAttribute("state") == "primary") ?
                                 "pushButtonRightSideStylerHover" :
                                 "pushButtonSecondaryRightSideStylerHover";
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
        if (obj.getAttribute("state") == "primary")
        {
            imgs[0].src = StylerBase.webappjsURL +
                "/lds/images/05_pushbutton_p_rest_panel.png";
        }
        else
        {
            imgs[0].src = StylerBase.webappjsURL +
                "/lds/images/05_pushbutton_s_rest_panel.png";
        }
    }

    for (var i=0; i<elms.length; i++)
    {
        if (elms[i].nodeName.toLowerCase() == "img")
        {
            if (obj.getAttribute("state") == "primary")
            {
                elms[i].src = StylerBase.webappjsURL +
                    "/lds/images/05_pushbutton_p_rest_panel.png";
            }
            else
            {
                elms[i].src = StylerBase.webappjsURL +
                    "/lds/images/05_pushbutton_s_rest_panel.png";
            }
        }
        else if (elms[i].className.indexOf("LeftSideStyler") >= 0)
        {
            elms[i].className = (obj.getAttribute("state") == "primary") ?
                                 "pushButtonLeftSideStyler" :
                                 "pushButtonSecondaryLeftSideStyler";
        }
        else if (elms[i].className.indexOf("RightSideStyler") >= 0)
        {
            elms[i].className = (obj.getAttribute("state") == "primary") ?
                                 "pushButtonRightSideStyler" :
                                 "pushButtonSecondaryRightSideStyler";
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
        if (obj.getAttribute("state") == "primary")
        {
            imgs[0].src = StylerBase.webappjsURL +
                "/lds/images/05_pushbutton_p_actv_panel.png";
        }
        else
        {
            imgs[0].src = StylerBase.webappjsURL +
                "/lds/images/05_pushbutton_s_actv_panel.png";
        }
    }

    for (var i=0; i<elms.length; i++)
    {
        if (elms[i].nodeName.toLowerCase() == "img")
        {
            if (obj.getAttribute("state") == "primary")
            {
                elms[i].src = StylerBase.webappjsURL +
                    "/lds/images/05_pushbutton_p_actv_panel.png";
            }
            else
            {
                elms[i].src = StylerBase.webappjsURL +
                    "/lds/images/05_pushbutton_s_actv_panel.png";
            }
        }
        else if (elms[i].className.indexOf("LeftSideStyler") >= 0)
        {
            elms[i].className = (obj.getAttribute("state") == "primary") ?
                                 "pushButtonLeftSideStylerPress" :
                                 "pushButtonSecondaryLeftSideStylerPress";
        }
        else if (elms[i].className.indexOf("RightSideStyler") >= 0)
        {
            elms[i].className = (obj.getAttribute("state") == "primary") ?
                                 "pushButtonRightSideStylerPress" :
                                 "pushButtonSecondaryRightSideStylerPress";
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
        StylerBase.performFunctionCallback(wnd,
                                stylerClickAttribute,
                                new Array(wnd, obj));
    }

    var spans = obj.getElementsByTagName("span");
    var doc = StylerBase.getElementDocument(obj);

    if (spans[1].className.indexOf("inactiveTab") >= 0)
    {
        var ul = obj.parentNode;
        var lis = ul.getElementsByTagName("li");

        for (var i=0; i<lis.length; i++)
        {
            var sp = lis[i].getElementsByTagName("span");
            var firstClass = StylerBase.getFirstCssClass(sp[1]);

            // activate this tab
            if (lis[i] == obj)
            {
                sp[0].className = StylerBase.getFirstCssClass(sp[0]).replace(
                    new RegExp("inactiveTab"), "activeTab");
                sp[1].className = StylerBase.getFirstCssClass(sp[1]).replace(
                    new RegExp("inactiveTab"), "activeTab");
                sp[2].className = StylerBase.getFirstCssClass(sp[2]).replace(
                    new RegExp("inactiveTab"), "activeTab");

                var contentDiv = doc.getElementById(lis[i].getAttribute("tabId"));
                if (contentDiv != null)
                {
                    contentDiv.className = "tabContentActive";
                }
            }
            // inactivate the previous active tab
            else if (firstClass.indexOf("inactiveTab") == -1)
            {
                sp[0].className = StylerBase.getFirstCssClass(sp[0]).replace(
                    new RegExp("activeTab"), "inactiveTab");
                sp[1].className = StylerBase.getFirstCssClass(sp[1]).replace(
                    new RegExp("activeTab"), "inactiveTab");
                sp[2].className = StylerBase.getFirstCssClass(sp[2]).replace(
                    new RegExp("activeTab"), "inactiveTab");

                var contentDiv = doc.getElementById(lis[i].getAttribute("tabId"));
                if (contentDiv != null)
                {
                    contentDiv.className = "tabContentInactive";
                }
            }
            else
            {
                sp[0].className = StylerBase.getFirstCssClass(sp[0]);
                sp[1].className = StylerBase.getFirstCssClass(sp[1]);
                sp[2].className = StylerBase.getFirstCssClass(sp[2]);
            }

            if (i == 0)
            {
                sp[0].className += " primary";
            }
            else
            {
                sp[0].className += " secondary";
            }
        }
    }

    if (stylerLoadAttribute != null)
    {
        StylerBase.performFunctionCallback(wnd,
                                stylerLoadAttribute,
                                new Array(wnd, obj));
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
StylerBase.tabControlOnMouseOver = function(obj)
{
    var spans = obj.getElementsByTagName("span");

    if (spans[1].className.indexOf("inactiveTab") >= 0 &&
        spans[1].className.indexOf("Hover") == -1)
    {
        StylerBase.addTabControlHoverEffect(spans[0]);
        StylerBase.addTabControlHoverEffect(spans[1]);
        StylerBase.addTabControlHoverEffect(spans[2]);
    }
};

//-----------------------------------------------------------------------------
StylerBase.addTabControlHoverEffect = function(obj)
{
    var classAry = obj.className.split(" ");
    var firstClass = classAry[0];
    var restClasses = classAry.slice(1, classAry.length);

    if (firstClass.indexOf("Hover") == -1)
    {
        obj.className = firstClass + "Hover";

        if (restClasses.length > 0)
        {
            obj.className += " " + restClasses.join(" ");
        }
    }
};

//-----------------------------------------------------------------------------
StylerBase.removeTabControlHoverEffect = function(obj)
{
    obj.className = obj.className.replace(new RegExp("Hover"), "");
};

//-----------------------------------------------------------------------------
StylerBase.tabControlOnMouseOut = function(obj)
{
    var spans = obj.getElementsByTagName("span");

    if (spans[1].className.indexOf("Hover") >= 0)
    {
        StylerBase.removeTabControlHoverEffect(spans[0]);
        StylerBase.removeTabControlHoverEffect(spans[1]);
        StylerBase.removeTabControlHoverEffect(spans[2]);
    }
};

//
// List functions
//-----------------------------------------------------------------------------
StylerBase.highlightListRow = function(obj)
{
    var tbl = obj;
    var hoverLeft = null;
    var hoverRight = null;
    var done = false;
    var doc = StylerBase.getElementDocument(obj);

    while (!done)
    {
        tbl = tbl.parentNode;
        if (tbl.nodeName.toLowerCase() == "table")
        {
            done = true;
        }
    }

    var firstDataCell = null;
	var nbrCells = obj.cells.length;
	for (var i=0; i<nbrCells; i++)
	{
		if ((obj.cells[i].getAttribute("id") && (obj.cells[i].getAttribute("id").indexOf("LeftCol") != -1
						|| obj.cells[i].getAttribute("id").indexOf("RightCol") != -1))
				|| (obj.cells[i].className && (obj.cells[i].className.indexOf("listLeftBorderStyler") != -1
						|| obj.cells[i].className.indexOf("listRightBorderStyler") != -1)))
		{
			continue;
		}
		else
		{
			if (obj.cells[i].className && obj.cells[i].className.indexOf("listRowHoverStyler") == -1)
				obj.cells[i].className += " listRowHoverStyler";
			else
				obj.cells[i].className = "listRowHoverStyler";
			if (firstDataCell == null)
				firstDataCell = obj.cells[i];
		}
	}
	
    // create left and right rounded corner rollover images
    // if they don't already exist
    if (doc.getElementById("listRowHoverLeft") == null)
    {
        hoverLeft = doc.createElement("span");
        hoverLeft.className = "listRowHoverLeftStyler";
        hoverLeft.setAttribute("id", "listRowHoverLeft");
        hoverLeft.appendChild(doc.createTextNode("\u00a0"));
        doc.body.appendChild(hoverLeft);
    }
    else
    {
        hoverLeft = doc.getElementById("listRowHoverLeft");
    }

    var rowFldPos;
    if (firstDataCell != null)
    	rowFldPos = window.PositionObject.getInstance(firstDataCell);    
    else
    	rowFldPos = window.PositionObject.getInstance(obj);	 
    var yPos = rowFldPos.thetop;

    // find the position of the first cell in the first table row
    var tblRows = tbl.getElementsByTagName("tr");
    var tblCells;
    if (tblRows.length > 1 && tblRows[0].parentNode.style.display == "none")
    	tblCells = tblRows[1].cells;
    else
    	tblCells = (tblRows.length > 0) ? tblRows[0].cells : null;
    var firstCellFldPos = window.PositionObject.getInstance(tblCells[0]);
    var xPos = firstCellFldPos.left;    
    
    // position the left rollover image
    hoverLeft.style.top = yPos + "px";
    hoverLeft.style.left = xPos + "px";
    hoverLeft.style.height = ((rowFldPos.height) ? rowFldPos.height : 25) + "px";
    hoverLeft.style.width = ((firstCellFldPos.width) ? firstCellFldPos.width : 7) + "px";
    hoverLeft.style.position = "absolute";
    hoverLeft.style.display = "block";

    if (doc.getElementById("listRowHoverRight") == null)
    {
        hoverRight = doc.createElement("span");
        hoverRight.className = "listRowHoverRightStyler";
        hoverRight.setAttribute("id", "listRowHoverRight");
        hoverRight.appendChild(doc.createTextNode("\u00a0"));
        doc.body.appendChild(hoverRight);
    }
    else
    {
        hoverRight = doc.getElementById("listRowHoverRight");
    }

    // find the left position of the last cell in this table
    var lastCellFldPos = null;
	for (var j=tblCells.length-1; j>=0; j--)
	{
		if (tblCells[j].style.display != "none")
		{
		    lastCellFldPos = window.PositionObject.getInstance(tblCells[j]);
		    xPos = lastCellFldPos.left;			
		    break;
		}
	}

    // position the right rollover image
    hoverRight.style.top = yPos + "px";
    hoverRight.style.left = xPos + "px";
    hoverRight.style.height = ((rowFldPos.height) ? rowFldPos.height : 25) + "px"; 
    hoverRight.style.width = ((lastCellFldPos && lastCellFldPos.width) ? lastCellFldPos.width : 7) + "px";
    hoverRight.style.position = "absolute";
    hoverRight.style.display = "block";
};

//-----------------------------------------------------------------------------
StylerBase.unhighlightListRow = function(obj)
{
    var tbl = obj;
    var done = false;

    while (!done)
    {
        tbl = tbl.parentNode;
        if (tbl.nodeName.toLowerCase() == "table")
        {
            done = true;
        }
    }    
    
    // remove the table row rollover    
	var nbrCells = obj.cells.length;
	for (var i=0; i<nbrCells; i++)
	{
	    obj.cells[i].className = obj.cells[i].className.replace(new RegExp("\\blistRowHoverStyler"), "");
	}

    var doc = StylerBase.getElementDocument(obj);

    // hide the left rollover image
    if (doc.getElementById("listRowHoverLeft") != null)
    {
        var hoverLeft = doc.getElementById("listRowHoverLeft");
        hoverLeft.style.display = "none";
    }

    // hide the right rollover image
    if (doc.getElementById("listRowHoverRight") != null)
    {
        var hoverRight = doc.getElementById("listRowHoverRight");
        hoverRight.style.display = "none";
    }
};

//-----------------------------------------------------------------------------
StylerBase.selectControlOnClick = function(obj, wnd)
{
    var inputBox = StylerBase.getPreviousSibling(obj);
    var clickAttribute = inputBox.getAttribute("styler_click");

    StylerBase.performFunctionCallback(wnd,
                                       clickAttribute,
                                       new Array(inputBox, wnd));
};

//-----------------------------------------------------------------------------
StylerBase.searchControlOnClick = function(wnd, obj, evt)
{
    var inputBox = wnd.document.getElementById(obj.getAttribute("for"));
};

//-----------------------------------------------------------------------------
StylerBase.expanderControlOnClick = function(obj, wnd)
{
    var expanderDiv = StylerBase.getNextSibling(obj);
    var clickAttribute = expanderDiv.getAttribute("styler_click");

    StylerBase.performFunctionCallback(window,
                                       clickAttribute,
                                       new Array(expanderDiv, wnd));
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
              "StylerBase.calendarControlOnClick \n ldsStylerBase.js");
        return;
    }

    // NOTE: You must have a variable called "calObj" declared as a CalendarObject() from webappjs
    if (typeof(wnd.calObj) == "undefined" || wnd.calObj == null)
    {
        wnd.calObj = new wnd.CalendarObject(wnd, wnd.CalendarObject.MMDDYY, "/", null);
        wnd.calObj.styler = StylerBase._singleton;
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
    comboBox.className = (open) ?
   			"comboBoxOpenStyler" : "comboBoxStyler";                           
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
    var sp = obj.getElementsByTagName("span");

    for (var i=0; i<sp.length; i++)
    {
        if (sp[i].className == "comboBoxLeftSideStyler" ||
            sp[i].className == "comboBoxRightSideStyler")
        {
            sp[i].className += "Hover";
        }
    }

    if (obj.className.indexOf("selected") >= 0)
    {
        obj.className = "comboBoxOpenStylerHover selected";
    }
    else
    {
        obj.className = "comboBoxOpenStylerHover";
    }
};

//-----------------------------------------------------------------------------
StylerBase.unhilightComboBoxItem = function(obj)
{
    // unhighlight this combo box item
    var ul = obj.parentNode;
    var sp = obj.getElementsByTagName("span");

    ul.removeAttribute("hilightIndex");

    for (var i=0; i<sp.length; i++)
    {
        if (sp[i].className == "comboBoxLeftSideStylerHover" ||
            sp[i].className == "comboBoxRightSideStylerHover")
        {
            sp[i].className = sp[i].className.replace(new RegExp("Hover\\b"),
                                                      "");
        }
    }

    obj.className = obj.className.replace(
                        new RegExp("comboBoxOpenStylerHover\\b"),
                        "");
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

        var leftHighlightSpan = doc.createElement("span");
        leftHighlightSpan.className = "comboBoxLeftSideStyler";
        leftHighlightSpan.appendChild(doc.createTextNode("\u00a0"));

        var rightHighlightSpan = doc.createElement("span");
        rightHighlightSpan.className = "comboBoxRightSideStyler";
        rightHighlightSpan.appendChild(doc.createTextNode("\u00a0"));

        li.appendChild(leftHighlightSpan);

        var textSpan = doc.createElement("span");
        textSpan.className = "comboBoxTextValueStyler";
        textSpan.appendChild(doc.createTextNode(
            optTxt.replace(/ /g,"\u00a0")));
        li.appendChild(textSpan);

        li.appendChild(rightHighlightSpan);

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

    obj.className = "comboBoxOpenStyler";

    var comboSpan = doc.getElementById(selectID + "_combobox");
    var inputBox = doc.getElementById(selectID + "_comboboxinput");

    // position it
    var comboFldPos = wnd.PositionObject.getInstance(inputBox);
    var leftPos = comboFldPos.left - 6;
    var topPos = comboFldPos.thetop + comboFldPos.height;

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
    }
    catch(e) {}

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
    var mouseX = evt.clientX + docElm.scrollLeft;
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

    if ((comboBox.className == "comboBoxOpenStyler") &&
        (StylerBase.isMouseOutsideComboBox(evt, comboBox)))
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
    var mouseX = evt.clientX + docElm.scrollLeft;
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
    if (obj.className == "comboBoxOpenStyler")
    {
        StylerBase._currentComboBox = null;
        obj.className = "comboBoxStyler";

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

    if (srcNode != null &&
        srcNode.nodeName.toLowerCase() == "li" &&
        srcNode.className.indexOf("comboBoxOpenStyler") == -1)
    {
        return;
    }

    var cbSpan = obj.childNodes[0];
    var doc = StylerBase.getElementDocument(obj);
    var cbSpanId = cbSpan.getAttribute("id");
    var ul = doc.getElementById(cbSpanId + "list");

    // if there is another combobox currently open, close it
    if ((StylerBase._currentComboBox != null) &&
        (StylerBase._currentComboBox != ul) &&
        (StylerBase._currentComboBox.className == "comboBoxOpenStyler"))
    {
        StylerBase.closeComboBox(StylerBase._currentComboBox);
    }

    StylerBase._currentComboBox = ul;

    if (ul.className == "comboBoxOpenStyler")
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
        StylerBase.selectComboBoxItem(evt,
                                      selItem,
                                      false,
                                      highLight);
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
    if (srcElm.nodeName.toLowerCase() != "input" ||
        srcElm.parentNode.getAttribute("id") == null ||
        srcElm.parentNode.getAttribute("id").indexOf("_combobox") == -1)
    {
        if (StylerBase._currentComboBox != null &&
            StylerBase._currentComboBox.className == "comboBoxOpenStyler")
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
    var vis = (comboBoxObj.className == "comboBoxOpenStyler");

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
                            if (nextElm.className == "hiddenElementStyler" ||
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
                StylerBase.selectComboBoxItem(evt,
                                              cbItems[selIndex -
                                              StylerBase._comboBoxPageSize],
                                              vis,
                                              true);
            }
            else
            {
                // select the first item in the list
                StylerBase.selectComboBoxItem(evt,
                                              cbItems[0],
                                              vis,
                                              true);
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
                StylerBase.selectComboBoxItem(evt,
                                              cbItems[selIndex +
                                              StylerBase._comboBoxPageSize],
                                              vis,
                                              true);
            }
            else
            {
                // select the last item in the list
                StylerBase.selectComboBoxItem(evt,
                                              cbItems[cbItems.length - 1],
                                              vis,
                                              true);
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
                StylerBase.selectComboBoxItem(evt,
                                              cbItems[selIndex - 1],
                                              vis,
                                              true);
            }
            else if (comboBoxObj.getAttribute("openDir") != null &&
                     comboBoxObj.getAttribute("openDir") == "up" &&
                     selIndex == -1)
            {
                StylerBase.selectComboBoxItem(evt,
                                              cbItems[cbItems.length - 1],
                                              vis,
                                              true);
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
                if (firstChar >= 0 &&
                    itemTxt.charAt(firstChar).toLowerCase() == key.toLowerCase())
                {
                    StylerBase.selectComboBoxItem(evt,
                                                  cbItem,
                                                  vis,
                                                  true);
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
                    if (firstChar >= 0 &&
                        itemTxt.charAt(firstChar).toLowerCase() == key.toLowerCase())
                    {
                        StylerBase.selectComboBoxItem(evt,
                                                      cbItem,
                                                      vis,
                                                      true);
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
                pElm.parentNode.className = "radioButtonStyler";
            }
        }
    }
    return;
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
                stylerElements[i].setAttribute("styledAs",
                                               StylerBase.ElementTypeUnknown);
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

    theElement.className = "hiddenElementStyler";
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
            theElement.setAttribute("styledAs",
                                    StylerBase.ElementTypeTableUnknown);
            if (this.moreInfo)
            {
                alert("STYLER attribute on TABLE tag " +
                      "with unsupported styler value of: " +
                      stylerAttribute);
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
            alert("Replacing " +
                  theElement.className +
                  " with listStyler");
            debugger;
        }
        this.elementWarnings(wnd, theElement);
    }

    if (theElement.getAttribute("styler_background") != null && theElement.getAttribute("styler_background").toLowerCase() == "no")
   		theElement.className = "listStylerNoImage";
    else
    	theElement.className = "listStyler";

    theElement.setAttribute("cellspacing", "0");
    theElement.setAttribute("cellpadding", "0");
    theElement.setAttribute("border", "0");
    //theElement.removeAttribute("style");
    theElement.cellSpacing = 0;
    theElement.cellPadding = 0;
    theElement.setAttribute("styledAs", StylerBase.ElementTypeList);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.setListElementColumnMouseovers = function(tblHdr)
{
	if (!tblHdr)
		return;
	
    tblHdr.onmousedown = function()
    {
        this.className = "listHeaderMiddleBorderActiveStyler";						
    };

    tblHdr.onmouseover = function()
    {
        this.className = "listHeaderMiddleBorderHoverStyler";
    };

    tblHdr.onmouseout = function()
    {
        this.className = "listHeaderMiddleBorderStyler";
    };	
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processListElementColumns = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    var rows = theElement.getElementsByTagName("tr");
    var hdrs = null;
    var hdrRowHeight = 27;
    var minRowHeight = 27;

    var rowsNotStyled = this.getLikeDescendants(theElement,
                                                "tr",
                                                "styler",
                                                "skip");

    if (rows.length - rowsNotStyled.length > 0)
    {
        var i = 0;
        var hdrRow = rows[i];
        while (hdrRow.getAttribute("styler") == "skip")
        {
            i++;
            hdrRow = rows[i];
        }

        if (hdrRow.className != "")
        {
            hdrRow.className = "";
        }

        // style the headers
        hdrs = hdrRow.getElementsByTagName("th");

        // only style <th> nodes as headers
        if (hdrs.length == 0)
        {
            if (this.moreInfo)
            {
                alert("Attempting to restyle a list that " +
                      "does not contain table headers (<TH>)");
                debugger;
            }
        }

        // style the header row
        if (hdrs.length > 0)
        {
            // has this row been styled already?
            if (hdrs[0].className == "listHeaderLeftBorderStyler")
            {
                return;
            }

            for (var k=0; k<hdrs.length; k++)
            {
                var hdr = hdrs[k];
                hdr.className = "listHeaderMiddleBorderStyler";
                hdr.style.height = minRowHeight + "px";

                var mHdr = wnd.document.createElement("div");
                mHdr.className = "listHeaderMiddleStyler";

                var clickAttribute = hdr.getAttribute("styler_click");
                var sortAttribute = hdr.getAttribute("styler_sort");
                var initAttribute = hdr.getAttribute("styler_init");

                if (sortAttribute != null || clickAttribute != null)
                {
                	this.setListElementColumnMouseovers(hdr);
                }

                var mHdrContent = wnd.document.createElement("span");
                mHdrContent.className = "listHeaderMiddleContentStyler";

                // insert the child nodes of the table header into the new header span
                if (hdr.childNodes.length > 0)
                {
                    var len = hdr.childNodes.length;
                    var firstNode;

                    for (var j=len-1; j>=0; j--)
                    {
                        firstNode = (mHdrContent.childNodes.length > 0) ? mHdrContent.childNodes[0] : null;
                        mHdrContent.insertBefore(hdr.childNodes[j], firstNode);
                    }
                }

                mHdr.appendChild(mHdrContent);

                // sort arrows
                if (sortAttribute != null)
                {
                    mHdrContent.className =
                        (sortAttribute.toLowerCase() == "descending") ?
                        "listHeaderMiddleContentSortDescendingStyler" :
                        "listHeaderMiddleContentSortAscendingStyler";
                    mHdr.setAttribute("styler_sort", sortAttribute);
    				// Remove the sort indicator in cases where none of the fields are yet sorted.
    				if (sortAttribute == "none")
    					mHdrContent.className = "";
                }

                if (clickAttribute != null)
                {
                    mHdr.setAttribute("styler_click", clickAttribute);
                    hdr.onclick = function()
                    {
                        var sortAttribute = this.getAttribute("styler_sort");
                        var mHdr = (this.childNodes.length > 0) ? this.childNodes[0] : null;
                        var contentDiv = (mHdr != null && mHdr.childNodes.length > 0) ? mHdr.childNodes[0] : null;

                        if (sortAttribute != null && mHdr != null && contentDiv != null)
                        {
                            if (sortAttribute.toLowerCase() == "ascending")
                            {
                                contentDiv.className = "listHeaderMiddleContentSortDescendingStyler";
                                mHdr.setAttribute("styler_sort", "descending");
                            }
                            else
                            {
                                contentDiv.className = "listHeaderMiddleContentSortAscendingStyler";
                                mHdr.setAttribute("styler_sort", "ascending");
                            }
                        }

                        var clickAttr = (mHdr != null) ? mHdr.getAttribute("styler_click") : null;
                        if (clickAttr != null)
                        {
                        	wnd = (typeof(wnd) == "undefined" || !wnd) ? window : wnd;
                            StylerBase.performFunctionCallback(wnd, clickAttr, new Array(wnd, mHdr));
                        }
                    };
                }

                if (initAttribute != null)
                {
                    StylerBase.performFunctionCallback(wnd, initAttribute, new Array(wnd, mHdr));
                }

                hdr.innerHTML = "";
                hdr.appendChild(mHdr);
            }

            hdrRowHeight = (hdrs.length > 0) ? hdrs[0].clientHeight : minRowHeight;

            // create the left row header corner
            var lRow = wnd.document.createElement("th");
            lRow.className = "listHeaderLeftBorderStyler";

            var lCnr = wnd.document.createElement("div");
            lCnr.className = "listHeaderLeftSideStyler";

            var lHdr = wnd.document.createElement("div");
            lHdr.className = "listHeaderLeftStyler";

            var lHdrBottom = wnd.document.createElement("div");
            lHdrBottom.className = "listHeaderLeftBackgroundStyler";

            lHdr.appendChild(lHdrBottom);
            lCnr.appendChild(lHdr);

            lRow.appendChild(lCnr);
            hdrRow.insertBefore(lRow, hdrRow.childNodes[0]);

            // create the right row header corner
            var rRow = wnd.document.createElement("th");
            rRow.className = "listHeaderRightBorderStyler";

            var rCnr = wnd.document.createElement("div");
            rCnr.className = "listHeaderRightSideStyler";

            var rHdr = wnd.document.createElement("div");
            rHdr.className = "listHeaderRightStyler";

            var rHdrBottom = wnd.document.createElement("div");
            rHdrBottom.className = "listHeaderRightBackgroundStyler";

            rHdr.appendChild(rHdrBottom);
            rCnr.appendChild(rHdr);

            rRow.appendChild(rCnr);
            hdrRow.appendChild(rRow);

            // move the recessed background image down to the bottom of the table headers          
            if (hdrRowHeight > minRowHeight)
            {
                var isSafari = (navigator.userAgent.indexOf("Safari") >= 0);
            	var isFirefox = (navigator.userAgent.indexOf("Firefox") >= 0);
            	var isChrome = (navigator.userAgent.indexOf("Chrome") >= 0);
            	var newHeight = hdrRowHeight;
            	if (isFirefox && ((hdrRowHeight - minRowHeight) >= 6))
            		newHeight = hdrRowHeight - 6;
            	else if (isChrome)
            		newHeight = hdrRowHeight;
            	theElement.style.backgroundPosition = "0px " + newHeight + "px";
            	if (!isSafari)
                {
                	lRow.style.height = newHeight + "px";
                	rRow.style.height = newHeight + "px";
                }
            }           
        }
    }
    return;
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
    for (var i = 0; i < elementList.length; i++)
    {
        if (elementList[i].parentNode == theElement)
        {
            tableHBF.theadElement = elementList[i];
            tableHBF.theadRows = tableHBF.theadElement.getElementsByTagName("tr");
            tableHBF.theadCountRows = tableHBF.theadRows.length;
            tableHBF.isThead = true;
            tableHBF.theadRowsNotStyled =
                this.getLikeDescendants(tableHBF.theadElement,
                                        "tr",
                                        "styler",
                                        "skip");
            tableHBF.theadCountRowsNotStyled =
                tableHBF.theadRowsNotStyled.length;
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
            tableHBF.tbodyRowsNotStyled =
                this.getLikeDescendants(tableHBF.tbodyElement,
                                        "tr",
                                        "styler",
                                        "skip");
            tableHBF.tbodyCountRowsNotStyled =
                tableHBF.tbodyRowsNotStyled.length;
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
            tableHBF.tfootRowsNotStyled =
                this.getLikeDescendants(tableHBF.tfootElement,
                                        "tr",
                                        "styler",
                                        "skip");
            tableHBF.tfootCountRowsNotStyled =
                tableHBF.tfootRowsNotStyled.length;
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
    var countRowsNotStyled = 0;
    if (tableHeadBodyFoot.isTbody)
    {
        rows = tableHeadBodyFoot.tbodyRows;
        countRowsNotStyled = tableHeadBodyFoot.tbodyCountRowsNotStyled;
    }
    else
    {
        rows = theElement.getElementsByTagName("tr");
        var rowsNotStyled = this.getLikeDescendants(theElement,
                                                    "tr",
                                                    "styler",
                                                    "skip");
        countRowsNotStyled = rowsNotStyled.length;
    }
    var hdrs = null;
    var bordersExist = false;
	var stylerBorderAttribute = theElement.getAttribute("styler_border");
	var addBorders = (stylerBorderAttribute == null || stylerBorderAttribute.toString().toLowerCase() != "no");

    if (rows.length - countRowsNotStyled > 0)
    {
        // Remove bottom rules
        // <tr><td><img class='listBottomRuleStyler'>
        var bottomRules = this.getLikeDescendants(theElement,
                                                  "img",
                                                  (navigator.userAgent.indexOf("MSIE") >= 0) ? "className" : "class",
                                                  "listBottomRuleStyler");
        for (var i = 0; i < bottomRules.length; i++)
        {
            bottomRules[i].parentNode.parentNode.parentNode.removeChild(
                bottomRules[i].parentNode.parentNode);
        }

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

        // style the remaining rows
        if (rows.length > firstRowIndex)
        {
            var firstRow = rows[firstRowIndex];
            var rCells = firstRow.getElementsByTagName("td");

            // has the first row been styled already?
            if (rCells.length > 0 && rCells[0].className == "listLeftBorderStyler")
            {
                bordersExist = true;
            }

            // only insert the left and right borders if they don't exist
            if (!bordersExist && addBorders)
            {
                // insert the left border column
                var lBdr = wnd.document.createElement("td");

                lBdr.className = "listLeftBorderStyler";
                lBdr.style.padding = "0px";
                lBdr.setAttribute("rowspan", String(rows.length));
                lBdr.rowSpan = rows.length;
                lBdr.appendChild(wnd.document.createTextNode("\u00a0"));

                if (rCells.length > 0)
                {
                    rCells[0].parentNode.insertBefore(lBdr, rCells[0]);
                }
                else
                {
                    firstRow.appendChild(lBdr);
                }

                // insert the right border column
                var rBdr = wnd.document.createElement("td");
                rBdr.className = "listRightBorderStyler";
                rBdr.style.padding = "0px";
                rBdr.setAttribute("rowspan", String(rows.length));
                rBdr.rowSpan = rows.length;
                rBdr.appendChild(wnd.document.createTextNode("\u00a0"));
                firstRow.appendChild(rBdr);
            }
            // if the table rows are being styled again, reset the left and right border rowspans in case the
            // number of rows has changed
            else if (bordersExist && addBorders)
            {
                var lBdr = rCells[0];
                lBdr.setAttribute("rowspan", String(rows.length));
                lBdr.rowSpan = rows.length;

                var rBdr = rCells[rCells.length - 1];
                rBdr.setAttribute("rowspan", String(rows.length));
                rBdr.rowSpan = rows.length;
            }

            // add rollover events
            for (var j=firstRowIndex; j<rows.length; j++)
            {
            	var rCells = rows[j].getElementsByTagName("td");
            
                // if this row is being styled again and rows have been inserted above the row containing the left
                // and right border cells, remove the cells containing the left and right borders
                if (j > firstRowIndex)
                {
                    if (rCells.length > 0 && rCells[0].className == "listLeftBorderStyler")
                    {
                        var lBdr = rCells[0];
                        var rBdr = rCells[rCells.length - 1];

                        lBdr.parentNode.removeChild(lBdr);
                        rBdr.parentNode.removeChild(rBdr);
                    }
                }

				if (rows[j].getAttribute("styled") == "true")
				{
					continue;
				}
				if (!addBorders && rCells.length > 0)
				{
					if (rCells[0].getAttribute("id") == null || rCells[0].getAttribute("id").indexOf("LeftCol") != 0)
					{
						var lBdr = wnd.document.createElement("td");
						
						lBdr.className = "listLeftPadStyler";
						lBdr.appendChild(wnd.document.createTextNode("\u00a0"));
					    rCells[0].parentNode.insertBefore(lBdr, rCells[0]);
						lBdr.setAttribute("id", "LeftCol"+j);
					}
					if (rCells[rCells.length-1].getAttribute("id") == null || rCells[rCells.length-1].getAttribute("id").indexOf("RightCol") != 0)
					{
						var rBdr = wnd.document.createElement("td");
						
						rBdr.className = "listRightPadStyler";
						rBdr.appendChild(wnd.document.createTextNode("\u00a0"));
						rCells[0].parentNode.appendChild(rBdr);
						rBdr.setAttribute("id", "RightCol"+j);
					}
				}

                if (rows[j].className != "")
                {
                    rows[j].className = "";
                }

                rows[j].onmouseover = function()
                {
                    StylerBase.highlightListRow(this);
                };

                rows[j].onmouseout = function()
                {
                    StylerBase.unhighlightListRow(this);
                };
                
                rows[j].setAttribute("styled", "true");
            }
        }
    }

    if (addBorders)
    {
	    // insert the bottom border row
	    var bRow = wnd.document.createElement("tr");
	    var bCell = wnd.document.createElement("td");
	
	    if (hdrs != null && hdrs.length > 0)
	    {
	        bCell.setAttribute("colspan", String(hdrs.length));
	        bCell.colSpan = hdrs.length;
	    }
	    else if (rows.length > 0)
	    {
	        var cells = rows[0].getElementsByTagName("td");
	        var nbrCols = (cells.length > 0) ? cells.length : 1;
	        bCell.setAttribute("colspan", String(nbrCols));
	        bCell.colSpan = nbrCols;	
	    }
	    else
	    {
	        // we shouldn't have more than 500 columns
	        bCell.setAttribute("colspan", "500");
	        bCell.colSpan = 500;
	    }
	
	    bCell.className = "listBottomBorderStyler";
	    bCell.style.border = "0px";
	    bCell.style.height = "2px";
	
	    if (theElement.offsetWidth >= 70)
	    {
	        var bottomRuleWidth = parseInt(theElement.offsetWidth * .80, 10);
	        var bImg = wnd.document.createElement("img");
	        bImg.className = "listBottomRuleStyler";
	        bImg.src = StylerBase.webappjsURL + "/lds/images/01_list_bottomrule.png";
	        bImg.style.width = bottomRuleWidth + "px";
	        bCell.appendChild(bImg);
	    }
	    bRow.appendChild(bCell);
	
	    if (rows.length > 0)
	    {
	        var lastRow = rows[rows.length - 1];
	        lastRow.parentNode.appendChild(bRow);
	    }
	    else
	    {
	        if (tableHeadBodyFoot.isTbody)
	        {
	            tableHeadBodyFoot.tbodyElement.appendChild(bRow);
	        }
	        else
	        {
	            theElement.appendChild(bRow);
	        }
	    }
    }
};

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
            theElement.setAttribute("styledAs",
                                    StylerBase.ElementTypeImgUnknown);
            if (this.moreInfo)
            {
                alert("STYLER attribute on IMG tag " +
                      "with unsupported styler value of: " +
                      stylerAttribute);
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

    theElement.src = StylerBase.webappjsURL + "/lds/images/18px-help.gif";
    theElement.style.width = "18px";
    theElement.style.height = "24px";
    theElement.onmouseover = function()
    {
        this.src = StylerBase.webappjsURL + "/lds/images/18px-help-active.gif";
    };
    theElement.onmousedown = function()
    {
        this.onmouseover();
    };
    theElement.onmouseout = function()
    {
        this.src = StylerBase.webappjsURL + "/lds/images/18px-help.gif";
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

    theElement.src = StylerBase.webappjsURL + "/lds/images/18px-drill.gif";
    theElement.style.width = "18px";
    theElement.style.height = "24px";
    theElement.onmouseover = function()
    {
        this.src = StylerBase.webappjsURL + "/lds/images/18px-drill.gif";
    };
    theElement.onmousedown = function()
    {
        this.onmouseover();
    };
    theElement.onmouseout = function()
    {
        this.src = StylerBase.webappjsURL + "/lds/images/18px-drill.gif";
    };
    theElement.setAttribute("styledAs", StylerBase.ElementTypeDrillIcon);
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

    theElement.src = StylerBase.webappjsURL + "/lds/images/18px-settings.png";
    theElement.style.width = "18px";
    theElement.style.height = "24px";
    theElement.onmouseover = function()
    {
        this.src = StylerBase.webappjsURL + "/lds/images/18px-settings-active.png";
    };
    theElement.onmousedown = function()
    {
        this.onmouseover();
    };
    theElement.onmouseout = function()
    {
        this.src = StylerBase.webappjsURL + "/lds/images/18px-settings.png";
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
            alert("Replacing " +
                theElement.className +
                " with textAreaStyler");
            debugger;
        }
    }
    
    if (theElement.disabled || theElement.readOnly)
    {
    	theElement.className = "textAreaDisabledStyler";
    }
    else
    {
    	theElement.className = "textAreaStyler";
    }

    theElement.setAttribute("styledAs", StylerBase.ElementTypeTextArea);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processHyperlinkElement = function(wnd, theElement)
{
    // This doesn't do much but this method is needed for backwards compatibility.
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

            var leftSelectSpan = StylerBase.getPreviousSibling(theElement);
            var rightSelectSpan = StylerBase.getNextSibling(theElement);

            if (leftSelectSpan.className.indexOf("inputBoxLeftSideStyler") != -1)
            {
                leftSelectSpan.className =
                    (theElement.getAttribute("state") == "enabled") ?
                        "inputBoxLeftSideStyler" :
                        "inputBoxLeftSideStyler disabledElementStyler";
            }

            if (rightSelectSpan.className.indexOf("selectRightSideStyler") != -1)
            {
                rightSelectSpan.className =
                    (theElement.getAttribute("state") == "enabled") ?
                        "selectRightSideStyler" :
                        "selectRightSideStyler disabledElementStyler";

                if (!theElement.disabled)
                {
                    this.defineSelectControlOnClickStaticCall(rightSelectSpan, wnd);
                }
                else
                {
                    this.clearSelectControlOnClickStaticCall(rightSelectSpan, wnd);
                }
            }
            
            if (rightSelectSpan.className.indexOf("selectRightSideRequiredStyler") != -1)
            {
                rightSelectSpan.className =
                    (theElement.getAttribute("state") == "enabled") ?
                        "selectRightSideRequiredStyler" :
                        "selectRightSideRequiredStyler disabledElementStyler";

                if (!theElement.disabled)
                {
                    this.defineSelectControlOnClickStaticCall(rightSelectSpan, wnd);
                }
                else
                {
                    this.clearSelectControlOnClickStaticCall(rightSelectSpan, wnd);
                }
            }

            if (theElement.className.indexOf("inputBoxStyler") != -1)
            {
                theElement.className =
                    (theElement.getAttribute("state") == "enabled") ?
                        "inputBoxStyler" :
                        "inputBoxStyler disabledElementStyler";
            }
        }
        return;
    }

// ************************

    var spanLeft = wnd.document.createElement("span");
    spanLeft.className = "inputBoxLeftSideStyler";

    if (theElement.disabled)
    {
        spanLeft.className += " disabledElementStyler";
    }

    spanLeft.appendChild(wnd.document.createTextNode("\u00a0"));

    var spanRight = wnd.document.createElement("span");
    if (theElement.getAttribute("required") != null &&
        theElement.getAttribute("required").toLowerCase() == "true")
    {
        spanRight.className = "selectRightSideRequiredStyler";
    }
    else
    {
        spanRight.className = "selectRightSideStyler";
    }

    if (theElement.disabled)
    {
        spanRight.className += " disabledElementStyler";
    }
    else
    {
        this.defineSelectControlOnClickStaticCall(spanRight, wnd);
    }
    spanRight.appendChild(wnd.document.createTextNode("\u00a0"));

    var newSpan = wnd.document.createElement("span");
    newSpan.className = "inputBoxWrapper";

    var oldChild = theElement.parentNode.replaceChild(newSpan, theElement);
    newSpan.insertBefore(spanRight, null);
    newSpan.insertBefore(oldChild, spanRight);
    newSpan.insertBefore(spanLeft, oldChild);

    if (isDisabled)
    {
        oldChild.setAttribute("state", "disabled");
    }
    else
    {
        oldChild.setAttribute("state", "enabled");
    }

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
                   " with inputBoxStyler");
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
    oldChild.setAttribute("styledAs", StylerBase.ElementTypeInputSelect);
    return;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.defineSelectControlOnClickStaticCall = function(element, wnd)
{
    element.onclick = function()
    {
        StylerBase.selectControlOnClick(this, wnd);
    };
};

//-----------------------------------------------------------------------------
StylerBase.prototype.clearSelectControlOnClickStaticCall = function(element, wnd)
{
    element.onclick = function()
    {
    };
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
    spanLeft.className = "inputBoxLeftSideStyler";
    if (theElement.disabled)
    {
        spanLeft.className += " disabledElementStyler";
    }
    spanLeft.appendChild(wnd.document.createTextNode("\u00a0"));

    var spanCalBorder = wnd.document.createElement("span");
    spanCalBorder.className = "calendarBorderStyler";
    if (theElement.disabled)
    {
        spanCalBorder.className += " disabledElementStyler";
    }

    var spanCal = wnd.document.createElement("span");
    spanCal.className = "calendarStyler";
    if (theElement.disabled)
    {
        spanCal.className += " disabledElementStyler";
    }

    if (!theElement.getAttribute("id"))
    {
        var nameAttr = theElement.getAttribute("name");
        theElement.setAttribute("id", nameAttr);
    }

    spanCal.setAttribute("for", theElement.getAttribute("id"));
    spanCal.appendChild(wnd.document.createTextNode("\u00a0"));

    if (!theElement.disabled)
    {
        this.defineSpanCalOnclickStaticCall(spanCal, wnd);
        spanCal.onmouseover = function()
        {
            this.className = "calendarStylerHover";
        };

        spanCal.onmouseout = function()
        {
            this.className = "calendarStyler";
        };
    }

    spanCalBorder.appendChild(spanCal);

    var spanRight = wnd.document.createElement("span");
    spanRight.className = "calendarRightSideStyler";

    if (theElement.disabled)
    {
        spanRight.className += " disabledElementStyler";
    }

    spanRight.appendChild(wnd.document.createTextNode("\u00a0"));

    var newSpan = wnd.document.createElement("span");
    newSpan.className = "inputBoxWrapper";

    var oldChild = theElement.parentNode.replaceChild(newSpan, theElement);
    newSpan.insertBefore(spanRight, null);
    newSpan.insertBefore(spanCalBorder, spanRight);
    newSpan.insertBefore(oldChild, spanCalBorder);
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
                   " with inputBoxStyler");
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

    this.defineBodyOnmousedownStaticCall(wnd);
    if (this.moreInfo)
    {
        this.elementWarnings(wnd, oldChild);
    }
    oldChild.setAttribute("styledAs", StylerBase.ElementTypeInputCalendar);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processSearchElement = function(wnd, theElement)
{
    // Return if already styled
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeInputSearch)
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

            StylerBase.searchControlOnClick(wnd, this, evt);
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
                   " with inputBoxStyler");
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
            if (theElement.className.indexOf("disabledElementStyler") == -1)
			{			
				theElement.className += " disabledElementStyler";
			}
			var spanLeft = StylerBase.getPreviousSibling(theElement);
            if (spanLeft.className.indexOf("disabledElementStyler") == -1)
            {
		        spanLeft.className += " disabledElementStyler";
			}
			var spanRight = StylerBase.getNextSibling(theElement);
            if (spanRight.className.indexOf("disabledElementStyler") == -1)
			{
		        spanRight.className += " disabledElementStyler";
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
    spanLeft.className = "inputBoxLeftSideStyler";
    if (theElement.disabled || theElement.readOnly)
    {
        spanLeft.className += " disabledElementStyler";
    }
    spanLeft.appendChild(wnd.document.createTextNode("\u00a0"));

    var spanRight = wnd.document.createElement("span");

    if (theElement.getAttribute("required") != null &&
        theElement.getAttribute("required").toLowerCase() == "true")
    {
        spanRight.className = "inputBoxRightSideRequiredStyler";
    }
    else
    {
        spanRight.className = "inputBoxRightSideStyler";
    }
    if (theElement.disabled || theElement.readOnly)
    {
        spanRight.className += " disabledElementStyler";
    }
    spanRight.appendChild(wnd.document.createTextNode("\u00a0"));

    var newSpan = wnd.document.createElement("span");
    newSpan.className = "inputBoxWrapper";

    var oldChild = theElement.parentNode.replaceChild(newSpan, theElement);
    newSpan.insertBefore(spanRight, null);
    newSpan.insertBefore(oldChild, spanRight);
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
                   " with inputBoxStyler");
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
        parNode.className = (theElement.checked) ?
                            "radioButtonActiveStyler" :
                            "radioButtonStyler";

        this.attachRadioElementEvents(wnd, parNode, theElement.disabled);
        return;
    }

    var outerSpan = wnd.document.createElement("span");
    var newSpan = wnd.document.createElement("span");
    newSpan.setAttribute("name", theElement.getAttribute("name"));
    newSpan.className = (theElement.checked) ? "radioButtonActiveStyler" : "radioButtonStyler";

    this.attachRadioElementEvents(wnd, newSpan, theElement.disabled);
    theElement.className = "hiddenElementStyler";

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
        spanElement.className += " disabledElementStyler";
        spanElement.onmousedown = null;
        spanElement.onmouseup = null;
        spanElement.onclick = null;
    }
    else if (spanElement.onclick == null)
    {
        spanElement.onmousedown = function()
        {
            this.className = "radioButtonPressStyler";
            var radioBtn = (this.childNodes.length > 0) ? this.childNodes[0] : null;
            if (radioBtn != null)
            {
	            StylerBase.resetRadioButtons(radioBtn.form, this.getAttribute("name"));
			}                                         
        };
        spanElement.onmouseup = function(evt)
        {
            evt = (evt) ? evt : ((wnd.event) ? wnd.event : "");
            this.className = "radioButtonActiveStyler";
            var radioBtn = (this.childNodes.length > 0) ? this.childNodes[0] : null;
            if (radioBtn != null)
            {
	            radioBtn.click();
	            StylerBase.resetRadioButtons(radioBtn.form, this.getAttribute("name"));
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

        cbSpan.className = (theElement.checked) ?
                            "checkBoxActiveStyler" :
                            "checkBoxStyler";

        this.attachCheckboxElementEvents(wnd, cbSpan, theElement.disabled);
        return;
    }

    var newSpan = wnd.document.createElement("span");
    newSpan.setAttribute("name", theElement.getAttribute("name"));
    newSpan.className = (theElement.checked) ?
                        "checkBoxActiveStyler" :
                        "checkBoxStyler";

    this.attachCheckboxElementEvents(wnd, newSpan, theElement.disabled);

    theElement.className = "hiddenElementStyler";
    theElement.parentNode.insertBefore(newSpan, theElement);
    theElement.setAttribute("styledAs", StylerBase.ElementTypeInputCheckbox);
    return;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.attachCheckboxElementEvents = function(wnd, spanElement, isDisabled)
{
    if (isDisabled)
    {
        spanElement.className += " disabledElementStyler";
        spanElement.onmousedown = null;
        spanElement.onclick = null;
    }
    else if (spanElement.onclick == null)
    {
        spanElement.onclick = function(evt)
        {
            evt = (evt) ? evt : ((wnd.event) ? wnd.event : "");
            var srcNode = (evt.srcElement) ?
                    evt.srcElement :
                    ((evt.target) ? evt.target : null);

            // only handle the event if it came from the span

            if (srcNode != null && srcNode.nodeName.toLowerCase() == "input")
            {
                return;
            }

            var checkBox = StylerBase.getNextSibling(this);

            if (checkBox.checked)
            {
                this.className = "checkBoxStyler";
            }
            else
            {
                this.className = "checkBoxActiveStyler";
            }

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
    }
    return;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processButtonElement = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }

    // ignore button elements that do not have the styler attribute value of 'pushbutton'.
    var stylerAttribute = theElement.getAttribute("styler");
    if (stylerAttribute != "pushbutton")
    {
        return;
    }

    var isDisabled = theElement.disabled;
    var isSecondary = ((theElement.getAttribute("styler_state") != null) &&
                       (theElement.getAttribute("styler_state") == "secondary"));
    isSecondary = isSecondary || isDisabled;

    // disable/enable existing restyled button if the button state has changed
    var elementType = theElement.getAttribute("styledAs");
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
            if (theElement.getAttribute("state") == "primary")
            {
                btnImg.src = StylerBase.webappjsURL +
                    "/lds/images/05_pushbutton_p_rest_panel.png";
            }
            else
            {
                btnImg.src = StylerBase.webappjsURL +
                    "/lds/images/05_pushbutton_s_rest_panel.png";
            }

            var btnSpans = theElement.getElementsByTagName("div");
            var btnSpan;

            for (var i=0; i<btnSpans.length; i++)
            {
                btnSpan = btnSpans[i];

                if (btnSpan.className == null || btnSpan.className == "")
                {
                    continue;
                }

                if (btnSpan.className.indexOf("LeftSideStyler") != -1)
                {
                    btnSpan.className =
                        (theElement.getAttribute("state") == "primary") ?
                                 "pushButtonLeftSideStyler" :
                                 "pushButtonSecondaryLeftSideStyler";
                }
                else if (btnSpan.className.indexOf("RightSideStyler") != -1)
                {
                    btnSpan.className =
                        (theElement.getAttribute("state") == "primary") ?
                                  "pushButtonRightSideStyler" :
                                  "pushButtonSecondaryRightSideStyler";
                }
                else if (btnSpan.className.indexOf("pushButtonContentStyler") != -1)
                {
                    btnSpan.className = "pushButtonContentStyler";
                }
                else
                {
                    continue;
                }

                if (isDisabled)
                {
                    btnSpan.className += " disabledElementStyler";
                }
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

    if (isDisabled)
    {
        theElement.setAttribute("state", "disabled");
    }
    else if (isSecondary)
    {
        theElement.setAttribute("state", "secondary");
    }
    else
    {
        theElement.setAttribute("state", "primary");
    }

    var buttonTxt = (theElement.innerText) ? theElement.innerText : ((theElement.textContent) ? theElement.textContent : "");

    if ((buttonTxt == "") && (theElement.childNodes.length > 0 && theElement.childNodes[0].data != null))
    {
        buttonTxt = theElement.childNodes[0].data;
    }

    var buttonImg = wnd.document.createElement("img");
    if (theElement.getAttribute("state") == "primary")
    {
        buttonImg.src = StylerBase.webappjsURL +
            "/lds/images/05_pushbutton_p_rest_panel.png";
    }
    else
    {
        buttonImg.src = StylerBase.webappjsURL +
            "/lds/images/05_pushbutton_s_rest_panel.png";
    }

    var spanLeft = wnd.document.createElement("div");
    spanLeft.className = (theElement.getAttribute("state") == "primary") ?
                         "pushButtonLeftSideStyler" :
                         "pushButtonSecondaryLeftSideStyler";
    if (isDisabled)
    {
        spanLeft.className += " disabledElementStyler";
    }

    var spanMid = wnd.document.createElement("div");
    spanMid.className = "pushButtonContentStyler";
    if (isDisabled)
    {
        spanMid.className += " disabledElementStyler";
    }
    spanMid.appendChild(wnd.document.createTextNode(buttonTxt));

    var spanRight = wnd.document.createElement("div");
    spanRight.className = (theElement.getAttribute("state") == "primary") ?
                          "pushButtonRightSideStyler" :
                          "pushButtonSecondaryRightSideStyler";
    if (isDisabled)
    {
        spanRight.className += " disabledElementStyler";
    }

    // append the new child nodes to the button
    spanRight.appendChild(buttonImg);
    spanRight.appendChild(spanMid);
    spanLeft.appendChild(spanRight);

    theElement.innerHTML = "";
    theElement.appendChild(spanLeft);

    // create a temporary span to capture the width of the button text
    var spanTmp = wnd.document.createElement("span");
    spanTmp.className = "pushButtonContentStyler";
    spanTmp.style.visibility = "hidden";
    spanTmp.style.width = "auto";
    spanTmp.appendChild(wnd.document.createTextNode(buttonTxt));
    wnd.document.body.appendChild(spanTmp);

    // explicitly set the button width so the background image displays correctly
    theElement.style.width = (spanTmp.offsetWidth + 25) + "px";

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

    if (this.moreInfo && (theElement.className != ""))
    {
        alert("Replacing " +
              theElement.className +
              " with pushButtonStyler");
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
            theElement.setAttribute("styledAs",
                                    StylerBase.ElementTypeDivUnknown);
            if (this.moreInfo)
            {
                alert("STYLER attribute on DIV tag with " +
                      "unsupported styler value of: " +
                      stylerAttribute);
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

            // size the group box to the original element's dimensions
            if (boxHeight)
            {
                oldChild.style.height = (boxHeight) + "px";
                //groupBoxDivs[i].style.height = (boxHeight) + "px";
            }

            if (boxWidth)
            {
                oldChild.style.width = (boxWidth - 10) + "px";
                //groupBoxDivs[i].style.width = (boxWidth - 10) + "px";
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

    // replace the old div element with the tab control divs
    var tabControlDiv = this.createTabControlElement(wnd);
    tabControlDiv.setAttribute("id", theElement.getAttribute("id"));
    tabControlDiv.setAttribute("styler", "tabcontrol");
    var oldChild = theElement.parentNode.replaceChild(tabControlDiv,
                                                      theElement);

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
        StylerBase.performFunctionCallback(wnd,
                                           stylerInitAttribute,
                                           new Array(wnd, oldChild));
    }

    if (this.moreInfo)
    {
        alert("Replacing " +
              theElement.className +
              " with groupBoxStyler");
        debugger;
        this.elementWarnings(wnd, theElement);
    }
    tabControlDiv.setAttribute("styledAs", StylerBase.ElementTypeDivTabControl);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processHeaderElement = function(wnd, theElement)
{
    // Return if already styled
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeDivHeader)
    {
        return;
    }

    if (!wnd)
    {
        wnd = window;
    }

    // replace the class on the old div element with the LDS class
    theElement.className = "headerElementStyler";

    if (this.moreInfo)
    {
        alert("Replacing " +
              theElement.className +
              " with headerElementStyler");
        debugger;
        this.elementWarnings(wnd, theElement);
    }
    theElement.setAttribute("styledAs", StylerBase.ElementTypeDivHeader);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processGroupLineElement = function(wnd, theElement)
{
    // Return if already styled
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeDivGroupLine)
    {
        return;
    }

    if (!wnd)
    {
        wnd = window;
    }

    var bgImg = wnd.document.createElement("img");
    bgImg.src = StylerBase.webappjsURL + "/lds/images/13_group_line.png";
    bgImg.className = "groupLineIconStyler";

    theElement.className = "groupLineStyler";
    if (theElement.childNodes.length > 0)
    {
        theElement.insertBefore(bgImg, theElement.childNodes[0]);
    }
    else
    {
        theElement.insertBefore(bgImg, null);
    }

    if (this.moreInfo)
    {
        alert("Replacing " +
              theElement.className +
              " with groupLineStyler");
        debugger;
        this.elementWarnings(wnd, theElement);
    }
    theElement.setAttribute("styledAs", StylerBase.ElementTypeDivGroupLine);
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
    expanderSpan.className = (stateAttribute == "expanded") ?
                             "expanderExpandedStyler" :
                             "expanderCollapsedStyler";

    expanderSpan.onclick = function()
    {
        if (this.className == "expanderCollapsedStyler")
        {
            this.className = "expanderExpandedStyler";
        }
        else
        {
            this.className = "expanderCollapsedStyler";
        }

        StylerBase.expanderControlOnClick(this, wnd);
    };

    expanderSpan.onmouseover = function()
    {
        if (this.className == "expanderCollapsedStyler")
        {
            this.className = "expanderCollapsedHoverStyler";
        }
        else
        {
            this.className = "expanderExpandedHoverStyler";
        }
    };

    expanderSpan.onmousedown = function()
    {
        if (this.className == "expanderCollapsedStyler")
        {
            this.className = "expanderCollapsedPressStyler";
        }
        else
        {
            this.className = "expanderExpandedPressStyler";
        }
    };

    expanderSpan.onmouseup = function()
    {
        if (this.className.toString().indexOf("Collapsed") != -1)
        {
            this.className = "expanderCollapsedStyler";
        }
        else
        {
            this.className = "expanderExpandedStyler";
        }
    };

    expanderSpan.onmouseout = expanderSpan.onmouseup;

    theElement.parentNode.insertBefore(expanderSpan, theElement);

    if (initAttribute != null)
    {
        // tell the application to render the tabs
        StylerBase.performFunctionCallback(wnd,
                                           initAttribute,
                                           new Array(wnd, theElement, expanderSpan));
    }

    if (this.moreInfo)
    {
        alert("Replacing " +
              theElement.className +
              " with groupLineStyler");
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
            theElement.setAttribute("styledAs",
                                    StylerBase.ElementTypeSpanUnknown);
            if (this.moreInfo)
            {
                alert("STYLER attribute on SPAN tag with " +
                      "unsupported styler value of: " +
                      stylerAttribute);
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
    newSpan.className = "requiredAsteriskStyler";
    newSpan.appendChild(wnd.document.createTextNode("\u00a0"));
	if (theElement.getAttribute("id"))
		newSpan.setAttribute("id", theElement.getAttribute("id"));

    var oldChild = theElement.parentNode.replaceChild(newSpan, theElement);

    if (this.moreInfo)
    {
        alert("Replacing " +
              theElement.className +
              " with requiredAsteriskStyler");
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
    var isPrimary = ((theElement.getAttribute("styler_state") != null) &&
                       (theElement.getAttribute("styler_state") == "primary"));
    if (isDisabled)
    {
        isPrimary = false;
    }

    var cbId = null;

    if (theElement.getAttribute("id") == null ||
        theElement.getAttribute("id") == "")
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
        else if (isPrimary)
        {
            cbState = "primary";
        }
        else
        {
            cbState = "secondary";
        }

        var leftSpan = cbSpan.childNodes[0];
        var textBox = cbSpan.childNodes[1];
        var rightSpan = cbSpan.childNodes[2];
        var cbBg = rightSpan.childNodes[0];
        var cbBtn = cbBg.childNodes[0];

        if (cbState != outerSpan.getAttribute("state"))
        {
            outerSpan.setAttribute("state", cbState);

            this.attachComboBoxElementEvents(wnd, outerSpan, isDisabled);

        if (isDisabled)
        {
            leftSpan.className = "inputBoxLeftSideStyler disabledElementStyler";
            textBox.className = "inputBoxStyler disabledElementStyler";
            textBox.disabled = true;
            if (theElement.getAttribute("required") != null &&
                theElement.getAttribute("required").toLowerCase() == "true")
            {
                rightSpan.className = "inputBoxRightSideComboBoxRequiredStyler comboBoxButtonRightSideRequiredStyler disabledElementStyler";
            }
            else
            {
                rightSpan.className = "inputBoxRightSideStyler comboBoxButtonRightSideStyler disabledElementStyler";
            }
            cbBg.className = "comboBoxBackgroundStyler disabledElementStyler";
        }
        else
        {
            leftSpan.className = "inputBoxLeftSideStyler";
            textBox.className = "inputBoxStyler";
            textBox.disabled = false;
            if (theElement.getAttribute("required") != null &&
                theElement.getAttribute("required").toLowerCase() == "true")
            {
                rightSpan.className = "inputBoxRightSideComboBoxRequiredStyler comboBoxButtonRightSideRequiredStyler";
            }
            else
            {
                rightSpan.className = "inputBoxRightSideStyler comboBoxButtonRightSideStyler";
            }
            cbBg.className = "comboBoxBackgroundStyler";
        }

        cbBtn.className = (isPrimary) ?
                "comboBoxButtonStyler" :
                "comboBoxSecondaryButtonStyler";
        }

        var cbDropDown = wnd.document.getElementById(cbId + "_comboboxlist");

        var newCbDropDown = wnd.document.createElement("ul");
        newCbDropDown.className = "comboBoxStyler";
        newCbDropDown.setAttribute("id", cbId + "_comboboxlist");
        newCbDropDown.setAttribute("name", cbId + "_comboboxlist");
        newCbDropDown.setAttribute("selectID", cbId);
        newCbDropDown.setAttribute("loaded", "0");

        // size the combo box width according to the original select element
        theElement.className = "comboBoxStyler";
        if (theElement.offsetWidth > 0)
        {
        	StylerBase.setElementWidth(wnd, newCbDropDown, theElement);
        	StylerBase.setElementWidth(wnd, textBox, theElement);
        }

        theElement.className = "hiddenElementStyler";

        // if there is a selected item in the original select element,
        // select it in the combobox
        if (theElement.selectedIndex != -1)
        {
            newCbDropDown.setAttribute("selectIndex",
                                String(theElement.selectedIndex));
            var selectElm = theElement.options[theElement.selectedIndex];
            var selectTxt = (selectElm.innerText) ? selectElm.innerText : ((selectElm.textContent) ? selectElm.textContent : "");
            newCbDropDown.setAttribute("hilightIndex", String(theElement.selectedIndex));
            StylerBase.setSelectElementValue(selectElm, cbId, theElement.selectedIndex, selectTxt);
        }

        cbDropDown.parentNode.replaceChild(newCbDropDown, cbDropDown);

        if (cbDropDown.className == "comboBoxOpenStyler")
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
    else if (isPrimary)
    {
        outerSpan.setAttribute("state", "primary");
    }
    else
    {
        outerSpan.setAttribute("state", "secondary");
    }

    this.attachComboBoxElementEvents(wnd, outerSpan, isDisabled);

    var cbSpan = wnd.document.createElement("span");

    cbSpan.setAttribute("id", cbId + "_combobox");
    cbSpan.className = "inputBoxWrapper";

    var leftSpan = wnd.document.createElement("span");
    leftSpan.className = "inputBoxLeftSideStyler";
    if (isDisabled)
    {
        leftSpan.className += " disabledElementStyler";
    }
    leftSpan.appendChild(wnd.document.createTextNode("\u00a0"));

    var textBox = wnd.document.createElement("input");
    textBox.className = "inputBoxStyler";
    if (isDisabled)
    {
        textBox.className += " disabledElementStyler";
        textBox.disabled = true;
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

    var cbBtn = wnd.document.createElement("span");
    cbBtn.setAttribute("id", cbId + "_comboboxbutton");
    cbBtn.className = (isPrimary) ?
                      "comboBoxButtonStyler" :
                      "comboBoxSecondaryButtonStyler";
    cbBtn.appendChild(wnd.document.createTextNode("\u00a0"));

    var cbBg = wnd.document.createElement("span");
    cbBg.className = "comboBoxBackgroundStyler";
    if (document.all && isDisabled)
    {
        cbBg.className += " disabledElementStyler";
    }
    cbBg.appendChild(cbBtn);

    var rightSpan = wnd.document.createElement("span");
    if (theElement.getAttribute("required") != null &&
        theElement.getAttribute("required").toLowerCase() == "true")
    {
        rightSpan.className = "inputBoxRightSideComboBoxRequiredStyler " +
                              "comboBoxButtonRightSideRequiredStyler";
    }
    else
    {
        rightSpan.className = "inputBoxRightSideStyler " +
                              "comboBoxButtonRightSideStyler";
    }
    if (isDisabled)
    {
        rightSpan.className += " disabledElementStyler";
    }
    rightSpan.appendChild(cbBg);

    if (!document.all)
    {
    	if (navigator.userAgent.toLowerCase().indexOf('chrome') == -1)
    	{	
    		textBox.style.marginTop = "1px";
    		textBox.style.marginBottom = "1px";
    	}	
    }    
    
    cbSpan.appendChild(leftSpan);
    cbSpan.appendChild(textBox);
    cbSpan.appendChild(rightSpan);

    var cbDropDown = wnd.document.createElement("ul");
    cbDropDown.className = "comboBoxStyler";
    cbDropDown.setAttribute("id", cbId + "_comboboxlist");
    cbDropDown.setAttribute("name", cbId + "_comboboxlist");
    cbDropDown.setAttribute("selectID", cbId);
    cbDropDown.setAttribute("loaded", "0");

    outerSpan.appendChild(cbSpan);

    // insert the new select immediately before the original one
    theElement.parentNode.insertBefore(outerSpan, theElement);
    theElement.parentNode.insertBefore(cbDropDown, theElement);

    // size the combo box width according to the original select element
    theElement.className = "comboBoxStyler";

    StylerBase.setElementWidth(wnd, cbDropDown, theElement);
    StylerBase.setElementWidth(wnd, textBox, theElement);

    // hide the original select element
    theElement.className = "hiddenElementStyler";

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
        cbDropDown.setAttribute("selectIndex",
                                String(theElement.selectedIndex));
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
              " with comboBoxStyler");
        debugger;
        this.elementWarnings(wnd, theElement);
    }
    theElement.setAttribute("styledAs", StylerBase.ElementTypeComboBox);
    return;
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
                if (tSpan.getAttribute("id") != null &&
                    tSpan.getAttribute("id") == cbBtnId)
                {
                    tSpan.className =
                        (this.getAttribute("state") != "primary") ?
                        "comboBoxSecondaryButtonPressStyler" :
                        "comboBoxButtonPressStyler";
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
                if (tSpan.getAttribute("id") != null &&
                    tSpan.getAttribute("id") == cbBtnId)
                {
                    tSpan.className =
                        (this.getAttribute("state") != "primary") ?
                        "comboBoxSecondaryButtonHoverStyler" :
                        "comboBoxButtonHoverStyler";
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
                if (tSpan.getAttribute("id") != null &&
                    tSpan.getAttribute("id") == cbBtnId)
                {
                    tSpan.className =
                        (this.getAttribute("state") != "primary") ?
                        "comboBoxSecondaryButtonStyler" :
                        "comboBoxButtonStyler";
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
StylerBase.prototype.createGroupBoxElement = function(wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

    var divLeft = wnd.document.createElement("div");
    divLeft.className = "groupBoxLeftSideStyler";

    var divRight = wnd.document.createElement("div");
    divRight.className = "groupBoxRightSideStyler";

    var theElement = wnd.document.createElement("div");
    theElement.className = "groupBoxStyler";

    divRight.appendChild(theElement);
    divLeft.appendChild(divRight);

    return divLeft;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.createTabControlElement = function(wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

    var divLeft = wnd.document.createElement("div");
    divLeft.className = "groupBoxLeftSideStyler tabControlLeftSideStyler";

    var divRight = wnd.document.createElement("div");
    divRight.className = "groupBoxRightSideStyler";

    var theElement = wnd.document.createElement("div");
    theElement.className = "groupBoxStyler";

    var ul = wnd.document.createElement("ul");
    ul.className = "tabControlStyler";

    theElement.appendChild(ul);
    divRight.appendChild(theElement);
    divLeft.appendChild(divRight);

    return divLeft;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.createTabControlListElement = function(wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

    var li = wnd.document.createElement("li");
    li.onclick = function()
    {
        StylerBase.setActiveTabControlTab(this, wnd);
    };
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
StylerBase.prototype.addTab = function(wnd,
                                   tabControl,
                                   tabId,
                                   tabText,
                                   active,
                                   tabContent)
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
        if (uls[i].className == "tabControlStyler")
        {
            ul = uls[i];
        }
        i++;
    }

    if (ul == null)
    {
        if (this.moreInfo)
        {
            alert("Error add tab element to tab control " +
                  tabControl.getAttribute("id") +
                  " with tabControlStyler");
            debugger;
        }
        return ul;
    }

    var lis = ul.getElementsByTagName("li");
    var classStr = (active) ? "active" : "inactive";
    var classState = (lis.length == 0) ? "primary" : "secondary";

    var tabLi = this.createTabControlListElement(wnd);
    tabLi.setAttribute("tabId", tabId);

    var leftSpan = wnd.document.createElement("span");
    leftSpan.className = classStr + "TabLeft " + classState;
    leftSpan.appendChild(wnd.document.createTextNode("\u00a0"));

    var midSpan = wnd.document.createElement("span");
    midSpan.className = classStr + "Tab";
    midSpan.appendChild(wnd.document.createTextNode(tabText));

    var rightSpan = wnd.document.createElement("span");
    rightSpan.className = classStr + "TabRight";
    rightSpan.appendChild(wnd.document.createTextNode("\u00a0"));

    tabLi.appendChild(leftSpan);
    tabLi.appendChild(midSpan);
    tabLi.appendChild(rightSpan);

    ul.appendChild(tabLi);
    ul.parentNode.insertBefore(wnd.document.createTextNode("\u00a0"), null);

    if (tabContent)
    {
        tabContent.setAttribute("id", tabId);
        tabContent.className = ((active) ?
            "tabContentActive" : "tabContentInactive");
        tabContent.removeAttribute("style");
        ul.parentNode.insertBefore(tabContent, null);
    }

    return ul;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addTitleBarMenuItem = function(wnd, icon, itemDesc, menuClickFunc, toolTipText)
{
	// this method is for compatibility with newer themes, which support menus
	this.addTitleBarIcon(wnd, icon, menuClickFunc, toolTipText);
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
	    if (wnd.document.getElementById("titleBarContentList"))
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
StylerBase.prototype.addTitleBar = function(wnd, appName, msg, text)
{
    if (!wnd)
    {
        wnd = window;
    }

	if (this.titleBarExists(wnd))
	{
		return;
	}
	
    // title bar background
    var bgImg = wnd.document.createElement("img");
    bgImg.src = StylerBase.webappjsURL + "/lds/images/01_title_bar_base.png";
    bgImg.className = "titleBarIconStyler";

    var bgDiv = wnd.document.createElement("div");
    bgDiv.className = "titleBarStyler";
    bgDiv.setAttribute("id", "titleBarDiv");
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

    // title bar content list
    var ul = wnd.document.createElement("ul");
    ul.setAttribute("id", "titleBarContentList");
    ul.className = "titleBarContentStyler";

    // logo
    var span = wnd.document.createElement("span");
    span.setAttribute("id", "titleBarLogo");
    span.className = "titleBarLogoStyler";
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
    iconSpan.className = "titleBarIconPanelStyler";
    iconSpan.appendChild(spanRight);

    li = wnd.document.createElement("li");
    li.setAttribute("type", "icons");
    li.appendChild(iconSpan);
    ul.appendChild(li);

    wnd.document.body.style.backgroundPosition = "0px 26px";
    wnd.document.body.style.marginTop = "26px";
    wnd.document.body.style.marginBottom = "0px";
    wnd.document.body.style.marginLeft = "0px";
    wnd.document.body.style.marginRight = "0px";
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addTitleBarMenu = function(wnd, menuName, menuClickFunc)
{
    if (!wnd)
    {
        wnd = window;
    }

	if (!this.titleBarExists(wnd))
	{
		return;
    }

    var ul = wnd.document.getElementById("titleBarContentList");

    // menu
    var span = wnd.document.createElement("span");
    span.className = "titleBarMenuStyler";
    span.appendChild(wnd.document.createTextNode(menuName));
    span.onclick = menuClickFunc;

    var li = wnd.document.createElement("li");
    li.setAttribute("type", "menu");
    li.appendChild(span);

    var lis = ul.getElementsByTagName("li");
    var done = false;
    var i = lis.length - 1;
    var nextElm = null;

    while ((i >= 0) && (nextElm == null) && !done)
    {
        if ((lis[i].getAttribute("type") != null) &&
            ((lis[i].getAttribute("type") == "menu") ||
             (lis[i].getAttribute("type") == "title")))
        {
            if (i < lis.length - 1)
            {
                nextElm = lis[i + 1];
            }
            done = true;
        }
        i--;
    }

    ul.insertBefore(li, nextElm);
    return;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addTitleBarIcon = function(wnd, icon, iconClickFunc, toolTipText)
{
    if (!wnd)
    {
        wnd = window;
    }

	if (!this.titleBarExists(wnd))
	{
		return;
    }

    var ul = wnd.document.getElementById("titleBarContentList");
    
    // icon
    var span = wnd.document.createElement("span");
    span.setAttribute("type", icon);

    switch(icon)
    {
        case StylerBase.TITLE_BAR_HELP_ICON:
            span.className = "titleBarIconHelpStyler";
            span.setAttribute("title", toolTipText || "Help");
            break;
        case StylerBase.TITLE_BAR_HOME_ICON:
            span.className = "titleBarIconHomeStyler";
            span.setAttribute("title", toolTipText || "Home");
            break;
        case StylerBase.TITLE_BAR_LOGOFF_ICON:
            span.className = "titleBarIconLogOffStyler";
            span.setAttribute("title", toolTipText || "Logout");
            break;
        default:
            return;
    }

    span.onclick = iconClickFunc;
    span.onmouseover = function()
    {
        if (this.className != null && this.className.indexOf("Active") == -1)
        {
            this.className += "Active";
        }
    };
    span.onmouseout = function()
    {
        if (this.className != null && this.className.indexOf("Active") >= 0)
        {
            this.className = this.className.replace("Active", "");
        }
    };

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
            var logoutIcon = null;
            for (var j=0; j<iconSpans.length; j++)
            {
            	var iconType = iconSpans[j].getAttribute("type"); 
            	if (iconType == StylerBase.TITLE_BAR_LOGOFF_ICON)
            		logoutIcon = iconSpans[j];
                if (iconType == icon)
                {
                    iconExists = true;
                    iconSpans[j].onclick = iconClickFunc;
                }
            }
            if (!iconExists)
            {
            	// the logout button should be the rightmost icon
            	if (logoutIcon != null)
            		iconPanel.insertBefore(span, logoutIcon);
            	else
                	iconPanel.appendChild(span);
            }
            done = true;
        }
        i--;
    }
    return;
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

    var ul = wnd.document.getElementById("titleBarContentList");

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
                    iconSpans[j].parentNode.removeChild(iconSpans[j]);
                    break;
                }
            }
            done = true;
        }
        i--;
    }
    return;
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

    var ul = wnd.document.getElementById("titleBarContentList");
    var lis = ul.getElementsByTagName("li");
    var done = false;
    var i = 0;

    while ((i < lis.length) && !done)
    {
        if (lis[i].getAttribute("type") != null &&
            lis[i].getAttribute("type") == "title")
        {
            var span = wnd.document.createElement("span");
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

    var ul = wnd.document.getElementById("titleBarContentList");
    var lis = ul.getElementsByTagName("li");
    var done = false;
    var i = 0;

    while ((i < lis.length) && !done)
    {
        if (lis[i].getAttribute("type") != null &&
            lis[i].getAttribute("type") == "data")
        {
            var span = wnd.document.createElement("span");
            span.className = "titleBarAppDataStyler";
            span.appendChild(wnd.document.createTextNode(text));

            lis[i].replaceChild(span, lis[i].childNodes[0]);
            done = true;
        }
        i++;
    }
    return;
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

    var ul = wnd.document.getElementById("titleBarContentList");
    var lis = ul.getElementsByTagName("li");
    var done = false;
    var i = 0;
	var titleBarText = "";

    while ((i < lis.length) && !done)
    {
        if (lis[i].getAttribute("type") != null &&
            lis[i].getAttribute("type") == "data")
        {
			titleBarText = lis[i].childNodes[0].innerHTML;			
            done = true;
        }
        i++;
    }
    return titleBarText;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.setTitleBarMessage = function(wnd, msg)
{
    if (!wnd)
    {
        wnd = window;
    }

	if (!this.titleBarExists(wnd))
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
                    span = wnd.document.createElement("span");
                    span.className = "titleBarMessageStyler";
                    span.type = "message";
                    span.appendChild(wnd.document.createTextNode(msg));

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
StylerBase.prototype.addSortArrow = function(wnd, theElement, sortDirection, clickFunctionStr)
{
    sortDirection = (sortDirection) ? sortDirection.toLowerCase() : "ascending";
    var newSortDirection = (sortDirection == "ascending") ? "descending" : "ascending";
    var contentDiv = (theElement.childNodes.length > 0) ? theElement.childNodes[0] : null;

    if (theElement.getAttribute("styler_sort") == newSortDirection)
    {
    	return;
    }    
    
	if (contentDiv != null)
	{
	    contentDiv.className = (sortDirection == "descending") ? "listHeaderMiddleContentSortDescendingStyler" : "listHeaderMiddleContentSortAscendingStyler";
	}
    theElement.setAttribute("styler_sort", sortDirection);

    if (clickFunctionStr)
    {
        theElement.setAttribute("styler_click", clickFunctionStr);

        theElement.onclick = function()
        {
            var sortAttribute = this.getAttribute("styler_sort");
            var contentDiv = (this.childNodes.length > 0) ? this.childNodes[0] : null;

            if (sortAttribute != null && contentDiv != null)
            {
                if (sortAttribute.toLowerCase() == "ascending")
                {
                    contentDiv.className = "listHeaderMiddleContentSortDescendingStyler";
                    this.setAttribute("styler_sort", "descending");
                }
                else
                {
                    contentDiv.className = "listHeaderMiddleContentSortAscendingStyler";
                    this.setAttribute("styler_sort", "ascending");
                }
            }

            var clickAttr = this.getAttribute("styler_click");
            if (clickAttr != null)
            {
                StylerBase.performFunctionCallback(wnd, clickAttr, new Array(this));
            }
        };
    }
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addSkipLink = function(wnd, text, contentID)
{
	//ignore - 508 is not supported in this theme
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addFooter = function(wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

    // footer background
    var bgImg = wnd.document.createElement("img");
    bgImg.src = StylerBase.webappjsURL + "/lds/images/01_list_bottomrule.png";
    bgImg.className = "titleBarRuleIconStyler";

    var bgDiv = wnd.document.createElement("div");
    bgDiv.className = "footerStyler";
    bgDiv.appendChild(bgImg);
    wnd.document.body.appendChild(bgDiv);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addCommandBar = function(wnd, appName, msg, text)
{
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