//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/message.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
// This is a window for an adhoc message

// The input is the message string you want displayed

// AND (Optional) The window size - height (arg2) and width (arg3) 300 by 300 is the default.

// The output is a window with your html message displayed



function MessageWin(Msg)

{
var theblank = (window.location.protocol=='http:')?'about:blank':'/lawson/dot.htm';  //dpb 07-11-01 SSL Issue

var argv  = MessageWin.arguments;

var argc  = MessageWin.arguments.length;

var WinH  = (argc > 1) ? argv[1] : null;

var WinW  = (argc > 2) ? argv[2] : null;

var Focal = ""

    if (argc > 3)

        Focal = argv[3]

//  Focal = (argc > 3) ? argv[3] : ;

var WinHW = ""



    if (WinH == "")

        WinH = 300

    if (WinW == "")

        WinW = 300    

    WinWH = eval("'height=" + WinH + ",width=" + WinW + "'")   

    msgwin      = window.open(theblank, 'msgwin',WinWH) 

    Message(Msg,Focal,"")

    return true

}

function MessageWin2(Msg,WinH,WinW,Focal,JSroutine)

{
var theblank = (window.location.protocol=='http:')?'about:blank':'/lawson/dot.htm';  //dpb 07-11-01 SSL Issue
var WinHW = ""



    if (WinH == "")

        WinH = 300

    if (WinW == "")

        WinW = 300    

    WinWH = eval("'height=" + WinH + ",width=" + WinW + "'")   

    msgwin      = window.open(theblank, 'msgwin',WinWH) 

    Message(Msg,Focal,JSroutine)

    return true

}


function Message(SMsg,SFocal,JSroutine)

{

var prtmsg=''

 

    prtmsg += '<body>'

    prtmsg += '<center>'

    prtmsg += '<img src=/lawson/images/lawson/lawson2.gif><br><hr>'

    prtmsg += SMsg

    prtmsg += '<hr><br>'

    prtmsg += '<form name=MsgExitButton>'

    prtmsg += '<center>'

    if (SFocal != "")
    {
        prtmsg += '<input type=button value="    OK    " onClick="'
        if (JSroutine != '')
        	prtmsg += 'parent.' + JSroutine + ';'
        prtmsg += 'X.focus();X.select();window.close()">'  
    }
    else
    {
        prtmsg += '<input type=button value="    OK    " onClick="'
        if (JSroutine != '')
        	'parent.' + JSroutine + ';'
        prtmsg += 'window.close()">'    
    }
    prtmsg += '</form>'

    prtmsg += '</body>'



    msgwin.document.write(prtmsg)	

    if (SFocal != "")

        msgwin.X = SFocal



}



