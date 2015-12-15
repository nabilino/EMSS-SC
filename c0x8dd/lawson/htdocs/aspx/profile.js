<script src="/sso/sso.js"></script>
<script src="/sso/localize.js"></script>
<script src="/lawson/portal/portal.js"></script>
<script src="/lawson/portal/servenv.js"></script>
<script src="/lawson/portal/globals.js"></script>
<script src="/lawson/portal/common.js"></script>

<script>

function getProfileAttribute(attribute) {

  var value;

  attribute.toLowerCase();
  alert("Looking for " + attribute);

  // define profile servlet
  var profileServlet = "https://" + location.hostname + "/servlet/Profile";;
  //alert(profileServlet);

  // excute servlet
  var profile = SSORequest(profileServlet);

  // read xml attributes
  var xmlNodes = profile.getElementsByTagName("ATTR");

  for (var i=0; i<xmlNodes.length; i++) {
    switch(xmlNodes[i].getAttribute("name")) {
      case attribute:
        value = xmlNodes[i].getAttribute("value");
        alert(value);
      break;
    }

  }

  return value;

}

</script>
