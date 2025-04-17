function GetPluginSettings() {
    return {
        "name": "Perfect Ads",
        "id": "PerfectAds",
        "version": "1.0",
        "description": "Complex AdMob ads plugin for Cocoon, Phonegap, Cordova CLI.",
        "author": "Steel",
        "help url": "http://c2community.ru",
        "category": "Monetisation",
        "type": "object",
        "rotatable": false,
        "cordova-plugins":	"cocoon-plugin-ads-android-admob", // "cocoon-plugin-ads-ios-admob" for iOS
        "flags": pf_singleglobal
    };
};

AddCondition(0, cf_trigger, "On clicked banner", "Banners", "On banner clicked", "Triggered when a banner is clicked.", "OnBannerClicked");
AddCondition(1, cf_trigger, "On dismissed banner", "Banners", "On banner dismissed", "Triggered when a new banner is collapsed after showing its modal content.", "OnBannerDismissed");
AddCondition(2, cf_trigger, "On failed banner", "Banners", "On banner failed", "Triggered when a banner fails to load.", "OnBannerFailed");
AddCondition(3, cf_trigger, "On loaded banner", "Banners", "On banner loaded", "Triggered when a new banner ad is cached.", "OnBannerLoaded");
AddCondition(4, cf_trigger, "On shown banner", "Banners", "On banner shown", "Triggered when a banner is shown.", "OnBannerShown");
AddCondition(5, cf_none, "Is loaded banner", "Banners", "Is banner loaded", "True if banner is loaded and ready to show.", "IsBannerLoaded");
AddCondition(6, cf_none, "Is showing banner", "Banners", "Is showing banner", "True if currently showing a banner.", "IsShowingBanner");

AddCondition(7, cf_trigger, "On clicked interstitial", "Interstitials", "On interstitial clicked", "Triggered when an interstitial is clicked.", "OnInterstitialClicked");
AddCondition(8, cf_trigger, "On dismissed interstitial ", "Interstitials", "On interstitial dismissed", "Triggered when an new interstitial is dismissed.", "OnInterstitialDismissed");
AddCondition(9, cf_trigger, "On failed interstitial", "Interstitials", "On interstitial failed", "Triggered when an interstitial fails to load.", "OnInterstitialFailed");
AddCondition(10, cf_trigger, "On loaded interstitial", "Interstitials", "On interstitial loaded", "Triggered when an new interstitial ad is cached.", "OnInterstitialLoaded");
AddCondition(11, cf_trigger, "On shown interstitial", "Interstitials", "On interstitial shown", "Triggered when an interstitial is shown.", "OnInterstitialShown");
AddCondition(12, cf_none, "Is loaded interstitial", "Interstitials", "Is interstitial loaded", "True if interstitial is loaded and ready to show.", "IsInterstitialLoaded");
AddCondition(13, cf_none, "Is showing interstitial", "Interstitials", "Is showing interstitial", "True if currently showing a interstitial.", "IsShowingInterstitial");

AddCondition(14, cf_trigger, "On clicked rewarded video", "Rewarded video", "On interstitial video clicked", "Triggered when an interstitial is clicked.", "OnRewardInterstitialClicked");
AddCondition(15, cf_trigger, "On completed rewarded video", "Rewarded video", "On video completed", "Triggered when a rewarded video successfully finished.", "OnRewardInterstitialSucceeded");
AddCondition(16, cf_trigger, "On dismissed rewarded video", "Rewarded video", "On interstitial dismissed", "Triggered when an interstitial is dismissed.", "OnRewardInterstitialDismissed");
AddCondition(17, cf_trigger, "On failed rewarded video", "Rewarded video", "On rewarded video failed", "Triggered when a rewarded video fails to load.", "OnRewardInterstitialFailed");
AddCondition(18, cf_trigger, "On loaded rewarded video", "Rewarded video", "On rewarded video loaded", "Triggered when a new rewarded video ad is cached.", "OnRewardInterstitialLoaded");
AddCondition(19, cf_trigger, "On shown rewarded video", "Rewarded video", "On rewarded video shown", "Triggered when a rewarded video is shown.", "OnRewardInterstitialShown");
AddCondition(20, cf_trigger, "On stopped rewarded video", "Rewarded video", "On video stopped", "Triggered when user stopped the video.", "OnRewardInterstitialStopped");
AddCondition(21, cf_none, "Is loaded rewarded video", "Rewarded video", "Is video loaded", "Returns true if video is loaded and ready to show.", "IsVideoLoaded");
AddCondition(22, cf_none, "Is showing rewarded video", "Rewarded video", "Is showing rewarded video", "True if currently showing a rewarded video.", "IsShowingRewardInterstitial");

