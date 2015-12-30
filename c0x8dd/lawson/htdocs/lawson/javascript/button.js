//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/button.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
function ButtonObj(param)
{
var Name       = ''
var Index      = -1 
var ObjectType = 'F'
var ObjectLoc  = ''
var Func       = ''
var AltMsg     = ''
var textwImg   = ''
var rghtOfImg  = true
var overrideStyle = ''
var useStyle   = true
var useMouse   = true
var useStatBar = true
var border     = false
var startDim   = false
var GraphicLoc = ''
var OnGraphic  = ''
var OffGraphic = ''
var DimGraphic = ''
var Width      = 0
var Height     = 0
var useCGI     = false
var text	   = ''
var onTxtColor = 'AA0039'
var offTxtColor= '000000'
var dimTxtColor= '808080'
var textFont   = 'medium'
var textAlign  = 'center'

var paramLst  = param.split('|')
var NbrParams = paramLst.length

    for (var i=0;i<NbrParams;i++)
		if (paramLst[i].indexOf("=") != -1)
           	eval(paramLst[i])

//alert ("Name="+Name+"  Index="+Index+"  ObjectLoc="+ObjectLoc+"  Func="+Func+"  AltMsg="+AltMsg+"  useStyle="+useStyle+"  useMouse="+useMouse)
//alert ("useStatBar="+useStatBar+"  border="+border+"  startDim="+startDim+"  GraphicLoc="+GraphicLoc+"  OnGraphic="+OnGraphic+"  OffGraphic="+OffGraphic+"  DimGraphic="+DimGraphic+"  Width="+Width+"  Height="+Height)
	
var ButtonErr = false
var srcNm     = ''
    if (Name == '')
    {
    	alert("ERROR:  Need a Name for the Button Object")
        ButtonErr = true
    }
    if (ObjectLoc == '')
    {
    	alert("ERROR:  Need a location (most likely a frame name) of the Button Object")
        ButtonErr = true
    }
    if (!useStyle
    &&  OffGraphic == '')
    {
    	alert("ERROR:  If Styles are not being used need at least a OFF Graphic Image")
        ButtonErr = true
    }
    
    if (!ButtonErr)
    {
    	srcNm  = Name
		if (Index > -1)
    		srcNm = srcNm + Index

		eval(srcNm + 'Button = new Button("' + Name + '",' + Index + ',"' + ObjectType + '","' + ObjectLoc + '","' + Func + '","' + AltMsg + '",' + useStyle + ',"' + overrideStyle + '",' + useMouse + ',' + useStatBar + ',' + border + ',' + startDim + ',"' + GraphicLoc + '","' + OnGraphic + '","' + OffGraphic + '","' + DimGraphic + '",' + Width + ',' + Height + ',' + useCGI + ',"' + text + '","' + onTxtColor + '","' + offTxtColor + '","' + dimTxtColor + '","' + textFont + '","' + textAlign + '","' + textwImg + '",' + rghtOfImg + ')')

		return eval('window.' + srcNm + 'Button.DisplayButton()')
	}
    else
    	return "ERROR"
}

function Button(Name, Index, ObjectType, ObjectLoc, Func, AltMsg, useStyle, overrideStyle, useMouse, useStatBar, border, startDim, GraphicLoc, OnGraphic, OffGraphic, DimGraphic, Width, Height, useCGI, text, onTxtColor, offTxtColor, dimTxtColor, textFont, textAlign, textwImg, rghtOfImg)
{
var tmpL = 0

	this.On = false
	this.Dim = startDim
    this.ObjectLoc = ObjectLoc

	this.useStyle = useStyle
    this.overrideStyle = overrideStyle
    this.Style = 'style1'
    if (this.useStyle == true)
    {
    	if (this.overrideStyle != '')
        	this.Style = this.overrideStyle
        else
    	if (typeof(authUser) != 'undefined')
    	{
    		if (authUser.style != null
    		&&  authUser.style.length > 0)
    			this.Style = authUser.style
    	}
    }
	this.Name = Name
    this.Index = Index
    this.ObjectType = ObjectType
	this.Width = Width
	this.Height = Height
    this.border = border
    this.useCGI = useCGI
    this.text = text
    this.onTxtColor = onTxtColor
    this.offTxtColor = offTxtColor
    this.dimTxtColor = dimTxtColor
    this.textFont = textFont
    this.textAlign = textAlign
    if (this.useStyle == true)
    {
		this.GraphicLoc = '/lawson/images/lawson'
       	this.OffGraphic = getGraphic(this) 
        if (this.OffGraphic == 'Error')
        {
        	this.useCGI = true
            this.OffGraphic = 'FFFFFF'
            this.OnGraphic = 'FFFFFF'
            this.DimGraphic = 'FFFFFF'
            this.border = true
        	if (this.text == '')
            	this.text = this.Name
        }
        else
        {
        	tmpL = this.OffGraphic.length - 5
       		this.OnGraphic = this.OffGraphic.substring(0,tmpL) + "1.gif" 
       		this.DimGraphic = this.OffGraphic.substring(0,tmpL) + "2.gif"   
    	}
    }
    else
    {
		this.GraphicLoc = GraphicLoc
		this.OnGraphic  = OnGraphic
		this.OffGraphic = OffGraphic
		this.DimGraphic	= DimGraphic
    }
    this.AltMsg = AltMsg
    this.func = Func
    this.useMouse = useMouse
    this.useStatBar = useStatBar

	this.Pressed = Pressed
	this.UnPressed = UnPressed
	this.Shaded = Shaded
	this.Unshaded = Unshaded
	this.ToggleShades = ToggleShades
	this.ToggleOnOff = ToggleOnOff
	this.DisplayButton = DisplayButton

	this.textwImg = textwImg
	this.rghtOfImg = rghtOfImg
}

