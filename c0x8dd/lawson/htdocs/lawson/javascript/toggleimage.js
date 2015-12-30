//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/toggleimage.js,v 1.1.26.1 2007/02/06 22:08:33 keno Exp $ $Name: REVIEWED_901 $
//Description
//THIS FUNCTION toggles an image 
//arguments: image name property value   
//           name of new image
//           frame image is in
//           name of directory image is in
//EndDescription

var wasimgname=""

function toggleimage(imgname,toimgname,theframe,imgdir)
{
//	var newImg = "http://spider.lawson.com/images/insight/bdprof1.gif";
//	if (typeof toimgname == "string" && toimgname.length > 0)
//		newImg = imgdir + toimgname;
	with(theframe)
	{
	   document.images[imgname].src = imgdir + toimgname
	}
}
