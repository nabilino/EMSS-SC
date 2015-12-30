//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/loganfields.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
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

var clickedimgname = ''

function ImgOver(imgname)
{
    if (imgname == clickedimgname)
    {
        return;
    }
    window.program.document.images[imgname].src="/lawson/logan/" + imgname + "2.gif"
}

function ImgOut(imgname)
{
    if (imgname == clickedimgname)
    {
        return;
    }
    window.program.document.images[imgname].src="/lawson/logan/" + imgname + ".gif"
}

function ImgClick(imgname)
{
    if (imgname == clickedimgname)
    {
        return;
    }
    window.program.document.images[imgname].src="/lawson/logan/" + imgname + "3.gif"
    if (clickedimgname != '')
    {
        window.program.document.images[clickedimgname].src="/lawson/logan/" + clickedimgname + ".gif"
    }
    clickedimgname = imgname
}

function ClrDspFlds()
{
    if (fDspGraph || fDspInds || fDspImport || fDspSelect)
    {
        DspPrimFlds()
    }
    if (nDspFlds == 1)
    {
        alert('All clear')
        return
    }
    for (var i = 0; i < window.display.document.ff.ff.length; i++)
    {
        window.display.document.ff.ff[i].order = ""
        window.display.document.ff.ff[i].checked = false
    }
    nDspFlds = 1
    DspFldString = ''

    PrtRptFlds(-1, 0)

    window.program.document.images['report'].src="/lawson/logan/report.gif"
    window.program.document.images['form'].src="/lawson/logan/form.gif"
    window.program.document.images['sheet'].src="/lawson/logan/sheet.gif"

    window.program.document.images['totals'].src="/lawson/logan/totals.gif"

    window.program.document.images['count'].src="/lawson/logan/count.gif"

    window.program.document.images['export'].src="/lawson/logan/export.gif"

    window.program.document.images['import'].src="/lawson/logan/import.gif"

    window.program.document.images['save'].src="/lawson/logan/save.gif"

    window.program.document.images['clear'].src="/lawson/logan/clear3.gif"
}

var DspFldString    = ''
var NewDspFldString = ''
var DspFldChecked   = -1
function PrtRptFlds(fldsub, option)
{
    window.rptflds.document.open()
    window.rptflds.document.clear()

    if (nDspFlds > 1)
    {
        var RptFldTxt = '<html><body background=/lawson/images/backgrou/back3.gif><table cellpadding=5 cellspacing=10><tr>'
        DspFldArray = DspFldString.split(",")
        if (option == 1)
        {
            if (nDspFlds == 2)
            {
                RptFldTxt += '<td>'
                RptFldTxt += '<a href="javascript:parent.PrtRptFlds(' + sub + ',1)">'
                RptFldTxt += '<b><font color=white>' + DspFldArray[sub] + '</font></b>'
                RptFldTxt += '</a>'
                RptFldTxt += '</td>'
                RptFldTxt += '</tr></table>'
                RptFldTxt += '</body></html>'

                window.rptflds.document.write(RptFldTxt)
                window.rptflds.document.close()
                return
            }
            if (DspFldChecked != fldsub)
            {
                DspFldChecked = fldsub
            }
            else
            {
                DspFldChecked = -1
            }
        }
        for (var sub = 0; sub < DspFldArray.length; sub++)
        {
            RptFldTxt += '<td>'
            RptFldTxt += '<a href="javascript:parent.PrtRptFlds(' + sub + ',1)">'
            RptFldTxt += '<b><font color=white>' + DspFldArray[sub] + '</font></b>'
            RptFldTxt += '</a>'
            RptFldTxt += '</td>'
        }
        if (option == 1)
        {
            RptFldTxt += '</tr><tr>'

            for (var sub = 0; sub < DspFldArray.length; sub++)
            {
                RptFldTxt += '<td align=center>'
                if (DspFldChecked == sub)
                {
                    RptFldTxt += '<a href="javascript:parent.MoveLeft(' + sub + ')">'
                    RptFldTxt += '<img border=0 src=/lawson/logan/lefta.gif></a>'
                    RptFldTxt += '<img border=0 src=/lawson/logan/trans.gif>'
                    RptFldTxt += '<a href="javascript:parent.MoveRight(' + sub + ')">'
                    RptFldTxt += '<img border=0 src=/lawson/logan/righta.gif></a>'
                }
                else
                {
                    RptFldTxt += ' '
                }
                RptFldTxt += '</td>'
            }
        }
        RptFldTxt += '</tr></table>'
    }
    else
    {
        var RptFldTxt = '<html><body background=/lawson/images/backgrou/back3.gif><img border=0 src=/lawson/logan/logan.gif>'
    }
    RptFldTxt += '</body></html>'

    window.rptflds.document.write(RptFldTxt)
    window.rptflds.document.close()
}

