//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/chart.js,v 1.2.24.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
//
// Javascript object to call DBChartApplet
//
var gProtocol = location.protocol
var gHost     = location.host
var theblank = (gProtocol=='http:')?'about:blank':'/lawson/dot.htm';  //dpb 07-11-01 SSL Issue

function callCHART(string, frameStr)
{
   // alert("DEBUG: Calling callCHART(" + string + "," + frameStr + ")");
   var w = window.open(theblank, frameStr)	//dpb 07-03-01
   w.document.write(string)
   w.document.close()
}

function CHARTObject(productLine, fileName)
{
   this.codebase='/lawson/java/ ARCHIVE="jchart.jar"'
   this.CODE = 'lawson.jchart.DBChartApplet.class'
   this.width = '500'
   this.height = '350'
   this.dmePath = '/cgi-lawson/dme'
   if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
      this.dmePath += CGIExt
   else
      if (opener != null)
   		if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
			this.progName += opener.CGIExt
   this.chartType = 'pie,hbar,vbar,hstackbar,vstackbar,line'
   this.style3D = null
   this.productLine = productLine
   this.fileName = fileName
   this.protocol = gProtocol
   this.host = gHost
   this.noTitle = true
   this.noMail = true
   this.noPublish = true
   this.noLogo = true
   this.indexName = null
   this.keyValue = null
   this.categoryField = null
   this.valueField = null
   this.valueField1 = null
   this.totalOp = null
   this.periodType = null
   this.dateField = null
   this.periodEnd = null
   this.sortAscend = null
   this.sortDescend = null
   this.selectExpr = null
   this.condition = null
   this.drillField = null
   this.title = null

   this.showGrid = null
   this.gridColor = null
   this.chartBgImage = null
   this.componentBgColor = "9fb6cd"
   this.chartBgColor = null
   this.chartTitle = null
   this.showLegend = null
   this.legendFont = null
   this.legendTitle = null
   this.legendBorder = null
   this.dataset0GlobalValueColor = null
   this.tickSize = null
   this.titleFont = null
   this.debug = false
}

