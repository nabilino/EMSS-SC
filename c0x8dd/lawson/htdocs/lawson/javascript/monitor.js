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
function userJobInfo(userName, jobName, jobNumber, jobDescription, startDate, startTime, endDate, endTime, status, prtFileArray){
	this.userName = userName
	this.jobName = jobName
	this.jobNumber = jobNumber
	this.jobDescription = jobDescription
	this.startDate = startDate
	this.startTime = startTime
	this.endDate = endDate
	this.endTime = endTime
	this.status = status
	this.prtFileArray = prtFileArray
}

function makeViewLogHref(statusText, jobIndex, anchorClass)
{
   var result= ""
	result = "<a CLASS=\"" + anchorClass + "\" HREF=\"" + viewLogScriptName + "?" + userJobs[jobIndex].jobName + "&" +userJobs[jobIndex].jobNumber + "\""
	result += " onMouseOver=\"window.status='View log entry for " + userJobs[jobIndex].jobName + "';return  true\""
	result += " onMouseOut=\"window.status='';result =  true\">" + statusText + "</a>\n"
	return result
}

function formatStatus(status, jobIndex)
{
   var result= ""
   if (parseInt(status, 10) == 0)
		result = makeViewLogHref("Running", jobIndex, "running")
   else if (parseInt(status, 10) == 1)
		result = makeViewLogHref("Suspended", jobIndex, "default")
	else if (parseInt(status, 10) == 30)
		result = makeViewLogHref("Waiting", jobIndex, "warning")
	else if (parseInt(status, 10) == 31)
		result = makeViewLogHref("Waiting on step", jobIndex, "warning")
	else if (parseInt(status, 10) == 32)
		result = makeViewLogHref("Waiting on time", jobIndex, "warning")
	else if (parseInt(status, 10) == 33)
		result = "<font color=yellow>Waiting on recovery</font>\n"
	else if (parseInt(status, 10) == 34)
		result = makeViewLogHref("Needs recovery", jobIndex, "error")
	else if (parseInt(status, 10) == 35)
		result = makeViewLogHref("Invalid parameters", jobIndex, "error")
	else if (parseInt(status, 10) == 36)
		result = makeViewLogHref("Queue not running", jobIndex, "default")
	else if (parseInt(status, 10) == 37)
		result = makeViewLogHref("Hold", jobIndex, "default")
	else if (parseInt(status, 10) == 60)
		result = makeViewLogHref("Skipped", jobIndex, "default")
	else if (parseInt(status, 10) == 61)
		result = makeViewLogHref("Recovery deleted", jobIndex, "default")
	else if (parseInt(status, 10) == 62)
		result = makeViewLogHref("Canceled", jobIndex, "default")
	else if (parseInt(status, 10) == 63)
		result = makeViewLogHref("Completed", jobIndex, "default")
	else
		result = makeViewLogHref(status, jobIndex, "default")
   
   return result
}

