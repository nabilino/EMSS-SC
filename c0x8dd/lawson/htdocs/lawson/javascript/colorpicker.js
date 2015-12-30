//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
//What String:@(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/colorpicker.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $ 

// (must be even number) screen to open width
var stoWidth  = 412
// screen to open height
var stoHeight = 141
var objToReplace = ""
var colorpickerWindow = ""

function colorpicker(obj, color)
{
var theblank = (window.location.protocol=='http:')?'about:blank':'/lawson/dot.htm';  //dpb 07-11-01 SSL Issue
	objToReplace = obj

	if (typeof(color) != "string")
	{
		if (typeof(colorpickerWindow) != "string" && !colorpickerWindow.closed)
			colorpickerWindow.location = theblank
		colorpickerWindow = window.open("/lawson/office/colorpicker.htm", "colorpickerWindow", "height="+stoHeight+",width="+stoWidth) 
		colorpickerWindow.focus()
	}
	else
	{
		if (color.length != 6 && color.length != 7)
		{
			alert("Color must be passed in hexadecimal form. (i.e. #f4aa3c or f4aa3c)")
			if (typeof(colorpickerWindow) != "string" && !colorpickerWindow.closed)
				colorpickerWindow.location = theblank
			colorpickerWindow = window.open("/lawson/office/colorpicker.htm", "colorpickerWindow", "height="+stoHeight+",width="+stoWidth) 
			colorpickerWindow.focus()
		}
		else
		{
			if (color.length == 7)
				color = color.substring(1)
			color.toLowerCase()
			if (typeof(colorpickerWindow) != "string" && !colorpickerWindow.closed)
				colorpickerWindow.location = theblank
			colorpickerWindow = window.open("/lawson/office/colorpicker.htm#" + color, "colorpickerWindow", "height="+stoHeight+",width="+stoWidth) 
			colorpickerWindow.focus()
		}
	}
}
