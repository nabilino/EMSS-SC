function validateFields(form) {

 var applicationID = false;
 var authenticationID = false;
 var userID;

 // first we need to initialize sys2
 for (var i=0;i < form.length;i++) {
    inputObj = form.elements[i];

    var inputName = inputObj.name.toLowerCase();
    var inputValue = inputObj.value;

    switch(inputName) {

      case "sys2":
        if(inputValue == "Application") {
          applicationID = true;
        }
        if(inputValue == "Web") {
          authenticationID = true;
        }
      break;

    }
 }

 for (var i=0;i < form.length;i++) {
    inputObj = form.elements[i];

    var inputName = inputObj.name.toLowerCase();
    var inputValue = inputObj.value;

    switch(inputName) {

      case "userid":
        // ldap authentication checked
        if( (authenticationID) && (!applicationID) ) {
          if( (inputValue.length < 6) || (inputValue.length > 12)) {
            alert("Required UserID is 6 - 8 characters");
            return false;
          }
        }
        // application lid checked
        if( (applicationID) && (!authenticationID) ) {
          if(inputValue.length > 0) {
            if( (inputValue.length < 6) || (inputValue.length > 12)) {
              var msg = "Optional UserID is 6 - 8 characters\n";
              msg += "If you want Add User to generate the UserID remove the value\n";
              alert(msg);
              return false;
            }
          }
        }
        // both are checked
        if( (applicationID) && (authenticationID) ) {
          if(inputValue.length > 0) {
            if( (inputValue.length < 6) || (inputValue.length > 12)) {
              var msg = "Optional UserID is 6 - 8 characters\n";
              msg += "If you want Add User to generate the UserID remove the value\n";
              alert(msg);
              return false;
            }
          }
        }

      // all this means is the userID is a valid length it will still be check by veladduser.cgi
      userID = inputValue;
      break;

      case "firstname":
      if(inputValue.length < 1) {
        alert(inputName + " required");
        return false;
      }
      break;

      case "lastname":
      if(inputValue.length < 1) {
        alert(inputName + " required");
        return false;
      }
      break;

      case "officephone":
      if(inputValue.length < 1) {
        alert(inputName + " required");
        return false;
      }
      break;

      case "email":
      if(inputValue.length < 1) {
        alert(inputName + " required");
        return false;
      }
      break;

      case "password":
      if(inputValue.length != 8) {
        alert(inputName + " requires 8 characters");
        return false;
      }
      break;

      case "confirmpassword":
      if(inputValue.length != 8) {
        alert(inputName + " requires 8 characters");
        return false;
      }
      break;

    }

    //alert(inputObj.name);
    //alert(inputObj.type);
    //alert(inputObj.value);

  }

  // Application
  if( (!authenticationID) && (applicationID) ) {

     if(userID.length == 0) {

        // veladduser.cg->process_LID
        var msg = "You are about to create a new Application ID that provides system access\n";
        msg += "If you want the ID to have Portal connectivity it must be added to LSA\n"
        msg += "If you intended to map an Authentication LDAP ID TO an existing Application ID\n"
        msg += "Return to Add User and select Authenticaton LDAP and create the id\n"
        msg += "Create a VCS ticket requesting that the generated Authentication ID is mapped to the existing application ID\n";
        msg += "Do you wish to continue ?";
        if(confirm(msg)) {
          return true;
        }
        return false;

     }
     else {
        // veladduser.cg->process_LID
        var msg = "You are about to create a new Application ID that provides system access\n";
        msg += "Therefore the id you entered ** " + userID + " ** will not be created\n";
        msg += "If the ID requires Portal connectivity you must add it to LSA \n"
        msg += "If you intended to duplicate an ID from another environment do not use this utilty\n"
        msg += "Create a VCS ticket requesting the existing Application ID is created in this environment \n"
        msg += "Do you wish to continue ?";
        if(confirm(msg)) {
          return true;
        }
        return false;
     }
  }

  // Authentication LDAP veladduser.cg->process_portal
  if( (authenticationID) && (!applicationID) ) {
      var msg = "You are about add " + userID + " to your authentication environment\n";
      msg += "If this ID requires Portal connectivity you must add it to LSA\n";
      msg += "Do you wish to continue ?";
      if(confirm(msg)) {
        return true;
      }
      return false;
  }

  // Select All
  if( (authenticationID) && (applicationID) ) {

     if(userID.length == 0) {

        // veladduser.cg->process_LID
        var msg = "By leaving the User ID field blank "
        msg += "Add User will only create an Application ID \n"
        msg += "If you want the new ID to have Portal connectivity you must add the ID to LSA\n"
        msg += "If you intended to map an Authentication LDAP ID TO an exsting Application ID\n"
        msg += "Return to Add User and select Authenticaton LDAP and create the id\n"
        msg += "Create a VCS ticket requesting that the generated Authentication ID is mapped to the existing application ID\n";
        msg += "Do you wish to continue ?";
        if(confirm(msg)) {
          return true;
        }
        return false;

     }
     else {
        // veladduser.cgi->process_LID  veladduser.cgi->process_portal
        var msg = "Add User will create ** " + userID + " ** and generate a new Application ID \n"
        msg += userID + " provides portal connectivity but must be added to LSA \n";
        msg += "The new Application ID provides system access and the potential to run batch programs in LID\n";
        msg += "but must be added to LAUA\n"
        msg += "Do you wish to continue ?";
        if(confirm(msg)) {
          return true;
        }
        return false;
     }

  }


}
