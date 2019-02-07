var spawn = require('child_process').spawn;
var fs = require('fs');

function getWin32ChromePath() {
  var path = [
    process.env.LOCALAPPDATA + "\\Google\\Chrome\\Application\\chrome.exe",
    process.env.ProgramFiles + "\\Google\\Chrome\\Application\\chrome.exe"
  ];

  for (var i = 0; i < path.length; i++) {
    if (fs.existsSync(path[i])) {
      return path[i];
    }
  }
  return null;
}

var chromeRuntimes = {
  win32: getWin32ChromePath(),
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  linux: "" //頑張ってください
};

var gChrome = spawn(chromeRuntimes[process.platform], [
    "--app=https://127.0.0.1:5500/video/server.html",   // シンプルなウィンドウでURLを開く
    "--enable-usermedia-screen-capturing", // デスクトップキャプチャー機能を有効
    "--ignore-certificate-errors",   // オレオレ証明書の警告を無効
    "--window-size=600,600",   // キャプチャーボタンに必要な小さ目のサイズを指定
    "--allow-file-access-from-files"
    //"--user-data-dir=" + __dirname + "/chromeStuff" //
]);

process.on('SIGINT', () => {
    console.log('end');
    process.exit(0);
});