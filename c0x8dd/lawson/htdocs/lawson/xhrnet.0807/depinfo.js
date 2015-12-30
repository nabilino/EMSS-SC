// Version: 8-)@(#)@10.00.02.00.29
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/depinfo.js,v 1.3.2.6 2012/06/29 17:24:21 brentd Exp $
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
var DepInfo = new Array()
var CalledDepInfo = false
var appObj;

function GetDepInfo(prodline, company, employee, fields, functocall, cond, framename)
{
	if (!appObj)
	{
		appObj = new AppVersionObject(prodline, "HR");
	}
	
	// if you call getAppVersion() right away and the IOS object isn't set up yet,
	// then the code will be trying to load the sso.js file, and your call for
	// the appversion will complete before the ios version is set
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
       		setTimeout("GetDepInfo('"+prodline+"','"+company+"','"+employee+"','"+fields+"','"+functocall+"','"+cond+"','"+framename+"')", 10);
       		return;
	}
	
	framename = (framename)?framename:"jsreturn"
	if (!fields || typeof(fields) == "undefined" || fields == null || fields == "")
	{
		fields = "label-name-1;last-name-pre;name-suffix;middle-init;last-name;first-name;"
		+ "rel-code.description;hm-phone-nbr;hm-phone-cntry;wk-phone-nbr;wk-phone-cntry;"
		+ "wk-phone-ext;rel-code;addr1;addr2;addr3;addr4;city;state;zip;birthdate;placement-date;"
		+ "adoption-date;seq-nbr;emp-address;dep-type;sex;student;disabled;smoker;fica-nbr;country-code;"
		+ "employee.addr1;employee.addr2;employee.addr3;employee.addr4;employee.city;employee.state;"
		+ "employee.zip;employee.country-code;employee.work-country;pa-employee.hm-phone-nbr;"
		+ "pa-employee.hm-phone-cntry;country.country-desc;active-flag;benefits.plan-type;" // PT 139145 - add HRDEPBEN field
		+ "primary-care"

		if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "10.00.00")
		{
			fields += ";email-personal"
		}
	}
	DepInfo = new Array()
	CalledDepInfo = false
	
	var pObj 			= new DMEObject(prodline, "EMDEPEND")
		pObj.out 		= "JAVASCRIPT"
		pObj.index		= "emdset1"
		pObj.field 		= fields
		pObj.key 		= parseInt(company,10) + "=" + parseInt(employee,10)
		pObj.max 		= "600"	
	if (cond) pObj.cond	= cond.toString()	
		pObj.func 		= "GetDepInfoDone('"+escape(framename,1)+"','"+escape(functocall,1)+"')"
		pObj.debug 		= false
	DME(pObj, framename)
}

function GetDepInfoDone(framename, functocall)
{
	framename = unescape(framename)
	functocall = unescape(functocall)
	var dmeFrame = eval("self."+framename)
	
	DepInfo = DepInfo.concat(dmeFrame.record)
	
	if (dmeFrame.Next != "")
	{
		dmeFrame.location.replace(dmeFrame.Next)
		return
	}
	
	CalledDepInfo = true
	eval(functocall)
}
