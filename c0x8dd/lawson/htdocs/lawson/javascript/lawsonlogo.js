//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/lawsonlogo.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
function lawsonLogo()
{
	var lawsonlogo= "<BODY bgcolor=maroon>" + "<center><table border=0 cellspacing=5>"
	              + "<tr><td colspan=2 align=center><IMG VALIGN=TOP BORDER=0" 
	              + " src=/lawson/images/lawson/logo3.gif>"
	              + "<tr><td align=center valign=center><font color=white>" + parent.officeof + "</font></BODY>"

//** The options button
	lawsonlogo += "<td align=center valign=center><a href=javascript:parent.OptionsWin()"
	lawsonlogo += " onMouseover=\"window.status='Customize Your Office';return true\" "
	lawsonlogo += " onMouseout=\"window.status='';return true\">"
	lawsonlogo += "<img border=0 src=/lawson/images/buttons/options.gif></a>"
    lawsonlogo += "</table></body>"

	parent.LAWSONLOGO.document.write(lawsonlogo)
	parent.LAWSONLOGO.document.close()
}
