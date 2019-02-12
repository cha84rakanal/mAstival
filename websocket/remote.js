"use strict";

//起動時にpi-blasterを起動

const io = require('socket.io-client');
const spawn = require('child_process').spawn;
const PiServo = require('pi-servo');

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

let f1 = false;
let f2 = false;
let f3 = false;
let f4 = false;
let f5 = false;

let sv1_val = 40;
let sv2_val = 120;
let sv3_val = 80;
let sv4_val = 80;
let sv5_val = 160;

const sv1 = new PiServo(4);
const sv2 = new PiServo(17);
const sv3 = new PiServo(18);
const sv4 = new PiServo(23);
const sv5 = new PiServo(22);

sv1.open().then(function(){
    sv1.setDegree(sv1_val); //40-180
    f1 = true;
});
sv2.open().then(function(){
    sv2.setDegree(sv2_val); //40-120
    f2 = true;
});
sv3.open().then(function(){
    sv3.setDegree(sv3_val); //r40-l115
    f3 = true;
});
sv4.open().then(function(){
    sv4.setDegree(sv4_val); //80-160
    f4 = true;
});
sv5.open().then(function(){
    sv5.setDegree(sv5_val); //20-160
    f5 = true;
});
//socket.on('connect', function(){});
//socket.on('event', function(data){});
socket.on('controllerData',
    function(data){
        console.log(data);
        let int_num = Number(data);

        if(f3 && (int_num & 0b001000000000))//left
            if(sv3_val + 1 < 155){
                sv3_val++;
                sv3.setDegree(sv3_val);
            }
        if(f3 && (int_num & 0b010000000000))//right
            if(sv3_val - 1 > 40){
                sv3_val--;
                sv3.setDegree(sv3_val);
            }
    }
);
//socket.on('disconnect', function(){});

//終了
process.on("exit", function() {
    console.log("Exitting...");
});
process.on("SIGINT", function () {
    process.exit(0);
});