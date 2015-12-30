//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/debugobj.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
function debugObject(theObject) {
 debug=''
 for (i in theObject) {
  theProp = theObject[i] + ' '
  if (theProp.indexOf('function') == -1)
   debug+=i + ' = ' + theObject[i] + '\n'
  else
   debug+=i + ' = [function call]' + '\n'
 }

 if (theObject.layers) debug+='!layer layer array length:' + theObject.layers.length + '\n'
 if (theObject.parentLayer) 
 {
  if (theObject.parentLayer.name) debug+='!parentLayer name:' + theObject.parentLayer.name + '\n'
  if (theObject.parentLayer.layers) debug+='!parentLayer layer array length:' + theObject.parentLayer.layers.length + '\n'
  if (theObject.parentLayer.width) debug+='!parentLayer width:' + theObject.parentLayer.width + '\n'
  if (theObject.parentLayer.innerWidth) debug+='!parentLayer innerWidth:' + theObject.parentLayer.innerWidth + '\n'
 }

 if (theObject.clip) {
  debug+='!clip left:' + theObject.clip.left+ '\n'
  debug+='!clip top:' + theObject.clip.top+ '\n'
  debug+='!clip right:' + theObject.clip.right+ '\n'
  debug+='!clip bottom:' + theObject.clip.bottom+ '\n'
  debug+='!clip width:' + theObject.clip.width+ '\n'
  debug+='!clip height:' + theObject.clip.height+ '\n'
 }

 showCode(debug)
}

function showCode(theCode) {
 page='<html><body>'
 page+='<form><textarea cols=70 rows=20 wrap="on">' + theCode + '</textarea></form>'
 page+='\n\n\n</body></html>'
 newWin=open('javascript:opener.page',"showcode","dependent=yes,toolbar=no,menubar=no,scrollbars=no,resizable=no,innerWidth=600,innerHeight=400,alwaysRaised=yes")

 if (!newWin) alert("no Window Error")
}

