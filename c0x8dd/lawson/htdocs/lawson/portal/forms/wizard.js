/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/forms/wizard.js,v 1.14.2.5.4.8.6.1.2.3 2012/08/08 12:37:26 jomeli Exp $ */
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

var portalWnd=parent.portalWnd;
var wizObj=null;
var helpObj=null;
var activeObj=null;

// images
var imagesURL="/images";
var backURL=imagesURL + "/wizbackblue.gif";
var cancelURL=imagesURL + "/wizcancelblue.gif";
var continueURL=imagesURL + "/wizcontinueblue.gif";
var finishURL=imagesURL + "/wizfinishblue.gif";
var leftArrowURL=imagesURL + "/wizleftarrowblue.gif";
var rightArrowURL=imagesURL + "/wizrightarrowblue.gif";
var upArrowURL=imagesURL + "/wizuparrowblue.gif";
var downArrowURL=imagesURL + "/wizdownarrowblue.gif";
var selectURL=imagesURL + "/select.gif";

// phrases
var backPhrase="";
var cancelPhrase="";
var continuePhrase="";
var finishPhrase="";
var selectPhrase="";
var noWizardPhrase="";

//-----------------------------------------------------------------------------
function Wizard(portalWnd, wnd, pdl, tkn)
{
	this.portalWnd=portalWnd;
	this.formWnd=wnd;
	this.isVisible=false;
	this.hasDataLoaded=false;
	this.nm="";
	this.pdl=(typeof(pdl)!="undefined") ? pdl : null;
	this.tkn=(typeof(tkn)!="undefined") ? tkn : null;
	this.id=null;
	this.xmlDoc=null;
	this.htmlElement=null;
	this.currentStep=null;
	this.issuedAction=null;
	this.nbrAvailable=0;
	this.stepColl=new StepColl(this.portalWnd);
	this.backHistory=new HistoryColl();
	this.wizPhrases=new this.portalWnd.phraseObj("wizard");
	this.hasError=false;
	this.mode=null;  // [help | wizard | preview]
    this.data="";
}

//-----------------------------------------------------------------------------
Wizard.prototype.showFieldHelp = function(element)
{
    var required="";
    var phraseId="";
    var type="";
    var size="";

	helpObj=this;
	activeObj=this;
	this.mode="help";

	if (!this.hasDataLoaded)
		this.loadFieldHelp();

	if (this.hasDataLoaded)
	{
		// field help for this field already displayed?
		if (this.isVisible && this.nm==element.getAttribute("nm") && 
			this.id==element.getAttribute("id") && this.currentStep && 
			this.currentStep.fld==element.getAttribute("id"))
			return;

		this.nm=element.getAttribute("nm");
		this.id=element.getAttribute("id");
		var fldNbr = this.id.replace(/r\d+/, "r0")
        phraseId=(this.formWnd.reqColl.getItem(fldNbr))
            ? (this.formWnd.reqColl.getItem(fldNbr).req=="1") ? "LBL_REQUIRED" : "LBL_OPTIONAL"
            : "LBL_OPTIONAL";
        required=this.wizPhrases.getPhrase(phraseId) + ",";
		this.htmlElement=this.formWnd.document.body;

        switch (element.getAttribute("edit"))
        {
            case "date":
            case "time":
                phraseId="LBL_" + element.getAttribute("edit").toUpperCase();
                size=(element.getAttribute("maxlength"))
                    ? element.getAttribute("maxlength")
                    : "";
                break;
            case "numeric":
            case "signed":
                phraseId="LBL_" + element.getAttribute("edit").toUpperCase();
                var decSep=this.portalWnd.oUserProfile.getAttribute("decimalseparator");
	            var maxLength=parseInt(element.getAttribute("maxlength"),10);
	            var signed=element.getAttribute("edit")=="signed" ? 1 : 0;
	            var decSZ=element.getAttribute("decsz") 
	                ? parseInt(element.getAttribute("decsz"),10) 
	                : 0;
	            var dec = (decSZ) ? 1 : 0;
	            var wholeExp = maxLength - signed - decSZ - dec;
	            var decExp = (decSZ) ? decSep + decSZ : "";
                size=wholeExp + decExp;
                break;
            case "upper":
            default:
                if (element.getAttribute("tp") && element.getAttribute("tp")=="push")
                {
                    required="";
                    phraseId="LBL_BUTTON";
                }
                else
                {
                    phraseId="LBL_ALPHA";
                    size=(element.getAttribute("maxlength"))
                        ? element.getAttribute("maxlength")
                        : "";
                    break;
                }
        }
        type=this.wizPhrases.getPhrase(phraseId);
        this.data=required + " " + type + " " + size + "\r\n";

		if (this.populateFieldHelp())
		{
			this.currentStep=this.stepColl.steps[0];
			if (this.currentStep.show(this.htmlElement))
				this.isVisible=true;
			else
				this.hide();
		}
		else
			this.hide();
	}
}

