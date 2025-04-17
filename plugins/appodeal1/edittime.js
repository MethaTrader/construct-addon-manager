/* Copyright (c) 2015 Appodeal Inc. All rights reserved.*/
function GetPluginSettings()
{
	return {
		"name":			"Appodeal Plugin",	
		"id":			"appodeal",	
		"version":		"1.12",
		"description":	"Appodeal Plugin Scirra Consruct 2",
		"author":		"Appodeal",
		"help url":		"http://appodeal.com/sdk",
		"category":		"Monetisation",
		"type":			"object",
		"rotatable":	false,
		"cordova-plugins":	"https://github.com/appodeal/Appodeal-PhoneGap-plugin",
		"flags":		pf_singleglobal
		
	};
};

/*AddCondition(0, cf_trigger, "On interstitial received", "Ads", "On interstitial received", "Triggered when interstitial loaded", "onInterstitialLoaded");
AddCondition(1, cf_trigger, "On interstitial shown", "Ads", "On interstitial shown", "Triggered when an interstitial is displayed on the screen", "onInterstitialShown");
AddCondition(2, cf_trigger, "On interstitial failed to load", "Ads", "On interstitial failed to load", "Triggered when an interstitial failed to load", "onInterstitialFailedToLoad");
AddCondition(3, cf_trigger, "On interstitial clicked", "Ads", "On interstitial clicked", "Triggered when an interstitial clicked", "onInterstitialClicked");
AddCondition(4, cf_trigger, "On interstitial closed", "Ads", "On interstitial closed", "Triggered when an interstitial closed", "onInterstitialClosed");

AddCondition(5, cf_trigger, "On video received", "Ads", "On video received", "Triggered when video loaded", "onVideoLoaded");
AddCondition(6, cf_trigger, "On video shown", "Ads", "On video shown", "Triggered when an video is displayed on the screen", "onVideoShown");
AddCondition(7, cf_trigger, "On video failed to load", "Ads", "On video failed to load", "Triggered when an video failed to load", "onVideoFailedToLoad");
AddCondition(8, cf_trigger, "On video finished", "Ads", "On video finished", "Triggered when an video finished", "onVideoFinished");
AddCondition(9, cf_trigger, "On video closed", "Ads", "On video closed", "Triggered when an video closed", "onVideoClosed");

AddCondition(10, cf_trigger, "On banner received", "Ads", "On banner received", "Triggered when banner loaded", "onBannerLoaded");
AddCondition(11, cf_trigger, "On banner shown", "Ads", "On banner shown", "Triggered when an banner is displayed on the screen", "onBannerShown");
AddCondition(12, cf_trigger, "On banner failed to load", "Ads", "On banner failed to load", "Triggered when an banner failed to load", "onBannerFailedToLoad");
AddCondition(13, cf_trigger, "On banner clicked", "Ads", "On banner clicked", "Triggered when an banner clicked", "onBannerClicked");
*/
AddComboParamOption("INTERSTITIAL");
AddComboParamOption("VIDEO");
AddComboParamOption("INTERSTITIAL or VIDEO");
AddComboParamOption("BANNER");
AddComboParamOption("BANNER_BOTTOM");
AddComboParamOption("BANNER_TOP");
AddComboParamOption("BANNER_CENTER");
AddComboParamOption("ANY");
AddComboParam("Ad Type", "");
AddAction(0, 0, "Show Ad", "Ads", "Show <i>{0}</i> ad", "Show Ad", "Show");

AddComboParamOption("INTERSTITIAL");
AddComboParamOption("VIDEO");
AddComboParamOption("INTERSTITIAL or VIDEO");
AddComboParamOption("ANY");
AddComboParam("Ad Type", "");
AddAction(1, 0, "Show Ad if loaded", "Ads", "Show <i>{0}</i> ad if loaded", "Show Ad if Loaded", "ShowIfLoaded");

AddAction(2, 0, "Initialize", "Ads", "Initialize", "Initialize", "Initialize");

AddComboParamOption("INTERSTITIAL");
AddComboParamOption("VIDEO");
AddComboParamOption("INTERSTITIAL or VIDEO");
AddComboParamOption("BANNER");
AddComboParamOption("ALL");
AddComboParam("Ad Type", "");
AddAction(3, 0, "Initialize Ad Type", "Ads", "Initialize <i>{0}</i> Ad Type", "Initialize Ad Type", "InitializeAdType");

AddComboParamOption("INTERSTITIAL");
AddComboParamOption("VIDEO");
AddComboParamOption("INTERSTITIAL or VIDEO");
AddComboParamOption("BANNER");
AddComboParamOption("ALL");
AddComboParam("Ad Type", "");
AddComboParamOption("Enabled");
AddComboParamOption("Disabled");
AddComboParam("Auto Cache", "");
AddAction(4, 0, "Auto cache", "Ads", "Set <i>{0}</i> Auto Cache <i>{1}</i>", "Auto cache", "setAutoCache");

AddComboParamOption("INTERSTITIAL");
AddComboParamOption("VIDEO");
AddComboParamOption("INTERSTITIAL or VIDEO");
AddComboParamOption("BANNER");
AddComboParamOption("ALL");
AddComboParam("Ad Type", "");
AddAction(5, 0, "Cache ad", "Ads", "Cache <i>{0}</i> ad", "Cache ad", "Cache");

AddAction(6, 0, "Hide Banner", "Ads", "Hide Banner", "Hide Banner", "Hide");

AddStringParam("Network to disable", "Disable ad network");
AddAction(7, 0, "Disable Network", "Ads", "Disable <i>{0}</i> Network", "Disable <i>{0}</i> ad ntwork", "DisableNetwork");

ACESDone();

var property_list = [

	new cr.Property(ept_text, "appKey", "", "Application Key"),

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
	return new IDEInstance(instance);
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

IDEInstance.prototype.OnCreate = function()
{
};

IDEInstance.prototype.OnInserted = function()
{
}

IDEInstance.prototype.OnDoubleClicked = function()
{
}

IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

IDEInstance.prototype.Draw = function(renderer)
{
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}