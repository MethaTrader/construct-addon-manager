function GetPluginSettings()
{
    return {
        "name":			"vkontakte",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
        "id":			"vkontakte",				// this is used to identify this plugin and is saved to the project; never change it
        "version":		"1.2",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
        "description":          "VK interaction. Теперь банановый!",
        "author":		"AquaBarbus",
        "help url":		"https://bitbucket.org/AquaBarbus/c2-vkapi",
        "category":		"Platform specific",				// Prefer to re-use existing categories, but you can set anything here
        "type":			"object",				// either "world" (appears in layout and is drawn), else "object"
        "rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
        "flags":		pf_singleglobal,					// uncomment lines to enable flags...
        //	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
        //	| pf_texture			// object has a single texture (e.g. tiled background)
        //	| pf_position_aces		// compare/set/get x, y...
        //	| pf_size_aces			// compare/set/get width, height...
        //	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
        //	| pf_appearance_aces	// compare/set/get visible, opacity...
        //	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
        //	| pf_animations			// enables the animations system.  See 'Sprite' for usage
        //	| pf_zorder_aces		// move to top, bottom, layer...
        //  | pf_nosize				// prevent resizing in the editor
        //	| pf_effects			// allow WebGL shader effects to be added
        //  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
        // a single non-tiling image the size of the object) - required for effects to work properly
        "dependency":	"xd_connection.js"
    };
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
// example	
AddCondition(0,	cf_trigger, "On ready", "Основное", "On ready", "Срабатывает когда приложение инциализировалось и готово к работе с VK", "OnReady");

AddCondition(1,	cf_trigger, "On Balance Changed", "Операции с голосами", "On Balance Changed", "Событие происходит, когда пользователь положил или снял голоса с баланса приложения. Параметр balance содержит текущий баланс пользователя в сотых долях голоса. Этот параметр можно использовать только для вывода пользователю. Достоверность баланса всегда нужно проверять с помощью метода secure.getBalance.", "OnBalCh");
AddCondition(5,	cf_trigger, "On Order Cancel", "Операции с голосами", "On Order Cancel", "Событие происходит, когда пользователь отменяет покупку.", "onOrdCan");
AddCondition(6,	cf_trigger, "On Order Success", "Операции с голосами", "On Order Success", "Событие происходит, когда покупка закончилась успешно.", "onOrdSuc");
AddCondition(7,	cf_trigger, "On Order Fail", "Операции с голосами", "On Order Fail", "Событие происходит, когда покупка закончилась неуспешно.", "onOrdFail");

AddCondition(2,	cf_trigger, "On Window Blur", "Окно", "On Window Blur", "Событие происходит, когда окно с приложением теряет фокус. Например, когда пользователь открывает окно с настройками приложения.", "OnBlur");
AddCondition(3,	cf_trigger, "On Window Focus", "Окно", "On Window Focus", "Событие происходит, когда окно с приложением получает фокус. Например, когда пользователь закрывает окно с настройками приложения.", "OnFocus");
AddCondition(4,	0, "Is Blur", "Окно", "Is Window Blur", "Правдиво, когда окно не в фокусе ", "IsBlur");

AddCondition(8,	cf_trigger, "On Friends List Loaded", "Друзья", "On Friends List Loaded", "Событие происходит, когда отработала ф-ция Friends Get", "onFrLoad");

AddCondition(9,	cf_trigger, "On Albums List Loaded", "Фотографии", "On Albums List Loaded", "Событие происходит, когда отработала ф-ция Получения списка альбомов", "onAlbumLoaded");
AddCondition(10,cf_trigger, "On New Album Created", "Фотографии", "On New Album Created", "Событие происходит, когда отработала ф-ция Создать новый альбом", "onAlbumCreated");
AddCondition(11,cf_trigger, "On URL Upload Server Detected", "Фотографии", "On URL Upload Server Detected", "Событие происходит, когда получен адрес сервера для загрузки фото", "onGetUpServer");
AddCondition(12,cf_trigger, "On Photo Saved", "Фотографии", "On Photo Saved", "Событие происходит, когда фото сохранились после вызова Photo Save", "onPhotoSaved");



AddExpression(0, ef_return_string, "Получить JSON массив текущего поль.", "Пользователь приложения", "OwnDataJsonArr", "Массив данных пользователя со структорой для импорта в массив типа Construct Array");

AddExpression(2, ef_return_number, "Получить ID заказа", "Платежи", "orderId", "Если покупка успешна - получить ID заказа");
AddExpression(3, ef_return_number, "Получить код ошибки", "Платежи", "errorCode", "Если произошла ошибка при покупке - получить код ошибки");

AddExpression(4, ef_return_string, "Получить JSON массив друзей", "Друзья", "FriensDataJsonArr", "Массив со структорой для импорта в массив типа Construct Array");
AddExpression(5, ef_return_string, "Получить JSON массив альбомов", "Фотографии", "AlbumsDataJsonArr", "Массив со структорой для импорта в массив типа Construct Array");
AddExpression(6, ef_return_number, "Получить aid созданного альбома", "Фотографии", "GetNewAlbumAid", "Числовое значения альбома");

AddExpression(7, ef_return_string, "Получить URL сервера для аплоада фото", "Фотографии", "ServerUpUrl", "URL сервера");
AddExpression(8, ef_return_string, "Получить id сохраненного фото", "Фотографии", "GetPhotoId", "Например photo152321_1231351");

AddStringParam("id_owner", "ID пользователя, которому отправлять на стену(если не заполнено, опубликовать текущему пользователю)");
AddStringParam("message", "Текст сообщения");
AddStringParam("attachments", "список объектов, приложенных к записи и разделённых символом ,. Например: photo66748_265827614,http://habrahabr.ru");
AddStringParam("lat", "географическая широта отметки, заданная в градусах (от -90 до 90).");
AddStringParam("long", "географическая долгота отметки, заданная в градусах (от -180 до 180).");
AddStringParam("place_id", "идентификатор места, в котором отмечен пользователь");
AddStringParam("services", "Например twitter, facebook.");
AddStringParam("from_group", "Данный параметр учитывается, если owner_id < 0 (статус публикуется на стене группы). 1 - статус будет опубликован от имени группы, 0 - статус будет опубликован от имени пользователя (по умолчанию).");
AddStringParam("signed", "Данный параметр учитывается, если owner_id < 0 (статус публикуется на стене группы). 1 - статус будет опубликован от имени группы, 0 - статус будет опубликован от имени пользователя (по умолчанию).");
AddStringParam("friends_only", "1 - статус будет доступен только друзьям, 0 - всем пользователям. По умолчанию публикуемые статусы доступны всем пользователям.");
AddAction(0, 0, "Опубликовать на стене", "Стена", "Публикация с текстом <i>{1}</i>", "Публикация поста на стене(необходимы права в приложении)", "PublishToWall");

AddStringParam("count","предустановленное количество голосов");
AddAction(1, 0, "Show Order Box", "Платежи", "Количество <i>{0}</i>", "Открыть окно работы с голосами", "ShowOrderBox");
AddAction(2, 0, "Show Invite Box", "Другое", "Показать окно приглашения друзей", "Открывает окно для приглашения друзей пользователя в приложение.", "ShowInviteBox");

AddStringParam("title","текст заголовка окна");
AddAction(3, 0, "Set Title", "Другое", "Изменяет заголовок окна браузера на <i>{0}</i>.", "Изменить заголовок окна браузера.", "SetTitle");


AddComboParamOption("nom");
AddComboParamOption("gen");
AddComboParamOption("dat");
AddComboParamOption("acc");
AddComboParamOption("ins");
AddComboParamOption("abl");
AddComboParam("name_case", "падеж для склонения имени и фамилии пользователя. Возможные значения: именительный – nom, родительный – gen, дательный – dat, винительный – acc, творительный – ins, предложный – abl. По умолчанию nom.", "nom");
AddStringParam("count","количество друзей, которое нужно вернуть. (по умолчанию – все друзья)");
AddStringParam("offset","смещение, необходимое для выборки определенного подмножества друзей.");
AddComboParamOption("name");
AddComboParamOption("hints");
AddComboParam("order", "Порядок в котором нужно вернуть список друзей. Допустимые значения: name - сортировать по имени (работает только при переданном параметре fields).", "hints");
AddAction(4, 0, "Friends Get", "Друзья", "Получить список друзей с параметрами склонения:<i>{0}</i>, количество:<i>{1}</i>, смещение:<i>{2}</i>, сортировка:<i>{3}</i>", "Получить список друзей в jsonarray для импорта в Array(Construct)", "FriendsGet");

AddAction(5, 0, "Get Albums", "Фотографии", "Получает массив с списком альбомов", "Получить список альбомов", "GetAlbums");

AddStringParam("title", "Название альбома","Новый альбом");
AddStringParam("privacy", "Уровень доступа к альбому. Значения: 0 – все пользователи, 1 – только друзья, 2 – друзья и друзья друзей, 3 - только я.");
AddStringParam("comment_privacy", "Уровень доступа к комментированию альбома. Значения: 0 – все пользователи, 1 – только друзья, 2 – друзья и друзья друзей, 3 - только я.");
AddStringParam("description", "Текст описания альбома.");
AddStringParam("gid", "Идентификатор группы, в которой создаётся альбом. В этом случае privacy и comment_privacy могут принимать два значения: 0 - доступ для всех пользователей, 1 - доступ только для участников группы.");
AddAction(6, 0, "Create Album", "Фотографии", "Создает пустой альбом", "Создать пустой альбом", "CreateAlbum");

AddNumberParam("aid", "ID альбома, в который необходимо загрузить фотографии",0);
AddStringParam("gid", "ID группы, при загрузке фотографии в группу.");
AddAction(7, 0, "Get Upload Server", "Фотографии", "Возвращает адрес сервера для загрузки фотографий.", "Возвращает адрес сервера для загрузки фотографий.", "GetUpServer");

AddStringParam("json", "Массив полученный от сервера загрузок");
AddStringParam("caption", "Описание к фото");
AddStringParam("gid", "ID группы, при загрузке фотографии в группу.");
AddAction(8, 0, "Save photo", "Фотографии", "Сохранить фото", "Сохраняет фото", "SavePhoto");


////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click


// Property grid properties for this plugin
var property_list = [
new cr.Property(ept_text,"App ID","","The App ID VK gives you after creating an app."),
];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
    return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
    assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
    return new IDEInstance(instance, this);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
    assert2(this instanceof arguments.callee, "Constructor called as a function");
	
    // Save the constructor parameters
    this.instance = instance;
    this.type = type;
	
    // Set the default property values from the property table
    this.properties = {};
	
    for (var i = 0; i < property_list.length; i++)
        this.properties[property_list[i].name] = property_list[i].initial_value;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
    }

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
    }
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
    }

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
    }
