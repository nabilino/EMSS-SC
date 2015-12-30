// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/empinfo.js,v 1.2 2003/04/18 15:52:21 keno Exp $
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