function CHARTBuild(object)
{
   // Build the applet code string
   var app = '<table border=4 BorderColor="red"><tr><td><applet codebase=' + object.codebase
   app += ' CODE=' + object.CODE
   app += ' width=' + object.width
   app += ' height=' + object.height
   app += '>\n'
   app += '<param name="dmePath"       value="' + object.dmePath + '">\n'
   app += '<param name="chartType"     value="' + object.chartType + '">\n'
   app += '<param name="productLine"   value="' + object.productLine + '">\n'
   app += '<param name="fileName"      value="' + object.fileName + '">\n'

   // Data related attributes
   if (object.indexName != null && object.indexName.length > 0)
      app += '<param name="indexName"    value="' + object.indexName + '">\n'
   if (object.keyValue != null && object.keyValue.length > 0)
      app += '<param name="keyValue"     value="'
         + escape(object.keyValue) + '">\n'
   if (object.categoryField != null && object.categoryField.length > 0)
      app += '<param name="categoryField" value="'
         + object.categoryField + '">\n'
   if (object.valueField != null && object.valueField.length > 0)
      app += '<param name="valueField"   value="' + object.valueField + '">\n'
   if (object.totalOp != null && object.totalOp.length > 0)
      app += '<param name="totalOp"      value="' + object.totalOp + '">\n'
   if (object.periodType != null && object.periodType.length > 0)
      app += '<param name="periodType"      value="' + object.periodType + '">\n'
   if (object.dateField != null && object.dateField.length > 0)
      app += '<param name="dateField"    value="' + object.dateField + '">\n'
   if (object.periodEnd != null && object.periodEnd.length > 0)
      app += '<param name="periodEnd"    value="'
         + escape(object.periodEnd) + '">\n'
   if (object.selectExpr != null && object.selectExpr.length > 0)
      app += '<param name="selectExpr"   value="'
         + escape(object.selectExpr) + '">\n'
   if (object.condition != null && object.condition.length > 0)
      app += '<PARAM NAME="condition"    value="'
	     + escape(object.condition) + '">\n'
   if (object.drillField != null && object.drillField.length > 0)
      app += '<PARAM NAME="drillField"    value="' + object.drillField + '">\n'
   if (object.sortAscend != null && object.sortAscend.length > 0)
      app += '<PARAM NAME="sortAscend"    value="' + object.sortAscend + '">\n'
   if (object.sortDescend != null && object.sortDescend.length > 0)
      app += '<PARAM NAME="sortDescend"    value="' + object.sortDescend + '">\n'

   // Cosmetic attributes
   if (object.showGrid != null && object.showGrid.length > 0)
      app += '<param name="showGrid"     value="' + object.showGrid + '">\n'
   if (object.style3D != null && object.style3D.length > 0)
      app += '<param name="3D"            value="' + object.style3D  + '">\n'
   if (object.gridColor != null && object.gridColor.length > 0)
      app += '<param name="gridColor"     value="' + object.gridColor + '">\n'
   if (object.chartBgImage != null && object.chartBgImage.length > 0)
      app += '<param name="chartBgImage"  value="' + object.chartBgImage + '">\n'
   if (object.componentBgColor != null && object.componentBgColor.length > 0)
      app += '<param name="componentBgColor"  value="'
         + object.componentBgColor + '">\n'
   if (object.chartBgColor != null && object.chartBgColor.length > 0)
      app += '<param name="chartBgColor"  value="' + object.chartBgColor + '">\n'
   if (object.chartTitle != null && object.chartTitle.length > 0)
      app += '<PARAM NAME="chartTitle"    value="' + object.chartTitle + '">\n'
   if (object.showLegend != null && object.showLegend.length > 0)
      app += '<param name="showLegend"    value="' + object.showLegend + '">\n'
   if (object.legendFont != null && object.legendFont.length > 0)
      app += '<param name="legendFont"    value="' + object.legendFont + '">\n'
   if (object.legendTitle != null && object.legendTitle.length > 0)
      app += '<param name="legendTitle"   value="' + object.legendTitle + '">\n'
   if (object.legendBorder != null && object.legendBorder.length > 0)
      app += '<param name="legendBorder"  value="' + object.legendBorder + '">\n'
   if (object.tickSize != null && object.tickSize.length > 0)
      app += '<param name="tickSize"      value="' + object.tickSize + '">\n'
   if (object.titleFont != null && object.titleFont.length > 0)
      app += '<param name="titleFont"    value="' + object.titleFont + '">\n'
   
   app += '</applet></table>'
   // Build the window open string
   var dataopen = '<HTML><title>' + object.fileName + ' Chart</title>\n'
   dataopen += '<body bgcolor=#' + object.componentBgColor + ' link=maroon vlink=black>\n'
   if (! object.noLogo)
      dataopen += '<img border=0 src=/lawson/logan/smloganlt.gif><br>\n'

   if (! object.noMail)
   {
      // Build the mail argument string
      var MailArgStr = object.protocol + '//' + object.host + object.dmePath + '?'
      MailArgStr += 'PROD=' + object.productLine
      MailArgStr += '%26FILE=' + object.fileName + '%26OUT=CHART' 
      MailArgStr += '%26FIELD=' + object.categoryField
      if (object.valueField != null && object.valueField.length > 0)
         MailArgStr += ';' + object.valueField
      if (object.selectExpr != null && object.selectExpr.length > 0)
         MailArgStr += '%26SELECT=' + escape(object.selectExpr)
      if (object.indexName != null && object.indexName.length > 0)
         MailArgStr += '%26INDEX=' + object.indexName
      if (object.keyValue != null && object.keyValue.length > 0)
         MailArgStr += '%26KEY=' + escape(object.keyValue)
      if (object.condition != null && object.condition.length > 0)
         MailArgStr += '%26COND=' + escape(object.condition)
      if (object.totalOp != null && object.totalOp.length > 0)
         MailArgStr += '%26TOTAL=' + escape(object.totalOp)
      if (object.periodType != null && object.periodType.length > 0)
         MailArgStr += '%26PERIOD=' + escape(object.periodType)
      if (object.periodEnd != null && object.periodEnd.length > 0)
         MailArgStr += '%26PERIODEND=' + escape(object.periodEnd)
      if (object.dateField != null && object.dateField.length > 0)
         MailArgStr += '%26DATEFIELD=' + escape(object.dateField)

      dataopen += '<a href=mailto:?subject=Logan%20' + object.fileName
      dataopen += '%20document%20' + MailArgStr + '>Mail Chart</a><br>\n'
   }

   if (! object.noPublish)
   {
      var PubArgStr = object.protocol + '//' + object.host + object.dmePath + '?PUB&'
      PubArgStr += 'PROD=' + object.productLine + '&FILE='
      PubArgStr += object.fileName + '&OUT=CHART' 
      PubArgStr += '&FIELD=' + object.categoryField
      if (object.valueField != null && object.valueField.length > 0)
         PubArgStr += ';' + object.valueField
      if (object.selectExpr != null && object.selectExpr.length > 0)
         PubArgStr += '&SELECT=' + escape(object.selectExpr)
      if (object.indexName != null && object.indexName.length > 0)
         PubArgStr += '&INDEX=' + object.indexName
      if (object.keyValue != null && object.keyValue.length > 0)
         PubArgStr += '&KEY=' + escape(object.keyValue)
      if (object.condition != null && object.condition.length > 0)
         PubArgStr += '&COND=' + escape(object.condition)
      if (object.totalOp != null && object.totalOp.length > 0)
         PubArgStr += '&TOTAL=' + escape(object.totalOp)
      if (object.periodType != null && object.periodType.length > 0)
         PubArgStr += '&PERIOD=' + escape(object.periodType)
      if (object.periodEnd != null && object.periodEnd.length > 0)
         PubArgStr += '&PERIODEND=' + escape(object.periodEnd)
      if (object.dateField != null && object.dateField.length > 0)
         PubArgStr += '&DATEFIELD=' + escape(object.dateField)

      dataopen += '<a href=' + PubArgStr + '>Publish Chart</a>\n'
      dataopen += '<br><br><br>\n'
   }

   if (! object.noTitle)
   {
      // If no title provided build the document title
      if (object.title == null)
      {
		if (object.valueField != null && object.valueField.length > 0)
		{
			if (object.totalOp != null && object.totalOp.length > 0)
			{
				object.title = 'Chart of '
				if (object.periodType != null && object.periodType.length > 0)
					object.title += object.periodType + ' Totals of '
				object.title += object.valueField + ' (' +
					object.totalOp + ') by ' + object.categoryField
			}
			else
			{
				object.title = 'Chart of ' + object.valueField + ' by '
					+ object.categoryField
			}
        }
		else
		{
            object.title = 'Chart of number of ' + object.fileName
               + ' records by ' + object.categoryField
		}
      }
   
//      dataopen += '\n<font size=6 color=maroon>' + object.title
//      dataopen += '</font><br><br><br>\n'
   }

   dataopen += app + '<p></html>'

   if (object.debug)
	{
		alert(dataopen)
	}

   return dataopen
}

function CHART(object, frameStr)
{
   callCHART(CHARTBuild(object), frameStr);
}

