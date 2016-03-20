#! /usr/bin/env node
var SerialPort = require("serialport").SerialPort;
var io = require('socket.io')();

var serialPort = new SerialPort("/dev/tty.Bluetooth-Incoming-Port");
var async = require('async');

io.set("log level", 0);

io.on('connection', function(socket){
    console.log('Connected');

    var q = async.queue(function (data, callback) {
        serialPort.write(data);

        console.log('PAUSING');
        console.log(data);
        // We pause to wait for the response from the arduino
        q.pause();

        // FAKEIT
        // q.resume();
        // socket.emit('done');

        callback();
    }, 1);

    socket.on('command', function(data){
        console.log('ENQUUEING');
        console.log(data);
        q.push(data);
    });

    serialPort.on('data', function(data) {
        console.log('RESUMING');
        console.log(data);

        q.resume();
        socket.emit('done');
    });

    q.drain = function() {
        console.log('ALLDONE');
        socket.emit('alldone');
    };

    socket.on('disconnect', function(){
        console.log('Disconnected');
    });
});

io.listen(3001);
