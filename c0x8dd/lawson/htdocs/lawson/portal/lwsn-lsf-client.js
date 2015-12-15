/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/Attic/lwsn-lsf-client.js,v 1.1.2.3 2012/08/08 12:37:20 jomeli Exp $ */
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
if (typeof jQuery == 'undefined') {
  // Create a cheap fallback for Portal while it doesn't use jQuery (but we prefer jQuery when present).
  // The fallback depends on json2.js being present (or at least the JSON object being present).
  jsLib = function(callback) {
    if(window.attachEvent) {
      window.attachEvent("onload", callback);
    } else if (window.addEventListener) {
      window.attachEvent("load", callback);
    };
  };
  jsLib.each = function(collection, callback) {
    if (collection instanceof Array) {
      for(var i = 0; i < collection.length; i++) {
        callback.apply(collection[i], [ i, collection[i] ]);
      }
    }
  };
  jsLib.evalJSON = function(string) {
    return JSON.parse(string);
  };
  jsLib.toJSON = function(object) {
    return JSON.stringify(object);
  };
} else {
  jsLib = jQuery;
}

if (typeof lwsn == "undefined") { lwsn = {}; };
if (typeof lwsn.lsf == "undefined") { lwsn.lsf = {}; };

lwsn.lsf.client = {
  inPortal: (typeof window.lawsonPortal != 'undefined'),
  FORM_TRANSFER: 'lwsn.lsf.client.FORM_TRANSFER',
  DRILL_AROUND: 'lwsn.lsf.client.DRILL_AROUND',
  ATTACHMENT: 'lwsn.lsf.client.ATTACHMENT'
};

(function($, client) {

  var clientImpl = {

    isPortalWindow: (typeof window.lawsonPortal != 'undefined'),
    messageListerers: {},
    PORTAL_PING: 'clientImpl.PORTAL_PING',
    PORTAL_PONG: 'clientImpl.PORTAL_PONG',

    messageReceiver: function(event) {
      if (event.data != null) {
        var message = $.evalJSON(event.data);

        // handle Portal ping event
        if (message.type === clientImpl.PORTAL_PING && clientImpl.isPortalWindow) {
          lwsn.lsf.client.sendMessage(clientImpl.PORTAL_PONG, null, event.source);
          return;
        } else if (message.type === clientImpl.PORTAL_PONG) {
          client.inPortal = true;
          return;
        }

        var listeners = clientImpl.messageListerers[message.type || "unknown"] || [];

        $.each(listeners, function(index, listener) {
          try {
            listener(message.data);
          } catch (e) {
            clientImpl.log2console('Error handling message: ' + e.message)
          }
        });
      }
    },

    log2console: function(message) {
      if (typeof console != "undefined" && typeof console.log != "undefined") {
        console.log(message);
      }
    }

  };

  client.addMessageListener = function(type, listener) {
    if (type != null && listener != null) {
      var listeners = clientImpl.messageListerers[type] || [];

      listeners.push(listener);
      clientImpl.messageListerers[type] = listeners;
    }
  }
  
  client.removeMessageListener = function(type, listener) {
    if (type != null && listener != null) {
      var listeners = clientImpl.messageListerers[type] || [];
      var newListeners = [];
    
      $.each(listeners, function(index, aListener) {
        if (aListener !== listener) {
          newListeners.push(aListener);
        }
      });
      clientImpl.messageListerers[type] = newListeners;
    }
  }

  client.sendMessage = function(type, data, destination) {
    if (type != null) {
      var encodedMessage = $.toJSON({ type: type, data: data });
      
      if (typeof destination != 'undefined') {
        destination.postMessage(encodedMessage, "*");
      } else if (clientImpl.isPortalWindow === true) {
        window.postMessage(encodedMessage, "*");
      } else if (window.opener) {
        // can't call window.opener.postMessage directly
        window.opener.lwsn.lsf.client.sendMessageProxy(type, data);
        window.opener.focus();
        window.opener.document.focus();
      } else if (window.parent) {
        window.parent.postMessage(encodedMessage, "*");
      }
    }
  };

  client.sendMessageProxy = function(type, data) {
    lwsn.lsf.client.sendMessage(type, data);
  };

  $(function() {
    if(window.attachEvent) {
      window.attachEvent("onmessage", clientImpl.messageReceiver);
    } else if (window.addEventListener) {
      window.addEventListener("message", clientImpl.messageReceiver);
    }

    // Portal Message Listeners
    if (clientImpl.isPortalWindow) {
      lwsn.lsf.client.addMessageListener(lwsn.lsf.client.FORM_TRANSFER, function(data) {
        formTransfer(data.token, null, null, data.hKey + "&_ALLOWTRANSFER=1");
      });
/*
      lwsn.lsf.client.addMessageListener(lwsn.lsf.client.DRILL_AROUND, function(data) {
        window.lawsonPortal.doDrill(window, null, null, data.params);
      });
      lwsn.lsf.client.addMessageListener(lwsn.lsf.client.ATTACHMENT, function(data) {
        window.lawsonPortal.doAttachment(window, null, data.params, data.attachType);
      });
*/
    } else {
      lwsn.lsf.client.sendMessage(clientImpl.PORTAL_PING);
    }
  });

})(jsLib, lwsn.lsf.client);