//-----------------------------------------------------------------------------
Wizard.prototype.loadFieldHelp = function()
{
	this.hasDataLoaded=false;
	this.xmlDoc=this.portalWnd.httpRequest("/cgi-lawson/objprop.exe?" + this.pdl + "&" + this.tkn + "&OUT=XML", null, null, null, false);

	var msg=portalWnd.lawsonPortal.getPhrase("msgErrorInvalidResponse") + " objprop.\n\n";
	if (portalWnd.oError.isErrorResponse(this.xmlDoc,true,true,false,msg,window))
		msg=this.wizPhrases.getPhrase("OBJPROP_ERROR1");

	this.xmlDoc=new this.portalWnd.DataStorage(this.xmlDoc);
	this.hasDataLoaded=true;
}

//-----------------------------------------------------------------------------
Wizard.prototype.populateFieldHelp = function()
{
	var nm = this.nm;
	var oNameItem = this.formWnd.namColl.getNameItem(nm);
	var oc = oNameItem.oc;
	var det = oNameItem.det;
	
	if(oc.length > 0 && !det)
	{
		var ocId = parseInt(oc,10) + 1
		nm = nm.substr(0,nm.lastIndexOf(ocId))
	}

	var node=this.xmlDoc.getNodeByAttributeId("prop", "scrfld", nm);
	if (!node) return false;

	var description=node.getElementsByTagName("description").item(0);
	var text=description.childNodes[0].nodeValue;
	if (!text || text.length==0) return false;
	text=text.trim();
	if (text.length==0) return false;
    text=this.data + text;

	this.stepColl=new StepColl(this.portalWnd);
	this.stepColl.addItem(this.nm, this.nm, this.id, "Text", text);
	this.currentStep=this.stepColl.steps[0];
	return true;
}

//-----------------------------------------------------------------------------
Wizard.prototype.showWizard = function(id)
{
	wizObj=this;
	activeObj=this;
	this.mode="wizard";
	this.htmlElement=this.formWnd.document.body;
	this.id=null;
		
	if (!this.hasDataLoaded)
		this.loadWizard();

	if (!this.hasDataLoaded) return;

	if (typeof(id)=="undefined" || id==null)
	{
		if (this.nbrAvailable>1)
		{
			this.selectWizard();
			return;
		}
		else
			this.id=0;
	}
	else
		this.id=parseInt(id);

	if (this.id!=null && !isNaN(this.id))
	{
		this.populateWizard();
		if (this.stepColl.length>0)
		{
			this.currentStep=this.stepColl.steps[0];
			this.currentStep.show(this.htmlElement);
			this.isVisible=true;
		}
	}
}

//-----------------------------------------------------------------------------
Wizard.prototype.preview = function(oXML)
{
	wizObj=this;
	activeObj=this;
	this.htmlElement=this.formWnd.document.body;
	if (typeof(oXML)=="undefined" || oXML==null) return;
		
	var xmlDoc=new this.portalWnd.DataStorage(oXML);
	var preWiz=xmlDoc.document.getElementsByTagName("WIZARD").item(0);
	if (!preWiz) return;

	this.id=0;
	this.xmlDoc=xmlDoc;
	this.nbrAvailable=1;
	this.hasDataLoaded=true;
	this.mode="preview";

	backPhrase=this.wizPhrases.getPhrase("LBL_BACK");
	cancelPhrase=this.wizPhrases.getPhrase("LBL_CANCEL");
	continuePhrase=this.wizPhrases.getPhrase("LBL_CONTINUE");
	finishPhrase=this.wizPhrases.getPhrase("LBL_FINISH");

	this.populateWizard();
	if (this.stepColl.length>0)
	{
		this.currentStep=this.stepColl.steps[0];
		this.currentStep.show(this.htmlElement);
		this.isVisible=true;
	}
}

//-----------------------------------------------------------------------------
Wizard.prototype.loadWizard = function()
{ 
	var pWnd=this.portalWnd;
	backPhrase=this.wizPhrases.getPhrase("LBL_BACK");
	cancelPhrase=this.wizPhrases.getPhrase("LBL_CANCEL");
	continuePhrase=this.wizPhrases.getPhrase("LBL_CONTINUE");
	finishPhrase=this.wizPhrases.getPhrase("LBL_FINISH");
	selectPhrase=this.wizPhrases.getPhrase("SELECT_WIZARD");
	noWizardPhrase=this.wizPhrases.getPhrase("NO_WIZARD");

	this.hasDataLoaded=false;
	this.xmlDoc=null;
	var xmlDoc=pWnd.fileMgr.getFile(pWnd.lawsonPortal.path + "/content/wizards",
			 this.tkn.toLowerCase()+".xml", "text/xml", false);
	if ( (!xmlDoc || xmlDoc.status) 
	|| (pWnd.fileMgr.getStatus(xmlDoc) != "0") )
	{
		pWnd.lawsonPortal.setMessage(noWizardPhrase);
		return;
	}

	xmlDoc=new pWnd.DataStorage(xmlDoc);
	var availWiz=xmlDoc.document.getElementsByTagName("WIZARD");
	if (!availWiz || availWiz.length==0) 
	{
		pWnd.lawsonPortal.setMessage(noWizardPhrase);
		return;
	}

	this.xmlDoc=xmlDoc;
	this.nbrAvailable=availWiz.length;

	this.hasDataLoaded=true;
}

