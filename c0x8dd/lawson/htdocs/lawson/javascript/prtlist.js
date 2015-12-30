//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
var sortOrder = 0

monthNames = new Array(12)
monthNames[0] = "Jan"
monthNames[1] = "Feb"
monthNames[2] = "Mar"
monthNames[3] = "Apr"
monthNames[4] = "May"
monthNames[5] = "Jun"
monthNames[6] = "Jul"
monthNames[7] = "Aug"
monthNames[8] = "Sep"
monthNames[9] = "Oct"
monthNames[10] = "Nov"
monthNames[11] = "Dec"

function formatDateTime(strDate, strTime)
{
	var result = "undefined"
	if (parseInt(strDate) > 0)
	{
		result = monthNames[parseInt(strDate.substring(4, 6), 10) - 1] + " "
		result += strDate.substring(6,8) + ", "
		result += strDate.substring(0, 4) + " - "
		result += strTime.substring(0,2) + ":"
		result += strTime.substring(2, 4) + ":"
		result += strTime.substring(4, 6)
	}
	return result
}

// stuff "rows" of data for our pseudo-two-dimensional array
function userPrtFileInfo(userName, jobName, jobToken, jobDescription, prtFile, startDate, startTime){
	this.userName = userName
	this.jobName = jobName
	this.jobToken = jobToken
	this.jobDescription = jobDescription
	this.prtFile = prtFile
	this.startDate = startDate
	this.startTime = startTime
}


// fill text area object with data from selected planet
function showData(sortType, order)
{
	sortOrder = order
	if ( sortType == 0)
		userPrtFiles.sort(compareUser)
	else if ( sortType == 1)
		userPrtFiles.sort(compareJobName)
	else if ( sortType == 2)
		userPrtFiles.sort(compareToken)
	else if ( sortType == 3)
		userPrtFiles.sort(compareDescription)
	else if ( sortType == 4)
		userPrtFiles.sort(compareFileName)
	else if ( sortType == 5)
		userPrtFiles.sort(compareJobStart)
	else
		userPrtFiles.sort(compareJobStart)
	writeTable()
}

function setBackGround()
{
	var result = "<HTML>\n"
	result += "<BODY bgcolor=#cccccc>\n"
 	result += "</BODY>\n"
 	result += "</HTML>\n"
 	sortFrame.document.open()
	sortFrame.document.write(result)
	sortFrame.document.close()
}

function setFrame(userPrtFilesIndex)
{
	// Construct the URL from the prtFileArray
	
	location = webrptScriptName + "?_DTGT=&_FN=" + userPrtFiles[userPrtFilesIndex].prtFile
}