function fixString(passedStr)
{
var myStr = repStrs(passedStr,'%22','&quot;') 
    myStr = repStrs(myStr,'%26','&amp;') 
    myStr = repStrs(myStr,'%3C','&gt;') 
    myStr = repStrs(myStr,'%2E','&lt;') 
    myStr = repStrs(myStr,'%27',"\\'")

	return myStr
}

function getGraphic(obj)
{
var graphicStr = ''	
var tmpI       = ''
var tmpB	   = ''
var IconG      = false
var ButtG      = false
var passedType = ''

   	graphicStr = obj.Name 
   	graphicStr += "0.gif"

    return graphicStr
}


function Pressed()
{
var theSrc = ''
var theName = this.Name
	if (this.Index > -1)
    	theName += this.Index

  	this.On = true
	if (this.Dim == false)
    {
        if (this.useCGI)
        {
            theSrc  = "/cgi-lawson/textgif"
			if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
				theSrc += CGIExt
            theSrc += "/" + escape(this.text)
            theSrc += "?"

            theSrc += "color="
            if (this.onTxtColor != '')
                theSrc += this.onTxtColor
            else
                theSrc += '000000'
                     
            if (this.OnGraphic != '')
            {
                if (this.OnGraphic.indexOf(".gif") == -1)
                    theSrc += "&bgcolor=" + this.OnGraphic
                else
                {
                    theSrc += "&background=" 
                    if (this.GraphicLoc != '')
                        theSrc += this.GraphicLoc + '/'
                    if (this.useStyle)
                    {
                        if (theSrc    == ''
                        &&  this.Style != '')
                            theSrc += '/'
                        theSrc += this.Style + '/'
                    }
                    theSrc += this.OnGraphic
                }
            }

            theSrc += "&align=" + this.textAlign
            if (this.Width > 0)
                theSrc += "&width=" + this.Width
            if (this.Height > 0)
                theSrc += "&height=" + this.Height
            theSrc += "&font=" + this.textFont
        }
        else
        {
            if (this.GraphicLoc != '')
                theSrc = this.GraphicLoc + '/'
            if (this.useStyle)
            {
                if (theSrc    == ''
                &&  this.Style != '')
                    theSrc += '/'
                theSrc += this.Style + '/'
            }
        	theSrc += this.OnGraphic
        }
	    eval('window.' + this.ObjectLoc + ".document.images[\"" + theName + "B\"].src=" + "'" + theSrc + "'") 
	}
}

function UnPressed()
{
var theSrc = ''
var theName = this.Name
	if (this.Index > -1)
    	theName += this.Index

  	this.On = false
	if (this.Dim == false)
    {
        if (this.useCGI)
        {
            theSrc  = "/cgi-lawson/textgif"
			if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
				theSrc += CGIExt
            theSrc += "/" + escape(this.text)
            theSrc += "?"

            theSrc += "color="
            if (this.offTxtColor != '')
                theSrc += this.offTxtColor
            else
                theSrc += '000000'
                     
            if (this.OffGraphic != '')
            {
                if (this.OffGraphic.indexOf(".gif") == -1)
                    theSrc += "&bgcolor=" + this.OffGraphic
                else
                {
                    theSrc += "&background=" 
                    if (this.GraphicLoc != '')
                        theSrc += this.GraphicLoc + '/'
                    if (this.useStyle)
                    {
                        if (theSrc    == ''
                        &&  this.Style != '')
                            theSrc += '/'
                        theSrc += this.Style + '/'
                    }
                    theSrc += this.OffGraphic
                }
            }

            theSrc += "&align=" + this.textAlign
            if (this.Width > 0)
                theSrc += "&width=" + this.Width
            if (this.Height > 0)
                theSrc += "&height=" + this.Height
            theSrc += "&font=" + this.textFont
        }
        else
        {
            if (this.GraphicLoc != '')
                theSrc = this.GraphicLoc + '/'
            if (this.useStyle)
            {
                if (theSrc    == ''
                &&  this.Style != '')
                    theSrc += '/'
                theSrc += this.Style + '/'
            }
        	theSrc += this.OffGraphic
        }
	    eval('window.' + this.ObjectLoc + ".document.images[\"" + theName + "B\"].src=" + "'" + theSrc + "'") 
    }
}

