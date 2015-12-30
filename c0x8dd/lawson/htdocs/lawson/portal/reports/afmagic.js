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
var FORMSFORMUTILJS="forms/formutil.js";		// constant for error handling

function AFMagic(formWnd, portalWnd)
{
	this.formWnd=formWnd;
	this.portalWnd=portalWnd;
	this.portalObj=this.portalWnd.lawsonPortal;
	
	this.initialized=false;
	this.FYEO=false;
	this.oHTTP=null;
	this.visitedPushScr="";
	this.FC="";
	this.evtType="";
	this.rtnType="ALL";
	this.HK="";
	this.txnHK="";
	this.isFlowchart=false;
	this.strTranXML="";
	this.oSortArray = null;
	var afString = "<?xml version=\"1.0\"?><ACTION><PARAMETERS></PARAMETERS></ACTION>";
	
	this.oldTxn=null;
	this.storage = new this.portalWnd.DataStorage(afString);
	
}

AFMagic.prototype.getElement=function(fldNo)
{
	return (this.storage.getElementValue(fldNo));
}

AFMagic.prototype.transact = function(FC)
{
	this.FC = FC;
	this.getUIData();
	this.beginTransaction()
	
	
	if (this.FC != "I")
	{
		
	}
	this.endTransaction();
}

AFMagic.prototype.endTransaction = function()
{
	if (this.FC == "I")
	{
		this.setUIData();
	}
}

AFMagic.prototype.beginTransaction = function()
{
	if (this.FC == "I")
	{
		
		var actionFrameworkCall = "jobName=" + this.formWnd.jobName + "&jobOwner=" + this.formWnd.jobOwner;
		var api="/lawson-ios/action/InquireJob?" + actionFrameworkCall;
		
		var myXML=this.portalWnd.httpRequest(api,null,"text/html","",false);
		var errMsg="Servlet Xpress reported:\n";
		if (this.portalWnd.oError.isErrorResponse(myXML,true,true,true,errMsg))
		{
			this.errMsg="Unable to load requested form: PDL="+this.pdl+", TKN="+this.tkn;
			this.status=(myXML && myXML.status ? myXML.status : null);
			return null;
		}
		
		try
		{
			
			var frmNode=myXML.selectSingleNode("/ACTION/JOB/JOBSTEP[@jobStepNumber=" + this.formWnd.jobStepNumber + "]");
			this.oldTxn = frmNode;
			
		} catch(e) {
			var prefix="Error loading form XML:\n";
			this.portalWnd.oError.displayExceptionMessage(e,FORMSFORMUTILJS,"loadForm",prefix);
			this.errMsg="Unable to load requested form: PDL="+this.pdl+", TKN="+this.tkn;
			this.status=(myXML && myXML.status ? myXML.status : null);
			myXML=null;
		}
	}
	else
	{
		var api="/lawson-ios/action/UpdateJobStep?";
		var parameters = this.storage.getElementsByTagName("PARAMETERS")[0].childNodes;
		var strParameterXML = "<PARAMETERS>";
		for (var i = 0; i < parameters.length; i++)
		{
			var parameter = parameters[i];
			var parameterId = parameter.nodeName.substring(1);
			var parameterValue = parameter.text;
			strParameterXML = strParameterXML + "<FIELD id=\"" + parameterId + "\" value=\"" + parameterValue + "\" size=\"" + document.getElementById(parameterId).getAttribute("maxlength") + "\" fieldType=\"" + document.getElementById(parameterId).getAttribute("fieldType") + "\" />";
		}
		strParameterXML = strParameterXML + "</PARAMETERS>";
		this.strTranXML = "<ACTION actioname=\"updateJobStep\">";
		this.strTranXML = this.strTranXML + this.oldTxn.xml.toString().substring(0,this.oldTxn.xml.toString().indexOf("</JOBSTEP>") - 1);
		this.strTranXML = this.strTranXML + strParameterXML;
		this.strTranXML = this.strTranXML + "</JOBSTEP>";
		this.strTranXML = this.strTranXML + "<OLDJOBSTEP ";
		this.strTranXML = this.strTranXML + this.oldTxn.xml.toString().substring(9, this.oldTxn.xml.toString().indexOf("</JOBSTEP>") - 1);
		this.strTranXML = this.strTranXML + "</OLDJOBSTEP>";
		this.strTranXML = this.strTranXML + "</ACTION>";
		var myXML=this.portalWnd.httpRequest(api,this.strTranXML,"","",false);
	}
}

