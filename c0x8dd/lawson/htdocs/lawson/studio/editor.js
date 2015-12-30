/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/editor.js,v 1.10.2.1.4.2.22.2 2012/08/08 12:48:51 jomeli Exp $NoKeywords: $ */
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

function Editor()
{
	this.mode = null;
	this.id = null;
	this.cwDoc = null;
	this.editable = null;
	this.readyState = "initialized";				// [ initialized | completed ]
	this.command = null;							// current Command object
	this.currentCanvas = null;
	this.canvasElements = new parent.LawCollection();		// collection of canvas elements; parents to widgets
}

//-----------------------------------------------------------------------------
Editor.prototype.initialize = function(mode, cwDoc, bEditable)
{
	if (typeof(bEditable) != "boolean")
		bEditable = true;
	if (arguments.length < 2) return;

	try {
		this.mode = mode.toLowerCase();
		this.cwDoc = cwDoc;
		this.editable = bEditable;

		var obj = this.cwDoc.getElementsByTagName("body")[0];
		obj.id = "editorBody";

		this.canvasElements.add(obj.id, obj);  				// default canvas
		this.currentCanvas = obj;

		if (this.editable)
		{
			obj.contentEditable = true;
			this.setDefaultState();
		}

		this.setBodyEvents(obj);
		this.readyState = "complete";
	} catch (e) { }
}

//-----------------------------------------------------------------------------
Editor.prototype.setDefaultState = function()
{
	try {
		this.execCommand("AbsolutePosition", false, true);	// set positioning to absolute
		this.execCommand("LiveResize", false, true);		// update element continuously
		this.execCommand("MultipleSelection", false, true);	// allow multiple selection
		this.execCommand("2D-Position", false, true);		// allow absolutely positioned elements 
															//		to be moved by dragging
	} catch (e) { }
}

//-----------------------------------------------------------------------------
Editor.prototype.setStyleSheet = function(href)
{
	try {
		this.cwDoc.createStyleSheet(href);
	} catch (e) { }
}

