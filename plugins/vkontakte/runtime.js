// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.vkontakte = function(runtime)
{
    this.runtime = runtime;
};

(function ()
{
    var pluginProto = cr.plugins_.vkontakte.prototype;
		
    /////////////////////////////////////
    // Object type class
    pluginProto.Type = function(plugin)
    {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    };

    var typeProto = pluginProto.Type.prototype;
    
    var vkAppID = "";
    var vkRuntime = null;
    var vkInst = null;
    var vkOwnDataJsonArr = "";
    var vkLastName = "";
    var vkReady = false;
    var vkOnBlur = false;
    var vkOnFocus = false;
    
    var vkorderId = 0;
    var vkerrorCode = 0;
    
    var vkFriensDataJsonArr = "";
    var vkAlbumDataJsonArr = "";
    var vkAlbumNewАid = 0;
    var vkServerUrl = "";
    var vkPhotoId = "";
	
    typeProto.onCreate = function()
    {
    };

    /////////////////////////////////////
    // Instance class
    pluginProto.Instance = function(type)
    {
        this.type = type;
        this.runtime = type.runtime;
    };
	
    var instanceProto = pluginProto.Instance.prototype;
    
    
    ///Some func
    var QueryString = function () {
        // This function is anonymous, is executed immediately and 
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = pair[1];
            // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [ query_string[pair[0]], pair[1] ];
                query_string[pair[0]] = arr;
            // If third or later entry with this name
            } else {
                query_string[pair[0]].push(pair[1]);
            }
        } 
        return query_string;
    } ();
    ///
    

    instanceProto.onCreate = function()
    {
        if (this.runtime.isDomFree)
        {
            cr.logexport("[Construct 2] vkontakte plugin not supported on this platform - the object will not be created");
            return;
        }
		
        vkAppID = this.properties[0];
        vkRuntime = this.runtime;
        vkInst = this;
        
        window.onload = function() {
            if(QueryString["viewer_id"])
            {
              
                VK.init(function() {
                    
                    VK.api('users.get',{
                        "uids" : QueryString["viewer_id"],
                        "fields" : "uid, first_name, last_name, sex, bdate, city, country, timezone, photo, photo_medium, photo_big"
                    },function(data) { 
                        if (data.response) {
                            vkOwnDataJsonArr = '';
                            var val = data.response[0];
                            var JsonAr2Constract = new Object();
                            var inner = [];
                            JsonAr2Constract["c2array"] = 1;

                            inner["0"] = [[val["uid"]],[val["first_name"]],[val["last_name"]],[val["sex"]],[val["bdate"]],[val["city"]],[val["country"]],[val["timezone"]],[val["photo"]],[val["photo_medium"]],[val["photo_big"]]];
           
                            JsonAr2Constract["data"] = inner;
                            JsonAr2Constract["size"] = ['1','12','1'];
                
                            vkOwnDataJsonArr = JSON.stringify(JsonAr2Constract);
                            vkReady = true;
                            vkRuntime.trigger(cr.plugins_.vkontakte.prototype.cnds.OnReady, vkInst);
                            console.log('Construct2-VK: OnReady trigger');
                        } 
                    }); 
                });
            }
        }   
    };
    
    
    VK["addCallback"]("onWindowBlur", onWindowBlur); 
    function onWindowBlur() { 
        vkOnBlur = true;
        vkOnFocus = false;
        vkRuntime.trigger(cr.plugins_.vkontakte.prototype.cnds.OnBlur, vkInst);
        console.log('Construct2-VK: Blur trigger');
    }
    
    VK["addCallback"]("onWindowFocus", onWindowFocus); 
    function onWindowFocus() { 
        vkOnFocus = true;
        vkOnBlur = false;
        vkRuntime.trigger(cr.plugins_.vkontakte.prototype.cnds.OnFocus, vkInst);
        console.log('Construct2-VK: Focus trigger');
    }
    
    VK["addCallback"]("onBalanceChanged", onBalanceChanged); 
    function onBalanceChanged(balance) { 
        vkRuntime.trigger(cr.plugins_.vkontakte.prototype.cnds.OnBalCh, vkInst);
        console.log('Construct2-VK: Balance changed added trigger sum:'+balance);
    }
    
    VK["addCallback"]("onOrderCancel", onOrderCancel); 
    function onOrderCancel() { 
        vkRuntime.trigger(cr.plugins_.vkontakte.prototype.cnds.onOrdCan, vkInst);
        console.log('Construct2-VK: Order cancel');
    }
    
    VK["addCallback"]("onOrderSuccess", onOrderSuccess); 
    function onOrderSuccess(val) { 
        vkorderId = val;
        vkRuntime.trigger(cr.plugins_.vkontakte.prototype.cnds.onOrdSuc, vkInst);
        console.log('Construct2-VK: Order Success order_id:'+vkorderId);
    }
    
    VK["addCallback"]("onOrderFail", onOrderFail); 
    function onOrderFail(val) { 
        vkerrorCode = val;
        vkRuntime.trigger(cr.plugins_.vkontakte.prototype.cnds.onOrdFail, vkInst);
        console.log('Construct2-VK: Order Fail errcode:'+vkerrorCode);
    }
   
    Acts.prototype.PublishToWall = function (owner_id_, message_, attachments_, lat_, long_, place_id_, services_,from_group_,signed_,friends_only_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        var publish = {
            "message": message_
        };    
        if (owner_id_.length)
            publish["owner_id"] = owner_id_;
        if (attachments_.length)
            publish["attachments"] = attachments_;
        if (lat_.length)
            publish["lat"] = lat_;
        if (long_.length)
            publish["long"] = long_;
        if (place_id_.length)
            publish["place_id"] = place_id_;
        if (services_.length)
            publish["services"] = services_;
        if (from_group_.length)
            publish["from_group"] = from_group_;
        if (signed_.length)
            publish["signed"] = signed_;
        if (friends_only_.length)
            publish["friends_only"] = friends_only_;
           
        VK.init(function() {
            VK.api('wall.post',publish,function(data) { 
                
                if (data.response) {
                //ответ
                } 
            }); 
        });
    };
    
    
    Acts.prototype.FriendsGet = function (name_case_, count_, offset_, order_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
        
        var cases = ["nom","gen","dat","acc","ins","ins","abl"];
        var orders = ["name","hints"];
        var getparam = {
            "fields": "uid, first_name, last_name, sex, bdate, city, country, timezone, photo, photo_medium, photo_big",
            "name_case": cases[name_case_]
            
        };
        
        
        
        if (count_.length)
            getparam["count"] = count_;
        if (offset_.length)
            getparam["offset"] = offset_;
        if (order_.length)
            getparam["order"] = orders[order_];
           
        VK.init(function() {
            VK.api('friends.get',getparam,function(data) { 
                
               
                 
                if (data.response) {
                    
                    var sizecounter = 0;
                    var JsonAr2Constract = new Object();
                    var inner = [];
                    JsonAr2Constract["c2array"] = 1;
                  
                   
                    jQuery.each(data.response, function(i, val) {
                        inner[i] = [[val["uid"]],[val["first_name"]],[val["last_name"]],[val["sex"]],[val["bdate"]],[val["city"]],[val["country"]],[val["timezone"]],[val["photo"]],[val["photo_medium"]],[val["photo_big"]]];
                        sizecounter++; 
                    });
           
                    JsonAr2Constract["data"] = inner;
                    JsonAr2Constract["size"] = [sizecounter,'12','1'];
                
                    vkFriensDataJsonArr = JSON.stringify(JsonAr2Constract);
               
                    vkRuntime.trigger(cr.plugins_.vkontakte.prototype.cnds.onFrLoad, vkInst);
                    console.log('Construct2-VK: Friends loaded');
                }
              
            }); 
        });
    };
    
    
    Acts.prototype.ShowOrderBox = function (count_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        var elements = {
            "type": "votes"
        };    
        if (count_.length)
            elements["votes"] = count_;
        else
            elements["votes"] = 1;
           
        
        VK.init(function() {
            VK["callMethod"]("showOrderBox", elements); 
        });
        
    };
    
    Acts.prototype.ShowInviteBox = function ()
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        VK.init(function() {
            VK["callMethod"]("showInviteBox"); 
        });
        
    };
    
    Acts.prototype.SetTitle = function (title_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        VK.init(function() {
            VK["callMethod"]("setTitle", title_); 
        });
        
    };
    
    Acts.prototype.GetAlbums = function ()
    {
        if (this.runtime.isDomFree || !vkReady)
            return;
			
        VK.init(function() {
            VK.api('photos.getAlbums',function(data) { 
                
                if (data.response) {
                    
                    var sizecounter = 0;
                    var JsonAr2Constract = new Object();
                    var inner = [];
                    JsonAr2Constract["c2array"] = 1;
                   
                    jQuery.each(data.response, function(i, val) {
                        inner[i] = [[val["aid"]],[val["thumb_id"]],[val["owner_id"]],[val["title"]],[val["description"]],[val["created"]],[val["updated"]],[val["size"]],[val["privacy"]]];
                        sizecounter++; 
                    });
           
                    JsonAr2Constract["data"] = inner;
                    JsonAr2Constract["size"] = [sizecounter,'9','1'];
                    vkAlbumDataJsonArr = JSON.stringify(JsonAr2Constract);
                    vkRuntime.trigger(cr.plugins_.vkontakte.prototype.cnds.onAlbumLoaded, vkInst);
                    console.log('Construct2-VK: Albums list loaded');
                }
              
            }); 
        });
        
    };
    
    Acts.prototype.CreateAlbum = function (title_,privacy_,comment_privacy_,description_,gid_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;

        var getparam = {
            "title": title_
        };
        
        if (privacy_.length)
            getparam["privacy"] = privacy_;
        if (comment_privacy_.length)
            getparam["comment_privacy"] = comment_privacy_;
        if (description_.length)
            getparam["description"] = description_;
        if (gid_.length)
            getparam["gid"] = gid_;

        VK.init(function() {
            VK.api('photos.createAlbum',getparam,function(data) { 
                 

                if (data.response) {
                    vkAlbumNewАid = data.response["aid"];
                    vkRuntime.trigger(cr.plugins_.vkontakte.prototype.cnds.onAlbumCreated, vkInst);
                    console.log('Construct2-VK: New Album created');
                    
                }
            }); 
        });
    };
    
    Acts.prototype.GetUpServer = function (aid_,gid_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;

        var getparam = {
            "aid": aid_
        };
        
        if (gid_.length)
            getparam["gid"] = gid_;

        VK.init(function() {
            VK.api('photos.getUploadServer',getparam,function(data) { 
                 
                if (data.response) {
                    vkServerUrl = encodeURIComponent(data.response["upload_url"]);
                    vkRuntime.trigger(cr.plugins_.vkontakte.prototype.cnds.onGetUpServer, vkInst);
                    console.log('Construct2-VK: Url Up server detected');
                    
                }
            }); 
        });
    };
    
    Acts.prototype.SavePhoto = function (json_,caption_,gid_)
    {
        if (this.runtime.isDomFree || !vkReady)
            return;

        var obj = jQuery.parseJSON(json_);
            
        var getparam = {
            "server": obj["server"],
            "photos_list": obj["photos_list"],
            "aid": obj["aid"],
            "hash": obj["hash"]
        };
        
        if (gid_.length)
            getparam["gid"] = gid_;
        if (caption_.length)
            getparam["caption"] = caption_;
        
        VK.init(function() {
            VK.api('photos.save',getparam,function(data) { 
                 
                if (data.response) {
                    
                    var obj = data.response[0];
                    vkPhotoId = obj["id"];
                    vkRuntime.trigger(cr.plugins_.vkontakte.prototype.cnds.onPhotoSaved, vkInst);
                    console.log('Construct2-VK: Photo saved');
                    
                }
            }); 
        });
    };
	
    //////////////////////////////////////
    // Conditions
    function Cnds() {};
	

    Cnds.prototype.IsBlur = function ()
    {
        return vkOnBlur;
    };
        
    Cnds.prototype.OnReady = function ()
    {
        return true;
    };

    Cnds.prototype.OnBlur = function ()
    {
        return true;
    };

    Cnds.prototype.OnFocus = function ()
    {
        return true;
    };
    
    Cnds.prototype.OnBalCh = function ()
    {
        return true;
    };
    
    Cnds.prototype.onOrdCan = function ()
    {
        return true;
    };
    
    Cnds.prototype.onOrdSuc = function ()
    {
        return true;
    };
    
    Cnds.prototype.onOrdFail = function ()
    {
        return true;
    };
        
    Cnds.prototype.onFrLoad = function ()
    {
        return true;
    };
    
    Cnds.prototype.onAlbumLoaded = function ()
    {
        return true;
    };
    
    Cnds.prototype.onAlbumCreated = function ()
    {
        return true;
    };
    
    Cnds.prototype.onGetUpServer = function ()
    {
        return true;
    };
    
    Cnds.prototype.onPhotoSaved = function ()
    {
        return true;
    };
        
    pluginProto.cnds = new Cnds();

    //////////////////////////////////////
    // Actions
    function Acts() {};
	
   
	
    pluginProto.acts = new Acts();

    //////////////////////////////////////
    // Expressions
    function Exps() {};
    
	
    Exps.prototype.OwnDataJsonArr = function (ret)
    {
        ret.set_string(vkOwnDataJsonArr);
    };
	
    Exps.prototype.orderId = function (ret)
    {
        ret.set_string(vkorderId);
    };
    
    Exps.prototype.errorCode = function (ret)
    {
        ret.set_string(vkerrorCode);
    };
    
    Exps.prototype.FriensDataJsonArr = function (ret)
    {
        ret.set_string(vkFriensDataJsonArr);
    };
    
    Exps.prototype.AlbumsDataJsonArr = function (ret)
    {
        ret.set_string(vkAlbumDataJsonArr);
    };
    
    Exps.prototype.GetNewAlbumAid = function (ret)
    {
        ret.set_string(vkAlbumNewАid);
    };
    
    Exps.prototype.ServerUpUrl = function (ret)
    {
        ret.set_string(vkServerUrl);
    };
    
    Exps.prototype.GetPhotoId = function (ret)
    {
        ret.set_string(vkPhotoId);
    };




    pluginProto.exps = new Exps();

}());