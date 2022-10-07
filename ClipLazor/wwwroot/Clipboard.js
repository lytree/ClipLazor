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

//Read text from the clipboard using Clipboard API
window.readClipboard = {
    readText: async function () {
        
        const response = await navigator.clipboard.readText();
        return response;
    }
};
