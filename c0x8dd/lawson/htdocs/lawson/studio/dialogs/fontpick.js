/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/dialogs/fontpick.js,v 1.2.28.2 2012/08/08 12:48:47 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// fontpick.js
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

var fontFam="arial"
var fontWeight="normal"
var fontSize="8pt"
var fontStyle="normal"
var fontStrike="none"
var fontUnderline="none"
var fontOrder=null

var studioWnd=null
var fontStorage=null
var optVal=null
var wdgtFlag=false

//-----------------------------------------------------------------------------
function fontInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	studioWnd=wndArguments[0]
	fontStorage=wndArguments[1]

	var len=(fontStorage ? fontStorage.length : 0)
	for (var j = 0; j < len; j++)
	{
		var name=fontStorage.children(j).name.toLowerCase()
		var value=fontStorage.children(j).value.toLowerCase()
		switch (name)
		{
		case "family":
			// remember incoming order
			fontOrder=new Array()
			for (var i=0; i < Font.length; i++)
				Font.options[i].selected=false
			var arrFonts=value.split(",")
			var lenFonts=(arrFonts?arrFonts.length:0)
			var font
			var lowerFont
			for (var f=0; f < lenFonts; f++)
			{
				font=studioWnd.trim(arrFonts[f])
				lowerFont=font.toLowerCase()
				for (var i=0; i < Font.length; i++)
				{
					if (Font.options[i].value == lowerFont)
					{
						Font.options[i].selected=true
						fontOrder[fontOrder.length]=Font.options[i].text
						break;
					}
				}
			}
			fontFam=fontOrder.join(",")
			if (!fontFam)
			{
				fontFam=Font.options[0].text
				Font.selectedIndex=0
			}
			lblAlpha.style.fontFamily=fontFam
			break;

		case "style":
			for (var i=0; i < Style.length; i++)
			{
				if (Style.options[i].value == value)
				{
					Style.options.selectedIndex = i
					fontStyle=Style.options[Style.selectedIndex].value
					lblAlpha.style.fontStyle=fontStyle
					break;
				}
			}
			break;
			
		case "weight":
			for (var i=0; i < Weight.length; i++)
			{
				if (Weight.options[i].value == value)
				{
					Weight.options.selectedIndex = i
					fontWeight=Weight.options[Weight.selectedIndex].value
					lblAlpha.style.fontWeight=fontWeight
					break
				}
			}
			break;

		case "size":
			for (var i=0;i<Size.length;i++)
			{
				if (Size.options[i].value == value)
				{
					Size.options.selectedIndex = i
					fontSize=Size.options[Size.selectedIndex].value
					lblAlpha.style.fontSize=fontSize
					break
				}
			}
			break;
		}
	}

	underline.disabled=true
	strikethrough.disabled=true	
}

//-----------------------------------------------------------------------------
function underlineCheck()
{
	lblAlpha.style.textDecorationUnderline=event.srcElement.checked;
	fontUnd="underline"
}

//-----------------------------------------------------------------------------
function strikeCheck()
{
    lblAlpha.style.textDecorationLineThrough=event.srcElement.checked;
	fontStrike="line-through"
}
	
//-----------------------------------------------------------------------------
function updateFont()
{
	// due to it's multi-select style, font family
	// is the only list which may not have a selection
	if (Font.selectedIndex == -1)
	{
		Font.focus()
		studioWnd.cmnDlg.messageBox("Please select at least one font family.")
		return;
	}

	// ok, store the selections and return
	var item=fontStorage.getItem("family")
	if (item)
		fontStorage.setItem("family",fontFam)
	else
		fontStorage.add("family",fontFam)
	item=fontStorage.getItem("style")
	if (item)
		fontStorage.setItem("style",fontStyle)
	else
		fontStorage.add("style",fontStyle)
	item=fontStorage.getItem("weight")
	if (item)
		fontStorage.setItem("weight",fontWeight)
	else
		fontStorage.add("weight",fontWeight)
	item=fontStorage.getItem("size")
	if (item)
		fontStorage.setItem("size",fontSize)
	else
		fontStorage.add("size",fontSize)

	window.returnValue=fontStorage
	window.close()
}

//-----------------------------------------------------------------------------
function updatelblAlpha(fontObj)
{
	switch (fontObj.id)
	{
	case "Font":
		// create new fontOrder array
		var newOrder=new Array()

		// store selected options into smaller array
		var arrSel=new Array()
		for (var i=0; i < Font.length; i++)
			if (Font.options[i].selected)
				arrSel[arrSel.length]=Font.options[i]
				
		var lenSel=(arrSel?arrSel.length:0);
		var lenFonts=(fontOrder?fontOrder.length:0);
		var font
		var fontLower
		var found
		
		// preserve previous font order
		for (var f=0; f < lenFonts; f++)
		{
			font=fontOrder[f]
			fontLower=font.toLowerCase()
			found=false
			for (var i=0; (i < lenSel) && !found; i++)
			{
				if (fontLower==arrSel[i].value)
				{
					newOrder[newOrder.length]=font
					found=true
				}
			}
		}
		
		// insert new fonts at end of list, in select's order
		var lenNew=(newOrder?newOrder.length:0);
		for (var i=0; i < lenSel; i++)
		{
			font=arrSel[i].text
			found=false
			for (var f=0; (f < lenNew) && !found; f++)
				found|=(font==newOrder[f])
			if (!found)
				newOrder[newOrder.length]=font
		}
		fontOrder=newOrder
		fontFam=fontOrder.join(",")
		if (!fontFam)
			fontFam=Font.options[0].text
		lblAlpha.style.fontFamily=fontFam
		break
		
	case "Size":
		lblAlpha.style.fontSize=Size.options[Size.selectedIndex].value
		fontSize=Size.options[Size.selectedIndex].value		
		break
		
	case "Style":
		lblAlpha.style.fontStyle=Style.options[Style.selectedIndex].value
		fontStyle=Style.options[Style.selectedIndex].value
		break
	
	case "Weight":
		lblAlpha.style.fontWeight=Weight.options[Weight.selectedIndex].value
		fontWeight=Weight.options[Weight.selectedIndex].value
		break
	}
}

//-----------------------------------------------------------------------------
function handleKeyDown()
{
	var bHandled=false;
	if (event.keyCode==13)		// enter
	{
		if (document.activeElement.id == "btnCancel") return true;
		if (document.activeElement.id != "btnOK"
		&& document.activeElement.id.substr(0,3) == "btn")
			return true;
		document.all.btnOK.click()
		bHandled=true
	}
	else if (event.keyCode==27)	// ESC
	{
		document.all.btnCancel.click()
		bHandled=true
	}
	if (bHandled)
	{
		event.cancelBubble=true;
		event.returnValue=false;
	}
	return (!bHandled)
}