function Shaded()
{
var theSrc = ''
var theName = this.Name
	if (this.Index > -1)
    	theName += this.Index

	this.Dim = true
    if (this.useCGI)
    {
        theSrc  = "/cgi-lawson/textgif"
		if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
			theSrc += CGIExt
        theSrc += "/" + escape(this.text)
        theSrc += "?"

        theSrc += "color="
        if (this.dimTxtColor != '')
            theSrc += this.dimTxtColor
        else
            theSrc += '000000'
                 
        if (this.DimGraphic != '')
        {
            if (this.DimGraphic.indexOf(".gif") == -1)
                theSrc += "&bgcolor=" + this.DimGraphic
            else
            {
                theSrc += "&background=" 
                if (this.GraphicLoc != '')
                    theSrc += this.GraphicLoc + '/'
                if (this.useStyle)
                {
                    if (theSrc    == ''
                    &&  this.Style != '')
                        theSrc += '/'
                    theSrc += this.Style + '/'
                }
                theSrc += this.DimGraphic
            }
        }

        theSrc += "&align=" + this.textAlign
        if (this.Width > 0)
            theSrc += "&width=" + this.Width
        if (this.Height > 0)
            theSrc += "&height=" + this.Height
        theSrc += "&font=" + this.textFont
    }
    else
    {
        if (this.GraphicLoc != '')
            theSrc = this.GraphicLoc + '/'
        if (this.useStyle)
        {
            if (theSrc    == ''
            &&  this.Style != '')
                theSrc += '/'
            theSrc += this.Style + '/'
        }
        theSrc += this.DimGraphic
    }
	eval('window.' + this.ObjectLoc + ".document.images[\"" + theName + "B\"].src=" + "'" + theSrc + "'") 
}

function Unshaded()
{
var theSrc = ''
var theGraphic = ''
var theTxtColor = ''
var theName = this.Name
	if (this.Index > -1)
    	theName += this.Index

	this.Dim = false
    if (this.On)
    {
	    theGraphic  = this.OnGraphic
        theTxtColor = this.onTxtColor
    }
	else
    {
	    theGraphic  = this.OffGraphic
        theTxtColor = this.offTxtColor
    }
    if (this.useCGI)     
    {
        theSrc += "/cgi-lawson/textgif"
		if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
			theSrc += CGIExt
        theSrc += "/" + escape(this.text)
        theSrc += "?"

        theSrc += "color="
        if (theTxtColor != '')
            theSrc += theTxtColor
        else
            theSrc += '000000'
                 
        if (this.DimGraphic != '')
        {
            if (this.DimGraphic.indexOf(".gif") == -1)
                theSrc += "&bgcolor=" + theGraphic
            else
            {
                theSrc += "&background=" 
                if (this.GraphicLoc != '')
                    theSrc = this.GraphicLoc + '/'
                if (this.useStyle)
                {
                    if (theSrc    == ''
                    &&  this.Style != '')
                        theSrc += '/'
                    theSrc += this.Style + '/'
                }
                theSrc += theGraphic
            }
        }

        theSrc += "&align=" + this.textAlign
        if (this.Width > 0)
            theSrc += "&width=" + this.Width
        if (this.Height > 0)
            theSrc += "&height=" + this.Height
        theSrc += "&font=" + this.textFont
    }
    else
    {
        if (this.GraphicLoc != '')
            theSrc = this.GraphicLoc + '/'
        if (this.useStyle)
        {
            if (theSrc    == ''
            &&  this.Style != '')
                theSrc += '/'
            theSrc += this.Style + '/'
        }
        theSrc += theGraphic
    }
	eval('window.' + this.ObjectLoc + ".document.images[\"" + theName + "B\"].src=" + "'" + theSrc + "'") 
}

function ToggleShades()
{
	if (this.Dim)
    	this.Unshaded()
    else
    	this.Shaded()
}

function ToggleOnOff()
{
	if (this.On)
    	this.Unpressed()
    else
    	this.Pressed()
}

