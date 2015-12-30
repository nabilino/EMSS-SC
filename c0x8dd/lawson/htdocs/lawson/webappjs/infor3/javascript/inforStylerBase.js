/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/infor3/javascript/Attic/inforStylerBase.js,v 1.1.2.82 2014/08/05 02:45:25 kevinct Exp $ */
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
StylerBase.ContextMenuActions = [];
StylerBase.SettingsMenu = null;
StylerBase.DropDownMenu = null;
StylerBase.refreshElement = function(theElement, wnd, options)
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

    options = options || {};
    
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
            stylerObj.processHiddenElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeInputSelect:     // <input type='text' styler='select'>			
            stylerObj.processSelectElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeInputCalendar:   // <input type='text' styler='calendar'>
            stylerObj.processCalendarElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeInputSearch:     // <input type='text' styler='search'>
            stylerObj.processSearchElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeInputText:       // <input type='text' styler>
                                                    // <input type='password' styler>
            stylerObj.processInputTextElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeInputRadio:      // <input type='radio' styler>
            stylerObj.processInputRadioElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeInputCheckbox:   // <input type='checkbox' styler>
            stylerObj.processInputCheckboxElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeInputUnknown:    // <input type='????' styler>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh unknown element (ElementTypeInputUnknown).");
                debugger;
            }
            break;

        case StylerBase.ElementTypeButton:          // <button styler>
            stylerObj.processButtonElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeDivGroupBox:     // <div styler='groupbox'>
            stylerObj.processGroupBoxElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeDivTabControl:   // <div styler='tabcontrol'>
            stylerObj.processTabControlElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeDivHeader:       // <div styler='header'>
            stylerObj.processHeaderElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeDivGroupLine:    // <div styler='groupline'>
            stylerObj.processGroupLineElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeDivExpander:     // <div styler='expander'>
            stylerObj.processExpanderElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeDivUnknown:      // <div styler='????'>
            break;

        case StylerBase.ElementTypeComboBox:        // <select styler>
            stylerObj.processComboBoxElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeAsterisk:        // <span styler='asterisk'>
            stylerObj.processAsteriskElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeSpanUnknown:     // <span styler='????'>
            break;

        case StylerBase.ElementTypeList:            // <table styler='list'>
            stylerObj.processListElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeTableUnknown:    // <table styler='????'>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh unknown element (ElementTypeTableUnknown).");
                debugger;
            }
            break;

        case StylerBase.ElementTypeHelpIcon:        // <img styler='help'>
            stylerObj.processHelpIconElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeDrillIcon:       // <img styler='drill'>
            stylerObj.processDrillIconElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeImgUnknown:      // <img styler='????'>
            if (stylerObj.moreInfo)
            {
                alert("Attempt to refresh unknown element (ElementTypeImgUnknown).");
                debugger;
            }
            break;

        case StylerBase.ElementTypeTextArea:        // <textarea styler>
            stylerObj.processTextAreaElement(wnd, theElement, options);
            break;

        case StylerBase.ElementTypeSettingsIcon:       // <img styler='settings'>
            stylerObj.processSettingsIconElement(wnd, theElement, options);
            break;
            
        case StylerBase.ElementTypeDataGrid:            // <table styler='datagrid'>
            stylerObj.processDataGridElement(wnd, theElement, options);
            break;            

        case StylerBase.ElementTypeAppNav:            // <table styler='appNav'>
            stylerObj.processApplicationNav(wnd, theElement, options);
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
    		try { wnd.$(theElement, wnd.document).nextAll('.inforTriggerField').find('input').focus(); } catch(e) {}
            break;
        default:
            break;
    }
};

//
// Push button functions
//-----------------------------------------------------------------------------
StylerBase.primaryPushButtonByIdWithinId = function(elementID, containedById, wnd)
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
    
    //TODO: add logic to set button as primary in HTML5 controls
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

    if (arguments[2])
    	theElement.setAttribute("disabled", "disabled");
    else if (theElement.getAttribute("disabled") != null)
    	theElement.removeAttribute("disabled");
    theElement.disabled = arguments[2];

    // Return if not already styled
    var elementType = theElement.getAttribute("styledAs");
    if (elementType == null || parseInt(elementType, 10) != StylerBase.ElementTypeButton)
    {
        return;
    }

    StylerBase.refreshElement(theElement, wnd);
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
    var tabControlDiv = tabControl.parentNode;
       
    if (tabControlDiv.getAttribute("styledAs") != StylerBase.ElementTypeDivTabControl)
    {
    	return;
    }
    
    var anchors = obj.getElementsByTagName("a");
    if (anchors.length > 0)
    {
    	var tabId = anchors[0].getAttribute("href");
	    wnd.$(function ()
	    {
	    	//this event triggers StylerBase.fireActiveTabEvents() which fires the styler_load/styler_click events
	    	wnd.$(tabControlDiv, wnd.document).tabs("select", tabId);
	    });
    }
};

//-----------------------------------------------------------------------------
StylerBase.fireActiveTabEvents = function(obj, wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

    var tabControl = obj.parentNode;
    var tabControlDiv = tabControl.parentNode;
       
    if (tabControlDiv.getAttribute("styledAs") != StylerBase.ElementTypeDivTabControl)
    {
    	return;
    }	
    
    var stylerLoadAttribute = tabControl.getAttribute("styler_load");
    var stylerClickAttribute = tabControl.getAttribute("styler_click");

    if (stylerClickAttribute != null)
    {
        StylerBase.performFunctionCallback(wnd, stylerClickAttribute, new Array(wnd, obj));
    }

    if (stylerLoadAttribute != null)
    {
        StylerBase.performFunctionCallback(wnd, stylerLoadAttribute, new Array(wnd, obj));
    }
};

//-----------------------------------------------------------------------------
StylerBase.selectControlOnClick = function(obj, wnd)
{
    var inputBox = obj;
    var clickAttribute = inputBox.getAttribute("styler_click");
    StylerBase.performFunctionCallback(wnd, clickAttribute, new Array(inputBox, wnd));
};

//-----------------------------------------------------------------------------
StylerBase.searchControlOnClick = function(wnd, obj)
{
    var inputBox = obj;
    var clickAttribute = inputBox.getAttribute("styler_click");
    StylerBase.performFunctionCallback(wnd, clickAttribute, new Array(wnd, inputBox));
};

//-----------------------------------------------------------------------------
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

//-----------------------------------------------------------------------------
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

