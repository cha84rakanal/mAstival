//サーバ作成

var SSL_KEY = './temp/gen_key/server.key';
var SSL_CERT= './temp/gen_key/server.crt';

var https = require('https');

var serverId = null;
var clientId = null;

var fs = require('fs');
var options = {
    key  : fs.readFileSync(SSL_KEY).toString(),
    cert : fs.readFileSync(SSL_CERT).toString(),
    'log level':1
};
var app = https.createServer(options);
io = require('socket.io').listen(app);


//io.enable('browser client minification');
//io.set('log level', 3);

//クライアント接続があると、以下の処理をさせる。
io.on('connection', function (socket) {

  //接続通知をクライアントに送信
  //io.emit("sendMessageToClient", {value:"1人入室しました。"});
  process.stdout.write('connect\n');
  
  //クライアントからの受信イベントを設定
  socket.on("sendMessageToServer", function (data) {
      console.log (data);
  });     

  socket.on("serverConnect", function (data){
    console.log("[serverConnect] "+data);
    serverId = data;
  });

  socket.on("clientConnect", function (data){
    console.log("[clientConnect] "+data);
    clientId = data;
    io.emit("sendMessageToClient", serverId);
  }); 

  //接続切れイベントを設定
  socket.on("disconnect", function () {
      //io.emit("sendMessageToClient", {value:"1人退室しました。"});
      //process.stdout.write('aaaaaaaa');
      //client.close();
  });
});

app.listen(8000);