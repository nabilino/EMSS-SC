/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/Attic/Timer.js,v 1.1.2.2.18.1.2.2 2012/08/08 12:37:30 jomeli Exp $ */
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

function Timer(interval, doFunction)
{
	this.interval = interval;
	this.doFunction = doFunction;
	this.timedFunction = null;
	this.isEnabled = false;
}
//-----------------------------------------------------------------------------
Timer.prototype.startTimer=function()
{
	this.isEnabled = true;
	this.timedFunction = setInterval(this.doFunction, this.interval);
}
//-----------------------------------------------------------------------------
Timer.prototype.stopTimer=function()
{
	this.isEnabled = false;
	clearInterval(this.timedFunction);
}
//-----------------------------------------------------------------------------
Timer.prototype.resetTimer=function()
{
	this.stopTimer();
	this.startTimer();
}
//-----------------------------------------------------------------------------
