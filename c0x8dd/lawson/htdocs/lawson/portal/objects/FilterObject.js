/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/Attic/FilterObject.js,v 1.1.2.5.4.2.14.1.2.2 2012/08/08 12:37:30 jomeli Exp $ */
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

function filterObject(portalWnd)
{
	this.portalWnd=portalWnd;
	this.id=""
	this.action=""
	var filterOption=portalWnd.cmnGetCookie("filteroption");
	this.type=( filterOption == "1" ? "FILTER" : "FIND" );

	this.htmlElement=null
	this.fields=null
	this.firstFldElem=null;
	this.findBtn=null;
	this.findNextBtn=null;
	this.resetBtn=null;
	this.findFilterRow=null;
	this.rbFind=null;
	this.rbFilter=null;
}
//-----------------------------------------------------------------------------
filterObject.prototype.addField=function(name,caption,type,underline,editRtn,selectRtn)
{
	var oTable=this.htmlElement
	var oRow=oTable.insertRow(oTable.rows.length-2)

	// insert the field label
	var oCell = oRow.insertCell(oRow.cells.length)
	oCell.align="left"
	oCell.height="10"
	oCell.className="xtFilterLabel"
	oCell.setAttribute("tp","LABEL")
	txt = document.createTextNode(caption);
	var nobr=document.createElement("NOBR")
	nobr.appendChild(txt)
	oCell.appendChild(nobr)

	// create the input element
	var fld=null
	var sel=null
	switch(type.toUpperCase())
	{
	case "LABEL":
		oCell.align="left";
		oCell.style.fontWeight="bold"
		if (typeof(underline)!="undefined" && underline==true)
		{
			oCell.style.borderBottomWidth="2px"
			oCell.style.borderBottomStyle="solid"
			try { oCell.style.borderBottomColor = 
					document.styleSheets[0].rules.item(1).style.backgroundColor
			} catch (e) { }	// will error in ns 6
		}
		break;
	case "DATE":
		var id="fltrdate"+name+this.id
		fld = document.createElement("input");
		fld.size="10"
		fld.id=id
		fld.className="xTTextBox";
		fld.setAttribute("tp","DATE")
		fld.onfocus=this.portalWnd.cmnOnTextboxFocus;
		fld.onblur=fltrOnDateFieldBlur;
		fld.onkeydown=fltrOnDateKeyDown;
		sel=document.createElement("IMG");
		sel.id="img"+id
		sel.setAttribute("src", this.portalWnd.lawsonPortal.path + "/images/ico_form_calendar.gif");
		sel.setAttribute("fldObject",id)
		if(typeof(selectRtn)=="function")
			sel.onclick=selectRtn
		else
			sel.onclick=fltrDoDateSelect
		break
	case "TEXT":
		fld = document.createElement("input");
		fld.className="xTTextBox";
		fld.onkeydown=fltrOnTextKeyDown
		fld.onfocus=this.portalWnd.cmnOnTextboxFocus
		fld.onblur=this.portalWnd.cmnOnTextboxBlur
		break;
	case "SELECT":
		fld = document.createElement("select");
		fld.className="leftBarSelect";
		fld.onkeydown=fltrOnSelectKeyDown
		fld.onchange=fltrOnSelectChange
		break;
	case "CHECKBOX":
		fld = document.createElement("input");
		fld.type="checkbox"
		break
	case "CONTAINER":
		oCell.align="left";
		oCell.style.fontWeight="bold"
		oCell.setAttribute("tp","CONTAINER")
		oCell.name=name
		return oCell.appendChild(document.createElement("span"));
		break			
	}

	var myFld=null;
	if (fld)
	{
		fld.setAttribute("filterId",this.id)
		if (!this.firstFldElem)
			this.firstFldElem=fld
		if (typeof(editRtn)=="function")
			fld.onblur=editRtn
		fld.name=name
		oRow=oTable.insertRow(oTable.rows.length-2)
		var oCell2=oRow.insertCell(oRow.cells.length)
		oCell2.align="left"
		var nobr=document.createElement("NOBR")
		oCell2.appendChild(nobr)
		myFld=nobr.appendChild(fld);
		if (sel) nobr.appendChild(sel)
		return myFld
	}

	return (fld ? myFld : null);
}
//-----------------------------------------------------------------------------
filterObject.prototype.createFilterContainer=function(mElement)
{
	// create a table
	var oTable = document.createElement("table");
	oTable.cellPadding="0"
	oTable.cellSpacing="1"
	oTable.style.margin="0px"
	oTable.width="100%"
	this.htmlElement=mElement.appendChild(oTable);

	// insert find/filter radio buttons (display=none)
	var oRow=oTable.insertRow(oTable.rows.length)
	oRow.style.display="none"
	this.findFilterRow=oRow
	var oCell = oRow.insertCell(oRow.cells.length)
	oCell.align="left"
	oCell.setAttribute("tp","OPTIONS")

	var strHTM=""
	strHTM+="<span style=\"width:160px;text-align:left;margin-top:6px;margin-bottom:6px;border:1px solid lightgrey;\">"
	strHTM+="<input type=\"radio\" id=\"rbFltrFind\" name=\"radio\" tp=\"FIND\"></input>"
	strHTM+="<label id=\"lblFind\" for=\"rbFltrFind\" class=\"xTLabel\" style=\"margin-bottom:6px;\">"
	strHTM+=this.portalWnd.lawsonPortal.getPhrase("LBL_FIND")+"</label>"
	strHTM+="&nbsp;&nbsp;&nbsp;"
	strHTM+="<input type=\"radio\" id=\"rbFltrFilter\" name=\"radio\" tp=\"FILTER\"></input>"
	strHTM+="<label id=\"lblFilter\" for=\"rbFltrFilter\" class=\"xTLabel\" style=\"margin-top:3px;\">"
	strHTM+=lawsonPortal.getPhrase("LBL_FILTER")+"</label>"
	strHTM+="</span>"

	oCell.innerHTML=strHTM
	this.rbFind=document.getElementById("rbFltrFind")
	if (this.rbFind)
	{
		this.rbFind.setAttribute("filterId",this.id)
		this.rbFind.onclick=fltrOnRadioClick
		if (this.type=="FIND")
			this.rbFind.checked=true;
	}
	this.rbFilter=document.getElementById("rbFltrFilter")
	if (this.rbFilter)
	{
		this.rbFilter.setAttribute("filterId",this.id)
		this.rbFilter.onclick=fltrOnRadioClick
		if (this.type=="FILTER")
			this.rbFilter.checked=true;
	}

	// now insert the row of buttons
	oRow=oTable.insertRow(oTable.rows.length)
	oCell = oRow.insertCell(oRow.cells.length)
	oCell.align="left"

	// create the find/filter button
	var oButton=document.createElement("button")
	oButton.id="fltrFindBtn"
	oButton.className="xTToolBarButton"
	oButton.onclick=fltrOnFindClick
	oButton.style.width="44px"
	this.findBtn = oButton;
	strBtnText = this.type=="FILTER" 
		? this.portalWnd.lawsonPortal.getPhrase("LBL_FILTER") 
		: this.portalWnd.lawsonPortal.getPhrase("LBL_FIND")
	oButton.appendChild(document.createTextNode(strBtnText))
	oCell.appendChild(oButton)

	// following exists only to satisfy use in EKM
	// Note to EKM: please use 'setButtonText' method.
	this.anchor = this.findBtn;

	// findnext button (invisible/disabled)
	oButton=document.createElement("button")
	oButton.id="fltrNextBtn"
	oButton.className="xTToolBarButtonDisabled"
	oButton.disabled=true;
	oButton.onclick=fltrOnFindClick
	oButton.style.visibility="hidden"
	oButton.style.width="65px"
	this.findNextBtn = oButton;
	oButton.appendChild(document.createTextNode(this.portalWnd.lawsonPortal.getPhrase("LBL_FIND_NEXT")))
	oCell.appendChild(oButton)

	// reset button (invisible/disabled)
	oButton=document.createElement("button")
	oButton.id="fltrResetBtn"
	oButton.className="xTToolBarButtonDisabled"
	oButton.disabled=true;
//	oButton.onclick=(none: user defined)
	oButton.style.visibility="hidden"
	oButton.style.width="44px"
	this.resetBtn = oButton;
	oButton.appendChild(document.createTextNode(this.portalWnd.lawsonPortal.getPhrase("LBL_RESET")))
	oCell.appendChild(oButton)

	return oTable;
}
//-----------------------------------------------------------------------------
filterObject.prototype.enableButton=function(which,enabled)
{
	try {
		if (typeof(enabled) != "boolean")
			enabled=true;
		var btn=this.getButton(which)
		if (btn)
		{
			btn.disabled = !enabled
			btn.className = enabled 
					? "xTToolBarButton" : "xTToolBarButtonDisabled"
		}
	} catch (e) { }
}
//-----------------------------------------------------------------------------
filterObject.prototype.selectFirst=function()
{
	if (!this.firstFldElem) return
	
	try{
		this.firstFldElem.focus();
		
		if (this.firstFldElem.tagName=="INPUT")	
			this.firstFldElem.select();
	}catch(e){}
}
//-----------------------------------------------------------------------------
filterObject.prototype.showButton=function(which,show)
{
	try {
		if (typeof(show) != "boolean")
			show=true;
		var btn=this.getButton(which)
		if (btn) 
			btn.style.visibility = (show ? "visible" : "hidden");
	} catch (e) { }
}
//-----------------------------------------------------------------------------
filterObject.prototype.showOptions=function(show)
{
	try {
		if (typeof(show) != "boolean")
			show=true;
		this.findFilterRow.style.display = (show ? "inline" : "none");
	} catch (e) { }
}
//-----------------------------------------------------------------------------
filterObject.prototype.getButton=function(which)
{
	var btn=null;
	switch (which.toLowerCase())
	{
	case "find":
		btn=this.findBtn
		break;
	case "findnext":
		btn=this.findNextBtn
		break;
	case "reset":
		btn=this.resetBtn
		break;
	}
	return btn;
}
//-----------------------------------------------------------------------------
filterObject.prototype.setButtonAction=function(which,action)
{
	try {
		var btn=this.getButton(which)
		if (btn && typeof(action)=="function") 
			btn.onclick=action
	} catch (e) { }
}
//-----------------------------------------------------------------------------
filterObject.prototype.setButtonText=function(which,text)
{
	try {
		var btn=this.getButton(which)
		if (btn) btn.firstChild.nodeValue=text
	} catch (e) { }
}
//-----------------------------------------------------------------------------
filterObject.prototype.getType=function()
{
	return this.type;
}
//-----------------------------------------------------------------------------
filterObject.prototype.setType=function(type)
{
	try {
		switch (type.toUpperCase())
		{
		case "FILTER":
			this.type=type.toUpperCase()
			this.rbFilter.checked=true;
			break;
		case "FIND":
			this.type=type.toUpperCase()
			this.rbFind.checked=true;
			break;
		default:
			return this.type;
			break;
		}
		
	} catch (e) { }
	return this.type;
}