function MoveLeft(fldsub)
{
    var NewFldName = ''
    NewDspFldString = ''

    window.rptflds.document.open()
    window.rptflds.document.clear()

    var RptFldTxt = '<html><body background=/lawson/images/backgrou/back3.gif><table cellpadding=5 cellspacing=10><tr>'
    DspFldArray = DspFldString.split(",")
    for (var sub = 0; sub < DspFldArray.length; sub++)
    {
        if (fldsub == 0)
        {
            var NewFldName = DspFldArray[sub]
            sub++
            break
        }
        if ((fldsub - 1) == sub)
        {
            var NewFldName = DspFldArray[sub]
            break
        }
        RptFldTxt += '<td>'
        RptFldTxt += '<a href="javascript:parent.PrtRptFlds(' + sub + ',1)">'
        RptFldTxt += '<b><font color=white>' + DspFldArray[sub] + '</font></b>'
        RptFldTxt += '</a>'
        RptFldTxt += '</td>'
        if (sub == 0)
        {
            NewDspFldString += DspFldArray[sub]
        }
        else
        {
            NewDspFldString += ',' + DspFldArray[sub]
        }
    }
    if (fldsub != 0)
    {
        var tmpsub    = sub
        DspFldChecked = sub
        sub++
        RptFldTxt += '<td>'
        RptFldTxt += '<a href="javascript:parent.PrtRptFlds(' + tmpsub + ',1)">'
        RptFldTxt += '<b><font color=white>' + DspFldArray[sub] + '</font></b>'
        RptFldTxt += '</a>'
        RptFldTxt += '</td>'

        if (tmpsub == 0)
        {
            NewDspFldString += DspFldArray[sub]
        }
        else
        {
            NewDspFldString += ',' + DspFldArray[sub]
        }
        RptFldTxt += '<td>'
        RptFldTxt += '<a href="javascript:parent.PrtRptFlds(' + sub + ',1)">'
        RptFldTxt += '<b><font color=white>' + NewFldName + '</font></b>'
        RptFldTxt += '</a>'
        RptFldTxt += '</td>'
        NewDspFldString += ',' + NewFldName
        sub++
    }
    for ( ; sub < DspFldArray.length; sub++)
    {
        RptFldTxt += '<td>'
        RptFldTxt += '<a href="javascript:parent.PrtRptFlds(' + sub + ',1)">'
        RptFldTxt += '<b><font color=white>' + DspFldArray[sub] + '</font></b>'
        RptFldTxt += '</a>'
        RptFldTxt += '</td>'
        if ((fldsub == 0) && (sub == 1))
        {
            NewDspFldString += DspFldArray[sub]
        }
        else
        {
            NewDspFldString += ',' + DspFldArray[sub]
        }
    }
    if (fldsub == 0)
    {
        RptFldTxt += '<td>'
        RptFldTxt += '<a href="javascript:parent.PrtRptFlds(' + sub + ',1)">'
        RptFldTxt += '<b><font color=white>' + NewFldName + '</font></b>'
        RptFldTxt += '</a>'
        RptFldTxt += '</td>'
        NewDspFldString += ',' + NewFldName
        DspFldChecked = DspFldArray.length - 1
    }
    RptFldTxt += '</tr><tr>'

    NewDspFldArray = NewDspFldString.split(",")
    for (var sub = 0; sub < NewDspFldArray.length; sub++)
    {
        RptFldTxt += '<td align=center>'
        if (DspFldChecked == sub)
        {
            RptFldTxt += '<a href="javascript:parent.MoveLeft(' + sub + ')">'
            RptFldTxt += '<img border=0 src=/lawson/logan/lefta.gif></a>'
            RptFldTxt += '<img border=0 src=/lawson/logan/trans.gif>'
            RptFldTxt += '<a href="javascript:parent.MoveRight(' + sub + ')">'
            RptFldTxt += '<img border=0 src=/lawson/logan/righta.gif></a>'
        }
        else
        {
            RptFldTxt += ' '
        }
        RptFldTxt += '</td>'
    }
    RptFldTxt += '</tr></table>'
    RptFldTxt += '</body></html>'

    window.rptflds.document.write(RptFldTxt)
    window.rptflds.document.close()

    DspFldString = ''
    DspFldString = NewDspFldString
}