//-----------------------------------------------------------------------------
Wizard.prototype.populateWizard = function()
{ 
	var wizNode=this.xmlDoc.document.getElementsByTagName("WIZARD").item(this.id);
	if (!wizNode) return;

	for (var i=0; i<wizNode.childNodes.length; i++)
	{
		if (wizNode.childNodes[i].nodeName!="STEP") continue;

		var btnColl=new ButtonColl();
		if (this.stepColl.length==0)
			btnColl.startButtons();
		else
			btnColl.stepButtons();
		this.stepColl.addNode(wizNode.childNodes[i], wizClickButton, btnColl);
	}

	if (this.stepColl.length>0)
	{
		var btnColl=new ButtonColl();
		btnColl.finishButtons();
		var step=this.stepColl.steps[this.stepColl.length-1];
		step.btnColl=btnColl;
	}
}

//-----------------------------------------------------------------------------
Wizard.prototype.selectWizard = function()
{
	var elem=document.getElementById("wizDiv");
	if (elem)
		elem.parentNode.removeChild(elem);

	if (this.nbrAvailable==0) return;
	var formPath=this.portalWnd.lawsonPortal.path;
	var wizDiv=wizAppendNode("div", this.htmlElement, "wizDiv", "wizDiv");
	wizAddEventHandler(wizDiv, "click", wizClickWizard, false);
	wizAddEventHandler(wizDiv, "selectstart", wizSelectStart, false);
	var contDiv=wizAppendNode("div", wizDiv, "wizCont", "wizCont");
	var instrDiv=wizAppendNode("div", contDiv, "wizInstr", "wizInstr");
	instrDiv.style.textAlign="center";
	var txtNode=document.createTextNode(selectPhrase);
	instrDiv.appendChild(txtNode);
 	var selectDiv=wizAppendNode("div", instrDiv, "", "wizSelects");
	selectDiv.style.textAlign="left";

	var availWiz=this.xmlDoc.document.getElementsByTagName("WIZARD");
	for (var i=0; i<availWiz.length; i++)
	{
		var listDiv=wizAppendNode("div", selectDiv, "wizList", "wizList");
		var listItem=wizAppendNode("span", listDiv, "wizButton", "wiz" + i);
		listItem.className=(i==0) ? "wizButtonSelected" : "wizButton";
		listItem.setAttribute("selected", ((i==0) ? "true" : "false"));
		wizAddEventHandler(listItem, "mouseover", wizToggleHighlight, false); 
		wizAddEventHandler(listItem, "mouseout", wizToggleHighlight, false);
		wizAddEventHandler(listItem, "click", wizSelectWizard, false);

		var img=wizAppendNode("img", listItem, "wizImage");
		img.setAttribute("src", formPath + selectURL);
		img.style.height="12px";
		img.style.width="12px";

		var label=wizAppendNode("label", listItem, "wizLabel");
		var txtNode=document.createTextNode(availWiz[i].getAttribute("name"));
		label.appendChild(txtNode);
	}

	selectDiv.setAttribute("nbr", i);
	var navDiv=wizAppendNode("div", contDiv, "wizNav", "wizNav");
	var btnDiv=wizAppendNode("span", navDiv, "wizButton", "wizcancel");
	wizAddEventHandler(btnDiv, "click", wizClickButton, false);		

	var img = wizAppendNode("img", btnDiv, "wizImage");
	img.setAttribute("src", formPath + cancelURL);

	var label=wizAppendNode("label", btnDiv, "wizLabel");
	var txtNode=document.createTextNode(cancelPhrase);
	label.appendChild(txtNode);

	wizRenderInCenter();
	this.isVisible=true;
}

//-----------------------------------------------------------------------------
Wizard.prototype.hide = function()
{ 
	var elem=document.getElementById("wizDiv");
	if (elem)
		elem.parentNode.removeChild(elem);

	this.isVisible=false;
	this.currentStep=null;
	this.issuedAction=null;
	this.stepColl=new StepColl(this.portalWnd);
	this.backHistory=new HistoryColl();
	activeObj=null;
}

//-----------------------------------------------------------------------------
Wizard.prototype.destroy = function()
{ 
	var elem=document.getElementById("wizDiv");
	if (elem)
		elem.parentNode.removeChild(elem);

	wizObj=null;
	helpObj=null;
	activeObj=null;
}

//-----------------------------------------------------------------------------
Wizard.prototype.back = function()
{
	if (this.backHistory.length>0)
	{
		this.currentStep=this.backHistory.items[this.backHistory.length-1];
		this.backHistory.removeLastItem();
		if (this.currentStep.isHidden)
			this.back();
		else
		{
			if (this.currentStep.show(this.htmlElement)==false)
				this.back();
		}
	}
	else
		this.finish();
}

