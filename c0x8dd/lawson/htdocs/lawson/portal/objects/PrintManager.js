/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/Attic/PrintManager.js,v 1.1.2.1.14.1.2.2 2012/08/08 12:37:30 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
//-----------------------------------------------------------------------------
//		***************************************************************
//		*                                                             *                          
//		*                           NOTICE                            *
//		*                                                             *
//		*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//		*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//		*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//		*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//		*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//		*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//		*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//		*                                                             *
//		*   (c) COPYRIGHT 2012 INFOR.  ALL RIGHTS RESERVED.           *
//		*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//		*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//		*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//		*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//		*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//		*                                                             *
//		*************************************************************** 
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// PrintManager constructor
function PrintManager(portalWnd)
{
	this.portalWnd=portalWnd;
	this.printWnd=null;
	this.contentWnd=null;
	this.content="";
	this.title="";
}
PrintManager.prototype.closePrintWnd=function()
{
	try {
		if (this.printWnd && !this.printWnd.closed)
			this.printWnd.close()
	} catch (e) { }
}
PrintManager.prototype.showPrintWnd=function(content,wnd)
{
	this.content=content;
	this.contentWnd=wnd;
	var portalWndTitle=this.portalWnd.lawsonPortal.getTitle();
	this.title=(portalWndTitle ? portalWndTitle : wnd.document.title);
	try {
		if (this.printWnd && !this.printWnd.closed)
		{
			this.printWnd.focus();
			this.printWnd.show(content);
		}
		else
		{
			var htmPath=this.portalWnd.lawsonPortal.path+"/objects/print.htm";
			this.printWnd = this.portalWnd.open(htmPath, "_blank", "top=10,left=10" + 
					",width=800,height=600,status=no,resizable=yes,scrollbars=yes");
		}
	} catch (e) { }
}
