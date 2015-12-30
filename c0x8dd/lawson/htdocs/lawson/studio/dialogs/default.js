/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/dialogs/default.js,v 1.5.28.2 2012/08/08 12:48:47 jomeli Exp $NoKeywords: $ */
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
var parentWnd=null;
var ds=null;

function defInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	var initValue = wndArguments[0];
	parentWnd = wndArguments[1];
	ds = parentWnd.designStudio;
	if(initValue && typeof(initValue) != "undefined" && initValue != "")
	{
		txtValue.value = initValue;
		if(txtValue.value.indexOf("LAW_WEB_USR.") != -1)
		{
			rdUserdef.checked = true;
			defLoadUserDefs();
		}
	}
	document.body.style.visibility="visible";
	document.body.style.cursor="auto";
	txtValue.focus();
}

function defOnKeyDown()
{
	var bEvtCaught=false;
	var mElement = event.srcElement;
	switch(event.keyCode)
	{
		case parentWnd.keys.ESCAPE:
			bEvtCaught=true
			window.close()
			break;
		case parentWnd.keys.ENTER:
			if(mElement.id == "txtFind")
				defFind();
	}
	if (bEvtCaught)
		parentWnd.setEventCancel(event)
	return (!bEvtCaught)
}

function defRadioClicked()
{
	if(rdUserdef.checked)
	{
		if(txtValue.value.indexOf("LAW_WEB_USR.") == -1)
		{
			defLoadUserDefs();
			txtValue.value = "";
			txtFind.disabled = false;
			btnFind.disabled = false;
		}
	}
	else if(rdLiteral.checked)
	{
		if(txtValue.value.indexOf("LAW_WEB_USR.") != -1 || txtValue.value == "")
		{
			defClearUserDefOptions();
			txtValue.value = "";
			txtFind.disabled = true;
			btnFind.disabled = true;
		}
	}
}

function defLoadUserDefs()
{
	var nodes = ds.profile.selectNodes("/PROFILE/ATTRIBUTES/ATTR");

	var id, option, len = nodes.length;
	for(var i=0; i<len; i++)
	{
		id = nodes[i].getAttribute("name");
		option = document.createElement("OPTION");
		option.text = id;
		option.value = id;
		lstUserDef.add(option);
	}
}

function defClearUserDefOptions()
{
	var i, len = lstUserDef.options.length;
	for(i=len-1; i>=0; i--)
	{
		var option = lstUserDef.options[i];
		lstUserDef.removeChild(option);
	}
}

function defChgUserDefSel()
{
	if(lstUserDef.selectedIndex == -1)return;
	txtValue.value = "LAW_WEB_USR."+lstUserDef.options[lstUserDef.selectedIndex].value;
}

function defDblClickUserDef()
{
	if(lstUserDef.selectedIndex == -1)return;
	txtValue.value = "LAW_WEB_USR."+lstUserDef.options[lstUserDef.selectedIndex].value;
	defSelect();
}

function defSelect()
{
	window.returnValue = txtValue.value;
	window.close();
}

function defOnTextKeyPress()
{
	// make all lowercase letters uppercase
	if (event.keyCode > 96 && event.keyCode < 123)
		event.keyCode -= 32
}

function defFind()
{
	var start = (lstUserDef.selectedIndex==-1) ? 0 : lstUserDef.selectedIndex+1
	var srch = txtFind.value.toUpperCase()
	var len = lstUserDef.options.length

	// search from current position to end of list
	for ( var i = start; i < len; i++ )
	{
		var text=lstUserDef.options[i].text.toUpperCase()
		if ( text.indexOf(srch) != -1 )
		{
			lstUserDef.selectedIndex = i
			lstUserDef.focus()
			defChgUserDefSel()
			return true;
		}
	}

	// didn't find: search from beginning of list
	for ( var i = 0; i < start; i++ )
	{
		var text=lstUserDef.options[i].text.toUpperCase()
		if ( text.indexOf(srch) != -1 )
		{
			lstUserDef.selectedIndex = i
			lstUserDef.focus()
			defChgUserDefSel()
			return true;
		}
	}
	return false;
}
