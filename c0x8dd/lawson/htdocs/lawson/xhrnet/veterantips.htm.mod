<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width" />
<title>Veteran Status Help</title>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script>
// Dynamically write the contents of the Veteran Status tips window.
// This can be fully customized by placing content in the body of this document and
// removing this function.	 

/*function writeContents() 
{
	stylePage();
	setWinTitle(opener.getSeaPhrase("VETERAN_STATUS_HELP","ESS"));
	
	self.main.document.getElementById("paneHeader").innerHTML = '<div class="dialoglabel">'+opener.getSeaPhrase("HELP","ESS")+'</div>';
	self.main.stylePage();
	fitToScreen();
}

function fitToScreen()
{
	if (typeof(window["styler"]) == "undefined" || window.styler == null)
	{
		window.stylerWnd = findStyler(true);
	}

	if (!window.stylerWnd)
	{
		return;
	}

	if (typeof(window.stylerWnd["StylerEMSS"]) == "function")
	{
		window.styler = new window.stylerWnd.StylerEMSS();
	}
	else
	{
		window.styler = window.stylerWnd.styler;
	}

	var mainFrame = document.getElementById("main");
	var winObj = getWinSize();
	var winWidth = winObj[0];	
	var winHeight = winObj[1];
	var contentWidth;
	var contentWidthBorder;
	var contentHeightBorder;
	var contentHeight;	

	if (window.styler && window.styler.showInfor)
	{			
		contentWidth = winWidth - 15;
		contentWidthBorder = contentWidth + 10;	
		contentHeight = winHeight - 30;
		contentHeightBorder = contentHeight + 30;		
	}
	else if (window.styler && (window.styler.showLDS || window.styler.showInfor3))
	{
		contentWidth = winWidth - 20;
		contentWidthBorder = contentWidth + 17;	
		contentHeight = winHeight - 45;	
		contentHeightBorder = contentHeight + 40;		
	}
	else
	{
		contentWidth = winWidth - 15;
		contentWidthBorder = contentWidth + 10;	
		contentHeight = winHeight - 30;
		contentHeightBorder = contentHeight + 30;			
	}	

	mainFrame.style.width = winWidth + "px";
	mainFrame.style.height = winHeight + "px";	
	try
	{
		if (self.main.onresize && self.main.onresize.toString().indexOf("setLayerSizes") >= 0)
		{
			self.main.onresize = null;
		}			
	}
	catch(e)
	{}
	try
	{
		self.main.document.getElementById("paneBorder").style.width = contentWidthBorder + "px";
		self.main.document.getElementById("paneBodyBorder").style.width = contentWidthBorder + "px";
		self.main.document.getElementById("paneBorder").style.height = contentHeightBorder + "px";
		self.main.document.getElementById("paneBodyBorder").style.height = contentHeightBorder + "px";
		self.main.document.getElementById("paneBody").style.width = contentWidth + "px";
		self.main.document.getElementById("paneBody").style.height = contentHeight + "px";
	}
	catch(e)
	{}	
}
</script>
</head>
<body style="overflow:hidden" onload="writeContents()" onresize="fitToScreen()">
	<iframe id="main" name="main" title="Main Content" level="1" tabindex="0" style="position:absolute;top:0px;height:500px;left:0px;width:803px" src="/lawson/xhrnet/ui/helpheaderpane.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
</body>
</html>	   */	  
</HEAD>
<!--<frameset rows="100%" frameborder="no" border="0" onload="writeContents()">
	<frame src="/lawson/xhrnet/ui/helpheaderpane.htm" name="main" id="main" marginwidth="0" marginheight="0" scrolling="auto">
	</frameset> -->
<BODY>
<DIV>
<table border="0" cellspacing="0" cellpadding="0" style="width:100%">
<tr><td class="plaintablecell" size="-1" style="text-align:left:padding-top:1px" nowrap><FONT SIZE=-1><b>2 - Disabled Veteran:</b></font></td></tr>
<tr><td class="plaintablecell" size="-1" style="text-align:left:padding-top:1px"><FONT SIZE=-1>Veteran of the U.S. military entitled to compensation under laws administered by the Secretary of Veteran Affairs, or a person discharged or released from active duty because of a service connected disability.</font></td></tr>
<tr><td> </td></tr>
<tr><td class="plaintablecell" size="-1" style="text-align:left:padding-top:1px" nowrap><FONT SIZE=-1><b>3 - Other Protected Veteran:</b></font></td></tr>
<tr><td class="plaintablecell" size="-1" style="text-align:left:padding-top:1px"><FONT SIZE=-1>Veteran who served on active duty in the U.S. military during a war or campaign or expedition for which a campaign badge was awarded.</font></td></tr>
<tr><td> </td></tr>
<tr><td class="plaintablecell" size="-1" style="text-align:left:padding-top:1px" nowrap><FONT SIZE=-1><b>4 - Armed Forces Service Medal Vet:</b></font></td></tr>
<tr><td class="plaintablecell" size="-1" style="text-align:left:padding-top:1px"><FONT SIZE=-1>Veteran who, while serving on active duty in the Armed Forces, participated in a United States military operation for which an Armed Forces service medal was awarded pursuant to Executive Order 12985.</font></td></tr>
<tr><td> </td></tr>
<tr><td class="plaintablecell" size="-1" style="text-align:left:padding-top:1px" nowrap><FONT SIZE=-1><b>5 - Recently Separated Veteran:</b></font></td></tr>
<tr><td class="plaintablecell" size="-1" style="text-align:left:padding-top:1px"><FONT SIZE=-1>Recently separated veteran (veterans within 36 months from discharge or release from active duty).</font></td></tr>
<tr><td> </td></tr>
<tr><td class="plaintablecell" size="-1" style="text-align:left:padding-top:1px" nowrap><FONT SIZE=-1><b>6 - Veteran - None of the Above:</b></font></td></tr>
<tr><td class="plaintablecell" size="-1" style="text-align:left:padding-top:1px"><FONT SIZE=-1>A veteran of the U.S. military that does not fit into one of the four protected classes as defined by the U.S. Department of Labor.</font></td></tr>
<tr><td> </td></tr>
<tr><td class="plaintablecell" size="-1" style="text-align:left:padding-top:1px" nowrap><FONT SIZE=-1><b>N - Not Disclosed:</b></font></td></tr>
<tr><td class="plaintablecell" size="-1" style="text-align:left:padding-top:1px"><FONT SIZE=-1>Not Disclosed.</font></td></tr>
</table>
</DIV>
</BODY>
</HTML>
<!-- Version: 8-)@(#)@10.00.05.00.12 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/Attic/veterantips.htm,v 1.1.2.15 2014/01/22 22:58:04 brentd Exp $ -->
<!--************************************************************
 *                                                             *
 *                           NOTICE                            *
 *                                                             *
 *   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
 *   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
 *   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
 *   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
 *   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
 *   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
 *   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
 *                                                             *
 *   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
 *   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
 *   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
 *   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
 *   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
 *   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
 *                                                             *
 ************************************************************-->
