// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

var api_key = '';
var lastID = '0';
var LastResponse = '';
/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.social = function(runtime) {
    this.runtime = runtime;
};

(function() {
    /////////////////////////////////////
    // *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
    //                            vvvvvvvv
    var pluginProto = cr.plugins_.social.prototype;

    /////////////////////////////////////
    // Object type class
    pluginProto.Type = function(plugin) {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    };

    var typeProto = pluginProto.Type.prototype;

    // called on startup for each object type
    typeProto.onCreate = function() {};

    /////////////////////////////////////
    // Instance class
    pluginProto.Instance = function(type) {
        this.type = type;
        this.runtime = type.runtime;

        // any other properties you need, e.g...
        // this.myValue = 0;
    };

    var instanceProto = pluginProto.Instance.prototype;

    // called whenever an instance is created
    instanceProto.onCreate = function() {
        // note the object is sealed after this call; ensure any properties you'll ever need are set on the object
        // e.g...
        // this.myValue = 0;
        this.api = this.properties[0];
        api_key = this.api;

        this.last_ID = this.properties[1];
        lastID = this.last_ID;

        if (api_key == "") {
            console.log("Your API key is not defined ! Mails will not be sent /!\\")
        }


    };

    // called whenever an instance is destroyed
    // note the runtime may keep the object after this call for recycling; be sure
    // to release/recycle/reset any references to other objects in this function.
    instanceProto.onDestroy = function() {};

    // called when saving the full state of the game
    instanceProto.saveToJSON = function() {
        // return a Javascript object containing information about your object's state
        // note you MUST use double-quote syntax (e.g. "property": value) to prevent
        // Closure Compiler renaming and breaking the save format
        return {
            // e.g.
            //"myValue": this.myValue
        };
    };

    // called when loading the full state of the game
    instanceProto.loadFromJSON = function(o) {
        // load from the state previously saved by saveToJSON
        // 'o' provides the same object that you saved, e.g.
        // this.myValue = o["myValue"];
        // note you MUST use double-quote syntax (e.g. o["property"]) to prevent
        // Closure Compiler renaming and breaking the save format
    };

    // only called if a layout object - draw to a canvas 2D context
    instanceProto.draw = function(ctx) {};

    // only called if a layout object in WebGL mode - draw to the WebGL context
    // 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
    // directory or just copy what other plugins do.
    instanceProto.drawGL = function(glw) {};

    // The comments around these functions ensure they are removed when exporting, since the
    // debugger code is no longer relevant after publishing.
    /**BEGIN-PREVIEWONLY**/
    instanceProto.getDebuggerValues = function(propsections) {
        // Append to propsections any debugger sections you want to appear.
        // Each section is an object with two members: "title" and "properties".
        // "properties" is an array of individual debugger properties to display
        // with their name and value, and some other optional settings.
        propsections.push({
            "title": "My debugger section",
            "properties": [
                // Each property entry can use the following values:
                // "name" (required): name of the property (must be unique within this section)
                // "value" (required): a boolean, number or string for the value
                // "html" (optional, default false): set to true to interpret the name and value
                //                                   as HTML strings rather than simple plain text
                // "readonly" (optional, default false): set to true to disable editing the property

                // Example:
                // {"name": "My property", "value": this.myValue}
            ]
        });
    };

    instanceProto.onDebugValueEdited = function(header, name, value) {
        // Called when a non-readonly property has been edited in the debugger. Usually you only
        // will need 'name' (the property name) and 'value', but you can also use 'header' (the
        // header title for the section) to distinguish properties with the same name.
    };
    /**END-PREVIEWONLY**/

    //////////////////////////////////////
    // Conditions
    function Cnds() {};

    Cnds.prototype.OnMailSent = function() {
        return true;
    };

    Cnds.prototype.OnErrorMail = function() {
        console.log("Error = " + response);
        return true;
    };

    Cnds.prototype.OnPingOk = function() {
        return true;
    };

    Cnds.prototype.OnEmailValid = function() {
        return true;
    };

    Cnds.prototype.OnEmailInvalid = function() {
        return true;
    };

    // ... other conditions here ...

    pluginProto.cnds = new Cnds();

    //////////////////////////////////////
    // Actions
    function Acts() {};

    Acts.prototype.PingAcount = function() {

        var m = new mandrill.Mandrill(api_key);

        var self = this;

        function log(obj) {
            console.log(JSON.stringify(obj));
        }

        m.users.ping(function(res) {
            log(res);
            self.runtime.trigger(cr.plugins_.social.prototype.cnds.OnPingOk, self);
            //return res;
        }, function(err) {
            log(err);
            //return err;
        });
    }

    Acts.prototype.CheckEmailValidity = function(request) {

        var self = this;

        function isEmail(myVar) {
            // La 1ère étape consiste à définir l'expression régulière d'une adresse email
            var regEmail = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$', 'i');

            return regEmail.test(myVar);
        }

        if (isEmail(request)) {
            console.log("Valid");
            self.runtime.trigger(cr.plugins_.social.prototype.cnds.OnEmailValid, self);
        } else {
            console.log("Invalid");
            self.runtime.trigger(cr.plugins_.social.prototype.cnds.OnEmailInvalid, self);
        };
    }

    Acts.prototype.ReadMailStats = function(id) {
        var m = new mandrill.Mandrill(api_key);

        var self = this;

        console.log(id)

        if (id !== "") {
            m.messages.info({
                "id": id
            }, function(result) {
                console.log(result);
                if (result.state === "sent") {
                    self.runtime.trigger(cr.plugins_.social.prototype.cnds.OnMailSent, self);
                };
            }, function(e) {
                // Mandrill returns the error as an object with name and message keys
                console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                // A mandrill error occurred: Unknown_Message - No message exists with the id 'McyuzyCS5M3bubeGPP-XVA'
            });
        } else {
            alert("The ID you provide is empty !");
        };
    };

    // the example action
    Acts.prototype.SendMyMail = function(from_mail, from_name, pour_mail, pour_nom, sujet, message, nameAndExtension, base64String, tag) {

        var m = new mandrill.Mandrill(api_key);

        function isEmail(myVar) {
            // La 1ère étape consiste à définir l'expression régulière d'une adresse email
            var regEmail = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$', 'i');

            return regEmail.test(myVar);
        }

        if (!isEmail(from_mail)) {
            alert("It seems that the sender address is not valid : " + from_mail);
        }

        if (!isEmail(pour_mail)) {
            alert("It seems that the recipient address is not valid : " + pour_mail);
        }

        if (api_key == "") {
            alert("Your API key is not defined ! Mails will not be sent /!\\")
        }

        var params = {

            "message": {
                "from_email": from_mail,
                "from_name": from_name,
                "to": [{
                    "email": pour_mail,
                    "name": pour_nom,
                    "type": "to"
                }],
                /*"tags": [
                    tag
                ],*/
                "auto_text": true,
                "auto_html": true,
                "subject": sujet,
                "html": message,
                'track_opens': true,
                'track_clicks': true,
                'attachments': [{
                    'type': "image/png",
                    'name': nameAndExtension,
                    'content': base64String,
                }],
            }

        };


        function sendTheMail() {

            m.messages.send(params, function(res) {
                console.log(res);
                lastID = res[0]._id;
            }, function(err) {
                console.log(err);
                self.runtime.trigger(cr.plugins_.social.prototype.cnds.OnErrorMail, self);
            });
        }

        sendTheMail();

    };


    Acts.prototype.LogResponse = function() {
        console.log(LastResponse);
    };

    Acts.prototype.SendMySms = function(number, message) {
        window.location.href = "sms:" + number + "?body=" + message;
        //console.log("Sms sent !");
    };

    Acts.prototype.CallFromPhone = function(number) {
        window.location.href = "tel:" + number;
        //console.log("Call launched !");
    };

    // ... other actions here ...

    pluginProto.acts = new Acts();

    //////////////////////////////////////
    // Expressions
    function Exps() {};

    Exps.prototype.GetMailID = function(ret) // 'ret' must always be the first parameter - always return the expression's result through it!
    {
        console.log("Getting Id ... : " + typeof lastID + "--->" + lastID);
        ret.set_string(lastID);
    };

    // ... other expressions here ...

    pluginProto.exps = new Exps();

}());