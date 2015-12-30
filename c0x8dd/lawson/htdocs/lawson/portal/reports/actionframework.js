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

var portalWnd=null;
var portalObj=null;
var configObj=null;
var magicObj=null;

function actionframeworkOnLoad()
{
	portalWnd=envFindObjectWindow("lawsonPortal",window);
	if (!portalWnd) return;
	// note: refresh causes this to fire inappropriately in IE!
	if (!portalWnd.lawsonPortal || typeof(portalWnd.lawsonPortal)=="undefined")
		return;
	portalObj=portalWnd.lawsonPortal;
	configObj=portalWnd.oPortalConfig;
	this.magicObj = new this.AFMagic(this, portalWnd);
	
	xslInitFramework();
	
	magicObj.transact("I");
}

function lawformDoFunctionClick()
{
	magicObj.transact("C");
	portalWnd.switchContents(portalWnd.getGoJobDefURL(jobName) + "&" + jobOwner);
}