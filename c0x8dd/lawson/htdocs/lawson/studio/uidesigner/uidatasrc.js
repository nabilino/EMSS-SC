/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/uidatasrc.js,v 1.2.8.1.12.1.8.3 2012/08/08 12:48:51 jomeli Exp $ */
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

function DataSrcMgr(xmlDoc,origDoc)
{
	this.xmlDoc=xmlDoc;
	this.origDoc=origDoc;
	this.hiddenXML=null;
	this.detailXML=null;
	this.pushXML=null;

	if (!xmlDoc || !origDoc) return;

	this.buildHiddenList()
	this.buildDetailList()
	this.buildPushList()
}

//-----------------------------------------------------------------------------
DataSrcMgr.prototype.buildHiddenList=function()
{
	var strXML="<?xml version=\"1.0\"?>\n<HIDDEN>\n</HIDDEN>\n"
	this.hiddenXML=top.xmlFactory.createInstance("DOM");
 	this.hiddenXML.async=false
	this.hiddenXML.setProperty("SelectionLanguage", "XPath");
 	this.hiddenXML.loadXML(strXML)

	// load the hiddens DOM
	var root=this.hiddenXML.documentElement
	var nodes=this.xmlDoc.selectNodes("//fld[@tp='Hidden']")
	for ( var i=0; i < nodes.length; i++ )
	{
		// don't add detail fields to our hidden list
		if ( nodes[i].getAttribute("det") ) continue;
		var newNode = nodes[i].cloneNode(false)
		root.appendChild(newNode)
	}
}

//-----------------------------------------------------------------------------
DataSrcMgr.prototype.buildDetailList=function()
{
	// check for presence of detail area in original form
	var dtlNodes=this.origDoc.selectNodes("//detail")
	if (!dtlNodes || dtlNodes.length == 0) return;

	// load the detail DOM
	var strXML="<?xml version=\"1.0\"?>\n<DETAIL>\n</DETAIL>\n"
	this.detailXML=top.xmlFactory.createInstance("DOM");
 	this.detailXML.async=false
	this.detailXML.setProperty("SelectionLanguage", "XPath");
 	this.detailXML.loadXML(strXML)
	var root=this.detailXML.documentElement

	var dtlNodes=this.xmlDoc.selectNodes("//detail")
	if (!dtlNodes || dtlNodes.length == 0) return;
	
	for (var i = 0; i < dtlNodes.length; i++)
	{
		var dtlName=dtlNodes[i].getAttribute("nbr")
		if (!dtlName) continue;

		// now build list from current form hidden detail fields
		var nodes=dtlNodes[i].selectNodes("./fld[@tp='Hidden' and @par='"+dtlName+"'] | ./push[@par='"+dtlName+"']")
		for ( var j=0; j < nodes.length; j++ )
		{
			var newNode = nodes[j].cloneNode(false)
			root.appendChild(newNode)
		}
	}
}

//-----------------------------------------------------------------------------
DataSrcMgr.prototype.buildPushList=function()
{
	var strXML="<?xml version=\"1.0\"?>\n<PUSH>\n</PUSH>\n"
	this.pushXML=top.xmlFactory.createInstance("DOM");
 	this.pushXML.async=false
	this.pushXML.setProperty("SelectionLanguage", "XPath");
 	this.pushXML.loadXML(strXML)

	// check for presence of detail area
	var dtlNode=this.xmlDoc.selectSingleNode("//detail")
	var dtlName= dtlNode ? dtlNode.getAttribute("nbr") : ""

	// load the hiddens DOM
	var root=this.pushXML.documentElement
	var nodes=this.xmlDoc.selectNodes("//push")
	for ( var i=0; i < nodes.length; i++ )
	{
		if ( nodes[i].getAttribute("par") )
		{
			// don't add detail fields to our push list
			if ( ( nodes[i].getAttribute("par") == dtlName )
			&& ( dtlName != "") )
				continue;
		}
		var newNode = nodes[i].cloneNode(false)
		root.appendChild(newNode)
	}
}

