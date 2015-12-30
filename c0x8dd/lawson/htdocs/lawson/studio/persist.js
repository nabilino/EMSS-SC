/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/persist.js,v 1.8.2.4.16.1.2.3 2012/08/08 12:48:50 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// persist.js
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


//-----------------------------------------------------------------------------
// Persistence
function Persistence()
{
	this.activeProv=null;
	this.providers=new LawCollection();
}
Persistence.prototype.getActiveProv=function()
{
	return this.activeProv;
}
Persistence.prototype.getProv=function(provId)
{
	return (provId?this.providers.item(provId):null);
}
Persistence.prototype.loadProvider=function(xmlNode)
{
	try	{
		var provId=xmlNode.getAttribute("id");
		var provStr="new "+xmlNode.getAttribute("constructor")+"(xmlNode,this)";
		var prov=eval(provStr);
		if (prov)
		{
			var path = "";
			switch (provId)
			{
				case "local":
					path = top.designStudio.getUserPreference("LOCALWORKSPACE");
					break;
				case "remote":
					path = top.designStudio.getUserPreference("PORTAL","/lawson/portal")+"/content";
					break;
			}
			var nomsg=true;
			prov.init(top.designStudio,path,nomsg);
			// PT111803
			// keep in list, but not enabled
			//if(!prov.enabled) return null;
			this.providers.add(provId,prov);
			if (prov.enabled && !this.activeProv)
				this.activeProv=prov;
		}

	} catch (e)	{ }
}
Persistence.prototype.setActiveProv=function(prov)
{
	this.activeProv=prov;
}

//-----------------------------------------------------------------------------
// Provider Workspaces are like drives
function ProviderWorkspace(drive,root,trail,type)
{
	this.drive=drive;
	this.root=root;
	this.path=root;
	this.trail=trail;
	this.type=type;
}