//-----------------------------------------------------------------------------
// filter object event handlers
//-----------------------------------------------------------------------------

function fltrOnDateFieldBlur()
{
	this.value=edFormatDate(this.value, "8")
	this.className="xTTextBox";
}
//-----------------------------------------------------------------------------
function fltrDoDateSelect(id)
{
	var fldObj = (typeof(id) == "string")
		? document.getElementById(id)
		: document.getElementById(this.getAttribute("fldObject"))

	var strDate = fldObj.value
	var oDate=null;
	if (strDate!="")
		oDate=portalWnd.edGetDateObject(strDate)
	if (!oDate || isNaN(oDate))
		oDate=new Date()

	dateSL=fldObj
	oDate.type="iframe"
	iWindow.dropObj.showIframe(oDate, fldObj, "dropObj.portalWnd.fltrDateSelectRtn")
}
//-----------------------------------------------------------------------------
function fltrDateSelectRtn(date)
{
	if (date)
	{
		dateSL.value=edSetUserDateFormat(date,"8")
		if (typeof(dateSL.onblur) == "function")
		{
			dateSL.focus()
			dateSL.blur()
		}
		var filterObj=fltrGetFilterObject(dateSL);
		if (filterObj)
			filterObj.enableButton("findnext",false);
	}
	setTimeout("fltrSetDateFocus()",10)
}
//-----------------------------------------------------------------------------
function fltrSetDateFocus()
{
	dateSL.focus()
	dateSL.select()
}
//-----------------------------------------------------------------------------
function fltrOnSelectChange()
{
	var filterObj=fltrGetFilterObject(this);
	filterObj.enableButton("findnext",false);
}
//-----------------------------------------------------------------------------
function fltrOnSelectKeyDown(e)
{
	var evt=getEventObject(e)
	if(evt && (evt.keyCode == 13 || evt.keyCode==27))
		// kill the escape or enter key sent to a select
		setEventCancel(evt)
}
//-----------------------------------------------------------------------------
function fltrOnDateKeyDown(e)
{
	var evt=getEventObject(e)
	if (evt && (evt.keyCode == 13))
		fltrDoDateSelect(this.id)
}
//-----------------------------------------------------------------------------
function fltrOnTextKeyDown(e)
{
	var evt=getEventObject(e)
	var evtTarget=getEventElement(evt)

	var keyVal = (evt.keyCode == 0 ? evt.charCode : evt.keyCode)

	if (keyVal == 13)
	{
		// on enter, do the filter action
		var oTable=fltrGetTableElement(this)
		fltrDoFilterAction(oTable)
	}
	else if (keyVal > 31 && keyVal < 97)
	{
		// disable find next on any input
		var filterObj=fltrGetFilterObject(this);
		if (filterObj)
			filterObj.enableButton("findnext",false);
	}
}
//-----------------------------------------------------------------------------
function fltrGetFilterObject(elem)
{
	try {
		var oTable=fltrGetTableElement(elem)
		var tabId=oTable.getAttribute("tabId")
		var navId=oTable.getAttribute("container")
		var filterId=elem.getAttribute("filterId")
		return (lawsonPortal.tabArea.tabs[tabId].navletObjects[navId].items[filterId]);
	} catch (e) { return null;}
}
//-----------------------------------------------------------------------------
function fltrGetTableElement(elem)
{
	var oTable=elem.parentNode
	while(oTable.nodeName!="TABLE")
		oTable=oTable.parentNode
	return (oTable);
}
//-----------------------------------------------------------------------------
function fltrOnRadioClick()
{
	var filterObj=fltrGetFilterObject(this)
	if (!filterObj) return;

	filterObj.type=this.getAttribute("tp")
	switch (filterObj.type.toUpperCase())
	{
	case "FIND":
		cmnSetCookie("filteroption","0",0);
		filterObj.setButtonText("find",lawsonPortal.getPhrase("LBL_FIND"))
		break;
	case "FILTER":
		cmnSetCookie("filteroption","1",0);
		filterObj.setButtonText("find",lawsonPortal.getPhrase("LBL_FILTER"))
		filterObj.enableButton("findnext",false)
		break;
	}
}
//-----------------------------------------------------------------------------
function fltrOnFindClick()
{
	var oTable=fltrGetTableElement(this)
	fltrDoFilterAction(oTable)
}
//-----------------------------------------------------------------------------
function fltrDoFilterAction(mTable)
{
	if ( !mTable || typeof(mTable) == "undefined" )
		return;

	var navID=mTable.getAttribute("container")
	var tabID=mTable.getAttribute("tabid")
	var funcCall=mTable.getAttribute("action")
	var re=/\(.*?\)/
	funcCall=funcCall.replace(re,"")
	var retObj=new Array()
	var idx=0;
	for (var i=1; i < mTable.rows.length; i++)
	{
		if(mTable.rows[i].cells[0].getAttribute("tp")=="CONTAINER")
		{
			retObj[idx]=new Array()
			retObj[idx][0]=mTable.rows[i].cells[0].name
			retObj[idx][1]=mTable.rows[i].cells[0].firstChild.nextSibling
			idx++
			continue;
		}
		if (mTable.rows[i].cells[0].getAttribute("tp")=="LABEL")
			continue;
		if (mTable.rows[i].cells[0].getAttribute("tp")=="OPTIONS")
			continue;
		// get focus off text field
		if (mTable.rows[i].cells[0].firstChild.nodeName == "BUTTON")
		{
			try { mTable.rows[i].cells[0].firstChild.focus()
			} catch (e) { }
			continue;
		}

		retObj[idx]=new Array()
		var name=""
		var val=""
		var fld=mTable.rows[i].cells[0].firstChild.firstChild
		name=fld.name
		if(fld.nodeName=="INPUT")
		{
			if(fld.type=="checkbox")
				val = fld.checked ? true : false;
			else
				val = fld.value
		}
		else if(fld.nodeName=="SELECT")
		{
			val=fld.options[fld.selectedIndex].value
			if(val=="")
				val=fld.options[fld.selectedIndex].text
		}
		retObj[idx][0]=name
		retObj[idx][1]=val
		idx++
	}
	funcCall=funcCall+"(retObj)"
	eval("lawsonPortal.tabArea.tabs['"+tabID+"'].navletObjects['"+navID+"'].target." + funcCall)
}