function DisplayButton()
{
var obj           = this;
var GraphicString = '';
var	needSlashA    = false
var theSrc        = ''
var textColor     = ''
var bgColor       = ''
var wObj          = ''
var tmpAlt        = ''

var srcNm  = obj.Name
	if (obj.Index > -1)
    	srcNm += obj.Index

	if (obj.Name == null || obj.Name.length < 1)
    {
    	alert("Improper Button Name.\n Please refer to the 'button.js' document for more information.")
        return "Error";
    }

	if (obj.ObjectType != null && obj.ObjectType.length > 0)
    {
		if (obj.ObjectType.toUpperCase() == "W")
    		wObj = 'opener.'
    	else
    	if (obj.ObjectType.toUpperCase() == "S")
    		wObj = ''
    	else
    		wObj = 'parent.'
    }
    else
    	wObj = 'parent.'

	if ((obj.useMouse)
	||  (obj.func != null && obj.func.length > 0))
    {
    	needSlashA = true
		GraphicString  = '<a href=\"javascript:'

		if (obj.func != null && obj.func.length > 0)
			GraphicString += obj.func + '\" ' 
        else
        	GraphicString += 'void(true)\" '

		if (obj.AltMsg != null && obj.AltMsg.length > 0)
        	tmpAlt = unescape(fixString(obj.AltMsg))

        if (obj.useMouse
        ||  obj.useStatbar)
        {
    		GraphicString += 'onMouseOver=\"'
            if (obj.useMouse)
    			GraphicString += wObj + srcNm + 'Button.Pressed();'
			if ((obj.useStatBar)
			&&  (obj.AltMsg != null && obj.AltMsg.length > 0))
    	    	GraphicString += "window.status=\'" + tmpAlt + "\';return true"
            GraphicString += '" '
    		GraphicString += 'onMouseOut=\"'
            if (obj.useMouse)
    			GraphicString += wObj + srcNm + 'Button.UnPressed();'
			if ((obj.useStatBar)
			&&  (obj.AltMsg != null && obj.AltMsg.length > 0))
    	    	GraphicString += "window.status=\'\';return true"
            GraphicString += '"'
        }
        GraphicString += '>'
    }
	if (obj.textwImg != ''
	&&  !obj.rghtOfImg)
		GraphicString += obj.textwImg

    GraphicString += '<img src='  
    if (!obj.useCGI)
    {
    	theSrc = ''
        if (obj.GraphicLoc != '')
        	theSrc = obj.GraphicLoc + '/'
        if (obj.useStyle)
        {
        	if (theSrc    == ''
        	&&  obj.Style != '')
            	theSrc += '/'
            theSrc += obj.Style + '/'
        }
        if (obj.Dim)
            theSrc += obj.DimGraphic
        else
        if (obj.On)
            theSrc += obj.OnGraphic
        else
            theSrc += obj.OffGraphic
        GraphicString += '"' + theSrc + '"'

        if (obj.Width > 0)
            GraphicString += ' width=' + obj.Width

        if (obj.Height > 0)
            GraphicString += ' height=' + obj.Height
    }
    else
    {
        GraphicString += "/cgi-lawson/textgif"
		if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
			theSrc += CGIExt
        GraphicString += "/" + escape(obj.text)
        GraphicString += "?"

        GraphicString += "color="
        if (obj.Dim)
            textColor += obj.dimTxtColor
        else
        if (obj.On)
            textColor += obj.onTxtColor
        else
            textColor += obj.offTxtColor
        if (textColor != '')
        	GraphicString += textColor
        else
        	GraphicString += '000000'
        		 
        if (obj.Dim)
            bgColor += obj.DimGraphic
        else
        if (obj.On)
            bgColor += obj.onGraphic
        else
            bgColor += obj.OffGraphic
        if (bgColor != '')
        {
			if (bgColor.indexOf(".gif") == -1)
        		GraphicString += "&bgcolor="
        	else
            {
        		GraphicString += "&background=" 
    			theSrc = ''
        		if (obj.GraphicLoc != '')
        			theSrc = obj.GraphicLoc + '/'
        		if (obj.useStyle)
        		{
        			if (theSrc    == ''
        			&&  obj.Style != '')
            			theSrc += '/'
            		theSrc += obj.Style + '/'
        		}
                GraphicString += theSrc
            }
        	GraphicString += bgColor
        }

        GraphicString += "&align=" + obj.textAlign
        if (obj.Width > 0)
	        GraphicString += "&width=" + obj.Width
        if (obj.Height > 0)
        	GraphicString += "&height=" + obj.Height
        GraphicString += "&font=" + obj.textFont
    }

	GraphicString += ' name=' + srcNm + 'B'

    if (obj.AltMsg != null && obj.AltMsg.length > 0) 
    	GraphicString += " alt=\"" + repStrs(tmpAlt,'\\',"") + "\""
    if (obj.border == true) 
    	GraphicString += ' border=1'
    else
    	GraphicString += ' border=0'

	GraphicString += '>'

	if (obj.textwImg != ''
	&&  obj.rghtOfImg)
		GraphicString += obj.textwImg

	if (needSlashA)
    	GraphicString += '</a>'

	return(GraphicString)
}