//-----------------------------------------------------------------------------
Editor.prototype.execCommand = function(cmd, ui, value)
{
	// allows direct calls to msHTML
	if (this.cwDoc.queryCommandEnabled(cmd) && this.cwDoc.queryCommandSupported(cmd))
		return this.cwDoc.execCommand(cmd, ui, value);
	else
		return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.registerCanvas = function()
{
	//	empty function for compatability
	return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.unregisterCanvas = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.setCanvasHtml = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.getElementCanvas = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.ready = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.getGridHeight = function()
{
	//	empty function for compatability
	return 0;
}

//-----------------------------------------------------------------------------
Editor.prototype.getGridWidth = function()
{
	//	empty function for compatability
	return 0;
}

//-----------------------------------------------------------------------------
Editor.prototype.getGridSpace = function()
{
	//	empty function for compatability
	return 0;
}

//-----------------------------------------------------------------------------
Editor.prototype.setGrid = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.setActive = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.setBodyEvents = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.addElement = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.insertElement = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.redrawElement = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.updateElement = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.updateMetrics = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.update = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.deleteElement = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.reset = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.doMetrics = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.sendMetrics = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.formatMetrics = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.setZindex = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.snapToGrid = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.calcSnap = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.getGridSpacing = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.calculateGrid = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.addMetricAttributes = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.removeMetricAttributes = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.moveElements = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.moveElement = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.alignElement = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.spaceElement = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.constrainSize = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.setSize = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.getSizeRule = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.getBooleanRule = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.checkSelectedRule = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.calc = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.doMove = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.moveIn = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.moveOut = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.doPaste = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.doUpdate = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.doDelete = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.doUndelete = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.selectElement = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.change = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.changeBorder = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.doBorders = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.isCanvas = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.getCommandHistoryKey = function()
{
	//	empty function for compatability
	return null;
}

//-----------------------------------------------------------------------------
Editor.prototype.interceptEvents = function()
{
	//	empty function for compatability
	return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.contextMenu = function()
{
	//	empty function for compatability
	return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.controlSelect = function()
{
	//	empty function for compatability
	return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.moveStart = function()
{
	//	empty function for compatability
	return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.moveEnd = function()
{
	//	empty function for compatability
	return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.resizeStart = function()
{
	//	empty function for compatability
	return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.resizeEnd = function()
{
	//	empty function for compatability
	return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.keyUp = function()
{
	//	empty function for compatability
	return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.keyDown = function()
{
	//	empty function for compatability
	return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.click = function()
{
	//	empty function for compatability
	return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.cut = function()
{
	//	empty function for compatability
	return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.copy = function()
{
	//	empty function for compatability
	return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.paste = function()
{
	//	empty function for compatability
	return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.mouseOver = function()
{
	//	empty function for compatability
	return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.mouseOut = function()
{
	//	empty function for compatability
	return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.mouseUp = function()
{
	//	empty function for compatability
	return false;
}

//-----------------------------------------------------------------------------
Editor.prototype.beforeEditFocus = function()
{
	//	empty function for compatability
	return false;
}


//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
WYSIWYG.prototype = new Editor();
WYSIWYG.prototype.constructor = WYSIWYG;
WYSIWYG.superclass = Editor.prototype;

//-----------------------------------------------------------------------------

function WYSIWYG()
{
	WYSIWYG.superclass.initialize.call(this);

	// internal properties
	this.isCtrlKeyDown = false;
	this.isMultiEvent = false;								// for events getting called on multiple select

	this.isMoving = false;
	this.hasMoved = false;

	this.gridHeight = 1;									// default settings for grid
	this.gridWidth = 1;
	this.gridSpacing = 0;

	this.isCanvasSelected = false;							// used in conjunction with isCtrlKeyDown

	this.mouseOverElement = null;
	this.selectedIndex = 0;
	this.selectedElements = new parent.LawCollection();		// collection of elements; key is element id
	this.pastedElements = new parent.LawCollection();		// collection of element ids; key is element id
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.registerCanvas = function(id)
{
	var elem = this.cwDoc.getElementById(id);
	if (elem)
	{
		if (this.editable)
			elem.contentEditable = true;
		this.canvasElements.add(id, elem);
		this.currentCanvas = elem;
		this.canvasElements.remove("editorBody");				// remove default if method is used
	}
	return (elem) ? true : false;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.unregisterCanvas = function(id)
{
	if (this.currentCanvas.id == id)
		this.currentCanvas = null;
	return this.canvasElements.remove(id);
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.setCanvas = function(id)
{
	var elem = this.canvasElements.item(id);
	if (elem)
		this.currentCanvas = elem;
	return (elem) ? true : false;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.setCanvasHtml = function(html, id)
{
	if (this.isCanvas(id))
	{
		var elem = this.cwDoc.getElementById(id);
		elem.innerHTML = html;
	}
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.getElementCanvas = function(elem)
{
	var tempElem = elem;

	while (!this.canvasElements.item(tempElem.id))
	{
		if (tempElem.parentElement == null)
			break;

		tempElem = tempElem.parentElement;
	}
	return tempElem;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.ready = function()
{
	this.reset();
	designStudio.activeDesigner.activeDocument.selectControlInstance(this.currentCanvas.id, null);
	designStudio.activeDesigner.activeDocument.cancelMultipleSelection();
	this.pastedElements.removeAll();
	this.isCtrlKeyDown = false;
	this.isMultiEvent = false;
	this.isMoving = false;
	this.hasMoved = false;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.getGridHeight = function()
{
	return this.gridHeight;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.getGridWidth = function()
{
	return this.gridWidth;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.getGridSpace = function()
{
	return this.gridSpacing;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.setGrid = function(height, width, spacing)
{
	if (typeof(height) != "undefined" && height != null)
		this.gridHeight = parseInt(height);

	if (typeof(width) != "undefined" && width != null)
		this.gridWidth = parseInt(width);

	if (typeof(spacing) != "undefined" && spacing != null)
		this.gridSpacing = parseInt(spacing);

	for (var x=0; x<this.canvasElements.count; x++)
	{
		var ce = this.canvasElements.item(x);
		if (!this.getBooleanRule(ce, "isMoveable") && !this.getBooleanRule(ce, "isResizable"))
			continue;
		this.snapToGrid(ce, "resize");
	}
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.setActive = function(html)
{
	if (html != null)
		this.currentCanvas.innerHTML = html;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.setBodyEvents = function(obj)
{
	// Events being monitored from the editor
	obj.attachEvent("onclick", this.interceptEvents);
	obj.attachEvent("oncontrolselect", this.interceptEvents);
	obj.attachEvent("onkeydown",this.interceptEvents);
	obj.attachEvent("onkeyup",this.interceptEvents);
	obj.attachEvent("onmouseout",this.interceptEvents);
	obj.attachEvent("onmouseover",this.interceptEvents);
	obj.attachEvent("onmouseup",this.interceptEvents);
	obj.attachEvent("onmoveend", this.interceptEvents);
	obj.attachEvent("onmovestart", this.interceptEvents);
	obj.attachEvent("onresizeend",this.interceptEvents);
	obj.attachEvent("onresizestart",this.interceptEvents);

	// All other events that the designer may want to intercept
	obj.attachEvent("onabort",this.interceptEvents);
	obj.attachEvent("onactivate",this.interceptEvents);
	obj.attachEvent("onafterprint",this.interceptEvents);
	obj.attachEvent("onafterupdate",this.interceptEvents);
	obj.attachEvent("onbeforeactivate",this.interceptEvents);
	obj.attachEvent("onbeforecopy",this.interceptEvents);
	obj.attachEvent("onbeforecut",this.interceptEvents);
	obj.attachEvent("onbeforedeactivate",this.interceptEvents);
	obj.attachEvent("onbeforeeditfocus",this.interceptEvents);
	obj.attachEvent("onbeforepaste", this.interceptEvents);
	obj.attachEvent("onbeforeprint",this.interceptEvents);
	obj.attachEvent("onbeforeunload",this.interceptEvents);
	obj.attachEvent("onbeforeupdate",this.interceptEvents);
	obj.attachEvent("onblur",this.interceptEvents);
	obj.attachEvent("onbounce",this.interceptEvents);
	obj.attachEvent("oncellchange",this.interceptEvents);
	obj.attachEvent("onchange",this.interceptEvents);
	obj.attachEvent("oncontextmenu",this.interceptEvents);
	obj.attachEvent("oncopy",this.interceptEvents);
	obj.attachEvent("oncut",this.interceptEvents);
	obj.attachEvent("ondataavailable",this.interceptEvents);
	obj.attachEvent("ondatasetchanged",this.interceptEvents);
	obj.attachEvent("ondatasetcomplete",this.interceptEvents);
	obj.attachEvent("ondblclick",this.interceptEvents);
	obj.attachEvent("ondragend",this.interceptEvents);
	obj.attachEvent("ondragenter",this.interceptEvents);
	obj.attachEvent("ondragleave",this.interceptEvents);
	obj.attachEvent("ondragover",this.interceptEvents);
	obj.attachEvent("ondragstart",this.interceptEvents);
	obj.attachEvent("ondrop",this.interceptEvents);
	obj.attachEvent("onerror",this.interceptEvents);
	obj.attachEvent("onerrorupdate",this.interceptEvents);
	obj.attachEvent("onfilterchange",this.interceptEvents);
	obj.attachEvent("onfinish",this.interceptEvents);
	obj.attachEvent("onfocus",this.interceptEvents);
	obj.attachEvent("onfocusin",this.interceptEvents);
	obj.attachEvent("onfocusout",this.interceptEvents);
	obj.attachEvent("onhelp",this.interceptEvents);
	obj.attachEvent("onkeypress",this.interceptEvents);
	obj.attachEvent("onlayoutcomplete",this.interceptEvents);
	obj.attachEvent("onload",this.interceptEvents);
	obj.attachEvent("onlosecapture",this.interceptEvents);
	obj.attachEvent("onmousedown",this.interceptEvents);
	obj.attachEvent("onmouseenter",this.interceptEvents);
	obj.attachEvent("onmouseleave",this.interceptEvents);
	obj.attachEvent("onmousemove",this.interceptEvents);
	obj.attachEvent("onmousewheel",this.interceptEvents);
	obj.attachEvent("onmove",this.interceptEvents);
	obj.attachEvent("onpaste",this.interceptEvents);
	obj.attachEvent("onpropertychange",this.interceptEvents);
	obj.attachEvent("onreadystatechange",this.interceptEvents);
	obj.attachEvent("onreset",this.interceptEvents);
	obj.attachEvent("onresize",this.interceptEvents);
	obj.attachEvent("onrowenter",this.interceptEvents);
	obj.attachEvent("onrowexit",this.interceptEvents);
	obj.attachEvent("onrowsdelete",this.interceptEvents);
	obj.attachEvent("onrowsinserted",this.interceptEvents);
	obj.attachEvent("onscroll",this.interceptEvents);
	obj.attachEvent("onselect",this.interceptEvents);
	obj.attachEvent("onselectionchange",this.interceptEvents);
	obj.attachEvent("onselectstart",this.interceptEvents);
	obj.attachEvent("onstart",this.interceptEvents);
	obj.attachEvent("onstop",this.interceptEvents);
	obj.attachEvent("onsubmit",this.interceptEvents);
	obj.attachEvent("onunload",this.interceptEvents);
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.addElement = function(html, id, par, bSelect)
{
	if (typeof(bSelect) != "boolean")
		bSelect=true;

	if (typeof(par) == "undefined")
		par = this.currentCanvas;
	else
		par = this.cwDoc.getElementById(par);
	if (!par) return (null);

	var elem = this.insertElement(html, id, par, bSelect);
	if (!elem) return (null);

	this.calculateGrid(elem);
	//this.doMetrics(elem);

	this.command = new Command("add", this.id, this.selectedElements, true, this.mode, this.currentCanvas.id);
	designStudio.activeDesigner.activeDocument.commandHistory.add(this.command);

	return elem;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.insertElement = function(html, id, par, bSelect)
{
	if (typeof(bSelect) != "boolean")
		bSelect=true;

	par.insertAdjacentHTML("BeforeEnd", html);
	var elem = this.cwDoc.getElementById(id);
	elem.setAttribute("oZ", elem.style.zIndex);

	if (bSelect)
	{
		this.reset();				// initialize
		elem.fireEvent("oncontrolselect");
		elem.setActive();
	}
	return elem;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.redrawElement = function(html, id, bSelect)
{
	if (typeof(bSelect) != "boolean")
		bSelect=true;

	var elem = this.cwDoc.getElementById(id);
	var par = elem.parentElement;

	this.command = new Command("update", this.id, this.selectedElements, true, this.mode, this.currentCanvas.id);

	this.deleteElement(id);
	elem = this.insertElement(html, id, par, bSelect);
	this.calculateGrid(elem);

	this.command.update(elem);
	designStudio.activeDesigner.activeDocument.commandHistory.add(this.command);
	return elem;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.updateElement = function(dsMetrics, id)
{
	// Called only by activeDesigner.activeDocument
	this.updateMetrics(dsMetrics, id);
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.updateMetrics = function(dsMetrics, id)
{
	// Called by updateElement() and update()
	var elem = this.cwDoc.getElementById(id);
	if (elem)
	{
		var len = (dsMetrics) ? dsMetrics.length : 0;
		for (var i=0; i<len; i++)
		{
			var name = dsMetrics.children(i).name;
			var value = dsMetrics.children(i).value;

			switch(name.toLowerCase())
			{
				case "left":
				case "col":
					if (this.getBooleanRule(elem, "isMoveable"))
						elem.style.pixelLeft = value * this.gridWidth;
					break;

				case "top":
				case "row":
					if (this.getBooleanRule(elem, "isMoveable"))
						elem.style.pixelTop = value * this.gridHeight;
					break;

				case "height":
					if (this.getBooleanRule(elem, "isResizable"))
					{
						var diff = (this.isCanvas(elem) && this.getBooleanRule(elem, "isGrid")) ? 0 : 0;
						var newValue = this.getBooleanRule(elem, "isGrid")
							? ((value * this.gridHeight) - this.getGridSpacing(elem)) + diff
							: value + diff;
						elem.style.pixelHeight = newValue;
					}
					break;

				case "width":
				case "sz":
					if (this.getBooleanRule(elem, "isResizable"))
					{
						var diff = (this.isCanvas(elem) && this.getBooleanRule(elem, "isGrid")) ? 0 : 0;
						var newValue = this.getBooleanRule(elem, "isGrid")
							? (value * this.gridWidth) + diff
							: value + diff;
						elem.style.pixelWidth = newValue;
					}
					break;

				case "zindex":
					elem.style.zIndex = value;
					elem.setAttribute("oZ", value);
					break;

				case "name":
					elem.id = value;
					break;

				case "text":
					elem.innerText = value;
					break;

				default:
					elem.setAttribute(name, value);
					break;
			}
		}
	}
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.update = function(html, metrics, id)
{
	// Called internally only for undo / redo
	var elem = this.cwDoc.getElementById(id);
	if (elem)
	{
		var par = elem.parentElement;
		this.deleteElement(id);
		elem = this.insertElement(html, id, par);
	}
//	this.updateMetrics(metrics, id);
	designStudio.activeDesigner.workSpace.views.item(designStudio.activeDesigner.workSpace.view).bUpdatedProperty = true;
	designStudio.activeDesigner.activeDocument.updateProperties(metrics, id);
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.deleteElement = function(id)
{
	var elem = this.cwDoc.getElementById(id);
	if (elem)
		elem.removeNode(true);
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.reset = function()
{
	this.setZindex(false);
	this.doBorders(true);
	this.selectedElements.removeAll();
	this.selectedIndex = 0;
	this.mouseOverElement = null;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.doMetrics = function(elemIn)
{
	if (typeof(elemIn) == "undefined")
	{
		for (var x=0; x<this.selectedElements.count; x++)
		{
			var elem = this.selectedElements.item(x);
			this.sendMetrics(elem);
		}
	}
	else
		this.sendMetrics(elemIn);
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.sendMetrics = function(elem)
{
	var dsMetrics = this.formatMetrics(elem);
	designStudio.activeDesigner.workSpace.views.item(designStudio.activeDesigner.workSpace.view).bUpdatedProperty = true;
	designStudio.activeDesigner.activeDocument.updateProperties(dsMetrics, elem.id);
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.formatMetrics = function(elem)
{
	var dsMetrics = new DataStorage();
	var bIsMoveable = this.getBooleanRule(elem,"isMoveable")
	dsMetrics.add("top", bIsMoveable ? (parseInt(elem.style.pixelTop) / this.gridHeight) : elem.style.pixelTop);
	dsMetrics.add("row", bIsMoveable ? (parseInt(elem.style.pixelTop) / this.gridHeight) : elem.style.pixelTop);
	dsMetrics.add("left", bIsMoveable ? (parseInt(elem.style.pixelLeft) / this.gridWidth) : elem.style.pixelLeft);
	dsMetrics.add("col", bIsMoveable ? (parseInt(elem.style.pixelLeft) / this.gridWidth) : elem.style.pixelLeft);

	var bIsGrid = this.getBooleanRule(elem,"isGrid")
	dsMetrics.add("height", bIsGrid ? ((parseInt(elem.style.pixelHeight) + this.getGridSpacing(elem)) / this.gridHeight) : elem.style.pixelHeight);
	dsMetrics.add("width", bIsGrid ? (parseInt(elem.style.pixelWidth) / this.gridWidth) : elem.style.pixelWidth);
	dsMetrics.add("sz", bIsGrid ? (parseInt(elem.style.pixelWidth) / this.gridWidth) : elem.style.pixelWidth);

	dsMetrics.add("zindex", elem.getAttribute("oZ"));
	dsMetrics.add("text", elem.innerText);
	dsMetrics.add("name", elem.id);
	return (dsMetrics);
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.setZindex = function(val)
{
	for (var x=0; x<this.selectedElements.count; x++)
	{
		var elem = this.selectedElements.item(x);
		if (!this.isCanvas(elem))
			elem.style.zIndex = ((val == false) ? elem.getAttribute("oZ") : val);
	}
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.snapToGrid = function(elem, type)
{
	if (this.getBooleanRule(elem, "isMoveable"))
	{
		elem.style.pixelTop = this.calcSnap(elem.style.pixelTop, this.gridHeight);
		elem.style.pixelLeft = this.calcSnap(elem.style.pixelLeft, this.gridWidth);
	}
	if (type == "resize" && this.getBooleanRule(elem, "isGrid"))
	{
		elem.style.pixelHeight = this.calcSnap(elem.style.pixelHeight, this.gridHeight) - this.getGridSpacing(elem);
		elem.style.pixelWidth = this.calcSnap(elem.style.pixelWidth, this.gridWidth);
	}
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.calcSnap = function(amt, grid)
{
	var mod = (amt % grid);

	// not at a grid boundary
	if (mod != 0)
	{
		// did not go beyond halfway point
		if (mod < grid/2)
			return amt - mod;
		else
			return amt + (grid - mod);
	}
	else
		return amt;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.getGridSpacing = function(elem)
{
	return (this.isCanvas(elem)) ? 0 : this.gridSpacing;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.calculateGrid = function(elem)
{
	if (this.getBooleanRule(elem, "isMoveable"))
	{
		if (elem.style.top.indexOf("%") == -1)
			elem.style.pixelTop = elem.style.pixelTop * this.gridHeight;

		if (elem.style.left.indexOf("%") == -1)
			elem.style.pixelLeft = elem.style.pixelLeft * this.gridWidth;
	}
	if (this.getBooleanRule(elem, "isGrid"))
	{
		if (elem.style.height.indexOf("%") == -1)
			elem.style.pixelHeight = (elem.style.pixelHeight * this.gridHeight) - this.getGridSpacing(elem);

		if (elem.style.width.indexOf("%") == -1)
			elem.style.pixelWidth = elem.style.pixelWidth * this.gridWidth;
	}
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.addMetricAttributes = function(elem)
{
	elem.setAttribute("oT", elem.style.pixelTop);
	elem.setAttribute("oL", elem.style.pixelLeft);
	elem.setAttribute("oH", elem.style.pixelHeight);
	elem.setAttribute("oW", elem.style.pixelWidth);
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.removeMetricAttributes = function(elem)
{
	elem.removeAttribute("oT", 0);
	elem.removeAttribute("oL", 0);
	elem.removeAttribute("oH", 0);
	elem.removeAttribute("oW", 0);
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.moveElements = function(elements, direction, type)
{
	this.command = new Command("moveover", this.id, elements, true, this.mode, this.currentCanvas.id);
	var start = 0;
	var limit = elements.count;
	var diff = null;

	if (type == "align")
		limit = elements.count - 1;
	else if (type == "space")
	{
		start = 2;
		var firstElem = elements.item(0);
		var secElem = elements.item(1);

		if (direction == keys.RIGHT_ARROW)
			diff = secElem.style.pixelLeft - (firstElem.style.pixelLeft + firstElem.style.pixelWidth);
		else
			diff = secElem.style.pixelTop - (firstElem.style.pixelTop + firstElem.style.pixelHeight);
	}

	for (var x=start; x<limit; x++)
	{
		var elem = elements.item(x);

		switch (type)
		{
			case "move":
				this.moveElement(elem, direction);
				break;

			case "align":
				this.alignElement(elem, direction, elements.item(elements.count-1));
				break;

			case "space":
				var prevElem = elements.item(x-1);
				this.spaceElement(elem, direction, prevElem, diff);
				break;
		}
	}

	if (this.command.stateInfo.count > 0)
		designStudio.activeDesigner.activeDocument.commandHistory.add(this.command);
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.moveElement = function(elem, direction)
{
	if (this.getBooleanRule(elem, "isMoveable"))
	{
		switch (direction)
		{
			case keys.UP_ARROW:
				elem.style.pixelTop = this.calcSnap(elem.style.pixelTop-this.gridHeight, this.gridHeight);
				break;

			case keys.DOWN_ARROW:
				elem.style.pixelTop = this.calcSnap(elem.style.pixelTop+this.gridHeight, this.gridHeight);
				break;

			case keys.LEFT_ARROW:
				elem.style.pixelLeft = this.calcSnap(elem.style.pixelLeft-this.gridWidth, this.gridWidth);
				break;

			case keys.RIGHT_ARROW:
				elem.style.pixelLeft = this.calcSnap(elem.style.pixelLeft+this.gridWidth, this.gridWidth);
				break;
		}
	}
	this.doMetrics(elem);
	this.command.update(elem);
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.alignElement = function(elem, direction, matchElem)
{
	if (this.getBooleanRule(elem, "isMoveable"))
	{
		switch (direction)
		{
			case keys.UP_ARROW:
				elem.style.pixelTop = matchElem.style.pixelTop;
				break;

			case keys.DOWN_ARROW:
				elem.style.pixelTop = (matchElem.style.pixelTop + matchElem.style.pixelHeight) - elem.style.pixelHeight;
				break;

			case keys.LEFT_ARROW:
				elem.style.pixelLeft = matchElem.style.pixelLeft;
				break;

			case keys.RIGHT_ARROW:
				elem.style.pixelLeft = (matchElem.style.pixelLeft + matchElem.style.pixelWidth) - elem.style.pixelWidth;
				break;
		}
	}
	this.doMetrics(elem);
	this.command.update(elem);
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.spaceElement = function(elem, direction, prevElem, diff)
{
	if (this.getBooleanRule(elem, "isMoveable"))
	{
		if (direction == keys.RIGHT_ARROW)
			elem.style.pixelLeft = (prevElem.style.pixelLeft + prevElem.style.pixelWidth) + diff;
		else
			elem.style.pixelTop = (prevElem.style.pixelTop + prevElem.style.pixelHeight) + diff;
	}
	this.doMetrics(elem);
	this.command.update(elem);
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.constrainSize = function(elem)
{
	if ( !this.getBooleanRule(elem,"isGrid") )
		return;

	var spacing = this.getGridSpacing(elem);
	var minHeight = this.getSizeRule(elem,"minHeight") ?
		((this.getSizeRule(elem,"minHeight") * this.gridHeight) - spacing) :
		elem.style.pixelHeight;
	var maxHeight = this.getSizeRule(elem,"maxHeight") ?
		((this.getSizeRule(elem,"maxHeight") * this.gridHeight) - spacing) :
		elem.style.pixelHeight;
	var minWidth = this.getSizeRule(elem,"minWidth") ?
		(this.getSizeRule(elem,"minWidth") * this.gridWidth) :
		elem.style.pixelWidth;
	var maxWidth = this.getSizeRule(elem,"maxWidth") ?
		(this.getSizeRule(elem,"maxWidth") * this.gridWidth) :
		elem.style.pixelWidth;

	elem.style.pixelHeight = (this.setSize(elem.style.pixelHeight, minHeight, maxHeight) - spacing);
	elem.style.pixelWidth = this.setSize(elem.style.pixelWidth, minWidth, maxWidth);
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.setSize = function(current, min, max)
{
	if (current > max)
		current = max;
	else if (current < min)
		current = min;
	return current;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.getSizeRule = function(elem, rule)
{
	if (elem.getAttribute(rule))
		return (parseInt(elem.getAttribute(rule)));

	var rules = designStudio.activeDesigner.activeDocument.getControlRules(elem.id);
	if (rules && (rules.count > 0))
	{
		if (rules.item(rule))
			return (parseInt(rules.item(rule).value));
	}
	return null;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.getBooleanRule = function(elem, rule)
{
	var val = true;							// assume true if not found
	if (elem.getAttribute(rule))
	{
		var value = elem.getAttribute(rule);
		return (value == "false" || value == "0") ? false : true;
	}
	var rules = designStudio.activeDesigner.activeDocument.getControlRules(elem.id);
	if (rules && (rules.count > 0))
	{
		if (rules.item(rule))
			val = (rules.item(rule).value == "false" || rules.item(rule).value == "0") ? false : true;
	}
	return val;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.checkSelectedRule = function(rule)
{
	var val = true;							// assume true if not found

	for (var x=0; x<this.selectedElements.count; x++)
	{
		var se = this.selectedElements.item(x);
		val = this.getBooleanRule(se, rule);
		if (!val)
			break;
	}
	return val;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.calc = function(elem, pos)
{
	var amt = 0;

	if (pos == "top")
		amt = elem.style.pixelTop;
	else
		amt = elem.style.pixelLeft;

	var tempElem = elem;
	while (tempElem.parentElement)
	{
		if (tempElem.id == this.currentCanvas.id)
			break;

		tempElem = tempElem.parentElement;

		if (tempElem.id == this.currentCanvas.id)
			break;

		if (pos == "top")
			amt += tempElem.style.pixelTop + 1;
		else
			amt += tempElem.style.pixelLeft + 1;
	}
	return amt;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.doMove = function(elements, direction)
{
	for (var x=0; x<elements.count; x++)
	{
		var se = elements.item(x);
		var elem = designStudio.activeDesigner.workSpace.editor.cwDoc.getElementById(se.id);
		var oldPar = designStudio.activeDesigner.workSpace.editor.cwDoc.getElementById(se.oldParentId);
		var newPar = designStudio.activeDesigner.workSpace.editor.cwDoc.getElementById(se.newParentId);

		if (direction == "redo")
		{
			oldPar.removeChild(elem);
			newPar.appendChild(elem);
			this.update(se.newHTML, se.newMetrics, se.id);
		}
		else
		{
			newPar.removeChild(elem);
			oldPar.appendChild(elem);
			this.update(se.oldHTML, se.oldMetrics, se.id);
		}
	}
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.moveIn = function()
{
	// mouse is over a container element (canvas to container, container to container)
	this.command.changeType("movein");

	for (var x=0; x<this.selectedElements.count; x++)
	{
		var se = this.selectedElements.item(x);
		if (se.parentElement == null || se.parentElement.id != this.mouseOverElement.id)
		{
			// order of following statements should not be changed
			se.parentElement.removeChild(se);
			se.style.pixelTop = this.calc(se, "top") - this.calc(this.mouseOverElement, "top") - 1;
			se.style.pixelLeft = this.calc(se, "left") - this.calc(this.mouseOverElement, "left") - 1;
			this.snapToGrid(se, "move");
			this.mouseOverElement.appendChild(se);
			this.doMetrics(se);
			this.command.update(se);
		}
	}
//TODO: need index
//TODO: update() method is same as add() method; currently it adds to the stack when
//		it really needs to replace for that index
//	designStudio.activeDesigner.activeDocument.commandHistory.update(this.command, this.getCommandHistoryKey());
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.moveOut = function()
{
	// mouse is over the canvas (container to canvas)
	this.command.changeType("moveout");

	for (var x=0; x<this.selectedElements.count; x++)
	{
		var se = this.selectedElements.item(x);
		if (se.parentElement.id != this.currentCanvas.id && this.mouseOverElement != null)
		{
			// order of following statements should not be changed
			se.style.pixelTop = this.calc(se, "top");
			se.style.pixelLeft = this.calc(se, "left");
			this.snapToGrid(se, "move");
			se.parentElement.removeChild(se);
			this.mouseOverElement.appendChild(se);
			this.doMetrics(se);
			this.command.update(se);
		}
	}
//TODO: need index
//TODO: update() method is same as add() method; currently it adds to the stack when
//		it really needs to replace for that index
//	designStudio.activeDesigner.activeDocument.commandHistory.update(this.command, this.getCommandHistoryKey());
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.doPaste = function(elem)
{
	if (elem.hasChildNodes())
	{
		var len = (elem.childNodes) ? elem.childNodes.length : 0;
		for (var x=0; x<len; x++)
		{
			var el = elem.childNodes(x);
			designStudio.activeDesigner.activeDocument.copyControlInstance(el.id);
			this.doPaste(el);
		}
	}
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.doUpdate = function(elements, direction)
{
	for (var x=0; x<elements.count; x++)
	{
		var se = elements.item(x);
		var metrics = (direction == "redo") ? se.newMetrics : se.oldMetrics;
		var html = (direction == "redo") ? se.newHTML : se.oldHTML;
		this.update(html, metrics, se.id);
	}
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.doDelete = function(bIsCut, elements)
{
	if (typeof(bIsCut) == "undefined") bIsCut = false;
	if (typeof(elements) == "undefined") elements = this.selectedElements;

	// give designer chance to kill the delete
	var evtObj = designStudio.createEventObject(ON_BEFORE_DELETE_CONTROLS, null, null, elements);
	if (!designStudio.activeDesigner.eventHandler.processEvent(evtObj))
		return;

	if (bIsCut)
		this.pastedElements.removeAll(); 	// initialize

	var nodeColl = new parent.LawCollection();
	for (var x=0; x < elements.count; x++)
	{
		var se = elements.item(x);

		if (bIsCut)
			this.pastedElements.add(se.id, se);

		var node = designStudio.activeDesigner.activeDocument.deleteControlInstance(se.id);
		this.deleteElement(se.id);

		if (node)
			nodeColl.add(se.id,node);
	}

	nodeColl = (nodeColl && nodeColl.count ? nodeColl : null);
	var val = (bIsCut) ? "cut" : "delete";
	this.command = new Command(val, this.id, this.selectedElements, 
		true, this.mode, this.currentCanvas.id, nodeColl);
	designStudio.activeDesigner.activeDocument.commandHistory.add(this.command);

	this.selectedElements.removeAll();
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.doUndelete = function(elements)
{
	for (var x=0; x < elements.count; x++)
	{
		var se = elements.item(x);
		designStudio.activeDesigner.activeDocument.undeleteControlInstance(
			se.id,true,true,se.oldXML);
	}
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.selectElement = function(elem)
{
	var se = this.selectedElements.item(elem.id);
	var sel = false;

	// element not in collection; add it
	if (se == null || typeof(se) == "undefined")
	{
		// remove all elements if multiple select is not being used
		if (!this.isCtrlKeyDown)
		{
			this.setZindex(false);
			this.doBorders(true);
			this.selectedElements.removeAll();
		}

		this.selectedElements.add(elem.id, elem);
		this.changeBorder(elem, false);
		sel = true;
	}
	// element already in collection
	else
	{
		// remove element from collection if multiple select; a deselect
		if (this.isCtrlKeyDown)
		{
			if (!this.isCanvas(elem))
				elem.style.zIndex = elem.getAttribute("oZ");
			this.changeBorder(elem, true);
			this.selectedElements.remove(elem.id);
		}
		else
			sel = true;
	}

	// notify activeDocument of the element that was selected
	if (sel)
	{
		// notify activeDocument if multiple select is cancelled
		// need to perform cancelMultipleSelection before selectControlInstance
		if (this.selectedElements.count == 1)
			designStudio.activeDesigner.activeDocument.cancelMultipleSelection();

		// don't do selectControlInstance() if canvas; reset() should have already selected it
		if (!this.isCanvas(elem))
		{
			designStudio.activeDesigner.activeDocument.selectControlInstance(elem.id, this.currentCanvas.id);
			elem.style.zIndex = 999999;
		}
		else
			designStudio.activeDesigner.activeDocument.selectControlInstance(this.currentCanvas.id, null);
	}

	// notify activeDocument if multiple select has occurred
	// need to perform startMultipleSelection after selectControlInstance
	if (this.selectedElements.count > 1)
		designStudio.activeDesigner.activeDocument.startMultipleSelection(this.selectedElements);
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.changeBorder = function(elem, bOrig)
{
	if (!this.isCanvas(elem))
	{
		if (bOrig)
			elem.style.filter = "";
		else
			elem.style.filter = "progid:DXImageTransform.Microsoft.Glow(Color=cyan, Strength=1)";
	}
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.doBorders = function(bOrig)
{
	for (var x=0; x<this.selectedElements.count; x++)
	{
		var se = this.selectedElements.item(x);
		this.changeBorder(se, bOrig);
	}
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.isCanvas = function(elem)
{
	var id = elem;
	if (typeof(elem) == "object")
		id = elem.id;

	var se = this.canvasElements.item(id);
	if (se == null || typeof(se) == "undefined")
		return false
	else
		return true
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.getCommandHistoryKey = function()
{
	return designStudio.activeDesigner.activeDocument.commandHistory.key + designStudio.activeDesigner.activeDocument.commandHistory.index;
}


// Start of Editor events
//-----------------------------------------------------------------------------
WYSIWYG.prototype.interceptEvents = function(evt)
{
    evt = (evt ? evt : (window.event ? window.event : null));
    if (!evt) return;
	if (!designStudio.activeDesigner)return;
	if (designStudio.activeDesigner && designStudio.activeDesigner.readyState != "complete")return;

	var evtCaught = false;
	var elem = evt.srcElement;
	if (!elem) return;
	var eventObj = designStudio.createEventObject(evt.type, evt, null, elem.id);

	// check with caller before event takes place
	if (designStudio.activeDesigner.activeDocument
	&& designStudio.activeDesigner.activeDocument.readyState == "complete")
	{
		if (typeof(designStudio.activeDesigner.eventHandler.onBeforeEvent) == "function")
		{
			if (designStudio.activeDesigner.eventHandler.onBeforeEvent(eventObj))
			{
				setEventCancel(evt);
				return false;
			}
		}
	}

	// events monitored by the editor
	switch (evt.type)
	{
		case "beforeeditfocus":
			evtCaught = designStudio.activeDesigner.workSpace.editor.beforeEditFocus(evt, elem);
			break;

		case "click":
			evtCaught = designStudio.activeDesigner.workSpace.editor.click(evt, elem);
			break;

		case "contextmenu":
			evtCaught = designStudio.activeDesigner.workSpace.editor.contextMenu(evt, elem);
			break;

		case "controlselect":
			evtCaught = designStudio.activeDesigner.workSpace.editor.controlSelect(evt, elem);
			break;

		case "keydown":
			evtCaught = designStudio.activeDesigner.workSpace.editor.keyDown(evt, elem);
			break;

		case "keyup":
			evtCaught = designStudio.activeDesigner.workSpace.editor.keyUp(evt, elem);
			break;

		case "mouseout":
			if (typeof(designStudio.activeDesigner.workSpace.editor.mouseOut) == "function")
				evtCaught = designStudio.activeDesigner.workSpace.editor.mouseOut(evt, elem);
			else
				evtCaught = true;
			break;

		case "mouseover":
			evtCaught = designStudio.activeDesigner.workSpace.editor.mouseOver(evt, elem);
			break;

		case "mouseup":
			evtCaught = designStudio.activeDesigner.workSpace.editor.mouseUp(evt, elem);
			break;

		case "moveend":
			evtCaught = designStudio.activeDesigner.workSpace.editor.moveEnd(evt, elem);
			break;

		case "movestart":
			evtCaught = designStudio.activeDesigner.workSpace.editor.moveStart(evt, elem);
			break;

		case "resizeend":
			evtCaught = designStudio.activeDesigner.workSpace.editor.resizeEnd(evt, elem);
			break;

		case "resizestart":
			evtCaught = designStudio.activeDesigner.workSpace.editor.resizeStart(evt, elem);
			break;
	}

	if (evtCaught)
	{
		setEventCancel(evt);
		return false;
	}

	// check with caller after event takes place
	if (designStudio.activeDesigner.activeDocument
	&& designStudio.activeDesigner.activeDocument.readyState == "complete")
	{
		if (typeof(designStudio.activeDesigner.eventHandler.onAfterEvent) == "function")
		{
			if (designStudio.activeDesigner.eventHandler.onAfterEvent(eventObj))
			{
				setEventCancel(evt);
				return false;
			}
		}
	}
}

// Events the editor monitors
//-----------------------------------------------------------------------------
WYSIWYG.prototype.contextMenu = function(evt, elem)
{
	//Always cancel; if needed, editor needs to implement its own menu and commands
	setEventCancel(evt);
	return false;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.controlSelect = function(evt, elem)
{
	if (elem.getAttribute("selectElement"))
	{
		elem=this.cwDoc.getElementById(elem.getAttribute("selectElement"))
		if (!elem) return true;
		elem.fireEvent("oncontrolselect");
		return true;
	}

	// if element is not selectable, then cancel event
	if (!this.getBooleanRule(elem, "isSelectable"))
	{
		this.isCanvasSelected = false;
		this.reset();
		return true;
	}

	// element is not canvas
	if (!this.isCanvas(elem))
	{
		// find which canvas element is on
		var canvas = this.getElementCanvas(elem);

		// element not on current canvas, so reset canvas
		if (this.currentCanvas.id != canvas.id)
		{
			// cancel if multiple select is taking place
			if (this.isCtrlKeyDown)
			{
				this.isCanvasSelected = false;
				return true;
			}
			else
			{
				this.isCanvasSelected = false;
				this.currentCanvas = canvas;
				this.reset();
				this.selectElement(elem);
			}
		}
		// element is on current canvas
		else
		{
			// canvas element selected first, then multiple select on a control
			if (this.isCtrlKeyDown && this.isCanvasSelected)
				return true;
			else
			{
				this.isCanvasSelected = false;
				this.selectElement(elem);
			}
		}
	}
	// element is canvas
	else
	{
		// cancel if multiple select is taking place
		if (this.isCtrlKeyDown)
		{
			this.isCanvasSelected = false;
			return true;
		}
		// set current canvas
		else
		{
			this.isCanvasSelected = true;
			this.currentCanvas = elem;
			this.reset();
			this.selectElement(elem);
		}
	}
	return false;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.moveStart = function(evt, elem)
{
	// event occurs for each element selected
	// only want to do this once; sets up single command entry for history; needed for multi-select
	if (this.selectedElements.count > 0 && !this.isMultiEvent)
	{
		this.isMultiEvent = true;
		this.command = new Command("moveover", this.id, this.selectedElements, true, this.mode, this.currentCanvas.id);
	}

	if (!this.getBooleanRule(elem, "isMoveable"))
	{
		// removes single element from history
		this.command.removeState(elem);
		return true;
	}
	else
	{
		if (!this.isCanvas(elem))
			elem.style.zIndex = 999999;

		this.addMetricAttributes(elem);
		this.isMoving = true;
		this.hasMoved = false;
	}
	return false;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.moveEnd = function(evt, elem)
{
	// event occurs for each element selected
	this.isMultiEvent = false;
	this.isMoving = false;
	this.snapToGrid(elem, "move");
	this.command.update(elem);

	this.selectedIndex++;

	if (this.selectedIndex == this.selectedElements.count)
	{
		if (this.command.stateInfo.count > 0)
			designStudio.activeDesigner.activeDocument.commandHistory.add(this.command);
		this.selectedIndex = 0;
	}

	if (!this.isCanvas(elem))
		elem.style.zIndex = elem.getAttribute("oZ");

	this.doMetrics(elem);

	if (this.mouseOverElement != null)
	{
		var checkId = this.selectedElements.item(this.mouseOverElement.id);
		if (checkId == null || typeof(checkId) == "undefined")
			this.hasMoved = true;
	}
	return false;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.resizeStart = function(evt, elem)
{
	// event occurs for each element selected
	// if element is not a selected element, then cancel the event for that element
	var elemTest = this.selectedElements.item(elem.id);
	if (elemTest == null || typeof(elemTest) == "undefined")
		return true;

	// only want to do this once; sets up single command entry for history; needed for multi-select
	if (this.selectedElements.count > 0 && !this.isMultiEvent)
	{
		this.isMultiEvent = true;
		this.command = new Command("resize", this.id, this.selectedElements, true, this.mode, this.currentCanvas.id);
	}

	if (!this.getBooleanRule(elem, "isResizable"))
	{
		// removes single element from history
		this.command.removeState(elem);
		return true;
	}
	this.addMetricAttributes(elem);
	return false;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.resizeEnd = function(evt, elem)
{
	// event occurs for each element selected
	this.isMultiEvent = false;

	if (!this.getBooleanRule(elem, "isMoveable"))
	{
		// if resizable and not moveable, then only allow the right bottom to move
		elem.style.pixelTop = elem.getAttribute("oT");
		elem.style.pixelLeft = elem.getAttribute("oL");
	}

	this.constrainSize(elem);
	this.snapToGrid(elem, "resize");
	this.command.update(elem);

	this.selectedIndex++;

	if (this.selectedIndex == this.selectedElements.count)
	{
		if (this.command.stateInfo.count > 0)
			designStudio.activeDesigner.activeDocument.commandHistory.add(this.command);
		this.selectedIndex = 0;
	}
	this.doMetrics(elem);
	return false;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.keyUp = function(evt, elem)
{
	if (!evt.altKey && !evt.ctrlKey && !evt.shiftKey)
	{
		// Ctrl used
		if (evt.keyCode == keys.CONTROL)
			this.isCtrlKeyDown = false;
	}
	return false;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.keyDown = function(evt, elem)
{
	var evtCaught = false;

	if (studioHandleKey(evt))
	{
		setEventCancel(evt);
		this.isCtrlKeyDown = false;
		return false;
	}

	var keyVal = evt.keyCode;

	// Ctrl used
	if (keyVal == keys.CONTROL || keyVal == keys.SHIFT)
		this.isCtrlKeyDown = true;

	if (evt.altKey && !evt.ctrlKey && !evt.shiftKey)
	{
		// Alt used
		switch (keyVal)
		{
			case keys.LEFT_ARROW:
			case keys.RIGHT_ARROW:
				// don't do anything
				evtCaught = true;
				break;
		}

		if (this.selectedElements.count > 2)
		{
			switch (keyVal)
			{
				case keys.UP_ARROW:			// vertical spacing of elements
				case keys.RIGHT_ARROW:		// horizontal spacing of elements
					this.moveElements(this.selectedElements, keyVal, "space");
					evtCaught = true;
					break;
			}
		}
	}
	else if (!evt.altKey && evt.ctrlKey && !evt.shiftKey)
	{
       	switch(keyVal)
    	{
			case keys.DELETE:				// don't allow delete here
			case keys.KEYPAD_DELETE:
				evtCaught = true;
				break;

			case keys.CKEY:	// Copy
				this.copy();
				evtCaught = true;
				break;

			case keys.XKEY:	// Cut
				this.cut();
				evtCaught = true;
				break;

			case keys.VKEY:	// Paste
				this.paste();
				evtCaught = true;
				break;
		}

		if (this.selectedElements.count > 1)
		{
			switch (keyVal)
			{
				case keys.UP_ARROW:			// align elements to top border
				case keys.DOWN_ARROW:		// align elements to bottom border
				case keys.LEFT_ARROW:		// align elements to left border
				case keys.RIGHT_ARROW:		// align elements to right border
					this.moveElements(this.selectedElements, keyVal, "align");
					evtCaught = true;
					break;
			}
		}
	}
	else if (!evt.altKey && !evt.ctrlKey && !evt.shiftKey)
	{
		switch (keyVal)
		{
			case keys.DELETE:				// delete
			case keys.KEYPAD_DELETE:
				if (this.selectedElements.count > 0 && !this.isCanvas(this.selectedElements.item(0)))
					this.doDelete(false, this.selectedElements);
				evtCaught = true;
				break;

			case keys.UP_ARROW:				// move elements up
			case keys.DOWN_ARROW:			// move elements down
			case keys.LEFT_ARROW:			// move elements left
			case keys.RIGHT_ARROW:			// move elements right
				this.moveElements(this.selectedElements, keyVal, "move");
				evtCaught = true;
				break;
		}
	}
	else						// allow no keyboard input on the frame or in the objects
		evtCaught = true;

	return evtCaught;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.click = function(evt, elem)
{
	var checkId = this.selectedElements.item(elem.id);
	if (checkId)
		this.selectElement(elem);
	return false;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.cut = function()
{
	if (this.selectedElements.count > 0 && !this.isCanvas(this.selectedElements.item(0)))
		this.doDelete(true, this.selectedElements);
	return false;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.copy = function()
{
	if (this.selectedElements.count > 0 && !this.isCanvas(this.selectedElements.item(0)))
	{
		this.pastedElements.removeAll(); 	// initialize

		for (var x=0; x<this.selectedElements.count; x++)
		{
			var se = this.selectedElements.item(x);
			this.pastedElements.add(se.id, se);
		}
	}
	return false;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.paste = function()
{
	for (var x=0; x<this.pastedElements.count; x++)
	{
		var pe = this.pastedElements.item(x);
		var newInst = designStudio.activeDesigner.activeDocument.copyControlInstance(pe.id);
	}
	return false;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.mouseOver = function(evt, elem)
{
	if (elem.id != this.currentCanvas.id)
	{
		if (this.isMoving)
		{
			// a move in or a move out
			if (this.isCtrlKeyDown)
			{
				var checkId = this.selectedElements.item(elem.id);

				// over a target; move in
				if (checkId == null || typeof(checkId) == "undefined")
				{
					if (this.getBooleanRule(elem, "isParent"))
					{
						if (this.checkSelectedRule("isChild"))
						{
							var canvas = this.getElementCanvas(elem);
							if (this.currentCanvas.id == canvas.id)
								this.mouseOverElement = elem;
							else
								this.mouseOverElement = null;
						}
						else
							this.mouseOverElement = null;
					}
					else
						this.mouseOverElement = null;
				}
				// over the canvas; move out
				else
				{
					if (this.checkSelectedRule("isChild"))
					{
						var canvas = this.getElementCanvas(elem);
						if (this.currentCanvas.id == canvas.id)
							this.mouseOverElement = this.currentCanvas;
						else
							this.mouseOverElement = null;
					}
					else
						this.mouseOverElement = null;
				}
			}
			// a move over
			else
			{
				// notify designer there is no target
				this.mouseOverElement = null;
			}
		}
	}
	return false;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.mouseOut = function(evt, elem)
{
	return false;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.mouseUp = function(evt, elem)
{
	if (elem.id != this.currentCanvas.id)
	{
		if (!this.isCanvas(elem))
			this.setZindex(999999);

		if (this.hasMoved)
		{
			// mouse is over a container element (canvas to container, container to container)
			if (this.mouseOverElement != null && this.mouseOverElement.id != this.currentCanvas.id)
			{
				if (this.getBooleanRule(this.mouseOverElement, "isParent"));
				{
					for (var x=0; x<this.selectedElements.count; x++)
					{
						var se = this.selectedElements.item(x);
						if (this.getBooleanRule(se, "isChild"));
						{
							// notify designer that a moveIn can be accomplished
							this.moveIn();
						}
					}
				}
			}
			// mouse is over the canvas (container to canvas)
			else
			{
				// canvas will always be a container (isParent=true)
				for (var x=0; x<this.selectedElements.count; x++)
				{
					var se = this.selectedElements.item(x);
					if (this.getBooleanRule(se, "isChild"));
					{
						// notify designer that a moveOut can be accomplished
						this.moveOut();
					}
				}
			}
		}
		this.mouseOverElement = null;
		this.hasMoved = false;
	}
	return false;
}

//-----------------------------------------------------------------------------
WYSIWYG.prototype.beforeEditFocus = function(evt, elem)
{
	// Cancelling this event causes the focus hash bar to not display.
	return true;
}


//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
TEXT.prototype = new Editor();
TEXT.prototype.constructor = TEXT;
TEXT.superclass = Editor.prototype;

//-----------------------------------------------------------------------------

function TEXT()
{
	TEXT.superclass.initialize.call(this);
	this.textArea = null;
}

//-----------------------------------------------------------------------------
TEXT.prototype.registerTextArea = function(id)
{
	var elem = this.cwDoc.getElementById(id);
	if (elem)
		this.textArea = elem;

	return (elem) ? true : false;
}

//-----------------------------------------------------------------------------
TEXT.prototype.setReadOnly = function(bReadOnly)
{
	if (!this.textArea)
		return;

	if (typeof(bReadOnly) != "boolean")
			bReadOnly=true;
	this.textArea.readOnly = bReadOnly;
}
//-----------------------------------------------------------------------------
TEXT.prototype.isReadOnly = function()
{
	return this.textArea.readOnly ? true : false;
}

//-----------------------------------------------------------------------------
TEXT.prototype.setBodyEvents = function(obj)
{
	obj.attachEvent("onchange",this.interceptEvents);
	obj.attachEvent("onkeydown",this.interceptEvents);
	obj.attachEvent("onkeyup",this.interceptEvents);
	obj.attachEvent("onmouseup",this.interceptEvents);
	obj.attachEvent("onselect",this.interceptEvents);
}

//-----------------------------------------------------------------------------
TEXT.prototype.setActive = function()
{
	if (this.textArea)
	{
		this.textArea.attachEvent("oncontextmenu",this.interceptEvents);
		this.textArea.attachEvent("onchange",this.interceptEvents);
		this.textArea.attachEvent("onselect",this.interceptEvents);
	}
}

//-----------------------------------------------------------------------------
TEXT.prototype.interceptEvents = function(evt)
{
    evt = (evt ? evt : (window.event ? window.event : null));
    if (!evt) return;

	if (designStudio.activeDesigner && designStudio.activeDesigner.readyState != "complete")
		return;

	var evtCaught = false;
	var elem = evt.srcElement;
	if (!elem) return;
	var eventObj = designStudio.createEventObject(evt.type, evt, null, elem.id);

	// check with caller before event takes place
	if (designStudio.activeDesigner.activeDocument
	&& designStudio.activeDesigner.activeDocument.readyState == "complete")
	{
		if (typeof(designStudio.activeDesigner.eventHandler.onBeforeEvent) == "function")
		{
			if (designStudio.activeDesigner.eventHandler.onBeforeEvent(eventObj))
			{
				setEventCancel(evt);
				return false;
			}
		}
	}

	// events monitored by the editor
	switch (evt.type)
	{
		case "contextmenu":
			evtCaught = designStudio.activeDesigner.workSpace.editor.contextMenu(evt, elem);
			break;

		case "change":
			evtCaught = designStudio.activeDesigner.workSpace.editor.change(evt, elem);
			break;

		case "keydown":
			evtCaught = designStudio.activeDesigner.workSpace.editor.keyDown(evt, elem);
			break;

		case "keyup":
			evtCaught = designStudio.activeDesigner.workSpace.editor.keyUp(evt, elem);
			break;

		case "mouseup":
			evtCaught = designStudio.activeDesigner.workSpace.editor.mouseUp(evt, elem);
			break;

		case "select":
			evtCaught = designStudio.activeDesigner.workSpace.editor.select(evt, elem);
			break;
	}

	if (evtCaught)
	{
		setEventCancel(evt);
		return false;
	}

	// check with caller after event takes place
	if (designStudio.activeDesigner.activeDocument
	&& designStudio.activeDesigner.activeDocument.readyState == "complete")
	{
		if (typeof(designStudio.activeDesigner.eventHandler.onAfterEvent) == "function")
		{
			if (designStudio.activeDesigner.eventHandler.onAfterEvent(eventObj))
			{
				setEventCancel(evt);
				return false;
			}
		}
	}
}

//-----------------------------------------------------------------------------
TEXT.prototype.change = function(evt, elem)
{
	return false;
}

//-----------------------------------------------------------------------------
TEXT.prototype.contextMenu = function(evt, elem)
{
	// cancel the context menu
	return true;
}

//-----------------------------------------------------------------------------
TEXT.prototype.cut = function()
{
	var evtCaught = false;
	if (this.cwDoc.selection.type.toLowerCase() == "text")
	{
		// Get selection text
		var selRng = this.cwDoc.selection.createRange();
		window.clipboardData.clearData();
		window.clipboardData.setData("Text", selRng.text);
		selRng.text = "";
		selRng.select();
		evtCaught = true;
		
		// Check clipboard text
		var txt = window.clipboardData.getData("Text");
		if (typeof(txt)=="undefined")
		{
			window.status = designStudio.stringTable.getPhrase("ERR_CLIPBOARD");
			return false;
		}
	}
	return evtCaught;
}

//-----------------------------------------------------------------------------
TEXT.prototype.del = function()
{
	var selRng = null;
	var evtCaught = false;
	// Delete doesn't clear the clipboard
	// Delete the selection
	if (this.cwDoc.selection.type.toLowerCase() == "text")
	{
		var selRng = this.cwDoc.selection.createRange();
		if (selRng.text.length > 0)
		{
			selRng.text = "";
			selRng.select();
			evtCaught = true;
		}
	}
	// Forward delete
	else
	{
		var selRng = this.cwDoc.selection.createRange();
		selRng.expand("character");
		// Check to see if at end of range
		if (selRng.text.length == 0 && selRng.htmlText.length > 0)
			;
		// Process forward delete
		else
		{
			selRng.select();
			selRng.text = "";
			selRng.select();
			evtCaught = true;
		}
	}
	return evtCaught;
}

//-----------------------------------------------------------------------------
TEXT.prototype.copy = function()
{
	if (this.cwDoc.selection.type.toLowerCase() == "text")
	{
		// Get selection text
		var selRng = this.cwDoc.selection.createRange();
		window.clipboardData.clearData();
		window.clipboardData.setData("Text", selRng.text);
		selRng.select();

		// Check clipboard text
		var txt = window.clipboardData.getData("Text");
		if (typeof(txt)=="undefined")
		{
			window.status = designStudio.stringTable.getPhrase("ERR_CLIPBOARD");
			return false;
		}
	}
	return true;
}

//-----------------------------------------------------------------------------
TEXT.prototype.paste = function()
{
	if (window.clipboardData)
	{
		// Clipboard text
		var txt = window.clipboardData.getData("Text");
		if (typeof(txt)=="undefined")
		{
			window.status = designStudio.stringTable.getPhrase("ERR_CLIPBOARD");
			return false;
		}
		
		// Replacing a selection
		var selRng = this.cwDoc.selection.createRange();
		if (selRng.text.length > 0)
		{
			selRng.text = "";
		}
		
		// Pasting at cursor location
		var txtRng = this.textArea.createTextRange(); 
		txtRng.moveToPoint(selRng.boundingLeft, selRng.boundingTop + this.textArea.scrollTop);
		txtRng.text = txt;
	}
	return true;
}

//-----------------------------------------------------------------------------
TEXT.prototype.keyDown = function(evt, elem)
{
	var evtCaught = false;

	if (studioHandleKey(evt))
	{
		setEventCancel(evt);
		return false;
	}

	var key = evt.keyCode;
	if ((this.textArea) && evt.srcElement.id == this.textArea.id)
	{
		var selRng;
		var lineRng;
		var txtRng;
		var selRects;
		var selRect;
		var bFound;
		var rngText = "";
		var tab = String.fromCharCode(9);

	 	switch (key)
	 	{
			case keys.ESCAPE:
				// ignore
				evtCaught = true;
				break;

			case keys.LEFT_ARROW:
			case keys.RIGHT_ARROW:
				// don't allow browser navigation
				if (evt.altKey)
					evtCaught = true;
				break;

			case keys.TAB:
				// allow user to ctrl tab off the editor
				if (evt.ctrlKey) return;
				evtCaught = true;
				var textloc = this.cwDoc.selection.createRange();

				if (textloc.text == "")
				{
					if (!evt.shiftKey)
						textloc.text = tab;
					else
					{
						textloc.move("character",-1)
						textloc.expand("character")
						if (textloc.text == tab)
							textloc.collapse()
						else
							textloc.move("character")
						textloc.select()
					}
				}
				else if (evt.shiftKey)
				{
					var tempStr = textloc.text;
					tempStr = tempStr.replace(/\n\t/g, "\n");
					if (tempStr.substr(0,1) == "\t");
						tempStr = tempStr.substr(1);
					textloc.text = tempStr + "\n";
				}
				else
				{
					var tempStr = textloc.text;
					tempStr = tempStr.replace(/\n/g, "\n\t");
					textloc.text = "\t" + tempStr + "\n";
				}
				break;

	  		case keys.ENTER:
	  			txtRng = this.textArea.createTextRange();
	  			selRng = this.cwDoc.selection.createRange();
	  			lineRng = selRng.duplicate();
	  			lineRng.moveToPoint(txtRng.boundingLeft,selRng.boundingTop);

	  			while (lineRng.boundingLeft<selRng.boundingLeft)
	  			{
	  				lineRng.moveEnd("character");
	  				if(lineRng.text != tab)
	  					break;
	  				rngText += tab;
	  				lineRng.moveStart("character");
	  			}
	  			selRng.text = String.fromCharCode(13) + rngText;
	  			selRng.collapse(false);
	  			selRng.select();
	  			evtCaught = true;
	  			break;

			// Delete
			case keys.DELETE:
				evtCaught = this.del();
				break;

			// Cut
			case keys.XKEY:
				if (evt.ctrlKey)
					evtCaught = this.cut();
				break;

			// Copy
			case keys.CKEY:
				if (evt.ctrlKey)
					evtCaught = this.copy();
				break;

			// Paste
			case keys.VKEY:
				if (evt.ctrlKey)
					evtCaught = this.paste();
				break;

			case keys.INSERT:
					evtCaught = true;
				break;
		}
	}
	return evtCaught;
}

//-----------------------------------------------------------------------------
TEXT.prototype.keyUp = function(evt, elem)
{
	return false;
}

//-----------------------------------------------------------------------------
TEXT.prototype.mouseUp = function(evt, elem)
{
	return false;
}

//-----------------------------------------------------------------------------
TEXT.prototype.select = function(evt, elem)
{
	return false;
}

//-----------------------------------------------------------------------------
TEXT.prototype.getTextContent = function()
{
	return (this.textArea) ? this.textArea.value : "";
}

//-----------------------------------------------------------------------------
TEXT.prototype.setTextContent = function(val)
{
	if (this.textArea)
		this.textArea.value = val;
}

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
function Command(type, id, elements, isReversible, mode, canvasId, nodes)
{
	this.type = type;
	this.initiator = id;
	this.stateInfo = new LawCollection();
	this.isReversible = isReversible;
	this.mode = mode;
	this.canvas = canvasId;

	for (var x=0; x < elements.count; x++)
	{
		var state = new State();
		var node = (typeof(nodes) !== "undefined" && nodes!=null 
			? nodes.item(x) : null);
		state.add(elements.item(x),node);
		this.stateInfo.add(elements.item(x).id, state);
	}
}

//-----------------------------------------------------------------------------
Command.prototype.execute = function()
{
	// redo
	if (!this.isReversible)
		return;

	switch (this.type)
	{
	case "add":			// redo = undelete
		designStudio.activeDesigner.workSpace.editor.doUndelete(this.stateInfo);
		break;

	// falls through to break
	case "resize":
	case "moveover":
	case "update":
		designStudio.activeDesigner.workSpace.editor.doUpdate(this.stateInfo, "redo");
		break;

	case "cut":			// redo = delete
		designStudio.activeDesigner.workSpace.editor.doDelete(true, this.stateInfo);
		break;

	case "delete":		// redo = delete
		designStudio.activeDesigner.workSpace.editor.doDelete(false, this.stateInfo);
		break;

	case "movein":		// redo = movein
	case "moveout":		// redo = moveout
		designStudio.activeDesigner.workSpace.editor.doMove(this.stateInfo, "redo");
		break;
	}
}

//-----------------------------------------------------------------------------
Command.prototype.unExecute = function()
{
	// undo
	if (!this.isReversible)
		return;

	switch (this.type)
	{
	case "add":			// undo = delete
		designStudio.activeDesigner.workSpace.editor.doDelete(true, this.stateInfo);
		break;

	// falls through to break
	case "resize":
	case "moveover":
	case "update":
		designStudio.activeDesigner.workSpace.editor.doUpdate(this.stateInfo, "undo");
		break;

	// falls through to break
	case "cut":			// undo = undelete
	case "delete":		// undo = undelete
		designStudio.activeDesigner.workSpace.editor.doUndelete(this.stateInfo);
		break;

	case "movein":		// undo = moveout
	case "moveout":		// undo = movein
		designStudio.activeDesigner.workSpace.editor.doMove(this.stateInfo, "undo");
		break;
	}
}

//-----------------------------------------------------------------------------
Command.prototype.update = function(elem)
{
	var stateItm = this.stateInfo.item(elem.id);
	if (stateItm) stateItm.update(elem);
}

//-----------------------------------------------------------------------------
Command.prototype.removeState = function(elem)
{
	this.stateInfo.remove(elem.id);
}

//-----------------------------------------------------------------------------
Command.prototype.changeType = function(type)
{
	this.type = type;
}

//-----------------------------------------------------------------------------
function State()
{
	this.id = null;
	this.oldHTML = null;
	this.oldXML = null;
	this.newHTML = null;
	this.oldMetrics = null;
	this.newMetrics = null;
	this.oldParentId = null;
	this.newParentId = null;
}

//-----------------------------------------------------------------------------
State.prototype.add = function(elem,node)
{
	this.id = elem.id;
	this.oldHTML = elem.outerHTML;
	this.oldXML = (node ? node.xml : null);
	this.oldMetrics = designStudio.activeDesigner.workSpace.editor.formatMetrics(elem);

	if (elem.parentElement)
		this.oldParentId = elem.parentElement.id;
}

//-----------------------------------------------------------------------------
State.prototype.update = function(elem)
{
	this.newHTML = elem.outerHTML;
	this.newMetrics = designStudio.activeDesigner.workSpace.editor.formatMetrics(elem);
	if (elem.parentElement)
		this.newParentId = elem.parentElement.id;
	else
		this.newParentId = null;
}