function MoveRight(fldsub)
{
    var NewFldName = ''
    NewDspFldString = ''

    window.rptflds.document.open()
    window.rptflds.document.clear()

    var RptFldTxt = '<html><body background=/lawson/images/backgrou/back3.gif><table cellpadding=5 cellspacing=10><tr>'
    DspFldArray = DspFldString.split(",")
    for (var sub = 0; sub < DspFldArray.length; sub++)
    {
        if (fldsub == (DspFldArray.length - 1))
        {
            NewFldName = DspFldArray[DspFldArray.length - 1]
            break
        }
        if (fldsub == sub)
        {
            NewFldName = DspFldArray[sub]
            break
        }
        RptFldTxt += '<td>'
        RptFldTxt += '<a href="javascript:parent.PrtRptFlds(' + sub + ',1)">'
        RptFldTxt += '<b><font color=white>' + DspFldArray[sub] + '</font></b>'
        RptFldTxt += '</a>'
        RptFldTxt += '</td>'
        if (sub == 0)
        {
            NewDspFldString += DspFldArray[sub]
        }
        else
        {
            NewDspFldString += ',' + DspFldArray[sub]
        }
    }
    if (fldsub != (DspFldArray.length - 1))
    {
        var tmpsub = sub
        sub++
        DspFldChecked = sub

        RptFldTxt += '<td>'
        RptFldTxt += '<a href="javascript:parent.PrtRptFlds(' + tmpsub + ',1)">'
        RptFldTxt += '<b><font color=white>' + DspFldArray[sub] + '</font></b>'
        RptFldTxt += '</a>'
        RptFldTxt += '</td>'

        if (tmpsub == 0)
        {
            NewDspFldString += DspFldArray[sub]
        }
        else
        {
            NewDspFldString += ',' + DspFldArray[sub]
        }
        RptFldTxt += '<td>'
        RptFldTxt += '<a href="javascript:parent.PrtRptFlds(' + sub + ',1)">'
        RptFldTxt += '<b><font color=white>' + NewFldName + '</font></b>'
        RptFldTxt += '</a>'
        RptFldTxt += '</td>'
        NewDspFldString += ',' + NewFldName
        sub++

        for ( ; sub < DspFldArray.length; sub++)
        {
            RptFldTxt += '<td>'
            RptFldTxt += '<a href="javascript:parent.PrtRptFlds(' + sub + ',1)">'
            RptFldTxt += '<b><font color=white>' + DspFldArray[sub] + '</font></b>'
            RptFldTxt += '</a>'
            RptFldTxt += '</td>'
            NewDspFldString += ',' + DspFldArray[sub]
        }
    }
    else
    {
        RptFldTxt += '<td>'
        RptFldTxt += '<a href="javascript:parent.PrtRptFlds(' + sub + ',1)">'
        RptFldTxt += '<b><font color=white>' + NewFldName + '</font></b>'
        RptFldTxt += '</a>'
        RptFldTxt += '</td>'
        NewDspFldString += NewFldName
        DspFldChecked = sub

        for ( ; sub < DspFldArray.length - 1; sub++)
        {
            RptFldTxt += '<td>'
            RptFldTxt += '<a href="javascript:parent.PrtRptFlds(' + sub + ',1)">'
            RptFldTxt += '<b><font color=white>' + DspFldArray[sub] + '</font></b>'
            RptFldTxt += '</a>'
            RptFldTxt += '</td>'
            NewDspFldString += ',' + DspFldArray[sub]
        }
    }
    RptFldTxt += '</tr><tr>'

    for (var sub = 0; sub < DspFldArray.length; sub++)
    {
        RptFldTxt += '<td align=center>'
        if (DspFldChecked == sub)
        {
            RptFldTxt += '<a href="javascript:parent.MoveLeft(' + sub + ')">'
            RptFldTxt += '<img border=0 src=/lawson/logan/lefta.gif></a>'
            RptFldTxt += '<img border=0 src=/lawson/logan/trans.gif>'
            RptFldTxt += '<a href="javascript:parent.MoveRight(' + sub + ')">'
            RptFldTxt += '<img border=0 src=/lawson/logan/righta.gif></a>'
        }
        else
        {
            RptFldTxt += ' '
        }
        RptFldTxt += '</td>'
    }
    RptFldTxt += '</tr></table>'
    RptFldTxt += '</body></html>'

    window.rptflds.document.write(RptFldTxt)
    window.rptflds.document.close()

    DspFldString = ''
    DspFldString = NewDspFldString
}