//-----------------------------------------------------------------------------
function LocalProvider(xml,persist)
{
	this.enabled=false;
	this.fso=null;
	this.wksp=null;
	this.persist=persist;
	this.xml=xml;
	this.workspaces=new LawCollection();
}
LocalProvider.prototype.init=function(studio,path,nomsg)
{
	try	{
		this.fso=new ActiveXObject("Scripting.FileSystemObject");
		if (!this.fso)
			return null;
		this.enabled=true;
		var en=new Enumerator(this.fso.drives);
		var idx = 0
		var	idxSelect=-1
		for ( ; !en.atEnd(); en.moveNext())
		{
			var drive=en.item();
			var trail="\\"
			var root=drive.DriveLetter+":\\"
			var wksp=new ProviderWorkspace(drive.DriveLetter,root,trail,drive.DriveType);
			this.workspaces.add(drive.driveLetter,wksp);
			if (idxSelect == -1 && drive.DriveType==2)	// fixed drive
				idxSelect=idx;
			idx++;
		}

		// must set a workspace before calling any methods
		this.setWorkspace(idxSelect);
		if (path!="")
			this.cd(path);

	} catch (e)	{
		this.fso=null;
		this.enabled=false;
		if (!nomsg)
		{
			var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_INIT")
				+ ": " + top.designStudio.stringTable.getPhrase("LBL_local") + ".";
			var ret=top.cmnDlg.messageBox(msg,"ok","alert",window);
		}
	}
}
LocalProvider.prototype.buildFullPath=function(path,filename)
{
	if (!path)
		path=(this.wksp.path+this.wksp.trail+filename);
	else
	{
		var wksp=this.getWorkspaceFromPath(path);
		if (wksp)
			path=(path+wksp.trail+filename);
		else
			return (top.designStudio.stringTable.getPhrase("MSG_NOT_AVAILABLE"));
	}
	path=path.replace("\\\\","\\");
	return path;
}
// returns new path
LocalProvider.prototype.cd=function(name,nomsg)
{
	try	{
		if (this.persist)
			this.persist.setActiveProv(this);
		if (!name) return null;
		var path;
		if (name.indexOf(this.wksp.trail)>-1)
		{
			path=name;
			this.setWorkspaceByPath(path);
		}
		else
		{
			if (name != this.wksp.root)
			{
				if (this.wksp.path)
					path = this.wksp.path + this.wksp.trail + name;
				else
					path = this.wksp.root + this.wksp.trail + name;
			}
			else
				path=this.wksp.root
		}
		if (!path) return null;
		if (path == this.wksp.root)
		{
			if (!this.fso.folderExists(path+this.wksp.trail)) return null;
		}
		else
		{
			if (!this.fso.folderExists(path)) return null;
		}
		path=path.replace("\\\\","\\");
		this.wksp.path=path;
		return path;

	} catch (e)	{
		if (!nomsg)
		{
			var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_CD");
			var ret=top.cmnDlg.messageBox(msg,"ok","alert",window);
		}
		return null;
	}
}
// returns boolean
LocalProvider.prototype.del=function(ds,nomsg)
{
	try	{
		if (this.persist)
			this.persist.setActiveProv(this);
		if (!ds) return false;

		var name = (ds.getItem("docName"))?ds.getItem("docName").value:null;
		if(!name)
		{
			var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_DEL");
			var ret=top.cmnDlg.messageBox(msg,"ok","alert",window);
			return false;
		}

		var path;
		if (name.indexOf(this.wksp.trail)>-1)
			path=name;
		else
		{
			if (this.wksp.path)
			 	path=this.wksp.path+this.wksp.trail+name;
			else
			 	path=this.wksp.root+this.wksp.trail+name;
		}
		if (!ds.getItem("docPath"))ds.add("docPath", this.wksp.path);
		if (!path) return false;

		if(this.fso.fileExists(path))
		{
			this.fso.deleteFile(path);
			top.designStudio.popRecentFileDS(ds);
			return true;
		}
		else if(this.fso.folderExists(path))
		{
			this.fso.deleteFolder(path);
			return true;
		}
		return false;

	} catch (e)	{
		if (!nomsg)
		{
			var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_DEL");
			var ret=top.cmnDlg.messageBox(msg,"ok","alert",window);
			return false;
		}
	}
}
// returns xml node
LocalProvider.prototype.dir=function(nomsg)
{
	try	{
		if (this.persist)
			this.persist.setActiveProv(this);
		var xmlFileList=xmlFactory.createInstance("DOM");
		var xmlRtNode=xmlFileList.createElement("LIST");
		xmlFileList.documentElement=xmlRtNode;
		xmlRtNode.setAttribute("path",this.wksp.path);

		var folder=this.wksp.path+this.wksp.trail
		var oFolder=this.fso.getFolder(folder);
		if (!oFolder) return null;
		var cFolders=oFolder.subFolders;
		var en=new Enumerator(cFolders);
		for(;!en.atEnd();en.moveNext())
		{
			var oSubFolder=en.item();
			var xmlFolder=xmlFileList.createElement("FOLDER");
			xmlFolder.appendChild(xmlFileList.createCDATASection(oSubFolder.name));
			xmlRtNode.appendChild(xmlFolder);
		}
		var cFiles=oFolder.files;
		en=new Enumerator(cFiles);
		for(;!en.atEnd();en.moveNext())
		{
			var oFile=en.item();
			var xmlFile=xmlFileList.createElement("FILE");
			xmlFile.appendChild(xmlFileList.createCDATASection(oFile.name));
			xmlFile.setAttribute("size",oFile.size);
			xmlFile.setAttribute("timestamp",oFile.dateLastModified);
			xmlFile.setAttribute("suffix",this.fso.getExtensionName(oFile.path));
			xmlRtNode.appendChild(xmlFile);
		}
		return xmlFileList;

	} catch (e)	{
		if (!nomsg)
		{
			var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_DIR");
			var ret=top.cmnDlg.messageBox(msg,"ok","alert",window);
		}
		return null;
	}
}
// returns a data storage object with the necessary information for the designer
LocalProvider.prototype.get=function(ds,retContent,nomsg)
{
	try	{
		this.persist.setActiveProv(this);
		var docName=(ds.getItem("docName")?ds.getItem("docName").value:null);
		var contents="";
		var docPath=(ds.getItem("docPath")?ds.getItem("docPath").value:null);
		if(docPath && this.wksp.path != docPath)
			this.cd(docPath);
		var path=((this.wksp.path && docName)?(this.wksp.path+this.wksp.trail+docName):null);
		var file=(path?this.fso.getFile(path):null);
		var stream=(file?file.openAsTextStream(1,-2):null);
		if (stream)
		{
			while(!stream.atEndOfStream)
				contents=stream.readAll();
		}
		if (contents)
		{
			var docDefn = xmlFactory.createInstance("DOM");
			docDefn.loadXML(contents);
			var projNode=docDefn.selectSingleNode("//PROJECT");
			if (!projNode)
				return null;

			var id=projNode.getAttribute("id");
			var docId=projNode.getAttribute("docId");
			var fileNode=projNode.firstChild;

			if (id) ds.add("id",id);
			if (docId) ds.add("docId",docId);
			if (fileNode) ds.add("contents",fileNode); // XML node of the file contents
			return ds;
		}
		return (ds);

	} catch (e) {
		if (!nomsg)
		{
			var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_GET")+"\n("+path+")";
			var ret=top.cmnDlg.messageBox(msg,"ok","alert",window);
		}
		return null;
	}
}
LocalProvider.prototype.getId=function()
{
	return (this.xml?this.xml.getAttribute("id"):null);
}
LocalProvider.prototype.getPath=function()
{
	return (this.wksp?this.wksp.path:null);
}
LocalProvider.prototype.getTrail=function()
{
	return (this.wksp?this.wksp.trail:null);
}
LocalProvider.prototype.getWorkspaceFromPath=function(path)
{
	if (this.wksp && path.indexOf(this.wksp.root)==0)
		return (this.wksp);
	var wkspcs=this.workspaces.items();
	var lenWkspcs=(wkspcs?wkspcs.length:0);
	var plc=path.toLowerCase();
	for (var i=0;i<lenWkspcs;i++)
		if (plc.indexOf(wkspcs[i].root.toLowerCase())==0)
			return (wkspcs[i]);
	return null;
}
LocalProvider.prototype.pwd=function()
{
	return (this.wksp?this.wksp.path:"");
}
//-----------------------------------------------------------------------------
// requires:
// ds.id - filename
// ds.docId - designer document type
// ds.subId - sub type
// ds.contents - file contents
// returns true/false
LocalProvider.prototype.put=function(ds, bDispMsg)
{
	if (typeof(bDispMsg) != "boolean")
		bDispMsg=true;
	try	{
		if (!ds)
		{
			if (bDispMsg)
			{
				var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_ACCESS")+" - "+this.getId();
				top.cmnDlg.messageBox(msg,"ok","stop")
			}
			return false;
		}

		if (this.persist)
			this.persist.setActiveProv(this);

		var id=(ds.getItem("id")?ds.getItem("id").value:null);
		var docId=(ds.getItem("docId")?ds.getItem("docId").value:null);
		var docName=(ds.getItem("docName")?ds.getItem("docName").value:null);
		var docPath=(ds.getItem("docPath")?ds.getItem("docPath").value:null);
		var provId=(ds.getItem("provId")?ds.getItem("provId").value:null);
		var c=(ds.getItem("contents")?ds.getItem("contents").value:null);
		if (provId && (provId!=this.getId()))
		{
			if (bDispMsg)
				top.cmnDlg.messageBox(top.designStudio.stringTable.getPhrase("ERR_PROV_ACCESS"),"ok","stop")
			return false;
		}
		if (docPath && (docPath!=this.wksp.path))
		{
			if (this.cd(docPath)!=docPath)
			{
				if (bDispMsg)
					top.cmnDlg.messageBox(top.designStudio.stringTable.getPhrase("ERR_PROV_DIR"),"ok","stop")
				return false;
			}
		}
		var folder=(this.wksp.path?this.fso.getFolder(this.wksp.path):null);
		var streamFile=(folder?folder.createTextFile(docName,true):null);
		if (!streamFile)
		{
			if (bDispMsg)
				top.cmnDlg.messageBox(top.designStudio.stringTable.getPhrase("ERR_PROV_PUT"),"ok","stop")
			return false;
		}

		var xmlVerStr="<?xml version=\"1.0\"?>";

		// if c already has an xml string, remove it
		if (c.indexOf(xmlVerStr)==0)
			c=c.substring(xmlVerStr.length);

		// wrap within PROJECT element
		c=xmlVerStr+"\n"
		+"<PROJECT id=\""+id+"\" docId=\""+docId+"\">\n"
		+c+"\n"
		+"</PROJECT>";
		streamFile.write(c);
		streamFile.close();
		return true;

	} catch (e) {
		if (bDispMsg)
		{
			var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_PUT");
			top.cmnDlg.messageBox(msg,"ok","alert",window);
		}
		return false;
	}
}
LocalProvider.prototype.setDirDS=function(dirDS)
{
	var provId = dirDS.getItem("provId")?dirDS.getItem("provId").value:null;
	var docPath = dirDS.getItem("docPath")?dirDS.getItem("docPath").value:null;
	if (docPath && provId && provId == "local")
		this.cd(docPath);
}
LocalProvider.prototype.setWorkspace=function(key)
{
	var wksp=this.workspaces.item(key);
	if (!wksp)
		return null;
	this.wksp=wksp;
	var ret=this.cd(this.wksp.path);
	return (ret);
}
LocalProvider.prototype.setWorkspaceByPath=function(path)
{
	// called from cd to make sure we are set to the correct workspace
	this.wksp=this.getWorkspaceFromPath(path);
	return (this.wksp);
}
LocalProvider.prototype.up=function(mode)
{
	if (this.persist)
		this.persist.setActiveProv(this);
	var len=(this.wksp.path?this.wksp.path.length:0);
	if (!len) return null;
	var arrLoc=(this.wksp.trail?this.wksp.path.split(this.wksp.trail):null);
	var lenLoc=(arrLoc?arrLoc.length:0);

	// remove the last dir
	var newLoc="";
	for (var i=0; i < lenLoc - 1; i++)
		newLoc+=(i>1?this.wksp.trail:"") + arrLoc[i] + (i==0?this.wksp.trail:"");
	var ret=(newLoc?this.cd(newLoc):null);
	return ret;
}

