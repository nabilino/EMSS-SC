// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/statesuscan.js,v 1.6.2.7 2014/02/21 22:52:21 brentd Exp $
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
var pStates = new Array();
var pProvince = new Array();
var pStateProvince = new Array();
var CalledGrabStates = false;

function StateProvObject(code,description)
{
	this.code = code;
	this.description = description;
}

function GrabStates(func)
{
	if(CalledGrabStates == true || pStates.length)
	{
		CalledGrabStates = true;
		eval(func);
		return;
	}
	CalledGrabStates = false;
	var pDMEObj = new DMEObject(authUser.prodline, "PRSTATE");
	pDMEObj.out = "JAVASCRIPT";
	pDMEObj.field = "state;description";
	pDMEObj.max = "600";
	pDMEObj.func = "DspStates('"+func+"')";
	pDMEObj.debug = false;
	DME(pDMEObj,"jsreturn");
}

function DspStates(func)
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
		pStates[i] = new StateProvObject(self.jsreturn.record[i].state,self.jsreturn.record[i].description);
	if (self.jsreturn.Next != "")
		self.jsreturn.location.replace(self.jsreturn.Next);
  	else
  	{
  		CalledGrabStates = true;
		GrabProvinces(func);
	}
}

function GrabProvinces(func)
{
	var pDMEObj = new DMEObject(authUser.prodline, "PRPROVINCE");
	pDMEObj.out = "JAVASCRIPT";
	pDMEObj.field = "province;description";
	pDMEObj.max = "600";
	pDMEObj.func = "DspProvince('"+func+"')";
	pDMEObj.debug = false;
	DME(pDMEObj,"jsreturn");
}

function DspProvince(func)
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
		pProvince[i] = new StateProvObject(self.jsreturn.record[i].province,self.jsreturn.record[i].description);
	if (self.jsreturn.Next != "")
		self.jsreturn.location.replace(self.jsreturn.Next);
  	else
  	{
  		pStateProvince = pStates.concat(pProvince);
  		pStateProvince.sort(sortByDescription); 		
		eval(func);
	}
}

function BuildStateSelect(state,usonly)
{
	var stateselect = "<option value=' '>";
	if (usonly) 
	{
		for (var i=0; i<pStates.length; i++)
		{
			stateselect += '<option value="'+pStates[i].code+'"';
			if (state == pStates[i].code || state == pStates[i].description)
				stateselect += ' selected>';
			else
				stateselect += '>';
			stateselect += pStates[i].description;
		}
	}	
	else 
	{
		for (var i=0; i<pStateProvince.length; i++)
		{
			stateselect += '<option value="'+pStateProvince[i].code+'"';
			if (state == pStateProvince[i].code || state == pStateProvince[i].description)
				stateselect += ' selected>';
			else
				stateselect += '>';
			stateselect += pStateProvince[i].description;
		}
	}
	return stateselect;
}

function sortByDescription(obj1, obj2)
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

// Supplemental function for use with statesuscan.js library.
function ReturnStateDescription(code)
{
	for (var i=0; i<pStateProvince.length; i++)
	{
		if (pStateProvince[i].code == code)
			return pStateProvince[i].description;
	}
	return code;
}

// Supplemental function for use with statesuscan.js library.
function ReturnStateCode(description)
{
	for (var i=0; i<pStateProvince.length; i++)
	{
		if (pStateProvince[i].description == description)
			return pStateProvince[i].code;
	}	
	return description;
}