//-----------------------------------------------------------------------------
StylerBase.closeOpenControls = function(evt, wnd)
{
    if (!wnd)
    {
        wnd = window;
    }

    evt = (evt) ? evt : ((wnd.event) ? wnd.event : "");

    //TODO: add logic to close any open HTML5 controls
    //menus, calendar, dropdowns, etc.
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
    
    // 508 compliance - do not put the window in forms mode by default
	if (wnd.document.body.getAttribute("role") == "application")
		wnd.document.body.removeAttribute("role");    
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processHiddenElement = function(wnd, theElement, options)
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

    theElement.className = "inforHiddenCustom";
    theElement.setAttribute("styledAs", StylerBase.ElementTypeHidden);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processTableElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }

    var stylerAttribute = theElement.getAttribute("styler");

    switch (stylerAttribute)
    {
        case "list":
            this.processListElement(wnd, theElement, options);
            break;
            
        case "datagrid":
            this.processDataGridElement(wnd, theElement, options);
            break;            
        
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
StylerBase.prototype.listRowDrillDownOnClick = function(wnd, row)
{
	//override this in your subclass
};

//-----------------------------------------------------------------------------
StylerBase.prototype.listSelectedRowsChanged = function(wnd, theElement, grid, rows)
{
	//override this in your subclass	
};

//-----------------------------------------------------------------------------
StylerBase.prototype.getDataForDataGrid = function(wnd, theElement)
{
	var columns = [];
	var data = [];
	var listRows = theElement.getElementsByTagName("tr");
	var rowsNotStyled = this.getLikeDescendants(theElement, "tr", "styler", "skip");
	
	if ((listRows.length - rowsNotStyled.length) > 0)
	{	
		var rowIdx = 1;
		var listHdrs = listRows[0].getElementsByTagName("th");
		var len = listHdrs.length;	
		var colWidths = [];

		//columns.push({ id: "recordId", name: "Record Id", field: "recordId", width: 40, sortable: true, formatter:UneditableColumnFormatter, hidden: true });
		for (var i=0; i<len; i++)
		{
			var cText = (listHdrs[i].innerText) ? listHdrs[i].innerText : ((listHdrs[i].textContent) ? listHdrs[i].textContent : "");
			var cWidth = Number((wnd.$(listHdrs[i], wnd.document).css("width")).replace("px",""));			
			colWidths[i] = (!isNaN(cWidth)) ? cWidth : 150;
			var col = { id: "col" + i,  name: cText, field: "col" + i, width: colWidths[i], sortable: true, reorderable: true, editor: TextCellEditor, required: false, filterType: TextFilter };
			columns.push(col);
		}
		
		var tableHeadBodyFoot = this.getTableHeadBodyFoot(theElement);
	    if (tableHeadBodyFoot.isTbody)
	    {
	        listRows = tableHeadBodyFoot.tbodyRows;
	        countRowsNotStyled = tableHeadBodyFoot.tbodyCountRowsNotStyled;
	    }
	    else
	    {
	        var rowsNotStyled = this.getLikeDescendants(theElement, "tr", "styler", "skip");
	        countRowsNotStyled = rowsNotStyled.length;
	    }		
		
	    if ((listRows.length - countRowsNotStyled) > 0)
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
	            while (listRows[firstRowIndex].getAttribute("styler") == "skip")
	            {
	                firstRowIndex++;
	            }
	            hdrRow = listRows[firstRowIndex];
	            firstRowIndex++;
	        }	    	
	    	
	        if (listRows.length > firstRowIndex)
	        {	
				var listCols;
				len = listRows.length;				
	            for (var j=firstRowIndex,k=0; j<len; j++,k++)
				{			
					var row = { recordId: k };
					listCols = listRows[j].cells;
					var len2 = listCols.length;
					for (var l=0; (l<len2 && l<columns.length); l++)
					{						
						var cWidth = Number((wnd.$(listCols[l], wnd.document).css("width")).replace("px",""));	
						cWidth = (!isNaN(cWidth)) ? cWidth : 150;
						row[columns[l].id] = listCols[l].innerHTML;
						if (cWidth > colWidths[l])
							colWidths[l] = cWidth;
					}
					data.push(row);
				}
	        }
	    }
	    
	    len = columns.length;
		for (var i=0; i<len; i++)
		{			
			columns[i].width = colWidths[i] + 10;
		}	    
	}
	
	return [columns, data];
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processDataGridElement = function(wnd, theElement, options)
{	
    if (!wnd)
    {
        wnd = window;
    }

    // remove the previous data grid if already styled
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeDataGrid)
    {
    	var removedGrid = false;
    	var prevElm = StylerBase.getPreviousSibling(theElement);
    	while (prevElm && prevElm.className && (prevElm.className.indexOf("inforDataGrid") >= 0 || prevElm.className.indexOf("inforGridFooter") >= 0))
    	{
    		removedGrid = true;
    		prevElm.parentNode.removeChild(prevElm);
    		prevElm = StylerBase.getPreviousSibling(theElement);
    	}
    	// work around height sizing issue in HTML5 control
    	if (removedGrid)
    	{	
    	    wnd.$(function ()
    	    {     		
	        	$(wnd).off("smartresize.inforDataGrid");
    	    });
    	}	
    }    
    
    options = options || {};
    var doDrillDown = (theElement.getAttribute("styler_drilldown") == "true");
    var drillDownTip = theElement.getAttribute("styler_tooltip") || null;
    var drillDownFunc = null;
    var stylerObj = this;
    if (doDrillDown)
    {	
    	drillDownFunc = function(currentRow) 
    	{
    		stylerObj.listRowDrillDownOnClick(wnd, currentRow);
    	};	
    }
    var dataGrid = wnd.document.createElement("div");
    theElement.parentNode.insertBefore(dataGrid, theElement);
    var gridData = this.getDataForDataGrid(wnd, theElement);
    var columns = gridData[0];
    var data = gridData[1];

    var opts = {
		columns: columns,
		idProperty: 'recordId',
		dataset: data,
		editable: true,
		autoEdit: false,
		enableCellNavigation: false,
		showCheckboxes: false,				// true: displays the row selection checkboxes
		showFilter: false,
		showDrillDown: doDrillDown,
		showFooter: false,
		showGridSettings: false,
		drilldown: drillDownFunc,
		drillDownTooltip : drillDownTip,
		fillHeight: false,
		autoHeight: true,
		forceFitColumns: true,
		showColumnHeaders: true,
		multiSelect: false,
		savePersonalization: false,
		enableCellRangeSelection: false,
		showExport: false,
		exportScriptUrl: null
	};
    
    // webkit browsers may not refresh the document.styleSheets object immediately; make sure it's refreshed or the HTML5 control may fail
    if (navigator.userAgent.toLowerCase().indexOf('chrome') >= 0 || navigator.userAgent.toLowerCase().indexOf('safari') >= 0)
    {
	    if (wnd.document.getElementsByTagName("script").length > 0 && wnd.document.styleSheets.length == 0)
	    {
	    	theElement.style.visibility = "hidden";
	    	var stylerObj = this;
	    	setTimeout(function(){stylerObj.processDataGridElement(wnd, theElement, options);}, 25);
	    	return;
	    }
    }
    
    wnd.$(function ()
    {   	
    	var o = wnd.$.extend({}, opts, options); //extend the options if any provided
		var gridObj = wnd.$(dataGrid, wnd.document);
		var grid = gridObj.inforDataGrid(o);
		grid.onSelectedRowsChanged.subscribe(function (e, args) {
			var rows = grid.getSelectedRows();
	    	stylerObj.listSelectedRowsChanged(wnd, theElement, grid, rows);
		});		
		
		// work around height sizing issue in HTML5 control
		gridObj.height(gridObj.height() + 17);
    	var viewport = gridObj.find(".slick-viewport");
    	viewport.height(viewport.height() + 17);		
		$(wnd).on("smartresize.inforDataGrid", function() {
			setTimeout(function(){viewport.height(viewport.height() + 17); gridObj.height(gridObj.height() + 17)}, 20);
		});
    	grid.onClick.subscribe(function (e, args) {
    		var dataView = grid.getData();
    		var currentRow = dataView.getItem(args.row);
    		stylerObj.listRowOnClick(wnd, theElement, grid, currentRow);
    	});
    });
    
    theElement.style.display = "none";
    theElement.setAttribute("styledAs", StylerBase.ElementTypeDataGrid);
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
						var titleTxt = "";
						nSpan.className = "inforDataGridColumnNameSorted";
						if (sAttr.toLowerCase() == "ascending")
						{
							aSpan.className = "inforSortIndicatorDesc";
							titleTxt = "Descending Sort Icon";
							nSpan.setAttribute("styler_sort", "descending");
						}
						else
						{
							aSpan.className = "inforSortIndicatorAsc";
							titleTxt = "Ascending Sort Icon";
							nSpan.setAttribute("styler_sort", "ascending");
						}
						aSpan.setAttribute("title", titleTxt);
						//label for screen readers
						aSpan.setAttribute("aria-label", titleTxt);  
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
	            	var titleTxt = "Drill Down Icon";
					var drillAnchor = wnd.document.createElement("a");
					drillAnchor.className = "inforDrillDown";
					drillAnchor.setAttribute("title", titleTxt);
					drillAnchor.setAttribute("href", "javascript:;");
					drillAnchor.setAttribute("aria-label", titleTxt);
					drillAnchor.style.border = "none";

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
						if (addIcon)
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
						if (addIcon)
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
            alert("Replacing " + theElement.className + " with inforDataGridCustom");
            debugger;
        }
        this.elementWarnings(wnd, theElement);
    }

    theElement.className = "inforDataGridCustom";
    theElement.setAttribute("cellspacing", "0");
    theElement.setAttribute("cellpadding", "0");
    theElement.setAttribute("border", "0");
    theElement.cellSpacing = 0;
    theElement.cellPadding = 0;
    theElement.setAttribute("styledAs", StylerBase.ElementTypeList);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processImageElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }

    var stylerAttribute = theElement.getAttribute("styler");

    switch (stylerAttribute)
    {
        case "help":
            this.processHelpIconElement(wnd, theElement, options);
            break;
        case "drill":
            this.processDrillIconElement(wnd, theElement, options);
            break;
        case "settings":
            this.processSettingsIconElement(wnd, theElement, options);
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
StylerBase.prototype.processHelpIconElement = function(wnd, theElement, options)
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

    var iconBtn = wnd.document.createElement("button");
    iconBtn.setAttribute("type", "button");
    iconBtn.setAttribute("role", "button");    
    iconBtn.className = "inforIconButton help";
    iconBtn.appendChild(wnd.document.createElement("span"));
    
    var titleTxt = "Help";
    if (theElement.getAttribute("alt") != null && theElement.getAttribute("title") == null)
    	theElement.setAttribute("title", theElement.getAttribute("alt"));
    if (theElement.getAttribute("title") != null)
    	titleTxt = theElement.getAttribute("title");
    
    iconBtn.setAttribute("title", theElement.getAttribute("alt"));
	//label for screen readers
	iconBtn.setAttribute("aria-label", titleTxt);    
    var oldChild = theElement.parentNode.replaceChild(iconBtn, theElement);
    
    theElement.setAttribute("styledAs", StylerBase.ElementTypeHelpIcon);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processDrillIconElement = function(wnd, theElement, options)
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
    
    var parElm = theElement.parentNode; 
    if (parElm.nodeName.toLowerCase() == "a")
    {
    	parElm.style.border = "none";
    	parElm.removeAttribute("onmouseover");
    	parElm.removeAttribute("onmouseout");
        parElm.onmouseover = null;
        parElm.onmouseout = null;
        parElm.className = "drilldown";
        parElm.appendChild(wnd.document.createElement("span"));
        if (theElement.getAttribute("alt") != null)
        	parElm.setAttribute("title", theElement.getAttribute("alt"));     
        theElement.style.display = "none";
    }
    else
    {
    	var drillAnchor = wnd.document.createElement("a");
    	drillAnchor.className = "drilldown";
    	drillAnchor.appendChild(wnd.document.createElement("span"));
        if (theElement.getAttribute("alt") != null)
        	parElm.setAttribute("title", theElement.getAttribute("alt"));
        var oldChild = theElement.parentNode.replaceChild(drillAnchor, theElement);
    }
    
    theElement.setAttribute("styledAs", StylerBase.ElementTypeDrillIcon);
};


