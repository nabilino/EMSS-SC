// $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/Attic/FormCache.js,v 1.1.2.2.2.2 2012/08/08 12:37:30 jomeli Exp $ 
// $NoKeywords: $ 
// LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 
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
// form cache object (IE specific methods only)
//-----------------------------------------------------------------------------

// caching level constants
FormCache.prototype.cacheNone=Number(0)
FormCache.prototype.cacheAlways=Number(1)
FormCache.prototype.cacheSession=Number(2)
FormCache.prototype.cacheVersion=Number(3)
FormCache.prototype.cacheMax=Number(2)	// for now, Xpress version checking not provided.

//-----------------------------------------------------------------------------
// constructor
function FormCache(wnd)
{
	this.portalWnd = wnd;
	this.scriptName = "objects/FormCache.js";
	this.level=0;		// 0=none, 1=always, 2=session, 3=version
	this.path="";		// location of cache
	this.oXML=null;		// cache list

	try {
		// get user cache level attribute
		var strLevel=this.portalWnd.oUserProfile.getPreference("cachelevel");
		if (!strLevel) return;
		var iLevel=parseInt(strLevel);
		if (iLevel == this.cacheNone) return;
		if ( (iLevel < this.cacheNone) || (iLevel > this.cacheMax) )
		{
			this.level = this.cacheNone;
			return;
		}
		this.level = iLevel;

		// requires IE!
		if (!this.portalWnd.oBrowser.isIE)
		{
			this.level = this.cacheNone;
			return;
		}

		// user set a path? if not use default path from shell's 'My Documents'
		var userPath = this.portalWnd.oUserProfile.getAttribute("cachepath");
    	this.path=(userPath ? userPath : this.getDefaultCachePath());

		// has role now denied use of cache? if so, clear any exising cache
		if (!this.portalWnd.oUserProfile.useFormCache())
		{
			this.removeCache();
			this.level = this.cacheNone;
			return;
		}

		this.refresh(true);
	
	} catch (e) {
		this.level=this.cacheNone;
		this.portalWnd.oError.displayExceptionMessage(e,this.scriptName,"FormCache()");
	}
}
//-----------------------------------------------------------------------------
FormCache.prototype.createPath=function(strPath, fso)
{
	var retVal=false;
	try {
		// (search entire hierarchy in case it didn't exist)
		var args = strPath.split("\\");
		var path = args[0];
		for (var i = 1; i < args.length; i++)
		{
			path = fixPath(path + "\\" + args[i]);
			if (!fso.FolderExists(path))
				fso.CreateFolder(path);
		}
		retVal=true;

	} catch (e) { }
	return (retVal);
}
//-----------------------------------------------------------------------------
FormCache.prototype.folderExists=function(strFolder)
{
	var fso=null;
	var returnVal=false;
	try{
		// clear cache by deleting folder
		fso = new ActiveXObject("Scripting.FileSystemObject");
		if (fso.FolderExists(strFolder))
			returnVal=true;

	} catch(e) {  }
	fso=null;
	return returnVal;
}
//-----------------------------------------------------------------------------
FormCache.prototype.getDefaultCachePath=function()
{
	var defPath="c:\\My Documents\\Lawson Software\\cache";
	var wshShell=null;
	try {
		var wshShell = new ActiveXObject("WScript.Shell");
		var myDocsFolder=wshShell.SpecialFolders("MyDocuments");
		defPath=myDocsFolder+"\\Lawson Software\\cache";

	} catch (e) { }
	wshShell=null;
	return (defPath);
}
//-----------------------------------------------------------------------------
FormCache.prototype.getFormObject=function(strProject, strToken, strId)
{
	if (this.level==this.cacheNone || !this.oXML) return null;
	var objXML=null;
	var fso=null;
	var f=null;
	try {
		// see if we have an entry in the index
		if (!this.isFormCached(strProject, strToken, strId))
			return (null);

		// we have an entry: retrieve the file
		fso = new ActiveXObject("Scripting.FileSystemObject");
		var frmPath = this.getFormPath(strProject, strToken, strId, fso);
		f = fso.OpenTextFile(frmPath, 1);
		var strFormXml = f.ReadAll();
		f.Close();

		// now load the xml into a DOM document
 		objXML=this.portalWnd.objFactory.createInstance("DOM");
		objXML.async=false;
		try {
			objXML.loadXML(strFormXml);
			if (objXML.parseError.errorCode!=0)
				objXML=null;
		} catch (e) { objXML=null; }

	} catch(e) {  }

	fso=null;f=null;
	return (objXML);
}
//-----------------------------------------------------------------------------
FormCache.prototype.getFormPath=function(strProject, strToken, strId, fso)
{
	try {
		var folder=this.path+"\\"+strProject.toUpperCase();
		if (!fso.FolderExists(folder))
			this.createPath(folder, fso);
		return fso.BuildPath(folder, strToken.toLowerCase()+"_"+strId+".xml");
	} catch(e) { }
	return ("");
}
//-----------------------------------------------------------------------------
FormCache.prototype.getIndex=function()
{
	return this.oXML;
}
//-----------------------------------------------------------------------------
FormCache.prototype.getVersion=function(strProject, strToken, strId)
{
	var strVersion="";
	try{
		var pdlNode = this.oXML.selectSingleNode("/CACHE/PROJECT[@id='" + 
					strProject.toUpperCase() + "']");
		if (!pdlNode) return ("");

		var frmNode=pdlNode.selectSingleNode("FORM[@token='"+strToken.toLowerCase() + 
					"' and @id='"+strId+"']");
		if (frmNode)
			strVersion = frmNode.getAttribute("vers");

	} catch(e) {  }
	return strVersion;
}
//-----------------------------------------------------------------------------
FormCache.prototype.initialize=function()
{
	var fso=null;
	try{
		// clear cache by deleting folder
		fso = new ActiveXObject("Scripting.FileSystemObject");
		this.removeCache(fso);

		// now create an empty folder
		this.createPath(this.path, fso);

		// load a default cache and write to cach list file
		var strXML="<?xml version=\"1.0\"?>\n<CACHE>\n<PROJECT id=\"" +
			this.portalWnd.oUserProfile.getAttribute("productline") + 
			"\">\n</PROJECT>\n</CACHE>";
		this.oXML=this.portalWnd.objFactory.createInstance("DOM");
		this.oXML.async=false;
		this.oXML.loadXML(strXML);

		this.saveIndex(fso);

	} catch(e) {
		this.portalWnd.oError.displayExceptionMessage(e,this.scriptName,"initialize()");
	}
	fso=null;
}
//-----------------------------------------------------------------------------
FormCache.prototype.isFormCached=function(strProject, strToken, strId)
{
	try {
		if (this.level==this.cacheNone || !this.oXML) return (false);
		var pdlNode = this.oXML.selectSingleNode("/CACHE/PROJECT[@id='" + 
				strProject.toUpperCase()+"']");
		if (!pdlNode) return (false);

		if (pdlNode.selectSingleNode("FORM[@token='"+strToken.toLowerCase() + 
				"' and @id='"+strId+"']"))
			return true;

	} catch(e) { }
	return false;
}
//-----------------------------------------------------------------------------
FormCache.prototype.refresh=function(bFromConstructor)
{
	if (this.level==this.cacheNone)
		return;
	
	bFromConstructor = (typeof(bFromConstructor) == "boolean"
		? bFromConstructor : false);

	try {
		// load the cache index XML
		this.oXML=this.portalWnd.objFactory.createInstance("DOM");
		this.oXML.async=false;
		if (this.level==this.cacheSession && bFromConstructor)
			this.initialize();
		else
		{
			try {
 				this.oXML.load("file://"+this.path+"\\index.xml");
 				if (this.oXML.parseError.errorCode!=0)
 					this.initialize();
			} catch (e) { 
				this.level=this.cacheNone;
			}
		}
		
	} catch (e) {
		this.level=this.cacheNone;
	}
}
//-----------------------------------------------------------------------------
FormCache.prototype.removeCache=function(fso)
{
	try {
		if (typeof(fso) != "object")
			fso = new ActiveXObject("Scripting.FileSystemObject");
		if (fso.FolderExists(this.path))
			fso.DeleteFolder(this.path);

		this.oXML = null;
		
	} catch (e) { }
}

