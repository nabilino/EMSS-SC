//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/cgigraphic.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
//
//   This object will control CGI graphics. Allowing colors and bgcolors to change by use of several methods 
//
//	 ButtonOn 	       - display OnColor and Bgcolor for cgigraphic
//	 ButtonOff         - display OffColor and OffBgcolor for cgigraphic
//	 ClearGraphic      - display Bgcolor or OffBgcolor with no text depending on the value of On property
//	 DisplayCgiGraphic - returns string of graphic location, height, width, font, align
//							example    "/cgi-lawson/textgif/Find%20Template?color=ffff00&align=center&width=100&font=small"
//
//
//  Object Properties
//
//   Text          - The text the CGIGraphic will display
//   OnColor       - Color of text for Graphic On display
//   OffColor      - Color of text for Graphic Off display
//   Bgcolor       - Color of background for Graphic On display
//   OffBgcolor    - Color of background for Graphic Off display
//   Width         - Width of graphic in pixels
//   Height        - Height of graphic in pixels
//   On            - Display Graphic On or Off properties
//   Font          - Font that will be displayed
//   Align         - Alignment of text on graphic
//   ImageLoc      - The object string location of the CGIgraphic image
//


function CgiGraphic(Text, OnColor, OffColor, Bgcolor, OffBgcolor, Width, Height, On, Font, Align, ImageLoc)
{
	this.Text = Text
	this.OnColor = OnColor
	this.OffColor = OffColor
	this.Bgcolor = Bgcolor
    this.OffBgcolor = OffBgcolor
	this.Width = Width
	this.Height = Height
	this.On	= On
	this.Font = Font
	this.Align = Align
	this.ImageLoc = ImageLoc
	this.ButtonOn = ButtonOn
	this.ButtonOff = ButtonOff
	this.DisplayCgiGraphic = DisplayCgiGraphic
	this.ClearGraphic = ClearGraphic
}

function ButtonOn()
{

	var CgiGraphic = ''
	CgiGraphic += "/cgi-lawson/textgif/"
	CgiGraphic += escape(this.Text)
 	CgiGraphic += "?color="
	CgiGraphic += this.OffColor
    if (this.Bgcolor)
    {	CgiGraphic += "&bgcolor="
    	CgiGraphic += this.Bgcolor
	}
	CgiGraphic += "&align="
    CgiGraphic += this.Align
	CgiGraphic += "&width="
	CgiGraphic += this.Width
	CgiGraphic += "&height="
	CgiGraphic += this.Height
    CgiGraphic += "&font="
    CgiGraphic += this.Font
	eval(this.ImageLoc + ".src=" + "'" + CgiGraphic + "'")
	this.On = false
}

function ButtonOff()
{

	var CgiGraphic = ''
	CgiGraphic += "/cgi-lawson/textgif/"
	CgiGraphic += escape(this.Text)
	CgiGraphic += "?color="
	CgiGraphic += this.OnColor
    if (this.OffBgcolor)
    {	CgiGraphic += "&bgcolor="
     	CgiGraphic += this.OffBgcolor
	}
    CgiGraphic += "&align="
    CgiGraphic += this.Align
	CgiGraphic += "&width="
	CgiGraphic += this.Width
	CgiGraphic += "&height="
	CgiGraphic += this.Height
    CgiGraphic += "&font="
	CgiGraphic += this.Font
	eval(this.ImageLoc + ".src=" + "'" + CgiGraphic + "'")
	this.On = true
}

function ClearGraphic()
{
	var CgiGraphic = ''
	CgiGraphic += "/cgi-lawson/textgif/"
	CgiGraphic += "%20"
	CgiGraphic += "?color="
	if (this.On == true)
	    CgiGraphic += this.OnColor
	else
	    CgiGraphic += this.OffColor
	
	if (this.Bgcolor)
	{
    	CgiGraphic += "&bgcolor="
	    if (this.On == true)
    	   CgiGraphic += this.Bgcolor
	    else    
    	    CgiGraphic += this.OffBgcolor
    }
   	CgiGraphic += "&align="
   	CgiGraphic += this.Align
	CgiGraphic += "&width="
	CgiGraphic += this.Width
	CgiGraphic += "&height="
	CgiGraphic += this.Height
    CgiGraphic += "&font="
    CgiGraphic += this.Font
	eval(this.ImageLoc + ".src=" + "'" + CgiGraphic + "'")
	this.On = false

}
function DisplayCgiGraphic()
{
	var CgiGraphic = ''
	CgiGraphic += "/cgi-lawson/textgif/"
	CgiGraphic += escape(this.Text)
	CgiGraphic += "?color="
	if (this.On == true)
		CgiGraphic += this.OnColor
	else
		CgiGraphic += this.OffColor
	CgiGraphic += "&bgcolor="
	if (this.On == true)
    	CgiGraphic += this.Bgcolor
	else    
	    CgiGraphic += this.OffBgcolor
	CgiGraphic += "&align="
	CgiGraphic += this.Align
	CgiGraphic += "&width="
	CgiGraphic += this.Width
	CgiGraphic += "&height="
	CgiGraphic += this.Height
	CgiGraphic += "&font="
	CgiGraphic += this.Font
	return CgiGraphic

}