function writeTable()
{
 	window.tableFrame.document.open()
	var result = "<HTML>\n"
	result += "<HEAD>\n"
	result += "<META HTTP-EQUIV=\"Pragma\" CONTENT=\"No-Cache\">\n"
	result += "<META HTTP-EQUIV=\"Expires\" CONTENT=\"Mon, 01 Jan 1990 00:00:01 GMT\">\n"
	result += "<TITLE>Print Files</TITLE>\n"
	result += "</HEAD>\n"
	window.tableFrame.document.write(result)
	result = "<BODY bgcolor=#cccccc>\n"
	result += "<H2>Print Files for " + userName + "</H2>"
	result += "<FORM name=jobs>\n"
	result += "<TABLE BORDER=5>\n"
	result += "<TR>\n"

	result += "	<TD><A HREF='javascript:parent.showData(0, 0)' onMouseOver=\"window.status='Sort by Job Owner - Ascending';return  true\" onMouseOut=\"window.status='';result =  true\">"
	result += "<IMG SRC='/lawson/jobdef/upblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=TOP ALT=\"Sort by Job Owner - Ascending\">"
	result += "</A>Job Owner"
	result += "<A HREF='javascript:parent.showData(0, 1)' onMouseOver=\"window.status='Sort by Job Owner - Descending';return  true\" onMouseOut=\"window.status='';result =  true\">"
	result += "<BR><IMG SRC='/lawson/jobdef/downblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=BOTTOM ALT=\"Sort by Job Owner - Descending\"></TD>\n"

	result += " <TD><A HREF='javascript:parent.showData(1, 0)'>"
	result += "<IMG SRC='/lawson/jobdef/upblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=TOP ALT=\"Sort by Job Name - Ascending\">"
	result += "</A>Job Name<A HREF='javascript:parent.showData(1, 1)'>"
	result += "<BR><IMG SRC='/lawson/jobdef/downblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=BOTTOM ALT=\"Sort by Job Name - Descending\"></TD>\n"

	result += "	<TD><A HREF='javascript:parent.showData(2, 0)'>"
	result += "<IMG SRC='/lawson/jobdef/upblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=TOP ALT=\"Sort by Token - Ascending\">"
	result += "</A>Token<A HREF='javascript:parent.showData(2, 1)'>"
	result += "<BR><IMG SRC='/lawson/jobdef/downblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=BOTTOM ALT=\"Sort by Token - Descending\"></TD>\n"

	result += "	<TD><A HREF='javascript:parent.showData(3, 0)'>"
	result += "<IMG SRC='/lawson/jobdef/upblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=TOP ALT=\"Sort by Description - Ascending\">"
	result += "</A>Description<A HREF='javascript:parent.showData(3, 1)'>"
	result += "<BR><IMG SRC='/lawson/jobdef/downblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=BOTTOM ALT=\"Sort by Description - Descending\"></TD>\n"

	result += "	<TD><A HREF='javascript:parent.showData(4, 0)'>"
	result += "<IMG SRC='/lawson/jobdef/upblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=TOP ALT=\"Sort by File Name - Ascending\">"
	result += "</A>File Name<A HREF='javascript:parent.showData(4, 1)'>"
	result += "<BR><IMG SRC='/lawson/jobdef/downblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=BOTTOM ALT=\"Sort by File Name - Descending\"></TD>\n"

	result += "	<TD><A HREF='javascript:parent.showData(5, 0)'>"
	result += "<IMG SRC='/lawson/jobdef/upblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=TOP ALT=\"Sort by Creation Date - Ascending\">"
	result += "</A>Creation Date<A HREF='javascript:parent.showData(5, 1)'>"
	result += "<BR><IMG SRC='/lawson/jobdef/downblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=BOTTOM ALT=\"Sort by Creation Date - Descending\"></TD>\n"

	result += "	<TD><A HREF='javascript:parent.DelPrint()'>"
	result += "<IMG SRC='/lawson/jobdef/delete3.gif' HEIGHT=22 WIDTH=55 BORDER=0 ALT=\"Delete selected entries\"></A></TD>"

	window.tableFrame.document.write(result)

	for (var i = 0; i < userPrtFiles.length; i++)
	{
		result = "<TR>\n"
		result += "	<TD>" + userPrtFiles[i].userName + "</TD>\n"
		result += "	<TD>" + userPrtFiles[i].jobName + "</TD>\n"
		result += "	<TD>" + userPrtFiles[i].jobToken + "</TD>\n"
		result += "	<TD>" + userPrtFiles[i].jobDescription + "</TD>\n"
		result += "	<TD><A HREF='javascript:parent.setFrame(" + i + ")'>" + userPrtFiles[i].prtFile.substring(userPrtFiles[i].prtFile.lastIndexOf("/") + 1, userPrtFiles[i].prtFile.length) + "</A></TD>\n"
		result += "	<TD>" + formatDateTime(userPrtFiles[i].startDate, userPrtFiles[i].startTime) + "</TD>\n"
		result += "	<TD align=center><input name=job value=" + i + " type=checkbox></TD>\n"
		result += "</TR>\n"
		window.tableFrame.document.write(result)
	}
 	result = "</TABLE>\n"
 	result += "</FORM>\n"
 	result += "</BODY>\n"
 	result += "</HTML>\n"
	window.tableFrame.document.write(result)
	window.tableFrame.document.close()
}

