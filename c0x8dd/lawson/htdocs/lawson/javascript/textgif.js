//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
function TEXTGIFObject(text)
{
	this.protocol  = location.protocol;
	this.hostname  = location.host;
    this.progName  = "/cgi-lawson/textgif";
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		this.progName += CGIExt
    else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				this.progName += opener.CGIExt
	this.text      = text;
    this.font      = null;   //default is "medium"
    this.width     = null;
    this.height    = null;
    this.inpixels  = true;   //width & height in pixels or fixed character width & height
    this.align     = null;   //default is "left"
    this.color     = null;   //default is "black" in 6-digit hexadecimal
    this.bgcolor   = null;   //default is transparent also in 6-digit hexadecimal
    this.retimgtag = true;   //will return image tag if so desired '<IMG SRC=......'>
    this.imagename = null;   //can only be used if retimgtag=true, the name of the image
    this.imgborder = false;  
    this.imgaltmsg = null;

    this.TEXTGIFBuild = TEXTGIFBuild
}

function TEXTGIFBuild()
{
var object   = this;
var tagStr   = ""
var urlStr   = object.protocol + "//" + object.hostname + object.progName + "/" + escape(object.text) + "?"
var urlSep   = "&";
var parmsStr = "";

	if (object.font != null && object.font.length > 0)
    {
    	if (object.font.toLowerCase() == "tiny"
        ||  object.font.toLowerCase() == "small"
        ||  object.font.toLowerCase() == "medium"
        ||  object.font.toLowerCase() == "large"
        ||  object.font.toLowerCase() == "giant")
        	parmsStr += "font=" + object.font.toLowerCase()
    }
	if (object.width != null && object.width.length > 0)
    {
    	parmsStr += urlSep + "width=" + object.width
        if (!object.inpixels)
        	parmsStr += "c"
    }	
	if (object.height != null && object.height.length > 0)
    {
    	parmsStr += urlSep + "height=" + object.height
        if (!object.inpixels)
        	parmsStr += "c"
    }	
	if (object.align != null && object.align.length > 0)
    {
    	if (object.align.toLowerCase() == "left"
        ||  object.align.toLowerCase() == "right"
        ||  object.align.toLowerCase() == "center")
        	parmsStr += urlSep + "align=" + object.align.toLowerCase()
    }
	if (object.color != null && object.color.length > 0 && object.color.length < 7)
		parmsStr += urlSep + "color=" + object.color
	if (object.bgcolor != null && object.bgcolor.length > 0 && object.bgcolor.length < 7)
		parmsStr += urlSep + "bgcolor=" + object.bgcolor

	if (object.retimgtag)
    {
    	tagStr += "<IMG "
    	if (object.imgborder)
    		tagStr += "BORDER=1 "
		if (object.imgaltmsg != null && object.imgaltmsg.length > 0)
    		tagStr += "ALT='" + object.imgaltmsg + "' " 
    	tagStr += "SRC="
    }
    
    tagStr += urlStr + parmsStr

	if (object.retimgtag)
    {
        if (object.imagename != null && object.imagename.length > 0)
        	tagStr += ' NAME="' + object.imagename + '"'
	   	tagStr += ">"
    }

    return tagStr
}

function TEXTGIF(object)
{
	return object.TEXTGIFBuild();
}