//-----------------------------------------------------------------------------
function RemoteProvider(xml,persist)
{
	this.arrProvDirIds=null;
	this.desId=null;
	this.desStub=null
	this.docId=null;
	this.docStub=null;
	this.enabled=false;
	this.persist=persist;
	this.provDir=null;
	this.studio=null;
	this.trail="/";
	this.xml=xml;

	// after this.xml set
	this.root=contentPath;
	this.highest=this.root;
	this.path=this.root;
	this.pathSvr=this.trail;
}
RemoteProvider.prototype.init=function(studio,path,nomsg)
{
	this.studio=studio;
	
	// call the file manager cgi to see if we are configured properly
	// we only care about a response "ping", which will be null if it does not
	// exist, or HTML if the server cannot find it
	top.fileMgr.dispError=false;
	var fm=top.fileMgr.getResponse("", null,"","");
	if (fm!=null && fm.selectSingleNode("HTML")!=null)
	{
		var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_INIT")
			+ ": " + top.designStudio.stringTable.getPhrase("LBL_remote") + ".";
		var ret=top.cmnDlg.messageBox(msg,"ok","alert",window);
		this.enabled=false;
	}
	else
		this.enabled=true;
}
RemoteProvider.prototype.buildFullPath=function(path,filename)
{
	if (!path)
		return (this.path+this.trail+filename);
	return (path+this.trail+filename);
}
// returns new path
RemoteProvider.prototype.cd=function(name,nomsg)
{
	try	{
		if (this.persist)
			this.persist.setActiveProv(this);
		if (!name) return null;
		var path;
		if(name.indexOf(this.trail) == -1)
		{
			this.desStub = top.designStudio.designers.item(name);
			if (this.desStub)
			{
				this.desId=name;
				this.docId=this.desStub.getDocs().item(0).id;
				name = this.desStub.getProvDir();
				this.path = this.root + this.trail + name;
				return this.path;
			}
		}
		if( (name.indexOf(this.root) != -1) || (name.indexOf(this.trail) == 0) )
			path = name;
		else 
			path = this.path + this.trail + name;
		this.path = path;
		return this.path;
	} catch (e)	{
		if (!nomsg)
		{
			var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_CD");
			var ret=top.cmnDlg.messageBox(msg,"ok","alert",window);
		}
		return null;
	}
}
// returns an xml node
RemoteProvider.prototype.del=function(ds,nomsg)
{
	try	{
		if (this.persist)
			this.persist.setActiveProv(this);

		var docName = (ds.getItem("docName"))?ds.getItem("docName").value:null;
		if(!docName)
		{
			var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_DEL");
			var ret=top.cmnDlg.messageBox(msg,"ok","alert",window);
			return false;
		}
		cPath=top.contentPath
		var ret = top.fileMgr.remove(cPath+"/"+this.path.substr(cPath.length+1), 
					ds.getItem("docName").value);
		if(ret)	
		{
			if(!ds.getItem("docPath"))ds.add("docPath", this.path);
			top.designStudio.popRecentFileDS(ds);
			return true;
		}
		else
			return false;

	} catch (e)	{
		if (!nomsg)
		{
			var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_DEL");
			var ret=top.cmnDlg.messageBox(msg,"ok","alert",window);
		}
		return false;
	}
}
// returns an xml node
RemoteProvider.prototype.dir=function(nomsg)
{
	try	{
		if (this.persist)
			this.persist.setActiveProv(this);

		var xmlFileList=null;
		if (this.path.indexOf(this.root)==0)
		{
			// file path is within the current root directory
			var path = this.path.substr(this.root.length);
			if(path != "")
			{
				xmlFileList = top.fileMgr.getList("alllist", this.root+"/"+path,
						top.designStudio.fileTypes.item("filetype_xml"), true);
			}
			else
				xmlFileList = this.getDesignersXML();
		}
		else
		{
			// the file path is not within current root directory
			var li=this.path.lastIndexOf(this.trail);
			var theRoot=this.path.substring(0,li);
			var thePath=this.path.substring(li+this.trail.length);
			xmlFileList = top.fileMgr.getList("alllist", theRoot+"/"+thePath,
					top.designStudio.fileTypes.item("filetype_xml"), true);
		}
		return xmlFileList;

	} catch (e) {
		if (!nomsg)
		{
			var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_DIR");
			var ret=top.cmnDlg.messageBox(msg,"ok","alert",window);
			return null;
		}
	}
}
// returns a data storage object
RemoteProvider.prototype.get=function(ds,retContent,nomsg)
{
	try	{
		if (this.persist)
			this.persist.setActiveProv(this);

		var docPath=ds.getItem("docPath");
		docPath=(docPath?docPath.value:"");
		if (docPath && (!this.cd(docPath)))
		{
			if (!nomsg)
			{
				var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_CD");
				var ret=top.cmnDlg.messageBox(msg,"ok","alert",window);
			}
			return null;
		}
		var docName = (ds.getItem("docName"))?(ds.getItem("docName")).value:null;
		if(!docName)return null;
		// add return parameters
		if (this.desId) ds.add("id",this.desId);
		if (this.docId) ds.add("docId",this.docId);
		if (this.pwd()) ds.add("docPath",this.pwd());
		if (this.getId()) ds.add("provId",this.getId());
		if(retContent)
		{
			var objFileXML = top.fileMgr.getFile(docPath,docName,"XML");
			if (!objFileXML || objFileXML.status)
			{
				var msg=""
				if (objFileXML && objFileXML.status)
					msg+=top.getHttpStatusMsg(objFileXML.status) +
							"\nServer response: " + objFileXML.statusText + " (" + objFileXML.status + ")";
				top.cmnDlg.messageBox(msg,"ok","stop");
				return null;
			}
			ds.add("contents",objFileXML);
		}
		return ds;

	} catch (e) {
		if (!nomsg)
		{
			var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_GET");
			var ret=top.cmnDlg.messageBox(msg,"ok","alert",window);
		}
		return null;
	}
}
RemoteProvider.prototype.getId=function()
{
	return (this.xml?this.xml.getAttribute("id"):null);
}
RemoteProvider.prototype.getDesignersXML=function()
{
	var xmlFileList=xmlFactory.createInstance("DOM");
	var xmlRtNode=xmlFileList.createElement("LIST");
	xmlFileList.documentElement=xmlRtNode;
	xmlRtNode.setAttribute("path",(this.path)?this.path:"");

	var arrDes=top.designStudio.designers.items();
	var lenDes=(arrDes?arrDes.length:0);
	if (lenDes)
	{
		for(var i=0;i<lenDes;i++)
		{
			var desid=arrDes[i].getId();
			var xmlFolder=xmlFileList.createElement("FOLDER");
			xmlFolder.appendChild(xmlFileList.createCDATASection(desid));
			xmlRtNode.appendChild(xmlFolder);
		}
	}
	return xmlFileList;
}
RemoteProvider.prototype.getPath=function(ds)
{
	return (this.path);
}
RemoteProvider.prototype.getTrail=function()
{
	return (this.trail);
}
// currently does not prompt if file already exists.
// returns true/false.
RemoteProvider.prototype.put=function(ds,bDispMsg)
{
	if (typeof(bDispMsg) != "boolean")
		bDispMsg=true;
	try	{
		if (!ds)
		{
			if (bDispMsg)
			{
				var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_ACCESS")+" - "+this.getId();
				top.cmnDlg.messageBox(msg,"ok","stop")
			}
			return false;
		}

		if (this.persist)
			this.persist.setActiveProv(this);

		var docPath=(ds.getItem("docPath")?ds.getItem("docPath").value:null);
		var provId=(ds.getItem("provId")?ds.getItem("provId").value:null);
		if (provId && (provId!=this.getId()))
		{
			if (bDispMsg)
				top.cmnDlg.messageBox(top.designStudio.stringTable.getPhrase("ERR_PROV_ACCESS"),"ok","stop")
			return false;
		}
		if (docPath && (docPath!=this.path))
		{
			if (this.cd(docPath)!=docPath)
			{
				if (bDispMsg)
					top.cmnDlg.messageBox(top.designStudio.stringTable.getPhrase("ERR_PROV_DIR"),"ok","stop")
				return false;
			}
		}

		var theRoot = "";
		var theFolder = "";
		if (this.path.indexOf(this.root)==0)
		{
			theRoot = this.root;
			theFolder = this.path.substr(this.root.length);
		}
		else
		{
			// the file path is not within current root directory
			var li=this.path.lastIndexOf(this.trail);
			theRoot=this.path.substring(0,li);
			theFolder=this.path.substring(li+this.trail.length);
		}
		
		var docName = ds.getItem("docName")?ds.getItem("docName").value:null;
		var contents = ds.getItem("contents")?ds.getItem("contents").value:null;
		var fmRet = top.fileMgr.save(theRoot+theFolder, docName, contents, "text/xml", true, bDispMsg);
		return ( fmRet == null ? false : true );

	} catch (e) {
		if(bDispMsg)
		{
			var msg=top.designStudio.stringTable.getPhrase("ERR_PROV_PUT");
			top.cmnDlg.messageBox(msg,"ok","alert",window);
		}
		return false;
	}
}
RemoteProvider.prototype.pwd=function()
{
	return (this.path);
}
RemoteProvider.prototype.setDirDS=function(dirDS)
{
	var provId = dirDS.getItem("provId")?dirDS.getItem("provId").value:null;
	var docPath = dirDS.getItem("docPath")?dirDS.getItem("docPath").value:null;
	if(docPath && provId && provId=="remote")
		this.cd(docPath);
	else
	{
		if (dirDS.getItem("setRoot"))
			this.path=this.root;
		else
		{
			var desId = dirDS.getItem("id")?dirDS.getItem("id").value:null;//designer id
			if(desId)this.cd(desId);
		}
	}
}
RemoteProvider.prototype.setHighest=function(h)
{
	this.highest=h;
}
RemoteProvider.prototype.setRoot=function(root)
{
	var i=this.path.indexOf(this.root);
	if (i>-1)
		this.path = this.path.substring(0,i) + root + this.path.substring(i+this.root.length);
	this.root=root;
}
RemoteProvider.prototype.up=function(mode)
{
	if (this.persist)
		this.persist.setActiveProv(this);
	if (this.path == this.root) return null;
	// don't allow save to move up to select another designer
	if (mode=="save" && this.path == this.highest)
		return (null);
	var arrLoc=(this.trail?this.path.split(this.trail):null);
	var lenLoc=(arrLoc?arrLoc.length:0);
	var newLoc="";
	for (var i=0; i < lenLoc-1; i++)
	{
		newLoc+=arrLoc[i];
		if (i < lenLoc-2)
			newLoc+=this.trail
	}
	return (newLoc?this.cd(newLoc):null);
}

