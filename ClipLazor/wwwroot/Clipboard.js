//Copy a text to the clipboard using Clipboard API

window.copyClipboard = {
    copyText: function (text) {
        let response;
        navigator.clipboard.writeText(text).then(function () {
            response = Text + "Copied!"
        })
            .catch(function (error) {
                response = error;
            });
        return response;
    }
};
