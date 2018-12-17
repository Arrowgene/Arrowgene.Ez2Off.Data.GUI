const childProcess = require('child_process');
const _ = require('electron').remote.require('lodash');
require('hazardous');
const path = require('path');

async function execute(arg, src, dst, mode) {
    return new Promise(resolve => {
        logBuffer.textArea = $("#modal-notice #textarea");

        if (!_.isString(arg) || _.isEmpty(arg) ||
            !_.isString(src) || _.isEmpty(src) ||
            !_.isString(dst) || _.isEmpty(dst)) {
            logBuffer.append('The parameter is empty.');
            logBuffer.error();
            resolve();
            return;
        }

        let command;
        switch (process.platform) {
            case 'win32':
                command = './bin/Arrowgene.Ez2Off.Data.CLI/win-x64/Arrowgene.Ez2Off.Data.CLI.exe';
                break;
            case 'darwin':
                command = './bin/Arrowgene.Ez2Off.Data.CLI/osx-x64/Arrowgene.Ez2Off.Data.CLI';
                break;
            case 'linux':
                command = './bin/Arrowgene.Ez2Off.Data.CLI/linux-x64/Arrowgene.Ez2Off.Data.CLI';
                break;
        }

        const exec = childProcess.spawn(command, ['data', arg, src, dst, mode ? mode : ''], {
            cwd: path.join(__dirname)
        });

        logBuffer.append('Processing, please wait...\n-');

        exec.stdout.on('data', chunk => {
            logBuffer.append(chunk.toString('utf8'));
        });

        exec.stderr.on('data', chunk => {
            logBuffer.append(chunk.toString('utf8'));
            logBuffer.error();
            // goDotnetDL();
        });

        exec.on('error', err => {
            logBuffer.append(err);
            logBuffer.error();
            // goDotnetDL();
        });

        exec.on('close', () => {
            resolve();
        });
    });
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