//-----------------------------------------------------------------------------
Wizard.prototype.cancel = function()
{ 
	this.hide();
}

//-----------------------------------------------------------------------------
Wizard.prototype.next = function()
{
	if (this.currentStep.hasFunction)
	{
		this.issuedAction=this.currentStep;
		lawformDoFunction(this.currentStep.fc);
		if (this.formWnd.formState.agsError) return;
	}
	
	// if function call caused an error, let the error
	// handler determine the next step.
	if (this.hasError)
	{
		this.hasError=false;		
		return;
	}

	var nextStep=null;			
	if (this.currentStep.branches && this.currentStep.fld.length>0)
	{
		var fldValue=activeObj.formWnd.lawForm.getElementValue(this.currentStep.fld);
		var lenBranches=this.currentStep.branches.length;
		for (var i=0;i<lenBranches;i++)
		{
			if (this.currentStep.branches[i].test(fldValue))
			{
				nextStep=this.currentStep.branches[i].children.steps[0];
			}
		}
	}

	if (nextStep==null)
		nextStep=this.currentStep.nextSibling;

	if (nextStep==null)
	{
		var parent=this.currentStep.parentNode;
		while (parent!=null && nextStep==null)
		{
			nextStep=parent.nextSibling;
			if (nextStep==null)
				parent=nextStep.parentNode;
		}
	}
	if (nextStep)
	{
		this.backHistory.addItem(this.currentStep);
		this.currentStep=nextStep;
		if (this.currentStep.isHidden)
			this.next();
		else
		{
			if (this.currentStep.show(this.htmlElement)==false)
				this.next();
		}
	}
	else
		this.finish();
}

//-----------------------------------------------------------------------------
Wizard.prototype.finish = function()
{ 
	if (this.currentStep.hasFunction)
		lawformDoFunction(this.currentStep.fc)		

	this.hide();
}

//-----------------------------------------------------------------------------
Wizard.prototype.errorHandler = function(errfld)
{
	if (this.issuedAction!=null)
	{
		var stepHistory=null;
		if (this.issuedAction.isHidden)
		{
			var index=this.backHistory.getItemIndex(this.issuedAction.id)
			if (index!=null) index--;

			while (stepHistory==null && index>=0 && index<this.backHistory.length)
			{
				var stepHistory=this.backHistory.items[index];
				if (stepHistory!=null)
					stepHistory=(stepHistory.isHidden) ? null : stepHistory;
				index--;
			}
		}
		else
			stepHistory=this.issuedAction;

		if (stepHistory!=null)
		{
			// remove items in history from the end to this one
			var index=this.backHistory.getItemIndex(stepHistory.id);
			while (index!=null && index<this.backHistory.length)
				this.backHistory.removeLastItem();

			this.currentStep=stepHistory;
			this.hasError=true;
			this.currentStep.show(this.htmlElement);
		}
		this.issuedAction=null;
	}
}

