/* Purpose:  determines if current session ssopid has been mapped to customer issues active directory id
 * Implementation Instructions:
 * include this javascript file in $LAWDIR/htdocs/lawson/portal/home.html
 * $LAWDIR/htdocs/lawson/portal/home.js-> homeInit() invoke mapSsopId after portalObj; profile & profileDoc have been initialized
 * @author  Robert Nevinger
 * @date 3.2014
*/

var rmId;
var ssopId;
var employee;
var firstName;
var lastName;

/**
* Invokes Profile servlet through SSORequest object to determine RMId
* Invokes SSOServlet servlet through SSORequest object to determine SSOPId
* @param  non
* @type  boolean
*/

function mapSsopId() {

  // define profile servlet
  var profileServlet = "https://" + location.hostname + "/servlet/Profile";;
  //alert(profileServlet);

  // execute servlet
  var profile = SSORequest(profileServlet);

  // read xml attributes
  var xmlNodes = profile.getElementsByTagName("ATTR");

  // determine rmid and employee
  for (var i=0; i<xmlNodes.length; i++) {

     switch(xmlNodes[i].getAttribute("name")) {

       case "id":
         rmId = xmlNodes[i].getAttribute("value");
       break;
       case "employee":
         employee = xmlNodes[i].getAttribute("value");
       break;
       case "firstname":
         firstName = xmlNodes[i].getAttribute("value");
       break;
       case "lastname":
         lastName = xmlNodes[i].getAttribute("value");
       break;

      }
  }


  // determine ssop id

  var pingServlet = "https://" + location.hostname + "/sso/SSOServlet?_action=PING";
  var ssoDom = SSORequest(pingServlet);
  var sessionStatusNodes = ssoDom.getElementsByTagName("SESSIONSTATUS");
  //alert(sessionStatusNodes.length);
  var userNameNodes = ssoDom.getElementsByTagName("USERNAME");
  ssopId = userNameNodes[0].firstChild.nodeValue;

  // define c prefix regex
  // NOTE:  you must enable this regex if testing with a "c" prefixed ID
  //var coreIdPrefix = /^[c]\d\w+/i;

  // define u prefix regex..unless testing this is the regex that should be active
  var coreIdPrefix = /^[u]\d\w+/i;
  //var coreIdPrefix = /^[c]\d\w+/i;

  if(coreIdPrefix.test(ssopId)) {
    //alert("RMID: " + rmId);
    //alert("SSOPID: " + ssopId);
    //alert("Employee: " + employee);
    if(rmId == ssopId) {
      if(validateMapping()) {
        return true;
      }
      else {
        mappingForm();
      }
    }
  }


}


function mappingForm() {

   // mapping form unit test #1:  create file in $LAWDIR/persistdata/lawson/ssopmappings and you will not be redirected
   // mapping form unit test @2:  delete file in $LAWDIR/persistdata/lawson/ssopmappings and you will be redirected

   var url = "https://" + location.hostname + "/cgi-lawson/ssopmapping.cgi?rmId=" + rmId + "&";
   url += "firstName=" + firstName + "&";
   url += "lastName=" + lastName + "&";
   url += "employee=" + employee;

   var msg = rmId + " ssop mapping must be completed\n";
       msg += "You will be redirected to \n";
       msg += url + "\n";
       msg += "Do you wish to continue ?";

      if(confirm(msg)) {
          window.location.href = url;
      }


}

function validateMapping() {

 // environment assumes $LAWDIR/persistdata/ prefix
 var persistDir = "/lawson/ssopmappings";
 var mappingFile = rmId + ".csv";

 // confirm the file has been generated
 var fileMgrServlet = "https://" + location.hostname + "/servlet/FileMgr";
 fileMgrServlet += "?action=filelist&folder=" + persistDir + "&name=" + mappingFile;

 //alert(fileMgrServlet);

 // invoke servlet
 var xmlNodes = SSORequest(fileMgrServlet);

 // read FILELIST  node 
 // we are reading one directory, so only one FILELIST node will be returned
 var fileListNode = xmlNodes.getElementsByTagName("FILELIST");


 // read FILE node
 var fileNode = fileListNode[0].getElementsByTagName("FILE");

 //alert(fileListNode.length);
 //alert(fileNode.length);

 if(fileNode.length > 0) {
   for(i=0; i<fileNode.length; i++) {
      //alert(i);
      //alert(fileNode[i].firstChild.data);
      if(mappingFile == fileNode[i].firstChild.data) { 
        return true;
      }
   }
 }


}
