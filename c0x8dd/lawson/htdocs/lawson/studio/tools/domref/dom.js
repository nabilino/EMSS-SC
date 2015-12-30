/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/tools/domref/dom.js,v 1.2.4.1.4.11.16.2 2012/08/08 12:48:54 jomeli Exp $ */
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

var domTree;
var constDoc;

function loadDomView()
{
	var httpObj=new ActiveXObject("Microsoft.XMLHTTP");
	constDoc=new ActiveXObject("Microsoft.XMLDOM");
	constDoc.async=false;
	httpObj.open("GET","dom.xml",false);
	httpObj.send(null);
	if (!httpObj || httpObj.status >= 400)
	{
		var msg="Error retrieving dom.xml.";
		if (httpObj)
			msg+=" (status code: "+httpObj.status+")";
		alert(msg);
		return;
	}
	constDoc.loadXML(httpObj.responseText);
	if (constDoc.parseError.errorCode!=0)
	{
		displayDOMParseError(constDoc.parseError,"dom.xml");
		return;
	}

	createTree();
	domTree.root.expand();
	domTree.root.select();
}
//-----------------------------------------------------------------------------
function displayDOMParseError(pe,path)
{
	var msg="XML parse error"
	if (typeof(path)!="undefined")
		msg+=" in file "+path+":"
	msg+="\n"+pe.reason+"line "+pe.line+", col "+pe.linepos+":\n"+pe.srcText;
	alert(msg);
}
//-----------------------------------------------------------------------------
function createTree()
{
	domTree=new Tree("domTree");
	domTree.myWindow=window;
	domTree.html=document.getElementById("treeDiv");
	domTree.expandedImage="../../images/folderopen.gif";
	domTree.collapsedImage="../../images/folderclosed.gif";
	domTree.leafImage="../../images/htmldoc.gif";

	var rtNode=new TreeNode("root","Objects Reference",null,null,domTree);
	domTree.root=rtNode;
	rtNode.onclick="createSectionList()";

	for (var i=0; i < constDoc.documentElement.childNodes.length; i++)
	{
		var domNode=constDoc.documentElement.childNodes[i];
		if (domNode.nodeName == "#comment")
			continue;
		var newNode=new TreeNode();
		newNode.id=domNode.nodeName;
		newNode.title=domNode.nodeName;
		newNode.onclick="createObjectList()";
		rtNode.appendChild(newNode);
		createObjectChildren(domNode,newNode);
	}
	domTree.render();
}
//-----------------------------------------------------------------------------
function createObjectChildren(domRef,treeRef)
{
	for (var i=0; i < domRef.childNodes.length; i++)
	{
		var domNode=domRef.childNodes[i];
		if (domNode.nodeName == "#comment")
			continue;
		var objId=domNode.getAttribute("name");
		var newNode=new TreeNode(domRef.nodeName+"."+objId,domNode.getAttribute("name"));
		switch (objId)
		{
		case "Global Variables":
		case "Global Functions":
		case "Hotkey Handling":
			newNode.onclick="createGlobalsList()";
			treeRef.appendChild(newNode);
			createGlobalsChildren(domNode,newNode,objId);
			break;
		case "Form Variables":
		case "Form Functions":
			newNode.onclick="createFormList()";
			treeRef.appendChild(newNode);
			createFormChildren(domNode,newNode,objId);
			break;
		case "Portal Page Variables":
		case "Portal Page Functions":
			newNode.onclick="createPageList()";
			treeRef.appendChild(newNode);
			createPageChildren(domNode,newNode,objId);
			break;
		case "Form Events":
		case "Portal Page Events":
			newNode.onclick="createEventObjList()";
			treeRef.appendChild(newNode);
			createEventsChildren(domNode,newNode,objId);
			break;
		default:		// object
			newNode.onclick="createObjectView()";
			treeRef.appendChild(newNode);
			var nodes=domNode.selectNodes("./PROPERTY");
			if (nodes && nodes.length > 0)
			{
				var subNode=new TreeNode("props","Properties");
				subNode.onclick="createPropertyList()";
				newNode.appendChild(subNode);
				createPropertyChildren(domNode,subNode,objId);
			}
			var nodes=domNode.selectNodes("./METHOD");
			if (nodes && nodes.length > 0)
			{
				var subNode=new TreeNode("meths","Methods");
				subNode.onclick="createMethodList()";
				newNode.appendChild(subNode);
				createMethodChildren(domNode,subNode,objId);
			}
			break;
		}
	}
}
//-----------------------------------------------------------------------------
function createEventsChildren(domRef,treeRef,objId)
{
	var propColl=domRef.getElementsByTagName("OBJECT");
	for (var i=0; i < propColl.length; i++)
	{
		var domNode=propColl[i];
		var propId=domNode.getAttribute("name")
		var newNode=new TreeNode(objId+"."+propId,
				domNode.getAttribute("name"));
		newNode.onclick="createEventsList()";
		treeRef.appendChild(newNode);
		createEventObjChildren(domNode,newNode,propId);
	}
}
//-----------------------------------------------------------------------------
function createEventObjChildren(domRef,treeRef,objId)
{
	var eventsImage="../../images/events.gif";
	var propColl=domRef.getElementsByTagName("EVENT");
	for (var i=0; i < propColl.length; i++)
	{
		var domNode=propColl[i];
		var propId=domNode.getAttribute("name")
		var newNode=new TreeNode(objId+"."+propId,
				domNode.getAttribute("name"),null,eventsImage);
		newNode.onclick="createEventView()";
		treeRef.appendChild(newNode);
	}
}
//-----------------------------------------------------------------------------
function createGlobalsChildren(domRef,treeRef,objId)
{
	var type=domRef.getAttribute("name");
	var globalsImage="../../images/"+(type == "Global Variables"
		? "variable.gif" : "script.gif");
	var propColl=(type == "Global Variables"
		? domRef.getElementsByTagName("GLOBAL")
		: domRef.getElementsByTagName("FUNCTION"));

	// alternate image for a couple of hotkey items
	var textImage=(type.substr(0,6) == "Hotkey" 
			? "../../images/icoinfo16.gif" : "");

	for (var i=0; i < propColl.length; i++)
	{
		var domNode=propColl[i];
		var propId=domNode.getAttribute("name");
		var name=domNode.getAttribute("name");
		var img=(textImage && (name == "Introduction" || name == "XML Format") 
				? textImage : globalsImage);
		var newNode=new TreeNode(objId+"."+propId,name,null,img);
		newNode.onclick="createGlobalsView()";
		treeRef.appendChild(newNode);
	}
}
//-----------------------------------------------------------------------------
function createFormChildren(domRef,treeRef,objId)
{
	var type=domRef.getAttribute("name");
	var globalsImage="../../images/"+(type == "Form Variables"
		? "variable.gif" : "script.gif");
	var propColl=(type == "Form Variables"
		? domRef.selectNodes("./VARIABLE")
		: domRef.selectNodes("./FUNCTION"));

	for (var i=0; i < propColl.length; i++)
	{
		var domNode=propColl[i];
		var propId=domNode.getAttribute("name")
		var newNode=new TreeNode(objId+"."+propId,
				domNode.getAttribute("name"),null,globalsImage);
		newNode.onclick="createFormView()";
		treeRef.appendChild(newNode);
	}
}
//-----------------------------------------------------------------------------
function createPageChildren(domRef,treeRef,objId)
{
	var type=domRef.getAttribute("name");
	var globalsImage="../../images/"+(type == "Portal Page Variables"
		? "variable.gif" : "script.gif");
	var propColl=(type == "Portal Page Variables"
		? domRef.selectNodes("./VARIABLE")
		: domRef.selectNodes("./FUNCTION"));

	for (var i=0; i < propColl.length; i++)
	{
		var domNode=propColl[i];
		var propId=domNode.getAttribute("name")
		var newNode=new TreeNode(objId+"."+propId,
				domNode.getAttribute("name"),null,globalsImage);
		newNode.onclick="createPageView()";
		treeRef.appendChild(newNode);
	}
}
//-----------------------------------------------------------------------------
function createPropertyChildren(domRef,treeRef,objId)
{
	var propsImage="../../images/property.gif";
	var propColl=domRef.getElementsByTagName("PROPERTY");
	for (var i=0; i < propColl.length; i++)
	{
		var domNode=propColl[i];
		var propId=domNode.getAttribute("name")
		var newNode=new TreeNode(objId+"."+propId,
			domNode.getAttribute("name"),null,propsImage);
		newNode.onclick="createPropertyView()";
		treeRef.appendChild(newNode);
	}
}
//-----------------------------------------------------------------------------
function createMethodChildren(domRef,treeRef,objId)
{
	var methImage="../../images/script.gif";
	var methColl=domRef.getElementsByTagName("METHOD");
	for (var i=0; i < methColl.length; i++)
	{
		var domNode=methColl[i];
		var methId=domNode.getAttribute("name");
		var newNode=new TreeNode(objId+"."+methId,
			domNode.getAttribute("name"),null,methImage);
		newNode.onclick="createMethodView()";
		treeRef.appendChild(newNode);
	}
}
//-----------------------------------------------------------------------------
function createEventView()
{
	var objLst=new ViewObject();
	var treeRef=domTree.selectedNode;
	var parSelected=treeRef.parentNode;
	var parNode=constDoc.selectSingleNode("//CONSTRUCTOR[@name='"+parSelected.id.substr(0,parSelected.id.indexOf("."))+"']");
	var objNode=parNode.selectSingleNode("./OBJECT[@name='"+treeRef.id.substr(0,treeRef.id.indexOf("."))+"']");
	var refId=treeRef.id.substr(treeRef.id.indexOf(".")+1);
	var evtNode=objNode.selectSingleNode("./EVENT[@name='"+refId+"']");

	var objSect=new SectionObject();
	objSect.title=(objNode.getAttribute("evtname")
		? objNode.getAttribute("evtname") : "<object id>") +"_"+refId + " Event";
	objSect.text="Returns " + 
		(evtNode.getAttribute("returntype")
		? "["+evtNode.getAttribute("returntype")+"]" : "[undefined]");
	objLst.addSection(objSect);

	objSect=new SectionObject();
	objSect.title="Parameters";
	objSect.text="None";
	var domNode=evtNode.selectSingleNode("./PARAMETERS");
	if (domNode)
	{
		var domNodes=domNode.selectNodes("PARAMETER");
		var parmTxt=(domNodes && domNodes.length ? "" : "None");
		for (var i=0; i < domNodes.length; i++)
			parmTxt+=getParameterText(domNodes[i]);
		objSect.text=parmTxt;
	}
	objLst.addSection(objSect);

	objSect=new SectionObject();
	objSect.title="Remarks";
	domNode=evtNode.selectSingleNode("./NOTES");
	objSect.text=domNode.text;
	objLst.addSection(objSect);

	domNode=evtNode.selectSingleNode("./EXAMPLES");
	if (domNode)
	{
		objSect=new SectionObject();
		objSect.title="Example";
		objSect.className="treeTextExample";
		objSect.text=domNode.text;
		objLst.addSection(objSect);
	}

	objLst.render();
}
//-----------------------------------------------------------------------------
function createGlobalsView()
{
	var objLst=new ViewObject();
	var treeRef=domTree.selectedNode;
	var parSelected=treeRef.parentNode;
	var type=parSelected.id.substr(parSelected.id.indexOf(".")+1);

	var refId=treeRef.id.substr(treeRef.id.indexOf(".")+1);
	var pNode=constDoc.selectSingleNode("//PORTAL");
	var objNode=pNode.selectSingleNode(".//" +
		(type=="Global Variables" ? "GLOBAL" : "FUNCTION") + 
		"[@name='"+refId+"']");

	if (type=="Global Variables")
	{
		var objSect=new SectionObject();
		objSect.title=refId + " Global variable";
		objSect.text="Type ["+objNode.getAttribute("type")+"]";
		objLst.addSection(objSect);
	}
	else
	{
		// Global Functions, Hotkey Functions, Format
		var objSect=new SectionObject();
		if (refId == "XML Format" || refId == "Introduction")
		{
			objSect.title=type.substr(0,6) + " " + refId;
			objLst.addSection(objSect);
		}
		else
		{
			objSect.title=refId + " " + type.substr(0,6) + " function";
			objSect.title=refId + " " + type.substr(0,6) + " function";
			objSect.text="Returns "+(objNode.getAttribute("returntype")
				? "["+objNode.getAttribute("returntype")+"]" : "[undefined]");
			objLst.addSection(objSect);

			objSect=new SectionObject();
			objSect.title="Parameters";
			objSect.text="None";
			var domNode=objNode.selectSingleNode("./PARAMETERS");
			if (domNode)
			{
				var domNodes=domNode.selectNodes("PARAMETER");
				var parmTxt=(domNodes && domNodes.length ? "" : "None");
				for (var i=0; i < domNodes.length; i++)
					parmTxt+=getParameterText(domNodes[i]);
				objSect.text=parmTxt;
			}
			objLst.addSection(objSect);
		}
	}

	objSect=new SectionObject();
	objSect.title="Remarks";
	domNode=objNode.selectSingleNode("NOTES");
	objSect.text=domNode.text;
	objLst.addSection(objSect);

	domNode=objNode.selectSingleNode("EXAMPLES");
	if (domNode)
	{
		objSect=new SectionObject();
		objSect.title="Example";
		objSect.className="treeTextExample";
		objSect.text=domNode.text;
		objLst.addSection(objSect);
	}

	objLst.render();
}
//-----------------------------------------------------------------------------
function createFormView()
{
	var objLst=new ViewObject();
	var treeRef=domTree.selectedNode;
	var parSelected=treeRef.parentNode;
	var type=parSelected.id.substr(parSelected.id.indexOf(".")+1);

	var refId=treeRef.id.substr(treeRef.id.indexOf(".")+1);
	var pNode=constDoc.selectSingleNode("//FORMS");
	var objNode=pNode.selectSingleNode(".//" +
		(type=="Form Variables" ? "VARIABLE" : "FUNCTION") + 
		"[@name='"+refId+"']");

	if (type=="Form Variables")
	{
		var objSect=new SectionObject();
		objSect.title=refId + " Form variable";
		objSect.text="Type ["+objNode.getAttribute("type")+"]";
		objLst.addSection(objSect);
	}
	else
	{
		var objSect=new SectionObject();
		objSect.title=refId + " Form function";
		objSect.text="Returns "+(objNode.getAttribute("returntype")
			? "["+objNode.getAttribute("returntype")+"]" : "[undefined]");
		objLst.addSection(objSect);

		objSect=new SectionObject();
		objSect.title="Parameters";
		objSect.text="None";
		var domNode=objNode.selectSingleNode("./PARAMETERS");
		if (domNode)
		{
			var domNodes=domNode.selectNodes("PARAMETER");
			var parmTxt=(domNodes && domNodes.length ? "" : "None");
			for (var i=0; i < domNodes.length; i++)
				parmTxt+=getParameterText(domNodes[i]);
			objSect.text=parmTxt;
		}
		objLst.addSection(objSect);
	}

	objSect=new SectionObject();
	objSect.title="Remarks";
	domNode=objNode.selectSingleNode("NOTES");
	objSect.text=domNode.text;
	objLst.addSection(objSect);

	domNode=objNode.selectSingleNode("EXAMPLES");
	if (domNode)
	{
		objSect=new SectionObject();
		objSect.title="Example";
		objSect.className="treeTextExample";
		objSect.text=domNode.text;
		objLst.addSection(objSect);
	}

	objLst.render();
}
//-----------------------------------------------------------------------------
function createPageView()
{
	var objLst=new ViewObject();
	var treeRef=domTree.selectedNode;
	var parSelected=treeRef.parentNode;
	var type=parSelected.id.substr(parSelected.id.indexOf(".")+1);

	var refId=treeRef.id.substr(treeRef.id.indexOf(".")+1);
	var pNode=constDoc.selectSingleNode("//PAGES");
	var objNode=pNode.selectSingleNode(".//" +
		(type=="Portal Page Variables" ? "VARIABLE" : "FUNCTION") + 
		"[@name='"+refId+"']");

	if (type=="Portal Page Variables")
	{
		var objSect=new SectionObject();
		objSect.title=refId + " Portal Page variable";
		objSect.text="Type ["+objNode.getAttribute("type")+"]";
		objLst.addSection(objSect);
	}
	else
	{
		var objSect=new SectionObject();
		objSect.title=refId + " Page function";
		objSect.text="Returns "+(objNode.getAttribute("returntype")
			? "["+objNode.getAttribute("returntype")+"]" : "[undefined]");
		objLst.addSection(objSect);

		objSect=new SectionObject();
		objSect.title="Parameters";
		objSect.text="None";
		var domNode=objNode.selectSingleNode("./PARAMETERS");
		if (domNode)
		{
			var domNodes=domNode.selectNodes("PARAMETER");
			var parmTxt=(domNodes && domNodes.length ? "" : "None");
			for (var i=0; i < domNodes.length; i++)
				parmTxt+=getParameterText(domNodes[i]);
			objSect.text=parmTxt;
		}
		objLst.addSection(objSect);
	}

	objSect=new SectionObject();
	objSect.title="Remarks";
	domNode=objNode.selectSingleNode("NOTES");
	objSect.text=domNode.text;
	objLst.addSection(objSect);

	domNode=objNode.selectSingleNode("EXAMPLES");
	if (domNode)
	{
		objSect=new SectionObject();
		objSect.title="Example";
		objSect.className="treeTextExample";
		objSect.text=domNode.text;
		objLst.addSection(objSect);
	}

	objLst.render();
}
//-----------------------------------------------------------------------------
function createEventsList()
{
	var objLst=new ViewObject();
	var treeRef=domTree.selectedNode;
	var parSelected=treeRef.parentNode;
	var type=parSelected.id.substr(parSelected.id.indexOf(".")+1);

	var refId=treeRef.id.substr(treeRef.id.indexOf(".")+1);
	var pNode=constDoc.selectSingleNode("//CONSTRUCTOR[@name='"+type+"']");
	var objNode=pNode.selectSingleNode("./OBJECT[@name='"+refId+"']");

	var objSect=new SectionObject();
	objSect.title=refId + " Object Events";
	var domNodes=objNode.selectNodes("./EVENT");
	for (var i=0; i < domNodes.length; i++)
	{
		var domNode=domNodes[i];
		var link=new Object();
		link.name=domNode.getAttribute("name");
		link.parName=refId;
		objSect.links[objSect.links.length]=link;
	}
	objLst.addSection(objSect);

	objLst.render();
}
//-----------------------------------------------------------------------------
function createEventObjList()
{
	var objLst=new ViewObject();
	var treeRef=domTree.selectedNode;
	var refId=treeRef.id.substr(treeRef.id.indexOf(".")+1);
	var objNode=constDoc.selectSingleNode("//CONSTRUCTOR[@name='"+refId+"']");

	var objSect=new SectionObject();
	objSect.title=refId + " Objects";
	var domNodes=objNode.selectNodes("./OBJECT");
	for (var i=0; i < domNodes.length; i++)
	{
		var domNode=domNodes[i];
		var link=new Object();
		link.name=domNode.getAttribute("name");
		link.parName=refId;
		objSect.links[objSect.links.length]=link;
	}
	objLst.addSection(objSect);

	objLst.render();
}
//-----------------------------------------------------------------------------
function createGlobalsList()
{
	var objLst=new ViewObject();
	var treeRef=domTree.selectedNode;
	var refId=treeRef.id.substr(treeRef.id.indexOf(".")+1);
	var objNode=constDoc.selectSingleNode("//CONSTRUCTOR[@name='"+refId+"']");

	var objSect=new SectionObject();
	objSect.title=refId;
	var domNodes=(refId == "Global Variables" 
		? objNode.selectNodes("./GLOBAL")
		: objNode.selectNodes("./FUNCTION"));
	for (var i=0; i < domNodes.length; i++)
	{
		var domNode=domNodes[i];
		var link=new Object();
		link.name=domNode.getAttribute("name");
		link.parName=refId;
		objSect.links[objSect.links.length]=link;
	}
	objLst.addSection(objSect);

	objLst.render();
}
//-----------------------------------------------------------------------------
function createFormList()
{
	var objLst=new ViewObject();
	var treeRef=domTree.selectedNode;
	var refId=treeRef.id.substr(treeRef.id.indexOf(".")+1);
	var objNode=constDoc.selectSingleNode("//CONSTRUCTOR[@name='"+refId+"']");

	var objSect=new SectionObject();
	objSect.title=refId;
	var domNodes=(refId == "Form Variables" 
		? objNode.selectNodes("./VARIABLE")
		: objNode.selectNodes("./FUNCTION"));
	for (var i=0; i < domNodes.length; i++)
	{
		var domNode=domNodes[i];
		var link=new Object();
		link.name=domNode.getAttribute("name");
		link.parName=refId;
		objSect.links[objSect.links.length]=link;
	}
	objLst.addSection(objSect);

	objLst.render();
}
//-----------------------------------------------------------------------------
function createPageList()
{
	var objLst=new ViewObject();
	var treeRef=domTree.selectedNode;
	var refId=treeRef.id.substr(treeRef.id.indexOf(".")+1);
	var objNode=constDoc.selectSingleNode("//CONSTRUCTOR[@name='"+refId+"']");

	var objSect=new SectionObject();
	objSect.title=refId;
	var domNodes=(refId == "Portal Page Variables" 
		? objNode.selectNodes("./VARIABLE")
		: objNode.selectNodes("./FUNCTION"));
	for (var i=0; i < domNodes.length; i++)
	{
		var domNode=domNodes[i];
		var link=new Object();
		link.name=domNode.getAttribute("name");
		link.parName=refId;
		objSect.links[objSect.links.length]=link;
	}
	objLst.addSection(objSect);

	objLst.render();
}
//-----------------------------------------------------------------------------
function createObjectView()
{
	var objLst=new ViewObject();
	var treeRef=domTree.selectedNode;
	var refId=treeRef.id.substr(treeRef.id.indexOf(".")+1);
	var objNode=constDoc.selectSingleNode("//CONSTRUCTOR[@name='"+refId+"']");

	var objSect=new SectionObject();
	objSect.title=refId + " object";
	objSect.text="Object constructor for "+refId;
	objLst.addSection(objSect);

	objSect=new SectionObject();
	objSect.title="Parameters";
	objSect.text="None";
	var domNode=objNode.selectSingleNode("PARAMETERS");
	if (domNode)
	{
		var domNodes=domNode.selectNodes("PARAMETER");
		var parmTxt=(domNodes && domNodes.length ? "" : "None");
		for (var i=0; i < domNodes.length; i++)
			parmTxt+=getParameterText(domNodes[i]);
		objSect.text=parmTxt;
	}
	objLst.addSection(objSect);

	objSect=new SectionObject();
	objSect.title="Remarks";
	domNode=objNode.selectSingleNode("NOTES");
	objSect.text=domNode.text;
	objLst.addSection(objSect);

	objSect=new SectionObject();
	objSect.title="Example";
	domNode=objNode.selectSingleNode("EXAMPLES");
	objSect.className="treeTextExample";
	objSect.text=domNode.text;
	objLst.addSection(objSect);

	domNodes=objNode.selectNodes("PROPERTY");
	if (domNodes && domNodes.length > 0)
	{
		objSect=new SectionObject();
		objSect.title="Properties";
		for (var i=0; i < domNodes.length; i++)
		{
			domNode=domNodes[i];
			var link=new Object();
			link.name=domNode.getAttribute("name");
			link.parName=refId;
			objSect.links[objSect.links.length]=link;
		}
		objLst.addSection(objSect);
	}

	domNodes=objNode.selectNodes("METHOD");
	if (domNodes && domNodes.length > 0)
	{
		objSect=new SectionObject();
		objSect.title="Methods";
		for (var i=0; i < domNodes.length; i++)
		{
			domNode=domNodes[i];
			var link=new Object();
			link.name=domNode.getAttribute("name");
			link.parName=refId;
			objSect.links[objSect.links.length]=link;
		}
		objLst.addSection(objSect);
	}

	objLst.render();
}
//-----------------------------------------------------------------------------
function createSectionList()
{
	var objLst=new ViewObject();
	var treeRef=domTree.selectedNode;
	var objNode=constDoc.selectSingleNode("//CONSTRUCTORS");

	var objSect=new SectionObject();
	objSect.title="Objects Reference Sections";
	var len=objNode.childNodes.length;
	for (var i=0; i < len; i++)
	{
		var domNode=objNode.childNodes[i];
		if (domNode.nodeName == "#comment")
			continue;
		var link=new Object();
		link.name=domNode.nodeName;
		link.parName="root";
		objSect.links[objSect.links.length]=link;
	}
	objLst.addSection(objSect);

	objLst.render();
}
//-----------------------------------------------------------------------------
function createObjectList()
{
	var objLst=new ViewObject();
	var treeRef=domTree.selectedNode;
	var refId=treeRef.id.substr(treeRef.id.indexOf(".")+1);
	var objNode=constDoc.selectSingleNode("//"+refId);

	var objSect=new SectionObject();
	objSect.title=refId + " Objects";
	var domNodes=objNode.selectNodes("./CONSTRUCTOR");
	for (var i=0; i < domNodes.length; i++)
	{
		var domNode=domNodes[i];
		var link=new Object();
		link.name=domNode.getAttribute("name");
		link.parName=refId;
		objSect.links[objSect.links.length]=link;
	}
	objLst.addSection(objSect);

	objLst.render();
}
//-----------------------------------------------------------------------------
function createPropertyView()
{
	var objLst=new ViewObject();
	var treeRef=domTree.selectedNode;
	var parObject=treeRef.parentNode.parentNode;
	var parId=parObject.id.substr(parObject.id.indexOf(".")+1);
	var refId=treeRef.id.substr(treeRef.id.indexOf(".")+1);
	var objNode=constDoc.selectSingleNode("//CONSTRUCTOR[@name='"+parId+
			"']/PROPERTY[@name='"+refId+"']");

	var objSect=new SectionObject();
	objSect.title="Property Description";
	var parmTxt="Property: "+refId;
	var attVal=objNode.getAttribute("type");
	parmTxt+=" ["+attVal+"]\n";
	var conVal=objNode.getAttribute("construct");
	if(conVal)
		parmTxt+="using constructor "+conVal+"\n";
	objSect.text=parmTxt;
	objLst.addSection(objSect);

	var domNode=objNode.selectSingleNode("NOTES");
	objSect=new SectionObject();
	objSect.title="Remarks";
	objSect.text=(domNode ? domNode.text : "");
	objLst.addSection(objSect);

	domNode=objNode.selectSingleNode("EXAMPLES");
	if (domNode)
	{
		objSect=new SectionObject();
		objSect.className="treeTextExample";
		objSect.title="Example";
		objSect.text=domNode.text;
		objLst.addSection(objSect);
	}

	objLst.render();
}
//-----------------------------------------------------------------------------
function createPropertyList()
{
	var objLst=new ViewObject();
	var treeRef=domTree.selectedNode;
	var parObject=treeRef.parentNode;
	var parId=parObject.id.substr(parObject.id.indexOf(".")+1);
	var objNode=constDoc.selectSingleNode("//CONSTRUCTOR[@name='"+parId+"']");

	var objSect=new SectionObject();
	objSect.title=parId + " Properties";

	var domNodes=objNode.selectNodes("./PROPERTY");
	for (var i=0; i < domNodes.length; i++)
	{
		var domNode=domNodes[i];
		var link=new Object();
		link.name=domNode.getAttribute("name");
		link.parName=parId;
		objSect.links[objSect.links.length]=link;
	}
	objLst.addSection(objSect);

	objLst.render();
}
//-----------------------------------------------------------------------------
function createMethodView()
{
	var objLst=new ViewObject();
	var treeRef=domTree.selectedNode;
	var parObject=treeRef.parentNode.parentNode;
	var parId=parObject.id.substr(parObject.id.indexOf(".")+1);
	var refId=treeRef.id.substr(treeRef.id.indexOf(".")+1);
	var objNode=constDoc.selectSingleNode("//CONSTRUCTOR[@name='"+parId+
			"']/METHOD[@name='"+refId+"']");

	var objSect=new SectionObject();
	objSect.title="Method: "+parId+"."+refId;
	var attVal=objNode.getAttribute("returntype");
	if(!attVal)
		parmTxt="Returns [undefined]";
	else
	{
		parmTxt="Returns ["+attVal+"]";
		conVal=objNode.getAttribute("constructor");
		if(conVal)
			parmTxt+=" using "+conVal;
	}
	objSect.text=parmTxt;
	objLst.addSection(objSect);

	objSect=new SectionObject();
	objSect.title="Parameters";
	objSect.text="None";
	var domNode=objNode.selectSingleNode("./PARAMETERS");
	if (domNode)
	{
		var domNodes=domNode.selectNodes("PARAMETER");
		var parmTxt=(domNodes && domNodes.length ? "" : "None");
		for (var i=0; i < domNodes.length; i++)
			parmTxt+=getParameterText(domNodes[i]);
		objSect.text=parmTxt;
	}
	objLst.addSection(objSect);

	domNode=objNode.selectSingleNode("./NOTES");
	objSect=new SectionObject();
	objSect.title="Remarks";
	objSect.text=(domNode ? domNode.text : "");
	objLst.addSection(objSect);

	domNode=objNode.selectSingleNode("./EXAMPLES");
	if (domNode)
	{
		objSect=new SectionObject();
		objSect.className="treeTextExample";
		objSect.title="Example";
		objSect.text=domNode.text;
		objLst.addSection(objSect);
	}

	objLst.render();
}
//-----------------------------------------------------------------------------
function createMethodList()
{
	var objLst=new ViewObject();
	var treeRef=domTree.selectedNode;
	var parObject=treeRef.parentNode;
	var parId=parObject.id.substr(parObject.id.indexOf(".")+1);
	var objNode=constDoc.selectSingleNode("//CONSTRUCTOR[@name='"+parId+"']");

	var objSect=new SectionObject();
	objSect.title=parId + " Methods";

	var domNodes=objNode.selectNodes("./METHOD");
	for (var i=0; i < domNodes.length; i++)
	{
		var domNode=domNodes[i];
		var link=new Object();
		link.name=domNode.getAttribute("name");
		link.parName=parId;
		objSect.links[objSect.links.length]=link;
	}
	objLst.addSection(objSect);

	objLst.render();
}
//-----------------------------------------------------------------------------
function getParameterText(node)
{
	var str=node.getAttribute("name");
	str+=" ["+node.getAttribute("type")+"]";
	str+=(node.getAttribute("required")=="0"
		? " (optional)" : " ");
	str+=(node.getAttribute("comment")
		? " - "+node.getAttribute("comment") : "");
	str+=(node.getAttribute("default")
		? " default: "+node.getAttribute("default")+"\n" : "\n");
	return str;
}
//-----------------------------------------------------------------------------
// button link onclick handler
function onButtonClick()
{
	var trNodeName=this.getAttribute("parName")+"."+this.id;
	var trNode=findTreeNodeById(domTree.root,trNodeName);
	if (trNode) trNode.select(true);
}
function findTreeNodeById(treeNode,id)
{
	if (!treeNode)
		return null;
	if (treeNode.id == id)
		return treeNode;
	if (id.substr(0,4) == "root")
		id=id.substr(5);
	var len=treeNode.childNodes.length;
	for (var i = 0; i < len; i++)
	{
		var childNode=treeNode.childNodes[i];
		var aNode=findTreeNodeById(childNode,id);
		if (aNode) return aNode;
	}	
	return (null);
}