//-----------------------------------------------------------------------------
Wizard.prototype.cntxtActionHandler = function(evt,action)
{
	var elem=this.portalWnd.getEventElement(evt);
	var bHandled=false;

	// NS bug causes the browser to crash
	if (!this.portalWnd.oBrowser.isIE) return bHandled;

	var keyVal=evt.keyCode;
	var wizDiv=document.getElementById("wizDiv");
	if (!wizDiv) return bHandled;

	// first check for standard action ids
	switch (action)
	{
	case "doCancel":
		activeObj.cancel();
		return true;
		break
	case "doNext":
		var elem=document.getElementById("wizcontinue");
		if (elem)
		{
			activeObj.next();
			return true;
		}
		elem=document.getElementById("wizfinish");
		if (elem)
		{
			activeObj.finish();
			return true;
		}
		break;
	case "doPrev":
		var elem=document.getElementById("wizback");
		if (elem)
		{
			activeObj.back();
			return true;
		}
		break;
	}

	// now check for custom key codes
	if (keyVal==9)	// tab key
	{
		var select=document.getElementById("wizSelects");
		if (!select) return bHandled;

		if ( !evt.altKey && !evt.ctrlKey && !evt.shiftKey )
		{
			var xmlDoc=new this.portalWnd.DataStorage(wizDiv)
			var listItem=xmlDoc.getNodeByAttributeId("span", "selected", "true");
			if (listItem)
			{
				var id=parseInt(listItem.id.replace("wiz", ""));
				if (id < parseInt(select.getAttribute("nbr"))-1)
				{
					listItem.className="wizButton";
					listItem.setAttribute("selected", "false");
					var selectItem=document.getElementById("wiz"+(id+1))
					selectItem.className="wizButtonSelected";
					selectItem.setAttribute("selected", "true");
				}
			}
			bHandled=true;
		}
		else if( !evt.altKey && !evt.ctrlKey && evt.shiftKey )
		{
			var xmlDoc=new this.portalWnd.DataStorage(wizDiv)
			var listItem=xmlDoc.getNodeByAttributeId("span", "selected", "true");
			if (listItem)
			{
				var id=parseInt(listItem.id.replace("wiz", ""));
				if (id > 0)
				{
					listItem.className="wizButton";
					listItem.setAttribute("selected", "false");
					var selectItem=document.getElementById("wiz"+(id-1))
					selectItem.className="wizButtonSelected";
					selectItem.setAttribute("selected", "true");
				}
			}
			bHandled=true;
		}
	}
	else if (keyVal==13) // enter key
	{
		var select=document.getElementById("wizSelects");
		if (!select) return bHandled; 
		var xmlDoc=new this.portalWnd.DataStorage(wizDiv)
		var btn=xmlDoc.getNodeByAttributeId("span", "selected", "true");
		if (btn)
		{
			wizClickHandler(btn);
			bHandled=true;
		}
	}
	else if (keyVal==38) //arrow up
	{
		var select=document.getElementById("wizSelects");
		if (!select) return bHandled; 
		var xmlDoc=new this.portalWnd.DataStorage(wizDiv)
		var listItem=xmlDoc.getNodeByAttributeId("span", "selected", "true");
		if (listItem)
		{
			var id=parseInt(listItem.id.replace("wiz", ""));
			if (id > 0)
			{
				listItem.className="wizButton";
				listItem.setAttribute("selected", "false");
				var selectItem=document.getElementById("wiz"+(id-1))
				selectItem.className="wizButtonSelected";
				selectItem.setAttribute("selected", "true");
			}
		}
		bHandled=true;
	}
	else if (keyVal==40) //arrow dn
	{
		var select=document.getElementById("wizSelects");
		if (!select) return bHandled; 
		var xmlDoc=new this.portalWnd.DataStorage(wizDiv)
		var listItem=xmlDoc.getNodeByAttributeId("span", "selected", "true");
		if (listItem)
		{
			var id=parseInt(listItem.id.replace("wiz", ""));
			if (id < parseInt(select.getAttribute("nbr"))-1)
			{
				listItem.className="wizButton";
				listItem.setAttribute("selected", "false");
				var selectItem=document.getElementById("wiz"+(id+1))
				selectItem.className="wizButtonSelected";
				selectItem.setAttribute("selected", "true");
			}
		}
		bHandled=true;
	}
	return bHandled;
}

//-----------------------------------------------------------------------------
Wizard.prototype.getFieldByAttribute = function(attrName, attrVal)
{
	var fld=null;
	var inpFlds=this.formWnd.document.getElementsByTagName("*");
	if (!inpFlds) return fld;

	var len=inpFlds.length;
	for (var i=0; i < len; i++)
	{
		if (inpFlds[i].nodeName.toLowerCase() != "input"
		&& inpFlds[i].nodeName.toLowerCase() != "button")
			continue;
		if (!inpFlds[i].getAttribute(attrName)
		|| inpFlds[i].getAttribute(attrName) != attrVal)
			continue;
		fld=inpFlds[i].getAttribute("id");
		break;
	}

	if (!fld)
	{
		// if using XSLT the field may not be generated yet
		if (this.portalWnd.lawsonPortal.xsltSupport)
		{
			var node=this.formWnd.lawForm.IEXML.selectSingleNode("//fld[@"+attrName+"='"+attrVal+"']");
			if (node)
				fld=node.getAttribute("nbr");
		}
	}

	return fld;
}

//-----------------------------------------------------------------------------
function StepColl(portalWnd)
{
	this.portalWnd=portalWnd;
	this.length=0;
	this.steps=new Array();
	this.stepIndex=new Object();
}

//-----------------------------------------------------------------------------
StepColl.prototype.addNode = function(oStep, callback, oBtnColl, parent)
{
	var stepNode=new Step(this.portalWnd);
	stepNode.populateByObject(oStep, callback, oBtnColl, parent);

	var i=this.length;
	this.steps[i]=stepNode;
	this.stepIndex[stepNode.id]=i;
	this.length=this.steps.length;
	
	if (this.length>1)
	{
		var previous=this.steps[i-1];
		previous.nextSibling=stepNode;
	}
}

//-----------------------------------------------------------------------------
StepColl.prototype.addItem = function(id, nm, fld, type, text)
{
	var stepNode=new Step(this.portalWnd);
	stepNode.populateByParams(id, nm, fld, type, text);

	var i=this.length;
	this.steps[i]=stepNode;
	this.stepIndex[stepNode.id]=i;
	this.length=this.steps.length;
}

//-----------------------------------------------------------------------------
function Branch(portalWnd, xml, callback, oBtnColl, step)
{
	this.portalWnd=portalWnd;
	this.children=null;
	this.condition=xml.getAttribute("test");
	
	var len=xml.childNodes.length;
	for (var i=0; i<len; i++)
	{
		if (xml.childNodes[i].nodeName=="STEP")
		{
			if (!this.children)
				this.children=new StepColl(this.portalWnd);
			this.children.addNode(xml.childNodes[i], callback, oBtnColl, step);
		}
	}	
}

