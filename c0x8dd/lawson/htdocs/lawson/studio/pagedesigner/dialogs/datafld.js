/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/pagedesigner/dialogs/datafld.js,v 1.2.28.2 2012/08/08 12:48:48 jomeli Exp $ */
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
var parentWnd;
var oFormDef;

function dfInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	parentWnd = wndArguments[0];
	oFormDef = wndArguments[1];
	txtValue.value = wndArguments[2];

	var bList = dfBuildList();
	document.body.style.visibility="visible"
	if (bList)
		btnOK.focus()
	else
	{
		btnOK.disabled=true;
		btnCancel.focus();
	}
}

function dfBuildList(bDetail)
{
	if (!oFormDef) return (false);

	var fldArray=new Array();
	var fldNodes=oFormDef.selectNodes("//fld[@nbr and (@tp='Text' or @tp='Hidden' or @tp='Select' or @tp='Out')] | push[@nbr]");
	var len=(fldNodes ? fldNodes.length : 0);
	for (var i=0; i < len; i++ )
	{
		if (fldNodes[i].getAttribute("nm") == "")
			continue;
		fldArray[fldArray.length]=fldNodes[i].getAttribute("nm");
	}

	len=fldArray.length;
	if (!len) return (false);
	fldArray.sort();

	// add the 'none' choide
	var oOption = document.createElement("option");
	oOption.text = "None";
	oOption.value = "none";
	selFieldList.add(oOption);
	if (txtValue.value=="")oOption.selected=true;

	for (var i=0; i < len; i++ )
	{
		var oOption = document.createElement("option");
		oOption.text = fldArray[i];
		oOption.value = fldArray[i];

		if (txtValue.value!="" && fldArray[i]==txtValue.value)
			oOption.selected=true;
		selFieldList.add(oOption);
	}
	return (true);
}


function dfOnBodyKeyPress()
{
	var evtCaught=false;
	if (event.keyCode == 27)
	{
		window.close()
		return;
	}
	else if (event.srcElement.id == "btnFind")
	{
		if ( event.keyCode != 13 && khdlOKCancel(event))
			evtCaught=true;
	}
	else if (event.srcElement.id == "selFieldList")
	{
		if (event.keyCode != 9)
		{
			if ( event.keyCode == 13 || event.keyCode == 32 )
			{
				evtCaught=true;
				var selIndex=selFieldList.selectedIndex
				if (selIndex != -1)
					txtValue.value=selFieldList.options[selIndex].value
				dfOnSelectChange()
				if ( event.keyCode == 13 )
					btnOK.click()
			}
			else
			{
				keyBuff=String.fromCharCode(event.keyCode)
				keyBuff=keyBuff.toUpperCase()
				if ( dfFindDatasrc() )
				{
					txtValue.value=keyBuff
					txtValue.focus()
					evtCaught=true;
				}
			}
		}
	}
 	else if (event.srcElement.id == "txtValue")
 	{
		if (event.keyCode==32)		// space
		{
			event.keyCode=0
 			keyBuff=txtValue.value.toUpperCase()
	 		if ( dfFindDatasrc() )
			{
				evtCaught=true;
			 	selFieldList.focus()
				dfOnSelectChange()
			}
		}
	}
 	else if (event.srcElement.id == "txtFind")
 	{
		if (event.keyCode==13)		// enter
		{
			btnFind.focus()
			btnFind.click()
			evtCaught=true;
		}
	}

	if (evtCaught)
	{
		event.cancelBubble=true
		event.returnValue=false
	}
	return (!evtCaught);
}

function khdlOKCancel(evt)
{
	if (evt.keyCode==13)		// enter
	{
		if (document.activeElement.id == "btnCancel") return false
		if (document.activeElement.id != "btnOK"
		&& document.activeElement.id.substr(0,3) == "btn")
			return false
		document.all.btnOK.click()
		return true
	}
	else if (evt.keyCode==27)	// ESC
	{
		document.all.btnCancel.click()
		return true
	}
	return false
}

function dfOnTextKeyPress()
{
	// make all lowercase letters uppercase
	if (event.keyCode > 96 && event.keyCode < 123)
		event.keyCode -= 32
}

function dfOnSelectChange()
{
	txtValue.value = selFieldList.options[selFieldList.selectedIndex].value
	if (txtValue.value=="none")
	{
		txtValue.value=""
	}
}

function dfFind()
{
	var start = (selFieldList.selectedIndex==-1) ? 0 : selFieldList.selectedIndex+1
	var srch = txtFind.value.toUpperCase()
	var len = selFieldList.options.length

	// search from current position to end of list
	for ( var i = start; i < len; i++ )
	{
		var text=selFieldList.options[i].text.toUpperCase()
		if ( text.indexOf(srch) != -1 )
		{
			selFieldList.selectedIndex = i
			selFieldList.focus()
			dfOnSelectChange()
			return true;
		}
	}

	// didn't find: search from beginning of list
	for ( var i = 0; i < start; i++ )
	{
		var text=selFieldList.options[i].text.toUpperCase()
		if ( text.indexOf(srch) != -1 )
		{
			selFieldList.selectedIndex = i
			selFieldList.focus()
			dfOnSelectChange()
			return true;
		}
	}
	return false;
}

function dfSelect()
{
	window.returnValue = txtValue.value
	window.close()
}

function dfFindDatasrc()
{
	var start = (selFieldList.selectedIndex==-1) ? 0 : selFieldList.selectedIndex+1
	var len = selFieldList.options.length

	for ( var i = start; i < len; i++ )
	{
		if ( selFieldList.options[i].text.substr(0, keyBuff.length).toUpperCase() == keyBuff )
		{
			selFieldList.selectedIndex = i
			return true;
		}
	}

	// didn't find: search from beginning of list
	for ( var i = 0; i < start; i++ )
	{
		if ( selFieldList.options[i].text.substr(0, keyBuff.length).toUpperCase() == keyBuff )
		{
			selFieldList.selectedIndex = i
			return true;
		}
	}

	selFieldList.selectedIndex = -1
	return false
}
