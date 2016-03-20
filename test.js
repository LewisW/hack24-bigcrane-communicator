var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();

var io = require('socket.io-client');

describe("Commands", function () {
    var options = {
            transports: ['websocket'],
            'force new connection': true
        };

    it("It runs a command", function (done) {
        var client = io.connect("http://localhost:3001", options);

        client.once("connect", function () {
            client.once("done", function () {
                console.log('DONE');
                client.disconnect();
                done();
            });

            client.emit("command", "up");
        });
    });

    it("It runs commands one at a time", function (done) {
        var client = io.connect("http://localhost:3001", options);
        var expectedCount;

        client.once("connect", function () {
            var doneCount = 0;
            client.on("done", function () {
                doneCount++;
                console.log('Done');
                console.log(doneCount);
                if (doneCount === expectedCount) {
                    client.disconnect();
                    done();
                }
            });

            expectedCount = 5;
            client.emit("command", "up");
            client.emit("command", "left");
            client.emit("command", "down");
            client.emit("command", "grab");
            client.emit("command", "down");
        });
    });
});