//-----------------------------------------------------------------------------
DataSrcMgr.prototype.add=function(node)
{
	var newNode=node.cloneNode(false)
	if (!newNode.getAttribute("nm")) return

	var root=null
	if (node.selectSingleNode("ancestor::detail"))
		root=this.detailXML.documentElement
	else
		root=this.hiddenXML.documentElement

	var nodes=root.childNodes
	root.insertBefore(newNode, nodes[0])
}

//-----------------------------------------------------------------------------
DataSrcMgr.prototype.remove=function(node)
{
	try {
		var root=null
		if (node.selectSingleNode("ancestor::detail"))
			root=this.detailXML.documentElement
		else
			root=this.hiddenXML.documentElement

		for ( var i = 0; i < root.childNodes.length; i++)
		{
			var remNode=root.childNodes[i]
			if (remNode.getAttribute("nbr")==node.getAttribute("nbr"))
			{
				root.removeChild(remNode)
				return
			}
		}
	} catch (e) {}
}

//-----------------------------------------------------------------------------
// field removed; add to datasrc selections
DataSrcMgr.prototype.freeDataSrc=function(node)
{
	var nbr = node.getAttribute("nbr")
	if (!nbr || nbr == "") return;
	if (nbr.substr(0,2) != "_f") return;

	if (node.nodeName=="detail")
		this.makeDataFldsAvailable(this.detailXML, node, nbr)
	else if (node.selectSingleNode("ancestor::detail"))
		this.makeDataFldsAvailable(this.detailXML, node, nbr)
	else
		this.makeDataFldsAvailable(this.hiddenXML, node, nbr)
}

//-----------------------------------------------------------------------------
// recursive function for make data fields available
DataSrcMgr.prototype.makeDataFldsAvailable=function(oDom, node, nbr)
{
	var len = node.childNodes.length
	for (var i = 0; i < len; i++)
	{
		var name=node.childNodes(i).nodeName;
		if (name!="#text" && name !="#comment")
			this.makeDataFldsAvailable(oDom, node.childNodes(i), node.childNodes(i).getAttribute("nbr"))
	}

	// only fields should be added to the list
	if (node.nodeName!="fld") return

	// don't add labels or rectangles to the list
	if (node.getAttribute("tp")=="label") return
	if (node.getAttribute("tp")=="rect") return

	// does it already exist in the list?
	var nbrNode=oDom.selectSingleNode("//*[@nbr='"+nbr+"']")
	if (nbrNode) return

	nbrNode=this.xmlDoc.selectSingleNode("//*[@nbr='"+nbr+"']")
	if (!nbrNode) return

	var newNode = nbrNode.cloneNode(false)
	oDom.documentElement.appendChild(newNode)
}

//-----------------------------------------------------------------------------
DataSrcMgr.prototype.getAvailableDOM=function(node)
{
	var dom=null;
	if (!node)
	{
		if (this.hiddenXML.documentElement.childNodes.length > 0)
 			dom=this.hiddenXML
	}
	else
	{
		try{
			if (node.selectSingleNode("ancestor::detail"))
			{
				if (this.detailXML) dom=this.detailXML
			}
		} catch (e) { }
		if (!dom)
		{
			if (node.nodeName=="push")
			{
				if (this.pushXML.documentElement.childNodes.length > 0)
	 				dom=this.pushXML
			}			
			else if (this.hiddenXML.documentElement.childNodes.length > 0)
	 			dom=this.hiddenXML
		}
	}
	return(dom);
}

//-----------------------------------------------------------------------------
DataSrcMgr.prototype.removeItem=function(node,oldNode)
{
	if (oldNode.nodeName!="push") this.remove(oldNode)

	// move the original data bind to the end of the list
	if ( node.getAttribute("nm") && node.getAttribute("nm") != "" )
	{
		var newNode = node.cloneNode(false)
		if (node.selectSingleNode("ancestor::detail"))
			this.detailXML.documentElement.appendChild(newNode)
		else
			this.hiddenXML.documentElement.appendChild(newNode)
	}
}
