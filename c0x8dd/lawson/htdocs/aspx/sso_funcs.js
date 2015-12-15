var passwdChangeWindow;
var forgotPasswdWindow;
var host = location.host;
var href = location.href;

function openPasswdChange() {
    if (!passwdChangeWindow || passwdChangeWindow.closed) {
        passwdChangeWindow = window.open(
           '/aspx/pw_change.aspxcgi?username='
              + document.getElementsByName('_ssoUser')[0].value
           , 'Confirm'
           , 'width=600,height=350,toolbar=no'
        );
    } else {
        passwdChangeWindow.focus()
    }
}

function openForgotPassword() {
    if (!forgotPasswdWindow || forgotPasswdWindow.closed) {
        forgotPasswdWindow = window.open(
            '/aspx/pw_forgot.aspxcgi?username='
              + document.getElementsByName('_ssoUser')[0].value
           , 'Confirm'
           , 'width=600,height=350,toolbar=no'
        );
    } else {
        forgotPasswdWindow.focus()
    }
}

function accountCheck(user) {
   var req;
   if(window.XMLHttpRequest) {
      try { req = new XMLHttpRequest(); } catch(e) { req = false; }
   } else if(window.ActiveXObject) {
      try {
         req = new ActiveXObject("Msxml2.XMLHTTP");
      } catch(e) {
         try {
            req = new ActiveXObject("Microsoft.XMLHTTP");
         } catch(e) {
            req = false;
         }
      }
   }
   var date = new Date();
   req.open('GET', '/aspx/accountCheck.aspxcgi?user=' + user + '&nocache=' + date.getTime(), false);
   req.send(null);
   if (req.status == 200) {
      var status = req.responseText;
      return status;
   }
   return false;
}

function accountStatus() {

    var sUID = document.getElementsByName('_ssoUser')[0].value;
    if (sUID != '' ) {
       var responseText = accountCheck(sUID);
       if ( responseText == 'locked' ) {
          alert( 'Your account has been locked.  Please call support to be unlocked.' );
          return false;
       } else if (responseText.match( /^\d+ seconds/) ) {
          alert( 'Your account has been temporarily locked due to too many failed login attempts.  It will unlock automatically in ' + responseText + '.');
          return false;
       } else if (responseText == 'expired') {
          alert( 'Your password has expired.  You are required to change your password.' );
          openPasswdChange();
          return false;
       } else if (responseText == 'mustChange') {
          alert( 'Your account is being activated.  You are required to change your password.' );
          openPasswdChange();
          return false;
       }
    }
    return true;
}
