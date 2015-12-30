// Version: 8-)@(#)@10.00.02.00.29
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/empinfo.js,v 1.2.6.3 2012/06/29 17:24:21 brentd Exp $
//***************************************************************
//*                                                             *
//*                           NOTICE                            *
//*                                                             *
//*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//*                                                             *
//*   (c) COPYRIGHT 2012 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************
var EmpInfo = new Object()
var CalledEmpInfo = false

function GetEmpInfo(prodline, company, employee, file, fields, functocall, framename, otmmax)
{
	framename = (framename)?framename:"jsreturn"
	otmmax = (otmmax)?otmmax.toString():"1"
	EmpInfo = new Object()
	CalledEmpInfo = false
	
	var pObj 			= new DMEObject(prodline, file)
		pObj.out 		= "JAVASCRIPT"
		pObj.field 		= fields
		pObj.key 		= parseInt(company,10) + "=" + parseInt(employee,10)
		pObj.max 		= "1"	
		pObj.otmmax		= otmmax
		pObj.func 		= "GetEmpInfoDone('"+escape(framename,1)+"','"+escape(functocall,1)+"')"
		pObj.debug 		= false
	DME(pObj, framename)
}

function GetEmpInfoDone(framename, functocall)
{
	framename = unescape(framename)
	functocall = unescape(functocall)
	var dmeFrame = eval("self."+framename)
	
	if (dmeFrame.NbrRecs) 
		EmpInfo = dmeFrame.record[0]
	
	CalledEmpInfo = true
	eval(functocall)
}