//-----------------------------------------------------------------------------
function DesignerStub(id,xml)
{
	this.id=id;
	this.dir=null;
	this.provDir=null;
	this.docs=null;
	this.xml=null;
	this.setXML(xml);
}
DesignerStub.prototype.getId = function()
{
	return (this.id);
}
DesignerStub.prototype.getDir = function()
{
	return (this.dir);
}
DesignerStub.prototype.getProvDir = function()
{
	return (this.provDir);
}
DesignerStub.prototype.getXML = function()
{
	return (this.xml);
}
DesignerStub.prototype.getDoc = function(docId)
{
	return (this.docs.item(docId));
}
DesignerStub.prototype.getDocs = function()
{
	return (this.docs);
}
DesignerStub.prototype.setXML = function(xml)
{
	this.xml=xml;
	this.provDir=this.xml.getAttribute("provDir");
	this.docs=new LawCollection();
	var len=(xml?(xml.childNodes?xml.childNodes.length:0):0);
	var n;
	var docId;
	for (var i=0;i<len;i++)
	{
		n=xml.childNodes[i];
		if (n.tagName=="DIR")
			this.dir=n.firstChild.text;
		else if (n.tagName=="DOCUMENT")
		{
			docId=n.getAttribute("id");
			this.docs.add(docId,new DocumentStub(docId,n));
		}
	}
}