//-----------------------------------------------------------------------------
StylerBase.prototype.processSettingsIconElement = function(wnd, theElement, options)
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

    var buttonElement = wnd.document.createElement("button");
    var onclickEvent = theElement.getAttribute("onclick");
    var elementTitle = theElement.getAttribute("title");
    buttonElement.setAttribute("type", "button");
    buttonElement.setAttribute("onclick", onclickEvent);    
    buttonElement.setAttribute("class", "inforIconButton settings");
    buttonElement.setAttribute("title", elementTitle);
    buttonElement.appendChild(wnd.document.createElement("span"));
    theElement.parentNode.appendChild(buttonElement);
    theElement.parentNode.replaceChild(buttonElement, theElement);
    
    theElement.setAttribute("styledAs", StylerBase.ElementTypeSettingsIcon);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processTextAreaElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }

    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeTextArea)
    {
	    wnd.$(function ()
	    {  
	    	if (theElement.disabled)
	    		wnd.$(theElement, wnd.document).disable().validationMessage("remove");
	    	else if (theElement.readOnly)
	    		wnd.$(theElement, wnd.document).readOnly().validationMessage("remove");
	    	else
	    		wnd.$(theElement, wnd.document).enable().validationMessage("remove");
	    });	
        return;
    }    
    
    var isRequired = this.isElementRequired(wnd, theElement);
    if (isRequired)
    {	
    	theElement.className = "inforTextArea required";
    	wnd.$(theElement, wnd.document).required();
    }	
    else
    	theElement.className = "inforTextArea";
    
    if (theElement.disabled)	
    	theElement.setAttribute("disabled", "disabled");
    if (theElement.readOnly)
    	theElement.setAttribute("readonly", "readonly");	
    
    theElement.setAttribute("styledAs", StylerBase.ElementTypeTextArea);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processHyperlinkElement = function(wnd, theElement, options)
{
    // Return if already styled and ignore anchors that don't have a styler attribute of 'hyperlink'
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeHyperlink || theElement.getAttribute("styler") != "hyperlink")
    {
        return;
    }
    
    // Return if already styled as a tab
    if (theElement.parentNode && theElement.parentNode.nodeName.toLowerCase() == "li" && theElement.parentNode.parentNode
    && theElement.parentNode.parentNode.nodeName.toLowerCase() == "ul" && theElement.parentNode.parentNode.className.toString().indexOf("inforTabset") >= 0)
    {
    	return;
    } 	

    if (!wnd)
    {
        wnd = window;
    }

    theElement.className = "inforHyperlink";
    theElement.setAttribute("styledAs", StylerBase.ElementTypeHyperlink);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processInputElement = function(wnd, theElement, options)
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
                    this.processSelectElement(wnd, theElement, options);
                    break;

                case "calendar":
                    this.processCalendarElement(wnd, theElement, options);
                    break;

                case "search":
                	this.processSearchElement(wnd, theElement, options);
                    break;

                default:
                    this.processInputTextElement(wnd, theElement, options);
                    break;
            }
            break;

        case "radio":
            this.processInputRadioElement(wnd, theElement, options);
            break;

        case "checkbox":
            this.processInputCheckboxElement(wnd, theElement, options);
            break;

        case "password":
            this.processInputTextElement(wnd, theElement, options);
            break;

        default:
            theElement.setAttribute("styledAs", StylerBase.ElementTypeInputUnknown);
            if (this.moreInfo)
            {
                alert("STYLER attribute on INPUT tag with unsupported type of: " + typeAttribute);
                debugger;
            }
            break;
    }
};

