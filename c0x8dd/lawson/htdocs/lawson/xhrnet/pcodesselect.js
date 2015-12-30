// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/pcodesselect.js,v 1.4.4.10 2014/02/12 23:38:24 brentd Exp $
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
var PcodesInfo = new Array();
var CalledPcodesInfo = false;
var appObj;

function GetPcodesSelect(prodline, type, functocall, cond, select, framename)
{
	if (CalledPcodesInfo == true || PcodesInfo.length > 0)
	{
		CalledPcodesInfo = true;
		eval(functocall);
		return;
	}
	var fields = "type;code;description";
	if (type && type.toString().toUpperCase().indexOf("DP") >= 0)
	{	
		if (!appObj)
			appObj = new AppVersionObject(prodline, "HR");
		// if you call getAppVersion() right away and the IOS object isn't set up yet,
		// then the code will be trying to load the sso.js file, and your call for
		// the appversion will complete before the ios version is set
		if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
		{
			var args = arguments;
	       	setTimeout(function(){GetPcodesSelect.apply(this, args);}, 10);
	       	return;
		}
		if (appObj && appObj.getLongAppVersion() != null && appObj.getLongAppVersion().toString() >= "10.00.00.03")
			fields += ";dp-rel-type";
	}
	framename = (framename) ? framename : "jsreturn";
	PcodesInfo = new Array();
	CalledPcodesInfo = false;
	var pObj = new DMEObject(prodline, "PCODES");
	pObj.out = "JAVASCRIPT";
	pObj.index = "pcoset1";
	pObj.field = fields;
	pObj.key = escape(type,1);
	pObj.sortasc = "description";
	pObj.max = "600";
	if (cond) 
		pObj.cond = cond.toString();
	if (select) 
		pObj.select = select.toString();
	pObj.func = "GetPcodesSelectDone('"+escape(framename,1)+"','"+escape(functocall,1)+"')";
	pObj.debug = false;
	DME(pObj, framename);
}

function GetPcodesSelectDone(framename, functocall)
{
	framename = unescape(framename);
	functocall = unescape(functocall);
	var dmeFrame = eval("self."+framename);
	PcodesInfo = PcodesInfo.concat(self.jsreturn.record);
	if (dmeFrame.Next != "")
	{
		dmeFrame.location.replace(dmeFrame.Next);
		return;
	}
	PcodesInfo.sort(sortByDesc);
	CalledPcodesInfo = true;
	eval(functocall);
}

function sortByDesc(obj1, obj2)
{
	var name1 = obj1.description;
	var name2 = obj2.description;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function DrawPcodesSelect(type, selectedvalue, records)
{
	if (!records) records = PcodesInfo
	var codeselect = new Array()
	var len = records.length;
	var rec = null;
	codeselect[0] = "<option value=' '>"
	for (var i=0; i<len; i++)
	{
		codeselect[i+1] = ""
		rec = records[i];	
		if (typeof(type) == "undefined" || type == null || rec.type == type)
		{
        	codeselect[i+1] += "<option value='" + rec.code + "'"
			if (rec.code == selectedvalue)
		    	codeselect[i+1] += " selected"
			codeselect[i+1] += ">" + rec.description
		}
	}
	return codeselect.join("")
}