//-----------------------------------------------------------------------------
function onTreeKeyDown()
{
	var evtCaught=false;
	var evt=window.event;
	switch (evt.keyCode)
	{
	case 37:			// left arrow
		domTree.onLeftArrow();
		evtCaught=true;
		break;
	case 38:			// up arrow
		domTree.onUpArrow();
		evtCaught=true;
		break;
	case 39:			// right arrow
		domTree.onRightArrow();
		evtCaught=true;
		break;
	case 40:			// down arrow
		domTree.onDownArrow();
		evtCaught=true;
		break;
	}
	if (evtCaught)
	{
		window.event.keyCode=0;
		window.event.cancelBubble=true;
		window.event.returnValue=false;
	}
}

//-----------------------------------------------------------------------------
function onButtonFocus()
{
	this.className = "anchorFocus";
}
//-----------------------------------------------------------------------------
function onButtonBlur()
{
	this.className = "anchorActive";
}
//-----------------------------------------------------------------------------
function onButtonMouseOut()
{
	if (this.className == "anchorHover")
		this.className="anchorActive" 
}
//-----------------------------------------------------------------------------
function onButtonMouseOver()
{
	if (this.className == "anchorActive")
		this.className = "anchorHover"
}

//-----------------------------------------------------------------------------
function ViewObject()
{
	this.sections=new Array();
	this.length=0;
}
ViewObject.prototype.addSection=function(objSection)
{
	this.sections[this.length]=objSection;
	this.length=this.sections.length;
}
ViewObject.prototype.clear=function()
{
	listTD.removeChild(listDiv);
	var newNode=document.createElement("DIV");
	newNode.id="listDiv";
	newNode.className="listDiv";
	newNode.style.width="100%";
	newNode.style.height="100%";
	newNode.style.overflow="auto";
	listTD.appendChild(newNode);
}
ViewObject.prototype.render=function()
{
	this.clear();

	var newNode=document.createElement("TABLE");
	newNode.style.width="96%";
	newNode.style.marginLeft="12px";
	newNode.style.marginTop="12px";
	newNode.style.tableLayout="fixed";

	var colGrp=document.createElement("COLGROUP");
	var colNode=document.createElement("COL");
	colNode.width="96%";
	colGrp.appendChild(colNode);
	newNode.appendChild(colGrp);
	newNode=listDiv.appendChild(newNode);

	for (var i=0; i < this.length; i++)
	{
		var sect=this.sections[i];
		sect.render(newNode);
	}
}