//-----------------------------------------------------------------------------
StylerBase.selectControlOnLoad = function(wnd, theElement)
{
    if (!wnd)
    {
        wnd = window;
    }
    
	if (!theElement)
	{	
		return;
	}
	
    wnd.$(function ()
    {
    	wnd.$(theElement, wnd.document).removeClass("inforBusyIndicator small");
    });
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processSelectElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }
    
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeInputSelect)
    {
	    wnd.$(function ()
	    {  
	    	if (theElement.disabled)
	    		wnd.$(theElement, wnd.document).disable().validationMessage("remove");
	    	else if (theElement.readOnly)
	    		wnd.$(theElement, wnd.document).readOnly().validationMessage("remove");
	    	else
	    		wnd.$(theElement, wnd.document).enable().validationMessage("remove");
	    });	
        return;
    }    
    
    var isRequired = this.isElementRequired(wnd, theElement);
    if (isRequired)
    	theElement.className = "inforLookupField required";
    else
    	theElement.className = "inforLookupField";
    
    if (theElement.disabled)	
    	theElement.setAttribute("disabled", "disabled");
    if (theElement.readOnly)
    	theElement.setAttribute("readonly", "readonly");    
    
    wnd.$(function ()
    {  
    	//initialize the control options - the source function is called when clicked
 		var lookupFld = wnd.$(theElement, wnd.document).inforLookupField({
 			gridOptions: {}, 	//set the grid options (columns and settings). dataset will be empty.
 			returnField: theElement.getAttribute("name"),
 			height: 400,
 			width: 400,
 			editable: true,
 			typeAheadSearch: false,
 			source: function (request, response) {
 				StylerBase.selectControlOnClick(theElement, wnd);
 				//setTimeout(function() { response(null); }, 10000);
 				return;
 			}
 		});
 		if (isRequired)
 			lookupFld.required();
    });
    
    if (this.moreInfo)
    {
        this.elementWarnings(wnd, oldChild);
    }
    theElement.setAttribute("styledAs", StylerBase.ElementTypeInputSelect);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processCalendarElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }
    
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeInputCalendar)
    {
	    wnd.$(function ()
	    {  
	    	if (theElement.disabled)
	    		wnd.$(theElement, wnd.document).disable().validationMessage("remove");
	    	else if (theElement.readOnly)
	    		wnd.$(theElement, wnd.document).readOnly().validationMessage("remove");
	    	else
	    		wnd.$(theElement, wnd.document).enable().validationMessage("remove");
	    });	
        return;
    }
    
    var isRequired = this.isElementRequired(wnd, theElement);
    if (isRequired)
    	theElement.className = "inforDateField required";
    else
    	theElement.className = "inforDateField";
    
    if (theElement.disabled)	
    	theElement.setAttribute("disabled", "disabled");
    if (theElement.readOnly)
    	theElement.setAttribute("readonly", "readonly");    
    
    theElement.style.width = "90px";
    //set date control options
    var isRTL = (this.getTextDir() == "rtl");
    var dtFmt = this.getDateFormat() || StylerBase.DEFAULT_DATE_FORMAT;
    var dtSep = this.getDateSep() || StylerBase.DEFAULT_DATE_SEP;
    var dtFormat = "MM" + dtSep + "dd" + dtSep + "yyyy";
	
	switch (dtFmt)
	{
		case "MMDDYY":
		case "MMDDYYYY":
			dtFormat = "MM" + dtSep + "dd" + dtSep + "yyyy";
			break;
		case "DDMMYY":
		case "DDMMYYYY":
			dtFormat = "dd" + dtSep + "MM" + dtSep + "yyyy";
			break;
		case "YYMMDD":
		case "YYYYMMDD":
			dtFormat = "yyyy" + dtSep + "MM" + dtSep + "dd";				
			break;
		default: 
			dtFormat = "MM" + dtSep + "dd" + dtSep + "yyyy";
			break;
	}
	
	//make sure the Globalize calendar is set for Hijri
	if (this.getCalendarType() == StylerBase.CALENDAR_TYPE_HIJRI)
	{	
		if (this.getTextDir() != "rtl")
			wnd.Globalize.culture("ar-SA").isRTL = false;		
		wnd.Globalize.culture("ar-SA");
		wnd.Globalize.culture().calendar = wnd.Globalize.culture().calendars.standard;	
	}	
	//translate non-Hijri calendar labels
	else if (this.getLanguage())
	{
		wnd.Globalize.culture().isRTL = isRTL;
		this.translateCulture(wnd, this.getTranslationFunc(), wnd.Globalize.culture());
	}	
    
	options = options || {};
	
	var opts = {
    		validateInput: false,
    		isRTL: isRTL,
    		dateFormat: dtFormat
	};
	
    var o = wnd.$.extend({}, opts, options); //extend the options if any provided
	
    wnd.$(function ()
    {		
    	var dateFld = wnd.$(theElement, wnd.document).inforDateField(o);
    	if (isRequired)
    		dateFld.required();
   	});
    	
    if (this.moreInfo)
    {
        this.elementWarnings(wnd, oldChild);
    }
    theElement.setAttribute("styledAs", StylerBase.ElementTypeInputCalendar);    
};

//-----------------------------------------------------------------------------
StylerBase.prototype.translateCulture = function(wnd, func, culture)
{
	if (!wnd)
	{
		wnd = window;
	}
	
	if (!func || func("Ok") == "" || func("Ok") == null)
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
			names: [ func("Sunday"), func("Monday"), func("Tuesday"), func("Wednesday"), func("Thursday"), func("Friday"), func("Saturday") ],
			// abbreviated day names
			namesAbbr: [ func("Sun"), func("Mon"), func("Tue"), func("Wed"), func("Thu"), func("Fri"), func("Sat") ],
			// shortest day names
			namesShort: [ func("Su"), func("Mo"), func("Tu"), func("We"), func("Th"), func("Fr"), func("Sa") ]
		};
		cal.months = 
		{
			// full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
			names: [ func("January"), func("February"), func("March"), func("April"), func("May"), func("June"), func("July"), func("August"), func("September"), func("October"), func("November"), func("December"), "" ],
			// abbreviated month names
			namesAbbr: [ func("Jan"), func("Feb"), func("Mar"), func("Apr"), func("May"), func("Jun"), func("Jul"), func("Aug"), func("Sep"), func("Oct"), func("Nov"), func("Dec"), "" ]
		};
		culture.messages["Cancel"] = func("Cancel");
		culture.messages["Next"] = func("Next");
		culture.messages["Ok"] = func("OK");
		culture.messages["Previous"] = func("Previous");
		culture.messages["Today"] = func("Today");
		culture.messages["Yes"] = func("Yes");
		culture.messages["No"] = func("No");
		culture.messages["Close"] = func("Close");
		culture.messages["SelectDate"] = func("SelectDate");
	}
	
	// custom messages needed for dialog buttons
	culture.messages["Stop"] = func("Stop");
	culture.messages["Continue"] = func("Continue");
	culture.messages["Dialog"] = func("Dialog");	
	culture.isTranslated = true;
};