//-----------------------------------------------------------------------------
Branch.prototype.test = function(value)
{
	return (this.condition==value)?true:false;
}

//-----------------------------------------------------------------------------
function Step(portalWnd)
{
	this.portalWnd=portalWnd;
	this.id="";
	this.fc="";
	this.nm="";
	this.fld="";
	this.type="";
	this.text="";
	this.isHidden=false;
	this.hasBranch=false;
	this.hasFunction=false;
	this.callback=null;
	this.btnColl=null;
	this.branches=null;
	this.nextSibling=null;
	this.parentNode=null;
}

//-----------------------------------------------------------------------------
Step.prototype.populateByObject = function(oStep, callback, oBtnColl, parent)
{
	this.id=oStep.getAttribute("id");
	this.fc=oStep.getAttribute("FC");
	this.hasFunction=(this.fc.length!=0);
	this.nm=oStep.getAttribute("fld");
	this.type=oStep.getAttribute("type");
	this.isHidden=(this.type=="Hidden");
	var info=oStep.getElementsByTagName("INFO").item(0);
	this.text=(info.hasChildNodes()) ? info.childNodes[0].nodeValue : " ";
	this.callback=callback;
	this.btnColl=oBtnColl;
	if (typeof(parent)!="undefined" && parent!=null)
		this.parentNode=parent;
	var arrBranches=oStep.getElementsByTagName("BRANCH");
	var lenBranches=(arrBranches?arrBranches.length:0);
	var hasChildren=false;
	var branch=null;
	for (var i=0;i<lenBranches;i++)
	{
		branch=new Branch(this.portalWnd, arrBranches[i], callback, oBtnColl, this);
		if (branch.children && branch.condition)
		{
			if (!this.branches)
				this.branches=new Array();
			this.branches[this.branches.length]=branch;
		}	
	}
}

//-----------------------------------------------------------------------------
Step.prototype.populateByParams = function(id, nm, fld, type, text)
{
	this.id=id;
	this.nm=nm;
	this.fld=fld;
	this.type=type;
	this.text=text;
}

