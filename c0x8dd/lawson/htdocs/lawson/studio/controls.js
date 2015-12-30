/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/controls.js,v 1.4.6.1.22.2 2012/08/08 12:48:50 jomeli Exp $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// controls.js
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

function Toolbox(DOMNode)
{
	this.controlGroups = new LawCollection();
	this.activeCtlGrp = "";
	var ctlGrps = DOMNode.selectNodes(".//CONTROLGROUP");
	var ctlGrpDOM=null;
	var ctlGrp=null;
	var folder = designStudio.activeDesigner.designerInfo.folder;
	var len = ctlGrps.length;
	for (var i=0; i<len; i++)
	{
		if(ctlGrps[i].getAttribute("file"))
		{
			var path=folder+"/controls/"+ctlGrps[i].getAttribute("file");
			ctlGrpDOM = SSORequest(path);
			ctlGrpDOM = ctlGrpDOM.documentElement;
		}
		else
			ctlGrpDOM = ctlGrps[i];
		if(!ctlGrpDOM)break;
		ctlGrp = new ControlGroup(ctlGrpDOM);
		this.controlGroups.add(ctlGrps[i].getAttribute("id"), ctlGrp);
		if(ctlGrp.active)this.activeCtlGrp = ctlGrp.id
	}
	this.paint = paintToolbox;
}

Toolbox.prototype.getControlObject=function(ctlId, grpId)
{
	var i=0;
	var ctlGrp;
	var ctl;
	try	{
		if(typeof(grpId) == "undefined")
		{
			var len = this.controlGroups.count;
			for (i=0; i<len; i++)
			{
				ctlGrp = this.controlGroups.item(i);
				ctl = ctlGrp.controls.item(ctlId);
				if(ctl)
					return ctl;
			}
		}
		else
		{
			ctlGrp = this.controlGroups.item(grpId);
			ctl = ctlGrp.controls.item(ctlId);
			if(ctl)
				return ctl;
		}
	}
	catch(e) {	}
	return null;
}
Toolbox.prototype.createInstance=function(ctlId)
{
	var ctl = this.getControlObject(ctlId);
	if(!ctl)return null;
	return ctl.createInstance();
}

function ControlGroup(DOMNode)
{
	this.id= DOMNode.getAttribute("id");
	this.name = designStudio.activeDesigner.stringTable.getPhrase(DOMNode.getAttribute("phraseId"));
	this.active = (DOMNode.getAttribute("active")=="1")?true:false;

	this.controls = new LawCollection();
	var objControls = DOMNode.selectNodes(".//CONTROL");
	var ctlDOM = null;
	var ctl;
	var folder = designStudio.activeDesigner.designerInfo.folder;
	var len = objControls.length;
	for (var i=0; i<len; i++)
	{
		if(objControls[i].getAttribute("file"))
		{
			var path=folder+"/controls/"+objControls[i].getAttribute("file");
			ctlDOM = SSORequest(path);
			ctlDOM = ctlDOM.documentElement;
		}
		else
			ctlDOM = objControls[i];
		ctl = new Control(ctlDOM, this.id);
		this.controls.add(objControls[i].getAttribute("id"), ctl);
	}
	this.activeControl="";
}

ControlGroup.prototype.setActive=function()
{
	if(this.active)return;
	if (designStudio.activeDesigner.toolBox.activeCtlGrp)
		designStudio.activeDesigner.toolBox.controlGroups.item(designStudio.activeDesigner.toolBox.activeCtlGrp).setInactive();
	this.active = true;
	designStudio.activeDesigner.toolBox.activeCtlGrp=this.id;
	designStudio.activeDesigner.toolBox.paint();
}

ControlGroup.prototype.setInactive=function()
{
	this.active=false;
}