//-----------------------------------------------------------------------------
function DocumentStub(id,xml)
{
	this.id=id;
	this.maxLen = null;
	this.wizards=null;
	this.setXML(xml);
}
DocumentStub.prototype.getId = function()
{
	return (this.id);
}
DocumentStub.prototype.getMaxLen = function()
{
	return this.maxLen;
}
DocumentStub.prototype.getWizard = function(wizId)
{
	return (this.wizards.item(wizId));
}
DocumentStub.prototype.setXML = function(xml)
{
	this.xml=xml;
	this.wizards=new LawCollection();
	var len=(xml?(xml.childNodes?xml.childNodes.length:0):0);
	this.maxLen = xml.getAttribute("maxLen");
	var wiz;
	var wizId;
	var wizPath;
	var ruleId;
	var provRule;
	for (var i=0;i<len;i++)
	{
		var n=xml.childNodes[i];
		if (n.tagName=="WIZARD")
		{
			wizId=n.getAttribute("id");
			prov=n.getAttribute("prov");
			wiz=new WizardStub(wizId,n,prov?prov:"all");
			this.wizards.add(wizId,wiz);
		}
	}
}

//-----------------------------------------------------------------------------
function WizardStub(id,xml,prov)
{
	this.id=id;
	this.path=null;
	this.prov=prov;
	this.setXML(xml);
}
WizardStub.prototype.getAttribute = function(n)
{
	return (this.xml.getAttribute(n));
}
WizardStub.prototype.getPath = function()
{
	return (this.path);
}
WizardStub.prototype.setXML = function(xml)
{
	this.xml=xml;
	if (xml && xml.firstChild)
		this.path=xml.firstChild.text;
}
