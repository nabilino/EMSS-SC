/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/tools/domref/domtree.js,v 1.2.4.1.4.4.22.2 2012/08/08 12:48:54 jomeli Exp $ */
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

function Tree(treeId)
{
	this.id=treeId;
	this.root=null;
	this.selectedNode=null;
	this.collapsedIcon="../../images/plus.gif";
	this.expandedIcon="../../images/minus.gif";
	this.leafIcon="../../images/spacer.gif";
	this.collapsedImage=null;
	this.expandedImage=null;
	this.leafImage=null;
	this.useImages=true;
	this.myWindow=null;
	this.html=null;
	this.onclick="";
	this.hasFocus=false;
}
//-----------------------------------------------------------------------------
Tree.prototype.render=function()
{
	if (!this.root) return;
	if (!this.expandedImage)
		this.useImages=false;
	this.root.tree=this;
	this.root.render();
}
//-----------------------------------------------------------------------------
Tree.prototype.onLeftArrow=function()
{
	if (this.selectedNode.expanded)
		this.selectedNode.collapse();
	else if (this.selectedNode.parentNode)
		this.selectedNode.parentNode.select();
}
//-----------------------------------------------------------------------------
Tree.prototype.onRightArrow=function()
{
	if (!this.selectedNode.expanded)
		this.selectedNode.expand();
	else if (this.selectedNode.hasChildNodes)
	{
		this.selectedNode.expand();
		var tempNode=this.selectedNode.childNodes[0];
		tempNode.select();
	}
}
//-----------------------------------------------------------------------------
Tree.prototype.onUpArrow=function()
{
	if (!this.selectedNode.parentNode) return;

	if (this.selectedNode.index)
	{
		var tempNode=this.selectedNode.parentNode.getChildNode(this.selectedNode.index-1);
		while (tempNode)
		{
			if (!tempNode.hasChildNodes || !tempNode.expanded)
			{
				tempNode.select();
				tempNode=null;
				break;
			}
			tempNode = tempNode.getChildNode(tempNode.length-1);
		}
	}
	else
		this.selectedNode.parentNode.select();
}
//-----------------------------------------------------------------------------
Tree.prototype.onDownArrow=function()
{
	if (!this.selectedNode.parentNode)
	{
		this.selectedNode.childNodes[0].select();
		return;
	}

	if (this.selectedNode.hasChildNodes && this.selectedNode.expanded)
		this.selectedNode.childNodes[0].select();
	else if (this.selectedNode.index < this.selectedNode.parentNode.length-1)
	{
		var tempNode = this.selectedNode.parentNode.getChildNode(this.selectedNode.index+1);
		tempNode.select();
	}
	else
	{
		var tempNode=this.selectedNode.parentNode;
		while (tempNode)
		{
			if (!tempNode.parentNode)
			{
				tempNode=null;
				break;
			}
			if (tempNode.index < tempNode.parentNode.length-1)
			{
				tempNode = tempNode.parentNode.getChildNode(tempNode.index+1);
				tempNode.select();
				tempNode=null;
				break;
			}
			tempNode=tempNode.parentNode;
		}
	}
}
//-----------------------------------------------------------------------------
Tree.prototype.setActiveNode=function(newNode)
{
	var curIem=null;
	if (this.selectedNode)
	{
		curItem=this.selectedNode.html.childNodes[0].childNodes[2];
		curItem.className="treeText";
		curItem.tabIndex="-1";
	}
	this.selectedNode=newNode;
	curItem=newNode.html.childNodes[0].childNodes[2];
	curItem.className="treeTextSelected";
	curItem.tabIndex="1";
}

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
function TreeNode(nodeId,nodeTitle,nodeToolTip,nodeImage,owningTree)
{
	this.id=(nodeId ? nodeId : "");
	this.title=(nodeTitle ? nodeTitle : "");
	this.index=-1;
	this.parentNode=null;
	this.hasChildNodes=false;
	this.expanded=false;
	this.toolTip=(nodeToolTip ? nodeToolTip : "");
	this.childNodes=new Array();
	this.length=0;
	this.rendered=false;
	this.visible=true;
	this.onclick="";
	this.tree=(owningTree ? owningTree : null);
	this.baseImage=(nodeImage ? nodeImage : null);
	this.html=null;
	this.stateIcon=null;
	this.stateImage=null;
	this.insert=null;
	
	return this;
}
//-----------------------------------------------------------------------------
TreeNode.prototype.appendChild=function(node)
{
	if (!node) return null;
	
	this.childNodes[this.length]=node;
	node.index=this.length;
	node.parentNode=this;
	node.tree=this.tree;
	this.hasChildNodes=true;
	this.length=this.childNodes.length;
	
	return node;
}
//-----------------------------------------------------------------------------
TreeNode.prototype.removeChild=function(node)
{
	if (!node) return null;
	
	var ret=this.childNodes.slice(node.index,1);
	this.length=this.childNodes.length;
	if (this.length==0)
		this.hasChildNodes=false;
	return ret;
}
//-----------------------------------------------------------------------------
TreeNode.prototype.getChildNode=function(index)
{
	var elm=null;
	if (typeof(index)=="number")
		elm=this.childNodes[index];
	return elm;
}
//-----------------------------------------------------------------------------
TreeNode.prototype.expand=function()
{
	if (this.expanded) return;

	if (this.hasChildNodes)
	{
		if (!this.childNodes[0].rendered)
			for (var i=0; i < this.length; i++)
				this.childNodes[i].render();
		else
			for (var i=0; i < this.childNodes.length; i++)
				this.childNodes[i].html.style.display="block";

		this.stateIcon.src=this.tree.expandedIcon;
		if (this.tree.useImages)
			this.stateImage.src=this.tree.expandedImage;
	}
	this.expanded=true;
}
//-----------------------------------------------------------------------------
TreeNode.prototype.collapse=function()
{
	if (!this.expanded) return;
	
	var bSelectIt=false;
	if (this.hasChildNodes)
	{
		for (var i=0; i < this.childNodes.length; i++)
			this.childNodes[i].html.style.display="none";
		this.stateIcon.src=this.tree.collapsedIcon;
		if (this.tree.useImages)
			this.stateImage.src=this.tree.collapsedImage;

		// is selected node a descendent? if so, select me
		var bSelectMe=false;
		if (this.tree.selectedNode.html.style.display=="none")
			bSelectMe=true;
		else
		{
			var aParent=(this.tree.selectedNode.parentNode 
						? this.tree.selectedNode.parentNode : null);
			while (aParent)
			{
				if (aParent.html.style.display=="none")
				{
					bSelectMe=true;
					break;
				}
				aParent=aParent.parentNode;
			}
		}
		if (bSelectMe) this.select();
	}
	this.expanded=false;
}
//-----------------------------------------------------------------------------
TreeNode.prototype.render=function()
{
	var myTree;
	var lineDiv;
	var objChild;
	var childless;
	var icoRep;
	var imgRep;
	var spanNode;
	var imgNode;
	var noBreak;

	myTree=this.tree;
	childless=!this.hasChildNodes;
	icoRep=(childless 
		? this.tree.leafIcon
		: this.tree.collapsedIcon);
	imgRep=(this.baseImage
		? this.baseImage
		: (childless ? myTree.leafImage : myTree.collapsedImage));

	lineDiv=myTree.myWindow.document.createElement("DIV");
	lineDiv.id=this.id;
	lineDiv.setAttribute("nodeRef",this);
	lineDiv.className="treeBranch";

	noBreak=myTree.myWindow.document.createElement("NOBR");
	spanNode=myTree.myWindow.document.createElement("SPAN");
	imgNode=myTree.myWindow.document.createElement("IMG");
	imgNode.id="indIcon";
	imgNode.src=icoRep;
	imgNode.icon=icoRep;
	if (icoRep == this.tree.leafIcon)	// spacer image
	{
		imgNode.width="9px";
		imgNode.height="9px";
	}
	spanNode.className="treeExpandIcon";
	spanNode.appendChild(imgNode);
	spanNode.onclick=routeTreeNodeClick;
	this.stateIcon=imgNode;
	noBreak.appendChild(spanNode);

	if (this.tree.useImages)
	{
		spanNode=myTree.myWindow.document.createElement("SPAN");
		imgNode=myTree.myWindow.document.createElement("IMG");
		imgNode.id="indImg";
		imgNode.src=imgRep;
		spanNode.className="treeImage";
		spanNode.appendChild(imgNode);
		spanNode.onclick=routeTreeNodeClick;
		spanNode.ondblclick=routeTreeNodeClick;
		this.stateImage=imgNode;
		noBreak.appendChild(spanNode);
	}

	spanNode=myTree.myWindow.document.createElement("SPAN");
	spanNode.id="indTitle";
	spanNode.appendChild(myTree.myWindow.document.createTextNode(this.title));
	spanNode.className="treeText";
	spanNode.tabIndex="-1";
	spanNode.onclick=routeTreeNodeClick;
	spanNode.ondblclick=routeTreeNodeClick;
	spanNode.onmouseover=handleTreeNodeMouseOver;
	spanNode.onmouseout=handleTreeNodeMouseOut;
	noBreak.appendChild(spanNode);
	lineDiv.appendChild(noBreak);

	if (this.parentNode)
	{
		lineDiv.style.marginLeft="16px";
		this.parentNode.html.appendChild(lineDiv);
	}
	else
		myTree.html.appendChild(lineDiv);

	this.html=lineDiv;
	this.rendered=true;
	return;
}
//-----------------------------------------------------------------------------
TreeNode.prototype.select=function(bExpand)
{
	bExpand = (typeof(bExpand) == "boolean" ? bExpand : false);
	if (bExpand)
	{
		if (!this.tree.selectedNode.expanded)
			this.tree.selectedNode.expand();
	}
	if (this.parentNode)
	{
		var aParent=this.parentNode
		while (!aParent.expanded)
		{
			aParent.expand();
			aParent=aParent.parentNode;
		}
	}

	this.tree.setActiveNode(this);

	eval(this.onclick);
	eval(this.tree.onclick);
	this.html.childNodes[0].childNodes[2].focus();
}

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
function handleTreeNodeMouseOver()
{
	if (this.className != "treeTextSelected")
		this.className = "treeTextHighlight";
}
function handleTreeNodeMouseOut()
{
	if (this.className == "treeTextHighlight")
		this.className = "treeText";
}

//-----------------------------------------------------------------------------
function routeTreeNodeClick()
{
	var srcElm=window.event.srcElement;
	var evtTyp=window.event.type;
	var conElm=srcElm;
	while(conElm.nodeName!="DIV")
		conElm=conElm.parentNode;
	var treeRef=conElm.getAttribute("nodeRef");


	switch (srcElm.id)
	{
		case "indTitle":
		case "indImg":
			domTree.setActiveNode(treeRef);
			treeRef.html.childNodes[0].childNodes[2].focus();
			if (evtTyp=="dblclick")
				treeRef.expanded ? treeRef.collapse() : treeRef.expand();
			else
				eval(treeRef.onclick);
			break;

		case "indIcon":
		default:
			treeRef.expanded ? treeRef.collapse() : treeRef.expand();
			break;
	}
}