function Control(DOMNode, ctlGrpId)
{
	this.ctlGrpId = ctlGrpId;
	this.id = DOMNode.getAttribute("id");
	this.name = designStudio.activeDesigner.stringTable.getPhrase(DOMNode.getAttribute("phraseId"));
	this.host = DOMNode.getAttribute("host");
	if(!this.host)this.host="";
	this.image = DOMNode.getAttribute("img");
	this.render = true;

	this.properties = new LawCollection();
	var propNodes = DOMNode.selectNodes("./PROPERTY");
	var len = propNodes.length;
	for (var i=0; i<len; i++)
		this.properties.add(propNodes[i].getAttribute("id"), new Property(propNodes[i]));

	this.propPage = null;
	var propPageNode = DOMNode.selectSingleNode("./PROPERTYPAGE");
	if(propPageNode)
	{
		var propPage = new Object();
		propPage.label = designStudio.activeDesigner.stringTable.getPhrase(propPageNode.getAttribute("phraseId"));
		propPage.dialog = propPageNode.getAttribute("htm")?propPageNode.getAttribute("htm"):"";
		propPage.dialogHeight=propPageNode.getAttribute("height")?propPageNode.getAttribute("height"):"";
		propPage.dialogWidth=propPageNode.getAttribute("width")?propPageNode.getAttribute("width"):"";
		this.propPage = propPage;
	}
	var propSets = DOMNode.selectNodes("./PROPERTYSET");
	this.propertySets = new LawCollection();
	len = propSets.length;
	for (i=0; i<len; i++)
		this.propertySets.add(propSets[i].getAttribute("id"), new PropertySet(propSets[i]));
	this.showProperties = paintPropertyWindow

	var rules=DOMNode.selectNodes(".//RULE");
	this.rules = new LawCollection();
	len = rules.length;
	for(i=0; i<len; i++)
		this.rules.add(rules[i].getAttribute("id"), new Rule(rules[i]));

	var evts = DOMNode.selectNodes("./EVENT");
	this.events = new LawCollection();
	len = evts.length;
	for(i=0; i<len; i++)
	{
		var evt = new EventObj(evts[i]);
		this.events.add(evt.id, evt);
	}
}

Control.prototype.select=function()
{
	this.showProperties();
}

Control.prototype.createInstance=function()
{
	var newCtrl = new ControlInstance(this.id, this.ctlGrpId);
	return newCtrl;
}

Control.prototype.getRule=function(id)
{
	return (this.rules.item(id))?this.rules.item(id).value:null;
}

Control.prototype.getRules=function()
{
	return this.rules;
}

function Property(DOMNode)
{
	this.id = DOMNode.getAttribute("id");
	this.name = designStudio.activeDesigner.stringTable.getPhrase(DOMNode.getAttribute("phraseId"));
	this.readOnly = DOMNode.getAttribute("readonly")
	this.displayOnly=(DOMNode.getAttribute("displayonly") ? DOMNode.getAttribute("displayonly") : "0");
	this.init = DOMNode.getAttribute("init")
	this.draw = DOMNode.getAttribute("draw").toLowerCase();
	this.options=null;
	if(this.draw == "select")
	{
		this.options = new Array();
		var optNodes = DOMNode.selectNodes("./OPTIONS/OPTION");
		var len = optNodes.length;
		for (var i=0; i < len; i++)
		{
			this.options[i]=new Array();
			this.options[i][0]=designStudio.activeDesigner.stringTable.getPhrase(optNodes[i].getAttribute("phraseId"));
			this.options[i][1]=optNodes[i].getAttribute("value");
		}
	}
	else if (this.draw == "textbrowse")
	{
		this.btnid = DOMNode.childNodes[0].getAttribute("id");
		this.dialog = DOMNode.childNodes[0].getAttribute("htm");
		if(!this.dialog)this.dialog="";
		this.dialogHeight = DOMNode.childNodes[0].getAttribute("height");
		if(!this.dialogHeight)this.dialogHeight="";
		this.dialogWidth = DOMNode.childNodes[0].getAttribute("width");
		if(!this.dialogWidth)this.dialogWidth="";
	}
}

function PropertySet(DOMNode)
{
	this.setId = DOMNode.getAttribute("id");
	this.type = DOMNode.getAttribute("type");
	this.properties=new LawCollection();
	var len = DOMNode.childNodes.length;
	for(var i=0; i < len;i++)
	{
		this.properties.add(DOMNode.childNodes[i].getAttribute("id"), new Property(DOMNode.childNodes[i]));
	}
}

function Rule(DOMNode)
{
	this.rule=""
	this.value=""
	if (typeof(DOMNode) != "undefined")
	{
		this.rule = DOMNode.getAttribute("id");
		this.value = DOMNode.getAttribute("value");
	}
}

function EventObj(DOMNode)
{
	this.id = DOMNode.getAttribute("id");
	this.label = DOMNode.getAttribute("label");
	this.parms = DOMNode.getAttribute("parms");
	this.returnVal = DOMNode.getAttribute("returns");
}

function PropertyBag()
{
	this.elements = new DataStorage();
	this.elementsROF = new DataStorage();	// read-only flag
	this.sets = new Array();
	this.objects = new LawCollection();
}

PropertyBag.prototype.addElement=function(elmId, elmValue, elmROF)
{
	if(typeof(elmId) == "undefined" || elmId == "") return;
	if(typeof(elmValue) == "undefined" || elmValue== "") elmValue="";
	if(typeof(elmROF) == "undefined" || elmROF== null) elmROF=false;
	this.elements.add(elmId, elmValue);
	this.elementsROF.add(elmId, elmROF);

	return this.elements.getItem(elmId);
}