var fDspGraph  = 0
var fDspInds   = 0
var fDspImport = 0

var fDspSelect = 0

var GblIndNbr  = 1
var KeyRng     = ''
var KeyVal     = ''
var FldVal     = ''
var LeftIndex  = new Array(0, 0, 0, 0)
var OperIndex  = new Array(0, 0, 0, 0)
var RightField = new Array('', '', '', '')
var JoinIndex  = new Array(0, 0, 0)

function DspOrder(FormSub)
{
    var FldMoved = 0
    NewDspFldString = ''

    if (nDspFlds > 11
    &&	window.display.document.ff.ff[FormSub].checked)
    {
        window.display.document.ff.ff[FormSub].checked = 0
        alert('Maximum number of fields selected for document')
        return
    }
    if (nDspFlds > 1)
    {
        DspFldArray = DspFldString.split(",")
        for (var sub = 0; sub < DspFldArray.length; sub++)
        {
            if (DspFldArray[sub] != window.display.document.ff.ff[FormSub].value)
            {
                if (FldMoved == 0)
                {
                    NewDspFldString += DspFldArray[sub]
                    FldMoved = 1
                }
                else
                {
                    NewDspFldString += ',' + DspFldArray[sub]
                }
            }
        }
    }
    if (window.display.document.ff.ff[FormSub].checked)
    {
        if (nDspFlds > 1)
        {
            NewDspFldString += ',' + window.display.document.ff.ff[FormSub].value
        }
        else
        {
            NewDspFldString += window.display.document.ff.ff[FormSub].value
        }
        nDspFlds++
    }
    else
    {
        nDspFlds--
    }
    DspFldString = ''
    DspFldString = NewDspFldString
        PrtRptFlds(DspFldChecked, 0)
}

// ------------------
function ClrFldVals()
{
    FldVal = ''
	for (var i = 0; i < 4; i++)
	{
    	window.display.document.sel.elements[i*4].selectedIndex = 0;
    	window.display.document.sel.elements[(i*4)+1].selectedIndex = 0;
    	window.display.document.sel.elements[(i*4)+2].value = "";
		if (i != 3)
    		window.display.document.sel.elements[(i*4)+3].selectedIndex = 0;
	}
}

function SetFldVals()
{
    FldVal = ''
	for (var i = 0; i < 4; i++)
	{
    	LeftIndex[i] = window.display.document.sel.elements[i*4].selectedIndex;
    	var LeftFld = window.display.document.sel.elements[i*4][LeftIndex[i]].value;
    	var NewLeftFld = replaceStrs(LeftFld, "_", "-");
    	OperIndex[i] = window.display.document.sel.elements[(i*4)+1].selectedIndex;
    	RightField[i] = window.display.document.sel.elements[(i*4)+2].value;
    	var TmpRightField = replaceStrs(RightField[i], " ", "+");
		if (LeftFld != "" && TmpRightField == "")
		{
			alert('Must enter a value field for ' + LeftFld)
			FldVal = ''
			return
		}
    	if (LeftIndex[i] > 0)
        	FldVal += NewLeftFld + window.display.document.sel.elements[(i*4)+1][OperIndex[i]].value + TmpRightField
		if (i != 3)
		{
			JoinIndex[i] = window.display.document.sel.elements[(i*4)+3].selectedIndex;
			if (JoinIndex[i] != 0)
				FldVal += window.display.document.sel.elements[(i*4)+3][JoinIndex[i]].value
		}
	}	/* end for */
    DspPrimFlds()
}

function ClrIndVals(SetIndNbr)
{
    GblIndNbr = 1

    KeyRng = ''

    with (window.display.document)
    for (var i = 0; i < (indflds.length); i++)
    {
        indflds.elements[i].value = ""
    }
}

function SetIndVals(SetIndNbr)
{
    GblIndNbr = SetIndNbr

    KeyRng = ''

    with (window.display.document)
    for (var i = 0; i < (indflds.length); i++)
    {
        KeyVal = ''
        if (indflds.elements[i].value != "")
        {
//          alert('KeyVal=' + KeyVal)
            if (i == 0)
            {
                KeyRng += escape(indflds.elements[i].value)
            }
            else
            {
                KeyRng += '=' + escape(indflds.elements[i].value)
            }
        }
    }
        DspPrimFlds()
}

    var IndNbr = 1

