// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/hrctrycodeselect.js,v 1.4.4.6 2014/02/13 22:48:37 brentd Exp $
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
//*   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************
var HrCtryCodeInfo = new Array()
var CalledHrCtryCodeInfo = false

function GetHrCtryCodeSelect(prodline, type, functocall, cond, framename)
{
	if (CalledHrCtryCodeInfo == true || HrCtryCodeInfo.length > 0)
	{
		CalledHrCtryCodeInfo = true;
		eval(functocall);
		return;
	}
	framename = (framename) ? framename : "jsreturn";
	HrCtryCodeInfo = new Array();
	CalledHrCtryCodeInfo = false;
	var pObj = new DMEObject(prodline, "HRCTRYCODE");
	pObj.out = "JAVASCRIPT";
	pObj.index = "ctcset1";
	pObj.field = "type;hrctry-code;description";
	pObj.key = escape(type,1);
	pObj.sortasc = "description";
	pObj.max = "600";
	if (cond) pObj.cond	= cond.toString();
	pObj.func = "GetHrCtryCodeSelectDone('"+escape(framename,1)+"','"+escape(functocall,1)+"')";
	pObj.debug = false;
	DME(pObj, framename);
}

function GetHrCtryCodeSelectDone(framename, functocall)
{
	framename = unescape(framename);
	functocall = unescape(functocall);
	var dmeFrame = eval("self."+framename);
	HrCtryCodeInfo = HrCtryCodeInfo.concat(dmeFrame.record);
	if (dmeFrame.Next != "")
	{
		dmeFrame.location.replace(dmeFrame.Next);
		return;
	}
	CalledHrCtryCodeInfo = true;
	eval(functocall);
}

function DrawHrCtryCodeSelect(type, selectedvalue, records)
{
	if (!records) records = HrCtryCodeInfo;
	var codeselect = new Array();
	codeselect[0] = "<option value=' '>";
	for (var i=0; i<records.length; i++)
	{
		codeselect[i+1] = "";
		if (typeof(type) == "undefined" || type == null || records[i].type == type)
		{
        	codeselect[i+1] += "<option value='" + records[i].hrctry_code + "'";
			if (records[i].hrctry_code == selectedvalue)
		    	codeselect[i+1] += " selected";
			codeselect[i+1] += ">" + records[i].description;
		}
	}
	return codeselect.join("");
}

