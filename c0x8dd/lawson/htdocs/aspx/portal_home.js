var secQuestionsWindow;
var presentSecQuestions;

function aspxHomeInit() {
   secQuestionsTest();
   return;
}

function secQuestionsTest() {
   presentSecQuestions = presentSecurityQuestions();
   if (presentSecQuestions) {
      openSecurityQuestions();
      presentSecQuestions = false;
      window.setTimeout('secQuestionsTest()',60000);
   }
   presentSecQuestions = false;
   return;
}

function openSecurityQuestions() {
   if (!secQuestionsWindow || secQuestionsWindow.closed) {
      secQuestionsWindow = window.open(
         '/cgi-lawson/pw_forgot_setup.cgi'
         , 'Confirm'
         , 'width=600,height=800,toolbar=no'
      );
      secQuestionsWindow.focus();
   } else {
      secQuestionsWindow.focus();
   }
   return;
}

function presentSecurityQuestions() {
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
   req.open('GET', '/cgi-lawson/pw_forgot_setup.cgi?query=1' + '&nocache=' + date.getTime(), false);
   //req.open('GET', '/aspx/pw_forgot_setup.aspxcgi?query=1' + '&nocache=' + date.getTime(), false);
   //req.open('GET', '/cgi-lawson/pw_forgot_setup.cgi?query=1', false);
   req.send(null);
   //alert(req.status);
   //alert(req.responseText);
   if (req.status == 200) {
      var truefalse = req.responseText;
      if ( truefalse == "false" ) { return true }
   }
   req = null;
   return false;
}