PropertyBag.prototype.removeElement=function(elmId)
{
	if(typeof(elmId) == "undefined" || elmId == "")return;
	this.elements.remove(elmId);
}

PropertyBag.prototype.getElement=function(elmId)
{
	if(typeof(elmId) == "undefined" || elmId == "")return "";
	var item=this.elements.getItem(elmId);
	return ( item ? item.value : "");
}

PropertyBag.prototype.getElementROF=function(elmId)
{
	if(typeof(elmId) == "undefined" || elmId == "") return false;
	var item=this.elementsROF.getItem(elmId);
	return ( item ? item.value : false);
}

PropertyBag.prototype.setElement=function(elmId, elmValue)
{
	if(typeof(elmId) == "undefined" || elmId == "") return;
	if(typeof(elmValue) == "undefined" || elmValue == null) elmValue="";
	this.elements.setItem(elmId,elmValue);
	return this.elements.getItem(elmId);
}

PropertyBag.prototype.setElementROF=function(elmId, elmROF)
{
	if(typeof(elmId) == "undefined" || elmId == "") return;
	if(typeof(elmROF) != "boolean" ) elmROF=false;
	this.elementsROF.setItem(elmId,elmROF);
	return this.elementsROF.getItem(elmId);
}

PropertyBag.prototype.addObject=function(setId)
{
	var obj = new Object();
	obj.state = "uninitialized";
	this.objects.add(setId, obj);
}

PropertyBag.prototype.addSet=function(setId)
{
	this.sets[setId] = new Array();
	return this.sets[setId];
}

PropertyBag.prototype.addSetRow=function(setId, rowIndex)
{
	this.sets[setId][rowIndex] = new Array();
	return this.sets[setId][rowIndex];
}

PropertyBag.prototype.setSetElement=function(setId, rowIndex, colIndex, value)
{
	var set = this.sets[setId];
	if(!set)return null;

	var setRow = null;
	if(set.length <= rowIndex)
		setRow = this.addSetRow(setId, rowIndex);
	else
		setRow = set[rowIndex];
	if(!setRow)return null;
	setRow[colIndex] = value;
	return setRow[colIndex];
}

PropertyBag.prototype.getSetElement=function(setId, rowIndex, colIndex)
{
	var set = this.sets[setId];
	if(!set)return null;

	if(set.length <= rowIndex)return null;

	var setRow = set[rowIndex];
	if(!setRow)return null;
	if(setRow.length <= colIndex)return null;

	return setRow[colIndex];
}

PropertyBag.prototype.removeSetRow=function(setId, rowIndex)
{
	var set = this.sets[setId];
	if(!set)return;

	if(set.length <= rowIndex)return;

	var setRow = set[rowIndex];
	if(!setRow)return;
	setRow = null;
	return;
}

PropertyBag.prototype.removeAllRowsInSet=function(setId)
{
	var set = this.sets[setId];
	if(!set)return;

	set = new Array();
	return;
}

function ControlInstance(ctlId, ctlGrpId)
{
	this.id="";	//TODO: generate ID
	this.ctlId = ctlId;
	this.ctlGrpId = ctlGrpId;
	var ctl = designStudio.activeDesigner.toolBox.getControlObject(this.ctlId, this.ctlGrpId);
	this.propertyBag = new PropertyBag();
	var len = ctl.properties.count;
	for(var i=0; i<len; i++)
	{
		this.propertyBag.addElement(ctl.properties.item(i).id, ctl.properties.item(i).init,
				ctl.properties.item(i).readOnly == "1" ? true : false );
	}
	len = ctl.propertySets.count;
	for(i=0; i<len; i++)
	{
		if(ctl.propertySets.item(i).type == "set")
			this.propertyBag.addSet(ctl.propertySets.item(i).setId);
		else
			this.propertyBag.addObject(ctl.propertySets.item(i).setId);
	}

	var rules=ctl.getRules()
	this.rules = new LawCollection();
	len = rules.count;
	for(var i=0; i < len; i++)
	{
		var rule=new Rule()
		rule.id=rules.hash[i];
		rule.value=rules.elements[rules.hash[i]].value;
		this.rules.add(rules.hash[i], rule);
	}
	this.deleted=false;
	this.dirty = true;
}

