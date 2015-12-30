//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/dspchart.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $

// Function to display a chart 
function DisplayChart(windowName,prod,file,xaxis,yaxis,select,cond,index,key) 
{
var theblank = (window.location.protocol=='http:')?'about:blank':'/lawson/dot.htm';  //dpb 07-11-01 SSL Issue
    // Build the mail argument string
    var MailArgStr = location.protocol + '//' + location.host + '/cgi-lawson/dme'
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		MailArgStr += CGIExt
	else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				MailArgStr += CGIExt
    MailArgStr += '?PROD=' + prod + '%26FILE=' + file + '%26OUT=CHART' 
    MailArgStr += '%26FIELD=' + xaxis
    if (yaxis != '') MailArgStr += ';' + yaxis
    if (select != '') MailArgStr += '%26SELECT=' + escape(select)
    if (index != '') MailArgStr += '%26INDEX=' + index
    if (key != '') MailArgStr += '%26KEY=' + escape(key)
    if (cond != '') MailArgStr += '%26COND=' + escape(cond)

    var PubArgStr = location.protocol + '//' + location.host + '/cgi-lawson/dme'
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		PubArgStr += CGIExt
	else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				PubArgStr += CGIExt

    PubArgStr += '?PROD=' + prod + '&FILE=' + file + '&OUT=CHART' 
    PubArgStr += '&FIELD=' + xaxis
    if (yaxis != '') PubArgStr += ';' + yaxis
    if (select != '') PubArgStr += '&SELECT=' + escape(select)
    if (index != '') PubArgStr += '&INDEX=' + index
    if (key != '') PubArgStr += '&KEY=' + escape(key)
    if (cond != '') PubArgStr += '&COND=' + escape(cond)

    // Build the window open string
    var dataopen = '<HTML><title>' + file + ' Chart</title>\n'
    dataopen += '<body bgcolor=#cccccc link=maroon vlink=black>\n'
    dataopen += '<img border=0 src=/lawson/logan/smloganlt.gif><br>\n'

    dataopen += '<a href=mailto:?subject=Logan%20'+file+'%20document%20' + MailArgStr + '>Mail Document</a><br>\n'
    dataopen += '<a href=' + PubArgStr + '&PUB>Publish Document</a>\n'
    dataopen += '<br><br><br>\n'

    if (yaxis != '')
        dataopen += '<font size=6 color=maroon>Chart of ' + xaxis + ' by ' + yaxis + '</a><br><br><br>\n'
    else
        dataopen += '<font size=6 color=maroon>Chart of number of ' + file + ' records by ' + xaxis + '</a><br><br><br>\n\n'

    dataopen += '<applet codebase=/lawson/java/ CODE=lawson.jchart.DBChartApplet.class WIDTH=500 HEIGHT=350>\n'
    dataopen += '<param name=chartType value=pie,hbar,vbar,hstackbar,vstackbar,line>\n'
    dataopen += '<param name=productLine value=' + prod + '>\n'
    dataopen += '<param name=fileName value=' + file + '>\n'
    dataopen += '<param name=categoryField value="' + xaxis + '">\n'

    if (yaxis != '')
        dataopen += '<param name=valueField value="' + yaxis + '">\n'

    if (select != '') 
        dataopen += '<param name=selectExpr value=' + escape(select) + '>\n'

    if (index != '')
        dataopen += '<param name=indexName value=' + index + '>\n'

    if (key != '')
        dataopen += '<param name=keyValue value=' + escape(key) + '>\n'

    if (cond != '')
        dataopen += '<param name=condition value=' + escape(cond) + '>\n'

    dataopen += '</applet><p></html>\n'

    // alert(dataopen);

//    w=window.open(theblank, windowName, 'toolbar=no,location=no,directories=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=760,height=500')
    w=window.open(theblank, windowName)
    w.document.write(dataopen);
    w.document.close();
}

// Scaled back function
function DspChart(base, prod, file, xaxis, yaxis, select, cond) 
{
// note that base arg is no longer used -- use location.host instead
   DisplayChart('report',prod, file, xaxis, yaxis, select, cond, '', '')
}