//-----------------------------------------------------------------------------
function SectionObject()
{
	this.title="";
	this.text="";
	this.links=new Array();
}
SectionObject.prototype.render=function(container)
{
	var link;
	var newNode;
	var objRow;
	var objCell;

	objRow=container.insertRow();
	objCell=objRow.insertCell();
	newNode=document.createElement("DIV");
	newNode.className="listTitle";
	newNode.innerText=this.title;
	objCell.appendChild(newNode);

	objRow=container.insertRow();
	objCell=objRow.insertCell();
	newNode=document.createElement("DIV");
	if (this.className)
		newNode.className=this.className;
	else
		newNode.className="listText"
	if (this.text=="" && this.links.length==0)
		newNode.innerText="\n";
	else
	{
		var html="";
		if (newNode.className == "treeTextExample")
			html="<pre>"+this.text.replace(/\t/g,"   ")+"</pre>";
		else
			html=this.text.replace(/\n/g,"<BR>");
		newNode.innerHTML=html;
	}
	newNode.style.marginLeft="12px";
	objCell.appendChild(newNode);

	objRow=container.insertRow();
	objCell=objRow.insertCell();

	if (this.links.length < 1) return;
	
	var divNode=document.createElement("DIV");
  	divNode.style.marginLeft="12px";
	divNode.style.height="100%";

	for (var i=0; i < this.links.length; i++)
	{
		link=this.links[i];
		var btnNode=document.createElement("BUTTON");
		btnNode.id=link.name;
		btnNode.setAttribute("parName",link.parName);
		btnNode.className="anchorActive";
		btnNode.onclick=onButtonClick;
		btnNode.onfocus=onButtonFocus;
		btnNode.onblur=onButtonBlur;
		btnNode.onmouseover=onButtonMouseOver;
		btnNode.onmouseout=onButtonMouseOut;
		btnNode.hideFocus=true;
		if (i)
			btnNode.style.marginLeft="4px";
		btnNode.innerHTML=link.name;
		divNode.appendChild(btnNode);
		if ( i < this.links.length-1)
		{
			newNode=document.createElement("DIV");
			newNode.style.display="inline";
			newNode.style.position="relative";
			newNode.innerText="|";
			divNode.appendChild(newNode);
		}
	}
	objCell.style.wordWrap="break-word";
	objCell.appendChild(divNode);
}