ControlInstance.prototype.restoreDefaults=function()
{
	var ctl = designStudio.activeDesigner.toolBox.getControlObject(this.ctlId, this.ctlGrpId);
	this.propertyBag = new PropertyBag();
	var len = ctl.properties.count;
	for(var i=0; i<len; i++)
	{
		this.propertyBag.addElement(ctl.properties.item(i).id, ctl.properties.item(i).init,
				ctl.properties.item(i).readOnly == "1" ? true : false );
	}
	len = ctl.propertySets.count;
	for(i=0; i<len; i++)
	{
		this.propertyBag.addSet(ctl.propertySets.item(i).id);
	}
	this.dirty = true;
}
ControlInstance.prototype.get=function(name)
{
	return this.propertyBag.getElement(name);
}
ControlInstance.prototype.set=function(name, value)
{
	return this.propertyBag.setElement(name, value);
}
ControlInstance.prototype.getObject=function(objectId)
{
	var obj = this.propertyBag.objects.item(objectId);
	if(obj)return obj;
	return null;
}
ControlInstance.prototype.markDelete=function(bDelete)
{
	this.deleted = bDelete;
	return;
}
ControlInstance.prototype.select=function()
{
	var ctlGrp = designStudio.activeDesigner.toolBox.controlGroups.item(this.ctlGrpId);
	var ctl = ctlGrp.controls.item(this.ctlId);
	ctl.select();
}
ControlInstance.prototype.getRule=function(id)
{
	return (this.rules.item(id)) ? this.rules.item(id).value : null;
}
ControlInstance.prototype.getRules=function()
{
	return this.rules;
}
ControlInstance.prototype.setRule=function(id, value)
{
	var rule=this.rules.item(id)
	if (rule)
		this.rules.item(id).value=value;
}
ControlInstance.prototype.setModifiedFlag=function(bFlag)
{
	this.dirty = bFlag;
	return bFlag;
}

function PACommand(type, stateInfo, isReversible, mode, canvasId)
{
	this.type=type;
	this.initiator="PA";
	this.stateInfo=stateInfo;
	this.isReversible=isReversible;
	this.mode=mode;
	this.canvas=canvasId;
}
PACommand.prototype.execute=function()
{
	var len = this.stateInfo.count;
	var id = "";
	if(len == 1)
	{
		id = (this.stateInfo.item(0).bIdChange) ? this.stateInfo.item(0).prevValue.getItem("id").value
												: this.stateInfo.item(0).ctlInstId;

		designStudio.activeDesigner.activeDocument.selectControlInstance(id);
		designStudio.activeDesigner.activeDocument.updateProperties(this.stateInfo.item(0).curValue, id);
	}
	else
	{
		///???How to select multiple controls programmatically
		for (var i=0; i<len; i++)
		{
			var ctlInst = designStudio.activeDesigner.activeDocument.controls.item(this.stateInfo.item(i).ctlInstId);
			designStudio.activeDesigner.activeDocument.updateProperties(this.stateInfo.item(i).curValue, ctlInst.id)
		}
	}
}
PACommand.prototype.unExecute=function()
{
	var len = this.stateInfo.count;
	var id = "";
	if(len == 1)
	{
		id = (this.stateInfo.item(0).bIdChange) ? this.stateInfo.item(0).curValue.getItem("id").value
												: this.stateInfo.item(0).ctlInstId;

		designStudio.activeDesigner.activeDocument.selectControlInstance(id);
		designStudio.activeDesigner.activeDocument.updateProperties(this.stateInfo.item(0).prevValue, id);
	}
	else
	{
		///???How to select multiple controls programmatically
		for (var i=0; i<len; i++)
		{
			var ctlInst = designStudio.activeDesigner.activeDocument.controls.item(this.stateInfo.item(i).ctlInstId);
			designStudio.activeDesigner.activeDocument.updateProperties(this.stateInfo.item(i).prevValue, ctlInst.id)
		}
	}
}

function PAState(ctlInstId, dsPrevValue, dsCurValue, bIdChange)
{
	this.ctlInstId = ctlInstId;
	this.prevValue = dsPrevValue;
	this.curValue = dsCurValue;
	this.bIdChange = (typeof(bIdChange) == "undefined")?false:bIdChange;
}

//HTML painting / Event handlers
//------------------------------------------------------------------------------------
function paintToolbox()
{
	dsToolBox.paintToolbox()
}

function paintPropertyWindow()
{
	if (!designStudio.activeDesigner)
		return;
	if (designStudio.activeDesigner.activeDocument.readyState=="loading")
		return;
	var strId = designStudio.activeDesigner.activeDocument.activeControl ?
		designStudio.activeDesigner.activeDocument.activeControl.id :
		designStudio.activeDesigner.activeDocument.mainHost;
	dsPropArea.showIdProperties(strId);
}