function blank()
{
	return "<HTML></HTML>"
}

function compareUser(a, b)
{
 	if (sortOrder == 0)
 	{
 		if (a.userName > b.userName)
 			return 1
 		if (a.userName < b.userName)
 			return -1
 		return 0
 	}
 	else
 	{
 		if (a.userName < b.userName)
 			return 1
 		if (a.userName > b.userName)
 			return -1
 		return 0
 	}
}

function compareJobName(a, b)
{
 	if (sortOrder == 0)
 	{
 		if (a.jobName > b.jobName)
 			return 1
 		if (a.jobName < b.jobName)
 			return -1
 		return compareJobStart(a, b)
 	}
 	else
 	{
 		if (a.jobName < b.jobName)
 			return 1
 		if (a.jobName > b.jobName)
 			return -1
 		return compareJobStart(a, b)
 	}
}

function compareToken(a, b)
{
 	if (sortOrder == 0)
 	{
 		if (a.jobToken > b.jobToken)
 			return 1
 		if (a.jobToken < b.jobToken)
 			return -1
 		return 0
 	}
 	else
 	{
 		if (a.jobToken < b.jobToken)
 			return 1
 		if (a.jobToken > b.jobToken)
 			return -1
 		return 0
 	}
}

function compareDescription(a, b)
{
 	if (sortOrder == 0)
 	{
 		if (a.jobDescription > b.jobDescription)
 			return 1
 		if (a.jobDescription < b.jobDescription)
 			return -1
 		return 0
 	}
 	else
 	{
 		if (a.jobDescription < b.jobDescription)
 			return 1
 		if (a.jobDescription > b.jobDescription)
 			return -1
 		return 0
 	}
}

function compareFileName(a, b)
{
   aPrtFileName = a.prtFile.substring(a.prtFile.lastIndexOf("/") + 1, a.prtFile.length)
   bPrtFileName = b.prtFile.substring(b.prtFile.lastIndexOf("/") + 1, b.prtFile.length)
 	if (sortOrder == 0)
 	{
 		if (aPrtFileName > bPrtFileName)
 			return 1
 		if (aPrtFileName < bPrtFileName)
 			return -1
 		return 0
 	}
 	else
 	{
 		if (aPrtFileName < bPrtFileName)
 			return 1
 		if (aPrtFileName > bPrtFileName)
 			return -1
 		return 0
 	}
}

function compareJobStart(a, b)
{
 	if (sortOrder == 0)
 	{
 		if (a.startDate > b.startDate)
 			return 1
 		if (a.startDate < b.startDate)
 			return -1
  		if (a.startTime > b.startTime)
 			return 1
 		if (a.startTime < b.startTime)
 			return -1
 		return 0
 	}
	else
	{
 		if (a.startDate < b.startDate)
 			return 1
 		if (a.startDate > b.startDate)
 			return -1
  		if (a.startTime < b.startTime)
 			return 1
 		if (a.startTime > b.startTime)
 			return -1
 		return 0
 	}
}

function DelPrint()
{
   var jobstodel = false
   var jobstring = ''
   if (typeof(this.tableFrame.document.jobs.job.length) == "undefined")
	{
      if (this.tableFrame.document.jobs.job.checked)
      {
         jobstring += '&'
         jobstring += userPrtFiles[0].prtFile
         jobstodel = true
      }
	}
	else
	{
      for (var i = 0; i < this.tableFrame.document.jobs.job.length; i++)
      {
         if (this.tableFrame.document.jobs.job[i].checked)
         {
            jobstring += '&'
            jobstring += userPrtFiles[i].prtFile
            jobstodel = true
         }
      }
   }
   var dataopen = delprintScriptName + '?' + webUser + '&' + refreshTime + jobstring
   if (jobstodel == true)
   {
      window.open(dataopen, 'jobschd')
   }
}
