//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/smloganflds.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
function elmObject(RetName, DspName, Size, Type)
{
    this.RetName = RetName
    this.DspName = DspName
    this.Size = Size
    this.Type = Type
}

function getFront(mainStr, searchStr)
{
    foundOffset = mainStr.indexOf(searchStr)
    if (foundOffset == -1)
        return null;
    else
        return mainStr.substring(0, foundOffset);
}

function getEnd(mainStr, searchStr)
{
    foundOffset = mainStr.indexOf(searchStr)
    if (foundOffset == -1)
        return null;
    else
        return mainStr.substring(foundOffset+searchStr.length, mainStr.length);
}

function replaceStrs(inputStr, fromStr, toStr)
{
    if (inputStr.length == 0)
        return "";

    var resultStr = inputStr;
    var front = getFront(resultStr, fromStr);
    var end = getEnd(resultStr, fromStr);
    while (front != null && end != null)
    {
        resultStr = front + toStr + end;
        var front = getFront(resultStr, fromStr);
        var end = getEnd(resultStr, fromStr);
    }
    return resultStr;
}


function loganObject()
{
    for (i = 0; i < loganObject.arguments.length; i++)
    {
        this[i] = loganObject.arguments[i]
    }
}

