/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/FeedBack.js,v 1.2.2.3.4.3.14.1.2.2 2012/08/08 12:37:30 jomeli Exp $ */
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
// feed back object
function FeedBack(wnd,portalWnd,txt)
{
	try {
		this.wnd = wnd;
		this.portalWnd=portalWnd;
		this.portalObj=portalWnd.lawsonPortal;

		// construct and size feed back DIV
		var doc=this.wnd.document;
		var div = doc.createElement("DIV");
		div.style.position = "absolute";
		div.style.display = "none";
		div.style.margin="0px";
		div.style.height = "20px";
		div.style.backgroundColor = "white";
		doc.body.appendChild(div);

		var lbl = doc.createElement("LABEL");
		lbl.style.margin="0px";
		lbl.style.marginLeft="6px";
		lbl.style.position="relative";
		lbl.style.color="black";
		lbl.style.fontFamily="Tahoma, Arial, sans-serif";
		lbl.style.fontSize="9pt";
		lbl.style.textAlign="left";
		lbl.innerHTML = (typeof(txt) == "string" ? txt
			: this.portalObj.getPhrase("LBL_PLEASE_WAIT")+"...");
		div.appendChild(lbl);

		this.fbLbl = lbl;
		this.fbDiv = div;
		this.resize();

	} catch (e) { alert(e.description) }
}
//-----------------------------------------------------------------------------
FeedBack.prototype.hide=function()
{
	try {
		this.fbDiv.style.display = "none";
	} catch (e) { }
}
//-----------------------------------------------------------------------------
FeedBack.prototype.resize=function()
{
	try {
		var scrWidth = (this.portalWnd.oBrowser.isIE
				? this.wnd.document.body.offsetWidth
				: this.wnd.innerWidth - 2);
		var scrHeight = (this.portalWnd.oBrowser.isIE
				? this.wnd.document.body.offsetHeight
				: this.wnd.innerHeight - 2);
		var pWidth = 200;
		var pHeight = parseInt(this.fbDiv.style.height);

		this.fbDiv.style.width = pWidth + "px";
		this.fbDiv.style.left = "0px";
		this.fbDiv.style.top = (Math.round(scrHeight - pHeight)-2) + "px";
	} catch (e) { }
}
//-----------------------------------------------------------------------------
FeedBack.prototype.setText=function(txt)
{
	try { this.fbLbl.innerHTML = txt;
	} catch (e) { }
}
//-----------------------------------------------------------------------------
FeedBack.prototype.show=function()
{
	try {
		this.fbDiv.style.display = "block";
		this.fbDiv.style.zIndex = 10000;
	} catch (e) { alert(e.description) }
}