// fill text area object with data from selected planet
function showData(sortType, order)
{
	sortOrder = order
	if ( sortType == 0)
		userJobs.sort(compareUser)
	else if ( sortType == 1)
		userJobs.sort(compareJob)
	else if ( sortType == 2)
		userJobs.sort(compareJobStart)
	else if ( sortType == 3)
		userJobs.sort(compareJobEnd)
	else if ( sortType == 4)
		userJobs.sort(compareJobStatus)
	else if ( sortType == 5)
		userJobs.sort(compareJobName)
	else
		userJobs.sort(compareJobStart)
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

function setFrame(userJobsIndex, prtFileArrayIndex)
{
	// Construct the URL from the prtFileArray
	
	location = webrptScriptName + "?_DTGT=&_FN=" + userJobs[userJobsIndex].prtFileArray[prtFileArrayIndex]
}

var newWind = null

function closePrintFileWindow()
{
	// Close the window if it is open
	if (newWind && !newWind.closed)
	{
		newWind.close()
		newWind = null
	}
}

function showPrintFiles(arrayIndex)
{
var theblank = (window.location.protocol=='http:')?'about:blank':'/lawson/dot.htm';  //dpb 07-11-01 SSL Issue
	// If there are no jobs, don't display the window and put up an alert
	if (userJobs[arrayIndex].prtFileArray.length <= 0)
	{
		closePrintFileWindow()
		alert("No print files for " + userJobs[arrayIndex].jobName)
		return
	}
	
	
	// If there is one print file, display it immediately
	if (userJobs[arrayIndex].prtFileArray.length == 1)
	{
		setFrame(arrayIndex, 0)
		return
	}
	// For more than one print file, display a window with the list of print files.
	var output = ""
	// Check if the print file window already exists
	if (!newWind || newWind.closed)
	{
		newWind = window.open(theblank, "", "height=200,width=200,resizable,scrollbars")
	}
	else
	{
		newWind.focus()
	}
	output += "<HTML>\n"
	output += "<HEAD>\n"
	output += "<TITLE>Print Files</TITLE>\n"
	output += "</HEAD>\n"
	output += "<BODY bgcolor=#cccccc>\n"
	output += "<TABLE ALIGN=CENTER BORDER=5>\n"
	output += "<TR>\n"
	for (var i = 0; i < userJobs[arrayIndex].prtFileArray.length; i++)
	{
		output += "<TR>\n"
		output += "	<TD><A HREF='javascript:opener.setFrame(" + arrayIndex + "," + i + ");window.close()'>"
		output += userJobs[arrayIndex].prtFileArray[i].substring(userJobs[arrayIndex].prtFileArray[i].lastIndexOf("/") + 1, userJobs[arrayIndex].prtFileArray[i].length) + "</A></TD>\n"
		output += "</TR>\n"	
	}	
 	output += "</TABLE>\n"
 	output += "</BODY>\n"
 	output += "</HTML>\n"
	newWind.document.write(output)
	newWind.document.close()
}

function writeTable()
{
 	window.tableFrame.document.open()
	var result = "<HTML>\n"
	result += "<HEAD>\n"
	result += "<META HTTP-EQUIV=\"Pragma\" CONTENT=\"No-Cache\">\n"
	result += "<META HTTP-EQUIV=\"Expires\" CONTENT=\"Mon, 01 Jan 1990 00:00:01 GMT\">\n"
	result += "<TITLE>Job Monitor</TITLE>\n"
	// <LINK> hung IE 4.0
	// It has something to do with using javascript to write the HTML
	//result += '<LINK REL=STYLESHEET TYPE="text/css" HREF="/lawson/javascript/monitor.css" TITLE="anchorStyles">\n'
	result += '<STYLE TYPE="text/css">\n'
	result += "A.running:link {color: green}\n"
	result += "A.running:active {color: green}\n"
	result += "A.running:visited {color: green}\n"
	result += "A.warning:link {color: yellow}\n"
	result += "A.warning:active {color: yellow}\n"
	result += "A.warning:visited {color: yellow}\n"
	result += "A.error:link {color: red}\n"
	result += "A.error:active {color: red}\n"
	result += "A.error:visited {color: red}\n"
	result += "A.default:link {color: blue}\n"
	result += "A.default:active {color: blue}\n"
	result += "A.default:visited {color: blue}\n"
	result += "</STYLE>\n"
	result += "</HEAD>\n"
	window.tableFrame.document.write(result)
	result = "<BODY bgcolor=#cccccc onUnload=parent.closePrintFileWindow()>\n"
	result += "<H2>Job Queue for " + userName + "</H2>"
	result += "<FORM name=jobs>\n"
	result += "<TABLE BORDER=5>\n"
	result += "<TR>\n";
	result += "	<TD><A HREF='javascript:parent.showData(5, 0)' onMouseOver=\"window.status='Sort by Job Name - Ascending';return  true\" onMouseOut=\"window.status='';result =  true\">"
	result += "<IMG SRC='/lawson/jobdef/upblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=TOP ALT=\"Sort by Job Name - Ascending\">"
	result += "</A>Job Name"
	result += "<A HREF='javascript:parent.showData(5, 1)' onMouseOver=\"window.status='Sort by Job Name - Descending';return  true\" onMouseOut=\"window.status='';result =  true\">"
	result += "<BR><IMG SRC='/lawson/jobdef/downblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=BOTTOM ALT=\"Sort by Job Name - Descending\"></TD>\n"
	result += "	<TD><A HREF='javascript:parent.showData(1, 0)'>"
	result += "<IMG SRC='/lawson/jobdef/upblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=TOP ALT=\"Sort by Job Description - Ascending\">"
	result += "</A>Job Description<A HREF='javascript:parent.showData(1, 1)'>"
	result += "<BR><IMG SRC='/lawson/jobdef/downblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=BOTTOM ALT=\"Sort by Job Description - Descending\"></TD>\n"
	result += "	<TD><A HREF='javascript:parent.showData(2, 0)'>"
	result += "<IMG SRC='/lawson/jobdef/upblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=TOP ALT=\"Sort by Job Start - Ascending\">"
	result += "</A>Job Start<A HREF='javascript:parent.showData(2, 1)'>"
	result += "<BR><IMG SRC='/lawson/jobdef/downblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=BOTTOM ALT=\"Sort by Job Start - Descending\"></TD>\n"
	result += "	<TD><A HREF='javascript:parent.showData(3, 0)'>"
	result += "<IMG SRC='/lawson/jobdef/upblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=TOP ALT=\"Sort by Job End - Ascending\">"
	result += "</A>Job End<A HREF='javascript:parent.showData(3, 1)'>"
	result += "<BR><IMG SRC='/lawson/jobdef/downblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=BOTTOM ALT=\"Sort by Job End - Descending\"></TD>\n"
	result += "	<TD><A HREF='javascript:parent.showData(4, 0)'>"
	result += "<IMG SRC='/lawson/jobdef/upblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=TOP ALT=\"Sort by Job Status - Ascending\">"
	result += "</A>Status<A HREF='javascript:parent.showData(4, 1)'>"
	result += "<BR><IMG SRC='/lawson/jobdef/downblue.gif' HEIGHT=10 WIDTH=11 BORDER=0 HSPACE=2 ALIGN=BOTTOM ALT=\"Sort by Job Status - Descending\"></TD>\n"
	result += "	<TD><A HREF=javascript:parent.DelQueued()>"
	result += "<IMG SRC='/lawson/jobdef/delete3.gif' HEIGHT=22 WIDTH=55 BORDER=0 ALT=\"Delete selected entries\"></A></TD>"
	window.tableFrame.document.write(result)
	for (var i = 0; i < userJobs.length; i++)
	{
		result = "<TR>\n"
		result += "	<TD>" + userJobs[i].jobName + "</TD>\n"
		if (userJobs[i].prtFileArray.length > 0)
		{
			result += "	<TD><A HREF='javascript:parent.showPrintFiles(" + i + ")'"
			result += " onMouseOver=\"window.status='View Print Files';return  true\""
		   result += " onMouseOut=\"window.status='';result =  true\">"
         result += userJobs[i].jobDescription + "</A>" + "</TD>\n"
		}
		else
		{
			result += "	<TD>" + userJobs[i].jobDescription + "</TD>\n"
		}
		result += "	<TD>" + formatDateTime(userJobs[i].startDate, userJobs[i].startTime) + "</TD>\n"
		result += "	<TD>" + formatDateTime(userJobs[i].endDate,   userJobs[i].endTime) + "</TD>\n"
		result += "	<TD>" + formatStatus(userJobs[i].status, i) + "</TD>\n"
		result += "	<TD align=center><input name=job value=" + userJobs[i].jobNumber + " type=checkbox></TD>\n"
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

function compareJob(a, b)
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

function compareJobEnd(a, b)
{
 	if (sortOrder == 0)
 	{
 		if (a.endDate > b.endDate)
 			return 1
 		if (a.endDate < b.endDate)
 			return -1
  		if (a.endTime > b.endTime)
 			return 1
 		if (a.endTime < b.endTime)
 			return -1
 		return 0
 	}
	else
	{
 		if (a.endDate < b.endDate)
 			return 1
 		if (a.endDate > b.endDate)
 			return -1
  		if (a.endTime < b.endTime)
 			return 1
 		if (a.endTime > b.endTime)
 			return -1
 		return 0
 	}
}

function compareJobStatus(a, b)
{
 	if (sortOrder == 0)
 	{
 		if (a.status > b.status)
 			return 1
 		if (a.status < b.status)
 			return -1
 		return 0
 	}
 	else
 	{
 		if (a.status < b.status)
 			return 1
 		if (a.status > b.status)
 			return -1
 		return 0
 	}
}

function DelQueued()
{
	var jobstodel = false
	var jobstring = ''
   if (typeof(this.tableFrame.document.jobs.job.length) == "undefined")
	{
      if (this.tableFrame.document.jobs.job.checked)
      {
         jobstring += '&'
         jobstring += this.tableFrame.document.jobs.job.value
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
           	jobstring += this.tableFrame.document.jobs.job[i].value
   			jobstodel = true
   		}
      }
   }
   var dataopen = delqueuedScriptName + '?' + webUser + '&' + refreshTime + jobstring
	if (jobstodel == true)
   {
      window.open(dataopen, 'jobschd')
   }
}
   
