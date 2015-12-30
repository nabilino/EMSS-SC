//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/sort.js,v 1.1.26.1 2007/02/06 22:08:33 keno Exp $ $Name: REVIEWED_901 $
/* Example Call
x=new Array()
x[0] = new Array("oracle","rs6000")
x[1] = new Array("informix","hp9000")
x[2] = new Array("ladb","as400")
x[3] = new Array("informix","u6000")
x[4] = new Array("sybase","sunsparc")
x[5] = new Array("informix","ibmmf")
x[6] = new Array("informix","a12")

sort2DArray(x,1,7)
var alertMsg = ""
for (i in x)
{
	alertMsg += x[i][0] + " " + x[i][1] + "\n";
}
alert(alertMsg);
*/

// Bubble sort of a 2 dimensional array
function sort2DArray(myarray,index,length)
{
	var i=0
	var j=0
	var hold
	for(i=0;i<length;i++)
	{
		for(j=length-1;j>i;j--)
		{
			if(myarray[j-1][index] > myarray[j][index])
			{
				// Exchange j-1 and j arrays
				hold = myarray[j-1]
				myarray[j-1]=myarray[j]
				myarray[j]=hold
			}
		}
	}
}


/*

function RecObject(company, contract_id, customer,  serv_total, hw_make, hw_database, cont_total, contract_date, process_level, Ae)
{
    this.company = company
    this.contract_id = contract_id
    this.customer = customer
    this.serv_total = serv_total
    this.hw_make = hw_make
    this.hw_database = hw_database
    this.cont_total = cont_total
    this.contract_date = contract_date
    this.process_level = process_level
    this.Ae = Ae
}


record = new RecObject("company", "contract_id", "customer",  "serv_total", "hw_make", "hw_database", "cont_total", "contract_date", "process_level", "Ae")
record[0] = new RecObject("   1", "  4915", "     4166",  "   386500.00",  "AS400", "*", "   386500.00", "02/17/1997", "LTF", "        0")
record[1] = new RecObject("  20", "  4916", "     4427",  "   835000.00",  "RS6000", "SYBASE", "   835000.00", "02/17/1997", "TOR", "        0")
record[2] = new RecObject("   1", "  4917", "     4428",  "   287400.00",  "HP9000", "ORACLE", "   287400.00", "02/17/1997", "MPL", "        0")
record[3] = new RecObject("   1", "  4918", "     4237",  "   250000.00",  "HP9000", "LADB", "   250000.00", "02/19/1997", "LTF", "        0")

var NbrRecs = 4

sortObjArray(record,"hw_make",4)

var alertMsg = ""
for (i in record)
{
	for(j in record[i])
	{
	alertMsg += record[i][j] + " ";
	}
	alertMsg +="\n"
}
alert(alertMsg);

*/

// Bubble sort of a array of objects
function sortObjArray(myarray,property,length)
{
	var i=0
	var j=0
	var hold
	for(i=0;i<length;i++)
	{
		for(j=length-1;j>i;j--)
		{
			
			if(eval("myarray[j-1]." + property) > eval("myarray[j]." + property))
			{
				// Exchange j-1 and j arrays
				hold = myarray[j-1]
				myarray[j-1]=myarray[j]
				myarray[j]=hold
			}
		}
	}
}
