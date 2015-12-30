/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/dialogs/colorpick.js,v 1.2.28.2 2012/08/08 12:48:47 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// colorpick.js
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

// get user-defined variables
var args = window.location.search.substr(1).split("&");
for (var i =0; i < args.length; i++)
{
	var keyValue = args[i].split('=');
	if(keyValue.length == 2)
		args[keyValue[0]] = keyValue[1];
}

// user-definable defaults
var StartColor = '999999';
var ReturnFunc

var currentPanel = 0;
var maxPanel=3;
var gebi = document.getElementById;
var pdc = GetPDC();
var timer = null;

//-----------------------------------------------------------------------------
function changeColor(dec)
{
	var cf = document.getElementById("colorpickerForm");
	if (dec)
	{	var cR = HexValue(cf.dRed.value);
		var cG = HexValue(cf.dGreen.value);
		var cB = HexValue(cf.dBlue.value);
	}
	else
	{	var cR = cf.hRed.value;
		var cG = cf.hGreen.value;
		var cB = cf.hBlue.value;
	}
	setColor(cR + cG + cB)
}

//-----------------------------------------------------------------------------
function modifyColor(dR, dG, dB)
{
	// new current decimal values
	var cf = gebi("colorpickerForm");
	var cR = parseInt(cf.dRed.value) + dR;
	var cG = parseInt(cf.dGreen.value) + dG;
	var cB = parseInt(cf.dBlue.value) + dB;

	// check for maximum value
	cR = (cR < 256) ? cR : 255;
	cG = (cG < 256) ? cG : 255;
	cB = (cB < 256) ? cB : 255;

	// check for minimum value
	cR = (cR > -1) ? cR : 0;
	cG = (cG > -1) ? cG : 0;
	cB = (cB > -1) ? cB : 0;

	// set the color
	setColor(HexValue(cR + '') + HexValue(cG + '') + HexValue(cB + ''));
	timer = setTimeout('modifyColor(' + dR + ',' + dG + ',' + dB+ ')', 100);
}

//-----------------------------------------------------------------------------
function initColorPicker()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	var paramArray=new Array()
	paramArray=wndArguments

	var parentWin=paramArray[0];
	StartColor=paramArray[1]
	document.body.style.display='inline'

	setColor(StartColor)
	showPanel(0)
	document.body.focus()
}

//-----------------------------------------------------------------------------
function setColor(c)
{
	// make color upper case
	c = c.toUpperCase();

	// strip leading hash if present
	if(c.charAt(0) == '#')
		c = c.substr(1);

	// seperate hex values
	var hR = c.substr(0,2);
	var hG = c.substr(2,2);
	var hB = c.substr(4,2);

	// get decimal values
	var dR = DecValue(hR);
	var dG = DecValue(hG);
	var dB = DecValue(hB);

	// set RGB panel
	gebi("currDecRed").style.backgroundColor = '#' + hR + '0000';
	gebi("colorpickerForm").dRed.value = dR;
	gebi("currDecGreen").style.backgroundColor = '#00' + hG + '00';
	gebi("colorpickerForm").dGreen.value = dG;
	gebi("currDecBlue").style.backgroundColor = '#0000' + hB;
	gebi("colorpickerForm").dBlue.value = dB;

	// set Hex panel
	gebi("currHexRed").style.backgroundColor = '#' + hR + '0000';
	gebi("colorpickerForm").hRed.value = hR.toUpperCase();
	gebi("currHexGreen").style.backgroundColor = '#00' + hG + '00';
	gebi("colorpickerForm").hGreen.value = hG.toUpperCase();
	gebi("currHexBlue").style.backgroundColor = '#0000' + hB;
	gebi("colorpickerForm").hBlue.value = hB.toUpperCase();

	// set color diplay
	var cd = gebi("colorDisplay");
	cd.style.backgroundColor = '#' + hR + hG + hB;
	if(pdc[hR + hG + hB])
	{	cd.innerText = pdc[hR + hG + hB];
		cd.style.color = '#' + FontBright(hR + hG + hB);
	}
	else
		cd.innerText = '';
}

//-----------------------------------------------------------------------------
function setReturnValue()
{
	window.returnValue=gebi("colorDisplay").style.backgroundColor.substr(1).toUpperCase();
	window.close();
}

//-----------------------------------------------------------------------------
function showPanel(p)
{
	// remove current panel
	gebi('panel' + currentPanel).className = 'dsTabPaneInactive';
	gebi('tab' + currentPanel).className = 'dsTabButtonInactive';

	// show new panel
	gebi('panel' + p).className = 'dsTabPaneActive';
	gebi('tab' + p).className = 'dsTabButtonActive';

	// make new panel current panel
	currentPanel = p
}

//-----------------------------------------------------------------------------
function handleKeyDown()
{
	var bHandled=false;
	switch (event.keyCode)
	{
	case 27:
		window.close()
		bHandled=true;
		break;
		
	case 33:		// page up
		if( !event.altKey && event.ctrlKey && !event.shiftKey )
		{
			var pan=currentPanel-1
			if (pan < 0) pan=maxPanel
			showPanel(pan)
			bHandled=true;
		}
		break

	case 34:		// page down
		if( !event.altKey && event.ctrlKey && !event.shiftKey )
		{
			var pan=currentPanel+1
			if (pan > maxPanel) pan=0
			showPanel(pan)
			bHandled=true;
		}
		break
	}
	if (bHandled)
	{
		event.cancelBubble=true
		event.returnValue=false
	}
	return (!bHandled);
}
