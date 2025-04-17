
    CocoonJS.App.showTextDialog = function (title, message, text, okButtonText, cancelButtonText) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_APP", "showTextDialog", arguments, true);
        }
        else if (!navigator.isCocoonJS) {
            if (!message) {
                message = "";
            }
            if (!text) {
                text = "";
            }
            var result = prompt(message, text);
            var eventObject = result ? CocoonJS.App.onTextDialogFinished : CocoonJS.App.onTextDialogCancelled;
            eventObject.notifyEventListeners(result);
        }
    };

  


    CocoonJS.App.showMessageBox = function (title, message, confirmButtonText, denyButtonText) {
        if (CocoonJS.App.nativeExtensionObjectAvailable) {
            return CocoonJS.makeNativeExtensionObjectFunctionCall("IDTK_APP", "showMessageBox", arguments, true);
        }
        else if (!navigator.isCocoonJS) {
            if (!message) {
                message = "";
            }
            var result = confirm(message);
            var eventObject = result ? CocoonJS.App.onMessageBoxConfirmed : CocoonJS.App.onMessageBoxDenied;
            eventObject.notifyEventListeners();
        }
    };

