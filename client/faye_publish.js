var faye = require('faye');
var alert = require('alert');
var channel = '/' + process.env.FAYE_CHANNEL
var server = process.env.FAYE_SERVER

alert("Publish configuration: server: " + server + ", channel: " + channel);

var client = new faye.Client(server);

loop();
function loop() {
  var now = new Date();
  client.publish(channel, {
    text: "Now is " + now.toLocaleDateString("ru-RU") + " " + now.toLocaleTimeString("ru-RU")
  });
  setTimeout(loop, 10000);
}