//-----------------------------------------------------------------------------
FormCache.prototype.removeForm=function(strProject, strToken, strId)
{
	if (this.level==this.cacheNone || !this.oXML)
		return false;
	var fso=null;
	var returnVal=false;
	try {
		// see if the file exists
		fso = new ActiveXObject("Scripting.FileSystemObject");
		var frmPath = this.getFormPath(strProject, strToken, strId, fso);
		fso.DeleteFile(frmPath, true);
		returnVal=true;

	} catch(e) { }

	try {
		var pdlNode = this.oXML.selectSingleNode("/CACHE/PROJECT[@id='" + 
				strProject.toUpperCase()+"']");
		if (!pdlNode) return (returnVal);
		var formNode =pdlNode.selectSingleNode("FORM[@token='"+strToken.toLowerCase() + 
				"' and @id='"+strId+"']");
		if (!formNode) return (returnVal);
		pdlNode.removeChild(formNode);
		this.saveIndex(fso);
		return true;

	} catch(e) { }

	fso=null;
	return returnVal;
}
//-----------------------------------------------------------------------------
FormCache.prototype.saveForm=function(strProject, strToken, strId, strXML)
{
	try {
		if (this.level==this.cacheNone || !this.oXML)
			return;

		var fso=null;
		var f=null;
		fso = new ActiveXObject("Scripting.FileSystemObject");
		var frmPath = this.getFormPath(strProject, strToken, strId, fso);
		f = fso.OpenTextFile(frmPath, 2, true);
		var str=strXML;
		str=str.replace( /\>\</g ,">\n<" );
		f.Write(str);
		f.Close();

		// now update the list
		var pdlNode=this.oXML.selectSingleNode("CACHE/PROJECT[@id='" + 
				strProject.toUpperCase()+"']");
		if (!pdlNode)
		{
			var root=this.oXML.documentElement;
			var projNode=this.oXML.createElement("PROJECT");
			projNode.setAttribute("id",strProject);
			pdlNode=root.appendChild(projNode);
		}
		var frmNode=pdlNode.selectSingleNode("FORM[@token='" + 
				strToken.toLowerCase()+"' and @id='"+strId+"']");
		if (!frmNode)
		{
			var newNode=this.oXML.createElement("FORM");
			newNode.setAttribute("token",strToken.toLowerCase());
			newNode.setAttribute("id",strId);
			frmNode=pdlNode.appendChild(newNode);
		}

		// set version and timestamp
		frmNode.setAttribute("vers", 
				this.portalWnd.oPortalConfig.getShortIOSVersion());
		var dt=new Date();
		frmNode.setAttribute("timestamp", dt.toLocaleString());
		this.saveIndex(fso);

	} catch(e) {
		this.portalWnd.oError.displayExceptionMessage(e,this.scriptName,"saveForm()");
	}
	fso=null;
	f=null;
}
//-----------------------------------------------------------------------------
FormCache.prototype.saveIndex=function(fso)
{
	if (typeof(fso) != "object")
		fso=new ActiveXObject("Scripting.FileSystemObject");
	var f = fso.OpenTextFile(this.path+"\\index.xml", 2, true);
	var strXml=this.oXML.xml;
	strXml=strXml.replace( /\>\</g ,">\n<" );
	f.Write(strXml);
	f.Close();
	f=null;
}
