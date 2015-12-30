/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/Attic/SortArray.js,v 1.1.2.5.4.2.14.1.2.2 2012/08/08 12:37:30 jomeli Exp $ */
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

function SortArray(targetWindow)
{
	if(typeof(tagetWindow) != "object")
		targetWindow = window;
		
	this.targetWindow = targetWindow;
	this.decimalSeparator = ".";
	//private properties
	this.isDigitRE = new RegExp("[0-9|" + this.decimalSeparator + "]+$");
	this.sortAscending = true;
}
//-----------------------------------------------------------------------------
SortArray.prototype.setDecimalSeparator=function(decimalSeparator)
{
	if(typeof(decimalSeparator) != "string" )
		return false;
		
	this.decimalSeparator = decimalSeparator;
	this.isDigitRE = new RegExp("[0-9|" + this.decimalSeparator + "]+$");
	return true;
}
//-----------------------------------------------------------------------------
SortArray.prototype.getDecimalSeparator=function()
{
	return this.decimalSeparator;
}
//-----------------------------------------------------------------------------
SortArray.prototype.sort=function(targetArray, bAscending)
{
	//Use this method to sort an array of strings or numbers.
	//Use this method to sort an array of alpha numeric values like CU01.1 and _f1	
	//Do not use this method to sort strings alphabetically, instead call myArray.sort().
    //Do not use this method to sort numbers, instead use this.sortNumerics to achieve
	//better performance.
	
	try{
	
	this.sortAscending = this.validateSortOrder(bAscending);
	this.targetWindow.oSortRef = this;
	targetArray.sort(this.compareMixed);
	this.targetWindow.oSortRef = null;
	return true;
	
	}catch(e){return false}
}
//-----------------------------------------------------------------------------
SortArray.prototype.sortNumerics=function(targetArray, bAscending)
{
	//Use this method to sort an array of numbers.
	
	try{
	
	this.sortAscending = this.validateSortOrder(bAscending);

	if(this.sortAscending)
		targetArray.sort(this.compareNumbersAsc);
	else
		targetArray.sort(this.compareNumbersDsc);

	return true;
	
	}catch(e){return false}
}
//-----------------------------------------------------------------------------
SortArray.prototype.sortLengths=function(targetArray, bAscending)
{
	//Use this method to sort an array of strings or numbers by their length.
	
	try{
	
	this.sortAscending = this.validateSortOrder(bAscending);

	if(this.sortAscending)
		targetArray.sort(this.compareLengthsAsc);
	else
		targetArray.sort(this.compareLengthsDsc);

	return true;	
			
	}catch(e){return false}	
}
//-----------------------------------------------------------------------------
SortArray.prototype.sortObjects=function(targetArray)
{
	//Use this method to sort an array of objects.
	//You must call the method setObjectSortCriteria prior to using this method.

	try{
	
	this.targetWindow.oSortRef = this;
	targetArray.sort(this.compareObject);
	this.targetWindow.oSortRef = null;
	return true;
	
	}catch(e){return false}
}
//-----------------------------------------------------------------------------
SortArray.prototype.setObjectSortCriteria=function(targetObject, valueAry, dataTypeAry, bAscendingAry)
{
	//This method will add the property 'oSortCriteria' to your object.
	//It will be used to determine what object properties are used when sorting
	//example:
	//People is an Array that contains Person objects.  A Person object has the properties 
	//firstName, lastName, deptNumber.
	//
	//The goal is to sort the array of object first by deptNumber, then by lastName, and then
	//by firstName.
	//
	//var dataTypeAry = new Array("numeric","alpha", "alpha");
	//var bAscendingAry = new Array(true, true, true);
	//
	//for(var i=0;i<People.length;i++)
	//{
	//	var myObj = People[i];
	//	var valueAry = new Array(myObj.deptNumber, myObj.lastName, myObj.firstName);
	//	oSortArray.setObjectSortCriteria(myObj, valueAry, dataTypeAry, bAscendingAry);
	//}
	//
	//oSortArray.sortObjects(People); 		
	
	var oTemp = new Object();
	oTemp.values = new Array();
	oTemp.dataType = new Array();
	oTemp.sortOrder = new Array();		

	if(typeof(targetObject) != "object")
		return false;
		
	if(typeof(valueAry) != "object" && valueAry.length)
		return false;
	
	var loop = valueAry.length;	
	for(var i=0;i<loop;i++)
		oTemp.values.push(valueAry[i]);	

	for(var i=0;i<loop;i++)
	{
		var dataType = "mixed";
		
		if(typeof(dataTypeAry) != "undefined")
			dataType = this.validateDataType(dataTypeAry[i]);
			
		oTemp.dataType.push(dataType);	
	}

	for(var i=0;i<loop;i++)
	{
		var sortOrder = true;
		
		if(typeof(bAscendingAry) != "undefined")
			sortOrder = this.validateSortOrder(bAscendingAry[i]);
			
		oTemp.sortOrder.push(sortOrder);	
	}
	
	targetObject.oSortCriteria = new Object();
	targetObject.oSortCriteria = oTemp;	
	return true;	
}
//PRIVATE METHODS -------------------------------------------------------------
SortArray.prototype.validateSortOrder=function(sortOrder)
{
	return ((typeof(sortOrder) != "boolean" || sortOrder) ? true : false);
}
//-----------------------------------------------------------------------------
SortArray.prototype.validateDataType=function(dataType)
{
	if(typeof(dataType) != "string")
		return "mixed";

	dataType = dataType.toLowerCase();
	return ((dataType != "mixed" && dataType != "numeric" && dataType != "alpha") ? "mixed" : dataType);		
}
//-----------------------------------------------------------------------------
SortArray.prototype.compareMixed=function(val1, val2)
{
	var oRef = oSortRef;
	var isDigitRE = oRef.isDigitRE;
	var sortAsc = oRef.sortAscending;

	var val1Ary = oRef.splitMixed(val1,isDigitRE);
	var val2Ary = oRef.splitMixed(val2,isDigitRE);

	if(sortAsc)
		var bNotEqual = oRef.compareAlphasAsc(val1Ary[0], val2Ary[0]);
	else
		var bNotEqual = oRef.compareAlphasDsc(val1Ary[0], val2Ary[0]);
	
	if(bNotEqual != 0) return bNotEqual;

	if(sortAsc)
		return oRef.compareNumbersAsc(parseFloat(val1Ary[1],10), parseFloat(val2Ary[1],10));
	else
		return oRef.compareNumbersDsc(parseFloat(val1Ary[1],10), parseFloat(val2Ary[1],10));
}
//-----------------------------------------------------------------------------
SortArray.prototype.splitMixed=function(value,isDigitRE)
{
	if(typeof(value) == "number")
		return new Array("", value);
		
	var reAry = isDigitRE.exec(value);
	
	if(reAry == null)
		return new Array(value, 0);

	var headString = value.substring(0,reAry.index);
	var tailString = value.substring(reAry.index);
	
	return new Array(headString, tailString);
}
//-----------------------------------------------------------------------------
SortArray.prototype.compareLengthsAsc=function(val1, val2)
{
	// PT 129936 - must make local copy for changes
	var copy1 = val1;
	var copy2 = val2;

	if(typeof(copy1) == "number")
		copy1 = copy1.toString();

	if(typeof(copy2) == "number")
		copy2 = copy2.toString();	
	
	if(copy1.length<copy2.length) return -1;

	if(copy1.length>copy2.length) return 1;

	return 0;
}
//-----------------------------------------------------------------------------
SortArray.prototype.compareLengthsDsc=function(val1, val2)
{
	// PT 129936 - must make local copy for changes
	var copy1 = val1;
	var copy2 = val2;

	if(typeof(copy1) == "number")
		copy1 = copy1.toString();

	if(typeof(copy2) == "number")
		copy2 = copy2.toString();	
	
	if(copy1.length<copy2.length) return 1;

	if(copy1.length>copy2.length) return -1;

	return 0;
}
//-----------------------------------------------------------------------------
SortArray.prototype.compareNumbersAsc=function(val1, val2)
{
	if(val1<val2) return -1;

	if(val1>val2) return 1;

	return 0;
}
//-----------------------------------------------------------------------------
SortArray.prototype.compareNumbersDsc=function(val1, val2)
{
	if(val1<val2) return 1;

	if(val1>val2) return -1;

	return 0;
}
//-----------------------------------------------------------------------------
SortArray.prototype.compareAlphasAsc=function(val1, val2)
{
	// PT 129936 - must make local copy for changes
	var copy1 = val1.toUpperCase();
	var copy2 = val2.toUpperCase();

	if (copy1 < copy2) return -1;

	if (copy1 > copy2) return 1;

	return 0;
}
//-----------------------------------------------------------------------------
SortArray.prototype.compareAlphasDsc=function(val1, val2)
{
	// PT 129936 - must make local copy for changes
	var copy1 = val1.toUpperCase();
	var copy2 = val2.toUpperCase(); 

	if (copy1 < copy2) return 1;

	if (copy1 > copy2) return -1;

	return 0;
}
//-----------------------------------------------------------------------------
SortArray.prototype.compareObject=function(obj1, obj2)
{
	var oRef = oSortRef;
	var oSortCriteria1 = obj1.oSortCriteria;
	var oSortCriteria2 = obj2.oSortCriteria;

	var loop = oSortCriteria1.values.length;
	
	for(var i=0;i<loop;i++)
	{
		var val1 = oSortCriteria1.values[i];
		var val2 = oSortCriteria2.values[i];
		var dataType = oSortCriteria1.dataType[i];
		var bAscending = oSortCriteria1.sortOrder[i]
		oRef.sortAscending = bAscending;

		switch(dataType)
		{
			case "mixed":
				var returnVal = oRef.compareMixed(val1, val2);
				break;
			case "numeric":
				if(bAscending)
					var returnVal = oRef.compareNumbersAsc(val1, val2);
				else
					var returnVal = oRef.compareNumbersDsc(val1, val2);	
				break;	
			case "alpha":
				if(bAscending)
					var returnVal = oRef.compareAlphasAsc(val1, val2);
				else
					var returnVal = oRef.compareAlphasDsc(val1, val2);
				break
		}			
		
		if(returnVal != 0)
			break;		
	}
	
	return 	returnVal;

}