function DspIndHdr(dir,BegIndNbr)
{
    var	IndHdrTxt = ''

    if (dir != 2)
    {
        if (indexes[0] == 1)
        {
            return
        }
    }
    else
    {
        IndNbr = BegIndNbr
    }
    if (dir == 1)
    {
        if (IndNbr < indexes[0])
        {
            IndNbr++
        }
        else
        {
            IndNbr = 1
        }
    }
    if (dir == 0)
    {
        if (IndNbr == 1)
        {
            IndNbr = indexes[0]
        }
        else
        {
            IndNbr--
        }
    }
    window.display.document.open()
    window.display.document.clear()

    IndHdrTxt += '<body bgcolor=#cccccc><center><form name=indhdr>'
    IndHdrTxt += '<input name=prvind type=button'
    IndHdrTxt += ' onClick=parent.DspIndHdr(0,parent.IndNbr)'
    IndHdrTxt += ' value="  <  "> '
    IndHdrTxt += '  <input name=nxtind type=button'
    IndHdrTxt += ' onClick=parent.DspIndHdr(1,parent.IndNbr)'
    IndHdrTxt += ' value="  >  ">  '
    IndHdrTxt += '  </form><pre>'
    IndHdrTxt += '<br><font size=4 color=black>Search By</pre>'
    window.display.document.write(IndHdrTxt)

    var	IndFldTxt = ''

    IndFldTxt += '<form name=indflds>'
    IndFldTxt += '<center><table border=1>'

    KeyRngArray = KeyRng.split("=")
    var sub = 0

    for (var i = 2; i < (indexes[IndNbr][1] + 2); i++)
    {
        IndFldTxt += '<tr><td align=left>'
        IndFldTxt += '<font color=black>'
        IndFldTxt += indexes[IndNbr][i].DspName
        IndFldTxt += '</font></td>'
        IndFldTxt += '<td><input name='
        if ((IndNbr == GblIndNbr) && (sub < KeyRngArray.length))
        {
            IndFldTxt += indexes[IndNbr][i].RetName + ' type=text value="' + KeyRngArray[sub] + '" size='
        }
        else
        {
            IndFldTxt += indexes[IndNbr][i].RetName + ' type=text value="" size='
        }
        IndFldTxt += indexes[IndNbr][i].Size + '>'
        IndFldTxt += '</td></tr>'
        sub++
    }
    IndFldTxt += '</table><center></form><br><form name=indopts>'
    IndFldTxt += '<input name=ok type=button'
    IndFldTxt += ' onClick=parent.SetIndVals(parent.IndNbr)'
    IndFldTxt += ' value="  Ok  "> '
    IndFldTxt += '<input name=clear type=button'
    IndFldTxt += ' onClick=parent.ClrIndVals(parent.IndNbr)'
    IndFldTxt += ' value=Clear> '
    IndFldTxt += '<input name=cancel type=button'
    IndFldTxt += ' onClick=parent.DspPrimFlds()'
    IndFldTxt += ' value=Cancel> '
    IndFldTxt += '</form></body>'
    window.display.document.write(IndFldTxt)
    window.display.document.close()

    fDspGraph  = 0
    fDspInds   = 1
    fDspImport = 0
    fDspSelect = 0
}

