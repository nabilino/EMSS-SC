// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/instctrycdselect.js,v 1.4.2.7 2014/02/13 22:48:37 brentd Exp $
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
var InstCtryCdInfo = new Array();
var CalledInstCtryCdInfo = false;

function GetInstCtryCdSelect(prodline, functocall, framename)
{
	if (CalledInstCtryCdInfo == true || InstCtryCdInfo.length > 0)
	{
		CalledInstCtryCdInfo = true;
		eval(functocall);
		return;
	}
	framename = (framename) ? framename: "jsreturn";
	InstCtryCdInfo = new Array();
	CalledInstCtryCdInfo = false;
	var pObj = new DMEObject(prodline, "INSTCTRYCD");
	pObj.out = "JAVASCRIPT";
	pObj.index = "intset1";
	pObj.field = "country-code;country-desc";
	pObj.key = "";
	pObj.max = "600";
	pObj.func = "GetInstCtryCdSelectDone('"+escape(framename,1)+"','"+escape(functocall,1)+"')";
	pObj.debug = false;
	DME(pObj, framename);
}

function GetInstCtryCdSelectDone(framename, functocall)
{
	framename = unescape(framename);
	functocall = unescape(functocall);
	var dmeFrame = eval("self."+framename);
	InstCtryCdInfo = InstCtryCdInfo.concat(dmeFrame.record);
	if (dmeFrame.Next != "")
	{
		dmeFrame.location.replace(dmeFrame.Next);
		return;
	}
	InstCtryCdInfo.sort(sortByCountryDescription);
	CalledInstCtryCdInfo = true;
	eval(functocall);
}

function DrawInstCtryCdSelect(selectedvalue, records)
{
	if (!records) records = InstCtryCdInfo;
	var codeselect = new Array();
	codeselect[0] = "<option value=' '>";
	for (var i=0; i<records.length; i++)
	{
		codeselect[i+1] = "<option value='" + records[i].country_code + "'";
		if (records[i].country_code == selectedvalue)
		    codeselect[i+1] += " selected";
		codeselect[i+1] += ">" + records[i].country_desc;
	}
	return codeselect.join("");
}

function sortByCountryDescription(obj1, obj2)
{
	var name1 = obj1.country_desc;
	var name2 = obj2.country_desc;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

// Supplemental function for use with instctrycdselect.js library.
function ReturnCountryDescription(code)
{
	for (var i=0; i<InstCtryCdInfo.length; i++)
	{
		if (InstCtryCdInfo[i].country_code == code)
			return InstCtryCdInfo[i].country_desc;
	}
	return code;
}