//-----------------------------------------------------------------------------
StylerBase.searchControlOnLoad = function(wnd, theElement)
{
	StylerBase.selectControlOnLoad(wnd, theElement);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processSearchElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }	
	
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeInputSearch)
    {
	    wnd.$(function ()
	    {  
	    	if (theElement.disabled)
	    		wnd.$(theElement, wnd.document).disable().validationMessage("remove");
	    	else if (theElement.readOnly)
	    		wnd.$(theElement, wnd.document).readOnly().validationMessage("remove");
	    	else
	    		wnd.$(theElement, wnd.document).enable().validationMessage("remove");
	    });	
        return;
    }
    
    var isRequired = this.isElementRequired(wnd, theElement);
    if (isRequired)
    	theElement.className = "inforSearchField required";
    else
    	theElement.className = "inforSearchField";
    
    if (theElement.disabled)	
    	theElement.setAttribute("disabled", "disabled");
    if (theElement.readOnly)
    	theElement.setAttribute("readonly", "readonly");
    
    wnd.$(function ()
    {  
    	//initialize the control options - the source function is called when clicked
    	// setting the 'placeholder' attribute on your html element will override the default JQuery placeholder.
 		var searchFld = wnd.$(theElement, wnd.document).inforSearchField({
			cancel: null,	//fires when cancel is clicked.
 			click: function (request, response) {
 				StylerBase.searchControlOnClick(wnd, theElement);
 				//setTimeout(function() { response(null); }, 10000);
 				return;
 			}
 		});
 		if (isRequired)
 			searchFld.required();
    });
    
    if (this.moreInfo)
    {
        this.elementWarnings(wnd, oldChild);
    }
    theElement.setAttribute("styledAs", StylerBase.ElementTypeInputSearch);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.isElementRequired = function(wnd, theElement)
{
	var isRequired = false;
	var elmRef = wnd.$(theElement, wnd.document);
	//var styledIcons1 = elmRef.siblings("span.inforRequiredIndicator");
	var styledIcons = elmRef.siblings("span[styledAs='"+StylerBase.ElementTypeAsterisk+"']");
	var unstyledIcons = elmRef.siblings("span[styler='asterisk']");
	if (styledIcons.length > 0 || unstyledIcons.length > 0)
	{
		isRequired = true;
		styledIcons.attr("class","inforHiddenCustom");
		unstyledIcons.attr("class","inforHiddenCustom");
		unstyledIcons.attr("styledAs",StylerBase.ElementTypeAsterisk);
		unstyledIcons.removeAttr("styler");
	}
	return isRequired;
}

//-----------------------------------------------------------------------------
StylerBase.prototype.processInputTextElement = function(wnd, theElement, options)
{	
    var elementClass = theElement.className;	
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeComboBox
    || elementClass && (elementClass.indexOf("inforDropDownList") >= 0 || elementClass.indexOf("inforLookupField") >= 0 || elementClass.indexOf("inforSearchField") >= 0))
    {	
    	return;
    }

    if (!wnd)
    {
        wnd = window;
    }    
    
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeInputText)
    {
	    wnd.$(function ()
	    {  
	    	if (theElement.disabled)
	    		wnd.$(theElement, wnd.document).disable().validationMessage("remove");
	    	else if (theElement.readOnly)
	    		wnd.$(theElement, wnd.document).readOnly().validationMessage("remove");
	    	else
	    		wnd.$(theElement, wnd.document).enable().validationMessage("remove");
	    });	
        return;
    }

    var isRequired = this.isElementRequired(wnd, theElement);
    if (isRequired)
    {	
    	theElement.className = "inforTextbox required";
    	wnd.$(theElement, wnd.document).required();
    }	
    else if (theElement.readOnly || theElement.disabled)
		theElement.className = "inforTextbox disabled";
    else
    	theElement.className = "inforTextbox";
    
    if (this.moreInfo)
    {
        this.elementWarnings(wnd, oldChild);
    }
    theElement.setAttribute("styledAs", StylerBase.ElementTypeInputText);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processInputRadioElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }

    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeInputRadio)
    {
	    wnd.$(function ()
	    {  
	    	if (theElement.disabled)
	    		wnd.$(theElement, wnd.document).disable();
	    	else if (theElement.readOnly)
	    		wnd.$(theElement, wnd.document).readOnly();
	    	else 
	    	{
	    		wnd.$(theElement, wnd.document).enable();
	    		wnd.$(theElement, wnd.document).setValue(theElement.checked);
	    	}
	    });	
        return;
    }    

    var isRequired = this.isElementRequired(wnd, theElement);
    if (isRequired)
    	theElement.className = "inforRadioButton required";
    else
    	theElement.className = "inforRadioButton";
    
    if (theElement.disabled)	
    	theElement.setAttribute("disabled", "disabled");
    if (theElement.readOnly)
    	theElement.setAttribute("readonly", "readonly");

    var nextElm = theElement.nextSibling;
    while (nextElm != null && nextElm.nodeType != 1)
    {
        nextElm = nextElm.nextSibling;
    }
    
    if (!nextElm)
    {
    	var labelElm = wnd.document.createElement("label");
    	labelElm.appendChild(wnd.document.createTextNode(""));
    	theElement.parentNode.appendChild(labelElm);
    }
    else if (nextElm.nodeType == 1)
    {
    	var labelTxt = (nextElm.innerText) ? nextElm.innerText : ((nextElm.textContent) ? nextElm.textContent : "");
    	var labelElm = wnd.document.createElement("label");
    	labelElm.appendChild(wnd.document.createTextNode(labelTxt));
    	nextElm.parentNode.replaceChild(labelElm, nextElm);    	
    }	
    
    wnd.$(function ()
    {
    	var radioFld = wnd.$(theElement, wnd.document).inforRadioButton();
    	if (isRequired)
    		radioFld.required();
    });
    
    theElement.setAttribute("styledAs", StylerBase.ElementTypeInputRadio);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processInputCheckboxElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }
    
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeInputCheckbox)
    {
	    wnd.$(function ()
	    {  
	    	if (theElement.disabled)
	    		wnd.$(theElement, wnd.document).disable();
	    	else if (theElement.readOnly)
	    		wnd.$(theElement, wnd.document).readOnly();
	    	else 
	    	{
	    		wnd.$(theElement, wnd.document).enable();
	    		wnd.$(theElement, wnd.document).setValue(theElement.checked);
	    	}
	    });	
        return;
    }    
    
    var isRequired = this.isElementRequired(wnd, theElement);
    if (isRequired)
    	theElement.className = "inforCheckbox required";
    else
    	theElement.className = "inforCheckbox";
    
    if (theElement.disabled)	
    	theElement.setAttribute("disabled", "disabled");
    if (theElement.readOnly)
    	theElement.setAttribute("readonly", "readonly");
    
    wnd.$(function ()
    {
    	var checkboxFld = wnd.$(theElement, wnd.document).inforCheckbox();
    	if (isRequired)
    		checkboxFld.required();
    });
    
    theElement.setAttribute("styledAs", StylerBase.ElementTypeInputCheckbox);
};
    
