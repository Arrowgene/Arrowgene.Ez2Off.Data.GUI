const childProcess = require('child_process');
const _ = require('electron').remote.require('lodash');

function execute(arg, src, dst, mode) {
    const textarea = $("#modal-notice #textarea");

    if (!_.isString(arg) || _.isEmpty(arg) ||
        !_.isString(src) || _.isEmpty(src) ||
        !_.isString(dst) || _.isEmpty(dst)) {
        textarea.append('The parameter is empty.');
        textarea.css('color', 'red');
        modalDone();
        return;
    }

    const exec = childProcess.spawn('./bin/Arrowgene.Ez2Off.Data.CLI/Arrowgene.Ez2Off.Data.CLI.exe', ['data', arg, src, dst, mode ? mode : ''], {
        cwd: __dirname
    });

    textarea.append('Processing, please wait...\n-');

    exec.stdout.on('data', chunk => {
        textarea.append(optimizeString(chunk.toString('utf8')));
        scrollBottom(textarea);
    });

    exec.stderr.on('data', chunk => {
        textarea.append(optimizeString(chunk.toString('utf8')));
        textarea.css('color', 'red');
        scrollBottom(textarea);
        // goDotnetDL();
    });

    exec.on('error', err => {
        textarea.append(err);
        textarea.css('color', 'red');
        scrollBottom(textarea);
        // goDotnetDL();
        modalDone();
    });

    exec.on('close', () => {
        modalDone();
    });
}

function optimizeString(text) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function scrollBottom(textarea) {
    textarea.scrollTop(textarea[0].scrollHeight - textarea.height());
}

function goDotnetDL() {
    const {
        dialog
    } = require('electron').remote;
    const result = dialog.showMessageBox({
        type: 'warning',
        message: 'Do you want to download .NET Core?',
        detail: 'You may be missing the .NET Core runtime,\ndo you want to download it?',
        buttons: ['Yes', 'No']
    });
    if (result == 0) {
        window.open('https://dotnet.microsoft.com/download');
    }
}

module.exports = {
    execute
}