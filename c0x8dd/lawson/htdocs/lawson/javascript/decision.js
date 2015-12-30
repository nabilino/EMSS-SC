//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/decision.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
// This is a window for any kind of message
// The input is the message string you want displayed
// AND (Optional) The window size - height (arg2) and width (arg3) 300 by 300 is the default.
// The output is a window with your html message displayed

function DecisionWin(Msg)
{
var theblank = (window.location.protocol=='http:')?'about:blank':'/lawson/dot.htm';  //dpb 07-11-01 SSL Issue
var argv  = DecisionWin.arguments;
var argc  = DecisionWin.arguments.length;
var WinH  = (argc > 1) ? argv[1] : null;
var WinW  = (argc > 2) ? argv[2] : null;
var Focal = ""
    if (argc > 3)
        Focal = argv[3]

var WinHW = ""

    if (WinH == "")
        WinH = 300
    if (WinW == "")
        WinW = 300    
    WinWH = eval("'height=" + WinH + ",width=" + WinW + "'")   
    decwin      = window.open(theblank, 'decwin',WinWH) 

    theDecisionMessage(Msg,Focal)

    return true
}

function theDecisionMessage(SMsg,SFocal)
{
var prtmsg=''

    prtmsg += SMsg

    decwin.document.write(prtmsg)	

    if (SFocal != "")
        decwin.X = SFocal
}