//-----------------------------------------------------------------------------
Step.prototype.show = function(htmlElement)
{
	var elem=document.getElementById("wizDiv");
	if (elem)
		elem.parentNode.removeChild(elem);

	var formPath=this.portalWnd.lawsonPortal.path;
	var wizDiv=wizAppendNode("div", htmlElement, "wizDiv", "wizDiv");
	wizAddEventHandler(wizDiv, "click", wizClickWizard, false);		
	wizAddEventHandler(wizDiv, "selectstart", wizSelectStart, false);		
	var contDiv=wizAppendNode("div", wizDiv, "wizCont", "wizCont");
	var instrDiv=wizAppendNode("div", contDiv, "wizInstr", "wizInstr");
	var instr=this.text.trim();
	instr = this.portalWnd.xmlEncodeString(instr);
	var re = new RegExp("\n|\r", "g");
	instr = instr.replace(re, "<br>");
	instrDiv.innerHTML = instr;
	wizAddEventHandler(instrDiv, "scroll", wizClickWizard, false);

	if (this.btnColl)
	{
		var navDiv=wizAppendNode("div", contDiv, "wizNav", "wizNav");
		for (var i=0; i<this.btnColl.length; i++)
		{
			var btnDiv=wizAppendNode("span", navDiv, "wizButton", this.btnColl.buttons[i].id);
			wizAddEventHandler(btnDiv, "click", this.callback, false);		

			var img=wizAppendNode("img", btnDiv, "wizImage");
			img.setAttribute("src", formPath + this.btnColl.buttons[i].image);

			var label=wizAppendNode("label", btnDiv, "wizLabel");
			var txtNode=document.createTextNode(this.btnColl.buttons[i].text);
			label.appendChild(txtNode);
		}
	}

	if (this.nm.length==0)
		wizRenderInCenter();
	else
	{
		if (this.fld.length==0)
		{
			var fld=activeObj.getFieldByAttribute("nm", this.nm);
			this.fld=(fld!=null) ? fld : "";
		}

		if (this.fld.length>0)
		{
			var elem=this.portalWnd.frmFieldIntoView(activeObj.formWnd, this.fld);
			if (!elem) return false;

			if (activeObj.mode=="wizard" || activeObj.mode=="preview")
			{
				if (this.fld.indexOf("r") > 0)
					this.portalWnd.frmSetActiveRow(activeObj.formWnd, elem);
				activeObj.formWnd.lawForm.positionInField(elem.id);
			}

			var arrowDiv=wizAppendNode("div", wizDiv, "wizArrow", "wizArrow");
			var arrowImg=wizAppendNode("img", arrowDiv, "wizArrowImg", "wizArrowImg");

			var obj=elem;
			var tp=0;
			var lft=0;
			var arrowTop=0;
			var contTop=0;
			var arrow="";
			while(obj.offsetParent)
			{
				tp+=parseInt(obj.offsetTop);
				lft+=parseInt(obj.offsetLeft);
				obj=obj.offsetParent;
			}

			if (instrDiv.offsetHeight>=200)
			{
				instrDiv.style.height="200px";
				instrDiv.style.overflow="auto";
			}

			if (this.portalWnd.oBrowser.isIE)
			{
				var bodyTop=document.body.offsetTop;
				var bodyHeight=document.body.offsetHeight;
				var bodyWidth=document.body.offsetWidth;
				var scrollDown=document.body.scrollTop;
				var scrollLeft=document.body.scrollLeft;
			}
			else
			{
				var bodyTop=this.portalWnd.lawsonPortal.contentFrame.offsetTop;
				var bodyHeight=this.portalWnd.lawsonPortal.contentFrame.offsetHeight;
				var bodyWidth=this.portalWnd.lawsonPortal.contentFrame.offsetWidth;
				var scrollDown=window.scrollY;
				var scrollLeft=window.scrollX;
			}

			if (bodyHeight>tp+contDiv.offsetHeight+elem.offsetHeight+3-scrollDown)
			{
				// postion below field
				tp=tp;
				contTop=0;
				arrowTop=0;
			}
			else
			{
				// position above field
				tp=tp-contDiv.offsetHeight+elem.offsetHeight;
				contTop=0;
				arrowTop=contDiv.offsetHeight-15;
			}

			if(bodyWidth>lft+contDiv.offsetWidth+elem.offsetWidth+26-scrollLeft)
			{
				// position to right
				lft=(adjustForSelect(elem)) ? lft+15 : lft+6;
				lft=lft+elem.offsetWidth+"px";
				arrow="left";
			}
			else if (lft<contDiv.offsetWidth+15)
			{
				if (arrowTop==0)
				{
					// position to bottom - up arrow
					tp=tp+elem.offsetHeight+5;
					arrow="up";
				}
				else
				{
					// position to top - down arrow
					tp=tp-elem.offsetHeight-10;
					arrow="down";
					arrowTop=contDiv.offsetHeight-15;
				}
				lft=lft+15;
			}
			else
			{
				// position to left
				lft=lft-contDiv.offsetWidth-10-15+"px";
				arrow="right";
			}

			switch(arrow)
			{
				case "left":
					arrowImg.setAttribute("src", formPath + leftArrowURL);
					arrowDiv.style.left="0px";
					contDiv.style.left="18px";
					break;
				case "right":
					arrowImg.setAttribute("src", formPath + rightArrowURL);
					arrowDiv.style.left=contDiv.offsetWidth+2;
					contDiv.style.left="0px";
					break;
				case "up" :
					arrowImg.setAttribute("src", formPath + upArrowURL);
					arrowDiv.style.left="0px";
					contDiv.style.left="20px";
					break;
				case "down" :
					arrowImg.setAttribute("src", formPath + downArrowURL);
					arrowDiv.style.left="0px";
					contDiv.style.left="20px";
					break;
			}

			arrowDiv.style.display="block";
			arrowDiv.style.position="absolute";
			arrowDiv.style.top=arrowTop;						

			contDiv.style.display="block";
			contDiv.style.position="absolute";
			contDiv.style.top=contTop;						

			wizDiv.style.display="block";
			wizDiv.style.position="absolute";
			wizDiv.style.top=tp;
			wizDiv.style.left=lft;
			wizDiv.style.visibility="visible";
			wizDiv.style.zIndex=99;
		}
		else
			return false;
	}
	return true;
}

//-----------------------------------------------------------------------------
function ButtonColl()
{
	this.length=0;
	this.buttons=new Array();
	this.buttonIndex=new Object();
}

//-----------------------------------------------------------------------------
ButtonColl.prototype.addItem = function(id, text, image)
{
	var button=new Object();
	button.id=id
	button.text=text
	button.image=image

	var i=this.length;
	this.buttons[i]=button;
	this.buttonIndex[button.id]=i;
	this.length=this.buttons.length;
}

//-----------------------------------------------------------------------------
ButtonColl.prototype.startButtons = function()
{
	this.addItem("wizcancel", cancelPhrase, cancelURL);
	this.addItem("wizcontinue", continuePhrase, continueURL);
}

//-----------------------------------------------------------------------------
ButtonColl.prototype.stepButtons = function()
{
	this.addItem("wizcancel", cancelPhrase, cancelURL);
	this.addItem("wizback", backPhrase, backURL);
	this.addItem("wizcontinue", continuePhrase, continueURL);
}

//-----------------------------------------------------------------------------
ButtonColl.prototype.finishButtons = function()
{
	this.addItem("wizcancel", cancelPhrase, cancelURL);
	this.addItem("wizback", backPhrase, backURL);
	this.addItem("wizfinish", finishPhrase, finishURL);
}

//-----------------------------------------------------------------------------
function HistoryColl()
{
	this.length=0;
	this.items=new Array();
	this.itemIndex=new Object();
}

//-----------------------------------------------------------------------------
HistoryColl.prototype.addItem = function(item)
{
	var i=this.length;
	this.items[i]=item;
	this.itemIndex[item.id]=i;
	this.length=this.items.length;
}