AddAction(0, af_none, "Load banner", "Banners", "Load a banner ad", "Start loading a banner ad in the background.", "LoadBanner");
AddAction(1, af_none, "Hide banner", "Banners", "Hide the banner ad", "Hide any currently showing banner ad.", "HideBanner");
AddNumberParam("x", "The top lef x coordinate of the banner.");
AddNumberParam("y", "The top lef y coordinate of the banner.");
AddAction(2, af_none, "Set banner position", "Banners", "Set banner position", "Set banner position given the x{0} and y{1} coordinates. It requires the CUSTOM layout (see 'set banner layout')", "SetPosition");
AddComboParamOption("TOP_CENTER");
AddComboParamOption("BOTTOM_CENTER");
AddComboParamOption("CUSTOM");
AddComboParam("Layout", "Choose where the banner ad will appear.");
AddAction(3, af_none, "Set banner layout", "Banners", "Set banner layout <i>{0}</i>", "Set banner layout. If CUSTOM, 'set banner position' can be called afterwards.", "SetLayout");
AddAction(4, af_none, "Show banner", "Banners", "Show the banner ad", "Show a banner ad on the screen while the game is running.", "ShowBanner");

AddAction(5, af_none, "Load interstitial", "Interstitials", "Load an interstitial", "Start loading an interstitial in the background.", "LoadInterstitial");
AddAction(6, af_none, "Show interstitial", "Interstitials", "Show the interstitial", "Show an interstitial on the screen while the game is running.", "ShowInterstitial");

AddAction(7, af_none, "Load rewarded video", "Rewarded video", "Load a rewarded video", "Start loading a rewarded video in the background.", "LoadRewardInterstitial");
AddAction(8, af_none, "Show rewarded video", "Rewarded video", "Show rewarded video", "Show a rewarded video on the screen while the game is running.", "ShowRewardInterstitial");

AddExpression(0, ef_return_any, "Rewarded video", "Rewarded video", "LastError", "Return the last error message.");

ACESDone();

var property_list = 
[
    new cr.Property(ept_section, "Android", "", "Ad unit IDs for Android."),
    new cr.Property(ept_text,   "Banner ID (Android)",  "", "Ad unit ID from AdMob or MoPub for the banner ad."),
    new cr.Property(ept_combo,  "Banner size (Android)", "SMART", "The size of the banner ad to display", "SMART|BANNER|MEDIUM_RECT|LEADERBOARD"),
    new cr.Property(ept_text,   "Interstitial ID (Android)", "", "Ad unit ID from AdMob or MoPub for the interstitials."),
    new cr.Property(ept_text,   "Rewarded Video ID (Android)", "", "Ad unit ID from AdMob or MoPub for the rewarded video."),
    new cr.Property(ept_section, "iOS", "", "Ad unit IDs for iOS."),
    new cr.Property(ept_text,   "Banner ID (iOS)",  "", "Ad unit ID AdMob or MoPub for the banner ad."),
    new cr.Property(ept_combo,  "Banner size (iOS)",    "SMART", "The size of the banner ad to display", "SMART|BANNER|MEDIUM_RECT|LEADERBOARD"),
    new cr.Property(ept_text,   "Interstitial ID (iOS)",    "", "Ad unit ID AdMob or MoPub for the interstitials."),
    new cr.Property(ept_text,   "Rewarded Video ID (iOS)", "", "Ad unit ID from AdMob or MoPub for the rewarded video."),
    new cr.Property(ept_section, "Testing", "", "Test mode."),
    new cr.Property(ept_combo,  "Test mode", "Disabled", "Enable to test ads with AdMob test unit ids. REMEMBER to set this to Disabled before going to production!", "Disabled|Enabled")
];

function CreateIDEObjectType()
{
	return new IDEObjectType();
}

function IDEObjectType() 
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

function IDEInstance(instance, type) 
{
    assert2(this instanceof arguments.callee, "Constructor called as a function");
    this.instance = instance;
    this.type = type;
    this.properties = {};
    for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}

IDEInstance.prototype.OnCreate = function() {}
IDEInstance.prototype.OnPropertyChanged = function(property_name) {}
IDEInstance.prototype.Draw = function(renderer) {}
IDEInstance.prototype.OnRendererReleased = function() {}