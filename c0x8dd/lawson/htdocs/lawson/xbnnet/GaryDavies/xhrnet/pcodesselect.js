// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/pcodesselect.js,v 1.4.4.1 2005/02/18 20:26:03 brentd Exp $
var PcodesInfo = new Array()
var CalledPcodesInfo = false

function GetPcodesSelect(prodline, type, functocall, cond, select, framename)
{
	if (CalledPcodesInfo == true || PcodesInfo.length > 0)
	{
		CalledPcodesInfo = true;
		eval(functocall);
		return;
	}

	framename = (framename)?framename:"jsreturn"
	PcodesInfo = new Array()
	CalledPcodesInfo = false

	var pObj 			= new DMEObject(prodline, "PCODES")
		pObj.out 		= "JAVASCRIPT"
		pObj.index		= "pcoset1"
		pObj.field 		= "type;code;description"
		pObj.key 		= escape(type,1)
		pObj.sortasc		= "description"
		pObj.max 		= "600"
	if (cond) pObj.cond		= cond.toString()
	if (select) pObj.select 	= select.toString()
		pObj.func 		= "GetPcodesSelectDone('"+escape(framename,1)+"','"+escape(functocall,1)+"')"
		pObj.debug 		= false
	DME(pObj, framename)
}

function GetPcodesSelectDone(framename, functocall)
{
	framename = unescape(framename);
	functocall = unescape(functocall);
	var dmeFrame = eval("self."+framename);

	//if((PcodesInfo.length) ? true : false)
	//	PcodesInfo = InsertionSort(PcodesInfo, self.jsreturn.record, "description", ">", false)
	//else
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
	codeselect[0] = "<option value=' '>"

	for (var i=0; i<records.length; i++)
	{
		codeselect[i+1] = ""
		if (typeof(type) == "undefined" || type == null || records[i].type == type)
		{
        	codeselect[i+1] += "<option value='" + records[i].code + "'"
			if (records[i].code == selectedvalue)
		    	codeselect[i+1] += " selected"
			codeselect[i+1] += ">" + records[i].description
		}
	}

	return codeselect.join("")
}