//-----------------------------------------------------------------------------
HistoryColl.prototype.getItemIndex = function(id)
{
	var index;

	index=this.itemIndex[id];
	if(typeof(index)=="undefined")
		index=null;

	return index;
}

//-----------------------------------------------------------------------------
HistoryColl.prototype.removeLastItem = function()
{
	if (this.length>0)
	{
		var item=this.items[this.length-1];
		if (item)
			this.itemIndex[item.id]=null;
		this.items[this.length-1]=null;
		this.items.length--;
		this.length=this.items.length;
	}
}

//-----------------------------------------------------------------------------
function wizAppendNode(name, parent, cls, id)
{
	var obj = document.createElement(name)

	if (typeof(cls)!="undefined" && cls!=null)
		obj.className = cls

	if (typeof(id)!="undefined" && id!=null)
		obj.id = id

	parent.appendChild(obj)
	return obj
}

//-----------------------------------------------------------------------------
function wizAddEventHandler(elem, evt, functionRef, bCapture)	
{
	if (portalWnd.oBrowser.isIE)
		elem.attachEvent("on" + evt, functionRef)
	else
		elem.addEventListener(evt, functionRef, bCapture)
}

//-----------------------------------------------------------------------------
function wizToggleHighlight(evt)
{ 
    evt=portalWnd.getEventObject(evt,window);
    if (!evt) return;

	var elem=portalWnd.getEventElement(evt);
	while (elem.tagName!="SPAN" && elem.parentNode!=null)
		elem=elem.parentNode;

	var selected=(elem.getAttribute("selected")=="true");
	var className=(selected) ? "wizButtonSelected" : "wizButton";
	elem.className= (evt.type == "mouseover"
			? (selected ? "wizButtonSelected" : "wizButtonHighlight")
			: className);
}

//-----------------------------------------------------------------------------
function wizSelectWizard(evt)
{ 
    evt=portalWnd.getEventObject(evt,window);
    if (!evt) return;

	var elem=portalWnd.getEventElement(evt);
	while (elem.tagName!="SPAN" && elem.parentNode!=null)
		elem=elem.parentNode;

	wizObj.id=parseInt(elem.id.replace("wiz", ""));
	wizObj.showWizard(wizObj.id);
}

//-----------------------------------------------------------------------------
function wizClickButton(evt)
{ 
    evt=portalWnd.getEventObject(evt,window);
    if (!evt) return;

	var elem=portalWnd.getEventElement(evt);
	while (elem.tagName!="SPAN" && elem.parentNode!=null)
		elem=elem.parentNode;

	switch (elem.id)
	{
		case "wizback":
			wizObj.back();
			break;
		case "wizcancel":
			wizObj.cancel();
			break;
		case "wizcontinue":
			wizObj.next();
			break;
		case "wizfinish":
			wizObj.finish();
			break;
	}
}

//-----------------------------------------------------------------------------
function wizClickWizard(evt)
{
	if (activeObj && activeObj.formWnd.lastControl)
		activeObj.formWnd.lastControl.focus();
}

//-----------------------------------------------------------------------------
function wizSelectStart()
{
	return false;
}

//-----------------------------------------------------------------------------
function wizClickHandler(elem)
{
	if (elem.id.indexOf("wiz")!=-1)
	{
		wizObj.id=parseInt(elem.id.replace("wiz", ""));
		wizObj.showWizard(wizObj.id);
	}
}

//-----------------------------------------------------------------------------
String.prototype.trim = function()
{
    // Trim leading and trailing spaces
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

//-----------------------------------------------------------------------------
function adjustForSelect(elem)
{
	var attr=elem.getAttribute("hsel")
	if (attr && attr=="1")
		return true;

	var attr=elem.getAttribute("tp")
	if (attr && (attr=="select" || attr=="fc"))
		return true;
			
	var attr=elem.getAttribute("edit")
	if (attr && attr=="date")
		return true;

	return false;
}

//-----------------------------------------------------------------------------
function wizRenderInCenter()
{
	var wizDiv=document.getElementById("wizDiv");
	var contDiv=document.getElementById("wizCont");
	var instrDiv=document.getElementById("wizInstr");

	if (instrDiv.offsetHeight>=200)
	{
		instrDiv.style.height="200px";
		instrDiv.style.overflow="auto";
	}

	if (portalWnd.oBrowser.isIE)
	{
		var scrWidth=document.body.offsetWidth
		var scrHeight=document.body.offsetHeight
	}	
	else
	{
		var scrWidth=window.innerWidth
		var scrHeight=window.innerHeight
	}

	wizDiv.style.display="block";
	wizDiv.style.position="absolute";
	wizDiv.style.top=scrHeight/2-contDiv.offsetHeight/2-50;
	wizDiv.style.left=scrWidth/2-contDiv.offsetWidth/2;
	wizDiv.style.visibility="visible";
	wizDiv.style.zIndex=99;
}