function DspProgFlds()
{
    var	ProgFldTxt = ''

	window.program.document.open()
    window.program.document.clear()

    ProgFldTxt = '<body background=/lawson/images/backgrou/back3.gif><center>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<a href=javascript:parent.getDspFields(1) onClick=parent.ImgClick("report") onmouseOver=parent.ImgOver("report") onmouseOut=parent.ImgOut("report")>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<img name=report  border=0 src=/lawson/logan/report.gif></a>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<a href=javascript:parent.getDspFields(2) onClick=parent.ImgClick("form") onmouseOver=parent.ImgOver("form") onmouseOut=parent.ImgOut("form")>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<img name=form border=0 src=/lawson/logan/form.gif></a>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<a href=javascript:parent.getDspFields(8) onClick=parent.ImgClick("sheet") onmouseOver=parent.ImgOver("sheet") onmouseOut=parent.ImgOut("sheet")>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<img name=sheet border=0 src=/lawson/logan/sheet.gif>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<a href=javascript:parent.getDspFields(3) onClick=parent.ImgClick("totals") onmouseOver=parent.ImgOver("totals") onmouseOut=parent.ImgOut("totals")>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<img name=totals border=0 src=/lawson/logan/totals.gif></a>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<a href=javascript:parent.getDspFields(6) onClick=parent.ImgClick("count") onmouseOver=parent.ImgOver("count") onmouseOut=parent.ImgOut("count")>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<img name=count border=0 src=/lawson/logan/count.gif></a>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<a href=javascript:parent.getDspFields(4) onClick=parent.ImgClick("export") onmouseOver=parent.ImgOver("export") onmouseOut=parent.ImgOut("export")>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<img name=export border=0 src=/lawson/logan/export.gif></a>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<a href=javascript:parent.DspImpFile() onmouseOver=parent.ImgOver("import") onmouseOut=parent.ImgOut("import")>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<img name=import border=0 src=/lawson/logan/import.gif></a>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<a href=javascript:parent.getDspFields(7) onClick=parent.ImgClick("save") onmouseOver=parent.ImgOver("save") onmouseOut=parent.ImgOut("save")>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<img name=save border=0 src=/lawson/logan/save.gif></a>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<a href=javascript:parent.ClrDspFlds() onmouseOver=parent.ImgOver("clear") onmouseOut=parent.ImgOut("clear")>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<img name=clear border=0 src=/lawson/logan/clear.gif></a>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<a target=filelist href="/cgi-lawson/custsel'
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		ProgFldTxt += CGIExt
	else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				ProgFldTxt += CGIExt
	ProgFldTxt += '?' + LcProdLine + '&' + LcFileName + '">'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '<img name=custom border=0 src=/lawson/logan/grey.gif></a>'
	window.program.document.writeln(ProgFldTxt)
    ProgFldTxt = '</body>'
	window.program.document.writeln(ProgFldTxt)
    window.program.document.close()
}

function DspCustom()
{
	var dataopen = '/cgi-lawson/custsel'
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		dataopen += CGIExt
	else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				dataopen += CGIExt
	dataopen += '?' + LcProdLine + '+' + LcFileName
	window.open(dataopen, 'filelist')
}

function DspImpFile()
{
    var	ImpFileTxt = ''

    window.display.document.open()
    window.display.document.clear()

    ImpFileTxt += '<body><center>Import File Name<br><form enctype="multipart/form-data" METHOD=POST ACTION="/cgi-lawson/import'
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		ImpFileTxt += CGIExt
	else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				ImpFileTxt += CGIExt
	ImpFileTxt += '?' + LcProdLine + '+' + LcFileName + '">'
    ImpFileTxt += '<input name=impfile type=file><br><br>'
    ImpFileTxt += '<input name=ok type=submit value=OK>  '
    ImpFileTxt += '<input name=cancel type=button'
    ImpFileTxt += ' onClick=parent.DspPrimFlds()'
    ImpFileTxt += ' value=Cancel>  '
    ImpFileTxt += '</form></body>'
    ImpFileTxt += '<script>'
    ImpFileTxt += 'this.document.forms[0].elements[0].focus()'
    ImpFileTxt += '</scr'
    ImpFileTxt += 'ipt>'
    window.display.document.write(ImpFileTxt)
    window.display.document.close()

    fDspGraph  = 0
    fDspInds   = 0
    fDspImport = 1
    fDspSelect = 0
}

function DispCond()
{
    var DspCnd = ''
    var NewDspCnd = ''
    for (var i = 0; i < window.cond.document.cf.cnd.length; i++)
    {
        if (window.cond.document.cf.cnd[i].selected)
        {
            if (i == 0)
            {
				alert ('No Condition Selected')
                break
            }
            DspCnd = window.cond.document.cf.cnd[i].value
            NewDspCnd = replaceStrs(DspCnd, "_", "-")
            DspCnd = ''
            DspCnd = replaceStrs(NewDspCnd, " ", "-")
            NewDspCnd = ''
            NewDspCnd = DspCnd.toUpperCase()
//			var dataopen = '/cgi-bin/syscall/darwebview61+filecndelm.t+-k+' + UpperProd + '+' + UpperFile + NewDspCnd + '?ENM=cli'
			alert ('Not implemented yet')
//			window.open(dataopen, 'dspcond', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizeable=no,width=250,height=200')
        }
    }
}

