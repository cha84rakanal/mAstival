"use strict";

const io = require('socket.io-client');
const spawn = require('child_process').spawn;

var chromeRuntimes = {
    darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    linux: "chromium-browser"
};
  
var gChrome = spawn(chromeRuntimes[process.platform], [
    "--app=https://cha84rakanal.tk/mastival/server.html",   // シンプルなウィンドウでURLを開く
    "--enable-usermedia-screen-capturing", // デスクトップキャプチャー機能を有効
    "--ignore-certificate-errors",   // オレオレ証明書の警告を無効
    "--window-size=300,300",   //キャプチャーボタンに必要な小さ目のサイズを指定
    "--allow-file-access-from-files"
]);

//clientからserverにつながる
const socket = io('https://localhost:8000',{rejectUnauthorized: false});

socket.emit('remote_wakeup','remote on!'); //remoteonを通知

//socket.on('connect', function(){});
//socket.on('event', function(data){});
socket.on('controllerData', function(data){console.log(data)});
//socket.on('disconnect', function(){});

//終了
process.on("exit", function() {
    console.log("Exitting...");
});
process.on("SIGINT", function () {
    process.exit(0);
});