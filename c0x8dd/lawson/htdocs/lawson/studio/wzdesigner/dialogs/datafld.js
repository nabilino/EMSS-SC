/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/wzdesigner/dialogs/datafld.js,v 1.3.28.2 2012/08/08 12:48:52 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// datafld.js
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
var studioWnd=null;
var sourceWnd=null;
var oFormDef=null;
var oFldDOM=null;
var keyBuff=""; // type to select options
var gAlpha=null;

//-----------------------------------------------------------------------------
function dfInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	studioWnd = wndArguments[0];
	txtValue.value = wndArguments[1];
	sourceWnd = wndArguments[2];
	oFldDOM=wndArguments[3];
	oFormDef=wndArguments[4];

	// build the list of available data fields
	dfBuildList();

	document.body.style.visibility="visible";
	btnOK.focus();
}

//-----------------------------------------------------------------------------
function dfAttribute(fldNode)
{
	// displays the attributes of fldNode in the select at the right
	
	// clear attributes
	var len=selAttributes.childNodes.length;
	for (var opt=len-1;opt>=0;opt--)
		selAttributes.removeChild(selAttributes.childNodes[opt]);
		
	// show attributes
	var arrAtt=fldNode.attributes;
	var len=(arrAtt?arrAtt.length:0);
	var arrText=new Array();
	for (var a=0;a<len;a++)
		arrText.push(padSpaces(arrAtt[a].nodeName + ": ",8) + arrAtt[a].nodeValue);
	arrText.sort();
	for (var a=0;a<len;a++)
	{
		var oOption = document.createElement("option");
		oOption.text=arrText[a];
		selAttributes.add(oOption);
	}
}

//-----------------------------------------------------------------------------
function dfBuildList()
{
	// initial value
	var nm0 = txtValue.value;

	// clear fields
	var len=selFieldList.childNodes.length;
	for (var opt=len-1;opt>=0;opt--)
		selFieldList.removeChild(selFieldList.childNodes[opt]);

	var fldNodes=oFldDOM.documentElement.childNodes;
	len=(fldNodes ? fldNodes.length : 0);
	
	// clone childnodes array
	var arr=new Array();
	for (var i=0;i<len;i++)
	{
		if (fldNodes[i].getAttribute("nm") != "")
			arr.push(fldNodes[i]);
	}
	if (gAlpha)
		arr.sort(dfSortName);
	fldNodes=arr;
	len=(fldNodes ? fldNodes.length : 0);
		
	var rtntype=oFormDef.selectSingleNode("//form").getAttribute("rtntype");
	var bRtnOnly = (rtntype && (rtntype == "SEL")) ? true : false;

	// build array of fields to sort
	for (var i=0; i < len; i++ )
	{
		if (bRtnOnly)
		{
			if (fldNodes[i].getAttribute("rtn") == "0") continue;

			// must check against current form node as well
			var fNode = oFormDef.selectSingleNode("//*[@nbr='"+fldNodes[i].getAttribute("nbr")+"']");
			if (fNode && fNode.getAttribute("rtn") == "0") continue;
		}

		var nm=fldNodes[i].getAttribute("nm");
		var tp=fldNodes[i].getAttribute("tp");
		var output=(fldNodes[i].getAttribute("isxlt") == null) ? "" : " (OUTPUT)";
		var oOption = document.createElement("option");
		oOption.text=nm + output;
		oOption.value=tp;
		oOption.fldNode=fldNodes[i];
		
		selFieldList.add(oOption);
		
		// initial value
		if (nm0 == nm)
		{
			oOption.selected=true;
			txtType.value = tp;
			dfAttribute(fldNodes[i]);
		}
	}
	return;
}

//-----------------------------------------------------------------------------
function dfCancel()
{
	// user pressed cancel button
	window.close();
}

//-----------------------------------------------------------------------------
function dfFind()
{
	var start = (selFieldList.selectedIndex==-1) ? 0 : selFieldList.selectedIndex+1
	var srch = txtFind.value.toUpperCase()
	var len = selFieldList.length
	
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

//-----------------------------------------------------------------------------
function dfFindDatasrc()
{
	var start = (selFieldList.selectedIndex==-1) ? 0 : selFieldList.selectedIndex+1;
	var len = selFieldList.length;
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

//-----------------------------------------------------------------------------
function dfOK()
{
	// user pressed ok button
	var selIndex=selFieldList.selectedIndex;
	if (selIndex == -1) return;
	with (selFieldList.options[selIndex])
		window.returnValue=text + "/" + value;
	window.close();
}

//-----------------------------------------------------------------------------
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
				{
					with (selFieldList.options[selIndex])
					{
						txtValue.value=text;
						txtType.value=value;
						dfAttribute(fldNode);
					}
				}
				dfOnSelectChange()
				if ( event.keyCode == 13 )
					btnOK.click()
			}
			else
			{
				keyBuff=String.fromCharCode(event.keyCode)
				keyBuff=keyBuff.toUpperCase()
				if (dfFindDatasrc())
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

//-----------------------------------------------------------------------------
function dfOnSelectChange()
{
	var i=selFieldList.selectedIndex;
	with (selFieldList.options[i])
	{
		txtValue.value = text;
		txtType.value=value;
		dfAttribute(fldNode);
	}
}

//-----------------------------------------------------------------------------
function dfOnTextKeyPress()
{
	// make all lowercase letters uppercase
	if (event.keyCode > 96 && event.keyCode < 123)
		event.keyCode -= 32
}

//-----------------------------------------------------------------------------
function dfSortName(a,b)
{
	// sorts folders alphabetically by name
	// used by ProvSelect.render
	var aText=a.getAttribute("nm").toLowerCase()
	var bText=b.getAttribute("nm").toLowerCase()
	if (aText < bText) return (-1);
	if (aText == bText) return (0);
	if (aText > bText) return (1);
}

//-----------------------------------------------------------------------------
function dfToggleAlpha(cb)
{
	gAlpha=cb.checked;
	dfBuildList()
	//dfFormFields();
	//dfSelectMethod();
}

//-----------------------------------------------------------------------------
function padSpaces(s,n)
{
	var ret=s+""
	while (ret.length<n)
		ret+=" "
	return ret
}
