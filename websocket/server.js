"use strict";

//サーバ作成
const SSL_KEY = '../temp/gen_key/server.key';
const SSL_CERT= '../temp/gen_key/server.crt';

const https = require('https');
const fs = require('fs');

const options = {
    key  : fs.readFileSync(SSL_KEY).toString(),
    cert : fs.readFileSync(SSL_CERT).toString(),
    'log level':1
};
const app = https.createServer(options);
const io = require('socket.io').listen(app);

let onServer = false;
let onClient = false;

//クライアント接続があると、以下の処理をさせる。
io.on('connection', function (socket) {

    //接続通知をクライアントに送信
    //io.emit("sendMessageToClient","tunagatta!");
    //process.stdout.write('connect\n');

    //クライアントからの受信イベントを設定
    //socket.on("sendMessageToServer", function (data) {
        //console.log (data);
    //});

    //controller.js -> server.js -> remote.js
    socket.on("fromController", function (data) {
        io.emit("controllerData",data);
        console.log(data);
    });

    //接続切れイベントを設定
    socket.on("disconnect", function () {
        //console.log('disconnect');
    });

    socket.on('remote_wakeup',function(data){
        onServer = true;
        console.log('remote on');
    });

    socket.on('client_wakeup',function(data){
        onClient = true;
        console.log('client on');
        io.emit("call",onServer);
    });

});

app.listen(8000);