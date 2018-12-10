const process = require('process');
const childProcess = require('child_process');
const _ = require('electron').remote.require('lodash');

function execute(arg, src, dst, mode) {
    if (!_.isString(arg) || _.isEmpty(arg) ||
        !_.isString(src) || _.isEmpty(src) ||
        !_.isString(dst) || _.isEmpty(dst)) {
        return 'The parameter is empty.';
    }
    const cmd = `dotnet ./bin/Arrowgene.Ez2Off.Data.CLI/Arrowgene.Ez2Off.Data.CLI.dll data ${arg} ${src} ${dst}` + (mode ? ` ${mode}` : '');
    // console.log(cmd);

    const {
        BrowserWindow
    } = require('electron').remote;

    let child = new BrowserWindow({
        parent: top,
        modal: true,
        show: false,
        resizable: false,
        width: 400,
        height: 300,
        center: true
    });
    child.loadURL('./blank.html');
    child.once('ready-to-show', () => {
        child.show();
        // if (process.platform == 'darwin') {
        //     const exec = childProcess.exec(cmd, {
        //         cwd: process.cwd() + '/Contents/Resources/app/src'
        //     }, (error, stdout, stderr) => {
        //         if (error)
        //             child.webContents.executeJavaScript(`document.write(${error})`);
        //         if (stdout) {
        //             child.webContents.executeJavaScript(`document.write(${stdout})`);
        //         }
        //         if (stderr) {
        //             child.webContents.executeJavaScript(`document.write(${stderr})`);
        //         }
        //     });
        //     exec.on('close', () => {
        //         child.close();
        //     });
        // } else {
        //     const exec = childProcess.exec(cmd, {
        //         cwd: process.cwd() + '/resources/app/src'
        //     }, (error, stdout, stderr) => {
        //         if (error)
        //             child.webContents.executeJavaScript(`document.write(${error})`);
        //         if (stdout) {
        //             child.webContents.executeJavaScript(`document.write(${stdout})`);
        //         }
        //         if (stderr) {
        //             child.webContents.executeJavaScript(`document.write(${stderr})`);
        //         }
        //     });
        //     exec.on('close', () => {
        //         child.close();
        //     });
        // }
    });
}

module.exports = {
    execute
}