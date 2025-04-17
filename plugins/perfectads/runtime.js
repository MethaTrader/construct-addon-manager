cr.plugins_.PerfectAds = function (runtime)
{
    this.runtime = runtime;
};

(function ()
{

    var pluginProto = cr.plugins_.PerfectAds.prototype;

    pluginProto.Type = function (plugin)
    {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    };

    var typeProto = pluginProto.Type.prototype;

    typeProto.onCreate = function ()
    {
    };

    pluginProto.Instance = function (type)
    {
        this.type = type;
        this.runtime = type.runtime;
    };

    var instanceProto = pluginProto.Instance.prototype;

    instanceProto.onCreate = function ()
    {
        if ( ! this.isValidDevice()) return;

        this.isVideoLoaded = false;
        this.errorMsg = "";
        this.debugData = "";
        this.isShowingBanner = false;
        this.isBannerLoaded = false;
        this.isShowingInterstitial = false;
        this.isInterstitialLoaded = false;
        this.isShowingRewardInterstitial = false;

        var testUnit =
        {
            ANDROID:
            {
                BANNER: "ca-app-pub-3940256099942544/6300978111",
                INTERSTITIAL: "ca-app-pub-3940256099942544/1033173712",
                REWARDED: "ca-app-pub-3940256099942544/5224354917"
            },
            IOS:
            {
                BANNER: "ca-app-pub-3940256099942544/6300978111",
                INTERSTITIAL: "ca-app-pub-3940256099942544/1033173712",
                REWARDED: "ca-app-pub-3940256099942544/1712485313"
            }
        };

        var isTestMode = !!this.properties[8];

        this.bannerSize = this.runtime.isAndroid ? this.properties[1] : this.properties[5];
        this.bannerAdUnit = this.runtime.isAndroid ? this.properties[0] : this.properties[4];
        this.interstitialAdUnit = this.runtime.isAndroid ? this.properties[2] : this.properties[6];
        this.rewardedVideoAdUnit = this.runtime.isAndroid ? this.properties[3] : this.properties[7];

        switch (this.bannerSize)
        {
            case 0: this.bannerSize = "SMART"; break;
            case 1: this.bannerSize = "BANNER"; break;
            case 2: this.bannerSize = "MEDIUM_REC"; break;
            case 3: this.bannerSize = "LEADERBOARD"; break;
        }

        if (isTestMode || ! this.bannerAdUnit)
        {
            this.bannerAdUnit = this.runtime.isAndroid ? testUnit.ANDROID.BANNER : testUnit.IOS.BANNER;
        }

        if (isTestMode || ! this.interstitialAdUnit)
        {
            this.interstitialAdUnit = this.runtime.isAndroid ? testUnit.ANDROID.INTERSTITIAL : testUnit.IOS.INTERSTITIAL;
        }

        if (isTestMode || ! this.rewardedVideoAdUnit)
        {
            this.rewardedVideoAdUnit = this.runtime.isAndroid ? testUnit.ANDROID.REWARDED : testUnit.IOS.REWARDED;
        }

        this.banner = window["Cocoon"]["Ad"]["createBanner"](this.bannerAdUnit.trim(), this.bannerSize);
        this.interstitial = window["Cocoon"]["Ad"]["createInterstitial"](this.interstitialAdUnit.trim());
        this.rewardedVideo = window["Cocoon"]["Ad"]["createRewardedVideo"](this.rewardedVideoAdUnit.trim());

        var self = this;

        this.banner["on"]("show", function ()
        {
            self.isShowingBanner = true;
            self.runtime.trigger(cr.plugins_.PerfectAds.prototype.cnds.OnBannerShown, self);
        });

        this.banner["on"]("load", function ()
        {
            self.isBannerLoaded = true;
            self.runtime.trigger(cr.plugins_.PerfectAds.prototype.cnds.OnBannerLoaded, self);
        });

        this.banner["on"]("click", function ()
        {
            self.runtime.trigger(cr.plugins_.PerfectAds.prototype.cnds.OnBannerClicked, self);
        });

        this.banner["on"]("fail", function ()
        {
            self.isBannerLoaded = false;
            self.runtime.trigger(cr.plugins_.PerfectAds.prototype.cnds.OnBannerFailed, self);
        });

        this.banner["on"]("dismiss", function ()
        {
            self.isShowingBanner = false;
            self.isBannerLoaded = false;
            self.runtime.trigger(cr.plugins_.PerfectAds.prototype.cnds.OnBannerDismissed, self);
        });

        this.interstitial["on"]("show", function ()
        {
            self.isShowingInterstitial = true;
            self.isInterstitialLoaded = false;
            self.runtime.trigger(cr.plugins_.PerfectAds.prototype.cnds.OnInterstitialShown, self);
        });

        this.interstitial["on"]("load", function ()
        {
            self.isInterstitialLoaded = true;
            self.runtime.trigger(cr.plugins_.PerfectAds.prototype.cnds.OnInterstitialLoaded, self);
        });

        this.interstitial["on"]("click", function ()
        {
            self.runtime.trigger(cr.plugins_.PerfectAds.prototype.cnds.OnInterstitialClicked, self);
        });

        this.interstitial["on"]("fail", function ()
        {
            self.isInterstitialLoaded = false;
            self.runtime.trigger(cr.plugins_.PerfectAds.prototype.cnds.OnInterstitialFailed, self);
        });

        this.interstitial["on"]("dismiss", function ()
        {
            self.isShowingInterstitial = false;
            self.isInterstitialLoaded = false;
            self.runtime.trigger(cr.plugins_.PerfectAds.prototype.cnds.OnInterstitialDismissed, self);
        });

        this.rewardedVideo["on"]("show", function ()
        {
            self.isShowingRewardInterstitial = true;
            self.runtime.trigger(cr.plugins_.PerfectAds.prototype.cnds.OnRewardInterstitialShown, self);
        });

        this.rewardedVideo["on"]("load", function ()
        {
            self.isVideoLoaded = true;
            self.runtime.trigger(cr.plugins_.PerfectAds.prototype.cnds.OnRewardInterstitialLoaded, self);
        });

        this.rewardedVideo["on"]("click", function ()
        {
            self.runtime.trigger(cr.plugins_.PerfectAds.prototype.cnds.OnRewardInterstitialClicked, self);
        });

        this.rewardedVideo["on"]("fail", function ()
        {
            self.isVideoLoaded = false;
            self.runtime.trigger(cr.plugins_.PerfectAds.prototype.cnds.OnRewardInterstitialFailed, self);
        });

        this.rewardedVideo["on"]("dismiss", function ()
        {
            self.isShowingRewardInterstitial = false;
            self.isVideoLoaded = false;
            self.runtime.trigger(cr.plugins_.PerfectAds.prototype.cnds.OnRewardInterstitialDismissed, self);
        });

        this.rewardedVideo["on"]("reward", function (reward_, error_)
        {
            self.isShowingRewardInterstitial = false;
            self.isVideoLoaded = false;

            if ( ! error_)
            {
                self.runtime.trigger(cr.plugins_.PerfectAds.prototype.cnds.OnRewardInterstitialSucceeded, self);
            }
            else
            {
                self.errorMsg = error_;
                self.runtime.trigger(cr.plugins_.PerfectAds.prototype.cnds.OnRewardInterstitialStopped, self);
            }

        });
    };

    instanceProto.isValidDevice = function()
    {
        return ((this.runtime.isAndroid || this.runtime.isiOS) && ! cr.is_undefined(window["Cocoon"]));
    };

    function Cnds() {}

    Cnds.prototype.OnBannerShown = function () { return true; };
    Cnds.prototype.OnBannerLoaded = function () { return true; };
    Cnds.prototype.OnBannerClicked = function () { return true; };
    Cnds.prototype.OnBannerFailed = function () { return true; };
    Cnds.prototype.OnBannerDismissed = function () { return true; };
    Cnds.prototype.IsShowingBanner = function () { return this.isShowingBanner; };
    Cnds.prototype.IsBannerLoaded = function () { return this.isBannerLoaded; };

    Cnds.prototype.OnInterstitialShown = function () { return true; };
    Cnds.prototype.OnInterstitialLoaded = function () { return true; };
    Cnds.prototype.OnInterstitialClicked = function () { return true; };
    Cnds.prototype.OnInterstitialFailed = function () { return true; };
    Cnds.prototype.OnInterstitialDismissed = function () { return true; };
    Cnds.prototype.IsShowingInterstitial = function () { return this.isShowingInterstitial; };
    Cnds.prototype.IsInterstitialLoaded = function () { return this.isInterstitialLoaded; };
	
	Cnds.prototype.OnRewardInterstitialShown = function () { return true; };
    Cnds.prototype.OnRewardInterstitialLoaded = function () { return true; };
    Cnds.prototype.OnRewardInterstitialClicked = function () { return true; };
    Cnds.prototype.OnRewardInterstitialFailed = function () { return true; };
    Cnds.prototype.OnRewardInterstitialDismissed = function () { return true; };
    Cnds.prototype.OnRewardInterstitialSucceeded = function () { return true; };
    Cnds.prototype.OnRewardInterstitialStopped = function () { return true; };
    Cnds.prototype.IsShowingRewardInterstitial = function () { return this.isShowingRewardInterstitial; };
    Cnds.prototype.IsVideoLoaded = function () { return this.isVideoLoaded; };

    pluginProto.cnds = new Cnds();

    function Acts() {}

    Acts.prototype.ShowRewardInterstitial = function ()
    {
        if ( ! this.isValidDevice()) return;

        if (this.isVideoLoaded)
            this.rewardedVideo["show"]();
        else
            this.rewardedVideo["load"]();
    };

    Acts.prototype.LoadRewardInterstitial = function ()
    {
        if ( ! this.isValidDevice()) return;

        this.rewardedVideo["load"]();
    };

    Acts.prototype.ShowBanner = function ()
    {
        if ( ! this.isValidDevice()) return;

        if (this.isBannerLoaded)
        {
            this.isShowingBanner = true;
            this.banner["show"]();
        }
        else
        {
            this.banner["load"]();
        }
    };

    Acts.prototype.HideBanner = function ()
    {
        if ( ! this.isValidDevice()) return;

        if (this.isBannerLoaded)
        {
            this.isShowingBanner = false;
            this.banner["hide"]();
        }
    };

    Acts.prototype.LoadBanner = function ()
    {
        if ( ! this.isValidDevice()) return;

        this.banner["load"]();
    };

    Acts.prototype.SetLayout = function (layout)
    {
        if ( ! this.isValidDevice()) return;

        var bannerLayout;

        switch (layout)
        {
            case 0:
                bannerLayout = "TOP_CENTER";
                break;
            case 1:
                bannerLayout = "BOTTOM_CENTER";
                break;
            case 2:
                bannerLayout = "CUSTOM";
                break;
        }

        this.banner["setLayout"](bannerLayout);
    };

    Acts.prototype.SetPosition = function (x, y)
    {
        if ( ! this.isValidDevice()) return;

        this.banner["setPosition"](x, y);
    };

    Acts.prototype.ShowInterstitial = function ()
    {
        if ( ! this.isValidDevice()) return;

        if (this.isInterstitialLoaded)
            this.interstitial["show"]();
        else
            this.interstitial["load"]();
    };

    Acts.prototype.LoadInterstitial = function ()
    {
        if ( ! this.isValidDevice()) return;

        this.interstitial["load"]();
    };

    pluginProto.acts = new Acts();

    function Exps()
    {
    };

    Exps.prototype.LastError = function (ret)
    {
        ret.set_any(this.errorMsg);
    };

    pluginProto.exps = new Exps();

}());
