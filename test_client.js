"use strict";

const fs = require('fs');
const io = require('socket.io-client');

// client-side
const socket = io('https://localhost:8000',{
    // option 1
    //ca: fs.readFileSync('./temp/key/server.pem'),
  
    // option 2. WARNING: it leaves you vulnerable to MITM attacks!
    rejectUnauthorized: false
});

socket.on('connect', function(){});
socket.on('event', function(data){});
socket.on('sendMessageToClient', function(data){console.log(data)});
socket.on('disconnect', function(){});