AFMagic.prototype.setUIData = function()
{
	var htmElements = this.formWnd.document.getElementsByTagName("*");
	var len = htmElements.length;

	for (var i=0; i < len; i++)
	{
		try {
			var fldId = htmElements[i].id;
			if (fldId)
			{
				var strValue = this.getElement("f" + fldId);
				this.setFieldValue(htmElements[i], strValue);
			}
		} catch (e) { }
	}
}

AFMagic.prototype.setFieldValue = function(fld, value)
{
	var htmElm = fld;
	if (htmElm.nodeName == "INPUT")
	{
		htmElm.value = value;
	}
}

AFMagic.prototype.getUIData = function()
{
	if (this.FC == "I")
	{
		//do ParameterScreen again except this time use section=data
		var actionFrameworkCall = "jobName=" + this.formWnd.jobName + "&jobOwner=" + this.formWnd.jobOwner + "&jobStepNumber=" + this.formWnd.jobStepNumber;
		var api="/lawson-ios/action/ParameterScreen?" + actionFrameworkCall + "&section=data";
		
		var myXML=this.portalWnd.httpRequest(api,null,"","",false);
		var errMsg="Servlet Xpress reported:\n";
		if (this.portalWnd.oError.isErrorResponse(myXML,true,true,true,errMsg))
		{
			this.errMsg="Unable to load requested form: PDL="+this.pdl+", TKN="+this.tkn;
			this.status=(myXML && myXML.status ? myXML.status : null);
			return null;
		}
		
		try
		{
			var frmNode=myXML.selectNodes("/ACTION/PARAMETERS/FIELD");
			for (var i = 0; i < frmNode.length; i++)
				this.setElement("f" + frmNode[i].getAttribute("id"), frmNode[i].getAttribute("value"));
		} catch(e) {
			var prefix="Error loading form XML:\n";
			this.portalWnd.oError.displayExceptionMessage(e,FORMSFORMUTILJS,"loadForm",prefix);
			this.errMsg="Unable to load requested form: PDL="+this.pdl+", TKN="+this.tkn;
			this.status=(myXML && myXML.status ? myXML.status : null);
			myXML=null;
		}
	}
	else
	{
		var htmElements = this.formWnd.document.getElementsByTagName("*");
		var i, len = htmElements.length;
		var fldId, strValue;

		for (i=0; i<len; i++)
		{
			fldId = htmElements[i].id;
			if (fldId && htmElements[i].nodeName == "INPUT")
			{
				strValue = this.getFieldValue(htmElements[i]);
				this.setElement("f" + fldId, strValue);
			}
		}

	}
}

AFMagic.prototype.setElement=function(fldNo, strVal)
{
	if (!this.storage.setElementValue(fldNo, strVal))
	{
		var parNode = this.storage.document.documentElement.childNodes[0]
		var node = this.storage.document.createElement(fldNo)
		strVal=this.portalWnd.xmlDecodeString(strVal);
		node.appendChild(this.storage.document.createTextNode(strVal))
		parNode.appendChild(node)
	}
	return true
}

AFMagic.prototype.getFieldValue=function(fld)
{
	var htmElm=null;
	if(typeof(fld)=="string")
		htmElm = this.formWnd.document.getElementById(fld)
	else if(typeof(fld)=="object")
		htmElm = fld
	
	if (htmElm)
		return htmElm.value;
}