//-----------------------------------------------------------------------------
StylerBase.prototype.processButtonElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }

    // ignore button elements that do not have the styler attribute value of 'pushbutton'
    // or have been styled as another control
    var stylerAttribute = theElement.getAttribute("styler");
    var elementType = theElement.getAttribute("styledAs");
    var elementClass = theElement.className;
    if (stylerAttribute != "pushbutton" || (elementType != null && elementType != StylerBase.ElementTypeButton)
    || (elementClass && elementClass.indexOf("infor") >= 0))
    {
        return;
    }

	theElement.className = "inforFormButton";
	theElement.onmouseover = "";    
	theElement.onmouseout = "";    
    
    if (this.moreInfo) 
    {
        this.elementWarnings(wnd, theElement);
    }
    theElement.setAttribute("styledAs", StylerBase.ElementTypeButton);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processDivElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }

    var stylerAttribute = theElement.getAttribute("styler");

    switch (stylerAttribute)
    {
        case "groupbox":
            this.processGroupBoxElement(wnd, theElement, options);
            break;

        case "tabcontrol":
            this.processTabControlElement(wnd, theElement, options);
            break;

        case "header":
            this.processHeaderElement(wnd, theElement, options);
            break;

        case "groupline":
            this.processGroupLineElement(wnd, theElement, options);
            break;

        case "expander":
            this.processExpanderElement(wnd, theElement, options);
            break;

        case "appNav":
            this.processApplicationNav(wnd, theElement, options);
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
StylerBase.prototype.createGroupBoxElement = function(wnd, label, options)
{
    if (!wnd)
    {
        wnd = window;
    }   
    
    options = options || {};
    
    var fieldSetDiv = wnd.document.createElement("fieldset");
    fieldSetDiv.className = "inforFieldSet";
    
    var legendElm = wnd.document.createElement("legend");
    var labelSpan = wnd.document.createElement("span");
    labelSpan.className = "inforFieldSetLabel";
    if (label && typeof(label) == "string" && label.match(/\S/))
    	labelSpan.innerHTML = String(label);
    else
    	labelSpan.appendChild(wnd.document.createTextNode("\u00a0"));
    legendElm.appendChild(labelSpan);
    
    var contentDiv = wnd.document.createElement("div");
    contentDiv.className = "content";    
    
    var expandBtn = null;
    if (options.collapsible)
    {
    	expandBtn = wnd.document.createElement("button");
    	expandBtn.className = "inforExpandButton";
    	if (options.initialState)
    	{	
    		expandBtn.className += " " + options.initialState;
    		if (options.initialState == "closed")
    			contentDiv.style.display = "none";
    	}	
    	else
    		expandBtn.className += " open";
    	expandBtn.setAttribute("type", "button");
    	expandBtn.setAttribute("role", "button");
    }	

    fieldSetDiv.appendChild(legendElm);
    if (expandBtn)
    	fieldSetDiv.appendChild(expandBtn);
	fieldSetDiv.appendChild(contentDiv);
    return fieldSetDiv;
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processGroupBoxElement = function(wnd, theElement, options)
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
    
    options = options || {};
    
    var opts = {
    	collapsible: false,
    	divider: false,
    	initialState: 'open'
    };    
    
    var o = wnd.$.extend({}, opts, options); //extend the options if any provided
    
	var fieldSetDiv = this.createGroupBoxElement(wnd, null, options);
	var oldChild = theElement.parentNode.replaceChild(fieldSetDiv, theElement);
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
StylerBase.prototype.processTabControlElement = function(wnd, theElement, options)
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
    
    wnd.$(function ()
    {
        wnd.$(tabControlDiv, wnd.document).inforTabset({editable:false,
        	closable: false,
        	rename: null,
        	close: null,
        	fillToBottom: false
        }).bind("tabsselect", function(e, ui) {
        	wnd = wnd || window;
        	var tab = ui.tab.parentNode;
    	    if (tab && tab.nodeName.toLowerCase() == "li")
    	    	StylerBase.fireActiveTabEvents(tab, wnd);    	
        });
    });    
    
    if (this.moreInfo)
    {
        this.elementWarnings(wnd, theElement);
    }
    tabControlDiv.setAttribute("styledAs", StylerBase.ElementTypeDivTabControl);
    tabControlDiv.setAttribute("styler", "tabcontrol");
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processHeaderElement = function(wnd, theElement, options)
{
	//ignore - not part of UI specs
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processGroupLineElement = function(wnd, theElement, options)
{
	//ignore - not part of UI specs
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processExpanderElement = function(wnd, theElement, options)
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

    //TODO: add HTML5 logic here
    
    if (this.moreInfo)
    {
        this.elementWarnings(wnd, theElement);
    }
    theElement.setAttribute("styledAs", StylerBase.ElementTypeDivExpander);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processSpanElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }

    var stylerAttribute = theElement.getAttribute("styler");

    switch (stylerAttribute)
    {
        case "asterisk":
            this.processAsteriskElement(wnd, theElement, options);
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
StylerBase.prototype.processAsteriskElement = function(wnd, theElement, options)
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
	//label for screen readers
    theElement.setAttribute("title", "Required");
	theElement.setAttribute("aria-label", "Required");
    
    theElement.setAttribute("styledAs", StylerBase.ElementTypeAsterisk);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.processComboBoxElement = function(wnd, theElement, options)
{
    if (!wnd)
    {
        wnd = window;
    }	
	
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeComboBox)
    {
	    wnd.$(function ()
	    {  
	    	if (theElement.disabled)
	    		wnd.$(theElement, wnd.document).disable().validationMessage("remove");
	    	else if (theElement.readOnly)
	    		wnd.$(theElement, wnd.document).readOnly().validationMessage("remove");
	    	else 
	    	{
	    		wnd.$(theElement, wnd.document).enable().validationMessage("remove");
	    		var selIndex = theElement.selectedIndex;
	    		// if there is a selected item in the original select element, select it in the infor dropdown	    		
	    		if (selIndex >= 0)
	    		{
	    			var selValue = theElement.options[selIndex].value;
	    			// set the value in the infor dropdown textbox
	    			wnd.$(theElement, wnd.document).setValue(theElement.options[selIndex].text);
	    			// set the value in the original select - setValue() does not update the selectedIndex property
	    			wnd.$(theElement, wnd.document).val(selValue);
	    		}	
	    	}
	    });	
        return;
    }

    var isRequired = this.isElementRequired(wnd, theElement);
    if (isRequired)
    	theElement.className = "inforDropDownList required";
    else
    	theElement.className = "inforDropDownList";
    
    wnd.$(function ()
    {		
    	var dropDownFld = wnd.$(theElement, wnd.document).inforDropDownList({displayCodeOnly: false, editable:false, autoFocus: false, selectFirst: true});    	
    	if (theElement.onclick)
    	{
    		var button = dropDownFld.next().find(".inforDropDownListButton").click(function(e) {
    			wnd.$(theElement, wnd.document).trigger("click");    			
    		});
    	}
    	if (isRequired)
    		dropDownFld.required();      	
    	// temporary code to properly set the aria-required attribute and label; expectation is that calling dropDownFld.required() should do all this
    	// use this code only if control doesn't work properly
		var inputElm = dropDownFld.next().find("input");    	
    	if (isRequired)
    	{
    		dropDownFld.required();
    		if (inputElm.length > 0)
    			inputElm.attr('aria-required', 'true');
    	}
    	if (inputElm.length > 0)
		{	
    		var labelElm = wnd.$("label[for='"+dropDownFld.attr('id')+"']", wnd.document);
    		if (labelElm.length > 0)
    			labelElm.attr('for', inputElm.attr('id'));
    		if (dropDownFld.attr('aria-label'))
    			inputElm.attr('aria-label',dropDownFld.attr('aria-label'));
    		if (dropDownFld.attr('aria-labelledby'))
    			inputElm.attr('aria-labelledby',dropDownFld.attr('aria-labelledby'));
    		if (dropDownFld.attr('aria-describedby'))
    			inputElm.attr('aria-describedby',dropDownFld.attr('aria-describedby'));    			    			
		}
    });
    
    if (this.moreInfo)
    {
        this.elementWarnings(wnd, theElement);
    }
    theElement.setAttribute("styledAs", StylerBase.ElementTypeComboBox);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.setGroupBoxElementLabel = function(groupBox, label)
{
    if (!groupBox || groupBox.childNodes.length == 0 || !label)
    {
        return;
    }
    
    var legendElms = groupBox.getElementsByTagName("legend");
    if (legendElms)
    {
    	var legendElm = legendElms[0];
	    var len = legendElm.childNodes.length;
		for (var i=0; i<len; i++)
		{
			var cNode = legendElm.childNodes[i];
			var cClass = cNode.className;
			if (cNode.nodeName.toLowerCase() == "span" && cClass && cClass.toString().indexOf("inforFieldSetLabel") >= 0)
			{
				cNode.innerHTML = label;
				break;
			}	
		}
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
        if (uls[i].className && uls[i].className.indexOf("inforTabset") >= 0)
        {
            ul = uls[i];
        }
        i++;
    }

    if (ul == null)
    {
        if (this.moreInfo)
        {
            alert("Error adding tab element to tab control " + tabControl.getAttribute("id") + " with inforTabset");
            debugger;
        }
        return ul;
    }
    
    var lis = ul.getElementsByTagName("li");
    var tabLi = this.createTabControlListElement(wnd);
    tabLi.setAttribute("tabNbr", String(lis.length));
    //tabs do not always display without forcing them to initially display horizontally inline
    tabLi.style.display = "inline-block";
    
    var tabLink = wnd.document.createElement("a");
    tabLink.setAttribute("href", "#" + tabId);
    tabLink.appendChild(wnd.document.createTextNode(tabText));
    tabLi.appendChild(tabLink);
    ul.appendChild(tabLi);

    if (tabContent)
    {
        tabContent.setAttribute("id", tabId);
        tabContent.className = "";
        tabContent.removeAttribute("style");
        ul.parentNode.appendChild(tabContent);
    }

    return tabLi;
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
	
	StylerBase.ContextMenuActions = [];
	
	var modWrapper = wnd.document.createElement("div");
	modWrapper.className = "inforApplicationPadding";
	modWrapper.setAttribute("id", "inforModuleWrapper");
	modWrapper.setAttribute("role", "banner");
	modWrapper.setAttribute("aria-labelledby", "inforPageTitleText");
	
	var modContainer = wnd.document.createElement("div");
    modContainer.className = "inforModuleContainer";
    modContainer.setAttribute("id", "inforModuleContainer");

	var modHeader = wnd.document.createElement("div");
	modHeader.className = "inforModuleHeader";   
    
	var modHeaderLeft = wnd.document.createElement("div");
	modHeaderLeft.className = "inforModuleHeaderLeft";
	modHeaderLeft.setAttribute("id", "inforModuleHeaderLeft");
	modHeaderLeft.setAttribute("role", "heading");
	modHeaderLeft.setAttribute("aria-level", "1");    

	var modHeaderRight = wnd.document.createElement("div");
	modHeaderRight.className = "inforModuleHeaderRight";
	modHeaderRight.setAttribute("id", "inforModuleHeaderRight");

    var pageTitle = wnd.document.createElement("span");
    pageTitle.className = "inforPageTitleText";
    pageTitle.setAttribute("id", "inforPageTitleText");
    if (title) {
    	title = title + " ";
    	pageTitle.appendChild(wnd.document.createTextNode(title));
    }

    var recordId = wnd.document.createElement("span");
    recordId.className = "inforModuleRecordIdText";
    recordId.setAttribute("id", "inforModuleRecordIdText"); 
    if (recId)
    	pageTitle.appendChild(wnd.document.createTextNode(recId));
    
    modHeaderLeft.appendChild(pageTitle);
    modHeaderLeft.appendChild(recordId);    
    
    modHeader.appendChild(modHeaderLeft);
    modHeader.appendChild(modHeaderRight);
    
    modContainer.appendChild(modHeader);
    modWrapper.appendChild(modContainer);

	if (wnd.document.body.childNodes.length > 0)        
    	wnd.document.body.insertBefore(modWrapper, wnd.document.body.childNodes[0]); 
	else
		wnd.document.body.appendChild(modWrapper);
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
	
	icon = icon || StylerBase.TITLE_BAR_DROPDOWN_ICON;
	toolTipText = toolTipText || "Menu";
	this.addTitleBarIcon(wnd, icon, menuClickFunc, toolTipText);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.createTitleBarMenuDropDown = function(wnd, icon)
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
	var menuId = "dropDownMenuOptions";
	var menuBtnId = "menuButton";
    switch (icon)
    {
    	case StylerBase.TITLE_BAR_HELP_ICON: 
        case StylerBase.TITLE_BAR_DROPDOWN_ICON:
        	menuId = "dropDownMenuOptions";
        	menuBtnId = "menuButton";
        	break;            
        case StylerBase.TITLE_BAR_SETTINGS_ICON:
        	menuId = "settingsMenuOptions";
        	menuBtnId = "settingsButton";
            break;
        default:
            break;
    }
	var menuList;
	
	if (wnd.document.getElementById(menuId))
	{
		menuList = wnd.document.getElementById(menuId);
	}
	else
	{		
		var menuList = wnd.document.createElement("ul");
		menuList.setAttribute("id", menuId);
		menuList.className = "inforContextMenu";
		var modWrapper = wnd.document.getElementById("inforModuleWrapper");
		modWrapper.appendChild(menuList);       		
	}
		
    wnd.$(function ()
    {     		
    	var menuCallback = function(action, el, pos)
    	{
    		var actionFunc = StylerBase.ContextMenuActions[icon+"|"+action];
    		if (actionFunc)
    			actionFunc.apply(this, new Array());
    	};
    	wnd.$("#"+menuBtnId, wnd.document).inforContextMenu({
    		menu: menuId,
    		invokeMethod: 'click',
    		positionBelowElement: true,
    		offsetLeft: -4,
    		offsetTop: 2
    	}, menuCallback);
    });	
	
	return menuList;	
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
	var newIcon = icon;

    switch (icon)
    {
    	case StylerBase.TITLE_BAR_HELP_ICON: 
        case StylerBase.TITLE_BAR_DROPDOWN_ICON:
        	newIcon = StylerBase.TITLE_BAR_DROPDOWN_ICON;     
        	break;
        default: break;
    }	

	var modHeaderRight = wnd.document.getElementById("inforModuleHeaderRight");
	var btns = modHeaderRight.getElementsByTagName("button");
	var btn = null;
	var menuExists = false;
	for (var i=0; i<btns.length; i++)
	{
		var btnType = btns[i].getAttribute("styler_type");
		if (btnType == icon || btnType == newIcon)
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
	for (var i=0; i<len; i++)
	{
		var li = menuItems[i];
		var a = li.childNodes[0];
		if (a.getAttribute("href") == ("#"+itemDesc))
		{
			itemExists = true;
			break;
		}
	}	
	
	if (!itemExists)
	{
		var mItem = wnd.document.createElement("li");        
		var a = wnd.document.createElement("a");
		a.setAttribute("href", "#"+itemDesc);
        a.appendChild(wnd.document.createTextNode(String(itemDesc)));
        mItem.appendChild(a);
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
    
    //TODO: add HTML5 logic here
    return false;
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
    btn.setAttribute("styler_type", icon);
    btn.setAttribute("type", "button");
	var newIcon = icon;

    switch (icon)
    {
    	case StylerBase.TITLE_BAR_HELP_ICON: 
        case StylerBase.TITLE_BAR_DROPDOWN_ICON:
        	newIcon = StylerBase.TITLE_BAR_DROPDOWN_ICON;
            btn.className = "inforModuleDropDownButton";
            btn.setAttribute("id", "menuButton");
            btn.setAttribute("title", toolTipText || "Menu");
            btn.setAttribute("order", "0");
            btn.setAttribute("styler_type", newIcon);      
        	break;            
        case StylerBase.TITLE_BAR_SETTINGS_ICON:
            btn.className = "inforModuleSettingsButton";
            btn.setAttribute("id", "settingsButton");
            btn.setAttribute("title", toolTipText || "Settings");
            btn.setAttribute("order", "2");
            break;
		// style logout button the same as close for now
        case StylerBase.TITLE_BAR_LOGOFF_ICON:
        case StylerBase.TITLE_BAR_CLOSE_ICON:
        	var toolText = (icon == StylerBase.TITLE_BAR_CLOSE_ICON) ? "Close" : "Logout";       
            newIcon = StylerBase.TITLE_BAR_CLOSE_ICON;
            btn.className = "inforModuleCloseButton";
            btn.setAttribute("id", "closeButton");
            btn.setAttribute("title", toolTipText || toolText);
            btn.setAttribute("order", "3");
            btn.setAttribute("styler_type", newIcon);
            btn.onclick = iconClickFunc;
            break;
        default:
            return;
    }

	var modHeaderRight = wnd.document.getElementById("inforModuleHeaderRight");
	var btns = modHeaderRight.getElementsByTagName("button");
	var btnExists = false;
	var nextBtn = null;
	var btnOrder = Number(btn.getAttribute("order"));

	for (var i=0; i<btns.length; i++)
	{
		var btnType = btns[i].getAttribute("styler_type"); 
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
		//label for screen readers
		btn.setAttribute("aria-label", btn.getAttribute("title")); 		
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
		var btnType = btns[i].getAttribute("styler_type"); 
		if ((btnType == icon) || (icon == StylerBase.TITLE_BAR_HELP_ICON && btnType == StylerBase.TITLE_BAR_DROPDOWN_ICON))
		{
			btns[i].parentNode.removeChild(btns[i]);
			if (icon == StylerBase.TITLE_BAR_DROPDOWN_ICON || icon == StylerBase.TITLE_BAR_HELP_ICON)
			{	
				StylerBase.DropDownMenu = null;
				var menuList = wnd.document.getElementById("dropDownMenuOptions");
				var menuItems = menuList.getElementsByTagName("li");
				for (var j=menuItems.length-1; j>=0; j--)
				{
					var a = (menuItems[j].childNodes.length > 0) ? menuItems[j].childNodes[0] : null;
					if (a)
						StylerBase.ContextMenuActions[icon+"|"+a.href.substring(1)] = function(){};
					menuItems[j].parentNode.removeChild(menuItems[j]);	
				}	
			}	
			else if (icon == StylerBase.TITLE_BAR_SETTINGS_ICON)
				StylerBase.SettingsMenu = null;
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
    
    var titleTxt = "";
	nameSpan.className = "inforDataGridColumnNameSorted";
	if (sortDirection == "ascending")
	{
		anchorSpan.className = "inforSortIndicatorAsc";
		titleTxt = "Ascending Sort Icon";
	}
	else
	{
		anchorSpan.className = "inforSortIndicatorDesc";
		titleTxt = "Descending Sort Icon";
	}			    
	
	//label for screen readers
	anchorSpan.setAttribute("title", titleTxt);
	anchorSpan.setAttribute("aria-label", titleTxt);		

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
				var titleTxt = "";
				nSpan.className = "inforDataGridColumnNameSorted";
				if (sAttr.toLowerCase() == "ascending")
				{
					aSpan.className = "inforSortIndicatorDesc";
					titleTxt = "Descending Sort Icon";
					nSpan.setAttribute("styler_sort", "descending");
				}
				else
				{
					aSpan.className = "inforSortIndicatorAsc";
					titleTxt = "Ascending Sort Icon";
					nSpan.setAttribute("styler_sort", "ascending");
				}
				//label for screen readers
				aSpan.setAttribute("title", titleTxt);
				aSpan.setAttribute("aria-label", titleTxt);				
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
StylerBase.prototype.processApplicationNav = function(wnd, theElement, options)
{
    if (!wnd) 
    {
        wnd = window;
    }
    
    if (theElement.getAttribute("styledAs") == StylerBase.ElementTypeInputSelect) 
    {
        return;
    }

    theElement.className = "inforApplicationNav";
	
    wnd.$(function ()
    {  
	   	//initialize the control options - the source function is called when clicked
		wnd.$(theElement, wnd.document).inforApplicationNav({
			//sortable: true,
			//source: function (request, response) {
			//	StylerBase.selectControlOnClick(theElement, wnd);
			//	return;
		});
    });
	
    theElement.setAttribute("styledAs", StylerBase.ElementTypeAppNav);
};

//-----------------------------------------------------------------------------
StylerBase.prototype.init508 = function(wnd, skipLinkText, skipToID)
{
    if (!wnd)
    {
        wnd = window;
    }

    //skip link
    skipLinkText = skipLinkText || "Skip to Content";
    skipToID = skipToID || "content";
	var skipDiv = wnd.document.createElement("div");
	var skipLink = wnd.document.createElement("a");
	skipDiv.setAttribute("id","skiplink");
	skipDiv.style.width = "0px";
	skipDiv.style.height = "0px";
	skipLink.className = "inforOffScreen";
	skipLink.setAttribute("styler", "none");
	skipLink.setAttribute("styledAs", StylerBase.ElementTypeHidden);
	skipLink.appendChild(wnd.document.createTextNode(skipLinkText));
	skipLink.setAttribute("href", "#"+skipToID);
	skipDiv.appendChild(skipLink);
	if (wnd.document.body.childNodes.length > 0)        
    	wnd.document.body.insertBefore(skipDiv, wnd.document.body.childNodes[0]); 
	else
		wnd.document.body.appendChild(skipDiv);
	
	//div for ARIA messages
	if (!wnd.document.getElementById("scr-errors"))
	{	
		var errDiv = wnd.document.createElement("div");
		errDiv.className = "inforScreenReaderText";
		errDiv.setAttribute("id", "scr-errors");
		errDiv.setAttribute("role", "alert");
		var msgSpan = wnd.document.createElement("span");
		msgSpan.setAttribute("id", "message");
		errDiv.appendChild(msgSpan);
		wnd.document.body.appendChild(errDiv);
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
	//ignore - not part of UI specs
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addCommandBarButton = function(wnd, icon, iconClickFunc,text,code)
{
	//ignore - not part of UI specs
};

//-----------------------------------------------------------------------------
StylerBase.prototype.addCommandBarLeftButton = function(wnd, icon, iconClickFunc,text)
{
	//ignore - not part of UI specs
};
//-----------------------------------------------------------------------------
StylerBase.prototype.setCommandBarMessage = function(wnd,id,msg, code)
{
	//ignore - not part of UI specs
};

//-----------------------------------------------------------------------------
StylerBase.prototype.setCommandBarData = function(wnd,id,text)
{
	//ignore - not part of UI specs
};