function Run(option, prodline, filename, index, dspfields, keyrng, fldval, cnds, nbrrecs, excldrill)
{
	var TmpOpen = ''
	var dmeScript = '/cgi-lawson/dme'
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		dmeScript += CGIExt
	else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				dmeScript += CGIExt

    if (option == 1)
    {
//		alert(filename + index + dspfields + keyrng + fldval + cnds)
		var dataopen = dmeScript + '?INDEX=' + index + '&PROD=' + prodline + '&FILE=' + filename + dspfields + keyrng + fldval + cnds + nbrrecs + excldrill
//		alert (dataopen)
		TmpOpen = window.open(dataopen, 'report', 'toolbar=no,location=no,directories=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=760,height=500,left=10,top=50,alwaysRaised=yes')
		TmpOpen.focus()
    }
    else
    if (option == 2)
    {
		var dataopen = dmeScript + '?OUT=FORM&INDEX=' + index + '&PROD=' + prodline + '&FILE=' + filename + dspfields + keyrng + fldval + cnds + nbrrecs + excldrill
//		alert (dataopen)
		TmpOpen = window.open(dataopen, 'report', 'toolbar=yes,location=no,directories=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=760,height=500')
		TmpOpen.focus()
    }
    else
    if (option == 3)
    {
		var dataopen = dmeScript + '?OUT=TOTALS&INDEX=' + index + '&PROD=' + prodline + '&FILE=' + filename + dspfields + keyrng + fldval + cnds + nbrrecs
//		alert (dataopen)
		TmpOpen = window.open(dataopen, 'report', 'toolbar=yes,location=no,directories=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=760,height=500')
		TmpOpen.focus()
    }
    else
    if (option == 4)
    {
		var dataopen = dmeScript + '?OUT=EXPORT&INDEX=' + index + '&PROD=' + prodline + '&FILE=' + filename + dspfields + keyrng + fldval + cnds + nbrrecs
		window.open(dataopen, 'rptflds')
    }
    else
    if (option == 6)
    {
        if (nDspFlds > 1)
        {
		    var dataopen = dmeScript + '?OUT=COUNT&INDEX=' + index + '&PROD=' + prodline + '&FILE=' + filename + dspfields + keyrng + fldval + cnds + nbrrecs
        }
        else
        {
		    var dataopen = dmeScript + '?OUT=COUNT&INDEX=' + index + '&PROD=' + prodline + '&FILE=' + filename + keyrng + fldval + cnds + nbrrecs
        }
//		alert (dataopen)
		TmpOpen = window.open(dataopen, 'report', 'toolbar=yes,location=no,directories=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=300,height=150')
		TmpOpen.focus()
    }
    else
    if (option == 7)
    {
        var netsite = dspfields + keyrng + fldval + cnds + nbrrecs
        if (!populated)
            var loganname = ''
        if (loganname == '')
        {
            loganname = prompt('Enter a name for your document', '')
        }
        if (loganname == null)
        {
            return
        }
        prodline.toUpperCase()
        filename.toUpperCase()
        var TmpFld = replaceStrs(loganname, " ", "+")
        var dataopen = '/cgi-lawson/svlogan'
		if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
			dataopen += CGIExt
		else
			if (opener != null)
				if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
					dataopen += CGIExt
		dataopen += '?PROD=' + prodline + '+FILE=' + filename + '+%22LOGAN=' + TmpFld + '%22+INDEX=' + index + '+' + netsite
        window.open(dataopen, 'rptflds')
    }
    else
    if (option == 8)
    {
		var dataopen = dmeScript + '?OUT=SS&INDEX=' + index + '&PROD=' + prodline + '&FILE=' + filename + dspfields + keyrng + fldval + cnds + nbrrecs + excldrill
//		alert (dataopen)
		var Width = (((nDspFlds + 1) * 100) + 35)
		TmpOpen = window.open(dataopen, 'report', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=' + Width + ',height=500')
		TmpOpen.focus()
    }
    else
    if (option == 9)
    {
		var dataopen = dmeScript + '?OUT=FORM&INDEX' + index + '&PROD=' + prodline + '&FILE=' + filename + dspfields + keyrng + fldval + cnds + nbrrecs + excldrill
//		alert (dataopen)
		TmpOpen = window.open(dataopen, 'rptflds')
//		TmpOpen = window.open(dataopen, 'report', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=' + Width + ',height=500')
		TmpOpen.focus()
    }
}

function SaveChart()
{
    var xaxis = ''
    var yaxis = ''
    for (var i = 0; i < window.display.document.defgraph.catfld.length; i++)
    {
        if (window.display.document.defgraph.catfld[i].selected)
        {
            var CatFldName = ''
            CatFldName = window.display.document.defgraph.catfld[i].value
            var CatNewFldName = replaceStrs(CatFldName, "_", "-")
            xaxis += CatNewFldName
            break
        }
    }
    if (xaxis == '')
    {
        alert('Must select a category field')
        return
    }
    for (var i = 0; i < window.display.document.defgraph.valfld.length; i++)
    {
        if (window.display.document.defgraph.valfld[i].selected)
        {
            var ValFldName = window.display.document.defgraph.valfld[i].value
            var ValNewFldName = replaceStrs(ValFldName, "_", "-")
            yaxis += ValNewFldName
            break
        }
    }

    var TmpKeyRng = ''
    if (KeyRng != '')
    {
        TmpKeyRng += '+-k+'
        TmpKeyRng += KeyRng
    }
    var TmpFldVal = ''
    if (FldVal != '')
    {
        TmpFldVal += '+-v+'
        TmpFldVal += FldVal
    }
    var Condition = ''
    var NewCondition = ''
    for (var i = 0; i < window.cond.document.cf.cnd.length; i++)
    {
        if (window.cond.document.cf.cnd[i].selected)
        {
            if (i == 0)
                break

            Condition = window.cond.document.cf.cnd[i].value
            NewCondition = replaceStrs(Condition, "_", "-")
            Condition = ''
            Condition = replaceStrs(NewCondition, " ", "-")
            NewCondition = ''
            NewCondition = '+-a+' + Condition
            break
        }
    }
    var chartname = ''
    if (chartname == '')
    {
        chartname = prompt('Enter a name for your chart', '')
    }
    if (chartname == null)
    {
        return
    }
    var TmpFld = replaceStrs(chartname, " ", "+")
    var TmpChartName = '"' + TmpFld + '"'
	var dataopen = '/cgi-lawson/svchart'
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		dataopen += CGIExt
	else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				dataopen += CGIExt
	dataopen += '?' + LcProdLine + '+' + LcFileName + '+' + TmpChartName + '+-c+' + xaxis
    if (yaxis != '')
    {
	    dataopen += '+-f+' + yaxis
    }
	dataopen += TmpKeyRng + TmpFldVal + NewCondition
//	alert (dataopen)
//	window.open(dataopen, 'rptflds', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=760,height=500')
	window.open(dataopen, 'rptflds')
}
function CallChart()
{
var theblank = (window.location.protocol=='http:')?'about:blank':'/lawson/dot.htm';  //dpb 07-11-01 SSL Issue
    var xaxis = ''
    var yaxis = ''
    for (var i = 0; i < window.display.document.defgraph.catfld.length; i++)
    {
        if (window.display.document.defgraph.catfld[i].selected)
        {
            var CatFldName = ''
            CatFldName = window.display.document.defgraph.catfld[i].value
            var CatNewFldName = replaceStrs(CatFldName, "_", "-")
            xaxis += CatNewFldName
            break
        }
    }
    if (xaxis == '')
    {
        alert('Must select a category field')
        return
    }
    for (var i = 0; i < window.display.document.defgraph.valfld.length; i++)
    {
        if (window.display.document.defgraph.valfld[i].selected)
        {
            var ValFldName = window.display.document.defgraph.valfld[i].value
            var ValNewFldName = replaceStrs(ValFldName, "_", "-")
            yaxis += ValNewFldName
            break
        }
    }

    var Condition = ''
    var NewCondition = ''
    for (var i = 0; i < window.cond.document.cf.cnd.length; i++)
    {
        if (window.cond.document.cf.cnd[i].selected)
        {
            if (i == 0)
                break

            Condition = window.cond.document.cf.cnd[i].value
            NewCondition = replaceStrs(Condition, "_", "-")
            Condition = ''
            Condition = replaceStrs(NewCondition, " ", "-")
            NewCondition = ''
            NewCondition = '' + Condition
            break
        }
    }

    var chartcall = new CHARTObject(LcProdLine, LcFileName)
    chartcall.categoryField = xaxis
    chartcall.valueField = yaxis
    chartcall.selectExpr = FldVal
    chartcall.noMail = false;
    chartcall.noPublish = false;
    chartcall.noLogo = false;
    chartcall.keyValue = KeyRng;
    chartcall.condition = NewCondition;
    chartcall.indexName = indexes[GblIndNbr][0];
	chartcall.componentBgColor = 'cccccc'

    w=window.open(theblank, "report", 'toolbar=no,location=no,directories=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=760,height=500')
    CHART(chartcall, "report")
    w.document.close();
    // DspChart( location.host, LcProdLine, LcFileName, xaxis, yaxis, FldVal)
}

function loganObject()
{
    for (var i = 0; i < loganObject.arguments.length; i++)
    {
        this[i] = loganObject.arguments[i]
    }
}

